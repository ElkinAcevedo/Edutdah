import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  Plus,
  BellRing,
  Star,
  History,
  Wand2,
  PenLine,
  Bot,
  Lightbulb,
  Users,
  FileText,
  TrendingUp,
  X,
  ChevronRight,
} from 'lucide-react'

import StatCard     from '../components/StatCard'
import StudentCard  from '../components/StudentCard'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — reemplazar con llamadas reales a api.js cuando el backend esté listo
// ─────────────────────────────────────────────────────────────────────────────

const MOCK_STATS = [
  {
    id: 'students',
    icon: Users,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    value: 4,
    label: 'Estudiantes TDAH',
    badge: '+1 hoy',
    trend: 'up',
    progress: 80,
    progressColor: 'bg-violet-500',
  },
  {
    id: 'materials',
    icon: FileText,
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    value: 12,
    label: 'Materiales Adaptados',
    badge: 'Esta semana',
    trend: 'up',
    progress: 60,
    progressColor: 'bg-indigo-500',
  },
  {
    id: 'patterns',
    icon: TrendingUp,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    value: 1,
    label: 'Patrones Detectados',
    badge: 'Nuevo',
    trend: 'neutral',
    progress: 25,
    progressColor: 'bg-amber-400',
  },
]

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'warning',
    emoji: '💡',
    title: 'Patrón detectado en Mateo Gómez',
    body: 'La IA notó que Mateo tiene dificultades los martes a primera hora. Sus niveles de atención caen un 40% en ese horario. Se sugiere revisar su bitácora y considerar una pausa activa antes de comenzar la clase.',
    primaryAction: { label: 'Ver Bitácora', route: '/logbook' },
    secondaryAction: { label: 'Descartar' },
  },
  {
    id: 2,
    type: 'info',
    emoji: null,
    title: 'Sugerencia pedagógica para hoy',
    body: 'Sofía muestra señales de mejora en tareas visuales. Considera asignarle un ejercicio con mapas conceptuales esta tarde.',
    primaryAction: null,
    secondaryAction: null,
  },
]

const MOCK_ACTIVE_STUDENTS = [
  { id: 1, name: 'Mateo Gómez',  initials: 'MG', avatarGradient: 'from-rose-400 to-pink-500',    attention: 55, status: 'warning' },
  { id: 2, name: 'Sofía Vargas', initials: 'SV', avatarGradient: 'from-sky-400 to-blue-500',     attention: 78, status: 'success' },
  { id: 3, name: 'Luca Pérez',   initials: 'LP', avatarGradient: 'from-emerald-400 to-teal-500', attention: 62, status: 'success' },
  { id: 4, name: 'Ale Torres',   initials: 'AT', avatarGradient: 'from-violet-400 to-purple-500', attention: 41, status: 'danger'  },
]

