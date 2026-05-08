import { createHash } from "node:crypto";

import type { FilePatch, GenerationPlan } from "@/schemas";
import { generateFilePatches } from "@/lib/ai/generate-file-patches";
import { generateGenerationPlan } from "@/lib/ai/generate-generation-plan";
import { addGeneratedFile, addGenerationEvent, createGenerationJob, updateGenerationJobStatus } from "@/lib/db/repositories/generation-repository";
import { createProjectVersion } from "@/lib/db/repositories/projects-repository";
import type { Database } from "@/lib/db/client";

import type { GenerationEventEmitter, PendingGenerationEvent } from "@/features/generation/generation-events";
import type { JobRunner } from "@/features/generation/job-runner";
import { validatePatchBatch } from "@/features/generation/patch-validator";
import { VirtualFileSystem, type VirtualFileSystemSnapshot } from "@/features/generation/virtual-file-system";

const EMPTY_TREE = { root: { path: "root", type: "directory" as const, children: [] as [] } };

export interface OrchestratorAi {
  generateGenerationPlan: (brief: string) => Promise<GenerationPlan>;
  generateFilePatches: (plan: GenerationPlan, tree: typeof EMPTY_TREE) => Promise<FilePatch[]>;
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

      const emit = async (event: PendingGenerationEvent) => {
        await deps.events.emit(event);
        await addGenerationEvent(deps.db, {
          generationJobId: job.id,
          eventType: event.eventType,
          message: event.message,
          level: event.level,
          payload: event.payload,
        });
      };

      await updateGenerationJobStatus(deps.db, { jobId: job.id, status: "running" });
      await emit({ level: "info", eventType: "generation.started", message: "Generation run started." });

      const vfs = new VirtualFileSystem(input.baseFiles);
      try {
        const plan = await deps.runner.run("generate-generation-plan", async () => ai.generateGenerationPlan(input.userBrief));
        await emit({ level: "info", eventType: "generation.plan_generated", message: "Generated GenerationPlan." });

        const patches = await deps.runner.run("generate-file-patches", async () => ai.generateFilePatches(plan, EMPTY_TREE));
        await emit({
          level: "info",
          eventType: "generation.patch_batch_generated",
          message: "Generated file patch batch.",
          payload: { patchCount: patches.length },
        });

        const validPatches = validatePatchBatch(patches);
        await emit({ level: "info", eventType: "generation.patch_batch_validated", message: "Validated patch batch." });

        vfs.applyPatches(validPatches);
        await emit({ level: "info", eventType: "generation.patches_applied", message: "Applied patches to virtual file system." });

        const version = await createProjectVersion(deps.db, {
          projectId: input.projectId,
          versionNumber: (input.currentVersionNumber ?? 0) + 1,
          spec: { appSpec: plan.appSpec, designSpec: plan.designSpec, plan },
          changelog: `Generated ${validPatches.length} file patches.`,
        });

        const files = vfs.listFiles();
        await Promise.all(
          files.map((file) =>
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
          output: { patchCount: validPatches.length, fileCount: files.length },
        });

        await emit({ level: "info", eventType: "generation.completed", message: "Generation run completed successfully." });

        return { generationJobId: job.id, projectVersionId: version.id, patchCount: validPatches.length, fileCount: files.length };
      } catch (error) {
        await updateGenerationJobStatus(deps.db, {
          jobId: job.id,
          status: "failed",
          errorMessage: error instanceof Error ? error.message : "Unknown generation error",
        });
        await emit({
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
