import { useEffect, useState } from 'react'
import * as postService from '../services/postService.js'

export function useCategoryPosts(categorySlug, limit = 3) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [categorySlug, limit])

  async function loadPosts() {
    try {
      setLoading(true)

      const data = await postService.getLatestByCategory(
        categorySlug,
        limit
      )

      setPosts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    posts,
    loading,
  }
}