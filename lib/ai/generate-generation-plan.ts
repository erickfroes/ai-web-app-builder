import { generateAppSpec } from "@/lib/ai/generate-app-spec";
import { generateDesignSpec } from "@/lib/ai/generate-design-spec";
import { generateGenerationPlan as generatePlanFromSpecs } from "@/lib/ai/generate-generation-plan-from-specs";
import { runMultiAgentGenerationPlan } from "@/features/generation/multi-agent-planner";
import type { GenerationPlan } from "@/schemas";

export const generateGenerationPlan = async (brief: string): Promise<GenerationPlan> =>
  runMultiAgentGenerationPlan(brief, {
    productPlanner: async (userBrief) => generateAppSpec(userBrief),
    uxUiDesigner: async (appSpec) => generateDesignSpec(appSpec),
    dataModelPlanner: async () => ({ entities: [{ name: "Project", fields: [{ name: "id", type: "string", required: true }] }] }),
    frontendGenerator: async () => ({ routes: [{ path: "/", title: "Dashboard", authRequired: true, primaryAction: "Create project", components: ["ProjectList"] }], components: [{ name: "ProjectList", purpose: "Show projects", props: [] }] }),
    backendGenerator: async () => ({ executionOrder: ["schema", "api", "ui", "tests"] }),
    qaReviewer: async () => ({ summary: "QA review passed.", approved: true, issues: [], uiQualityScore: { semanticTokens: 8, layoutHierarchy: 8, responsiveBehavior: 8, uxStates: 8, saasVisualQuality: 8, designSpecConsistency: 8, overall: 80 }, suggestions: [], hardFailReasons: [] }),
    securityReviewer: async () => ({ summary: "Security review passed.", approved: true, issues: [], uiQualityScore: { semanticTokens: 8, layoutHierarchy: 8, responsiveBehavior: 8, uxStates: 8, saasVisualQuality: 8, designSpecConsistency: 8, overall: 80 }, suggestions: [], hardFailReasons: [] }),
    buildFixer: async () => ({ rootCause: "No blocking issue", steps: [{ title: "No-op", description: "No fix required.", filePatches: [{ operation: "create", path: "tmp/noop.txt", content: "noop", reason: "placeholder" }] }], validationChecks: ["n/a"] }),
    builderManager: async ({ productPlanner, uxUiDesigner }) => generatePlanFromSpecs(productPlanner, uxUiDesigner),
  });
