import type { GameMap } from "./map";
import type { Forecast, Unit } from "./types";
import { DIRS } from "./types";

export function facingOf(defender: Unit, attacker: Unit): "front" | "side" | "back" {
  const dx = attacker.x - defender.x;
  const dy = attacker.y - defender.y;
  const f = DIRS[defender.dir];
  const dot = dx * f.x + dy * f.y;
  if (dot > 0) return "front";
  if (dot < 0) return "back";
  return "side";
}

export function strikeDamage(
  actor: Unit,
  target: Unit,
  map: GameMap,
  skill = false,
): { dmg: number; face: "front" | "side" | "back"; dh: number } {
  const face = facingOf(target, actor);
  let raw = actor.atk + (actor.atkBuff || 0) - Math.floor(target.def * 0.5);
  const dh = map.heightAt(actor.x, actor.y) - map.heightAt(target.x, target.y);
  if (dh > 0) raw += 3;
  if (dh < 0) raw -= 2;
  if (face === "side") raw = Math.floor(raw * 1.25);
  if (face === "back") raw = Math.floor(raw * 1.5);
  if (skill && actor.role === "striker") raw = Math.floor(raw * 1.4);
  return { dmg: Math.max(1, raw), face, dh };
}

const FACE_LABEL = { front: "正面", side: "側面 +25%", back: "背面 +50%" };

export function makeAttackForecast(
  actor: Unit,
  target: Unit,
  map: GameMap,
  skill = false,
): Forecast {
  const { dmg, face, dh } = strikeDamage(actor, target, map, skill);
  const bits: string[] = [FACE_LABEL[face]];
  if (dh > 0) bits.push("高地 +3");
  if (dh < 0) bits.push("仰攻 −2");
  if (skill && actor.role === "striker") bits.push("重擊 +40%");
  return {
    kind: skill ? "skill" : "attack",
    actor,
    target,
    label: skill ? `${actor.skillName}　${actor.name} → ${target.name}` : `${actor.name} → ${target.name}`,
    detail: `${dmg} 傷害　${bits.join("　")}`,
    dmg,
    heal: 0,
    skip: false,
    face,
  };
}

export function makeSkillForecast(
  actor: Unit,
  target: Unit,
  map: GameMap,
): Forecast {
  if (actor.role === "striker") return makeAttackForecast(actor, target, map, true);
  if (actor.role === "controller") {
    return {
      kind: "skill",
      actor,
      target,
      label: `${actor.skillName}　${actor.name} → ${target.name}`,
      detail: "下回合無法行動　並造成 4 傷害",
      dmg: 4,
      heal: 0,
      skip: true,
      face: facingOf(target, actor),
    };
  }
  const heal = 16;
  return {
    kind: "skill",
    actor,
    target,
    label: `${actor.skillName}　${actor.name} → ${target.name}`,
    detail: `回復 ${heal} 生命`,
    dmg: 0,
    heal,
    skip: false,
    face: "front",
  };
}
