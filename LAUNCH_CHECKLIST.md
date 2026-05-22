# D-ZINE Launch Checklist

## Public GitHub Launch

- [x] Confirm final GitHub repository owner/name: `chasesdavis/DZINE-3.0`.
- [x] Update `dzine.config.json` GitHub owner, repo, and URL.
- [ ] Confirm package name availability if publishing to npm.
- [x] Review MIT license ownership text.
- [x] Run `pnpm check`.
- [x] Run `node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit --port 6200`.
- [x] Run taste audits for all page sources.
- [x] Review generated website screenshots.
- [ ] Create first GitHub release tag.
- [x] Enable GitHub Pages for the generated `website/` output.

## Public URLs

- Repository: https://github.com/chasesdavis/DZINE-3.0
- Website: https://chasesdavis.github.io/DZINE-3.0/

## Launch Proof

- `reports/website/site-audit/site-audit.md`
- `reports/website/taste-home.md`
- `reports/website/taste-docs.md`
- `reports/website/taste-taste.md`
- `reports/website/taste-framework.md`
- `reports/website/taste-showcase.md`

## Human Decisions Still Needed

- Whether npm publishing is in scope for the first release.
- Whether to publish as `dzine`, `dzine-ai`, or scoped package.
- Whether community taste packs live in this repo or a separate registry repo.
