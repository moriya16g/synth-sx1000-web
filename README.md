# 🎹 JEN SX-1000 Virtual Synthesizer

**ブラウザで動くアナログシンセサイザー — 1978年イタリアの名機を Web Audio API で再現**

> Jen SX-1000 は、1978年にイタリアの Jen Elettronica 社が開発したモノフォニック・アナログシンセサイザーです。
> シンプルながら太く暖かいサウンドで知られ、ニューウェーブ〜シンセポップ期に多くのミュージシャンに愛用されました。
> 本アプリはその回路構成を Web Audio API でエミュレートし、PC・スマートフォンのブラウザ上でリアルタイムに演奏できます。

<!-- デモURLはデプロイ後に更新してください -->
<!-- 🔗 **Live Demo:** [https://username.github.io/jen-sx1000-pwa/](https://username.github.io/jen-sx1000-pwa/) -->

---

## アプリの使い方

### 画面構成

画面は上部の **コントロールパネル** と下部の **キーボード** で構成されています。
コントロールパネルは横スクロールで全セクションにアクセスできます。

### 演奏方法

- **PC**: キーボード下部の鍵盤をマウスでクリック
- **スマートフォン / タブレット**: 鍵盤をタッチ
- モノフォニック（単音）仕様 — 同時に1音のみ発音します

### 各セクションの解説

#### 🔴 VCO (Voltage Controlled Oscillator)

音の波形と基本ピッチを決定します。

| パラメータ | 説明 |
|-----------|------|
| **Wave** | 波形選択 — SAW (ノコギリ波) / SQR (矩形波) |
| **Octave** | オクターブ — 32' / 16' / 8' / 4' (数字が小さいほど高い音) |
| **Tune** | 微調整 (±1オクターブ) |
| **P.W.** | パルス幅 — 矩形波の倍音構成を変化させます |
| **PWM** | パルス幅変調の深さ (LFO による自動変調) |
| **Level** | VCO の出力レベル |

#### 🟡 VCF (Voltage Controlled Filter)

音の明るさ (倍音) を制御するローパスフィルターです。

| パラメータ | 説明 |
|-----------|------|
| **Cutoff** | カットオフ周波数 — 低いほど暗く、高いほど明るい音 |
| **Reso** | レゾナンス — カットオフ付近を強調。最大で自己発振します |
| **Env** | エンベロープ量 — ADSR でカットオフを時間変化させる深さ |
| **A / D / S / R** | フィルター用 ADSR エンベロープ |

#### 🟢 VCA (Voltage Controlled Amplifier)

音量の時間変化を制御します。

| パラメータ | 説明 |
|-----------|------|
| **Volume** | 全体の音量 |
| **A** | Attack — 音の立ち上がり時間 |
| **D** | Decay — アタック後の減衰時間 |
| **S** | Sustain — 鍵盤を押している間の持続レベル |
| **R** | Release — 鍵盤を離した後の余韻 |

#### 🟡 LFO (Low Frequency Oscillator)

周期的な揺れ (ビブラート、ワウ効果) を加えます。

| パラメータ | 説明 |
|-----------|------|
| **Wave** | LFO 波形 — SIN / TRI / SQR / SAW |
| **Dest** | 変調先 — VCO (ピッチ) / VCF (カットオフ) |
| **Speed** | 変調の速さ |
| **Amount** | 変調の深さ |

### おすすめの音作り

| サウンド | 設定のヒント |
|---------|-------------|
| **太いベース** | SAW波、Octave 16'、Cutoff 低め、Reso やや上げ、VCA の A=0 D=短 S=0.7 R=短 |
| **ブラス風リード** | SAW波、Octave 8'、VCF Env 高め、Filter A=短 D=中 S=0.3、VCA A=短 |
| **シンセパッド** | SQR波、P.W. 中央付近、VCA A=長 D=長 S=0.8 R=長、LFO→VCO で軽いビブラート |
| **レーザー効果音** | Reso 最大 (自己発振)、Cutoff を手動で素早く動かす |
| **ワウ効果** | LFO→VCF、Speed 中程度、Amount 大きめ |

---

## 特徴

- ⚡ **ゼロ依存オーディオ** — 外部オーディオライブラリ不使用、ブラウザ標準 Web Audio API のみ
- 📱 **PWA 対応** — ホーム画面に追加でネイティブアプリ風に使用可能、オフラインでも動作
- 🎛️ **リアルなノブ操作** — ドラッグ操作でスムーズに値を変更
- 🔊 **24dB/oct フィルター** — 実機同様の急峻なフィルターカーブを再現
- 📐 **レスポンシブ** — デスクトップ / タブレット / スマートフォンに対応

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | React 19 + TypeScript |
| ビルドツール | Vite 8 |
| オーディオ | Web Audio API (ネイティブ) |
| PWA | vite-plugin-pwa + Workbox |
| デプロイ | GitHub Pages + GitHub Actions |

## 回路エミュレーションの実装

本アプリは Jen SX-1000 のアナログ回路構成を Web Audio API のノードグラフで再現しています。

```
OscillatorNode (VCO)
  → GainNode (Level)
    → BiquadFilterNode × 2 (VCF: 12dB/oct × 2 = 24dB/oct)
      → GainNode (VCA / ADSR)
        → GainNode (Master Volume)
          → AudioContext.destination
          
OscillatorNode (LFO) → VCO.detune または VCF.frequency
```

- **24dB/oct フィルター**: 2 段カスケード BiquadFilter (各 12dB/oct) で実現
- **ADSR エンベロープ**: `linearRampToValueAtTime` によるリアルタイム制御
- **LFO**: 独立した OscillatorNode から VCO の detune または VCF の frequency パラメータへ接続
- **iOS Safari 対応**: ユーザージェスチャー時に AudioContext を遅延初期化

---

## セットアップ

### 必要環境

- Node.js 20 以上
- npm

### ローカル開発

```bash
git clone https://github.com/<username>/jen-sx1000-pwa.git
cd jen-sx1000-pwa
npm install
npm run dev
```

開発サーバーが起動します → http://localhost:5173/jen-sx1000-pwa/

### ビルド

```bash
npm run build    # dist/ に本番ビルドを出力
npm run preview  # ビルド結果をローカルでプレビュー
```

---

## GitHub Pages へのデプロイ

本リポジトリには GitHub Actions ワークフローが含まれており、`main` ブランチへのプッシュで自動デプロイされます。

1. GitHub リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定
2. `main` ブランチにプッシュ
3. Actions タブでデプロイの進行状況を確認

デプロイ完了後、`https://<username>.github.io/jen-sx1000-pwa/` でアクセスできます。

---

## ブラウザ対応

| ブラウザ | 対応状況 |
|---------|---------|
| Chrome / Edge | ✅ 推奨 |
| Firefox | ✅ |
| Safari (macOS / iOS) | ✅ (AudioContext の自動再開に対応済み) |

---

## ライセンス

MIT

---

## 参考

- [Jen SX-1000 — Vintage Synth Explorer](https://www.vintagesynth.com/jen/sx1000.php)
- [Web Audio API — MDN](https://developer.mozilla.org/docs/Web/API/Web_Audio_API)
