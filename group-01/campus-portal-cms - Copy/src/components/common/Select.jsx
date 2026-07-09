// Basic reusable select. `options` is an array of { value, label }.
function Select({ label, id, value, onChange, options = [], error }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
      <select id={id} value={value} onChange={onChange} className="rounded border px-3 py-2">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  )
}

export default Select
