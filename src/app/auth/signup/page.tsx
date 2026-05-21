"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Signup page — visual stub.
 *
 * There is no backend Credentials signup flow yet.
 * On submit, routes to /auth/signin?status=signup-pending so the
 * signin page can optionally surface a banner in future.
 *
 * WIRING NOTE: Replace the onSubmit handler below once the server action exists.
 */
export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError("");

    if (password !== confirm) {
      setFieldError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters.");
      return;
    }

    // Stub — no backend action yet. Indicate pending state and redirect.
    setSubmitted(true);
    setTimeout(() => {
      router.push("/auth/signin?status=signup-pending");
    }, 1800);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* ── Heading ──────────────────────────────────────────────────────────── */}
      <div className="stagger-in stagger-in-1 flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          Get access to Plaksha Makerspace.
        </p>
      </div>

      {/* ── Form card ────────────────────────────────────────────────────────── */}
      <div
        className="stagger-in stagger-in-2 rounded-2xl border border-border bg-card p-8 shadow-sm"
        style={{ boxShadow: "var(--shadow-card-lift, 0 4px 24px -6px rgba(0,0,0,0.08))" }}
      >
        {submitted ? (
          /* ── Pending state ────────────────────────────────────────────────── */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: "hsl(182 80% 32% / 0.10)" }}
              aria-hidden="true"
            >
              {/* Simple checkmark — no external icon needed */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(182 80% 32%)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-base font-semibold text-foreground">Request received</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Account creation is pending admin approval. You&apos;ll be redirected shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fullname" className="text-sm font-medium text-foreground">
                Full name
              </Label>
              <Input
                id="fullname"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Arjun Patel"
                required
                className="h-11 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Plaksha email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-email" className="text-sm font-medium text-foreground">
                Plaksha email
              </Label>
              <Input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@plaksha.edu.in"
                required
                className="h-11 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="h-11 rounded-xl border-border bg-background text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-confirm" className="text-sm font-medium text-foreground">
                Confirm password
              </Label>
              <Input
                id="signup-confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                required
                className="h-11 rounded-xl border-border bg-background text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Field error */}
            {fieldError && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/6 px-3 py-2 text-sm text-destructive"
              >
                {fieldError}
              </p>
            )}

            {/* Primary CTA */}
            <Button
              size="lg"
              type="submit"
              className="mt-1 w-full rounded-xl font-semibold"
              style={{
                background: "hsl(182 80% 32%)",
                color: "#ffffff",
                boxShadow: "0 8px 20px -8px hsl(182 80% 32% / 0.40)",
              }}
            >
              Create account
            </Button>

            {/* Gating notice */}
            <p className="text-center text-xs leading-relaxed text-muted-foreground/70">
              Account creation is gated by Plaksha admin approval.
              <br />
              Microsoft sign-in coming soon.
            </p>
          </form>
        )}
      </div>

      {/* ── Footer link ──────────────────────────────────────────────────────── */}
      <p className="stagger-in stagger-in-3 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
