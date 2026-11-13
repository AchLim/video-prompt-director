// The Seedance capability registry and its optional Python validator.
// The validator needs Python 3. When it is missing these tests are skipped, because the script is optional
// and the registry file documents the same checks as a manual procedure.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { ROOT, SKILL_SRC, tmpDir } from "./helpers.ts";

function findPython(): string | undefined {
  for (const cmd of ["python3", "python"]) {
    const r = spawnSync(cmd, ["--version"], { encoding: "utf8" });
    if (r.status === 0) return cmd;
  }
  return undefined;
}

const python = findPython();
const SCRIPT = path.join(ROOT, "scripts", "check_registry.py");
const SCENARIOS = path.join(ROOT, "evals", "scenarios.json");
const FOLDER = path.join("references", "models", "seedance");

/** A scratch copy of the skill's references, so a test can break one file without touching the repository. */
function scratchSkill(): { skill: string; registry: string; file: (name: string) => string } {
  const skill = path.join(tmpDir("vpd-registry-"), "skill");
  mkdirSync(path.join(skill, "references", "models"), { recursive: true });
  cpSync(path.join(SKILL_SRC, FOLDER), path.join(skill, FOLDER), { recursive: true });
  const file = (name: string): string => path.join(skill, FOLDER, name);
  return { skill, registry: file("capability-registry.md"), file };
}

function check(registry: string, skill: string, extra: string[] = []): { code: number; out: string } {
  const r = spawnSync(python as string, [SCRIPT, "--registry", registry, "--skill-root", skill, "--scenarios", SCENARIOS, ...extra], { encoding: "utf8" });
  return { code: r.status ?? -1, out: r.stdout + r.stderr };
}

/** Replace one cell (0-based, counting the ID as cell 0) in a registry row. */
function setCell(text: string, id: string, cell: number, value: string): string {
  return text
    .split("\n")
    .map((line) => {
      if (!line.startsWith(`| ${id} |`)) return line;
      const parts = line.split("|");
      parts[cell + 1] = ` ${value} `;
      return parts.join("|");
    })
    .join("\n");
}

const CELL = { class: 2, cov: 3, basis: 4, v25: 5, flash: 6, v20: 7, source: 8, recipe: 9, test: 10, notes: 11 };

