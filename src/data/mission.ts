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
      id: "lin",
      name: "林澈",
      title: "突擊",
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
      skillName: "裂影",
      skillHint: "近身重擊。可跨越更大高差，傷害提高。",
    }),
    unit({
      id: "gu",
      name: "顧晏",
      title: "控場",
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
      skillName: "封線",
      skillHint: "指定一名敵軍，使其下回合無法行動。",
    }),
    unit({
      id: "shen",
      name: "沈芮",
      title: "支援",
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
      skillName: "穩脈",
      skillHint: "治療鄰近友軍（含自己）。",
    }),
  ];
}

export function makeEnemyUnits(): Unit[] {
  const grunt = (
    id: string,
    name: string,
    x: number,
    y: number,
    dir: Dir,
  ): Unit =>
    unit({
      id,
      name,
      title: "執行員",
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
      id: "he",
      name: "賀凜",
      title: "司夜",
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
    grunt("e1", "執行員・周", 2, 1, 2),
    grunt("e2", "執行員・范", 7, 1, 2),
    grunt("e3", "執行員・吳", 3, 2, 2),
    grunt("e4", "執行員・梁", 6, 2, 2),
    grunt("e5", "執行員・曹", 4, 3, 2),
  ];
}

export const ELITE_ID = "he";
