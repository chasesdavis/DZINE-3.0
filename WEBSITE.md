# D-ZINE Website

The public product website is now generated from the D-ZINE site system, not maintained as one monolithic HTML file.

Live site: https://chasesdavis.github.io/DZINE-3.0/

Repository: https://github.com/chasesdavis/DZINE-3.0

## Source Of Truth

```text
dzine.config.json
dzine/theme.css
dzine/pages/home.dzine.html
dzine/pages/docs.dzine.html
dzine/pages/taste.dzine.html
dzine/pages/framework.dzine.html
dzine/pages/showcase.dzine.html
```

## Generated Website

```text
website/index.html
website/docs/index.html
website/taste/index.html
website/framework/index.html
website/showcase/index.html
website/theme.css
website/assets/
```

The generated site is static-host friendly and can be linked from GitHub or published with GitHub Pages. The header includes a GitHub stars pill powered by the `github` block in `dzine.config.json`.

## Dogfooding Claim

The D-ZINE product website is built by D-ZINE:

```bash
pnpm build
node dist/cli/index.js site build --config dzine.config.json --out website
node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit --port 6200
node dist/cli/index.js compile dzine/pages/home.dzine.html --out reports/website/site-prompt.txt
node dist/cli/index.js export dzine/pages/home.dzine.html --target all --out reports/website/exports
node dist/cli/index.js taste audit dzine/pages/home.dzine.html --profile dzine-launch --out reports/website/taste-home.md
```

## Latest Verification

```text
pnpm check
6 test files passed
13 tests passed

pnpm release:verify
build: passed
tests: passed
site build: passed
site audit: passed
taste audit: passed

node dist/cli/index.js site audit --config dzine.config.json --out reports/website/site-audit --port 6200
pages: 5
passed: yes
home score: 100
docs score: 100
taste score: 100
framework score: 100
showcase score: 100

node dist/cli/index.js taste audit dzine/pages/home.dzine.html --profile dzine-launch
score: 100
level: elite
passed: yes
```

## Generated Proof

Site audit:

```text
reports/website/site-audit/site-audit.md
reports/website/site-audit/home/audit.md
reports/website/site-audit/docs/audit.md
reports/website/site-audit/taste/audit.md
reports/website/site-audit/framework/audit.md
reports/website/site-audit/showcase/audit.md
```

Screenshots:

```text
reports/website/site-audit/home/screenshots/mobile.png
reports/website/site-audit/home/screenshots/tablet.png
reports/website/site-audit/home/screenshots/desktop.png
reports/website/site-audit/docs/screenshots/mobile.png
reports/website/site-audit/docs/screenshots/tablet.png
reports/website/site-audit/docs/screenshots/desktop.png
reports/website/site-audit/taste/screenshots/mobile.png
reports/website/site-audit/taste/screenshots/tablet.png
reports/website/site-audit/taste/screenshots/desktop.png
reports/website/site-audit/framework/screenshots/mobile.png
reports/website/site-audit/framework/screenshots/tablet.png
reports/website/site-audit/framework/screenshots/desktop.png
reports/website/site-audit/showcase/screenshots/mobile.png
reports/website/site-audit/showcase/screenshots/tablet.png
reports/website/site-audit/showcase/screenshots/desktop.png
```

Exports:

```text
reports/website/site-prompt.txt
reports/website/exports/prompt.txt
reports/website/exports/goal.txt
reports/website/exports/tokens.json
reports/website/exports/tokens.css
reports/website/exports/tailwind.dzine.config.ts
reports/website/exports/COMPAT_SKILL.md
```

Taste reports:

```text
reports/website/taste-home.md
reports/website/taste-docs.md
reports/website/taste-taste.md
reports/website/taste-framework.md
reports/website/taste-showcase.md
```

## Publishing

Publish the generated `website/` directory through GitHub Pages or any static host. The repo includes `.github/workflows/pages.yml`, which verifies the package and uploads `website/` as the Pages artifact.

GitHub Pages is enabled for this repo with the GitHub Actions build type:

```text
https://chasesdavis.github.io/DZINE-3.0/
```

When moving to a different repo, update `dzine.config.json`, set Pages source to **GitHub Actions**, and run the Pages workflow from `main`.
