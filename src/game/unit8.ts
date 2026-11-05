import type { AnimClip, Unit } from "./types";

/**
 * Painted multi-clip bodies. Same clip names and screen sectors as the rig and hero8.
 * Path: ./sprites/unit8/<look>/<clip>-<sector>.png. Feet sit at the bottom centre. Never mirror.
 * Heroines are not in either map: they stay on hero8 until a later drop-in.
 */
const NAME_LOOK: Record<string, string> = {
  crosby: "crosby",
  beckett: "beckett",
  vance: "vance",
  inez: "inez",
  holt: "holt",
  rook: "rook",
};

/** Shared body when the name is not in NAME_LOOK. Neil (delinquent, m) is thug-m. */
const ARCH_LOOK: Record<string, string> = {
  "delinquent:m": "thug-m",
  "delinquent:f": "thug-f",
  "boxer:m": "boxer-m",
  "boxer:f": "boxer-f",
  "gunner:m": "gunner-m",
  "gunner:f": "gunner-f",
  "magician:m": "magician-m",
  "magician:f": "magician-f",
};

const CLIPS = ["idle", "walk", "attack", "cast"] as const satisfies readonly AnimClip[];
const SECTORS = 8;
/** Alpha at or above this belongs to the figure. Same cutoff as the renderer's stamp box. */
const FIGURE_ALPHA = 24;

interface LoadedFrame {
  image: HTMLImageElement;
  opaqueH: number;
}

type SetState =
  | { kind: "absent" }
  | { kind: "loading" }
  | { kind: "ready"; frames: Record<AnimClip, LoadedFrame[]>; figureH: number };

const sets = new Map<string, SetState>();

const REST: ReadonlyArray<readonly [AnimClip, number]> = CLIPS.flatMap((clip) => {
  const rows: Array<readonly [AnimClip, number]> = [];
  for (let sector = 0; sector < SECTORS; sector++) {
    if (clip === "idle" && sector === 0) continue;
    rows.push([clip, sector]);
  }
  return rows;
});

function frameSrc(look: string, clip: AnimClip, sector: number): string {
  return `./sprites/unit8/${look}/${clip}-${sector}.png`;
}

function slotIndex(clip: AnimClip, sector: number): number {
  return CLIPS.indexOf(clip) * SECTORS + sector;
}

/** Opaque pixel height. Null when the bitmap cannot be read or has no figure. */
function opaqueHeight(img: HTMLImageElement): number | null {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (!(w > 0 && h > 0) || typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  try {
    g.drawImage(img, 0, 0);
    const px = g.getImageData(0, 0, w, h).data;
    let y0 = h;
    let y1 = 0;
    for (let y = 0; y < h; y++) {
      const row = y * w * 4;
      for (let x = 0; x < w; x++) {
        if (px[row + x * 4 + 3] < FIGURE_ALPHA) continue;
        if (y < y0) y0 = y;
        if (y + 1 > y1) y1 = y + 1;
        break;
      }
    }
    if (!(y1 > y0)) return null;
    return y1 - y0;
  } catch {
    return null;
  }
}

/**
 * Try idle-0 first. One miss, or a frame with no opaque pixels, drops the whole look.
 * A partial set is never drawn.
 */
function ensureUnit8(look: string): void {
  if (sets.has(look)) return;
  if (typeof Image === "undefined") {
    sets.set(look, { kind: "absent" });
    return;
  }
  sets.set(look, { kind: "loading" });
  const fail = (): void => {
    sets.set(look, { kind: "absent" });
  };
  const take = (img: HTMLImageElement, done: (opaqueH: number) => void): void => {
    const finish = (): void => {
      try {
        if (sets.get(look)?.kind === "absent") return;
        const opaqueH = opaqueHeight(img);
        if (!(img.naturalWidth > 0) || opaqueH == null) {
          fail();
          return;
        }
        done(opaqueH);
      } catch {
        fail();
      }
    };
    if (typeof img.decode === "function") img.decode().then(finish).catch(finish);
    else finish();
  };
  const first = new Image();
  first.decoding = "async";
  first.addEventListener("error", fail);
  first.addEventListener("load", () => {
    take(first, (opaqueH) => {
      const slots: Array<LoadedFrame | undefined> = new Array(CLIPS.length * SECTORS);
      slots[0] = { image: first, opaqueH };
      let pending = REST.length;
      const finishSet = (): void => {
        if (sets.get(look)?.kind === "absent") return;
        const frames: Record<AnimClip, LoadedFrame[]> = { idle: [], walk: [], attack: [], cast: [] };
        let figureH = 0;
        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          if (!slot || !(slot.image.naturalWidth > 0) || !(slot.opaqueH > 0)) {
            fail();
            return;
          }
          if (slot.opaqueH > figureH) figureH = slot.opaqueH;
          frames[CLIPS[Math.floor(i / SECTORS)]].push(slot);
        }
        if (!(figureH > 0)) {
          fail();
          return;
        }
        for (const clip of CLIPS) {
          if (frames[clip].length !== SECTORS) {
            fail();
            return;
          }
        }
        sets.set(look, { kind: "ready", frames, figureH });
      };
      for (const [clip, sector] of REST) {
        const img = new Image();
        img.decoding = "async";
        img.addEventListener("error", fail);
        img.addEventListener("load", () => {
          take(img, (h) => {
            if (sets.get(look)?.kind === "absent") return;
            slots[slotIndex(clip, sector)] = { image: img, opaqueH: h };
            pending -= 1;
            if (pending === 0) finishSet();
          });
        });
        img.src = frameSrc(look, clip, sector);
      }
    });
  });
  first.src = frameSrc(look, "idle", 0);
}

/** Start every mapped look. A missing idle-0 marks that look absent and leaves the fallback in place. */
export function preloadUnit8(): void {
  const looks = new Set<string>([...Object.values(NAME_LOOK), ...Object.values(ARCH_LOOK)]);
  for (const look of looks) ensureUnit8(look);
}

/**
 * First word of the nameplate, lowercased, when it is a named look.
 * Otherwise the shared archetype+gender body. Otherwise null.
 */
export function resolveUnit8Look(u: Unit): string | null {
  const word = u.name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const named = word ? NAME_LOOK[word] : undefined;
  if (named) return named;
  return ARCH_LOOK[`${u.archetype}:${u.gender}`] ?? null;
}

/** True only when all 32 frames (4 clips × 8 sectors) have loaded. */
export function unit8Ready(look: string): boolean {
  ensureUnit8(look);
  return sets.get(look)?.kind === "ready";
}

/**
 * One painted frame. `figureH` is the tallest opaque span in the set, shared by every
 * frame so a raised arm does not rescale the body. Null until the set is ready.
 */
export function unit8Frame(
  look: string,
  clip: AnimClip,
  sector: number,
): { image: HTMLImageElement; figureH: number } | null {
  const state = sets.get(look);
  if (!state || state.kind !== "ready") return null;
  if (sector < 0 || sector >= SECTORS) return null;
  const frame = state.frames[clip][sector];
  if (!frame) return null;
  return { image: frame.image, figureH: state.figureH };
}
