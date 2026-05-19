# 🎹 JEN SX-1000 Virtual Synthesizer

**ブラウザで動くアナログシンセサイザー — 1978年イタリアの名機を Web Audio API で再現**

> Jen SX-1000 は、1978年にイタリアの Jen Elettronica 社が開発したモノフォニック・アナログシンセサイザーです。
> シンプルながら太く暖かいサウンドで知られ、ニューウェーブ〜シンセポップ期に多くのミュージシャンに愛用されました。
> 本アプリはその回路構成を Web Audio API でエミュレートし、PC・スマートフォンのブラウザ上でリアルタイムに演奏できます。

🔗 **Live Demo:** [https://moriya16g.github.io/synth-sx1000-web/](https://moriya16g.github.io/synth-sx1000-web/)

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

### プリセット

ヘッダーの **PRESETS ▾** ボタンから 36 種類のプリセットを選択できます。
カテゴリでフィルタリングして素早くアクセスでき、選択するとすべてのノブが即座に更新されます。

| カテゴリ | プリセット |
|---------|----------|
| **BASS** (6) | Fat Bass, Sub Bass, Acid Bass, Pluck Bass, Funky Bass, Round Bass |
| **LEAD** (5) | Classic Lead, Screaming Lead, Square Lead, Portamento Lead, Nasal Lead |
| **PAD** (5) | Warm Pad, Square Pad, Dark Pad, Shimmer Pad, PWM Pad |
| **KEY** (4) | Electric Piano, Clav, Harpsichord, Organ |
| **BRASS** (4) | Synth Brass, Trumpet, Muted Brass, French Horn |
| **STRING** (4) | Synth Strings, Cello, Violin, Pizzicato |
| **SFX** (7) | Laser, Siren, Wah, Alien, Wind, Zap, Resonance Sweep, Bubbles |

プリセットを選択した後、各ノブを調整して音色をカスタマイズすることもできます。

---

## 特徴

- ⚡ **ゼロ依存オーディオ** — 外部オーディオライブラリ不使用、ブラウザ標準 Web Audio API のみ
- � **アナログモデリング** — ソフトサチュレーション、指数エンベロープ、VCO ピッチドリフトで実機の質感を再現- 🎨 **36種類のプリセット** — Bass / Lead / Pad / Key / Brass / String / SFX の8カテゴリから即座に音色を呼び出し- �📱 **PWA 対応** — ホーム画面に追加でネイティブアプリ風に使用可能、オフラインでも動作
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
OscillatorNode (VCO) ← Drift LFO (±6 cents, アナログ不安定性)
  → GainNode (Level)
    → WaveShaperNode (tanh ソフトサチュレーション)
      → BiquadFilterNode #1 (12dB/oct)
        → WaveShaperNode (段間サチュレーション)
          → BiquadFilterNode #2 (12dB/oct)  ← 合計 24dB/oct
            → GainNode (VCA / 指数 ADSR)
              → GainNode (Master Volume)
                → AudioContext.destination

OscillatorNode (LFO) → VCO.detune または VCF.frequency
```

### アナログモデリング

| 技術 | 実装 | 効果 |
|------|------|------|
| **ソフトサチュレーション** | VCO 出力とフィルター段間に `WaveShaperNode`（`tanh` カーブ、4x オーバーサンプリング） | 波形の角が丸まり、アナログ的な倍音の太さを再現 |
| **指数エンベロープ** | `setTargetAtTime`（τ = duration/3）による RC 充放電カーブ | アナログ回路のコンデンサ充放電に近い自然な立ち上がり/減衰 |
| **VCO ピッチドリフト** | 低速 LFO で ±6 セントのランダムデチューン | アナログ VCO の温度ドリフトによる微妙な揺らぎ |
| **フィルターサチュレーション** | Filter1 → Filter2 間に `WaveShaperNode` | トランジスタラダーフィルターの段間飽和をシミュレート |

### 基本設計

- **24dB/oct フィルター**: 2 段カスケード BiquadFilter (各 12dB/oct) で実現
- **LFO**: 独立した OscillatorNode から VCO の detune または VCF の frequency パラメータへ接続
- **iOS Safari 対応**: ユーザージェスチャー時に AudioContext を遅延初期化

---

## セットアップ

### 必要環境

- Node.js 20 以上
- npm

### ローカル開発

```bash
git clone https://github.com/moriya16g/synth-sx1000-web.git
cd synth-sx1000-web
npm install
npm run dev
```

開発サーバーが起動します → http://localhost:5173/synth-sx1000-web/

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

デプロイ完了後、`https://moriya16g.github.io/synth-sx1000-web/` でアクセスできます。

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
