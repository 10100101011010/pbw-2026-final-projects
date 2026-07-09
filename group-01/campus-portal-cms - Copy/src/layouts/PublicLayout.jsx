import { Outlet } from 'react-router-dom'
import Navbar from '../components/public/Navbar.jsx'
import Footer from '../components/public/Footer.jsx'

// Shared shell for all public-facing pages.
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
