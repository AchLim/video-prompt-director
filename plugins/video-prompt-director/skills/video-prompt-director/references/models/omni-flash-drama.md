# Gemini Omni Flash 1.2: low-motion drama directing profile

Craft and guardrails for Gemini Omni 1.2 Flash ("OF 1.2") short dramas. Documented limits live in `references/models/veo.md` (checked 2026-11-11); this file applies them. Tags follow `references/models/other.md`: rules are HEURISTIC (user's production practice, 2026-11-13) unless marked. Items marked OFFICIAL (verified) were checked by the user against the Google AI Studio and Google Cloud documentation for `gemini-omni-1.2-flash` on 2026-11-13; re-check them there before a paid run. Anything unmarked and not in the official pages stays HEURISTIC, USER-REPORTED or UNVERIFIED, and a prompt must not depend on it as if it were a supported setting.

## 1. Stillness in the body, energy in the camera

- Subjects sit or stand. Allowed motion: slow blink, subtle head turn, hand tremor, one tear, breath, a swallow. No walking, full-body turns, gesturing or object handoffs.
- Momentum comes from the camera: slow dolly push-in, 30 to 45 degree orbit, slow pull-back that reveals a background clue, rack focus (foreground prop to the eyes).
- Budget: one camera move per take, plus at most one rack focus. Always "slow".
- Why: limb and physics warping grows with body motion; camera motion on a still subject is cheap. This mode overrides the "most shots are locked off" default.

## 2. Visual wrappers (one per series, repeated in every prompt)

| Wrapper | Prompt traits | Best for |
|---|---|---|
| Dark cinematic / neo-noir | 35 mm film grain, chiaroscuro shadows, rain, warm or neon rim light, shallow depth of field | thrillers, betrayal, revenge |
| Stylized 3D / Pixar-esque | exaggerated expressive eyes, soft subsurface lighting | emotional and animal dramas |
| Dark webtoon / anime | sharp cel shading, wind-swept hair and clothes, held dramatic pose | romance, fantasy, action beats |
| Living miniature / tilt-shift | macro lens, warm candlelight, subtle stop-motion-adjacent movement | cozy or fable tones |

Describe traits, never real stars or titles (`references/constraints.md` section 12).

## 3. Technical guardrails (check before returning any OF 1.2 prompt)

### 3.1 Duration and interpolation

| Mode | Allowed | Tag |
|---|---|---|
| Text to video, or one image | 3 to 15 s whole seconds (default 10) | OFFICIAL |
| First and last frame (start image and end image both supplied) | 3 to 10 s only | OFFICIAL |
| Extension | 3 to 10 s per extension, up to about 30 s total | OFFICIAL |
| Two keyframes with a duration above 10 s returns an API invalid-argument error | | OFFICIAL (verified) |

- Never write a duration above 10 s when two keyframes are supplied. If the beat needs more, use one keyframe (up to 15 s), or a 10 s interpolation followed by an extension.
- Long monologue: do not cut away. Generate a first take, then extend from its final seconds in 3 to 10 s steps (about 30 s total), carrying the speaker tag, tone and framing into each extension prompt. Extension with dialogue works on model-generated videos, not on an uploaded video where someone already speaks.

### 3.2 Reference budget

- At most **6 reference images** per request (OFFICIAL), and up to 3 images per character for up to 2 characters (OFFICIAL). Environment and hero-prop images count toward the 6.
- Write a slot map in the plan and refer to slots in the prompt. Examples:
  - `Slots 1-3: Character A angles and outfits; Slots 4-6: Character B angles and outfits`
  - `Slots 1-2: Character A; Slots 3-4: Character B; Slot 5: environment; Slot 6: hero prop`
- Describe each input's role in plain language (OFFICIAL guidance). A third speaking character cannot have a character slot set; describe them visually or keep them out of frame.
- Short reference video clips (each up to 3 s) to guide camera or micro-motion (OFFICIAL, verified):
  - 11 to 15 s output: **max 1** reference video.
  - 3 to 10 s output: **max 3** reference videos.
  - Reference videos work **only on a new video generation**. They are ignored or unsupported on edit and extension turns, so never plan a reference video for those.
  - The audio track of a reference video is ignored; take sound from the prompt.
  - Count the videos before choosing the duration; if the plan needs more, shorten the output or split the take.

### 3.3 Rough sketch or wireframe input

When the user supplies a rough storyboard sketch or wireframe image, start the prompt with this exact sentence and keep it unchanged:

> Turn this into realistic footage, using the drawing only as a guide for composition and movement; do not show the drawing lines in the final video

For a non-realistic wrapper (section 2), keep the sentence exact and let the wrapper traits that follow set the style. (HEURISTIC.)

### 3.4 Draft then upscale

- Tag each prompt with its pass: `PASS 1 DRAFT 720p` first (720p is the default, OFFICIAL), to check lip-sync, face acting and the camera move cheaply.
- After approval, `PASS 2 UPSCALE` as a standalone step on the approved take (`task: "upscale"`, OFFICIAL, verified). Do not rewrite the prompt for the upscale pass and do not re-roll an approved take.
- Resolution ladder (OFFICIAL, verified): a **720p** draft upscales directly to **1080p or 4K**; a **360p** draft upscales only to **720p or 1080p**. Direct 360p to 4K and 1080p to 4K requests fail, so never plan them. Output frame rate is fixed at **24 fps**.
- Whether the user's interface exposes upscale as a separate step: UNVERIFIED; ask the user.
- Verify on the draft: speaker's mouth matches the line, no limb drift, the tear or micro-twist reads, text-free frame.

## 4. Take formats

- **15 s continuous take** (default, one image or text only): include the single-shot lock (section 9.1), then `[0-5s]`, `[5-10s]`, `[10-15s]` beats: camera move, micro-acting, line, sound.
- **10 s first-and-last-frame** (micro-twist): supply Start and End images. The End image has the same framing, lens, light and pose; only the changed detail differs (smile gone, single tear). The prompt describes only the transition. Duration capped at 10 s (section 3.1).
- 9:16 unless the user says otherwise. Exclusions are written inside the prompt; there is no negative-prompt parameter.

## 5. Audio inside the video prompt

Audio is generated with the picture. Write dialogue, tone and sound in separate sentences:

`Dialogue: the woman in the grey cardigan (MIRA), low and trembling, says: "..."`
`Sound: rain on glass, a clock ticking, a held breath.`

Speaker tag = stable visual description plus name; tone of voice stated; lines verbatim; only the speaker's mouth moves; each sound effect tied to a beat. No music unless the user asks for it.

## 6. Conversational edit (same location, next beat)

OFFICIAL (verified): works across full 3 to 15 s clips by continuing from the earlier turn with `previous_interaction_id`. It needs stateful storage, so `store` must not be set to `false`. Reference videos are not used on edit turns (section 3.2). Check the user's interface or API settings before relying on it.

Template: one change only, then the closing phrase (section 9.4): "The window light shifts from dusk blue to streetlight amber, keep everything else the same."

Fallback when `store` is off, the interface has no continue option, or identity or framing drifts: regenerate from the Anchor image with the new beat's prompt.

## 7. Aspect ratio, camera smoothness and continuity

### 7.1 Aspect ratio and safe zone
- Default **9:16 vertical** for TikTok and Shorts micro-dramas. Use **16:9** only when the user explicitly asks for long-form YouTube. State the ratio in every prompt and plan.
- **Aspect-ratio parity** (HEURISTIC): every character reference sheet, start and end frame and storyboard sketch must be made at the exact target ratio (9:16) before it is passed in, to prevent cropping drift. Remind the user once per project, and again whenever a supplied image is a different ratio.
- Compose subjects in the **upper-middle third**. Keep the **bottom 25%** free of vital props, hands-on-prop action and faces, for burned-in subtitles and platform UI.

### 7.2 Camera rig and lens lock
- Choose **one** portrait focal length for the whole episode: **50 mm or 85 mm prime, f/1.8, shallow depth of field**. It flatters close-ups and blurs background artifacts. Repeat it in every prompt; only a story reason changes it.
- Use stabilized-rig wording with a constant-velocity cue, not generic motion words. Example: "fluid-head slow dolly push-in at a steady, continuous, unhurried pace from start to finish". Avoid "dynamic", "energetic", "fast", "whip" or "handheld shake".
- Still one camera move per take (section 1).

### 7.3 Continuity and eye-lines
- **3-anchor environment lock:** pick three fixed background or lighting landmarks for the scene (for example the window with blue dusk light, the green-shaded lamp, the closed wooden door) and repeat all three in every shot of that scene, so the room geometry does not shift.
- **180-degree eye-line:** in dialogue cuts, state off-camera gaze for each person and keep sides consistent: "Character A looks slightly off-camera right" then "Character B looks slightly off-camera left", so they face each other and do not stare into the lens. Never swap sides inside a scene without a stated reason.
- **Micro-atmosphere cue:** every static shot includes at least one subtle ambient motion, such as screen light flickering in the pupils, drifting dust motes, or rain shadows moving across the wall. It must be consistent with the three anchors and must not move a person's limbs.

## 8. Storyboard output per beat

- **Anchor / Start Frame Image Prompt**: identity, wardrobe, prop, wrapper, lens, light, pose, plus the reference slot map.
- **End Frame Image Prompt** (optional): identical to the anchor except the micro-twist. Present only when the take is a first-and-last-frame pair (10 s cap).
- **OF 1.2 Video + Audio Prompt**: pass tag, duration, sketch sentence if a sketch was supplied, camera, micro-acting, dialogue with speaker tag and tone, SFX.
- **Conversational Continuity Note**: what stays fixed, what evolves, the fallback.

## 9. Prompt syntax and output hygiene

Source: the official Gemini Omni 1.2 Flash prompt guidance (summarized in `references/models/veo.md`) as supplied by the user, 2026-11-13. The exact phrases below are HEURISTIC wording; the behaviors they control are OFFICIAL where marked.

### 9.1 Single-shot lock
- On 10 to 15 s clips OF 1.2 inserts montage scene cuts by default (OFFICIAL). Every single-take prompt must therefore contain, verbatim: `in a single continuous shot, no scene cuts`.
- Omit it only when the user intentionally asks for a multi-cut montage, and then say so in a note.

### 9.2 Bracketed timestamp choreography
- A 15 s single take uses three inline blocks: `[0-5s]`, `[5-10s]`, `[10-15s]`. Put in each block the micro-expression, the camera move phase and the moment the dialogue lands (for example, the line starts at 6 s, the push-in finishes at 14 s).
- With first-and-last-frame interpolation (10 s cap) keep every timestamp inside 10 s: `[0-5s]`, `[5-10s]`.
- Blocks describe pacing of one continuous shot, never cuts.

### 9.3 Inline negatives and quoted text
- There is no separate `negative_prompt` parameter (OFFICIAL). End every standard prompt with: `No burned-in subtitles, no on-screen text`, so captions can be added cleanly in post.
- Intentional diegetic text (a phone screen, a note, a sign) is the exception: put the exact words in double quotes and state where it appears, for example `the phone screen, held at lower left, reads "Where are you?"`. Then drop the blanket "no on-screen text" clause for that shot and say only that no other text appears.

### 9.4 Minimalist conversational edit
- A conversational edit on an existing clip (section 6) states **one change** and ends with `keep everything else the same`. Do not re-describe the scene, character or wardrobe; re-describing is what invites face and wardrobe drift.
- Several changes means several turns, each with its own closing phrase.

### 9.5 Audio and music separation
- Every spoken line is an exact quote tied to a visual descriptor: `the man in the navy shirt (DANIEL), flat and quiet, says: "..."`. Never an unattributed line.
- Include by default: `no background music, ambient foley and dialogue only`, so creators can layer trending platform music later. Leave it out only when the user asks for a custom score.

## 10. Silent pre-return checklist

1. Duration within the mode (15 s max; 10 s if two keyframes).
2. References at most 6, slot map written; videos within the duration limit.
3. Sketch sentence prepended when a sketch is supplied.
4. Pass tagged 720p draft; upscale named as a separate step.
5. Body still, one camera move, wrapper repeated, speaker tag and tone present, no music, no extra people.
6. 9:16 stated, all images at 9:16, subject in the upper-middle third, bottom 25% clear.
7. One lens for the episode, stabilized-rig wording with constant velocity, three anchors repeated, eye-line sides stated, one micro-atmosphere cue.
8. Upscale path respects the ladder (720p to 1080p or 4K; 360p to 720p or 1080p).
9. Single-shot lock phrase present (unless a montage was requested); timestamps inside the duration (10 s with two keyframes); ends with the no-subtitles clause (or quoted diegetic text with placement); no-music clause present; edits are one change plus `keep everything else the same`.
