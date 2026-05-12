import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  output: 'static',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    wasm: {
      modules: ['buffer', 'stream'],
    },
    strictStream: false,
  }),
  image: {
    domains: ['cdn.simpleicons.org', 'img.icons8.com'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.simpleicons.org' },
      { protocol: 'https', hostname: 'img.icons8.com' },
    ],
    optimization: {
      formats: ['webp', 'avif'],
      quality: 80,
      sizes: [320, 640, 960, 1280],
    },
  },
  vite: {
    build: {
      cssMinify: true,
      minify: true,
    },
  },
});