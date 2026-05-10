import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import type { ILogger } from "./logger.interface";
import { ConsoleLogger } from "./logger.service";

export const loggerModule = new ContainerModule((bind) => {
  bind<ILogger>(TOKENS.Logger).to(ConsoleLogger).inSingletonScope();
});
