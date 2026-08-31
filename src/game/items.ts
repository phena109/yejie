import type { Unit } from "./types";

export type ItemId = "bandage" | "stim";

export interface ItemDef {
  id: ItemId;
  name: string;
  hint: string;
}

export interface ItemStack {
  id: ItemId;
  qty: number;
}

export const BANDAGE_HEAL = 14;
export const STIM_ATK = 5;
export const MAX_STACK = 9;

export const ITEMS: Record<ItemId, ItemDef> = {
  bandage: { id: "bandage", name: "繃帶", hint: "回復 14 生命。" },
  stim: { id: "stim", name: "提神", hint: "下次攻擊 +5。" },
};

export const START_INVENTORY: ItemStack[] = [
  { id: "bandage", qty: 2 },
  { id: "stim", qty: 1 },
];

export function cloneInventory(src: ItemStack[]): ItemStack[] {
  return src.map((s) => ({ id: s.id, qty: s.qty })).filter((s) => s.qty > 0);
}

export function countItem(inv: ItemStack[], id: ItemId): number {
  return inv.find((s) => s.id === id)?.qty ?? 0;
}

export function addItem(inv: ItemStack[], id: ItemId, n = 1): number {
  const row = inv.find((s) => s.id === id);
  const cur = row?.qty ?? 0;
  const add = Math.min(n, MAX_STACK - cur);
  if (add <= 0) return 0;
  if (row) row.qty += add;
  else inv.push({ id, qty: add });
  return add;
}

export function takeItem(inv: ItemStack[], id: ItemId): boolean {
  const row = inv.find((s) => s.id === id);
  if (!row || row.qty <= 0) return false;
  row.qty -= 1;
  if (row.qty <= 0) {
    const i = inv.indexOf(row);
    if (i >= 0) inv.splice(i, 1);
  }
  return true;
}

export function itemAllies(units: Unit[]): Unit[] {
  return units.filter((u) => !u.dead && (u.team === "player" || u.npc));
}
