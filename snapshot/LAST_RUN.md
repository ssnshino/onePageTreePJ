# LAST RUN

Updated: 2026-09-25T00:28:00+09:00

## Session Summary

A brainstorming experiment with Three.js evolved into a dedicated realistic 3D research project.

Versions produced and preserved:
1. v0.1 basic Three.js water
2. v0.2 real reflection
3. v0.3 clear lake / lakebed
4. v0.4 shoreline / vegetation
5. v0.5 tree / rock focused prototype

## Human Feedback

- Three.js is dramatically stronger than Canvas pseudo-3D for real 3D space.
- v0.2 showed a major realism jump with real planar reflection.
- transparent water and visible lakebed improved depth perception.
- water and mountains reached a passable level.
- trees and rocks became the largest realism penalty.
- next phase should spend substantial effort on trees and rocks.

## Repository Bootstrap

Dedicated repository:
`ssnshino/onePageTreePJ`

Reference repository workflow:
`ssnshino/vectorRally`

Repository bootstrap included:
- AGENTS.md
- PLAN / SPEC / WORKLOG / QA head-history structure
- snapshot handoff documents
- research/water
- research/trees-rocks
- samples/v0.1 through samples/v0.5
- current v0.5 HTML at repository root
- v0.6 Natural Asset Quality plan

Initial bootstrap Pull Request:
`#1 chore: bootstrap Three.js realistic-world project structure`

Status:
**MERGED to main**

## Next Session

Open a dedicated Three.js chat, use `snapshot/NEXT_CHAT_PROMPT.txt`, then start v0.6 by researching high-quality tree and rock rendering techniques before implementation.

## Update History

- 2026-09-24T10:03:46+09:00 — ChatGPT — Repository bootstrap merge recorded and next-session handoff finalized.

## Current Run — Hero Tree Prototype 01

v0.6 implementation has started on `feature/v0.6-hero-tree-prototype-01`.

Implemented candidate:
- curved tapered swept trunk/branches
- 4-level hierarchy
- exposed surface roots
- procedural bark reuse
- procedural alpha-cutout foliage cards
- InstancedMesh foliage
- Hero Tree review camera

Static JS compile passed. Browser/Human visual review remains pending.

Important repository finding: current v0.5 HTML artifact is truncated at 1000 lines; the v0.6 candidate restores only the shared tail from the complete v0.4 sample without modifying v0.5 itself.

## Runtime Packaging Revision

The first smartphone local-file test exposed a module-loading failure.

The Hero Tree candidate was repackaged for direct `file://` execution:
- Three.js r160 classic core fully embedded
- required addons embedded
- no import map / no `type="module"`
- static combined-JS parse PASS

Next action: smartphone local-file retest.

## Build System / Source Split Run

A new stacked branch `refactor/source-split-build-system` was created before Hero Tree Prototype 02.

Key change:
**one-page is now treated as a distribution format, not a source-code format.**

Implemented:
- `src/` development source
- 10 ordered JavaScript fragments
- separate CSS/template
- Three.js `0.186.0` npm dependency
- esbuild `0.28.2`
- one-page IIFE build
- static dist verifier
- GitHub Actions artifact build

CI initially exposed an HTML inlining bug caused by JavaScript `String.replace()` replacement-string semantics. The build was corrected to use function replacement and preserve minified JS literally.

Final CI:
- GitHub Actions run `35953170260`
- build PASS
- verify PASS
- output approximately 605.5 KiB

Agent-side headless Chromium could not initialize WebGL/EGL, so visual review remains Human authority.

Next:
download the r186 bundled one-page artifact, test smartphone local-file execution, then begin Hero Tree Prototype 02 on the split-source architecture.

## Current Run — Hero Tree Prototype 02 OLD OAK

A research-first tree rewrite was implemented on the new split-source build architecture.

Research:
- Weber & Penn tree model
- Three.js r186 TreeGenerator
- SeedThree White Oak preset and foliage implementation

Implementation:
- species-style OLD OAK preset
- spherical crown branch-length profile
- heavy flare / surface roots
- low broad scaffold branches
- strong secondary gnarl
- golden-angle branch distribution
- phototropic branch tips
- procedural lobed oak leaves
- twig-base anchored leaf cards
- single InstancedMesh foliage draw path
- expanded renderer performance HUD

CI:
- run `35955885981`
- PASS

Next:
Human real-device visual review of the Prototype 02 artifact.

## Current Run — OLD OAK TREE LAB

The project now has a dedicated isolated tree tuning scene.

Reason:
the environment has improved enough that remaining tree defects should be judged without water, mountains, fog, or composition masking them.

Research-driven changes:
- low-cost branch collar/bulge at branch bases
- leaf-card geometry trimmed toward the oak-leaf silhouette

TREE LAB exposes morphology parameters and fixed review views while using the same production OLD OAK source.

CI:
- run `35958048878`
- main world PASS
- TREE LAB PASS

Next:
Human parameter tuning in `tree-lab-old-oak.html`.

## Current Run — TREE LAB UI v2

TREE LAB was redesigned around an Inspector/viewport model after reviewing Apple HIG, Blender Sidebar behavior, and Tweakpane tuning patterns.

Implemented:
- viewport-first floating Inspector
- collapse to persistent restore affordance
- responsive mobile bottom sheet
- accordion parameter groups
- segmented camera views
- separate display toggles
- preset Reset / Random / Save / Load / Copy JSON
- automatic localStorage state
- keyboard shortcuts
- compact performance disclosure
- full-UI hide with restore button

CI:
- initial false failure was caused only by the old verifier title marker
- verifier updated
- final run `35960630079`: PASS

Next:
Human review of the new Inspector while actively tuning the OLD OAK.

## Current Run — Bedford Oak Photo Match

The tuning process moved from generic old-oak aesthetics to a specific real-tree target.

Primary reference:
Bedford Oak, Bedford NY.

TREE LAB additions:
- Bedford Oak morphology candidate
- real photograph link
- explicit real-tree measurement facts
- normalized target/model ratio display
- front + silhouette comparison shortcut

The candidate parameters remain experimental and are not treated as survey/photogrammetry output.

CI:
- run `36010044269`
- PASS

Next:
Human comparison against the real Bedford Oak photograph and iterative parameter tuning.

## Current Run — Foliage Volume Tuning

Human review judged the Bedford/Oak trunk and branch skeleton substantially improved, while foliage remained too sparse and winter-like.

The next pass therefore keeps the skeleton and makes canopy volume independently tunable.

Implemented:
- canopy density
- inner fill
- clump span
- dead branch fraction
- lower crown fill
- coherent sky gaps
- summer/winter/dense foliage presets
- independent WOOD display toggle
- leaf-group metrics

CI:
- run `36020030281`
- PASS

Next:
Human A/B review of SUMMER and DENSE canopy settings against the Bedford Oak photo reference.
