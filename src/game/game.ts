import { MISSIONS, makePlayerUnits, type Mission } from "../data/mission";
import { planEnemy } from "./ai";
import { makeAttackForecast, makeSkillForecast } from "./combat";
import { PointerInput } from "./input";
import { GameMap } from "./map";
import {
  attackableFrom,
  computeMoveRange,
  reconstructPath,
  skillTargets,
  type MoveField,
} from "./pathfinding";
import { Renderer } from "./renderer";
import {
  delay,
  dirFromTo,
  key,
  type FloatText,
  type Forecast,
  type Inspect,
  type Phase,
  type Tile,
  type Unit,
  type Vec2,
} from "./types";

function el<T extends HTMLElement>(id: string): T {
  const n = document.getElementById(id);
  if (!n) throw new Error(id);
  return n as T;
}

const ROLE_LABEL: Record<Unit["role"], string> = {
  striker: "突擊",
  controller: "控制",
  support: "支援",
  grunt: "現場",
  elite: "主管",
  civilian: "文官",
};

const TERRAIN_LABEL: Record<Tile["terrain"], string> = {
  street: "街道",
  stairs: "樓梯",
  roof: "屋頂",
};

const PROP_LABEL: Record<NonNullable<Tile["prop"]>, string> = {
  stall: "攤位",
  ac: "冷氣",
  lamp: "路燈",
  crate: "貨箱",
};

const TEAM_LABEL = { player: "我軍", enemy: "敵軍" };

export class Game {
  map: GameMap;
  units: Unit[] = [];
  phase: Phase = "briefing";
  turn = 1;
  selected: Unit | null = null;
  origin: Vec2 | null = null;
  originDir: Unit["dir"] = 0;
  field: MoveField | null = null;
  moveTiles = new Set<string>();
  actionTiles = new Set<string>();
  skillTiles = new Set<string>();
  forecast: Forecast | null = null;
  inspect: Inspect | null = null;
  floats: FloatText[] = [];
  busy = false;
  log = "";
  missionIndex = 0;
  loseKind: "wipe" | "protect" = "wipe";

  renderer: Renderer;
  input: PointerInput;

  private hudTurn = el<HTMLElement>("hud-turn");
  private hudPhase = el<HTMLElement>("hud-phase");
  private hudSub = el<HTMLElement>("hud-sub");
  private chip = el<HTMLElement>("unit-chip");
  private chipMark = el<HTMLElement>("chip-mark");
  private chipName = el<HTMLElement>("chip-name");
  private chipMeta = el<HTMLElement>("chip-meta");
  private chipExtra = el<HTMLElement>("chip-extra");
  private chipHp = el<HTMLElement>("chip-hp");
  private chipHpFill = el<HTMLElement>("chip-hp-fill");
  private forecastEl = el<HTMLElement>("forecast");
  private logEl = el<HTMLElement>("log");
  private briefing = el<HTMLElement>("briefing");
  private result = el<HTMLElement>("result");
  private resultKicker = el<HTMLElement>("result-kicker");
  private resultTitle = el<HTMLElement>("result-title");
  private resultBody = el<HTMLElement>("result-body");
  private btnCancel = el<HTMLButtonElement>("btn-cancel");
  private btnWait = el<HTMLButtonElement>("btn-wait");
  private btnSkill = el<HTMLButtonElement>("btn-skill");
  private btnConfirm = el<HTMLButtonElement>("btn-confirm");
  private btnEnd = el<HTMLButtonElement>("btn-end");
  private btnNext = el<HTMLButtonElement>("btn-next");
  private btnRotate = el<HTMLButtonElement>("btn-rotate");

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.input = new PointerInput(canvas, this.renderer);
    this.input.onTap = (p) => this.onTap(p);
    this.map = new GameMap(this.mission.map);
    this.resetBattle();

