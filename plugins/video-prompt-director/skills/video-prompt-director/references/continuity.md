# Continuity: identity, wardrobe, props, space, and shot-to-shot checks

Contents:
1. Why each prompt must carry continuity
2. Character identity and reference images
3. Wardrobe and props
4. Spatial relationships and screen direction
5. Light and time
6. The shot-to-shot check
7. The continuity ledger

## 1. Why each prompt must carry continuity

A video model sees only the prompt and references in front of it. It does not remember the previous clip. Anything that must stay the same has to be written into every prompt where it is visible, and every shot has to start from the state the previous one ended in.

## 2. Character identity and reference images

When reference images are supplied, preserve the visual identity they show: face, proportions, hair, skin appearance, wardrobe, accessories, body proportions, apparent age, distinguishing features. Do not redesign the person, add accessories, or change clothing unless the user asks.

State what each reference controls. A reference does not control everything by default.

```
Reference 1: identity and face of Mira.
Reference 2: Mira's wardrobe (green wool coat, no jewelry).
Reference 3: the kitchen environment and light direction.
```

If the user needs exact wardrobe or exact face fidelity, say so in the prompt as a plain instruction, once, near the start ("Mira wears exactly the green wool coat from the wardrobe reference"). How a given model addresses references (numbering, tags, limits) is in its file in `references/models/`. Use that model's own syntax, and do not use one model's syntax for another.

Give each person a stable short description and reuse it word for word across shots: "Mira, in her green wool coat, wet dark hair tied back." A description that drifts from shot to shot causes the person to drift on screen.

## 3. Wardrobe and props

- Wardrobe stays the same inside a scene unless the story changes it, and the change is shown.
- A prop is tracked from when it appears: which hand holds it, where it sits, what state it is in (open or closed, full or empty, lit or off).
- If the previous shot ended with the letter in her left hand, the next one starts with it in her left hand.
- Do not add props the story did not establish.

## 4. Spatial relationships and screen direction

- Keep who is left, right, near and far consistent across a scene. If Mira is camera-left of Daniel in the two-shot, she stays on that side in the singles unless the story moves her.
- A person who exits frame-left enters the next shot from frame-right, so the movement reads as continuing. Do not reverse their direction without a reason.
- Respect the line between two people in conversation (the 180-degree rule). Keep cameras on one side of it unless the cut is deliberate and the user wants it.
- Shot-reverse-shot: match eyelines. The person on the left looks toward frame-right, the person on the right looks toward frame-left.
- Keep door, window and furniture positions fixed.

## 5. Light and time

Carry light direction, quality, color, time of day and weather across shots in the same scene. Name them in each prompt in a few words: "late afternoon sun from the window on the left, warm, soft." Changes (a lamp switched on, a cloud passing) are story events and are described.

## 6. The shot-to-shot check

For each adjacent pair of prompts:

1. **Ending state of shot N equals starting state of shot N+1:** positions, posture, facing, expression, hands, props.
2. **Identity:** same description and references for every person.
3. **Wardrobe and props:** unchanged, or changed on screen.
4. **Space:** left and right, near and far, entrances and exits consistent.
5. **Light and time:** unchanged unless the story changes them.
6. **Eyelines and screen direction:** matched.
7. **Knowledge:** a person does not react to something they have not yet seen or heard.

Fix what fails by editing the prompts. Do not return a list of continuity problems you could have resolved.

## 7. The continuity ledger

For more than two shots, keep a short ledger and update it per shot. Show it to the user when asked or when it helps them check your work.

```
| Shot | Where | Who and positions | Wardrobe | Props (hand, state) | Light | Ends on |
|---|---|---|---|---|---|---|
| 01 | Kitchen, night | Mira at door, facing in | green coat, wet hair | keys in right hand | warm lamp, left | she steps inside |
| 02 | Kitchen, night | Mira at counter, facing camera | same | keys on counter | same | hand above envelope |
```
