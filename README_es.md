# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | [Deutsch](./README_de.md) | [Français](./README_fr.md) | Español

> Un grabador de pantalla CLI multiplataforma basado en ffmpeg —— graba tu pantalla con un solo comando.

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## Características

- 🎥 **Grabación de pantalla + audio** —— Captura video del escritorio, audio del sistema y micrófono simultáneamente
- 📁 **Ruta de salida flexible** —— Guarda un directorio de salida predeterminado o especifica uno por grabación
- 🔍 **Detección automática de ffmpeg** —— Verifica ffmpeg en la instalación y en tiempo de ejecución
- 🖥️ **Multiplataforma** —— Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **Comandos simples** —— Iniciar, detener y configurar con un solo comando
- 🎛️ **Configurable** —— Velocidad de fotogramas, activar/desactivar audio, directorio de salida

---

## Requisitos

- Node.js >= 18.0.0
- npm >= 6.0.0
- **ffmpeg** (debe instalarse por separado y estar disponible en el PATH)

### Instalar ffmpeg

| Plataforma | Comando |
|---|---|
| Windows | `winget install ffmpeg` o descarga desde [ffmpeg.org](https://ffmpeg.org/download.html) |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

> **Nota de audio en Windows:** Para grabar el audio del sistema, instala primero [VB-Audio Virtual Cable](https://vb-audio.com/Cable/).

---

## Instalación

**Opción 1: Instalar vía npm (recomendado)**
```bash
npm install -g screenrecorder-cli
```

**Opción 2: Clonar desde GitHub (desarrolladores)**
```bash
git clone https://github.com/gdjdkid/ScreenRecorder-cli.git
cd ScreenRecorder-cli
npm install
npm install -g .
```

**Verificar la instalación:**
```bash
screenrec -v
```

---

## Uso

**Iniciar grabación:**
```bash
screenrec start
```

**Grabar en una carpeta específica:**
```bash
screenrec start -o /home/usuario/Grabaciones
```

**Grabar sin audio:**
```bash
screenrec start --no-audio
```

**Establecer directorio de salida predeterminado:**
```bash
screenrec set-output /home/usuario/Grabaciones
# o modo interactivo:
screenrec set-output
```

**Ver configuración actual:**
```bash
screenrec show-config
```

**Detener grabación:** Presiona `Ctrl+C` — el archivo se guarda automáticamente.

---

## Soporte de plataformas

| Plataforma | Captura de video | Audio del sistema | Micrófono |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow (requiere VB-Audio) | ✅ dshow |
| macOS | ✅ avfoundation | ✅ integrado | ✅ integrado |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## Licencia

Este proyecto es de código abierto bajo la [Licencia MIT](./LICENSE).

---

## Contribuir

¡PRs e Issues son bienvenidos!

1. Haz fork de este repositorio
2. Crea tu rama: `git checkout -b feat/tu-funcionalidad`
3. Confirma tus cambios: `git commit -m "feat: descripción del cambio"`
4. Sube la rama: `git push origin feat/tu-funcionalidad`
5. Abre un Pull Request

---

## Registro de cambios

- **v1.0.0** —— Versión inicial
