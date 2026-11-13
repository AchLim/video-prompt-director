# Seedance (ByteDance, via BytePlus ModelArk): router

Seedance is a family of models with different limits and different features. Start here, choose the version, and load only the files the task needs. Do not apply one version's facts to another: Seedance 2.5 Flash is its own model with its own profile, and it inherits nothing from the flagship.

All Seedance facts were re-read on **2026-11-13** from the official pages. Provenance tags are defined in `references/models/other.md`. Pricing is not recorded.

## 1. Pick the version

Ask once if it is not clear. A user who writes "Seedance 2.5" without "Flash" gets a question, not an assumption.

| The user says | Load first | Never assume |
|---|---|---|
| Seedance 2.5 Flash, or "Flash" | `references/models/seedance/profile-2-5-flash.md` | The flagship's 30 images, 10 videos, 10 audio clips, 1080p or Draft |
| Seedance 2.5, flagship | `references/models/seedance/profile-2-5.md` | That Flash works the same way |
| Seedance 2.0, 2.0 Fast or 2.0 Mini | `references/models/seedance/profile-legacy-2-0.md` | Timestamps, audio-only references, 30 s clips, `omni_reference_task_type` |
| Not stated | Ask which version and which interface | A version |

Then read `references/models/platforms.md` for the user's own interface limits. A platform limit is not a model limit.

## 2. Load by task

| Task | Load |
|---|---|
| Write a plain Seedance prompt (text-to-video, first frame) | The version's profile, then `references/models/seedance/syntax.md` |
| Anything beyond a text prompt: references, keyframes, storyboard, clay model, editing, audio editing, extension, transitions, one-click creation, combining features | `references/models/seedance/capability-registry.md`, then the profile, then `syntax.md` |
| "Can Seedance do X?" or "Does Flash do X?" | `references/models/seedance/capability-registry.md`, then the version's profile. Answer from the row's status, not from memory |
| A generation came out wrong | `references/models/seedance/troubleshooting.md`, then the profile |
| Record or check a tested result | `references/models/seedance/test-log.md` |

Do not load the registry, the troubleshooting file or the clay and editing rows for a request that does not touch them.

## 3. Where the old content went

This file used to hold the Seedance facts. They are now organized by version:

| Former content | Now in |
|---|---|
| Model IDs, modes, durations, resolutions, ratios, reference counts, audio, real-face rule, prompt length | `profile-2-5.md` for 2.5; `profile-legacy-2-0.md` for the 2.0 series |
| The prompt formula, camera terms, reference binding, audio notation, timeline and exclusion guidance | `syntax.md` |
| "Production practice" notes (language, order, generic identity, references, subtitles, pronunciation, narration noise) | `profile-legacy-2-0.md`, tagged OBSERVED |
| The statement that no 4,000-character prompt limit was found on any official page | `references/models/platforms.md` (the user's interface limit is USER-REPORTED and separate) |

## 4. Rules that hold for every version

- State the version and the interface before writing limits into a prompt.
- Put exclusions inside the prompt; no negative-prompt parameter is documented.
- Bind every asset in the prompt with a role, in the order the subjects first appear.
- Say what is official, what is this skill's pattern, and what is untested. A feature the documentation lists without an example stays in the registry with its true status; do not drop it and do not promote it.
- When the documentation conflicts, report both statements and mark the point UNVERIFIED (`capability-registry.md`, discrepancies).
