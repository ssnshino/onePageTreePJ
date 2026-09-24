# CURRENT SNAPSHOT

Updated: 2026-09-25T00:28:00+09:00

## Repository State

- Repository: `ssnshino/onePageTreePJ`
- Default branch: `main`
- Initial bootstrap PR: `#1`
- PR #1 status: MERGED
- Repository workflow is now the canonical project handoff mechanism.

## Current Baseline

- Version: `v0.5 TREES & ROCKS`
- HTML: `threejs_onepage_waterworld_v0.5_trees_rocks.html`
- Runtime: Three.js r186 CDN modules
- Project phase: dedicated Three.js realistic-world research / natural asset quality

## Current Visual Verdict

### Passable
- water
- mountains
- atmosphere / fog
- basic camera interaction
- planar reflection integration

### Active Bottleneck
- trees
- rocks

Human real-device recordings showed that simplified natural assets now cap the perceived realism of the entire scene.

## Next Target

`v0.6 NATURAL ASSET QUALITY`

Focus:
- tree silhouette and foliage
- branch architecture
- bark material
- rock geology / fracture / surface material
- natural placement
- LOD and smartphone-safe rendering

## Constraints

- Do not regress water or mountain quality while improving natural assets.
- Preserve one-page execution.
- Human visual recording remains the final quality gate.
- Use PR-first development; main remains Human-reviewed stable baseline.

## Update History

- 2026-09-24T09:39:00+09:00 — ChatGPT — Initial snapshot created from v0.1-v0.5 research session.
- 2026-09-24T10:03:46+09:00 — ChatGPT — PR #1 merge confirmed; repository is now canonical. Next-chat handoff updated for dedicated v0.6 research.

## Active Candidate — Hero Tree Prototype 01

- Branch: `feature/v0.6-hero-tree-prototype-01`
- Candidate HTML: `threejs_onepage_waterworld_v0.6_hero_tree_prototype_01.html`
- Scope: one near-view old broadleaf tree only
- Static syntax: PASS
- Human browser / real-device visual review: PENDING
- Stable baseline remains v0.5 until Human approval and merge.

## Smartphone Runtime Finding

Initial Hero Tree candidate failed when downloaded and opened locally on smartphone.

The active candidate has been repackaged as a **local-file-safe compatibility bundle**:
- no ES modules
- no import map
- no runtime CDN dependency
- Three.js r160 classic + required addons embedded in the HTML

Human smartphone retest is pending.

## Active Build-System Candidate

- Branch: `refactor/source-split-build-system`
- Draft PR: `#4`
- Base: `feature/v0.6-hero-tree-prototype-01`
- Development source is now split under `src/`
- Three.js r186 is bundled with esbuild into a classic IIFE
- Final output remains one HTML
- GitHub Actions build/verify: **PASS** (run `35953170260`)
- Generated size: about 605.5 KiB
- runtime import map / module / CDN dependency: none
- Human smartphone test of the **r186 bundled artifact**: PENDING

Important: the previous r160 local-safe Hero Tree candidate already booted successfully on smartphone. The build-system phase now restores r186 while keeping the local one-file distribution target.

## Active Candidate — Hero Tree Prototype 02 OLD OAK

- Branch: `feature/v0.6-hero-tree-prototype-02-old-oak`
- Draft PR: `#5`
- Base: `refactor/source-split-build-system`
- Artifact: `threejs_onepage_waterworld_v0.6_hero_tree_prototype_02_old_oak.html`
- Research basis: Weber–Penn / Three.js r186 TreeGenerator / SeedThree White Oak
- Generic foliage clusters replaced with base-anchored individual oak leaves
- Performance HUD expanded to FPS / TRI / CALL / GEO / TEX / DPR / REFLECT
- GitHub Actions run `35955885981`: **PASS**
- Human visual review: PENDING

## Active Tuning Tool — OLD OAK TREE LAB

- Branch: `feature/tree-lab-old-oak-tuning`
- Draft PR: `#6`
- Output: `dist/tree-lab-old-oak.html`
- Same OLD OAK generator as main scene
- branch collar experiment enabled
- trimmed leaf-card mesh enabled
- direct morphology controls
- silhouette / wireframe / roots / foliage review modes
- GitHub Actions run `35958048878`: **PASS**
- Human tuning review: PENDING

## Active Candidate — TREE LAB UI v2

- Branch: `feature/tree-lab-ui-v2`
- Draft PR: `#7`
- Base: `feature/tree-lab-old-oak-tuning`
- Output: `dist/tree-lab-old-oak.html`
- Desktop: floating Inspector → edge restore tab
- Mobile: bottom sheet → bottom restore pill
- Native disclosure groups
- segmented fixed-view control
- display toggles separated from actions
- localStorage state persistence
- Save / Load / Copy JSON preset tools
- keyboard shortcuts: I / H / 1–4 / W / S
- GitHub Actions run `35960630079`: **PASS**
- Human UI review: PENDING

## Active Reference Study — Bedford Oak

- Branch: `feature/tree-lab-bedford-oak-reference`
- Draft PR: `#9`
- Primary real-tree target: Bedford Oak, Bedford NY (`Quercus alba`)
- 2022 measured target: 69 ft height / >120 ft spread / 21 ft 3 in circumference at 4.5 ft
- Normalized target spread/height: >= 1.74
- Normalized target trunk diameter/height: ~= 0.098
- TREE LAB now displays live model ratios beside real-tree targets
- Bedford 2022 photo link is built into the Inspector
- Wye Oak retained as secondary buttress/root reference
- GitHub Actions run `36010044269`: **PASS**
- Human photographic comparison: PENDING

## Active Tuning — Foliage Volume

- Branch: `feature/tree-lab-foliage-volume-tuning`
- Draft PR: `#10`
- Base: `feature/tree-lab-bedford-oak-reference`
- Bedford/Oak skeleton retained
- New canopy controls: density / inner fill / clump span / dead branches / lower crown fill / sky gaps
- Foliage presets: sparse / winter-ish / summer / dense
- WOOD display toggle allows leaves-only review
- GitHub Actions run `36020030281`: **PASS**
- Human canopy-density review: PENDING
