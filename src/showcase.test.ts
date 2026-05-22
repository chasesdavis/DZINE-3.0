import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { auditDzineDocument } from "./audit/auditDocument.js";
import { compileDzine } from "./compiler/compilePrompt.js";
import { parseDzineHtml } from "./parser/parseDzineHtml.js";

describe("D-ZINE showcase", () => {
  const html = readFileSync("examples/showcase/dzine-3-showcase.dzine.html", "utf8");
  const document = parseDzineHtml(html, { filePath: "examples/showcase/dzine-3-showcase.dzine.html" });

  it("parses the showcase with web, mobile, and brand recipes", () => {
    expect(document.metadata.title).toBe("D-ZINE 3.0 Showcase");
    expect(document.recipes.map((recipe) => recipe.id)).toEqual(["web-landing", "mobile-app-flow", "brand-kit"]);
    expect(document.visibleSections).toContain("quality-gates");
  });

  it("passes document audit and compiles prompt output", () => {
    const report = auditDzineDocument(document);
    expect(report.passed).toBe(true);
    const prompt = compileDzine(document, { kind: "prompt" });
    expect(prompt).toContain("D-ZINE Agent Prompt");
    expect(prompt).toContain("web-landing");
    expect(prompt).toContain("mobile-app-flow");
    expect(prompt).toContain("brand-kit");
  });
});

describe("D-ZINE product website", () => {
  const html = readFileSync("dzine/pages/home.dzine.html", "utf8");
  const document = parseDzineHtml(html, { filePath: "dzine/pages/home.dzine.html" });

  it("has a valid D-ZINE home source artifact", () => {
    expect(document.metadata.title).toBe("D-ZINE 3.0 Website");
    expect(document.recipes.map((recipe) => recipe.id)).toContain("web-landing");
    expect(document.recipes.map((recipe) => recipe.id)).toContain("mobile-app-flow");
    expect(document.recipes.map((recipe) => recipe.id)).toContain("brand-kit");
    expect(document.visibleSections).toEqual(expect.arrayContaining(["overview", "design-dna", "tokens", "recipes", "components", "anti-patterns", "quality-gates"]));
  });
});
