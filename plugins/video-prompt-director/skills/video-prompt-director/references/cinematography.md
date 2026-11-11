# Cinematography: composition, camera, and shot structure

For lens and depth of field, angle, composition, camera movement choices, smoothness, eyeline, focus and blocking, read `references/camera-language.md` as well.

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

State them when they matter to the shot: eye level, slightly low, slightly high, camera height at chest or waist, camera on the left or right of the subject, subject placement in frame (left third, centered, offset with headroom). Keep stated choices consistent with the previous shot (`references/continuity.md`).

## 4. Camera movement

Use the least movement that serves the shot.

- Locked-off or static.
- Slow push-in, slow pull-out.
- Smooth tracking alongside or behind a walking subject.
- Controlled pan or gentle tilt.
- Subtle handheld, where tension or documentary feel is wanted.
- Rack focus between two subjects.

One camera move per continuous shot. Do not combine a push-in, a pan and a handheld shake. Name the speed ("slow", "steady") and where the move ends. Avoid movement that does not come from the story.

## 5. Camera and subject move independently

Camera movement and subject movement are separate instructions. A camera can stay locked while a woman walks from the doorway to a table. A camera can push in slowly while a man stays seated and speaks, with small facial and hand movement. Both are valid. A static camera never means a static person.

Write the camera instruction once and the subject's action in its own sentences, so the model does not blend them.

## 6. Focus and depth of field

Say what is sharp and what is soft: "shallow depth of field, the speaker in focus, the doorway blurred." Mention a rack focus only when the story calls for a shift of attention. Do not request a focus pull the clip length cannot hold.

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
