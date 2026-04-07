#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');

const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

function hasFfmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

function printInstallGuide() {
    console.log('');
    console.log(`${RED}${BOLD}╔══════════════════════════════════════════════════════╗${RESET}`);
    console.log(`${RED}${BOLD}║   ⚠️  WARNING: ffmpeg not found in your system PATH  ║${RESET}`);
    console.log(`${RED}${BOLD}╚══════════════════════════════════════════════════════╝${RESET}`);
    console.log('');
    console.log(`${YELLOW}  screenrecorder-cli requires ffmpeg to work.${RESET}`);
    console.log(`${YELLOW}  Please install ffmpeg before using this tool:${RESET}`);
    console.log('');
    console.log(`${CYAN}  Windows:${RESET}`);
    console.log(`    1. Download from https://ffmpeg.org/download.html`);
    console.log(`    2. Extract and add the bin/ folder to your system PATH`);
    console.log(`    3. Or use winget: ${BOLD}winget install ffmpeg${RESET}`);
    console.log('');
    console.log(`${CYAN}  macOS:${RESET}`);
    console.log(`    ${BOLD}brew install ffmpeg${RESET}`);
    console.log('');
    console.log(`${CYAN}  Linux (Ubuntu/Debian):${RESET}`);
    console.log(`    ${BOLD}sudo apt install ffmpeg${RESET}`);
    console.log('');
    console.log(`${YELLOW}  After installing ffmpeg, run: ${BOLD}screenrec start${RESET}`);
    console.log('');
}

function printSuccess(version) {
    console.log('');
    console.log(`${GREEN}${BOLD}✔ ffmpeg detected: ${version}${RESET}`);
    console.log(`${GREEN}  screenrecorder-cli is ready to use!${RESET}`);
    console.log(`${GREEN}  Run: ${BOLD}screenrec start${RESET}`);
    console.log('');
}

// ── 主逻辑 ──────────────────────────────────────────────
if (hasFfmpeg()) {
    try {
        // 抓取 ffmpeg 版本号用于展示
        const raw = execSync('ffmpeg -version 2>&1').toString();
        const match = raw.match(/ffmpeg version ([^\s]+)/);
        const version = match ? match[1] : 'unknown';
        printSuccess(version);
    } catch (e) {
        printSuccess('detected');
    }
} else {
    printInstallGuide();
    // 注意：不调用 process.exit(1)，只是警告，不阻断安装
}