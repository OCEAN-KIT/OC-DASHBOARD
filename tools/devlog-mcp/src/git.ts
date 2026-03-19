import { loadProjectEnv } from "./env";
import { formatNowLabel, runCommand, truncateText } from "./utils";

export type GitCommit = {
  sha: string;
  shortSha: string;
  author: string;
  date: string;
  subject: string;
};

export type GitFileChange = {
  status: string;
  path: string;
  nextPath?: string;
};

export type GitStatusEntry = {
  code: string;
  path: string;
};

export type WorkContext = {
  repoRoot: string;
  branchName: string;
  headSha: string;
  headShortSha: string;
  baseRef: string | null;
  mergeBase: string;
  defaultHeading: string;
  commits: GitCommit[];
  statusEntries: GitStatusEntry[];
  committedFiles: GitFileChange[];
  stagedFiles: GitFileChange[];
  unstagedFiles: GitFileChange[];
  untrackedFiles: string[];
  changedFiles: string[];
  committedDiffStat: string;
  stagedDiffStat: string;
  unstagedDiffStat: string;
  committedDiffExcerpt: string;
  stagedDiffExcerpt: string;
  unstagedDiffExcerpt: string;
};

const DEFAULT_BASE_REF_CANDIDATES = [
  "origin/main",
  "main",
  "origin/master",
  "master",
];

async function runGit(
  args: string[],
  { allowFailure = false }: { allowFailure?: boolean } = {},
) {
  const { repoRoot } = loadProjectEnv();
  return runCommand("git", args, repoRoot, { allowFailure });
}

function parseCommitLines(stdout: string) {
  if (!stdout) return [];

  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, shortSha, author, date, subject] = line.split("\u001f");
      return { sha, shortSha, author, date, subject };
    });
}

function parseNameStatus(stdout: string) {
  if (!stdout) return [];

  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [status, path, nextPath] = line.split("\t");
      return {
        status,
        path,
        nextPath,
      };
    });
}

function parseStatusEntries(stdout: string) {
  if (!stdout) return [];

  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const trimmed = line.trimStart();
      const match = trimmed.match(/^(\S+)\s+(.*)$/);

      if (!match) {
        return {
          code: "??",
          path: trimmed,
        };
      }

      return {
        code: match[1] || "??",
        path: match[2].trim(),
      };
    });
}

async function getCurrentBranch() {
  const { stdout } = await runGit(["branch", "--show-current"], {
    allowFailure: true,
  });

  if (stdout) return stdout;

  const head = await runGit(["rev-parse", "--short", "HEAD"]);
  return `detached-${head.stdout}`;
}

async function getDefaultBaseRef() {
  const originHead = await runGit(
    ["symbolic-ref", "--quiet", "--short", "refs/remotes/origin/HEAD"],
    { allowFailure: true },
  );

  if (originHead.stdout) return originHead.stdout;

  for (const candidate of DEFAULT_BASE_REF_CANDIDATES) {
    const exists = await runGit(
      ["rev-parse", "--verify", "--quiet", candidate],
      { allowFailure: true },
    );

    if (exists.exitCode === 0) return candidate;
  }

  return null;
}

async function getMergeBase(baseRef: string | null, headSha: string) {
  if (baseRef) {
    const mergeBase = await runGit(["merge-base", "HEAD", baseRef], {
      allowFailure: true,
    });
    if (mergeBase.stdout) return mergeBase.stdout;
  }

  const rootCommit = await runGit(["rev-list", "--max-parents=0", "HEAD"], {
    allowFailure: true,
  });

  return rootCommit.stdout.split("\n").filter(Boolean).at(0) ?? headSha;
}

function buildChangedFiles(
  committedFiles: GitFileChange[],
  stagedFiles: GitFileChange[],
  unstagedFiles: GitFileChange[],
  untrackedFiles: string[],
) {
  return Array.from(
    new Set([
      ...committedFiles.flatMap((file) =>
        file.nextPath ? [file.path, file.nextPath] : [file.path],
      ),
      ...stagedFiles.flatMap((file) =>
        file.nextPath ? [file.path, file.nextPath] : [file.path],
      ),
      ...unstagedFiles.flatMap((file) =>
        file.nextPath ? [file.path, file.nextPath] : [file.path],
      ),
      ...untrackedFiles,
    ]),
  ).sort();
}

