import type { AcceptanceGate, AntiPattern, Recipe, VisualDialect } from "../core/types.js";
import { DEFAULT_BANNED_PATTERNS } from "../core/constants.js";

export const bundledVisualDialects: VisualDialect[] = [
  {
    id: "precision-product",
    name: "Precision Product",
    description: "A restrained, high-clarity product language for serious software surfaces.",
    paletteRules: ["Use role-based neutrals", "Use one confident accent", "Avoid purple-blue AI gradients"],
    typographyRules: ["Use clear sans type roles", "Use tabular or mono numbers for data", "Keep body copy readable"],
    layoutRules: ["Use grid-first structure", "Leave room for repeated use", "Avoid decorative cards"],
    motionRules: ["Use productive motion for feedback", "Keep expressive motion rare", "Respect reduced motion"],
    imageryRules: ["Use product-relevant imagery", "Avoid stock team photos"],
    componentRules: ["Define all interactive states", "Prefer semantic grouping over card overload"],
    avoid: ["generic-saas-copy", "nested-card-prison", "fake-perfect-metric"]
  },
  {
    id: "expressive-web-art-direction",
    name: "Expressive Web Art Direction",
    description: "A bolder web language for memorable launches, editorial sites, and campaign pages.",
    paletteRules: ["Commit to one atmospheric palette", "Use contrast deliberately", "Keep accents role-based"],
    typographyRules: ["Use strong display moments", "Keep hero text within readable line counts"],
    layoutRules: ["Vary section rhythm", "Use asymmetric composition with mobile collapse rules"],
    motionRules: ["Use expressive motion only where it guides attention", "Avoid layout-thrashing animation"],
    imageryRules: ["Use one image system across sections", "Prefer purposeful full-bleed or framed media"],
    componentRules: ["Avoid meaningless labels", "Use components as rhythm, not decoration"],
    avoid: ["centered-hero-repetition", "meaningless-pill-clutter", "unreadable-tiny-text"]
  },
  {
    id: "brand-system-board",
    name: "Brand System Board",
    description: "A serious identity-system presentation language for logos, tokens, applications, and visual worlds.",
    paletteRules: ["Show roles, not just swatches", "Prove contrast and usage"],
    typographyRules: ["Tie type to category and tone", "Show display, body, and metadata behavior"],
    layoutRules: ["Use a clear board grid", "Give the mark room to breathe"],
    motionRules: ["Describe identity behavior without unnecessary animation"],
    imageryRules: ["Define art direction and image treatment", "Avoid unrelated moodboard fragments"],
    componentRules: ["Show UI, print, and environmental applications when relevant"],
    avoid: ["placeholder-brand", "random-logo-symbol", "generic-saas-copy"]
  }
];

