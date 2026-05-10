import { inject, injectable } from "inversify";
import OpenAI from "openai";
import { LlmEmptyResponseError } from "@/errors/llm-empty-response.error";
import type { IConfigService } from "@/modules/config";
import { TOKENS } from "@/tokens";
import type { ILLMClient } from "./llm-client.interface";

@injectable()
export class OpenAICompatibleClient implements ILLMClient {
  private client: OpenAI;
  private model: string;

  constructor(@inject(TOKENS.Config) config: IConfigService) {
    this.model = config.llmModel;
    this.client = new OpenAI({ apiKey: config.llmApiKey, baseURL: config.llmBaseUrl || undefined });
  }

  async generateJson(systemPrompt: string, userPrompt: string): Promise<unknown> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });
    const content = response.choices[0].message.content;

    if (!content) {
      throw new LlmEmptyResponseError();
    }

    return JSON.parse(content);
  }
}
