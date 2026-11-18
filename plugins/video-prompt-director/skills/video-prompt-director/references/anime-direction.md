# Anime direction (style mode)

A style mode of the director, not a separate model or workflow. Every other rule in `SKILL.md` still applies: plan first, timed beats, one actor and one action per window, exact dialogue, continuity, the model's own limits. This file changes the look, the motion language and the wording. The rules are working practice from production use. They are refined by tested results; record those in `references/models/seedance/test-log.md`. Do not state a Seedance capability or limit from this file; those live in `references/models/`.

## 1. Choosing the mode

Ask once, before writing, unless the user already said: **realistic live-action look, or anime?** Offer it as a choice, not a quiz. If the brief says "anime", "cel-shaded", "2D animation" or names a 2D look, take anime and state the assumption. If the brief is photographic, take realistic and do not mention this file.

Within anime, settle the sub-look in one question when it changes the result, otherwise state an assumption the user can veto:

| Sub-look | Traits to write |
|---|---|
| Modern TV action | clean thin outlines, crisp cel shading with hard shadow shapes, saturated accent colors, bright specular glints in the eyes |
| Soft slice-of-life or fantasy | pastel palette, painted watercolor-like backgrounds, soft gradients in the sky, gentle rim light, thin outlines in a darker tone of the fill |
| Dark seinen or thriller | desaturated palette, heavy blacks, hatched shadows, sodium or neon accents, muted skin tones |
| Retro 90s cel | slight grain, softer edges, limited palette, matte painted backgrounds, a subtle film-scan texture |

Describe traits, never studio names, series titles or real artists (`references/constraints.md` section 12). Characters are original.

## 2. The anime project look (write once, repeat in every prompt)

One sentence, reused word for word, in the global layer of a direction plan: the medium, the line, the shading, the palette, the background treatment and the frame rate feel.

> 2D hand-drawn anime look: thin dark-tone outlines of steady weight, flat cel-shaded color with one hard-edged shadow tone per surface, painted background with soft gradients, saturated but harmonized palette, animated on twos (a slightly stepped, hand-drawn rhythm).

Rules:
- Do not mix photographic words into an anime prompt: no lens in millimeters, film grain, skin pores, subsurface scattering or "photorealistic". Depth of field becomes "background softly painted out of focus" and light becomes "a hard-edged rim light".
- Do not mix anime words into a realistic prompt. Keep the modes apart.
- In anime mode you may name the medium ("anime look") because it is the wanted look. In realistic mode, still never name anime to exclude it (`references/constraints.md` section 12).

## 3. Characters: stable design

Anime character drift is faces going "off-model" (eyes change size, hair partings move, outline weight shifts). Counter it:

- Describe each character as a **design**: hair shape and color (and how it moves), eye color and shape, outfit with its main color blocks, one or two signature marks (a scar, a hairpin, a ribbon). Reuse the identical wording every shot.
- Prefer a **character reference sheet** (front, three-quarter, back) as the identity reference, in the same art style as the project look. Bind it by role, per the model's reference syntax (`references/reference-direction.md`).
- Keep face proportion stable: say "same face design as the reference, eyes the same size and spacing" when two shots must match. Tell the model what stays fixed, not what to avoid.
- Large expressive eyes and small mouths mean mouth shapes are simple. Dialogue is carried by open, half-open and closed mouth shapes plus eye and brow changes. Do not direct realistic lip detail.

## 4. Motion language

Anime reads differently from live action: held frames, accents and economy are style, not defects.

- **Holds.** A character can hold a pose while hair, cloth, breath or the background moves. Specify the hold and what still moves: "she holds still, hair and ribbon lift in the wind".
- **Accents.** One impact beat per action: a pose snaps, a smear or speed-line frame for a fast strike, a brief held pose after it. Keep it to one accent per beat.
- **Secondary motion.** Hair, scarves, sleeves, falling petals, dust and steam are the cheapest way to make a still figure feel alive. Name the direction and speed.
- **Walk and run.** Simple and rhythmic. Keep a character's action count low; fast multi-limb choreography warps (`references/physical-realism.md`).
- **Action scenes.** Break them into short beats with a clear pose at the end of each. Prefer a strike, a block and a reaction across a cut to a ten-hit exchange in one clip.
- **Dramatic stillness.** A held close-up with an eye glint, wind in hair and a slow push is a standard anime beat and a safe one for the model.

