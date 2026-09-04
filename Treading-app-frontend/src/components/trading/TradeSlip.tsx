import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Coin, formatCurrency } from "@/lib/mock-data";
import { useWalletStore } from "@/store/walletStore";
import { usePortfolioStore } from "@/store/tradingStore";
import { tradeApi, walletApi } from "@/api/services";

export function TradeSlip({
  coin,
  open,
  onClose,
}: {
  coin: Coin | null;
  open: boolean;
  onClose: () => void;
}) {
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState("");
  const balance = useWalletStore((s) => s.balance);
  const setBalance = useWalletStore((s) => s.setBalance);
  const debit = useWalletStore((s) => s.debit);
  const credit = useWalletStore((s) => s.credit);
  const holdings = usePortfolioStore((s) => s.holdings);
  const setHoldings = usePortfolioStore((s) => s.setHoldings);
  const buy = usePortfolioStore((s) => s.buy);
  const sell = usePortfolioStore((s) => s.sell);
  const [loading, setLoading] = useState(false);

  const quantity = parseFloat(qty) || 0;
  const total = useMemo(() => (coin ? quantity * coin.price : 0), [coin, quantity]);
  const holding = coin ? holdings.find((h) => h.symbol === coin.symbol) : undefined;
  const maxSellQty = holding?.quantity ?? 0;

  function reset() {
    setQty("");
    setSide("BUY");
  }

  async function onSubmit() {
    if (!coin) return;
    if (quantity <= 0) return toast.error("Enter a valid quantity");
    if (side === "BUY" && total > balance) return toast.error("Insufficient wallet balance");
    if (side === "SELL" && quantity > maxSellQty) return toast.error(`You only hold ${maxSellQty} ${coin.symbol}`);

    setLoading(true);
    try {
      try {
        await tradeApi.place({
          coinId: coin.id || (coin.symbol.toUpperCase() === "BTC" ? "bitcoin" : coin.symbol.toUpperCase() === "ETH" ? "ethereum" : coin.name.toLowerCase()),
          orderType: side,
          quantity
        });
        
        // Refresh balance and portfolio
        const wallet = await walletApi.getBalance();
        if (wallet && typeof wallet.balance === "number") {
          setBalance(wallet.balance);
        } else if (wallet && wallet.balance !== undefined) {
          setBalance(Number(wallet.balance));
        }

        const assets = await tradeApi.portfolio();
        if (Array.isArray(assets)) {
          const mapped = assets.map((a: any) => ({
            symbol: a.coin?.symbol?.toUpperCase() || "",
            quantity: a.quantity || 0,
            avgPrice: a.buyPrice || 0,
          }));
          setHoldings(mapped);
        }

        toast.success(`Successfully placed ${side.toLowerCase()} order for ${quantity} ${coin.symbol}!`);
      } catch (err: any) {
        if (!err.response) {
          toast.warning("Backend offline. Simulating trade locally.");
          if (side === "BUY") {
            debit(total, `Bought ${quantity} ${coin.symbol}`, "BUY");
            buy(coin.symbol, quantity, coin.price);
          } else {
            sell(coin.symbol, quantity, coin.price);
            credit(total, `Sold ${quantity} ${coin.symbol}`, "SELL");
          }
          toast.success(`Successfully placed ${side.toLowerCase()} order for ${quantity} ${coin.symbol}!`);
        } else {
          return;
        }
      }
      reset();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && coin && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[420px] z-50 bg-card border-l border-border p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-surface grid place-items-center text-lg">
                  {coin.icon}
                </div>
                <div>
                  <div className="font-semibold">{coin.name}</div>
                  <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 grid place-items-center rounded-lg bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex p-1 bg-surface rounded-xl mb-5">
              {(["BUY", "SELL"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
                    side === s
                      ? s === "BUY"
                        ? "bg-success text-success-foreground"
                        : "bg-destructive text-destructive-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Market price</span>
                  <span className="font-semibold">{formatCurrency(coin.price)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">24h change</span>
                  <span
                    className={`font-semibold ${
                      coin.change24h >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {coin.change24h >= 0 ? "+" : ""}
                    {coin.change24h}%
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  step="any"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-1 h-12 rounded-xl bg-input border border-border px-4 text-lg font-semibold outline-none focus:border-primary"
                />
                <div className="flex gap-2 mt-2">
                  {[0.25, 0.5, 0.75, 1].map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        if (side === "BUY") {
                          setQty(((balance * p) / coin.price).toFixed(6));
                        } else {
                          setQty((maxSellQty * p).toFixed(6));
                        }
                      }}
                      className="flex-1 py-1.5 text-xs rounded-lg bg-surface hover:bg-accent"
                    >
                      {Math.round(p * 100)}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet balance</span>
                  <span className="font-semibold">{formatCurrency(balance)}</span>
                </div>
                {side === "SELL" && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You hold</span>
                    <span className="font-semibold">
                      {maxSellQty} {coin.symbol}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Estimated total</span>
                  <span className="font-bold text-lg">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={onSubmit}
                disabled={loading}
                className={`w-full h-12 rounded-xl font-semibold text-sm transition ${
                  side === "BUY"
                    ? "bg-success text-success-foreground hover:opacity-90 disabled:opacity-60"
                    : "bg-destructive text-destructive-foreground hover:opacity-90 disabled:opacity-60"
                }`}
              >
                {loading ? "Processing..." : `${side} ${coin.symbol}`}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
