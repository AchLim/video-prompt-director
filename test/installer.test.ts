import assert from "node:assert/strict";
import {
  appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { validateSkillDir } from "../src/frontmatter.ts";
import { listFiles, MANIFEST_FILE } from "../src/manifest.ts";
import { PKG, runCli, SKILL_SRC, tmpDir } from "./helpers.ts";

const SOURCE_FILES = listFiles(SKILL_SRC);

function globalSkill(home: string): string {
  return path.join(home, ".claude", "skills", "video-prompt-director");
}

function assertComplete(dir: string): void {
  const installed = listFiles(dir);
  assert.deepEqual(installed, SOURCE_FILES, "installed files must equal the bundled skill");
  assert.ok(existsSync(path.join(dir, MANIFEST_FILE)), "install record written");
  assert.deepEqual(validateSkillDir(dir).errors, []);
}

describe("CLI basics", () => {
  const home = tmpDir();
  it("--version prints the package version", () => {
    const r = runCli(["--version"], { home });
    assert.equal(r.code, 0);
    assert.equal(r.stdout.trim(), PKG.version);
  });
  it("--help lists every command", () => {
    const r = runCli(["--help"], { home });
    assert.equal(r.code, 0);
    for (const c of ["install", "uninstall", "update", "list", "doctor", "export-zip", "--global", "--project", "--dir", "--force"]) {
      assert.ok(r.stdout.includes(c), c);
    }
  });
  it("usage errors exit 2 and change nothing", () => {
    assert.equal(runCli(["install"], { home }).code, 2);
    assert.equal(runCli(["install", "--global", "--project"], { home }).code, 2);
    assert.equal(runCli(["frobnicate"], { home }).code, 2);
    assert.equal(runCli(["install", "--nope"], { home }).code, 2);
    assert.ok(!existsSync(path.join(home, ".claude")));
  });
});

describe("global installation", () => {
  it("installs the complete skill and is idempotent", () => {
    const home = tmpDir();
    const r1 = runCli(["install", "--global"], { home });
    assert.equal(r1.code, 0, r1.out);
    assertComplete(globalSkill(home));

    const r2 = runCli(["install", "--global"], { home });
    assert.equal(r2.code, 0);
    assert.match(r2.stdout, /already installed and up to date/);
    assertComplete(globalSkill(home));
  });

  it("does not touch other skills in the same directory", () => {
    const home = tmpDir();
    const other = path.join(home, ".claude", "skills", "my-other-skill");
    mkdirSync(other, { recursive: true });
    writeFileSync(path.join(other, "SKILL.md"), "---\nname: my-other-skill\ndescription: mine\n---\n");
    runCli(["install", "--global"], { home });
    runCli(["update", "--global", "--force"], { home });
    runCli(["uninstall", "--global"], { home });
    assert.equal(readFileSync(path.join(other, "SKILL.md"), "utf8"), "---\nname: my-other-skill\ndescription: mine\n---\n");
    assert.deepEqual(readdirSync(path.join(home, ".claude", "skills")), ["my-other-skill"]);
  });

  it("--dry-run changes nothing", () => {
    const home = tmpDir();
    const r = runCli(["install", "--global", "--dry-run"], { home });
    assert.equal(r.code, 0);
    assert.match(r.stdout, /Would install/);
    assert.ok(!existsSync(globalSkill(home)));
  });
});

describe("project installation", () => {
  it("installs at the git root even when run from a subfolder", () => {
    const home = tmpDir();
    const repo = path.join(home, "series");
    mkdirSync(path.join(repo, ".git"), { recursive: true });
    mkdirSync(path.join(repo, "episodes", "s1"), { recursive: true });
    const r = runCli(["install", "--project"], { home, cwd: path.join(repo, "episodes", "s1") });
    assert.equal(r.code, 0, r.out);
    assertComplete(path.join(repo, ".claude", "skills", "video-prompt-director"));
    assert.ok(!existsSync(globalSkill(home)), "project install must not write the global folder");
  });

  it("uses the current folder outside a repository", () => {
    const home = tmpDir();
    const proj = path.join(home, "plain");
    mkdirSync(proj);
    assert.equal(runCli(["install", "-p"], { home, cwd: proj }).code, 0);
    assertComplete(path.join(proj, ".claude", "skills", "video-prompt-director"));
  });
});

describe("custom directory", () => {
  it("installs to <dir>/video-prompt-director, creating the folder", () => {
    const home = tmpDir();
    const r = runCli(["install", "--dir", "custom/skills"], { home });
    assert.equal(r.code, 0, r.out);
    assertComplete(path.join(home, "custom", "skills", "video-prompt-director"));
    const doc = runCli(["doctor", "--dir", "custom/skills"], { home });
    assert.match(doc.stdout, /custom location/);
  });
});

describe("update and modification protection", () => {
  function installed(): { home: string; dir: string } {
    const home = tmpDir();
    assert.equal(runCli(["install", "--global"], { home }).code, 0);
    return { home, dir: globalSkill(home) };
  }

  it("update with no changes is a no-op", () => {
    const { home } = installed();
    const r = runCli(["update", "--global"], { home });
    assert.equal(r.code, 0);
    assert.match(r.stdout, /up to date/);
  });

  it("update on a missing install refuses", () => {
    const home = tmpDir();
    const r = runCli(["update", "--global"], { home });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /not installed/);
  });

  it("refuses to overwrite edited files, then --force backs them up", () => {
    const { home, dir } = installed();
    const target = path.join(dir, "references", "performance.md");
    appendFileSync(target, "\nMY HOUSE STYLE NOTE\n");
    writeFileSync(path.join(dir, "references", "my-notes.md"), "personal notes");

    const refused = runCli(["update", "--global"], { home });
    assert.equal(refused.code, 1);
    assert.match(refused.stderr, /modified: references\/performance\.md/);
    assert.match(refused.stderr, /added: {4}references\/my-notes\.md/);
    assert.match(readFileSync(target, "utf8"), /MY HOUSE STYLE NOTE/, "edits untouched after refusal");

    // install is just as careful as update
    assert.equal(runCli(["install", "--global"], { home }).code, 1);

    const forced = runCli(["update", "--global", "--force"], { home });
    assert.equal(forced.code, 0, forced.out);
    const backup = /backed up to (.+)\.$/m.exec(forced.stdout)?.[1];
    assert.ok(backup && existsSync(backup), forced.stdout);
    assert.match(readFileSync(path.join(backup, "references", "performance.md"), "utf8"), /MY HOUSE STYLE NOTE/);
    assert.equal(readFileSync(path.join(backup, "references", "my-notes.md"), "utf8"), "personal notes");
    assert.ok(!backup.startsWith(path.join(home, ".claude", "skills") + path.sep), "backup must live outside the skills folder");
    assertComplete(dir);
  });

  it("restores deleted files without needing --force", () => {
    const { home, dir } = installed();
    rmSync(path.join(dir, "examples", "weak-vs-strong-prompts.md"));
    const r = runCli(["update", "--global"], { home });
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /Restored 1 missing file/);
    assertComplete(dir);
  });

  it("upgrades an older version recorded in the install record", () => {
    const { home, dir } = installed();
    const mfile = path.join(dir, MANIFEST_FILE);
    const m = JSON.parse(readFileSync(mfile, "utf8"));
    m.version = "0.9.0";
    writeFileSync(mfile, JSON.stringify(m));
    const list = runCli(["list", "--global"], { home });
    assert.match(list.stdout, /update available/);
    const r = runCli(["update", "--global"], { home });
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, new RegExp(`v0\\.9\\.0 → v${PKG.version.replace(/\./g, "\\.")}`));
    assert.equal(JSON.parse(readFileSync(mfile, "utf8")).version, PKG.version);
  });

  it("ignores OS clutter like .DS_Store", () => {
    const { home, dir } = installed();
    writeFileSync(path.join(dir, ".DS_Store"), "x");
    assert.match(runCli(["update", "--global"], { home }).stdout, /up to date/);
  });
});

