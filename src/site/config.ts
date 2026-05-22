import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { DzineSiteConfig, DzineSitePage } from "./types.js";

export async function loadSiteConfig(configPath = "dzine.config.json"): Promise<{ config: DzineSiteConfig; configPath: string; rootDir: string }> {
  const absolutePath = resolve(configPath);
  const raw = await readFile(absolutePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const config = normalizeSiteConfig(parsed);
  return { config, configPath: absolutePath, rootDir: dirname(absolutePath) };
}

function normalizeSiteConfig(value: unknown): DzineSiteConfig {
  if (!isRecord(value)) {
    throw new Error("D-ZINE site config must be a JSON object.");
  }
  const pages = value.pages;
  if (!Array.isArray(pages) || pages.length === 0) {
    throw new Error("D-ZINE site config requires a non-empty pages array.");
  }

  return {
    name: readString(value, "name"),
    title: readString(value, "title"),
    description: readString(value, "description"),
    sourceRoot: readOptionalString(value, "sourceRoot"),
    outputDir: readOptionalString(value, "outputDir"),
    theme: readOptionalString(value, "theme"),
    assets: readOptionalStringArray(value, "assets"),
    github: readGitHub(value.github),
    nav: readNav(value.nav),
    pages: pages.map(readPage).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  };
}

function readPage(value: unknown): DzineSitePage {
  if (!isRecord(value)) {
    throw new Error("Each D-ZINE site page must be an object.");
  }
  return {
    title: readString(value, "title"),
    description: readString(value, "description"),
    route: normalizeRoute(readString(value, "route")),
    source: readString(value, "source"),
    navLabel: readOptionalString(value, "navLabel"),
    order: typeof value.order === "number" ? value.order : undefined
  };
}

function readGitHub(value: unknown) {
  if (value === undefined) {
    return undefined;
  }
  if (!isRecord(value)) {
    throw new Error("github must be an object when provided.");
  }
  const owner = readString(value, "owner");
  const repo = readString(value, "repo");
  return {
    owner,
    repo,
    url: readOptionalString(value, "url") ?? `https://github.com/${owner}/${repo}`
  };
}

function readNav(value: unknown) {
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value)) {
    throw new Error("nav must be an array when provided.");
  }
  return value.map((item) => {
    if (!isRecord(item)) {
      throw new Error("Each nav item must be an object.");
    }
    return { label: readString(item, "label"), href: readString(item, "href") };
  });
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`D-ZINE site config field "${key}" must be a non-empty string.`);
  }
  return value;
}

function readOptionalString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`D-ZINE site config field "${key}" must be a non-empty string when provided.`);
  }
  return value;
}

function readOptionalStringArray(record: Record<string, unknown>, key: string): string[] | undefined {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`D-ZINE site config field "${key}" must be a string array when provided.`);
  }
  return value;
}

function normalizeRoute(route: string): string {
  if (route === "/") {
    return "/";
  }
  const withLeading = route.startsWith("/") ? route : `/${route}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
