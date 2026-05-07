# AI Generation Pipeline

## Pipeline Stages

1. **Intake Normalization**
   - Validate user request payload.
   - Normalize defaults (target stack, design style presets).

2. **AppSpec Generation**
   - Prompt model to create structured app blueprint.
   - Validate against AppSpec schema.
   - Retry with corrective prompt on validation failure.

3. **DesignSpec Generation**
   - Derive visual and interaction rules from AppSpec + user intent.
   - Validate against DesignSpec schema.

4. **Implementation Planning**
   - Produce ordered file plan and dependencies.
   - Detect missing routes/components/states.

5. **FilePatch Generation**
   - Emit strict patch operations only (create/update/delete).
   - Validate each patch entry.

6. **Safety & Quality Validation**
   - Path sanitization and root-bound enforcement.
   - Forbidden-pattern scanning.
   - Design quality heuristics.

7. **Patch Application (VFS)**
   - Apply validated patches atomically to isolated workspace.

8. **Artifact Finalization**
   - Emit output bundle + diagnostics + generation trace.

## AppSpec Schema (v1 draft)

```ts
interface AppSpec {
  version: "1";
  appName: string;
  summary: string;
  target: {
    framework: "nextjs";
    styling: "tailwindcss";
    language: "typescript";
  };
  routes: Array<{
    path: string; // normalized absolute route path
    name: string;
    purpose: string;
    auth: "public" | "authenticated";
    sections: Array<{
      id: string;
      kind: "hero" | "feature-grid" | "table" | "form" | "cta" | "custom";
      description: string;
    }>;
  }>;
  entities: Array<{
    name: string;
    fields: Array<{ name: string; type: string; required: boolean }>;
  }>;
  features: Array<{
    key: string;
    description: string;
    dependencies: string[];
  }>;
}
```

## DesignSpec Schema (v1 draft)

```ts
interface DesignSpec {
  version: "1";
  theme: {
    mode: "light" | "dark" | "system";
    radius: "sm" | "md" | "lg";
    density: "compact" | "comfortable";
  };
  tokens: {
    requiredClasses: string[]; // bg-background, text-foreground, etc.
    typographyScale: Record<string, string>;
    spacingScale: Record<string, string>;
  };
  components: Array<{
    routePath: string;
    componentName: string;
    variant?: string;
    states: Array<"default" | "empty" | "loading" | "error">;
    a11yNotes: string[];
  }>;
  layoutRules: {
    maxWidth: string;
    sectionSpacing: string;
    responsiveBreakpoints: string[];
  };
}
```

## FilePatch Schema (v1 draft)

```ts
interface FilePatch {
  version: "1";
  ops: Array<
    | { type: "create"; path: string; content: string }
    | { type: "update"; path: string; content: string }
    | { type: "delete"; path: string }
  >;
  metadata: {
    rationale: string;
    generatedBy: string;
    specRefs: string[];
  };
}
```

## Validation Requirements

- Reject unknown schema fields in strict mode.
- Reject unsafe or non-normalized paths.
- Require deterministic ordering for patch operations.
- Require each route to include loading and empty-state definitions.
