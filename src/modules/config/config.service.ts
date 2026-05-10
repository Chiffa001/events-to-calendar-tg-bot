import { injectable } from "inversify";
import { type Env, envSchema } from "./config.schema";
import type { IConfigService } from "./config.service.interface";

@injectable()
export class ConfigService implements IConfigService {
  private readonly env: Env;
  private readonly _allowedUserIds: Set<number>;

  constructor() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`);
      throw new Error(`Config validation failed:\n${messages.join("\n")}`);
    }
    this.env = result.data;
    this._allowedUserIds = new Set(
      this.env.ALLOWED_USER_IDS.split(",").filter(Boolean).map(Number),
    );
  }

  get telegramBotToken(): string {
    return this.env.TELEGRAM_BOT_TOKEN;
  }

  get llmApiKey(): string {
    return this.env.LLM_API_KEY;
  }

  get llmModel(): string {
    return this.env.LLM_MODEL;
  }

  get llmBaseUrl(): string {
    return this.env.LLM_BASE_URL;
  }

  get googleClientId(): string {
    return this.env.GOOGLE_CLIENT_ID;
  }

  get googleClientSecret(): string {
    return this.env.GOOGLE_CLIENT_SECRET;
  }

  get googleRefreshToken(): string {
    return this.env.GOOGLE_REFRESH_TOKEN;
  }

  get googleCalendarId(): string {
    return this.env.GOOGLE_CALENDAR_ID;
  }

  get allowedUserIds(): Set<number> {
    return this._allowedUserIds;
  }
}
