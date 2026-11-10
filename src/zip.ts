import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { deflateRawSync } from "node:zlib";
import { toStandardSkillMd, validateSkillDir } from "./frontmatter.ts";
import { listFiles } from "./manifest.ts";
import { packageInfo, SKILL_NAME, SKILL_SOURCE_DIR } from "./package-info.ts";

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

export function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = (CRC_TABLE[(c ^ (buf[i] as number)) & 0xff] as number) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(d: Date): { time: number; date: number } {
  return {
    time: (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2),
    date: ((Math.max(d.getFullYear(), 1980) - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
  };
}

export interface ZipEntry {
  name: string; // forward slashes; directories end with "/"
  data: Buffer;
}

/** Minimal ZIP writer (deflate, UTF-8 names). Enough for skill bundles; no dependencies. */
export function buildZip(entries: ZipEntry[], mtime = new Date()): Buffer {
  const { time, date } = dosDateTime(mtime);
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name, "utf8");
    const isDir = e.name.endsWith("/");
    const compressed = isDir ? Buffer.alloc(0) : deflateRawSync(e.data, { level: 9 });
    const useDeflate = !isDir && compressed.length < e.data.length;
    const body = useDeflate ? compressed : e.data;
    const crc = crc32(e.data);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(useDeflate ? 8 : 0, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(e.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    locals.push(local, name, body);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE((3 << 8) | 20, 4); // made by: Unix, so permissions below are honoured
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(useDeflate ? 8 : 0, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(e.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30); // extra
    central.writeUInt16LE(0, 32); // comment
    central.writeUInt16LE(0, 34); // disk
    central.writeUInt16LE(0, 36); // internal attrs
    central.writeUInt32LE((((isDir ? 0o40755 : 0o100644) << 16) | (isDir ? 0x10 : 0)) >>> 0, 38);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);

    offset += local.length + name.length + body.length;
  }
  const centralSize = centrals.reduce((n, b) => n + b.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

/**
 * Build the Claude.ai upload bundle: a ZIP whose root holds the `video-prompt-director/`
 * folder. SKILL.md is rewritten to open-standard frontmatter fields only.
 */
export function exportSkillZip(outDir: string, source = SKILL_SOURCE_DIR): { file: string; entries: string[] } {
  const check = validateSkillDir(source);
  if (check.errors.length) throw new Error(`Skill is not valid, refusing to export:\n  ${check.errors.join("\n  ")}`);

  const files = listFiles(source);
  const dirs = new Set<string>([`${SKILL_NAME}/`]);
  for (const f of files) {
    const parts = f.split("/");
    for (let i = 1; i < parts.length; i++) dirs.add(`${SKILL_NAME}/${parts.slice(0, i).join("/")}/`);
  }
  const entries: ZipEntry[] = [...dirs].sort().map((name) => ({ name, data: Buffer.alloc(0) }));
  for (const f of files) {
    let data = readFileSync(path.join(source, ...f.split("/")));
    if (f === "SKILL.md") data = Buffer.from(toStandardSkillMd(data.toString("utf8")), "utf8");
    entries.push({ name: `${SKILL_NAME}/${f}`, data });
  }
  mkdirSync(outDir, { recursive: true });
  const file = path.join(outDir, `${SKILL_NAME}-${packageInfo().version}.zip`);
  writeFileSync(file, buildZip(entries));
  return { file, entries: entries.map((e) => e.name) };
}
