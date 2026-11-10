#!/usr/bin/env node
import path from "node:path";
import { parseArgs } from "node:util";
import { runDoctor } from "./doctor.ts";
import { install, status, uninstall, update, type Outcome } from "./installer.ts";
import { packageInfo, SKILL_NAME } from "./package-info.ts";
import { defaultEnv, resolveAllTargets, resolveSingleTarget, UsageError, type PathEnv } from "./paths.ts";
import { exportSkillZip } from "./zip.ts";

function helpText(): string {
  const { name, version } = packageInfo();
  return `${name} v${version}
Installs the "${SKILL_NAME}" Claude skill (storyboards and AI video generation prompts).

Usage
  video-prompt-director <command> [options]

Commands
  install      Install the skill (safe to re-run; updates an older copy it installed)
  update       Replace an installed copy with this package's version
  uninstall    Remove an installed copy
  list         Show where the skill is installed and its status
  doctor       Check the bundled skill, installed copies, and Claude Code discovery
  export-zip   Build the Claude.ai upload ZIP (default output: ./release)

Destination (install, update, uninstall need exactly one)
  -g, --global         ~/.claude/skills/${SKILL_NAME}   (all your projects)
  -p, --project        <project root>/.claude/skills/${SKILL_NAME}
                       project root = nearest folder with .git, else the current folder
      --dir <path>     <path>/${SKILL_NAME}   (path is a skills directory)

Options
  -f, --force          Replace or remove a copy with local edits, or a folder this CLI
                       did not install. The old copy is backed up first.
      --dry-run        Show what would happen without changing anything
      --backup-dir <p> Where backups go (default: next to the skills directory,
                       e.g. ~/.claude/${SKILL_NAME}-backups)
      --out <dir>      Output folder for export-zip
      --json           Machine-readable output (list, doctor)
  -h, --help           Show this help
  -v, --version        Show the version

Examples
  video-prompt-director install --global
  video-prompt-director install --project
  video-prompt-director update --global --dry-run
  video-prompt-director uninstall --project
  video-prompt-director doctor
  npx ${name} install --global
`;
}

const options = {
  global: { type: "boolean", short: "g" },
  project: { type: "boolean", short: "p" },
  dir: { type: "string" },
  force: { type: "boolean", short: "f" },
  "dry-run": { type: "boolean" },
  "backup-dir": { type: "string" },
  out: { type: "string" },
  json: { type: "boolean" },
  help: { type: "boolean", short: "h" },
  version: { type: "boolean", short: "v" },
} as const;

function print(outcome: Outcome): number {
  const stream = outcome.exitCode === 0 ? process.stdout : process.stderr;
  for (const m of outcome.messages) stream.write(`${m}\n`);
  return outcome.exitCode;
}

export function main(argv: string[], env: PathEnv = defaultEnv()): number {
  let parsed;
  try {
    parsed = parseArgs({ args: argv, options, allowPositionals: true, strict: true });
  } catch (e) {
    process.stderr.write(`${(e as Error).message}\nRun 'video-prompt-director --help' for usage.\n`);
    return 2;
  }
  const { values, positionals } = parsed;
  const command = positionals[0];

  if (values.version) {
    process.stdout.write(`${packageInfo().version}\n`);
    return 0;
  }
  if (values.help || !command || command === "help") {
    process.stdout.write(helpText());
    return 0;
  }
  if (positionals.length > 1) {
    process.stderr.write(`Unexpected argument: ${positionals[1]}\n`);
    return 2;
  }

  const scope = { global: values.global, project: values.project, dir: values.dir };
  const backupDir = values["backup-dir"] ? path.resolve(env.cwd, values["backup-dir"]) : undefined;
  try {
    switch (command) {
      case "install":
      case "update":
      case "uninstall": {
        const target = resolveSingleTarget(scope, env);
        const opts = { target, force: values.force, dryRun: values["dry-run"], backupDir };
        const run = command === "install" ? install : command === "update" ? update : uninstall;
        const code = print(run(opts));
        if (code === 0 && command === "install" && !values["dry-run"] && target.scope !== "custom") {
          process.stdout.write("Claude Code picks it up automatically. If it doesn't appear, run /reload-skills or start a new session. Try: /video-prompt-director\n");
        }
        return code;
      }
      case "list": {
        const lines = resolveAllTargets(scope, env).map((t) => status(t));
        if (values.json) process.stdout.write(`${JSON.stringify(lines, null, 2)}\n`);
        else for (const l of lines) process.stdout.write(`${l.scope.padEnd(8)} ${l.path}\n         ${l.summary}\n`);
        return 0;
      }
      case "doctor": {
        const checks = runDoctor(resolveAllTargets(scope, env), env.platform);
        if (values.json) process.stdout.write(`${JSON.stringify(checks, null, 2)}\n`);
        else {
          const icon = { ok: "✔", info: "·", warn: "!", error: "✖" } as const;
          for (const c of checks) process.stdout.write(`${icon[c.level]} ${c.message}\n`);
        }
        return checks.some((c) => c.level === "error") ? 1 : 0;
      }
      case "export-zip":
      case "zip": {
        const out = path.resolve(env.cwd, values.out ?? "release");
        const { file, entries } = exportSkillZip(out);
        process.stdout.write(`Wrote ${file} (${entries.length} entries).\nUpload it in Claude.ai from the Skills section of Settings (see README, "Claude.ai").\n`);
        return 0;
      }
      default:
        process.stderr.write(`Unknown command: ${command}\nRun 'video-prompt-director --help' for usage.\n`);
        return 2;
    }
  } catch (e) {
    if (e instanceof UsageError) {
      process.stderr.write(`${e.message}\n`);
      return 2;
    }
    process.stderr.write(`Error: ${(e as Error).message}\n`);
    return 1;
  }
}

process.exitCode = main(process.argv.slice(2));
