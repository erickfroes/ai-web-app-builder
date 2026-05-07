import { zodResponseFormat } from "openai/helpers/zod";
import { FilePatchSchema, FileTreeSchema, GenerationPlanSchema, type FilePatch, type FileTree, type GenerationPlan } from "@/schemas";
import { AI_SYSTEM_PROMPT, buildFilePatchesPrompt } from "@/lib/ai/prompts";
import { AiLayerError, createOpenAiClient, DEFAULT_OPENAI_MODEL } from "@/lib/ai/client";
import { z } from "zod";

const FilePatchListSchema = z.array(FilePatchSchema).min(1);

export const generateFilePatches = async (plan: GenerationPlan, fileTree: FileTree): Promise<FilePatch[]> => {
  const parsedPlan = GenerationPlanSchema.safeParse(plan);
  const parsedTree = FileTreeSchema.safeParse(fileTree);
  if (!parsedPlan.success || !parsedTree.success) {
    throw new AiLayerError("FILE_PATCH_CONTEXT_INVALID", "Invalid plan or file tree provided for file patch generation.");
  }

  const client = createOpenAiClient();
  const response = await client.beta.chat.completions.parse({
    model: DEFAULT_OPENAI_MODEL,
    messages: [
      { role: "system", content: AI_SYSTEM_PROMPT },
      { role: "user", content: buildFilePatchesPrompt(JSON.stringify(plan), JSON.stringify(fileTree)) },
    ],
    response_format: zodResponseFormat(FilePatchListSchema, "file_patches"),
  });

  const parsed = FilePatchListSchema.safeParse(response.choices[0]?.message.parsed);
  if (!parsed.success) {
    throw new AiLayerError("FILE_PATCHES_INVALID", "Model returned invalid FilePatch entries.");
  }

  return parsed.data;
};
