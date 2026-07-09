// Basic reusable textarea with label support.
function Textarea({ label, id, value, onChange, rows = 4, placeholder, error }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="rounded border px-3 py-2"
      />
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
}

export default Textarea
