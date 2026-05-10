import type { ICalendarEvent } from "@/modules/event";

export interface ICalendarService {
  addEvent(event: ICalendarEvent, calendarId?: string): Promise<string>;
}