const MOCK_ACTIVITY = [
  { id: 1, icon: Wand2,     iconBg: 'bg-indigo-100',  iconColor: 'text-indigo-500',  label: 'Material adaptado',     time: 'Hace 30 min'   },
  { id: 2, icon: PenLine,   iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500', label: 'Entrada en bitácora',   time: 'Hace 1 hora'   },
  { id: 3, icon: Bot,       iconBg: 'bg-violet-100',  iconColor: 'text-violet-500',  label: 'Consulta al asistente', time: 'Hace 2 horas'  },
  { id: 4, icon: Lightbulb, iconBg: 'bg-amber-100',   iconColor: 'text-amber-500',   label: 'Patrón detectado',      time: 'Ayer, 3:10 pm' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helper — status dot color
// ─────────────────────────────────────────────────────────────────────────────
function statusDot(status) {
  return status === 'success' ? 'bg-emerald-400'
       : status === 'warning' ? 'bg-amber-400'
       : 'bg-red-400'
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (private to this view)
// ─────────────────────────────────────────────────────────────────────────────

/** Alerta IA tipo "warning" — fondo ámbar degradado */
function AlertWarning({ alert, onDismiss }) {
  const navigate = useNavigate()
  return (
    <div
      className="relative rounded-2xl p-5 flex gap-4 items-start"
      style={{ background: 'linear-gradient(135deg,#fffbeb,#fef3c7)', border: '1px solid #fde68a' }}
    >
      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg text-amber-400 hover:text-amber-600 hover:bg-amber-100 transition-all"
        aria-label="Descartar alerta"
      >
        <X size={12} strokeWidth={2} />
      </button>

      {/* Icon */}
      <span className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-lg flex-shrink-0">
        {alert.emoji}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-semibold text-slate-700 text-sm mb-1">{alert.title}</p>
        <p className="text-sm text-slate-600 leading-relaxed">{alert.body}</p>
        {(alert.primaryAction || alert.secondaryAction) && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {alert.primaryAction && (
              <button
                onClick={() => navigate(alert.primaryAction.route)}
                className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                {alert.primaryAction.label} →
              </button>
            )}
            {alert.secondaryAction && (
              <button
                onClick={onDismiss}
                className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                {alert.secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** Alerta IA tipo "info" — tarjeta blanca con borde izquierdo indigo */
function AlertInfo({ alert }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 items-start border border-slate-100 border-l-4 border-l-indigo-400 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
      <span className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
        <Bot size={16} strokeWidth={1.8} className="text-indigo-500" />
      </span>
      <div>
        <p className="font-semibold text-slate-700 text-sm mb-1">{alert.title}</p>
        <p className="text-sm text-slate-500 leading-relaxed">{alert.body}</p>
      </div>
    </div>
  )
}

/** Fila compacta de estudiante activo en el panel lateral */
function ActiveStudentRow({ student, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all duration-150 text-left group"
    >
      <div
        className={`w-8 h-8 rounded-full bg-gradient-to-br ${student.avatarGradient} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm`}
      >
        {student.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 truncate leading-tight">{student.name}</p>
        <p className="text-xs text-slate-400">Atención: {student.attention}% hoy</p>
      </div>
      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot(student.status)}`} />
    </button>
  )
}

/** Item de actividad reciente */
function ActivityItem({ item }) {
  const Icon = item.icon
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}>
        <Icon size={13} strokeWidth={1.8} className={item.iconColor} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-600 truncate">{item.label}</p>
        <p className="text-[11px] text-slate-400">{item.time}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DashboardView
// ─────────────────────────────────────────────────────────────────────────────
export default function DashboardView() {
  const navigate = useNavigate()

  // Alertas descartables localmente
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id))

  // Fecha localizada
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const todayFormatted = today.charAt(0).toUpperCase() + today.slice(1)

  return (
    <div className="space-y-7">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-800 tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ¡Hola, Carlos! 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Aquí tienes el resumen de tu aula hoy ·{' '}
            <span className="text-indigo-600 font-medium">{todayFormatted}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notificaciones */}
          <div className="relative">
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-500 transition-all shadow-sm">
              <Bell size={16} strokeWidth={1.8} />
            </button>
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold shadow-sm">
                {alerts.length}
              </span>
            )}
          </div>

          {/* CTA principal */}
          <button
            onClick={() => navigate('/logbook')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
          >
            <Plus size={14} strokeWidth={2.5} />
            Nueva entrada
          </button>
        </div>
      </header>

      {/* ── STAT CARDS ─────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {MOCK_STATS.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
            value={stat.value}
            label={stat.label}
            badge={stat.badge}
            trend={stat.trend}
            progress={stat.progress}
            progressColor={stat.progressColor}
            onClick={stat.id === 'students' ? () => navigate('/students') : undefined}
          />
        ))}
      </section>

      {/* ── ALERTAS + ESTUDIANTES ACTIVOS ──────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Alertas IA (2/3) */}
        <div className="lg:col-span-2 space-y-3">
          <h2
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <BellRing size={15} strokeWidth={2} className="text-amber-500" />
            Alertas de IA
          </h2>

          {alerts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
              <p className="text-sm text-slate-400">Sin alertas activas · Todo en orden ✅</p>
            </div>
          ) : (
            alerts.map((alert) =>
              alert.type === 'warning' ? (
                <AlertWarning
                  key={alert.id}
                  alert={alert}
                  onDismiss={() => dismissAlert(alert.id)}
                />
              ) : (
                <AlertInfo key={alert.id} alert={alert} />
              )
            )
          )}
        </div>

        {/* Estudiantes activos (1/3) */}
        <div>
          <h2
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <Star size={14} strokeWidth={2} className="text-indigo-500" />
            Estudiantes activos
          </h2>

          <div className="bg-white rounded-2xl border border-slate-100 p-3 shadow-[0_2px_16px_rgba(15,23,42,0.06)] space-y-1">
            {MOCK_ACTIVE_STUDENTS.map((student) => (
              <ActiveStudentRow
                key={student.id}
                student={student}
                onClick={() => navigate('/students')}
              />
            ))}
            <div className="pt-2 mt-1 border-t border-slate-100">
              <button
                onClick={() => navigate('/students')}
                className="w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl transition-all"
              >
                Ver todos los estudiantes
                <ChevronRight size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── ACTIVIDAD RECIENTE ──────────────────────────────────────────────── */}
      <section>
        <h2
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <History size={14} strokeWidth={1.8} className="text-slate-400" />
          Actividad reciente
        </h2>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOCK_ACTIVITY.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
