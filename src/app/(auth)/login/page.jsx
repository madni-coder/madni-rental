"use client";

import { useEffect, useState } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading } = useAuth();
  const [email, setEmail] = useState("admin@razvi");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/properties");
    }
  }, [isLoading, router, user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.replace("/properties");
    } catch (requestError) {
      setError(
        requestError?.message ?? "Unable to sign in with the provided credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-sm rounded-2xl border border-border bg-surface/95 p-8 shadow-(--shadow-modal) backdrop-blur">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Building2 aria-hidden="true" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-text">Razvi Rental</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to manage the property workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            autoComplete="username"
            label="Admin Email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@razvi"
            value={email}
          />
          <Input
            autoComplete="current-password"
            label="Password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="123"
            type="password"
            value={password}
          />

          {error ? (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <Button className="w-full" loading={isSubmitting} type="submit">
            Login
          </Button>
        </form>

        <div className="mt-6 rounded-xl border border-border bg-bg/50 p-4 text-sm text-muted">
          <div className="mb-2 flex items-center gap-2 text-text">
            <ShieldCheck aria-hidden="true" size={16} className="text-primary" />
            Demo access
          </div>
          <p>Email: admin@razvi</p>
          <p>Password: 123</p>
        </div>
      </section>
    </main>
  );
}