import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate.js'

function RecentPostsTable({
  posts = [],
}) {

  return (

    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-5 text-xl font-semibold">
        Recent Posts
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="pb-3 text-left">
              Title
            </th>

            <th className="pb-3 text-left">
              Status
            </th>

            <th className="pb-3 text-left">
              Date
            </th>

          </tr>

        </thead>

        <tbody>

          {posts.map((post) => (

            <tr
              key={post.id}
              className="border-b"
            >

              <td className="py-4">

                <Link
                  to={`/admin/posts/${post.id}/edit`}
                  className="font-medium hover:text-blue-600"
                >
                  {post.title}
                </Link>

              </td>

              <td>

                {post.status}

              </td>

              <td>

                {formatDate(post.created_at)}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}

export default RecentPostsTable