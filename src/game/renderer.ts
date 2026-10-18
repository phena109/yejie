import type { GameMap, MapTheme } from "./map";
import type { BoardObj } from "./objects";
import { CHAR_H, drawRig, localToGrid, rigDrawHeight, type ProjectFn, type RigBillboard } from "./rig";
import type { Dir, FloatText, Phase, Tile, Unit, Vec2 } from "./types";
import { dirVector, factionColor, isPlayerControlled, key, nextYaw, yawDir, yawPoint } from "./types";

/** Diamond width at 45° yaw. Height and block scale with pitch. */
export const TILE_W = 64;
/** Diamond height at default isometric pitch (30°). */
export const TILE_H = 32;
/** Vertical pixels per height step at default pitch (30°). */
export const BLOCK = 24;
/** Ground slab under height-0 tiles at default pitch. */
export const BASE = 8;
/** Camera elevation from horizontal, degrees. 15 = side-on, 75 = top-down. */
export const PITCH_MIN = 15;
export const PITCH_MAX = 75;
export const PITCH_DEFAULT = 30;
/** Camera zoom range shared by framing and pinch/wheel. 0.4 lets a ~360px phone see the whole M1 board. */
export const ZOOM_MIN = 0.4;
export const ZOOM_MAX = 1.8;

export type AreaKind = "attack" | "skill" | "item";

export interface DrawOverlays {
  move: Set<string>;
  area: Set<string>;
  hot: Set<string>;
  areaKind: AreaKind | null;
  selected: Unit | null;
  target: Unit | null;
  inspect: Vec2 | null;
  phase: Phase;
  /** Unit under the pointer. When omitted, the renderer uses its canvas pointer or `hover`. */
  hover?: Unit | null;
}


export function clampPitch(p: number): number {
  return Math.min(PITCH_MAX, Math.max(PITCH_MIN, p));
}

export interface Cam {
  x: number;
  y: number;
  zoom: number;
}

function iso(x: number, y: number, h: number, tileH: number, block: number): Vec2 {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (tileH / 2) - h * block,
  };
}

function pointInTri(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): boolean {
  const v0x = cx - ax;
  const v0y = cy - ay;
  const v1x = bx - ax;
  const v1y = by - ay;
  const v2x = px - ax;
  const v2y = py - ay;
  const dot00 = v0x * v0x + v0y * v0y;
  const dot01 = v0x * v1x + v0y * v1y;
  const dot02 = v0x * v2x + v0y * v2y;
  const dot11 = v1x * v1x + v1y * v1y;
  const dot12 = v1x * v2x + v1y * v2y;
  const den = dot00 * dot11 - dot01 * dot01;
  if (Math.abs(den) < 1e-8) return false;
  const inv = 1 / den;
  const u = (dot11 * dot02 - dot01 * dot12) * inv;
  const v = (dot00 * dot12 - dot01 * dot02) * inv;
  return u >= -0.02 && v >= -0.02 && u + v <= 1.02;
}

function pointInQuad(
  px: number,
  py: number,
  a: Vec2,
  b: Vec2,
  c: Vec2,
  d: Vec2,
): boolean {
  return pointInTri(px, py, a.x, a.y, b.x, b.y, c.x, c.y) || pointInTri(px, py, a.x, a.y, c.x, c.y, d.x, d.y);
}

interface ScreenRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** What drawUnit put on screen this frame, so the occlusion ghost and hit tests can reuse it. */
export interface BodyStamp {
  source: CanvasImageSource;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
  mirror: boolean;
}

/** Cached alpha of one stamp source. `ok` is false when the bitmap cannot be read. */
interface AlphaMask {
  w: number;
  h: number;
  alpha: Uint8Array;
  rev: number;
  sig: string;
  ok: boolean;
}

/** Name plate plus HP bar, measured at the default anchor. Reused across frames. */
interface LabelSlot {
  id: string;
  text: string;
  accent: string;
  dim: boolean;
  fontPx: number;
  baseline: number;
  plateX: number;
  plateY: number;
  plateW: number;
  plateH: number;
  barW: number;
  barH: number;
  ratio: number;
  /** Plate and HP bar together. The bar is the top of this block. */
  compactW: number;
  compactH: number;
  ringX: number;
  ringY: number;
  ringRx: number;
  ringRy: number;
  bodyX: number;
  bodyY: number;
  bodyW: number;
  bodyH: number;
  dx: number;
  dy: number;
  z: number;
}

function rectsOverlap(a: ScreenRect, b: ScreenRect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function overlapArea(a: ScreenRect, b: ScreenRect): number {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (w <= 0 || h <= 0) return 0;
  return w * h;
}

/** True when `a` and `b` stay at least `gap` screen pixels apart on one axis. */
function separatedBy(a: ScreenRect, b: ScreenRect, gap: number): boolean {
  return (
    a.x + a.w + gap <= b.x ||
    b.x + b.w + gap <= a.x ||
    a.y + a.h + gap <= b.y ||
    b.y + b.h + gap <= a.y
  );
}

/** Acted "E" badge. `homeX`/`homeY` is the mark on the sprite; layout may slide it. */
interface StatusMark {
  owner: string;
  r: number;
  z: number;
  scale: number;
  homeX: number;
  homeY: number;
}

function rectHasPoint(r: ScreenRect, x: number, y: number): boolean {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function packAlpha(data: Uint8ClampedArray, n: number): Uint8Array {
  const alpha = new Uint8Array(n);
  const count = Math.min(n, data.length >> 2);
  for (let i = 0, p = 0; i < count; i++, p += 4) alpha[i] = data[p + 3];
  return alpha;
}

function segmentsIntersect(a: Vec2, b: Vec2, c: Vec2, d: Vec2): boolean {
  const dx1 = b.x - a.x;
  const dy1 = b.y - a.y;
  const dx2 = d.x - c.x;
  const dy2 = d.y - c.y;
  const den = dx1 * dy2 - dy1 * dx2;
  if (Math.abs(den) < 1e-8) return false;
  const t = ((c.x - a.x) * dy2 - (c.y - a.y) * dx2) / den;
  const u = ((c.x - a.x) * dy1 - (c.y - a.y) * dx1) / den;
  return t >= -1e-4 && t <= 1 + 1e-4 && u >= -1e-4 && u <= 1 + 1e-4;
}

/** True when an axis-aligned body box meets a tile face. */
function quadHitsRect(quad: Vec2[], rect: ScreenRect): boolean {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const p of quad) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  if (maxX < rect.x || minX > rect.x + rect.w || maxY < rect.y || minY > rect.y + rect.h) return false;
  const corners: Vec2[] = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.w, y: rect.y },
    { x: rect.x + rect.w, y: rect.y + rect.h },
    { x: rect.x, y: rect.y + rect.h },
  ];
  for (const c of corners) {
    if (pointInQuad(c.x, c.y, quad[0], quad[1], quad[2], quad[3])) return true;
  }
  for (const p of quad) {
    if (rectHasPoint(rect, p.x, p.y)) return true;
  }
  for (let i = 0; i < 4; i++) {
    const a = quad[i];
    const b = quad[(i + 1) % 4];
    for (let j = 0; j < 4; j++) {
      if (segmentsIntersect(a, b, corners[j], corners[(j + 1) % 4])) return true;
    }
  }
  return false;
}


