export interface IConfigService {
  readonly telegramBotToken: string;
  readonly llmApiKey: string;
  readonly llmModel: string;
  readonly llmBaseUrl: string;
  readonly googleClientId: string;
  readonly googleClientSecret: string;
  readonly googleRefreshToken: string;
  readonly googleCalendarId: string;
  readonly allowedUserIds: Set<number>;
}
