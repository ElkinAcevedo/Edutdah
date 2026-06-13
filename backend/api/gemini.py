import json
from google import genai
from google.genai import types
from django.conf import settings
from collections import defaultdict

from .models import EntradaBitacora, AnalisisBitacora

def _preprocesar_entradas(entradas):
    """Convierte las entradas en datos agregados para el prompt."""
    DIAS = {0:'Lunes',1:'Martes',2:'Miércoles',3:'Jueves',4:'Viernes',5:'Sábado',6:'Domingo'}

    por_dia        = defaultdict(list)
    por_categoria  = defaultdict(int)
    atenciones     = []

    for e in entradas:
        dia = DIAS[e.creado_en.weekday()]
        por_dia[dia].append(e.puntaje_atencion)
        por_categoria[e.categoria] += 1
        if e.puntaje_atencion > 0:
            atenciones.append(e.puntaje_atencion)

    promedio_por_dia = {
        dia: round(sum(vals) / len(vals), 1)
        for dia, vals in por_dia.items()
    }

    return {
        'total_entradas':   len(entradas),
        'promedio_atencion': round(sum(atenciones) / len(atenciones), 1) if atenciones else 0,
        'por_categoria':    dict(por_categoria),
        'promedio_por_dia': promedio_por_dia,
        'titulos':          [e.titulo for e in entradas[:10]],  # máx 10 para no exceder tokens
    }


def _construir_prompt(nombre_estudiante, datos):
    return f"""
Eres un asistente pedagógico especializado en estudiantes con TDAH.
Analiza los siguientes datos de observación del estudiante {nombre_estudiante} y responde SOLO con un objeto JSON válido, sin texto adicional, sin bloques de código markdown.

DATOS:
- Total de entradas registradas: {datos['total_entradas']}
- Promedio general de atención: {datos['promedio_atencion']}%
- Entradas por categoría: {json.dumps(datos['por_categoria'], ensure_ascii=False)}
- Promedio de atención por día de la semana: {json.dumps(datos['promedio_por_dia'], ensure_ascii=False)}
- Títulos de observaciones recientes: {json.dumps(datos['titulos'], ensure_ascii=False)}

Responde ÚNICAMENTE con este JSON (sin markdown, sin texto extra):
{{
  "resumen": "2-3 frases describiendo la tendencia general del estudiante",
  "patron": "1-2 frases describiendo el patrón más relevante detectado en los datos",
  "sugerencia": "1 recomendación pedagógica concreta y accionable para el docente"
}}
"""


def generar_o_recuperar_analisis(estudiante):
    """
    Devuelve el análisis guardado si los datos no cambiaron.
    Si cambiaron, llama a Gemini, sobreescribe y devuelve el nuevo.
    """
    entradas = list(
        EntradaBitacora.objects.filter(estudiante=estudiante).order_by('creado_en')
    )

    UMBRAL_MINIMO = 3
    if len(entradas) < UMBRAL_MINIMO:
        return {
            'insuficiente': True,
            'mensaje': f'Se necesitan al menos {UMBRAL_MINIMO} entradas para generar un análisis. '
                       f'Actualmente hay {len(entradas)}.'
        }

    hash_actual = AnalisisBitacora.calcular_hash(entradas)

    # Si ya existe y el hash no cambió, devuelve el guardado
    try:
        analisis = AnalisisBitacora.objects.get(estudiante=estudiante)
        if analisis.entradas_hash == hash_actual:
            return {
                'insuficiente': False,
                'resumen':      analisis.resumen,
                'patron':       analisis.patron,
                'sugerencia':   analisis.sugerencia,
                'generado_en':  analisis.generado_en.isoformat(),
                'cached':       True,
            }
    except AnalisisBitacora.DoesNotExist:
        analisis = None

    # Llama a Gemini
    datos  = _preprocesar_entradas(entradas)
    prompt = _construir_prompt(estudiante.nombre, datos)
    client   = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=prompt,
    )
    texto = response.text.strip()

    # Limpia posibles bloques markdown que Gemini agregue
    if texto.startswith('```'):
        texto = texto.split('```')[1]
        if texto.startswith('json'):
            texto = texto[4:]
    texto = texto.strip()

    resultado = json.loads(texto)

    # Guarda o sobreescribe
    AnalisisBitacora.objects.update_or_create(
        estudiante=estudiante,
        defaults={
            'resumen':       resultado['resumen'],
            'patron':        resultado['patron'],
            'sugerencia':    resultado['sugerencia'],
            'entradas_hash': hash_actual,
        }
    )

    return {
        'insuficiente': False,
        'resumen':      resultado['resumen'],
        'patron':       resultado['patron'],
        'sugerencia':   resultado['sugerencia'],
        'cached':       False,
    }


def chat_asistente(estudiante, mensaje, historial):
    """
    Genera una respuesta del asistente pedagógico con contexto completo.
    historial: lista de {role: 'user'|'ai', text: str}
    """
    # Contexto del estudiante
    entradas = list(
        EntradaBitacora.objects.filter(estudiante=estudiante).order_by('-creado_en')[:10]
    )

    entradas_texto = '\n'.join(
        f"- [{e.categoria}] {e.titulo}: {e.descripcion[:120]}"
        for e in entradas
    ) or 'Sin entradas registradas aún.'

    # Análisis guardado si existe
    try:
        analisis = estudiante.analisis
        analisis_texto = f"Resumen: {analisis.resumen}\nPatrón: {analisis.patron}\nSugerencia previa: {analisis.sugerencia}"
    except Exception:
        analisis_texto = 'Sin análisis generado aún.'

    # Historial de conversación
    historial_texto = ''
    for msg in historial[-10:]:  # máx últimos 10 mensajes
        rol = 'Docente' if msg['role'] == 'user' else 'Asistente'
        historial_texto += f"{rol}: {msg['text']}\n"

    system_prompt = f"""Eres EduIA, un asistente pedagógico especializado en estudiantes con TDAH.
Respondes en español, con tono cálido, profesional y práctico.
Tus respuestas son concretas, accionables y basadas en el perfil real del estudiante.
Nunca inventas datos — solo usas la información provista.
Máximo 200 palabras por respuesta.
No te presentes ni saludes al inicio de cada respuesta — ve directo al punto con la respuesta.
PERFIL DEL ESTUDIANTE:
- Nombre: {estudiante.nombre}
- Tipo TDAH: {estudiante.tipo_tdah}
- Edad: {estudiante.edad} años
- Grado: {estudiante.grado}
- Atención promedio: {estudiante.atencion_promedio}%
- Participación: {estudiante.puntaje_participacion}/10
- Fortalezas: {', '.join(estudiante.fortalezas) if estudiante.fortalezas else 'No registradas'}

ENTRADAS RECIENTES DE BITÁCORA:
{entradas_texto}

ANÁLISIS IA PREVIO:
{analisis_texto}

HISTORIAL DE CONVERSACIÓN:
{historial_texto}
"""

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=f"{system_prompt}\n\nDocente: {mensaje}\nAsistente:",
    )

    return response.text.strip()
