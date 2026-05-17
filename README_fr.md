# ScreenRecorder-cli 🎬

[English](./README.md) | [中文](./README_zh.md) | [日本語](README_jp.md) | [한국어](README_kr.md) | [Deutsch](./README_de.md) | Français | [Español](./README_es.md)

> Un enregistreur d'écran CLI multiplateforme basé sur ffmpeg — lancez l'enregistrement en une seule commande.

[![npm version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://www.npmjs.com/package/screenrecorder-cli)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)]()

---

![ScreenRecDemo](https://raw.githubusercontent.com/gdjdkid/ScreenRecorder-cli/master/assets/ScreenrecDemo.gif)

---

## Fonctionnalités

- 🎥 **Enregistrement écran + audio** — Capture la vidéo du bureau, l'audio système et le microphone simultanément
- 📁 **Chemin de sortie flexible** — Enregistrez un répertoire de sortie par défaut ou spécifiez-en un à chaque fois
- 🎛️ **Configuration des périphériques** — Enregistrez vos noms de périphériques audio une fois, utilisés automatiquement ensuite
- 🔍 **Détection automatique de ffmpeg** — Vérifie la présence de ffmpeg à l'installation et à l'exécution
- 🖥️ **Multiplateforme** — Windows (gdigrab), macOS (avfoundation), Linux (x11grab)
- ⚡ **Commandes simples** — Démarrer, arrêter et configurer en une commande

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

> **Note audio Windows :** Pour enregistrer le son système, installez d'abord [screen-capture-recorder](https://github.com/rdp/screen-capture-recorder-to-video-windows-free).

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

## Démarrage rapide

```bash
# 1. Lister les périphériques audio disponibles (Windows / macOS)
screenrec devices

# 2. Enregistrer les noms de périphériques audio
screenrec set-device --mic "Microphone (Votre périphérique)" --system "virtual-audio-capturer"

# 3. Démarrer l'enregistrement
screenrec start
```

Appuyez sur `Ctrl+C` pour arrêter — le fichier est sauvegardé automatiquement.

---

## Utilisation

**Démarrer l'enregistrement (répertoire sauvegardé ou par défaut) :**
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

**Utiliser un microphone spécifique pour cette session uniquement :**
```bash
screenrec start --mic "Microphone USB"
```

**Définir le répertoire de sortie par défaut :**
```bash
screenrec set-output /home/user/Enregistrements
# ou mode interactif :
screenrec set-output
```

**Enregistrer les noms de périphériques dans la configuration :**
```bash
# Mode interactif
screenrec set-device

# Mode direct (recommandé)
screenrec set-device --mic "Microphone (Conexant ISST Audio)" --system "virtual-audio-capturer"
```

**Afficher la configuration actuelle :**
```bash
screenrec show-config
```

**Lister les périphériques audio :**
```bash
screenrec devices
```

**Arrêter l'enregistrement :** Appuyez sur `Ctrl+C` — le fichier est sauvegardé automatiquement.

---

## Référence des commandes

```
Utilisation : screenrec [commande] [options]

Commandes :
  start          Démarrer l'enregistrement (défaut)
  set-output     Définir le répertoire de sortie par défaut
  set-device     Configurer et sauvegarder les noms de périphériques audio
  show-config    Afficher la configuration actuelle
  devices        Lister les périphériques d'entrée audio disponibles

Options pour start :
  -o, --output <rép.>   Répertoire de sortie (cette session uniquement, remplace la config.)
  -r, --framerate <fps> Images par seconde (défaut : 30)
  --no-audio            Désactiver l'enregistrement audio
  --mic <nom>           Nom du microphone (cette session uniquement)
  --system <nom>        Nom du périphérique audio système (cette session uniquement)
  -v, --version         Afficher le numéro de version
  -h, --help            Afficher l'aide

Options pour set-device :
  --mic <nom>           Nom du microphone à sauvegarder
  --system <nom>        Nom du périphérique audio système à sauvegarder
```

---

## Priorité du répertoire de sortie

```
Option -o (cette session uniquement)
  ↓ non défini
Config. sauvegardée (screenrec set-output)
  ↓ non défini
Défaut : ~/Videos/ScreenRecords
```

---

## Support des plateformes

| Plateforme | Capture vidéo | Audio système | Microphone |
|---|---|---|---|
| Windows | ✅ gdigrab | ✅ dshow | ✅ dshow |
| macOS | ✅ avfoundation | ✅ intégré | ✅ intégré |
| Linux | ✅ x11grab | ✅ pulseaudio | ✅ pulseaudio |

---

## Fichier de configuration

La configuration est sauvegardée dans `~/.config/screenrec/config.json` et persiste entre les sessions.

```json
{
  "outputDir": "/home/user/Enregistrements",
  "micDevice": "Microphone (Conexant ISST Audio)",
  "systemDevice": "virtual-audio-capturer"
}
```

---

## Mise à jour

**Option 1 : Installé via npm**
```bash
npm install -g screenrecorder-cli@latest
```

**Option 2 : Cloné depuis GitHub**
```bash
cd ScreenRecorder-cli
git pull
npm install -g .
```

**Vérifier la mise à jour :**
```bash
screenrec -v
```

---

## Questions fréquentes

**Q : J'obtiens « ffmpeg not found » après l'installation ?**  
R : ffmpeg doit être installé séparément. Voir la section Prérequis ci-dessus.

**Q : Pas d'audio système sous Windows ?**  
R : Installez [screen-capture-recorder](https://github.com/rdp/screen-capture-recorder-to-video-windows-free) et utilisez `virtual-audio-capturer` comme périphérique audio système.

**Q : Comment trouver mes noms de périphériques ?**  
R : Exécutez `screenrec devices` pour lister tous les périphériques audio disponibles, puis sauvegardez-les avec `screenrec set-device`.

**Q : Comment arrêter l'enregistrement ?**  
R : Appuyez sur `Ctrl+C`. Le fichier de sortie est sauvegardé automatiquement.

**Q : Où se trouve le fichier de sortie ?**  
R : Exécutez `screenrec show-config` pour voir votre répertoire de sortie actuel.

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

**Conventions de messages de commit :**
- `feat:` — nouvelle fonctionnalité
- `fix:` — correction de bug
- `docs:` — mise à jour de la documentation
- `chore:` — maintenance

---

## Buy Me a Coffee ☕

Si cet outil vous fait gagner du temps, envisagez de soutenir le développement :

| WeChat Pay | Alipay | PayPal |
|------------|--------|--------|
| ![WeChat](assets/WeChatPay.JPG) | ![Alipay](assets/AliPay.JPG) | ![PayPal](assets/PayPal.jpg) |

---

## Journal des modifications

- **v1.1.0** — Ajout de la commande `set-device` ; correction du crash Ctrl+C ; ajout de la liste des périphériques macOS ; refactorisation des arguments de codec ; suppression des noms de périphériques codés en dur
- **v1.0.0** — Version initiale
