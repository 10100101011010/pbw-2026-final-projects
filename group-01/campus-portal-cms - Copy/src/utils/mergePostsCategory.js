export function mergePostsCategory(posts, categories) {

  console.log("POSTS:", posts)
  console.log("CATEGORIES:", categories)

  const categoryMap = new Map()

  categories.forEach(category => {
    categoryMap.set(category.id, category)
  })

  console.log("MAP:", categoryMap)

  return posts.map(post => {

    console.log(
      "MATCH:",
      post.title,
      post.category_id,
      categoryMap.get(post.category_id)
    )

    return {
      ...post,
      categories: categoryMap.get(post.category_id) || null,
    }

  })

}