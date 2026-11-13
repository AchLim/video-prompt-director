# Seedance capability registry

The single list of every Seedance capability the official documentation names, with the evidence behind each one, per model version. Load it when a request goes beyond a plain text prompt, when you need to say whether a feature exists, or before you promise a feature on Flash.

Read dates: all pages were read on **2026-11-13**. A row does not say "supported" unless a page says so. A row marked `LIST` or `GAP` stays here with its true status; it is never dropped for lacking an example.

## How to read a row

| Column | Values and meaning |
|---|---|
| **ID** | Stable key (G generation, R reference, C clay model, E video editing, A audio editing, X extension and assembly, P platform and API). Do not renumber. |
| **Class** | `LOCKED`: the input fixes the output aspect ratio, and sometimes the duration (editing, extension, first and last frame). `UNLOCKED`: the user sets ratio and duration (reference, storyboard, keyframe tasks). `N/A`: not a task type. |
| **Cov** | Official coverage. `EX` a worked example exists. `TPL` a template or guidance, no full example. `LIST` named in a capability table only. `GAP` not documented. `API` documented as an API parameter or behavior. |
| **Basis** | Where the recipe comes from. `2.5-DOC` a 2.5 page. `2.5-VIA-2.0` the recipe is on the 2.0 guide, and the 2.5 guide says reference tasks (subject, motion, audio, style) work as in 2.0 and links to it. `2.0-ONLY` the 2.0 guide only, with no statement carrying it to 2.5. `NONE` no recipe. |
| **2.5** | Status for Seedance 2.5: `OFFICIAL`, `PARTIAL` (some sub-facts official), `UNVERIFIED`, `NOT-DOCUMENTED`, `UNSUPPORTED`. |
| **Flash** | Status for Seedance 2.5 Flash: `OFFICIAL`, `PARTIAL`, `UNVERIFIED`, `USER-REPORTED`, `TESTED`. Flash has no itemized capability page yet, so no row inherits a 2.5 status. `OFFICIAL` is allowed only when the row's Source cites a Flash-specific page (code `FL`, or `FL2` and later for new pages). `TESTED` needs a PASS entry for a Flash model in `test-log.md`. |
| **2.0** | Status for the Seedance 2.0 series (2.0, Fast, Mini): `OFFICIAL`, `PARTIAL`, `UNSUPPORTED`, `DISCOURAGED`, `UNVERIFIED`, `NOT-DOCUMENTED`. |
| **Source** | Source code and section, from the table below. |
| **Recipe** | `PLANNED:Pn` (the phase that writes the recipe card) or the path of the card once it exists. |
| **Test** | `PLANNED:Pn` or the id of the scenario in `evals/scenarios.json` that checks it. |

Source codes (all under `https://ai.byteplus.com/ark/region:ap-southeast-1/`):

| Code | Page |
|---|---|
| `T25` | `docs/seedance-2-5` (tutorial and model table) |
| `G25` | `docs/seedance-2-5-prompt-guide` (prompt guide, including its FAQ) |
| `API` | `docs/create-video-generation-task-api` |
| `G20` | `docs/seedance-2-0-prompt-guide` |
| `PA` | `docs/seedance-portrait-asset-guide` |
| `FL` | `model/detail?name=dreamina-seedance-2-5-flash` (the only Flash page found) |

Section names after `#` are the page's own anchors where it has them (for example `2.5_draft_mode`) and short labels from this skill where it has none (for example `capability-table`).

Manual check: every row has all 12 cells filled; every cell uses only the values listed above; the Flash cell is `OFFICIAL` only with a Flash-specific source and `TESTED` only with a PASS log entry for a Flash model; no 2.0-only recipe, `GAP` row or row with basis `NONE` is `OFFICIAL` for 2.5; every discrepancy id in a note exists in the discrepancy table; every ID appears in the traceability table. The repository's `scripts/check_registry.py` (Python 3, standard library, not shipped with the installed skill) does the same checks.

## Registry

Phase-plan alignment (2026-11-13): the earlier registry assigned general generation, reference, clay, assembly and platform recipes to P2. The approved handoff defines P2 as storyboard and mapping; these still-unwritten recipes are scheduled for P3 (generation, references, audio and visual direction), P4 (editing and assembly), or P5 (platform and release verification). Their capability rows and evidence classifications are unchanged. Planned labels are future work, not implemented recipes.

