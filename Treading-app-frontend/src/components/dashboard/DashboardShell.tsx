import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, ReactNode } from "react";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  PieChart,
  Star,
  ListOrdered,
  Shield,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/walletStore";
import { usePortfolioStore, useWatchlistStore } from "@/store/tradingStore";
import { walletApi, tradeApi, watchlistApi } from "@/api/services";
import { formatCurrency } from "@/lib/mock-data";

const nav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Markets", to: "/market", icon: LineChart },
  { label: "Portfolio", to: "/portfolio", icon: PieChart },
  { label: "Wallet", to: "/wallet", icon: Wallet },
  { label: "Orders", to: "/orders", icon: ListOrdered },
  { label: "Watchlist", to: "/watchlist", icon: Star },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const balance = useWalletStore((s) => s.balance);
  const setBalance = useWalletStore((s) => s.setBalance);
  const setTransactions = useWalletStore((s) => s.setTransactions);
  const setHoldings = usePortfolioStore((s) => s.setHoldings);
  const setOrders = usePortfolioStore((s) => s.setOrders);
  const setSymbols = useWatchlistStore((s) => s.setSymbols);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  useEffect(() => {
    if (!user) return;
    
    // Fetch wallet balance
    walletApi.getBalance()
      .then((data) => {
        if (data && typeof data.balance === "number") {
          setBalance(data.balance);
        } else if (data && data.balance !== undefined) {
          setBalance(Number(data.balance));
        }
      })
      .catch((err) => console.error("Error fetching wallet balance:", err));

    // Fetch withdrawals / history
    walletApi.history()
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((w: any) => ({
            id: String(w.id),
            type: "WITHDRAW" as const,
            amount: w.amount,
            status: w.status === "DECLINE" ? "FAILED" as const : w.status as any,
            note: `Bank Withdrawal`,
            createdAt: w.date || new Date().toISOString()
          }));
          setTransactions(mapped);
        }
      })
      .catch((err) => console.error("Error fetching withdrawal history:", err));

    // Fetch portfolio holdings
    tradeApi.portfolio()
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((a: any) => ({
            symbol: a.coin?.symbol?.toUpperCase() || "",
            quantity: a.quantity || 0,
            avgPrice: a.buyPrice || 0,
          }));
          setHoldings(mapped);
        }
      })
      .catch((err) => console.error("Error fetching portfolio:", err));

    // Fetch orders history
    tradeApi.orders()
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((o: any) => ({
            id: String(o.id),
            symbol: o.orderItem?.coin?.symbol?.toUpperCase() || "",
            side: o.orderType || "BUY",
            quantity: o.orderItem?.quantity || 0,
            price: o.orderItem?.buyPrice || o.orderItem?.sellPrice || 0,
            status: o.status === "SUCCESS" ? "FILLED" as const : o.status as any,
            createdAt: o.timestamp || new Date().toISOString()
          }));
          setOrders(mapped);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err));

    // Fetch watchlist symbols
    watchlistApi.list()
      .then((data) => {
        if (data && Array.isArray(data.coins)) {
          const symbols = data.coins.map((c: any) => c.symbol.toUpperCase());
          setSymbols(symbols);
        }
      })
      .catch((err) => console.error("Error fetching watchlist:", err));
  }, [user, pathname, setBalance, setTransactions, setHoldings, setOrders, setSymbols]);

  function onLogout() {
    logout();
    navigate({ to: "/login" });
  }

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + "/");

  const sidebarLinks = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
      {nav.map((item) => {
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition group relative ${
              active
                ? "gradient-primary text-primary-foreground glow-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
      {(user?.role === "ADMIN" || user?.role === "ROLE_ADMIN") && (
        <>
          <div className="mt-6 mb-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {!collapsed && "Admin"}
          </div>
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive("/admin")
                ? "bg-warning/20 text-warning"
                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Shield className="h-4.5 w-4.5 shrink-0" />
            {!collapsed && <span>Admin Panel</span>}
          </Link>
        </>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 font-display font-bold">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && <span className="gradient-text">Crypto Trading Platform</span>}
          </Link>
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="h-8 w-8 grid place-items-center rounded-lg hover:bg-sidebar-accent"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${collapsed ? "" : "rotate-180"}`}
            />
          </button>
        </div>
        {sidebarLinks}
        <div className="p-3 border-t border-sidebar-border">
          {!collapsed ? (
            <div className="glass rounded-xl p-3">
              <div className="text-xs text-muted-foreground">Wallet balance</div>
              <div className="text-lg font-bold mt-1">{formatCurrency(balance)}</div>
              <Link
                to="/wallet/deposit"
                className="mt-2 block text-xs font-semibold text-primary"
              >
                Deposit funds →
              </Link>
            </div>
          ) : (
            <Link
              to="/wallet"
              className="grid place-items-center h-10 w-full rounded-lg gradient-primary"
            >
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-sidebar border-r border-sidebar-border z-50 lg:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
                <span className="flex items-center gap-2 font-display font-bold">
                  <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
                    <TrendingUp className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="gradient-text">Crypto Trading Platform</span>
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 grid place-items-center rounded-lg hover:bg-sidebar-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {sidebarLinks}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setOpen(true)}
                className="lg:hidden h-9 w-9 grid place-items-center rounded-lg bg-surface"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden md:flex items-center gap-2 bg-surface rounded-xl px-3 h-10 max-w-md flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search markets, coins, transactions…"
                  className="bg-transparent outline-none text-sm flex-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="h-9 w-9 grid place-items-center rounded-lg bg-surface hover:bg-accent relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <div className="hidden sm:flex items-center gap-3 bg-surface rounded-xl pl-3 pr-1 h-10">
                <div className="text-right">
                  <div className="text-xs font-semibold leading-tight">
                    {user?.name ?? "Guest"}
                  </div>
                  <div className="text-[10px] text-muted-foreground leading-tight">
                    {user?.role ?? "USER"}
                  </div>
                </div>
                <div className="h-8 w-8 rounded-lg gradient-primary grid place-items-center text-xs font-bold text-primary-foreground">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="h-9 w-9 grid place-items-center rounded-lg bg-surface hover:bg-destructive/20 hover:text-destructive transition"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col justify-between"
        >
          <div>{children}</div>
          <footer className="mt-12 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Crypto Trading Platform. Developed by{" "}
              <a
                href="https://github.com/mohdriyaz"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Mohd Riyaz
              </a>
            </p>
          </footer>
        </motion.main>
      </div>
    </div>
  );
}
