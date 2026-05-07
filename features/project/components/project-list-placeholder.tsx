import { Card } from "@/components/ui/card";

export function ProjectListPlaceholder() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium">No projects yet</h2>
      <p className="text-sm text-foreground/80">Create your first project to start generating an app.</p>
    </Card>
  );
}
