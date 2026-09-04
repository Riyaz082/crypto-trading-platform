import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Users, DollarSign, Activity, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/mock-data";
import { adminApi } from "@/api/services";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — Crypto Trading Platform" }] }),
  component: AdminPage,
});

type Withdrawal = {
  id: string;
  user: string;
  email: string;
  amount: number;
  account: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
};

function AdminPage() {
  const user = useAuthStore((s) => s.user);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchWithdrawals() {
    try {
      const data = await adminApi.withdrawals();
      if (Array.isArray(data)) {
        const mapped = data.map((w: any) => ({
          id: String(w.id),
          user: w.user?.fullName || "User #" + w.user?.id,
          email: w.user?.email || "",
          amount: w.amount,
          account: "****" + ((w.id * 7 + 1000) % 10000),
          status: w.status === "SUCCESS" ? "APPROVED" : w.status === "DECLINE" ? "DECLINED" : "PENDING",
          createdAt: w.date || new Date().toISOString()
        }));
        setWithdrawals(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch withdrawals:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role !== "ADMIN" && user?.role !== "ROLE_ADMIN") {
      setAuthorized(false);
    } else {
      setAuthorized(true);
      fetchWithdrawals();
    }
  }, [user]);

  if (authorized === false) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          You need ADMIN role to view this page. Sign in with an email starting with "admin" to demo.
        </p>
      </div>
    );
  }

  async function approve(id: string) {
    try {
      await adminApi.processWithdrawal(Number(id), true);
      toast.success("Withdrawal approved");
      fetchWithdrawals();
    } catch (err) {
      toast.error("Failed to approve withdrawal");
    }
  }

  async function decline(id: string) {
    try {
      await adminApi.processWithdrawal(Number(id), false);
      toast.error("Withdrawal declined");
      fetchWithdrawals();
    } catch (err) {
      toast.error("Failed to decline withdrawal");
    }
  }

  const pending = withdrawals.filter((w) => w.status === "PENDING");
  const pendingTotal = pending.reduce((s, w) => s + w.amount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-warning/20 grid place-items-center">
          <Shield className="h-6 w-6 text-warning" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Admin panel</h1>
          <p className="text-sm text-muted-foreground">Review withdrawals, monitor activity.</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Pending withdrawals" value={String(pending.length)} icon={<Activity className="h-4 w-4" />} accent="warning" />
        <StatCard label="Pending volume" value={formatCurrency(pendingTotal)} icon={<DollarSign className="h-4 w-4" />} accent="primary" />
        <StatCard label="Active users" value="12,481" delta="+4.2%" icon={<Users className="h-4 w-4" />} accent="success" />
        <StatCard label="24h trade volume" value="$84.2M" delta="+12.1%" icon={<Activity className="h-4 w-4" />} accent="primary" />
      </div>
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border/50">
          <h3 className="font-semibold">Withdrawal requests</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-surface/50">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Account</th>
                <th className="text-right px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Submitted</th>
                <th className="text-right px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-border/50">
                  <td className="px-4 py-4">
                    <div className="font-semibold">{w.user}</div>
                    <div className="text-xs text-muted-foreground">{w.email}</div>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">{w.account}</td>
                  <td className="px-4 py-4 text-right font-bold">{formatCurrency(w.amount)}</td>
                  <td className="px-4 py-4 text-muted-foreground">{new Date(w.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${w.status === "APPROVED" ? "bg-success/20 text-success" : w.status === "DECLINED" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"}`}>{w.status}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {w.status === "PENDING" ? (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => approve(w.id)} className="h-8 w-8 grid place-items-center rounded-lg bg-success/20 text-success hover:bg-success/30">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => decline(w.id)} className="h-8 w-8 grid place-items-center rounded-lg bg-destructive/20 text-destructive hover:bg-destructive/30">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
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
