# Ulvang — Personal Portfolio

Personal portfolio and playground. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies. Partly as a challenge, partly because it suits the scope.

## Philosophy

The site is split into two distinct experiences, chosen from a landing page:

**Portfolio** — A clean, information-oriented page. CV-style layout with sections for skills, experience, education, projects, and contact. Content is driven by JS data files under `data/` so it's easy to update without touching markup.

**Experience** — A creative, interactive section built with a custom canvas/renderer. The idea is to let the rendering and game development side of my work speak through the medium itself rather than just describing it in text. This section is intentionally self-contained — its JS and assets live inside `experience/` to support a heavier engine structure without polluting the rest of the project.

## Structure

```
index.html              # Landing / choice page
informational/          # Portfolio page
experience/             # Interactive experience (self-contained)
  experience.js         # Entry point for the renderer
css/                    # Shared and page-specific stylesheets
js/                     # Shared scripts (choice page logic etc.)
data/                   # Content as JS modules (skills, projects, etc.)
.github/workflows/      # CI — auto-deploys main → gh-pages on push
```

## Status

The **portfolio** side is largely complete, though content and copy will be tweaked over time.

The **experience** section is a work in progress. The direction, scope, and implementation are still being figured out. Expect it to change significantly.

The overall **colour scheme and visual theme** are also not final — there may be broader design reworks as the experience section takes shape and the two sides need to feel cohesive.

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that deploys to the `gh-pages` branch, which GitHub Pages serves from the root.
