import { motion } from "framer-motion";
import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  delta,
  icon,
  accent = "primary",
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
  accent?: "primary" | "success" | "destructive" | "warning";
}) {
  const accentMap = {
    primary: "from-primary/30 to-glow/10 text-primary",
    success: "from-success/30 to-success/10 text-success",
    destructive: "from-destructive/30 to-destructive/10 text-destructive",
    warning: "from-warning/30 to-warning/10 text-warning",
  } as const;
  const deltaUp = delta?.startsWith("+");
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass rounded-2xl p-5 relative overflow-hidden"
    >
      <div
        className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${accentMap[accent]} opacity-50 blur-2xl`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">
            {label}
          </div>
          {icon && (
            <div className={`h-9 w-9 grid place-items-center rounded-xl bg-surface ${accentMap[accent].split(" ").pop()}`}>
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3 text-3xl font-bold">{value}</div>
        {delta && (
          <div
            className={`mt-1 text-xs font-semibold ${
              deltaUp ? "text-success" : "text-destructive"
            }`}
          >
            {delta}
          </div>
        )}
      </div>
    </motion.div>
  );
}
