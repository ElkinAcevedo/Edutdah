import { useState, useMemo } from 'react'
import {
  Plus,
  Clock,
  Brain,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Star,
  StickyNote,
  CheckCircle2,
  X,
  CalendarDays,
  BarChart3,
  Lightbulb,
  PenLine,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — reemplazar con api.get('/logbook/?student=:id') cuando el backend esté listo
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  { id: 1, name: 'Mateo Gómez',  initials: 'MG', avatarGradient: 'from-rose-400 to-pink-500'    },
  { id: 2, name: 'Sofía Vargas', initials: 'SV', avatarGradient: 'from-sky-400 to-blue-500'     },
  { id: 3, name: 'Luca Pérez',   initials: 'LP', avatarGradient: 'from-emerald-400 to-teal-500' },
  { id: 4, name: 'Ale Torres',   initials: 'AT', avatarGradient: 'from-violet-400 to-purple-500' },
]

// type: 'alert' | 'positive' | 'note'
const MOCK_ENTRIES = [
  {
    id: 1,
    studentId: 1,
    type: 'alert',
    title: 'Inquieto en Ciencias Naturales',
    body: 'Mateo estuvo muy inquieto durante la clase de ciencias. Se levantó 4 veces y tuvo dificultad para mantener contacto visual con la actividad.',
    badge: 'Alta agitación',
    date: 'Hoy',
    time: '10:15 am',
  },
  {
    id: 2,
    studentId: 1,
    type: 'positive',
    title: 'Excelente rendimiento en Arte',
    body: 'Completó el mural de forma concentrada durante 35 minutos sin interrupciones. Mostró gran orgullo por su trabajo.',
    badge: 'Logro positivo',
    date: 'Ayer',
    time: '3:00 pm',
  },
  {
    id: 3,
    studentId: 1,
    type: 'note',
    title: 'Dificultad en lectura matutina',
    body: 'No logró terminar la lectura asignada. Se distrajo con el compañero de al lado. Se recomendó separarlo de la ventana.',
    badge: 'Ajuste de entorno',
    date: 'Lunes',
    time: '9:30 am',
  },
  {
    id: 4,
    studentId: 1,
    type: 'positive',
    title: 'Participación activa en Matemáticas',
    body: 'Respondió correctamente 5 de 6 ejercicios en la pizarra. Mostró seguridad y buen estado de ánimo toda la mañana.',
    badge: 'Logro positivo',
    date: 'Viernes',
    time: '11:00 am',
  },
  {
    id: 5,
    studentId: 1,
    type: 'alert',
    title: 'Conflicto con compañero',
    body: 'Empujó a un compañero durante el recreo. Se realizó mediación. Se notificó a orientación escolar.',
    badge: 'Conducta disruptiva',
    date: 'Jue',
    time: '12:45 pm',
  },
]

const MOCK_ATTENTION_DAYS = [
  { day: 'Lun', value: 72, color: 'from-emerald-400 to-emerald-500', textColor: 'text-emerald-700', warning: false },
  { day: 'Mar', value: 38, color: 'from-red-400 to-red-500',         textColor: 'text-red-600',     warning: true  },
  { day: 'Mié', value: 65, color: 'from-emerald-400 to-teal-500',    textColor: 'text-teal-700',    warning: false },
  { day: 'Jue', value: 42, color: 'from-amber-400 to-orange-500',    textColor: 'text-amber-700',   warning: true  },
  { day: 'Vie', value: 80, color: 'from-indigo-400 to-violet-500',   textColor: 'text-indigo-700',  warning: false },
]

