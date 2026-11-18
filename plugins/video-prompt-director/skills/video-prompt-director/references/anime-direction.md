# Anime direction (style mode)

A style mode of the director, not a separate model or workflow. Every other rule in `SKILL.md` still applies: plan first, timed beats, one actor and one action per window, exact dialogue, continuity, the model's own limits. This file changes the look, the motion language and the wording. The rules are working practice from production use. They are refined by tested results; record those in `references/models/seedance/test-log.md`. Do not state a Seedance capability or limit from this file; those live in `references/models/`.

## 1. Choosing the mode

Ask once, before writing, unless the user already said: **realistic live-action look, or anime?** Offer it as a choice, not a quiz. If the brief says "anime", "cel-shaded", "2D animation" or names a 2D look, take anime and state the assumption. If the brief is photographic, take realistic and do not mention this file.

Within anime, settle the sub-look in one question when it changes the result, otherwise state an assumption the user can veto:

| Sub-look | Traits to write |
|---|---|
| Modern TV action | clean thin outlines, crisp cel shading with hard shadow shapes, saturated accent colors, bright specular glints in the eyes |
| Soft slice-of-life or fantasy | pastel palette, painted watercolor-like backgrounds, soft gradients in the sky, gentle rim light, thin outlines in a darker tone of the fill |
| Dark seinen or thriller | desaturated palette, heavy blacks, hatched shadows, sodium or neon accents, muted skin tones |
| Retro 90s cel | slight grain, softer edges, limited palette, matte painted backgrounds, a subtle film-scan texture |

Describe traits, never studio names, series titles or real artists (`references/constraints.md` section 12). Characters are original.

## 2. The anime project look (write once, repeat in every prompt)

One sentence, reused word for word, in the global layer of a direction plan: the medium, the line, the shading, the palette, the background treatment and the frame rate feel.

> 2D hand-drawn anime look: thin dark-tone outlines of steady weight, flat cel-shaded color with one hard-edged shadow tone per surface, painted background with soft gradients, saturated but harmonized palette, animated on twos (a slightly stepped, hand-drawn rhythm).

Rules:
- Do not mix photographic words into an anime prompt: no lens in millimeters, film grain, skin pores, subsurface scattering or "photorealistic". Depth of field becomes "background softly painted out of focus" and light becomes "a hard-edged rim light".
- Do not mix anime words into a realistic prompt. Keep the modes apart.
- In anime mode you may name the medium ("anime look") because it is the wanted look. In realistic mode, still never name anime to exclude it (`references/constraints.md` section 12).

## 3. Characters: stable design

Anime character drift is faces going "off-model" (eyes change size, hair partings move, outline weight shifts). Counter it:

- Describe each character as a **design**: hair shape and color (and how it moves), eye color and shape, outfit with its main color blocks, one or two signature marks (a scar, a hairpin, a ribbon). Reuse the identical wording every shot.
- Prefer a **character reference sheet** (front, three-quarter, back) as the identity reference, in the same art style as the project look. Bind it by role, per the model's reference syntax (`references/reference-direction.md`).
- Keep face proportion stable: say "same face design as the reference, eyes the same size and spacing" when two shots must match. Tell the model what stays fixed, not what to avoid.
- Large expressive eyes and small mouths mean mouth shapes are simple. Dialogue is carried by open, half-open and closed mouth shapes plus eye and brow changes. Do not direct realistic lip detail.

## 4. Motion language

Anime reads differently from live action: held frames, accents and economy are style, not defects.

- **Holds.** A character can hold a pose while hair, cloth, breath or the background moves. Specify the hold and what still moves: "she holds still, hair and ribbon lift in the wind".
- **Accents.** One impact beat per action: a pose snaps, a smear or speed-line frame for a fast strike, a brief held pose after it. Keep it to one accent per beat.
- **Secondary motion.** Hair, scarves, sleeves, falling petals, dust and steam are the cheapest way to make a still figure feel alive. Name the direction and speed.
- **Walk and run.** Simple and rhythmic. Keep a character's action count low; fast multi-limb choreography warps (`references/physical-realism.md`).
- **Action scenes.** Break them into short beats with a clear pose at the end of each. Prefer a strike, a block and a reaction across a cut to a ten-hit exchange in one clip.
- **Dramatic stillness.** A held close-up with an eye glint, wind in hair and a slow push is a standard anime beat and a safe one for the model.

