# Goal 6: Production Launch Hardening + Taste-Led Website Upgrade

Move D-ZINE from a working prototype framework into a GitHub-launch-ready open-source product. Goal 5 gave the system a Taste Kernel. Goal 6 must use that kernel to harden the repository, improve the website's design direction, and make the project credible for public release.

## Outcome

D-ZINE should feel like a serious open-source product: installable, documented, auditable, taste-aware, and presented through a launch website that no longer feels like a generic AI-generated SaaS page.

## Requirements

1. Improve the generated D-ZINE website using the `precision-product` taste profile.
2. Replace repetitive card-heavy sections with more varied, proof-led composition.
3. Make the docs route deeper and easier to navigate.
4. Add launch-ready repository files:
   - `LICENSE`
   - `CONTRIBUTING.md`
   - `SECURITY.md`
   - `CHANGELOG.md`
   - `.github/workflows/ci.yml`
   - issue templates
5. Add package metadata so the repo is closer to npm/GitHub release readiness.
6. Add a production launch checklist.
7. Verify:
   - `pnpm check`
   - `dzine site build`
   - `dzine site audit`
   - `dzine taste audit` for all page sources

## Taste Direction

Use the Taste Kernel rather than decoration:

- Show real artifacts before claims.
- Make the homepage feel like a developer-product operating manual, not a landing page template.
- Let source paths, commands, generated reports, screenshots, and taste profiles carry the product proof.
- Reduce generic card grids.
- Use stronger section contrast, editorial pacing, and system diagrams.
- Keep GitHub Pages static hosting intact.

## Success Criteria

1. The public website remains generated from `dzine.config.json` and `dzine/pages/*.dzine.html`.
2. The website includes GitHub stars, docs, framework, showcase, and taste-system content.
3. The repo includes launch-ready contribution/security/license/change documentation.
4. CI is configured for `pnpm install` and `pnpm check`.
5. All technical and taste audits pass.
6. The launch checklist clearly states what still needs human input, such as final GitHub repo slug and release tag.