### Generation

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| G1 | Text-to-video | N/A | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_capability_overview; G25#prompt-writing-basics | references/models/seedance/recipes-generation.md | PLANNED:P3 | Prompt-only task. No special ratio or duration rule. |
| G2 | First-frame-to-video | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_first-last-frame; API#image_url | references/models/seedance/recipes-generation.md | 17-seedance-role-exclusivity | Role `first_frame` or blank. Ratio must be `adaptive`; output follows the image. Duration 4 to 30 or -1. |
| G3 | First-and-last-frame generation | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_first-last-frame; G25#first-and-last-frames | references/models/seedance/recipes-generation.md | 17-seedance-role-exclusivity | Two supply methods: roles `first_frame` and `last_frame` (locks ratio), or `reference_image` plus "Image 1 is the first frame" (does not lock ratio, may not match exactly). Last-frame ratio mismatch: DISC-04. |
| G4 | Multiple-keyframe generation | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#keyframe-reference | references/models/seedance/recipes-generation.md | 31-seedance-sheet-and-keyframe-prompts | Each keyframe is an independent reference image, in order, with an opening sentence naming the range ("Use Images 1 to 7 in order as keyframes"). Aligns more strictly than a storyboard. Maximum count not stated. |
| G5 | Multi-panel storyboard reference | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#storyboard-reference | references/models/seedance/recipes-generation.md | 31-seedance-sheet-and-keyframe-prompts | Recommended at most 15 panels; simple line art or stick figures; no text on the sheet; not followed frame by frame. An 18-panel example gave still frames or wrong order. |
| G6 | Storyboard plus subject references | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#storyboard-reference | references/models/seedance/recipes-generation.md | 31-seedance-sheet-and-keyframe-prompts | Nine-panel example with an environment image and two subject images. The sheet gives structure and rhythm; the text gives style. |
| G7 | Native multilingual audio and video | N/A | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_multi_language; API#text | references/audio-direction.md | 39-seedance-native-audio | 2.5 lists 11 languages. The 2.0 series lists fewer (English plus Spanish, Indonesian, Portuguese, Japanese per the API page). |
| G8 | Long coherent generation up to 30 s | N/A | EX | 2.5-DOC | OFFICIAL | PARTIAL | UNSUPPORTED | T25#2.5_30s_video; FL | references/models/seedance/recipes-generation.md | 16-seedance-flash-no-inheritance | 2.5 allows 4 to 30 s or -1. The Flash page states up to 30 s; its other limits differ (see the Flash profile). The 2.0 series stops at 15 s. |
| G9 | Draft preview, then final render | N/A | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | UNSUPPORTED | T25#2.5_draft_mode | references/models/seedance/recipes-generation.md | 49-draft-final-last-frame | Draft is 480p only and the final step accepts only 1080p. Flash lists 480p and 720p, so the final step cannot be assumed on Flash: DISC-07. |
| G10 | Return last frame (clip chaining) | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | API#return_last_frame; T25#2.5_capability_overview | references/models/seedance/recipes-generation.md | 49-draft-final-last-frame | Returns the last frame as a JPEG at video size, without watermark. Lets the next clip start from it. |
| G11 | Native audio generation (`generate_audio`) | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | API#generate_audio; T25#2.5_capability_overview | references/audio-direction.md | 39-seedance-native-audio | Default true. Audio-enabled output is stereo. Dialogue markup differs between pages: DISC-10. |
| G12 | On-screen text (slogans, subtitles, speech bubbles) | N/A | EX | 2.0-ONLY | UNVERIFIED | UNVERIFIED | OFFICIAL | G20#appendix-text-generation | references/models/seedance/recipes-generation.md | PLANNED:P5 | Templates exist only on the 2.0 guide. The 2.5 guide documents text errors and fixes (TS-09). Only on explicit request, because the skill's default is no generated text. |

