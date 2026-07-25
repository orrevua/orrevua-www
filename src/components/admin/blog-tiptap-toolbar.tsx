"use client"

import { useRef } from "react"
import type { Editor } from "@tiptap/react"

type BtnProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}

function Btn({ onClick, active, disabled, label, children }: BtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`rounded px-2 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-accent text-bg-primary"
          : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
      }`}
    >
      {children}
    </button>
  )
}

export function BlogTiptapToolbar({
  editor,
  onImagePicked,
  disabled,
  imageDisabled,
}: {
  editor: Editor | null
  onImagePicked: (file: File) => void | Promise<void>
  disabled?: boolean
  imageDisabled?: boolean
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const noEditor = !editor || disabled

  function withEditor(fn: (e: Editor) => void) {
    return () => {
      if (!editor) return
      fn(editor)
    }
  }

  function handleLink() {
    if (!editor) return
    const previous = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL", previous ?? "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/") && !url.startsWith("#")) {
      window.alert("Link must be http(s), a same-origin path, or an anchor.")
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  function handleImageClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (file) onImagePicked(file)
  }

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-2">
      <Btn label="Heading 2" disabled={noEditor} active={editor?.isActive("heading", { level: 2 })} onClick={withEditor((e) => e.chain().focus().toggleHeading({ level: 2 }).run())}>H2</Btn>
      <Btn label="Heading 3" disabled={noEditor} active={editor?.isActive("heading", { level: 3 })} onClick={withEditor((e) => e.chain().focus().toggleHeading({ level: 3 }).run())}>H3</Btn>
      <span className="mx-1 h-4 w-px bg-border" />
      <Btn label="Bold" disabled={noEditor} active={editor?.isActive("bold")} onClick={withEditor((e) => e.chain().focus().toggleBold().run())}><span className="font-bold">B</span></Btn>
      <Btn label="Italic" disabled={noEditor} active={editor?.isActive("italic")} onClick={withEditor((e) => e.chain().focus().toggleItalic().run())}><span className="italic">I</span></Btn>
      <span className="mx-1 h-4 w-px bg-border" />
      <Btn label="Bullet list" disabled={noEditor} active={editor?.isActive("bulletList")} onClick={withEditor((e) => e.chain().focus().toggleBulletList().run())}>• List</Btn>
      <Btn label="Ordered list" disabled={noEditor} active={editor?.isActive("orderedList")} onClick={withEditor((e) => e.chain().focus().toggleOrderedList().run())}>1. List</Btn>
      <Btn label="Blockquote" disabled={noEditor} active={editor?.isActive("blockquote")} onClick={withEditor((e) => e.chain().focus().toggleBlockquote().run())}>&ldquo;</Btn>
      <Btn label="Inline code" disabled={noEditor} active={editor?.isActive("code")} onClick={withEditor((e) => e.chain().focus().toggleCode().run())}>&lt;/&gt;</Btn>
      <Btn label="Code block" disabled={noEditor} active={editor?.isActive("codeBlock")} onClick={withEditor((e) => e.chain().focus().toggleCodeBlock().run())}>⟨⟩</Btn>
      <span className="mx-1 h-4 w-px bg-border" />
      <Btn label="Link" disabled={noEditor} active={editor?.isActive("link")} onClick={handleLink}>🔗</Btn>
      <Btn label="Insert image" disabled={noEditor || imageDisabled} onClick={handleImageClick}>🖼</Btn>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
