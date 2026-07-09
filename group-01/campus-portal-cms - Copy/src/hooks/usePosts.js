// usePosts.js
// React hook for loading posts from Supabase.

import { useState, useEffect } from 'react'
import * as postService from '../services/postService.js'

export function usePosts(params = {}) {
  const [posts, setPosts] = useState([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadPosts() {
    try {
      setLoading(true)
      setError(null)

      const result = await postService.getAll(params)

      setPosts(result.data)
      setCount(result.count)
    } catch (err) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [JSON.stringify(params)])

  return {
    posts,
    count,
    loading,
    error,
    refreshPosts: loadPosts,
  }
}