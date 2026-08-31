import type { Renderer } from "./renderer";
import type { Vec2 } from "./types";

export class PointerInput {
  private pointers = new Map<number, Vec2>();
  private lastPinch = 0;
  private lastAngle = 0;
  private lastCentroid: Vec2 | null = null;
  private dragging = false;
  private start: Vec2 | null = null;
  private moved = 0;
  private right = false;
  private pinchGrid: { x: number; y: number } | null = null;
  onTap: (p: Vec2) => void = () => {};

  constructor(
    private canvas: HTMLCanvasElement,
    private renderer: Renderer,
  ) {
    canvas.addEventListener("pointerdown", (e) => this.down(e));
    canvas.addEventListener("pointermove", (e) => this.move(e));
    canvas.addEventListener("pointerup", (e) => this.up(e));
    canvas.addEventListener("pointercancel", (e) => this.up(e));
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    canvas.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        this.zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.08 : 0.92);
      },
      { passive: false },
    );
  }

  private pos(e: PointerEvent): Vec2 {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private centroid(): Vec2 {
    const pts = [...this.pointers.values()];
    let x = 0;
    let y = 0;
    for (const p of pts) {
      x += p.x;
      y += p.y;
    }
    return { x: x / pts.length, y: y / pts.length };
  }

  private down(e: PointerEvent): void {
    this.canvas.setPointerCapture(e.pointerId);
    const p = this.pos(e);
    this.pointers.set(e.pointerId, p);
    if (e.button === 2) this.right = true;
    if (this.pointers.size === 1) {
      this.start = p;
      this.moved = 0;
      this.dragging = false;
    } else if (this.pointers.size === 2) {
      this.lastPinch = this.pinchDist();
      this.lastAngle = this.pinchAngle();
      const c = this.centroid();
      this.lastCentroid = c;
      this.pinchGrid = this.renderer.screenToGrid(c.x, c.y);
      this.dragging = true;
    }
  }

  private move(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) return;
    const p = this.pos(e);
    const prev = this.pointers.get(e.pointerId)!;
    this.pointers.set(e.pointerId, p);

    if (this.pointers.size === 2) {
      const d = this.pinchDist();
      const ang = this.pinchAngle();
      const c = this.centroid();
      if (this.lastPinch > 0) {
        const factor = d / this.lastPinch;
        // Invert twist so the map sticks to the fingers (iOS-map style).
        this.renderer.yaw -= ang - this.lastAngle;
        if (this.lastCentroid) {
          this.renderer.addPitch(c.y - this.lastCentroid.y);
        }
        this.zoomAtScreen(c.x, c.y, factor);
        if (this.pinchGrid) {
          this.renderer.lockGridToScreen(this.pinchGrid.x, this.pinchGrid.y, 0, c.x, c.y);
        }
      }
      this.lastPinch = d;
      this.lastAngle = ang;
      this.lastCentroid = c;
      this.dragging = true;
      return;
    }

    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    this.moved += Math.hypot(dx, dy);
    if (this.moved > 10) this.dragging = true;
    if (this.right) {
      const g = this.renderer.screenToGrid(this.renderer.w / 2, this.renderer.h / 2);
      this.renderer.yaw += dx * 0.01;
      this.renderer.addPitch(dy);
      this.renderer.lockGridToScreen(g.x, g.y, 0, this.renderer.w / 2, this.renderer.h / 2);
      return;
    }
    if (this.dragging) {
      const z = this.renderer.cam.zoom;
      this.renderer.cam.x -= dx / z;
      this.renderer.cam.y -= dy / z;
    }
  }

  private up(e: PointerEvent): void {
    const p = this.pointers.get(e.pointerId);
    this.pointers.delete(e.pointerId);
    if (e.button === 2) this.right = false;
    if (this.pointers.size < 2) {
      this.lastPinch = 0;
      this.pinchGrid = null;
      this.lastCentroid = null;
    }
    if (this.pointers.size === 0) {
      if (!this.dragging && this.start && p) this.onTap(p);
      this.start = null;
      this.dragging = false;
      this.moved = 0;
      this.right = false;
    } else {
      this.dragging = true;
    }
  }

  private pinchDist(): number {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  private pinchAngle(): number {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    return Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
  }

  private zoomAt(clientX: number, clientY: number, factor: number): void {
    const r = this.canvas.getBoundingClientRect();
    this.zoomAtScreen(clientX - r.left, clientY - r.top, factor);
  }

  private zoomAtScreen(sx: number, sy: number, factor: number): void {
    const cam = this.renderer.cam;
    const wx = cam.x + (sx - this.renderer.w / 2) / cam.zoom;
    const wy = cam.y + (sy - this.renderer.h / 2) / cam.zoom;
    cam.zoom = Math.min(1.8, Math.max(0.55, cam.zoom * factor));
    cam.x = wx - (sx - this.renderer.w / 2) / cam.zoom;
    cam.y = wy - (sy - this.renderer.h / 2) / cam.zoom;
  }
}
