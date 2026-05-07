import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TEMPLATE_LIST } from "@/features/project/templates";

type TemplateSelectionProps = {
  selectedTemplateId?: string;
};

export function TemplateSelection({ selectedTemplateId = "premium-saas-dashboard" }: TemplateSelectionProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {TEMPLATE_LIST.map((template) => {
        const selected = template.id === selectedTemplateId;
        return (
          <label key={template.id} className="block cursor-pointer">
            <input type="radio" name="templateId" value={template.id} defaultChecked={selected} className="sr-only" />
            <Card className={selected ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Category:</span> {template.category}</p>
                <p>{template.constraintSummary}</p>
              </CardContent>
            </Card>
          </label>
        );
      })}
    </div>
  );
}
