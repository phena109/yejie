import type { GameMap } from "./map";
import type { FloatText, Phase, Tile, Unit, Vec2 } from "./types";
import { DIRS, key } from "./types";

export const TILE = 48;
export const ELEV = 14;
export const BASE = 8;

export interface Cam {
  x: number;
  y: number;
  zoom: number;
}

export class Renderer {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  cam: Cam = { x: 5 * TILE, y: 9 * TILE, zoom: 0.92 };
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
    const wx = x * TILE + TILE / 2;
    const wy = y * TILE + TILE / 2 - h * ELEV;
    return {
      x: (wx - this.cam.x) * this.cam.zoom + this.w / 2,
      y: (wy - this.cam.y) * this.cam.zoom + this.h / 2,
    };
  }

  tileTop(x: number, y: number, h: number): { x: number; y: number; s: number } {
    const s = TILE * this.cam.zoom;
    const p = this.worldToScreen(x, y, h);
    return { x: p.x - s / 2, y: p.y - s / 2, s };
  }

  hitTile(sx: number, sy: number, map: GameMap): Vec2 | null {
    let hit: Vec2 | null = null;
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        const t = map.tiles[y][x];
        const top = this.tileTop(x, y, t.h);
        if (sx >= top.x && sy >= top.y && sx < top.x + top.s && sy < top.y + top.s) {
          hit = { x, y };
        }
      }
    }
    return hit;
  }

  centerOn(units: Unit[], map: GameMap): void {
    const living = units.filter((u) => !u.dead && u.team === "player");
    if (!living.length) return;
    let x = 0;
    let y = 0;
    for (const u of living) {
      x += u.x * TILE + TILE / 2;
      y += u.y * TILE + TILE / 2 - map.heightAt(u.x, u.y) * ELEV;
    }
    this.cam.x = x / living.length;
    this.cam.y = y / living.length - 20;
    this.cam.zoom = 0.92;
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

    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        this.drawTile(map.tiles[y][x], overlays);
      }
    }

    const living = units.filter((u) => !u.dead).sort((a, b) => a.y - b.y || a.x - b.x);
    for (const u of living) this.drawUnit(u, map, overlays);

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
    const top = this.tileTop(t.x, t.y, t.h);
    const drop = (BASE + t.h * ELEV) * this.cam.zoom;
    const k = key(t.x, t.y);
    const checker = (t.x + t.y) % 2 === 0;

    let topCol = "#1a1a24";
    let sideCol = "#101018";
    if (t.terrain === "street") {
      topCol = checker ? "#1c2230" : "#161b26";
      sideCol = "#0c1018";
    } else if (t.terrain === "stairs") {
      topCol = checker ? "#3a342c" : "#2e2923";
      sideCol = "#1c1814";
    } else {
      topCol = checker ? "#26222e" : "#1e1b26";
      sideCol = "#121018";
    }

    ctx.fillStyle = sideCol;
    ctx.fillRect(top.x, top.y + top.s - 1, top.s, drop + 1);

    ctx.fillStyle = topCol;
    ctx.fillRect(top.x, top.y, top.s, top.s);

    ctx.strokeStyle = "rgba(80, 220, 255, 0.16)";
    ctx.lineWidth = 1;
    ctx.strokeRect(top.x + 0.5, top.y + 0.5, top.s - 1, top.s - 1);

    if (t.terrain === "street") {
      ctx.fillStyle = "rgba(80, 160, 255, 0.06)";
      ctx.beginPath();
      ctx.ellipse(top.x + top.s * 0.4, top.y + top.s * 0.62, top.s * 0.22, top.s * 0.08, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    if (t.terrain === "stairs") {
      ctx.strokeStyle = "rgba(255, 220, 170, 0.2)";
      for (let i = 1; i <= 3; i++) {
        const yy = top.y + (top.s * i) / 4;
        ctx.beginPath();
        ctx.moveTo(top.x + 4, yy);
        ctx.lineTo(top.x + top.s - 4, yy);
        ctx.stroke();
      }
    }

    this.drawProp(t, top);

    if (overlays.move.has(k)) {
      ctx.fillStyle = "rgba(62, 240, 208, 0.32)";
      ctx.fillRect(top.x + 2, top.y + 2, top.s - 4, top.s - 4);
      ctx.strokeStyle = "rgba(62, 240, 208, 0.85)";
      ctx.strokeRect(top.x + 2, top.y + 2, top.s - 4, top.s - 4);
    }
    if (overlays.action.has(k)) {
      ctx.fillStyle = "rgba(255, 77, 109, 0.34)";
      ctx.fillRect(top.x + 3, top.y + 3, top.s - 6, top.s - 6);
      ctx.strokeStyle = "rgba(255, 77, 109, 0.9)";
      ctx.strokeRect(top.x + 3, top.y + 3, top.s - 6, top.s - 6);
    }
    if (overlays.skill.has(k)) {
      ctx.fillStyle = "rgba(180, 140, 255, 0.34)";
      ctx.fillRect(top.x + 3, top.y + 3, top.s - 6, top.s - 6);
      ctx.strokeStyle = "rgba(200, 170, 255, 0.95)";
      ctx.strokeRect(top.x + 3, top.y + 3, top.s - 6, top.s - 6);
    }
  }

  private drawProp(t: Tile, top: { x: number; y: number; s: number }): void {
    const ctx = this.ctx;
    const s = top.s;
    if (t.prop === "stall") {
      ctx.fillStyle = "#4a1d28";
      ctx.fillRect(top.x + s * 0.12, top.y + s * 0.38, s * 0.76, s * 0.5);
      const flicker = 0.75 + Math.sin(this.time / 180 + t.x) * 0.2;
      ctx.fillStyle = `rgba(255, 61, 138, ${0.7 * flicker})`;
      ctx.fillRect(top.x + s * 0.1, top.y + s * 0.18, s * 0.8, s * 0.22);
      ctx.fillStyle = "#ffe08a";
      ctx.font = `${Math.max(9, s * 0.22)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(t.x < 5 ? "麵" : "茶", top.x + s / 2, top.y + s * 0.36);
    } else if (t.prop === "ac") {
      ctx.fillStyle = "#3a3e48";
      ctx.fillRect(top.x + s * 0.18, top.y + s * 0.28, s * 0.64, s * 0.46);
      ctx.strokeStyle = "#8a93a3";
      ctx.beginPath();
      ctx.arc(top.x + s * 0.5, top.y + s * 0.5, s * 0.14, 0, Math.PI * 2);
      ctx.stroke();
    } else if (t.prop === "lamp") {
      ctx.fillStyle = "#2a2a32";
      ctx.fillRect(top.x + s * 0.46, top.y + s * 0.1, s * 0.08, s * 0.7);
      ctx.fillStyle = "rgba(255, 210, 120, 0.85)";
      ctx.beginPath();
      ctx.arc(top.x + s * 0.5, top.y + s * 0.14, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 200, 110, 0.12)";
      ctx.beginPath();
      ctx.arc(top.x + s * 0.5, top.y + s * 0.55, s * 0.38, 0, Math.PI * 2);
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
    const dx = DIRS[u.dir].x * 6 * z * (u.lunge || 0);
    const dy = DIRS[u.dir].y * 6 * z * (u.lunge || 0);
    const x = p.x + dx;
    const y = p.y + dy;

    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 10 * z, 12 * scale, 5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (overlays.selected?.id === u.id) {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y - 4 * z, 18 * scale, 0, Math.PI * 2);
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

    const fx = DIRS[u.dir].x;
    const fy = DIRS[u.dir].y;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(x + fx * 14 * scale, y + fy * 12 * scale - 4 * scale);
    ctx.lineTo(x + fx * 8 * scale - fy * 4 * scale, y + fy * 6 * scale);
    ctx.lineTo(x + fx * 8 * scale + fy * 4 * scale, y + fy * 6 * scale);
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
    ctx.fillText(u.name, x, y + 22 * scale);

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
