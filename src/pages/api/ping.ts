import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ ok: true, service: 'hype-site', ts: Date.now() }), {
    headers: { 'Content-Type': 'application/json' },
  });
