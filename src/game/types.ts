export type Team = "player" | "enemy";
export type Role = "striker" | "controller" | "support" | "grunt" | "elite" | "civilian";
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
  skillUsed: boolean;
  skipNext: boolean;
  dead: boolean;
  lunge: number;
  movedThisTurn: boolean;
  actedThisTurn: boolean;
  npc: boolean;
  atkBuff: number;
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
  kind: "attack" | "skill";
  actor: Unit;
  target: Unit;
  label: string;
  detail: string;
  dmg: number;
  heal: number;
  skip: boolean;
  face: "front" | "side" | "back";
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
  | { kind: "tile"; tile: Tile };

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
  if (u.team !== "enemy") return;
  const m = POWER_MULT[power];
  u.maxHp = Math.max(1, Math.round(u.maxHp * m));
  u.hp = u.maxHp;
  u.atk = Math.max(1, Math.round(u.atk * m));
  u.def = Math.max(0, Math.round(u.def * m));
}
