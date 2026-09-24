# TREE LAB UI v2 — WORKLOG

Updated: 2026-09-24T14:36:00+09:00

## Branch / PR
- Branch: `feature/tree-lab-ui-v2`
- Base: `feature/tree-lab-old-oak-tuning`
- Draft PR: `#7`

## Goal

The 3D tree is the subject. Controls must be easy to reach without permanently consuming the viewport.

## Research translated into implementation

### Apple HIG
- Inspector-like supplementary controls remain subordinate to the content.
- Sliders are appropriate for direct adjustment.
- Closely related view choices are grouped in a segmented control.
- Hidden panes should have clear ways to return, including shortcuts.

Applied:
- floating desktop Inspector
- edge restore tab
- grouped view selector
- keyboard toggle
- restrained translucent hierarchy

### Blender
The 3D Viewport Sidebar is hideable, keyboard-toggleable, and hidden regions retain a restore affordance.

Applied:
- `I` toggles Inspector
- collapsed Inspector leaves an OAK restore tab

### Tweakpane
Folder/disclosure grouping and state import/export patterns are standard for tuning tools.

Applied:
- disclosure sections
- persisted UI/value state
- Save / Load preset
- Copy JSON

## Desktop UI

- Inspector width approximately 360px
- independent scrolling
- collapse to left edge tab
- Tree / Branches initially open
- Foliage / Roots & Joints / Advanced progressively disclosed
- performance HUD collapsed by default

## Mobile UI

- Inspector changes to bottom sheet
- max height about 78dvh
- safe-area aware
- dedicated drag handle
- swipe down on handle closes
- collapsed state leaves bottom OAK pill
- primary action targets at least 44px

## Interaction

View:
- 3/4
- Front
- Side
- Top

Display:
- Silhouette
- Wireframe
- Leaves
- Roots

Preset:
- Reset
- Random
- Save
- Load
- Copy JSON

Shortcuts:
- I Inspector
- H UI
- 1–4 View
- W Wireframe
- S Silhouette

## Persistence

localStorage stores:
- current tuning values
- Inspector collapse
- disclosure sections
- fixed view
- performance panel state

One explicit user preset slot is stored separately.

## CI

First CI generated both HTML files successfully, but the legacy TREE LAB verifier searched for the previous exact title markup and reported a false failure.

Verifier was updated for UI v2 structure.

Final validation run:
- `35960630079`
- main world build/verify: PASS
- TREE LAB build/verify: PASS
- artifact upload: PASS

TREE LAB output:
approximately **585.7 KiB**

## Human Gate

The next review is interaction/visibility based:
- Is the Inspector sufficiently unobtrusive?
- Does collapsing restore useful viewport area?
- Is the mobile bottom sheet practical?
- Are accordion groups sensible while tuning?
