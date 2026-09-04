import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useWalletStore } from "@/store/walletStore";
import { formatCurrency } from "@/lib/mock-data";

import { walletApi } from "@/api/services";

export const Route = createFileRoute("/_authenticated/wallet/deposit")({
  head: () => ({ meta: [{ title: "Deposit — Crypto Trading Platform" }] }),
  component: DepositPage,
});

function DepositPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const credit = useWalletStore((s) => s.credit);

  async function startPayment() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    try {
      let data: any;
      try {
        data = await walletApi.deposit(amt, "stripe");
      } catch (err: any) {
        if (!err.response) {
          toast.warning("Backend offline. Simulating payment.");
          setTimeout(() => {
            credit(amt, `Deposit via simulated payment`, "DEPOSIT");
            navigate({ to: "/payment/success", search: { amount: amt } });
          }, 1500);
          return;
        } else {
          return;
        }
      }
      if (data && data.payment_url) {
        toast.info("Redirecting to payment gateway...");
        let targetUrl = data.payment_url;
        if (targetUrl.startsWith("/")) {
          const apiBase = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080";
          targetUrl = `${apiBase}${targetUrl}`;
        }
        window.location.href = targetUrl;
      } else {
        toast.error("Could not generate payment link.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link to="/wallet" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to wallet
      </Link>
      <div>
        <h1 className="text-3xl font-bold">Deposit funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Add money to your Crypto Trading Platform wallet instantly.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm font-medium">Amount (USD)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-2 h-14 rounded-xl bg-input border border-border px-4 text-2xl font-bold outline-none focus:border-primary" />
          <div className="flex gap-2 mt-3">
            {[100, 500, 1000, 5000].map((p) => (
              <button key={p} onClick={() => setAmount(String(p))} className="flex-1 py-2 text-xs rounded-lg bg-surface hover:bg-accent">
                {formatCurrency(p)}
              </button>
            ))}
          </div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <div className="text-sm">
              <div className="font-semibold">Demo payment gateway</div>
              <div className="text-xs text-muted-foreground">Sandbox flow — no real funds will be charged.</div>
            </div>
          </div>
        </div>
        <button onClick={startPayment} disabled={loading} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold glow-primary disabled:opacity-60">
          {loading ? "Redirecting to gateway…" : `Pay ${amount ? formatCurrency(parseFloat(amount) || 0) : "—"}`}
        </button>
      </div>
    </div>
  );
}
