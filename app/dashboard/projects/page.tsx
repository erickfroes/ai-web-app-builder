import { Card } from "@/components/ui/card";

export default function ProjectListPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <Card className="p-6">
        <h2 className="text-lg font-medium">No projects yet</h2>
        <p className="text-sm text-foreground/80">Create your first project to start generating an app.</p>
      </Card>
    </section>
  );
}
