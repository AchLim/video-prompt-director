import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { it } from "node:test";
import { SKILL_SRC } from "./helpers.ts";

const script = path.join(SKILL_SRC, "scripts", "count_prompt.py");
const pythonAvailable = spawnSync("python3", ["--version"], { encoding: "utf8" }).status === 0;

it("counts the actual prompt including a final newline and enforces the interface limit", { skip: !pythonAvailable }, () => {
  const r = spawnSync("python3", [script, "--json", "--platform-limit", "3"], { input: "abc\n", encoding: "utf8" });
  assert.equal(r.status, 1, r.stderr);
  const report = JSON.parse(r.stdout);
  assert.equal(report.counts.characters, 4);
  assert.equal(report.over_platform_limit, true);
});

it("counts supplementary Han characters and rejects invalid limits", { skip: !pythonAvailable }, () => {
  const r = spawnSync("python3", [script, "--json", "--lang", "zh"], { input: "中𰀀", encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(JSON.parse(r.stdout).counts.chinese_characters, 2);
  const invalid = spawnSync("python3", [script, "--platform-limit", "0"], { input: "x", encoding: "utf8" });
  assert.equal(invalid.status, 2);
});
