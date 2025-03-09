import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://freddyz5.github.io',
  base: 'portafolio',

  vite: {
    plugins: [tailwindcss()],
  },
});