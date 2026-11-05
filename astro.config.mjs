// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const horsSitemap = ['/design-system', '/merci'];

export default defineConfig({
  site: 'https://www.holocene-restaurant.fr',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !horsSitemap.some((route) => new URL(page).pathname.startsWith(route)),
    }),
  ],
});
