# Seedance 2.5 (flagship) profile

The model's own facts: what it accepts, its limits, its parameters and its errors. Flash is a different model with its own file (`profile-2-5-flash.md`); nothing here carries to Flash. The user's platform limits are in `references/models/platforms.md`. Capability status per feature is in `capability-registry.md`.

How to read this file: every fact is **OFFICIAL**, read on **2026-11-13** from the page named in its section, unless a row carries another tag (see `references/models/other.md`). The pages were read as markdown. They carry no publication date, so a fact here can be older than the read date. Confirm anything that gates a paid run. Pricing and account balance rules are not recorded.

Sources (`https://ai.byteplus.com/ark/region:ap-southeast-1/`):
- `docs/seedance-2-5` (tutorial and model table), called T25.
- `docs/seedance-2-5-prompt-guide`, called G25.
- `docs/create-video-generation-task-api`, called API.
- `docs/seedance-portrait-asset-guide`, called PA.

## Identity

- Model ID: `dreamina-seedance-2-5-260628` (T25, API samples).
- 2.5 is the flagship. A separate model, Seedance 2.5 Flash, is announced; see its profile.
- The vendor describes 2.5 as a systematic extension of 2.0 for production, not a generational leap (G25 summary).

## Modes (T25 capabilities overview)

Text-to-video, first-frame, first-and-last-frame, omni reference (image, video, audio, and combinations), video editing, video extension, native audio, draft mode, return last frame. Offline (flex) inference is not supported. Audio-only reference input is allowed on 2.5 and was not on 2.0.

## Task types, locked and unlocked (T25 task types and constraints, G25 task instructions)

| Task | Class | What the input fixes | Required settings | Trigger wording |
|---|---|---|---|---|
| Text-to-video | Unlocked | Nothing | None | None |
| Reference (omni) | Unlocked | Nothing | Reference roles on the assets | None |
| Multi-panel storyboard | Unlocked | Nothing; the sheet is a loose plot guide | Reference image role | None |
| Multiple keyframes | Unlocked | Nothing; aligns more strictly | Reference image role, ordered | First sentence names the images |
| First frame, or first and last frame | Locked | Aspect ratio follows the first-frame image | `first_frame` and `last_frame` roles; `ratio` = `adaptive` | Role set in parameters |
| Video editing | Locked | Aspect ratio and (approximately) duration follow the source | At least one `reference_video` of 4 to 30 s; `ratio` = `adaptive`; `duration` = -1; `.mov` recommended | edit the video, add, insert, remove, delete, modify, replace, change to |
| Video extension | Locked | Aspect ratio follows the source | At least one `reference_video`; `ratio` = `adaptive`; `.mov` recommended | extend forward, extend backward, continue, continue from, extend the story |

- The model picks which input video to edit or extend from the prompt. For API content items, `role` belongs at the content-item level, alongside `video_url`; it does not belong inside the `video_url` object (API `content.role`).
- First-frame, first-and-last-frame and omni reference cannot be mixed in one request (API).
- Set `omni_reference_task_type` (`auto`, `reference`, `edit`, `extend`; default `auto`) to state the task explicitly. With `edit` or `extend` set, a violated constraint is rejected at submission with an error. With `auto`, the model infers the type and a violation fails later.

### Errors named in T25

| Code | Meaning | Fix |
|---|---|---|
| `InvalidParameter.TaskTypeMismatch` | The model's inferred type differs from the one set. Raised after the task starts. | Make the prompt's intent match `omni_reference_task_type`, or set `auto`. |
| `InvalidParameter.TaskTypeConstraint` | Parameters are incompatible with the task type. Raised after the task starts. | Apply the settings in the table above. |
| HTTP 429 | Rate limit exceeded. | Wait or queue. See limits below. |

