# Storyboard images: sheets and keyframes from the approved plan

Image-generation prompts for the pictures that come out of an approved storyboard: a detailed production sheet for human review, a simple reference sheet for a video model, and independent keyframe images. The planning is in `references/storyboard.md`; this file only turns the approved plan into image prompts.

Contents:
1. Rules that hold for every image
2. The three outputs
3. Layout
4. Production storyboard sheet
5. Reference sheet for a video model
6. Independent keyframe images
7. Consistency check
8. Review and changes

## 1. Rules that hold for every image

- **One canonical plan.** Every sheet and keyframe comes from the same approved shot plan and mapping (`references/storyboard.md` sections 12 and 13). They must show exactly the same sequence. Do not plan twice.
- **Tool independent.** Write each image prompt as intent: layout, panel contents, style, exclusions. Do not rely on one image generator's syntax, parameters or weighting. The image generator is not assumed to be the video generator. Say plainly which settings the user should look for in their tool (aspect ratio, resolution, panel legibility) and let them map them.
- **No text inside the image.** No panel numbers, captions, labels, arrows, speech bubbles, dialogue or sound words in the picture. Panels are numbered by reading order (left to right, then top to bottom), and the annotations live in the conversation (`references/storyboard.md` section 14). The Seedance 2.5 prompt guide recommends keeping text off a storyboard sheet; the same holds for the production sheet so the two stay interchangeable.
- **Vertical by design.** For vertical drama each panel is composed for 9:16: subject placement, depth layering and clear foreground for the vertical frame, not a landscape picture cropped later.
- **Fictional characters.** Describe faces and clothes directly; never compare a character to a real person.
- **Clean and legible.** Few, clear shapes; no clutter, no heavy texture, no tiny details a panel cannot show.

## 2. The three outputs

| Output | For | When |
|---|---|---|
| **Production storyboard sheet** | Human review: detailed cinematic illustrations with consistent characters, clothing, environment and props | Always in Production and Cinematic modes; Quick mode only if the user asks |
| **Reference sheet for a video model** | Guiding one generation that holds several shots (mapping type M) | One sheet per multi-shot generation, cut from the same plan. Not needed for a single-shot generation |
| **Keyframe images** | Strict alignment: a contact moment, a key pose, a reveal, or a first or last frame (mapping type K) | Only for the panels the mapping marks K. Each is a separate image |

A video model treats a multi-panel sheet as a high-level reference for structure and rhythm, not as a frame-by-frame script. When the picture must match closely, use keyframes. Whether a model accepts sheets, keyframes or both, and how many images it takes, is in its profile (`references/models/`); the images count against its reference limits.

## 3. Layout

Treat layout as configurable and testable, not fixed.

