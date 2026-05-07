import { getDb } from '@/lib/db';
import { listProjectVersions } from '@/lib/db/repositories/projects-repository';

import { UuidSchema, jsonError, jsonOk } from '../../../_lib/http';

export async function GET(_request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const parsed = UuidSchema.safeParse(projectId);
  if (!parsed.success) return jsonError('bad_request', 'Invalid projectId.', 400);

  const versions = await listProjectVersions(getDb(), parsed.data);
  return jsonOk(versions);
}
