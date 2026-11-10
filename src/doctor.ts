import path from "node:path";
import { validateSkillDir } from "./frontmatter.ts";
import { status } from "./installer.ts";
import { packageInfo, SKILL_SOURCE_DIR } from "./package-info.ts";
import { isClaudeSkillsDir, type Target } from "./paths.ts";

export type Level = "ok" | "info" | "warn" | "error";
export interface Check {
  level: Level;
  message: string;
}

export function runDoctor(targets: Target[], platform: NodeJS.Platform = process.platform): Check[] {
  const checks: Check[] = [];
  const add = (level: Level, message: string): void => void checks.push({ level, message });
  const pkg = packageInfo();

  const [major = 0, minor = 0] = process.versions.node.split(".").map(Number);
  if (major > 18 || (major === 18 && minor >= 17)) add("ok", `Node.js ${process.versions.node}`);
  else add("error", `Node.js ${process.versions.node} is too old; 18.17 or newer is required.`);

  const bundled = validateSkillDir(SKILL_SOURCE_DIR);
  if (bundled.errors.length) bundled.errors.forEach((e) => add("error", `Bundled skill: ${e}`));
  else add("ok", `Bundled skill is valid (${pkg.name} v${pkg.version})`);
  bundled.warnings.forEach((w) => add("warn", `Bundled skill: ${w}`));

  const installed: string[] = [];
  for (const t of targets) {
    const s = status(t, pkg);
    const label = `[${t.scope}] ${t.skillDir}`;
    if (s.state === "absent") {
      add("info", `${label}: not installed`);
      continue;
    }
    installed.push(t.scope);
    if (s.state === "symlink") {
      add("info", `${label}: ${s.summary}`);
    } else if (s.state === "file") {
      add("error", `${label}: ${s.summary}. Claude Code cannot load it.`);
      continue;
    } else if (s.state === "unmanaged") {
      add("warn", `${label}: ${s.summary}. 'update' will refuse to touch it without --force.`);
    } else {
      add(s.upToDate ? "ok" : "warn", `${label}: ${s.summary}`);
      const c = s.changes;
      if (c && c.missing.length) add("warn", `${label}: missing files: ${c.missing.join(", ")} (run 'update' to restore)`);
      if (c && (c.modified.length || c.added.length))
        add("info", `${label}: locally edited: ${[...c.modified, ...c.added].join(", ")} (protected; 'update' needs --force)`);
    }

    const v = validateSkillDir(t.skillDir);
    if (v.errors.length) v.errors.forEach((e) => add("error", `${label}: ${e}`));
    else add("ok", `${label}: SKILL.md is valid`);

    if (isClaudeSkillsDir(t.skillsDir, platform)) {
      add("ok", `${label}: Claude Code discovers skills at this location (${path.join(".claude", "skills", "video-prompt-director", "SKILL.md")})`);
    } else {
      add("info", `${label}: custom location. Claude Code only finds it if this folder is (or is copied into) a '.claude/skills' directory it scans.`);
    }
  }
  if (installed.includes("global") && installed.includes("project")) {
    add("warn", "Installed both globally and in this project. Two skills with the same name can shadow each other; keep the one you want and uninstall the other.");
  }
  return checks;
}