- **Default:** a 3 by 3 grid for up to nine panels, each panel 9:16 for vertical projects (or the project's ratio).
- **Adapt to the count:** six panels as 3 by 2, four as 2 by 2, eight as 4 by 2, twelve as 4 by 3. Keep the order readable: left to right, then top to bottom.
- **More than nine panels:** prefer several readable sheets over squeezing everything into one image. A Cinematic scene of 12 to 15 panels may be two sheets.
- **Adapt to the tool:** if the image generator makes small panels illegible or merges neighbors, use fewer panels per sheet or a larger output size. Try the first sheet, look at it, and adjust. The sheet's overall aspect ratio, grid and size are not specified by any video model's guidance, so treat the first ones as experiments.
- **A sheet is not a clip:** a sequence longer than one sheet is split at natural breaks (a new location, a time jump, a shift of power), and each sheet starts with a continuity header.

**Continuity header** (written in the prompt for each sheet after the first, and kept in the conversation notes):

```
Continues from the previous sheet. Same characters, wardrobe and props as before. Same location and light. Screen directions unchanged: [who is on which side]. The previous sheet ended on: [ending state].
```

## 4. Production storyboard sheet

Detailed and consistent, to judge the sequence before any video is generated.

Template:

```
Purpose: a production storyboard sheet for a vertical short drama. Clean cinematic illustration, consistent across all panels.
Layout: [3 columns by 3 rows], nine panels in reading order, each panel 9:16, thin even gutters. No text, numbers, captions or arrows anywhere in the image.
Style: [project look, stated once: for example realistic, soft natural light, muted colour]. Same rendering style in every panel.

Characters (identical in every panel):
- [Name or label]: [age, build, face shape, hair, skin tone, one identity anchor on a named side, clothing item by item]
- [Name or label]: [...]
Setting: [room or place, main light and where it falls, the fixed landmarks: door, window, furniture sides]
Props: [only props that matter, with their state]

Panels:
1. [shot size, angle, composition]. [who stands where, who faces where]. [expression]. [action]. [props].
2. [...]
...
Keep every character's face, hair and clothes the same in all panels. Keep the room, the light direction and the screen sides the same. Compose every panel for a vertical frame with the subject clear and the foreground free.
Exclude: text, letters, numbers, labels, captions, watermarks, logos, panel borders with writing, extra people, changed clothing.
```

Fill the character block from the continuity ledger and the references (`references/continuity.md`), word for word in every sheet. Panel lines come from the panel specifications (`references/storyboard.md` section 3). Name the hand and the body part in contact panels.

## 5. Reference sheet for a video model

Simple, so the model reads the composition and the action and nothing else. One sheet per multi-shot generation, with the panels of that generation only.

- **Line art or stick figures,** monochrome, clean composition, clear action. No shading clutter, no heavy texture, no over-sharpened detail.
- **No text** anywhere (see section 1).
- **No identity.** Characters are simple figures; faces, clothes and looks come from separate reference assets. Do not try to make the sheet carry identity.
- **Panel count:** the shots of that generation. The upper end Seedance's guide recommends is 15 panels, with a soft target of 12; these are recommendations, not API limits. In practice one generation holds far fewer.
- **Order:** the same reading order as the approved mapping.

Template:

```
Purpose: a simple storyboard reference sheet of [2 or 3] panels in reading order. Black line art on white, stick-figure or simple outline figures, no shading, no text, numbers, captions or arrows.
Layout: [3 columns by 1 row], each panel 9:16, thin gutters.
Panels:
1. [shot size and angle]; [figures and where they stand, which way they face]; [the action as simple poses]; [camera framing in a few words].
2. [...]
Show composition, positions, shot size and action only. Do not add detail, colour, faces or clothing.
```

Because a video model may copy the sheet's look, the video prompt must say that the sheet supplies structure and rhythm only, and describe the real style in words. Seedance's own nine-panel example excludes storyboard frames and line-art looks from the output. The video prompt also supplements the sheet with written instructions for the actions, the camera movement, the style and the continuity that the sheet does not show (`references/models/seedance/recipes-generation.md`).

## 6. Independent keyframe images

One image per keyframe panel, for strict alignment. Each is a single full-frame picture, not a sheet.

Template:

```
Purpose: one keyframe image, 9:16, for a vertical short drama. [Realistic style, stated once.] No text, numbers, captions, watermark or logo.
Frame: [shot size, angle, composition]; [who stands where, which way they face]; [expression]; [the exact pose or contact, naming the hand or body part]; [props and their state].
Characters: [the same identity blocks as the sheets, word for word], matching the character references.
Setting and light: [the same setting block].
Keep this image consistent with the neighboring panels: same faces, hair, clothes, room, light and screen sides.
```

Use a keyframe when the frame must match closely: the contact in a grab, a key pose, a reveal, or a first or last frame. Keyframes are images, so they count against a model's reference limits. Whether one request can combine keyframes with other references is model-specific; check the profile and mark an undocumented combination UNVERIFIED.

## 7. Consistency check

Before showing any sheet or keyframe:
- The panel count and order match the approved plan and mapping.
- Each character's face, hair, clothing and identity anchor are the same in every panel.
- Room layout, light direction and screen sides are the same, and a person who exits one panel enters the next from the right side (`references/continuity.md` section 4).
- Every panel reads in a vertical frame, and the shot sizes are clearly different where the plan says they differ.
- No text, numbers or labels appear in the images.
- The reference sheet has no identity detail, and the production sheet has no cartoon or sketch look unless the project look says so.

## 8. Review and changes

Show the sheet or sheets with the panel annotations in the conversation. The user reviews panel by panel. A change to one panel is made on that panel's image (or its keyframe) and does not regenerate the whole sheet. A change that alters the sequence, the order or the mapping goes back through approval (`references/storyboard.md` section 6), and the neighboring panels' carries in and out are updated.
