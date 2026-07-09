import { Link } from 'react-router-dom'

import DataTable from '../../components/admin/DataTable.jsx'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

import { ADMIN_ROUTES } from '../../constants/routes.js'

import { usePosts } from '../../hooks/usePosts.js'
import * as postService from '../../services/postService.js'

function PostsPage() {
  const {
    posts,
    loading,
    refreshPosts,
  } = usePosts()

  async function handleDelete(post) {
    const confirmDelete = window.confirm(
      `Hapus "${post.title}" ?`
    )

    if (!confirmDelete) return

    try {
      await postService.remove(post.id)

      alert('Post berhasil dihapus.')

      refreshPosts()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const rows = posts.map((post) => ({
    id: post.id,

    title: post.title,

    status: post.status,

    category:
      post.categories?.name ?? '-',

    created:
      new Date(post.created_at).toLocaleDateString('id-ID'),
  }))

  const columns = [
    {
      key: 'title',
      label: 'Title',
    },
    {
      key: 'status',
      label: 'Status',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'created',
      label: 'Created',
    },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Posts
        </h1>

        <Link to={ADMIN_ROUTES.CREATE_POST}>
          <Button className="bg-gray-900 text-white">
            New Post
          </Button>
        </Link>
      </div>

      {!loading && rows.length === 0 && (
        <EmptyState title="No posts yet" />
      )}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        renderActions={(row) => (
          <div className="flex gap-3">
            <Link
              to={`/admin/posts/${row.id}/edit`}
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>

            <button
              onClick={() => handleDelete(row)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      />
    </div>
  )
}

export default PostsPage