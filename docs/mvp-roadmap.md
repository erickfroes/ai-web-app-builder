# MVP Roadmap (PR-by-PR)

## Implementation strategy

Keep PRs focused and vertically slice functionality from contract -> service -> validation -> UX.

## PR-001: Repository foundation

- Define base repo structure (`features/*`, `schemas`, `prompts`, `docs`).
- Add TypeScript config with strict mode.
- Add lint/type/test command scaffolding (minimal).

## PR-002: Core schemas

- Implement Zod schemas for AppSpec, DesignSpec, FilePatch.
- Add schema tests with valid/invalid fixtures.
- Document error formatting conventions.

## PR-003: Generation API skeleton

- Add server-side API route contracts for generation jobs.
- Validate request/response with Zod.
- Return typed error envelopes.

## PR-004: Prompt + spec engine

- Add prompt templates for AppSpec and DesignSpec generation.
- Implement server worker that calls OpenAI API.
- Add retry loop for validation failures.

## PR-005: Patch planner + safety checks

- Generate FilePatch operations from specs.
- Enforce path normalization and root confinement.
- Add forbidden pattern checks.

## PR-006: Virtual filesystem + apply pipeline

- Implement isolated VFS workspace abstraction.
- Apply patches atomically.
- Add rollback behavior for apply failures.

## PR-007: Validator suite

- Add design quality validator.
- Add structural validator (routes/components/states).
- Add security validator for generated output.

## PR-008: Basic SaaS UX shell

- Create minimal UI for prompt input, generation progress, and result summary.
- Add loading/error/empty-state handling.
- Show structured diagnostics from validators.

## PR-009: Export artifacts

- Package generated project output.
- Include generation manifest and validation report.

## PR-010: Hardening and acceptance

- End-to-end generation flow test.
- Regression tests for schema + security invariants.
- Final MVP quality pass and docs refresh.

## Tradeoff notes

- Schema-first development reduces early UI velocity but dramatically lowers unsafe output risk.
- Patch-based generation is slower to design than direct code dumps, but gives deterministic safety and auditability.
