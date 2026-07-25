"use client"

import { useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { BlogTiptapToolbar } from "./blog-tiptap-toolbar"

const PendingImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dataPending: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("data-pending"),
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs.dataPending) return {}
          return { "data-pending": attrs.dataPending as string }
        },
      },
    }
  },
})

export function BlogTiptapEditor({
  html,
  onChange,
  onImagePicked,
  disabled,
  imageCount,
  maxImages,
}: {
  html: string
  onChange: (html: string) => void
  onImagePicked: (file: File) => void | Promise<void>
  disabled?: boolean
  imageCount: number
  maxImages: number
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      PendingImage.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder: "Write your post…" }),
    ],
    content: html,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose-blog min-h-[400px] focus:outline-none",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== html) {
      editor.commands.setContent(html || "", { emitUpdate: false })
    }
  }, [html, editor])

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  useEffect(() => {
    if (!editor) return
    function handleInsert(e: Event) {
      const detail = (e as CustomEvent<{ blobUrl: string; filename: string; alt: string }>).detail
      if (!detail) return
      editor!
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: { src: detail.blobUrl, alt: detail.alt, dataPending: detail.filename },
        })
        .run()
    }
    window.addEventListener("blog-editor:insert-image", handleInsert)
    return () => window.removeEventListener("blog-editor:insert-image", handleInsert)
  }, [editor])

  return (
    <div className="rounded-lg border border-border bg-bg-secondary">
      <BlogTiptapToolbar
        editor={editor}
        onImagePicked={onImagePicked}
        disabled={disabled}
        imageDisabled={imageCount >= maxImages}
      />
      <div className="border-t border-border p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
