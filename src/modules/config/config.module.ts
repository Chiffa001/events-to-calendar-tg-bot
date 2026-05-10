import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import { ConfigService } from "./config.service";
import type { IConfigService } from "./config.service.interface";

export const configModule = new ContainerModule((bind) => {
  bind<IConfigService>(TOKENS.Config).to(ConfigService).inSingletonScope();
});
