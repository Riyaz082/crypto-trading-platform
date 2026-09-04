import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MOCK_COINS, formatCurrency, formatCompact, generateSparkline } from "@/lib/mock-data";
import { useWatchlistStore } from "@/store/tradingStore";
import { TradeSlip } from "@/components/trading/TradeSlip";

export const Route = createFileRoute("/_authenticated/market/$symbol")({
  head: ({ params }) => ({
    meta: [{ title: `${params.symbol} — Crypto Trading Platform` }],
  }),
  component: CoinDetailPage,
});

function CoinDetailPage() {
  const { symbol } = Route.useParams();
  const coin = MOCK_COINS.find(
    (c) =>
      c.symbol === symbol.toUpperCase() ||
      c.id.toLowerCase() === symbol.toLowerCase() ||
      c.symbol.toLowerCase() === symbol.toLowerCase()
  );
  const watch = useWatchlistStore();
  const [slip, setSlip] = useState(false);

  const data = useMemo(
    () => (coin ? generateSparkline(coin.price, 60, 0.02) : []),
    [coin],
  );

  if (!coin) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold">Coin not found</h1>
        <Link to="/market" className="text-primary mt-3 inline-block">
          Back to markets
        </Link>
      </div>
    );
  }

  const inWatch = watch.symbols.includes(coin.symbol);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        to="/market"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to markets
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-surface grid place-items-center text-3xl">
            {coin.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              {coin.name} <span className="text-muted-foreground">/ {coin.symbol}</span>
            </h1>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-3xl font-bold">{formatCurrency(coin.price)}</span>
              <span
                className={`font-semibold ${
                  coin.change24h >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {coin.change24h >= 0 ? "+" : ""}
                {coin.change24h}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => watch.toggle(coin.symbol)}
            className="h-10 px-4 rounded-xl bg-surface flex items-center gap-2 hover:bg-accent"
          >
            <Star className={`h-4 w-4 ${inWatch ? "fill-warning text-warning" : ""}`} />
            {inWatch ? "Watching" : "Watch"}
          </button>
          <button
            onClick={() => setSlip(true)}
            className="h-10 px-5 rounded-xl gradient-primary text-primary-foreground font-semibold glow-primary"
          >
            Trade
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="coinG" x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={
                      coin.change24h >= 0
                        ? "oklch(0.74 0.18 155)"
                        : "oklch(0.65 0.24 25)"
                    }
                    stopOpacity={0.5}
                  />
                  <stop offset="100%" stopColor="oklch(0.7 0.2 240)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="i" stroke="oklch(0.5 0.02 260)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0.02 260)" fontSize={11} domain={["auto", "auto"]} />
              <Tooltip
                contentStyle={{
                  background: "oklch(0.22 0.03 260)",
                  border: "1px solid oklch(0.3 0.025 260)",
                  borderRadius: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke={
                  coin.change24h >= 0 ? "oklch(0.74 0.18 155)" : "oklch(0.65 0.24 25)"
                }
                fill="url(#coinG)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l: "Market cap", v: "$" + formatCompact(coin.marketCap) },
          { l: "24h volume", v: "$" + formatCompact(coin.volume24h) },
          { l: "Circulating", v: formatCompact(coin.marketCap / coin.price) },
          { l: "All time high", v: formatCurrency(coin.price * 1.4) },
        ].map((s) => (
          <div key={s.l} className="glass rounded-xl p-4">
            <div className="text-xs text-muted-foreground">{s.l}</div>
            <div className="font-bold text-lg mt-1">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold mb-2">About {coin.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {coin.name} ({coin.symbol}) is a leading digital asset traded on Crypto Trading Platform. Trade
          {" "}{coin.symbol} pairs with deep liquidity, sub-second order execution, and
          institutional-grade custody. All trades settle instantly to your Crypto Trading Platform wallet.
        </p>
      </div>

      <TradeSlip coin={coin} open={slip} onClose={() => setSlip(false)} />
    </div>
  );
}
