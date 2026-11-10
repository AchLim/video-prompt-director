import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, realpathSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const CLI = path.join(ROOT, "dist", "cli.js");
export const SKILL_SRC = path.join(ROOT, "plugins", "video-prompt-director", "skills", "video-prompt-director");
export const PKG = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8")) as { name: string; version: string };

export function tmpDir(prefix = "vpd-test-"): string {
  // realpath: macOS tmp lives behind a /var -> /private/var symlink.
  return realpathSync(mkdtempSync(path.join(os.tmpdir(), prefix)));
}

export interface RunResult {
  code: number;
  stdout: string;
  stderr: string;
  out: string;
}

/** Run the built CLI with an isolated home directory. */
export function runCli(args: string[], opts: { home: string; cwd?: string; bin?: string }): RunResult {
  const r = spawnSync(process.execPath, [opts.bin ?? CLI, ...args], {
    cwd: opts.cwd ?? opts.home,
    env: { ...process.env, HOME: opts.home, USERPROFILE: opts.home },
    encoding: "utf8",
    input: "",
  });
  return { code: r.status ?? -1, stdout: r.stdout, stderr: r.stderr, out: r.stdout + r.stderr };
}
