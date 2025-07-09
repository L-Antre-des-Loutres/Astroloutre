// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    define: {
      'import.meta.env.JWT_SECRET': JSON.stringify(process.env.ASTRO_JWT_SECRET),
    },
    plugins: [tailwindcss()]
  }
});