// @ts-check
import {defineConfig} from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import mdx from "@astrojs/mdx";

import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
    site: 'https://antredesloutres.fr',
    integrations: [react(), sitemap(), mdx(), robotsTxt()],

  vite: {
    plugins: [tailwindcss()]
  }
});