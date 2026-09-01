import type { GameMap } from "./map";
import { canMelee, computeMoveRange, reconstructPath } from "./pathfinding";
import { strikeDamage } from "./combat";
import { manhattan, parseKey, type Diff, type Unit, type Vec2 } from "./types";

export interface AiPlan {
  unit: Unit;
  path: Vec2[];
  dest: Vec2;
  target: Unit | null;
}

export function planEnemy(
  unit: Unit,
  map: GameMap,
  units: Unit[],
  protectId: string | undefined,
  intel: Diff,
): AiPlan {
  if (intel === "L") return planLow(unit, map, units);
  if (intel === "H") return planHigh(unit, map, units, protectId);
  return planMid(unit, map, units, protectId);
}

function planLow(unit: Unit, map: GameMap, units: Unit[]): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const players = units.filter((u) => !u.dead && u.team === "player");
  let best: { dest: Vec2; target: Unit; score: number } | null = null;
  for (const [k] of field.cost) {
    const dest = parseKey(k);
    for (const p of players) {
      if (!canMelee(dest.x, dest.y, p.x, p.y, map, 2)) continue;
      const walk = manhattan(unit, dest);
      const near = manhattan(unit, p);
      const score = 400 - near * 20 - walk;
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }
  if (best) {
    return { unit, dest: best.dest, path: reconstructPath(field, best.dest), target: best.target };
  }
  const focus = nearestOf(unit, players);
  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestWalk = 1e9;
  if (focus) {
    for (const [k] of field.cost) {
      const d = parseKey(k);
      const s = manhattan(d, focus);
      if (s < bestWalk) {
        bestWalk = s;
        dest = d;
      }
    }
  }
  return { unit, dest, path: reconstructPath(field, dest), target: null };
}

function planMid(unit: Unit, map: GameMap, units: Unit[], protectId?: string): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const players = units.filter((u) => !u.dead && u.team === "player");
  let best: { dest: Vec2; target: Unit; score: number } | null = null;

  for (const [k] of field.cost) {
    const dest = parseKey(k);
    for (const p of players) {
      if (!canMelee(dest.x, dest.y, p.x, p.y, map, 2)) continue;
      const ghost = { ...unit, x: dest.x, y: dest.y };
      const { dmg, face, dh } = strikeDamage(ghost, p, map);
      let score = dmg * 10 + (p.hp <= dmg ? 80 : 0);
      if (p.role === "support") score += 6;
      if (p.id === protectId) score += 14;
      if (face === "back") score += 8;
      if (dh > 0) score += 4;
      if (unit.role === "elite") score += 2;
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }

  if (best) {
    return { unit, dest: best.dest, path: reconstructPath(field, best.dest), target: best.target };
  }

  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestDist = 99;
  for (const p of players) {
    for (const [k] of field.cost) {
      const d = parseKey(k);
      const dist = Math.abs(d.x - p.x) + Math.abs(d.y - p.y);
      const drop = map.heightAt(unit.x, unit.y) - map.heightAt(d.x, d.y);
      let score = dist;
      if (p.id === protectId) score -= 2;
      if (unit.role === "elite" && drop > 0) score += 1.4;
      if (score < bestDist) {
        bestDist = score;
        dest = d;
      }
    }
  }
  return { unit, dest, path: reconstructPath(field, dest), target: null };
}

function planHigh(unit: Unit, map: GameMap, units: Unit[], protectId?: string): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const players = units.filter((u) => !u.dead && u.team === "player");
  const hale = protectId ? players.find((p) => p.id === protectId) : undefined;
  const squad = players.filter((p) => !p.npc);
  const squadHp = squad.reduce((s, p) => s + p.hp, 0);
  const haleFaster = !!hale && hale.hp * 3 <= Math.max(1, squadHp);

  let best: { dest: Vec2; target: Unit; score: number } | null = null;
  for (const [k] of field.cost) {
    const dest = parseKey(k);
    for (const p of players) {
      if (!canMelee(dest.x, dest.y, p.x, p.y, map, 2)) continue;
      const ghost = { ...unit, x: dest.x, y: dest.y };
      const { dmg, face, dh } = strikeDamage(ghost, p, map);
      const hurt = 1 - p.hp / Math.max(1, p.maxHp);
      let score = dmg * 12 + hurt * 40;
      if (p.hp <= dmg) score += 110;
      if (face === "back") score += 22;
      if (face === "side") score += 12;
      if (dh > 0) score += 10;
      if (dh < 0) score -= 6;
      if (p.role === "support") score += 8;
      if (p.id === protectId) {
        score += haleFaster || p.hp <= 16 ? 56 : 20;
        if (p.hp <= dmg) score += 40;
      }
      if (unit.role === "elite") score += 3;
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }
  if (best) {
    return { unit, dest: best.dest, path: reconstructPath(field, best.dest), target: best.target };
  }

  const preferred =
    hale && (haleFaster || hale.hp / hale.maxHp < 0.65)
      ? hale
      : players.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];

  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestScore = -1e9;
  for (const [k] of field.cost) {
    const d = parseKey(k);
    const t = preferred ?? nearestOf(d, players);
    if (!t) continue;
    const dist = manhattan(d, t);
    let score = -dist * 10 + map.heightAt(d.x, d.y) * 5;
    if (canMelee(d.x, d.y, t.x, t.y, map, 2)) {
      const ghost = { ...unit, x: d.x, y: d.y };
      const { face, dh } = strikeDamage(ghost, t, map);
      if (face === "back") score += 24;
      if (face === "side") score += 12;
      if (dh > 0) score += 8;
    }
    if (t.id === protectId) score += 6;
    score += (1 - t.hp / Math.max(1, t.maxHp)) * 8;
    if (score > bestScore) {
      bestScore = score;
      dest = d;
    }
  }
  return { unit, dest, path: reconstructPath(field, dest), target: null };
}

function nearestOf(from: Vec2, players: Unit[]): Unit {
  return players.slice().sort((a, b) => manhattan(from, a) - manhattan(from, b))[0];
}
