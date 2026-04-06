"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleLogin() {
    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      window.location.href = "/";
    } else {
      setError(true);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col gap-4 w-full max-w-sm p-8 border border-border rounded-lg">
        <h1 className="text-xl font-bold font-mono">IIMpact Dashboard</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Enter password to continue.
        </p>
        <Input
          type="password"
          className="font-mono"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        {error && (
          <p className="text-sm text-red-500 font-mono">Incorrect password.</p>
        )}
        <Button className="font-mono" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </main>
  );
}
