import type { FilePatch } from "@/schemas";

export interface VirtualFileSystemSnapshot {
  files: Record<string, string>;
}

export class VirtualFileSystem {
  private readonly files = new Map<string, string>();

  constructor(seed?: VirtualFileSystemSnapshot) {
    Object.entries(seed?.files ?? {}).forEach(([path, content]) => {
      this.files.set(path, content);
    });
  }

  applyPatch(patch: FilePatch) {
    if (patch.operation === "delete") {
      this.files.delete(patch.path);
      return;
    }

    this.files.set(patch.path, patch.content ?? "");
  }

  applyPatches(patches: FilePatch[]) {
    patches.forEach((patch) => this.applyPatch(patch));
  }

  listFiles() {
    return Array.from(this.files.entries()).map(([path, content]) => ({ path, content }));
  }

  toSnapshot(): VirtualFileSystemSnapshot {
    return { files: Object.fromEntries(this.files.entries()) };
  }
}
