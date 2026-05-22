import { z } from "zod";

const dzineModeSchema = z.enum(["web", "mobile", "app", "brand-kit", "brand-identity", "redesign", "image-to-code"]);
const severitySchema = z.enum(["minor", "major", "critical"]);

export const dzineMetadataSchema = z.object({
  schemaVersion: z.string().min(1),
  kind: z.literal("dzine.document"),
  title: z.string().min(1),
  description: z.string().optional(),
  modes: z.array(dzineModeSchema).min(1),
  visualDialect: z.string().optional(),
  sourceFormat: z.literal(".dzine.html"),
  createdBy: z.string().optional(),
  quality: z.object({
    profile: z.string().optional(),
    auditLevel: z.enum(["relaxed", "standard", "strict"]).optional(),
    antiSlopPolicy: z.enum(["warn", "fail-on-major", "fail-on-critical"]).optional()
  }).passthrough(),
  exports: z.array(z.string()).optional()
}).passthrough();

export const designBriefSchema = z.object({
  kind: z.literal("dzine.brief").optional(),
  project: z.string().min(1),
  audience: z.array(z.string()).default([]),
  platforms: z.array(dzineModeSchema).default([]),
  objective: z.string().min(1),
  constraints: z.array(z.string()).default([]),
  successCriteria: z.array(z.string()).default([]),
  inputs: z.array(z.string()).optional(),
  deliverables: z.array(z.string()).optional()
}).passthrough();

export const designDNASchema = z.object({
  kind: z.literal("dzine.designDNA").optional(),
  density: z.number().min(1).max(10),
  variance: z.number().min(1).max(10),
  motion: z.number().min(1).max(10),
  imagePriority: z.number().min(1).max(10),
  brandPosture: z.string(),
  copyPosture: z.string(),
  visualDialect: z.string(),
  bannedPatterns: z.array(z.string()).default([]),
  requiredStates: z.array(z.string()).optional()
}).passthrough();

export const visualDialectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  paletteRules: z.array(z.string()).default([]),
  typographyRules: z.array(z.string()).default([]),
  layoutRules: z.array(z.string()).default([]),
  motionRules: z.array(z.string()).default([]),
  imageryRules: z.array(z.string()).default([]),
  componentRules: z.array(z.string()).default([]),
  avoid: z.array(z.string()).default([])
}).passthrough();

export const tokenSetSchema = z.object({
  kind: z.literal("dzine.tokens").optional(),
  format: z.literal("dtcg"),
  tokens: z.record(z.unknown()),
  aliases: z.record(z.string()).optional(),
  themes: z.record(z.unknown()).optional(),
  modes: z.array(z.string()).optional(),
  exports: z.array(z.string()).optional()
}).passthrough();

export const recipeSchema = z.object({
  id: z.string().min(1),
  mode: dzineModeSchema,
  description: z.string().optional(),
  sections: z.array(z.string()).min(1),
  inputs: z.array(z.string()).optional(),
  requiredStates: z.array(z.string()).default([]),
  imagePolicy: z.string().default("documented-in-dzine"),
  acceptanceGates: z.array(z.string()).default([]),
  promptSections: z.array(z.string()).optional()
}).passthrough();

export const componentSpecimenSchema = z.object({
  id: z.string().min(1),
  platform: z.union([dzineModeSchema, z.literal("all")]),
  html: z.string(),
  tokens: z.array(z.string()).default([]),
  states: z.array(z.string()).default([]),
  accessibility: z.array(z.string()).default([]),
  antiPatterns: z.array(z.string()).default([])
}).passthrough();

export const motionContractSchema = z.object({
  intensity: z.number().min(1).max(10),
  allowedProperties: z.array(z.string()),
  durationScale: z.record(z.string()),
  easing: z.record(z.string()),
  reducedMotion: z.string(),
  performanceNotes: z.array(z.string()).default([])
}).passthrough();

export const accessibilityContractSchema = z.object({
  contrastTarget: z.string(),
  focusPolicy: z.string(),
  targetSize: z.string(),
  semanticPolicy: z.string(),
  colorOnlyPolicy: z.string(),
  reducedMotionPolicy: z.string(),
  keyboardPolicy: z.string()
}).passthrough();

export const antiPatternSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  severity: severitySchema,
  detect: z.array(z.string()).optional(),
  remediation: z.string().min(1),
  examples: z.array(z.string()).optional()
}).passthrough();

export const critiqueRubricSchema = z.object({
  kind: z.literal("dzine.rubric").optional(),
  scoring: z.object({
    scale: z.number().positive(),
    pass: z.number().positive(),
    elite: z.number().positive()
  }),
  categories: z.array(z.object({
    id: z.string().min(1),
    weight: z.number().positive()
  })),
  criticalFailures: z.array(z.string()).default([])
}).passthrough();

export const acceptanceGateSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(["document", "visual", "accessibility", "motion", "anti-slop", "export"]),
  description: z.string().min(1),
  severity: severitySchema,
  check: z.string().min(1),
  failureMessage: z.string().min(1)
}).passthrough();

export function formatZodError(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`).join("; ");
}