describe("existing installations not made by this CLI", () => {
  it("refuses to replace a hand-made folder; --force backs it up", () => {
    const home = tmpDir();
    const dir = globalSkill(home);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "SKILL.md"), "my own hand-written version");
    const r = runCli(["install", "--global"], { home });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /not installed by this CLI/);
    assert.equal(readFileSync(path.join(dir, "SKILL.md"), "utf8"), "my own hand-written version");

    const f = runCli(["install", "--global", "--force"], { home });
    assert.equal(f.code, 0, f.out);
    const backup = /backed up to (.+)\.$/m.exec(f.stdout)?.[1] as string;
    assert.equal(readFileSync(path.join(backup, "SKILL.md"), "utf8"), "my own hand-written version");
    assertComplete(dir);
  });

  it("list and doctor report it without changing it", () => {
    const home = tmpDir();
    mkdirSync(globalSkill(home), { recursive: true });
    assert.match(runCli(["list", "--global"], { home }).stdout, /not installed by this CLI/);
    const doc = runCli(["doctor", "--global", "--json"], { home });
    const checks = JSON.parse(doc.stdout) as { level: string; message: string }[];
    assert.ok(checks.some((c) => c.level === "warn" && /not installed by this CLI/.test(c.message)));
  });

  it("a symlinked skill (e.g. from another installer) is never followed or deleted", { skip: process.platform === "win32" }, () => {
    const home = tmpDir();
    const real = path.join(home, "shared", "video-prompt-director");
    mkdirSync(real, { recursive: true });
    writeFileSync(path.join(real, "SKILL.md"), "shared copy");
    mkdirSync(path.join(home, ".claude", "skills"), { recursive: true });
    symlinkSync(real, globalSkill(home), "dir");

    assert.equal(runCli(["update", "--global"], { home }).code, 1);
    assert.equal(runCli(["uninstall", "--global"], { home }).code, 1);
    const f = runCli(["install", "--global", "--force"], { home });
    assert.equal(f.code, 0, f.out);
    assert.equal(readFileSync(path.join(real, "SKILL.md"), "utf8"), "shared copy", "symlink target untouched");
    assertComplete(globalSkill(home));
  });
});

