import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { parse } from "node-html-parser";
import type { BuiltDzinePage, DzineSiteBuildResult, DzineSiteConfig, DzineSiteNavItem, DzineSitePage } from "./types.js";

export interface BuildSiteOptions {
  config: DzineSiteConfig;
  rootDir: string;
  outDir?: string;
  clean?: boolean;
}

interface ExtractedPageSource {
  body: string;
  dzineScripts: string;
}

export async function buildDzineSite(options: BuildSiteOptions): Promise<DzineSiteBuildResult> {
  const outputDir = resolve(options.rootDir, options.outDir ?? options.config.outputDir ?? "website");
  if (options.clean ?? true) {
    await rm(outputDir, { recursive: true, force: true });
  }
  await mkdir(outputDir, { recursive: true });
  await copySiteAssets(options.config, options.rootDir, outputDir);

  const pages: BuiltDzinePage[] = [];
  for (const page of options.config.pages) {
    const sourcePath = resolve(options.rootDir, page.source);
    const outputPath = routeToOutputPath(outputDir, page.route);
    const source = await extractPageSource(sourcePath);
    const html = renderGeneratedPage({
      config: options.config,
      page,
      source,
      outputPath,
      outputDir
    });
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, "utf8");
    pages.push({ page, sourcePath, outputPath, route: page.route });
  }

  return { config: options.config, outputDir, pages };
}

export function routeToOutputPath(outputDir: string, route: string): string {
  if (route === "/") {
    return join(outputDir, "index.html");
  }
  const cleaned = route.replace(/^\/+|\/+$/g, "");
  return join(outputDir, cleaned, "index.html");
}

async function copySiteAssets(config: DzineSiteConfig, rootDir: string, outputDir: string): Promise<void> {
  if (config.theme) {
    const themePath = resolve(rootDir, config.theme);
    await mkdir(dirname(join(outputDir, "theme.css")), { recursive: true });
    await cp(themePath, join(outputDir, "theme.css"));
  }

  for (const asset of config.assets ?? []) {
    const source = resolve(rootDir, asset);
    const target = join(outputDir, asset.split("/").at(-1) ?? asset);
    await cp(source, target, { recursive: true });
  }
}

async function extractPageSource(sourcePath: string): Promise<ExtractedPageSource> {
  const html = await readFile(sourcePath, "utf8");
  const root = parse(html, {
    blockTextElements: {
      script: true,
      noscript: true,
      style: true,
      pre: true
    }
  });
  const main = root.querySelector("main");
  if (!main) {
    throw new Error(`${sourcePath} must include a <main> element for site generation.`);
  }
  const dzineScripts = root.querySelectorAll('script[type="application/dzine+json"]').map((node) => node.toString()).join("\n");
  return { body: main.innerHTML.trim(), dzineScripts };
}

function renderGeneratedPage(input: {
  config: DzineSiteConfig;
  page: DzineSitePage;
  source: ExtractedPageSource;
  outputPath: string;
  outputDir: string;
}): string {
  const depthPrefix = relative(dirname(input.outputPath), input.outputDir).replaceAll("\\", "/");
  const prefix = depthPrefix === "" ? "." : depthPrefix;
  const nav = input.config.nav ?? input.config.pages.map((page) => ({ label: page.navLabel ?? page.title, href: page.route }));
  return `<!doctype html>
<html lang="en" data-dzine-version="3.0">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="${escapeAttr(input.page.description)}" />
    <meta property="og:title" content="${escapeAttr(input.page.title)}" />
    <meta property="og:description" content="${escapeAttr(input.page.description)}" />
    <meta property="og:image" content="${prefix}/assets/dzine-showcase-desktop.png" />
    <title>${escapeHtml(input.page.title)} - ${escapeHtml(input.config.name)}</title>
    <link rel="stylesheet" href="${prefix}/theme.css" />
    <style>
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          scroll-behavior: auto !important;
          animation-duration: 0.001ms !important;
          transition-duration: 0.001ms !important;
        }
      }
    </style>
    ${input.source.dzineScripts}
  </head>
  <body data-route="${escapeAttr(input.page.route)}">
    <header class="site-header">
      <a class="brand" href="${prefix}/">
        <span class="brand-mark">D</span>
        <span>D-ZINE 3.0</span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        ${renderNav(nav, prefix, input.page.route)}
      </nav>
      ${renderGitHubPill(input.config, prefix)}
    </header>
    ${input.source.body.replaceAll("{{prefix}}", prefix)}
    <footer class="footer">
      <span>D-ZINE 3.0 - generated from page-level .dzine.html sources.</span>
      <a href="${prefix}/docs/">Read the docs</a>
    </footer>
    ${renderGitHubScript(input.config)}
  </body>
</html>
`;
}

function renderNav(nav: DzineSiteNavItem[], prefix: string, activeRoute: string): string {
  return nav.map((item) => {
    const href = item.href.startsWith("http") ? item.href : `${prefix}${item.href === "/" ? "/" : item.href}`;
    const active = normalizeHref(item.href) === normalizeHref(activeRoute) ? ' aria-current="page"' : "";
    return `<a href="${escapeAttr(href)}"${active}>${escapeHtml(item.label)}</a>`;
  }).join("\n        ");
}

function renderGitHubPill(config: DzineSiteConfig, prefix: string): string {
  if (!config.github) {
    return `<a class="github-pill" href="${prefix}/docs/">Docs</a>`;
  }
  return `<a class="github-pill" href="${escapeAttr(config.github.url ?? `https://github.com/${config.github.owner}/${config.github.repo}`)}" data-github-stars data-owner="${escapeAttr(config.github.owner)}" data-repo="${escapeAttr(config.github.repo)}" aria-label="Open GitHub repository">
        <span class="github-mark" aria-hidden="true">★</span>
        <span data-star-label>GitHub</span>
      </a>`;
}

function renderGitHubScript(config: DzineSiteConfig): string {
  if (!config.github) {
    return "";
  }
  return `<script>
      (() => {
        const pill = document.querySelector("[data-github-stars]");
        const label = document.querySelector("[data-star-label]");
        if (!pill || !label) return;
        const owner = pill.getAttribute("data-owner");
        const repo = pill.getAttribute("data-repo");
        if (!owner || !repo) return;
        fetch(\`https://api.github.com/repos/\${owner}/\${repo}\`, { headers: { "Accept": "application/vnd.github+json" } })
          .then((response) => response.ok ? response.json() : Promise.reject(new Error("GitHub unavailable")))
          .then((data) => {
            const stars = typeof data.stargazers_count === "number" ? data.stargazers_count : 0;
            label.textContent = new Intl.NumberFormat().format(stars) + " stars";
          })
          .catch(() => {
            label.textContent = "GitHub";
          });
      })();
    </script>`;
}

function normalizeHref(href: string): string {
  if (href === "/") {
    return "/";
  }
  return href.endsWith("/") ? href : `${href}/`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
