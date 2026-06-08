// ── Indicator catalog ────────────────────────────────────────────────
// These four scripts are published by `jrrrrrr` on TradingView.
// NOTE: they are currently published as OPEN-SOURCE (free + visible to all).
// The sales model here is "buy access → receive a private invite" — to support
// that you'd typically keep a closed/invite-only version. See the page note.
//
// To wire real checkout: set `price`, `period`, and `buyUrl` (Gumroad / Whop /
// Stripe Payment Link / LemonSqueezy). Leave buyUrl empty to show "Request access".

export interface Indicator {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  features: string[];
  tags: string[];
  tvUrl: string;
  image: string;
  accent: string;       // hex used for the card glow
  price: number | null; // USD; null → "Request access"
  period: string;       // e.g. "one-time", "/mo"
  buyUrl: string;       // checkout link; "" → contact flow
}

export const INDICATORS: Indicator[] = [
  {
    id: 'auto-fib-engine',
    name: 'Auto Fib Engine',
    badge: 'Signature',
    tagline: "Hype Site's signature automatic Fibonacci engine.",
    description:
      'Detects market swings automatically and plots clean retracement and extension levels that re-anchor as structure develops — no manual drawing, no re-dragging anchors every time price shifts.',
    features: ['Auto swing detection', 'Retracement + extension levels', 'Re-anchors with structure', 'Multi-timeframe ready'],
    tags: ['Fibonacci', 'Levels', 'Auto'],
    tvUrl: 'https://www.tradingview.com/script/3Wpj4985-10-Auto-Fib-Engine-Hype-Site-com/',
    image: 'https://s3.tradingview.com/3/3Wpj4985_big.png?v=1777134844',
    accent: '#ffd166',
    price: null,
    period: 'one-time',
    buyUrl: '',
  },
  {
    id: 'prism-vrvp',
    name: 'Prism VRVP',
    badge: 'Volume',
    tagline: 'Advanced visible-range volume profile.',
    description:
      'A refined visible-range volume profile: point of control, value-area high/low, and "naked" value-area edges (ndVAH / ndVAL) that flag untested levels price tends to revisit. Built for reading where real participation sits.',
    features: ['Point of control (POC)', 'Value area high / low', 'Naked VA edges (ndVAH / ndVAL)', 'Visible-range adaptive'],
    tags: ['Volume Profile', 'Market Structure'],
    tvUrl: 'https://www.tradingview.com/script/wuumI00L-Prism-VRVP-Hype-Site-com/',
    image: 'https://s3.tradingview.com/w/wuumI00L_big.png?v=1780282549',
    accent: '#28e0c8',
    price: null,
    period: 'one-time',
    buyUrl: '',
  },
  {
    id: 'prism-arc',
    name: 'Prism Arc',
    badge: 'Macro',
    tagline: 'Long-term logarithmic growth-arc model.',
    description:
      'A macro positioning tool inspired by long-term logarithmic value charting. Frames price against curved log-growth bands to contextualise where an asset sits across a full cycle rather than a single timeframe.',
    features: ['Logarithmic growth arcs', 'Cycle-scale context', 'Macro positioning', 'Tuned for HYPE & BTC'],
    tags: ['Macro', 'Log Regression'],
    tvUrl: 'https://www.tradingview.com/script/hR1PNFVN-Prism-Arc-Hype-Site-com/',
    image: 'https://s3.tradingview.com/h/hR1PNFVN_big.png?v=1780699116',
    accent: '#b388ff',
    price: null,
    period: 'one-time',
    buyUrl: '',
  },
  {
    id: 'prism-coil',
    name: 'Prism Coil',
    badge: 'Volatility',
    tagline: 'Volatility-compression & expansion detector.',
    description:
      'Highlights periods where range is coiling — volatility compressing into tight consolidation — so you can anticipate the expansion that tends to follow, instead of reacting after the move has already left.',
    features: ['Compression detection', 'Expansion anticipation', 'Range / squeeze states', 'Clean visual signalling'],
    tags: ['Volatility', 'Breakout'],
    tvUrl: 'https://www.tradingview.com/script/3fKoMQw4-Prism-Coil-Hype-Site-com/',
    image: 'https://s3.tradingview.com/3/3fKoMQw4_big.png?v=1777135203',
    accent: '#6aa8ff',
    price: null,
    period: 'one-time',
    buyUrl: '',
  },
];
