import { describe, expect, it } from "vitest";
import { auditDzineDocument } from "./auditDocument.js";
import { parseDzineHtml } from "../parser/parseDzineHtml.js";
import { createSampleDzineHtml } from "../samples/sampleProject.js";

describe("auditDzineDocument", () => {
  it("passes the generated sample document", () => {
    const document = parseDzineHtml(createSampleDzineHtml({ name: "Audit Sample", mode: "web", dialect: "precision-product" }));
    const report = auditDzineDocument(document);
    expect(report.passed).toBe(true);
    expect(report.score).toBeGreaterThanOrEqual(85);
  });
});
