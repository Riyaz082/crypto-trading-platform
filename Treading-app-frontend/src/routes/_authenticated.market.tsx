import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Star } from "lucide-react";
import { MOCK_COINS, Coin, formatCurrency, formatCompact } from "@/lib/mock-data";
import { useWatchlistStore } from "@/store/tradingStore";
import { TradeSlip } from "@/components/trading/TradeSlip";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/market")({
  head: () => ({ meta: [{ title: "Markets — Crypto Trading Platform" }] }),
  component: MarketPage,
});

function MarketPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Coin | null>(null);
  const watch = useWatchlistStore();

  const list = useMemo(
    () =>
      MOCK_COINS.filter(
        (c) =>
          c.name.toLowerCase().includes(q.toLowerCase()) ||
          c.symbol.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Markets</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Discover, watch, and trade across 200+ assets.
        </p>
      </div>

      <div className="flex items-center gap-3 bg-surface rounded-xl px-4 h-12">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or symbol"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider bg-surface/50">
              <tr>
                <th className="text-left px-4 py-3 w-10"></th>
                <th className="text-left px-4 py-3">Asset</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">24h</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Volume</th>
                <th className="text-right px-4 py-3 hidden lg:table-cell">Market cap</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c, i) => (
                <motion.tr
                  key={c.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-border/50 hover:bg-surface/50 transition"
                >
                  <td className="px-4 py-4">
                    <button
                      onClick={() => watch.toggle(c.symbol)}
                      className="text-muted-foreground hover:text-warning"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          watch.symbols.includes(c.symbol)
                            ? "fill-warning text-warning"
                            : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      to="/market/$symbol"
                      params={{ symbol: c.symbol }}
                      className="flex items-center gap-3"
                    >
                      <div className="h-9 w-9 rounded-lg bg-surface grid place-items-center text-lg">
                        {c.icon}
                      </div>
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.symbol}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold">
                    {formatCurrency(c.price)}
                  </td>
                  <td
                    className={`px-4 py-4 text-right font-semibold ${
                      c.change24h >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {c.change24h >= 0 ? "+" : ""}
                    {c.change24h}%
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground hidden md:table-cell">
                    {formatCompact(c.volume24h)}
                  </td>
                  <td className="px-4 py-4 text-right text-muted-foreground hidden lg:table-cell">
                    {formatCompact(c.marketCap)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setActive(c)}
                      className="rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Trade
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TradeSlip coin={active} open={!!active} onClose={() => setActive(null)} />
    </div>
  );
}
