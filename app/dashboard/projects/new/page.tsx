import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProjectCreatePage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Create project</h1>
      <Card className="space-y-4 p-6">
        <p className="text-sm text-foreground/80">
          Placeholder form. Project creation logic and persistence will be implemented in a future phase.
        </p>
        <Button disabled>Create Project</Button>
      </Card>
    </section>
  );
}
