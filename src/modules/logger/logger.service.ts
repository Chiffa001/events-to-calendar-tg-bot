import { injectable } from "inversify";
import type { ILogger } from "./logger.interface";

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const BOLD = "\x1b[1m";

const LEVEL_STYLE: Record<string, string> = {
  INFO: CYAN,
  WARN: YELLOW,
  ERROR: RED + BOLD,
};

@injectable()
export class ConsoleLogger implements ILogger {
  info(message: string, context?: Record<string, unknown>): void {
    console.log(this.format("INFO", message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(this.format("WARN", message, context));
  }

  error(message: string, err?: unknown, context?: Record<string, unknown>): void {
    console.error(this.format("ERROR", message, context));
    if (err) {
      console.error(err);
    }
  }

  private format(level: string, message: string, context?: Record<string, unknown>): string {
    const ts = new Date().toISOString();
    const ctx = context
      ? " " +
        Object.entries(context)
          .map(([k, v]) => `${DIM}${k}=${v}${RESET}`)
          .join(" ")
      : "";
    const color = LEVEL_STYLE[level] ?? "";
    return `${DIM}[${ts}]${RESET} ${color}${level}${RESET} ${message}${ctx}`;
  }
}
