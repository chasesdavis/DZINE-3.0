# Goal 8: Release Packaging And GitHub Pages

Ship D-ZINE as a serious open-source package and website, not only a local proof-of-concept.

## Context

D-ZINE now has a working `.dzine.html` framework, CLI, Taste Graph, generated website, visual audits, taste audits, docs, launch files, and a stronger product identity. The remaining release work is to make the repo behave well after it leaves this local workspace.

## Work

1. Ensure the npm package includes the bundled Taste Graph and key D-ZINE source artifacts.
2. Make `dzine taste list/show/audit` resolve a local taste registry first and fall back to the package-bundled registry when no project registry exists.
3. Add GitHub Pages deployment workflow for the generated `website/` directory.
4. Extend CI/release scripts so build, tests, site generation, site audit, and taste audit are repeatable.
5. Update README and website docs with package, Pages, and release instructions.
6. Rebuild the generated website after documentation changes.
7. Run final checks and confirm no temporary generated directories remain.

## Success Criteria

1. `pnpm check` passes.
2. `dzine taste list` works with the default registry path in this repo.
3. The package `files` list includes bundled taste profiles/contracts/sources and D-ZINE docs needed by installed users.
4. GitHub Actions can build and publish `website/` through Pages.
5. `site audit` passes all five generated pages.
6. Taste audits pass for the D-ZINE launch pages.
7. README and WEBSITE docs explain how to publish and verify the project.
