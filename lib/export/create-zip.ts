import JSZip from 'jszip';

import { RelativeFilePathSchema } from '@/schemas';

const SECRET_FILE_NAMES = new Set(['.env', '.env.local', '.env.production', '.env.development']);

export interface GeneratedProjectFile {
  path: string;
  content: string;
}

export interface CreateProjectZipInput {
  files: GeneratedProjectFile[];
  projectName: string;
}

function sanitizeExportPath(path: string) {
  const parsed = RelativeFilePathSchema.safeParse(path);
  if (!parsed.success) return null;

  const normalized = parsed.data.replaceAll('\\', '/').replace(/^\/+/, '');
  if (!normalized || SECRET_FILE_NAMES.has(normalized)) return null;
  return normalized;
}

function createReadme(projectName: string) {
  return `# ${projectName}\n\nGenerated with AI Web App Builder.\n\n## Installation\n\n1. Install dependencies\n\n\`\`\`bash\npnpm install\n\`\`\`\n\n2. Configure environment\n\n\`\`\`bash\ncp .env.example .env.local\n\`\`\`\n\n3. Start development server\n\n\`\`\`bash\npnpm dev\n\`\`\`\n`;
}

function createEnvExample() {
  return ['# Server-side environment variables only', 'DATABASE_URL=', 'OPENAI_API_KEY='].join('\n');
}

function createPackageJson(projectName: string) {
  return JSON.stringify(
    {
      name: projectName.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'generated-next-app',
      private: true,
      version: '0.1.0',
      scripts: { dev: 'next dev', build: 'next build', start: 'next start', lint: 'next lint' },
      dependencies: { next: '^15.0.0', react: '^19.0.0', 'react-dom': '^19.0.0' },
      devDependencies: { typescript: '^5.0.0' },
    },
    null,
    2,
  );
}

export async function createProjectZip(input: CreateProjectZipInput) {
  const zip = new JSZip();

  for (const file of input.files) {
    const sanitizedPath = sanitizeExportPath(file.path);
    if (!sanitizedPath) continue;
    zip.file(sanitizedPath, file.content);
  }

  zip.file('package.json', createPackageJson(input.projectName));
  zip.file('README.md', createReadme(input.projectName));
  zip.file('.env.example', createEnvExample());

  return zip.generateAsync({ type: 'nodebuffer' });
}
