# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | Deutsch | [Français](./README_fr.md) | [Español](./README_es.md)

> Ein plattformübergreifendes CLI-Bildschirmrekorder-Tool auf Basis von ffmpeg — Bildschirmaufnahme mit einem einzigen Befehl.

[![npm version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## Funktionen

- 🎥 **Bildschirm + Audio-Aufnahme** — Erfasst Desktop-Video, Systemton und Mikrofon gleichzeitig und mischt sie zusammen
- 📁 **Flexibler Ausgabepfad** — Standardausgabeverzeichnis dauerhaft speichern oder pro Aufnahme angeben
- 🎛️ **Gerätekonfiguration** — Audiogerätename einmal speichern, dauerhaft verwenden
- 🔍 **ffmpeg-Erkennung** — Prüft ffmpeg bei der Installation und Laufzeit; zeigt eine Installationsanleitung, wenn es fehlt
- 🖥️ **Plattformübergreifend** — Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **Einfache Befehle** — Starten, Stoppen und Konfigurieren mit einem Befehl

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

> **Hinweis für Windows-Systemton:** Für die Aufnahme von Systemton bitte zuerst [screen-capture-recorder](https://github.com/rdp/screen-capture-recorder-to-video-windows-free) installieren.

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

## Schnellstart

```bash
# 1. Verfügbare Audiogeräte anzeigen (Windows / macOS)
screenrec devices

# 2. Audiogerätename speichern
screenrec set-device --mic "Mikrofon (Dein Gerät)" --system "virtual-audio-capturer"

# 3. Aufnahme starten
screenrec start
```

`Ctrl+C` drücken, um die Aufnahme zu stoppen — die Datei wird automatisch gespeichert.

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

**Nur für diese Sitzung ein bestimmtes Mikrofon verwenden:**
```bash
screenrec start --mic "USB-Mikrofon"
```

**Standard-Ausgabeverzeichnis dauerhaft festlegen:**
```bash
screenrec set-output D:\MeineAufnahmen
# oder interaktiver Modus:
screenrec set-output
```

**Audiogerätename in der Konfiguration speichern:**
```bash
# Interaktiver Modus
screenrec set-device

# Direkte Eingabe (empfohlen)
screenrec set-device --mic "Mikrofon (Conexant ISST Audio)" --system "virtual-audio-capturer"
```

**Aktuelle Konfiguration anzeigen:**
```bash
screenrec show-config
```

**Audiogeräte auflisten:**
```bash
screenrec devices
```

**Aufnahme stoppen:** `Ctrl+C` drücken — die Datei wird automatisch gespeichert.

---

## Befehlsreferenz

```
Verwendung: screenrec [Befehl] [Optionen]

Befehle:
  start          Aufnahme starten (Standard)
  set-output     Standard-Ausgabeverzeichnis festlegen
  set-device     Audiogerätenamen konfigurieren und speichern
  show-config    Aktuelle Konfiguration anzeigen
  devices        Verfügbare Audioeingabegeräte auflisten

Optionen für start:
  -o, --output <Verz.>   Ausgabeverzeichnis (nur diese Sitzung, überschreibt gespeicherte Konfig.)
  -r, --framerate <fps>  Bildrate (Standard: 30)
  --no-audio             Audioaufnahme deaktivieren
  --mic <Name>           Mikrofongerätename (nur diese Sitzung)
  --system <Name>        Systemaudiogerätename (nur diese Sitzung)
  -v, --version          Versionsnummer ausgeben
  -h, --help             Hilfe anzeigen

Optionen für set-device:
  --mic <Name>           Zu speichernder Mikrofongerätename
  --system <Name>        Zu speichernder Systemaudiogerätename
```

---

## Priorität des Ausgabeverzeichnisses

```
-o Flag (nur diese Sitzung)
  ↓ nicht gesetzt
Gespeicherte Konfig. (screenrec set-output)
  ↓ nicht gesetzt
Standard: ~/Videos/ScreenRecords
```

---

## Plattform-Unterstützung

| Plattform | Video-Erfassung | Systemton | Mikrofon |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow | ✅ dshow |
| macOS | ✅ avfoundation | ✅ integriert | ✅ integriert |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## Konfigurationsdatei

Die Konfiguration wird unter `~/.config/screenrec/config.json` gespeichert und bleibt sitzungsübergreifend erhalten.

```json
{
  "outputDir": "D:\\MeineAufnahmen",
  "micDevice": "Mikrofon (Conexant ISST Audio)",
  "systemDevice": "virtual-audio-capturer"
}
```

---

## Häufige Fragen

**F: Nach der Installation erscheint „ffmpeg not found"?**
A: ffmpeg muss separat installiert werden. Siehe Abschnitt „Voraussetzungen" oben.

**F: Kein Systemton unter Windows?**
A: [screen-capture-recorder](https://github.com/rdp/screen-capture-recorder-to-video-windows-free) installieren und `virtual-audio-capturer` als Systemaudiogerät verwenden.

**F: Wie finde ich meine Gerätenamen?**
A: `screenrec devices` ausführen, um alle verfügbaren Audiogeräte aufzulisten, und dann mit `screenrec set-device` speichern.

**F: Wie stoppt man die Aufnahme?**
A: `Ctrl+C` drücken. Die Ausgabedatei wird automatisch gespeichert.

**F: Wo befindet sich die Ausgabedatei?**
A: `screenrec show-config` ausführen, um das aktuelle Ausgabeverzeichnis zu sehen.

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

**Commit-Nachrichtenkonventionen:**
- `feat:` — neue Funktion
- `fix:` — Fehlerbehebung
- `docs:` — Dokumentationsaktualisierung
- `chore:` — Wartung

---

## Buy Me a Coffee ☕

Wenn dieses Tool Ihnen Zeit spart, erwägen Sie, die Entwicklung zu unterstützen:

| WeChat Pay | Alipay | PayPal |
|------------|--------|--------|
| ![WeChat](assets/WeChatPay.JPG) | ![Alipay](assets/AliPay.JPG) | ![PayPal](assets/PayPal.jpg) |

---

## Änderungsprotokoll

- **v1.1.0** — `set-device`-Befehl hinzugefügt; SIGINT-Handler-Absturz behoben; macOS-Geräteliste ergänzt; Codec-Argumente refaktoriert; fest codierte Gerätenamen entfernt
- **v1.0.0** — Erstveröffentlichung
