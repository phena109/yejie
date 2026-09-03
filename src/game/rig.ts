import type { AnimClip, Archetype, Dir, Gender, Unit } from "./types";

export interface Proj {
  x: number;
  y: number;
  d: number;
}

export type ProjectFn = (lx: number, ly: number, lz: number) => Proj;

export const CHAR_H = 2.55;
export const ATTACK_MS = 420;
export const CAST_MS = 520;

/** Voxel grid: ~14 wide, 10 deep, 20 tall. One cube = one pixel. */
const VH = 20;
const VOX_XY = 0.056;
const VOX_Z = 1 / VH;

interface RGB {
  r: number;
  g: number;
  b: number;
}

const P = {
  legL: 0,
  legR: 1,
  hip: 2,
  torso: 3,
  head: 4,
  hair: 5,
  armL: 6,
  armR: 7,
  gear: 8,
  weap: 9,
} as const;
type Part = (typeof P)[keyof typeof P];

interface Vox {
  x: number;
  y: number;
  z: number;
  p: Part;
  ci: number;
}

interface Off {
  x: number;
  y: number;
  z: number;
}

type Grid = Map<string, { p: Part; ci: number }>;

const C_SKIN = 0;
const C_HAIR = 1;
const C_SHIRT = 2;
const C_PANTS = 3;
const C_ACCENT = 4;
const C_EXTRA = 5;
const C_METAL = 6;
const C_SHOE = 7;
const C_EYE = 8;
const C_SPARK = 9;

function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}

const EYE = rgb(22, 16, 18);
const SHOE_DK = rgb(28, 24, 26);

function palettes(arch: Archetype, gender: Gender): RGB[] {
  const eye = EYE;
  const shoe = SHOE_DK;
  let skin: RGB;
  let hair: RGB;
  let shirt: RGB;
  let pants: RGB;
  let accent: RGB;
  let extra: RGB;
  let metal: RGB;
  switch (arch) {
    case "mara":
      skin = rgb(196, 154, 118);
      hair = rgb(42, 32, 28);
      shirt = rgb(28, 72, 78);
      pants = rgb(22, 28, 36);
      accent = rgb(62, 240, 208);
      extra = rgb(18, 48, 56);
      metal = rgb(180, 190, 200);
      break;
    case "dana":
      skin = rgb(168, 114, 82);
      hair = rgb(28, 22, 20);
      shirt = rgb(62, 78, 48);
      pants = rgb(36, 32, 28);
      accent = rgb(190, 210, 120);
      extra = rgb(48, 58, 40);
      metal = rgb(160, 150, 130);
      break;
    case "priya":
      skin = rgb(150, 96, 64);
      hair = rgb(24, 16, 14);
      shirt = rgb(232, 236, 240);
      pants = rgb(40, 70, 78);
      accent = rgb(40, 180, 150);
      extra = rgb(200, 80, 80);
      metal = rgb(210, 214, 220);
      break;
    case "hale":
      skin = rgb(210, 170, 132);
      hair = rgb(90, 78, 68);
      shirt = rgb(48, 52, 64);
      pants = rgb(32, 34, 42);
      accent = rgb(255, 200, 87);
      extra = rgb(70, 74, 88);
      metal = rgb(170, 160, 140);
      break;
    case "crosby":
      skin = rgb(188, 148, 112);
      hair = rgb(36, 28, 24);
      shirt = rgb(48, 22, 28);
      pants = rgb(28, 16, 20);
      accent = rgb(255, 200, 87);
      extra = rgb(28, 12, 18);
      metal = rgb(212, 176, 80);
      break;
    case "beckett":
      skin = rgb(176, 132, 98);
      hair = rgb(48, 30, 24);
      shirt = rgb(88, 28, 32);
      pants = rgb(30, 20, 24);
      accent = rgb(255, 140, 70);
      extra = rgb(52, 18, 22);
      metal = rgb(190, 150, 90);
      break;
    case "delinquent":
      if (gender === "f") {
        skin = rgb(200, 160, 128);
        hair = rgb(120, 40, 50);
        shirt = rgb(90, 40, 80);
        pants = rgb(30, 28, 36);
        accent = rgb(220, 90, 120);
        extra = rgb(40, 20, 40);
        metal = rgb(160, 160, 170);
      } else {
        skin = rgb(186, 140, 104);
        hair = rgb(20, 18, 18);
        shirt = rgb(44, 70, 48);
        pants = rgb(28, 28, 32);
        accent = rgb(180, 200, 80);
        extra = rgb(36, 42, 36);
        metal = rgb(150, 150, 155);
      }
      break;
    case "magician":
      if (gender === "f") {
        skin = rgb(214, 176, 148);
        hair = rgb(48, 28, 70);
        shirt = rgb(72, 48, 110);
        pants = rgb(28, 20, 48);
        accent = rgb(180, 140, 255);
        extra = rgb(40, 24, 70);
        metal = rgb(220, 200, 120);
      } else {
        skin = rgb(176, 136, 108);
        hair = rgb(20, 18, 28);
        shirt = rgb(36, 32, 58);
        pants = rgb(22, 20, 36);
        accent = rgb(140, 170, 255);
        extra = rgb(24, 22, 44);
        metal = rgb(200, 190, 140);
      }
      break;
    case "wolverine":
      skin = rgb(120, 78, 48);
      hair = rgb(64, 40, 24);
      shirt = rgb(96, 62, 36);
      pants = rgb(70, 46, 28);
      accent = rgb(200, 90, 40);
      extra = rgb(48, 30, 18);
      metal = rgb(230, 220, 200);
      break;
    case "boxer":
      if (gender === "f") {
        skin = rgb(168, 112, 86);
        hair = rgb(30, 22, 20);
        shirt = rgb(200, 70, 80);
        pants = rgb(40, 36, 44);
        accent = rgb(255, 180, 160);
        extra = rgb(220, 210, 200);
        metal = rgb(240, 230, 220);
      } else {
        skin = rgb(198, 150, 112);
        hair = rgb(40, 28, 22);
        shirt = rgb(40, 48, 70);
        pants = rgb(36, 36, 42);
        accent = rgb(220, 80, 70);
        extra = rgb(230, 220, 210);
        metal = rgb(240, 230, 220);
      }
      break;
    case "gunner":
      if (gender === "f") {
        skin = rgb(186, 142, 110);
        hair = rgb(70, 48, 32);
        shirt = rgb(50, 56, 62);
        pants = rgb(28, 30, 34);
        accent = rgb(120, 180, 200);
        extra = rgb(36, 40, 46);
        metal = rgb(80, 80, 84);
      } else {
        skin = rgb(160, 120, 90);
        hair = rgb(24, 20, 18);
        shirt = rgb(48, 52, 48);
        pants = rgb(26, 28, 30);
        accent = rgb(160, 170, 90);
        extra = rgb(32, 36, 34);
        metal = rgb(70, 70, 74);
      }
      break;
    case "worker":
      skin = rgb(190, 148, 112);
      hair = rgb(50, 40, 32);
      shirt = rgb(210, 160, 40);
      pants = rgb(40, 44, 52);
      accent = rgb(40, 40, 44);
      extra = rgb(180, 90, 30);
      metal = rgb(200, 180, 80);
      break;
    case "official":
      skin = rgb(208, 166, 132);
      hair = rgb(36, 28, 24);
      shirt = rgb(240, 236, 230);
      pants = rgb(32, 36, 48);
      accent = rgb(60, 90, 140);
      extra = rgb(28, 36, 56);
      metal = rgb(180, 170, 140);
      break;
  }
  return [skin, hair, shirt, pants, accent, extra, metal, shoe, eye, accent];
}

