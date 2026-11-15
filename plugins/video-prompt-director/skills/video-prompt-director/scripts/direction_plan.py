#!/usr/bin/env python3
"""Validate a direction plan and compile it into one self-contained prompt per generation.

A direction plan (references/director-layers.md) holds five layers:
  global      format, look, cast (looks, voices), props, locations: stated once
  scenes      location, time, weather, layout, starting state of everyone and everything
  generations one video model call each, holding one or more shots
  shots       camera, who is in frame, timed beats (one actor, one action), lines, sounds, changes
  state       derived, never written: the continuity director replays every beat and change in order

Usage:
  python3 direction_plan.py validate plan.json [--json]
  python3 direction_plan.py compile  plan.json [--generation ID] [--out DIR]
  python3 direction_plan.py ledger   plan.json

Exit codes: 0 no errors, 1 errors (or warnings with --strict), 2 the plan could not be read.
Standard library only. Timing figures are planning heuristics (references/pacing.md), not model facts.
"""
from __future__ import annotations

import argparse
import copy
import json
import re
import sys
from dataclasses import dataclass, field
from typing import Any

PLAN_VERSION = "direction-plan/1"

# ---------------------------------------------------------------- action timing (HEURISTIC, references/action-blocking.md)
# Minimum seconds a natural, unhurried performance of the action needs on screen. Matched in order; first hit wins.
ACTION_SECONDS: list[tuple[str, float, str]] = [
    (r"\b(puts? on|pulls? on|shrugs? on|takes? off) (his|her|their|a|the)? ?(coat|overcoat|jacket|sweater)", 4.0, "body"),
    (r"\b(walks?|crosses|trudges?|crosses)\b", 2.0, "body"),
    (r"\b(sits? down|stands? up|sits\b|rises\b|gets up)", 1.5, "body"),
    (r"\b(hugs?|embraces?|pulls? (him|her|them) (close|into))", 2.0, "body"),
    (r"\b(hands?|gives?|passes?|offers?) (the|a|her|him|his|it|over)\b", 2.0, "body"),
    (r"\b(opens?|closes?|pulls? open|pushes? open|shuts?)\b", 1.5, "body"),
    (r"\b(unfolds?|folds?|refolds?)\b", 1.5, "body"),
    (r"\b(lowers?|sets?|places?|puts?) (it|the|a|her|his|down)\b", 1.2, "body"),
    (r"\b(lifts?|picks? up|raises?|holds? out|holds? up)\b", 1.0, "body"),
    (r"\b(pockets?|tucks?)\b", 1.2, "body"),
    (r"\b(reaches?|takes?|grasps?|grips?)\b", 1.0, "body"),
    (r"\b(bites?|eats?|sips?|drinks?)\b", 1.5, "body"),
    (r"\b(clinks?|toasts?)\b", 1.0, "body"),
    (r"\b(flips?|turns? the sign)\b", 1.0, "body"),
    (r"\b(steps? (back|forward|out|in|inside|outside)|steps?\b)", 0.8, "body"),
    (r"\b(points?|gestures?)\b", 0.8, "body"),
    (r"\b(taps?|knocks?)\b", 0.6, "body"),
    (r"\b(turns? (away|around|back|to)|turns\b)", 1.0, "body"),
    (r"\b(nods?|shakes? (his|her) head)\b", 0.8, "face"),
    (r"\b(laughs?|cries|sobs?|smiles?|frowns?|winces?|swallows?|tears?|eyes fill|face falls|jaw|brows?|lips?)\b", 0.6, "face"),
    (r"\b(looks?|glances?|eyes|gaze|stares?|watches?|follows? (his|her) gaze)\b", 0.5, "face"),
    (r"\b(breathes?|breath|exhales?|inhales?|shivers?|trembles?)\b", 0.3, "face"),
]
DEFAULT_ACTION = (0.8, "body")
WORDS_PER_SECOND = 2.5          # space-separated languages (references/pacing.md)
HAN_PER_SECOND = 4.5
SPEAKER_CHANGE = 0.4
FINE_FINGER = re.compile(r"\b(index finger|fingertips?|finger\b|fingers\b|thumb)\b", re.I)
CAMERA_MOVES = re.compile(r"\b(push(es)?[- ]in|pull(s)?[- ]back|dolly|tracks?|tracking|pans?|tilts?|crane|orbit|arc|zoom(s|ing)?|whip)\b", re.I)
ZOOM = re.compile(r"\bzoom(s|ing)?\b", re.I)
LOCKED = re.compile(r"\b(locked[- ]off|locked|static|tripod)\b", re.I)
OTS = re.compile(r"\b(over[- ]the[- ]shoulder|from behind)\b", re.I)
FACE_WORDS = re.compile(r"\b(eyes?|face|expression|brows?|mouth|lips|smiles?|tears?)\b", re.I)
SEVERITY_ORDER = {"error": 0, "warn": 1, "tip": 2}


@dataclass
class Finding:
    severity: str
    code: str
    message: str
    where: str = ""

    def as_dict(self) -> dict[str, str]:
        return {"severity": self.severity, "code": self.code, "message": self.message, "where": self.where}


