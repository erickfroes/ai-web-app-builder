import { z } from 'zod';

import { getDb } from '@/lib/db';
import { createGenerationJob } from '@/lib/db/repositories/generation-repository';

import { UuidSchema, jsonCreated, jsonError, parseJson } from '../../_lib/http';

const StartGenerationSchema = z.object({
  projectId: UuidSchema,
  projectVersionId: UuidSchema.optional(),
  queuedByUserId: UuidSchema.optional(),
  type: z.enum(['spec', 'files', 'repair']),
  model: z.string().trim().min(1).max(120).optional(),
  input: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const parsed = await parseJson(request, StartGenerationSchema);
  if (!parsed.success) return jsonError('bad_request', parsed.error.issues[0]?.message ?? 'Invalid request body.', 400);

  const job = await createGenerationJob(getDb(), parsed.data);
  return jsonCreated(job);
}
