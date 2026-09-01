import type { Unit } from "./types";

const NAMES = ["mara", "dana", "priya", "enemy", "hale"] as const;
type SpriteName = (typeof NAMES)[number];

const images: Partial<Record<SpriteName, HTMLImageElement>> = {};
let loading: Promise<void> | null = null;

function srcFor(name: SpriteName): string {
  const base = import.meta.env.BASE_URL || "./";
  return `${base}sprites/${name}.png`;
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
            images[name] = img;
            resolve();
          };
          img.onerror = () => resolve();
          img.src = srcFor(name);
        }),
    ),
  ).then(() => undefined);
  return loading;
}

export function spriteOf(u: Unit): HTMLImageElement | null {
  const name = spriteName(u);
  const img = images[name];
  if (img && img.complete && img.naturalWidth > 0) return img;
  return null;
}

export function spriteFacesLeft(u: Unit): boolean {
  return spriteName(u) === "enemy";
}

function spriteName(u: Unit): SpriteName {
  if (u.id === "mara" || u.id === "dana" || u.id === "priya" || u.id === "hale") return u.id;
  return "enemy";
}
