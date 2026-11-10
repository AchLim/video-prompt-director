// npm package contents, plus a real end-to-end install from the packed tarball.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { listFiles } from "../src/manifest.ts";
import { PKG, ROOT, SKILL_SRC, tmpDir } from "./helpers.ts";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

describe("npm package", () => {
  const packed = JSON.parse(execFileSync(npm, ["pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: ROOT, encoding: "utf8", shell: process.platform === "win32" })) as [
    { files: { path: string }[]; name: string; version: string },
  ];
  const files = packed[0].files.map((f) => f.path);

  it("has the expected name and version", () => {
    assert.equal(packed[0].name, PKG.name);
    assert.equal(packed[0].version, PKG.version);
  });

  it("ships the CLI, the whole skill, and the docs", () => {
    for (const f of ["dist/cli.js", "package.json", "README.md", "CHANGELOG.md", "LICENSE"]) assert.ok(files.includes(f), f);
    for (const f of listFiles(SKILL_SRC)) assert.ok(files.includes(`plugins/video-prompt-director/skills/video-prompt-director/${f}`), f);
  });

  it("does not ship sources, tests, evals, or build leftovers", () => {
    const bad = files.filter((f) => /^(src|test|evals|scripts|release|node_modules)\//.test(f) || f.endsWith(".tgz") || f.includes(".video-prompt-director-install.json"));
    assert.deepEqual(bad, []);
  });

  it("CLI entry has a node shebang and bin points at it", () => {
    assert.ok(readFileSync(path.join(ROOT, "dist", "cli.js"), "utf8").startsWith("#!/usr/bin/env node"));
    const pkg = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
    assert.equal(pkg.bin["video-prompt-director"], "dist/cli.js");
    assert.equal(pkg.publishConfig.access, "public");
    assert.equal(pkg.scripts.postinstall, undefined, "no postinstall that touches user folders");
    assert.deepEqual(pkg.dependencies ?? {}, {}, "no runtime dependencies");
  });
});

describe("end-to-end from the packed tarball", { skip: process.platform === "win32" && "covered by unit tests on Windows" }, () => {
  const work = tmpDir("vpd-e2e-");
  const tgzName = execFileSync(npm, ["pack", "--ignore-scripts", "--pack-destination", work], { cwd: ROOT, encoding: "utf8" }).trim().split("\n").pop() as string;
  const tgz = path.join(work, tgzName);
  const env = { ...process.env, HOME: work, npm_config_cache: path.join(work, ".npm-cache"), npm_config_update_notifier: "false" };

  it("npm install -g, then video-prompt-director install --global", () => {
    const prefix = path.join(work, "prefix");
    const r = spawnSync(npm, ["install", "-g", "--prefix", prefix, "--no-audit", "--no-fund", tgz], { env, encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    const bin = path.join(prefix, "bin", "video-prompt-director");
    assert.ok(existsSync(bin));
    const run = spawnSync(bin, ["install", "--global"], { env, encoding: "utf8" });
    assert.equal(run.status, 0, run.stdout + run.stderr);
    assert.ok(existsSync(path.join(work, ".claude", "skills", "video-prompt-director", "SKILL.md")));
    assert.ok(existsSync(path.join(work, ".claude", "skills", "video-prompt-director", "references", "continuity.md")));
    const doctor = spawnSync(bin, ["doctor", "--global"], { env, encoding: "utf8" });
    assert.equal(doctor.status, 0, doctor.stdout);
  });

  it("npx-style one-off run (npm exec --package <tarball>)", () => {
    const home = tmpDir("vpd-npx-");
    const r = spawnSync(npm, ["exec", "--yes", "--package", tgz, "--", "video-prompt-director", "install", "--global"], {
      cwd: home, env: { ...env, HOME: home }, encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.ok(existsSync(path.join(home, ".claude", "skills", "video-prompt-director", "SKILL.md")));
  });
});
