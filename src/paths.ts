import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { SKILL_NAME } from "./package-info.ts";

export type Scope = "global" | "project" | "custom";

export interface Target {
  scope: Scope;
  /** Directory that holds skill folders, e.g. ~/.claude/skills */
  skillsDir: string;
  skillDir: string;
}

export interface PathEnv {
  home: string;
  cwd: string;
  platform: NodeJS.Platform;
  exists: (p: string) => boolean;
}

export function defaultEnv(): PathEnv {
  return { home: os.homedir(), cwd: process.cwd(), platform: process.platform, exists: existsSync };
}

/** Use Windows path rules on win32 so paths are correct even when tested elsewhere. */
export function pathApi(platform: NodeJS.Platform): path.PlatformPath {
  return platform === "win32" ? path.win32 : path.posix;
}

/** Claude Code personal skills: ~/.claude/skills (on Windows: %USERPROFILE%\.claude\skills). */
export function globalSkillsDir(env: PathEnv): string {
  return pathApi(env.platform).join(env.home, ".claude", "skills");
}

/**
 * Project root = nearest ancestor of cwd containing `.git` (directory or file,
 * so worktrees and submodules count). Falls back to cwd when not in a repo.
 */
export function findProjectRoot(env: PathEnv): string {
  const p = pathApi(env.platform);
  let dir = p.resolve(env.cwd);
  for (;;) {
    if (env.exists(p.join(dir, ".git"))) return dir;
    const parent = p.dirname(dir);
    if (parent === dir) return p.resolve(env.cwd);
    dir = parent;
  }
}

export function projectSkillsDir(env: PathEnv): string {
  return pathApi(env.platform).join(findProjectRoot(env), ".claude", "skills");
}

export function makeTarget(scope: Scope, skillsDir: string, platform: NodeJS.Platform): Target {
  return { scope, skillsDir, skillDir: pathApi(platform).join(skillsDir, SKILL_NAME) };
}

export class UsageError extends Error {}

export interface ScopeFlags {
  global?: boolean;
  project?: boolean;
  dir?: string;
}

/** Commands that change files need exactly one destination. */
export function resolveSingleTarget(flags: ScopeFlags, env: PathEnv): Target {
  const chosen = [flags.global, flags.project, flags.dir !== undefined].filter(Boolean).length;
  if (chosen === 0) throw new UsageError("Choose a destination: --global, --project, or --dir <skills-directory>.");
  if (chosen > 1) throw new UsageError("Use only one of --global, --project, or --dir.");
  if (flags.global) return makeTarget("global", globalSkillsDir(env), env.platform);
  if (flags.project) return makeTarget("project", projectSkillsDir(env), env.platform);
  return customTarget(flags.dir as string, env);
}

export function customTarget(dir: string, env: PathEnv): Target {
  const p = pathApi(env.platform);
  if (dir.trim() === "") throw new UsageError("--dir needs a path.");
  const resolved = p.resolve(env.cwd, dir);
  if (p.basename(resolved) === SKILL_NAME) {
    throw new UsageError(
      `--dir is the directory that holds skills, not the skill folder itself.\n` +
        `Did you mean: --dir ${p.dirname(resolved)}  (installs to ${resolved})`,
    );
  }
  return makeTarget("custom", resolved, env.platform);
}

/** Read-only commands (list, doctor) look at every known location unless told otherwise. */
export function resolveAllTargets(flags: ScopeFlags, env: PathEnv): Target[] {
  const any = flags.global || flags.project || flags.dir !== undefined;
  const targets: Target[] = [];
  if (!any || flags.global) targets.push(makeTarget("global", globalSkillsDir(env), env.platform));
  if (!any || flags.project) {
    const proj = makeTarget("project", projectSkillsDir(env), env.platform);
    // Running from the home directory makes the "project" folder the same as the global one.
    if (!targets.some((t) => t.skillDir === proj.skillDir)) targets.push(proj);
  }
  if (flags.dir !== undefined) targets.push(customTarget(flags.dir, env));
  return targets;
}

/** True when the skills dir is one Claude Code scans by convention (`.claude/skills`). */
export function isClaudeSkillsDir(skillsDir: string, platform: NodeJS.Platform): boolean {
  const p = pathApi(platform);
  return p.basename(skillsDir) === "skills" && p.basename(p.dirname(skillsDir)) === ".claude";
}
