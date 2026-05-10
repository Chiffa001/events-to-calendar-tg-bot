import type { Bot } from "grammy";
import { inject, injectable } from "inversify";
import { CalendarParseError } from "@/errors/calendar-parse.error";
import { ForbiddenError } from "@/errors/forbidden.error";
import { NotAnEventError } from "@/errors/not-an-event.error";
import type { IAIParser } from "@/modules/ai";
import type { ICalendarService } from "@/modules/calendar";
import type { IConfigService } from "@/modules/config";
import type { ILogger } from "@/modules/logger";
import { TOKENS } from "@/tokens";
import type { IBotHandler } from "./bot-handler.interface";

@injectable()
export class BotHandler implements IBotHandler {
  constructor(
    @inject(TOKENS.AIParser) private aiParser: IAIParser,
    @inject(TOKENS.CalendarService) private calendarService: ICalendarService,
    @inject(TOKENS.Config) private config: IConfigService,
    @inject(TOKENS.Logger) private logger: ILogger,
  ) {}

  register(bot: Bot): void {
    bot.command("start", (ctx) =>
      ctx.reply(
        "Привет! Отправь мне описание мероприятия, и я добавлю его в Google Календарь.\n\n" +
          "Я понимаю любой формат — просто опиши событие своими словами. " +
          "Место встречи может быть:\n" +
          "• текстом — «кафе Ромашка, ул. Ленина 5»\n" +
          "• ссылкой на Google Maps\n" +
          "• ссылкой на звонок (Google Meet, Zoom, Teams и др.)\n\n" +
          "Примеры:\n" +
          "«Встреча с командой завтра в 15:00, конференц-зал A»\n" +
          "«Созвон в пятницу в 11:00 https://meet.google.com/xxx-yyyy-zzz»\n" +
          "«Вебинар 20 мая в 19:00, описание: про стартапы, https://zoom.us/j/123456»",
        { parse_mode: "HTML" },
      ),
    );

    bot.command("help", (ctx) =>
      ctx.reply(
        "Напиши описание события в свободной форме — я распознаю название, дату, время и место.\n\n" +
          "<b>Поддерживаемые форматы места:</b>\n" +
          "• Текстовый адрес: «ул. Пушкина, д. 10»\n" +
          "• Ссылка Google Maps\n" +
          "• Ссылка на онлайн-встречу: Google Meet, Zoom, Teams, Webex и др.\n\n" +
          "Можно указать и физическое место, и ссылку на звонок одновременно.",
        { parse_mode: "HTML" },
      ),
    );

    bot.on("message:text", async (ctx) => {
      const userId = ctx.from.id;
      const username = ctx.from.username ?? ctx.from.first_name ?? String(userId);
      const preview = ctx.message.text.slice(0, 80).replace(/\n/g, " ");
      this.logger.info(`message from @${username}: "${preview}"`, { userId });

      const status = await ctx.reply("Анализирую сообщение...");
      try {
        if (!this.isAllowed(userId)) {
          throw new ForbiddenError(userId);
        }
        const event = await this.aiParser.parseEvent(ctx.message.text);
        this.logger.info(`parsed: "${event.title}" at ${event.start_datetime.toISOString()}`, {
          userId,
        });

        const link = await this.calendarService.addEvent(event, this.config.googleCalendarId);
        this.logger.info(`event created: ${link}`, { userId });

        const fmt = (d: Date) =>
          d.toLocaleString("ru-RU", {
            timeZone: event.timezone,
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

        let text =
          `Событие добавлено в календарь!\n\n` +
          `<b>${event.title}</b>\n` +
          `Начало: ${fmt(event.start_datetime)}\n` +
          `Конец: ${fmt(event.end_datetime)}`;
        if (event.location) {
          text += `\nМесто: ${event.location}`;
        }
        if (event.meeting_url) {
          text += `\nСсылка: <a href="${event.meeting_url}">${event.meeting_url}</a>`;
        }
        if (event.description) {
          text += `\nОписание: ${event.description}`;
        }
        if (link) {
          text += `\n\n<a href="${link}">Открыть в Google Календаре</a>`;
        }

        await ctx.api.editMessageText(ctx.chat.id, status.message_id, text, {
          parse_mode: "HTML",
        });
      } catch (err) {
        if (err instanceof ForbiddenError) {
          this.logger.warn("access denied", { userId });
          await ctx.api.editMessageText(
            ctx.chat.id,
            status.message_id,
            "У вас нет доступа к этому боту.",
          );
        } else if (err instanceof NotAnEventError) {
          this.logger.info("rejected: not an event", { userId });
          await ctx.api.editMessageText(
            ctx.chat.id,
            status.message_id,
            "Это не похоже на описание мероприятия — не могу добавить в календарь.\n\n" +
              "Опиши событие с названием, датой и временем. Например: «Встреча с командой завтра в 15:00»",
          );
        } else if (err instanceof CalendarParseError) {
          this.logger.warn("parse error", { userId, error: (err as Error).message });
          await ctx.api.editMessageText(
            ctx.chat.id,
            status.message_id,
            "Не удалось распознать событие. Попробуй описать его подробнее: укажи название, дату и время.",
          );
        } else {
          this.logger.error("unexpected error", err, { userId });
          await ctx.api.editMessageText(
            ctx.chat.id,
            status.message_id,
            "Произошла ошибка. Попробуй ещё раз позже.",
          );
        }
      }
    });
  }

  private isAllowed(userId: number): boolean {
    return this.config.allowedUserIds.size === 0 || this.config.allowedUserIds.has(userId);
  }
}
