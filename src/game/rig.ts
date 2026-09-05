import * as THREE from "three";
import type { AnimClip, Archetype, Dir, Gender, Unit } from "./types";

export interface Proj {
  x: number;
  y: number;
  d: number;
}

export type ProjectFn = (lx: number, ly: number, lz: number) => Proj;

/** World height of a standing humanoid (lz 0..1). */
export const CHAR_H = 2.15;
export const ATTACK_MS = 420;
export const CAST_MS = 520;

const RT_W = 192;
const RT_H = 240;
const ATLAS = 128;

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}

function shadeRgb(c: RGB, k: number): RGB {
  return {
    r: Math.round(Math.min(255, c.r * k)),
    g: Math.round(Math.min(255, c.g * k)),
    b: Math.round(Math.min(255, c.b * k)),
  };
}

function css(c: RGB): string {
  return `rgb(${c.r},${c.g},${c.b})`;
}

const EYE = rgb(18, 12, 14);
const SHOE_DK = rgb(28, 24, 26);
const WHITE = rgb(246, 246, 250);
const SPARK = rgb(255, 230, 120);

interface Pal {
  skin: RGB;
  hair: RGB;
  shirt: RGB;
  pants: RGB;
  accent: RGB;
  extra: RGB;
  metal: RGB;
  shoe: RGB;
  eye: RGB;
  white: RGB;
  spark: RGB;
  skinDk: RGB;
}

function palettes(arch: Archetype, gender: Gender): Pal {
  let skin: RGB;
  let hair: RGB;
  let shirt: RGB;
  let pants: RGB;
  let accent: RGB;
  let extra: RGB;
  let metal: RGB;
  switch (arch) {
    case "mara":
      skin = rgb(196, 154, 118);
      hair = rgb(28, 32, 48);
      shirt = rgb(24, 42, 72);
      pants = rgb(20, 26, 40);
      accent = rgb(220, 190, 70);
      extra = rgb(16, 28, 48);
      metal = rgb(190, 196, 204);
      break;
    case "dana":
      skin = rgb(176, 124, 90);
      hair = rgb(72, 44, 30);
      shirt = rgb(30, 48, 68);
      pants = rgb(26, 30, 38);
      accent = rgb(220, 190, 70);
      extra = rgb(22, 24, 28);
      metal = rgb(170, 160, 140);
      break;
    case "priya":
      skin = rgb(150, 96, 64);
      hair = rgb(22, 14, 12);
      shirt = rgb(232, 228, 214);
      pants = rgb(40, 70, 78);
      accent = rgb(200, 64, 64);
      extra = rgb(90, 110, 64);
      metal = rgb(210, 214, 220);
      break;
    case "hale":
      skin = rgb(210, 170, 132);
      hair = rgb(110, 96, 82);
      shirt = rgb(48, 52, 64);
      pants = rgb(32, 34, 42);
      accent = rgb(255, 200, 87);
      extra = rgb(70, 74, 88);
      metal = rgb(170, 160, 140);
      break;
    case "crosby":
      skin = rgb(188, 148, 112);
      hair = rgb(36, 28, 24);
      shirt = rgb(48, 22, 28);
      pants = rgb(28, 16, 20);
      accent = rgb(255, 200, 87);
      extra = rgb(28, 12, 18);
      metal = rgb(212, 176, 80);
      break;
    case "beckett":
      skin = rgb(176, 132, 98);
      hair = rgb(48, 30, 24);
      shirt = rgb(88, 28, 32);
      pants = rgb(30, 20, 24);
      accent = rgb(255, 140, 70);
      extra = rgb(52, 18, 22);
      metal = rgb(200, 180, 150);
      break;
    case "delinquent":
      skin = gender === "f" ? rgb(198, 150, 120) : rgb(180, 140, 108);
      hair = gender === "f" ? rgb(40, 24, 60) : rgb(24, 20, 28);
      shirt = rgb(52, 58, 48);
      pants = rgb(34, 36, 40);
      accent = rgb(180, 70, 90);
      extra = rgb(90, 40, 50);
      metal = rgb(160, 160, 170);
      break;
    case "magician":
      skin = gender === "f" ? rgb(205, 168, 138) : rgb(186, 142, 110);
      hair = gender === "f" ? rgb(90, 40, 120) : rgb(30, 20, 40);
      shirt = rgb(72, 36, 110);
      pants = rgb(28, 20, 48);
      accent = rgb(220, 180, 80);
      extra = rgb(40, 18, 70);
      metal = rgb(220, 200, 120);
      break;
    case "wolverine":
      skin = rgb(120, 90, 70);
      hair = rgb(60, 42, 32);
      shirt = rgb(90, 70, 52);
      pants = rgb(70, 52, 40);
      accent = rgb(220, 120, 60);
      extra = rgb(40, 28, 22);
      metal = rgb(200, 190, 180);
      break;
    case "boxer":
      skin = rgb(170, 120, 88);
      hair = rgb(20, 16, 18);
      shirt = rgb(230, 230, 236);
      pants = rgb(28, 28, 36);
      accent = rgb(220, 60, 60);
      extra = rgb(40, 40, 48);
      metal = rgb(180, 180, 190);
      break;
    case "gunner":
      skin = gender === "f" ? rgb(200, 158, 128) : rgb(178, 136, 104);
      hair = gender === "f" ? rgb(50, 36, 28) : rgb(32, 28, 30);
      shirt = rgb(46, 58, 48);
      pants = rgb(34, 40, 36);
      accent = rgb(90, 180, 110);
      extra = rgb(28, 36, 30);
      metal = rgb(120, 130, 120);
      break;
    case "worker":
      skin = rgb(190, 150, 118);
      hair = rgb(48, 40, 36);
      shirt = rgb(220, 160, 50);
      pants = rgb(50, 56, 70);
      accent = rgb(40, 80, 140);
      extra = rgb(180, 140, 50);
      metal = rgb(160, 160, 170);
      break;
    case "official":
    default:
      skin = rgb(200, 162, 130);
      hair = rgb(40, 36, 44);
      shirt = rgb(240, 236, 230);
      pants = rgb(32, 36, 48);
      accent = rgb(60, 90, 140);
      extra = rgb(28, 36, 56);
      metal = rgb(180, 170, 140);
      break;
  }
  return {
    skin,
    hair,
    shirt,
    pants,
    accent,
    extra,
    metal,
    shoe: SHOE_DK,
    eye: EYE,
    white: WHITE,
    spark: SPARK,
    skinDk: shadeRgb(skin, 0.78),
  };
}