const hexMemo = new Map<string, string>();

function hex(c: RGB, shade = 1): string {
  const k = Math.max(0.35, Math.min(1.28, shade));
  const key = `${c.r},${c.g},${c.b}:${(k * 100) | 0}`;
  const hit = hexMemo.get(key);
  if (hit) return hit;
  const r = Math.round(Math.min(255, c.r * k));
  const g = Math.round(Math.min(255, c.g * k));
  const b = Math.round(Math.min(255, c.b * k));
  const s = `rgb(${r},${g},${b})`;
  hexMemo.set(key, s);
  return s;
}

export function clipDuration(clip: AnimClip): number {
  if (clip === "attack") return ATTACK_MS;
  if (clip === "cast") return CAST_MS;
  return 0;
}

function activeClip(u: Unit, now: number): { clip: AnimClip; t: number } {
  const dur = clipDuration(u.anim);
  if (dur > 0) {
    const clock = typeof performance !== "undefined" ? performance.now() : now;
    const t = (clock - u.animStart) / dur;
    if (t < 1) return { clip: u.anim, t: Math.max(0, t) };
  }
  if (u.anim === "walk") return { clip: "walk", t: (now / 280) % 1 };
  return { clip: "idle", t: (now / 900) % 1 };
}

function poseId(u: Unit, now: number): string {
  const { clip, t } = activeClip(u, now);
  if (clip === "idle") {
    const bob = Math.sin(now / 420 + u.x * 1.7) > 0 ? 1 : 0;
    return `i${bob}`;
  }
  if (clip === "walk") return t < 0.5 ? "w0" : "w1";
  if (clip === "attack") return t < 0.35 ? "a0" : t < 0.62 ? "a1" : "a2";
  return t < 0.55 ? "c1" : "c0";
}

