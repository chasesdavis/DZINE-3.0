import { describe, expect, it } from "vitest";
import { compileDzine } from "../compiler/compilePrompt.js";
import { parseDzineHtml } from "../parser/parseDzineHtml.js";
import { createSampleDzineHtml } from "../samples/sampleProject.js";
import { exportCssVariables, exportDzine, exportTailwindConfig } from "./exportDzine.js";

describe("D-ZINE compile and export", () => {
  const document = parseDzineHtml(createSampleDzineHtml({ name: "Signal Studio", mode: "web", dialect: "precision-product" }));

  it("compiles an agent-ready prompt", () => {
    const prompt = compileDzine(document, { kind: "prompt" });
    expect(prompt).toContain("D-ZINE Agent Prompt");
    expect(prompt).toContain("Non-Negotiable Anti-Slop Bans");
    expect(prompt).toContain(".dzine.html");
  });

  it("exports CSS variables", () => {
    const css = exportCssVariables(document);
    expect(css).toContain("--dz-color-background-canvas");
    expect(css).toContain("#f7f4ef");
  });

  it("exports a Tailwind theme fragment", () => {
    const config = exportTailwindConfig(document);
    expect(config).toContain("Generated from .dzine.html");
    expect(config).toContain("colors");
  });

  it("exports the complete bundle", () => {
    const bundle = exportDzine(document);
    expect(bundle.tokensJson).toContain("background");
    expect(bundle.markdown).toContain("not the source of truth");
    expect(bundle.goal).toContain("/goal");
  });
});
