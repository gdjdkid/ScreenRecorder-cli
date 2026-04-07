# ScreenRecorder-cli 🎬

[English](./README.md) | 中文 | [日本語](README_jp.md) | [한국어](README_kr.md) | [Deutsch](./README_de.md) | [Français](./README_fr.md) | [Español](./README_es.md)

> 一个基于 ffmpeg 的跨平台命令行录屏工具 —— 一条命令即可开始录制屏幕。

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## 功能特性

- 🎥 **屏幕 + 音频录制** —— 同时捕获桌面画面、系统声音与麦克风，自动混音
- 📁 **灵活的输出路径** —— 可永久保存默认输出目录，也可每次临时指定
- 🔍 **ffmpeg 自动检测** —— 安装时和运行时均会检测 ffmpeg 是否存在，缺失时自动给出安装指引
- 🖥️ **跨平台支持** —— Windows (gdigrab)、macOS (avfoundation)、Linux (x11grab)
- ⚡ **命令简洁** —— 一条命令启动、停止、配置
- 🎛️ **可自定义** —— 帧率、音频开关、输出目录均可配置

---

## 环境要求

- Node.js >= 18.0.0
- npm >= 6.0.0
- **ffmpeg**（需单独安装并加入系统 PATH）

### 安装 ffmpeg

| 平台 | 命令 |
|---|---|
| Windows | `winget install ffmpeg` 或从 [ffmpeg.org](https://ffmpeg.org/download.html) 下载 |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

> **Windows 系统音频说明：** 若需录制系统声音，请先安装 [VB-Audio Virtual Cable](https://vb-audio.com/Cable/)。

---

## 安装

**方式一：通过 npm 安装（推荐）**
```bash
npm install -g screenrecorder-cli
```

**方式二：从 GitHub 克隆（开发者）**
```bash
git clone https://github.com/gdjdkid/ScreenRecorder-cli.git
cd ScreenRecorder-cli
npm install
npm install -g .
```

**验证安装：**
```bash
screenrec -v
```

---

## 使用方法

**开始录制（使用已保存或默认输出目录）：**
```bash
screenrec start
```

**录制到指定文件夹：**
```bash
screenrec start -o D:\我的录屏
```

**不录音频：**
```bash
screenrec start --no-audio
```

**永久设置默认输出目录：**
```bash
screenrec set-output D:\我的录屏
# 或进入交互式模式：
screenrec set-output
```

**查看当前配置：**
```bash
screenrec show-config
```

**列出音频设备（仅 Windows）：**
```bash
screenrec devices
```

**停止录制：** 按 `Ctrl+C`，文件自动保存。

---

## 命令说明

```
用法：screenrec [命令] [选项]

命令：
  start          开始录屏（默认命令）
  set-output     设置默认输出目录
  show-config    查看当前配置
  devices        列出可用音频输入设备

start 选项：
  -o, --output <路径>    输出目录（临时覆盖已保存的配置）
  -r, --framerate <fps>  帧率（默认：30）
  --no-audio             禁用音频录制
  --mic <名称>           麦克风设备名称（Windows）
  --system <名称>        系统音频设备名称（Windows）
  -v, --version          显示版本号
  -h, --help             显示帮助
```

---

## 输出路径优先级

```
-o 参数（本次有效）
  ↓ 未指定
已保存配置（screenrec set-output）
  ↓ 未配置
默认路径：~/Videos/ScreenRecords
```

---

## 平台支持

| 平台 | 视频捕获 | 系统音频 | 麦克风 |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow（需 VB-Audio） | ✅ dshow |
| macOS | ✅ avfoundation | ✅ 内置 | ✅ 内置 |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## 配置文件

配置保存于 `~/.config/screenrec/config.json`，跨会话持久有效。

```json
{
  "outputDir": "D:\\我的录屏"
}
```

---

## 常见问题

**Q：安装后提示 "ffmpeg not found"？**
A：ffmpeg 需单独安装，请参考上方「环境要求」部分。

**Q：Windows 下无法录制系统声音？**
A：请安装 [VB-Audio Virtual Cable](https://vb-audio.com/Cable/)，并将 `virtual-audio-capturer` 作为系统音频设备。

**Q：如何停止录制？**
A：按 `Ctrl+C`，输出文件自动保存。

**Q：输出文件在哪里？**
A：运行 `screenrec show-config` 可查看当前输出目录。

---

## 开源协议

本项目基于 [MIT License](./LICENSE) 开源，允许自由使用、修改和分发。

---

## 参与贡献

欢迎提交 PR 和 Issue！

1. Fork 本仓库
2. 创建分支：`git checkout -b feat/你的功能`
3. 提交改动：`git commit -m "feat: 描述你的改动"`
4. 推送分支：`git push origin feat/你的功能`
5. 发起 Pull Request

**提交信息规范：**
- `feat:` —— 新功能
- `fix:` —— Bug 修复
- `docs:` —— 文档更新
- `chore:` —— 维护性改动

---

## 更新日志

- **v1.0.0** —— 首次发布