export function clipDuration(clip: AnimClip): number {
  if (clip === "attack") return ATTACK_MS;
  if (clip === "cast") return CAST_MS;
  return 0;
}

function activeClip(u: Unit, now: number): { clip: AnimClip; t: number } {
  const dur = clipDuration(u.anim);
  if (dur > 0) {
    const clock = typeof performance !== "undefined" ? performance.now() : now;
    const t = (clock - u.animStart) / dur;
    if (t < 1) return { clip: u.anim, t: Math.max(0, t) };
  }
  if (u.anim === "walk") return { clip: "walk", t: (now / 280) % 1 };
  return { clip: "idle", t: (now / 900) % 1 };
}

function rotFacing(x: number, y: number, dir: Dir): { x: number; y: number } {
  switch (dir) {
    case 0:
      return { x, y: -y };
    case 1:
      return { x: y, y: x };
    case 2:
      return { x: -x, y };
    case 3:
      return { x: -y, y: -x };
  }
}

export function localToGrid(lx: number, ly: number, dir: Dir): { x: number; y: number } {
  return rotFacing(lx, ly, dir);
}

/** Approx screen height of a standing unit for HP bar placement. */
export function rigDrawHeight(zoom: number): number {
  return 58 * zoom;
}

// —— Pixel atlas (128×128) with UV regions ——
// Layout (texels): face 0..47, body panels, hair, gear strips.

interface AtlasPack {
  tex: THREE.CanvasTexture;
  mat: THREE.MeshLambertMaterial;
}

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB): void {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, Math.max(1, w | 0), Math.max(1, h | 0));
}

