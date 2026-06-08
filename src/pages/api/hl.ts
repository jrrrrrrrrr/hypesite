import type { APIRoute } from 'astro';

export const prerender = false;

// Proxy POSTs to Hyperliquid's public info endpoint. Keeps the upstream
// origin off the client and lets us add caching/error handling centrally.
export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }
  try {
    const upstream = await fetch('https://api.hyperliquid.xyz/info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'public, s-maxage=8, stale-while-revalidate=60',
      },
    });
  } catch {
    return json({ error: 'upstream_failed' }, 502);
  }
};

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
