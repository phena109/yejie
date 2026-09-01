export type Team = "player" | "enemy" | "neutral";
export type Stance = "friendly" | "hostile" | "neutral";
export type Behaviour = "combat" | "flee" | "idle" | "indiscriminate";
export type Archetype =
  | "mara"
  | "dana"
  | "priya"
  | "hale"
  | "crosby"
  | "beckett"
  | "delinquent"
  | "magician"
  | "wolverine"
  | "boxer"
  | "gunner"
  | "worker"
  | "official";
export type SkillKind = "strike" | "halt" | "heal" | "slash" | "spark" | "pounce" | "hook" | "shot" | "";
export type AnimClip = "idle" | "walk" | "attack" | "cast";
export type Gender = "f" | "m";
export type Role =
  | "striker"
  | "controller"
  | "support"
  | "grunt"
  | "elite"
  | "civilian"
  | "delinquent"
  | "magician"
  | "wolverine"
  | "boxer"
  | "gunner"
  | "worker";
export type Terrain = "street" | "stairs" | "roof";
export type Dir = 0 | 1 | 2 | 3;
export type Prop = "stall" | "ac" | "lamp" | "crate";
export type Diff = "L" | "M" | "H";

export type Phase =
  | "title"
  | "briefing"
  | "select"
  | "skillAim"
  | "itemAim"
  | "forecast"
  | "enemy"
  | "victory"
  | "defeat";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Unit {
  id: string;
  name: string;
  title: string;
  team: Team;
  role: Role;
  archetype: Archetype;
  stance: Stance;
  behaviour: Behaviour;
  gender: Gender;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  mov: number;
  jmp: number;
  dir: Dir;
  acted: boolean;
  skillName: string;
  skillHint: string;
  skillKind: SkillKind;
  skillUsed: boolean;
  skipNext: boolean;
  dead: boolean;
  lunge: number;
  movedThisTurn: boolean;
  actedThisTurn: boolean;
  npc: boolean;
  atkBuff: number;
  rangeMin: number;
  rangeMax: number;
  anim: AnimClip;
  animStart: number;
}

export interface Tile {
  x: number;
  y: number;
  h: number;
  terrain: Terrain;
  blocked: boolean;
  prop?: Prop;
}

export interface Forecast {
  kind: "attack" | "skill" | "object";
  actor: Unit;
  target: Unit;
  label: string;
  detail: string;
  dmg: number;
  heal: number;
  skip: boolean;
  face: "front" | "side" | "back";
  objectId?: string;
}

export interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  born: number;
  life: number;
}

export type Inspect =
  | { kind: "unit"; unit: Unit }
  | { kind: "tile"; tile: Tile }
  | { kind: "object"; id: string };

export const DIRS: Vec2[] = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
];

export const POWER_MULT: Record<Diff, number> = { L: 0.75, M: 1, H: 1.35 };

export const DIFF_LABEL: Record<Diff, string> = {
  L: "L 低",
  M: "M 中",
  H: "H 高",
};

export function key(x: number, y: number): string {
  return `${x},${y}`;
}

export function parseKey(s: string): Vec2 {
  const [xs, ys] = s.split(",");
  return { x: Number(xs), y: Number(ys) };
}

export function dirFromTo(a: Vec2, b: Vec2): Dir {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 1 : 3;
  return dy >= 0 ? 2 : 0;
}

export function manhattan(a: Vec2, b: Vec2): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Rotate grid coords around map centre. yaw is radians; 0 matches the old facing. */
export function yawPoint(x: number, y: number, yaw: number, w: number, h: number): Vec2 {
  const cx = (w - 1) / 2;
  const cy = (h - 1) / 2;
  const dx = x - cx;
  const dy = y - cy;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return { x: dx * c + dy * s, y: -dx * s + dy * c };
}

export function yawDir(dx: number, dy: number, yaw: number): Vec2 {
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  return { x: dx * c + dy * s, y: -dx * s + dy * c };
}

export function nextYaw(yaw: number): number {
  return yaw + Math.PI / 2;
}

export function scaleEnemy(u: Unit, power: Diff): void {
  if (u.stance !== "hostile" && u.team !== "enemy") return;
  const m = POWER_MULT[power];
  u.maxHp = Math.max(1, Math.round(u.maxHp * m));
  u.hp = u.maxHp;
  u.atk = Math.max(1, Math.round(u.atk * m));
  u.def = Math.max(0, Math.round(u.def * m));
}

export function stanceOf(u: Unit): Stance {
  return u.stance;
}

export function factionColor(u: Unit): string {
  const s = stanceOf(u);
  if (s === "friendly") return "#5ad0ff";
  if (s === "hostile") return "#ff4d6d";
  return "#e0c45a";
}

export function isPlayerControlled(u: Unit): boolean {
  return u.team === "player" && !u.npc && !u.dead;
}

export function canPassThrough(mover: Unit, who: Unit): boolean {
  if (who.dead) return true;
  return mover.team === who.team || (stanceOf(mover) === "friendly" && stanceOf(who) === "friendly");
}

export function isHostilePair(a: Unit, b: Unit): boolean {
  if (a.dead || b.dead || a.id === b.id) return false;
  if (a.behaviour === "indiscriminate" || b.behaviour === "indiscriminate") return true;
  const sa = stanceOf(a);
  const sb = stanceOf(b);
  if (sa === "hostile" && sb === "friendly") return true;
  if (sa === "friendly" && sb === "hostile") return true;
  if (sa === "neutral" && sb === "hostile") return true;
  if (sa === "hostile" && sb === "neutral") return true;
  return false;
}

export function provoke(u: Unit): void {
  u.stance = "hostile";
  u.team = "enemy";
  if (u.behaviour === "idle" || u.behaviour === "flee") u.behaviour = "combat";
}