export const bundledRecipes: Recipe[] = [
  {
    id: "web-landing",
    mode: "web",
    description: "Premium section-by-section landing page direction for conversion-aware websites.",
    sections: ["hero", "proof", "feature-system", "product-view", "conversion", "final-cta"],
    inputs: ["brief", "designDNA", "tokens"],
    requiredStates: ["default", "hover", "focus", "loading", "empty", "error"],
    imagePolicy: "one-reference-per-section",
    acceptanceGates: ["contrast-aa", "no-horizontal-scroll", "anti-slop-critical", "first-viewport-clear"],
    promptSections: ["context", "designDNA", "sectionPlan", "states", "qualityGates"]
  },
  {
    id: "mobile-app-flow",
    mode: "mobile",
    description: "Platform-aware mobile flow direction with safe areas, readable text, and app-native navigation.",
    sections: ["onboarding", "home", "detail-or-action", "settings-or-completion"],
    inputs: ["brief", "platform", "visualDialect"],
    requiredStates: ["default", "pressed", "focus", "loading", "empty", "error", "success"],
    imagePolicy: "one-phone-screen-per-step",
    acceptanceGates: ["touch-target-size", "safe-area-aware", "no-phone-sized-website", "text-readable"],
    promptSections: ["platform", "flow", "screenSpecs", "states", "qualityGates"]
  },
  {
    id: "app-ui-surface",
    mode: "app",
    description: "Production interface direction for dashboards, editors, forms, and repeated-use workflows.",
    sections: ["navigation", "primary-workspace", "detail-panel", "states", "settings"],
    inputs: ["brief", "workflow", "dataModel"],
    requiredStates: ["default", "hover", "active", "focus", "disabled", "loading", "empty", "error", "success"],
    imagePolicy: "stateful-surface-plus-detail-views",
    acceptanceGates: ["state-complete", "keyboard-accessible", "semantic-grouping", "no-card-overload"],
    promptSections: ["workflow", "informationArchitecture", "stateMatrix", "qualityGates"]
  },
  {
    id: "brand-kit",
    mode: "brand-kit",
    description: "Identity board direction with logo concept, construction, tokens, applications, and image world.",
    sections: ["logo-cover", "logo-concept", "construction", "color", "typography", "digital-application", "physical-application", "image-direction", "system-detail"],
    inputs: ["brandBrief", "audience", "category"],
    requiredStates: ["overview", "usage", "misuse"],
    imagePolicy: "single-board-plus-detail-panels",
    acceptanceGates: ["symbolic-logo", "role-based-palette", "applications-prove-system", "no-generic-startup-language"],
    promptSections: ["strategy", "symbolLogic", "boardPlan", "qualityGates"]
  },
  {
    id: "brand-identity",
    mode: "brand-identity",
    description: "Deeper identity-system direction for positioning, mark behavior, UI behavior, and campaigns.",
    sections: ["positioning", "tone", "symbol-logic", "color-and-type", "ui-behavior", "campaign-behavior"],
    inputs: ["brandBrief", "market", "audience"],
    requiredStates: ["core", "extension", "misuse"],
    imagePolicy: "identity-system-doc-plus-application-frames",
    acceptanceGates: ["identity-scales", "strategy-linked-visuals", "no-placeholder-brand"],
    promptSections: ["strategy", "systemRules", "applications", "qualityGates"]
  }
];

export const bundledAntiPatterns: AntiPattern[] = DEFAULT_BANNED_PATTERNS.map((id) => ({
  id,
  name: id.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" "),
  description: `D-ZINE flags ${id} because it is a common AI design tell or quality failure.`,
  severity: id.includes("missing") || id.includes("unreadable") ? "critical" : "major",
  detect: [id],
  remediation: "Replace the pattern with a role-based, context-specific design decision that can scale across states and surfaces.",
  examples: []
}));

export const bundledAcceptanceGates: AcceptanceGate[] = [
  {
    id: "required-json",
    kind: "document",
    description: "The document includes valid root D-ZINE JSON metadata.",
    severity: "critical",
    check: "metadata.kind === dzine.document",
    failureMessage: "Missing or invalid dzine-root JSON metadata."
  },
  {
    id: "required-sections",
    kind: "document",
    description: "The document includes all visible D-ZINE instruction sections.",
    severity: "major",
    check: "visibleSections include required set",
    failureMessage: "Required visible sections are missing."
  },
  {
    id: "contrast-aa",
    kind: "accessibility",
    description: "Text and meaningful icons meet WCAG-oriented contrast expectations.",
    severity: "critical",
    check: "visual audit contrast pass",
    failureMessage: "Meaningful text or icon contrast is not acceptable."
  },
  {
    id: "anti-slop-critical",
    kind: "anti-slop",
    description: "Critical AI slop patterns are absent from approved output.",
    severity: "critical",
    check: "antiPattern severity critical count equals zero",
    failureMessage: "Critical anti-slop patterns were detected."
  },
  {
    id: "export-complete",
    kind: "export",
    description: "Prompt, token, CSS, Tailwind, and Markdown compatibility exports are generated.",
    severity: "major",
    check: "all required export files exist",
    failureMessage: "One or more required export artifacts were not generated."
  }
];
