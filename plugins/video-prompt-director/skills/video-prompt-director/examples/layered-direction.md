# Layered direction: before and after (the bakery benchmark)

A 73-second Christmas film on Seedance 2.5 Flash, six clips, 9:16, three people (a baker, a 7-year-old boy, his mother). The **before** prompts were written by hand in one pass from a production spec. The **after** prompts are compiled from `examples/bakery-direction-plan.json` by `scripts/direction_plan.py` (`references/director-layers.md`). The before plan is the same six prompts transcribed into the plan format, with each untimed action spread evenly over its window; it is kept as a test fixture.

The boy's line is written "Please... just one." in this file only because this repository's copy rule bans the em dash; the film's line, and the plan (as `\u2014`), keep the em dash.

## 1. What the validator found in the before prompts

`python3 scripts/direction_plan.py validate` on the transcribed before prompts: **12 errors, 14 warnings**. On the after plan: **0 and 0**.

| Clip | Error | What was wrong in the prompt | Fixed in the after plan by |
|---|---|---|---|
| 1A | `hand-busy` | The boy "holds out three coins and the drawing in his mittens, then points" toward the cake: both mittens are full | He lifts the mitten that holds the drawing toward the cake, after looking at it |
| 1B | `ots-face` | "Over-the-shoulder from behind the baker … the baker's eyes drop to the coins": his face is not in the shot | He lowers his head; his look is played in the next shot that sees his face |
| 1B | `floating-prop` | The drawing insert has "no hands in frame, only the paper", and the drawing was never handed over | "Across the cut: the boy has handed the drawing up and the baker has opened it"; the insert shows the baker's fingers at its corners |
| 2A | `hand-busy` | The mother holds the potted pine and also takes the drawing and hugs him | She sets the pot on the bench first, then takes the drawing in her right hand |
| 2B | `release-not-held` | The baker "lowers the cake into the box" without ever picking it up | Two beats: he lifts it with both hands, then lowers it in |
| 3A | `hand-full` ×2, `beat-overlap` | In 4 seconds he picks up the box, a cup carrier and a bag of cookies, then steps out | The box is held level in both hands with the cup carrier riding on its lid; the cookies are cut |
| 3A | `wardrobe-unexplained` | Apron in 2B, overcoat in 3A, the change written nowhere a model can see | A declared wardrobe change at the clip boundary and its own reference image (`@char_baker_coat`) |
| 3B | `hand-busy` | The mother lifts the box lid with both hands while (as far as any prompt said) still holding the pine | The pot stays on the bench, and every clip says where |
| 3B | `prop-appears` ×2 | A cake wedge and three cups appear from nowhere | "Across the cut: the mother has broken off a small wedge"; the baker hands out the cups across the cut, and the carrier ends empty on the snow |

The warnings: no screen sides in any two-shot (`sides-unset` ×6), the pine pot held but never mentioned while she is in frame (`held-prop-unstated` ×4), two tight beats, and one beat that chains two actions.

## 2. What a director's review found that the validator cannot

| Clip | Problem | After |
|---|---|---|
| All | The style lock said "Audio: ambience and foley only" while three clips carry spoken lines | `AUDIO` states the speech rule per clip: only the written lines, listeners' mouths closed |
| All | Every clip restated the whole style lock (about 1,300 characters) and then had a wardrobe block added on top, with the costume written three ways | `LOOK` once; costume once, in `CAST`, for the people in this clip only |
| All | A locked or "held" shot under a global "handheld micro-movement": the two never said which wins | The global says faint handheld breathing; shots say "held still". The validator now warns on the conflict (`camera-global-conflict`) |
| 1A | Sign flip, mitten tap, breath fog and the line all inside 3 seconds, unordered | 4 seconds; flip 0–1.2 s, taps 1.3–2.0 s, the baker's eyes 1.6–2.4 s, the line at 2.2 s |
| 1A–3B | Nobody says what anyone holds at the start of a clip, so each generation guesses | `START STATE` and `END STATE` in every clip, derived from the plan: positions, facing, both hands, every prop |
| 1B | The baker reacts with "his eyes", but the moment that motivates the refusal (the drawing) never reaches his face | Insert of the drawing, then his face: a glance at the cake, then back to the boy, then the line |
| 2A | "She looks at it, then at him" in one beat | Two beats: she unfolds and looks at the drawing, then looks up at him |
| 3B | "Hard cut to black" asked of the model | Hold on the three of them after the clink; the edit adds the black (`references/pacing.md` section 5) |
| All | Characters perform at the camera: the boy's "face falls" as a label | Wants and restraint in `perform`: "he keeps very still so as not to be sent away", "the smile comes a beat late and does not reach his eyes" |

