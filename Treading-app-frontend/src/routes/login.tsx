import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField, SubmitButton } from "@/components/auth/FormFields";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/services";
import { setToken, setStoredUser } from "@/api/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Crypto Trading Platform" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    try {
      let data: any;
      try {
        data = await authApi.login({ email, password });
      } catch (err: any) {
        if (!err.response) {
          toast.warning("Backend offline. Using local demo mode.");
          data = {
            jwt: "demo-jwt-" + Date.now(),
            isTwoFactorAuth: false,
          };
        } else {
          return;
        }
      }

      if (data.isTwoFactorAuth) {
        toast.info("Two-factor authentication code sent to your email!");
        navigate({
          to: "/verify-otp",
          search: {
            email,
            id: data.session,
            isTwoFactor: "true",
          },
        });
        return;
      }

      const token = data.jwt;
      if (token) {
        setToken(token);
        let userProfile: any;
        if (token.startsWith("demo-jwt")) {
          userProfile = {
            id: "u_demo",
            fullName: email.split("@")[0],
            email,
            role: email.startsWith("admin") ? "ROLE_ADMIN" : "ROLE_CUSTOMER",
          };
        } else {
          userProfile = await authApi.me();
        }
        const mappedUser = {
          id: String(userProfile.id || userProfile.id),
          name: userProfile.fullName || userProfile.name || email.split("@")[0],
          email: userProfile.email || email,
          role: userProfile.role || "USER",
        };
        setStoredUser(mappedUser);
        setAuth(mappedUser, token);
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your wallet, portfolio, and live markets."
      footer={
        <span className="text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            Create one
          </Link>
        </span>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <TextField
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>
    </AuthLayout>
  );
}
