import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import CategoryPostsPage from '../../components/public/CategoryPostsPage.jsx'
import * as categoryService from '../../services/categoryService.js'

function CategoryPage() {

  const { slug } = useParams()

  const [category, setCategory] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    loadCategory()

  }, [slug])

  async function loadCategory() {

    try {

      setLoading(true)

      const data =
        await categoryService.getBySlug(slug)

      setCategory(data)

    }

    catch (err) {

      console.error(err)

    }

    finally {

      setLoading(false)

    }

  }

  if (loading) {

    return (

      <p className="p-10">

        Loading...

      </p>

    )

  }

  if (!category) {

    return (

      <p className="p-10">

        Category not found.

      </p>

    )

  }

  return (

    <CategoryPostsPage

      slug={category.slug}

      title={category.name}

    />

  )

}

export default CategoryPage