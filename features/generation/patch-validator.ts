import { validateFilePatch, type FilePatch } from "@/schemas";

export class PatchValidationError extends Error {
  constructor(message: string, readonly patch: unknown) {
    super(message);
    this.name = "PatchValidationError";
  }
}

export function validatePatch(patch: unknown): FilePatch {
  const parsed = validateFilePatch(patch);
  if (!parsed.success) {
    throw new PatchValidationError(parsed.error.issues.map((issue: { message: string }) => issue.message).join("; "), patch);
  }

  return parsed.data;
}

export function validatePatchBatch(patches: unknown[]): FilePatch[] {
  return patches.map(validatePatch);
}
