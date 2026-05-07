# AI Web App Builder

AI Web App Builder is a SaaS platform that generates production-quality **Next.js + React + TailwindCSS** applications from structured product intent.

> Status: documentation-first foundation. No app scaffolding or dependencies have been added yet.

## Product Summary

The platform takes user intent (prompt + constraints), converts it into validated structured specs, and then generates files through a safe patch pipeline.

High-level flow:

1. Collect project intent and constraints.
2. Generate an **AppSpec** (what to build).
3. Generate a **DesignSpec** (how it should look and behave).
4. Plan and generate deterministic **FilePatch** operations.
5. Validate and apply patches in an isolated virtual filesystem.
6. Run static quality/security checks before export.

## Documentation Map

- Product scope and goals: [`docs/product.md`](docs/product.md)
- Architecture: [`docs/architecture.md`](docs/architecture.md)
- Generation pipeline: [`docs/generation-pipeline.md`](docs/generation-pipeline.md)
- Security model and rules: [`docs/security.md`](docs/security.md)
- Design quality standards: [`docs/design-quality.md`](docs/design-quality.md)
- MVP implementation roadmap: [`docs/mvp-roadmap.md`](docs/mvp-roadmap.md)

## Core Principles

- Server-side AI execution only.
- Strict schema-first generation lifecycle.
- Secure path handling and sandboxed file operations.
- Typed validation at every API boundary.
- Premium SaaS-level UI quality baseline.

## Current Phase

This repository currently defines the product and technical architecture only.

- No Next.js project scaffold yet.
- No new runtime dependencies yet.
- No generation runtime yet.

## Next Step

Follow the PR-by-PR plan in [`docs/mvp-roadmap.md`](docs/mvp-roadmap.md) to implement the MVP incrementally.
