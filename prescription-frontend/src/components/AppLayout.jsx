import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AppLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Prescription Manager
            </p>
            <p className="text-xs text-slate-500">Welcome back, {user?.username}</p>
          </div>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <NavLink
              to="/prescriptions"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'hover:bg-emerald-100 hover:text-emerald-700'
                }`
              }
            >
              Prescriptions
            </NavLink>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `rounded-md px-3 py-2 transition ${
                  isActive
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'hover:bg-emerald-100 hover:text-emerald-700'
                }`
              }
            >
              Reports
            </NavLink>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-200 px-3 py-2 font-medium text-slate-600 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout

