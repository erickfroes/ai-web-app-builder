import { z } from 'zod';

import { getDb } from '@/lib/db';
import { listGeneratedFilesContentForProject } from '@/lib/db/repositories/generation-repository';
import { createProjectZip } from '@/lib/export/create-zip';

import { UuidSchema, jsonError } from '../../../_lib/http';

const ExportQuerySchema = z.object({ versionId: z.string().uuid().optional() });

export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await context.params;
  const projectIdParsed = UuidSchema.safeParse(projectId);
  if (!projectIdParsed.success) return jsonError('bad_request', 'Invalid projectId.', 400);

  const query = ExportQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!query.success) return jsonError('bad_request', 'Invalid export query parameters.', 400);

  const files = await listGeneratedFilesContentForProject(getDb(), projectIdParsed.data);
  const filteredFiles = query.data.versionId
    ? files.filter((file) => file.path.startsWith(`versions/${query.data.versionId}/`))
    : files;

  const archive = await createProjectZip({
    projectName: `project-${projectIdParsed.data}`,
    files: filteredFiles.map((file) => ({ path: file.path, content: file.content })),
  });

  return new Response(archive as unknown as BodyInit, {
    status: 200,
    headers: {
      'content-type': 'application/zip',
      'content-disposition': `attachment; filename="project-${projectIdParsed.data}.zip"`,
      'cache-control': 'no-store',
    },
  });
}
