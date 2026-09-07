import * as THREE from "three";
import type { AnimClip, Archetype, Dir, Gender, Unit } from "./types";
import { buildMaraSoft } from "./maraSoft";

export interface Proj { x: number; y: number; d: number }
export type ProjectFn = (lx: number, ly: number, lz: number) => Proj;
export const CHAR_H = 2.15;
export const ATTACK_MS = 420;
export const CAST_MS = 520;

interface Palette { skin: number; shadow: number; hair: number; shirt: number; pants: number; accent: number; metal: number; shoe: number }
function palette(a: Archetype, g: Gender): Palette {
  const f = g === "f";
  switch (a) {
    case "mara": return { skin: 0xc69476, shadow: 0x9d6d55, hair: 0x202c48, shirt: 0x214d78, pants: 0x182236, accent: 0xe0bd4c, metal: 0xbfc8d4, shoe: 0x171b28 };
    case "dana": return { skin: 0xb27c5a, shadow: 0x8f573f, hair: 0x5b3928, shirt: 0x2d5268, pants: 0x202b3a, accent: 0xd9b94e, metal: 0xc0b39d, shoe: 0x191b25 };
    case "priya": return { skin: 0x965f40, shadow: 0x70412f, hair: 0x1d1310, shirt: 0xe9e5d8, pants: 0x28545e, accent: 0xc94b50, metal: 0xd8dce2, shoe: 0x20202a };
    case "hale": return { skin: 0xd2aa84, shadow: 0xa77c5d, hair: 0x746653, shirt: 0x414756, pants: 0x292d38, accent: 0xffc857, metal: 0xb7ae9c, shoe: 0x181a22 };
    case "crosby": return { skin: 0xbc9470, shadow: 0x8f614d, hair: 0x30251f, shirt: 0x642d38, pants: 0x321b26, accent: 0xf0c052, metal: 0xd1ad55, shoe: 0x17131d };
    case "beckett": return { skin: 0xb08462, shadow: 0x87513d, hair: 0x3e251f, shirt: 0x9a343c, pants: 0x301c24, accent: 0xff8c46, metal: 0xc8b896, shoe: 0x17151b };
    case "delinquent": return { skin: f ? 0xc69678 : 0xb48c6c, shadow: 0x8b5d4c, hair: f ? 0x552e6d : 0x201a28, shirt: 0x4f644c, pants: 0x292e36, accent: 0xc14f67, metal: 0xa8aab6, shoe: 0x171a20 };
    case "magician": return { skin: f ? 0xcda88a : 0xba8e6e, shadow: 0x95664f, hair: f ? 0x7431a0 : 0x281536, shirt: 0x7038a7, pants: 0x261a46, accent: 0xe5bd55, metal: 0xe0c878, shoe: 0x171126 };
    case "wolverine": return { skin: 0x785a46, shadow: 0x58402f, hair: 0x4b3528, shirt: 0x76583e, pants: 0x503a2c, accent: 0xe07a3c, metal: 0xc8c0ae, shoe: 0x201914 };
    case "boxer": return { skin: 0xaa7858, shadow: 0x7d503d, hair: 0x1b1518, shirt: 0xe8e8ec, pants: 0x252632, accent: 0xd9404c, metal: 0xbcbec8, shoe: 0x171820 };
    case "gunner": return { skin: f ? 0xc89e80 : 0xb28868, shadow: 0x8b634e, hair: f ? 0x36261e : 0x211d22, shirt: 0x314638, pants: 0x28332e, accent: 0x65bc78, metal: 0x84958b, shoe: 0x161c1a };
    case "worker": return { skin: 0xbe9676, shadow: 0x8c634f, hair: 0x302822, shirt: 0xf0aa36, pants: 0x35445d, accent: 0x386ea9, metal: 0xaeb4bd, shoe: 0x1b2029 };
    default: return { skin: 0xc8a282, shadow: 0x96715a, hair: 0x29262e, shirt: 0xf0ece6, pants: 0x242c40, accent: 0x5278b0, metal: 0xbab19b, shoe: 0x171923 };
  }
}
interface Mats { skin: THREE.MeshStandardMaterial; shadow: THREE.MeshStandardMaterial; hair: THREE.MeshStandardMaterial; shirt: THREE.MeshStandardMaterial; pants: THREE.MeshStandardMaterial; accent: THREE.MeshStandardMaterial; metal: THREE.MeshStandardMaterial; shoe: THREE.MeshStandardMaterial; white: THREE.MeshStandardMaterial; dark: THREE.MeshStandardMaterial }
function material(color: number, roughness = 0.75, metalness = 0): THREE.MeshStandardMaterial { return new THREE.MeshStandardMaterial({ color, roughness, metalness, flatShading: false }); }
function mats(p: Palette): Mats {
  return { skin: material(p.skin, 0.82), shadow: material(p.shadow, 0.88), hair: material(p.hair, 0.7), shirt: material(p.shirt), pants: material(p.pants, 0.84), accent: material(p.accent, 0.58), metal: material(p.metal, 0.28, 0.45), shoe: material(p.shoe, 0.9), white: material(0xf7f4ed, 0.62), dark: material(0x16131b, 0.82) };
}

