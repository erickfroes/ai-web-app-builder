import {
  AppSpecSchema,
  BuildFixPlanSchema,
  ComponentSpecSchema,
  DataModelSpecSchema,
  DesignSpecSchema,
  GenerationPlanSchema,
  ReviewReportSchema,
  type AppSpec,
  type BuildFixPlan,
  type ComponentSpec,
  type DataModelSpec,
  type DesignSpec,
  type GenerationPlan,
  type ReviewReport,
  type RouteSpec,
} from "@/schemas";

export interface MultiAgentPlanner {
  productPlanner: (brief: string) => Promise<unknown>;
  uxUiDesigner: (appSpec: AppSpec) => Promise<unknown>;
  dataModelPlanner: (appSpec: AppSpec) => Promise<unknown>;
  frontendGenerator: (appSpec: AppSpec, designSpec: DesignSpec) => Promise<unknown>;
  backendGenerator: (context: { appSpec: AppSpec; dataModelSpec: DataModelSpec }) => Promise<unknown>;
  qaReviewer: (candidate: Omit<GenerationPlan, "executionOrder"> & { executionOrder?: string[] }) => Promise<unknown>;
  securityReviewer: (candidate: Omit<GenerationPlan, "executionOrder"> & { executionOrder?: string[] }) => Promise<unknown>;
  buildFixer: (issues: Array<{ source: "qa" | "security"; message: string }>) => Promise<unknown>;
  builderManager: (payload: {
    productPlanner: AppSpec;
    uxUiDesigner: DesignSpec;
    dataModelPlanner: DataModelSpec;
    frontendGenerator: { routes: RouteSpec[]; components: ComponentSpec[] };
    backendGenerator: { executionOrder: string[] };
  }) => Promise<unknown>;
}

export async function runMultiAgentGenerationPlan(brief: string, agents: MultiAgentPlanner): Promise<GenerationPlan> {
  const productPlanner = AppSpecSchema.parse(await agents.productPlanner(brief));
  const uxUiDesigner = DesignSpecSchema.parse(await agents.uxUiDesigner(productPlanner));
  const dataModelPlanner = DataModelSpecSchema.parse(await agents.dataModelPlanner(productPlanner));
  const frontendPayload = (await agents.frontendGenerator(productPlanner, uxUiDesigner)) as {
    routes?: unknown;
    components?: unknown;
  };
  const frontendGenerator = {
    routes: GenerationPlanSchema.shape.routes.parse(frontendPayload.routes),
    components: GenerationPlanSchema.shape.components.parse(frontendPayload.components),
  };

  const backendPayload = (await agents.backendGenerator({ appSpec: productPlanner, dataModelSpec: dataModelPlanner })) as {
    executionOrder?: unknown;
  };
  const backendGenerator = {
    executionOrder: GenerationPlanSchema.shape.executionOrder.parse(backendPayload.executionOrder),
  };

  const candidate = {
    appSpec: productPlanner,
    designSpec: uxUiDesigner,
    dataModelSpec: dataModelPlanner,
    routes: frontendGenerator.routes,
    components: frontendGenerator.components,
    executionOrder: backendGenerator.executionOrder,
  };

  const qaReviewer = ReviewReportSchema.parse(await agents.qaReviewer(candidate));
  const securityReviewer = ReviewReportSchema.parse(await agents.securityReviewer(candidate));

  const reviewIssues = [
    ...qaReviewer.issues.map((issue) => ({ source: "qa" as const, message: issue.message })),
    ...securityReviewer.issues.map((issue) => ({ source: "security" as const, message: issue.message })),
  ];

  if (!qaReviewer.approved || !securityReviewer.approved) {
    BuildFixPlanSchema.parse(await agents.buildFixer(reviewIssues));
    throw new Error("GenerationPlan rejected by QA or Security reviewer.");
  }

  return GenerationPlanSchema.parse(
    await agents.builderManager({
      productPlanner,
      uxUiDesigner,
      dataModelPlanner,
      frontendGenerator,
      backendGenerator,
    }),
  );
}
