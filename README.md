<div align="center">

# video-prompt-director

### A Claude Code skill that turns scripts and approved storyboards into AI video prompts a model can perform.

Camera direction, timed action, natural acting, exact dialogue, continuity between shots, and a quality check before each prompt reaches you.

[![MIT license](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-d97757?style=flat-square)](#install)

**[Install](#install) · [What it does](#what-it-does) · [Before and after](#before-and-after) · [Models](#models) · [FAQ](#faq)**

</div>

---

## What it does

Ask Claude for video prompts and video-prompt-director works the way a director would: storyboard first, then one prompt per approved panel, each with a beginning, a development and an ending.

- **Storyboard first.** Give it a script, a scene, a shot list or an existing storyboard. If there is no approved storyboard it proposes panels and waits for your changes before it writes prompts.
- **Prompts that direct a performance.** Camera and subject movement are described separately. Emotion is written as visible behavior, so people do not freeze, stare or smile through a scene.
- **Exact dialogue.** Your lines stay word for word, attributed to the right speaker, with the listener reacting.
- **Continuity across shots.** Identity, wardrobe, props, positions, light and screen direction carry from shot to shot, with a ledger when you want to check it.
- **A check before you see anything.** Every prompt is validated for action, progression, plausibility, contradictions and fit with the target model, then fixed.
- **A quantified camera.** Lens and depth of field, angle, composition, one slow move chosen for a story reason, and stated stability, so the model does not guess.
- **Rules out what models add on their own.** No generated text, subtitles, logos or music unless you ask, no extra people, no cloned faces, no wardrobe drift.
- **Model files with sources and dates.** Seedance, Veo and Flow, and Runway each have a file that states what is documented, where, and when it was checked. Kling 4.0 and 3.0 are covered the same way. The skill does not invent model limits.

It does not generate video, and it does not change the code of the project you have open.

## Before and after

**Weak**
```
A woman stands in a living room looking sad.
```

**With the skill**
```
Medium shot, eye level, locked-off camera. A woman stands beside the living-room window, looking outside. She lowers her gaze and takes a restrained breath. Her right hand tightens around the curtain. After a pause she turns her head toward footsteps behind her, and her expression shifts from sadness to quiet apprehension. Natural breathing, small shoulder movement. She ends facing the doorway.
```

The first gives a video model a pose. The second gives it a performance with a start, a change and an end. More pairs are in [`examples/weak-vs-strong-prompts.md`](plugins/video-prompt-director/skills/video-prompt-director/examples/weak-vs-strong-prompts.md).

## Install

Pick one route. Installing the same skill twice gives Claude two copies with the same name.

### Claude Code plugin (recommended)

Inside Claude Code:

```text
/plugin marketplace add AchLim/video-prompt-director
/plugin install video-prompt-director@video-prompt-director
```

The skill is then available as `/video-prompt-director:video-prompt-director`, and Claude also picks it up when you ask for video prompts.

### The skills directory

```bash
npx skills add AchLim/video-prompt-director -a claude-code        # this project
npx skills add AchLim/video-prompt-director -a claude-code -g     # all your projects
```

### npm

```bash
npx @akoru/video-prompt-director install --global     # all your projects
npx @akoru/video-prompt-director install --project    # this project only
```

Or install the CLI once with `npm install -g @akoru/video-prompt-director` and run `video-prompt-director install --global`. The CLI checks for your own edits before it updates or removes anything, and backs them up first. Node.js 18.17 or newer.

### The single file

[`video-prompt-director.md`](video-prompt-director.md) holds the workflow and core rules in one file. Paste it into a chat or a project's instructions when you can't install a skill. It does not include the reference files, so model-specific facts are missing.

## Use it

| You want | Try |
|---|---|
| Panels from a script | "Here is my scene. Break it into storyboard panels for 6-second clips." |
| Prompts from a storyboard | "These panels are approved. Write the Seedance prompts." |
| One shot | "A woman reads a letter at a kitchen table, 6 seconds, Veo." |
| A dialogue scene | "Write the shot prompts for this exchange. Keep my lines exactly." |
| Repair | "This prompt gives me a frozen character. Fix it." |
| Another model | "Adapt shot 3 for Runway." |
| Continuity | "Check these five prompts for continuity and fix them." |

Give it your reference images and say what each one controls (face, wardrobe, location). It accepts existing scripts, storyboards and shot descriptions from any source.

## Models

| Model | Status | File |
|---|---|---|
| Seedance (BytePlus ModelArk) | Documented facts, sourced and dated | [`seedance.md`](plugins/video-prompt-director/skills/video-prompt-director/references/models/seedance.md) |
| Google Veo, Gemini Omni Flash, Flow | Documented facts, sourced and dated | [`veo.md`](plugins/video-prompt-director/skills/video-prompt-director/references/models/veo.md) |
| Runway | Documented API facts, sourced and dated | [`runway.md`](plugins/video-prompt-director/skills/video-prompt-director/references/models/runway.md) |
| Kling (4.0, 4.0 Flash, 3.0 text to video) | Documented facts, sourced and dated | [`kling.md`](plugins/video-prompt-director/skills/video-prompt-director/references/models/kling.md) |
| Anything else | Ask for current limits, write a model-neutral prompt | [`other.md`](plugins/video-prompt-director/skills/video-prompt-director/references/models/other.md) |

Video models change often. Each file carries the date its facts were checked, and the skill tells you when something is missing or old. Pricing is not recorded.

## Update

| Installed with | Update with |
|---|---|
| Plugin | `claude plugin marketplace update video-prompt-director`, then `claude plugin update video-prompt-director@video-prompt-director` |
| Skills directory | `npx skills update video-prompt-director` |
| npm | `npx @akoru/video-prompt-director@latest update --global` (or `--project`) |

Skills load when a session starts, so open a new Claude Code session after updating. To check your version, read the `VERSION` file in the installed skill folder.

## FAQ

**Does it make the video?**
No. It writes storyboards and prompts. You paste the prompts into your video tool.

**Does it need drama-writer?**
No. They are separate and independently installable. Use video-prompt-director with any script, from any source.

**Can I change the skill?**
Yes. Edit the files in the installed folder. If you installed with the npm CLI, `update` stops and lists your edits instead of overwriting them.

**Does it work in Claude.ai?**
Claude Code is the target for now. The npm CLI can build a ZIP for Claude.ai (`video-prompt-director export-zip`); that upload is a separate copy that never syncs with a Claude Code install.

## Project

- [ROADMAP.md](ROADMAP.md): where this is going
- [CHANGELOG.md](CHANGELOG.md): what changed in each release
- [CONTRIBUTING.md](CONTRIBUTING.md): how to propose a change
- [SECURITY.md](SECURITY.md): what the installer touches, and how to report a problem
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

Found a prompt the skill wrote badly, or a bug in the installer? [Open an issue](https://github.com/AchLim/video-prompt-director/issues).

## License

MIT: [LICENSE](LICENSE)
