import { describe, expect, it, vi } from 'vitest';

import {
  createGenerationJob,
  listGenerationEvents,
  updateGenerationJobStatus,
} from '@/lib/db/repositories/generation-repository';
import {
  createProject,
  getProjectById,
  listProjectsForOwner,
} from '@/lib/db/repositories/projects-repository';

function createMockDb() {
  return {
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn(async () => [{ id: 'id-1' }]) })) })),
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: vi.fn(async () => [{ id: 'id-1' }]), orderBy: vi.fn(async () => [{ id: 'id-1' }]) })) })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn(() => ({ returning: vi.fn(async () => [{ id: 'id-1', status: 'running' }]) })) })) })),
  };
}

describe('projects repository', () => {
  it('creates and fetches projects', async () => {
    const db = createMockDb() as unknown as Parameters<typeof createProject>[0];
    await expect(createProject(db, { ownerId: 'u1', name: 'n', slug: 's' })).resolves.toEqual({ id: 'id-1' });
    await expect(getProjectById(db, 'p1')).resolves.toEqual({ id: 'id-1' });
    await expect(listProjectsForOwner(db, 'u1')).resolves.toEqual([{ id: 'id-1' }]);
  });
});

describe('generation repository', () => {
  it('creates and updates jobs', async () => {
    const db = createMockDb() as unknown as Parameters<typeof createGenerationJob>[0];
    await expect(createGenerationJob(db, { projectId: 'p1', type: 'spec', input: {} })).resolves.toEqual({ id: 'id-1' });
    await expect(updateGenerationJobStatus(db, { jobId: 'j1', status: 'running' })).resolves.toMatchObject({ status: 'running' });
  });

  it('lists generation events', async () => {
    const db = createMockDb() as unknown as Parameters<typeof listGenerationEvents>[0];
    await expect(listGenerationEvents(db, 'j1')).resolves.toEqual([{ id: 'id-1' }]);
  });
});
