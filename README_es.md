# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | [Deutsch](./README_de.md) | [Français](./README_fr.md) | Español

> Un grabador de pantalla CLI multiplataforma basado en ffmpeg — graba tu pantalla con un solo comando.

[![npm version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## Características

- 🎥 **Grabación de pantalla + audio** — Captura video del escritorio, audio del sistema y micrófono simultáneamente
- 📁 **Ruta de salida flexible** — Guarda un directorio de salida predeterminado o especifica uno por grabación
- 🎛️ **Configuración de dispositivos** — Guarda los nombres de tus dispositivos de audio una vez, se aplican automáticamente
- 🔍 **Detección automática de ffmpeg** — Verifica ffmpeg en la instalación y en tiempo de ejecución
- 🖥️ **Multiplataforma** — Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **Comandos simples** — Iniciar, detener y configurar con un solo comando

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

> **Nota de audio en Windows:** Para grabar el audio del sistema, instala primero [screen-capture-recorder](https://github.com/rdp/screen-capture-recorder-to-video-windows-free).

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

## Inicio rápido

```bash
# 1. Listar dispositivos de audio disponibles (Windows / macOS)
screenrec devices

# 2. Guardar los nombres de los dispositivos de audio
screenrec set-device --mic "Micrófono (Tu dispositivo)" --system "virtual-audio-capturer"

# 3. Iniciar la grabación
screenrec start
```

Presiona `Ctrl+C` para detener — el archivo se guarda automáticamente.

---

## Uso

**Iniciar grabación (directorio guardado o por defecto):**
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

**Usar un micrófono específico solo para esta sesión:**
```bash
screenrec start --mic "Micrófono USB"
```

**Establecer directorio de salida predeterminado:**
```bash
screenrec set-output /home/usuario/Grabaciones
# o modo interactivo:
screenrec set-output
```

**Guardar nombres de dispositivos de audio en la configuración:**
```bash
# Modo interactivo
screenrec set-device

# Modo directo (recomendado)
screenrec set-device --mic "Micrófono (Conexant ISST Audio)" --system "virtual-audio-capturer"
```

**Ver configuración actual:**
```bash
screenrec show-config
```

**Listar dispositivos de audio:**
```bash
screenrec devices
```

**Detener grabación:** Presiona `Ctrl+C` — el archivo se guarda automáticamente.

---

## Referencia de comandos

```
Uso: screenrec [comando] [opciones]

Comandos:
  start          Iniciar grabación (predeterminado)
  set-output     Establecer directorio de salida predeterminado
  set-device     Configurar y guardar nombres de dispositivos de audio
  show-config    Ver configuración actual
  devices        Listar dispositivos de entrada de audio disponibles

Opciones para start:
  -o, --output <dir>    Directorio de salida (solo esta sesión, reemplaza config. guardada)
  -r, --framerate <fps> Fotogramas por segundo (predeterminado: 30)
  --no-audio            Desactivar grabación de audio
  --mic <nombre>        Nombre del micrófono (solo esta sesión)
  --system <nombre>     Nombre del dispositivo de audio del sistema (solo esta sesión)
  -v, --version         Mostrar número de versión
  -h, --help            Mostrar ayuda

Opciones para set-device:
  --mic <nombre>        Nombre del micrófono a guardar
  --system <nombre>     Nombre del dispositivo de audio del sistema a guardar
```

---

## Prioridad del directorio de salida

```
Opción -o (solo esta sesión)
  ↓ no definida
Config. guardada (screenrec set-output)
  ↓ no definida
Predeterminado: ~/Videos/ScreenRecords
```

---

## Compatibilidad de plataformas

| Plataforma | Captura de vídeo | Audio del sistema | Micrófono |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow | ✅ dshow |
| macOS | ✅ avfoundation | ✅ integrado | ✅ integrado |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## Archivo de configuración

La configuración se guarda en `~/.config/screenrec/config.json` y persiste entre sesiones.

```json
{
  "outputDir": "/home/usuario/Grabaciones",
  "micDevice": "Micrófono (Conexant ISST Audio)",
  "systemDevice": "virtual-audio-capturer"
}
```

---

## Preguntas frecuentes

**P: Aparece "ffmpeg not found" después de instalar?**
R: ffmpeg debe instalarse por separado. Ver la sección Requisitos arriba.

**P: No hay audio del sistema en Windows?**
R: Instala [screen-capture-recorder](https://github.com/rdp/screen-capture-recorder-to-video-windows-free) y usa `virtual-audio-capturer` como dispositivo de audio del sistema.

**P: ¿Cómo encuentro los nombres de mis dispositivos?**
R: Ejecuta `screenrec devices` para listar todos los dispositivos de audio disponibles, luego guárdalos con `screenrec set-device`.

**P: ¿Cómo detengo la grabación?**
R: Presiona `Ctrl+C`. El archivo de salida se guarda automáticamente.

**P: ¿Dónde está el archivo de salida?**
R: Ejecuta `screenrec show-config` para ver tu directorio de salida actual.

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

**Convenciones de mensajes de commit:**
- `feat:` — nueva funcionalidad
- `fix:` — corrección de errores
- `docs:` — actualización de documentación
- `chore:` — mantenimiento

---

## Buy Me a Coffee ☕

Si esta herramienta te ahorra tiempo, considera apoyar el desarrollo:

| WeChat Pay | Alipay | PayPal |
|------------|--------|--------|
| ![WeChat](assets/WeChatPay.JPG) | ![Alipay](assets/AliPay.JPG) | ![PayPal](assets/PayPal.jpg) |

---

## Registro de cambios

- **v1.1.0** — Añadido comando `set-device`; corregido crash al pulsar Ctrl+C; añadida lista de dispositivos en macOS; refactorizados argumentos de codec; eliminados nombres de dispositivos codificados
- **v1.0.0** — Versión inicial
