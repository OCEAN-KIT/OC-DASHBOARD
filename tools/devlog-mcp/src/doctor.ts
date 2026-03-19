import { collectWorkContext, inspectGitWorkspace } from "./git";
import { validateNotionTarget } from "./notion";

function printSection(title: string, lines: string[]) {
  console.log(`\n[${title}]`);
  lines.forEach((line) => console.log(line));
}

async function main() {
  try {
    const gitWorkspace = await inspectGitWorkspace();
    const notionTarget = await validateNotionTarget();
    const { workContext } = await collectWorkContext({ maxCommits: 5, maxDiffChars: 2000 });

    printSection("Git", [
      `repoRoot: ${gitWorkspace.repoRoot}`,
      `branch: ${gitWorkspace.branchName}`,
      `head: ${gitWorkspace.headShortSha}`,
      `baseRef: ${gitWorkspace.baseRef ?? "N/A"}`,
      `mergeBase: ${gitWorkspace.mergeBase}`,
      `changedFiles: ${workContext.changedFiles.length}`,
    ]);

    printSection("Notion", [
      `configured: ${notionTarget.configured}`,
      `pageId: ${notionTarget.pageId ?? "N/A"}`,
      `pageTitle: ${notionTarget.pageTitle ?? "N/A"}`,
      `pageUrl: ${notionTarget.pageUrl ?? "N/A"}`,
      `targetType: ${notionTarget.targetType}`,
      `databaseId: ${notionTarget.databaseId ?? "N/A"}`,
      `dataSourceId: ${notionTarget.dataSourceId ?? "N/A"}`,
      `databaseTitle: ${notionTarget.databaseTitle ?? "N/A"}`,
      `dailyPageId: ${notionTarget.dailyPageId ?? "N/A"}`,
      `dailyPageTitle: ${notionTarget.dailyPageTitle ?? "N/A"}`,
      `canReadContent: ${notionTarget.canReadContent}`,
      `bootstrapAction: ${notionTarget.bootstrapAction ?? "N/A"}`,
      `details: ${notionTarget.details}`,
      `hint: ${notionTarget.updateCapabilityHint}`,
    ]);

    if (!notionTarget.ok) {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : "mcp:devlog:doctor 실행 실패",
    );
    process.exitCode = 1;
  }
}

main();
