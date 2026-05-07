import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>;
}

export function Sidebar() {
  const links = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/projects/new", label: "New Project" }
  ];

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card/70 p-5 lg:block">
      <p className="mb-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">AI Builder</p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur lg:px-8">
      <CommandSearchInput placeholder="Search projects, prompts, or docs" />
      <Button size="sm">Create project</Button>
    </header>
  );
}

export function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </Card>
  );
}

export function DataCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="mb-4 space-y-1">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </Card>
  );
}

export function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-6">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ status }: { status: "ready" | "running" | "error" }) {
  const classes = {
    ready: "bg-primary/15 text-primary",
    running: "bg-muted text-muted-foreground",
    error: "bg-destructive/15 text-destructive"
  };

  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", classes[status])}>{status}</span>;
}

export function CommandSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <label className="flex w-full max-w-md items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm text-muted-foreground focus-within:ring-2 focus-within:ring-ring">
      <Search className="h-4 w-4" aria-hidden />
      <input className="w-full bg-transparent text-foreground outline-none" placeholder={placeholder} />
    </label>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5">{action}</div>
    </div>
  );
}

export function LoadingState() {
  return <div className="h-28 animate-pulse rounded-lg border border-border bg-muted" aria-label="Loading" />;
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      {message}
    </div>
  );
}
