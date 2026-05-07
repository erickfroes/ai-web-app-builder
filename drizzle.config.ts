import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/ai_web_app_builder',
  },
} satisfies Config;
