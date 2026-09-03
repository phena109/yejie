import type { Archetype, Gender } from "./types";

export const SPRITE_W = 32;
export const SPRITE_H = 48;

export type Face = "down" | "left" | "right" | "up";

/** Quadrant order on each 2x2 sheet: TL, TR, BL, BR. */
const SHEETS: Partial<Record<Archetype, { file: string; map: Face[]; maleOnly?: boolean }>> = {
  mara: { file: "hd2d-mara.png", map: ["down", "left", "right", "up"] },
  dana: { file: "hd2d-dana.png", map: ["down", "right", "left", "up"] },
  priya: { file: "hd2d-priya.png", map: ["down", "left", "up", "right"] },
  delinquent: { file: "hd2d-delinquent.png", map: ["down", "right", "up", "left"], maleOnly: true },
};

const idle: Partial<Record<Archetype, Partial<Record<Face, HTMLCanvasElement>>>> = {};
let loading: Promise<void> | null = null;
let ready = false;

function srcFor(file: string): string {
  const base = import.meta.env.BASE_URL || "./";
  return `${base}sprites/${file}`;
}

function isBg(r: number, g: number, b: number): boolean {
  return r >= 228 && g >= 228 && b >= 228 && Math.max(r, g, b) - Math.min(r, g, b) <= 14;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

function floodBg(data: Uint8ClampedArray, w: number, _h: number, x0: number, y0: number, cw: number, ch: number): Uint8Array {
  const vis = new Uint8Array(cw * ch);
  const q: number[] = [];
  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= cw || y >= ch) return;
    const i = y * cw + x;
    if (vis[i]) return;
    const o = ((y0 + y) * w + (x0 + x)) * 4;
    if (isBg(data[o], data[o + 1], data[o + 2])) {
      vis[i] = 1;
      q.push(i);
    }
  };
  for (let x = 0; x < cw; x++) {
    push(x, 0);
    push(x, ch - 1);
  }
  for (let y = 0; y < ch; y++) {
    push(0, y);
    push(cw - 1, y);
  }
  while (q.length) {
    const i = q.pop()!;
    const x = i % cw;
    const y = (i / cw) | 0;
    push(x - 1, y);
    push(x + 1, y);
    push(x, y - 1);
    push(x, y + 1);
  }
  return vis;
}

function sliceCell(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  cw: number,
  ch: number,
): HTMLCanvasElement | null {
  const vis = floodBg(data, w, h, x0, y0, cw, ch);
  let minx = cw;
  let miny = ch;
  let maxx = -1;
  let maxy = -1;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      if (vis[y * cw + x]) continue;
      if (x < minx) minx = x;
      if (y < miny) miny = y;
      if (x > maxx) maxx = x;
      if (y > maxy) maxy = y;
    }
  }
  if (maxx < 0) return null;
  const bw = maxx - minx + 1;
  const bh = maxy - miny + 1;
  const src = new Uint8ClampedArray(bw * bh * 4);
  for (let y = 0; y < bh; y++) {
    for (let x = 0; x < bw; x++) {
      const sx = minx + x;
      const sy = miny + y;
      const di = (y * bw + x) * 4;
      if (vis[sy * cw + sx]) continue;
      const o = ((y0 + sy) * w + (x0 + sx)) * 4;
      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      src[di] = r;
      src[di + 1] = g;
      src[di + 2] = b;
      src[di + 3] = 255;
    }
  }
  dehalo(src, bw, bh);
  const stride = Math.max(1, Math.round(bh / SPRITE_H));
  const dh = Math.min(SPRITE_H, Math.max(1, (bh / stride) | 0));
  const dw = Math.min(SPRITE_W, Math.max(1, (bw / stride) | 0));
  const srcOffY = Math.max(0, bh - dh * stride);
  const x0s = Math.max(0, ((bw - dw * stride) / 2) | 0);
  const smallData = new Uint8ClampedArray(dw * dh * 4);
  for (let y = 0; y < dh; y++) {
    const sy = Math.min(bh - 1, srcOffY + y * stride);
    for (let x = 0; x < dw; x++) {
      const sx = Math.min(bw - 1, x0s + x * stride);
      const si = (sy * bw + sx) * 4;
      const di = (y * dw + x) * 4;
      smallData[di] = src[si];
      smallData[di + 1] = src[si + 1];
      smallData[di + 2] = src[si + 2];
      smallData[di + 3] = src[si + 3];
    }
  }
  const out = makeCanvas(SPRITE_W, SPRITE_H);
  const octx = out.getContext("2d")!;
  octx.imageSmoothingEnabled = false;
  const ox = ((SPRITE_W - dw) / 2) | 0;
  const oy = SPRITE_H - dh;
  octx.putImageData(new ImageData(smallData, dw, dh), ox, oy);
  return out;
}

function dehalo(src: Uint8ClampedArray, w: number, h: number): void {
  const kill: number[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (src[i + 3] < 10) continue;
      const lum = (src[i] + src[i + 1] + src[i + 2]) / 3;
      if (lum < 200) continue;
      const n = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];
      let edge = false;
      for (const [nx, ny] of n) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) {
          edge = true;
          break;
        }
        if (src[(ny * w + nx) * 4 + 3] < 10) {
          edge = true;
          break;
        }
      }
      if (edge) kill.push(i);
    }
  }
  for (const i of kill) src[i + 3] = 0;
}

function processSheet(img: HTMLImageElement, spec: { map: Face[] }): Partial<Record<Face, HTMLCanvasElement>> {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = makeCanvas(w, h);
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  const cw = (w / 2) | 0;
  const ch = (h / 2) | 0;
  const cells: Array<[number, number]> = [
    [0, 0],
    [cw, 0],
    [0, ch],
    [cw, ch],
  ];
  const out: Partial<Record<Face, HTMLCanvasElement>> = {};
  for (let i = 0; i < 4; i++) {
    const face = spec.map[i];
    const [x0, y0] = cells[i];
    const frame = sliceCell(data, w, h, x0, y0, cw, ch);
    if (frame) out[face] = frame;
  }
  return out;
}

export function loadHd2dSprites(): Promise<void> {
  if (loading) return loading;
  loading = (async () => {
    const entries = Object.entries(SHEETS) as Array<[Archetype, { file: string; map: Face[]; maleOnly?: boolean }]>;
    await Promise.all(
      entries.map(async ([arch, spec]) => {
        const img = await loadImage(srcFor(spec.file));
        if (!img || img.naturalWidth < 8) return;
        idle[arch] = processSheet(img, spec);
      }),
    );
    ready = true;
  })();
  return loading;
}

export function pngIdle(arch: Archetype, gender: Gender, face: Face): HTMLCanvasElement | null {
  const spec = SHEETS[arch];
  if (!spec) return null;
  if (spec.maleOnly && gender === "f") return null;
  const frame = idle[arch]?.[face];
  if (!frame) return null;
  return frame;
}

export function hd2dReady(): boolean {
  return ready;
}

export function cloneFrame(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = makeCanvas(src.width, src.height);
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, 0, 0);
  return c;
}

export function frameImageData(src: HTMLCanvasElement): ImageData {
  const ctx = src.getContext("2d", { willReadFrequently: true })!;
  return ctx.getImageData(0, 0, src.width, src.height);
}

export function canvasFromImageData(data: ImageData): HTMLCanvasElement {
  const c = makeCanvas(data.width, data.height);
  c.getContext("2d")!.putImageData(data, 0, 0);
  return c;
}
