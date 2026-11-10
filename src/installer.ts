import { randomBytes } from "node:crypto";
import {
  copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, readlinkSync, renameSync, rmSync, unlinkSync,
} from "node:fs";
import path from "node:path";
import {
  diffAgainstManifest, hasUserChanges, hashTree, listFiles, readManifest, sameFiles, writeManifest,
  type Changes, type Manifest,
} from "./manifest.ts";
import { packageInfo, SKILL_NAME, SKILL_SOURCE_DIR, type PackageInfo } from "./package-info.ts";
import type { Target } from "./paths.ts";

export type InstallState =
  | { kind: "absent" }
  | { kind: "symlink"; linkTarget: string }
  | { kind: "file" }
  | { kind: "unmanaged" }
  | { kind: "managed"; manifest: Manifest; changes: Changes };

export interface Options {
  target: Target;
  force?: boolean;
  dryRun?: boolean;
  /** Where backups go. Default: <parent of skills dir>/video-prompt-director-backups */
  backupDir?: string;
  /** Overridable for tests. */
  source?: string;
  pkg?: PackageInfo;
}

export type Action = "installed" | "updated" | "unchanged" | "removed" | "absent" | "refused" | "dry-run";

export interface Outcome {
  action: Action;
  messages: string[];
  backupPath?: string;
  exitCode: number;
}

export function inspect(skillDir: string): InstallState {
  let st;
  try {
    st = lstatSync(skillDir);
  } catch {
    return { kind: "absent" };
  }
  if (st.isSymbolicLink()) return { kind: "symlink", linkTarget: readlinkSync(skillDir) };
  if (!st.isDirectory()) return { kind: "file" };
  const manifest = readManifest(skillDir);
  if (!manifest) return { kind: "unmanaged" };
  return { kind: "managed", manifest, changes: diffAgainstManifest(skillDir, manifest) };
}

export function defaultBackupDir(target: Target): string {
  return path.join(path.dirname(target.skillsDir), `${SKILL_NAME}-backups`);
}

function listChanges(c: Changes, max = 15): string[] {
  const lines = [
    ...c.modified.map((f) => `  modified: ${f}`),
    ...c.added.map((f) => `  added:    ${f}`),
    ...c.missing.map((f) => `  missing:  ${f}`),
  ];
  return lines.length > max ? [...lines.slice(0, max), `  ...and ${lines.length - max} more`] : lines;
}

function refuse(messages: string[]): Outcome {
  return { action: "refused", messages, exitCode: 1 };
}

function describeForeign(state: InstallState, skillDir: string): string {
  switch (state.kind) {
    case "symlink":
      return `${skillDir} is a symbolic link to ${state.linkTarget} (possibly created by another installer, such as 'npx skills').`;
    case "file":
      return `${skillDir} exists but is a file, not a skill folder.`;
    default:
      return `${skillDir} already exists but was not installed by this CLI (no install record found), so it may contain your own work.`;
  }
}

class Ctx {
  readonly source: string;
  readonly pkg: PackageInfo;
  readonly sourceFiles: Record<string, string>;
  readonly opts: Options;
  constructor(opts: Options) {
    this.opts = opts;
    this.source = opts.source ?? SKILL_SOURCE_DIR;
    this.pkg = opts.pkg ?? packageInfo();
    if (!existsSync(path.join(this.source, "SKILL.md"))) throw new Error(`Bundled skill not found at ${this.source}. The package may be damaged; reinstall it.`);
    this.sourceFiles = hashTree(this.source);
  }
  get target(): Target {
    return this.opts.target;
  }

