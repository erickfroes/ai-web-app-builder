export type PreviewProviderStatus = "disabled" | "ready" | "unavailable";

export interface PreviewSessionRequest {
  projectId: string;
  versionId?: string;
}

export interface PreviewSessionDescriptor {
  status: PreviewProviderStatus;
  message: string;
  url?: string;
}

export interface PreviewProvider {
  readonly id: string;
  readonly name: string;
  readonly supportsInteractivePreview: boolean;
  createSession: (request: PreviewSessionRequest) => Promise<PreviewSessionDescriptor>;
}
