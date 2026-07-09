import { useEffect, useState } from 'react'

import * as postService from '../../services/postService.js'
import * as categoryService from '../../services/categoryService.js'

import StatCard from '../../components/admin/StatCard.jsx'
import RecentPostsTable from '../../components/admin/RecentPostsTable.jsx'

function DashboardPage() {

  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
  })

  const [recentPosts, setRecentPosts] = useState([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {

    try {

      setLoading(true)

      const [
        statistics,
        recentPosts,
        totalCategories,
      ] = await Promise.all([
        postService.getStatistics(),
        postService.getRecentPosts(5),
        categoryService.getTotalCategories(),
      ])

      setStats({
        ...statistics,
        totalCategories,
      })

      setRecentPosts(recentPosts)

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  if (loading) {

    return (

      <div className="flex h-96 items-center justify-center">

        <p className="text-gray-500">
          Loading dashboard...
        </p>

      </div>

    )

  }

  return (

    <div className="space-y-8">

      <div>

        <h1 className="text-4xl font-bold">

          Dashboard

        </h1>

        <p className="mt-2 text-gray-500">

          Welcome back 👋

        </p>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Posts"
          value={stats.totalPosts}
          color="bg-blue-500"
        />

        <StatCard
          title="Published"
          value={stats.publishedPosts}
          color="bg-green-500"
        />

        <StatCard
          title="Draft"
          value={stats.draftPosts}
          color="bg-yellow-500"
        />

        <StatCard
          title="Categories"
          value={stats.totalCategories}
          color="bg-purple-500"
        />

      </div>

      <RecentPostsTable
        posts={recentPosts}
      />

    </div>

  )

}

export default DashboardPage