import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL =
  (typeof window !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const TOKEN_KEY = "nx_token";
const USER_KEY = "nx_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function setStoredUser(u: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}
export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error?.response?.data;
    const message =
      data?.message ||
      data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";
    if (error?.response?.status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        localStorage.removeItem("nx-auth");
        window.location.href = "/login";
      }
    }
    // Only show toast in browser
    if (typeof window !== "undefined") {
      toast.error(message);
    }
    return Promise.reject(error);
  },
);

export type ApiError = {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
};
