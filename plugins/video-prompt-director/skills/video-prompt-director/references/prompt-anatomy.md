# Prompt anatomy: what a production prompt for a series clip contains

Contents:
1. Why anatomy matters
2. The sections, in order
3. Compact and full forms
4. Rules for building each section
5. What stays out of the prompt

## 1. Why anatomy matters

A video model sees only the prompt. For a series, where the same people, rooms and props come back in dozens of clips, every clip must carry everything the model needs: who looks like what, where each person stands, what state the props are in, what happened just before, and what must not happen. This is the structure observed in a working short-drama pipeline across about 230 stored prompts. Use the sections that apply and skip the rest. Never add a section just because it exists.

## 2. The sections, in order

| # | Section | What it holds | Needed when |
|---|---|---|---|
| 1 | **References** | The list of attached images with the id each is called by (`@Alya`, `Image 1`) and what each controls | Any prompt with images |
| 2 | **Recorded dialogue rules** | That the dialogue audio is final, how the model must treat it (`references/constraints.md` section 14; OBSERVED, verify model support) | A dialogue recording is supplied |
| 3 | **Episode and segment context** | Episode title, the clip's position (clip 3 of 8), the episode's emotional line in one sentence | A series |
| 4 | **Segment task** | This clip's story job and emotion: the hook, the turn, the beat that must land | Always for a series |
| 5 | **Scene and light** | Place, time of day, the main light source and where it falls, reflections, which areas are dark, how light falls on faces | Always |
| 6 | **Appearance block** | For each person in this clip: age, skin tone, face shape and features, eyes and brows, hair, makeup, identity anchor, accessories, clothing item by item with shoes, plus a statement that face, hair and build follow the reference image | Every clip, restated each time |
| 7 | **Opening state** | The state the previous clip ended in: positions, props, door and furniture condition, who is present | Any clip that follows another |
| 8 | **Blocking** | Where each person stands and faces at the start, who is absent and who enters later, which side doors and windows are on | Any clip with more than one person or an entrance |
| 9 | **Cuts** | One block per cut with its camera line, who is in frame, eyeline and focus, camera position, action, performance, and any dialogue window | Always |
| 10 | **Ending state** | The finished state the next clip starts from: positions, props, expressions, door state | Any clip that is followed by another |
| 11 | **Ambient sound** | One short line, tied to what is on screen | If sound matters |
| 12 | **Constraints** | The numbered exclusions from `references/constraints.md` | Always |
| 13 | **Voice profile** | Per character: accent, pitch, age, pace, temperament, kept identical across clips | The model generates speech, or you want continuity with a recording |

## 3. Compact and full forms

- **Compact form** for a silent or simple clip: references, blocking, cuts, ambient sound, constraints. It runs about 700 characters in the observed Mandarin series.
- **Full form** for a dialogue clip with recorded audio: all sections. In one observed Indonesian series it ran about 1,500 characters; this is an example, not a target or limit. Check the model's documented prompt length (`references/models/`) before you add everything. If the prompt is too long, cut redundant description first (appearance details already fixed by the reference image), then secondary detail, never the dialogue, the camera, the opening and ending states, or the constraints.

## 4. Rules for building each section

**References.** One line: `Reference images: @Env_Kitchen @Mira @Prop_Letter`, then each one's role. Number the roles in the order of the attachments. References lock identity, costume and layout, not the camera angle or the moment.

**Segment task.** One sentence: the clip's job and the emotion. For example: "Opening hook: within two seconds the viewer sees the household hierarchy, then the first insult lands." This is what keeps the clip from drifting.

**Scene and light.** Name the main light, not a mood: "warm top light from the chandelier, teak tabletop with warm reflections, dark corners, black window." State how light falls on faces ("soft warm top light with natural shadows on the faces"); say whether you want flattering beauty light or natural shadows, because the project look decides. Keep the time of day consistent with the room (a night room does not mention sunlight).

**Appearance block.** Restate it every clip, word for word. It includes the identity anchor and anything the story changed ("wet hair stuck to her cheeks, a brown soup stain on her blouse"). For a story-relevant body state, state it ("flat stomach: she claims to be three months pregnant and it does not show"). Add "clean-shaven" or "no beard" when a face must not change. End with "face, hair and build follow the character reference image".

**Opening state and blocking.** Start from where the previous clip ended and advance only this clip; do not replay earlier action. Give blocking by fixed landmarks or compass directions ("south side of the table, facing north"), and say who is absent and who enters later. Include the condition of props and doors (a frosted glass front door, a white porcelain bowl with a blue rim, no chair at her place).

**Cuts.** Use the format in `references/camera-language.md` section 11. For each cut add:
- who is in frame, and that no one else is;
- eyeline target and focus target;
- the camera position in words ("camera at waist height on the south side of the table, looking across the tabletop; she is right foreground, chest up; he is background, slightly soft"). In a vertical frame arrange people front to back so the main subject is clear, and keep the foreground free of furniture that hides faces;
- the action, then the performance, tied to the story: what the person looks at and why ("her contempt shows by not looking at her; she looks at the soup");
- for a cut that matters, a held camera: "the spoon drops in; hold the frame, no push";
- for a spoken line, its window: speaker, start and end second, delivery in brackets, and the exact line.

**Dialogue window.** `Lip-sync (4.17 to 7.9 s) @Mother (sneering): "exact line"`, then a delivery note ("slow and unhurried, the word 'cucian' stretched as if tasting it") and a gesture note tied to specific words ("on 'Tante!' she rises on her toes and tilts her head toward the room").

**Ending state.** A finished action and a gaze, with the condition of props ("spoon lying in the bowl; her shirt is clean"). The next clip starts from this.

**Ambient sound.** One line. Name the ambience so pauses are not dead silent.

**Constraints.** Numbered, once each. See `references/constraints.md`.

**Voice profile.** For each speaking character: "pitch, accent, age, pace, temperament", for example "sharp, nasal mezzo; loud and fast, rising sneer at line ends; domineering and contemptuous". Reuse it word for word in every clip.

## 5. What stays out of the prompt

- Second ranges, if the model's file says timing is unreliable; write order instead (`references/models/`).
- Clip titles and numbering the pipeline adds itself.
- Style or grade names written per shot; state the project look once (`references/constraints.md` section 12).
- People, props, actions, dialogue or visible text the script does not contain.
- The model's own attachment syntax if the pipeline adds it by itself; follow the user's pipeline.

See `examples/production-prompt.md` for a full prompt built this way.
