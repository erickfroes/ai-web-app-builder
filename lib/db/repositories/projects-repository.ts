import { and, desc, eq } from 'drizzle-orm';

import type { Database } from '@/lib/db/client';
import { projectVersions, projects } from '@/lib/db/schema';

export interface CreateProjectInput {
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
}

export async function createProject(db: Database, input: CreateProjectInput) {
  const [created] = await db.insert(projects).values(input).returning();
  return created;
}

export async function getProjectById(db: Database, projectId: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId)).limit(1);
  return project ?? null;
}

export async function listProjectsForOwner(db: Database, ownerId: string) {
  return db.select().from(projects).where(eq(projects.ownerId, ownerId)).orderBy(desc(projects.updatedAt));
}

export async function createProjectVersion(
  db: Database,
  input: {
    projectId: string;
    versionNumber: number;
    spec: Record<string, unknown>;
    changelog?: string;
    createdByUserId?: string;
  },
) {
  const [created] = await db.insert(projectVersions).values(input).returning();
  return created;
}

export async function getProjectVersion(db: Database, projectId: string, versionNumber: number) {
  const [version] = await db
    .select()
    .from(projectVersions)
    .where(and(eq(projectVersions.projectId, projectId), eq(projectVersions.versionNumber, versionNumber)))
    .limit(1);

  return version ?? null;
}

export async function listProjectVersions(db: Database, projectId: string) {
  return db
    .select()
    .from(projectVersions)
    .where(eq(projectVersions.projectId, projectId))
    .orderBy(desc(projectVersions.versionNumber));
}
