# Camera language: movement, smoothness, lens, angle, composition

Contents:
1. Evidence behind this file
2. Quantify the camera, do not just name a shot size
3. Camera movement: one move, chosen for a reason
4. Smoothness and stability
5. Lens and depth of field
6. Angle and camera position
7. Composition
8. Eyeline and focus
9. Blocking: where everyone is
10. Coverage: which shot for which beat
11. Several cuts inside one clip
12. Camera mistakes to avoid

## 1. Evidence behind this file

The numbers below are observed in one working vertical short-drama pipeline: two series (one Indonesian, one Mandarin), generated with Seedance, about 228 clips and 516 cuts. They describe what that pipeline settled on, not a rule for every model or genre. Treat them as a strong default for glossy, TV-style vertical drama, and adjust for another genre or a model that behaves differently.

| What | Observed share |
|---|---|
| Camera movement | Locked-off 87%, slow push-in 7.5%, tracking or follow 3.7%, tilts, pans and pedestal under 2% together |
| Stability | Stable 96%, slight shake 4% (only on follow shots) |
| Composition | Rule of thirds 88%, center 10%, symmetrical, frame-in-frame and diagonal about 2% together |
| Shot size | Close-up 54%, medium 31%, extreme close-up 8%, wide 7% |

The pattern: most of the drama is carried by the actors and a still camera. Movement is saved for moments where the story moves.

## 2. Quantify the camera, do not just name a shot size

A model that gets only "close-up" guesses how close, which lens, and where the person sits in the frame. Observed in production: when this information is left out, the shot comes out too wide, the action too small, and the people placed at random. So state these for every cut:

- **Shot size:** close-up, medium, wide, and so on (`references/cinematography.md`).
- **Lens and depth of field** (section 5): how close and how blurred the background.
- **Camera position:** who the camera faces and from what angle (section 6).
- **Composition:** where the subject sits in the frame (section 7).
- **Camera movement and stability** (sections 3 and 4).
- **Eyeline and focus** (section 8).
- **Blocking** for the clip as a whole (section 9).

Keep adjectives for the story. Let these fields carry the framing.

## 3. Camera movement: one move, chosen for a reason

**One main camera move per cut.** Push then pan, or track while orbiting, is not done twice by the model; it picks one, and not always the one you wanted. Write the move as a plain action sentence with an amount and a speed: "the camera pushes in slowly and slightly toward her whitened knuckles".

Vocabulary that models and pipelines commonly accept: static or locked-off, push in, pull out, zoom in or out, pan left or right, truck left or right, tilt up or down, pedestal up or down, arc, tracking, handheld or slight shake, POV, roll. Check the target model's file for the terms it documents.

| Choose | When the story needs | Observed use |
|---|---|---|
| **Locked-off** | Dialogue, reactions, a held moment, anything the actors carry | The default; nearly nine shots in ten |
| **Slow push-in** | The viewer to lean in on a thought, a hesitation or a realization, usually while someone speaks, listens or holds still | Small and slow, on emotional beats such as reading a note, a silent reaction, a slow reply |
| **Tracking or follow** | A person in motion: walking, running out of a door, crossing a room, a chase | Always paired with slight shake, always on a wide or medium shot of the walking person |
| **Tilt, pan, pedestal** | Revealing something above, to the side or below, or following a prop | Rare; use only when the reveal is the point |
| **Pull out** | Isolation, an ending beat, revealing the surroundings | Rare |
| **Zoom, orbit, whip, dolly-zoom** | Effects that draw attention to the camera | Avoid in grounded drama unless the user asks |

Rules of thumb:
- A move needs a reason in the story. If no one moves and nothing is revealed, lock the camera.
- Do not move the camera and also ask for a complicated physical action in a short clip.
- A static camera does not mean static people (`references/cinematography.md` section 5).

## 4. Smoothness and stability

Stability is a separate setting from movement. A locked camera can still carry a slight shake, and a push-in can be smooth or handheld.

| Stability | Words | Use |
|---|---|---|
| Stable | "steady", "locked off", "smooth, stable" | Default. Dialogue, close-ups, any calm beat |
| Slight shake | "slight handheld sway", "a little natural shake" | Follow shots of a person walking or running, so the move feels like a real camera operator |
| Handheld | "handheld", "visible handheld movement" | Chaos, panic, a chase. Use rarely and say why |

