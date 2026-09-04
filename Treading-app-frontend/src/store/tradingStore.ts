import { create } from "zustand";
import { persist } from "zustand/middleware";
import { watchlistApi } from "@/api/services";

const symbolToIdMap: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  LINK: "chainlink",
  MATIC: "matic-network",
  ATOM: "cosmos",
};

type WatchlistState = {
  symbols: string[];
  setSymbols: (symbols: string[]) => void;
  toggle: (symbol: string) => Promise<void>;
  has: (symbol: string) => boolean;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      symbols: [],
      setSymbols: (symbols) => set({ symbols }),
      toggle: async (symbol) => {
        set((s) => ({
          symbols: s.symbols.includes(symbol)
            ? s.symbols.filter((x) => x !== symbol)
            : [...s.symbols, symbol],
        }));

        const id = symbolToIdMap[symbol.toUpperCase()] || symbol.toLowerCase();
        try {
          await watchlistApi.add(id);
        } catch (err) {
          console.error("Failed to sync watchlist toggle with backend:", err);
        }
      },
      has: (symbol) => get().symbols.includes(symbol),
    }),
    { name: "nx-watchlist" },
  ),
);

export type Holding = {
  symbol: string;
  quantity: number;
  avgPrice: number;
};

type PortfolioState = {
  holdings: Holding[];
  orders: {
    id: string;
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    price: number;
    status: "FILLED" | "PENDING" | "CANCELLED" | "SUCCESS" | "FAILED";
    createdAt: string;
  }[];
  setHoldings: (holdings: Holding[]) => void;
  setOrders: (orders: any[]) => void;
  buy: (symbol: string, quantity: number, price: number) => void;
  sell: (symbol: string, quantity: number, price: number) => boolean;
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      holdings: [],
      orders: [],
      setHoldings: (holdings) => set({ holdings }),
      setOrders: (orders) => set({ orders }),
      buy: (symbol, quantity, price) =>
        set((s) => {
          const existing = s.holdings.find((h) => h.symbol === symbol);
          let holdings;
          if (existing) {
            const totalQty = existing.quantity + quantity;
            const newAvg =
              (existing.quantity * existing.avgPrice + quantity * price) / totalQty;
            holdings = s.holdings.map((h) =>
              h.symbol === symbol ? { ...h, quantity: totalQty, avgPrice: newAvg } : h,
            );
          } else {
            holdings = [...s.holdings, { symbol, quantity, avgPrice: price }];
          }
          return {
            holdings,
            orders: [
              {
                id: `ord_${Date.now()}`,
                symbol,
                side: "BUY",
                quantity,
                price,
                status: "FILLED",
                createdAt: new Date().toISOString(),
              },
              ...s.orders,
            ],
          };
        }),
      sell: (symbol, quantity, price) => {
        const s = get();
        const existing = s.holdings.find((h) => h.symbol === symbol);
        if (!existing || existing.quantity < quantity) return false;
        set({
          holdings: s.holdings
            .map((h) =>
              h.symbol === symbol ? { ...h, quantity: h.quantity - quantity } : h,
            )
            .filter((h) => h.quantity > 0.00000001),
          orders: [
            {
              id: `ord_${Date.now()}`,
              symbol,
              side: "SELL",
              quantity,
              price,
              status: "FILLED",
              createdAt: new Date().toISOString(),
            },
            ...s.orders,
          ],
        });
        return true;
      },
    }),
    { name: "nx-portfolio" },
  ),
);