function paintFace(ctx: CanvasRenderingContext2D, pal: Pal, woman: boolean, beast: boolean): void {
  // Face panel 0,0 48x48 — oversized chibi eyes like ref-3
  px(ctx, 0, 0, 48, 48, pal.skin);
  // cheek shade
  px(ctx, 0, 28, 48, 20, pal.skinDk);
  px(ctx, 4, 8, 40, 22, pal.skin);
  if (beast) {
    px(ctx, 5, 12, 16, 14, pal.eye);
    px(ctx, 27, 12, 16, 14, pal.eye);
    px(ctx, 9, 16, 6, 6, pal.accent);
    px(ctx, 31, 16, 6, 6, pal.accent);
    px(ctx, 11, 18, 3, 3, pal.white);
    px(ctx, 33, 18, 3, 3, pal.white);
    px(ctx, 16, 30, 16, 8, pal.skinDk);
    px(ctx, 18, 33, 12, 4, pal.eye);
    px(ctx, 20, 34, 8, 2, pal.white);
    return;
  }
  const eyeY = woman ? 12 : 13;
  // sclera
  px(ctx, 5, eyeY, 16, 18, pal.white);
  px(ctx, 27, eyeY, 16, 18, pal.white);
  // iris + pupil
  px(ctx, 9, eyeY + 4, 9, 11, pal.eye);
  px(ctx, 31, eyeY + 4, 9, 11, pal.eye);
  px(ctx, 11, eyeY + 6, 5, 7, rgb(40, 60, 90));
  px(ctx, 33, eyeY + 6, 5, 7, rgb(40, 60, 90));
  px(ctx, 12, eyeY + 7, 2, 2, pal.eye);
  px(ctx, 34, eyeY + 7, 2, 2, pal.eye);
  // specular
  px(ctx, 15, eyeY + 5, 3, 3, pal.white);
  px(ctx, 37, eyeY + 5, 3, 3, pal.white);
  px(ctx, 8, eyeY + 14, 10, 3, shadeRgb(pal.skin, 0.9));
  px(ctx, 30, eyeY + 14, 10, 3, shadeRgb(pal.skin, 0.9));
  // brows
  px(ctx, 5, eyeY - 4, 16, 3, pal.hair);
  px(ctx, 27, eyeY - 4, 16, 3, pal.hair);
  if (woman) {
    px(ctx, 4, 34, 8, 4, shadeRgb(rgb(220, 120, 130), 0.85));
    px(ctx, 36, 34, 8, 4, shadeRgb(rgb(220, 120, 130), 0.85));
  }
  px(ctx, 18, 36, 12, 3, pal.skinDk);
  px(ctx, 21, 38, 6, 3, shadeRgb(pal.skin, 0.55));
}

function buildAtlas(arch: Archetype, gender: Gender): AtlasPack {
  const pal = palettes(arch, gender);
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS;
  canvas.height = ATLAS;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  // fill dark
  px(ctx, 0, 0, ATLAS, ATLAS, rgb(20, 16, 24));
  paintFace(ctx, pal, gender === "f", arch === "wolverine");

  // skin 48,0 16x16
  px(ctx, 48, 0, 16, 16, pal.skin);
  px(ctx, 48, 16, 16, 16, pal.skinDk);
  // hair 64,0
  px(ctx, 64, 0, 32, 16, pal.hair);
  px(ctx, 64, 16, 32, 16, shadeRgb(pal.hair, 0.75));
  // shirt 96,0
  px(ctx, 96, 0, 32, 24, pal.shirt);
  px(ctx, 96, 24, 32, 8, shadeRgb(pal.shirt, 0.8));
  // pants 0,48
  px(ctx, 0, 48, 32, 24, pal.pants);
  px(ctx, 0, 72, 32, 8, shadeRgb(pal.pants, 0.75));
  // accent / extra / metal / shoe
  px(ctx, 32, 48, 16, 16, pal.accent);
  px(ctx, 48, 48, 16, 16, pal.extra);
  px(ctx, 64, 48, 16, 16, pal.metal);
  px(ctx, 80, 48, 16, 16, pal.shoe);
  px(ctx, 96, 48, 16, 16, pal.spark);
  px(ctx, 112, 48, 16, 16, pal.white);
  // shirt detail stripes
  for (let i = 0; i < 4; i++) px(ctx, 96 + i * 8, 8, 3, 12, pal.accent);
  // hair shine
  px(ctx, 70, 4, 10, 3, shadeRgb(pal.hair, 1.35));

  // Archetype marks in atlas corner
  if (arch === "magician") {
    px(ctx, 64, 64, 32, 24, pal.extra);
    px(ctx, 72, 70, 16, 8, pal.accent);
  }
  if (arch === "worker") {
    px(ctx, 64, 64, 32, 16, pal.accent);
    px(ctx, 70, 68, 20, 8, pal.metal);
  }
  if (arch === "official") {
    px(ctx, 64, 64, 24, 20, pal.white);
    px(ctx, 68, 70, 16, 4, pal.accent);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  const mat = new THREE.MeshLambertMaterial({
    map: tex,
    transparent: false,
    side: THREE.FrontSide,
  });
  return { tex, mat };
}

/** UV helpers — atlas is 128, regions in pixels → 0..1 */
function uvBox(u0: number, v0: number, u1: number, v1: number): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const atr = g.attributes.uv;
  // Remap all face UVs into the sub-rect (simple stretch)
  const su0 = u0 / ATLAS;
  const sv0 = 1 - v1 / ATLAS;
  const su1 = u1 / ATLAS;
  const sv1 = 1 - v0 / ATLAS;
  for (let i = 0; i < atr.count; i++) {
    const u = atr.getX(i);
    const v = atr.getY(i);
    atr.setXY(i, su0 + u * (su1 - su0), sv0 + v * (sv1 - sv0));
  }
  atr.needsUpdate = true;
  return g;
}

