import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import * as postService from '../../services/postService.js'

import RelatedPosts from '../../components/public/RelatedPosts.jsx'
import SidebarPosts from '../../components/public/SidebarPosts.jsx'
import ShareButtons from '../../components/public/ShareButtons.jsx'
import CategoryBadge from '../../components/public/CategoryBadge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import * as attachmentService from '../../services/attachmentService.js'

import { formatDate } from '../../utils/formatDate.js'
import { readingTime } from '../../utils/readingTime.js'


function PostDetailPage() {

  const { slug } = useParams()

  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [attachments, setAttachments] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [slug])

  async function loadPost() {

    try {

      setLoading(true)

      const data =
        await postService.getBySlug(slug)

      setPost(data)

      const files = await attachmentService.getByPost(data.id)

      console.log('POST ID:', data.id)
      console.log('ATTACHMENTS:', files)

      setAttachments(files)

      if (data?.category_id) {

        const related =
          await postService.getRelatedPosts(
            data.category_id,
            data.id
          )

        setRelatedPosts(related)

      }

      const recent =
        await postService.getRecentPosts(5)

      setRecentPosts(recent)

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  if (loading) {

    return (
      <div className="mx-auto max-w-7xl px-4 py-10">

        <p>Loading...</p>

      </div>
    )

  }

  if (!post) {

  return (
    <EmptyState
      title="Post tidak ditemukan."
    />
  )

}

   return (
      <div className="mx-auto max-w-7xl px-4 py-10">

      {/* Cover */}

      {post.cover_url && (

        <img
          src={post.cover_url}
          alt={post.title}
          className="mb-8 h-[420px] w-full rounded-2xl object-cover shadow"
        />

      )}

      <div className="grid gap-10 lg:grid-cols-3">

        {/* ============================= */}
        {/* Main Content */}
        {/* ============================= */}

        <main className="lg:col-span-2">

          <CategoryBadge
            name={post.categories?.name}
          />

          <h1 className="mt-5 text-4xl font-bold leading-tight">

            {post.title}

          </h1>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

            <span>

              {formatDate(post.published_at)}

            </span>

            <span>•</span>

            <span>

              {readingTime(post.content)}

            </span>

          </div>

          {post.excerpt && (

            <div className="mt-8 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5 italic text-gray-700">

              {post.excerpt}

            </div>

          )}

          <article
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content,
            }}
          />

          {attachments.length > 0 && (

            <div className="mt-10 rounded-lg border p-6">

              <h2 className="mb-5 text-xl font-bold">

                📎 Lampiran

              </h2>

              <div className="space-y-3">

                {attachments.map((file) => (

                  <a
                    key={file.id}
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border p-4 transition hover:bg-gray-50"
                  >

                    <div>

                      <p className="font-medium">

                        📄 {file.file_name}

                      </p>

                      <p className="text-sm text-gray-500">

                        {file.file_type?.toUpperCase()}

                      </p>

                    </div>

                    <span className="text-blue-600">

                      Buka →

                    </span>

                  </a>

                ))}

              </div>

            </div>

          )}


          <ShareButtons
            title={post.title}
          />

          <RelatedPosts
            posts={relatedPosts}
          />

        </main>

        {/* ============================= */}
        {/* Sidebar */}
        {/* ============================= */}

        <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">

          <SidebarPosts
            title="Recent Posts"
            posts={recentPosts}
          />

        </aside>

      </div>

    </div>

  )

}

export default PostDetailPage