import type { GameMap } from "./map";
import { computeMoveRange, inAttackRange, reconstructPath, skillTargets } from "./pathfinding";
import { strikeDamage } from "./combat";
import { isHostilePair, manhattan, parseKey, stanceOf, type Diff, type Unit, type Vec2 } from "./types";

export interface AiPlan {
  unit: Unit;
  path: Vec2[];
  dest: Vec2;
  target: Unit | null;
  useSkill: boolean;
}

function foesOf(unit: Unit, units: Unit[]): Unit[] {
  if (unit.behaviour === "indiscriminate") {
    return units.filter((u) => !u.dead && u.id !== unit.id);
  }
  if (unit.behaviour === "flee" || unit.behaviour === "idle") return [];
  return units.filter((u) => !u.dead && u.id !== unit.id && isHostilePair(unit, u));
}

function nearestOf(from: Vec2, list: Unit[]): Unit | null {
  if (!list.length) return null;
  return list.slice().sort((a, b) => manhattan(from, a) - manhattan(from, b))[0];
}

export function planEnemy(
  unit: Unit,
  map: GameMap,
  units: Unit[],
  protectId: string | undefined,
  intel: Diff,
): AiPlan {
  if (unit.behaviour === "idle" || unit.mov <= 0) {
    return { unit, dest: { x: unit.x, y: unit.y }, path: [{ x: unit.x, y: unit.y }], target: null, useSkill: false };
  }
  if (unit.behaviour === "flee") return planFlee(unit, map, units);
  if (intel === "L") return planLow(unit, map, units);
  if (intel === "H") return planHigh(unit, map, units, protectId);
  return planMid(unit, map, units, protectId);
}

function planFlee(unit: Unit, map: GameMap, units: Unit[]): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const threats = units.filter((u) => !u.dead && u.id !== unit.id && stanceOf(u) === "hostile");
  let dest: Vec2 = { x: unit.x, y: unit.y };
  let best = -1;
  for (const [k] of field.cost) {
    const d = parseKey(k);
    const near = nearestOf(d, threats);
    const dist = near ? manhattan(d, near) : 8;
    const edge = Math.min(d.x, d.y, map.w - 1 - d.x, map.h - 1 - d.y);
    const score = dist * 10 - edge;
    if (score > best) {
      best = score;
      dest = d;
    }
  }
  return { unit, dest, path: reconstructPath(field, dest), target: null, useSkill: false };
}

function pickSkill(unit: Unit, dest: Vec2, target: Unit, map: GameMap, units: Unit[], intel: Diff): boolean {
  if (unit.skillUsed || !unit.skillName) return false;
  const ghost = { ...unit, x: dest.x, y: dest.y };
  const ts = skillTargets(ghost, map, units);
  if (!ts.some((t) => t.id === target.id)) return false;
  if (unit.skillKind === "heal") return false;
  const chance = intel === "H" ? 0.8 : intel === "L" ? 0.25 : 0.55;
  if (unit.skillKind === "spark" || unit.skillKind === "shot") return true;
  return Math.random() < chance;
}

function planLow(unit: Unit, map: GameMap, units: Unit[]): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const foes = foesOf(unit, units);
  let best: { dest: Vec2; target: Unit; score: number } | null = null;
  for (const [k] of field.cost) {
    const dest = parseKey(k);
    for (const p of foes) {
      if (!inAttackRange(unit, dest.x, dest.y, p.x, p.y, map)) continue;
      const walk = manhattan(unit, dest);
      const near = manhattan(unit, p);
      const score = 400 - near * 20 - walk;
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }
  if (best) {
    return {
      unit,
      dest: best.dest,
      path: reconstructPath(field, best.dest),
      target: best.target,
      useSkill: pickSkill(unit, best.dest, best.target, map, units, "L"),
    };
  }
  const focus = nearestOf(unit, foes);
  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestWalk = 1e9;
  if (focus) {
    for (const [k] of field.cost) {
      const d = parseKey(k);
      let s = manhattan(d, focus);
      if (unit.rangeMin > 1) s = Math.abs(s - unit.rangeMin);
      if (s < bestWalk) {
        bestWalk = s;
        dest = d;
      }
    }
  }
  return { unit, dest, path: reconstructPath(field, dest), target: null, useSkill: false };
}