Smoothness comes from these habits:
- State the stability for every cut, or the model chooses randomly.
- Keep moves slow and small: "slow", "slight", "gentle". A fast move increases instability, and multiple moves make it worse (a model vendor's guide advises one move per shot, see `references/models/seedance.md`).
- Do not ask for shake on a static dialogue shot. Shake on a follow shot is fine; shake everywhere reads as amateur footage.
- Describe the camera and the subject in separate sentences so the move is not blended with the action.

## 5. Lens and depth of field

The focal length decides how close the shot feels; depth of field decides how soft the background is. In the observed pipeline each shot size had one lens look, and it worked as a reusable pairing:

| Shot size | Lens | Depth of field | Typical use |
|---|---|---|---|
| Wide | 35 mm wide | Medium-deep | Establishing a space, people crossing it |
| Medium | 50 mm standard | Medium-shallow | Conversations, two people in a frame |
| Close-up | 85 mm telephoto | Shallow | Emotional lines, reactions |
| Extreme close-up | 100 mm macro | Very shallow | A hand, an object, an eye |

Write them as a pair ("85 mm telephoto look, shallow depth of field, soft background"). Do not request a lens the shot cannot use, and do not ask for a rack focus unless the shift is the story.

## 6. Angle and camera position

Say who the camera faces and from what angle. Examples: "the young woman, eye level, frontal"; "the two of them, eye level, profile"; "the older man, slightly high angle"; "over her shoulder, looking at the bedroom door".

- **Eye level** is the default: frontal for emotion, profile or three-quarter for conversation geometry.
- **High angle** for a character who is small, cornered or being judged; **low angle** for power. Use rarely and for a reason.
- **Over the shoulder** for dialogue that needs the relationship in frame; keep the foreground free of furniture that hides the faces.
- Keep the camera on one side of the line between two people unless the cut is deliberate (`references/continuity.md`).

## 7. Composition

One composition per cut.

| Composition | Use |
|---|---|
| Rule of thirds | Default: face or subject on a third, eyeline room in the direction they look |
| Centered | A confrontation, a direct address, an object that is the whole point |
| Symmetrical | Formal spaces: a wedding aisle, a boardroom |
| Leading lines | Corridors, roads, a table that points at someone |
| Frame within a frame | Doorways and windows that isolate a person |
| Diagonal | Tension, instability, used rarely |

## 8. Eyeline and focus

- **Eyeline target:** what the person looks at (the other person's face, the object in their hand, closed eyes). Where the eyes go is half the performance.
- **Focus target:** what is sharp. It is often different from the eyeline: she looks at him, but the focus is on the knife in her hand.
- Do not let anyone look into the lens unless the character addresses the camera on purpose; say "no one looks into the lens" when it matters.

## 9. Blocking: where everyone is

For each clip, state once at the start where people stand at the opening moment: who is on the left and right of frame, who faces which way, and how far apart they are (in steps or centimeters). Everything else follows from it. This is the space the shots grow out of, so write it once and keep it fixed across the cuts (`references/continuity.md`).

## 10. Coverage: which shot for which beat

TV-drama coverage the observed pipeline uses as a baseline:

- **Close-ups** for emotional lines and reactions.
- **Medium shots** for conversations.
- **Wide shots** to establish a space and where people are.
- **Over the shoulder** for dialogue that needs the relationship in frame.
- **Insert / extreme close-up** for an object or a hand that matters.
- **Shallow depth of field** where it helps; **realistic lens perspective**; **deliberate angles**.
- **No random moves, artificial zooms or effects.**
- Keep the 180-degree line, matched eyelines, and hard cuts without jump cuts.

For a short vertical drama, expect mostly close-ups and mediums, with a wide shot only to place the audience.

## 11. Several cuts inside one clip

When one generation holds two or three cuts (the observed pipeline did, up to six), give each cut its own header line and keep them in order:

```
Cut 1, 0.0-4.0 s | close-up, 85 mm telephoto, shallow depth of field | locked off | the young woman, eye level frontal | thirds | stable
In frame: the young woman. No one else.
Cut 2, 4.0-8.0 s | medium, 50 mm standard, medium-shallow | locked off | two people, eye level profile | thirds | stable
In frame: the young woman and the older man. No one else.
```

- Write the cut as a hard cut. Say "hard cut, no dissolve, no zoom between cuts".
- Give each cut one move, one composition, and one list of who is in frame.
- Use the time ranges to show order. Some models document timing as unstable; check the target model's file, and if so write the order in words and let the model set the pace.

## 12. Camera mistakes to avoid

- A shot size with no lens, angle or composition, so the model decides.
- Two or more moves in one cut.
- Shake or handheld everywhere.
- Zooms, orbits and whips in a grounded drama.
- A push-in on a shot where nothing is happening in the actor's face or body.
- A wide shot for a line the story depends on the viewer reading in the face.
- Naming the camera move and leaving out its amount and speed.
- Asking for a move that the clip is too short to complete.
