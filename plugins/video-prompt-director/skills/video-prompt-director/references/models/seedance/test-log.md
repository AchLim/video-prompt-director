# Seedance test log

The record of real generations. A feature, setting or fix is **TESTED** only when an entry here shows a successful generation with the model, platform, settings and date written down. A vendor example, a plausible guess or a one-off impression is not a test. A passing result applies to that model, platform and those settings only; it does not carry to another model version.

The `TESTED` tag in `capability-registry.md` and the profiles is valid only if a matching entry exists for the same registry ID and the same model (a flagship result does not make a Flash row TESTED). The repository's `scripts/check_registry.py` (not shipped with the installed skill) checks this; without it, check by hand.

## What to log

| Field | Meaning |
|---|---|
| Entry | `T-001`, `T-002`, ... in order; never reused |
| Date | The date the generation ran |
| Registry ID | The capability under test, for example `G3` |
| Model | Exactly as the interface names it (for example Seedance 2.5 Flash) |
| Platform | The interface, and the region if there is one |
| Settings | Ratio, duration, resolution, audio on or off, output format, task type, and the interface's own names for them |
| Inputs | Asset counts and roles, and the binding syntax used |
| Result | `PASS`, `FAIL` or `PARTIAL`, with one line saying what was or was not seen |
| Notes | Anything that would change the next attempt |

A `PASS` means the feature did what the registry row says on that run. A `FAIL` is as valuable as a `PASS`: it tells the next reader where not to spend a paid generation.

## Suggested first tests (Flash)

Each is one short clip at the lowest resolution Flash offers, with the smallest asset set that exercises the feature.

| Test | Registry ID | What it answers |
|---|---|---|
| Reference binding form (`Image 1` against `@Image1`) | P1 | Which form the interface accepts |
| First frame | G2 | Whether it works, and whether the ratio follows the image |
| First and last frame | G3 | Whether it works on Flash |
| Audio reference as a voice | R3 | Whether a supplied voice is used, and how closely |
| Supplied dialogue with lip-sync | R4 | Whether a recorded line is spoken as written (the skill treats this as OBSERVED until tested) |
| Timestamps | P2 | Whether integer-second timestamps are followed |
| Edit | E1 | Whether editing exists on Flash, and the output length against the source |
| Extension | X1 | Whether extension exists on Flash |
| A fictional AI-generated face | P4 | Whether it is accepted as a reference |
| Prompt just over the interface limit | P6 | How the interface treats an over-limit prompt |

## Log

No generations have been recorded yet. Add entries below this line, oldest first.

| Entry | Date | Registry ID | Model | Platform | Settings | Inputs | Result | Notes |
|---|---|---|---|---|---|---|---|---|
