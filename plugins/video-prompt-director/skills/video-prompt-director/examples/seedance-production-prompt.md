# Seedance production prompt: a realistic clip

The production template (`references/models/seedance/production-template.md`) in a realistic look. Original characters and story. Apply the target model's syntax and limits from `references/models/` before use.

The scene: a night pharmacist realizes the customer at the counter is looking for something other than medicine. 15 s, 6 cuts, two spoken lines.

```
[No BGM] A live-action drama scene shot like a modern cinematic series. Natural color, soft practical light, believable skin texture, stable faces, hair and wardrobe. Keep the face, build, hairstyle and wardrobe of each reference exactly. The number of people and the shape of the props do not change partway through. People move, look and breathe like real people. The camera uses only the moves the scene specifies. Do not generate subtitles, on-screen text or watermarks.
Total 15s · 9:16 · 6-cut multi-shot · real time · no slow motion, no fades
Reference
Character : @Noor: face, wardrobe and build match 100%. @Noor's voice is @Noor_Voice.
Character : @Ellis: face, wardrobe and build match 100%. @Ellis's voice is @Ellis_Voice.
Background : @Pharmacy: inherit only the space, materials, lighting and mood; do not inherit composition, angle or color.
Timeline
[0-2s] Locked-off wide shot of @Pharmacy at night. @Noor, in a white coat, stands behind the counter. @Ellis, in a dark raincoat, stands in front of it with wet hair. The camera does not move. 〈Rain on the window, a fridge hum〉 No dialogue.
[2-5s] Medium close-up of @Ellis. He looks at the shelves, then at @Noor. He says in English in @Ellis_Voice's voice, low and careful: {Do you sell anything for a long night?} One second of silence after the line. Only @Ellis speaks; @Noor does not move her mouth.
[5-7s] Close-up of @Noor. She studies his face and glances at his raincoat pocket. Her expression stays professional. No dialogue.
[7-9s] Close-up of @Ellis's right hand on the counter. His fingers tap once and stop. What he rests on the counter is a folded paper, not a weapon. 〈One soft tap〉 No dialogue.
[9-12s] Over-the-shoulder shot past @Ellis at @Noor. She says in English in @Noor_Voice's voice, evenly: {Tell me what you need, and I'll tell you if I can help.} One second of silence after the line. Only @Noor speaks; @Ellis does not move his mouth.
[12-15s] Medium shot of @Ellis from the front. He lifts the folded paper a little and slides it across the counter toward @Noor. He ends with his hand open on the counter. Hold the last second. No dialogue.
Constraints
Only the lines inside { } in the timeline are spoken: exactly 2 of them; nobody else says anything. Leave one second of silence after each line. Environmental SFX only. No music. No subtitles. No on-screen text. No watermark. One lens per cut, one action per beat. Face, wardrobe and style are identical across every cut. The face matches the reference exactly at any distance.
Style (unchanged every time)
Style: Natural cinematic realism, soft practical light, believable skin and fabric, stable faces.
Continuity: Characters, props, environment identical across every cut. No identity drift.
Audio: Environmental SFX only. No music. No subtitles.
```

## Why it is built this way

- The header says 6 cuts and 15 s, and the timeline has 6 windows ending at 15 s.
- Both speakers have a voice tag; the Constraints name the count (2) and the shots name the only speaker.
- The paper is "a folded paper, not a weapon" so the prop is not invented as something else.
- The last shot ends on a stated pose with a held second, so the clip has a clean ending.
- The scene is one generation. If shot 4 fails twice, give it its own clip and begin the next on the closing beat.
