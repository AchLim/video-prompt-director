# Other and unlisted video models

For any model without its own file in this folder.

## Rules

- Never claim a model supports a feature, limit, input or price you have not seen in its current documentation or been told by the user.
- Do not reuse another model's prompt syntax. Reference tags, timing notation, dialogue markup and negative-prompt behavior differ between models.
- If the user names a model, ask for its current limits (duration, resolution, aspect ratio, reference inputs, prompt length, audio, negative prompt) or for a link to its documentation.
- If the user supplies a model's documentation or limits, follow them and record the source and date in your reply.

## Model-neutral prompt

When the model is unknown or unverified:

1. Write one self-contained paragraph in English, with the subject, the timed or ordered action, the camera, the setting and light, and the ending state.
2. Keep it concise. Put the essential instructions first.
3. State exclusions positively inside the prompt rather than in a negative field.
4. Keep dialogue exact and attributed, in the original language, and leave audio instructions out unless the user asks.
5. End with one note listing what you could not verify for this model.

## Provenance tags

Every fact in a model or platform file carries one tag, so the reader can tell what is documented from what is hearsay. A fact without a tag does not belong there.

| Tag | Meaning | Must also record |
|---|---|---|
| **OFFICIAL** | Stated on a vendor page the author read | Page URL and the date it was read |
| **USER-REPORTED** | Stated by the user about their own platform or account | Who reported it and the date |
| **OBSERVED** | Seen in one named production pipeline, not documented by the vendor | Which pipeline and how it was observed |
| **HEURISTIC** | A rule of thumb written by the skill's author | None; never present it as a limit |
| **TESTED** | Verified in an actual generation | Model, platform, settings, date and the result, logged in the model's `test-log.md` |
| **UNVERIFIED** | Not confirmed, not read, summary-only, or contradicted by another page | What is missing or what conflicts |

Rules:
- **Conflicting documentation stays UNVERIFIED** until the conflict is resolved. List both statements and their sources.
- **"Not documented" is not "not supported".** Record the gap, and do not assume either way.
- **A version or model that has no page of its own does not inherit another model's facts.** Mark the row UNVERIFIED instead of copying a neighbour's limit.
- **TESTED means a recorded generation succeeded.** A plausible guess, a vendor example or a one-off impression is not a test.
- **Model facts and platform facts are kept apart.** A model file records what the model accepts; a platform file records what the user's interface enforces (for example its own prompt-length limit, UI settings or missing options).

## Adding a new model file

Create `references/models/<model>.md` (or a folder for a large family) with: how to use the file, official source URLs, a provenance tag and verification date on every fact, a "not documented" entry for each gap, prompting guidance quoted briefly or paraphrased from official pages, and a short "how the skill applies this" list. Keep the model's facts in one file and the user's platform limits in `references/models/platforms.md`. Add the file to the reference map in `SKILL.md`. Record no pricing unless the source is official and dated.
