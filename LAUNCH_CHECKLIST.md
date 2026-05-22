# D-ZINE Launch Checklist

## Required Before Public GitHub Launch

- [ ] Confirm final GitHub repository owner/name.
- [ ] Update `dzine.config.json` GitHub owner, repo, and URL.
- [ ] Confirm package name availability if publishing to npm.
- [ ] Review MIT license ownership text.
- [ ] Run `pnpm check`.
- [ ] Run `node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit`.
- [ ] Run taste audits for all page sources.
- [ ] Review generated website screenshots.
- [ ] Create first GitHub release tag.
- [ ] Enable GitHub Pages for the generated `website/` output.

## Launch Proof

- `reports/website/site-audit/site-audit.md`
- `reports/website/taste-home.md`
- `reports/website/taste-docs.md`
- `reports/website/taste-taste.md`
- `reports/website/taste-framework.md`
- `reports/website/taste-showcase.md`

## Human Decisions Still Needed

- Final repo slug.
- Final author/organization name.
- Whether to publish as `dzine`, `dzine-ai`, or scoped package.
- Whether community taste packs live in this repo or a separate registry repo.
