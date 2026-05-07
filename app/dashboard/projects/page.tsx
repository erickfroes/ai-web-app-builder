import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/features/design-system/components/dashboard-shell";
import { ProjectList, ProjectListEmpty, ProjectListError, ProjectListLoading } from "@/features/project/components/project-list";

export default function ProjectListPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage app generation workspaces, monitor status and open project details."
        action={
          <Link href="/dashboard/projects/new">
            <Button>Create project</Button>
          </Link>
        }
      />

      <ProjectList />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">State library</h2>
        <ProjectListLoading />
        <ProjectListEmpty />
        <ProjectListError />
      </section>
    </section>
  );
}