## 3. Clip 1A, before and after

Before (as written; the app then added a wardrobe block, a voice block and a pacing block):

```text
REFERENCES: @char_baker (flour-dusted apron over brown cardigan), @char_boy, @prop_cake, @prop_drawing, @loc_bakery.

[00:00 - 00:03] Exterior, tight medium shot through the frosted glass door of @loc_bakery at blue twilight, heavy snow falling steadily past the lens. Inside the warm amber shop, @char_baker flips the hanging wooden door sign to "CLOSED". A small snow-covered mitten of @char_boy enters frame foreground and taps sharply on the frosted glass, twice. Breath fog drifts across the glass.
  DIALOGUE (@char_boy, off-screen, muffled through glass, earnest, starts 00:01): "Please... just one."

[00:03 - 00:12] Hard cut. Low-angle medium shot at @char_boy's eye level. @char_baker pulls the wooden door open; warm 2700K golden light spills onto fresh snow on the step. @char_boy stands shivering on the snowy step, breath fogging, holding out three small coins and the folded @prop_drawing in his wet mittens, then points past @char_baker toward @prop_cake sitting on the wooden counter behind him. @prop_cake visible soft in the background, crimson ribbon catching the light.

AUDIO: howling winter wind, wooden sign knock, two sharp mitten taps on glass, door creak, wind rushing in, quiet indoor room tone, shivering breath, coins clinking softly in a mitten. No music.
```

After (compiled, text-only, no storyboard):