describe("uninstall", () => {
  it("removes a clean install and is idempotent", () => {
    const home = tmpDir();
    runCli(["install", "--global"], { home });
    const r = runCli(["uninstall", "--global"], { home });
    assert.equal(r.code, 0, r.out);
    assert.ok(!existsSync(globalSkill(home)));
    assert.ok(existsSync(path.join(home, ".claude", "skills")), "the skills folder itself stays");
    const again = runCli(["uninstall", "--global"], { home });
    assert.equal(again.code, 0);
    assert.match(again.stdout, /not installed/);
  });

  it("refuses when files were edited; --force backs up first", () => {
    const home = tmpDir();
    runCli(["install", "--global"], { home });
    appendFileSync(path.join(globalSkill(home), "SKILL.md"), "\nlocal edit\n");
    assert.equal(runCli(["uninstall", "--global"], { home }).code, 1);
    assert.ok(existsSync(globalSkill(home)));
    const f = runCli(["uninstall", "--global", "--force"], { home });
    assert.equal(f.code, 0, f.out);
    const backup = /backup was saved to (.+)\.$/m.exec(f.stdout)?.[1] as string;
    assert.match(readFileSync(path.join(backup, "SKILL.md"), "utf8"), /local edit/);
    assert.ok(!existsSync(globalSkill(home)));
  });

  it("--backup-dir controls where backups go", () => {
    const home = tmpDir();
    runCli(["install", "--global"], { home });
    appendFileSync(path.join(globalSkill(home), "SKILL.md"), "\nedit\n");
    const r = runCli(["uninstall", "--global", "--force", "--backup-dir", "my-backups"], { home });
    assert.equal(r.code, 0, r.out);
    assert.equal(readdirSync(path.join(home, "my-backups")).length, 1);
  });
});

describe("list and doctor", () => {
  it("doctor confirms Claude Code discovery for a global install", () => {
    const home = tmpDir();
    runCli(["install", "--global"], { home });
    const r = runCli(["doctor"], { home });
    assert.equal(r.code, 0, r.out);
    assert.match(r.stdout, /Claude Code discovers skills at this location/);
    assert.match(r.stdout, /SKILL\.md is valid/);
  });

  it("doctor warns when installed both globally and in the project", () => {
    const home = tmpDir();
    const repo = path.join(home, "repo");
    mkdirSync(path.join(repo, ".git"), { recursive: true });
    runCli(["install", "--global"], { home });
    runCli(["install", "--project"], { home, cwd: repo });
    assert.match(runCli(["doctor"], { home, cwd: repo }).stdout, /both globally and in this project/);
  });

  it("list --json is machine-readable", () => {
    const home = tmpDir();
    runCli(["install", "--global"], { home });
    const data = JSON.parse(runCli(["list", "--global", "--json"], { home }).stdout);
    assert.equal(data[0].state, "managed");
    assert.equal(data[0].installedVersion, PKG.version);
    assert.equal(data[0].upToDate, true);
  });
});
