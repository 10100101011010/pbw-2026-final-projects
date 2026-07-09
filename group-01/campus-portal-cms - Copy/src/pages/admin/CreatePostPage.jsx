import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '../../components/common/Input.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Select from '../../components/common/Select.jsx'
import Button from '../../components/common/Button.jsx'

import { useCategories } from '../../hooks/useCategories.js'

import * as postService from '../../services/postService.js'
import * as attachmentService from '../../services/attachmentService.js'

import RichTextEditor from '../../components/editor/RichTextEditor.jsx'

import { slugify } from '../../utils/slugify.js'
import { generateSlug } from '../../utils/generateSlug.js'

function CreatePostPage() {

  const navigate = useNavigate()

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories()

  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('draft')

  const [loading, setLoading] = useState(false)

  // ==========================
  // Attachments
  // ==========================

  const [attachments, setAttachments] = useState([])

  const [attachmentName, setAttachmentName] = useState('')

  const [attachmentUrl, setAttachmentUrl] = useState('')

  function addAttachment() {

    if (!attachmentName.trim()) {
      alert('Nama file wajib diisi')
      return
    }

    if (!attachmentUrl.trim()) {
      alert('URL file wajib diisi')
      return
    }

    setAttachments((prev) => [

      ...prev,

      {

        file_name: attachmentName,

        file_url: attachmentUrl,

        file_type:
          attachmentName
            .split('.')
            .pop()
            ?.toLowerCase() || '',

      },

    ])

    setAttachmentName('')

    setAttachmentUrl('')

  }

  function removeAttachment(index) {

    setAttachments(
      attachments.filter((_, i) => i !== index)
    )

  }

  async function handleSubmit(event) {

    event.preventDefault()

    if (!title.trim()) {
      alert('Title wajib diisi')
      return
    }

    if (!categoryId) {
      alert('Category wajib dipilih')
      return
    }

    try {

      setLoading(true)

      const post = await postService.create({
        title,
        slug: `${slugify(title)}-${Date.now()}`,
        excerpt,
        content,
        category_id: categoryId,
        status,
        cover_url: coverUrl || null,

        published_at:
          status === 'published'
            ? new Date().toISOString()
            : null,
      })
      
      for (const attachment of attachments) {

        await attachmentService.create({

          post_id: post.id,

          file_name: attachment.file_name,

          file_url: attachment.file_url,

          file_type: attachment.file_type,

        })

      }

      alert('Post berhasil dibuat!')

      navigate('/admin/posts')

    } catch (err) {

      console.error(err)

      alert(err.message)

    } finally {

      setLoading(false)

    }

  }
return (
  <div className="max-w-4xl">

    <h1 className="mb-6 text-2xl font-bold">
      Create Post
    </h1>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >

      <Input
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Masukkan judul post"
      />

      <Input
        id="coverUrl"
        label="Cover Image URL"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
        placeholder="https://example.com/image.jpg"
      />

      {coverUrl && (
        <img
          src={coverUrl}
          alt="Preview"
          className="h-56 w-full rounded-lg border object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}

      <Textarea
        id="excerpt"
        label="Excerpt"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={3}
        placeholder="Ringkasan artikel..."
      />

      <div>

        <label className="mb-2 block text-sm font-medium">
          Content
        </label>

        <RichTextEditor
          value={content}
          onChange={setContent}
        />

      </div>

      <Select
        id="category"
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        options={[
          {
            value: '',
            label: categoriesLoading
              ? 'Loading...'
              : '-- Pilih Category --',
          },
          ...categories.map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ]}
      />

      <Select
        id="status"
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          {
            value: 'draft',
            label: 'Draft',
          },
          {
            value: 'published',
            label: 'Published',
          },
        ]}
      />

      {/* ======================================== */}
      {/* Attachments */}
      {/* ======================================== */}

      <div className="rounded-xl border p-5">

        <h2 className="mb-5 text-lg font-semibold">
          Attachments
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <Input
            id="attachmentName"
            label="Nama File"
            value={attachmentName}
            onChange={(e) =>
              setAttachmentName(e.target.value)
            }
            placeholder="Surat Edaran.pdf"
          />

          <Input
            id="attachmentUrl"
            label="URL File"
            value={attachmentUrl}
            onChange={(e) =>
              setAttachmentUrl(e.target.value)
            }
            placeholder="https://..."
          />

        </div>

        <Button
          type="button"
          className="mt-4 border"
          onClick={addAttachment}
        >
          + Tambah Attachment
        </Button>

        {attachments.length > 0 && (

          <div className="mt-6 space-y-3">

            {attachments.map((item, index) => (

              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >

                <div>

                  <p className="font-medium">

                    📎 {item.file_name}

                  </p>

                  <p className="text-sm text-gray-500 break-all">

                    {item.file_url}

                  </p>

                </div>

                <Button
                  type="button"
                  className="border text-red-600"
                  onClick={() =>
                    removeAttachment(index)
                  }
                >
                  Hapus
                </Button>

              </div>

            ))}

          </div>

        )}

      </div>

      <div className="mt-5 flex gap-3">

        <Button
          type="submit"
          className="bg-gray-900 text-white"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>

        <Button
          type="button"
          className="border"
          onClick={() =>
            navigate('/admin/posts')
          }
        >
          Cancel
        </Button>

      </div>

    </form>

  </div>
)
}

export default CreatePostPage