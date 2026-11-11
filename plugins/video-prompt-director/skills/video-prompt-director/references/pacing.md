# Pacing: dialogue time, entry beats, pauses, density

Contents:
1. Evidence and limits
2. Speech takes time: does the dialogue fit the clip
3. Entry beat
4. Reaction pauses and gaps inside a speech
5. Closing hold
6. Sound during pauses
7. How much action fits: beats and cuts per clip
8. Rules of thumb
9. What to do when it does not fit

## 1. Evidence and limits

The numbers here come from a working vertical short-drama pipeline (two series, Seedance clips of 4 to 15 seconds, dialogue in Indonesian and Mandarin). They are planning estimates. Video models approximate timing and never hit it frame for frame, so exact timing is set in the edit. Use these figures to avoid plans that cannot fit, not to promise a result.

## 2. Speech takes time: does the dialogue fit the clip

Before writing a clip, estimate how long the spoken lines take, then check that the clip has room left for the action and the ending.

| Language | Planning rate |
|---|---|
| Space-separated languages (English, Indonesian, Spanish and similar) | about 2.5 words per second |
| Mandarin | about 4.5 characters per second |
| Change of speaker | add about 0.4 s of breath between speakers |

Worked example: 14 words of English dialogue is about 5.6 s; with one speaker change, about 6 s. In a 6 s clip that leaves nothing for entry, reaction or ending.

- **Dialogue longer than the clip:** use a longer clip or split the lines across two clips. Never compress the speech or cut words.
- **Dialogue that nearly fills the clip:** little room is left for the action. Either simplify the action or lengthen the clip.
- **The line must appear in the prompt word for word,** in its language.
- **For other languages,** use the user's measured rate if they have one, or ask. For a language not listed, say the estimate is rough.

`references/models/` gives each model's documented durations; if a model takes a recorded audio file, the recording's length decides the clip length (`references/constraints.md` section 5).

## 3. Entry beat

When a scene or a new angle appears, give the viewer a moment of atmosphere before the first line or major action. The observed defaults:

| Situation | Entry beat |
|---|---|
| New camera angle in the same scene | about 0.4 s |
| New location, or a new scene after a time jump | about 1.5 s |
| New scene that opens on a wide establishing shot | about 2 s |

- **Keep it to 2 seconds or less.** A longer entry beat is filled by the model with random movement.
- **Describe the room and the positions first, and put the first line later.** If the first sentence of the action already has someone speak, the line lands on the first frame and cancels the beat.
- **Start on the action on purpose** for an interruption, a chase or an urgent line. Say so; then there is no entry beat.
- If the dialogue leaves no room for the beat, shorten the beat or lengthen the clip. Do not squeeze the dialogue.

## 4. Reaction pauses and gaps inside a speech

- **Reaction pause:** a listener takes in what was said before answering. Use about 0.5 to 1.2 s; a major revelation may run to about 1.5 s.
- **Gap inside a speech:** the speaker pauses mid-thought ("If I wanted your family dead... why did I try to save your father?").
- **Too short does not read.** Under about 0.5 s is shorter than a natural breath.
- **Too long reads as frozen,** and models rarely hold long pauses.
- **Pause where something lands.** Pausing after every exchange slows the clip down; keep the one that matters most.
- Say what happens in the pause: "her expression turns from suspicion to disbelief".

## 5. Closing hold

Hold about 0.5 s on the final reaction or movement after the last line. A longer hold can be added in the edit when trimming. Do not ask the model to cut to black; it wastes frames. Hold on the last reaction and let the edit add the black.

## 6. Sound during pauses

A pause with no named room sound can come out as dead silence. Name the ambience for the pauses (rain, wind, candle crackle, room tone). Keep to the room's established sound; do not add new sounds in a pause that the scene has not established.

## 7. How much action fits: beats and cuts per clip

**Major actions per clip** (a beat is a change the viewer reads as a new action):

| Clip length | Major actions |
|---|---|
| up to 4 s | 1 |
| up to 6 s | 2 |
| longer | up to 3 |

If the story needs more, split the clip rather than cutting story.

**Cuts per clip** observed in the pipeline's stored prompts:

| Clip length | Cuts observed |
|---|---|
| 4 s | 1 |
| 6 to 8 s | 2 |
| 9 to 10 s | 2 to 4, most often 2 to 3 |
| 12 to 13 s | 3 to 5 |
| 14 to 15 s | 4 to 6 |

Individual cuts ran about 2 to 5 seconds, most often 3 to 5. A cut under 2 seconds is rarely worth it.

## 8. Rules of thumb

- Give the audience time to see, understand and react before the next line.
- Do not lengthen a clip, cut a line, or add silence silently. If a plan does not fit, say so and propose the fix.
- Blanket stillness ("no extra movement", "remains completely still") makes people look frozen. Describe restrained acting instead (`references/performance.md`).
- A pause is a performance, not a gap: say what the person does in it.

## 9. What to do when it does not fit

1. Count: dialogue seconds, entry beat, pauses, closing hold, and the action.
2. If the total exceeds the clip, remove the weakest item in this order: a repeated pause, the entry beat, a secondary action. Keep the line and the story beat.
3. If it still does not fit, propose a longer clip or a split, and show the split.
4. Tell the user what you changed.
