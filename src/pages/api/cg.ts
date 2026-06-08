import type { APIRoute } from 'astro';

export const prerender = false;

const TTL = 30; // seconds of CDN cache

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id') || 'hyperliquid';
  const endpoint = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
    id
  )}&precision=6`;
  try {
    const resp = await fetch(endpoint, { headers: { accept: 'application/json' } });
    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, s-maxage=${TTL}, stale-while-revalidate=120`,
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
