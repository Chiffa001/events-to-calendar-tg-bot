import type { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { inject, injectable } from "inversify";
import type { IConfigService } from "@/modules/config";
import type { ICalendarEvent } from "@/modules/event";
import type { ILogger } from "@/modules/logger";
import { TOKENS } from "@/tokens";
import type { ICalendarService } from "./google-calendar.service.interface";

function buildDescription(description?: string, meetingUrl?: string): string | undefined {
  const parts: string[] = [];

  if (description) {
    parts.push(description);
  }

  if (meetingUrl) {
    parts.push(`Ссылка на встречу: ${meetingUrl}`);
  }

  return parts.length > 0 ? parts.join("\n\n") : undefined;
}

@injectable()
export class GoogleCalendarService implements ICalendarService {
  private oAuth2Client: OAuth2Client | null = null;

  constructor(
    @inject(TOKENS.Config) private config: IConfigService,
    @inject(TOKENS.Logger) private logger: ILogger,
  ) {}

  private getAuth(): OAuth2Client {
    if (this.oAuth2Client) {
      return this.oAuth2Client;
    }

    const client = new google.auth.OAuth2(
      this.config.googleClientId,
      this.config.googleClientSecret,
    );
    client.setCredentials({ refresh_token: this.config.googleRefreshToken });
    this.oAuth2Client = client;
    return client;
  }

  async addEvent(event: ICalendarEvent, calendarId = "primary"): Promise<string> {
    try {
      const auth = this.getAuth();
      const calendar = google.calendar({ version: "v3", auth });
      const { data } = await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: event.title,
          description: buildDescription(event.description, event.meeting_url),
          location: event.location ?? event.meeting_url ?? undefined,
          start: {
            dateTime: event.start_datetime.toISOString().slice(0, 19),
            timeZone: event.timezone,
          },
          end: {
            dateTime: event.end_datetime.toISOString().slice(0, 19),
            timeZone: event.timezone,
          },
        },
      });
      return data.htmlLink ?? "";
    } catch (err) {
      this.logger.error("Google Calendar API error", err, { calendarId, title: event.title });
      throw err;
    }
  }
}
