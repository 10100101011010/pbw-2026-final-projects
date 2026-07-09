import { supabase } from '../supabase/supabaseClient.js'

// ===========================================
// Get All Categories
// ===========================================

export async function getAll() {

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', {
      ascending: true,
    })

  if (error) throw error

  return data

}

// ===========================================
// Get Category By ID
// ===========================================

export async function getById(id) {

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return data

}

// ===========================================
// Get Category By Slug
// ===========================================

export async function getBySlug(slug) {

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error

  return data

}

// ===========================================
// Create Category
// ===========================================

export async function create(payload) {

  const { data, error } = await supabase
    .from('categories')
    .insert(payload)
    .select()
    .single()

  if (error) throw error

  return data

}

// ===========================================
// Update Category
// ===========================================

export async function update(id, payload) {

  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data

}

// ===========================================
// Delete Category
// ===========================================

export async function remove(id) {

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error

}

// ===========================================
// Get Total Categories
// ===========================================

export async function getTotalCategories() {

  const { count, error } = await supabase
    .from('categories')
    .select('*', {
      count: 'exact',
      head: true,
    })

  if (error) throw error

  return count ?? 0

}