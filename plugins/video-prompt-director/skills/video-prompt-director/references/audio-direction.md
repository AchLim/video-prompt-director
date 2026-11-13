# Audio direction for video production

Choose an audio plan independently of genre, visual style, production format and prompt language. Do not assume that a video model has native sound or accepts audio references; consult the selected version and interface. A project's source dialogue stays in its original language unless the user explicitly asks for translation.

## Choose the output

| Plan | Generation instruction | Production note |
|---|---|---|
| Native audiovisual | Name each speaker and exact words, delivery, ambience, effects and music only where wanted. Check language and audio support for that version. | Review intelligibility, speaker identity, pronunciation, timing and unwanted subtitles. |
| Dialogue only | Ask for only the named speech, no music or extra effects. | Some models add sound despite exclusions; review and isolate or replace in post as needed. |
| Supplied recording | Identify the recording's role: voice/timbre reference, timing guide, or final master mixed in post. Only claim exact native passthrough when documented for that model and interface. | Preserve the untouched original separately. Ask for onset, waveform or timing if it matters; do not invent it. Test lip-sync, then align and mix in post. |
| Silent picture | Request silent output via a supported setting or prompt. | Add dialogue, music and effects in post if wanted. Silent output and mouth alignment are separate requirements. |

Audio reference does not imply word-for-word reproduction, voice identity, native dubbing or precise lip-sync. For Flash, the count of reference clips is documented but individual audio-reference modes and passthrough are UNVERIFIED. If a user needs a particular result, say what is documented, what remains uncertain, and offer a small test at settings the interface accepts.

## Dialogue timing and coverage

Use the exact supplied words and speaker assignments. Estimate speech time using `references/pacing.md`, adding room for reactions and action. If it does not fit, show the complete line or a complete natural split and propose supported durations. Keep translated text separate from the original and translate only when asked. Silence is an intentional choice, not missing audio.

## Sound layers and continuity

Specify voice, environment, effects and score as separate layers. Give each only the detail the shot needs. Keep perspective, source and transitions coherent across clips; plan room tone and cuts in post where native audio is uncertain. For unwanted music, see TS-11 in `references/models/seedance/troubleshooting.md`; the documented workaround is not a guarantee.

## Seedance 2.5 flagship audio controls

The flagship profile documents native synchronized audio and `generate_audio` true by default; `false` requests silent output. The interface may use different labels. Its tutorial lists Chinese, English, Spanish, Indonesian, Malay, Thai, Arabic, Portuguese, Vietnamese, Japanese and Korean. State the spoken language, preserve the user's exact dialogue and follow the selected profile's syntax; markup recommendations differ between vendor pages. These documented flagship details do not establish Flash support, supported languages, API flags or default behavior. See G7 and G11 in the registry, the model profile and `syntax.md`.
