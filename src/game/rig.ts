import type { AnimClip, Archetype, Dir, Gender, Unit } from "./types";

export interface Proj {
  x: number;
  y: number;
  d: number;
}

export type ProjectFn = (lx: number, ly: number, lz: number) => Proj;

export const CHAR_H = 2.55;
export const ATTACK_MS = 420;
export const CAST_MS = 520;

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface Palette {
  skin: RGB;
  hair: RGB;
  shirt: RGB;
  pants: RGB;
  accent: RGB;
  extra: RGB;
  metal: RGB;
}

interface Limb {
  pitch: number;
  yaw: number;
}

interface Pose {
  bob: number;
  crouch: number;
  lean: number;
  armL: Limb;
  armR: Limb;
  legL: number;
  legR: number;
  weapon: number;
}

function rgb(r: number, g: number, b: number): RGB {
  return { r, g, b };
}

function hex(c: RGB, shade = 1): string {
  const k = Math.max(0.25, Math.min(1.35, shade));
  const r = Math.round(Math.min(255, c.r * k));
  const g = Math.round(Math.min(255, c.g * k));
  const b = Math.round(Math.min(255, c.b * k));
  return `rgb(${r},${g},${b})`;
}

function palettes(arch: Archetype, gender: Gender): Palette {
  switch (arch) {
    case "mara":
      return {
        skin: rgb(196, 154, 118),
        hair: rgb(42, 32, 28),
        shirt: rgb(28, 72, 78),
        pants: rgb(22, 28, 36),
        accent: rgb(62, 240, 208),
        extra: rgb(18, 48, 56),
        metal: rgb(180, 190, 200),
      };
    case "dana":
      return {
        skin: rgb(168, 114, 82),
        hair: rgb(28, 22, 20),
        shirt: rgb(62, 78, 48),
        pants: rgb(36, 32, 28),
        accent: rgb(190, 210, 120),
        extra: rgb(48, 58, 40),
        metal: rgb(160, 150, 130),
      };
    case "priya":
      return {
        skin: rgb(150, 96, 64),
        hair: rgb(24, 16, 14),
        shirt: rgb(232, 236, 240),
        pants: rgb(40, 70, 78),
        accent: rgb(40, 180, 150),
        extra: rgb(200, 80, 80),
        metal: rgb(210, 214, 220),
      };
    case "hale":
      return {
        skin: rgb(210, 170, 132),
        hair: rgb(90, 78, 68),
        shirt: rgb(48, 52, 64),
        pants: rgb(32, 34, 42),
        accent: rgb(255, 200, 87),
        extra: rgb(70, 74, 88),
        metal: rgb(170, 160, 140),
      };
    case "crosby":
      return {
        skin: rgb(188, 148, 112),
        hair: rgb(36, 28, 24),
        shirt: rgb(48, 22, 28),
        pants: rgb(28, 16, 20),
        accent: rgb(255, 200, 87),
        extra: rgb(28, 12, 18),
        metal: rgb(212, 176, 80),
      };
    case "beckett":
      return {
        skin: rgb(176, 132, 98),
        hair: rgb(48, 30, 24),
        shirt: rgb(88, 28, 32),
        pants: rgb(30, 20, 24),
        accent: rgb(255, 140, 70),
        extra: rgb(52, 18, 22),
        metal: rgb(190, 150, 90),
      };
    case "delinquent":
      return gender === "f"
        ? {
            skin: rgb(200, 160, 128),
            hair: rgb(120, 40, 50),
            shirt: rgb(90, 40, 80),
            pants: rgb(30, 28, 36),
            accent: rgb(220, 90, 120),
            extra: rgb(40, 20, 40),
            metal: rgb(160, 160, 170),
          }
        : {
            skin: rgb(186, 140, 104),
            hair: rgb(20, 18, 18),
            shirt: rgb(44, 70, 48),
            pants: rgb(28, 28, 32),
            accent: rgb(180, 200, 80),
            extra: rgb(36, 42, 36),
            metal: rgb(150, 150, 155),
          };
    case "magician":
      return gender === "f"
        ? {
            skin: rgb(214, 176, 148),
            hair: rgb(48, 28, 70),
            shirt: rgb(72, 48, 110),
            pants: rgb(28, 20, 48),
            accent: rgb(180, 140, 255),
            extra: rgb(40, 24, 70),
            metal: rgb(220, 200, 120),
          }
        : {
            skin: rgb(176, 136, 108),
            hair: rgb(20, 18, 28),
            shirt: rgb(36, 32, 58),
            pants: rgb(22, 20, 36),
            accent: rgb(140, 170, 255),
            extra: rgb(24, 22, 44),
            metal: rgb(200, 190, 140),
          };
    case "wolverine":
      return {
        skin: rgb(120, 78, 48),
        hair: rgb(64, 40, 24),
        shirt: rgb(96, 62, 36),
        pants: rgb(70, 46, 28),
        accent: rgb(200, 90, 40),
        extra: rgb(48, 30, 18),
        metal: rgb(230, 220, 200),
      };
    case "boxer":
      return gender === "f"
        ? {
            skin: rgb(168, 112, 86),
            hair: rgb(30, 22, 20),
            shirt: rgb(200, 70, 80),
            pants: rgb(40, 36, 44),
            accent: rgb(255, 180, 160),
            extra: rgb(220, 210, 200),
            metal: rgb(240, 230, 220),
          }
        : {
            skin: rgb(198, 150, 112),
            hair: rgb(40, 28, 22),
            shirt: rgb(40, 48, 70),
            pants: rgb(36, 36, 42),
            accent: rgb(220, 80, 70),
            extra: rgb(230, 220, 210),
            metal: rgb(240, 230, 220),
          };
    case "gunner":
      return gender === "f"
        ? {
            skin: rgb(186, 142, 110),
            hair: rgb(70, 48, 32),
            shirt: rgb(50, 56, 62),
            pants: rgb(28, 30, 34),
            accent: rgb(120, 180, 200),
            extra: rgb(36, 40, 46),
            metal: rgb(80, 80, 84),
          }
        : {
            skin: rgb(160, 120, 90),
            hair: rgb(24, 20, 18),
            shirt: rgb(48, 52, 48),
            pants: rgb(26, 28, 30),
            accent: rgb(160, 170, 90),
            extra: rgb(32, 36, 34),
            metal: rgb(70, 70, 74),
          };
    case "worker":
      return {
        skin: rgb(190, 148, 112),
        hair: rgb(50, 40, 32),
        shirt: rgb(210, 160, 40),
        pants: rgb(40, 44, 52),
        accent: rgb(40, 40, 44),
        extra: rgb(180, 90, 30),
        metal: rgb(200, 180, 80),
      };
    case "official":
      return {
        skin: rgb(208, 166, 132),
        hair: rgb(36, 28, 24),
        shirt: rgb(240, 236, 230),
        pants: rgb(32, 36, 48),
        accent: rgb(60, 90, 140),
        extra: rgb(28, 36, 56),
        metal: rgb(180, 170, 140),
      };
  }
}

