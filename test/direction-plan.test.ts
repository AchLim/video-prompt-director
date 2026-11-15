import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { SKILL_SRC, tmpDir } from "./helpers.ts";

const script = path.join(SKILL_SRC, "scripts", "direction_plan.py");
const AFTER = path.join(SKILL_SRC, "examples", "bakery-direction-plan.json");
const BEFORE = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "bakery-before.json");
const pythonAvailable = spawnSync("python3", ["--version"], { encoding: "utf8" }).status === 0;
const skip = !pythonAvailable;

type Finding = { severity: string; code: string; message: string; where: string };
const run = (...args: string[]) => spawnSync("python3", ["-I", script, ...args], { encoding: "utf8" });
const validate = (file: string) => {
  const r = run("validate", file, "--json");
  return { status: r.status, ...(JSON.parse(r.stdout) as { errors: number; findings: Finding[] }) };
};
const plan = () => JSON.parse(readFileSync(AFTER, "utf8"));
/** The bakery plan with one edit, written to a temp file. */
function variant(edit: (p: any) => void): string {
  const p = plan();
  edit(p);
  const f = path.join(tmpDir(), "plan.json");
  writeFileSync(f, JSON.stringify(p));
  return f;
}
const shot = (p: any, id: string) => p.generations.flatMap((g: any) => g.shots).find((s: any) => s.id === id);
const codes = (f: Finding[], sev = "error") => f.filter((x) => x.severity === sev).map((x) => x.code);

describe("direction plan: the bakery benchmark", () => {
  it("the after plan validates with no findings", { skip }, () => {
    const v = validate(AFTER);
    assert.equal(v.status, 0);
    assert.deepEqual(v.findings, []);
  });

  it("the before prompts fail on the defects a director would catch", { skip }, () => {
    const v = validate(BEFORE);
    assert.equal(v.status, 1);
    const found = new Set(codes(v.findings));
    for (const c of ["hand-busy", "ots-face", "floating-prop", "release-not-held", "hand-full", "beat-overlap", "wardrobe-unexplained", "prop-appears"])
      assert.ok(found.has(c), `expected ${c}`);
    assert.equal(v.errors, 12);
    assert.ok(codes(v.findings, "warn").includes("sides-unset"));
    assert.ok(codes(v.findings, "warn").includes("held-prop-unstated"));
  });

  it("a hand error does not cascade into false findings later", { skip }, () => {
    const v = validate(BEFORE);
    // 3A.1's impossible pick-ups leave the box in his hands, so setting it down in 3A.2 is not flagged
    assert.ok(!v.findings.some((f) => f.where.startsWith("3A/3A.2") && f.code === "release-not-held"));
  });
});

