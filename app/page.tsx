import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-12">
      <header className="mb-14 flex items-center justify-between">
        <h1 className="text-xl font-semibold">AI Web App Builder</h1>
        <Button>Get Started</Button>
      </header>

      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Ship faster</p>
          <h2 className="text-4xl font-bold leading-tight">Generate production-ready web apps from structured specs.</h2>
          <p className="text-base text-foreground/80">
            Define product intent once, then produce a clean Next.js codebase with consistent design,
            validation, and secure defaults.
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard">
              <Button>Open Dashboard</Button>
            </Link>
            <Button variant="outline">Watch Demo</Button>
          </div>
        </div>
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-semibold">Project generation pipeline</h3>
          <p className="text-sm text-foreground/80">Structured spec → validated plan → generated files.</p>
        </Card>
      </section>
    </main>
  );
}
