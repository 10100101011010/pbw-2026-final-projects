import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { ADMIN_ROUTES } from '../constants/routes.js'

// ======================================================
// Protects all admin routes
// ======================================================

function ProtectedRoute() {

  const {
    user,
    loading,
  } = useAuth()

  // Masih mengecek session Supabase
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Belum login
  if (!user) {
    return (
      <Navigate
        to={ADMIN_ROUTES.LOGIN}
        replace
      />
    )
  }

  // Sudah login
  return <Outlet />
}

export default ProtectedRoute