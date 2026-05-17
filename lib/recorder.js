'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getTimestamp, checkFfmpeg, getPlatform } = require('./utils');
const { resolveOutputDir, readConfig } = require('./config');  // ← 补上 readConfig

const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const RESET  = '\x1b[0m';

// ── 公共编码参数────────────────────────
const VIDEO_CODEC_ARGS = ['-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast'];
const AUDIO_CODEC_ARGS = ['-c:a', 'aac', '-b:a', '128k'];

function startRecording(options) {
    checkFfmpeg();

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

    console.log(`${GREEN}[screenrec] Recording started. Output: ${outputFile}${RESET}`);
    console.log(`${YELLOW}[screenrec] Press Ctrl+C to stop recording.${RESET}`);

    // stdio: ['pipe', 'inherit', 'inherit'] 才能向 stdin 写 'q'
    const ffmpeg = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'inherit', 'inherit'] });

    process.on('SIGINT', () => {
        ffmpeg.stdin.write('q\n');
        ffmpeg.stdin.end();
    });

    ffmpeg.on('close', (code) => {
        if (code === 0 || code === 255) {
            console.log(`${GREEN}[screenrec] Recording saved to: ${outputFile}${RESET}`);
        } else {
            console.error(`${RED}[screenrec] ffmpeg exited with code ${code}${RESET}`);
            process.exit(1);
        }
    });
}

function buildWindowsArgs(options, outputFile) {
    const platform = getPlatform();           // ← 在函数内部单独获取
    const config = readConfig();              // ← 现在 readConfig 已正确引入
    const framerate = options.framerate || '30';
    const systemAudio = options.system || config.systemDevice || 'virtual-audio-capturer';
    const micAudio    = options.mic    || config.micDevice;

    if (!micAudio && platform === 'win32' && options.audio !== false) {
        console.log(`${YELLOW}[screenrec] Tip: No mic device configured.`);
        console.log(`  Run "screenrec devices" to list devices, then "screenrec set-device" to save.${RESET}`);
    }

    const videoInputArgs = ['-f', 'gdigrab', '-framerate', framerate, '-i', 'desktop'];

    if (options.audio === false) {
        return [...videoInputArgs, ...VIDEO_CODEC_ARGS, outputFile];
    }

    // 有麦克风：混合系统音 + 麦克风
    if (micAudio) {
        return [
            ...videoInputArgs,
            '-f', 'dshow', '-i', `audio=${systemAudio}`,
            '-f', 'dshow', '-i', `audio=${micAudio}`,
            '-filter_complex', '[1:a][2:a]amerge=inputs=2[a]',
            '-map', '0:v', '-map', '[a]',
            ...VIDEO_CODEC_ARGS, ...AUDIO_CODEC_ARGS,
            outputFile
        ];
    }

    // 只有系统音，没有麦克风
    return [
        ...videoInputArgs,
        '-f', 'dshow', '-i', `audio=${systemAudio}`,
        '-map', '0:v', '-map', '1:a',
        ...VIDEO_CODEC_ARGS, ...AUDIO_CODEC_ARGS,
        outputFile
    ];
}

function buildMacArgs(options, outputFile) {
    const framerate = options.framerate || '30';
    const videoInputArgs = ['-f', 'avfoundation', '-framerate', framerate];

    if (options.audio === false) {
        return [...videoInputArgs, '-i', '1:none', ...VIDEO_CODEC_ARGS, outputFile];
    }
    return [...videoInputArgs, '-i', '1:0', ...VIDEO_CODEC_ARGS, ...AUDIO_CODEC_ARGS, outputFile];
}

function buildLinuxArgs(options, outputFile) {
    const framerate = options.framerate || '30';
    const display = process.env.DISPLAY || ':0';
    const videoInputArgs = ['-f', 'x11grab', '-framerate', framerate, '-i', `${display}.0`];

    if (options.audio === false) {
        return [...videoInputArgs, ...VIDEO_CODEC_ARGS, outputFile];
    }
    return [...videoInputArgs, '-f', 'pulse', '-i', 'default', ...VIDEO_CODEC_ARGS, ...AUDIO_CODEC_ARGS, outputFile];
}

module.exports = { startRecording };