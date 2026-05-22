export type DzineMode = "web" | "mobile" | "app" | "brand-kit" | "brand-identity" | "redesign" | "image-to-code";

export type DzineSeverity = "minor" | "major" | "critical";

export interface DzineQuality {
  profile?: string;
  auditLevel?: "relaxed" | "standard" | "strict";
  antiSlopPolicy?: "warn" | "fail-on-major" | "fail-on-critical";
}

export interface DesignBrief {
  kind?: "dzine.brief";
  project: string;
  audience: string[];
  platforms: DzineMode[];
  objective: string;
  constraints: string[];
  successCriteria: string[];
  inputs?: string[];
  deliverables?: string[];
}

export interface DesignDNA {
  kind?: "dzine.designDNA";
  density: number;
  variance: number;
  motion: number;
  imagePriority: number;
  brandPosture: string;
  copyPosture: string;
  visualDialect: string;
  bannedPatterns: string[];
  requiredStates?: string[];
}

export interface VisualDialect {
  id: string;
  name: string;
  description: string;
  paletteRules: string[];
  typographyRules: string[];
  layoutRules: string[];
  motionRules: string[];
  imageryRules: string[];
  componentRules: string[];
  avoid: string[];
}

export interface TokenValue {
  $type: string;
  $value: unknown;
  $description?: string;
}

export interface TokenTree {
  [key: string]: TokenValue | TokenTree;
}

export interface TokenSet {
  kind?: "dzine.tokens";
  format: "dtcg";
  tokens: TokenTree;
  aliases?: Record<string, string>;
  themes?: Record<string, unknown>;
  modes?: string[];
  exports?: string[];
}

export interface Recipe {
  id: string;
  mode: DzineMode;
  description?: string;
  sections: string[];
  inputs?: string[];
  requiredStates: string[];
  imagePolicy: string;
  acceptanceGates: string[];
  promptSections?: string[];
}

export interface ComponentSpecimen {
  id: string;
  platform: DzineMode | "all";
  html: string;
  tokens: string[];
  states: string[];
  accessibility: string[];
  antiPatterns: string[];
}

export interface MotionContract {
  intensity: number;
  allowedProperties: string[];
  durationScale: Record<string, string>;
  easing: Record<string, string>;
  reducedMotion: string;
  performanceNotes: string[];
}

export interface AccessibilityContract {
  contrastTarget: string;
  focusPolicy: string;
  targetSize: string;
  semanticPolicy: string;
  colorOnlyPolicy: string;
  reducedMotionPolicy: string;
  keyboardPolicy: string;
}

export interface AntiPattern {
  id: string;
  name: string;
  description: string;
  severity: DzineSeverity;
  detect?: string[];
  remediation: string;
  examples?: string[];
}

export interface RubricCategory {
  id: string;
  weight: number;
}

export interface CritiqueRubric {
  kind?: "dzine.rubric";
  scoring: {
    scale: number;
    pass: number;
    elite: number;
  };
  categories: RubricCategory[];
  criticalFailures: string[];
}

export interface AcceptanceGate {
  id: string;
  kind: "document" | "visual" | "accessibility" | "motion" | "anti-slop" | "export";
  description: string;
  severity: DzineSeverity;
  check: string;
  failureMessage: string;
}

export interface DzineMetadata {
  schemaVersion: string;
  kind: "dzine.document";
  title: string;
  description?: string;
  modes: DzineMode[];
  visualDialect?: string;
  sourceFormat: ".dzine.html";
  createdBy?: string;
  quality: DzineQuality;
  exports?: string[];
}

export interface DzineJsonBlock {
  id: string;
  kind: string;
  value: unknown;
}

export interface DzineDocument {
  filePath?: string;
  html: string;
  metadata: DzineMetadata;
  brief?: DesignBrief;
  designDNA?: DesignDNA;
  tokens?: TokenSet;
  recipes: Recipe[];
  visualDialects: VisualDialect[];
  components: ComponentSpecimen[];
  antiPatterns: AntiPattern[];
  rubric?: CritiqueRubric;
  acceptanceGates: AcceptanceGate[];
  visibleSections: string[];
  jsonBlocks: DzineJsonBlock[];
  diagnostics: DzineDiagnostic[];
}

export interface DzineDiagnostic {
  level: "info" | "warning" | "error";
  code: string;
  message: string;
  source?: string;
}

export interface AuditFinding {
  severity: DzineSeverity;
  category: string;
  message: string;
  remediation: string;
}

export interface AuditReport {
  file?: string;
  target?: string;
  score: number;
  passed: boolean;
  findings: AuditFinding[];
  screenshots: string[];
  checks?: Record<string, unknown>;
  recommendations: string[];
}

export interface ExportBundle {
  prompt: string;
  goal: string;
  tokensJson: string;
  cssVariables: string;
  tailwindConfig: string;
  markdown: string;
}
