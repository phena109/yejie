import type { Unit } from "./types";

const NAMES = ["mara", "dana", "priya", "enemy", "hale"] as const;
type SpriteName = (typeof NAMES)[number];

export interface SpriteFrame {
  img: HTMLImageElement;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

const frames: Partial<Record<SpriteName, SpriteFrame>> = {};
let loading: Promise<void> | null = null;

function srcFor(name: SpriteName): string {
  const base = import.meta.env.BASE_URL || "./";
  return `${base}sprites/${name}.png`;
}

function trimFrame(img: HTMLImageElement): SpriteFrame {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return { img, sx: 0, sy: 0, sw: w, sh: h };
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, w, h).data;
  let minx = w;
  let miny = h;
  let maxx = -1;
  let maxy = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 10) {
        if (x < minx) minx = x;
        if (y < miny) miny = y;
        if (x > maxx) maxx = x;
        if (y > maxy) maxy = y;
      }
    }
  }
  if (maxx < 0) return { img, sx: 0, sy: 0, sw: w, sh: h };
  return { img, sx: minx, sy: miny, sw: maxx - minx + 1, sh: maxy - miny + 1 };
}

export function loadSprites(): Promise<void> {
  if (loading) return loading;
  loading = Promise.all(
    NAMES.map(
      (name) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            frames[name] = trimFrame(img);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = srcFor(name);
        }),
    ),
  ).then(() => undefined);
  return loading;
}

export function spriteOf(u: Unit): SpriteFrame | null {
  const name = spriteName(u);
  const frame = frames[name];
  if (frame && frame.img.complete && frame.img.naturalWidth > 0 && frame.sw > 0) return frame;
  return null;
}

export function spriteFacesLeft(u: Unit): boolean {
  return spriteName(u) === "enemy";
}

function spriteName(u: Unit): SpriteName {
  if (u.id === "mara" || u.id === "dana" || u.id === "priya" || u.id === "hale") return u.id;
  return "enemy";
}
