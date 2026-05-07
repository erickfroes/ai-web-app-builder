import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const projectStatusEnum = pgEnum('project_status', ['draft', 'active', 'archived']);
export const generationJobStatusEnum = pgEnum('generation_job_status', ['queued', 'running', 'succeeded', 'failed', 'cancelled']);
export const generationJobTypeEnum = pgEnum('generation_job_type', ['spec', 'files', 'repair']);
export const generationEventLevelEnum = pgEnum('generation_event_level', ['debug', 'info', 'warn', 'error']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 320 }).notNull(),
  displayName: varchar('display_name', { length: 120 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailUnique: uniqueIndex('users_email_unique').on(table.email),
}));

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 160 }).notNull(),
  slug: varchar('slug', { length: 180 }).notNull(),
  description: text('description'),
  status: projectStatusEnum('status').notNull().default('draft'),
  lastGeneratedAt: timestamp('last_generated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  ownerIdIndex: index('projects_owner_id_idx').on(table.ownerId),
  ownerSlugUnique: uniqueIndex('projects_owner_slug_unique').on(table.ownerId, table.slug),
}));

export const projectVersions = pgTable('project_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  spec: jsonb('spec').notNull(),
  changelog: text('changelog'),
  createdByUserId: uuid('created_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectIdIndex: index('project_versions_project_id_idx').on(table.projectId),
  projectVersionUnique: uniqueIndex('project_versions_project_version_unique').on(table.projectId, table.versionNumber),
}));

export const generationJobs = pgTable('generation_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  projectVersionId: uuid('project_version_id').references(() => projectVersions.id, { onDelete: 'set null' }),
  queuedByUserId: uuid('queued_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  type: generationJobTypeEnum('type').notNull(),
  status: generationJobStatusEnum('status').notNull().default('queued'),
  model: varchar('model', { length: 120 }),
  input: jsonb('input').notNull(),
  output: jsonb('output'),
  errorMessage: text('error_message'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  projectStatusIndex: index('generation_jobs_project_status_idx').on(table.projectId, table.status),
  createdAtIndex: index('generation_jobs_created_at_idx').on(table.createdAt),
}));

export const generatedFiles = pgTable('generated_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  generationJobId: uuid('generation_job_id').notNull().references(() => generationJobs.id, { onDelete: 'cascade' }),
  projectVersionId: uuid('project_version_id').references(() => projectVersions.id, { onDelete: 'set null' }),
  path: text('path').notNull(),
  content: text('content').notNull(),
  contentSha256: varchar('content_sha256', { length: 64 }).notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  jobIdIndex: index('generated_files_generation_job_id_idx').on(table.generationJobId),
  jobPathUnique: uniqueIndex('generated_files_job_path_unique').on(table.generationJobId, table.path),
}));

export const generationEvents = pgTable('generation_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  generationJobId: uuid('generation_job_id').notNull().references(() => generationJobs.id, { onDelete: 'cascade' }),
  level: generationEventLevelEnum('level').notNull().default('info'),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  message: text('message').notNull(),
  payload: jsonb('payload'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  jobIdCreatedAtIndex: index('generation_events_job_id_created_at_idx').on(table.generationJobId, table.createdAt),
}));

export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 180 }).notNull(),
  name: varchar('name', { length: 160 }).notNull(),
  description: text('description'),
  spec: jsonb('spec').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  slugUnique: uniqueIndex('templates_slug_unique').on(table.slug),
}));

export const usageEvents = pgTable('usage_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  generationJobId: uuid('generation_job_id').references(() => generationJobs.id, { onDelete: 'set null' }),
  eventName: varchar('event_name', { length: 120 }).notNull(),
  units: integer('units').notNull().default(1),
  metadata: jsonb('metadata'),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  externalRef: varchar('external_ref', { length: 190 }),
  costMicros: bigint('cost_micros', { mode: 'number' }),
}, (table) => ({
  userOccurredAtIndex: index('usage_events_user_occurred_at_idx').on(table.userId, table.occurredAt),
  eventNameOccurredAtIndex: index('usage_events_event_name_occurred_at_idx').on(table.eventName, table.occurredAt),
}));

export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ProjectVersion = typeof projectVersions.$inferSelect;
export type GenerationJob = typeof generationJobs.$inferSelect;
