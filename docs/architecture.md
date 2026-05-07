# System Architecture

## Overview

The system uses a staged, schema-first architecture to separate product intent, design intent, and code emission.

## Major Subsystems

1. **Web App (control plane UI)**
   - Collects user intent and configuration.
   - Displays generation progress, artifacts, and validation feedback.

2. **API Layer**
   - Auth/session handling.
   - Request validation with typed errors.
   - Job orchestration endpoints.

3. **Generation Orchestrator**
   - Coordinates pipeline stages.
   - Handles retries, stage transitions, and audit logs.

4. **Spec Engine**
   - Produces AppSpec and DesignSpec using OpenAI server-side calls.
   - Validates and normalizes specs before downstream steps.

5. **Patch Engine**
   - Converts specs into FilePatch operations.
   - Enforces patch schema and path constraints.

6. **Virtual Filesystem (VFS)**
   - Isolated workspace per generation job.
   - Prevents file writes outside allowed root.

7. **Validator Suite**
   - Schema validation.
   - Security validation.
   - Design quality checks.
   - Build/readiness checks (when scaffold exists).

8. **Artifact/Export Service**
   - Produces downloadable project archive + metadata.

## Suggested Feature Organization

- `features/project`: intake, project metadata, user prompts.
- `features/generation`: orchestration, model calls, patching, validation.
- `features/design-system`: tokens, design rules, component standards.
- `features/export`: artifact packaging and delivery.

## Data Contracts (top-level)

- **AppSpec**: application structure and functional blueprint.
- **DesignSpec**: visual/UX system and quality constraints.
- **FilePatch**: deterministic filesystem mutations.

## Trust Boundaries

- Browser is untrusted for secrets and code execution.
- API/worker boundary validates and sanitizes all inputs.
- Model outputs are treated as untrusted until schema-validated.
- VFS boundary blocks breakout paths and invalid operations.
