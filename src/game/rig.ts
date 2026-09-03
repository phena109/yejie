import {
  SPRITE_H,
  SPRITE_W,
  canvasFromImageData,
  frameImageData,
  pngIdle,
  type Face,
} from "./sprites";
import type { AnimClip, Archetype, Dir, Gender, Unit } from "./types";
import { DIRS, yawDir } from "./types";

export interface Proj {
  x: number;
  y: number;
  d: number;
}

export type ProjectFn = (lx: number, ly: number, lz: number) => Proj;

export const CHAR_H = 2.2;
export const ATTACK_MS = 420;
export const CAST_MS = 520;

type RGB = [number, number, number];

interface Pal {
  skin: RGB;
  skinDk: RGB;
  hair: RGB;
  hairLt: RGB;
  shirt: RGB;
  shirtDk: RGB;
  pants: RGB;
  accent: RGB;
  extra: RGB;
  metal: RGB;
  shoe: RGB;
  eye: RGB;
  white: RGB;
  outline: RGB;
}

interface Pose {
  bob: number;
  lean: number;
  legL: number;
  legR: number;
  liftL: number;
  liftR: number;
  armLx: number;
  armLy: number;
  armRx: number;
  armRy: number;
  weapX: number;
  weapY: number;
  spark: boolean;
  flash: boolean;
}

const OUT: RGB = [16, 12, 18];
const WHITE: RGB = [246, 246, 250];
const EYE: RGB = [22, 16, 18];
const SHOE: RGB = [28, 24, 26];

function rgb(r: number, g: number, b: number): RGB {
  return [r, g, b];
}

function shade(c: RGB, k: number): RGB {
  return [Math.round(Math.min(255, c[0] * k)), Math.round(Math.min(255, c[1] * k)), Math.round(Math.min(255, c[2] * k))];
}

