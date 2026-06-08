# Hype Site — Astro rebuild

The Hyperliquid intelligence terminal (hype-site.com), rebuilt from a single 4,600-line
`index.html` into a componentised Astro app. Design system: "Prism Terminal" — refined dark
trading-terminal aesthetic (Bricolage Grotesque / Hanken Grotesk / JetBrains Mono) with a
spectral motif that ties into the Prism indicator brand.

## Stack
- **Astro 6** (static pages + on-demand API routes)
- **@astrojs/vercel** adapter — deploys to Vercel as static assets + one serverless function
- Vanilla TS/JS islands for live data (no heavy framework)

## Run locally
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build → dist/ + .vercel/output
npm run preview    # preview the built site
```
> Live market data (price, OI, volume) is fetched client-side from the `/api/*` proxies, which
> call Hyperliquid / CoinGecko / HypurrScan. Those upstreams are reachable in `dev` and on
> Vercel; numbers show `—` until they resolve.

## Deploy (Vercel)
Push to the GitHub repo connected to the Vercel project — Vercel auto-builds. Or `vercel` CLI.
The adapter handles the Vercel output format; no extra config needed. **Nothing is deployed
until you say so.**

## Where to configure things
- **`src/lib/site.ts`** — site name/tagline, nav, **treasury deployer addresses**, referral toggle.
- **`src/lib/indicators.ts`** — the four Prism indicators. Set `price`, `period`, and `buyUrl`
  (Gumroad / Whop / Stripe Payment Link / LemonSqueezy) per indicator to wire real checkout;
  empty `buyUrl` renders a "Request access" CTA. Edit the marketing copy here too.
- **`src/pages/charts.astro`** — `chartConfig.symbol` (default `MEXC:HYPEUSDT`).
- **`src/pages/api/builders.ts`** — set `BUILDER_ADDRESSES` env var (or `?builders=`) for the
  builder-fee aggregator.

## Routes
| Page | Path | Status |
|------|------|--------|
| Overview | `/` | live (price, mcap, perp vol, OI) |
| Treasury (AQAv2) | `/treasury` | built — addresses, yield→buyback estimator, sources |
| Indicators (Prism shop) | `/indicators` | built — 4 cards + access flow |
| Charts | `/charts` | built — TradingView embed |
| Ecosystem | `/ecosystem` | built — ETFs + structural context |
| Buybacks | `/burns` | live — AF holdings, buyback bid, USDC, fee burns, staked share |
| Staking | `/staking` | live — APR, total staked, validator table, unstake queue |
| Live Trades | `/trades` | live — websocket tape, flow stats, per-market flow |
| HIP-3 | `/hip3` | live — perpDexs aggregation, DEX breakdown, top markets |

API proxies: `/api/ping`, `/api/hl`, `/api/cg`, `/api/hs`, `/api/builders`.
