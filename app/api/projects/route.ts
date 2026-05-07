import { z } from 'zod';

import { getDb } from '@/lib/db';
import { createProject, listProjectsForOwner } from '@/lib/db/repositories/projects-repository';

import { UuidSchema, jsonCreated, jsonError, jsonOk, parseJson } from '../_lib/http';

const CreateProjectSchema = z.object({
  ownerId: UuidSchema,
  name: z.string().trim().min(1).max(160),
  slug: z.string().trim().min(1).max(180).regex(/^[a-z0-9-]+$/),
  description: z.string().trim().max(5000).optional(),
});

const ListProjectsQuerySchema = z.object({
  ownerId: UuidSchema,
});

export async function POST(request: Request) {
  const parsed = await parseJson(request, CreateProjectSchema);
  if (!parsed.success) return jsonError('bad_request', parsed.error.issues[0]?.message ?? 'Invalid request body.', 400);

  const project = await createProject(getDb(), parsed.data);
  return jsonCreated(project);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = ListProjectsQuerySchema.safeParse({ ownerId: url.searchParams.get('ownerId') });
  if (!parsed.success) return jsonError('bad_request', parsed.error.issues[0]?.message ?? 'Invalid query params.', 400);

  const projects = await listProjectsForOwner(getDb(), parsed.data.ownerId);
  return jsonOk(projects);
}
