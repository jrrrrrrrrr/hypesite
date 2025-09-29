// /api/hs.ts — generic GET proxy to HypurrScan (Edge, cached)
export const config = { runtime: 'edge' };

const ORIGIN = 'https://api.hypurrscan.io';

export default async (req: Request) => {
  const u = new URL(req.url);
  // Required: path=/v0/whatever (exact path from Swagger UI)
  const path = u.searchParams.get('path') || '';
  if (!path.startsWith('/')) {
    return new Response(JSON.stringify({ error: 'missing_or_bad_path', hint: 'Use ?path=/v0/...' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Forward any extra query params transparently: ?foo=bar
  const fwd = new URL(ORIGIN + path);
  u.searchParams.forEach((val, key) => {
    if (key !== 'path') fwd.searchParams.set(key, val);
  });

  try {
    const r = await fetch(fwd.toString(), {
      headers: { accept: 'application/json' },
    });

    // On 4xx/5xx, return the text to help debugging (don’t break UI)
    const txt = await r.text();
    return new Response(txt, {
      status: r.ok ? 200 : r.status,
      headers: {
        'Content-Type': r.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'public, s-maxage=20, stale-while-revalidate=120',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'upstream_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
