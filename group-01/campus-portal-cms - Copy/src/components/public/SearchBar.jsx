import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchBar() {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()

    if (!keyword.trim()) return

    navigate(`/search?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2"
    >
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Cari berita..."
        className="flex-1 rounded border px-3 py-2"
      />

      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Search
      </button>
    </form>
  )
}

export default SearchBar