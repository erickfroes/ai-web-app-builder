# AI Web App Builder — Codex Instructions

## Product goal

Build a SaaS that generates high-quality Next.js + React + TailwindCSS web apps using the OpenAI API.

The system must generate structured specifications first, then generate files from those specs.

## Current repository phase

This repo is currently in a **documentation-first** phase.

- Do not scaffold the runtime app until roadmap steps allow it.
- Do not add dependencies unless explicitly requested for a specific PR scope.
- Keep architecture and schema docs as the source of truth.

## Non-negotiable rules

- Do not expose OPENAI_API_KEY to the client.
- All AI calls must happen server-side.
- Use TypeScript strict mode.
- Use Zod for input/output validation.
- Prefer semantic design tokens over hardcoded colors.
- Do not execute user-generated code inside the main app runtime.
- Generated file paths must be sanitized.
- Generated files must stay inside the project virtual filesystem.
- Every feature must include tests or a clear validation path.
- Every API route must validate input and return typed errors.

## Design rules

- Use shadcn/ui components.
- Use Tailwind semantic tokens: bg-background, text-foreground, bg-primary, text-primary-foreground, border-border, bg-card.
- Avoid random hardcoded colors.
- Keep layouts clean, premium, SaaS-like and responsive.
- Every page must have clear hierarchy, primary action, empty state and loading state.

## Commands

Use these before completing a PR (when the app/tooling exists):

pnpm lint
pnpm typecheck
pnpm test
pnpm build

If the commands cannot run because the implementation is not scaffolded yet, explicitly report that limitation in the PR summary.

## Architecture

Use feature-based organization:

features/project
features/generation
features/design-system
features/export

Use schemas in /schemas and prompts in /prompts.

## PR rules

Keep PRs small.
Do not mix unrelated features.
Explain tradeoffs in the PR summary.
Include migration notes if DB schema changes.
