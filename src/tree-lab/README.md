# OLD OAK TREE LAB

Focused tuning scene for the exact OLD OAK generator used by the main one-page world.

## Inspector UI v2

Desktop:
- floating Inspector
- collapse to edge tab
- keyboard shortcut `I`

Mobile:
- bottom-sheet Inspector
- collapsed bottom pill
- drag the sheet handle downward to close

Shared:
- accordion sections
- segmented camera views
- display toggles
- localStorage UI/value persistence
- saved preset slot
- JSON copy
- `H` toggles almost all UI
- performance HUD is progressively disclosed

Keyboard:
- `I` Inspector
- `H` UI
- `1` 3/4
- `2` Front
- `3` Side
- `4` Top
- `W` Wireframe
- `S` Silhouette

Build:

```bash
npm install
npm run build:tree-lab
npm run verify:tree-lab
```

Output:
`dist/tree-lab-old-oak.html`
