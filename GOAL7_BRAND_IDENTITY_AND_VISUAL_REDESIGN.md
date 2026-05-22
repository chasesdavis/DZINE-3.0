# Goal 7: D-ZINE Brand Identity + Visual Redesign

The D-ZINE framework now has a generator, site system, Taste Graph, launch docs, CI, and audits. The remaining launch risk is visual identity: a page can pass technical and taste-contract audits while still feeling too close to an AI-generated product template. Goal 7 creates a distinct D-ZINE brand identity and applies it to the generated website.

## Outcome

D-ZINE should have a recognizable identity system and a redesigned public website that feels specific to the product: AI-native, source-backed, rigorous, open-source, design-critical, and visually memorable.

## Requirements

1. Create a D-ZINE brand identity source under `dzine/brand/`.
2. Define:
   - positioning
   - voice
   - typography posture
   - color roles
   - layout behaviors
   - graphic language
   - icon/mark behavior
   - screenshot/proof treatment
   - misuse rules
3. Add a D-ZINE-specific taste profile that extends `precision-product`.
4. Redesign `dzine/theme.css` from a generic launch-shell style into a distinct brand system.
5. Update generated page sources to use fewer repeated cards and more memorable proof-led composition.
6. Add a brand section or route if needed.
7. Run:
   - `pnpm check`
   - `dzine site build`
   - `dzine site audit`
   - `dzine taste audit` for all page sources
8. Review screenshots and revise until the website no longer reads as generic AI SaaS.

## Design Direction

Use D-ZINE's actual concept as the visual metaphor:

- Renderable source documents.
- Inspection layers.
- Contract blocks.
- Proof rails.
- Taste graph nodes.
- Critique marks.
- Source-to-output pipelines.

Avoid:

- generic dark hero plus beige cards
- repeated rounded cards
- fake terminal aesthetics
- abstract AI gradients
- meaningless badges
- centered SaaS structure

## Success Criteria

1. The website has a distinct brand language documented in `dzine/brand/`.
2. A D-ZINE-specific taste profile exists and is used by the website.
3. The generated site still passes technical and taste audits.
4. Screenshots show a clear visual shift away from generic AI product-site patterns.
5. Launch docs explain how the brand identity and taste profile work together.
