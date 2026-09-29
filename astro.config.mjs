// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// On GitHub Pages the deploy workflow sets SITE_ORIGIN / BASE_PATH from the
// repository's Pages settings (e.g. https://<org>.github.io + /<repo>).
// Locally both fall back to serving from the root.
export default defineConfig({
  site: process.env.SITE_ORIGIN || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  // Custom icons live in src/data/icons (used via `image:` in landing.yaml).
  integrations: [icon({ iconDir: 'src/data/icons' })],
});
