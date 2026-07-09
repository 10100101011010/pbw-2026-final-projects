import { supabase } from '../supabase/supabaseClient.js'

// ===========================================
// Get Admin Profile
// ===========================================

export async function getProfile() {

  const { data, error } = await supabase

    .from('users')

    .select('*')

    .eq('role', 'admin')

    .single()

  if (error) throw error

  return data

}

// ===========================================
// Update Profile
// ===========================================

export async function updateProfile(profile) {

  const { data, error } = await supabase

    .from('users')

    .update({

      full_name: profile.full_name,

      email: profile.email,

      phone: profile.phone,

      avatar_url: profile.avatar_url,

      updated_at: new Date().toISOString(),

    })

    .eq('id', profile.id)

    .select()

    .single()

  if (error) throw error

  return data

}

// ===========================================
// Change Password
// ===========================================

export async function changePassword(

  id,

  newPassword,

) {

  const { data, error } = await supabase

    .from('users')

    .update({

      password: newPassword,

      updated_at: new Date().toISOString(),

    })

    .eq('id', id)

    .select()

    .single()

  if (error) throw error

  return data

}