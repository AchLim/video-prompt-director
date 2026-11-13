# Reference direction and composition

Use the fewest references that serve a distinct production role. Before writing a prompt, list each asset in upload order, its subject or target, what it controls, what must not be copied, and which generation uses it. Count sheets and keyframes as images. Check the model and interface for count, format, size, duration, face and task-role constraints; an undocumented combination is UNVERIFIED, not unsupported.

| Role | State the intended contribution | Keep separate |
|---|---|---|
| Subject image or video | Identity, appearance or wardrobe of the named subject | Other subjects, unrelated action and camera |
| Motion or expression | Which performer and action or expression to follow | Identity and background, unless intentionally shared |
| Camera | Which video supplies camera path, framing or movement | Performer motion and visual style |
| Style | Which image or video supplies light, color, texture or visual treatment | Character identity and scene events |
| Audio | Which subject's voice or what music/sound qualities it references | Exact playback and lip-sync, unless explicitly documented |
| Scene | Which reference establishes geography, layout and light | Actors' identity and actions |
| Clay/white model | Which blocking, movement, shot rhythm and camera paths it guides | Coarse proxy appearance; supply final subjects and look separately only when the combination is documented |

A binding example, not a compatibility guarantee: `Image 1: Mira's identity and wardrobe; Video 1: Mira's movement only; Video 2: camera path only; Audio 1: Mira's voice timbre only; Image 2: location layout.` If a model does not document this combination, label it UNVERIFIED and offer a smaller test, sequential passes or post-production.

If strict `first_frame` or `last_frame` roles conflict with omni references in the chosen model, choose between exact frame control and the other references, or use a documented reference-image workaround with inexact alignment. Do not claim a keyframe locks the output. Follow the version-specific registry and `recipes-reference.md` for Seedance.
