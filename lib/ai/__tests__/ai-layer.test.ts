import { beforeEach, describe, expect, it, vi } from "vitest";
import generationPlanFixture from "@/schemas/fixtures/generation-plan.json";
import { generateAppSpec } from "@/lib/ai/generate-app-spec";
import { generateDesignSpec } from "@/lib/ai/generate-design-spec";
import { generateGenerationPlan } from "@/lib/ai/generate-generation-plan";
import { generateFilePatches } from "@/lib/ai/generate-file-patches";
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
      .mockResolvedValueOnce({ choices: [{ message: { parsed: generationPlanFixture.designSpec } }] })
      .mockResolvedValueOnce({ choices: [{ message: { parsed: generationPlanFixture } }] })
      .mockResolvedValueOnce({
        choices: [{ message: { parsed: [{ operation: "create", path: "app/page.tsx", content: "export default function Page(){}", reason: "new page" }] } }],
      })
      .mockResolvedValueOnce({ choices: [{ message: { parsed: { summary: "Looks good", approved: true, issues: [] } } }] });

    const designSpec = await generateDesignSpec(generationPlanFixture.appSpec);
    const plan = await generateGenerationPlan(generationPlanFixture.appSpec, designSpec);
    const patches = await generateFilePatches(plan, { root: { path: "root", type: "directory", children: [] } });
    const review = await reviewGeneration(plan, patches);

    expect(plan.executionOrder.length).toBeGreaterThan(0);
    expect(patches[0]?.path).toBe("app/page.tsx");
    expect(review.approved).toBe(true);
  });
});
