export interface ICalendarEvent {
  title: string;
  description?: string;
  start_datetime: Date;
  end_datetime: Date;
  location?: string;
  meeting_url?: string;
  timezone: string;
}

export interface IEventFactory {
  fromRaw(data: unknown): ICalendarEvent;
}
