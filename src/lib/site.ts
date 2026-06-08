// Central site configuration. Edit values here rather than hunting through markup.

export const SITE = {
  name: 'Hype Site',
  tagline: 'The Hyperliquid intelligence terminal',
  url: 'https://hype-site.com',
  description:
    'Live Hyperliquid (HYPE) analytics — price, volume, open interest, fees & buybacks, the AQAv2 USDC treasury, staking, HIP-3 markets, and the Prism suite of TradingView indicators.',
  twitter: 'https://x.com/search?q=hyperliquid',
  tradingviewProfile: 'https://www.tradingview.com/u/jrrrrrr/',
  // Checkout / indicator access
  contactEmail: '', // set this to receive "request access" emails (e.g. you@hype-site.com)
  accessDeliveryHours: '24 hours', // shown to buyers as the invite turnaround
};

export const NAV: { label: string; href: string; tag?: string }[] = [
  { label: 'Overview', href: '/' },
  { label: 'Treasury', href: '/treasury', tag: 'AQAv2' },
  { label: 'Indicators', href: '/indicators', tag: 'Prism' },
  { label: 'Charts', href: '/charts' },
  { label: 'Buybacks', href: '/burns' },
  { label: 'Staking', href: '/staking' },
  { label: 'Live Trades', href: '/trades' },
  { label: 'HIP-3', href: '/hip3' },
  { label: 'Ecosystem', href: '/ecosystem' },
];

// AQAv2 USDC treasury deployer addresses (Coinbase), announced 2026-05-14.
export const TREASURY_ADDRESSES = [
  '0x4E5319dEb1072B01439EE674db5C321d11fd96F8',
  '0xc20699185c15D0a2fD65779BB5d69f5b0B113c00',
];

// Optional affiliate/referral promos. Set enabled:false to hide site-wide.
export const REFERRALS = {
  hyperliquidCode: { enabled: true, code: 'HYPESITE', note: 'fee discount on signup', url: 'https://app.hyperliquid.xyz/join/HYPESITE' },
};
