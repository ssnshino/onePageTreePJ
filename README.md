# ONE-PAGE THREE.JS REALISTIC WORLD

Repository: `ssnshino/onePageTreePJ`

Three.js / WebGL を使い、**一枚HTMLで実写に近いヴァーチャル3D空間をどこまで構築できるか**を研究するプロジェクト。

## CURRENT BASELINE

- Version: `v0.5 TREES & ROCKS`
- Current HTML: `threejs_onepage_waterworld_v0.5_trees_rocks.html`
- Default branch: `main`
- Runtime: Browser / Three.js r186 CDN modules
- Current focus: Tree / Rock asset quality

現行実装・QA・引き継ぎ状態は `snapshot/` を正本として確認する。

## START HERE

1. `README.md`
2. `AGENTS.md`
3. `snapshot/CURRENT_SNAPSHOT.md`
4. `snapshot/LAST_RUN.md`
5. `snapshot/NEXT_CHAT_PROMPT.txt`
6. `plan/head/`
7. `docs/head/`
8. 必要に応じて `working-logs/head/` / `code/head/`
9. 過去試作は `samples/`

## DEVELOPMENT WORKFLOW

`PLAN → IMPLEMENT → TEST → WORKLOG → SPEC → SNAPSHOT`

## PROJECT PRINCIPLE

- 一枚HTMLの可搬性を維持する。
- Three.js / Shader / WebGL / WebGPUは必要に応じて研究対象とする。
- 「技術的に高度」ではなく、**実際の画面が自然に見えるか**を最終基準とする。
- 一番品質の低い要素が画面全体の品質上限を決める。
- 水だけリアルでもダメ。木一本、岩一個まで世界の一部にする。
- PC高品質とスマホ軽量化を両立する。
- 外部アセットは必要なら採用するが、まず procedural / generated asset の限界を検証する。

## VERSION HISTORY SO FAR

- `v0.1` — basic Three.js / shader water
- `v0.2` — real planar reflection + Sky + PMREM
- `v0.3` — clear lake / lakebed / shallow water
- `v0.4` — lakeshore / reeds / mixed trees
- `v0.5` — tree branch structure / procedural fractured rocks

過去HTMLは `samples/` に保存する。

## GIT WORKFLOW

`main` はHuman Review済みの安定正本。

通常は目的別branchを作成し、Pull Request経由でmainへ反映する。

- `feature/`
- `fix/`
- `research/`
- `refactor/`
- `chore/`

原則 **1 PR = 1 logical commit**。

## Update History

- 2026-09-24T09:39:00+09:00 — ChatGPT — Repository bootstrap README created for the Three.js realistic one-page research project.
