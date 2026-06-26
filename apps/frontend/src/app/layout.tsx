import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArchiGen — AI-Powered System Architecture Designer",
  description:
    "Describe your software product in natural language and get a high-level system architecture diagram on an interactive canvas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