```text
REFERENCES: @char_baker = the baker (apron): face, build and costume; @char_boy = the boy: face, build and costume; @loc_bakery = the corner bakery: architecture and set dressing; @prop_cake = the Christmas cake: its design; @prop_drawing = the crayon drawing: its design.

LOOK (whole clip): Photoreal live-action, 9:16 vertical, 24 fps. Clean, sharp, grain-free image with no digital noise; warm tungsten highlights against deep cool shadows; soft halation around warm lights; rich shadow detail, no crushed blacks. Exteriors are desaturated slate-blue winter twilight; the bakery interior is warm golden-amber tungsten; warm light spills into the cold blue wherever a door or window opens. 50–85 mm prime look, shallow depth of field. Eye level, dropping to a 7-year-old's eye height for shots centred on the boy; faint handheld breathing only; no gimbal glides, orbits or zooms; framing changes only at the hard cuts written below. Heavy snow falls slowly and steadily through every exterior frame, drifting and turning, never frozen in the air; breath fogs on every exhale outdoors.

CLIP PURPOSE: Hook: a small mitten knocks as the bakery closes; the boy wants the one cake in the window and has almost nothing to pay with.

CAST (only these people appear; no one else in any frame):
- The baker (@char_baker): wears a flour-dusted espresso-brown waxed canvas apron over a chestnut-brown shawl-collar cardigan, sleeves pushed to mid-forearm, charcoal wool trousers.
- The boy (@char_boy): wears an oversized navy duffle coat with wooden toggles, a dark forest-green beanie pulled low, a red-and-navy tartan scarf, dark-charcoal knitted mittens dusted with snow; voice: a small, earnest 7-year-old's voice, a little breathless from the cold.

SCENE: The corner bakery, Christmas Eve, blue hour. Heavy snow falling slowly. Seen from the street: the glass-paned front door in the centre, the wooden sign hanging inside its glass; inside, the counter runs across the back of the shop; the small table set for one stands by the front window on the right. Warm tungsten from brass pendants inside; slate-blue twilight outside.

START STATE (continues from the previous clip): The baker: inside the shop, one step behind the closed glass front door, facing the street. The boy: outside on the snowy granite step, facing the door. The boy holds three small coins in his left mitten and the crayon drawing (folded once) in his right mitten. The Christmas cake: on the counter behind the baker, ribbon toward the door. Set: door: closed; sign: hanging inside the glass, reading OPEN to the street.

SHOT 1 (0–4 s): Exterior medium close-up through the frosted glass door from the street, at the boy's eye height; the boy's shoulder and mitten soft in the screen-left foreground, the baker sharp beyond the glass. Camera: held still. In frame: the boy (screen left), the baker (screen right); no one else.
  0–1.2 s: The baker reaches up with his right hand and flips the hanging wooden sign to CLOSED.
  1 s: sound of the wooden sign knocking against the glass.
  1.3–2 s: The boy taps the glass twice with his left mitten, the coins inside it clicking.
  1.5 s: sound of two soft taps on glass.
  1.6–2.4 s: The baker's eyes move from the sign down to the small mitten at the glass.
  2.2 s: THE BOY (@char_boy, off-screen, muffled through the glass, earnest) says: "Please... just one."
  The baker's performance: a tired man closing up: shoulders loose until the tap, then still.

SHOT 2 (4–12 s, hard cut): Medium two-shot from the street at the boy's eye height, slightly low; the boy in three-quarter profile on screen-left, the baker filling the doorway on screen-right, the counter and the cake soft in the warm shop between them. Camera: held still. In frame: the boy (screen left), the baker (screen right); no one else.
  4–5.6 s: The baker pulls the door inward with his right hand; warm light spills across the snowy step.
  4.3 s: sound of the door's hinge creaking.
  5–5.8 s: The boy looks up at the baker, shivering, breath fogging.
  6–7.6 s: The boy holds out both mittens: three coins in the open left mitten, the folded drawing in the right.
  6.4 s: sound of coins clinking softly in a mitten.
  7.8–8.6 s: The boy looks past the baker at the cake on the counter.
  8.6–9.8 s: The boy lifts his right mitten, still holding the drawing, toward the cake.
  9–9.8 s: The baker glances over his shoulder at the cake.
  10.2–11 s: The baker looks back down at the boy, brows drawing together slightly.
  11–12 s: The boy waits, breath fogging, mittens still held out.
  The boy's performance: hope held in check: he keeps very still so as not to be sent away.
  The baker's performance: surprised, not unkind; he takes the boy in before he decides anything.
  Must read clearly: the cake with its crimson ribbon on the counter, soft but recognisable.

END STATE: The baker ends in the open doorway, facing the boy. The boy holds three small coins in his left mitten and the crayon drawing (folded once) in his right mitten.

AUDIO: Ambience: winter wind; wind gusting into the warm doorway. Speech: only the lines written above, word for word, by the named speaker; listeners' mouths stay closed. No music, no score, no singing.

AVOID: film grain or noise; subtitles, captions or any text except the wooden CLOSED sign and the crayon words "Merry Christmas, Mom"; extra people; background music; faces, costumes or props changing between shots; zooms or dissolves; morphing hands or merged fingers.
```

## 4. Length

| Clip | Before, as sent (with the app's added blocks) | After, compiled |
|---|---|---|
| 1A | 3,926 | 5,510 |
| 1B | 4,083 | 5,535 |
| 2A | 3,943 | 4,645 |
| 2B | 2,979 | 3,596 |
| 3A | 4,313 | 5,072 |
| 3B | 4,188 | 5,857 |

The after prompts are about 30% longer, all of it in two places: the start and end states (what every hand holds, where every prop is) and the timed beats with their sounds. Repetition went down: the look is stated once, the costume once, and faces are left to the reference images. Every clip is far under Flash's 15,000-character limit. Do not shorten them by dropping the states: that is what the before prompts left to the model, and it is where they broke.

## 5. With and without a storyboard

The after prompts are complete without a storyboard: every position, side, hand, prop, beat and line is in the text. Adding a storyboard image (`"storyboard": "@sb_1A"` on the generation) adds one reference line that ties the panels to the timed shots and makes the written timing win where they differ. In this film it would help the compositions that words describe loosely: the boy's shoulder in the foreground of 1A shot 1, the window frame in 2A shot 1, and the three-shot on the bench in 3B. It would not fix anything in section 1: none of those errors is a composition problem.
