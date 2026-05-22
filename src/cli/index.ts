#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { auditDzineDocument, formatAuditMarkdown, mergeAuditReports } from "../audit/auditDocument.js";
import { compileDzine, nextGoalPrompt, type CompileKind } from "../compiler/compilePrompt.js";
import { exportDzine, type ExportTarget } from "../exporters/exportDzine.js";
import { DzineParseError, parseDzineHtml } from "../parser/parseDzineHtml.js";
import { createRecipesReadme, createSampleDzineHtml, createSampleReadme } from "../samples/sampleProject.js";
import { startPreviewServer } from "../preview/server.js";
import { runVisualAudit } from "../preview/visualAudit.js";
import { auditDzineSite } from "../site/auditSite.js";
import { buildDzineSite } from "../site/buildSite.js";
import { loadSiteConfig } from "../site/config.js";
import { auditTaste, formatTasteAuditMarkdown } from "../taste/auditTaste.js";
import { formatTasteProfile, formatTasteProfileList } from "../taste/formatTaste.js";
import { loadTasteGraph } from "../taste/registry.js";

interface ParsedArgs {
  command?: string;
  positionals: string[];
  flags: Record<string, string | boolean>;
}

async function main(argv: string[]): Promise<void> {
  const args = parseArgs(argv);
  switch (args.command) {
    case "init":
      await commandInit(args);
      break;
    case "compile":
      await commandCompile(args);
      break;
    case "export":
      await commandExport(args);
      break;
    case "audit":
      await commandAudit(args);
      break;
    case "screenshot":
      await commandScreenshot(args);
      break;
    case "goal":
      await commandGoal(args);
      break;
    case "preview":
      await commandPreview(args);
      break;
    case "site":
      await commandSite(args);
      break;
    case "taste":
      await commandTaste(args);
      break;
    case "help":
    case undefined:
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      throw new Error(`Unknown command: ${args.command}`);
  }
}

async function commandInit(args: ParsedArgs): Promise<void> {
  const targetDir = resolve(String(args.positionals[0] ?? "."));
  const mode = String(args.flags.mode ?? "web");
  const name = String(args.flags.name ?? "D-ZINE Project");
  const dialect = String(args.flags.dialect ?? "precision-product");

  await mkdir(targetDir, { recursive: true });
  await mkdir(join(targetDir, "recipes"), { recursive: true });
  await writeFile(join(targetDir, "project.dzine.html"), createSampleDzineHtml({ name, mode, dialect }), "utf8");
  await writeFile(join(targetDir, "tokens.json"), JSON.stringify({
    color: {
      background: { canvas: { $type: "color", $value: "#f7f4ef" } },
      text: { primary: { $type: "color", $value: "#171511" } },
      accent: { primary: { $type: "color", $value: "#b9472f" } }
    }
  }, null, 2), "utf8");
  await writeFile(join(targetDir, "recipes", "README.md"), createRecipesReadme(), "utf8");
  await writeFile(join(targetDir, "README.md"), createSampleReadme({ name, mode, dialect }), "utf8");
  console.log(`Created D-ZINE project at ${targetDir}`);
}

async function commandCompile(args: ParsedArgs): Promise<void> {
  const filePath = requireFile(args);
  const document = await readDocument(filePath);
  const kind = String(args.flags.kind ?? "prompt") as CompileKind;
  const output = compileDzine(document, {
    kind,
    recipeId: typeof args.flags.recipe === "string" ? args.flags.recipe : undefined,
    maxChars: Number(args.flags["max-chars"] ?? 4000)
  });
  await writeOrPrint(output, args.flags.out);
}

async function commandExport(args: ParsedArgs): Promise<void> {
  const filePath = requireFile(args);
  const document = await readDocument(filePath);
  const target = String(args.flags.target ?? "all") as ExportTarget;
  const outDir = resolve(String(args.flags.out ?? "dzine-export"));
  const bundle = exportDzine(document);
  await mkdir(outDir, { recursive: true });

  const writes: Array<[ExportTarget, string, string]> = [
    ["prompt", "prompt.txt", bundle.prompt],
    ["goal", "goal.txt", bundle.goal],
    ["tokens", "tokens.json", bundle.tokensJson],
    ["css", "tokens.css", bundle.cssVariables],
    ["tailwind", "tailwind.dzine.config.ts", bundle.tailwindConfig],
    ["markdown", "COMPAT_SKILL.md", bundle.markdown]
  ];

  for (const [writeTarget, fileName, content] of writes) {
    if (target === "all" || target === writeTarget) {
      await writeFile(join(outDir, fileName), content, "utf8");
    }
  }

  console.log(`Exported ${target} artifacts to ${outDir}`);
}

