import assert from "node:assert/strict";
import { readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { it } from "node:test";
import { ROOT, tmpDir } from "./helpers.ts";

function mockClaude(dir: string, body: string): string {
  const mock = path.join(dir, "claude.cjs");
  writeFileSync(mock, body);
  return mock;
}

function runEval(mock: string, id: string) {
  return spawnSync(process.execPath, ["evals/run-evals.mjs", "--only", id], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, VIDEO_PROMPT_DIRECTOR_EVAL_CLI_SCRIPT: mock },
  });
}

it("scores an activated scenario from the stream and can re-check saved output", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, `
console.log(JSON.stringify({type:'assistant', message:{content:[{type:'tool_use',name:'Skill',input:{skill:'video-prompt-director'}}]}}));
console.log(JSON.stringify({type:'result', session_id:'s', is_error:false, result:'Panel 1: wide. Panel 2: close-up. Panel 3: two-shot. I will wait for your approval.'}));
`);
  const r = runEval(mock, "01-storyboard-gate");
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /PASS 01-storyboard-gate/);
  const outputDir = r.stdout.match(/Outputs: (.+)/)?.[1];
  assert.ok(outputDir);
  const output = readFileSync(path.join(outputDir, "01-storyboard-gate.md"), "utf8");
  assert.match(output, /Skill activated:\*\* true/);
  const recheck = spawnSync(process.execPath, ["evals/run-evals.mjs", "--recheck", outputDir], { cwd: ROOT, encoding: "utf8" });
  assert.equal(recheck.status, 0, recheck.stderr);
  assert.match(recheck.stdout, /PASS 01-storyboard-gate/);
});

it("fails a scenario that must not activate the skill when it does", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, `
console.log(JSON.stringify({type:'assistant', message:{content:[{type:'tool_use',name:'Skill',input:{skill:'video-prompt-director'}}]}}));
console.log(JSON.stringify({type:'result', session_id:'s', is_error:false, result:'Rain on the glass.'}));
`);
  const r = runEval(mock, "09-no-activation");
  assert.match(r.stdout, /FAIL 09-no-activation/);
  assert.equal(r.status, 1, "a failed scenario must fail the evaluation command");
});

// The evaluator must not depend on which tool the model used to reach a reference file.
function stream(...events: unknown[]): string {
  return `${events.map((e) => `console.log(${JSON.stringify(JSON.stringify(e))});`).join("\n")}\n`;
}
const use = (name: string, input: Record<string, unknown>, id = "t") => ({ type: "assistant", message: { content: [{ type: "tool_use", id, name, input }] } });
const done = (text: string) => ({ type: "result", session_id: "s", is_error: false, result: text });
const skill = use("Skill", { skill: "video-prompt-director" });
const FULL_ANSWER_15 =
  "Attach Mira and the letter to clip 4. Leave Daniel's reference out: a reference makes the model show that person, so he could appear in the clip. Don't name him in the prompt either.";

it("counts a file as read when a later Bash call relies on an earlier cd", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, stream(
    skill,
    use("Bash", { command: "cd /tmp/p/.claude/skills/video-prompt-director/references && ls" }, "b1"),
    use("Bash", { command: "cat camera-language.md" }, "b2"),
    done("The camera tracks her at walking pace, steady, 50 mm look, slight sway."),
  ));
  const r = runEval(mock, "12-camera-follow-smoothness");
  assert.match(r.stdout, /PASS 12-camera-follow-smoothness/, r.stdout);
});

it("counts a file as read when a Grep result lists it", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, stream(
    skill,
    use("Grep", { pattern: "frozen", path: "/tmp/p/.claude/skills/video-prompt-director" }, "g1"),
    { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "g1", content: "/tmp/p/.claude/skills/video-prompt-director/references/prompt-quality.md:20:12. No unintended frozen-character problem" }] } },
    done("The prompt has no action and an emotion label, so the character comes out frozen. Here is the corrected prompt."),
  ));
  const r = runEval(mock, "05-prompt-repair");
  assert.match(r.stdout, /PASS 05-prompt-repair/, r.stdout);
});

