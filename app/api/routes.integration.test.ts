import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/db', () => ({ getDb: vi.fn(() => ({})) }));
vi.mock('@/lib/db/repositories/projects-repository', () => ({
  createProject: vi.fn(async () => ({ id: 'p1' })),
  listProjectsForOwner: vi.fn(async () => [{ id: 'p1' }]),
  getProjectById: vi.fn(async () => ({ id: 'p1' })),
  listProjectVersions: vi.fn(async () => [{ id: 'v1', versionNumber: 1 }]),
}));
vi.mock('@/lib/db/repositories/generation-repository', () => ({
  createGenerationJob: vi.fn(async () => ({ id: 'j1', status: 'queued' })),
  listGeneratedFilesForProject: vi.fn(async () => [{ id: 'f1', path: 'app/page.tsx' }]),
  listGeneratedFilesContentForProject: vi.fn(async () => [{ path: 'app/page.tsx', content: 'ok' }]),
}));

describe('API routes', () => {
  it('creates project with validated body', async () => {
    const { POST } = await import('@/app/api/projects/route');
    const response = await POST(new Request('http://localhost/api/projects', { method: 'POST', body: JSON.stringify({ ownerId: '550e8400-e29b-41d4-a716-446655440000', name: 'My app', slug: 'my-app' }) }));
    expect(response.status).toBe(201);
  });

  it('rejects invalid project list query', async () => {
    const { GET } = await import('@/app/api/projects/route');
    const response = await GET(new Request('http://localhost/api/projects?ownerId=bad'));
    expect(response.status).toBe(400);
  });

  it('gets project by id', async () => {
    const { GET } = await import('@/app/api/projects/[projectId]/route');
    const response = await GET(new Request('http://localhost/api/projects/x'), { params: Promise.resolve({ projectId: '550e8400-e29b-41d4-a716-446655440000' }) });
    expect(response.status).toBe(200);
  });

  it('starts generation job', async () => {
    const { POST } = await import('@/app/api/generation/start/route');
    const response = await POST(new Request('http://localhost/api/generation/start', { method: 'POST', body: JSON.stringify({ projectId: '550e8400-e29b-41d4-a716-446655440000', type: 'files', input: { prompt: 'build' } }) }));
    expect(response.status).toBe(201);
  });

  it('lists versions, files and export payload', async () => {
    const id = '550e8400-e29b-41d4-a716-446655440000';
    const versionsRoute = await import('@/app/api/projects/[projectId]/versions/route');
    const filesRoute = await import('@/app/api/projects/[projectId]/files/route');
    const exportRoute = await import('@/app/api/projects/[projectId]/export/route');

    const versionsRes = await versionsRoute.GET(new Request('http://localhost'), { params: Promise.resolve({ projectId: id }) });
    const filesRes = await filesRoute.GET(new Request('http://localhost'), { params: Promise.resolve({ projectId: id }) });
    const exportRes = await exportRoute.GET(new Request('http://localhost'), { params: Promise.resolve({ projectId: id }) });

    expect(versionsRes.status).toBe(200);
    expect(filesRes.status).toBe(200);
    expect(exportRes.status).toBe(200);
  });
});
