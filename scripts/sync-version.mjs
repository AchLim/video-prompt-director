// Copies package.json's version into every file that states it, so a release bumps one number.
// Runs from the npm "version" lifecycle script; `--check` fails instead of writing.
import { readFileSync, writeFileSync } from "node:fs";

const check = process.argv.includes("--check");
const { version } = JSON.parse(readFileSync("package.json", "utf8"));

const targets = [
  ["plugins/video-prompt-director/skills/video-prompt-director/VERSION", () => `${version}\n`],
  ["plugins/video-prompt-director/skills/video-prompt-director/SKILL.md", (s) => s.replace(/^( {2}version: )"[^"\n]*"$/m, `$1"${version}"`)],
  ["plugins/video-prompt-director/.claude-plugin/plugin.json", (s) => s.replace(/("version": )"[^"]*"/, `$1"${version}"`)],
  [".claude-plugin/marketplace.json", (s) => s.replace(/("version": )"[^"]*"/, `$1"${version}"`)],
];

let stale = 0;
for (const [file, update] of targets) {
  // Compare without CRLF so a Windows checkout doesn't count as out of date.
  const before = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const after = update(before);
  if (before === after) continue;
  stale++;
  if (check) console.error(`${file} does not say ${version}`);
  else writeFileSync(file, after);
}
if (check && stale) process.exit(1);
console.log(check ? `All files say ${version}.` : `Version ${version} written to ${stale} file(s).`);
