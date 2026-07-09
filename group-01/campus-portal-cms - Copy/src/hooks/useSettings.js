import { useEffect, useState } from 'react'

import * as settingsService from '../services/settingsService.js'

export function useSettings() {

  const [settings, setSettings] = useState({})

  const [loading, setLoading] = useState(true)

  // ==========================================
  // Load Settings
  // ==========================================

  useEffect(() => {

    loadSettings()

  }, [])

  async function loadSettings() {

    try {

      setLoading(true)

      const data =
        await settingsService.getAll()

      const mapped = {}

      data.forEach(setting => {

        // ===============================
        // Social Media (JSON)
        // ===============================

        if (
          setting.key === 'social_media'
        ) {

          let social = setting.value

          if (
            typeof social === 'string'
          ) {

            try {

              social =
                JSON.parse(social)

            }

            catch {

              social = {}

            }

          }

          mapped.facebook =
            social.facebook || ''

          mapped.instagram =
            social.instagram || ''

          mapped.youtube =
            social.youtube || ''

          mapped.linkedin =
            social.linkedin || ''

        }

        // ===============================
        // Other Settings
        // ===============================

        else {

          mapped[setting.key] =
            setting.value

        }

      })

      setSettings(mapped)

    }

    catch (err) {

      console.error(err)

    }

    finally {

      setLoading(false)

    }

  }

  // ==========================================
  // Handle Change
  // ==========================================

  function handleChange(

    key,

    value,

  ) {

    setSettings(previous => ({

      ...previous,

      [key]: value,

    }))

  }

  // ==========================================
  // Save Settings
  // ==========================================

  async function saveSettings() {

    try {

      const payload = [

        {

          key: 'site_name',

          value: settings.site_name,

        },

        {

          key: 'site_description',

          value:
            settings.site_description,

        },

        {

          key: 'primary_color',

          value:
            settings.primary_color,

        },

        {

          key: 'contact_email',

          value:
            settings.contact_email,

        },

        {

          key: 'contact_phone',

          value:
            settings.contact_phone,

        },

        {

          key: 'footer_text',

          value:
            settings.footer_text,

        },

        {

          key: 'social_media',

          value: {

            facebook:
              settings.facebook,

            instagram:
              settings.instagram,

            youtube:
              settings.youtube,

            linkedin:
              settings.linkedin,

          },

        },

      ]

      await settingsService.updateMany(

        payload

      )

      alert(

        'Settings berhasil disimpan.'

      )

    }

    catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  return {

    settings,

    loading,

    handleChange,

    saveSettings,

    reload: loadSettings,

  }

}