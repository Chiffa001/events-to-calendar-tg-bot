import "reflect-metadata";
import { Container } from "inversify";
import { aiModule } from "@/modules/ai";
import { botModule } from "@/modules/bot";
import { calendarModule } from "@/modules/calendar";
import { configModule } from "@/modules/config";
import { eventModule } from "@/modules/event";
import { llmModule } from "@/modules/llm";
import { loggerModule } from "@/modules/logger";

export function createContainer(): Container {
  const container = new Container();
  container.load(
    loggerModule,
    configModule,
    llmModule,
    eventModule,
    aiModule,
    calendarModule,
    botModule,
  );
  return container;
}
