import {
  APIErrorCode,
  APIResponseError,
  Client,
  collectPaginatedAPI,
  extractNotionId,
  isFullDataSource,
  isFullDatabase,
  isFullPage,
  isFullPageOrDataSource,
} from "@notionhq/client";
import type {
  DataSourceObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDataSourceObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client";

import { loadProjectEnv } from "./env";
import { formatDateLabel, sha256 } from "./utils";

const NOTION_API_VERSION = "2026-03-11";
const DEVLOG_DATABASE_TITLE = "piuda Devlog Calendar";
const DEVLOG_DATE_PROPERTY_NAME = "Date";
const DEVLOG_DEFAULT_TITLE_PROPERTY_NAME = "Name";

export type NotionTargetType = "parent_page" | "data_source";
export type BootstrapAction =
  | "used_existing_data_source"
  | "created_database"
  | "created_daily_page"
  | "appended_existing_daily_page";

export type NotionValidationResult = {
  ok: boolean;
  configured: boolean;
  pageId: string | null;
  pageTitle: string | null;
  pageUrl: string | null;
  canReadContent: boolean;
  updateCapabilityHint: string;
  details: string;
  targetType: NotionTargetType;
  databaseId: string | null;
  dataSourceId: string | null;
  databaseTitle: string | null;
  dailyPageId: string | null;
  dailyPageTitle: string | null;
  bootstrapAction?: BootstrapAction | null;
};

export type NotionAppendResult = {
  ok: boolean;
  pageId: string | null;
  pageUrl: string | null;
  heading: string;
  appendedCharacters: number;
  resultMarkdownLength: number;
  details: string;
  targetType: NotionTargetType;
  databaseId: string | null;
  dataSourceId: string | null;
  databaseTitle: string | null;
  dailyPageId: string | null;
  dailyPageTitle: string | null;
  bootstrapAction: BootstrapAction | null;
};

type ResolvedParentPage = {
  pageId: string;
  pageTitle: string | null;
  pageUrl: string | null;
};

type ResolvedDataSource = {
  targetType: NotionTargetType;
  databaseId: string | null;
  dataSourceId: string | null;
  databaseTitle: string | null;
  dataSource: DataSourceObjectResponse | null;
  titlePropertyName: string | null;
  datePropertyName: string | null;
  bootstrapAction?: BootstrapAction;
};

type ResolvedDailyPage = {
  dailyPage: PageObjectResponse | null;
  created: boolean;
};

function normalizeNotionId(value: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  const extracted = extractNotionId(trimmed);
  if (extracted) return extracted;

  const hex = trimmed.replace(/-/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(hex)) {
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join("-");
  }

  return trimmed;
}

function notionClient(apiKey: string) {
  return new Client({
    auth: apiKey,
    notionVersion: NOTION_API_VERSION,
  });
}

function formatNotionError(error: unknown) {
  if (error instanceof APIResponseError) {
    return `${error.code}: ${error.message}`;
  }

  return error instanceof Error
    ? error.message
    : "알 수 없는 Notion 접근 오류";
}

function isObjectNotFound(error: unknown) {
  return (
    error instanceof APIResponseError &&
    error.code === APIErrorCode.ObjectNotFound
  );
}

function extractRichTextPlainText(richText: RichTextItemResponse[]) {
  return richText.map((item) => item.plain_text).join("").trim();
}

function extractPageTitle(page: PageObjectResponse) {
  const titleProperty = Object.values(page.properties).find(
    (property) => property.type === "title",
  );

  if (!titleProperty || titleProperty.type !== "title") return null;

  const title = titleProperty.title.map((item) => item.plain_text).join("").trim();
  return title || null;
}

function extractDatabaseTitle(database: DatabaseObjectResponse) {
  const title = extractRichTextPlainText(database.title);
  return title || null;
}

function extractDataSourceTitle(dataSource: DataSourceObjectResponse) {
  const title = extractRichTextPlainText(dataSource.title);
  return title || null;
}

function toRichText(content: string) {
  return [
    {
      type: "text" as const,
      text: {
        content,
      },
    },
  ];
}

function extractDatabaseId(dataSource: DataSourceObjectResponse) {
  return dataSource.parent.type === "database_id"
    ? dataSource.parent.database_id
    : null;
}

function extractParentPageId(dataSource: DataSourceObjectResponse) {
  return dataSource.database_parent.type === "page_id"
    ? dataSource.database_parent.page_id
    : null;
}

function resolveDevlogSchema(dataSource: DataSourceObjectResponse) {
  const titleProperty = Object.values(dataSource.properties).find(
    (property) => property.type === "title",
  );

  if (!titleProperty || titleProperty.type !== "title") {
    throw new Error("devlog data source에 title 속성이 없습니다.");
  }

  const dateProperty = Object.values(dataSource.properties).find(
    (property) => property.name === DEVLOG_DATE_PROPERTY_NAME,
  );

  if (!dateProperty || dateProperty.type !== "date") {
    throw new Error(
      `devlog data source에 "${DEVLOG_DATE_PROPERTY_NAME}" date 속성이 없습니다.`,
    );
  }

  return {
    titlePropertyName:
      titleProperty.name?.trim() || DEVLOG_DEFAULT_TITLE_PROPERTY_NAME,
    datePropertyName: dateProperty.name,
  };
}

async function ensureFullPage(
  client: Client,
  page: PageObjectResponse | PartialPageObjectResponse,
) {
  if (isFullPage(page)) return page;

  const retrieved = await client.pages.retrieve({ page_id: page.id });
  if (!isFullPage(retrieved)) {
    throw new Error("Notion 페이지를 부분 응답으로만 가져왔습니다.");
  }

  return retrieved;
}

async function ensureFullDataSource(
  client: Client,
  dataSource: DataSourceObjectResponse | PartialDataSourceObjectResponse,
) {
  if (isFullDataSource(dataSource)) return dataSource;

  const retrieved = await client.dataSources.retrieve({
    data_source_id: dataSource.id,
  });
  if (!isFullDataSource(retrieved)) {
    throw new Error("Notion data source를 부분 응답으로만 가져왔습니다.");
  }

  return retrieved;
}

async function ensureFullDatabase(
  client: Client,
  database: DatabaseObjectResponse | PartialDatabaseObjectResponse,
) {
  if (isFullDatabase(database)) return database;

  const retrieved = await client.databases.retrieve({
    database_id: database.id,
  });
  if (!isFullDatabase(retrieved)) {
    throw new Error("Notion database를 부분 응답으로만 가져왔습니다.");
  }

  return retrieved;
}

async function resolveParentPage(
  client: Client,
  parentPageId: string,
): Promise<ResolvedParentPage> {
  const page = await client.pages.retrieve({ page_id: parentPageId });
  if (!isFullPage(page)) {
    throw new Error("부모 프로젝트 페이지를 부분 응답으로만 가져왔습니다.");
  }

  return {
    pageId: parentPageId,
    pageTitle: extractPageTitle(page),
    pageUrl: page.url ?? null,
  };
}

async function listMatchingDevlogDataSources(
  client: Client,
  parentPageId: string,
) {
  const search = client.search.bind(client);
  const results = await collectPaginatedAPI(search, {
    query: DEVLOG_DATABASE_TITLE,
    filter: {
      property: "object",
      value: "data_source",
    },
    page_size: 100,
  });

  const candidates: DataSourceObjectResponse[] = [];

  for (const result of results) {
    if (!isFullPageOrDataSource(result) || result.object !== "data_source") {
      continue;
    }

    const dataSource = await ensureFullDataSource(client, result);
    if (dataSource.in_trash) continue;
    if (extractDataSourceTitle(dataSource) !== DEVLOG_DATABASE_TITLE) continue;
    if (extractParentPageId(dataSource) !== parentPageId) continue;

    candidates.push(dataSource);
  }

  return candidates;
}

async function createDevlogDatabase(
  client: Client,
  parentPageId: string,
) {
  const created = await client.databases.create({
    parent: {
      type: "page_id",
      page_id: parentPageId,
    },
    title: toRichText(DEVLOG_DATABASE_TITLE),
    is_inline: false,
    initial_data_source: {
      properties: {
        [DEVLOG_DEFAULT_TITLE_PROPERTY_NAME]: {
          type: "title",
          title: {},
        },
        [DEVLOG_DATE_PROPERTY_NAME]: {
          type: "date",
          date: {},
        },
      },
    },
  });

  const database = await ensureFullDatabase(client, created);
  const dataSourceRef = database.data_sources.at(0);

  if (!dataSourceRef) {
    throw new Error("생성된 devlog database에서 기본 data source를 찾지 못했습니다.");
  }

  const dataSource = await ensureFullDataSource(
    client,
    await client.dataSources.retrieve({
      data_source_id: dataSourceRef.id,
    }),
  );

  return {
    database,
    dataSource,
  };
}

async function resolveConfiguredDataSource(
  client: Client,
  configuredDataSourceId: string,
  parentPageId: string,
) {
  const retrieved = await client.dataSources.retrieve({
    data_source_id: configuredDataSourceId,
  });
  const dataSource = await ensureFullDataSource(client, retrieved);

  if (extractParentPageId(dataSource) !== parentPageId) {
    throw new Error(
      "NOTION_DEVLOG_DATA_SOURCE_ID가 현재 NOTION_PROJECT_PAGE_ID 아래의 data source를 가리키지 않습니다.",
    );
  }

  const databaseId = extractDatabaseId(dataSource);
  if (!databaseId) {
    throw new Error("devlog data source의 상위 database ID를 찾지 못했습니다.");
  }

  const database = await ensureFullDatabase(
    client,
    await client.databases.retrieve({ database_id: databaseId }),
  );
  const { titlePropertyName, datePropertyName } = resolveDevlogSchema(dataSource);

  return {
    targetType: "data_source" as const,
    databaseId: database.id,
    dataSourceId: dataSource.id,
    databaseTitle: extractDatabaseTitle(database),
    dataSource,
    titlePropertyName,
    datePropertyName,
    bootstrapAction: "used_existing_data_source" as const,
  };
}

async function resolveDataSourceTarget(
  client: Client,
  {
    parentPageId,
    configuredDataSourceId,
    allowCreate,
  }: {
    parentPageId: string;
    configuredDataSourceId: string | null;
    allowCreate: boolean;
  },
): Promise<ResolvedDataSource> {
  if (configuredDataSourceId) {
    return resolveConfiguredDataSource(
      client,
      configuredDataSourceId,
      parentPageId,
    );
  }

  const matches = await listMatchingDevlogDataSources(client, parentPageId);
  if (matches.length > 1) {
    throw new Error(
      "부모 프로젝트 페이지 아래에 같은 이름의 devlog data source가 2개 이상 있습니다. NOTION_DEVLOG_DATA_SOURCE_ID를 명시적으로 설정하세요.",
    );
  }

  if (matches.length === 1) {
    const dataSource = matches[0];
    const databaseId = extractDatabaseId(dataSource);
    if (!databaseId) {
      throw new Error("devlog data source의 상위 database ID를 찾지 못했습니다.");
    }

    const database = await ensureFullDatabase(
      client,
      await client.databases.retrieve({ database_id: databaseId }),
    );
    const { titlePropertyName, datePropertyName } = resolveDevlogSchema(dataSource);

    return {
      targetType: "data_source",
      databaseId: database.id,
      dataSourceId: dataSource.id,
      databaseTitle: extractDatabaseTitle(database),
      dataSource,
      titlePropertyName,
      datePropertyName,
      bootstrapAction: "used_existing_data_source",
    };
  }

  if (!allowCreate) {
    return {
      targetType: "parent_page",
      databaseId: null,
      dataSourceId: null,
      databaseTitle: null,
      dataSource: null,
      titlePropertyName: null,
      datePropertyName: null,
    };
  }

  const { database, dataSource } = await createDevlogDatabase(client, parentPageId);
  const { titlePropertyName, datePropertyName } = resolveDevlogSchema(dataSource);

  return {
    targetType: "data_source",
    databaseId: database.id,
    dataSourceId: dataSource.id,
    databaseTitle: extractDatabaseTitle(database),
    dataSource,
    titlePropertyName,
    datePropertyName,
    bootstrapAction: "created_database",
  };
}

async function resolveDailyPage(
  client: Client,
  {
    dataSource,
    titlePropertyName,
    datePropertyName,
    dateKey,
    allowCreate,
  }: {
    dataSource: DataSourceObjectResponse;
    titlePropertyName: string;
    datePropertyName: string;
    dateKey: string;
    allowCreate: boolean;
  },
): Promise<ResolvedDailyPage> {
  const query = await client.dataSources.query({
    data_source_id: dataSource.id,
    result_type: "page",
    page_size: 10,
    filter: {
      property: datePropertyName,
      date: {
        equals: dateKey,
      },
    },
  });

  const pages: PageObjectResponse[] = [];
  for (const result of query.results) {
    if (result.object !== "page") continue;
    pages.push(await ensureFullPage(client, result));
  }

  if (pages.length > 1) {
    throw new Error(
      `Date=${dateKey}인 devlog 페이지가 2개 이상입니다. 중복 페이지를 정리한 뒤 다시 시도하세요.`,
    );
  }

  if (pages.length === 1) {
    return {
      dailyPage: pages[0],
      created: false,
    };
  }

  if (!allowCreate) {
    return {
      dailyPage: null,
      created: false,
    };
  }

  const created = await client.pages.create({
    parent: {
      data_source_id: dataSource.id,
    },
    properties: {
      [titlePropertyName]: {
        title: toRichText(dateKey),
      },
      [datePropertyName]: {
        date: {
          start: dateKey,
        },
      },
    },
  });

  return {
    dailyPage: await ensureFullPage(client, created),
    created: true,
  };
}

function validationHint() {
  return [
    "Notion integration에 read_content / update_content capability를 켜고",
    "부모 프로젝트 페이지를 integration에 공유해야 합니다.",
    "캘린더 뷰는 database 생성 후 Notion UI에서 한 번만 추가하세요.",
  ].join(" ");
}

function emptyValidationResult(
  overrides: Partial<NotionValidationResult>,
): NotionValidationResult {
  return {
    ok: false,
    configured: false,
    pageId: null,
    pageTitle: null,
    pageUrl: null,
    canReadContent: false,
    updateCapabilityHint: validationHint(),
    details: "",
    targetType: "parent_page",
    databaseId: null,
    dataSourceId: null,
    databaseTitle: null,
    dailyPageId: null,
    dailyPageTitle: null,
    bootstrapAction: null,
    ...overrides,
  };
}

function emptyAppendResult(
  heading: string,
  overrides: Partial<NotionAppendResult>,
): NotionAppendResult {
  return {
    ok: false,
    pageId: null,
    pageUrl: null,
    heading,
    appendedCharacters: 0,
    resultMarkdownLength: 0,
    details: "",
    targetType: "parent_page",
    databaseId: null,
    dataSourceId: null,
    databaseTitle: null,
    dailyPageId: null,
    dailyPageTitle: null,
    bootstrapAction: null,
    ...overrides,
  };
}

export async function validateNotionTarget({
  now = new Date(),
}: {
  now?: Date;
} = {}): Promise<NotionValidationResult> {
  const {
    notionApiKey,
    notionProjectPageId,
    notionDevlogDataSourceId,
  } = loadProjectEnv();
  const parentPageId = normalizeNotionId(notionProjectPageId);
  const configuredDataSourceId = normalizeNotionId(notionDevlogDataSourceId);

  if (!notionApiKey || !parentPageId) {
    return emptyValidationResult({
      details:
        "NOTION_API_KEY 또는 NOTION_PROJECT_PAGE_ID가 설정되지 않았습니다.",
      pageId: parentPageId,
    });
  }

  const client = notionClient(notionApiKey);

  try {
    const parentPage = await resolveParentPage(client, parentPageId);
    const dataSourceTarget = await resolveDataSourceTarget(client, {
      parentPageId,
      configuredDataSourceId,
      allowCreate: false,
    });

    if (!dataSourceTarget.dataSource) {
      return emptyValidationResult({
        ok: true,
        configured: true,
        pageId: parentPage.pageId,
        pageTitle: parentPage.pageTitle,
        pageUrl: parentPage.pageUrl,
        canReadContent: true,
        details:
          "부모 프로젝트 페이지 접근에 성공했습니다. devlog data source는 아직 없어 첫 append 시 자동 생성됩니다.",
      });
    }

    const dateKey = formatDateLabel(now);
    const dailyPage = await resolveDailyPage(client, {
      dataSource: dataSourceTarget.dataSource,
      titlePropertyName: dataSourceTarget.titlePropertyName ?? DEVLOG_DEFAULT_TITLE_PROPERTY_NAME,
      datePropertyName: dataSourceTarget.datePropertyName ?? DEVLOG_DATE_PROPERTY_NAME,
      dateKey,
      allowCreate: false,
    });

    if (dailyPage.dailyPage) {
      await client.pages.retrieveMarkdown({
        page_id: dailyPage.dailyPage.id,
      });
    }

    return emptyValidationResult({
      ok: true,
      configured: true,
      pageId: parentPage.pageId,
      pageTitle: parentPage.pageTitle,
      pageUrl: parentPage.pageUrl,
      canReadContent: true,
      details: dailyPage.dailyPage
        ? "부모 프로젝트 페이지, devlog data source, 오늘 페이지 접근에 성공했습니다."
        : "부모 프로젝트 페이지와 devlog data source 접근에 성공했습니다. 오늘 페이지는 append 시 생성됩니다.",
      targetType: dataSourceTarget.targetType,
      databaseId: dataSourceTarget.databaseId,
      dataSourceId: dataSourceTarget.dataSourceId,
      databaseTitle: dataSourceTarget.databaseTitle,
      dailyPageId: dailyPage.dailyPage?.id ?? null,
      dailyPageTitle: dailyPage.dailyPage
        ? extractPageTitle(dailyPage.dailyPage) ?? dateKey
        : null,
      bootstrapAction: dataSourceTarget.bootstrapAction ?? null,
    });
  } catch (error) {
    return emptyValidationResult({
      configured: true,
      pageId: parentPageId,
      details: formatNotionError(error),
    });
  }
}

export async function appendProjectDevlog({
  heading,
  markdown,
  previewHash,
  now = new Date(),
}: {
  heading: string;
  markdown: string;
  previewHash?: string;
  now?: Date;
}): Promise<NotionAppendResult> {
  const {
    notionApiKey,
    notionProjectPageId,
    notionDevlogDataSourceId,
  } = loadProjectEnv();
  const parentPageId = normalizeNotionId(notionProjectPageId);
  const configuredDataSourceId = normalizeNotionId(notionDevlogDataSourceId);

  if (!notionApiKey || !parentPageId) {
    return emptyAppendResult(heading, {
      details:
        "NOTION_API_KEY 또는 NOTION_PROJECT_PAGE_ID가 설정되지 않았습니다.",
    });
  }

  const content = `${heading.trim()}\n\n${markdown.trim()}\n`;
  if (previewHash && previewHash.length > 0 && sha256(content) !== previewHash) {
    return emptyAppendResult(heading, {
      details:
        "previewHash가 현재 문서 본문과 일치하지 않습니다. 미리보기 이후 내용이 바뀌었는지 확인하세요.",
    });
  }

  const client = notionClient(notionApiKey);

  try {
    await resolveParentPage(client, parentPageId);

    const dataSourceTarget = await resolveDataSourceTarget(client, {
      parentPageId,
      configuredDataSourceId,
      allowCreate: true,
    });

    if (
      !dataSourceTarget.dataSource ||
      !dataSourceTarget.titlePropertyName ||
      !dataSourceTarget.datePropertyName
    ) {
      throw new Error("devlog data source 해석에 실패했습니다.");
    }

    const dateKey = formatDateLabel(now);
    const dailyPage = await resolveDailyPage(client, {
      dataSource: dataSourceTarget.dataSource,
      titlePropertyName: dataSourceTarget.titlePropertyName,
      datePropertyName: dataSourceTarget.datePropertyName,
      dateKey,
      allowCreate: true,
    });

    if (!dailyPage.dailyPage) {
      throw new Error("오늘 devlog 페이지를 만들지 못했습니다.");
    }

    const markdownResponse = await client.pages.updateMarkdown({
      page_id: dailyPage.dailyPage.id,
      type: "insert_content",
      insert_content: {
        content,
      },
    });

    const bootstrapAction: BootstrapAction =
      dataSourceTarget.bootstrapAction === "created_database"
        ? "created_database"
        : dailyPage.created
          ? "created_daily_page"
          : "appended_existing_daily_page";

    const details =
      bootstrapAction === "created_database"
        ? "부모 프로젝트 페이지 아래 devlog database를 생성하고 오늘 페이지에 문서를 추가했습니다."
        : bootstrapAction === "created_daily_page"
          ? "기존 devlog data source에서 오늘 페이지를 생성하고 문서를 추가했습니다."
          : "오늘 devlog 페이지 하단에 문서를 추가했습니다.";

    return emptyAppendResult(heading, {
      ok: true,
      pageId: dailyPage.dailyPage.id,
      pageUrl: dailyPage.dailyPage.url ?? null,
      appendedCharacters: content.length,
      resultMarkdownLength: markdownResponse.markdown.length,
      details,
      targetType: "data_source",
      databaseId: dataSourceTarget.databaseId,
      dataSourceId: dataSourceTarget.dataSourceId,
      databaseTitle: dataSourceTarget.databaseTitle,
      dailyPageId: dailyPage.dailyPage.id,
      dailyPageTitle: extractPageTitle(dailyPage.dailyPage) ?? dateKey,
      bootstrapAction,
    });
  } catch (error) {
    const message =
      isObjectNotFound(error) && configuredDataSourceId
        ? "NOTION_DEVLOG_DATA_SOURCE_ID가 가리키는 data source를 찾지 못했습니다."
        : formatNotionError(error);

    return emptyAppendResult(heading, {
      details: message,
    });
  }
}
