'use strict';

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getTimestamp, checkFfmpeg, getPlatform } = require('./utils');
const { resolveOutputDir } = require('./config');

function startRecording(options) {
    checkFfmpeg(); // 检查 ffmpeg 是否已安装

    const platform = getPlatform();
    const timestamp = getTimestamp();
    const outputDir = resolveOutputDir(options.output);
    const outputFile = path.join(outputDir, `recording_${timestamp}.mp4`);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let ffmpegArgs = [];

    if (platform === 'win32') {
        ffmpegArgs = buildWindowsArgs(options, outputFile);
    } else if (platform === 'darwin') {
        ffmpegArgs = buildMacArgs(options, outputFile);
    } else {
        ffmpegArgs = buildLinuxArgs(options, outputFile);
    }

    console.log(`\x1b[32m[screenrec] Recording started. Output: ${outputFile}\x1b[0m`);
    console.log(`\x1b[33m[screenrec] Press Ctrl+C to stop recording.\x1b[0m`);

    const ffmpeg = spawn('ffmpeg', ffmpegArgs, { stdio: 'inherit' });

    process.on('SIGINT', () => {
        ffmpeg.stdin.write('q');
    });

    ffmpeg.on('close', (code) => {
        if (code === 0 || code === 255) {
            console.log(`\x1b[32m[screenrec] Recording saved to: ${outputFile}\x1b[0m`);
        } else {
            console.error(`\x1b[31m[screenrec] ffmpeg exited with code ${code}\x1b[0m`);
            process.exit(1);
        }
    });
}

function buildWindowsArgs(options, outputFile) {
    const framerate = options.framerate || '30';
    const systemAudio = options.system || 'virtual-audio-capturer';
    const micAudio = options.mic || '麦克风 (Conexant ISST Audio)';

    if (options.audio === false) {
        // 无音频模式
        return [
            '-f', 'gdigrab',
            '-framerate', framerate,
            '-i', 'desktop',
            '-c:v', 'libx264',
            '-crf', '23',
            '-preset', 'veryfast',
            outputFile
        ];
    }

    // 有音频：混合系统音+麦克风
    return [
        '-f', 'gdigrab',
        '-framerate', framerate,
        '-i', 'desktop',
        '-f', 'dshow',
        '-i', `audio=${systemAudio}`,
        '-f', 'dshow',
        '-i', `audio=${micAudio}`,
        '-filter_complex', '[1:a][2:a]amerge=inputs=2[a]',
        '-map', '0:v',
        '-map', '[a]',
        '-c:v', 'libx264',
        '-crf', '23',
        '-preset', 'veryfast',
        '-c:a', 'aac',
        '-b:a', '128k',
        outputFile
    ];
}

function buildMacArgs(options, outputFile) {
    const framerate = options.framerate || '30';
    if (options.audio === false) {
        return [
            '-f', 'avfoundation',
            '-framerate', framerate,
            '-i', '1:none',
            '-c:v', 'libx264',
            '-crf', '23',
            '-preset', 'veryfast',
            outputFile
        ];
    }
    return [
        '-f', 'avfoundation',
        '-framerate', framerate,
        '-i', '1:0',
        '-c:v', 'libx264',
        '-crf', '23',
        '-preset', 'veryfast',
        '-c:a', 'aac',
        '-b:a', '128k',
        outputFile
    ];
}

function buildLinuxArgs(options, outputFile) {
    const framerate = options.framerate || '30';
    const display = process.env.DISPLAY || ':0';
    if (options.audio === false) {
        return [
            '-f', 'x11grab',
            '-framerate', framerate,
            '-i', `${display}.0`,
            '-c:v', 'libx264',
            '-crf', '23',
            '-preset', 'veryfast',
            outputFile
        ];
    }
    return [
        '-f', 'x11grab',
        '-framerate', framerate,
        '-i', `${display}.0`,
        '-f', 'pulse',
        '-i', 'default',
        '-c:v', 'libx264',
        '-crf', '23',
        '-preset', 'veryfast',
        '-c:a', 'aac',
        '-b:a', '128k',
        outputFile
    ];
}

module.exports = { startRecording };