export function clipDuration(clip: AnimClip): number { return clip === "attack" ? ATTACK_MS : clip === "cast" ? CAST_MS : 0; }
function activeClip(u: Unit, now: number): { clip: AnimClip; t: number } {
  const d = clipDuration(u.anim);
  if (d > 0) { const clock = typeof performance !== "undefined" ? performance.now() : now; const t = (clock - u.animStart) / d; if (t < 1) return { clip: u.anim, t: Math.max(0, t) }; }
  return u.anim === "walk" ? { clip: "walk", t: (now / 280) % 1 } : { clip: "idle", t: (now / 900) % 1 };
}

/** Local +Y is the unit's forward direction, matching DIRS in types.ts. */
function rotFacing(x: number, y: number, dir: Dir): { x: number; y: number } {
  const f = [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }][dir];
  return { x: -f.y * x + f.x * y, y: f.x * x + f.y * y };
}
export function localToGrid(lx: number, ly: number, dir: Dir): { x: number; y: number } { return rotFacing(lx, ly, dir); }
export function rigDrawHeight(zoom: number): number { return 58 * zoom; }

interface RigParts { root: THREE.Group; hip: THREE.Group; torso: THREE.Group; head: THREE.Group; armL: THREE.Group; armR: THREE.Group; legL: THREE.Group; legR: THREE.Group; weap: THREE.Group; tris: number }
function add(parent: THREE.Object3D, child: THREE.Object3D, x: number, y: number, z: number): void { child.position.set(x, y, z); parent.add(child); }
function capsule(m: THREE.Material, r: number, l: number, radial = 12, caps = 4): THREE.Mesh { return new THREE.Mesh(new THREE.CapsuleGeometry(r, l, caps, radial), m); }
function sphere(m: THREE.Material, r: number, w = 16, h = 12): THREE.Mesh { return new THREE.Mesh(new THREE.SphereGeometry(r, w, h), m); }
function box(m: THREE.Material, w: number, h: number, d: number): THREE.Mesh { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 2, 2), m); }
function cone(m: THREE.Material, r: number, h: number): THREE.Mesh { return new THREE.Mesh(new THREE.ConeGeometry(r, h, 20, 5), m); }
function eye(head: THREE.Group, m: Mats, x: number, y: number, z: number): void { add(head, sphere(m.white, 0.075, 10, 8), x, y, z); add(head, sphere(m.dark, 0.043, 8, 6), x, y, z + 0.06); }
function face(head: THREE.Group, m: Mats, a: Archetype, g: Gender, r: number): void {
  eye(head, m, -r * 0.32, 0.03, r * 0.89); eye(head, m, r * 0.32, 0.03, r * 0.89);
  add(head, sphere(m.shadow, 0.035, 8, 6), 0, -0.075, r * 0.94);
  add(head, box(m.dark, g === "f" ? 0.13 : 0.16, 0.025, 0.02), 0, -0.16, r * 0.91);
  if (g === "f") { add(head, sphere(m.accent, 0.035, 8, 6), -r * 0.56, -0.11, r * 0.85); add(head, sphere(m.accent, 0.035, 8, 6), r * 0.56, -0.11, r * 0.85); }
  if (a === "hale") { const beard = sphere(m.hair, r * 0.48, 12, 8); beard.scale.set(1, 0.55, 0.62); add(head, beard, 0, -r * 0.35, r * 0.63); }
}
function hairGeneric(head: THREE.Group, m: Mats, g: Gender, r: number): void {
  const scalp = sphere(m.hair, r * 1.07, 28, 20); scalp.scale.set(1.08, 1.02, 0.91); add(head, scalp, 0, r * 0.18, -r * 0.11);
  if (g === "f") {
    for (const x of [-1, 1]) { const lock = capsule(m.hair, r * 0.105, r * 0.58, 14, 5); lock.rotation.z = x * 0.08; add(head, lock, x * r * 0.82, -r * 0.13, r * 0.27); }
    const fringe = capsule(m.hair, r * 0.13, r * 0.62, 14, 5); fringe.rotation.z = Math.PI / 2; add(head, fringe, 0, r * 0.41, r * 0.66);
  }
}

