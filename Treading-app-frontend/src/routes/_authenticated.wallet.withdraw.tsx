import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useWalletStore } from "@/store/walletStore";
import { formatCurrency } from "@/lib/mock-data";
import { walletApi } from "@/api/services";

export const Route = createFileRoute("/_authenticated/wallet/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — Crypto Trading Platform" }] }),
  component: WithdrawPage,
});

function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const balance = useWalletStore((s) => s.balance);
  const setBalance = useWalletStore((s) => s.setBalance);
  const debit = useWalletStore((s) => s.debit);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (!account) return toast.error("Enter your bank account");
    if (amt > balance) return toast.error("Insufficient balance");
    
    setLoading(true);
    try {
      try {
        await walletApi.withdraw(amt);
        const wallet = await walletApi.getBalance();
        if (wallet && typeof wallet.balance === "number") {
          setBalance(wallet.balance);
        } else if (wallet && wallet.balance !== undefined) {
          setBalance(Number(wallet.balance));
        }
        toast.success("Withdrawal request submitted for approval");
      } catch (err: any) {
        if (!err.response) {
          toast.warning("Backend offline. Simulating withdrawal locally.");
          debit(amt, `Withdrawal to ${account}`, "WITHDRAW");
          toast.success("Withdrawal request submitted for approval");
        } else {
          return;
        }
      }
      setAmount("");
      setAccount("");
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
        <h1 className="text-3xl font-bold">Withdraw funds</h1>
        <p className="text-sm text-muted-foreground mt-1">Send to your linked bank account. Approval typically takes &lt;30 minutes.</p>
      </div>
      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="text-sm text-muted-foreground">Available balance: <span className="font-bold text-foreground">{formatCurrency(balance)}</span></div>
        <div>
          <label className="text-sm font-medium">Bank account</label>
          <input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Account number / IBAN" className="w-full mt-2 h-12 rounded-xl bg-input border border-border px-4 outline-none focus:border-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Amount (USD)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-2 h-14 rounded-xl bg-input border border-border px-4 text-2xl font-bold outline-none focus:border-primary" />
        </div>
        <button onClick={submit} className="w-full h-12 rounded-xl gradient-primary text-primary-foreground font-semibold glow-primary">
          Request withdrawal
        </button>
      </div>
    </div>
  );
}
