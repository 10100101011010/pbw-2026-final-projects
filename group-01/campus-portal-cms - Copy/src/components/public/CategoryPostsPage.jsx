import { useEffect, useState } from 'react'

import * as postService from '../../services/postService.js'

import PostCard from './PostCard.jsx'
import EmptyState from '../common/EmptyState.jsx'
import SectionTitle from './SectionTitle.jsx'

function CategoryPostsPage({ slug, title }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)

        const data = await postService.getByCategorySlug(slug)

        setPosts(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [slug])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionTitle title={title} />

      {loading && (
        <p className="mt-8 text-center">
          Loading...
        </p>
      )}

      {!loading && posts.length === 0 && (
        <EmptyState title={`Belum ada ${title}`} />
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

export default CategoryPostsPage