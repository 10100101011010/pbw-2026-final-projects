import { supabase } from '../supabase/supabaseClient.js'

export async function getStatistics() {
  // Total Posts
  const { count: totalPosts, error: postError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  if (postError) throw postError

  // Published
  const { count: published, error: publishedError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  if (publishedError) throw publishedError

  // Draft
  const { count: drafts, error: draftError } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  if (draftError) throw draftError

  // Categories
  const { count: categories, error: categoryError } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  if (categoryError) throw categoryError

  return {
    totalPosts,
    published,
    drafts,
    categories,
  }
}