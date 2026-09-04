import { Link } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative gradient-hero p-12 flex-col justify-between overflow-hidden">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold relative z-10">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary glow-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="gradient-text">Crypto Trading Platform</span>
        </Link>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md"
        >
          <h2 className="text-4xl font-bold leading-tight">
            The fastest way to <span className="gradient-text">trade crypto</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join 2M+ traders using Crypto Trading Platform to manage portfolios, execute trades, and grow
            wealth.
          </p>
          <div className="mt-8 glass-strong rounded-2xl p-5">
            <div className="text-xs text-muted-foreground">Today's volume</div>
            <div className="text-3xl font-bold gradient-text mt-1">$2.8B</div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-muted-foreground">BTC</div>
                <div className="text-sm font-semibold text-success">+2.4%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ETH</div>
                <div className="text-sm font-semibold text-destructive">-1.2%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">SOL</div>
                <div className="text-sm font-semibold text-success">+5.6%</div>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Crypto Trading Platform Labs · Developed by <a href="https://github.com/mohdriyaz" target="_blank" rel="noreferrer" className="hover:text-primary transition font-semibold">Mohd Riyaz</a>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 font-display text-xl font-bold mb-8"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="gradient-text">Crypto Trading Platform</span>
          </Link>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-center">{footer}</div>}
          <div className="mt-8 text-center text-[10px] text-muted-foreground/60">
            Developed by <a href="https://github.com/mohdriyaz" target="_blank" rel="noreferrer" className="hover:text-primary transition font-medium">Mohd Riyaz</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
