"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    try {
      await login(email, password);
    } catch {
      /* error is set by provider */
    }
  };

  return (
    <div className="min-h-screen bg-neo-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-neo-black rounded-16 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF8E7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight">ArchiGen</span>
        </div>

        <div className="neo-card">
          <h1 className="text-xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-neo-gray-600 font-medium mb-6">
            Sign in to your account
          </p>

          {error && (
            <div className="mb-4 neo-badge bg-neo-red text-white text-xs w-full justify-between">
              <span>{error}</span>
              <button onClick={clearError} className="ml-2 font-bold">✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neo-input !py-2.5 !text-sm"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neo-input !py-2.5 !text-sm"
                placeholder="••••••••"
                required
                minLength={1}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="neo-btn-primary w-full !py-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-neo-gray-600 font-medium">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-neo-blue font-bold underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
