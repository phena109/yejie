import type { GameMap } from "./map";
import type { FloatText, Phase, Tile, Unit, Vec2 } from "./types";
import { DIRS, key } from "./types";

/** Diamond width (2:1 orthogonal isometric). */
export const TILE_W = 64;
/** Diamond height. */
export const TILE_H = 32;
/** Vertical pixels per height step (stacked block). */
export const BLOCK = 24;
/** Ground slab under height-0 tiles. */
export const BASE = 8;

export interface Cam {
  x: number;
  y: number;
  zoom: number;
}

function iso(x: number, y: number, h = 0): Vec2 {
  return {
    x: (x - y) * (TILE_W / 2),
    y: (x + y) * (TILE_H / 2) - h * BLOCK,
  };
}

function pointInDiamond(px: number, py: number, cx: number, cy: number, hw: number, hh: number): boolean {
  if (hw <= 0 || hh <= 0) return false;
  return Math.abs(px - cx) / hw + Math.abs(py - cy) / hh <= 1.02;
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

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  cam: Cam = { x: -224, y: 180, zoom: 0.7 };
  w = 390;
  h = 700;
  time = 0;

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

  worldToScreen(x: number, y: number, h = 0): Vec2 {
    const p = iso(x, y, h);
    return {
      x: (p.x - this.cam.x) * this.cam.zoom + this.w / 2,
      y: (p.y - this.cam.y) * this.cam.zoom + this.h / 2,
    };
  }

  private topMetrics(x: number, y: number, h: number): { cx: number; cy: number; hw: number; hh: number; drop: number } {
    const p = this.worldToScreen(x, y, h);
    return {
      cx: p.x,
      cy: p.y,
      hw: (TILE_W / 2) * this.cam.zoom,
      hh: (TILE_H / 2) * this.cam.zoom,
      drop: (BASE + h * BLOCK) * this.cam.zoom,
    };
  }

  hitTile(sx: number, sy: number, map: GameMap): Vec2 | null {
    let hit: Vec2 | null = null;
    for (let d = 0; d < map.w + map.h - 1; d++) {
      for (let x = 0; x < map.w; x++) {
        const y = d - x;
        if (y < 0 || y >= map.h) continue;
        const t = map.tiles[y][x];
        if (this.hitPrism(sx, sy, t)) hit = { x, y };
      }
    }
    return hit;
  }

  private hitPrism(sx: number, sy: number, t: Tile): boolean {
    const { cx, cy, hw, hh, drop } = this.topMetrics(t.x, t.y, t.h);
    if (pointInDiamond(sx, sy, cx, cy, hw, hh)) return true;
    const left = [
      { x: cx - hw, y: cy },
      { x: cx, y: cy + hh },
      { x: cx, y: cy + hh + drop },
      { x: cx - hw, y: cy + drop },
    ];
    const right = [
      { x: cx + hw, y: cy },
      { x: cx, y: cy + hh },
      { x: cx, y: cy + hh + drop },
      { x: cx + hw, y: cy + drop },
    ];
    return pointInQuad(sx, sy, left[0], left[1], left[2], left[3]) || pointInQuad(sx, sy, right[0], right[1], right[2], right[3]);
  }

  centerOn(units: Unit[], map: GameMap): void {
    const living = units.filter((u) => !u.dead && u.team === "player");
    if (!living.length) return;
    let x = 0;
    let y = 0;
    for (const u of living) {
      const p = iso(u.x, u.y, map.heightAt(u.x, u.y));
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
    overlays: {
      move: Set<string>;
      action: Set<string>;
      skill: Set<string>;
      selected: Unit | null;
      target: Unit | null;
      phase: Phase;
    },
    floats: FloatText[],
  ): void {
    const ctx = this.ctx;
    this.time += 16;
    ctx.clearRect(0, 0, this.w, this.h);
    this.drawBackdrop();

    const byTile = new Map<string, Unit>();
    for (const u of units) {
      if (u.dead) continue;
      byTile.set(key(u.x, u.y), u);
    }

    for (let d = 0; d < map.w + map.h - 1; d++) {
      for (let x = 0; x < map.w; x++) {
        const y = d - x;
        if (y < 0 || y >= map.h) continue;
        this.drawTile(map.tiles[y][x], overlays);
        const u = byTile.get(key(x, y));
        if (u) this.drawUnit(u, map, overlays);
      }
    }

    this.drawVignette();
    this.drawFloats(floats, map);
  }

  private drawBackdrop(): void {
    const ctx = this.ctx;
    const g = ctx.createLinearGradient(0, 0, 0, this.h);
    g.addColorStop(0, "#0b1020");
    g.addColorStop(0.45, "#090914");
    g.addColorStop(1, "#120818");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.save();
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 8; i++) {
      const x = (i * 73 + (this.time * 0.004) % 73) % this.w;
      ctx.fillStyle = i % 2 ? "#ff3d8a" : "#3ef0d0";
      ctx.fillRect(x, 8 + (i % 3) * 10, 18, 4);
    }
    ctx.restore();
  }

  private drawTile(t: Tile, overlays: { move: Set<string>; action: Set<string>; skill: Set<string> }): void {
    const ctx = this.ctx;
    const { cx, cy, hw, hh, drop } = this.topMetrics(t.x, t.y, t.h);
    const k = key(t.x, t.y);
    const checker = (t.x + t.y) % 2 === 0;
    const z = this.cam.zoom;

    let topCol = "#1a1a24";
    let leftCol = "#101018";
    let rightCol = "#16161f";
    if (t.terrain === "street") {
      topCol = checker ? "#2a3448" : "#232c3e";
      leftCol = "#121820";
      rightCol = "#1a2230";
    } else if (t.terrain === "stairs") {
      topCol = checker ? "#4a4338" : "#3e392f";
      leftCol = "#241e16";
      rightCol = "#322b22";
    } else {
      topCol = checker ? "#3a3448" : "#312c3e";
      leftCol = "#1a1624";
      rightCol = "#262030";
    }

    ctx.beginPath();
    ctx.moveTo(cx - hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx, cy + hh + drop);
    ctx.lineTo(cx - hw, cy + drop);
    ctx.closePath();
    ctx.fillStyle = leftCol;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + hw, cy);
    ctx.lineTo(cx, cy + hh);
    ctx.lineTo(cx, cy + hh + drop);
    ctx.lineTo(cx + hw, cy + drop);
    ctx.closePath();
    ctx.fillStyle = rightCol;
    ctx.fill();

    const seam = BLOCK * z;
    ctx.strokeStyle = "rgba(0,0,0,0.35)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= t.h; i++) {
      const dy = i * seam;
      ctx.beginPath();
      ctx.moveTo(cx - hw, cy + dy);
      ctx.lineTo(cx, cy + hh + dy);
      ctx.lineTo(cx + hw, cy + dy);
      ctx.stroke();
    }

    this.diamondPath(cx, cy, hw, hh);
    ctx.fillStyle = topCol;
    ctx.fill();
    ctx.strokeStyle = "rgba(120, 230, 255, 0.38)";
    ctx.lineWidth = 1.15;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh);
    ctx.lineTo(cx + hw, cy);
    ctx.strokeStyle = "rgba(220, 245, 255, 0.28)";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - hh);
    ctx.lineTo(cx - hw, cy);
    ctx.strokeStyle = "rgba(40, 60, 80, 0.45)";
    ctx.stroke();

    if (t.terrain === "street") {
      ctx.fillStyle = "rgba(80, 160, 255, 0.08)";
      ctx.beginPath();
      ctx.ellipse(cx - hw * 0.12, cy + hh * 0.18, hw * 0.28, hh * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (t.terrain === "stairs") {
      ctx.strokeStyle = "rgba(255, 220, 170, 0.28)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const t0 = i / 4;
        const y0 = cy - hh + (hh * 2) * t0;
        const half = hw * (1 - Math.abs(1 - 2 * t0));
        ctx.beginPath();
        ctx.moveTo(cx - half, y0);
        ctx.lineTo(cx + half, y0);
        ctx.stroke();
      }
    }

    this.drawProp(t, cx, cy, hw, hh, z);

    if (overlays.move.has(k)) {
      this.diamondPath(cx, cy, hw * 0.92, hh * 0.92);
      ctx.fillStyle = "rgba(62, 240, 208, 0.34)";
      ctx.fill();
      ctx.strokeStyle = "rgba(62, 240, 208, 0.9)";
      ctx.stroke();
    }
    if (overlays.action.has(k)) {
      this.diamondPath(cx, cy, hw * 0.88, hh * 0.88);
      ctx.fillStyle = "rgba(255, 77, 109, 0.36)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 77, 109, 0.92)";
      ctx.stroke();
    }
    if (overlays.skill.has(k)) {
      this.diamondPath(cx, cy, hw * 0.88, hh * 0.88);
      ctx.fillStyle = "rgba(180, 140, 255, 0.36)";
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 170, 255, 0.95)";
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

  private drawProp(t: Tile, cx: number, cy: number, hw: number, hh: number, z: number): void {
    const ctx = this.ctx;
    if (t.prop === "stall") {
      const ph = 14 * z;
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
    } else if (t.prop === "ac") {
      const ph = 10 * z;
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
      ctx.strokeStyle = "#8a93a3";
      ctx.beginPath();
      ctx.arc(cx, cy - 2 * z, 4.5 * z, 0, Math.PI * 2);
      ctx.stroke();
    } else if (t.prop === "lamp") {
      ctx.fillStyle = "#2a2a32";
      ctx.fillRect(cx - 1.6 * z, cy - 18 * z, 3.2 * z, 22 * z);
      ctx.fillStyle = "rgba(255, 210, 120, 0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy - 20 * z, 4.2 * z, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 200, 110, 0.12)";
      ctx.beginPath();
      ctx.arc(cx, cy - 4 * z, 16 * z, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawUnit(
    u: Unit,
    map: GameMap,
    overlays: { selected: Unit | null; target: Unit | null },
  ): void {
    const ctx = this.ctx;
    const h = map.heightAt(u.x, u.y);
    const p = this.worldToScreen(u.x, u.y, h);
    const z = this.cam.zoom;
    const elite = u.role === "elite";
    const scale = (elite ? 1.18 : 1) * z;
    const friend = u.team === "player";
    const body = friend ? "#12343a" : elite ? "#2a1020" : "#3a1418";
    const accent = friend ? "#3ef0d0" : elite ? "#ffc857" : "#ff4d6d";
    const fx = DIRS[u.dir].x;
    const fy = DIRS[u.dir].y;
    const dx = (fx - fy) * 5 * z * (u.lunge || 0);
    const dy = (fx + fy) * 2.5 * z * (u.lunge || 0);
    const x = p.x + dx;
    const y = p.y + dy - 6 * z;

    ctx.fillStyle = "rgba(0,0,0,0.38)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 4 * z, 11 * scale, 5.5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (overlays.selected?.id === u.id) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      this.diamondPath(p.x, p.y, 16 * scale, 8 * scale);
      ctx.stroke();
    }
    if (overlays.target?.id === u.id) {
      ctx.strokeStyle = "#ffe08a";
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 16 * scale, y - 28 * scale, 32 * scale, 40 * scale);
    }

    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.moveTo(x, y + 12 * scale);
    ctx.lineTo(x - 10 * scale, y + 2 * scale);
    ctx.lineTo(x - 8 * scale, y - 10 * scale);
    ctx.lineTo(x + 8 * scale, y - 10 * scale);
    ctx.lineTo(x + 10 * scale, y + 2 * scale);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = friend ? "#d7ece8" : elite ? "#f3e0b0" : "#e8c8c8";
    ctx.beginPath();
    ctx.arc(x, y - 14 * scale, 6.2 * scale, 0, Math.PI * 2);
    ctx.fill();

    if (u.role === "striker") {
      ctx.strokeStyle = "#c9d7de";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 10 * scale, y - 8 * scale);
      ctx.lineTo(x + 16 * scale, y + 8 * scale);
      ctx.stroke();
    } else if (u.role === "controller") {
      ctx.strokeStyle = "#7ecbff";
      ctx.strokeRect(x - 6 * scale, y - 6 * scale, 12 * scale, 8 * scale);
    } else if (u.role === "support") {
      ctx.fillStyle = "#7dffb3";
      ctx.fillRect(x - 11 * scale, y - 2 * scale, 7 * scale, 7 * scale);
    } else if (elite) {
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(x - 8 * scale, y - 18 * scale, 16 * scale, 3 * scale);
    }

    const ix = (fx - fy) * 10 * scale;
    const iy = (fx + fy) * 5 * scale;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(x + ix * 1.15, y + iy * 1.15 - 2 * scale);
    ctx.lineTo(x + ix * 0.55 - iy * 0.35, y + iy * 0.55 + ix * 0.18);
    ctx.lineTo(x + ix * 0.55 + iy * 0.35, y + iy * 0.55 - ix * 0.18);
    ctx.closePath();
    ctx.fill();

    const bw = 22 * scale;
    const ratio = Math.max(0, u.hp / u.maxHp);
    ctx.fillStyle = "#111018";
    ctx.fillRect(x - bw / 2, y - 28 * scale, bw, 3.5 * scale);
    ctx.fillStyle = friend ? "#3ef0d0" : "#ff4d6d";
    ctx.fillRect(x - bw / 2, y - 28 * scale, bw * ratio, 3.5 * scale);

    ctx.fillStyle = "#e8eef2";
    ctx.font = `${Math.max(9, 10 * z)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(u.name.split(" ")[0], x, y + 22 * scale);

    if (u.acted && u.team === "player") {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.arc(x, y - 4 * z, 16 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
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
