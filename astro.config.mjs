import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://chiramelco.com',
  base: process.env.PREVIEW_BASE || '/',
  trailingSlash: 'never',
});
