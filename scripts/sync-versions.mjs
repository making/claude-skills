#!/usr/bin/env node
// Derives each plugin version from git history and writes it into
// .claude-plugin/marketplace.json and each plugin's .claude-plugin/plugin.json.
//
//   version = <major>.<minor>.<number of commits touching the plugin directory>
//
// MAJOR/MINOR are hand-maintained in each plugin.json; PATCH is computed, so the
// result is idempotent: running this twice on the same commit yields the same
// versions. Commits that only touch <plugin>/.claude-plugin/ are excluded from
// the count so that version syncing itself never bumps a version.
//
// Usage:
//   node scripts/sync-versions.mjs           # rewrite files in place
//   node scripts/sync-versions.mjs --check   # exit 1 if anything is out of date

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const marketplacePath = join(repoRoot, '.claude-plugin', 'marketplace.json');
const checkOnly = process.argv.includes('--check');

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

// Rewrites only the version literal so the rest of the file keeps its original
// formatting. Falls back to re-serializing when there is no version field yet.
function writeVersion(path, json, version) {
	const text = readFileSync(path, 'utf8');
	const replaced = text.replace(/("version"\s*:\s*)"[^"]*"/, `$1"${version}"`);
	if (replaced === text) {
		writeJson(path, { ...json, version });
		return;
	}
	writeFileSync(path, replaced);
}

function commitCount(dir) {
	const out = execFileSync(
		'git',
		['rev-list', '--count', 'HEAD', '--', dir, `:(exclude)${dir}/.claude-plugin/`],
		{ cwd: repoRoot, encoding: 'utf8' },
	);
	return Number.parseInt(out.trim(), 10);
}

function baseVersion(...candidates) {
	for (const candidate of candidates) {
		const match = /^(\d+)\.(\d+)\./.exec(candidate ?? '');
		if (match) {
			return `${match[1]}.${match[2]}`;
		}
	}
	return '1.0';
}

const marketplace = readJson(marketplacePath);
const outdated = [];
let marketplaceChanged = false;

for (const plugin of marketplace.plugins) {
	const dir = plugin.source.replace(/^\.\//, '').replace(/\/$/, '');
	const pluginJsonPath = join(repoRoot, dir, '.claude-plugin', 'plugin.json');
	const pluginJson = existsSync(pluginJsonPath) ? readJson(pluginJsonPath) : null;

	const version = `${baseVersion(pluginJson?.version, plugin.version)}.${commitCount(dir)}`;

	if (plugin.version !== version) {
		outdated.push(`marketplace.json: ${plugin.name} ${plugin.version} -> ${version}`);
		plugin.version = version;
		marketplaceChanged = true;
	}
	if (pluginJson && pluginJson.version !== version) {
		outdated.push(`${dir}/.claude-plugin/plugin.json: ${pluginJson.version} -> ${version}`);
		if (!checkOnly) {
			writeVersion(pluginJsonPath, pluginJson, version);
		}
	}
}

if (marketplaceChanged && !checkOnly) {
	writeJson(marketplacePath, marketplace);
}

if (outdated.length === 0) {
	console.log('All plugin versions are up to date.');
	process.exit(0);
}

console.log(outdated.join('\n'));
if (checkOnly) {
	console.error('\nVersions are out of date. Run: node scripts/sync-versions.mjs');
	process.exit(1);
}
