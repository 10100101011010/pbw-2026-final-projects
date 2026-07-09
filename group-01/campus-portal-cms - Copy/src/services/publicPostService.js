import { supabase } from '../supabase/supabaseClient.js'
import * as categoryService from './categoryService.js'
import { mergePostsCategory } from '../utils/mergePostsCategory.js'
// ======================================================
// Latest Published Posts
// ======================================================

export async function getLatest(page = 1, limit = 6) {

  const from = (page - 1) * limit
  const to = from + limit - 1

  const [
    postResult,
    categories,
  ] = await Promise.all([

    supabase
      .from('posts')
      .select('*', {
        count: 'exact',
      })
      .eq('status', 'published')
      .order('published_at', {
        ascending: false,
      })
      .range(from, to),

    categoryService.getAll(),

  ])

  if (postResult.error)
    throw postResult.error

  const mergedPosts =
    mergePostsCategory(
      postResult.data,
      categories,
    )

  return {

    data: mergedPosts,

    count: postResult.count,

  }

}

// ======================================================
// By Category
// ======================================================

export async function getByCategory(
  slug,
  limit = 3,
) {

  const [
    posts,
    categories,
  ] = await Promise.all([

    supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', {
        ascending: false,
      }),

    categoryService.getAll(),

  ])

  if (posts.error)
    throw posts.error

  const mergedPosts =
    mergePostsCategory(
      posts.data,
      categories,
    )

  return mergedPosts
    .filter(
      (post) =>
        post.categories?.slug === slug
    )
    .slice(0, limit)

}

// ======================================================
// Detail
// ======================================================

export async function getDetail(slug) {

  const {
    data,
    error,
  } = await supabase
    .from('posts')
    .select(`
      *,
      categories(
        id,
        name,
        slug
      ),
      users(
        full_name
      )
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error

  return data

}