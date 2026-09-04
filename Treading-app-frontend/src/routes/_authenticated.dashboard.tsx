import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Wallet,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  Plus,
  ArrowDownToLine,
  ArrowRightLeft,
  ShoppingCart,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/StatCard";
import { useWalletStore } from "@/store/walletStore";
import { usePortfolioStore } from "@/store/tradingStore";
import { MOCK_COINS, formatCurrency, formatCompact } from "@/lib/mock-data";
import { useMemo } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Crypto Trading Platform" }] }),
  component: DashboardPage,
});

const COLORS = [
  "oklch(0.7 0.2 240)",
  "oklch(0.74 0.18 155)",
  "oklch(0.78 0.16 60)",
  "oklch(0.7 0.2 300)",
  "oklch(0.65 0.24 25)",
];

function DashboardPage() {
  const balance = useWalletStore((s) => s.balance);
  const transactions = useWalletStore((s) => s.transactions);
  const holdings = usePortfolioStore((s) => s.holdings);

  const portfolioValue = useMemo(() => {
    return holdings.reduce((sum, h) => {
      const coin = MOCK_COINS.find((c) => c.symbol === h.symbol);
      return sum + (coin?.price ?? h.avgPrice) * h.quantity;
    }, 0);
  }, [holdings]);

  const totalValue = balance + portfolioValue;

  const chartData = useMemo(() => {
    const data: { name: string; value: number }[] = [];
    let v = totalValue * 0.85;
    for (let i = 0; i < 20; i++) {
      v = v * (1 + (Math.random() - 0.45) * 0.04);
      data.push({ name: `D${i}`, value: Number(v.toFixed(2)) });
    }
    data[data.length - 1].value = totalValue;
    return data;
  }, [totalValue]);

  const pieData = holdings.map((h) => {
    const coin = MOCK_COINS.find((c) => c.symbol === h.symbol);
    return {
      name: h.symbol,
      value: (coin?.price ?? h.avgPrice) * h.quantity,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Here's what's happening with your portfolio today.
          </p>
        </div>
        <Link
          to="/market"
          className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground glow-primary self-start"
        >
          Explore markets <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total balance"
          value={formatCurrency(totalValue)}
          delta="+8.42%"
          icon={<Wallet className="h-4 w-4" />}
          accent="primary"
        />
        <StatCard
          label="Wallet cash"
          value={formatCurrency(balance)}
          icon={<Wallet className="h-4 w-4" />}
          accent="success"
        />
        <StatCard
          label="Portfolio value"
          value={formatCurrency(portfolioValue)}
          delta="+3.21%"
          icon={<PieChart className="h-4 w-4" />}
          accent="warning"
        />
        <StatCard
          label="24h P&L"
          value="+$1,420.18"
          delta="+1.81%"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="success"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Portfolio performance</div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(totalValue)}</div>
            </div>
            <div className="flex gap-1 text-xs">
              {["1D", "1W", "1M", "1Y", "All"].map((p, i) => (
                <button
                  key={p}
                  className={`px-3 py-1.5 rounded-lg ${
                    i === 2 ? "bg-primary/20 text-primary" : "text-muted-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dashG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.2 240)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.7 0.2 240)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="oklch(0.5 0.02 260)" fontSize={11} />
                <YAxis stroke="oklch(0.5 0.02 260)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.03 260)",
                    border: "1px solid oklch(0.3 0.025 260)",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "oklch(0.97 0.005 260)" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.7 0.2 240)"
                  fill="url(#dashG)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <div className="text-sm text-muted-foreground">Allocation</div>
          <div className="h-48 mt-2">
            {pieData.length === 0 ? (
              <div className="h-full grid place-items-center text-xs text-muted-foreground">
                No holdings yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.22 0.03 260)",
                      border: "1px solid oklch(0.3 0.025 260)",
                      borderRadius: 12,
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {p.name}
                </div>
                <span className="font-semibold">{formatCurrency(p.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Deposit", to: "/wallet/deposit", icon: Plus, accent: "success" },
          { label: "Withdraw", to: "/wallet/withdraw", icon: ArrowDownToLine, accent: "warning" },
          { label: "Transfer", to: "/wallet/transfer", icon: ArrowRightLeft, accent: "primary" },
          { label: "Trade", to: "/market", icon: ShoppingCart, accent: "primary" },
        ].map((q) => (
          <Link
            key={q.label}
            to={q.to}
            className="glass rounded-2xl p-4 hover:border-primary/40 transition flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground">
              <q.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">{q.label}</div>
              <div className="text-xs text-muted-foreground">Quick action</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Top movers</h3>
            <Link to="/market" className="text-xs text-primary font-semibold">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {MOCK_COINS.slice(0, 5).map((c) => (
              <Link
                key={c.symbol}
                to="/market/$symbol"
                params={{ symbol: c.symbol }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-surface grid place-items-center text-lg">
                    {c.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(c.price)}</div>
                  <div
                    className={`text-xs font-semibold ${
                      c.change24h >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {c.change24h >= 0 ? "+" : ""}
                    {c.change24h}%
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent transactions</h3>
            <Link to="/wallet/history" className="text-xs text-primary font-semibold">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface transition"
              >
                <div>
                  <div className="text-sm font-semibold">{t.type}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{formatCurrency(t.amount)}</div>
                  <div
                    className={`text-xs font-semibold ${
                      t.status === "SUCCESS"
                        ? "text-success"
                        : t.status === "PENDING"
                          ? "text-warning"
                          : "text-destructive"
                    }`}
                  >
                    {t.status}
                  </div>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-8">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