@dataclass
class Report:
    findings: list[Finding] = field(default_factory=list)

    def add(self, severity: str, code: str, message: str, where: str = "") -> None:
        self.findings.append(Finding(severity, code, message, where))

    @property
    def errors(self) -> list[Finding]:
        return [f for f in self.findings if f.severity == "error"]


def action_min(text: str) -> tuple[float, str]:
    """Classify a beat by its leading verb phrase (the first clause, first five words), so that "his open mitten" or
    "toward the step" later in the sentence does not count as opening or stepping."""
    lead = " ".join(re.split(r"[;:,]", text, maxsplit=1)[0].split()[:5])
    for pattern, seconds, channel in ACTION_SECONDS:
        if re.search(pattern, lead, re.I):
            return seconds, channel
    return DEFAULT_ACTION


def speech_seconds(text: str) -> float:
    han = len(re.findall(r"[㐀-鿿\U00020000-\U0003134f]", text))
    if han:
        return han / HAN_PER_SECOND
    return len(re.findall(r"[\w'’-]+", text)) / WORDS_PER_SECOND


# ---------------------------------------------------------------- state (the continuity director)

def initial_state(scene: dict[str, Any]) -> dict[str, Any]:
    s = copy.deepcopy(scene.get("start", {}))
    s.setdefault("positions", {})
    s.setdefault("facing", {})
    s.setdefault("wardrobe", {})
    s.setdefault("hands", {})
    s.setdefault("props", {})
    s.setdefault("env", {})
    for who, hands in s["hands"].items():
        hands.setdefault("left", None)
        hands.setdefault("right", None)
    return s


def cast_tag(cast: dict, who: str, state: dict[str, Any] | None) -> str | None:
    """The reference tag for a person in their current look (a look may have its own image)."""
    c = cast.get(who, {})
    look = (state or {}).get("wardrobe", {}).get(who)
    return c.get("looks", {}).get(look, {}).get("tag") or c.get("tag")


def free_prop(state: dict[str, Any], prop: str) -> None:
    for hands in state["hands"].values():
        for side in ("left", "right"):
            if hands.get(side) == prop:
                hands[side] = None


def held_by(state: dict[str, Any], prop: str) -> tuple[str, str] | None:
    for who, hands in state["hands"].items():
        for side in ("left", "right"):
            if hands.get(side) == prop:
                return who, side
    return None


def apply_change(state: dict[str, Any], ch: dict[str, Any]) -> None:
    """A declared change: an intentional state change (on screen, off-cut, or a time jump)."""
    kind = ch.get("kind")
    who = ch.get("who")
    if kind == "position" and who:
        state["positions"][who] = ch["to"]
        if ch.get("facing"):
            state["facing"][who] = ch["facing"]
        else:
            state["facing"].pop(who, None)
    elif kind == "facing" and who:
        state["facing"][who] = ch["to"]
    elif kind == "wardrobe" and who:
        state["wardrobe"][who] = ch["to"]
    elif kind == "env":
        state["env"][ch["item"]] = ch["to"]
    elif kind == "prop":
        prop = ch["prop"]
        free_prop(state, prop)
        if ch.get("holder"):
            state["hands"].setdefault(ch["holder"], {"left": None, "right": None})
            for side in (["left", "right"] if ch.get("hand") == "both" else [ch.get("hand", "right")]):
                state["hands"][ch["holder"]][side] = prop
            state["props"][prop] = ch.get("to") or f"in {ch['holder']}'s {ch.get('hand', 'right')} hand"
        else:
            state["props"][prop] = ch["to"]
    elif kind == "hands" and who:
        state["hands"][who] = {"left": ch.get("left"), "right": ch.get("right")}


# ---------------------------------------------------------------- validation

def names(plan: dict[str, Any]) -> tuple[dict, dict, dict]:
    g = plan.get("global", {})
    return g.get("cast", {}), g.get("props", {}), g.get("locations", {})


