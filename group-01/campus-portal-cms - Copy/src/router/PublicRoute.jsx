import { Outlet } from 'react-router-dom'

// Wrapper for public routes. Currently a pass-through — reserved for
// future logic (e.g. redirecting already-logged-in admins away from
// certain public-facing pages, if ever needed).
function PublicRoute() {
  return <Outlet />
}

export default PublicRoute
