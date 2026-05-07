import { describe, expect, it, vi } from "vitest";

import generationPlanFixture from "@/schemas/fixtures/generation-plan.json";
import { createGenerationOrchestrator } from "@/features/generation/orchestrator";
import { createInMemoryGenerationEventEmitter, type GenerationEvent } from "@/features/generation/generation-events";
import { InlineJobRunner } from "@/features/generation/job-runner";

function createMockDb() {
  return {
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(async () => [{ id: crypto.randomUUID() }]) })) })),
    select: vi.fn(),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => ({ returning: vi.fn(async () => [{ id: "job", status: "running" }]) })) })) })),
  };
}

describe("generation orchestrator", () => {
  it("runs full generation flow and returns summary", async () => {
    const db = createMockDb();
    const events: GenerationEvent[] = [];

    const orchestrator = createGenerationOrchestrator({
      db: db as never,
      events: createInMemoryGenerationEventEmitter(events),
      runner: new InlineJobRunner(),
      ai: {
        generateAppSpec: vi.fn(async () => generationPlanFixture.appSpec),
        generateDesignSpec: vi.fn(async () => generationPlanFixture.designSpec),
        generateGenerationPlan: vi.fn(async () => generationPlanFixture),
        generateFilePatches: vi.fn(async () => [
          { operation: "create", path: "app/page.tsx", content: "export default function Page(){return null;}", reason: "Create page" },
          { operation: "create", path: "README.md", content: "# Generated", reason: "Create readme" },
        ]),
      },
    });

    const result = await orchestrator.run({
      projectId: "project-1",
      userBrief: "Build a CRM app",
      currentVersionNumber: 2,
    });

    expect(result.patchCount).toBe(2);
    expect(result.fileCount).toBe(2);
    expect(events.some((event) => event.eventType === "generation.completed")).toBe(true);
  });
});
