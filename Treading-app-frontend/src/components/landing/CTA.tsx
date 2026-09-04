import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-strong rounded-3xl p-10 md:p-16 overflow-hidden text-center"
        >
          <div className="absolute inset-0 gradient-hero opacity-60" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto">
              Start trading on the platform built for{" "}
              <span className="gradient-text">the next billion users</span>
            </h2>
            <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
              Free to sign up. No credit card required. Real markets in under 60 seconds.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground glow-primary hover:scale-[1.02] transition"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl glass px-7 py-3.5 text-sm font-semibold hover:bg-surface transition"
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
