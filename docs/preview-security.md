# Preview Security Model

## Goal

Provide a provider-agnostic preview adapter system without coupling the product to a single runtime vendor while preserving strict execution isolation.

## Hard constraints

- Generated code must never execute in the main application process.
- Preview runtimes must run in a dedicated sandbox boundary (for example, Sandpack iframe runtime or WebContainer process boundary).
- Control plane UI and API can only orchestrate preview sessions and consume sanitized status/URL metadata.
- Secrets (including `OPENAI_API_KEY`) are never exposed to preview runtimes.

## Adapter contract

The preview layer uses a `PreviewProvider` interface that supports:

- Provider metadata (id/name/capability).
- Session creation from project/version context.
- Typed session status responses (`disabled`, `ready`, `unavailable`).

This keeps the system extensible while avoiding provider lock-in during MVP.

## Initial providers

1. `local-disabled`
   - Default-safe provider.
   - Explicitly returns disabled status in control plane environments.

2. `sandbox-adapter-placeholder`
   - Placeholder compatible with future Sandpack/WebContainer integration.
   - Returns unavailable until sandbox runtime plumbing is implemented.

## Security checklist for future runtime integration

- Enforce per-session filesystem isolation.
- Deny host filesystem/network capabilities by default.
- Validate generated file paths before sandbox hydration.
- Use strict CSP and origin isolation for iframe-based runtimes.
- Add runtime timeouts and resource limits (CPU/memory).
- Redact sensitive logs and block token egress channels.
