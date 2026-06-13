// Client-side data helpers. All REST calls go through our own /api proxies
// (caching + no CORS surprises). The trades websocket connects directly.

export const AF_ADDRESS = '0xfefefefefefefefefefefefefefefefefefefefe';
export const MAX_SUPPLY = 1e9;
export const WS_URL = 'wss://api.hyperliquid.xyz/ws';

export async function hlInfo<T = any>(body: Record<string, unknown>): Promise<T> {
  const r = await fetch('/api/hl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('hl ' + r.status);
  return r.json();
}

export async function hsGet<T = any>(path: string): Promise<T | null> {
  try {
    const r = await fetch('/api/hs?path=' + encodeURIComponent(path));
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function hypeMarket(): Promise<{
  price: number | null;
  change24h: number | null;
  marketCap: number | null;
  volume: number | null;
} > {
  try {
    const r = await fetch('/api/cg?id=hyperliquid');
    if (!r.ok) return { price: null, change24h: null, marketCap: null, volume: null };
    const d = (await r.json())?.[0];
    return {
      price: num(d?.current_price),
      change24h: num(d?.price_change_percentage_24h),
      marketCap: num(d?.market_cap),
      volume: num(d?.total_volume),
    };
  } catch {
    return { price: null, change24h: null, marketCap: null, volume: null };
  }
}

function num(v: unknown): number | null {
  const n = Number(v);
  return isFinite(n) ? n : null;
}

// Hyperliquid sometimes returns staked amounts in odd units; find the divisor
// that lands the total in the 10M–1B HYPE range (max supply = 1B).
export function stakeDivisor(rawSum: number): number {
  for (const test of [1, 1e2, 1e4, 1e6, 1e8, 1e10, 1e12, 1e14, 1e16, 1e18]) {
    const t = rawSum / test;
    if (t >= 1e7 && t <= 1e9) return test;
  }
  return 1;
}

// ── formatters ──
export const F = {
  c(n: number | null | undefined): string {
    if (n == null || !isFinite(n)) return '—';
    const a = Math.abs(+n), s = +n < 0 ? '-' : '';
    if (a >= 1e9) return s + (a / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return s + (a / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return s + (a / 1e3).toFixed(1) + 'K';
    return s + a.toFixed(2);
  },
  uc(n: number | null | undefined): string {
    if (n == null || !isFinite(n)) return '—';
    return '$' + F.c(n);
  },
  f2(n: number | null | undefined): string {
    return n == null || !isFinite(+n) ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
  f4(n: number | null | undefined): string {
    return n == null || !isFinite(+n) ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  },
  pct(n: number | null | undefined): string {
    return n == null || !isFinite(+n) ? '—' : (+n).toFixed(2) + '%';
  },
  time(ms: number): string {
    return new Date(ms).toLocaleTimeString('en-US', { hour12: false });
  },
  addr(a: string): string {
    return a && a.length > 12 ? a.slice(0, 6) + '…' + a.slice(-4) : a;
  },
  // Full-precision format from the original dashboard: 45,898,020.17
  hype(n: number | null | undefined): string {
    return n == null || !isFinite(+n) ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
  full(n: number | null | undefined): string {
    return n == null || !isFinite(+n) ? '—' : Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  },
};

export function setText(id: string, v: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = v;
}
