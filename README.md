# Ansyn Lab — design preview

Live preview: https://7-an.github.io/ansyn-lab-preview/

This repository contains a compiled snapshot of the local Ansyn Lab website for design review. It does not deploy to or change ansyn.me.

The editable Astro project remains the source of truth. Build it with `--site https://7-an.github.io --base /ansyn-lab-preview`, then run the local preview packaging script to adapt public asset URLs and remove unused assets. Publish the resulting snapshot to this repository’s `main` branch. GitHub Pages serves the repository root; `.nojekyll` preserves `_astro` assets.

The preview defaults to English and supports the current Chinese toggle. Article titles retain their original language. Background music is disabled and is not included.

Do not edit generated bundles. Update the local source and publish another snapshot. Use a revert commit to roll back a preview. No custom domain is configured here.
