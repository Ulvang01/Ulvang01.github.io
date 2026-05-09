# Ulvang - Personal Portfolio

Personal portfolio and playground. Built with plain HTML, CSS, and JavaScript - no frameworks, no build step, no dependencies. Partly as a challenge, partly because it suits the scope.

## Philosophy

The site is split into two distinct experiences, chosen from a landing page:

**Portfolio** - A clean, information-oriented page. CV-style layout with sections for skills, experience, education, projects, and contact. Content is driven by JS data files under `data/` so it's easy to update without touching markup.

**Experience** - A creative, interactive section built with a custom canvas/renderer. The idea is to let the rendering and game development side of my work speak through the medium itself rather than just describing it in text. This section is intentionally self-contained - its JS and assets live inside `experience/` to support a heavier engine structure without polluting the rest of the project.

## The World (Experience Concept)

My portfolio is not a page. It is a place.

A world rendered on a 2.5D isometric tilemap - buildings, streets, zones - all navigable in real time. The camera sits at a fixed angle, looking down at a world that is entirely mine. Every structure, every corner, every flickering light represents something about who I am as a developer.

The world is made of tiles. Each tile is a small, hand-crafted piece of a larger picture - walls, rooftops, floors, details. Buildings are aware of where you are. Stand to the left of a structure and you see its left face. Move to the right and the facade shifts. The world responds to you.

Zones within the world hold different parts of my work. Wander into one district and you find my projects. Another holds my skills. Another tells you something about me, or how to reach me. There is no menu. There is no navbar. You simply walk.

The art style is not yet decided, but the world will have a consistent visual language. Something modern. Something deliberate. Light and shadow will do much of the work, with subtle shading separating faces of buildings and grounding objects in space.

Somewhere in this world, things are not quite what they seem.

There may be doors that should not open. Coordinates that should not exist. Interactions that seem like accidents. No promises are made about what is hidden here - only that a world worth building is one with depth that is not immediately visible.

Explore at your own pace. Or don't. The world will be here either way.

*This is a living concept. The theme, the palette, the name of the world - none of it is final.*

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

The overall **colour scheme and visual theme** are also not final - there may be broader design reworks as the experience section takes shape and the two sides need to feel cohesive.

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that deploys to the `gh-pages` branch, which GitHub Pages serves from the root.
