# 夜界

Mobile-first grid tactical RPG vertical slice.

Portrait phone viewport. Touch first.

## How to run

Work in /workspace/yejie. Install packages, then start the Vite dev server. For a production check, run the build then preview.

Scripts: install, dev, build, preview.

Open the local URL on a phone or a desktop window about 390 by 844.

This build is a PWA (manifest plus service worker). No account, no backend, no ads.

GitHub Pages serves `docs/`.

## Design lock

Setting: an ordinary English-speaking city. Night buses, a late-closing market, police radios. Magic has been kept off the books for a long time by a private group that calls itself the Assembly. They have a new Chair. The old rule was hide. The new rule is take this city first, then the rest.

They are not running one special operation. The original plan should have been finished ages ago, quietly. Government has not noticed because they start by replacing local gangs, so it looks like the same street crime, and they assassinate key government members who actually have power, not figureheads.

Player: Constable Mara Ellison, night shift. Not a specialist unit, not anyone important. She notices things a second early. She and the people with her ran into one of many conquering actions.

Mission 01: a call about a disturbance on a King's Wharf market roof (國王碼頭夜市). Partner Dana Ruiz goes. Market first-aider Priya Shah will not leave. On the roof, people with no uniforms are marking the street like a game board. This roof job is one of many. It should have stayed quiet.

Win: defeat Crosby (the person in charge on site). Remaining field people can leave.

Lose: all three player units down.

Mission 02: a shooting call in gang territory on the King's Wharf back streets. It looks like gangs fighting. It is the Assembly replacing a local crew and removing Deputy Harbour Chief Rowan Hale, who actually controls port licenses. Mara, Dana, Priya are sent because it is a night-shift shooting, not because they are chosen. HP is restored for this fight.

Win: defeat Beckett. Rowan Hale must still be alive.

Lose: all three player units down, or Rowan Hale dies.

Mission 03: warehouse / docks. Assembly cleaning witnesses. Win: defeat Vance. Sam Ortiz must live. Dock worker Gina Pell flees (neutral).

Mission 04: gang-replacement street. Leftover local crew (neutral; fight Assembly unless you attack them) vs Assembly vs you. Win: defeat Inez. Local crew does not have to be wiped.

Mission 05: Assembly goes for Port Authority Director Marla Keene. Magician and clawed unit (wolverine archetype, not Marvel IP) appear; deniable as fireworks / animals. Win: Holt down and Keene alive.

View: orthogonal ~45° isometric. Diamond tiles. Height as stacked blocks (street / stairs / roof). Canvas hybrid: terrain stays 2D isometric; units are voxel 3D pixel-art models (MagicaVoxel / cube-pixel, ~14x20) projected through the same camera (idle breathe, walk, attack, cast). Two-finger twist rotates yaw freely (any degree), inverted so the map sticks to the fingers. Two-finger up/down tilts pitch, locked 15°–75° (15 side-on, 75 top-down; default ~30° isometric). Pinch zooms. One-finger drag pans. Twist, pinch, and pitch can happen together. 旋轉 still snaps 90°. Desktop debug: right-drag (x yaw, y pitch) or the yaw/pitch sliders. Hit-testing follows the current yaw and pitch.

Inspect: tap terrain or a unit you did not pick as actor. Terrain shows name, height, walkable/blocked, street/stairs/roof, and any prop (stall, A/C, crate, lamp). Units show name, role, HP, atk/def/move/jump, skill name plus one line, and team. Cancel or tap empty UI dismisses inspect. Selecting your own unit for orders still works.

Turn: Final Fantasy Tactics style. Move and Act are independent. You may act in place without moving, including 待機. You may move after acting. You may move then act. You may skip one of them. After Act, leftover Move is not forced: deselect, command others, then come back later in the same player phase to move. The unit is only done when both Move and Act are used, or they 待機/結束 that unit (待機 means finished, and forfeits leftover move), or the player 結束回合. Done units show a small E and fade; the mark clears at the next player phase. Undo still undoes the last uncommitted step. Attack, skill, wait, and items do not require a move first.

Skills: usable once per that unit's turn, not once per battle. `skillUsed` resets when the unit can act again.

Tactics are not dumbed down for mobile. Elevation, jump, climb cost, melee height limit, side and back damage, confirm/cancel, and undo of an uncommitted move stay. The only mobile compromise is the control scheme: tap, drag, pinch, two-finger rotate, large dock buttons, no hover.

Language: people in the world speak English. Traditional Chinese is convenience UI only — a plain translation. Unit names are English. UI verbs are ordinary 繁中 (移動, 攻擊, 確認, 取消, 待機, 結束, 結束回合, 旋轉, 傷害, 勝利, 失敗, 下一場, 新遊戲, 繼續, 讀檔, 存檔, 背包). Skill names: 重擊, 攔住, 包紮.

## Start screen

First thing you see is 夜界. Buttons: 新遊戲, 繼續, 讀檔, 背包.

敵軍智力 and 敵軍戰力 are on this screen, each L 低 / M 中 / H 高, default M / M. 新遊戲 uses those two settings, then shows the mission 1 briefing.