function palettes(arch: Archetype, gender: Gender): Pal {
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
      hair = rgb(36, 32, 40);
      shirt = rgb(28, 48, 78);
      pants = rgb(22, 28, 42);
      accent = rgb(220, 190, 70);
      extra = rgb(18, 28, 40);
      metal = rgb(190, 196, 204);
      break;
    case "dana":
      skin = rgb(176, 124, 90);
      hair = rgb(78, 48, 32);
      shirt = rgb(32, 52, 72);
      pants = rgb(28, 32, 40);
      accent = rgb(220, 190, 70);
      extra = rgb(22, 24, 28);
      metal = rgb(170, 160, 140);
      break;
    case "priya":
      skin = rgb(150, 96, 64);
      hair = rgb(24, 16, 14);
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
  return {
    skin,
    skinDk: shade(skin, 0.78),
    hair,
    hairLt: shade(hair, 1.35),
    shirt,
    shirtDk: shade(shirt, 0.72),
    pants,
    accent,
    extra,
    metal,
    shoe: SHOE,
    eye: EYE,
    white: WHITE,
    outline: OUT,
  };
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

function poseOf(id: string, face: Face): Pose {
  const p: Pose = {
    bob: 0,
    lean: 0,
    legL: 0,
    legR: 0,
    liftL: 0,
    liftR: 0,
    armLx: 0,
    armLy: 0,
    armRx: 0,
    armRy: 0,
    weapX: 0,
    weapY: 0,
    spark: false,
    flash: false,
  };
  const toward = face === "right" ? 1 : face === "left" ? -1 : 0;
  if (id === "i1") p.bob = 1;
  if (id === "w0") {
    p.bob = 1;
    p.liftL = 3;
    p.legL = toward || -1;
    p.legR = toward ? -toward : 1;
    p.armLx = 1;
    p.armRx = -1;
  } else if (id === "w1") {
    p.legL = -1;
    p.legR = 1;
  } else if (id === "w2") {
    p.bob = 1;
    p.liftR = 3;
    p.legR = toward || -1;
    p.legL = toward ? -toward : 1;
    p.armLx = -1;
    p.armRx = 1;
  } else if (id === "w3") {
    p.legL = 1;
    p.legR = -1;
  } else if (id === "a0") {
    p.lean = -toward || 0;
    p.armRx = -(toward || 0);
    p.armRy = -2;
    p.weapX = -(toward || 0);
    p.weapY = -2;
  } else if (id === "a1") {
    p.lean = toward || 0;
    p.armRx = toward || 0;
    p.armRy = 1;
    p.weapX = (toward || 0) * 2 + (face === "down" || face === "up" ? 2 : 0);
    p.weapY = 1;
    p.flash = true;
  } else if (id === "a2") {
    p.armRy = -1;
    p.weapY = -1;
  } else if (id === "c0") {
    p.bob = 1;
    p.armLy = -3;
    p.armRy = -3;
  } else if (id === "c1") {
    p.bob = 2;
    p.armLy = -5;
    p.armRy = -5;
    p.spark = true;
  } else if (id === "c2") {
    p.bob = 1;
    p.armLy = -4;
    p.armRy = -4;
    p.spark = true;
  }
  return p;
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

export function screenFace(dir: Dir, yaw: number): Face {
  const v = yawDir(DIRS[dir].x, DIRS[dir].y, yaw);
  const sx = v.x - v.y;
  const sy = v.x + v.y;
  if (Math.abs(sy) >= Math.abs(sx)) return sy >= 0 ? "down" : "up";
  return sx >= 0 ? "right" : "left";
}

class Pix {
  readonly w = SPRITE_W;
  readonly h = SPRITE_H;
  readonly d = new Uint8ClampedArray(SPRITE_W * SPRITE_H * 4);

  put(x: number, y: number, c: RGB, a = 255): void {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    this.d[i] = c[0];
    this.d[i + 1] = c[1];
    this.d[i + 2] = c[2];
    this.d[i + 3] = a;
  }

  fill(x0: number, y0: number, x1: number, y1: number, c: RGB): void {
    if (x0 > x1) [x0, x1] = [x1, x0];
    if (y0 > y1) [y0, y1] = [y1, y0];
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.put(x, y, c);
  }

  ellipse(cx: number, cy: number, rx: number, ry: number, c: RGB): void {
    const rx2 = rx * rx;
    const ry2 = ry * ry;
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if (rx2 && ry2 && (x * x) / rx2 + (y * y) / ry2 <= 1.08) this.put(cx + x, cy + y, c);
      }
    }
  }

  opaque(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false;
    return this.d[(y * this.w + x) * 4 + 3] > 10;
  }

  outline(c: RGB): void {
    const marks: Array<[number, number]> = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.opaque(x, y)) continue;
        if (this.opaque(x - 1, y) || this.opaque(x + 1, y) || this.opaque(x, y - 1) || this.opaque(x, y + 1)) {
          marks.push([x, y]);
        }
      }
    }
    for (const [x, y] of marks) this.put(x, y, c);
  }

  flipX(): void {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w / 2; x++) {
        const a = (y * this.w + x) * 4;
        const b = (y * this.w + (this.w - 1 - x)) * 4;
        for (let k = 0; k < 4; k++) {
          const t = this.d[a + k];
          this.d[a + k] = this.d[b + k];
          this.d[b + k] = t;
        }
      }
    }
  }

  canvas(): HTMLCanvasElement {
    const c = document.createElement("canvas");
    c.width = this.w;
    c.height = this.h;
    c.getContext("2d")!.putImageData(new ImageData(this.d, this.w, this.h), 0, 0);
    return c;
  }
}

type Hair = "short" | "pony" | "bun" | "long" | "messy" | "sides" | "buzz" | "hood" | "mohawk" | "hat";

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

