# Anime production prompt: one complete clip

A full multi-cut anime clip in the production template (`references/anime-direction.md` section 9). Original characters and story. Apply the target model's syntax and limits from `references/models/` before use.

The scene: a courier witch arrives at a dark lighthouse and lights its lamp. 20 s, 8 cuts, three spoken lines (one is an inner voice).

```
[No BGM] A scene from a modern Japanese fantasy anime. Clean 2D cel animation. Thin, smooth outlines, flat even color fills, clear cel shading. Crisp linework with no texture noise, blotches or stray patterning. Keep the face, eye shape, build, hairstyle and costume structure of the attached character model sheet. Do not put the model sheet itself on screen — make one finished scene in which that character appears. The number of people and the shape of the props do not change partway through. Move the characters, their eye-line and the motion of their hair and clothes like real animation. The camera uses only the moves the scene specifies. Do not generate subtitles, on-screen text or watermarks.
Total 20s · 9:16 · 8-cut multi-shot · real time · no slow motion, no fades
Reference
Character : @Mio — face, wardrobe and build match 100%. @Mio's voice is @Mio_Voice.
Character : @Toma — face, wardrobe and build match 100%. @Toma's voice is @Toma_Voice.
Background : @Lighthouse — inherit only the space, materials, lighting and mood; do not inherit composition, angle or color.
Timeline
[0-2s] Locked-off wide shot of @Lighthouse on a cliff at dusk, the sea far below. The lamp at the top is dark. The camera does not move. 〈Waves, wind〉 No dialogue.
[2-4s] Medium shot of @Mio at the lighthouse door, a satchel over her left shoulder. She knocks twice with her right hand. 〈Knock, knock〉 No dialogue.
[4-6s] Medium close-up of @Toma opening the door. He looks at her without smiling. No dialogue.
[6-9s] Over-the-shoulder shot past @Mio at @Toma. He says in Japanese in @Toma_Voice's voice, tired and flat: {ランプは、もう点かないよ。} One second of silence after the line. Only @Toma speaks; @Mio does not move her mouth.
[9-12s] Close-up of @Mio. She lowers her eyes, then lifts them again, resolved. Her inner voice is heard in voice-over in @Mio_Voice's voice, in Japanese: {点けられる。たぶん。} She does not move her mouth to speak. Her face does not go red.
[12-14s] Close-up of @Mio's open right palm. A small star-shaped light, following @FX, rises above the centre of the palm and hovers. 〈Ting—〉 No dialogue.
[14-17s] Medium close-up of @Toma. His eyes widen and he pulls back slightly. He says in Japanese in @Toma_Voice's voice, quietly: {……君は、何者だ？} One second of silence after the line.
[17-20s] Low-angle wide shot from the foot of @Lighthouse, looking up. The lamp at the top lights and a beam sweeps out over the sea. Hold the last second on the beam. 〈A soft hum, then waves〉 No dialogue.
Constraints
Only the lines inside { } in the timeline are spoken — exactly 3 of them; nobody else says anything. Leave one second of silence after each line. Environmental SFX only. No music. No subtitles. No on-screen text. No watermark. One lens per cut, one action per beat. Face, wardrobe and style are identical across every cut. Lines and cel shading stay clean, no jitter or flicker. The face matches the reference exactly at any distance.
Style (unchanged every time)
Style: High-quality 2D cel animation — clean linework, flat cel shading, not a 3D render.
Continuity: Characters, props, environment identical across every cut. No identity drift.
Audio: Environmental SFX only. No music. No subtitles.
```

## Checks this clip passes

- The header says 8 cuts and 20 s; the timeline has 8 windows ending at 20 s.
- Both speakers have a voice tag; the count in Constraints (3) matches the `{ }` lines, inner voice included.
- Shot 4 names the only speaker. Shot 5 marks the inner voice and the closed mouth. Shot 5 also blocks the blush.
- Every window has one action. No cut is hidden inside a window, and held frames say the camera does not move.
- The last shot is wide and low enough to show the lamp lighting, so the payoff is in frame.

## If it fails

Change only the failed shot and say so. If shot 6 (the star light) keeps failing, move it to its own clip and begin the next clip on the closing beat of this one.
