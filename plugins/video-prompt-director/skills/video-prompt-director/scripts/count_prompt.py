#!/usr/bin/env python3
"""Count a video prompt and place it in a density tier.

Standard library only, and optional: references/density-and-budget.md explains how to count by hand
when Python is not available. Nothing is sent anywhere; the script only reads the text it is given.

Usage:
    python3 scripts/count_prompt.py --file prompt.txt
    python3 scripts/count_prompt.py --lang zh --platform-limit 15000 < prompt.txt
    python3 scripts/count_prompt.py --lang en --redundancy --json --file prompt.txt

Options:
    --lang en|zh|id|other   Prompt language. Chooses the unit and the recommended length R
                            (en: 1,000 words, zh: 500 Chinese characters; id and other are
                            UNVERIFIED assumptions of 1,000 words).
    --recommended N         Override R, in the language's unit (for a model with its own documented limit).
    --platform-limit N      The user's interface limit, in characters, checked separately from R.
    --redundancy            List repeated sentences and repeated phrases to review.
    --json                  Print JSON instead of text.

Exit status: 0 normally, 1 when the prompt is over the platform limit, 2 on a usage error.
"""

import argparse
import json
import re
import sys
from collections import Counter

# Recommended length R per language, in the language's own unit, with its evidence tag.
RECOMMENDED = {
    "en": (1000, "words", "OFFICIAL (Seedance API page, read 2026-11-13)"),
    "zh": (500, "Chinese characters", "OFFICIAL (Seedance API page, read 2026-11-13)"),
    "id": (1000, "words", "UNVERIFIED (the documentation states the figure for English only)"),
    "other": (1000, "words", "UNVERIFIED (no figure documented for this language)"),
}
# Tier boundaries as shares of R (this skill's convention; see references/density-and-budget.md).
TIERS = [("Compact", 0.25), ("Standard", 0.58), ("Detailed", 1.0), ("Production", 1.5)]

HAN = re.compile(
    r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
    r"\U00020000-\U0002a6df\U0002a700-\U0002b73f"
    r"\U0002b740-\U0002b81f\U0002b820-\U0002ceaf"
    r"\U0002ceb0-\U0002ee5f\U0002f800-\U0002fa1f"
    r"\U00030000-\U000323af]"
)
SENTENCE_SPLIT = re.compile(r"(?<=[.!?。！？])\s+|\n+")


def tier_for(share):
    for name, upper in TIERS:
        if share <= upper:
            return name
    return "Maximum"


def measure(text, lang):
    chars = len(text)
    words = len(re.findall(r"\S+", text))
    han = len(HAN.findall(text))
    lines = len(text.split("\n"))
    return {"characters": chars, "words": words, "chinese_characters": han, "lines": lines}


def redundancy(text, lang):
    sentences = [re.sub(r"\s+", " ", s).strip().lower() for s in SENTENCE_SPLIT.split(text)]
    sentences = [s for s in sentences if len(s) >= 12]
    repeated_sentences = [(s, n) for s, n in Counter(sentences).items() if n >= 2]

    if lang == "zh":
        tokens = list(re.sub(r"\s+", "", text))
        size, joiner = 10, ""
    else:
        tokens = re.findall(r"[\w']+", text.lower())
        size, joiner = 6, " "
    windows = [joiner.join(tokens[i : i + size]) for i in range(0, max(0, len(tokens) - size + 1))]
    counts = Counter(windows)
    repeated = [counts[w] >= 2 for w in windows]
    # Merge runs of consecutive repeated windows into one maximal repeated phrase.
    runs = []
    i = 0
    while i < len(windows):
        if not repeated[i]:
            i += 1
            continue
        j = i
        while j + 1 < len(windows) and repeated[j + 1]:
            j += 1
        runs.append(joiner.join(tokens[i : j + size]))
        i = j + 1
    phrases = [(phrase, n) for phrase, n in Counter(runs).most_common() if n >= 2][:5]
    return {"repeated_sentences": repeated_sentences[:5], "repeated_phrases": phrases}


