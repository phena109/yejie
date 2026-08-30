import type { MapDef } from "../game/map";
import type { Dir, Unit, Vec2 } from "../game/types";

function unit(
  partial: Omit<Unit, "acted" | "skillUsed" | "skipNext" | "dead" | "lunge" | "dir" | "movedThisTurn" | "actedThisTurn" | "npc" | "atkBuff"> & {
    dir?: Dir;
    acted?: boolean;
    npc?: boolean;
    atkBuff?: number;
  },
): Unit {
  return {
    acted: partial.acted ?? false,
    skillUsed: false,
    skipNext: false,
    dead: false,
    lunge: 0,
    dir: partial.dir ?? 0,
    movedThisTurn: false,
    actedThisTurn: false,
    npc: partial.npc ?? false,
    atkBuff: partial.atkBuff ?? 0,
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
  const base = [
    unit({
      id: "mara",
      name: "Mara Ellison",
      title: "警員",
      team: "player",
      role: "striker",
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
    }),
    unit({
      id: "dana",
      name: "Dana Ruiz",
      title: "搭檔",
      team: "player",
      role: "controller",
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
    }),
    unit({
      id: "priya",
      name: "Priya Shah",
      title: "急救員",
      team: "player",
      role: "support",
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
    }),
  ];
  return base;
}

function field(id: string, name: string, x: number, y: number, dir: Dir): Unit {
  return unit({
    id,
    name,
    title: "現場人員",
    team: "enemy",
    role: "grunt",
    x,
    y,
    hp: 26,
    maxHp: 26,
    atk: 11,
    def: 4,
    mov: 4,
    jmp: 1,
    dir,
    skillName: "",
    skillHint: "",
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
      heights: [
        "2222222222",
        "2222222222",
        "2211111122",
        "0011111100",
        "0000000000",
        "0000000000",
        "0000000000",
        "0000000000",
        "2110000112",
        "2200000022",
        "2200000022",
        "0000000000",
      ],
      blocked: [
        [1, 1, "ac"],
        [8, 1, "ac"],
        [1, 10, "ac"],
        [8, 10, "ac"],
        [1, 5, "stall"],
        [2, 5, "stall"],
        [6, 5, "stall"],
        [7, 5, "stall"],
        [3, 7, "stall"],
        [4, 7, "stall"],
      ],
      lamps: [
        [0, 6],
        [9, 6],
        [5, 4],
      ],
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
        x: 5,
        y: 0,
        hp: 58,
        maxHp: 58,
        atk: 15,
        def: 7,
        mov: 5,
        jmp: 2,
        dir: 2,
        skillName: "",
        skillHint: "",
      }),
      field("e1", "Neil", 2, 1, 2),
      field("e2", "Cole", 7, 1, 2),
      field("e3", "Nash", 3, 2, 2),
      field("e4", "Pike", 6, 2, 2),
      field("e5", "Voss", 4, 3, 2),
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
      heights: [
        "2220002222",
        "2210001222",
        "2200000122",
        "0000000000",
        "0000000000",
        "2200000112",
        "2200000012",
        "0001111000",
        "0001111222",
        "2210000222",
        "2200000000",
        "0000000000",
      ],
      blocked: [
        [0, 0, "ac"],
        [9, 0, "ac"],
        [0, 10, "ac"],
        [9, 8, "ac"],
        [6, 6, "crate"],
        [7, 6, "crate"],
        [5, 8, "crate"],
        [8, 4, "crate"],
      ],
      lamps: [
        [3, 3],
        [4, 10],
        [8, 5],
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
        x: 7,
        y: 7,
        hp: 22,
        maxHp: 22,
        atk: 0,
        def: 3,
        mov: 0,
        jmp: 0,
        dir: 3,
        skillName: "",
        skillHint: "",
        npc: true,
        acted: true,
      }),
      unit({
        id: "beckett",
        name: "Beckett",
        title: "現場主管",
        team: "enemy",
        role: "elite",
        x: 8,
        y: 1,
        hp: 54,
        maxHp: 54,
        atk: 15,
        def: 7,
        mov: 5,
        jmp: 2,
        dir: 2,
        skillName: "",
        skillHint: "",
      }),
      field("e1", "Drake", 5, 2, 2),
      field("e2", "Quinn", 2, 4, 1),
      field("e3", "Moss", 6, 5, 2),
      field("e4", "Reed", 8, 6, 3),
      field("e5", "Shaw", 1, 9, 1),
    ],
  },
];
