# ONE-PAGE THREE.JS REALISTIC WORLD

Repository: `ssnshino/onePageTreePJ`

Three.js / WebGL を使い、**一枚HTMLで実写に近いヴァーチャル3D空間をどこまで構築できるか**を研究するプロジェクト。

## TREE LAB 実験版の公開・再開入口

2026-10-10 JST。TREE LAB CROWN FILL実験版は[大飯店で公開済み](https://shinomiya-daihanten.wos.ktsys.jp/works/lab/programs/tree-lab-old-oak.html)。一覧未掲載の公開URLで、認証はありません。mainの安定baselineと、未mergeの[実験PR #12](https://github.com/ssnshino/onePageTreePJ/pull/12)は維持します。

公開元は固定commit `17cd7dbfda7c776c03940c74fb98e5a9c1c7aa0c`。[CI run 36113107753](https://github.com/ssnshino/onePageTreePJ/actions/runs/36113107753)の成功artifact `one-page-html`（ID `10853843237`）に含まれる `tree-lab-old-oak.html` をそのまま配布しました。

配布先は `ssnshino/shinomiya-daihanten-content` の `works/lab/programs/tree-lab-old-oak.html`。[content PR #27](https://github.com/ssnshino/shinomiya-daihanten-content/pull/27)をmergeし、[Deploy BASE content 38048526057](https://github.com/ssnshino/shinomiya-daihanten-content/actions/runs/38048526057)が成功。反映commitは `6e527a650ae29c3b9ef87d679ccca0e70fa46486` です。

公開HTTP 200と元HTMLとのSHA-256一致を確認済み。1回成長・3回成長・リセットは本人確認済みです。クラウドブラウザのWebGLは無効で、エージェントによる描画・操作の合格とはしていません。

再開時は固定sourceとPR #12、最新content PR／master／Actionsを確認してください。改修はsource側、配布は検証済みHTMLのcontent PR経由、承認済みmaster merge後は既存自動deployと公開内容を照合します。通常のBASE直接編集は不要です。

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