    window.addEventListener("resize", () => this.renderer.resize());
    el<HTMLButtonElement>("btn-start").addEventListener("click", () => this.begin());
    el<HTMLButtonElement>("btn-restart").addEventListener("click", () => this.restart());
    this.btnNext.addEventListener("click", () => this.nextMission());
    this.btnCancel.addEventListener("click", () => this.cancel());
    this.btnWait.addEventListener("click", () => void this.wait());
    this.btnSkill.addEventListener("click", () => this.armSkill());
    this.btnConfirm.addEventListener("click", () => void this.confirm());
    this.btnEnd.addEventListener("click", () => void this.endTurn());
    this.btnRotate.addEventListener("click", () => this.rotateMap());
  }

  get mission(): Mission {
    return MISSIONS[this.missionIndex] ?? MISSIONS[0];
  }

  start(): void {
    const shot = /(?:^|[?&])shot(?:=|$|&)/.test(location.search) || location.hash.includes("shot");
    let frames = 0;
    const loop = () => {
      this.floats = this.floats.filter((f) => performance.now() - f.born < f.life);
      this.renderer.draw(
        this.map,
        this.units,
        {
          move: this.phase === "select" ? this.moveTiles : new Set(),
          action: this.phase === "select" || this.phase === "forecast" ? this.actionTiles : new Set(),
          skill:
            this.phase === "skillAim" || (this.phase === "forecast" && this.forecast?.kind === "skill")
              ? this.skillTiles
              : new Set(),
          selected: this.selected,
          target: this.forecast?.target ?? null,
          inspect: this.inspectPos(),
          phase: this.phase,
        },
        this.floats,
      );
      frames += 1;
      if (!shot || frames < 20) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    this.syncUi();
  }

  applyHash(): void {
    const hash = location.hash.replace("#", "");
    if (hash === "m2" || hash === "play2" || hash === "inspect" || hash === "play2rot") {
      this.missionIndex = 1;
      this.resetBattle();
      if (hash === "m2") {
        this.briefing.hidden = false;
        this.syncUi();
        return;
      }
      this.begin();
      if (hash === "play2rot") this.rotateMap();
      if (hash === "inspect") {
        const u = this.units.find((x) => x.id === "beckett") ?? this.units.find((x) => x.team === "enemy");
        if (u) {
          this.inspect = { kind: "unit", unit: u };
          this.syncUi();
        }
      } else {
        const mara = this.units.find((x) => x.id === "mara");
        if (mara) this.selectUnit(mara);
      }
      return;
    }
    if (hash === "play") {
      this.begin();
      const mara = this.units.find((u) => u.id === "mara");
      if (mara) this.selectUnit(mara);
    }
  }

  private inspectPos(): Vec2 | null {
    if (!this.inspect) return null;
    if (this.inspect.kind === "unit") return { x: this.inspect.unit.x, y: this.inspect.unit.y };
    return { x: this.inspect.tile.x, y: this.inspect.tile.y };
  }

  private fillBriefing(): void {
    const m = this.mission;
    el<HTMLElement>("brief-num").textContent = m.number;
    el<HTMLElement>("brief-loc").textContent = m.loc;
    const body = el<HTMLElement>("brief-body");
    body.innerHTML = "";
    for (const p of m.paragraphs) {
      const n = document.createElement("p");
      n.textContent = p;
      body.appendChild(n);
    }
    const conds = el<HTMLElement>("brief-conds");
    conds.innerHTML = "";
    const win = document.createElement("li");
    win.innerHTML = `<span>勝利</span>`;
    win.append(m.winCond);
    const lose = document.createElement("li");
    lose.innerHTML = `<span>失敗</span>`;
    lose.append(m.loseCond);
    conds.append(win, lose);
    const voices = el<HTMLElement>("brief-voices");
    voices.innerHTML = "";
    for (const v of m.voices) {
      const n = document.createElement("p");
      const b = document.createElement("b");
      b.textContent = v.name;
      n.append(b, `「${v.line}」`);
      voices.appendChild(n);
    }
    this.hudSub.textContent = m.hudSub;
  }

  private resetBattle(): void {
    const m = this.mission;
    this.map = new GameMap(m.map);
    this.units = [...makePlayerUnits(m.starts), ...m.makeOthers()];
    this.phase = "briefing";
    this.turn = 1;
    this.clearSel();
    this.inspect = null;
    this.busy = false;
    this.loseKind = "wipe";
    this.log = "點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放。";
    this.renderer.yaw = 0;
    this.renderer.centerOn(this.units, this.map);
    this.fillBriefing();
  }

  private begin(): void {
    this.briefing.hidden = true;
    this.phase = "select";
    this.renderer.centerOn(this.units, this.map);
    this.syncUi();
  }

  private restart(): void {
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.briefing.hidden = false;
    this.resetBattle();
    this.syncUi();
  }

  private nextMission(): void {
    if (this.missionIndex >= MISSIONS.length - 1) return;
    this.missionIndex += 1;
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.briefing.hidden = false;
    this.resetBattle();
    this.syncUi();
  }

  private rotateMap(): void {
    if (this.phase === "briefing") return;
    this.renderer.rotate(this.map);
  }

  private clearSel(): void {
    this.selected = null;
    this.origin = null;
    this.field = null;
    this.moveTiles.clear();
    this.actionTiles.clear();
    this.skillTiles.clear();
    this.forecast = null;
  }

  private locked(): boolean {
    const u = this.selected;
    return !!u && (u.movedThisTurn || u.actedThisTurn);
  }

  private selectUnit(u: Unit): void {
    if (u.team !== "player" || u.acted || u.dead || u.npc) return;
    this.selected = u;
    this.origin = null;
    this.forecast = null;
    this.inspect = null;
    this.refreshRanges(u);
    this.phase = "select";
    this.log = `${u.name}　移動 ${u.mov}　跳躍 ${u.jmp}　可先攻擊或待機`;
    this.syncUi();
  }

  private refreshRanges(u: Unit): void {
    this.skillTiles.clear();
    if (!u.movedThisTurn) {
      this.field = computeMoveRange(u, this.map, this.units);
      this.moveTiles = new Set([...this.field.cost.keys()].filter((k) => k !== key(u.x, u.y)));
    } else {
      this.field = null;
      this.moveTiles.clear();
    }
    this.actionTiles = u.actedThisTurn ? new Set() : attackableFrom(u, this.map, this.units, 2);
  }

  private showCommand(u: Unit): void {
    this.refreshRanges(u);
    this.phase = "select";
    const bits: string[] = [];
    if (!u.movedThisTurn) bits.push("可移動");
    if (!u.actedThisTurn) bits.push("可攻擊／技能");
    this.log = bits.length ? bits.join("　") : "結束或待機";
    this.syncUi();
  }

  private async commitMove(dest: Vec2): Promise<void> {
    const u = this.selected;
    if (!u || !this.field || this.busy || u.movedThisTurn) return;
    const k = key(dest.x, dest.y);
    if (!this.field.cost.has(k)) return;
    if (dest.x === u.x && dest.y === u.y) return;
    this.busy = true;
    this.origin = { x: u.x, y: u.y };
    this.originDir = u.dir;
    const path = reconstructPath(this.field, dest);
    for (let i = 1; i < path.length; i++) {
      u.dir = dirFromTo(path[i - 1], path[i]);
      u.x = path[i].x;
      u.y = path[i].y;
      await delay(90);
    }
    u.movedThisTurn = true;
    this.busy = false;
    if (u.actedThisTurn) {
      await this.finishUnit();
      return;
    }
    this.showCommand(u);
  }

  private onTap(p: Vec2): void {
    if (this.busy) return;
    if (this.phase === "briefing" || this.phase === "enemy" || this.phase === "victory" || this.phase === "defeat") {
      return;
    }
    const tile = this.renderer.hitTile(p.x, p.y, this.map);
    if (this.phase === "forecast") {
      if (!tile || (this.forecast && (tile.x !== this.forecast.target.x || tile.y !== this.forecast.target.y))) {
        this.backFromForecast();
      }
      return;
    }
    if (this.phase === "skillAim") {
      if (tile) this.trySkillTarget(tile);
      else this.backFromSkill();
      return;
    }
    if (this.phase !== "select") return;

    if (!tile) {
      if (this.inspect) {
        this.inspect = null;
        this.syncUi();
        return;
      }
      if (this.selected && !this.locked()) {
        this.clearSel();
        this.syncUi();
      }
      return;
    }

    const u = this.unitAt(tile.x, tile.y);
    const sel = this.selected;

    if (sel && !sel.actedThisTurn && u && this.actionTiles.has(key(u.x, u.y))) {
      this.forecast = makeAttackForecast(sel, u, this.map);
      this.phase = "forecast";
      this.log = this.forecast.detail;
      this.inspect = null;
      this.syncUi();
      return;
    }

    if (sel && !sel.movedThisTurn && this.moveTiles.has(key(tile.x, tile.y)) && (!u || u.id === sel.id)) {
      if (u && u.id === sel.id) {
        this.inspectUnit(u);
        return;
      }
      this.inspect = null;
      void this.commitMove(tile);
      return;
    }

    if (u && u.team === "player" && !u.acted && !u.npc) {
      if (!sel || !this.locked()) {
        this.selectUnit(u);
        return;
      }
    }

    if (u) this.inspectUnit(u);
    else this.inspectTile(this.map.tile(tile.x, tile.y)!);
  }

  private inspectUnit(u: Unit): void {
    this.inspect = { kind: "unit", unit: u };
    this.log = `${u.name}　${TEAM_LABEL[u.team]}`;
    this.syncUi();
  }

  private inspectTile(t: Tile): void {
    this.inspect = { kind: "tile", tile: t };
    this.log = TERRAIN_LABEL[t.terrain];
    this.syncUi();
  }

  private trySkillTarget(tile: Vec2): void {
    const actor = this.selected;
    if (!actor) return;
    const targets = skillTargets(actor, this.map, this.units);
    const t = targets.find((u) => u.x === tile.x && u.y === tile.y);
    if (!t) {
      this.backFromSkill();
      return;
    }
    this.forecast = makeSkillForecast(actor, t, this.map);
    this.phase = "forecast";
    this.log = this.forecast.detail;
    this.syncUi();
  }

  private backFromForecast(): void {
    if (!this.selected) return;
    if (this.skillTiles.size && this.forecast?.kind === "skill") {
      this.forecast = null;
      this.phase = "skillAim";
      this.syncUi();
      return;
    }
    this.forecast = null;
    this.showCommand(this.selected);
  }

  private backFromSkill(): void {
    this.skillTiles.clear();
    this.forecast = null;
    if (this.selected) this.showCommand(this.selected);
  }

  cancel(): void {
    if (this.busy) return;
    if (this.phase === "forecast") {
      this.backFromForecast();
      return;
    }
    if (this.phase === "skillAim") {
      this.backFromSkill();
      return;
    }
    if (this.inspect) {
      this.inspect = null;
      this.syncUi();
      return;
    }
    if (this.selected && this.origin && this.selected.movedThisTurn) {
      this.selected.x = this.origin.x;
      this.selected.y = this.origin.y;
      this.selected.dir = this.originDir;
      this.selected.movedThisTurn = false;
      this.origin = null;
      this.showCommand(this.selected);
      return;
    }
    if (this.selected && !this.locked()) {
      this.clearSel();
      this.phase = "select";
      this.syncUi();
    }
  }

  armSkill(): void {
    const u = this.selected;
    if (!u || this.busy || u.skillUsed || !u.skillName || u.actedThisTurn) return;
    if (this.phase !== "select" && this.phase !== "skillAim") return;
    const targets = skillTargets(u, this.map, this.units);
    this.skillTiles = new Set(targets.map((t) => key(t.x, t.y)));
    this.actionTiles.clear();
    this.moveTiles.clear();
    this.forecast = null;
    this.inspect = null;
    this.phase = "skillAim";
    this.log = u.skillHint;
    this.syncUi();
  }

  async wait(): Promise<void> {
    if (!this.selected || this.busy) return;
    if (this.phase !== "select") return;
    await this.finishUnit();
  }

  async confirm(): Promise<void> {
    if (this.phase !== "forecast" || !this.forecast || this.busy) return;
    const f = this.forecast;
    this.busy = true;
    const actor = f.actor;
    const target = f.target;
    actor.dir = dirFromTo(actor, target);
    actor.lunge = 1;
    await delay(140);
    if (f.heal) {
      target.hp = Math.min(target.maxHp, target.hp + f.heal);
      this.spawnFloat(target, `+${f.heal}`, "#7dffb3");
      this.log = `${actor.name} 為 ${target.name} 回復 ${f.heal}`;
    } else {
      target.hp = Math.max(0, target.hp - f.dmg);
      this.spawnFloat(target, `${f.dmg}`, "#ffd0d8");
      this.log = `${actor.name} 對 ${target.name} 造成 ${f.dmg} 傷害`;
      if (f.skip) {
        target.skipNext = true;
        this.log += "　攔住生效";
      }
      if (target.hp <= 0) {
        target.dead = true;
        this.log = `${target.name} 倒下。`;
      }
    }
    if (f.kind === "skill") actor.skillUsed = true;
    actor.actedThisTurn = true;
    actor.lunge = 0;
    await delay(280);
    this.busy = false;
    if (this.checkEnd()) return;
    if (actor.movedThisTurn) {
      await this.finishUnit();
      return;
    }
    this.forecast = null;
    this.skillTiles.clear();
    this.showCommand(actor);
  }

  private async finishUnit(): Promise<void> {
    if (this.selected) {
      this.selected.acted = true;
      this.selected.lunge = 0;
    }
    this.clearSel();
    this.inspect = null;
    this.phase = "select";
    this.syncUi();
    if (this.units.filter((u) => u.team === "player" && !u.dead && !u.acted && !u.npc).length === 0) {
      await this.endTurn();
    }
  }

  private async endTurn(): Promise<void> {
    if (this.busy) return;
    for (const u of this.units) if (u.team === "player" && !u.dead && !u.npc) u.acted = true;
    this.clearSel();
    this.inspect = null;
    this.phase = "enemy";
    this.log = "敵軍行動中";
    this.syncUi();
    await this.runEnemy();
  }

  private async runEnemy(): Promise<void> {
    this.busy = true;
    const enemies = this.units.filter((u) => u.team === "enemy" && !u.dead);
    const protectId = this.mission.protectId;
    for (const e of enemies) {
      if (this.phase === "victory" || this.phase === "defeat") break;
      if (e.skipNext) {
        e.skipNext = false;
        this.log = `${e.name} 被攔住，無法行動。`;
        this.syncUi();
        await delay(420);
        continue;
      }
      const plan = planEnemy(e, this.map, this.units, protectId);
      for (let i = 1; i < plan.path.length; i++) {
        e.dir = dirFromTo(plan.path[i - 1], plan.path[i]);
        e.x = plan.path[i].x;
        e.y = plan.path[i].y;
        await delay(85);
      }
      if (plan.target && !plan.target.dead) {
        e.dir = dirFromTo(e, plan.target);
        e.lunge = 1;
        const f = makeAttackForecast(e, plan.target, this.map);
        plan.target.hp = Math.max(0, plan.target.hp - f.dmg);
        this.spawnFloat(plan.target, `${f.dmg}`, "#ff4d6d");
        this.log = `${e.name} 對 ${plan.target.name} 造成 ${f.dmg} 傷害`;
        if (plan.target.hp <= 0) {
          plan.target.dead = true;
          this.log = `${plan.target.name} 倒下。`;
        }
        await delay(160);
        e.lunge = 0;
        await delay(220);
        if (this.checkEnd()) {
          this.busy = false;
          return;
        }
      } else {
        await delay(120);
      }
    }
    for (const u of this.units) {
      if (u.team === "player" && !u.npc) {
        u.acted = false;
        u.skillUsed = false;
        u.movedThisTurn = false;
        u.actedThisTurn = false;
      }
    }
    this.turn += 1;
    this.phase = "select";
    this.busy = false;
    this.log = "我軍階段";
    this.syncUi();
  }

  private checkEnd(): boolean {
    const protectId = this.mission.protectId;
    if (protectId) {
      const ward = this.units.find((u) => u.id === protectId);
      if (ward?.dead) {
        this.loseKind = "protect";
        this.lose();
        return true;
      }
    }
    const elite = this.units.find((u) => u.id === this.mission.eliteId);
    if (elite?.dead) {
      this.win();
      return true;
    }
    if (this.units.every((u) => u.team !== "player" || u.dead || u.npc)) {
      this.loseKind = "wipe";
      this.lose();
      return true;
    }
    return false;
  }

  private win(): void {
    const m = this.mission;
    this.phase = "victory";
    this.busy = false;
    this.clearSel();
    this.inspect = null;
    this.result.hidden = false;
    this.result.classList.remove("lose");
    this.resultKicker.textContent = "勝利";
    this.resultTitle.textContent = m.winTitle;
    this.resultBody.textContent = m.winBody;
    this.btnNext.hidden = this.missionIndex >= MISSIONS.length - 1;
    this.syncUi();
  }

  private lose(): void {
    const m = this.mission;
    this.phase = "defeat";
    this.busy = false;
    this.clearSel();
    this.inspect = null;
    this.result.hidden = false;
    this.result.classList.add("lose");
    this.resultKicker.textContent = "失敗";
    if (this.loseKind === "protect") {
      this.resultTitle.textContent = m.protectLoseTitle;
      this.resultBody.textContent = m.protectLoseBody;
    } else {
      this.resultTitle.textContent = m.loseTitle;
      this.resultBody.textContent = m.loseBody;
    }
    this.btnNext.hidden = true;
    this.syncUi();
  }

  private unitAt(x: number, y: number): Unit | undefined {
    return this.units.find((u) => !u.dead && u.x === x && u.y === y);
  }

  private spawnFloat(u: Unit, text: string, color: string): void {
    this.floats.push({ x: u.x, y: u.y, text, color, born: performance.now(), life: 900 });
  }

  private paintUnitChip(u: Unit, inspecting: boolean): void {
    this.chip.hidden = false;
    this.chipHp.hidden = false;
    const team = u.npc ? "保護" : TEAM_LABEL[u.team];
    this.chipName.textContent = `${u.name}　${u.title}`;
    this.chipMeta.textContent = `${team}　${ROLE_LABEL[u.role]}　生命 ${u.hp}/${u.maxHp}　攻擊 ${u.atk}　防禦 ${u.def}　移動 ${u.mov}　跳躍 ${u.jmp}`;
    this.chipHpFill.style.width = `${(100 * u.hp) / u.maxHp}%`;
    this.chipMark.style.background = u.npc ? "#ffc857" : u.team === "player" ? "#3ef0d0" : "#ff4d6d";
    if (u.skillName) {
      this.chipExtra.hidden = false;
      this.chipExtra.textContent = `${u.skillName}　${u.skillHint}`;
    } else {
      this.chipExtra.hidden = !inspecting;
      this.chipExtra.textContent = inspecting ? "無技能" : "";
      if (!inspecting) this.chipExtra.hidden = true;
    }
  }

  private paintTileChip(t: Tile): void {
    this.chip.hidden = false;
    this.chipHp.hidden = true;
    this.chipName.textContent = TERRAIN_LABEL[t.terrain];
    const bits = [`高度 ${t.h}`, t.blocked ? "阻擋" : "可走", TERRAIN_LABEL[t.terrain]];
    if (t.prop) bits.push(PROP_LABEL[t.prop]);
    this.chipMeta.textContent = bits.join("　");
    this.chipExtra.hidden = false;
    this.chipExtra.textContent = t.blocked ? "無法站上此格。" : "可以走。";
    this.chipMark.style.background = t.blocked ? "#ff4d6d" : "#3ef0d0";
  }

  private syncUi(): void {
    this.hudTurn.textContent = `回合 ${this.turn}`;
    this.hudPhase.textContent =
      this.phase === "enemy" ? "敵軍" : this.phase === "victory" ? "勝利" : this.phase === "defeat" ? "失敗" : "我軍";
    this.hudSub.textContent = this.mission.hudSub;
    this.logEl.textContent = this.log;

    const play =
      this.phase === "select" || this.phase === "skillAim" || this.phase === "forecast";
    const u = this.selected;

    if (this.inspect && play) {
      if (this.inspect.kind === "unit") this.paintUnitChip(this.inspect.unit, true);
      else this.paintTileChip(this.inspect.tile);
    } else if (u && play) {
      this.paintUnitChip(u, false);
    } else {
      this.chip.hidden = true;
    }

    if (this.forecast && this.phase === "forecast") {
      this.forecastEl.hidden = false;
      const cls = this.forecast.heal ? "good" : "bad";
      this.forecastEl.innerHTML = `<div><b>${this.forecast.label}</b></div><div class="${cls}">${this.forecast.detail}</div><div>點確認出手，取消返回。</div>`;
    } else {
      this.forecastEl.hidden = true;
    }

    const commanding = !!u && this.phase === "select";
    this.btnCancel.disabled = (!u && !this.inspect) || this.phase === "enemy" || this.busy;
    this.btnWait.disabled = !commanding || this.busy;
    this.btnWait.textContent = u && (u.movedThisTurn || u.actedThisTurn) ? "結束" : "待機";
    this.btnSkill.disabled =
      !u ||
      !u.skillName ||
      u.skillUsed ||
      u.actedThisTurn ||
      this.busy ||
      (this.phase !== "select" && this.phase !== "skillAim");
    this.btnSkill.classList.toggle("armed", this.phase === "skillAim");
    this.btnConfirm.disabled = this.phase !== "forecast" || this.busy;
    const leftover = this.units.some((x) => x.team === "player" && !x.dead && !x.acted && !x.npc);
    const hideChrome =
      this.phase === "enemy" || this.phase === "briefing" || this.phase === "victory" || this.phase === "defeat";
    this.btnEnd.hidden = !leftover || hideChrome;
    this.btnRotate.hidden = hideChrome;
  }
}
