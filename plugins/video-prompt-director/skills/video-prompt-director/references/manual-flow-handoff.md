# Manual Flow handoff: generate in Google Flow by hand, then bring the clips back

Contents:
1. When to use this
2. The loop
3. The handoff card
4. Matching downloads to shots
5. Checking a downloaded clip
6. Chaining shots
7. When a clip fails
8. What to record when uploading to your system

## 1. When to use this

Use it when the user generates clips in Google Flow by hand instead of through an API: copy a prompt into Flow, attach images, generate, download the clip, and upload it into their own editor, pipeline or project system. The skill does not drive Flow. It prepares a package the user can paste without thinking, and a way to match and judge the clips that come back.

Flow's models, modes and limits change. The Flow facts in `references/models/veo.md` were checked on 2026-11-11 and name these modes: text to video, frames to video (first frame, or first and last frame), ingredients (reference images) to video, and video to video; Flow's button names may differ. Ask the user which model and mode their Flow account shows before assigning one to a shot.

## 2. The loop

1. Storyboard approved (`references/storyboard.md`).
2. For each panel, produce a **handoff card** (section 3) with the prompt and everything the user needs in Flow.
3. The user generates in Flow, picks a take and downloads it.
4. The user names the file by the shot ID (section 4), checks it (section 5), and uploads it to their system.
5. For the next shot, carry the ending state forward (section 6). If a clip fails, fix the prompt (section 7) and regenerate.

## 3. The handoff card

One card per shot. It is a message to the user, so the prompt line is the only part to paste into Flow.

```
Shot S03   file name: S03_take1.mp4   (rename downloads to this)
Flow model and mode: <as the user's Flow shows; e.g. Ingredients to video>
Length: 6 s    Aspect ratio: 9:16
Attach: image A (Mira's face and hair), image B (green coat), image C (kitchen)
Roles: A = identity, B = wardrobe, C = location and window position
Prompt:
  <one self-contained paragraph, ready to paste>
Audio: <on/off, and what to exclude>, per the user's choice
Check after download: <the 3 to 5 things most likely to be wrong in this shot>
Starts from: <state the previous shot ended in>
Ends on: <state the next shot starts from>
```

Rules:
- Use only the length, aspect ratio and attachment count the chosen Flow model documents (`references/models/veo.md`). If the user's account shows something different, the account wins; ask them to tell you.
- Number attachments in the order the user will upload them, and say what each one controls. Keep each image's role separate (`references/continuity.md`).
- Put the exclusions from `references/constraints.md` inside the prompt, since Flow's Omni models document no negative-prompt field.
- Keep the whole pack short. Do not repeat the same constraint in the card and in the prompt.

## 4. Matching downloads to shots

Downloads often arrive with generic names. Agree a naming scheme before the first shot and keep it. A simple one: `<episode>_<shot ID>_take<n>.mp4`, for example `E04_S03_take2.mp4`. Give the user the file name for every shot on its card. A shot keeps its ID through every regeneration, and only the take number changes.

## 5. Checking a downloaded clip

Watch each clip once through before uploading it, against the card's "Check after download" list and these common problems:

- Text, subtitles, logos or watermarks anywhere in the frame (`references/constraints.md` section 3). Flow may add its own watermark depending on the account and model; check the output.
- Wardrobe, face or hair drifting from the reference.
- An extra person, or a missing one.
- A cut inside a clip that should be continuous.
- Music or sound the user did not ask for.
- Mouths moving for someone who is not speaking, or dialogue that is not the exact line.
- Start state does not match the previous shot's end state, or end state does not match the next shot's start.
- The action ends too early or runs past the clip.

A clip that fails any blocking item gets another take, not an upload.

## 6. Chaining shots

Two ways to make the next shot start where the last ended:

- **Describe the state.** The next card's "Starts from" line repeats the final positions, props and light (`references/continuity.md`).
- **Use a frame from the downloaded clip.** If the user's Flow mode offers frames to video, they can export the last good frame of the finished clip and attach it as the first frame of the next. This is a technique to try, not a documented guarantee: the identity and wardrobe still need the references, and the result should be checked like any other clip. Ask the user to confirm that their Flow mode supports it before relying on it.

## 7. When a clip fails

1. Name the failure in one line (extra person, text on a sign, wardrobe change, frozen background).
2. Find the cause in the prompt: a missing constraint, an overloaded action, a contradiction, an unclear reference role.
3. Fix the prompt (remove or clarify before adding), re-run the checklist in `references/prompt-quality.md`, and give the user a new card with the same shot ID and the next take number.
4. If the same failure repeats three times, change the staging instead of adding more words (`references/physical-realism.md` section 5).

## 8. What to record when uploading to your system

Whatever the user's system stores, give them one line per clip they can paste or file: shot ID, take number, source (Flow, the model name), length, the prompt version used, whether this take is the selected one, and a note on any defect that was accepted. Keep the prompt text with the clip so a later fix starts from what was actually used. Do not invent fields the user's system does not have; ask what it stores.
