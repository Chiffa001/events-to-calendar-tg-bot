import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import { EventFactory } from "./event.factory";
import type { IEventFactory } from "./event.factory.interface";

export const eventModule = new ContainerModule((bind) => {
  bind<IEventFactory>(TOKENS.EventFactory).to(EventFactory).inSingletonScope();
});