### Reference-to-video

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 | Subject image reference | UNLOCKED | EX | 2.5-VIA-2.0 | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#advanced-formula | references/models/seedance/recipes-reference.md | 50-subject-and-multiview | Binds identity or appearance from one or more images. 2.5 recommends 1 to 8 subjects; 9 to 12 is less stable. |
| R2 | Subject video reference (appearance, voice) | UNLOCKED | TPL | 2.5-VIA-2.0 | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#advanced-formula | references/models/seedance/recipes-reference.md | 50-subject-and-multiview | A subject can be defined from a video. Recommended 1 to 5 subjects, 5 to 10 s per input. |
| R3 | Subject audio reference (timbre, voice) | UNLOCKED | TPL | 2.5-VIA-2.0 | OFFICIAL | UNVERIFIED | OFFICIAL | G25#reference-tasks; T25#2.5_capability_overview | references/models/seedance/recipes-reference.md | 22-seedance-audio-reference-honesty | Audio-only input is 2.5 only; the 2.0 series needs an image or video with it. Documented use is a voice or timbre reference. Word-for-word playback with lip-sync of a supplied recording is not documented. |
| R4 | Image plus audio binding | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#reference-tasks | references/models/seedance/recipes-reference.md | 22-seedance-audio-reference-honesty | Bind images and audio to a character by number, in upload order of first appearance. |
| R5 | Multi-view subject reference | UNLOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | DISCOURAGED | G25#differences-from-2-0; G25#asset-input-recommendations | references/models/seedance/recipes-reference.md | 50-subject-and-multiview | 2.5 supports multi-view images for 1 to 5 subjects. Above 5 subjects, split views into separate images. The 2.0 FAQ discourages multi-view sheets. Flash support is unconfirmed. |
| R6 | Motion and action reference | UNLOCKED | EX | 2.5-VIA-2.0 | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#motion-reference | references/models/seedance/recipes-reference.md | 36-reference-role-binding | Template: refer to a motion description in a numbered video. Works with subject images. |
| R7 | Expression transfer | UNLOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-reference.md | PLANNED:P3 | Named under the motion row. No dedicated recipe or example. |
| R8 | Camera-movement reference | UNLOCKED | EX | 2.5-VIA-2.0 | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#camera-motion-reference | references/models/seedance/recipes-reference.md | 36-reference-role-binding | Template: refer to a camera movement description in a numbered video. |
| R9 | Special-effects reference | UNLOCKED | EX | 2.5-VIA-2.0 | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#special-effects-reference | references/models/seedance/recipes-reference.md | PLANNED:P3 | The 2.5 table lists "effects"; the recipe and examples are on the 2.0 guide. The 2.0 FAQ recommends an effect video when text cannot describe the effect. |
| R10 | "Creativity" reference | UNLOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-reference.md | PLANNED:P3 | The word appears in the motion row of the 2.5 table ("action, expression, camera movement, creativity, effects"). It is not defined anywhere read. |
| R11 | Visual style reference | UNLOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#cases | references/models/seedance/recipes-reference.md | PLANNED:P3 | Table row for image or video style references and style plus subject. The 2.0 guide shows only a pattern ("use this image as a style reference"). No dedicated 2.5 recipe. |
| R12 | Audio, music and voice reference | UNLOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#cases | references/models/seedance/recipes-reference.md | 22-seedance-audio-reference-honesty | Table describes music, melody, dialogue, voice, tone and timbre. No dedicated music recipe. |
| R13 | Compound reference (motion, style or audio plus subject) | UNLOCKED | LIST | 2.5-DOC | OFFICIAL | PARTIAL | OFFICIAL | G25#capability-table; G20#cases | references/models/seedance/recipes-reference.md | 36-reference-role-binding | Two 2.0 cases combine images, a camera video and an audio clip. The Flash page names "multimodal references" in general terms and limits them to 10 images, 5 videos and 5 audio clips (FL); which combinations work is not itemized. |
| R14 | Logo or brand-element reference | UNLOCKED | EX | 2.0-ONLY | UNVERIFIED | UNVERIFIED | OFFICIAL | G20#appendix-image-reference | references/models/seedance/recipes-reference.md | PLANNED:P3 | A logo image kept in a corner or formed by moving elements. 2.0 guide only. |
| R15 | Sequence reference (panel sheet in strict order) | UNLOCKED | EX | 2.0-ONLY | UNVERIFIED | UNVERIFIED | OFFICIAL | G20#appendix-image-reference | references/models/seedance/recipes-generation.md | PLANNED:P3 | A sheet whose compositions are presented "in strict predefined order". Overlaps with G5; 2.5 has its own storyboard guidance. |
| R16 | Reference-plus-edit instruction | UNLOCKED | TPL | 2.0-ONLY | UNVERIFIED | UNVERIFIED | OFFICIAL | G20#basic-formula | references/models/seedance/recipes-editing.md | PLANNED:P4 | Pattern: reference a dimension of an image or video, and strictly edit another video. |

