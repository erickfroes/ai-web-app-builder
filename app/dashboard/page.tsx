import { Button } from "@/components/ui/button";
import {
  DataCard,
  EmptyState,
  ErrorState,
  FormSection,
  LoadingState,
  MetricCard,
  PageHeader,
  StatusBadge
} from "@/features/design-system/components/dashboard-shell";

export default function DashboardHome() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Welcome back"
        description="Track generation quality, inspect project health, and launch new builds."
        action={<StatusBadge status="ready" />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Active projects" value="12" hint="3 updated today" />
        <MetricCard label="Queued generations" value="4" hint="Avg. wait 2m" />
        <MetricCard label="Validation success" value="98%" hint="Last 24 hours" />
      </div>

      <DataCard title="Recent generations" description="A normalized snapshot for latest project outputs.">
        <LoadingState />
      </DataCard>

      <FormSection title="Project defaults" description="Set shared options used for new generated apps.">
        <p className="text-sm text-muted-foreground">TypeScript strict mode, shadcn/ui, Tailwind semantic tokens.</p>
      </FormSection>

      <EmptyState
        title="No failed runs"
        description="When a generation fails validation, it appears here with retry actions."
        action={<Button variant="outline">Open run history</Button>}
      />

      <ErrorState message="API connection lost. Reconnect OpenAI credentials in organization settings." />
    </section>
  );
}