function hairMara(head: THREE.Group, m: Mats, r: number): void {
  // One broad, vertically deep dome gives the bob a single chin-length silhouette.
  // Keep the nape in this mass so it cannot read as a detached bun or rear ball.
  const dome = sphere(m.hair, r * 1.08, 32, 24); dome.scale.set(1.22, 1.42, 1.00); add(head, dome, 0, -r * 0.10, -r * 0.10);
  // Dense shelf of full bangs, sitting just above the eyes rather than as five loose tufts.
  const bangShelf = capsule(m.hair, r * 0.16, r * 1.18, 20, 6); bangShelf.rotation.z = Math.PI / 2; add(head, bangShelf, 0, r * 0.27, r * 0.78);
  for (const x of [-1, 1]) {
    const lock = capsule(m.hair, r * 0.14, r * 0.78, 18, 6); lock.rotation.z = x * 0.06; add(head, lock, x * r * 0.91, -r * 0.25, r * 0.27);
  }
}

function hairDana(head: THREE.Group, m: Mats, r: number): void {
  // Lift the scalp into a pulled-up crown; the ponytail starts high behind it.
  const scalp = sphere(m.hair, r * 1.08, 32, 24); scalp.scale.set(1.10, 1.12, 0.92); add(head, scalp, 0, r * 0.25, -r * 0.10);
  const ponyRoot = capsule(m.hair, r * 0.34, r * 0.38, 20, 6); ponyRoot.rotation.x = -0.18; add(head, ponyRoot, 0, r * 0.66, -r * 0.52);
  // A single high, thick teardrop hangs from the crown instead of a nape bun.
  const pony = capsule(m.hair, r * 0.50, r * 1.58, 24, 8); pony.rotation.x = -0.10; add(head, pony, 0, -r * 0.16, -r * 1.02);
  const tip = sphere(m.hair, r * 0.58, 32, 24); tip.scale.set(1.10, 1.12, 0.94); add(head, tip, 0, -r * 0.90, -r * 1.06);
  // Uneven downward cones make a visibly jagged fringe across the forehead.
  for (const [x, y, h, dx] of [[-0.78, 0.52, 0.43, -0.16], [-0.52, 0.55, 0.30, -0.08], [-0.26, 0.56, 0.46, -0.03], [0, 0.55, 0.33, 0], [0.27, 0.56, 0.49, 0.04], [0.53, 0.54, 0.34, 0.09], [0.79, 0.50, 0.44, 0.16]] as const) directionalCone(head, m.hair, r * 0.17, r * h, x * r, y * r, r * 0.68, dx, -1, 0.24);
  for (const x of [-1, 1]) {
    const frame = capsule(m.hair, r * 0.12, r * 0.86, 18, 6); frame.rotation.z = x * 0.08; add(head, frame, x * r * 0.86, -r * 0.20, r * 0.28);
  }
}

