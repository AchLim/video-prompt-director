# Video Prompt Director

A Claude plugin by akoru containing the **video-prompt-director** skill.

## video-prompt-director

video-prompt-director helps Claude turn scripts and approved storyboards into AI video generation prompts, the way a director would brief a camera and a cast.

- Break a script or scene into storyboard panels and wait for your approval, or start from a storyboard you already have.
- Turn each approved panel into a self-contained prompt with camera direction, timed action, natural acting, exact dialogue and an ending state.
- Keep identity, wardrobe, props, positions and light consistent from shot to shot, with a continuity ledger.
- Repair prompts that produce frozen, stiff or inconsistent footage, and adapt a prompt to another model.
- Check every prompt before you see it. Model files for Seedance, Veo and Flow, and Runway give sourced, dated facts, and the skill does not invent model limits.

Install it in Claude Code with:

```text
/plugin install video-prompt-director --marketplace AchLim/video-prompt-director
```

Claude uses the skill on its own when you ask for video prompts or storyboards. You can also call it directly as `/video-prompt-director:video-prompt-director`.

## What the plugin contains

Only the skill: Markdown guidance, model files and worked examples. The plugin has no scripts, hooks, MCP servers or agents, makes no network requests, and collects no data.

## More

Documentation, the changelog and the issue tracker are at [github.com/AchLim/video-prompt-director](https://github.com/AchLim/video-prompt-director). License: MIT.
