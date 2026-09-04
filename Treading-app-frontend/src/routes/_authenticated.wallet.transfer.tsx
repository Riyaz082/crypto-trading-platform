import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useWalletStore } from "@/store/walletStore";
import { walletApi } from "@/api/services";
import { formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/wallet/transfer")({
  head: () => ({ meta: [{ title: "Transfer — Crypto Trading Platform" }] }),
  component: TransferPage,
});

function TransferPage() {
  const [walletId, setWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const balance = useWalletStore((s) => s.balance);
  const setBalance = useWalletStore((s) => s.setBalance);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const amt = parseFloat(amount);
    const toId = parseInt(walletId);
    if (isNaN(toId) || toId <= 0) return toast.error("Enter a valid Recipient Wallet ID");
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > balance) return toast.error("Insufficient balance");
    
    setLoading(true);
    try {
      try {
        const wallet = await walletApi.transfer({ toWalletId: toId, amount: amt });
        if (wallet && typeof wallet.balance === "number") {
          setBalance(wallet.balance);
        } else if (wallet && wallet.balance !== undefined) {
          setBalance(Number(wallet.balance));
        }
        toast.success(`Transferred ${formatCurrency(amt)} to Wallet #${toId}`);
      } catch (err: any) {
        if (!err.response) {
          toast.warning("Backend offline. Simulating local transfer.");
          setBalance(balance - amt);
          toast.success(`Transferred ${formatCurrency(amt)} to Wallet #${toId}`);
        } else {
          return;
        }
      }
      setAmount("");
      setWalletId("");
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
        <h1 className="text-3xl font-bold">Send funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Transfer instantly to another wallet ID — zero fees.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="text-sm text-muted-foreground">Balance: <span className="font-bold text-foreground">{formatCurrency(balance)}</span></div>
        <div>
          <label className="text-sm font-medium">Recipient Wallet ID</label>
          <input type="number" value={walletId} onChange={(e) => setWalletId(e.target.value)} placeholder="e.g. 2" className="w-full mt-2 h-12 rounded-xl bg-input border border-border px-4 outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Amount (USD)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-2 h-14 rounded-xl bg-input border border-border px-4 text-2xl font-bold outline-none focus:border-primary" />
        </div>
        <button onClick={submit} disabled={loading} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold glow-primary">
          {loading ? "Processing..." : "Send transfer"}
        </button>
      </div>
    </div>
  );
}
