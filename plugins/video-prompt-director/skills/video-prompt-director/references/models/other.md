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

## Adding a new model file

Create `references/models/<model>.md` with: how to use the file, official source URLs, a verification date (YYYY-MM-DD) on every documented fact, a "not documented" entry for each gap, prompting guidance quoted or paraphrased from official pages, and a short "how the skill applies this" list. Add it to the reference map in `SKILL.md`. Record no pricing unless the source is official and dated.
