# Goal 4: Multi-Page D-ZINE Website Generator

Build D-ZINE 3.0 beyond single-file artifacts into a real multi-page website system, then use that system to generate the public D-ZINE open-source product launch website.

## Outcome

D-ZINE can define a full website from a project config plus page-level `.dzine.html` source files, generate static routes, preserve D-ZINE metadata, expose a GitHub stars pill, and ship an in-depth docs section for the open-source product.

## Required Capabilities

1. Add a site project model with a repo-local config file.
2. Support multiple page-level `.dzine.html` source files.
3. Generate static multi-route output into `website/`.
4. Share a polished product-grade theme across generated pages.
5. Include a GitHub stars pill that fetches live star count from GitHub when the site is online.
6. Build a detailed docs section for users, contributors, and AI agents.
7. Keep generated pages accessible, responsive, and audit-friendly.
8. Provide CLI commands for site build and site audit.
9. Apply the system to the actual D-ZINE website, not only a sample.
10. Regenerate reports, screenshots, exports, and tests after the site is built.

## Implementation Plan

1. Create `dzine.config.json` as the D-ZINE site manifest.
2. Add `src/site/*` modules for config loading, page extraction, route generation, asset copying, and site audit.
3. Extend the CLI with `dzine site build` and `dzine site audit`.
4. Move the product website into page sources under `dzine/pages/`.
5. Generate:
   - `website/index.html`
   - `website/docs/index.html`
   - `website/framework/index.html`
   - `website/showcase/index.html`
6. Add a detailed docs page covering concepts, install, file format, project structure, CLI, recipes, audits, anti-slop rules, GitHub Pages, and agent workflows.
7. Add live GitHub star loading through a progressive-enhancement script with a readable fallback.
8. Verify with TypeScript tests, generated screenshots, and visual audits.

## Success Criteria

1. `pnpm check` passes.
2. `node dist/cli/index.js site build --config dzine.config.json --out website` generates a multi-page website.
3. `node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit` audits every generated route.
4. The generated website includes at least four routes: home, docs, framework, showcase.
5. The docs route is detailed enough for a new user to understand and adopt D-ZINE.
6. The GitHub pill renders in the header and fetches a live star count when configured.
7. The D-ZINE website is no longer only a single hand-authored HTML file.
8. Generated pages remain static-host friendly for GitHub Pages.
