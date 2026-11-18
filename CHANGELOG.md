# Changelog

All notable changes to this project are documented here. The project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Anime style mode: the skill now offers a choice between a realistic and an anime look before writing. `references/anime-direction.md` covers sub-looks, the project look sentence, stable character design, holds and accents, camera and light, dialogue, constraint wording and result logging; `examples/anime-vs-realistic.md` shows one beat both ways. Includes a Seedance multi-cut production template (header, references, timeline, dialogue formats, say-what-does-not-change, failure-to-fix table, retakes and chaining) and `examples/anime-production-prompt.md`.

## [0.4.0] - 2026-11-16

### Fixed
- Direction-plan output uses UTF-8 on Windows so compiled dialogue preserves its original punctuation.

### Added
- Layered direction (`references/director-layers.md`): global, scene, shot and continuity directors and a validator, with a JSON direction plan as the handoff format from a writer or pipeline, the derived state, and a fixed compiled prompt order in which each fact appears once.
- `scripts/direction_plan.py`: `validate` (impossible hands, finger work in mittens, rushed, overlapping or chained beats, props that appear from nowhere or float, held props left unstated, sounds without a cause or out of sync, lines that overrun or have no speaker in frame, zooms and conflicting camera instructions, over-the-shoulder shots that direct the hidden face, side flips, mixed or undeclared looks, model durations and image counts), `ledger` and `compile`.
- Action blocking (`references/action-blocking.md`): one actor, one action, one time window per beat; how long actions take; hands and objects; behaving like people rather than NPCs.
- The bakery benchmark: `examples/bakery-direction-plan.json` (six clips, validates clean) and `examples/layered-direction.md` (the original prompts, what the validator and a director's review found, and the compiled prompts).

### Changed
- A storyboard is optional. The principle is now "plan first, then prompts"; text-only generation is a complete path, and the planning gate asks for an approved plan (a timed shot list or a storyboard), never a storyboard image. Eval 01 follows; eval 16 covers a text-only clip.
- Continuity tracks what each hand holds (`references/continuity.md` section 13).

### Added
- Cinematic Bible (`references/cinematic-bible.md`): one film's look layered on the project look, with camera, lenses, image response, light, grade and design chosen separately, references translated into what a frame shows, light and grade per location, and one sent paragraph without equipment names.
- Director's breakdown (`references/director-breakdown.md`): per-scene objective, wants, information, landmarks, blocking, starting prop states and camera, light and edit intentions, decided before the storyboard; what the storyboard may not redecide.
- Storyboards in a staged production (`references/storyboard.md` section 15 and a Cut in field per panel): dialogue by line id, blocking from the breakdown, a reason for every cut, planned lip timing, and alternates for comparing structures on real generations. One dramatic beat per generation and the three-cut cap are labelled as rules under test.
- One derived continuity ledger (`references/continuity.md` section 7), and two suggested Seedance tests (structure, and dialogue route) in the test log.


### Changed
- OF 1.2 drama profile (`references/models/omni-flash-drama.md`): single-take camera choreography (new section 1.1). A take's camera budget is one path, either a single move or a motivated compound move (start on an insert of hands or an object, then tilt, pan or crane in one continuous constant-velocity path to a tight close-up of the eyes, with at most one rack focus), with the start framing, end framing and arrival second named. Consecutive takes vary shot size and angle (wide two-shot, low tabletop insert, over-the-shoulder close-up, tight close-up), never repeat size, angle and move, and use no more than two push-ins in a row. Takes open on a frame that already holds every face in them.
- OF 1.2 drama profile: storyboard first. Every take gets a photographic storyboard sheet (at least 3 full-colour photographs, 4 in a 2 × 2 grid by default) of the one continuous take at named seconds, made with an image model from the character master sheets and the previous take's storyboard, under 5,000 characters; the video prompt ties each panel to its second, states one smooth camera path between them, binds only the on-screen people (never an empty-set image) and mentions a start or end image only when one is passed. Takes open on a frame that holds every face in them.
- OF 1.2 drama profile: at most four 15 s takes per episode, every other take 10 s.
- OF 1.2 drama profile: a `Performance and delivery` block per take makes the emotion strong, specific and audible (very angry when angry, very happy when happy).
- OF 1.2 drama profile: inner voice-over and off-screen lines are labelled by the mouth that stays shut (`Off-screen voiceover (while June's mouth remains completely closed), ...`), never `CHARACTER (@tag) says:`, with "her lips never move" stated and the speaker left out of any appended voice list. Solo shots never name the off-screen person and carry `Solo shot only, no other people anywhere in frame.` The pre-return checklist gains items 10 to 12.

## [0.3.0] - 2026-11-14

### Added
- Gemini Omni Flash 1.2 (OF 1.2) low-motion drama profile (`references/models/omni-flash-drama.md`): stillness-versus-camera rules, four visual wrappers, 15 s continuous and 10 s first-and-last-frame take formats, speaker tags, tone and SFX inside the video prompt, the four-part beat output, and conversational edits (OFFICIAL via `previous_interaction_id` with stored state, regenerate fallback). API guardrails, verified by the user against Google's documentation: 3 to 15 s, a 3 to 10 s cap with two keyframes (an invalid-argument error above it), extension up to about 30 s, a 6-image slot map, reference-video limits (1 for 11 to 15 s, 3 for 3 to 10 s, new generations only, audio ignored), the exact sketch-guide sentence, and a 720p draft pass before a standalone upscale with its resolution ladder (720p to 1080p or 4K, 360p to 720p or 1080p, 24 fps). Also 9:16 default with aspect-ratio parity and a subtitle-safe bottom 25%, a locked 50 or 85 mm f/1.8 lens, stabilized-rig constant-velocity wording, a three-anchor environment lock, 180-degree eye-lines and micro-atmosphere cues. Prompt syntax and output hygiene: a verbatim single-shot lock (`in a single continuous shot, no scene cuts`), bracketed `[0-5s]` blocks (inside 10 s with two keyframes), the inline `No burned-in subtitles, no on-screen text` clause with quoted diegetic text and placement, one-change conversational edits ending `keep everything else the same`, and `no background music, ambient foley and dialogue only` by default. One new eval (55). New workflow G in `SKILL.md`, with cross-links from `veo.md`, `visual-direction.md` and `storyboard.md`.
- Codex installation guidance and a Codex evaluation backend, with host-separated results and preserved Claude baselines.
- Audio, multimodal reference and visual-direction workflows; version-aware Seedance generation, reference, clay, video/audio editing, extension and assembly recipes; and platform-operation guidance. Unverified features and documentation gaps remain visible.
- New behavior scenarios for mapping approval, keyframe assets, audio modes, reference binding, clay gaps, editing, extension and assembly.
- Storyboard and mapping: `references/storyboard.md` now plans by mode (Quick 3 to 5 panels, Production 6 to 12, Cinematic 12 to 15 per sheet, recommended automatically and overridable), with a 13-field panel specification, visual-beat and coverage planning, action decomposition, dialogue coverage, and a panel-to-generation mapping with four types (independent clip, shots inside one generation, keyframe, post-production). Panel counts and the two-second shot heuristic are recommendations and an OBSERVED heuristic, never limits.
- `references/storyboard-images.md`: tool-independent image prompts made from the one approved plan: a production storyboard sheet, a simple line-art reference sheet for a video model, and independent keyframe images, with layout rules (3 by 3 default, 9:16 panels, more sheets rather than smaller panels), no text inside images, and a continuity header per sheet.
- `references/models/seedance/recipes-generation.md`: Seedance recipe cards for storyboard reference (G5), storyboard plus subject references (G6), keyframes (G4) and the 2.0-only sequence reference (R15), each with the 12 fields, an operation spec and an original example. `examples/storyboard-to-mapping.md` plans one scene from script to mapping, sheet prompts and a keyframe prompt.
- Cinematography: shot purposes and coverage, and dialogue coverage (`references/cinematography.md` sections 10 and 11); action decomposition in `references/physical-realism.md` section 6. The boundary between `cinematography.md` (shot design) and `camera-language.md` (camera mechanics) is stated in both.
- Seven storyboard evals (25 to 31): production mapping, a Quick scene, action decomposition, dialogue coverage, mapping types, a long sequence split into sheets, and sheet and keyframe image prompts.
- Seedance capability registry (`references/models/seedance/capability-registry.md`): 82 tracked capabilities, including documented features and explicit documentation gaps (generation, reference-to-video, 3D clay-model workflows, video and audio editing, extension and assembly, platform and API), each with its official coverage, its status per version (2.5, 2.5 Flash, 2.0 series) and its source. Features that the documentation lists without an example stay in the registry with their true status. Thirteen documentation discrepancies are recorded and left UNVERIFIED.
- Separate Seedance profiles: `profile-2-5.md` (flagship parameters, task types, Draft mode, output specs, errors), `profile-2-5-flash.md` (provisional; what is official, user-reported or unverified, and a re-verification checklist) and `profile-legacy-2-0.md` (2.0, Fast and Mini).
- Seedance syntax (`syntax.md`) and a troubleshooting knowledge base (`troubleshooting.md`) covering the failure patterns the official guides document, with causes, official fixes and prompt patterns.
- Platform facts kept apart from model facts (`references/models/platforms.md`), and a test log (`references/models/seedance/test-log.md`) that is the only source of the TESTED tag.
- Provenance tags (OFFICIAL, USER-REPORTED, OBSERVED, HEURISTIC, TESTED, UNVERIFIED) in `references/models/other.md`.
- A reference loading matrix in `SKILL.md`, so a request opens only the files it needs.
- An optional registry validator (`scripts/check_registry.py`, Python standard library, `npm run check:registry`) with a test that breaks the registry on purpose.
- Nine evals for Seedance behavior (16 to 24): Flash limits, role exclusivity, edit duration, unwanted music, character swapping, aspect conversion, audio references, listed-only features, and a Flash variant of the panel-to-prompt scenario. Scenario 02 is kept unchanged as the baseline; scenario 24 is its updated variant and is marked as not comparable with the baseline.
- Evaluator: it removes the temporary projects it creates when a run ends (`--keep-projects` keeps them), so repeated runs no longer fill the disk. A `knowledge` check type (behavioral, independent of which tool the model used), a `--repeat N` option with a stability table, and `evals/README.md` explaining check types, baselines and how to read repeated runs.

### Changed
- `references/storyboard.md` no longer says one panel is one clip, and no longer says to keep panels brief; a panel is a shot or a beat that maps to a generation. Sections 1 to 7 keep their numbers because other files cite them. The `SKILL.md` principle now says each approved generation becomes one prompt.
- `references/models/seedance.md` is now a router to the version profiles. Its former facts moved into the profiles, retagged by provenance.
- The Seedance 2.5 Flash model is no longer assumed to share the flagship's limits.
- `SKILL.md` routes Seedance capability, limit and troubleshooting questions (workflow F) and carries a reference loading matrix. `when_to_use` mentions them, which only affects Claude Code, because the Claude.ai export drops that field.
- Eval scenario 12: the rubric separates Seedance 2.0 shot-based timing from 2.5 integer-second timestamps, and the camera-travel pattern accepts a camera that backs away in front of a walking subject.

### Fixed
- Removed stray contents lines left inside the body of `constraints.md`, `continuity.md`, `camera-language.md` and `performance.md`.
- The eval evaluator ignored a file read through a later Bash call after a `cd`, and a file that a `Grep` result surfaced, so correct answers were scored as failures. It now counts both.

## [0.2.0] - 2026-11-11

### Added
- Episode beats reference (`references/episode-beats.md`): a beat map for short dramas, the hook panel, the cold-viewer test, escalation, readable story-critical evidence, the cliffhanger panel, and checks before approval.
- Camera sections on where movement belongs across an episode, smooth moves, and smooth cuts and joins between clips (`references/camera-language.md` sections 12 to 14), and a continuity section on joining one clip to the next.
- Episode-flow checks 30 to 35 in the prompt quality checklist, and a hook-and-join example.

### Changed
- Locked-off is now the default for held dialogue only, not for the whole episode, and the cut counts observed in the pipeline are no longer presented as a target.

## [0.1.0] - 2026-11-11

### Added
- The `video-prompt-director` skill: workflows for storyboards, panel-to-prompt, prompt repair, model adaptation and multi-shot sequences, with a storyboard-first approval step.
- Reference guides for storyboards, cinematography, performance and dialogue, physical realism, continuity, and a prompt quality checklist.
- Model files for Seedance, Veo and Flow, and Runway with sourced facts and a verification date (2026-11-11), a Kling file (4.0, 4.0 Flash and 3.0 text to video) the same way, and rules for other models.
- Weak versus strong prompt examples for natural movement, emotional acting, dialogue and multi-character scenes.
- Prompt anatomy reference (`references/prompt-anatomy.md`) and a full example (`examples/production-prompt.md`): the sections a series-clip prompt contains, in order, with compact and full forms.
- Pacing reference (`references/pacing.md`): speech time against clip length, entry beats, reaction pauses, closing hold, ambience, actions and cuts per clip.
- Continuity rules for state changes with a cause, attaching only what is in the clip, and room maps with screen sides; the full recorded-dialogue rules and a silent lip-sync mode in constraints.
- Camera language reference (`references/camera-language.md`): quantified camera (lens and depth of field, angle, composition, eyeline, focus, blocking), one move per cut chosen for a story reason, stability and smoothness, coverage, and several cuts in one clip, with observed numbers from a production pipeline.
- Production constraints reference (`references/constraints.md`): no generated text, subtitles, logos or music by default, who is in frame, identity and wardrobe fidelity, no cloned faces, cuts, replayed actions, leaked instructions, and how to word them.
- Installer CLI, Claude Code plugin, single-file edition and Claude.ai ZIP export.
