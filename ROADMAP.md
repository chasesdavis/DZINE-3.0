# D-ZINE 3.0 Roadmap

## Goal 1 Status

Goal 1 defines the product, format, research base, quality bar, and implementation plan. Goal 2 should implement the framework core from this roadmap.

## Phase 1: Project Scaffold

Create a TypeScript project with:

- package manager: `pnpm`
- build script: `tsup` or `tsc`
- test runner: `vitest`
- CLI entrypoint: `dzine`
- source directory: `src`
- examples directory: `examples`
- recipes directory: `recipes`
- docs directory or root docs retained

Recommended structure:

```text
src/
  cli/
  compiler/
  core/
  exporters/
  parser/
  preview/
  audit/
  recipes/
examples/
  web-landing/
  mobile-flow/
  brand-kit/
```

## Phase 2: Runtime Schemas

Implement schemas with TypeScript types and runtime validation. Use a validation library such as `zod` unless there is a strong reason not to.

### `DzineDocument`

Fields:

- `schemaVersion`
- `kind`
- `title`
- `description`
- `modes`
- `sourceFormat`
- `quality`
- `exports`
- `brief`
- `designDNA`
- `tokens`
- `recipes`
- `components`
- `antiPatterns`
- `rubric`

### `DesignBrief`

Fields:

- `project`
- `audience`
- `platforms`
- `objective`
- `constraints`
- `successCriteria`
- `inputs`
- `deliverables`

### `DesignDNA`

Fields:

- `density`
- `variance`
- `motion`
- `imagePriority`
- `brandPosture`
- `copyPosture`
- `visualDialect`
- `bannedPatterns`
- `requiredStates`

### `VisualDialect`

Fields:

- `id`
- `name`
- `description`
- `paletteRules`
- `typographyRules`
- `layoutRules`
- `motionRules`
- `imageryRules`
- `componentRules`
- `avoid`

### `TokenSet`

Fields:

- `format`
- `tokens`
- `aliases`
- `themes`
- `modes`
- `exports`

Must support DTCG-like `$type`, `$value`, `$description`, and alias references.

### `Recipe`

Fields:

- `id`
- `mode`
- `description`
- `sections`
- `inputs`
- `requiredStates`
- `imagePolicy`
- `acceptanceGates`
- `promptSections`

### `ComponentSpecimen`

Fields:

- `id`
- `platform`
- `html`
- `tokens`
- `states`
- `accessibility`
- `antiPatterns`

### `MotionContract`

Fields:

- `intensity`
- `allowedProperties`
- `durationScale`
- `easing`
- `reducedMotion`
- `performanceNotes`

### `AccessibilityContract`

Fields:

- `contrastTarget`
- `focusPolicy`
- `targetSize`
- `semanticPolicy`
- `colorOnlyPolicy`
- `reducedMotionPolicy`
- `keyboardPolicy`

### `AntiPattern`

Fields:

- `id`
- `name`
- `description`
- `severity`
- `detect`
- `remediation`
- `examples`

### `CritiqueRubric`

Fields:

- `scale`
- `pass`
- `elite`
- `categories`
- `criticalFailures`

### `AcceptanceGate`

Fields:

- `id`
- `kind`
- `description`
- `severity`
- `check`
- `failureMessage`

### `AuditReport`

Fields:

- `file`
- `target`
- `score`
- `passed`
- `findings`
- `screenshots`
- `recommendations`

## Phase 3: Parser

Implement `.dzine.html` parsing:

- parse HTML with a real HTML parser
- extract JSON blocks by `type="application/dzine+json"`
- validate all blocks
- collect visible sections via `data-dzine-section`
- collect recipes via JSON and `data-dzine-recipe`
- collect component specimens via `<template data-dzine-component>`
- collect anti-pattern examples via `data-dzine-antipattern`
- return structured diagnostics

Parser output should be a normalized `DzineDocument`.

## Phase 4: Compiler

Implement `dzine compile` to generate:

- agent prompt
- compact `/goal` prompt
- section-specific design prompt
- recipe-specific prompt

Compiler rules:

- preserve D-ZINE bans
- include success criteria
- include required states
- include token usage
- include accessibility policy
- include visual QA gates
- include no-placeholder output rules
- avoid dumping raw HTML unless requested

## Phase 5: Exporters

Implement:

- `tokens.json`: DTCG-compatible token output
- `tokens.css`: `:root` CSS variables
- `tailwind.dzine.config.ts`: Tailwind theme fragment
- `COMPAT_SKILL.md`: Markdown compatibility output
- `prompt.txt`: agent prompt
- `goal.txt`: compact goal prompt

Markdown exporter must state:

```text
This file is generated from .dzine.html and is not the source of truth.
```

## Phase 6: CLI

### `dzine init`

Creates a sample project:

- `project.dzine.html`
- `tokens.json`
- `recipes/`
- `README.md`

Options:

- `--mode web|mobile|app|brand-kit|brand-identity`
- `--name <name>`
- `--dialect <visualDialect>`

### `dzine compile`

Inputs:

- `.dzine.html`

Outputs:

- prompt to stdout by default
- `--out <path>` for file output
- `--kind prompt|goal|recipe`

### `dzine preview`

Runs a local preview server or emits a static preview path.

Options:

- `--port`
- `--open`
- `--no-open`

### `dzine audit`

Runs document and visual QA.

Inputs:

- `.dzine.html`
- optional app URL or screenshot target

Outputs:

- console summary
- `audit.json`
- `audit.md`

### `dzine export`

Exports target artifacts.

Options:

- `--target tokens`
- `--target css`
- `--target tailwind`
- `--target markdown`
- `--target all`

### `dzine goal`

Generates a compact `/goal` prompt from a `.dzine.html` file.

Options:

- `--phase spec|implement|showcase`
- `--max-chars 4000`

## Phase 7: Recipes

### Web Landing Recipe

Required sections:

- hero
- proof
- feature system
- product view
- conversion section
- final CTA

Required gates:

- first viewport clear on small laptop
- no generic centered hero unless selected intentionally
- no three equal cards by default
- body text readable
- image usage purposeful

### Mobile App Flow Recipe

Required screens:

- entry/onboarding
- primary home
- detail or action
- settings/profile or completion

Required gates:

- safe area awareness
- platform-specific navigation
- target size checks
- no phone-sized website layout
- readable text

### App UI Surface Recipe

Required states:

- loading
- empty
- error
- success
- disabled
- focus
- hover/active where platform allows

Required gates:

- semantic grouping
- no decorative card overload
- data hierarchy clear
- keyboard navigation

### Brand Kit Recipe

Required panels:

- logo cover
- logo concept
- construction
- color system
- typography
- digital application
- physical or environmental application
- image direction
- system detail

Required gates:

- logo is symbolic and ownable
- palette has clear roles
- typography fits category
- applications prove system reuse

### Brand Identity Recipe

Required outputs:

- positioning
- naming/tone rules
- symbol logic
- visual dialect
- type and color behavior
- UI behavior
- campaign behavior

Required gates:

- identity is not just a logo
- brand rules support multiple media
- no generic startup language

## Phase 8: Visual QA

Goal 3 will complete browser preview and screenshot-based QA. Goal 2 should define interfaces and basic document-level checks so Goal 3 can extend them.

## Definition Of Done For Goal 2

- package builds
- tests pass
- CLI entrypoint works
- `dzine init` creates sample project
- `dzine compile` creates prompt
- `dzine export --target all` creates token, CSS, Tailwind, and Markdown outputs
- no placeholder implementation
- Goal 3 prompt printed at the end
