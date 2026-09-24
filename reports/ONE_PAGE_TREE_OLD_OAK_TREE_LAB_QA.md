# OLD OAK TREE LAB — QA

Created: 2026-09-24T14:01:00+09:00

## Build
GitHub Actions run `35958048878`.

| Check | Result |
|---|---|
| main world build | PASS |
| TREE LAB build | PASS |
| main world verify | PASS |
| TREE LAB verify | PASS |
| Three.js r186 bundled | PASS |
| runtime CDN import absent | PASS |
| module/importmap absent in dist | PASS |
| direct one-page artifact generated | PASS |

## Shared-code guarantee

TREE LAB directly bundles the same:
- OLD OAK spec
- OLD OAK skeleton
- OLD OAK foliage

used by the main scene.

## Initial tuning changes

### Branch collar
- short branch-base radius swell
- parameterized
- intended only as an interim low-cost junction improvement

### Leaf mesh trim
- reduced transparent card area
- more closely follows the procedural oak leaf envelope
- retains alpha-tested lobed silhouette

## Human visual QA required

Automatic QA cannot judge:
- whether junction collar actually removes the pipe look
- whether trimmed leaf mesh improves foliage
- whether the best seed is biologically/plausibly shaped
- whether crown density is convincing

TREE LAB exists specifically to make those Human decisions fast.
