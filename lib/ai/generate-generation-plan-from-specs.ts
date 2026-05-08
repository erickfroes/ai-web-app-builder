import { zodResponseFormat } from "openai/helpers/zod";
import { GenerationPlanSchema, type AppSpec, type DesignSpec, type GenerationPlan } from "@/schemas";
import { AI_SYSTEM_PROMPT, buildGenerationPlanPrompt } from "@/lib/ai/prompts";
import { AiLayerError, createOpenAiClient, DEFAULT_OPENAI_MODEL } from "@/lib/ai/client";

export const generateGenerationPlan = async (appSpec: AppSpec, designSpec: DesignSpec): Promise<GenerationPlan> => {
  const client = createOpenAiClient();
  const response = await client.beta.chat.completions.parse({
    model: DEFAULT_OPENAI_MODEL,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: buildGenerationPlanPrompt(JSON.stringify(appSpec), JSON.stringify(designSpec)) },
    ],
    response_format: zodResponseFormat(GenerationPlanSchema, "generation_plan"),
  });

  const parsed = GenerationPlanSchema.safeParse(response.choices[0]?.message.parsed);
  if (!parsed.success) {
    throw new AiLayerError("GENERATION_PLAN_INVALID", "Model returned an invalid GenerationPlan payload.");
  }

  return parsed.data;
};
