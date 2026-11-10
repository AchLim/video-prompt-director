import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findProjectRoot, globalSkillsDir, isClaudeSkillsDir, resolveAllTargets, resolveSingleTarget, UsageError, type PathEnv,
} from "../src/paths.ts";

function env(over: Partial<PathEnv> & { existing?: string[] }): PathEnv {
  const existing = new Set(over.existing ?? []);
  return {
    home: over.home ?? "/home/ana",
    cwd: over.cwd ?? "/home/ana/work/series/ep1",
    platform: over.platform ?? "linux",
    exists: over.exists ?? ((p) => existing.has(p)),
  };
}

describe("platform-specific paths", () => {
  it("Linux / macOS global dir is ~/.claude/skills", () => {
    assert.equal(globalSkillsDir(env({ home: "/home/ana" })), "/home/ana/.claude/skills");
    assert.equal(globalSkillsDir(env({ home: "/Users/ana", platform: "darwin" })), "/Users/ana/.claude/skills");
  });

  it("Windows global dir is %USERPROFILE%\\.claude\\skills", () => {
    const e = env({ home: "C:\\Users\\Ana", cwd: "C:\\Users\\Ana\\work", platform: "win32" });
    assert.equal(globalSkillsDir(e), "C:\\Users\\Ana\\.claude\\skills");
    assert.equal(resolveSingleTarget({ global: true }, e).skillDir, "C:\\Users\\Ana\\.claude\\skills\\video-prompt-director");
  });

  it("Windows project root walks up to the folder containing .git", () => {
    const e = env({ home: "C:\\Users\\Ana", cwd: "D:\\code\\show\\scripts", platform: "win32", existing: ["D:\\code\\show\\.git"] });
    assert.equal(findProjectRoot(e), "D:\\code\\show");
    assert.equal(resolveSingleTarget({ project: true }, e).skillDir, "D:\\code\\show\\.claude\\skills\\video-prompt-director");
  });
});

describe("project root detection", () => {
  it("uses the nearest ancestor with .git", () => {
    assert.equal(findProjectRoot(env({ existing: ["/home/ana/work/series/.git"] })), "/home/ana/work/series");
  });
  it("falls back to the current folder outside a repository", () => {
    assert.equal(findProjectRoot(env({})), "/home/ana/work/series/ep1");
  });
});

describe("destination flags", () => {
  it("requires exactly one destination", () => {
    assert.throws(() => resolveSingleTarget({}, env({})), UsageError);
    assert.throws(() => resolveSingleTarget({ global: true, project: true }, env({})), UsageError);
    assert.throws(() => resolveSingleTarget({ global: true, dir: "/x" }, env({})), UsageError);
  });
  it("custom dir resolves relative to cwd", () => {
    const t = resolveSingleTarget({ dir: "../skills" }, env({ cwd: "/srv/app/sub" }));
    assert.equal(t.skillDir, "/srv/app/skills/video-prompt-director");
    assert.equal(t.scope, "custom");
  });
  it("rejects a --dir that is the skill folder itself", () => {
    assert.throws(() => resolveSingleTarget({ dir: "/x/skills/video-prompt-director" }, env({})), /holds skills/);
  });
  it("list/doctor do not show the same folder twice when run from home", () => {
    const targets = resolveAllTargets({}, env({ cwd: "/home/ana" }));
    assert.equal(targets.length, 1);
  });
  it("recognises Claude Code skills directories", () => {
    assert.ok(isClaudeSkillsDir("/home/ana/.claude/skills", "linux"));
    assert.ok(isClaudeSkillsDir("C:\\Users\\Ana\\.claude\\skills", "win32"));
    assert.ok(!isClaudeSkillsDir("/opt/skills", "linux"));
  });
});
