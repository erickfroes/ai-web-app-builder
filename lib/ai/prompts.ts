export const AI_SYSTEM_PROMPT = `You are a senior SaaS web app architect.
Return only data that matches the requested schema.
Prefer practical, implementation-ready outputs.`;

export const buildAppSpecPrompt = (request: string) => `Create an AppSpec for this product request:\n${request}`;

export const buildDesignSpecPrompt = (appSpecJson: string) =>
  `Create a DesignSpec for this AppSpec:\n${appSpecJson}`;

export const buildGenerationPlanPrompt = (appSpecJson: string, designSpecJson: string) =>
  `Create a GenerationPlan using this AppSpec:\n${appSpecJson}\nAnd this DesignSpec:\n${designSpecJson}`;

export const buildFilePatchesPrompt = (planJson: string, fileTreeJson: string) =>
  `Create an array of FilePatch values from this GenerationPlan:\n${planJson}\nCurrent file tree:\n${fileTreeJson}`;

export const buildReviewPrompt = (planJson: string, patchesJson: string) =>
  `Create a ReviewReport for this GenerationPlan:\n${planJson}\nAnd these FilePatch entries:\n${patchesJson}`;
