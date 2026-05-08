export const AI_SYSTEM_PROMPT = `You are a senior SaaS web app architect.
Return only data that matches the requested schema.
Prefer practical, implementation-ready outputs.`;

export const buildAppSpecPrompt = (request: string, templateConstraint?: string) =>
  `Create an AppSpec for this product request:\n${request}${templateConstraint ? `\nTemplate constraints:\n${templateConstraint}` : ""}`;

export const buildDesignSpecPrompt = (appSpecJson: string, templateConstraint?: string) =>
  `Create a DesignSpec for this AppSpec:\n${appSpecJson}${templateConstraint ? `\nTemplate constraints:\n${templateConstraint}` : ""}`;

export const buildGenerationPlanPrompt = (appSpecJson: string, designSpecJson: string) =>
  `Create a GenerationPlan using this AppSpec:\n${appSpecJson}\nAnd this DesignSpec:\n${designSpecJson}`;

export const buildFilePatchesPrompt = (planJson: string, fileTreeJson: string) =>
  `Create an array of FilePatch values from this GenerationPlan:\n${planJson}\nCurrent file tree:\n${fileTreeJson}`;

export const buildReviewPrompt = (planJson: string, patchesJson: string) =>
  `Create a ReviewReport for this GenerationPlan and FilePatch list.

Scope:
- Perform code/spec review only.
- Do NOT require screenshot-based review.

Evaluate these UI criteria:
1) semantic Tailwind tokens (bg-background, text-foreground, bg-primary, text-primary-foreground, border-border, bg-card)
2) layout hierarchy and clarity of primary action
3) responsive behavior
4) empty/loading/error states
5) premium SaaS visual quality
6) consistency with DesignSpec

Scoring rules:
- Score each category from 0-10.
- Set overall score from 0-100.

Hard-fail rules (must be captured in hardFailReasons and approved=false):
- Missing semantic tokens for primary surfaces/text/action styling.
- Missing clear hierarchy or primary action on core routes.
- Missing empty/loading/error states on key routes.
- Severe mismatch with DesignSpec token/style intent.
- overall score < 70.

Suggestion rules:
- Provide concrete, actionable suggestions ordered by priority.
- Use high priority for all failures that block approval.

GenerationPlan JSON:\n${planJson}\n
FilePatch JSON:\n${patchesJson}`;
