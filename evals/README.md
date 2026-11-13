# Evals

Behavioral scenarios for the skill. Each one installs the skill into a fresh temporary project, runs a prompt through headless Claude Code (`claude -p`), saves the output, and applies objective checks. Writing quality is judged separately, by reading each output against its scenario's `rubric`.

The checks are heuristics. A pass means the objective checks held on that run, not that the answer is good, and a fail on a regex can be a correct answer worded differently. Read the output before drawing a conclusion.

## Running

```bash
npm run build                                   # the evals install the built CLI
node evals/run-evals.mjs                        # every scenario, once
node evals/run-evals.mjs --only 12-camera-follow-smoothness,19-seedance-unwanted-bgm
node evals/run-evals.mjs --repeat 3             # three full runs, then a stability table
node evals/run-evals.mjs --recheck evals/results/<run>   # re-score saved output without calling Claude
```

Each scenario uses your Claude usage. Results go to `evals/results/<timestamp>/` (not committed).

## Reading results from more than one run

A single run is noisy: the same prompt can be worded differently each time, and a regex that needs one phrase will flip. Use `--repeat N` and read the stability table at the end:

- `STABLE` passed in every run.
- `FLAKY` passed in some runs. Open the failing outputs and decide whether the answer was wrong (a skill problem) or only worded differently (an evaluator problem). Fix the evaluator for the second case. Do not change correct skill instructions to satisfy a regex.
- `FAILING` failed in every run.

## Check types

| Type | Passes when |
|---|---|
| `skill_activated` | The skill was invoked, or one of its files was consulted |
| `skill_not_activated` | Neither happened |
| `read_file` | A skill file matching `pattern` was consulted (see below) |
| `knowledge` | At least `min` of the listed `facts` appear in the answer. Each fact is a labelled regex for something only the skill's references supply. This is the preferred check for questions, because it does not care how the model reached the files |
| `regex`, `not_regex` | The answer matches (at least `min` times) or does not match a pattern |
| `script`, `speakers`, `tag_density` | Dialogue-language and dialogue-format checks |

Each run installs a temporary copy of the skill per scenario. The evaluator removes the copies it created when the run ends, so repeated runs do not fill the disk; pass `--keep-projects` to keep them for inspection.

A file counts as consulted however the model got at it: the `Read` tool, a shell command that names it, or a `Grep` or `Glob` result that lists it. The shell keeps its working directory between calls, so a `cd` in one Bash call applies to the next. Earlier versions of the evaluator missed both cases and reported correct answers as failures.

## Keeping the baseline comparable

The numbered scenarios from 01 to 15 are the original baseline. Keep them as they are so results stay comparable across releases.

- **Scenario 02** is unchanged. Its Flash-aware update is scenario `24-panel-to-prompt-seedance-flash`, marked `variant_of` and `comparable_with_baseline: false`. Do not compare 24 with the baseline's 02.
- **Scenario 12** has a `revision` note: its rubric now separates Seedance 2.0 shot-based timing from 2.5 integer-second timestamps, and its camera-travel pattern accepts a camera that backs away in front of a walking subject. The baseline run failed only because the answer said "backs away" and not "track" or "follow".
- **Scenarios 08, 11, 13, 15, 16, 20 and 23** have a `revision` note: a check that counted a word or listed a few phrasings was replaced by a `knowledge` check on the facts the rubric asks for, because correct answers were failing on wording.
- **Scenarios 25 to 31** cover the storyboard and mapping work. Scenario 01 stays unchanged as the baseline storyboard gate; its rubric text predates the mapping (it says durations fit 6-second clips), and its objective checks still hold.
- **Scenarios 16 to 23** were added for the Seedance knowledge files. They use `knowledge` checks and carry a `revision` note where their checks were changed after first use.

A scenario that changes in a way that affects its objective checks gets a `revision` note with the date and the reason, or becomes a new scenario.

## Scenario fields

`id`, `title`, `prompt`, optional `first_prompt` (a first turn, run in the same session), `checks`, `rubric`. Optional: `fixtures`, `variant_of`, `comparable_with_baseline`, `revision`.

## Known instability

- **04-multi-character-assignment** is a known flaky baseline scenario, and it is not an evaluator defect. It needs the full description of each person at least twice in the prompt. Under Runway's 1,000-character limit the model usually describes each person once in full, then writes "the man" or "she". This is a real tension between the skill's rule to identify every person every time and the model's length limit. It failed in the baseline and in most later runs. Decide whether the rule or the check should give way before changing either; it was left unchanged on purpose.
- **13-dialogue-fit** failed once in about a dozen runs because the model answered a Veo request without invoking the skill. The answer was correct, so this is trigger variance and not an evaluator defect; the `skill_activated` check was kept on purpose.
