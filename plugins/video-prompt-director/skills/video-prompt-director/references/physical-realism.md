# Physical realism: objects, hands, bodies

Contents:
1. Choreograph interactions step by step
2. Keep choreography simple
3. Anatomy and motion failures
4. Objects and space
5. Staging around known weak spots

## 1. Choreograph interactions step by step

For anything a person does with an object, door, phone, letter, glass, bag, furniture, clothing, food or another person, write the sequence of actions in order, with which hand does what.

Weak: "She drinks some water."
Strong: "She reaches her right hand toward the glass on the table, wraps her fingers around it, lifts it slowly, and brings it to her lips."

State where the object starts and where it ends. Give contact a motive: she picks up the letter because she wants to read it, not because a hand needs something to do.

## 2. Keep choreography simple

- One main action per short clip. Two linked actions need a clip long enough to hold them.
- Prefer a simple, believable move to a complicated one. If an action is hard (a hug with locked hands, a handshake with a pass-off, tying a tie), simplify how the story shows it before dropping it: a hand on a shoulder, a cut to an insert of the object.
- Do not stack a camera move, a walk, an object handoff and dialogue in one short clip.
- Give a person one thing in each hand at most unless the story needs more.

## 3. Anatomy and motion failures

Video models commonly produce these. Avoid asking for the actions that cause them, and add a relevant negative constraint when the model supports one.

- Extra, merged or missing fingers.
- Hands that pass through objects or other bodies.
- Limbs that vanish behind a pose and reappear changed.
- Unnatural joint angles.
- Faces that distort during fast turns or large expression changes.
- Sudden body transformation or a change of position without motion.
- Floating or sliding objects.

Do not promise a model will avoid these. Write the shot so it is less likely to trigger them: slower motion, simpler hand work, fewer people, a face that does not turn fast.

## 4. Objects and space

Maintain:
- Consistent object positions (the cup on the left side stays on the left).
- Correct hand placement and contact.
- Natural weight and momentum: a heavy bag pulls the shoulder, a door has a hinge side.
- Correct spatial relationships between people, furniture and doors.

If an object matters later, state it in every prompt where it is in frame (`references/continuity.md`).

## 5. Staging around known weak spots

Crowds, fast action, fine hand work, text on screen, mirrors and reflections, and complicated contact between two bodies often fail. When the story needs one of these, choose a staging that gets the same beat across with less risk: fewer people in frame, an insert shot, an implied action (the sound or the reaction instead of the impact), or a slower move. Do not cut the beat from the story; change how it is shown. Check the target model's file for any documented limits before deciding.
