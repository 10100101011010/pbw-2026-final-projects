import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import * as postService from '../../services/postService.js'
import PostCard from '../../components/public/PostCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

function SearchResultPage() {
  const [params] = useSearchParams()

  const keyword = params.get('q') || ''

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  async function searchPosts() {
    if (!keyword.trim()) {
      setPosts([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const data = await postService.search(keyword)
      setPosts(data)
    } catch (err) {
      console.error(err)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  searchPosts()
}, [keyword])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">

      <h1 className="mb-6 text-3xl font-bold">
        Hasil pencarian: "{keyword}"
      </h1>

      {!loading && posts.length === 0 && (
        <EmptyState title="Tidak ada hasil." />
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </div>

    </div>
  )
}

export default SearchResultPage