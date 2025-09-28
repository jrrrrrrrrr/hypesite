export const config = { runtime: 'edge' };

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Only POST', { status: 405 });
  const body = await req.json();
  const upstream = await fetch('https://api.hyperliquid.xyz/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return new Response(upstream.body, {
    status: upstream.status,
    headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json' }
  });
};
