import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const fail = (message) => {
  throw new Error(`cinder-grove: ${message}`);
};

const manifest = readJson('package.json');
const contribution = manifest.contributes?.themes?.[0];

if (manifest.name !== 'cinder-grove' || manifest.publisher !== 'aileks') {
  fail('extension id must remain aileks.cinder-grove');
}
if (manifest.version !== '1.0.0') {
  fail('initial release must remain 1.0.0');
}
if (manifest.main || manifest.browser || manifest.activationEvents) {
  fail('theme must remain contribution-only');
}
if (!contribution || contribution.uiTheme !== 'vs-dark') {
  fail('one dark theme contribution is required');
}

const themePath = contribution.path.replace(/^\.\//, '');
if (!existsSync(new URL(themePath, root))) {
  fail(`missing theme file ${themePath}`);
}
if (!existsSync(new URL(manifest.icon, root))) {
  fail(`missing icon ${manifest.icon}`);
}

const theme = readJson(themePath);
if (theme.name !== 'Cinder Grove' || theme.type !== 'dark') {
  fail('theme identity or type is invalid');
}
if (theme.semanticHighlighting !== true) {
  fail('semantic highlighting must be enabled');
}

const primary = '#E17A3F';
const secondary = '#879B5C';
const info = '#6785A1';
const focusedSurface = '#34312D';
const secondaryText = '#ACA49B';
if (theme.colors.focusBorder !== info) {
  fail('informational blue must keep global focus boundaries readable and restrained');
}
if (theme.colors['activityBar.activeBorder'] !== secondary) {
  fail('grove green must drive workspace navigation accents');
}
for (const key of [
  'commandCenter.background',
  'commandCenter.activeBackground',
  'commandCenter.debuggingBackground',
  'agentStatusIndicator.background'
]) {
  if (theme.colors[key] !== focusedSurface) fail(`${key} must use the neutral focused surface`);
}
for (const key of [
  'commandCenter.foreground',
  'commandCenter.activeForeground',
  'commandCenter.inactiveForeground'
]) {
  if (theme.colors[key] !== secondaryText) fail(`${key} must use secondary text`);
}
if (theme.colors['statusBar.debuggingBackground'] !== focusedSurface) {
  fail('debug color fallback must remain neutral');
}
if (theme.colors['gitDecoration.addedResourceForeground'] !== secondary) {
  fail('secondary grove green must drive additions');
}
if (theme.semanticTokenColors.string !== primary) {
  fail('semantic strings must use primary cinder orange');
}
if (theme.semanticTokenColors.operator !== secondary) {
  fail('semantic operators must use secondary grove green');
}

const requiredColors = [
  'editor.background',
  'editor.foreground',
  'activityBar.background',
  'sideBar.background',
  'statusBar.background',
  'panel.background',
  'editorWidget.background',
  'gitDecoration.addedResourceForeground',
  'diffEditor.insertedLineBackground',
  'chat.requestBubbleBackground',
  'agentsPanel.background'
];
for (const key of requiredColors) {
  if (!theme.colors[key]) fail(`missing required color ${key}`);
}

const ansiNames = [
  'Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White',
  'BrightBlack', 'BrightRed', 'BrightGreen', 'BrightYellow',
  'BrightBlue', 'BrightMagenta', 'BrightCyan', 'BrightWhite'
];
for (const name of ansiNames) {
  const key = `terminal.ansi${name}`;
  if (!theme.colors[key]) fail(`missing terminal color ${key}`);
}

const hex = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
const validateColor = (value, location) => {
  if (typeof value === 'string' && value.startsWith('#') && !hex.test(value)) {
    fail(`invalid color ${value} at ${location}`);
  }
};

for (const [key, value] of Object.entries(theme.colors)) {
  validateColor(value, `colors.${key}`);
}
for (const [index, rule] of theme.tokenColors.entries()) {
  validateColor(rule.settings?.foreground, `tokenColors[${index}].foreground`);
  validateColor(rule.settings?.background, `tokenColors[${index}].background`);
}
for (const [selector, style] of Object.entries(theme.semanticTokenColors)) {
  if (typeof style === 'string') validateColor(style, `semanticTokenColors.${selector}`);
  else validateColor(style.foreground, `semanticTokenColors.${selector}.foreground`);
}

const relativeLuminance = (color) => {
  const channels = [1, 3, 5]
    .map((index) => Number.parseInt(color.slice(index, index + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
const contrastRatio = (foreground, background) => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
};
const editorBackground = theme.colors['editor.background'];
const readableUiColors = [
  'editorLineNumber.foreground',
  'editorCodeLens.foreground',
  'editorGhostText.foreground'
];
for (const key of readableUiColors) {
  if (contrastRatio(theme.colors[key], editorBackground) < 4.5) {
    fail(`${key} must meet 4.5:1 contrast against the editor background`);
  }
}
for (const name of ['Comments', 'Punctuation', 'Brackets']) {
  const rule = theme.tokenColors.find((candidate) => candidate.name === name);
  if (!rule || contrastRatio(rule.settings.foreground, editorBackground) < 4.5) {
    fail(`${name.toLowerCase()} must meet 4.5:1 contrast against the editor background`);
  }
}
if (contrastRatio(
  theme.colors['commandCenter.foreground'],
  theme.colors['commandCenter.debuggingBackground']
) < 4.5) {
  fail('command center text must remain readable while debugging');
}

const palette = [
  '#131210', '#1B1916', '#23201C', '#58534C', '#9A938A', '#ACA49B', '#BBB3A9', '#DDD5CA',
  '#E17A3F', '#879B5C', '#B34A45', '#D9A441', '#6785A1', '#9A788F', '#58918C'
];
const serializedTheme = JSON.stringify(theme).toUpperCase();
for (const color of palette) {
  if (!serializedTheme.includes(color)) fail(`canonical palette color ${color} must be represented`);
}

const ignored = new Set(['.git', 'node_modules']);
const findSvg = (path) => {
  for (const name of readdirSync(path)) {
    if (ignored.has(name)) continue;
    const child = join(path, name);
    if (statSync(child).isDirectory()) findSvg(child);
    else if (name.toLowerCase().endsWith('.svg')) fail(`SVG files cannot ship: ${child}`);
  }
};
findSvg(fileURLToPath(root));

console.log('cinder-grove: theme validation passed');
