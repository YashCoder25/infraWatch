import { useAdminAuth } from './useAdminAuth.js'
import AdminLogin from './AdminLogin.jsx'
import AdminDashboard from './AdminDashboard.jsx'

export default function AdminRoute() {
  const { token, isAuthenticated, checking, error, login, logout } = useAdminAuth()

  if (checking) {
    return <div className="app-status">Checking session…</div>
  }
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} error={error} />
  }
  return <AdminDashboard token={token} onLogout={logout} />
}
