import { createHash } from "node:crypto";

import type { AppSpec, DesignSpec, FilePatch, GenerationPlan } from "@/schemas";
import { generateAppSpec } from "@/lib/ai/generate-app-spec";
import { generateDesignSpec } from "@/lib/ai/generate-design-spec";
import { generateFilePatches } from "@/lib/ai/generate-file-patches";
import { generateGenerationPlan } from "@/lib/ai/generate-generation-plan";
import { addGeneratedFile, createGenerationJob, updateGenerationJobStatus } from "@/lib/db/repositories/generation-repository";
import { createProjectVersion } from "@/lib/db/repositories/projects-repository";
import type { Database } from "@/lib/db/client";

import type { GenerationEventEmitter } from "@/features/generation/generation-events";
import type { JobRunner } from "@/features/generation/job-runner";
import { validatePatchBatch } from "@/features/generation/patch-validator";
import { VirtualFileSystem, type VirtualFileSystemSnapshot } from "@/features/generation/virtual-file-system";

export interface OrchestratorAi {
  generateAppSpec: (brief: string) => Promise<AppSpec>;
  generateDesignSpec: (appSpec: AppSpec) => Promise<DesignSpec>;
  generateGenerationPlan: (appSpec: AppSpec, designSpec: DesignSpec) => Promise<GenerationPlan>;
  generateFilePatches: (plan: GenerationPlan, tree: { root: { path: string; type: "file" | "directory"; children: [] } }) => Promise<FilePatch[]>;
}

export interface GenerationOrchestratorInput {
  projectId: string;
  userBrief: string;
  baseFiles?: VirtualFileSystemSnapshot;
  currentVersionNumber?: number;
}

export interface GenerationOrchestratorSummary {
  generationJobId: string;
  projectVersionId: string;
  patchCount: number;
  fileCount: number;
}

export function createGenerationOrchestrator(deps: {
  db: Database;
  events: GenerationEventEmitter;
  runner: JobRunner;
  ai?: OrchestratorAi;
}) {
  const ai = deps.ai ?? {
    generateAppSpec,
    generateDesignSpec,
    generateGenerationPlan,
    generateFilePatches,
  };

  return {
    async run(input: GenerationOrchestratorInput): Promise<GenerationOrchestratorSummary> {
      const job = await createGenerationJob(deps.db, {
        projectId: input.projectId,
        type: "files",
        input: { userBrief: input.userBrief },
      });

      const emit = (eventType: string, message: string, payload?: Record<string, unknown>) =>
        deps.events.emit({ level: "info", eventType, message, payload });

      await updateGenerationJobStatus(deps.db, { jobId: job.id, status: "running" });
      await emit("generation.started", "Generation run started.");

      const vfs = new VirtualFileSystem(input.baseFiles);
      try {
        const appSpec = await deps.runner.run("generate-app-spec", async () => ai.generateAppSpec(input.userBrief));
        await emit("generation.app_spec_generated", "Generated AppSpec.");

        const designSpec = await deps.runner.run("generate-design-spec", async () => ai.generateDesignSpec(appSpec));
        await emit("generation.design_spec_generated", "Generated DesignSpec.");

        const plan = await deps.runner.run("generate-generation-plan", async () => ai.generateGenerationPlan(appSpec, designSpec));
        await emit("generation.plan_generated", "Generated GenerationPlan.");

        const patches = await deps.runner.run("generate-file-patches", async () =>
          ai.generateFilePatches(plan, { root: { path: "root", type: "directory", children: [] } }),
        );
        await emit("generation.patch_batch_generated", "Generated file patch batch.", { patchCount: patches.length });

        const validPatches = validatePatchBatch(patches);
        await emit("generation.patch_batch_validated", "Validated patch batch.");

        vfs.applyPatches(validPatches);
        await emit("generation.patches_applied", "Applied patches to virtual file system.");

        const version = await createProjectVersion(deps.db, {
          projectId: input.projectId,
          versionNumber: (input.currentVersionNumber ?? 0) + 1,
          spec: { appSpec, designSpec, plan },
          changelog: `Generated ${validPatches.length} file patches.`,
        });

        await Promise.all(
          vfs.listFiles().map((file) =>
            addGeneratedFile(deps.db, {
              generationJobId: job.id,
              projectVersionId: version.id,
              path: file.path,
              content: file.content,
              contentSha256: createHash("sha256").update(file.content).digest("hex"),
              sizeBytes: Buffer.byteLength(file.content, "utf8"),
            }),
          ),
        );

        await updateGenerationJobStatus(deps.db, {
          jobId: job.id,
          status: "succeeded",
          output: { patchCount: validPatches.length, fileCount: vfs.listFiles().length },
        });

        await emit("generation.completed", "Generation run completed successfully.");

        return {
          generationJobId: job.id,
          projectVersionId: version.id,
          patchCount: validPatches.length,
          fileCount: vfs.listFiles().length,
        };
      } catch (error) {
        await updateGenerationJobStatus(deps.db, {
          jobId: job.id,
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown generation error",
        });
        await deps.events.emit({
          level: "error",
          eventType: "generation.failed",
          message: "Generation run failed.",
          payload: { error: error instanceof Error ? error.message : "unknown" },
        });
        throw error;
      }
    },
  };
}
