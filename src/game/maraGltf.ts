/**
 * Mara map portrait from Quaternius Ultimate Modular Women (Animated Woman).
 * Soft-mesh (maraSoft / buildMaraSoft) stays unused on the map path.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { Dir, Unit } from "./types";
import { rigDrawHeight, type ProjectFn } from "./rig";

function publicUrl(path: string): string {
  const clean = path.replace(/^\//, "");
  // Local lookcheck HTML under /scripts/ still needs site-root public assets.
  if (typeof location !== "undefined" && location.pathname.includes("/scripts/")) {
    return `/${clean}`;
  }
  const base = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "./";
  return base.endsWith("/") ? `${base}${clean}` : `${base}/${clean}`;
}

/** Whole-character GLB — cute short bob civilian (picked from UMW pack). */
const MODEL_URL = publicUrl("models/quaternius/modular-women/Animated_Woman.glb");

/** Mara palette hair — tint Quaternius Hair_* materials toward VN Mara. */
const MARA_HAIR = 0x202c48;

const PORTRAIT_PITCH = 30;
const VIEW_W = 192;
const VIEW_H = 240;

type LoadState = "idle" | "loading" | "ready" | "error";

let loadState: LoadState = "idle";
let root: THREE.Group | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.OrthographicCamera | null = null;
let stage: THREE.Group | null = null;
let glReady = false;

function dirAngle(dir: Dir): number {
  return (dir * Math.PI) / 4;
}

function ensureGL(): boolean {
  if (glReady && renderer) return true;
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: "low-power",
    });
    renderer.setSize(VIEW_W, VIEW_H, false);
    renderer.setPixelRatio(1);
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene = new THREE.Scene();
    const aspect = VIEW_W / VIEW_H;
    camera = new THREE.OrthographicCamera(-1.35 * aspect, 1.35 * aspect, 1.35, -1.35, 0.1, 40);
    stage = new THREE.Group();
    scene.add(stage);
    scene.add(new THREE.HemisphereLight(0xfff3df, 0x222844, 1.35));
    const key = new THREE.DirectionalLight(0xffe7c7, 1.7);
    key.position.set(3.5, 6, 4.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x93b5ff, 0.65);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    glReady = true;
    return true;
  } catch {
    return false;
  }
}

function placeCamera(yaw: number, pitchDeg: number): void {
  if (!camera) return;
  const pitch = (pitchDeg * Math.PI) / 180;
  const d = 4.2;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  camera.position.set(Math.sin(yaw) * cp * d, sp * d + 0.85, Math.cos(yaw) * cp * d);
  camera.lookAt(0, 0.88, 0);
  camera.updateProjectionMatrix();
}

function tintHair(obj: THREE.Object3D): void {
  obj.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      const std = m as THREE.MeshStandardMaterial;
      if (!std || !std.color) continue;
      const name = (std.name || "").toLowerCase();
      if (name.includes("hair")) {
        std.color.setHex(MARA_HAIR);
        // Drop blonde albedo so tint reads as Mara dark hair.
        if (std.map) {
          std.map = null;
        }
        std.needsUpdate = true;
      }
    }
  });
}

/** Prefer Idle clip first frame for a readable standing map portrait. */
function applyIdlePose(gltf: { scene: THREE.Object3D; animations: THREE.AnimationClip[] }): void {
  const clips = gltf.animations ?? [];
  const idle =
    clips.find((c) => /\|Idle$/i.test(c.name) || c.name === "Idle") ??
    clips.find((c) => /Idle_Neutral/i.test(c.name)) ??
    clips.find((c) => /Idle/i.test(c.name));
  if (!idle) return;
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(idle);
  action.play();
  mixer.setTime(0);
  mixer.update(0);
  gltf.scene.updateMatrixWorld(true);
}