def main():
    ap = argparse.ArgumentParser(description="Count a video prompt and place it in a density tier.")
    ap.add_argument("--file", help="read the prompt from this file (default: standard input)")
    ap.add_argument("--lang", default="en", choices=sorted(RECOMMENDED), help="prompt language")
    ap.add_argument("--recommended", type=int, help="override the recommended length R, in the language's unit")
    ap.add_argument("--platform-limit", type=int, help="the interface limit, in characters")
    ap.add_argument("--redundancy", action="store_true", help="list repeated sentences and phrases")
    ap.add_argument("--json", action="store_true", help="print JSON")
    args = ap.parse_args()

    try:
        if args.file:
            with open(args.file, encoding="utf-8") as handle:
                text = handle.read()
        else:
            text = sys.stdin.read()
    except OSError as err:
        print(f"error: cannot read the prompt: {err}", file=sys.stderr)
        return 2
    if not text.strip():
        print("error: the prompt is empty", file=sys.stderr)
        return 2
    if args.recommended is not None and args.recommended <= 0:
        print("error: --recommended must be positive", file=sys.stderr)
        return 2
    if args.platform_limit is not None and args.platform_limit <= 0:
        print("error: --platform-limit must be positive", file=sys.stderr)
        return 2

    counts = measure(text, args.lang)
    r_default, unit, tag = RECOMMENDED[args.lang]
    r_value = args.recommended if args.recommended else r_default
    if args.recommended:
        tag = "USER-SUPPLIED"
    used = counts["chinese_characters"] if args.lang == "zh" else counts["words"]
    share = used / r_value
    tier = tier_for(share)

    warnings = []
    if share > 1.0:
        warnings.append(f"above the recommended length ({used} of {r_value} {unit}); the vendor warns that long prompts can lose detail")
    if tier in ("Production", "Maximum"):
        warnings.append(f"{tier} tier needs a stated reason" + ("; Maximum is experimental and never automatic" if tier == "Maximum" else ""))
    if args.lang in ("id", "other"):
        warnings.append("the recommended length for this language is UNVERIFIED")
    over_platform = False
    platform_share = None
    if args.platform_limit:
        platform_share = counts["characters"] / args.platform_limit
        if counts["characters"] > args.platform_limit:
            over_platform = True
            warnings.append(f"over the platform limit: {counts['characters']} characters against {args.platform_limit}")

    result = {
        "language": args.lang,
        "unit": unit,
        "counts": counts,
        "recommended": {"value": r_value, "unit": unit, "tag": tag},
        "measured_in_unit": used,
        "share_of_recommended": round(share, 3),
        "tier": tier,
        "platform_limit": args.platform_limit,
        "share_of_platform_limit": round(platform_share, 3) if platform_share is not None else None,
        "over_platform_limit": over_platform,
        "warnings": warnings,
    }
    if args.redundancy:
        result["redundancy"] = redundancy(text, args.lang)

    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"Characters: {counts['characters']}   Words: {counts['words']}   Chinese characters: {counts['chinese_characters']}   Lines: {counts['lines']}")
        print(f"Measured in {unit}: {used} of a recommended {r_value} ({share * 100:.0f} percent). Recommendation tag: {tag}")
        print(f"Tier: {tier}")
        if platform_share is not None:
            print(f"Platform limit: {counts['characters']} of {args.platform_limit} characters ({platform_share * 100:.0f} percent)")
        for warning in warnings:
            print(f"WARNING: {warning}")
        if args.redundancy:
            red = result["redundancy"]
            if not red["repeated_sentences"] and not red["repeated_phrases"]:
                print("Redundancy: no repeated sentences or phrases found.")
            for sentence, n in red["repeated_sentences"]:
                print(f"Repeated sentence x{n}: {sentence[:100]}")
            for phrase, n in red["repeated_phrases"]:
                print(f"Repeated phrase x{n}: {phrase}")
    return 1 if over_platform else 0


if __name__ == "__main__":
    sys.exit(main())
