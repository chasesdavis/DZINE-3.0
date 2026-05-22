import type { AuditFinding, DzineDocument, DzineSeverity } from "../core/types.js";

export interface TasteRegistry {
  schemaVersion: string;
  kind: "dzine.taste.registry";
  name: string;
  description: string;
  defaultProfile: string;
  sources: string[];
  profiles: string[];
  contracts: string[];
  critiques?: string[];
  community?: {
    directory: string;
    policy: string;
  };
}

export interface TasteSourceReference {
  label: string;
  url: string;
  use: string;
}

export interface TasteSource {
  kind: "dzine.taste.source";
  id: string;
  name: string;
  category: string;
  provenance: TasteSourceReference[];
  licenseNotes: string;
  allowedUse: string[];
  extractedSignals: string[];
}

export interface TasteContractRule {
  id: string;
  weight: number;
  check: string;
  failOn?: string[];
}

export interface TasteContract {
  kind: "dzine.taste.contract";
  id: string;
  name: string;
  description: string;
  severity: DzineSeverity;
  rules: TasteContractRule[];
  remediation: string;
}

export interface TasteRubricCategory {
  id: string;
  weight: number;
}

export interface TasteProfile {
  kind: "dzine.taste.profile";
  id: string;
  name: string;
  version: string;
  status: "seed" | "community" | "local" | "reviewed";
  description: string;
  extends?: string[];
  sources: string[];
  contracts: string[];
  licenseNotes: string;
  allowedUse: string[];
  principles: string[];
  positiveExamples: string[];
  antiPatterns: string[];
  typographyRules: string[];
  layoutRules: string[];
  componentRules: string[];
  copyRules: string[];
  screenshotNotes: string[];
  rubric: {
    pass: number;
    elite: number;
    categories: TasteRubricCategory[];
  };
}

export interface TasteGraph {
  rootDir: string;
  registry: TasteRegistry;
  sources: TasteSource[];
  contracts: TasteContract[];
  profiles: TasteProfile[];
}

export interface TasteAuditReport {
  file?: string;
  profile: string;
  score: number;
  passed: boolean;
  level: "fail" | "pass" | "elite";
  findings: AuditFinding[];
  checks: Record<string, unknown>;
  recommendations: string[];
}

export interface TasteAuditOptions {
  profileId?: string;
}

export interface TasteAuditInput {
  document: DzineDocument;
  graph: TasteGraph;
  options?: TasteAuditOptions;
}
