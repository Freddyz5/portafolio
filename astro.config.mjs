import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://freddyz5.github.io',
  base: '/',
  env: {
    schema: {
      PUBLIC_JSON_ENDPOINT: envField.string({
        context: "client",
        access: "public"
      }),
      PUBLIC_ACCESS_KEY: envField.string({
        context: "client",
        access: "public"
      }),
      PUBLIC_ACCESS_KEY_EMAIL: envField.string({
        context: "client",
        access: "public"
      }),
    }
  }
});
