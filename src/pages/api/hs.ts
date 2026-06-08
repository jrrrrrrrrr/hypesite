import type { APIRoute } from 'astro';

export const prerender = false;

const ORIGIN = 'https://api.hypurrscan.io';

// Generic, path-scoped proxy to HypurrScan. Use ?path=/v0/...
export const GET: APIRoute = async ({ url }) => {
  const path = url.searchParams.get('path') || '';
  if (!path.startsWith('/')) {
    return new Response(JSON.stringify({ error: 'missing_or_bad_path', hint: 'Use ?path=/v0/...' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const fwd = new URL(ORIGIN + path);
  url.searchParams.forEach((val, key) => {
    if (key !== 'path') fwd.searchParams.set(key, val);
  });
  try {
    const r = await fetch(fwd.toString(), { headers: { accept: 'application/json' } });
    const txt = await r.text();
    return new Response(txt, {
      status: r.ok ? 200 : r.status,
      headers: {
        'Content-Type': r.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=120',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
