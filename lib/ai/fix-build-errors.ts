import { zodResponseFormat } from "openai/helpers/zod";
import { BuildFixPlanSchema, BuildLogSchema, type BuildFixPlan, type BuildLog, type FileTree } from "@/schemas";
import { AI_SYSTEM_PROMPT, buildFixBuildErrorsPrompt } from "@/lib/ai/prompts";
import { AiLayerError, createOpenAiClient, DEFAULT_OPENAI_MODEL } from "@/lib/ai/client";

export const fixBuildErrors = async (buildLog: BuildLog, fileTree: FileTree): Promise<BuildFixPlan> => {
  const parsedLog = BuildLogSchema.safeParse(buildLog);
  if (!parsedLog.success) {
    throw new AiLayerError("BUILD_LOG_INVALID", "Invalid build log provided for build-fix planning.");
  }

  const client = createOpenAiClient();
  const response = await client.beta.chat.completions.parse({
    model: DEFAULT_OPENAI_MODEL,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: buildFixBuildErrorsPrompt(JSON.stringify(buildLog), JSON.stringify(fileTree)) },
    ],
    response_format: zodResponseFormat(BuildFixPlanSchema, "build_fix_plan"),
  });

  const parsed = BuildFixPlanSchema.safeParse(response.choices[0]?.message.parsed);
  if (!parsed.success) {
    throw new AiLayerError("BUILD_FIX_PLAN_INVALID", "Model returned invalid build fix plan.");
  }

  return parsed.data;
};
