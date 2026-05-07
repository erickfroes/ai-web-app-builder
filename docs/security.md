# Security Rules

## Core Security Principles

1. Treat all user input and model output as untrusted.
2. Keep secrets server-side only.
3. Validate, sanitize, and constrain every filesystem operation.
4. Avoid dynamic execution of untrusted generated code.

## Mandatory Rules

- **No client secret exposure**: OPENAI_API_KEY must never be sent to browser clients.
- **Server-side AI calls only**: all model invocations happen in trusted server workers.
- **Strict input validation**: all API routes parse/validate payloads and return typed errors.
- **Output validation**: AI outputs must pass schema checks before use.
- **Filesystem confinement**:
  - Normalize paths.
  - Block `..`, absolute host paths, and symlink escapes.
  - Enforce project-root-only writes in VFS.
- **No unsafe execution**:
  - Do not eval generated code in platform runtime.
  - Do not run arbitrary shell commands from model output.

## Threats Addressed

- Prompt injection into generation instructions.
- Path traversal in generated file operations.
- Secret leakage via generated client code.
- Malicious code suggestions in model output.
- Cross-tenant data exposure through job/workspace mix-ups.

## Security Validation Checklist

- Request payload validated by schema.
- Model response validated by schema.
- Patch paths validated + normalized.
- Workspace isolation verified.
- Secret scanning on generated output.
- Audit log includes generation stages and errors.