function drawHair(p: Pix, pal: Pal, style: Hair, face: Face, hx: number, hy: number): void {
  const back = face === "up";
  if (style === "hood") {
    p.fill(hx - 8, hy - 8, hx + 8, hy + 6, pal.extra);
    p.fill(hx - 7, hy - 9, hx + 7, hy - 6, pal.shirt);
    p.fill(hx - 8, hy - 4, hx - 6, hy + 5, pal.shirt);
    p.fill(hx + 6, hy - 4, hx + 8, hy + 5, pal.shirt);
    if (!back) p.fill(hx - 4, hy - 1, hx + 4, hy + 5, pal.skin);
    else p.fill(hx - 5, hy - 2, hx + 5, hy + 3, pal.extra);
    return;
  }
  if (style === "hat") {
    p.fill(hx - 8, hy - 6, hx + 8, hy - 4, pal.metal);
    p.fill(hx - 6, hy - 10, hx + 6, hy - 5, pal.metal);
    p.fill(hx - 5, hy - 9, hx + 5, hy - 8, pal.accent);
    p.fill(hx - 6, hy - 5, hx + 6, hy - 4, pal.shirtDk);
    return;
  }
  if (style === "buzz") {
    p.fill(hx - 6, hy - 8, hx + 6, hy - 5, pal.hair);
    p.fill(hx - 7, hy - 6, hx + 7, hy - 5, pal.hair);
    return;
  }
  if (style === "sides") {
    p.fill(hx - 7, hy - 4, hx - 5, hy + 4, pal.hair);
    p.fill(hx + 5, hy - 4, hx + 7, hy + 4, pal.hair);
    p.fill(hx - 5, hy - 8, hx + 5, hy - 6, pal.hair);
    p.put(hx, hy - 7, pal.hairLt);
    return;
  }
  if (style === "mohawk") {
    p.fill(hx - 1, hy - 12, hx + 1, hy - 5, pal.hair);
    p.put(hx, hy - 13, pal.hairLt);
    p.fill(hx - 6, hy - 4, hx - 5, hy + 3, pal.hair);
    p.fill(hx + 5, hy - 4, hx + 6, hy + 3, pal.hair);
    p.fill(hx - 4, hy - 8, hx + 4, hy - 6, pal.hair);
    return;
  }

  p.fill(hx - 7, hy - 8, hx + 7, hy - 3, pal.hair);
  p.fill(hx - 6, hy - 10, hx + 6, hy - 7, pal.hair);
  p.put(hx - 2, hy - 11, pal.hairLt);
  p.put(hx + 2, hy - 10, pal.hairLt);

  if (style === "short") {
    p.fill(hx - 7, hy - 3, hx + 7, hy + 1, pal.hair);
    if (face === "down") {
      p.fill(hx - 6, hy - 2, hx + 6, hy + 1, pal.hair);
      p.fill(hx - 5, hy + 1, hx - 2, hy + 2, pal.hair);
      p.fill(hx + 1, hy + 1, hx + 4, hy + 2, pal.hair);
    } else if (back) {
      p.fill(hx - 7, hy - 2, hx + 7, hy + 4, pal.hair);
    } else {
      p.fill(hx - 7, hy - 3, hx + 3, hy + 2, pal.hair);
    }
  } else if (style === "pony") {
    p.fill(hx - 6, hy - 2, hx + 6, hy + 1, pal.hair);
    const px = face === "right" ? hx - 7 : hx + 5;
    if (back) {
      p.fill(hx, hy, hx + 4, hy + 14, pal.hair);
      p.fill(hx + 1, hy + 12, hx + 4, hy + 18, pal.hair);
    } else {
      p.fill(px, hy - 1, px + 3, hy + 12, pal.hair);
      p.fill(px + 1, hy + 10, px + 3, hy + 16, pal.hair);
      p.put(px + 2, hy + 6, pal.hairLt);
    }
  } else if (style === "bun") {
    p.fill(hx - 6, hy - 3, hx + 6, hy, pal.hair);
    const bx = back ? hx : face === "right" ? hx - 4 : face === "left" ? hx + 4 : hx;
    p.fill(bx - 3, hy - 12, bx + 3, hy - 8, pal.hair);
    p.fill(bx - 2, hy - 13, bx + 2, hy - 11, pal.hairLt);
    if (face === "down") {
      p.fill(hx - 5, hy - 1, hx - 2, hy + 1, pal.hair);
      p.fill(hx + 2, hy - 1, hx + 5, hy + 1, pal.hair);
    }
  } else if (style === "long") {
    p.fill(hx - 7, hy - 2, hx + 7, hy + 12, pal.hair);
    p.fill(hx - 6, hy + 10, hx + 6, hy + 16, pal.hair);
    p.put(hx - 4, hy + 4, pal.hairLt);
  } else if (style === "messy") {
    p.put(hx - 8, hy - 7, pal.hair);
    p.put(hx + 8, hy - 8, pal.hair);
    p.put(hx - 1, hy - 12, pal.hairLt);
    p.put(hx + 3, hy - 11, pal.hair);
    p.fill(hx - 7, hy - 2, hx + 7, hy + 3, pal.hair);
    p.fill(hx - 8, hy + 1, hx - 6, hy + 6, pal.hair);
  }
}

