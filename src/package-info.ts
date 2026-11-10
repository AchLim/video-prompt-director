import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/** The skill's folder name. Fixed by the Agent Skills spec: it must match `name` in SKILL.md. */
export const SKILL_NAME = "video-prompt-director";

/** Package root: one level above `dist/` (built) or `src/` (running from source). */
export const PACKAGE_ROOT = fileURLToPath(new URL("..", import.meta.url));

export const SKILL_SOURCE_DIR = path.join(PACKAGE_ROOT, "plugins", "video-prompt-director", "skills", SKILL_NAME);

export interface PackageInfo {
  name: string;
  version: string;
}

let cached: PackageInfo | undefined;

/**
 * Package name and version are read from package.json at runtime, so the npm
 * scope can be changed in one place (package.json) without touching code.
 */
export function packageInfo(): PackageInfo {
  if (!cached) {
    const raw = JSON.parse(readFileSync(path.join(PACKAGE_ROOT, "package.json"), "utf8")) as Partial<PackageInfo>;
    cached = { name: raw.name ?? SKILL_NAME, version: raw.version ?? "0.0.0" };
  }
  return cached;
}
