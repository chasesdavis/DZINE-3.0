import { REQUIRED_SECTIONS } from "../core/constants.js";
import type { AuditFinding, AuditReport, DzineDocument, DzineSeverity } from "../core/types.js";

export function auditDzineDocument(document: DzineDocument): AuditReport {
  const findings: AuditFinding[] = [];

  for (const section of REQUIRED_SECTIONS) {
    if (!document.visibleSections.includes(section)) {
      findings.push(finding("major", "document", `Missing visible section: ${section}`, "Add a visible section with the matching data-dzine-section value."));
    }
  }

  if (!document.tokens) {
    findings.push(finding("critical", "tokens", "Missing DTCG-compatible tokens.", "Add a dzine.tokens JSON block."));
  }

  if (document.recipes.length === 0) {
    findings.push(finding("critical", "recipes", "Missing recipes.", "Add dzine.recipes metadata or data-dzine-recipe elements."));
  }

  if (!document.rubric) {
    findings.push(finding("critical", "quality", "Missing QA rubric.", "Add a dzine.rubric JSON block."));
  }

  for (const diagnostic of document.diagnostics) {
    if (diagnostic.level !== "info") {
      findings.push(finding(diagnostic.level === "error" ? "critical" : "major", "parser", diagnostic.message, "Update the .dzine.html source to satisfy the parser contract."));
    }
  }

  const score = Math.max(0, 100 - findings.reduce((total, item) => total + severityCost(item.severity), 0));
  const passed = findings.every((item) => item.severity !== "critical") && score >= 85;

  return {
    file: document.filePath,
    score,
    passed,
    findings,
    screenshots: [],
    recommendations: passed ? ["ship"] : ["revise", "rerun dzine audit after remediation"]
  };
}

export function formatAuditMarkdown(report: AuditReport): string {
  return `# D-ZINE Audit Report

- Score: ${report.score}
- Passed: ${report.passed ? "yes" : "no"}
- Recommendation: ${report.recommendations.join(", ")}

## Screenshots

${report.screenshots.length === 0 ? "No screenshots captured." : report.screenshots.map((item) => `- ${item}`).join("\n")}

## Findings

${report.findings.length === 0 ? "No findings." : report.findings.map((item) => `- **${item.severity}** [${item.category}] ${item.message} Remediation: ${item.remediation}`).join("\n")}
`;
}

export function mergeAuditReports(documentReport: AuditReport, visualReport: AuditReport): AuditReport {
  const findings = [...documentReport.findings, ...visualReport.findings];
  const score = Math.min(documentReport.score, visualReport.score);
  return {
    file: documentReport.file ?? visualReport.file,
    target: visualReport.target ?? documentReport.target,
    score,
    passed: documentReport.passed && visualReport.passed,
    findings,
    screenshots: [...documentReport.screenshots, ...visualReport.screenshots],
    checks: {
      document: documentReport.checks,
      visual: visualReport.checks
    },
    recommendations: findings.length === 0 ? ["ship"] : ["revise", "rerun dzine audit --visual after remediation"]
  };
}

function finding(severity: DzineSeverity, category: string, message: string, remediation: string): AuditFinding {
  return { severity, category, message, remediation };
}

function severityCost(severity: DzineSeverity): number {
  if (severity === "critical") {
    return 40;
  }
  if (severity === "major") {
    return 10;
  }
  return 3;
}
