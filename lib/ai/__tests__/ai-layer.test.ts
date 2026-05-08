import { beforeEach, describe, expect, it, vi } from "vitest";
import generationPlanFixture from "@/schemas/fixtures/generation-plan.json";
import { generateAppSpec } from "@/lib/ai/generate-app-spec";
import { generateDesignSpec } from "@/lib/ai/generate-design-spec";
import { generateGenerationPlan } from "@/lib/ai/generate-generation-plan";
import { generateFilePatches } from "@/lib/ai/generate-file-patches";
import { fixBuildErrors } from "@/lib/ai/fix-build-errors";
import { reviewGeneration } from "@/lib/ai/review-generation";

const parseMock = vi.fn();

vi.mock("openai", () => ({
  default: class MockOpenAI {
    beta = { chat: { completions: { parse: parseMock } } };
  },
}));

describe("AI layer", () => {
  beforeEach(() => {
    process.env.OPENAI_API_KEY = "test-key";
    parseMock.mockReset();
  });

  it("generates app spec with structured output", async () => {
    parseMock.mockResolvedValueOnce({
      choices: [{ message: { parsed: {
        name: "Acme",
        description: "Desc",
        goals: ["Goal"],
        targetUsers: ["Users"],
        features: ["Feature"],
      } } }],
    });

    const result = await generateAppSpec("Build me an app");
    expect(result.name).toBe("Acme");
  });

  it("throws deterministic error for invalid model output", async () => {
    parseMock.mockResolvedValueOnce({ choices: [{ message: { parsed: { invalid: true } } }] });
    await expect(generateDesignSpec(generationPlanFixture.appSpec)).rejects.toMatchObject({
      code: "DESIGN_SPEC_INVALID",
    });
  });

  it("generates plan, patches and review report", async () => {
    parseMock
      .mockResolvedValueOnce({ choices: [{ message: { parsed: generationPlanFixture.appSpec } }] })
      .mockResolvedValueOnce({ choices: [{ message: { parsed: generationPlanFixture.designSpec } }] })
      .mockResolvedValueOnce({ choices: [{ message: { parsed: generationPlanFixture } }] })
      .mockResolvedValueOnce({
        choices: [{ message: { parsed: [{ operation: "create", path: "app/page.tsx", content: "export default function Page(){}", reason: "new page" }] } }],
      })
      .mockResolvedValueOnce({ choices: [{ message: { parsed: { summary: "Looks good", approved: true, issues: [], uiQualityScore: { semanticTokens: 9, layoutHierarchy: 9, responsiveBehavior: 8, uxStates: 8, saasVisualQuality: 9, designSpecConsistency: 9, overall: 88 }, suggestions: [], hardFailReasons: [] } } }] });

    const plan = await generateGenerationPlan("Build CRM app");
    const patches = await generateFilePatches(plan, { root: { path: "root", type: "directory", children: [] } });
    const review = await reviewGeneration(plan, patches);

    expect(plan.executionOrder.length).toBeGreaterThan(0);
    expect(patches[0]?.path).toBe("app/page.tsx");
    expect(review.approved).toBe(true);
  });

  it("generates build fix plan from build logs", async () => {
    parseMock.mockResolvedValueOnce({
      choices: [{ message: { parsed: {
        buildLog: { rawLog: "Type 'number' is not assignable to type 'string'", source: "tsc" },
        rootCause: "Mismatched type in generated prop",
        steps: [{
          title: "Align prop types",
          description: "Update component prop typing to string",
          filePatches: [{ operation: "update", path: "app/page.tsx", content: "export default function Page(){return null}", reason: "Fix type" }],
        }],
        validationChecks: ["pnpm typecheck"],
      } } }],
    });

    const result = await fixBuildErrors(
      { rawLog: "Type 'number' is not assignable to type 'string'", source: "tsc" },
      { root: { path: "root", type: "directory", children: [] } },
    );

    expect(result.rootCause).toContain("type");
    expect(result.steps.length).toBeGreaterThan(0);
  });
});
