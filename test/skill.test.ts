import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { parseSkill, toStandardSkillMd, validateSkillDir } from "../src/frontmatter.ts";
import { listFiles } from "../src/manifest.ts";
import { PKG, SKILL_SRC, tmpDir } from "./helpers.ts";

describe("bundled skill", () => {
  const v = validateSkillDir(SKILL_SRC);

  it("passes Agent Skills and Claude.ai validation", () => {
    assert.deepEqual(v.errors, []);
    assert.deepEqual(v.warnings, []);
  });

  it("has the required structure", () => {
    const files = listFiles(SKILL_SRC);
    const required = [
      "SKILL.md", "README.md",
      ...["storyboard", "cinematography", "performance", "physical-realism", "continuity", "prompt-quality", "constraints", "manual-flow-handoff"].map((f) => `references/${f}.md`),
      ...["seedance", "veo", "kling", "runway", "other"].map((f) => `references/models/${f}.md`),
      "examples/weak-vs-strong-prompts.md",
    ];
    for (const f of required) assert.ok(files.includes(f), `missing ${f}`);
  });

  it("SKILL.md mentions every reference and example file (no orphans)", () => {
    const body = readFileSync(path.join(SKILL_SRC, "SKILL.md"), "utf8");
    for (const f of listFiles(SKILL_SRC)) {
      if (!/^(references|examples)\//.test(f)) continue;
      assert.ok(body.includes(f), `SKILL.md never points to ${f}`);
    }
  });

  it("SKILL.md stays concise (under 500 lines)", () => {
    assert.ok(readFileSync(path.join(SKILL_SRC, "SKILL.md"), "utf8").split("\n").length < 500);
  });

  it("metadata.version matches package.json", () => {
    const meta = v.skill?.data.metadata as Record<string, string>;
    assert.equal(meta.version, PKG.version);
  });

  it("description fits Claude.ai's 200-character limit and names the core use", () => {
    const d = v.skill?.data.description as string;
    assert.ok(d.length <= 200, `${d.length} chars`);
    assert.match(d, /video/i);
  });

  it("does not leave TODO placeholders in guidance files", () => {
    for (const f of listFiles(SKILL_SRC)) {
      const text = readFileSync(path.join(SKILL_SRC, f), "utf8");
      assert.doesNotMatch(text, /\bTODO\b|\bTBD\b|lorem ipsum/i, f);
    }
  });
});

describe("frontmatter validation", () => {
  function skillWith(fm: string, dirName = "my-skill"): string {
    const dir = path.join(tmpDir(), dirName);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "SKILL.md"), `---\n${fm}\n---\n# Body\n`);
    return dir;
  }

  it("rejects bad names and a name that doesn't match the folder", () => {
    assert.ok(validateSkillDir(skillWith("name: My_Skill\ndescription: x")).errors.some((e) => /lowercase/.test(e)));
    assert.ok(validateSkillDir(skillWith("name: other\ndescription: x")).errors.some((e) => /match the folder/.test(e)));
    assert.ok(validateSkillDir(skillWith("name: bad--name\ndescription: x", "bad--name")).errors.length > 0);
  });

  it("rejects missing or over-long descriptions", () => {
    assert.ok(validateSkillDir(skillWith("name: my-skill")).errors.some((e) => /description/.test(e)));
    assert.ok(validateSkillDir(skillWith(`name: my-skill\ndescription: "${"a".repeat(201)}"`)).errors.some((e) => /200/.test(e)));
  });

  it("rejects missing frontmatter and unquoted colons", () => {
    const dir = path.join(tmpDir(), "my-skill");
    mkdirSync(dir);
    writeFileSync(path.join(dir, "SKILL.md"), "# No frontmatter\n");
    assert.ok(validateSkillDir(dir).errors.length > 0);
    assert.ok(validateSkillDir(skillWith("name: my-skill\ndescription: Use it: always")).errors.length > 0);
  });

  it("flags references to files that don't exist", () => {
    const dir = skillWith("name: my-skill\ndescription: ok");
    writeFileSync(path.join(dir, "SKILL.md"), "---\nname: my-skill\ndescription: ok\n---\nSee references/missing.md\n");
    assert.ok(validateSkillDir(dir).errors.some((e) => /missing\.md/.test(e)));
  });

  it("export rewrite keeps only open-standard fields", () => {
    const text = readFileSync(path.join(SKILL_SRC, "SKILL.md"), "utf8");
    const std = parseSkill(toStandardSkillMd(text));
    assert.equal(std.data.when_to_use, undefined);
    assert.equal(std.data.name, "video-prompt-director");
    assert.ok(typeof std.data.metadata === "object");
    assert.equal(std.body, parseSkill(text).body);
  });
});
