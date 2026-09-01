import type { MapDef } from "../game/map";
import type { Archetype, Behaviour, Dir, Gender, Role, SkillKind, Stance, Team, Unit, Vec2 } from "../game/types";

type PartialUnit = Omit<
  Unit,
  | "acted"
  | "skillUsed"
  | "skipNext"
  | "dead"
  | "lunge"
  | "dir"
  | "movedThisTurn"
  | "actedThisTurn"
  | "npc"
  | "atkBuff"
  | "archetype"
  | "stance"
  | "behaviour"
  | "gender"
  | "skillKind"
  | "rangeMin"
  | "rangeMax"
  | "anim"
  | "animStart"
> & {
  dir?: Dir;
  acted?: boolean;
  npc?: boolean;
  atkBuff?: number;
  archetype?: Archetype;
  stance?: Stance;
  behaviour?: Behaviour;
  gender?: Gender;
  skillKind?: SkillKind;
  rangeMin?: number;
  rangeMax?: number;
};

function inferArch(id: string, role: Role): Archetype {
  if (id === "mara" || id === "dana" || id === "priya" || id === "hale" || id === "crosby" || id === "beckett") return id;
  if (role === "civilian") return "official";
  if (role === "worker") return "worker";
  if (role === "delinquent" || role === "magician" || role === "wolverine" || role === "boxer" || role === "gunner") return role;
  if (role === "elite") return "crosby";
  return "delinquent";
}

function inferSkill(role: Role, skillName: string): SkillKind {
  if (!skillName) return "";
  if (role === "striker") return "strike";
  if (role === "controller") return "halt";
  if (role === "support") return "heal";
  if (role === "delinquent") return "slash";
  if (role === "magician") return "spark";
  if (role === "wolverine") return "pounce";
  if (role === "boxer") return "hook";
  if (role === "gunner") return "shot";
  return "";
}

function unit(partial: PartialUnit): Unit {
  const team: Team = partial.team;
  const stance: Stance = partial.stance ?? (team === "player" ? "friendly" : team === "neutral" ? "neutral" : "hostile");
  const npc = partial.npc ?? false;
  const behaviour: Behaviour = partial.behaviour ?? (npc ? "idle" : "combat");
  const archetype = partial.archetype ?? inferArch(partial.id, partial.role);
  const skillKind = partial.skillKind ?? inferSkill(partial.role, partial.skillName);
  const ranged = skillKind === "spark" || skillKind === "shot" || partial.role === "gunner" || partial.role === "magician";
  return {
    acted: partial.acted ?? false,
    skillUsed: false,
    skipNext: false,
    dead: false,
    lunge: 0,
    dir: partial.dir ?? 0,
    movedThisTurn: false,
    actedThisTurn: false,
    npc,
    atkBuff: partial.atkBuff ?? 0,
    archetype,
    stance,
    behaviour,
    gender: partial.gender ?? "m",
    skillKind,
    rangeMin: partial.rangeMin ?? (partial.role === "gunner" ? 2 : 1),
    rangeMax: partial.rangeMax ?? (ranged ? (partial.role === "gunner" ? 3 : 3) : 1),
    anim: "idle",
    animStart: 0,
    ...partial,
  };
}

export interface Mission {
  id: string;
  number: string;
  loc: string;
  hudSub: string;
  paragraphs: string[];
  voices: Array<{ name: string; line: string }>;
  winCond: string;
  loseCond: string;
  winTitle: string;
  winBody: string;
  loseTitle: string;
  loseBody: string;
  protectLoseTitle: string;
  protectLoseBody: string;
  map: MapDef;
  starts: Vec2[];
  eliteId: string;
  protectId?: string;
  makeOthers: () => Unit[];
}

