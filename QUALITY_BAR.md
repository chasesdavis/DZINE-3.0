# D-ZINE Quality Bar

## Quality Thesis

D-ZINE defines quality as the combination of visual excellence, usability, accessibility, implementation realism, and system reuse. A beautiful one-off composition that fails responsiveness, states, or token reuse is not D-ZINE quality.

## Target Standard

D-ZINE output should be able to move between these quality modes without becoming generic:

- **Apple-level restraint:** calm hierarchy, accessibility, reduced motion support, careful color.
- **Stripe-level clarity:** product surfaces that explain themselves and convert without noise.
- **Linear-level discipline:** tight spacing, minimal chrome, clear status and workflow states.
- **Awwwards-level art direction:** expressive web when the brief calls for it, with implementation realism.
- **Pentagram/Collins-level brand discipline:** symbolic, ownable identity systems with coherent applications.

These names are reference quality anchors, not templates to copy.

## Scoring Model

Default rubric scale: 100 points.

Passing score: 85.

Elite score: 92.

Critical failure: automatic fail regardless of score.

| Category | Weight | What Good Means |
| --- | ---: | --- |
| Visual hierarchy | 15 | Clear reading order, strong focal point, no competing noise |
| Spacing and rhythm | 12 | Intentional density, stable gutters, no cramped or empty accidents |
| Token discipline | 10 | Color, type, spacing, radius, and motion map to reusable roles |
| Accessibility | 15 | Contrast, focus, semantics, target size, keyboard, reduced motion |
| Responsive behavior | 12 | Mobile, tablet, desktop, and wide layouts retain intent |
| Motion quality | 8 | Purposeful, performant, reduced-motion-safe |
| Anti-slop resistance | 18 | No generic AI tells, no template defaults, no fake complexity |
| System reuse | 10 | The design can extend across states, sections, and products |

## Critical Failures

Any of these fail the output:

- unreadable text
- text clipped or overflowing its container
- mobile horizontal scroll
- missing focus state for interactive controls
- inaccessible contrast for meaningful text
- color used as the only state indicator
- motion without reduced-motion fallback
- missing loading, empty, or error state for app UI
- generated source includes placeholder code or skipped files
- `.dzine.html` lacks required JSON metadata
- visual system relies on a one-off composition with no reusable rules

## Anti-Slop Bans

D-ZINE must flag or reject:

- generic purple or blue AI gradients
- neon glow buttons
- centered hero repetition by default
- three equal feature cards by default
- generic card grids repeated across sections
- nested card prisons
- random badges, pills, and status chips
- fake runtime labels or decorative operator jargon
- fake metrics such as `99.99%`, `50%`, or `1M+`
- fake brands such as `Acme`, `Nexus`, `NovaCore`, `SmartFlow`
- generic names such as `John Doe` and `Jane Smith`
- generic SaaS words: `Elevate`, `Unleash`, `Seamless`, `Next-gen`, `Revolutionize`
- Lorem Ipsum or placeholder copy
- stock "team smiling at laptop" image direction
- emoji as design content unless explicitly required by product context
- visible TODOs or placeholder comments in deliverables

## Typography Rules

Quality typography requires:

- visible type roles: display, heading, body, label, metadata, mono
- line length suited to context, usually no more than about 65 characters for prose
- strong contrast between display and body without absurd scale jumps
- no tiny unreadable labels
- stable line-height
- no accidental orphans in key headlines when feasible
- numbers in tabular or monospace style for data-heavy UI
- body text not below 14px for product surfaces

Dashboard and app UI should default to clear sans-serif systems. Editorial and brand identity work may use expressive display or serif type if the category supports it.

## Color Rules

Quality color requires:

- semantic roles instead of raw hex scatter
- one dominant accent unless a recipe explicitly allows more
- contrast checked against text and icon usage
- no pure black by default; use intentional off-black or ink colors
- no oversaturated accents unless the visual dialect requires it and accessibility passes
- consistent warm or cool neutral system
- status colors not used as decoration
- light, dark, and high-contrast behavior considered for app UI

## Layout Rules

Quality layout requires:

- grid or explicit layout logic
- max-width and gutters defined
- mobile collapse rules
- stable component dimensions
- no accidental overlap
- no mobile horizontal scroll
- clear first viewport
- no dense hero that tries to show the entire product at once
- cards used only when they communicate grouping or elevation

## Motion Rules

Quality motion requires:

- purpose: feedback, continuity, hierarchy, or delight
- transform and opacity preferred for performance
- no layout-thrashing animation of top, left, width, or height
- no endless decorative motion without value
- no motion that blocks task completion
- reduced-motion fallback
- duration and easing tokens
- mobile performance considered

## Accessibility Rules

D-ZINE treats accessibility as core quality. Audits must check:

- WCAG-oriented text contrast
- non-text contrast where relevant
- visible focus
- keyboard operation for web/app UI
- target sizing and spacing for touch
- semantic landmarks and labels
- color-only communication
- reduced-motion preference
- error identification and recovery
- consistent navigation and help patterns

## State Completeness

Any real app UI recipe must define:

- default
- hover where relevant
- active/pressed
- focus
- disabled
- loading
- empty
- error
- success or confirmation

Marketing pages still need hover, focus, loading for dynamic embeds, form errors, and responsive navigation states.

## Web Workflow Quality

A web recipe passes when:

- hero is memorable but readable
- section rhythm varies without feeling random
- imagery is purposeful
- CTA path is clear
- trust/proof is believable
- no repeated generic section block
- footer and legal/basic navigation are present when appropriate

## Mobile Workflow Quality

A mobile recipe passes when:

- it feels app-native, not like a website inside a phone
- safe areas are respected
- navigation matches platform expectations
- touch targets are comfortable
- text is readable at normal mockup size
- screen progression is logical
- visual system remains consistent across screens

## App UI Quality

An app UI recipe passes when:

- workflows are efficient
- hierarchy supports repeated use
- forms and data states are complete
- dense areas have breathing room nearby
- status and errors are understandable
- navigation avoids dead ends
- controls are discoverable

## Brand Kit Quality

A brand kit passes when:

- the logo concept is symbolic, not random
- the core metaphor is clear
- color roles are usable
- type choices support category and tone
- applications prove the system beyond one image
- image direction is specific
- the board feels like a serious identity presentation, not a moodboard collage

## Brand Identity Quality

A brand identity recipe passes when:

- positioning, tone, mark, color, type, UI, and campaign behavior align
- the identity has rules that scale
- the brand avoids generic startup language
- visual decisions are tied to strategy
- the system can produce multiple artifacts without drifting

## Audit Output

The human-readable audit should include:

- score
- pass/fail
- critical failures
- category scores
- screenshot references when available
- findings ordered by severity
- concrete remediation
- final recommendation: `ship`, `revise`, or `reject`
