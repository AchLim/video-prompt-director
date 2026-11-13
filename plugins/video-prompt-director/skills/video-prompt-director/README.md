# video-prompt-director (skill folder)

This folder is a complete Agent Skill. Claude reads `SKILL.md` first and loads the other files only when a task needs them.

- `SKILL.md`: the storyboard-first workflow, craft rules, output format, and a map of the other files.
- `references/`: storyboards, cinematography, performance and dialogue, physical realism, continuity, and the prompt quality checklist.
- `references/models/`: one file per video model (Veo and Flow, Runway, Kling, other) with official sources and verification dates, a router and a folder for Seedance (a capability registry, a profile per version, syntax, troubleshooting and a test log), and a file for the user's platform limits. A fact without a source, a date and a provenance tag does not belong there.
- `examples/`: weak versus strong prompts for natural movement, emotional acting, dialogue and multi-character scenes.

The skill is Markdown only. It contains no scripts.

To install by hand, copy this whole folder to `~/.claude/skills/video-prompt-director/` (all projects) or `<project>/.claude/skills/video-prompt-director/` (one project). `VERSION` names the release this folder came from.
