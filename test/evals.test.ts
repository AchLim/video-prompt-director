import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
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
