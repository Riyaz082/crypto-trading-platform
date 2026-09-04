import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { MOCK_COINS, formatCurrency } from "@/lib/mock-data";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-6">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Live markets · 200+ assets
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Trade crypto with{" "}
              <span className="gradient-text">institutional</span> confidence.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              A modern Bitcoin trading platform that enables users to monitor market trends, execute trades, manage portfolios, and analyze real-time cryptocurrency data.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground glow-primary hover:scale-[1.02] transition"
              >
                Start trading free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3.5 text-sm font-semibold hover:bg-surface transition"
              >
                Explore markets
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "$28B", v: "24h volume" },
                { k: "2M+", v: "Active traders" },
                { k: "99.9%", v: "Uptime SLA" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold gradient-text">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-0 gradient-primary opacity-30 blur-3xl rounded-full" />
            <div className="relative glass-strong rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Portfolio Value</div>
                  <div className="text-3xl font-bold">$84,210.42</div>
                </div>
                <div className="text-sm font-semibold text-success">+12.4%</div>
              </div>
              <div className="h-32 rounded-xl bg-surface relative overflow-hidden">
                <svg viewBox="0 0 400 120" className="w-full h-full">
                  <defs>
                    <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.7 0.2 240)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="oklch(0.7 0.2 240)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,80 L40,70 L80,75 L120,55 L160,60 L200,40 L240,50 L280,30 L320,35 L360,20 L400,25 L400,120 L0,120 Z"
                    fill="url(#g)"
                  />
                  <path
                    d="M0,80 L40,70 L80,75 L120,55 L160,60 L200,40 L240,50 L280,30 L320,35 L360,20 L400,25"
                    fill="none"
                    stroke="oklch(0.7 0.2 240)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {MOCK_COINS.slice(0, 3).map((c) => (
                  <div key={c.symbol} className="rounded-xl bg-surface p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="text-lg">{c.icon}</span>
                      {c.symbol}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">
                      {formatCurrency(c.price)}
                    </div>
                    <div
                      className={`text-xs mt-0.5 font-semibold ${
                        c.change24h >= 0 ? "text-success" : "text-destructive"
                      }`}
                    >
                      {c.change24h >= 0 ? "+" : ""}
                      {c.change24h}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-6 -bottom-6 glass-strong rounded-2xl p-4 shadow-xl hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-success/20 grid place-items-center">
                  <ShieldCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Security</div>
                  <div className="text-sm font-semibold">Bank-grade JWT</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-4 top-12 glass-strong rounded-2xl p-4 shadow-xl hidden sm:block"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 grid place-items-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Avg execution</div>
                  <div className="text-sm font-semibold">12 ms</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
