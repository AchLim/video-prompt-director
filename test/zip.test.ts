import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { validateSkillDir } from "../src/frontmatter.ts";
import { listFiles } from "../src/manifest.ts";
import { crc32 } from "../src/zip.ts";
import { PKG, runCli, SKILL_SRC, tmpDir } from "./helpers.ts";

const hasUnzip = spawnSync("unzip", ["-v"]).status === 0;

describe("Claude.ai ZIP export", () => {
  it("crc32 matches the standard check value", () => {
    assert.equal(crc32(Buffer.from("123456789")), 0xcbf43926);
  });

  const home = tmpDir();
  const out = path.join(home, "release");
  const r = runCli(["export-zip", "--out", out], { home });
  const zipFile = path.join(out, `video-prompt-director-${PKG.version}.zip`);

  it("writes a versioned zip", () => {
    assert.equal(r.code, 0, r.out);
    assert.ok(readFileSync(zipFile).length > 1000);
  });

  it("is a valid archive with the skill folder at its root", { skip: !hasUnzip && "unzip not available" }, () => {
    const test = spawnSync("unzip", ["-t", zipFile], { encoding: "utf8" });
    assert.equal(test.status, 0, test.stdout + test.stderr);
    const names = spawnSync("unzip", ["-Z1", zipFile], { encoding: "utf8" }).stdout.trim().split("\n");
    assert.ok(names.every((n) => n.startsWith("video-prompt-director/")), "everything inside video-prompt-director/");
    for (const f of listFiles(SKILL_SRC)) assert.ok(names.includes(`video-prompt-director/${f}`), `missing ${f}`);
    assert.ok(!names.some((n) => n.includes(".video-prompt-director-install.json")), "no install record in the zip");
  });

  it("extracts to a valid skill with open-standard frontmatter only", { skip: !hasUnzip && "unzip not available" }, () => {
    const dest = tmpDir();
    assert.equal(spawnSync("unzip", ["-q", zipFile, "-d", dest]).status, 0);
    const dir = path.join(dest, "video-prompt-director");
    const v = validateSkillDir(dir);
    assert.deepEqual(v.errors, []);
    assert.equal(v.skill?.data.when_to_use, undefined);
    for (const f of listFiles(SKILL_SRC).filter((f) => f !== "SKILL.md")) {
      assert.deepEqual(readFileSync(path.join(dir, f)), readFileSync(path.join(SKILL_SRC, f)), f);
    }
  });
});
