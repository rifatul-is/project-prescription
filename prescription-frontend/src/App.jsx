import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import PrescriptionsPage from './pages/PrescriptionsPage'
import ReportsPage from './pages/ReportsPage'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/prescriptions" replace />} />
          <Route path="prescriptions" element={<PrescriptionsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/prescriptions" replace />} />
    </Routes>
  )
}

export default App
