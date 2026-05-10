import type { Bot } from "grammy";

export interface IBotHandler {
  register(bot: Bot): void;
}
