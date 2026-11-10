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
