# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | Deutsch | [Français](./README_fr.md) | [Español](./README_es.md)

> Ein plattformübergreifendes CLI-Bildschirmrekorder-Tool auf Basis von ffmpeg —— Bildschirmaufnahme mit einem einzigen Befehl.

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## Funktionen

- 🎥 **Bildschirm + Audio-Aufnahme** —— Erfasst Desktop-Video, Systemton und Mikrofon gleichzeitig und mischt sie zusammen
- 📁 **Flexibler Ausgabepfad** —— Standardausgabeverzeichnis dauerhaft speichern oder pro Aufnahme angeben
- 🔍 **ffmpeg-Erkennung** —— Prüft ffmpeg bei der Installation und Laufzeit; zeigt eine Installationsanleitung, wenn es fehlt
- 🖥️ **Plattformübergreifend** —— Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **Einfache Befehle** —— Starten, Stoppen und Konfigurieren mit einem Befehl
- 🎛️ **Anpassbar** —— Bildrate, Audio-Umschalter und Ausgabeverzeichnis konfigurierbar

---

## Voraussetzungen

- Node.js >= 18.0.0
- npm >= 6.0.0
- **ffmpeg** (muss separat installiert und im PATH verfügbar sein)

### ffmpeg installieren

| Plattform | Befehl |
|---|---|
| Windows | `winget install ffmpeg` oder Download von [ffmpeg.org](https://ffmpeg.org/download.html) |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

> **Hinweis für Windows-Systemton:** Für die Aufnahme von Systemton bitte zuerst [VB-Audio Virtual Cable](https://vb-audio.com/Cable/) installieren.

---

## Installation

**Option 1: Per npm installieren (empfohlen)**
```bash
npm install -g screenrecorder-cli
```

**Option 2: Von GitHub klonen (für Entwickler)**
```bash
git clone https://github.com/gdjdkid/ScreenRecorder-cli.git
cd ScreenRecorder-cli
npm install
npm install -g .
```

**Installation prüfen:**
```bash
screenrec -v
```

---

## Verwendung

**Aufnahme starten (gespeichertes oder Standard-Ausgabeverzeichnis verwenden):**
```bash
screenrec start
```

**Aufnahme in einen bestimmten Ordner:**
```bash
screenrec start -o D:\MeineAufnahmen
```

**Aufnahme ohne Audio:**
```bash
screenrec start --no-audio
```

**Standard-Ausgabeverzeichnis dauerhaft festlegen:**
```bash
screenrec set-output D:\MeineAufnahmen
# oder interaktiver Modus:
screenrec set-output
```

**Aktuelle Konfiguration anzeigen:**
```bash
screenrec show-config
```

**Audiogeräte auflisten (nur Windows):**
```bash
screenrec devices
```

**Aufnahme stoppen:** `Ctrl+C` drücken — die Datei wird automatisch gespeichert.

---

## Plattform-Unterstützung

| Plattform | Video-Erfassung | Systemton | Mikrofon |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow (VB-Audio nötig) | ✅ dshow |
| macOS | ✅ avfoundation | ✅ integriert | ✅ integriert |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## Lizenz

Dieses Projekt ist unter der [MIT-Lizenz](./LICENSE) als Open Source veröffentlicht.

---

## Mitwirken

PRs und Issues sind willkommen!

1. Dieses Repository forken
2. Branch erstellen: `git checkout -b feat/dein-feature`
3. Änderungen committen: `git commit -m "feat: Beschreibung der Änderung"`
4. Branch pushen: `git push origin feat/dein-feature`
5. Pull Request öffnen

---

## Änderungsprotokoll

- **v1.0.0** —— Erstveröffentlichung
