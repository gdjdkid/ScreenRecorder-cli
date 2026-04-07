# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | [Deutsch](./README_de.md) | Français | [Español](./README_es.md)

> Un enregistreur d'écran CLI multiplateforme basé sur ffmpeg —— lancez l'enregistrement en une seule commande.

[![npm version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

## Fonctionnalités

- 🎥 **Enregistrement écran + audio** —— Capture la vidéo du bureau, l'audio système et le microphone simultanément
- 📁 **Chemin de sortie flexible** —— Enregistrez un répertoire de sortie par défaut ou spécifiez-en un à chaque fois
- 🔍 **Détection automatique de ffmpeg** —— Vérifie la présence de ffmpeg à l'installation et à l'exécution
- 🖥️ **Multiplateforme** —— Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **Commandes simples** —— Démarrer, arrêter et configurer en une commande
- 🎛️ **Configurable** —— Fréquence d'images, activation/désactivation audio, répertoire de sortie

---

## Prérequis

- Node.js >= 18.0.0
- npm >= 6.0.0
- **ffmpeg** (doit être installé séparément et disponible dans le PATH)

### Installer ffmpeg

| Plateforme | Commande |
|---|---|
| Windows | `winget install ffmpeg` ou téléchargez depuis [ffmpeg.org](https://ffmpeg.org/download.html) |
| macOS | `brew install ffmpeg` |
| Linux | `sudo apt install ffmpeg` |

> **Note audio Windows :** Pour enregistrer le son système, installez d'abord [VB-Audio Virtual Cable](https://vb-audio.com/Cable/).

---

## Installation

**Option 1 : Via npm (recommandé)**
```bash
npm install -g screenrecorder-cli
```

**Option 2 : Cloner depuis GitHub (développeurs)**
```bash
git clone https://github.com/gdjdkid/ScreenRecorder-cli.git
cd ScreenRecorder-cli
npm install
npm install -g .
```

**Vérifier l'installation :**
```bash
screenrec -v
```

---

## Utilisation

**Démarrer l'enregistrement :**
```bash
screenrec start
```

**Enregistrer dans un dossier spécifique :**
```bash
screenrec start -o /home/user/Enregistrements
```

**Enregistrer sans audio :**
```bash
screenrec start --no-audio
```

**Définir le répertoire de sortie par défaut :**
```bash
screenrec set-output /home/user/Enregistrements
# ou mode interactif :
screenrec set-output
```

**Afficher la configuration actuelle :**
```bash
screenrec show-config
```

**Arrêter l'enregistrement :** Appuyez sur `Ctrl+C` — le fichier est sauvegardé automatiquement.

---

## Support des plateformes

| Plateforme | Capture vidéo | Audio système | Microphone |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow (VB-Audio requis) | ✅ dshow |
| macOS | ✅ avfoundation | ✅ intégré | ✅ intégré |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## Licence

Ce projet est open source sous la [Licence MIT](./LICENSE).

---

## Contribuer

Les PR et Issues sont les bienvenus !

1. Forkez ce dépôt
2. Créez votre branche : `git checkout -b feat/votre-fonctionnalité`
3. Commitez vos modifications : `git commit -m "feat: description"`
4. Poussez la branche : `git push origin feat/votre-fonctionnalité`
5. Ouvrez une Pull Request

---

## Journal des modifications

- **v1.0.0** —— Version initiale
