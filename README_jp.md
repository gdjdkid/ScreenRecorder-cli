# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | 日本語 | [한국어](README_kr.md) | [Deutsch](./README_de.md) | [Français](./README_fr.md) | [Español](./README_es.md)

> ffmpeg を使ったクロスプラットフォーム CLI スクリーンレコーダー —— コマンド一つで画面録画を開始。

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## 機能

- 🎥 **画面 + 音声録画** —— デスクトップ映像・システム音声・マイクを同時キャプチャしてミックス
- 📁 **柔軟な出力パス** —— デフォルト出力ディレクトリを永続保存、または毎回一時指定も可能
- 🔍 **ffmpeg 自動検出** —— インストール時・実行時に ffmpeg の有無を確認し、不足時は案内を表示
- 🖥️ **クロスプラットフォーム** —— Windows (gdigrab)・macOS (avfoundation)・Linux (x11grab)
- ⚡ **シンプルなコマンド** —— 開始・停止・設定をワンコマンドで
- 🎛️ **カスタマイズ可能** —— フレームレート・音声オン/オフ・出力先を設定可能

---

## 必要環境

- Node.js >= 18.0.0
- npm >= 6.0.0
- **ffmpeg**（別途インストールし、PATH に追加する必要があります）

### ffmpeg のインストール

| プラットフォーム | コマンド |
|---|---|
| Windows | `winget install ffmpeg` または [ffmpeg.org](https://ffmpeg.org/download.html) からダウンロード |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

> **Windows のシステム音声について：** システム音声を録音するには [VB-Audio Virtual Cable](https://vb-audio.com/Cable/) を先にインストールしてください。

---

## インストール

**方法 1：npm でインストール（推奨）**
```bash
npm install -g screenrecorder-cli
```

**方法 2：GitHub からクローン（開発者向け）**
```bash
git clone https://github.com/gdjdkid/ScreenRecorder-cli.git
cd ScreenRecorder-cli
npm install
npm install -g .
```

**インストール確認：**
```bash
screenrec -v
```

---

## 使い方

**録画開始（保存済みまたはデフォルトの出力先を使用）：**
```bash
screenrec start
```

**特定フォルダへ録画：**
```bash
screenrec start -o /Users/yourname/Movies
```

**音声なしで録画：**
```bash
screenrec start --no-audio
```

**デフォルト出力ディレクトリを永続設定：**
```bash
screenrec set-output /Users/yourname/Movies
# または対話形式：
screenrec set-output
```

**現在の設定を表示：**
```bash
screenrec show-config
```

**音声デバイス一覧（Windows のみ）：**
```bash
screenrec devices
```

**録画停止：** `Ctrl+C` を押すとファイルが自動保存されます。

---

## コマンド一覧

```
使い方：screenrec [コマンド] [オプション]

コマンド：
  start          録画開始（デフォルト）
  set-output     デフォルト出力ディレクトリを設定
  show-config    現在の設定を表示
  devices        利用可能な音声入力デバイスを一覧表示

start のオプション：
  -o, --output <パス>    出力ディレクトリ（保存済み設定を一時的に上書き）
  -r, --framerate <fps>  フレームレート（デフォルト：30）
  --no-audio             音声録音を無効化
  --mic <名前>           マイクデバイス名（Windows）
  --system <名前>        システム音声デバイス名（Windows）
  -v, --version          バージョンを表示
  -h, --help             ヘルプを表示
```

---

## 出力パスの優先順位

```
-o オプション（今回のみ有効）
  ↓ 未指定
保存済み設定（screenrec set-output）
  ↓ 未設定
デフォルト：~/Videos/ScreenRecords
```

---

## プラットフォーム対応

| プラットフォーム | 映像キャプチャ | システム音声 | マイク |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow（VB-Audio 必要） | ✅ dshow |
| macOS | ✅ avfoundation | ✅ 内蔵 | ✅ 内蔵 |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## ライセンス

このプロジェクトは [MIT License](./LICENSE) のもとでオープンソース公開されています。

---

## コントリビューション

PR・Issue 大歓迎です！

1. このリポジトリをフォーク
2. ブランチを作成：`git checkout -b feat/your-feature`
3. 変更をコミット：`git commit -m "feat: 変更内容を記述"`
4. ブランチをプッシュ：`git push origin feat/your-feature`
5. Pull Request を作成

---

## 更新履歴

- **v1.0.0** —— 初回リリース