function meshBox(
  mat: THREE.Material,
  w: number,
  h: number,
  d: number,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
): THREE.Mesh {
  const g = uvBox(u0, v0, u1, v1);
  const m = new THREE.Mesh(g, mat);
  m.scale.set(w, h, d);
  return m;
}

/** Tapered box via scaled vertices — reads as low-poly mesh, not voxel stack. */
function meshTaper(
  mat: THREE.Material,
  w0: number,
  w1: number,
  h: number,
  d0: number,
  d1: number,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
): THREE.Mesh {
  const g = uvBox(u0, v0, u1, v1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i); // -0.5..0.5
    const t = y + 0.5; // 0 at bottom, 1 at top
    const ws = w0 + (w1 - w0) * t;
    const ds = d0 + (d1 - d0) * t;
    pos.setX(i, pos.getX(i) * ws);
    pos.setZ(i, pos.getZ(i) * ds);
    pos.setY(i, y * h);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

interface RigParts {
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

function add(parent: THREE.Object3D, child: THREE.Object3D, x: number, y: number, z: number): void {
  child.position.set(x, y, z);
  parent.add(child);
}

function buildHumanoid(arch: Archetype, gender: Gender, pack: AtlasPack): RigParts {
  const mat = pack.mat;
  const woman = gender === "f";
  const root = new THREE.Group();
  const hip = new THREE.Group();
  const torso = new THREE.Group();
  const head = new THREE.Group();
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  const weap = new THREE.Group();
  root.add(hip);
  hip.position.y = 0.42;

  // Chibi proportions: head ~⅓–⅖ of height (ref-3). Total ~2.0 units.
  const headH = woman ? 0.92 : 0.88;
  const headW = woman ? 0.84 : 0.8;
  const torsoH = 0.46;
  const legH = 0.4;
  const armH = 0.38;

  // Legs — stubby tapered (not voxel columns)
  const thighL = meshTaper(mat, 0.32, 0.26, legH * 0.55, 0.34, 0.28, 0, 48, 32, 72);
  const calfL = meshTaper(mat, 0.26, 0.22, legH * 0.38, 0.28, 0.24, 0, 48, 32, 72);
  const footL = meshBox(mat, 0.34, 0.14, 0.44, 80, 48, 96, 64);
  add(legL, thighL, 0, -legH * 0.18, 0);
  add(legL, calfL, 0, -legH * 0.52, 0);
  add(legL, footL, 0, -legH * 0.72, 0.08);
  legL.position.set(-0.15, 0, 0);

  const thighR = meshTaper(mat, 0.32, 0.26, legH * 0.55, 0.34, 0.28, 0, 48, 32, 72);
  const calfR = meshTaper(mat, 0.26, 0.22, legH * 0.38, 0.28, 0.24, 0, 48, 32, 72);
  const footR = meshBox(mat, 0.34, 0.14, 0.44, 80, 48, 96, 64);
  add(legR, thighR, 0, -legH * 0.18, 0);
  add(legR, calfR, 0, -legH * 0.52, 0);
  add(legR, footR, 0, -legH * 0.72, 0.08);
  legR.position.set(0.15, 0, 0);
  hip.add(legL);
  hip.add(legR);

  // Hip / pelvis
  const pelvis = meshBox(mat, 0.5, 0.22, 0.32, 0, 48, 32, 72);
  add(hip, pelvis, 0, 0.05, 0);

  // Torso
  hip.add(torso);
  torso.position.y = 0.28;
  const chest = meshTaper(mat, woman ? 0.58 : 0.62, woman ? 0.48 : 0.54, torsoH, woman ? 0.38 : 0.42, woman ? 0.32 : 0.36, 96, 0, 128, 32);
  add(torso, chest, 0, torsoH * 0.35, 0);
  // shoulder pads for silhouette
  const shL = meshBox(mat, 0.2, 0.14, 0.24, 96, 0, 128, 32);
  const shR = meshBox(mat, 0.2, 0.14, 0.24, 96, 0, 128, 32);
  add(torso, shL, -0.34, torsoH * 0.7, 0);
  add(torso, shR, 0.34, torsoH * 0.7, 0);

  // Archetype torso extras
  if (arch === "dana" || arch === "crosby" || arch === "beckett") {
    const coat = meshBox(mat, 0.62, torsoH * 0.9, 0.42, 48, 48, 64, 64);
    add(torso, coat, 0, torsoH * 0.2, -0.02);
  }
  if (arch === "priya") {
    const coat = meshBox(mat, 0.58, torsoH * 1.05, 0.4, 96, 0, 128, 32);
    add(torso, coat, 0, torsoH * 0.25, 0);
    const cross = meshBox(mat, 0.08, 0.35, 0.06, 32, 48, 48, 64);
    add(torso, cross, 0, torsoH * 0.45, 0.2);
  }
  if (arch === "official") {
    const tie = meshBox(mat, 0.1, 0.28, 0.06, 32, 48, 48, 64);
    add(torso, tie, 0, torsoH * 0.4, 0.18);
  }
  if (arch === "worker") {
    const vest = meshBox(mat, 0.58, torsoH * 0.7, 0.4, 32, 48, 48, 64);
    add(torso, vest, 0, torsoH * 0.3, 0);
  }

  // Arms
  const upperL = meshTaper(mat, 0.24, 0.18, armH * 0.55, 0.24, 0.2, 48, 0, 64, 16);
  const lowerL = meshTaper(mat, 0.18, 0.16, armH * 0.42, 0.2, 0.18, 48, 0, 64, 16);
  const handL = meshBox(mat, 0.22, 0.18, 0.24, 48, 0, 64, 16);
  add(armL, upperL, 0, -armH * 0.12, 0);
  add(armL, lowerL, 0, -armH * 0.48, 0);
  add(armL, handL, 0, -armH * 0.72, 0);
  armL.position.set(-0.42, torsoH * 0.62, 0);

  const upperR = meshTaper(mat, 0.24, 0.18, armH * 0.55, 0.24, 0.2, 48, 0, 64, 16);
  const lowerR = meshTaper(mat, 0.18, 0.16, armH * 0.42, 0.2, 0.18, 48, 0, 64, 16);
  const handR = meshBox(mat, 0.22, 0.18, 0.24, 48, 0, 64, 16);
  add(armR, upperR, 0, -armH * 0.12, 0);
  add(armR, lowerR, 0, -armH * 0.48, 0);
  add(armR, handR, 0, -armH * 0.72, 0);
  armR.position.set(0.42, torsoH * 0.62, 0);
  torso.add(armL);
  torso.add(armR);

  if (arch === "boxer") {
    const gL = meshBox(mat, 0.32, 0.28, 0.32, 32, 48, 48, 64);
    const gR = meshBox(mat, 0.32, 0.28, 0.32, 32, 48, 48, 64);
    add(armL, gL, 0, -armH * 0.85, 0);
    add(armR, gR, 0, -armH * 0.85, 0);
  }

  // Head — large chibi
  torso.add(head);
  head.position.y = torsoH * 0.85 + headH * 0.35;
  const skull = meshTaper(mat, headW * 0.92, headW, headH * 0.9, headW * 0.85, headW * 0.95, 48, 0, 64, 16);
  add(head, skull, 0, 0, 0);
  // Face plane with big eyes (front)
  const face = new THREE.Mesh(new THREE.PlaneGeometry(headW * 0.9, headH * 0.82), mat);
  {
    const uv = face.geometry.attributes.uv;
    // face region 0,0-48,48
    const u0 = 0 / ATLAS,
      u1 = 48 / ATLAS,
      v0 = 1 - 48 / ATLAS,
      v1 = 1;
    // plane default uv 0..1
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
    }
    uv.needsUpdate = true;
  }
  face.position.set(0, -0.02, headW * 0.46);
  head.add(face);

  // Hair
  const hairTop = meshBox(mat, headW * 1.08, headH * 0.35, headW * 1.05, 64, 0, 96, 16);
  add(head, hairTop, 0, headH * 0.38, 0);
  if (woman || arch === "priya" || arch === "mara" || arch === "dana") {
    const bang = meshBox(mat, headW * 0.95, headH * 0.22, 0.2, 64, 0, 96, 16);
    add(head, bang, 0, headH * 0.2, headW * 0.4);
    const sideL = meshBox(mat, 0.18, headH * 0.55, 0.22, 64, 16, 96, 32);
    const sideR = meshBox(mat, 0.18, headH * 0.55, 0.22, 64, 16, 96, 32);
    add(head, sideL, -headW * 0.48, -0.05, 0.05);
    add(head, sideR, headW * 0.48, -0.05, 0.05);
  }
  if (arch === "magician") {
    const brim = meshBox(mat, headW * 1.35, 0.08, headW * 1.35, 64, 64, 96, 88);
    const cone = meshBox(mat, headW * 0.7, headH * 0.7, headW * 0.7, 48, 48, 64, 64);
    add(head, brim, 0, headH * 0.42, 0);
    add(head, cone, 0, headH * 0.75, 0);
  }
  if (arch === "worker") {
    const helm = meshBox(mat, headW * 1.15, headH * 0.35, headW * 1.15, 64, 64, 96, 80);
    add(head, helm, 0, headH * 0.45, 0);
  }
  if (arch === "crosby") {
    const hood = meshBox(mat, headW * 1.2, headH * 0.7, headW * 1.15, 48, 48, 64, 64);
    add(head, hood, 0, headH * 0.15, -0.05);
  }
  if (arch === "hale") {
    const stubble = meshBox(mat, headW * 0.7, 0.12, 0.15, 48, 16, 64, 32);
    add(head, stubble, 0, -headH * 0.28, headW * 0.42);
  }

  // Weapon / gear on right arm
  armR.add(weap);
  weap.position.set(0, -armH * 0.7, 0.15);
  if (arch === "mara" || arch === "delinquent") {
    const bat = meshBox(mat, 0.1, 0.7, 0.1, 64, 48, 80, 64);
    add(weap, bat, 0, -0.15, 0.2);
  } else if (arch === "gunner" || arch === "crosby" || arch === "beckett") {
    const gun = meshBox(mat, 0.14, 0.18, 0.55, 64, 48, 80, 64);
    add(weap, gun, 0, 0, 0.25);
  } else if (arch === "magician") {
    const staff = meshBox(mat, 0.08, 0.9, 0.08, 64, 48, 80, 64);
    const orb = meshBox(mat, 0.18, 0.18, 0.18, 96, 48, 112, 64);
    add(weap, staff, 0, -0.2, 0.15);
    add(weap, orb, 0, 0.35, 0.15);
  } else if (arch === "hale") {
    const light = meshBox(mat, 0.14, 0.14, 0.35, 96, 48, 112, 64);
    add(weap, light, 0, 0, 0.2);
  } else if (arch === "priya") {
    const kit = meshBox(mat, 0.28, 0.2, 0.18, 112, 48, 128, 64);
    add(weap, kit, 0, 0, 0.1);
  } else if (arch === "official") {
    const board = meshBox(mat, 0.28, 0.35, 0.06, 112, 48, 128, 64);
    add(weap, board, 0.1, 0, 0.15);
  } else if (arch === "dana") {
    const blade = meshBox(mat, 0.08, 0.55, 0.14, 64, 48, 80, 64);
    add(weap, blade, 0, -0.1, 0.2);
  }

  // Count tris approx (each box = 12 tris, face plane = 2)
  let tris = 2;
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      const mesh = o as THREE.Mesh;
      const g = mesh.geometry as THREE.BufferGeometry;
      const idx = g.index;
      if (idx) tris += idx.count / 3;
      else tris += (g.attributes.position?.count || 0) / 3;
    }
  });

  // Scale whole character so feet sit near y=0 and height ~2
  const wrap = new THREE.Group();
  wrap.add(root);
  // hip at 0.42, head top ~ 0.42+0.28+0.85*0.52 + head... ≈ 2.0
  // Shift so feet (hip.y - leg extent) ≈ 0
  root.position.y = 0.38;

  return { root: wrap, hip, torso, head, armL, armR, legL, legR, weap, tris: tris | 0 };
}

