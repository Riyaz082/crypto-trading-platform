import { motion } from "framer-motion";
import { MOCK_COINS, formatCurrency, formatCompact, generateSparkline } from "@/lib/mock-data";
import { useMemo } from "react";

export function MarketPreview() {
  const coins = MOCK_COINS.slice(0, 6);
  return (
    <section id="markets" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
            Live markets
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Real-time prices, <span className="gradient-text">zero delay</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stream order book data across 200+ assets with sub-second updates.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coins.map((c, i) => (
            <CoinCard key={c.symbol} coin={c} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CoinCard({ coin, delay }: { coin: typeof MOCK_COINS[0]; delay: number }) {
  const data = useMemo(() => generateSparkline(coin.price, 24, 0.03), [coin.price]);
  const up = coin.change24h >= 0;
  const min = Math.min(...data.map((d) => d.v));
  const max = Math.max(...data.map((d) => d.v));
  const path = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((d.v - min) / (max - min || 1)) * 100;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 hover:border-primary/40 transition cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-surface grid place-items-center text-xl">
            {coin.icon}
          </div>
          <div>
            <div className="font-semibold">{coin.name}</div>
            <div className="text-xs text-muted-foreground">{coin.symbol}</div>
          </div>
        </div>
        <span
          className={`text-sm font-semibold ${up ? "text-success" : "text-destructive"}`}
        >
          {up ? "+" : ""}
          {coin.change24h}%
        </span>
      </div>
      <div className="h-16 mb-4">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <path
            d={path}
            fill="none"
            stroke={up ? "oklch(0.74 0.18 155)" : "oklch(0.65 0.24 25)"}
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Price</div>
          <div className="text-lg font-bold">{formatCurrency(coin.price)}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Volume</div>
          <div className="text-sm font-semibold">{formatCompact(coin.volume24h)}</div>
        </div>
      </div>
    </motion.div>
  );
}
