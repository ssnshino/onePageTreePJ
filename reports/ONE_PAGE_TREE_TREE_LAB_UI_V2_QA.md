# TREE LAB UI v2 — QA

Created: 2026-09-24T14:36:00+09:00

## Candidate
`dist/tree-lab-old-oak.html`

## CI
GitHub Actions run:
`35960630079`

Conclusion:
**SUCCESS**

| Check | Result |
|---|---|
| main one-page build | PASS |
| main one-page verify | PASS |
| TREE LAB build | PASS |
| TREE LAB verify | PASS |
| artifact upload | PASS |
| classic bundled script syntax | PASS |
| runtime CDN dependency absent | PASS |
| import map/module runtime absent | PASS |
| Inspector restore affordance present | PASS |
| disclosure structure present | PASS |
| preset tools present | PASS |

## UI Feature QA

Static/source verified:
- floating desktop Inspector
- collapse / restore controls
- mobile bottom-sheet CSS
- native details/summary sections
- segmented view control state
- display aria-pressed state
- localStorage persistence
- preset Save / Load / Copy JSON
- keyboard shortcuts
- UI full-hide wake button
- compact performance disclosure

## Known non-automated checks

Human browser review remains required for:
- panel visual hierarchy
- mobile sheet feel
- scroll behavior
- touch slider comfort
- whether the tree stays visually dominant