function hairPriya(head: THREE.Group, m: Mats, r: number): void {
  const scalp = sphere(m.hair, r * 1.05, 28, 20); scalp.scale.set(1.07, 1.00, 0.89); add(head, scalp, 0, r * 0.20, -r * 0.13);
  const bun = sphere(m.hair, r * 0.96, 28, 20); bun.scale.set(1.10, 1.02, 0.94); add(head, bun, r * 0.30, r * 0.72, -r * 0.96);
  const bunCrown = sphere(m.hair, r * 0.48, 24, 18); bunCrown.scale.set(1.15, 0.88, 1.00); add(head, bunCrown, r * 0.28, r * 0.42, -r * 0.78);
  const bunRoot = capsule(m.hair, r * 0.26, r * 0.40, 16, 6); add(head, bunRoot, 0, r * 0.10, -r * 0.54);
  for (const x of [-1, 1]) {
    const sweep = capsule(m.hair, r * 0.115, r * 0.76, 14, 5); sweep.rotation.z = x * 0.82; add(head, sweep, x * r * 0.27, r * 0.43, r * 0.54);
    const jaw = capsule(m.hair, r * 0.105, r * 0.72, 14, 5); jaw.rotation.z = x * 0.05; add(head, jaw, x * r * 0.82, -r * 0.17, r * 0.28);
  }
  const part = capsule(m.hair, r * 0.075, r * 0.42, 12, 4); part.rotation.z = Math.PI / 2; add(head, part, 0, r * 0.48, r * 0.58);
}

function directionalCone(head: THREE.Group, m: THREE.Material, radius: number, height: number, x: number, y: number, z: number, dx: number, dy: number, dz: number): void {
  const direction = new THREE.Vector3(dx, dy, dz).normalize(); const spike = cone(m, radius, height); spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  add(head, spike, x + direction.x * height * 0.25, y + direction.y * height * 0.25, z + direction.z * height * 0.25);
}