export function makePlayerUnits(starts: Vec2[]): Unit[] {
  return [
    unit({
      id: "mara",
      name: "Mara Ellison",
      title: "警員",
      team: "player",
      role: "striker",
      archetype: "mara",
      gender: "f",
      x: starts[0]?.x ?? 3,
      y: starts[0]?.y ?? 11,
      hp: 44,
      maxHp: 44,
      atk: 16,
      def: 5,
      mov: 5,
      jmp: 2,
      dir: 0,
      skillName: "重擊",
      skillHint: "近身重擊，傷害較高，也可以打更高的高度差。",
      skillKind: "strike",
    }),
    unit({
      id: "dana",
      name: "Dana Ruiz",
      title: "搭檔",
      team: "player",
      role: "controller",
      archetype: "dana",
      gender: "f",
      x: starts[1]?.x ?? 4,
      y: starts[1]?.y ?? 11,
      hp: 40,
      maxHp: 40,
      atk: 10,
      def: 8,
      mov: 4,
      jmp: 1,
      dir: 0,
      skillName: "攔住",
      skillHint: "讓目標下一回合無法行動，並造成少量傷害。",
      skillKind: "halt",
    }),
    unit({
      id: "priya",
      name: "Priya Shah",
      title: "急救員",
      team: "player",
      role: "support",
      archetype: "priya",
      gender: "f",
      x: starts[2]?.x ?? 5,
      y: starts[2]?.y ?? 11,
      hp: 38,
      maxHp: 38,
      atk: 8,
      def: 7,
      mov: 4,
      jmp: 1,
      dir: 0,
      skillName: "包紮",
      skillHint: "治療相鄰的友軍，也可以用在自己身上。",
      skillKind: "heal",
    }),
  ];
}

function delinquent(id: string, name: string, x: number, y: number, dir: Dir, gender: Gender = "m"): Unit {
  return unit({
    id,
    name,
    title: "街頭",
    team: "enemy",
    role: "delinquent",
    archetype: "delinquent",
    gender,
    x,
    y,
    hp: 22,
    maxHp: 22,
    atk: 10,
    def: 3,
    mov: 4,
    jmp: 1,
    dir,
    skillName: "揮砍",
    skillHint: "近身揮砍，傷害較高。",
    skillKind: "slash",
  });
}

function boxer(id: string, name: string, x: number, y: number, dir: Dir, gender: Gender = "m"): Unit {
  return unit({
    id,
    name,
    title: "拳手",
    team: "enemy",
    role: "boxer",
    archetype: "boxer",
    gender,
    x,
    y,
    hp: 26,
    maxHp: 26,
    atk: 15,
    def: 4,
    mov: 3,
    jmp: 1,
    dir,
    skillName: "勾拳",
    skillHint: "近身重拳，傷害很高，距離短。",
    skillKind: "hook",
    rangeMin: 1,
    rangeMax: 1,
  });
}

function gunner(id: string, name: string, x: number, y: number, dir: Dir, gender: Gender = "m"): Unit {
  return unit({
    id,
    name,
    title: "槍手",
    team: "enemy",
    role: "gunner",
    archetype: "gunner",
    gender,
    x,
    y,
    hp: 20,
    maxHp: 20,
    atk: 11,
    def: 3,
    mov: 4,
    jmp: 1,
    dir,
    skillName: "點射",
    skillHint: "遠距點射，想保持距離。",
    skillKind: "shot",
    rangeMin: 2,
    rangeMax: 3,
  });
}

function magician(id: string, name: string, x: number, y: number, dir: Dir, gender: Gender = "f"): Unit {
  return unit({
    id,
    name,
    title: "術者",
    team: "enemy",
    role: "magician",
    archetype: "magician",
    gender,
    x,
    y,
    hp: 24,
    maxHp: 24,
    atk: 12,
    def: 3,
    mov: 3,
    jmp: 1,
    dir,
    skillName: "閃火",
    skillHint: "遠距閃火，看起來像煙火。",
    skillKind: "spark",
    rangeMin: 1,
    rangeMax: 3,
  });
}