function drawFace(p: Pix, pal: Pal, face: Face, hx: number, hy: number, woman: boolean): void {
  if (face === "up") return;
  if (face === "down") {
    p.fill(hx - 4, hy, hx - 3, hy + 1, pal.eye);
    p.fill(hx + 2, hy, hx + 3, hy + 1, pal.eye);
    p.put(hx - 4, hy, pal.white);
    p.put(hx + 2, hy, pal.white);
    p.put(hx - 1, hy + 3, pal.skinDk);
    p.put(hx, hy + 3, pal.skinDk);
    if (woman) {
      p.put(hx - 5, hy + 2, shade(pal.skin, 0.88));
      p.put(hx + 4, hy + 2, shade(pal.skin, 0.88));
    }
  } else if (face === "right") {
    p.fill(hx + 3, hy, hx + 4, hy + 1, pal.eye);
    p.put(hx + 3, hy, pal.white);
    p.put(hx + 5, hy + 2, pal.skinDk);
    p.put(hx + 4, hy + 3, pal.skinDk);
  } else {
    p.fill(hx - 5, hy, hx - 4, hy + 1, pal.eye);
    p.put(hx - 5, hy, pal.white);
    p.put(hx - 6, hy + 2, pal.skinDk);
  }
}

function drawHuman(p: Pix, pal: Pal, arch: Archetype, gender: Gender, face: Face, pose: Pose): void {
  const woman = gender === "f";
  const thick = arch === "boxer" || arch === "crosby" || arch === "beckett";
  const hx = 16 + pose.lean;
  const hy = 13 - pose.bob;
  const ty = 23 - pose.bob;
  const hair = hairOf(arch, gender);
  const back = face === "up";
  const side = face === "left" || face === "right";
  const tw = thick ? 5 : woman ? 4 : 5;

  const l0 = 32 - pose.liftL;
  const r0 = 32 - pose.liftR;
  p.fill(11 + pose.legL, l0, 14 + pose.legL, 44 - pose.liftL, pal.pants);
  p.fill(17 + pose.legR, r0, 20 + pose.legR, 44 - pose.liftR, pal.pants);
  p.fill(10 + pose.legL, 44 - pose.liftL, 15 + pose.legL, 46 - pose.liftL, pal.shoe);
  p.fill(16 + pose.legR, 44 - pose.liftR, 21 + pose.legR, 46 - pose.liftR, pal.shoe);
  if (arch === "priya") {
    p.fill(10 + pose.legL, l0, 21 + pose.legR, 42, pal.shirt);
    p.fill(10, 40, 21, 42, pal.accent);
    p.fill(10 + pose.legL, 44 - pose.liftL, 15 + pose.legL, 46 - pose.liftL, pal.extra);
    p.fill(16 + pose.legR, 44 - pose.liftR, 21 + pose.legR, 46 - pose.liftR, pal.extra);
  }

  p.fill(hx - tw, ty, hx + tw, ty + 8, pal.shirt);
  p.fill(hx - tw + 1, ty - 1, hx + tw - 1, ty, pal.shirt);
  p.fill(hx - tw, ty + 7, hx + tw, ty + 8, pal.extra);

  if (arch === "mara" || arch === "dana") {
    p.fill(hx - tw, ty, hx + tw, ty + 8, pal.shirt);
    p.fill(hx - 3, ty + 7, hx + 3, ty + 8, pal.shoe);
    p.put(hx + (back ? -1 : 2), ty + 3, pal.accent);
    p.put(hx - tw + 1, ty + 2, pal.accent);
    p.put(hx + tw - 1, ty + 2, pal.accent);
  }
  if (arch === "priya") {
    p.fill(hx - tw - 1, ty, hx + tw + 1, ty + 6, pal.extra);
    p.fill(hx - tw + 1, ty + 1, hx + tw - 1, ty + 7, pal.shirt);
  }
  if (arch === "official") {
    p.fill(hx - tw - 1, ty, hx + tw + 1, ty + 9, pal.extra);
    p.fill(hx - 2, ty + 1, hx + 2, ty + 7, pal.shirt);
    p.fill(hx - 1, ty + 1, hx + 1, ty + 6, pal.accent);
  }
  if (arch === "crosby" || arch === "beckett") {
    p.fill(hx - tw - 1, ty - 1, hx + tw + 1, ty + 11, pal.extra);
    p.fill(hx - 2, ty + 2, hx + 2, ty + 3, pal.accent);
    p.put(hx - 3, ty + 4, pal.metal);
    p.put(hx + 3, ty + 4, pal.metal);
  }
  if (arch === "worker") {
    p.fill(hx - tw, ty + 6, hx + tw, ty + 7, pal.extra);
    p.put(hx, ty + 3, pal.accent);
  }
  if (arch === "boxer") {
    p.fill(hx - 3, ty, hx + 3, ty + 6, pal.shirt);
    p.fill(hx - 4, ty + 6, hx + 4, ty + 8, pal.pants);
  }
  if (arch === "magician") {
    p.fill(hx - tw - 2, ty + 1, hx + tw + 2, ty + 13, pal.shirt);
    p.fill(hx - tw, ty, hx + tw, ty + 7, pal.shirtDk);
    p.fill(hx - 2, ty + 2, hx + 2, ty + 4, pal.accent);
  }
  if (arch === "delinquent") {
    p.fill(hx - tw - 1, ty - 1, hx + tw + 1, ty + 8, pal.extra);
    p.fill(hx - 3, ty + 2, hx + 3, ty + 6, pal.accent);
  }
  if (arch === "gunner") {
    p.fill(hx - tw, ty, hx + tw, ty + 8, pal.extra);
    p.put(hx, ty + 3, pal.accent);
    p.fill(hx - 3, ty + 7, hx + 3, ty + 8, pal.metal);
  }
  if (arch === "hale") {
    p.fill(hx - 1, ty + 1, hx + 1, ty + 6, pal.accent);
  }

  const farArm = arch === "boxer" ? pal.extra : pal.shirt;
  if (!side) {
    p.fill(hx - tw - 2 + pose.armLx, ty + 1 + pose.armLy, hx - tw - 1 + pose.armLx, ty + 8 + pose.armLy, farArm);
    p.fill(hx - tw - 2 + pose.armLx, ty + 8 + pose.armLy, hx - tw - 1 + pose.armLx, ty + 9 + pose.armLy, pal.skin);
    p.fill(hx + tw + 1 + pose.armRx, ty + 1 + pose.armRy, hx + tw + 2 + pose.armRx, ty + 8 + pose.armRy, farArm);
    p.fill(hx + tw + 1 + pose.armRx, ty + 8 + pose.armRy, hx + tw + 2 + pose.armRx, ty + 9 + pose.armRy, pal.skin);
  } else if (face === "right") {
    p.fill(hx + tw + pose.armRx, ty + 1 + pose.armRy, hx + tw + 2 + pose.armRx, ty + 8 + pose.armRy, farArm);
    p.fill(hx + tw + 1 + pose.armRx, ty + 8 + pose.armRy, hx + tw + 2 + pose.armRx, ty + 9 + pose.armRy, pal.skin);
  } else {
    p.fill(hx - tw - 2 + pose.armLx, ty + 1 + pose.armLy, hx - tw + pose.armLx, ty + 8 + pose.armLy, farArm);
    p.fill(hx - tw - 2 + pose.armLx, ty + 8 + pose.armLy, hx - tw - 1 + pose.armLx, ty + 9 + pose.armLy, pal.skin);
  }

  if (arch === "boxer") {
    const gx = face === "right" ? hx + tw + 4 + pose.armRx : face === "left" ? hx - tw - 4 + pose.armLx : hx + tw + 3 + pose.armRx;
    const gy = ty + 8 + pose.armRy;
    p.fill(gx - 2, gy - 2, gx + 2, gy + 2, pal.extra);
    p.fill(gx - 1, gy - 1, gx + 1, gy + 1, pal.accent);
    if (!side) p.fill(hx - tw - 4 + pose.armLx, ty + 7 + pose.armLy, hx - tw - 1 + pose.armLx, ty + 10 + pose.armLy, pal.extra);
  }

  p.fill(hx - 6, hy - 4, hx + 6, hy + 5, pal.skin);
  p.fill(hx - 5, hy - 6, hx + 5, hy - 4, pal.skin);
  p.fill(hx - 5, hy + 5, hx + 5, hy + 6, pal.skin);
  p.fill(hx - 2, hy + 6, hx + 2, hy + 8, pal.skin);
  if (back) {
    p.fill(hx - 6, hy - 4, hx + 6, hy + 5, pal.skinDk);
  } else {
    p.fill(hx - 3, hy + 4, hx + 3, hy + 5, pal.skinDk);
  }
  drawHair(p, pal, hair, face, hx, hy);
  drawFace(p, pal, face, hx, hy, woman);

  if (arch === "priya") {
    const bx = face === "right" ? hx + 5 : hx - 9;
    p.fill(bx, ty + 3, bx + 5, ty + 8, pal.accent);
    p.fill(bx + 1, ty + 5, bx + 4, ty + 6, pal.white);
    p.put(bx + 2, ty + 4, pal.white);
    p.put(bx + 2, ty + 7, pal.white);
  }
  if (arch === "dana") {
    const rx = face === "right" ? hx + 6 : face === "left" ? hx - 7 : hx + 5;
    p.fill(rx, hy + 7, rx + 1, hy + 11, pal.shoe);
    p.put(rx, hy + 6, pal.metal);
  }

  drawWeapon(p, pal, arch, face, hx, ty, pose);
  if (pose.spark) drawSpark(p, pal, hx, hy - 8);
}

