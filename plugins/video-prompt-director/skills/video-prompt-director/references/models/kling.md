# Kling (Kuaishou)

How to use this file: documented facts below were read from Kling's official developer documentation on **2026-11-11**, in a real browser. Only Kling 4.0, Kling 4.0 Flash and the Kling 3.0 text-to-video page were read. Kling O1, 2.6 and 2.5 Turbo appear in the docs navigation and were **not** read, and neither were the Kling 3.0 image-to-video, omni and motion-control pages. "Not documented" means it was not found on the pages read. Pricing is not recorded here; check the provider.

Sources (official):
- Kling 4.0 user manual: https://kling.ai/document-api/api/usage-guide/kling-4-0
- Kling 4.0 prompt guide: https://kling.ai/document-api/api/usage-guide/kling-4-0-prompt-guide
- Kling 3.0 text-to-video: https://kling.ai/document-api/api/video/3-0-omni/text-to-video

The docs site shows a banner that Kling 4.0 Flash is available, so ask the user which Kling version they use before applying limits.

## Documented capabilities (verified 2026-11-11)

| Item | Kling 4.0 | Kling 4.0 Flash | Kling 3.0 (text to video page) |
|---|---|---|---|
| Endpoints | `/omni-video/kling-4.0`, `/image-to-video/kling-4.0`, `/text-to-video/kling-4.0` | Same family; Omni Reference and Keyframes entry points | `/text-to-video/kling-3.0` |
| Duration | Integer 3 to 30 seconds. If omitted on omni: from a prompt hint, else the base video, else 10 seconds | 3 to 20 seconds | Integer, default 5; allowed range not captured |
| Resolution | The task sections say 720p and 1080p (default 1080p); the specification table also lists 4K, with 4K HDR "coming soon" | 720p | 720p and 1080p listed, default 720p; the description also mentions 4K |
| Aspect ratio | Omni: 21:9, 16:9, 9:16, 1:1, `adaptive` (default). The image-to-video endpoint takes no `aspect_ratio` | Not read | 16:9, 9:16, 1:1, default 16:9 |
| Reference inputs | Omni Reference: up to 15 assets in all, made up of up to 10 images, up to 5 videos (combined 30 seconds at most), and up to 7 elements (up to 3 video elements); voice profiles also count toward the 15 | Not read in detail | Not read |
| Keyframes | Up to 10 images: first, last and middle frames, through the image-to-video endpoint | Not supported (first and last frame, multi-keyframes) | Not read |
| Video editing | Up to 5 clips including 1 primary video; each clip 3 to 30 seconds; combined at most 30 seconds | Combined at most 20 seconds | Not read |
| Audio | Native audio and stereo; voices and dialogue kept in sync; voice profile references; uploading background music or sound effects as references is not supported | Voice cloning not supported | `settings.audio`: `native` or `off`, default `off` |
| Prompt length | Text-to-video prompt must be fewer than 8,000 tokens | Not read | Maximum 3072 characters, recommended at most 2500 |
| Negative prompt | No separate field found | Not read | The prompt "can include positive and negative descriptions" |
| Multi-shot | Smart shot-splitting on by default for long generations | Not read | `multi_shot` default true; format "shot n, m, words;", 1 to 6 shots, each at least 1 second, shot durations sum to the total, each shot prompt at most 512 characters |
| Languages | Chinese, English, Japanese, Korean, Spanish, Portuguese, German, French, Hindi and others | Not read | Not read |

Video extension (up to 2 minutes) is listed as "coming soon" for Kling 4.0; do not plan around it.

## Prompting guidance from the official docs

- **Say what each asset supplies.** In omni tasks every asset gets an `id` and is referenced as `@id` in the prompt (for example `@Image1`, `@Video1`). State the role: identity and outfit, composition, camera path and pacing, action, or the subject and the background.
- **Asset types in the API:** `refer_image`, `feature_video` (borrow action or camera work), `base_video` (the video to edit), `element`, `voice`; keyframes use `first_frame`, `last_frame`, `middle_frame`.
- **Editing prompts** state which video to edit, what to change and what to keep unchanged ("Edit @Video1 ... Keep the original actions, composition and camera movements unchanged").
- **Style edits:** the guide says a combination of positive description and negative exclusion tends to give more stable results.
- **Simple prompts are expanded.** The manual says a one-line idea gets storyline, blocking and camera filled in, and a clear, detailed description is followed faithfully.
- **Long prompts:** the guide's examples use shot blocks with durations ("Shot 1 (5s)") and time ranges (for example 0.0 to 4.0 s), plus location maps, per-shot camera and lens notes, and an explicit list of what must stay consistent.
- **Wording consistency:** the 4.0 manual says to keep wardrobe, face and design consistency by describing it for each referenced character.

## How the skill applies this

- Ask which Kling version and endpoint the user has, and take limits from the version's column above.
- For references, number the assets, say what each one controls, and keep the roles separate (`references/continuity.md`).
- Use shot blocks with durations for clips longer than one beat; for the Kling 3.0 `multi_shot` format keep each shot prompt within 512 characters.
- Keep the whole prompt inside the version's documented length (8,000 tokens for 4.0 text-to-video; 3072 characters for 3.0).
- Do not add audio direction unless the user asks; check the `audio` setting for 3.0, which defaults to off.
- When editing a video, always state what to preserve.
