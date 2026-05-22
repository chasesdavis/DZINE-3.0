import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { DzineDocument } from "../core/types.js";
import { parseDzineHtml } from "../parser/parseDzineHtml.js";
import { auditTaste } from "./auditTaste.js";
import { loadTasteGraph, resolveTasteProfile } from "./registry.js";

describe("D-ZINE Taste Kernel", () => {
  it("loads the taste graph and resolves the default profile", async () => {
    const graph = await loadTasteGraph("dzine/taste/registry.json");
    const profile = resolveTasteProfile(graph);

    expect(graph.sources.length).toBeGreaterThanOrEqual(4);
    expect(graph.contracts.map((contract) => contract.id)).toContain("anti-slop");
    expect(profile.id).toBe("precision-product");
    expect(profile.sources).toContain("design-md-ecosystem");
  });

  it("passes the D-ZINE home source against precision-product", async () => {
    const graph = await loadTasteGraph("dzine/taste/registry.json");
    const html = readFileSync("dzine/pages/home.dzine.html", "utf8");
    const document = parseDzineHtml(html, { filePath: "dzine/pages/home.dzine.html" });
    const report = auditTaste({ document, graph, options: { profileId: "precision-product" } });

    expect(report.passed).toBe(true);
    expect(report.score).toBeGreaterThanOrEqual(82);
  });

  it("fails generic AI SaaS slop even when a document shape exists", async () => {
    const graph = await loadTasteGraph("dzine/taste/registry.json");
    const document = makeGenericSlopDocument();
    const report = auditTaste({ document, graph, options: { profileId: "precision-product" } });

    expect(report.passed).toBe(false);
    expect(report.findings.map((finding) => finding.category)).toContain("anti-slop");
    expect(report.findings.map((finding) => finding.category)).toContain("proof");
  });
});

function makeGenericSlopDocument(): DzineDocument {
  return {
    filePath: "generic-slop.dzine.html",
    html: `<!doctype html><html data-dzine-version="3.0"><body><main><section><h1>Elevate your workflow with seamless next-gen automation</h1><p>Trusted by thousands with 99.99% uptime and 10x productivity.</p><div class="card"></div><div class="card"></div><div class="card"></div></section></main></body></html>`,
    metadata: {
      schemaVersion: "3.0.0",
      kind: "dzine.document",
      title: "Generic Slop",
      modes: ["web"],
      sourceFormat: ".dzine.html",
      quality: { profile: "test" }
    },
    recipes: [],
    visualDialects: [],
    components: [],
    antiPatterns: [],
    acceptanceGates: [],
    visibleSections: ["overview", "design-dna", "tokens", "recipes", "components", "anti-patterns", "quality-gates"],
    jsonBlocks: [],
    diagnostics: []
  };
}
