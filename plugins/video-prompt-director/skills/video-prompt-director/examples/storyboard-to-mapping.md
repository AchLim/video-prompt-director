# A storyboard planned and mapped

One original scene, taken from the script to the panel specifications, the panel-to-generation mapping, a production sheet prompt, a reference sheet prompt and a keyframe prompt. The story, characters and wording are invented for this example. It follows `references/storyboard.md` and `references/storyboard-images.md`.

**The scene.** A vertical drama, 9:16. Night, a narrow apartment hallway. LINA, 30s, has packed a bag and is leaving. MARCO, 30s, her husband, blocks the front door. Marco says: "You do not get to leave like this." Lina says nothing, then he reaches for her wrist and grips it. She twists free, her keys fall. She says: "Watch me." She leaves. A phone on the console table lights up with a message.

## Mode and count

The scene has a dialogue exchange with a pause, a contact moment whose steps matter, a reaction, a reveal at the end and two people in a tight space. That is Production mode, detailed: **9 panels**. A Quick scene would have been three or four panels (arrive, confront, leave); here the grab is decomposed because who moved first, who noticed and what the grip did is the scene.

## Panel specifications

Each block lists the fields from `references/storyboard.md` section 3 in short form.

```
Panel 01 | 4 s | HALLWAY, NIGHT   Establishing two-shot
Shot: wide, eye level, from inside the hallway, locked off. Composition: door at the end of the frame, both people on the thirds, foreground clear.
Positions: Lina at the front door, bag on her right shoulder, facing the door. Marco two steps behind her, between her and the room, facing her back.
Expression: Lina's back tense; Marco's face set. Action: Lina reaches for the door handle, stops. Props: bag, keys in her left hand.
Purpose: who is where, and who holds the room. Carries in: none (opens the scene). Ends on: Lina's hand on the handle, Marco not moving.

Panel 02 | speaker line   Over-the-shoulder on Lina, Marco speaking
Shot: medium close-up over Lina's left shoulder, eye level, locked off. Positions: Marco close to camera-right of Lina, facing her.
Expression: jaw tight, eyes steady. Action: he speaks. Dialogue: MARCO (low, controlled): "You do not get to leave like this."
Purpose: the line that sets the stakes. Carries in: Lina at the door. Ends on: Marco's last word, mouth closing.

Panel 03 | reaction   Close-up on Lina, listener
Shot: close-up, eye level, locked off. Expression: her jaw sets; she does not answer; one slow breath. Pause: about one second.
Purpose: she is choosing not to answer. Ends on: her eyes holding on him.

Panel 04 | contact step 1   Insert: the approaching hand
Shot: close-up of Marco's right hand and Lina's left wrist, eye level. Action: his hand rises from his side and moves toward her wrist, slowly.
Purpose: show who moves first. Ends on: his fingers a few centimetres from her wrist.

Panel 05 | contact step 2   Close-up: she notices
Shot: close-up on Lina's eyes, then the look drops. Expression: her breath stops. Purpose: she sees it coming. Ends on: her eyes on the hand.

Panel 06 | contact step 3   Insert: the grab
Shot: close-up on the contact. Action: Marco's fingers close around Lina's left wrist. Her arm tenses.
Purpose: the contact itself. Ends on: the grip held, her arm rigid.

Panel 07 | reaction and pull away   Medium two-shot
Shot: medium, eye level, locked off, both in frame. Action: Lina twists her arm and pulls her wrist free; the keys in her left hand fall; Marco's hand opens and drops.
Purpose: the body's answer and the release. Ends on: the keys on the floor, the two of them apart, both still.

Panel 08 | line   Close-up on Lina
Shot: close-up, eye level, a slight push-in on the line. Dialogue: LINA (quiet, steady): "Watch me." Expression: her eyes hold his.
Purpose: she takes control of the scene. Ends on: her eyes still on him, mouth closing.

Panel 09 | reveal   Insert: the phone
Shot: close-up of a phone on the console table, locked off. Action: the dark screen lights up with a notification. Its text is added in the edit.
Purpose: a new fact; who is "downstairs" is the question the episode leaves. Ends on: the lit screen, held.
```

## Panel to generation mapping

```
| Panel | Type | Generation | Shot in it | Duration | Input | Notes |
|---|---|---|---|---|---|---|
| 01 | P | G1 | 1 of 1 | 4 s | Lina and Marco references, hallway | establishing; ends with both still |
| 02 | M | G2 | 1 of 2 | 7 s total | storyboard sheet (2 panels), references | Marco's line; starts from G1's end |
| 03 | M | G2 | 2 of 2 | (in G2) | (in G2) | listener reaction and one pause |
| 04 | K | G3 | keyframe 1 of 3 | 6 s total | keyframe image | contact step 1 |
| 05 | K | G3 | keyframe 2 of 3 | (in G3) | keyframe image | she notices |
| 06 | K | G3 | keyframe 3 of 3 | (in G3) | keyframe image | the grab; strict alignment |
| 07 | P | G4 | 1 of 1 | 4 s | references | twist, keys fall, release |
| 08 | P | G5 | 1 of 1 | 4 s | Lina reference | her line; separate for exact delivery |
| 09 | P + X | G6 | 1 of 1 | 3 s | phone reference | blank screen generated; message overlaid in the edit |
```

