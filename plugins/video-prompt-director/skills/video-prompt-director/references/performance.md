# Performance: movement, acting, dialogue, and groups

Contents:
1. Prevent frozen characters
2. Natural acting
3. Emotional direction
4. Multi-character direction
5. Background activity
6. Dialogue
7. Listeners and conversation
8. What models render reliably
9. Per-line delivery, voice and lip-sync
10. Every person gets a direction

## 1. Prevent frozen characters

Generated people often come out still, robotic or emotionally blank unless the prompt directs a performance. For each person in a shot, ask what a human actor would physically do in this moment, then write only those things.

- **Head:** turning toward someone or a sound, looking down at an object, a slight tilt, looking away during uncomfortable speech.
- **Eyes:** natural blinking, shifting between two people, following a hand or object, briefly avoiding contact, holding contact while speaking.
- **Face:** brows tightening, lips pressing together, jaw tension, a smile that starts and fades, a small change of expression.
- **Body:** breathing, small posture shifts, weight moving between feet, leaning in or back, turning the torso, walking, sitting, standing.
- **Hands:** a purposeful gesture, adjusting clothing, picking up or setting down an object, touching the face, opening a door.

Use only what the character, situation and clip length support. Never add random gestures just to make someone move.

## 2. Natural acting

Aim for believable acting, not maximum movement.

Avoid: blank staring, mechanical head turns, a constant smile, repeated gestures, exaggerated facial movement, stiff posture, both people blinking in sync, robotic walking, gestures with no motive, delivery with no emotion.

Encourage: small emotional changes, breath, reactions at meaningful moments, realistic eye contact, pauses, movement timed to the moment.

A person can stay nearly still while eyes, facial muscles, breath and posture carry the emotion. That is often the strongest direction. A deliberately still shot is correct when the story wants it; do not add movement to it.

## 3. Emotional direction

Describe what a camera could see, not the label.

| Label | Observable direction |
|---|---|
| Angry | "Her brows draw together, her jaw tightens, and she presses her lips together before answering in a controlled, irritated tone." |
| Heartbroken | "He lowers his gaze, closes his eyes briefly, and exhales through his nose. His shoulders drop as he works to keep his composure." |
| Shocked | "Her eyes widen slightly, her lips part, and her hand stops halfway to the glass. She stares at him a moment, taking it in." |
| Nervous | "He wets his lips, glances at the door, and rubs his thumb along the edge of the folder." |
| Relieved | "Her shoulders loosen and she lets out a long breath; a small smile starts and she looks down to hide it." |

Match the performance to the script, the dialogue and the character. A quiet character does not need big gestures. Let the emotion change over the clip instead of holding one face.

## 4. Multi-character direction

Identify every person clearly and assign actions to each one.

Weak: "He looks at her."
Strong: "The man in the charcoal suit turns toward the woman in the ivory dress."

Weak: "They argue and she leaves."
Strong: "The woman in the ivory dress takes one step back, holding the letter against her chest. The man in the charcoal suit stays by the doorway, watching her, jaw tight."

Keep character descriptions stable from shot to shot (see `references/continuity.md`). In a shot with more than two people, state each person's position and what they do. Prefer fewer people per shot when a model struggles with crowds; that is a staging choice to make in the storyboard.

## 5. Background activity

When the setting needs life, give the background small, unobtrusive activity: waiters passing in a restaurant, a nurse crossing a corridor, guests turning toward a ceremony, colleagues typing in an office. Do not animate every extra, and do not let background movement pull focus from the main subject. If the shot is a still, intimate moment, a quiet background is correct.

## 6. Dialogue

When dialogue is supplied:

- Preserve it exactly, in its original language and script. Do not translate, paraphrase or add lines.
- Identify the speaker for every line.
- Give the emotional intention and pace: "in a restrained, trembling voice", "quickly, almost under her breath".
- Include natural mouth movement and appropriate pauses, such as a glance away before the end of a sentence.
- Show the other person's silent reaction.
- Do not make non-speaking people move their mouths.
- Put the exact words in quotation marks inside the prompt so the model can tell speech from description, when the target model takes spoken lines from the prompt. Check `references/models/` for the model's documented dialogue handling.

Do not add audio, music or sound-effect instructions to a visual prompt unless the user asks for them and the model supports them.

Example: "The woman speaks in a restrained, trembling voice: 'You knew.' Her lips move naturally with the line. She glances away before the last word. The man says nothing and watches her, his jaw tight."

## 7. Listeners and conversation
8. What models render reliably
9. Per-line delivery, voice and lip-sync
10. Every person gets a direction

- The speaker gestures when it fits the line. The listener reacts at meaningful moments, not constantly.
- Do not give both people the same gesture, the same head movement, or synchronized blinks.
- The listener must never look frozen while the other speaks.
- Reactions follow the content: a listener who hears bad news changes expression before replying.
- In shot-reverse-shot coverage, keep each person's eyeline and screen direction consistent across panels (`references/continuity.md`).

## 8. What models render reliably
9. Per-line delivery, voice and lip-sync
10. Every person gets a direction

Production notes from a working short-drama pipeline: models draw some direction well and some not at all. Write for what they draw.

- **Prefer low, slow, continuous movement:** walking slowly, lifting a hand gently, sitting down along with the turn. Avoid high-burst action (sprinting, big jumps, rolls) in short clips.
- **Quantify the amount and the speed:** "slowly raises her hand", "turns her head quickly", "lowers her head slightly".
- **Write the link between actions:** "uses the turn's momentum to raise her hand", "moves from the pause into lifting the cup". Actions with a visible connection read as one motion.
- **Fit the action to the seconds.** Pick actions that models have seen many times (walking, turning, looking up, sitting, reaching for a cup).
- **Be careful with very fine detail.** Precise physical interactions, micro-expressions and finger-level movement are often not drawn correctly and can crowd out the one beat that matters. Direct them only when the shot is a close-up that depends on them, and treat the result as something to check. For most shots, use cues the camera can clearly see: a head turn, a gaze shift, a held breath, a shoulder drop, a jaw set.
- **Externalize the emotion as body detail,** never as a label: sadness as a lowered head and a trembling shoulder, tension as glancing at a watch or tapping a table, anger as clenched fists and a tight jaw.
- **Keep sound and action in agreement.** A sound described in the prompt can make the model act it out (`references/constraints.md` section 11).

## 9. Per-line delivery, voice and lip-sync

For each spoken line that carries the scene:
- **Delivery:** tone, pace, which word is stretched or stressed ("slow and unhurried, 'cucian' stretched as if tasting it").
- **Gesture tied to words:** what the body does on a specific word ("on 'Tante!' she rises on her toes and tilts her head toward the room").
- **Subtext through gaze:** where the eyes go says what the words do not ("her contempt shows by not looking at her; she looks at the soup").
- **Voice profile per character,** kept identical across clips: accent, pitch, age, pace, temperament. Reuse it word for word.
- **Lip-sync in the language spoken:** mouths open and close on that language's syllables, and stay closed in pauses of the recording. State the language when it is not English.
- **A pause is a performance:** say what the person does in it (`references/pacing.md`).

## 10. Every person gets a direction

Each person in a clip needs a performance line (what they do, where they look, how they react), even when they say nothing. A person with no direction is a frozen person. A person who is not in the clip gets none, and is not mentioned, so the model does not bring them in.

Avoid blanket stillness phrases such as "no extra movement" or "remains completely still". They make people look frozen. Describe restrained acting instead: a held breath, eyes that stay on one thing, a small shift of weight.
