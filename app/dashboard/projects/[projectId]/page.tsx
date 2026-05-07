import { PageHeader } from "@/features/design-system/components/dashboard-shell";
import {
  ProjectDetailErrorState,
  ProjectDetailLoadingState,
  ProjectGenerationWorkspace
} from "@/features/generation/components/project-generation-workspace";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;

  return (
    <section className="space-y-6">
      <PageHeader
        title={`Project ${projectId}`}
        description="Inspect generation progress, file outputs, and version history for this project."
      />
      <ProjectGenerationWorkspace />

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground">State library</h2>
        <ProjectDetailLoadingState />
        <ProjectDetailErrorState />
      </section>
    </section>
  );
}
