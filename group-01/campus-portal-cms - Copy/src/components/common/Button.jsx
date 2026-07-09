// Basic reusable button. Extend with variants/sizes as design finalizes.
function Button({ children, type = 'button', onClick, disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded px-4 py-2 font-medium disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
