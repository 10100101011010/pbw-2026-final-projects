import { useEffect, useState } from 'react'

import * as profileService from '../services/profileService.js'

export function useProfile() {

  const [profile, setProfile] = useState(null)

  const [loading, setLoading] = useState(true)

  const [newPassword, setNewPassword] = useState('')

  // ==========================================
  // Load Profile
  // ==========================================

  useEffect(() => {

    loadProfile()

  }, [])

  async function loadProfile() {

    try {

      setLoading(true)

      const data = await profileService.getProfile()

      setProfile(data)

    }

    catch (err) {

      console.error(err)

    }

    finally {

      setLoading(false)

    }

  }

  // ==========================================
  // Handle Input Change
  // ==========================================

  function handleChange(key, value) {

    setProfile(previous => ({

      ...previous,

      [key]: value,

    }))

  }

  // ==========================================
  // Save Profile
  // ==========================================

  async function saveProfile() {

    try {

      await profileService.updateProfile(profile)

      alert('Profile updated successfully.')

    }

    catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  // ==========================================
  // Change Password
  // ==========================================

  async function updatePassword() {

    if (!newPassword.trim()) {

      alert('New password is required.')

      return

    }

    try {

      await profileService.changePassword(

        profile.id,

        newPassword,

      )

      setNewPassword('')

      alert('Password updated successfully.')

    }

    catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  return {

    profile,

    loading,

    newPassword,

    setNewPassword,

    handleChange,

    saveProfile,

    updatePassword,

    reload: loadProfile,

  }

}