import { AppShell, Sidebar, Topbar } from "@/features/design-system/components/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Sidebar />
      <div className="lg:ml-64">
        <Topbar />
        <main className="px-6 py-6 lg:px-8">{children}</main>
      </div>
    </AppShell>
  );
}
