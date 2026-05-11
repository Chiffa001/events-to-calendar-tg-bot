import { z } from "zod";

export const envSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN is required"),
  LLM_API_KEY: z.string().min(1, "LLM_API_KEY is required"),
  LLM_MODEL: z.string().default("deepseek-chat"),
  LLM_BASE_URL: z.string().default("https://api.deepseek.com"),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_REFRESH_TOKEN: z.string().min(1, "GOOGLE_REFRESH_TOKEN is required"),
  GOOGLE_CALENDAR_ID: z.string().default("primary"),
  DEFAULT_TIMEZONE: z.string().default("Europe/Moscow"),
  ALLOWED_USER_IDS: z.string().default(""),
});

export type Env = z.infer<typeof envSchema>;
