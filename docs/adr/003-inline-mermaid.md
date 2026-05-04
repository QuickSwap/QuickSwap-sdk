# ADR 003 — Inline mermaid blocks over .mmd source files

- **Status:** Accepted
- **Date:** 2026-05-04

## Context

GitHub renders fenced ` ```mermaid ` blocks inline in markdown but does NOT
embed linked `.mmd` files — a `![](diagram.mmd)` reference shows up as a broken
image. Two real options for this repo's architecture diagrams:

- **(A)** Inline mermaid in the markdown file where the diagram is consumed.
- **(B)** Keep `.mmd` source files and add CI that renders them to SVG, commit
  the SVGs alongside, and embed via `![](path.svg)`.

## Decision

Choose **(A)**: inline mermaid blocks in the markdown that consumes them.

## Consequences

Wins:

- Line-by-line reviewable diffs in PRs — diagram changes show up as text diffs.
- Single artifact per diagram — no source/render pair that can drift.
- Zero new CI infrastructure to maintain.
- Zero supply-chain footprint — avoids pulling in `mermaid-cli` and a headless
  Chromium just to render a few boxes.

Costs:

- GitHub-only render surface — does not render on npm package READMEs, on
  archive.org snapshots, on plain Docusaurus / MkDocs without a plugin, or in
  basic VS Code without a mermaid extension.
- Accessibility burden falls on the `accTitle` / `accDescr` directives or on a
  prose summary alongside each diagram.
- Mermaid version is whatever GitHub ships — out of repo control.
- Diagrams are not directly reusable as binary assets for slides or PDFs.

## Revisit trigger

Reconsider option (B) if QuickSwap adds a doc site, npmjs starts syndicating
the architecture page, or contributors report unrendered mermaid in their
tooling.
