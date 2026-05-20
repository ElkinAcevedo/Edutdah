import { useState } from 'react'
import {
  Sliders,
  FileCheck,
  Copy,
  Printer,
  Download,
  Key,
  ListOrdered,
  Star,
  Wand2,
  Brain,
  Lightbulb,
  ChevronDown,
  Check,
} from 'lucide-react'

// ── Static data ───────────────────────────────────────────────────────────────
const MATERIAL_TYPES = [
  '📚 Lectura corta',
  '✏️ Actividad práctica',
  '📝 Mini evaluación',
  '🗺️ Mapa conceptual',
  '🎮 Juego de repaso',
]

const PROFILES = [
  'TDAH Combinado (Mateo Gómez)',
  'TDAH Inatento (Sofía Vargas)',
  'TDAH Hiperactivo (Luca Pérez)',
  'TDAH Combinado (Ale Torres)',
  'General para el grupo',
]

const DIFFICULTIES = [
  { id: 'basico',     label: 'Básico'      },
  { id: 'intermedio', label: 'Intermedio'  },
  { id: 'avanzado',  label: 'Avanzado'    },
]

const EXTRA_OPTIONS = [
  { id: 'emojis',   label: 'Incluir emojis de apoyo visual',   defaultVal: true  },
  { id: 'steps',    label: 'Segmentar en pasos numerados',      defaultVal: true  },
  { id: 'selfeval', label: 'Añadir sección de autoevaluación', defaultVal: false },
]

const KEYWORDS = [
  { emoji: '🔢', word: 'Fracción',      color: 'bg-violet-100 text-violet-700 border-violet-200'   },
  { emoji: '⬆️', word: 'Numerador',     color: 'bg-sky-100 text-sky-700 border-sky-200'            },
  { emoji: '⬇️', word: 'Denominador',   color: 'bg-emerald-100 text-emerald-700 border-emerald-200'},
  { emoji: '🍕', word: 'Parte del todo',color: 'bg-rose-100 text-rose-700 border-rose-200'         },
  { emoji: '✂️', word: 'Dividir',       color: 'bg-amber-100 text-amber-700 border-amber-200'      },
]

