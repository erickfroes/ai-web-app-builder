import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState, StatusBadge } from "@/features/design-system/components/dashboard-shell";

type Project = {
  id: string;
  name: string;
  summary: string;
  updatedAt: string;
  status: "ready" | "running" | "error";
};

const projects: Project[] = [
  {
    id: "project_001",
    name: "Acme Growth Site",
    summary: "Marketing website + lead capture flow",
    updatedAt: "Updated 2 hours ago",
    status: "running"
  },
  {
    id: "project_002",
    name: "Northwind Client Portal",
    summary: "Authenticated dashboard for customer analytics",
    updatedAt: "Updated yesterday",
    status: "ready"
  }
];

export function ProjectList() {
  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-base font-semibold">{project.name}</p>
            <p className="text-sm text-muted-foreground">{project.summary}</p>
            <p className="text-xs text-muted-foreground">{project.updatedAt}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            <Link href={`/dashboard/projects/${project.id}`}>
              <Button variant="outline" size="sm">Open</Button>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function ProjectListLoading() {
  return (
    <div className="space-y-3">
      <LoadingState />
      <LoadingState />
    </div>
  );
}

export function ProjectListEmpty() {
  return (
    <EmptyState
      title="No projects found"
      description="Create your first project and generate an implementation-ready app structure."
      action={
        <Link href="/dashboard/projects/new">
          <Button>Create project</Button>
        </Link>
      }
    />
  );
}

export function ProjectListError() {
  return <ErrorState message="We couldn't load projects. Please refresh and try again." />;
}
