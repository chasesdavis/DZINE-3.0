import { HTMLElement, parse } from "node-html-parser";
import {
  antiPatternSchema,
  critiqueRubricSchema,
  designBriefSchema,
  designDNASchema,
  dzineMetadataSchema,
  formatZodError,
  recipeSchema,
  tokenSetSchema,
  visualDialectSchema
} from "../core/schemas.js";
import type {
  AntiPattern,
  ComponentSpecimen,
  DzineDiagnostic,
  DzineDocument,
  DzineJsonBlock,
  Recipe,
  TokenSet,
  VisualDialect
} from "../core/types.js";
import { REQUIRED_SECTIONS } from "../core/constants.js";
import { bundledAcceptanceGates, bundledAntiPatterns, bundledRecipes, bundledVisualDialects } from "../recipes/bundled.js";

export interface ParseDzineOptions {
  filePath?: string;
}

export class DzineParseError extends Error {
  diagnostics: DzineDiagnostic[];

  constructor(message: string, diagnostics: DzineDiagnostic[]) {
    super(message);
    this.name = "DzineParseError";
    this.diagnostics = diagnostics;
  }
}

export function parseDzineHtml(html: string, options: ParseDzineOptions = {}): DzineDocument {
  const diagnostics: DzineDiagnostic[] = [];
  const root = parse(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true
    }
  });

  if (!/^<!doctype html>/i.test(html.trim())) {
    diagnostics.push(error("missing-doctype", "Document must start with <!doctype html>."));
  }

  const htmlNode = root.querySelector("html");
  if (!htmlNode?.getAttribute("data-dzine-version")) {
    diagnostics.push(error("missing-dzine-version", "The html element must include data-dzine-version."));
  }

  const jsonBlocks = extractJsonBlocks(root, diagnostics);
  const rootBlock = jsonBlocks.find((block) => block.id === "dzine-root" || block.kind === "dzine.document");
  if (!rootBlock) {
    diagnostics.push(error("missing-root", "Missing dzine-root metadata block."));
  }

  const metadataResult = rootBlock ? dzineMetadataSchema.safeParse(rootBlock.value) : undefined;
  if (metadataResult && !metadataResult.success) {
    diagnostics.push(error("invalid-root", `Invalid root metadata: ${formatZodError(metadataResult.error)}`));
  }

  const visibleSections = unique(root.querySelectorAll("[data-dzine-section]").map((node) => node.getAttribute("data-dzine-section")).filter(isString));
  for (const section of REQUIRED_SECTIONS) {
    if (!visibleSections.includes(section)) {
      diagnostics.push(warning("missing-section", `Visible section "${section}" is missing.`));
    }
  }

  const brief = parseOptionalBlock(jsonBlocks, "dzine.brief", designBriefSchema, diagnostics);
  const designDNA = parseOptionalBlock(jsonBlocks, "dzine.designDNA", designDNASchema, diagnostics);
  const tokens = parseTokens(jsonBlocks, diagnostics);
  const recipes = parseRecipes(jsonBlocks, root, diagnostics);
  const visualDialects = parseVisualDialects(jsonBlocks, diagnostics);
  const antiPatterns = parseAntiPatterns(jsonBlocks, root, diagnostics);
  const rubric = parseOptionalBlock(jsonBlocks, "dzine.rubric", critiqueRubricSchema, diagnostics);
  const components = parseComponents(root);

  if (!tokens) {
    diagnostics.push(error("missing-tokens", "Missing dzine.tokens metadata block."));
  }
  if (recipes.length === 0) {
    diagnostics.push(error("missing-recipes", "Missing dzine.recipes metadata block or data-dzine-recipe elements."));
  }
  if (!rubric) {
    diagnostics.push(error("missing-rubric", "Missing dzine.rubric metadata block."));
  }

  const fatalDiagnostics = diagnostics.filter((item) => item.level === "error");
  if (!metadataResult?.success || fatalDiagnostics.length > 0) {
    throw new DzineParseError("Invalid D-ZINE document.", diagnostics);
  }

  return {
    filePath: options.filePath,
    html,
    metadata: metadataResult.data,
    brief,
    designDNA,
    tokens,
    recipes,
    visualDialects,
    components,
    antiPatterns,
    rubric,
    acceptanceGates: bundledAcceptanceGates,
    visibleSections,
    jsonBlocks,
    diagnostics
  };
}

function extractJsonBlocks(root: HTMLElement, diagnostics: DzineDiagnostic[]): DzineJsonBlock[] {
  return root.querySelectorAll('script[type="application/dzine+json"]').flatMap((node) => {
    const id = node.getAttribute("id") ?? "anonymous";
    const raw = node.textContent.trim();
    try {
      const value = JSON.parse(raw) as { kind?: string };
      return [{ id, kind: typeof value.kind === "string" ? value.kind : "unknown", value }];
    } catch (parseError) {
      diagnostics.push(error("invalid-json", `Invalid JSON in ${id}: ${(parseError as Error).message}`, id));
      return [];
    }
  });
}

