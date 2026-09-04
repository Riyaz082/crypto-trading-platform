import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Transaction = {
  id: string;
  type: "DEPOSIT" | "WITHDRAW" | "TRANSFER" | "BUY" | "SELL";
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  note?: string;
  createdAt: string;
};

type WalletState = {
  balance: number;
  locked: number;
  currency: string;
  transactions: Transaction[];
  setBalance: (balance: number) => void;
  setTransactions: (transactions: Transaction[]) => void;
  credit: (amount: number, note?: string, type?: Transaction["type"]) => void;
  debit: (amount: number, note?: string, type?: Transaction["type"]) => boolean;
  addTransaction: (t: Omit<Transaction, "id" | "createdAt"> & { id?: string }) => void;
};

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 0,
      locked: 0,
      currency: "USD",
      transactions: [],
      setBalance: (balance) => set({ balance }),
      setTransactions: (transactions) => set({ transactions }),
      credit: (amount, note, type = "DEPOSIT") =>
        set((s) => ({
          balance: s.balance + amount,
          transactions: [
            {
              id: `tx_${Date.now()}`,
              type,
              amount,
              status: "SUCCESS",
              note,
              createdAt: new Date().toISOString(),
            },
            ...s.transactions,
          ],
        })),
      debit: (amount, note, type = "WITHDRAW") => {
        const s = get();
        if (s.balance < amount) return false;
        set({
          balance: s.balance - amount,
          transactions: [
            {
              id: `tx_${Date.now()}`,
              type,
              amount,
              status: type === "WITHDRAW" ? "PENDING" : "SUCCESS",
              note,
              createdAt: new Date().toISOString(),
            },
            ...s.transactions,
          ],
        });
        return true;
      },
      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            {
              ...t,
              id: t.id ?? `tx_${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...s.transactions,
          ],
        })),
    }),
    { name: "nx-wallet" },
  ),
);
