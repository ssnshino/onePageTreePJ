# AGENTS.md
# ONE-PAGE THREE.JS REALISTIC WORLD — AI DEVELOPMENT RULES

このファイルは ChatGPT / Codex / その他のAI開発者向け共通ルール。

## 1. 開始時に必ず読む
1. `README.md`
2. `snapshot/CURRENT_SNAPSHOT.md`
3. `snapshot/LAST_RUN.md`
4. `snapshot/NEXT_CHAT_PROMPT.txt`
5. `plan/head/` の最新PLAN
6. `docs/head/` の最新SPEC
7. 必要に応じて `working-logs/head/` / `code/head/`

通常の開始時に `history/` 全体を走査しない。

## 2. Current Baseline
snapshotで指定されたCurrent HTMLを正本として扱う。
現行baselineは `threejs_onepage_waterworld_v0.5_trees_rocks.html`。

## 3. No Regression
既に及第点となった要素を、別要素の研究のために無断で劣化させない。

維持対象:
- Water planar reflection
- Sky / PMREM / ACES tone mapping
- Lakebed / shallow water
- Mountain / fog composition
- OrbitControls
- PC / smartphone responsive execution

現在の最優先改善対象:
- Trees
- Rocks
- Natural asset quality

## 4. PLAN FIRST
積み上がる改修では実装前に `plan/head/` へPLANを作成する。

最低限:
- 目的
- 変更対象
- 非対象
- Regression
- QA
- 成功条件

## 5. DEVELOPMENT FLOW
`PLAN → IMPLEMENT → TEST → WORKLOG → SPEC → SNAPSHOT`

## 6. VISUAL QUALITY POLICY
技術の高度さではなく、実画面の説得力を優先する。

禁止:
- 「Three.jsだからこの程度」で妥協
- 「一枚HTMLだから簡素でよい」で妥協
- 円錐=木、球=樹冠、丸い多面体=岩のような記号表現を完成扱い
- FPSを無視した密度増加
- 画面を確認せず「理論上よくなった」で終了

原則:
- 一番偽物に見える要素から直す
- 実機録画・スクリーンショットを最終評価へ使う
- Human visual verdictを重視する

## 7. PERFORMANCE POLICY
PC高品質とスマホ軽量化を両立する。

優先:
- InstancedMesh
- merged geometry
- LOD
- frustum / distance culling
- reflection resolution switching
- devicePixelRatio制限
- procedural geometry cache

## 8. ASSET POLICY
まず procedural / generated asset の限界を検証する。
ただし目的は純proceduralコンテストではない。

写実化に明確な利点がある場合:
- PBR texture
- glTF
- HDRI
- external runtime asset

の採用を検討してよい。

重い動画・高解像度QA画像を通常のGit履歴へ入れない。

## 9. VERSIONING
Current HTMLを直接破壊せず、新versionを作る。

例:
`threejs_onepage_waterworld_v0.6_natural_asset_quality.html`

過去試作は `samples/` に保持する。

## 10. GITHUB / PR WORKFLOW
`main` はHuman Review済みの安定正本。
AI Agentは原則mainへ直接pushしない。

推奨prefix:
- `feature/`
- `fix/`
- `chore/`
- `research/`
- `refactor/`

原則 **1 PR = 1 logical commit**。
最終mergeはHuman authority。明示依頼がない限りAIはmergeしない。

## 11. DOCUMENT TIMESTAMP
新規PLAN / WORKLOG / SPEC / QAにはISO 8601 JST timestampを付ける。
固定正本文書は末尾Update Historyへappendする。

## 12. HUMAN AUTHORITY
実機の見た目・操作感・FPSはユーザーの評価を最終正本とする。

## Update History
- 2026-09-24T09:39:00+09:00 — ChatGPT — Initial AI development rules created from vectorRally repository policy and Three.js research requirements.
