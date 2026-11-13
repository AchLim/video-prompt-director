# Editing, extension and assembly

Start with the source and the desired final state. Identify the requested operation, time span, target, assets, model, interface, output settings and what must stay unchanged. Distinguish editing an existing source from generating a new reference-based interpretation: the two can have different duration, ratio and fidelity controls. Consult the model profile for supported operations and classify undocumented combinations as UNVERIFIED.

## Operation plan

1. List the source videos, images and audio, their roles and the exact requested changes.
2. Choose a documented task and its input roles; identify any locked duration or aspect ratio. Do not assume reference mode and edit mode preserve the same things.
3. Describe the old state, new state, spatial and temporal scope, and preservation requirements. Separate audio from picture. Preserve supplied final recordings in post unless exact passthrough is documented.
4. For changes that cannot be combined, plan separate passes and review the intermediate result. When exact text, lip-sync, timing or asset fidelity matters, consider post-production.
5. Validate the output against the intended target and every unrelated element the user wanted preserved. Check source length, aspect ratio, faces, motion, camera, lighting, audio, boundaries and joins. A preserve instruction is not a guarantee.

For forward or backward extension, describe the boundary state and the new action without replaying existing footage. For transitions, retain both source clips and describe only the missing middle. For one-click assembly, identify the asset order and intended pacing; do not assume one operation can preserve every detail. A long sequence can be assembled from independently generated or connected clips in an editor.

For Seedance, `references/models/seedance/recipes-editing.md` and `references/models/seedance/recipes-assembly.md` contain version-aware operations and fallbacks. If the interface differs from documented API controls, record the interface-specific facts separately. Maintain the source files and outputs the user needs for revision.
