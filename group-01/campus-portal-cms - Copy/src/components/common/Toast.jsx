// Basic reusable toast/notification banner.
// TODO: wire up to a global toast manager/context if needed.
function Toast({ message, variant = 'info' }) {
  if (!message) return null

  const variantClasses = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  }

  return (
    <div className={`rounded px-4 py-2 text-sm ${variantClasses[variant]}`}>
      {message}
    </div>
  )
}

export default Toast
