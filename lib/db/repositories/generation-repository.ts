import { asc, eq } from 'drizzle-orm';

import type { Database } from '@/lib/db/client';
import { generatedFiles, generationEvents, generationJobs } from '@/lib/db/schema';

export async function createGenerationJob(
  db: Database,
  input: {
    projectId: string;
    projectVersionId?: string;
    queuedByUserId?: string;
    type: 'spec' | 'files' | 'repair';
    model?: string;
    input: Record<string, unknown>;
  },
) {
  const [created] = await db.insert(generationJobs).values(input).returning();
  return created;
}

export async function updateGenerationJobStatus(
  db: Database,
  input: {
    jobId: string;
    status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
    errorMessage?: string | null;
    output?: Record<string, unknown>;
  },
) {
  const [updated] = await db
    .update(generationJobs)
    .set({
      status: input.status,
      errorMessage: input.errorMessage ?? null,
      output: input.output,
      updatedAt: new Date(),
      startedAt: input.status === 'running' ? new Date() : undefined,
      completedAt: ['succeeded', 'failed', 'cancelled'].includes(input.status) ? new Date() : undefined,
    })
    .where(eq(generationJobs.id, input.jobId))
    .returning();

  return updated ?? null;
}

export async function addGeneratedFile(
  db: Database,
  input: {
    generationJobId: string;
    projectVersionId?: string;
    path: string;
    content: string;
    contentSha256: string;
    sizeBytes: number;
  },
) {
  const [created] = await db.insert(generatedFiles).values(input).returning();
  return created;
}

export async function addGenerationEvent(
  db: Database,
  input: {
    generationJobId: string;
    level?: 'debug' | 'info' | 'warn' | 'error';
    eventType: string;
    message: string;
    payload?: Record<string, unknown>;
  },
) {
  const [created] = await db.insert(generationEvents).values(input).returning();
  return created;
}

export async function listGenerationEvents(db: Database, generationJobId: string) {
  return db
    .select()
    .from(generationEvents)
    .where(eq(generationEvents.generationJobId, generationJobId))
    .orderBy(asc(generationEvents.createdAt));
}
