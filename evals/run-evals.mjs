#!/usr/bin/env node
// Behavioural evals: install the skill into a fresh temp project, run each scenario
// through headless Claude Code (`claude -p`), save the outputs, and apply objective checks.
// Objective checks are heuristics. Writing quality is judged separately by reading the
// outputs against each scenario's rubric (read each output against its scenario rubric).
//
// Usage: node evals/run-evals.mjs [--only 01-english-hook,05-three-character-confrontation] [--concurrency 4] [--repeat 3] [--keep-projects] [--model <id>]
// Requires: `npm run build`, and an authenticated `claude` CLI. Each scenario uses your Claude usage.
import { spawn, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? dflt : args[i + 1];
};
const only = opt("only", "")?.split(",").filter(Boolean) ?? [];
const concurrency = Number(opt("concurrency", "4"));
const repeat = Math.max(1, Number(opt("repeat", "1")));
const keepProjects = args.includes("--keep-projects");
const model = opt("model", undefined);
const TIMEOUT_MS = 10 * 60 * 1000;

const scenarios = JSON.parse(readFileSync(path.join(ROOT, "evals", "scenarios.json"), "utf8")).filter((s) => !only.length || only.includes(s.id));

// --recheck <results dir>: re-score saved outputs without calling Claude again.
const recheck = opt("recheck", undefined);
if (recheck) {
  const all = JSON.parse(readFileSync(path.join(ROOT, "evals", "scenarios.json"), "utf8"));
  let passed = 0;
  for (const s of all) {
    const mdFile = path.join(recheck, `${s.id}.md`);
    if (!existsSync(mdFile)) continue;
    const md = readFileSync(mdFile, "utf8");
    const streamFile = path.join(recheck, `${s.id}.stream.jsonl`);
    const a = existsSync(streamFile) ? analyse(readFileSync(streamFile, "utf8")) : { text: "", filesRead: [], skillFilesRead: [], skillUsed: false };
    a.text = md.slice(md.indexOf("\n---\n") + 5);
    const firstStream = path.join(recheck, `${s.id}.turn1.stream.jsonl`);
    const first = existsSync(firstStream) ? analyse(readFileSync(firstStream, "utf8")) : null;
    const checks = s.checks.map((c) => ({ ...c, ...check(c, c.turn === 1 ? (first ?? { text: "", filesRead: [], skillFilesRead: [], skillUsed: false }) : a) }));
    const ok = checks.every((c) => c.pass);
    if (ok) passed++;
    console.log(`${ok ? "PASS" : "FAIL"} ${s.id}  files: ${a.skillFilesRead.join(", ") || "SKILL.md only"}${ok ? "" : "  " + checks.filter((c) => !c.pass).map((c) => `[${c.type}: ${c.detail}]`).join(" ")}`);
  }
  console.log(`\n${passed} scenario(s) passed objective checks (recheck).`);
  process.exit(0);
}

if (!existsSync(path.join(ROOT, "dist", "cli.js"))) {
  console.error("Run `npm run build` first.");
  process.exit(2);
}

let outDir; // set for each run below

