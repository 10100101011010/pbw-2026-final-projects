import PostCard from './PostCard.jsx'

function RelatedPosts({ posts = [] }) {
  if (posts.length === 0) return null

  return (
    <div className="mt-14">

      <h2 className="mb-6 text-2xl font-bold">
        Artikel Terkait
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
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

export default RelatedPosts