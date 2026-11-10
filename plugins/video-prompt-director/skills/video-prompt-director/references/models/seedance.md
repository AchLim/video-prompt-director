# Seedance (ByteDance, via BytePlus ModelArk)

How to use this file: documented facts below were checked against official pages on **2026-11-11**. The pages were read through a fetch tool that summarizes them, so confirm anything that gates a paid run in the current documentation. A fact marked "not documented" was not found on the pages opened; do not fill it from memory. Pricing is not recorded here; check the provider.

Sources (official):
- Tutorial: https://ai.byteplus.com/ark/region:ap-southeast-1/docs/seedance-2-0
- Prompt guide: https://ai.byteplus.com/ark/region:ap-southeast-1/docs/seedance-2-0-prompt-guide
- API reference: https://ai.byteplus.com/ark/region:ap-southeast-1/docs/create-video-generation-task-api
- Mirror, shows "Last updated: October 28, 2026": https://docs.byteplus.com/en/docs/ModelArk/1520757

## Documented capabilities (verified 2026-11-11)

| Item | Seedance 2.0 series | Seedance 2.5 |
|---|---|---|
| Model IDs | `dreamina-seedance-2-0-260128`, `dreamina-seedance-2-0-fast-260128`, `dreamina-seedance-2-0-mini-260615` | `dreamina-seedance-2-5-260628` (API reference) |
| Modes | Text-to-video, first-frame image-to-video, first-and-last-frame image-to-video, omni reference, video editing, video extension, video with audio | Not read in detail |
| Duration | 4 to 15 seconds | Range 4 to 30, or -1 (default -1) |
| Resolution | 480p, 720p, 1080p, 4K (Fast and mini: 480p and 720p only) | 480p, 720p, 1080p (default 720p) |
| Aspect ratio | 21:9, 16:9, 4:3, 1:1, 3:4, 9:16 | `adaptive` for first-frame and video edit/extend; full list not documented in what was read |
| Reference inputs (omni reference) | Images 0 to 9, videos 0 to 3, audio 0 to 3; audio-only input not supported | Not documented in what was read |
| Native audio | `generate_audio` parameter, default true | Same parameter in the API reference |
| Real-face references | Not supported: direct uploads of reference images or videos containing real human faces | Not documented in what was read |
| Prompt length | Recommended at most 500 Chinese characters or 1,000 English words; longer text can make the model drop details | Same guidance in the API reference |
| Negative prompt | No negative-prompt parameter found | Not documented |

The tutorial does not mention 2.5. Check which version the user is running before choosing limits. A 4,000-character prompt limit was **not** found on any official page opened. If the user's workflow configures a limit, follow the user's configured value.

## Prompting guidance from the official prompt guide

- Formula: precise subject, action details, scene and environment, lighting and color tone, camera movement, then visual style, image quality and constraints.
- Camera terms the guide uses: medium shot, close-up, wide shot, slow push-in, smooth lateral tracking, fixed shot. "Try to specify only 1 type of camera movement in a single shot."
- Multiple references: address inputs as `Image 1`, `Image 2` and `Video 1` and say what each does. The guide also shows `@Image 1` in asset lists and templates such as "Reference <Subject_N> in <Image_N> to generate...".
- More than 4 reference people lowers output stability; the guide recommends 4 to 5 assets in total.
- Audio notation in the prompt: music in parentheses, sound effects in angle brackets, dialogue in braces, for example `{Hello}`. Mark less common languages, for example "says in Japanese {...}", and keep the dialogue language consistent.
- Exclusions are written as phrases inside the prompt ("do not generate a watermark", "keep it subtitle-free"), since there is no negative-prompt parameter.
- Timeline style ("Shot 1 / Shot 2") is shown for complex videos. The guide says support for precise timing such as 0 to 3 seconds is unstable, so treat timed beats as a guide and keep the action ordered in sentences.

## How the skill applies this

- Use the model's reference syntax and state each reference's role (`references/continuity.md`).
- One camera movement per shot.
- Put exact dialogue in braces if the user wants Seedance to speak it, and ask whether native audio should be on before adding any audio text.
- Keep the prompt well under the recommended length and put the essentials first.
- Use inline exclusions instead of a negative field.
