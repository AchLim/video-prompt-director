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
12. Movement across an episode: where it belongs
13. Smooth moves
14. Smooth cuts and joins between clips
15. Camera mistakes to avoid
16. Describing the camera position in words

## 1. Evidence behind this file

The numbers below are observed in one working vertical short-drama pipeline: two series (one Indonesian, one Mandarin), generated with Seedance, about 228 clips and 516 cuts. They describe what that pipeline settled on, not a rule for every model or genre. Treat them as a strong default for glossy, TV-style vertical drama, and adjust for another genre or a model that behaves differently.

| What | Observed share |
|---|---|
| Camera movement | Locked-off 87%, slow push-in 7.5%, tracking or follow 3.7%, tilts, pans and pedestal under 2% together |
| Stability | Stable 96%, slight shake 4% (only on follow shots) |
| Composition | Rule of thirds 88%, center 10%, symmetrical, frame-in-frame and diagonal about 2% together |
| Shot size | Close-up 54%, medium 31%, extreme close-up 8%, wide 7% |

The pattern: most of the drama is carried by the actors and a still camera. Movement is saved for moments where the story moves.

A caution from the same pipeline: one episode came out with every clip locked off and a hard cut every 3 to 4 seconds, and it felt stiff and disconnected. Read the numbers as a ceiling on movement for held dialogue, not as a reason to lock every shot. Sections 11 to 14 say where motion and smooth joins belong.

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
| **Locked-off** | Held dialogue, reactions, a held moment, anything the actors carry | The default for those beats; not for the hook, the turn or the ending (section 12) |
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
- Keep moves slow and small: "slow", "slight", "gentle". A fast move increases instability, and multiple moves make it worse (a legacy Seedance 2.0 guide advises one move per shot; see `references/models/seedance/profile-legacy-2-0.md`).
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
- **From behind or rear three-quarter** for following someone into a space, or a reveal over their back.
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

Shot purposes and the building blocks of dialogue coverage are defined in `references/cinematography.md` sections 10 and 11. This section keeps the baseline the observed vertical-drama pipeline used:

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

## 12. Movement across an episode: where it belongs

Plan the camera for the episode, not clip by clip. A still camera that never moves tells the viewer nothing has changed.

| Beat | Camera |
|---|---|
| Hook shot | A small motivated move that starts on the problem: a slow push toward the evidence, a slow drift to reveal what is wrong. The viewer should feel the picture begin, not sit |
| Held dialogue and reactions | Locked off, stable |
| The turn (the new fact, the arrival, the shift in power) | A slow push-in or a pull-back that matches the change; or a cut to a tighter size on the person who understands first |
| A person crossing a room or leaving | Follow with a slow track, one move, the subject's pace |
| Ending shot | A slow push toward the face or the object, or a pull-out that isolates the lead, then hold on the inhale |

Rules:
- Two adjacent clips do not both end and begin on the same move direction unless the move continues (a push that ends on a held close-up then a locked close-up reads smoothly).
- No more than one clip in three has a visible move; the move must still have a story reason.
- State the speed and amount ("a slow push of about a half step over four seconds"), not just the name.

## 13. Smooth moves

- Start and end a move on a held frame: "hold for half a second, then push in slowly, ease to a stop".
- One move per cut, at one speed, in one direction. Do not combine push, pan and tilt.
- Keep the subject steady in frame during the move: the push must not slide the face off its third.
- Pair a move with stable footing: "smooth, stable, no shake" unless the shot is a follow shot (section 4).
- Describe the camera and the subject in separate sentences so the model does not blend them.
- Ask for a move only if the clip has time to complete it; a 3 s cut holds a slight push, not a reveal.

## 14. Smooth cuts and joins between clips

Roughness comes from what changes at the cut. Change one thing at a time.

**Within a clip**
- **Step the size gradually.** Wide to medium to close-up, or close back out. Do not jump from a medium straight to a macro insert and back to a medium, and do not cut between two shots of nearly the same size and angle (it reads as a jump).
- **Keep the lens family stable.** Avoid 50, 100, 50, 85 across four cuts. Choose two lens looks for a scene and alternate them (section 5).
- **Cut on action or eyeline.** Cut as a hand starts to move, as a head turns, as someone looks off-frame; the next shot shows what they look at or finishes the movement.
- **Match the screen side and the eyeline.** The person who looked right is answered by a shot facing left (`references/continuity.md` section 11).
- **Keep the light and background logic the same** across cuts of one scene.
- **Every cut has a reason** (reaction, reveal, new information, change of power). Two cuts that show the same thing at slightly different sizes get merged into one.

**Between clips and scenes** (see also `references/continuity.md` section 12)
- Start clip N+1 from the exact last frame state of clip N: position, posture, hands, props, light and lens.
- In image-to-video, use the last frame of clip N as the first frame of clip N+1, or a still that matches it.
- Carry a sound across the join: the rain, the room tone, the last word or a door thud runs into the next clip.
- Carry a movement across the join: if she is turning at the end of N, she is mid-turn at the start of N+1.
- A scene change needs a bridge: a shared object, a matching shape, a sound that continues, or one wide establishing beat of about 1.5 to 2 s (`references/pacing.md` section 3).
- Do not fix a rough join with a dissolve or a zoom. Fix the frames, the sound or the motion that connects them.

## 15. Camera mistakes to avoid

- A shot size with no lens, angle or composition, so the model decides.
- Two or more moves in one cut.
- Shake or handheld everywhere.
- Zooms, orbits and whips in a grounded drama.
- A push-in on a shot where nothing is happening in the actor's face or body.
- A wide shot for a line the story depends on the viewer reading in the face.
- Naming the camera move and leaving out its amount and speed.
- Asking for a move that the clip is too short to complete.

## 16. Describing the camera position in words

Beyond the header fields, add a short sentence on where the camera is:

- **Height and side:** "at waist height on the south side of the table, looking across the tabletop".
- **Depth layering in a vertical frame:** put people front to back so the main subject is clear: one in the right foreground chest-up, one in the left middle ground, one in the background slightly soft.
- **Keep the foreground free:** no furniture, plant or prop that hides the faces.
- **Camera at a person's position:** "the camera is at her place; she is not in frame, and the other person walks toward the lens".
- **Hold the frame during the key event:** "the spoon drops in; hold, no push, no reframing".
- **Follow once, do not speed up:** "follow her across the room, once, at her pace".
- **Say a hard cut is a hard cut:** "hard cut to her frontal medium, at eye level slightly to the right, background a soft chandelier glow".
- **Silence as a beat:** "lock the camera and give her one second before she speaks".