function lerp2(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function wrapUnit(n: number, m: number): number {
  if (!(m > 0)) return 0;
  const r = n % m;
  return r < 0 ? r + m : r;
}

/** Wide skyline strip. About 4× a desktop canvas; drawn 1:1 and wrapped. */
const STRIP_W = 4096;

/**
 * Optional painted skyline per theme. Empty so the procedural strip is used
 * and no image request is made.
 */
const SKYLINE_ART: Partial<Record<MapTheme, string>> = {};

interface SkylineLook {
  sky: [string, string, string];
  glow: [string, string, string];
  body: string;
  win: string;
  winAlt?: string;
  water0: string;
  water1: string;
  fog: string;
  seed: number;
  gap0: number;
  gap1: number;
  bw0: number;
  bw1: number;
  /** Min height and extra height, as fractions of the strip. */
  bh0: number;
  bh1: number;
  /** hash01 above this draws a few windows. 1 = none. */
  winAt: number;
  craneAt: number;
  gantryAt: number;
  step: boolean;
  sign: boolean;
  tower: boolean;
}

const SKYLINE_LOOK: Record<MapTheme, SkylineLook> = {
  roof: {
    sky: ["#2a1c12", "#1a2830", "#10161c"],
    glow: ["rgba(42, 28, 18, 0)", "rgba(200, 130, 55, 0.10)", "rgba(40, 110, 120, 0.18)"],
    body: "rgba(7, 12, 18, 0.82)",
    win: "rgba(255, 196, 120, 0.72)",
    winAlt: "rgba(120, 220, 210, 0.66)",
    water0: "rgba(8, 22, 28, 0.30)",
    water1: "rgba(2, 3, 6, 0.97)",
    fog: "rgba(150, 180, 185, 0.07)",
    seed: 101,
    gap0: 6,
    gap1: 12,
    bw0: 28,
    bw1: 40,
    bh0: 0.22,
    bh1: 0.3,
    winAt: 0.84,
    craneAt: 0.78,
    gantryAt: 1,
    step: false,
    sign: false,
    tower: false,
  },
  alley: {
    sky: ["#1c100a", "#140c0a", "#0c0908"],
    glow: ["rgba(40, 18, 8, 0)", "rgba(220, 110, 30, 0.09)", "rgba(150, 60, 16, 0.16)"],
    body: "rgba(14, 7, 4, 0.84)",
    win: "rgba(255, 176, 70, 0.78)",
    water0: "rgba(20, 10, 6, 0.30)",
    water1: "rgba(3, 2, 2, 0.97)",
    fog: "rgba(190, 140, 80, 0.06)",
    seed: 211,
    gap0: 3,
    gap1: 6,
    bw0: 16,
    bw1: 18,
    bh0: 0.58,
    bh1: 0.34,
    winAt: 0.88,
    craneAt: 1,
    gantryAt: 1,
    step: true,
    sign: false,
    tower: false,
  },
  warehouse: {
    sky: ["#101820", "#141c26", "#0c1218"],
    glow: ["rgba(16, 28, 40, 0)", "rgba(130, 160, 180, 0.08)", "rgba(60, 90, 112, 0.15)"],
    body: "rgba(7, 12, 18, 0.84)",
    win: "rgba(186, 220, 235, 0.62)",
    water0: "rgba(10, 16, 24, 0.32)",
    water1: "rgba(2, 3, 6, 0.97)",
    fog: "rgba(150, 175, 190, 0.065)",
    seed: 307,
    gap0: 16,
    gap1: 22,
    bw0: 70,
    bw1: 80,
    bh0: 0.16,
    bh1: 0.18,
    winAt: 0.9,
    craneAt: 0.62,
    gantryAt: 0.38,
    step: false,
    sign: false,
    tower: false,
  },
  street: {
    sky: ["#1a1018", "#140e16", "#0e0a12"],
    glow: ["rgba(36, 10, 28, 0)", "rgba(190, 40, 130, 0.08)", "rgba(100, 30, 80, 0.14)"],
    body: "rgba(12, 6, 14, 0.82)",
    win: "rgba(255, 90, 180, 0.75)",
    water0: "rgba(18, 8, 16, 0.30)",
    water1: "rgba(3, 2, 4, 0.97)",
    fog: "rgba(190, 140, 175, 0.06)",
    seed: 409,
    gap0: 8,
    gap1: 14,
    bw0: 32,
    bw1: 40,
    bh0: 0.32,
    bh1: 0.34,
    winAt: 0.74,
    craneAt: 1,
    gantryAt: 1,
    step: true,
    sign: true,
    tower: false,
  },
  plaza: {
    sky: ["#10181c", "#14161e", "#10141a"],
    glow: ["rgba(12, 32, 36, 0)", "rgba(50, 150, 155, 0.08)", "rgba(90, 60, 150, 0.13)"],
    body: "rgba(8, 10, 18, 0.8)",
    win: "rgba(150, 235, 220, 0.68)",
    winAlt: "rgba(190, 150, 235, 0.64)",
    water0: "rgba(8, 16, 24, 0.30)",
    water1: "rgba(2, 3, 6, 0.97)",
    fog: "rgba(150, 170, 190, 0.06)",
    seed: 521,
    gap0: 28,
    gap1: 48,
    bw0: 100,
    bw1: 90,
    bh0: 0.12,
    bh1: 0.16,
    winAt: 0.9,
    craneAt: 1,
    gantryAt: 1,
    step: false,
    sign: false,
    tower: true,
  },
};

function fillWrap(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  span: number,
): void {
  if (w <= 0 || h <= 0 || span <= 0) return;
  const x0 = wrapUnit(x, span);
  ctx.fillRect(x0, y, w, h);
  if (x0 + w > span) ctx.fillRect(x0 - span, y, w, h);
}

function paintCrane(
  ctx: CanvasRenderingContext2D,
  x: number,
  roofY: number,
  mast: number,
  jib: number,
  span: number,
): void {
  const top = roofY - mast;
  fillWrap(ctx, x, top, 2.5, mast, span);
  fillWrap(ctx, x - jib * 0.22, top, jib, 2, span);
  fillWrap(ctx, x + jib * 0.42, top, 1.6, mast * 0.42, span);
}

function paintGantry(
  ctx: CanvasRenderingContext2D,
  x: number,
  roofY: number,
  bw: number,
  mast: number,
  span: number,
): void {
  const top = roofY - mast;
  const left = x + bw * 0.16;
  const right = x + bw * 0.74;
  fillWrap(ctx, left, top, 3, mast, span);
  fillWrap(ctx, right, top, 3, mast, span);
  fillWrap(ctx, left, top, Math.max(3, right - left), 2.5, span);
}

function paintBlocks(
  ctx: CanvasRenderingContext2D,
  look: SkylineLook,
  w: number,
  h: number,
  seed: number,
  heightScale: number,
  far: boolean,
): void {
  ctx.fillStyle = look.body;
  let x = 0;
  let i = 0;
  const gapMul = far ? 1.7 : 1;
  while (x < w && i < 700) {
    const u = hash01(seed + i * 19.17);
    const v = hash01(seed + i * 7.31 + 2);
    const gap = (look.gap0 + u * look.gap1) * gapMul;
    const bw = (look.bw0 + v * look.bw1) * (far ? 1.15 : 1);
    const bh = h * (look.bh0 + hash01(seed + i * 3.1) * look.bh1) * heightScale;
    const by = h - bh;
    fillWrap(ctx, x, by, bw, bh, w);
    if (!far && look.step && hash01(seed + i * 11.2) > 0.42) {
      const inset = bw * 0.18;
      const stepH = Math.max(3, bh * 0.14);
      fillWrap(ctx, x + inset, by - stepH, Math.max(2, bw - inset * 2), stepH + 1, w);
    }
    if (!far && look.craneAt < 1 && hash01(seed + i * 13.7) > look.craneAt) {
      paintCrane(ctx, x + bw * 0.62, by, h * (0.16 + u * 0.18), bw * 1.25, w);
    }
    if (!far && look.gantryAt < 1 && hash01(seed + i * 15.1) > look.gantryAt) {
      paintGantry(ctx, x, by, bw, h * (0.2 + v * 0.18), w);
    }
    if (!far && look.sign && hash01(seed + i * 17.7) > 0.86) {
      ctx.fillStyle = look.win;
      fillWrap(ctx, x + bw * 0.12, by + bh * 0.14, bw * 0.46, Math.max(2, bh * 0.04), w);
      ctx.fillStyle = look.body;
    }
    if (!far && hash01(seed + i * 23.9) > look.winAt) {
      const alt = !!look.winAlt && hash01(seed + i * 4.4) > 0.8;
      ctx.fillStyle = alt && look.winAlt ? look.winAlt : look.win;
      const n = 1 + Math.floor(hash01(seed + i * 8.2) * 3);
      for (let k = 0; k < n; k++) {
        if (hash01(seed + i * 50 + k * 3) < 0.28) continue;
        const wx = x + bw * (0.2 + hash01(seed + i * 9 + k) * 0.55);
        const wy = by + bh * (0.16 + hash01(seed + i * 6 + k) * 0.55);
        fillWrap(ctx, wx, wy, Math.max(2, bw * 0.05), Math.max(3, bh * 0.04), w);
      }
      ctx.fillStyle = look.body;
    }
    x += bw + gap;
    i++;
  }
}

function paintSkylineStrip(ctx: CanvasRenderingContext2D, theme: MapTheme, w: number, h: number): void {
  const look = SKYLINE_LOOK[theme];
  const glow = ctx.createLinearGradient(0, 0, 0, h);
  glow.addColorStop(0, look.glow[0]);
  glow.addColorStop(0.58, look.glow[1]);
  glow.addColorStop(1, look.glow[2]);
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalAlpha = 0.45;
  paintBlocks(ctx, look, w, h, look.seed + 80, 0.62, true);
  ctx.restore();
  paintBlocks(ctx, look, w, h, look.seed, 1, false);
  if (!look.tower) return;
  ctx.fillStyle = look.body;
  const tx = w * 0.64;
  const tw = 36;
  const th = h * 0.8;
  fillWrap(ctx, tx, h - th, tw, th, w);
  fillWrap(ctx, tx + tw * 0.4, h - th - h * 0.07, 5, h * 0.09, w);
  ctx.fillStyle = look.win;
  for (let k = 0; k < 5; k++) {
    if (hash01(look.seed + 90 + k) < 0.28) continue;
    fillWrap(ctx, tx + 12, h - th * (0.18 + k * 0.14), 4, 3, w);
  }
}

function bitmapSize(src: HTMLCanvasElement | HTMLImageElement): { w: number; h: number } {
  if (src instanceof HTMLCanvasElement) return { w: src.width, h: src.height };
  return { w: src.naturalWidth, h: src.naturalHeight };
}

/** Elite billboards (drawUnit / drawMapDoll) are drawn this much taller. */
const ELITE_SCALE = 1.12;
/** Sprite feet sit this many zoom-pixels below the projected ground point. */
const FEET_DROP = 2;
/** Selection ring under the feet, multiplied by eliteScale * zoom. Center is FEET + RING_DROP * zoom. */
const RING_RX = 12.2;
const RING_RY = 5.4;
const RING_DROP = 1;
/**
 * Fallback body width / billboard height, used only before a frame has cached a draw rect.
 * drawMapDoll sprites are rigDrawHeight tall and about half as wide; rigs use the same figure box.
 */
const UNIT_BODY_ASPECT = 0.5;
/** Fallback body width when a stamp image cannot be read. Full height is still used. */
const UNIT_HIT_WIDTH = 0.7;
/** Source alpha above this (out of 255) counts as the unit. */
const UNIT_ALPHA_HIT = 40;
/** Screen-pixel radius sampled around the pointer when reading stamp alpha. */
const UNIT_ALPHA_RADIUS = 2;
/** Feet-ring pick is the drawn ellipse grown by this factor. Both radii scale. */
const UNIT_RING_HIT_SCALE = 1.15;
/** Lower-body box starts this far down the stamp (0 = top, 1 = feet). */
const UNIT_LOWER_TOP = 0.45;
/** Lower-body box is at least this fraction of the stamp width, centred on the ring. */
const UNIT_LOWER_STAMP_W = 0.55;
/** And at least this fraction of the ring diameter (2 * RING_RX * scale). */
const UNIT_LOWER_RING_W = 0.8;
/** Occlusion ghost. Full-opacity source, drawn over whatever hid the body. */
const GHOST_ALPHA = 0.45;
/**
 * Spent player units stay readable: the body is about 78% opaque and, where
 * canvas filters work, mildly desaturated and darkened. Rings and plates are not faded.
 */
const ACTED_BODY_ALPHA = 0.78;
const ACTED_BODY_FILTER = "saturate(0.55) brightness(0.8)";
/** Screen pixels kept between plate blocks, and between a plate and an E icon. */
const LABEL_GAP = 1;
/** Plate centre stays within this many screen pixels of its unit. Tried before any lift. */
const LABEL_NUDGE_CAP = 24;
/** Extra lift above the anchor, in screen pixels. An E icon moves aside instead of lifting past this. */
const LABEL_LIFT_CAP = 20;
/** Draw a leader once a plate has left its anchor by more than this many screen pixels. */
const LABEL_LEADER_MIN = 8;
type PaintedAngle = "front" | "ne" | "right" | "se" | "back" | "sw" | "left" | "nw";
/**
 * Painted map art, indexed by screen sector (see screenSector): 0 toward the viewer, then clockwise
 * on screen: 1 down-left, 2 left, 3 up-left, 4 away, 5 up-right, 6 right, 7 down-right.
 * Each entry is the file that actually shows that view (checked by eye, 19 Oct): the file names do
 * not follow grid compass points. Mara: ne = 3/4 front looking right, nw = 3/4 front looking left,
 * se = 3/4 back turned left, sw = 3/4 back turned right. Dana: ne looks left, nw looks right, and
 * both se and sw are 3/4 back turned right, so up-left mirrors sw.
 */
const PAINTED_BY_SECTOR: Record<"mara" | "dana", ReadonlyArray<readonly [PaintedAngle, boolean]>> = {
  mara: [["front", false], ["nw", false], ["left", false], ["se", false], ["back", false], ["sw", false], ["right", false], ["ne", false]],
  dana: [["front", false], ["ne", false], ["left", false], ["sw", true], ["back", false], ["se", false], ["right", false], ["nw", false]],
};
/** Priya's single painting is a 3/4 front view looking down-left; mirror it for right-facing sectors. */
const PRIYA_MIRROR_SECTORS = new Set([5, 6, 7]);
const SCREEN_SECTORS = 8;

/**
 * Some painted map files have no alpha (a flat dark backdrop). Flood-fill from the border and clear
 * every connected pixel within BACKDROP_TOL of the median border colour, then swap the cleaned
 * pixels back into the same <img>. Images that already have transparent corners are left alone.
 */
const BACKDROP_TOL = 9;
function keyOpaqueBackdrop(img: HTMLImageElement): void {
  if (img.dataset.keyed || typeof document === "undefined") return;
  img.dataset.keyed = "1";
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!(w > 2 && h > 2)) return;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return;
  g.drawImage(img, 0, 0);
  let data: ImageData;
  try {
    data = g.getImageData(0, 0, w, h);
  } catch {
    return;
  }
  const px = data.data;
  if (px[3] < 250 && px[(w * h - 1) * 4 + 3] < 250) return;
  const border: number[][] = [[], [], []];
  const pushB = (i: number): void => {
    for (let k = 0; k < 3; k++) border[k].push(px[i * 4 + k]);
  };
  for (let x = 0; x < w; x++) {
    pushB(x);
    pushB((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    pushB(y * w);
    pushB(y * w + w - 1);
  }
  const bg = border.map((a) => a.sort((p, q) => p - q)[a.length >> 1]);
  const near = (i: number): boolean =>
    Math.abs(px[i * 4] - bg[0]) <= BACKDROP_TOL &&
    Math.abs(px[i * 4 + 1] - bg[1]) <= BACKDROP_TOL &&
    Math.abs(px[i * 4 + 2] - bg[2]) <= BACKDROP_TOL;
  const seen = new Uint8Array(w * h);
  const stack: number[] = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const i = stack.pop() as number;
    if (seen[i] || !near(i)) continue;
    seen[i] = 1;
    px[i * 4 + 3] = 0;
    const x = i % w;
    if (x > 0) stack.push(i - 1);
    if (x < w - 1) stack.push(i + 1);
    if (i >= w) stack.push(i - w);
    if (i < w * (h - 1)) stack.push(i + w);
  }
  g.putImageData(data, 0, 0);
  img.src = c.toDataURL("image/png");
}

function unitDrawHeight(zoom: number, elite: boolean): number {
  return rigDrawHeight(zoom) * (elite ? ELITE_SCALE : 1);
}

/** Team colour pulled a little toward neutral grey. Same strength, quieter ring. */
function greyerAccent(hex: string): string {
  if (hex.length !== 7 || hex.charCodeAt(0) !== 35) return hex;
  const n = Number.parseInt(hex.slice(1), 16);
  if (!Number.isFinite(n)) return hex;
  const mix = (c: number): number => Math.round(c * 0.72 + 0x96 * 0.28);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  const h = (c: number): string => c.toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  cam: Cam = { x: -224, y: 180, zoom: 0.7 };
  w = 390;
  h = 700;
  time = 0;
  yaw = 0;
  pitch = PITCH_DEFAULT;
  private mapW = 10;
  private mapH = 12;
  private readonly kingsWharf = new Image();
  /** M1 roof plate. `?bgslot` turns this off so the skyline slot can be previewed. */
  legacyPlate = true;
  private skylineCache = new Map<MapTheme, HTMLCanvasElement>();
  private skylineArt = new Map<MapTheme, HTMLImageElement>();
  private skylineCacheH = -1;
  private skylineSlide = 0;
  private skylineSlideAt = 0;
  private skylineSlideSpan = 0;
  private skylineSlideReady = false;
  private readonly mapDolls: Record<"mara" | "dana" | "priya", HTMLImageElement> = {
    mara: new Image(),
    dana: new Image(),
    priya: new Image(),
  };
  private readonly maraAngles: Record<"front" | "ne" | "right" | "se" | "back" | "sw" | "left" | "nw", HTMLImageElement> = {
    front: new Image(),
    ne: new Image(),
    right: new Image(),
    se: new Image(),
    back: new Image(),
    sw: new Image(),
    left: new Image(),
    nw: new Image(),
  };
  private readonly danaAngles: Record<"front" | "ne" | "right" | "se" | "back" | "sw" | "left" | "nw", HTMLImageElement> = {
    front: new Image(),
    ne: new Image(),
    right: new Image(),
    se: new Image(),
    back: new Image(),
    sw: new Image(),
    left: new Image(),
    nw: new Image(),
  };
  /** Per-unit body drawn this frame. Rig entries are copies; the WebGL canvas is shared. */
  readonly bodyStamps = new Map<string, BodyStamp>();
  /** Alpha of each stamp source. Keyed by the image (one file per angle) and invalidated when a rig frame repaints that canvas. */
  private readonly alphaMasks = new WeakMap<CanvasImageSource, AlphaMask>();
  private readonly sourceRev = new WeakMap<CanvasImageSource, number>();
  private alphaReadCanvas: HTMLCanvasElement | null = null;
  private alphaReadCtx: CanvasRenderingContext2D | null = null;
  private readonly rigSnaps = new Map<string, HTMLCanvasElement>();
  private ghostCanvas: HTMLCanvasElement | null = null;
  private ghostCtx: CanvasRenderingContext2D | null = null;
  /** Placed name plates from the last draw(), in canvas coordinates. */
  labelRects: { id: string; x: number; y: number; w: number; h: number }[] = [];
  /** Unit under the pointer. Pointer moves refresh this; a preset value is kept while the pointer is outside. */
  hover: Unit | null = null;
  private pointerX = 0;
  private pointerY = 0;
  private pointerInside = false;
  private placedCount = 0;
  private statusCount = 0;
  /** Living units passed to the current overlay pass. Slots past this are stale. */
  private overlayCount = 0;
  private readonly labelPool: LabelSlot[] = [];
  private readonly labelOrder: number[] = [];
  private readonly placedRects: ScreenRect[] = [];
  /** Status badges (the acted "E" mark and any sibling icon) from this frame. */
  private readonly statusRects: ScreenRect[] = [];
  private readonly statusMarks: StatusMark[] = [];
  /**
   * Plate shift (dx, dy) last committed for each unit, plus the tile it was solved on.
   * The shift is relative to that unit's own sprite (itself anchored at worldToScreen).
   * It stays put until that unit changes tile, or the frozen rect would overlap another
   * plate. A neighbour moving yields; this plate is not pushed aside. E icons slide
   * off a plate instead of pushing it.
   */
  private readonly labelHold = new Map<string, { dx: number; dy: number; x: number; y: number }>();
  private readonly labelSeen = new Set<string>();

  tileH(): number {
    return TILE_W * Math.sin((this.pitch * Math.PI) / 180);
  }

  blockH(): number {
    const den = Math.cos((PITCH_DEFAULT * Math.PI) / 180);
    return BLOCK * Math.cos((this.pitch * Math.PI) / 180) / den;
  }

  baseH(): number {
    const den = Math.cos((PITCH_DEFAULT * Math.PI) / 180);
    return BASE * Math.cos((this.pitch * Math.PI) / 180) / den;
  }

  addPitch(dyPx: number): void {
    this.pitch = clampPitch(this.pitch + dyPx * 0.16);
  }

  setPitch(p: number): void {
    this.pitch = clampPitch(p);
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    this.ctx = ctx;
    this.kingsWharf.decoding = "async";
    this.kingsWharf.src = "./sprites/scene-kings-wharf.png";
    if (location.search.includes("bgslot")) this.legacyPlate = false;
    for (const [archetype, image] of Object.entries(this.mapDolls)) {
      image.decoding = "async";
      image.src = `./sprites/${archetype}.png`;
    }
    for (const [angle, image] of Object.entries(this.maraAngles)) {
      image.decoding = "async";
      image.src = `./sprites/mara-${angle}.png`;
    }
    for (const [angle, image] of Object.entries(this.danaAngles)) {
      image.decoding = "async";
      // Dana's four diagonal paintings are opaque RGB on a navy backdrop; clear it once loaded.
      image.addEventListener("load", () => keyOpaqueBackdrop(image));
      image.src = `./sprites/dana-${angle}.png`;
    }
    this.resize();
    this.trackCanvasPointer();
  }

  resize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, rect.width);
    this.h = Math.max(1, rect.height);
    this.canvas.width = Math.floor(this.w * dpr);
    this.canvas.height = Math.floor(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  forceSize(w: number, h: number): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w;
    this.h = h;
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private syncMap(map: GameMap): void {
    this.mapW = map.w;
    this.mapH = map.h;
  }

  isoOf(gx: number, gy: number, h = 0): Vec2 {
    const p = yawPoint(gx, gy, this.yaw, this.mapW, this.mapH);
    return iso(p.x, p.y, h, this.tileH(), this.blockH());
  }

  worldToScreen(x: number, y: number, h = 0): Vec2 {
    const p = this.isoOf(x, y, h);
    return {
      x: (p.x - this.cam.x) * this.cam.zoom + this.w / 2,
      y: (p.y - this.cam.y) * this.cam.zoom + this.h / 2,
    };
  }

  private topCorners(x: number, y: number, h: number): Vec2[] {
    const off: Array<[number, number]> = [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [-0.5, 0.5],
    ];
    return off.map(([dx, dy]) => this.worldToScreen(x + dx, y + dy, h));
  }

  private topMetrics(x: number, y: number, h: number): { cx: number; cy: number; hw: number; hh: number; drop: number; top: Vec2[] } {
    const top = this.topCorners(x, y, h);
    let cx = 0;
    let cy = 0;
    for (const p of top) {
      cx += p.x;
      cy += p.y;
    }
    cx /= 4;
    cy /= 4;
    let hw = 0;
    let hh = 0;
    for (const p of top) {
      hw = Math.max(hw, Math.abs(p.x - cx));
      hh = Math.max(hh, Math.abs(p.y - cy));
    }
    return {
      cx,
      cy,
      hw,
      hh,
      drop: (this.baseH() + h * this.blockH()) * this.cam.zoom,
      top,
    };
  }

  private frontFaces(top: Vec2[], drop: number): Array<[Vec2, Vec2, Vec2, Vec2]> {
    const faces: Array<{ pts: [Vec2, Vec2, Vec2, Vec2]; y: number }> = [];
    for (let i = 0; i < 4; i++) {
      const a = top[i];
      const b = top[(i + 1) % 4];
      const c = { x: b.x, y: b.y + drop };
      const d = { x: a.x, y: a.y + drop };
      faces.push({ pts: [a, b, c, d], y: (a.y + b.y + c.y + d.y) / 4 });
    }
    faces.sort((a, b) => a.y - b.y);
    return faces.slice(-2).map((f) => f.pts);
  }

  screenToGrid(sx: number, sy: number): Vec2 {
    const ix = this.cam.x + (sx - this.w / 2) / this.cam.zoom;
    const iy = this.cam.y + (sy - this.h / 2) / this.cam.zoom;
    const tw = TILE_W / 2;
    const th = this.tileH() / 2;
    const rx = (ix / tw + iy / th) / 2;
    const ry = (iy / th - ix / tw) / 2;
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    const dx = rx * c - ry * s;
    const dy = rx * s + ry * c;
    return { x: dx + (this.mapW - 1) / 2, y: dy + (this.mapH - 1) / 2 };
  }

  lockGridToScreen(gx: number, gy: number, h: number, sx: number, sy: number): void {
    const p = this.isoOf(gx, gy, h);
    this.cam.x = p.x - (sx - this.w / 2) / this.cam.zoom;
    this.cam.y = p.y - (sy - this.h / 2) / this.cam.zoom;
  }


  /**
   * Painter order for tiles, props, and the units that stand on them.
   * Depth is the screen-y of the standing point (the foot, before the shared
   * feet drop). Higher y draws later. Ties break on screen-x, then grid position.
   */
  private cellsInDrawOrder(map: GameMap): Vec2[] {
    const cells: Vec2[] = [];
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) cells.push({ x, y });
    }
    cells.sort((a, b) => {
      const pa = this.worldToScreen(a.x, a.y, map.heightAt(a.x, a.y));
      const pb = this.worldToScreen(b.x, b.y, map.heightAt(b.x, b.y));
      return this.cmpScreenDepth(pa.y, pa.x, a.y, a.x, pb.y, pb.x, b.y, b.x);
    });
    return cells;
  }

  /** Higher screen-y first in the sort result (drawn later). Then screen-x, then the tie ids. */
  private cmpScreenDepth(
    ay: number,
    ax: number,
    aId: number,
    aId2: number,
    by: number,
    bx: number,
    bId: number,
    bId2: number,
  ): number {
    const dy = ay - by;
    if (Math.abs(dy) > 0.05) return dy;
    const dx = ax - bx;
    if (Math.abs(dx) > 0.05) return dx;
    if (aId !== bId) return aId - bId;
    return aId2 - bId2;
  }

  /** Same depth key as the cell list: foot screen-y, then screen-x, then unit id. */
  private orderUnits(list: Unit[], map: GameMap): void {
    list.sort((a, b) => {
      const pa = this.unitPose(a, map);
      const pb = this.unitPose(b, map);
      const dy = pa.feetY - pb.feetY;
      if (Math.abs(dy) > 0.05) return dy;
      const dx = pa.x - pb.x;
      if (Math.abs(dx) > 0.05) return dx;
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
  }

  /**
   * Tile whose top-face diamond contains the screen point.
   * Tiles are tested front to back on the ground plane (the same projection as
   * worldToScreen, with height left out of the depth). The first hit wins, so a
   * raised tile beats the lower tiles behind it that its top covers. Side faces
   * are not pickable.
   */
  hitTile(sx: number, sy: number, map: GameMap): Vec2 | null {
    this.syncMap(map);
    const cells: Vec2[] = [];
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) cells.push({ x, y });
    }
    cells.sort((a, b) => {
      const pa = this.worldToScreen(a.x, a.y, 0);
      const pb = this.worldToScreen(b.x, b.y, 0);
      return this.cmpScreenDepth(pb.y, pb.x, b.y, b.x, pa.y, pa.x, a.y, a.x);
    });
    for (const c of cells) {
      const t = map.tiles[c.y][c.x];
      if (this.hitTop(sx, sy, t.x, t.y, t.h)) return { x: c.x, y: c.y };
    }
    return null;
  }

  /** Viewport point to a tile, using the same pick as a board click. */
  tileAtScreen(clientX: number, clientY: number, map: GameMap): Vec2 | null {
    const r = this.canvas.getBoundingClientRect();
    return this.hitTile(clientX - r.left, clientY - r.top, map);
  }

  /** Viewport point of a tile's top-face centre. */
  screenOfTile(x: number, y: number, map: GameMap): Vec2 {
    this.syncMap(map);
    const t = map.tile(x, y);
    const p = this.worldToScreen(x, y, t ? t.h : 0);
    const r = this.canvas.getBoundingClientRect();
    return { x: p.x + r.left, y: p.y + r.top };
  }

  /**
   * Living unit under the pointer. Front-most first (reverse of cellsInDrawOrder,
   * and within a cell the last unit drawn).
   * A unit matches on stamp alpha, the enlarged feet ring, or the lower-body box.
   * An alpha hit beats another unit's ring or lower body, so a visible head still
   * wins where the nearer unit's pixels are not under the pointer.
   * A miss returns null so the caller can fall back to hitTile.
   */
  hitUnit(sx: number, sy: number, map: GameMap, units: Unit[]): Unit | null {
    this.syncMap(map);
    const byTile = new Map<string, Unit[]>();
    for (const u of units) {
      if (u.dead) continue;
      const k = key(u.x, u.y);
      const list = byTile.get(k);
      if (list) list.push(u);
      else byTile.set(k, [u]);
    }
    const drawOrder: Unit[] = [];
    for (const c of this.cellsInDrawOrder(map)) {
      const list = byTile.get(key(c.x, c.y));
      if (!list) continue;
      this.orderUnits(list, map);
      for (const u of list) drawOrder.push(u);
    }
    return this.pickDrawnUnit(sx, sy, drawOrder, map);
  }

  /**
   * `drawOrder` is back-to-front, matching draw().
   * The first alpha hit wins. A feet or lower-body hit is kept only until an alpha hit,
   * and only the front-most of those is used when no stamp pixel matches.
   */
  private pickDrawnUnit(sx: number, sy: number, drawOrder: Unit[], map: GameMap): Unit | null {
    let feet: Unit | null = null;
    for (let i = drawOrder.length - 1; i >= 0; i--) {
      const hit = this.unitContainsPoint(sx, sy, drawOrder[i], map);
      if (hit === "alpha") return drawOrder[i];
      if (hit === "feet" && feet == null) feet = drawOrder[i];
    }
    return feet;
  }

  /**
   * "alpha" — stamp pixels, full height including the head. A stamp with no readable
   * image falls back to the body rect.
   * "feet" — enlarged feet ring, or the lower-body box. Both count even where the
   * stamp is transparent.
   */
  private unitContainsPoint(sx: number, sy: number, u: Unit, map: GameMap): "alpha" | "feet" | null {
    if (this.unitAlphaHit(sx, sy, u, map)) return "alpha";
    if (this.unitRingHit(sx, sy, u, map) || this.unitLowerBodyHit(sx, sy, u, map)) return "feet";
    return null;
  }

  /** True when the pointer is on this unit's drawn pixels. */
  private unitAlphaHit(sx: number, sy: number, u: Unit, map: GameMap): boolean {
    const stamp = this.bodyStamps.get(u.id);
    if (stamp && stamp.dw > 0 && stamp.dh > 0) {
      if (sx < stamp.dx || sy < stamp.dy || sx > stamp.dx + stamp.dw || sy > stamp.dy + stamp.dh) return false;
      const pixel = this.stampPixelHit(stamp, sx, sy);
      if (pixel != null) return pixel;
    }
    return rectHasPoint(this.unitBodyRect(u, this.unitPose(u, map)), sx, sy);
  }

  /** Feet ring ellipse, 1.15× the drawn ring, centred on the same point as the paint. */
  private unitRingHit(sx: number, sy: number, u: Unit, map: GameMap): boolean {
    const pose = this.unitPose(u, map);
    const rx = RING_RX * pose.scale * UNIT_RING_HIT_SCALE;
    const ry = RING_RY * pose.scale * UNIT_RING_HIT_SCALE;
    if (rx <= 0 || ry <= 0) return false;
    const nx = (sx - pose.x) / rx;
    const ny = (sy - (pose.feetY + RING_DROP * pose.z)) / ry;
    return nx * nx + ny * ny <= 1;
  }

  /**
   * Lower body, centred on the ring x. From 45% down the stamp to the bottom of
   * the drawn ring (ring centre + RING_RY * scale). Width is the larger of 55% of
   * the stamp and 80% of the ring diameter.
   */
  private unitLowerBodyHit(sx: number, sy: number, u: Unit, map: GameMap): boolean {
    const stamp = this.bodyStamps.get(u.id);
    if (!stamp || !(stamp.dw > 0) || !(stamp.dh > 0)) return false;
    const pose = this.unitPose(u, map);
    const width = Math.max(stamp.dw * UNIT_LOWER_STAMP_W, 2 * RING_RX * pose.scale * UNIT_LOWER_RING_W);
    const left = pose.x - width / 2;
    const top = stamp.dy + stamp.dh * UNIT_LOWER_TOP;
    const bottom = pose.feetY + RING_DROP * pose.z + RING_RY * pose.scale;
    return sx >= left && sx <= left + width && sy >= top && sy <= bottom;
  }

  /**
   * Fallback body box when the stamp image cannot be read: full drawn height,
   * about 70% of the width. Before a stamp exists, the computed billboard.
   */
  private unitBodyRect(u: Unit, pose: { x: number; feetY: number; dh: number }): ScreenRect {
    const stamp = this.bodyStamps.get(u.id);
    if (stamp && stamp.dw > 0 && stamp.dh > 0) {
      const w = stamp.dw * UNIT_HIT_WIDTH;
      return { x: stamp.dx + (stamp.dw - w) / 2, y: stamp.dy, w, h: stamp.dh };
    }
    const dw = pose.dh * UNIT_BODY_ASPECT;
    return { x: pose.x - dw / 2, y: pose.feetY - pose.dh, w: dw, h: pose.dh };
  }

  /** True when stamp alpha near the pointer is opaque. Null when the bitmap cannot be read. */
  private stampPixelHit(stamp: BodyStamp, sx: number, sy: number): boolean | null {
    const mask = this.alphaMask(stamp);
    if (!mask) return null;
    const rad = UNIT_ALPHA_RADIUS;
    const r2 = rad * rad;
    for (let oy = -rad; oy <= rad; oy++) {
      for (let ox = -rad; ox <= rad; ox++) {
        if (ox * ox + oy * oy > r2) continue;
        if (this.stampAlpha(stamp, mask, sx + ox, sy + oy) > UNIT_ALPHA_HIT) return true;
      }
    }
    return false;
  }

  private stampAlpha(stamp: BodyStamp, mask: AlphaMask, sx: number, sy: number): number {
    let lx = sx - stamp.dx;
    const ly = sy - stamp.dy;
    if (lx < 0 || ly < 0 || lx >= stamp.dw || ly >= stamp.dh) return 0;
    if (stamp.mirror) lx = stamp.dw - lx;
    const ix = Math.min(mask.w - 1, Math.floor((lx / stamp.dw) * mask.w));
    const iy = Math.min(mask.h - 1, Math.floor((ly / stamp.dh) * mask.h));
    if (ix < 0 || iy < 0) return 0;
    return mask.alpha[iy * mask.w + ix];
  }

  /**
   * Lazily build a small alpha mask for this stamp's source.
   * Map sprites are keyed by their image (each angle is its own file).
   * Rig canvases are invalidated when rememberRig bumps their revision.
   * The main framebuffer is never read.
   */
  private alphaMask(stamp: BodyStamp): AlphaMask | null {
    const source = stamp.source;
    const sw = Math.round(stamp.sw);
    const sh = Math.round(stamp.sh);
    if (!(sw > 0) || !(sh > 0)) return null;
    const rev = this.sourceRev.get(source) ?? 0;
    const sig = source instanceof HTMLImageElement ? `${source.src}:${source.naturalWidth}x${source.naturalHeight}` : `${sw}x${sh}`;
    const cached = this.alphaMasks.get(source);
    if (cached && cached.rev === rev && cached.w === sw && cached.h === sh && cached.sig === sig) {
      return cached.ok ? cached : null;
    }
    const alpha = this.readAlpha(source, sw, sh);
    const mask: AlphaMask = {
      w: sw,
      h: sh,
      alpha: alpha ?? new Uint8Array(0),
      rev,
      sig,
      ok: alpha != null,
    };
    this.alphaMasks.set(source, mask);
    return mask.ok ? mask : null;
  }

  private readAlpha(source: CanvasImageSource, sw: number, sh: number): Uint8Array | null {
    try {
      if (source instanceof HTMLCanvasElement) {
        const direct = source.getContext("2d");
        if (direct && source.width >= sw && source.height >= sh) {
          return packAlpha(direct.getImageData(0, 0, sw, sh).data, sw * sh);
        }
      }
      const g = this.alphaReader();
      const canvas = this.alphaReadCanvas;
      if (!g || !canvas) return null;
      if (canvas.width !== sw || canvas.height !== sh) {
        canvas.width = sw;
        canvas.height = sh;
      }
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalAlpha = 1;
      g.globalCompositeOperation = "source-over";
      g.clearRect(0, 0, sw, sh);
      g.drawImage(source, 0, 0, sw, sh);
      return packAlpha(g.getImageData(0, 0, sw, sh).data, sw * sh);
    } catch {
      return null;
    }
  }

  private alphaReader(): CanvasRenderingContext2D | null {
    if (!this.alphaReadCanvas || !this.alphaReadCtx) {
      this.alphaReadCanvas = document.createElement("canvas");
      this.alphaReadCtx = this.alphaReadCanvas.getContext("2d", { willReadFrequently: true });
    }
    return this.alphaReadCtx;
  }

  private hitTop(sx: number, sy: number, x: number, y: number, h: number): boolean {
    const top = this.topCorners(x, y, h);
    return pointInQuad(sx, sy, top[0], top[1], top[2], top[3]);
  }

  rotate(map: GameMap): void {
    this.syncMap(map);
    const focus = this.hitTile(this.w / 2, this.h / 2, map) ?? { x: Math.floor(map.w / 2), y: Math.floor(map.h / 2) };
    this.yaw = nextYaw(this.yaw);
    const h = map.heightAt(focus.x, focus.y);
    const p = this.isoOf(focus.x, focus.y, h);
    this.cam.x = p.x;
    this.cam.y = p.y - 24;
  }

  centerOn(units: Unit[], map: GameMap): void {
    this.syncMap(map);
    const living = units.filter((u) => !u.dead && u.team === "player" && !u.npc);
    if (!living.length) return;
    let x = 0;
    let y = 0;
    for (const u of living) {
      const p = this.isoOf(u.x, u.y, map.heightAt(u.x, u.y));
      x += p.x;
      y += p.y;
    }
    this.cam.x = x / living.length;
    this.cam.y = y / living.length - 52;
    this.cam.zoom = 0.7;
  }

  /**
   * Frame the whole board at the current yaw and pitch.
   * Bounds are every tile's top corners (isoOf) plus the prism base (topMetrics.drop),
   * so the lowest edge includes the slab under the front faces.
   */
  /** Board extent in iso world units (zoom 1) at the current yaw and pitch, slab included. */
  private boardBounds(map: GameMap): { minX: number; minY: number; maxX: number; maxY: number } | null {
    const z0 = this.cam.zoom > 1e-4 ? this.cam.zoom : 1;
    const corner: Array<[number, number]> = [
      [-0.5, -0.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [-0.5, 0.5],
    ];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        const t = map.tiles[y][x];
        const drop = this.topMetrics(t.x, t.y, t.h).drop / z0;
        for (const [dx, dy] of corner) {
          const p = this.isoOf(t.x + dx, t.y + dy, t.h);
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
          const by = p.y + drop;
          if (by > maxY) maxY = by;
        }
      }
    }
    if (!(maxX > minX) || !(maxY > minY)) return null;
    return { minX, minY, maxX, maxY };
  }

  /**
   * True when the whole board is inside the viewport at the current camera (small margin).
   * `widthOnly` ignores the vertical extent (M1 is framed on the squad, so its far edge may sit
   * above the screen on purpose).
   */
  boardFits(map: GameMap, widthOnly = false): boolean {
    this.syncMap(map);
    const b = this.boardBounds(map);
    if (!b) return true;
    const z = this.cam.zoom;
    const left = (b.minX - this.cam.x) * z + this.w / 2;
    const right = (b.maxX - this.cam.x) * z + this.w / 2;
    const top = (b.minY - this.cam.y) * z + this.h / 2;
    const bottom = (b.maxY - this.cam.y) * z + this.h / 2;
    const m = 4;
    if (left < m || right > this.w - m) return false;
    return widthOnly || (top >= m && bottom <= this.h - m);
  }

  /**
   * Frame the whole board at the current yaw and pitch.
   * Bounds are every tile's top corners (isoOf) plus the prism base (topMetrics.drop),
   * so the lowest edge includes the slab under the front faces.
   */
  fitToMap(map: GameMap): void {
    this.syncMap(map);
    if (!(this.cam.zoom > 1e-4)) this.cam.zoom = 1;
    const b = this.boardBounds(map);
    if (!b) return;
    const worldW = b.maxX - b.minX;
    const worldH = b.maxY - b.minY;
    const fit = Math.min((this.w * 0.92) / worldW, (this.h * 0.85) / worldH);
    this.cam.zoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, fit));
    this.cam.x = (b.minX + b.maxX) / 2;
    this.cam.y = (b.minY + b.maxY) / 2;
  }

  draw(
    map: GameMap,
    units: Unit[],
    overlays: DrawOverlays,
    floats: FloatText[],
  ): void {
    const ctx = this.ctx;
    this.syncMap(map);
    this.time += 16;
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawBackdrop(map.theme);

    const byTile = new Map<string, Unit[]>();
    const downedAt = new Map<string, Unit>();
    for (const u of units) {
      if (u.dead) {
        // Fallen squad members leave a marker so they never just vanish.
        if (u.team === "player" && !u.npc) downedAt.set(key(u.x, u.y), u);
        continue;
      }
      const k = key(u.x, u.y);
      const list = byTile.get(k);
      if (list) list.push(u);
      else byTile.set(k, [u]);
    }

    const objAt = new Map<string, BoardObj>();
    for (const o of map.objects) {
      if (!o.gone) objAt.set(key(o.x, o.y), o);
    }

    this.statusCount = 0;
    const cells = this.cellsInDrawOrder(map);
    const cellIndex = new Map<string, number>();
    for (let i = 0; i < cells.length; i++) cellIndex.set(key(cells[i].x, cells[i].y), i);

    this.bodyStamps.clear();
    const drawn: Unit[] = [];
    for (const c of cells) {
      this.drawTile(map.tiles[c.y][c.x], map, overlays);
      const o = objAt.get(key(c.x, c.y));
      if (o) this.drawBoardObj(o, map);
      const stack = byTile.get(key(c.x, c.y));
      const downed = downedAt.get(key(c.x, c.y));
      // Ring and cross only: name plates are laid out in the overlay pass and a tag here would collide.
      if (downed) this.drawDownedMarker(downed, map, false);
      if (!stack) continue;
      this.orderUnits(stack, map);
      for (const u of stack) {
        this.drawUnit(u, map, overlays);
        drawn.push(u);
      }
    }

    // Bodies painted in the cell loop can be covered by a later, taller prism.
    // Replay the cached billboard before rings so the label still sits on top.
    for (const u of drawn) this.drawOccludedGhost(u, map, cells, cellIndex, objAt);

    // Rings and names paint after tiles, or a nearer wall clips the feet label.
    this.drawUnitOverlays(drawn, map, overlays);

    this.drawVignette();
    this.drawFloats(floats, map);
  }

  private drawBackdrop(theme: MapTheme): void {
    const ctx = this.ctx;
    if (theme === "roof" && this.legacyPlate && this.kingsWharf.complete && this.kingsWharf.naturalWidth > 0) {
      const scale = Math.max(this.w / this.kingsWharf.naturalWidth, this.h / this.kingsWharf.naturalHeight);
      const dw = this.kingsWharf.naturalWidth * scale;
      const dh = this.kingsWharf.naturalHeight * scale;
      const dx = (this.w - dw) * 0.42;
      const dy = (this.h - dh) * 0.46;
      ctx.save();
      ctx.globalAlpha = 0.86;
      ctx.drawImage(this.kingsWharf, dx, dy, dw, dh);
      ctx.fillStyle = "rgba(5, 8, 18, 0.42)";
      ctx.fillRect(0, 0, this.w, this.h);
      const fade = ctx.createLinearGradient(0, 0, 0, this.h);
      fade.addColorStop(0, "rgba(4, 8, 18, 0.38)");
      fade.addColorStop(0.5, "rgba(6, 7, 14, 0.08)");
      fade.addColorStop(1, "rgba(4, 5, 10, 0.62)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
      return;
    }
    this.drawSkylineSlot(theme);
  }

  private drawSky(theme: MapTheme): void {
    const look = SKYLINE_LOOK[theme];
    const g = this.ctx.createLinearGradient(0, 0, 0, this.h);
    g.addColorStop(0, look.sky[0]);
    g.addColorStop(0.55, look.sky[1]);
    g.addColorStop(1, look.sky[2]);
    this.ctx.fillStyle = g;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  private skylineBitmap(theme: MapTheme): HTMLCanvasElement | HTMLImageElement {
    const url = SKYLINE_ART[theme];
    if (url) {
      let img = this.skylineArt.get(theme);
      if (!img) {
        img = new Image();
        img.decoding = "async";
        img.src = url;
        this.skylineArt.set(theme, img);
      }
      if (img.complete && img.naturalWidth > 0) return img;
    }
    return this.proceduralSkyline(theme);
  }

  private proceduralSkyline(theme: MapTheme): HTMLCanvasElement {
    const h = Math.max(48, Math.round(this.h * 0.45));
    if (h !== this.skylineCacheH) {
      this.skylineCache.clear();
      this.skylineCacheH = h;
    }
    const cached = this.skylineCache.get(theme);
    if (cached) return cached;
    const canvas = document.createElement("canvas");
    canvas.width = STRIP_W;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) paintSkylineStrip(ctx, theme, STRIP_W, h);
    this.skylineCache.set(theme, canvas);
    return canvas;
  }

  /** Ease the displayed strip slide toward `target` the short way around. ~300ms. */
  private stepSkylineSlide(target: number, width: number): void {
    const now = performance.now();
    if (!this.skylineSlideReady || this.skylineSlideSpan !== width) {
      this.skylineSlide = wrapUnit(target, width);
      this.skylineSlideReady = true;
      this.skylineSlideSpan = width;
      this.skylineSlideAt = now;
      return;
    }
    const dt = Math.min(0.1, Math.max(0, (now - this.skylineSlideAt) / 1000));
    this.skylineSlideAt = now;
    let delta = wrapUnit(target - this.skylineSlide, width);
    if (delta > width * 0.5) delta -= width;
    const k = 1 - Math.exp(-dt / 0.1);
    this.skylineSlide = wrapUnit(this.skylineSlide + delta * k, width);
  }

  private drawSkylineSlot(theme: MapTheme): void {
    const ctx = this.ctx;
    this.drawSky(theme);
    const strip = this.skylineBitmap(theme);
    const { w: sw, h: sh } = bitmapSize(strip);
    const horizon = this.h * 0.58;
    const scale = 1 + (this.cam.zoom - 1) * 0.3;
    const drawW = sw * scale;
    const drawH = sh * scale;
    if (!(drawW > 1) || !(drawH > 1)) {
      this.drawWaterFog(theme, horizon);
      return;
    }
    const xOff = -this.cam.x * this.cam.zoom * 0.3;
    const yOff = -this.cam.y * this.cam.zoom * 0.3;
    const coverH = Math.min(drawH, this.h * 0.45);
    const minDest = horizon - drawH;
    const maxDest = horizon - coverH;
    let destY = minDest + yOff;
    if (maxDest > minDest) {
      if (destY < minDest) destY = minDest;
      else if (destY > maxDest) destY = maxDest;
    } else {
      destY = minDest;
    }
    this.stepSkylineSlide((this.yaw / (Math.PI * 2)) * sw, sw);
    let destX = wrapUnit(xOff + this.skylineSlide * scale, drawW);
    if (destX > 0) destX -= drawW;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, this.w, horizon);
    ctx.clip();
    for (let x = destX; x < this.w; x += drawW) ctx.drawImage(strip, x, destY, drawW, drawH);
    ctx.restore();
    this.drawWaterFog(theme, horizon);
  }

  private drawWaterFog(theme: MapTheme, horizon: number): void {
    const ctx = this.ctx;
    const look = SKYLINE_LOOK[theme];
    const g = ctx.createLinearGradient(0, horizon, 0, this.h);
    g.addColorStop(0, look.water0);
    g.addColorStop(0.42, "rgba(4, 6, 10, 0.86)");
    g.addColorStop(1, look.water1);
    ctx.fillStyle = g;
    ctx.fillRect(0, horizon, this.w, Math.max(0, this.h - horizon));
    const span = Math.max(1, this.h - horizon);
    for (let i = 0; i < 3; i++) {
      const bob = Math.sin(this.time * 0.00035 + i * 1.7) * 8;
      const y = horizon + span * (0.18 + i * 0.22) + bob;
      const bandW = this.w * (0.62 + i * 0.14);
      const travel = this.w + bandW;
      const x = wrapUnit(this.time * (0.012 + i * 0.005) + i * this.w * 0.37, travel) - bandW;
      // Elliptical soft band: fades on every side, so no hard-ended horizontal streak.
      const fog = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      fog.addColorStop(0, look.fog);
      fog.addColorStop(0.55, look.fog.replace(/[\d.]+\)$/, (a) => `${parseFloat(a) * 0.5})`));
      fog.addColorStop(1, "rgba(0,0,0,0)");
      ctx.save();
      ctx.translate(x + bandW / 2, y);
      ctx.scale(bandW / 2, 42);
      ctx.fillStyle = fog;
      ctx.fillRect(-1, -1, 2, 2);
      ctx.restore();
    }
  }

  private themeGroup(theme: MapTheme): "alley" | "roof" {
    if (theme === "warehouse" || theme === "street" || theme === "alley") return "alley";
    return "roof";
  }

  private tilePaint(t: Tile, theme: MapTheme, checker: boolean): { top: string; left: string; right: string; rim: string; seam: string } {
    const blocked = t.blocked;
    const group = this.themeGroup(theme);
    if (group === "alley") {
      if (t.terrain === "stairs") {
        return {
          top: checker ? "#6e6254" : "#5e5248",
          left: "#3a3228",
          right: "#4a4034",
          rim: "rgba(220, 190, 140, 0.35)",
          seam: "rgba(30, 20, 12, 0.45)",
        };
      }
      if (t.terrain === "roof") {
        return {
          top: checker ? "#3a3e4c" : "#323644",
          left: "#241c1a",
          right: "#302624",
          rim: "rgba(180, 160, 130, 0.3)",
          seam: "rgba(20, 16, 14, 0.5)",
        };
      }
      return {
        top: blocked ? (checker ? "#1e2228" : "#1a1e24") : checker ? "#2c323c" : "#262c36",
        left: "#14161c",
        right: "#1c2026",
        rim: blocked ? "rgba(180, 70, 50, 0.4)" : "rgba(120, 160, 180, 0.28)",
        seam: "rgba(10, 12, 16, 0.5)",
      };
    }
    if (t.terrain === "stairs") {
      return {
        top: checker ? "#6a6258" : "#5a544c",
        left: "#3a342c",
        right: "#4a443c",
        rim: "rgba(210, 200, 180, 0.32)",
        seam: "rgba(28, 24, 20, 0.45)",
      };
    }
    if (t.terrain === "roof") {
      return {
        top: blocked ? (checker ? "#2e2c3c" : "#282636") : checker ? "#4a4860" : "#3e3c54",
        left: "#241e2c",
        right: "#302838",
        rim: blocked ? "rgba(180, 70, 70, 0.4)" : "rgba(140, 210, 230, 0.34)",
        seam: "rgba(18, 14, 28, 0.5)",
      };
    }
    return {
      top: blocked ? (checker ? "#1c1a24" : "#18161e") : checker ? "#2c2a38" : "#262430",
      left: "#16141c",
      right: "#201c28",
      rim: blocked ? "rgba(180, 70, 70, 0.4)" : "rgba(110, 190, 210, 0.28)",
      seam: "rgba(12, 10, 18, 0.5)",
    };
  }

  private drawTile(t: Tile, map: GameMap, overlays: DrawOverlays): void {
    const ctx = this.ctx;
    const { cx, cy, hw, hh, drop, top } = this.topMetrics(t.x, t.y, t.h);
    const k = key(t.x, t.y);
    const checker = (t.x + t.y) % 2 === 0;
    const z = this.cam.zoom;
    const faces = this.frontFaces(top, drop);
    const pal = this.tilePaint(t, map.theme, checker);

    const ordered = faces.slice().sort((a, b) => (a[0].x + a[1].x) / 2 - (b[0].x + b[1].x) / 2);
    for (let fi = 0; fi < ordered.length; fi++) {
      this.drawWallFace(t, ordered[fi], fi === 0 ? pal.left : pal.right, map.theme, z, t.x * 13 + t.y * 7 + fi);
    }

    this.drawTopSurface(t, map, top, cx, cy, hw, hh, pal, z);

    this.drawRailings(t, map, top, z);
    this.drawProp(t, map.theme, cx, cy, hw, hh, z);

    if (overlays.move.has(k)) {
      this.quadPath(this.insetQuad(top, 0.92));
      ctx.fillStyle = "rgba(62, 240, 208, 0.3)";
      ctx.fill();
      ctx.strokeStyle = "rgba(62, 240, 208, 0.9)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    const kind = overlays.areaKind;
    if (overlays.area.has(k) && !overlays.hot.has(k)) {
      const mute = kind === "skill" || kind === "item" ? "rgba(230, 48, 255, 0.3)" : "rgba(255, 90, 110, 0.14)";
      const stroke = kind === "skill" || kind === "item" ? "rgba(242, 92, 255, 0.76)" : "rgba(255, 110, 130, 0.42)";
      this.quadPath(this.insetQuad(top, 0.9));
      ctx.fillStyle = mute;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.15;
      ctx.stroke();
    }
    if (overlays.hot.has(k)) {
      const pulse = 0.5 + 0.28 * Math.sin(this.time / 190);
      const fill =
        kind === "skill" || kind === "item"
          ? `rgba(244, 72, 255, ${0.4 + pulse * 0.22})`
          : `rgba(255, 80, 110, ${0.3 + pulse * 0.22})`;
      const stroke = kind === "skill" || kind === "item" ? "rgba(255, 170, 255, 0.98)" : "rgba(255, 170, 180, 0.98)";
      this.quadPath(this.insetQuad(top, 0.86));
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 2.15;
      ctx.stroke();
    }
    if (overlays.inspect && overlays.inspect.x === t.x && overlays.inspect.y === t.y) {
      this.quadPath(this.insetQuad(top, 0.96));
      ctx.strokeStyle = "rgba(255, 232, 160, 0.95)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  private drawWallFace(t: Tile, face: [Vec2, Vec2, Vec2, Vec2], col: string, theme: MapTheme, z: number, seed: number): void {
    const ctx = this.ctx;
    const [a, b, c, d] = face;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.fillStyle = col;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
    ctx.clip();

    const seam = this.blockH() * z;
    ctx.strokeStyle = theme === "alley" ? "rgba(20, 12, 8, 0.4)" : "rgba(10, 8, 16, 0.4)";
    ctx.lineWidth = 1;
    const bands = Math.max(1, t.h);
    for (let i = 1; i <= bands; i++) {
      const dy = i * seam;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + dy);
      ctx.lineTo(b.x, b.y + dy);
      ctx.stroke();
    }
    const midx = (a.x + b.x) / 2;
    ctx.beginPath();
    ctx.moveTo(midx, (a.y + b.y) / 2);
    ctx.lineTo(midx, (c.y + d.y) / 2);
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.stroke();

    if (t.h >= 2 && hash01(seed) > 0.45) {
      const wx = (a.x + b.x) * 0.5;
      const wy = (a.y + b.y) * 0.5 + seam * 0.55;
      const ww = Math.max(4, Math.abs(b.x - a.x) * 0.22);
      const wh = Math.max(5, seam * 0.42);
      ctx.fillStyle = theme === "alley" ? "rgba(8, 8, 6, 0.7)" : "rgba(6, 8, 14, 0.72)";
      ctx.fillRect(wx - ww, wy - wh / 2, ww * 2, wh);
      ctx.strokeStyle = theme === "alley" ? "rgba(255, 170, 80, 0.18)" : "rgba(80, 160, 220, 0.2)";
      ctx.strokeRect(wx - ww, wy - wh / 2, ww * 2, wh);
    }
    if (t.h >= 1 && hash01(seed + 3) > 0.62) {
      const px = a.x * 0.7 + b.x * 0.3;
      ctx.strokeStyle = theme === "alley" ? "rgba(90, 70, 50, 0.55)" : "rgba(70, 90, 100, 0.5)";
      ctx.lineWidth = Math.max(1.4, 1.8 * z);
      ctx.beginPath();
      ctx.moveTo(px, (a.y + b.y) / 2);
      ctx.lineTo(px, (c.y + d.y) / 2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawTopSurface(
    t: Tile,
    map: GameMap,
    top: Vec2[],
    cx: number,
    cy: number,
    hw: number,
    hh: number,
    pal: { top: string; rim: string; seam: string },
    z: number,
  ): void {
    const ctx = this.ctx;
    this.quadPath(top);
    ctx.fillStyle = pal.top;
    ctx.fill();

    ctx.save();
    this.quadPath(top);
    ctx.clip();

    if (t.terrain === "stairs") {
      ctx.strokeStyle = "rgba(20, 16, 12, 0.45)";
      ctx.lineWidth = Math.max(1.2, 1.5 * z);
      for (let i = 1; i <= 4; i++) {
        const tt = i / 5;
        const a = lerp2(top[0], top[3], tt);
        const b = lerp2(top[1], top[2], tt);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255, 230, 190, 0.07)";
      ctx.fillRect(cx - hw, cy - hh * 0.2, hw * 2, hh * 0.5);
    } else if (map.theme === "roof" && t.terrain === "roof") {
      ctx.strokeStyle = pal.seam;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        const tt = i / 5;
        const a = lerp2(top[0], top[1], tt);
        const b = lerp2(top[3], top[2], tt);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      if (!t.prop && !t.blocked && hash01(t.x * 9 + t.y * 17) < 0.2) {
        this.quadPath(this.insetQuad(top, 0.42));
        ctx.fillStyle = "rgba(20, 40, 70, 0.55)";
        ctx.fill();
        ctx.strokeStyle = "rgba(120, 200, 230, 0.45)";
        ctx.stroke();
      } else if (!t.prop && hash01(t.x * 5 + t.y * 11) < 0.16) {
        ctx.fillStyle = "#3a3e48";
        ctx.beginPath();
        ctx.ellipse(cx + hw * 0.12, cy - hh * 0.08, 4.5 * z, 3.2 * z, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#8a93a3";
        ctx.stroke();
      }
    } else if (map.theme === "alley" && t.terrain === "street") {
      if (hash01(t.x + t.y * 8) > 0.55) {
        ctx.fillStyle = "rgba(70, 140, 180, 0.1)";
        ctx.beginPath();
        ctx.ellipse(cx - hw * 0.1, cy + hh * 0.12, hw * 0.32, hh * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath();
      const crack = lerp2(top[0], top[2], 0.35 + hash01(t.x * 3) * 0.3);
      ctx.moveTo(cx - hw * 0.2, cy);
      ctx.lineTo(crack.x, crack.y);
      ctx.stroke();
    } else if (map.theme === "roof") {
      if (this.kingsWharf.complete && this.kingsWharf.naturalWidth > 0) {
        ctx.globalAlpha = 0.14;
        ctx.drawImage(this.kingsWharf, -this.w * 0.2, -this.h * 0.18, this.w * 1.4, this.h * 1.2);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "rgba(88, 42, 26, 0.16)";
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(255, 192, 106, 0.22)";
      ctx.lineWidth = Math.max(1, z);
      const a = lerp2(top[0], top[2], 0.5);
      const b = lerp2(top[1], top[3], 0.5);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      if (!t.prop && !t.blocked && hash01(t.x * 31 + t.y * 47) < 0.22) {
        ctx.strokeStyle = "rgba(245, 221, 166, 0.68)";
        ctx.lineWidth = Math.max(1, 1.25 * z);
        ctx.beginPath();
        ctx.ellipse(cx + hw * 0.05, cy + hh * 0.04, hw * 0.28, hh * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - hw * 0.16, cy + hh * 0.04);
        ctx.lineTo(cx + hw * 0.22, cy + hh * 0.04);
        ctx.moveTo(cx + hw * 0.03, cy - hh * 0.18);
        ctx.lineTo(cx + hw * 0.03, cy + hh * 0.2);
        ctx.stroke();
      }
    } else {
      ctx.strokeStyle = pal.seam;
      ctx.beginPath();
      ctx.moveTo(lerp2(top[0], top[1], 0.5).x, lerp2(top[0], top[1], 0.5).y);
      ctx.lineTo(lerp2(top[3], top[2], 0.5).x, lerp2(top[3], top[2], 0.5).y);
      ctx.stroke();
    }

    if (t.blocked) {
      ctx.strokeStyle = "rgba(0,0,0,0.28)";
      ctx.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - hw + i * 6 * z, cy - hh);
        ctx.lineTo(cx + hw + i * 6 * z, cy + hh);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.055)";
    for (let i = 0; i < 5; i++) {
      const u = hash01(t.x * 19 + t.y * 23 + i);
      const v = hash01(t.x * 29 + t.y * 31 + i + 4);
      ctx.fillRect(cx - hw + u * hw * 2, cy - hh + v * hh * 2, 1.6 * z, 1.2 * z);
    }
    ctx.restore();

    this.quadPath(top);
    ctx.strokeStyle = pal.rim;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    let hi = 0;
    for (let i = 1; i < 4; i++) if (top[i].y < top[hi].y) hi = i;
    ctx.beginPath();
    ctx.moveTo(top[hi].x, top[hi].y);
    ctx.lineTo(top[(hi + 1) % 4].x, top[(hi + 1) % 4].y);
    ctx.strokeStyle = "rgba(230, 248, 255, 0.38)";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(top[hi].x, top[hi].y);
    ctx.lineTo(top[(hi + 3) % 4].x, top[(hi + 3) % 4].y);
    ctx.strokeStyle = "rgba(20, 20, 28, 0.4)";
    ctx.stroke();
  }

  private drawRailings(t: Tile, map: GameMap, top: Vec2[], z: number): void {
    if (t.h < 1 || t.terrain === "stairs") return;
    const ctx = this.ctx;
    const dirs: Array<[number, number]> = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ];
    const hRail = (map.theme === "roof" ? 7.5 : 6.5) * z;
    ctx.strokeStyle = map.theme === "roof" ? "rgba(170, 186, 210, 0.85)" : "rgba(120, 96, 72, 0.8)";
    ctx.lineWidth = Math.max(1.15, 1.35 * z);
    for (let i = 0; i < 4; i++) {
      const nb = map.tile(t.x + dirs[i][0], t.y + dirs[i][1]);
      const dropH = nb ? t.h - nb.h : t.h + 1;
      if (dropH < 1) continue;
      const a = top[i];
      const b = top[(i + 1) % 4];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x, a.y - hRail);
      ctx.lineTo(b.x, b.y - hRail);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(a.x, a.y - hRail * 0.48);
      ctx.lineTo(b.x, b.y - hRail * 0.48);
      ctx.stroke();
    }
  }

  private diamondPath(cx: number, cy: number, hw: number, hh: number): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh);
    ctx.lineTo(cx + hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx - hw, cy);
    ctx.closePath();
  }

  private quadPath(pts: Vec2[]): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
  }

  private insetQuad(pts: Vec2[], s: number): Vec2[] {
    let cx = 0;
    let cy = 0;
    for (const p of pts) {
      cx += p.x;
      cy += p.y;
    }
    cx /= pts.length;
    cy /= pts.length;
    return pts.map((p) => ({ x: cx + (p.x - cx) * s, y: cy + (p.y - cy) * s }));
  }

  private drawProp(t: Tile, theme: MapTheme, cx: number, cy: number, hw: number, hh: number, z: number): void {
    const ctx = this.ctx;
    if (t.prop === "stall") {
      const ph = 15 * z;
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.55, cy + hh * 0.05);
      ctx.lineTo(cx, cy + hh * 0.55);
      ctx.lineTo(cx, cy + hh * 0.55 + ph);
      ctx.lineTo(cx - hw * 0.55, cy + hh * 0.05 + ph);
      ctx.closePath();
      ctx.fillStyle = "#3a141c";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + hw * 0.55, cy + hh * 0.05);
      ctx.lineTo(cx, cy + hh * 0.55);
      ctx.lineTo(cx, cy + hh * 0.55 + ph);
      ctx.lineTo(cx + hw * 0.55, cy + hh * 0.05 + ph);
      ctx.closePath();
      ctx.fillStyle = "#4a1d28";
      ctx.fill();
      const flicker = 0.75 + Math.sin(this.time / 180 + t.x) * 0.2;
      this.diamondPath(cx, cy - 4 * z, hw * 0.62, hh * 0.62);
      ctx.fillStyle = `rgba(255, 61, 138, ${0.72 * flicker})`;
      ctx.fill();
      ctx.fillStyle = "#ffe08a";
      ctx.font = `bold ${Math.max(8, 9 * z)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(t.x < 5 ? "FISH" : "TEA", cx, cy - 2 * z);
    } else if (t.prop === "crate") {
      const ph = 13 * z;
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.48, cy);
      ctx.lineTo(cx, cy + hh * 0.48);
      ctx.lineTo(cx, cy + hh * 0.48 + ph);
      ctx.lineTo(cx - hw * 0.48, cy + ph);
      ctx.closePath();
      ctx.fillStyle = "#5a3a22";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + hw * 0.48, cy);
      ctx.lineTo(cx, cy + hh * 0.48);
      ctx.lineTo(cx, cy + hh * 0.48 + ph);
      ctx.lineTo(cx + hw * 0.48, cy + ph);
      ctx.closePath();
      ctx.fillStyle = "#6c4628";
      ctx.fill();
      this.diamondPath(cx, cy - 2 * z, hw * 0.48, hh * 0.48);
      ctx.fillStyle = "#8a5a32";
      ctx.fill();
      ctx.strokeStyle = "rgba(40, 22, 10, 0.55)";
      ctx.lineWidth = 1;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - hw * 0.28, cy + i * 3 * z);
        ctx.lineTo(cx + hw * 0.28, cy + i * 3 * z);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(180, 160, 120, 0.45)";
      ctx.strokeRect(cx - 5 * z, cy - 3 * z, 10 * z, 4 * z);
    } else if (t.prop === "ac") {
      const ph = 11 * z;
      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.42, cy);
      ctx.lineTo(cx, cy + hh * 0.42);
      ctx.lineTo(cx, cy + hh * 0.42 + ph);
      ctx.lineTo(cx - hw * 0.42, cy + ph);
      ctx.closePath();
      ctx.fillStyle = "#2e323c";
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + hw * 0.42, cy);
      ctx.lineTo(cx, cy + hh * 0.42);
      ctx.lineTo(cx, cy + hh * 0.42 + ph);
      ctx.lineTo(cx + hw * 0.42, cy + ph);
      ctx.closePath();
      ctx.fillStyle = "#3a3e48";
      ctx.fill();
      this.diamondPath(cx, cy - 2 * z, hw * 0.42, hh * 0.42);
      ctx.fillStyle = "#4a5060";
      ctx.fill();
      const spin = this.time / 140;
      ctx.strokeStyle = "#8a93a3";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx, cy - 2 * z, 4.8 * z, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(spin) * 4.2 * z, cy - 2 * z + Math.sin(spin) * 2.2 * z);
      ctx.lineTo(cx - Math.cos(spin) * 4.2 * z, cy - 2 * z - Math.sin(spin) * 2.2 * z);
      ctx.stroke();
    } else if (t.prop === "lamp") {
      ctx.fillStyle = "#2a2a32";
      ctx.fillRect(cx - 1.6 * z, cy - 20 * z, 3.2 * z, 24 * z);
      const glow = theme === "alley" ? "rgba(255, 180, 80, 0.92)" : "rgba(255, 210, 120, 0.9)";
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy - 22 * z, 4.4 * z, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme === "alley" ? "rgba(255, 160, 70, 0.14)" : "rgba(255, 200, 110, 0.12)";
      ctx.beginPath();
      ctx.arc(cx, cy - 4 * z, 17 * z, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private projectAt(gx: number, gy: number, h: number, dir: Dir, map: GameMap): ProjectFn {
    return (lx: number, ly: number, lz: number) => {
      const g = localToGrid(lx, ly, dir);
      const screen = this.worldToScreen(gx + g.x, gy + g.y, h + lz * CHAR_H);
      const yp = yawPoint(gx + g.x, gy + g.y, this.yaw, map.w, map.h);
      return { x: screen.x, y: screen.y, d: yp.x + yp.y - lz };
    };
  }

  private drawBoardObj(o: BoardObj, map: GameMap): void {
    const ctx = this.ctx;
    const h = map.tiles[o.y][o.x].h;
    const p = this.worldToScreen(o.x, o.y, h);
    const z = this.cam.zoom;
    const { cx, cy, hw, hh } = this.topMetrics(o.x, o.y, h);
    void p;
    if (o.type === "barrel") {
      ctx.fillStyle = "#7a2a22";
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2 * z, hw * 0.38, hh * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c44a32";
      ctx.fillRect(cx - 7 * z, cy - 16 * z, 14 * z, 18 * z);
      ctx.fillStyle = "#e8c45a";
      ctx.fillRect(cx - 7 * z, cy - 8 * z, 14 * z, 2.2 * z);
      ctx.fillStyle = "#2a1010";
      ctx.beginPath();
      ctx.ellipse(cx, cy - 16 * z, 7 * z, 3.2 * z, 0, 0, Math.PI * 2);
      ctx.fill();
      const ratio = o.hp / Math.max(1, o.maxHp);
      ctx.fillStyle = "#111018";
      ctx.fillRect(cx - 10 * z, cy - 22 * z, 20 * z, 3 * z);
      ctx.fillStyle = "#ff4d6d";
      ctx.fillRect(cx - 10 * z, cy - 22 * z, 20 * z * ratio, 3 * z);
      return;
    }
    if (o.type === "kit") {
      ctx.fillStyle = "#f2f4f0";
      ctx.fillRect(cx - 8 * z, cy - 8 * z, 16 * z, 12 * z);
      ctx.fillStyle = "#d04040";
      ctx.fillRect(cx - 2 * z, cy - 6 * z, 4 * z, 8 * z);
      ctx.fillRect(cx - 6 * z, cy - 3 * z, 12 * z, 3 * z);
      ctx.strokeStyle = "#3a3a40";
      ctx.strokeRect(cx - 8 * z, cy - 8 * z, 16 * z, 12 * z);
      return;
    }
    if (o.type === "switch") {
      ctx.fillStyle = o.used ? "#3a5a48" : "#3ef0d0";
      this.diamondPath(cx, cy, hw * 0.35, hh * 0.35);
      ctx.fill();
      ctx.strokeStyle = "#0a1816";
      ctx.stroke();
      ctx.fillStyle = o.used ? "#8aa" : "#fff";
      ctx.font = `bold ${Math.max(8, 9 * z)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(o.used ? "開" : "掣", cx, cy + 3 * z);
      return;
    }
    if (o.type === "van") {
      ctx.fillStyle = o.used ? "#3a4850" : "#2a3540";
      ctx.fillRect(cx - 14 * z, cy - 18 * z, 28 * z, 22 * z);
      ctx.fillStyle = "#1a2228";
      ctx.fillRect(cx - 10 * z, cy - 14 * z, 12 * z, 8 * z);
      ctx.fillStyle = o.used ? "#7dffb3" : "#ffc857";
      ctx.fillRect(cx + 4 * z, cy - 6 * z, 8 * z, 10 * z);
      ctx.fillStyle = "#e8eef2";
      ctx.font = `${Math.max(8, 9 * z)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(o.used ? "開" : "門", cx, cy + 16 * z);
      return;
    }
    // crate / pallet platform
    const ph = o.type === "pallet" ? 8 * z : 12 * z;
    ctx.fillStyle = o.type === "pallet" ? "#6a5030" : "#8a5a32";
    ctx.beginPath();
    ctx.moveTo(cx - hw * 0.46, cy);
    ctx.lineTo(cx, cy + hh * 0.46);
    ctx.lineTo(cx, cy + hh * 0.46 + ph);
    ctx.lineTo(cx - hw * 0.46, cy + ph);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = o.type === "pallet" ? "#7a6038" : "#a06a3c";
    ctx.beginPath();
    ctx.moveTo(cx + hw * 0.46, cy);
    ctx.lineTo(cx, cy + hh * 0.46);
    ctx.lineTo(cx, cy + hh * 0.46 + ph);
    ctx.lineTo(cx + hw * 0.46, cy + ph);
    ctx.closePath();
    ctx.fill();
    this.diamondPath(cx, cy - 2 * z, hw * 0.46, hh * 0.46);
    ctx.fillStyle = o.type === "pallet" ? "#c4a060" : "#c48448";
    ctx.fill();
    ctx.strokeStyle = "rgba(40,22,10,0.55)";
    ctx.stroke();
  }

  private projectFor(u: Unit, map: GameMap): ProjectFn {
    const h = map.heightAt(u.x, u.y);
    return (lx: number, ly: number, lz: number) => {
      const g = localToGrid(lx, ly, u.dir);
      const screen = this.worldToScreen(u.x + g.x, u.y + g.y, h + lz * CHAR_H);
      const yp = yawPoint(u.x + g.x, u.y + g.y, this.yaw, map.w, map.h);
      return { x: screen.x, y: screen.y, d: yp.x + yp.y - lz * CHAR_H * 0.45 };
    };
  }

  /** Feet anchor shared with hitUnit so the body box stays on the drawn sprite. */
  /** Grey dashed ring and red cross on the tile where a squad member was knocked out (tag optional, unused). */
  private drawDownedMarker(u: Unit, map: GameMap, withTag: boolean): void {
    const ctx = this.ctx;
    const { x, feetY, z, scale } = this.unitPose(u, map);
    const cy = feetY + RING_DROP * z;
    const rx = RING_RX * scale;
    const ry = RING_RY * scale;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.beginPath();
    ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([3, 2]);
    ctx.strokeStyle = "rgba(190,196,210,0.8)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(255,92,120,0.9)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x - rx * 0.4, cy - ry * 0.4);
    ctx.lineTo(x + rx * 0.4, cy + ry * 0.4);
    ctx.moveTo(x + rx * 0.4, cy - ry * 0.4);
    ctx.lineTo(x - rx * 0.4, cy + ry * 0.4);
    ctx.stroke();
    if (!withTag) {
      ctx.restore();
      return;
    }
    ctx.font = `600 ${Math.max(9, Math.round(10 * scale))}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const text = `${u.name} 倒下`;
    const tw = ctx.measureText(text).width;
    const ty = cy + ry + 2;
    ctx.fillStyle = "rgba(10,10,16,0.75)";
    ctx.fillRect(x - tw / 2 - 4, ty - 1, tw + 8, Math.max(9, Math.round(10 * scale)) + 4);
    ctx.fillStyle = "rgba(220,224,232,0.9)";
    ctx.fillText(text, x, ty + 1);
    ctx.restore();
  }

  private unitPose(u: Unit, map: GameMap): {
    x: number;
    feetY: number;
    z: number;
    scale: number;
    dh: number;
    dx: number;
    dy: number;
    ground: Vec2;
    face: Vec2;
    elite: boolean;
  } {
    const ground = this.worldToScreen(u.x, u.y, map.heightAt(u.x, u.y));
    const z = this.cam.zoom;
    const elite = u.role === "elite";
    const mul = elite ? ELITE_SCALE : 1;
    const f = dirVector(u.dir);
    const face = yawDir(f.x, f.y, this.yaw);
    const lunge = u.lunge || 0;
    const dx = (face.x - face.y) * 6 * z * lunge;
    const dy = (face.x + face.y) * 3 * z * lunge;
    return {
      x: ground.x + dx,
      feetY: ground.y + dy + FEET_DROP * z,
      z,
      scale: mul * z,
      dh: unitDrawHeight(z, elite),
      dx,
      dy,
      ground,
      face,
      elite,
    };
  }

  /** Copy the shared rig portrait before the next unit re-renders it. */
  private rememberRig(id: string, bill: RigBillboard | null): void {
    if (!bill || !(bill.w > 0) || !(bill.h > 0) || bill.source.width === 0 || bill.source.height === 0) return;
    let snap = this.rigSnaps.get(id);
    if (!snap) {
      snap = document.createElement("canvas");
      this.rigSnaps.set(id, snap);
    }
    if (snap.width !== bill.source.width || snap.height !== bill.source.height) {
      snap.width = bill.source.width;
      snap.height = bill.source.height;
    }
    const g = snap.getContext("2d");
    if (!g) return;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    g.clearRect(0, 0, snap.width, snap.height);
    g.drawImage(bill.source, 0, 0);
    this.sourceRev.set(snap, (this.sourceRev.get(snap) ?? 0) + 1);
    this.bodyStamps.set(id, {
      source: snap,
      sw: snap.width,
      sh: snap.height,
      dx: bill.x,
      dy: bill.y,
      dw: bill.w,
      dh: bill.h,
      mirror: false,
    });
  }

  /**
   * Blocks a board object adds above its tile. Platforms use standH.
   * Barrel and van art rises about one block; flat pickups do not.
   */
  private objectRise(o: BoardObj): number {
    if (o.kind === "platform") return o.standH;
    if (o.type === "barrel" || o.type === "van") return 1;
    return 0;
  }

  /** Screen box of a board object, matching drawBoardObj without changing how it paints. */
  private boardObjRect(o: BoardObj, tileH: number): ScreenRect {
    const z = this.cam.zoom;
    const { cx, cy, hw, hh } = this.topMetrics(o.x, o.y, tileH);
    let x0 = cx;
    let y0 = cy;
    let x1 = cx;
    let y1 = cy;
    const add = (x: number, y: number, w: number, h: number) => {
      if (x < x0) x0 = x;
      if (y < y0) y0 = y;
      if (x + w > x1) x1 = x + w;
      if (y + h > y1) y1 = y + h;
    };
    if (o.type === "barrel") {
      add(cx - hw * 0.38, cy + 2 * z - hh * 0.32, hw * 0.76, hh * 0.64);
      add(cx - 10 * z, cy - 22 * z, 20 * z, 24 * z);
    } else if (o.type === "kit") {
      add(cx - 8 * z, cy - 8 * z, 16 * z, 12 * z);
    } else if (o.type === "switch") {
      add(cx - hw * 0.35, cy - hh * 0.35, hw * 0.7, hh * 0.7);
    } else if (o.type === "van") {
      add(cx - 14 * z, cy - 18 * z, 28 * z, 40 * z);
    } else {
      const ph = o.type === "pallet" ? 8 * z : 12 * z;
      const top = 2 * z + hh * 0.46;
      add(cx - hw * 0.46, cy - top, hw * 0.92, top + hh * 0.46 + ph);
    }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }

  private prismHitsRect(t: Tile, body: ScreenRect): boolean {
    const { drop, top } = this.topMetrics(t.x, t.y, t.h);
    if (quadHitsRect(top, body)) return true;
    for (const face of this.frontFaces(top, drop)) {
      if (quadHitsRect(face, body)) return true;
    }
    return false;
  }

  private bodyOccluded(
    u: Unit,
    map: GameMap,
    cells: Vec2[],
    cellIndex: Map<string, number>,
    objAt: Map<string, BoardObj>,
    body: ScreenRect,
  ): boolean {
    const start = cellIndex.get(key(u.x, u.y));
    if (start == null) return false;
    const unitH = map.heightAt(u.x, u.y);
    for (let i = start + 1; i < cells.length; i++) {
      const c = cells[i];
      const t = map.tiles[c.y][c.x];
      if (t.h > unitH && this.prismHitsRect(t, body)) return true;
      const o = objAt.get(key(c.x, c.y));
      if (!o) continue;
      if (t.h + this.objectRise(o) <= unitH) continue;
      if (rectsOverlap(this.boardObjRect(o, t.h), body)) return true;
    }
    return false;
  }

  private drawGhost(stamp: BodyStamp, color: string): void {
    const sw = Math.max(1, Math.round(stamp.sw));
    const sh = Math.max(1, Math.round(stamp.sh));
    if (!(stamp.dw > 0) || !(stamp.dh > 0)) return;
    if (!this.ghostCanvas || !this.ghostCtx) {
      this.ghostCanvas = document.createElement("canvas");
      this.ghostCtx = this.ghostCanvas.getContext("2d");
    }
    const scratch = this.ghostCanvas;
    const g = this.ghostCtx;
    if (!g) return;
    if (scratch.width < sw || scratch.height < sh) {
      scratch.width = Math.max(scratch.width, sw);
      scratch.height = Math.max(scratch.height, sh);
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = "source-over";
    g.globalAlpha = 1;
    g.clearRect(0, 0, sw, sh);
    g.save();
    if (stamp.mirror) {
      g.translate(sw, 0);
      g.scale(-1, 1);
    }
    g.drawImage(stamp.source, 0, 0, stamp.sw, stamp.sh, 0, 0, sw, sh);
    g.restore();
    g.save();
    g.globalCompositeOperation = "source-atop";
    g.globalAlpha = 0.35;
    g.fillStyle = color;
    g.fillRect(0, 0, sw, sh);
    g.restore();

    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = GHOST_ALPHA;
    ctx.drawImage(scratch, 0, 0, sw, sh, stamp.dx, stamp.dy, stamp.dw, stamp.dh);
    ctx.restore();
  }

  private drawOccludedGhost(
    u: Unit,
    map: GameMap,
    cells: Vec2[],
    cellIndex: Map<string, number>,
    objAt: Map<string, BoardObj>,
  ): void {
    const stamp = this.bodyStamps.get(u.id);
    if (!stamp) return;
    const body: ScreenRect = { x: stamp.dx, y: stamp.dy, w: stamp.dw, h: stamp.dh };
    if (!this.bodyOccluded(u, map, cells, cellIndex, objAt, body)) return;
    this.drawGhost(stamp, factionColor(u));
  }

  private drawMapDoll(
    id: string,
    image: HTMLImageElement,
    x: number,
    feetY: number,
    z: number,
    elite: boolean,
    mirrored: boolean,
  ): void {
    const dh = unitDrawHeight(z, elite);
    const dw = dh * image.naturalWidth / image.naturalHeight;
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x - dw / 2, feetY - dh);
    if (mirrored) {
      ctx.translate(dw, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(image, 0, 0, dw, dh);
    ctx.restore();
    this.bodyStamps.set(id, {
      source: image,
      sw: image.naturalWidth,
      sh: image.naturalHeight,
      dx: x - dw / 2,
      dy: feetY - dh,
      dw,
      dh,
      mirror: mirrored,
    });
  }

  /**
   * Which way a unit's facing points on screen, as one of 8 sectors: 0 toward the viewer (screen
   * down), then clockwise on screen (1 down-left, 2 left, 3 up-left, 4 away, 5 up-right, 6 right,
   * 7 down-right). Uses the ground-plane heading after the camera yaw, so tilt does not change it.
   * For quarter-turn 旋轉 this equals (dir * 8 / DIR_COUNT + 5 - 2 * quarterTurns) mod 8.
   */
  screenSector(u: Unit): number {
    const f = dirVector(u.dir);
    const r = yawDir(f.x, f.y, this.yaw);
    const sx = r.x - r.y;
    const sy = r.x + r.y;
    const a = Math.atan2(-sx, sy);
    const i = Math.round((a / (Math.PI * 2)) * SCREEN_SECTORS);
    return ((i % SCREEN_SECTORS) + SCREEN_SECTORS) % SCREEN_SECTORS;
  }

  private drawUnit(u: Unit, map: GameMap, overlays: DrawOverlays): void {
    const ctx = this.ctx;
    const { x, feetY, z, scale, dh, dx, dy, ground: p, elite } = this.unitPose(u, map);
    const accent = factionColor(u);
    const done = u.acted;
    // Idle NPCs are created with acted set, and enemies flip it during their phase.
    // Dim only the body of a player-controlled unit that has finished acting.
    const dim = isPlayerControlled(u) && u.acted;
    ctx.save();

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(x, feetY + RING_DROP * z, 11 * scale, 4.8 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (overlays.selected?.id === u.id) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2.2;
      this.diamondPath(p.x, p.y, 16 * scale, 8 * scale);
      ctx.stroke();
    }
    if (overlays.target?.id === u.id) {
      ctx.strokeStyle = "#ffe08a";
      ctx.lineWidth = 2;
      this.diamondPath(p.x, p.y, 18 * scale, 9 * scale);
      ctx.stroke();
    }

    // Doll, painted Dana/Mara, and the rig all record an undimmed stamp inside this callback.
    const drawBody = (): void => {
      const project = this.projectFor(u, map);
      const shifted: ProjectFn = (lx, ly, lz) => {
        const q = project(lx, ly, lz);
        return { x: q.x + dx, y: q.y + dy, d: q.d };
      };
      // Mara and Dana: 8 painted views; Priya: one painting, mirrored. The view is picked from the
      // unit's world heading minus the camera yaw, so body and ground chevron agree at any 旋轉 or twist.
      const sector = this.screenSector(u);
      if (u.archetype === "mara" || u.archetype === "dana") {
        const angles = u.archetype === "mara" ? this.maraAngles : this.danaAngles;
        const [name, mirror] = PAINTED_BY_SECTOR[u.archetype][sector];
        const painted = angles[name];
        const fallback = this.mapDolls[u.archetype];
        if (painted.complete && painted.naturalWidth > 0 && painted.naturalHeight > 0) {
          this.drawMapDoll(u.id, painted, x, feetY, z, elite, mirror);
        } else if (fallback.complete && fallback.naturalWidth > 0 && fallback.naturalHeight > 0) {
          this.drawMapDoll(u.id, fallback, x, feetY, z, elite, false);
        } else {
          this.rememberRig(u.id, drawRig(ctx, shifted, u, this.time, z, this.yaw, this.pitch));
        }
      } else {
        const doll = u.archetype === "priya" ? this.mapDolls.priya : null;
        if (doll && doll.complete && doll.naturalWidth > 0 && doll.naturalHeight > 0) {
          this.drawMapDoll(u.id, doll, x, feetY, z, elite, PRIYA_MIRROR_SECTORS.has(sector));
        } else {
          this.rememberRig(u.id, drawRig(ctx, shifted, u, this.time, z, this.yaw, this.pitch));
        }
      }
    };
    if (dim) this.withActedBody(drawBody);
    else drawBody();

    this.drawFacingWedge(u, map, x, feetY, z);

    ctx.restore();

    if (done) {
      // Drawn after plates so a crowded badge can sit beside its own name.
      const ex = x + 14 * scale;
      const ey = feetY - dh + 10 * scale;
      const er = 7.2 * scale;
      this.pushStatus(u.id, ex, ey, er, z, scale);
    }
  }

  /**
   * Mild spent look on the sprite only. save/restore clears alpha and filter
   * before the facing wedge, rings, and plates. The stamp stored by the draw
   * is the source image, so the ghost and alpha hit test stay undimmed.
   */
  private withActedBody(draw: () => void): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha *= ACTED_BODY_ALPHA;
    if (typeof ctx.filter === "string") {
      try {
        ctx.filter = ACTED_BODY_FILTER;
      } catch {
        // Context accepts no filter. The alpha still marks the unit.
      }
    }
    try {
      draw();
    } finally {
      ctx.restore();
    }
  }

  private trackCanvasPointer(): void {
    const canvas = this.canvas;
    if (typeof canvas.addEventListener !== "function") return;
    canvas.addEventListener("pointermove", (e) => this.trackPointer(e));
    canvas.addEventListener("pointerdown", (e) => this.trackPointer(e));
    canvas.addEventListener("pointerleave", () => {
      this.pointerInside = false;
      this.hover = null;
    });
  }

  private trackPointer(e: PointerEvent): void {
    const r = this.canvas.getBoundingClientRect();
    this.pointerX = e.clientX - r.left;
    this.pointerY = e.clientY - r.top;
    this.pointerInside = true;
  }

  /** Front-most living unit under the pointer, matching hitUnit without rebuilding the cell list. */
  private hoveredUnit(drawn: Unit[], map: GameMap, overlays: DrawOverlays): Unit | null {
    if (overlays.hover !== undefined) return overlays.hover;
    if (!this.pointerInside) return this.hover;
    const found = this.pickDrawnUnit(this.pointerX, this.pointerY, drawn, map);
    this.hover = found;
    return found;
  }

  private labelSlot(i: number): LabelSlot {
    let s = this.labelPool[i];
    if (!s) {
      s = {
        id: "",
        text: "",
        accent: "#fff",
        dim: false,
        fontPx: 9,
        baseline: 0,
        plateX: 0,
        plateY: 0,
        plateW: 0,
        plateH: 0,
        barW: 0,
        barH: 0,
        ratio: 1,
        compactW: 0,
        compactH: 0,
        ringX: 0,
        ringY: 0,
        ringRx: 1,
        ringRy: 1,
        bodyX: 0,
        bodyY: 0,
        bodyW: 0,
        bodyH: 0,
        dx: 0,
        dy: 0,
        z: 1,
      };
      this.labelPool[i] = s;
    }
    return s;
  }

  /** Team rings stay on the tile centre. Plates nudge sideways before they lift. */
  private drawUnitOverlays(drawn: Unit[], map: GameMap, overlays: DrawOverlays): void {
    const n = drawn.length;
    this.overlayCount = n;
    this.placedCount = 0;
    if (n === 0) {
      this.labelRects.length = 0;
      this.labelHold.clear();
      return;
    }

    const ctx = this.ctx;
    const z = this.cam.zoom;
    const fontPx = Math.max(9, 10 * z);
    // Hover is tracked for hit-testing callers. It does not affect plate order or position.
    this.hoveredUnit(drawn, map, overlays);

    for (let i = 0; i < n; i++) {
      const u = drawn[i];
      const s = this.labelSlot(i);
      const pose = this.unitPose(u, map);
      const { x, feetY, scale, dh } = pose;
      const text = u.name.split(" ")[0];
      // Same font fillText uses, set before measure so the plate width matches the glyphs.
      ctx.font = `${fontPx}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      const metrics = ctx.measureText(text);
      const padX = Math.max(3, 4 * z);
      const padY = Math.max(1, 2 * z);
      const ascent = metrics.actualBoundingBoxAscent > 0 ? metrics.actualBoundingBoxAscent : fontPx * 0.8;
      const descent = metrics.actualBoundingBoxDescent > 0 ? metrics.actualBoundingBoxDescent : fontPx * 0.22;
      const plateW = metrics.width + padX * 2;
      const plateH = ascent + descent + padY * 2;
      const barW = 22 * scale;
      const barH = 3.5 * scale;
      const stamp = this.bodyStamps.get(u.id);
      const headTop = stamp && stamp.dh > 0 ? stamp.dy : feetY - dh;
      const lift = Math.max(2, 3 * z);
      // Name plate sits just above the sprite. The HP bar is stacked on top of the plate.
      const plateY = headTop - lift - plateH;
      const baseline = plateY + padY + ascent;
      const plateX = x - plateW / 2;
      s.id = u.id;
      s.text = text;
      s.accent = factionColor(u);
      s.dim = isPlayerControlled(u) && u.acted;
      s.fontPx = fontPx;
      s.baseline = baseline;
      s.plateX = plateX;
      s.plateY = plateY;
      s.plateW = plateW;
      s.plateH = plateH;
      s.barW = barW;
      s.barH = barH;
      s.ratio = Math.max(0, u.hp / u.maxHp);
      s.compactW = Math.max(plateW, barW);
      s.compactH = barH + plateH;
      s.ringX = x;
      s.ringY = feetY + RING_DROP * z;
      s.ringRx = RING_RX * scale;
      s.ringRy = RING_RY * scale;
      s.dx = 0;
      s.dy = 0;
      s.z = z;
      if (stamp && stamp.dw > 0 && stamp.dh > 0) {
        s.bodyX = stamp.dx;
        s.bodyY = stamp.dy;
        s.bodyW = stamp.dw;
        s.bodyH = stamp.dh;
      } else {
        const dw = dh * UNIT_BODY_ASPECT;
        s.bodyX = x - dw / 2;
        s.bodyY = feetY - dh;
        s.bodyW = dw;
        s.bodyH = dh;
      }
    }

    this.labelOrder.length = n;
    for (let i = 0; i < n; i++) this.labelOrder[i] = i;
    const pool = this.labelPool;
    // Stable per unit. Selection, hover, and acted state never change this order.
    this.labelOrder.sort((ia, ib) => {
      const a = pool[ia].id;
      const b = pool[ib].id;
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    const seen = this.labelSeen;
    seen.clear();
    // Unmoved plates keep their shift and are reserved first. A unit that changed
    // tile is solved afterwards, so its plate is the one that lifts out of the way.
    const stable: number[] = [];
    const dirty: number[] = [];
    for (let k = 0; k < n; k++) {
      const i = this.labelOrder[k];
      const prev = this.labelHold.get(pool[i].id);
      const u = drawn[i];
      if (prev && prev.x === u.x && prev.y === u.y) stable.push(i);
      else dirty.push(i);
    }
    for (const i of stable) {
      const prev = this.labelHold.get(pool[i].id)!;
      this.holdLabel(pool[i], prev.dx, prev.dy);
    }
    for (const i of dirty) this.placeLabel(pool[i]);
    this.settleStatusIcons();
    for (let k = 0; k < n; k++) {
      const i = this.labelOrder[k];
      const s = pool[i];
      const u = drawn[i];
      this.labelHold.set(s.id, { dx: s.dx, dy: s.dy, x: u.x, y: u.y });
      seen.add(s.id);
    }
    if (this.labelHold.size !== seen.size) {
      for (const id of this.labelHold.keys()) {
        if (!seen.has(id)) this.labelHold.delete(id);
      }
    }

    for (let i = 0; i < n; i++) this.paintUnitRing(pool[i]);
    for (let i = 0; i < n; i++) this.paintUnitLabel(pool[i]);
    this.paintStatusIcons();

    if (this.labelRects.length > n) this.labelRects.length = n;
    for (let i = 0; i < n; i++) {
      const s = pool[i];
      let r = this.labelRects[i];
      if (!r) {
        r = { id: "", x: 0, y: 0, w: 0, h: 0 };
        this.labelRects[i] = r;
      }
      const block = this.blockAt(s, s.dy, s.dx);
      r.id = s.id;
      r.x = block.x;
      r.y = block.y;
      r.w = block.w;
      r.h = block.h;
    }
  }

  /**
   * Drawn plate+HP block. The bar sits on top of the plate; both are centred on the ring.
   * The leader is not part of this rect.
   */
  private blockAt(s: LabelSlot, oy: number, ox: number): ScreenRect {
    return {
      x: s.ringX + ox - s.compactW / 2,
      y: s.plateY + oy - s.barH,
      w: s.compactW,
      h: s.compactH,
    };
  }

  /**
   * Anchor is above this sprite. A sideways nudge (centre within LABEL_NUDGE_CAP)
   * is tried before any lift, and the lift stays within LABEL_LIFT_CAP.
   * E icons are obstacles when that costs no extra lift; otherwise they move aside.
   */
  private placeLabel(s: LabelSlot): void {
    const next = this.resolveLabel(s);
    this.commitLabel(s, next.ox, next.oy);
  }

  /**
   * Frozen shift. Kept exactly while it misses plates already placed, so a
   * neighbour's move cannot slide this name. Overlap with an E icon is left
   * for the icon to step aside. A real plate hit is re-solved like a fresh label.
   */
  private holdLabel(s: LabelSlot, ox: number, oy: number): void {
    if (this.plateOverlap(s, ox, oy) <= 0) {
      this.commitLabel(s, ox, oy);
      return;
    }
    const next = this.resolveLabel(s);
    this.commitLabel(s, next.ox, next.oy);
  }

  /** Prefer a slot that also misses E icons when it does not lift any further. */
  private resolveLabel(s: LabelSlot): { ox: number; oy: number } {
    const plates = this.seekLabel(s, false);
    const both = this.seekLabel(s, true);
    if (both && (!plates || -both.oy <= -plates.oy)) return both;
    if (plates) return plates;
    return this.leastLabel(s);
  }

  /** Smallest lift, then smallest sideways slide, that clears placed plates and maybe icons. */
  private seekLabel(s: LabelSlot, icons: boolean): { ox: number; oy: number } | null {
    for (let lift = 0; lift <= LABEL_LIFT_CAP; lift++) {
      const oy = -lift;
      for (let side = 0; side <= LABEL_NUDGE_CAP; side++) {
        if (this.labelClear(s, side, oy, icons)) return { ox: side, oy };
        if (side !== 0 && this.labelClear(s, -side, oy, icons)) return { ox: -side, oy };
      }
    }
    return null;
  }

  /** Inside the caps, the offset with the least plate-on-plate area. */
  private leastLabel(s: LabelSlot): { ox: number; oy: number } {
    let ox = 0;
    let oy = 0;
    let best = Number.POSITIVE_INFINITY;
    let bestLift = LABEL_LIFT_CAP + 1;
    let bestSide = LABEL_NUDGE_CAP + 1;
    for (let lift = 0; lift <= LABEL_LIFT_CAP; lift++) {
      for (let side = 0; side <= LABEL_NUDGE_CAP; side++) {
        const xs = side === 0 ? [0] : [side, -side];
        for (const x of xs) {
          const area = this.plateOverlap(s, x, -lift);
          if (
            area < best - 1e-6 ||
            (Math.abs(area - best) <= 1e-6 && (lift < bestLift || (lift === bestLift && side < bestSide)))
          ) {
            best = area;
            bestLift = lift;
            bestSide = side;
            ox = x;
            oy = -lift;
          }
        }
      }
    }
    return { ox, oy };
  }

  private labelClear(s: LabelSlot, ox: number, oy: number, icons: boolean): boolean {
    const r = this.blockAt(s, oy, ox);
    for (let i = 0; i < this.placedCount; i++) {
      if (!separatedBy(r, this.placedRects[i], LABEL_GAP)) return false;
    }
    if (!icons) return true;
    for (let i = 0; i < this.statusCount; i++) {
      if (!separatedBy(r, this.statusRects[i], LABEL_GAP)) return false;
    }
    return true;
  }

  private plateOverlap(s: LabelSlot, ox: number, oy: number): number {
    const r = this.blockAt(s, oy, ox);
    let area = 0;
    for (let i = 0; i < this.placedCount; i++) area += overlapArea(r, this.placedRects[i]);
    return area;
  }

  /** Slide an E icon off any plate. The home mark wins when it is already clear. */
  private settleStatusIcons(): void {
    for (let i = 0; i < this.statusCount; i++) {
      const mark = this.statusMarks[i];
      const rect = this.statusRects[i];
      if (this.iconClear(rect, i, 0)) continue;
      const spot = this.iconSpot(mark, i);
      if (!spot) continue;
      rect.x = spot.x - mark.r;
      rect.y = spot.y - mark.r;
    }
  }

  private iconClear(rect: ScreenRect, index: number, gap: number): boolean {
    for (let i = 0; i < this.placedCount; i++) {
      if (!separatedBy(this.placedRects[i], rect, gap)) return false;
    }
    for (let i = 0; i < index; i++) {
      if (!separatedBy(this.statusRects[i], rect, gap)) return false;
    }
    return true;
  }

  private iconSpot(mark: StatusMark, index: number): { x: number; y: number } | null {
    const r = mark.r;
    let bestX = 0;
    let bestY = 0;
    let bestD = Number.POSITIVE_INFINITY;
    const tryAt = (x: number, y: number): void => {
      const rect: ScreenRect = { x: x - r, y: y - r, w: r * 2, h: r * 2 };
      if (!this.iconClear(rect, index, LABEL_GAP)) return;
      const dx = x - mark.homeX;
      const dy = y - mark.homeY;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        bestX = x;
        bestY = y;
      }
    };
    const owner = this.slotById(mark.owner);
    if (owner) {
      const b = this.blockAt(owner, owner.dy, owner.dx);
      tryAt(b.x + b.w + LABEL_GAP + r, b.y + b.h / 2);
      tryAt(b.x - LABEL_GAP - r, b.y + b.h / 2);
      tryAt(b.x + b.w / 2, b.y + b.h + LABEL_GAP + r);
      tryAt(b.x + b.w / 2, b.y - LABEL_GAP - r);
    }
    for (let dist = 2; dist <= 36; dist += 2) {
      tryAt(mark.homeX + dist, mark.homeY);
      tryAt(mark.homeX - dist, mark.homeY);
      tryAt(mark.homeX, mark.homeY + dist);
      tryAt(mark.homeX, mark.homeY - dist);
      tryAt(mark.homeX + dist, mark.homeY + dist);
      tryAt(mark.homeX - dist, mark.homeY + dist);
      tryAt(mark.homeX + dist, mark.homeY - dist);
      tryAt(mark.homeX - dist, mark.homeY - dist);
    }
    if (!(bestD < Number.POSITIVE_INFINITY)) return null;
    return { x: bestX, y: bestY };
  }

  private slotById(id: string): LabelSlot | null {
    const n = this.overlayCount;
    const pool = this.labelPool;
    for (let i = 0; i < n; i++) if (pool[i].id === id) return pool[i];
    return null;
  }

  private paintStatusIcons(): void {
    const ctx = this.ctx;
    ctx.save();
    for (let i = 0; i < this.statusCount; i++) {
      const mark = this.statusMarks[i];
      const rect = this.statusRects[i];
      const cx = rect.x + rect.w / 2;
      const cy = rect.y + rect.h / 2;
      ctx.fillStyle = "rgba(8, 8, 14, 0.88)";
      ctx.beginPath();
      ctx.arc(cx, cy, mark.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(220, 224, 232, 0.92)";
      ctx.lineWidth = Math.max(1, 1.15 * mark.z);
      ctx.stroke();
      ctx.fillStyle = "#e8eef2";
      ctx.font = `bold ${Math.max(9, 11 * mark.z)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("E", cx, cy + 0.4 * mark.scale);
    }
    ctx.restore();
  }

  private commitLabel(s: LabelSlot, ox: number, oy: number): void {
    s.dx = ox;
    s.dy = oy;
    const rect = this.blockAt(s, oy, ox);
    this.pushPlaced(rect.x, rect.y, rect.w, rect.h);
  }

  private pushPlaced(x: number, y: number, w: number, h: number): void {
    let p = this.placedRects[this.placedCount];
    if (!p) {
      p = { x: 0, y: 0, w: 0, h: 0 };
      this.placedRects[this.placedCount] = p;
    }
    p.x = x;
    p.y = y;
    p.w = w;
    p.h = h;
    this.placedCount++;
  }

  private pushStatus(owner: string, cx: number, cy: number, r: number, z: number, scale: number): void {
    let rect = this.statusRects[this.statusCount];
    if (!rect) {
      rect = { x: 0, y: 0, w: 0, h: 0 };
      this.statusRects[this.statusCount] = rect;
    }
    rect.x = cx - r;
    rect.y = cy - r;
    rect.w = r * 2;
    rect.h = r * 2;
    let mark = this.statusMarks[this.statusCount];
    if (!mark) {
      mark = { owner: "", r: 0, z: 1, scale: 1, homeX: 0, homeY: 0 };
      this.statusMarks[this.statusCount] = mark;
    }
    mark.owner = owner;
    mark.r = r;
    mark.z = z;
    mark.scale = scale;
    mark.homeX = cx;
    mark.homeY = cy;
    this.statusCount++;
  }

  private paintUnitRing(s: LabelSlot): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = s.dim ? greyerAccent(s.accent) : s.accent;
    ctx.lineWidth = Math.max(2, 2.2 * s.z);
    ctx.beginPath();
    ctx.ellipse(s.ringX, s.ringY, s.ringRx, s.ringRy, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(8,8,12,0.85)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  private paintUnitLabel(s: LabelSlot): void {
    const ctx = this.ctx;
    const ox = s.dx;
    const oy = s.dy;
    if (Math.hypot(ox, oy) > LABEL_LEADER_MIN) this.paintLeader(s);
    ctx.save();
    // Bar sits on the plate. Same edges as blockAt, so the layout rect is the drawn block.
    const barX = s.ringX + ox - s.barW / 2;
    const barY = s.plateY + oy - s.barH;
    ctx.fillStyle = "#111018";
    ctx.fillRect(barX, barY, s.barW, s.barH);
    ctx.fillStyle = s.accent;
    ctx.fillRect(barX, barY, s.barW * s.ratio, s.barH);
    const plateX = s.ringX + ox - s.plateW / 2;
    const plateY = s.plateY + oy;
    const plateW = s.plateW;
    const plateH = s.plateH;
    const radius = Math.min(plateH / 2, Math.max(2, 3 * s.z));
    ctx.beginPath();
    ctx.moveTo(plateX + radius, plateY);
    ctx.arcTo(plateX + plateW, plateY, plateX + plateW, plateY + plateH, radius);
    ctx.arcTo(plateX + plateW, plateY + plateH, plateX, plateY + plateH, radius);
    ctx.arcTo(plateX, plateY + plateH, plateX, plateY, radius);
    ctx.arcTo(plateX, plateY, plateX + plateW, plateY, radius);
    ctx.closePath();
    ctx.fillStyle = "rgba(8, 8, 14, 0.88)";
    ctx.fill();
    ctx.fillStyle = "#e8eef2";
    ctx.font = `${s.fontPx}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText(s.text, s.ringX + ox, s.baseline + oy);
    ctx.restore();
  }

  /** Thin team-coloured line from the plate's bottom centre to this unit's head. */
  private paintLeader(s: LabelSlot): void {
    const x0 = s.ringX + s.dx;
    const y0 = s.plateY + s.dy + s.plateH;
    const x1 = s.bodyX + s.bodyW / 2;
    const y1 = s.bodyY;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = s.accent;
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.restore();
  }

  private drawFacingWedge(u: Unit, map: GameMap, x: number, feetY: number, z: number): void {
    const ctx = this.ctx;
    const h = map.heightAt(u.x, u.y);
    const project = this.projectAt(u.x, u.y, h, u.dir, map);
    const tip = [
      project(0, 0.11, 0.03),
      project(-0.035, 0.04, 0.03),
      project(0.035, 0.04, 0.03),
    ];
    const body = [
      project(-0.04, 0.035, 0.018),
      project(0.04, 0.035, 0.018),
      project(0.05, -0.045, 0.018),
      project(0, -0.015, 0.018),
      project(-0.05, -0.045, 0.018),
    ];
    ctx.beginPath();
    ctx.moveTo(body[0].x, body[0].y);
    for (let i = 1; i < body.length; i++) ctx.lineTo(body[i].x, body[i].y);
    ctx.closePath();
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(6,8,14,0.95)";
    ctx.lineWidth = Math.max(1.6, 1.8 * z);
    ctx.stroke();
    ctx.fillStyle = "#5a88c8";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(tip[0].x, tip[0].y);
    ctx.lineTo(tip[1].x, tip[1].y);
    ctx.lineTo(tip[2].x, tip[2].y);
    ctx.closePath();
    ctx.strokeStyle = "rgba(6,8,14,0.95)";
    ctx.stroke();
    ctx.fillStyle = "#ff9a3c";
    ctx.fill();
    void x;
    void feetY;
  }

  private drawVignette(): void {
    const ctx = this.ctx;
    const g = ctx.createRadialGradient(
      this.w / 2,
      this.h / 2,
      this.h * 0.2,
      this.w / 2,
      this.h / 2,
      this.h * 0.78,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  private drawFloats(floats: FloatText[], map: GameMap): void {
    const ctx = this.ctx;
    const now = performance.now();
    for (const f of floats) {
      const t = (now - f.born) / f.life;
      if (t > 1) continue;
      const h = map.heightAt(Math.round(f.x), Math.round(f.y));
      const p = this.worldToScreen(f.x, f.y, h);
      ctx.globalAlpha = 1 - t;
      ctx.font = `bold ${18 * this.cam.zoom}px sans-serif`;
      ctx.textAlign = "center";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#050508";
      ctx.fillStyle = f.color;
      const yy = p.y - 36 * this.cam.zoom - t * 28;
      ctx.strokeText(f.text, p.x, yy);
      ctx.fillText(f.text, p.x, yy);
      ctx.globalAlpha = 1;
    }
  }
}
