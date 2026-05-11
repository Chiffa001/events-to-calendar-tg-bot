import { z } from "zod";

export const CalendarEventSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  start_datetime: z.string().transform((s) => new Date(s)),
  end_datetime: z.string().transform((s) => new Date(s)),
  location: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  meeting_url: z
    .string()
    .nullish()
    .transform((v) => v ?? undefined),
  timezone: z.string().default("Europe/Moscow"),
});
