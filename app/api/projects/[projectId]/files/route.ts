import { getDb } from '@/lib/db';
import { listGeneratedFilesForProject } from '@/lib/db/repositories/generation-repository';

import { UuidSchema, jsonError, jsonOk } from '../../../_lib/http';

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const parsed = UuidSchema.safeParse(projectId);
  if (!parsed.success) return jsonError('bad_request', 'Invalid projectId.', 400);

  const files = await listGeneratedFilesForProject(getDb(), parsed.data);
  return jsonOk(files);
}