describe("direction plan: individual checks", () => {
  const errorsOf = (edit: (p: any) => void) => codes(validate(variant(edit)).findings);
  const warnsOf = (edit: (p: any) => void) => codes(validate(variant(edit)).findings, "warn");

  it("finger work in mittens", { skip }, () => {
    assert.ok(errorsOf((p) => { shot(p, "1A.2").beats[4].do = "points with his index finger at the cake"; }).includes("finger-in-mitten"));
  });
  it("a rushed beat and an overlapping one", { skip }, () => {
    // the timing table is a heuristic, so a rushed beat warns rather than blocks
    assert.ok(warnsOf((p) => { shot(p, "1A.2").beats[0].t = [4, 4.4]; }).includes("beat-rushed"));
    assert.ok(errorsOf((p) => { shot(p, "1A.2").beats[4].t = [7, 8.2]; }).includes("beat-overlap"));
  });
  it("lines: overflow, absent speaker, unknown speaker", { skip }, () => {
    assert.ok(errorsOf((p) => { shot(p, "3B.1").lines[0].at = 2.8; }).includes("line-overflow"));
    assert.ok(errorsOf((p) => { shot(p, "3B.2").lines = [{ who: "baker", at: 4.2, text: "Go on." }]; }).includes("speaker-absent"));
    assert.ok(errorsOf((p) => { shot(p, "3B.1").lines[0].who = "narrator"; }).includes("line-speaker"));
  });
  it("sounds need a cause and must sit inside it", { skip }, () => {
    assert.ok(errorsOf((p) => { delete shot(p, "1A.2").sounds[1].cause; }).includes("sound-cause"));
    assert.ok(errorsOf((p) => { shot(p, "1A.2").sounds[1].at = 9; }).includes("sound-sync"));
  });
  it("camera: zoom, conflicting move, over-the-shoulder face", { skip }, () => {
    assert.ok(errorsOf((p) => { shot(p, "2B.1").move = "slow zoom in"; }).includes("camera-zoom"));
    assert.ok(errorsOf((p) => { shot(p, "2B.1").move = "locked off, slow push-in"; }).includes("camera-conflict"));
    assert.ok(errorsOf((p) => { shot(p, "1B.1").beats[0].do = "his eyes drop to the coins"; }).includes("ots-face"));
  });
  it("a single next to a two-shot is not a side flip", { skip }, () => {
    assert.ok(!errorsOf((p) => { const s = shot(p, "1B.2"); s.sides = { baker: "left" }; }).includes("side-flip"));
  });
  it("screen sides may not flip inside a scene unless the crossing is declared", { skip }, () => {
    assert.ok(errorsOf((p) => { shot(p, "1A.2").sides = { boy: "right", baker: "left" }; }).includes("side-flip"));
    // a declared crossing is allowed where it happens; the next shot then keeps the new sides or crosses back on purpose
    const crossed = validate(variant((p) => { const s = shot(p, "1A.2"); s.sides = { boy: "right", baker: "left" }; s.crosses_line = true; })).findings;
    assert.ok(!crossed.some((f) => f.code === "side-flip" && f.where === "1A/1A.2"));
    assert.ok(crossed.some((f) => f.code === "side-flip" && f.where === "1B/1B.1"));
  });
  it("references: a person in frame without an image, and an image nobody shows", { skip }, () => {
    assert.ok(errorsOf((p) => { p.generations[0].refs = p.generations[0].refs.filter((r: string) => r !== "@char_boy"); }).includes("missing-ref"));
    assert.ok(warnsOf((p) => { p.generations[3].refs.push("@char_mother"); }).includes("unused-ref"));
  });
  it("two looks in one generation, and an undeclared look change", { skip }, () => {
    assert.ok(errorsOf((p) => { shot(p, "3A.1").changes_before = shot(p, "3A.1").changes_before.filter((c: any) => c.kind !== "wardrobe"); }).includes("wardrobe-unexplained"));
  });
  it("the model's documented duration", { skip }, () => {
    assert.ok(errorsOf((p) => { p.global.model.seconds = [4, 10]; }).includes("model-duration"));
  });
  it("a writer's handoff shot with an action and no beats asks for blocking, and still compiles the action in order", { skip }, () => {
    const f = variant((p) => { const s = shot(p, "2B.1"); s.action = "He turns from the window to the table set for one."; s.beats = []; });
    assert.ok(codes(validate(f).findings, "warn").includes("needs-beats"));
    assert.match(run("compile", f, "--generation", "2B").stdout, /Action \(in this order, across the shot\): He turns from the window/);
  });
  it("a locked shot under a handheld global look is a warning", { skip }, () => {
    assert.ok(warnsOf((p) => { shot(p, "2B.1").move = "locked off"; }).includes("camera-global-conflict"));
  });
});

