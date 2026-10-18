import type { GameMap } from "./map";
import type { Forecast, Unit } from "./types";
import { dirVector, isHostilePair } from "./types";

/**
 * Which arc of the defender the attacker stands in, by angle from the defender's facing:
 * front within 45°, back within 45° of straight behind, side otherwise. Exactly 45° counts as
 * front and exactly 135° as side (a tie always goes to the lower-damage arc). Works for any facing
 * angle; with 4-way facing every adjacent melee tile is front, left side, right side or back.
 */
export function facingOf(defender: Unit, attacker: Unit): "front" | "side" | "back" {
  const dx = attacker.x - defender.x;
  const dy = attacker.y - defender.y;
  if (dx === 0 && dy === 0) return "front";
  const f = dirVector(defender.dir);
  const along = dx * f.x + dy * f.y;
  const across = Math.abs(dx * f.y - dy * f.x);
  const eps = 1e-9;
  if (along > 0 && along >= across - eps) return "front";
  if (along < 0 && -along > across + eps) return "back";
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
  if (skill) {
    switch (actor.skillKind) {
      case "strike":
        raw = Math.floor(raw * 1.4);
        break;
      case "slash":
        raw = Math.floor(raw * 1.3);
        break;
      case "spark":
        raw = actor.atk + (actor.atkBuff || 0) - Math.floor(target.def * 0.2) + (dh > 0 ? 2 : 0);
        break;
      case "pounce":
        raw = Math.floor(raw * 1.35);
        break;
      case "hook":
        raw = Math.floor(raw * 1.45);
        break;
      case "shot":
        raw = Math.floor(raw * 1.15);
        break;
      default:
        if (actor.role === "striker") raw = Math.floor(raw * 1.4);
    }
  }
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
  if (skill && actor.skillName) bits.push(actor.skillName);
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

export function makeSkillForecast(actor: Unit, target: Unit, map: GameMap): Forecast {
  const kind = actor.skillKind;
  if (kind === "halt" || actor.role === "controller") {
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
  if (kind === "heal" || actor.role === "support") {
    const heal = 16;
    return {
      kind: "skill",
      actor,
      target,
      label: `${actor.skillName}　${actor.name} → ${target.name}`,
      detail: `預覽　生命 ${target.hp} → ${Math.min(target.maxHp, target.hp + heal)} / ${target.maxHp}（+${Math.min(heal, target.maxHp - target.hp)}）`,
      dmg: 0,
      heal,
      skip: false,
      face: "front",
    };
  }
  return makeAttackForecast(actor, target, map, true);
}

export function canTargetUnit(actor: Unit, target: Unit): boolean {
  if (target.dead || target.id === actor.id) return false;
  if (actor.skillKind === "heal") return target.stance === "friendly" || target.team === "player";
  return isHostilePair(actor, target) || (actor.team === "player" && !actor.npc && target.stance !== "friendly");
}
