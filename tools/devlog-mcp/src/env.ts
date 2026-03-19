import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

type LoadedEnv = {
  repoRoot: string;
  notionApiKey: string | null;
  notionProjectPageId: string | null;
  notionDevlogDataSourceId: string | null;
};

let cachedEnv: LoadedEnv | null = null;

function hasRepoMarker(dir: string) {
  return fs.existsSync(path.join(dir, ".git"));
}

export function resolveRepoRoot(startDir = process.cwd()) {
  let current = path.resolve(startDir);

  while (true) {
    if (hasRepoMarker(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(
        `Git repository root를 찾지 못했습니다. 시작 경로: ${startDir}`,
      );
    }
    current = parent;
  }
}

export function loadProjectEnv(startDir = process.cwd()) {
  if (cachedEnv) return cachedEnv;

  const repoRoot = resolveRepoRoot(startDir);

  dotenv.config({ path: path.join(repoRoot, ".env.local"), quiet: true });
  dotenv.config({ path: path.join(repoRoot, ".env"), quiet: true });

  cachedEnv = {
    repoRoot,
    notionApiKey: process.env.NOTION_API_KEY?.trim() || null,
    notionProjectPageId: process.env.NOTION_PROJECT_PAGE_ID?.trim() || null,
    notionDevlogDataSourceId:
      process.env.NOTION_DEVLOG_DATA_SOURCE_ID?.trim() || null,
  };

  return cachedEnv;
}
