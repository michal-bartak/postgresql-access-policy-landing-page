import { defineCollection, type SchemaContext } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { load } from 'js-yaml';

const tile = (image: SchemaContext['image']) =>
  z
    .object({
      kind: z.literal('tile'),
      title: z.string(),
      description: z.string(),
      // A web address, or a file next to landing.yaml, e.g. "./slides.pdf" (published with the site)
      url: z.union([z.url(), z.string().startsWith('./', 'Use a full https:// address or a path like "./slides.pdf"')]),
      // Iconify name, e.g. "lucide:presentation" or "simple-icons:github"
      icon: z.string().regex(/^[a-z0-9-]+:[a-z0-9-]+$/, 'Use an Iconify name like "lucide:book-open" (for your own files use image: ./icons/<file>)').optional(),
      // Your own icon/image, relative to landing.yaml, e.g. "./icons/my-app.png"
      image: image().optional(),
      highlight: z.boolean().default(false),
      // Show the tile but make it non-clickable: true -> "Coming soon", or your own label text
      disabled: z.union([z.boolean(), z.string()]).default(false),
    })
    .refine((t) => Boolean(t.icon) !== Boolean(t.image), {
      message: 'Each tile needs exactly one of "icon" or "image"',
    });

// A divider with a label, e.g. `- section: Affiliated apps`
const section = z.object({ kind: z.literal('section'), section: z.string() });

// Tag each list item as a tile or a section, so validation errors point at the
// offending field instead of a generic "did not match union".
const item = (image: SchemaContext['image']) =>
  z.preprocess(
    (v) => (v && typeof v === 'object' ? { kind: 'section' in v ? 'section' : 'tile', ...v } : v),
    z.discriminatedUnion('kind', [section, tile(image)]),
  );

const landing = defineCollection({
  // The whole YAML file is a single entry with id "landing".
  loader: file('src/data/landing.yaml', {
    parser: (text) => ({ landing: load(text) as Record<string, unknown> }),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      footer: z.string().optional(),
      tiles: z.array(item(image)).min(1),
    }),
});

export const collections = { landing };
