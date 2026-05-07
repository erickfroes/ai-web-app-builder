import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';

import { createProjectZip } from '@/lib/export/create-zip';

describe('createProjectZip', () => {
  it('includes generated app files and required scaffolding files', async () => {
    const archive = await createProjectZip({
      projectName: 'Demo App',
      files: [{ path: 'app/page.tsx', content: 'export default function Page() { return null; }' }],
    });

    const zip = await JSZip.loadAsync(archive);

    expect(zip.file('app/page.tsx')).toBeDefined();
    expect(zip.file('package.json')).toBeDefined();
    expect(zip.file('README.md')).toBeDefined();
    expect(zip.file('.env.example')).toBeDefined();

    const readme = await zip.file('README.md')?.async('string');
    expect(readme).toContain('## Installation');
  });

  it('skips unsafe paths and secret files', async () => {
    const archive = await createProjectZip({
      projectName: 'Demo App',
      files: [
        { path: '../outside.txt', content: 'bad' },
        { path: '/absolute.txt', content: 'bad' },
        { path: '.env', content: 'OPENAI_API_KEY=secret' },
        { path: 'src/index.ts', content: 'console.log(1);' },
      ],
    });

    const zip = await JSZip.loadAsync(archive);

    expect(zip.file('../outside.txt')).toBeNull();
    expect(zip.file('/absolute.txt')).toBeNull();
    expect(zip.file('.env')).toBeNull();
    expect(zip.file('src/index.ts')).toBeDefined();
  });
});