function drawWeapon(p: Pix, pal: Pal, arch: Archetype, face: Face, hx: number, ty: number, pose: Pose): void {
  const dir = face === "left" ? -1 : 1;
  const wx = hx + (face === "up" ? 5 : 6 * dir) + pose.weapX;
  const wy = ty + 3 + pose.weapY;
  if (arch === "mara" || arch === "dana") {
    if (face === "up") p.fill(hx + 5, ty + 2, hx + 6, ty + 11, pal.metal);
    else p.fill(wx, wy, wx + 5 * dir, wy + 1, pal.metal);
    p.put(wx, wy, pal.extra);
  } else if (arch === "delinquent") {
    if (face === "up") p.fill(hx + 6, ty - 4, hx + 7, ty + 8, pal.metal);
    else {
      p.fill(wx, wy - 8, wx + dir, wy + 2, pal.metal);
      p.put(wx, wy - 8, pal.white);
    }
  } else if (arch === "gunner" || arch === "crosby" || arch === "beckett") {
    const gx = hx + (face === "up" ? 4 : 5 * dir) + pose.weapX;
    const gy = ty + 4 + pose.weapY;
    p.fill(gx, gy, gx + 6 * dir, gy + 1, pal.metal);
    p.fill(gx + dir, gy - 1, gx + 2 * dir, gy, pal.metal);
    if (pose.flash) {
      p.put(gx + 7 * dir, gy, pal.accent);
      p.put(gx + 8 * dir, gy - 1, pal.white);
      p.put(gx + 7 * dir, gy + 1, pal.white);
    }
  } else if (arch === "magician") {
    p.fill(hx + 3 * dir, ty - 6 + pose.weapY, hx + 4 * dir, ty + 6, pal.metal);
    p.put(hx + 3 * dir, ty - 7 + pose.weapY, pal.accent);
  }
}

