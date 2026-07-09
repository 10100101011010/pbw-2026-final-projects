import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Input from '../../components/common/Input.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Select from '../../components/common/Select.jsx'
import Button from '../../components/common/Button.jsx'

import RichTextEditor from '../../components/editor/RichTextEditor.jsx'

import { useCategories } from '../../hooks/useCategories.js'

import * as postService from '../../services/postService.js'
import * as attachmentService from '../../services/attachmentService.js'

function EditPostPage() {

  const { id } = useParams()

  const navigate = useNavigate()

  const { categories } = useCategories()

  const [title, setTitle] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('draft')

  const [attachments, setAttachments] = useState([])

  const [attachmentName, setAttachmentName] =
    useState('')

  const [attachmentUrl, setAttachmentUrl] =
    useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {

    try {

      setLoading(true)

      const post =
        await postService.getById(id)

      setTitle(post.title ?? '')
      setCoverUrl(post.cover_url ?? '')
      setExcerpt(post.excerpt ?? '')
      setContent(post.content ?? '')
      setCategoryId(post.category_id ?? '')
      setStatus(post.status ?? 'draft')

      const files =
        await attachmentService.getByPost(post.id)

      setAttachments(files)

    } catch (err) {

      console.error(err)

      alert(err.message)

    } finally {

      setLoading(false)

    }

  }

  function addAttachment() {

    if (!attachmentName.trim()) {

      alert('Nama file wajib diisi')

      return

    }

    if (!attachmentUrl.trim()) {

      alert('URL wajib diisi')

      return

    }

    setAttachments((prev) => [

      ...prev,

      {

        id: crypto.randomUUID(),

        file_name: attachmentName,

        file_url: attachmentUrl,

        file_type:
          attachmentName
            .split('.')
            .pop()
            ?.toLowerCase() || '',

        isNew: true,

      },

    ])

    setAttachmentName('')

    setAttachmentUrl('')

  }

  async function removeAttachment(file) {

    try {

      if (!file.isNew) {

        await attachmentService.remove(file.id)

      }

      setAttachments((prev) =>
        prev.filter((item) => item.id !== file.id)
      )

    } catch (err) {

      console.error(err)

      alert(err.message)

    }

  }

  async function handleSubmit(event) {

    event.preventDefault()

    try {

      setLoading(true)

      await postService.update(id, {

        title,

        cover_url: coverUrl,

        excerpt,

        content,

        category_id: categoryId,

        status,

      })

      for (const file of attachments) {

        if (file.isNew) {

          await attachmentService.create({

            post_id: id,

            file_name: file.file_name,

            file_url: file.file_url,

            file_type: file.file_type,

          })

        }

      }

      alert('Post berhasil diupdate.')

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

        Edit Post

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
        />

        <Input
          id="coverUrl"
          label="Cover Image URL"
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          placeholder="https://..."
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
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
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
              label: 'Pilih Category',
            },
            ...categories.map((c) => ({
              value: c.id,
              label: c.name,
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
            {
              value: 'archived',
              label: 'Archived',
            },
          ]}
        />

        {/* =============================== */}
        {/* Attachments */}
        {/* =============================== */}

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

              {attachments.map((file) => (

                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >

                  <div>

                    <p className="font-medium">

                      📎 {file.file_name}

                    </p>

                    <p className="break-all text-sm text-gray-500">

                      {file.file_url}

                    </p>

                  </div>

                  <Button
                    type="button"
                    className="border text-red-600"
                    onClick={() =>
                      removeAttachment(file)
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
            disabled={loading}
            className="bg-gray-900 text-white"
          >

            {loading
              ? 'Updating...'
              : 'Update'}

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

export default EditPostPage