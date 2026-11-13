# Seedance troubleshooting

Known failure patterns, what the vendor says causes them, the official fix, and a prompt pattern written for this skill. Load it when a generation came out wrong, when a request is likely to hit one of these patterns, or before promising that an issue can be prevented.

How to read this file: each entry's **Cause** and **Fix** are **OFFICIAL**, read on **2026-11-13**, from the page in **Source** (G25 is the 2.5 prompt guide FAQ, G20 the 2.0 prompt guide FAQ, T25 the 2.5 tutorial, PA the portrait guide; URLs are in `capability-registry.md`). **Pattern** lines are written for this skill and are not vendor text. **Applies** says which version the page states it for; "not stated" means the page does not say, so Flash is UNVERIFIED. Several fixes are workarounds the vendor says it is still improving. A fix lowers the chance of a problem and does not remove it.

The vendor's own examples contain inconsistencies (DISC-09), so use them for structure, not numbering.

## References and identity

### TS-01 A character is swapped with the wrong reference or voice
- **Cause:** Upload order does not match the order in which the subjects first appear, so numbering and mapping drift.
- **Fix:** Upload the assets in the order the subjects first appear, renumber the images and audio in the prompt to match, and keep a one-to-one mapping per character (G25).
- **Pattern:** `Image 1 is [name]. Image 2 is [name]. Audio 1 is [name]'s voice. Image 3 is the location.` Order the manifest before writing the prompt.
- **Applies:** 2.5 guide; not stated for Flash.

### TS-02 Face or identity drifts from the reference
- **Cause:** A mixed reference image (face, pose and outfit in one image) with a small face (G20).
- **Fix:** Add a close-up headshot with no expression and a plain background. Use a headshot plus a full-body photo, and put key assets first (G20).
- **Pattern:** `Image 1 is [name]'s face (headshot). Image 2 is [name]'s styling and outfit (full body).`
- **Applies:** 2.0 series. The 2.5 guide supports multi-view subjects for 1 to 5 subjects; a headshot plus full-body set remains the safe default.

### TS-03 Duplicate or "twin" characters
- **Cause:** Often seen with three-view sheets (G20). It cannot be fully avoided.
- **Fix:** Bind each role to its own reference image in the prompt, add a global rule against characters with identical appearance, use single-person photos, and cut redundant script (G20).
- **Pattern:** `[Name A] is Image 1 and [Name B] is Image 2. No two people look alike. No duplicated characters.`
- **Applies:** 2.0 series.

### TS-04 More than four reference people lower stability
- **Cause:** Too many reference characters in one request (G20).
- **Fix:** Generate in groups of at most four, then use image-to-video from those images (G20). The 2.5 guide recommends 1 to 8 subject images and 1 to 5 subjects for audio and video inputs (G25 reference asset table).
- **Applies:** 2.0 series as written; the 2.5 numbers are guidance.

### TS-05 A 2.5 render has a different look from the same prompt on 2.0
- **Cause:** The two versions render the same reference and prompt in visibly different styles.
- **Fix:** Use the 2.0 output as the input to a 2.5 video-extension task, with `.mov` as output, to keep the 2.0 style (G25).
- **Applies:** 2.5 versus 2.0.

### TS-06 A realistic reference drifts to another look
- **Cause:** Realistic reference images with no style words, or a style that the references do not state (G20).
- **Fix:** Say the style explicitly, or convert the reference to the target style first (G20).
- **Pattern:** Put the project look once in the prompt, positively.
- **Applies:** 2.0 series.

### TS-24 Special effects do not follow the text
- **Cause:** An effect that text cannot describe precisely (the example is a countdown number) (G20).
- **Fix:** Use a reference video of the effect and say how it should appear (G20).
- **Applies:** 2.0 series.

## Emotion, text and picture

### TS-07 Glowing pupils from strong emotion words
- **Cause:** Intense emotion words make the pupils emit blue, red or other light (G25).
- **Fix:** Put "normal human eyes; no glowing eyes" as the highest-priority exclusion and limit environment lighting to facial contours. Replace intense words (fanatical, extremely shocked) with neutral ones (amazed) and do not describe emotion as an eye effect (G25).
- **Pattern:** Direct emotion through brows, mouth, breath and posture (`references/performance.md`).
- **Applies:** 2.5 guide.

