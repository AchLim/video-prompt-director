# Seedance video and audio editing operations

These operation specs are skill-authored templates, not successful generations. Check the registry row, version profile, source media, interface, rights and intended output before use. Flash's page broadly names video editing but does not establish the detailed operations below. Flash-specific modes, controls and combinations remain UNVERIFIED. For a critical edit, propose a small test or a post-production alternative.

## Set the task and preserve the rest

On flagship 2.5, a documented Edit task uses `omni_reference_task_type: edit`, a source reference video of 4-30 seconds, `ratio: adaptive` and `duration: -1`; follow the profile for source format, size and face restrictions. When using `auto`, the classifier may identify the wrong task and report an error asynchronously. First/last-frame roles and omni references cannot be mixed in the same flagship request; Reference, Edit and Extend have different constraints. Name the edit explicitly, identify `Video 1`, and include an acceptance clause for the parts that should remain unchanged. Preserve clauses are intent, not guarantees; inspect the full result. Edit output can be shorter by about 0.3-0.4 s according to differing vendor pages (DISC-03); see TS-17 for Reference-mode duration control or 8n+1 input-frame workaround.

If giving a ModelArk JSON request, `role` is a sibling of `video_url` in each `content` item, not a field inside `video_url`: `{ "type": "video_url", "video_url": { "url": "<source-url>" }, "role": "reference_video" }`. See the [Create video generation task API](https://docs.byteplus.com/en/docs/modelark/create-video-generation-task-api). Do not invent resolution or audio settings when the user has not provided them.

A general structure:

```text
Edit Video 1. Change [specific subject/object/action] from [old state] to [new state]
[throughout or during the specified interval]. [Bind a supplied Image N to the target if supported.]
Preserve [people, identity, camera, motion, environment, timing and unrelated audio] outside
that change. Do not add new events or text. [Describe the requested audio policy.]
```

## Video operations

| IDs | Operation | Direction and scope |
|---|---|---|
| E1-E4 | Instruction edit; add, remove, replace or modify | Name the element, location, old/new state and when it changes. State what must remain, and compare before/after. |
| E5-E7 | Image-assisted edit; character or scene replacement | Bind each `Image N` to the subject or environment it replaces in `Video 1`; preserve action, rhythm and untouched identities. Flagship guidance recommends 1-5 reference images, with 6-8 less stable. |
| E8 | Appearance, age or expression | Specify the desired appearance or performance without replacing unrelated movement, camera, scene or light. |
| E9-E12 | Clothing; light/color; camera; material/style | Each is listed for flagship but lacks a dedicated worked example. A prompt is skill-authored and untested; use a short test and verify unrelated content. |
| E13-E14 | Change an action or edit a time interval | Name the target, exact intended interval and replacement; preserve outside the interval. Integer-second timing applies to flagship 2.5; Flash support is UNVERIFIED and 2.0 timing differs. Do not promise frame-accurate boundaries. |
| E15 | Aspect-ratio conversion | Edit locks the source ratio. Use Reference mode on flagship, select target ratio and duration in generation settings, and provide fidelity requirements, source-content description, added-canvas description and a visual timeline. Output may drift; see TS-18. |
| E16 | Duration-controlled output | Edit requires `duration: -1`. To control output length use Reference mode with a target duration or try an 8n+1 frame source in Edit mode; see TS-17 and DISC-03. Neither workaround is a guarantee. |
| E17 | Partial redraw or restore | Listed task category without a worked recipe. Describe region, time and preservation; this proposed pattern is untested. |
| E18 | Multi-pass edit | Split an overloaded task into a Reference pass and an Edit pass where their requirements conflict; check the intermediate result before continuing. |
| R16 | Reference-plus-edit | The binding pattern is documented for 2.0 only; do not infer its task semantics for 2.5 or Flash. Bind the source dimension and the edited target explicitly. |

## Audio edits on an existing video

| IDs | Operation | Direction and scope |
|---|---|---|
| A1 | Add, remove or modify vocals | Name the speaker, words or section and what other tracks to preserve. General vocal operations are listed; do not invent an exact voice-preservation guarantee. |
| A2 | Music edit | Name the music to add, change or remove and specify that dialogue and effects should remain unchanged. The vendor shows background music removal; review the whole mix. |
| A3 | Effects edit | Identify the sound, event and interval. Sound-effect editing is listed; the precise recipe is untested. |
| A4, A6 | Translate dialogue and adjust lip-sync | Give source speaker, original and target language, exact translated words and timeline; request mouth movement for the new words and preserve everything else. Vendor examples document dubbing and lip-sync adjustment, not perfect synchronization. |
| A5 | Voice replacement | Standalone voice replacement is NOT-DOCUMENTED for 2.5 and UNVERIFIED for Flash. Translation/dubbing is the nearest documented workflow, not proof of arbitrary voice cloning. Offer a dedicated post-production tool or test. |
| A7 | Preserve unrelated content | Say which visuals, voices, ambience, music and timing must remain unchanged. This is an acceptance request, not a guarantee. |

For supplied final audio, mix the untouched master in post unless exact passthrough is documented for the actual model and surface. Do not invent line onset times. For all audio edits retain language, source, consent and identity context as supplied by the user; avoid substituting voices silently.
