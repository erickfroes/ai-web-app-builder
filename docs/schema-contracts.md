# Schema Contracts

This document defines structured schema contracts for the AI web app generation pipeline.

## Implemented schemas

- `AppSpec`
- `DesignSpec`
- `DataModelSpec`
- `RouteSpec`
- `ComponentSpec`
- `GenerationPlan`
- `FilePatch`
- `FileTree`
- `ReviewReport`
- `BuildFixPlan`
- `BuildLog`

All schemas are implemented with Zod strict objects in `schemas/index.ts`.

## Security and validation constraints

- All object schemas use `.strict()` to reject unknown keys.
- `FilePatch.operation` only allows `create`, `update`, `delete`.
- File paths must be relative and cannot contain `../` traversal.
- Validation helpers are exported to support safe parsing in runtime services.

## Fixtures

Sample fixtures are provided under `schemas/fixtures/`:

- `generation-plan.json`
- `build-fix-plan.json`

These fixtures are validated in `schemas/__tests__/schemas.test.ts`.


## ReviewReport extensions

- ReviewReport includes UI quality scoring by category plus overall score.
- ReviewReport includes automatic prioritized suggestions.
- ReviewReport includes hard-fail reasons to block low-quality UI output.


## Build error fix flow contracts

- `BuildLog` captures raw build output plus optional summary and source classifier.
- `BuildFixPlan` now embeds `buildLog` to keep AI patch proposals tied to original error evidence.
- Patch proposals must remain schema-validated and path-sanitized before user application.
