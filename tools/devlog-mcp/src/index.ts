import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import { collectWorkContext } from "./git";
import { appendProjectDevlog, validateNotionTarget } from "./notion";
import { loadDevlogTemplate } from "./template";
import { sha256, toErrorToolResult, toTextToolResult } from "./utils";

const server = new McpServer({
  name: "piuda-devlog",
  version: "0.1.0",
});
const targetTypeSchema = z.enum(["parent_page", "data_source"]);
const bootstrapActionSchema = z.enum([
  "used_existing_data_source",
  "created_database",
  "created_daily_page",
  "appended_existing_daily_page",
]);

server.registerTool(
  "collect_work_context",
  {
    description:
      "현재 브랜치의 merge-base 이후 커밋과 working tree 변경사항을 수집해 개발일지 초안 작성에 필요한 Git 컨텍스트를 반환합니다.",
    inputSchema: {
      maxCommits: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe("수집할 최대 커밋 수. 기본값은 20입니다."),
      maxDiffChars: z
        .number()
        .int()
        .min(1000)
        .max(50000)
        .optional()
        .describe("diff excerpt 최대 문자 수. 기본값은 12000입니다."),
    },
    outputSchema: {
      ok: z.boolean(),
      repoRoot: z.string(),
      branchName: z.string(),
      headSha: z.string(),
      headShortSha: z.string(),
      baseRef: z.string().nullable(),
      mergeBase: z.string(),
      defaultHeading: z.string(),
      commits: z.array(
        z.object({
          sha: z.string(),
          shortSha: z.string(),
          author: z.string(),
          date: z.string(),
          subject: z.string(),
        }),
      ),
      statusEntries: z.array(
        z.object({
          code: z.string(),
          path: z.string(),
        }),
      ),
      committedFiles: z.array(
        z.object({
          status: z.string(),
          path: z.string(),
          nextPath: z.string().optional(),
        }),
      ),
      stagedFiles: z.array(
        z.object({
          status: z.string(),
          path: z.string(),
          nextPath: z.string().optional(),
        }),
      ),
      unstagedFiles: z.array(
        z.object({
          status: z.string(),
          path: z.string(),
          nextPath: z.string().optional(),
        }),
      ),
      untrackedFiles: z.array(z.string()),
      changedFiles: z.array(z.string()),
      committedDiffStat: z.string(),
      stagedDiffStat: z.string(),
      unstagedDiffStat: z.string(),
      committedDiffExcerpt: z.string(),
      stagedDiffExcerpt: z.string(),
      unstagedDiffExcerpt: z.string(),
      error: z.string().optional(),
    },
  },
  async ({ maxCommits, maxDiffChars }) => {
    try {
      const { workContext, text } = await collectWorkContext({
        maxCommits,
        maxDiffChars,
      });

      return toTextToolResult(text, {
        ok: true,
        ...workContext,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Git 컨텍스트 수집에 실패했습니다.";

      return toErrorToolResult(message, {
        ok: false,
        repoRoot: "",
        branchName: "",
        headSha: "",
        headShortSha: "",
        baseRef: null,
        mergeBase: "",
        defaultHeading: "",
        commits: [],
        statusEntries: [],
        committedFiles: [],
        stagedFiles: [],
        unstagedFiles: [],
        untrackedFiles: [],
        changedFiles: [],
        committedDiffStat: "",
        stagedDiffStat: "",
        unstagedDiffStat: "",
        committedDiffExcerpt: "",
        stagedDiffExcerpt: "",
        unstagedDiffExcerpt: "",
        error: message,
      });
    }
  },
);

server.registerTool(
  "load_devlog_template",
  {
    description:
      "저장소의 개발일지 템플릿을 읽어 문서 초안 작성용 템플릿 원문을 반환합니다.",
    outputSchema: {
      ok: z.boolean(),
      templatePath: z.string(),
      template: z.string(),
      error: z.string().optional(),
    },
  },
  async () => {
    try {
      const { templatePath, template } = await loadDevlogTemplate();
      return toTextToolResult(template, {
        ok: true,
        templatePath,
        template,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "템플릿 로드에 실패했습니다.";

      return toErrorToolResult(message, {
        ok: false,
        templatePath: "",
        template: "",
        error: message,
      });
    }
  },
);

server.registerTool(
  "validate_notion_target",
  {
    description:
      "Notion API 토큰과 부모 프로젝트 페이지/devlog data source/오늘 페이지 해석 가능 여부를 점검합니다.",
    outputSchema: {
      ok: z.boolean(),
      configured: z.boolean(),
      pageId: z.string().nullable(),
      pageTitle: z.string().nullable(),
      pageUrl: z.string().nullable(),
      canReadContent: z.boolean(),
      updateCapabilityHint: z.string(),
      details: z.string(),
      targetType: targetTypeSchema,
      databaseId: z.string().nullable(),
      dataSourceId: z.string().nullable(),
      databaseTitle: z.string().nullable(),
      dailyPageId: z.string().nullable(),
      dailyPageTitle: z.string().nullable(),
      bootstrapAction: bootstrapActionSchema.nullable().optional(),
    },
  },
  async () => {
    const validation = await validateNotionTarget();
    const text = [
      `configured: ${validation.configured}`,
      `pageId: ${validation.pageId ?? "N/A"}`,
      `pageTitle: ${validation.pageTitle ?? "N/A"}`,
      `pageUrl: ${validation.pageUrl ?? "N/A"}`,
      `targetType: ${validation.targetType}`,
      `databaseId: ${validation.databaseId ?? "N/A"}`,
      `dataSourceId: ${validation.dataSourceId ?? "N/A"}`,
      `databaseTitle: ${validation.databaseTitle ?? "N/A"}`,
      `dailyPageId: ${validation.dailyPageId ?? "N/A"}`,
      `dailyPageTitle: ${validation.dailyPageTitle ?? "N/A"}`,
      `canReadContent: ${validation.canReadContent}`,
      `bootstrapAction: ${validation.bootstrapAction ?? "N/A"}`,
      `details: ${validation.details}`,
      `hint: ${validation.updateCapabilityHint}`,
    ].join("\n");

    if (!validation.ok) {
      return toErrorToolResult(text, validation);
    }

    return toTextToolResult(text, validation);
  },
);

server.registerTool(
  "append_project_devlog",
  {
    description:
      "검토가 끝난 개발일지 markdown을 오늘의 devlog 페이지에 누적합니다. 필요하면 data source와 오늘 페이지를 자동 생성합니다.",
    inputSchema: {
      heading: z
        .string()
        .min(1)
        .describe("예: ## 2026-03-18 19:10 | feature/foo | abc1234"),
      markdown: z.string().min(1).describe("Notion에 append할 markdown 본문"),
      previewHash: z
        .string()
        .optional()
        .describe("미리보기 본문의 sha256 해시. 있으면 append 전 일치 여부를 검증합니다."),
    },
    outputSchema: {
      ok: z.boolean(),
      pageId: z.string().nullable(),
      pageUrl: z.string().nullable(),
      heading: z.string(),
      appendedCharacters: z.number(),
      resultMarkdownLength: z.number(),
      details: z.string(),
      targetType: targetTypeSchema,
      databaseId: z.string().nullable(),
      dataSourceId: z.string().nullable(),
      databaseTitle: z.string().nullable(),
      dailyPageId: z.string().nullable(),
      dailyPageTitle: z.string().nullable(),
      bootstrapAction: bootstrapActionSchema.nullable(),
    },
  },
  async ({ heading, markdown, previewHash }) => {
    const result = await appendProjectDevlog({
      heading,
      markdown,
      previewHash,
    });

    const payloadPreview = `${heading.trim()}\n\n${markdown.trim()}\n`;
    const text = [
      `ok: ${result.ok}`,
      `pageId: ${result.pageId ?? "N/A"}`,
      `pageUrl: ${result.pageUrl ?? "N/A"}`,
      `targetType: ${result.targetType}`,
      `databaseId: ${result.databaseId ?? "N/A"}`,
      `dataSourceId: ${result.dataSourceId ?? "N/A"}`,
      `databaseTitle: ${result.databaseTitle ?? "N/A"}`,
      `dailyPageId: ${result.dailyPageId ?? "N/A"}`,
      `dailyPageTitle: ${result.dailyPageTitle ?? "N/A"}`,
      `bootstrapAction: ${result.bootstrapAction ?? "N/A"}`,
      `heading: ${result.heading}`,
      `appendedCharacters: ${result.appendedCharacters}`,
      `resultMarkdownLength: ${result.resultMarkdownLength}`,
      `payloadHash: ${sha256(payloadPreview)}`,
      `details: ${result.details}`,
    ].join("\n");

    if (!result.ok) {
      return toErrorToolResult(text, result);
    }

    return toTextToolResult(text, result);
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("piuda-devlog MCP server running on stdio");
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "piuda-devlog MCP server failed",
  );
  process.exit(1);
});
