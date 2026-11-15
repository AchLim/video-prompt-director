# Director layers: from creative intent to an executable clip prompt

Contents:
1. Why layers
2. The five layers and what each owns
3. The direction plan (the handoff format)
4. The continuity director: state, not prose
5. The validator: contradictions versus intended changes
6. Compiling a clip prompt
7. With or without a storyboard
8. What the director may change, and what it may not

## 1. Why layers

A clip prompt mixes decisions of very different lifetimes: the film's look (fixed for the film), a room's layout (fixed for a scene), who holds what (changes with every handover), and the timing of one glance (one shot). Written as one block of prose, the long-lived facts get repeated with small variations, the short-lived ones get forgotten, and contradictions slip in ("locked off" in a shot under a global "handheld"). Layers give every fact one home. The compiler then states each fact once per prompt, in a fixed order, and the validator checks the whole sequence before anything is generated.

The layers are a way of working, not extra text. A compiled prompt is usually shorter than a hand-written one, because nothing is said twice.

## 2. The five layers and what each owns

| Layer | Owns | Lives in | Stated in the prompt as |
|---|---|---|---|
| **Global director** | Format, ratio, fps, image quality, light and grade, lens, camera restrictions, audio policy, what to avoid; each person's appearance, costume per look, and voice; each prop's and place's design | `global` | `LOOK` (once), `CAST` (people in this clip only), `AUDIO`, `AVOID` |
| **Scene director** | Location, time, weather, layout as landmarks, light sources, ambience; where everyone and everything starts | `scenes[]` | `SCENE`, and the first clip's `START STATE` |
| **Shot director** | Size, angle, camera position and move, composition, who is in frame and on which side, the timed beats, the lines, the sounds, the performance | `generations[].shots[]` | `SHOT n (a–b s)` blocks |
| **Continuity director** | Positions, facing, wardrobe, what each hand holds, where each prop is and its condition, environment state | derived by replaying the plan (section 4) | `START STATE`, `Across the cut`, `END STATE` |
| **Validator** | Contradictions, impossible hands, rushed or overlapping actions, unmotivated sounds, missing references | `scripts/direction_plan.py validate` | nothing: it blocks or warns before generation |

