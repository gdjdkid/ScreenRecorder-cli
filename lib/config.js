'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// 配置文件存放位置：C:\Users\用户名\.config\screenrec\config.json
const CONFIG_DIR  = path.join(os.homedir(), '.config', 'screenrec');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function readConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) return {};
        return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
        return {};
    }
}

function writeConfig(data) {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    const current = readConfig();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ ...current, ...data }, null, 2), 'utf-8');
}

// 获取默认输出路径：C:\Users\用户名\Videos\ScreenRecords
function getDefaultOutputDir() {
    return path.join(os.homedir(), 'Videos', 'ScreenRecords');
}

// 获取最终输出路径（三级优先级）
function resolveOutputDir(cliOption) {
    if (cliOption) return cliOption;              // 1. 命令行 -o 参数
    const config = readConfig();
    if (config.outputDir) return config.outputDir; // 2. 配置文件中保存的路径
    return getDefaultOutputDir();                  // 3. 系统默认路径
}

module.exports = { readConfig, writeConfig, resolveOutputDir, getDefaultOutputDir, CONFIG_FILE };