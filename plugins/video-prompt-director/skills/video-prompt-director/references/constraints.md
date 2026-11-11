# Constraints: what every production prompt must rule out

Contents:
1. Why constraints get their own file
2. Defaults, and when the user can change them
3. Text, subtitles, logos and watermarks
4. People: identity, wardrobe, extras, clones, who is in frame
5. Audio, music, dialogue and voice
6. Cuts, camera and time between shots
7. Reading the previous and next shot
8. Instructions that must not be read or shown
9. How to word a constraint
10. Where a constraint goes
11. Sound in layers
12. Look and style wording
13. Do not add story content
14. Recorded dialogue: the full rules
15. Silent lip-sync mode
16. Other defaults

## 1. Why constraints get their own file

These come from repeated failures in real production prompts, not from theory. A video model fills every blank: it adds text to a sign, an extra person in the background, a logo on a jacket, a soundtrack, a zoom at a cut. Each one costs a regeneration. Rule them out once, specifically, in every prompt where they could appear. The defaults below are the ones most short-drama and vertical-series pipelines end up needing. The user can change any of them.

## 2. Defaults, and when the user can change them

Apply these unless the user, the project or the storyboard says otherwise. If the user changes one (for example they want subtitles generated in the video), follow them for that project and keep the rest.

| Default | Unless |
|---|---|
| No generated on-screen text, subtitles, captions, logos, watermarks, or legible writing on signs, screens, documents, clothing or props | The user asks for specific text; then give the exact text, its language and its position |
| No background music | The user asks for music |
| Vertical 9:16 for short-drama and series work | The user names another aspect ratio or the target model needs one |
| No extra people beyond those listed for the shot | The story needs a crowd; then describe it as background activity |
| No change to faces, ages, hairstyles or wardrobe from the references | The story changes them and the change is shown |
| No zoom, push-in, fade or dissolve between shots | The storyboard calls for it |
| Mouths closed for anyone not speaking | They speak in this shot |

Ask once at the start when a default would change the result a lot and the project has not stated it (for example, subtitles or music). Otherwise apply the default and note it.

## 3. Text, subtitles, logos and watermarks

- **Default is none.** Video models invent text for any surface that could carry it: shop signs, phone screens, papers, jersey numbers, shirt prints, license plates, background posters.
- Rule out the surfaces that appear in the shot, by name: "no readable text on the phone screen, the letter or the sign" works better than a general "no text".
- **Clothing and props:** when a wardrobe must stay plain, say it is plain: "plain, unprinted solid-red life jackets, with no letters, numbers, logos or patterns on the front or back".
- **If the story needs readable text,** such as a letter, a name card or a date, choose one of two routes and say which: (a) the text is added in post, so the generated shot shows only blank paper or a blank screen; or (b) the model renders the exact text, which you state in quotation marks with its language and where it appears. Route (a) is safer for long or non-Latin text. Check the target model's file for what it documents about on-screen text.
- **Wording lowers the chance; it does not guarantee it.** A model vendor's FAQ says subtitles cannot be fully prevented, only made less likely. Use phrases such as "keep it subtitle-free" and "do not generate any text or subtitles", and check every clip. In one pipeline's experience subtitles appeared more often in vertical output than horizontal.
- **Subtitles:** never ask for subtitles unless the user does. If the pipeline adds captions later, say "no subtitles, captions or lower-third text" in the prompt so they do not appear twice.

## 4. People: identity, wardrobe, extras, clones, who is in frame