### 3D clay-model workflows

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C1 | Coarse-grained clay-model video rendering | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#coarse-whitemodel | references/models/seedance/recipes-reference.md | 51-clay-workflows | Simple primitives for people, objects and animals work best. The clay video is the reference for camera, rhythm and motion only. "Do not reference its visual content." |
| C2 | Fine-grained clay-model video rendering | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#fine-whitemodel | references/models/seedance/recipes-reference.md | 51-clay-workflows | A complete, clean clay video re-rendered ("coloring"). No trajectory lines, coordinate lines or camera cones. The page's guidance is thin. |
| C3 | Clay model plus character references | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#whitemodel-reference | references/models/seedance/recipes-reference.md | 51-clay-workflows | Map each clay figure to a reference subject in the prompt. |
| C4 | Clay model plus scene references | UNLOCKED | GAP | NONE | NOT-DOCUMENTED | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-reference.md | 38-clay-gap-honesty | Not listed on its own. It appears only as part of clay plus subject plus scene (C5). Kept so the gap is visible. |
| C5 | Clay model plus characters plus scene | UNLOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table; G25#whitemodel-reference | references/models/seedance/recipes-reference.md | 51-clay-workflows | The table lists the combination. The coarse example uses nine extra images; its numbering is inconsistent: DISC-09. |
| C6 | Camera blocking, spatial layout and movement paths from a clay video | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#coarse-whitemodel | references/models/seedance/recipes-reference.md | 51-clay-workflows | A coarse clay video can carry cuts, camera movement, shot rhythm, blocking, subject motion trajectory and lighting changes. |
| C7 | Video-to-white-model conversion (quality workaround) | N/A | TPL | 2.0-ONLY | UNVERIFIED | UNVERIFIED | OFFICIAL | G20#faq | references/models/seedance/recipes-assembly.md | 53-versioned-assembly | The 2.0 FAQ converts a source video to a white 3D model before repeated extensions to limit degradation (TS-23). |

