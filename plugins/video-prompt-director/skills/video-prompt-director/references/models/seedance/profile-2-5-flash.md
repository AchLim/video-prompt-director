# Seedance 2.5 Flash profile (provisional)

Seedance 2.5 Flash is a separate model from Seedance 2.5. It has no itemized capability page yet. This profile records only what the documentation or the user has stated about Flash, marks everything else UNVERIFIED, and never copies a flagship limit into Flash. "UNVERIFIED" is not "unsupported": a feature the Flash page does not list may or may not exist.

Status: **provisional**. Re-verify it after **2026-11-15 14:00 (UTC+8)**, when the vendor says Flash becomes available for online use and API calls. The checklist is at the end.

Sources:
- Flash model page (called FL): `https://ai.byteplus.com/ark/region:ap-southeast-1/model/detail?name=dreamina-seedance-2-5-flash`, read 2026-11-13. It is about 2,000 characters long and is the only Flash-specific page found.
- The availability notice at the top of `docs/seedance-2-5` and `docs/create-video-generation-task-api` (called T25 and API), read 2026-11-13.
- The user's statements in this project, dated 2026-11-13.

Tags are defined in `references/models/other.md`. Capability status per feature is in `capability-registry.md`; its Flash column agrees with this file.

## Identity and availability

| Fact | Tag | Source and note |
|---|---|---|
| The model is named Seedance 2.5 Flash; its page slug is `dreamina-seedance-2-5-flash` | OFFICIAL | FL URL, 2026-11-13 |
| The API model ID | UNVERIFIED | Not stated on any page read. Do not guess an ID from the flagship's. |
| Available for online experience and API calls from 14:00 (UTC+8) on 2026-11-15 | OFFICIAL | T25 and API notice, read 2026-11-13 |
| The same notice also says Flash "is now available" | OFFICIAL | Conflicts with the dated statement (DISC-06). The statements conflict; availability before the dated rollout is unconfirmed. |
| The user is generating with Flash | USER-REPORTED | The user, 2026-11-13. This predates the API date, so the interface the user has may expose Flash earlier. Which interface is not yet confirmed (`platforms.md`). |

## Facts the Flash page states

| Fact | Tag | Note |
|---|---|---|
| A single clip up to 30 seconds | OFFICIAL | FL. The minimum duration and allowed intermediate durations are not stated; a duration below 30 s is UNVERIFIED unless the interface confirms it. |
| Resolutions 480p and 720p | OFFICIAL | FL. 1080p is not listed; plan without it. |
| Up to 10 images, 5 videos and 5 audio clips in one request | OFFICIAL | FL. The flagship's 30, 10 and 10 do not apply. |
| Retains a broad range of 2.5 capabilities, including multimodal references and video editing | OFFICIAL | FL, in general terms. Nothing is itemized. |
| Faster and cheaper than the flagship, with quality described as near flagship | OFFICIAL | FL, a vendor claim. The user reports provider figures of approximately 2x faster and 34% lower cost; those precise figures are USER-REPORTED pending independent verification. |
| The same 30 s, 10 / 5 / 5 and 480p / 720p values | USER-REPORTED | The user supplied them on 2026-11-13. They match FL, so they stand as OFFICIAL. |

Planning limits for Flash until the documentation grows: 30 s, 480p or 720p, 10 images, 5 videos, 5 audio clips. The per-asset format, size and duration limits of the flagship are UNVERIFIED for Flash; use them only as a cautious default and say so.

## Not stated for Flash (all UNVERIFIED)

The Flash page and the API page say nothing about the following, so each one is UNVERIFIED, whether or not the flagship has it:

- Aspect ratios, minimum duration, the `duration` value -1, and output format (`mp4` or `mov`).
- Per-mode support: text-to-video, first frame, first and last frame, omni reference, keyframes, storyboard reference, clay-model references.
- Audio reference, audio-only input, `generate_audio` and the 11 native languages.
- Video editing details, video extension, seamless transition, one-click creation.
- Draft mode. The flagship's Draft final step accepts only 1080p, and Flash lists only 480p and 720p, so Draft cannot be assumed to work on Flash (DISC-07).
- Multi-view subject references (the flagship supports them; Flash is UNVERIFIED).
- Real-face rules (the portrait guide names 2.5 and 2.0; it does not name Flash).
- Prompt length, per-asset sizes, rate limits, retention.
- Timestamps and the prompt syntax in `syntax.md`. Assume the same syntax works only after a test.

## TESTED

No Flash feature has a recorded generation yet. A feature becomes TESTED only when `test-log.md` holds an entry with the model, platform, settings, date and result.

## Cost-aware testing

A feature the plan depends on should be tried first at a duration the interface actually accepts and the lowest resolution Flash offers, with the smallest asset set that exercises it. Record the result in `test-log.md` whether it passes or fails. A passing result applies to that model, platform and settings only.

## Re-verification checklist (after 2026-11-15 14:00 UTC+8)

1. Re-read the Flash model page, the tutorial's capability table and the API page's model lines. Look for a model ID, a Flash column or a Flash section.
2. Record: model ID, durations (minimum and maximum), ratios, resolutions, reference counts and per-asset limits, supported modes, audio and `generate_audio`, languages, Draft, editing and extension, prompt length, face rules.
3. Update the Flash column of `capability-registry.md` row by row. A row moves to OFFICIAL only on a Flash-specific statement; add a source code for the new Flash page (`FL2`) in the registry's source table and cite it in that row's Source cell.
4. Re-run the registry check (`scripts/check_registry.py` in the repository, or the manual check in the registry) and the Seedance evals.
5. Keep any row the new text does not settle as UNVERIFIED.

## How the skill applies this

- Name the model before planning. If the user says Flash, use this file; if they say 2.5 without "Flash", ask which.
- Plan inside 30 s, 480p or 720p, and 10 / 5 / 5 references. Count the manifest against these limits, including storyboard sheets and keyframes, which are images.
- Before using a capability this file calls UNVERIFIED, say so, give the fallback (a different capability, or two passes), and offer a short test.
- Do not infer Flash behavior from the flagship's profile, and do not describe Flash as lacking a feature the page does not mention.
