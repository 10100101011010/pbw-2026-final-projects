import { supabase } from '../supabase/supabaseClient.js'

// ======================================================
// Upload Cover Image
// ======================================================

export async function uploadCover(file) {

  if (!file) return null

  const extension = file.name.split('.').pop()

  const fileName =
    `${crypto.randomUUID()}.${extension}`

  const filePath =
    `covers/${fileName}`

  const { error } =
    await supabase.storage
      .from('attachments')
      .upload(filePath, file)

  if (error) throw error

  const { data } =
    supabase.storage
      .from('attachments')
      .getPublicUrl(filePath)

  return data.publicUrl
}

// ======================================================
// Get Attachments By Post
// ======================================================

export async function getByPost(postId) {

  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', {
      ascending: true,
    })

  if (error) throw error

  return data

}

// ======================================================
// Create Attachment
// ======================================================

export async function create(payload) {

  console.log('=== ATTACHMENT PAYLOAD ===')
  console.log(payload)

  const { data, error } = await supabase
    .from('attachments')
    .insert(payload)
    .select()
    .single()

  console.log('=== ATTACHMENT RESULT ===')
  console.log(data)

  console.log('=== ATTACHMENT ERROR ===')
  console.log(error)

  if (error) throw error

  return data
}

// ======================================================
// Update Attachment
// ======================================================

export async function update(id, payload) {

  const { data, error } = await supabase
    .from('attachments')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data

}

// ======================================================
// Delete Attachment
// ======================================================

export async function remove(id) {

  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', id)

  if (error) throw error

}