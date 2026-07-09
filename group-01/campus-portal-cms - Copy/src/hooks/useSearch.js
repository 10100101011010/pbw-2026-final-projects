// useSearch.js
// Wraps postService.search with React state.
// Skeleton only — no search logic implemented yet.

import { useState } from 'react'
import * as postService from '../services/postService.js'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function search(nextQuery) {
    // TODO: call postService.search(nextQuery) and update state
  }

  return { query, setQuery, results, loading, error, search }
}
