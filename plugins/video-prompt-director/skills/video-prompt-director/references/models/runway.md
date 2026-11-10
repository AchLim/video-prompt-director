# Runway

How to use this file: documented facts below were checked against Runway's official API documentation on **2026-11-11**, through a fetch tool that summarizes pages. Runway's help-center articles returned an access error and were **not** read, so prompting advice from them is missing. "Not documented" means it was not found on the pages opened. Pricing is not recorded here; check the provider.

Sources (official):
- Models: https://docs.dev.runwayml.com/guides/models/
- API reference: https://docs.dev.runwayml.com/api.md

## Documented capabilities (verified 2026-11-11)

| Item | `gen4.5` | `gen4_turbo` | `aleph2` |
|---|---|---|---|
| Modes | Text to video and image to video | Image to video | Video to video editing with keyframe-guided control |
| Duration | 2 to 10 seconds (required) | 2 to 10 seconds (optional) | No duration field; input video must be 30 seconds or shorter |
| Aspect ratio (text to video) | `1280:720`, `720:1280` | Not applicable | Target ratios `16:9`, `4:3`, `3:2`, `1:1`, `2:3`, `3:4`, `9:16`, `21:9` |
| Aspect ratio (image to video) | `1280:720`, `720:1280`, `1104:832`, `960:960`, `832:1104`, `1584:672` | Same six | Not applicable |
| Reference images | Single first-frame image (`promptImage`); no reference-image field found | Same | `keyframes`: 1 to 5 timed guidance images |
| Native audio | No audio field listed; no explicit statement either way | Same | Same |
| Prompt length | `promptText` maximum length 1000 (unit not stated) | Same, optional | Same, optional |
| Negative prompt | No field listed | No field listed | No field listed |

Other documented parameters include `seed` (0 to 4294967295). Resolution for `gen4.5` was not stated beyond the aspect-ratio values. Prompting guidance, camera vocabulary and what-to-avoid advice: not found on the official API docs pages read.

## How the skill applies this

- Image-to-video starts from one first frame, so describe the motion from that frame, and put the identity and wardrobe in the image, not only in text. Do not promise multi-reference identity control for `gen4.5`.
- Keep the whole prompt within 1000 and put the essentials first. Write exclusions as positive direction inside the prompt, since no negative field is documented.
- Plan durations between 2 and 10 seconds and match the action to the clip (`references/cinematography.md`).
- Choose the aspect ratio from the listed values; vertical is `720:1280` for `gen4.5` text to video.
- Do not use audio instructions unless the user confirms audio support for the version they are using.
- For prompting style beyond the above, ask the user for Runway's current prompting guide, or use the craft rules in this skill and say the model-specific style is unverified.
