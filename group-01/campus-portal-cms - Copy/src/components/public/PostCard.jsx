import { Link } from 'react-router-dom'
import CategoryBadge from './CategoryBadge.jsx'
import { formatDate } from '../../utils/formatDate.js'

function PostCard({ post }) {

  if (!post) return null

  console.log('======================')
  console.log('TITLE:', post.title)
  console.log('FULL POST:', post)
  console.log('CATEGORIES:', post.categories)
  console.log('======================')

  const category =
    Array.isArray(post.categories)
      ? post.categories[0]
      : post.categories

  return (
    <Link
      to={`/post/${post.slug}`}
      className="overflow-hidden rounded-lg border bg-white transition hover:shadow-lg"
    >

      {post.cover_url ? (
        <img
          src={post.cover_url}
          alt={post.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
          No Image
        </div>
      )}

      <div className="p-4">

        <CategoryBadge
          name={category?.name || 'General'}
        />

        <h3 className="mt-3 text-lg font-semibold">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">
            {post.excerpt}
          </p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          {formatDate(post.published_at)}
        </p>

      </div>

    </Link>
  )
}

export default PostCard