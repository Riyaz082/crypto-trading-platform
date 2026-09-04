import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useWalletStore } from "@/store/walletStore";
import { formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/wallet/history")({
  head: () => ({ meta: [{ title: "Transaction history — Crypto Trading Platform" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const txs = useWalletStore((s) => s.transactions);
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link to="/wallet" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to wallet
      </Link>
      <h1 className="text-3xl font-bold">Transaction history</h1>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-surface/50">
              <tr>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Note</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-right px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.id} className="border-t border-border/50">
                  <td className="px-4 py-3 text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold">{t.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.note ?? "—"}</td>
                  <td className="px-4 py-3 text-right font-bold">{formatCurrency(t.amount)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${t.status === "SUCCESS" ? "bg-success/20 text-success" : t.status === "PENDING" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
