# Changelog

All notable changes to this project are documented here. The project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Storyboard and mapping: `references/storyboard.md` now plans by mode (Quick 3 to 5 panels, Production 6 to 12, Cinematic 12 to 15 per sheet, recommended automatically and overridable), with a 13-field panel specification, visual-beat and coverage planning, action decomposition, dialogue coverage, and a panel-to-generation mapping with four types (independent clip, shots inside one generation, keyframe, post-production). Panel counts and the two-second shot heuristic are recommendations and an OBSERVED heuristic, never limits.
- `references/storyboard-images.md`: tool-independent image prompts made from the one approved plan: a production storyboard sheet, a simple line-art reference sheet for a video model, and independent keyframe images, with layout rules (3 by 3 default, 9:16 panels, more sheets rather than smaller panels), no text inside images, and a continuity header per sheet.
- `references/models/seedance/recipes-generation.md`: Seedance recipe cards for storyboard reference (G5), storyboard plus subject references (G6), keyframes (G4) and the 2.0-only sequence reference (R15), each with the 12 fields, an operation spec and an original example. `examples/storyboard-to-mapping.md` plans one scene from script to mapping, sheet prompts and a keyframe prompt.
- Cinematography: shot purposes and coverage, and dialogue coverage (`references/cinematography.md` sections 10 and 11); action decomposition in `references/physical-realism.md` section 6. The boundary between `cinematography.md` (shot design) and `camera-language.md` (camera mechanics) is stated in both.
- Seven storyboard evals (25 to 31): production mapping, a Quick scene, action decomposition, dialogue coverage, mapping types, a long sequence split into sheets, and sheet and keyframe image prompts.
- Seedance capability registry (`references/models/seedance/capability-registry.md`): 82 capabilities the official documentation names (generation, reference-to-video, 3D clay-model workflows, video and audio editing, extension and assembly, platform and API), each with its official coverage, its status per version (2.5, 2.5 Flash, 2.0 series) and its source. Features that the documentation lists without an example stay in the registry with their true status. Thirteen documentation discrepancies are recorded and left UNVERIFIED.
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
