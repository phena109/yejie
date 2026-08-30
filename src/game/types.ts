export type Team = "player" | "enemy";
export type Role = "striker" | "controller" | "support" | "grunt" | "elite" | "civilian";
export type Terrain = "street" | "stairs" | "roof";
export type Dir = 0 | 1 | 2 | 3;
export type Prop = "stall" | "ac" | "lamp" | "crate";
export type Yaw = 0 | 1 | 2 | 3;

export type Phase =
  | "briefing"
  | "select"
  | "skillAim"
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

/** Rotate grid coords 90° CW per yaw step so iso diamonds and hit-tests stay aligned. */
export function yawPoint(x: number, y: number, yaw: Yaw, w: number, h: number): Vec2 {
  switch (yaw) {
    case 0:
      return { x, y };
    case 1:
      return { x: y, y: w - 1 - x };
    case 2:
      return { x: w - 1 - x, y: h - 1 - y };
    case 3:
      return { x: h - 1 - y, y: x };
  }
}

export function yawDir(dx: number, dy: number, yaw: Yaw): Vec2 {
  switch (yaw) {
    case 0:
      return { x: dx, y: dy };
    case 1:
      return { x: dy, y: -dx };
    case 2:
      return { x: -dx, y: -dy };
    case 3:
      return { x: -dy, y: dx };
  }
}

export function nextYaw(yaw: Yaw): Yaw {
  return ((yaw + 1) % 4) as Yaw;
}
