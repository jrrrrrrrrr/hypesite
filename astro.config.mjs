// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Static pages by default (fast, cacheable). API routes opt into
// on-demand rendering via `export const prerender = false`.
export default defineConfig({
  site: 'https://hype-site.com',
  adapter: vercel(),
  output: 'static',
  prefetch: true,
});
