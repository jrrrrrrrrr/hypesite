export const config = { runtime: 'edge' };

export default async () => {
  try {
    const r = await fetch('https://api.hypurrscan.io/v0/builders/revenues', {
      headers: { accept: 'application/json' },
    });
    const txt = await r.text();
    return new Response(txt, {
      status: r.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
