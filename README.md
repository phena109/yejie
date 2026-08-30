# 夜界

Mobile-first grid tactical RPG vertical slice.

Portrait phone viewport. Touch only.

## How to run

Work in /workspace/yejie. Install packages, then start the Vite dev server. For a production check, run the build then preview.

Scripts: install, dev, build, preview.

Open the local URL on a phone or a desktop window about 390 by 844.

This build is a PWA (manifest plus service worker). No account, no backend, no ads.

## Design lock

Setting: an ordinary English-speaking city. Night buses, a late-closing market, police radios. Magic has been kept off the books for a long time by a private group that calls itself the Assembly. They have a new Chair. The old rule was hide. The new rule is take this city first, then the rest.

Player: Constable Mara Ellison, night shift. Not a specialist unit, not anyone important. She notices things a second early.

Mission 01: a call about a disturbance on a King's Wharf market roof (國王碼頭夜市). Partner Dana Ruiz goes. Market first-aider Priya Shah will not leave. On the roof, people with no uniforms are marking the street like a game board.

Win: defeat Crosby (the person in charge on site). Remaining field people can leave.

Lose: all three player units down.

View: orthogonal ~45° isometric. Diamond tiles. Height as stacked blocks (street / stairs / roof). Canvas 2.5D only.

Skills: usable once per that unit's turn, not once per battle. `skillUsed` resets when the unit can act again.

Tactics are not dumbed down for mobile. Elevation, jump, climb cost, melee height limit, side and back damage, confirm/cancel, and undo-move-before-action stay. The only mobile compromise is the control scheme: tap, drag, pinch, large dock buttons, no hover, no right-click.

Language: people in the world speak English. Traditional Chinese is convenience UI only — a plain translation. Unit names are English. UI verbs are ordinary 繁中 (移動, 攻擊, 確認, 取消, 待機, 結束回合, 傷害, 勝利, 失敗). Skill names: 重擊, 攔住, 包紮.

## Roster

- Mara Ellison, constable, striker. Move 5, Jump 2. Can vault from street onto roof. Skill 重擊: heavy melee with extra height.
- Dana Ruiz, partner, controller. Move 4, Jump 1. Needs stairs. Skill 攔住: target skips their next turn, plus chip damage.
- Priya Shah, market first-aider, support. Move 4, Jump 1. Skill 包紮: heal an adjacent ally or self.
- Enemies: Assembly field people (Hale, Cole, Nash, Pike, Voss) plus Crosby on the north roof.

## What is in the slice

- One 10 by 12 map: street height 0, stairs height 1, rooftop height 2, market stalls and rooftop A/C as blocked props.
- Full flow: briefing, fight, victory or defeat, restart.
- Select unit, show move range, move, show action range, attack or skill or wait, next unit, end turn, enemy AI.
- Cancel undoes the move before an action is confirmed. Tap an in-range enemy to preview damage, Confirm to strike.
- Camera starts on the player team. Drag to pan. Pinch to zoom.
- Original canvas art: wet asphalt, market stalls, rooftop units, isometric diamonds. No copyrighted assets.

## What was cut on purpose

- Extra classes, extra maps, jobs, loot, gacha, accounts.
- No keyboard-first UI. Wheel zoom is a desktop debug extra only.

See package.json scripts: install, dev, build, preview.

Exact scripts live in package.json: install dependencies, then use the dev, build, and preview script names with the node package runner.
