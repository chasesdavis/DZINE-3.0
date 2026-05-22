import { describe, expect, it } from "vitest";
import { parseDzineHtml } from "./parseDzineHtml.js";
import { createSampleDzineHtml } from "../samples/sampleProject.js";

describe("parseDzineHtml", () => {
  it("parses a sample .dzine.html document", () => {
    const html = createSampleDzineHtml({ name: "D-ZINE Lab", mode: "web", dialect: "precision-product" });
    const document = parseDzineHtml(html, { filePath: "project.dzine.html" });

    expect(document.metadata.title).toBe("D-ZINE Lab");
    expect(document.metadata.sourceFormat).toBe(".dzine.html");
    expect(document.tokens?.format).toBe("dtcg");
    expect(document.recipes[0]?.id).toBe("web-landing");
    expect(document.components[0]?.id).toBe("primary-action");
    expect(document.visibleSections).toContain("quality-gates");
  });
});
