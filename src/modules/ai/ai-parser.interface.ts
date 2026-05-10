import type { ICalendarEvent } from "@/modules/event";

export interface IAIParser {
  parseEvent(text: string): Promise<ICalendarEvent>;
}
