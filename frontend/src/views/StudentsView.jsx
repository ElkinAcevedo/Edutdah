import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, Users, AlertCircle, CheckCircle, X } from 'lucide-react'
import StudentCard from '../components/StudentCard'

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — reemplazar con api.get('/students/') cuando el backend esté listo
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_STUDENTS = [
  {
    id: 1,
    name: 'Mateo Gómez',
    initials: 'MG',
    avatarGradient: 'from-rose-400 to-pink-500',
    type: 'TDAH Combinado',
    age: 8,
    grade: '3ro B',
    attention: 55,
    participation: 6,
    alerts: 3,
    strengths: ['Visual', 'Creativo', 'Alta energía'],
  },
  {
    id: 2,
    name: 'Sofía Vargas',
    initials: 'SV',
    avatarGradient: 'from-sky-400 to-blue-500',
    type: 'TDAH Inatento',
    age: 9,
    grade: '3ro B',
    attention: 78,
    participation: 8,
    alerts: 1,
    strengths: ['Visual', 'Artística'],
  },
  {
    id: 3,
    name: 'Luca Pérez',
    initials: 'LP',
    avatarGradient: 'from-emerald-400 to-teal-500',
    type: 'TDAH Hiperactivo',
    age: 8,
    grade: '3ro B',
    attention: 62,
    participation: 7,
    alerts: 0,
    strengths: ['Kinestésico', 'Matemático'],
  },
  {
    id: 4,
    name: 'Ale Torres',
    initials: 'AT',
    avatarGradient: 'from-violet-400 to-purple-500',
    type: 'TDAH Combinado',
    age: 9,
    grade: '3ro B',
    attention: 41,
    participation: 5,
    alerts: 2,
    strengths: ['Sensible', 'Musical'],
  },
]

// Filtros de tipo TDAH disponibles
const FILTERS = [
  { value: 'todos',      label: 'Todos'             },
  { value: 'combinado',  label: 'TDAH Combinado'    },
  { value: 'inatento',   label: 'TDAH Inatento'     },
  { value: 'hiperactivo',label: 'TDAH Hiperactivo'  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: barra de summary de alertas globales
// ─────────────────────────────────────────────────────────────────────────────
function AlertSummaryBar({ students }) {
  const withAlerts = students.filter((s) => s.alerts > 0)
  const allOk      = withAlerts.length === 0

  if (allOk) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100">
        <CheckCircle size={16} strokeWidth={2} className="text-emerald-500 flex-shrink-0" />
        <p className="text-sm text-emerald-700 font-medium">
          Todos los estudiantes sin alertas activas hoy ✅
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-100">
      <AlertCircle size={16} strokeWidth={2} className="text-amber-500 flex-shrink-0" />
      <p className="text-sm text-amber-700 font-medium">
        <span className="font-bold">{withAlerts.length}</span>{' '}
        {withAlerts.length === 1 ? 'estudiante requiere' : 'estudiantes requieren'} atención:{' '}
        <span className="font-semibold">
          {withAlerts.map((s) => s.name.split(' ')[0]).join(', ')}
        </span>
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componente: modal "Agregar estudiante" (placeholder UI)
// ─────────────────────────────────────────────────────────────────────────────
function AddStudentModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3
              className="text-lg font-bold text-slate-800"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Agregar estudiante
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Nuevo perfil TDAH</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {[
            { label: 'Nombre completo', placeholder: 'Ej: María López', type: 'text' },
            { label: 'Edad',            placeholder: 'Ej: 8',           type: 'number' },
            { label: 'Grado',           placeholder: 'Ej: 3ro B',       type: 'text' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Subtipo TDAH
            </label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none">
              <option>TDAH Combinado</option>
              <option>TDAH Inatento</option>
              <option>TDAH Hiperactivo</option>
            </select>
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
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// StudentsView
// ─────────────────────────────────────────────────────────────────────────────
export default function StudentsView() {
  const navigate = useNavigate()

  const [search,       setSearch]       = useState('')
  const [activeFilter, setActiveFilter] = useState('todos')
  const [showModal,    setShowModal]    = useState(false)

  // Filtrado reactivo: búsqueda + tipo TDAH
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return MOCK_STUDENTS.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q)
      const matchFilter =
        activeFilter === 'todos' ||
        s.type.toLowerCase().includes(activeFilter)
      return matchSearch && matchFilter
    })
  }, [search, activeFilter])

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
              Mis Estudiantes
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              <span className="font-semibold text-indigo-600">{MOCK_STUDENTS.length}</span>{' '}
              estudiantes con TDAH · 3ro B
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Búsqueda */}
            <div className="relative">
              <Search
                size={14}
                strokeWidth={2}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar estudiante..."
                className="pl-9 pr-4 py-2.5 w-52 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  <X size={13} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Agregar */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
            >
              <UserPlus size={14} strokeWidth={2.2} />
              Agregar
            </button>
          </div>
        </header>

        {/* ── ALERT SUMMARY ──────────────────────────────────────────────── */}
        <AlertSummaryBar students={MOCK_STUDENTS} />

        {/* ── FILTROS POR TIPO ───────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={[
                'px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150',
                activeFilter === f.value
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}

          {/* Contador de resultados */}
          <span className="ml-auto self-center text-xs text-slate-400 font-medium">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'resultado' : 'resultados'}
          </span>
        </div>

        {/* ── GRID DE CARDS ──────────────────────────────────────────────── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filtered.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onView={() => navigate(`/students/${student.id}`)}
                onAssistant={() => navigate(`/assistant?student=${student.id}`)}
              />
            ))}
          </div>
        ) : (
          /* Estado vacío */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Users size={24} strokeWidth={1.5} className="text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 mb-1">
              {search ? 'Sin resultados para esa búsqueda' : 'Sin estudiantes registrados'}
            </p>
            <p className="text-xs text-slate-400">
              {search
                ? `No encontramos coincidencias para "${search}"`
                : 'Agrega el primer perfil TDAH para comenzar'}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(''); setActiveFilter('todos') }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}

      </div>

      {/* ── MODAL ──────────────────────────────────────────────────────────── */}
      {showModal && <AddStudentModal onClose={() => setShowModal(false)} />}
    </>
  )
}
