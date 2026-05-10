import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import { AIParser } from "./ai-parser";
import type { IAIParser } from "./ai-parser.interface";

export const aiModule = new ContainerModule((bind) => {
  bind<IAIParser>(TOKENS.AIParser).to(AIParser).inSingletonScope();
});