function rotFacing(x: number, y: number, dir: Dir): { x: number; y: number } {
  switch (dir) {
    case 0:
      return { x, y: -y };
    case 1:
      return { x: y, y: x };
    case 2:
      return { x: -x, y };
    case 3:
      return { x: -y, y: -x };
  }
}

export function localToGrid(lx: number, ly: number, dir: Dir): { x: number; y: number } {
  return rotFacing(lx, ly, dir);
}

function vk(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

function put(g: Grid, x: number, y: number, z: number, p: Part, ci: number): void {
  g.set(vk(x, y, z), { p, ci });
}

function fill(g: Grid, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, p: Part, ci: number): void {
  const xa = x0 < x1 ? x0 : x1;
  const xb = x0 < x1 ? x1 : x0;
  const ya = y0 < y1 ? y0 : y1;
  const yb = y0 < y1 ? y1 : y0;
  const za = z0 < z1 ? z0 : z1;
  const zb = z0 < z1 ? z1 : z0;
  for (let x = xa; x <= xb; x++) {
    for (let y = ya; y <= yb; y++) {
      for (let z = za; z <= zb; z++) put(g, x, y, z, p, ci);
    }
  }
}

function voxelize(g: Grid): Vox[] {
  const out: Vox[] = [];
  for (const [key, v] of g) {
    const p1 = key.indexOf(",");
    const p2 = key.indexOf(",", p1 + 1);
    out.push({
      x: Number(key.slice(0, p1)),
      y: Number(key.slice(p1 + 1, p2)),
      z: Number(key.slice(p2 + 1)),
      p: v.p,
      ci: v.ci,
    });
  }
  return out;
}

function humanoid(g: Grid, woman: boolean, thick: boolean, squat: boolean): void {
  const hipZ = squat ? 6 : 7;
  const torsoZ = hipZ + 2;
  const headZ = torsoZ + 5;
  const hipW = woman ? 3 : 2;
  const shW = thick ? 4 : woman ? 3 : 3;
  const torsoW = woman ? 2 : 3;
  const armX = shW + 1;
  const armW = thick ? 2 : woman ? 0 : 1;
  const legW = woman ? 1 : thick ? 2 : 1;

  fill(g, -legW - 1, -1, 0, -1, 1, 1, P.legL, C_SHOE);
  fill(g, 1, -1, 0, legW + 1, 1, 1, P.legR, C_SHOE);
  fill(g, -legW - 1, -1, 2, -1, 1, hipZ - 1, P.legL, C_SKIN);
  fill(g, 1, -1, 2, legW + 1, 1, hipZ - 1, P.legR, C_SKIN);

  fill(g, -hipW, -1, hipZ, hipW, 1, hipZ + 1, P.hip, C_SKIN);
  if (woman) {
    fill(g, -torsoW, -1, torsoZ, torsoW, 1, torsoZ + 1, P.torso, C_SKIN);
    fill(g, -shW, -1, torsoZ + 2, shW, 2, torsoZ + 4, P.torso, C_SKIN);
    put(g, -1, 2, torsoZ + 3, P.torso, C_SKIN);
    put(g, 0, 2, torsoZ + 3, P.torso, C_SKIN);
    put(g, 1, 2, torsoZ + 3, P.torso, C_SKIN);
  } else {
    fill(g, -torsoW, -2, torsoZ, torsoW, 1, torsoZ + 4, P.torso, C_SKIN);
    if (thick) fill(g, -shW, -2, torsoZ + 2, shW, 2, torsoZ + 4, P.torso, C_SKIN);
  }

  fill(g, -1, -1, headZ - 1, 1, 1, headZ - 1, P.head, C_SKIN);
  if (woman) fill(g, -2, -1, headZ, 1, 2, headZ + 3, P.head, C_SKIN);
  else fill(g, -2, -2, headZ, 2, 2, headZ + 3, P.head, C_SKIN);
  put(g, -1, 2, headZ + 1, P.head, C_EYE);
  put(g, 1, 2, headZ + 1, P.head, C_EYE);
  put(g, 0, 3, headZ + 1, P.head, C_SKIN);
  put(g, 0, 2, headZ, P.head, C_SKIN);

  const armTop = torsoZ + 4;
  const armBot = squat ? hipZ + 1 : hipZ;
  fill(g, -armX - armW, -1, armBot, -armX, 1, armTop, P.armL, C_SKIN);
  fill(g, armX, -1, armBot, armX + armW, 1, armTop, P.armR, C_SKIN);
}

function hairCap(g: Grid, style: "pony" | "short" | "long" | "bun" | "messy" | "sides" | "buzz" | "hood" | "mohawk"): void {
  const top = 19;
  if (style === "sides") {
    fill(g, -2, -2, 16, -2, 2, 18, P.hair, C_HAIR);
    fill(g, 2, -2, 16, 2, 2, 18, P.hair, C_HAIR);
    fill(g, -2, -2, 18, 2, 2, 18, P.hair, C_HAIR);
    return;
  }
  if (style === "buzz") {
    fill(g, -2, -2, 18, 2, 2, 18, P.hair, C_HAIR);
    return;
  }
  if (style === "mohawk") {
    fill(g, 0, -2, 18, 0, 2, top, P.hair, C_HAIR);
    fill(g, -1, -1, 18, 1, 1, 18, P.hair, C_HAIR);
    return;
  }
  fill(g, -2, -2, 17, 2, 2, top, P.hair, C_HAIR);
  fill(g, -2, -2, 16, 2, -2, 18, P.hair, C_HAIR);
  if (style === "pony") {
    fill(g, 2, -2, 14, 3, -1, 18, P.hair, C_HAIR);
    fill(g, 3, -2, 12, 3, -1, 15, P.hair, C_HAIR);
  } else if (style === "long") {
    fill(g, -2, -3, 12, 2, -2, 18, P.hair, C_HAIR);
    fill(g, -2, -3, 10, 2, -2, 12, P.hair, C_HAIR);
  } else if (style === "bun") {
    fill(g, -1, -3, 18, 1, -2, top, P.hair, C_HAIR);
  } else if (style === "messy") {
    put(g, -3, 0, 18, P.hair, C_HAIR);
    put(g, 3, 1, 19, P.hair, C_HAIR);
    put(g, 0, -3, 19, P.hair, C_HAIR);
    fill(g, -2, 2, 17, 2, 2, 18, P.hair, C_HAIR);
  } else if (style === "hood") {
    fill(g, -3, -2, 16, 3, 2, top, P.hair, C_HAIR);
    fill(g, -3, 2, 14, 3, 3, 18, P.hair, C_HAIR);
    fill(g, -3, -3, 14, 3, -2, 18, P.hair, C_HAIR);
  }
}

function clothesPants(g: Grid, woman: boolean, squat: boolean): void {
  const hipZ = squat ? 6 : 7;
  const hipW = woman ? 3 : 2;
  fill(g, -hipW, -1, hipZ, hipW, 1, hipZ + 1, P.hip, C_PANTS);
  fill(g, woman ? -2 : -2, -1, 2, -1, 1, hipZ - 1, P.legL, C_PANTS);
  fill(g, 1, -1, 2, woman ? 2 : 2, 1, hipZ - 1, P.legR, C_PANTS);
}

function clothesShirt(g: Grid, woman: boolean, thick: boolean): void {
  const hipZ = 7;
  const torsoZ = hipZ + 2;
  const shW = thick ? 4 : woman ? 3 : 3;
  const torsoW = woman ? 2 : 3;
  if (woman) {
    fill(g, -torsoW, -1, torsoZ, torsoW, 1, torsoZ + 1, P.torso, C_SHIRT);
    fill(g, -shW, -1, torsoZ + 2, shW, 2, torsoZ + 4, P.torso, C_SHIRT);
  } else {
    fill(g, -torsoW, -2, torsoZ, torsoW, 1, torsoZ + 4, P.torso, C_SHIRT);
    if (thick) fill(g, -shW, -2, torsoZ + 2, shW, 1, torsoZ + 4, P.torso, C_SHIRT);
  }
  fill(g, woman ? -3 : -3, -1, torsoZ - 1, woman ? 3 : 3, 1, torsoZ - 1, P.hip, C_EXTRA);
}

function jacket(g: Grid, ci: number, long: boolean): void {
  fill(g, -3, -2, 9, 3, 2, 13, P.torso, ci);
  fill(g, -3, -2, 14, 3, 1, 14, P.torso, ci);
  if (long) fill(g, -3, -3, 4, 3, -2, 12, P.torso, ci);
}

function baton(g: Grid): void {
  fill(g, 5, 2, 8, 5, 5, 8, P.weap, C_METAL);
  put(g, 5, 2, 8, P.weap, C_EXTRA);
}

function knife(g: Grid): void {
  fill(g, 5, 1, 8, 5, 4, 8, P.weap, C_METAL);
  put(g, 5, 1, 8, P.weap, C_EXTRA);
}

function rifle(g: Grid): void {
  fill(g, 4, 1, 11, 5, 6, 12, P.weap, C_METAL);
  put(g, 5, 6, 12, P.weap, C_EXTRA);
  put(g, 4, 2, 10, P.weap, C_METAL);
}

function gloves(g: Grid, thick: boolean): void {
  const s = thick ? 2 : 1;
  fill(g, -6 - (thick ? 1 : 0), -1, 7, -5, 1 + s - 1, 9, P.armL, C_EXTRA);
  fill(g, 5, -1, 7, 6 + (thick ? 1 : 0), 1 + s - 1, 9, P.armR, C_EXTRA);
}

function beast(g: Grid, woman: boolean): void {
  const w = woman ? 1 : 2;
  fill(g, -w, -3, 4, w, 3, 8, P.torso, C_SHIRT);
  fill(g, -w, -2, 8, w, 2, 9, P.torso, C_SHIRT);
  fill(g, -w, 2, 6, w, 5, 10, P.head, C_SKIN);
  fill(g, -1, 5, 6, 1, 7, 8, P.head, C_SKIN);
  put(g, -1, 7, 8, P.head, C_EYE);
  put(g, 1, 7, 8, P.head, C_EYE);
  put(g, 0, 7, 6, P.head, C_SHOE);
  put(g, -2, 3, 11, P.hair, C_HAIR);
  put(g, 2, 3, 11, P.hair, C_HAIR);
  fill(g, -2, 3, 10, -2, 4, 11, P.hair, C_HAIR);
  fill(g, 2, 3, 10, 2, 4, 11, P.hair, C_HAIR);
  fill(g, -1, -6, 6, 1, -4, 7, P.gear, C_HAIR);
  put(g, 0, -6, 5, P.gear, C_HAIR);
  fill(g, -3, -3, 0, -2, -1, 5, P.legL, C_PANTS);
  fill(g, 2, -3, 0, 3, -1, 5, P.legR, C_PANTS);
  fill(g, -3, -3, 0, -2, -1, 1, P.legL, C_SHOE);
  fill(g, 2, -3, 0, 3, -1, 1, P.legR, C_SHOE);
  fill(g, -3, 2, 0, -2, 4, 6, P.armL, C_SKIN);
  fill(g, 2, 2, 0, 3, 4, 6, P.armR, C_SKIN);
  fill(g, -3, 4, 0, -2, 6, 1, P.weap, C_METAL);
  fill(g, 2, 4, 0, 3, 6, 1, P.weap, C_METAL);
  put(g, -3, 6, 0, P.weap, C_METAL);
  put(g, 3, 6, 0, P.weap, C_METAL);
  fill(g, -2, -1, 3, 2, 1, 4, P.hip, C_PANTS);
}

function buildModel(arch: Archetype, gender: Gender): Vox[] {
  const g: Grid = new Map();
  const woman = gender === "f";
  if (arch === "wolverine") {
    beast(g, woman);
    return voxelize(g);
  }
  const thick = arch === "boxer" || arch === "crosby" || arch === "beckett";
  const squat = false;
  humanoid(g, woman, thick, squat);
  clothesPants(g, woman, squat);
  clothesShirt(g, woman, thick);

  switch (arch) {
    case "mara":
      jacket(g, C_EXTRA, false);
      fill(g, -3, 1, 11, 3, 2, 13, P.torso, C_ACCENT);
      hairCap(g, "pony");
      baton(g);
      put(g, 0, 2, 12, P.gear, C_METAL);
      break;
    case "dana":
      jacket(g, C_EXTRA, false);
      hairCap(g, "short");
      baton(g);
      fill(g, -4, 1, 13, -3, 2, 14, P.gear, C_METAL);
      put(g, -4, 2, 14, P.gear, C_ACCENT);
      break;
    case "priya":
      hairCap(g, "long");
      fill(g, -4, -1, 7, -3, 1, 10, P.gear, C_EXTRA);
      put(g, -3, 1, 9, P.gear, C_ACCENT);
      put(g, -4, 0, 8, P.gear, C_SHIRT);
      put(g, 0, 2, 12, P.torso, C_EXTRA);
      put(g, 0, 2, 11, P.torso, C_EXTRA);
      put(g, -1, 2, 12, P.torso, C_EXTRA);
      put(g, 1, 2, 12, P.torso, C_EXTRA);
      break;
    case "hale":
      hairCap(g, "sides");
      jacket(g, C_EXTRA, false);
      fill(g, 0, 2, 10, 0, 2, 12, P.gear, C_ACCENT);
      put(g, 0, 2, 16, P.head, C_HAIR);
      put(g, -1, 2, 16, P.head, C_HAIR);
      put(g, 1, 2, 16, P.head, C_HAIR);
      break;
    case "crosby":
      jacket(g, C_EXTRA, true);
      hairCap(g, "short");
      rifle(g);
      put(g, -2, 2, 11, P.gear, C_ACCENT);
      put(g, 2, 2, 11, P.gear, C_ACCENT);
      fill(g, -3, -3, 13, 3, -2, 18, P.torso, C_EXTRA);
      break;
    case "beckett":
      jacket(g, C_EXTRA, true);
      hairCap(g, "short");
      rifle(g);
      fill(g, -3, 2, 10, 3, 2, 11, P.torso, C_ACCENT);
      break;
    case "delinquent":
      hairCap(g, woman ? "messy" : "mohawk");
      fill(g, -3, -2, 8, 3, 2, 13, P.torso, C_SHIRT);
      fill(g, -3, -2, 14, 3, 2, 15, P.hair, C_SHIRT);
      if (woman) fill(g, -2, -2, 16, 2, 2, 18, P.hair, C_HAIR);
      knife(g);
      break;
    case "magician":
      for (let z = 1; z <= 12; z++) {
        const w = z < 5 ? 4 : z < 9 ? 3 : 2;
        fill(g, -w, -2, z, w, 2, z, P.torso, z < 8 ? C_PANTS : C_SHIRT);
      }
      fill(g, -3, -3, 8, 3, 2, 14, P.torso, C_SHIRT);
      hairCap(g, woman ? "long" : "hood");
      if (!woman) fill(g, -3, -2, 16, 3, 2, 19, P.hair, C_EXTRA);
      fill(g, -1, 2, 12, 1, 3, 13, P.gear, C_ACCENT);
      put(g, 0, 3, 14, P.gear, C_SPARK);
      break;
    case "boxer":
      hairCap(g, woman ? "short" : "buzz");
      gloves(g, true);
      fill(g, -2, -1, 9, 2, 1, 12, P.torso, C_SHIRT);
      fill(g, -3, -1, 2, 3, 1, 6, P.hip, C_PANTS);
      put(g, 0, 2, 10, P.torso, C_ACCENT);
      break;
    case "gunner":
      hairCap(g, woman ? "short" : "buzz");
      rifle(g);
      fill(g, -3, -1, 9, 3, 2, 13, P.torso, C_EXTRA);
      put(g, 0, 2, 12, P.gear, C_ACCENT);
      fill(g, 4, 0, 10, 5, 1, 13, P.armR, C_SKIN);
      break;
    case "worker":
      hairCap(g, "short");
      fill(g, -3, -2, 18, 3, 2, 19, P.hair, C_METAL);
      fill(g, -4, -3, 18, 4, 3, 18, P.hair, C_METAL);
      fill(g, -3, -2, 9, 3, 2, 13, P.torso, C_SHIRT);
      put(g, 0, 2, 11, P.gear, C_ACCENT);
      fill(g, -3, -1, 8, 3, 1, 8, P.torso, C_EXTRA);
      break;
    case "official":
      hairCap(g, woman ? "bun" : "short");
      jacket(g, C_EXTRA, true);
      fill(g, 0, 2, 9, 0, 2, 13, P.gear, C_ACCENT);
      fill(g, -3, -2, 9, 3, 1, 13, P.torso, C_SHIRT);
      break;
  }
  return voxelize(g);
}

const modelCache = new Map<string, Vox[]>();

function modelOf(arch: Archetype, gender: Gender): Vox[] {
  const key = arch + gender;
  let m = modelCache.get(key);
  if (!m) {
    m = buildModel(arch, gender);
    modelCache.set(key, m);
  }
  return m;
}

function offsetsFor(arch: Archetype, pose: string): Off[] {
  const o: Off[] = [];
  for (let i = 0; i < 10; i++) o.push({ x: 0, y: 0, z: 0 });
  const set = (parts: Part[], x: number, y: number, z: number) => {
    for (const p of parts) {
      o[p].x += x;
      o[p].y += y;
      o[p].z += z;
    }
  };
  const upper: Part[] = [P.torso, P.head, P.hair, P.armL, P.armR, P.gear, P.weap];
  if (pose === "i1") {
    set(upper, 0, 0, 1);
    return o;
  }
  if (pose === "w0" || pose === "w1") {
    const a = pose === "w0";
    set([P.hip, P.torso, P.head, P.hair, P.gear], 0, 0, 1);
    o[P.legL].y = a ? 2 : -2;
    o[P.legL].z = a ? 1 : 0;
    o[P.legR].y = a ? -2 : 2;
    o[P.legR].z = a ? 0 : 1;
    o[P.armL].y = a ? -1 : 1;
    o[P.armR].y = a ? 1 : -1;
    o[P.weap].y = o[P.armR].y;
    return o;
  }
  if (pose[0] === "a") {
    const phase = pose === "a0" ? 0 : pose === "a1" ? 1 : 2;
    if (arch === "wolverine") {
      set([P.torso, P.head, P.hair], 0, phase === 1 ? 2 : 1, 0);
      set([P.armL, P.armR, P.weap], 0, phase === 1 ? 4 : 2, 0);
      o[P.legL].y = phase === 1 ? -1 : 0;
      o[P.legR].y = phase === 1 ? 2 : 0;
    } else if (arch === "boxer") {
      o[P.armR].y = phase === 0 ? -1 : phase === 1 ? 4 : 1;
      o[P.armR].z = phase === 1 ? 1 : 0;
      o[P.torso].y = phase === 1 ? 1 : 0;
      o[P.armL].y = -1;
      o[P.armL].z = 1;
    } else if (arch === "gunner" || arch === "crosby" || arch === "beckett") {
      o[P.armR].y = 2;
      o[P.armR].z = 1;
      o[P.weap].y = 2;
      o[P.torso].y = 1;
      o[P.armL].y = 1;
    } else {
      o[P.armR].y = phase === 0 ? -1 : phase === 1 ? 3 : 1;
      o[P.weap].y = o[P.armR].y + (phase === 1 ? 2 : 0);
      o[P.torso].y = phase === 1 ? 1 : 0;
      o[P.armL].y = -1;
    }
    return o;
  }
  if (pose[0] === "c") {
    const up = pose === "c1";
    set([P.armL, P.armR, P.weap], 0, 1, up ? 4 : 2);
    set([P.head, P.hair, P.torso], 0, 0, 1);
  }
  return o;
}

function extras(arch: Archetype, pose: string): Vox[] {
  const out: Vox[] = [];
  if (pose === "c1") {
    out.push(
      { x: -4, y: 2, z: 18, p: P.gear, ci: C_SPARK },
      { x: 4, y: 2, z: 18, p: P.gear, ci: C_SPARK },
      { x: -5, y: 3, z: 19, p: P.gear, ci: C_ACCENT },
      { x: 5, y: 3, z: 19, p: P.gear, ci: C_ACCENT },
      { x: 0, y: 3, z: 20, p: P.gear, ci: C_SPARK },
    );
  }
  if (pose === "a1" && (arch === "gunner" || arch === "crosby" || arch === "beckett")) {
    out.push({ x: 5, y: 7, z: 12, p: P.weap, ci: C_SPARK }, { x: 5, y: 8, z: 12, p: P.weap, ci: C_ACCENT });
  }
  return out;
}

interface Span {
  x: number;
  y: number;
  z0: number;
  z1: number;
  ci: number;
}

const spanCache = new Map<string, Span[]>();

function spansOf(arch: Archetype, gender: Gender, pose: string): Span[] {
  const key = `${arch}|${gender}|${pose}`;
  const hit = spanCache.get(key);
  if (hit) return hit;
  const model = modelOf(arch, gender);
  const off = offsetsFor(arch, pose);
  const occ = new Map<string, number>();
  for (const v of model) {
    const o = off[v.p];
    occ.set(vk(v.x + o.x, v.y + o.y, v.z + o.z), v.ci);
  }
  for (const e of extras(arch, pose)) occ.set(vk(e.x, e.y, e.z), e.ci);
  const cols = new Map<string, Array<{ z: number; ci: number }>>();
  for (const [k, ci] of occ) {
    const p1 = k.indexOf(",");
    const p2 = k.indexOf(",", p1 + 1);
    const x = Number(k.slice(0, p1));
    const y = Number(k.slice(p1 + 1, p2));
    const z = Number(k.slice(p2 + 1));
    const ck = `${x},${y}`;
    let list = cols.get(ck);
    if (!list) {
      list = [];
      cols.set(ck, list);
    }
    list.push({ z, ci });
  }
  const spans: Span[] = [];
  for (const [ck, list] of cols) {
    const p = ck.indexOf(",");
    const x = Number(ck.slice(0, p));
    const y = Number(ck.slice(p + 1));
    for (const item of list) spans.push({ x, y, z0: item.z, z1: item.z, ci: item.ci });
  }
  spanCache.set(key, spans);
  return spans;
}

function occSet(spans: Span[]): Set<string> {
  const s = new Set<string>();
  for (const sp of spans) {
    for (let z = sp.z0; z <= sp.z1; z++) s.add(vk(sp.x, sp.y, z));
  }
  return s;
}

const occCache = new Map<string, Set<string>>();

function occOf(arch: Archetype, gender: Gender, pose: string): Set<string> {
  const key = `${arch}|${gender}|${pose}`;
  let o = occCache.get(key);
  if (!o) {
    o = occSet(spansOf(arch, gender, pose));
    occCache.set(key, o);
  }
  return o;
}

const SHADE = [1.28, 1.02, 0.62, 0.88, 0.7, 0.5];

interface Face {
  pts: Proj[];
  fill: string;
  d: number;
}

function emitFace(
  faces: Face[],
  project: ProjectFn,
  pts: Array<[number, number, number]>,
  col: RGB,
  fi: number,
): void {
  const p = pts.map(([x, y, z]) => project(x, y, z));
  const ax = p[1].x - p[0].x;
  const ay = p[1].y - p[0].y;
  const bx = p[2].x - p[0].x;
  const by = p[2].y - p[0].y;
  if (ax * by - ay * bx > 0) return;
  const d = (p[0].d + p[1].d + p[2].d + p[3].d) * 0.25;
  faces.push({ pts: p, fill: hex(col, SHADE[fi]), d });
}

function uncovered(occ: Set<string>, x: number, y: number, z0: number, z1: number, nx: number, ny: number, nz: number): Array<[number, number]> {
  if (nz !== 0) {
    const z = nz > 0 ? z1 + 1 : z0 - 1;
    if (!occ.has(vk(x, y, z))) return [[z0, z1]];
    return [];
  }
  const runs: Array<[number, number]> = [];
  let start = -1;
  for (let z = z0; z <= z1; z++) {
    const hid = occ.has(vk(x + nx, y + ny, z));
    if (!hid) {
      if (start < 0) start = z;
    } else if (start >= 0) {
      runs.push([start, z - 1]);
      start = -1;
    }
  }
  if (start >= 0) runs.push([start, z1]);
  return runs;
}

function drawSpans(
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  spans: Span[],
  occ: Set<string>,
  pal: RGB[],
): void {
  const faces: Face[] = [];
  const hx = VOX_XY * 0.5;
  for (const sp of spans) {
    const col = pal[sp.ci];
    const x0 = sp.x * VOX_XY - hx;
    const x1 = sp.x * VOX_XY + hx;
    const y0 = sp.y * VOX_XY - hx;
    const y1 = sp.y * VOX_XY + hx;
    const topRuns = uncovered(occ, sp.x, sp.y, sp.z0, sp.z1, 0, 0, 1);
    if (topRuns.length) {
      const zb = (sp.z1 + 1) * VOX_Z;
      emitFace(
        faces,
        project,
        [
          [x0, y0, zb],
          [x1, y0, zb],
          [x1, y1, zb],
          [x0, y1, zb],
        ],
        col,
        0,
      );
    }
    const sides: Array<{ nx: number; ny: number; fi: number; quad: (za: number, zb: number) => Array<[number, number, number]> }> = [
      {
        nx: 1,
        ny: 0,
        fi: 1,
        quad: (za, zb) => [
          [x1, y0, za],
          [x1, y1, za],
          [x1, y1, zb],
          [x1, y0, zb],
        ],
      },
      {
        nx: -1,
        ny: 0,
        fi: 2,
        quad: (za, zb) => [
          [x0, y0, za],
          [x0, y1, za],
          [x0, y1, zb],
          [x0, y0, zb],
        ],
      },
      {
        nx: 0,
        ny: 1,
        fi: 3,
        quad: (za, zb) => [
          [x0, y1, za],
          [x1, y1, za],
          [x1, y1, zb],
          [x0, y1, zb],
        ],
      },
      {
        nx: 0,
        ny: -1,
        fi: 4,
        quad: (za, zb) => [
          [x0, y0, za],
          [x1, y0, za],
          [x1, y0, zb],
          [x0, y0, zb],
        ],
      },
    ];
    for (const s of sides) {
      for (const [za, zb] of uncovered(occ, sp.x, sp.y, sp.z0, sp.z1, s.nx, s.ny, 0)) {
        emitFace(faces, project, s.quad(za * VOX_Z, (zb + 1) * VOX_Z), col, s.fi);
      }
    }
  }
  faces.sort((a, b) => a.d - b.d);
  ctx.lineJoin = "miter";
  ctx.lineWidth = 0.45;
  ctx.strokeStyle = "rgba(6, 6, 10, 0.55)";
  for (const f of faces) {
    ctx.beginPath();
    ctx.moveTo(f.pts[0].x, f.pts[0].y);
    ctx.lineTo(f.pts[1].x, f.pts[1].y);
    ctx.lineTo(f.pts[2].x, f.pts[2].y);
    ctx.lineTo(f.pts[3].x, f.pts[3].y);
    ctx.closePath();
    ctx.fillStyle = f.fill;
    ctx.fill();
    ctx.stroke();
  }
}

export function drawRig(
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  u: Unit,
  now: number,
  zoom: number,
): void {
  const pose = poseId(u, now);
  const spans = spansOf(u.archetype, u.gender, pose);
  const occ = occOf(u.archetype, u.gender, pose);
  const pal = palettes(u.archetype, u.gender);
  void zoom;
  drawSpans(ctx, project, spans, occ, pal);
}
