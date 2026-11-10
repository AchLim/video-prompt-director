# Kling (Kuaishou)

**Status: no capability was verified.** On 2026-11-11 the official developer documentation (`kling.ai/document-api`) loaded as an empty page for the fetch tool, because it renders in the browser, and no other official page was read. So nothing below is a documented fact. Do not state Kling's duration, resolution, reference limits, prompt length, negative-prompt limit or audio support from memory.

## What to do instead

1. Ask the user which Kling version and which surface they use (web app or API), and ask them to paste the relevant limits from the current Kling documentation, or confirm them.
2. Until confirmed, write a model-neutral prompt that follows the craft rules in this skill, keep it concise, and label the model-specific fields as unverified in a short note.
3. Keep the likely-useful general practices that do not depend on a limit: stable subject description, one main action per clip, one camera movement, simple physical action, and reference-image fidelity stated plainly.

## Leads to verify (not facts)

These came from search-result snippets of official-looking pages and were **not** opened. Treat each as a pointer to check, not as guidance.

- A snippet for the text-to-video API reference shows a prompt maximum of 3072 characters (recommended up to 2500) and says the prompt field can contain both positive and negative descriptions.
- A snippet for the API update notice shows a 2024 change setting prompt and negative-prompt limits to 2500 characters. It is old and may be superseded.
- Page titles suggest official API pages exist for Omni video, Omni image, avatar and motion control.

## Verification to complete

Open https://kling.ai/document-api in a real browser, read the text-to-video, image-to-video and reference or element pages, and record for each: model versions, duration, resolutions and aspect ratios, reference and element limits, start and end frame support, audio or lip-sync support, prompt and negative-prompt limits, and official prompting guidance. Add the source URL and the verification date to every fact.
