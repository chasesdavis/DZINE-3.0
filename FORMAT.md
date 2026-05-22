# D-ZINE `.dzine.html` Format

## Format Goal

`.dzine.html` is the canonical D-ZINE source format. It is designed to be:

- valid HTML that renders in a browser
- visually useful to humans
- structurally useful to AI agents
- parseable by a TypeScript runtime
- exportable to prompts, tokens, CSS variables, Tailwind config, and Markdown compatibility files

Markdown is not the source of truth. A `.dzine.html` file may export Markdown, but the reverse is lossy and non-canonical.

## File Extension

All source documents use:

```text
*.dzine.html
```

Examples:

```text
brandkit.dzine.html
web-launch.dzine.html
mobile-flow.dzine.html
redesign-audit.dzine.html
```

## Minimum Valid Document

```html
<!doctype html>
<html lang="en" data-dzine-version="3.0">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>D-ZINE Project</title>
    <script type="application/dzine+json" id="dzine-root">
      {
        "schemaVersion": "3.0.0",
        "kind": "dzine.document",
        "title": "D-ZINE Project",
        "modes": ["web"],
        "sourceFormat": ".dzine.html",
        "tokens": { "source": "#dzine-tokens" },
        "recipes": ["web-landing"],
        "quality": { "profile": "elite", "auditLevel": "strict" }
      }
    </script>
  </head>
  <body>
    <main data-dzine-section="overview">
      <h1>D-ZINE Project</h1>
      <p>A renderable design instruction document.</p>
    </main>
  </body>
</html>
```

## Required HTML Contract

Every `.dzine.html` file must include:

- `<!doctype html>`
- `<html lang="..." data-dzine-version="3.0">`
- `<meta charset="utf-8">`
- viewport meta tag
- a human-readable `<title>`
- one root JSON metadata block:
  - `type="application/dzine+json"`
  - `id="dzine-root"`
- at least one visible section:
  - `data-dzine-section="..."`
- at least one recipe:
  - inline JSON recipe metadata or visible `data-dzine-recipe`
- token source:
  - inline JSON block or linked `tokens.json`
- quality rubric source:
  - inline JSON block or linked rubric

## JSON Block Types

### Root Metadata

```html
<script type="application/dzine+json" id="dzine-root">
{
  "schemaVersion": "3.0.0",
  "kind": "dzine.document",
  "title": "Launch Site",
  "description": "Premium web direction for a product launch.",
  "modes": ["web", "brand-kit"],
  "visualDialect": "precision-product",
  "sourceFormat": ".dzine.html",
  "createdBy": "D-ZINE",
  "quality": {
    "profile": "elite",
    "auditLevel": "strict",
    "antiSlopPolicy": "fail-on-critical"
  },
  "exports": ["prompt", "tokens", "css", "tailwind", "markdown"]
}
</script>
```

Required fields:

- `schemaVersion`
- `kind`
- `title`
- `modes`
- `sourceFormat`
- `quality`

### Brief Metadata

```html
<script type="application/dzine+json" id="dzine-brief">
{
  "kind": "dzine.brief",
  "project": "Artifact OS",
  "audience": ["founders", "design engineers"],
  "platforms": ["web", "mobile"],
  "objective": "Produce a premium launch system for an AI design product.",
  "constraints": ["no generic AI palette", "must export tokens"],
  "successCriteria": [
    "Readable first viewport",
    "Responsive across mobile and desktop",
    "Agent prompt export compiles"
  ]
}
</script>
```

### Design DNA Metadata

```html
<script type="application/dzine+json" id="dzine-dna">
{
  "kind": "dzine.designDNA",
  "density": 4,
  "variance": 8,
  "motion": 5,
  "imagePriority": 7,
  "brandPosture": "precise, confident, restrained",
  "copyPosture": "specific, direct, low-hype",
  "visualDialect": "precision-product",
  "bannedPatterns": [
    "ai-purple-gradient",
    "three-equal-card-row",
    "generic-saas-copy"
  ]
}
</script>
```

### Token Metadata

Tokens should follow the Design Tokens Community Group style: token entries use `$type`, `$value`, and optional `$description`.

```html
<script type="application/dzine+json" id="dzine-tokens">
{
  "kind": "dzine.tokens",
  "format": "dtcg",
  "tokens": {
    "color": {
      "background": {
        "canvas": {
          "$type": "color",
          "$value": "#f7f4ef",
          "$description": "Primary warm canvas."
        }
      },
      "text": {
        "primary": {
          "$type": "color",
          "$value": "#161513"
        }
      },
      "accent": {
        "primary": {
          "$type": "color",
          "$value": "#b9472f",
          "$description": "Single brand accent."
        }
      }
    },
    "space": {
      "4": { "$type": "dimension", "$value": "1rem" },
      "8": { "$type": "dimension", "$value": "2rem" },
      "12": { "$type": "dimension", "$value": "3rem" }
    }
  }
}
</script>
```

