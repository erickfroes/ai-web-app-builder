import { PageHeader } from "@/features/design-system/components/dashboard-shell";
import { GuidedAppBriefForm } from "@/features/project/components/guided-app-brief-form";

export default function ProjectCreatePage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="New project"
        description="Use the guided brief to define goals, users and constraints before generation starts."
      />
      <GuidedAppBriefForm />
    </section>
  );
}
