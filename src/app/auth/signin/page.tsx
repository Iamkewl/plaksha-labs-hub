"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ── Environment flags ──────────────────────────────────────────────────────────
const credentialsEnabled =
  process.env.NEXT_PUBLIC_AUTH_CREDENTIALS_ENABLED !== "false";
const devAuthEnabled = process.env.NEXT_PUBLIC_AUTH_DEV_BYPASS === "true";

const demoAccounts = [
  { label: "Admin", email: "admin@plaksha.edu.in" },
  { label: "Mentor", email: "rajesh.kumar@plaksha.edu.in" },
  { label: "Student", email: "arjun.patel@plaksha.edu.in" },
] as const;

// ── Microsoft logo inline SVG ──────────────────────────────────────────────────
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 21 21"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
    </svg>
  );
}

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  }

  async function signInDevAccount(targetEmail: string) {
    await signIn("dev-login", {
      email: targetEmail,
      callbackUrl: "/dashboard",
    });
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Heading ──────────────────────────────────────────────────────────── */}
      <div className="stagger-in stagger-in-1 flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Sign in with your Plaksha account to continue.
        </p>
      </div>

      {/* ── Main form card ───────────────────────────────────────────────────── */}
      <div
        className="stagger-in stagger-in-2 rounded-2xl border border-border bg-card p-8 shadow-sm"
        style={{ boxShadow: "var(--shadow-card-lift, 0 4px 24px -6px rgba(0,0,0,0.08))" }}
      >
        {credentialsEnabled ? (
          <div className="flex flex-col gap-6">
            {/* Credentials form */}
            <form onSubmit={handleCredentialsSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@plaksha.edu.in"
                  required
                  className="h-11 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 rounded-xl border-border bg-background text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Error message */}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/20 bg-destructive/6 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              {/* Primary CTA */}
              <Button
                size="lg"
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: loading
                    ? "hsl(182 80% 32% / 0.7)"
                    : "hsl(182 80% 32%)",
                  color: "#ffffff",
                  boxShadow: loading
                    ? "none"
                    : "0 8px 20px -8px hsl(182 80% 32% / 0.40)",
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            {/* OR divider */}
            <div className="flex items-center gap-3" aria-hidden="true">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                or
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Microsoft Entra ID */}
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/dashboard" })}
              className="w-full rounded-xl border-border bg-background font-medium text-foreground hover:bg-muted/60"
            >
              <MicrosoftIcon className="mr-2.5 h-4 w-4 shrink-0" />
              Continue with Microsoft
            </Button>
            <p className="text-center text-xs text-muted-foreground/70">
              Use your @plaksha.edu.in account
            </p>

            {/* Dev bypass — only visible when NEXT_PUBLIC_AUTH_DEV_BYPASS=true */}
            {devAuthEnabled && (
              <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Dev shortcuts
                  </span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => signInDevAccount(account.email)}
                      className="rounded-lg border-border/70 text-xs font-medium"
                    >
                      {account.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Credentials disabled — Microsoft only */
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              type="button"
              onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/dashboard" })}
              className="w-full rounded-xl font-semibold"
              style={{
                background: "hsl(182 80% 32%)",
                color: "#ffffff",
                boxShadow: "0 8px 20px -8px hsl(182 80% 32% / 0.40)",
              }}
            >
              <MicrosoftIcon className="mr-2.5 h-4 w-4 shrink-0" />
              Sign in with Microsoft
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Use your @plaksha.edu.in account
            </p>
          </div>
        )}
      </div>

      {/* Sign-up link intentionally removed — accounts are provisioned by admins only */}
    </div>
  );
}
