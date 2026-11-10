# video-prompt-director: Roadmap

## Where we are

**v0.1.0** is the first version, for Claude Code. It ships the skill (five workflows, six craft references, model files for Seedance, Veo and Flow, Runway, and Kling status), weak versus strong examples, and the same install routes as drama-writer.

## What's next

These are candidates, not promises.

- **Verify Kling.** Read the current Kling documentation in a browser and record sourced, dated facts in `references/models/kling.md`.
- **Re-verify the model files.** Video models change quickly. Each file names its verification date, and each release should re-check them.
- **More model files.** Other models, each with official sources and dates.
- **Real-use review.** Run the prompts in the target tools and record what changed in the footage, by model.
- **Image-to-video guidance.** More on describing motion from a reference frame.
- **Other agents.** Plugin manifests for agents beyond Claude Code, once the Claude Code version has settled.

## Not in scope

- Generating video, images or audio. This skill writes the prompts those tools take in.
- Writing the story. It works from a script you already have, from any source.
- A web app, dashboard or hosted service.
- Recording model pricing.
