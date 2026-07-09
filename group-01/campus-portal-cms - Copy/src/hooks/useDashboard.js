import { useEffect, useState } from 'react'
import * as dashboardService from '../services/dashboardService.js'

export function useDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    published: 0,
    drafts: 0,
    categories: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      setLoading(true)

      const result = await dashboardService.getStatistics()

      setStats(result)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    refreshDashboard: loadDashboard,
  }
}