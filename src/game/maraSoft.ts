import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export interface MaraSoftParts {
  root: THREE.Group;
  hip: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  legL: THREE.Group;
  legR: THREE.Group;
  weap: THREE.Group;
  tris: number;
}

interface SoftMats {
  skin: THREE.MeshStandardMaterial; shadow: THREE.MeshStandardMaterial; hair: THREE.MeshStandardMaterial;
  uniform: THREE.MeshStandardMaterial; pants: THREE.MeshStandardMaterial; accent: THREE.MeshStandardMaterial;
  belt: THREE.MeshStandardMaterial; boot: THREE.MeshStandardMaterial; eyeWhite: THREE.MeshStandardMaterial;
  eyeBlue: THREE.MeshStandardMaterial; eyeDark: THREE.MeshStandardMaterial;
}

function mat(color: number, roughness = 0.75, metalness = 0): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, flatShading: false });
}
function materials(): SoftMats {
  return {
    skin: mat(0xc69476, 0.82), shadow: mat(0x9d6d55, 0.88), hair: mat(0x202c48, 0.68),
    uniform: mat(0x214d78, 0.76), pants: mat(0x182236, 0.84), accent: mat(0xe0bd4c, 0.58),
    belt: mat(0x171b28, 0.9), boot: mat(0x111722, 0.9), eyeWhite: mat(0xf7f4ed, 0.62),
    eyeBlue: mat(0x3b9bd4, 0.5), eyeDark: mat(0x10182d, 0.7),
  };
}
function add(parent: THREE.Object3D, child: THREE.Object3D, x: number, y: number, z: number): void {
  child.position.set(x, y, z); parent.add(child);
}
function lathe(material: THREE.Material, profile: Array<[number, number]>, segments = 32): THREE.Mesh {
  return new THREE.Mesh(new THREE.LatheGeometry(profile.map(([radius, y]) => new THREE.Vector2(radius, y)), segments), material);
}
function roundedFoot(material: THREE.Material): THREE.Mesh {
  const foot = lathe(material, [[0.055, -0.08], [0.11, -0.075], [0.14, -0.02], [0.145, 0.07], [0.12, 0.12], [0.04, 0.14]], 32);
  foot.scale.set(1, 0.62, 1.45); return foot;
}

// A broad, softly bowed fringe carries the bob into the forehead without a visor rim.
function bangGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, 32, 18);
  geometry.scale(0.36, 0.13, 0.12); geometry.translate(0, 0.29, 0.39);
  geometry.computeVertexNormals(); return geometry.toNonIndexed();
}

// Rounded cheek-length locks overlap the cap edge so the face meets hair as a mass,
// not as skin showing through an oval window. Their ends stay soft like a bob.
function sideFallGeometry(side: -1 | 1): THREE.BufferGeometry {
  const geometry = new THREE.CapsuleGeometry(0.105, 0.46, 7, 18);
  geometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(side * 0.045));
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(side * 0.35, -0.03, 0.36));
  geometry.computeVertexNormals(); return geometry.toNonIndexed();
}

function hairShell(): THREE.BufferGeometry {
  const cap = new THREE.LatheGeometry([
    new THREE.Vector2(0.22, -0.43), new THREE.Vector2(0.31, -0.39), new THREE.Vector2(0.39, -0.28),
    new THREE.Vector2(0.43, -0.10), new THREE.Vector2(0.44, 0.13), new THREE.Vector2(0.41, 0.31),
    new THREE.Vector2(0.34, 0.42), new THREE.Vector2(0.22, 0.47), new THREE.Vector2(0, 0.48),
  ], 40);
  // Keep the full lathed crown: this seals the top and wraps the back of the bob.
  cap.applyMatrix4(new THREE.Matrix4().makeScale(1.05, 1, 0.84));
  cap.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.075)); cap.computeVertexNormals();
  const merged = mergeGeometries([cap.toNonIndexed(), bangGeometry(), sideFallGeometry(-1), sideFallGeometry(1)], false);
  if (!merged) throw new Error("Mara hair geometry merge failed");
  merged.computeVertexNormals(); return merged;
}

