import { expect, it, vi } from 'vitest';
const read = vi.hoisted(() => vi.fn());
vi.mock('./api', () => ({ getArticuloBySlug: read }));
import { getStoryMarkdown } from './storyAvailability';
it('uses the unavailable-page contract when a story has not been installed', async () => {
  read.mockResolvedValue(null);
  await expect(getStoryMarkdown('huele-sintetico-que-estamos-diciendo')).rejects.toMatchObject({ digest: expect.stringMatching(/^NEXT_(?:NOT_FOUND|HTTP_ERROR_FALLBACK;404)$/) });
});
it('does not attempt to render an article without its story source', async () => {
  read.mockResolvedValue({ titulo: 'Fixture without story body', contenido_markdown: null });
  await expect(getStoryMarkdown('huele-sintetico-que-estamos-diciendo')).rejects.toMatchObject({ digest: expect.stringMatching(/^NEXT_(?:NOT_FOUND|HTTP_ERROR_FALLBACK;404)$/) });
});