function parseTokens(blocks: DzineJsonBlock[], diagnostics: DzineDiagnostic[]): TokenSet | undefined {
  return parseOptionalBlock(blocks, "dzine.tokens", tokenSetSchema, diagnostics) as TokenSet | undefined;
}

function parseRecipes(blocks: DzineJsonBlock[], root: HTMLElement, diagnostics: DzineDiagnostic[]): Recipe[] {
  const block = blocks.find((item) => item.kind === "dzine.recipes");
  const recipes: Recipe[] = [];
  if (block) {
    const value = block.value as { recipes?: unknown[] };
    for (const [index, recipe] of (value.recipes ?? []).entries()) {
      const result = recipeSchema.safeParse(recipe);
      if (result.success) {
        recipes.push(result.data);
      } else {
        diagnostics.push(error("invalid-recipe", `Invalid recipe at index ${index}: ${formatZodError(result.error)}`, block.id));
      }
    }
  }

  for (const node of root.querySelectorAll("[data-dzine-recipe]")) {
    const id = node.getAttribute("data-dzine-recipe");
    const bundled = bundledRecipes.find((recipe) => recipe.id === id);
    if (bundled && !recipes.some((recipe) => recipe.id === bundled.id)) {
      recipes.push(bundled);
    }
  }

  return recipes;
}

function parseVisualDialects(blocks: DzineJsonBlock[], diagnostics: DzineDiagnostic[]): VisualDialect[] {
  const block = blocks.find((item) => item.kind === "dzine.visualDialects");
  if (!block) {
    return bundledVisualDialects;
  }
  const value = block.value as { visualDialects?: unknown[] };
  const parsed = (value.visualDialects ?? []).flatMap((dialect, index) => {
    const result = visualDialectSchema.safeParse(dialect);
    if (result.success) {
      return [result.data];
    }
    diagnostics.push(error("invalid-visual-dialect", `Invalid visual dialect at index ${index}: ${formatZodError(result.error)}`, block.id));
    return [];
  });
  return parsed.length > 0 ? parsed : bundledVisualDialects;
}

function parseAntiPatterns(blocks: DzineJsonBlock[], root: HTMLElement, diagnostics: DzineDiagnostic[]): AntiPattern[] {
  const patterns = [...bundledAntiPatterns];
  const block = blocks.find((item) => item.kind === "dzine.antiPatterns");
  if (block) {
    const value = block.value as { antiPatterns?: unknown[] };
    for (const [index, pattern] of (value.antiPatterns ?? []).entries()) {
      const result = antiPatternSchema.safeParse(pattern);
      if (result.success && !patterns.some((existing) => existing.id === result.data.id)) {
        patterns.push(result.data);
      } else if (!result.success) {
        diagnostics.push(error("invalid-anti-pattern", `Invalid anti-pattern at index ${index}: ${formatZodError(result.error)}`, block.id));
      }
    }
  }

  for (const node of root.querySelectorAll("[data-dzine-antipattern]")) {
    const id = node.getAttribute("data-dzine-antipattern");
    if (id && !patterns.some((pattern) => pattern.id === id)) {
      patterns.push({
        id,
        name: id,
        description: node.textContent.trim() || `Visible anti-pattern example for ${id}.`,
        severity: parseSeverity(node.getAttribute("data-severity")),
        remediation: "Replace this anti-pattern with a project-specific, token-backed design rule.",
        examples: [node.toString()]
      });
    }
  }
  return patterns;
}

function parseComponents(root: HTMLElement): ComponentSpecimen[] {
  return root.querySelectorAll("template[data-dzine-component]").map((node) => ({
    id: node.getAttribute("data-dzine-component") ?? "component",
    platform: (node.getAttribute("data-platform") ?? "all") as ComponentSpecimen["platform"],
    html: node.innerHTML.trim(),
    tokens: csv(node.getAttribute("data-tokens")),
    states: csv(node.getAttribute("data-states")),
    accessibility: csv(node.getAttribute("data-accessibility")),
    antiPatterns: csv(node.getAttribute("data-anti-patterns"))
  }));
}

function parseOptionalBlock<T>(
  blocks: DzineJsonBlock[],
  kind: string,
  schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false; error: import("zod").ZodError } },
  diagnostics: DzineDiagnostic[]
): T | undefined {
  const block = blocks.find((item) => item.kind === kind);
  if (!block) {
    return undefined;
  }
  const result = schema.safeParse(block.value);
  if (result.success) {
    return result.data;
  }
  diagnostics.push(error(`invalid-${kind}`, `Invalid ${kind}: ${formatZodError(result.error)}`, block.id));
  return undefined;
}

function parseSeverity(value: string | undefined) {
  return value === "critical" || value === "major" || value === "minor" ? value : "major";
}

function csv(value: string | undefined): string[] {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function error(code: string, message: string, source?: string): DzineDiagnostic {
  return { level: "error", code, message, source };
}

function warning(code: string, message: string, source?: string): DzineDiagnostic {
  return { level: "warning", code, message, source };
}
