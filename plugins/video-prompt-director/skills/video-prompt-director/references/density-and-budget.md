# Prompt density and character budget

How long a prompt should be, how to spend its length, and how to check it. The principle: use the smallest prompt that communicates everything necessary, allow much more detail only when a scene genuinely needs it, and never add material to fill a budget. A longer prompt is not a better prompt.

Contents:
1. Three different numbers
2. Counting
3. The density tiers
4. Choosing a tier (Automatic)
5. Spending the budget
6. Removing redundancy
7. Shots in one generation and shots generated separately
8. Maximum mode (experimental)
9. Validating before you return a prompt
10. Counting by hand

## 1. Three different numbers

Never confuse these.

| Number | What it is | Example | Tag |
|---|---|---|---|
| **Model's recommended length** | What the vendor advises for quality | Seedance: at most 500 Chinese characters or 1,000 English words | OFFICIAL (Seedance API page, read 2026-11-13). A recommendation, not a stated cap |
| **Interface limit** | What the user's tool accepts | About 15,000 characters in the user's current interface | USER-REPORTED (2026-11-13). Not a Seedance specification (`references/models/platforms.md`) |
| **Prompt length you choose** | What this prompt needs | Often far below both | The tier (section 3) |

Staying under the interface limit does not mean the model will follow everything. The vendor warns that very long prompts can lose details, and that overpacked time ranges give extra cuts or dropped plot. No hard cap is documented for any Seedance model. Plan to the recommendation and treat anything above it as a deliberate, flagged choice.

