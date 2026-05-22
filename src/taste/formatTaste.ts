import { resolveTasteContracts, resolveTasteProfile, resolveTasteSources } from "./registry.js";
import type { TasteGraph } from "./types.js";

export function formatTasteProfile(graph: TasteGraph, profileId?: string): string {
  const profile = resolveTasteProfile(graph, profileId);
  const sources = resolveTasteSources(graph, profile);
  const contracts = resolveTasteContracts(graph, profile);
  return `# ${profile.name}

- ID: ${profile.id}
- Version: ${profile.version}
- Status: ${profile.status}
- Pass: ${profile.rubric.pass}
- Elite: ${profile.rubric.elite}

${profile.description}

## Sources

${sources.map((source) => `- **${source.name}** (${source.id})\n${source.provenance.map((item) => `  - ${item.label}: ${item.url}`).join("\n")}`).join("\n")}

## Contracts

${contracts.map((contract) => `- **${contract.name}** (${contract.id}) — ${contract.description}`).join("\n")}

## Principles

${profile.principles.map((item) => `- ${item}`).join("\n")}

## Anti-Patterns

${profile.antiPatterns.map((item) => `- ${item}`).join("\n")}

## Copy Rules

${profile.copyRules.map((item) => `- ${item}`).join("\n")}
`;
}

export function formatTasteProfileList(graph: TasteGraph): string {
  return graph.profiles.map((profile) => {
    const marker = profile.id === graph.registry.defaultProfile ? "default" : profile.status;
    return `- ${profile.id} (${marker}): ${profile.description}`;
  }).join("\n");
}
