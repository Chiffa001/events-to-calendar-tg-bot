# tg-calendar-ai

Telegram-бот, который принимает текстовое описание события на естественном языке и автоматически добавляет его в Google Календарь через AI-парсинг.

## Как работает бот

Отправьте боту сообщение в свободной форме:

```
Встреча с командой завтра в 15:00, конференц-зал A
```

Бот распознает дату, время и место, создаст событие в Google Календаре и вернёт ссылку на него.

**Поддерживаемые форматы описаний:**
- `Созвон с Андреем в пятницу в 11 утра`
- `Стоматолог 20 мая в 14:30, ул. Ленина 5`
- `День рождения Маши 3 июня, весь день`
- `Ежеквартальный отчёт послезавтра с 10 до 12`

**Команды:**
- `/start` — приветствие и краткая инструкция
- `/help` — как описывать события

## Стек

- **Runtime:** Node.js + TypeScript
- **Telegram:** [grammY](https://grammy.dev)
- **AI:** любой OpenAI-совместимый API (DeepSeek, OpenAI, Groq, OpenRouter и др.)
- **Календарь:** Google Calendar API
- **DI:** [InversifyJS](https://inversify.io) + reflect-metadata
- **Валидация:** Zod

## Требования

- Node.js 20+
- Аккаунт в Google Cloud с включённым Calendar API
- API-ключ любого OpenAI-совместимого LLM-провайдера
- Telegram-бот, созданный через [@BotFather](https://t.me/BotFather)

## Установка

```bash
git clone <repo>
cd tg-calendar-ai
npm install
make setup        # создаёт .env и папку credentials/
```

## Настройка

### 1. Telegram Bot Token

Создайте бота через [@BotFather](https://t.me/BotFather), скопируйте токен в `.env`:

```env
TELEGRAM_BOT_TOKEN=123456789:AAF...
```

### 2. LLM-провайдер

Бот работает с любым OpenAI-совместимым API. Укажите в `.env`:

| Провайдер  | `LLM_BASE_URL`                        | Пример модели              |
|------------|---------------------------------------|----------------------------|
| DeepSeek   | `https://api.deepseek.com`            | `deepseek-chat`            |
| OpenAI     | _(оставить пустым)_                   | `gpt-4o-mini`              |
| Groq       | `https://api.groq.com/openai/v1`      | `llama-3.3-70b-versatile`  |
| OpenRouter | `https://openrouter.ai/api/v1`        | `openai/gpt-4o-mini`       |

```env
LLM_API_KEY=sk-...
LLM_MODEL=deepseek-chat
LLM_BASE_URL=https://api.deepseek.com
```

### 3. Google Calendar API

1. Откройте [Google Cloud Console](https://console.cloud.google.com)
2. Создайте проект, включите **Google Calendar API**
3. Создайте OAuth 2.0 credentials (тип: *Desktop application*)
4. Добавьте `http://localhost:3000` в список разрешённых redirect URI
5. Скопируйте **Client ID** и **Client Secret** в `.env`:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALENDAR_ID=primary   # или ID конкретного календаря
```

6. Запустите одноразовый скрипт авторизации:

```bash
make auth
```

Скрипт откроет URL в терминале — перейдите по нему в браузере, подтвердите доступ. После этого в терминале появится строка — добавьте её в `.env`:

```env
GOOGLE_REFRESH_TOKEN=...
```

Refresh-токен не истекает, повторная авторизация не нужна.

### 4. Ограничение доступа (опционально)

Чтобы бот отвечал только определённым пользователям, укажите их Telegram ID через запятую:

```env
ALLOWED_USER_IDS=123456789,987654321
```

Оставьте пустым, чтобы разрешить доступ всем.

## Запуск

```bash
# Разработка (hot reload, ts-node)
npm run dev

# Продакшн (компиляция + запуск собранного бандла)
npm run build
npm run start:prod
```

## Структура проекта

```
src/
├── errors/               # Кастомные классы ошибок
├── modules/
│   ├── ai/               # Парсер событий из текста (AIParser)
│   ├── bot/              # Telegram-хендлеры
│   ├── calendar/         # Google Calendar API (GoogleCalendarService)
│   ├── config/           # Конфигурация с Zod-валидацией
│   ├── event/            # Схема CalendarEvent и EventFactory
│   └── llm/              # LLM-клиент (OpenAI-совместимый)
├── tokens.ts             # DI-символы
├── container.ts          # Сборка DI-контейнера
└── index.ts              # Точка входа
```
