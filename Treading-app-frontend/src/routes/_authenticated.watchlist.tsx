import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { MOCK_COINS, formatCurrency } from "@/lib/mock-data";
import { useWatchlistStore } from "@/store/tradingStore";

export const Route = createFileRoute("/_authenticated/watchlist")({
  head: () => ({ meta: [{ title: "Watchlist — Crypto Trading Platform" }] }),
  component: WatchlistPage,
});

function WatchlistPage() {
  const watch = useWatchlistStore();
  const coins = MOCK_COINS.filter((c) => watch.symbols.includes(c.symbol));
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Watchlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Coins you're keeping an eye on.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coins.map((c) => (
          <Link
            key={c.symbol}
            to="/market/$symbol"
            params={{ symbol: c.symbol }}
            className="glass rounded-2xl p-5 hover:border-primary/40 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-surface grid place-items-center text-lg">
                  {c.icon}
                </div>
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.symbol}</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  watch.toggle(c.symbol);
                }}
              >
                <Star className="h-4 w-4 fill-warning text-warning" />
              </button>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div className="text-xl font-bold">{formatCurrency(c.price)}</div>
              <div
                className={`text-sm font-semibold ${
                  c.change24h >= 0 ? "text-success" : "text-destructive"
                }`}
              >
                {c.change24h >= 0 ? "+" : ""}
                {c.change24h}%
              </div>
            </div>
          </Link>
        ))}
        {coins.length === 0 && (
          <div className="col-span-full text-center py-16 text-sm text-muted-foreground glass rounded-2xl">
            Your watchlist is empty.{" "}
            <Link to="/market" className="text-primary font-semibold">
              Browse markets →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
