import type { GameMap } from "./map";
import { DIRS, key, parseKey, type Unit, type Vec2 } from "./types";

export interface MoveField {
  cost: Map<string, number>;
  parent: Map<string, string | null>;
}

export function occupants(units: Unit[], ignore?: Unit): Map<string, Unit> {
  const m = new Map<string, Unit>();
  for (const u of units) {
    if (u.dead) continue;
    if (ignore && u.id === ignore.id) continue;
    m.set(key(u.x, u.y), u);
  }
  return m;
}

export function computeMoveRange(
  unit: Unit,
  map: GameMap,
  units: Unit[],
): MoveField {
  const occ = occupants(units, unit);
  const cost = new Map<string, number>();
  const parent = new Map<string, string | null>();
  const start = key(unit.x, unit.y);
  cost.set(start, 0);
  parent.set(start, null);

  const q: Vec2[] = [{ x: unit.x, y: unit.y }];
  while (q.length) {
    q.sort((a, b) => (cost.get(key(a.x, a.y)) ?? 99) - (cost.get(key(b.x, b.y)) ?? 99));
    const cur = q.shift()!;
    const ck = key(cur.x, cur.y);
    const cCost = cost.get(ck) ?? 0;
    const h0 = map.heightAt(cur.x, cur.y);

    for (const d of DIRS) {
      const nx = cur.x + d.x;
      const ny = cur.y + d.y;
      if (!map.walkable(nx, ny)) continue;
      const h1 = map.heightAt(nx, ny);
      const dh = h1 - h0;
      if (Math.abs(dh) > unit.jmp) continue;
      const who = occ.get(key(nx, ny));
      if (who && who.team !== unit.team) continue;
      const step = 1 + (dh > 0 ? dh : 0);
      const nCost = cCost + step;
      if (nCost > unit.mov) continue;
      const nk = key(nx, ny);
      const prev = cost.get(nk);
      if (prev !== undefined && prev <= nCost) continue;
      cost.set(nk, nCost);
      parent.set(nk, ck);
      q.push({ x: nx, y: ny });
    }
  }

  // Cannot stop on an ally. Keep those tiles out of the stoppable set
  // by deleting them from cost (path may still pass through via parent).
  const stoppable = new Map<string, number>();
  for (const [k, c] of cost) {
    const p = parseKey(k);
    const who = occ.get(k);
    if (who && who.id !== unit.id) continue;
    if (!map.walkable(p.x, p.y)) continue;
    stoppable.set(k, c);
  }
  stoppable.set(start, 0);

  return { cost: stoppable, parent };
}

export function reconstructPath(field: MoveField, dest: Vec2): Vec2[] {
  const path: Vec2[] = [];
  let k = key(dest.x, dest.y);
  if (!field.cost.has(k) && !field.parent.has(k)) return path;
  while (k) {
    path.push(parseKey(k));
    const p = field.parent.get(k);
    if (!p) break;
    k = p;
  }
  path.reverse();
  return path;
}

export function canMelee(
  ax: number,
  ay: number,
  tx: number,
  ty: number,
  map: GameMap,
  maxDh: number,
): boolean {
  if (Math.abs(ax - tx) + Math.abs(ay - ty) !== 1) return false;
  const dh = Math.abs(map.heightAt(ax, ay) - map.heightAt(tx, ty));
  return dh <= maxDh;
}

export function meleeTiles(
  x: number,
  y: number,
  map: GameMap,
  units: Unit[],
  team: Unit["team"],
  maxDh: number,
): Unit[] {
  const hits: Unit[] = [];
  for (const d of DIRS) {
    const nx = x + d.x;
    const ny = y + d.y;
    if (!canMelee(x, y, nx, ny, map, maxDh)) continue;
    const u = units.find((u) => !u.dead && u.x === nx && u.y === ny && u.team !== team);
    if (u) hits.push(u);
  }
  return hits;
}

export function skillTargets(
  actor: Unit,
  map: GameMap,
  units: Unit[],
): Unit[] {
  if (actor.role === "striker") {
    return meleeTiles(actor.x, actor.y, map, units, actor.team, 3);
  }
  if (actor.role === "controller") {
    return units.filter((u) => {
      if (u.dead || u.team === actor.team) return false;
      const mdh = Math.abs(map.heightAt(actor.x, actor.y) - map.heightAt(u.x, u.y));
      return Math.abs(actor.x - u.x) + Math.abs(actor.y - u.y) <= 3 && mdh <= 3;
    });
  }
  if (actor.role === "support") {
    return units.filter((u) => {
      if (u.dead || u.team !== actor.team) return false;
      const dist = Math.abs(actor.x - u.x) + Math.abs(actor.y - u.y);
      return dist <= 1;
    });
  }
  return [];
}

export function attackableFrom(
  actor: Unit,
  map: GameMap,
  units: Unit[],
  maxDh = 2,
): Set<string> {
  const s = new Set<string>();
  for (const u of meleeTiles(actor.x, actor.y, map, units, actor.team, maxDh)) {
    s.add(key(u.x, u.y));
  }
  return s;
}
