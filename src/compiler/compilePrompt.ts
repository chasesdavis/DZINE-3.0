import type { DzineDocument, Recipe } from "../core/types.js";
import { NEXT_GOAL_3 } from "../core/constants.js";

export type CompileKind = "prompt" | "goal" | "recipe";

export interface CompileOptions {
  kind?: CompileKind;
  recipeId?: string;
  maxChars?: number;
  phase?: "spec" | "implement" | "showcase";
}

export function compileDzine(document: DzineDocument, options: CompileOptions = {}): string {
  const kind = options.kind ?? "prompt";
  if (kind === "goal") {
    return compileGoal(document, options.maxChars ?? 4000, options.phase);
  }
  if (kind === "recipe") {
    const recipe = options.recipeId ? document.recipes.find((item) => item.id === options.recipeId) : document.recipes[0];
    return compileRecipePrompt(document, recipe);
  }
  return compileAgentPrompt(document);
}

export function compileAgentPrompt(document: DzineDocument): string {
  const banned = document.designDNA?.bannedPatterns.length ? document.designDNA.bannedPatterns : document.antiPatterns.map((item) => item.id).slice(0, 12);
  const recipes = document.recipes.map((recipe) => `- ${recipe.id} (${recipe.mode}): ${recipe.sections.join(", ")}`).join("\n");
  const states = unique(document.recipes.flatMap((recipe) => recipe.requiredStates)).join(", ");
  const gates = unique(document.recipes.flatMap((recipe) => recipe.acceptanceGates)).join(", ");
  const tokenSummary = document.tokens ? summarizeTokenBranches(document.tokens.tokens) : "No tokens found.";
  const visible = document.visibleSections.join(", ");
  const tasteProfile = activeTasteProfile(document.html);

  return `# D-ZINE Agent Prompt: ${document.metadata.title}

You are working from a canonical .dzine.html design instruction document. Treat the renderable HTML and its machine-readable JSON as the design source of truth. Markdown exports are compatibility artifacts only.

## Project
${document.brief?.project ?? document.metadata.title}

## Objective
${document.brief?.objective ?? document.metadata.description ?? "Produce elite, non-generic design output from the D-ZINE source."}

## Audience
${formatList(document.brief?.audience)}

## Platforms
${formatList(document.brief?.platforms ?? document.metadata.modes)}

## Design DNA
- Taste profile: ${tasteProfile ?? "not declared"}
- Visual dialect: ${document.designDNA?.visualDialect ?? document.metadata.visualDialect ?? "unspecified"}
- Density: ${document.designDNA?.density ?? "n/a"}
- Variance: ${document.designDNA?.variance ?? "n/a"}
- Motion: ${document.designDNA?.motion ?? "n/a"}
- Image priority: ${document.designDNA?.imagePriority ?? "n/a"}
- Brand posture: ${document.designDNA?.brandPosture ?? "n/a"}
- Copy posture: ${document.designDNA?.copyPosture ?? "n/a"}

## Token Branches
${tokenSummary}

## Recipes
${recipes || "- No recipes found"}

## Required States
${states || "default, hover, focus, loading, empty, error"}

## Acceptance Gates
${gates || "contrast-aa, anti-slop-critical, export-complete"}

## Visible Instruction Sections
${visible}

## Non-Negotiable Anti-Slop Bans
${banned.map((item) => `- ${item}`).join("\n")}

## Operating Rules
1. Preserve D-ZINE tokens and design DNA.
2. Build complete files only; do not output skipped sections or placeholder implementation.
3. Include loading, empty, error, focus, disabled, hover, and active states where relevant.
4. Use accessibility and responsive behavior as taste requirements.
5. Verify output against the acceptance gates before calling it done.
6. If a taste profile is declared, preserve its source-backed principles and run taste audit before shipping.
`;
}

export function compileRecipePrompt(document: DzineDocument, recipe?: Recipe): string {
  if (!recipe) {
    return compileAgentPrompt(document);
  }
  return `# D-ZINE Recipe Prompt: ${recipe.id}

Source: ${document.metadata.title}
Mode: ${recipe.mode}
Description: ${recipe.description ?? "D-ZINE recipe"}

## Sections
${recipe.sections.map((section, index) => `${index + 1}. ${section}`).join("\n")}

## Required States
${recipe.requiredStates.map((state) => `- ${state}`).join("\n")}

## Image Policy
${recipe.imagePolicy}

## Acceptance Gates
${recipe.acceptanceGates.map((gate) => `- ${gate}`).join("\n")}

## Design DNA
Use visual dialect ${document.designDNA?.visualDialect ?? document.metadata.visualDialect ?? "from source"} with density ${document.designDNA?.density ?? "n/a"}, variance ${document.designDNA?.variance ?? "n/a"}, and motion ${document.designDNA?.motion ?? "n/a"}.

## Output Rule
Return complete implementation guidance or code. Do not use placeholder comments, skipped sections, or compatibility Markdown as the source of truth.
`;
}

export function compileGoal(document: DzineDocument, maxChars: number, phase: CompileOptions["phase"] = "implement"): string {
  const lines = [
    `/goal ${phase === "showcase" ? "Finish" : "Implement"} ${document.metadata.title} from its canonical .dzine.html source.`,
    "",
    "CONTEXT",
    `Source: ${document.filePath ?? "project.dzine.html"}`,
    "Use .dzine.html as source of truth; Markdown is compatibility output only.",
    "",
    "TASK",
    "Build complete design/framework output from the parsed D-ZINE metadata, tokens, recipes, and quality gates.",
    "",
    "REQUIRED",
    `Modes: ${(document.metadata.modes ?? []).join(", ")}`,
    `Recipes: ${document.recipes.map((recipe) => recipe.id).join(", ")}`,
    `Token branches: ${Object.keys(document.tokens?.tokens ?? {}).join(", ")}`,
    "",
    "QUALITY",
    "No generic AI slop, no placeholder code, no missing states, no inaccessible motion, no Markdown-as-source drift.",
    "",
    "SUCCESS",
    "Build, verify, export prompt/tokens/CSS/Tailwind/Markdown, run audit, and prove every gate before stopping."
  ];
  let goal = lines.join("\n");
  if (goal.length > maxChars) {
    goal = `${goal.slice(0, Math.max(0, maxChars - 120)).trim()}\n\n[Trimmed to ${maxChars} chars; preserve D-ZINE source truth and gates.]`;
  }
  return goal;
}

export function nextGoalPrompt(): string {
  return NEXT_GOAL_3;
}

function summarizeTokenBranches(tokens: Record<string, unknown>): string {
  const branches = Object.keys(tokens);
  if (branches.length === 0) {
    return "No token branches present.";
  }
  return branches.map((branch) => `- ${branch}`).join("\n");
}

function formatList(values: readonly string[] | undefined): string {
  return values && values.length > 0 ? values.map((item) => `- ${item}`).join("\n") : "- unspecified";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function activeTasteProfile(html: string): string | undefined {
  const dataMatch = html.match(/data-taste-profile=["']([^"']+)["']/i);
  if (dataMatch) {
    return dataMatch[1];
  }
  const jsonMatch = html.match(/"tasteProfile"\s*:\s*"([^"]+)"/i);
  return jsonMatch?.[1];
}