const TOTAL_ENTRIES = 14

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function entryMeta(type) {
  switch (type) {
    case 'alert':
      return {
        Icon: AlertCircle,
        dotBg: 'bg-amber-400',
        dotRing: 'ring-amber-100',
        badgeBg: 'bg-amber-50 text-amber-600 border-amber-100',
      }
    case 'positive':
      return {
        Icon: Star,
        dotBg: 'bg-emerald-400',
        dotRing: 'ring-emerald-100',
        badgeBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      }
    default:
      return {
        Icon: StickyNote,
        dotBg: 'bg-slate-400',
        dotRing: 'ring-slate-100',
        badgeBg: 'bg-slate-100 text-slate-600 border-slate-200',
      }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

/** Entrada de timeline */
function TimelineEntry({ entry, isLast }) {
  const { Icon, dotBg, dotRing, badgeBg } = entryMeta(entry.type)

  return (
    <div className="flex gap-4">
      {/* Dot + línea */}
      <div className="flex flex-col items-center flex-shrink-0">
        <span className={`w-8 h-8 rounded-xl ${dotBg} ring-4 ${dotRing} flex items-center justify-center flex-shrink-0 shadow-sm`}>
          <Icon size={13} strokeWidth={2} className="text-white" />
        </span>
        {!isLast && <div className="w-px flex-1 bg-slate-100 mt-2" />}
      </div>

      {/* Contenido */}
      <div className={`min-w-0 flex-1 ${!isLast ? 'pb-5' : ''}`}>
        <p className="text-[11px] text-slate-400 mb-1">
          {entry.date} · {entry.time}
        </p>
        <p className="text-sm font-semibold text-slate-700 leading-snug mb-1">
          {entry.title}
        </p>
        <p className="text-sm text-slate-500 leading-relaxed mb-2">
          {entry.body}
        </p>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${badgeBg}`}>
          {entry.badge}
        </span>
      </div>
    </div>
  )
}

/** Barra del gráfico de atención por día */
function AttentionBar({ day, value, color, textColor, warning }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-500 w-8 text-right flex-shrink-0">{day}</span>
      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-14 flex-shrink-0 ${textColor}`}>
        {value}%{warning ? ' ⚠️' : ''}
      </span>
    </div>
  )
}

/** Modal nueva entrada */
function NewEntryModal({ students, defaultStudentId, onClose }) {
  const [type, setType] = useState('note')

  const TYPES = [
    { value: 'positive', label: '⭐ Logro positivo',      ring: 'ring-emerald-300 bg-emerald-50 text-emerald-700' },
    { value: 'alert',    label: '⚠️ Alerta / conducta',  ring: 'ring-amber-300 bg-amber-50 text-amber-700'       },
    { value: 'note',     label: '📝 Nota general',        ring: 'ring-slate-300 bg-slate-100 text-slate-700'      },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className="text-lg font-bold text-slate-800"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Nueva entrada
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Registro de observación</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Estudiante */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Estudiante</label>
            <div className="relative">
              <select
                defaultValue={defaultStudentId}
                className="w-full appearance-none text-sm border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-slate-700 bg-slate-50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Tipo de entrada */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Tipo de observación</label>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={[
                    'px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all',
                    type === t.value
                      ? `ring-2 ${t.ring} border-transparent`
                      : 'border-slate-200 text-slate-500 bg-white hover:bg-slate-50',
                  ].join(' ')}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Título</label>
            <input
              type="text"
              placeholder="Ej: Dificultad en lectura matutina"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
            />
          </div>

          {/* Observación */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Observación detallada</label>
            <textarea
              rows={4}
              placeholder="Describe lo que ocurrió, el contexto, la reacción del estudiante y cualquier acción tomada..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none resize-none"
            />
          </div>

          {/* Materia */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Materia / contexto</label>
            <input
              type="text"
              placeholder="Ej: Matemáticas, recreo, lectura silenciosa…"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
          >
            <CheckCircle2 size={14} strokeWidth={2} />
            Guardar entrada
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LogbookView
// ─────────────────────────────────────────────────────────────────────────────
export default function LogbookView() {
  const [selectedId,  setSelectedId]  = useState(1)
  const [showModal,   setShowModal]   = useState(false)
  const [showAll,     setShowAll]     = useState(false)

  const student = MOCK_STUDENTS.find((s) => s.id === selectedId)

  // Filtrar entradas del estudiante activo
  const entries = useMemo(
    () => MOCK_ENTRIES.filter((e) => e.studentId === selectedId),
    [selectedId]
  )
  const visibleEntries = showAll ? entries : entries.slice(0, 3)

  return (
    <>
      <div className="space-y-6">

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-slate-800 tracking-tight"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Bitácora y Análisis IA
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Registro de observaciones y patrones de comportamiento
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Selector de estudiante */}
            <div className="relative">
              <select
                value={selectedId}
                onChange={(e) => { setSelectedId(Number(e.target.value)); setShowAll(false) }}
                className="appearance-none text-sm border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-slate-700 bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none shadow-sm transition-all"
              >
                {MOCK_STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Nueva entrada */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
            >
              <Plus size={14} strokeWidth={2.5} />
              Nueva entrada
            </button>
          </div>
        </header>

        {/* ── CUERPO: TIMELINE + ANÁLISIS IA ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Timeline (2/5) */}
          <div className="lg:col-span-2">
            <h2
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Clock size={14} strokeWidth={1.8} className="text-slate-400" />
              Observaciones recientes
            </h2>

            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">

              {entries.length === 0 ? (
                <div className="flex flex-col items-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                    <PenLine size={20} strokeWidth={1.5} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Sin entradas registradas</p>
                  <p className="text-xs text-slate-400 text-center">Agrega la primera observación para este estudiante.</p>
                </div>
              ) : (
                <>
                  <div>
                    {visibleEntries.map((entry, idx) => (
                      <TimelineEntry
                        key={entry.id}
                        entry={entry}
                        isLast={idx === visibleEntries.length - 1 && (showAll || entries.length <= 3)}
                      />
                    ))}
                  </div>

                  {/* Ver más / menos */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setShowAll((v) => !v)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all"
                    >
                      {showAll
                        ? 'Mostrar menos'
                        : `Ver todas las entradas (${TOTAL_ENTRIES}) →`}
                      <ChevronRight
                        size={12}
                        strokeWidth={2.5}
                        className={`transition-transform ${showAll ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Análisis IA (3/5) */}
          <div className="lg:col-span-3">
            <h2
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <Brain size={14} strokeWidth={1.8} className="text-indigo-500" />
              Análisis de patrones de IA
            </h2>

            {/* Card análisis */}
            <div
              className="rounded-2xl p-5 mb-4 shadow-[0_2px_16px_rgba(99,102,241,0.1)]"
              style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)', border: '1.5px solid #c7d2fe' }}
            >
              {/* Cabecera del análisis */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🧠</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-slate-800"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Análisis de Patrones · {student.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Basado en {TOTAL_ENTRIES} entradas · Últimas 3 semanas
                  </p>
                </div>
                <span className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  87% confianza
                </span>
              </div>

              {/* Gráfico por días */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={13} strokeWidth={2} className="text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    Nivel de atención por días (promedio)
                  </p>
                </div>
                <div className="space-y-2.5">
                  {MOCK_ATTENTION_DAYS.map((d) => (
                    <AttentionBar key={d.day} {...d} />
                  ))}
                </div>
              </div>

              {/* Patrón detectado */}
              <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={13} strokeWidth={2} className="text-indigo-500" />
                  <p className="text-xs font-semibold text-slate-700">Patrón detectado</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  La <strong className="text-slate-800">inatención aumenta los días martes y jueves</strong>.
                  Esto coincide con las sesiones de mayor carga teórica. Los viernes presenta el mejor
                  desempeño, posiblemente por el formato de actividades más dinámicas.
                </p>

                {/* Sugerencia IA */}
                <div
                  className="p-3 rounded-xl flex items-start gap-2.5"
                  style={{ background: '#eef2ff', border: '1px solid #c7d2fe' }}
                >
                  <Lightbulb size={14} strokeWidth={2} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    <strong>Sugerencia IA:</strong> Implementar{' '}
                    <em>pausas activas cada 20 min</em> los martes y jueves. Rotar el asiento de{' '}
                    {student.name.split(' ')[0]} cerca del pizarrón esos días para aumentar el foco.
                  </p>
                </div>
              </div>
            </div>

            {/* Mini stats de la bitácora */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: Star,
                  iconBg: 'bg-emerald-50',
                  iconColor: 'text-emerald-500',
                  value: entries.filter((e) => e.type === 'positive').length,
                  label: 'Logros registrados',
                },
                {
                  icon: AlertCircle,
                  iconBg: 'bg-amber-50',
                  iconColor: 'text-amber-500',
                  value: entries.filter((e) => e.type === 'alert').length,
                  label: 'Alertas registradas',
                },
                {
                  icon: StickyNote,
                  iconBg: 'bg-slate-100',
                  iconColor: 'text-slate-500',
                  value: entries.filter((e) => e.type === 'note').length,
                  label: 'Notas generales',
                },
              ].map(({ icon: Icon, iconBg, iconColor, value, label }) => (
                <div
                  key={label}
                  className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_12px_rgba(15,23,42,0.05)] flex flex-col items-center text-center"
                >
                  <span className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center mb-2`}>
                    <Icon size={15} strokeWidth={1.8} className={iconColor} />
                  </span>
                  <p
                    className="text-2xl font-bold text-slate-800 leading-none"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      {showModal && (
        <NewEntryModal
          students={MOCK_STUDENTS}
          defaultStudentId={selectedId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