## 5. Camera

Use the same discipline as live action (`references/camera-language.md`): one move per cut, subject and camera independent, a stated start and end.

Anime vocabulary that helps:
- **Pan across a painted background** or a slow parallax move (foreground, midground and background shifting at different speeds) for establishing shots.
- **Hold-and-push** on the face for the emotional beat.
- **Low-angle hero shot** and **high-angle wide** for scale in action.
- **Impact framing**: a brief tilted or off-axis frame on the strike, then back to level. One per sequence, motivated by the action.
- **Over-the-shoulder** and **reverse shots** for dialogue, on the same side of the line.

The default "no zoom or dissolve at a cut" still holds; a stylized speed-zoom is an explicit, single, named choice and is not a default.

## 6. Light, color and environment

- Light is **graphic**: a hard-edged shadow shape, a single rim light, a sky gradient, a lens-flare-like glow only if the look wants it. State the light's direction and color once per location.
- Time of day through palette: golden-hour orange with long soft shadows; blue-hour cool with warm window glow; night with a saturated moon rim and neon accents.
- Backgrounds are **painted**: name the place, the main shapes and the palette, and say it stays still and consistent while the character acts.
- Weather and particles (rain, petals, snow, sparks, cloud shadows) add life without body motion. Name the direction and density.

## 7. Dialogue and audio

- Dialogue is exact, in its original language. Japanese, English and other languages are all valid; ask which is spoken, and keep supplied lines unchanged.
- Keep mouth action simple and timed to the line. Listeners react with eyes, brows and small head movement while another speaks.
- Anime sound language: a distinct sound for each impact or whoosh, ambient room tone and wind, silence for emphasis. Score defaults to none unless wanted (`references/audio-direction.md`).
- On-screen text and subtitles stay off by default (`references/constraints.md`).

## 8. Constraint wording in anime mode

Say the medium once as the wanted look, then list only concrete faults:

> Style: High-quality 2D cel animation, clean linework, flat cel shading, not a 3D render. Lines and cel shading stay clean, no jitter or flicker. The face matches the reference exactly at any distance. No subtitles, on-screen text or watermark.

## 9. Production template (Seedance, multi-cut anime clip)

One generation holds a short scene: usually 15 to 30 s, 6 to 13 cuts, with the dialogue it needs. Write it in this order.

```
[No BGM] <one paragraph: the genre and "clean 2D cel animation", line, fill and shading words, "keep the face, eye shape, build, hairstyle and costume of the model sheet, do not show the sheet on screen", no mid-clip change in people or props, camera uses only the specified moves, no subtitles, text or watermark>
Total <N>s · 9:16 · <K>-cut multi-shot · real time · no slow motion, no fades
Reference
Character : @Name — face, wardrobe and build match 100%. @Name's voice is @Name_Voice.
Background : @Place — inherit only the space, materials, lighting and mood; do not inherit composition, angle or color.
(Effect or prop references as needed: @FX, @Prop)
Timeline
[0-2s] ...
Constraints
<spoken-line count and who may speak, silence after lines, sound, no music, one lens per cut, one action per beat, identity and line-quality rules>
Style (unchanged every time)
Style: ...
Continuity: Characters, props, environment identical across every cut. No identity drift.
Audio: ...
```

Checks before returning:
- **K equals the number of timeline windows and N equals the last end time.** Fix the header, never leave it stale after trimming a beat.
- **Every character who speaks has a voice tag.** A character without one is not given another character's voice. If a speaker has no voice reference, anchor the voice in words ("the same low, calm adult man's voice as earlier") and say so.
- **The spoken-line count matches the `{ }` lines**, inner voice included, and the Constraints name it ("exactly N lines; nobody else speaks").

