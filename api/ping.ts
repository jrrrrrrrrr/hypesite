export const config = { runtime: 'edge' };
export default async () =>
  new Response(JSON.stringify({ ok: true, where: 'edge' }), {
    headers: { 'Content-Type': 'application/json' },
  });
