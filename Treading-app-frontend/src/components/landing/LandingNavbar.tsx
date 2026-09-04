import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const links = [
  { label: "Markets", to: "/#markets" },
  { label: "Features", to: "/#features" },
  { label: "Testimonials", to: "/#testimonials" },
  { label: "FAQ", to: "/#faq" },
];

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "glass-strong border-b border-border/50" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary glow-primary">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="gradient-text">Crypto Trading Platform</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.to}
                className="text-sm text-muted-foreground hover:text-foreground transition"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground glow-primary hover:opacity-90 transition"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden grid place-items-center h-10 w-10 rounded-lg bg-surface"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden pb-4 space-y-2"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-surface text-sm"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                className="flex-1 text-center rounded-lg border border-border bg-surface py-2 text-sm"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center rounded-lg gradient-primary py-2 text-sm font-semibold text-primary-foreground"
              >
                Get started
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