describe("Seedance capability registry", { skip: python ? false : "python is not installed" }, () => {
  it("passes on the registry in the repository", () => {
    const r = check(path.join(SKILL_SRC, FOLDER, "capability-registry.md"), SKILL_SRC);
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /Registry check PASSED/);
  });

  it("fails on a Flash OFFICIAL cell whose source is not Flash-specific, and allows one that cites the Flash page", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G1", CELL.flash, "OFFICIAL"));
    const bad = check(s.registry, s.skill);
    assert.equal(bad.code, 1);
    assert.match(bad.out, /G1: Flash OFFICIAL needs a Flash-specific source/);
    // G8 already cites the Flash page (FL), so it may be promoted once the page says so.
    const t = scratchSkill();
    writeFileSync(t.registry, setCell(readFileSync(t.registry, "utf8"), "G8", CELL.flash, "OFFICIAL"));
    const good = check(t.registry, t.skill);
    assert.equal(good.code, 0, good.out);
  });

  it("fails on TESTED without a log entry, and passes once a PASS entry exists", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G1", CELL.flash, "TESTED"));
    const bad = check(s.registry, s.skill);
    assert.equal(bad.code, 1);
    assert.match(bad.out, /G1: Flash is TESTED but test-log\.md has no PASS entry/);
    const log = readFileSync(s.file("test-log.md"), "utf8");
    writeFileSync(s.file("test-log.md"), `${log}| T-001 | 2026-11-16 | G1 | Seedance 2.5 Flash | console | 720p, 5 s | text only | PASS | fixture |\n`);
    const good = check(s.registry, s.skill);
    assert.equal(good.code, 0, good.out);
  });

  it("does not let a flagship PASS entry satisfy a Flash TESTED cell", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G1", CELL.flash, "TESTED"));
    const log = readFileSync(s.file("test-log.md"), "utf8");
    writeFileSync(s.file("test-log.md"), `${log}| T-001 | 2026-11-16 | G1 | Seedance 2.5 | console | 720p, 5 s | text only | PASS | flagship run |\n`);
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /G1: Flash is TESTED but test-log\.md has no PASS entry for it on a Flash model/);
  });

  it("does not let a Flash FAIL entry satisfy a Flash TESTED cell", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G1", CELL.flash, "TESTED"));
    const log = readFileSync(s.file("test-log.md"), "utf8");
    writeFileSync(s.file("test-log.md"), `${log}| T-001 | 2026-11-16 | G1 | Seedance 2.5 Flash | console | 720p, 5 s | text only | FAIL | rejected |\n`);
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
  });

  it("fails on a duplicate ID", () => {
    const s = scratchSkill();
    const lines = readFileSync(s.registry, "utf8").split("\n");
    const i = lines.findIndex((l) => l.startsWith("| G1 |"));
    lines.splice(i + 1, 0, lines[i] as string);
    writeFileSync(s.registry, lines.join("\n"));
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /G1: duplicate id/);
  });

  it("fails on a value outside the closed vocabulary", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G2", CELL.class, "LOCKD"));
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /G2: Class value 'LOCKD'/);
  });

  it("fails when a GAP row is marked OFFICIAL for 2.5", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "C4", CELL.v25, "OFFICIAL"));
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /C4: a GAP row cannot be OFFICIAL/);
  });

  it("fails when a 2.0-only recipe is marked OFFICIAL for 2.5", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "X9", CELL.v25, "OFFICIAL"));
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /X9: a 2\.0-only recipe cannot be OFFICIAL/);
  });

  it("fails on an unknown source code, a missing test scenario and a missing recipe path", () => {
    const s = scratchSkill();
    let text = readFileSync(s.registry, "utf8");
    text = setCell(text, "G1", CELL.source, "ZZZ#nowhere");
    text = setCell(text, "G2", CELL.test, "99-no-such-scenario");
    text = setCell(text, "G3", CELL.recipe, "references/models/seedance/missing.md");
    writeFileSync(s.registry, text);
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /G1: unknown source code 'ZZZ'/);
    assert.match(r.out, /G2: test '99-no-such-scenario'/);
    assert.match(r.out, /G3: recipe path does not exist/);
  });

  it("fails on a note that cites a discrepancy that does not exist", () => {
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G1", CELL.notes, "See DISC-99."));
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /G1: note cites DISC-99/);
  });

  it("fails when an ID is missing from the traceability table", () => {
    const s = scratchSkill();
    // Line-based, so the test does not depend on the checkout's line endings.
    const text = readFileSync(s.registry, "utf8")
      .split(/\r?\n/)
      .map((line) => (line.startsWith("| G20 appendix: text generation") ? line.replace("G12", "G1") : line))
      .join("\n");
    writeFileSync(s.registry, text);
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /G12: not mapped in the traceability table/);
  });

  it("fails when the Flash profile states a flagship-only number", () => {
    const s = scratchSkill();
    writeFileSync(s.file("profile-2-5-flash.md"), `${readFileSync(s.file("profile-2-5-flash.md"), "utf8")}\nFlash accepts up to 30 images.\n`);
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /Flash profile line \d+ states a flagship-only number/);
  });

  it("fails when the Flash profile offers 1080p without saying it is not listed", () => {
    const s = scratchSkill();
    writeFileSync(s.file("profile-2-5-flash.md"), `${readFileSync(s.file("profile-2-5-flash.md"), "utf8")}\nFlash renders at 1080p for final output.\n`);
    const r = check(s.registry, s.skill);
    assert.equal(r.code, 1);
    assert.match(r.out, /mentions 1080p without saying it is not listed/);
  });

  it("the phase gate fails when a recipe is due for the phase being checked and is not written", () => {
    // Run on a scratch copy with one row forced to a planned recipe, so the test keeps working after real recipes land.
    const s = scratchSkill();
    writeFileSync(s.registry, setCell(readFileSync(s.registry, "utf8"), "G1", CELL.recipe, "PLANNED:P2"));
    const r = check(s.registry, s.skill, ["--phase", "2"]);
    assert.equal(r.code, 1);
    assert.match(r.out, /G1: recipe is planned for phase 2/);
    const ok = check(s.registry, s.skill, ["--phase", "1"]);
    assert.equal(ok.code, 0, ok.out);
  });
});
