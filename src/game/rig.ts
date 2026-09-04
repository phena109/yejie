import type { AnimClip, Archetype, Dir, Gender, Unit } from "./types";

export interface Proj {
  x: number;
  y: number;
  d: number;
}

export type ProjectFn = (lx: number, ly: number, lz: number) => Proj;

/** World height of a standing humanoid (lz 0..1). */
export const CHAR_H = 2.15;
export const ATTACK_MS = 420;
export const CAST_MS = 520;

/**
 * MagicaVoxel-quality chibi grid.
 * Humans ~18×16×32; wolverine ~14×20×18. One integer cube = one voxel.
 */
const VH = 30;
const VOX_XY = 0.062;
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
const C_WHITE = 10;
const C_SKIN_DK = 11;

function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}

function shadeRgb(c: RGB, k: number): RGB {
  return {
    r: Math.round(Math.min(255, c.r * k)),
    g: Math.round(Math.min(255, c.g * k)),
    b: Math.round(Math.min(255, c.b * k)),
  };
}

const EYE = rgb(18, 12, 14);
const SHOE_DK = rgb(28, 24, 26);
const WHITE = rgb(246, 246, 250);
const SPARK = rgb(255, 230, 120);

function palettes(arch: Archetype, gender: Gender): RGB[] {
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
      hair = rgb(28, 32, 48);
      shirt = rgb(24, 42, 72);
      pants = rgb(20, 26, 40);
      accent = rgb(220, 190, 70);
      extra = rgb(16, 28, 48);
      metal = rgb(190, 196, 204);
      break;
    case "dana":
      skin = rgb(176, 124, 90);
      hair = rgb(72, 44, 30);
      shirt = rgb(30, 48, 68);
      pants = rgb(26, 30, 38);
      accent = rgb(220, 190, 70);
      extra = rgb(22, 24, 28);
      metal = rgb(170, 160, 140);
      break;
    case "priya":
      skin = rgb(150, 96, 64);
      hair = rgb(22, 14, 12);
      shirt = rgb(232, 228, 214);
      pants = rgb(40, 70, 78);
      accent = rgb(200, 64, 64);
      extra = rgb(90, 110, 64);
      metal = rgb(210, 214, 220);
      break;
    case "hale":
      skin = rgb(210, 170, 132);
      hair = rgb(110, 96, 82);
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
        shirt = rgb(36, 32, 44);
        pants = rgb(40, 40, 46);
        accent = rgb(90, 60, 110);
        extra = rgb(24, 22, 28);
        metal = rgb(170, 174, 180);
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
  return [
    skin,
    hair,
    shirt,
    pants,
    accent,
    extra,
    metal,
    SHOE_DK,
    EYE,
    SPARK,
    WHITE,
    shadeRgb(skin, 0.78),
  ];
}