## 5. Camera

Use the same discipline as live action (`references/camera-language.md`): one move per cut, subject and camera independent, a stated start and end.

Anime vocabulary that helps:
- **Pan across a painted background** or a slow parallax move (foreground, midground and background shifting at different speeds) for establishing shots.
- **Hold-and-push** on the face for the emotional beat.
- **Low-angle hero shot** and **high-angle wide** for scale in action.
- **Impact framing**: a brief tilted or off-axis frame on the strike, then back to level. One per sequence, motivated by the action.
- **Over-the-shoulder** and **reverse shots** for dialogue, on the same side of the line.

The default "no zoom or dissolve at a cut" still holds; a stylized speed-zoom is an explicit, single, named choice and is not a default.

## 6. Light, color and environment

- Light is **graphic**: a hard-edged shadow shape, a single rim light, a sky gradient, a lens-flare-like glow only if the look wants it. State the light's direction and color once per location.
- Time of day through palette: golden-hour orange with long soft shadows; blue-hour cool with warm window glow; night with a saturated moon rim and neon accents.
- Backgrounds are **painted**: name the place, the main shapes and the palette, and say it stays still and consistent while the character acts.
- Weather and particles (rain, petals, snow, sparks, cloud shadows) add life without body motion. Name the direction and density.

## 7. Dialogue and audio

- Dialogue is exact, in its original language. Japanese, English and other languages are all valid; ask which is spoken, and keep supplied lines unchanged.
- Keep mouth action simple and timed to the line. Listeners react with eyes, brows and small head movement while another speaks.
- Anime sound language: a distinct sound for each impact or whoosh, ambient room tone and wind, silence for emphasis. Score defaults to none unless wanted (`references/audio-direction.md`).
- On-screen text and subtitles stay off by default (`references/constraints.md`).

## 8. Constraint wording in anime mode

Say the medium once as the wanted look, then list only concrete faults:

> Style: High-quality 2D cel animation, clean linework, flat cel shading, not a 3D render. Lines and cel shading stay clean, no jitter or flicker. The face matches the reference exactly at any distance. No subtitles, on-screen text or watermark.

## 9. Production template (Seedance, multi-cut clip)

The multi-cut layout, the checks, the dialogue formats, the techniques, the failure-to-fix table, retakes and chaining are not anime-specific and live in `references/models/seedance/production-template.md`. Load it for any Seedance scene written as one prompt. In anime mode, fill it with:

- **Style paragraph:** "A scene from a modern Japanese fantasy comedy anime. Clean 2D cel animation. Thin, smooth outlines, flat even color fills, clear cel shading. Crisp linework with no texture noise, blotches or stray patterning. Keep the face, eye shape, build, hairstyle and costume structure of the attached character model sheet. Do not put the model sheet itself on screen, make one finished scene in which that character appears." Change the genre words to the project's.
- **Footer style line:** "High-quality 2D cel animation, clean linework, flat cel shading, not a 3D render."
- **Anime-specific exclusions where the genre drifts:** "no blush", "no super-deformed drawing" in a beat that should stay dry; for a super-deformed gag, name the switch in and "returns to the cel animation form".
- **Anime beats:** holds, accents and secondary motion (section 4); graphic light and painted backgrounds (section 6).

## 10. Compiled prompt order for an anime shot

For a single shot or a direction-plan compile, follow the usual order (`references/director-layers.md`), with these style specifics:

1. The anime project look (section 2), verbatim.
2. Character designs in frame (section 3), verbatim.
3. Environment and light (section 6).
4. Camera: size, angle, one move.
5. Timed beats with holds and accents (section 4).
6. Lines and sounds (section 7).
7. Closing hold and constraints (section 8).

See `examples/anime-vs-realistic.md` for one beat written both ways and `examples/anime-production-prompt.md` for a full multi-cut clip (`examples/seedance-production-prompt.md` is the same template in a realistic look).

## 11. Recording what works

When a generation succeeds or fails in anime mode, record it in `references/models/seedance/test-log.md` (version, interface, the look sentence, the result) so wording can be confirmed or dropped.