export function clipDuration(clip: AnimClip): number {
  if (clip === "attack") return ATTACK_MS;
  if (clip === "cast") return CAST_MS;
  return 0;
}

function activeClip(u: Unit, now: number): { clip: AnimClip; t: number } {
  const dur = clipDuration(u.anim);
  if (dur > 0) {
    const t = (now - u.animStart) / dur;
    if (t < 1) return { clip: u.anim, t: Math.max(0, t) };
  }
  if (u.anim === "walk") return { clip: "walk", t: (now / 280) % 1 };
  return { clip: "idle", t: (now / 900) % 1 };
}

function poseOf(u: Unit, now: number): Pose {
  const { clip, t } = activeClip(u, now);
  const arch = u.archetype;
  const idle = Math.sin(now / 420 + u.x) * 0.012;
  const base: Pose = {
    bob: idle,
    crouch: arch === "wolverine" ? 0.08 : 0,
    lean: 0,
    armL: { pitch: arch === "wolverine" ? 0.35 : 0.08, yaw: 0.12 },
    armR: { pitch: arch === "wolverine" ? 0.35 : 0.08, yaw: -0.12 },
    legL: 0.04,
    legR: -0.04,
    weapon: 0,
  };
  if (clip === "idle") {
    base.bob = idle + Math.sin(now / 380) * 0.01;
    base.armL.pitch += Math.sin(now / 500) * 0.04;
    base.armR.pitch += Math.cos(now / 520) * 0.04;
    return base;
  }
  if (clip === "walk") {
    const s = Math.sin(t * Math.PI * 2);
    base.bob = Math.abs(s) * 0.03;
    base.legL = s * 0.55;
    base.legR = -s * 0.55;
    base.armL.pitch = -s * 0.5;
    base.armR.pitch = s * 0.5;
    return base;
  }
  if (clip === "attack") {
    const wind = t < 0.35 ? t / 0.35 : 0;
    const strike = t >= 0.35 && t < 0.62 ? (t - 0.35) / 0.27 : t >= 0.62 ? 1 : 0;
    const rec = t >= 0.62 ? (t - 0.62) / 0.38 : 0;
    if (arch === "wolverine") {
      base.crouch = 0.12 + wind * 0.1 - strike * 0.08;
      base.armL.pitch = 0.2 - strike * 1.1 + rec * 0.6;
      base.armR.pitch = 0.2 - strike * 1.1 + rec * 0.6;
      base.lean = strike * 0.25;
      return base;
    }
    if (arch === "boxer") {
      base.armR.pitch = -0.4 - wind * 0.5 + strike * 1.4 - rec * 0.6;
      base.armL.pitch = 0.6 - strike * 0.3;
      base.lean = strike * 0.2 - wind * 0.08;
      return base;
    }
    if (arch === "gunner") {
      base.armR.pitch = -0.9 - strike * 0.2;
      base.armR.yaw = -0.2;
      base.weapon = 0.2;
      return base;
    }
    base.armR.pitch = -0.3 - wind * 0.7 + strike * 1.5 - rec * 0.5;
    base.weapon = wind * 0.4 - strike * 0.8 + rec * 0.4;
    base.lean = (strike - wind) * 0.18;
    return base;
  }
  // cast
  const up = t < 0.5 ? t / 0.5 : 1 - (t - 0.5) / 0.5;
  base.armL.pitch = -0.2 - up * 1.1;
  base.armR.pitch = -0.2 - up * 1.1;
  base.bob = up * 0.04;
  base.lean = -up * 0.06;
  return base;
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

interface Box {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  col: RGB;
  pitch?: number;
  yaw?: number;
}

function pushBox(list: Box[], box: Box): void {
  list.push(box);
}

function shadeOf(face: number): number {
  // 0:+z top 1:+x 2:-x 3:+y 4:-y 5:-z
  return [1.18, 1.02, 0.7, 0.92, 0.78, 0.55][face] ?? 1;
}

function drawBoxes(ctx: CanvasRenderingContext2D, project: ProjectFn, boxes: Box[], zScale: number): void {
  type Face = { pts: Proj[]; fill: string; d: number };
  const faces: Face[] = [];
  for (const b of boxes) {
    const hx = b.w / 2;
    const hy = b.d / 2;
    const hz = b.h / 2;
    const pitch = b.pitch ?? 0;
    const yaw = b.yaw ?? 0;
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const corner = (ix: number, iy: number, iz: number): Proj => {
      let x = ix * hx;
      let y = iy * hy;
      let z = iz * hz;
      const y2 = y * cp - z * sp;
      const z2 = y * sp + z * cp;
      y = y2;
      z = z2;
      const x2 = x * cy - y * sy;
      y = x * sy + y * cy;
      x = x2;
      return project(b.x + x, b.y + y, b.z + z);
    };
    const c = [
      corner(-1, -1, -1),
      corner(1, -1, -1),
      corner(1, 1, -1),
      corner(-1, 1, -1),
      corner(-1, -1, 1),
      corner(1, -1, 1),
      corner(1, 1, 1),
      corner(-1, 1, 1),
    ];
    const idx: Array<[number, number, number, number]> = [
      [4, 5, 6, 7],
      [1, 2, 6, 5],
      [0, 3, 7, 4],
      [3, 2, 6, 7],
      [0, 1, 5, 4],
      [0, 1, 2, 3],
    ];
    for (let fi = 0; fi < 6; fi++) {
      const id = idx[fi];
      const pts = [c[id[0]], c[id[1]], c[id[2]], c[id[3]]];
      const ax = pts[1].x - pts[0].x;
      const ay = pts[1].y - pts[0].y;
      const bx = pts[2].x - pts[0].x;
      const by = pts[2].y - pts[0].y;
      if (ax * by - ay * bx < 0) continue;
      const d = (pts[0].d + pts[1].d + pts[2].d + pts[3].d) / 4;
      faces.push({ pts, fill: hex(b.col, shadeOf(fi)), d });
    }
  }
  faces.sort((a, b) => a.d - b.d);
  void zScale;
  for (const f of faces) {
    ctx.beginPath();
    ctx.moveTo(f.pts[0].x, f.pts[0].y);
    for (let i = 1; i < 4; i++) ctx.lineTo(f.pts[i].x, f.pts[i].y);
    ctx.closePath();
    ctx.fillStyle = f.fill;
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
}

export function drawRig(
  ctx: CanvasRenderingContext2D,
  project: ProjectFn,
  u: Unit,
  now: number,
  zoom: number,
): void {
  const pal = palettes(u.archetype, u.gender);
  const pose = poseOf(u, now);
  const arch = u.archetype;
  const woman = u.gender === "f";
  const feral = arch === "wolverine";
  const elite = arch === "crosby" || arch === "beckett";
  const scale = elite ? 1.1 : feral ? 0.82 : arch === "official" || arch === "hale" ? 1.04 : 1;
  const squat = pose.crouch;
  const hipZ = (0.32 - squat) * scale + pose.bob;
  const torsoH = (feral ? 0.22 : 0.3) * scale;
  const torsoZ = hipZ + 0.12 * scale + torsoH / 2;
  const boxes: Box[] = [];

  const hipW = (woman ? 0.2 : 0.18) * scale;
  const shW = (arch === "boxer" ? 0.28 : woman ? 0.2 : 0.22) * scale * (feral ? 0.9 : 1);

  pushBox(boxes, {
    x: 0,
    y: pose.lean * 0.02,
    z: hipZ,
    w: hipW,
    d: 0.12 * scale,
    h: 0.1 * scale,
    col: pal.pants,
  });

  pushBox(boxes, {
    x: 0,
    y: pose.lean * 0.05,
    z: torsoZ,
    w: shW,
    d: (feral ? 0.16 : 0.14) * scale,
    h: torsoH,
    col: pal.shirt,
    pitch: pose.lean,
  });

  const headZ = torsoZ + torsoH / 2 + 0.12 * scale + pose.bob * 0.2;
  const headS = (feral ? 0.16 : 0.15) * scale;
  pushBox(boxes, {
    x: 0,
    y: pose.lean * 0.08,
    z: headZ,
    w: headS,
    d: headS * 0.95,
    h: headS,
    col: pal.skin,
  });

  const hairH = feral ? 0.06 : woman ? 0.07 : 0.05;
  pushBox(boxes, {
    x: 0,
    y: pose.lean * 0.08 + (arch === "delinquent" ? 0.02 : 0),
    z: headZ + headS * 0.42,
    w: headS * (woman ? 1.05 : 0.98),
    d: headS * (arch === "delinquent" ? 1.2 : 1),
    h: hairH * scale,
    col: pal.hair,
  });
  if (woman && (arch === "dana" || arch === "priya" || arch === "official" || arch === "magician")) {
    pushBox(boxes, {
      x: 0,
      y: 0.08 * scale,
      z: headZ - 0.02,
      w: 0.07 * scale,
      d: 0.1 * scale,
      h: 0.16 * scale,
      col: pal.hair,
    });
  }
  if (arch === "mara") {
    pushBox(boxes, {
      x: 0.07 * scale,
      y: 0.05 * scale,
      z: headZ - 0.02,
      w: 0.05 * scale,
      d: 0.06 * scale,
      h: 0.12 * scale,
      col: pal.hair,
    });
  }
  if (feral) {
    pushBox(boxes, {
      x: -0.07 * scale,
      y: -0.02,
      z: headZ + 0.1 * scale,
      w: 0.05 * scale,
      d: 0.04 * scale,
      h: 0.08 * scale,
      col: pal.hair,
    });
    pushBox(boxes, {
      x: 0.07 * scale,
      y: -0.02,
      z: headZ + 0.1 * scale,
      w: 0.05 * scale,
      d: 0.04 * scale,
      h: 0.08 * scale,
      col: pal.hair,
    });
    pushBox(boxes, {
      x: 0,
      y: 0.14 * scale,
      z: hipZ + 0.02,
      w: 0.05 * scale,
      d: 0.14 * scale,
      h: 0.05 * scale,
      col: pal.hair,
    });
  }

  const leg = (side: number, pitch: number) => {
    const x = side * 0.07 * scale;
    pushBox(boxes, {
      x,
      y: 0,
      z: hipZ - 0.16 * scale,
      w: 0.07 * scale,
      d: 0.08 * scale,
      h: 0.28 * scale,
      col: pal.pants,
      pitch,
    });
    pushBox(boxes, {
      x,
      y: Math.sin(pitch) * 0.08,
      z: 0.04 * scale,
      w: 0.08 * scale,
      d: 0.1 * scale,
      h: 0.05 * scale,
      col: pal.extra,
    });
  };
  leg(-1, pose.legL);
  leg(1, pose.legR);

  const arm = (side: number, limb: Limb, col: RGB) => {
    const x = side * (shW * 0.55 + 0.03);
    const len = (feral ? 0.34 : 0.28) * scale;
    pushBox(boxes, {
      x,
      y: 0,
      z: torsoZ + torsoH * 0.15,
      w: 0.07 * scale,
      d: 0.07 * scale,
      h: len,
      col,
      pitch: limb.pitch,
      yaw: limb.yaw * side,
    });
    if (arch === "boxer") {
      const reach = Math.sin(limb.pitch) * len * 0.7;
      pushBox(boxes, {
        x,
        y: -reach,
        z: torsoZ + torsoH * 0.15 - Math.cos(limb.pitch) * len * 0.45,
        w: 0.09 * scale,
        d: 0.09 * scale,
        h: 0.09 * scale,
        col: pal.extra,
      });
    }
  };
  arm(-1, pose.armL, pal.skin);
  arm(1, pose.armR, pal.skin);

  if (arch === "priya") {
    pushBox(boxes, {
      x: -0.16 * scale,
      y: 0.02,
      z: hipZ + 0.08,
      w: 0.1 * scale,
      d: 0.08 * scale,
      h: 0.14 * scale,
      col: pal.extra,
    });
  }
  if (arch === "mara" || arch === "dana") {
    pushBox(boxes, {
      x: 0,
      y: 0.01,
      z: torsoZ + 0.02,
      w: shW * 1.12,
      d: 0.16 * scale,
      h: torsoH * 0.7,
      col: pal.extra,
    });
  }
  if (arch === "crosby" || arch === "beckett" || arch === "magician" || arch === "official") {
    pushBox(boxes, {
      x: 0,
      y: 0.06 * scale,
      z: torsoZ - 0.04,
      w: shW * 1.25,
      d: 0.2 * scale,
      h: torsoH * 1.15,
      col: pal.extra,
    });
  }
  if (arch === "worker") {
    pushBox(boxes, {
      x: 0,
      y: 0,
      z: headZ + headS * 0.55,
      w: headS * 1.15,
      d: headS * 1.15,
      h: 0.07 * scale,
      col: pal.metal,
    });
  }

  const rightHandY = -Math.sin(pose.armR.pitch) * 0.22 * scale;
  const rightHandZ = torsoZ - Math.cos(pose.armR.pitch) * 0.16 * scale;
  const hx = shW * 0.55 + 0.03;
  if (arch === "delinquent") {
    pushBox(boxes, {
      x: hx,
      y: rightHandY,
      z: rightHandZ,
      w: 0.04 * scale,
      d: 0.22 * scale,
      h: 0.04 * scale,
      col: pal.metal,
      pitch: pose.weapon + pose.armR.pitch,
    });
  } else if (arch === "mara" || arch === "dana") {
    pushBox(boxes, {
      x: hx,
      y: rightHandY,
      z: rightHandZ,
      w: 0.035 * scale,
      d: 0.2 * scale,
      h: 0.035 * scale,
      col: pal.metal,
      pitch: pose.weapon + pose.armR.pitch,
    });
  } else if (arch === "gunner" || arch === "crosby" || arch === "beckett") {
    pushBox(boxes, {
      x: hx,
      y: rightHandY - 0.04,
      z: rightHandZ + 0.02,
      w: 0.05 * scale,
      d: 0.12 * scale,
      h: 0.04 * scale,
      col: pal.metal,
      pitch: pose.armR.pitch,
    });
  } else if (arch === "wolverine") {
    for (const side of [-1, 1]) {
      pushBox(boxes, {
        x: side * (shW * 0.6),
        y: -0.16 * scale,
        z: torsoZ - 0.02,
        w: 0.04 * scale,
        d: 0.16 * scale,
        h: 0.03 * scale,
        col: pal.metal,
        pitch: pose.armR.pitch,
      });
    }
  } else if (arch === "magician") {
    pushBox(boxes, {
      x: 0,
      y: -0.1 * scale,
      z: torsoZ + torsoH * 0.6,
      w: 0.08 * scale,
      d: 0.08 * scale,
      h: 0.08 * scale,
      col: pal.accent,
    });
  }

  void zoom;
  drawBoxes(ctx, project, boxes, zoom);
}
