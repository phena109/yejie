import { type Prop, type Terrain, type Tile, key } from "./types";

export const MAP_W = 10;
export const MAP_H = 12;

const HEIGHT_ROWS = [
  "2222222222",
  "2222222222",
  "2211111122",
  "0011111100",
  "0000000000",
  "0000000000",
  "0000000000",
  "0000000000",
  "2110000112",
  "2200000022",
  "2200000022",
  "0000000000",
];

const BLOCKED: Array<[number, number, Prop]> = [
  [1, 1, "ac"],
  [8, 1, "ac"],
  [1, 10, "ac"],
  [8, 10, "ac"],
  [1, 5, "stall"],
  [2, 5, "stall"],
  [6, 5, "stall"],
  [7, 5, "stall"],
  [3, 7, "stall"],
  [4, 7, "stall"],
];

const LAMPS: Array<[number, number]> = [
  [0, 6],
  [9, 6],
  [5, 4],
];

export class GameMap {
  readonly w = MAP_W;
  readonly h = MAP_H;
  readonly tiles: Tile[][] = [];

  constructor() {
    const block = new Map<string, Prop>();
    for (const [x, y, p] of BLOCKED) block.set(key(x, y), p);
    const lamps = new Set(LAMPS.map(([x, y]) => key(x, y)));

    for (let y = 0; y < MAP_H; y++) {
      const row: Tile[] = [];
      for (let x = 0; x < MAP_W; x++) {
        const height = Number(HEIGHT_ROWS[y][x]);
        let terrain: Terrain = "street";
        if (height === 2) terrain = "roof";
        else if (height === 1) terrain = "stairs";
        const prop = block.get(key(x, y)) ?? (lamps.has(key(x, y)) ? "lamp" : undefined);
        row.push({
          x,
          y,
          h: height,
          terrain,
          blocked: prop === "stall" || prop === "ac",
          prop,
        });
      }
      this.tiles.push(row);
    }
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }

  tile(x: number, y: number): Tile | null {
    if (!this.inBounds(x, y)) return null;
    return this.tiles[y][x];
  }

  heightAt(x: number, y: number): number {
    return this.tile(x, y)?.h ?? 0;
  }

  walkable(x: number, y: number): boolean {
    const t = this.tile(x, y);
    return !!t && !t.blocked;
  }
}
