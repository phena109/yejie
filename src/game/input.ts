import type { Renderer } from "./renderer";
import type { Vec2 } from "./types";

export class PointerInput {
  private pointers = new Map<number, Vec2>();
  private lastPinch = 0;
  private dragging = false;
  private start: Vec2 | null = null;
  private moved = 0;
  onTap: (p: Vec2) => void = () => {};

  constructor(
    private canvas: HTMLCanvasElement,
    private renderer: Renderer,
  ) {
    canvas.addEventListener("pointerdown", (e) => this.down(e));
    canvas.addEventListener("pointermove", (e) => this.move(e));
    canvas.addEventListener("pointerup", (e) => this.up(e));
    canvas.addEventListener("pointercancel", (e) => this.up(e));
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

  private down(e: PointerEvent): void {
    this.canvas.setPointerCapture(e.pointerId);
    const p = this.pos(e);
    this.pointers.set(e.pointerId, p);
    if (this.pointers.size === 1) {
      this.start = p;
      this.moved = 0;
      this.dragging = false;
    } else if (this.pointers.size === 2) {
      this.lastPinch = this.pinchDist();
    }
  }

  private move(e: PointerEvent): void {
    if (!this.pointers.has(e.pointerId)) return;
    const p = this.pos(e);
    const prev = this.pointers.get(e.pointerId)!;
    this.pointers.set(e.pointerId, p);

    if (this.pointers.size === 2) {
      const d = this.pinchDist();
      if (this.lastPinch > 0) {
        const factor = d / this.lastPinch;
        const pts = [...this.pointers.values()];
        const cx = (pts[0].x + pts[1].x) / 2;
        const cy = (pts[0].y + pts[1].y) / 2;
        this.zoomAt(cx + this.canvas.getBoundingClientRect().left, cy + this.canvas.getBoundingClientRect().top, factor);
      }
      this.lastPinch = d;
      this.dragging = true;
      return;
    }

    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    this.moved += Math.hypot(dx, dy);
    if (this.moved > 10) this.dragging = true;
    if (this.dragging) {
      const z = this.renderer.cam.zoom;
      this.renderer.cam.x -= dx / z;
      this.renderer.cam.y -= dy / z;
    }
  }

  private up(e: PointerEvent): void {
    const p = this.pointers.get(e.pointerId);
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.lastPinch = 0;
    if (this.pointers.size === 0) {
      if (!this.dragging && this.start && p) this.onTap(p);
      this.start = null;
      this.dragging = false;
      this.moved = 0;
    }
  }

  private pinchDist(): number {
    const pts = [...this.pointers.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  private zoomAt(clientX: number, clientY: number, factor: number): void {
    const r = this.canvas.getBoundingClientRect();
    const sx = clientX - r.left;
    const sy = clientY - r.top;
    const cam = this.renderer.cam;
    const wx = cam.x + (sx - this.renderer.w / 2) / cam.zoom;
    const wy = cam.y + (sy - this.renderer.h / 2) / cam.zoom;
    cam.zoom = Math.min(1.8, Math.max(0.55, cam.zoom * factor));
    cam.x = wx - (sx - this.renderer.w / 2) / cam.zoom;
    cam.y = wy - (sy - this.renderer.h / 2) / cam.zoom;
  }
}