- **Wardrobe fidelity:** when a reference image defines the costume, say the person wears exactly the clothes from the reference, with no added accessories or extra items, and do not change them. State it once near the start of the prompt, and again as a constraint when the model has drifted before. See `references/continuity.md`.
- **Who is in frame:** list the people who are in each shot and state that no others appear. A model otherwise pulls in a person from the previous shot or the scene description. Example: "In frame: the woman in the ivory dress and the man in the charcoal suit. No one else is in frame."
- **Offscreen people:** a person who speaks or acts offscreen stays out of frame, and their mouth does not move on screen.
- **Crowds and groups:** ask for diverse faces, builds and ages, and rule out identical-looking people: "no cloned faces; every person looks distinct". For a repeated costume (uniforms, life jackets), keep the costume identical and the faces different.
- **Look-alike pairs:** two people with the same face, clothes and accessories confuse the model's identity handling. If the story needs twins or doubles, mark what differs.
- **Frozen people:** for any shot with background people, say they move naturally. A background of motionless extras is a common failure. For a deliberately still shot, say so instead.
- **Unmotivated gestures:** do not ask for gestures that have no reason in the story.

## 5. Audio, music, dialogue and voice

- **No music by default.** If the pipeline adds music later, rule it out in the prompt.
- **Do not add audio direction unless asked.** If the model generates audio by default (check its file in `references/models/`), either describe the ambient sound you want, or say what to exclude, and tell the user.
- **Ambient sound:** one short line is enough, tied to what is on screen: "room tone, paper handling".
- **Dialogue supplied as a recording:** when the user gives a dialogue audio file, the prompt names who speaks each line, when in the clip it starts (in seconds), and that their mouth moves only during their own lines. State that the voices come from the supplied audio and must not be re-voiced, changed or imitated. Respect the model's documented limits on audio inputs (count and total duration); see its file.
- **Dialogue in the prompt:** keep each line exact, in its language, with the speaker named (`references/performance.md`).
- **Shots with no dialogue:** say that no one speaks and every mouth stays closed.

## 6. Cuts, camera and time between shots

- **One continuous shot** unless the storyboard cuts. Say "no internal cuts" when the model tends to add them.
- **No zoom, push-in, fade or dissolve at a cut** unless the storyboard asks. No delay at a cut: the next shot starts on its first action.
- **No unmotivated camera moves** and no slow motion unless the story wants them.
- **Do not reverse screen direction** or the camera axis between shots (`references/continuity.md`).
- **Eyeline:** if a shot should not look into the lens, say "no one looks into the lens". If the character addresses the camera on purpose, say so.

## 7. Reading the previous and next shot

- **Do not replay the previous action.** Start from the state the previous shot ended in, and show only this shot's new action. Say so: "continue from the previous shot's finished action and prop state; do not repeat it."
- **End on a stated state.** The shot ends on a finished action and gaze. The next shot continues from that wardrobe, positions, props in hand and light, with no reset.
- **Props and condition marks:** list persistent marks (a stain, a scratch, a dented bracelet, a wet shirt) in every prompt where the person is visible. They are the first thing a model drops.

## 8. Instructions that must not be read or shown

Performance notes, delivery notes and constraints can leak: a model may speak them, display them as text, or treat them as dialogue. Mark non-spoken guidance as direction, not content: "direction only, not to be spoken or displayed". Keep spoken words in quotation marks, and keep notes out of them. Put timing tables and notes for the user outside the prompt.

## 9. How to word a constraint

- **Be specific and name the thing.** "No readable text on the phone screen or the paper" beats "no text".
- **Pair the positive with the exclusion.** "Plain solid-red jackets, no letters or logos."
- **State a constraint once in the main prompt,** and again in the negative field or a closing line only for constraints the model has already violated. Repeating every rule everywhere makes the prompt long and can crowd out the action.
- **Emphasis (capitals, "CRITICAL", "IMPORTANT") is a workaround some pipelines use** when a model keeps breaking a rule. It is not documented as more effective for any model checked in `references/models/`. Use specific wording first, and add emphasis only to a rule that has failed, saying why.
- **Tool settings help too.** Some tools offer a reference-image weight or fidelity setting and a negative-prompt field. If the user's tool has them, tell them to raise the reference weight and put the key exclusions in the negative field. This is the tool's setting, not part of the prompt, and which tools have it is in `references/models/`.
- **Do not contradict yourself.** Do not exclude "movement" in a shot that has a walk.

## 10. Where a constraint goes
11. Sound in layers
12. Look and style wording
13. Do not add story content
14. Recorded dialogue: the full rules
15. Silent lip-sync mode
16. Other defaults

