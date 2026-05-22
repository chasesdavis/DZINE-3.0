import type { AuditFinding, DzineSeverity } from "../core/types.js";
import { resolveTasteContracts, resolveTasteProfile, resolveTasteSources } from "./registry.js";
import type { TasteAuditInput, TasteAuditReport, TasteContract, TasteProfile } from "./types.js";

const GENERIC_COPY = ["elevate", "unleash", "seamless", "next-gen", "supercharge", "transform your workflow", "revolutionize", "effortless"];
const FAKE_METRICS = ["99.99%", "10x", "1m+", "trusted by thousands", "50%"];
const PROOF_TERMS = ["report", "audit", "screenshot", "source", "token", "docs", "command", "github", "route", "export", "config", "cli"];
const RHYTHM_TERMS = ["architecture", "proof-layout", "specimen", "compare", "doc-grid", "flow", "token-strip", "install-band"];

export function auditTaste(input: TasteAuditInput): TasteAuditReport {
  const profile = resolveTasteProfile(input.graph, input.options?.profileId);
  const contracts = resolveTasteContracts(input.graph, profile);
  const sources = resolveTasteSources(input.graph, profile);
  const html = input.document.html;
  const text = visibleText(html);
  const lowerText = text.toLowerCase();
  const lowerHtml = html.toLowerCase();
  const findings: AuditFinding[] = [];

  const declaredProfile = declaredTasteProfile(html);
  if (declaredProfile && declaredProfile !== profile.id) {
    findings.push(finding("minor", "taste-profile", `Document declares taste profile "${declaredProfile}" but audit used "${profile.id}".`, "Audit with the declared profile or update the document declaration."));
  }
  if (!declaredProfile) {
    findings.push(finding("major", "taste-profile", "Document does not declare an active taste profile.", "Add data-taste-profile or dzine.taste metadata so agents know which taste contract governs the page."));
  }

  const genericHits = GENERIC_COPY.filter((term) => lowerText.includes(term));
  if (genericHits.length > 0) {
    findings.push(finding("critical", "anti-slop", `Generic AI/SaaS copy detected: ${genericHits.join(", ")}.`, "Replace vague hype with product-specific nouns, proof artifacts, and concrete user outcomes."));
  }

  const fakeMetricHits = FAKE_METRICS.filter((term) => lowerText.includes(term));
  if (fakeMetricHits.length > 0) {
    findings.push(finding("critical", "proof", `Unverified metric language detected: ${fakeMetricHits.join(", ")}.`, "Remove fake metrics or cite real measured evidence."));
  }

  const proofCount = countMatches(lowerText, PROOF_TERMS);
  if (proofCount < 7) {
    findings.push(finding("major", "proof-density", `Only ${proofCount} product-proof signals found.`, "Add concrete commands, screenshots, reports, source paths, route names, token exports, or GitHub evidence."));
  }

  const rhythmCount = countMatches(lowerHtml, RHYTHM_TERMS);
  if (rhythmCount < 4) {
    findings.push(finding("major", "layout-rhythm", `Only ${rhythmCount} layout-rhythm signals found.`, "Vary the page with architecture, proof, specimens, docs, critique comparisons, and workflow sections."));
  }

  if (!/<pre\b|class="[^"]*code|<code\b/i.test(html)) {
    findings.push(finding("major", "typography", "No code or command surface found.", "Add a readable command/source surface when using a developer-product taste profile."));
  }

  if (input.document.visibleSections.length < 7) {
    findings.push(finding("major", "structure", `Only ${input.document.visibleSections.length} D-ZINE visible sections found.`, "Keep the full D-ZINE section contract so taste can be evaluated in context."));
  }

  for (const contract of contracts) {
    findings.push(...contractFindings(contract, lowerText));
  }

  const completenessFindings = profileCompletenessFindings(profile, sources.length, contracts.length);
  findings.push(...completenessFindings);

  const score = Math.max(0, 100 - findings.reduce((sum, item) => sum + severityCost(item.severity), 0));
  const passed = findings.every((item) => item.severity !== "critical") && score >= profile.rubric.pass;
  const level = !passed ? "fail" : score >= profile.rubric.elite ? "elite" : "pass";
  return {
    file: input.document.filePath,
    profile: profile.id,
    score,
    passed,
    level,
    findings,
    checks: {
      declaredProfile,
      sourceCount: sources.length,
      contractCount: contracts.length,
      proofCount,
      rhythmCount,
      genericHits,
      fakeMetricHits,
      visibleSections: input.document.visibleSections
    },
    recommendations: findings.length === 0 ? ["ship"] : ["revise against taste contract", "rerun dzine taste audit"]
  };
}

export function formatTasteAuditMarkdown(report: TasteAuditReport): string {
  return `# D-ZINE Taste Audit

- Profile: ${report.profile}
- Score: ${report.score}
- Level: ${report.level}
- Passed: ${report.passed ? "yes" : "no"}
- Recommendation: ${report.recommendations.join(", ")}

## Findings

${report.findings.length === 0 ? "No findings." : report.findings.map((item) => `- **${item.severity}** [${item.category}] ${item.message} Remediation: ${item.remediation}`).join("\n")}
`;
}

function contractFindings(contract: TasteContract, lowerText: string): AuditFinding[] {
  return contract.rules.flatMap((rule) => {
    const hits = (rule.failOn ?? []).filter((term) => lowerText.includes(term.toLowerCase()));
    if (hits.length === 0) {
      return [];
    }
    return [finding(contract.severity, contract.id, `${contract.name} rule "${rule.id}" detected: ${hits.join(", ")}.`, contract.remediation)];
  });
}

function profileCompletenessFindings(profile: TasteProfile, sourceCount: number, contractCount: number): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (sourceCount === 0) {
    findings.push(finding("critical", "source-provenance", `Taste profile "${profile.id}" has no resolved sources.`, "Attach source-backed provenance before using this profile."));
  }
  if (contractCount === 0) {
    findings.push(finding("critical", "contracts", `Taste profile "${profile.id}" has no resolved contracts.`, "Attach taste contracts before using this profile."));
  }
  if (profile.principles.length < 3 || profile.antiPatterns.length < 3) {
    findings.push(finding("major", "profile-depth", `Taste profile "${profile.id}" is too shallow.`, "Add principles, positive examples, anti-patterns, and rubric categories."));
  }
  return findings;
}

function declaredTasteProfile(html: string): string | undefined {
  const dataMatch = html.match(/data-taste-profile=["']([^"']+)["']/i);
  if (dataMatch) {
    return dataMatch[1];
  }
  const jsonMatch = html.match(/"tasteProfile"\s*:\s*"([^"]+)"/i);
  return jsonMatch?.[1];
}

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(input: string, terms: string[]): number {
  return terms.reduce((count, term) => count + (input.includes(term) ? 1 : 0), 0);
}

function finding(severity: DzineSeverity, category: string, message: string, remediation: string): AuditFinding {
  return { severity, category, message, remediation };
}

function severityCost(severity: DzineSeverity): number {
  if (severity === "critical") {
    return 35;
  }
  if (severity === "major") {
    return 9;
  }
  return 3;
}