The separate [ModelArk inference error-code list](https://docs.byteplus.com/en/docs/modelark/error-codes) was checked on 2026-11-13. Its English page did not expose the table in the available reader; the official Korean-language page exposed it. General codes include `MissingParameter` and `InvalidParameter` (400: inspect the request), `AccountRateLimitExceeded` (429: reduce request frequency and retry), and `InternalServiceError` (500: retry later). These are general API errors, not Seedance-specific guarantees. Consult the current list for the actual code and message. Face-moderation rejections are covered under real faces below.

## Reference inputs

Counts (T25 capabilities overview, API content items):

| Input | 2.5 limit |
|---|---|
| Total references | 50 (30 images, 10 videos, 10 audio clips) |
| First frame | 1 image |
| First and last frame | 2 images |
| Reference video | Non-edit tasks: 2 to 30 s each. Edit tasks: 4 to 30 s each. Combined at most 30 s. |
| Reference audio | 2 to 30 s each, combined at most 30 s |

The image count is written as "0 to 30" in one place and "1 to 30" in another (DISC-01).

Formats and sizes (T25 multimodal input, API):
- Images: jpeg, png, webp, bmp, tiff, gif, heic, heif. Width and height 300 to 6000 px. Aspect ratio 0.4 to 2.5. Under 30 MB each. Accepted as URL, base64 data URI or asset ID.
- Videos: mp4 or mov (H.264 or H.265 video; AAC or MP3 audio, and PCM for mov). 480p, 720p, 1080p or 4k. 24 to 60 fps. Aspect ratio 0.4 to 2.5. Total pixels 407,696 to 8,295,044. Under 200 MB each. URL or asset ID only.
- Audio: wav or mp3. Under 15 MB each. URL, base64 data URI or asset ID.
- The request body is at most 64 MB. Do not use base64 for large files.
- Some JPEGs fail with HTTP 400 (`invalid image: heic: decode failed`) because of unusual chroma subsampling; see `troubleshooting.md` TS-20.

Recommendations (G25 reference asset table; these are guidance, not limits):

| Use | Recommended |
|---|---|
| Subject images | 1 to 8 subjects; 9 to 12 is possible but less stable |
| Subject views | 1 to 5 subjects: single-view and multi-view both supported. Above 5: single-view is more stable, and multi-view should be split into separate images |
| Subject audio or video | 1 to 5 subjects, 5 to 10 s each; longer may reduce stability |
| Storyboard | At most 15 panels; line art or stick figures; no text |
| Clay model | Simple, coarse-grained; primitives for people, objects, animals |
| Editing video | Within 20 s; longer may reduce stability |
| Editing reference images | 1 to 5; 6 to 8 is less stable |
| Extension | Use `.mov` for input and output |
| Image size | Up to 4K; resize so it does not exceed the output resolution (fingerprint-texture issue, TS-21) |

Upload order: upload subjects in the order they first appear and renumber the prompt to match (TS-01).

## Output

| Parameter | Values (T25, API) |
|---|---|
| `resolution` | 480p (8-bit), 720p (8-bit, default), 1080p (10-bit, H.265/HEVC) |
| `ratio` | 21:9, 16:9, 4:3, 1:1, 3:4, 9:16, `adaptive` (default). Edit, extension and first-frame tasks accept only `adaptive`. With `adaptive`: edit and extension follow the source video; first-frame follows the image; text and reference tasks let the model choose. |
| `duration` | 4 to 30 s, or -1 (default). Edit accepts only -1. With -1 on other tasks the model picks a whole-second length in range. |
| `output_format` | `mp4` (default) or `mov`. `mov` is H.264, YUV 4:4:4, PCM audio, recommended for edit and extension. |
| `generate_audio` | `true` (default) or `false`. Audio output is stereo. |
| `watermark` | `false` (default). `true` adds an "AI Generated" mark at the lower right. |
| `return_last_frame` | `false` (default). `true` returns the last frame as a JPEG at the video's pixel size, without watermark. |
| `draft` | `false` (default). 2.5 only; see below. |

Pixel sizes (width by height):

| Ratio | 480p | 720p | 1080p |
|---|---|---|---|
| 16:9 | 854 x 480 | 1280 x 720 | 1920 x 1080 |
| 4:3 | 752 x 560 | 1112 x 834 | 1664 x 1248 |
| 1:1 | 640 x 640 | 960 x 960 | 1440 x 1440 |
| 3:4 | 560 x 752 | 834 x 1112 | 1248 x 1664 |
| 9:16 | 480 x 854 | 720 x 1280 | 1080 x 1920 |
| 21:9 | 992 x 432 | 1470 x 630 | 2206 x 946 |

Other output facts:
- The guide says any output ratio from 0.4 to 2.5 can be reached by controlling the input assets (G25 differences from 2.0).
- Edit output can be about 0.3 s (G25) or up to 0.4 s (T25, API) shorter than the input, and may be a non-integer length (DISC-03).
- 1080p H.265 and `.mov` may not play in some players. T25 suggests VLC, mpv or QuickTime, and notes IINA supports `.mov` on macOS only.

## Draft mode (T25 `2.5_draft_mode`)

1. Create the draft with `draft` = true and `resolution` = 480p. Any other resolution errors. It is billed as a 480p video.
2. Create the final with content `{"type": "draft_task", "draft_task": {"id": ...}}` and `resolution` = 1080p. Any other resolution errors. The two steps are billed separately.
3. Do not re-send the prompt, the image, video or audio items, `duration`, `ratio`, `seed`, `generate_audio` or `omni_reference_task_type` in step 2. T25 says an error occurs even if the values match.
4. The draft instructions list `return_last_frame`, `output_format`, `watermark`, `service_tier`, `execution_expires_after`, `priority`, `callback_url`, and `safety_identifier` as fields that may be re-sent in step 2. This general permission does not confirm that every field supports flagship 2.5: callback, expiry and safety identifier remain UNVERIFIED under DISC-11. If `return_last_frame` is omitted, the model default applies, not the draft's value.
5. A draft ID is valid for 14 days if created at or after 2026-10-28 10:00 (UTC+8), otherwise 7 days, counted from creation. An expired ID cannot be used.

## Audio, languages and markup

- Native audio is on by default (`generate_audio`).
- Languages (T25): Chinese, English, Spanish, Indonesian, Malay, Thai, Arabic, Portuguese, Vietnamese, Japanese, Korean. English is supported by all models. State the language before dialogue that is not Chinese or English.
- Markup and formats: `syntax.md`.

## Real faces and portrait assets (PA, API)

- Seedance 2.5 and the 2.0 series "do not support directly uploading reference images or videos that contain real human faces".
- Routes the pages offer: (a) preset digital characters, referenced as `asset://<asset ID>`; (b) trusted model outputs: face-containing videos from 2.5 or 2.0 (from 2026-03-11) and last-frame images (from 2026-04-16) from the same account, original and uncompressed, valid 30 days; and Seedream 5.0 text-to-image faces (from 2026-04-16); (c) authorized real-person assets.
- Trust "takes effect only when face moderation is triggered", and output can still fail moderation.
- Not addressed on any page read: whether a fictional, photorealistic AI-generated face from another tool is treated as a real face, and how faces are detected (DISC-12). Treat the first upload of each fictional character as a test. Record the result in `test-log.md`.

## Prompt length and timing

- Recommended prompt length: at most 500 Chinese characters or 1,000 English words (API, `text` item). It is a recommendation, not a stated cap; no hard cap is documented. The user's interface limit is separate (`platforms.md`).
- 2.5 supports integer-second timestamps; see `syntax.md`.

## Retention and rate limits (T25)

- Video URL kept 24 hours, at most 100 downloads. Task ID valid 7 days from creation.
- Rate limits apply per primary account and per model, regardless of version. Enterprise: 600 requests per minute, 10 concurrent tasks. Individual: 180 and 3. Excess tasks queue; HTTP 429 means "Too Many Requests".
- Account-level query limits: retrieve a task 20 per second, list tasks 1, cancel or delete 20.

## API parameters and where they are unclear

| Parameter | 2.5 status | Note |
|---|---|---|
| `model`, `content`, `resolution`, `ratio`, `duration`, `generate_audio`, `watermark`, `output_format`, `return_last_frame`, `draft`, `omni_reference_task_type`, `priority` | OFFICIAL | Listed for 2.5 above. `priority` is 0 to 9, default 0. |
| `service_tier` | OFFICIAL, with a gap | `default` is online. `flex` is not supported for 2.5. |
| `callback_url`, `execution_expires_after`, `safety_identifier` | UNVERIFIED for 2.5 | Described, but with no per-model line (DISC-11). `execution_expires_after` default 172800 s, range 3600 to 259200. |
| `seed`, `camera_fixed`, `frames` | UNVERIFIED | Documented for 1.x models only; a general note says "all models" (DISC-02). Do not offer them for 2.5. |
| Legacy inline `--` parameters | UNVERIFIED | Per-model support not found (P8). |

Task types go in the request body field `omni_reference_task_type`; in the SDK samples it is passed through the extra body. The cURL edit and extend samples omit it (DISC-05).

## How the skill applies this

- Plan an operation as a spec with settings, not only a prompt: the task type, ratio, duration, output format, audio and the ordered asset list decide whether the request is accepted.
- Never promise a Locked task a ratio or duration the input controls.
- Never put first-frame or last-frame roles in the same request as omni references; for a first frame plus a motion video, use `reference_image` and say "Image 1 is the first frame", and tell the user the ratio is not locked.
- Check asset counts against this file for flagship and against `profile-2-5-flash.md` for Flash.
- Tell the user which interface setting matches each API parameter only after the interface is known (`platforms.md`).
