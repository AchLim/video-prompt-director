# Seedance platform and API operation notes

These notes route to the registry and version profiles; they are not a replacement for current BytePlus API documentation or the user's interface. The model, the interface and the user's account can have different controls, limits, policies and availability. Do not assume Flash inherits flagship behavior. When documentation conflicts, preserve the discrepancy instead of choosing an undocumented resolution.

## Asset identity and real faces (P4, P10)

For flagship, bind each reference by role and upload order in the prompt; an asset-library identifier is not the same thing as its prompt label. The 2.5 profile describes permitted routes for real-face content, trusted model outputs and authorized assets, and records the unresolved treatment of fictional photorealistic faces (DISC-12). Confirm the current rules and the user's authorization. Do not bypass moderation. Flash-specific face rules remain UNVERIFIED.

The flagship API documentation lists URL, base64 data URI and asset ID for images and audio; videos use URL or asset ID. The request-body limit is distinct from per-asset limits. Keep credentials and signed URLs out of the prompt, logs and examples. For each ModelArk media content item, `role` is a sibling of the media object, not nested inside `video_url` or `image_url`. Check the current schema for the specific type.

## Optional and uncertain controls (P7-P12)

- P7: the vendor names an external prompt-optimizer skill. Mention it only as an optional external resource; this skill does not install or depend on it.
- P8: older inline `--` parameters appear in the API's general description, but per-model support was not established. Prefer documented request-body fields; mark inline support UNVERIFIED.
- P9: a sample task ID is listed as an allowed content combination, but the item schema was not found. Do not invent a payload.
- P11: seed, fixed-camera and frame-count parameters have conflicting general and per-model descriptions (DISC-02). Do not claim support for 2.5 or Flash without model-specific evidence.
- P12: `priority` is listed for flagship; `flex` is not supported. Callback, expiry and safety identifier have general descriptions but no confirmed 2.5-specific support in the pages read (DISC-11). Check the current model line and surface before use.

## Retention, errors and troubleshooting (P13)

The flagship tutorial reported a 24-hour video URL with a maximum of 100 downloads, a seven-day task ID and account/model-based rate limits. Values can change: check the current documentation and the user's own quota. Save outputs before links expire. On HTTP 429, slow or queue requests and retry according to the service guidance; distinguish account quota, rate and concurrency limits. For invalid task or parameter errors, compare task type, source roles, duration and ratio against the profile; for server errors consult the current error-code list and retry only as appropriate. `profile-2-5.md` and `troubleshooting.md` retain the source-specific errors. No API control is assumed to be present in a web interface.

## Evidence and test recording

The user's approximately 15,000-character interface limit is USER-REPORTED and separate from the vendor's approximate 1,000-English-word or 500-Chinese-character recommendation. A recommendation is not a model cap. Flash's notice simultaneously says available and gives a future rollout time (DISC-06); record both, and check the current interface rather than resolving the conflict by guesswork.

For a new capability, choose a low-cost test only after confirming accepted settings. Record model, interface, date, task, assets, settings, prompt, expected and actual outcome in `test-log.md`. Only a recorded successful real generation supports TESTED for that exact configuration; an evaluation of this skill, a vendor claim, or a failed experiment does not.