it("does not count a file that was never opened or surfaced", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, stream(skill, done("The prompt has no action and an emotion label, so the character comes out frozen.")));
  const r = runEval(mock, "05-prompt-repair");
  assert.match(r.stdout, /FAIL 05-prompt-repair/);
  assert.match(r.stdout, /read_file/);
});

it("a knowledge check passes when the answer carries the reference facts and fails when it does not", () => {
  const good = mockClaude(tmpDir("vpd-eval-cli-"), stream(skill, done(
    "Put an audio policy at the start and the end of the prompt. List the banned terms: music, BGM, score, instrumental, ambient pad, synth effects. You can also isolate the vocals in post. Recheck that every line of dialogue is still spoken.",
  )));
  assert.match(runEval(good, "19-seedance-unwanted-bgm").stdout, /PASS 19-seedance-unwanted-bgm/);
  const bad = mockClaude(tmpDir("vpd-eval-cli-"), stream(skill, done("Try writing 'no music' more firmly.")));
  const r = runEval(bad, "19-seedance-unwanted-bgm");
  assert.match(r.stdout, /FAIL 19-seedance-unwanted-bgm/);
  assert.match(r.stdout, /knowledge/);
});

it("requires uncertainty and a post-production fallback for a supplied recording", () => {
  const good = mockClaude(tmpDir("vpd-eval-cli-"), stream(skill, done(
    "For this model, exact lip-sync is not guaranteed. Mix the original recording in post. Iwan says: That isn't yours to open.",
  )));
  assert.match(runEval(good, "32-recorded-dialogue-evidence").stdout, /PASS 32-recorded-dialogue-evidence/);
  const bad = mockClaude(tmpDir("vpd-eval-cli-"), stream(skill, done(
    "The model preserves the recording exactly. Iwan says: That isn't yours to open.",
  )));
  assert.match(runEval(bad, "32-recorded-dialogue-evidence").stdout, /FAIL 32-recorded-dialogue-evidence/);
});

it("accepts equivalent reference-mapping and audio-fallback wording", () => {
  const mapping = mockClaude(tmpDir("vpd-eval-cli-"), stream(skill, done(
    "Upload subjects in order they first appear, using a one-to-one manifest. Explicitly write Image 1 as A and Audio 1 as A's voice. This reduces swaps rather than guaranteeing they never occur.",
  )));
  assert.match(runEval(mapping, "20-seedance-character-swap").stdout, /PASS 20-seedance-character-swap/);
  const audio = mockClaude(tmpDir("vpd-eval-cli-"), stream(skill, done(
    "Flash audio-reference behavior is undocumented. Even for the flagship the recording is a voice or timbre reference, not as a guaranteed word-for-word playback. Run a short low-resolution Flash test, or attach the original recording and use a dubbing pass in post.",
  )));
  assert.match(runEval(audio, "22-seedance-audio-reference-honesty").stdout, /PASS 22-seedance-audio-reference-honesty/);
});

it("scores and rechecks a Codex JSON stream using the Codex project installation", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, `
const fs = require('node:fs');
if (!fs.existsSync('.agents/skills/video-prompt-director/SKILL.md')) process.exit(2);
console.log(JSON.stringify({type:'thread.started', thread_id:'test'}));
console.log(JSON.stringify({type:'item.completed', item:{type:'command_execution', command:'cat .agents/skills/video-prompt-director/references/camera-language.md', exit_code:0}}));
console.log(JSON.stringify({type:'item.completed', item:{type:'agent_message', text:'The camera backs away, steady with slight sway, 50 mm.'}}));
console.log(JSON.stringify({type:'turn.completed'}));
`);
  const r = spawnSync(process.execPath, ["evals/run-evals.mjs", "--backend", "codex", "--only", "12-camera-follow-smoothness"], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, VIDEO_PROMPT_DIRECTOR_EVAL_CLI_SCRIPT: mock },
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /PASS 12-camera-follow-smoothness/);
  const outputDir = r.stdout.match(/Outputs: (.+)/)?.[1];
  assert.ok(outputDir);
  const report = readFileSync(path.join(outputDir, "12-camera-follow-smoothness.md"), "utf8");
  assert.match(report, /Skill activated:\*\* true/);
  const summary = JSON.parse(readFileSync(path.join(outputDir, "summary.json"), "utf8"));
  assert.equal(summary[0].costUsd, null);
  const recheck = spawnSync(process.execPath, ["evals/run-evals.mjs", "--recheck", outputDir], { cwd: ROOT, encoding: "utf8" });
  assert.equal(recheck.status, 0, recheck.stdout + recheck.stderr);
  assert.match(recheck.stdout, /PASS 12-camera-follow-smoothness/);
});

