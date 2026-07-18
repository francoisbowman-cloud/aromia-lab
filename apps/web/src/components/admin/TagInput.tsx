"use client";

import { useState } from "react";

export function TagInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const trimmed = draft.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setDraft("");
  }

  return (
    <div>
      <label className="font-sans text-[11px] font-bold uppercase text-admin-muted">
        {label}
      </label>
      <div className="mt-1.5 min-h-[82px] rounded border border-admin-border bg-admin-surface p-2">
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded bg-admin-bg px-2 py-1 font-sans text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Quitar ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          placeholder="Agregar nota…"
          className="mt-2 w-full border-0 bg-transparent font-sans text-sm outline-none"
        />
      </div>
    </div>
  );
}
