import { describe, expect, it } from "vitest";

import { localDisabledPreviewProvider, sandboxAdapterPreviewProvider } from "@/features/generation/preview-providers";

describe("preview providers", () => {
  it("keeps local provider disabled", async () => {
    const result = await localDisabledPreviewProvider.createSession({ projectId: "p-1" });

    expect(result.status).toBe("disabled");
    expect(result.message).toContain("live preview is disabled");
  });

  it("marks sandbox adapter as unavailable placeholder", async () => {
    const result = await sandboxAdapterPreviewProvider.createSession({ projectId: "p-1", versionId: "v-1" });

    expect(result.status).toBe("unavailable");
    expect(result.message).toContain("adapter not connected yet");
  });
});