function buildWorkContextText(context: WorkContext) {
  const commits =
    context.commits.length > 0
      ? context.commits
          .map((commit) => `- ${commit.shortSha} ${commit.subject}`)
          .join("\n")
      : "- 새로운 커밋 없음";

  const changedFiles =
    context.changedFiles.length > 0
      ? context.changedFiles.map((file) => `- ${file}`).join("\n")
      : "- 변경 파일 없음";

  const sections = [
    `Branch: ${context.branchName}`,
    `HEAD: ${context.headShortSha}`,
    `Base ref: ${context.baseRef ?? "N/A"}`,
    `Merge base: ${context.mergeBase}`,
    `Default heading: ${context.defaultHeading}`,
    "",
    "[Commits]",
    commits,
    "",
    "[Changed Files]",
    changedFiles,
  ];

  if (context.committedDiffStat) {
    sections.push("", "[Committed Diff Stat]", context.committedDiffStat);
  }

  if (context.stagedDiffStat) {
    sections.push("", "[Staged Diff Stat]", context.stagedDiffStat);
  }

  if (context.unstagedDiffStat) {
    sections.push("", "[Unstaged Diff Stat]", context.unstagedDiffStat);
  }

  if (context.committedDiffExcerpt) {
    sections.push("", "[Committed Diff Excerpt]", context.committedDiffExcerpt);
  }

  if (context.stagedDiffExcerpt) {
    sections.push("", "[Staged Diff Excerpt]", context.stagedDiffExcerpt);
  }

  if (context.unstagedDiffExcerpt) {
    sections.push("", "[Unstaged Diff Excerpt]", context.unstagedDiffExcerpt);
  }

  return sections.join("\n");
}

export async function inspectGitWorkspace() {
  const { repoRoot } = loadProjectEnv();
  const gitDir = await runGit(["rev-parse", "--git-dir"], { allowFailure: true });
  const branchName = await getCurrentBranch();
  const headSha = (await runGit(["rev-parse", "HEAD"])).stdout;
  const baseRef = await getDefaultBaseRef();
  const mergeBase = await getMergeBase(baseRef, headSha);

  return {
    repoRoot,
    gitDir: gitDir.stdout || null,
    branchName,
    headSha,
    headShortSha: headSha.slice(0, 7),
    baseRef,
    mergeBase,
  };
}

export async function collectWorkContext({
  maxCommits = 20,
  maxDiffChars = 12000,
}: {
  maxCommits?: number;
  maxDiffChars?: number;
} = {}) {
  const { repoRoot } = loadProjectEnv();
  const branchName = await getCurrentBranch();
  const headSha = (await runGit(["rev-parse", "HEAD"])).stdout;
  const baseRef = await getDefaultBaseRef();
  const mergeBase = await getMergeBase(baseRef, headSha);

  const commitsRange =
    mergeBase === headSha ? "" : `${mergeBase.trim()}..${headSha.trim()}`;

  const commits = commitsRange
    ? parseCommitLines(
        (
          await runGit([
            "log",
            "--format=%H%x1f%h%x1f%an%x1f%ad%x1f%s",
            "--date=iso-strict",
            "--reverse",
            `--max-count=${Math.max(1, maxCommits)}`,
            commitsRange,
          ])
        ).stdout,
      )
    : [];

  const statusEntries = parseStatusEntries((await runGit(["status", "--short"])).stdout);
  const committedFiles = commitsRange
    ? parseNameStatus((await runGit(["diff", "--name-status", commitsRange])).stdout)
    : [];
  const stagedFiles = parseNameStatus(
    (await runGit(["diff", "--name-status", "--cached"])).stdout,
  );
  const unstagedFiles = parseNameStatus(
    (await runGit(["diff", "--name-status"])).stdout,
  );
  const untrackedFiles = statusEntries
    .filter((entry) => entry.code === "??")
    .map((entry) => entry.path);

  const committedDiffStat = commitsRange
    ? (await runGit(["diff", "--stat", commitsRange])).stdout
    : "";
  const stagedDiffStat = (await runGit(["diff", "--stat", "--cached"])).stdout;
  const unstagedDiffStat = (await runGit(["diff", "--stat"])).stdout;

  const committedDiffExcerpt = commitsRange
    ? truncateText(
        (await runGit(["diff", "--no-ext-diff", "--unified=3", commitsRange]))
          .stdout,
        maxDiffChars,
      )
    : "";
  const stagedDiffExcerpt = truncateText(
    (await runGit(["diff", "--no-ext-diff", "--unified=3", "--cached"])).stdout,
    maxDiffChars,
  );
  const unstagedDiffExcerpt = truncateText(
    (await runGit(["diff", "--no-ext-diff", "--unified=3"])).stdout,
    maxDiffChars,
  );

  const workContext: WorkContext = {
    repoRoot,
    branchName,
    headSha,
    headShortSha: headSha.slice(0, 7),
    baseRef,
    mergeBase,
    defaultHeading: `## ${formatNowLabel()} | ${branchName} | ${headSha.slice(
      0,
      7,
    )}`,
    commits,
    statusEntries,
    committedFiles,
    stagedFiles,
    unstagedFiles,
    untrackedFiles,
    changedFiles: buildChangedFiles(
      committedFiles,
      stagedFiles,
      unstagedFiles,
      untrackedFiles,
    ),
    committedDiffStat,
    stagedDiffStat,
    unstagedDiffStat,
    committedDiffExcerpt,
    stagedDiffExcerpt,
    unstagedDiffExcerpt,
  };

  return {
    workContext,
    text: buildWorkContextText(workContext),
  };
}
