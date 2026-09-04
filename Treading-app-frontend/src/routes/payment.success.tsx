import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/payment/success")({
  validateSearch: z.object({ amount: z.number().optional() }),
  head: () => ({ meta: [{ title: "Payment success — Crypto Trading Platform" }] }),
  component: PaymentSuccess,
});

function PaymentSuccess() {
  const { amount } = Route.useSearch();
  return (
    <div className="min-h-screen grid place-items-center bg-background gradient-hero p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-3xl p-10 max-w-md w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }} className="h-20 w-20 rounded-full bg-success/20 grid place-items-center mx-auto mb-6">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </motion.div>
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="text-muted-foreground mt-3">
          {amount ? `${formatCurrency(amount)} has been added to your wallet.` : "Your funds are now available."}
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Link to="/wallet" className="h-11 rounded-xl gradient-primary text-primary-foreground font-semibold grid place-items-center glow-primary">
            Go to wallet
          </Link>
          <Link to="/market" className="h-11 rounded-xl glass grid place-items-center font-semibold">
            Start trading
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
