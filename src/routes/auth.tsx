import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Admin sign-in · DocuForge" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Administrator sign-in for the DocuForge website dashboard." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const inputClass =
    "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:ring-2 focus-visible:ring-ring";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await navigate({ to: "/admin" });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.info("Check your email", {
            description: "We sent a confirmation link. Click it to activate your admin account, then sign in.",
          });
          setMode("signin");
        } else {
          await navigate({ to: "/admin" });
        }
      }
    } catch (err) {
      toast.error("Sign-in failed", {
        description: err instanceof Error ? err.message : "Please check your email and password.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Admin sign-in" : "Create admin account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Private area for DocuForge download analytics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-lift">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="At least 8 characters"
            />
          </div>
          <Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">
            {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            {mode === "signin" ? "Need to create an account?" : "Already have an account? Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This dashboard is restricted to the site administrator. Public visitors never
          need an account to download DocuForge.
        </p>
      </div>
    </div>
  );
}