function drawSpark(p: Pix, pal: Pal, x: number, y: number): void {
  p.put(x, y, pal.accent);
  p.put(x - 3, y + 2, pal.accent);
  p.put(x + 3, y + 1, pal.white);
  p.put(x - 2, y - 2, pal.white);
  p.put(x + 2, y - 1, pal.accent);
  p.put(x + 1, y + 3, pal.metal);
  p.put(x - 4, y - 1, pal.white);
}

function drawBeast(p: Pix, pal: Pal, face: Face, pose: Pose): void {
  const hx = 16 + pose.lean;
  const by = 26 - pose.bob;
  p.fill(hx - 6, by, hx + 6, by + 10, pal.shirt);
  p.fill(hx - 4, by - 2, hx + 4, by, pal.shirtDk);
  p.fill(9 + pose.legL, 36 - pose.liftL, 13 + pose.legL, 45 - pose.liftL, pal.pants);
  p.fill(18 + pose.legR, 36 - pose.liftR, 22 + pose.legR, 45 - pose.liftR, pal.pants);
  p.fill(8 + pose.legL, 45 - pose.liftL, 14 + pose.legL, 46 - pose.liftL, pal.shoe);
  p.fill(17 + pose.legR, 45 - pose.liftR, 23 + pose.legR, 46 - pose.liftR, pal.shoe);
  p.fill(hx - 8, 30, hx - 6, 40, pal.skin);
  p.fill(hx + 6, 30, hx + 8, 40, pal.skin);
  p.fill(hx - 10 + pose.weapX, 39, hx - 7 + pose.weapX, 41, pal.metal);
  p.fill(hx + 7 + pose.weapX, 39, hx + 10 + pose.weapX, 41, pal.metal);
  p.fill(hx - 2, 22, hx + 2, 28, pal.extra);
  const hy = 15 - pose.bob;
  p.fill(hx - 6, hy - 4, hx + 6, hy + 5, pal.shirt);
  p.fill(hx - 5, hy - 8, hx - 3, hy - 5, pal.hair);
  p.fill(hx + 3, hy - 8, hx + 5, hy - 5, pal.hair);
  p.put(hx - 4, hy - 9, pal.hairLt);
  p.put(hx + 4, hy - 9, pal.hairLt);
  if (face === "right") {
    p.fill(hx + 5, hy - 1, hx + 12, hy + 3, pal.skin);
    p.put(hx + 12, hy + 1, pal.shoe);
    p.fill(hx + 6, hy, hx + 7, hy + 1, pal.eye);
    p.put(hx + 6, hy, pal.white);
    p.put(hx + 11, hy + 2, pal.accent);
  } else if (face === "left") {
    p.fill(hx - 12, hy - 1, hx - 5, hy + 3, pal.skin);
    p.put(hx - 12, hy + 1, pal.shoe);
    p.fill(hx - 8, hy, hx - 7, hy + 1, pal.eye);
    p.put(hx - 8, hy, pal.white);
    p.put(hx - 11, hy + 2, pal.accent);
  } else if (face === "up") {
    p.fill(hx - 6, hy - 4, hx + 6, hy + 5, pal.hair);
    p.fill(hx - 1, 28, hx + 2, 38, pal.hair);
  } else {
    p.fill(hx - 5, hy - 2, hx + 5, hy + 5, pal.skin);
    p.fill(hx - 3, hy + 3, hx + 3, hy + 6, pal.skin);
    p.fill(hx - 4, hy, hx - 3, hy + 1, pal.eye);
    p.fill(hx + 2, hy, hx + 3, hy + 1, pal.eye);
    p.put(hx - 4, hy, pal.white);
    p.put(hx + 2, hy, pal.white);
    p.put(hx, hy + 4, pal.shoe);
    p.put(hx - 1, hy + 4, pal.accent);
    p.put(hx + 1, hy + 4, pal.accent);
  }
  if (pose.flash || pose.spark) {
    p.put(hx - 7, hy - 5, pal.accent);
    p.put(hx + 7, hy - 4, pal.white);
  }
}

