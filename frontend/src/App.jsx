import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'

// ── View imports (stubs until each view is built) ────────────────────────────
import DashboardView  from './views/DashboardView'
import StudentsView   from './views/StudentsView'
import AssistantView  from './views/AssistantView'
import AdapterView    from './views/AdapterView'
import LogbookView    from './views/LogbookView'
import BankView       from './views/BankView'

// ── Root layout ───────────────────────────────────────────────────────────────
function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-jakarta">

      {/* Fixed sidebar */}
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <main className="lg:pl-64 min-h-screen flex flex-col">
        <div className="flex-1 p-6 lg:p-8 pt-16 lg:pt-8">
          <Routes>
            <Route path="/"          element={<DashboardView />} />
            <Route path="/students"  element={<StudentsView />}  />
            <Route path="/assistant" element={<AssistantView />} />
            <Route path="/adapter"   element={<AdapterView />}   />
            <Route path="/logbook"   element={<LogbookView />}   />
            <Route path="/bank"      element={<BankView />}      />
            {/* Catch-all → dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

    </div>
  )
}

// ── App entry point ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
