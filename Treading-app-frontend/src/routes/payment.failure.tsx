import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { formatCurrency } from "@/lib/mock-data";

export const Route = createFileRoute("/payment/failure")({
  validateSearch: z.object({ amount: z.number().optional() }),
  head: () => ({ meta: [{ title: "Payment failed — Crypto Trading Platform" }] }),
  component: PaymentFailure,
});

function PaymentFailure() {
  const { amount } = Route.useSearch();
  return (
    <div className="min-h-screen grid place-items-center bg-background gradient-hero p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong rounded-3xl p-10 max-w-md w-full text-center">
        <div className="h-20 w-20 rounded-full bg-destructive/20 grid place-items-center mx-auto mb-6">
          <XCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">Payment failed</h1>
        <p className="text-muted-foreground mt-3">
          {amount ? `Your ${formatCurrency(amount)} deposit was declined.` : "Your transaction could not be completed."}
          {" "}Please try a different method or contact support.
        </p>
        <div className="mt-8 flex flex-col gap-2">
          <Link to="/wallet/deposit" className="h-11 rounded-xl gradient-primary text-primary-foreground font-semibold grid place-items-center glow-primary">
            Try again
          </Link>
          <Link to="/wallet" className="h-11 rounded-xl glass grid place-items-center font-semibold">
            Back to wallet
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
