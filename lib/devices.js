'use strict';

const { spawnSync } = require('child_process');   // ← 顶部引入，不要放在函数里
const { getPlatform } = require('./utils');

const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const RESET  = '\x1b[0m';

function listDevices() {
    const platform = getPlatform();

    if (platform === 'win32') {
        listWindowsDevices();
    } else if (platform === 'darwin') {
        listMacDevices();
    } else {
        console.log(`${YELLOW}[screenrec] Linux device listing is not supported yet.${RESET}`);
        console.log(`  Run: pactl list sources short`);
    }
}

function listWindowsDevices() {
    console.log(`${GREEN}[screenrec] Listing available DirectShow audio devices...${RESET}`);
    // ffmpeg -list_devices 的输出全在 stderr，spawnSync 可以直接捕获
    const result = spawnSync(
        'ffmpeg',
        ['-list_devices', 'true', '-f', 'dshow', '-i', 'dummy'],
        { encoding: 'utf-8', shell: false }
    );
    // 不管 exit code（非 0 是正常的），直接打印 stderr
    const output = result.stderr || result.stdout || '(no output)';
    console.log(output);
    console.log(`${YELLOW}[screenrec] Use the device names above with "screenrec set-device".${RESET}`);
}

function listMacDevices() {
    console.log(`${GREEN}[screenrec] Listing available AVFoundation devices...${RESET}`);
    const result = spawnSync(
        'ffmpeg',
        ['-f', 'avfoundation', '-list_devices', 'true', '-i', '""'],
        { encoding: 'utf-8', shell: false }
    );
    console.log(result.stderr || result.stdout || '(no output)');
}

module.exports = { listDevices };