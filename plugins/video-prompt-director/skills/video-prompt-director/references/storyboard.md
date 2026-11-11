# Storyboard: from source material to approved panels

Contents:
1. Why the storyboard comes first
2. Accepting what the user already has
3. Panel format
4. How to cut a script into panels
5. Short-drama beats (optional check)
6. The approval step
7. After approval

## 1. Why the storyboard comes first

A video prompt describes one continuous clip. Decisions about what to show, in what order and for how long belong to the storyboard, not the prompt. If those decisions are made while writing the prompt, shots get overloaded, stories skip beats, and continuity breaks. Settle the sequence first, get it approved, then write one prompt per panel.

## 2. Accepting what the user already has

The skill works from any of these. Do not ask for a different format.

- A script or scene, in any language.
- A storyboard, shot list or panel list, in any format. Treat it as approved unless the user says it is a draft.
- Loose shot descriptions ("she opens the door, sees him").
- Reference images with notes about what each one controls.
- Existing prompts to repair or adapt.

Read everything supplied before writing. Do not invent earlier events, relationships or character details. Mark any gap you fill as an assumption.

## 3. Panel format

```
Panel 04 | 5 s | INT. KITCHEN, NIGHT
Task: the turn. Mira finds the envelope and decides not to open it yet. Emotion: held-back dread.
Shot: Medium shot, eye level, locked off.
Who: Mira (green coat, wet hair), alone.
Action: Mira sets her keys down, notices the envelope, stops.
Ends on: her hand hovering over the envelope, eyes on it.
Dialogue: none.
Carries in: coat on, keys in right hand. Carries out: hand above envelope.
```

Rules:
- One panel is one clip: one generation, with one main purpose, and as many cuts as the clip length allows (`references/pacing.md` section 7).
- Give each panel a duration the user can adjust. If the model's limit matters, check `references/models/`.
- State who is in frame and where, with a stable name or description.
- For a series, add the episode and the clip's position (clip 3 of 8) and the episode's emotional line in one sentence, so each clip knows its job.
- Check that the dialogue fits the clip (`references/pacing.md` section 2) before approval.
- Include dialogue exactly as supplied, with the speaker.
- Write "ends on" as a visual state, because the next panel starts from it.
- Keep panels brief. Detail belongs in the prompt stage.

## 4. How to cut a script into panels

1. Find the beats: each place where something is learned, decided, or changes.
2. Give each beat the smallest number of panels that shows it. A reaction can be its own panel when it carries the story.
3. Choose the shot size for what the viewer must see. A face for a reaction, a wider shot when positions or geography matter, an insert for an object that matters.
4. Check screen direction and positions across the sequence before approval (`references/continuity.md`).
5. Keep panels inside what the target model can hold. A crowded action sequence may need to be split into several panels.
6. Do not add a cut, a camera move or a gesture because a panel has a slot for it.

## 5. Short-drama beats (optional check)

A short drama usually has four parts: the **hook**, the **context**, the **escalation** and the **cliffhanger**. When the source is a short drama or vertical series episode, check that the panels cover them before you ask for approval:

1. **Hook:** the first panel creates a question in the first seconds, and starts inside the situation.
2. **Context:** only as much as the viewer needs to understand the situation, and it should not stall the story.
3. **Escalation:** the middle panels raise the stakes, pressure or reveal; each one changes something.
4. **Cliffhanger:** the last panel ends on the inhale, just before the answer, as a clear visual state.

Use this as a check, not a template. Do not add a panel for a part the script already covers, and do not force the structure on a source that is not a short drama.

## 6. The approval step

Present the panels, then stop. Say what you assumed. Offer the user a chance to change length, order, shot sizes or beats. Do not write video prompts until they approve, unless they asked for the whole thing in one pass. If the user changes a panel, update the neighbors' "carries in" and "carries out" lines.

## 7. After approval

Write one shot block per panel as described in `SKILL.md` section 3. Do not renumber or reorder panels. If writing a prompt shows that a panel cannot work (too much action for its duration, an impossible contact moment), say so and propose a revised panel rather than silently changing it.
