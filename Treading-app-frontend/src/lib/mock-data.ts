// Demo / mock crypto data. Replace with real API calls when backend is wired.
export type Coin = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  icon: string;
};

export const MOCK_COINS: Coin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 67432.12, change24h: 2.41, marketCap: 1320000000000, volume24h: 28400000000, icon: "₿" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", price: 3521.87, change24h: -1.18, marketCap: 423000000000, volume24h: 15200000000, icon: "Ξ" },
  { id: "solana", symbol: "SOL", name: "Solana", price: 182.34, change24h: 5.62, marketCap: 84000000000, volume24h: 3200000000, icon: "◎" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", price: 612.45, change24h: 0.84, marketCap: 91000000000, volume24h: 1800000000, icon: "♦" },
  { id: "ripple", symbol: "XRP", name: "Ripple", price: 0.582, change24h: -2.45, marketCap: 32000000000, volume24h: 1100000000, icon: "✕" },
  { id: "cardano", symbol: "ADA", name: "Cardano", price: 0.461, change24h: 1.92, marketCap: 16200000000, volume24h: 410000000, icon: "₳" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", price: 0.157, change24h: 8.12, marketCap: 22500000000, volume24h: 1700000000, icon: "Ð" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche", price: 35.21, change24h: -0.74, marketCap: 13600000000, volume24h: 380000000, icon: "▲" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", price: 7.42, change24h: 3.21, marketCap: 10100000000, volume24h: 220000000, icon: "●" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", price: 14.87, change24h: -1.04, marketCap: 8900000000, volume24h: 320000000, icon: "⬡" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon", price: 0.682, change24h: 4.18, marketCap: 6500000000, volume24h: 280000000, icon: "⬢" },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos", price: 8.91, change24h: 1.32, marketCap: 3400000000, volume24h: 140000000, icon: "✦" },
];

export function generateSparkline(base: number, points = 30, vol = 0.04) {
  const arr: { i: number; v: number }[] = [];
  let v = base;
  for (let i = 0; i < points; i++) {
    v = v * (1 + (Math.random() - 0.5) * vol);
    arr.push({ i, v: Number(v.toFixed(2)) });
  }
  return arr;
}

export function formatCurrency(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: n < 1 ? 4 : 2,
  }).format(n);
}

export function formatCompact(n: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(n);
}
