# Storyboard: from source material to approved panels

Contents:
1. Why the storyboard comes first
2. Accepting what the user already has
3. Panel format
4. How to cut a script into panels
5. Short-drama beats (optional check)
6. The approval step
7. After approval
8. Storyboard modes and panel counts
9. Visual beats and coverage
10. Action decomposition
11. Dialogue coverage
12. Panel to generation mapping
13. The planning workflow
14. Sheets and annotations

Sections 1 to 7 keep their numbers because other files cite them. Sections 8 to 14 add adaptive planning, coverage, action steps, dialogue coverage, the mapping from panels to generations, and the sheets made from the approved plan.

## 1. Why the storyboard comes first

A video prompt describes one continuous clip. Decisions about what to show, in what order and for how long belong to the storyboard, not the prompt. If those decisions are made while writing the prompt, shots get overloaded, stories skip beats, and continuity breaks. Settle the sequence first, get it approved, then write the prompts from the approved plan.

A storyboard here is a production plan: it shows how the video will actually unfold, shot by shot, and how each shot becomes a generation. It is not a summary of the beginning, middle and end.

## 2. Accepting what the user already has

The skill works from any of these. Do not ask for a different format.

- A script or scene, in any language.
- A storyboard, shot list or panel list, in any format. Treat it as approved unless the user says it is a draft.
- Loose shot descriptions ("she opens the door, sees him").
- Reference images with notes about what each one controls.
- Existing prompts to repair or adapt.

Read everything supplied before writing. Do not invent earlier events, relationships or character details. Mark any gap you fill as an assumption.

## 3. Panel format

A panel is one meaningful visual beat or shot. It is not automatically one video clip: section 12 says how panels map to generations.

**Compact form** (Quick mode, and any panel that needs little):

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

**Full specification** (Production and Cinematic modes). Every panel states:

| Field | What it holds |
|---|---|
| Panel number | Order in the sequence; never renumbered after approval |
| Shot size | Per `references/cinematography.md` |
| Camera angle | Eye level, high, low, over the shoulder, and which side |
| Composition | Where the subject sits in the vertical frame, depth layers, what is kept clear |
| Character positions | Who stands where, tied to a landmark or screen side |
| Character orientation | Who faces which way and where each person looks |
| Facial expression | The visible face, not a label (`references/performance.md`) |
| Physical action | What the body and hands do, in order |
| Relevant props | Only props that matter here, with their state |
| Camera movement | Locked off, or one small motivated move (`references/camera-language.md`) |
| Dramatic purpose | The panel's job: what the viewer learns, feels or fears |
| Continuity with the previous panel | What carries in; what changed and why |
| Intended ending state | The visual state the next panel starts from |

Plus the duration (adjustable), the speaker and the exact line for any dialogue, and the panel's mapping type (section 12).

Production and Cinematic panels carry every field. Do not shorten them to the compact form to save space: if the storyboard would be too long to read in one answer, present it one scene at a time, and keep each panel complete. A panel that lacks its positions, orientation, expression or props cannot be turned into a sheet or a prompt without guessing.

Rules:
- Give each panel a duration the user can adjust. If the model's limit matters, check `references/models/`.
- State who is in frame and where, with a stable name or description.
- For a series, add the episode, the clip's position (clip 3 of 8) and the episode's emotional line in one sentence, so each clip knows its job.
- Check that the dialogue fits the clip (`references/pacing.md` section 2) before approval.
- Include dialogue exactly as supplied, with the speaker.
- Write "ends on" as a visual state, because the next panel starts from it.
- Quick panels stay brief. Full specifications stay about the picture and the action; the wording of the video prompt still belongs to the prompt stage.

## 4. How to cut a script into panels

1. Find the beats: each place where something is learned, decided, or changes (section 9).
2. Give each beat the smallest number of panels that shows it. A reaction can be its own panel when it carries the story. An action whose steps matter to understanding gets a panel per step (section 10).
3. Choose the shot size for what the viewer must see. A face for a reaction, a wider shot when positions or geography matter, an insert for an object that matters.
4. For dialogue, pick coverage by dramatic purpose, not by habit (section 11).
5. Check screen direction and positions across the sequence before approval (`references/continuity.md`).
6. Keep panels inside what the target model can hold. A crowded action sequence may need to be split into several panels.
7. Do not add a cut, a camera move or a gesture because a panel has a slot for it, and do not add a panel to reach a count.

