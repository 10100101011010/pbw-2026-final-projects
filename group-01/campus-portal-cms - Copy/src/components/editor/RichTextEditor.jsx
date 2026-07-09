import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

function RichTextEditor({
  value,
  onChange,
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
      }),

      Image,

      Placeholder.configure({
        placeholder: 'Tulis isi artikel di sini...',
      }),
    ],

    content: value,

    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (
      editor &&
      value !== editor.getHTML()
    ) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="rounded-lg border">

      <Toolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="min-h-[350px] p-5"
      />

    </div>
  )
}

function Toolbar({ editor }) {
  return (
    <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-3">

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="rounded border px-3 py-1"
      >
        Bold
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="rounded border px-3 py-1"
      >
        Italic
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className="rounded border px-3 py-1"
      >
        H1
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className="rounded border px-3 py-1"
      >
        H2
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
        className="rounded border px-3 py-1"
      >
        • List
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
        className="rounded border px-3 py-1"
      >
        1. List
      </button>

    </div>
  )
}

export default RichTextEditor