function buildWolverine(pack: AtlasPack): RigParts {
  const mat = pack.mat;
  const root = new THREE.Group();
  const hip = new THREE.Group();
  const torso = new THREE.Group();
  const head = new THREE.Group();
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  const weap = new THREE.Group();
  root.add(hip);
  hip.position.y = 0.35;

  const body = meshBox(mat, 0.7, 0.4, 0.9, 96, 0, 128, 32);
  add(hip, body, 0, 0.2, 0);
  hip.add(torso);
  torso.position.set(0, 0.35, 0.15);

  const skull = meshBox(mat, 0.55, 0.45, 0.55, 48, 0, 64, 16);
  add(head, skull, 0, 0.1, 0.35);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.4), mat);
  {
    const uv = face.geometry.attributes.uv;
    const u0 = 0,
      u1 = 48 / ATLAS,
      v0 = 1 - 48 / ATLAS,
      v1 = 1;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, u0 + uv.getX(i) * (u1 - u0), v0 + uv.getY(i) * (v1 - v0));
    uv.needsUpdate = true;
  }
  face.position.set(0, 0.1, 0.64);
  head.add(face);
  const earL = meshBox(mat, 0.12, 0.28, 0.1, 64, 0, 96, 16);
  const earR = meshBox(mat, 0.12, 0.28, 0.1, 64, 0, 96, 16);
  add(head, earL, -0.22, 0.35, 0.2);
  add(head, earR, 0.22, 0.35, 0.2);
  torso.add(head);

  const fl = meshBox(mat, 0.2, 0.35, 0.22, 0, 48, 32, 72);
  const fr = meshBox(mat, 0.2, 0.35, 0.22, 0, 48, 32, 72);
  const bl = meshBox(mat, 0.2, 0.32, 0.22, 0, 48, 32, 72);
  const br = meshBox(mat, 0.2, 0.32, 0.22, 0, 48, 32, 72);
  add(legL, fl, -0.22, -0.15, 0.28);
  add(legR, fr, 0.22, -0.15, 0.28);
  add(armL, bl, -0.22, -0.12, -0.3);
  add(armR, br, 0.22, -0.12, -0.3);
  hip.add(legL);
  hip.add(legR);
  hip.add(armL);
  hip.add(armR);

  const tail = meshBox(mat, 0.12, 0.12, 0.5, 64, 0, 96, 16);
  add(hip, tail, 0, 0.25, -0.55);
  const jaw = meshBox(mat, 0.35, 0.12, 0.3, 48, 16, 64, 32);
  add(head, jaw, 0, -0.05, 0.55);

  armR.add(weap);
  let tris = 2;
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) {
      const g = (o as THREE.Mesh).geometry as THREE.BufferGeometry;
      tris += g.index ? g.index.count / 3 : (g.attributes.position?.count || 0) / 3;
    }
  });
  const wrap = new THREE.Group();
  wrap.add(root);
  root.position.y = 0.2;
  return { root: wrap, hip, torso, head, armL, armR, legL, legR, weap, tris: tris | 0 };
}

