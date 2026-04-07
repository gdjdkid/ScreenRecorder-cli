'use strict';

const { execSync } = require('child_process');

function getTimestamp() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_` +
        `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

function getPlatform() {
    return process.platform; // 'win32' | 'darwin' | 'linux'
}

function checkFfmpeg() {
    try {
        execSync('ffmpeg -version', { stdio: 'ignore' });
    } catch (e) {
        console.error('\x1b[31m[screenrec] Error: ffmpeg is not installed or not in PATH.\x1b[0m');
        console.error('\x1b[33m[screenrec] Please install ffmpeg first:\x1b[0m');
        console.error('  Windows: https://ffmpeg.org/download.html');
        console.error('  macOS:   brew install ffmpeg');
        console.error('  Linux:   sudo apt install ffmpeg');
        process.exit(1);
    }
}

module.exports = { getTimestamp, getPlatform, checkFfmpeg };