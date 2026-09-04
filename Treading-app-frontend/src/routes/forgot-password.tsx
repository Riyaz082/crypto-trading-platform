import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { TextField, SubmitButton } from "@/components/auth/FormFields";
import { authApi } from "@/api/services";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Crypto Trading Platform" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      let data: any;
      try {
        data = await authApi.forgotPassword(email);
      } catch (err: any) {
        if (!err.response) {
          toast.warning("Backend offline. Using local demo session.");
          data = { session: "demo-session-uuid" };
        } else {
          return;
        }
      }
      toast.success("Password reset code sent to your email!");
      navigate({ to: "/reset-password", search: { id: data.session } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Back to sign in
        </Link>
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
        />
        <SubmitButton loading={loading}>Send reset link</SubmitButton>
      </form>
    </AuthLayout>
  );
}
