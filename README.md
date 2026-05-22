# D-ZINE 3.0

D-ZINE 3.0 is an AI-native design framework centered on `.dzine.html`: a renderable HTML instruction format that is beautiful for humans to inspect and structured for AI agents to parse.

Markdown can be exported for compatibility, but `.dzine.html` is the source of truth.

## What This Implements

- TypeScript runtime schemas for D-ZINE briefs, design DNA, tokens, recipes, components, motion, accessibility, anti-patterns, rubrics, and acceptance gates
- `.dzine.html` parser using an HTML parser plus `application/dzine+json` extraction
- Agent prompt compiler
- Compact `/goal` compiler
- DTCG-compatible token export
- CSS variable export
- Tailwind theme fragment export
- Compatibility Markdown export
- Basic document audit
- Local preview server helper
- Multi-page site generator from page-level `.dzine.html` sources
- Route-by-route site audit with generated screenshots
- Source-backed Taste Graph with taste profiles, contracts, critiques, and community-pack guidance
- CLI commands:
  - `dzine init`
  - `dzine compile`
  - `dzine preview`
  - `dzine audit`
  - `dzine export`
  - `dzine goal`
  - `dzine site build`
  - `dzine site audit`
  - `dzine taste list`
  - `dzine taste show`
  - `dzine taste audit`

## Install

```bash
pnpm install
pnpm build
pnpm test
```

For a full release verification pass:

```bash
pnpm release:verify
```

That command builds TypeScript, runs tests, generates the website, audits every generated route, and runs the launch taste audit.

## Try It

```bash
node dist/cli/index.js init /tmp/dzine-demo --name "D-ZINE Demo" --mode web --dialect precision-product
node dist/cli/index.js compile /tmp/dzine-demo/project.dzine.html --out /tmp/dzine-demo/prompt.txt
node dist/cli/index.js export /tmp/dzine-demo/project.dzine.html --target all --out /tmp/dzine-demo/exports
node dist/cli/index.js screenshot /tmp/dzine-demo/project.dzine.html --out /tmp/dzine-demo/screenshots
node dist/cli/index.js audit /tmp/dzine-demo/project.dzine.html --visual --out /tmp/dzine-demo/reports
node dist/cli/index.js goal /tmp/dzine-demo/project.dzine.html --max-chars 4000
```

## Multi-Page Website Generation

D-ZINE now supports full static websites through a project config and page-level source files:

```text
dzine.config.json
dzine/
  theme.css
  pages/
    home.dzine.html
    docs.dzine.html
    taste.dzine.html
    framework.dzine.html
    showcase.dzine.html
website/
  index.html
  docs/index.html
  taste/index.html
  framework/index.html
  showcase/index.html
```

Build and audit the generated product website:

```bash
pnpm build
node dist/cli/index.js site build --config dzine.config.json --out website
node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit --port 6200
```

The generated website includes a GitHub stars pill configured in `dzine.config.json`. If the repository owner/name changes, update the `github` block there.

## Taste Kernel

D-ZINE taste comes from the Taste Graph, not from vague prompt language:

```text
dzine/taste/
  registry.json
  sources/
  profiles/
  contracts/
  critiques/
  community/
```

Inspect and audit taste profiles:

```bash
node dist/cli/index.js taste list
node dist/cli/index.js taste show dzine-launch
node dist/cli/index.js taste audit dzine/pages/home.dzine.html --profile dzine-launch --out reports/website/taste-home.md
```

Taste profiles include provenance/source URLs, license notes, allowed use, extracted principles, positive examples, anti-patterns, component rules, typography rules, layout rhythm rules, copy rules, screenshot notes, and rubrics.

When used inside a project, the CLI resolves `dzine/taste/registry.json` from the current working directory first. If a project does not provide one, it falls back to the bundled D-ZINE Taste Graph included in the package.

## Showcase

The Goal 3 showcase lives at:

```text
examples/showcase/dzine-3-showcase.dzine.html
```

It proves the D-ZINE idea in one source file:

- visible design manual for humans and vision-capable agents
- `application/dzine+json` metadata for parsers
- DTCG-style tokens
- web, mobile, and brand-kit recipes
- component specimens
- anti-pattern examples
- quality gates

Run the full visual proof loop:

```bash
pnpm build
node dist/cli/index.js screenshot examples/showcase/dzine-3-showcase.dzine.html --out reports/goal3/screenshots
node dist/cli/index.js audit examples/showcase/dzine-3-showcase.dzine.html --visual --out reports/goal3/audit
node dist/cli/index.js export examples/showcase/dzine-3-showcase.dzine.html --target all --out reports/goal3/exports
```

If Playwright reports that Chromium is missing on a new machine, run:

```bash
pnpm exec playwright install chromium
```

## Visual QA Loop

`dzine audit --visual` starts a local preview server, opens the `.dzine.html` document in Chromium, captures mobile, tablet, and desktop screenshots, and checks:

- responsive horizontal overflow
- visible D-ZINE section completeness
- tiny text
- low contrast text samples
- touch targets below 44px
- reduced-motion declaration

The audit writes both `audit.json` and `audit.md`.

## Product Website

The public D-ZINE product website is generated into [website/index.html](./website/index.html) plus route folders for [docs](./website/docs/index.html), [taste](./website/taste/index.html), [framework](./website/framework/index.html), and [showcase](./website/showcase/index.html). The canonical sources are the page-level `.dzine.html` files under [dzine/pages](./dzine/pages), and the project model lives in [dzine.config.json](./dzine.config.json).

See [WEBSITE.md](./WEBSITE.md) for the dogfooding proof commands and generated report paths.

## GitHub Pages

The repo includes `.github/workflows/pages.yml`, which runs `pnpm release:verify`, uploads the generated [website](./website), and deploys it with GitHub Pages. In GitHub, set Pages source to **GitHub Actions** for the repository.

## Source Docs

- [D-ZINE_SPEC.md](./D-ZINE_SPEC.md)
- [FORMAT.md](./FORMAT.md)
- [ROADMAP.md](./ROADMAP.md)
- [QUALITY_BAR.md](./QUALITY_BAR.md)
- [RESEARCH_NOTES.md](./RESEARCH_NOTES.md)
- [GOAL3_PROOF.md](./GOAL3_PROOF.md)
- [GOAL4_MULTIPAGE_SITE.md](./GOAL4_MULTIPAGE_SITE.md)
- [GOAL5_TASTE_KERNEL.md](./GOAL5_TASTE_KERNEL.md)
- [GOAL6_PRODUCTION_LAUNCH_HARDENING.md](./GOAL6_PRODUCTION_LAUNCH_HARDENING.md)
- [GOAL7_BRAND_IDENTITY_AND_VISUAL_REDESIGN.md](./GOAL7_BRAND_IDENTITY_AND_VISUAL_REDESIGN.md)
- [GOAL8_RELEASE_PACKAGING_AND_GITHUB_PAGES.md](./GOAL8_RELEASE_PACKAGING_AND_GITHUB_PAGES.md)
- [GOAL9_GITHUB_PUBLICATION_AND_PAGES_ACTIVATION.md](./GOAL9_GITHUB_PUBLICATION_AND_PAGES_ACTIVATION.md)
- [WEBSITE.md](./WEBSITE.md)
