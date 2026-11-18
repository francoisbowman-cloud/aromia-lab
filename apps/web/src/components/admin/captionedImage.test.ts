// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { Editor, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { CaptionedImage } from './captionedImage';
describe('patched editorial editor boundary', () => {
  it('does not promote own __proto__ payload into executable inherited attributes', () => {
    for (const attribute of ['onerror', 'onclick']) {
      const input = JSON.parse(`{"__proto__":{"${attribute}":"alert(1)"},"alt":"source"}`);
      const merged = mergeAttributes({}, input);
      expect(merged[attribute]).toBeUndefined();
      expect(merged.alt).toBe('source');
      expect(Object.getPrototypeOf(merged)).toBe(Object.prototype);
    }
  });
  it('edits, serializes and rehydrates headings, lists and image credits without loss', () => {
    const create = (content: string) => new Editor({extensions:[StarterKit, CaptionedImage], content});
    const editor = create('<h2>Materia y memoria</h2><p>Una historia <strong>editorial</strong>.</p><ul><li>Lectura</li></ul>');
    editor.commands.insertContentAt(editor.state.doc.content.size, {type:'image', attrs:{src:'/editorial-v1/bergamot-editorial-v2.webp',alt:'Bergamota',caption:'Autor · CC BY-SA 2.0'}});
    const saved = editor.getHTML();
    const restored = create(saved);
    expect(restored.getHTML()).toBe(saved);
    expect(saved).toContain('<h2>Materia y memoria</h2>');
    expect(saved).toContain('<strong>editorial</strong>');
    expect(saved).toContain('Autor · CC BY-SA 2.0');
    expect(saved).toContain('alt="Bergamota"');
    restored.commands.setContent('<p>Edición recuperada</p>', {emitUpdate:false});
    expect(restored.getText()).toBe('Edición recuperada');
    editor.destroy(); restored.destroy();
  });
});
