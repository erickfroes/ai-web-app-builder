import type { PreviewProvider, PreviewSessionRequest } from "@/features/generation/preview-provider";

const buildContextMessage = (request: PreviewSessionRequest) =>
  request.versionId
    ? `Project ${request.projectId} · version ${request.versionId}`
    : `Project ${request.projectId}`;

export const localDisabledPreviewProvider: PreviewProvider = {
  id: "local-disabled",
  name: "Local preview disabled",
  supportsInteractivePreview: false,
  async createSession(request) {
    return {
      status: "disabled",
      message: `${buildContextMessage(request)}: live preview is disabled in the control plane runtime.`,
    };
  },
};

export const sandboxAdapterPreviewProvider: PreviewProvider = {
  id: "sandbox-adapter-placeholder",
  name: "Sandpack/WebContainer adapter (placeholder)",
  supportsInteractivePreview: true,
  async createSession(request) {
    return {
      status: "unavailable",
      message: `${buildContextMessage(request)}: adapter not connected yet. Run generated code in an isolated sandbox runtime only.`,
    };
  },
};
