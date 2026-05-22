import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import type { AuditFinding, AuditReport, DzineDocument, DzineSeverity } from "../core/types.js";
import { startPreviewServer } from "./server.js";

export interface VisualAuditOptions {
  outDir: string;
  port?: number;
  rootDir?: string;
}

interface ViewportSpec {
  name: string;
  width: number;
  height: number;
}

const VIEWPORTS: ViewportSpec[] = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 834, height: 1112 },
  { name: "desktop", width: 1440, height: 1000 }
];

export async function runVisualAudit(filePath: string, document: DzineDocument, options: VisualAuditOptions): Promise<AuditReport> {
  const outDir = resolve(options.outDir);
  await mkdir(outDir, { recursive: true });
  const preview = await startPreviewServer(filePath, { port: options.port ?? 4311, rootDir: options.rootDir });
  let browser: Browser | undefined;
  const findings: AuditFinding[] = [];
  const screenshots: string[] = [];
  const checks: Record<string, unknown> = {};

  try {
    browser = await chromium.launch();
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      await page.goto(preview.url, { waitUntil: "networkidle" });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const screenshotPath = join(outDir, `${viewport.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      screenshots.push(screenshotPath);
      const viewportChecks = await collectViewportChecks(page);
      checks[viewport.name] = viewportChecks;
      findings.push(...findViewportIssues(viewport.name, viewportChecks));
      await page.close();
    }
  } finally {
    if (browser) {
      await browser.close();
    }
    await preview.close();
  }

  const hasReducedMotion = /prefers-reduced-motion/i.test(document.html);
  checks.reducedMotion = { declared: hasReducedMotion };
  if (!hasReducedMotion) {
    findings.push(finding("major", "motion", "No prefers-reduced-motion rule was detected.", "Add a reduced-motion media query that disables non-essential motion."));
  }

  const score = Math.max(0, 100 - findings.reduce((sum, item) => sum + severityCost(item.severity), 0));
  return {
    file: document.filePath,
    target: preview.url,
    score,
    passed: findings.every((item) => item.severity !== "critical") && score >= 85,
    findings,
    screenshots,
    checks,
    recommendations: findings.length === 0 ? ["ship"] : ["revise", "rerun dzine audit --visual after remediation"]
  };
}

async function collectViewportChecks(page: Page) {
  return page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const horizontalOverflow = Math.max(body.scrollWidth, html.scrollWidth) > width + 1;
    const textElements = Array.from(document.querySelectorAll("p, li, a, button, h1, h2, h3, label")).slice(0, 80);
    const textMetrics = textElements.map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        text: (element.textContent ?? "").trim().slice(0, 80),
        fontSize: parseFloat(style.fontSize),
        lineHeight: style.lineHeight,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none",
        contrast: contrastRatio(style.color, style.backgroundColor, element)
      };
    });
    const tinyText = textMetrics.filter((item) => item.visible && item.fontSize < 12);
    const lowContrast = textMetrics.filter((item) => item.visible && item.text && item.contrast !== null && item.contrast < 4.5 && !["h1", "h2"].includes(item.tag));
    const controls = Array.from(document.querySelectorAll("button, a, input, select, textarea, [role='button']")).map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        text: (element.textContent ?? element.getAttribute("aria-label") ?? "").trim().slice(0, 80),
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none"
      };
    });
    const smallTargets = controls.filter((item) => item.visible && (item.width < 44 || item.height < 44));
    const sections = document.querySelectorAll("[data-dzine-section]").length;
    const headings = Array.from(document.querySelectorAll("h1, h2")).map((element) => {
      const style = window.getComputedStyle(element);
      return { tag: element.tagName.toLowerCase(), fontSize: parseFloat(style.fontSize), text: (element.textContent ?? "").trim().slice(0, 80) };
    });
    return {
      width,
      height,
      horizontalOverflow,
      textCount: textMetrics.length,
      tinyText,
      lowContrast,
      controlCount: controls.length,
      smallTargets,
      sections,
      headings
    };

    function contrastRatio(color: string, background: string, element: Element): number | null {
      const foregroundRgb = parseRgb(color);
      let backgroundRgb = parseRgb(background);
      if (!foregroundRgb) {
        return null;
      }
      let parent = element.parentElement;
      while ((!backgroundRgb || backgroundRgb.alpha === 0) && parent) {
        backgroundRgb = parseRgb(window.getComputedStyle(parent).backgroundColor);
        parent = parent.parentElement;
      }
      const resolvedBackground = backgroundRgb && backgroundRgb.alpha !== 0 ? backgroundRgb : { red: 255, green: 255, blue: 255, alpha: 1 };
      const foregroundLum = luminance(foregroundRgb);
      const backgroundLum = luminance(resolvedBackground);
      const lighter = Math.max(foregroundLum, backgroundLum);
      const darker = Math.min(foregroundLum, backgroundLum);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function parseRgb(value: string): { red: number; green: number; blue: number; alpha: number } | null {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) {
        return null;
      }
      const parts = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
      if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) {
        return null;
      }
      return { red: parts[0], green: parts[1], blue: parts[2], alpha: parts[3] ?? 1 };
    }

    function luminance(rgb: { red: number; green: number; blue: number }): number {
      const channels = [rgb.red, rgb.green, rgb.blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    }
  });
}

function findViewportIssues(viewport: string, checks: Awaited<ReturnType<typeof collectViewportChecks>>): AuditFinding[] {
  const findings: AuditFinding[] = [];
  if (checks.horizontalOverflow) {
    findings.push(finding("critical", "responsive", `${viewport} layout has horizontal overflow.`, "Constrain widths and remove off-canvas layout drift."));
  }
  if (checks.sections < 7) {
    findings.push(finding("major", "visual-hierarchy", `${viewport} preview has fewer than seven D-ZINE visible sections.`, "Include overview, design DNA, tokens, recipes, components, anti-patterns, and quality gates."));
  }
  if (checks.tinyText.length > 0) {
    findings.push(finding("major", "readability", `${viewport} preview has ${checks.tinyText.length} visible text elements below 12px.`, "Raise small text sizes and use spacing rather than tiny labels."));
  }
  if (checks.smallTargets.length > 0) {
    findings.push(finding("major", "touch-targets", `${viewport} preview has ${checks.smallTargets.length} visible controls below 44px in one dimension.`, "Increase target dimensions or padding."));
  }
  if (checks.lowContrast.length > 0) {
    findings.push(finding("critical", "contrast", `${viewport} preview has ${checks.lowContrast.length} low-contrast text samples.`, "Adjust token colors or backgrounds to meet contrast expectations."));
  }
  return findings;
}

function finding(severity: DzineSeverity, category: string, message: string, remediation: string): AuditFinding {
  return { severity, category, message, remediation };
}

function severityCost(severity: DzineSeverity): number {
  if (severity === "critical") {
    return 40;
  }
  if (severity === "major") {
    return 8;
  }
  return 2;
}