function beginLoad(): void {
  if (loadState === "loading" || loadState === "ready") return;
  loadState = "loading";
  if (!ensureGL()) {
    loadState = "error";
    return;
  }
  const loader = new GLTFLoader();
  loader
    .loadAsync(MODEL_URL)
    .then((gltf) => {
      applyIdlePose(gltf);
      tintHair(gltf.scene);
      const group = new THREE.Group();
      group.name = "maraQuaterniusUmw";
      group.add(gltf.scene);
      // FBX2glTF armature already carries cm→m (scale 100) + axis fix.
      root = group;
      loadState = "ready";
    })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? `${err.message}\n${err.stack ?? ""}` : String(err);
      console.warn("maraGltf load failed", msg);
      loadState = "error";
    });
}

/** Kick off async load (idempotent). Call from game/renderer startup. */
export function precacheMaraGltf(): void {
  beginLoad();
}

export function isMaraGltfReady(): boolean {
  return loadState === "ready" && !!root;
}

export function maraGltfState(): LoadState {
  return loadState;
}

/**
 * Draw Mara as an offscreen WebGL portrait billboard (same contract as drawRig).
 * Returns false when glTF is not ready — caller should fall back to painted sprites.
 */
export function drawMaraGltf(
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  u: Unit,
  zoom: number,
): boolean {
  if (loadState === "idle" || loadState === "error") beginLoad();
  if (!isMaraGltfReady() || !root || !renderer || !scene || !camera || !stage) return false;

  const feet = project(0, 0, 0);
  const scrH = rigDrawHeight(zoom) * (u.role === "elite" ? 1.12 : 1);
  const scrW = (scrH * VIEW_W) / VIEW_H;

  while (stage.children.length) stage.remove(stage.children[0]);
  if (root.parent) root.parent.remove(root);
  stage.add(root);

  // +Z is model face after FBX axis fix. Grid facing only — portrait camera stays fixed.
  root.rotation.set(0, dirAngle(u.dir), 0);
  placeCamera(0, PORTRAIT_PITCH);
  renderer.render(scene, camera);

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(renderer.domElement, feet.x - scrW * 0.5, feet.y - scrH * 0.88, scrW, scrH);
  ctx.restore();
  return true;
}

/**
 * Render Mara glTF into a 2D canvas for lookchecks (reuses shared WebGL; no SkinnedMesh clone).
 * yawRad rotates the model (0 = front / +Z toward camera).
 */
export async function renderMaraGltfLookcheck(
  canvas: HTMLCanvasElement,
  opts: { yawRad?: number; pitchDeg?: number; bg?: string } = {},
): Promise<boolean> {
  beginLoad();
  const deadline = performance.now() + 20000;
  while (!isMaraGltfReady() && loadState !== "error" && performance.now() < deadline) {
    await new Promise((r) => setTimeout(r, 50));
  }
  if (!isMaraGltfReady() || !root || !ensureGL() || !renderer || !scene || !camera || !stage) return false;

  const w = canvas.width || 512;
  const h = canvas.height || 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  while (stage.children.length) stage.remove(stage.children[0]);
  if (root.parent) root.parent.remove(root);
  stage.add(root);
  root.rotation.set(0, opts.yawRad ?? 0, 0);
  placeCamera(0, opts.pitchDeg ?? PORTRAIT_PITCH);
  renderer.setClearColor(0x0b1b2e, 1);
  renderer.render(scene, camera);
  renderer.setClearColor(0, 0); // restore transparent for map billboards

  ctx.fillStyle = opts.bg ?? "#0b1b2e";
  ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true;
  // Cover canvas while preserving portrait aspect (192/240).
  const srcAspect = VIEW_W / VIEW_H;
  const dstAspect = w / h;
  let dw = w;
  let dh = h;
  let dx = 0;
  let dy = 0;
  if (dstAspect > srcAspect) {
    dw = h * srcAspect;
    dx = (w - dw) / 2;
  } else {
    dh = w / srcAspect;
    dy = (h - dh) / 2;
  }
  ctx.drawImage(renderer.domElement, dx, dy, dw, dh);
  return true;
}
