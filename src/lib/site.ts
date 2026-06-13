// Central site configuration. Edit values here rather than hunting through markup.

export const SITE = {
  name: 'HYPE Intelligence',
  tagline: 'Hyperliquid analytics dashboard',
  url: 'https://hype-site.com',
  description:
    'Real-time Hyperliquid (HYPE) analytics dashboard — live burns, session fees, the Assistance Fund monitor, staking, trading signals and HIP-3 markets, plus the Prism suite of TradingView indicators.',
  twitter: 'https://x.com/search?q=hyperliquid',
  tradingviewProfile: 'https://www.tradingview.com/u/jrrrrrr/',
  contactEmail: '',
  accessDeliveryHours: '24 hours',
};

export const NAV: { label: string; href: string; tag?: string }[] = [
  { label: 'Overview', href: '/' },
  { label: 'Burns', href: '/burns' },
  { label: 'Staking', href: '/staking' },
  { label: 'Live Trades', href: '/trades' },
  { label: 'HIP-3', href: '/hip3' },
  { label: 'Indicators', href: '/indicators', tag: 'Prism' },
];

export const REFERRALS = {
  hyperliquidCode: { enabled: true, code: 'HYPESITE', note: 'fee discount on signup', url: 'https://app.hyperliquid.xyz/join/HYPESITE' },
};