function hairDelinquent(head: THREE.Group, m: Mats, r: number): void {
  const mass = sphere(m.hair, r * 1.08, 28, 20); mass.scale.set(1.12, 1.04, 0.92); add(head, mass, 0, r * 0.18, -r * 0.12);
  const rearMass = sphere(m.hair, r * 0.62, 24, 18); rearMass.scale.set(1.30, 0.82, 1.02); add(head, rearMass, 0, r * 0.04, -r * 0.73);
  const spikes: Array<[number, number, number, number, number, number, number]> = [
    [0, 0.72, 0.16, 0.15, 0.42, 1.00, 0.04], [-0.40, 0.63, 0.30, 0.14, 0.56, 0.86, 0.20], [0.42, 0.64, 0.30, 0.14, 0.56, 0.86, 0.20],
    [-0.82, 0.40, 0.02, 0.13, 0.90, 0.16, 0.02], [0.82, 0.40, 0.02, 0.13, 0.90, 0.16, 0.02],
    [-0.62, 0.10, -1.22, 0.12, 0.25, 0.15, -1.00], [0, 0.10, -1.28, 0.14, 0.00, 0.12, -1.00], [0.62, 0.10, -1.22, 0.12, -0.25, 0.15, -1.00],
    [-0.40, -0.12, -1.20, 0.11, 0.20, -0.12, -0.96], [0.40, -0.12, -1.20, 0.11, -0.20, -0.12, -0.96],
    [-0.64, 0.48, 0.52, 0.13, -0.20, 0.75, 0.56], [0.64, 0.48, 0.52, 0.13, -0.20, 0.75, 0.56],
  ];
  for (const [x, y, z, radius, dx, dy, dz] of spikes) directionalCone(head, m.hair, r * radius, r * 0.70, x * r, y * r, z * r, dx, dy, dz);
  for (const [x, y, dx, dy] of [[-0.90, 0.35, -0.75, 0.55], [-0.58, 0.70, -0.50, 0.90], [-0.20, 0.86, -0.18, 1.00], [0.20, 0.86, 0.18, 1.00], [0.58, 0.70, 0.50, 0.90], [0.90, 0.35, 0.75, 0.55], [-0.82, -0.10, -0.70, -0.45], [0.82, -0.10, 0.70, -0.45]] as const) directionalCone(head, m.hair, r * 0.21, r * 0.92, x * r, y * r, -r * 1.34, dx, dy, -0.58);
  for (const [x, y, dx, dy] of [[-0.72, 0.28, -0.65, 0.55], [-0.38, 0.48, -0.35, 0.82], [0, 0.56, 0, 0.95], [0.38, 0.48, 0.35, 0.82], [0.72, 0.28, 0.65, 0.55], [-0.72, -0.18, -0.45, -0.35], [0.72, -0.18, 0.45, -0.35]] as const) directionalCone(head, m.hair, r * 0.15, r * 0.62, x * r, y * r, -r * 1.18, dx, dy, -0.68);
  for (const x of [-0.55, -0.18, 0.18, 0.55]) directionalCone(head, m.hair, r * 0.11, r * 0.34, x * r, r * 0.48, r * 0.66, x * 0.22, -0.70, 0.68);
}

function hair(head: THREE.Group, m: Mats, a: Archetype, g: Gender, r: number): void {
  if (a === "mara") hairMara(head, m, r); else if (a === "dana") hairDana(head, m, r); else if (a === "priya") hairPriya(head, m, r); else if (a === "delinquent") hairDelinquent(head, m, r); else hairGeneric(head, m, g, r);
  if (a === "crosby") { const hood = sphere(m.shirt, r * 1.22, 24, 18); hood.scale.set(1.04, 0.92, 1.04); add(head, hood, 0, 0, -r * 0.12); }
  if (a === "magician") { add(head, new THREE.Mesh(new THREE.CylinderGeometry(r * 1.25, r * 1.25, 0.08, 24), m.accent), 0, r * 0.86, 0); add(head, cone(m.shirt, r * 0.65, r), 0, r * 1.22, 0); }
  if (a === "worker") { const helm = sphere(m.accent, r * 1.16, 24, 18); helm.scale.set(1.05, 0.42, 1.05); add(head, helm, 0, r * 0.77, 0); add(head, box(m.accent, r * 1.35, 0.06, r * 0.55), 0, r * 0.67, r * 0.42); }
}

function gear(m: Mats, a: Archetype, w: THREE.Group): void {
  if (a === "mara" || a === "delinquent") add(w, capsule(m.metal, 0.055, 0.58, 10, 3), 0, -0.18, 0.12);
  else if (a === "gunner" || a === "crosby" || a === "beckett") { const gun = capsule(m.metal, 0.07, 0.38, 10, 3); gun.rotation.x = Math.PI / 2; add(w, gun, 0, 0.02, 0.2); add(w, box(m.shoe, 0.12, 0.12, 0.34), 0, -0.03, -0.08); }
  else if (a === "magician") { add(w, capsule(m.metal, 0.045, 0.72, 10, 3), 0, -0.16, 0.08); add(w, sphere(m.accent, 0.11, 14, 10), 0, 0.26, 0.08); }
  else if (a === "official") add(w, box(m.white, 0.25, 0.32, 0.04), 0.04, 0, 0.15);
  else if (a === "priya") { add(w, box(m.white, 0.28, 0.18, 0.16), 0, 0, 0.1); add(w, box(m.accent, 0.05, 0.2, 0.17), 0, 0, 0.19); }
  else if (a === "hale") add(w, box(m.accent, 0.12, 0.12, 0.28), 0, 0, 0.16);
  else if (a === "dana") add(w, capsule(m.metal, 0.045, 0.48, 10, 3), 0, -0.1, 0.12);
}
function countTris(root: THREE.Object3D): number { let n = 0; root.traverse((o) => { if ((o as THREE.Mesh).isMesh) { const g = (o as THREE.Mesh).geometry as THREE.BufferGeometry; n += g.index ? g.index.count / 3 : (g.attributes.position?.count ?? 0) / 3; } }); return Math.round(n); }

