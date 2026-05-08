import { describe, expect, it, vi } from "vitest";

import generationPlanFixture from "@/schemas/fixtures/generation-plan.json";
import { GenerationPlanSchema } from "@/schemas";
import { runMultiAgentGenerationPlan, type MultiAgentPlanner } from "@/features/generation/multi-agent-planner";

describe("multi-agent planner", () => {
  it("returns manager-owned generation plan when all specialist outputs validate", async () => {
    const typedPlan = GenerationPlanSchema.parse(generationPlanFixture);
    const agents: MultiAgentPlanner = {
      productPlanner: vi.fn(async () => typedPlan.appSpec),
      uxUiDesigner: vi.fn(async () => typedPlan.designSpec),
      dataModelPlanner: vi.fn(async () => typedPlan.dataModelSpec),
      frontendGenerator: vi.fn(async () => ({ routes: typedPlan.routes, components: typedPlan.components })),
      backendGenerator: vi.fn(async () => ({ executionOrder: typedPlan.executionOrder })),
      qaReviewer: vi.fn(async () => ({ summary: "ok", approved: true, issues: [], uiQualityScore: { semanticTokens: 8, layoutHierarchy: 8, responsiveBehavior: 8, uxStates: 8, saasVisualQuality: 8, designSpecConsistency: 8, overall: 80 }, suggestions: [], hardFailReasons: [] })),
      securityReviewer: vi.fn(async () => ({ summary: "ok", approved: true, issues: [], uiQualityScore: { semanticTokens: 8, layoutHierarchy: 8, responsiveBehavior: 8, uxStates: 8, saasVisualQuality: 8, designSpecConsistency: 8, overall: 80 }, suggestions: [], hardFailReasons: [] })),
      buildFixer: vi.fn(async () => generationPlanFixture),
      builderManager: vi.fn(async () => typedPlan),
    };

    const result = await runMultiAgentGenerationPlan("Build CRM", agents);
    expect(result).toEqual(typedPlan);
    expect(agents.builderManager).toHaveBeenCalledOnce();
  });

  it("fails if specialist reviewer rejects output", async () => {
    const typedPlan = GenerationPlanSchema.parse(generationPlanFixture);
    const agents: MultiAgentPlanner = {
      productPlanner: async () => typedPlan.appSpec,
      uxUiDesigner: async () => typedPlan.designSpec,
      dataModelPlanner: async () => typedPlan.dataModelSpec,
      frontendGenerator: async () => ({ routes: typedPlan.routes, components: typedPlan.components }),
      backendGenerator: async () => ({ executionOrder: typedPlan.executionOrder }),
      qaReviewer: async () => ({ summary: "bad", approved: false, issues: [{ severity: "error", message: "Broken", path: "app/page.tsx" }], uiQualityScore: { semanticTokens: 4, layoutHierarchy: 4, responsiveBehavior: 5, uxStates: 3, saasVisualQuality: 4, designSpecConsistency: 4, overall: 45 }, suggestions: [{ priority: "high", title: "Fix hierarchy", action: "Add clear page structure", path: "app/page.tsx" }], hardFailReasons: ["overall score < 70"] }),
      securityReviewer: async () => ({ summary: "ok", approved: true, issues: [], uiQualityScore: { semanticTokens: 8, layoutHierarchy: 8, responsiveBehavior: 8, uxStates: 8, saasVisualQuality: 8, designSpecConsistency: 8, overall: 80 }, suggestions: [], hardFailReasons: [] }),
      buildFixer: async () => ({ rootCause: "Broken", steps: [{ title: "Fix", description: "Patch", filePatches: [{ operation: "create", path: "tmp/fix.txt", content: "fix", reason: "fix" }] }], validationChecks: ["pnpm test"] }),
      builderManager: async () => typedPlan,
    };

    await expect(runMultiAgentGenerationPlan("Build CRM", agents)).rejects.toThrow("rejected");
  });
});
