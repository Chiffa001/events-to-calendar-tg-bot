import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import { OpenAICompatibleClient } from "./llm-client";
import type { ILLMClient } from "./llm-client.interface";

export const llmModule = new ContainerModule((bind) => {
  bind<ILLMClient>(TOKENS.LLMClient).to(OpenAICompatibleClient).inSingletonScope();
});
