# Seedance prompt syntax

How to write the text of a Seedance prompt: formulas, reference binding, markup, timestamps, trigger words and constraint wording. Settings and limits are in the profile files; failure fixes are in `troubleshooting.md`.

How to read this file: rules are **OFFICIAL**, read on **2026-11-13**, from the page named: G25 (2.5 prompt guide), G20 (2.0 prompt guide), T25 (2.5 tutorial), API. A rule marked "2.0" is documented only for the 2.0 series. Anything not documented for 2.5 or Flash is UNVERIFIED for them. Tags are defined in `references/models/other.md`. Sources: `https://ai.byteplus.com/ark/region:ap-southeast-1/docs/seedance-2-5-prompt-guide` and `.../seedance-2-0-prompt-guide`.

The examples below are written for this skill; they follow the documented structure and are not the vendor's prompts.

## Formulas

| Version | Formula | Source |
|---|---|---|
| 2.5 one-sentence | Subject, location, event, genre or style, camera movement | G25 |
| 2.5 detailed | A timeline by timestamps or "Shot N", with visuals, camera, action, dialogue and sound for each segment, then notes for recurring elements | G25 |
| 2.5 structure seen in examples | A bracketed header block (style, setting, characters, constraints), the timed shots, then exclusions at the end | G25 |
| 2.0 advanced | Precise subject, action details, scene, lighting and colour tone, camera movement, visual style, image quality, constraints | G20 |
| 2.0 shot order | Camera move or transition, then subject action or expression, then position and space, then audio | G20 |

Principles from G25: treat the model as a visual content producer; use positive descriptions where possible; if a reference is accurate, say to follow it and do not re-describe its details; do not overpack a time range (too much in one range gives extra cuts or dropped plot).

## Binding references

Number assets by upload order and state what each one supplies and, when needed, what not to take from it.

| Form seen | Where | Note |
|---|---|---|
| `Image 1`, `Video 1`, `Audio 1` | G25 recommended wording; G20 | Plain numbered names |
| `@Image 1`, `@Image1`, `@Video 1`, `@Audio 1` | G25 examples, G20 cases, T25, API samples | With a space or without |
| `<Image 1>`, `<Image_N>`, `<Subject_N>@<Image_N>` | G25 FAQ examples, G20 templates | Angle-bracket forms |
| `[Video 1]`, `[Video 2]` | G25 transition example, G20 templates | Used for transitions and track completion |
| `<video1>`, `<1pic>` to `<10pic>` | G25 clay example | Per-segment tags in one example |

No page names one form as canonical (DISC-10). Pick one form per prompt and keep it. Before the first use on a new interface or on Flash, run a short test with the chosen form and log it (`test-log.md`).

Rules:
- **Bind in the text.** Do not rely on a name written inside an image to map a character. Say "Image 1 depicts [character] and uses the voice timbre from Audio 1" (G25).
- **One-to-one mapping.** Multiple assets for one character: "Images 1 and 2 are Character 1 and correspond to Audio 1; Images 3 and 4 are Character 2 and correspond to Audio 2" (G25).
- **Upload order is first appearance.** Upload subjects in the order they first appear in the video and renumber the prompt to match. A mismatch swaps characters (TS-01).
- **State the role and the part.** "Refer to the action in Video 1 and the camera movement in Video 2." "Refer to Image 1 for lighting and filters." (G25)
- **Define each subject with two or three stable, static features and a unique label**, and use the label consistently (G20). Avoid contradictory features.
- **Asset library IDs cannot stand in for `Image N` or `Video N` in the prompt text** (G20). Reference them by asset type and number.
- **Edit and extend name the video directly.** Write "Video 1" in the instruction and do not write "reference Video 1", or the request may be read as a reference task (G20).
- **Real faces:** see `profile-2-5.md`.

A binding example for a reference task:

```
Image 1 is the lead, Mira (identity and wardrobe). Image 2 is the kitchen (layout and light). Video 1 supplies the slow push-in camera movement only. Audio 1 supplies the voice timbre for Mira.
```

## Audio markup

| Mark | Meaning | Source |
|---|---|---|
| `( )` | Music, for example a style or mood | G25, G20 |
| `< >` | Sound effects | G20 and the T25 prompt tips; the 2.5 prompt guide's examples describe sound effects in plain text (DISC-13) |
| `{ }` | Dialogue | G25, G20, T25 |
| Double quotes | Dialogue, recommended by the API page for `generate_audio` | API (DISC-10) |
| Bracketed subtitle marks | Subtitles | G20 (square brackets), T25 (corner brackets) |