### Video editing

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| E1 | Instruction-based video editing | LOCKED | EX | 2.5-DOC | OFFICIAL | PARTIAL | OFFICIAL | T25#2.5_edit; G25#edit-examples | references/models/seedance/recipes-editing.md | 40-edit-existing-video | Needs `omni_reference_task_type=edit` or edit trigger words, a reference video of 4 to 30 s, ratio `adaptive`, duration -1. Flash page names "video editing" only in general terms. |
| E2 | Add an element | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_task_type_intro; G20#video-editing | references/models/seedance/recipes-editing.md | PLANNED:P4 | Name the element, the timing and the location. |
| E3 | Remove an element (subjects, subtitles, watermarks) | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#capability-table; G20#video-editing | references/models/seedance/recipes-editing.md | PLANNED:P4 | State what must stay unchanged. |
| E4 | Replace or modify an element | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#editing-tasks; G20#video-editing | references/models/seedance/recipes-editing.md | PLANNED:P4 | Describe the change from the old state to the new one. |
| E5 | Editing with reference images | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#video-refimage-edit | references/models/seedance/recipes-editing.md | PLANNED:P4 | 1 to 5 reference images is recommended; 6 to 8 is less stable. |
| E6 | Character replacement | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#video-refimage-edit | references/models/seedance/recipes-editing.md | PLANNED:P4 | Replace named people in the source with people from reference images, keeping the source's actions and rhythm. |
| E7 | Environment or background replacement | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#video-refimage-edit | references/models/seedance/recipes-editing.md | PLANNED:P4 | Same example as E6. |
| E8 | Appearance, age or expression change | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#video-instruction-edit | references/models/seedance/recipes-editing.md | PLANNED:P4 | Example ages a character while keeping composition, camera, lighting and rhythm. |
| E9 | Clothing or costume modification | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-editing.md | 23-seedance-listed-only-honesty | Named in the editing row. No worked example. |
| E10 | Lighting and colour modification | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-editing.md | 23-seedance-listed-only-honesty | Named in the editing row. No worked example. |
| E11 | Camera or camera-position modification | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-editing.md | PLANNED:P4 | Named in the editing row. No worked example. |
| E12 | Material and visual-style modification | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-editing.md | PLANNED:P4 | Named in the editing row. No worked example. |
| E13 | Action or motion replacement | LOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#editing-tasks | references/models/seedance/recipes-editing.md | PLANNED:P4 | Guidance example changes one action for a stated 4 to 6 s span and keeps the rest. |
| E14 | Timestamp-based partial edit | LOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#editing-tasks; G20#video-editing | references/models/seedance/recipes-editing.md | 40-edit-existing-video | The guide says to use timestamps for partial edits. The 2.0 template has a timing slot but no timestamp example. |
| E15 | Aspect-ratio conversion (video to canvas) | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#faq-aspect-ratio-editing | references/models/seedance/recipes-editing.md | 21-seedance-aspect-conversion | Edit mode locks the ratio and gave unstable results when changed. The documented fix is Reference mode with a reference-content, added-canvas and timeline prompt. |
| E16 | Duration-controlled editing | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#faq-duration; T25#2.5_duration | references/models/seedance/recipes-editing.md | 18-seedance-edit-duration-drift | Output can be about 0.3 to 0.4 s shorter (DISC-03). Fix: Reference mode with a set duration, or an input whose frame count is 8n+1. |
| E17 | Partial redraw or restore | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#task-instructions | references/models/seedance/recipes-editing.md | PLANNED:P4 | Named in the description of the editing task. No recipe. |
| E18 | Multi-pass complex edit | N/A | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#faq-complex-tasks | references/models/seedance/recipes-editing.md | PLANNED:P2 | A task with many requirements is split into a Reference pass and an Edit pass. Applies to composition (see the composer in Phase 2). |

### Audio editing

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A1 | Add, remove or modify vocals | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table; G25#editing-tasks | references/models/seedance/recipes-editing.md | 52-audio-edit-types | Table row. An example changes one character's dialogue and accent. |
| A2 | Add, remove or modify music | LOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | T25#2.5_task_type_intro | references/models/seedance/recipes-editing.md | 52-audio-edit-types | Example prompt removes background music from a video. |
| A3 | Add, remove or modify sound effects | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-editing.md | 52-audio-edit-types | Table row only. |
| A4 | Dialogue translation | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#video-audio-edit; G25#faq-mixed-languages | references/models/seedance/recipes-editing.md | 41-audio-edit-translation | Two examples: a one-line form and a detailed form with timeline and acceptance criteria (TS-16). |
| A5 | Voice replacement | LOCKED | GAP | NONE | NOT-DOCUMENTED | UNVERIFIED | NOT-DOCUMENTED | G25#faq-mixed-languages | references/models/seedance/recipes-editing.md | 42-voice-replacement-gap | Not documented as a feature. Dubbing in another language is the nearest documented case (A4). |
| A6 | Lip-sync adjustment | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#video-audio-edit | references/models/seedance/recipes-editing.md | 41-audio-edit-translation | Word-level lip sync after translating dialogue. |
| A7 | Preserve all unrelated audio and visuals | LOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#faq-mixed-languages; G20#basic-formula | references/models/seedance/recipes-editing.md | 52-audio-edit-types | 2.5: acceptance wording "all other audio and visuals unchanged". 2.0: parts not mentioned remain unchanged by default. |

