export type GenerationEventLevel = "debug" | "info" | "warn" | "error";

export interface GenerationEvent {
  level: GenerationEventLevel;
  eventType: string;
  message: string;
  payload?: Record<string, unknown>;
  createdAt: string;
}

export interface GenerationEventEmitter {
  emit: (event: Omit<GenerationEvent, "createdAt">) => Promise<void> | void;
}

export function createInMemoryGenerationEventEmitter(events: GenerationEvent[] = []): GenerationEventEmitter {
  return {
    emit(event) {
      events.push({ ...event, createdAt: new Date().toISOString() });
    },
  };
}