Formats and rules:
- Per-line emotion (2.5): `Character's line (emotion): {content}`. This format also lowers the chance of unwanted subtitles (TS-08).
- Voice-over (2.5 example): a `(V.O.)` tag after the speaker's name, then the line in braces. No audio-file binding is shown for it.
- Language: for dialogue that is not Chinese or English, state the language first ("says in Japanese {...}"). Keep the dialogue language consistent and do not mix Chinese and English except for proper nouns (G20).
- Audio constraints: "No BGM; generate only environmental sounds and action sounds." "No audio." (G25). For music that keeps appearing, use the audio policy block in TS-11.
- Not found in the pages read: overlapping dialogue (only a negative example, "multiple people speaking simultaneously"), off-screen dialogue, and how many speakers a clip can hold. These are UNVERIFIED for 2.5 and Flash.

## Timestamps

| Version | Behavior | Source |
|---|---|---|
| 2.5 | Integer-second timestamps are supported. The basic unit is 1 second | G25 |
| 2.0 | Ignores timestamps; use "Shot N". Precise timing is unstable and forcing duration can give abnormal output | G25 differences, G20 |

2.5 formats (G25):
- Intervals with no gaps: `0-3 seconds ... 3-7 seconds ...` or `[1s-4s] ... [4s-8s]`.
- A point in time: "at the 2-second mark ...".
- Relative time: "after 3 seconds ...".

Rules (G25): give each range enough but not too much plot (too little makes the model improvise; too much gives extra cuts or dropped plot); do not use timestamps for high-frequency actions such as shaking the head three times in one second; complex multi-requirement tasks can be unstable, so split them (TS-19). Per-speaker timelines (`00:05-00:09 Woman: {...}`) appear in the dubbing example. Flash timestamp support is UNVERIFIED.

## Camera terms (G25)

The guide says basic shot size, camera movement and angle terms can be written directly: extreme wide, wide, medium, medium close-up, close-up; push in, pull out, pan, track, follow, orbit, dive, pull back, tilt up, handheld shake; low angle, overhead, first person. It also lists a long take, a dolly zoom, aerial, first-person view, bullet time, handheld and a speed ramp. A rarer term should be given with a short explanation. Name a transition with its trigger point and method. The 2.0 guide adds: specify only one type of camera movement in a single shot (G20).

## Task trigger wording (T25)

For an edit or an extension without an explicit `omni_reference_task_type`, the prompt must carry the intent:
- Edit: edit the video, add, insert, remove, delete, modify, replace, change to.
- Extend: extend forward, extend backward, continue, continue from, extend the story.

An example of an edit instruction with a preserve clause:

```
Replace the woman in Video 1 with the character in Image 1. Keep the original actions, composition, camera movement and rhythm of Video 1. Change nothing else.
```

## Constraint wording

| Need | Wording documented | Source |
|---|---|---|
| No subtitles | "No subtitles." "Do not add subtitles." "Keep it subtitle-free." | G25, G20 |
| No logo or watermark | "Do not generate a logo." "Do not generate a watermark." | G20 |
| No duplicate people | A global rule against characters with identical appearance, and a reference binding per role | G20 |
| Normal eyes | "Normal human eyes; no glowing eyes", as the highest-priority exclusion | G25 |
| No music | An audio policy block at the start and the end that lists the banned terms (TS-11) | G25 |

There is no negative-prompt parameter in the documentation read. Exclusions go inside the prompt.

## Prompt length

The recommended maximum is 500 Chinese characters or 1,000 English words (API, `text` item). It is a recommendation, not a stated cap. Tiers, budgets and counting are handled in Phase 2 (`density-and-budget`, not yet written). Until then: keep every sentence changing what the model makes, put essentials first, and do not treat the user's interface limit as the recommended length (`references/models/platforms.md`).

## Languages

The prompt can be written in the 11 languages in `profile-2-5.md`. This skill writes the prompt in English by default and keeps spoken dialogue in its original language; Chinese is an allowed override (USER-REPORTED, 2026-11-13). The prompt language and the spoken language are separate settings.

## Optional external resource

The vendor publishes a prompt-optimizer skill named `sd25-pe` and suggests installing it. This skill does not install it, does not copy its implementation and does not depend on it. If the user wants it, point them to the vendor's tutorial page and let them decide. It is external code.

## How the skill applies this

- Write for the user's version: timestamps for 2.5 (after a test on Flash), shot numbers for the 2.0 series.
- Bind every asset, in first-appearance order, with a role and an exclusion.
- Keep to one binding form per prompt and flag that the canonical form is not documented.
- Put exclusions inside the prompt, specific and once, with the audio policy block only where music has already appeared.
