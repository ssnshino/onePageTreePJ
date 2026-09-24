# ONE-PAGE BUILD SYSTEM / SOURCE SPLIT QA

Created: 2026-09-24T12:32:00+09:00

## Candidate

Branch:
`refactor/source-split-build-system`

PR:
`#4 refactor: split source and build one-page artifact`

## Source Integrity

| Check | Result |
|---|---|
| r186 Prototype 01 source recovered | PASS |
| application import lines removed before fragmenting | PASS |
| ordered fragment boundaries found | PASS |
| fragment re-concatenation equals original app source | PASS |
| Hero Tree source isolated in `60-hero-tree.js` | PASS |

## Build

GitHub Actions run `35953170260`.

| Check | Result |
|---|---|
| npm install | PASS |
| Three.js 0.186.0 bundle | PASS |
| esbuild 0.28.2 IIFE | PASS |
| single HTML generated | PASS |
| artifact upload | PASS |
| verify script | PASS |

Generated size:
approximately **605.5 KiB**

## Dist Contract

Verified:
- no `type="module"`
- no import map
- no runtime Three.js CDN import
- complete HTML
- one inline style
- one classic inline script
- Hero Tree UI marker retained
- r186 bundled runtime marker retained

## Build Bug Fixed

Raw minified JS must not be passed directly as the replacement string to `String.replace()`, because `$&`, `$'`, etc. have replacement semantics.

The build now uses function replacers to preserve literal bundle content.

## Browser QA

### Known Human baseline

The prior r160 local-safe Hero Tree Prototype 01 successfully booted on smartphone and produced a real-device screenshot.

### r186 bundled candidate

Agent-side Chromium visual test was attempted, but the container cannot initialize EGL/SwiftShader WebGL.

Therefore:

**Human smartphone `file://` re-test is REQUIRED before merge.**

## Pass Condition

The r186 bundled HTML must:
- open directly from downloaded local file
- render the same lake / tree scene
- preserve water reflection and controls
- show no network dependency for Three.js runtime
- maintain acceptable mobile FPS
