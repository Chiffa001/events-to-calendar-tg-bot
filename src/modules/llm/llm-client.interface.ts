export interface ILLMClient {
  generateJson(systemPrompt: string, userPrompt: string): Promise<unknown>;
}
