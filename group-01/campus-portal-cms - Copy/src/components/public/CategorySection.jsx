import { Link } from 'react-router-dom'

import SectionTitle from './SectionTitle.jsx'
import PostCard from './PostCard.jsx'
import EmptyState from '../common/EmptyState.jsx'

import { useCategoryPosts } from '../../hooks/useCategoryPosts.js'

function CategorySection({
  title,
  slug,
  viewAllLink,
}) {

  const {
    posts,
    loading,
  } = useCategoryPosts(slug, 3)

  console.log(
  'SECTION:',
  title,
  posts.map(post => ({
    title: post.title,
    category: post.categories?.name,
    slug: post.categories?.slug,
  }))
 )

  return (
    <section className="mt-14">

      <div className="mb-6 flex items-center justify-between">

        <SectionTitle title={title} />

        <Link
          to={viewAllLink}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Lihat Semua →
        </Link>

      </div>

      {loading && (
        <p>Loading...</p>
      )}

      {!loading && posts.length === 0 && (
        <EmptyState title="Belum ada artikel." />
      )}

      {!loading && posts.length > 0 && (

        <div className="grid gap-6 md:grid-cols-3">

          {posts.map((post) => (

            <PostCard
              key={post.id}
              post={post}
            />

          ))}

        </div>

      )}

    </section>
  )
}

export default CategorySection