function hex(c: RGB, shade = 1): string {
  const r = Math.max(0, Math.min(255, Math.round(c.r * shade)));
  const g = Math.max(0, Math.min(255, Math.round(c.g * shade)));
  const b = Math.max(0, Math.min(255, Math.round(c.b * shade)));
  return `rgb(${r},${g},${b})`;
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
  if (clip === "walk") return `w${(t * 4) | 0}`;
  if (clip === "attack") return t < 0.35 ? "a0" : t < 0.62 ? "a1" : "a2";
  if (t < 0.33) return "c0";
  if (t < 0.66) return "c1";
  return "c2";
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

function fill(
  g: Grid,
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  p: Part,
  ci: number,
): void {
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

/** Dense MagicaVoxel-style chibi humanoid (~18×16×30, head ~40%). */
function humanoid(g: Grid, woman: boolean, thick: boolean): void {
  const hipW = woman ? 5 : thick ? 6 : 5;
  const shW = thick ? 7 : woman ? 6 : 6;
  const legW = thick ? 2 : 2;
  const armW = thick ? 2 : woman ? 1 : 2;
  const headR = woman ? 6 : 7;

  // Short stubby legs + shoes
  fill(g, -legW - 2, -2, 0, -1, 2, 1, P.legL, C_SHOE);
  fill(g, 1, -2, 0, legW + 2, 2, 1, P.legR, C_SHOE);
  fill(g, -legW - 2, -2, 2, -1, 2, 7, P.legL, C_SKIN);
  fill(g, 1, -2, 2, legW + 2, 2, 7, P.legR, C_SKIN);

  // Wide hips
  fill(g, -hipW, -3, 7, hipW, 2, 9, P.hip, C_SKIN);
  if (woman) fill(g, -hipW - 1, -2, 7, hipW + 1, 2, 8, P.hip, C_SKIN);

  // Short torso
  fill(g, -hipW + 1, -3, 9, hipW - 1, 2, 12, P.torso, C_SKIN);
  fill(g, -shW, -3, 12, shW, 3, 16, P.torso, C_SKIN);
  if (thick) fill(g, -shW, -4, 13, shW, 3, 16, P.torso, C_SKIN);

  // Neck
  fill(g, -2, -1, 16, 2, 2, 17, P.head, C_SKIN);

  // Big rounded chibi head (stepped sphere-ish)
  for (let z = 17; z <= 28; z++) {
    const t = (z - 17) / 11;
    let r = headR;
    if (t < 0.15) r = headR - 2;
    else if (t < 0.3) r = headR - 1;
    else if (t > 0.85) r = headR - 2;
    else if (t > 0.7) r = headR - 1;
    const d = Math.max(4, r - 1);
    fill(g, -r, -d, z, r, d, z, P.head, C_SKIN);
  }
  // Cheek puff
  fill(g, -headR, 2, 20, -headR + 1, 4, 24, P.head, C_SKIN);
  fill(g, headR - 1, 2, 20, headR, 4, 24, P.head, C_SKIN);

  // Face details applied later via paintFace after hair.

  // Stubby arms
  const ax = shW + 1;
  fill(g, -ax - armW, -2, 9, -ax, 2, 15, P.armL, C_SKIN);
  fill(g, ax, -2, 9, ax + armW, 2, 15, P.armR, C_SKIN);
  fill(g, -ax - armW, -2, 8, -ax, 2, 8, P.armL, C_SKIN);
  fill(g, ax, -2, 8, ax + armW, 2, 8, P.armR, C_SKIN);
}

type Hair =
  | "short"
  | "pony"
  | "bun"
  | "long"
  | "messy"
  | "sides"
  | "buzz"
  | "hood"
  | "mohawk"
  | "hat";

function hairOf(arch: Archetype, gender: Gender): Hair {
  switch (arch) {
    case "mara":
      return "short";
    case "dana":
      return "pony";
    case "priya":
      return "bun";
    case "hale":
      return "sides";
    case "crosby":
    case "beckett":
      return "short";
    case "delinquent":
      return gender === "f" ? "messy" : "mohawk";
    case "magician":
      return gender === "f" ? "long" : "hood";
    case "boxer":
      return gender === "f" ? "short" : "buzz";
    case "gunner":
      return gender === "f" ? "short" : "buzz";
    case "worker":
      return "hat";
    case "official":
      return gender === "f" ? "bun" : "short";
    case "wolverine":
      return "messy";
  }
}

function hairCap(g: Grid, style: Hair): void {
  const top = 29;
  const hw = 7;
  const hd = 6;
  if (style === "hat") {
    fill(g, -hw - 1, -hd - 1, 27, hw + 1, hd + 1, 27, P.hair, C_METAL);
    fill(g, -hw, -hd, 28, hw, hd, top, P.hair, C_METAL);
    fill(g, -hw + 1, -hd + 1, 28, hw - 1, hd - 1, 28, P.hair, C_ACCENT);
    return;
  }
  if (style === "buzz") {
    fill(g, -hw + 2, -hd + 2, 27, hw - 2, hd - 2, 28, P.hair, C_HAIR);
    return;
  }
  if (style === "sides") {
    fill(g, -hw, -hd + 2, 18, -hw + 2, hd - 1, 26, P.hair, C_HAIR);
    fill(g, hw - 2, -hd + 2, 18, hw, hd - 1, 26, P.hair, C_HAIR);
    fill(g, -hw + 2, -hd + 2, 27, hw - 2, hd - 1, top, P.hair, C_HAIR);
    return;
  }
  if (style === "mohawk") {
    fill(g, -1, -hd + 1, 26, 1, hd - 1, top, P.hair, C_HAIR);
    fill(g, 0, -hd, 27, 0, hd, top, P.hair, C_HAIR);
    fill(g, -hw + 1, -hd + 2, 18, -hw + 2, hd - 1, 25, P.hair, C_HAIR);
    fill(g, hw - 2, -hd + 2, 18, hw - 1, hd - 1, 25, P.hair, C_HAIR);
    return;
  }
  if (style === "hood") {
    fill(g, -hw - 1, -hd, 18, hw + 1, hd + 1, top, P.hair, C_EXTRA);
    fill(g, -hw, -hd - 1, 20, hw, -hd, 27, P.hair, C_SHIRT);
    fill(g, -hw, hd, 20, hw, hd + 2, 27, P.hair, C_SHIRT);
    fill(g, -3, -2, 20, 3, 4, 25, P.head, C_SKIN);
    return;
  }

  fill(g, -hw, -hd, 25, hw, hd, top, P.hair, C_HAIR);
  fill(g, -hw, -hd, 22, hw, -hd + 2, 27, P.hair, C_HAIR);

  if (style === "short") {
    fill(g, -hw, -hd + 1, 20, hw, hd - 1, 26, P.hair, C_HAIR);
    // bangs with center face window for eyes
    fill(g, -6, hd - 1, 25, -1, hd, 27, P.hair, C_HAIR);
    fill(g, 1, hd - 1, 25, 6, hd, 27, P.hair, C_HAIR);
    fill(g, -hw, hd - 2, 18, -4, hd, 22, P.hair, C_HAIR);
    fill(g, 4, hd - 2, 18, hw, hd, 22, P.hair, C_HAIR);
  } else if (style === "pony") {
    fill(g, -hw + 1, -hd + 1, 20, hw - 1, hd, 26, P.hair, C_HAIR);
    fill(g, 4, -hd - 2, 14, 8, -hd + 1, 28, P.hair, C_HAIR);
    fill(g, 5, -hd - 3, 10, 8, -hd, 18, P.hair, C_HAIR);
    fill(g, 6, -hd - 3, 8, 8, -hd - 1, 12, P.hair, C_HAIR);
  } else if (style === "bun") {
    fill(g, -hw + 1, -hd + 1, 20, hw - 1, hd, 26, P.hair, C_HAIR);
    fill(g, -3, -hd - 4, 26, 3, -hd - 1, top, P.hair, C_HAIR);
    fill(g, -2, -hd - 5, 27, 2, -hd - 2, top, P.hair, C_HAIR);
  } else if (style === "long") {
    fill(g, -hw, -hd - 2, 10, hw, -hd + 1, 27, P.hair, C_HAIR);
    fill(g, -hw, -hd - 3, 8, hw, -hd, 14, P.hair, C_HAIR);
    fill(g, -hw, hd - 1, 18, hw, hd, 25, P.hair, C_HAIR);
  } else if (style === "messy") {
    fill(g, -hw, -hd + 1, 20, hw, hd, 26, P.hair, C_HAIR);
    put(g, -hw - 1, 0, 28, P.hair, C_HAIR);
    put(g, hw + 1, 1, 29, P.hair, C_HAIR);
    put(g, 0, -hd - 1, 29, P.hair, C_HAIR);
    put(g, -4, hd + 1, 26, P.hair, C_HAIR);
    put(g, 4, hd + 1, 25, P.hair, C_HAIR);
    fill(g, -hw - 1, hd - 1, 18, -hw, hd, 24, P.hair, C_HAIR);
  }
}

function clothesPants(g: Grid, woman: boolean, thick: boolean): void {
  const hipW = woman ? 5 : thick ? 6 : 5;
  const legW = 2;
  fill(g, -hipW, -3, 7, hipW, 2, 9, P.hip, C_PANTS);
  fill(g, -legW - 2, -2, 2, -1, 2, 7, P.legL, C_PANTS);
  fill(g, 1, -2, 2, legW + 2, 2, 7, P.legR, C_PANTS);
}

function clothesShirt(g: Grid, woman: boolean, thick: boolean): void {
  const hipW = woman ? 5 : thick ? 6 : 5;
  const shW = thick ? 7 : woman ? 6 : 6;
  fill(g, -hipW + 1, -3, 9, hipW - 1, 2, 12, P.torso, C_SHIRT);
  fill(g, -shW, -3, 12, shW, 3, 16, P.torso, C_SHIRT);
  fill(g, -hipW, -2, 9, hipW, 2, 9, P.hip, C_EXTRA);
}

function jacket(g: Grid, ci: number, long: boolean): void {
  fill(g, -7, -3, 10, 7, 3, 16, P.torso, ci);
  fill(g, -7, -4, 12, 7, -3, 15, P.torso, ci);
  if (long) fill(g, -7, -4, 4, 7, -3, 12, P.torso, ci);
}

function baton(g: Grid): void {
  fill(g, 8, 1, 10, 9, 7, 11, P.weap, C_METAL);
  put(g, 8, 1, 10, P.weap, C_EXTRA);
  put(g, 9, 7, 11, P.weap, C_ACCENT);
}

function knife(g: Grid): void {
  fill(g, 8, 0, 10, 9, 5, 11, P.weap, C_METAL);
  put(g, 8, 0, 11, P.weap, C_WHITE);
  put(g, 9, 5, 10, P.weap, C_EXTRA);
}

function rifle(g: Grid): void {
  fill(g, 7, -1, 12, 9, 8, 14, P.weap, C_METAL);
  fill(g, 7, 0, 11, 8, 2, 12, P.weap, C_METAL);
  put(g, 8, 8, 13, P.weap, C_EXTRA);
  put(g, 9, 7, 14, P.weap, C_ACCENT);
}

function gloves(g: Grid, thick: boolean): void {
  const s = thick ? 2 : 1;
  fill(g, -10 - s, -2, 7, -8, 2, 11, P.armL, C_EXTRA);
  fill(g, 8, -2, 7, 10 + s, 2, 11, P.armR, C_EXTRA);
  fill(g, -10, -1, 8, -9, 1, 10, P.armL, C_ACCENT);
  fill(g, 9, -1, 8, 10, 1, 10, P.armR, C_ACCENT);
}

/** Hunched feral claw beast ~14×20×18. */
function beast(g: Grid, woman: boolean): void {
  const w = woman ? 4 : 5;
  fill(g, -w, -7, 4, w, 3, 10, P.torso, C_SHIRT);
  fill(g, -w + 1, -6, 10, w - 1, 2, 12, P.torso, C_SHIRT);
  fill(g, -w, -5, 3, w, 1, 4, P.hip, C_PANTS);
  // Head / snout
  fill(g, -w + 1, 1, 7, w - 1, 7, 13, P.head, C_SKIN);
  fill(g, -3, 7, 8, 3, 10, 11, P.head, C_SKIN);
  fill(g, -2, 10, 9, 2, 11, 11, P.head, C_SKIN);
  // eyes
  fill(g, -3, 11, 11, -1, 11, 12, P.head, C_EYE);
  fill(g, 1, 11, 11, 3, 11, 12, P.head, C_EYE);
  put(g, -3, 11, 12, P.head, C_WHITE);
  put(g, 1, 11, 12, P.head, C_WHITE);
  put(g, 0, 11, 8, P.head, C_SHOE);
  put(g, -1, 11, 9, P.head, C_SKIN_DK);
  put(g, 1, 11, 9, P.head, C_SKIN_DK);
  // ears / mane
  fill(g, -4, 2, 13, -2, 5, 16, P.hair, C_HAIR);
  fill(g, 2, 2, 13, 4, 5, 16, P.hair, C_HAIR);
  fill(g, -w, -3, 11, w, 2, 13, P.hair, C_HAIR);
  fill(g, -2, -11, 7, 2, -8, 9, P.gear, C_HAIR);
  put(g, 0, -11, 6, P.gear, C_HAIR);
  fill(g, -w, -6, 0, -2, -2, 4, P.legL, C_PANTS);
  fill(g, 2, -6, 0, w, -2, 4, P.legR, C_PANTS);
  fill(g, -w, -6, 0, -2, -2, 1, P.legL, C_SHOE);
  fill(g, 2, -6, 0, w, -2, 1, P.legR, C_SHOE);
  fill(g, -w - 1, 0, 1, -w + 1, 5, 9, P.armL, C_SKIN);
  fill(g, w - 1, 0, 1, w + 1, 5, 9, P.armR, C_SKIN);
  fill(g, -w - 1, 5, 0, -w + 1, 10, 2, P.weap, C_METAL);
  fill(g, w - 1, 5, 0, w + 1, 10, 2, P.weap, C_METAL);
  put(g, -w, 10, 0, P.weap, C_METAL);
  put(g, w, 10, 0, P.weap, C_METAL);
  put(g, -w - 1, 9, 1, P.weap, C_WHITE);
  put(g, w + 1, 9, 1, P.weap, C_WHITE);
}


function paintFace(g: Grid, woman: boolean): void {
  const fy = 6;
  // Clear hair that covered the face window, then paint eyes
  for (let x = -4; x <= 4; x++) {
    for (let z = 20; z <= 24; z++) {
      const k = vk(x, fy, z);
      const cur = g.get(k);
      if (cur && (cur.p === P.hair || cur.ci === C_HAIR)) g.delete(k);
    }
  }
  fill(g, -4, fy, 21, -2, fy, 23, P.head, C_EYE);
  fill(g, 2, fy, 21, 4, fy, 23, P.head, C_EYE);
  put(g, -4, fy, 23, P.head, C_WHITE);
  put(g, 2, fy, 23, P.head, C_WHITE);
  put(g, -3, fy, 22, P.head, C_EYE);
  put(g, 3, fy, 22, P.head, C_EYE);
  fill(g, -1, fy, 19, 1, fy, 19, P.head, C_SKIN_DK);
  if (woman) {
    put(g, -5, fy, 20, P.head, C_SKIN_DK);
    put(g, 5, fy, 20, P.head, C_SKIN_DK);
  }
}

function buildModel(arch: Archetype, gender: Gender): Vox[] {
  const g: Grid = new Map();
  const woman = gender === "f";
  if (arch === "wolverine") {
    beast(g, woman);
    return voxelize(g);
  }
  const thick = arch === "boxer" || arch === "crosby" || arch === "beckett";
  humanoid(g, woman, thick);
  clothesPants(g, woman, thick);
  clothesShirt(g, woman, thick);
  const hair = hairOf(arch, gender);

  switch (arch) {
    case "mara":
      jacket(g, C_EXTRA, false);
      fill(g, -5, 2, 12, 5, 3, 15, P.torso, C_ACCENT);
      hairCap(g, "short");
      baton(g);
      put(g, 0, 3, 13, P.gear, C_METAL);
      put(g, -4, 3, 14, P.gear, C_ACCENT);
      put(g, 4, 3, 14, P.gear, C_ACCENT);
      break;
    case "dana":
      jacket(g, C_EXTRA, false);
      hairCap(g, "pony");
      baton(g);
      fill(g, -8, 1, 14, -6, 3, 16, P.gear, C_METAL);
      put(g, -7, 3, 16, P.gear, C_ACCENT);
      break;
    case "priya":
      hairCap(g, "bun");
      fill(g, -9, -2, 8, -5, 2, 13, P.gear, C_ACCENT);
      fill(g, -8, -1, 9, -6, 1, 12, P.gear, C_WHITE);
      put(g, -7, 0, 11, P.gear, C_ACCENT);
      put(g, -7, 0, 10, P.gear, C_ACCENT);
      fill(g, -3, 3, 12, 3, 3, 14, P.torso, C_EXTRA);
      break;
    case "hale":
      hairCap(g, "sides");
      jacket(g, C_EXTRA, false);
      fill(g, 0, 3, 10, 0, 3, 14, P.gear, C_ACCENT);
      put(g, 0, 3, 15, P.gear, C_ACCENT);
      fill(g, -4, 6, 23, -1, 6, 23, P.head, C_METAL);
      fill(g, 1, 6, 23, 4, 6, 23, P.head, C_METAL);
      put(g, 0, 6, 23, P.head, C_METAL);
      break;
    case "crosby":
      jacket(g, C_EXTRA, true);
      hairCap(g, "short");
      rifle(g);
      put(g, -3, 3, 13, P.gear, C_ACCENT);
      put(g, 3, 3, 13, P.gear, C_ACCENT);
      fill(g, -7, -4, 14, 7, -3, 26, P.torso, C_EXTRA);
      break;
    case "beckett":
      jacket(g, C_EXTRA, true);
      hairCap(g, "short");
      rifle(g);
      fill(g, -5, 3, 12, 5, 3, 14, P.torso, C_ACCENT);
      break;
    case "delinquent":
      hairCap(g, hair);
      fill(g, -7, -3, 10, 7, 3, 16, P.torso, C_SHIRT);
      fill(g, -7, -3, 15, 7, 3, 17, P.hair, C_EXTRA);
      if (woman) fill(g, -6, -3, 17, 6, 3, 21, P.hair, C_HAIR);
      knife(g);
      break;
    case "magician":
      for (let z = 1; z <= 12; z++) {
        const w = z < 5 ? 7 : z < 9 ? 6 : 5;
        fill(g, -w, -3, z, w, 3, z, P.torso, z < 9 ? C_PANTS : C_SHIRT);
      }
      fill(g, -7, -4, 10, 7, 3, 16, P.torso, C_SHIRT);
      hairCap(g, hair);
      if (!woman) fill(g, -8, -4, 18, 8, 5, 29, P.hair, C_EXTRA);
      fill(g, -2, 3, 12, 2, 4, 14, P.gear, C_ACCENT);
      put(g, 0, 4, 15, P.gear, C_SPARK);
      break;
    case "boxer":
      hairCap(g, hair);
      gloves(g, true);
      fill(g, -5, -2, 10, 5, 2, 15, P.torso, C_SHIRT);
      fill(g, -6, -2, 2, 6, 2, 7, P.hip, C_PANTS);
      put(g, 0, 3, 12, P.torso, C_ACCENT);
      break;
    case "gunner":
      hairCap(g, hair);
      rifle(g);
      fill(g, -7, -2, 10, 7, 3, 16, P.torso, C_EXTRA);
      put(g, 0, 3, 13, P.gear, C_ACCENT);
      fill(g, 7, -1, 11, 9, 2, 15, P.armR, C_SKIN);
      break;
    case "worker":
      hairCap(g, "hat");
      fill(g, -6, -3, 10, 6, 3, 16, P.torso, C_SHIRT);
      put(g, 0, 3, 13, P.gear, C_ACCENT);
      fill(g, -6, -2, 9, 6, 2, 9, P.torso, C_EXTRA);
      break;
    case "official":
      hairCap(g, hair);
      jacket(g, C_EXTRA, true);
      fill(g, 0, 3, 10, 0, 3, 15, P.gear, C_ACCENT);
      fill(g, -6, -3, 10, 6, 2, 16, P.torso, C_SHIRT);
      break;
  }
  paintFace(g, woman);
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
    set([P.torso, P.head, P.hair, P.gear], 0, 0, 1);
    return o;
  }
  if (pose === "w0" || pose === "w1" || pose === "w2" || pose === "w3") {
    const a = pose === "w0" || pose === "w1";
    set([P.hip, P.torso, P.head, P.hair, P.gear], 0, 0, pose === "w0" || pose === "w2" ? 1 : 0);
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
  void upper;
  return o;
}

function extras(arch: Archetype, pose: string): Vox[] {
  const out: Vox[] = [];
  if (pose === "c1" || pose === "c2") {
    out.push(
      { x: -5, y: 3, z: 26, p: P.gear, ci: C_SPARK },
      { x: 5, y: 3, z: 26, p: P.gear, ci: C_SPARK },
      { x: -6, y: 4, z: 28, p: P.gear, ci: C_ACCENT },
      { x: 6, y: 4, z: 28, p: P.gear, ci: C_ACCENT },
      { x: 0, y: 4, z: 29, p: P.gear, ci: C_SPARK },
    );
  }
  if (pose === "a1" && (arch === "gunner" || arch === "crosby" || arch === "beckett")) {
    out.push({ x: 8, y: 10, z: 15, p: P.weap, ci: C_SPARK }, { x: 8, y: 11, z: 16, p: P.weap, ci: C_ACCENT });
  }
  return out;
}

/** Local-space quad ready to project. fi = shade index. */
interface MeshFace {
  /** Corner local coords in tile space (already * VOX). */
  c: Array<[number, number, number]>;
  ci: number;
  fi: number;
}

const meshCache = new Map<string, MeshFace[]>();

const SHADE = [1.28, 1.05, 0.62, 0.9, 0.72, 0.48];

/**
 * Build occupancy, then greedy-mesh exposed faces:
 * - vertical columns of same color merge into taller side quads
 * - adjacent same-color faces merge along U then V (standard greedy)
 * Without collapsing the silhouette into capsules.
 */
function meshOf(arch: Archetype, gender: Gender, pose: string): MeshFace[] {
  const key = `${arch}|${gender}|${pose}`;
  const hit = meshCache.get(key);
  if (hit) return hit;

  const model = modelOf(arch, gender);
  const off = offsetsFor(arch, pose);
  const occ = new Map<string, number>();
  let minX = 99,
    minY = 99,
    minZ = 99,
    maxX = -99,
    maxY = -99,
    maxZ = -99;
  const add = (x: number, y: number, z: number, ci: number) => {
    occ.set(vk(x, y, z), ci);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  };
  for (const v of model) {
    const o = off[v.p];
    add(v.x + o.x, v.y + o.y, v.z + o.z, v.ci);
  }
  for (const e of extras(arch, pose)) add(e.x, e.y, e.z, e.ci);

  const faces: MeshFace[] = [];
  const hx = VOX_XY * 0.5;
  const has = (x: number, y: number, z: number) => occ.has(vk(x, y, z));
  const colAt = (x: number, y: number, z: number) => occ.get(vk(x, y, z));

  type Axis = 0 | 1 | 2;
  const dirs: Array<{ axis: Axis; s: 1 | -1; fi: number }> = [
    { axis: 2, s: 1, fi: 0 }, // +Z top
    { axis: 2, s: -1, fi: 5 }, // -Z bottom
    { axis: 0, s: 1, fi: 1 }, // +X
    { axis: 0, s: -1, fi: 2 }, // -X
    { axis: 1, s: 1, fi: 3 }, // +Y
    { axis: 1, s: -1, fi: 4 }, // -Y
  ];

  for (const d of dirs) {
    // Slice along the face-normal axis
    const uAxis: Axis = d.axis === 0 ? 1 : 0;
    const vAxis: Axis = d.axis === 2 ? 1 : 2;
    const mins = [minX, minY, minZ];
    const maxs = [maxX, maxY, maxZ];
    for (let slice = mins[d.axis]; slice <= maxs[d.axis]; slice++) {
      const maskW = maxs[uAxis] - mins[uAxis] + 1;
      const maskH = maxs[vAxis] - mins[vAxis] + 1;
      const mask = new Int16Array(maskW * maskH);
      mask.fill(-1);
      for (let vv = mins[vAxis]; vv <= maxs[vAxis]; vv++) {
        for (let uu = mins[uAxis]; uu <= maxs[uAxis]; uu++) {
          const pos = [0, 0, 0];
          pos[d.axis] = slice;
          pos[uAxis] = uu;
          pos[vAxis] = vv;
          const ci = colAt(pos[0], pos[1], pos[2]);
          if (ci === undefined) continue;
          const npos = [pos[0], pos[1], pos[2]];
          npos[d.axis] += d.s;
          if (has(npos[0], npos[1], npos[2])) continue;
          mask[(vv - mins[vAxis]) * maskW + (uu - mins[uAxis])] = ci;
        }
      }
      // Greedy merge on mask
      const visited = new Uint8Array(maskW * maskH);
      for (let j = 0; j < maskH; j++) {
        for (let i = 0; i < maskW; i++) {
          const idx = j * maskW + i;
          const ci = mask[idx];
          if (ci < 0 || visited[idx]) continue;
          let w = 1;
          while (i + w < maskW && mask[j * maskW + i + w] === ci && !visited[j * maskW + i + w]) w++;
          let h = 1;
          outer: while (j + h < maskH) {
            for (let k = 0; k < w; k++) {
              const ii = (j + h) * maskW + i + k;
              if (mask[ii] !== ci || visited[ii]) break outer;
            }
            h++;
          }
          for (let jj = 0; jj < h; jj++) {
            for (let ii = 0; ii < w; ii++) visited[(j + jj) * maskW + i + ii] = 1;
          }
          const u0 = mins[uAxis] + i;
          const u1 = u0 + w;
          const v0 = mins[vAxis] + j;
          const v1 = v0 + h;
          // Build quad in local tile space. Face sits on the outer boundary of the voxel.
          const faceCoord = d.s > 0 ? slice + 0.5 : slice - 0.5;
          const corner = (uu: number, vv: number): [number, number, number] => {
            const p = [0, 0, 0];
            p[d.axis] = faceCoord;
            p[uAxis] = uu - 0.5;
            p[vAxis] = vv - 0.5;
            return [p[0] * VOX_XY, p[1] * VOX_XY, p[2] * VOX_Z];
          };
          // Winding so outward normal faces camera cull correctly (CW when viewed from outside for our emit test)
          let c: Array<[number, number, number]>;
          if (d.s > 0) {
            c = [corner(u0, v0), corner(u1, v0), corner(u1, v1), corner(u0, v1)];
          } else {
            c = [corner(u0, v0), corner(u0, v1), corner(u1, v1), corner(u1, v0)];
          }
          // Fix axis-specific winding for canvas backface (ax*by - ay*bx > 0 culled)
          if (d.axis === 0 && d.s > 0) c = [corner(u0, v0), corner(u0, v1), corner(u1, v1), corner(u1, v0)];
          if (d.axis === 0 && d.s < 0) c = [corner(u0, v0), corner(u1, v0), corner(u1, v1), corner(u0, v1)];
          if (d.axis === 1 && d.s > 0) c = [corner(u0, v0), corner(u1, v0), corner(u1, v1), corner(u0, v1)];
          if (d.axis === 1 && d.s < 0) c = [corner(u0, v0), corner(u0, v1), corner(u1, v1), corner(u1, v0)];
          void hx;
          faces.push({ c, ci, fi: d.fi });
        }
      }
    }
  }

  meshCache.set(key, faces);
  return faces;
}

interface DrawFace {
  pts: Proj[];
  fill: string;
  d: number;
}

function drawMesh(ctx: CanvasRenderingContext2D, project: ProjectFn, mesh: MeshFace[], pal: RGB[]): void {
  const faces: DrawFace[] = [];
  for (const f of mesh) {
    const p = f.c.map(([x, y, z]) => project(x, y, z));
    const ax = p[1].x - p[0].x;
    const ay = p[1].y - p[0].y;
    const bx = p[2].x - p[0].x;
    const by = p[2].y - p[0].y;
    if (ax * by - ay * bx > 0) continue;
    const d = (p[0].d + p[1].d + p[2].d + p[3].d) * 0.25;
    faces.push({ pts: p, fill: hex(pal[f.ci] ?? pal[0], SHADE[f.fi]), d });
  }
  faces.sort((a, b) => a.d - b.d);
  ctx.lineJoin = "miter";
  ctx.lineWidth = 0.25;
  ctx.strokeStyle = "rgba(8, 6, 12, 0.35)";
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
  const mesh = meshOf(u.archetype, u.gender, pose);
  const pal = palettes(u.archetype, u.gender);
  void zoom;
  drawMesh(ctx, project, mesh, pal);
}

/** Approx screen height of a standing unit for HP bar placement. */
export function rigDrawHeight(zoom: number): number {
  return 58 * zoom;
}

/** Warm-up meshes so first battle frame is smooth. */
export function precacheRigs(): void {
  const arches: Archetype[] = [
    "mara",
    "dana",
    "priya",
    "hale",
    "crosby",
    "beckett",
    "delinquent",
    "magician",
    "wolverine",
    "boxer",
    "gunner",
    "worker",
    "official",
  ];
  // Warm idle + first walk; attack/cast mesh on demand.
  const poses = ["i0", "i1", "w0"];
  for (const a of arches) {
    for (const g of ["f", "m"] as Gender[]) {
      for (const pose of poses) meshOf(a, g, pose);
    }
  }
}

/** Debug: voxel count for an archetype (dense MagicaVoxel target ~400–900). */
export function voxelCount(arch: Archetype, gender: Gender): number {
  return modelOf(arch, gender).length;
}
