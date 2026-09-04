import { api } from "./client";

// Helper to map backend Coin to frontend Coin
export function mapBackendCoin(c: any) {
  return {
    id: c.id,
    symbol: c.symbol?.toUpperCase() || "",
    name: c.name,
    icon: c.image || "🪙",
    price: c.current_price || c.currentPrice || 0,
    change24h: c.price_change_percentage_24h || c.priceChangePercentage24h || 0,
    volume24h: c.total_volume || c.totalVolume || 0,
    marketCap: c.market_cap || c.marketCap || 0,
  };
}

export const authApi = {
  login: (payload: { email: string; password: string }) =>
    api.post("/auth/signin", payload).then((r) => r.data),
  signup: (payload: { name: string; email: string; password: string }) =>
    api.post("/auth/signup", {
      fullName: payload.name,
      email: payload.email,
      password: payload.password
    }).then((r) => r.data),
  verifySigninOtp: (otp: string, id: string) =>
    api.post(`/auth/two-factor/otp/${otp}?id=${id}`).then((r) => r.data),
  forgotPassword: (email: string) =>
    api.post("/auth/users/reset-password/send-otp", { sendTo: email, verificationType: "EMAIL" }).then((r) => r.data),
  resetPassword: (payload: { id: string; otp: string; password: string }) =>
    api.patch(`/auth/users/reset-password/verify-otp?id=${payload.id}`, { otp: payload.otp, password: payload.password }).then((r) => r.data),
  me: () => api.get("/api/users/profile").then((r) => r.data),
  sendVerificationOtp: (verificationType: "EMAIL" | "MOBILE") =>
    api.post(`/api/users/verification/${verificationType}/send-otp`).then((r) => r.data),
  enableTwoFactor: (otp: string) =>
    api.patch(`/api/users/enable-two-factor/verify-otp/${otp}`).then((r) => r.data),
};

export const walletApi = {
  getBalance: () => api.get("/api/wallet").then((r) => r.data),
  deposit: (amount: number, method: string = "stripe") =>
    api.post(`/api/payment/${method.toUpperCase()}/amount/${amount}`).then((r) => r.data),
  verifyPayment: (payload: { orderId: number; paymentId: string }) =>
    api.put(`/api/wallet/deposit?order_id=${payload.orderId}&payment_id=${payload.paymentId}`).then((r) => r.data),
  withdraw: (amount: number) => api.post(`/api/withdrawal/${amount}`).then((r) => r.data),
  transfer: (payload: { toWalletId: number; amount: number }) =>
    api.put(`/api/wallet/${payload.toWalletId}/transfer`, { amount: payload.amount }).then((r) => r.data),
  history: () => api.get("/api/withdrawal").then((r) => r.data),
};

export const marketApi = {
  list: (page: number = 1) =>
    api.get(`/coins?page=${page}`).then((r) => r.data.map(mapBackendCoin)),
  top50: () =>
    api.get("/coins/top50").then((r) => r.data.map(mapBackendCoin)),
  trending: () =>
    api.get("/coins/trending").then((r) => r.data),
  search: (q: string) =>
    api.get(`/coins/search?q=${q}`).then((r) => r.data),
  detail: (coinId: string) =>
    api.get(`/coins/details/${coinId}`).then((r) => r.data),
  chart: (coinId: string, days: number = 7) =>
    api.get(`/coins/${coinId}/chart?days=${days}`).then((r) => r.data),
};

export const tradeApi = {
  place: (payload: { coinId: string; orderType: "BUY" | "SELL"; quantity: number }) =>
    api.post("/api/orders/pay", payload).then((r) => r.data),
  orders: (orderType?: "BUY" | "SELL", assetSymbol?: string) => {
    let params: any = {};
    if (orderType) params.order_type = orderType;
    if (assetSymbol) params.asset_symbol = assetSymbol;
    return api.get("/api/orders", { params }).then((r) => r.data);
  },
  portfolio: () => api.get("/api/asset").then((r) => r.data),
};

export const watchlistApi = {
  list: () => api.get("/api/watchlist/user").then((r) => r.data),
  add: (coinId: string) => api.patch(`/api/watchlist/add/coin/${coinId}`).then((r) => r.data),
};

export const adminApi = {
  withdrawals: () => api.get("/api/admin/withdrawal").then((r) => r.data),
  processWithdrawal: (id: number, accept: boolean) =>
    api.patch(`/api/admin/withdrawal/${id}/processed/${accept}`).then((r) => r.data),
};