function eye(head: THREE.Group, m: SoftMats, x: number): void {
  const socket = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), m.shadow);
  socket.scale.set(0.132, 0.118, 0.045); add(head, socket, x, 0.022, 0.335);
  const white = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), m.eyeWhite);
  white.scale.set(0.101, 0.112, 0.046); add(head, white, x, 0.018, 0.367);
  const iris = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), m.eyeBlue);
  iris.scale.set(0.068, 0.079, 0.038); add(head, iris, x, 0.012, 0.414);
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), m.eyeDark);
  pupil.scale.set(0.035, 0.052, 0.031); add(head, pupil, x, 0.008, 0.451);
  const highlight = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), m.eyeWhite);
  highlight.scale.set(0.017, 0.020, 0.014); add(head, highlight, x - 0.022, 0.044, 0.481);
  const lid = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.13, 4, 12), m.eyeDark);
  lid.rotation.z = Math.PI / 2; add(head, lid, x, 0.087, 0.443);
  const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.013, 0.105, 4, 12), m.hair);
  brow.rotation.z = Math.PI / 2 + (x < 0 ? -0.18 : 0.18); add(head, brow, x, 0.151, 0.397);
}
function face(head: THREE.Group, m: SoftMats): void {
  eye(head, m, -0.125); eye(head, m, 0.125);
  const nose = lathe(m.shadow, [[0.018, -0.025], [0.028, 0], [0.016, 0.028], [0, 0.04]], 16); nose.scale.set(1, 1, 0.5); add(head, nose, 0, -0.055, 0.356);
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.009, 6, 18, Math.PI), m.shadow); mouth.rotation.set(Math.PI / 2, 0, Math.PI); add(head, mouth, 0, -0.15, 0.346);
}
function badge(torso: THREE.Group, m: SoftMats): void {
  const disk = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.072, 0.018, 24), m.accent); disk.rotation.x = Math.PI / 2; add(torso, disk, 0.13, 0.39, 0.295);
  const star = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.022, 5), m.belt); star.rotation.set(Math.PI / 2, 0, Math.PI / 4); add(torso, star, 0.13, 0.39, 0.307);
}
function countTris(root: THREE.Object3D): number {
  let n = 0;
  root.traverse((object) => { if (!(object as THREE.Mesh).isMesh) return; const geometry = (object as THREE.Mesh).geometry as THREE.BufferGeometry; n += geometry.index ? geometry.index.count / 3 : (geometry.attributes.position?.count ?? 0) / 3; });
  return Math.round(n);
}

export function buildMaraSoft(): MaraSoftParts {
  const m = materials(); const root = new THREE.Group(); const hip = new THREE.Group(); const torso = new THREE.Group(); const head = new THREE.Group();
  const armL = new THREE.Group(); const armR = new THREE.Group(); const legL = new THREE.Group(); const legR = new THREE.Group(); const weap = new THREE.Group();
  root.add(hip); hip.position.y = 0.64;
  for (const [leg, x] of [[legL, -0.14], [legR, 0.14]] as const) {
    leg.position.x = x; add(leg, lathe(m.pants, [[0.075, -0.51], [0.105, -0.46], [0.115, -0.22], [0.13, -0.04], [0.09, 0.02]], 32), 0, 0, 0);
    add(leg, roundedFoot(m.boot), 0, -0.57, 0.075); hip.add(leg);
  }
  add(hip, lathe(m.pants, [[0.20, -0.10], [0.275, -0.04], [0.28, 0.04], [0.235, 0.12]], 36), 0, -0.01, 0); hip.add(torso); torso.position.y = 0.03;
  add(torso, lathe(m.uniform, [[0.18, 0.02], [0.265, 0.10], [0.30, 0.28], [0.285, 0.48], [0.23, 0.61], [0.12, 0.65]], 40), 0, 0.04, 0);
  add(torso, lathe(m.belt, [[0.255, 0.00], [0.285, 0.035], [0.278, 0.085], [0.25, 0.11]], 36), 0, 0, 0);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.10, 0.035, 3, 3, 2), m.accent); add(torso, buckle, 0, 0.065, 0.285); badge(torso, m);
  const collar = lathe(m.belt, [[0.09, -0.03], [0.14, 0], [0.15, 0.07], [0.08, 0.10]], 28); add(torso, collar, 0, 0.57, 0.015);
  for (const [arm, x] of [[armL, -0.375], [armR, 0.375]] as const) {
    arm.position.set(x, 0.43, 0); add(arm, lathe(m.uniform, [[0.075, -0.18], [0.105, -0.12], [0.11, 0.03], [0.085, 0.12]], 32), 0, -0.10, 0);
    add(arm, lathe(m.skin, [[0.055, -0.43], [0.082, -0.36], [0.085, -0.23], [0.068, -0.16]], 32), 0, -0.10, 0);
    add(arm, lathe(m.skin, [[0.045, -0.52], [0.075, -0.48], [0.08, -0.40], [0.05, -0.34], [0, -0.30]], 28), 0, -0.10, 0); torso.add(arm);
  }
  armR.add(weap); weap.position.set(0, -0.43, 0.13);
  add(weap, lathe(m.belt, [[0.035, -0.32], [0.05, -0.25], [0.052, 0.24], [0.035, 0.32]], 20), 0, -0.17, 0);
  add(weap, lathe(m.accent, [[0.055, -0.06], [0.065, 0], [0.055, 0.06]], 20), 0, 0.13, 0);
  torso.add(head); head.position.y = 0.76;
  add(head, lathe(m.skin, [[0.16, -0.30], [0.29, -0.24], [0.35, -0.10], [0.37, 0.08], [0.36, 0.25], [0.29, 0.36], [0.16, 0.40]], 40), 0, 0, 0);
  add(head, new THREE.Mesh(hairShell(), m.hair), 0, 0, 0); face(head, m);
  const wrap = new THREE.Group(); wrap.add(root); root.position.y = 0.08;
  return { root: wrap, hip, torso, head, armL, armR, legL, legR, weap, tris: countTris(wrap) };
}
