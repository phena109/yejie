import type { ItemId } from "./items";
import { key } from "./types";

export type ObjType = "kit" | "switch" | "van" | "barrel" | "crate" | "pallet";
export type ObjKind = "pickup" | "trigger" | "destructible" | "platform";

export interface ObjDef {
  x: number;
  y: number;
  type: ObjType;
  item?: ItemId;
  unblock?: Array<[number, number]>;
  healAdj?: number;
}

export interface BoardObj {
  id: string;
  x: number;
  y: number;
  type: ObjType;
  kind: ObjKind;
  hp: number;
  maxHp: number;
  gone: boolean;
  used: boolean;
  item?: ItemId;
  label: string;
  standH: number;
  unblock: Array<[number, number]>;
  healAdj: number;
}

export const BARREL_BLAST = 8;
export const BARREL_HP = 12;

export function makeObject(def: ObjDef, i: number): BoardObj {
  const id = `obj-${def.type}-${i}-${def.x}-${def.y}`;
  const base = {
    id,
    x: def.x,
    y: def.y,
    type: def.type,
    gone: false,
    used: false,
    item: def.item,
    unblock: def.unblock ?? [],
    healAdj: def.healAdj ?? 0,
  };
  switch (def.type) {
    case "kit":
      return {
        ...base,
        kind: "pickup",
        hp: 1,
        maxHp: 1,
        label: "急救包",
        standH: 0,
        item: def.item ?? "bandage",
      };
    case "switch":
      return { ...base, kind: "trigger", hp: 1, maxHp: 1, label: "開關", standH: 0 };
    case "van":
      return { ...base, kind: "trigger", hp: 1, maxHp: 1, label: "貨車門", standH: 0 };
    case "barrel":
      return { ...base, kind: "destructible", hp: BARREL_HP, maxHp: BARREL_HP, label: "油桶", standH: 0 };
    case "crate":
      return { ...base, kind: "platform", hp: 1, maxHp: 1, label: "貨箱", standH: 1 };
    case "pallet":
      return { ...base, kind: "platform", hp: 1, maxHp: 1, label: "棧板", standH: 1 };
  }
}

export function objBlocks(o: BoardObj): boolean {
  if (o.gone) return false;
  if (o.kind === "destructible") return true;
  if (o.type === "van" && !o.used) return true;
  return false;
}

export function objIndex(objs: BoardObj[]): Map<string, BoardObj> {
  const m = new Map<string, BoardObj>();
  for (const o of objs) {
    if (o.gone) continue;
    m.set(key(o.x, o.y), o);
  }
  return m;
}

export interface SavedObj {
  id: string;
  hp: number;
  gone: boolean;
  used: boolean;
}
