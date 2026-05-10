import { z } from "zod";

export const CalendarEventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  start_datetime: z.string().transform((s) => new Date(s)),
  end_datetime: z.string().transform((s) => new Date(s)),
  location: z.string().optional(),
  meeting_url: z.string().optional(),
  timezone: z.string().default("Europe/Moscow"),
});
