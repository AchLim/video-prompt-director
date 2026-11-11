# A full production prompt

One original series clip, built with `references/prompt-anatomy.md`. The story, characters and wording are invented for this example. The prompt is in English; for a model or pipeline that wants another language, write the same sections in that language and keep the dialogue as supplied.

**Situation.** A vertical drama about a couple whose marriage is a contract. Clip 2 of 6 in episode 3. The previous clip ended with the husband leaving the kitchen. The clip is 10 seconds, 9:16, with a recorded dialogue file for one line.

```
Reference images: @Env_Flat (the flat's open kitchen and living room), @Noor (wife), @Iwan (husband), @Prop_Envelope (cream envelope, blank on both sides).
Roles: each person image sets that person's face, build and costume; the flat image sets the room's layout and fixtures; the envelope image sets the object's design. None of them sets the camera angle or the moment.

Recorded dialogue: the attached audio is final and exactly as long as this clip. The voices in the finished video are this recording. The video model must not generate, change or imitate any voice; people only move their lips to the recording. If the picture and the recording disagree, change the picture, not the recording.

Episode 3, clip 2 of 6. Episode line: pride, then doubt, then a decision.
Clip task: the turn. Noor finds the envelope Iwan left behind and decides to open it; Iwan comes back at the worst moment.

Scene and light: the flat's kitchen, evening. A warm pendant lamp over the island is the main light; the counter has soft warm reflections; the living room behind is darker; the window shows a blue dusk. Soft warm light with natural shadows on the faces, no beauty lighting.

Appearance (same in every clip):
- @Noor: 31, warm light-olive skin, oval face, calm wide eyes, left brow slightly higher; dark brown shoulder-length hair tucked behind her left ear; no makeup; a thin silver ring on her right index finger; sage-green linen shirt with sleeves rolled once, charcoal trousers, flat white sneakers. Face, hair and build follow her reference image.
- @Iwan: 34, medium-tan skin, strong jaw, short black hair with a side parting, clean-shaven; a steel watch on his left wrist; navy shirt, grey trousers, brown leather shoes. Face, hair and build follow his reference image.

Opening state: continues from the previous clip. Iwan has just left through the front door on the right, closing it. Noor stands at the island, facing north, a cup of tea in her left hand. The cream envelope lies on the counter beside the fruit bowl, sealed.

Blocking: Noor at the south side of the island, facing north; the kitchen door to the hallway is on the right; the front door is out of frame to the right. No one else is present. Iwan enters later through the front door.

Cut 1, 0.0-4.0 s | medium, 50 mm standard look, medium-shallow depth of field | locked off | the young woman, eye level frontal | thirds | stable
In frame: Noor only. No one else.
Camera position: at counter height on the north side of the island, looking back across the worktop; Noor chest-up on the left third; the envelope soft in the foreground, not hiding her face.
Action: Noor sets the cup down, notices the envelope, and stops. She picks it up with her right hand and turns it over.
Performance: her gaze stays on the envelope. She presses her lips together once and takes a held breath. She does not look toward the door.
Eyeline: the envelope. Focus: her face.

Cut 2, 4.0-10.0 s | medium, 50 mm standard look, medium-shallow depth of field | locked off | two people, eye level profile | thirds | stable
In frame: Noor and Iwan. No one else.
Camera position: at the kitchen door on the right, looking along the island; Noor on the left, Iwan enters on the right edge and stops at the end of the island.
Action: the front door opens off-screen; Iwan steps in and stops at the sight of the envelope in her hand. Noor lifts her eyes to him without lowering the envelope.
Lip-sync (5.2 to 7.4 s) @Iwan (low, controlled): "That isn't yours to open."
Delivery: quiet, a beat of warning on "yours". Gesture: he glances at the envelope on "isn't", then at her on "yours".
Performance: Noor holds his look for a moment, then lowers her gaze to the envelope. Her jaw tightens. She does not speak.
Eyeline: each looks at the other, then Noor at the envelope. Focus: the envelope and her hand, then Noor's face.

Ending state: Noor stands with the sealed envelope in her right hand, looking down at it; Iwan stands at the end of the island looking at her; the cup of tea is on the counter; nobody has moved from these places. The door is closed behind him.

Ambient sound: low fridge hum, the click of the front door, one step on the tile.

Constraints: 1. People only move their lips to the recording; they make no sound of their own. 2. Face, hair and clothes follow the person reference images only; the room and props follow their own images. 3. No readable text on the envelope, phone screens, signs or clothing; no subtitles, logos or watermarks. 4. No background music. 5. No cuts other than the one stated; no zoom, push-in or dissolve. 6. No one else appears in frame. 7. No two people with matching faces, clothes or accessories.

Voices (same in every clip):
- @Iwan: warm baritone, 34, unhurried, clipped endings; controlled and guarded.
- @Noor: low alto, 31, quiet and even; she speaks little.
```

**What to notice**
- Every section answers a question the model would otherwise guess: who looks like what, where they stand, what happened before, what must not appear.
- The dialogue is exact, has a start and end second, a delivery note and a gesture tied to specific words.
- Both states are stated, so the neighboring clips can start and end in the same place.
- The prompt is about 4,900 characters. Check the model's documented limit (`references/models/`) and trim redundant detail first if it is over.