// ── Reusable styled select ────────────────────────────────────────────────────
function StyledSelect({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={2}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function AdapterView() {
  const [topic,        setTopic]        = useState('Las fracciones y sus partes')
  const [materialType, setMaterialType] = useState(MATERIAL_TYPES[1])   // Actividad práctica
  const [profile,      setProfile]      = useState(PROFILES[0])
  const [difficulty,   setDifficulty]   = useState('intermedio')
  const [options,      setOptions]      = useState({ emojis: true, steps: true, selfeval: false })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated,    setGenerated]    = useState(true)   // preview shown on load
  const [copied,       setCopied]       = useState(false)

  // ── Handlers ───────────────────────────────────────────────────────────────
  function handleGenerate() {
    if (isGenerating) return
    setIsGenerating(true)
    setGenerated(false)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerated(true)
    }, 1900)
  }

  function handleCopy() {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggleOption(id) {
    setOptions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Page header ── */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-slate-800"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Generador de Material con IA
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Crea actividades y lecturas personalizadas para cada perfil TDAH en segundos
        </p>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

        {/* ════════════════ LEFT — Config (2/5) ════════════════ */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Config card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(15,23,42,0.06)] p-6 flex flex-col gap-5">

            {/* Card header */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
                <Sliders size={15} strokeWidth={2} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Configuración del material</p>
                <p className="text-xs text-slate-400">Personaliza antes de generar</p>
              </div>
            </div>

            {/* Tema curricular */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                📖 Tema curricular
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ej: La célula, La Revolución Francesa…"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
            </div>

            {/* Tipo de material */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                📄 Tipo de material
              </label>
              <StyledSelect
                value={materialType}
                onChange={setMaterialType}
                options={MATERIAL_TYPES}
              />
            </div>

            {/* Perfil TDAH */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                🧠 Adaptar al perfil
              </label>
              <StyledSelect
                value={profile}
                onChange={setProfile}
                options={PROFILES}
              />
            </div>

            {/* Nivel de dificultad */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                ⚡ Nivel de dificultad
              </label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(({ id, label }) => {
                  const isActive = difficulty === id
                  return (
                    <button
                      key={id}
                      onClick={() => setDifficulty(id)}
                      className={[
                        'flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all duration-150',
                        isActive
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700',
                      ].join(' ')}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Opciones extra */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                🎨 Opciones extra
              </label>
              <div className="space-y-2">
                {EXTRA_OPTIONS.map(({ id, label }) => (
                  <label
                    key={id}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={options[id]}
                      onChange={() => toggleOption(id)}
                      className="w-4 h-4 rounded accent-indigo-600"
                    />
                    <span className="text-xs text-slate-600">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={[
                'w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300',
                isGenerating ? 'opacity-80 cursor-not-allowed' : 'hover:brightness-110',
              ].join(' ')}
              style={{
                background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 50%,#6366f1 100%)',
                boxShadow: '0 6px 24px rgba(79,70,229,0.35)',
              }}
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Generando…
                </>
              ) : (
                <>
                  <Wand2 size={14} strokeWidth={2} />
                  ✨ Generar Material
                </>
              )}
            </button>
          </div>

          {/* IA tip card */}
          <div
            className="rounded-2xl p-4 border border-emerald-200"
            style={{ background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={13} strokeWidth={2} className="text-emerald-500" />
              <p className="text-xs font-semibold text-emerald-700">Tip de IA</p>
            </div>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Para TDAH Combinado, los materiales con{' '}
              <strong>3 pasos visuales claros</strong> y un emoji al inicio de
              cada sección aumentan la comprensión lectora hasta un{' '}
              <strong>40%</strong>.
            </p>
          </div>
        </div>

        {/* ════════════════ RIGHT — Print preview (3/5) ════════════════ */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(15,23,42,0.06)] flex flex-col overflow-hidden">

            {/* Preview toolbar */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
              <div>
                <p className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                  <FileCheck size={14} strokeWidth={2} className="text-emerald-500" />
                  Vista previa del material
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Generado · Optimizado para TDAH Combinado
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className={[
                    'text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5',
                    copied
                      ? 'text-emerald-600 bg-emerald-50 border border-emerald-200'
                      : 'text-slate-600 bg-slate-100 hover:bg-slate-200',
                  ].join(' ')}
                >
                  {copied
                    ? <><Check size={11} strokeWidth={2.5} /> Copiado</>
                    : <><Copy size={11} strokeWidth={2} /> Copiar</>}
                </button>

                <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                  <Printer size={11} strokeWidth={2} /> Imprimir
                </button>

                <button className="text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                  <Download size={11} strokeWidth={2} /> PDF
                </button>
              </div>
            </div>

            {/* ── Material output ── */}
            <div
              className="flex-1 overflow-y-auto p-7 space-y-5 text-slate-700"
              style={{ maxHeight: 'calc(100vh - 240px)' }}
            >

              {/* Title block */}
              <div className="text-center pb-5 border-b-2 border-dashed border-slate-200">
                <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-600 mb-3">
                  <Star size={10} strokeWidth={2.5} />
                  Para: Mateo Gómez · 3er Grado · TDAH Combinado
                </div>
                <h2
                  className="text-2xl font-extrabold text-slate-800 leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  🍕 Las Fracciones<br />
                  <span className="text-indigo-600">y Sus Partes</span>
                </h2>
                <p className="text-slate-500 text-sm mt-2">
                  Actividad práctica · Nivel Intermedio · ~15 min
                </p>
              </div>

              {/* Intro */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-sm leading-relaxed">
                  🎯{' '}
                  <strong className="text-amber-800">¿Qué vamos a hacer hoy?</strong>
                  <br />
                  Aprenderemos qué es una fracción usando cosas que ya conoces:{' '}
                  <strong className="text-amber-700">
                    pizzas, barras de chocolate y figuras de colores.
                  </strong>{' '}
                  ¡Es más fácil de lo que parece!
                </p>
              </div>

              {/* Keywords */}
              <div>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Key size={11} strokeWidth={2} className="text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Palabras clave de hoy
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {KEYWORDS.map(({ emoji, word, color }) => (
                    <span
                      key={word}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${color}`}
                    >
                      {emoji} {word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <ListOrdered size={11} strokeWidth={2} className="text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Pasos a seguir
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-sm shadow-indigo-300">
                      1
                    </div>
                    <div className="text-sm">
                      <strong className="text-indigo-800">
                        Lee el ejemplo con atención 👀
                      </strong>
                      <br />
                      <span className="text-slate-600">
                        Una pizza tiene <strong>8 pedazos</strong>. Si te comes 3, tomaste{' '}
                        <strong className="text-indigo-600">3/8</strong> de la pizza. El número
                        de abajo (8) es el total. El de arriba (3) es tu parte.
                      </span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0 shadow-sm shadow-emerald-200">
                      2
                    </div>
                    <div className="text-sm">
                      <strong className="text-emerald-800">
                        Dibuja tu propia fracción ✏️
                      </strong>
                      <br />
                      <span className="text-slate-600">
                        En el espacio de abajo, dibuja una barra de chocolate de{' '}
                        <strong>4 partes</strong>. Colorea <strong>2 partes</strong>.
                        ¿Qué fracción coloreaste? Escríbela: ___/___
                      </span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div
                    className="flex items-start gap-3 p-4 rounded-2xl border"
                    style={{ background: '#fdf4ff', borderColor: '#e9d5ff' }}
                  >
                    <div
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-extrabold text-xs flex-shrink-0"
                      style={{ background: '#7c3aed', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }}
                    >
                      3
                    </div>
                    <div className="text-sm flex-1">
                      <strong className="text-violet-800">
                        ¡Ahora tú! Resuelve estos 3 ejercicios 🚀
                      </strong>
                      <br />
                      <span className="text-slate-600">
                        Escribe la fracción que representa la parte sombreada en cada figura.
                      </span>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[
                          { label: 'Figura A', val: '___/4' },
                          { label: 'Figura B', val: '2/___' },
                          { label: 'Figura C', val: '___/___' },
                        ].map(({ label, val }) => (
                          <div
                            key={label}
                            className="p-2.5 rounded-xl bg-white border border-violet-200 text-center"
                          >
                            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                            <p className="font-mono text-lg font-bold text-violet-500">{val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recuerda block */}
              <div
                className="p-4 rounded-2xl flex items-start gap-3 border"
                style={{
                  background: 'linear-gradient(135deg,#fef3c7,rgba(253,230,138,0.12))',
                  borderColor: '#fde68a',
                }}
              >
                <span className="text-2xl flex-shrink-0">⭐</span>
                <div>
                  <p className="font-semibold text-amber-800 text-sm mb-1">
                    ¡Recuerda siempre!
                  </p>
                  <p className="text-sm text-amber-700">
                    La fracción tiene <strong>dos partes</strong>: el número de{' '}
                    <strong>ARRIBA</strong> (lo que tienes) y el número de{' '}
                    <strong>ABAJO</strong> (el total). ¡Nunca se olvida si piensas en pizza! 🍕
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Brain size={11} strokeWidth={1.8} className="text-indigo-300" />
                  Generado por EduIA TDAH ·{' '}
                  {new Date().toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-[11px] text-slate-400">
                  Prof. Carlos Ruiz · 3ro B
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
