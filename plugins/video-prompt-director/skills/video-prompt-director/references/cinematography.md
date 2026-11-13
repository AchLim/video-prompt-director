# Cinematography: composition, camera, and shot structure

**Where this file stops.** This file is about shot design: what a shot is, which shot size and which shot for which beat (coverage), how dialogue is covered, how many events fit a clip, and the look. `references/camera-language.md` is about camera mechanics: lens and depth of field, angle and camera position, composition, camera movement and its stability, eyeline and focus, blocking, several cuts inside one clip, and smooth joins between clips. A rule lives in one of the two files; the other points to it.

Contents:
1. A shot is a sequence of events
2. Shot size
3. Angle, height, position
4. Camera movement
5. Camera and subject move independently
6. Focus and depth of field
7. Timed beats
8. Duration and load
9. Look and style
10. Shot purposes and coverage
11. Dialogue coverage

## 1. A shot is a sequence of events

A shot is not an image with a moving character. It is what the audience sees first, what the character does, what changes, how they react, and where it ends.

Weak: "A woman stands in a living room looking sad."

Stronger: "Medium shot, eye level. A woman stands beside the living-room window, looking outside. She lowers her gaze and takes a restrained breath. Her right hand tightens around the curtain. She turns her head toward footsteps behind her, and her expression shifts from sadness to quiet apprehension."

The second version gives a model a performance to animate.

Every shot states:
- **Beginning:** position, expression, activity, relationship between people.
- **Development:** the main action, one secondary movement or reaction, object interaction, dialogue if any.
- **Ending:** final position, expression and action, and the visual state the next shot starts from.

## 2. Shot size

Pick the size for what the viewer needs to see at that moment.

| Size | Use it for |
|---|---|
| Extreme wide | Place, scale, isolation |
| Wide | Geography and who is where |
| Full | Whole-body action, walking, posture |
| Medium wide | A person with surroundings, a small group |
| Medium | Conversation, gesture and face together |
| Medium close-up | Emotion with some body language |
| Close-up | A face carrying the scene |
| Extreme close-up | One detail: eyes, a hand on an object |
| Over-the-shoulder | Conversation with spatial relationship |
| Two-shot | Two people in the same frame, relationship |
| POV | What a character sees |

Do not use a close-up for action that needs the whole body to read. Do not use a wide shot for an expression the story depends on.

## 3. Angle, height, position

Angle, height and camera position are camera mechanics: see `references/camera-language.md` section 6. For shot design: state them only when they matter to the shot, and keep the stated choices consistent with the previous shot (`references/continuity.md`).

## 4. Camera movement

Use the least movement that serves the shot, and one camera move per continuous shot. Which move for which beat, its speed, amount and stability, and where movement belongs across an episode are in `references/camera-language.md` sections 3, 4, 12 and 13. Avoid movement that does not come from the story.

## 5. Camera and subject move independently

Camera movement and subject movement are separate instructions. A camera can stay locked while a woman walks from the doorway to a table. A camera can push in slowly while a man stays seated and speaks, with small facial and hand movement. Both are valid. A static camera never means a static person.

Write the camera instruction once and the subject's action in its own sentences, so the model does not blend them.

## 6. Focus and depth of field

Say what is sharp and what is soft: "shallow depth of field, the speaker in focus, the doorway blurred." Lens pairings and the eyeline and focus targets are in `references/camera-language.md` sections 5 and 8. Mention a rack focus only when the story calls for a shift of attention.

## 7. Timed beats

For clips of about five seconds or more, divide the action into approximate time ranges.

```
0.0-1.5 s  The man stands near the doorway looking at the woman, neutral, one small breath.
1.5-3.0 s  He takes one measured step forward and begins to speak.
3.0-4.5 s  His brows tighten; he glances down, then back at her.
4.5-6.0 s  He stops moving, holds her gaze, and waits.
```

These show progression, not cuts. Keep one continuous shot unless the storyboard says otherwise. Whether a model honors time ranges varies; check its file in `references/models/`, and if it does not document timing, write the progression in sentences with ordering words ("then", "after a pause").

## 8. Duration and load

Match action to the clip.

