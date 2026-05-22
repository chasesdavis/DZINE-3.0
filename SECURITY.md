# Security Policy

## Reporting A Vulnerability

Please report suspected vulnerabilities privately to the maintainer before public disclosure.

Include:

- affected version or commit
- reproduction steps
- impact
- suggested mitigation if known

## Scope

D-ZINE is a local TypeScript CLI and static-site generator. Security-sensitive areas include:

- file path handling in preview and site generation
- untrusted `.dzine.html` parsing
- generated static HTML
- future taste-pack or plugin loading

## Current Guardrails

- Preview server constrains file reads to the configured root.
- Taste packs are data files and should remain source-reviewed.
- Community taste packs are untrusted until reviewed.

Do not run untrusted D-ZINE projects without reviewing their HTML and scripts.
