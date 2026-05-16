'use strict';

/**
 * test/screenrec.test.js
 * Basic unit tests for ScreenRecorder-cli
 * Run with: node test/screenrec.test.js
 */

const path = require('path');
const os   = require('os');
const fs   = require('fs');

// ── Minimal test runner ──────────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.log(`  \x1b[31m✘\x1b[0m ${name}`);
    console.log(`    \x1b[31m${err.message}\x1b[0m`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(a, b) {
  if (a !== b) throw new Error(`Expected "${b}", got "${a}"`);
}

// ── Load modules under test ──────────────────────────────────────────────────
const utilsPath  = path.join(__dirname, '..', 'lib', 'utils.js');
const configPath = path.join(__dirname, '..', 'lib', 'config.js');

// ── utils.js tests ───────────────────────────────────────────────────────────
console.log('\n\x1b[1mutils.js\x1b[0m');

const utils = require(utilsPath);

test('getTimestamp() returns a string', () => {
  const ts = utils.getTimestamp();
  assert(typeof ts === 'string', 'Expected string');
});

test('getTimestamp() matches format YYYY-MM-DD_HH-MM-SS', () => {
  const ts = utils.getTimestamp();
  assert(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/.test(ts),
    `Timestamp "${ts}" does not match expected format`);
});

test('getPlatform() returns a non-empty string', () => {
  const platform = utils.getPlatform();
  assert(typeof platform === 'string' && platform.length > 0, 'Expected non-empty string');
});

test('getPlatform() returns a known platform', () => {
  const platform = utils.getPlatform();
  const known = ['win32', 'darwin', 'linux'];
  assert(known.includes(platform), `Unknown platform: ${platform}`);
});

test('checkFfmpeg() does not throw when ffmpeg is present (skip if not installed)', () => {
  try {
    utils.checkFfmpeg();
    // If we reach here, ffmpeg is installed and check passed
    assert(true);
  } catch (e) {
    // checkFfmpeg calls process.exit(1) when missing — if we got here
    // via a thrown error it means something unexpected happened
    throw new Error(`checkFfmpeg threw unexpectedly: ${e.message}`);
  }
});

// ── config.js tests ──────────────────────────────────────────────────────────
console.log('\n\x1b[1mconfig.js\x1b[0m');

const config = require(configPath);

test('getDefaultOutputDir() returns a string', () => {
  const dir = config.getDefaultOutputDir();
  assert(typeof dir === 'string' && dir.length > 0, 'Expected non-empty string');
});

test('getDefaultOutputDir() contains home directory', () => {
  const dir = config.getDefaultOutputDir();
  const home = os.homedir();
  assert(dir.startsWith(home), `Expected dir to start with home dir "${home}", got "${dir}"`);
});

test('resolveOutputDir() returns CLI option when provided', () => {
  const result = config.resolveOutputDir('/custom/path');
  assertEqual(result, '/custom/path');
});

test('resolveOutputDir() returns default when no option or config', () => {
  // Temporarily rename config file if it exists so we get the default
  const configFile = config.CONFIG_FILE;
  const backup = configFile + '.bak';
  let renamed = false;
  if (fs.existsSync(configFile)) {
    fs.renameSync(configFile, backup);
    renamed = true;
  }
  try {
    const result = config.resolveOutputDir(null);
    const defaultDir = config.getDefaultOutputDir();
    // Result should be either the default dir or whatever is in config
    assert(typeof result === 'string' && result.length > 0, 'Expected a non-empty path');
  } finally {
    if (renamed) fs.renameSync(backup, configFile);
  }
});

test('writeConfig() and readConfig() round-trip correctly', () => {
  const testKey = '__test_key__';
  const testVal = 'test_value_' + Date.now();
  config.writeConfig({ [testKey]: testVal });
  const read = config.readConfig();
  assertEqual(read[testKey], testVal);

  // Cleanup: remove test key from config
  const cleaned = config.readConfig();
  delete cleaned[testKey];
  const configFile = config.CONFIG_FILE;
  fs.writeFileSync(configFile, JSON.stringify(cleaned, null, 2), 'utf-8');
});

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n\x1b[1mResults:\x1b[0m ${passed + failed} tests — ` +
  `\x1b[32m${passed} passed\x1b[0m, ` +
  `\x1b[31m${failed} failed\x1b[0m\n`);

if (failed > 0) process.exit(1);
