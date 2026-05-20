import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * StatCard — métrica individual del dashboard
 *
 * Props:
 *  @param {React.ElementType} icon        — ícono Lucide a renderizar
 *  @param {string}            iconBg      — clase Tailwind para fondo del ícono  (ej. "bg-violet-50")
 *  @param {string}            iconColor   — clase Tailwind para color del ícono  (ej. "text-violet-600")
 *  @param {string|number}     value       — valor principal                      (ej. 4, "87%")
 *  @param {string}            label       — etiqueta descriptiva                 (ej. "Estudiantes TDAH")
 *  @param {string}            [badge]     — texto del badge opcional             (ej. "+1 hoy")
 *  @param {'up'|'down'|'neutral'} [trend] — dirección de la tendencia
 *  @param {number}            [progress]  — valor 0-100 para la barra de progreso
 *  @param {string}            [progressColor] — clase Tailwind para el fill     (ej. "bg-violet-500")
 *  @param {function}          [onClick]   — callback opcional al hacer click
 */
export default function StatCard({
  icon: Icon,
  iconBg      = 'bg-slate-100',
  iconColor   = 'text-slate-500',
  value       = '—',
  label       = '',
  badge,
  trend,
  progress,
  progressColor = 'bg-indigo-500',
  onClick,
}) {

  // ── Trend indicator ──────────────────────────────────────────────────────
  const TrendIcon = trend === 'up'
    ? TrendingUp
    : trend === 'down'
      ? TrendingDown
      : Minus

  const trendColor = trend === 'up'
    ? 'text-emerald-500'
    : trend === 'down'
      ? 'text-red-400'
      : 'text-slate-400'

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'bg-white rounded-2xl p-5 border border-slate-100',
        'shadow-[0_2px_16px_rgba(15,23,42,0.06)]',
        'transition-all duration-200',
        onClick
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)] hover:border-indigo-100'
          : '',
      ].join(' ')}
    >
      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between mb-4">
        <span className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {Icon && <Icon size={20} strokeWidth={1.8} className={iconColor} />}
        </span>

        {badge && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-500 border border-slate-100">
            {trend && <TrendIcon size={10} strokeWidth={2.5} className={trendColor} />}
            {badge}
          </span>
        )}
      </div>

      {/* Value */}
      <p
        className="text-3xl font-bold text-slate-800 leading-none tracking-tight mb-1"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {value}
      </p>

      {/* Label */}
      <p className="text-sm text-slate-500 font-medium">{label}</p>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor}`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  )
}