async function commandAudit(args: ParsedArgs): Promise<void> {
  const filePath = requireFile(args);
  const document = await readDocument(filePath);
  const documentReport = auditDzineDocument(document);
  const outDir = args.flags.out ? resolve(String(args.flags.out)) : undefined;
  const visual = Boolean(args.flags.visual);
  const report = visual
    ? mergeAuditReports(documentReport, await runVisualAudit(filePath, document, { outDir: outDir ? join(outDir, "screenshots") : "dzine-screenshots", port: Number(args.flags.port ?? 4311) }))
    : documentReport;
  if (outDir) {
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "audit.json"), JSON.stringify(report, null, 2), "utf8");
    await writeFile(join(outDir, "audit.md"), formatAuditMarkdown(report), "utf8");
  }
  console.log(formatAuditMarkdown(report));
  if (!report.passed) {
    process.exitCode = 1;
  }
}

async function commandScreenshot(args: ParsedArgs): Promise<void> {
  const filePath = requireFile(args);
  const document = await readDocument(filePath);
  const outDir = resolve(String(args.flags.out ?? "dzine-screenshots"));
  const report = await runVisualAudit(filePath, document, { outDir, port: Number(args.flags.port ?? 4311) });
  console.log(`Captured ${report.screenshots.length} screenshots:`);
  for (const screenshot of report.screenshots) {
    console.log(`- ${screenshot}`);
  }
}

async function commandGoal(args: ParsedArgs): Promise<void> {
  const filePath = requireFile(args);
  const document = await readDocument(filePath);
  const output = compileDzine(document, {
    kind: "goal",
    phase: args.flags.phase === "showcase" || args.flags.phase === "spec" ? args.flags.phase : "implement",
    maxChars: Number(args.flags["max-chars"] ?? 4000)
  });
  await writeOrPrint(output, args.flags.out);
}

async function commandPreview(args: ParsedArgs): Promise<void> {
  const filePath = requireFile(args);
  const port = Number(args.flags.port ?? 4310);
  const server = await startPreviewServer(filePath, { port });
  console.log(`D-ZINE preview: ${server.url}`);
  console.log("Press Ctrl+C to stop.");
}

async function commandSite(args: ParsedArgs): Promise<void> {
  const action = String(args.positionals[0] ?? "build");
  const configPath = String(args.flags.config ?? "dzine.config.json");
  const { config, rootDir } = await loadSiteConfig(configPath);
  if (action === "build") {
    const outDir = typeof args.flags.out === "string" ? args.flags.out : config.outputDir;
    const result = await buildDzineSite({ config, rootDir, outDir, clean: args.flags.clean !== false });
    console.log(`Generated ${result.pages.length} D-ZINE site pages into ${result.outputDir}`);
    for (const page of result.pages) {
      console.log(`- ${page.route} -> ${page.outputPath}`);
    }
    return;
  }
  if (action === "audit") {
    const reportDir = String(args.flags.out ?? "reports/site-audit");
    const result = await auditDzineSite({
      config,
      rootDir,
      reportDir,
      siteOutDir: typeof args.flags["site-out"] === "string" ? args.flags["site-out"] : config.outputDir,
      port: Number(args.flags.port ?? 4910)
    });
    console.log(`Audited ${result.pages.length} D-ZINE site pages.`);
    console.log(`Report: ${result.reportPath}`);
    if (!result.passed) {
      process.exitCode = 1;
    }
    return;
  }
  throw new Error(`Unknown site action: ${action}`);
}