interface Template {
  pack: AtlasPack;
  parts: RigParts;
}

const templates = new Map<string, Template>();

function templateOf(arch: Archetype, gender: Gender): Template {
  const key = arch + gender;
  let t = templates.get(key);
  if (t) return t;
  const pack = buildAtlas(arch, gender);
  const parts = arch === "wolverine" ? buildWolverine(pack) : buildHumanoid(arch, gender, pack);
  t = { pack, parts };
  templates.set(key, t);
  return t;
}

function applyPose(parts: RigParts, arch: Archetype, clip: AnimClip, t: number, now: number): void {
  const { hip, torso, head, armL, armR, legL, legR, weap } = parts;
  // reset
  for (const p of [hip, torso, head, armL, armR, legL, legR, weap]) {
    p.rotation.set(0, 0, 0);
    // keep base positions — only adjust rotation / small offsets stored in userData
  }
  hip.position.y = arch === "wolverine" ? 0.35 : 0.42;
  if (clip === "idle") {
    const bob = Math.sin(now / 420) * 0.03;
    torso.position.y = (arch === "wolverine" ? 0.35 : 0.28) + bob;
    head.rotation.z = Math.sin(now / 900) * 0.04;
    armL.rotation.x = 0.08 + bob;
    armR.rotation.x = 0.08 - bob;
    return;
  }
  if (clip === "walk") {
    const s = Math.sin(t * Math.PI * 2);
    const c = Math.cos(t * Math.PI * 2);
    legL.rotation.x = s * 0.55;
    legR.rotation.x = -s * 0.55;
    armL.rotation.x = -s * 0.45;
    armR.rotation.x = s * 0.45;
    torso.position.y = (arch === "wolverine" ? 0.35 : 0.28) + Math.abs(c) * 0.04;
    hip.position.y = (arch === "wolverine" ? 0.35 : 0.42) + Math.abs(s) * 0.02;
    if (arch === "wolverine") {
      armL.rotation.x = s * 0.5;
      armR.rotation.x = -s * 0.5;
    }
    return;
  }
  if (clip === "attack") {
    const phase = t < 0.35 ? t / 0.35 : t < 0.62 ? (t - 0.35) / 0.27 : (t - 0.62) / 0.38;
    if (arch === "wolverine") {
      torso.rotation.x = t < 0.62 ? -0.3 : 0;
      armL.rotation.x = t < 0.62 ? -0.8 : 0.2;
      armR.rotation.x = t < 0.62 ? -0.8 : 0.2;
      hip.position.z = t < 0.62 ? 0.15 : 0;
    } else if (arch === "boxer") {
      armR.rotation.x = t < 0.35 ? -0.4 : t < 0.62 ? -1.4 : -0.3;
      armR.rotation.z = t < 0.62 ? -0.3 : 0;
      torso.rotation.y = t < 0.62 ? -0.25 : 0;
      armL.rotation.x = -0.6;
    } else if (arch === "gunner" || arch === "crosby" || arch === "beckett") {
      armR.rotation.x = -1.1;
      weap.rotation.x = -0.2;
      torso.rotation.y = -0.15;
      armL.rotation.x = -0.5;
    } else {
      armR.rotation.x = t < 0.35 ? -0.5 : t < 0.62 ? -1.5 : -0.4;
      armR.rotation.z = t < 0.62 ? -0.4 : 0;
      weap.rotation.x = t < 0.62 ? -0.5 : 0;
      torso.rotation.y = t < 0.62 ? -0.2 : 0;
      armL.rotation.x = -0.3;
    }
    void phase;
    return;
  }
  // cast
  const up = t < 0.66;
  armL.rotation.x = up ? -2.2 : -1.4;
  armR.rotation.x = up ? -2.2 : -1.4;
  armL.rotation.z = 0.4;
  armR.rotation.z = -0.4;
  head.rotation.x = up ? -0.15 : 0;
  torso.position.y = (arch === "wolverine" ? 0.35 : 0.28) + (up ? 0.06 : 0.02);
}

