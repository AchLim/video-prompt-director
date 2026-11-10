import { createHash } from "node:crypto";
import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Written into every installed copy. It records what the CLI installed so that
 * later updates can tell the user's own edits apart from package files.
 */
export const MANIFEST_FILE = ".video-prompt-director-install.json";

/** OS clutter that never counts as a user modification. */
const IGNORED = new Set([".DS_Store", "Thumbs.db", "desktop.ini", MANIFEST_FILE]);

export interface Manifest {
  tool: "video-prompt-director-cli";
  package: string;
  version: string;
  installedAt: string;
  /** posix relative path -> sha256 */
  files: Record<string, string>;
}

export interface Changes {
  modified: string[];
  added: string[];
  missing: string[];
}

export function hasUserChanges(c: Changes): boolean {
  return c.modified.length > 0 || c.added.length > 0;
}

/** Recursively list files (posix relative paths, sorted). Symlinks are listed, not followed. */
export function listFiles(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string, rel: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED.has(entry.name)) continue;
      const relPath = rel ? `${rel}/${entry.name}` : entry.name;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs, relPath);
      else out.push(relPath);
    }
  };
  walk(root, "");
  return out.sort();
}

export function hashFile(abs: string): string {
  const st = lstatSync(abs);
  if (st.isSymbolicLink()) return `symlink:${readlinkSync(abs)}`;
  return createHash("sha256").update(readFileSync(abs)).digest("hex");
}

export function hashTree(root: string): Record<string, string> {
  const files: Record<string, string> = {};
  for (const rel of listFiles(root)) files[rel] = hashFile(path.join(root, ...rel.split("/")));
  return files;
}

export function readManifest(skillDir: string): Manifest | undefined {
  const file = path.join(skillDir, MANIFEST_FILE);
  if (!existsSync(file)) return undefined;
  try {
    const m = JSON.parse(readFileSync(file, "utf8")) as Manifest;
    if (m.tool !== "video-prompt-director-cli" || typeof m.files !== "object") return undefined;
    return m;
  } catch {
    return undefined;
  }
}

export function writeManifest(skillDir: string, manifest: Manifest): void {
  writeFileSync(path.join(skillDir, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`);
}

/** Compare what is on disk now with what the CLI installed. */
export function diffAgainstManifest(skillDir: string, manifest: Manifest): Changes {
  const current = hashTree(skillDir);
  const changes: Changes = { modified: [], added: [], missing: [] };
  for (const [rel, hash] of Object.entries(manifest.files)) {
    if (!(rel in current)) changes.missing.push(rel);
    else if (current[rel] !== hash) changes.modified.push(rel);
  }
  for (const rel of Object.keys(current)) if (!(rel in manifest.files)) changes.added.push(rel);
  return changes;
}

export function sameFiles(a: Record<string, string>, b: Record<string, string>): boolean {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}