def validate(plan: dict[str, Any]) -> tuple[Report, list[dict[str, Any]]]:
    """Returns the report and the per-shot ledger (state at each shot's start and end)."""
    r = Report()
    ledger: list[dict[str, Any]] = []
    if plan.get("version") != PLAN_VERSION:
        r.add("error", "version", f"version must be {PLAN_VERSION!r}")
    cast, props, locations = names(plan)
    scenes = {s["id"]: s for s in plan.get("scenes", [])}
    if not scenes:
        r.add("error", "no-scenes", "The plan has no scenes.")
    for sid, sc in scenes.items():
        if sc.get("location") not in locations:
            r.add("error", "unknown-location", f"Scene {sid} is at {sc.get('location')!r}, which global.locations does not define.", sid)
        start = sc.get("start", {})
        for who in start.get("positions", {}):
            if who not in cast:
                r.add("error", "unknown-person", f"Scene {sid} places {who!r}, who is not in global.cast.", sid)
            elif not start.get("wardrobe", {}).get(who) and len(cast[who].get("looks", {})) > 1:
                r.add("error", "wardrobe-unset", f"{who} has several looks; scene {sid} must say which one they start in.", sid)
        for p in start.get("props", {}):
            if p not in props:
                r.add("error", "unknown-prop", f"Scene {sid} sets {p!r}, which global.props does not define.", sid)

    state: dict[str, Any] | None = None
    prev_scene = None
    prev_shot = None
    for gen in plan.get("generations", []):
        gid = gen.get("id", "?")
        seconds = float(gen.get("seconds", 0))
        refs = set(gen.get("refs", []))
        used_refs: set[str] = set()
        shots = gen.get("shots", [])
        if not shots:
            r.add("error", "empty-generation", f"Generation {gid} has no shots.", gid)
            continue
        if shots[0].get("start", 0) != 0 or abs(float(shots[-1].get("end", 0)) - seconds) > 0.01:
            r.add("error", "generation-span", f"Generation {gid}'s shots must run from 0 to {seconds:g} s without gaps.", gid)
        for a, b in zip(shots, shots[1:]):
            if abs(float(a["end"]) - float(b["start"])) > 0.01:
                r.add("error", "shot-gap", f"Shot {a['id']} ends at {a['end']} s but {b['id']} starts at {b['start']} s.", gid)
        model = plan.get("global", {}).get("model", {})
        lo, hi = model.get("seconds", [None, None]) if isinstance(model, dict) else (None, None)
        if lo is not None and not (lo <= seconds <= hi):
            r.add("error", "model-duration", f"Generation {gid} is {seconds:g} s; the model profile allows {lo}–{hi} s.", gid)
        max_refs = model.get("max_images") if isinstance(model, dict) else None
        if max_refs and len(refs) > max_refs:
            r.add("error", "too-many-refs", f"Generation {gid} attaches {len(refs)} images; the model takes {max_refs}.", gid)

        for shot in shots:
            sid = shot.get("id", "?")
            where = f"{gid}/{sid}"
            scene = scenes.get(shot.get("scene") or gen.get("scene"))
            if not scene:
                r.add("error", "unknown-scene", f"Shot {sid} names no known scene.", where)
                continue
            new_scene = prev_scene is None or scene["id"] != prev_scene
            if new_scene:
                state = initial_state(scene)
            assert state is not None
            for ch in shot.get("changes_before", []):
                apply_change(state, ch)
            start_state = copy.deepcopy(state)
            t0, t1 = float(shot.get("start", 0)), float(shot.get("end", 0))
            length = t1 - t0
            if length < 1.0:
                r.add("warn", "shot-short", f"Shot {sid} lasts {length:.1f} s; under about 1 s a cut does not read.", where)

            in_frame = shot.get("in_frame", [])
            visible_props = shot.get("props", [])
            loc = locations.get(scene.get("location"), {})
            for who in in_frame:
                if who not in cast:
                    r.add("error", "unknown-person", f"{who!r} is in frame in {sid} but not in global.cast.", where)
                    continue
                if who not in state["positions"]:
                    r.add("error", "person-not-placed", f"{who} is in frame in {sid} but has no position in scene {scene['id']} (add it to the scene start or a change).", where)
                tag = cast_tag(cast, who, state)
                if tag:
                    used_refs.add(tag)
                    if tag not in refs:
                        r.add("error", "missing-ref", f"{who} ({tag}) is in frame in {sid} but generation {gid} does not attach that image.", where)
            for p in visible_props:
                if p not in props:
                    r.add("error", "unknown-prop", f"{p!r} is visible in {sid} but global.props does not define it.", where)
                    continue
                if str(state["props"].get(p, "")).startswith("absent"):
                    r.add("error", "prop-appears", f"{p} is visible in {sid} but its state is {state['props'][p]!r}: show how it got here (a change).", where)
                tag = props[p].get("tag")
                if tag:
                    used_refs.add(tag)
                    if tag not in refs:
                        r.add("error", "missing-ref", f"{p} ({tag}) is visible in {sid} but generation {gid} does not attach that image.", where)
            for lname in [scene.get("location")] + shot.get("locations", []):
                ltag = locations.get(lname, {}).get("tag")
                if lname not in locations:
                    r.add("error", "unknown-location", f"{sid} shows location {lname!r}, which global.locations does not define.", where)
                elif ltag:
                    used_refs.add(ltag)
                    if ltag not in refs:
                        r.add("error", "missing-ref", f"{sid} shows {lname} ({ltag}) but generation {gid} does not attach that image.", where)
            # a person in frame keeps what they hold: say it, or the model drops it
            for who in in_frame:
                hands_now = state["hands"].get(who, {})
                hidden = shot.get("hands_hidden", {}).get(who)
                for obj in dict.fromkeys(v for v in (hands_now.get("left"), hands_now.get("right")) if v):
                    sides_ = [s_ for s_ in ("left", "right") if hands_now.get(s_) == obj]
                    if obj not in visible_props and not (hidden is True or (isinstance(hidden, list) and all(s_ in hidden for s_ in sides_))):
                        r.add("warn", "held-prop-unstated", f"{who} holds {obj} ({' and '.join(sides_)} hand) during {sid}, but the shot does not list it. State it, or mark the hands as out of frame (hands_hidden).", where)
            for p in visible_props:
                h = held_by(state, p)
                if h and h[0] not in in_frame:
                    r.add("error", "floating-prop", f"{p} is shown in {sid} but {h[0]}, who holds it, is not in frame. Put the hands in frame or set it down first; otherwise it floats.", where)
            if len([w for w in in_frame if w in cast]) >= 2 and not shot.get("sides"):
                r.add("warn", "sides-unset", f"{sid} has {len(in_frame)} people in frame and no screen sides.", where)

            # camera
            cam = " ".join(str(shot.get(k, "")) for k in ("camera", "move"))
            moves = {m.group(0).lower() for m in CAMERA_MOVES.finditer(str(shot.get("move", "")))}
            if ZOOM.search(cam):
                r.add("error", "camera-zoom", f"{sid} asks for a zoom. Cut to the closer size instead (references/camera-language.md).", where)
            if len(moves) > 1:
                r.add("warn", "camera-moves", f"{sid} combines several camera moves ({', '.join(sorted(moves))}). Keep one move per cut.", where)
            if LOCKED.search(str(shot.get("move", ""))) and moves:
                r.add("error", "camera-conflict", f"{sid} says the camera is locked and also moves ({', '.join(sorted(moves))}).", where)
            gcam = str(plan.get("global", {}).get("look", {}).get("camera", ""))
            if re.search(r"handheld", gcam, re.I) and re.search(r"\b(locked[- ]off|tripod)\b", str(shot.get("move", "")), re.I) and not re.search(r"\b(locked[- ]off|tripod)\b", gcam, re.I):
                r.add("warn", "camera-global-conflict", f"{sid} asks for a locked-off camera while the global look asks for handheld movement. Say which wins (for example 'held still' with the global handheld breathing).", where)
            if OTS.search(cam):
                behind = shot.get("over")
                if not behind:
                    r.add("warn", "ots-unnamed", f"{sid} is over a shoulder: name whose (over).", where)
                else:
                    for b in shot.get("beats", []):
                        if b.get("who") == behind and FACE_WORDS.search(b.get("do", "")):
                            r.add("error", "ots-face", f"{sid} is shot from behind {behind}, so {behind}'s face cannot be seen, yet a beat directs it: “{b['do']}”. Move the reaction to a shot that sees the face, or play it with the head and shoulders.", where)
            # beats: one actor, one action, enough time
            busy: dict[tuple[str, str], list[tuple[float, float, str]]] = {}
            for b in shot.get("beats", []):
                who, text = b.get("who"), b.get("do", "")
                bt0, bt1 = (float(x) for x in b.get("t", [t0, t0]))
                if who not in cast and who != "camera":
                    r.add("error", "beat-actor", f"A beat in {sid} has no known actor: “{text}”.", where)
                    continue
                if who != "camera" and who not in in_frame and not b.get("offscreen"):
                    r.add("error", "beat-offscreen", f"{who} acts in {sid} (“{text}”) but is not in frame. Add them to in_frame or mark the beat offscreen.", where)
                if bt0 < t0 - 1e-6 or bt1 > t1 + 1e-6 or bt1 <= bt0:
                    r.add("error", "beat-window", f"Beat “{text}” ({bt0:g}–{bt1:g} s) is outside {sid} ({t0:g}–{t1:g} s).", where)
                    continue
                need, channel = action_min(text)
                if b.get("channel"):
                    channel = b["channel"]
                dur = bt1 - bt0
                dur = round(dur, 2)
                if dur < need * 0.7 - 0.01:
                    r.add("error", "beat-rushed", f"“{text}” gets {dur:.1f} s; a natural performance needs about {need:g} s. Lengthen it, split it, or cut away.", where)
                elif dur < need - 0.01:
                    r.add("warn", "beat-tight", f"“{text}” gets {dur:.1f} s against about {need:g} s.", where)
                if len(re.findall(r",? then |; then | and then ", text)) >= 1:
                    r.add("warn", "beat-compound", f"“{text}” chains actions in one beat. Give each action its own timed beat.", where)
                for (bw, bc), spans in busy.items():
                    if bw == who and bc == channel:
                        for s0, s1, other in spans:
                            if bt0 < s1 - 0.05 and s0 < bt1 - 0.05:
                                r.add("error", "beat-overlap", f"{who} does two {channel} actions at once in {sid}: “{other}” and “{text}”.", where)
                busy.setdefault((who, channel), []).append((bt0, bt1, text))
                # hands
                if who in cast:
                    hands = state["hands"].setdefault(who, {"left": None, "right": None})
                    covered = cast[who].get("hands_covered")
                    if covered and FINE_FINGER.search(text):
                        r.add("error", "finger-in-mitten", f"{who} wears {covered}; “{text}” needs bare fingers. Use the whole hand.", where)
                    hand = b.get("hand")
                    takes, releases = b.get("takes"), b.get("releases")
                    if releases:
                        h = held_by(state, releases)
                        if not h or h[0] != who:
                            r.add("error", "release-not-held", f"{who} lets go of {releases} in {sid}, but does not hold it.", where)
                        else:
                            free_prop(state, releases)
                            state["props"][releases] = b.get("to") or state["props"].get(releases, "")
                    if takes:
                        current = held_by(state, takes)
                        if current and current[0] != who and not b.get("from"):
                            r.add("error", "take-held", f"{who} takes {takes} in {sid}, but {current[0]} is holding it. Name the handover (from).", where)
                        if current:
                            free_prop(state, takes)
                        sides = ["left", "right"] if hand == "both" else [hand or "right"]
                        full = [side for side in sides if hands.get(side) and hands.get(side) != takes]
                        for side in full:
                            r.add("error", "hand-full", f"{who}'s {side} hand already holds {hands[side]} when “{text}” takes {takes}.", where)
                        if not full:  # an impossible take leaves the hands as they were, so later findings don't cascade
                            for side in sides:
                                hands[side] = takes
                            state["props"][takes] = f"in {who}'s {'hands' if hand == 'both' else (hand or 'right') + ' hand'}"
                    elif hand and not releases and not b.get("holding_ok"):
                        busy_objs = dict.fromkeys(hands[s_] for s_ in (["left", "right"] if hand == "both" else [hand]) if hands.get(s_))
                        for obj in busy_objs:
                            r.add("error", "hand-busy", f"“{text}” needs {who}'s {'hands' if hand == 'both' else hand + ' hand'}, but {obj} is in them. Free the hand first, or mark holding_ok if the object stays in it.", where)
                    if sum(1 for v in hands.values() if v) > 2:
                        r.add("error", "hand-count", f"{who} holds more than two things in {sid}.", where)
            for ch in shot.get("changes", []):
                apply_change(state, ch)
            # dialogue
            last_speaker = None
            cursor = t0
            for ln in shot.get("lines", []):
                who = ln.get("who")
                at = float(ln.get("at", t0))
                if who not in cast:
                    r.add("error", "line-speaker", f"A line in {sid} has no known speaker: “{ln.get('text', '')}”.", where)
                    continue
                if who not in in_frame and not ln.get("offscreen"):
                    r.add("error", "speaker-absent", f"{who} speaks in {sid} but is not in frame; mark the line offscreen or put them in frame.", where)
                need = speech_seconds(ln.get("text", "")) + (SPEAKER_CHANGE if last_speaker and last_speaker != who else 0)
                if at < cursor - 0.05:
                    r.add("error", "line-overlap", f"{who}'s line in {sid} starts at {at:g} s, before the previous line can end ({cursor:.1f} s).", where)
                if at + need > t1 + 0.05:
                    r.add("error", "line-overflow", f"{who}'s line “{ln.get('text')}” needs about {need:.1f} s from {at:g} s; {sid} ends at {t1:g} s.", where)
                cursor = at + need
                last_speaker = who
            for snd in shot.get("sounds", []):
                cause = snd.get("cause")
                if not cause:
                    r.add("error", "sound-cause", f"The sound “{snd.get('what')}” in {sid} has no cause. Tie it to a beat id, a person, or mark it ambience.", where)
                elif cause not in ("ambience", "offscreen") and cause not in cast and cause not in {b.get("id") for b in shot.get("beats", [])}:
                    r.add("error", "sound-cause", f"The sound “{snd.get('what')}” in {sid} names cause {cause!r}, which is no beat, person or ambience.", where)
                elif cause not in ("ambience", "offscreen") and cause not in cast:
                    beat = next(b for b in shot["beats"] if b.get("id") == cause)
                    if "at" in snd and not (beat["t"][0] - 0.3 <= float(snd["at"]) <= beat["t"][1] + 0.3):
                        r.add("error", "sound-sync", f"The sound “{snd.get('what')}” at {snd['at']} s falls outside its beat “{beat['do']}” ({beat['t'][0]}–{beat['t'][1]} s).", where)
            # environment is fixed per scene unless a change says otherwise
            for k, v in shot.get("env", {}).items():
                if k in state["env"] and state["env"][k] != v:
                    r.add("error", "env-conflict", f"{sid} says {k} is {v!r}, but it is {state['env'][k]!r} at this point. Declare the change.", where)
            # asserted end state
            for who, pos in shot.get("end_state", {}).get("positions", {}).items():
                if state["positions"].get(who) != pos:
                    r.add("error", "end-position", f"{sid} ends with {who} at {pos!r}, but the beats and changes leave them at {state['positions'].get(who)!r}.", where)
            # screen sides are fixed inside a scene unless the line is crossed on purpose
            if prev_shot and not new_scene and prev_shot.get("sides") and shot.get("sides") and not shot.get("crosses_line"):
                for who, side in shot["sides"].items():
                    old = prev_shot["sides"].get(who)
                    if old and old != "center" and side != "center" and old != side:
                        r.add("error", "side-flip", f"{who} is screen-{old} in {prev_shot['id']} and screen-{side} in {sid}. Keep the side, or mark crosses_line and show the crossing.", where)
            ledger.append({"generation": gid, "shot": sid, "scene": scene["id"], "start": start_state, "end": copy.deepcopy(state)})
            prev_scene = scene["id"]
            prev_shot = shot
        if gen.get("storyboard"):
            used_refs.add(gen["storyboard"])
        for ref in refs - used_refs:
            r.add("warn", "unused-ref", f"Generation {gid} attaches {ref}, which no shot puts in frame. An attached image tends to appear (references/continuity.md section 10).", gid)
        # wardrobe inside one generation: one look per person
        looks: dict[str, set[str]] = {}
        for row in ledger:
            if row["generation"] == gid:
                for who, look in row["end"]["wardrobe"].items():
                    looks.setdefault(who, set()).add(look)
                for who, look in row["start"]["wardrobe"].items():
                    looks.setdefault(who, set()).add(look)
        for who, ls in looks.items():
            in_gen = any(who in s.get("in_frame", []) for s in shots)
            if in_gen and len(ls) > 1:
                r.add("error", "wardrobe-mixed", f"{who} wears {', '.join(sorted(ls))} within generation {gid}. One look per generation: move the change to a clip boundary.", gid)
    # wardrobe changes between scenes must be declared
    for a, b in zip(ledger, ledger[1:]):
        for who, look in b["start"]["wardrobe"].items():
            old = a["end"]["wardrobe"].get(who)
            if old and old != look:
                shot = next(s for g in plan["generations"] if g["id"] == b["generation"] for s in g["shots"] if s["id"] == b["shot"])
                declared = any(c.get("kind") == "wardrobe" and c.get("who") == who for c in shot.get("changes_before", []))
                if not declared:
                    r.add("error", "wardrobe-unexplained", f"{who} changes from {old} to {look} at {b['shot']} with no declared change.", b["shot"])
    r.findings.sort(key=lambda f: SEVERITY_ORDER[f.severity])
    return r, ledger


