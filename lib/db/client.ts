import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

let cachedClient: ReturnType<typeof postgres> | null = null;
let cachedDb: Database | null = null;

export function getDb(): Database {
  if (cachedDb) return cachedDb;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for database access.');
  }

  cachedClient = postgres(connectionString, {
    prepare: false,
    max: 10,
  });
  cachedDb = drizzle(cachedClient, { schema });
  return cachedDb;
}

export async function closeDbConnection(): Promise<void> {
  if (!cachedClient) return;
  await cachedClient.end({ timeout: 5 });
  cachedClient = null;
  cachedDb = null;
}