### Extension and assembly

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| X1 | Extend forward | LOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | G25#video-extend; T25#2.5_extend | references/models/seedance/recipes-assembly.md | 43-forward-backward-extension | Ratio `adaptive`; `.mov` required by the example. Extending a 2.5-generated video gives a smaller volume difference. The Flash page does not mention extension. |
| X2 | Extend backward | LOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_task_type_intro; G20#extending-videos | references/models/seedance/recipes-assembly.md | 43-forward-backward-extension | Trigger words include "extend backward". The 2.0 guide has a backward example. |
| X3 | Extension with a subject reference | LOCKED | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | T25#2.5_task_type_intro | references/models/seedance/recipes-assembly.md | 53-versioned-assembly | Example prompt extends a video backward with a character from an image. |
| X4 | Multiple rounds of extension | LOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | T25#intro | references/models/seedance/recipes-assembly.md | 53-versioned-assembly | Named in the 2.5 introduction. No recipe. Quality after repeated extensions is a known issue (TS-23). |
| X5 | Seamless transition between two videos | N/A | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#video-transition | references/models/seedance/recipes-assembly.md | 44-transition-and-one-click | Generates the missing middle. The example refers to the clips as bracketed numbers and says not to alter the two videos. |
| X6 | One-click video from multiple images | UNLOCKED | EX | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#one-click-video | references/models/seedance/recipes-assembly.md | 44-transition-and-one-click | Example uses eight images in free order; images may move slightly but must not be altered. |
| X7 | One-click video from videos, or with a reference video | UNLOCKED | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-assembly.md | 44-transition-and-one-click | Table row only. No example with videos. |
| X8 | Combined multimodal capabilities | N/A | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | G25#capability-table | references/models/seedance/recipes-assembly.md | 17-seedance-role-exclusivity | The table says capabilities can be combined freely. Role exclusivity limits what can combine (P1). |
| X9 | Track completion (up to three clips) | N/A | EX | 2.0-ONLY | UNVERIFIED | UNVERIFIED | OFFICIAL | G20#completing-tracks | references/models/seedance/recipes-assembly.md | 53-versioned-assembly | At most 3 input clips, total at most 15 s; the model trims the connecting frames. Not carried to 2.5 by any statement. |

### Platform and API

| ID | Capability | Class | Cov | Basis | 2.5 | Flash | 2.0 | Source | Recipe | Test | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | Task classification and `omni_reference_task_type` | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | UNSUPPORTED | T25#2.5_task_type_intro; API#omni_reference_task_type | references/models/seedance/recipes-editing.md | 17-seedance-role-exclusivity | Values `auto`, `reference`, `edit`, `extend`. First-frame, first-and-last-frame and omni reference cannot be mixed in one request. Error codes are in the flagship profile. |
| P2 | Integer-second timestamps | N/A | TPL | 2.5-DOC | OFFICIAL | UNVERIFIED | UNSUPPORTED | G25#timestamps; G25#differences-from-2-0 | references/models/seedance/syntax.md | PLANNED:P3 | 2.5 supports integer-second timestamps. The 2.0 series responds to shot numbers and treats precise timing as unstable. |
| P3 | Output controls | N/A | API | 2.5-DOC | OFFICIAL | PARTIAL | OFFICIAL | T25#2.5_video_output_specs; API#parameters | references/models/seedance/profile-2-5.md | 16-seedance-flash-no-inheritance | Resolution, ratio, duration, `output_format`, watermark. Flash page: 480p and 720p, up to 30 s; ratios and format not stated. |
| P4 | Asset IDs, real-face rule, trusted outputs | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | PA; API#image_url; T25#2.5_convenient_creation | references/models/seedance/platform-operations.md | 54-platform-assets | Real human faces cannot be uploaded directly. Fictional or AI-generated faces are not addressed as their own category (DISC-12). |
| P5 | Reference input limits and recommendations | N/A | API | 2.5-DOC | OFFICIAL | PARTIAL | OFFICIAL | T25#2.5_50_reference; API#content; FL | references/models/seedance/profile-2-5.md | 16-seedance-flash-no-inheritance | 2.5: up to 50 (30 images, 10 videos, 10 audio). Flash page: up to 10 images, 5 videos, 5 audio. 2.0 series: up to 15 (9, 3, 3). Reference image count wording conflicts: DISC-01. |
| P6 | Prompt-length recommendation | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | API#text | references/density-and-budget.md | 45-interface-vs-model-limits | Recommended at most 500 Chinese characters or 1,000 English words. A recommendation, not a stated cap. No per-model line. |
| P7 | Official prompt-optimizer skill (`sd25-pe`) | N/A | LIST | 2.5-DOC | OFFICIAL | UNVERIFIED | NOT-DOCUMENTED | T25#2.5_prompt_guide; G25#intro | references/models/seedance/platform-operations.md | PLANNED:P5 | External code the vendor suggests installing. This skill only mentions it and does not depend on it. |
| P8 | Legacy inline parameters (`--rs`, `--rt`, `--dur`, `--seed`, `--cf`, `--wm`) | N/A | API | NONE | UNVERIFIED | UNVERIFIED | UNVERIFIED | API#parameter-input-methods | references/models/seedance/platform-operations.md | 46-unknown-api-parameters | The page prefers body parameters and says per-model support was not found for this syntax. |
| P9 | Sample task ID input | N/A | LIST | NONE | UNVERIFIED | UNVERIFIED | UNVERIFIED | API#content-combinations | references/models/seedance/platform-operations.md | 46-unknown-api-parameters | Listed as an allowed content combination. No item schema found. |
| P10 | Base64 inputs | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | API#image_url; API#audio_url | references/models/seedance/platform-operations.md | 54-platform-assets | Images and audio accept URL, base64 data URI or asset ID. Videos accept URL or asset ID. Request body at most 64 MB. |
| P11 | Determinism controls (`seed`, `camera_fixed`, `frames`) | N/A | API | NONE | UNVERIFIED | UNVERIFIED | UNVERIFIED | API#parameters | references/models/seedance/platform-operations.md | 46-unknown-api-parameters | Listed for 1.x models in the per-parameter lines; a general note says all models. Not documented for 2.5 or 2.0: DISC-02. |
| P12 | Operational controls (`service_tier`, `priority`, `callback_url`, `execution_expires_after`, `safety_identifier`) | N/A | API | 2.5-DOC | PARTIAL | UNVERIFIED | PARTIAL | API#parameters | references/models/seedance/platform-operations.md | 54-platform-assets | `priority` is listed for 2.5 and 2.0. `flex` is not supported for either. Model support lines for the others were not found. |
| P13 | Retention and rate limits | N/A | API | 2.5-DOC | OFFICIAL | UNVERIFIED | OFFICIAL | T25#2.5_storage_duration; T25#2.5_rate_limits | references/models/seedance/platform-operations.md | 48-retention-rate-limits | Video URL kept 24 h with at most 100 downloads; task IDs 7 days. Rate limits are per account and model, not per version. |

