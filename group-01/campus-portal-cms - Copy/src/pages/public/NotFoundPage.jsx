import { Link } from 'react-router-dom'

// Catch-all 404 page.
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
      <h1 className="text-3xl font-bold">404</h1>
      <p className="text-gray-500">Page not found.</p>
      <Link to="/" className="mt-2 underline">
        Back to Home
      </Link>
    </div>
  )
}

export default NotFoundPage
