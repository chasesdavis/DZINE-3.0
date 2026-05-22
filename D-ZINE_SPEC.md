# D-ZINE 3.0 Specification

## Purpose

D-ZINE 3.0 is an AI-native design framework and renderable instruction format for producing high-quality web, mobile, app UI, brand kit, and brand identity work with AI agents. It is a direct competitor to prompt-only agent skill packs, but it must not clone Taste Skill or become a better pile of Markdown files.

The central product decision is that D-ZINE source files are `.dzine.html`: valid HTML documents that render as beautiful design manuals for humans while exposing structured metadata, tokens, rules, recipes, and QA rubrics for agents.

## Competitive Position

Taste Skill proves that agent instructions can improve visual output by encoding:

- adjustable design dials
- anti-slop bans
- image-first workflows
- redesign audits
- brand kit direction
- output-completeness rules

D-ZINE keeps the useful strategic lesson but changes the medium and product layer. Instead of static `SKILL.md` files, D-ZINE introduces a renderable, structured, inspectable, exportable design artifact.

| Area | Taste Skill pattern | D-ZINE 3.0 position |
| --- | --- | --- |
| Source format | Markdown skill files | `.dzine.html` as source of truth |
| Agent interface | prose instructions | structured HTML plus JSON metadata |
| Human interface | readable Markdown | rendered visual design manual |
| Tokens | described in prose | DTCG-compatible token API |
| QA | checklist language | visual audit rubric and CLI gates |
| Outputs | agent behavior guidance | prompts, tokens, CSS, Tailwind, reports |
| Differentiator | better prompting | AI-native design operating system |

## Product Principles

1. **Renderable instructions beat invisible instructions.** Agents and humans should inspect the same artifact visually.
2. **Taste must be operationalized.** D-ZINE uses schemas, tokens, recipes, examples, anti-patterns, and acceptance gates.
3. **Accessibility is taste.** Contrast, focus, target size, reduced motion, semantics, and responsive behavior are quality requirements.
4. **Visual QA is mandatory.** A design framework for agents must evaluate rendered output, not only generated code.
5. **Markdown is compatibility output.** Markdown can be exported, but it is never the canonical format.
6. **Design direction must become reusable.** One impressive screen is not enough; the system must carry across sections, states, and platforms.

## Core Concepts

### `.dzine.html`

A valid HTML document that contains:

- human-visible design guidance
- embedded JSON metadata
- embedded or linked DTCG tokens
- examples and counterexamples
- recipes for target workflows
- component specimens
- visual QA rubrics
- export hints for prompt, CSS, Tailwind, and Markdown compatibility

### Design DNA

The persistent creative strategy for a project. Design DNA includes:

- audience
- category
- promise
- visual dialect
- brand behavior
- density
- motion posture
- accessibility posture
- anti-pattern bans
- export targets

### Visual Dialect

A named design language that constrains palette, type, layout, materiality, imagery, motion, and component behavior. Examples:

- `precision-product`
- `editorial-luxury`
- `calm-mobile-native`
- `industrial-interface`
- `brand-system-board`
- `expressive-web-art-direction`

### Recipe

A structured workflow for one design use case. Required v1 recipes:

- `web-landing`
- `mobile-app-flow`
- `app-ui-surface`
- `brand-kit`
- `brand-identity`
- `redesign-audit`
- `image-to-code`

### Acceptance Gate

A verifiable rule that decides whether output is good enough. Gates include build checks, visual checks, accessibility checks, prompt completeness checks, and anti-slop checks.

## Required Repository Artifacts

Goal 2 must implement these concepts in code. This goal defines them in documentation:

- [FORMAT.md](./FORMAT.md): `.dzine.html` syntax and document contract
- [QUALITY_BAR.md](./QUALITY_BAR.md): taste, anti-slop, and QA standards
- [ROADMAP.md](./ROADMAP.md): implementation phases, CLI, schemas, and success gates
- [RESEARCH_NOTES.md](./RESEARCH_NOTES.md): source-grounded research summary
- [D-ZINE_SPEC.md](./D-ZINE_SPEC.md): product specification and final handoff

## Framework Architecture

### Packages

Goal 2 should create a TypeScript monorepo or single-package workspace with these internal modules:

- `core`: schemas, validators, model types, shared utilities
- `parser`: `.dzine.html` extraction and validation
- `compiler`: agent prompt generation and goal generation
- `exporters`: DTCG token, CSS, Tailwind, Markdown, and JSON exports
- `preview`: local static preview server for `.dzine.html`
- `audit`: visual, accessibility, and anti-slop checks
- `recipes`: bundled web, mobile, app UI, brand kit, and identity recipes
- `cli`: `dzine` command interface

### Canonical Data Flow

1. User creates or generates a `.dzine.html` file.
2. Parser reads HTML and extracts `application/dzine+json` blocks.
3. Validator checks schemas and required sections.
4. Preview renders the file for human and vision-model inspection.
5. Compiler generates agent prompts and `/goal` prompts.
6. Exporters create tokens, CSS variables, Tailwind config, Markdown compatibility, and recipe bundles.
7. Audit runs visual QA against rendered previews or target app screenshots.

## `.dzine.html` Decision Summary

The format is decision-complete:

