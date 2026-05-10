import { ContainerModule } from "inversify";
import { TOKENS } from "@/tokens";
import { GoogleCalendarService } from "./google-calendar.service";
import type { ICalendarService } from "./google-calendar.service.interface";

export const calendarModule = new ContainerModule((bind) => {
  bind<ICalendarService>(TOKENS.CalendarService).to(GoogleCalendarService).inSingletonScope();
});
