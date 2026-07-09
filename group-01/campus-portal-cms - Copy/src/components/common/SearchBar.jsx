import { useState } from 'react'

// Basic reusable search input. Submits the query via onSearch callback.
// TODO: connect to useSearch hook where used.
function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [value, setValue] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSearch?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 rounded border px-3 py-2"
      />
      <button type="submit" className="rounded border px-4 py-2">
        Search
      </button>
    </form>
  )
}

export default SearchBar
