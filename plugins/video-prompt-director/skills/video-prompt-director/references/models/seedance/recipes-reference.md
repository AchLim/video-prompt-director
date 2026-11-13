# Seedance reference and clay operations

Skill-authored templates based on the capability registry, not successful model tests. First select the model, interface and task. The registry distinguishes official, partial, observed, heuristic, user-reported, unverified and tested evidence. All per-mode Flash support and combinations below are UNVERIFIED unless its profile says otherwise; do not call any subject-reference method a safe, working default on Flash; its asset counts are separate. Run only a short test at a duration accepted by the actual interface, or offer separate passes/post-production.

## Asset manifest and selection

For each asset give its upload number, role, target, what to take and what to ignore. Upload subjects in first-appearance order and explicitly bind each subject to its images and audio. Count all assets including keyframes and sheets. For flagship, `first_frame`/`last_frame` task roles cannot be mixed with omni references; see P1 and G3. First/last-frame alternatives, timestamp differences, face restrictions and unresolved documentation discrepancies are in the model profile and `syntax.md`.

| IDs | Operation | Prompt pattern | Scope and check |
|---|---|---|---|
| R1, R2 | Subject image or video | `Image 1 defines Mira's identity and wardrobe. Video 1 defines Daniel's appearance; do not copy its background or action.` | Bind each target separately; check face restrictions, accepted asset types and counts. R2 also lists voice; preserve exact recordings separately. |
| R3, R4 | Audio or image plus audio for a subject | `Image 1 is Mira. Audio 1 supplies Mira's voice timbre only.` | Flagship documents audio-only reference and image/audio binding. A voice reference is not a guaranteed exact soundtrack or lip-sync; Flash is UNVERIFIED. |
| R5 | Multi-view subject | `Images 1-3 show the same subject from different views; keep one identity.` | Flagship guidance supports multi-view for 1-5 subjects, with different guidance above that; 2.0 discourages turnaround sheets; Flash is UNVERIFIED. |
| R6 | Motion reference | `Follow the action in Video 1 for Mira's movement, not its actor or setting; preserve Mira from Image 1.` | Name performer and which action transfers. Confirm the version permits the requested combination. |
| R7 | Expression reference | `Use Video 1 as a reference for Mira's expression; retain her identity from Image 1.` | The 2.5 table lists expression but has no dedicated worked recipe. This example is skill-authored and untested; test or direct expression in text. |
| R8 | Camera movement | `Take the camera path from Video 2, not its subject or style; Video 1 supplies the action.` | Bind camera and subject motion independently and avoid conflicting camera commands. |
| R9 | Effects reference | `Follow the visual effect in Video 1 only; keep the subject and scene from their assigned references.` | 2.5 lists effects; the worked reference pattern is from the 2.0 guide. Do not imply the example was tested on 2.5 or Flash. |
| R10 | Creativity reference | No prescriptive recipe: the 2.5 table lists the term without defining it. | UNVERIFIED meaning. Ask what visual dimension the user wants and bind a documented role instead. |
| R11 | Style reference | `Use Image 1 for lighting, color and texture; Image 2 supplies subject identity.` | The table lists style; this exact skill-authored pattern is untested. Do not copy identity from the style reference. |
| R12 | Music, dialogue or voice reference | `Audio 1 supplies the requested music or voice quality; preserve the selected audio policy.` | The table lists music, melody, dialogue and timbre. No exact playback guarantee. Do not claim a dedicated music recipe exists. |
| R13 | Compound references | `Image 1 supplies the subject, Video 1 the action, Video 2 the camera, Audio 1 the voice timbre.` | A manifest is not proof that every combination is supported. Check task-role conflicts and version; Flash only lists multimodal references in general. |
| R14 | Brand-element image | `Use Image 1 as the supplied brand element in the described location.` | The example is from 2.0; 2.5 and Flash are UNVERIFIED. Use the user's authorized asset and review fidelity. |

## Clay and white-model references

| IDs | Operation | Prompt pattern | Scope and check |
|---|---|---|---|
| C1, C6 | Coarse proxy to final video | `Follow Video 1 for camera movement, blocking, motion paths and rhythm; do not copy its clay appearance. Render the described subjects and scene.` | Flagship 2.5 documented. Use simple clean proxy geometry. The reference gives planning information, not pixel-perfect motion. |
| C2 | Fine proxy rendering | `Render Video 1 as the described final look while retaining its shot and motion structure.` | Use a clean complete clay video; remove trajectory lines, coordinates and camera cones. Detailed guidance is limited. |
| C3 | Proxy plus characters | `Video 1 supplies blocking; map its first figure to the subject in Image 1 and its second figure to Image 2.` | Explicitly map each figure and identity. Verify face rules and counts. |
| C4 | Proxy plus scene only | No documented standalone recipe. | NOT-DOCUMENTED for flagship; UNVERIFIED for Flash. Offer a test or use the documented combined workflow only if the user also supplies character references. |
| C5 | Proxy plus characters and scene | `Video 1 supplies blocking and camera; Images 1-2 define the characters; Image 3 defines the location.` | The combination is listed for flagship; whether it works with every fine-grained proxy configuration is not separately established. The documented example has inconsistent numbering (DISC-09), so preserve explicit bindings and test. |

For every operation, separate desired output from the manifest, describe opening and ending states, and check the chosen audio mode. Retain evidence labels and do not mark TESTED without a successful model/interface entry in `test-log.md`.