## 5. Short-drama beats

A short drama has four parts: the **hook**, the **context**, the **escalation** and the **cliffhanger**. When the source is a short drama or a vertical series episode, load `references/episode-beats.md`, fill the beat map before you list panels, and check the panels against it before you ask for approval:

1. **Hook:** panel 1 puts a person and a problem in frame in the first 2 to 3 seconds, readable with the sound off.
2. **Context:** by second 5 to 8 a stranger can say who, what relation, who holds power and what is at stake, from what the camera shows.
3. **Escalation:** each panel makes things worse, tighter or costlier than the one before; no run of panels repeats one emotion.
4. **Cliffhanger:** the last panel shows a change and ends on the inhale, as a clear visual state, with one specific question left.

Story-critical evidence (a signature, message or document) gets its own readable insert panel. Do not add a panel for a part the script already covers, and do not force the structure on a source that is not a short drama.

## 6. The approval step

Present the panels and the mapping table (section 12), then stop. Say what you assumed and which mode you chose and why. Say plainly that a panel is a shot or a beat and not automatically one clip, and that the mapping shows which panels become clips, shots inside one generation, keyframes or post-production work. Offer the user a chance to change the mode, length, order, shot sizes, beats or the mapping. Do not write video prompts until they approve, unless they asked for the whole thing in one pass. Sheets and keyframe images (section 14) are made from the approved plan.

The mapping is drafted while you plan the shots and locked at approval. If the user changes a panel, update the neighbors' "carries in" and "carries out" lines and the mapping rows it touches, and say what moved.

## 7. After approval

Write the prompts from the approved mapping: one prompt per generation, with one shot block per shot as described in `SKILL.md` section 3. Do not renumber or reorder panels. If writing a prompt shows that a panel cannot work (too much action for its duration, an impossible contact moment), say so and propose a revised panel and its mapping row rather than silently changing it.

## 8. Storyboard modes and panel counts

Recommend a mode from the scene and say why. The user can override it. Never force a scene into two or three panels, and never add a panel that is not a meaningful beat or shot.

| Mode | Use when | Panels in the scene |
|---|---|---|
| **Quick** | An uncomplicated scene: one or two people, one or two beats, little or no dialogue | 3 to 5 |
| **Production** (default) | Most scenes, with full camera coverage and character actions. Standard: 6 to 9 panels. Detailed (long dialogue, a contact sequence, a reveal): 9 to 12 | 6 to 12 |
| **Cinematic** | An elaborate dialogue, a dramatic confrontation, an action sequence, or complicated visual storytelling | 12 to 15 per sheet |

Count first, then choose: list the visual beats (section 9), add coverage panels only where a beat needs one (an establishing shot, an insert, a reaction), merge what one shot can hold, and let the count decide the mode. Signals that push a scene up a mode: several people in frame, physical contact whose steps matter, a dialogue with turns and reactions, a reveal, several locations, an action sequence.

Keep three counts apart. They are planning recommendations for this skill and for Seedance's own guidance, not technical limits of any API:

| Level | Recommendation | Source |
|---|---|---|
| Panels in a scene (the mode) | Quick 3 to 5, Production 6 to 12, Cinematic 12 to 15 | HEURISTIC (this skill) |
| Panels on a production sheet | 9 (3 by 3) by default so every panel stays legible; up to 12 if the image tool keeps them legible; more sheets, not smaller panels | HEURISTIC |
| Panels on a Seedance reference sheet | Cut from one generation. Soft target 12; 15 is the upper end the guide recommends ("better suited for 15 panels or fewer"). An 18-panel example gave still frames or wrong order | 15: OFFICIAL (Seedance 2.5 prompt guide, read 2026-11-13); soft target 12: HEURISTIC. A recommendation, not an API limit |