Why this mapping:
- Dialogue and reactions that need control are separate generations (G1, G4, G5), except the line and the reaction that follow each other in one position (G2), where two shots in one generation help coherence.
- The three contact steps are keyframes (G3) because the grab geometry must match the plan, and a sheet does not guarantee that.
- Panel 09's text is an overlay in the edit (`references/episode-beats.md` section 6); the generated shot supplies a blank screen and a held frame.

Checks before approval:
- **Durations:** G2 holds two shots in 7 s (the line takes about 3 s: 8 words at 2.5 words per second, plus a breath; the reaction holds about 1 s). Nothing is squeezed. Panel 08's two-word line fits 4 s with room for the look.
- **Dialogue fit:** both lines fit their clips with a reaction pause (`references/pacing.md` section 2).
- **References per generation:** G2 uses a sheet and three references (4 images). G3 uses 3 keyframe images and no other references. Both fit a model limited to 10 images; the user's profile is checked (`references/models/seedance.md`).
- **Joins:** G1 ends with both still; G2 starts from that state. G3 starts from the end of G2's last frame; G4 starts from the grip held at the end of G3.
- **Sheets:** the reference sheet covers G2's two panels only, not the scene.

## Production storyboard sheet prompt (panels 01 to 09, 3 by 3)

```
Purpose: a production storyboard sheet for a vertical short drama. Clean cinematic illustration, consistent across all panels.
Layout: 3 columns by 3 rows, nine panels in reading order, each panel 9:16, thin even gutters. No text, numbers, captions or arrows anywhere in the image.
Style: realistic, soft practical hallway light, muted colour. The same rendering style in every panel.

Characters (identical in every panel):
- Lina: woman in her thirties, slim, oval face, dark brown shoulder-length hair tucked behind her left ear, a thin silver ring on her right index finger, a sage-green coat over dark trousers, flat white sneakers.
- Marco: man in his thirties, broad shoulders, strong jaw, short black hair with a side parting, clean-shaven, a steel watch on his left wrist, a navy sweater, grey trousers.
Setting: a narrow apartment hallway at night, a warm ceiling lamp as the main light, a front door at the far end, a console table on the left wall.
Props: Lina's packed bag on her right shoulder, a ring of keys in her hand, a phone on the console table.

Panels:
1. Wide, eye level, from inside the hallway. Lina at the front door facing it, Marco two steps behind her facing her back. Lina's hand reaches for the handle. Both on the thirds, foreground clear.
2. Medium close-up over Lina's left shoulder, eye level. Marco close, facing her, jaw tight, speaking.
3. Close-up on Lina, eye level. Her jaw is set, her eyes hold on him.
4. Close-up of Marco's right hand moving toward Lina's left wrist, a few centimetres away.
5. Close-up on Lina's eyes dropping to the hand.
6. Close-up on the contact: Marco's fingers closed around Lina's left wrist, her arm rigid.
7. Medium two-shot. Lina twisting her wrist free, keys falling, Marco's hand opening.
8. Close-up on Lina, eyes on him, quiet and steady.
9. Close-up of a phone on the console table, the screen lit with a blank notification.
Keep every character's face, hair and clothes the same in all panels. Keep the hallway, the light direction and the screen sides the same. Compose every panel for a vertical frame with the subject clear.
Exclude: text, letters, numbers, labels, captions, watermarks, logos, extra people, changed clothing.
```

## Reference sheet prompt for generation G2 (panels 02 and 03)

```
Purpose: a simple storyboard reference sheet of two panels in reading order. Black line art on white, simple outline figures, no shading, no text, numbers, captions or arrows.
Layout: 2 columns by 1 row, each panel 9:16, thin gutters.
Panels:
1. Medium close-up over the left shoulder of a figure seen from behind; a second figure faces it, close, mouth open; eye level.
2. Close-up on one figure's face from the front, eyes level, mouth closed.
Show composition, positions, shot size and action only. Do not add detail, colour, faces or clothing.
```

The video prompt for G2 then says the sheet supplies structure and rhythm only, and describes the real style in words (`references/models/seedance/recipes-generation.md`, card G6).

## Keyframe prompt for panel 06

```
Purpose: one keyframe image, 9:16, for a vertical short drama. Realistic, soft practical hallway light, muted colour. No text, numbers, captions, watermark or logo.
Frame: close-up on the contact, eye level. Marco's right fingers are closed around Lina's left wrist; her forearm is tense; his steel watch is on his left wrist, out of focus behind. Lina's sage-green coat sleeve is visible at the edge of the frame, and the keys slip in her left hand.
Characters: Lina and Marco as in the production sheet, matching their character references.
Setting and light: the narrow hallway, warm ceiling lamp.
Keep this image consistent with panels 04 and 05: same faces, hair, clothes, hallway, light and screen sides.
```

**What to notice**
- The count came from the beats, not the other way round, and the grab is decomposed because its steps are the scene.
- Four mapping types appear: P (G1, G4, G5, G6), M (G2), K (G3) and X (the message overlay).
- The reference sheet is tiny (two panels) and has no identity; the production sheet carries identity and consistency.
- Nothing in any image carries text. The panel numbers and notes above live in the conversation.
