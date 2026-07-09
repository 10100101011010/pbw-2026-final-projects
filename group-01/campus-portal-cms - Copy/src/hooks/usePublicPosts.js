import { useEffect, useState } from 'react'
import * as publicPostService from '../services/publicPostService.js'

export function useLatestPosts(limit = 6) {

  const [posts, setPosts] = useState([])
  const [count, setCount] = useState(0)

  const [page, setPage] = useState(1)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPosts()
  }, [page])

  async function loadPosts() {

    try {

      setLoading(true)

      const result =
        await publicPostService.getLatest(
          page,
          limit,
        )

      setPosts(result.data)

      setCount(result.count)

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  return {

    posts,

    count,

    page,

    setPage,

    loading,

  }

}