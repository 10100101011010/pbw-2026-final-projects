import { Link } from 'react-router-dom'
import { ADMIN_ROUTES } from '../../constants/routes.js'

// Left navigation sidebar for the admin dashboard.
function Sidebar() {
  return (
    <aside className="w-56 border-r p-4">
      <nav className="flex flex-col gap-2 text-sm">
        <Link to={ADMIN_ROUTES.DASHBOARD}>Dashboard</Link>
        <Link to={ADMIN_ROUTES.POSTS}>Posts</Link>
        <Link to={ADMIN_ROUTES.CATEGORIES}>Categories</Link>
        <Link to={ADMIN_ROUTES.SETTINGS}>Settings</Link>
        <Link to={ADMIN_ROUTES.PROFILE}>Profile</Link>
      </nav>
    </aside>
  )
}

export default Sidebar
