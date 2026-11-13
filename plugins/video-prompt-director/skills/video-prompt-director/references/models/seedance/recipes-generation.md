# Seedance recipes: storyboard, keyframe and sequence references

Recipe cards for the generation capabilities that approved storyboards use: multi-panel storyboard reference (G5), storyboard plus subject references (G6), multiple keyframes (G4) and the 2.0-only sequence reference (R15). Each card follows the registry row of the same ID (`capability-registry.md`). Recipes for the other generation and reference capabilities (text-to-video, first and last frame, subject, motion, camera, style, audio and clay-model references) are added to this file as they are written; until then the registry row and `syntax.md` are the reference for them.

How to read this file: facts are **OFFICIAL**, read on **2026-11-13** from the Seedance 2.5 prompt guide (called G25) or the 2.0 prompt guide (G20), unless a line carries another tag (`references/models/other.md`). The prompts and specs are written for this skill; they follow the documented structure and are not the vendor's examples. Flash status is UNVERIFIED for every card unless a line says otherwise. Each card ends with the validation test that checks it.

The storyboard planning (modes, mapping types, caps) is in `references/storyboard.md`; the image prompts for sheets and keyframes are in `references/storyboard-images.md`.

## Choosing between them

| Need | Use | Why |
|---|---|---|
| The structure and rhythm of a multi-shot generation, with some freedom | G5 or G6, a line-art sheet | The sheet is a high-level reference, "not followed exactly frame by frame" (G25) |
| The picture should follow key poses closely | G4, independent keyframes | Keyframes aim at closer alignment than sheets; an exact match is not guaranteed (G25) |
| A hard first frame, or first and last frame | `first_frame` and `last_frame` roles (registry G3) | They lock the aspect ratio, and cannot be mixed with other references (P1) |
| Strict first frame together with a motion or camera video | `reference_image` plus "Image 1 is the first frame" | Not locked, may not match exactly (G25) |

Two facts decide most mistakes:
- `first_frame` and `last_frame` roles, and omni references, cannot be mixed in one request (registry P1).
- Combining a storyboard sheet with keyframes in one request is not shown in the documentation. Mark that combination UNVERIFIED, and prefer one approach per generation.

## Card G5: multi-panel storyboard reference