## Discrepancies and unresolved items

Each stays UNVERIFIED until resolved. Both statements are recorded.

| ID | What conflicts | Sources |
|---|---|---|
| DISC-01 | Reference images are "0 to 30" in one place and "1 to 30" in another (2.0: "0 to 9" and "1 to 9"). | API |
| DISC-02 | `seed`, `camera_fixed`, `frames` and `watermark` are listed for specific models in one place, and a general note says seven parameters work for all models. Nothing documents `seed` or `camera_fixed` for 2.5. | API |
| DISC-03 | Edit output can be shorter than the input by about 0.3 s (G25) or up to 0.4 s (T25, API). The page also shows a `duration: 10` example beside the rule that edit accepts only -1. | G25, T25, API |
| DISC-04 | A last frame with a different aspect ratio is "stretched" (G25) or center-cropped to the first frame's ratio (API). | G25, API |
| DISC-05 | The cURL edit and extend samples omit `omni_reference_task_type`, but the SDK samples set it. | T25 |
| DISC-06 | The Flash notice says "now available" and also that it is available for online use and API calls from 2026-11-15 14:00 (UTC+8). | T25, API, FL |
| DISC-07 | The Draft final step accepts only 1080p, while the Flash page lists 480p and 720p. | T25, FL |
| DISC-08 | The Flash page gives no model ID, ratios, minimum duration, per-mode support, `generate_audio` or prompt length. | FL |
| DISC-09 | Official examples contain inconsistencies: a renumbering example says one swap but changes seven references; a caption maps to the wrong image; a timeline in the canvas example does not match its video; a clay example numbers images from 2 while using `1pic`. Treat example numbering as illustrative. | G25 |
| DISC-10 | Reference and markup syntax varies across pages: `Image 1`, `@Image1`, `<Image 1>`, `[Video 1]`, `<video1>`, `<1pic>`; subtitles in `[]` or in bracket characters; dialogue in braces (guides) or double quotes (API). No page names one form as canonical. | G25, G20, T25, API |
| DISC-11 | The API general note and the per-parameter lists disagree on which models support `output_format`, `frames` and `watermark`. | API |
| DISC-12 | The real-face rule names "Seedance 2.5 and 2.0 series" and does not name Fast or Mini. Fictional AI-generated faces are not addressed, and no detection method is described. | PA, API |
| DISC-13 | The 2.5 tutorial's prompt tips list `<>` for sound effects, as the 2.0 guide does, but the 2.5 prompt guide's examples describe sound effects in plain text and were not found using angle brackets. Whether angle brackets are the intended 2.5 form is not stated. | T25, G25, G20 |

