# Weak vs strong video prompts

Six moments, each written weak and strong. All material is original. The strong versions are model-neutral; apply the target model's syntax and limits from `references/models/` before use.

Contents:
1. Natural human movement
2. Emotional acting
3. A dialogue scene
4. A multi-character interaction
5. Ruling out what the model adds
6. Camera: sized, moved and steadied

## 1. Natural human movement

**Weak**

> A woman walks into a room and picks up a cup. Cinematic, 4k, realistic, detailed.

**Strong** (5 s, locked-off medium wide shot, eye level)

> Medium wide shot, eye level, locked-off camera, soft window light from the left. A woman in a grey knit cardigan stands in the doorway of a small kitchen. She steps in at an unhurried pace, her weight shifting to her left foot as she stops at the counter. Her right hand reaches toward a white ceramic cup, wraps around the handle, and lifts it a few centimeters. Her eyes drop to the cup, then lift toward the window. Natural breathing, small shoulder movement. She ends standing at the counter, cup held at waist height, looking out of the window.

**Why it works**
- The camera is stated once and stays still, while the woman moves. Camera and subject are separate.
- One main action (walk, stop, pick up) with a clear start and end.
- The hand choreography is ordered and simple.
- Small movement (weight, breath, eyes) keeps her from looking frozen without inventing gestures.
- The ending state is stated for the next shot.

## 2. Emotional acting

**Weak**

> A man looks heartbroken and sad as he reads a letter.

**Strong** (6 s, medium close-up, slow push-in)

> Medium close-up, eye level, a very slow push-in. A man in a navy shirt sits at a wooden table, holding an opened letter in both hands. His eyes move along the lines, slowing near the end. His brows lift slightly, then draw together. He closes his eyes for a moment and exhales through his nose. His shoulders drop an inch. When he opens his eyes, he keeps his gaze on the page and presses his lips together, holding his composure. The letter stays in his hands.

**Why it works**
- Emotion is shown as brows, eyes, breath and shoulders, not named.
- The emotion changes over the clip: reading, reaction, effort to hold it together.
- The camera movement serves the moment and is the only one.
- The ending beat is restraint, which is believable.

## 3. A dialogue scene

**Weak**

> Two people talk in a car. She says she knows his secret and he looks surprised. Emotional, cinematic.

**Strong** (8 s, two-shot, locked off; dialogue supplied by the user and kept exact)

> Two-shot from the back seat, camera locked, eye level between the front seats, evening light through the windshield. The woman in the green wool coat, in the passenger seat, keeps her eyes on the road ahead. The man in the grey jacket, in the driver's seat, has both hands on the steering wheel. The woman speaks in a low, controlled voice: "You knew about the letter." Her lips move naturally with the line. She turns her head toward the man on the last word. He says nothing. His eyes flick to her, then back to the road. His jaw tightens and his grip on the wheel shifts. He does not speak.

**Why it works**
- The line is exact, attributed, in quotation marks, and its delivery is described.
- The listener reacts physically while staying silent.
- Only the speaker's mouth moves.
- Each person has a stable visual description for reuse in the next shot. Names are kept for dialogue, not for the prompt body.
- A model that takes spoken lines in a special notation (for example braces in Seedance) needs that notation; see its model file.

## 4. A multi-character interaction
5. Ruling out what the model adds
6. Camera: sized, moved and steadied

**Weak**

> They argue in the hallway and she leaves while he watches her.

**Strong** (7 s, medium wide shot, locked off)

> Medium wide shot, locked-off camera, a narrow apartment hallway lit by a single warm ceiling lamp. The woman in the ivory dress stands near the front door, holding a folded letter against her chest. The man in the charcoal suit stands two meters away by the kitchen doorway. The woman takes one step backward and reaches behind her for the door handle. The man lifts a hand halfway toward her, then lowers it without speaking. She opens the door, glances back once, and steps out. The man stays where he is, watching the open door, his jaw set.

