import { z } from "zod";

const relativePathRegex = /^(?!\/)(?!.*(?:^|\/)\.\.(?:\/|$))[A-Za-z0-9._\-/]+$/;

export const RelativeFilePathSchema = z
  .string()
  .min(1)
  .regex(relativePathRegex, "Path must be relative and cannot contain ../ traversal.");

export const AppSpecSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    goals: z.array(z.string().min(1)).min(1),
    targetUsers: z.array(z.string().min(1)).min(1),
    features: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const DesignSpecSchema = z
  .object({
    theme: z.enum(["light", "dark", "system"]),
    styleKeywords: z.array(z.string().min(1)).min(1),
    colorTokens: z.array(z.string().min(1)).min(1),
    typography: z.object({ headingFont: z.string().min(1), bodyFont: z.string().min(1) }).strict(),
  })
  .strict();

export const DataFieldSpecSchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(["string", "number", "boolean", "date", "json"]),
    required: z.boolean(),
  })
  .strict();

export const DataEntitySpecSchema = z
  .object({
    name: z.string().min(1),
    fields: z.array(DataFieldSpecSchema).min(1),
  })
  .strict();

export const DataModelSpecSchema = z.object({ entities: z.array(DataEntitySpecSchema).min(1) }).strict();

export const RouteSpecSchema = z
  .object({
    path: z.string().startsWith("/"),
    title: z.string().min(1),
    authRequired: z.boolean(),
    primaryAction: z.string().min(1),
    components: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const ComponentSpecSchema = z
  .object({
    name: z.string().min(1),
    purpose: z.string().min(1),
    props: z.array(z.object({ name: z.string().min(1), type: z.string().min(1), required: z.boolean() }).strict()),
  })
  .strict();

export const GenerationPlanSchema = z
  .object({
    appSpec: AppSpecSchema,
    designSpec: DesignSpecSchema,
    dataModelSpec: DataModelSpecSchema,
    routes: z.array(RouteSpecSchema).min(1),
    components: z.array(ComponentSpecSchema).min(1),
    executionOrder: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const FilePatchSchema = z
  .object({
    operation: z.enum(["create", "update", "delete"]),
    path: RelativeFilePathSchema,
    content: z.string().optional(),
    reason: z.string().min(1),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.operation === "delete" && value.content !== undefined) {
      ctx.addIssue({ code: "custom", message: "Delete operations must not include content.", path: ["content"] });
    }
    if ((value.operation === "create" || value.operation === "update") && value.content === undefined) {
      ctx.addIssue({ code: "custom", message: "Create/update operations must include content.", path: ["content"] });
    }
  });

export const FileTreeNodeSchema: z.ZodType<{ path: string; type: "file" | "directory"; children?: unknown[] }> = z
  .object({
    path: RelativeFilePathSchema,
    type: z.enum(["file", "directory"]),
    children: z.array(z.lazy(() => FileTreeNodeSchema)).optional(),
  })
  .strict();

export const FileTreeSchema = z.object({ root: FileTreeNodeSchema }).strict();

export const ReviewIssueSchema = z
  .object({
    severity: z.enum(["info", "warning", "error"]),
    message: z.string().min(1),
    path: RelativeFilePathSchema.optional(),
  })
  .strict();

export const ReviewReportSchema = z
  .object({
    summary: z.string().min(1),
    approved: z.boolean(),
    issues: z.array(ReviewIssueSchema),
  })
  .strict();

export const BuildFixStepSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    filePatches: z.array(FilePatchSchema).min(1),
  })
  .strict();

export const BuildFixPlanSchema = z
  .object({
    rootCause: z.string().min(1),
    steps: z.array(BuildFixStepSchema).min(1),
    validationChecks: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type AppSpec = z.infer<typeof AppSpecSchema>;
export type DesignSpec = z.infer<typeof DesignSpecSchema>;
export type DataModelSpec = z.infer<typeof DataModelSpecSchema>;
export type RouteSpec = z.infer<typeof RouteSpecSchema>;
export type ComponentSpec = z.infer<typeof ComponentSpecSchema>;
export type GenerationPlan = z.infer<typeof GenerationPlanSchema>;
export type FilePatch = z.infer<typeof FilePatchSchema>;
export type FileTree = z.infer<typeof FileTreeSchema>;
export type ReviewReport = z.infer<typeof ReviewReportSchema>;
export type BuildFixPlan = z.infer<typeof BuildFixPlanSchema>;

export const validateWith = <T>(schema: z.ZodSchema<T>, input: unknown) => schema.safeParse(input);

export const validateGenerationPlan = (input: unknown) => validateWith(GenerationPlanSchema, input);
export const validateFilePatch = (input: unknown) => validateWith(FilePatchSchema, input);
export const validateFileTree = (input: unknown) => validateWith(FileTreeSchema, input);
export const validateReviewReport = (input: unknown) => validateWith(ReviewReportSchema, input);
export const validateBuildFixPlan = (input: unknown) => validateWith(BuildFixPlanSchema, input);
