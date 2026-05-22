export const REQUIRED_SECTIONS = [
  "overview",
  "design-dna",
  "tokens",
  "recipes",
  "components",
  "anti-patterns",
  "quality-gates"
] as const;

export const DEFAULT_BANNED_PATTERNS = [
  "ai-purple-gradient",
  "neon-glow-button",
  "centered-hero-repetition",
  "three-equal-card-row",
  "nested-card-prison",
  "meaningless-pill-clutter",
  "fake-perfect-metric",
  "generic-saas-copy",
  "placeholder-brand",
  "unreadable-tiny-text",
  "missing-ui-states",
  "inaccessible-motion"
] as const;

export const NEXT_GOAL_3 = `/goal Finish D-ZINE 3.0 with visual preview, anti-slop audit, recipes, showcase, screenshots, and final proof.

CONTEXT
Workspace: /Users/chase/Documents/DZINE 3.0
Use the existing framework from Goals 1 and 2.

TASK
Complete the product so D-ZINE proves its advantage over plain Markdown agent skills.

REQUIRED WORK
Build:
- beautiful \`.dzine.html\` visual preview
- screenshot capture workflow
- anti-slop audit report
- responsive checks
- contrast checks
- touch target checks
- reduced-motion checks
- visual hierarchy and spacing checks
- web design recipe
- mobile app recipe
- brand-kit/identity recipe
- showcase project demonstrating the format and outputs
- final documentation and run instructions

DESIGN QUALITY BAR
D-ZINE must demonstrate Apple restraint, Stripe clarity, Linear discipline, Awwwards-level art direction when needed, and serious brand identity taste. Ban generic AI output: purple neon gradients, centered hero repetition, three equal feature cards, fake metrics, generic SaaS copy, overnested cards, meaningless pills, tiny unreadable text, missing states, and inaccessible motion.

SUCCESS CRITERIA
1. Tests pass.
2. Build passes.
3. Preview renders in browser.
4. Screenshots are captured.
5. Audit report is generated.
6. Web, mobile, and brand recipes exist.
7. Showcase proves \`.dzine.html\` is more powerful than a plain Markdown skill.
8. Final docs explain the format, CLI, recipes, QA loop, and run commands.
9. Every original D-ZINE requirement is checked off.
10. No TODO stubs, placeholder code, or unfinished files.

FINAL STEP
Before stopping, rerun verification, summarize proof for every success criterion, include screenshot paths, test output summary, and exact run instructions.`;