**Why it works**
- Every person is named by a stable description, and every action is assigned.
- Positions are fixed (door, doorway, distance), which helps continuity.
- The two characters do different things: she acts, he restrains.
- The ending state is stated: she is gone, he is still looking at the door.
- Only simple contact (a hand on a handle); no complicated physical interaction between bodies.

## 5. Ruling out what the model adds
6. Camera: sized, moved and steadied

**Weak** (a group scene with the defaults left open)

> Hundreds of athletes prepare dragon boats on a sunny dock, wearing red life jackets. Cinematic, lively.

**Strong** (6 s, wide shot, locked off)

> Wide shot, eye level, locked-off camera, midday sun, a wooden dock lined with dragon boats. About thirty athletes prepare for a race: some carry plain wooden paddles to the boats, some adjust their life jackets, a few talk in pairs. Every athlete has a distinct face, build and age; no two people look alike. All wear plain solid-red life jackets with no letters, numbers, logos or patterns on the front or back. Nobody stands frozen: movement is small and natural, and none of it pulls attention from the center of the dock. One continuous shot with no cuts. No readable text anywhere in the frame, no subtitles, no logos or watermarks, and no music.

**Why it works**
- The defaults are named for the surfaces in the shot: life jackets, signs, the frame as a whole.
- A crowd gets "distinct faces" and "no two people look alike", which counters cloned faces.
- The wardrobe is plain by statement, not by omission.
- Background movement is allowed but kept small, so the crowd is neither frozen nor distracting.

## 6. Camera: sized, moved and steadied

**Weak**

> Cinematic shot of a woman running out of a bakery, dynamic camera, handheld, zooms in and whips around her as she answers her phone.

**Strong** (6 s, follow shot)

> Wide shot, 35 mm look, medium-deep depth of field, tracking shot following a young woman in a flour-dusted apron as she hurries out of a warmly lit bakery onto the street, pressing a phone to her ear and heading toward the camera. The camera follows at her pace with a slight natural handheld sway, one move only: no zoom, no whip, no orbit. Eye level, frontal, subject on the left third, space ahead of her to the right. Her gaze goes to the road ahead; the focus holds on her whole figure. In frame: the young woman only; no one else.

**Why it works**
- Size, lens, depth of field, angle, composition, eyeline and focus are all stated, so the model does not guess.
- One camera move, slow and motivated by a person moving; the slight shake suits a follow shot and is stated.
- The effects in the weak version (zoom, whip, orbit) are named and excluded.

A close-up conversation shot, by contrast, would be locked off and stable with an 85 mm shallow look. Match the camera to the moment.

## 7. Hook panel and the join to the next clip

**Weak** (clip 1 of an episode)

> Wide shot of a luxurious dining room at night. A man is humiliated by an older man in front of the family. Static camera. Cinematic lighting.

**Strong** (clip 1, 8 s, hook)

> Close-up, 85 mm telephoto look, shallow depth of field, on a driver's cap and car key lying beside a place setting where a man in a plain dark chauffeur jacket sits with his hands flat on the table; the other guests are dressed for dinner. The camera pushes in slowly and slightly toward his hands over 4 seconds, smooth and stable. An older man in a suit stands beside him and begins to tip a glass of red wine over his head; the wine runs through his hair, and the seated man does not move or look up. On the far side of the table a woman in a navy dress looks at the tablecloth, not at him, and turns a wedding ring on her finger. In frame: the seated man, the older man, the woman; no one else. Ends on the wine dripping from his jaw onto the car key.

**Why it works**
- Frame one holds a person and something wrong, with the cap, key, jacket and ring answering who, what relation and who holds power without a word.
- The camera starts to move on the first beat, so the hook feels alive, and it eases on one move.
- The ending state (wine on the key) is a concrete frame the next clip can start from. The next prompt opens on a close-up of the same key, same light, wine still dripping, and carries the rain on the window and the clink of the glass across the join.

## Using these examples

When repairing a prompt, name what is missing (no action, no ending, an unassigned pronoun, two camera moves, a label instead of behavior) and show the corrected prompt. Do not copy example wording into a new project.