### TS-08 Subtitles appear despite "no subtitles"
- **Cause:** Cannot be fully avoided. 2.5 is "substantially improved" over 2.0 (G25, G20).
- **Fix:** Do not repeat the dialogue words after a line. Do not attach separate tone or action notes to specific words. Use `Character's line (emotion): {content}`. Make sure a reference video has no subtitles; replacing a subtitled reference video fixed one extension case with the prompt unchanged (G25). For 2.0: add "keep it subtitle-free", remove non-essential text from references, and note that landscape output had fewer subtitles (G20).
- **Applies:** 2.5 guide and 2.0 FAQ.

### TS-09 Generated text is misspelled
- **Cause:** The model substitutes or drops letters, or misrenders Chinese characters (G25).
- **Fix:** English: split the word into letters that appear in sequence. Any language: supply the exact text as an image and say "referring to Image N" on the text line (G25). For strict text on screen, the 2.0 guide suggests the logo-reference pattern (G20).
- **Pattern:** Prefer text added in the edit (`references/constraints.md`); generate a clean surface.
- **Applies:** 2.5 guide.

### TS-10 A logo or watermark appears
- **Cause:** Not stated (G20).
- **Fix:** "Do not generate a watermark." "Do not generate a logo." (G20).
- **Applies:** 2.0 series.

### TS-21 Fingerprint-like textures in grass or foliage
- **Cause:** A high-resolution AI-generated reference image (G25). Less frequent at 1080p than at 720p.
- **Fix:** Resize the input so it does not exceed the output resolution. The vendor says this is still being optimized (G25).
- **Applies:** 2.5 guide.

## Audio

### TS-11 Background music appears despite "no BGM"
- **Cause:** Some sound effects are rendered as music (G25).
- **Fix:** Option 1: state that audio is character voices only, list the banned terms (music, background music, BGM, score, instrumental, melody, synth effects, ambient pad), and repeat the audio constraint at the start and the end of the prompt. Option 2: isolate the vocals in post-production, which also removes sound effects (G25). The vendor's fixed example dropped one dialogue line, so recheck the dialogue after the change.
- **Pattern:** `Audio policy (all shots): character voices and quiet environmental sound only. No music of any kind: no BGM, score, instrumental, melody, synth or ambient pad. Silence otherwise.` Put it first and last.
- **Applies:** 2.5 guide.

### TS-12 Bubbling, echo or faint whistling in the audio
- **Cause:** Water, wave or echo wording in the prompt (G25).
- **Fix:** Remove that wording. The vendor says this is still being optimized (G25).
- **Applies:** 2.5 guide.

### TS-13 A noise at the end of a narrated clip
- **Cause:** Not stated (G20).
- **Fix:** Regenerate, or fade the audio out at the end in an editor (G20).
- **Applies:** 2.0 series.

### TS-14 Chinese words are mispronounced
- **Cause:** Polyphonic or rare characters (G20).
- **Fix:** Replace the rare name with a common homophone. It is not a full fix (G20).
- **Applies:** 2.0 series.

### TS-15 The voice does not match the reference audio
- **Cause:** Not stated (G20).
- **Fix:** Describe the voice traits in the prompt and keep the line's style close to the reference audio. Example form: use the low, warm, grainy voice of Audio 1 to say the line (G20).
- **Applies:** 2.0 series.

### TS-16 Mixed languages after dubbing
- **Cause:** After translating a multi-character video, source-language speech remains, voices map to the wrong characters, or lips are off (G25).
- **Fix:** Require every line to be translated, including background speech, whispers and interjections; supply the full target-language dialogue with a per-character timeline; require word-level lip sync; state acceptance criteria (no source-language speech, no subtitles, lips match, all other audio and visuals unchanged) (G25).
- **Applies:** 2.5 guide.

## Editing

### TS-17 Edit output is shorter than the input
- **Cause:** Frame handling in edit mode; the example output was about 0.33 s short (G25).
- **Fix:** Option 1: switch to Reference mode and set the target duration (content may then differ from the input). Option 2: stay in Edit mode and make the input's frame count 8n+1; the example matched at 161 frames (G25). A source generated by 2.5 shows no difference (G25).
- **Applies:** 2.5 guide; the drift size is 0.3 s or 0.4 s depending on the page (DISC-03).

### TS-18 Changing the aspect ratio in an edit gives invented, unstable content
- **Cause:** Edit mode locks the ratio; stretching to a new ratio made the model invent inconsistent imagery and drift in time (G25).
- **Fix:** Use Reference mode. Add a detailed plot and timeline and stress frame-by-frame correspondence. The documented prompt has a fidelity header, a reference-content block, an added-canvas block and a timed visual timeline. Set output size and duration in the generation settings, not the prompt (G25).
- **Applies:** 2.5 guide.

