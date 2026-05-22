# Goal 5: D-ZINE Taste Kernel + Taste Registry

Build the taste layer D-ZINE is currently missing. The existing framework can generate pages and run technical audits, but it does not yet know where taste comes from or how to judge non-generic design quality. Goal 5 introduces a source-backed Taste Graph, structured taste profiles, aesthetic contracts, community taste packs, and a critique loop that can evaluate generated work beyond basic accessibility and responsiveness.

## Why This Exists

There actually is a `DESIGN.md`-style ecosystem D-ZINE can pull from. Public collections like [Awesome Design MD Gallery](https://design.hagicode.com/) and [awesome-design-md](https://github.com/VoltAgent/awesome-design-md?ref=aiposthub.com) collect public design-system documents. That is exactly the kind of source layer D-ZINE should ingest.

But D-ZINE must not depend on one database. It needs a broader **D-ZINE Taste Graph**.

## Taste Graph Sources

D-ZINE should pull from:

- Public `DESIGN.md` collections: [Awesome Design MD Gallery](https://design.hagicode.com/), [awesome-design-md](https://github.com/VoltAgent/awesome-design-md?ref=aiposthub.com)
- Design token standards: [Design Tokens Community Group](https://github.com/design-tokens)
- Design system galleries: [Design Systems Gallery](https://designsystem.gallery/), [DesignSystems.one](https://www.designsystems.one/design-systems), [Design Systems Repo](https://www.uwarp.design/design-systems-repo)
- Curated GitHub repos: [awesome-design-systems](https://github.com/klaufel/awesome-design-systems), [Awesome Design Tokens](https://github.com/sturobson/Awesome-Design-Tokens)
- Real product pattern libraries: Mobbin, Refero, PageFlows, ScreensDesign
- Canonical systems: Apple HIG, Material, Carbon, Polaris, Fluent, Spectrum, Atlassian, GOV.UK
- Brand and agency case studies: Pentagram, Collins, Instrument, Work & Co, DIA, Stripe, Linear, Vercel, Figma, GitHub

The key rule: **do not just scrape inspiration and hope it works.** Convert sources into structured taste contracts.

## Required File Model

```text
dzine/taste/
  registry.json
  sources/
    design-md.source.json
    canonical-systems.source.json
    product-patterns.source.json
    brand-agency.source.json
  profiles/
    precision-product.taste.json
    editorial-launch.taste.json
    mobile-native.taste.json
    brand-identity.taste.json
  contracts/
    anti-slop.contract.json
    typography.contract.json
    layout-rhythm.contract.json
    product-proof.contract.json
  critiques/
    generic-saas-hero.critique.dzine.html
    premium-product-shell.critique.dzine.html
  community/
    README.md
```

## Taste Profile Requirements

Each taste profile must include:

- provenance and source URLs
- license notes
- allowed use
- extracted principles
- positive examples
- anti-patterns
- component rules
- typography rules
- layout rhythm rules
- copy rules
- screenshot/reference notes
- evaluation rubric

People should eventually be able to publish their own taste profiles, such as:

```text
@dzine/taste-linear-operator
@dzine/taste-brutalist-editorial
@dzine/taste-fintech-premium
@dzine/taste-mobile-health
```

## Self-Improvement Guardrails

D-ZINE may self-improve over time, but only with guardrails:

1. D-ZINE generates a site/app.
2. It screenshots the result.
3. A critique engine scores it against taste contracts.
4. The user can approve or reject the critique.
5. D-ZINE stores what worked as a local learning.
6. Strong learnings can become community taste packs after review.

No anonymous scraping-to-style pipeline. No copying protected designs. No unreviewed global self-modification.

## Implementation Plan

1. Add TypeScript types and schemas for taste sources, profiles, contracts, critiques, and taste audit reports.
2. Add the `dzine/taste/` registry and seed source-backed profiles.
3. Add `dzine taste list`, `dzine taste show`, and `dzine taste audit`.
4. Make taste audit score generated work against specificity, provenance, typography, layout rhythm, product proof, anti-slop, and community readiness.
5. Wire D-ZINE website pages to declare an active taste profile.
6. Update docs to explain the Taste Graph and custom taste profile model.
7. Add tests that prove taste profiles load and taste audits catch generic AI slop.
8. Regenerate the website and reports.

## Success Criteria

1. The repo includes a real `dzine/taste/` graph with sources, profiles, contracts, critiques, and community guidance.
2. `dzine taste list` prints available profiles.
3. `dzine taste show precision-product` prints a source-backed profile.
4. `dzine taste audit dzine/pages/home.dzine.html --profile precision-product` produces a taste report.
5. Taste audit fails obvious generic slop fixtures and passes the improved D-ZINE source pages.
6. D-ZINE docs explain where taste comes from and how users can add their own profiles/contracts.
7. `pnpm check` passes.
8. The generated website and site audit still pass after the taste layer is wired in.
