import type { DzineDocument, ExportBundle, TokenTree, TokenValue } from "../core/types.js";
import { compileDzine } from "../compiler/compilePrompt.js";

export type ExportTarget = "tokens" | "css" | "tailwind" | "markdown" | "prompt" | "goal" | "all";

export function exportDzine(document: DzineDocument): ExportBundle {
  return {
    prompt: compileDzine(document, { kind: "prompt" }),
    goal: compileDzine(document, { kind: "goal", maxChars: 4000 }),
    tokensJson: exportTokensJson(document),
    cssVariables: exportCssVariables(document),
    tailwindConfig: exportTailwindConfig(document),
    markdown: exportCompatibilityMarkdown(document)
  };
}

export function exportTokensJson(document: DzineDocument): string {
  return JSON.stringify(document.tokens?.tokens ?? {}, null, 2);
}

export function exportCssVariables(document: DzineDocument): string {
  const flattened = flattenTokens(document.tokens?.tokens ?? {});
  const lines = [":root {"];
  for (const token of flattened) {
    if (typeof token.value === "string" || typeof token.value === "number") {
      lines.push(`  --dz-${token.path.join("-")}: ${token.value};`);
    }
  }
  lines.push("}");
  return `${lines.join("\n")}\n`;
}

export function exportTailwindConfig(document: DzineDocument): string {
  const flattened = flattenTokens(document.tokens?.tokens ?? {});
  const colors: Record<string, string> = {};
  const spacing: Record<string, string> = {};
  const borderRadius: Record<string, string> = {};

  for (const token of flattened) {
    const key = token.path.join("-");
    const value = String(token.value);
    if (token.type === "color") {
      colors[key] = value;
    } else if (token.path.includes("space") || token.path.includes("spacing")) {
      spacing[key] = value;
    } else if (token.path.includes("radius")) {
      borderRadius[key] = value;
    }
  }

  return `// Generated from .dzine.html. Do not treat Markdown compatibility exports as source.
export default {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 6)},
      spacing: ${JSON.stringify(spacing, null, 6)},
      borderRadius: ${JSON.stringify(borderRadius, null, 6)}
    }
  }
};
`;
}

export function exportCompatibilityMarkdown(document: DzineDocument): string {
  const recipes = document.recipes.map((recipe) => `- **${recipe.id}** (${recipe.mode}) — ${recipe.sections.join(", ")}`).join("\n");
  const antiPatterns = document.antiPatterns.slice(0, 20).map((pattern) => `- ${pattern.id}: ${pattern.remediation}`).join("\n");
  return `# ${document.metadata.title}

This file is generated from .dzine.html and is not the source of truth.

## Objective

${document.brief?.objective ?? document.metadata.description ?? "Use the canonical D-ZINE document for implementation."}

## Design DNA

- Visual dialect: ${document.designDNA?.visualDialect ?? document.metadata.visualDialect ?? "unspecified"}
- Density: ${document.designDNA?.density ?? "n/a"}
- Variance: ${document.designDNA?.variance ?? "n/a"}
- Motion: ${document.designDNA?.motion ?? "n/a"}

## Recipes

${recipes}

## Anti-Slop Rules

${antiPatterns}

## Source Rule

Use the .dzine.html document for visual guidance, JSON metadata, tokens, recipes, component specimens, and QA gates.
`;
}

export function flattenTokens(tree: TokenTree, path: string[] = []): Array<{ path: string[]; type: string; value: unknown }> {
  const rows: Array<{ path: string[]; type: string; value: unknown }> = [];
  for (const [key, value] of Object.entries(tree)) {
    const nextPath = [...path, key];
    if (isTokenValue(value)) {
      rows.push({ path: nextPath, type: value.$type, value: value.$value });
    } else {
      rows.push(...flattenTokens(value as TokenTree, nextPath));
    }
  }
  return rows;
}

function isTokenValue(value: unknown): value is TokenValue {
  return typeof value === "object" && value !== null && "$type" in value && "$value" in value;
}
