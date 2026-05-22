import { z } from "zod";

const referenceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  use: z.string().min(1)
});

export const tasteRegistrySchema = z.object({
  schemaVersion: z.string().min(1),
  kind: z.literal("dzine.taste.registry"),
  name: z.string().min(1),
  description: z.string().min(1),
  defaultProfile: z.string().min(1),
  sources: z.array(z.string()).default([]),
  profiles: z.array(z.string()).default([]),
  contracts: z.array(z.string()).default([]),
  critiques: z.array(z.string()).optional(),
  community: z.object({
    directory: z.string().min(1),
    policy: z.string().min(1)
  }).optional()
}).passthrough();

export const tasteSourceSchema = z.object({
  kind: z.literal("dzine.taste.source"),
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  provenance: z.array(referenceSchema).min(1),
  licenseNotes: z.string().min(1),
  allowedUse: z.array(z.string()).min(1),
  extractedSignals: z.array(z.string()).min(1)
}).passthrough();

export const tasteContractSchema = z.object({
  kind: z.literal("dzine.taste.contract"),
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(["minor", "major", "critical"]),
  rules: z.array(z.object({
    id: z.string().min(1),
    weight: z.number().positive(),
    check: z.string().min(1),
    failOn: z.array(z.string()).optional()
  })).min(1),
  remediation: z.string().min(1)
}).passthrough();

export const tasteProfileSchema = z.object({
  kind: z.literal("dzine.taste.profile"),
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  status: z.enum(["seed", "community", "local", "reviewed"]),
  description: z.string().min(1),
  extends: z.array(z.string()).optional(),
  sources: z.array(z.string()).min(1),
  contracts: z.array(z.string()).min(1),
  licenseNotes: z.string().min(1),
  allowedUse: z.array(z.string()).min(1),
  principles: z.array(z.string()).min(1),
  positiveExamples: z.array(z.string()).min(1),
  antiPatterns: z.array(z.string()).min(1),
  typographyRules: z.array(z.string()).min(1),
  layoutRules: z.array(z.string()).min(1),
  componentRules: z.array(z.string()).min(1),
  copyRules: z.array(z.string()).min(1),
  screenshotNotes: z.array(z.string()).min(1),
  rubric: z.object({
    pass: z.number().positive(),
    elite: z.number().positive(),
    categories: z.array(z.object({
      id: z.string().min(1),
      weight: z.number().positive()
    })).min(1)
  })
}).passthrough();

export function formatTasteZodError(error: z.ZodError): string {
  return error.issues.map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`).join("; ");
}