// —— Three.js offscreen unit compositor ——
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let stage: THREE.Group | null = null;
let glReady = false;

function ensureGL(): boolean {
  if (glReady && renderer) return true;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = RT_W;
    canvas.height = RT_H;
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    renderer.setSize(RT_W, RT_H, false);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    const frustum = 1.35;
    const aspect = RT_W / RT_H;
    camera = new THREE.OrthographicCamera(-frustum * aspect, frustum * aspect, frustum, -frustum, 0.1, 40);
    stage = new THREE.Group();
    scene.add(stage);
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    const dir = new THREE.DirectionalLight(0xfff2e0, 1.15);
    dir.position.set(2.8, 5.5, 3.2);
    const fill = new THREE.DirectionalLight(0x90a0ff, 0.45);
    fill.position.set(-3.2, 2.2, -2.4);
    scene.add(amb, dir, fill);
    glReady = true;
    return true;
  } catch {
    return false;
  }
}

function dirAngle(dir: Dir): number {
  // Match localToGrid facing: 0=-Y, 1=+X, 2=+Y, 3=-X in grid → camera orbit
  return (dir * Math.PI) / 2;
}

function placeCamera(camYaw: number, camPitchDeg: number, dir: Dir): void {
  if (!camera) return;
  const rel = camYaw - dirAngle(dir);
  const pitch = (camPitchDeg * Math.PI) / 180;
  const dist = 4.2;
  // Iso-ish orbit: yaw around Y, pitch from horizontal
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const x = Math.sin(rel) * cp * dist;
  const z = Math.cos(rel) * cp * dist;
  const y = sp * dist + 0.85;
  camera.position.set(x, y, z);
  camera.lookAt(0, 0.85, 0);
  camera.updateProjectionMatrix();
}

