#!/usr/bin/env node
'use strict';

const { program }    = require('commander');
const { startRecording } = require('./lib/recorder');
const { listDevices }    = require('./lib/devices');
const { writeConfig, readConfig, getDefaultOutputDir, CONFIG_FILE } = require('./lib/config');
const fs   = require('fs');
const path = require('path');
const pkg  = require('./package.json');

const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

program
    .name('screenrec')
    .description('CLI screen recorder powered by ffmpeg')
    .version(pkg.version, '-v, --version', 'Print version number');

// ── start 命令（默认命令）──────────────────────────────
program
    .command('start', { isDefault: true })
    .description('Start screen recording')
    .option('-o, --output <dir>', 'Output directory (overrides saved config)')
    .option('-r, --framerate <fps>', 'Frame rate', '30')
    .option('--no-audio', 'Disable audio recording')
    .option('--mic <name>', 'Microphone device name')
    .option('--system <name>', 'System audio device name')
    .action((options) => {
        startRecording(options);
    });

// ── set-output 命令：永久保存输出路径 ──────────────────
program
    .command('set-output [dir]')
    .description('Set default output directory (saved to config file)')
    .action((dir) => {
        let targetDir = dir;

        // 没有传参数 → 交互式输入
        if (!targetDir) {
            const readline = require('readline');
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            const defaultDir = getDefaultOutputDir();
            rl.question(
                `${CYAN}Enter output directory path\n  (leave blank to use default: ${defaultDir})\n> ${RESET}`,
                (answer) => {
                    rl.close();
                    const resolved = answer.trim() || defaultDir;
                    saveOutputDir(resolved);
                }
            );
            return;
        }

        saveOutputDir(targetDir);
    });

function saveOutputDir(dir) {
    const resolved = path.resolve(dir); // 转为绝对路径
    // 路径不存在时自动创建
    if (!fs.existsSync(resolved)) {
        fs.mkdirSync(resolved, { recursive: true });
        console.log(`${YELLOW}  Directory created: ${resolved}${RESET}`);
    }
    writeConfig({ outputDir: resolved });
    console.log(`${GREEN}${BOLD}✔ Default output directory saved:${RESET}`);
    console.log(`  ${resolved}`);
    console.log(`${YELLOW}  This will be used for all future recordings.${RESET}`);
    console.log(`  Run ${BOLD}screenrec start${RESET} to begin recording.`);
}

// ── show-config 命令：查看当前配置 ─────────────────────
program
    .command('show-config')
    .description('Show current configuration and output directory')
    .action(() => {
        const config  = readConfig();
        const current = config.outputDir || `${getDefaultOutputDir()} ${YELLOW}(default)${RESET}`;
        console.log('');
        console.log(`${CYAN}${BOLD}Current Configuration${RESET}`);
        console.log(`  Config file:    ${CONFIG_FILE}`);
        console.log(`  Output dir:     ${current}`);
        console.log('');
    });

// ── devices 命令 ──────────────────────────────────────
program
    .command('devices')
    .description('List available audio input devices')
    .action(() => { listDevices(); });

program.parse(process.argv);