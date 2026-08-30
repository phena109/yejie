# 夜界

Mobile-first grid tactical RPG vertical slice.

Portrait phone viewport. Touch only.

## How to run

Work in /workspace/yejie. Install packages, then start the Vite dev server. For a production check, run the build then preview.

Scripts: install, dev, build, preview.

Open the local URL on a phone or a desktop window about 390 by 844.

This build is a PWA (manifest plus service worker). No account, no backend, no ads.

## Design lock

Setting: modern real-world city. Magic is a faint grid over real streets. The Weave kept the supernatural hidden. New leadership (the Speaker) wants to stop hiding and start ruling by claiming city districts from the inside.

Player: Lin Che (林澈), a Weave field agent sidelined under the old stay-hidden rules, pulled back by the Speakers purge.

Mission 01, First Move (第一手): stop a Weave strike team seizing a Ximending night market rooftop and street block before civilians notice.

Win: defeat the elite Night Steward He Lin (司夜・賀凜). Remaining grunts can flee.

Lose: all three player units down.

Tactics are not dumbed down for mobile. Elevation, jump, climb cost, melee height limit, side and back damage, confirm/cancel, and undo-move-before-action stay. The only mobile compromise is the control scheme: tap, drag, pinch, large dock buttons, no hover, no right-click.

Language: all player-facing text is Traditional Chinese (Taiwan). English lives in code and comments only.

## Roster

- 林澈, 突擊. Move 5, Jump 2. Can vault from street onto roof. Skill 裂影: heavy melee with extra height.
- 顧晏, 控場. Move 4, Jump 1. Needs stairs. Skill 封線: target skips their next turn, plus chip damage.
- 沈芮, 支援. Move 4, Jump 1. Skill 穩脈: heal an adjacent ally or self.
- Enemies: 執行員・周, 范, 吳, 梁, 曹 (five loyalists) plus elite 司夜・賀凜 on the north roof.

## What is in the slice

- One 10 by 12 map: street height 0, stairs height 1, rooftop height 2, market stalls and rooftop A/C as blocked props.
- Full flow: briefing, fight, victory or defeat, restart.
- Select unit, show move range, move, show action range, attack or skill or wait, next unit, end turn, enemy AI.
- Cancel undoes the move before an action is confirmed. Tap an in-range enemy to preview damage, Confirm to strike.
- Camera starts on the player team. Drag to pan. Pinch to zoom.
- Original canvas art: wet asphalt, neon stalls, rooftop units. No copyrighted assets.

## What was cut on purpose

- Extra classes, extra maps, jobs, loot, gacha, accounts.
- No keyboard-first UI. Wheel zoom is a desktop debug extra only.

See package.json scripts: install, dev, build, preview.

Exact scripts live in package.json: install dependencies, then use the dev, build, and preview script names with the node package runner.