### TS-19 A complex task gives unstable results
- **Cause:** One request mixes many reference and edit requirements; one example left a trajectory line in the output (G25).
- **Fix:** Split it. Do a Reference pass first, then an Edit pass that uses that output as a reference asset (G25).
- **Applies:** 2.5 guide.

### TS-28 Too much in one time range gives extra cuts or dropped plot
- **Cause:** An overpacked range, or too little plot in a range (G25).
- **Fix:** Balance the content per range and avoid high-frequency actions in timestamps (G25).
- **Applies:** 2.5 guide.

## Extension

### TS-22 A jump cut at an extension join
- **Cause:** Not stated (G20).
- **Fix:** In an editor, trim 6 frames from the end of the earlier clip and 1 frame from the start of the next, and repeat for each join. End a clip at the transition and begin the next from the new scene (G20).
- **Applies:** 2.0 series.

### TS-23 Quality drops after repeated extensions
- **Cause:** Repeated continuation degrades the picture, for example colour blocks on faces (G20).
- **Fix:** Convert the source video to a white 3D model first (the 2.0 FAQ gives a prompt), use high-quality references, and limit the number of continuations (G20).
- **Applies:** 2.0 series; UNVERIFIED for 2.5.

### TS-33 Volume differs between the original and the extension
- **Cause:** Audio levels may differ slightly (G25).
- **Fix:** Extending a video originally generated by 2.5 gives a smaller volume difference. Check around the join for stitching artifacts (G25).
- **Applies:** 2.5 guide.

## Storyboards and keyframes

### TS-25 Storyboard sheets give still frames, wrong order or ignored panels
- **Cause:** Too many panels (an 18-panel example), cluttered or over-sharpened AI-generated sheets, heavy text on the sheet, a contradictory prompt or implausible camera motion (G25).
- **Fix:** Keep to 15 panels or fewer, use simple line art or stick figures, keep text off the sheet, and describe the plot in the prompt. A sheet is not followed frame by frame; for strict alignment use independent keyframe images (G25).
- **Applies:** 2.5 guide.

## Inputs, API and playback

### TS-20 HTTP 400 on an image upload
- **Cause:** A JPEG with unusual chroma subsampling. The file is not corrupted (G25). The error text is `invalid image: heic: decode failed`.
- **Fix:** Re-encode, for example `ffmpeg -i in.jpg -pix_fmt yuvj420p out.jpg`, or convert to PNG (G25).
- **Applies:** 2.5 guide.

### TS-26 Task-type errors
- **Cause:** `InvalidParameter.TaskTypeMismatch` (the model's inferred type differs from the one set) or `InvalidParameter.TaskTypeConstraint` (parameters conflict with the task type). With `edit` or `extend` set explicitly, a violation is rejected at submission (T25).
- **Fix:** For edit, set `ratio` = `adaptive`, `duration` = -1 and use a 4 to 30 s source. For extension, set `ratio` = `adaptive`. For first frame, set `ratio` = `adaptive`. Make the prompt's wording match the type (T25).
- **Applies:** 2.5 only.

### TS-29 A 1080p or `.mov` file will not play
- **Cause:** 1080p on 2.5 is 10-bit H.265; `.mov` is H.264 with YUV 4:4:4 and PCM audio. Some players cannot decode them (T25).
- **Fix:** Update the OS, use another device, or use VLC, mpv or QuickTime Player (T25).
- **Applies:** 2.5.

### TS-30 HTTP 429 Too Many Requests
- **Cause:** The per-account, per-model rate limit was exceeded (T25).
- **Fix:** Wait; tasks over the concurrency limit queue (T25). The limits are in `profile-2-5.md`.
- **Applies:** 2.5; per-model limits for Flash are UNVERIFIED.

### TS-31 A reference is rejected as a real face
- **Cause:** Direct uploads of real human faces are not supported (PA, API). A fictional face may or may not be treated as real (DISC-12).
- **Fix:** Use a preset digital character, an authorized real-person asset, or a trusted model output from the same account (PA). For a fictional AI-generated character, test the first upload and log the result.
- **Applies:** 2.5 and 2.0 series; Flash is UNVERIFIED.

## Using this file

- Diagnose from the symptom, then check the entry's Applies line against the user's model.
- When a fix has two options, give both and say which costs a regeneration or an editing step.
- Say which part is official, which is this skill's pattern, and which is untested.
- A fix confirmed in a real generation is recorded in `test-log.md`; only then is it TESTED.
