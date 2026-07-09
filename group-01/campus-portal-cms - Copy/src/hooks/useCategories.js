import { useEffect, useState } from 'react'

import * as categoryService from '../services/categoryService.js'

export function useCategories() {

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  // ==========================================
  // Load Categories
  // ==========================================

  async function loadCategories() {

    try {

      setLoading(true)

      const data =
        await categoryService.getAll()

      setCategories(data)

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  // ==========================================
  // Create Category
  // ==========================================

  async function createCategory(payload) {

    const created =
      await categoryService.create(payload)

    setCategories(prev => [

      ...prev,

      created,

    ])

    return created

  }

  // ==========================================
  // Update Category
  // ==========================================

  async function updateCategory(id, payload) {

    const updated =
      await categoryService.update(
        id,
        payload,
      )

    setCategories(prev =>

      prev.map(category =>

        category.id === id
          ? updated
          : category

      )

    )

    return updated

  }

  // ==========================================
  // Delete Category
  // ==========================================

  async function deleteCategory(id) {

    await categoryService.remove(id)

    setCategories(prev =>

      prev.filter(

        category =>

          category.id !== id

      )

    )

  }

  return {

    categories,

    loading,

    loadCategories,

    createCategory,

    updateCategory,

    deleteCategory,

  }

}