- source extension: `.dzine.html`
- must be valid HTML5
- must include one root metadata block with `type="application/dzine+json"`
- must include visible sections with `data-dzine-section`
- must include at least one recipe with `data-dzine-recipe`
- must include token data inline or by link
- must include anti-pattern examples or explicit banned pattern metadata
- must include QA rubric metadata
- may include design specimens in `<template>` tags
- may include screenshots or image references
- must compile without needing Markdown

Full details are in [FORMAT.md](./FORMAT.md).

## TypeScript Runtime Schemas

Goal 2 should implement schemas for:

- `DzineDocument`
- `DzineMetadata`
- `DesignBrief`
- `DesignDNA`
- `VisualDialect`
- `TokenSet`
- `Recipe`
- `ComponentSpecimen`
- `MotionContract`
- `AccessibilityContract`
- `AntiPattern`
- `CritiqueRubric`
- `AcceptanceGate`
- `ExportTarget`
- `AuditReport`

The schema details are listed in [ROADMAP.md](./ROADMAP.md).

## CLI Contract

Goal 2 should implement:

- `dzine init`
- `dzine compile`
- `dzine preview`
- `dzine audit`
- `dzine export`
- `dzine goal`

Each command, input, output, and success behavior is specified in [ROADMAP.md](./ROADMAP.md).

## Visual QA Contract

D-ZINE quality cannot be proven by files alone. The audit loop must check:

- valid `.dzine.html` structure
- rendered preview success
- screenshot capture
- responsive layout at mobile, tablet, desktop, and wide desktop
- color contrast
- text fit and readable line lengths
- touch target sizing
- focus states
- reduced-motion behavior
- loading, empty, error, hover, active, and disabled states
- generic AI slop patterns
- cross-section consistency
- token usage consistency

The rubric is specified in [QUALITY_BAR.md](./QUALITY_BAR.md).

## Required v1 Recipes

### Web Landing

Produces a section-by-section design brief and implementation prompt for premium websites. It must support hero, trust, feature, product proof, testimonial, pricing, FAQ, CTA, and footer sections.

### Mobile App Flow

Produces platform-aware mobile screen direction with safe areas, native navigation behavior, touch target rules, readable type, and consistent phone-frame presentation.

### App UI Surface

Produces production app surfaces such as dashboards, editors, inboxes, settings, command centers, and form-heavy flows. It must require complete interaction states.

### Brand Kit

Produces identity-board direction with logo concept, construction logic, color system, typography, applications, image direction, and brand rules.

### Brand Identity

Produces a deeper identity system for naming, tone, symbol logic, typography, campaign behavior, UI behavior, and cross-channel applications.

## Non-Negotiable Bans

D-ZINE must reject or flag:

- generic purple or blue AI gradients
- centered hero repetition
- three equal feature cards by default
- unearned glassmorphism
- nested card prisons
- fake metrics such as `99.99%`
- placeholder brands such as `Acme`, `Nexus`, `NovaCore`, `SmartFlow`
- generic SaaS verbs such as `Elevate`, `Unleash`, `Seamless`, `Next-gen`
- meaningless pills and random badges
- tiny unreadable UI text
- missing loading, empty, error, focus, disabled, hover, and active states
- motion that ignores reduced-motion preferences
- inaccessible color-only communication
- visuals that cannot become a reusable system

## Completion Requirements For Goal 1

Goal 1 is complete when these docs exist and cover:

- `.dzine.html` format
- JSON metadata blocks
- visible instruction sections
- tokens
- recipes
- component specimens
- anti-pattern examples
- visual QA rubrics
- CLI design
- TypeScript schema architecture
- web, mobile, app UI, brand kit, and identity workflows
- research notes from the required source categories
- next implementation goal

## NEXT GOAL

```text
/goal Implement the D-ZINE 3.0 framework core from the local spec.

CONTEXT
Workspace: /Users/chase/Documents/DZINE 3.0
Use the docs created in Goal 1 as source of truth:
- D-ZINE_SPEC.md
- FORMAT.md
- ROADMAP.md
- QUALITY_BAR.md
- RESEARCH_NOTES.md

TASK
Build the working TypeScript framework and CLI.

REQUIRED IMPLEMENTATION
Create:
- package setup with build/test scripts
- TypeScript source structure
- schema definitions for D-ZINE briefs, tokens, visual dialects, components, motion, accessibility, anti-slop rules, recipes, and acceptance gates
- `.dzine.html` parser
- prompt compiler
- token exporter
- CSS variables exporter
- Tailwind theme exporter
- compatibility Markdown exporter
- CLI commands:
  - dzine init
  - dzine compile
  - dzine preview
  - dzine audit
  - dzine export
  - dzine goal

FORMAT REQUIREMENTS
`.dzine.html` must be valid renderable HTML and include machine-readable JSON blocks. Markdown may be exported only for compatibility, never treated as the source format.

SUCCESS CRITERIA
1. Repo builds.
2. Tests pass.
3. CLI runs locally.
4. `dzine init` creates a sample D-ZINE project.
5. `dzine compile` creates an agent-ready prompt.
6. `dzine export` creates tokens, CSS variables, Tailwind config, and Markdown compatibility output.
7. No TODO stubs or placeholder files.
8. Next showcase/QA goal is included at the end.

FINAL STEP
When done, output build/test summary and then print "NEXT GOAL" followed by the exact Goal 3 prompt.
```
