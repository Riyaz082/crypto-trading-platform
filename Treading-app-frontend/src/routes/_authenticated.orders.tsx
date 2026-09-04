import { createFileRoute, Link } from "@tanstack/react-router";
import { usePortfolioStore } from "@/store/tradingStore";
import { formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({ meta: [{ title: "Orders — Crypto Trading Platform" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const orders = usePortfolioStore((s) => s.orders);
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Order history</h1>
        <p className="text-sm text-muted-foreground mt-1">
          All your buy and sell orders, in one place.
        </p>
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-surface/50">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Asset</th>
                <th className="text-left px-4 py-3">Side</th>
                <th className="text-right px-4 py-3">Quantity</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-right px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border/50">
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-semibold">{o.symbol}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-md ${
                        o.side === "BUY"
                          ? "bg-success/20 text-success"
                          : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {o.side}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">{o.quantity}</td>
                  <td className="px-4 py-4 text-right">{formatCurrency(o.price)}</td>
                  <td className="px-4 py-4 text-right font-semibold">
                    {formatCurrency(o.price * o.quantity)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-xs font-bold text-success">{o.status}</span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No orders yet.{" "}
                    <Link to="/market" className="text-primary font-semibold">
                      Place your first order →
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
