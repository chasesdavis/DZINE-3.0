import { bundledRecipes } from "../recipes/bundled.js";

export interface SampleProjectOptions {
  name: string;
  mode: string;
  dialect: string;
}

export function createSampleDzineHtml(options: SampleProjectOptions): string {
  const safeTitle = escapeHtml(options.name);
  const recipe = bundledRecipes.find((item) => item.mode === options.mode) ?? bundledRecipes[0];
  return `<!doctype html>
<html lang="en" data-dzine-version="3.0">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      :root {
        --dz-canvas: #f7f4ef;
        --dz-ink: #171511;
        --dz-muted: #635f57;
        --dz-accent: #b9472f;
        --dz-line: rgba(23, 21, 17, 0.14);
      }
      body {
        margin: 0;
        background: var(--dz-canvas);
        color: var(--dz-ink);
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      main {
        width: min(1120px, calc(100% - 40px));
        margin: 0 auto;
        padding: 64px 0;
      }
      section {
        border-top: 1px solid var(--dz-line);
        padding: 40px 0;
      }
      h1 {
        font-size: clamp(3rem, 8vw, 7rem);
        line-height: 0.92;
        letter-spacing: -0.04em;
        max-width: 980px;
        margin: 0 0 24px;
      }
      h2 {
        font-size: clamp(1.5rem, 3vw, 2.5rem);
        line-height: 1;
        margin: 0 0 16px;
      }
      p, li {
        color: var(--dz-muted);
        line-height: 1.65;
        max-width: 68ch;
      }
      .specimen {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
      }
      .tile {
        border: 1px solid var(--dz-line);
        border-radius: 18px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.46);
      }
      .button {
        display: inline-flex;
        min-height: 44px;
        align-items: center;
        border-radius: 999px;
        background: var(--dz-accent);
        color: white;
        padding: 0 20px;
        font-weight: 700;
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
      }
    </style>
    <script type="application/dzine+json" id="dzine-root">
      {
        "schemaVersion": "3.0.0",
        "kind": "dzine.document",
        "title": "${jsonEscape(options.name)}",
        "description": "A canonical D-ZINE sample project using renderable .dzine.html as source of truth.",
        "modes": ["${jsonEscape(options.mode)}"],
        "visualDialect": "${jsonEscape(options.dialect)}",
        "sourceFormat": ".dzine.html",
        "createdBy": "D-ZINE",
        "quality": { "profile": "elite", "auditLevel": "strict", "antiSlopPolicy": "fail-on-critical" },
        "exports": ["prompt", "tokens", "css", "tailwind", "markdown"]
      }
    </script>
    <script type="application/dzine+json" id="dzine-brief">
      {
        "kind": "dzine.brief",
        "project": "${jsonEscape(options.name)}",
        "audience": ["AI coding agents", "design engineers", "brand builders"],
        "platforms": ["${jsonEscape(options.mode)}"],
        "objective": "Generate elite, reusable design direction without generic AI slop.",
        "constraints": ["Use .dzine.html as source of truth", "Export tokens and prompts", "Preserve accessibility"],
        "successCriteria": ["Preview renders", "Prompt compiles", "Tokens export", "Audit passes"]
      }
    </script>
    <script type="application/dzine+json" id="dzine-dna">
      {
        "kind": "dzine.designDNA",
        "density": 4,
        "variance": 8,
        "motion": 5,
        "imagePriority": 7,
        "brandPosture": "precise, confident, restrained",
        "copyPosture": "specific, direct, low-hype",
        "visualDialect": "${jsonEscape(options.dialect)}",
        "bannedPatterns": ["ai-purple-gradient", "three-equal-card-row", "generic-saas-copy", "nested-card-prison"],
        "requiredStates": ["default", "hover", "active", "focus", "disabled", "loading", "empty", "error"]
      }
    </script>
    <script type="application/dzine+json" id="dzine-tokens">
      {
        "kind": "dzine.tokens",
        "format": "dtcg",
        "tokens": {
          "color": {
            "background": { "canvas": { "$type": "color", "$value": "#f7f4ef", "$description": "Warm primary canvas" } },
            "text": { "primary": { "$type": "color", "$value": "#171511" }, "secondary": { "$type": "color", "$value": "#635f57" } },
            "accent": { "primary": { "$type": "color", "$value": "#b9472f", "$description": "Single decisive accent" } }
          },
          "space": {
            "4": { "$type": "dimension", "$value": "1rem" },
            "8": { "$type": "dimension", "$value": "2rem" },
            "12": { "$type": "dimension", "$value": "3rem" }
          },
          "radius": {
            "control": { "$type": "dimension", "$value": "999px" },
            "panel": { "$type": "dimension", "$value": "18px" }
          }
        }
      }
    </script>
    <script type="application/dzine+json" id="dzine-recipes">
      {
        "kind": "dzine.recipes",
        "recipes": [
          ${JSON.stringify(recipe, null, 10)}
        ]
      }
    </script>
    <script type="application/dzine+json" id="dzine-rubric">
      {
        "kind": "dzine.rubric",
        "scoring": { "scale": 100, "pass": 85, "elite": 92 },
        "categories": [
          { "id": "hierarchy", "weight": 15 },
          { "id": "spacing", "weight": 12 },
          { "id": "tokens", "weight": 10 },
          { "id": "accessibility", "weight": 15 },
          { "id": "responsive", "weight": 12 },
          { "id": "motion", "weight": 8 },
          { "id": "anti-slop", "weight": 18 },
          { "id": "system-reuse", "weight": 10 }
        ],
        "criticalFailures": ["unreadable-text", "missing-focus-state", "horizontal-scroll-mobile", "generic-ai-gradient", "missing-required-json"]
      }
    </script>
  </head>
  <body>
    <main>
      <section data-dzine-section="overview">
        <h1>${safeTitle}</h1>
        <p>D-ZINE source files are visual instruction documents and machine-readable contracts in one renderable artifact.</p>
        <span class="button">Compile agent prompt</span>
      </section>
      <section data-dzine-section="design-dna">
        <h2>Design DNA</h2>
        <p>Density 4, variance 8, motion 5, and a ${escapeHtml(options.dialect)} dialect. The system avoids generic AI patterns by encoding bans and acceptance gates directly in the source.</p>
      </section>
      <section data-dzine-section="tokens">
        <h2>Tokens</h2>
        <div class="specimen">
          <div class="tile">Canvas #f7f4ef</div>
          <div class="tile">Ink #171511</div>
          <div class="tile">Accent #b9472f</div>
        </div>
      </section>
      <section data-dzine-section="recipes" data-dzine-recipe="${escapeHtml(recipe.id)}">
        <h2>Recipe: ${escapeHtml(recipe.id)}</h2>
        <p>${escapeHtml(recipe.description ?? "D-ZINE recipe")}</p>
      </section>
      <section data-dzine-section="components">
        <h2>Component specimens</h2>
        <div class="specimen">
          <div class="tile">Primary action with focus, hover, active, disabled, loading, empty, and error state requirements.</div>
        </div>
        <template data-dzine-component="primary-action" data-platform="${escapeHtml(options.mode)}" data-tokens="color.accent.primary,radius.control" data-states="default,hover,active,focus,disabled,loading" data-accessibility="44px target,visible focus">
          <button class="button">Request access</button>
        </template>
      </section>
      <section data-dzine-section="anti-patterns">
        <h2>Anti-patterns</h2>
        <article data-dzine-antipattern="three-equal-card-row" data-severity="major">
          <p>Do not default to three equal feature cards. Use the recipe's section rhythm instead.</p>
        </article>
      </section>
      <section data-dzine-section="quality-gates">
        <h2>Quality gates</h2>
        <ul>
          <li>Contrast, focus, touch target, and reduced-motion behavior are quality requirements.</li>
          <li>Prompt, token, CSS, Tailwind, and Markdown compatibility exports must compile from this source.</li>
        </ul>
      </section>
    </main>
  </body>
</html>
`;
}

export function createSampleReadme(options: SampleProjectOptions): string {
  return `# ${options.name}

This project was generated by \`dzine init\`.

- Source: \`project.dzine.html\`
- Format: valid renderable HTML with \`application/dzine+json\` metadata
- Mode: \`${options.mode}\`
- Dialect: \`${options.dialect}\`

Run:

\`\`\`bash
dzine compile project.dzine.html --out prompt.txt
dzine export project.dzine.html --target all --out exports
dzine audit project.dzine.html
\`\`\`
`;
}

export function createRecipesReadme(): string {
  return `# D-ZINE Recipes

Recipes are structured workflows consumed from \`.dzine.html\` metadata.

Bundled v1 recipes:

- web-landing
- mobile-app-flow
- app-ui-surface
- brand-kit
- brand-identity
`;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function jsonEscape(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}
