import type { GameMap, MapTheme } from "./map";
import type { BoardObj } from "./objects";
import { CHAR_H, drawRig, localToGrid, type ProjectFn } from "./rig";
import type { Dir, FloatText, Phase, Tile, Unit, Vec2 } from "./types";
import { DIRS, factionColor, key, nextYaw, yawDir, yawPoint } from "./types";

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


function lerp2(a: Vec2, b: Vec2, t: number): Vec2 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function hash01(n: number): number {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
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
    this.resize();
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


  private cellsInDrawOrder(map: GameMap): Vec2[] {
    const cells: Vec2[] = [];
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) cells.push({ x, y });
    }
    cells.sort((a, b) => {
      const aa = yawPoint(a.x, a.y, this.yaw, map.w, map.h);
      const bb = yawPoint(b.x, b.y, this.yaw, map.w, map.h);
      return aa.x + aa.y - (bb.x + bb.y);
    });
    return cells;
  }

  hitTile(sx: number, sy: number, map: GameMap): Vec2 | null {
    this.syncMap(map);
    let hit: Vec2 | null = null;
    for (const c of this.cellsInDrawOrder(map)) {
      const t = map.tiles[c.y][c.x];
      if (this.hitPrism(sx, sy, t)) hit = c;
    }
    return hit;
  }

  private hitPrism(sx: number, sy: number, t: Tile): boolean {
    const { drop, top } = this.topMetrics(t.x, t.y, t.h);
    if (pointInQuad(sx, sy, top[0], top[1], top[2], top[3])) return true;
    for (const [a, b, c, d] of this.frontFaces(top, drop)) {
      if (pointInQuad(sx, sy, a, b, c, d)) return true;
    }
    return false;
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

    const byTile = new Map<string, Unit>();
    for (const u of units) {
      if (u.dead) continue;
      byTile.set(key(u.x, u.y), u);
    }

    const objAt = new Map<string, BoardObj>();
    for (const o of map.objects) {
      if (!o.gone) objAt.set(key(o.x, o.y), o);
    }

    for (const c of this.cellsInDrawOrder(map)) {
      this.drawTile(map.tiles[c.y][c.x], map, overlays);
      const o = objAt.get(key(c.x, c.y));
      if (o) this.drawBoardObj(o, map);
      const u = byTile.get(key(c.x, c.y));
      if (u) this.drawUnit(u, map, overlays);
    }

    this.drawVignette();
    this.drawFloats(floats, map);
  }

  private drawBackdrop(theme: MapTheme): void {
    const ctx = this.ctx;
    const g = ctx.createLinearGradient(0, 0, 0, this.h);
    if (theme === "alley" || theme === "warehouse" || theme === "street") {
      g.addColorStop(0, "#0c0d12");
      g.addColorStop(0.5, "#0a090c");
      g.addColorStop(1, "#140c08");
    } else {
      g.addColorStop(0, "#0b1020");
      g.addColorStop(0.45, "#090914");
      g.addColorStop(1, "#120818");
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 8; i++) {
      const x = (i * 73 + (this.time * 0.004) % 73) % this.w;
      ctx.fillStyle = theme === "alley" ? (i % 2 ? "#ffb040" : "#c45a2a") : i % 2 ? "#ff3d8a" : "#3ef0d0";
      ctx.fillRect(x, 8 + (i % 3) * 10, 18, 4);
    }
    ctx.restore();
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
      const mute = kind === "skill" || kind === "item" ? "rgba(160, 130, 220, 0.16)" : "rgba(255, 90, 110, 0.14)";
      const stroke = kind === "skill" || kind === "item" ? "rgba(180, 150, 230, 0.45)" : "rgba(255, 110, 130, 0.42)";
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
          ? `rgba(190, 150, 255, ${0.28 + pulse * 0.22})`
          : `rgba(255, 80, 110, ${0.3 + pulse * 0.22})`;
      const stroke = kind === "skill" || kind === "item" ? "rgba(230, 210, 255, 0.98)" : "rgba(255, 170, 180, 0.98)";
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
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      const a = lerp2(top[0], top[2], 0.5);
      const b = lerp2(top[1], top[3], 0.5);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
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

    ctx.fillStyle = "rgba(255,255,255,0.035)";
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
    ctx.strokeStyle = "rgba(220, 245, 255, 0.22)";
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

  private projectFor(u: Unit, map: GameMap): ProjectFn {
    const h = map.heightAt(u.x, u.y);
    return (lx: number, ly: number, lz: number) => {
      const g = localToGrid(lx, ly, u.dir);
      const screen = this.worldToScreen(u.x + g.x, u.y + g.y, h + lz * CHAR_H);
      const yp = yawPoint(u.x + g.x, u.y + g.y, this.yaw, map.w, map.h);
      return { x: screen.x, y: screen.y, d: yp.x + yp.y - lz * CHAR_H * 0.45 };
    };
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

  private drawUnit(u: Unit, map: GameMap, overlays: DrawOverlays): void {
    const ctx = this.ctx;
    const h = map.heightAt(u.x, u.y);
    const p = this.worldToScreen(u.x, u.y, h);
    const z = this.cam.zoom;
    const elite = u.role === "elite";
    const scale = (elite ? 1.12 : 1) * z;
    const accent = factionColor(u);
    const face = yawDir(DIRS[u.dir].x, DIRS[u.dir].y, this.yaw);
    const dx = (face.x - face.y) * 6 * z * (u.lunge || 0);
    const dy = (face.x + face.y) * 3 * z * (u.lunge || 0);
    const x = p.x + dx;
    const feetY = p.y + dy + 2 * z;
    const done = u.acted;
    ctx.save();
    if (done) ctx.globalAlpha *= 0.45;

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(x, feetY + 1 * z, 12 * scale, 5.6 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(2.2, 2.6 * z);
    ctx.beginPath();
    ctx.ellipse(x, feetY + 1 * z, 13.5 * scale, 6.4 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(8,8,12,0.85)";
    ctx.lineWidth = 1;
    ctx.stroke();

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

    const project = this.projectFor(u, map);
    const shifted: ProjectFn = (lx, ly, lz) => {
      const q = project(lx, ly, lz);
      return { x: q.x + dx, y: q.y + dy, d: q.d };
    };
    drawRig(ctx, shifted, u, this.time, z);

    this.drawFacingWedge(u, map, x, feetY, z);

    const dh = 64 * scale;
    const bw = 22 * scale;
    const ratio = Math.max(0, u.hp / u.maxHp);
    const barY = feetY - dh - 4 * scale;
    ctx.fillStyle = "#111018";
    ctx.fillRect(x - bw / 2, barY, bw, 3.5 * scale);
    ctx.fillStyle = accent;
    ctx.fillRect(x - bw / 2, barY, bw * ratio, 3.5 * scale);

    ctx.fillStyle = "#e8eef2";
    ctx.font = `${Math.max(9, 10 * z)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(u.name.split(" ")[0], x, feetY + 22 * z);

    ctx.restore();

    if (done) {
      const ex = x + 14 * scale;
      const ey = feetY - dh + 10 * scale;
      const er = 7.2 * scale;
      ctx.fillStyle = "rgba(8, 8, 14, 0.88)";
      ctx.beginPath();
      ctx.arc(ex, ey, er, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(220, 224, 232, 0.92)";
      ctx.lineWidth = Math.max(1, 1.15 * z);
      ctx.stroke();
      ctx.fillStyle = "#e8eef2";
      ctx.font = `bold ${Math.max(9, 11 * z)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("E", ex, ey + 0.4 * scale);
      ctx.textBaseline = "alphabetic";
    }
  }

  private drawFacingWedge(u: Unit, map: GameMap, x: number, feetY: number, z: number): void {
    const ctx = this.ctx;
    const h = map.heightAt(u.x, u.y);
    const project = this.projectAt(u.x, u.y, h, u.dir, map);
    const tip = [
      project(0, 0.48, 0.035),
      project(-0.16, 0.16, 0.035),
      project(0.16, 0.16, 0.035),
    ];
    const body = [
      project(-0.2, 0.14, 0.02),
      project(0.2, 0.14, 0.02),
      project(0.24, -0.22, 0.02),
      project(0, -0.08, 0.02),
      project(-0.24, -0.22, 0.02),
    ];
    ctx.beginPath();
    ctx.moveTo(body[0].x, body[0].y);
    for (let i = 1; i < body.length; i++) ctx.lineTo(body[i].x, body[i].y);
    ctx.closePath();
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(6,8,14,0.95)";
    ctx.lineWidth = Math.max(2.4, 2.8 * z);
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
