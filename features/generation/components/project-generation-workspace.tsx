import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { DataCard, ErrorState, LoadingState, StatusBadge } from "@/features/design-system/components/dashboard-shell";
import { PreviewTab } from "@/features/generation/components/preview-tab";

export function ProjectGenerationWorkspace({ projectId }: { projectId: string }) {
  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <div className="space-y-6 xl:col-span-5">
        <GenerationStatusPanel projectId={projectId} />
        <VersionHistoryPanel />
      </div>
      <div className="space-y-6 xl:col-span-7">
        <BuildErrorFixPanel />
        <GeneratedFileExplorer />
        <PreviewPanel projectId={projectId} />
      </div>
    </div>
  );
}

function BuildErrorFixPanel() {
  return (
    <DataCard
      title="Fix build errors"
      description="Paste compile/build logs to generate a safe patch proposal flow without executing generated code."
    >
      <div className="space-y-4">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Build log input</span>
          <textarea
            className="min-h-36 w-full rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground"
            placeholder="Paste TypeScript / Next.js / ESLint build output here..."
            defaultValue={"Type error in app/dashboard/page.tsx: Property 'items' does not exist on type 'Project'."}
          />
        </label>

        <div className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
          Patch proposal flow: parse log → propose file patches → validate path + schema → user applies patches to selected generated version.
        </div>

        <div className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
          <div>
            <p className="font-medium">Proposed patch set #1</p>
            <p className="text-xs text-muted-foreground">2 file updates · validation pending</p>
          </div>
          <button className={buttonVariants({ size: "sm" })}>Generate patch proposal</button>
        </div>
      </div>
    </DataCard>
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

function PreviewPanel({ projectId }: { projectId: string }) {
  return (
    <DataCard title="UI preview" description="Preview adapters are provider-agnostic and isolated from the control plane runtime.">
      <PreviewTab projectId={projectId} />
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