# ---------------------------------------------------------------- compiling

def person(cast: dict, who: str, look: str | None = None) -> str:
    c = cast[who]
    return c.get("short", who)


def prop_label(props: dict, state: dict, p: str) -> str:
    """The prop's name plus its condition when the state gives one ("folded once, in the boy's right mitten" -> "(folded once)")."""
    name = props.get(p, {}).get("short", p)
    where = str(state["props"].get(p, ""))
    cond = where.split(",", 1)[0].strip() if "," in where else ""
    return f"{name} ({cond})" if cond and not cond.startswith(("in ", "on ", "at ")) else name


def describe_hands(cast: dict, props: dict, state: dict, who: str) -> str:
    h = state["hands"].get(who, {})
    parts = []
    for side in ("left", "right"):
        if h.get(side):
            parts.append(f"{prop_label(props, state, h[side])} in {('his' if cast[who].get('pronoun', 'he') == 'he' else 'her' if cast[who].get('pronoun') == 'she' else 'their')} {side} {cast[who].get('hand_word', 'hand')}")
    both = h.get("left") and h.get("left") == h.get("right")
    if both:
        return f"{person(cast, who)} holds {prop_label(props, state, h['left'])} in both {cast[who].get('hand_word', 'hand')}s"
    return f"{person(cast, who)} holds " + " and ".join(parts) if parts else ""


