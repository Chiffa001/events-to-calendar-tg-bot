export class LlmEmptyResponseError extends Error {
  constructor() {
    super("LLM returned empty content");
  }
}