- Around 4 seconds: one main action and at most one reaction.
- Around 8 seconds: a developed move with a reaction and an ending beat.
- Around 10 seconds or more: a fuller performance, still one continuous idea.

If the action does not fit, split the panel instead of compressing the action. Do not fill time with movement just because there is time.

## 9. Look and style

Describe the look the project needs, once and consistently: realistic live-action, lighting direction and quality, color treatment, lens feel, production design. If the user gave no art direction, default to photorealistic live-action with natural skin and fabric texture, plausible shadows and controlled highlights. Apply a stylized aesthetic (for example polished short-drama beauty styling) only when the user asks or the project clearly uses it, and never when it contradicts the reference images.

## 10. Shot purposes and coverage

Cover a scene by purpose. Every shot should serve a purpose that no other shot in the scene already serves; a scene does not need every available angle.

| Purpose | What it shows | Use it when | Usual size |
|---|---|---|---|
| Establishing | The place and who is where | A new location, a time jump, or positions that matter later | Wide or medium wide |
| Two-shot or master | The relationship between two people in one frame | The power or distance between them is the point | Two-shot, medium wide |
| Action | The physical event | The body's movement carries the story | Full or medium |
| Insert or cutaway | An object or a detail | Evidence, a hand on an object, a contact moment | Close-up or extreme close-up |
| Reaction | A face taking something in | The story turns on how someone receives it | Close-up |
| Close-up | A face carrying the scene | An emotional line or a decision | Close-up or medium close-up |
| Reveal | New information shown so that it changes the meaning | A discovery, a threat arriving, evidence turning against someone | Any, chosen so the change reads |
| POV | What a character sees | The audience must share a look; use sparingly | Matches the look |

Rules:
- Step the size gradually across cuts and cut on action or eyeline (`references/camera-language.md` section 14); that file also holds the observed vertical-drama baseline (section 10).
- Do not use a close-up for action that needs the whole body to read, or a wide shot for an expression the story depends on.
- In a vertical frame, layer people front to back and keep the foreground clear (`references/camera-language.md` section 16).

## 11. Dialogue coverage

Pick the shots for a dialogue scene by what the exchange does. These are the building blocks:

| Shot | Purpose | Use it when |
|---|---|---|
| Establishing two-shot | Place both people and their distance | The scene opens, or the distance between them changes |
| Over-the-shoulder | Keep the relationship in frame while one person speaks | The line is about the other person, or the listener's presence matters |
| Shot and reverse shot | Alternate the two people, with matched eyelines and screen sides | A conversation that needs rhythm without a lot of movement |
| Speaker close-up | The face that delivers the line | The line is the point: a confession, a threat, a decision |
| Listener reaction | A silent face taking the line in | The story turns on how it lands |
| Insert | An object or gesture the dialogue is about | A letter, a ring, a hand that moves while someone speaks |
| Emotional change | The panel where the expression changes during the exchange | A person goes from calm to afraid; show the change, not a held face |
| Pause or silence | A held moment with no line | Something is understood without a word |

Minimal sets by scene type (a starting point, not a template):
- **Brief exchange (a few lines, low stakes):** a two-shot, then a close-up on the line that matters.
- **Standard conversation:** an establishing two-shot, shots and reverse shots in mediums or over the shoulder, a close-up on the turn, one reaction.
- **Confrontation:** an establishing two-shot, an over-the-shoulder pair, a close-up on the line that lands, a listener reaction, an insert on the gesture or object that matters, and one held silence.
- **Reveal in dialogue:** the speaker's close-up, an insert of the evidence, then the listener's reaction.

Rules:
- Do not generate every possible angle. Each panel needs a purpose the others do not serve.
- Keep the line between the speakers and each person's screen side fixed (`references/continuity.md` sections 4 and 11), and match eyelines.
- Plan the pause: a reaction pause of about 0.5 to 1.2 seconds, what the person does in it, and the ambient sound that keeps it from dead silence (`references/pacing.md` sections 4 and 6).
- The listener is never frozen while the other speaks (`references/performance.md` section 7).
- Check that each line fits its clip before approval (`references/pacing.md` section 2).