def cap(s: str) -> str:
    return s[:1].upper() + s[1:]


def beat_sentence(actor: str, text: str) -> str:
    """'his eyes move' -> "The baker's eyes move"; 'a smile spreads' -> 'The baker: a smile spreads'."""
    text = text.rstrip(".")
    m = re.match(r"(his|her|their)\s+(.*)", text)
    if m:
        return f"{actor}'s {m.group(2)}."
    if re.match(r"(a|an|the)\s", text):
        return f"{actor}: {text}."
    return f"{actor} {text}."


def fmt_t(x: float) -> str:
    return f"{x:.1f}".rstrip("0").rstrip(".") if x % 1 else f"{x:.0f}"


def tag_or_name(entity: dict, fallback: str) -> str:
    return entity.get("tag") or fallback


def compile_generation(plan: dict[str, Any], gen: dict[str, Any], ledger: list[dict[str, Any]]) -> str:
    g = plan["global"]
    cast, props, locations = g.get("cast", {}), g.get("props", {}), g.get("locations", {})
    rows = {row["shot"]: row for row in ledger if row["generation"] == gen["id"]}
    shots = gen["shots"]
    first = rows[shots[0]["id"]]["start"]
    last = rows[shots[-1]["id"]]["end"]
    scene_ids = []
    for s in shots:
        sc = s.get("scene") or gen.get("scene")
        if sc not in scene_ids:
            scene_ids.append(sc)
    scenes = {s["id"]: s for s in plan["scenes"]}
    people = [w for w in cast if any(w in s.get("in_frame", []) or any(l.get("who") == w for l in s.get("lines", [])) for s in shots)]
    shown_props = [p for p in props if any(p in s.get("props", []) for s in shots)]
    out: list[str] = []

    # 1 REFERENCES: what each attached image controls
    ref_parts = []
    for w in people:
        c = cast[w]
        look = first["wardrobe"].get(w)
        tag = cast_tag(cast, w, first)
        if tag and tag in gen.get("refs", []):
            ref_parts.append(f"{tag} = {c.get('short', w)}{' (' + c['looks'][look]['label'] + ')' if look and c.get('looks', {}).get(look, {}).get('label') else ''}: face, build and costume")
    loc_names = list(dict.fromkeys([scenes[sc]["location"] for sc in scene_ids] + [l for s in shots for l in s.get("locations", [])]))
    for ln_ in loc_names:
        loc = locations[ln_]
        if loc.get("tag") in gen.get("refs", []):
            ref_parts.append(f"{loc['tag']} = {loc.get('short', ln_)}: architecture and set dressing")
    by_tag: dict[str, list[str]] = {}
    for p in shown_props:
        if props[p].get("tag") in gen.get("refs", []):
            by_tag.setdefault(props[p]["tag"], []).append(props[p].get("short", p))
    for tg, shorts in by_tag.items():
        ref_parts.append(f"{tg} = {' / '.join(shorts)}: its design")
    if gen.get("storyboard"):
        ref_parts.append(f"{gen['storyboard']} = the storyboard: framing and blocking of each timed shot below; the written timing and action win where they differ")
    if ref_parts:
        out.append("REFERENCES: " + "; ".join(ref_parts) + ".")

    # 2 GLOBAL: format and look, once
    look = g.get("look", {})
    fmt = f"{g.get('ratio', '')} {'vertical' if g.get('ratio') == '9:16' else ''}".strip()
    out.append("LOOK (whole clip): " + " ".join(x for x in [
        f"Photoreal live-action, {fmt}, {g.get('fps', 24)} fps." if fmt else "",
        look.get("image", ""), look.get("light", ""), look.get("lens", ""), look.get("camera", ""), look.get("atmosphere", "")] if x))

    if gen.get("purpose"):
        out.append(f"CLIP PURPOSE: {gen['purpose'].rstrip('.')}.")

    # 3 CAST: identity, costume and voice, once per person in this generation
    cast_lines = []
    for w in people:
        c = cast[w]
        lk = first["wardrobe"].get(w)
        costume = c.get("looks", {}).get(lk, {}).get("costume") if lk else c.get("costume")
        speaks = any(l.get("who") == w for s in shots for l in s.get("lines", []))
        # the reference image fixes the face; the text keeps only what models drop (costume) and what an image cannot carry (voice)
        has_image = bool(cast_tag(cast, w, first) and cast_tag(cast, w, first) in gen.get("refs", []))
        bits = ["" if has_image else c.get("appearance", ""), f"wears {costume}" if costume else "", f"voice: {c['voice']}" if speaks and c.get("voice") else ""]
        cast_lines.append(f"- {cap(c.get('short', w))} ({cast_tag(cast, w, first) or w}): " + "; ".join(b for b in bits if b) + ".")
    if cast_lines:
        out.append("CAST (only these people appear; no one else in any frame):\n" + "\n".join(cast_lines))

    # 4 SCENE: place, time, weather, layout, light and sound of the room
    for sc in scene_ids:
        s = scenes[sc]
        loc = locations[s["location"]]
        bits = [f"{cap(loc.get('short', s['location']))}, {s.get('time', '')}".strip(", ") + ".",
                s.get("weather", ""), loc.get("layout", ""), s.get("light") or loc.get("light", "")]
        out.append("SCENE: " + " ".join(b.rstrip(".") + "." for b in bits if b))

    # 5 START STATE: inherited continuity, stated every clip
    st = []
    for w in people:
        pos = first["positions"].get(w)
        if pos:
            st.append(f"{cap(person(cast, w))}: {pos}{', facing ' + first['facing'][w] if first['facing'].get(w) else ''}.")
        hh = describe_hands(cast, props, first, w)
        if hh:
            st.append(hh[0].upper() + hh[1:] + ".")
    for p in shown_props:
        h = held_by(first, p)
        if not h and first["props"].get(p):
            st.append(f"{cap(props[p].get('short', p))}: {first['props'][p]}.")
    env = "; ".join(f"{k}: {v}" for k, v in first.get("env", {}).items())
    if env:
        st.append(f"Set: {env}.")
    if st:
        out.append("START STATE (continues from the previous clip): " + " ".join(st))

    # 6 SHOTS: camera, timed beats, lines, sounds
    for i, s in enumerate(shots):
        head = f"SHOT {i + 1} ({fmt_t(s['start'])}–{fmt_t(s['end'])} s{', hard cut' if i else ''}): {s.get('camera', '')}".rstrip()
        move = s.get("move")
        if move:
            head += f" Camera: {move.rstrip('.')}."
        frame = [person(cast, w) for w in s.get("in_frame", [])]
        sides = s.get("sides", {})
        if frame:
            head += " In frame: " + ", ".join(f"{person(cast, w)}{' (screen ' + sides[w] + ')' if w in sides else ''}" for w in s.get("in_frame", [])) + "; no one else."
        lines = [head]
        notes = [c["note"] for c in s.get("changes_before", []) if c.get("note")]
        if notes and i:
            lines.append("  Across the cut: " + "; ".join(n.rstrip(".") for n in notes) + ".")
        events: list[tuple[float, int, str]] = []
        for b in s.get("beats", []):
            actor = "The camera" if b["who"] == "camera" else cap(person(cast, b["who"]))
            events.append((float(b["t"][0]), 0, f"{fmt_t(b['t'][0])}–{fmt_t(b['t'][1])} s: {beat_sentence(actor, b['do'])}"))
        for ln in s.get("lines", []):
            who = person(cast, ln["who"]).upper()
            tag = cast_tag(cast, ln["who"], rows[s["id"]]["start"]) or ""
            note = ", ".join(x for x in ["off-screen" if ln.get("offscreen") else "", ln.get("delivery", "")] if x)
            events.append((float(ln["at"]), 1, f"{fmt_t(ln['at'])} s: {who} ({tag}{', ' + note if note else ''}) says: \"{ln['text']}\""))
        for sd in s.get("sounds", []):
            if "at" in sd:
                events.append((float(sd["at"]), 2, f"{fmt_t(sd['at'])} s: sound of {sd['what']}."))
        for _, _, text in sorted(events, key=lambda e: (e[0], e[1])):
            lines.append("  " + text)
        for w, note in s.get("perform", {}).items():
            lines.append(f"  {cap(person(cast, w))}'s performance: {note.rstrip('.')}.")
        if s.get("must_show"):
            lines.append("  Must read clearly: " + "; ".join(x.rstrip(".") for x in s["must_show"]) + ".")
        if s.get("keep_hidden"):
            lines.append("  Keep out of view: " + "; ".join(x.rstrip(".") for x in s["keep_hidden"]) + ".")
        out.append("\n".join(lines))

    # 7 END STATE: what the next clip starts from
    end = []
    for w in people:
        pos = last["positions"].get(w)
        if pos and pos != first["positions"].get(w):
            end.append(f"{cap(person(cast, w))} ends {pos}.")
        hh = describe_hands(cast, props, last, w)
        if hh:
            end.append(hh[0].upper() + hh[1:] + ".")
    for p in shown_props:
        if not held_by(last, p) and last["props"].get(p) and last["props"].get(p) != first["props"].get(p):
            end.append(f"{cap(props[p].get('short', p))}: {last['props'][p]}.")
    if gen.get("end_note"):
        end.append(gen["end_note"])
    if end:
        out.append("END STATE: " + " ".join(end))

    # 8 AUDIO and AVOID, once
    audio = g.get("audio", {})
    ambs = list(dict.fromkeys(sd["what"] for s in shots for sd in s.get("sounds", []) if sd.get("cause") == "ambience"))
    kept: list[str] = []
    for a_ in sorted(ambs, key=len, reverse=True):  # "wind" adds nothing next to "wind, warm room tone"
        if not any(a_.lower() in k.lower() for k in kept):
            kept.append(a_)
    amb = "; ".join(a_ for a_ in ambs if a_ in kept)
    has_lines = any(s.get("lines") for s in shots)
    policy = audio.get("dialogue", "native")
    if has_lines and policy == "native":
        speech = "Speech: only the lines written above, word for word, by the named speaker; listeners' mouths stay closed."
    elif has_lines:
        speech = "Speech: the written lines are mouthed in sync for a recording added in post; no other speech."
    else:
        speech = "Speech: none; no one speaks."
    out.append("AUDIO: " + " ".join(x for x in [f"Ambience: {amb}." if amb else "", speech, "No music, no score, no singing." if not audio.get("music") else ""] if x))
    avoid = list(dict.fromkeys(g.get("avoid", [])))
    if avoid:
        out.append("AVOID: " + "; ".join(avoid) + ".")
    return "\n\n".join(out)


