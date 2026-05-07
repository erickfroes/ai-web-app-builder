import { zodResponseFormat } from "openai/helpers/zod";
import { FilePatchSchema, GenerationPlanSchema, ReviewReportSchema, type FilePatch, type GenerationPlan, type ReviewReport } from "@/schemas";
import { AI_SYSTEM_PROMPT, buildReviewPrompt } from "@/lib/ai/prompts";
import { AiLayerError, createOpenAiClient, DEFAULT_OPENAI_MODEL } from "@/lib/ai/client";
import { z } from "zod";

const FilePatchListSchema = z.array(FilePatchSchema).min(1);

export const reviewGeneration = async (plan: GenerationPlan, patches: FilePatch[]): Promise<ReviewReport> => {
  const parsedPlan = GenerationPlanSchema.safeParse(plan);
  if (!parsedPlan.success) {
    throw new AiLayerError("REVIEW_CONTEXT_INVALID", "Invalid GenerationPlan provided for review.");
  }

  const parsedPatches = FilePatchListSchema.safeParse(patches);
  if (!parsedPatches.success) {
    throw new AiLayerError("REVIEW_CONTEXT_INVALID", "Invalid FilePatch list provided for review.");
  }

  const client = createOpenAiClient();
  const response = await client.beta.chat.completions.parse({
    model: DEFAULT_OPENAI_MODEL,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: buildReviewPrompt(JSON.stringify(plan), JSON.stringify(patches)) },
    ],
    response_format: zodResponseFormat(ReviewReportSchema, "review_report"),
  });

  const parsed = ReviewReportSchema.safeParse(response.choices[0]?.message.parsed);
  if (!parsed.success) {
    throw new AiLayerError("REVIEW_REPORT_INVALID", "Model returned an invalid ReviewReport payload.");
  }

  return parsed.data;
};
