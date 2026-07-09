import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate.js'

function SidebarPosts({
  title,
  posts = [],
}) {

  if (posts.length === 0) return null

  return (

    <aside className="rounded-xl border bg-white p-5 shadow-sm">

      <h2 className="mb-5 border-b pb-3 text-xl font-bold">
        {title}
      </h2>

      <div className="space-y-5">

        {posts.map((post) => (

          <Link
            key={post.id}
            to={`/post/${post.slug}`}
            className="block"
          >

            {post.cover_url && (

              <img
                src={post.cover_url}
                alt={post.title}
                className="mb-3 h-32 w-full rounded-lg object-cover"
              />

            )}

            <h3 className="font-semibold hover:text-blue-600">

              {post.title}

            </h3>

            <p className="mt-1 text-sm text-gray-500">

              {post.categories?.name}

            </p>

            <p className="text-xs text-gray-400">

              {formatDate(post.published_at)}

            </p>

          </Link>

        ))}

      </div>

    </aside>

  )

}

export default SidebarPosts