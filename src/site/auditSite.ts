import { mkdir, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { auditDzineDocument, formatAuditMarkdown, mergeAuditReports } from "../audit/auditDocument.js";
import { DzineParseError, parseDzineHtml } from "../parser/parseDzineHtml.js";
import { runVisualAudit } from "../preview/visualAudit.js";
import { buildDzineSite } from "./buildSite.js";
import type { DzineSiteBuildResult, DzineSiteConfig } from "./types.js";

export interface AuditSiteOptions {
  config: DzineSiteConfig;
  rootDir: string;
  reportDir: string;
  siteOutDir?: string;
  port?: number;
}

export async function auditDzineSite(options: AuditSiteOptions): Promise<DzineSiteBuildResult & { passed: boolean; reportPath: string }> {
  const build = await buildDzineSite({
    config: options.config,
    rootDir: options.rootDir,
    outDir: options.siteOutDir ?? options.config.outputDir ?? "website",
    clean: true
  });
  const reportDir = resolve(options.rootDir, options.reportDir);
  await mkdir(reportDir, { recursive: true });

  const summaries: string[] = ["# D-ZINE Site Audit", ""];
  let passed = true;
  let port = options.port ?? 4910;

  for (const builtPage of build.pages) {
    const pagePort = port;
    port += 1;
    const html = await import("node:fs/promises").then((fs) => fs.readFile(builtPage.outputPath, "utf8"));
    try {
      const document = parseDzineHtml(html, { filePath: builtPage.outputPath });
      const documentReport = auditDzineDocument(document);
      const pageReportDir = join(reportDir, routeReportName(builtPage.route));
      const visualReport = await runVisualAudit(builtPage.outputPath, document, { outDir: join(pageReportDir, "screenshots"), port: pagePort, rootDir: build.outputDir });
      const report = mergeAuditReports(documentReport, visualReport);
      await mkdir(pageReportDir, { recursive: true });
      await writeFile(join(pageReportDir, "audit.json"), JSON.stringify(report, null, 2), "utf8");
      await writeFile(join(pageReportDir, "audit.md"), formatAuditMarkdown(report), "utf8");
      passed = passed && report.passed;
      summaries.push(`## ${builtPage.page.title}`, "", `- Route: ${builtPage.route}`, `- Output: ${builtPage.outputPath}`, `- Score: ${report.score}`, `- Passed: ${report.passed ? "yes" : "no"}`, "");
      if (report.findings.length > 0) {
        summaries.push("Findings:", ...report.findings.map((finding) => `- ${finding.severity} [${finding.category}] ${finding.message}`), "");
      }
    } catch (error) {
      passed = false;
      summaries.push(`## ${builtPage.page.title}`, "", `- Route: ${builtPage.route}`, "- Passed: no", `- Error: ${error instanceof DzineParseError ? "Invalid generated D-ZINE page." : String(error)}`, "");
    }
  }

  summaries.splice(2, 0, `- Pages: ${build.pages.length}`, `- Passed: ${passed ? "yes" : "no"}`, "");
  const reportPath = join(reportDir, "site-audit.md");
  await writeFile(reportPath, `${summaries.join("\n")}\n`, "utf8");
  return { ...build, passed, reportPath };
}

function routeReportName(route: string): string {
  if (route === "/") {
    return "home";
  }
  const name = basename(route.replace(/\/$/, ""));
  return name || "page";
}