A sequence longer than the mode allows, or longer than 15 panels, is divided into several sheets at natural breaks (a new location, a time jump, a shift of power). Each sheet gets its own continuity header (`references/storyboard-images.md`) and starts from the previous sheet's ending state. For human review the whole production storyboard may run across many sheets.

## 9. Visual beats and coverage

A **visual beat** is a moment the viewer must see for the story to land: something is learned, decided, threatened, revealed or changed. Find them before choosing shots.

1. List the beats in order, each in one line.
2. For each beat, name the shot's purpose (establish, action, insert, reaction, close-up, reveal, dialogue coverage). The definitions and when to use each are in `references/cinematography.md` section 10.
3. Cover by purpose. A scene needs the shots that show its beats, not every angle available. An establishing shot is there to place the audience; an insert is there for an object that matters; a reaction is there because the story turns on a face.
4. Check the vertical frame: mostly mediums and close-ups, with a wide shot only to place people (`references/camera-language.md` section 10).
5. Check pressure and variety: if three adjacent panels repeat one framing and one emotion, replace one with a new fact or a new size.

## 10. Action decomposition

When an action has several physical steps that the viewer needs in order to understand the scene, give each step its own panel. When one panel can carry the whole action safely, keep it as one.

Decide by asking:
- Does the viewer need the intermediate step to follow who did what to whom?
- Does the action involve contact between bodies, or hand work a model tends to break?
- Does a reaction between steps change the meaning (a person noticing a hand before it closes)?

Example: someone grabs another person's wrist. As one panel it hides who moved first, who noticed, and what the grip did. As panels:

1. The approaching hand (insert, or a medium on the arm).
2. The other person noticing (close-up on the eyes, the look going down).
3. The wrist being grabbed (insert on the contact).
4. The physical reaction (the body twisting, a breath, a dropped object).
5. The pull away, or the release (medium, so the whole body reads).

How to describe each step inside a shot or clip (which hand, where it starts and ends, one main action per short clip, weak spots such as complicated contact) is in `references/physical-realism.md` section 6. The mapping may still put two or three of these panels into one generation (section 12), or use an independent keyframe for the contact moment.

Do not split an action just to reach a panel count, and do not stack steps in one panel that a model will blend into one smear.

## 11. Dialogue coverage

For a dialogue scene, choose coverage by dramatic purpose. The shot types and the minimal sets by scene type are in `references/cinematography.md` section 11. At the storyboard level:

- Start from what the exchange does: reveal something, shift power, hide something, hurt someone. Cover the line or the face that carries that, and skip the rest.
- Give a panel to an important pause, a silence or a listener's reaction when the story turns there.
- Keep screen sides and the line between the speakers fixed across panels (`references/continuity.md` sections 4 and 11).
- Do not generate every possible angle. Every panel needs a purpose that another panel does not already serve.
- Check that each spoken line fits its clip with room for the reaction (`references/pacing.md`).

## 12. Panel to generation mapping

A panel does not automatically equal a video generation. Map each panel to one of four types, and show the mapping before the prompts.

| Type | Meaning | Use it for |
|---|---|---|
| **P** | The panel is one independently generated clip (or the one shot that fills a generation) | Important dialogue, reactions, character interaction, complex scenes that need precise control. The default |
| **M** | Several panels are different shots inside one generation | About two or three closely related shots, when coherence is likely to gain. They share one prompt and one budget |
| **K** | The panel is a keyframe, not a complete shot: an independent image used as a first or last frame or in an ordered keyframe set | Strict visual alignment: a contact moment, a key pose, a reveal. It costs a reference slot |
| **X** | The panel is done in post-production | Readable text and overlays, held frames, transitions, sound. The generated shot supplies only the surface |

A panel can combine types (P plus X: a generated insert of a blank phone screen, with the message overlaid in the edit). A continuous take is a P generation whose panels are beats of one unbroken shot, not cuts: mark it "P, continuous". Generations that continue one another start from the previous generation's last frame or ending state.

Choose the generation structure from the scene, not from habit:

