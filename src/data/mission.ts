import type { Dir, Unit } from "../game/types";

function unit(partial: Omit<Unit, "acted" | "skillUsed" | "skipNext" | "dead" | "lunge" | "dir"> & { dir?: Dir }): Unit {
  return {
    acted: false,
    skillUsed: false,
    skipNext: false,
    dead: false,
    lunge: 0,
    dir: partial.dir ?? 0,
    ...partial,
  };
}

export function makePlayerUnits(): Unit[] {
  return [
    unit({
      id: "mara",
      name: "Mara Ellison",
      title: "警員",
      team: "player",
      role: "striker",
      x: 3,
      y: 11,
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
      x: 4,
      y: 11,
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
      x: 5,
      y: 11,
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
}

export function makeEnemyUnits(): Unit[] {
  const field = (
    id: string,
    name: string,
    x: number,
    y: number,
    dir: Dir,
  ): Unit =>
    unit({
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

  return [
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
    field("e1", "Hale", 2, 1, 2),
    field("e2", "Cole", 7, 1, 2),
    field("e3", "Nash", 3, 2, 2),
    field("e4", "Pike", 6, 2, 2),
    field("e5", "Voss", 4, 3, 2),
  ];
}

export const ELITE_ID = "crosby";