### Recipe Metadata

```html
<script type="application/dzine+json" id="dzine-recipes">
{
  "kind": "dzine.recipes",
  "recipes": [
    {
      "id": "web-landing",
      "mode": "web",
      "sections": ["hero", "proof", "features", "product", "pricing", "cta"],
      "imagePolicy": "one-reference-per-section",
      "requiredStates": ["default", "hover", "focus", "loading", "empty", "error"],
      "acceptanceGates": ["contrast-aa", "no-horizontal-scroll", "anti-slop-critical"]
    }
  ]
}
</script>
```

### QA Rubric Metadata

```html
<script type="application/dzine+json" id="dzine-rubric">
{
  "kind": "dzine.rubric",
  "scoring": {
    "scale": 100,
    "pass": 85,
    "elite": 92
  },
  "categories": [
    { "id": "hierarchy", "weight": 15 },
    { "id": "spacing", "weight": 12 },
    { "id": "tokens", "weight": 10 },
    { "id": "accessibility", "weight": 15 },
    { "id": "responsive", "weight": 12 },
    { "id": "motion", "weight": 8 },
    { "id": "anti-slop", "weight": 18 },
    { "id": "system-reuse", "weight": 10 }
  ],
  "criticalFailures": [
    "unreadable-text",
    "missing-focus-state",
    "horizontal-scroll-mobile",
    "generic-ai-gradient",
    "missing-required-json"
  ]
}
</script>
```

## Visible Sections

Visible sections are not decorative. They are the human and vision-model interface.

Required section types:

- `overview`
- `design-dna`
- `tokens`
- `recipes`
- `components`
- `anti-patterns`
- `quality-gates`

Example:

```html
<section data-dzine-section="anti-patterns">
  <h2>Anti-patterns</h2>
  <figure data-dzine-antipattern="three-equal-card-row" data-severity="major">
    <figcaption>Do not default to three equal feature cards.</figcaption>
  </figure>
</section>
```

## Component Specimens

Component specimens use `<template>` so the runtime can extract examples without rendering every variant by default.

```html
<template data-dzine-component="premium-button" data-platform="web">
  <button class="dz-button dz-button-primary">
    Request access
  </button>
</template>
```

Each specimen should declare:

- `data-dzine-component`
- `data-platform`
- supported states in metadata or nearby text
- associated tokens
- accessibility expectations

## Anti-Pattern Examples

Anti-patterns can be visual or metadata-only. Visual examples are preferred because D-ZINE exists to make design instructions inspectable.

```html
<article data-dzine-antipattern="meaningless-pill-clutter" data-severity="minor">
  <h3>Meaningless pill clutter</h3>
  <p>Random status pills that do not help hierarchy or user decisions.</p>
</article>
```

Severity values:

- `minor`: warn
- `major`: fail strict audits
- `critical`: fail all audits

## Export Semantics

A `.dzine.html` file can compile to:

- `prompt.txt`: agent-ready design prompt
- `goal.txt`: compact `/goal` prompt
- `tokens.json`: DTCG-compatible tokens
- `tokens.css`: CSS variables
- `tailwind.dzine.config.ts`: Tailwind theme fragment
- `COMPAT_SKILL.md`: compatibility Markdown, not canonical
- `audit.json`: machine-readable audit report
- `audit.md`: human-readable audit report

## Parsing Rules

The parser must:

1. parse as HTML, not string-split
2. find all `script[type="application/dzine+json"]`
3. validate JSON
4. validate `kind` values against schemas
5. verify required visible sections
6. verify token source
7. verify recipe source
8. collect component specimens from `<template>`
9. collect anti-pattern examples
10. return structured diagnostics with file location hints where possible

## Invalid Document Conditions

The file is invalid when:

- HTML cannot be parsed
- root metadata block is missing
- root metadata is invalid JSON
- `sourceFormat` is not `.dzine.html`
- no visible sections exist
- no recipe exists
- no token source exists
- no QA rubric exists
- a critical anti-pattern appears in an approved example

## Design Preview Requirements

The rendered preview should feel like a high-end design guideline page:

- clear navigation
- wide but readable layout
- strong typographic hierarchy
- tasteful color system
- visible examples and counterexamples
- responsive behavior
- no dependency on external network assets for core readability
- reduced-motion-safe by default

## Compatibility With Agent Skills

D-ZINE may export `COMPAT_SKILL.md` for tools that only understand Markdown skill files. The exporter must include a warning that Markdown is a compatibility artifact and may omit visual information available in `.dzine.html`.