function planMid(unit: Unit, map: GameMap, units: Unit[], protectId?: string): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const foes = foesOf(unit, units);
  let best: { dest: Vec2; target: Unit; score: number } | null = null;

  for (const [k] of field.cost) {
    const dest = parseKey(k);
    for (const p of foes) {
      if (!inAttackRange(unit, dest.x, dest.y, p.x, p.y, map)) continue;
      const ghost = { ...unit, x: dest.x, y: dest.y };
      const { dmg, face, dh } = strikeDamage(ghost, p, map);
      let score = dmg * 10 + (p.hp <= dmg ? 80 : 0);
      if (p.role === "support") score += 6;
      if (p.id === protectId) score += 14;
      if (face === "back") score += 8;
      if (dh > 0) score += 4;
      if (unit.role === "elite") score += 2;
      if (unit.rangeMin > 1) {
        const dist = manhattan(dest, p);
        if (dist >= unit.rangeMin) score += 6;
        if (dist === 1 && unit.archetype === "gunner") score -= 12;
      }
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }

  if (best) {
    return {
      unit,
      dest: best.dest,
      path: reconstructPath(field, best.dest),
      target: best.target,
      useSkill: pickSkill(unit, best.dest, best.target, map, units, "M"),
    };
  }

  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestDist = 99;
  for (const p of foes) {
    for (const [k] of field.cost) {
      const d = parseKey(k);
      let dist = Math.abs(d.x - p.x) + Math.abs(d.y - p.y);
      if (unit.rangeMin > 1) dist = Math.abs(dist - Math.max(2, unit.rangeMin));
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
  return { unit, dest, path: reconstructPath(field, dest), target: null, useSkill: false };
}

function planHigh(unit: Unit, map: GameMap, units: Unit[], protectId?: string): AiPlan {
  const field = computeMoveRange(unit, map, units);
  const foes = foesOf(unit, units);
  const hale = protectId ? foes.find((p) => p.id === protectId) : undefined;
  const squad = foes.filter((p) => !p.npc);
  const squadHp = squad.reduce((s, p) => s + p.hp, 0);
  const haleFaster = !!hale && hale.hp * 3 <= Math.max(1, squadHp);

  let best: { dest: Vec2; target: Unit; score: number } | null = null;
  for (const [k] of field.cost) {
    const dest = parseKey(k);
    for (const p of foes) {
      if (!inAttackRange(unit, dest.x, dest.y, p.x, p.y, map)) continue;
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
      if (unit.rangeMin > 1 && manhattan(dest, p) === 1 && unit.archetype === "gunner") score -= 20;
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }
  if (best) {
    return {
      unit,
      dest: best.dest,
      path: reconstructPath(field, best.dest),
      target: best.target,
      useSkill: pickSkill(unit, best.dest, best.target, map, units, "H"),
    };
  }

  const preferred =
    hale && (haleFaster || hale.hp / hale.maxHp < 0.65)
      ? hale
      : foes.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];

  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestScore = -1e9;
  for (const [k] of field.cost) {
    const d = parseKey(k);
    const t = preferred ?? nearestOf(d, foes);
    if (!t) continue;
    let dist = manhattan(d, t);
    if (unit.rangeMin > 1) dist = Math.abs(dist - Math.max(2, unit.rangeMin));
    let score = -dist * 10 + map.heightAt(d.x, d.y) * 5;
    if (inAttackRange(unit, d.x, d.y, t.x, t.y, map)) {
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
  return { unit, dest, path: reconstructPath(field, dest), target: null, useSkill: false };
}