| Structure | When it helps | What it costs |
|---|---|---|
| Continuous take | Uninterrupted action and camera movement | The whole action must fit one clip |
| Multi-shot generation (M) | About two or three closely related shots, when coherence is likely to gain | Models can drop or blur later shots; timing is not guaranteed |
| Separate generations (P) | Dialogue, reactions, interactions, complex scenes needing precise control | More clips to match at the joins |
| Connected generations | A scene longer than one clip, preserving the previous ending state | Drift can accumulate along a chain |

Show the mapping as a table:

```
| Panel | Type | Generation | Shot in it | Duration | Input | Notes |
|---|---|---|---|---|---|---|
| 01 | P | G1 | 1 of 1 | 4 s | character references | establishing; ends on both still |
| 02 | M | G2 | 1 of 2 | 7 s total | reference sheet + references | speaker line; starts from P01's end |
| 03 | M | G2 | 2 of 2 | (in G2) | (in G2) | listener reaction, one pause |
| 06 | K | G3 | keyframe 3 | 5 s | independent image | contact moment, strict alignment |
| 09 | P + X | G6 | 1 of 1 | 3 s | phone reference | blank screen; message overlaid in the edit |
```

Check the mapping before approval:
1. **Duration:** the shots of a generation fit its length, with room for the dialogue and the action. Planning the shot lengths: one pipeline observed that cuts under about 2 seconds were rarely worth it. That is an OBSERVED heuristic, never a minimum. If a generation holds many shots for its length, say so and offer to split it.
2. **Dialogue:** each line fits its clip (`references/pacing.md`).
3. **References:** count the images, videos and audio clips each generation needs against the target model's profile. Storyboard sheets and keyframes are images and count. The limits differ by model version (`references/models/seedance.md` routes to them), and a limit the documentation does not give stays UNVERIFIED.
4. **Sheets:** a model's reference sheet covers the panels of one generation, not the whole scene (section 14).
5. **Joins:** each generation's opening state equals the previous generation's ending state (`references/continuity.md` section 12).
6. **Post work:** every X item says what is added and when.

## 13. The planning workflow

Quick mode uses steps 1, 2, 5, 6, 10 and 12. Production and Cinematic modes use all of them.

1. **Story and scene breakdown:** read the source, mark the scenes, fill the beat map for a short drama (section 5).
2. **Visual beats:** list what the viewer must see (section 9).
3. **Shot planning and coverage:** assign a purpose and a shot to each beat (sections 9 and 11, `references/cinematography.md`).
4. **Action decomposition:** split the actions whose steps matter (section 10).
5. **Panel specification:** write each panel (section 3), and recommend the mode (section 8).
6. **Draft mapping:** assign types and generations while planning (section 12).
7. **Production storyboard:** make the detailed sheet from the canonical plan (`references/storyboard-images.md`).
8. **Seedance reference sheets:** for each multi-shot generation that will use one, make a simple line-art sheet from the same plan (`references/storyboard-images.md`).
9. **Review and approval:** the user reviews panels, mapping and sheets (section 6). The mapping is locked.
10. **Mapping check:** confirm durations, dialogue fit, reference budget and joins (section 12).
11. **Keyframes:** make independent keyframe images for the K panels (`references/storyboard-images.md`).
12. **Prompts:** write one prompt per generation from the approved mapping (section 7).

All sheets and keyframes come from one canonical shot plan, so they always show exactly the same approved sequence. Do not plan twice.

## 14. Sheets and annotations

Two sheets can be made from the one approved plan, and the image-generation prompts for them are written in `references/storyboard-images.md`:

- **Production storyboard:** detailed, consistent illustrations for human review. Panels carry no text.
- **Seedance reference storyboard:** simple line art, no text, clean composition and action, cut from one generation. Identity comes from separate reference assets. Seedance treats a multi-panel sheet as high-level guidance, not frame-by-frame replication; use independent keyframes when strict alignment is needed, and supplement the sheet with written instructions for actions, camera movement, style and continuity.

Panel numbers, shot descriptions, the mapping table and continuity notes go in the conversation, outside the images. Save a separate document only when the user asks for one.