it("does not treat an incomplete Codex stream as a successful run", () => {
  const mock = mockClaude(tmpDir("vpd-eval-cli-"), stream(
    { type: "thread.started", thread_id: "test" },
    { type: "item.completed", item: { type: "agent_message", text: "Rain on glass." } },
    { type: "turn.failed", error: { message: "unavailable" } },
  ));
  const r = spawnSync(process.execPath, ["evals/run-evals.mjs", "--backend", "codex", "--only", "09-no-activation"], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, VIDEO_PROMPT_DIRECTOR_EVAL_CLI_SCRIPT: mock },
  });
  assert.equal(r.status, 1);
  const outputDir = r.stdout.match(/Outputs: (.+)/)?.[1];
  assert.ok(outputDir);
  const recheck = spawnSync(process.execPath, ["evals/run-evals.mjs", "--recheck", outputDir], { cwd: ROOT, encoding: "utf8" });
  assert.equal(recheck.status, 1);
});

it("retains a failed CLI exit when a completed stream is rechecked", () => {
  const mock = mockClaude(tmpDir("vpd-eval-cli-"), `${stream(
    { type: "thread.started", thread_id: "test" },
    { type: "item.completed", item: { type: "agent_message", text: "Rain on glass." } },
    { type: "turn.completed" },
  )}\nprocess.exit(2);`);
  const r = spawnSync(process.execPath, ["evals/run-evals.mjs", "--backend", "codex", "--only", "09-no-activation"], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, VIDEO_PROMPT_DIRECTOR_EVAL_CLI_SCRIPT: mock },
  });
  assert.equal(r.status, 1);
  const outputDir = r.stdout.match(/Outputs: (.+)/)?.[1];
  assert.ok(outputDir);
  const recheck = spawnSync(process.execPath, ["evals/run-evals.mjs", "--recheck", outputDir], { cwd: ROOT, encoding: "utf8" });
  assert.equal(recheck.status, 1);
});

it("scenario 02 is the unchanged baseline and its Flash variant is marked as not comparable", () => {
  const scenarios = JSON.parse(readFileSync(path.join(ROOT, "evals", "scenarios.json"), "utf8")) as Array<Record<string, unknown>>;
  const variant = scenarios.find((s) => s.id === "24-panel-to-prompt-seedance-flash");
  assert.ok(variant);
  assert.equal(variant.variant_of, "02-panel-to-prompt-seedance");
  assert.equal(variant.comparable_with_baseline, false);
  const base = scenarios.find((s) => s.id === "02-panel-to-prompt-seedance") as { prompt: string; checks: Array<{ type: string }> };
  assert.doesNotMatch(base.prompt, /Flash/);
  assert.ok(base.checks.some((c) => c.type === "read_file"));
});

it("removes the temporary projects it created, unless asked to keep them", () => {
  const dir = tmpDir("vpd-eval-cli-");
  const mock = mockClaude(dir, stream(done("Rain on the glass.")));
  const tmp = realpathSync(os.tmpdir());
  const mine = () => readdirSync(tmp).filter((n) => n.startsWith("vpd-eval-09-no-activation-"));
  const before = new Set(mine());
  const run = (extra: string[]) => spawnSync(process.execPath, ["evals/run-evals.mjs", "--only", "09-no-activation", ...extra], {
    cwd: ROOT, encoding: "utf8", env: { ...process.env, VIDEO_PROMPT_DIRECTOR_EVAL_CLI_SCRIPT: mock },
  });
  run([]);
  assert.deepEqual(mine().filter((n) => !before.has(n)), [], "default run should leave no temp project behind");
  run(["--keep-projects"]);
  const kept = mine().filter((n) => !before.has(n));
  assert.equal(kept.length, 1, "--keep-projects should keep the project");
  for (const n of kept) rmSync(path.join(tmp, n), { recursive: true, force: true }); // the test cleans up after itself
});
