# Action blocking: timed beats that a model can perform

Contents:
1. Why time the actions
2. The rules
3. How long actions take
4. Hands and objects
5. Behaving like people, not like NPCs
6. Listening, waiting and the space between beats
7. Worked example

## 1. Why time the actions

"The baker opens the door. The boy shivers, shows three coins and a drawing, then points toward the cake." gives a model five actions with no order, no owner per hand, and no time. It either blends them (the boy points while holding out both hands) or rushes them into the first seconds and fills the rest with drift. Timed blocking says who does what, with which hand, from when to when, and what the other person does meanwhile.

## 2. The rules

1. **One actor, one action, one window.** Each beat names one person and one observable action with a start and an end second: `7.8–8.6 s: The boy looks past the baker at the cake on the counter.`
2. **Actions happen in order.** A person does one body action at a time. A facial change (eyes, breath, a smile) can overlap a body action of the same person; two body actions cannot.
3. **Leave room.** A beat gets at least the time in section 3. When a shot cannot hold its beats, cut something, lengthen the shot, or split the action across a cut (section 4).
4. **Every action has a cause the audience can see or hear.** The baker's eyes go to the mitten because it tapped. The boy looks at the cake before he gestures toward it.
5. **Name the hand and the object.** "lifts his right mitten, still holding the drawing" (section 4).
6. **Others react while one person acts.** Write the listener's beat in the same window (section 6).
7. **End on a state, not on motion.** The last beat of a shot leaves people in a position the next shot can start from.
8. **No beat is decoration.** If removing an action changes nothing the audience understands or feels, remove it. Fewer, clearer actions generate better than many small ones.

## 3. How long actions take

Planning minimums for an unhurried, natural performance. HEURISTIC: drawn from drama practice and the observed pipeline in `references/pacing.md`; a fast or panicked action can take less, and a tired or reluctant one more. `scripts/direction_plan.py` uses this table.

| Action | About |
|---|---|
| Breath, shiver, blink | 0.3 s |
| A look or glance; eyes moving to something | 0.5 s |
| A smile, a frown, tears welling, a face falling | 0.6 s |
| Tap or knock | 0.6 s |
| Nod or head shake; one step; a point or gesture | 0.8 s |
| Reach, take, grip; lift or hold something out; turn the body | 1.0 s |
| Put down, set, lower; pocket or tuck | 1.2 s |
| Open or close a door; fold or unfold paper; sit down or stand up; bite and chew | 1.5 s |
| Hand something to someone (offer, grip, transfer, release); a hug; walking a few steps | 2.0 s |
| Put on or take off a coat | 4.0 s: show it across a cut instead |

Speech: about 2.5 words per second in English and similar languages, 4.5 characters per second in Mandarin, plus 0.4 s at each change of speaker (`references/pacing.md`).

## 4. Hands and objects

- **Two hands, two things.** A person who holds coins in one hand and a drawing in the other has no free hand to point, open a door or hug. Either let the gesture use the occupied hand ("lifts his right mitten, still holding the drawing, toward the cake"), or show the object being put down first.
- **Mittens and gloves have no fingers.** No "index finger", no fingertips: the whole hand points, presses or lifts.
- **Handovers are four beats** (offer, take, transfer, release) and need about 2 s. In a short shot, cut across the handover and state the result: "Across the cut: the boy has handed the drawing up and the baker has opened it."
- **Carrying.** Two hands carry one large thing (a box held level), or one thing each. A third item rides on the first ("the cup carrier riding on the box lid") or is not there.
- **Nothing floats.** An object in frame is held by a hand that is in frame, or rests on something. An insert of a held object shows the holding fingers.
- **Objects stay where they were put.** The pot set beside her hip is still beside her hip in the next clip, and the next prompt says so.
- **Costume changes happen off-screen.** A coat goes on across a cut or between clips, never inside a short shot.

## 5. Behaving like people, not like NPCs

NPC behaviour is action without want: characters who face the camera, perform their emotion at it, move all at once, and wait for their turn to speak. People:

- **Want something in every shot,** and the body shows it: the boy keeps very still so as not to be sent away; the baker makes "free" sound like a rule so they do not have to say thank you. Write the want in `perform`, in a phrase, not an emotion label.
- **Delay.** A reaction lands a beat after its cause (a glance, then the face changes), and a decision shows before the action (the jaw sets, then he turns).
- **Hold back.** A child hiding disappointment smiles a beat late and the smile does not reach his eyes. Under-play by default; let one moment per clip be big.
- **Look at things, not at the camera.** Eyes go to the object or person that matters, then to the other person.
- **Do not all move at once.** In a group, one person leads and the others follow, a fraction of a second apart.
- **Keep small, specific business** only when it says something (thumbs smoothing a crease in the drawing), never generic fidgeting.

## 6. Listening, waiting and the space between beats

- A listener reacts while the other person speaks or acts: eyes, breath, a small change in the mouth. Write that beat in the same window.
- A pause is an action: say what happens in it ("his breath fogs as he waits for them to take it in").
- A non-speaking person's mouth stays closed; say so once in `AUDIO`.
- Name the ambience so silent moments are not dead air.

## 7. Worked example

The bakery doorway, 8 seconds:

Weak:
> The baker opens the door. The boy shivers, shows three coins and a drawing, then points toward the cake.

Timed:
```
4–5.6 s: The baker pulls the door inward with his right hand; warm light spills across the snowy step.
5–5.8 s: The boy looks up at the baker, shivering, breath fogging.
6–7.6 s: The boy holds out both mittens: three coins in the open left mitten, the folded drawing in the right.
7.8–8.6 s: The boy looks past the baker at the cake on the counter.
8.6–9.8 s: The boy lifts his right mitten, still holding the drawing, toward the cake.
9–9.8 s: The baker glances over his shoulder at the cake.
10.2–11 s: The baker looks back down at the boy, brows drawing together slightly.
11–12 s: The boy waits, breath fogging, mittens still held out.
```

What changed: every action has one owner and its own time; the point uses the hand that holds the drawing, because both mittens are full; the boy looks at the cake before he gestures at it; the baker's glance answers the gesture; the shot ends on a held state. The full plan is `examples/bakery-direction-plan.json`; the before and after prompts are in `examples/layered-direction.md`.