The creative intent (what the scene is for, what each person wants, what the audience must notice, what must stay hidden) comes from the writer or the user. A creative handoff (for example Snack Short Hub's `npm run production -- <episode> handoff`) arrives as a direction plan whose shots carry `action` (what must happen, in order) but no `beats`: the director blocks each one into timed beats with hands and props, then validates and compiles. Extra keys the writer adds (`story`, `constraints`, a person's `psychology`, a line's `intention`) are for the director to read; the compiler ignores them. It enters the plan as `purpose` on a generation and `must_show` / `keep_hidden` on a shot, and never as camera choices (section 8).

## 3. The direction plan (the handoff format)

One JSON file per film or episode, `"version": "direction-plan/1"`. A complete worked plan: `examples/bakery-direction-plan.json`.

```json
{
  "version": "direction-plan/1",
  "global": {
    "model": { "name": "seedance-2.5-flash", "seconds": [4, 30], "max_images": 10 },
    "ratio": "9:16", "fps": 24,
    "look": { "image": "...", "light": "...", "lens": "...", "camera": "...", "atmosphere": "..." },
    "audio": { "dialogue": "native | post", "music": false },
    "avoid": ["..."],
    "cast": { "baker": { "tag": "@char_baker", "short": "the baker", "appearance": "...",
                         "looks": { "A": { "label": "apron", "costume": "..." }, "B": { "tag": "@char_baker_coat", "costume": "..." } },
                         "voice": "...", "hands_covered": "", "pronoun": "he" } },
    "props": { "cake": { "tag": "@prop_cake", "short": "the Christmas cake" }, "coins": { "short": "three small coins" } },
    "locations": { "bakery": { "tag": "@loc_bakery", "short": "the corner bakery", "layout": "...", "light": "..." } }
  },
  "scenes": [ { "id": "S1", "location": "bakery", "time": "...", "weather": "...",
                "start": { "positions": {}, "facing": {}, "wardrobe": {}, "hands": { "boy": { "left": "coins", "right": "drawing" } },
                           "props": {}, "env": { "door": "closed" } } } ],
  "generations": [ { "id": "1A", "seconds": 12, "scene": "S1", "refs": ["@char_baker", "..."], "purpose": "...", "storyboard": "@sb_1A (optional)",
    "shots": [ { "id": "1A.1", "start": 0, "end": 4, "camera": "...", "move": "held still", "over": "baker (only for over-the-shoulder)",
                 "in_frame": ["boy", "baker"], "sides": { "boy": "left", "baker": "right" }, "props": ["cake"], "hands_hidden": { "boy": ["right"] },
                 "changes_before": [ { "kind": "prop", "prop": "drawing", "holder": "baker", "hand": "both", "note": "the boy has handed it up" } ],
                 "beats": [ { "id": "b1", "who": "baker", "t": [0, 1.2], "do": "flips the sign to CLOSED", "hand": "right" } ],
                 "lines": [ { "who": "boy", "at": 2.2, "text": "Please, just one.", "offscreen": true, "delivery": "..." } ],
                 "sounds": [ { "at": 1.0, "what": "the sign knocking on glass", "cause": "b1" }, { "what": "wind", "cause": "ambience" } ],
                 "perform": { "baker": "..." }, "must_show": ["..."], "keep_hidden": ["..."],
                 "changes": [ { "kind": "env", "item": "sign", "to": "CLOSED" } ], "end_state": { "positions": {} } } ] } ]
}
```

Field rules:
- **Beats.** One actor, one action, a time window inside the shot. Hand work names the hand (`left`, `right`, `both`) and the object it `takes` or `releases` (with `to`, where it goes). An action done while the hand keeps holding something is `holding_ok`. A facial beat may set `"channel": "face"` so it can overlap a body action of the same person.
- **Lines.** Word for word, with the second they start. `offscreen` when the speaker's mouth is not seen.
- **Sounds.** Every sound has a `cause`: a beat id, a person, `ambience` or `offscreen`. A timed sound must fall inside its beat.
- **Changes.** Every state change is declared: `changes` after a shot's beats, `changes_before` across a cut (with a `note` that the compiler prints as "Across the cut"). Kinds: `position`, `facing`, `wardrobe`, `prop` (with `holder` and `hand`, or `to`), `env`, `hands`.
- **Looks.** A person with more than one look must have it set at the start of each scene; a look may bind its own reference image (`tag`).

## 4. The continuity director: state, not prose

Video models do not remember the previous clip. The continuity director therefore keeps a state and replays the plan in order:

1. A scene starts from its `start`.
2. Each shot applies `changes_before`, then its beats (takes and releases move objects between hands and places), then `changes`.
3. The state at the start of each generation is written into that prompt (`START STATE`); handovers and moves between shots are written as `Across the cut`; the state at the end is written as `END STATE`, which the next clip's `START STATE` repeats.

So every clip says, in plain words, where everyone stands, which way they face, what is in each hand, where each prop is and in what condition. `python3 scripts/direction_plan.py ledger plan.json` prints the derived ledger (`references/continuity.md` section 7).

## 5. The validator: contradictions versus intended changes

`python3 scripts/direction_plan.py validate plan.json` (exit 1 on errors). Everything it checks is deterministic. A change is **intended** when the plan declares it (a `changes` or `changes_before` entry, `crosses_line` on a shot, a new scene); anything else that differs is a contradiction.

| Check | Code | Severity |
|---|---|---|
| A person or prop in frame with no reference attached; an attached image nobody shows | `missing-ref`, `unused-ref` | error, warn |
| Someone in frame who was never placed | `person-not-placed` | error |
| A prop appears from nowhere; a prop shown while whoever holds it is out of frame | `prop-appears`, `floating-prop` | error |
| Something held by a person in frame but not mentioned (the model drops it) | `held-prop-unstated` | warn |
| A hand used while it holds something; a hand that takes a second object; more than two things in two hands; letting go of something not held | `hand-busy`, `hand-full`, `hand-count`, `release-not-held` | error |
| Finger work in mittens or gloves | `finger-in-mitten` | error |
| A beat too short for a natural performance; two body actions of one person at once; one beat chaining several actions | `beat-rushed` (warn `beat-tight`), `beat-overlap`, `beat-compound` | error, warn |
| A beat by someone not in frame; a line by someone not in frame and not marked off-screen; lines that overlap or overrun the shot | `beat-offscreen`, `speaker-absent`, `line-overlap`, `line-overflow` | error |
| A sound with no cause, or out of sync with its beat | `sound-cause`, `sound-sync` | error |
| A zoom; a locked camera that also moves; several moves in one cut; a locked shot under a handheld global look | `camera-zoom`, `camera-conflict`, `camera-moves`, `camera-global-conflict` | error, warn |
| An over-the-shoulder shot that directs the face of the person whose back is to camera | `ots-face` | error |
| Screen sides flipping inside a scene without a declared crossing; two or more people with no sides | `side-flip`, `sides-unset` | error, warn |
| Two looks of one person in one generation; a look change with no declared change | `wardrobe-mixed`, `wardrobe-unexplained` | error |
| An environment state that contradicts the current one | `env-conflict` | error |
| A generation outside the model's documented durations or image count | `model-duration`, `too-many-refs` | error |
| A shot that arrived from the writer with its required action but no timed beats | `needs-beats` | warn |

The timing table behind `beat-rushed` is a planning heuristic (`references/action-blocking.md` section 3), not a model fact. The checker reads the leading verb of a beat; when it misjudges an action, set the beat's window to what the action really needs and say why in `perform`, rather than bending the wording to please the checker.

What the validator cannot judge stays your job: whether a performance is believable, whether a camera position actually shows what the shot needs, whether the drama lands. Section 4 of `SKILL.md` still applies.

## 6. Compiling a clip prompt

`python3 scripts/direction_plan.py compile plan.json [--generation ID]` writes one self-contained prompt per generation, refusing a plan with errors (`--force` to override). The order is fixed and each fact appears once:

1. `REFERENCES`: each attached image and what it controls.
2. `LOOK`: the global look, once.
3. `CLIP PURPOSE`: the story job of this clip, one sentence (from the writer).
4. `CAST`: only the people in this clip, with the costume of their current look; a voice only for people who speak.
5. `SCENE`: place, time, weather, layout, light.
6. `START STATE`: the inherited continuity.
7. `SHOT n (a–b s)`: camera, who is in frame and where, then a timeline of beats, lines and sounds in time order, then the performance notes, `Must read clearly` and `Keep out of view`.
8. `END STATE`: what the next clip starts from.
9. `AUDIO`: ambience, the speech rule, no music unless the plan asks for it.
10. `AVOID`.

The compiler writes English. For a pipeline that sends Chinese or another language, use the compiled prompt as the plan and translate it, keeping the order and the timings. Check the result against the model's prompt-length limit (`scripts/count_prompt.py`).

A pipeline that adds its own blocks (a wardrobe list, a voice list, a pacing block) must not add them to a compiled prompt: `CAST` already carries costume and voice, and a second copy is where contradictions start.

## 7. With or without a storyboard

A storyboard is optional. Text-only generation is a complete path: the plan carries everything a storyboard would decide (framing, positions, sides, the order of actions) and the compiled prompt states it in words.

When a storyboard image exists for a generation, set `"storyboard": "@tag"`. The compiler then adds one reference line that ties the panels to the timed shots and says the written timing and action win where they differ. A storyboard helps most with composition (where people sit in frame, foreground and depth) and with matching cuts; it does not replace the timed beats, the hand states or the lines, which only text can make exact. Never write a prompt that depends on the storyboard for information the text leaves out.

## 8. What the director may change, and what it may not

The creative side owns the story: events, their order, dialogue, who knows what, what the audience must see and what stays hidden. The director owns how it is shown: camera, blocking, timing, hands, composition, sound sync.

- **Do** fix what cannot be executed: give a pointing child a free hand, move a reaction to a shot that sees the face, split an overloaded beat, add the handover a cut skipped. Report each such fix in one line after the prompts.
- **Do not** silently change an essential story event, a line, the order of events, a reveal or what must stay hidden. If the story as written cannot be shown (a reaction to something the character cannot yet know, a line that cannot fit any clip length the model allows), stop and say so, with a proposal.
