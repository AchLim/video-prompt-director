import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Minimal parser for the YAML subset SKILL.md uses: `key: value` lines,
 * quoted strings, and one level of nested map (for `metadata`).
 * Anything outside this subset is reported as an error rather than guessed at.
 */
export type FrontmatterValue = string | Record<string, string>;

export interface ParsedSkill {
  data: Record<string, FrontmatterValue>;
  rawFrontmatter: string;
  body: string;
}

export class FrontmatterError extends Error {}

export function splitFrontmatter(text: string): { raw: string; body: string } {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) throw new FrontmatterError("SKILL.md must start with a '---' line (YAML frontmatter).");
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) throw new FrontmatterError("Frontmatter is not closed with a '---' line.");
  const after = normalized.indexOf("\n", end + 4);
  return { raw: normalized.slice(4, end), body: after === -1 ? "" : normalized.slice(after + 1) };
}

function unquote(value: string, lineNo: number): string {
  const v = value.trim();
  if (v.startsWith('"')) {
    if (!v.endsWith('"') || v.length < 2) throw new FrontmatterError(`Line ${lineNo}: unterminated double-quoted string.`);
    return v.slice(1, -1).replace(/\\(["\\])/g, "$1");
  }
  if (v.startsWith("'")) {
    if (!v.endsWith("'") || v.length < 2) throw new FrontmatterError(`Line ${lineNo}: unterminated single-quoted string.`);
    return v.slice(1, -1).replace(/''/g, "'");
  }
  if (/^[>|]/.test(v)) throw new FrontmatterError(`Line ${lineNo}: block scalars (> or |) are not supported; use a single line.`);
  if (/: /.test(v) || v.endsWith(":")) throw new FrontmatterError(`Line ${lineNo}: unquoted value contains ': '; wrap it in double quotes.`);
  if (/ #/.test(v)) throw new FrontmatterError(`Line ${lineNo}: unquoted value contains ' #' (YAML comment); wrap it in double quotes.`);
  return v;
}

export function parseFrontmatter(raw: string): Record<string, FrontmatterValue> {
  const data: Record<string, FrontmatterValue> = {};
  let currentMap: Record<string, string> | undefined;
  raw.split("\n").forEach((line, i) => {
    const lineNo = i + 2; // +1 for 1-based, +1 for the opening ---
    if (line.trim() === "" || line.trim().startsWith("#")) return;
    const nested = /^ {2}([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (nested && currentMap) {
      currentMap[nested[1] as string] = unquote(nested[2] as string, lineNo);
      return;
    }
    const top = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!top) throw new FrontmatterError(`Line ${lineNo}: unsupported frontmatter syntax: ${line}`);
    const key = top[1] as string;
    const value = top[2] as string;
    if (key in data) throw new FrontmatterError(`Line ${lineNo}: duplicate key '${key}'.`);
    if (value.trim() === "") {
      currentMap = {};
      data[key] = currentMap;
    } else {
      currentMap = undefined;
      data[key] = unquote(value, lineNo);
    }
  });
  return data;
}

export function parseSkill(text: string): ParsedSkill {
  const { raw, body } = splitFrontmatter(text);
  return { data: parseFrontmatter(raw), rawFrontmatter: raw, body };
}

/** Fields defined by the Agent Skills open standard (agentskills.io/specification). */
export const STANDARD_FIELDS = ["name", "description", "license", "compatibility", "metadata", "allowed-tools"] as const;
/** Extra fields Claude Code understands (code.claude.com/docs/en/skills). */
export const CLAUDE_CODE_FIELDS = [
  "when_to_use", "argument-hint", "arguments", "disable-model-invocation", "user-invocable", "allowed-tools",
  "disallowed-tools", "model", "effort", "context", "agent", "background", "hooks", "paths", "shell",
] as const;

/** Claude.ai's custom-skill upload guide caps description at 200 characters. */
export const CLAUDE_AI_DESCRIPTION_LIMIT = 200;

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  skill?: ParsedSkill;
}

/** Validate a skill folder against the Agent Skills spec plus Claude.ai upload limits. */
export function validateSkillDir(skillDir: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const skillFile = path.join(skillDir, "SKILL.md");
  if (!existsSync(skillFile)) return { errors: [`Missing ${skillFile}`], warnings };

  let skill: ParsedSkill;
  try {
    skill = parseSkill(readFileSync(skillFile, "utf8"));
  } catch (e) {
    return { errors: [`SKILL.md frontmatter: ${(e as Error).message}`], warnings };
  }
  const { data, body } = skill;

  const name = data.name;
  if (typeof name !== "string" || name === "") errors.push("Frontmatter 'name' is required.");
  else {
    if (name.length > 64) errors.push("'name' must be at most 64 characters.");
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) errors.push("'name' may only use lowercase letters, digits and single hyphens, not at the start or end.");
    if (name !== path.basename(skillDir)) errors.push(`'name' (${name}) must match the folder name (${path.basename(skillDir)}).`);
  }

  const description = data.description;
  if (typeof description !== "string" || description.trim() === "") errors.push("Frontmatter 'description' is required.");
  else {
    if (description.length > 1024) errors.push("'description' must be at most 1024 characters.");
    if (description.length > CLAUDE_AI_DESCRIPTION_LIMIT)
      errors.push(`'description' is ${description.length} characters; Claude.ai uploads allow at most ${CLAUDE_AI_DESCRIPTION_LIMIT}.`);
    if (/[<>]/.test(description)) errors.push("'description' must not contain < or >.");
  }

  const whenToUse = data.when_to_use;
  if (typeof whenToUse === "string" && typeof description === "string" && description.length + whenToUse.length > 1536)
    warnings.push("description + when_to_use exceed 1,536 characters and will be truncated in Claude Code's skill listing.");

  if (data.metadata !== undefined && typeof data.metadata !== "object") errors.push("'metadata' must be a map of string keys to string values.");
  if (typeof data.compatibility === "string" && data.compatibility.length > 500) errors.push("'compatibility' must be at most 500 characters.");

  const known = new Set<string>([...STANDARD_FIELDS, ...CLAUDE_CODE_FIELDS]);
  for (const key of Object.keys(data)) if (!known.has(key)) warnings.push(`Unknown frontmatter field '${key}' will be ignored.`);

  const lines = body.split("\n").length;
  if (lines > 500) warnings.push(`SKILL.md body is ${lines} lines; the recommended maximum is 500.`);

  // Every supporting file mentioned in SKILL.md must exist.
  const refs = new Set(body.match(/\b(?:references|templates|examples|scripts)\/[A-Za-z0-9._-]+\.(?:md|mjs|js|py)\b/g) ?? []);
  for (const ref of refs) if (!existsSync(path.join(skillDir, ref))) errors.push(`SKILL.md references missing file: ${ref}`);

  return { errors, warnings, skill };
}

/**
 * Rewrite SKILL.md for surfaces that only accept the open-standard fields
 * (Claude.ai upload): drop Claude Code-only keys such as `when_to_use`.
 */
export function toStandardSkillMd(text: string): string {
  const { raw, body } = splitFrontmatter(text);
  const keep: string[] = [];
  let skipping = false;
  for (const line of raw.split("\n")) {
    const top = /^([A-Za-z0-9_-]+):/.exec(line);
    if (top) skipping = !(STANDARD_FIELDS as readonly string[]).includes(top[1] as string);
    if (!skipping) keep.push(line);
  }
  return `---\n${keep.join("\n")}\n---\n${body}`;
}
