import { makeEnemyUnits, makePlayerUnits, ELITE_ID } from "../data/mission";
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
  type Phase,
  type Unit,
  type Vec2,
} from "./types";

function el<T extends HTMLElement>(id: string): T {
  const n = document.getElementById(id);
  if (!n) throw new Error(id);
  return n as T;
}

export class Game {
  map = new GameMap();
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
  floats: FloatText[] = [];
  busy = false;
  log = "";

  renderer: Renderer;
  input: PointerInput;

  private hudTurn = el<HTMLElement>("hud-turn");
  private hudPhase = el<HTMLElement>("hud-phase");
  private chip = el<HTMLElement>("unit-chip");
  private chipMark = el<HTMLElement>("chip-mark");
  private chipName = el<HTMLElement>("chip-name");
  private chipMeta = el<HTMLElement>("chip-meta");
  private chipHp = el<HTMLElement>("chip-hp-fill");
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

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.input = new PointerInput(canvas, this.renderer);
    this.input.onTap = (p) => this.onTap(p);
    this.resetBattle();

    window.addEventListener("resize", () => this.renderer.resize());
    el<HTMLButtonElement>("btn-start").addEventListener("click", () => this.begin());
    el<HTMLButtonElement>("btn-restart").addEventListener("click", () => this.restart());
    this.btnCancel.addEventListener("click", () => this.cancel());
    this.btnWait.addEventListener("click", () => void this.wait());
    this.btnSkill.addEventListener("click", () => this.armSkill());
    this.btnConfirm.addEventListener("click", () => void this.confirm());
    this.btnEnd.addEventListener("click", () => void this.endTurn());
  }

  start(): void {
    const loop = () => {
      this.floats = this.floats.filter((f) => performance.now() - f.born < f.life);
      this.renderer.draw(
        this.map,
        this.units,
        {
          move: this.phase === "select" ? this.moveTiles : new Set(),
          action: this.phase === "moved" || this.phase === "forecast" ? this.actionTiles : new Set(),
          skill: this.phase === "skillAim" || (this.phase === "forecast" && this.forecast?.kind === "skill")
            ? this.skillTiles
            : new Set(),
          selected: this.selected,
          target: this.forecast?.target ?? null,
          phase: this.phase,
        },
        this.floats,
      );
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    this.syncUi();
  }

  private resetBattle(): void {
    this.units = [...makePlayerUnits(), ...makeEnemyUnits()];
    this.phase = "briefing";
    this.turn = 1;
    this.clearSel();
    this.busy = false;
    this.log = "點選單位開始行動。拖曳平移，雙指縮放。";
    this.renderer.centerOn(this.units, this.map);
  }

  private begin(): void {
    this.briefing.hidden = true;
    this.phase = "select";
    this.renderer.centerOn(this.units, this.map);
    if (location.hash === "#play") {
      const mara = this.units.find((u) => u.id === "mara");
      if (mara) this.selectUnit(mara);
    }
    this.syncUi();
  }

  private restart(): void {
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.briefing.hidden = false;
    this.resetBattle();
    this.syncUi();
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

  private selectUnit(u: Unit): void {
    if (u.team !== "player" || u.acted || u.dead) return;
    this.selected = u;
    this.origin = null;
    this.forecast = null;
    this.field = computeMoveRange(u, this.map, this.units);
    this.moveTiles = new Set(this.field.cost.keys());
    this.actionTiles.clear();
    this.skillTiles.clear();
    this.phase = "select";
    this.log = `${u.name}　移動 ${u.mov}　跳躍 ${u.jmp}`;
    this.syncUi();
  }

  private showActions(u: Unit): void {
    this.actionTiles = attackableFrom(u, this.map, this.units, 2);
    this.skillTiles.clear();
    this.phase = "moved";
    this.log = "選擇攻擊目標，或待機／技能。取消可撤回移動。";
    this.syncUi();
  }

  private async commitMove(dest: Vec2): Promise<void> {
    const u = this.selected;
    if (!u || !this.field || this.busy) return;
    const k = key(dest.x, dest.y);
    if (!this.field.cost.has(k)) return;
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
    this.busy = false;
    this.showActions(u);
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
    if (this.phase === "moved") {
      if (!tile) {
        this.cancel();
        return;
      }
      const u = this.unitAt(tile.x, tile.y);
      if (u && this.actionTiles.has(key(u.x, u.y))) {
        this.forecast = makeAttackForecast(this.selected!, u, this.map);
        this.phase = "forecast";
        this.log = this.forecast.detail;
        this.syncUi();
        return;
      }
      this.cancel();
      return;
    }
    if (this.phase === "select") {
      if (!tile) {
        this.clearSel();
        this.syncUi();
        return;
      }
      const u = this.unitAt(tile.x, tile.y);
      if (this.selected && this.moveTiles.has(key(tile.x, tile.y))) {
        if (u && u.id !== this.selected.id) {
          if (u.team === "player" && !u.acted) this.selectUnit(u);
          else if (u.team === "enemy") {
            const atk = attackableFrom(this.selected, this.map, this.units, 2);
            if (atk.has(key(u.x, u.y))) {
              this.origin = { x: this.selected.x, y: this.selected.y };
              this.originDir = this.selected.dir;
              this.forecast = makeAttackForecast(this.selected, u, this.map);
              this.actionTiles = atk;
              this.phase = "forecast";
              this.log = this.forecast.detail;
              this.syncUi();
            }
          }
          return;
        }
        void this.commitMove(tile);
        return;
      }
      if (u && u.team === "player" && !u.acted) {
        this.selectUnit(u);
        return;
      }
      this.clearSel();
      this.syncUi();
    }
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
    } else {
      this.forecast = null;
      this.phase = this.origin && (this.origin.x !== this.selected.x || this.origin.y !== this.selected.y || true)
        ? "moved"
        : "moved";
      this.showActions(this.selected);
      return;
    }
    this.syncUi();
  }

  private backFromSkill(): void {
    this.skillTiles.clear();
    this.forecast = null;
    if (this.selected) this.showActions(this.selected);
  }

  cancel(): void {
    if (this.busy || !this.selected) return;
    if (this.phase === "forecast") {
      this.backFromForecast();
      return;
    }
    if (this.phase === "skillAim") {
      this.backFromSkill();
      return;
    }
    if (this.phase === "moved" && this.origin) {
      this.selected.x = this.origin.x;
      this.selected.y = this.origin.y;
      this.selected.dir = this.originDir;
      this.origin = null;
      this.selectUnit(this.selected);
      return;
    }
    if (this.phase === "select") {
      this.clearSel();
      this.phase = "select";
      this.syncUi();
    }
  }

  armSkill(): void {
    const u = this.selected;
    if (!u || this.busy || u.skillUsed || !u.skillName) return;
    if (this.phase === "select") {
      this.origin = { x: u.x, y: u.y };
      this.originDir = u.dir;
    }
    if (this.phase !== "moved" && this.phase !== "select" && this.phase !== "skillAim") return;
    const targets = skillTargets(u, this.map, this.units);
    this.skillTiles = new Set(targets.map((t) => key(t.x, t.y)));
    this.actionTiles.clear();
    this.moveTiles.clear();
    this.forecast = null;
    this.phase = "skillAim";
    this.log = u.skillHint;
    this.syncUi();
  }

  async wait(): Promise<void> {
    if (!this.selected || this.busy) return;
    if (this.phase !== "select" && this.phase !== "moved") return;
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
    actor.lunge = 0;
    await delay(280);
    this.busy = false;
    if (this.checkEnd()) return;
    await this.finishUnit();
  }

  private async finishUnit(): Promise<void> {
    if (this.selected) {
      this.selected.acted = true;
      this.selected.lunge = 0;
    }
    this.clearSel();
    this.phase = "select";
    this.syncUi();
    if (this.units.filter((u) => u.team === "player" && !u.dead && !u.acted).length === 0) {
      await this.endTurn();
    }
  }

  private async endTurn(): Promise<void> {
    if (this.busy) return;
    for (const u of this.units) if (u.team === "player" && !u.dead) u.acted = true;
    this.clearSel();
    this.phase = "enemy";
    this.log = "敵軍行動中";
    this.syncUi();
    await this.runEnemy();
  }

  private async runEnemy(): Promise<void> {
    this.busy = true;
    const enemies = this.units.filter((u) => u.team === "enemy" && !u.dead);
    for (const e of enemies) {
      if (this.phase === "victory" || this.phase === "defeat") break;
      if (e.skipNext) {
        e.skipNext = false;
        this.log = `${e.name} 被攔住，無法行動。`;
        this.syncUi();
        await delay(420);
        continue;
      }
      const plan = planEnemy(e, this.map, this.units);
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
      if (u.team === "player") {
        u.acted = false;
        u.skillUsed = false;
      }
    }
    this.turn += 1;
    this.phase = "select";
    this.busy = false;
    this.log = "我軍階段";
    this.syncUi();
  }

  private checkEnd(): boolean {
    const elite = this.units.find((u) => u.id === ELITE_ID);
    if (elite?.dead) {
      this.win();
      return true;
    }
    if (this.units.every((u) => u.team !== "player" || u.dead)) {
      this.lose();
      return true;
    }
    return false;
  }

  private win(): void {
    this.phase = "victory";
    this.busy = false;
    this.clearSel();
    this.result.hidden = false;
    this.result.classList.remove("lose");
    this.resultKicker.textContent = "勝利";
    this.resultTitle.textContent = "現場結束了。";
    this.resultBody.textContent = "Crosby 倒下。其餘的人散了。市場還開著。";
    this.syncUi();
  }

  private lose(): void {
    this.phase = "defeat";
    this.busy = false;
    this.clearSel();
    this.result.hidden = false;
    this.result.classList.add("lose");
    this.resultKicker.textContent = "失敗";
    this.resultTitle.textContent = "三個人都倒下了。";
    this.resultBody.textContent = "沒人能繼續。屋頂上的人還在。";
    this.syncUi();
  }

  private unitAt(x: number, y: number): Unit | undefined {
    return this.units.find((u) => !u.dead && u.x === x && u.y === y);
  }

  private spawnFloat(u: Unit, text: string, color: string): void {
    this.floats.push({ x: u.x, y: u.y, text, color, born: performance.now(), life: 900 });
  }

  private syncUi(): void {
    this.hudTurn.textContent = `回合 ${this.turn}`;
    this.hudPhase.textContent =
      this.phase === "enemy" ? "敵軍" : this.phase === "victory" ? "勝利" : this.phase === "defeat" ? "失敗" : "我軍";
    this.logEl.textContent = this.log;

    const play = this.phase === "select" || this.phase === "moved" || this.phase === "skillAim" || this.phase === "forecast";
    const u = this.selected;
    if (u && play) {
      this.chip.hidden = false;
      this.chipName.textContent = `${u.name}　${u.title}`;
      this.chipMeta.textContent = `生命 ${u.hp}/${u.maxHp}　攻擊 ${u.atk}　移動 ${u.mov}　跳躍 ${u.jmp}${u.skillName ? "　技能 " + u.skillName : ""}`;
      this.chipHp.style.width = `${(100 * u.hp) / u.maxHp}%`;
      this.chipMark.style.background = u.team === "player" ? "#3ef0d0" : "#ff4d6d";
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

    this.btnCancel.disabled = !u || this.phase === "enemy" || this.busy;
    this.btnWait.disabled = !u || (this.phase !== "select" && this.phase !== "moved") || this.busy;
    this.btnSkill.disabled = !u || !u.skillName || u.skillUsed || this.busy || (this.phase !== "select" && this.phase !== "moved" && this.phase !== "skillAim");
    this.btnSkill.classList.toggle("armed", this.phase === "skillAim");
    this.btnConfirm.disabled = this.phase !== "forecast" || this.busy;
    const leftover = this.units.some((x) => x.team === "player" && !x.dead && !x.acted);
    this.btnEnd.hidden = !leftover || this.phase === "enemy" || this.phase === "briefing" || this.phase === "victory" || this.phase === "defeat";
  }
}
