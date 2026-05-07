import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Web App Builder",
  description: "Generate high-quality Next.js apps from structured specifications."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
