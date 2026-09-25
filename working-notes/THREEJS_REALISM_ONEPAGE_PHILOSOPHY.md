# Three.js 写実表現と「一枚ペラ」の上限について

Created: 2026-09-25

## このメモのきっかけ

外部で見かけた Three.js / WebGL 系の自然景観・都市シミュレータ作例を見て、
「ブラウザだからこの程度でよい」という心理的な上限を外してよい、という認識に至った。

重要なのは個々の作例そのものを競うことではなく、

> Three.js でも、画面上に映し出すものなら、
> 設計・素材・光・大気・カメラ・LOD・演出をやり込むことで
> 「実写か？」と一瞬迷うレベルまで狙える。

という可能性が、実例によって十分に示されていること。

このプロジェクトでは、この認識を今後の品質基準として採用する。

---

## 1. 「Three.jsにしては綺麗」を目標にしない

目標は、

> ブラウザデモとしてすごい

ではなく、

> 普通の3Dアプリとして見てもすごい。
> それが実はHTML一枚だった。

とする。

最終的な理想は、

> 「これ実写？ ……え、HTML？」

という反応を引き出せる映像品質。

Three.js / WebGL は目的ではなく手段。
ブラウザだからといって視覚品質の目標を下げない。

---

## 2. 一枚HTMLは「開発形式」ではなく「配布形式」

すでに source split / build system で確立した方針を再確認する。

```
src/
  terrain/
  vegetation/
  water/
  atmosphere/
  lighting/
  shaders/
  camera/
  simulation/
  ui/
  ...

        ↓ build

dist/
  world.html
```

開発時は普通の3Dプロジェクトとして分割・研究・検証する。

最終的に一枚へbundleできればよい。

したがって、
コードが2万行、5万行、10万行になっても、
最終出力が一枚HTMLなら「一枚ペラ」である。

---

## 3. 実写感を決めるのはポリゴン数だけではない

写実感を大きく左右する要素：

- ライティング
- PBR材質
- 法線
- 影
- 反射
- 半透明・透過
- 大気遠近
- 霧
- 空
- 水
- カメラ位置
- カメラ移動
- 被写界深度的な見せ方
- スケール感
- 色調
- 前景 / 中景 / 遠景の構成
- 視差
- 動き
- 画面全体の統一感

個々のモデルが完全でなくても、
これらが同じ世界のルールで揃うことで、
人間の脳は「現実の景色」として補完する。

---

## 4. 自然景観は多層LODで作る

一本の木をすべて同じ品質で描く必要はない。

### Hero Tree
カメラ近傍・主役。

- 実枝形状
- 樹皮
- root flare
- branch junction
- 個別葉
- 育成履歴
- Space Colonization
- 近接観察可能

### Mid Tree
中距離。

- 軽量枝
- leaf cluster
- simplified bark
- Instancing
- 中距離専用LOD

### Forest Mass
遠景。

- branch cards
- impostor
- forest canopy mass
- silhouette priority
- atmosphere-integrated shading

### Ultra Far
超遠景。

- forest texture
- terrain shading
- haze / aerial perspective

人間の目にはすべて「森」として見える。
GPUだけが内部表現の違いを知っている状態を目指す。

---

## 5. 計算資源を「資産」として管理する

自由に歩ける写実世界では、
品質そのものよりも
「どこへ計算資源を使うか」が重要になる。

主な資源管理対象：

- triangle budget
- draw calls
- shadow maps
- reflection resolution
- texture memory
- DPR
- post effects
- foliage overdraw
- animation / wind
- simulation steps
- culling
- LOD transition

近景へ資源を集中し、
見えない場所・遠景は大胆に軽量化する。

「全部を高品質にする」のではなく、
「人間が見ているところを高品質にする」。

---

## 6. Hero Tree研究と景観設計は別レイヤ

現在の OLD OAK / TREE LAB 研究は、
一本の木を徹底的に詰めるためのもの。

一方、景観全体では別の技術が必要。

- 森の境界
- 木の高さのムラ
- 樹種混在
- 季節差
- 色の塊
- ランドマーク樹
- 地形との接続
- 水際植生
- 草・葦・花
- 遠景森林
- 大気
- カメラ演出

一本のHero Treeを完成させた後、
その知見をMid Tree / Forest Massへ落とし込む。

---

## 7. 「森を配置する」から「森が育つ」へ

TREE LABは当初、
木の3Dモデル調整ツールだった。

しかし現在は、

- 枝構造
- 葉量
- crown volume
- azimuth coverage
- attraction points
- Space Colonization
- corrective growth pass

まで進み、

> 木を生成する

から

> 木を育てる

へ変わりつつある。

将来的には、

```
地形
  ↓
日照
  ↓
水分
  ↓
風
  ↓
隣接樹との競争
  ↓
空いている樹冠空間
  ↓
枝の成長
  ↓
葉の展開
  ↓
落葉 / 枯死 / 再成長
  ↓
森林形成
```

まで発展可能。

つまり TREE LAB は、

> 3D Tree Generator

ではなく、

> Tree Growth Simulator / 樹木育成シミュレータ

へ進化する可能性がある。

---

## 8. 人間とAIの開発ループ

AIの価値は「一発で大量コードを書くこと」だけではない。

このプロジェクトで重要なのは、

```
検索・研究
    ↓
仮説
    ↓
実装
    ↓
専用LAB
    ↓
Human実機観察
    ↓
問題発見
    ↓
再調査
    ↓
次の仮説
```

というループ。

実際、

```
Generic tree
  ↓
OLD OAK
  ↓
Bedford Oak reference
  ↓
foliage volume
  ↓
片側が「スンッ」
  ↓
azimuth coverage
  ↓
Space Colonization
  ↓
CROWN FILL PASS
```

という形で品質が上がっている。

AIが速くなるほど、
研究・評価・Git履歴・CI・Human QAの価値はむしろ大きくなる。

---

## 9. 今後の品質標語

### 「一番品質の低い可視要素が、画面全体の品質上限を決める」

既存方針。

そして追加：

### 「Three.jsだから、を言い訳にしない」

### 「一枚ペラは配布形式。中身は本気の3Dプロジェクト」

### 「ポリゴン数ではなく、画面全体で現実を作る」

### 「森を置くのではなく、最終的には森を育てる」

---

## 10. 最終目標

ONE-PAGE VECTOR WORLD / Three.js自然世界の最終目標は、

> ブラウザで動くこと自体を意識させない品質

とする。

ユーザーがまず景色として受け取り、
後から

> 「これ、HTML一枚なの？」

と気づく順番が理想。

Three.jsであることは制約ではなく、
どこまで詰められるかを研究する舞台とする。
