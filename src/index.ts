import "reflect-metadata";
import "dotenv/config";
import { Bot } from "grammy";
import { createContainer } from "@/container";
import type { IBotHandler } from "@/modules/bot";
import type { IConfigService } from "@/modules/config";
import type { ILogger } from "@/modules/logger";
import { TOKENS } from "@/tokens";

const container = createContainer();
const config = container.get<IConfigService>(TOKENS.Config);
const handlers = container.get<IBotHandler>(TOKENS.BotHandlers);
const logger = container.get<ILogger>(TOKENS.Logger);

const bot = new Bot(config.telegramBotToken);
handlers.register(bot);

async function main() {
  await bot.api.setMyCommands([
    { command: "start", description: "Начать работу с ботом" },
    { command: "help", description: "Как описывать события" },
  ]);
  bot.start();
  logger.info("Bot started");
}

main().catch(console.error);