export function drawRig(
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  u: Unit,
  now: number,
  zoom: number,
  camYaw = 0,
  camPitch = 30,
): void {
  const feet = project(0, 0, 0);
  const crown = project(0, 0, 1);
  const scrH = Math.max(8, Math.abs(feet.y - crown.y) * 1.12);
  const scrW = scrH * (RT_W / RT_H);

  if (!ensureGL() || !renderer || !scene || !camera || !stage) {
    // Fallback silhouette so gameplay never blanks
    ctx.fillStyle = "#6a7080";
    ctx.beginPath();
    ctx.ellipse(feet.x, feet.y - scrH * 0.35, scrW * 0.22, scrH * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  const tmpl = templateOf(u.archetype, u.gender);
  const { clip, t } = activeClip(u, now);
  applyPose(tmpl.parts, u.archetype, clip, t, now);

  // Swap unique root into stage (templates are shared; reparent each draw)
  while (stage.children.length) stage.remove(stage.children[0]);
  if (tmpl.parts.root.parent) tmpl.parts.root.parent.remove(tmpl.parts.root);
  stage.add(tmpl.parts.root);

  placeCamera(camYaw, camPitch, u.dir);
  renderer.render(scene, camera);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  // Align feet near bottom of RT
  const dx = feet.x - scrW * 0.5;
  const dy = feet.y - scrH * 0.88;
  ctx.drawImage(renderer.domElement, dx, dy, scrW, scrH);
  ctx.restore();
  void zoom;
}

export function precacheRigs(): void {
  if (!ensureGL()) return;
  const arches: Archetype[] = [
    "mara",
    "dana",
    "priya",
    "hale",
    "crosby",
    "beckett",
    "delinquent",
    "magician",
    "wolverine",
    "boxer",
    "gunner",
    "worker",
    "official",
  ];
  for (const a of arches) {
    for (const g of ["f", "m"] as Gender[]) templateOf(a, g);
  }
}

/** Approx triangle count for an archetype template. */
export function meshTris(arch: Archetype, gender: Gender): number {
  return templateOf(arch, gender).parts.tris;
}

export function atlasSize(): number {
  return ATLAS;
}