### Shot line

`[a-bs]` + shot size and angle + who, doing one action + the camera, stated once + `〈sound〉` when a sound matters. Silent beats end "No dialogue." A held frame says "the camera does not move". A cut belongs to its own window; never hide one inside a window ("...and it cuts to a close-up").

### Dialogue

- Spoken: `<shot>. <Name>, <tone>, says in Japanese in @Name_Voice's voice: {line} One second of silence after the line.`
- Inner voice: "her inner voice is heard in voice-over in @Name_Voice's voice: {line}. She does not move her mouth."
- Off-screen: "a low, calm adult man's voice is heard from off screen: {line}. The speaker is not shown. @A and @B do not move their mouths."
- When two people are in frame: "Only @X speaks this line; the others do not move their mouths."
- Lines stay exactly as supplied, in their language.

### Techniques

- **Say what does not change at the risky moment.** A prop attached to an arm: "the blade is attached to his arm, he does not hold a separate sword". A breakage: "only the blade breaks, the armor stays intact, no wound on her hand". A power-up: "the uniform and hairstyle stay as they are".
- **Name the contact.** "What he holds is the fabric of the sleeve, not her wrist or her hand."
- **Transformation:** two references for the two forms; "keep the figure's position and build the same before and after the change"; time it ("covers the body in under one second").
- **Super-deformed gag:** name the switch in and the return ("returns to the cel animation form"). When it is not wanted: "no exaggerated super-deformed drawing".
- **Emotion by exclusion where the genre drifts:** "subtle surprise, no blush".
- **Staging:** place people exactly ("standing behind the desk at the very back", "enters frame from the left"). "In front of" is ambiguous.
- **Exits:** frame wide enough to show the path ("goes from medium to full shot as he flees up the stairs"); a locked medium shot cannot show it.
- **Effect shape:** bind a reference (`@FX`) and say what the effect does, not just what it is.
- **Vary angles on repeated close-ups** of the same face (diagonal, over the shoulder) so consecutive cuts do not read as one frame repeated.

### Failure to fix

| Failure | Fix |
|---|---|
| A character appears in a shot where they should not | State "nobody but @X appears" in that shot, or drop their reference from a clip they are not in |
| A cut happens inside one window | Give the cut its own window or remove it |
| A hard-to-read beat keeps failing | Remove the beat or move it to its own clip; do not re-roll unchanged more than once |
| Wrong position or wrong prop shape | Restate the position or prop precisely, with what it is not |
| Blushing or super-deformed drawing appears unasked | "Her face does not go red", "no super-deformed drawing" in that beat |
| The wrong person speaks, or the wrong voice | Add "only @X speaks", the voice tag and "the others do not move their mouths" |
| The scene is too dense for one take | Shorten the clip or split at a natural cut; end clip one and begin clip two on the same moment |
| The action leaves the frame | Widen the shot to include the path |

### Retakes

Change only what failed, and say what you changed. A prompt resent unchanged is a variance roll, not a fix; say so. The aim is a usable clip in one take, so plan clips small enough to succeed, put hard scene changes at clip boundaries, and avoid asking one take for beats that tend to fail.

### Chaining clips

To continue a scene, begin the next clip with the previous clip's closing beat, nearly verbatim, so the join is the same moment. Trim the overlap in the edit.

## 10. Compiled prompt order for an anime shot

For a single shot or a direction-plan compile, follow the usual order (`references/director-layers.md`), with these style specifics:

1. The anime project look (section 2), verbatim.
2. Character designs in frame (section 3), verbatim.
3. Environment and light (section 6).
4. Camera: size, angle, one move.
5. Timed beats with holds and accents (section 4).
6. Lines and sounds (section 7).
7. Closing hold and constraints (section 8).

See `examples/anime-vs-realistic.md` for one beat written both ways and `examples/anime-production-prompt.md` for a full multi-cut clip.

## 11. Recording what works

When a generation succeeds or fails in anime mode, record it in `references/models/seedance/test-log.md` (version, interface, the look sentence, the result) so wording can be confirmed or dropped.
