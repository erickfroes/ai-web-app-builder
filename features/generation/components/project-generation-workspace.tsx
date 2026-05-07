import Link from "next/link";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { DataCard, ErrorState, LoadingState, StatusBadge } from "@/features/design-system/components/dashboard-shell";

export function ProjectGenerationWorkspace({ projectId }: { projectId: string }) {
  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-5">
        <GenerationStatusPanel projectId={projectId} />
        <VersionHistoryPanel />
      </div>
      <div className="space-y-6 xl:col-span-7">
        <GeneratedFileExplorer />
        <FilePreviewPanel />
      </div>
    </div>
  );
}

function GenerationStatusPanel({ projectId }: { projectId: string }) {
  return (
    <DataCard title="Generation status" description="Current orchestration phase, progress and blockers.">
      <div className="space-y-3 text-sm">
        <div className="flex justify-end">
          <Link href={`/api/projects/${projectId}/export`} className={buttonVariants({ size: 'sm' })}>
            Download ZIP
          </Link>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <span>Spec synthesis</span>
          <StatusBadge status="ready" />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <span>File patch generation</span>
          <StatusBadge status="running" />
        </div>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <span>Quality review</span>
          <span className="text-xs text-muted-foreground">Queued</span>
        </div>
      </div>
    </DataCard>
  );
}

function GeneratedFileExplorer() {
  const files = ["app/dashboard/page.tsx", "features/project/components/project-list.tsx", "schemas/index.ts"];

  return (
    <DataCard title="Generated file explorer" description="Browse generated files and review paths before applying patches.">
      <ul className="space-y-2 text-sm">
        {files.map((file) => (
          <li key={file} className="rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
            {file}
          </li>
        ))}
      </ul>
    </DataCard>
  );
}

function FilePreviewPanel() {
  return (
    <DataCard title="File preview" description="Review generated file content snapshots (live preview intentionally disabled).">
      <Card className="overflow-hidden bg-background">
        <pre className="max-h-72 overflow-auto p-4 text-xs text-muted-foreground">
{`export default function DashboardPage() {
  return <main className="p-6">Generated output preview...</main>;
}`}
        </pre>
      </Card>
    </DataCard>
  );
}

function VersionHistoryPanel() {
  return (
    <DataCard title="Version history" description="Track generations and rollback candidates.">
      <div className="space-y-3 text-sm">
        <div className="rounded-md border border-border p-3">
          <p className="font-medium">v0.3 — Current</p>
          <p className="text-xs text-muted-foreground">Generated 15 minutes ago · 12 files changed</p>
        </div>
        <div className="rounded-md border border-border p-3">
          <p className="font-medium">v0.2</p>
          <p className="text-xs text-muted-foreground">Generated yesterday · 8 files changed</p>
        </div>
      </div>
    </DataCard>
  );
}

export function ProjectDetailLoadingState() {
  return (
    <div className="space-y-4">
      <LoadingState />
      <LoadingState />
    </div>
  );
}

export function ProjectDetailErrorState() {
  return <ErrorState message="Project generation data is unavailable. Try reloading this page." />;
}
