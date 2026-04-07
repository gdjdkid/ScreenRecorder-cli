'use strict';

const { execSync } = require('child_process');
const { getPlatform } = require('./utils');

function listDevices() {
    const platform = getPlatform();

    if (platform !== 'win32') {
        console.log('\x1b[33m[screenrec] Device listing is currently only supported on Windows.\x1b[0m');
        return;
    }

    console.log('\x1b[32m[screenrec] Listing available DirectShow audio devices...\x1b[0m');
    try {
        // ffmpeg -list_devices true -f dshow -i dummy 会把设备列表输出到 stderr
        execSync('ffmpeg -list_devices true -f dshow -i dummy 2>&1 | findstr "dshow"', {
            stdio: 'inherit',
            shell: true
        });
    } catch (e) {
        // ffmpeg 列设备时 exit code 非 0 是正常的
        console.log('\x1b[33m[screenrec] Tip: Look for "DirectShow audio devices" section above.\x1b[0m');
    }
}

module.exports = { listDevices };