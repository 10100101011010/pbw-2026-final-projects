  import { supabase } from '../supabase/supabaseClient.js'

  // ===========================================
  // Login
  // ===========================================

  export async function login(email, password) {

    console.log("LOGIN");
    console.log(email);
    console.log(password);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password);

    console.log("DATA =", data);
    console.log("ERROR =", error);

    if (error) throw error;

    if (data.length === 0) {
      throw new Error("Email atau Password salah");
    }

    localStorage.setItem(
      "currentUser",
      JSON.stringify(data[0])
    );

    return data[0];
  }

  // ===========================================
  // Get User By ID
  // ===========================================

  export async function getById(id) {

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return data

  }

  // ===========================================
  // Update Profile
  // ===========================================

  export async function updateProfile(id, profile) {

    const { data, error } = await supabase
      .from('users')
      .update({

        full_name: profile.full_name,

        email: profile.email,

        phone: profile.phone,

        username: profile.username,

        updated_at: new Date().toISOString(),

      })
      .eq('id', id)
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

    currentPassword,

    newPassword,

  ) {

    // Ambil password lama

    const user = await getById(id)

    if (

      user.password !== currentPassword

    ) {

      throw new Error(

        'Current password is incorrect.'

      )

    }

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

  // ===========================================
  // Logout
  // ===========================================

  export async function logout() {

    localStorage.removeItem('currentUser')

  }

  // ===========================================
  // Get Current User
  // ===========================================

  export async function getCurrentUser() {

    const raw = localStorage.getItem('currentUser')

    if (!raw) return null

    return JSON.parse(raw)

  }

  // ===========================================
  // Auth State Change
  // ===========================================

  export function onAuthStateChange(callback) {

    callback({

      user: JSON.parse(

        localStorage.getItem('currentUser')

      ),

    })

    return {

      data: {

        subscription: {

          unsubscribe() {},

        },

      },

    }

  }