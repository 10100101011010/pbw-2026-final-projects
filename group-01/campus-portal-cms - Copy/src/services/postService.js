import { supabase } from '../supabase/supabaseClient.js'
import * as categoryService from './categoryService.js'
import { mergePostsCategory } from '../utils/mergePostsCategory.js'
// ======================================================
// Get All Posts
// ======================================================

export async function getAll(params = {}) {

  const {
    categoryId,
    status,
    page = 1,
    limit = 10,
  } = params

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
      .order('created_at', {
        ascending: false,
      })
      .range(from, to),

    categoryService.getAll(),

  ])

  if (postResult.error)
    throw postResult.error

  let posts =
    mergePostsCategory(
      postResult.data,
      categories,
    )

  if (categoryId) {

    posts = posts.filter(
      post =>
        post.category_id === categoryId
    )

  }

  if (status) {

    posts = posts.filter(
      post =>
        post.status === status
    )

  }

  return {

    data: posts,

    count: postResult.count,

  }

}

// ======================================================
// Get Post By ID
// ======================================================

export async function getById(id) {

  const [
    postResult,
    categories,
  ] = await Promise.all([

    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single(),

    categoryService.getAll(),

  ])

  if (postResult.error)
    throw postResult.error

  return mergePostsCategory(
    [postResult.data],
    categories,
  )[0]

}

// ======================================================
// Get Post By Slug
// ======================================================

export async function getBySlug(slug) {

  const [
    postResult,
    categories,
  ] = await Promise.all([

    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single(),

    categoryService.getAll(),

  ])

  if (postResult.error)
    throw postResult.error

  return mergePostsCategory(
    [postResult.data],
    categories,
  )[0]

}

// ======================================================
// Create
// ======================================================

export async function create(payload) {

  const { data, error } = await supabase
    .from('posts')
    .insert(payload)
    .select()
    .single()

  if (error) throw error

  return data

}

// ======================================================
// Update
// ======================================================

export async function update(id, payload) {

  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data

}

// ======================================================
// Delete
// ======================================================

export async function remove(id) {

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error

}

// ======================================================
// Publish
// ======================================================

export async function publish(id) {

  const { data, error } = await supabase
    .from('posts')
    .update({

      status: 'published',

      published_at: new Date().toISOString(),

    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data

}

// ======================================================
// Archive
// ======================================================

export async function archive(id) {

  const { data, error } = await supabase
    .from('posts')
    .update({

      status: 'archived',

    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data

}

// ======================================================
// Search
// ======================================================

export async function search(keyword) {

  const [
    posts,
    categories,
  ] = await Promise.all([

    supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`)
      .order('published_at', {
        ascending: false,
      }),

    categoryService.getAll(),

  ])

  if (posts.error)
    throw posts.error

  return mergePostsCategory(
    posts.data,
    categories,
  )

}

// ======================================================
// Dashboard Statistics
// ======================================================

export async function getStatistics() {

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
  ] = await Promise.all([

    supabase
      .from('posts')
      .select('*', {
        count: 'exact',
        head: true,
      }),

    supabase
      .from('posts')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'published'),

    supabase
      .from('posts')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('status', 'draft'),

  ])

  if (
    totalPosts.error ||
    publishedPosts.error ||
    draftPosts.error
  ) {
    throw (
      totalPosts.error ||
      publishedPosts.error ||
      draftPosts.error
    )
  }

  return {

    totalPosts:
      totalPosts.count ?? 0,

    publishedPosts:
      publishedPosts.count ?? 0,

    draftPosts:
      draftPosts.count ?? 0,

  }

}

// ======================================================
// Get Posts By Category Slug
// ======================================================

export async function getByCategorySlug(slug) {

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

  const merged =
    mergePostsCategory(
      posts.data,
      categories,
    )

  return merged.filter(
    post =>
      post.categories?.slug === slug
  )

}
// ======================================================
// Get Recent Posts
// ======================================================

export async function getRecentPosts(limit = 5) {

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
      })
      .limit(limit),

    categoryService.getAll(),

  ])

  if (posts.error)
    throw posts.error

  return mergePostsCategory(
    posts.data,
    categories,
  )

}

// ======================================================
// Get Related Posts
// ======================================================

export async function getRelatedPosts(
  categoryId,
  currentPostId,
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
      .eq('category_id', categoryId)
      .neq('id', currentPostId)
      .order('published_at', {
        ascending: false,
      })
      .limit(limit),

    categoryService.getAll(),

  ])

  if (posts.error)
    throw posts.error

  return mergePostsCategory(
    posts.data,
    categories,
  )

}

// ======================================================
// Get Latest Posts By Category
// ======================================================

export async function getLatestByCategory(
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
      post =>
        post.categories?.slug === slug
    )
    .slice(0, limit)

}