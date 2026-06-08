// Formatting helpers (safe for client + server use).

export function fmtUsd(n: number | null | undefined, maxFrac = 2): string {
  if (n == null || !isFinite(n)) return '—';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: maxFrac });
}

export function fmtCompactUsd(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function fmtCompact(n: number | null | undefined): string {
  if (n == null || !isFinite(n)) return '—';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}K`;
  return `${sign}${abs.toLocaleString('en-US')}`;
}

export function fmtPct(n: number | null | undefined, withSign = true): string {
  if (n == null || !isFinite(n)) return '—';
  const s = withSign && n > 0 ? '+' : '';
  return `${s}${n.toFixed(2)}%`;
}

export function shortAddr(a: string): string {
  if (!a || a.length < 12) return a;
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}