function humanoid(a: Archetype, g: Gender): RigParts {
  const m = mats(palette(a, g)); const root = new THREE.Group(); const hip = new THREE.Group(); const torso = new THREE.Group(); const head = new THREE.Group(); const armL = new THREE.Group(); const armR = new THREE.Group(); const legL = new THREE.Group(); const legR = new THREE.Group(); const weap = new THREE.Group();
  const f = g === "f"; root.add(hip); hip.position.y = 0.64;
  for (const [leg, x] of [[legL, -0.16], [legR, 0.16]] as const) { leg.position.x = x; add(leg, capsule(m.pants, 0.115, f ? 0.31 : 0.34), 0, -0.16, 0); add(leg, capsule(m.pants, 0.1, 0.22), 0, -0.41, 0); const foot = capsule(m.shoe, 0.12, 0.16); foot.scale.set(1, 0.55, 1.45); add(leg, foot, 0, -0.59, 0.08); hip.add(leg); }
  add(hip, capsule(m.pants, 0.27, 0.12, 14, 4), 0, -0.02, 0); hip.add(torso); torso.position.y = 0.03;
  const chest = capsule(m.shirt, f ? 0.285 : 0.31, 0.34, 14, 5); chest.scale.z = f ? 0.76 : 0.82; add(torso, chest, 0, 0.26, 0);
  if (a === "priya" || a === "official") add(torso, box(m.accent, 0.06, 0.26, 0.035), 0, 0.28, 0.255);
  if (a === "worker") add(torso, box(m.accent, 0.38, 0.27, 0.05), 0, 0.25, 0.25);
  if (a === "boxer") { add(torso, box(m.accent, 0.25, 0.16, 0.04), -0.22, 0.19, 0.24); add(torso, box(m.accent, 0.25, 0.16, 0.04), 0.22, 0.19, 0.24); }
  for (const [arm, x] of [[armL, -0.39], [armR, 0.39]] as const) { arm.position.set(x, 0.43, 0); add(arm, capsule(m.shirt, 0.105, 0.2), 0, -0.11, 0); add(arm, capsule(m.skin, 0.09, 0.19), 0, -0.32, 0); add(arm, sphere(m.skin, 0.1, 12, 8), 0, -0.46, 0); if (a === "boxer") add(arm, sphere(m.accent, 0.14, 14, 10), 0, -0.49, 0.02); torso.add(arm); }
  armR.add(weap); weap.position.set(0, -0.44, 0.13); gear(m, a, weap);
  torso.add(head); head.position.y = 0.76; const r = f ? 0.36 : 0.34; add(head, sphere(m.skin, r, 20, 14), 0, 0, 0); face(head, m, a, g, r); hair(head, m, a, g, r);
  const wrap = new THREE.Group(); wrap.add(root); root.position.y = 0.08; return { root: wrap, hip, torso, head, armL, armR, legL, legR, weap, tris: countTris(wrap) };
}
function wolverine(): RigParts {
  const m = mats(palette("wolverine", "m")); const root = new THREE.Group(); const hip = new THREE.Group(); const torso = new THREE.Group(); const head = new THREE.Group(); const armL = new THREE.Group(); const armR = new THREE.Group(); const legL = new THREE.Group(); const legR = new THREE.Group(); const weap = new THREE.Group();
  root.add(hip); hip.position.y = 0.44; const body = capsule(m.shirt, 0.38, 0.52, 16, 5); body.rotation.z = Math.PI / 2; add(hip, body, 0, 0.18, 0.02); hip.add(torso); torso.position.set(0, 0.38, 0.2); torso.add(head);
  add(head, sphere(m.skin, 0.31, 18, 12), 0, 0.1, 0.31); add(head, sphere(m.shadow, 0.22, 14, 10), 0, 0.02, 0.57); eye(head, m, -0.1, 0.16, 0.58); eye(head, m, 0.1, 0.16, 0.58);
  for (const x of [-0.2, 0.2]) add(head, cone(m.hair, 0.12, 0.28), x, 0.38, 0.25);
  for (const [part, x, z] of [[legL, -0.22, 0.28], [legR, 0.22, 0.28], [armL, -0.22, -0.28], [armR, 0.22, -0.28]] as const) { part.position.set(x, 0, z); add(part, capsule(m.pants, 0.12, 0.28), 0, -0.12, 0); hip.add(part); }
  const tail = capsule(m.hair, 0.07, 0.4, 10, 3); tail.rotation.x = -0.35; add(hip, tail, 0, 0.18, -0.55); armR.add(weap);
  return { root, hip, torso, head, armL, armR, legL, legR, weap, tris: countTris(root) };
}
interface Template { parts: RigParts }
const templates = new Map<string, Template>();
function template(a: Archetype, g: Gender): Template { const k = `${a}:${g}`; const old = templates.get(k); if (old) return old; const result = { parts: a === "mara" ? buildMaraSoft() : a === "wolverine" ? wolverine() : humanoid(a, g) }; templates.set(k, result); return result; }
function pose(p: RigParts, a: Archetype, clip: AnimClip, t: number, now: number): void {
  const { hip, torso, head, armL, armR, legL, legR, weap } = p;
  for (const part of [hip, torso, head, armL, armR, legL, legR, weap]) part.rotation.set(0, 0, 0);
  hip.position.y = a === "wolverine" ? 0.44 : 0.64; torso.position.y = a === "wolverine" ? 0.38 : 0.03;
  if (clip === "idle") { const bob = Math.sin(now / 420) * 0.025; torso.position.y += bob; head.rotation.z = Math.sin(now / 900) * 0.035; armL.rotation.x = 0.06 + bob; armR.rotation.x = 0.06 - bob; return; }
  if (clip === "walk") { const s = Math.sin(t * Math.PI * 2); const c = Math.cos(t * Math.PI * 2); legL.rotation.x = s * 0.5; legR.rotation.x = -s * 0.5; armL.rotation.x = -s * 0.38; armR.rotation.x = s * 0.38; torso.position.y += Math.abs(c) * 0.035; hip.position.y += Math.abs(s) * 0.018; return; }
  if (clip === "attack") { const hit = t < 0.62; if (a === "wolverine") { torso.rotation.x = hit ? -0.28 : 0; armL.rotation.x = hit ? -0.75 : 0.15; armR.rotation.x = hit ? -0.75 : 0.15; hip.position.z = hit ? 0.14 : 0; } else if (a === "boxer") { armR.rotation.x = t < 0.35 ? -0.35 : hit ? -1.35 : -0.25; armR.rotation.z = hit ? -0.28 : 0; torso.rotation.y = hit ? -0.22 : 0; armL.rotation.x = -0.55; } else { armR.rotation.x = t < 0.35 ? -0.45 : hit ? -1.35 : -0.35; armR.rotation.z = hit ? -0.32 : 0; weap.rotation.x = hit ? -0.45 : 0; torso.rotation.y = hit ? -0.16 : 0; armL.rotation.x = -0.25; } return; }
  const up = t < 0.66; armL.rotation.x = up ? -2.0 : -1.25; armR.rotation.x = up ? -2.0 : -1.25; armL.rotation.z = 0.36; armR.rotation.z = -0.36; head.rotation.x = up ? -0.12 : 0; torso.position.y += up ? 0.05 : 0.015;
}