def ledger_table(ledger: list[dict[str, Any]], plan: dict[str, Any]) -> str:
    rows = ["| Shot | Who and where | Hands | Props | Set |", "|---|---|---|---|---|"]
    for row in ledger:
        e = row["end"]
        who = "; ".join(f"{w}: {p}" for w, p in e["positions"].items())
        hands = "; ".join(f"{w}: L {h.get('left') or '-'} / R {h.get('right') or '-'}" for w, h in e["hands"].items())
        props = "; ".join(f"{p}: {v}" for p, v in e["props"].items())
        env = "; ".join(f"{k}: {v}" for k, v in e["env"].items())
        rows.append(f"| {row['shot']} | {who} | {hands} | {props} | {env} |")
    return "\n".join(rows)


def load(path: str) -> dict[str, Any]:
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("command", choices=["validate", "compile", "ledger"])
    ap.add_argument("plan")
    ap.add_argument("--json", action="store_true", help="validate: print the findings as JSON")
    ap.add_argument("--strict", action="store_true", help="validate: warnings fail too")
    ap.add_argument("--generation", help="compile: only this generation id")
    ap.add_argument("--force", action="store_true", help="compile even when the plan has errors")
    args = ap.parse_args(argv)
    try:
        plan = load(args.plan)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"Cannot read the plan: {exc}", file=sys.stderr)
        return 2
    report, ledger = validate(plan)
    if args.command == "validate":
        if args.json:
            print(json.dumps({"errors": len(report.errors), "findings": [f.as_dict() for f in report.findings]}, indent=2, ensure_ascii=False))
        else:
            for f in report.findings:
                print(f"{f.severity.upper():5} {f.code:22} {f.where:14} {f.message}")
            print(f"{len(report.errors)} error(s), {len(report.findings) - len(report.errors)} other finding(s).")
        failing = report.errors or (args.strict and report.findings)
        return 1 if failing else 0
    if args.command == "ledger":
        print(ledger_table(ledger, plan))
        return 1 if report.errors else 0
    if report.errors and not args.force:
        print(f"The plan has {len(report.errors)} error(s); run validate, fix them, or pass --force.", file=sys.stderr)
        return 1
    for gen in plan["generations"]:
        if args.generation and gen["id"] != args.generation:
            continue
        print(f"===== {gen['id']} ({gen['seconds']:g} s) =====")
        print(compile_generation(plan, gen, ledger))
        print()
    return 0


if __name__ == "__main__":
    sys.exit(main())
