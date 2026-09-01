import { makeObject, objBlocks, objIndex, type BoardObj, type ObjDef } from "./objects";
import { type Prop, type Terrain, type Tile, key } from "./types";

export type MapTheme = "roof" | "alley" | "warehouse" | "street" | "plaza";

export interface MapDef {
  w: number;
  h: number;
  theme?: MapTheme;
  heights: string[];
  blocked: Array<[number, number, Prop]>;
  lamps?: Array<[number, number]>;
  objects?: ObjDef[];
}

export class GameMap {
  readonly w: number;
  readonly h: number;
  readonly theme: MapTheme;
  readonly tiles: Tile[][] = [];
  objects: BoardObj[] = [];

  constructor(def: MapDef) {
    this.w = def.w;
    this.h = def.h;
    this.theme = def.theme ?? "roof";
    const block = new Map<string, Prop>();
    for (const [x, y, p] of def.blocked) block.set(key(x, y), p);
    const lamps = new Set((def.lamps ?? []).map(([x, y]) => key(x, y)));

    for (let y = 0; y < def.h; y++) {
      const row: Tile[] = [];
      const line = def.heights[y] ?? "";
      for (let x = 0; x < def.w; x++) {
        const height = Number(line[x] ?? "0");
        let terrain: Terrain = "street";
        if (height === 2) terrain = "roof";
        else if (height === 1) terrain = "stairs";
        const prop = block.get(key(x, y)) ?? (lamps.has(key(x, y)) ? "lamp" : undefined);
        row.push({
          x,
          y,
          h: height,
          terrain,
          blocked: prop === "stall" || prop === "ac" || prop === "crate",
          prop,
        });
      }
      this.tiles.push(row);
    }
    this.objects = (def.objects ?? []).map((o, i) => makeObject(o, i));
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }

  tile(x: number, y: number): Tile | null {
    if (!this.inBounds(x, y)) return null;
    return this.tiles[y][x];
  }

  objAt(x: number, y: number): BoardObj | undefined {
    return objIndex(this.objects).get(key(x, y));
  }

  heightAt(x: number, y: number): number {
    const t = this.tile(x, y);
    if (!t) return 0;
    const o = this.objAt(x, y);
    const extra = o && !o.gone && o.kind === "platform" ? o.standH : 0;
    return t.h + extra;
  }

  walkable(x: number, y: number): boolean {
    const t = this.tile(x, y);
    if (!t || t.blocked) return false;
    const o = this.objAt(x, y);
    if (o && objBlocks(o)) return false;
    return true;
  }

  unblock(x: number, y: number): void {
    const t = this.tile(x, y);
    if (!t) return;
    t.blocked = false;
    if (t.prop === "crate" || t.prop === "stall") t.prop = undefined;
  }
}