async function commandTaste(args: ParsedArgs): Promise<void> {
  const action = String(args.positionals[0] ?? "list");
  const registryPath = typeof args.flags.registry === "string" ? args.flags.registry : await resolveDefaultTasteRegistry();
  const graph = await loadTasteGraph(registryPath);
  if (action === "list") {
    console.log(formatTasteProfileList(graph));
    return;
  }
  if (action === "show") {
    const profileId = args.positionals[1] ?? graph.registry.defaultProfile;
    console.log(formatTasteProfile(graph, profileId));
    return;
  }
  if (action === "audit") {
    const filePath = args.positionals[1];
    if (!filePath) {
      throw new Error("Command \"taste audit\" requires a .dzine.html file path.");
    }
    const document = await readDocument(filePath);
    const report = auditTaste({ document, graph, options: { profileId: typeof args.flags.profile === "string" ? args.flags.profile : undefined } });
    const output = formatTasteAuditMarkdown(report);
    if (typeof args.flags.out === "string") {
      const outPath = resolve(args.flags.out);
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, output, "utf8");
      await writeFile(outPath.replace(/\.md$/i, ".json"), JSON.stringify(report, null, 2), "utf8");
      console.log(`Wrote ${outPath}`);
    } else {
      console.log(output);
    }
    if (!report.passed) {
      process.exitCode = 1;
    }
    return;
  }
  throw new Error(`Unknown taste action: ${action}`);
}

async function resolveDefaultTasteRegistry(): Promise<string> {
  const localRegistry = resolve("dzine/taste/registry.json");
  try {
    await access(localRegistry);
    return localRegistry;
  } catch {
    const cliDir = dirname(fileURLToPath(import.meta.url));
    return resolve(cliDir, "..", "..", "dzine/taste/registry.json");
  }
}

async function readDocument(filePath: string) {
  const absolutePath = resolve(filePath);
  try {
    const html = await readFile(absolutePath, "utf8");
    return parseDzineHtml(html, { filePath: absolutePath });
  } catch (error) {
    if (error instanceof DzineParseError) {
      for (const diagnostic of error.diagnostics) {
        console.error(`[${diagnostic.level}] ${diagnostic.code}: ${diagnostic.message}`);
      }
    }
    throw error;
  }
}

async function writeOrPrint(output: string, outFlag: string | boolean | undefined): Promise<void> {
  if (typeof outFlag === "string") {
    const absolutePath = resolve(outFlag);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, output, "utf8");
    console.log(`Wrote ${absolutePath}`);
  } else {
    console.log(output);
  }
}

function requireFile(args: ParsedArgs): string {
  const filePath = args.positionals[0];
  if (!filePath) {
    throw new Error(`Command "${args.command}" requires a .dzine.html file path.`);
  }
  return filePath;
}

function parseArgs(argv: string[]): ParsedArgs {
  const [command, ...rest] = argv;
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg.startsWith("--")) {
      const [rawName, inlineValue] = arg.slice(2).split("=", 2);
      if (inlineValue !== undefined) {
        flags[rawName] = inlineValue;
      } else if (rest[index + 1] && !rest[index + 1].startsWith("-")) {
        flags[rawName] = rest[index + 1];
        index += 1;
      } else {
        flags[rawName] = true;
      }
    } else if (arg.startsWith("-")) {
      flags[arg.slice(1)] = true;
    } else {
      positionals.push(arg);
    }
  }

  return { command, flags, positionals };
}

function printHelp(): void {
  console.log(`D-ZINE 3.0 CLI

Usage:
  dzine init [dir] --name "Project" --mode web --dialect precision-product
  dzine compile <file.dzine.html> --kind prompt|goal|recipe --out prompt.txt
  dzine export <file.dzine.html> --target all --out exports
  dzine audit <file.dzine.html> --visual --out reports
  dzine screenshot <file.dzine.html> --out screenshots
  dzine preview <file.dzine.html> --port 4310
  dzine goal <file.dzine.html> --max-chars 4000
  dzine site build --config dzine.config.json --out website
  dzine site audit --config dzine.config.json --out reports/website/site-audit --port 6200
  dzine taste list
  dzine taste show precision-product
  dzine taste audit <file.dzine.html> --profile precision-product --out reports/taste.md

Goal 3 prompt:
${nextGoalPrompt()}
`);
}

const isDirectRun = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectRun) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
