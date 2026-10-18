import type { Cam } from "./renderer";
import type { ItemStack } from "./items";
import type { SavedObj } from "./objects";
import type { AnimClip, Archetype, Behaviour, Diff, Dir, Gender, Phase, SkillKind, Stance, Team } from "./types";

export const SLOT_COUNT = 3;
const KEY = "yejie-v1";

export interface SavedUnit {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  dir: Dir;
  acted: boolean;
  skillUsed: boolean;
  skipNext: boolean;
  dead: boolean;
  movedThisTurn: boolean;
  actedThisTurn: boolean;
  atkBuff: number;
  team?: Team;
  stance?: Stance;
  behaviour?: Behaviour;
  archetype?: Archetype;
  gender?: Gender;
  skillKind?: SkillKind;
  rangeMin?: number;
  rangeMax?: number;
  anim?: AnimClip;
}

/**
 * Save format version.
 * v1: written by 0.1.0-0.6.18. Facing `dir` is 4-way (0 N, 1 E, 2 S, 3 W) before 0.6.8 and
 *     8-way (0 N, 1 NE, 2 E, 3 SE, 4 S, 5 SW, 6 W, 7 NW) from 0.6.8 to 0.6.18. Nothing in the
 *     save says which, so v1 is read as 8-way (the format every save of the last six weeks uses).
 * v2: 4-way facing again (0.6.19+).
 */
export const SAVE_VERSION = 2;

export interface SaveGame {
  v: 2;
  savedAt: number;
  missionIndex: number;
  missionName: string;
  phase: Phase;
  turn: number;
  intel: Diff;
  power: Diff;
  inventory: ItemStack[];
  units: SavedUnit[];
  cam: Cam;
  yaw: number;
  pitch: number;
  log: string;
  selectedId: string | null;
  origin: { x: number; y: number } | null;
  originDir: Dir;
  m1DropGiven: boolean;
  missionStartInventory: ItemStack[];
  objects?: SavedObj[];
}

export interface SaveStore {
  slots: Array<SaveGame | null>;
  autosave: SaveGame | null;
}

function empty(): SaveStore {
  return { slots: [null, null, null], autosave: null };
}

export function loadStore(): SaveStore {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const p = JSON.parse(raw) as Partial<SaveStore>;
    const slots: Array<SaveGame | null> = [null, null, null];
    for (let i = 0; i < SLOT_COUNT; i++) {
      const s = Array.isArray(p.slots) ? p.slots[i] : null;
      slots[i] = migrateSave(s);
    }
    const auto = migrateSave(p.autosave);
    return { slots, autosave: auto };
  } catch {
    return empty();
  }
}

/**
 * 8-way v1 facing to 4-way: cardinals map straight across (0→0 N, 2→1 E, 4→2 S, 6→3 W) and a
 * diagonal rounds clockwise to the next cardinal (1 NE→E, 3 SE→S, 5 SW→W, 7 NW→N).
 * Formula: ((d + 1) >> 1) mod 4.
 * A pre-0.6.8 4-way save read this way keeps N (0) and E (1) exactly; its S (2) and W (3) load
 * as E and S, one quarter turn off. Facing only, never position or HP, and only for saves made
 * before 7 Sep 2026, so that small risk is accepted over guessing per save.
 */
export function migrateDirV1(d: unknown): Dir {
  const n = Number.isInteger(d) ? (d as number) : 0;
  const e = ((n % 8) + 8) % 8;
  return (((e + 1) >> 1) % 4) as Dir;
}

function migrateSave(raw: unknown): SaveGame | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as { v?: unknown } & Partial<SaveGame>;
  if (s.v === SAVE_VERSION) return s as SaveGame;
  if (s.v !== 1) return null;
  const units = Array.isArray(s.units) ? s.units.map((u) => ({ ...u, dir: migrateDirV1(u.dir) })) : [];
  return { ...(s as SaveGame), v: 2, units, originDir: migrateDirV1(s.originDir) };
}

export function writeStore(store: SaveStore): void {
  localStorage.setItem(KEY, JSON.stringify(store));
}

export function allSaves(store: SaveStore): SaveGame[] {
  const out: SaveGame[] = [];
  if (store.autosave) out.push(store.autosave);
  for (const s of store.slots) if (s) out.push(s);
  return out;
}

export function latestSave(store: SaveStore): SaveGame | null {
  const all = allSaves(store);
  if (!all.length) return null;
  return all.reduce((a, b) => (a.savedAt >= b.savedAt ? a : b));
}

export function formatStamp(ms: number): string {
  try {
    return new Date(ms).toLocaleString("zh-Hant-TW", {
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