function paintProcedural(arch: Archetype, gender: Gender, face: Face, pose: Pose): HTMLCanvasElement {
  const pal = palettes(arch, gender);
  const pix = new Pix();
  const drawFaceDir: Face = face === "left" ? "right" : face;
  if (arch === "wolverine") drawBeast(pix, pal, drawFaceDir, pose);
  else drawHuman(pix, pal, arch, gender, drawFaceDir, pose);
  pix.outline(pal.outline);
  if (face === "left") pix.flipX();
  return pix.canvas();
}

function derivePng(base: HTMLCanvasElement, poseIdStr: string, face: Face): HTMLCanvasElement {
  const src = frameImageData(base);
  const w = src.width;
  const h = src.height;
  const s = src.data;
  const d = new Uint8ClampedArray(w * h * 4);
  const pose = poseOf(poseIdStr, face);
  const toward = face === "right" ? 1 : face === "left" ? -1 : 0;
  const sample = (x: number, y: number): [number, number, number, number] => {
    if (x < 0 || y < 0 || x >= w || y >= h) return [0, 0, 0, 0];
    const i = (y * w + x) * 4;
    return [s[i], s[i + 1], s[i + 2], s[i + 3]];
  };
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sx = x;
      let sy = y;
      if (y < 32) {
        sy += pose.bob;
        sx -= pose.lean;
        if (y < 22) {
          /* head */
        } else if (x < w / 2) sx -= pose.armLx;
        else sx -= pose.armRx;
        if (y >= 22) {
          sy -= pose.armRy < 0 && x >= w / 2 ? pose.armRy : 0;
          sy -= pose.armLy < 0 && x < w / 2 ? pose.armLy : 0;
        }
      } else {
        if (x < w / 2) {
          sx -= pose.legL;
          sy += pose.liftL;
        } else {
          sx -= pose.legR;
          sy += pose.liftR;
        }
      }
      const [r, g, b, a] = sample(sx, sy);
      const i = (y * w + x) * 4;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = a;
    }
  }
  const out = canvasFromImageData(new ImageData(d, w, h));
  if (pose.spark || pose.flash) {
    const ctx = out.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = pose.flash ? "#ffe08a" : "#c8b0ff";
    const ax = face === "left" ? 6 : face === "right" ? 26 : 16;
    ctx.fillRect(ax, 8, 1, 1);
    ctx.fillRect(ax + toward, 6, 1, 1);
    ctx.fillStyle = "#fff";
    ctx.fillRect(ax - 2, 7, 1, 1);
  }
  return out;
}

