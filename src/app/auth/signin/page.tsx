"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const credentialsEnabled =
  process.env.NEXT_PUBLIC_AUTH_CREDENTIALS_ENABLED === "true" ||
  process.env.NEXT_PUBLIC_AUTH_DEV_BYPASS === "true";
const devAuthEnabled = process.env.NEXT_PUBLIC_AUTH_DEV_BYPASS === "true";
const demoAccounts = [
  { label: "Admin", email: "admin@plaksha.edu.in" },
  { label: "Mentor", email: "rajesh.kumar@plaksha.edu.in" },
  { label: "Student", email: "arjun.patel@plaksha.edu.in" },
];

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
      setError("Invalid email or password.");
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
    <div className="app-canvas flex min-h-screen items-center justify-center px-4 text-foreground">
      <Card className="surface-panel w-full max-w-md border-white/15 bg-[#151624]/78">
        <CardHeader className="text-center">
          <p className="section-kicker">Secure Access</p>
          <CardTitle className="text-2xl font-bold">
            Plaksha Makerspace Hub
          </CardTitle>
          <CardDescription>
            Sign in to access the makerspace
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {credentialsEnabled ? (
            <>
              <form onSubmit={handleCredentialsSignIn} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>

              {devAuthEnabled && (
                <>
                  <div className="relative flex items-center gap-2">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs text-muted-foreground">dev shortcuts</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {demoAccounts.map((account) => (
                      <Button
                        key={account.email}
                        variant="outline"
                        type="button"
                        onClick={() => signInDevAccount(account.email)}
                      >
                        {account.label}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                size="lg"
                className="w-full"
                onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/dashboard" })}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Sign in with Microsoft
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Use your @plaksha.edu.in account
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
