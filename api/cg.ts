export const config = { runtime: 'edge' };

const TTL = 30; // cache seconds
export default async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') || 'hyperliquid';  // ✅ fixed slug
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(id)}&precision=6`;
  const resp = await fetch(url, { headers: { accept: 'application/json' } });
  const text = await resp.text();
  return new Response(text, {
    status: resp.status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, s-maxage=${TTL}, stale-while-revalidate=120`
    }
  });
};
