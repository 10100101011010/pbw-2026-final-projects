import { useEffect, useState } from 'react'

import * as settingsService from '../services/settingsService.js'

export function useSiteSettings() {

  const [settings, setSettings] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    load()

  }, [])

  async function load() {

    try {

      setLoading(true)

      const data = await settingsService.getAll()

      const mapped = {}

      data.forEach(setting => {

        mapped[setting.key] = setting.value

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

  return {

    settings,

    loading,

    reload: load,

  }

}