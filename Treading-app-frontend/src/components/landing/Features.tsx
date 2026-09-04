import { motion } from "framer-motion";
import { ShieldCheck, Wallet, BarChart3, ArrowRightLeft, Lock, CreditCard } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "JWT security", desc: "Bank-grade JSON Web Token auth with refresh rotation and role-based access." },
  { icon: Wallet, title: "Built-in wallet", desc: "Multi-asset wallet with instant transfers and on-chain settlement." },
  { icon: BarChart3, title: "Portfolio analytics", desc: "Realised P&L, allocation breakdowns, and tax-ready reports out of the box." },
  { icon: ArrowRightLeft, title: "Secure trading", desc: "Atomic order execution with slippage protection and signed trade slips." },
  { icon: Lock, title: "Admin controls", desc: "Granular admin panel for KYC, withdrawal approvals, and risk policies." },
  { icon: CreditCard, title: "Demo payment gateway", desc: "Sandbox payment flow to simulate deposits, refunds, and verification." },
];

export function Features() {
  return (
    <section id="features" className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything you need to <span className="gradient-text">trade & scale</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Production-ready primitives backed by a Spring Boot core.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 group hover:border-primary/40 transition"
            >
              <div className="h-12 w-12 rounded-xl gradient-primary grid place-items-center mb-4 group-hover:glow-primary transition">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
