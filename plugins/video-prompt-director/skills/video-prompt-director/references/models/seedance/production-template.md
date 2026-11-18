# Seedance production template (any style)

A way to write a whole scene as one Seedance prompt: a header, a reference block, a timed multi-cut timeline, a constraints block and a repeated style footer. It works for any look, realistic or anime or other; only the style paragraph changes. This is this skill's production pattern, taken from production use. It is not vendor documentation. Limits, durations, reference counts and syntax are in the version's profile and `syntax.md`; check them before writing numbers into a prompt. The mark forms below (`{ }` for lines, `〈 〉` for sound, `@Name` for assets) are the pattern's own; confirm them on the user's interface (`syntax.md`, binding references).

## 1. The aim: the whole scene in one generation

The goal is a scene that comes out usable in one generation, so nothing has to be cut together from different takes. Plan for that:

- **Write the whole scene as one prompt** when the profile's duration and cut limits allow it, with every beat the scene needs (dialogue included). A scene built in one generation keeps one light, one set and one voice per character.
- **Make each beat easy to get right.** One action per window; one camera idea per cut; each person placed exactly; each risky moment says what does not change (section 5).
- **Keep the plan honest.** If a beat has failed twice, or the scene is longer than the model's duration, split it at a natural cut (section 8), not in the middle of a beat.
- **Spend takes on fixes, not rerolls.** Change what failed and say what you changed (section 7).

## 2. Layout

```
[No BGM] <style paragraph: the look in the words of the project's style, no change in people or props partway through, the camera uses only the specified moves, no subtitles, text or watermark>
Total <N>s · <aspect ratio> · <K>-cut multi-shot · real time · no slow motion, no fades
Reference
Character : @Name: face, wardrobe and build match 100%. @Name's voice is @Name_Voice.
Background : @Place: inherit only the space, materials, lighting and mood; do not inherit composition, angle or color.
(Effect or prop references as needed: @FX, @Prop)
Timeline
[0-2s] ...
Constraints
<spoken-line count and who may speak, silence after lines, sound, no music, one lens per cut, one action per beat, identity and quality rules>
Style (unchanged every time)
Style: <the look in one line>
Continuity: Characters, props, environment identical across every cut. No identity drift.
Audio: <sound plan>
```

Anime style words are in `references/anime-direction.md`; a realistic project look is in `references/visual-direction.md`. Whatever the look, say it once in the style paragraph and repeat the one-line version in the footer.

## 3. Checks before returning

- **K equals the number of timeline windows and N equals the last end time.** Fix the header after trimming a beat; never leave it stale.
- **Every character who speaks has a voice tag.** A character without one is never given another character's voice. If a speaker has no voice reference, anchor the voice in words ("the same low, calm adult man's voice as earlier") and tell the user.
- **The spoken-line count matches the `{ }` lines**, inner voice included, and the Constraints name it ("exactly N lines; nobody else speaks").
- **Windows tile the clip:** each starts where the last ended, none overlaps.
- **The scene fits the profile's duration and reference limits** (`references/models/seedance/profile-*.md`).

## 4. Shot line and dialogue

**Shot line:** `[a-bs]` + shot size and angle + who, doing one action + the camera, stated once + `〈sound〉` when a sound matters. Silent beats end "No dialogue." A held frame says "the camera does not move". A cut belongs to its own window; never hide one inside a window ("...and it cuts to a close-up").

**Dialogue formats**
- Spoken: `<shot>. <Name>, <tone>, says in <language> in @Name_Voice's voice: {line} One second of silence after the line.`
- Inner voice: "her inner voice is heard in voice-over in @Name_Voice's voice: {line}. She does not move her mouth."
- Off-screen: "a low, calm adult man's voice is heard from off screen: {line}. The speaker is not shown. @A and @B do not move their mouths."
- Two people in frame: "Only @X speaks this line; the others do not move their mouths."
- Lines stay exactly as supplied, in their language. Check that the line fits its window (`references/pacing.md`).

## 5. Techniques

- **Say what does not change at the risky moment.** A prop attached to an arm: "the blade is attached to his arm, he does not hold a separate sword". A breakage: "only the blade breaks, the armor stays intact, no wound on her hand". A power-up: "the uniform and hairstyle stay as they are".
- **Name the contact.** "What he holds is the fabric of the sleeve, not her wrist or her hand."
- **Transformation:** two references for the two forms; "keep the figure's position and build the same before and after the change"; time it ("covers the body in under one second").
- **Emotion by exclusion where the model drifts:** "subtle surprise, no blush".
- **Staging:** place people exactly ("standing behind the desk at the very back", "enters frame from the left"). "In front of" is ambiguous.
- **Exits and travel:** frame wide enough to show the path ("goes from medium to full shot as he flees up the stairs"); a locked medium shot cannot show it.
- **Effects and props:** bind a reference (`@FX`, `@Prop`) and say what the effect or prop does.
- **Vary the angle on repeated close-ups** of the same face (diagonal, over the shoulder) so consecutive cuts do not read as one frame repeated.
- **Leave out beats that keep failing** rather than re-rolling them.

## 6. Failure to fix

| Failure | Fix |
|---|---|
| A character appears in a shot where they should not | "Nobody but @X appears" in that shot, or drop their reference from a clip they are not in |
| A cut happens inside one window | Give the cut its own window or remove it |
| A beat keeps failing | Remove it or give it its own clip; do not re-roll unchanged more than once |
| Wrong position or wrong prop shape | Restate the position or prop precisely, with what it is not |
| An unwanted expression or style gag appears | Name the exclusion in that beat ("no blush", "no super-deformed drawing") |
| The wrong person speaks, or the wrong voice | "Only @X speaks", the voice tag, and "the others do not move their mouths" |
| The scene is too dense for one generation | Shorten it or split at a natural cut; end clip one and begin clip two on the same moment |
| The action leaves the frame | Widen the shot to include the path |
| The header disagrees with the timeline | Recount K and N |

## 7. Retakes

Change only what failed, and say what you changed. A prompt resent unchanged is a variance roll, not a fix; say so. When a retake edits a prompt, edit the failed shot and leave the rest word for word, so a change in the result can be traced to the change in the prompt.

## 8. Splitting and chaining

Split only when the scene exceeds the model's duration, or when a beat has failed twice, or when the location changes and needs its own reference. Put the split at a cut. To continue, begin the next clip with the previous clip's closing beat, nearly verbatim, so the join is the same moment; trim the overlap in the edit. Carry identity, wardrobe, props and light in the next prompt (`references/continuity.md`).

Examples: `examples/seedance-production-prompt.md` (realistic) and `examples/anime-production-prompt.md` (anime).
