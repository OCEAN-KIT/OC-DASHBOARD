import fs from "node:fs/promises";
import path from "node:path";

import { loadProjectEnv } from "./env";

export async function loadDevlogTemplate() {
  const { repoRoot } = loadProjectEnv();
  const templatePath = path.join(repoRoot, "docs", "devlog-template.md");
  const template = await fs.readFile(templatePath, "utf8");

  return {
    templatePath,
    template,
  };
}
