import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { z } from "zod";
import { formatTasteZodError, tasteContractSchema, tasteProfileSchema, tasteRegistrySchema, tasteSourceSchema } from "./schemas.js";
import type { TasteContract, TasteGraph, TasteProfile, TasteRegistry, TasteSource } from "./types.js";

export async function loadTasteGraph(registryPath = "dzine/taste/registry.json"): Promise<TasteGraph> {
  const absoluteRegistryPath = resolve(registryPath);
  const rootDir = dirname(absoluteRegistryPath);
  const registry = await readJsonFile(absoluteRegistryPath, tasteRegistrySchema, "taste registry") as TasteRegistry;
  const sources = await Promise.all(registry.sources.map((sourcePath) => readJsonFile(resolve(rootDir, sourcePath), tasteSourceSchema, "taste source") as Promise<TasteSource>));
  const contracts = await Promise.all(registry.contracts.map((contractPath) => readJsonFile(resolve(rootDir, contractPath), tasteContractSchema, "taste contract") as Promise<TasteContract>));
  const profiles = await Promise.all(registry.profiles.map((profilePath) => readJsonFile(resolve(rootDir, profilePath), tasteProfileSchema, "taste profile") as Promise<TasteProfile>));
  return { rootDir, registry, sources, contracts, profiles };
}

export function resolveTasteProfile(graph: TasteGraph, profileId?: string): TasteProfile {
  const id = profileId ?? graph.registry.defaultProfile;
  const profile = graph.profiles.find((item) => item.id === id);
  if (!profile) {
    throw new Error(`Unknown taste profile: ${id}`);
  }
  return profile;
}

export function resolveTasteContracts(graph: TasteGraph, profile: TasteProfile): TasteContract[] {
  return profile.contracts.map((contractId) => {
    const contract = graph.contracts.find((item) => item.id === contractId);
    if (!contract) {
      throw new Error(`Taste profile "${profile.id}" references unknown contract "${contractId}".`);
    }
    return contract;
  });
}

export function resolveTasteSources(graph: TasteGraph, profile: TasteProfile): TasteSource[] {
  return profile.sources.map((sourceId) => {
    const source = graph.sources.find((item) => item.id === sourceId);
    if (!source) {
      throw new Error(`Taste profile "${profile.id}" references unknown source "${sourceId}".`);
    }
    return source;
  });
}

async function readJsonFile(path: string, schema: z.ZodType, label: string): Promise<unknown> {
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  const result = schema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Invalid ${label} at ${path}: ${formatTasteZodError(result.error)}`);
  }
  return result.data;
}
