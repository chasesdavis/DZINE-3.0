# Contributing to D-ZINE

Thanks for helping make D-ZINE better.

## Development

```bash
pnpm install
pnpm check
```

Build and audit the website:

```bash
node dist/cli/index.js site build --config dzine.config.json --out website
node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit --port 6200
```

Run taste audits:

```bash
node dist/cli/index.js taste audit dzine/pages/home.dzine.html --profile dzine-launch
```

## Contribution Standards

- Keep `.dzine.html` as the source of truth.
- Do not treat generated Markdown as canonical.
- Preserve source provenance for taste profiles and contracts.
- Do not copy protected designs, brand assets, copy, or proprietary screenshots.
- Add or update tests for parser, compiler, exporter, site, and taste runtime changes.
- Regenerate website outputs and reports when page sources change.

## Taste Pack Contributions

Community taste packs must include:

- source URLs and provenance
- license notes and allowed use
- extracted principles
- positive examples
- anti-patterns
- component, typography, layout, and copy rules
- screenshot/reference notes
- evaluation rubric

Unreviewed taste packs are treated as experimental.
