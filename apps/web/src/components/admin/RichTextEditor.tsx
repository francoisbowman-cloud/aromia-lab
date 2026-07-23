"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

export function RichTextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[330px] rounded-b border border-t-0 border-admin-border p-5 font-display text-base leading-relaxed outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (!editor) return null;

  const toolbarBtn = (active: boolean) =>
    `rounded px-2 py-1 transition ${
      active ? "bg-gold/15 font-semibold text-gold-contrast" : "text-admin-muted hover:bg-admin-surface hover:text-admin-text"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-t border border-admin-border bg-admin-bg px-2 py-1.5 font-sans text-xs">
        <button
          type="button"
          aria-label="Negrita"
          aria-pressed={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtn(editor.isActive("bold"))}
        >
          B
        </button>
        <button
          type="button"
          aria-label="Cursiva"
          aria-pressed={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarBtn(editor.isActive("italic"))}
        >
          I
        </button>
        <button
          type="button"
          aria-label="Subtítulo"
          aria-pressed={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarBtn(editor.isActive("heading", { level: 3 }))}
        >
          H3
        </button>
        <button
          type="button"
          aria-label="Lista"
          aria-pressed={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtn(editor.isActive("bulletList"))}
        >
          Lista
        </button>
        <button
          type="button"
          aria-label="Cita"
          aria-pressed={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarBtn(editor.isActive("blockquote"))}
        >
          Cita
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