function wolverine(id: string, name: string, x: number, y: number, dir: Dir, gender: Gender = "m"): Unit {
  return unit({
    id,
    name,
    title: "爪獸",
    team: "enemy",
    role: "wolverine",
    archetype: "wolverine",
    gender,
    x,
    y,
    hp: 28,
    maxHp: 28,
    atk: 15,
    def: 2,
    mov: 5,
    jmp: 2,
    dir,
    skillName: "撲擊",
    skillHint: "衝近撲擊。現場會說那是動物。",
    skillKind: "pounce",
    rangeMin: 1,
    rangeMax: 1,
  });
}

export const MISSIONS: Mission[] = [
  {
    id: "m1",
    number: "任務 01",
    loc: "國王碼頭夜市・屋頂",
    hudSub: "國王碼頭夜市",
    paragraphs: [
      "這座城市看起來很普通。夜間公車、打烊很晚的市場、警察無線電。一個自稱 Assembly 的私人團體，長期把魔法排除在紀錄之外。他們換了新主席。舊規矩是藏起來。新規矩是先拿下這座城市，再拿下其他地方。",
      "你是夜班警員 Mara Ellison。不是特勤單位，也不是什麼重要人物。你只是會早一秒發現事情，這讓你還有點用，但不足以讓人聽你的。今晚有人報案，說市場屋頂上有騷動。你去了。你的搭檔 Dana Ruiz 也去了。市場急救員 Priya Shah 不肯離開。屋頂上，一群沒穿制服的人把街道標得像棋盤。他們本來就不打算讓目擊者走掉。這只是很多場裡的一場，本來應該安靜做完。",
    ],
    voices: [
      { name: "Mara", line: "屋頂上有人。不是穿制服的。" },
      { name: "Dana", line: "我跟你上去。" },
      { name: "Priya", line: "有人受傷的話，我不走。" },
    ],
    winCond: "擊敗 Crosby",
    loseCond: "三人全部倒下",
    winTitle: "現場結束了。",
    winBody: "Crosby 倒下。其餘的人散了。市場還開著。",
    loseTitle: "三個人都倒下了。",
    loseBody: "沒人能繼續。屋頂上的人還在。",
    protectLoseTitle: "三個人都倒下了。",
    protectLoseBody: "沒人能繼續。屋頂上的人還在。",
    map: {
      w: 10,
      h: 12,
      theme: "roof",
      heights: [
        "2222222222",
        "2222112222",
        "2211001122",
        "0011111100",
        "0000000000",
        "0000000000",
        "2200000022",
        "2200000022",
        "2110000112",
        "0000000000",
        "0000000000",
        "0000000000",
      ],
      blocked: [
        [1, 0, "ac"],
        [8, 0, "ac"],
        [0, 7, "ac"],
        [9, 7, "ac"],
        [2, 5, "stall"],
        [3, 5, "stall"],
        [6, 5, "stall"],
        [7, 5, "stall"],
        [4, 9, "stall"],
        [5, 9, "stall"],
        [1, 4, "stall"],
        [8, 4, "stall"],
      ],
      lamps: [
        [4, 4],
        [0, 9],
        [9, 9],
      ],
      objects: [{ x: 2, y: 10, type: "kit", item: "bandage" }],
    },
    starts: [
      { x: 3, y: 11 },
      { x: 4, y: 11 },
      { x: 5, y: 11 },
    ],
    eliteId: "crosby",
    makeOthers: () => [
      unit({
        id: "crosby",
        name: "Crosby",
        title: "現場主管",
        team: "enemy",
        role: "elite",
        archetype: "crosby",
        gender: "m",
        x: 5,
        y: 0,
        hp: 48,
        maxHp: 48,
        atk: 14,
        def: 6,
        mov: 4,
        jmp: 2,
        dir: 2,
        skillName: "",
        skillHint: "",
      }),
      delinquent("e1", "Neil", 2, 1, 2, "m"),
      delinquent("e2", "Cole", 7, 1, 2, "f"),
      boxer("e3", "Nash", 0, 6, 1, "m"),
      gunner("e4", "Pike", 4, 3, 2, "m"),
    ],
  },
  {
    id: "m2",
    number: "任務 02",
    loc: "國王碼頭後巷・貨台",
    hudSub: "國王碼頭後巷",
    paragraphs: [
      "後巷報了槍擊。無線電當它是幫派互打。Mara、Dana、Priya 被派去，因為這是夜班的槍擊案，不是因為有人點名。三人傷勢已處理，生命已回復。",
      "現場其實是 Assembly 在換掉當地那一組人，也要處理一個真正管港口執照的人。Deputy Harbour Chief Rowan Hale 人還在貨台上。他們先動手換幫派，所以看起來還是街頭那套。",
    ],
    voices: [
      { name: "Mara", line: "後巷有槍聲。當幫派打。" },
      { name: "Dana", line: "我們是最近的一組。" },
      { name: "Priya", line: "有人倒在貨台邊上。" },
    ],
    winCond: "擊敗 Beckett，Hale 須仍在",
    loseCond: "三人全部倒下，或 Rowan Hale 倒下",
    winTitle: "槍聲停了。",
    winBody: "Beckett 停手了。Hale 還活著。這條巷子暫時安靜。",
    loseTitle: "三個人都倒下了。",
    loseBody: "沒人能繼續。巷子裡的人還在。",
    protectLoseTitle: "Rowan Hale 倒下。",
    protectLoseBody: "港口執照那條線斷了。現場的人還沒走。",
    map: {
      w: 10,
      h: 12,
      theme: "alley",
      heights: [
        "2220002222",
        "2210001222",
        "2200000122",
        "0000000000",
        "0001111000",
        "2200000112",
        "2200000012",
        "0000000000",
        "2210000222",
        "2200000022",
        "0000000000",
        "0000000000",
      ],
      blocked: [
        [0, 0, "ac"],
        [9, 0, "ac"],
        [0, 10, "ac"],
        [9, 8, "ac"],
        [5, 8, "crate"],
        [2, 9, "crate"],
        [6, 6, "crate"],
        [7, 6, "crate"],
      ],
      lamps: [
        [3, 3],
        [4, 10],
        [8, 5],
      ],
      objects: [
        { x: 3, y: 8, type: "pallet" },
        { x: 8, y: 4, type: "barrel" },
      ],
    },
    starts: [
      { x: 3, y: 11 },
      { x: 4, y: 11 },
      { x: 5, y: 11 },
    ],
    eliteId: "beckett",
    protectId: "hale",
    makeOthers: () => [
      unit({
        id: "hale",
        name: "Rowan Hale",
        title: "副港務長",
        team: "player",
        role: "civilian",
        archetype: "hale",
        gender: "m",
        x: 4,
        y: 9,
        hp: 34,
        maxHp: 34,
        atk: 0,
        def: 6,
        mov: 0,
        jmp: 0,
        dir: 0,
        skillName: "",
        skillHint: "",
        npc: true,
        acted: true,
        behaviour: "idle",
      }),
      unit({
        id: "beckett",
        name: "Beckett",
        title: "現場主管",
        team: "enemy",
        role: "elite",
        archetype: "beckett",
        gender: "m",
        x: 8,
        y: 1,
        hp: 48,
        maxHp: 48,
        atk: 14,
        def: 6,
        mov: 4,
        jmp: 2,
        dir: 2,
        skillName: "",
        skillHint: "",
      }),
      gunner("e1", "Drake", 5, 2, 2, "m"),
      delinquent("e2", "Quinn", 1, 4, 1, "f"),
      boxer("e3", "Moss", 7, 5, 2, "m"),
      delinquent("e4", "Reed", 8, 7, 3, "m"),
    ],
  },
  {
    id: "m3",
    number: "任務 03",
    loc: "國王碼頭倉庫・碼頭",
    hudSub: "國王碼頭倉庫",
    paragraphs: [
      "槍擊過後，Assembly 回來清場。倉庫裡還有看太多的碼頭工人。無線電仍當它是貨物失竊。",
      "現場主管是 Vance。工人 Sam Ortiz 還在棧板上。他們要滅口，不是搶貨。",
    ],
    voices: [
      { name: "Mara", line: "倉庫有人。不是小偷。" },
      { name: "Dana", line: "工人還在裡面。" },
      { name: "Priya", line: "我先看傷。" },
    ],
    winCond: "擊敗 Vance，Ortiz 須仍在",
    loseCond: "三人全部倒下，或 Sam Ortiz 倒下",
    winTitle: "倉庫靜了。",
    winBody: "Vance 停手。Ortiz 還活著。碼頭外面仍有夜班吊車。",
    loseTitle: "三個人都倒下了。",
    loseBody: "沒人能繼續。倉庫裡的人還在。",
    protectLoseTitle: "Sam Ortiz 倒下。",
    protectLoseBody: "目擊者沒了。現場的人還沒走。",
    map: {
      w: 10,
      h: 12,
      theme: "warehouse",
      heights: [
        "2222200000",
        "2211100000",
        "2200000112",
        "0000000112",
        "0001110000",
        "2200000022",
        "2200000022",
        "0000000000",
        "0011111000",
        "0000000000",
        "0000000000",
        "0000000000",
      ],
      blocked: [
        [0, 0, "ac"],
        [9, 2, "ac"],
        [0, 5, "crate"],
        [9, 6, "crate"],
        [3, 7, "crate"],
        [4, 2, "crate"],
        [5, 2, "crate"],
      ],
      lamps: [
        [2, 3],
        [7, 8],
        [1, 10],
      ],
      objects: [
        { x: 1, y: 8, type: "kit", item: "stim" },
        { x: 5, y: 8, type: "pallet" },
        { x: 6, y: 4, type: "barrel" },
        { x: 2, y: 4, type: "switch", unblock: [[4, 2], [5, 2]] },
        { x: 8, y: 3, type: "crate" },
      ],
    },
    starts: [
      { x: 3, y: 11 },
      { x: 4, y: 11 },
      { x: 5, y: 11 },
    ],
    eliteId: "vance",
    protectId: "ortiz",
    makeOthers: () => [
      unit({
        id: "ortiz",
        name: "Sam Ortiz",
        title: "碼頭工人",
        team: "player",
        role: "worker",
        archetype: "worker",
        gender: "m",
        x: 4,
        y: 8,
        hp: 28,
        maxHp: 28,
        atk: 0,
        def: 4,
        mov: 0,
        jmp: 0,
        dir: 0,
        skillName: "",
        skillHint: "",
        npc: true,
        acted: true,
        behaviour: "idle",
      }),
      unit({
        id: "w1",
        name: "Gina Pell",
        title: "碼頭工人",
        team: "neutral",
        role: "worker",
        archetype: "worker",
        gender: "f",
        stance: "neutral",
        behaviour: "flee",
        npc: true,
        x: 1,
        y: 6,
        hp: 20,
        maxHp: 20,
        atk: 0,
        def: 2,
        mov: 3,
        jmp: 1,
        dir: 1,
        skillName: "",
        skillHint: "",
      }),
      unit({
        id: "vance",
        name: "Vance",
        title: "現場主管",
        team: "enemy",
        role: "elite",
        archetype: "boxer",
        gender: "m",
        x: 6,
        y: 1,
        hp: 50,
        maxHp: 50,
        atk: 15,
        def: 6,
        mov: 4,
        jmp: 2,
        dir: 2,
        skillName: "勾拳",
        skillHint: "近身重拳。",
        skillKind: "hook",
      }),
      gunner("e1", "Kira", 8, 2, 2, "f"),
      delinquent("e2", "Dunn", 2, 2, 2, "m"),
      boxer("e3", "Wade", 7, 5, 3, "m"),
    ],
  },
  {
    id: "m4",
    number: "任務 04",
    loc: "國王碼頭東街・換手",
    hudSub: "國王碼頭東街",
    paragraphs: [
      "街上還有本地那一組人。Assembly 要換掉他們。看起來像幫派互打，三方都在場。",
      "本地的人沒有先打你。Assembly 的現場主管是 Inez。贏的條件是她倒下。不必清掉整條街。",
    ],
    voices: [
      { name: "Mara", line: "兩邊都有人。不要先打錯邊。" },
      { name: "Dana", line: "本地的人在看我們。" },
      { name: "Priya", line: "打到他們，他們就會打回來。" },
    ],
    winCond: "擊敗 Inez。本地組不必全滅",
    loseCond: "三人全部倒下",
    winTitle: "東街暫時停了。",
    winBody: "Inez 倒下。本地的人沒有再往前。換手沒做完。",
    loseTitle: "三個人都倒下了。",
    loseBody: "沒人能繼續。街上的人還在。",
    protectLoseTitle: "三個人都倒下了。",
    protectLoseBody: "沒人能繼續。街上的人還在。",
    map: {
      w: 10,
      h: 12,
      theme: "street",
      heights: [
        "0000222000",
        "0000222000",
        "1100000011",
        "0000000000",
        "2200000022",
        "0001111000",
        "0000000000",
        "2200000022",
        "0000000000",
        "1100000011",
        "0000000000",
        "0000000000",
      ],
      blocked: [
        [0, 4, "ac"],
        [9, 4, "ac"],
        [0, 7, "stall"],
        [9, 7, "stall"],
        [3, 5, "stall"],
      ],
      lamps: [
        [2, 2],
        [7, 6],
        [4, 9],
      ],
      objects: [
        { x: 1, y: 9, type: "kit", item: "bandage" },
        { x: 6, y: 8, type: "pallet" },
        { x: 2, y: 5, type: "barrel" },
        { x: 8, y: 3, type: "crate" },
      ],
    },
    starts: [
      { x: 3, y: 11 },
      { x: 4, y: 11 },
      { x: 5, y: 11 },
    ],
    eliteId: "inez",
    makeOthers: () => [
      unit({
        id: "inez",
        name: "Inez",
        title: "現場主管",
        team: "enemy",
        role: "elite",
        archetype: "gunner",
        gender: "f",
        x: 5,
        y: 0,
        hp: 46,
        maxHp: 46,
        atk: 13,
        def: 5,
        mov: 4,
        jmp: 2,
        dir: 2,
        skillName: "點射",
        skillHint: "遠距點射。",
        skillKind: "shot",
        rangeMin: 2,
        rangeMax: 3,
      }),
      magician("e1", "Lyle", 2, 1, 2, "m"),
      delinquent("e2", "Rosa", 7, 1, 2, "f"),
      gunner("e3", "Chen", 8, 5, 3, "m"),
      unit({
        id: "g1",
        name: "Marty",
        title: "本地組",
        team: "neutral",
        role: "delinquent",
        archetype: "delinquent",
        gender: "m",
        stance: "neutral",
        behaviour: "combat",
        x: 1,
        y: 3,
        hp: 20,
        maxHp: 20,
        atk: 9,
        def: 3,
        mov: 4,
        jmp: 1,
        dir: 1,
        skillName: "揮砍",
        skillHint: "近身揮砍。",
        skillKind: "slash",
        npc: true,
      }),
      unit({
        id: "g2",
        name: "Bea",
        title: "本地組",
        team: "neutral",
        role: "boxer",
        archetype: "boxer",
        gender: "f",
        stance: "neutral",
        behaviour: "combat",
        x: 2,
        y: 6,
        hp: 22,
        maxHp: 22,
        atk: 12,
        def: 3,
        mov: 3,
        jmp: 1,
        dir: 0,
        skillName: "勾拳",
        skillHint: "近身重拳。",
        skillKind: "hook",
        npc: true,
      }),
      unit({
        id: "g3",
        name: "Oz",
        title: "本地組",
        team: "neutral",
        role: "delinquent",
        archetype: "delinquent",
        gender: "m",
        stance: "neutral",
        behaviour: "indiscriminate",
        x: 8,
        y: 2,
        hp: 16,
        maxHp: 16,
        atk: 8,
        def: 2,
        mov: 3,
        jmp: 1,
        dir: 3,
        skillName: "",
        skillHint: "",
        npc: true,
      }),
    ],
  },
  {
    id: "m5",
    number: "任務 05",
    loc: "港務大樓前・廣場",
    hudSub: "港務廣場",
    paragraphs: [
      "Assembly 改打真正有權的人。Port Authority Director Marla Keene 今晚還在廣場側門。無線電會寫成動物與煙火。",
      "現場有術者和爪獸。主管是 Holt。Keene 必須活著。",
    ],
    voices: [
      { name: "Mara", line: "這不是街頭那套了。" },
      { name: "Dana", line: "那邊有人往官員走。" },
      { name: "Priya", line: "先護人。" },
    ],
    winCond: "擊敗 Holt，Keene 須仍在",
    loseCond: "三人全部倒下，或 Marla Keene 倒下",
    winTitle: "廣場上的人散了。",
    winBody: "Holt 停手。Keene 還活著。報告會寫煙火與走失的動物。",
    loseTitle: "三個人都倒下了。",
    loseBody: "沒人能繼續。廣場上的人還在。",
    protectLoseTitle: "Marla Keene 倒下。",
    protectLoseBody: "真正管港口的那條線斷了。",
    map: {
      w: 10,
      h: 12,
      theme: "plaza",
      heights: [
        "2222222222",
        "2211111122",
        "2200000022",
        "0000000000",
        "0001111000",
        "2200000022",
        "0000000000",
        "0011111100",
        "0000000000",
        "2200000022",
        "0000000000",
        "0000000000",
      ],
      blocked: [
        [0, 5, "ac"],
        [9, 5, "ac"],
        [1, 1, "ac"],
        [8, 1, "ac"],
        [4, 2, "crate"],
        [5, 2, "crate"],
      ],
      lamps: [
        [3, 3],
        [6, 6],
        [2, 9],
      ],
      objects: [
        { x: 6, y: 10, type: "kit", item: "bandage" },
        { x: 3, y: 7, type: "pallet" },
        { x: 7, y: 4, type: "barrel" },
        {
          x: 1,
          y: 4,
          type: "van",
          unblock: [
            [4, 2],
            [5, 2],
          ],
        },
        { x: 8, y: 8, type: "crate" },
      ],
    },
    starts: [
      { x: 3, y: 11 },
      { x: 4, y: 11 },
      { x: 5, y: 11 },
    ],
    eliteId: "holt",
    protectId: "keene",
    makeOthers: () => [
      unit({
        id: "keene",
        name: "Marla Keene",
        title: "港務總監",
        team: "player",
        role: "civilian",
        archetype: "official",
        gender: "f",
        x: 4,
        y: 9,
        hp: 32,
        maxHp: 32,
        atk: 0,
        def: 5,
        mov: 0,
        jmp: 0,
        dir: 0,
        skillName: "",
        skillHint: "",
        npc: true,
        acted: true,
        behaviour: "idle",
      }),
      unit({
        id: "holt",
        name: "Holt",
        title: "現場主管",
        team: "enemy",
        role: "elite",
        archetype: "magician",
        gender: "m",
        x: 5,
        y: 0,
        hp: 52,
        maxHp: 52,
        atk: 14,
        def: 5,
        mov: 4,
        jmp: 2,
        dir: 2,
        skillName: "閃火",
        skillHint: "遠距閃火。",
        skillKind: "spark",
        rangeMin: 1,
        rangeMax: 3,
      }),
      magician("e1", "Lila", 2, 1, 2, "f"),
      wolverine("e2", "Rook", 7, 2, 2, "m"),
      gunner("e3", "Tess", 8, 6, 3, "f"),
    ],
  },
];
