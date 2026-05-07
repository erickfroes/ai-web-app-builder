import { zodResponseFormat } from "openai/helpers/zod";
import { AppSpecSchema, type AppSpec } from "@/schemas";
import { AI_SYSTEM_PROMPT, buildAppSpecPrompt } from "@/lib/ai/prompts";
import { AiLayerError, createOpenAiClient, DEFAULT_OPENAI_MODEL } from "@/lib/ai/client";

export const generateAppSpec = async (request: string, templateConstraint?: string): Promise<AppSpec> => {
  const client = createOpenAiClient();
  const response = await client.beta.chat.completions.parse({
    model: DEFAULT_OPENAI_MODEL,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: buildAppSpecPrompt(request, templateConstraint) },
    ],
    response_format: zodResponseFormat(AppSpecSchema, "app_spec"),
  });

  const parsed = AppSpecSchema.safeParse(response.choices[0]?.message.parsed);
  if (!parsed.success) {
    throw new AiLayerError("APP_SPEC_INVALID", "Model returned an invalid AppSpec payload.");
  }

  return parsed.data;
};