function makeProject(s) {
  const proj = realpathSync(mkdtempSync(path.join(os.tmpdir(), `vpd-eval-${s.id}-`)));
  mkdirSync(path.join(proj, ".git")); // mark as project root
  // Install exactly as a user would, through the CLI's --project path.
  const r = spawnSync(process.execPath, [path.join(ROOT, "dist", "cli.js"), "install", "--project"], { cwd: proj, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`install failed: ${r.stderr}`);
  for (const f of s.fixtures ?? []) cpSync(path.join(ROOT, "evals", "fixtures", f), proj, { recursive: true });
  return proj;
}

// Remove a temporary project made by makeProject. Refuses any path that is not a vpd-eval folder inside the temp directory.
function removeProject(dir) {
  const tmp = realpathSync(os.tmpdir());
  if (!dir || path.dirname(dir) !== tmp || !path.basename(dir).startsWith("vpd-eval-")) return;
  rmSync(dir, { recursive: true, force: true });
}

function runClaude(prompt, cwd, resumeSession) {
  return new Promise((resolve) => {
    const cliArgs = [
      "-p", prompt,
      "--output-format", "stream-json", "--verbose",
      "--allowedTools", "Skill", "Read", "Glob", "Grep", "Bash(node:*)",
      "--disallowedTools", "Write", "Edit", "WebSearch", "WebFetch", "Agent",
      "--setting-sources", "project,local",
    ];
    if (model) cliArgs.push("--model", model);
    if (resumeSession) cliArgs.push("--resume", resumeSession);
    const mockScript = process.env.VIDEO_PROMPT_DIRECTOR_EVAL_CLI_SCRIPT;
    const child = mockScript
      ? spawn(process.execPath, [mockScript, ...cliArgs], { cwd, stdio: ["ignore", "pipe", "pipe"] })
      : spawn("claude", cliArgs, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill("SIGTERM"), TIMEOUT_MS);
    child.stdout.on("data", (d) => (stdout += d));
    child.stderr.on("data", (d) => (stderr += d));
    child.on("error", (err) => { stderr += err.message; });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
}

function analyse(stream) {
  const events = stream.split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  const toolUses = [];
  const toolNames = new Map(); // tool_use id -> tool name
  for (const e of events) {
    if (e.type !== "assistant") continue;
    for (const c of e.message?.content ?? []) if (c.type === "tool_use") { toolUses.push({ name: c.name, input: c.input }); toolNames.set(c.id, c.name); }
  }
  const result = events.find((e) => e.type === "result");
  const skillUsed = toolUses.some((t) => t.name === "Skill" && JSON.stringify(t.input).includes("video-prompt-director"));

  // A file counts as consulted however the model got at it: Read, a shell command, or a search result that listed it.
  // The shell keeps its working directory between Bash calls, so a `cd` in one call applies to the next.
  let skillBase; // directory the model last changed into inside the skill folder
  const filesRead = [];
  for (const t of toolUses) {
    if (t.name === "Read") { filesRead.push(t.input?.file_path ?? ""); continue; }
    if (t.name !== "Bash") continue;
    const cmd = String(t.input?.command ?? "");
    for (const m of cmd.matchAll(/\bcd\s+("[^"]+"|'[^']+'|\S+)/g)) {
      const target = m[1].replace(/^["']|["']$/g, "").replace(/\/+$/, "");
      if (target.includes("video-prompt-director")) skillBase = target;
      else if (skillBase && !target.startsWith("/")) skillBase = path.posix.normalize(`${skillBase}/${target}`);
      else skillBase = undefined;
    }
    for (const p of cmd.match(/[\w./-]+\.md\b/g) ?? []) {
      filesRead.push(p.includes("video-prompt-director/") || p.startsWith("/") || !skillBase ? p : `${skillBase}/${p}`);
    }
  }
  for (const e of events) {
    if (e.type !== "user") continue;
    for (const c of e.message?.content ?? []) {
      if (c.type !== "tool_result" || !["Grep", "Glob"].includes(toolNames.get(c.tool_use_id))) continue;
      const text = typeof c.content === "string" ? c.content : (c.content ?? []).map((part) => part.text ?? "").join("\n");
      for (const m of text.matchAll(/((?:[\w./-]*\/)?(?:references|examples)\/[\w./-]+\.md)/g)) {
        filesRead.push(m[1].includes("video-prompt-director/") ? m[1] : `video-prompt-director/${m[1]}`);
      }
    }
  }
  return {
    text: result?.result ?? "",
    sessionId: result?.session_id,
    isError: result?.is_error ?? true,
    costUsd: result?.total_cost_usd,
    durationMs: result?.duration_ms,
    skillUsed,
    skillFilesRead: [...new Set(filesRead.filter((f) => f.includes("video-prompt-director")).map((f) => f.split("video-prompt-director/").pop()))],
    filesRead,
    toolUses: toolUses.map((t) => t.name),
  };
}

function scriptShare(text, script) {
  const letters = (text.match(/\p{L}/gu) ?? []).length || 1;
  const re = { latin: /\p{Script=Latin}/gu, han: /\p{Script=Han}/gu, hangul: /\p{Script=Hangul}/gu, kana: /[\p{Script=Hiragana}\p{Script=Katakana}]/gu }[script];
  return (text.match(re) ?? []).length / letters;
}

function speakers(text) {
  const names = new Set();
  for (const m of text.matchAll(/^\s*\**([A-Z][A-Z .'\-]{1,24}|[^\x00-\x7F\s:：]{1,8})\**\s*(?:\([^)]*\))?\s*\**\s*[:：]/gmu)) {
    const n = m[1].trim();
    if (!/^(INT|EXT|CAST|NOTE|NOTES|ENDING|SCENE|SHOT|CONTINUITY|LANGUAGE|TARGET|SETTING|PROPS|AUDIO|CAMERA)$/i.test(n)) names.add(n);
  }
  return names;
}

function check(c, a) {
  const t = a.text;
  switch (c.type) {
    case "skill_activated":
      return { pass: a.skillUsed || a.skillFilesRead.length > 0, detail: a.skillUsed ? "Skill tool invoked" : `files read: ${a.skillFilesRead.join(", ") || "none"}` };
    case "skill_not_activated":
      return { pass: !a.skillUsed && a.skillFilesRead.length === 0, detail: a.skillUsed ? "Skill tool invoked" : `files read: ${a.skillFilesRead.join(", ") || "none"}` };
    case "script": {
      // Measure dialogue only: explanations may legitimately be in the user's language.
      const dialogue = t.split("\n").filter((l) => /^\s*\**[^\s:：*]{1,24}\**\s*(?:[(（][^)）]*[)）])?\s*[:：]\s*\S/u.test(l)).join("\n");
      const share = scriptShare(dialogue || t, c.script);
      return { pass: share >= 0.5, detail: `${c.script} share of letters in dialogue lines: ${(share * 100).toFixed(0)}%` };
    }
    case "regex": {
      const n = (t.match(new RegExp(c.pattern, `g${c.flags ?? ""}u`)) ?? []).length;
      return { pass: n >= (c.min ?? 1), detail: `${n} match(es) of /${c.pattern}/` };
    }
    case "not_regex": {
      const m = t.match(new RegExp(c.pattern, `${c.flags ?? ""}u`));
      return { pass: !m, detail: m ? `found "${m[0]}"` : "absent" };
    }
    case "speakers": {
      const s = speakers(t);
      return { pass: s.size >= c.min, detail: `${s.size} speaker(s): ${[...s].join(", ")}` };
    }
    case "tag_density": {
      const lines = t.split("\n").filter((l) => /^\s*\**[A-Z][A-Z .'\-]+\**\s*(\([^)]*\))?\s*:/.test(l));
      const tags = lines.reduce((n, l) => n + (l.match(/\[[^\]]+\]/g) ?? []).length, 0);
      const d = lines.length ? tags / lines.length : 0;
      return { pass: d <= c.max, detail: `${tags} tag(s) over ${lines.length} line(s) = ${d.toFixed(2)} per line` };
    }
    case "knowledge": {
      // Behavioral check: the answer must carry enough facts that only the skill's reference files supply.
      // It does not care how the model reached the files.
      const hit = c.facts.filter((f) => new RegExp(f.pattern, `${f.flags ?? "i"}su`).test(t)).map((f) => f.label);
      return { pass: hit.length >= c.min, detail: `${hit.length}/${c.facts.length} facts, need ${c.min}: ${hit.join(", ") || "none"}` };
    }
    case "read_file": {
      const ok = a.filesRead.some((f) => new RegExp(c.pattern).test(f));
      return { pass: ok, detail: ok ? "read" : `not read (read: ${a.filesRead.map((f) => path.basename(f)).join(", ")})` };
    }
    default:
      return { pass: false, detail: `unknown check ${c.type}` };
  }
}

async function runOne(s) {
  const proj = s.project;
  const started = Date.now();
  let first;
  if (s.first_prompt) {
    const initial = await runClaude(s.first_prompt, proj);
    first = analyse(initial.stdout);
    writeFileSync(path.join(outDir, `${s.id}.turn1.stream.jsonl`), initial.stdout);
    if (initial.code !== 0 || first.isError || !first.sessionId) {
      throw new Error(`First turn failed or returned no session ID: ${first.text || initial.stderr.slice(0, 500)}`);
    }
  }
  const r = await runClaude(s.prompt, proj, first?.sessionId);
  const a = analyse(r.stdout);
  const checks = s.checks.map((c) => ({ ...c, ...check(c, c.turn === 1 ? first : a) }));
  if (r.code !== 0 || a.isError) checks.push({ type: "run", pass: false, detail: a.text || r.stderr.slice(0, 500) || `exit ${r.code}` });
  const md = [
    `# ${s.id}: ${s.title}`, "", ...(first ? [`**First prompt:** ${s.first_prompt}`, "", `**First response:** ${first.text}`, ""] : []), `**Prompt:** ${s.prompt}`, "", `**Rubric:** ${s.rubric}`, "",
    `**Skill activated:** ${a.skillUsed || !!first?.skillUsed} · **Skill files read:** ${[...(first?.skillFilesRead ?? []), ...a.skillFilesRead].join(", ") || "none"}`,
    `**Checks:** ${checks.map((c) => `${c.pass ? "PASS" : "FAIL"} ${c.type} (${c.detail})`).join("; ")}`, "", "---", "", a.text || `(no result)\n\n${r.stderr.slice(0, 2000)}`,
  ].join("\n");
  writeFileSync(path.join(outDir, `${s.id}.md`), md);
  writeFileSync(path.join(outDir, `${s.id}.stream.jsonl`), r.stdout);
  const summary = { id: s.id, title: s.title, ok: !a.isError, seconds: Math.round((Date.now() - started) / 1000), costUsd: (first?.costUsd ?? 0) + (a.costUsd ?? 0), skillUsed: a.skillUsed || !!first?.skillUsed, skillFilesRead: [...(first?.skillFilesRead ?? []), ...a.skillFilesRead], toolUses: [...(first?.toolUses ?? []), ...a.toolUses], checks };
  const status = checks.every((c) => c.pass) ? "PASS" : "FAIL";
  console.log(`${status} ${s.id} (${summary.seconds}s) ${checks.filter((c) => !c.pass).map((c) => `[${c.type}: ${c.detail}]`).join(" ")}`);
  return summary;
}

const tally = new Map(); // scenario id -> number of runs that passed every objective check
for (let rep = 1; rep <= repeat; rep++) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  outDir = path.join(ROOT, "evals", "results", stamp);
  mkdirSync(outDir, { recursive: true });
  if (repeat > 1) console.log(`\n=== Run ${rep} of ${repeat} ===`);
  let runScenarios = [];
  // Set up every project before any Claude run, so later rebuilds of dist/ can't interfere.
  runScenarios = scenarios.map((s) => ({ ...s }));
  for (const s of runScenarios) s.project = makeProject(s);
  const queue = [...runScenarios];
  const results = [];
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length) {
      const s = queue.shift();
      try {
        results.push(await runOne(s));
      } catch (e) {
        console.log(`ERROR ${s.id}: ${e.message}`);
        results.push({ id: s.id, title: s.title, ok: false, error: e.message, checks: [{ type: "run", pass: false, detail: e.message }] });
      }
    }
  }));
  results.sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(results, null, 2));
  const passed = results.filter((r) => r.checks.every((c) => c.pass)).length;
  console.log(`\n${passed}/${results.length} scenarios passed objective checks. Outputs: ${outDir}`);
  for (const r of results) tally.set(r.id, (tally.get(r.id) ?? 0) + (r.checks.every((c) => c.pass) ? 1 : 0));
  // The temporary projects are throwaway copies this run created. Remove only those, so repeated runs do not fill the disk.
  if (!keepProjects) for (const s of runScenarios) removeProject(s.project);
}
if (repeat > 1) {
  console.log(`\nStability over ${repeat} runs (passes per scenario):`);
  for (const [id, n] of [...tally].sort(([a], [b]) => a.localeCompare(b))) console.log(`${n === repeat ? "STABLE " : n === 0 ? "FAILING" : "FLAKY  "} ${id}  ${n}/${repeat}`);
}
