import type { Cam } from "./renderer";
import type { ItemStack } from "./items";
import type { Diff, Dir, Phase } from "./types";

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
}

export interface SaveGame {
  v: 1;
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
  log: string;
  selectedId: string | null;
  origin: { x: number; y: number } | null;
  originDir: Dir;
  m1DropGiven: boolean;
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
      slots[i] = s && s.v === 1 ? s : null;
    }
    const auto = p.autosave && p.autosave.v === 1 ? p.autosave : null;
    return { slots, autosave: auto };
  } catch {
    return empty();
  }
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
