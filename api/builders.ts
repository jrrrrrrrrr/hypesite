// /api/builders.ts
// Node runtime (needed for LZ4 + CSV parsing)
export const config = { runtime: 'nodejs' };

import lz4 from 'lz4js';
import { parse } from 'csv-parse/sync';

type BuilderCfg = { addr: string; label?: string };
type FillRow = Record<string, string | number>;

function parseBuildersParam(param: string | null | undefined): BuilderCfg[] {
  if (!param) return [];
  return param
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(item => {
      const [addrRaw, label] = item.split(':');
      const addr = (addrRaw || '').trim().toLowerCase();
      if (!addr.startsWith('0x') || addr.length !== 42) return null;
      return { addr, label: (label || '').trim() || undefined };
    })
    .filter((x): x is BuilderCfg => !!x);
}

function getConfiguredBuilders(url: URL): BuilderCfg[] {
  const fromQuery = parseBuildersParam(url.searchParams.get('builders'));
  if (fromQuery.length) return fromQuery;
  const envStr = process.env.BUILDER_ADDRESSES || '';
  const fromEnv = parseBuildersParam(envStr);
  return fromEnv;
}

function yyyymmdd(d = new Date()): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

async function fetchLz4(url: string): Promise<Uint8Array | null> {
  const r = await fetch(url);
  if (!r.ok) return null;
  return new Uint8Array(await r.arrayBuffer());
}

function decompressLz4ToText(buf: Uint8Array): string {
  const out = lz4.decompress(buf);
  return new TextDecoder().decode(out);
}

function sumFees(csvText: string): number {
  if (!csvText) return 0;
  const rows: FillRow[] = parse(csvText, { columns: true, skip_empty_lines: true });
  let sum = 0;
  for (const r of rows) {
    const raw =
      (r['fee_usdc'] as string) ??
      (r['builder_fee_usdc'] as string) ??
      (r['fee'] as string) ??
      (r['builder_fee'] as string);
    const v = Number(raw ?? 0);
    if (!Number.isNaN(v)) sum += v;
  }
  return sum;
}

async function sumForDate(addr: string, dateStr: string): Promise<number> {
  const url = `https://stats-data.hyperliquid.xyz/Mainnet/builder_fills/${addr}/${dateStr}.csv.lz4`;
  const buf = await fetchLz4(url);
  if (!buf) return 0;
  try {
    const csv = decompressLz4ToText(buf);
    return sumFees(csv);
  } catch {
    return 0;
  }
}

export default async (req: Request) => {
  try {
    const url = new URL(req.url);
    const builders = getConfiguredBuilders(url);

    if (builders.length === 0) {
      return new Response(
        JSON.stringify({
          total24h: 0,
          perBuilder: [],
          note:
            'No builders configured. Pass ?builders=0xaddr:Label,0xaddr2:Label or set BUILDER_ADDRESSES env var (addresses must be lowercase).',
        }),
        { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=15' } }
      );
    }

    const now = new Date();
    const today = yyyymmdd(now);
    const yest = yyyymmdd(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)));

    const perBuilder = [];
    for (const b of builders) {
      const [t0, t1] = await Promise.all([sumForDate(b.addr, today), sumForDate(b.addr, yest)]);
      perBuilder.push({ builder: b.addr, label: b.label || b.addr.slice(0, 6), fee24h: t0 + t1 });
    }

    perBuilder.sort((a, b) => b.fee24h - a.fee24h);
    const top10 = perBuilder.slice(0, 10);
    const total24h = top10.reduce((s, x) => s + x.fee24h, 0);

    return new Response(JSON.stringify({ total24h, perBuilder: top10 }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'server_error', detail: String(e?.message || e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
