import { MISSIONS, makePlayerUnits, type Mission } from "../data/mission";
import { planEnemy } from "./ai";
import { makeAttackForecast, makeSkillForecast } from "./combat";
import { PointerInput } from "./input";
import {
  BANDAGE_HEAL,
  ITEMS,
  START_INVENTORY,
  STIM_ATK,
  addItem,
  cloneInventory,
  itemAllies,
  takeItem,
  type ItemId,
  type ItemStack,
} from "./items";
import { GameMap } from "./map";
import {
  attackableFrom,
  computeMoveRange,
  reconstructPath,
  skillTargets,
  type MoveField,
} from "./pathfinding";
import { audio } from "./audio";
import { PITCH_DEFAULT, Renderer } from "./renderer";
import {
  SLOT_COUNT,
  formatStamp,
  latestSave,
  loadStore,
  writeStore,
  type SaveGame,
  type SavedUnit,
} from "./save";
import { loadSprites } from "./sprites";
import {
  DIFF_LABEL,
  delay,
  dirFromTo,
  key,
  scaleEnemy,
  type Diff,
  type FloatText,
  type Forecast,
  type Inspect,
  type Phase,
  type Tile,
  type Unit,
  type Vec2,
} from "./types";
import { BUILD_STAMP, VERSION } from "./version";

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
  phase: Phase = "title";
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
  intel: Diff = "M";
  power: Diff = "M";
  inventory: ItemStack[] = cloneInventory(START_INVENTORY);
  missionStartInventory: ItemStack[] = cloneInventory(START_INVENTORY);
  pendingItem: ItemId | null = null;
  m1DropGiven = false;
  modalKind: "off" | "bag" | "save" | "load" | "target" = "off";
  paused = false;
  pauseOpen = false;

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
  private title = el<HTMLElement>("title");
  private briefing = el<HTMLElement>("briefing");
  private result = el<HTMLElement>("result");
  private resultKicker = el<HTMLElement>("result-kicker");
  private resultTitle = el<HTMLElement>("result-title");
  private resultBody = el<HTMLElement>("result-body");
  private modal = el<HTMLElement>("modal");
  private modalKicker = el<HTMLElement>("modal-kicker");
  private modalTitle = el<HTMLElement>("modal-title");
  private modalBody = el<HTMLElement>("modal-body");
  private confirmEl = el<HTMLElement>("confirm");
  private confirmText = el<HTMLElement>("confirm-text");
  private btnCancel = el<HTMLButtonElement>("btn-cancel");
  private btnWait = el<HTMLButtonElement>("btn-wait");
  private btnSkill = el<HTMLButtonElement>("btn-skill");
  private btnConfirm = el<HTMLButtonElement>("btn-confirm");
  private btnEnd = el<HTMLButtonElement>("btn-end");
  private btnNext = el<HTMLButtonElement>("btn-next");
  private btnRotate = el<HTMLButtonElement>("btn-rotate");
  private btnPause = el<HTMLButtonElement>("btn-pause");
  private btnContinue = el<HTMLButtonElement>("btn-continue");
  private btnMute = el<HTMLButtonElement>("btn-mute");
  private pauseEl = el<HTMLElement>("pause");
  private titleBuild = el<HTMLElement>("title-build");
  private camHint = el<HTMLElement>("cam-hint");
  private yawSlider = el<HTMLInputElement>("yaw-slider");
  private pitchSlider = el<HTMLInputElement>("pitch-slider");
  private pendingSlot: number | null = null;
  private pendingQuit = false;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas);
    this.input = new PointerInput(canvas, this.renderer);
    this.input.onTap = (p) => this.onTap(p);
    this.map = new GameMap(this.mission.map);
    this.resetBattle();
    this.phase = "title";
    this.briefing.hidden = true;
    this.title.hidden = false;

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
    this.btnPause.addEventListener("click", () => this.openPause());
    el<HTMLButtonElement>("btn-new").addEventListener("click", () => this.newGame());
    this.btnContinue.addEventListener("click", () => this.continueGame());
    el<HTMLButtonElement>("btn-load").addEventListener("click", () => this.openSaves("load"));
    el<HTMLButtonElement>("btn-bag-title").addEventListener("click", () => this.openBag());
    el<HTMLButtonElement>("btn-refresh").addEventListener("click", () => void this.refreshApp());
    el<HTMLButtonElement>("btn-brief-title").addEventListener("click", () => this.goTitle());
    el<HTMLButtonElement>("btn-result-title").addEventListener("click", () => this.goTitle());
    el<HTMLButtonElement>("btn-resume").addEventListener("click", () => this.closePause());
    el<HTMLButtonElement>("btn-pause-bag").addEventListener("click", () => this.openBag());
    el<HTMLButtonElement>("btn-pause-save").addEventListener("click", () => this.openSaves("save"));
    el<HTMLButtonElement>("btn-pause-load").addEventListener("click", () => this.openSaves("load"));
    this.btnMute.addEventListener("click", () => this.toggleMute());
    el<HTMLButtonElement>("btn-quit-title").addEventListener("click", () => this.quitToTitle());
    el<HTMLButtonElement>("modal-close").addEventListener("click", () => this.closeModal());
    el<HTMLButtonElement>("confirm-yes").addEventListener("click", () => this.confirmYes());
    el<HTMLButtonElement>("confirm-no").addEventListener("click", () => this.confirmNo());
    this.bindSeg("seg-intel", (v) => {
      this.intel = v;
    });
    this.bindSeg("seg-power", (v) => {
      this.power = v;
    });
    this.yawSlider.addEventListener("input", () => {
      this.renderer.yaw = Number(this.yawSlider.value) / 100;
    });
    this.pitchSlider.addEventListener("input", () => {
      this.renderer.setPitch(Number(this.pitchSlider.value));
    });
    this.modalBody.addEventListener("click", (e) => this.onModalClick(e));
    this.titleBuild.textContent = `版本 ${VERSION}　${BUILD_STAMP}`;
    this.syncMuteBtn();
    void loadSprites();
    audio.setBgm("title");
    this.refreshContinue();
  }

  get mission(): Mission {
    return MISSIONS[this.missionIndex] ?? MISSIONS[0];
  }

  private async waitMs(ms: number): Promise<void> {
    const end = performance.now() + ms;
    while (performance.now() < end) {
      while (this.paused) await delay(40);
      const left = end - performance.now();
      if (left <= 0) break;
      await delay(Math.min(40, left));
    }
  }

  start(): void {
    const shot = /(?:^|[?&])shot(?:=|$|&)/.test(location.search) || location.hash.includes("shot");
    const paint = () => {
      this.floats = this.floats.filter((f) => performance.now() - f.born < f.life);
      this.renderer.draw(
        this.map,
        this.units,
        {
          move: this.phase === "select" ? this.moveTiles : new Set(),
          action: this.phase === "select" || this.phase === "forecast" ? this.actionTiles : new Set(),
          skill:
            this.phase === "skillAim" ||
            this.phase === "itemAim" ||
            (this.phase === "forecast" && this.forecast?.kind === "skill")
              ? this.skillTiles
              : new Set(),
          selected: this.selected,
          target: this.forecast?.target ?? null,
          inspect: this.inspectPos(),
          phase: this.phase,
        },
        this.floats,
      );
    };
    this.syncUi();
    if (shot) {
      this.renderer.forceSize(390, 640);
      this.renderer.centerOn(this.units, this.map);
      for (let i = 0; i < 8; i++) paint();
      const img = document.createElement("img");
      img.alt = "board";
      img.src = this.renderer.canvas.toDataURL("image/png");
      img.style.cssText = "position:absolute;left:0;right:0;top:48px;width:100%;height:auto;z-index:1;pointer-events:none";
      this.renderer.canvas.insertAdjacentElement("afterend", img);
      return;
    }
    const loop = () => {
      paint();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  applyHash(): void {
    const hash = location.hash.replace("#", "");
    if (hash === "inv") {
      this.openBag();
      return;
    }
    if (hash === "save") {
      this.openSaves("load");
      return;
    }
    if (hash === "m2" || hash === "play2" || hash === "inspect" || hash === "play2rot") {
      this.missionIndex = 1;
      this.resetBattle();
      this.title.hidden = true;
      if (hash === "m2") {
        this.phase = "briefing";
        this.briefing.hidden = false;
        this.syncUi();
        return;
      }
      this.begin();
      if (hash === "play2rot") {
        this.renderer.yaw = Math.PI / 2;
        this.renderer.centerOn(this.units, this.map);
      }
      const dana2 = this.units.find((x) => x.id === "dana");
      if (dana2 && hash !== "inspect") dana2.acted = true;
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
    if (hash === "play" || hash === "brief") {
      this.title.hidden = true;
      this.resetBattle();
      if (hash === "brief") {
        this.phase = "briefing";
        this.briefing.hidden = false;
        this.syncUi();
        return;
      }
      this.begin();
      const mara = this.units.find((u) => u.id === "mara");
      if (mara) this.selectUnit(mara);
      const dana = this.units.find((u) => u.id === "dana");
      if (dana) dana.acted = true;
    }
  }

  private bindSeg(id: string, set: (v: Diff) => void): void {
    const root = el<HTMLElement>(id);
    root.addEventListener("click", (e) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const v = btn.getAttribute("data-v");
      if (v !== "L" && v !== "M" && v !== "H") return;
      for (const b of root.querySelectorAll("button")) b.classList.toggle("on", b === btn);
      set(v);
    });
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
    for (const u of this.units) scaleEnemy(u, this.power);
    this.phase = "briefing";
    this.turn = 1;
    this.clearSel();
    this.inspect = null;
    this.busy = false;
    this.loseKind = "wipe";
    this.pendingItem = null;
    this.log = "點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放並旋轉，上下俯仰。";
    this.renderer.yaw = 0;
    this.renderer.setPitch(PITCH_DEFAULT);
    this.renderer.centerOn(this.units, this.map);
    this.fillBriefing();
  }

  private newGame(): void {
    this.missionIndex = 0;
    this.inventory = cloneInventory(START_INVENTORY);
    this.missionStartInventory = cloneInventory(START_INVENTORY);
    this.m1DropGiven = false;
    this.resetBattle();
    this.title.hidden = true;
    this.briefing.hidden = false;
    this.phase = "briefing";
    audio.setBgm("title");
    this.syncUi();
    this.autosave();
  }

  private continueGame(): void {
    const s = latestSave(loadStore());
    if (!s) return;
    this.applySave(s);
  }

  private begin(): void {
    this.missionStartInventory = cloneInventory(this.inventory);
    this.briefing.hidden = true;
    this.title.hidden = true;
    this.phase = "select";
    audio.setBgm("battle");
    this.renderer.centerOn(this.units, this.map);
    this.syncUi();
    this.autosave();
  }

  private restart(): void {
    this.inventory = cloneInventory(this.missionStartInventory);
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.briefing.hidden = false;
    this.title.hidden = true;
    this.resetBattle();
    this.syncUi();
  }

  private nextMission(): void {
    if (this.missionIndex >= MISSIONS.length - 1) return;
    this.missionIndex += 1;
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.briefing.hidden = false;
    this.title.hidden = true;
    this.resetBattle();
    this.syncUi();
    this.autosave();
  }

  private rotateMap(): void {
    if (this.phase === "briefing" || this.phase === "title") return;
    this.renderer.rotate(this.map);
    this.yawSlider.value = String(Math.round(((this.renderer.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) * 100));
  }

  private clearSel(): void {
    this.selected = null;
    this.origin = null;
    this.field = null;
    this.moveTiles.clear();
    this.actionTiles.clear();
    this.skillTiles.clear();
    this.forecast = null;
    this.pendingItem = null;
  }

  private locked(): boolean {
    const u = this.selected;
    // Uncommitted move still locks. Act without move does not — leftover move can wait.
    return !!u && u.movedThisTurn;
  }

  private selectUnit(u: Unit): void {
    if (u.team !== "player" || u.acted || u.dead || u.npc) return;
    this.selected = u;
    if (!u.movedThisTurn) this.origin = null;
    this.forecast = null;
    this.inspect = null;
    this.pendingItem = null;
    this.showCommand(u);
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
    if (!u.actedThisTurn) bits.push("可攻擊／技能／道具");
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
    audio.play("move");
    this.origin = { x: u.x, y: u.y };
    this.originDir = u.dir;
    const path = reconstructPath(this.field, dest);
    for (let i = 1; i < path.length; i++) {
      u.dir = dirFromTo(path[i - 1], path[i]);
      u.x = path[i].x;
      u.y = path[i].y;
      await this.waitMs(90);
    }
    u.movedThisTurn = true;
    this.busy = false;
    if (u.actedThisTurn) {
      await this.finishUnit();
      return;
    }
    this.showCommand(u);
    this.autosave();
  }

  private onTap(p: Vec2): void {
    if (this.busy || this.pauseOpen) return;
    if (
      this.phase === "title" ||
      this.phase === "briefing" ||
      this.phase === "enemy" ||
      this.phase === "victory" ||
      this.phase === "defeat"
    ) {
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
    if (this.phase === "itemAim") {
      if (tile) this.tryItemTarget(tile);
      else this.backFromItem();
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
      audio.play("miss");
      this.backFromSkill();
      return;
    }
    this.forecast = makeSkillForecast(actor, t, this.map);
    this.phase = "forecast";
    this.log = this.forecast.detail;
    this.syncUi();
  }

  private tryItemTarget(tile: Vec2): void {
    const t = itemAllies(this.units).find((u) => u.x === tile.x && u.y === tile.y);
    if (!t) {
      audio.play("miss");
      this.backFromItem();
      return;
    }
    void this.applyItem(t);
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

  private backFromItem(): void {
    this.pendingItem = null;
    this.skillTiles.clear();
    if (this.selected) this.showCommand(this.selected);
    else {
      this.phase = "select";
      this.syncUi();
    }
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
    if (this.phase === "itemAim") {
      this.backFromItem();
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
    if (f.heal) audio.play("heal");
    else audio.play(f.kind === "skill" ? "skill" : "attack");
    await this.waitMs(140);
    if (f.heal) {
      target.hp = Math.min(target.maxHp, target.hp + f.heal);
      this.spawnFloat(target, `+${f.heal}`, "#7dffb3");
      this.log = `${actor.name} 為 ${target.name} 回復 ${f.heal}`;
    } else {
      target.hp = Math.max(0, target.hp - f.dmg);
      audio.play("hit");
      this.spawnFloat(target, `${f.dmg}`, "#ffd0d8");
      this.log = `${actor.name} 對 ${target.name} 造成 ${f.dmg} 傷害`;
      if (actor.atkBuff) actor.atkBuff = 0;
      if (f.skip) {
        target.skipNext = true;
        this.log += "　攔住生效";
      }
      if (target.hp <= 0) {
        target.dead = true;
        this.log = `${target.name} 倒下。`;
        this.tryEnemyDrop(target);
      }
    }
    if (f.kind === "skill") actor.skillUsed = true;
    actor.actedThisTurn = true;
    actor.lunge = 0;
    await this.waitMs(280);
    this.busy = false;
    if (this.checkEnd()) return;
    if (actor.movedThisTurn) {
      await this.finishUnit();
      return;
    }
    this.forecast = null;
    this.skillTiles.clear();
    this.showCommand(actor);
    this.autosave();
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
    this.autosave();
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
        e.acted = true;
        this.log = `${e.name} 被攔住，無法行動。`;
        this.syncUi();
        await this.waitMs(420);
        continue;
      }
      const plan = planEnemy(e, this.map, this.units, protectId, this.intel);
      for (let i = 1; i < plan.path.length; i++) {
        e.dir = dirFromTo(plan.path[i - 1], plan.path[i]);
        e.x = plan.path[i].x;
        e.y = plan.path[i].y;
        await this.waitMs(85);
      }
      if (plan.target && !plan.target.dead) {
        e.dir = dirFromTo(e, plan.target);
        e.lunge = 1;
        const f = makeAttackForecast(e, plan.target, this.map);
        audio.play("attack");
        plan.target.hp = Math.max(0, plan.target.hp - f.dmg);
        audio.play("hit");
        this.spawnFloat(plan.target, `${f.dmg}`, "#ff4d6d");
        this.log = `${e.name} 對 ${plan.target.name} 造成 ${f.dmg} 傷害`;
        if (plan.target.hp <= 0) {
          plan.target.dead = true;
          this.log = `${plan.target.name} 倒下。`;
        }
        await this.waitMs(160);
        e.lunge = 0;
        await this.waitMs(220);
        if (this.checkEnd()) {
          this.busy = false;
          return;
        }
      } else {
        await this.waitMs(120);
      }
      e.acted = true;
    }
    for (const u of this.units) {
      u.acted = false;
      if (u.team === "player" && !u.npc) {
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
    this.autosave();
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
    this.closePause();
    audio.setBgm(null);
    audio.play("victory");
    this.clearSel();
    this.inspect = null;
    this.result.hidden = false;
    this.result.classList.remove("lose");
    this.resultKicker.textContent = "勝利";
    this.resultTitle.textContent = m.winTitle;
    let body = m.winBody;
    if (this.missionIndex === 0 && !this.m1DropGiven) {
      addItem(this.inventory, "bandage", 1);
      this.m1DropGiven = true;
      body = `${m.winBody}　又找到一盒繃帶。`;
    }
    this.resultBody.textContent = body;
    this.btnNext.hidden = this.missionIndex >= MISSIONS.length - 1;
    this.syncUi();
    this.autosave();
  }

  private lose(): void {
    const m = this.mission;
    this.phase = "defeat";
    this.busy = false;
    this.closePause();
    audio.setBgm(null);
    audio.play("defeat");
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
    this.autosave();
  }

  private unitAt(x: number, y: number): Unit | undefined {
    return this.units.find((u) => !u.dead && u.x === x && u.y === y);
  }

  private spawnFloat(u: Unit, text: string, color: string): void {
    this.floats.push({ x: u.x, y: u.y, text, color, born: performance.now(), life: 900 });
  }

  private tryEnemyDrop(u: Unit): void {
    if (u.team !== "enemy") return;
    const chance = u.role === "elite" ? 0.62 : 0.35;
    if (Math.random() >= chance) return;
    const first: ItemId = Math.random() < 0.65 ? "bandage" : "stim";
    const order: ItemId[] = first === "bandage" ? ["bandage", "stim"] : ["stim", "bandage"];
    for (const id of order) {
      if (addItem(this.inventory, id, 1) > 0) {
        this.spawnFloat(u, `掉落 ${ITEMS[id].name}`, "#ffe08a");
        return;
      }
    }
  }


  private openPause(): void {
    if (
      this.phase === "title" ||
      this.phase === "briefing" ||
      this.phase === "victory" ||
      this.phase === "defeat"
    ) {
      return;
    }
    this.paused = true;
    this.pauseOpen = true;
    this.pauseEl.hidden = false;
    this.syncMuteBtn();
    audio.play("pause");
  }

  private closePause(): void {
    this.pauseEl.hidden = true;
    this.pauseOpen = false;
    this.paused = false;
  }

  private toggleMute(): void {
    audio.toggleMute();
    this.syncMuteBtn();
  }

  private syncMuteBtn(): void {
    this.btnMute.textContent = audio.muted ? "取消靜音" : "靜音";
  }

  private quitToTitle(): void {
    const mid = this.playable() || this.phase === "enemy";
    if (!mid) {
      this.goTitle();
      return;
    }
    this.pendingQuit = true;
    this.confirmText.textContent = "返回標題？進度在存檔與自動存檔裡。";
    this.confirmEl.hidden = false;
  }

  private goTitle(): void {
    this.pendingQuit = false;
    this.closePause();
    this.closeModal();
    this.confirmEl.hidden = true;
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.briefing.hidden = true;
    this.title.hidden = false;
    this.phase = "title";
    this.busy = false;
    this.clearSel();
    this.inspect = null;
    audio.setBgm("title");
    this.refreshContinue();
    this.syncUi();
  }

  private async refreshApp(): Promise<void> {
    const btn = el<HTMLButtonElement>("btn-refresh");
    btn.disabled = true;
    btn.textContent = "正在更新…";
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch {
      /* ignore */
    }
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          if (reg.waiting) reg.waiting.postMessage("skipWaiting");
          try {
            await reg.update();
          } catch {
            /* ignore */
          }
          if (reg.waiting) reg.waiting.postMessage("skipWaiting");
          await reg.unregister();
        }
      }
    } catch {
      /* ignore */
    }
    const url = new URL(location.href);
    url.searchParams.set("v", VERSION);
    url.searchParams.set("r", String(Date.now()));
    location.replace(url.toString());
  }

  private playable(): boolean {
    return this.phase === "select" || this.phase === "skillAim" || this.phase === "forecast" || this.phase === "itemAim";
  }

  private openBag(): void {
    if (this.pauseOpen) this.pauseEl.hidden = true;
    this.modalKind = "bag";
    this.modal.hidden = false;
    this.modalKicker.textContent = "道具";
    this.modalTitle.textContent = "背包";
    this.paintBag();
  }

  private paintBag(): void {
    this.modalBody.innerHTML = "";
    const canUse = this.playable() && !!this.selected && !this.selected.actedThisTurn && !this.busy;
    if (!this.inventory.length) {
      const p = document.createElement("p");
      p.textContent = "沒有道具。";
      this.modalBody.appendChild(p);
      return;
    }
    if (this.playable() && !this.selected) {
      const note = document.createElement("p");
      note.textContent = "先選單位再用道具。";
      this.modalBody.appendChild(note);
    }
    for (const stack of this.inventory) {
      const def = ITEMS[stack.id];
      const row = document.createElement("div");
      row.className = "item-row";
      const info = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = `${def.name} ×${stack.qty}`;
      const s = document.createElement("span");
      s.textContent = def.hint;
      info.append(b, s);
      row.appendChild(info);
      if (this.playable()) {
        const use = document.createElement("button");
        use.type = "button";
        use.className = "use";
        use.dataset.item = stack.id;
        use.textContent = "使用";
        use.disabled = !canUse;
        row.appendChild(use);
      }
      this.modalBody.appendChild(row);
    }
  }

  private openSaves(kind: "save" | "load"): void {
    if (this.pauseOpen) this.pauseEl.hidden = true;
    this.modalKind = kind;
    this.modal.hidden = false;
    this.modalKicker.textContent = kind === "save" ? "存檔" : "讀檔";
    this.modalTitle.textContent = kind === "save" ? "存檔" : "讀檔";
    this.paintSaves();
  }

  private paintSaves(): void {
    const store = loadStore();
    this.modalBody.innerHTML = "";
    for (let i = 0; i < SLOT_COUNT; i++) {
      const s = store.slots[i];
      const row = document.createElement("button");
      row.type = "button";
      row.className = s ? "slot" : "slot empty";
      row.dataset.slot = String(i);
      const info = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = `檔案 ${i + 1}`;
      const span = document.createElement("span");
      span.textContent = s ? `${s.missionName}　${formatStamp(s.savedAt)}` : "空";
      info.append(b, span);
      row.appendChild(info);
      this.modalBody.appendChild(row);
    }
  }

  private onModalClick(e: Event): void {
    const t = e.target as HTMLElement;
    const use = t.closest("button.use") as HTMLButtonElement | null;
    if (use && this.modalKind === "bag") {
      const id = use.dataset.item;
      if (id === "bandage" || id === "stim") this.armItem(id);
      return;
    }
    const ally = t.closest("button.ally-row") as HTMLButtonElement | null;
    if (ally && this.modalKind === "target") {
      const id = ally.dataset.uid;
      const u = this.units.find((x) => x.id === id);
      if (u) void this.applyItem(u);
      return;
    }
    const slot = t.closest("button.slot") as HTMLButtonElement | null;
    if (slot && (this.modalKind === "save" || this.modalKind === "load")) {
      const i = Number(slot.dataset.slot);
      if (this.modalKind === "load") this.loadSlot(i);
      else this.trySaveSlot(i);
    }
  }

  private armItem(id: ItemId): void {
    const u = this.selected;
    if (!u || u.actedThisTurn || this.busy) {
      this.log = "先選單位再用道具。";
      this.syncUi();
      return;
    }
    this.pendingItem = id;
    this.closePause();
    this.closeModal();
    this.inspect = null;
    this.forecast = null;
    this.moveTiles.clear();
    this.actionTiles.clear();
    const allies = itemAllies(this.units);
    this.skillTiles = new Set(allies.map((a) => key(a.x, a.y)));
    this.phase = "itemAim";
    this.log = `${ITEMS[id].name}　選我軍單位`;
    this.syncUi();
    this.modalKind = "target";
    this.modal.hidden = false;
    this.modalKicker.textContent = ITEMS[id].name;
    this.modalTitle.textContent = "選擇對象";
    this.modalBody.innerHTML = "";
    for (const a of allies) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "ally-row";
      row.dataset.uid = a.id;
      const info = document.createElement("div");
      const b = document.createElement("b");
      b.textContent = a.name;
      const s = document.createElement("span");
      s.textContent = `生命 ${a.hp}/${a.maxHp}`;
      info.append(b, s);
      row.appendChild(info);
      this.modalBody.appendChild(row);
    }
  }

  private async applyItem(target: Unit): Promise<void> {
    const actor = this.selected;
    const id = this.pendingItem;
    if (!actor || !id || actor.actedThisTurn || this.busy) return;
    if (!itemAllies(this.units).some((u) => u.id === target.id)) return;
    if (!takeItem(this.inventory, id)) return;
    this.closeModal();
    this.busy = true;
    audio.play("heal");
    if (id === "bandage") {
      const heal = Math.min(BANDAGE_HEAL, target.maxHp - target.hp);
      target.hp = Math.min(target.maxHp, target.hp + BANDAGE_HEAL);
      this.spawnFloat(target, `+${Math.max(heal, 0)}`, "#7dffb3");
      this.log = `${actor.name} 對 ${target.name} 使用繃帶`;
    } else {
      target.atkBuff = STIM_ATK;
      this.spawnFloat(target, "+ATK", "#ffc857");
      this.log = `${actor.name} 對 ${target.name} 使用提神　下次攻擊 +5`;
    }
    actor.actedThisTurn = true;
    this.pendingItem = null;
    this.skillTiles.clear();
    await this.waitMs(220);
    this.busy = false;
    if (actor.movedThisTurn) {
      await this.finishUnit();
      return;
    }
    this.showCommand(actor);
    this.autosave();
  }

  private closeModal(): void {
    this.modal.hidden = true;
    this.modalKind = "off";
    this.modalBody.innerHTML = "";
    if (this.pauseOpen) this.pauseEl.hidden = false;
  }

  private trySaveSlot(i: number): void {
    const store = loadStore();
    if (store.slots[i]) {
      this.pendingSlot = i;
      this.confirmText.textContent = `覆蓋檔案 ${i + 1}？`;
      this.confirmEl.hidden = false;
      return;
    }
    this.writeSlot(i);
  }

  private confirmYes(): void {
    this.confirmEl.hidden = true;
    if (this.pendingQuit) {
      this.pendingQuit = false;
      this.goTitle();
      return;
    }
    if (this.pendingSlot !== null) this.writeSlot(this.pendingSlot);
    this.pendingSlot = null;
  }

  private confirmNo(): void {
    this.confirmEl.hidden = true;
    this.pendingSlot = null;
    this.pendingQuit = false;
  }

  private writeSlot(i: number): void {
    const store = loadStore();
    store.slots[i] = this.captureSave();
    writeStore(store);
    this.pendingSlot = null;
    this.log = `已存到檔案 ${i + 1}`;
    this.closeModal();
    this.refreshContinue();
    this.syncUi();
  }

  private loadSlot(i: number): void {
    const store = loadStore();
    const s = store.slots[i];
    if (!s) return;
    this.closeModal();
    this.closePause();
    this.applySave(s);
  }

  private captureSave(): SaveGame {
    const play = this.playable() || this.phase === "enemy";
    return {
      v: 1,
      savedAt: Date.now(),
      missionIndex: this.missionIndex,
      missionName: play ? `${this.mission.number}　戰鬥中` : this.mission.number,
      phase: this.phase === "enemy" ? "select" : this.phase === "itemAim" || this.phase === "skillAim" || this.phase === "forecast" ? "select" : this.phase,
      turn: this.turn,
      intel: this.intel,
      power: this.power,
      inventory: cloneInventory(this.inventory),
      units: this.units.map((u) => this.packUnit(u)),
      cam: { ...this.renderer.cam },
      yaw: this.renderer.yaw,
      pitch: this.renderer.pitch,
      log: this.log,
      selectedId: this.selected && play ? this.selected.id : null,
      origin: this.origin ? { ...this.origin } : null,
      originDir: this.originDir,
      m1DropGiven: this.m1DropGiven,
      missionStartInventory: cloneInventory(this.missionStartInventory),
    };
  }

  private packUnit(u: Unit): SavedUnit {
    return {
      id: u.id,
      x: u.x,
      y: u.y,
      hp: u.hp,
      maxHp: u.maxHp,
      atk: u.atk,
      def: u.def,
      dir: u.dir,
      acted: u.acted,
      skillUsed: u.skillUsed,
      skipNext: u.skipNext,
      dead: u.dead,
      movedThisTurn: u.movedThisTurn,
      actedThisTurn: u.actedThisTurn,
      atkBuff: u.atkBuff,
    };
  }

  private applySave(s: SaveGame): void {
    this.missionIndex = s.missionIndex;
    this.intel = s.intel;
    this.power = s.power;
    this.inventory = cloneInventory(s.inventory);
    this.missionStartInventory = cloneInventory(s.missionStartInventory ?? s.inventory);
    this.m1DropGiven = s.m1DropGiven;
    this.turn = s.turn;
    this.log = s.log;
    this.setSeg("seg-intel", s.intel);
    this.setSeg("seg-power", s.power);
    this.map = new GameMap(this.mission.map);
    const templates = [...makePlayerUnits(this.mission.starts), ...this.mission.makeOthers()];
    const byId = new Map(templates.map((u) => [u.id, u]));
    this.units = [];
    for (const packed of s.units) {
      const t = byId.get(packed.id);
      if (!t) continue;
      this.units.push({ ...t, ...packed });
    }
    this.renderer.cam = { ...s.cam };
    this.renderer.yaw = s.yaw;
    this.renderer.setPitch(s.pitch ?? PITCH_DEFAULT);
    this.yawSlider.value = String(Math.round((((s.yaw % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) * 100));
    this.pitchSlider.value = String(Math.round(this.renderer.pitch));
    this.clearSel();
    this.inspect = null;
    this.busy = false;
    this.pendingItem = null;
    this.fillBriefing();
    this.result.hidden = true;
    this.result.classList.remove("lose");
    this.confirmEl.hidden = true;

    const phase = s.phase;
    this.phase = phase;
    if (phase === "title") {
      this.title.hidden = false;
      this.briefing.hidden = true;
    } else if (phase === "briefing") {
      this.title.hidden = true;
      this.briefing.hidden = false;
    } else if (phase === "victory" || phase === "defeat") {
      this.title.hidden = true;
      this.briefing.hidden = true;
      this.result.hidden = false;
      if (phase === "defeat") this.result.classList.add("lose");
    } else {
      this.title.hidden = true;
      this.briefing.hidden = true;
      this.phase = "select";
      if (s.selectedId) {
        const u = this.units.find((x) => x.id === s.selectedId);
        if (u && !u.dead && !u.acted && !u.npc) {
          this.selected = u;
          this.origin = s.origin;
          this.originDir = s.originDir;
          this.refreshRanges(u);
        }
      }
    }
    this.closePause();
    if (this.phase === "title" || this.phase === "briefing") audio.setBgm("title");
    else if (this.phase === "victory" || this.phase === "defeat") audio.setBgm(null);
    else audio.setBgm("battle");
    this.refreshContinue();
    this.syncUi();
  }

  private setSeg(id: string, v: Diff): void {
    const root = el<HTMLElement>(id);
    for (const b of root.querySelectorAll("button")) b.classList.toggle("on", b.getAttribute("data-v") === v);
  }

  private autosave(): void {
    if (this.phase === "title") return;
    const store = loadStore();
    store.autosave = this.captureSave();
    writeStore(store);
    this.refreshContinue();
  }

  private refreshContinue(): void {
    this.btnContinue.disabled = !latestSave(loadStore());
  }

  private paintUnitChip(u: Unit, inspecting: boolean): void {
    this.chip.hidden = false;
    this.chipHp.hidden = false;
    const team = u.npc ? "保護" : TEAM_LABEL[u.team];
    this.chipName.textContent = `${u.name}　${u.title}`;
    const buff = u.atkBuff ? `　攻擊+${u.atkBuff}` : "";
    this.chipMeta.textContent = `${team}　${ROLE_LABEL[u.role]}　生命 ${u.hp}/${u.maxHp}　攻擊 ${u.atk}　防禦 ${u.def}　移動 ${u.mov}　跳躍 ${u.jmp}${buff}`;
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
      this.phase === "enemy"
        ? "敵軍"
        : this.phase === "victory"
          ? "勝利"
          : this.phase === "defeat"
            ? "失敗"
            : this.phase === "title"
              ? "選單"
              : "我軍";
    this.hudSub.textContent = `${this.mission.hudSub}　智 ${DIFF_LABEL[this.intel]}　力 ${DIFF_LABEL[this.power]}`;
    this.logEl.textContent = this.log;

    const play = this.playable();
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
    this.btnCancel.disabled = (!u && !this.inspect && this.phase !== "itemAim") || this.phase === "enemy" || this.busy;
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
      this.phase === "enemy" ||
      this.phase === "briefing" ||
      this.phase === "title" ||
      this.phase === "victory" ||
      this.phase === "defeat";
    const hidePause =
      this.phase === "briefing" ||
      this.phase === "title" ||
      this.phase === "victory" ||
      this.phase === "defeat";
    this.btnEnd.hidden = !leftover || hideChrome;
    this.btnRotate.hidden = hideChrome;
    this.btnPause.hidden = hidePause;
    this.camHint.hidden = hideChrome;
    const fine = window.matchMedia("(pointer: fine)").matches;
    this.yawSlider.hidden = hideChrome || !fine;
    this.pitchSlider.hidden = hideChrome || !fine;
    this.pitchSlider.value = String(Math.round(this.renderer.pitch));
    this.refreshContinue();
  }
}