let renderer: THREE.WebGLRenderer | null = null; let scene: THREE.Scene | null = null; let camera: THREE.OrthographicCamera | null = null; let stage: THREE.Group | null = null; let glReady = false;
function ensureGL(): boolean {
  if (glReady && renderer) return true; if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas"); renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: "low-power" }); renderer.setSize(192, 240, false); renderer.setPixelRatio(1); renderer.setClearColor(0, 0); renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene(); const aspect = 192 / 240; camera = new THREE.OrthographicCamera(-1.35 * aspect, 1.35 * aspect, 1.35, -1.35, 0.1, 40); stage = new THREE.Group(); scene.add(stage); scene.add(new THREE.HemisphereLight(0xfff3df, 0x222844, 1.35)); const key = new THREE.DirectionalLight(0xffe7c7, 1.7); key.position.set(3.5, 6, 4.5); scene.add(key); const fill = new THREE.DirectionalLight(0x93b5ff, 0.65); fill.position.set(-4, 2, -3); scene.add(fill); glReady = true; return true;
  } catch { return false; }
}
function dirAngle(dir: Dir): number { return dir * Math.PI / 4; }
const PORTRAIT_PITCH = 30;
function placeCamera(yaw: number, pitchDeg: number): void { if (!camera) return; const pitch = pitchDeg * Math.PI / 180; const d = 4.2; const cp = Math.cos(pitch); const sp = Math.sin(pitch); camera.position.set(Math.sin(yaw) * cp * d, sp * d + 0.85, Math.cos(yaw) * cp * d); camera.lookAt(0, 0.88, 0); camera.updateProjectionMatrix(); }
export function drawRig(ctx: CanvasRenderingContext2D, project: ProjectFn, u: Unit, now: number, zoom: number, camYaw = 0): void {
  // The portrait is a fixed-size billboard. Projected crown/feet distance changes with map pitch.
  const feet = project(0, 0, 0); const scrH = rigDrawHeight(zoom) * (u.role === "elite" ? 1.12 : 1); const scrW = scrH * 192 / 240;
  if (!ensureGL() || !renderer || !scene || !camera || !stage) { ctx.fillStyle = "#6a7080"; ctx.beginPath(); ctx.ellipse(feet.x, feet.y - scrH * 0.35, scrW * 0.22, scrH * 0.35, 0, 0, Math.PI * 2); ctx.fill(); return; }
  const t = template(u.archetype, u.gender); const active = activeClip(u, now); pose(t.parts, u.archetype, active.clip, active.t, now);
  while (stage.children.length) stage.remove(stage.children[0]); if (t.parts.root.parent) t.parts.root.parent.remove(t.parts.root); stage.add(t.parts.root);
  // +Z is the model face; rotate it to the exact grid direction before projection.
  // Grid facing only: model turns with u.dir. Portrait camera stays fixed so map yaw never spins the unit.
  t.parts.root.rotation.set(0, dirAngle(u.dir), 0); placeCamera(0, PORTRAIT_PITCH); renderer.render(scene, camera);
  ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(renderer.domElement, feet.x - scrW * 0.5, feet.y - scrH * 0.88, scrW, scrH); ctx.restore(); void zoom; void camYaw;
}
export function precacheRigs(): void { if (!ensureGL()) return; const all: Archetype[] = ["mara", "dana", "priya", "hale", "crosby", "beckett", "delinquent", "magician", "wolverine", "boxer", "gunner", "worker", "official"]; for (const a of all) for (const g of ["f", "m"] as Gender[]) template(a, g); }
export function meshTris(a: Archetype, g: Gender): number { return template(a, g).parts.tris; }
