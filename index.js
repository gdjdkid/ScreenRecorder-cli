#!/usr/bin/env node
'use strict';

const { program }    = require('commander');
const readline       = require('readline');
const fs             = require('fs');
const path           = require('path');
const { startRecording } = require('./lib/recorder');
const { listDevices }    = require('./lib/devices');
const { writeConfig, readConfig, getDefaultOutputDir, CONFIG_FILE } = require('./lib/config');
const pkg = require('./package.json');

const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN   = '\x1b[36m';
const RED    = '\x1b[31m';
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';

program
    .name('screenrec')
    .description('CLI screen recorder powered by ffmpeg')
    .version(pkg.version, '-v, --version', 'Print version number');

// ── start 命令 ─────────────────────────────────────────
program
    .command('start', { isDefault: true })
    .description('Start screen recording')
    .option('-o, --output <dir>', 'Output directory (overrides saved config)')
    .option('-r, --framerate <fps>', 'Frame rate', '30')
    .option('--no-audio', 'Disable audio recording')
    .option('--mic <name>', 'Microphone device name (overrides saved config)')
    .option('--system <name>', 'System audio device name (overrides saved config)')
    .option('-n, --name <name>', 'File name (without extension); skips the interactive prompt')
    .option('-c, --countdown <seconds>', 'Countdown seconds before recording starts (default: 3, use 0 to disable)')
    .option('--no-countdown', 'Skip the countdown entirely')
    .option('-y, --yes', 'Skip all prompts (uses default name, countdown, and auto-renames on conflict)')
    .action((options) => {
        // commander 的 --no-countdown 会把 options.countdown 设为 false
        if (options.countdown === false) {
            options.countdown = '0';
        }
        startRecording(options).catch((err) => {
            console.error(`${RED}[screenrec] Error: ${err.message}${RESET}`);
            process.exit(1);
        });
    });

// ── set-output 命令 ────────────────────────────────────
program
    .command('set-output [dir]')
    .description('Set default output directory (saved to config file)')
    .action((dir) => {
        if (!dir) {
            const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
            const defaultDir = getDefaultOutputDir();
            rl.question(
                `${CYAN}Enter output directory path\n  (leave blank to use default: ${defaultDir})\n> ${RESET}`,
                (answer) => {
                    rl.close();
                    saveOutputDir(answer.trim() || defaultDir);
                }
            );
            return;
        }
        saveOutputDir(dir);
    });

function saveOutputDir(dir) {
    const resolved = path.resolve(dir);
    if (!fs.existsSync(resolved)) {
        fs.mkdirSync(resolved, { recursive: true });
        console.log(`${YELLOW}  Directory created: ${resolved}${RESET}`);
    }
    writeConfig({ outputDir: resolved });
    console.log(`${GREEN}${BOLD}✔ Default output directory saved:${RESET}`);
    console.log(`  ${resolved}`);
    console.log(`${YELLOW}  Run ${BOLD}screenrec start${RESET}${YELLOW} to begin recording.${RESET}`);
}

// ── set-device 命令 ────────────────────────────────────
program
    .command('set-device')
    .description('Configure and save audio device names to config')
    .option('--mic <name>',    'Microphone device name')
    .option('--system <name>', 'System audio device name')
    .action((options) => {
        if (options.mic || options.system) {
            const toSave = {};
            if (options.mic)    toSave.micDevice    = options.mic;
            if (options.system) toSave.systemDevice = options.system;
            writeConfig(toSave);
            if (options.mic)    console.log(`${GREEN}✔ Mic device saved:    ${options.mic}${RESET}`);
            if (options.system) console.log(`${GREEN}✔ System audio saved:  ${options.system}${RESET}`);
            return;
        }

        const current = readConfig();
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

        console.log(`${CYAN}${BOLD}Configure audio devices${RESET}`);
        console.log(`${YELLOW}  Tip: Run "screenrec devices" first to see available device names.${RESET}\n`);

        rl.question(
            `Microphone device name\n  (current: ${current.micDevice || 'not set'})\n> `,
            (mic) => {
                rl.question(
                    `System audio device name\n  (current: ${current.systemDevice || 'virtual-audio-capturer'})\n> `,
                    (system) => {
                        rl.close();
                        const toSave = {};
                        if (mic.trim())    toSave.micDevice    = mic.trim();
                        if (system.trim()) toSave.systemDevice = system.trim();

                        if (Object.keys(toSave).length === 0) {
                            console.log(`${YELLOW}  No changes made.${RESET}`);
                            return;
                        }
                        writeConfig(toSave);
                        console.log(`\n${GREEN}${BOLD}✔ Device config saved.${RESET}`);
                        if (toSave.micDevice)    console.log(`  Mic:    ${toSave.micDevice}`);
                        if (toSave.systemDevice) console.log(`  System: ${toSave.systemDevice}`);
                    }
                );
            }
        );
    });

// ── show-config 命令 ───────────────────────────────────
program
    .command('show-config')
    .description('Show current configuration')
    .action(() => {
        const config  = readConfig();
        const outputDir = config.outputDir || `${getDefaultOutputDir()} ${YELLOW}(default)${RESET}`;
        console.log('');
        console.log(`${CYAN}${BOLD}Current Configuration${RESET}`);
        console.log(`  Config file:    ${CONFIG_FILE}`);
        console.log(`  Output dir:     ${outputDir}`);
        console.log(`  Mic device:     ${config.micDevice    || `${YELLOW}not set${RESET}`}`);
        console.log(`  System audio:   ${config.systemDevice || `${YELLOW}virtual-audio-capturer (default)${RESET}`}`);
        console.log('');
    });

// ── devices 命令 ──────────────────────────────────────
program
    .command('devices')
    .description('List available audio input devices')
    .action(() => { listDevices(); });

program.parse(process.argv);
