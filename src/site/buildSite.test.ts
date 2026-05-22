import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildDzineSite } from "./buildSite.js";
import { loadSiteConfig } from "./config.js";

describe("D-ZINE site generator", () => {
  it("generates the configured multi-page website", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "dzine-site-"));
    try {
      const { config, rootDir } = await loadSiteConfig("dzine.config.json");
      const result = await buildDzineSite({ config, rootDir, outDir: tempDir, clean: true });

      expect(result.pages.map((page) => page.route)).toEqual(["/", "/docs/", "/taste/", "/framework/", "/showcase/"]);
      expect(existsSync(join(tempDir, "index.html"))).toBe(true);
      expect(existsSync(join(tempDir, "docs", "index.html"))).toBe(true);
      expect(existsSync(join(tempDir, "taste", "index.html"))).toBe(true);
      expect(existsSync(join(tempDir, "framework", "index.html"))).toBe(true);
      expect(existsSync(join(tempDir, "showcase", "index.html"))).toBe(true);
      expect(existsSync(join(tempDir, "theme.css"))).toBe(true);
      expect(existsSync(join(tempDir, "assets", "dzine-showcase-desktop.png"))).toBe(true);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
