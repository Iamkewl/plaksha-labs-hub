"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const devAuthEnabled = process.env.NEXT_PUBLIC_AUTH_DEV_BYPASS === "true";
const demoAccounts = [
  { label: "Admin", email: "admin@plaksha.edu.in" },
  { label: "Mentor", email: "rajesh.kumar@plaksha.edu.in" },
  { label: "Student", email: "arjun.patel@plaksha.edu.in" },
];

export default function SignInPage() {
  const [email, setEmail] = useState("admin@plaksha.edu.in");

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
            {devAuthEnabled
              ? "Development login is enabled for local testing"
              : "Sign in with your university account to access the makerspace"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {devAuthEnabled ? (
            <>
              <div className="space-y-2 rounded-xl border border-white/15 bg-black/25 p-3">
                <Label htmlFor="email">Demo email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@plaksha.edu.in"
                />
                <Button size="lg" className="w-full" onClick={() => signInDevAccount(email)}>
                  Sign in without Azure
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.email}
                    variant="outline"
                    onClick={() => signInDevAccount(account.email)}
                  >
                    {account.label}
                  </Button>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Use any seeded @plaksha.edu.in account from the copied database setup.
              </p>
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
