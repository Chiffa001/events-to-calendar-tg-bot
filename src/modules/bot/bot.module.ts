import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import { BotHandler } from "./bot-handler";
import type { IBotHandler } from "./bot-handler.interface";

export const botModule = new ContainerModule((bind) => {
  bind<IBotHandler>(TOKENS.BotHandlers).to(BotHandler).inSingletonScope();
});
