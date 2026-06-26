"use client";

import { type ReactNode } from "react";
import { AuthProvider } from "./auth-provider";

/**
 * Client-side wrapper that provides auth context to the entire app.
 * Renders children once auth is initialized.
 */
export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
