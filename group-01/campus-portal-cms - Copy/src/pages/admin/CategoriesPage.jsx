import { useState } from 'react'

import DataTable from '../../components/admin/DataTable.jsx'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Modal from '../../components/common/Modal.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

import { useCategories } from '../../hooks/useCategories.js'
import { slugify } from '../../utils/slugify.js'

function CategoriesPage() {

  const {

    categories,

    loading,

    createCategory,

    deleteCategory,

  } = useCategories()

  const [

    isModalOpen,

    setIsModalOpen,

  ] = useState(false)

  const [

    name,

    setName,

  ] = useState('')

  const [

    slug,

    setSlug,

  ] = useState('')

  const [

    description,

    setDescription,

  ] = useState('')

  const columns = [

    {

      key: 'name',

      label: 'Name',

    },

    {

      key: 'slug',

      label: 'Slug',

    },

    {

      key: 'description',

      label: 'Description',

    },

  ]

  // ===================================
  // CREATE
  // ===================================

  async function handleCreate(event) {

    event.preventDefault()

    if (!name.trim()) {

      alert('Category name is required.')

      return

    }

    try {

      await createCategory({

        name,

        slug,

        description,

      })

      setName('')

      setSlug('')

      setDescription('')

      setIsModalOpen(false)

    }

    catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  // ===================================
  // DELETE
  // ===================================

  async function handleDelete(row) {

    const confirmed = window.confirm(

      `Delete "${row.name}" ?`

    )

    if (!confirmed) return

    try {

      await deleteCategory(row.id)

    }

    catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  return (

    <div>

      <div className="mb-6 flex items-center justify-between">

        <h1 className="text-2xl font-bold">

          Categories

        </h1>

        <Button

          className="bg-gray-900 text-white"

          onClick={() => {

            setName('')

            setSlug('')

            setDescription('')

            setIsModalOpen(true)

          }}

        >

          New Category

        </Button>

      </div>

      {

        !loading &&

        categories.length === 0 && (

          <EmptyState

            title="No Categories"

          />

        )

      }

      <DataTable

        columns={columns}

        rows={categories}

        renderActions={(row)=>(

          <button

            onClick={()=>handleDelete(row)}

            className="text-red-600 hover:underline"

          >

            Delete

          </button>

        )}

      />

      <Modal

        isOpen={isModalOpen}

        onClose={()=>

          setIsModalOpen(false)

        }

        title="Create Category"

      >

        <form

          onSubmit={handleCreate}

          className="space-y-4"

        >

          <Input

            id="name"

            label="Category Name"

            value={name}

            onChange={(e)=>{

              setName(e.target.value)

              setSlug(

                slugify(

                  e.target.value

                )

              )

            }}

          />

          <Input

            id="slug"

            label="Slug"

            value={slug}

            onChange={(e)=>

              setSlug(

                e.target.value

              )

            }

          />

          <Textarea

            id="description"

            label="Description"

            rows={4}

            value={description}

            onChange={(e)=>

              setDescription(

                e.target.value

              )

            }

          />

          <div className="flex justify-end">

            <Button

              type="submit"

              className="bg-gray-900 text-white"

            >

              Save

            </Button>

          </div>

        </form>

      </Modal>

    </div>

  )

}

export default CategoriesPage