| Kind | Put it |
|---|---|
| Wardrobe, identity, who is in frame | In the prompt body, near the start, per shot |
| Text, subtitle, logo, watermark | In the prompt body as a closing line; and in the negative field if the model has one |
| Music, voices, lip-sync | In the audio part of the prompt, if the user wants audio; otherwise as an exclusion |
| Cut and camera rules | In the shot's camera line |
| Persistent marks (stains, scratches) | In each person's description |
| Tool settings (reference weight, negative field) | In a note to the user, outside the prompt |

## 11. Sound in layers

Keep three layers apart:

1. **What the characters hear:** dialogue, singing, music inside the story. It goes in the shot body.
2. **Ambient and action sound:** footsteps, a door, breath, room tone. Short, in its own line, and never repeat the dialogue there.
3. **Score:** music only the audience hears. Default is none; say so.

A sound line is also a direction. If the sound line says "the bell explodes on impact", the model may act out an impact. When the action changes, change the sound line with it.

## 12. Look and style wording

- **Say the look once, as the project's look,** and reuse the same wording in every prompt. Do not invent a different style sentence per shot. Light direction and mood belong to the shot; style names, grades and film looks belong to the project look.
- **Do not name other styles, even to exclude them.** "No anime, no 3D, no cartoon" can pull a model toward them. Describe the look you want, and list only concrete faults to avoid (waxy skin, distorted faces, harsh shadows across faces).
- **Describe faces, skin, hair and light directly. Never compare people to real people** (stars, idols, named actors, "the lead of a popular drama"). One team's log records a Google Flow prompt rejected for depicting a prominent person after such a comparison (2026-10-31). Characters should be original.
- **Realistic references still need a style line.** A vendor FAQ notes that realistic reference images with no style words can drift to a different look.

## 13. Do not add story content
14. Recorded dialogue: the full rules
15. Silent lip-sync mode
16. Other defaults

Do not add people, props, actions, dialogue or visible text that the script and storyboard do not contain. A storyboard assembles assets; it does not invent. Do not use era words ("ancient", "period costume") as pictures; describe garments, objects and architecture instead.

## 14. Recorded dialogue: the full rules

When the user supplies the dialogue as a finished audio file (for example a text-to-speech or actor recording), put these rules in the prompt. They exist because models otherwise voice the lines again, with a different voice.

1. **The recording is final and exactly as long as the clip.** The voices in the finished video are this recording, used as is, word for word and second for second.
2. **The model must not generate, re-voice, re-read, change or imitate the dialogue.** No added, removed or altered words. No stretched or shortened syllables.
3. **No change to voice, pitch, volume, speed, rhythm, pauses or emotion.** No reverb, echo, voice effects or any other voice outside the recording.
4. **People only move their lips to the recording.** The model makes no human sound of its own. Each line starts at its labeled second; mouths follow the language's syllables and close in the recording's pauses. Off-screen speakers do not move their mouths on screen.
5. **If picture and recording disagree, change the picture, not the recording.**
6. **Outside the recording, only very light ambient sound and action sound,** far below the dialogue. No music, no subtitles.
7. **Repeat rule 2 once more at the end** of the constraints. Models drift on this one.

Check the model's file for how many audio inputs it takes and their total length.

## 15. Silent lip-sync mode

If the audio is mixed in afterwards, ask the model for a silent clip: "only mouth movement to the line, no sound of its own; expression follows the line's emotion". Still give the line, its language, its start second and its delivery, so the mouth matches. State "no one speaks" and "mouths closed" for clips with no dialogue.

## 16. Other defaults

- **Do not cut to black.** It wastes frames. Hold on the last reaction; the edit adds the black.
- **No orbits, whip pans or crash zooms** in a grounded drama, unless the user asks (`references/camera-language.md`).
- **Every person, place and prop needs a reference or a full description** in a series (`references/continuity.md` section 10).
- **Face light is a project choice:** soft flattering light, or natural shadows with no beauty lighting. State which, once, as the project look.
