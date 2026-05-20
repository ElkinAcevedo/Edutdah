import { useState, useMemo } from 'react'
import {
  Search,
  Bot,
  Brain,
  Zap,
  Target,
  Star,
  LayoutList,
  ArrowLeftRight,
  Bookmark,
  BookmarkCheck,
  ListOrdered,
  Plus,
  Sparkle,
} from 'lucide-react'

// ── Static data ───────────────────────────────────────────────────────────────

const FILTERS = [
  { id: 'all',          label: 'Todos',         icon: null           },
  { id: 'atencion',     label: 'Atención',       icon: Target         },
  { id: 'impulsividad', label: 'Impulsividad',   icon: Zap            },
  { id: 'organizacion', label: 'Organización',   icon: LayoutList     },
  { id: 'evaluacion',   label: 'Evaluación',     icon: Star           },
  { id: 'transicion',   label: 'Transiciones',   icon: ArrowLeftRight },
]

const STRATEGIES = [
  {
    id: 1,
    emoji: '🍅',
    emojiStyle: { background: 'linear-gradient(135deg,#fee2e2,#fecaca)' },
    title: 'Pomodoro Visual',
    description:
      'Bloques de trabajo de 10-15 min con temporizador visual en la pizarra. El tiempo reducido y visible ayuda al niño a autorregularse sin intervención constante del docente.',
    categories: ['atencion'],
    badges: [
      { label: 'Atención',  color: 'bg-rose-50 text-rose-600'   },
      { label: 'Tiempo',    color: 'bg-slate-100 text-slate-600' },
    ],
    progress: 92,
    progressGradient: 'from-rose-400 to-rose-500',
    progressLabel: '92% de mejora en atención sostenida',
    progressTextColor: 'text-rose-600',
    aiSuggested: true,
    aiSuggestedFor: 'Mateo',
    usedBy: [
      { initials: 'MG', gradient: 'from-rose-400 to-pink-500'     },
      { initials: 'AT', gradient: 'from-violet-400 to-purple-500' },
    ],
    usedByLabel: 'Mateo y Ale la usan actualmente',
  },
  {
    id: 2,
    emoji: '🪙',
    emojiStyle: { background: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
    title: 'Economía de Fichas',
    description:
      'Sistema de puntos canjeable por actividades preferidas. El estudiante gana fichas por conductas deseadas (terminar tarea, levantar la mano) y las canjea al final del día.',
    categories: ['impulsividad'],
    badges: [
      { label: 'Impulsividad', color: 'bg-amber-50 text-amber-600'   },
      { label: 'Motivación',   color: 'bg-emerald-50 text-emerald-600' },
    ],
    progress: 88,
    progressGradient: 'from-amber-400 to-amber-500',
    progressLabel: '88% de mejora conductual',
    progressTextColor: 'text-amber-600',
  },
  {
    id: 3,
    emoji: '📋',
    emojiStyle: { background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
    title: 'Tablero de Organización',
    description:
      'Kanban visual con tres columnas: "Por hacer", "Haciendo" y "¡Listo! 🎉". El estudiante mueve tarjetas físicas o digitales, lo que brinda sensación de progreso y control.',
    categories: ['organizacion'],
    badges: [
      { label: 'Organización', color: 'bg-emerald-50 text-emerald-600' },
      { label: 'Visual',       color: 'bg-sky-50 text-sky-600'         },
    ],
    chips: ['⏱️ 5 min setup', '📍 Aula y casa'],
  },
  {
    id: 4,
    emoji: '🤸',
    emojiStyle: { background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
    title: 'Pausa Activa Estructurada',
    description:
      'Cada 20 minutos, una pausa de 3 min con movimiento guiado (respiración, saltos, estiramiento). Reduce la energía acumulada y recarga la atención sostenida para la siguiente tarea.',
    categories: ['atencion'],
    badges: [
      { label: 'Atención', color: 'bg-violet-50 text-violet-600' },
      { label: 'Energía',  color: 'bg-orange-50 text-orange-600' },
    ],
    note: 'Respaldado por 12 estudios de neuroeducación',
  },
  {
    id: 5,
    emoji: '🗣️',
    emojiStyle: { background: 'linear-gradient(135deg,#cffafe,#a5f3fc)' },
    title: 'Evaluación Oral Express',
    description:
      'Reemplaza o complementa la prueba escrita con 3-5 preguntas orales al estudiante. Ideal para TDAH inatento que pierde puntos por errores de transcripción, no por falta de conocimiento.',
    categories: ['evaluacion'],
    badges: [
      { label: 'Evaluación', color: 'bg-cyan-50 text-cyan-600'     },
      { label: 'Inclusión',  color: 'bg-indigo-50 text-indigo-600' },
    ],
    progress: 74,
    progressGradient: 'from-cyan-400 to-sky-500',
    progressLabel: '+74% en nota promedio de Sofía',
    progressTextColor: 'text-sky-600',
  },
  {
    id: 6,
    emoji: '🚦',
    emojiStyle: { background: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
    title: 'Transición con Señal Visual',
    description:
      'Uso de una tarjeta de colores (rojo = para, amarillo = termina, verde = cambia). Las señales visuales preparan al estudiante 2 min antes del cambio de actividad, reduciendo la resistencia.',
    categories: ['transicion'],
    badges: [
      { label: 'Transiciones', color: 'bg-pink-50 text-pink-600'   },
      { label: 'Rutinas',      color: 'bg-slate-100 text-slate-600' },
    ],
    trafficLights: true,
  },
]

// ── StrategyCard ──────────────────────────────────────────────────────────────
function StrategyCard({ strategy, saved, onToggleSave }) {
  const {
    emoji, emojiStyle, title, description,
    badges, progress, progressGradient, progressLabel, progressTextColor,
    chips, note, trafficLights, usedBy, usedByLabel, aiSuggested, aiSuggestedFor,
  } = strategy

  return (
    <div
      className={[
        'relative bg-white rounded-2xl border border-slate-100',
        'shadow-[0_2px_16px_rgba(15,23,42,0.06)]',
        'transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(99,102,241,0.13)] hover:border-indigo-100',
        'flex flex-col',
        aiSuggested ? 'pt-5' : '',
      ].join(' ')}
    >

      {/* ── AI suggested floating badge ── */}
      {aiSuggested && (
        <div className="absolute -top-3.5 left-4 z-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white"
            style={{
              background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
              boxShadow: '0 4px 14px rgba(79,70,229,0.4)',
            }}
          >
            <Sparkle size={9} strokeWidth={2.5} />
            ✨ Sugerido por IA para {aiSuggestedFor}
          </span>
        </div>
      )}

      {/* ── Card body ── */}
      <div className="p-5 flex flex-col flex-1 gap-0">

        {/* Top row: emoji icon + badges + bookmark */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={emojiStyle}
          >
            {emoji}
          </div>

          <div className="flex items-start gap-2 ml-2">
            {/* Category badges */}
            <div className="flex gap-1 flex-wrap justify-end max-w-[150px]">
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${b.color}`}
                >
                  {b.label}
                </span>
              ))}
            </div>

            {/* Bookmark toggle */}
            <button
              onClick={onToggleSave}
              className={[
                'w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center transition-all duration-150',
                saved
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50',
              ].join(' ')}
              title={saved ? 'Guardado' : 'Guardar estrategia'}
            >
              {saved
                ? <BookmarkCheck size={13} strokeWidth={2.2} />
                : <Bookmark      size={13} strokeWidth={1.8} />
              }
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-slate-800 text-base mb-1.5 leading-tight"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">
          {description}
        </p>

        {/* ── Variant content ── */}

        {/* A — Progress bar */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="text-xs text-slate-400 mb-1.5">Efectividad reportada</div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-700`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className={`text-xs font-semibold mt-1 ${progressTextColor}`}>
              {progressLabel}
            </p>
          </div>
        )}

        {/* B — Metadata chips */}
        {chips && (
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {chips.map((chip) => (
              <span
                key={chip}
                className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* C — Neuroscience note */}
        {note && (
          <div className="flex items-center gap-2 mb-4">
            <Brain size={12} strokeWidth={1.8} className="text-indigo-400 flex-shrink-0" />
            <span className="text-xs text-slate-500">{note}</span>
          </div>
        )}

        {/* D — Traffic light dots */}
        {trafficLights && (
          <div className="flex items-center gap-2 mb-4">
            <span className="w-5 h-5 rounded-full bg-red-400 border-2 border-white shadow-sm" />
            <span className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-sm" />
            <span className="w-5 h-5 rounded-full bg-emerald-400 border-2 border-white shadow-sm" />
            <span className="text-xs text-slate-500 ml-1">Sistema de 3 señales</span>
          </div>
        )}

        {/* E — Used-by avatars */}
        {usedBy && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex -space-x-1">
              {usedBy.map((u) => (
                <div
                  key={u.initials}
                  className={`w-5 h-5 rounded-full bg-gradient-to-br ${u.gradient} border-2 border-white flex-shrink-0`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">{usedByLabel}</span>
          </div>
        )}

        {/* Action button */}
        <button className="w-full py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-all duration-150 flex items-center justify-center gap-1.5">
          <ListOrdered size={12} strokeWidth={2} />
          Ver paso a paso
        </button>
      </div>
    </div>
  )
}

// ── Main view ─────────────────────────────────────────────────────────────────
export default function BankView() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery,  setSearchQuery]  = useState('')
  const [saved,        setSaved]        = useState(new Set())

  // ── Derived list ───────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return STRATEGIES.filter((s) => {
      const matchesFilter =
        activeFilter === 'all' || s.categories.includes(activeFilter)
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.badges.some((b) => b.label.toLowerCase().includes(q))
      return matchesFilter && matchesSearch
    })
  }, [activeFilter, searchQuery])

  function toggleSave(id) {
    setSaved((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>

      {/* ── Page header ── */}
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1
              className="text-2xl font-bold text-slate-800"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Banco Dinámico de Estrategias
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Estrategias pedagógicas basadas en evidencia para estudiantes con TDAH
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Bot size={10} strokeWidth={2} />
              IA activa
            </span>
            <span className="text-xs text-slate-400">
              {STRATEGIES.length} estrategias disponibles
            </span>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="mb-5">
        <div className="relative max-w-2xl">
          <Search
            size={16}
            strokeWidth={1.8}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar estrategia por nombre, categoría o descripción…"
            className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map(({ id, label, icon: Icon }) => {
          const isActive = activeFilter === id
          return (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={[
                'inline-flex items-center gap-1.5 px-[18px] py-[7px] rounded-full text-[13px] font-semibold',
                'cursor-pointer transition-all duration-200 border-[1.5px]',
                isActive
                  ? 'border-indigo-600 text-white shadow-md'
                  : 'border-slate-200 text-slate-600 bg-white hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50',
              ].join(' ')}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
                      boxShadow: '0 4px 12px rgba(79,70,229,0.25)',
                    }
                  : {}
              }
            >
              {Icon && <Icon size={12} strokeWidth={2} />}
              {label}
            </button>
          )
        })}
      </div>

      {/* ── Strategy grid ── */}
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {visible.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              saved={saved.has(strategy.id)}
              onToggleSave={() => toggleSave(strategy.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Search size={22} strokeWidth={1.6} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700 text-sm mb-1">
            Sin resultados
          </p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            No se encontraron estrategias para{' '}
            <strong className="text-slate-500">"{searchQuery}"</strong>.
            Intenta con otro término o limpia los filtros.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveFilter('all') }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* ── Load more ── */}
      {visible.length > 0 && (
        <div className="mt-6 text-center">
          <button className="px-6 py-3 rounded-2xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm flex items-center gap-2 mx-auto">
            <Plus size={13} strokeWidth={2.2} />
            Cargar más estrategias (18 restantes)
          </button>
        </div>
      )}

    </div>
  )
}
