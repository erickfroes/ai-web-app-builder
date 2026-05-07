import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card p-4">
        <h2 className="mb-6 text-lg font-semibold">Dashboard</h2>
        <nav className="flex flex-col gap-3 text-sm">
          <Link href="/dashboard/projects">Projects</Link>
          <Link href="/dashboard/projects/new">Create Project</Link>
        </nav>
      </aside>
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
