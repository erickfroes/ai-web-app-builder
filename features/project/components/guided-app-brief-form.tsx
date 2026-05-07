import { Button } from "@/components/ui/button";
import { FormSection } from "@/features/design-system/components/dashboard-shell";

const fieldClass = "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function GuidedAppBriefForm() {
  return (
    <div className="space-y-5">
      <FormSection title="Project basics" description="Define who this app is for and what outcome it should drive.">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            Project name
            <input className={fieldClass} placeholder="Acme onboarding workspace" />
          </label>
          <label className="text-sm">
            Product type
            <select className={fieldClass} defaultValue="">
              <option value="" disabled>Select a type</option>
              <option>SaaS dashboard</option>
              <option>Marketing website</option>
              <option>Internal tool</option>
            </select>
          </label>
        </div>
      </FormSection>

      <FormSection title="Users and jobs" description="Capture target users and the primary tasks they must complete.">
        <label className="text-sm">
          Primary user persona
          <textarea className={fieldClass} rows={3} placeholder="Operations manager at a 20-person startup" />
        </label>
        <label className="text-sm">
          Core user jobs
          <textarea className={fieldClass} rows={3} placeholder="Invite teammates, monitor KPIs, export weekly reports" />
        </label>
      </FormSection>

      <FormSection title="Constraints and quality" description="Set technical, design and delivery constraints for generation.">
        <label className="text-sm">
          Brand and design direction
          <textarea className={fieldClass} rows={3} placeholder="Premium, clean, minimal charts, high readability" />
        </label>
        <label className="text-sm">
          Success criteria
          <textarea className={fieldClass} rows={3} placeholder="Shippable onboarding, responsive pages, clear empty/loading states" />
        </label>
      </FormSection>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline">Save draft</Button>
        <Button>Create project</Button>
      </div>
    </div>
  );
}
