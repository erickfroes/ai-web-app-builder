import { describe, expect, it } from "vitest";
import {
  AppSpecSchema,
  BuildLogSchema,
  BuildFixPlanSchema,
  FilePatchSchema,
  GenerationPlanSchema,
  RelativeFilePathSchema,
} from "../index";
import generationPlanFixture from "../fixtures/generation-plan.json";
import buildFixPlanFixture from "../fixtures/build-fix-plan.json";

describe("schema contracts", () => {
  it("validates generation plan fixture", () => {
    const result = GenerationPlanSchema.safeParse(generationPlanFixture);
    expect(result.success).toBe(true);
  });

  it("validates build fix plan fixture", () => {
    const result = BuildFixPlanSchema.safeParse(buildFixPlanFixture);
    expect(result.success).toBe(true);
  });

  it("validates build log schema", () => {
    const result = BuildLogSchema.safeParse({
      rawLog: "error TS2322: Type 'number' is not assignable to type 'string'",
      source: "tsc",
    });
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys due to strict mode", () => {
    const result = AppSpecSchema.safeParse({
      name: "a",
      description: "b",
      goals: ["g"],
      targetUsers: ["u"],
      features: ["f"],
      extra: true,
    });
    expect(result.success).toBe(false);
  });

  it("allows only create/update/delete file patch operations", () => {
    const result = FilePatchSchema.safeParse({
      operation: "move",
      path: "src/file.ts",
      reason: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects path traversal", () => {
    const result = RelativeFilePathSchema.safeParse("../secrets.txt");
    expect(result.success).toBe(false);
  });
});