Recommendation by language (the unit is the language's own, and the figures are not equivalent to each other):

| Prompt language | Unit | Recommended length R | Tag |
|---|---|---|---|
| English | words | 1,000 | OFFICIAL (Seedance) |
| Chinese | Chinese characters | 500 | OFFICIAL (Seedance) |
| Indonesian | words | 1,000 assumed | UNVERIFIED: the documentation states the figure for English only |
| Any other language | words, unless the script is Chinese | Not documented | UNVERIFIED: say so, ask the user, or use 1,000 words as a cautious default and label it |

Other models have their own limits and units (`references/models/`). Runway's `promptText` maximum is 1,000 with the unit unstated; Kling 3.0 states 3,072 characters; Veo's is not documented. A model's documented limit replaces R for that model.

## 2. Counting

Count what the model receives: the final prompt text, including the dialogue, the exclusions and any reference bindings. Do not count notes written for the user outside the prompt.

- **Characters:** every character including spaces and line breaks (Unicode code points).
- **Words:** runs of non-space characters. Use this for English and other space-separated languages.
- **Chinese characters:** Han ideographs. Use this for Chinese. Punctuation is not counted as a Chinese character here.
- **Interface limit:** compare the character count. How the interface counts (characters, tokens, bytes, line breaks) is not confirmed; the user can paste a prompt just over the limit to find out (`references/models/platforms.md`).

`scripts/count_prompt.py` does this with Python 3 and nothing else. It is optional. Without it, section 10 gives the manual method, and any estimate must be labelled an estimate.

```
python3 scripts/count_prompt.py --lang en --platform-limit 15000 --file prompt.txt
python3 scripts/count_prompt.py --lang zh < prompt.txt
python3 scripts/count_prompt.py --lang en --redundancy --file prompt.txt
```

## 3. The density tiers

Tiers are defined against each language's own recommended length R, so a tier means "this share of what the vendor recommends", not a claimed equivalence between languages. The fractions are this skill's convention (HEURISTIC).

| Tier | Share of R | English (words) | English (characters, estimate) | Chinese (characters) |
|---|---|---|---|---|
| Compact | up to 0.25 R | up to 250 | up to 1,500 | up to 125 |
| Standard | 0.25 to 0.58 R | 250 to 580 | 1,500 to 3,500 | 125 to 290 |
| Detailed | 0.58 to 1.0 R | 580 to 1,000 | 3,500 to 6,000 | 290 to 500 |
| Production | 1.0 to 1.5 R | 1,000 to 1,500 | 6,000 to 9,000 | 500 to 750 |
| Maximum | above 1.5 R, up to the interface limit | above 1,500 | above 9,000, up to 15,000 | above 750, up to the interface limit |

The English character column is an estimate: English text averages about 6 characters per word including the space (HEURISTIC; the script counts exactly). The tiers up to Detailed sit inside the vendor's recommendation. **Production and Maximum are above it**, so both carry a warning, and neither is chosen without a reason (section 4). Maximum is experimental (section 8).

For Indonesian and unlisted languages the tiers use the assumed R and are UNVERIFIED.

## 4. Choosing a tier (Automatic)

Automatic is the default. Pick the smallest tier that holds every item that changes what the model makes, and say which tier you chose and why.

| Signal | Points to |
|---|---|
| One shot, one or two people, a simple action, no dialogue | Compact |
| One shot with an ending state, camera and constraints; or a short dialogue clip | Standard |
| Several references with roles, dialogue with delivery notes, a multi-shot generation of two or three shots, or physical action with several steps | Detailed |
| A multi-shot generation that needs per-shot camera, performance, dialogue and continuity, with several references and audio direction, and it would not fit Detailed without dropping something the shot needs | Production (above the recommendation: state the reason) |
| The user explicitly asks for it after reviewing the tradeoff | Maximum (experimental, never automatic) |

Rules:
- A tier above Detailed needs a reason written in the answer. "The scene is complex" is not a reason; "three shots each need their own camera and a dialogue line, and the identity blocks cannot be shortened" is.
- If a prompt reaches a higher tier only because of repetition or decoration, it is the wrong tier: remove the repetition (section 6).
- The user can choose a tier. Honour it, warn if it is above the recommendation, and do not fill it.

## 5. Spending the budget

Allocate by what matters to the picture, in this order:

1. **Subject and identity:** who is in the shot, the reference bindings (what each reference supplies and what not to take), stable identity anchors.
2. **The action and the ending state:** what happens, in order, and where it ends. For a shot with dialogue, the exact lines.
3. **Camera:** shot size, one move, stability, composition.
4. **Constraints:** what must not appear (text, subtitles, music, extra people), once and specific.
5. **Audio:** the sound the shot needs.
6. **Look:** light, colour, lens feel, stated once.
7. **Secondary detail:** set dressing and texture, only where it changes the picture.

Cut from the bottom of that list first. Never cut the dialogue, the camera, the opening and ending states, or the constraints to save length (`references/prompt-anatomy.md` section 3). A rough split for a multi-shot prompt: a shared header with bindings and look (about a tenth to a seventh of the budget), the rest shared among the shots by their duration and complexity, and the constraints and audio lines once.

## 6. Removing redundancy

Find and remove, in this order:
- **Repeated descriptions inside one prompt.** State a character's appearance once and refer to them by a short label afterwards. (Across separate generations the identity block must repeat, because each prompt stands alone.)
- **Detail a reference already fixes.** Do not re-describe the face and clothes a reference image supplies; say to follow the reference.
- **The same constraint said in several places.** Say it once, specifically. One exception: for music that keeps appearing, the vendor's own fix is to state the audio rule at the start and the end (`references/models/seedance/troubleshooting.md` TS-11).
- **Filler:** adjectives that change nothing the model can render, and sentences that restate the previous one.
- **Contradictions and overload:** two camera moves in one shot, or more events than the time holds, are removed or split, not compressed.

`scripts/count_prompt.py --redundancy` lists repeated sentences and repeated phrases to review. It finds candidates; you decide.

## 7. Shots in one generation and shots generated separately

- **Several shots in one generation (a shared budget).** The prompt has one length and one recommendation. Allocate the total across the shots (section 5), count the shared header once, and check the whole prompt against R and the interface limit. Seedance's guide warns that too much in a time range causes extra cuts or dropped plot, so a longer budget does not buy more shots.
- **Shots generated separately (a budget each).** Each prompt is counted and validated on its own, and each carries its own identity block, bindings, constraints and opening state.
- Report both: the per-prompt count, and for a shared prompt the share each shot received.

## 8. Maximum mode (experimental)

Maximum goes beyond the vendor's recommended length. Treat it as an experiment, not a preference.

- Use it only when the user explicitly asks for it; a failed Production prompt can justify suggesting it, but never selecting it automatically.
- Never select it automatically, and never to fill the interface limit.
- Spend the extra length only on items that change the output; put the dialogue, the camera, the ending state and the constraints first.
- Say plainly that it is experimental and above the recommendation, that details may be lost, and offer a Detailed version of the same shot to compare.
- A result from a Maximum prompt is recorded in `references/models/seedance/test-log.md` like any other test; until then its effect is UNVERIFIED.

## 9. Validating before you return a prompt

1. Count the final prompt (the script, or section 10).
2. State the tier and the count: for example "Detailed: 812 words, 4,980 characters (81 percent of the recommended 1,000 words; 33 percent of your 15,000-character interface limit)".
3. If it is above R, say so, give the reason, and note the vendor's warning about lost detail. If it is above the interface limit, cut until it fits, starting from section 6.
4. Re-read it for contradictions and filler (`references/prompt-quality.md`).
5. If the count is an estimate, label it an estimate.

## 10. Counting by hand

Without the script:
- **English and other space-separated languages:** paste the prompt into any word counter. If only characters are available, estimate words as characters divided by 6, and say it is an estimate.
- **Chinese:** count the Chinese characters; a word counter that counts characters will do, but check that it does not count the whole line as one word.
- **Interface limit:** paste the prompt into the user's own interface and read its counter, which is the only count that matters for that limit.
- **A prompt you cannot count:** do not guess a precise number. Say it is roughly a Compact, Standard or Detailed length and what you based that on.
