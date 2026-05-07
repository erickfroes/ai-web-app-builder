CREATE TYPE project_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE generation_job_status AS ENUM ('queued', 'running', 'succeeded', 'failed', 'cancelled');
CREATE TYPE generation_job_type AS ENUM ('spec', 'files', 'repair');
CREATE TYPE generation_event_level AS ENUM ('debug', 'info', 'warn', 'error');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) NOT NULL,
  display_name varchar(120),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_unique ON users(email);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name varchar(160) NOT NULL,
  slug varchar(180) NOT NULL,
  description text,
  status project_status NOT NULL DEFAULT 'draft',
  last_generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX projects_owner_id_idx ON projects(owner_id);
CREATE UNIQUE INDEX projects_owner_slug_unique ON projects(owner_id, slug);

CREATE TABLE project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  spec jsonb NOT NULL,
  changelog text,
  created_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX project_versions_project_id_idx ON project_versions(project_id);
CREATE UNIQUE INDEX project_versions_project_version_unique ON project_versions(project_id, version_number);

CREATE TABLE generation_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  project_version_id uuid REFERENCES project_versions(id) ON DELETE SET NULL,
  queued_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  type generation_job_type NOT NULL,
  status generation_job_status NOT NULL DEFAULT 'queued',
  model varchar(120),
  input jsonb NOT NULL,
  output jsonb,
  error_message text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX generation_jobs_project_status_idx ON generation_jobs(project_id, status);
CREATE INDEX generation_jobs_created_at_idx ON generation_jobs(created_at);

CREATE TABLE generated_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_job_id uuid NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
  project_version_id uuid REFERENCES project_versions(id) ON DELETE SET NULL,
  path text NOT NULL,
  content text NOT NULL,
  content_sha256 varchar(64) NOT NULL,
  size_bytes integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX generated_files_generation_job_id_idx ON generated_files(generation_job_id);
CREATE UNIQUE INDEX generated_files_job_path_unique ON generated_files(generation_job_id, path);

CREATE TABLE generation_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_job_id uuid NOT NULL REFERENCES generation_jobs(id) ON DELETE CASCADE,
  level generation_event_level NOT NULL DEFAULT 'info',
  event_type varchar(100) NOT NULL,
  message text NOT NULL,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX generation_events_job_id_created_at_idx ON generation_events(generation_job_id, created_at);

CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug varchar(180) NOT NULL,
  name varchar(160) NOT NULL,
  description text,
  spec jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX templates_slug_unique ON templates(slug);

CREATE TABLE usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  generation_job_id uuid REFERENCES generation_jobs(id) ON DELETE SET NULL,
  event_name varchar(120) NOT NULL,
  units integer NOT NULL DEFAULT 1,
  metadata jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  external_ref varchar(190),
  cost_micros bigint
);
CREATE INDEX usage_events_user_occurred_at_idx ON usage_events(user_id, occurred_at);
CREATE INDEX usage_events_event_name_occurred_at_idx ON usage_events(event_name, occurred_at);
