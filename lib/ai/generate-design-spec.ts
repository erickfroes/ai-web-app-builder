import { zodResponseFormat } from "openai/helpers/zod";
import { DesignSpecSchema, type AppSpec, type DesignSpec } from "@/schemas";
import { AI_SYSTEM_PROMPT, buildDesignSpecPrompt } from "@/lib/ai/prompts";
import { AiLayerError, createOpenAiClient, DEFAULT_OPENAI_MODEL } from "@/lib/ai/client";

export const generateDesignSpec = async (appSpec: AppSpec): Promise<DesignSpec> => {
  const client = createOpenAiClient();
  const response = await client.beta.chat.completions.parse({
    model: DEFAULT_OPENAI_MODEL,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: buildDesignSpecPrompt(JSON.stringify(appSpec)) },
    ],
    response_format: zodResponseFormat(DesignSpecSchema, "design_spec"),
  });

  const parsed = DesignSpecSchema.safeParse(response.choices[0]?.message.parsed);
  if (!parsed.success) {
    throw new AiLayerError("DESIGN_SPEC_INVALID", "Model returned an invalid DesignSpec payload.");
  }

  return parsed.data;
};
