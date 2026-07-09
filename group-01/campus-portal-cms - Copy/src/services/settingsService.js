import { supabase } from '../supabase/supabaseClient.js'

// ===========================================
// Get All Settings
// ===========================================

export async function getAll() {

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('key')

  if (error) throw error

  return data

}

// ===========================================
// Get Setting By Key
// ===========================================

export async function getByKey(key) {

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single()

  if (error) throw error

  return data

}

// ===========================================
// Update One Setting
// ===========================================

export async function update(key, value) {

  const { data, error } = await supabase
    .from('settings')
    .update({

      value,

      updated_at: new Date(),

    })
    .eq('key', key)
    .select()
    .single()

  if (error) throw error

  return data

}

// ===========================================
// Update Multiple Settings
// ===========================================

export async function updateMany(settings) {

  for (const setting of settings) {

    const { data, error } = await supabase
      .from('settings')
      .update({
        value: setting.value,
        updated_at: new Date().toISOString(),
      })
      .eq('key', setting.key)
      .select()

    console.log('====================')
    console.log('KEY :', setting.key)
    console.log('VALUE :', setting.value)
    console.log('DATA :', data)
    console.log('ERROR :', error)

    if (error) throw error
  }

  return true

}