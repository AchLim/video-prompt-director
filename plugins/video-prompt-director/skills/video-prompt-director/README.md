# video-prompt-director (skill folder)

This folder is a complete Agent Skill. Compatible agents use `SKILL.md` and load supporting files as needed.

- `SKILL.md`: the storyboard-first workflow, craft rules, output format, and a map of the other files.
- `references/`: storyboards, cinematography, performance and dialogue, physical realism, continuity, and the prompt quality checklist.
- `references/models/`: one file per video model (Veo and Flow, Runway, Kling, other) with official sources and verification dates, a router and a folder for Seedance (a capability registry, a profile per version, syntax, troubleshooting and a test log), and a file for the user's platform limits. A fact without a source, a date and a provenance tag does not belong there.
- `examples/`: weak versus strong prompts for natural movement, emotional acting, dialogue and multi-character scenes.

The skill is primarily Markdown. The prompt-counting script is optional.

To install by hand, copy this whole folder to the host skill directory: for Codex, `~/.agents/skills/video-prompt-director/` (all projects) or `<project>/.agents/skills/video-prompt-director/` (one project); for Claude Code, `~/.claude/skills/video-prompt-director/` or `<project>/.claude/skills/video-prompt-director/`. `VERSION` names the release this folder came from.
