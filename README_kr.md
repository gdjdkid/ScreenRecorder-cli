# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | 한국어 | [Deutsch](./README_de.md) | [Français](./README_fr.md) | [Español](./README_es.md)

> ffmpeg 기반 크로스 플랫폼 CLI 화면 녹화 도구 —— 명령어 하나로 녹화 시작.

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## 주요 기능

- 🎥 **화면 + 오디오 녹화** —— 데스크톱 영상, 시스템 오디오, 마이크를 동시에 캡처하여 믹싱
- 📁 **유연한 출력 경로** —— 기본 출력 디렉토리를 영구 저장하거나 매번 임시 지정 가능
- 🔍 **ffmpeg 자동 감지** —— 설치 시 및 실행 시 ffmpeg 존재 여부를 확인하고, 없을 경우 설치 안내 제공
- 🖥️ **크로스 플랫폼** —— Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **간단한 명령어** —— 시작, 중지, 설정을 모두 한 줄로
- 🎛️ **커스터마이즈 가능** —— 프레임 레이트, 오디오 온/오프, 출력 디렉토리 설정

---

## 요구 사항

- Node.js >= 18.0.0
- npm >= 6.0.0
- **ffmpeg** (별도 설치 후 PATH에 추가 필요)

### ffmpeg 설치

| 플랫폼 | 명령어 |
|---|---|
| Windows | `winget install ffmpeg` 또는 [ffmpeg.org](https://ffmpeg.org/download.html)에서 다운로드 |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

> **Windows 시스템 오디오 안내:** 시스템 오디오를 녹음하려면 [VB-Audio Virtual Cable](https://vb-audio.com/Cable/)을 먼저 설치하세요.

---

## 설치

**방법 1: npm으로 설치 (권장)**
```bash
npm install -g screenrecorder-cli
```

**방법 2: GitHub에서 클론 (개발자용)**
```bash
git clone https://github.com/gdjdkid/ScreenRecorder-cli.git
cd ScreenRecorder-cli
npm install
npm install -g .
```

**설치 확인:**
```bash
screenrec -v
```

---

## 사용법

**녹화 시작 (저장된 또는 기본 출력 디렉토리 사용):**
```bash
screenrec start
```

**특정 폴더로 녹화:**
```bash
screenrec start -o D:\내녹화
```

**오디오 없이 녹화:**
```bash
screenrec start --no-audio
```

**기본 출력 디렉토리 영구 설정:**
```bash
screenrec set-output D:\내녹화
# 또는 대화형 모드:
screenrec set-output
```

**현재 설정 확인:**
```bash
screenrec show-config
```

**오디오 장치 목록 (Windows 전용):**
```bash
screenrec devices
```

**녹화 중지:** `Ctrl+C`를 누르면 파일이 자동으로 저장됩니다.

---

## 명령어 안내

```
사용법: screenrec [명령어] [옵션]

명령어:
  start          녹화 시작 (기본값)
  set-output     기본 출력 디렉토리 설정
  show-config    현재 설정 표시
  devices        사용 가능한 오디오 입력 장치 목록

start 옵션:
  -o, --output <경로>    출력 디렉토리 (저장된 설정을 임시 덮어씀)
  -r, --framerate <fps>  프레임 레이트 (기본값: 30)
  --no-audio             오디오 녹음 비활성화
  --mic <이름>           마이크 장치 이름 (Windows)
  --system <이름>        시스템 오디오 장치 이름 (Windows)
  -v, --version          버전 출력
  -h, --help             도움말 표시
```

---

## 출력 경로 우선순위

```
-o 옵션 (이번 실행에만 유효)
  ↓ 미지정
저장된 설정 (screenrec set-output)
  ↓ 미설정
기본값: ~/Videos/ScreenRecords
```

---

## 플랫폼 지원

| 플랫폼 | 영상 캡처 | 시스템 오디오 | 마이크 |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow (VB-Audio 필요) | ✅ dshow |
| macOS | ✅ avfoundation | ✅ 내장 | ✅ 내장 |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## 라이선스

이 프로젝트는 [MIT License](./LICENSE) 하에 오픈소스로 공개됩니다.

---

## 기여하기

PR과 Issue 모두 환영합니다!

1. 이 저장소를 Fork
2. 브랜치 생성: `git checkout -b feat/your-feature`
3. 변경 사항 커밋: `git commit -m "feat: 변경 내용 설명"`
4. 브랜치 푸시: `git push origin feat/your-feature`
5. Pull Request 생성

---

## 변경 이력

- **v1.0.0** —— 최초 릴리스
