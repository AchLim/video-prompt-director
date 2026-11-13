# Platforms

What the user's generation interface enforces, kept apart from what a model accepts. A model file says what the model can take; this file says what the user's tool exposes, limits or hides. When they differ, the stricter one decides what to plan.

How to read this file: every fact is tagged (`references/models/other.md`). Most here are **USER-REPORTED**, because no vendor page describes the user's interface. A platform fact is never promoted to OFFICIAL by repeating a model fact.

## The user's platform context

| Fact | Tag | Note |
|---|---|---|
| The target platform context is BytePlus ModelArk, Southeast Asia region (`ap-southeast-1`) | USER-REPORTED | The user, 2026-11-13 |
| The precise generation interface is not confirmed | UNVERIFIED | It may be the API, a web console, or another tool. Until it is confirmed, keep API capabilities and web-console capabilities apart (see below) |
| The user generates with Seedance 2.5 Flash | USER-REPORTED | The user, 2026-11-13. Individual Flash features stay UNVERIFIED (`profile-2-5-flash.md`) |
| The interface limits a prompt to about 15,000 characters | USER-REPORTED | The user, 2026-11-13, for the current interface only. It is not a Seedance specification |
| The earlier interface, used with Seedance 2.0 Mini, limited a prompt to about 5,000 characters | USER-REPORTED | The user, 2026-11-13. No official page was found that states a character limit for any Seedance model |
| Prompts are written in English by default, with spoken dialogue kept in its original language; Chinese is an allowed override | USER-REPORTED | The user, 2026-11-13 |

## Platform limit versus model recommendation

These are different numbers and must never be mixed.

| | Value | Tag |
|---|---|---|
| Interface input limit | About 15,000 characters | USER-REPORTED |
| Model's recommended prompt length | At most 500 Chinese characters or 1,000 English words | OFFICIAL (API page, read 2026-11-13). A recommendation, not a cap |

Staying under the interface limit does not mean the model will follow everything. The vendor warns that very long prompts can lose details. Plan to the recommendation, and treat anything above it as a deliberate, flagged choice.

Not confirmed: whether the interface counts characters, words, tokens or bytes; whether it counts line breaks and markup; whether it truncates silently when the limit is passed. Ask the user once, or have them paste a prompt just over the limit and report what happens. Record the result under TESTED in `test-log.md`.

## API controls versus interface settings

The registry and the profiles use API parameter names (for example `ratio`, `duration`, `output_format`, `generate_audio`, `omni_reference_task_type`, `draft`). A web interface may expose some, all or none of them, under other names.

Rules:
- For an API operation, give the API parameters.
- For a web interface, give the matching setting by the name the interface uses, and only once the user has said what it shows. Do not invent a control.
- If the user's interface does not show a setting a Locked task needs (for example the edit task's `adaptive` ratio and -1 duration), say so and ask what the interface does in its place. Do not assume it sets them.
- Never present an API-only parameter as available in the user's interface.

## Open questions to settle with the user

1. Which interface exactly (API through the SDK or cURL, the ModelArk console, a playground, or a third-party tool)?
2. Does it show Flash's limits? If so, ask the user to paste them; they would be recorded as USER-REPORTED here.
3. Which settings does it expose: ratio, duration, resolution, output format, audio, task type, draft?
4. How does it count the prompt, and what happens past the limit?
5. Which features have been tried on Flash already, and with what result?

## Adding another platform

Add a section with: the platform name and region, the user's description of its limits and controls (USER-REPORTED, dated), what each control maps to in the model file, and what is unknown. Keep every number tagged.
