#!/usr/bin/env python3
"""Validate the Seedance capability registry.

Standard library only. Optional: nothing else in the repository depends on it, and the
same checks can be done by hand (see "Manual check" in the registry file itself).

Usage:
    python3 scripts/check_registry.py
    python3 scripts/check_registry.py --registry PATH --skill-root PATH --scenarios PATH --phase N

Exit status is 0 when every check passes and 1 otherwise.
"""

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent
SKILL = REPO / "plugins" / "video-prompt-director" / "skills" / "video-prompt-director"
DEFAULT_REGISTRY = SKILL / "references" / "models" / "seedance" / "capability-registry.md"

COLUMNS = ["ID", "Capability", "Class", "Cov", "Basis", "2.5", "Flash", "2.0", "Source", "Recipe", "Test", "Notes"]
VOCAB = {
    "Class": {"LOCKED", "UNLOCKED", "N/A"},
    "Cov": {"EX", "TPL", "LIST", "GAP", "API"},
    "Basis": {"2.5-DOC", "2.5-VIA-2.0", "2.0-ONLY", "NONE"},
    "2.5": {"OFFICIAL", "PARTIAL", "UNVERIFIED", "NOT-DOCUMENTED", "UNSUPPORTED"},
    # Flash has no itemized capability page yet. OFFICIAL is allowed only when the row's Source cites a
    # Flash-specific page (code FL, or FL2, FL3 ... for later pages). TESTED needs a PASS entry for Flash in the log.
    "Flash": {"OFFICIAL", "PARTIAL", "UNVERIFIED", "USER-REPORTED", "TESTED"},
    "2.0": {"OFFICIAL", "PARTIAL", "UNSUPPORTED", "DISCOURAGED", "UNVERIFIED", "NOT-DOCUMENTED"},
}
SOURCE_CODES = {"T25", "G25", "API", "G20", "PA"}
FLASH_SOURCE = re.compile(r"^FL\d*$")
ID_RE = re.compile(r"^[GRCEAXP][0-9]+$")
PLANNED_RE = re.compile(r"^PLANNED:P([1-6])$")
EM_DASH = chr(0x2014)

# Numbers that belong to the flagship and must not appear as Flash facts.
FLAGSHIP_ONLY = [r"\b30 images\b", r"\b10 videos\b", r"\b10 audio clips\b", r"\bup to 50\b", r"\b50 references\b"]
# A line that mentions 1080p must say it is not offered (or describe the Draft rule that accepts only 1080p).
NEGATION = re.compile(r"\b(not|only|cannot|without|lists|accepts|no|never|unverified)\b", re.I)
# A line that mentions a flagship-only number must attribute it to the flagship or deny it for Flash.
FLAGSHIP_ACK = re.compile(r"\b(not|never|cannot|flagship|instead|differ|differs|unlike)\b", re.I)


def split_row(line):
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    return cells


