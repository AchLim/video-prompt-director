// Repository consistency: versions, generated files, plugin manifests, and copy rules.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { parseSkill } from "../src/frontmatter.ts";
import { PKG, ROOT, SKILL_SRC } from "./helpers.ts";

const read = (rel: string): string => readFileSync(path.join(ROOT, rel), "utf8");
const json = (rel: string): Record<string, any> => JSON.parse(read(rel));

describe("one version everywhere", () => {
  it("VERSION, SKILL.md and both plugin manifests match package.json", () => {
    assert.equal(read("plugins/video-prompt-director/skills/video-prompt-director/VERSION").trim(), PKG.version);
    assert.equal((parseSkill(read("plugins/video-prompt-director/skills/video-prompt-director/SKILL.md")).data.metadata as Record<string, string>).version, PKG.version);
    assert.equal(json("plugins/video-prompt-director/.claude-plugin/plugin.json").version, PKG.version);
    assert.equal(json(".claude-plugin/marketplace.json").plugins[0].version, PKG.version);
  });

  it("the CHANGELOG has an entry for this version", () => {
    assert.match(read("CHANGELOG.md"), new RegExp(`## \\[${PKG.version.replace(/\./g, "\\.")}\\]`));
  });
});

describe("generated files", () => {
  it("video-prompt-director.md is up to date with SKILL.md", () => {
    const r = spawnSync(process.execPath, ["scripts/build-single-file.mjs", "--check"], { cwd: ROOT, encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
  });
});

describe("Claude Code plugin", () => {
  const PLUGIN_DIR = path.join(ROOT, "plugins", "video-prompt-director");
  const plugin = json("plugins/video-prompt-director/.claude-plugin/plugin.json");
  const market = json(".claude-plugin/marketplace.json");

  it("plugin and marketplace agree on name and description", () => {
    assert.equal(plugin.name, "video-prompt-director");
    assert.equal(market.plugins[0].name, plugin.name);
    assert.equal(market.plugins[0].source, "./plugins/video-prompt-director");
    assert.equal(market.plugins[0].description, plugin.description);
  });

  it("the plugin's skills path holds exactly the video-prompt-director skill", () => {
    const dir = path.join(PLUGIN_DIR, plugin.skills[0]);
    const skills = readdirSync(dir).filter((d) => existsSync(path.join(dir, d, "SKILL.md")));
    assert.deepEqual(skills, ["video-prompt-director"]);
    assert.equal(path.join(dir, "video-prompt-director"), SKILL_SRC);
  });

  it("the icon is a square PNG of 512 to 2048 px under 2 MB, as the plugin directory requires", () => {
    const png = readFileSync(path.join(PLUGIN_DIR, plugin.icon));
    assert.equal(png.subarray(1, 4).toString("latin1"), "PNG");
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.equal(width, height);
    assert.ok(width >= 512 && width <= 2048, String(width));
    assert.ok(png.length < 2 * 1024 * 1024);
  });

  it("local agent tooling is kept out of git, so installs from the repo carry only this skill", () => {
    const ignore = read(".gitignore");
    for (const entry of [".agents/", ".claude/", "skills-lock.json"]) assert.ok(ignore.includes(entry), entry);
  });
});

describe("copy rules", () => {
  // antislop R-02: no em dashes in text this project writes. Generated eval output is excluded.
  const EM_DASH = String.fromCharCode(0x2014);
  const skip = new Set(["node_modules", "dist", "release", "results", ".git", ".agents", ".claude"]);
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (skip.has(e.name)) continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) walk(abs);
      else if (/\.(md|ts|mjs|json|yml)$/.test(e.name) && e.name !== "package-lock.json") files.push(abs);
    }
  };
  walk(ROOT);

  it("no em dash appears in any project file", () => {
    const hits = files.filter((f) => readFileSync(f, "utf8").includes(EM_DASH)).map((f) => path.relative(ROOT, f));
    assert.deepEqual(hits, []);
  });
});
