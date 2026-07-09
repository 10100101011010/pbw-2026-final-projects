// Basic reusable text input with label support.
function Input({ label, id, value, onChange, type = 'text', placeholder, error }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded border px-3 py-2"
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
}

export default Input
