# Seedance 2.0 series profile (legacy): 2.0, Fast and Mini

The 2.0 series is the previous generation. Use this file when the user names Seedance 2.0, 2.0 Fast or 2.0 Mini, or when they say their earlier work used one of them. Seedance 2.5 and 2.5 Flash have their own profiles and do not inherit anything from this file.

How to read this file: every fact is **OFFICIAL**, read on **2026-11-13** from the page named, unless a row carries another tag (`references/models/other.md`). Sources (`https://ai.byteplus.com/ark/region:ap-southeast-1/`): `docs/seedance-2-0-prompt-guide` (G20), `docs/seedance-2-5` (T25, whose capability table includes the 2.0 series), `docs/create-video-generation-task-api` (API), `docs/seedance-portrait-asset-guide` (PA). The separate `docs/seedance-2-0` tutorial was read on 2026-11-11 (the source of the "largely the same features" note below) and only partly on 2026-11-13; no limit in this file depends on it. The 2.0 guide shows no date.

## Identity

| Model | ID |
|---|---|
| Seedance 2.0 | `dreamina-seedance-2-0-260128` |
| Seedance 2.0 Fast | `dreamina-seedance-2-0-fast-260128` |
| Seedance 2.0 Mini | `dreamina-seedance-2-0-mini-260615` |

The three share "largely the same features" (older tutorial, read 2026-11-11). Prompt rules specific to Fast or Mini were not found.

## Limits

| Item | 2.0 series | Source |
|---|---|---|
| Modes | Text-to-video, first frame, first and last frame, omni reference (image, video), edit, extend, native audio, return last frame | T25 |
| Audio-only reference | Not supported; an image or video must accompany audio | T25, API |
| Draft mode | Not supported | T25 |
| Duration | 4 to 15 s, or -1 | T25, API |
| Resolution | 2.0: 480p, 720p, 1080p (8-bit), 4k (10-bit). Fast and Mini: 480p and 720p only | T25, API |
| Output format | `mp4` only | T25 |
| Ratios | 21:9, 16:9, 4:3, 1:1, 3:4, 9:16, `adaptive` | API |
| References | At most 15 (9 images, 3 videos, 3 audio clips) | T25 |
| Reference video | 2 to 15 s each, 3 clips at most, combined at most 15 s | API |
| Reference audio | 2 to 15 s each, 3 clips at most, combined at most 15 s | API |
| `omni_reference_task_type` | Not available (2.5 only) | API |
| Offline (flex) inference | Not supported | T25, API |
| Real faces | Not supported as direct uploads (the portrait guide names the "2.0 series") | PA |

The 2.0 series gets the same real-face and trusted-output rules as 2.5 (see `profile-2-5.md`). Whether Fast and Mini are covered is not stated (DISC-12).

## Behavior that differs from 2.5

| Topic | 2.0 series | Source |
|---|---|---|
| Timing in the prompt | Ignores timestamps; responds to shot numbers ("Shot 1, Shot 2"). Precise timing such as 0 to 3 s is "unstable" and forcing it can give abnormal results | G25 differences, G20 |
| Multi-view subject images | Not recommended; 2.5 supports them | G25 differences, G20 FAQ |
| Aspect ratio | Six fixed ratios plus `adaptive` | G25 differences |
| Edit and extend in 2.0 | Templates in `syntax.md`; "parts not mentioned remain unchanged by default" | G20 |
| Track completion | Up to 3 clips, combined at most 15 s; the model trims connecting frames | G20 |
| Recommended assets | 4 to 5 in total: 1 to 2 character images (face close-up, full body), 1 scene image, 1 camera-movement video, 1 audio clip. Do not use the full limit | G20 |
| More than 4 reference people | Stability drops (TS-04) | G20 FAQ |
| Camera moves | "Specify only 1 type of camera movement in a single shot" | G20 |
| Actions and emotion | Prefer slow, gentle, continuous movement; externalize emotion as body detail | G20 |

## OBSERVED practice from one production pipeline

These came from the short-drama pipeline the skill was first built on (about 230 stored prompts, Seedance clips of 4 to 15 s). They are not documented by the vendor. Treat them as habits to try, not rules. Where the official guide agrees, the agreement is noted.

| Practice | Tag | Note |
|---|---|---|
| Write the whole prompt body in one language (Chinese in that pipeline) and keep dialogue in one language | OBSERVED | The guide only requires dialogue in one language and says not to mix Chinese and English except for proper nouns (G20). |
| Describe order in words, not second ranges | OBSERVED | Consistent with the 2.0 guide's timing warning. It does not apply to 2.5, which supports integer-second timestamps. |
| Refer to people by a visual description and the reference id, and keep names for dialogue | OBSERVED | The pipeline's notes credit the vendor's guide; the 2.0 guide's own wording is to define each subject with stable features and a label (G20). |
| One camera move per cut | OBSERVED | Matches G20. |
| References: four to five assets, most important first; headshot plus full body; no multi-view sheets | OBSERVED | Matches G20 and its FAQ for 2.0. |
| Subtitles: write "keep it subtitle-free" and check every clip | OBSERVED | The 2.0 FAQ says subtitles cannot be fully prevented (TS-08). |
| Chinese dialogue: rare or polyphonic characters can be misread; substitute a common homophone | OBSERVED | Matches the 2.0 FAQ (TS-14). |
| Narrated clips can end with a noise; fade out in post | OBSERVED | Matches the 2.0 FAQ (TS-13). |

## Seedance 2.0 Mini

- Model ID `dreamina-seedance-2-0-mini-260615`; 480p and 720p only; 4 to 15 s; 15 references (OFFICIAL, T25 and API, 2026-11-13).
- The user's earlier interface for Mini had a prompt limit of about 5,000 characters (USER-REPORTED, 2026-11-13; see `references/models/platforms.md`). No official page was found that states a character limit for any Seedance model.
- Treat Mini as legacy: do not write prompts for it using 2.5 features (timestamps, audio-only references, `omni_reference_task_type`, Draft, 30 s clips, 1080p).

## How the skill applies this

- When the user is on a 2.0-series model, plan within 15 s, 15 references, no audio-only reference, shot numbers instead of timestamps, and 480p or 720p for Fast and Mini.
- Do not mix a 2.0 recipe into a 2.5 operation without noting that the 2.5 guide only carries subject, motion, audio and style reference recipes from the 2.0 guide (registry basis `2.5-VIA-2.0`). Other 2.0-only recipes (text generation, logo reference, sequence reference, track completion, white-model conversion) are UNVERIFIED for 2.5.
