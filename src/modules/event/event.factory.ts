import { injectable } from "inversify";
import { ZodError } from "zod";
import { CalendarParseError } from "@/errors/calendar-parse.error";
import type { ICalendarEvent, IEventFactory } from "./event.factory.interface";
import { CalendarEventSchema } from "./event.schema";

@injectable()
export class EventFactory implements IEventFactory {
  fromRaw(data: unknown): ICalendarEvent {
    try {
      return CalendarEventSchema.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new CalendarParseError(`Invalid event data: ${err.message}`);
      }
      throw err;
    }
  }
}