def table_rows(text, start_heading):
    """Yield table rows (as lists of cells) from the section that starts at start_heading until the next H2."""
    out, active = [], False
    for line in text.split("\n"):
        if line.startswith("## "):
            active = line.strip() == start_heading
            continue
        if active and line.startswith("|"):
            cells = split_row(line)
            if cells and not set(cells[0]) <= set("-: "):
                out.append(cells)
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--registry", default=str(DEFAULT_REGISTRY))
    ap.add_argument("--skill-root", default=None)
    ap.add_argument("--scenarios", default=str(REPO / "evals" / "scenarios.json"))
    ap.add_argument("--phase", type=int, default=1, help="rows planned for a phase at or before this must have a recipe file")
    args = ap.parse_args()

    registry = Path(args.registry).resolve()
    skill_root = Path(args.skill_root).resolve() if args.skill_root else registry.parents[3]
    folder = registry.parent
    errors, warnings = [], []

    def err(msg):
        errors.append(msg)

    if not registry.exists():
        print(f"FAIL: registry not found: {registry}")
        return 1
    text = registry.read_text(encoding="utf-8")
    if EM_DASH in text:
        err("registry contains an em dash (the project's copy rules forbid it)")

    # ---- registry rows -------------------------------------------------------------------
    rows = []
    in_registry = False
    for line in text.split("\n"):
        if line.startswith("## "):
            in_registry = line.strip() == "## Registry"
            continue
        if in_registry and line.startswith("|"):
            cells = split_row(line)
            if cells and ID_RE.match(cells[0]):
                rows.append(cells)
    if not rows:
        err("no registry rows found under '## Registry'")

    seen = {}
    for cells in rows:
        rid = cells[0]
        if len(cells) != len(COLUMNS):
            err(f"{rid}: expected {len(COLUMNS)} cells, found {len(cells)}")
            continue
        row = dict(zip(COLUMNS, cells))
        if rid in seen:
            err(f"{rid}: duplicate id")
        seen[rid] = row
        for col in COLUMNS:
            if row[col] == "":
                err(f"{rid}: empty {col} cell")
        for col, allowed in VOCAB.items():
            if row[col] and row[col] not in allowed:
                err(f"{rid}: {col} value '{row[col]}' is not one of {sorted(allowed)}")
        # Source cell
        for token in [t.strip() for t in row["Source"].split(";") if t.strip()]:
            code = token.split("#")[0]
            if code not in SOURCE_CODES and not FLASH_SOURCE.match(code):
                err(f"{rid}: unknown source code '{code}' in '{token}'")
        # Recipe cell
        recipe = row["Recipe"]
        m = PLANNED_RE.match(recipe)
        if m:
            if int(m.group(1)) <= args.phase and int(m.group(1)) > 1:
                err(f"{rid}: recipe is planned for phase {m.group(1)} but the check runs at phase {args.phase}")
        elif recipe and not (skill_root / recipe).exists():
            err(f"{rid}: recipe path does not exist: {recipe}")
        # Test cell
        test = row["Test"]
        m = PLANNED_RE.match(test)
        if not m and test:
            scen_path = Path(args.scenarios)
            if scen_path.exists():
                ids = {s["id"] for s in json.loads(scen_path.read_text(encoding="utf-8"))}
                if test not in ids:
                    err(f"{rid}: test '{test}' is not a scenario id in {scen_path.name}")
            else:
                warnings.append(f"{rid}: could not verify test '{test}' (no {scen_path})")
        # Consistency rules
        codes = [t.strip().split("#")[0] for t in row["Source"].split(";") if t.strip()]
        if row["Flash"] == "OFFICIAL" and not any(FLASH_SOURCE.match(c) for c in codes):
            err(f"{rid}: Flash OFFICIAL needs a Flash-specific source (code FL) in the Source cell")
        if row["Basis"] == "2.0-ONLY" and row["2.5"] == "OFFICIAL":
            err(f"{rid}: a 2.0-only recipe cannot be OFFICIAL for 2.5 (use UNVERIFIED)")
        if row["Cov"] == "GAP" and row["2.5"] == "OFFICIAL":
            err(f"{rid}: a GAP row cannot be OFFICIAL for 2.5")
        if row["Basis"] == "NONE" and row["2.5"] == "OFFICIAL":
            err(f"{rid}: a row with no recipe basis cannot be OFFICIAL for 2.5")

    # ---- discrepancies --------------------------------------------------------------------
    disc = {r[0] for r in table_rows(text, "## Discrepancies and unresolved items") if re.match(r"^DISC-\d+$", r[0])}
    for rid, row in seen.items():
        for ref in re.findall(r"DISC-\d+", row["Notes"]):
            if ref not in disc:
                err(f"{rid}: note cites {ref}, which is not in the discrepancy table")

    # ---- traceability ---------------------------------------------------------------------
    traced = set()
    for r in table_rows(text, "## Traceability"):
        if len(r) < 2 or r[0] == "Source item":
            continue
        for rid in [t.strip() for t in r[1].split(",") if t.strip()]:
            if rid not in seen:
                err(f"traceability cites {rid}, which is not in the registry")
            traced.add(rid)
    for rid in seen:
        if rid not in traced:
            err(f"{rid}: not mapped in the traceability table")

    # ---- Flash rules and the test log -----------------------------------------------------
    log_path = folder / "test-log.md"
    flash_passed = set()
    if log_path.exists():
        for line in log_path.read_text(encoding="utf-8").split("\n"):
            if line.startswith("|"):
                cells = split_row(line)
                if len(cells) >= 8 and re.match(r"^T-\d+$", cells[0]):
                    # cells: entry, date, registry id, model, platform, settings, inputs, result, notes
                    if cells[7].upper().startswith("PASS") and "flash" in cells[3].lower():
                        flash_passed.add(cells[2])
    else:
        err("test-log.md not found next to the registry")
    for rid, row in seen.items():
        if row["Flash"] == "TESTED" and rid not in flash_passed:
            err(f"{rid}: Flash is TESTED but test-log.md has no PASS entry for it on a Flash model")

    flash_path = folder / "profile-2-5-flash.md"
    if flash_path.exists():
        ftext = flash_path.read_text(encoding="utf-8")
        if EM_DASH in ftext:
            err("Flash profile contains an em dash")
        for n, line in enumerate(ftext.split("\n"), 1):
            for pat in FLAGSHIP_ONLY:
                if re.search(pat, line, re.I) and not FLAGSHIP_ACK.search(line):
                    err(f"Flash profile line {n} states a flagship-only number without a negation: {line.strip()[:80]}")
            if re.search(r"1080p", line, re.I) and not NEGATION.search(line):
                err(f"Flash profile line {n} mentions 1080p without saying it is not listed: {line.strip()[:80]}")
    else:
        err("profile-2-5-flash.md not found next to the registry")

    # ---- report ---------------------------------------------------------------------------
    for w in warnings:
        print(f"WARN: {w}")
    if errors:
        for e in errors:
            print(f"FAIL: {e}")
        print(f"\nRegistry check FAILED: {len(errors)} problem(s), {len(seen)} row(s) read.")
        return 1
    flash = {}
    for row in seen.values():
        flash[row["Flash"]] = flash.get(row["Flash"], 0) + 1
    print(f"Registry check PASSED: {len(seen)} rows, {len(disc)} discrepancies, Flash status counts {flash}, phase gate {args.phase}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
