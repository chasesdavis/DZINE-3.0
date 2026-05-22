# D-ZINE Research Notes

## Research Scope

This document records the evidence used to define D-ZINE 3.0. The goal is not to copy a competitor, but to understand what works, what is missing, and what standards should shape an AI-native design framework.

## Competitor: Taste Skill

Source: https://github.com/Leonxlnx/taste-skill

Local reference inspected at `/tmp/taste-skill-readonly`, commit `c807516`.

### What Taste Skill Does Well

- Packages design guidance as portable agent skills.
- Uses multiple specialized skills instead of one monolithic prompt.
- Defines dials such as design variance, motion intensity, and visual density.
- Names common AI design failures directly.
- Includes image-first workflows for visual frontend work.
- Includes brand-kit image generation guidance.
- Includes redesign audit guidance for existing projects.
- Includes output-completeness rules to fight placeholder and truncation behavior.

### Limitations D-ZINE Should Exploit

- Markdown is readable but not renderable as an interactive visual design manual.
- Prose rules are difficult to validate mechanically.
- Tokens are described but not a first-class API.
- Visual QA is checklist-driven rather than screenshot-driven.
- Agent prompts and human docs are not the same rich artifact.
- There is no canonical parseable design object.

### D-ZINE Response

D-ZINE should make the source artifact:

- visual
- valid HTML
- parseable
- schema-validated
- token-aware
- exportable
- auditable

## Agent Skill Formats

Current agent skill formats commonly use Markdown plus YAML frontmatter. Open Agent Skills and related ecosystems emphasize progressive disclosure: the agent loads metadata first and deeper instructions only when relevant.

Sources:

- https://openagentskills.dev/docs/specification
- https://www.useparagon.com/learn/what-are-agent-skills/

### Implication

D-ZINE should support Markdown export for compatibility, but should not inherit Markdown as the primary source. The primary source should preserve visual and structured design context.

## Renderable HTML As Instruction Surface

There is growing practical interest in HTML reports and visual artifacts for agents and humans. The key claim for D-ZINE is not that HTML is magically better than Markdown. The claim is narrower and stronger:

> A renderable structured HTML design document can carry spatial, visual, semantic, and machine-readable information in one artifact.

This matters for design tasks because visual intent is often lost in prose-only prompting.

## Design Tokens

Sources:

- https://www.designtokens.org/
- https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/

The Design Tokens Community Group defines design tokens as a standardized way to share design decisions across tools. The 2025.10 format introduces stable conventions around token types, groups, and aliases. Types help tools infer conversion behavior; groups organize tokens but should not be used as the only source of meaning.

### Implication

D-ZINE tokens should:

- use `$type`, `$value`, and `$description`
- distinguish primitive and semantic tokens
- support aliases
- export DTCG-compatible JSON
- export CSS variables
- export Tailwind theme fragments

## Figma Variables

Source:

- https://developers.figma.com/docs/rest-api/variables/

Figma Variables store reusable values and can be accessed through the REST API for Enterprise users. The API can help sync design systems between design files and code, but it is not universally available.

### Implication

D-ZINE should design for optional Figma sync, not make it required. Goal 2 should implement token exports first, then a future adapter can map D-ZINE tokens to Figma variables.

## Accessibility

Sources:

- https://www.w3.org/TR/WCAG22/
- https://w3c.github.io/wcag/guidelines/22/
- https://developer.apple.com/design/human-interface-guidelines/accessibility

WCAG 2.2 provides testable success criteria for accessibility. Apple HIG emphasizes adaptable, perceivable, and intuitive interfaces, larger text support, sufficient contrast, color alternatives, simple interactions, and motion comfort.

### Implication

D-ZINE quality gates must include:

- text contrast
- non-text contrast where relevant
- focus visibility
- keyboard accessibility
- target size
- reduced motion
- semantic landmarks
- non-color indicators
- error identification

## Apple Human Interface Guidelines

Sources:

- https://developer.apple.com/design/human-interface-guidelines/color
- https://developer.apple.com/design/human-interface-guidelines/accessibility

Apple guidance emphasizes consistent color meaning, contrast, variants for light/dark/increased contrast, avoiding color-only communication, and motion comfort.

### Implication

D-ZINE should not define taste as decoration. Taste includes legibility, system adaptation, restraint, and comfort.

## Carbon Design System

Sources:

- https://carbondesignsystem.com/elements/spacing/overview/
- https://carbondesignsystem.com/elements/motion/overview/
- https://carbondesignsystem.com/elements/color/overview/

Carbon provides strong lessons in tokenized spacing, spacing as hierarchy, productive vs expressive motion, and role-based color tokens.

### Implication

D-ZINE should:

- use spacing scales rather than arbitrary values
- treat whitespace as hierarchy
- distinguish productive and expressive motion
- make role-based color tokens first-class

## Material Design

Sources:

- https://developer.android.com/design/ui/wear/guides/get-started/design-language
- https://m1.material.io/style/color.html

Material systems emphasize semantic color roles, accessibility, type roles, shape, motion, and platform consistency. Current Material 3 sources are often JavaScript-heavy, so D-ZINE should avoid depending on inaccessible web rendering for its own core docs.

### Implication

D-ZINE should define semantic roles that work across platforms and should keep the rendered format accessible without requiring heavy JavaScript.

## UI-To-Code Benchmarks

Sources:

- Design2Code: https://arxiv.org/abs/2403.03163
- ScreenCoder: https://arxiv.org/abs/2507.22827
- WebVIA: https://arxiv.org/abs/2511.06251

Design2Code evaluates multimodal models converting webpage screenshots into code and finds that models still struggle with visual element recall and layout correctness. ScreenCoder argues that text-only prompting limits spatial layout capture and uses modular agents for grounding, planning, and generation.

### Implication

D-ZINE should not rely only on prose prompts. It should provide renderable, inspectable visual instruction artifacts and a visual QA loop.

## Automated UI Critique

Sources:

- UIClip: https://uimodeling.github.io/uiclip/
- UICrit: https://people.eecs.berkeley.edu/~bjoern/papers/duan-uicrit-uist2024.pdf
- ArtifactsBench: https://artifactsbenchmark.github.io/

UIClip uses screenshot and text inputs to score UI quality and relevance. UICrit collects expert critiques and identifies categories such as layout, color contrast, text readability, button usability, and learnability. ArtifactsBench uses rendering and MLLM-as-judge assessment for generated artifacts.

### Implication

D-ZINE audit should combine:

- static document validation
- screenshot capture
- visual critique categories
- human-readable findings
- machine-readable scores

## Final Research Conclusion

D-ZINE should be positioned as an AI-native design operating system:

- not a prompt file
- not a component library only
- not a design token exporter only
- not a screenshot judge only

Its distinctive wedge is the `.dzine.html` artifact: a single source that agents can parse, humans can inspect, browsers can render, and CLIs can compile into implementation prompts and design assets.
