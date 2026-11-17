"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId, useRef, useState } from "react";
import { CaptionedImage } from "./captionedImage";

export function RichTextEditor({
  content,
  onChange,
  onUploadImage,
}: {
  content: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
}) {
  const id = useId();
  const [imageOpen, setImageOpen] = useState(false);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const insertion = useRef({ from: 0, to: 0 });
  const editor = useEditor({
    extensions: [StarterKit, CaptionedImage],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        role: "textbox", "aria-label": "Contenido del artículo", "aria-multiline": "true",
        class:
          "admin-richtext min-h-[330px] rounded-b border border-t-0 border-admin-border p-5 font-display text-base leading-relaxed outline-none",
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
      active ? "bg-[color:color-mix(in_srgb,var(--gold)_15%,transparent)] font-semibold text-gold-contrast" : "text-admin-muted hover:bg-admin-surface hover:text-admin-text"
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
        {onUploadImage ? <button type="button" aria-expanded={imageOpen} aria-controls={`${id}-image-panel`}
          className={toolbarBtn(false)} onClick={() => {
            insertion.current = { from: editor.state.selection.from, to: editor.state.selection.to };
            const selected = editor.isActive("image"); setEditingImage(selected);
            const attrs = selected ? editor.getAttributes("image") : {};
            setAlt(attrs.alt ?? ""); setCaption(attrs.caption ?? ""); setImageError(false); setImageOpen((open) => !open);
          }}>Imagen</button> : null}
      </div>
      {imageOpen ? <fieldset id={`${id}-image-panel`} className="space-y-3 border-x border-admin-border bg-admin-bg p-4 text-sm">
        <legend className="sr-only">Imagen intercalada</legend>
        <div><label htmlFor={`${id}-alt`}>Texto alternativo</label><input id={`${id}-alt`} value={alt}
          onChange={(event) => setAlt(event.target.value)} className="mt-1 w-full rounded border border-admin-border p-2" /></div>
        <div><label htmlFor={`${id}-caption`}>Pie de foto y fuente</label><input id={`${id}-caption`} value={caption}
          onChange={(event) => setCaption(event.target.value)} className="mt-1 w-full rounded border border-admin-border p-2" /></div>
        {editingImage ? <button type="button" disabled={!alt.trim() || !caption.trim()} className="min-h-11 underline disabled:opacity-50"
          onClick={() => { editor.chain().focus().updateAttributes("image", { alt, caption }).run(); setImageOpen(false); }}>Actualizar texto de la imagen</button> : null}
        <div><label htmlFor={`${id}-file`}>Subir imagen PNG, JPG o WEBP (hasta 5MB)</label>
          <input id={`${id}-file`} type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading || !alt.trim() || !caption.trim()}
            className="mt-2 block min-h-11 w-full" onChange={async (event) => {
              const file = event.target.files?.[0]; const input = event.target; if (!file || !onUploadImage) return;
              if (file.size > 5 * 1024 * 1024 || !["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setImageError(true); input.value = ""; return; }
              setUploading(true); setImageError(false);
              try {
                const src = await onUploadImage(file);
                if (!editor.isDestroyed) {
                  editor.chain().focus().insertContentAt(insertion.current, [{ type: "image", attrs: { src, alt: alt.trim(), caption: caption.trim() } }, { type: "paragraph" }]).run();
                  setImageOpen(false);
                }
              } catch { setImageError(true); }
              finally { setUploading(false); input.value = ""; }
            }} /></div>
        {uploading ? <p role="status">Subiendo imagen…</p> : null}
        {imageError ? <p role="alert">No se pudo insertar la imagen. El texto sigue en el editor; puedes reintentar.</p> : null}
      </fieldset> : null}
      <EditorContent editor={editor} />
    </div>
  );
}
