import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortfolioStore } from "@/store/tradingStore";
import { MOCK_COINS, formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/portfolio")({
  head: () => ({ meta: [{ title: "Portfolio — Crypto Trading Platform" }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const holdings = usePortfolioStore((s) => s.holdings);
  const total = holdings.reduce((sum, h) => {
    const coin = MOCK_COINS.find((c) => c.symbol === h.symbol);
    return sum + (coin?.price ?? h.avgPrice) * h.quantity;
  }, 0);
  const investedTotal = holdings.reduce((s, h) => s + h.avgPrice * h.quantity, 0);
  const pnl = total - investedTotal;
  const pnlPct = investedTotal ? (pnl / investedTotal) * 100 : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your active positions and unrealised P&L.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs text-muted-foreground">Current value</div>
          <div className="text-3xl font-bold mt-2">{formatCurrency(total)}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs text-muted-foreground">Invested</div>
          <div className="text-3xl font-bold mt-2">{formatCurrency(investedTotal)}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs text-muted-foreground">Unrealised P&L</div>
          <div
            className={`text-3xl font-bold mt-2 ${
              pnl >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {pnl >= 0 ? "+" : ""}
            {formatCurrency(pnl)}
          </div>
          <div
            className={`text-xs font-semibold mt-1 ${
              pnl >= 0 ? "text-success" : "text-destructive"
            }`}
          >
            {pnlPct.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-surface/50">
              <tr>
                <th className="text-left px-4 py-3">Asset</th>
                <th className="text-right px-4 py-3">Quantity</th>
                <th className="text-right px-4 py-3">Avg price</th>
                <th className="text-right px-4 py-3">Current</th>
                <th className="text-right px-4 py-3">Value</th>
                <th className="text-right px-4 py-3">P&L</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const coin = MOCK_COINS.find((c) => c.symbol === h.symbol);
                const current = coin?.price ?? h.avgPrice;
                const value = current * h.quantity;
                const invested = h.avgPrice * h.quantity;
                const p = value - invested;
                return (
                  <tr
                    key={h.symbol}
                    className="border-t border-border/50 hover:bg-surface/50"
                  >
                    <td className="px-4 py-4">
                      <Link
                        to="/market/$symbol"
                        params={{ symbol: h.symbol }}
                        className="flex items-center gap-3"
                      >
                        <div className="h-9 w-9 rounded-lg bg-surface grid place-items-center text-lg">
                          {coin?.icon ?? "?"}
                        </div>
                        <div>
                          <div className="font-semibold">{coin?.name ?? h.symbol}</div>
                          <div className="text-xs text-muted-foreground">{h.symbol}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {h.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-muted-foreground">
                      {formatCurrency(h.avgPrice)}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {formatCurrency(current)}
                    </td>
                    <td className="px-4 py-4 text-right font-bold">
                      {formatCurrency(value)}
                    </td>
                    <td
                      className={`px-4 py-4 text-right font-semibold ${
                        p >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {p >= 0 ? "+" : ""}
                      {formatCurrency(p)}
                    </td>
                  </tr>
                );
              })}
              {holdings.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No holdings yet.{" "}
                    <Link to="/market" className="text-primary font-semibold">
                      Start trading →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
