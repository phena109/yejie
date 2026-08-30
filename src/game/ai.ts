import type { GameMap } from "./map";
import { canMelee, computeMoveRange, reconstructPath } from "./pathfinding";
import { strikeDamage } from "./combat";
import { parseKey, type Unit, type Vec2 } from "./types";

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
): AiPlan {
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
      if (face === "back") score += 8;
      if (dh > 0) score += 4;
      if (unit.role === "elite") score += 2;
      if (!best || score > best.score) best = { dest, target: p, score };
    }
  }

  if (best) {
    return {
      unit,
      dest: best.dest,
      path: reconstructPath(field, best.dest),
      target: best.target,
    };
  }

  // Close on nearest player; elite prefers not to drop from roof unless needed.
  let dest: Vec2 = { x: unit.x, y: unit.y };
  let bestDist = 99;
  for (const p of players) {
    for (const [k] of field.cost) {
      const d = parseKey(k);
      const dist = Math.abs(d.x - p.x) + Math.abs(d.y - p.y);
      const drop = map.heightAt(unit.x, unit.y) - map.heightAt(d.x, d.y);
      let score = dist;
      if (unit.role === "elite" && drop > 0) score += 1.4;
      if (score < bestDist) {
        bestDist = score;
        dest = d;
      }
    }
  }
  return { unit, dest, path: reconstructPath(field, dest), target: null };
}
