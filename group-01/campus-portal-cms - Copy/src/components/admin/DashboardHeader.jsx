import { useAuth } from '../../hooks/useAuth.js'

// Top header bar within the admin dashboard.
function DashboardHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <span className="text-sm text-gray-500">{user?.full_name ?? 'Admin'}</span>
      <button onClick={logout} className="text-sm underline">
        Logout
      </button>
    </header>
  )
}

export default DashboardHeader