describe("direction plan: compiled prompts", () => {
  const compiled = () => run("compile", AFTER).stdout;
  const clip = (text: string, id: string) => text.split(/^===== /m).find((b) => b.startsWith(`${id} `)) ?? "";

  it("one prompt per generation, sections in the fixed order", { skip }, () => {
    const out = compiled();
    for (const id of ["1A", "1B", "2A", "2B", "3A", "3B"]) {
      const c = clip(out, id);
      const order = ["REFERENCES:", "LOOK", "CLIP PURPOSE:", "CAST", "SCENE:", "START STATE", "SHOT 1", "AUDIO:", "AVOID:"].map((h) => c.indexOf(h));
      assert.ok(order.every((n) => n >= 0), `${id} misses a section`);
      assert.deepEqual([...order].sort((a, b) => a - b), order, `${id} sections out of order`);
    }
  });
  it("states each fact once: the look once, each costume once", { skip }, () => {
    const c = clip(compiled(), "1A");
    assert.equal(c.split("LOOK (whole clip)").length - 1, 1);
    assert.equal(c.split("flour-dusted espresso-brown waxed canvas apron").length - 1, 1);
    assert.doesNotMatch(c, /Wardrobe \(/);
  });
  it("keeps dialogue word for word and speech only in clips with lines", { skip }, () => {
    const out = compiled();
    assert.ok(clip(out, "1A").includes(`says: "Please${String.fromCharCode(0x2014)}just one."`));
    assert.ok(clip(out, "3B").includes('says: "Christmas orders are free."'));
    assert.match(clip(out, "2B"), /Speech: none; no one speaks\./);
    for (const id of ["1A", "2B", "3B"]) assert.match(clip(out, id), /No music/);
  });
  it("writes UTF-8 even when Python starts with Windows output encoding", { skip }, () => {
    const r = spawnSync("python3", ["-I", "-c",
      'import runpy, sys; sys.stdout.reconfigure(encoding="cp1252"); sys.stderr.reconfigure(encoding="cp1252"); sys.argv = sys.argv[1:]; runpy.run_path(sys.argv[0], run_name="__main__")',
      script, "compile", AFTER], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    assert.ok(clip(r.stdout, "1A").includes(`says: "Please${String.fromCharCode(0x2014)}just one."`));
  });
  it("carries the hands and props across clips", { skip }, () => {
    const out = compiled();
    assert.match(clip(out, "1A"), /START STATE[^\n]*The boy holds three small coins in his left mitten and the crayon drawing \(folded once\) in his right mitten/);
    assert.match(clip(out, "2A"), /END STATE[^\n]*The mother holds the crayon drawing \(open\) in her right hand/);
    assert.match(clip(out, "3B"), /START STATE[^\n]*The baker holds the cardboard carrier[^\n]*right hand/);
    assert.match(clip(out, "1B"), /Across the cut: the boy has handed the drawing up/);
  });
  it("binds the look's own reference image", { skip }, () => {
    const out = compiled();
    assert.match(clip(out, "3A"), /@char_baker_coat = the baker \(overcoat\)/);
    assert.doesNotMatch(clip(out, "3A"), /@char_baker\b(?!_)/);
  });
  it("text-only is complete; a storyboard adds one reference line and nothing else", { skip }, () => {
    const plain = clip(compiled(), "1A");
    assert.doesNotMatch(plain, /storyboard/i);
    const withBoard = clip(run("compile", variant((p) => { p.generations[0].storyboard = "@sb_1A"; p.generations[0].refs.push("@sb_1A"); })).stdout, "1A");
    assert.match(withBoard, /@sb_1A = the storyboard/);
    const strip = (s: string) => s.replace(/; @sb_1A = [^.]*/, "");
    assert.equal(strip(withBoard), plain);
  });
  it("refuses a plan with errors unless forced", { skip }, () => {
    assert.equal(run("compile", BEFORE).status, 1);
    assert.equal(run("compile", BEFORE, "--force").status, 0);
  });
  it("prints the derived ledger", { skip }, () => {
    const r = run("ledger", AFTER);
    assert.equal(r.status, 0);
    assert.match(r.stdout, /\| 3B\.4 \|.*baker: seated at the screen-right end of the bench, beside the boy/);
  });
});
