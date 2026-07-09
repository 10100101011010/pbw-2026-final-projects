// Shown when a request/operation fails.
function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <p className="font-medium text-red-600">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-sm underline">
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorState
