"use client";

import { useMemo, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { PreviewProvider, PreviewSessionDescriptor } from "@/features/generation/preview-provider";
import { localDisabledPreviewProvider, sandboxAdapterPreviewProvider } from "@/features/generation/preview-providers";

interface PreviewTabProps {
  projectId: string;
}

export function PreviewTab({ projectId }: PreviewTabProps) {
  const providers = useMemo(() => [localDisabledPreviewProvider, sandboxAdapterPreviewProvider], []);
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0].id);
  const [session, setSession] = useState<PreviewSessionDescriptor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProvider = providers.find((provider) => provider.id === selectedProviderId) ?? providers[0];

  async function handleStart(provider: PreviewProvider) {
    setIsLoading(true);
    try {
      const result = await provider.createSession({ projectId });
      setSession(result);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => setSelectedProviderId(provider.id)}
            className={buttonVariants({ variant: provider.id === selectedProvider.id ? "default" : "outline", size: "sm" })}
          >
            {provider.name}
          </button>
        ))}
      </div>

      <Card className="space-y-3 p-4 text-sm">
        <p className="font-medium">Selected provider: {selectedProvider.name}</p>
        <p className="text-muted-foreground">
          Interactive preview support: {selectedProvider.supportsInteractivePreview ? "Planned via isolated adapter" : "Disabled"}
        </p>
        <div className="rounded-md border border-border bg-card p-3 text-xs text-muted-foreground">
          Generated code must run in an isolated runtime (for example Sandpack/WebContainer) and never in the main application process.
        </div>
        <button type="button" onClick={() => handleStart(selectedProvider)} className={buttonVariants({ size: "sm" })} disabled={isLoading}>
          {isLoading ? "Preparing preview status..." : "Check preview status"}
        </button>

        {session ? (
          <div className="rounded-md border border-border bg-background p-3 text-xs">
            <p className="font-medium">Status: {session.status}</p>
            <p className="text-muted-foreground">{session.message}</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
