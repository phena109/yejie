import type { GameMap } from "./map";
import { DIRS, canPassThrough, isHostilePair, key, parseKey, type Unit, type Vec2 } from "./types";

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

export function computeMoveRange(unit: Unit, map: GameMap, units: Unit[]): MoveField {
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
      if (who && !canPassThrough(unit, who)) continue;
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

export function inAttackRange(actor: Unit, ax: number, ay: number, tx: number, ty: number, map: GameMap): boolean {
  const dist = Math.abs(ax - tx) + Math.abs(ay - ty);
  const min = actor.rangeMin ?? 1;
  const max = actor.rangeMax ?? 1;
  if (dist < min || dist > max) return false;
  const dh = Math.abs(map.heightAt(ax, ay) - map.heightAt(tx, ty));
  const maxDh = Math.max(2, actor.jmp + 1);
  return dh <= maxDh;
}

export function canMelee(ax: number, ay: number, tx: number, ty: number, map: GameMap, maxDh: number): boolean {
  if (Math.abs(ax - tx) + Math.abs(ay - ty) !== 1) return false;
  const dh = Math.abs(map.heightAt(ax, ay) - map.heightAt(tx, ty));
  return dh <= maxDh;
}

export function attackTargets(actor: Unit, map: GameMap, units: Unit[], from?: Vec2): Unit[] {
  const ax = from?.x ?? actor.x;
  const ay = from?.y ?? actor.y;
  const hits: Unit[] = [];
  for (const u of units) {
    if (u.dead || u.id === actor.id) continue;
    const hostile =
      isHostilePair(actor, u) || (actor.team === "player" && !actor.npc && u.stance !== "friendly");
    if (!hostile) continue;
    if (!inAttackRange(actor, ax, ay, u.x, u.y, map)) continue;
    hits.push(u);
  }
  return hits;
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
    const u = units.find((un) => !un.dead && un.x === nx && un.y === ny && un.team !== team);
    if (u) hits.push(u);
  }
  return hits;
}

export function skillTargets(actor: Unit, map: GameMap, units: Unit[]): Unit[] {
  const kind = actor.skillKind;
  if (kind === "heal" || actor.role === "support") {
    return units.filter((u) => {
      if (u.dead) return false;
      if (u.stance !== "friendly" && u.team !== "player") return false;
      const dist = Math.abs(actor.x - u.x) + Math.abs(actor.y - u.y);
      return dist <= 1;
    });
  }
  if (kind === "halt" || actor.role === "controller") {
    return units.filter((u) => {
      if (u.dead || u.stance === "friendly") return false;
      const mdh = Math.abs(map.heightAt(actor.x, actor.y) - map.heightAt(u.x, u.y));
      return Math.abs(actor.x - u.x) + Math.abs(actor.y - u.y) <= 3 && mdh <= 3;
    });
  }
  if (kind === "spark" || kind === "shot") {
    return units.filter((u) => {
      if (u.dead || u.id === actor.id) return false;
      if (u.stance === "friendly") return false;
      const dist = Math.abs(actor.x - u.x) + Math.abs(actor.y - u.y);
      const max = kind === "spark" ? 3 : 4;
      const min = kind === "shot" ? 2 : 1;
      if (dist < min || dist > max) return false;
      const dh = Math.abs(map.heightAt(actor.x, actor.y) - map.heightAt(u.x, u.y));
      return dh <= 3;
    });
  }
  if (kind === "strike" || kind === "slash" || kind === "pounce" || kind === "hook" || actor.role === "striker") {
    const maxDh = kind === "strike" ? 3 : 2;
    return attackTargets({ ...actor, rangeMin: 1, rangeMax: 1 }, map, units).filter((u) => {
      const dh = Math.abs(map.heightAt(actor.x, actor.y) - map.heightAt(u.x, u.y));
      return dh <= maxDh;
    });
  }
  return attackTargets(actor, map, units);
}

export function attackableFrom(actor: Unit, map: GameMap, units: Unit[]): Set<string> {
  const s = new Set<string>();
  for (const u of attackTargets(actor, map, units)) s.add(key(u.x, u.y));
  return s;
}

export function attackArea(actor: Unit, map: GameMap): Set<string> {
  const s = new Set<string>();
  const min = actor.rangeMin ?? 1;
  const max = actor.rangeMax ?? 1;
  for (let y = 0; y < map.h; y++) {
    for (let x = 0; x < map.w; x++) {
      const dist = Math.abs(actor.x - x) + Math.abs(actor.y - y);
      if (dist >= min && dist <= max && map.inBounds(x, y)) s.add(key(x, y));
    }
  }
  return s;
}

export function skillArea(actor: Unit, map: GameMap): Set<string> {
  const kind = actor.skillKind;
  if (kind === "halt" || actor.role === "controller") {
    const s = new Set<string>();
    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        if (Math.abs(actor.x - x) + Math.abs(actor.y - y) <= 3) s.add(key(x, y));
      }
    }
    return s;
  }
  if (kind === "heal" || actor.role === "support") {
    const s = new Set<string>();
    for (const d of DIRS) {
      const nx = actor.x + d.x;
      const ny = actor.y + d.y;
      if (map.inBounds(nx, ny)) s.add(key(nx, ny));
    }
    s.add(key(actor.x, actor.y));
    return s;
  }
  if (kind === "spark") {
    const ghost = { ...actor, rangeMin: 1, rangeMax: 3 };
    return attackArea(ghost, map);
  }
  if (kind === "shot") {
    const ghost = { ...actor, rangeMin: 2, rangeMax: 4 };
    return attackArea(ghost, map);
  }
  return attackArea({ ...actor, rangeMin: 1, rangeMax: 1 }, map);
}