  /** Copy the existing folder (or file) aside before anything replaces or removes it. */
  backup(label: string): string {
    const root = this.opts.backupDir ?? defaultBackupDir(this.target);
    mkdirSync(root, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    let dest = path.join(root, `${SKILL_NAME}-${label}-${stamp}`);
    for (let i = 2; existsSync(dest); i++) dest = path.join(root, `${SKILL_NAME}-${label}-${stamp}-${i}`);
    const st = lstatSync(this.target.skillDir);
    if (st.isDirectory()) cpSync(this.target.skillDir, dest, { recursive: true, verbatimSymlinks: true });
    else copyFileSync(this.target.skillDir, dest);
    return dest;
  }

  /**
   * Stage a full copy next to the destination, then swap it in with renames,
   * so a failure part-way never leaves a half-written skill folder behind.
   */
  place(): void {
    const { skillsDir, skillDir } = this.target;
    mkdirSync(skillsDir, { recursive: true });
    const tag = randomBytes(4).toString("hex");
    const stage = path.join(skillsDir, `.${SKILL_NAME}.staging-${tag}`);
    try {
      for (const rel of listFiles(this.source)) {
        const to = path.join(stage, ...rel.split("/"));
        mkdirSync(path.dirname(to), { recursive: true });
        copyFileSync(path.join(this.source, ...rel.split("/")), to);
      }
      const manifest: Manifest = {
        tool: "video-prompt-director-cli",
        package: this.pkg.name,
        version: this.pkg.version,
        installedAt: new Date().toISOString(),
        files: this.sourceFiles,
      };
      writeManifest(stage, manifest);

      const existing = inspect(skillDir);
      if (existing.kind === "absent") {
        renameSync(stage, skillDir);
        return;
      }
      const old = path.join(skillsDir, `.${SKILL_NAME}.old-${tag}`);
      renameSync(skillDir, old);
      try {
        renameSync(stage, skillDir);
      } catch (e) {
        renameSync(old, skillDir); // put the previous copy back
        throw e;
      }
      if (existing.kind === "symlink") unlinkSync(old); // removes the link only, never its target
      else rmSync(old, { recursive: true, force: true });
    } finally {
      rmSync(stage, { recursive: true, force: true });
    }
  }

  remove(state: InstallState): void {
    if (state.kind === "symlink") unlinkSync(this.target.skillDir);
    else rmSync(this.target.skillDir, { recursive: true, force: true });
  }
}

function replaceForeign(ctx: Ctx, state: InstallState, verb: "install" | "update"): Outcome {
  const { skillDir } = ctx.target;
  if (!ctx.opts.force) {
    return refuse([
      describeForeign(state, skillDir),
      `Nothing was changed. To replace it, run '${verb}' again with --force.`,
      state.kind === "symlink"
        ? "--force removes only the link; the folder it points to is left untouched."
        : `--force first copies the existing ${state.kind === "file" ? "file" : "folder"} to ${ctx.opts.backupDir ?? defaultBackupDir(ctx.target)}.`,
    ]);
  }
  if (ctx.opts.dryRun) return { action: "dry-run", messages: [`Would replace ${skillDir} with ${ctx.pkg.name} v${ctx.pkg.version}.`], exitCode: 0 };
  const backupPath = state.kind === "symlink" ? undefined : ctx.backup("replaced");
  ctx.place();
  return {
    action: "installed",
    backupPath,
    messages: [
      `Installed ${ctx.pkg.name} v${ctx.pkg.version} to ${skillDir}.`,
      backupPath ? `The previous contents were backed up to ${backupPath}.` : "The previous symbolic link was removed (its target was not touched).",
    ],
    exitCode: 0,
  };
}

function updateManaged(ctx: Ctx, state: Extract<InstallState, { kind: "managed" }>): Outcome {
  const { manifest, changes } = state;
  const { skillDir } = ctx.target;
  const fromV = manifest.version;
  const toV = ctx.pkg.version;
  const userChanged = hasUserChanges(changes);

  if (!userChanged && changes.missing.length === 0 && fromV === toV && sameFiles(manifest.files, ctx.sourceFiles)) {
    return { action: "unchanged", messages: [`${SKILL_NAME} v${toV} is already installed and up to date at ${skillDir}.`], exitCode: 0 };
  }
  if (userChanged && !ctx.opts.force) {
    return refuse([
      `Local changes found in ${skillDir}:`,
      ...listChanges(changes),
      "Nothing was changed, so your edits are safe.",
      `To replace the folder anyway, re-run with --force. Your current copy will first be backed up to ${ctx.opts.backupDir ?? defaultBackupDir(ctx.target)}.`,
    ]);
  }
  const verbLine = fromV === toV ? `Reinstall v${toV}` : `Update v${fromV} → v${toV}`;
  if (ctx.opts.dryRun) {
    return {
      action: "dry-run",
      messages: [`Would ${verbLine.toLowerCase()} at ${skillDir}.`, ...(userChanged ? ["Would back up local changes first:", ...listChanges(changes)] : [])],
      exitCode: 0,
    };
  }
  const backupPath = userChanged ? ctx.backup(`v${fromV}-modified`) : undefined;
  ctx.place();
  const messages = [fromV === toV ? `Reinstalled ${SKILL_NAME} v${toV} at ${skillDir}.` : `Updated ${SKILL_NAME} v${fromV} → v${toV} at ${skillDir}.`];
  if (changes.missing.length) messages.push(`Restored ${changes.missing.length} missing file(s).`);
  if (backupPath) messages.push(`Your modified copy was backed up to ${backupPath}.`);
  return { action: "updated", messages, backupPath, exitCode: 0 };
}

export function install(opts: Options): Outcome {
  const ctx = new Ctx(opts);
  const state = inspect(opts.target.skillDir);
  if (state.kind === "absent") {
    if (opts.dryRun) return { action: "dry-run", messages: [`Would install ${ctx.pkg.name} v${ctx.pkg.version} to ${opts.target.skillDir}.`], exitCode: 0 };
    ctx.place();
    return { action: "installed", messages: [`Installed ${ctx.pkg.name} v${ctx.pkg.version} to ${opts.target.skillDir}.`], exitCode: 0 };
  }
  if (state.kind === "managed") return updateManaged(ctx, state);
  return replaceForeign(ctx, state, "install");
}

export function update(opts: Options): Outcome {
  const ctx = new Ctx(opts);
  const state = inspect(opts.target.skillDir);
  if (state.kind === "absent") {
    return refuse([`${SKILL_NAME} is not installed at ${opts.target.skillDir}.`, "Run 'install' first."]);
  }
  if (state.kind === "managed") return updateManaged(ctx, state);
  return replaceForeign(ctx, state, "update");
}

export function uninstall(opts: Options): Outcome {
  const ctx = new Ctx(opts);
  const { skillDir } = opts.target;
  const state = inspect(skillDir);
  if (state.kind === "absent") return { action: "absent", messages: [`${SKILL_NAME} is not installed at ${skillDir}. Nothing to do.`], exitCode: 0 };

  const userChanged = state.kind === "managed" && hasUserChanges(state.changes);
  const needsForce = state.kind !== "managed" || userChanged;
  if (needsForce && !opts.force) {
    return refuse([
      state.kind === "managed" ? `Local changes found in ${skillDir}:` : describeForeign(state, skillDir),
      ...(state.kind === "managed" ? listChanges(state.changes) : []),
      "Nothing was removed.",
      state.kind === "symlink"
        ? "Re-run with --force to remove the link (its target is not touched)."
        : `Re-run with --force to remove it. A backup is made first in ${opts.backupDir ?? defaultBackupDir(opts.target)}.`,
    ]);
  }
  if (opts.dryRun) return { action: "dry-run", messages: [`Would remove ${skillDir}.`], exitCode: 0 };
  const backupPath = needsForce && state.kind !== "symlink" ? ctx.backup("removed") : undefined;
  ctx.remove(state);
  return {
    action: "removed",
    backupPath,
    messages: [`Removed ${skillDir}.`, ...(backupPath ? [`A backup was saved to ${backupPath}.`] : [])],
    exitCode: 0,
  };
}

export interface StatusLine {
  scope: string;
  path: string;
  state: InstallState["kind"];
  installedVersion?: string;
  packageVersion: string;
  upToDate?: boolean;
  changes?: Changes;
  summary: string;
}

export function status(target: Target, pkg: PackageInfo = packageInfo(), source = SKILL_SOURCE_DIR): StatusLine {
  const state = inspect(target.skillDir);
  const base = { scope: target.scope, path: target.skillDir, state: state.kind, packageVersion: pkg.version };
  switch (state.kind) {
    case "absent":
      return { ...base, summary: "not installed" };
    case "symlink":
      return { ...base, summary: `symbolic link → ${state.linkTarget} (not managed by this CLI)` };
    case "file":
      return { ...base, summary: "a file is in the way (not a skill folder)" };
    case "unmanaged":
      return { ...base, summary: "present, but not installed by this CLI" };
    case "managed": {
      const upToDate = state.manifest.version === pkg.version && sameFiles(state.manifest.files, hashTree(source));
      const n = state.changes.modified.length + state.changes.added.length + state.changes.missing.length;
      const parts = [`v${state.manifest.version}`, upToDate ? "up to date" : `update available (v${pkg.version})`];
      if (n) parts.push(`${n} local change(s)`);
      return { ...base, installedVersion: state.manifest.version, upToDate, changes: state.changes, summary: parts.join(", ") };
    }
  }
}