const frameCache = new Map<string, HTMLCanvasElement>();

function frameOf(arch: Archetype, gender: Gender, face: Face, pose: string): HTMLCanvasElement {
  const png = pngIdle(arch, gender, face);
  const key = `${arch}|${gender}|${face}|${pose}|${png ? 1 : 0}`;
  const hit = frameCache.get(key);
  if (hit) return hit;
  let canvas: HTMLCanvasElement;
  if (png && pose.startsWith("i") && pose === "i0") canvas = png;
  else if (png) canvas = derivePng(png, pose, face);
  else canvas = paintProcedural(arch, gender, face, poseOf(pose, face));
  frameCache.set(key, canvas);
  return canvas;
}

export function drawRig(
  ctx: CanvasRenderingContext2D,
  u: Unit,
  now: number,
  zoom: number,
  feetX: number,
  feetY: number,
  yaw: number,
): void {
  const face = screenFace(u.dir, yaw);
  const pose = poseId(u, now);
  const spr = frameOf(u.archetype, u.gender, face, pose);
  const mag = zoom >= 0.55 ? 3 : 2;
  const dw = SPRITE_W * mag;
  const dh = SPRITE_H * mag;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(spr, 0, 0, SPRITE_W, SPRITE_H, Math.round(feetX - dw / 2), Math.round(feetY - dh), dw, dh);
}

export function spriteDrawHeight(zoom: number): number {
  return SPRITE_H * (zoom >= 0.55 ? 3 : 2);
}
