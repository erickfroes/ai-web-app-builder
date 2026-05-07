import OpenAI from "openai";

export const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export class AiLayerError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AiLayerError";
    this.code = code;
  }
}

export const getServerOpenAiApiKey = (): string => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AiLayerError("OPENAI_API_KEY_MISSING", "OPENAI_API_KEY is not configured on the server.");
  }
  return apiKey;
};

export const createOpenAiClient = (): OpenAI => {
  return new OpenAI({ apiKey: getServerOpenAiApiKey() });
};