1. **What it does.** A single image of several panels guides the structure, shot sizes and camera rhythm of one generation. It is unlocked: you set the ratio and the duration.
2. **When to use it.** A multi-shot generation (mapping type M) where the order of shots matters but exact framing does not.
3. **Required assets.** One storyboard sheet; usually also subject, scene and style references.
4. **Preparing them.** Simple line art or stick figures; at most 15 panels (recommended, not an API limit); no text on the sheet; no cluttered, over-sharpened AI sheets. An 18-panel example gave still frames or the wrong order (G25).
5. **Reference mapping.** Number assets by upload order and state the sheet's role: "Image 1: the storyboard reference, used only for shot structure, shot sizes and camera rhythm."
6. **Prompt syntax.** Three steps (G25): state the reference mapping; write an overall story summary; describe the plot per shot, filling in at least what the sheet does not show. Timestamps are allowed on 2.5. For a loose concept sheet the guide allows a short prompt that asks for a coherent story following the sheet's sequence.
7. **Settings.** Reference task (`omni_reference_task_type` = `reference`, or `auto`); sheet as a `reference_image`; ratio and duration are yours. API names; check the user's interface (`references/models/platforms.md`).
8. **Limitations.** Not frame by frame; the model keeps some autonomy; over about 15 panels it can freeze or reorder.
9. **Failure patterns.** TS-25 in `troubleshooting.md`; the sheet's line-art look leaking into the video (say the sheet gives structure only and describe the style in words); text on the sheet.
10. **Example.** Under G6 below, which adds subject references.
11. **Compatibility.** Combines with subject images (G6), scene and style references and audio references. Do not combine with `first_frame` or `last_frame` roles. Storyboard plus keyframes in one request: UNVERIFIED.
12. **Status.** 2.5 OFFICIAL. Flash UNVERIFIED (the sheet counts as one of Flash's 10 images). 2.0 series: not documented as a storyboard reference; see R15.

Validation test: scenario `31-seedance-sheet-and-keyframe-prompts`, which checks the sheet and keyframe prompts.

## Card G6: storyboard plus subject references

1. **What it does.** A storyboard sheet gives structure; separate references give identity, environment and style.
2. **When to use it.** Almost always when a sheet is used: the sheet carries no identity.
3. **Required assets.** The sheet, one or more character images, a scene image (optional), and a style reference (optional).
4. **Preparing them.** Character references as a close headshot plus a full-body image, upload order by first appearance (TS-01). Fictional AI-generated faces are not addressed in the documentation (registry P4); test the first upload.
5. **Reference mapping.** One line per asset: what it supplies and what not to take.
6. **Prompt syntax.** The structure the documented nine-panel example uses: subject settings, overall style, a strict-exclusion list, then the shot list with dialogue per shot.
7. **Settings.** As G5. Counts: flagship allows far more than needed; **Flash allows 10 images**, so a sheet, three characters, a scene and a style reference already use 6.
8. **Limitations.** As G5; more than about 4 to 5 reference people lowers stability (G20).
9. **Failure patterns.** Characters swapped with the wrong reference (TS-01); glowing eyes (TS-07); unwanted music (TS-11); the sheet drawn into the video.
10. **Example (skill-authored).** Two shots in one generation, the over-the-shoulder line and the listener's reaction:

```
Operation spec: G6, storyboard plus subject references
Model: Seedance 2.5 (flagship). On Flash: UNVERIFIED, test first.
Task: reference (omni_reference_task_type = reference or auto)
Assets in upload order:
  Image 1  storyboard sheet, 2 panels   role: reference_image   controls: shot structure, sizes, rhythm   ignore: its line-art style
  Image 2  Lina, headshot and full body  role: reference_image   controls: face, hair, wardrobe
  Image 3  Marco, headshot and full body role: reference_image   controls: face, hair, wardrobe
  Image 4  hallway                       role: reference_image   controls: layout and light
Settings: ratio 9:16 (set by you, not locked), duration 7 s, resolution 720p, generate_audio on, output mp4
Check: the names of these settings in your interface.
```

```
Image 1 is the storyboard reference for this generation: use it only for the shot structure, the shot sizes and the camera rhythm, and do not draw in its line-art style. Image 2 is Lina and Image 3 is Marco: keep each one's face, hair and exactly the clothes in their references. Image 4 is the hallway: keep its layout and light.

Overall: realistic live-action vertical drama, soft practical light, muted colour. Marco blocks the front door of a narrow hallway. Lina holds a packed bag.

Shot 1 (0-4 s): over the shoulder from behind Lina, eye level, locked off. Marco stands close and speaks, jaw tight. Marco's line (low, controlled): {You do not get to leave like this.}
Shot 2 (4-7 s): close-up on Lina, eye level, locked off. She does not answer. Her eyes stay on him, her jaw sets, and she takes one slow breath.

Audio: the two voices only, with a faint room tone. No music. No subtitles or on-screen text. No one else appears.
```
On Flash, write the shots as ordered beats ("Shot 1 ... then Shot 2 ...") until timestamps are confirmed there (`profile-2-5-flash.md`).

11. **Compatibility.** As G5.
12. **Status.** 2.5 OFFICIAL. Flash UNVERIFIED. 2.0 series: NOT-DOCUMENTED.

Validation test: scenario `31-seedance-sheet-and-keyframe-prompts`.

## Card G4: multiple-keyframe generation

1. **What it does.** Independent images, in order, act as keyframes the video passes through. Alignment is stricter than a sheet's. Unlocked: ratio and duration are yours.
2. **When to use it.** A contact moment, key poses, a reveal, or anything the sheet cannot hold exactly (mapping type K).
3. **Required assets.** One image per keyframe, each a full-frame picture, in story order.
4. **Preparing them.** Characters consistent across the images (they carry identity, because mixing keyframes with separate subject references is not shown in the documentation). Resize each image so it does not exceed the output resolution (TS-21). Convert unusual JPEGs (TS-20).
5. **Reference mapping.** The first sentence of the prompt names the range: "Use Images 1 to 3 in order as keyframes." Then assign each image to its beat.
6. **Prompt syntax.** Keyframe statement first, then the scene in shots; the documented example also lists overall requirements such as a continuous camera and no stuttering or flickering.
7. **Settings.** Reference images (not the first and last frame roles); ratio and duration set by you; the number of keyframes is not stated as a limit (the documented example uses seven images).
8. **Limitations.** Each keyframe is an image slot (Flash: 10 images in all). Whether keyframes combine with other reference types in one request is not documented.
9. **Failure patterns.** The images drifting in identity between keyframes; keyframe order wrong (renumber by story order); text on a keyframe not holding (supply it as an image or add it in post).
10. **Example (skill-authored).** The contact sequence of a wrist grab, three keyframes:

```
Operation spec: G4, multiple keyframes
Model: Seedance 2.5 (flagship). On Flash: UNVERIFIED, test first.
Task: reference (keyframes as reference_image, in order)
Assets in upload order:
  Image 1  keyframe: Marco's hand moving toward Lina's left wrist
  Image 2  keyframe: Lina's eyes dropping to the hand
  Image 3  keyframe: Marco's fingers closed around her wrist
Settings: ratio 9:16 (set by you), duration 6 s, resolution 720p, generate_audio on, output mp4
Note: identity is carried by the three images, so no separate character references are added.
```

```
Use Images 1 to 3 in order as keyframes. A realistic vertical drama, soft hallway light, muted colour. Three ordered shots: a close-up of the approaching hand, a close-up of the eyes, then a close-up of the grip. Each shot is locked off; cut between them.

Image 1: Marco's right hand rises from his side and moves slowly toward Lina's left wrist. Image 2: Lina's eyes drop to the hand, and her breath stops. Image 3: Marco's fingers close around her left wrist, and her arm tenses.

Keep movement within each shot natural and the cuts clear. Keep the same two people, the same clothes and the same hallway throughout. No flicker, no stutter. No music. No subtitles or on-screen text.
```

11. **Compatibility.** Not with `first_frame` or `last_frame` roles in the same request. A first and last frame pair can be given as `reference_image` with "Image 1 is the first frame. Image 3 is the last frame", which does not lock the ratio (registry G3). Combination with a sheet or other references: UNVERIFIED.
12. **Status.** 2.5 OFFICIAL. Flash UNVERIFIED. 2.0 series: NOT-DOCUMENTED.

Validation test: scenario `31-seedance-sheet-and-keyframe-prompts`.

## Card R15: sequence reference (2.0 guide only)

1. **What it does.** A multi-panel image whose compositions are presented "in strict predefined order" (G20).
2. **When to use it.** Only on the 2.0 series, which has no storyboard recipe of its own. For 2.5, use G5.
3. **Required assets.** One panel sheet, plus character images.
4. **Preparing them.** Clean panels; character identity from separate images.
5. **Reference mapping.** The 2.0 guide uses patterns such as "refer to the composition in Image 3" and "character design refers to Image 1".
6. **Prompt syntax.** Name the sheet, say the compositions appear in order, and describe the action and dialogue; shot-numbered blocks, not timestamps (2.0).
7. **Settings.** 2.0 series: up to 9 images; no `omni_reference_task_type`.
8. **Limitations.** Not carried to 2.5 by any statement in the documentation.
9. **Failure patterns.** More than 4 to 5 reference people reduce stability (TS-04).
10. **Example.** The 2.0 guide shows a fight sequence and a Korean-language dialogue scene; none is reproduced here.
11. **Compatibility.** With subject references; not documented with keyframes.
12. **Status.** 2.0 series OFFICIAL. 2.5 UNVERIFIED. Flash UNVERIFIED.

Validation test: `PLANNED:P3` (no scenario yet; the sequence reference is 2.0-only).

## Checks before returning a storyboard-based Seedance prompt

- The generation's panels are the ones the approved mapping assigns to it; the sheet or keyframes show exactly those.
- Reference counts fit the profile of the user's model version (Flash: 10 images).
- The sheet is described as structure only, with the real style in words, and the prompt supplements what the sheet cannot show: actions, camera movement, style and continuity.
- No text on any sheet or keyframe; readable text is an overlay planned in the edit.
- The assets are numbered in upload order of first appearance, and each carries a role and an exclusion.
- Anything the documentation does not show (a sheet with keyframes, timestamps or keyframes on Flash) is labelled UNVERIFIED, with a fallback and an offer to test.

## Core generation and continuity operations

These are skill-authored operation templates, not tested generations. Consult the registry row, model profile and interface before using them. The 2.5 flagship facts below do not automatically apply to Flash.

| ID | Operation and binding | Prompt / control pattern | Limits and validation |
|---|---|---|---|
| G1 | Text-to-video, no visual reference | Describe subject, setting, ordered action, camera, look and chosen audio policy. | Set documented duration and output controls in the interface; Flash's minimum and specific modes remain UNVERIFIED. |
| G2 | First-frame image | Supply the image in the `first_frame` role; animate forward without changing the approved opening state. | On flagship, ratio is `adaptive`; this locked task cannot be mixed with omni references. Flash support is UNVERIFIED. |
| G3 | First and last images | Use `first_frame` and `last_frame`, then describe plausible movement between them. | Locked roles cannot be combined with omni references. The alternative uses reference images plus text, but is not exact; see DISC-04 and the profile. |
| G8 | Longer coherent generation | Design action and speech for the selected duration; split if the shot is overloaded. | Flagship documents 4-30 seconds or -1 in the applicable task. Flash states only a maximum of 30 seconds; shorter values and minimum are UNVERIFIED unless the interface confirms them. |
| G9 | Draft then final | Generate a draft for structural review, then use its draft task ID for the final step. | Flagship: draft at 480p, final at 1080p, separately billed, with restrictions on parameters resent; see profile. Flash support is UNVERIFIED. |
| G10 | Preserve the ending for a connected generation | If supported, request the final frame and use the returned image as the next generation's starting reference. | Flagship API supports `return_last_frame`; exact downstream continuity is not guaranteed. Flash support and surface controls are UNVERIFIED. |

### G12: on-screen text

The 2.0 guide documents text, slogan and subtitle templates. For a user-requested visible phrase, name its exact text, language, position and duration; otherwise do not add text. The 2.5 guide discusses text errors and troubleshooting but does not establish the 2.0 template as supported; 2.5 and Flash are UNVERIFIED for this specific template. For critical readable text, generate a clean surface and overlay the exact text in post. This is a skill-authored plan, not a tested generation.
