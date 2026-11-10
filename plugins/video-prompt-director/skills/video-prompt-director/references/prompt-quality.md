# Prompt quality: the validation checklist

Contents:
1. When to run it
2. The checklist
3. Negative constraints
4. Contradictions and length
5. Scoring (optional)
6. Revising

## 1. When to run it

Run it on every prompt before returning it, silently. Fix what fails. Print it only if the user asks or when you are reviewing someone else's prompt (workflow C), where the diagnosis is the deliverable.

## 2. The checklist

Each item is pass or fail. A fail in a blocking item means the prompt is revised before it is returned.

**Story and action (blocking)**
1. The starting state is clear: who, where, doing what, with what expression.
2. There is a meaningful action, not just a pose.
3. The shot has progression: a beginning, a development and an ending.
4. The ending state is stated, so the next shot can start from it.
5. The action fits the duration. A 4-second clip does not hold five actions.

**Camera and look (blocking)**
6. Shot size and angle are specified.
7. Camera movement is appropriate and singular; no competing moves.
8. Camera movement and subject movement are described separately.

**People (blocking)**
9. Facial expressions and emotions are described as visible behavior, not labels.
10. Each person is identified, and actions are assigned to the right person.
11. Listeners and non-speakers have a reaction or a stated stillness; none moves their mouth as if speaking.
12. No unintended frozen-character problem: if someone is meant to be still, the prompt says what still conveys (breath, eyes, posture).

**Dialogue (blocking when dialogue exists)**
13. Lines are exact and assigned to the correct speaker. Nothing is invented or translated.

**Physical and continuity (blocking)**
14. Object and hand interactions are plausible, simple and ordered.
15. Reference images are preserved and each one's role is stated.
16. The prompt matches the previous and next shots (`references/continuity.md`).

**Model fit (blocking)**
17. The prompt uses only features the target model's file documents, within its documented limits, in its syntax.
18. Anything not documented for the model is flagged as unverified, not assumed.

**Hygiene**
19. No contradictions (see section 4).
20. The prompt stands alone: nothing in it depends on notes the video model cannot see.
21. No filler: every sentence changes what the model will make.

## 3. Negative constraints

Use them only where the target model supports a negative prompt or documents a way to exclude things. Choose the few that apply to this shot:

- Identity or wardrobe change, duplicated people.
- Distorted face, deformed hands, extra fingers.
- Unintended cuts or scene transitions.
- Floating objects, disappearing objects.
- Subtitles, logos, watermarks, unintended text.
- Frozen or robotic movement, when the shot has a performance.

Do not paste every item into every shot. Do not write a negative that contradicts the positive ("no movement" next to a walking person). If a model has no negative-prompt field, express the constraint positively inside the prompt, or in the way the model's documentation describes, and check its file.

## 4. Contradictions and length

Look for:
- Two camera movements, or a locked camera with a pan.
- A person described as still and as moving in the same beat.
- Different wardrobe or hair in different sentences.
- Time or light that changes without a stated event.
- Dialogue assigned to someone shown off-screen without saying so.
- Required actions longer than the clip.

For length, use the limit documented for the target model, with its source and date. If none is documented, do not invent one: keep the prompt as short as the shot allows, put the essential instructions first, and tell the user to check the current limit. When a documented limit is exceeded, cut redundant description before cutting the action, the camera or the exact dialogue.

## 5. Scoring (optional)

A score is a way to tell the user where a prompt is weak, not a measurement. Offer one only when it is useful, such as in a repair review. If you give one, say which parts cost points. Do not raise a score to look good. A shot that is meant to be still is not penalized for lacking movement; judge whether the performance is believable.

Rough weighting for a 100-point view: character movement and performance 25, temporal progression 15, cinematography 15, physical realism 10, consistency and continuity 15, dialogue and interaction 5, model fit 15. Below about 85, revise before returning.

## 6. Revising

1. Fix blocking failures first.
2. Prefer removing a conflicting or overloaded instruction over adding more words.
3. Re-run the checklist on the revised prompt.
4. In a repair review, show the original problem, the change and the reason, briefly. In a normal run, return only the final prompts.
