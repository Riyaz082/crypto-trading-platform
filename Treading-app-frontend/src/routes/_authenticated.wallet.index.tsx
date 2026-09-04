import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, ArrowDownToLine, ArrowRightLeft, History, Wallet } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useWalletStore } from "@/store/walletStore";
import { walletApi } from "@/api/services";
import { formatCurrency } from "@/lib/mock-data";

const searchSchema = z.object({
  order_id: z.coerce.number().optional(),
  payment_id: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/wallet/")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Wallet — Crypto Trading Platform" }] }),
  component: WalletPage,
});

function WalletPage() {
  const { order_id, payment_id } = Route.useSearch();
  const navigate = useNavigate();
  const balance = useWalletStore((s) => s.balance);
  const setBalance = useWalletStore((s) => s.setBalance);
  const txs = useWalletStore((s) => s.transactions);

  useEffect(() => {
    if (!order_id || !payment_id) return;

    if (payment_id === "pay_mock_fail") {
      toast.error("Deposit payment failed or was cancelled.");
      navigate({ to: "/wallet", search: {} });
      return;
    }

    const verify = async () => {
      try {
        const wallet = await walletApi.verifyPayment({ orderId: order_id, paymentId: payment_id });
        if (wallet && typeof wallet.balance === "number") {
          setBalance(wallet.balance);
        } else if (wallet && wallet.balance !== undefined) {
          setBalance(Number(wallet.balance));
        }
        toast.success("Deposit processed successfully!");
      } catch (err: any) {
        if (!err.response) {
          toast.success("Deposit simulation success!");
        }
      } finally {
        navigate({ to: "/wallet", search: {} });
      }
    };
    verify();
  }, [order_id, payment_id, setBalance, navigate]);

  const actions = [
    { to: "/wallet/deposit", label: "Deposit", icon: Plus, desc: "Add funds via payment gateway" },
    { to: "/wallet/withdraw", label: "Withdraw", icon: ArrowDownToLine, desc: "Send to your bank" },
    { to: "/wallet/transfer", label: "Transfer", icon: ArrowRightLeft, desc: "Send to another Crypto Trading Platform user" },
    { to: "/wallet/history", label: "History", icon: History, desc: "All your transactions" },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full gradient-primary opacity-30 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
            <Wallet className="h-3.5 w-3.5" /> Total wallet balance
          </div>
          <div className="text-5xl font-bold mt-2 gradient-text">{formatCurrency(balance)}</div>
          <div className="text-sm text-muted-foreground mt-1">Available for trading & withdrawals</div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((a) => (
          <Link key={a.to} to={a.to} className="glass rounded-2xl p-5 hover:border-primary/40 transition">
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground mb-3">
              <a.icon className="h-5 w-5" />
            </div>
            <div className="font-semibold">{a.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
          </Link>
        ))}
      </div>
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent activity</h3>
          <Link to="/wallet/history" className="text-xs text-primary font-semibold">View all</Link>
        </div>
        <div className="space-y-2">
          {txs.slice(0, 6).map((t) => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface">
              <div>
                <div className="text-sm font-semibold">{t.type} <span className="text-muted-foreground font-normal">· {t.note}</span></div>
                <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold">{formatCurrency(t.amount)}</div>
                <div className={`text-xs font-semibold ${t.status === "SUCCESS" ? "text-success" : t.status === "PENDING" ? "text-warning" : "text-destructive"}`}>{t.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
