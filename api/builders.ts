// api/builders.ts
// Runtime: Node so we can use npm libs (lz4, csv-parse)
export const config = { runtime: 'nodejs18.x' };

// Minimal deps: lz4js (pure JS) + csv-parse (small, fast)
import lz4 from 'lz4js';
import { parse } from 'csv-parse/sync';

type Fill = {
  // Columns in HL CSVs can evolve; we read defensively.
  // We’ll try common names like 'fee', 'fee_usdc' etc.
  [k: string]: string | number;
};

const BUILDERS: string[] = [
  // TODO: add the builder addresses you want to track (must be lowercase!)
  // '0xabc123...',
];

function yyyymmdd(d = new Date()) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}${m}${day}`;
}

async function fetchCsvLz4(url: string): Promise<Uint8Array | null> {
  const r = await fetch(url);
  if (!r.ok) return null;
  const buf = new Uint8Array(await r.arrayBuffer());
  return buf;
}

function decompressLz4(buf: Uint8Array): string {
  // lz4js expects Uint8Array, returns Uint8Array
  const out = lz4.decompress(buf);
  // Assume UTF-8 text
  return new TextDecoder().decode(out);
}

function parseFeeSum(csvText: string): number {
  if (!csvText || csvText.length === 0) return 0;
  const recs: Fill[] = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });

  let sum = 0;
  for (const r of recs) {
    // Try common fee column names; adjust if needed
    const raw =
      (r['fee_usdc'] as string) ??
      (r['fee'] as string) ??
      (r['builder_fee'] as string) ??
      (r['builder_fee_usdc'] as string);

    const v = Number(raw ?? 0);
    if (!Number.isNaN(v)) sum += v;
  }
  return sum;
}

async function sumBuilderForDate(addr: string, dateStr: string): Promise<number> {
  // Docs: https://stats-data.hyperliquid.xyz/Mainnet/builder_fills/{builder_addr}/{YYYYMMDD}.csv.lz4
  // NOTE: address must be lowercase (docs). 
  const url = `https://stats-data.hyperliquid.xyz/Mainnet/builder_fills/${addr}/${dateStr}.csv.lz4`;
  const lz4Buf = await fetchCsvLz4(url);
  if (!lz4Buf) return 0;
  try {
    const csv = decompressLz4(lz4Buf);
    return parseFeeSum(csv);
  } catch {
    return 0;
  }
}

export default async (req: Request) => {
  try {
    const u = new URL(req.url);
    // Allow overriding addresses via query ?builders=0xabc,0xdef
    // and a custom day (UTC) via ?date=YYYYMMDD (for testing)
    const param = u.searchParams.get('builders');
    const dateParam = u.searchParams.get('date'); // optional
    const addrs =
      (param ? param.split(',').map(s => s.trim().toLowerCase()) : BUILDERS)
        .filter(Boolean);

    // If no builders configured, return empty so UI can show "Unavailable"
    if (addrs.length === 0) {
      return new Response(JSON.stringify({ total24h: 0, perBuilder: [] }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=15' },
      });
    }

    // Compute rolling 24h = today UTC + yesterday UTC
    const now = new Date();
    const today = dateParam || yyyymmdd(now);
    const yestDate = new Date(Date.UTC(
      now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1
    ));
    const yesterday = yyyymmdd(yestDate);

    // Sum for each builder for both days (approx rolling 24h)
    const perBuilder = [];
    for (const a of addrs) {
      const [s1, s2] = await Promise.all([
        sumBuilderForDate(a, today),
        sumBuilderForDate(a, yesterday),
      ]);
      perBuilder.push({ builder: a, fee24h: s1 + s2 });
    }

    const total24h = perBuilder.reduce((s, x) => s + x.fee24h, 0);
    return new Response(JSON.stringify({ total24h, perBuilder }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'server_error', detail: String(e?.message || e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