繼續 is disabled if there is no save. It loads the most recent slot or autosave.

## Enemy intelligence (敵軍智力)

Stored for the run.

- L 低: attack the nearest obvious target. Little positioning. No height / facing / Hale priority.
- M 中: current AI. Uses height. Does not suicidally ignore Hale in mission 2.
- H 高: prefers back and side, uses height, focuses injured player units. In mission 2, pressures Hale if that wins faster.

## Enemy power (敵軍戰力)

Multipliers on enemy HP, ATK, and DEF, applied when spawning a mission.

- L 低: 0.75
- M 中: 1.0
- H 高: 1.35

## Inventory

A bag kept between missions. Start: 繃帶 ×2 (回復 14 生命), 提神 ×1 (下次攻擊 +5). No shop.

Open 背包 from the start screen (view) and from the fight HUD 背包 button. Pause no longer contains 背包. Opening the bag does not skip leftover move. Using an item: pick the item, pick a target (self or ally). Consumes one. Counts as that acting unit's Act; they can still Move after, per FFT rules.

If the player loses and 再戰 / retries that fight, inventory reloads to the snapshot taken when the briefing was confirmed, not the emptied bag. HP of the three still restores as now.

Enemies can drop 繃帶 or 提神 on death (~35% grunts, higher on the site lead). Float text 掉落 繃帶. Stacks cap at 9 so the bag cannot explode.

After a mission 1 win: 又找到一盒繃帶.

## Save / load

Three slots in localStorage, plus an autosave. Each stores mission, unit positions and HP, acted / skillUsed / dir, Hale if present, inventory, mission-start inventory snapshot, intel / power, camera, yaw, pitch.

UI: 存檔 / 讀檔. Slot list shows mission name and timestamp. Overwrite asks 覆蓋此檔？ 繼續 loads the most recent.

Autosave writes after briefing, battle start, unit finish, enemy phase, and win / lose, so 繼續 can resume a fight.

## Roster

- Mara Ellison, constable, striker. Move 5, Jump 2. Can vault from street onto roof. Skill 重擊: heavy melee with extra height.
- Dana Ruiz, partner, controller. Move 4, Jump 1. Needs stairs. Skill 攔住: target skips their next turn, plus chip damage.
- Priya Shah, market first-aider, support. Move 4, Jump 1. Skill 包紮: heal an adjacent ally or self.
- Mission 01 enemies: Assembly field people (Neil, Cole, Nash, Pike) plus Crosby on the north roof.
- Mission 02: Deputy Harbour Chief Rowan Hale (NPC to protect) starts near the squad behind crate cover. Site lead Beckett plus Drake, Quinn, Moss, Reed. Hale must live; he is not invincible.

## What is in the slice

- Five maps, each 10 by 12. M1 roof, M2 alley, M3 warehouse, M4 street, M5 plaza.
- Full flow: start screen, settings, briefing, fight, victory or defeat, 下一場 through mission 05, restart. 回到標題 from briefing, result, and pause (confirm if mid-fight; saves stay).
- Pause menu on the fight UI: 繼續, 存檔, 讀檔, 靜音, 回到標題. Fight HUD 背包. Bag/save do not skip leftover move. Pause freezes the enemy phase.
- Select unit, show move and attack ranges together when both remain. Act in place, move after acting, or skip one. After Act with Move left, deselect and return later. Wait ends the unit. Both used ends the unit. 結束回合 ends the player phase. Items consume Act. Done units show E and fade.
- Tap a unit or tile to inspect. Tap an in-range enemy to preview damage, Confirm to strike.
- Camera starts on the player team. Drag to pan. Pinch to zoom. Two-finger twist for free yaw (map follows fingers). Two-finger vertical tilts pitch 15–75.
- Voxel 3D pixel-art units (grid of cubes, not low-poly capsules) with facing yaw on the tile, faction colour rings, and a ground chevron (cool body, warm tip). Distinct silhouettes and body shapes: Mara, Dana, Priya, Hale, Crosby, Beckett, delinquent, magician, wolverine, boxer, gunner, worker, official.
- Third parties: friendly / hostile / neutral; combat, flee, idle, indiscriminate. Neutral becomes hostile if attacked.
- Grid objects: pickup (kit), trigger (switch / van door), destructible (barrel blast), stand-on (crate / pallet).
- Bundled Web Audio SFX and BGM (title/briefing, battle). First tap unlocks audio. Mute is remembered.
- Title 重新載入 clears caches, updates the service worker, and reloads (iOS home screen and Android). Version stamp on the title screen.
- Original canvas art for terrain plus original sprites. No copyrighted assets.

## What was cut on purpose

- Extra classes, jobs, loot shop, gacha, accounts. Three.js not used (canvas-projected rigs keep yaw/pitch aligned).
- No keyboard-first UI. Wheel zoom and right-drag rotate are desktop debug extras only.

See package.json scripts: install, dev, build, preview.

Exact scripts live in package.json: install dependencies, then use the dev, build, and preview script names with the node package runner.
