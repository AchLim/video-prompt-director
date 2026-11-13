# Seedance extension, transition and assembly operations

These templates are skill-authored and untested. Use the registry, the version's profile and the actual interface. Exact continuity, identity, timing and sound preservation are goals to verify, not guarantees. Flash extension, transition, one-click and combined-task details are UNVERIFIED.

## Extensions

| IDs | Operation | Plan and check |
|---|---|---|
| X1 | Extend forward | Bind `Video 1` as the source, state the ending pose, props, camera and audio, then describe only the new action. Flagship Extend uses `ratio: adaptive`; check the profile for input/output restrictions and the documented MOV example. |
| X2 | Extend backward | Bind `Video 1`, describe the earlier action and a transition that arrives at the original opening state. Do not replay the source. Check task classification and version. |
| X3 | Extend with a subject image | Bind `Video 1` as source and `Image 1` as the named subject; preserve existing identities and describe the new appearance or action. The combination is documented in flagship task guidance; Flash is UNVERIFIED. |
| X4 | Multiple rounds | Extend one round at a time, review every join, carry identity/wardrobe/props/light and audio, and keep earlier versions. Multiple rounds are listed for flagship; cumulative drift and audio changes remain possible. |
| C7 | White-model conversion workaround | The 2.0 FAQ proposes converting a source video to a white model before repeated extension to reduce degradation. It is 2.0-specific evidence, not a proven 2.5 or Flash fix. |
| G10 | Last-frame chaining | Where the API supports it, retrieve the prior generation's last frame and use it as the next opening image. A frame is an asset, not an automatic seamless transition. |

Example extension direction: `Extend Video 1 forward. Continue from its final pose and camera position. Mira lowers the envelope and turns toward the door; preserve her identity, wardrobe, room, light and sound perspective. Do not replay prior action.`

## Transition and one-click assembly

| IDs | Operation | Plan and check |
|---|---|---|
| X5 | Transition between clips | Supply `Video 1` and `Video 2`, describe the missing middle from the first ending to the second opening, and request preservation of both originals. Flagship example documents the approach; result may need editing or regeneration. |
| X6 | One-click creation from images | Supply the ordered or explicitly identified images, desired story, pacing and audio. The flagship example uses eight images; the count is an example, not a maximum. Inspect composition, transitions and asset integrity. |
| X7 | One-click from videos | Listed for flagship without a worked example. Bind each clip's intended role; mark the exact recipe skill-authored and untested. |
| X8 | Combined multimodal workflow | Decompose the request into operations and an asset-role manifest; check locked/unlocked compatibility and asset budgets before combining. If unsupported or unverified, split into passes or finish in post. |
| X9 | 2.0 track completion | The 2.0 guide describes up to three source clips totaling at most 15 seconds, trimming connecting frames. Do not apply those limits or claim this operation for 2.5 or Flash. |

For every join, record original media, output duration, ending/opening states, camera direction, prop state and audio policy. Ask whether the sequence is meant to connect directly; a time jump need not match the previous frame. For a long production, assemble multiple approved clips in an editor rather than assuming a single request must contain the whole scene.
