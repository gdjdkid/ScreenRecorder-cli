'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { getTimestamp, checkFfmpeg, getPlatform } = require('./utils');
const { resolveOutputDir, readConfig } = require('./config');

const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

// ── 公共编码参数 ────────────────────────────────────────
const VIDEO_CODEC_ARGS = ['-c:v', 'libx264', '-crf', '23', '-preset', 'veryfast'];
const AUDIO_CODEC_ARGS = ['-c:a', 'aac', '-b:a', '128k'];

// ── 小工具：readline 封装成 Promise ──────────────────────
function ask(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// ── 功能1：交互式文件名预设 ────────────────────────────
// 返回不带扩展名的文件名（不含路径）
async function promptFileName() {
    const defaultName = `recording_${getTimestamp()}`;
    const answer = await ask(
        `${CYAN}Enter a file name (without extension)\n  (leave blank to use default: ${defaultName})\n> ${RESET}`
    );

    if (!answer) return defaultName;

    // 简单清理：去掉路径分隔符和非法字符，避免破坏输出路径
    const cleaned = answer.replace(/[\\/:*?"<>|]/g, '_');
    if (cleaned !== answer) {
        console.log(`${YELLOW}[screenrec] Invalid characters replaced with "_": ${cleaned}${RESET}`);
    }
    return cleaned;
}

// ── 功能2：重名检测与处理 ──────────────────────────────
// 给定 outputDir 和不带扩展名的 baseName，返回最终不冲突的完整路径
async function resolveUniqueOutputFile(outputDir, baseName) {
    let name = baseName;
    let outputFile = path.join(outputDir, `${name}.mp4`);

    while (fs.existsSync(outputFile)) {
        console.log(`${YELLOW}[screenrec] File already exists: ${outputFile}${RESET}`);
        const choice = await ask(
            `${CYAN}Choose an action:\n` +
            `  [r] Rename (enter a new name)\n` +
            `  [o] Overwrite existing file\n` +
            `  [a] Auto-rename (append _1, _2, ...)\n` +
            `> ${RESET}`
        );

        const c = choice.toLowerCase();

        if (c === 'o') {
            console.log(`${YELLOW}[screenrec] Existing file will be overwritten.${RESET}`);
            break;
        }

        if (c === 'a' || c === '') {
            // 自动追加序号
            let i = 1;
            let candidate;
            do {
                candidate = `${baseName}_${i}`;
                i++;
            } while (fs.existsSync(path.join(outputDir, `${candidate}.mp4`)));
            name = candidate;
            outputFile = path.join(outputDir, `${name}.mp4`);
            console.log(`${GREEN}[screenrec] Using auto-generated name: ${name}.mp4${RESET}`);
            break;
        }

        if (c === 'r') {
            const newName = await ask(`${CYAN}Enter new file name (without extension)\n> ${RESET}`);
            if (newName) {
                name = newName.replace(/[\\/:*?"<>|]/g, '_');
                outputFile = path.join(outputDir, `${name}.mp4`);
                // 回到 while 循环顶部重新检查
                continue;
            }
            // 用户没输入，则当作 auto-rename
            let i = 1;
            let candidate;
            do {
                candidate = `${baseName}_${i}`;
                i++;
            } while (fs.existsSync(path.join(outputDir, `${candidate}.mp4`)));
            name = candidate;
            outputFile = path.join(outputDir, `${name}.mp4`);
            console.log(`${GREEN}[screenrec] Using auto-generated name: ${name}.mp4${RESET}`);
            break;
        }

        // 无效输入，重新询问（while 循环继续，fs.existsSync 仍为 true）
        console.log(`${RED}[screenrec] Invalid choice, please enter r / o / a.${RESET}`);
    }

    return outputFile;
}

// ── 功能3：可视化倒计时 ────────────────────────────────
function countdown(seconds) {
    return new Promise((resolve) => {
        let remaining = seconds;

        // 首次立即打印
        process.stdout.write(`${GREEN}${BOLD}Recording starts in: ${remaining}${RESET}  \r`);

        const timer = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                process.stdout.write(`${GREEN}${BOLD}Recording starts in: ${remaining}${RESET}  \r`);
            } else {
                // 清空当前行，打印 GO!
                process.stdout.write(`${GREEN}${BOLD}Recording starts in: GO!${RESET}      \n`);
                clearInterval(timer);
                resolve();
            }
        }, 1000);
    });
}

// ── 主流程 ──────────────────────────────────────────────
async function startRecording(options) {
    checkFfmpeg();

    const platform = getPlatform();
    const outputDir = resolveOutputDir(options.output);

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 功能1：交互式文件名（除非用户传了 --name 跳过交互）
    let baseName;
    if (options.name) {
        baseName = options.name.replace(/[\\/:*?"<>|]/g, '_');
    } else if (options.yes) {
        // --yes 跳过所有交互，直接用默认时间戳名
        baseName = `recording_${getTimestamp()}`;
    } else {
        baseName = await promptFileName();
    }

    // 功能2：重名检测
    let outputFile;
    if (options.yes) {
        // --yes 模式下不交互，直接 auto-rename 避免覆盖
        outputFile = path.join(outputDir, `${baseName}.mp4`);
        if (fs.existsSync(outputFile)) {
            let i = 1;
            let candidate;
            do {
                candidate = `${baseName}_${i}`;
                i++;
            } while (fs.existsSync(path.join(outputDir, `${candidate}.mp4`)));
            outputFile = path.join(outputDir, `${candidate}.mp4`);
        }
    } else {
        outputFile = await resolveUniqueOutputFile(outputDir, baseName);
    }

    let ffmpegArgs = [];
    if (platform === 'win32') {
        ffmpegArgs = buildWindowsArgs(options, outputFile);
    } else if (platform === 'darwin') {
        ffmpegArgs = buildMacArgs(options, outputFile);
    } else {
        ffmpegArgs = buildLinuxArgs(options, outputFile);
    }

    console.log(`${GREEN}[screenrec] Output file: ${outputFile}${RESET}`);

    // 功能3：倒计时（除非 --no-countdown 或 --yes）
    const countdownSeconds = options.countdown !== undefined ? parseInt(options.countdown, 10) : 3;
    if (!options.yes && countdownSeconds > 0) {
        await countdown(countdownSeconds);
    }

    console.log(`${GREEN}[screenrec] Recording started.${RESET}`);
    console.log(`${YELLOW}[screenrec] Press Ctrl+C to stop recording.${RESET}`);

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
    const config = readConfig();
    const framerate = options.framerate || '30';
    const systemAudio = options.system || config.systemDevice || 'virtual-audio-capturer';
    const micAudio    = options.mic    || config.micDevice;

    if (!micAudio && options.audio !== false) {
        console.log(`${YELLOW}[screenrec] Tip: No mic device configured.`);
        console.log(`  Run "screenrec devices" to list devices, then "screenrec set-device" to save.${RESET}`);
    }

    const videoInputArgs = ['-f', 'gdigrab', '-framerate', framerate, '-i', 'desktop'];

    if (options.audio === false) {
        return [...videoInputArgs, ...VIDEO_CODEC_ARGS, outputFile];
    }

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
