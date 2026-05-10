import { inject, injectable } from "inversify";
import { NotAnEventError } from "@/errors/not-an-event.error";
import type { ICalendarEvent, IEventFactory } from "@/modules/event";
import type { ILLMClient } from "@/modules/llm";
import type { ILogger } from "@/modules/logger";
import { TOKENS } from "@/tokens";
import type { IAIParser } from "./ai-parser.interface";

const SYSTEM_PROMPT = `You are an assistant that extracts calendar event information from text messages.

First, decide if the message describes a calendar event (meeting, appointment, call, reminder, deadline, etc.).
Always include the field:
- is_event (boolean, required): true if the message describes an event, false otherwise

If is_event is false, return ONLY {"is_event": false}.

If is_event is true, also include:
- title (string, required): event name
- description (string, optional): additional event details or notes (do NOT put location/meeting links here)
- start_datetime (string, required): ISO 8601 format (e.g. "2024-01-15T14:00:00")
- end_datetime (string, required): ISO 8601 format
- location (string, optional): physical location — either a plain text address (e.g. "кафе Ромашка, ул. Ленина 5") OR a Google Maps URL; if both are present, use ONLY the URL
- meeting_url (string, optional): online meeting link — any URL for a video call (meet.google.com, zoom.us, teams.microsoft.com, webex.com, etc.)
- timezone (string, default "Europe/Moscow"): IANA timezone name

Rules for location vs meeting_url:
- If the message contains a Google Maps link → put ONLY the raw URL in "location" (no surrounding text)
- If the message contains an online meeting/call URL → put it in "meeting_url"
- If the message contains a plain address with no map link → put it in "location"
- Both "location" and "meeting_url" can be present at the same time (e.g. physical venue + online stream)

If no year is specified, assume the current year. If no end time, assume 1 hour after start.
Return ONLY valid JSON, no explanation.`;

@injectable()
export class AIParser implements IAIParser {
  constructor(
    @inject(TOKENS.LLMClient) private llmClient: ILLMClient,
    @inject(TOKENS.EventFactory) private eventFactory: IEventFactory,
    @inject(TOKENS.Logger) private logger: ILogger,
  ) {}

  async parseEvent(text: string): Promise<ICalendarEvent> {
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    let data: unknown;
    try {
      data = await this.llmClient.generateJson(
        SYSTEM_PROMPT,
        `Current date/time: ${now}\n\nMessage: ${text}`,
      );
    } catch (err) {
      this.logger.error("LLM request failed", err);
      throw err;
    }
    if ((data as Record<string, unknown>).is_event === false) {
      throw new NotAnEventError();
    }
    try {
      return this.eventFactory.fromRaw(data);
    } catch (err) {
      this.logger.error("Event schema validation failed", err);
      throw err;
    }
  }
}
