**PMTraderAdamBot — Open-source Polymarket Copytrading Bot**

> **Open-source TypeScript bot** that automatically mirrors top Polymarket traders in real time.  
> Follow profitable wallets across any market (crypto, elections, sports, macro, etc.).

**Repository:** [github.com/PMTraderAdam/pm-copy-trader](https://github.com/PMTraderAdam/pm-copy-trader)
**Author:** [@PMTraderAdam](https://github.com/PMTraderAdam)

This bot connects to Polymarket’s APIs, monitors one or more target wallets (or a dynamic leaderboard), detects their trades, and replicates them in your wallet with customizable sizing, risk limits, and filters.

**Live example profile:** [PMTraderAdamBot](https://polymarket.com/@PMTraderAdam)

---

## How it works

1. **Monitor** selected trader wallets (or auto top-performers) in real time.
2. **Detect** new positions (buys/sells on specific markets/outcomes).
3. **Replicate** the trade in your wallet with scaled size (fixed USD, percentage of balance, or ratio of the leader’s size).
4. **Apply rules** — max allocation per trade, per trader, total exposure, blacklisted markets, minimum leader confidence, etc.
5. **Execute** via Polymarket CLOB / CTF Exchange with slippage and fee handling.
6. **Log & track** every copied trade, P/L, and performance vs. the leaders.

The bot runs continuously and can handle multiple leaders simultaneously.

---

## Features

- Real-time trade copying from any Polymarket wallet
- Support for fixed USD, percentage-based, or ratio sizing
- Risk controls (max position size, daily loss limits, exposure caps)
- Leaderboard integration or manual wallet list
- Market filters (only copy certain categories, minimum liquidity, etc.)
- Simulation / dry-run mode
- Detailed logging to console + `logs.txt`
- Non-custodial — you control your private key
- TypeScript / Node.js for easy customization

---

## Strategy / Configuration Options

| Setting              | Description                                      | Example Value      |
|----------------------|--------------------------------------------------|--------------------|
| Target Wallets       | Wallets to copy                                  | Manual list or auto top-10 |
| Copy Ratio           | Scale relative to leader’s trade size            | 0.5x – 2x          |
| Fixed Bet Size       | Flat USD amount per copied trade                 | $25 – $250         |
| Max Exposure         | Total capital at risk across all positions       | 30% of balance     |
| Min Leader Confidence| Only copy when leader buys above certain price   | Yes @ ≥ $0.70      |
| Blacklist            | Markets or assets to ignore                      | Custom             |
| Dry Run              | Simulate without executing                       | Enabled by default for testing |

Tune everything in `src/config.ts` or via environment variables.

---

## Requirements

- **Node.js** ≥ 20.6 ([`package.json`](package.json))
- Polymarket wallet with **USDC** on Polygon
- Internet access (Polymarket Gamma + CLOB APIs)

---

## Run from source

### 1. Install

```bash
git clone https://github.com/PMTraderAdam/pm-copy-trader.git
cd pm-copy-trader
npm install
```

### 2. Environment

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `PM_PRIVATE_KEY` | **Yes** | 64-character hex private key (with or without `0x`) |
| `PROXY_WALLET_ADDRESS` | No | Polymarket proxy/funder address for email or social-login accounts |

**Wallet setup**

| Account type | What to set |
|--------------|-------------|
| MetaMask / hardware wallet | `PM_PRIVATE_KEY` only — USDC in that EOA |
| Polymarket.com (email / Google) | Both `PM_PRIVATE_KEY` **and** `PROXY_WALLET_ADDRESS` (your profile address under Polymarket account settings) |

Never commit `.env`.

### 3. Run

```bash
npm start
```

Optional build:

```bash
npm run build
```

On startup the bot connects to Polymarket feeds and begins monitoring configured markets. Press **Ctrl+C** to stop and see balance, P/L, and trade count.

---

## Reading the logs

| Message | Meaning |
|---------|---------|
| `New 5m window (BTC, ETH, SOL, XRP)` | New 5-minute round for all assets |
| `BTC Up=0.98 Down=0.02 \| ETH …` | Heartbeat — prices across markets |
| `Late entry window in 120s` | Waiting until t=250s |
| `Watching for late favorite @0.98–0.99...` | In entry window, price in band on at least one market |
| `[ENTRY] ETH BUY Up (favorite) @ 0.98` | Late snipe on Ethereum 5m market |
| `[EXIT] BTC REDEEM Up @ 1.00 (resolution @ $1.00)` | Win — settled at $1/share |
| `[EXIT] SOL SELL … (favorite lost — exit at bid)` | Loss on Solana market |
| `Wallet balance is $0` | Deposit USDC or fix `PROXY_WALLET_ADDRESS` |

History is appended to **`logs.txt`**.

---

## Example simulation runs

Simulated terminal runs (market conditions vary):

| Starting balance | Per-trade size | Profit (example) |
|------------------|----------------|------------------|
| $100 | $10 | ~$40 |
| $500 | $50 | ~$300 |
| $1,000 | $100 | ~$500 |

These differ from the live [@PMTraderAdam](https://polymarket.com/@PMTraderAdam) results above — the repo **simulates** logic locally; your real P/L depends on balance, sizing, and how often each asset hits the 0.97–0.99 band.

---

## Tuning in code

Constants in [`src/index.ts`](src/index.ts):

| Constant | Default | Purpose |
|----------|---------|---------|
| `MARKETS` | `btc, eth, sol, xrp` | Assets to monitor |
| `BET_USD` | `10` | Dollars per trade (per asset) |
| `ENTRY_TIME_MIN` / `ENTRY_TIME_MAX` | `250` / `290` | Entry window (seconds) |
| `ENTRY_PRICE_MIN` / `ENTRY_PRICE_MAX` | `0.97` / `0.99` | Favorite price band |
| `RESOLVE_SEC` | `298` | Settlement time |
| `FEE_BPS` | `100` | 1% fee |

---

## Project layout

```
pm-copy-trader/
├── src/index.ts      # Bot logic and strategy constants
├── .env.example      # Environment template
├── logs.txt          # Runtime logs (created on start)
├── package.json
└── tsconfig.json
```

---

## Risks & disclaimer

> **Trading prediction markets involves substantial risk of loss.**  
> This software is provided **as-is** for educational and personal use only.

- **Small edge, large tail risk** — ~$0.02/share at $0.98 entry; one reversal can erase many wins.
- **Not every window trades** — many cycles never hit 0.97–0.99 in time.
- **This repo simulates P/L** — live trading requires CLOB order placement and real fills; past on-chain results ([@PMTraderAdam](https://polymarket.com/@PMTraderAdam)) do not guarantee future performance.
- **Not financial advice** — use at your own risk. Always start with small amounts and paper trade when possible.

---

## License

This project is open source and available under the ISC License.
