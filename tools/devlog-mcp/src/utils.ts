import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
export const DEVLOG_TIME_ZONE = "Asia/Seoul";

export type CommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  { allowFailure = false }: { allowFailure?: boolean } = {},
): Promise<CommandResult> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd,
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });

    return {
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: 0,
    };
  } catch (error) {
    const commandError = error as NodeJS.ErrnoException & {
      code?: number;
      stdout?: string;
      stderr?: string;
    };

    if (!allowFailure) {
      const stderr = commandError.stderr?.trim();
      throw new Error(
        stderr || `${command} ${args.join(" ")} 실행에 실패했습니다.`,
      );
    }

    return {
      stdout: commandError.stdout?.trim() ?? "",
      stderr: commandError.stderr?.trim() ?? "",
      exitCode:
        typeof commandError.code === "number" ? commandError.code : 1,
    };
  }
}

export function truncateText(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;

  const headLength = Math.ceil(maxChars * 0.7);
  const tailLength = Math.floor(maxChars * 0.2);
  const omitted = text.length - headLength - tailLength;

  return [
    text.slice(0, headLength),
    `\n\n... [${omitted} chars omitted] ...\n\n`,
    text.slice(text.length - tailLength),
  ].join("");
}

export function sha256(text: string) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function getTimeZoneDateParts(
  date: Date,
  timeZone = DEVLOG_TIME_ZONE,
) {
  const partEntries = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  })
    .formatToParts(date)
    .filter((part) => part.type !== "literal")
    .map((part) => [part.type, part.value] as const);

  const parts = Object.fromEntries(partEntries);
  return {
    yyyy: parts.year,
    mm: parts.month,
    dd: parts.day,
    hh: parts.hour,
    min: parts.minute,
  };
}

export function formatDateLabel(
  date = new Date(),
  timeZone = DEVLOG_TIME_ZONE,
) {
  const { yyyy, mm, dd } = getTimeZoneDateParts(date, timeZone);
  return `${yyyy}-${mm}-${dd}`;
}

export function formatNowLabel(
  date = new Date(),
  timeZone = DEVLOG_TIME_ZONE,
) {
  const { yyyy, mm, dd, hh, min } = getTimeZoneDateParts(date, timeZone);
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export function toTextToolResult<T extends object>(
  text: string,
  structuredContent: T,
) {
  return {
    content: [{ type: "text" as const, text }],
    structuredContent,
  };
}

export function toErrorToolResult<T extends object>(
  message: string,
  structuredContent: T,
) {
  return {
    content: [{ type: "text" as const, text: message }],
    structuredContent,
    isError: true,
  };
}