Reading coverage: the five long pages above (`T25`, `G25`, `API`, `G20`, `PA`) were each read verbatim in full on 2026-11-13; the last part of `API` (about the final 27,000 characters, which holds only code samples) was read in a later pass that did not report an exact character count. The Flash page (`FL`) is only about 2,000 characters long. The error-code page was subsequently checked on 2026-11-13; the English reader exposed no table, while the Korean-language page exposed the general list. Other linked pages not fully reviewed: the model list, the retrieval API page, and the 2.0 tutorial (`docs/seedance-2-0`, only partly read, and not a source for any row here).

## Traceability

Every registry ID appears at least once below, and every ID below exists in the registry.

| Source item | IDs |
|---|---|
| G25 capability table: subject image, subject audio and video, image plus audio | R1, R2, R3, R4 |
| G25 capability table: motion, action, expression, camera movement, creativity, effects, motion plus subject | R6, R7, R8, R9, R10, R13 |
| G25 capability table: 3D clay model, clay plus subject, clay plus subject plus scene | C1, C2, C3, C5, C6 |
| G25 capability table: style reference, style plus subject | R11, R13 |
| G25 capability table: audio reference, audio plus subject | R3, R12, R13 |
| G25 capability table: storyboard, storyboard plus subject | G5, G6 |
| G25 capability table: multiple keyframes, first and last keyframes | G3, G4 |
| G25 capability table: first and last frames | G2, G3 |
| G25 capability table: instruction editing, add, modify, remove | E1, E2, E3, E4, E17 |
| G25 capability table: editing with reference images | E5, E6, E7, E8 |
| G25 capability table: costumes, lighting, colour, camera, material, style edits | E9, E10, E11, E12, E13 |
| G25 capability table: audio editing (vocals, music, sound effects) | A1, A2, A3 |
| G25 capability table: extension, forward and backward, with subject reference | X1, X2, X3 |
| G25 capability table: one-click creation, seamless transition, combined capabilities | X5, X6, X7, X8 |
| G25 task instructions: locked and unlocked tasks | P1, E1, G2, G3, X1 |
| G25 reference asset recommendations | P5, R5 |
| G25 timestamps and differences from 2.0 | P2, R5 |
| G25 examples: clay, storyboard, keyframe | C1, C2, C3, G4, G5, G6 |
| G25 examples: video editing, audio editing, extension, one-click, transition | E1, E5, E6, E7, E8, A4, A6, X1, X6, X5 |
| G25 FAQ: aspect ratio, duration, complex tasks, translation | E15, E16, E18, A4, A5, A7 |
| T25 capability overview, 30 s example, 50-reference example | G1, G8, P5, G10, G11 |
| T25 task types, constraints, errors | P1, A2, X2, X3, X4 |
| T25 draft mode | G9 |
| T25 output specs, multilingual, limits, retention, rate limits | P3, G7, P13 |
| T25 portrait creation and prompt tips | P4, P7 |
| API parameters and content items | P3, P8, P9, P10, P11, P12, P6 |
| G20 formulas, subject definition and combined tasks | R1, R2, R16 |
| G20 appendix: text generation | G12 |
| G20 appendix: image, video, editing, extension, track completion | R14, R15, R6, R8, R9, E14, X2, X9 |
| G20 FAQ: white-model conversion | C7 |
| PA real-face rule and asset routes | P4 |
| FL Flash model page | G8, P3, P5, E1, X1 |
| User's list: generation, reference, clay, editing, audio editing, extension and assembly | G1, G2, G3, G4, G5, R1, R2, R3, R4, R5, R6, R7, R8, R12, C1, C2, C3, C4, C5, C6, E1, E2, E3, E4, E5, E6, E7, E8, E9, E10, E11, E12, E14, E15, A1, A2, A3, A4, A5, A6, A7, X1, X2, X3, X4, X5, X6, X7, X8 |
