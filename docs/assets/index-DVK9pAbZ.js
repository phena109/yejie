var Lu=Object.defineProperty;var Iu=(i,t,e)=>t in i?Lu(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var F=(i,t,e)=>Iu(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const ph="yejie-mute";function Du(){try{return localStorage.getItem(ph)==="1"}catch{return!1}}class Uu{constructor(){F(this,"muted",Du());F(this,"ctx",null);F(this,"master",null);F(this,"sfxGain",null);F(this,"bgmGain",null);F(this,"unlocked",!1);F(this,"wanted",null);F(this,"playing",null);F(this,"timer",0);F(this,"beat",0)}unlock(){if(this.unlocked&&this.ctx&&this.ctx.state==="running")return;const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx||(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.32,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.7,this.sfxGain.connect(this.master),this.bgmGain=this.ctx.createGain(),this.bgmGain.gain.value=this.muted?0:.22,this.bgmGain.connect(this.master)),this.ctx.resume(),this.unlocked=!0,this.applyMute(),this.wanted&&this.setBgm(this.wanted))}setMuted(t){this.muted=t;try{localStorage.setItem(ph,t?"1":"0")}catch{}this.applyMute()}toggleMute(){return this.setMuted(!this.muted),this.muted}applyMute(){this.sfxGain&&(this.sfxGain.gain.value=this.muted?0:.7),this.bgmGain&&(this.bgmGain.gain.value=this.muted?0:.22)}play(t){if(this.unlock(),!this.ctx||!this.sfxGain||this.muted)return;const e=this.ctx.currentTime;switch(t){case"ui":this.blip(880,.045,.11,"sine",e);break;case"move":this.noise(.05,.06,e,900),this.blip(180,.06,.08,"triangle",e);break;case"attack":this.noise(.1,.1,e,700),this.sweep(420,160,.12,.12,e);break;case"hit":this.blip(140,.09,.16,"square",e),this.noise(.08,.12,e,400);break;case"miss":this.sweep(480,220,.14,.07,e),this.blip(210,.1,.05,"sine",e+.04);break;case"skill":this.blip(520,.08,.1,"square",e),this.blip(780,.1,.1,"sine",e+.06),this.blip(1040,.12,.08,"sine",e+.12);break;case"heal":this.blip(392,.1,.09,"sine",e),this.blip(494,.12,.1,"sine",e+.08),this.blip(587,.16,.1,"sine",e+.16);break;case"victory":this.blip(523,.14,.12,"square",e),this.blip(659,.16,.12,"square",e+.12),this.blip(784,.28,.14,"square",e+.24);break;case"defeat":this.blip(330,.18,.12,"sawtooth",e),this.blip(247,.22,.12,"sawtooth",e+.16),this.blip(165,.4,.14,"sine",e+.32);break;case"pause":this.blip(220,.1,.08,"triangle",e),this.blip(165,.16,.08,"triangle",e+.1);break}}setBgm(t){if(this.wanted=t,t===this.playing||(this.stopBgm(),this.playing=t,!t||!this.unlocked||!this.ctx))return;this.beat=0;const e=t==="battle"?280:520,n=()=>{if(this.playing!==t||!this.ctx||!this.bgmGain)return;const s=this.ctx.currentTime;t==="title"?this.titleBeat(s):this.battleBeat(s),this.beat+=1,this.timer=window.setTimeout(n,e)};n()}stopBgm(){this.timer&&(window.clearTimeout(this.timer),this.timer=0),this.playing=null}titleBeat(t){const e=this.beat%8,n=[110,0,82,0,110,0,98,0][e];n&&this.tone(this.bgmGain,n,.46,.045,"sine",t),(e===0||e===4)&&this.tone(this.bgmGain,220,.4,.02,"triangle",t),e===6&&this.tone(this.bgmGain,329,.28,.018,"sine",t)}battleBeat(t){const e=this.beat%8;e%2===0?this.sweepTo(this.bgmGain,90,42,.12,.1,t):this.noiseTo(this.bgmGain,.04,.025,t,1800);const s=[0,196,0,233,0,196,175,0][e];s&&this.tone(this.bgmGain,s,.18,.035,"square",t)}blip(t,e,n,s,r){this.sfxGain&&this.tone(this.sfxGain,t,e,n,s,r)}sweep(t,e,n,s,r){this.sfxGain&&this.sweepTo(this.sfxGain,t,e,n,s,r)}noise(t,e,n,s){this.sfxGain&&this.noiseTo(this.sfxGain,t,e,n,s)}tone(t,e,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type=r,o.frequency.setValueAtTime(e,a),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(s,a+.012),l.gain.exponentialRampToValueAtTime(1e-4,a+n),o.connect(l),l.connect(t),o.start(a),o.stop(a+n+.02)}sweepTo(t,e,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(e,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,n),a+s),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(r,a+.01),l.gain.exponentialRampToValueAtTime(1e-4,a+s),o.connect(l),l.connect(t),o.start(a),o.stop(a+s+.02)}noiseTo(t,e,n,s,r){if(!this.ctx)return;const a=2048,o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=o.getChannelData(0);for(let u=0;u<a;u++)l[u]=Math.random()*2-1;const c=this.ctx.createBufferSource();c.buffer=o;const h=this.ctx.createBiquadFilter();h.type="lowpass",h.frequency.value=r;const f=this.ctx.createGain();f.gain.setValueAtTime(1e-4,s),f.gain.exponentialRampToValueAtTime(n,s+.008),f.gain.exponentialRampToValueAtTime(1e-4,s+e),c.connect(h),h.connect(f),f.connect(t),c.start(s),c.stop(s+e+.02)}}const jt=new Uu;function Nu(i,t){return i==="mara"||i==="dana"||i==="priya"||i==="hale"||i==="crosby"||i==="beckett"?i:t==="civilian"?"official":t==="worker"?"worker":t==="delinquent"||t==="magician"||t==="wolverine"||t==="boxer"||t==="gunner"?t:t==="elite"?"crosby":"delinquent"}function Fu(i,t){return t?i==="striker"?"strike":i==="controller"?"halt":i==="support"?"heal":i==="delinquent"?"slash":i==="magician"?"spark":i==="wolverine"?"pounce":i==="boxer"?"hook":i==="gunner"?"shot":"":""}function Ee(i){const t=i.team,e=i.stance??(t==="player"?"friendly":t==="neutral"?"neutral":"hostile"),n=i.npc??!1,s=i.behaviour??(n?"idle":"combat"),r=i.archetype??Nu(i.id,i.role),a=i.skillKind??Fu(i.role,i.skillName),o=a==="spark"||a==="shot"||i.role==="gunner"||i.role==="magician";return{acted:i.acted??!1,skillUsed:!1,skipNext:!1,dead:!1,lunge:0,dir:i.dir??0,movedThisTurn:!1,actedThisTurn:!1,npc:n,atkBuff:i.atkBuff??0,archetype:r,stance:e,behaviour:s,gender:i.gender??"m",skillKind:a,rangeMin:i.rangeMin??(i.role==="gunner"?2:1),rangeMax:i.rangeMax??(o?(i.role==="gunner",3):1),anim:"idle",animStart:0,...i}}function yl(i){return[Ee({id:"mara",name:"Mara Ellison",title:"警員",team:"player",role:"striker",archetype:"mara",gender:"f",x:i[0]?.x??3,y:i[0]?.y??11,hp:44,maxHp:44,atk:16,def:5,mov:5,jmp:2,dir:0,skillName:"重擊",skillHint:"近身重擊，傷害較高，也可以打更高的高度差。",skillKind:"strike"}),Ee({id:"dana",name:"Dana Ruiz",title:"搭檔",team:"player",role:"controller",archetype:"dana",gender:"f",x:i[1]?.x??4,y:i[1]?.y??11,hp:40,maxHp:40,atk:10,def:8,mov:4,jmp:1,dir:0,skillName:"攔住",skillHint:"讓目標下一回合無法行動，並造成少量傷害。",skillKind:"halt"}),Ee({id:"priya",name:"Priya Shah",title:"急救員",team:"player",role:"support",archetype:"priya",gender:"f",x:i[2]?.x??5,y:i[2]?.y??11,hp:38,maxHp:38,atk:8,def:7,mov:4,jmp:1,dir:0,skillName:"包紮",skillHint:"治療相鄰的友軍，也可以用在自己身上。",skillKind:"heal"})]}function Ri(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"街頭",team:"enemy",role:"delinquent",archetype:"delinquent",gender:r,x:e,y:n,hp:22,maxHp:22,atk:10,def:3,mov:4,jmp:1,dir:s,skillName:"揮砍",skillHint:"近身揮砍，傷害較高。",skillKind:"slash"})}function Fr(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"拳手",team:"enemy",role:"boxer",archetype:"boxer",gender:r,x:e,y:n,hp:26,maxHp:26,atk:15,def:4,mov:3,jmp:1,dir:s,skillName:"勾拳",skillHint:"近身重拳，傷害很高，距離短。",skillKind:"hook",rangeMin:1,rangeMax:1})}function as(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"槍手",team:"enemy",role:"gunner",archetype:"gunner",gender:r,x:e,y:n,hp:20,maxHp:20,atk:11,def:3,mov:4,jmp:1,dir:s,skillName:"點射",skillHint:"遠距點射，想保持距離。",skillKind:"shot",rangeMin:2,rangeMax:3})}function Ml(i,t,e,n,s,r="f"){return Ee({id:i,name:t,title:"術者",team:"enemy",role:"magician",archetype:"magician",gender:r,x:e,y:n,hp:24,maxHp:24,atk:12,def:3,mov:3,jmp:1,dir:s,skillName:"閃火",skillHint:"遠距閃火，看起來像煙火。",skillKind:"spark",rangeMin:1,rangeMax:3})}function Ou(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"爪獸",team:"enemy",role:"wolverine",archetype:"wolverine",gender:r,x:e,y:n,hp:28,maxHp:28,atk:15,def:2,mov:5,jmp:2,dir:s,skillName:"撲擊",skillHint:"衝近撲擊。現場會說那是動物。",skillKind:"pounce",rangeMin:1,rangeMax:1})}const oi=[{id:"m1",number:"任務 01",loc:"國王碼頭夜市・屋頂",hudSub:"國王碼頭夜市",paragraphs:["這座城市看起來很普通。夜間公車、打烊很晚的市場、警察無線電。一個自稱 Assembly 的私人團體，長期把魔法排除在紀錄之外。他們換了新主席。舊規矩是藏起來。新規矩是先拿下這座城市，再拿下其他地方。","你是夜班警員 Mara Ellison。不是特勤單位，也不是什麼重要人物。你只是會早一秒發現事情，這讓你還有點用，但不足以讓人聽你的。今晚有人報案，說市場屋頂上有騷動。你去了。你的搭檔 Dana Ruiz 也去了。市場急救員 Priya Shah 不肯離開。屋頂上，一群沒穿制服的人把街道標得像棋盤。他們本來就不打算讓目擊者走掉。這只是很多場裡的一場，本來應該安靜做完。"],voices:[{name:"Mara",line:"屋頂不對勁。不是穿制服的。巷口粉筆記號又近了一格——跟週二同一隻手。"},{name:"Dana",line:"上去。樓梯我先走。你看到了再喊。"},{name:"Priya",line:"街上要是還有傷患，我不走。棋盤再急，也不能拿活人當棋子。"}],midBeats:[{speaker:"Mara",side:"left",text:"粉筆灰還沒被風吹散。有人剛從這裡下去。"}],winCond:"擊敗 Crosby",loseCond:"三人全部倒下",winTitle:"現場結束了。",winBody:"Crosby 倒下。其餘的人散了。市場還開著。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。屋頂上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。屋頂上的人還在。",map:{w:10,h:12,theme:"roof",heights:["2222222222","2222112222","2211001122","0011111100","0000000000","0000000000","2200000022","2200000022","2110000112","0000000000","0000000000","0000000000"],blocked:[[1,0,"ac"],[8,0,"ac"],[0,7,"ac"],[9,7,"ac"],[2,5,"stall"],[3,5,"stall"],[6,5,"stall"],[7,5,"stall"],[4,9,"stall"],[5,9,"stall"],[1,4,"stall"],[8,4,"stall"]],lamps:[[4,4],[0,9],[9,9]],objects:[{x:2,y:10,type:"kit",item:"bandage"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"crosby",makeOthers:()=>[Ee({id:"crosby",name:"Crosby",title:"現場主管",team:"enemy",role:"elite",archetype:"crosby",gender:"m",x:5,y:0,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),Ri("e1","Neil",2,1,2,"m"),Ri("e2","Cole",7,1,2,"f"),Fr("e3","Nash",0,6,1,"m"),as("e4","Pike",4,3,2,"m")]},{id:"m2",number:"任務 02",loc:"國王碼頭後巷・貨台",hudSub:"國王碼頭後巷",paragraphs:["後巷報了槍擊。無線電當它是幫派互打。Mara、Dana、Priya 被派去，因為這是夜班的槍擊案，不是因為有人點名。三人傷勢已處理，生命已回復。","現場其實是 Assembly 在換掉當地那一組人，也要處理一個真正管港口執照的人。Deputy Harbour Chief Rowan Hale 人還在貨台上。他們先動手換幫派，所以看起來還是街頭那套。"],voices:[{name:"Mara",line:"後巷有槍聲。當幫派打。"},{name:"Dana",line:"我們是最近的一組。"},{name:"Priya",line:"有人倒在貨台邊上。"}],winCond:"擊敗 Beckett，Hale 須仍在",loseCond:"三人全部倒下，或 Rowan Hale 倒下",winTitle:"槍聲停了。",winBody:"Beckett 停手了。Hale 還活著。這條巷子暫時安靜。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。巷子裡的人還在。",protectLoseTitle:"Rowan Hale 倒下。",protectLoseBody:"港口執照那條線斷了。現場的人還沒走。",map:{w:10,h:12,theme:"alley",heights:["2220002222","2210001222","2200000122","0000000000","0001111000","2200000112","2200000012","0000000000","2210000222","2200000022","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,0,"ac"],[0,10,"ac"],[9,8,"ac"],[5,8,"crate"],[2,9,"crate"],[6,6,"crate"],[7,6,"crate"]],lamps:[[3,3],[4,10],[8,5]],objects:[{x:3,y:8,type:"pallet"},{x:8,y:4,type:"barrel"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"beckett",protectId:"hale",makeOthers:()=>[Ee({id:"hale",name:"Rowan Hale",title:"副港務長",team:"player",role:"civilian",archetype:"hale",gender:"m",x:4,y:9,hp:34,maxHp:34,atk:0,def:6,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ee({id:"beckett",name:"Beckett",title:"現場主管",team:"enemy",role:"elite",archetype:"beckett",gender:"m",x:8,y:1,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),as("e1","Drake",5,2,2,"m"),Ri("e2","Quinn",1,4,1,"f"),Fr("e3","Moss",7,5,2,"m"),Ri("e4","Reed",8,7,3,"m")]},{id:"m3",number:"任務 03",loc:"國王碼頭倉庫・碼頭",hudSub:"國王碼頭倉庫",paragraphs:["槍擊過後，Assembly 回來清場。倉庫裡還有看太多的碼頭工人。無線電仍當它是貨物失竊。","現場主管是 Vance。工人 Sam Ortiz 還在棧板上。他們要滅口，不是搶貨。"],voices:[{name:"Mara",line:"倉庫有人。不是小偷。"},{name:"Dana",line:"工人還在裡面。"},{name:"Priya",line:"我先看傷。"}],winCond:"擊敗 Vance，Ortiz 須仍在",loseCond:"三人全部倒下，或 Sam Ortiz 倒下",winTitle:"倉庫靜了。",winBody:"Vance 停手。Ortiz 還活著。碼頭外面仍有夜班吊車。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。倉庫裡的人還在。",protectLoseTitle:"Sam Ortiz 倒下。",protectLoseBody:"目擊者沒了。現場的人還沒走。",map:{w:10,h:12,theme:"warehouse",heights:["2222200000","2211100000","2200000112","0000000112","0001110000","2200000022","2200000022","0000000000","0011111000","0000000000","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,2,"ac"],[0,5,"crate"],[9,6,"crate"],[3,7,"crate"],[4,2,"crate"],[5,2,"crate"]],lamps:[[2,3],[7,8],[1,10]],objects:[{x:1,y:8,type:"kit",item:"stim"},{x:5,y:8,type:"pallet"},{x:6,y:4,type:"barrel"},{x:2,y:4,type:"switch",unblock:[[4,2],[5,2]]},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"vance",protectId:"ortiz",makeOthers:()=>[Ee({id:"ortiz",name:"Sam Ortiz",title:"碼頭工人",team:"player",role:"worker",archetype:"worker",gender:"m",x:4,y:8,hp:28,maxHp:28,atk:0,def:4,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ee({id:"w1",name:"Gina Pell",title:"碼頭工人",team:"neutral",role:"worker",archetype:"worker",gender:"f",stance:"neutral",behaviour:"flee",npc:!0,x:1,y:6,hp:20,maxHp:20,atk:0,def:2,mov:3,jmp:1,dir:1,skillName:"",skillHint:""}),Ee({id:"vance",name:"Vance",title:"現場主管",team:"enemy",role:"elite",archetype:"boxer",gender:"m",x:6,y:1,hp:50,maxHp:50,atk:15,def:6,mov:4,jmp:2,dir:2,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook"}),as("e1","Kira",8,2,2,"f"),Ri("e2","Dunn",2,2,2,"m"),Fr("e3","Wade",7,5,3,"m")]},{id:"m4",number:"任務 04",loc:"國王碼頭東街・換手",hudSub:"國王碼頭東街",paragraphs:["街上還有本地那一組人。Assembly 要換掉他們。看起來像幫派互打，三方都在場。","本地的人沒有先打你。Assembly 的現場主管是 Inez。贏的條件是她倒下。不必清掉整條街。"],voices:[{name:"Mara",line:"兩邊都有人。不要先打錯邊。"},{name:"Dana",line:"本地的人在看我們。"},{name:"Priya",line:"打到他們，他們就會打回來。"}],winCond:"擊敗 Inez。本地組不必全滅",loseCond:"三人全部倒下",winTitle:"東街暫時停了。",winBody:"Inez 倒下。本地的人沒有再往前。換手沒做完。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。街上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。街上的人還在。",map:{w:10,h:12,theme:"street",heights:["0000222000","0000222000","1100000011","0000000000","2200000022","0001111000","0000000000","2200000022","0000000000","1100000011","0000000000","0000000000"],blocked:[[0,4,"ac"],[9,4,"ac"],[0,7,"stall"],[9,7,"stall"],[3,5,"stall"]],lamps:[[2,2],[7,6],[4,9]],objects:[{x:1,y:9,type:"kit",item:"bandage"},{x:6,y:8,type:"pallet"},{x:2,y:5,type:"barrel"},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"inez",makeOthers:()=>[Ee({id:"inez",name:"Inez",title:"現場主管",team:"enemy",role:"elite",archetype:"gunner",gender:"f",x:5,y:0,hp:46,maxHp:46,atk:13,def:5,mov:4,jmp:2,dir:2,skillName:"點射",skillHint:"遠距點射。",skillKind:"shot",rangeMin:2,rangeMax:3}),Ml("e1","Lyle",2,1,2,"m"),Ri("e2","Rosa",7,1,2,"f"),as("e3","Chen",8,5,3,"m"),Ee({id:"g1",name:"Marty",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"combat",x:1,y:3,hp:20,maxHp:20,atk:9,def:3,mov:4,jmp:1,dir:1,skillName:"揮砍",skillHint:"近身揮砍。",skillKind:"slash",npc:!0}),Ee({id:"g2",name:"Bea",title:"本地組",team:"neutral",role:"boxer",archetype:"boxer",gender:"f",stance:"neutral",behaviour:"combat",x:2,y:6,hp:22,maxHp:22,atk:12,def:3,mov:3,jmp:1,dir:0,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook",npc:!0}),Ee({id:"g3",name:"Oz",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"indiscriminate",x:8,y:2,hp:16,maxHp:16,atk:8,def:2,mov:3,jmp:1,dir:3,skillName:"",skillHint:"",npc:!0})]},{id:"m5",number:"任務 05",loc:"港務大樓前・廣場",hudSub:"港務廣場",paragraphs:["Assembly 改打真正有權的人。Port Authority Director Marla Keene 今晚還在廣場側門。無線電會寫成動物與煙火。","現場有術者和爪獸。主管是 Holt。Keene 必須活著。"],voices:[{name:"Mara",line:"這不是街頭那套了。"},{name:"Dana",line:"那邊有人往官員走。"},{name:"Priya",line:"先護人。"}],winCond:"擊敗 Holt，Keene 須仍在",loseCond:"三人全部倒下，或 Marla Keene 倒下",winTitle:"廣場上的人散了。",winBody:"Holt 停手。Keene 還活著。報告會寫煙火與走失的動物。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。廣場上的人還在。",protectLoseTitle:"Marla Keene 倒下。",protectLoseBody:"真正管港口的那條線斷了。",map:{w:10,h:12,theme:"plaza",heights:["2222222222","2211111122","2200000022","0000000000","0001111000","2200000022","0000000000","0011111100","0000000000","2200000022","0000000000","0000000000"],blocked:[[0,5,"ac"],[9,5,"ac"],[1,1,"ac"],[8,1,"ac"],[4,2,"crate"],[5,2,"crate"]],lamps:[[3,3],[6,6],[2,9]],objects:[{x:6,y:10,type:"kit",item:"bandage"},{x:3,y:7,type:"pallet"},{x:7,y:4,type:"barrel"},{x:1,y:4,type:"van",unblock:[[4,2],[5,2]]},{x:8,y:8,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"holt",protectId:"keene",makeOthers:()=>[Ee({id:"keene",name:"Marla Keene",title:"港務總監",team:"player",role:"civilian",archetype:"official",gender:"f",x:4,y:9,hp:32,maxHp:32,atk:0,def:5,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ee({id:"holt",name:"Holt",title:"現場主管",team:"enemy",role:"elite",archetype:"magician",gender:"m",x:5,y:0,hp:52,maxHp:52,atk:14,def:5,mov:4,jmp:2,dir:2,skillName:"閃火",skillHint:"遠距閃火。",skillKind:"spark",rangeMin:1,rangeMax:3}),Ml("e1","Lila",2,1,2,"f"),Ou("e2","Rook",7,2,2,"m"),as("e3","Tess",8,6,3,"f")]}],ku=4,mh=[{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];function Bu(i){return i*Math.PI*2/ku}function Ts(i){const t=Bu(i);return{x:Math.sin(t),y:-Math.cos(t)}}const Hu={L:.75,M:1,H:1.35},Sl={L:"L 低",M:"M 中",H:"H 高"};function Ft(i,t){return`${i},${t}`}function Hn(i){const[t,e]=i.split(",");return{x:Number(t),y:Number(e)}}function os(i,t){const e=t.x-i.x,n=t.y-i.y;return Math.abs(e)>=Math.abs(n)?e>=0?1:3:n>=0?2:0}function On(i,t){return Math.abs(i.x-t.x)+Math.abs(i.y-t.y)}function Or(i){return new Promise(t=>setTimeout(t,i))}function kr(i,t,e,n,s){const r=(n-1)/2,a=(s-1)/2,o=i-r,l=t-a,c=Math.cos(e),h=Math.sin(e);return{x:o*c+l*h,y:-o*h+l*c}}function bl(i,t,e){const n=Math.cos(e),s=Math.sin(e);return{x:i*n+t*s,y:-i*s+t*n}}function Tl(i){return i+Math.PI/2}function zu(i,t){if(i.stance!=="hostile"&&i.team!=="enemy")return;const e=Hu[t];i.maxHp=Math.max(1,Math.round(i.maxHp*e)),i.hp=i.maxHp,i.atk=Math.max(1,Math.round(i.atk*e)),i.def=Math.max(0,Math.round(i.def*e))}function ni(i){return i.stance}function cr(i){const t=ni(i);return t==="friendly"?"#5ad0ff":t==="hostile"?"#ff4d6d":"#e0c45a"}function ka(i){return i.team==="player"&&!i.npc&&!i.dead}function Gu(i,t){return t.dead?!0:i.team===t.team||ni(i)==="friendly"&&ni(t)==="friendly"}function ko(i,t){if(i.dead||t.dead||i.id===t.id)return!1;if(i.behaviour==="indiscriminate"||t.behaviour==="indiscriminate")return!0;const e=ni(i),n=ni(t);return e==="hostile"&&n==="friendly"||e==="friendly"&&n==="hostile"||e==="neutral"&&n==="hostile"||e==="hostile"&&n==="neutral"}function El(i){i.stance="hostile",i.team="enemy",(i.behaviour==="idle"||i.behaviour==="flee")&&(i.behaviour="combat")}function Vu(i,t){const e=new Map;for(const n of i)n.dead||t&&n.id===t.id||e.set(Ft(n.x,n.y),n);return e}function Ls(i,t,e){const n=Vu(e,i),s=new Map,r=new Map,a=Ft(i.x,i.y);s.set(a,0),r.set(a,null);const o=[{x:i.x,y:i.y}];for(;o.length;){o.sort((d,m)=>(s.get(Ft(d.x,d.y))??99)-(s.get(Ft(m.x,m.y))??99));const c=o.shift(),h=Ft(c.x,c.y),f=s.get(h)??0,u=t.heightAt(c.x,c.y);for(const d of mh){const m=c.x+d.x,x=c.y+d.y;if(!t.walkable(m,x))continue;const p=t.heightAt(m,x)-u;if(Math.abs(p)>i.jmp)continue;const M=n.get(Ft(m,x));if(M&&!Gu(i,M))continue;const T=1+(p>0?p:0),y=f+T;if(y>i.mov)continue;const w=Ft(m,x),b=s.get(w);b!==void 0&&b<=y||(s.set(w,y),r.set(w,h),o.push({x:m,y:x}))}}const l=new Map;for(const[c,h]of s){const f=Hn(c),u=n.get(c);u&&u.id!==i.id||t.walkable(f.x,f.y)&&l.set(c,h)}return l.set(a,0),{cost:l,parent:r}}function ii(i,t){const e=[];let n=Ft(t.x,t.y);if(!i.cost.has(n)&&!i.parent.has(n))return e;for(;n;){e.push(Hn(n));const s=i.parent.get(n);if(!s)break;n=s}return e.reverse(),e}function Ji(i,t,e,n,s,r){const a=Math.abs(t-n)+Math.abs(e-s),o=i.rangeMin??1,l=i.rangeMax??1;if(a<o||a>l)return!1;const c=Math.abs(r.heightAt(t,e)-r.heightAt(n,s)),h=Math.max(2,i.jmp+1);return c<=h}function Ba(i,t,e,n){const s=i.x,r=i.y,a=[];for(const o of e)o.dead||o.id===i.id||!(ko(i,o)||i.team==="player"&&!i.npc&&o.stance!=="friendly")||Ji(i,s,r,o.x,o.y,t)&&a.push(o);return a}function Ha(i,t,e){const n=i.skillKind;if(n==="heal"||i.role==="support")return e.filter(s=>s.dead||s.stance!=="friendly"&&s.team!=="player"?!1:Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=1);if(n==="halt"||i.role==="controller")return e.filter(s=>{if(s.dead||s.stance==="friendly")return!1;const r=Math.abs(t.heightAt(i.x,i.y)-t.heightAt(s.x,s.y));return Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=3&&r<=3});if(n==="spark"||n==="shot")return e.filter(s=>{if(s.dead||s.id===i.id||s.stance==="friendly")return!1;const r=Math.abs(i.x-s.x)+Math.abs(i.y-s.y),a=n==="spark"?3:4;return r<(n==="shot"?2:1)||r>a?!1:Math.abs(t.heightAt(i.x,i.y)-t.heightAt(s.x,s.y))<=3});if(n==="strike"||n==="slash"||n==="pounce"||n==="hook"||i.role==="striker"){const s=n==="strike"?3:2;return Ba({...i,rangeMin:1,rangeMax:1},t,e).filter(r=>Math.abs(t.heightAt(i.x,i.y)-t.heightAt(r.x,r.y))<=s)}return Ba(i,t,e)}function Wu(i,t,e){const n=new Set;for(const s of Ba(i,t,e))n.add(Ft(s.x,s.y));return n}function hr(i,t){const e=new Set,n=i.rangeMin??1,s=i.rangeMax??1;for(let r=0;r<t.h;r++)for(let a=0;a<t.w;a++){const o=Math.abs(i.x-a)+Math.abs(i.y-r);o>=n&&o<=s&&t.inBounds(a,r)&&e.add(Ft(a,r))}return e}function Xu(i,t){const e=i.skillKind;if(e==="halt"||i.role==="controller"){const n=new Set;for(let s=0;s<t.h;s++)for(let r=0;r<t.w;r++)Math.abs(i.x-r)+Math.abs(i.y-s)<=3&&n.add(Ft(r,s));return n}if(e==="heal"||i.role==="support"){const n=new Set;for(const s of mh){const r=i.x+s.x,a=i.y+s.y;t.inBounds(r,a)&&n.add(Ft(r,a))}return n.add(Ft(i.x,i.y)),n}if(e==="spark"){const n={...i,rangeMin:1,rangeMax:3};return hr(n,t)}if(e==="shot"){const n={...i,rangeMin:2,rangeMax:4};return hr(n,t)}return hr({...i,rangeMin:1,rangeMax:1},t)}function gh(i,t){const e=t.x-i.x,n=t.y-i.y;if(e===0&&n===0)return"front";const s=Ts(i.dir),r=e*s.x+n*s.y,a=Math.abs(e*s.y-n*s.x),o=1e-9;return r>0&&r>=a-o?"front":r<0&&-r>a+o?"back":"side"}function vr(i,t,e,n=!1){const s=gh(t,i);let r=i.atk+(i.atkBuff||0)-Math.floor(t.def*.5);const a=e.heightAt(i.x,i.y)-e.heightAt(t.x,t.y);if(a>0&&(r+=3),a<0&&(r-=2),s==="side"&&(r=Math.floor(r*1.25)),s==="back"&&(r=Math.floor(r*1.5)),n)switch(i.skillKind){case"strike":r=Math.floor(r*1.4);break;case"slash":r=Math.floor(r*1.3);break;case"spark":r=i.atk+(i.atkBuff||0)-Math.floor(t.def*.2)+(a>0?2:0);break;case"pounce":r=Math.floor(r*1.35);break;case"hook":r=Math.floor(r*1.45);break;case"shot":r=Math.floor(r*1.15);break;default:i.role==="striker"&&(r=Math.floor(r*1.4))}return{dmg:Math.max(1,r),face:s,dh:a}}const qu={front:"正面",side:"側面 +25%",back:"背面 +50%"};function za(i,t,e,n=!1){const{dmg:s,face:r,dh:a}=vr(i,t,e,n),o=[qu[r]];return a>0&&o.push("高地 +3"),a<0&&o.push("仰攻 −2"),n&&i.skillName&&o.push(i.skillName),{kind:n?"skill":"attack",actor:i,target:t,label:n?`${i.skillName}　${i.name} → ${t.name}`:`${i.name} → ${t.name}`,detail:`${s} 傷害　${o.join("　")}`,dmg:s,heal:0,skip:!1,face:r}}function wl(i,t,e){const n=i.skillKind;return n==="halt"||i.role==="controller"?{kind:"skill",actor:i,target:t,label:`${i.skillName}　${i.name} → ${t.name}`,detail:"下回合無法行動　並造成 4 傷害",dmg:4,heal:0,skip:!0,face:gh(t,i)}:n==="heal"||i.role==="support"?{kind:"skill",actor:i,target:t,label:`${i.skillName}　${i.name} → ${t.name}`,detail:`預覽　生命 ${t.hp} → ${Math.min(t.maxHp,t.hp+16)} / ${t.maxHp}（+${Math.min(16,t.maxHp-t.hp)}）`,dmg:0,heal:16,skip:!1,face:"front"}:za(i,t,e,!0)}function Bo(i,t){return i.behaviour==="indiscriminate"?t.filter(e=>!e.dead&&e.id!==i.id):i.behaviour==="flee"||i.behaviour==="idle"?[]:t.filter(e=>!e.dead&&e.id!==i.id&&ko(i,e))}function Ho(i,t){return t.length?t.slice().sort((e,n)=>On(i,e)-On(i,n))[0]:null}function Yu(i,t,e,n,s){return i.behaviour==="idle"||i.mov<=0?{unit:i,dest:{x:i.x,y:i.y},path:[{x:i.x,y:i.y}],target:null,useSkill:!1}:i.behaviour==="flee"?$u(i,t,e):s==="L"?Ku(i,t,e):s==="H"?Ju(i,t,e,n):Zu(i,t,e,n)}function $u(i,t,e){const n=Ls(i,t,e),s=e.filter(o=>!o.dead&&o.id!==i.id&&ni(o)==="hostile");let r={x:i.x,y:i.y},a=-1;for(const[o]of n.cost){const l=Hn(o),c=Ho(l,s),h=c?On(l,c):8,f=Math.min(l.x,l.y,t.w-1-l.x,t.h-1-l.y),u=h*10-f;u>a&&(a=u,r=l)}return{unit:i,dest:r,path:ii(n,r),target:null,useSkill:!1}}function zo(i,t,e,n,s,r){if(i.skillUsed||!i.skillName)return!1;const a={...i,x:t.x,y:t.y};if(!Ha(a,n,s).some(c=>c.id===e.id)||i.skillKind==="heal")return!1;const l=r==="H"?.8:r==="L"?.25:.55;return i.skillKind==="spark"||i.skillKind==="shot"?!0:Math.random()<l}function Ku(i,t,e){const n=Ls(i,t,e),s=Bo(i,e);let r=null;for(const[c]of n.cost){const h=Hn(c);for(const f of s){if(!Ji(i,h.x,h.y,f.x,f.y,t))continue;const u=On(i,h),m=400-On(i,f)*20-u;(!r||m>r.score)&&(r={dest:h,target:f,score:m})}}if(r)return{unit:i,dest:r.dest,path:ii(n,r.dest),target:r.target,useSkill:zo(i,r.dest,r.target,t,e,"L")};const a=Ho(i,s);let o={x:i.x,y:i.y},l=1e9;if(a)for(const[c]of n.cost){const h=Hn(c);let f=On(h,a);i.rangeMin>1&&(f=Math.abs(f-i.rangeMin)),f<l&&(l=f,o=h)}return{unit:i,dest:o,path:ii(n,o),target:null,useSkill:!1}}function Zu(i,t,e,n){const s=Ls(i,t,e),r=Bo(i,e);let a=null;for(const[c]of s.cost){const h=Hn(c);for(const f of r){if(!Ji(i,h.x,h.y,f.x,f.y,t))continue;const u={...i,x:h.x,y:h.y},{dmg:d,face:m,dh:x}=vr(u,f,t);let g=d*10+(f.hp<=d?80:0);if(f.role==="support"&&(g+=6),f.id===n&&(g+=14),m==="back"&&(g+=8),x>0&&(g+=4),i.role==="elite"&&(g+=2),i.rangeMin>1){const p=On(h,f);p>=i.rangeMin&&(g+=6),p===1&&i.archetype==="gunner"&&(g-=12)}(!a||g>a.score)&&(a={dest:h,target:f,score:g})}}if(a)return{unit:i,dest:a.dest,path:ii(s,a.dest),target:a.target,useSkill:zo(i,a.dest,a.target,t,e,"M")};let o={x:i.x,y:i.y},l=99;for(const c of r)for(const[h]of s.cost){const f=Hn(h);let u=Math.abs(f.x-c.x)+Math.abs(f.y-c.y);i.rangeMin>1&&(u=Math.abs(u-Math.max(2,i.rangeMin)));const d=t.heightAt(i.x,i.y)-t.heightAt(f.x,f.y);let m=u;c.id===n&&(m-=2),i.role==="elite"&&d>0&&(m+=1.4),m<l&&(l=m,o=f)}return{unit:i,dest:o,path:ii(s,o),target:null,useSkill:!1}}function Ju(i,t,e,n){const s=Ls(i,t,e),r=Bo(i,e),a=n?r.find(m=>m.id===n):void 0,l=r.filter(m=>!m.npc).reduce((m,x)=>m+x.hp,0),c=!!a&&a.hp*3<=Math.max(1,l);let h=null;for(const[m]of s.cost){const x=Hn(m);for(const g of r){if(!Ji(i,x.x,x.y,g.x,g.y,t))continue;const p={...i,x:x.x,y:x.y},{dmg:M,face:T,dh:y}=vr(p,g,t),w=1-g.hp/Math.max(1,g.maxHp);let b=M*12+w*40;g.hp<=M&&(b+=110),T==="back"&&(b+=22),T==="side"&&(b+=12),y>0&&(b+=10),y<0&&(b-=6),g.role==="support"&&(b+=8),g.id===n&&(b+=c||g.hp<=16?56:20,g.hp<=M&&(b+=40)),i.role==="elite"&&(b+=3),i.rangeMin>1&&On(x,g)===1&&i.archetype==="gunner"&&(b-=20),(!h||b>h.score)&&(h={dest:x,target:g,score:b})}}if(h)return{unit:i,dest:h.dest,path:ii(s,h.dest),target:h.target,useSkill:zo(i,h.dest,h.target,t,e,"H")};const f=a&&(c||a.hp/a.maxHp<.65)?a:r.slice().sort((m,x)=>m.hp/m.maxHp-x.hp/x.maxHp)[0];let u={x:i.x,y:i.y},d=-1e9;for(const[m]of s.cost){const x=Hn(m),g=f??Ho(x,r);if(!g)continue;let p=On(x,g);i.rangeMin>1&&(p=Math.abs(p-Math.max(2,i.rangeMin)));let M=-p*10+t.heightAt(x.x,x.y)*5;if(Ji(i,x.x,x.y,g.x,g.y,t)){const T={...i,x:x.x,y:x.y},{face:y,dh:w}=vr(T,g,t);y==="back"&&(M+=24),y==="side"&&(M+=12),w>0&&(M+=8)}g.id===n&&(M+=6),M+=(1-g.hp/Math.max(1,g.maxHp))*8,M>d&&(d=M,u=x)}return{unit:i,dest:u,path:ii(s,u),target:null,useSkill:!1}}class Qu{constructor(t,e){F(this,"pointers",new Map);F(this,"lastPinch",0);F(this,"lastAngle",0);F(this,"lastCentroid",null);F(this,"dragging",!1);F(this,"start",null);F(this,"moved",0);F(this,"right",!1);F(this,"pinchGrid",null);F(this,"onTap",()=>{});this.canvas=t,this.renderer=e,t.addEventListener("pointerdown",n=>this.down(n)),t.addEventListener("pointermove",n=>this.move(n)),t.addEventListener("pointerup",n=>this.up(n)),t.addEventListener("pointercancel",n=>this.up(n)),t.addEventListener("contextmenu",n=>n.preventDefault()),t.addEventListener("wheel",n=>{n.preventDefault(),this.zoomAt(n.clientX,n.clientY,n.deltaY<0?1.08:.92)},{passive:!1})}pos(t){const e=this.canvas.getBoundingClientRect();return{x:t.clientX-e.left,y:t.clientY-e.top}}centroid(){const t=[...this.pointers.values()];let e=0,n=0;for(const s of t)e+=s.x,n+=s.y;return{x:e/t.length,y:n/t.length}}down(t){this.canvas.setPointerCapture(t.pointerId);const e=this.pos(t);if(this.pointers.set(t.pointerId,e),t.button===2&&(this.right=!0),this.pointers.size===1)this.start=e,this.moved=0,this.dragging=!1;else if(this.pointers.size===2){this.lastPinch=this.pinchDist(),this.lastAngle=this.pinchAngle();const n=this.centroid();this.lastCentroid=n,this.pinchGrid=this.renderer.screenToGrid(n.x,n.y),this.dragging=!0}}move(t){if(!this.pointers.has(t.pointerId))return;const e=this.pos(t),n=this.pointers.get(t.pointerId);if(this.pointers.set(t.pointerId,e),this.pointers.size===2){const a=this.pinchDist(),o=this.pinchAngle(),l=this.centroid();if(this.lastPinch>0){const c=a/this.lastPinch;this.renderer.yaw-=o-this.lastAngle,this.lastCentroid&&this.renderer.addPitch(l.y-this.lastCentroid.y),this.zoomAtScreen(l.x,l.y,c),this.pinchGrid&&this.renderer.lockGridToScreen(this.pinchGrid.x,this.pinchGrid.y,0,l.x,l.y)}this.lastPinch=a,this.lastAngle=o,this.lastCentroid=l,this.dragging=!0;return}const s=e.x-n.x,r=e.y-n.y;if(this.moved+=Math.hypot(s,r),this.moved>10&&(this.dragging=!0),this.right){const a=this.renderer.screenToGrid(this.renderer.w/2,this.renderer.h/2);this.renderer.yaw+=s*.01,this.renderer.addPitch(r),this.renderer.lockGridToScreen(a.x,a.y,0,this.renderer.w/2,this.renderer.h/2);return}if(this.dragging){const a=this.renderer.cam.zoom;this.renderer.cam.x-=s/a,this.renderer.cam.y-=r/a}}up(t){const e=this.pointers.get(t.pointerId);this.pointers.delete(t.pointerId),t.button===2&&(this.right=!1),this.pointers.size<2&&(this.lastPinch=0,this.pinchGrid=null,this.lastCentroid=null),this.pointers.size===0?(!this.dragging&&this.start&&e&&this.onTap(e,{x:t.clientX,y:t.clientY}),this.start=null,this.dragging=!1,this.moved=0,this.right=!1):this.dragging=!0}pinchDist(){const t=[...this.pointers.values()];return t.length<2?0:Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y)}pinchAngle(){const t=[...this.pointers.values()];return t.length<2?0:Math.atan2(t[1].y-t[0].y,t[1].x-t[0].x)}zoomAt(t,e,n){const s=this.canvas.getBoundingClientRect();this.zoomAtScreen(t-s.left,e-s.top,n)}zoomAtScreen(t,e,n){const s=this.renderer.cam,r=s.x+(t-this.renderer.w/2)/s.zoom,a=s.y+(e-this.renderer.h/2)/s.zoom;s.zoom=Math.min(this.renderer.maxZoom(),Math.max(this.renderer.minZoom(),s.zoom*n)),s.x=r-(t-this.renderer.w/2)/s.zoom,s.y=a-(e-this.renderer.h/2)/s.zoom}}const Al=14,ju=5,tf=9,li={bandage:{id:"bandage",name:"繃帶",hint:"回復 14 生命。"},stim:{id:"stim",name:"提神",hint:"下次攻擊 +5。"}},Ci=[{id:"bandage",qty:2},{id:"stim",qty:1}];function tn(i){return i.map(t=>({id:t.id,qty:t.qty})).filter(t=>t.qty>0)}function Br(i,t,e=1){const n=i.find(a=>a.id===t),s=n?.qty??0,r=Math.min(e,tf-s);return r<=0?0:(n?n.qty+=r:i.push({id:t,qty:r}),r)}function ef(i,t){const e=i.find(n=>n.id===t);if(!e||e.qty<=0)return!1;if(e.qty-=1,e.qty<=0){const n=i.indexOf(e);n>=0&&i.splice(n,1)}return!0}function Hr(i){return i.filter(t=>!t.dead&&(t.stance==="friendly"||t.team==="player"))}const zr=8,Rl=12;function nf(i,t){const n={id:`obj-${i.type}-${t}-${i.x}-${i.y}`,x:i.x,y:i.y,type:i.type,gone:!1,used:!1,item:i.item,unblock:i.unblock??[],healAdj:i.healAdj??0};switch(i.type){case"kit":return{...n,kind:"pickup",hp:1,maxHp:1,label:"急救包",standH:0,item:i.item??"bandage"};case"switch":return{...n,kind:"trigger",hp:1,maxHp:1,label:"開關",standH:0};case"van":return{...n,kind:"trigger",hp:1,maxHp:1,label:"貨車門",standH:0};case"barrel":return{...n,kind:"destructible",hp:Rl,maxHp:Rl,label:"油桶",standH:0};case"crate":return{...n,kind:"platform",hp:1,maxHp:1,label:"貨箱",standH:1};case"pallet":return{...n,kind:"platform",hp:1,maxHp:1,label:"棧板",standH:1}}}function sf(i){return i.gone?!1:i.kind==="destructible"||i.type==="van"&&!i.used}function rf(i){const t=new Map;for(const e of i)e.gone||t.set(Ft(e.x,e.y),e);return t}class Gr{constructor(t){F(this,"w");F(this,"h");F(this,"theme");F(this,"tiles",[]);F(this,"objects",[]);this.w=t.w,this.h=t.h,this.theme=t.theme??"roof";const e=new Map;for(const[s,r,a]of t.blocked)e.set(Ft(s,r),a);const n=new Set((t.lamps??[]).map(([s,r])=>Ft(s,r)));for(let s=0;s<t.h;s++){const r=[],a=t.heights[s]??"";for(let o=0;o<t.w;o++){const l=Number(a[o]??"0");let c="street";l===2?c="roof":l===1&&(c="stairs");const h=e.get(Ft(o,s))??(n.has(Ft(o,s))?"lamp":void 0);r.push({x:o,y:s,h:l,terrain:c,blocked:h==="stall"||h==="ac"||h==="crate",prop:h})}this.tiles.push(r)}this.objects=(t.objects??[]).map((s,r)=>nf(s,r))}inBounds(t,e){return t>=0&&e>=0&&t<this.w&&e<this.h}tile(t,e){return this.inBounds(t,e)?this.tiles[e][t]:null}objAt(t,e){return rf(this.objects).get(Ft(t,e))}heightAt(t,e){const n=this.tile(t,e);if(!n)return 0;const s=this.objAt(t,e),r=s&&!s.gone&&s.kind==="platform"?s.standH:0;return n.h+r}walkable(t,e){const n=this.tile(t,e);if(!n||n.blocked)return!1;const s=this.objAt(t,e);return!(s&&sf(s))}unblock(t,e){const n=this.tile(t,e);n&&(n.blocked=!1,(n.prop==="crate"||n.prop==="stall")&&(n.prop=void 0))}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Go="185",af=0,Cl=1,of=2,ur=1,lf=2,gs=3,si=0,qe=1,Nn=2,kn=0,$i=1,Pl=2,Ll=3,Il=4,cf=5,mi=100,hf=101,uf=102,ff=103,df=104,pf=200,mf=201,gf=202,xf=203,Ga=204,Va=205,_f=206,vf=207,yf=208,Mf=209,Sf=210,bf=211,Tf=212,Ef=213,wf=214,Wa=0,Xa=1,qa=2,Qi=3,Ya=4,$a=5,Ka=6,Za=7,xh=0,Af=1,Rf=2,Tn=0,_h=1,vh=2,yh=3,Mh=4,Sh=5,bh=6,Th=7,Eh=300,Si=301,ji=302,Vr=303,Wr=304,Ar=306,Ja=1e3,Fn=1001,Qa=1002,Ie=1003,Cf=1004,Fs=1005,Oe=1006,Xr=1007,vi=1008,Je=1009,wh=1010,Ah=1011,Es=1012,Vo=1013,wn=1014,Sn=1015,zn=1016,Wo=1017,Xo=1018,ws=1020,Rh=35902,Ch=35899,Ph=1021,Lh=1022,un=1023,Gn=1026,yi=1027,Ih=1028,qo=1029,bi=1030,Yo=1031,$o=1033,fr=33776,dr=33777,pr=33778,mr=33779,ja=35840,to=35841,eo=35842,no=35843,io=36196,so=37492,ro=37496,ao=37488,oo=37489,yr=37490,lo=37491,co=37808,ho=37809,uo=37810,fo=37811,po=37812,mo=37813,go=37814,xo=37815,_o=37816,vo=37817,yo=37818,Mo=37819,So=37820,bo=37821,To=36492,Eo=36494,wo=36495,Ao=36283,Ro=36284,Mr=36285,Co=36286,Pf=3200,Po=0,Lf=1,ti="",Ze="srgb",Sr="srgb-linear",br="linear",ee="srgb",Pi=7680,Dl=519,If=512,Df=513,Uf=514,Ko=515,Nf=516,Ff=517,Zo=518,Of=519,Ul=35044,Nl="300 es",bn=2e3,As=2001;function kf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Tr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Bf(){const i=Tr("canvas");return i.style.display="block",i}const Fl={};function Ol(...i){const t="THREE."+i.shift();console.log(t,...i)}function Dh(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Lt(...i){i=Dh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Zt(...i){i=Dh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Ki(...i){const t=i.join(" ");t in Fl||(Fl[t]=!0,Lt(...i))}function Hf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const zf={[Wa]:Xa,[qa]:Ka,[Ya]:Za,[Qi]:$a,[Xa]:Wa,[Ka]:qa,[Za]:Ya,[$a]:Qi};class Ei{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],qr=Math.PI/180,Lo=180/Math.PI;function is(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Gt(i,t,e){return Math.max(t,Math.min(e,i))}function Gf(i,t){return(i%t+t)%t}function Yr(i,t,e){return(1-e)*i+e*t}function ls(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function We(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const al=class al{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};al.prototype.isVector2=!0;let ht=al;class ss{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[a+0],d=r[a+1],m=r[a+2],x=r[a+3];if(f!==x||l!==u||c!==d||h!==m){let g=l*u+c*d+h*m+f*x;g<0&&(u=-u,d=-d,m=-m,x=-x,g=-g);let p=1-o;if(g<.9995){const M=Math.acos(g),T=Math.sin(M);p=Math.sin(p*M)/T,o=Math.sin(o*M)/T,l=l*p+u*o,c=c*p+d*o,h=h*p+m*o,f=f*p+x*o}else{l=l*p+u*o,c=c*p+d*o,h=h*p+m*o,f=f*p+x*o;const M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],u=r[a+1],d=r[a+2],m=r[a+3];return t[e]=o*m+h*f+l*d-c*u,t[e+1]=l*m+h*u+c*f-o*d,t[e+2]=c*m+h*d+o*u-l*f,t[e+3]=h*m-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),u=l(n/2),d=l(s/2),m=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:Lt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Gt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const ol=class ol{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(kl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(kl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return $r.copy(this).projectOnVector(t),this.sub($r)}reflect(t){return this.sub($r.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ol.prototype.isVector3=!0;let I=ol;const $r=new I,kl=new ss,ll=class ll{constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],m=n[8],x=s[0],g=s[3],p=s[6],M=s[1],T=s[4],y=s[7],w=s[2],b=s[5],R=s[8];return r[0]=a*x+o*M+l*w,r[3]=a*g+o*T+l*b,r[6]=a*p+o*y+l*R,r[1]=c*x+h*M+f*w,r[4]=c*g+h*T+f*b,r[7]=c*p+h*y+f*R,r[2]=u*x+d*M+m*w,r[5]=u*g+d*T+m*b,r[8]=u*p+d*y+m*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,m=e*f+n*u+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return t[0]=f*x,t[1]=(s*c-h*n)*x,t[2]=(o*n-s*a)*x,t[3]=u*x,t[4]=(h*e-s*l)*x,t[5]=(s*r-o*e)*x,t[6]=d*x,t[7]=(n*l-c*e)*x,t[8]=(a*e-n*r)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Ki("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Kr.makeScale(t,e)),this}rotate(t){return Ki("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Kr.makeRotation(-t)),this}translate(t,e){return Ki("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Kr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};ll.prototype.isMatrix3=!0;let Nt=ll;const Kr=new Nt,Bl=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Hl=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vf(){const i={enabled:!0,workingColorSpace:Sr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ee&&(s.r=Bn(s.r),s.g=Bn(s.g),s.b=Bn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ee&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ti?br:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ki("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ki("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Sr]:{primaries:t,whitePoint:n,transfer:br,toXYZ:Bl,fromXYZ:Hl,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ze},outputColorSpaceConfig:{drawingBufferColorSpace:Ze}},[Ze]:{primaries:t,whitePoint:n,transfer:ee,toXYZ:Bl,fromXYZ:Hl,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ze}}}),i}const Wt=Vf();function Bn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Zi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Li;class Wf{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Li===void 0&&(Li=Tr("canvas")),Li.width=t.width,Li.height=t.height;const s=Li.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Li}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Tr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Bn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Bn(e[n]/255)*255):e[n]=Bn(e[n]);return{data:e,width:t.width,height:t.height}}else return Lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Xf=0;class Jo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xf++}),this.uuid=is(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Zr(s[a].image)):r.push(Zr(s[a]))}else r=Zr(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function Zr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Lt("Texture: Unable to serialize Texture."),{})}let qf=0;const Jr=new I;class Ge extends Ei{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=Fn,s=Fn,r=Oe,a=vi,o=un,l=Je,c=Ge.DEFAULT_ANISOTROPY,h=ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qf++}),this.uuid=is(),this.name="",this.source=new Jo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Jr).x}get height(){return this.source.getSize(Jr).y}get depth(){return this.source.getSize(Jr).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Lt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Lt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Eh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ja:t.x=t.x-Math.floor(t.x);break;case Fn:t.x=t.x<0?0:1;break;case Qa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ja:t.y=t.y-Math.floor(t.y);break;case Fn:t.y=t.y<0?0:1;break;case Qa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=Eh;Ge.DEFAULT_ANISOTROPY=1;const cl=class cl{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],x=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(c+1)/2,y=(d+1)/2,w=(p+1)/2,b=(h+u)/4,R=(f+x)/4,v=(m+g)/4;return T>y&&T>w?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=b/n,r=R/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=v/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=R/r,s=v/r),this.set(n,s,r,e),this}let M=Math.sqrt((g-m)*(g-m)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(g-m)/M,this.y=(f-x)/M,this.z=(u-h)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this.w=Gt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this.w=Gt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};cl.prototype.isVector4=!0;let fe=cl;class Yf extends Ei{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Oe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new fe(0,0,t,e),this.scissorTest=!1,this.viewport=new fe(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new Ge(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Oe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Jo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class En extends Yf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Uh extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class $f extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Fn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const wr=class wr{constructor(t,e,n,s,r,a,o,l,c,h,f,u,d,m,x,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,u,d,m,x,g)}set(t,e,n,s,r,a,o,l,c,h,f,u,d,m,x,g){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=m,p[11]=x,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new wr().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Ii.setFromMatrixColumn(t,0).length(),r=1/Ii.setFromMatrixColumn(t,1).length(),a=1/Ii.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=a*h,d=a*f,m=o*h,x=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+m*c,e[5]=u-x*c,e[9]=-o*l,e[2]=x-u*c,e[6]=m+d*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,m=c*h,x=c*f;e[0]=u+x*o,e[4]=m*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-m,e[6]=x+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,m=c*h,x=c*f;e[0]=u-x*o,e[4]=-a*f,e[8]=m+d*o,e[1]=d+m*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,d=a*f,m=o*h,x=o*f;e[0]=l*h,e[4]=m*c-d,e[8]=u*c+x,e[1]=l*f,e[5]=x*c+u,e[9]=d*c-m,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,d=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=x-u*f,e[8]=m*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+m,e[10]=u-x*f}else if(t.order==="XZY"){const u=a*l,d=a*c,m=o*l,x=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+x,e[5]=a*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=o*h,e[10]=x*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Kf,t,Zf)}lookAt(t,e,n){const s=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),Yn.crossVectors(n,$e),Yn.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),Yn.crossVectors(n,$e)),Yn.normalize(),Os.crossVectors($e,Yn),s[0]=Yn.x,s[4]=Os.x,s[8]=$e.x,s[1]=Yn.y,s[5]=Os.y,s[9]=$e.y,s[2]=Yn.z,s[6]=Os.z,s[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],m=n[2],x=n[6],g=n[10],p=n[14],M=n[3],T=n[7],y=n[11],w=n[15],b=s[0],R=s[4],v=s[8],E=s[12],C=s[1],P=s[5],D=s[9],W=s[13],$=s[2],k=s[6],Y=s[10],B=s[14],Q=s[3],tt=s[7],at=s[11],pt=s[15];return r[0]=a*b+o*C+l*$+c*Q,r[4]=a*R+o*P+l*k+c*tt,r[8]=a*v+o*D+l*Y+c*at,r[12]=a*E+o*W+l*B+c*pt,r[1]=h*b+f*C+u*$+d*Q,r[5]=h*R+f*P+u*k+d*tt,r[9]=h*v+f*D+u*Y+d*at,r[13]=h*E+f*W+u*B+d*pt,r[2]=m*b+x*C+g*$+p*Q,r[6]=m*R+x*P+g*k+p*tt,r[10]=m*v+x*D+g*Y+p*at,r[14]=m*E+x*W+g*B+p*pt,r[3]=M*b+T*C+y*$+w*Q,r[7]=M*R+T*P+y*k+w*tt,r[11]=M*v+T*D+y*Y+w*at,r[15]=M*E+T*W+y*B+w*pt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],m=t[3],x=t[7],g=t[11],p=t[15],M=l*d-c*u,T=o*d-c*f,y=o*u-l*f,w=a*d-c*h,b=a*u-l*h,R=a*f-o*h;return e*(x*M-g*T+p*y)-n*(m*M-g*w+p*b)+s*(m*T-x*w+p*R)-r*(m*y-x*b+g*R)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],m=t[12],x=t[13],g=t[14],p=t[15],M=e*o-n*a,T=e*l-s*a,y=e*c-r*a,w=n*l-s*o,b=n*c-r*o,R=s*c-r*l,v=h*x-f*m,E=h*g-u*m,C=h*p-d*m,P=f*g-u*x,D=f*p-d*x,W=u*p-d*g,$=M*W-T*D+y*P+w*C-b*E+R*v;if($===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const k=1/$;return t[0]=(o*W-l*D+c*P)*k,t[1]=(s*D-n*W-r*P)*k,t[2]=(x*R-g*b+p*w)*k,t[3]=(u*b-f*R-d*w)*k,t[4]=(l*C-a*W-c*E)*k,t[5]=(e*W-s*C+r*E)*k,t[6]=(g*y-m*R-p*T)*k,t[7]=(h*R-u*y+d*T)*k,t[8]=(a*D-o*C+c*v)*k,t[9]=(n*C-e*D-r*v)*k,t[10]=(m*b-x*y+p*M)*k,t[11]=(f*y-h*b-d*M)*k,t[12]=(o*E-a*P-l*v)*k,t[13]=(e*P-n*E+s*v)*k,t[14]=(x*T-m*w-g*M)*k,t[15]=(h*w-f*T+u*M)*k,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,m=r*f,x=a*h,g=a*f,p=o*f,M=l*c,T=l*h,y=l*f,w=n.x,b=n.y,R=n.z;return s[0]=(1-(x+p))*w,s[1]=(d+y)*w,s[2]=(m-T)*w,s[3]=0,s[4]=(d-y)*b,s[5]=(1-(u+p))*b,s[6]=(g+M)*b,s[7]=0,s[8]=(m+T)*R,s[9]=(g-M)*R,s[10]=(1-(u+x))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Ii.set(s[0],s[1],s[2]).length();const o=Ii.set(s[4],s[5],s[6]).length(),l=Ii.set(s[8],s[9],s[10]).length();r<0&&(a=-a),sn.copy(this);const c=1/a,h=1/o,f=1/l;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=f,sn.elements[9]*=f,sn.elements[10]*=f,e.setFromRotationMatrix(sn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=bn,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let m,x;if(l)m=r/(a-r),x=a*r/(a-r);else if(o===bn)m=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===As)m=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=bn,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s);let m,x;if(l)m=1/(a-r),x=a/(a-r);else if(o===bn)m=-2/(a-r),x=-(a+r)/(a-r);else if(o===As)m=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};wr.prototype.isMatrix4=!0;let ae=wr;const Ii=new I,sn=new ae,Kf=new I(0,0,0),Zf=new I(1,1,1),Yn=new I,Os=new I,$e=new I,zl=new ae,Gl=new ss;class ri{constructor(t=0,e=0,n=0,s=ri.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Gt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Gt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Gt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return zl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(zl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gl.setFromEuler(this),this.setFromQuaternion(Gl,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ri.DEFAULT_ORDER="XYZ";class Nh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Jf=0;const Vl=new I,Di=new ss,Cn=new ae,ks=new I,cs=new I,Qf=new I,jf=new ss,Wl=new I(1,0,0),Xl=new I(0,1,0),ql=new I(0,0,1),Yl={type:"added"},td={type:"removed"},Ui={type:"childadded",child:null},Qr={type:"childremoved",child:null};class De extends Ei{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Jf++}),this.uuid=is(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DEFAULT_UP.clone();const t=new I,e=new ri,n=new ss,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Nt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=De.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Nh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.multiply(Di),this}rotateOnWorldAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.premultiply(Di),this}rotateX(t){return this.rotateOnAxis(Wl,t)}rotateY(t){return this.rotateOnAxis(Xl,t)}rotateZ(t){return this.rotateOnAxis(ql,t)}translateOnAxis(t,e){return Vl.copy(t).applyQuaternion(this.quaternion),this.position.add(Vl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wl,t)}translateY(t){return this.translateOnAxis(Xl,t)}translateZ(t){return this.translateOnAxis(ql,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Cn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ks.copy(t):ks.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),cs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Cn.lookAt(cs,ks,this.up):Cn.lookAt(ks,cs,this.up),this.quaternion.setFromRotationMatrix(Cn),s&&(Cn.extractRotation(s.matrixWorld),Di.setFromRotationMatrix(Cn),this.quaternion.premultiply(Di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Zt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yl),Ui.child=t,this.dispatchEvent(Ui),Ui.child=null):Zt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(td),Qr.child=t,this.dispatchEvent(Qr),Qr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Cn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Cn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Cn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yl),Ui.child=t,this.dispatchEvent(Ui),Ui.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,t,Qf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cs,jf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),m=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}De.DEFAULT_UP=new I(0,1,0);De.DEFAULT_MATRIX_AUTO_UPDATE=!0;De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class qt extends De{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ed={type:"move"};class jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new qt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new qt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new qt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const g=e.getJointPose(x,n),p=this._getHandJoint(c,x);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ed)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new qt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Fh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$n={h:0,s:0,l:0},Bs={h:0,s:0,l:0};function ta(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Wt.workingColorSpace){if(t=Gf(t,1),e=Gt(e,0,1),n=Gt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=ta(a,r,t+1/3),this.g=ta(a,r,t),this.b=ta(a,r,t-1/3)}return Wt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ze){function n(r){r!==void 0&&parseFloat(r)<1&&Lt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Lt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Lt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){const n=Fh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Lt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Bn(t.r),this.g=Bn(t.g),this.b=Bn(t.b),this}copyLinearToSRGB(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return Wt.workingToColorSpace(Fe.copy(this),t),Math.round(Gt(Fe.r*255,0,255))*65536+Math.round(Gt(Fe.g*255,0,255))*256+Math.round(Gt(Fe.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.workingToColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Wt.workingColorSpace){return Wt.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Ze){Wt.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($n),this.setHSL($n.h+t,$n.s+e,$n.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($n),t.getHSL(Bs);const n=Yr($n.h,Bs.h,e),s=Yr($n.s,Bs.s,e),r=Yr($n.l,Bs.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Yt;Yt.NAMES=Fh;class nd extends De{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ri,this.environmentIntensity=1,this.environmentRotation=new ri,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const rn=new I,Pn=new I,ea=new I,Ln=new I,Ni=new I,Fi=new I,$l=new I,na=new I,ia=new I,sa=new I,ra=new fe,aa=new fe,oa=new fe;class cn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),rn.subVectors(t,e),s.cross(rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){rn.subVectors(s,e),Pn.subVectors(n,e),ea.subVectors(t,e);const a=rn.dot(rn),o=rn.dot(Pn),l=rn.dot(ea),c=Pn.dot(Pn),h=Pn.dot(ea),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,m=(a*h-o*l)*u;return r.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ln)===null?!1:Ln.x>=0&&Ln.y>=0&&Ln.x+Ln.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Ln)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ln.x),l.addScaledVector(a,Ln.y),l.addScaledVector(o,Ln.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return ra.setScalar(0),aa.setScalar(0),oa.setScalar(0),ra.fromBufferAttribute(t,e),aa.fromBufferAttribute(t,n),oa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ra,r.x),a.addScaledVector(aa,r.y),a.addScaledVector(oa,r.z),a}static isFrontFacing(t,e,n,s){return rn.subVectors(n,e),Pn.subVectors(t,e),rn.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),rn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return cn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return cn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return cn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return cn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return cn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Ni.subVectors(s,n),Fi.subVectors(r,n),na.subVectors(t,n);const l=Ni.dot(na),c=Fi.dot(na);if(l<=0&&c<=0)return e.copy(n);ia.subVectors(t,s);const h=Ni.dot(ia),f=Fi.dot(ia);if(h>=0&&f<=h)return e.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Ni,a);sa.subVectors(t,r);const d=Ni.dot(sa),m=Fi.dot(sa);if(m>=0&&d<=m)return e.copy(r);const x=d*c-l*m;if(x<=0&&c>=0&&m<=0)return o=c/(c-m),e.copy(n).addScaledVector(Fi,o);const g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return $l.subVectors(r,s),o=(f-h)/(f-h+(d-m)),e.copy(s).addScaledVector($l,o);const p=1/(g+x+u);return a=x*p,o=u*p,e.copy(n).addScaledVector(Ni,a).addScaledVector(Fi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Is{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,an):an.fromBufferAttribute(r,a),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Hs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Hs.copy(n.boundingBox)),Hs.applyMatrix4(t.matrixWorld),this.union(Hs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(hs),zs.subVectors(this.max,hs),Oi.subVectors(t.a,hs),ki.subVectors(t.b,hs),Bi.subVectors(t.c,hs),Kn.subVectors(ki,Oi),Zn.subVectors(Bi,ki),ci.subVectors(Oi,Bi);let e=[0,-Kn.z,Kn.y,0,-Zn.z,Zn.y,0,-ci.z,ci.y,Kn.z,0,-Kn.x,Zn.z,0,-Zn.x,ci.z,0,-ci.x,-Kn.y,Kn.x,0,-Zn.y,Zn.x,0,-ci.y,ci.x,0];return!la(e,Oi,ki,Bi,zs)||(e=[1,0,0,0,1,0,0,0,1],!la(e,Oi,ki,Bi,zs))?!1:(Gs.crossVectors(Kn,Zn),e=[Gs.x,Gs.y,Gs.z],la(e,Oi,ki,Bi,zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const In=[new I,new I,new I,new I,new I,new I,new I,new I],an=new I,Hs=new Is,Oi=new I,ki=new I,Bi=new I,Kn=new I,Zn=new I,ci=new I,hs=new I,zs=new I,Gs=new I,hi=new I;function la(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){hi.fromArray(i,r);const o=s.x*Math.abs(hi.x)+s.y*Math.abs(hi.y)+s.z*Math.abs(hi.z),l=t.dot(hi),c=e.dot(hi),h=n.dot(hi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Te=new I,Vs=new ht;let id=0;class fn extends Ei{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:id++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ul,this.updateRanges=[],this.gpuType=Sn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Vs.fromBufferAttribute(this,e),Vs.applyMatrix3(t),this.setXY(e,Vs.x,Vs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ls(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=We(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ls(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ls(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ls(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ls(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array),r=We(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ul&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Oh extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class kh extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const sd=new Is,us=new I,ca=new I;class Qo{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):sd.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;us.subVectors(t,this.center);const e=us.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(us,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ca.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(us.copy(t.center).add(ca)),this.expandByPoint(us.copy(t.center).sub(ca))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let rd=0;const en=new ae,ha=new De,Hi=new I,Ke=new Is,fs=new Is,Pe=new I;class Be extends Ei{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=is(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kf(t)?kh:Oh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Nt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return ha.lookAt(t),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Is);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Zt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Zt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];fs.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Ke.min,fs.min),Ke.expandByPoint(Pe),Pe.addVectors(Ke.max,fs.max),Ke.expandByPoint(Pe)):(Ke.expandByPoint(fs.min),Ke.expandByPoint(fs.max))}Ke.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pe.fromBufferAttribute(o,c),l&&(Hi.fromBufferAttribute(t,c),Pe.add(Hi)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Zt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Zt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new fn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new I,l[v]=new I;const c=new I,h=new I,f=new I,u=new ht,d=new ht,m=new ht,x=new I,g=new I;function p(v,E,C){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,E),f.fromBufferAttribute(n,C),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,E),m.fromBufferAttribute(r,C),h.sub(c),f.sub(c),d.sub(u),m.sub(u);const P=1/(d.x*m.y-m.x*d.y);isFinite(P)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(P),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(P),o[v].add(x),o[E].add(x),o[C].add(x),l[v].add(g),l[E].add(g),l[C].add(g))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let v=0,E=M.length;v<E;++v){const C=M[v],P=C.start,D=C.count;for(let W=P,$=P+D;W<$;W+=3)p(t.getX(W+0),t.getX(W+1),t.getX(W+2))}const T=new I,y=new I,w=new I,b=new I;function R(v){w.fromBufferAttribute(s,v),b.copy(w);const E=o[v];T.copy(E),T.sub(w.multiplyScalar(w.dot(E))).normalize(),y.crossVectors(b,E);const P=y.dot(l[v])<0?-1:1;a.setXYZW(v,T.x,T.y,T.z,P)}for(let v=0,E=M.length;v<E;++v){const C=M[v],P=C.start,D=C.count;for(let W=P,$=P+D;W<$;W+=3)R(t.getX(W+0)),R(t.getX(W+1)),R(t.getX(W+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,f=new I;if(t)for(let u=0,d=t.count;u<d;u+=3){const m=t.getX(u+0),x=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),a.fromBufferAttribute(e,g),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(m,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,m=0;for(let x=0,g=l.length;x<g;x++){o.isInterleavedBufferAttribute?d=l[x]*o.data.stride+o.offset:d=l[x]*h;for(let p=0;p<h;p++)u[m++]=c[d++]}return new fn(u,h,f)}if(this.index===null)return Lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Be,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let ad=0;class Ds extends Ei{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ad++}),this.uuid=is(),this.name="",this.type="Material",this.blending=$i,this.side=si,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ga,this.blendDst=Va,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Yt(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Lt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Lt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(n.blending=this.blending),this.side!==si&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ga&&(n.blendSrc=this.blendSrc),this.blendDst!==Va&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Dl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Yt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ht().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ht().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const Dn=new I,ua=new I,Ws=new I,Jn=new I,fa=new I,Xs=new I,da=new I;class od{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Dn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Dn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Dn.copy(this.origin).addScaledVector(this.direction,e),Dn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ua.copy(t).add(e).multiplyScalar(.5),Ws.copy(e).sub(t).normalize(),Jn.copy(this.origin).sub(ua);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Ws),o=Jn.dot(this.direction),l=-Jn.dot(Ws),c=Jn.lengthSq(),h=Math.abs(1-a*a);let f,u,d,m;if(h>0)if(f=a*l-o,u=a*o-l,m=r*h,f>=0)if(u>=-m)if(u<=m){const x=1/h;f*=x,u*=x,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ua).addScaledVector(Ws,u),d}intersectSphere(t,e){Dn.subVectors(t.center,this.origin);const n=Dn.dot(this.direction),s=Dn.dot(Dn)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Dn)!==null}intersectTriangle(t,e,n,s,r){fa.subVectors(e,t),Xs.subVectors(n,t),da.crossVectors(fa,Xs);let a=this.direction.dot(da),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jn.subVectors(this.origin,t);const l=o*this.direction.dot(Xs.crossVectors(Jn,Xs));if(l<0)return null;const c=o*this.direction.dot(fa.cross(Jn));if(c<0||l+c>a)return null;const h=-o*Jn.dot(da);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bh extends Ds{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.combine=xh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Kl=new ae,ui=new od,qs=new Qo,Zl=new I,Ys=new I,$s=new I,Ks=new I,pa=new I,Zs=new I,Jl=new I,Js=new I;class Dt extends De{constructor(t=new Be,e=new Bh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Zs.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(pa.fromBufferAttribute(f,t),a?Zs.addScaledVector(pa,h):Zs.addScaledVector(pa.sub(e),h))}e.add(Zs)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),qs.copy(n.boundingSphere),qs.applyMatrix4(r),ui.copy(t.ray).recast(t.near),!(qs.containsPoint(ui.origin)===!1&&(ui.intersectSphere(qs,Zl)===null||ui.origin.distanceToSquared(Zl)>(t.far-t.near)**2))&&(Kl.copy(r).invert(),ui.copy(t.ray).applyMatrix4(Kl),!(n.boundingBox!==null&&ui.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ui)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){const g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),T=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let y=M,w=T;y<w;y+=3){const b=o.getX(y),R=o.getX(y+1),v=o.getX(y+2);s=Qs(this,p,t,n,c,h,f,b,R,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),x=Math.min(o.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const M=o.getX(g),T=o.getX(g+1),y=o.getX(g+2);s=Qs(this,a,t,n,c,h,f,M,T,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let m=0,x=u.length;m<x;m++){const g=u[m],p=a[g.materialIndex],M=Math.max(g.start,d.start),T=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let y=M,w=T;y<w;y+=3){const b=y,R=y+1,v=y+2;s=Qs(this,p,t,n,c,h,f,b,R,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{const m=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let g=m,p=x;g<p;g+=3){const M=g,T=g+1,y=g+2;s=Qs(this,a,t,n,c,h,f,M,T,y),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}}function ld(i,t,e,n,s,r,a,o){let l;if(t.side===qe?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===si,o),l===null)return null;Js.copy(o),Js.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Js);return c<e.near||c>e.far?null:{distance:c,point:Js.clone(),object:i}}function Qs(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,Ys),i.getVertexPosition(l,$s),i.getVertexPosition(c,Ks);const h=ld(i,t,e,n,Ys,$s,Ks,Jl);if(h){const f=new I;cn.getBarycoord(Jl,Ys,$s,Ks,f),s&&(h.uv=cn.getInterpolatedAttribute(s,o,l,c,f,new ht)),r&&(h.uv1=cn.getInterpolatedAttribute(r,o,l,c,f,new ht)),a&&(h.normal=cn.getInterpolatedAttribute(a,o,l,c,f,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new I,materialIndex:0};cn.getNormal(Ys,$s,Ks,u.normal),h.face=u,h.barycoord=f}return h}class cd extends Ge{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Ie,h=Ie,f,u){super(null,a,o,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ma=new I,hd=new I,ud=new Nt;class pi{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ma.subVectors(n,e).cross(hd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(ma),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||ud.getNormalMatrix(t),s=this.coplanarPoint(ma).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new Qo,fd=new ht(.5,.5),js=new I;class jo{constructor(t=new pi,e=new pi,n=new pi,s=new pi,r=new pi,a=new pi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=bn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],m=r[8],x=r[9],g=r[10],p=r[11],M=r[12],T=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-a,d-h,p-m,w-M).normalize(),s[1].setComponents(c+a,d+h,p+m,w+M).normalize(),s[2].setComponents(c+o,d+f,p+x,w+T).normalize(),s[3].setComponents(c-o,d-f,p-x,w-T).normalize(),n)s[4].setComponents(l,u,g,y).normalize(),s[5].setComponents(c-l,d-u,p-g,w-y).normalize();else if(s[4].setComponents(c-l,d-u,p-g,w-y).normalize(),e===bn)s[5].setComponents(c+l,d+u,p+g,w+y).normalize();else if(e===As)s[5].setComponents(l,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(t){fi.center.set(0,0,0);const e=fd.distanceTo(t.center);return fi.radius=.7071067811865476+e,fi.applyMatrix4(t.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(js.x=s.normal.x>0?t.max.x:t.min.x,js.y=s.normal.y>0?t.max.y:t.min.y,js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(js)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Hh extends Ge{constructor(t=[],e=Si,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ts extends Ge{constructor(t,e,n=wn,s,r,a,o=Ie,l=Ie,c,h=Gn,f=1){if(h!==Gn&&h!==yi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:f};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Jo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class dd extends ts{constructor(t,e=wn,n=Si,s,r,a=Ie,o=Ie,l,c=Gn){const h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class zh extends Ge{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Vn extends Be{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;m("z","y","x",-1,-1,n,e,t,a,r,0),m("z","y","x",1,-1,n,e,-t,a,r,1),m("x","z","y",1,1,t,n,e,s,a,2),m("x","z","y",1,-1,t,n,-e,s,a,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2));function m(x,g,p,M,T,y,w,b,R,v,E){const C=y/R,P=w/v,D=y/2,W=w/2,$=b/2,k=R+1,Y=v+1;let B=0,Q=0;const tt=new I;for(let at=0;at<Y;at++){const pt=at*P-W;for(let yt=0;yt<k;yt++){const Xt=yt*C-D;tt[x]=Xt*M,tt[g]=pt*T,tt[p]=$,c.push(tt.x,tt.y,tt.z),tt[x]=0,tt[g]=0,tt[p]=b>0?1:-1,h.push(tt.x,tt.y,tt.z),f.push(yt/R),f.push(1-at/v),B+=1}}for(let at=0;at<v;at++)for(let pt=0;pt<R;pt++){const yt=u+pt+k*at,Xt=u+pt+k*(at+1),me=u+(pt+1)+k*(at+1),Jt=u+(pt+1)+k*at;l.push(yt,Xt,Jt),l.push(Xt,me,Jt),Q+=6}o.addGroup(d,Q,E),d+=Q,u+=B}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ke extends Be{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,f=Math.PI/2*t,u=e,d=2*f+u,m=n*2+r,x=s+1,g=new I,p=new I;for(let M=0;M<=m;M++){let T=0,y=0,w=0,b=0;if(M<=n){const E=M/n,C=E*Math.PI/2;y=-h-t*Math.cos(C),w=t*Math.sin(C),b=-t*Math.cos(C),T=E*f}else if(M<=n+r){const E=(M-n)/r;y=-h+E*e,w=t,b=0,T=f+E*u}else{const E=(M-n-r)/n,C=E*Math.PI/2;y=h+t*Math.sin(C),w=t*Math.cos(C),b=t*Math.sin(C),T=f+u+E*f}const R=Math.max(0,Math.min(1,T/d));let v=0;M===0?v=.5/s:M===m&&(v=-.5/s);for(let E=0;E<=s;E++){const C=E/s,P=C*Math.PI*2,D=Math.sin(P),W=Math.cos(P);p.x=-w*W,p.y=y,p.z=w*D,o.push(p.x,p.y,p.z),g.set(-w*W,b,w*D),g.normalize(),l.push(g.x,g.y,g.z),c.push(C+v,R)}if(M>0){const E=(M-1)*x;for(let C=0;C<s;C++){const P=E+C,D=E+C+1,W=M*x+C,$=M*x+C+1;a.push(P,D,W),a.push(D,$,W)}}}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ke(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Mi extends Be{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],u=[],d=[];let m=0;const x=[],g=n/2;let p=0;M(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new oe(f,3)),this.setAttribute("normal",new oe(u,3)),this.setAttribute("uv",new oe(d,2));function M(){const y=new I,w=new I;let b=0;const R=(e-t)/n;for(let v=0;v<=r;v++){const E=[],C=v/r,P=C*(e-t)+t;for(let D=0;D<=s;D++){const W=D/s,$=W*l+o,k=Math.sin($),Y=Math.cos($);w.x=P*k,w.y=-C*n+g,w.z=P*Y,f.push(w.x,w.y,w.z),y.set(k,R,Y).normalize(),u.push(y.x,y.y,y.z),d.push(W,1-C),E.push(m++)}x.push(E)}for(let v=0;v<s;v++)for(let E=0;E<r;E++){const C=x[E][v],P=x[E+1][v],D=x[E+1][v+1],W=x[E][v+1];(t>0||E!==0)&&(h.push(C,P,W),b+=3),(e>0||E!==r-1)&&(h.push(P,D,W),b+=3)}c.addGroup(p,b,0),p+=b}function T(y){const w=m,b=new ht,R=new I;let v=0;const E=y===!0?t:e,C=y===!0?1:-1;for(let D=1;D<=s;D++)f.push(0,g*C,0),u.push(0,C,0),d.push(.5,.5),m++;const P=m;for(let D=0;D<=s;D++){const $=D/s*l+o,k=Math.cos($),Y=Math.sin($);R.x=E*Y,R.y=g*C,R.z=E*k,f.push(R.x,R.y,R.z),u.push(0,C,0),b.x=k*.5+.5,b.y=Y*.5*C+.5,d.push(b.x,b.y),m++}for(let D=0;D<s;D++){const W=w+D,$=P+D;y===!0?h.push($,$+1,W):h.push($+1,$,W),v+=3}c.addGroup(p,v,y===!0?1:2),p+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Mi(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class tl extends Mi{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new tl(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Rn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Lt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,d=(a-h)/u;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ht:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,l=new ae;for(let d=0;d<=t;d++){const m=d/t;s[d]=this.getTangentAt(m,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const m=Math.acos(Gt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,m))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Gt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(s[m],d*m)),a[m].crossVectors(s[m],r[m])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class el extends Rn{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ht){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class pd extends el{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function nl(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,s(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Ql=new I,jl=new I,ga=new nl,xa=new nl,_a=new nl;class md extends Rn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(jl.subVectors(s[0],s[1]).add(s[0]),c=jl);const f=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Ql.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Ql),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(f),d),x=Math.pow(f.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(h),d);x<1e-4&&(x=1),m<1e-4&&(m=x),g<1e-4&&(g=x),ga.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,m,x,g),xa.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,m,x,g),_a.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,m,x,g)}else this.curveType==="catmullrom"&&(ga.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),xa.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),_a.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return n.set(ga.calc(l),xa.calc(l),_a.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function tc(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function gd(i,t){const e=1-i;return e*e*t}function xd(i,t){return 2*(1-i)*i*t}function _d(i,t){return i*i*t}function ys(i,t,e,n){return gd(i,t)+xd(i,e)+_d(i,n)}function vd(i,t){const e=1-i;return e*e*e*t}function yd(i,t){const e=1-i;return 3*e*e*i*t}function Md(i,t){return 3*(1-i)*i*i*t}function Sd(i,t){return i*i*i*t}function Ms(i,t,e,n,s){return vd(i,t)+yd(i,e)+Md(i,n)+Sd(i,s)}class Gh extends Rn{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ms(t,s.x,r.x,a.x,o.x),Ms(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class bd extends Rn{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Ms(t,s.x,r.x,a.x,o.x),Ms(t,s.y,r.y,a.y,o.y),Ms(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Vh extends Rn{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Td extends Rn{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wh extends Rn{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ys(t,s.x,r.x,a.x),ys(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ed extends Rn{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ys(t,s.x,r.x,a.x),ys(t,s.y,r.y,a.y),ys(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xh extends Rn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(tc(o,l.x,c.x,h.x,f.x),tc(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var ec=Object.freeze({__proto__:null,ArcCurve:pd,CatmullRomCurve3:md,CubicBezierCurve:Gh,CubicBezierCurve3:bd,EllipseCurve:el,LineCurve:Vh,LineCurve3:Td,QuadraticBezierCurve:Wh,QuadraticBezierCurve3:Ed,SplineCurve:Xh});class wd extends Rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ec[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new ec[s.type]().fromJSON(s))}return this}}class nc extends wd{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Vh(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Wh(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Gh(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Xh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new el(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class qh extends nc{constructor(t){super(t),this.uuid=is(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new nc().fromJSON(s))}return this}}function Ad(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Yh(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Id(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let h=o,f=l;for(let u=e;u<s;u+=e){const d=i[u],m=i[u+1];d<o&&(o=d),m<l&&(l=m),d>h&&(h=d),m>f&&(f=m)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Rs(r,a,e,o,l,c,0),a}function Yh(i,t,e,n,s){let r;if(s===Vd(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=ic(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=ic(a/n|0,i[a],i[a+1],r);return r&&es(r,r.next)&&(Ps(r),r=r.next),r}function Ti(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(es(e,e.next)||de(e.prev,e,e.next)===0)){if(Ps(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Rs(i,t,e,n,s,r,a){if(!i)return;!a&&r&&Od(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Cd(i,n,s,r):Rd(i)){t.push(l.i,i.i,c.i),Ps(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Pd(Ti(i),t),Rs(i,t,e,n,s,r,2)):a===2&&Ld(i,t,e,n,s,r):Rs(Ti(i),t,e,n,s,r,1);break}}}function Rd(i){const t=i.prev,e=i,n=i.next;if(de(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),u=Math.max(s,r,a),d=Math.max(o,l,c);let m=n.next;for(;m!==t;){if(m.x>=h&&m.x<=u&&m.y>=f&&m.y<=d&&xs(s,o,r,l,a,c,m.x,m.y)&&de(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Cd(i,t,e,n){const s=i.prev,r=i,a=i.next;if(de(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,u=a.y,d=Math.min(o,l,c),m=Math.min(h,f,u),x=Math.max(o,l,c),g=Math.max(h,f,u),p=Io(d,m,t,e,n),M=Io(x,g,t,e,n);let T=i.prevZ,y=i.nextZ;for(;T&&T.z>=p&&y&&y.z<=M;){if(T.x>=d&&T.x<=x&&T.y>=m&&T.y<=g&&T!==s&&T!==a&&xs(o,h,l,f,c,u,T.x,T.y)&&de(T.prev,T,T.next)>=0||(T=T.prevZ,y.x>=d&&y.x<=x&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&xs(o,h,l,f,c,u,y.x,y.y)&&de(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;T&&T.z>=p;){if(T.x>=d&&T.x<=x&&T.y>=m&&T.y<=g&&T!==s&&T!==a&&xs(o,h,l,f,c,u,T.x,T.y)&&de(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;y&&y.z<=M;){if(y.x>=d&&y.x<=x&&y.y>=m&&y.y<=g&&y!==s&&y!==a&&xs(o,h,l,f,c,u,y.x,y.y)&&de(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Pd(i,t){let e=i;do{const n=e.prev,s=e.next.next;!es(n,s)&&Kh(n,e,e.next,s)&&Cs(n,s)&&Cs(s,n)&&(t.push(n.i,e.i,s.i),Ps(e),Ps(e.next),e=i=s),e=e.next}while(e!==i);return Ti(e)}function Ld(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Hd(a,o)){let l=Zh(a,o);a=Ti(a,a.next),l=Ti(l,l.next),Rs(a,t,e,n,s,r,0),Rs(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Id(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Yh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Bd(c))}s.sort(Dd);for(let r=0;r<s.length;r++)e=Ud(s[r],e);return e}function Dd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Ud(i,t){const e=Nd(i,t);if(!e)return t;const n=Zh(e,i);return Ti(n,n.next),Ti(e,e.next)}function Nd(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(es(i,e))return e;do{if(es(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&$h(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);Cs(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&Fd(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function Fd(i,t){return de(i.prev,i,t.prev)<0&&de(t.next,i,i.next)<0}function Od(i,t,e,n){let s=i;do s.z===0&&(s.z=Io(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,kd(s)}function kd(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function Io(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Bd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function $h(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function xs(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&$h(i,t,e,n,s,r,a,o)}function Hd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!zd(i,t)&&(Cs(i,t)&&Cs(t,i)&&Gd(i,t)&&(de(i.prev,i,t.prev)||de(i,t.prev,t))||es(i,t)&&de(i.prev,i,i.next)>0&&de(t.prev,t,t.next)>0)}function de(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function es(i,t){return i.x===t.x&&i.y===t.y}function Kh(i,t,e,n){const s=er(de(i,t,e)),r=er(de(i,t,n)),a=er(de(e,n,i)),o=er(de(e,n,t));return!!(s!==r&&a!==o||s===0&&tr(i,e,t)||r===0&&tr(i,n,t)||a===0&&tr(e,i,n)||o===0&&tr(e,t,n))}function tr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function er(i){return i>0?1:i<0?-1:0}function zd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Kh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Cs(i,t){return de(i.prev,i,i.next)<0?de(i,t,i.next)>=0&&de(i,i.prev,t)>=0:de(i,t,i.prev)<0||de(i,i.next,t)<0}function Gd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Zh(i,t){const e=Do(i.i,i.x,i.y),n=Do(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function ic(i,t,e,n){const s=Do(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ps(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Do(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Vd(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Wd{static triangulate(t,e,n=2){return Ad(t,e,n)}}class Ss{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ss.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];sc(t),rc(n,t);let a=t.length;e.forEach(sc);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,rc(n,e[l]);const o=Wd.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function sc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function rc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Rr extends Be{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Gt(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new I,u=new ht,d=new I,m=new I,x=new I;let g=0,p=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:g=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,d.x=p*1,d.y=-g,d.z=p*0,x.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:g=t[M+1].x-t[M].x,p=t[M+1].y-t[M].y,d.x=p*1,d.y=-g,d.z=p*0,m.copy(d),d.x+=x.x,d.y+=x.y,d.z+=x.z,d.normalize(),l.push(d.x,d.y,d.z),x.copy(m)}for(let M=0;M<=e;M++){const T=n+M*h*s,y=Math.sin(T),w=Math.cos(T);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*y,f.y=t[b].y,f.z=t[b].x*w,a.push(f.x,f.y,f.z),u.x=M/e,u.y=b/(t.length-1),o.push(u.x,u.y);const R=l[3*b+0]*y,v=l[3*b+1],E=l[3*b+0]*w;c.push(R,v,E)}}for(let M=0;M<e;M++)for(let T=0;T<t.length-1;T++){const y=T+M*t.length,w=y,b=y+t.length,R=y+t.length+1,v=y+1;r.push(w,b,v),r.push(R,v,b)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rr(t.points,t.segments,t.phiStart,t.phiLength)}}class Cr extends Be{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,u=e/l,d=[],m=[],x=[],g=[];for(let p=0;p<h;p++){const M=p*u-a;for(let T=0;T<c;T++){const y=T*f-r;m.push(y,-M,0),x.push(0,0,1),g.push(T/o),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const T=M+c*p,y=M+c*(p+1),w=M+1+c*(p+1),b=M+1+c*p;d.push(T,y,b),d.push(y,w,b)}this.setIndex(d),this.setAttribute("position",new oe(m,3)),this.setAttribute("normal",new oe(x,3)),this.setAttribute("uv",new oe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Cr(t.width,t.height,t.widthSegments,t.heightSegments)}}class il extends Be{constructor(t=new qh([new ht(0,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new oe(s,3)),this.setAttribute("normal",new oe(r,3)),this.setAttribute("uv",new oe(a,2));function c(h){const f=s.length/3,u=h.extractPoints(e);let d=u.shape;const m=u.holes;Ss.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,p=m.length;g<p;g++){const M=m[g];Ss.isClockWise(M)===!0&&(m[g]=M.reverse())}const x=Ss.triangulateShape(d,m);for(let g=0,p=m.length;g<p;g++){const M=m[g];d=d.concat(M)}for(let g=0,p=d.length;g<p;g++){const M=d[g];s.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let g=0,p=x.length;g<p;g++){const M=x[g],T=M[0]+f,y=M[1]+f,w=M[2]+f;n.push(T,y,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Xd(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new il(n,t.curveSegments)}}function Xd(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Xe extends Be{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new I,u=new I,d=[],m=[],x=[],g=[];for(let p=0;p<=n;p++){const M=[],T=p/n,y=a+T*o,w=t*Math.cos(y),b=Math.sqrt(t*t-w*w);let R=0;p===0&&a===0?R=.5/e:p===n&&l===Math.PI&&(R=-.5/e);for(let v=0;v<=e;v++){const E=v/e,C=s+E*r;f.x=-b*Math.cos(C),f.y=w,f.z=b*Math.sin(C),m.push(f.x,f.y,f.z),u.copy(f).normalize(),x.push(u.x,u.y,u.z),g.push(E+R,1-T),M.push(c++)}h.push(M)}for(let p=0;p<n;p++)for(let M=0;M<e;M++){const T=h[p][M+1],y=h[p][M],w=h[p+1][M],b=h[p+1][M+1];(p!==0||a>0)&&d.push(T,y,b),(p!==n-1||l<Math.PI)&&d.push(y,w,b)}this.setIndex(d),this.setAttribute("position",new oe(m,3)),this.setAttribute("normal",new oe(x,3)),this.setAttribute("uv",new oe(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class sl extends Be{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],f=[],u=new I,d=new I,m=new I;for(let x=0;x<=n;x++){const g=a+x/n*o;for(let p=0;p<=s;p++){const M=p/s*r;d.x=(t+e*Math.cos(g))*Math.cos(M),d.y=(t+e*Math.cos(g))*Math.sin(M),d.z=e*Math.sin(g),c.push(d.x,d.y,d.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),m.subVectors(d,u).normalize(),h.push(m.x,m.y,m.z),f.push(p/s),f.push(x/n)}}for(let x=1;x<=n;x++)for(let g=1;g<=s;g++){const p=(s+1)*x+g-1,M=(s+1)*(x-1)+g-1,T=(s+1)*(x-1)+g,y=(s+1)*x+g;l.push(p,M,y),l.push(M,T,y)}this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sl(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}function ns(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(ac(s))s.isRenderTargetTexture?(Lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(ac(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=ns(i[e]);for(const s in n)t[s]=n[s]}return t}function ac(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function qd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Jh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}const Yd={clone:ns,merge:ze};var $d=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Kd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class An extends Ds{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$d,this.fragmentShader=Kd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ns(t.uniforms),this.uniformsGroups=qd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Yt().setHex(s.value);break;case"v2":this.uniforms[n].value=new ht().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new fe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Nt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ae().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Zd extends An{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Qh extends Ds{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Po,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ri,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Jd extends Ds{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Qd extends Ds{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class jh extends De{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Yt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class jd extends jh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const va=new ae,oc=new I,lc=new I;class tp{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=Je,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new jo,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;oc.setFromMatrixPosition(t.matrixWorld),e.position.copy(oc),lc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(lc),e.updateMatrixWorld(),va.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(va,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===As||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(va)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const nr=new I,ir=new ss,gn=new I;class tu extends De{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(nr,ir,gn),gn.x===1&&gn.y===1&&gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nr,ir,gn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(nr,ir,gn),gn.x===1&&gn.y===1&&gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(nr,ir,gn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new I,cc=new ht,hc=new ht;class ln extends tu{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Lo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(qr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Lo*2*Math.atan(Math.tan(qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-t/Qn.z)}getViewSize(t,e){return this.getViewBounds(t,cc,hc),e.subVectors(hc,cc)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(qr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Pr extends tu{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class ep extends tp{constructor(){super(new Pr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class uc extends jh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.target=new De,this.shadow=new ep}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const zi=-90,Gi=1;class np extends De{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(zi,Gi,t,e);s.layers=this.layers,this.add(s);const r=new ln(zi,Gi,t,e);r.layers=this.layers,this.add(r);const a=new ln(zi,Gi,t,e);a.layers=this.layers,this.add(a);const o=new ln(zi,Gi,t,e);o.layers=this.layers,this.add(o);const l=new ln(zi,Gi,t,e);l.layers=this.layers,this.add(l);const c=new ln(zi,Gi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===bn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===As)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}}class ip extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const hl=class hl{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};hl.prototype.isMatrix2=!0;let fc=hl;function dc(i,t,e,n){const s=sp(n);switch(e){case Ph:return i*t;case Ih:return i*t/s.components*s.byteLength;case qo:return i*t/s.components*s.byteLength;case bi:return i*t*2/s.components*s.byteLength;case Yo:return i*t*2/s.components*s.byteLength;case Lh:return i*t*3/s.components*s.byteLength;case un:return i*t*4/s.components*s.byteLength;case $o:return i*t*4/s.components*s.byteLength;case fr:case dr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case pr:case mr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case to:case no:return Math.max(i,16)*Math.max(t,8)/4;case ja:case eo:return Math.max(i,8)*Math.max(t,8)/2;case io:case so:case ao:case oo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ro:case yr:case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case ho:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case uo:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case fo:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case po:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case mo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case go:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case xo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case _o:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case vo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case yo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Mo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case So:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case bo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case To:case Eo:case wo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Ao:case Ro:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Mr:case Co:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function sp(i){switch(i){case Je:case wh:return{byteLength:1,components:1};case Es:case Ah:case zn:return{byteLength:2,components:1};case Wo:case Xo:return{byteLength:2,components:4};case wn:case Vo:case Sn:return{byteLength:4,components:1};case Rh:case Ch:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Go}}));typeof window<"u"&&(window.__THREE__?Lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Go);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function eu(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function rp(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){const m=f[u],x=f[d];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++u,f[u]=x)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){const x=f[d];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var ap=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,op=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,lp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,up=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fp=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,dp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_p=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,vp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,yp=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mp=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ep=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,wp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Cp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Lp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Ip=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Up=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Np=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Op=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Bp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Hp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,zp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$p=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Jp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Qp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,jp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tm=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,em=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nm=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,im=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,sm=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,rm=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,am=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,om=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lm=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,cm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hm=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,um=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fm=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gm=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_m=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ym=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Mm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Sm=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,bm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Em=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,wm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Am=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Cm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Pm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Im=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Dm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Um=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Nm=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Fm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Om=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,km=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Hm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Vm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ym=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,$m=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Km=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,jm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,t0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,e0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,n0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,i0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,s0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,r0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const a0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,o0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,l0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,c0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,h0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,u0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,f0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,d0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,p0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,m0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,g0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,x0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,v0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,y0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,M0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,b0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,T0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,E0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,w0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,A0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,R0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,C0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,L0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,I0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,U0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,N0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,F0=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,O0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,k0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,B0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ht={alphahash_fragment:ap,alphahash_pars_fragment:op,alphamap_fragment:lp,alphamap_pars_fragment:cp,alphatest_fragment:hp,alphatest_pars_fragment:up,aomap_fragment:fp,aomap_pars_fragment:dp,batching_pars_vertex:pp,batching_vertex:mp,begin_vertex:gp,beginnormal_vertex:xp,bsdfs:_p,iridescence_fragment:vp,bumpmap_pars_fragment:yp,clipping_planes_fragment:Mp,clipping_planes_pars_fragment:Sp,clipping_planes_pars_vertex:bp,clipping_planes_vertex:Tp,color_fragment:Ep,color_pars_fragment:wp,color_pars_vertex:Ap,color_vertex:Rp,common:Cp,cube_uv_reflection_fragment:Pp,defaultnormal_vertex:Lp,displacementmap_pars_vertex:Ip,displacementmap_vertex:Dp,emissivemap_fragment:Up,emissivemap_pars_fragment:Np,colorspace_fragment:Fp,colorspace_pars_fragment:Op,envmap_fragment:kp,envmap_common_pars_fragment:Bp,envmap_pars_fragment:Hp,envmap_pars_vertex:zp,envmap_physical_pars_fragment:Qp,envmap_vertex:Gp,fog_vertex:Vp,fog_pars_vertex:Wp,fog_fragment:Xp,fog_pars_fragment:qp,gradientmap_pars_fragment:Yp,lightmap_pars_fragment:$p,lights_lambert_fragment:Kp,lights_lambert_pars_fragment:Zp,lights_pars_begin:Jp,lights_toon_fragment:jp,lights_toon_pars_fragment:tm,lights_phong_fragment:em,lights_phong_pars_fragment:nm,lights_physical_fragment:im,lights_physical_pars_fragment:sm,lights_fragment_begin:rm,lights_fragment_maps:am,lights_fragment_end:om,lightprobes_pars_fragment:lm,logdepthbuf_fragment:cm,logdepthbuf_pars_fragment:hm,logdepthbuf_pars_vertex:um,logdepthbuf_vertex:fm,map_fragment:dm,map_pars_fragment:pm,map_particle_fragment:mm,map_particle_pars_fragment:gm,metalnessmap_fragment:xm,metalnessmap_pars_fragment:_m,morphinstance_vertex:vm,morphcolor_vertex:ym,morphnormal_vertex:Mm,morphtarget_pars_vertex:Sm,morphtarget_vertex:bm,normal_fragment_begin:Tm,normal_fragment_maps:Em,normal_pars_fragment:wm,normal_pars_vertex:Am,normal_vertex:Rm,normalmap_pars_fragment:Cm,clearcoat_normal_fragment_begin:Pm,clearcoat_normal_fragment_maps:Lm,clearcoat_pars_fragment:Im,iridescence_pars_fragment:Dm,opaque_fragment:Um,packing:Nm,premultiplied_alpha_fragment:Fm,project_vertex:Om,dithering_fragment:km,dithering_pars_fragment:Bm,roughnessmap_fragment:Hm,roughnessmap_pars_fragment:zm,shadowmap_pars_fragment:Gm,shadowmap_pars_vertex:Vm,shadowmap_vertex:Wm,shadowmask_pars_fragment:Xm,skinbase_vertex:qm,skinning_pars_vertex:Ym,skinning_vertex:$m,skinnormal_vertex:Km,specularmap_fragment:Zm,specularmap_pars_fragment:Jm,tonemapping_fragment:Qm,tonemapping_pars_fragment:jm,transmission_fragment:t0,transmission_pars_fragment:e0,uv_pars_fragment:n0,uv_pars_vertex:i0,uv_vertex:s0,worldpos_vertex:r0,background_vert:a0,background_frag:o0,backgroundCube_vert:l0,backgroundCube_frag:c0,cube_vert:h0,cube_frag:u0,depth_vert:f0,depth_frag:d0,distance_vert:p0,distance_frag:m0,equirect_vert:g0,equirect_frag:x0,linedashed_vert:_0,linedashed_frag:v0,meshbasic_vert:y0,meshbasic_frag:M0,meshlambert_vert:S0,meshlambert_frag:b0,meshmatcap_vert:T0,meshmatcap_frag:E0,meshnormal_vert:w0,meshnormal_frag:A0,meshphong_vert:R0,meshphong_frag:C0,meshphysical_vert:P0,meshphysical_frag:L0,meshtoon_vert:I0,meshtoon_frag:D0,points_vert:U0,points_frag:N0,shadow_vert:F0,shadow_frag:O0,sprite_vert:k0,sprite_frag:B0},ft={common:{diffuse:{value:new Yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new Yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new Yt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},yn={basic:{uniforms:ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Ht.meshbasic_vert,fragmentShader:Ht.meshbasic_frag},lambert:{uniforms:ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Yt(0)},envMapIntensity:{value:1}}]),vertexShader:Ht.meshlambert_vert,fragmentShader:Ht.meshlambert_frag},phong:{uniforms:ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Yt(0)},specular:{value:new Yt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphong_vert,fragmentShader:Ht.meshphong_frag},standard:{uniforms:ze([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new Yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag},toon:{uniforms:ze([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new Yt(0)}}]),vertexShader:Ht.meshtoon_vert,fragmentShader:Ht.meshtoon_frag},matcap:{uniforms:ze([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Ht.meshmatcap_vert,fragmentShader:Ht.meshmatcap_frag},points:{uniforms:ze([ft.points,ft.fog]),vertexShader:Ht.points_vert,fragmentShader:Ht.points_frag},dashed:{uniforms:ze([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ht.linedashed_vert,fragmentShader:Ht.linedashed_frag},depth:{uniforms:ze([ft.common,ft.displacementmap]),vertexShader:Ht.depth_vert,fragmentShader:Ht.depth_frag},normal:{uniforms:ze([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Ht.meshnormal_vert,fragmentShader:Ht.meshnormal_frag},sprite:{uniforms:ze([ft.sprite,ft.fog]),vertexShader:Ht.sprite_vert,fragmentShader:Ht.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ht.background_vert,fragmentShader:Ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Ht.backgroundCube_vert,fragmentShader:Ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ht.cube_vert,fragmentShader:Ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ht.equirect_vert,fragmentShader:Ht.equirect_frag},distance:{uniforms:ze([ft.common,ft.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ht.distance_vert,fragmentShader:Ht.distance_frag},shadow:{uniforms:ze([ft.lights,ft.fog,{color:{value:new Yt(0)},opacity:{value:1}}]),vertexShader:Ht.shadow_vert,fragmentShader:Ht.shadow_frag}};yn.physical={uniforms:ze([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new Yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new Yt(0)},specularColor:{value:new Yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Ht.meshphysical_vert,fragmentShader:Ht.meshphysical_frag};const sr={r:0,b:0,g:0},H0=new ae,nu=new Nt;nu.set(-1,0,0,0,1,0,0,0,1);function z0(i,t,e,n,s,r){const a=new Yt(0);let o=s===!0?0:1,l,c,h=null,f=0,u=null;function d(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const y=M.backgroundBlurriness>0;T=t.get(T,y)}return T}function m(M){let T=!1;const y=d(M);y===null?g(a,o):y&&y.isColor&&(g(y,1),T=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?e.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(M,T){const y=d(T);y&&(y.isCubeTexture||y.mapping===Ar)?(c===void 0&&(c=new Dt(new Vn(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:ns(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(H0.makeRotationFromEuler(T.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(nu),c.material.toneMapped=Wt.getTransfer(y.colorSpace)!==ee,(h!==y||f!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Dt(new Cr(2,2),new An({name:"BackgroundMaterial",uniforms:ns(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:si,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Wt.getTransfer(y.colorSpace)!==ee,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function g(M,T){M.getRGB(sr,Jh(i)),e.buffers.color.setClear(sr.r,sr.g,sr.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,g(a,o)},render:m,addToRenderList:x,dispose:p}}function G0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(P,D,W,$,k){let Y=!1;const B=f(P,$,W,D);r!==B&&(r=B,c(r.object)),Y=d(P,$,W,k),Y&&m(P,$,W,k),k!==null&&t.update(k,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,y(P,D,W,$),k!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(k).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function f(P,D,W,$){const k=$.wireframe===!0;let Y=n[D.id];Y===void 0&&(Y={},n[D.id]=Y);const B=P.isInstancedMesh===!0?P.id:0;let Q=Y[B];Q===void 0&&(Q={},Y[B]=Q);let tt=Q[W.id];tt===void 0&&(tt={},Q[W.id]=tt);let at=tt[k];return at===void 0&&(at=u(l()),tt[k]=at),at}function u(P){const D=[],W=[],$=[];for(let k=0;k<e;k++)D[k]=0,W[k]=0,$[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:W,attributeDivisors:$,object:P,attributes:{},index:null}}function d(P,D,W,$){const k=r.attributes,Y=D.attributes;let B=0;const Q=W.getAttributes();for(const tt in Q)if(Q[tt].location>=0){const pt=k[tt];let yt=Y[tt];if(yt===void 0&&(tt==="instanceMatrix"&&P.instanceMatrix&&(yt=P.instanceMatrix),tt==="instanceColor"&&P.instanceColor&&(yt=P.instanceColor)),pt===void 0||pt.attribute!==yt||yt&&pt.data!==yt.data)return!0;B++}return r.attributesNum!==B||r.index!==$}function m(P,D,W,$){const k={},Y=D.attributes;let B=0;const Q=W.getAttributes();for(const tt in Q)if(Q[tt].location>=0){let pt=Y[tt];pt===void 0&&(tt==="instanceMatrix"&&P.instanceMatrix&&(pt=P.instanceMatrix),tt==="instanceColor"&&P.instanceColor&&(pt=P.instanceColor));const yt={};yt.attribute=pt,pt&&pt.data&&(yt.data=pt.data),k[tt]=yt,B++}r.attributes=k,r.attributesNum=B,r.index=$}function x(){const P=r.newAttributes;for(let D=0,W=P.length;D<W;D++)P[D]=0}function g(P){p(P,0)}function p(P,D){const W=r.newAttributes,$=r.enabledAttributes,k=r.attributeDivisors;W[P]=1,$[P]===0&&(i.enableVertexAttribArray(P),$[P]=1),k[P]!==D&&(i.vertexAttribDivisor(P,D),k[P]=D)}function M(){const P=r.newAttributes,D=r.enabledAttributes;for(let W=0,$=D.length;W<$;W++)D[W]!==P[W]&&(i.disableVertexAttribArray(W),D[W]=0)}function T(P,D,W,$,k,Y,B){B===!0?i.vertexAttribIPointer(P,D,W,k,Y):i.vertexAttribPointer(P,D,W,$,k,Y)}function y(P,D,W,$){x();const k=$.attributes,Y=W.getAttributes(),B=D.defaultAttributeValues;for(const Q in Y){const tt=Y[Q];if(tt.location>=0){let at=k[Q];if(at===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(at=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(at=P.instanceColor)),at!==void 0){const pt=at.normalized,yt=at.itemSize,Xt=t.get(at);if(Xt===void 0)continue;const me=Xt.buffer,Jt=Xt.type,J=Xt.bytesPerElement,st=Jt===i.INT||Jt===i.UNSIGNED_INT||at.gpuType===Vo;if(at.isInterleavedBufferAttribute){const et=at.data,It=et.stride,Ot=at.offset;if(et.isInstancedInterleavedBuffer){for(let Ct=0;Ct<tt.locationSize;Ct++)p(tt.location+Ct,et.meshPerAttribute);P.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Ct=0;Ct<tt.locationSize;Ct++)g(tt.location+Ct);i.bindBuffer(i.ARRAY_BUFFER,me);for(let Ct=0;Ct<tt.locationSize;Ct++)T(tt.location+Ct,yt/tt.locationSize,Jt,pt,It*J,(Ot+yt/tt.locationSize*Ct)*J,st)}else{if(at.isInstancedBufferAttribute){for(let et=0;et<tt.locationSize;et++)p(tt.location+et,at.meshPerAttribute);P.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let et=0;et<tt.locationSize;et++)g(tt.location+et);i.bindBuffer(i.ARRAY_BUFFER,me);for(let et=0;et<tt.locationSize;et++)T(tt.location+et,yt/tt.locationSize,Jt,pt,yt*J,yt/tt.locationSize*et*J,st)}}else if(B!==void 0){const pt=B[Q];if(pt!==void 0)switch(pt.length){case 2:i.vertexAttrib2fv(tt.location,pt);break;case 3:i.vertexAttrib3fv(tt.location,pt);break;case 4:i.vertexAttrib4fv(tt.location,pt);break;default:i.vertexAttrib1fv(tt.location,pt)}}}}M()}function w(){E();for(const P in n){const D=n[P];for(const W in D){const $=D[W];for(const k in $){const Y=$[k];for(const B in Y)h(Y[B].object),delete Y[B];delete $[k]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const D=n[P.id];for(const W in D){const $=D[W];for(const k in $){const Y=$[k];for(const B in Y)h(Y[B].object),delete Y[B];delete $[k]}}delete n[P.id]}function R(P){for(const D in n){const W=n[D];for(const $ in W){const k=W[$];if(k[P.id]===void 0)continue;const Y=k[P.id];for(const B in Y)h(Y[B].object),delete Y[B];delete k[P.id]}}}function v(P){for(const D in n){const W=n[D],$=P.isInstancedMesh===!0?P.id:0,k=W[$];if(k!==void 0){for(const Y in k){const B=k[Y];for(const Q in B)h(B[Q].object),delete B[Q];delete k[Y]}delete W[$],Object.keys(W).length===0&&delete n[D]}}}function E(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:g,disableUnusedAttributes:M}}function V0(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function W0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==un&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const v=R===zn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Je&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Sn&&!v)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Lt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Lt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:y,maxSamples:w,samples:b}}function X0(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new pi,o=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const m=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,p=i.get(f);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{const M=r?0:n,T=M*4;let y=p.clippingState||null;l.value=y,y=h(m,u,T,d);for(let w=0;w!==T;++w)y[w]=e[w];p.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,m){const x=f!==null?f.length:0;let g=null;if(x!==0){if(g=l.value,m!==!0||g===null){const p=d+x*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(g===null||g.length<p)&&(g=new Float32Array(p));for(let T=0,y=d;T!==x;++T,y+=4)a.copy(f[T]).applyMatrix4(M,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,g}}const ei=4,pc=[.125,.215,.35,.446,.526,.582],gi=20,q0=256,ds=new Pr,mc=new Yt;let ya=null,Ma=0,Sa=0,ba=!1;const Y0=new I;class gc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=Y0}=r;ya=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=vc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_c(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(ya,Ma,Sa),this._renderer.xr.enabled=ba,t.scissorTest=!1,Vi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Si||t.mapping===ji?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ya=this._renderer.getRenderTarget(),Ma=this._renderer.getActiveCubeFace(),Sa=this._renderer.getActiveMipmapLevel(),ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Oe,minFilter:Oe,generateMipmaps:!1,type:zn,format:un,colorSpace:Sr,depthBuffer:!1},s=xc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=xc(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=$0(r)),this._blurMaterial=Z0(r,t,e),this._ggxMaterial=K0(r,t,e)}return s}_compileMaterial(t){const e=new Dt(new Be,t);this._renderer.compile(e,ds)}_sceneToCubeUV(t,e,n,s,r){const l=new ln(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(mc),f.toneMapping=Tn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new Vn,new Bh({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,g=x.material;let p=!1;const M=t.background;M?M.isColor&&(g.color.copy(M),t.background=null,p=!0):(g.color.copy(mc),p=!0);for(let T=0;T<6;T++){const y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));const w=this._cubeSize;Vi(s,y*w,T>2?w:0,w,w),f.setRenderTarget(s),p&&f.render(x,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=M}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Si||t.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=vc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_c());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Vi(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,ds)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=0+c*1.25,d=f*u,{_lodMax:m}=this,x=this._sizeLods[n],g=3*x*(n>m-ei?n-m+ei:0),p=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-e,Vi(r,g,p,3*x,2*x),s.setRenderTarget(r),s.render(o,ds),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Vi(t,g,p,3*x,2*x),s.setRenderTarget(t),s.render(o,ds)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Zt("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=c;const u=c.uniforms,d=this._sizeLods[n]-1,m=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*gi-1),x=r/m,g=isFinite(r)?1+Math.floor(h*x):gi;g>gi&&Lt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${gi}`);const p=[];let M=0;for(let R=0;R<gi;++R){const v=R/x,E=Math.exp(-v*v/2);p.push(E),R===0?M+=E:R<g&&(M+=2*E)}for(let R=0;R<p.length;R++)p[R]=p[R]/M;u.envMap.value=t.texture,u.samples.value=g,u.weights.value=p,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=m,u.mipInt.value=T-n;const y=this._sizeLods[s],w=3*y*(s>T-ei?s-T+ei:0),b=4*(this._cubeSize-y);Vi(e,w,b,3*y,2*y),l.setRenderTarget(e),l.render(f,ds)}}function $0(i){const t=[],e=[],n=[];let s=i;const r=i-ei+1+pc.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-ei?l=pc[a-i+ei-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,m=6,x=3,g=2,p=1,M=new Float32Array(x*m*d),T=new Float32Array(g*m*d),y=new Float32Array(p*m*d);for(let b=0;b<d;b++){const R=b%3*2/3-1,v=b>2?0:-1,E=[R,v,0,R+2/3,v,0,R+2/3,v+1,0,R,v,0,R+2/3,v+1,0,R,v+1,0];M.set(E,x*m*b),T.set(u,g*m*b);const C=[b,b,b,b,b,b];y.set(C,p*m*b)}const w=new Be;w.setAttribute("position",new fn(M,x)),w.setAttribute("uv",new fn(T,g)),w.setAttribute("faceIndex",new fn(y,p)),n.push(new Dt(w,null)),s>ei&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function xc(i,t,e){const n=new En(i,t,e);return n.texture.mapping=Ar,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Vi(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function K0(i,t,e){return new An({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:q0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Lr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Z0(i,t,e){const n=new Float32Array(gi),s=new I(0,1,0);return new An({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Lr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function _c(){return new An({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Lr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function vc(){return new An({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Lr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:kn,depthTest:!1,depthWrite:!1})}function Lr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class iu extends En{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Hh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Vn(5,5,5),r=new An({name:"CubemapFromEquirect",uniforms:ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:kn});r.uniforms.tEquirect.value=e;const a=new Dt(s,r),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=Oe),new np(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}function J0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===Vr||d===Wr)if(t.has(u)){const m=t.get(u).texture;return o(m,u.mapping)}else{const m=u.image;if(m&&m.height>0){const x=new iu(m.height);return x.fromEquirectangularTexture(i,u),t.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,m=d===Vr||d===Wr,x=d===Si||d===ji;if(m||x){let g=e.get(u);const p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new gc(i)),g=m?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{const M=u.image;return m&&M&&M.height>0||x&&M&&l(M)?(n===null&&(n=new gc(i)),g=m?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,d){return d===Vr?u.mapping=Si:d===Wr&&(u.mapping=ji),u}function l(u){let d=0;const m=6;for(let x=0;x<m;x++)u[x]!==void 0&&d++;return d===m}function c(u){const d=u.target;d.removeEventListener("dispose",c);const m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Q0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ki("WebGLRenderer: "+n+" extension not supported."),s}}}function j0(i,t,e,n){const s={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",a),delete s[u.id];const d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,m=f.attributes.position;let x=0;if(m===void 0)return;if(d!==null){const M=d.array;x=d.version;for(let T=0,y=M.length;T<y;T+=3){const w=M[T+0],b=M[T+1],R=M[T+2];u.push(w,b,b,R,R,w)}}else{const M=m.array;x=m.version;for(let T=0,y=M.length/3-1;T<y;T+=3){const w=T+0,b=T+1,R=T+2;u.push(w,b,b,R,R,w)}}const g=new(m.count>=65535?kh:Oh)(u,1);g.version=x;const p=r.get(f);p&&t.remove(p),r.set(f,g)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function tg(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*a),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*a,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let x=0;for(let g=0;g<d;g++)x+=u[g];e.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function eg(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Zt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function ng(i,t,e){const n=new WeakMap,s=new fe;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==f){let C=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var d=C;u!==void 0&&u.texture.dispose();const m=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let y=0;m===!0&&(y=1),x===!0&&(y=2),g===!0&&(y=3);let w=o.attributes.position.count*y,b=1;w>t.maxTextureSize&&(b=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const R=new Float32Array(w*b*4*f),v=new Uh(R,w,b,f);v.type=Sn,v.needsUpdate=!0;const E=y*4;for(let P=0;P<f;P++){const D=p[P],W=M[P],$=T[P],k=w*b*4*P;for(let Y=0;Y<D.count;Y++){const B=Y*E;m===!0&&(s.fromBufferAttribute(D,Y),R[k+B+0]=s.x,R[k+B+1]=s.y,R[k+B+2]=s.z,R[k+B+3]=0),x===!0&&(s.fromBufferAttribute(W,Y),R[k+B+4]=s.x,R[k+B+5]=s.y,R[k+B+6]=s.z,R[k+B+7]=0),g===!0&&(s.fromBufferAttribute($,Y),R[k+B+8]=s.x,R[k+B+9]=s.y,R[k+B+10]=s.z,R[k+B+11]=$.itemSize===4?s.w:1)}}u={count:f,texture:v,size:new ht(w,b)},n.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const x=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function ig(i,t,e,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const sg={[_h]:"LINEAR_TONE_MAPPING",[vh]:"REINHARD_TONE_MAPPING",[yh]:"CINEON_TONE_MAPPING",[Mh]:"ACES_FILMIC_TONE_MAPPING",[bh]:"AGX_TONE_MAPPING",[Th]:"NEUTRAL_TONE_MAPPING",[Sh]:"CUSTOM_TONE_MAPPING"};function rg(i,t,e,n,s,r){const a=new En(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new ts(t,e):void 0}),o=new En(t,e,{type:zn,depthBuffer:!1,stencilBuffer:!1}),l=new Be;l.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new oe([0,2,0,0,2,0],2));const c=new Zd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new Dt(l,c),f=new Pr(-1,1,1,-1,0,1);let u=null,d=null,m=!1,x,g=null,p=[],M=!1;this.setSize=function(T,y){a.setSize(T,y),o.setSize(T,y);for(let w=0;w<p.length;w++){const b=p[w];b.setSize&&b.setSize(T,y)}},this.setEffects=function(T){p=T,M=p.length>0&&p[0].isRenderPass===!0;const y=a.width,w=a.height;for(let b=0;b<p.length;b++){const R=p[b];R.setSize&&R.setSize(y,w)}},this.begin=function(T,y){if(m||T.toneMapping===Tn&&p.length===0)return!1;if(g=y,y!==null){const w=y.width,b=y.height;(a.width!==w||a.height!==b)&&this.setSize(w,b)}return M===!1&&T.setRenderTarget(a),x=T.toneMapping,T.toneMapping=Tn,!0},this.hasRenderPass=function(){return M},this.end=function(T,y){T.toneMapping=x,m=!0;let w=a,b=o;for(let R=0;R<p.length;R++){const v=p[R];if(v.enabled!==!1&&(v.render(T,b,w,y),v.needsSwap!==!1)){const E=w;w=b,b=E}}if(u!==T.outputColorSpace||d!==T.toneMapping){u=T.outputColorSpace,d=T.toneMapping,c.defines={},Wt.getTransfer(u)===ee&&(c.defines.SRGB_TRANSFER="");const R=sg[d];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,T.setRenderTarget(g),T.render(h,f),g=null,m=!1},this.isCompositing=function(){return m},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const su=new Ge,Uo=new ts(1,1),ru=new Uh,au=new $f,ou=new Hh,yc=[],Mc=[],Sc=new Float32Array(16),bc=new Float32Array(9),Tc=new Float32Array(4);function rs(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=yc[s];if(r===void 0&&(r=new Float32Array(s),yc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ir(i,t){let e=Mc[t];e===void 0&&(e=new Int32Array(t),Mc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ag(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function og(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function lg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function cg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function hg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Tc.set(n),i.uniformMatrix2fv(this.addr,!1,Tc),Re(e,n)}}function ug(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;bc.set(n),i.uniformMatrix3fv(this.addr,!1,bc),Re(e,n)}}function fg(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;Sc.set(n),i.uniformMatrix4fv(this.addr,!1,Sc),Re(e,n)}}function dg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function pg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function mg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function gg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function xg(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function _g(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function vg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function yg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function Mg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Uo.compareFunction=e.isReversedDepthBuffer()?Zo:Ko,r=Uo):r=su,e.setTexture2D(t||r,s)}function Sg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||au,s)}function bg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||ou,s)}function Tg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ru,s)}function Eg(i){switch(i){case 5126:return ag;case 35664:return og;case 35665:return lg;case 35666:return cg;case 35674:return hg;case 35675:return ug;case 35676:return fg;case 5124:case 35670:return dg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return gg;case 5125:return xg;case 36294:return _g;case 36295:return vg;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return Mg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return bg;case 36289:case 36303:case 36311:case 36292:return Tg}}function wg(i,t){i.uniform1fv(this.addr,t)}function Ag(i,t){const e=rs(t,this.size,2);i.uniform2fv(this.addr,e)}function Rg(i,t){const e=rs(t,this.size,3);i.uniform3fv(this.addr,e)}function Cg(i,t){const e=rs(t,this.size,4);i.uniform4fv(this.addr,e)}function Pg(i,t){const e=rs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Lg(i,t){const e=rs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Ig(i,t){const e=rs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Dg(i,t){i.uniform1iv(this.addr,t)}function Ug(i,t){i.uniform2iv(this.addr,t)}function Ng(i,t){i.uniform3iv(this.addr,t)}function Fg(i,t){i.uniform4iv(this.addr,t)}function Og(i,t){i.uniform1uiv(this.addr,t)}function kg(i,t){i.uniform2uiv(this.addr,t)}function Bg(i,t){i.uniform3uiv(this.addr,t)}function Hg(i,t){i.uniform4uiv(this.addr,t)}function zg(i,t,e){const n=this.cache,s=t.length,r=Ir(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Uo:a=su;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function Gg(i,t,e){const n=this.cache,s=t.length,r=Ir(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||au,r[a])}function Vg(i,t,e){const n=this.cache,s=t.length,r=Ir(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||ou,r[a])}function Wg(i,t,e){const n=this.cache,s=t.length,r=Ir(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||ru,r[a])}function Xg(i){switch(i){case 5126:return wg;case 35664:return Ag;case 35665:return Rg;case 35666:return Cg;case 35674:return Pg;case 35675:return Lg;case 35676:return Ig;case 5124:case 35670:return Dg;case 35667:case 35671:return Ug;case 35668:case 35672:return Ng;case 35669:case 35673:return Fg;case 5125:return Og;case 36294:return kg;case 36295:return Bg;case 36296:return Hg;case 35678:case 36198:case 36298:case 36306:case 35682:return zg;case 35679:case 36299:case 36307:return Gg;case 35680:case 36300:case 36308:case 36293:return Vg;case 36289:case 36303:case 36311:case 36292:return Wg}}class qg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Eg(e.type)}}class Yg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xg(e.type)}}class $g{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Ta=/(\w+)(\])?(\[|\.)?/g;function Ec(i,t){i.seq.push(t),i.map[t.id]=t}function Kg(i,t,e){const n=i.name,s=n.length;for(Ta.lastIndex=0;;){const r=Ta.exec(n),a=Ta.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ec(e,c===void 0?new qg(o,i,t):new Yg(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new $g(o),Ec(e,f)),e=f}}}class gr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Kg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function wc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Zg=37297;let Jg=0;function Qg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Ac=new Nt;function jg(i){Wt._getMatrix(Ac,Wt.workingColorSpace,i);const t=`mat3( ${Ac.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(i)){case br:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return Lt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Rc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Qg(i.getShaderSource(t),o)}else return r}function tx(i,t){const e=jg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const ex={[_h]:"Linear",[vh]:"Reinhard",[yh]:"Cineon",[Mh]:"ACESFilmic",[bh]:"AgX",[Th]:"Neutral",[Sh]:"Custom"};function nx(i,t){const e=ex[t];return e===void 0?(Lt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const rr=new I;function ix(){Wt.getLuminanceCoefficients(rr);const i=rr.x.toFixed(4),t=rr.y.toFixed(4),e=rr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sx(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_s).join(`
`)}function rx(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ax(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function _s(i){return i!==""}function Cc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Pc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const ox=/^[ \t]*#include +<([\w\d./]+)>/gm;function No(i){return i.replace(ox,cx)}const lx=new Map;function cx(i,t){let e=Ht[t];if(e===void 0){const n=lx.get(t);if(n!==void 0)e=Ht[n],Lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return No(e)}const hx=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Lc(i){return i.replace(hx,ux)}function ux(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ic(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const fx={[ur]:"SHADOWMAP_TYPE_PCF",[gs]:"SHADOWMAP_TYPE_VSM"};function dx(i){return fx[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const px={[Si]:"ENVMAP_TYPE_CUBE",[ji]:"ENVMAP_TYPE_CUBE",[Ar]:"ENVMAP_TYPE_CUBE_UV"};function mx(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":px[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const gx={[ji]:"ENVMAP_MODE_REFRACTION"};function xx(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":gx[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const _x={[xh]:"ENVMAP_BLENDING_MULTIPLY",[Af]:"ENVMAP_BLENDING_MIX",[Rf]:"ENVMAP_BLENDING_ADD"};function vx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":_x[i.combine]||"ENVMAP_BLENDING_NONE"}function yx(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Mx(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=dx(e),c=mx(e),h=xx(e),f=vx(e),u=yx(e),d=sx(e),m=rx(r),x=s.createProgram();let g,p,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(_s).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(_s).join(`
`),p.length>0&&(p+=`
`)):(g=[Ic(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_s).join(`
`),p=[Ic(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Tn?"#define TONE_MAPPING":"",e.toneMapping!==Tn?Ht.tonemapping_pars_fragment:"",e.toneMapping!==Tn?nx("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Ht.colorspace_pars_fragment,tx("linearToOutputTexel",e.outputColorSpace),ix(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_s).join(`
`)),a=No(a),a=Cc(a,e),a=Pc(a,e),o=No(o),o=Cc(o,e),o=Pc(o,e),a=Lc(a),o=Lc(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===Nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const T=M+g+a,y=M+p+o,w=wc(s,s.VERTEX_SHADER,T),b=wc(s,s.FRAGMENT_SHADER,y);s.attachShader(x,w),s.attachShader(x,b),e.index0AttributeName!==void 0?s.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function R(P){if(i.debug.checkShaderErrors){const D=s.getProgramInfoLog(x)||"",W=s.getShaderInfoLog(w)||"",$=s.getShaderInfoLog(b)||"",k=D.trim(),Y=W.trim(),B=$.trim();let Q=!0,tt=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,w,b);else{const at=Rc(s,w,"vertex"),pt=Rc(s,b,"fragment");Zt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+k+`
`+at+`
`+pt)}else k!==""?Lt("WebGLProgram: Program Info Log:",k):(Y===""||B==="")&&(tt=!1);tt&&(P.diagnostics={runnable:Q,programLog:k,vertexShader:{log:Y,prefix:g},fragmentShader:{log:B,prefix:p}})}s.deleteShader(w),s.deleteShader(b),v=new gr(s,x),E=ax(s,x)}let v;this.getUniforms=function(){return v===void 0&&R(this),v};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(x,Zg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jg++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=b,this}let Sx=0;class bx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Tx(t),e.set(t,n)),n}}class Tx{constructor(t){this.id=Sx++,this.code=t,this.usedTimes=0}}function Ex(i){return i===bi||i===yr||i===Mr}function wx(i,t,e,n,s,r){const a=new Nh,o=new bx,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer;let u=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,E,C,P,D,W){const $=P.fog,k=D.geometry,Y=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,B=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Q=t.get(v.envMap||Y,B),tt=Q&&Q.mapping===Ar?Q.image.height:null,at=d[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Lt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const pt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,yt=pt!==void 0?pt.length:0;let Xt=0;k.morphAttributes.position!==void 0&&(Xt=1),k.morphAttributes.normal!==void 0&&(Xt=2),k.morphAttributes.color!==void 0&&(Xt=3);let me,Jt,J,st;if(at){const St=yn[at];me=St.vertexShader,Jt=St.fragmentShader}else{me=v.vertexShader,Jt=v.fragmentShader;const St=o.getVertexShaderStage(v),xe=o.getFragmentShaderStage(v);o.update(v,St,xe),J=St.id,st=xe.id}const et=i.getRenderTarget(),It=i.state.buffers.depth.getReversed(),Ot=D.isInstancedMesh===!0,Ct=D.isBatchedMesh===!0,ve=!!v.map,Vt=!!v.matcap,ie=!!Q,Qt=!!v.aoMap,$t=!!v.lightMap,Se=!!v.bumpMap&&v.wireframe===!1,we=!!v.normalMap,Ce=!!v.displacementMap,Le=!!v.emissiveMap,ge=!!v.metalnessMap,be=!!v.roughnessMap,U=v.anisotropy>0,Ve=v.clearcoat>0,te=v.dispersion>0,A=v.iridescence>0,_=v.sheen>0,O=v.transmission>0,G=U&&!!v.anisotropyMap,X=Ve&&!!v.clearcoatMap,nt=Ve&&!!v.clearcoatNormalMap,rt=Ve&&!!v.clearcoatRoughnessMap,q=A&&!!v.iridescenceMap,Z=A&&!!v.iridescenceThicknessMap,ot=_&&!!v.sheenColorMap,Et=_&&!!v.sheenRoughnessMap,ut=!!v.specularMap,lt=!!v.specularColorMap,Rt=!!v.specularIntensityMap,Pt=O&&!!v.transmissionMap,kt=O&&!!v.thicknessMap,L=!!v.gradientMap,it=!!v.alphaMap,K=v.alphaTest>0,ct=!!v.alphaHash,gt=!!v.extensions;let j=Tn;v.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(j=i.toneMapping);const Tt={shaderID:at,shaderType:v.type,shaderName:v.name,vertexShader:me,fragmentShader:Jt,defines:v.defines,customVertexShaderID:J,customFragmentShaderID:st,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&D._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&D.instanceColor!==null,instancingMorph:Ot&&D.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Wt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ve,matcap:Vt,envMap:ie,envMapMode:ie&&Q.mapping,envMapCubeUVHeight:tt,aoMap:Qt,lightMap:$t,bumpMap:Se,normalMap:we,displacementMap:Ce,emissiveMap:Le,normalMapObjectSpace:we&&v.normalMapType===Lf,normalMapTangentSpace:we&&v.normalMapType===Po,packedNormalMap:we&&v.normalMapType===Po&&Ex(v.normalMap.format),metalnessMap:ge,roughnessMap:be,anisotropy:U,anisotropyMap:G,clearcoat:Ve,clearcoatMap:X,clearcoatNormalMap:nt,clearcoatRoughnessMap:rt,dispersion:te,iridescence:A,iridescenceMap:q,iridescenceThicknessMap:Z,sheen:_,sheenColorMap:ot,sheenRoughnessMap:Et,specularMap:ut,specularColorMap:lt,specularIntensityMap:Rt,transmission:O,transmissionMap:Pt,thicknessMap:kt,gradientMap:L,opaque:v.transparent===!1&&v.blending===$i&&v.alphaToCoverage===!1,alphaMap:it,alphaTest:K,alphaHash:ct,combine:v.combine,mapUv:ve&&m(v.map.channel),aoMapUv:Qt&&m(v.aoMap.channel),lightMapUv:$t&&m(v.lightMap.channel),bumpMapUv:Se&&m(v.bumpMap.channel),normalMapUv:we&&m(v.normalMap.channel),displacementMapUv:Ce&&m(v.displacementMap.channel),emissiveMapUv:Le&&m(v.emissiveMap.channel),metalnessMapUv:ge&&m(v.metalnessMap.channel),roughnessMapUv:be&&m(v.roughnessMap.channel),anisotropyMapUv:G&&m(v.anisotropyMap.channel),clearcoatMapUv:X&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:nt&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:q&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:ot&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:Et&&m(v.sheenRoughnessMap.channel),specularMapUv:ut&&m(v.specularMap.channel),specularColorMapUv:lt&&m(v.specularColorMap.channel),specularIntensityMapUv:Rt&&m(v.specularIntensityMap.channel),transmissionMapUv:Pt&&m(v.transmissionMap.channel),thicknessMapUv:kt&&m(v.thicknessMap.channel),alphaMapUv:it&&m(v.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(we||U),vertexNormals:!!k.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!k.attributes.uv&&(ve||it),fog:!!$,useFog:v.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||k.attributes.normal===void 0&&we===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:It,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:k.attributes.position!==void 0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Xt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:ve&&v.map.isVideoTexture===!0&&Wt.getTransfer(v.map.colorSpace)===ee,decodeVideoTextureEmissive:Le&&v.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(v.emissiveMap.colorSpace)===ee,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Nn,flipSided:v.side===qe,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:gt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gt&&v.extensions.multiDraw===!0||Ct)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function g(v){const E=[];if(v.shaderID?E.push(v.shaderID):(E.push(v.customVertexShaderID),E.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)E.push(C),E.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(p(E,v),M(E,v),E.push(i.outputColorSpace)),E.push(v.customProgramCacheKey),E.join()}function p(v,E){v.push(E.precision),v.push(E.outputColorSpace),v.push(E.envMapMode),v.push(E.envMapCubeUVHeight),v.push(E.mapUv),v.push(E.alphaMapUv),v.push(E.lightMapUv),v.push(E.aoMapUv),v.push(E.bumpMapUv),v.push(E.normalMapUv),v.push(E.displacementMapUv),v.push(E.emissiveMapUv),v.push(E.metalnessMapUv),v.push(E.roughnessMapUv),v.push(E.anisotropyMapUv),v.push(E.clearcoatMapUv),v.push(E.clearcoatNormalMapUv),v.push(E.clearcoatRoughnessMapUv),v.push(E.iridescenceMapUv),v.push(E.iridescenceThicknessMapUv),v.push(E.sheenColorMapUv),v.push(E.sheenRoughnessMapUv),v.push(E.specularMapUv),v.push(E.specularColorMapUv),v.push(E.specularIntensityMapUv),v.push(E.transmissionMapUv),v.push(E.thicknessMapUv),v.push(E.combine),v.push(E.fogExp2),v.push(E.sizeAttenuation),v.push(E.morphTargetsCount),v.push(E.morphAttributeCount),v.push(E.numDirLights),v.push(E.numPointLights),v.push(E.numSpotLights),v.push(E.numSpotLightMaps),v.push(E.numHemiLights),v.push(E.numRectAreaLights),v.push(E.numDirLightShadows),v.push(E.numPointLightShadows),v.push(E.numSpotLightShadows),v.push(E.numSpotLightShadowsWithMaps),v.push(E.numLightProbes),v.push(E.shadowMapType),v.push(E.toneMapping),v.push(E.numClippingPlanes),v.push(E.numClipIntersection),v.push(E.depthPacking)}function M(v,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function T(v){const E=d[v.type];let C;if(E){const P=yn[E];C=Yd.clone(P.uniforms)}else C=v.uniforms;return C}function y(v,E){let C=h.get(E);return C!==void 0?++C.usedTimes:(C=new Mx(i,E,v,s),c.push(C),h.set(E,C)),C}function w(v){if(--v.usedTimes===0){const E=c.indexOf(v);c[E]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function b(v){o.remove(v)}function R(){o.dispose()}return{getParameters:x,getProgramCacheKey:g,getUniforms:T,acquireProgram:y,releaseProgram:w,releaseShaderCache:b,programs:c,dispose:R}}function Ax(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function Rx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Dc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Uc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,m,x,g,p){let M=i[t];return M===void 0?(M={id:u.id,object:u,geometry:d,material:m,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:g,group:p},i[t]=M):(M.id=u.id,M.object=u,M.geometry=d,M.material=m,M.materialVariant=a(u),M.groupOrder=x,M.renderOrder=u.renderOrder,M.z=g,M.group=p),t++,M}function l(u,d,m,x,g,p){const M=o(u,d,m,x,g,p);m.transmission>0?n.push(M):m.transparent===!0?s.push(M):e.push(M)}function c(u,d,m,x,g,p){const M=o(u,d,m,x,g,p);m.transmission>0?n.unshift(M):m.transparent===!0?s.unshift(M):e.unshift(M)}function h(u,d,m){e.length>1&&e.sort(u||Rx),n.length>1&&n.sort(d||Dc),s.length>1&&s.sort(d||Dc),m&&(e.reverse(),n.reverse(),s.reverse())}function f(){for(let u=t,d=i.length;u<d;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function Cx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new Uc,i.set(n,[a])):s>=r.length?(a=new Uc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Px(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new Yt};break;case"SpotLight":e={position:new I,direction:new I,color:new Yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Yt,groundColor:new Yt};break;case"RectAreaLight":e={color:new Yt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function Lx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Ix=0;function Dx(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Ux(i){const t=new Px,e=Lx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new ae,a=new ae;function o(c){let h=0,f=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let d=0,m=0,x=0,g=0,p=0,M=0,T=0,y=0,w=0,b=0,R=0;c.sort(Dx);for(let E=0,C=c.length;E<C;E++){const P=c[E],D=P.color,W=P.intensity,$=P.distance;let k=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===bi?k=P.shadow.map.texture:k=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=D.r*W,f+=D.g*W,u+=D.b*W;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(P.sh.coefficients[Y],W);R++}else if(P.isDirectionalLight){const Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const B=P.shadow,Q=e.get(P);Q.shadowIntensity=B.intensity,Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,n.directionalShadow[d]=Q,n.directionalShadowMap[d]=k,n.directionalShadowMatrix[d]=P.shadow.matrix,M++}n.directional[d]=Y,d++}else if(P.isSpotLight){const Y=t.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(D).multiplyScalar(W),Y.distance=$,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,n.spot[x]=Y;const B=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,B.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[x]=B.matrix,P.castShadow){const Q=e.get(P);Q.shadowIntensity=B.intensity,Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,n.spotShadow[x]=Q,n.spotShadowMap[x]=k,y++}x++}else if(P.isRectAreaLight){const Y=t.get(P);Y.color.copy(D).multiplyScalar(W),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),n.rectArea[g]=Y,g++}else if(P.isPointLight){const Y=t.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){const B=P.shadow,Q=e.get(P);Q.shadowIntensity=B.intensity,Q.shadowBias=B.bias,Q.shadowNormalBias=B.normalBias,Q.shadowRadius=B.radius,Q.shadowMapSize=B.mapSize,Q.shadowCameraNear=B.camera.near,Q.shadowCameraFar=B.camera.far,n.pointShadow[m]=Q,n.pointShadowMap[m]=k,n.pointShadowMatrix[m]=P.shadow.matrix,T++}n.point[m]=Y,m++}else if(P.isHemisphereLight){const Y=t.get(P);Y.skyColor.copy(P.color).multiplyScalar(W),Y.groundColor.copy(P.groundColor).multiplyScalar(W),n.hemi[p]=Y,p++}}g>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const v=n.hash;(v.directionalLength!==d||v.pointLength!==m||v.spotLength!==x||v.rectAreaLength!==g||v.hemiLength!==p||v.numDirectionalShadows!==M||v.numPointShadows!==T||v.numSpotShadows!==y||v.numSpotMaps!==w||v.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=g,n.point.length=m,n.hemi.length=p,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+w-b,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,v.directionalLength=d,v.pointLength=m,v.spotLength=x,v.rectAreaLength=g,v.hemiLength=p,v.numDirectionalShadows=M,v.numPointShadows=T,v.numSpotShadows=y,v.numSpotMaps=w,v.numLightProbes=R,n.version=Ix++)}function l(c,h){let f=0,u=0,d=0,m=0,x=0;const g=h.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const T=c[p];if(T.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),f++}else if(T.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(g),y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(g),d++}else if(T.isRectAreaLight){const y=n.rectArea[m];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(g),a.identity(),r.copy(T.matrixWorld),r.premultiply(g),a.extractRotation(r),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),m++}else if(T.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(g),u++}else if(T.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(g),x++}}}return{setup:o,setupView:l,state:n}}function Nc(i){const t=new Ux(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Nx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Nc(i),t.set(s,[o])):r>=a.length?(o=new Nc(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const Fx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ox=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,kx=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Bx=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Fc=new ae,ps=new I,Ea=new I;function Hx(i,t,e){let n=new jo;const s=new ht,r=new ht,a=new fe,o=new Jd,l=new Qd,c={},h=e.maxTextureSize,f={[si]:qe,[qe]:si,[Nn]:Nn},u=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:Fx,fragmentShader:Ox}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const m=new Be;m.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Dt(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ur;let p=this.type;this.render=function(b,R,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;this.type===lf&&(Lt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=ur);const E=i.getRenderTarget(),C=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),D=i.state;D.setBlending(kn),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const W=p!==this.type;W&&R.traverse(function($){$.material&&(Array.isArray($.material)?$.material.forEach(k=>k.needsUpdate=!0):$.material.needsUpdate=!0)});for(let $=0,k=b.length;$<k;$++){const Y=b[$],B=Y.shadow;if(B===void 0){Lt("WebGLShadowMap:",Y,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;s.copy(B.mapSize);const Q=B.getFrameExtents();s.multiply(Q),r.copy(B.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,B.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,B.mapSize.y=r.y));const tt=i.state.buffers.depth.getReversed();if(B.camera._reversedDepth=tt,B.map===null||W===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===gs){if(Y.isPointLight){Lt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new En(s.x,s.y,{format:bi,type:zn,minFilter:Oe,magFilter:Oe,generateMipmaps:!1}),B.map.texture.name=Y.name+".shadowMap",B.map.depthTexture=new ts(s.x,s.y,Sn),B.map.depthTexture.name=Y.name+".shadowMapDepth",B.map.depthTexture.format=Gn,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Ie,B.map.depthTexture.magFilter=Ie}else Y.isPointLight?(B.map=new iu(s.x),B.map.depthTexture=new dd(s.x,wn)):(B.map=new En(s.x,s.y),B.map.depthTexture=new ts(s.x,s.y,wn)),B.map.depthTexture.name=Y.name+".shadowMap",B.map.depthTexture.format=Gn,this.type===ur?(B.map.depthTexture.compareFunction=tt?Zo:Ko,B.map.depthTexture.minFilter=Oe,B.map.depthTexture.magFilter=Oe):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Ie,B.map.depthTexture.magFilter=Ie);B.camera.updateProjectionMatrix()}const at=B.map.isWebGLCubeRenderTarget?6:1;for(let pt=0;pt<at;pt++){if(B.map.isWebGLCubeRenderTarget)i.setRenderTarget(B.map,pt),i.clear();else{pt===0&&(i.setRenderTarget(B.map),i.clear());const yt=B.getViewport(pt);a.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),D.viewport(a)}if(Y.isPointLight){const yt=B.camera,Xt=B.matrix,me=Y.distance||yt.far;me!==yt.far&&(yt.far=me,yt.updateProjectionMatrix()),ps.setFromMatrixPosition(Y.matrixWorld),yt.position.copy(ps),Ea.copy(yt.position),Ea.add(kx[pt]),yt.up.copy(Bx[pt]),yt.lookAt(Ea),yt.updateMatrixWorld(),Xt.makeTranslation(-ps.x,-ps.y,-ps.z),Fc.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),B._frustum.setFromProjectionMatrix(Fc,yt.coordinateSystem,yt.reversedDepth)}else B.updateMatrices(Y);n=B.getFrustum(),y(R,v,B.camera,Y,this.type)}B.isPointLightShadow!==!0&&this.type===gs&&M(B,v),B.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(E,C,P)};function M(b,R){const v=t.update(x);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new En(s.x,s.y,{format:bi,type:zn})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,v,u,x,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,v,d,x,null)}function T(b,R,v,E){let C=null;const P=v.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)C=P;else if(C=v.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const D=C.uuid,W=R.uuid;let $=c[D];$===void 0&&($={},c[D]=$);let k=$[W];k===void 0&&(k=C.clone(),$[W]=k,R.addEventListener("dispose",w)),C=k}if(C.visible=R.visible,C.wireframe=R.wireframe,E===gs?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:f[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,v.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const D=i.properties.get(C);D.light=v}return C}function y(b,R,v,E,C){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===gs)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,b.matrixWorld);const W=t.update(b),$=b.material;if(Array.isArray($)){const k=W.groups;for(let Y=0,B=k.length;Y<B;Y++){const Q=k[Y],tt=$[Q.materialIndex];if(tt&&tt.visible){const at=T(b,tt,E,C);b.onBeforeShadow(i,b,R,v,W,at,Q),i.renderBufferDirect(v,null,W,at,b,Q),b.onAfterShadow(i,b,R,v,W,at,Q)}}}else if($.visible){const k=T(b,$,E,C);b.onBeforeShadow(i,b,R,v,W,k,null),i.renderBufferDirect(v,null,W,k,b,null),b.onAfterShadow(i,b,R,v,W,k,null)}}const D=b.children;for(let W=0,$=D.length;W<$;W++)y(D[W],R,v,E,C)}function w(b){b.target.removeEventListener("dispose",w);for(const v in c){const E=c[v],C=b.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function zx(i,t){function e(){let L=!1;const it=new fe;let K=null;const ct=new fe(0,0,0,0);return{setMask:function(gt){K!==gt&&!L&&(i.colorMask(gt,gt,gt,gt),K=gt)},setLocked:function(gt){L=gt},setClear:function(gt,j,Tt,St,xe){xe===!0&&(gt*=St,j*=St,Tt*=St),it.set(gt,j,Tt,St),ct.equals(it)===!1&&(i.clearColor(gt,j,Tt,St),ct.copy(it))},reset:function(){L=!1,K=null,ct.set(-1,0,0,0)}}}function n(){let L=!1,it=!1,K=null,ct=null,gt=null;return{setReversed:function(j){if(it!==j){const Tt=t.get("EXT_clip_control");j?Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.ZERO_TO_ONE_EXT):Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.NEGATIVE_ONE_TO_ONE_EXT),it=j;const St=gt;gt=null,this.setClear(St)}},getReversed:function(){return it},setTest:function(j){j?et(i.DEPTH_TEST):It(i.DEPTH_TEST)},setMask:function(j){K!==j&&!L&&(i.depthMask(j),K=j)},setFunc:function(j){if(it&&(j=zf[j]),ct!==j){switch(j){case Wa:i.depthFunc(i.NEVER);break;case Xa:i.depthFunc(i.ALWAYS);break;case qa:i.depthFunc(i.LESS);break;case Qi:i.depthFunc(i.LEQUAL);break;case Ya:i.depthFunc(i.EQUAL);break;case $a:i.depthFunc(i.GEQUAL);break;case Ka:i.depthFunc(i.GREATER);break;case Za:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ct=j}},setLocked:function(j){L=j},setClear:function(j){gt!==j&&(gt=j,it&&(j=1-j),i.clearDepth(j))},reset:function(){L=!1,K=null,ct=null,gt=null,it=!1}}}function s(){let L=!1,it=null,K=null,ct=null,gt=null,j=null,Tt=null,St=null,xe=null;return{setTest:function(le){L||(le?et(i.STENCIL_TEST):It(i.STENCIL_TEST))},setMask:function(le){it!==le&&!L&&(i.stencilMask(le),it=le)},setFunc:function(le,dn,pn){(K!==le||ct!==dn||gt!==pn)&&(i.stencilFunc(le,dn,pn),K=le,ct=dn,gt=pn)},setOp:function(le,dn,pn){(j!==le||Tt!==dn||St!==pn)&&(i.stencilOp(le,dn,pn),j=le,Tt=dn,St=pn)},setLocked:function(le){L=le},setClear:function(le){xe!==le&&(i.clearStencil(le),xe=le)},reset:function(){L=!1,it=null,K=null,ct=null,gt=null,j=null,Tt=null,St=null,xe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,m=[],x=null,g=!1,p=null,M=null,T=null,y=null,w=null,b=null,R=null,v=new Yt(0,0,0),E=0,C=!1,P=null,D=null,W=null,$=null,k=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,Q=0;const tt=i.getParameter(i.VERSION);tt.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(tt)[1]),B=Q>=1):tt.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),B=Q>=2);let at=null,pt={};const yt=i.getParameter(i.SCISSOR_BOX),Xt=i.getParameter(i.VIEWPORT),me=new fe().fromArray(yt),Jt=new fe().fromArray(Xt);function J(L,it,K,ct){const gt=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Tt=0;Tt<K;Tt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(it,0,i.RGBA,1,1,ct,0,i.RGBA,i.UNSIGNED_BYTE,gt):i.texImage2D(it+Tt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,gt);return j}const st={};st[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(Qi),Se(!1),we(Cl),et(i.CULL_FACE),Qt(kn);function et(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function It(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Ot(L,it){return u[L]!==it?(i.bindFramebuffer(L,it),u[L]=it,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=it),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=it),!0):!1}function Ct(L,it){let K=m,ct=!1;if(L){K=d.get(it),K===void 0&&(K=[],d.set(it,K));const gt=L.textures;if(K.length!==gt.length||K[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Tt=gt.length;j<Tt;j++)K[j]=i.COLOR_ATTACHMENT0+j;K.length=gt.length,ct=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,ct=!0);ct&&i.drawBuffers(K)}function ve(L){return x!==L?(i.useProgram(L),x=L,!0):!1}const Vt={[mi]:i.FUNC_ADD,[hf]:i.FUNC_SUBTRACT,[uf]:i.FUNC_REVERSE_SUBTRACT};Vt[ff]=i.MIN,Vt[df]=i.MAX;const ie={[pf]:i.ZERO,[mf]:i.ONE,[gf]:i.SRC_COLOR,[Ga]:i.SRC_ALPHA,[Sf]:i.SRC_ALPHA_SATURATE,[yf]:i.DST_COLOR,[_f]:i.DST_ALPHA,[xf]:i.ONE_MINUS_SRC_COLOR,[Va]:i.ONE_MINUS_SRC_ALPHA,[Mf]:i.ONE_MINUS_DST_COLOR,[vf]:i.ONE_MINUS_DST_ALPHA,[bf]:i.CONSTANT_COLOR,[Tf]:i.ONE_MINUS_CONSTANT_COLOR,[Ef]:i.CONSTANT_ALPHA,[wf]:i.ONE_MINUS_CONSTANT_ALPHA};function Qt(L,it,K,ct,gt,j,Tt,St,xe,le){if(L===kn){g===!0&&(It(i.BLEND),g=!1);return}if(g===!1&&(et(i.BLEND),g=!0),L!==cf){if(L!==p||le!==C){if((M!==mi||w!==mi)&&(i.blendEquation(i.FUNC_ADD),M=mi,w=mi),le)switch(L){case $i:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pl:i.blendFunc(i.ONE,i.ONE);break;case Ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Il:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Zt("WebGLState: Invalid blending: ",L);break}else switch(L){case $i:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Pl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Ll:Zt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Il:Zt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Zt("WebGLState: Invalid blending: ",L);break}T=null,y=null,b=null,R=null,v.set(0,0,0),E=0,p=L,C=le}return}gt=gt||it,j=j||K,Tt=Tt||ct,(it!==M||gt!==w)&&(i.blendEquationSeparate(Vt[it],Vt[gt]),M=it,w=gt),(K!==T||ct!==y||j!==b||Tt!==R)&&(i.blendFuncSeparate(ie[K],ie[ct],ie[j],ie[Tt]),T=K,y=ct,b=j,R=Tt),(St.equals(v)===!1||xe!==E)&&(i.blendColor(St.r,St.g,St.b,xe),v.copy(St),E=xe),p=L,C=!1}function $t(L,it){L.side===Nn?It(i.CULL_FACE):et(i.CULL_FACE);let K=L.side===qe;it&&(K=!K),Se(K),L.blending===$i&&L.transparent===!1?Qt(kn):Qt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const ct=L.stencilWrite;o.setTest(ct),ct&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Le(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):It(i.SAMPLE_ALPHA_TO_COVERAGE)}function Se(L){P!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),P=L)}function we(L){L!==af?(et(i.CULL_FACE),L!==D&&(L===Cl?i.cullFace(i.BACK):L===of?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):It(i.CULL_FACE),D=L}function Ce(L){L!==W&&(B&&i.lineWidth(L),W=L)}function Le(L,it,K){L?(et(i.POLYGON_OFFSET_FILL),($!==it||k!==K)&&($=it,k=K,a.getReversed()&&(it=-it),i.polygonOffset(it,K))):It(i.POLYGON_OFFSET_FILL)}function ge(L){L?et(i.SCISSOR_TEST):It(i.SCISSOR_TEST)}function be(L){L===void 0&&(L=i.TEXTURE0+Y-1),at!==L&&(i.activeTexture(L),at=L)}function U(L,it,K){K===void 0&&(at===null?K=i.TEXTURE0+Y-1:K=at);let ct=pt[K];ct===void 0&&(ct={type:void 0,texture:void 0},pt[K]=ct),(ct.type!==L||ct.texture!==it)&&(at!==K&&(i.activeTexture(K),at=K),i.bindTexture(L,it||st[L]),ct.type=L,ct.texture=it)}function Ve(){const L=pt[at];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function te(){try{i.compressedTexImage2D(...arguments)}catch(L){Zt("WebGLState:",L)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(L){Zt("WebGLState:",L)}}function _(){try{i.texSubImage2D(...arguments)}catch(L){Zt("WebGLState:",L)}}function O(){try{i.texSubImage3D(...arguments)}catch(L){Zt("WebGLState:",L)}}function G(){try{i.compressedTexSubImage2D(...arguments)}catch(L){Zt("WebGLState:",L)}}function X(){try{i.compressedTexSubImage3D(...arguments)}catch(L){Zt("WebGLState:",L)}}function nt(){try{i.texStorage2D(...arguments)}catch(L){Zt("WebGLState:",L)}}function rt(){try{i.texStorage3D(...arguments)}catch(L){Zt("WebGLState:",L)}}function q(){try{i.texImage2D(...arguments)}catch(L){Zt("WebGLState:",L)}}function Z(){try{i.texImage3D(...arguments)}catch(L){Zt("WebGLState:",L)}}function ot(L){return f[L]!==void 0?f[L]:i.getParameter(L)}function Et(L,it){f[L]!==it&&(i.pixelStorei(L,it),f[L]=it)}function ut(L){me.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),me.copy(L))}function lt(L){Jt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Jt.copy(L))}function Rt(L,it){let K=c.get(it);K===void 0&&(K=new WeakMap,c.set(it,K));let ct=K.get(L);ct===void 0&&(ct=i.getUniformBlockIndex(it,L.name),K.set(L,ct))}function Pt(L,it){const ct=c.get(it).get(L);l.get(it)!==ct&&(i.uniformBlockBinding(it,ct,L.__bindingPointIndex),l.set(it,ct))}function kt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},at=null,pt={},u={},d=new WeakMap,m=[],x=null,g=!1,p=null,M=null,T=null,y=null,w=null,b=null,R=null,v=new Yt(0,0,0),E=0,C=!1,P=null,D=null,W=null,$=null,k=null,me.set(0,0,i.canvas.width,i.canvas.height),Jt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:It,bindFramebuffer:Ot,drawBuffers:Ct,useProgram:ve,setBlending:Qt,setMaterial:$t,setFlipSided:Se,setCullFace:we,setLineWidth:Ce,setPolygonOffset:Le,setScissorTest:ge,activeTexture:be,bindTexture:U,unbindTexture:Ve,compressedTexImage2D:te,compressedTexImage3D:A,texImage2D:q,texImage3D:Z,pixelStorei:Et,getParameter:ot,updateUBOMapping:Rt,uniformBlockBinding:Pt,texStorage2D:nt,texStorage3D:rt,texSubImage2D:_,texSubImage3D:O,compressedTexSubImage2D:G,compressedTexSubImage3D:X,scissor:ut,viewport:lt,reset:kt}}function Gx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(A,_){return m?new OffscreenCanvas(A,_):Tr("canvas")}function g(A,_,O){let G=1;const X=te(A);if((X.width>O||X.height>O)&&(G=O/Math.max(X.width,X.height)),G<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const nt=Math.floor(G*X.width),rt=Math.floor(G*X.height);u===void 0&&(u=x(nt,rt));const q=_?x(nt,rt):u;return q.width=nt,q.height=rt,q.getContext("2d").drawImage(A,0,0,nt,rt),Lt("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+nt+"x"+rt+")."),q}else return"data"in A&&Lt("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),A;return A}function p(A){return A.generateMipmaps}function M(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,_,O,G,X,nt=!1){if(A!==null){if(i[A]!==void 0)return i[A];Lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let rt;G&&(rt=t.get("EXT_texture_norm16"),rt||Lt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let q=_;if(_===i.RED&&(O===i.FLOAT&&(q=i.R32F),O===i.HALF_FLOAT&&(q=i.R16F),O===i.UNSIGNED_BYTE&&(q=i.R8),O===i.UNSIGNED_SHORT&&rt&&(q=rt.R16_EXT),O===i.SHORT&&rt&&(q=rt.R16_SNORM_EXT)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.R8UI),O===i.UNSIGNED_SHORT&&(q=i.R16UI),O===i.UNSIGNED_INT&&(q=i.R32UI),O===i.BYTE&&(q=i.R8I),O===i.SHORT&&(q=i.R16I),O===i.INT&&(q=i.R32I)),_===i.RG&&(O===i.FLOAT&&(q=i.RG32F),O===i.HALF_FLOAT&&(q=i.RG16F),O===i.UNSIGNED_BYTE&&(q=i.RG8),O===i.UNSIGNED_SHORT&&rt&&(q=rt.RG16_EXT),O===i.SHORT&&rt&&(q=rt.RG16_SNORM_EXT)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RG8UI),O===i.UNSIGNED_SHORT&&(q=i.RG16UI),O===i.UNSIGNED_INT&&(q=i.RG32UI),O===i.BYTE&&(q=i.RG8I),O===i.SHORT&&(q=i.RG16I),O===i.INT&&(q=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGB8UI),O===i.UNSIGNED_SHORT&&(q=i.RGB16UI),O===i.UNSIGNED_INT&&(q=i.RGB32UI),O===i.BYTE&&(q=i.RGB8I),O===i.SHORT&&(q=i.RGB16I),O===i.INT&&(q=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(q=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(q=i.RGBA16UI),O===i.UNSIGNED_INT&&(q=i.RGBA32UI),O===i.BYTE&&(q=i.RGBA8I),O===i.SHORT&&(q=i.RGBA16I),O===i.INT&&(q=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_SHORT&&rt&&(q=rt.RGB16_EXT),O===i.SHORT&&rt&&(q=rt.RGB16_SNORM_EXT),O===i.UNSIGNED_INT_5_9_9_9_REV&&(q=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(q=i.R11F_G11F_B10F)),_===i.RGBA){const Z=nt?br:Wt.getTransfer(X);O===i.FLOAT&&(q=i.RGBA32F),O===i.HALF_FLOAT&&(q=i.RGBA16F),O===i.UNSIGNED_BYTE&&(q=Z===ee?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT&&rt&&(q=rt.RGBA16_EXT),O===i.SHORT&&rt&&(q=rt.RGBA16_SNORM_EXT),O===i.UNSIGNED_SHORT_4_4_4_4&&(q=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(q=i.RGB5_A1)}return(q===i.R16F||q===i.R32F||q===i.RG16F||q===i.RG32F||q===i.RGBA16F||q===i.RGBA32F)&&t.get("EXT_color_buffer_float"),q}function w(A,_){let O;return A?_===null||_===wn||_===ws?O=i.DEPTH24_STENCIL8:_===Sn?O=i.DEPTH32F_STENCIL8:_===Es&&(O=i.DEPTH24_STENCIL8,Lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===wn||_===ws?O=i.DEPTH_COMPONENT24:_===Sn?O=i.DEPTH_COMPONENT32F:_===Es&&(O=i.DEPTH_COMPONENT16),O}function b(A,_){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ie&&A.minFilter!==Oe?Math.log2(Math.max(_.width,_.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?_.mipmaps.length:1}function R(A){const _=A.target;_.removeEventListener("dispose",R),E(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&f.delete(_)}function v(A){const _=A.target;_.removeEventListener("dispose",v),P(_)}function E(A){const _=n.get(A);if(_.__webglInit===void 0)return;const O=A.source,G=d.get(O);if(G){const X=G[_.__cacheKey];X.usedTimes--,X.usedTimes===0&&C(A),Object.keys(G).length===0&&d.delete(O)}n.remove(A)}function C(A){const _=n.get(A);i.deleteTexture(_.__webglTexture);const O=A.source,G=d.get(O);delete G[_.__cacheKey],a.memory.textures--}function P(A){const _=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(_.__webglFramebuffer[G]))for(let X=0;X<_.__webglFramebuffer[G].length;X++)i.deleteFramebuffer(_.__webglFramebuffer[G][X]);else i.deleteFramebuffer(_.__webglFramebuffer[G]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[G])}else{if(Array.isArray(_.__webglFramebuffer))for(let G=0;G<_.__webglFramebuffer.length;G++)i.deleteFramebuffer(_.__webglFramebuffer[G]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let G=0;G<_.__webglColorRenderbuffer.length;G++)_.__webglColorRenderbuffer[G]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[G]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=A.textures;for(let G=0,X=O.length;G<X;G++){const nt=n.get(O[G]);nt.__webglTexture&&(i.deleteTexture(nt.__webglTexture),a.memory.textures--),n.remove(O[G])}n.remove(A)}let D=0;function W(){D=0}function $(){return D}function k(A){D=A}function Y(){const A=D;return A>=s.maxTextures&&Lt("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),D+=1,A}function B(A){const _=[];return _.push(A.wrapS),_.push(A.wrapT),_.push(A.wrapR||0),_.push(A.magFilter),_.push(A.minFilter),_.push(A.anisotropy),_.push(A.internalFormat),_.push(A.format),_.push(A.type),_.push(A.generateMipmaps),_.push(A.premultiplyAlpha),_.push(A.flipY),_.push(A.unpackAlignment),_.push(A.colorSpace),_.join()}function Q(A,_){const O=n.get(A);if(A.isVideoTexture&&U(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&O.__version!==A.version){const G=A.image;if(G===null)Lt("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)Lt("WebGLRenderer: Texture marked for update but image is incomplete");else{It(O,A,_);return}}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function tt(A,_){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){It(O,A,_);return}else A.isExternalTexture&&(O.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function at(A,_){const O=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&O.__version!==A.version){It(O,A,_);return}e.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function pt(A,_){const O=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&O.__version!==A.version){Ot(O,A,_);return}e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}const yt={[Ja]:i.REPEAT,[Fn]:i.CLAMP_TO_EDGE,[Qa]:i.MIRRORED_REPEAT},Xt={[Ie]:i.NEAREST,[Cf]:i.NEAREST_MIPMAP_NEAREST,[Fs]:i.NEAREST_MIPMAP_LINEAR,[Oe]:i.LINEAR,[Xr]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},me={[If]:i.NEVER,[Of]:i.ALWAYS,[Df]:i.LESS,[Ko]:i.LEQUAL,[Uf]:i.EQUAL,[Zo]:i.GEQUAL,[Nf]:i.GREATER,[Ff]:i.NOTEQUAL};function Jt(A,_){if(_.type===Sn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Oe||_.magFilter===Xr||_.magFilter===Fs||_.magFilter===vi||_.minFilter===Oe||_.minFilter===Xr||_.minFilter===Fs||_.minFilter===vi)&&Lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,yt[_.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,yt[_.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,yt[_.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Xt[_.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Xt[_.minFilter]),_.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,me[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ie||_.minFilter!==Fs&&_.minFilter!==vi||_.type===Sn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function J(A,_){let O=!1;A.__webglInit===void 0&&(A.__webglInit=!0,_.addEventListener("dispose",R));const G=_.source;let X=d.get(G);X===void 0&&(X={},d.set(G,X));const nt=B(_);if(nt!==A.__cacheKey){X[nt]===void 0&&(X[nt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),X[nt].usedTimes++;const rt=X[A.__cacheKey];rt!==void 0&&(X[A.__cacheKey].usedTimes--,rt.usedTimes===0&&C(_)),A.__cacheKey=nt,A.__webglTexture=X[nt].texture}return O}function st(A,_,O){return Math.floor(Math.floor(A/O)/_)}function et(A,_,O,G){const nt=A.updateRanges;if(nt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,G,_.data);else{nt.sort((Et,ut)=>Et.start-ut.start);let rt=0;for(let Et=1;Et<nt.length;Et++){const ut=nt[rt],lt=nt[Et],Rt=ut.start+ut.count,Pt=st(lt.start,_.width,4),kt=st(ut.start,_.width,4);lt.start<=Rt+1&&Pt===kt&&st(lt.start+lt.count-1,_.width,4)===Pt?ut.count=Math.max(ut.count,lt.start+lt.count-ut.start):(++rt,nt[rt]=lt)}nt.length=rt+1;const q=e.getParameter(i.UNPACK_ROW_LENGTH),Z=e.getParameter(i.UNPACK_SKIP_PIXELS),ot=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let Et=0,ut=nt.length;Et<ut;Et++){const lt=nt[Et],Rt=Math.floor(lt.start/4),Pt=Math.ceil(lt.count/4),kt=Rt%_.width,L=Math.floor(Rt/_.width),it=Pt,K=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,kt),e.pixelStorei(i.UNPACK_SKIP_ROWS,L),e.texSubImage2D(i.TEXTURE_2D,0,kt,L,it,K,O,G,_.data)}A.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,q),e.pixelStorei(i.UNPACK_SKIP_PIXELS,Z),e.pixelStorei(i.UNPACK_SKIP_ROWS,ot)}}function It(A,_,O){let G=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(G=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(G=i.TEXTURE_3D);const X=J(A,_),nt=_.source;e.bindTexture(G,A.__webglTexture,i.TEXTURE0+O);const rt=n.get(nt);if(nt.version!==rt.__version||X===!0){if(e.activeTexture(i.TEXTURE0+O),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const K=Wt.getPrimaries(Wt.workingColorSpace),ct=_.colorSpace===ti?null:Wt.getPrimaries(_.colorSpace),gt=_.colorSpace===ti||K===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt)}e.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment);let Z=g(_.image,!1,s.maxTextureSize);Z=Ve(_,Z);const ot=r.convert(_.format,_.colorSpace),Et=r.convert(_.type);let ut=y(_.internalFormat,ot,Et,_.normalized,_.colorSpace,_.isVideoTexture);Jt(G,_);let lt;const Rt=_.mipmaps,Pt=_.isVideoTexture!==!0,kt=rt.__version===void 0||X===!0,L=nt.dataReady,it=b(_,Z);if(_.isDepthTexture)ut=w(_.format===yi,_.type),kt&&(Pt?e.texStorage2D(i.TEXTURE_2D,1,ut,Z.width,Z.height):e.texImage2D(i.TEXTURE_2D,0,ut,Z.width,Z.height,0,ot,Et,null));else if(_.isDataTexture)if(Rt.length>0){Pt&&kt&&e.texStorage2D(i.TEXTURE_2D,it,ut,Rt[0].width,Rt[0].height);for(let K=0,ct=Rt.length;K<ct;K++)lt=Rt[K],Pt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ot,Et,lt.data):e.texImage2D(i.TEXTURE_2D,K,ut,lt.width,lt.height,0,ot,Et,lt.data);_.generateMipmaps=!1}else Pt?(kt&&e.texStorage2D(i.TEXTURE_2D,it,ut,Z.width,Z.height),L&&et(_,Z,ot,Et)):e.texImage2D(i.TEXTURE_2D,0,ut,Z.width,Z.height,0,ot,Et,Z.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Pt&&kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,it,ut,Rt[0].width,Rt[0].height,Z.depth);for(let K=0,ct=Rt.length;K<ct;K++)if(lt=Rt[K],_.format!==un)if(ot!==null)if(Pt){if(L)if(_.layerUpdates.size>0){const gt=dc(lt.width,lt.height,_.format,_.type);for(const j of _.layerUpdates){const Tt=lt.data.subarray(j*gt/lt.data.BYTES_PER_ELEMENT,(j+1)*gt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,j,lt.width,lt.height,1,ot,Tt)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,Z.depth,ot,lt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,ut,lt.width,lt.height,Z.depth,0,lt.data,0,0);else Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pt?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,Z.depth,ot,Et,lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,ut,lt.width,lt.height,Z.depth,0,ot,Et,lt.data)}else{Pt&&kt&&e.texStorage2D(i.TEXTURE_2D,it,ut,Rt[0].width,Rt[0].height);for(let K=0,ct=Rt.length;K<ct;K++)lt=Rt[K],_.format!==un?ot!==null?Pt?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ot,lt.data):e.compressedTexImage2D(i.TEXTURE_2D,K,ut,lt.width,lt.height,0,lt.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ot,Et,lt.data):e.texImage2D(i.TEXTURE_2D,K,ut,lt.width,lt.height,0,ot,Et,lt.data)}else if(_.isDataArrayTexture)if(Pt){if(kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,it,ut,Z.width,Z.height,Z.depth),L)if(_.layerUpdates.size>0){const K=dc(Z.width,Z.height,_.format,_.type);for(const ct of _.layerUpdates){const gt=Z.data.subarray(ct*K/Z.data.BYTES_PER_ELEMENT,(ct+1)*K/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ct,Z.width,Z.height,1,ot,Et,gt)}_.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,ot,Et,Z.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,ut,Z.width,Z.height,Z.depth,0,ot,Et,Z.data);else if(_.isData3DTexture)Pt?(kt&&e.texStorage3D(i.TEXTURE_3D,it,ut,Z.width,Z.height,Z.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,ot,Et,Z.data)):e.texImage3D(i.TEXTURE_3D,0,ut,Z.width,Z.height,Z.depth,0,ot,Et,Z.data);else if(_.isFramebufferTexture){if(kt)if(Pt)e.texStorage2D(i.TEXTURE_2D,it,ut,Z.width,Z.height);else{let K=Z.width,ct=Z.height;for(let gt=0;gt<it;gt++)e.texImage2D(i.TEXTURE_2D,gt,ut,K,ct,0,ot,Et,null),K>>=1,ct>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in i){const K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),Z.parentNode!==K){K.appendChild(Z),f.add(_),K.onpaint=ct=>{const gt=ct.changedElements;for(const j of f)gt.includes(j.image)&&(j.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Z);else{const gt=i.RGBA,j=i.RGBA,Tt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,gt,j,Tt,Z)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Rt.length>0){if(Pt&&kt){const K=te(Rt[0]);e.texStorage2D(i.TEXTURE_2D,it,ut,K.width,K.height)}for(let K=0,ct=Rt.length;K<ct;K++)lt=Rt[K],Pt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,ot,Et,lt):e.texImage2D(i.TEXTURE_2D,K,ut,ot,Et,lt);_.generateMipmaps=!1}else if(Pt){if(kt){const K=te(Z);e.texStorage2D(i.TEXTURE_2D,it,ut,K.width,K.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ot,Et,Z)}else e.texImage2D(i.TEXTURE_2D,0,ut,ot,Et,Z);p(_)&&M(G),rt.__version=nt.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function Ot(A,_,O){if(_.image.length!==6)return;const G=J(A,_),X=_.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+O);const nt=n.get(X);if(X.version!==nt.__version||G===!0){e.activeTexture(i.TEXTURE0+O);const rt=Wt.getPrimaries(Wt.workingColorSpace),q=_.colorSpace===ti?null:Wt.getPrimaries(_.colorSpace),Z=_.colorSpace===ti||rt===q?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const ot=_.isCompressedTexture||_.image[0].isCompressedTexture,Et=_.image[0]&&_.image[0].isDataTexture,ut=[];for(let j=0;j<6;j++)!ot&&!Et?ut[j]=g(_.image[j],!0,s.maxCubemapSize):ut[j]=Et?_.image[j].image:_.image[j],ut[j]=Ve(_,ut[j]);const lt=ut[0],Rt=r.convert(_.format,_.colorSpace),Pt=r.convert(_.type),kt=y(_.internalFormat,Rt,Pt,_.normalized,_.colorSpace),L=_.isVideoTexture!==!0,it=nt.__version===void 0||G===!0,K=X.dataReady;let ct=b(_,lt);Jt(i.TEXTURE_CUBE_MAP,_);let gt;if(ot){L&&it&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,kt,lt.width,lt.height);for(let j=0;j<6;j++){gt=ut[j].mipmaps;for(let Tt=0;Tt<gt.length;Tt++){const St=gt[Tt];_.format!==un?Rt!==null?L?K&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,0,0,St.width,St.height,Rt,St.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,kt,St.width,St.height,0,St.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,0,0,St.width,St.height,Rt,Pt,St.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,kt,St.width,St.height,0,Rt,Pt,St.data)}}}else{if(gt=_.mipmaps,L&&it){gt.length>0&&ct++;const j=te(ut[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,kt,j.width,j.height)}for(let j=0;j<6;j++)if(Et){L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ut[j].width,ut[j].height,Rt,Pt,ut[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,kt,ut[j].width,ut[j].height,0,Rt,Pt,ut[j].data);for(let Tt=0;Tt<gt.length;Tt++){const xe=gt[Tt].image[j].image;L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,0,0,xe.width,xe.height,Rt,Pt,xe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,kt,xe.width,xe.height,0,Rt,Pt,xe.data)}}else{L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Rt,Pt,ut[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,kt,Rt,Pt,ut[j]);for(let Tt=0;Tt<gt.length;Tt++){const St=gt[Tt];L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,0,0,Rt,Pt,St.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,kt,Rt,Pt,St.image[j])}}}p(_)&&M(i.TEXTURE_CUBE_MAP),nt.__version=X.version,_.onUpdate&&_.onUpdate(_)}A.__version=_.version}function Ct(A,_,O,G,X,nt){const rt=r.convert(O.format,O.colorSpace),q=r.convert(O.type),Z=y(O.internalFormat,rt,q,O.normalized,O.colorSpace),ot=n.get(_),Et=n.get(O);if(Et.__renderTarget=_,!ot.__hasExternalTextures){const ut=Math.max(1,_.width>>nt),lt=Math.max(1,_.height>>nt);X===i.TEXTURE_3D||X===i.TEXTURE_2D_ARRAY?e.texImage3D(X,nt,Z,ut,lt,_.depth,0,rt,q,null):e.texImage2D(X,nt,Z,ut,lt,0,rt,q,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),be(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,G,X,Et.__webglTexture,0,ge(_)):(X===i.TEXTURE_2D||X>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,G,X,Et.__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ve(A,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,A),_.depthBuffer){const G=_.depthTexture,X=G&&G.isDepthTexture?G.type:null,nt=w(_.stencilBuffer,X),rt=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;be(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge(_),nt,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge(_),nt,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,nt,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,A)}else{const G=_.textures;for(let X=0;X<G.length;X++){const nt=G[X],rt=r.convert(nt.format,nt.colorSpace),q=r.convert(nt.type),Z=y(nt.internalFormat,rt,q,nt.normalized,nt.colorSpace);be(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge(_),Z,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge(_),Z,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Z,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Vt(A,_,O){const G=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const X=n.get(_.depthTexture);if(X.__renderTarget=_,(!X.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),G){if(X.__webglInit===void 0&&(X.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),X.__webglTexture===void 0){X.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),Jt(i.TEXTURE_CUBE_MAP,_.depthTexture);const ot=r.convert(_.depthTexture.format),Et=r.convert(_.depthTexture.type);let ut;_.depthTexture.format===Gn?ut=i.DEPTH_COMPONENT24:_.depthTexture.format===yi&&(ut=i.DEPTH24_STENCIL8);for(let lt=0;lt<6;lt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,ut,_.width,_.height,0,ot,Et,null)}}else Q(_.depthTexture,0);const nt=X.__webglTexture,rt=ge(_),q=G?i.TEXTURE_CUBE_MAP_POSITIVE_X+O:i.TEXTURE_2D,Z=_.depthTexture.format===yi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(_.depthTexture.format===Gn)be(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,q,nt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,Z,q,nt,0);else if(_.depthTexture.format===yi)be(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,q,nt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,Z,q,nt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(A){const _=n.get(A),O=A.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==A.depthTexture){const G=A.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),G){const X=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,G.removeEventListener("dispose",X)};G.addEventListener("dispose",X),_.__depthDisposeCallback=X}_.__boundDepthTexture=G}if(A.depthTexture&&!_.__autoAllocateDepthBuffer)if(O)for(let G=0;G<6;G++)Vt(_.__webglFramebuffer[G],A,G);else{const G=A.texture.mipmaps;G&&G.length>0?Vt(_.__webglFramebuffer[0],A,0):Vt(_.__webglFramebuffer,A,0)}else if(O){_.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[G]),_.__webglDepthbuffer[G]===void 0)_.__webglDepthbuffer[G]=i.createRenderbuffer(),ve(_.__webglDepthbuffer[G],A,!1);else{const X=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=_.__webglDepthbuffer[G];i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,nt)}}else{const G=A.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),ve(_.__webglDepthbuffer,A,!1);else{const X=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,nt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Qt(A,_,O){const G=n.get(A);_!==void 0&&Ct(G.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ie(A)}function $t(A){const _=A.texture,O=n.get(A),G=n.get(_);A.addEventListener("dispose",v);const X=A.textures,nt=A.isWebGLCubeRenderTarget===!0,rt=X.length>1;if(rt||(G.__webglTexture===void 0&&(G.__webglTexture=i.createTexture()),G.__version=_.version,a.memory.textures++),nt){O.__webglFramebuffer=[];for(let q=0;q<6;q++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[q]=[];for(let Z=0;Z<_.mipmaps.length;Z++)O.__webglFramebuffer[q][Z]=i.createFramebuffer()}else O.__webglFramebuffer[q]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let q=0;q<_.mipmaps.length;q++)O.__webglFramebuffer[q]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(rt)for(let q=0,Z=X.length;q<Z;q++){const ot=n.get(X[q]);ot.__webglTexture===void 0&&(ot.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&be(A)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let q=0;q<X.length;q++){const Z=X[q];O.__webglColorRenderbuffer[q]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[q]);const ot=r.convert(Z.format,Z.colorSpace),Et=r.convert(Z.type),ut=y(Z.internalFormat,ot,Et,Z.normalized,Z.colorSpace,A.isXRRenderTarget===!0),lt=ge(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,ut,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+q,i.RENDERBUFFER,O.__webglColorRenderbuffer[q])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),ve(O.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(nt){e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture),Jt(i.TEXTURE_CUBE_MAP,_);for(let q=0;q<6;q++)if(_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Ct(O.__webglFramebuffer[q][Z],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Z);else Ct(O.__webglFramebuffer[q],A,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0);p(_)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let q=0,Z=X.length;q<Z;q++){const ot=X[q],Et=n.get(ot);let ut=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ut=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,Et.__webglTexture),Jt(ut,ot),Ct(O.__webglFramebuffer,A,ot,i.COLOR_ATTACHMENT0+q,ut,0),p(ot)&&M(ut)}e.unbindTexture()}else{let q=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(q=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(q,G.__webglTexture),Jt(q,_),_.mipmaps&&_.mipmaps.length>0)for(let Z=0;Z<_.mipmaps.length;Z++)Ct(O.__webglFramebuffer[Z],A,_,i.COLOR_ATTACHMENT0,q,Z);else Ct(O.__webglFramebuffer,A,_,i.COLOR_ATTACHMENT0,q,0);p(_)&&M(q),e.unbindTexture()}A.depthBuffer&&ie(A)}function Se(A){const _=A.textures;for(let O=0,G=_.length;O<G;O++){const X=_[O];if(p(X)){const nt=T(A),rt=n.get(X).__webglTexture;e.bindTexture(nt,rt),M(nt),e.unbindTexture()}}}const we=[],Ce=[];function Le(A){if(A.samples>0){if(be(A)===!1){const _=A.textures,O=A.width,G=A.height;let X=i.COLOR_BUFFER_BIT;const nt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=n.get(A),q=_.length>1;if(q)for(let ot=0;ot<_.length;ot++)e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);const Z=A.texture.mipmaps;Z&&Z.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let ot=0;ot<_.length;ot++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(X|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(X|=i.STENCIL_BUFFER_BIT)),q){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,rt.__webglColorRenderbuffer[ot]);const Et=n.get(_[ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Et,0)}i.blitFramebuffer(0,0,O,G,0,0,O,G,X,i.NEAREST),l===!0&&(we.length=0,Ce.length=0,we.push(i.COLOR_ATTACHMENT0+ot),A.depthBuffer&&A.resolveDepthBuffer===!1&&(we.push(nt),Ce.push(nt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ce)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,we))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),q)for(let ot=0;ot<_.length;ot++){e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,rt.__webglColorRenderbuffer[ot]);const Et=n.get(_[ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,Et,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const _=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function ge(A){return Math.min(s.maxSamples,A.samples)}function be(A){const _=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function U(A){const _=a.render.frame;h.get(A)!==_&&(h.set(A,_),A.update())}function Ve(A,_){const O=A.colorSpace,G=A.format,X=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||O!==Sr&&O!==ti&&(Wt.getTransfer(O)===ee?(G!==un||X!==Je)&&Lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Zt("WebGLTextures: Unsupported texture color space:",O)),_}function te(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=W,this.getTextureUnits=$,this.setTextureUnits=k,this.setTexture2D=Q,this.setTexture2DArray=tt,this.setTexture3D=at,this.setTextureCube=pt,this.rebindTextures=Qt,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Ct,this.useMultisampledRTT=be,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Vx(i,t){function e(n,s=ti){let r;const a=Wt.getTransfer(s);if(n===Je)return i.UNSIGNED_BYTE;if(n===Wo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Rh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ch)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===wh)return i.BYTE;if(n===Ah)return i.SHORT;if(n===Es)return i.UNSIGNED_SHORT;if(n===Vo)return i.INT;if(n===wn)return i.UNSIGNED_INT;if(n===Sn)return i.FLOAT;if(n===zn)return i.HALF_FLOAT;if(n===Ph)return i.ALPHA;if(n===Lh)return i.RGB;if(n===un)return i.RGBA;if(n===Gn)return i.DEPTH_COMPONENT;if(n===yi)return i.DEPTH_STENCIL;if(n===Ih)return i.RED;if(n===qo)return i.RED_INTEGER;if(n===bi)return i.RG;if(n===Yo)return i.RG_INTEGER;if(n===$o)return i.RGBA_INTEGER;if(n===fr||n===dr||n===pr||n===mr)if(a===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===fr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===fr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===pr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===mr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ja||n===to||n===eo||n===no)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ja)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===to)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===eo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===no)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===io||n===so||n===ro||n===ao||n===oo||n===yr||n===lo)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===io||n===so)return a===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ro)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===ao)return r.COMPRESSED_R11_EAC;if(n===oo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===yr)return r.COMPRESSED_RG11_EAC;if(n===lo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===xo||n===_o||n===vo||n===yo||n===Mo||n===So||n===bo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===co)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ho)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===uo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===fo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===po)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===mo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===go)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===_o)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===vo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===yo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Mo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===So)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===bo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===To||n===Eo||n===wo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===To)return a===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Eo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===wo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ao||n===Ro||n===Mr||n===Co)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ao)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Mr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Co)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ws?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Wx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xx=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class qx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new zh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new An({vertexShader:Wx,fragmentShader:Xx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Dt(new Cr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Yx extends Ei{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null;const x=typeof XRWebGLBinding<"u",g=new qx,p={},M=e.getContextAttributes();let T=null,y=null;const w=[],b=[],R=new ht;let v=null;const E=new ln;E.viewport=new fe;const C=new ln;C.viewport=new fe;const P=[E,C],D=new ip;let W=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let st=w[J];return st===void 0&&(st=new jr,w[J]=st),st.getTargetRaySpace()},this.getControllerGrip=function(J){let st=w[J];return st===void 0&&(st=new jr,w[J]=st),st.getGripSpace()},this.getHand=function(J){let st=w[J];return st===void 0&&(st=new jr,w[J]=st),st.getHandSpace()};function k(J){const st=b.indexOf(J.inputSource);if(st===-1)return;const et=w[st];et!==void 0&&(et.update(J.inputSource,J.frame,c||a),et.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",B);for(let J=0;J<w.length;J++){const st=b[J];st!==null&&(b[J]=null,w[J].disconnect(st))}W=null,$=null,g.reset();for(const J in p)delete p[J];t.setRenderTarget(T),d=null,u=null,f=null,s=null,y=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(T=t.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",B),M.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let et=null,It=null,Ot=null;M.depth&&(Ot=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=M.stencil?yi:Gn,It=M.stencil?ws:wn);const Ct={colorFormat:e.RGBA8,depthFormat:Ot,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ct),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new En(u.textureWidth,u.textureHeight,{format:un,type:Je,depthTexture:new ts(u.textureWidth,u.textureHeight,It,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const et={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,et),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new En(d.framebufferWidth,d.framebufferHeight,{format:un,type:Je,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function B(J){for(let st=0;st<J.removed.length;st++){const et=J.removed[st],It=b.indexOf(et);It>=0&&(b[It]=null,w[It].disconnect(et))}for(let st=0;st<J.added.length;st++){const et=J.added[st];let It=b.indexOf(et);if(It===-1){for(let Ct=0;Ct<w.length;Ct++)if(Ct>=b.length){b.push(et),It=Ct;break}else if(b[Ct]===null){b[Ct]=et,It=Ct;break}if(It===-1)break}const Ot=w[It];Ot&&Ot.connect(et)}}const Q=new I,tt=new I;function at(J,st,et){Q.setFromMatrixPosition(st.matrixWorld),tt.setFromMatrixPosition(et.matrixWorld);const It=Q.distanceTo(tt),Ot=st.projectionMatrix.elements,Ct=et.projectionMatrix.elements,ve=Ot[14]/(Ot[10]-1),Vt=Ot[14]/(Ot[10]+1),ie=(Ot[9]+1)/Ot[5],Qt=(Ot[9]-1)/Ot[5],$t=(Ot[8]-1)/Ot[0],Se=(Ct[8]+1)/Ct[0],we=ve*$t,Ce=ve*Se,Le=It/(-$t+Se),ge=Le*-$t;if(st.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ge),J.translateZ(Le),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ot[10]===-1)J.projectionMatrix.copy(st.projectionMatrix),J.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const be=ve+Le,U=Vt+Le,Ve=we-ge,te=Ce+(It-ge),A=ie*Vt/U*be,_=Qt*Vt/U*be;J.projectionMatrix.makePerspective(Ve,te,A,_,be,U),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function pt(J,st){st===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(st.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let st=J.near,et=J.far;g.texture!==null&&(g.depthNear>0&&(st=g.depthNear),g.depthFar>0&&(et=g.depthFar)),D.near=C.near=E.near=st,D.far=C.far=E.far=et,(W!==D.near||$!==D.far)&&(s.updateRenderState({depthNear:D.near,depthFar:D.far}),W=D.near,$=D.far),D.layers.mask=J.layers.mask|6,E.layers.mask=D.layers.mask&-5,C.layers.mask=D.layers.mask&-3;const It=J.parent,Ot=D.cameras;pt(D,It);for(let Ct=0;Ct<Ot.length;Ct++)pt(Ot[Ct],It);Ot.length===2?at(D,E,C):D.projectionMatrix.copy(E.projectionMatrix),yt(J,D,It)};function yt(J,st,et){et===null?J.matrix.copy(st.matrixWorld):(J.matrix.copy(et.matrixWorld),J.matrix.invert(),J.matrix.multiply(st.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(st.projectionMatrix),J.projectionMatrixInverse.copy(st.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Lo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(J){l=J,u!==null&&(u.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(D)},this.getCameraTexture=function(J){return p[J]};let Xt=null;function me(J,st){if(h=st.getViewerPose(c||a),m=st,h!==null){const et=h.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let It=!1;et.length!==D.cameras.length&&(D.cameras.length=0,It=!0);for(let Vt=0;Vt<et.length;Vt++){const ie=et[Vt];let Qt=null;if(d!==null)Qt=d.getViewport(ie);else{const Se=f.getViewSubImage(u,ie);Qt=Se.viewport,Vt===0&&(t.setRenderTargetTextures(y,Se.colorTexture,Se.depthStencilTexture),t.setRenderTarget(y))}let $t=P[Vt];$t===void 0&&($t=new ln,$t.layers.enable(Vt),$t.viewport=new fe,P[Vt]=$t),$t.matrix.fromArray(ie.transform.matrix),$t.matrix.decompose($t.position,$t.quaternion,$t.scale),$t.projectionMatrix.fromArray(ie.projectionMatrix),$t.projectionMatrixInverse.copy($t.projectionMatrix).invert(),$t.viewport.set(Qt.x,Qt.y,Qt.width,Qt.height),Vt===0&&(D.matrix.copy($t.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),It===!0&&D.cameras.push($t)}const Ot=s.enabledFeatures;if(Ot&&Ot.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=n.getBinding();const Vt=f.getDepthInformation(et[0]);Vt&&Vt.isValid&&Vt.texture&&g.init(Vt,s.renderState)}if(Ot&&Ot.includes("camera-access")&&x){t.state.unbindTexture(),f=n.getBinding();for(let Vt=0;Vt<et.length;Vt++){const ie=et[Vt].camera;if(ie){let Qt=p[ie];Qt||(Qt=new zh,p[ie]=Qt);const $t=f.getCameraImage(ie);Qt.sourceTexture=$t}}}}for(let et=0;et<w.length;et++){const It=b[et],Ot=w[et];It!==null&&Ot!==void 0&&Ot.update(It,st,c||a)}Xt&&Xt(J,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),m=null}const Jt=new eu;Jt.setAnimationLoop(me),this.setAnimationLoop=function(J){Xt=J},this.dispose=function(){}}}const $x=new ae,lu=new Nt;lu.set(-1,0,0,0,1,0,0,0,1);function Kx(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,Jh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,M,T,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&d(g,p,y)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),x(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(a(g,p),p.isLineDashedMaterial&&o(g,p)):p.isPointsMaterial?l(g,p,M,T):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===qe&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===qe&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);const M=t.get(p),T=M.envMap,y=M.envMapRotation;T&&(g.envMap.value=T,g.envMapRotation.value.setFromMatrix4($x.makeRotationFromEuler(y)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(lu),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function a(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function o(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,M,T){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*M,g.scale.value=T*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,M){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===qe&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=M.texture,g.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function x(g,p){const M=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(M.matrixWorld),g.nearDistance.value=M.shadow.camera.near,g.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Zx(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,w){const b=w.program;n.uniformBlockBinding(y,b)}function c(y,w){let b=s[y.id];b===void 0&&(g(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",M));const R=w.program;n.updateUBOMapping(y,R);const v=t.render.frame;r[y.id]!==v&&(u(y),r[y.id]=v)}function h(y){const w=f();y.__bindingPointIndex=w;const b=i.createBuffer(),R=y.__size,v=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,b),b}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Zt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const w=s[y.id],b=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let v=0,E=b.length;v<E;v++){const C=b[v];if(Array.isArray(C))for(let P=0,D=C.length;P<D;P++)d(C[P],v,P,R);else d(C,v,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(y,w,b,R){if(x(y,w,b,R)===!0){const v=y.__offset,E=y.value;if(Array.isArray(E)){let C=0;for(let P=0;P<E.length;P++){const D=E[P],W=p(D);m(D,y.__data,C),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(C+=W.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(E,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,y.__data)}}function m(y,w,b){typeof y=="number"||typeof y=="boolean"?w[0]=y:y.isMatrix3?(w[0]=y.elements[0],w[1]=y.elements[1],w[2]=y.elements[2],w[3]=0,w[4]=y.elements[3],w[5]=y.elements[4],w[6]=y.elements[5],w[7]=0,w[8]=y.elements[6],w[9]=y.elements[7],w[10]=y.elements[8],w[11]=0):ArrayBuffer.isView(y)?w.set(new y.constructor(y.buffer,y.byteOffset,w.length)):y.toArray(w,b)}function x(y,w,b,R){const v=y.value,E=w+"_"+b;if(R[E]===void 0)return typeof v=="number"||typeof v=="boolean"?R[E]=v:ArrayBuffer.isView(v)?R[E]=v.slice():R[E]=v.clone(),!0;{const C=R[E];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return R[E]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(C.equals(v)===!1)return C.copy(v),!0}}return!1}function g(y){const w=y.uniforms;let b=0;const R=16;for(let E=0,C=w.length;E<C;E++){const P=Array.isArray(w[E])?w[E]:[w[E]];for(let D=0,W=P.length;D<W;D++){const $=P[D],k=Array.isArray($.value)?$.value:[$.value];for(let Y=0,B=k.length;Y<B;Y++){const Q=k[Y],tt=p(Q),at=b%R,pt=at%tt.boundary,yt=at+pt;b+=pt,yt!==0&&R-yt<tt.storage&&(b+=R-yt),$.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=b,b+=tt.storage}}}const v=b%R;return v>0&&(b+=R-v),y.__size=b,y.__cache={},this}function p(y){const w={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(w.boundary=4,w.storage=4):y.isVector2?(w.boundary=8,w.storage=8):y.isVector3||y.isColor?(w.boundary=16,w.storage=12):y.isVector4?(w.boundary=16,w.storage=16):y.isMatrix3?(w.boundary=48,w.storage=48):y.isMatrix4?(w.boundary=64,w.storage=64):y.isTexture?Lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(w.boundary=16,w.storage=y.byteLength):Lt("WebGLRenderer: Unsupported uniform value type.",y),w}function M(y){const w=y.target;w.removeEventListener("dispose",M);const b=a.indexOf(w.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function T(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:T}}const Jx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let xn=null;function Qx(){return xn===null&&(xn=new cd(Jx,16,16,bi,zn),xn.name="DFG_LUT",xn.minFilter=Oe,xn.magFilter=Oe,xn.wrapS=Fn,xn.wrapT=Fn,xn.generateMipmaps=!1,xn.needsUpdate=!0),xn}class jx{constructor(t={}){const{canvas:e=Bf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Je}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=a;const x=d,g=new Set([$o,Yo,qo]),p=new Set([Je,wn,Es,ws,Wo,Xo]),M=new Uint32Array(4),T=new Int32Array(4),y=new I;let w=null,b=null;const R=[],v=[];let E=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Tn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,D=null,W=null,$=null,k=null;this._outputColorSpace=Ze;let Y=0,B=0,Q=null,tt=-1,at=null;const pt=new fe,yt=new fe;let Xt=null;const me=new Yt(0);let Jt=0,J=e.width,st=e.height,et=1,It=null,Ot=null;const Ct=new fe(0,0,J,st),ve=new fe(0,0,J,st);let Vt=!1;const ie=new jo;let Qt=!1,$t=!1;const Se=new ae,we=new I,Ce=new fe,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ge=!1;function be(){return Q===null?et:1}let U=n;function Ve(S,N){return e.getContext(S,N)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Go}`),e.addEventListener("webglcontextlost",xe,!1),e.addEventListener("webglcontextrestored",le,!1),e.addEventListener("webglcontextcreationerror",dn,!1),U===null){const N="webgl2";if(U=Ve(N,S),U===null)throw Ve(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw Zt("WebGLRenderer: "+S.message),S}let te,A,_,O,G,X,nt,rt,q,Z,ot,Et,ut,lt,Rt,Pt,kt,L,it,K,ct,gt,j;function Tt(){te=new Q0(U),te.init(),ct=new Vx(U,te),A=new W0(U,te,t,ct),_=new zx(U,te),A.reversedDepthBuffer&&u&&_.buffers.depth.setReversed(!0),W=U.createFramebuffer(),$=U.createFramebuffer(),k=U.createFramebuffer(),O=new eg(U),G=new Ax,X=new Gx(U,te,_,G,A,ct,O),nt=new J0(C),rt=new rp(U),gt=new G0(U,rt),q=new j0(U,rt,O,gt),Z=new ig(U,q,rt,gt,O),L=new ng(U,A,X),Rt=new X0(G),ot=new wx(C,nt,te,A,gt,Rt),Et=new Kx(C,G),ut=new Cx,lt=new Nx(te),kt=new z0(C,nt,_,Z,m,l),Pt=new Hx(C,Z,A),j=new Zx(U,O,A,_),it=new V0(U,te,O),K=new tg(U,te,O),O.programs=ot.programs,C.capabilities=A,C.extensions=te,C.properties=G,C.renderLists=ut,C.shadowMap=Pt,C.state=_,C.info=O}Tt(),x!==Je&&(E=new rg(x,e.width,e.height,o,s,r));const St=new Yx(C,U);this.xr=St,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const S=te.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=te.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(S){S!==void 0&&(et=S,this.setSize(J,st,!1))},this.getSize=function(S){return S.set(J,st)},this.setSize=function(S,N,V=!0){if(St.isPresenting){Lt("WebGLRenderer: Can't change size while VR device is presenting.");return}J=S,st=N,e.width=Math.floor(S*et),e.height=Math.floor(N*et),V===!0&&(e.style.width=S+"px",e.style.height=N+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,S,N)},this.getDrawingBufferSize=function(S){return S.set(J*et,st*et).floor()},this.setDrawingBufferSize=function(S,N,V){J=S,st=N,et=V,e.width=Math.floor(S*V),e.height=Math.floor(N*V),this.setViewport(0,0,S,N)},this.setEffects=function(S){if(x===Je){Zt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let N=0;N<S.length;N++)if(S[N].isOutputPass===!0){Lt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(pt)},this.getViewport=function(S){return S.copy(Ct)},this.setViewport=function(S,N,V,H){S.isVector4?Ct.set(S.x,S.y,S.z,S.w):Ct.set(S,N,V,H),_.viewport(pt.copy(Ct).multiplyScalar(et).round())},this.getScissor=function(S){return S.copy(ve)},this.setScissor=function(S,N,V,H){S.isVector4?ve.set(S.x,S.y,S.z,S.w):ve.set(S,N,V,H),_.scissor(yt.copy(ve).multiplyScalar(et).round())},this.getScissorTest=function(){return Vt},this.setScissorTest=function(S){_.setScissorTest(Vt=S)},this.setOpaqueSort=function(S){It=S},this.setTransparentSort=function(S){Ot=S},this.getClearColor=function(S){return S.copy(kt.getClearColor())},this.setClearColor=function(){kt.setClearColor(...arguments)},this.getClearAlpha=function(){return kt.getClearAlpha()},this.setClearAlpha=function(){kt.setClearAlpha(...arguments)},this.clear=function(S=!0,N=!0,V=!0){let H=0;if(S){let z=!1;if(Q!==null){const mt=Q.texture.format;z=g.has(mt)}if(z){const mt=Q.texture.type,vt=p.has(mt),dt=kt.getClearColor(),bt=kt.getClearAlpha(),wt=dt.r,Bt=dt.g,zt=dt.b;vt?(M[0]=wt,M[1]=Bt,M[2]=zt,M[3]=bt,U.clearBufferuiv(U.COLOR,0,M)):(T[0]=wt,T[1]=Bt,T[2]=zt,T[3]=bt,U.clearBufferiv(U.COLOR,0,T))}else H|=U.COLOR_BUFFER_BIT}N&&(H|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(H|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&U.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),D=S},this.dispose=function(){e.removeEventListener("webglcontextlost",xe,!1),e.removeEventListener("webglcontextrestored",le,!1),e.removeEventListener("webglcontextcreationerror",dn,!1),kt.dispose(),ut.dispose(),lt.dispose(),G.dispose(),nt.dispose(),Z.dispose(),gt.dispose(),j.dispose(),ot.dispose(),St.dispose(),St.removeEventListener("sessionstart",fl),St.removeEventListener("sessionend",dl),ai.stop()};function xe(S){S.preventDefault(),Ol("WebGLRenderer: Context Lost."),P=!0}function le(){Ol("WebGLRenderer: Context Restored."),P=!1;const S=O.autoReset,N=Pt.enabled,V=Pt.autoUpdate,H=Pt.needsUpdate,z=Pt.type;Tt(),O.autoReset=S,Pt.enabled=N,Pt.autoUpdate=V,Pt.needsUpdate=H,Pt.type=z}function dn(S){Zt("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function pn(S){const N=S.target;N.removeEventListener("dispose",pn),Tu(N)}function Tu(S){Eu(S),G.remove(S)}function Eu(S){const N=G.get(S).programs;N!==void 0&&(N.forEach(function(V){ot.releaseProgram(V)}),S.isShaderMaterial&&ot.releaseShaderCache(S))}this.renderBufferDirect=function(S,N,V,H,z,mt){N===null&&(N=Le);const vt=z.isMesh&&z.matrixWorld.determinantAffine()<0,dt=Ru(S,N,V,H,z);_.setMaterial(H,vt);let bt=V.index,wt=1;if(H.wireframe===!0){if(bt=q.getWireframeAttribute(V),bt===void 0)return;wt=2}const Bt=V.drawRange,zt=V.attributes.position;let At=Bt.start*wt,ne=(Bt.start+Bt.count)*wt;mt!==null&&(At=Math.max(At,mt.start*wt),ne=Math.min(ne,(mt.start+mt.count)*wt)),bt!==null?(At=Math.max(At,0),ne=Math.min(ne,bt.count)):zt!=null&&(At=Math.max(At,0),ne=Math.min(ne,zt.count));const ye=ne-At;if(ye<0||ye===1/0)return;gt.setup(z,H,dt,V,bt);let _e,se=it;if(bt!==null&&(_e=rt.get(bt),se=K,se.setIndex(_e)),z.isMesh)H.wireframe===!0?(_.setLineWidth(H.wireframeLinewidth*be()),se.setMode(U.LINES)):se.setMode(U.TRIANGLES);else if(z.isLine){let Ue=H.linewidth;Ue===void 0&&(Ue=1),_.setLineWidth(Ue*be()),z.isLineSegments?se.setMode(U.LINES):z.isLineLoop?se.setMode(U.LINE_LOOP):se.setMode(U.LINE_STRIP)}else z.isPoints?se.setMode(U.POINTS):z.isSprite&&se.setMode(U.TRIANGLES);if(z.isBatchedMesh)if(te.get("WEBGL_multi_draw"))se.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{const Ue=z._multiDrawStarts,_t=z._multiDrawCounts,Ye=z._multiDrawCount,Kt=bt?rt.get(bt).bytesPerElement:1,je=G.get(H).currentProgram.getUniforms();for(let mn=0;mn<Ye;mn++)je.setValue(U,"_gl_DrawID",mn),se.render(Ue[mn]/Kt,_t[mn])}else if(z.isInstancedMesh)se.renderInstances(At,ye,z.count);else if(V.isInstancedBufferGeometry){const Ue=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,_t=Math.min(V.instanceCount,Ue);se.renderInstances(At,ye,_t)}else se.render(At,ye)};function ul(S,N,V){S.transparent===!0&&S.side===Nn&&S.forceSinglePass===!1?(S.side=qe,S.needsUpdate=!0,Ns(S,N,V),S.side=si,S.needsUpdate=!0,Ns(S,N,V),S.side=Nn):Ns(S,N,V)}this.compile=function(S,N,V=null){V===null&&(V=S),b=lt.get(V),b.init(N),v.push(b),V.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),S!==V&&S.traverseVisible(function(z){z.isLight&&z.layers.test(N.layers)&&(b.pushLight(z),z.castShadow&&b.pushShadow(z))}),b.setupLights();const H=new Set;return S.traverse(function(z){if(!(z.isMesh||z.isPoints||z.isLine||z.isSprite))return;const mt=z.material;if(mt)if(Array.isArray(mt))for(let vt=0;vt<mt.length;vt++){const dt=mt[vt];ul(dt,V,z),H.add(dt)}else ul(mt,V,z),H.add(mt)}),b=v.pop(),H},this.compileAsync=function(S,N,V=null){const H=this.compile(S,N,V);return new Promise(z=>{function mt(){if(H.forEach(function(vt){G.get(vt).currentProgram.isReady()&&H.delete(vt)}),H.size===0){z(S);return}setTimeout(mt,10)}te.get("KHR_parallel_shader_compile")!==null?mt():setTimeout(mt,10)})};let Ur=null;function wu(S){Ur&&Ur(S)}function fl(){ai.stop()}function dl(){ai.start()}const ai=new eu;ai.setAnimationLoop(wu),typeof self<"u"&&ai.setContext(self),this.setAnimationLoop=function(S){Ur=S,St.setAnimationLoop(S),S===null?ai.stop():ai.start()},St.addEventListener("sessionstart",fl),St.addEventListener("sessionend",dl),this.render=function(S,N){if(N!==void 0&&N.isCamera!==!0){Zt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(S,N);const V=St.enabled===!0&&St.isPresenting===!0,H=E!==null&&(Q===null||V)&&E.begin(C,Q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),St.enabled===!0&&St.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(St.cameraAutoUpdate===!0&&St.updateCamera(N),N=St.getCamera()),S.isScene===!0&&S.onBeforeRender(C,S,N,Q),b=lt.get(S,v.length),b.init(N),b.state.textureUnits=X.getTextureUnits(),v.push(b),Se.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),ie.setFromProjectionMatrix(Se,bn,N.reversedDepth),$t=this.localClippingEnabled,Qt=Rt.init(this.clippingPlanes,$t),w=ut.get(S,R.length),w.init(),R.push(w),St.enabled===!0&&St.isPresenting===!0){const vt=C.xr.getDepthSensingMesh();vt!==null&&Nr(vt,N,-1/0,C.sortObjects)}Nr(S,N,0,C.sortObjects),w.finish(),C.sortObjects===!0&&w.sort(It,Ot,N.reversedDepth),ge=St.enabled===!1||St.isPresenting===!1||St.hasDepthSensing()===!1,ge&&kt.addToRenderList(w,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Qt===!0&&Rt.beginShadows();const z=b.state.shadowsArray;if(Pt.render(z,S,N),Qt===!0&&Rt.endShadows(),(H&&E.hasRenderPass())===!1){const vt=w.opaque,dt=w.transmissive;if(b.setupLights(),N.isArrayCamera){const bt=N.cameras;if(dt.length>0)for(let wt=0,Bt=bt.length;wt<Bt;wt++){const zt=bt[wt];ml(vt,dt,S,zt)}ge&&kt.render(S);for(let wt=0,Bt=bt.length;wt<Bt;wt++){const zt=bt[wt];pl(w,S,zt,zt.viewport)}}else dt.length>0&&ml(vt,dt,S,N),ge&&kt.render(S),pl(w,S,N)}Q!==null&&B===0&&(X.updateMultisampleRenderTarget(Q),X.updateRenderTargetMipmap(Q)),H&&E.end(C),S.isScene===!0&&S.onAfterRender(C,S,N),gt.resetDefaultState(),tt=-1,at=null,v.pop(),v.length>0?(b=v[v.length-1],X.setTextureUnits(b.state.textureUnits),Qt===!0&&Rt.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?w=R[R.length-1]:w=null,D!==null&&D.renderEnd()};function Nr(S,N,V,H){if(S.visible===!1)return;if(S.layers.test(N.layers)){if(S.isGroup)V=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(N);else if(S.isLightProbeGrid)b.pushLightProbeGrid(S);else if(S.isLight)b.pushLight(S),S.castShadow&&b.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ie.intersectsSprite(S)){H&&Ce.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Se);const vt=Z.update(S),dt=S.material;dt.visible&&w.push(S,vt,dt,V,Ce.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ie.intersectsObject(S))){const vt=Z.update(S),dt=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ce.copy(S.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),Ce.copy(vt.boundingSphere.center)),Ce.applyMatrix4(S.matrixWorld).applyMatrix4(Se)),Array.isArray(dt)){const bt=vt.groups;for(let wt=0,Bt=bt.length;wt<Bt;wt++){const zt=bt[wt],At=dt[zt.materialIndex];At&&At.visible&&w.push(S,vt,At,V,Ce.z,zt)}}else dt.visible&&w.push(S,vt,dt,V,Ce.z,null)}}const mt=S.children;for(let vt=0,dt=mt.length;vt<dt;vt++)Nr(mt[vt],N,V,H)}function pl(S,N,V,H){const{opaque:z,transmissive:mt,transparent:vt}=S;b.setupLightsView(V),Qt===!0&&Rt.setGlobalState(C.clippingPlanes,V),H&&_.viewport(pt.copy(H)),z.length>0&&Us(z,N,V),mt.length>0&&Us(mt,N,V),vt.length>0&&Us(vt,N,V),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function ml(S,N,V,H){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){const At=te.has("EXT_color_buffer_half_float")||te.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new En(1,1,{generateMipmaps:!0,type:At?zn:Je,minFilter:vi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Wt.workingColorSpace})}const mt=b.state.transmissionRenderTarget[H.id],vt=H.viewport||pt;mt.setSize(vt.z*C.transmissionResolutionScale,vt.w*C.transmissionResolutionScale);const dt=C.getRenderTarget(),bt=C.getActiveCubeFace(),wt=C.getActiveMipmapLevel();C.setRenderTarget(mt),C.getClearColor(me),Jt=C.getClearAlpha(),Jt<1&&C.setClearColor(16777215,.5),C.clear(),ge&&kt.render(V);const Bt=C.toneMapping;C.toneMapping=Tn;const zt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),Qt===!0&&Rt.setGlobalState(C.clippingPlanes,H),Us(S,V,H),X.updateMultisampleRenderTarget(mt),X.updateRenderTargetMipmap(mt),te.has("WEBGL_multisampled_render_to_texture")===!1){let At=!1;for(let ne=0,ye=N.length;ne<ye;ne++){const _e=N[ne],{object:se,geometry:Ue,material:_t,group:Ye}=_e;if(_t.side===Nn&&se.layers.test(H.layers)){const Kt=_t.side;_t.side=qe,_t.needsUpdate=!0,gl(se,V,H,Ue,_t,Ye),_t.side=Kt,_t.needsUpdate=!0,At=!0}}At===!0&&(X.updateMultisampleRenderTarget(mt),X.updateRenderTargetMipmap(mt))}C.setRenderTarget(dt,bt,wt),C.setClearColor(me,Jt),zt!==void 0&&(H.viewport=zt),C.toneMapping=Bt}function Us(S,N,V){const H=N.isScene===!0?N.overrideMaterial:null;for(let z=0,mt=S.length;z<mt;z++){const vt=S[z],{object:dt,geometry:bt,group:wt}=vt;let Bt=vt.material;Bt.allowOverride===!0&&H!==null&&(Bt=H),dt.layers.test(V.layers)&&gl(dt,N,V,bt,Bt,wt)}}function gl(S,N,V,H,z,mt){S.onBeforeRender(C,N,V,H,z,mt),S.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),z.onBeforeRender(C,N,V,H,S,mt),z.transparent===!0&&z.side===Nn&&z.forceSinglePass===!1?(z.side=qe,z.needsUpdate=!0,C.renderBufferDirect(V,N,H,z,S,mt),z.side=si,z.needsUpdate=!0,C.renderBufferDirect(V,N,H,z,S,mt),z.side=Nn):C.renderBufferDirect(V,N,H,z,S,mt),S.onAfterRender(C,N,V,H,z,mt)}function Ns(S,N,V){N.isScene!==!0&&(N=Le);const H=G.get(S),z=b.state.lights,mt=b.state.shadowsArray,vt=z.state.version,dt=ot.getParameters(S,z.state,mt,N,V,b.state.lightProbeGridArray),bt=ot.getProgramCacheKey(dt);let wt=H.programs;H.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?N.environment:null,H.fog=N.fog;const Bt=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;H.envMap=nt.get(S.envMap||H.environment,Bt),H.envMapRotation=H.environment!==null&&S.envMap===null?N.environmentRotation:S.envMapRotation,wt===void 0&&(S.addEventListener("dispose",pn),wt=new Map,H.programs=wt);let zt=wt.get(bt);if(zt!==void 0){if(H.currentProgram===zt&&H.lightsStateVersion===vt)return _l(S,dt),zt}else dt.uniforms=ot.getUniforms(S),D!==null&&S.isNodeMaterial&&D.build(S,V,dt),S.onBeforeCompile(dt,C),zt=ot.acquireProgram(dt,bt),wt.set(bt,zt),H.uniforms=dt.uniforms;const At=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(At.clippingPlanes=Rt.uniform),_l(S,dt),H.needsLights=Pu(S),H.lightsStateVersion=vt,H.needsLights&&(At.ambientLightColor.value=z.state.ambient,At.lightProbe.value=z.state.probe,At.directionalLights.value=z.state.directional,At.directionalLightShadows.value=z.state.directionalShadow,At.spotLights.value=z.state.spot,At.spotLightShadows.value=z.state.spotShadow,At.rectAreaLights.value=z.state.rectArea,At.ltc_1.value=z.state.rectAreaLTC1,At.ltc_2.value=z.state.rectAreaLTC2,At.pointLights.value=z.state.point,At.pointLightShadows.value=z.state.pointShadow,At.hemisphereLights.value=z.state.hemi,At.directionalShadowMatrix.value=z.state.directionalShadowMatrix,At.spotLightMatrix.value=z.state.spotLightMatrix,At.spotLightMap.value=z.state.spotLightMap,At.pointShadowMatrix.value=z.state.pointShadowMatrix),H.lightProbeGrid=b.state.lightProbeGridArray.length>0,H.currentProgram=zt,H.uniformsList=null,zt}function xl(S){if(S.uniformsList===null){const N=S.currentProgram.getUniforms();S.uniformsList=gr.seqWithValue(N.seq,S.uniforms)}return S.uniformsList}function _l(S,N){const V=G.get(S);V.outputColorSpace=N.outputColorSpace,V.batching=N.batching,V.batchingColor=N.batchingColor,V.instancing=N.instancing,V.instancingColor=N.instancingColor,V.instancingMorph=N.instancingMorph,V.skinning=N.skinning,V.morphTargets=N.morphTargets,V.morphNormals=N.morphNormals,V.morphColors=N.morphColors,V.morphTargetsCount=N.morphTargetsCount,V.numClippingPlanes=N.numClippingPlanes,V.numIntersection=N.numClipIntersection,V.vertexAlphas=N.vertexAlphas,V.vertexTangents=N.vertexTangents,V.toneMapping=N.toneMapping}function Au(S,N){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;y.setFromMatrixPosition(N.matrixWorld);for(let V=0,H=S.length;V<H;V++){const z=S[V];if(z.texture!==null&&z.boundingBox.containsPoint(y))return z}return null}function Ru(S,N,V,H,z){N.isScene!==!0&&(N=Le),X.resetTextureUnits();const mt=N.fog,vt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?N.environment:null,dt=Q===null?C.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Wt.workingColorSpace,bt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,wt=nt.get(H.envMap||vt,bt),Bt=H.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,zt=!!V.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),At=!!V.morphAttributes.position,ne=!!V.morphAttributes.normal,ye=!!V.morphAttributes.color;let _e=Tn;H.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(_e=C.toneMapping);const se=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ue=se!==void 0?se.length:0,_t=G.get(H),Ye=b.state.lights;if(Qt===!0&&($t===!0||S!==at)){const ce=S===at&&H.id===tt;Rt.setState(H,S,ce)}let Kt=!1;H.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==Ye.state.version||_t.outputColorSpace!==dt||z.isBatchedMesh&&_t.batching===!1||!z.isBatchedMesh&&_t.batching===!0||z.isBatchedMesh&&_t.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&_t.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&_t.instancing===!1||!z.isInstancedMesh&&_t.instancing===!0||z.isSkinnedMesh&&_t.skinning===!1||!z.isSkinnedMesh&&_t.skinning===!0||z.isInstancedMesh&&_t.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&_t.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&_t.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&_t.instancingMorph===!1&&z.morphTexture!==null||_t.envMap!==wt||H.fog===!0&&_t.fog!==mt||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==Rt.numPlanes||_t.numIntersection!==Rt.numIntersection)||_t.vertexAlphas!==Bt||_t.vertexTangents!==zt||_t.morphTargets!==At||_t.morphNormals!==ne||_t.morphColors!==ye||_t.toneMapping!==_e||_t.morphTargetsCount!==Ue||!!_t.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Kt=!0):(Kt=!0,_t.__version=H.version);let je=_t.currentProgram;Kt===!0&&(je=Ns(H,N,z),D&&H.isNodeMaterial&&D.onUpdateProgram(H,je,_t));let mn=!1,Wn=!1,wi=!1;const re=je.getUniforms(),Me=_t.uniforms;if(_.useProgram(je.program)&&(mn=!0,Wn=!0,wi=!0),H.id!==tt&&(tt=H.id,Wn=!0),_t.needsLights){const ce=Au(b.state.lightProbeGridArray,z);_t.lightProbeGrid!==ce&&(_t.lightProbeGrid=ce,Wn=!0)}if(mn||at!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),re.setValue(U,"projectionMatrix",S.projectionMatrix),re.setValue(U,"viewMatrix",S.matrixWorldInverse);const qn=re.map.cameraPosition;qn!==void 0&&qn.setValue(U,we.setFromMatrixPosition(S.matrixWorld)),A.logarithmicDepthBuffer&&re.setValue(U,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&re.setValue(U,"isOrthographic",S.isOrthographicCamera===!0),at!==S&&(at=S,Wn=!0,wi=!0)}if(_t.needsLights&&(Ye.state.directionalShadowMap.length>0&&re.setValue(U,"directionalShadowMap",Ye.state.directionalShadowMap,X),Ye.state.spotShadowMap.length>0&&re.setValue(U,"spotShadowMap",Ye.state.spotShadowMap,X),Ye.state.pointShadowMap.length>0&&re.setValue(U,"pointShadowMap",Ye.state.pointShadowMap,X)),z.isSkinnedMesh){re.setOptional(U,z,"bindMatrix"),re.setOptional(U,z,"bindMatrixInverse");const ce=z.skeleton;ce&&(ce.boneTexture===null&&ce.computeBoneTexture(),re.setValue(U,"boneTexture",ce.boneTexture,X))}z.isBatchedMesh&&(re.setOptional(U,z,"batchingTexture"),re.setValue(U,"batchingTexture",z._matricesTexture,X),re.setOptional(U,z,"batchingIdTexture"),re.setValue(U,"batchingIdTexture",z._indirectTexture,X),re.setOptional(U,z,"batchingColorTexture"),z._colorsTexture!==null&&re.setValue(U,"batchingColorTexture",z._colorsTexture,X));const Xn=V.morphAttributes;if((Xn.position!==void 0||Xn.normal!==void 0||Xn.color!==void 0)&&L.update(z,V,je),(Wn||_t.receiveShadow!==z.receiveShadow)&&(_t.receiveShadow=z.receiveShadow,re.setValue(U,"receiveShadow",z.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&N.environment!==null&&(Me.envMapIntensity.value=N.environmentIntensity),Me.dfgLUT!==void 0&&(Me.dfgLUT.value=Qx()),Wn){if(re.setValue(U,"toneMappingExposure",C.toneMappingExposure),_t.needsLights&&Cu(Me,wi),mt&&H.fog===!0&&Et.refreshFogUniforms(Me,mt),Et.refreshMaterialUniforms(Me,H,et,st,b.state.transmissionRenderTarget[S.id]),_t.needsLights&&_t.lightProbeGrid){const ce=_t.lightProbeGrid;Me.probesSH.value=ce.texture,Me.probesMin.value.copy(ce.boundingBox.min),Me.probesMax.value.copy(ce.boundingBox.max),Me.probesResolution.value.copy(ce.resolution)}gr.upload(U,xl(_t),Me,X)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(gr.upload(U,xl(_t),Me,X),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&re.setValue(U,"center",z.center),re.setValue(U,"modelViewMatrix",z.modelViewMatrix),re.setValue(U,"normalMatrix",z.normalMatrix),re.setValue(U,"modelMatrix",z.matrixWorld),H.uniformsGroups!==void 0){const ce=H.uniformsGroups;for(let qn=0,Ai=ce.length;qn<Ai;qn++){const vl=ce[qn];j.update(vl,je),j.bind(vl,je)}}return je}function Cu(S,N){S.ambientLightColor.needsUpdate=N,S.lightProbe.needsUpdate=N,S.directionalLights.needsUpdate=N,S.directionalLightShadows.needsUpdate=N,S.pointLights.needsUpdate=N,S.pointLightShadows.needsUpdate=N,S.spotLights.needsUpdate=N,S.spotLightShadows.needsUpdate=N,S.rectAreaLights.needsUpdate=N,S.hemisphereLights.needsUpdate=N}function Pu(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return B},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(S,N,V){const H=G.get(S);H.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),G.get(S.texture).__webglTexture=N,G.get(S.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:V,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,N){const V=G.get(S);V.__webglFramebuffer=N,V.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(S,N=0,V=0){Q=S,Y=N,B=V;let H=null,z=!1,mt=!1;if(S){const dt=G.get(S);if(dt.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(U.FRAMEBUFFER,dt.__webglFramebuffer),pt.copy(S.viewport),yt.copy(S.scissor),Xt=S.scissorTest,_.viewport(pt),_.scissor(yt),_.setScissorTest(Xt),tt=-1;return}else if(dt.__webglFramebuffer===void 0)X.setupRenderTarget(S);else if(dt.__hasExternalTextures)X.rebindTextures(S,G.get(S.texture).__webglTexture,G.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const Bt=S.depthTexture;if(dt.__boundDepthTexture!==Bt){if(Bt!==null&&G.has(Bt)&&(S.width!==Bt.image.width||S.height!==Bt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(S)}}const bt=S.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(mt=!0);const wt=G.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(wt[N])?H=wt[N][V]:H=wt[N],z=!0):S.samples>0&&X.useMultisampledRTT(S)===!1?H=G.get(S).__webglMultisampledFramebuffer:Array.isArray(wt)?H=wt[V]:H=wt,pt.copy(S.viewport),yt.copy(S.scissor),Xt=S.scissorTest}else pt.copy(Ct).multiplyScalar(et).floor(),yt.copy(ve).multiplyScalar(et).floor(),Xt=Vt;if(V!==0&&(H=W),_.bindFramebuffer(U.FRAMEBUFFER,H)&&_.drawBuffers(S,H),_.viewport(pt),_.scissor(yt),_.setScissorTest(Xt),z){const dt=G.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+N,dt.__webglTexture,V)}else if(mt){const dt=N;for(let bt=0;bt<S.textures.length;bt++){const wt=G.get(S.textures[bt]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+bt,wt.__webglTexture,V,dt)}}else if(S!==null&&V!==0){const dt=G.get(S.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,dt.__webglTexture,V)}tt=-1},this.readRenderTargetPixels=function(S,N,V,H,z,mt,vt,dt=0){if(!(S&&S.isWebGLRenderTarget)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=G.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&vt!==void 0&&(bt=bt[vt]),bt){_.bindFramebuffer(U.FRAMEBUFFER,bt);try{const wt=S.textures[dt],Bt=wt.format,zt=wt.type;if(S.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+dt),!A.textureFormatReadable(Bt)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(zt)){Zt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=S.width-H&&V>=0&&V<=S.height-z&&U.readPixels(N,V,H,z,ct.convert(Bt),ct.convert(zt),mt)}finally{const wt=Q!==null?G.get(Q).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(S,N,V,H,z,mt,vt,dt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=G.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&vt!==void 0&&(bt=bt[vt]),bt)if(N>=0&&N<=S.width-H&&V>=0&&V<=S.height-z){_.bindFramebuffer(U.FRAMEBUFFER,bt);const wt=S.textures[dt],Bt=wt.format,zt=wt.type;if(S.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+dt),!A.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const At=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,At),U.bufferData(U.PIXEL_PACK_BUFFER,mt.byteLength,U.STREAM_READ),U.readPixels(N,V,H,z,ct.convert(Bt),ct.convert(zt),0);const ne=Q!==null?G.get(Q).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,ne);const ye=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Hf(U,ye,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,At),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,mt),U.deleteBuffer(At),U.deleteSync(ye),mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,N=null,V=0){const H=Math.pow(2,-V),z=Math.floor(S.image.width*H),mt=Math.floor(S.image.height*H),vt=N!==null?N.x:0,dt=N!==null?N.y:0;X.setTexture2D(S,0),U.copyTexSubImage2D(U.TEXTURE_2D,V,0,0,vt,dt,z,mt),_.unbindTexture()},this.copyTextureToTexture=function(S,N,V=null,H=null,z=0,mt=0){let vt,dt,bt,wt,Bt,zt,At,ne,ye;const _e=S.isCompressedTexture?S.mipmaps[mt]:S.image;if(V!==null)vt=V.max.x-V.min.x,dt=V.max.y-V.min.y,bt=V.isBox3?V.max.z-V.min.z:1,wt=V.min.x,Bt=V.min.y,zt=V.isBox3?V.min.z:0;else{const Me=Math.pow(2,-z);vt=Math.floor(_e.width*Me),dt=Math.floor(_e.height*Me),S.isDataArrayTexture?bt=_e.depth:S.isData3DTexture?bt=Math.floor(_e.depth*Me):bt=1,wt=0,Bt=0,zt=0}H!==null?(At=H.x,ne=H.y,ye=H.z):(At=0,ne=0,ye=0);const se=ct.convert(N.format),Ue=ct.convert(N.type);let _t;N.isData3DTexture?(X.setTexture3D(N,0),_t=U.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(X.setTexture2DArray(N,0),_t=U.TEXTURE_2D_ARRAY):(X.setTexture2D(N,0),_t=U.TEXTURE_2D),_.activeTexture(U.TEXTURE0),_.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,N.flipY),_.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),_.pixelStorei(U.UNPACK_ALIGNMENT,N.unpackAlignment);const Ye=_.getParameter(U.UNPACK_ROW_LENGTH),Kt=_.getParameter(U.UNPACK_IMAGE_HEIGHT),je=_.getParameter(U.UNPACK_SKIP_PIXELS),mn=_.getParameter(U.UNPACK_SKIP_ROWS),Wn=_.getParameter(U.UNPACK_SKIP_IMAGES);_.pixelStorei(U.UNPACK_ROW_LENGTH,_e.width),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,_e.height),_.pixelStorei(U.UNPACK_SKIP_PIXELS,wt),_.pixelStorei(U.UNPACK_SKIP_ROWS,Bt),_.pixelStorei(U.UNPACK_SKIP_IMAGES,zt);const wi=S.isDataArrayTexture||S.isData3DTexture,re=N.isDataArrayTexture||N.isData3DTexture;if(S.isDepthTexture){const Me=G.get(S),Xn=G.get(N),ce=G.get(Me.__renderTarget),qn=G.get(Xn.__renderTarget);_.bindFramebuffer(U.READ_FRAMEBUFFER,ce.__webglFramebuffer),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,qn.__webglFramebuffer);for(let Ai=0;Ai<bt;Ai++)wi&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,G.get(S).__webglTexture,z,zt+Ai),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,G.get(N).__webglTexture,mt,ye+Ai)),U.blitFramebuffer(wt,Bt,vt,dt,At,ne,vt,dt,U.DEPTH_BUFFER_BIT,U.NEAREST);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(z!==0||S.isRenderTargetTexture||G.has(S)){const Me=G.get(S),Xn=G.get(N);_.bindFramebuffer(U.READ_FRAMEBUFFER,$),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,k);for(let ce=0;ce<bt;ce++)wi?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Me.__webglTexture,z,zt+ce):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Me.__webglTexture,z),re?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Xn.__webglTexture,mt,ye+ce):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Xn.__webglTexture,mt),z!==0?U.blitFramebuffer(wt,Bt,vt,dt,At,ne,vt,dt,U.COLOR_BUFFER_BIT,U.NEAREST):re?U.copyTexSubImage3D(_t,mt,At,ne,ye+ce,wt,Bt,vt,dt):U.copyTexSubImage2D(_t,mt,At,ne,wt,Bt,vt,dt);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else re?S.isDataTexture||S.isData3DTexture?U.texSubImage3D(_t,mt,At,ne,ye,vt,dt,bt,se,Ue,_e.data):N.isCompressedArrayTexture?U.compressedTexSubImage3D(_t,mt,At,ne,ye,vt,dt,bt,se,_e.data):U.texSubImage3D(_t,mt,At,ne,ye,vt,dt,bt,se,Ue,_e):S.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,mt,At,ne,vt,dt,se,Ue,_e.data):S.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,mt,At,ne,_e.width,_e.height,se,_e.data):U.texSubImage2D(U.TEXTURE_2D,mt,At,ne,vt,dt,se,Ue,_e);_.pixelStorei(U.UNPACK_ROW_LENGTH,Ye),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Kt),_.pixelStorei(U.UNPACK_SKIP_PIXELS,je),_.pixelStorei(U.UNPACK_SKIP_ROWS,mn),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Wn),mt===0&&N.generateMipmaps&&U.generateMipmap(_t),_.unbindTexture()},this.initRenderTarget=function(S){G.get(S).__webglFramebuffer===void 0&&X.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?X.setTextureCube(S,0):S.isData3DTexture?X.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?X.setTexture2DArray(S,0):X.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){Y=0,B=0,Q=null,_.reset(),gt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}}function t_(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Be;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const f=[];for(let u=0;u<i.length;++u){const d=i[u].index;for(let m=0;m<d.count;++m)f.push(d.getX(m)+h);h+=i[u].attributes.position.count}l.setIndex(f)}for(const h in r){const f=Oc(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){const d=[];for(let x=0;x<a[h].length;++x)d.push(a[h][x][u]);const m=Oc(d);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(m)}}}return l}function Oc(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new fn(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let u=0,d=h.count;u<d;u++)for(let m=0;m<e;m++){const x=h.getComponent(u,m);o.setComponent(u+f,m,x)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function He(i,t=.75,e=0){return new Qh({color:i,roughness:t,metalness:e,flatShading:!1})}function e_(){return{skin:He(13014134,.82),shadow:He(10317141,.88),hair:He(2108488,.68),uniform:He(2182520,.76),uniformLight:He(3235723,.68),uniformDeep:He(1322832,.84),pants:He(1581622,.84),accent:He(14728524,.58),belt:He(1514280,.9),boot:He(1120034,.9),glove:He(1119773,.88),glovePad:He(2436405,.78),eyeWhite:He(16250093,.62),eyeBlue:He(3906516,.5),eyeDark:He(1054765,.7)}}function Ut(i,t,e,n,s){t.position.set(e,n,s),i.add(t)}function nn(i,t,e=32){return new Dt(new Rr(t.map(([n,s])=>new ht(n,s)),e),i)}function n_(i){const t=nn(i,[[.055,-.08],[.11,-.075],[.14,-.02],[.145,.07],[.12,.12],[.04,.14]],32);return t.scale.set(1,.62,1.45),t}function i_(i,t,e){const n=new Dt(new Xe(1,24,16),t.skin);n.scale.set(.135,.155,.105),Ut(i,n,0,-.52,.015);const s=new Dt(new ke(.105,.045,6,18),t.glove);s.scale.z=.82,Ut(i,s,0,-.39,.02);const r=new Dt(new ke(.102,.035,5,16),t.glovePad);r.scale.set(1,1,.78),Ut(i,r,0,-.405,.085);const a=new Dt(new Xe(1,24,16),t.glove);a.scale.set(.12,.112,.095),Ut(i,a,0,-.495,.085);const o=new Dt(new Xe(1,20,14),t.glovePad);o.scale.set(.078,.045,.018),Ut(i,o,0,-.46,.178);const l=[[-.09,.125,.037],[-.03,.145,.04],[.03,.14,.04],[.09,.115,.037]];for(const[h,f,u]of l){const d=new Dt(new ke(u,f,6,14),t.skin);Ut(i,d,h,-.635-(.14-f)*.18,.025)}const c=new Dt(new ke(.041,.115,6,14),t.skin);c.rotation.z=-e*.72,Ut(i,c,e*.145,-.575,.035)}function s_(){const i=new Xe(1,32,18);return i.scale(.36,.13,.12),i.translate(0,.29,.39),i.computeVertexNormals(),i.toNonIndexed()}function kc(i){const t=new ke(.105,.46,7,18);return t.applyMatrix4(new ae().makeRotationZ(i*.045)),t.applyMatrix4(new ae().makeTranslation(i*.35,-.03,.36)),t.computeVertexNormals(),t.toNonIndexed()}function r_(){const i=new Rr([new ht(.22,-.43),new ht(.31,-.39),new ht(.39,-.28),new ht(.43,-.1),new ht(.44,.13),new ht(.41,.31),new ht(.34,.42),new ht(.22,.47),new ht(0,.48)],40);i.applyMatrix4(new ae().makeScale(1.05,1,.84)),i.applyMatrix4(new ae().makeTranslation(0,0,-.075)),i.computeVertexNormals();const t=t_([i.toNonIndexed(),s_(),kc(-1),kc(1)],!1);if(!t)throw new Error("Mara hair geometry merge failed");return t.computeVertexNormals(),t}function Bc(i,t,e){const n=new Dt(new Xe(1,24,16),t.shadow);n.scale.set(.132,.118,.045),Ut(i,n,e,.022,.335);const s=new Dt(new Xe(1,28,18),t.eyeWhite);s.scale.set(.101,.112,.046),Ut(i,s,e,.018,.367);const r=new Dt(new Xe(1,24,16),t.eyeBlue);r.scale.set(.068,.079,.038),Ut(i,r,e,.012,.414);const a=new Dt(new Xe(1,20,14),t.eyeDark);a.scale.set(.035,.052,.031),Ut(i,a,e,.008,.451);const o=new Dt(new Xe(1,14,10),t.eyeWhite);o.scale.set(.017,.02,.014),Ut(i,o,e-.022,.044,.481);const l=new Dt(new ke(.012,.13,4,12),t.eyeDark);l.rotation.z=Math.PI/2,Ut(i,l,e,.087,.443);const c=new Dt(new ke(.013,.105,4,12),t.hair);c.rotation.z=Math.PI/2+(e<0?-.18:.18),Ut(i,c,e,.151,.397)}function a_(i,t){Bc(i,t,-.125),Bc(i,t,.125);const e=nn(t.shadow,[[.018,-.025],[.028,0],[.016,.028],[0,.04]],16);e.scale.set(1,1,.5),Ut(i,e,0,-.055,.356);const n=new Dt(new sl(.065,.009,6,18,Math.PI),t.shadow);n.rotation.set(Math.PI/2,0,Math.PI),Ut(i,n,0,-.15,.346)}function o_(i,t){const e=new Dt(new Mi(.102,.102,.018,28),t.belt);e.rotation.x=Math.PI/2,Ut(i,e,.13,.39,.292);const n=new Dt(new Mi(.086,.086,.022,28),t.accent);n.rotation.x=Math.PI/2,Ut(i,n,.13,.39,.309);const s=new Dt(new Mi(.038,.038,.026,5),t.belt);s.rotation.set(Math.PI/2,0,Math.PI/4),Ut(i,s,.13,.39,.325)}function Wi(i,t,e,n,s,r=.13){const a=new Dt(new ke(.018,r,6,12),t);a.scale.z=.62,a.rotation.z=s,Ut(i,a,e,n,.292)}function l_(i,t){const e=new qh;return e.moveTo(0,.06),e.lineTo(t*.135,.085),e.lineTo(t*.045,-.055),e.lineTo(0,-.015),e.closePath(),new Dt(new il(e),i)}function Hc(i){return nn(i,[[.045,-.065],[.068,-.052],[.078,-.025],[.078,.038],[.062,.064],[.038,.068]],20)}function c_(i,t){const e=new Dt(new ke(.052,.068,5,12),t.belt);e.scale.z=.16,Ut(i,e,0,-.105,.108);const n=new Dt(new Vn(.052,.012,.012),t.accent);Ut(i,n,0,-.105,.124)}function h_(i){let t=0;return i.traverse(e=>{if(!e.isMesh)return;const n=e.geometry;t+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}),Math.round(t)}function u_(){const i=e_(),t=new qt,e=new qt,n=new qt,s=new qt,r=new qt,a=new qt,o=new qt,l=new qt,c=new qt;t.add(e),e.position.y=.64;for(const[g,p]of[[o,-.14],[l,.14]])g.position.x=p,Ut(g,nn(i.pants,[[.075,-.51],[.105,-.46],[.115,-.22],[.13,-.04],[.09,.02]],32),0,0,0),Ut(g,n_(i.boot),0,-.57,.075),e.add(g);Ut(e,nn(i.pants,[[.2,-.1],[.275,-.04],[.28,.04],[.235,.12]],36),0,-.01,0),e.add(n),n.position.y=.03,Ut(n,nn(i.uniform,[[.18,.02],[.265,.1],[.3,.28],[.285,.48],[.23,.61],[.12,.65]],40),0,.04,0);for(const g of[-1,1]){const p=new Dt(new Xe(1,20,14),i.uniformLight);p.scale.set(.13,.105,.13),Ut(n,p,g*.255,.48,.015);const M=new Dt(new ke(.022,.13,6,12),i.uniformDeep);M.scale.z=.55,M.rotation.z=-g*.36,Ut(n,M,g*.225,.37,.286)}Wi(n,i.uniformDeep,-.205,.42,-.52,.14),Wi(n,i.uniformLight,-.19,.39,-.52,.1),Wi(n,i.uniformDeep,.205,.42,.52,.14),Wi(n,i.uniformLight,.19,.39,.52,.1),Wi(n,i.uniformDeep,-.14,.19,.2,.13),Wi(n,i.uniformDeep,.14,.19,-.2,.13),Ut(n,nn(i.belt,[[.255,0],[.285,.035],[.278,.085],[.25,.11]],36),0,0,0);const h=new Dt(new Vn(.12,.1,.035,3,3,2),i.accent);Ut(n,h,0,.065,.285);for(const g of[-1,1]){const p=Hc(i.belt);Ut(n,p,g*.205,.068,.292);const M=new Dt(new ke(.045,.055,5,12),i.glovePad);M.scale.set(1.15,.34,.16),Ut(n,M,g*.205,.105,.365);const T=new Dt(new Xe(.012,12,8),i.accent);Ut(n,T,g*.205,.105,.383)}const f=Hc(i.belt);f.scale.set(.72,1.12,.82),Ut(n,f,.3,.105,.12);const u=new Dt(new Vn(.065,.018,.018),i.accent);Ut(n,u,.3,.168,.18),o_(n,i);for(const g of[-1,1]){const p=l_(i.uniformLight,g);Ut(n,p,0,.575,.301)}const d=new Dt(new ke(.047,.035,5,12),i.belt);d.scale.z=.34,Ut(n,d,0,.515,.318);const m=new Dt(new ke(.038,.205,5,12),i.belt);m.scale.z=.3,Ut(n,m,0,.395,.315);for(const[g,p]of[[r,-.375],[a,.375]])g.position.set(p,.43,0),Ut(g,nn(i.uniform,[[.075,-.18],[.105,-.12],[.11,.03],[.085,.12]],32),0,-.1,0),c_(g,i),Ut(g,nn(i.skin,[[.055,-.43],[.082,-.36],[.085,-.23],[.068,-.16]],32),0,-.1,0),i_(g,i,p<0?-1:1),n.add(g);a.add(c),c.position.set(0,-.43,.13),Ut(c,nn(i.belt,[[.035,-.32],[.05,-.25],[.052,.24],[.035,.32]],20),0,-.17,0),Ut(c,nn(i.accent,[[.055,-.06],[.065,0],[.055,.06]],20),0,.13,0),n.add(s),s.position.y=.76,Ut(s,nn(i.skin,[[.16,-.3],[.29,-.24],[.35,-.1],[.37,.08],[.36,.25],[.29,.36],[.16,.4]],40),0,0,0),Ut(s,new Dt(r_(),i.hair),0,0,0),a_(s,i);const x=new qt;return x.add(t),t.position.y=.08,{root:x,hip:e,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:h_(x)}}const wa=2.15,xr=420,_r=520;function cu(i,t){const e=t==="f";switch(i){case"mara":return{skin:13014134,shadow:10317141,hair:2108488,shirt:2182520,pants:1581622,accent:14728524,metal:12568788,shoe:1514280};case"dana":return{skin:11697242,shadow:9393983,hair:5978408,shirt:2970216,pants:2108218,accent:14268750,metal:12628893,shoe:1645349};case"priya":return{skin:9854784,shadow:7356719,hair:1905424,shirt:15328728,pants:2643038,accent:13192016,metal:14212322,shoe:2105386};case"hale":return{skin:13806212,shadow:10976349,hair:7628371,shirt:4278102,pants:2698552,accent:16762967,metal:12037788,shoe:1579554};case"crosby":return{skin:12358768,shadow:9396557,hair:3155231,shirt:6565176,pants:3283750,accent:15777874,metal:13741397,shoe:1512221};case"beckett":return{skin:11568226,shadow:8868157,hair:4072735,shirt:10105916,pants:3152932,accent:16747590,metal:13154454,shoe:1512731};case"delinquent":return{skin:e?13014648:11832428,shadow:9133388,hair:e?5582445:2103848,shirt:5203020,pants:2698806,accent:12668775,metal:11053750,shoe:1514016};case"magician":return{skin:e?13478026:12226158,shadow:9791055,hair:e?7614880:2626870,shirt:7354535,pants:2497094,accent:15056213,metal:14731384,shoe:1511718};case"wolverine":return{skin:7887430,shadow:5783599,hair:4928808,shirt:7755838,pants:5257772,accent:14711356,metal:13156526,shoe:2103572};case"boxer":return{skin:11171928,shadow:8212541,hair:1774872,shirt:15263980,pants:2434610,accent:14237772,metal:12369608,shoe:1513504};case"gunner":return{skin:e?13147776:11700328,shadow:9134926,hair:e?3548702:2170146,shirt:3229240,pants:2634542,accent:6667384,metal:8689035,shoe:1448986};case"worker":return{skin:12490358,shadow:9200463,hair:3156002,shirt:15772214,pants:3490909,accent:3698345,metal:11449533,shoe:1777705};default:return{skin:13148802,shadow:9859418,hair:2696750,shirt:15789286,pants:2370624,accent:5404848,metal:12235163,shoe:1513763}}}function _n(i,t=.75,e=0){return new Qh({color:i,roughness:t,metalness:e,flatShading:!1})}function hu(i){return{skin:_n(i.skin,.82),shadow:_n(i.shadow,.88),hair:_n(i.hair,.7),shirt:_n(i.shirt),pants:_n(i.pants,.84),accent:_n(i.accent,.58),metal:_n(i.metal,.28,.45),shoe:_n(i.shoe,.9),white:_n(16250093,.62),dark:_n(1446683,.82)}}function f_(i){return i==="attack"?xr:i==="cast"?_r:0}function d_(i,t){const e=f_(i.anim);if(e>0){const s=((typeof performance<"u"?performance.now():t)-i.animStart)/e;if(s<1)return{clip:i.anim,t:Math.max(0,s)}}return i.anim==="walk"?{clip:"walk",t:t/280%1}:{clip:"idle",t:t/900%1}}function p_(i,t,e){const n=Ts(e);return{x:-n.y*i+n.x*t,y:n.x*i+n.y*t}}function zc(i,t,e){return p_(i,t,e)}function uu(i){return 58*i}function Mt(i,t,e,n,s){t.position.set(e,n,s),i.add(t)}function he(i,t,e,n=12,s=4){return new Dt(new ke(t,e,s,n),i)}function pe(i,t,e=16,n=12){return new Dt(new Xe(t,e,n),i)}function hn(i,t,e,n){return new Dt(new Vn(t,e,n,2,2,2),i)}function rl(i,t,e){return new Dt(new tl(t,e,20,5),i)}function Er(i,t,e,n,s){Mt(i,pe(t.white,.075,10,8),e,n,s),Mt(i,pe(t.dark,.043,8,6),e,n,s+.06)}function m_(i,t,e,n,s){if(Er(i,t,-s*.32,.03,s*.89),Er(i,t,s*.32,.03,s*.89),Mt(i,pe(t.shadow,.035,8,6),0,-.075,s*.94),Mt(i,hn(t.dark,n==="f"?.13:.16,.025,.02),0,-.16,s*.91),n==="f"&&(Mt(i,pe(t.accent,.035,8,6),-s*.56,-.11,s*.85),Mt(i,pe(t.accent,.035,8,6),s*.56,-.11,s*.85)),e==="hale"){const r=pe(t.hair,s*.48,12,8);r.scale.set(1,.55,.62),Mt(i,r,0,-s*.35,s*.63)}}function g_(i,t,e,n){const s=pe(t.hair,n*1.07,28,20);if(s.scale.set(1.08,1.02,.91),Mt(i,s,0,n*.18,-n*.11),e==="f"){for(const a of[-1,1]){const o=he(t.hair,n*.105,n*.58,14,5);o.rotation.z=a*.08,Mt(i,o,a*n*.82,-n*.13,n*.27)}const r=he(t.hair,n*.13,n*.62,14,5);r.rotation.z=Math.PI/2,Mt(i,r,0,n*.41,n*.66)}}function x_(i,t,e){const n=pe(t.hair,e*1.08,32,24);n.scale.set(1.22,1.42,1),Mt(i,n,0,-e*.1,-e*.1);const s=he(t.hair,e*.16,e*1.18,20,6);s.rotation.z=Math.PI/2,Mt(i,s,0,e*.27,e*.78);for(const r of[-1,1]){const a=he(t.hair,e*.14,e*.78,18,6);a.rotation.z=r*.06,Mt(i,a,r*e*.91,-e*.25,e*.27)}}function __(i,t,e){const n=pe(t.hair,e*1.08,32,24);n.scale.set(1.1,1.12,.92),Mt(i,n,0,e*.25,-e*.1);const s=he(t.hair,e*.34,e*.38,20,6);s.rotation.x=-.18,Mt(i,s,0,e*.66,-e*.52);const r=he(t.hair,e*.5,e*1.58,24,8);r.rotation.x=-.1,Mt(i,r,0,-e*.16,-e*1.02);const a=pe(t.hair,e*.58,32,24);a.scale.set(1.1,1.12,.94),Mt(i,a,0,-e*.9,-e*1.06);for(const[o,l,c,h]of[[-.78,.52,.43,-.16],[-.52,.55,.3,-.08],[-.26,.56,.46,-.03],[0,.55,.33,0],[.27,.56,.49,.04],[.53,.54,.34,.09],[.79,.5,.44,.16]])vs(i,t.hair,e*.17,e*c,o*e,l*e,e*.68,h,-1,.24);for(const o of[-1,1]){const l=he(t.hair,e*.12,e*.86,18,6);l.rotation.z=o*.08,Mt(i,l,o*e*.86,-e*.2,e*.28)}}function v_(i,t,e){const n=pe(t.hair,e*1.05,28,20);n.scale.set(1.07,1,.89),Mt(i,n,0,e*.2,-e*.13);const s=pe(t.hair,e*.96,28,20);s.scale.set(1.1,1.02,.94),Mt(i,s,e*.3,e*.72,-e*.96);const r=pe(t.hair,e*.48,24,18);r.scale.set(1.15,.88,1),Mt(i,r,e*.28,e*.42,-e*.78);const a=he(t.hair,e*.26,e*.4,16,6);Mt(i,a,0,e*.1,-e*.54);for(const l of[-1,1]){const c=he(t.hair,e*.115,e*.76,14,5);c.rotation.z=l*.82,Mt(i,c,l*e*.27,e*.43,e*.54);const h=he(t.hair,e*.105,e*.72,14,5);h.rotation.z=l*.05,Mt(i,h,l*e*.82,-e*.17,e*.28)}const o=he(t.hair,e*.075,e*.42,12,4);o.rotation.z=Math.PI/2,Mt(i,o,0,e*.48,e*.58)}function vs(i,t,e,n,s,r,a,o,l,c){const h=new I(o,l,c).normalize(),f=rl(t,e,n);f.quaternion.setFromUnitVectors(new I(0,1,0),h),Mt(i,f,s+h.x*n*.25,r+h.y*n*.25,a+h.z*n*.25)}function y_(i,t,e){const n=pe(t.hair,e*1.08,28,20);n.scale.set(1.12,1.04,.92),Mt(i,n,0,e*.18,-e*.12);const s=pe(t.hair,e*.62,24,18);s.scale.set(1.3,.82,1.02),Mt(i,s,0,e*.04,-e*.73);const r=[[0,.72,.16,.15,.42,1,.04],[-.4,.63,.3,.14,.56,.86,.2],[.42,.64,.3,.14,.56,.86,.2],[-.82,.4,.02,.13,.9,.16,.02],[.82,.4,.02,.13,.9,.16,.02],[-.62,.1,-1.22,.12,.25,.15,-1],[0,.1,-1.28,.14,0,.12,-1],[.62,.1,-1.22,.12,-.25,.15,-1],[-.4,-.12,-1.2,.11,.2,-.12,-.96],[.4,-.12,-1.2,.11,-.2,-.12,-.96],[-.64,.48,.52,.13,-.2,.75,.56],[.64,.48,.52,.13,-.2,.75,.56]];for(const[a,o,l,c,h,f,u]of r)vs(i,t.hair,e*c,e*.7,a*e,o*e,l*e,h,f,u);for(const[a,o,l,c]of[[-.9,.35,-.75,.55],[-.58,.7,-.5,.9],[-.2,.86,-.18,1],[.2,.86,.18,1],[.58,.7,.5,.9],[.9,.35,.75,.55],[-.82,-.1,-.7,-.45],[.82,-.1,.7,-.45]])vs(i,t.hair,e*.21,e*.92,a*e,o*e,-e*1.34,l,c,-.58);for(const[a,o,l,c]of[[-.72,.28,-.65,.55],[-.38,.48,-.35,.82],[0,.56,0,.95],[.38,.48,.35,.82],[.72,.28,.65,.55],[-.72,-.18,-.45,-.35],[.72,-.18,.45,-.35]])vs(i,t.hair,e*.15,e*.62,a*e,o*e,-e*1.18,l,c,-.68);for(const a of[-.55,-.18,.18,.55])vs(i,t.hair,e*.11,e*.34,a*e,e*.48,e*.66,a*.22,-.7,.68)}function M_(i,t,e,n,s){if(e==="mara"?x_(i,t,s):e==="dana"?__(i,t,s):e==="priya"?v_(i,t,s):e==="delinquent"?y_(i,t,s):g_(i,t,n,s),e==="crosby"){const r=pe(t.shirt,s*1.22,24,18);r.scale.set(1.04,.92,1.04),Mt(i,r,0,s*.04,-s*.42)}if(e==="magician"&&(Mt(i,new Dt(new Mi(s*1.25,s*1.25,.08,24),t.accent),0,s*.86,0),Mt(i,rl(t.shirt,s*.65,s),0,s*1.22,0)),e==="worker"){const r=pe(t.accent,s*1.16,24,18);r.scale.set(1.05,.42,1.05),Mt(i,r,0,s*.77,0),Mt(i,hn(t.accent,s*1.35,.06,s*.55),0,s*.67,s*.42)}}function S_(i,t,e){if(t==="mara"||t==="delinquent")Mt(e,he(i.metal,.055,.58,10,3),0,-.18,.12);else if(t==="gunner"||t==="crosby"||t==="beckett"){const n=he(i.metal,.07,.38,10,3);n.rotation.x=Math.PI/2,Mt(e,n,0,.02,.2),Mt(e,hn(i.shoe,.12,.12,.34),0,-.03,-.08)}else t==="magician"?(Mt(e,he(i.metal,.045,.72,10,3),0,-.16,.08),Mt(e,pe(i.accent,.11,14,10),0,.26,.08)):t==="official"?Mt(e,hn(i.white,.25,.32,.04),.04,0,.15):t==="priya"?(Mt(e,hn(i.white,.28,.18,.16),0,0,.1),Mt(e,hn(i.accent,.05,.2,.17),0,0,.19)):t==="hale"?Mt(e,hn(i.accent,.12,.12,.28),0,0,.16):t==="dana"&&Mt(e,he(i.metal,.045,.48,10,3),0,-.1,.12)}function fu(i){let t=0;return i.traverse(e=>{if(e.isMesh){const n=e.geometry;t+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}}),Math.round(t)}function b_(i,t){const e=hu(cu(i,t)),n=new qt,s=new qt,r=new qt,a=new qt,o=new qt,l=new qt,c=new qt,h=new qt,f=new qt,u=t==="f";n.add(s),s.position.y=.64;for(const[g,p]of[[c,-.16],[h,.16]]){g.position.x=p,Mt(g,he(e.pants,.115,u?.31:.34),0,-.16,0),Mt(g,he(e.pants,.1,.22),0,-.41,0);const M=he(e.shoe,.12,.16);M.scale.set(1,.55,1.45),Mt(g,M,0,-.59,.08),s.add(g)}Mt(s,he(e.pants,.27,.12,14,4),0,-.02,0),s.add(r),r.position.y=.03;const d=he(e.shirt,u?.285:.31,.34,14,5);d.scale.z=u?.76:.82,Mt(r,d,0,.26,0),(i==="priya"||i==="official")&&Mt(r,hn(e.accent,.06,.26,.035),0,.28,.255),i==="worker"&&Mt(r,hn(e.accent,.38,.27,.05),0,.25,.25),i==="boxer"&&(Mt(r,hn(e.accent,.25,.16,.04),-.22,.19,.24),Mt(r,hn(e.accent,.25,.16,.04),.22,.19,.24));for(const[g,p]of[[o,-.39],[l,.39]])g.position.set(p,.43,0),Mt(g,he(e.shirt,.105,.2),0,-.11,0),Mt(g,he(e.skin,.09,.19),0,-.32,0),Mt(g,pe(e.skin,.1,12,8),0,-.46,0),i==="boxer"&&Mt(g,pe(e.accent,.14,14,10),0,-.49,.02),r.add(g);l.add(f),f.position.set(0,-.44,.13),S_(e,i,f),r.add(a),a.position.y=.76;const m=u?.36:.34;Mt(a,pe(e.skin,m,20,14),0,0,0),m_(a,e,i,t,m),M_(a,e,i,t,m);const x=new qt;return x.add(n),n.position.y=.08,{root:x,hip:s,torso:r,head:a,armL:o,armR:l,legL:c,legR:h,weap:f,tris:fu(x)}}function T_(){const i=hu(cu("wolverine","m")),t=new qt,e=new qt,n=new qt,s=new qt,r=new qt,a=new qt,o=new qt,l=new qt,c=new qt;t.add(e),e.position.y=.44;const h=he(i.shirt,.38,.52,16,5);h.rotation.z=Math.PI/2,Mt(e,h,0,.18,.02),e.add(n),n.position.set(0,.38,.2),n.add(s),Mt(s,pe(i.skin,.31,18,12),0,.1,.31),Mt(s,pe(i.shadow,.22,14,10),0,.02,.57),Er(s,i,-.1,.16,.58),Er(s,i,.1,.16,.58);for(const u of[-.2,.2])Mt(s,rl(i.hair,.12,.28),u,.38,.25);for(const[u,d,m]of[[o,-.22,.28],[l,.22,.28],[r,-.22,-.28],[a,.22,-.28]])u.position.set(d,0,m),Mt(u,he(i.pants,.12,.28),0,-.12,0),e.add(u);const f=he(i.hair,.07,.4,10,3);return f.rotation.x=-.35,Mt(e,f,0,.18,-.55),a.add(c),{root:t,hip:e,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:fu(t)}}const Gc=new Map;function du(i,t){const e=`${i}:${t}`,n=Gc.get(e);if(n)return n;const s={parts:i==="mara"?u_():i==="wolverine"?T_():b_(i,t)};return Gc.set(e,s),s}function E_(i,t,e,n,s){const{hip:r,torso:a,head:o,armL:l,armR:c,legL:h,legR:f,weap:u}=i;for(const m of[r,a,o,l,c,h,f,u])m.rotation.set(0,0,0);if(r.position.y=t==="wolverine"?.44:.64,a.position.y=t==="wolverine"?.38:.03,e==="idle"){const m=Math.sin(s/420)*.025;a.position.y+=m,o.rotation.z=Math.sin(s/900)*.035,l.rotation.x=.06+m,c.rotation.x=.06-m;return}if(e==="walk"){const m=Math.sin(n*Math.PI*2),x=Math.cos(n*Math.PI*2);h.rotation.x=m*.5,f.rotation.x=-m*.5,l.rotation.x=-m*.38,c.rotation.x=m*.38,a.position.y+=Math.abs(x)*.035,r.position.y+=Math.abs(m)*.018;return}if(e==="attack"){const m=n<.62;t==="wolverine"?(a.rotation.x=m?-.28:0,l.rotation.x=m?-.75:.15,c.rotation.x=m?-.75:.15,r.position.z=m?.14:0):t==="boxer"?(c.rotation.x=n<.35?-.35:m?-1.35:-.25,c.rotation.z=m?-.28:0,a.rotation.y=m?-.22:0,l.rotation.x=-.55):(c.rotation.x=n<.35?-.45:m?-1.35:-.35,c.rotation.z=m?-.32:0,u.rotation.x=m?-.45:0,a.rotation.y=m?-.16:0,l.rotation.x=-.25);return}const d=n<.66;l.rotation.x=d?-2:-1.25,c.rotation.x=d?-2:-1.25,l.rotation.z=.36,c.rotation.z=-.36,o.rotation.x=d?-.12:0,a.position.y+=d?.05:.015}let Un=null,xi=null,Mn=null,_i=null,Vc=!1,vn=null;function w_(i){vn||(vn=document.createElement("canvas")),(vn.width!==i.width||vn.height!==i.height)&&(vn.width=i.width,vn.height=i.height);const t=vn.getContext("2d");return t&&(t.setTransform(1,0,0,1,0,0),t.globalAlpha=1,t.globalCompositeOperation="source-over",t.clearRect(0,0,vn.width,vn.height),t.drawImage(i,0,0)),vn}let jn=null;function A_(i,t){jn||(jn=document.createElement("canvas"));const e=Math.max(2,Math.ceil(i)),n=Math.max(2,Math.ceil(t));(jn.width!==e||jn.height!==n)&&(jn.width=e,jn.height=n);const s=jn.getContext("2d");return s&&(s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,e,n),s.fillStyle="#6a7080",s.beginPath(),s.ellipse(e/2,n*.53,Math.max(1,e*.22),Math.max(1,n*.35),0,0,Math.PI*2),s.fill()),jn}function pu(){if(Vc&&Un)return!0;if(typeof document>"u")return!1;try{const i=document.createElement("canvas");Un=new jx({canvas:i,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"}),Un.setSize(192,240,!1),Un.setPixelRatio(1),Un.setClearColor(0,0),Un.outputColorSpace=Ze,xi=new nd;const t=192/240;Mn=new Pr(-1.35*t,1.35*t,1.35,-1.35,.1,40),_i=new qt,xi.add(_i),xi.add(new jd(16774111,2238532,1.35));const e=new uc(16771015,1.7);e.position.set(3.5,6,4.5),xi.add(e);const n=new uc(9680383,.65);return n.position.set(-4,2,-3),xi.add(n),Vc=!0,!0}catch{return!1}}const Wc=30;function Xc(i,t){if(!Mn)return;const e=t*Math.PI/180,n=4.2,s=Math.cos(e),r=Math.sin(e);Mn.position.set(Math.sin(i)*s*n,r*n+.85,Math.cos(i)*s*n),Mn.lookAt(0,.88,0),Mn.updateProjectionMatrix(),Mn.updateMatrixWorld()}function qc(){return Mn?(1-new I(0,0,0).project(Mn).y)/2:.88}let Aa=-1;function R_(i){const t=Ts(i);return Math.atan2(t.x,t.y)}function C_(i){return Math.PI/4-i}function P_(i,t,e,n,s,r=0,a=Wc){const o=t(0,0,0),l=uu(s)*(e.role==="elite"?1.12:1),c=l*192/240,h=o.x-c*.5;let f=o.y-l*.88;if(!pu()||!Un||!xi||!Mn||!_i){const x=A_(c,l);return i.save(),i.drawImage(x,h,f,c,l),i.restore(),{source:x,x:h,y:f,w:c,h:l}}Aa<0&&(Xc(0,Wc),Aa=qc());const u=du(e.archetype,e.gender),d=d_(e,n);for(E_(u.parts,e.archetype,d.clip,d.t,n);_i.children.length;)_i.remove(_i.children[0]);u.parts.root.parent&&u.parts.root.parent.remove(u.parts.root),_i.add(u.parts.root),u.parts.root.rotation.set(0,R_(e.dir),0),Xc(C_(r),a),f+=(Aa-qc())*l,Un.render(xi,Mn);const m=w_(Un.domElement);return i.save(),i.imageSmoothingEnabled=!0,i.drawImage(m,h,f,c,l),i.restore(),{source:m,x:h,y:f,w:c,h:l}}function L_(){if(!pu())return;const i=["mara","dana","priya","hale","crosby","beckett","delinquent","magician","wolverine","boxer","gunner","worker","official"];for(const t of i)for(const e of["f","m"])du(t,e)}const Fo=64,I_=24,D_=8,U_=15,N_=75,bs=30,Ra=.4,F_=1.8,O_=12;function Yc(i){return Math.min(N_,Math.max(U_,i))}function k_(i,t,e,n,s){return{x:(i-t)*(Fo/2),y:(i+t)*(n/2)-e*s}}function $c(i,t,e,n,s,r,a,o){const l=a-e,c=o-n,h=s-e,f=r-n,u=i-e,d=t-n,m=l*l+c*c,x=l*h+c*f,g=l*u+c*d,p=h*h+f*f,M=h*u+f*d,T=m*p-x*x;if(Math.abs(T)<1e-8)return!1;const y=1/T,w=(p*g-x*M)*y,b=(m*M-x*g)*y;return w>=-.02&&b>=-.02&&w+b<=1.02}function mu(i,t,e,n,s,r){return $c(i,t,e.x,e.y,n.x,n.y,s.x,s.y)||$c(i,t,e.x,e.y,s.x,s.y,r.x,r.y)}function Ca(i,t){return i.x<t.x+t.w&&i.x+i.w>t.x&&i.y<t.y+t.h&&i.y+i.h>t.y}function Kc(i,t){const e=Math.min(i.x+i.w,t.x+t.w)-Math.max(i.x,t.x),n=Math.min(i.y+i.h,t.y+t.h)-Math.max(i.y,t.y);return e<=0||n<=0?0:e*n}function Pa(i,t,e){return i.x+i.w+e<=t.x||t.x+t.w+e<=i.x||i.y+i.h+e<=t.y||t.y+t.h+e<=i.y}function gu(i,t,e){return t>=i.x&&t<=i.x+i.w&&e>=i.y&&e<=i.y+i.h}function Zc(i,t){const e=new Uint8Array(t),n=Math.min(t,i.length>>2);for(let s=0,r=0;s<n;s++,r+=4)e[s]=i[r+3];return e}function B_(i,t,e,n){const s=t.x-i.x,r=t.y-i.y,a=n.x-e.x,o=n.y-e.y,l=s*o-r*a;if(Math.abs(l)<1e-8)return!1;const c=((e.x-i.x)*o-(e.y-i.y)*a)/l,h=((e.x-i.x)*r-(e.y-i.y)*s)/l;return c>=-1e-4&&c<=1+1e-4&&h>=-1e-4&&h<=1+1e-4}function Jc(i,t){let e=1/0,n=1/0,s=-1/0,r=-1/0;for(const o of i)o.x<e&&(e=o.x),o.y<n&&(n=o.y),o.x>s&&(s=o.x),o.y>r&&(r=o.y);if(s<t.x||e>t.x+t.w||r<t.y||n>t.y+t.h)return!1;const a=[{x:t.x,y:t.y},{x:t.x+t.w,y:t.y},{x:t.x+t.w,y:t.y+t.h},{x:t.x,y:t.y+t.h}];for(const o of a)if(mu(o.x,o.y,i[0],i[1],i[2],i[3]))return!0;for(const o of i)if(gu(t,o.x,o.y))return!0;for(let o=0;o<4;o++){const l=i[o],c=i[(o+1)%4];for(let h=0;h<4;h++)if(B_(l,c,a[h],a[(h+1)%4]))return!0}return!1}function on(i,t,e){return{x:i.x+(t.x-i.x)*e,y:i.y+(t.y-i.y)*e}}function ue(i){const t=Math.sin(i*12.9898)*43758.5453;return t-Math.floor(t)}function Yi(i,t){if(!(t>0))return 0;const e=i%t;return e<0?e+t:e}const Qc=4096,H_={},Oo={roof:{sky:["#2a1c12","#1a2830","#10161c"],glow:["rgba(42, 28, 18, 0)","rgba(200, 130, 55, 0.10)","rgba(40, 110, 120, 0.18)"],body:"rgba(7, 12, 18, 0.82)",win:"rgba(255, 196, 120, 0.72)",winAlt:"rgba(120, 220, 210, 0.66)",water0:"rgba(8, 22, 28, 0.30)",water1:"rgba(2, 3, 6, 0.97)",fog:"rgba(150, 180, 185, 0.07)",seed:101,gap0:6,gap1:12,bw0:28,bw1:40,bh0:.22,bh1:.3,winAt:.84,craneAt:.78,gantryAt:1,step:!1,sign:!1,tower:!1},alley:{sky:["#1c100a","#140c0a","#0c0908"],glow:["rgba(40, 18, 8, 0)","rgba(220, 110, 30, 0.09)","rgba(150, 60, 16, 0.16)"],body:"rgba(14, 7, 4, 0.84)",win:"rgba(255, 176, 70, 0.78)",water0:"rgba(20, 10, 6, 0.30)",water1:"rgba(3, 2, 2, 0.97)",fog:"rgba(190, 140, 80, 0.06)",seed:211,gap0:3,gap1:6,bw0:16,bw1:18,bh0:.58,bh1:.34,winAt:.88,craneAt:1,gantryAt:1,step:!0,sign:!1,tower:!1},warehouse:{sky:["#101820","#141c26","#0c1218"],glow:["rgba(16, 28, 40, 0)","rgba(130, 160, 180, 0.08)","rgba(60, 90, 112, 0.15)"],body:"rgba(7, 12, 18, 0.84)",win:"rgba(186, 220, 235, 0.62)",water0:"rgba(10, 16, 24, 0.32)",water1:"rgba(2, 3, 6, 0.97)",fog:"rgba(150, 175, 190, 0.065)",seed:307,gap0:16,gap1:22,bw0:70,bw1:80,bh0:.16,bh1:.18,winAt:.9,craneAt:.62,gantryAt:.38,step:!1,sign:!1,tower:!1},street:{sky:["#1a1018","#140e16","#0e0a12"],glow:["rgba(36, 10, 28, 0)","rgba(190, 40, 130, 0.08)","rgba(100, 30, 80, 0.14)"],body:"rgba(12, 6, 14, 0.82)",win:"rgba(255, 90, 180, 0.75)",water0:"rgba(18, 8, 16, 0.30)",water1:"rgba(3, 2, 4, 0.97)",fog:"rgba(190, 140, 175, 0.06)",seed:409,gap0:8,gap1:14,bw0:32,bw1:40,bh0:.32,bh1:.34,winAt:.74,craneAt:1,gantryAt:1,step:!0,sign:!0,tower:!1},plaza:{sky:["#10181c","#14161e","#10141a"],glow:["rgba(12, 32, 36, 0)","rgba(50, 150, 155, 0.08)","rgba(90, 60, 150, 0.13)"],body:"rgba(8, 10, 18, 0.8)",win:"rgba(150, 235, 220, 0.68)",winAlt:"rgba(190, 150, 235, 0.64)",water0:"rgba(8, 16, 24, 0.30)",water1:"rgba(2, 3, 6, 0.97)",fog:"rgba(150, 170, 190, 0.06)",seed:521,gap0:28,gap1:48,bw0:100,bw1:90,bh0:.12,bh1:.16,winAt:.9,craneAt:1,gantryAt:1,step:!1,sign:!1,tower:!0}};function Qe(i,t,e,n,s,r){if(n<=0||s<=0||r<=0)return;const a=Yi(t,r);i.fillRect(a,e,n,s),a+n>r&&i.fillRect(a-r,e,n,s)}function z_(i,t,e,n,s,r){const a=e-n;Qe(i,t,a,2.5,n,r),Qe(i,t-s*.22,a,s,2,r),Qe(i,t+s*.42,a,1.6,n*.42,r)}function G_(i,t,e,n,s,r){const a=e-s,o=t+n*.16,l=t+n*.74;Qe(i,o,a,3,s,r),Qe(i,l,a,3,s,r),Qe(i,o,a,Math.max(3,l-o),2.5,r)}function jc(i,t,e,n,s,r,a){i.fillStyle=t.body;let o=0,l=0;const c=a?1.7:1;for(;o<e&&l<700;){const h=ue(s+l*19.17),f=ue(s+l*7.31+2),u=(t.gap0+h*t.gap1)*c,d=(t.bw0+f*t.bw1)*(a?1.15:1),m=n*(t.bh0+ue(s+l*3.1)*t.bh1)*r,x=n-m;if(Qe(i,o,x,d,m,e),!a&&t.step&&ue(s+l*11.2)>.42){const g=d*.18,p=Math.max(3,m*.14);Qe(i,o+g,x-p,Math.max(2,d-g*2),p+1,e)}if(!a&&t.craneAt<1&&ue(s+l*13.7)>t.craneAt&&z_(i,o+d*.62,x,n*(.16+h*.18),d*1.25,e),!a&&t.gantryAt<1&&ue(s+l*15.1)>t.gantryAt&&G_(i,o,x,d,n*(.2+f*.18),e),!a&&t.sign&&ue(s+l*17.7)>.86&&(i.fillStyle=t.win,Qe(i,o+d*.12,x+m*.14,d*.46,Math.max(2,m*.04),e),i.fillStyle=t.body),!a&&ue(s+l*23.9)>t.winAt){const g=!!t.winAlt&&ue(s+l*4.4)>.8;i.fillStyle=g&&t.winAlt?t.winAlt:t.win;const p=1+Math.floor(ue(s+l*8.2)*3);for(let M=0;M<p;M++){if(ue(s+l*50+M*3)<.28)continue;const T=o+d*(.2+ue(s+l*9+M)*.55),y=x+m*(.16+ue(s+l*6+M)*.55);Qe(i,T,y,Math.max(2,d*.05),Math.max(3,m*.04),e)}i.fillStyle=t.body}o+=d+u,l++}}function V_(i,t,e,n){const s=Oo[t],r=i.createLinearGradient(0,0,0,n);if(r.addColorStop(0,s.glow[0]),r.addColorStop(.58,s.glow[1]),r.addColorStop(1,s.glow[2]),i.fillStyle=r,i.fillRect(0,0,e,n),i.save(),i.globalAlpha=.45,jc(i,s,e,n,s.seed+80,.62,!0),i.restore(),jc(i,s,e,n,s.seed,1,!1),!s.tower)return;i.fillStyle=s.body;const a=e*.64,o=36,l=n*.8;Qe(i,a,n-l,o,l,e),Qe(i,a+o*.4,n-l-n*.07,5,n*.09,e),i.fillStyle=s.win;for(let c=0;c<5;c++)ue(s.seed+90+c)<.28||Qe(i,a+12,n-l*(.18+c*.14),4,3,e)}function W_(i){return i instanceof HTMLCanvasElement?{w:i.width,h:i.height}:{w:i.naturalWidth,h:i.naturalHeight}}const xu=1.12,X_=2,ar=12.2,or=5.4,ms=1,th=.5,q_=.7,Y_=40,$_=2,eh=1.15,K_=.45,Z_=.55,J_=.8,nh=.45,Q_=.35,j_=.78,tv="saturate(0.55) brightness(0.8)",Xi=1,ih=24,sh=20,ev=8,_u=["mara","dana","priya"],nv={mara:[["front",!1],["nw",!1],["left",!1],["se",!1],["back",!1],["sw",!1],["right",!1],["ne",!1]],dana:[["front",!1],["ne",!1],["left",!1],["sw",!0],["back",!1],["se",!1],["right",!1],["nw",!1]],priya:[["doll",!1],["doll",!1],["doll",!1],["doll",!1],["doll",!1],["doll",!0],["doll",!0],["doll",!0]]},qi=8;function iv(i){return _u.includes(i)}function rh(i){return i.complete&&i.naturalWidth>0&&i.naturalHeight>0}const sv=24,Dr=new WeakMap;function vu(i,t,e){let n=t,s=e,r=0,a=0;for(let o=0;o<e;o++){const l=o*t*4;for(let c=0;c<t;c++)i[l+c*4+3]<sv||(c<n&&(n=c),o<s&&(s=o),c+1>r&&(r=c+1),o+1>a&&(a=o+1))}return r>n&&a>s?{x0:n,y0:s,x1:r,y1:a}:null}function lr(i){const t=i.naturalWidth,e=i.naturalHeight;if(!(t>0&&e>0)||typeof document>"u")return null;const n=document.createElement("canvas");n.width=t,n.height=e;const s=n.getContext("2d",{willReadFrequently:!0});if(!s)return null;let r=null;try{s.drawImage(i,0,0),r=vu(s.getImageData(0,0,t,e).data,t,e)}catch{r=null}return Dr.set(i,r),r}function rv(i,t,e,n,s,r){const a={x:t,y:e,w:n,h:s},o=Dr.get(i),l=i.naturalWidth,c=i.naturalHeight;if(!o||!(l>0)||!(c>0)||!(n>0)||!(s>0))return a;const h=o.x0/l*n,f=o.x1/l*n,u=o.y0/c*s,d=o.y1/c*s;return{x:r?t+n-f:t+h,y:e+u,w:f-h,h:d-u}}const La=9;function av(i){if(i.dataset.keyed||typeof document>"u")return;i.dataset.keyed="1";const t=i.naturalWidth,e=i.naturalHeight;if(!(t>2&&e>2))return;const n=document.createElement("canvas");n.width=t,n.height=e;const s=n.getContext("2d",{willReadFrequently:!0});if(!s)return;s.drawImage(i,0,0);let r;try{r=s.getImageData(0,0,t,e)}catch{return}const a=r.data;if(a[3]<250&&a[(t*e-1)*4+3]<250)return;const o=[[],[],[]],l=d=>{for(let m=0;m<3;m++)o[m].push(a[d*4+m])};for(let d=0;d<t;d++)l(d),l((e-1)*t+d);for(let d=0;d<e;d++)l(d*t),l(d*t+t-1);const c=o.map(d=>d.sort((m,x)=>m-x)[d.length>>1]),h=d=>Math.abs(a[d*4]-c[0])<=La&&Math.abs(a[d*4+1]-c[1])<=La&&Math.abs(a[d*4+2]-c[2])<=La,f=new Uint8Array(t*e),u=[];for(let d=0;d<t;d++)u.push(d,(e-1)*t+d);for(let d=0;d<e;d++)u.push(d*t,d*t+t-1);for(;u.length;){const d=u.pop();if(f[d]||!h(d))continue;f[d]=1,a[d*4+3]=0;const m=d%t;m>0&&u.push(d-1),m<t-1&&u.push(d+1),d>=t&&u.push(d-t),d<t*(e-1)&&u.push(d+t)}s.putImageData(r,0,0),Dr.set(i,vu(a,t,e)),i.src=n.toDataURL("image/png")}function Ia(i,t){return uu(i)*(t?xu:1)}function ov(i){if(i.length!==7||i.charCodeAt(0)!==35)return i;const t=Number.parseInt(i.slice(1),16);if(!Number.isFinite(t))return i;const e=o=>Math.round(o*.72+150*.28),n=e(t>>16&255),s=e(t>>8&255),r=e(t&255),a=o=>o.toString(16).padStart(2,"0");return`#${a(n)}${a(s)}${a(r)}`}class lv{constructor(t){F(this,"canvas");F(this,"ctx");F(this,"cam",{x:-224,y:180,zoom:.7});F(this,"w",390);F(this,"h",700);F(this,"time",0);F(this,"yaw",0);F(this,"pitch",bs);F(this,"mapW",10);F(this,"mapH",12);F(this,"boardMap",null);F(this,"kingsWharf",new Image);F(this,"legacyPlate",!0);F(this,"skylineCache",new Map);F(this,"skylineArt",new Map);F(this,"skylineCacheH",-1);F(this,"skylineSlide",0);F(this,"skylineSlideAt",0);F(this,"skylineSlideSpan",0);F(this,"skylineSlideReady",!1);F(this,"hero8",{mara:{kind:"loading"},dana:{kind:"loading"},priya:{kind:"loading"}});F(this,"mapDolls",{mara:new Image,dana:new Image,priya:new Image});F(this,"maraAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});F(this,"danaAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});F(this,"bodyStamps",new Map);F(this,"alphaMasks",new WeakMap);F(this,"sourceRev",new WeakMap);F(this,"alphaReadCanvas",null);F(this,"alphaReadCtx",null);F(this,"rigSnaps",new Map);F(this,"ghostCanvas",null);F(this,"ghostCtx",null);F(this,"overlayCanvas",null);F(this,"overlayCtx",null);F(this,"maskCanvas",null);F(this,"maskCtx",null);F(this,"labelRects",[]);F(this,"hover",null);F(this,"pointerX",0);F(this,"pointerY",0);F(this,"pointerInside",!1);F(this,"placedCount",0);F(this,"statusCount",0);F(this,"overlayCount",0);F(this,"labelPool",[]);F(this,"labelOrder",[]);F(this,"placedRects",[]);F(this,"statusRects",[]);F(this,"statusMarks",[]);F(this,"labelHold",new Map);F(this,"labelSeen",new Set);this.canvas=t;const e=t.getContext("2d");if(!e)throw new Error("canvas");this.ctx=e,this.kingsWharf.decoding="async",this.kingsWharf.src="./sprites/scene-kings-wharf.png",location.search.includes("bgslot")&&(this.legacyPlate=!1);for(const[n,s]of Object.entries(this.mapDolls))s.decoding="async",s.addEventListener("load",()=>lr(s)),s.src=`./sprites/${n}.png`;for(const[n,s]of Object.entries(this.maraAngles))s.decoding="async",s.addEventListener("load",()=>lr(s)),s.src=`./sprites/mara-${n}.png`;for(const[n,s]of Object.entries(this.danaAngles))s.decoding="async",s.addEventListener("load",()=>{const r=s.src;av(s),!(s.src!==r||Dr.has(s))&&lr(s)}),s.src=`./sprites/dana-${n}.png`;for(const n of _u)this.loadHero8(n);this.resize(),this.trackCanvasPointer()}tileH(){return Fo*Math.sin(this.pitch*Math.PI/180)}blockH(){const t=Math.cos(bs*Math.PI/180);return I_*Math.cos(this.pitch*Math.PI/180)/t}baseH(){const t=Math.cos(bs*Math.PI/180);return D_*Math.cos(this.pitch*Math.PI/180)/t}addPitch(t){this.pitch=Yc(this.pitch+t*.16)}setPitch(t){this.pitch=Yc(t)}resize(){const t=Math.min(window.devicePixelRatio||1,2),e=this.canvas.getBoundingClientRect();this.w=Math.max(1,e.width),this.h=Math.max(1,e.height),this.canvas.width=Math.floor(this.w*t),this.canvas.height=Math.floor(this.h*t),this.ctx.setTransform(t,0,0,t,0,0)}forceSize(t,e){const n=Math.min(window.devicePixelRatio||1,2);this.w=t,this.h=e,this.canvas.style.width=`${t}px`,this.canvas.style.height=`${e}px`,this.canvas.width=Math.floor(t*n),this.canvas.height=Math.floor(e*n),this.ctx.setTransform(n,0,0,n,0,0)}syncMap(t){this.mapW=t.w,this.mapH=t.h,this.boardMap=t}isoOf(t,e,n=0){const s=kr(t,e,this.yaw,this.mapW,this.mapH);return k_(s.x,s.y,n,this.tileH(),this.blockH())}worldToScreen(t,e,n=0){const s=this.isoOf(t,e,n);return{x:(s.x-this.cam.x)*this.cam.zoom+this.w/2,y:(s.y-this.cam.y)*this.cam.zoom+this.h/2}}topCorners(t,e,n){return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([r,a])=>this.worldToScreen(t+r,e+a,n))}topMetrics(t,e,n){const s=this.topCorners(t,e,n);let r=0,a=0;for(const c of s)r+=c.x,a+=c.y;r/=4,a/=4;let o=0,l=0;for(const c of s)o=Math.max(o,Math.abs(c.x-r)),l=Math.max(l,Math.abs(c.y-a));return{cx:r,cy:a,hw:o,hh:l,drop:(this.baseH()+n*this.blockH())*this.cam.zoom,top:s}}frontFaces(t,e){const n=[];for(let s=0;s<4;s++){const r=t[s],a=t[(s+1)%4],o={x:a.x,y:a.y+e},l={x:r.x,y:r.y+e};n.push({pts:[r,a,o,l],y:(r.y+a.y+o.y+l.y)/4})}return n.sort((s,r)=>s.y-r.y),n.slice(-2).map(s=>s.pts)}screenToGrid(t,e){const n=this.cam.x+(t-this.w/2)/this.cam.zoom,s=this.cam.y+(e-this.h/2)/this.cam.zoom,r=Fo/2,a=this.tileH()/2,o=(n/r+s/a)/2,l=(s/a-n/r)/2,c=Math.cos(this.yaw),h=Math.sin(this.yaw),f=o*c-l*h,u=o*h+l*c;return{x:f+(this.mapW-1)/2,y:u+(this.mapH-1)/2}}lockGridToScreen(t,e,n,s,r){const a=this.isoOf(t,e,n);this.cam.x=a.x-(s-this.w/2)/this.cam.zoom,this.cam.y=a.y-(r-this.h/2)/this.cam.zoom}cellsInDrawOrder(t){const e=[];for(let n=0;n<t.h;n++)for(let s=0;s<t.w;s++)e.push({x:s,y:n});return e.sort((n,s)=>{const r=this.worldToScreen(n.x,n.y,0),a=this.worldToScreen(s.x,s.y,0);return this.cmpScreenDepth(r.y,r.x,n.y,n.x,a.y,a.x,s.y,s.x)}),e}cmpScreenDepth(t,e,n,s,r,a,o,l){const c=t-r;if(Math.abs(c)>.05)return c;const h=e-a;return Math.abs(h)>.05?h:n!==o?n-o:s-l}orderUnits(t,e){t.sort((n,s)=>{const r=this.unitPose(n,e),a=this.unitPose(s,e),o=r.feetY-a.feetY;if(Math.abs(o)>.05)return o;const l=r.x-a.x;return Math.abs(l)>.05?l:n.id<s.id?-1:n.id>s.id?1:0})}hitTile(t,e,n){this.syncMap(n);const s=[];for(let r=0;r<n.h;r++)for(let a=0;a<n.w;a++)s.push({x:a,y:r});s.sort((r,a)=>{const o=this.worldToScreen(r.x,r.y,0),l=this.worldToScreen(a.x,a.y,0);return this.cmpScreenDepth(l.y,l.x,a.y,a.x,o.y,o.x,r.y,r.x)});for(const r of s){const a=n.tiles[r.y][r.x];if(this.hitTop(t,e,a.x,a.y,a.h))return{x:r.x,y:r.y}}return null}tileAtScreen(t,e,n){const s=this.canvas.getBoundingClientRect();return this.hitTile(t-s.left,e-s.top,n)}screenOfTile(t,e,n){this.syncMap(n);const s=n.tile(t,e),r=this.worldToScreen(t,e,s?s.h:0),a=this.canvas.getBoundingClientRect();return{x:r.x+a.left,y:r.y+a.top}}hitUnit(t,e,n,s){this.syncMap(n);const r=new Map;for(const o of s){if(o.dead)continue;const l=Ft(o.x,o.y),c=r.get(l);c?c.push(o):r.set(l,[o])}const a=[];for(const o of this.cellsInDrawOrder(n)){const l=r.get(Ft(o.x,o.y));if(l){this.orderUnits(l,n);for(const c of l)a.push(c)}}return this.pickDrawnUnit(t,e,a,n)}pickDrawnUnit(t,e,n,s){let r=null;for(let a=n.length-1;a>=0;a--){const o=this.unitContainsPoint(t,e,n[a],s);if(o==="alpha")return n[a];o==="feet"&&r==null&&(r=n[a])}return r}unitContainsPoint(t,e,n,s){return this.unitAlphaHit(t,e,n,s)?"alpha":this.unitRingHit(t,e,n,s)||this.unitLowerBodyHit(t,e,n,s)?"feet":null}unitAlphaHit(t,e,n,s){const r=this.bodyStamps.get(n.id);if(r&&r.fig.w>0&&r.fig.h>0){if(t<r.fig.x||e<r.fig.y||t>r.fig.x+r.fig.w||e>r.fig.y+r.fig.h)return!1;const a=this.stampPixelHit(r,t,e);if(a!=null)return a}return gu(this.unitBodyRect(n,this.unitPose(n,s)),t,e)}unitRingHit(t,e,n,s){const r=this.unitPose(n,s),a=ar*r.scale*eh,o=or*r.scale*eh;if(a<=0||o<=0)return!1;const l=(t-r.x)/a,c=(e-(r.feetY+ms*r.z))/o;return l*l+c*c<=1}unitLowerBodyHit(t,e,n,s){const r=this.bodyStamps.get(n.id);if(!r||!(r.fig.w>0)||!(r.fig.h>0))return!1;const a=this.unitPose(n,s),o=Math.max(r.fig.w*Z_,2*ar*a.scale*J_),l=a.x-o/2,c=r.fig.y+r.fig.h*K_,h=a.feetY+ms*a.z+or*a.scale;return t>=l&&t<=l+o&&e>=c&&e<=h}unitBodyRect(t,e){const n=this.bodyStamps.get(t.id);if(n&&n.fig.w>0&&n.fig.h>0){const r=n.fig.w*q_;return{x:n.fig.x+(n.fig.w-r)/2,y:n.fig.y,w:r,h:n.fig.h}}const s=e.dh*th;return{x:e.x-s/2,y:e.feetY-e.dh,w:s,h:e.dh}}stampPixelHit(t,e,n){const s=this.alphaMask(t);if(!s)return null;const r=$_,a=r*r;for(let o=-r;o<=r;o++)for(let l=-r;l<=r;l++)if(!(l*l+o*o>a)&&this.stampAlpha(t,s,e+l,n+o)>Y_)return!0;return!1}stampAlpha(t,e,n,s){let r=n-t.dx;const a=s-t.dy;if(r<0||a<0||r>=t.dw||a>=t.dh)return 0;t.mirror&&(r=t.dw-r);const o=Math.min(e.w-1,Math.floor(r/t.dw*e.w)),l=Math.min(e.h-1,Math.floor(a/t.dh*e.h));return o<0||l<0?0:e.alpha[l*e.w+o]}alphaMask(t){const e=t.source,n=Math.round(t.sw),s=Math.round(t.sh);if(!(n>0)||!(s>0))return null;const r=this.sourceRev.get(e)??0,a=e instanceof HTMLImageElement?`${e.src}:${e.naturalWidth}x${e.naturalHeight}`:`${n}x${s}`,o=this.alphaMasks.get(e);if(o&&o.rev===r&&o.w===n&&o.h===s&&o.sig===a)return o.ok?o:null;const l=this.readAlpha(e,n,s),c={w:n,h:s,alpha:l??new Uint8Array(0),rev:r,sig:a,ok:l!=null};return this.alphaMasks.set(e,c),c.ok?c:null}readAlpha(t,e,n){try{if(t instanceof HTMLCanvasElement){const a=t.getContext("2d");if(a&&t.width>=e&&t.height>=n)return Zc(a.getImageData(0,0,e,n).data,e*n)}const s=this.alphaReader(),r=this.alphaReadCanvas;return!s||!r?null:((r.width!==e||r.height!==n)&&(r.width=e,r.height=n),s.setTransform(1,0,0,1,0,0),s.globalAlpha=1,s.globalCompositeOperation="source-over",s.clearRect(0,0,e,n),s.drawImage(t,0,0,e,n),Zc(s.getImageData(0,0,e,n).data,e*n))}catch{return null}}alphaReader(){return(!this.alphaReadCanvas||!this.alphaReadCtx)&&(this.alphaReadCanvas=document.createElement("canvas"),this.alphaReadCtx=this.alphaReadCanvas.getContext("2d",{willReadFrequently:!0})),this.alphaReadCtx}hitTop(t,e,n,s,r){const a=this.topCorners(n,s,r);return mu(t,e,a[0],a[1],a[2],a[3])}rotate(t){if(this.syncMap(t),this.boardFits(t)){this.yaw=Tl(this.yaw);const n=this.boardBounds(t);if(!n)return;this.cam.x=(n.minX+n.maxX)/2,this.cam.y=(n.minY+n.maxY)/2;return}const e=this.screenToGrid(this.w/2,this.h/2);this.yaw=Tl(this.yaw),this.lockGridToScreen(e.x,e.y,0,this.w/2,this.h/2)}centerOn(t,e){this.syncMap(e);const n=t.filter(a=>!a.dead&&a.team==="player"&&!a.npc);if(!n.length)return;let s=0,r=0;for(const a of n){const o=this.isoOf(a.x,a.y,e.heightAt(a.x,a.y));s+=o.x,r+=o.y}this.cam.x=s/n.length,this.cam.y=r/n.length-52,this.cam.zoom=.7}boardBounds(t){const e=this.cam.zoom>1e-4?this.cam.zoom:1,n=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]];let s=1/0,r=1/0,a=-1/0,o=-1/0;for(let l=0;l<t.h;l++)for(let c=0;c<t.w;c++){const h=t.tiles[l][c],f=this.topMetrics(h.x,h.y,h.h).drop/e;for(const[u,d]of n){const m=this.isoOf(h.x+u,h.y+d,h.h);m.x<s&&(s=m.x),m.y<r&&(r=m.y),m.x>a&&(a=m.x),m.y>o&&(o=m.y);const x=m.y+f;x>o&&(o=x)}}return!(a>s)||!(o>r)?null:{minX:s,minY:r,maxX:a,maxY:o}}boardFits(t,e=!1){this.syncMap(t);const n=this.boardBounds(t);if(!n)return!0;const s=this.cam.zoom,r=(n.minX-this.cam.x)*s+this.w/2,a=(n.maxX-this.cam.x)*s+this.w/2,o=(n.minY-this.cam.y)*s+this.h/2,l=(n.maxY-this.cam.y)*s+this.h/2,c=4;return r<c||a>this.w-c?!1:e||o>=c&&l<=this.h-c}maxZoom(){const t=.5*this.h/Ia(1,!1);return Math.min(O_,Math.max(F_,t))}fitZoom(){const t=this.boardMap;if(!t)return null;const e=this.cam.zoom;e>1e-4||(this.cam.zoom=1);const n=this.boardBounds(t);return e>1e-4||(this.cam.zoom=e),n?this.zoomForBounds(n):null}zoomForBounds(t){const e=t.maxX-t.minX,n=t.maxY-t.minY,s=Math.min(this.w*.92/e,this.h*.85/n);return Math.min(this.maxZoom(),Math.max(Ra,s))}minZoom(){const t=this.fitZoom();return t==null?Ra:Math.min(this.maxZoom(),Math.max(Ra,.9*t))}fitToMap(t){this.syncMap(t),this.cam.zoom>1e-4||(this.cam.zoom=1);const e=this.boardBounds(t);e&&(this.cam.zoom=this.zoomForBounds(e),this.cam.x=(e.minX+e.maxX)/2,this.cam.y=(e.minY+e.maxY)/2)}draw(t,e,n,s){const r=this.ctx;this.syncMap(t),this.time+=16,r.clearRect(0,0,this.w,this.h),this.drawBackdrop(t.theme);const a=new Map,o=new Map;for(const u of e){if(u.dead){u.team==="player"&&!u.npc&&o.set(Ft(u.x,u.y),u);continue}const d=Ft(u.x,u.y),m=a.get(d);m?m.push(u):a.set(d,[u])}const l=new Map;for(const u of t.objects)u.gone||l.set(Ft(u.x,u.y),u);this.statusCount=0;const c=this.cellsInDrawOrder(t),h=new Map;for(let u=0;u<c.length;u++)h.set(Ft(c[u].x,c[u].y),u);this.bodyStamps.clear();const f=[];for(const u of c){this.drawTile(t.tiles[u.y][u.x],t,n);const d=l.get(Ft(u.x,u.y));d&&this.drawBoardObj(d,t);const m=a.get(Ft(u.x,u.y)),x=o.get(Ft(u.x,u.y));if(x&&this.drawDownedMarker(x,t,!1),!!m){this.orderUnits(m,t);for(const g of m)this.drawUnit(g,t,n),f.push(g)}}for(const u of f)this.drawOccludedGhost(u,t,c,h,l);this.drawUnitOverlays(f,t,n,c,h,l),this.drawVignette(),this.drawFloats(s,t)}drawBackdrop(t){const e=this.ctx;if(t==="roof"&&this.legacyPlate&&this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0){const n=Math.max(this.w/this.kingsWharf.naturalWidth,this.h/this.kingsWharf.naturalHeight),s=this.kingsWharf.naturalWidth*n,r=this.kingsWharf.naturalHeight*n,a=(this.w-s)*.42,o=(this.h-r)*.46;e.save(),e.globalAlpha=.86,e.drawImage(this.kingsWharf,a,o,s,r),e.fillStyle="rgba(5, 8, 18, 0.42)",e.fillRect(0,0,this.w,this.h);const l=e.createLinearGradient(0,0,0,this.h);l.addColorStop(0,"rgba(4, 8, 18, 0.38)"),l.addColorStop(.5,"rgba(6, 7, 14, 0.08)"),l.addColorStop(1,"rgba(4, 5, 10, 0.62)"),e.fillStyle=l,e.fillRect(0,0,this.w,this.h),e.restore();return}this.drawSkylineSlot(t)}drawSky(t){const e=Oo[t],n=this.ctx.createLinearGradient(0,0,0,this.h);n.addColorStop(0,e.sky[0]),n.addColorStop(.55,e.sky[1]),n.addColorStop(1,e.sky[2]),this.ctx.fillStyle=n,this.ctx.fillRect(0,0,this.w,this.h)}skylineBitmap(t){const e=H_[t];if(e){let n=this.skylineArt.get(t);if(n||(n=new Image,n.decoding="async",n.src=e,this.skylineArt.set(t,n)),n.complete&&n.naturalWidth>0)return n}return this.proceduralSkyline(t)}proceduralSkyline(t){const e=Math.max(48,Math.round(this.h*.45));e!==this.skylineCacheH&&(this.skylineCache.clear(),this.skylineCacheH=e);const n=this.skylineCache.get(t);if(n)return n;const s=document.createElement("canvas");s.width=Qc,s.height=e;const r=s.getContext("2d");return r&&V_(r,t,Qc,e),this.skylineCache.set(t,s),s}stepSkylineSlide(t,e){const n=performance.now();if(!this.skylineSlideReady||this.skylineSlideSpan!==e){this.skylineSlide=Yi(t,e),this.skylineSlideReady=!0,this.skylineSlideSpan=e,this.skylineSlideAt=n;return}const s=Math.min(.1,Math.max(0,(n-this.skylineSlideAt)/1e3));this.skylineSlideAt=n;let r=Yi(t-this.skylineSlide,e);r>e*.5&&(r-=e);const a=1-Math.exp(-s/.1);this.skylineSlide=Yi(this.skylineSlide+r*a,e)}drawSkylineSlot(t){const e=this.ctx;this.drawSky(t);const n=this.skylineBitmap(t),{w:s,h:r}=W_(n),a=this.h*.58,o=1+(this.cam.zoom-1)*.3,l=s*o,c=r*o;if(!(l>1)||!(c>1)){this.drawWaterFog(t,a);return}const h=-this.cam.x*this.cam.zoom*.3,f=-this.cam.y*this.cam.zoom*.3,u=Math.min(c,this.h*.45),d=a-c,m=a-u;let x=d+f;m>d?x<d?x=d:x>m&&(x=m):x=d,this.stepSkylineSlide(this.yaw/(Math.PI*2)*s,s);let g=Yi(h+this.skylineSlide*o,l);g>0&&(g-=l),e.save(),e.beginPath(),e.rect(0,0,this.w,a),e.clip();for(let p=g;p<this.w;p+=l)e.drawImage(n,p,x,l,c);e.restore(),this.drawWaterFog(t,a)}drawWaterFog(t,e){const n=this.ctx,s=Oo[t],r=n.createLinearGradient(0,e,0,this.h);r.addColorStop(0,s.water0),r.addColorStop(.42,"rgba(4, 6, 10, 0.86)"),r.addColorStop(1,s.water1),n.fillStyle=r,n.fillRect(0,e,this.w,Math.max(0,this.h-e));const a=Math.max(1,this.h-e);for(let o=0;o<3;o++){const l=Math.sin(this.time*35e-5+o*1.7)*8,c=e+a*(.18+o*.22)+l,h=this.w*(.62+o*.14),f=this.w+h,u=Yi(this.time*(.012+o*.005)+o*this.w*.37,f)-h,d=n.createRadialGradient(0,0,0,0,0,1);d.addColorStop(0,s.fog),d.addColorStop(.55,s.fog.replace(/[\d.]+\)$/,m=>`${parseFloat(m)*.5})`)),d.addColorStop(1,"rgba(0,0,0,0)"),n.save(),n.translate(u+h/2,c),n.scale(h/2,42),n.fillStyle=d,n.fillRect(-1,-1,2,2),n.restore()}}themeGroup(t){return t==="warehouse"||t==="street"||t==="alley"?"alley":"roof"}tilePaint(t,e,n){const s=t.blocked;return this.themeGroup(e)==="alley"?t.terrain==="stairs"?{top:n?"#6e6254":"#5e5248",left:"#3a3228",right:"#4a4034",rim:"rgba(220, 190, 140, 0.35)",seam:"rgba(30, 20, 12, 0.45)"}:t.terrain==="roof"?{top:n?"#3a3e4c":"#323644",left:"#241c1a",right:"#302624",rim:"rgba(180, 160, 130, 0.3)",seam:"rgba(20, 16, 14, 0.5)"}:{top:s?n?"#1e2228":"#1a1e24":n?"#2c323c":"#262c36",left:"#14161c",right:"#1c2026",rim:s?"rgba(180, 70, 50, 0.4)":"rgba(120, 160, 180, 0.28)",seam:"rgba(10, 12, 16, 0.5)"}:t.terrain==="stairs"?{top:n?"#6a6258":"#5a544c",left:"#3a342c",right:"#4a443c",rim:"rgba(210, 200, 180, 0.32)",seam:"rgba(28, 24, 20, 0.45)"}:t.terrain==="roof"?{top:s?n?"#2e2c3c":"#282636":n?"#4a4860":"#3e3c54",left:"#241e2c",right:"#302838",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(140, 210, 230, 0.34)",seam:"rgba(18, 14, 28, 0.5)"}:{top:s?n?"#1c1a24":"#18161e":n?"#2c2a38":"#262430",left:"#16141c",right:"#201c28",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(110, 190, 210, 0.28)",seam:"rgba(12, 10, 18, 0.5)"}}drawTile(t,e,n){const s=this.ctx,{cx:r,cy:a,hw:o,hh:l,drop:c,top:h}=this.topMetrics(t.x,t.y,t.h),f=Ft(t.x,t.y),u=(t.x+t.y)%2===0,d=this.cam.zoom,m=this.frontFaces(h,c),x=this.tilePaint(t,e.theme,u),g=m.slice().sort((M,T)=>(M[0].x+M[1].x)/2-(T[0].x+T[1].x)/2);for(let M=0;M<g.length;M++)this.drawWallFace(t,g[M],M===0?x.left:x.right,e.theme,d,t.x*13+t.y*7+M);this.drawTopSurface(t,e,h,r,a,o,l,x,d),this.drawTileStanding(t,e),n.move.has(f)&&(this.quadPath(this.insetQuad(h,.92)),s.fillStyle="rgba(62, 240, 208, 0.3)",s.fill(),s.strokeStyle="rgba(62, 240, 208, 0.9)",s.lineWidth=1.2,s.stroke());const p=n.areaKind;if(n.area.has(f)&&!n.hot.has(f)){const M=p==="skill"||p==="item"?"rgba(230, 48, 255, 0.3)":"rgba(255, 90, 110, 0.14)",T=p==="skill"||p==="item"?"rgba(242, 92, 255, 0.76)":"rgba(255, 110, 130, 0.42)";this.quadPath(this.insetQuad(h,.9)),s.fillStyle=M,s.fill(),s.strokeStyle=T,s.lineWidth=1.15,s.stroke()}if(n.hot.has(f)){const M=.5+.28*Math.sin(this.time/190),T=p==="skill"||p==="item"?`rgba(244, 72, 255, ${.4+M*.22})`:`rgba(255, 80, 110, ${.3+M*.22})`,y=p==="skill"||p==="item"?"rgba(255, 170, 255, 0.98)":"rgba(255, 170, 180, 0.98)";this.quadPath(this.insetQuad(h,.86)),s.fillStyle=T,s.fill(),s.strokeStyle=y,s.lineWidth=2.15,s.stroke()}n.inspect&&n.inspect.x===t.x&&n.inspect.y===t.y&&(this.quadPath(this.insetQuad(h,.96)),s.strokeStyle="rgba(255, 232, 160, 0.95)",s.lineWidth=2,s.stroke())}drawWallFace(t,e,n,s,r,a){const o=this.ctx,[l,c,h,f]=e;o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.fillStyle=n,o.fill(),o.save(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.clip();const u=this.blockH()*r;o.strokeStyle=s==="alley"?"rgba(20, 12, 8, 0.4)":"rgba(10, 8, 16, 0.4)",o.lineWidth=1;const d=Math.max(1,t.h);for(let x=1;x<=d;x++){const g=x*u;o.beginPath(),o.moveTo(l.x,l.y+g),o.lineTo(c.x,c.y+g),o.stroke()}const m=(l.x+c.x)/2;if(o.beginPath(),o.moveTo(m,(l.y+c.y)/2),o.lineTo(m,(h.y+f.y)/2),o.strokeStyle="rgba(0,0,0,0.18)",o.stroke(),t.h>=2&&ue(a)>.45){const x=(l.x+c.x)*.5,g=(l.y+c.y)*.5+u*.55,p=Math.max(4,Math.abs(c.x-l.x)*.22),M=Math.max(5,u*.42);o.fillStyle=s==="alley"?"rgba(8, 8, 6, 0.7)":"rgba(6, 8, 14, 0.72)",o.fillRect(x-p,g-M/2,p*2,M),o.strokeStyle=s==="alley"?"rgba(255, 170, 80, 0.18)":"rgba(80, 160, 220, 0.2)",o.strokeRect(x-p,g-M/2,p*2,M)}if(t.h>=1&&ue(a+3)>.62){const x=l.x*.7+c.x*.3;o.strokeStyle=s==="alley"?"rgba(90, 70, 50, 0.55)":"rgba(70, 90, 100, 0.5)",o.lineWidth=Math.max(1.4,1.8*r),o.beginPath(),o.moveTo(x,(l.y+c.y)/2),o.lineTo(x,(h.y+f.y)/2),o.stroke()}o.restore(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.strokeStyle="rgba(0,0,0,0.35)",o.lineWidth=1,o.stroke()}drawTopSurface(t,e,n,s,r,a,o,l,c){const h=this.ctx;if(this.quadPath(n),h.fillStyle=l.top,h.fill(),h.save(),this.quadPath(n),h.clip(),t.terrain==="stairs"){h.strokeStyle="rgba(20, 16, 12, 0.45)",h.lineWidth=Math.max(1.2,1.5*c);for(let u=1;u<=4;u++){const d=u/5,m=on(n[0],n[3],d),x=on(n[1],n[2],d);h.beginPath(),h.moveTo(m.x,m.y),h.lineTo(x.x,x.y),h.stroke()}h.fillStyle="rgba(255, 230, 190, 0.07)",h.fillRect(s-a,r-o*.2,a*2,o*.5)}else if(e.theme==="roof"&&t.terrain==="roof"){h.strokeStyle=l.seam,h.lineWidth=1;for(let u=1;u<=4;u++){const d=u/5,m=on(n[0],n[1],d),x=on(n[3],n[2],d);h.beginPath(),h.moveTo(m.x,m.y),h.lineTo(x.x,x.y),h.stroke()}!t.prop&&!t.blocked&&ue(t.x*9+t.y*17)<.2?(this.quadPath(this.insetQuad(n,.42)),h.fillStyle="rgba(20, 40, 70, 0.55)",h.fill(),h.strokeStyle="rgba(120, 200, 230, 0.45)",h.stroke()):!t.prop&&ue(t.x*5+t.y*11)<.16&&(h.fillStyle="#3a3e48",h.beginPath(),h.ellipse(s+a*.12,r-o*.08,4.5*c,3.2*c,0,0,Math.PI*2),h.fill(),h.strokeStyle="#8a93a3",h.stroke())}else if(e.theme==="alley"&&t.terrain==="street"){ue(t.x+t.y*8)>.55&&(h.fillStyle="rgba(70, 140, 180, 0.1)",h.beginPath(),h.ellipse(s-a*.1,r+o*.12,a*.32,o*.22,0,0,Math.PI*2),h.fill()),h.strokeStyle="rgba(0,0,0,0.28)",h.beginPath();const u=on(n[0],n[2],.35+ue(t.x*3)*.3);h.moveTo(s-a*.2,r),h.lineTo(u.x,u.y),h.stroke()}else if(e.theme==="roof"){this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0&&(h.globalAlpha=.14,h.drawImage(this.kingsWharf,-this.w*.2,-this.h*.18,this.w*1.4,this.h*1.2),h.globalAlpha=1,h.fillStyle="rgba(88, 42, 26, 0.16)",h.fill()),h.strokeStyle="rgba(255, 192, 106, 0.22)",h.lineWidth=Math.max(1,c);const u=on(n[0],n[2],.5),d=on(n[1],n[3],.5);h.beginPath(),h.moveTo(u.x,u.y),h.lineTo(d.x,d.y),h.stroke(),!t.prop&&!t.blocked&&ue(t.x*31+t.y*47)<.22&&(h.strokeStyle="rgba(245, 221, 166, 0.68)",h.lineWidth=Math.max(1,1.25*c),h.beginPath(),h.ellipse(s+a*.05,r+o*.04,a*.28,o*.28,0,0,Math.PI*2),h.stroke(),h.beginPath(),h.moveTo(s-a*.16,r+o*.04),h.lineTo(s+a*.22,r+o*.04),h.moveTo(s+a*.03,r-o*.18),h.lineTo(s+a*.03,r+o*.2),h.stroke())}else h.strokeStyle=l.seam,h.beginPath(),h.moveTo(on(n[0],n[1],.5).x,on(n[0],n[1],.5).y),h.lineTo(on(n[3],n[2],.5).x,on(n[3],n[2],.5).y),h.stroke();if(t.blocked){h.strokeStyle="rgba(0,0,0,0.28)",h.lineWidth=1;for(let u=-2;u<=2;u++)h.beginPath(),h.moveTo(s-a+u*6*c,r-o),h.lineTo(s+a+u*6*c,r+o),h.stroke()}h.fillStyle="rgba(255,255,255,0.055)";for(let u=0;u<5;u++){const d=ue(t.x*19+t.y*23+u),m=ue(t.x*29+t.y*31+u+4);h.fillRect(s-a+d*a*2,r-o+m*o*2,1.6*c,1.2*c)}h.restore(),this.quadPath(n),h.strokeStyle=l.rim,h.lineWidth=1.2,h.stroke();let f=0;for(let u=1;u<4;u++)n[u].y<n[f].y&&(f=u);h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+1)%4].x,n[(f+1)%4].y),h.strokeStyle="rgba(230, 248, 255, 0.38)",h.stroke(),h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+3)%4].x,n[(f+3)%4].y),h.strokeStyle="rgba(20, 20, 28, 0.4)",h.stroke()}drawTileStanding(t,e){const{cx:n,cy:s,hw:r,hh:a,top:o}=this.topMetrics(t.x,t.y,t.h),l=this.cam.zoom;this.drawRailings(t,e,o,l),this.drawProp(t,e.theme,n,s,r,a,l)}drawRailings(t,e,n,s){if(t.h<1||t.terrain==="stairs")return;const r=this.ctx,a=[[0,-1],[1,0],[0,1],[-1,0]],o=(e.theme==="roof"?7.5:6.5)*s;r.strokeStyle=e.theme==="roof"?"rgba(170, 186, 210, 0.85)":"rgba(120, 96, 72, 0.8)",r.lineWidth=Math.max(1.15,1.35*s);for(let l=0;l<4;l++){const c=e.tile(t.x+a[l][0],t.y+a[l][1]);if((c?t.h-c.h:t.h+1)<1)continue;const f=n[l],u=n[(l+1)%4];r.beginPath(),r.moveTo(f.x,f.y),r.lineTo(f.x,f.y-o),r.lineTo(u.x,u.y-o),r.lineTo(u.x,u.y),r.stroke(),r.beginPath(),r.moveTo(f.x,f.y-o*.48),r.lineTo(u.x,u.y-o*.48),r.stroke()}}diamondPath(t,e,n,s){const r=this.ctx;r.beginPath(),r.moveTo(t,e-s),r.lineTo(t+n,e),r.lineTo(t,e+s),r.lineTo(t-n,e),r.closePath()}quadPath(t){const e=this.ctx;e.beginPath(),e.moveTo(t[0].x,t[0].y);for(let n=1;n<t.length;n++)e.lineTo(t[n].x,t[n].y);e.closePath()}insetQuad(t,e){let n=0,s=0;for(const r of t)n+=r.x,s+=r.y;return n/=t.length,s/=t.length,t.map(r=>({x:n+(r.x-n)*e,y:s+(r.y-s)*e}))}drawProp(t,e,n,s,r,a,o){const l=this.ctx;if(t.prop==="stall"){const c=15*o;l.beginPath(),l.moveTo(n-r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n-r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#3a141c",l.fill(),l.beginPath(),l.moveTo(n+r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n+r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#4a1d28",l.fill();const h=.75+Math.sin(this.time/180+t.x)*.2;this.diamondPath(n,s-4*o,r*.62,a*.62),l.fillStyle=`rgba(255, 61, 138, ${.72*h})`,l.fill(),l.fillStyle="#ffe08a",l.font=`bold ${Math.max(8,9*o)}px sans-serif`,l.textAlign="center",l.fillText(t.x<5?"FISH":"TEA",n,s-2*o)}else if(t.prop==="crate"){const c=13*o;l.beginPath(),l.moveTo(n-r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n-r*.48,s+c),l.closePath(),l.fillStyle="#5a3a22",l.fill(),l.beginPath(),l.moveTo(n+r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n+r*.48,s+c),l.closePath(),l.fillStyle="#6c4628",l.fill(),this.diamondPath(n,s-2*o,r*.48,a*.48),l.fillStyle="#8a5a32",l.fill(),l.strokeStyle="rgba(40, 22, 10, 0.55)",l.lineWidth=1;for(let h=-1;h<=1;h++)l.beginPath(),l.moveTo(n-r*.28,s+h*3*o),l.lineTo(n+r*.28,s+h*3*o),l.stroke();l.strokeStyle="rgba(180, 160, 120, 0.45)",l.strokeRect(n-5*o,s-3*o,10*o,4*o)}else if(t.prop==="ac"){const c=11*o;l.beginPath(),l.moveTo(n-r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n-r*.42,s+c),l.closePath(),l.fillStyle="#2e323c",l.fill(),l.beginPath(),l.moveTo(n+r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n+r*.42,s+c),l.closePath(),l.fillStyle="#3a3e48",l.fill(),this.diamondPath(n,s-2*o,r*.42,a*.42),l.fillStyle="#4a5060",l.fill();const h=this.time/140;l.strokeStyle="#8a93a3",l.lineWidth=1.2,l.beginPath(),l.arc(n,s-2*o,4.8*o,0,Math.PI*2),l.stroke(),l.beginPath(),l.moveTo(n+Math.cos(h)*4.2*o,s-2*o+Math.sin(h)*2.2*o),l.lineTo(n-Math.cos(h)*4.2*o,s-2*o-Math.sin(h)*2.2*o),l.stroke()}else if(t.prop==="lamp"){l.fillStyle="#2a2a32",l.fillRect(n-1.6*o,s-20*o,3.2*o,24*o);const c=e==="alley"?"rgba(255, 180, 80, 0.92)":"rgba(255, 210, 120, 0.9)";l.fillStyle=c,l.beginPath(),l.arc(n,s-22*o,4.4*o,0,Math.PI*2),l.fill(),l.fillStyle=e==="alley"?"rgba(255, 160, 70, 0.14)":"rgba(255, 200, 110, 0.12)",l.beginPath(),l.arc(n,s-4*o,17*o,0,Math.PI*2),l.fill()}}projectAt(t,e,n,s,r){return(a,o,l)=>{const c=zc(a,o,s),h=this.worldToScreen(t+c.x,e+c.y,n+l*wa),f=kr(t+c.x,e+c.y,this.yaw,r.w,r.h);return{x:h.x,y:h.y,d:f.x+f.y-l}}}drawBoardObj(t,e){const n=this.ctx,s=e.tiles[t.y][t.x].h;this.worldToScreen(t.x,t.y,s);const r=this.cam.zoom,{cx:a,cy:o,hw:l,hh:c}=this.topMetrics(t.x,t.y,s);if(t.type==="barrel"){n.fillStyle="#7a2a22",n.beginPath(),n.ellipse(a,o+2*r,l*.38,c*.32,0,0,Math.PI*2),n.fill(),n.fillStyle="#c44a32",n.fillRect(a-7*r,o-16*r,14*r,18*r),n.fillStyle="#e8c45a",n.fillRect(a-7*r,o-8*r,14*r,2.2*r),n.fillStyle="#2a1010",n.beginPath(),n.ellipse(a,o-16*r,7*r,3.2*r,0,0,Math.PI*2),n.fill();const f=t.hp/Math.max(1,t.maxHp);n.fillStyle="#111018",n.fillRect(a-10*r,o-22*r,20*r,3*r),n.fillStyle="#ff4d6d",n.fillRect(a-10*r,o-22*r,20*r*f,3*r);return}if(t.type==="kit"){n.fillStyle="#f2f4f0",n.fillRect(a-8*r,o-8*r,16*r,12*r),n.fillStyle="#d04040",n.fillRect(a-2*r,o-6*r,4*r,8*r),n.fillRect(a-6*r,o-3*r,12*r,3*r),n.strokeStyle="#3a3a40",n.strokeRect(a-8*r,o-8*r,16*r,12*r);return}if(t.type==="switch"){n.fillStyle=t.used?"#3a5a48":"#3ef0d0",this.diamondPath(a,o,l*.35,c*.35),n.fill(),n.strokeStyle="#0a1816",n.stroke(),n.fillStyle=t.used?"#8aa":"#fff",n.font=`bold ${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(t.used?"開":"掣",a,o+3*r);return}if(t.type==="van"){n.fillStyle=t.used?"#3a4850":"#2a3540",n.fillRect(a-14*r,o-18*r,28*r,22*r),n.fillStyle="#1a2228",n.fillRect(a-10*r,o-14*r,12*r,8*r),n.fillStyle=t.used?"#7dffb3":"#ffc857",n.fillRect(a+4*r,o-6*r,8*r,10*r),n.fillStyle="#e8eef2",n.font=`${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(t.used?"開":"門",a,o+16*r);return}const h=t.type==="pallet"?8*r:12*r;n.fillStyle=t.type==="pallet"?"#6a5030":"#8a5a32",n.beginPath(),n.moveTo(a-l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a-l*.46,o+h),n.closePath(),n.fill(),n.fillStyle=t.type==="pallet"?"#7a6038":"#a06a3c",n.beginPath(),n.moveTo(a+l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a+l*.46,o+h),n.closePath(),n.fill(),this.diamondPath(a,o-2*r,l*.46,c*.46),n.fillStyle=t.type==="pallet"?"#c4a060":"#c48448",n.fill(),n.strokeStyle="rgba(40,22,10,0.55)",n.stroke()}projectFor(t,e){const n=e.heightAt(t.x,t.y);return(s,r,a)=>{const o=zc(s,r,t.dir),l=this.worldToScreen(t.x+o.x,t.y+o.y,n+a*wa),c=kr(t.x+o.x,t.y+o.y,this.yaw,e.w,e.h);return{x:l.x,y:l.y,d:c.x+c.y-a*wa*.45}}}drawDownedMarker(t,e,n){const s=this.ctx,{x:r,feetY:a,z:o,scale:l}=this.unitPose(t,e),c=a+ms*o,h=ar*l,f=or*l;if(s.save(),s.globalAlpha=.85,s.fillStyle="rgba(0,0,0,0.45)",s.beginPath(),s.ellipse(r,c,h,f,0,0,Math.PI*2),s.fill(),s.setLineDash([3,2]),s.strokeStyle="rgba(190,196,210,0.8)",s.lineWidth=1.4,s.stroke(),s.setLineDash([]),s.strokeStyle="rgba(255,92,120,0.9)",s.lineWidth=1.8,s.beginPath(),s.moveTo(r-h*.4,c-f*.4),s.lineTo(r+h*.4,c+f*.4),s.moveTo(r+h*.4,c-f*.4),s.lineTo(r-h*.4,c+f*.4),s.stroke(),!n){s.restore();return}s.font=`600 ${Math.max(9,Math.round(10*l))}px system-ui, sans-serif`,s.textAlign="center",s.textBaseline="top";const u=`${t.name} 倒下`,d=s.measureText(u).width,m=c+f+2;s.fillStyle="rgba(10,10,16,0.75)",s.fillRect(r-d/2-4,m-1,d+8,Math.max(9,Math.round(10*l))+4),s.fillStyle="rgba(220,224,232,0.9)",s.fillText(u,r,m+1),s.restore()}unitPose(t,e){const n=this.worldToScreen(t.x,t.y,e.heightAt(t.x,t.y)),s=this.cam.zoom,r=t.role==="elite",a=r?xu:1,o=Ts(t.dir),l=bl(o.x,o.y,this.yaw),c=t.lunge||0,h=(l.x-l.y)*6*s*c,f=(l.x+l.y)*3*s*c;return{x:n.x+h,feetY:n.y+f+X_*s,z:s,scale:a*s,dh:Ia(s,r),dx:h,dy:f,ground:n,face:l,elite:r}}rememberRig(t,e){if(!e||!(e.w>0)||!(e.h>0)||e.source.width===0||e.source.height===0)return;let n=this.rigSnaps.get(t);n||(n=document.createElement("canvas"),this.rigSnaps.set(t,n)),(n.width!==e.source.width||n.height!==e.source.height)&&(n.width=e.source.width,n.height=e.source.height);const s=n.getContext("2d");s&&(s.setTransform(1,0,0,1,0,0),s.globalAlpha=1,s.globalCompositeOperation="source-over",s.clearRect(0,0,n.width,n.height),s.drawImage(e.source,0,0),this.sourceRev.set(n,(this.sourceRev.get(n)??0)+1),this.bodyStamps.set(t,{source:n,sw:n.width,sh:n.height,dx:e.x,dy:e.y,dw:e.w,dh:e.h,mirror:!1,fig:{x:e.x,y:e.y,w:e.w,h:e.h},view:"rig"}))}objectRise(t){return t.kind==="platform"?t.standH:t.type==="barrel"||t.type==="van"?1:0}boardObjRect(t,e){const n=this.cam.zoom,{cx:s,cy:r,hw:a,hh:o}=this.topMetrics(t.x,t.y,e);let l=s,c=r,h=s,f=r;const u=(d,m,x,g)=>{d<l&&(l=d),m<c&&(c=m),d+x>h&&(h=d+x),m+g>f&&(f=m+g)};if(t.type==="barrel")u(s-a*.38,r+2*n-o*.32,a*.76,o*.64),u(s-10*n,r-22*n,20*n,24*n);else if(t.type==="kit")u(s-8*n,r-8*n,16*n,12*n);else if(t.type==="switch")u(s-a*.35,r-o*.35,a*.7,o*.7);else if(t.type==="van")u(s-14*n,r-18*n,28*n,40*n);else{const d=t.type==="pallet"?8*n:12*n,m=2*n+o*.46;u(s-a*.46,r-m,a*.92,m+o*.46+d)}return{x:l,y:c,w:h-l,h:f-c}}prismHitsRect(t,e){const{drop:n,top:s}=this.topMetrics(t.x,t.y,t.h);if(Jc(s,e))return!0;for(const r of this.frontFaces(s,n))if(Jc(r,e))return!0;return!1}bodyOccluded(t,e,n,s,r,a){const o=s.get(Ft(t.x,t.y));if(o==null)return!1;const l={x:a.x,y:a.y,w:a.w,h:a.h*Q_};if(!(l.w>0)||!(l.h>0))return!1;const c=e.heightAt(t.x,t.y);for(let h=o+1;h<n.length;h++){const f=n[h],u=e.tiles[f.y][f.x];if(u.h>c&&this.prismHitsRect(u,l))return!0;const d=r.get(Ft(f.x,f.y));if(d&&!(u.h+this.objectRise(d)<=c)&&Ca(this.boardObjRect(d,u.h),l))return!0}return!1}drawGhost(t,e,n){const s=Math.max(1,Math.round(t.sw)),r=Math.max(1,Math.round(t.sh));if(!(t.dw>0)||!(t.dh>0))return;(!this.ghostCanvas||!this.ghostCtx)&&(this.ghostCanvas=document.createElement("canvas"),this.ghostCtx=this.ghostCanvas.getContext("2d"));const a=this.ghostCanvas,o=this.ghostCtx;if(!o)return;(a.width<s||a.height<r)&&(a.width=Math.max(a.width,s),a.height=Math.max(a.height,r)),o.setTransform(1,0,0,1,0,0),o.globalCompositeOperation="source-over",o.globalAlpha=1,o.clearRect(0,0,s,r),o.save(),t.mirror&&(o.translate(s,0),o.scale(-1,1)),o.drawImage(t.source,0,0,t.sw,t.sh,0,0,s,r),o.restore(),o.save(),o.globalCompositeOperation="source-atop",o.globalAlpha=.35,o.fillStyle=e,o.fillRect(0,0,s,r),o.restore();const l=this.ctx,c=this.overlayLayer(),h=this.boardLayer("mask");if(!c||!h){l.save(),l.globalAlpha=nh,l.drawImage(a,0,0,s,r,t.dx,t.dy,t.dw,t.dh),l.restore();return}c.g.globalAlpha=nh,c.g.drawImage(a,0,0,s,r,t.dx,t.dy,t.dw,t.dh),c.g.globalAlpha=1,this.ctx=h.g;try{n()}finally{this.ctx=l}c.g.save(),c.g.globalCompositeOperation="destination-in",c.g.globalAlpha=1,c.g.drawImage(h.canvas,0,0,this.w,this.h),c.g.restore(),l.save(),l.globalAlpha=1,l.globalCompositeOperation="source-over",l.drawImage(c.canvas,0,0,this.w,this.h),l.restore()}drawOccludedGhost(t,e,n,s,r){const a=this.bodyStamps.get(t.id);if(!a)return;const o=a.fig;this.bodyOccluded(t,e,n,s,r,o)&&this.drawGhost(a,cr(t),()=>{this.paintNearOccluders(t,e,n,s,r,o.w>0&&o.h>0?o:null)})}drawMapDoll(t,e,n,s,r,a,o,l,c=0){const h=Ia(r,a),f=c>0?e.naturalHeight*h/c:h,u=c>0?e.naturalWidth*h/c:f*e.naturalWidth/e.naturalHeight,d=this.ctx;d.save(),d.translate(n-u/2,s-f),o&&(d.translate(u,0),d.scale(-1,1)),d.drawImage(e,0,0,u,f),d.restore();const m=n-u/2,x=s-f;this.bodyStamps.set(t,{source:e,sw:e.naturalWidth,sh:e.naturalHeight,dx:m,dy:x,dw:u,dh:f,mirror:o,fig:rv(e,m,x,u,f,o),view:l})}hero8Ready(t){return this.hero8[t].kind==="ready"}loadHero8(t){const e=()=>{this.hero8[t]={kind:"absent"}},n=(r,a)=>{const o=()=>{try{if(this.hero8[t].kind==="absent")return;const l=lr(r);if(!(r.naturalWidth>0)||!l){e();return}a(l)}catch{e()}};typeof r.decode=="function"?r.decode().then(o).catch(o):o()},s=new Image;s.decoding="async",s.addEventListener("error",e),s.addEventListener("load",()=>{n(s,r=>{const a=new Array(8);a[0]={image:s,opaque:r};let o=7;for(let l=1;l<qi;l++){const c=new Image;c.decoding="async",c.addEventListener("error",e),c.addEventListener("load",()=>{n(c,h=>{if(this.hero8[t].kind==="absent"||(a[l]={image:c,opaque:h},o-=1,o!==0))return;const f=[];let u=0;for(const d of a){if(!d||!(d.image.naturalWidth>0)){e();return}const m=d.opaque.y1-d.opaque.y0;m>u&&(u=m),f.push(d)}if(!(u>0)||f.length!==qi){e();return}this.hero8[t]={kind:"ready",views:f,figureH:u}})}),c.src=`./sprites/hero8/${t}-${l}.png`}})}),s.src=`./sprites/hero8/${t}-0.png`}heroView(t,e){const n=this.hero8[t];if(n.kind==="ready")return{image:n.views[e].image,mirror:!1,view:`hero8:${e}`};const[s,r]=nv[t][e];if(s!=="doll"&&t!=="priya"){const o=(t==="mara"?this.maraAngles:this.danaAngles)[s];if(rh(o))return{image:o,mirror:r,view:`painted:${s}`}}const a=this.mapDolls[t];return rh(a)?{image:a,mirror:s==="doll"?r:!1,view:"doll"}:{image:a,mirror:!1,view:"rig"}}screenSector(t){const e=Ts(t.dir),n=bl(e.x,e.y,this.yaw),s=n.x-n.y,r=n.x+n.y,a=Math.atan2(-s,r);return(Math.round(a/(Math.PI*2)*qi)%qi+qi)%qi}drawUnit(t,e,n){const s=this.ctx,{x:r,feetY:a,z:o,scale:l,dh:c,dx:h,dy:f,ground:u,elite:d}=this.unitPose(t,e),m=cr(t),x=t.acted&&!(t.npc&&t.behaviour==="idle"),g=ka(t)&&t.acted;s.save(),s.fillStyle="rgba(0,0,0,0.4)",s.beginPath(),s.ellipse(r,a+ms*o,11*l,4.8*l,0,0,Math.PI*2),s.fill(),n.selected?.id===t.id&&(s.strokeStyle=m,s.lineWidth=2.2,this.diamondPath(u.x,u.y,16*l,8*l),s.stroke()),n.target?.id===t.id&&(s.strokeStyle="#ffe08a",s.lineWidth=2,this.diamondPath(u.x,u.y,18*l,9*l),s.stroke());const p=()=>{const M=iv(t.archetype)?t.archetype:null;if(M){const w=this.heroView(M,this.screenSector(t));if(w.view!=="rig"){const b=this.hero8[M];this.drawMapDoll(t.id,w.image,r,a,o,d,w.mirror,w.view,b.kind==="ready"?b.figureH:0);return}}const T=this.projectFor(t,e),y=(w,b,R)=>{const v=T(w,b,R);return{x:v.x+h,y:v.y+f,d:v.d}};this.rememberRig(t.id,P_(s,y,t,this.time,o,this.yaw,this.pitch))};if(g?this.withActedBody(p):p(),s.restore(),x){const M=r+14*l,T=a-c+10*l,y=7.2*l;this.pushStatus(t.id,M,T,y,o,l)}}withActedBody(t){const e=this.ctx;if(e.save(),e.globalAlpha*=j_,typeof e.filter=="string")try{e.filter=tv}catch{}try{t()}finally{e.restore()}}trackCanvasPointer(){const t=this.canvas;typeof t.addEventListener=="function"&&(t.addEventListener("pointermove",e=>this.trackPointer(e)),t.addEventListener("pointerdown",e=>this.trackPointer(e)),t.addEventListener("pointerleave",()=>{this.pointerInside=!1,this.hover=null}))}trackPointer(t){const e=this.canvas.getBoundingClientRect();this.pointerX=t.clientX-e.left,this.pointerY=t.clientY-e.top,this.pointerInside=!0}hoveredUnit(t,e,n){if(n.hover!==void 0)return n.hover;if(!this.pointerInside)return this.hover;const s=this.pickDrawnUnit(this.pointerX,this.pointerY,t,e);return this.hover=s,s}labelSlot(t){let e=this.labelPool[t];return e||(e={id:"",text:"",accent:"#fff",dim:!1,fontPx:9,baseline:0,plateX:0,plateY:0,plateW:0,plateH:0,barW:0,barH:0,ratio:1,compactW:0,compactH:0,ringX:0,ringY:0,ringRx:1,ringRy:1,bodyX:0,bodyY:0,bodyW:0,bodyH:0,dx:0,dy:0,z:1},this.labelPool[t]=e),e}drawUnitOverlays(t,e,n,s,r,a){const o=t.length;if(this.overlayCount=o,this.placedCount=0,o===0){this.labelRects.length=0,this.labelHold.clear();return}const l=this.ctx,c=this.cam.zoom,h=Math.max(9,10*c);this.hoveredUnit(t,e,n);for(let x=0;x<o;x++){const g=t[x],p=this.labelSlot(x),M=this.unitPose(g,e),{x:T,feetY:y,scale:w,dh:b}=M,R=g.name.split(" ")[0];l.font=`${h}px sans-serif`,l.textAlign="center",l.textBaseline="alphabetic";const v=l.measureText(R),E=Math.max(3,4*c),C=Math.max(1,2*c),P=v.actualBoundingBoxAscent>0?v.actualBoundingBoxAscent:h*.8,D=v.actualBoundingBoxDescent>0?v.actualBoundingBoxDescent:h*.22,W=v.width+E*2,$=P+D+C*2,k=22*w,Y=3.5*w,B=this.bodyStamps.get(g.id),Q=B&&B.fig.h>0?B.fig.y:y-b,tt=Math.max(2,3*c),at=Q-tt-$,pt=at+C+P,yt=T-W/2;if(p.id=g.id,p.text=R,p.accent=cr(g),p.dim=ka(g)&&g.acted,p.fontPx=h,p.baseline=pt,p.plateX=yt,p.plateY=at,p.plateW=W,p.plateH=$,p.barW=k,p.barH=Y,p.ratio=Math.max(0,g.hp/g.maxHp),p.compactW=Math.max(W,k),p.compactH=Y+$,p.ringX=T,p.ringY=y+ms*c,p.ringRx=ar*w,p.ringRy=or*w,p.dx=0,p.dy=0,p.z=c,B&&B.fig.w>0&&B.fig.h>0)p.bodyX=B.fig.x,p.bodyY=B.fig.y,p.bodyW=B.fig.w,p.bodyH=B.fig.h;else{const Xt=b*th;p.bodyX=T-Xt/2,p.bodyY=y-b,p.bodyW=Xt,p.bodyH=b}}this.labelOrder.length=o;for(let x=0;x<o;x++)this.labelOrder[x]=x;const f=this.labelPool;this.labelOrder.sort((x,g)=>{const p=f[x].id,M=f[g].id;return p<M?-1:p>M?1:0});const u=this.labelSeen;u.clear();const d=[],m=[];for(let x=0;x<o;x++){const g=this.labelOrder[x],p=this.labelHold.get(f[g].id),M=t[g];p&&p.x===M.x&&p.y===M.y?d.push(g):m.push(g)}for(const x of d){const g=this.labelHold.get(f[x].id);this.holdLabel(f[x],g.dx,g.dy)}for(const x of m)this.placeLabel(f[x]);this.settleStatusIcons();for(let x=0;x<o;x++){const g=this.labelOrder[x],p=f[g],M=t[g];this.labelHold.set(p.id,{dx:p.dx,dy:p.dy,x:M.x,y:M.y}),u.add(p.id)}if(this.labelHold.size!==u.size)for(const x of this.labelHold.keys())u.has(x)||this.labelHold.delete(x);for(let x=0;x<o;x++)this.paintMaskedRing(t[x],f[x],e,n,s,r,a,t,x);for(let x=0;x<o;x++)this.paintUnitLabel(f[x]);this.paintStatusIcons(),this.labelRects.length>o&&(this.labelRects.length=o);for(let x=0;x<o;x++){const g=f[x];let p=this.labelRects[x];p||(p={id:"",x:0,y:0,w:0,h:0},this.labelRects[x]=p);const M=this.blockAt(g,g.dy,g.dx);p.id=g.id,p.x=M.x,p.y=M.y,p.w=M.w,p.h=M.h}}blockAt(t,e,n){return{x:t.ringX+n-t.compactW/2,y:t.plateY+e-t.barH,w:t.compactW,h:t.compactH}}placeLabel(t){const e=this.resolveLabel(t);this.commitLabel(t,e.ox,e.oy)}holdLabel(t,e,n){if(this.plateOverlap(t,e,n)<=0){this.commitLabel(t,e,n);return}const s=this.resolveLabel(t);this.commitLabel(t,s.ox,s.oy)}capScale(t){return Math.max(1,t.z/.7)}resolveLabel(t){const e=this.seekLabel(t,!0);if(e)return e;const n=this.seekLabel(t,!1);return n||this.leastLabel(t)}seekLabel(t,e){const n=this.capScale(t),s=Math.round(sh*n),r=Math.round(ih*n);for(let a=0;a<=s;a++){const o=-a;for(let l=0;l<=r;l++){if(this.labelClear(t,l,o,e))return{ox:l,oy:o};if(l!==0&&this.labelClear(t,-l,o,e))return{ox:-l,oy:o}}}return null}leastLabel(t){const e=this.capScale(t),n=Math.round(sh*e),s=Math.round(ih*e);let r=0,a=0,o=Number.POSITIVE_INFINITY,l=n+1,c=s+1;for(let h=0;h<=n;h++)for(let f=0;f<=s;f++){const u=f===0?[0]:[f,-f];for(const d of u){const m=this.plateOverlap(t,d,-h);(m<o-1e-6||Math.abs(m-o)<=1e-6&&(h<l||h===l&&f<c))&&(o=m,l=h,c=f,r=d,a=-h)}}return{ox:r,oy:a}}faceRect(t){return{x:t.bodyX+t.bodyW*.25,y:t.bodyY+t.bodyH*.04,w:t.bodyW*.5,h:t.bodyH*.36}}labelClear(t,e,n,s){const r=this.blockAt(t,n,e);for(let o=0;o<this.placedCount;o++)if(!Pa(r,this.placedRects[o],Xi))return!1;if(!s)return!0;const a=this.overlayCount;for(let o=0;o<a;o++){const l=this.labelPool[o];if(!(l===t||l.id===t.id)&&Kc(r,this.faceRect(l))>0)return!1}return!0}plateOverlap(t,e,n){const s=this.blockAt(t,n,e);let r=0;for(let a=0;a<this.placedCount;a++)r+=Kc(s,this.placedRects[a]);return r}settleStatusIcons(){for(let t=0;t<this.statusCount;t++){const e=this.statusMarks[t],n=this.statusRects[t];if(this.iconClear(n,t,0))continue;const s=this.iconSpot(e,t);s&&(n.x=s.x-e.r,n.y=s.y-e.r)}}iconClear(t,e,n){for(let s=0;s<this.placedCount;s++)if(!Pa(this.placedRects[s],t,n))return!1;for(let s=0;s<e;s++)if(!Pa(this.statusRects[s],t,n))return!1;return!0}iconSpot(t,e){const n=t.r;let s=0,r=0,a=Number.POSITIVE_INFINITY;const o=(c,h)=>{const f={x:c-n,y:h-n,w:n*2,h:n*2};if(!this.iconClear(f,e,Xi))return;const u=c-t.homeX,d=h-t.homeY,m=u*u+d*d;m<a&&(a=m,s=c,r=h)},l=this.slotById(t.owner);if(l){const c=this.blockAt(l,l.dy,l.dx);o(c.x+c.w+Xi+n,c.y+c.h/2),o(c.x-Xi-n,c.y+c.h/2),o(c.x+c.w/2,c.y+c.h+Xi+n),o(c.x+c.w/2,c.y-Xi-n)}for(let c=2;c<=36;c+=2)o(t.homeX+c,t.homeY),o(t.homeX-c,t.homeY),o(t.homeX,t.homeY+c),o(t.homeX,t.homeY-c),o(t.homeX+c,t.homeY+c),o(t.homeX-c,t.homeY+c),o(t.homeX+c,t.homeY-c),o(t.homeX-c,t.homeY-c);return a<Number.POSITIVE_INFINITY?{x:s,y:r}:null}slotById(t){const e=this.overlayCount,n=this.labelPool;for(let s=0;s<e;s++)if(n[s].id===t)return n[s];return null}paintStatusIcons(){const t=this.ctx;t.save();for(let e=0;e<this.statusCount;e++){const n=this.statusMarks[e],s=this.statusRects[e],r=s.x+s.w/2,a=s.y+s.h/2;t.fillStyle="rgba(8, 8, 14, 0.88)",t.beginPath(),t.arc(r,a,n.r,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(220, 224, 232, 0.92)",t.lineWidth=Math.max(1,1.15*n.z),t.stroke(),t.fillStyle="#e8eef2",t.font=`bold ${Math.max(9,11*n.z)}px sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("E",r,a+.4*n.scale)}t.restore()}commitLabel(t,e,n){t.dx=e,t.dy=n;const s=this.blockAt(t,n,e);this.pushPlaced(s.x,s.y,s.w,s.h)}pushPlaced(t,e,n,s){let r=this.placedRects[this.placedCount];r||(r={x:0,y:0,w:0,h:0},this.placedRects[this.placedCount]=r),r.x=t,r.y=e,r.w=n,r.h=s,this.placedCount++}pushStatus(t,e,n,s,r,a){let o=this.statusRects[this.statusCount];o||(o={x:0,y:0,w:0,h:0},this.statusRects[this.statusCount]=o),o.x=e-s,o.y=n-s,o.w=s*2,o.h=s*2;let l=this.statusMarks[this.statusCount];l||(l={owner:"",r:0,z:1,scale:1,homeX:0,homeY:0},this.statusMarks[this.statusCount]=l),l.owner=t,l.r=s,l.z=r,l.scale=a,l.homeX=e,l.homeY=n,this.statusCount++}paintMaskedRing(t,e,n,s,r,a,o,l,c){const h=s.selected?.id===t.id,f=this.overlayLayer();if(!f){this.paintUnitRing(e),this.drawFacingWedge(t,n,e,h);return}const u=this.ctx,d=this.markBounds(t,e,n,h);this.ctx=f.g;try{f.g.globalCompositeOperation="source-over",f.g.globalAlpha=1,this.paintUnitRing(e),this.eraseRingOccluders(t,n,r,a,o,l,c,d,"bodies"),this.drawFacingWedge(t,n,e,h),this.eraseRingOccluders(t,n,r,a,o,l,c,d,"ground")}finally{this.ctx=u}u.save(),u.globalAlpha=1,u.globalCompositeOperation="source-over",u.drawImage(f.canvas,0,0,this.w,this.h),u.restore()}overlayLayer(){return this.boardLayer("overlay")}boardLayer(t){let e=t==="overlay"?this.overlayCanvas:this.maskCanvas,n=t==="overlay"?this.overlayCtx:this.maskCtx;if(!e||!n){if(e=document.createElement("canvas"),n=e.getContext("2d"),!n)return null;t==="overlay"?(this.overlayCanvas=e,this.overlayCtx=n):(this.maskCanvas=e,this.maskCtx=n)}const s=Math.max(1,this.canvas.width),r=Math.max(1,this.canvas.height);(e.width!==s||e.height!==r)&&(e.width=s,e.height=r),n.setTransform(1,0,0,1,0,0),n.globalAlpha=1,n.globalCompositeOperation="source-over",n.clearRect(0,0,e.width,e.height);const a=this.ctx.getTransform();return n.setTransform(a.a,a.b,a.c,a.d,a.e,a.f),{g:n,canvas:e}}markBounds(t,e,n,s){let r=e.ringX-e.ringRx,a=e.ringX+e.ringRx,o=e.ringY-e.ringRy,l=e.ringY+e.ringRy;for(const h of this.facingArrow(t,n,e,s).pts)h.x<r&&(r=h.x),h.x>a&&(a=h.x),h.y<o&&(o=h.y),h.y>l&&(l=h.y);const c=Math.max(3,3.2*e.z);return{x:r-c,y:o-c,w:a-r+c*2,h:l-o+c*2}}eraseRingOccluders(t,e,n,s,r,a,o,l,c){if(c==="bodies"){for(let h=o+1;h<a.length;h++){const f=this.bodyStamps.get(a[h].id);!f||!(f.fig.w>0)||!(f.fig.h>0)||Ca(f.fig,l)&&this.eraseStamp(f)}return}this.punchOut(()=>this.paintNearOccluders(t,e,n,s,r,l))}paintNearOccluders(t,e,n,s,r,a){const o=s.get(Ft(t.x,t.y));if(o==null)return;const l=e.heightAt(t.x,t.y),c=this.time,h=this.ctx;try{for(let f=o+1;f<n.length;f++){const u=n[f],d=e.tiles[u.y][u.x],m=r.get(Ft(u.x,u.y)),x=d.h>l,g=d.prop!=null,p=this.hasRailings(d,e),M=m!=null&&d.h+this.objectRise(m)>l;if(!(!x&&!g&&!p&&!M)&&!(a&&!Ca(this.cellOccluderBounds(d,e,g||M),a))){h.save();try{x&&this.fillPrism(d),(x||g||p)&&this.drawTileStanding(d,e),M&&m&&this.drawBoardObj(m,e)}finally{h.restore()}}}}finally{this.time=c}}fillPrism(t){const e=this.ctx,{drop:n,top:s}=this.topMetrics(t.x,t.y,t.h);e.fillStyle="#000",this.quadPath(s),e.fill();for(const r of this.frontFaces(s,n))this.quadPath(r),e.fill()}hasRailings(t,e){if(t.h<1||t.terrain==="stairs")return!1;const n=[[0,-1],[1,0],[0,1],[-1,0]];for(let s=0;s<4;s++){const r=e.tile(t.x+n[s][0],t.y+n[s][1]);if((r?t.h-r.h:t.h+1)>=1)return!0}return!1}cellOccluderBounds(t,e,n){const{drop:s,top:r}=this.topMetrics(t.x,t.y,t.h);let a=1/0,o=1/0,l=-1/0,c=-1/0;for(const f of r)f.x<a&&(a=f.x),f.x>l&&(l=f.x),f.y<o&&(o=f.y),f.y+s>c&&(c=f.y+s);const h=this.cam.zoom;return this.hasRailings(t,e)&&(o-=(e.theme==="roof"?7.5:6.5)*h+Math.max(1.15,1.35*h)),n&&(a-=22*h,l+=22*h,o-=36*h,c+=20*h),{x:a,y:o,w:Math.max(0,l-a),h:Math.max(0,c-o)}}punchOut(t){const e=this.ctx,n=this.time;e.save(),e.globalCompositeOperation="destination-out",e.globalAlpha=1;try{t()}finally{this.time=n,e.restore()}}eraseStamp(t){const e=this.ctx;e.save(),e.globalCompositeOperation="destination-out",e.globalAlpha=1,t.mirror?(e.translate(t.dx+t.dw,t.dy),e.scale(-1,1),e.drawImage(t.source,0,0,t.sw,t.sh,0,0,t.dw,t.dh)):e.drawImage(t.source,0,0,t.sw,t.sh,t.dx,t.dy,t.dw,t.dh),e.restore()}paintUnitRing(t){const e=this.ctx;e.save(),e.globalAlpha=.55,e.strokeStyle=t.dim?ov(t.accent):t.accent,e.lineWidth=Math.max(2,2.2*t.z),e.beginPath(),e.ellipse(t.ringX,t.ringY,t.ringRx,t.ringRy,0,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(8,8,12,0.85)",e.lineWidth=1,e.stroke(),e.restore()}paintUnitLabel(t){const e=this.ctx,n=t.dx,s=t.dy;Math.hypot(n,s)>ev&&this.paintLeader(t),e.save();const r=t.ringX+n-t.barW/2,a=t.plateY+s-t.barH;e.fillStyle="#111018",e.fillRect(r,a,t.barW,t.barH),e.fillStyle=t.accent,e.fillRect(r,a,t.barW*t.ratio,t.barH);const o=t.ringX+n-t.plateW/2,l=t.plateY+s,c=t.plateW,h=t.plateH,f=Math.min(h/2,Math.max(2,3*t.z));e.beginPath(),e.moveTo(o+f,l),e.arcTo(o+c,l,o+c,l+h,f),e.arcTo(o+c,l+h,o,l+h,f),e.arcTo(o,l+h,o,l,f),e.arcTo(o,l,o+c,l,f),e.closePath(),e.fillStyle="rgba(8, 8, 14, 0.88)",e.fill(),e.fillStyle="#e8eef2",e.font=`${t.fontPx}px sans-serif`,e.textAlign="center",e.textBaseline="alphabetic",e.fillText(t.text,t.ringX+n,t.baseline+s),e.restore()}paintLeader(t){const e=t.ringX+t.dx,n=t.plateY+t.dy+t.plateH,s=t.bodyX+t.bodyW/2,r=t.bodyY,a=this.ctx;a.save(),a.globalAlpha=.6,a.strokeStyle=t.accent,a.lineWidth=1,a.lineCap="butt",a.beginPath(),a.moveTo(e,n),a.lineTo(s,r),a.stroke(),a.restore()}facingArrow(t,e,n,s){const r=e.heightAt(t.x,t.y),a=this.projectAt(t.x,t.y,r,t.dir,e),o=a(0,0,0),l=a(0,1,0);let c=l.x-o.x,h=l.y-o.y;const f=Math.hypot(c,h);f>1e-6?(c/=f,h/=f):(c=0,h=1);const u=Math.max(12,(s?28:22)*n.z),d=.5*u,m=.32*u,x=.09*u,g=Math.hypot(c/n.ringRx,h/n.ringRy),p=g>1e-8?1/g:0;let M=p;if(h<0){const C=this.bodyStamps.get(t.id)?.fig;if(C&&C.w>0&&C.h>0){const P=C.x-2,D=C.x+C.w+2,W=n.ringX+M*c;if(W>P&&W<D)if(c===0)M=p*2;else{const k=((c>0?D:P)-n.ringX)/c;M=Math.min(p*2,Math.max(p,k))}}}const T={x:n.ringX+M*c,y:n.ringY+M*h},y={x:T.x+u*c,y:T.y+u*h},w=-h,b=c,R=y.x-d*c,v=y.y-d*h,E=(C,P,D)=>({x:C+D*w,y:P+D*b});return{tail:T,tip:y,pts:[E(T.x,T.y,x),E(R,v,x),E(R,v,m),y,E(R,v,-m),E(R,v,-x),E(T.x,T.y,-x)]}}drawFacingWedge(t,e,n,s){const r=this.ctx,a=n.z,o=this.facingArrow(t,e,n,s).pts;r.save(),r.globalAlpha=s?1:.88,r.beginPath(),r.moveTo(o[0].x,o[0].y);for(let l=1;l<o.length;l++)r.lineTo(o[l].x,o[l].y);r.closePath(),r.lineJoin="round",r.strokeStyle="rgba(6,6,10,0.95)",r.lineWidth=Math.max(2.4,2.8*a)*(s?1.15:1),r.stroke(),r.fillStyle=n.accent,r.fill(),s&&(r.strokeStyle="rgba(255,255,255,0.9)",r.lineWidth=Math.max(1,1.1*a),r.stroke()),r.restore()}drawVignette(){const t=this.ctx,e=t.createRadialGradient(this.w/2,this.h/2,this.h*.2,this.w/2,this.h/2,this.h*.78);e.addColorStop(0,"rgba(0,0,0,0)"),e.addColorStop(1,"rgba(0,0,0,0.45)"),t.fillStyle=e,t.fillRect(0,0,this.w,this.h)}drawFloats(t,e){const n=this.ctx,s=performance.now();for(const r of t){const a=(s-r.born)/r.life;if(a>1)continue;const o=e.heightAt(Math.round(r.x),Math.round(r.y)),l=this.worldToScreen(r.x,r.y,o);n.globalAlpha=1-a,n.font=`bold ${18*this.cam.zoom}px sans-serif`,n.textAlign="center",n.lineWidth=3,n.strokeStyle="#050508",n.fillStyle=r.color;const c=l.y-36*this.cam.zoom-a*28;n.strokeText(r.text,l.x,c),n.fillText(r.text,l.x,c),n.globalAlpha=1}}}const yu=3,Mu="yejie-v1",cv=2;function ah(){return{slots:[null,null,null],autosave:null}}function di(){try{const i=localStorage.getItem(Mu);if(!i)return ah();const t=JSON.parse(i),e=[null,null,null];for(let s=0;s<yu;s++){const r=Array.isArray(t.slots)?t.slots[s]:null;e[s]=lh(r)}const n=lh(t.autosave);return{slots:e,autosave:n}}catch{return ah()}}function oh(i){return(((Number.isInteger(i)?i:0)%8+8)%8+1>>1)%4}function lh(i){if(!i||typeof i!="object")return null;const t=i;if(t.v===cv)return t;if(t.v!==1)return null;const e=Array.isArray(t.units)?t.units.map(n=>({...n,dir:oh(n.dir)})):[];return{...t,v:2,units:e,originDir:oh(t.originDir)}}function ch(i){localStorage.setItem(Mu,JSON.stringify(i))}function hv(i){const t=[];i.autosave&&t.push(i.autosave);for(const e of i.slots)e&&t.push(e);return t}function hh(i){const t=hv(i);return t.length?t.reduce((e,n)=>e.savedAt>=n.savedAt?e:n):null}function uv(i){try{return new Date(i).toLocaleString("zh-Hant-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}const uh="0.6.20",fv="20261027";function xt(i){const t=document.getElementById(i);if(!t)throw new Error(i);return t}const Da={Mara:"./sprites/vn-mara.webp",Dana:"./sprites/vn-dana.webp",Priya:"./sprites/vn-priya.webp"},dv=1500,fh=250,Ua=520,Na=460,Fa="超出範圍",pv=1500,mv={striker:"突擊",controller:"控制",support:"支援",grunt:"現場",elite:"主管",civilian:"文官",delinquent:"街頭",magician:"術者",wolverine:"爪獸",boxer:"拳手",gunner:"槍手",worker:"工人"},Oa={street:"街道",stairs:"樓梯",roof:"屋頂"},gv={stall:"攤位",ac:"冷氣",lamp:"路燈",crate:"貨箱"},dh={friendly:"友方",hostile:"敵對",neutral:"中立"},xv=450;class _v{constructor(t){F(this,"map");F(this,"units",[]);F(this,"phase","title");F(this,"turn",1);F(this,"selected",null);F(this,"origin",null);F(this,"originDir",0);F(this,"field",null);F(this,"moveTiles",new Set);F(this,"actionTiles",new Set);F(this,"skillTiles",new Set);F(this,"areaTiles",new Set);F(this,"areaKind",null);F(this,"forecast",null);F(this,"inspect",null);F(this,"floats",[]);F(this,"busyFlag",!1);F(this,"log","");F(this,"missionIndex",0);F(this,"loseKind","wipe");F(this,"intel","M");F(this,"power","M");F(this,"inventory",tn(Ci));F(this,"missionStartInventory",tn(Ci));F(this,"pendingItem",null);F(this,"m1DropGiven",!1);F(this,"modalKind","off");F(this,"paused",!1);F(this,"pauseOpen",!1);F(this,"vnOpen",!1);F(this,"vnDone",null);F(this,"introPlayed",new Set);F(this,"m1MidBeatPlayed",!1);F(this,"renderer");F(this,"input");F(this,"hudTurn",xt("hud-turn"));F(this,"hudPhase",xt("hud-phase"));F(this,"hudSub",xt("hud-sub"));F(this,"chip",xt("unit-chip"));F(this,"chipMark",xt("chip-mark"));F(this,"chipName",xt("chip-name"));F(this,"chipMeta",xt("chip-meta"));F(this,"chipExtra",xt("chip-extra"));F(this,"chipHp",xt("chip-hp"));F(this,"chipHpFill",xt("chip-hp-fill"));F(this,"forecastEl",xt("forecast"));F(this,"logEl",xt("log"));F(this,"title",xt("title"));F(this,"briefing",xt("briefing"));F(this,"result",xt("result"));F(this,"resultKicker",xt("result-kicker"));F(this,"resultTitle",xt("result-title"));F(this,"resultBody",xt("result-body"));F(this,"modal",xt("modal"));F(this,"modalKicker",xt("modal-kicker"));F(this,"modalTitle",xt("modal-title"));F(this,"modalBody",xt("modal-body"));F(this,"confirmEl",xt("confirm"));F(this,"confirmText",xt("confirm-text"));F(this,"btnCancel",xt("btn-cancel"));F(this,"btnWait",xt("btn-wait"));F(this,"btnSkill",xt("btn-skill"));F(this,"skillPressed",!1);F(this,"vnPressed",!1);F(this,"vnClosedAt",-1e9);F(this,"btnConfirm",xt("btn-confirm"));F(this,"dockEl",xt("dock"));F(this,"btnEnd",xt("btn-end"));F(this,"btnNext",xt("btn-next"));F(this,"btnRotate",xt("btn-rotate"));F(this,"btnPause",xt("btn-pause"));F(this,"btnBag",xt("btn-bag"));F(this,"btnContinue",xt("btn-continue"));F(this,"btnMute",xt("btn-mute"));F(this,"btnPauseNext",xt("btn-pause-next"));F(this,"pauseEl",xt("pause"));F(this,"vn",xt("vn"));F(this,"vnBust",xt("vn-bust"));F(this,"vnPortraits",{Mara:new Image,Dana:new Image,Priya:new Image});F(this,"vnBox",xt("vn-box"));F(this,"vnName",xt("vn-name"));F(this,"vnText",xt("vn-text"));F(this,"titleBuild",xt("title-build"));F(this,"camHint",xt("cam-hint"));F(this,"hudFloats",[this.btnEnd,this.btnRotate,this.btnPause,this.btnBag,this.camHint]);F(this,"pendingSlot",null);F(this,"pendingQuit",!1);F(this,"pendingJump",null);F(this,"acting",!1);F(this,"forecastGen",0);F(this,"confirmPressGen",-1);F(this,"pendingTap",null);F(this,"rangeHintTimer",0);this.preloadVnPortraits(),this.renderer=new lv(t),L_(),this.input=new Qu(t,this.renderer),this.input.onTap=(e,n)=>this.onTap(e,n),this.map=new Gr(this.mission.map),this.resetBattle(),this.phase="title",this.briefing.hidden=!0,this.title.hidden=!1,window.addEventListener("resize",()=>{const e=this.renderer.w;this.renderer.resize(),Math.abs(this.renderer.w-e)>1&&this.inBattleView()&&!this.renderer.boardFits(this.map)&&this.frameBoard()}),xt("btn-start").addEventListener("click",()=>this.begin()),xt("btn-restart").addEventListener("click",()=>this.restart()),this.btnNext.addEventListener("click",()=>this.nextMission()),this.btnCancel.addEventListener("click",()=>this.cancel()),this.btnWait.addEventListener("click",()=>void this.wait()),this.btnSkill.addEventListener("pointerdown",e=>{e.button===0&&(this.skillPressed=!0,this.armSkill())}),this.btnSkill.addEventListener("click",e=>{const n=this.skillPressed;this.skillPressed=!1,!(n&&e.detail!==0)&&this.armSkill()}),this.btnConfirm.addEventListener("pointerdown",e=>{e.button===0&&(e.stopPropagation(),this.pressConfirm())}),this.btnConfirm.addEventListener("keydown",e=>{e.key!=="Enter"&&e.key!==" "||e.repeat||(e.preventDefault(),e.stopPropagation(),this.pressConfirm())}),this.btnConfirm.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),(e.detail===0||this.confirmPressGen===this.forecastGen)&&this.pressConfirm()}),this.btnEnd.addEventListener("click",()=>void this.endTurn()),this.btnRotate.addEventListener("click",()=>this.rotateMap()),this.btnPause.addEventListener("click",()=>this.openPause()),this.btnBag.addEventListener("click",()=>this.openBagFromHud()),xt("btn-new").addEventListener("click",()=>this.newGame()),this.btnContinue.addEventListener("click",()=>this.continueGame()),xt("btn-load").addEventListener("click",()=>this.openSaves("load")),this.chip.addEventListener("click",()=>this.chip.classList.toggle("open")),xt("board").addEventListener("pointerdown",()=>this.chip.classList.remove("open")),xt("btn-bag-title").addEventListener("click",()=>this.openBag()),xt("btn-refresh").addEventListener("click",()=>void this.refreshApp()),xt("btn-brief-title").addEventListener("click",()=>this.goTitle()),xt("btn-result-title").addEventListener("click",()=>this.goTitle()),xt("btn-resume").addEventListener("click",()=>this.closePause()),xt("btn-pause-save").addEventListener("click",()=>this.openSaves("save")),xt("btn-pause-load").addEventListener("click",()=>this.openSaves("load")),this.btnMute.addEventListener("click",()=>this.toggleMute()),this.btnPauseNext.addEventListener("click",()=>this.requestNextMission()),this.vn.addEventListener("pointerdown",e=>{e.button!==0||!this.vnDone||(this.vnPressed=!0,this.advanceVn())}),this.vn.addEventListener("click",e=>{const n=this.vnPressed;this.vnPressed=!1,!(n&&e.detail!==0)&&this.advanceVn()}),this.vn.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.advanceVn())}),document.addEventListener("keydown",e=>{if(!(e.key!=="Escape"||e.repeat)){if(!this.confirmEl.hidden){e.preventDefault(),this.confirmNo();return}if(this.modalKind!=="off"){e.preventDefault(),this.closeModal();return}if(this.pauseOpen){e.preventDefault(),this.closePause();return}this.vnOpen||!this.title.hidden||!this.briefing.hidden||this.playable()&&(e.preventDefault(),this.cancel())}}),document.querySelectorAll("[data-test-mission]").forEach(e=>{e.addEventListener("click",()=>this.jumpToMission(Number(e.dataset.testMission)))}),xt("btn-quit-title").addEventListener("click",()=>this.quitToTitle()),xt("modal-close").addEventListener("click",()=>this.closeModal()),xt("confirm-yes").addEventListener("click",()=>this.confirmYes()),xt("confirm-no").addEventListener("click",()=>this.confirmNo()),this.bindSeg("seg-intel",e=>{this.intel=e}),this.bindSeg("seg-power",e=>{this.power=e}),this.modalBody.addEventListener("click",e=>this.onModalClick(e)),this.titleBuild.textContent=`版本 ${uh}　${fv}`,this.syncMuteBtn(),jt.setBgm("title"),this.refreshContinue(),this.installDebugHook()}get mission(){return oi[this.missionIndex]??oi[0]}get busy(){return this.busyFlag}set busy(t){this.busyFlag=t,this.refreshBusyButtons()}refreshBusyButtons(){const t=this.busyFlag,e=this.selected,n=!!e&&this.phase==="select";this.btnCancel.disabled=!e&&!this.inspect&&this.phase!=="itemAim"||this.phase==="enemy"||t,this.btnWait.disabled=!n||t,this.btnSkill.disabled=!e||!e.skillName||e.skillUsed||e.actedThisTurn||t||this.phase!=="select"&&this.phase!=="skillAim",this.btnConfirm.disabled=this.phase!=="forecast"||t||this.acting||!this.forecast,this.btnEnd.disabled=t,this.btnPauseNext.disabled=t;const s=this.playable()&&!!e&&!e.actedThisTurn&&!t;for(const r of this.modalBody.querySelectorAll("button.use"))r.disabled=!s;for(const r of this.modalBody.querySelectorAll("button.ally-row"))r.disabled=t}async waitMs(t){const e=performance.now()+t;for(;performance.now()<e;){for(;this.paused;)await Or(40);const n=e-performance.now();if(n<=0)break;await Or(Math.min(40,n))}}start(){const t=/(?:^|[?&])shot(?:=|$|&)/.test(location.search)||location.hash.includes("shot"),e=()=>{this.floats=this.floats.filter(s=>performance.now()-s.born<s.life),this.renderer.draw(this.map,this.units,{move:this.phase==="select"?this.moveTiles:new Set,area:this.overlayArea(),hot:this.overlayHot(),areaKind:this.overlayKind(),selected:this.selected,target:this.forecast?.target??null,inspect:this.inspectPos(),phase:this.phase},this.floats),this.fadeHudOverBodies()};this.syncUi(),(()=>{if(t){this.renderer.forceSize(390,640),this.renderer.centerOn(this.units,this.map);for(let a=0;a<8;a++)e();const r=document.createElement("img");r.alt="board",r.src=this.renderer.canvas.toDataURL("image/png"),r.style.cssText="position:absolute;left:0;right:0;top:48px;width:100%;height:auto;z-index:1;pointer-events:none",this.renderer.canvas.insertAdjacentElement("afterend",r);return}const s=()=>{e(),this.flushPendingTap(),requestAnimationFrame(s)};requestAnimationFrame(s)})()}fadeHudOverBodies(){const t=this.renderer.canvas.getBoundingClientRect();for(const e of this.hudFloats){if(e.hidden)continue;const n=e.getBoundingClientRect();let s=!1;for(const r of this.renderer.bodyStamps.values()){const a=r.fig,o=t.left+a.x,l=t.top+a.y,c=Math.max(n.left,o),h=Math.min(n.right,o+a.w),f=Math.max(n.top,l),u=Math.min(n.bottom,l+a.h);if(h>c&&u>f){s=!0;break}}e.classList.toggle("over-unit",s)}}applyHash(){const t=location.hash.replace("#","");if(t==="inv"){this.openBag();return}if(t==="save"){this.openSaves("load");return}if(t==="m3"||t==="play3"){if(this.missionIndex=2,this.resetBattle(),this.title.hidden=!0,t==="m3"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(t==="m4"||t==="play4"){if(this.missionIndex=3,this.resetBattle(),this.title.hidden=!0,t==="m4"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(t==="m5"||t==="play5"){if(this.missionIndex=4,this.resetBattle(),this.title.hidden=!0,t==="m5"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(t==="m2"||t==="play2"||t==="inspect"||t==="play2rot"){if(this.missionIndex=1,this.resetBattle(),this.title.hidden=!0,t==="m2"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin(),t==="play2rot"&&(this.renderer.yaw=Math.PI/2,this.renderer.centerOn(this.units,this.map));const e=this.units.find(n=>n.id==="dana");if(e&&t!=="inspect"&&(e.acted=!0),t==="inspect"){const n=this.units.find(s=>s.id==="beckett")??this.units.find(s=>s.team==="enemy");n&&(this.inspect={kind:"unit",unit:n},this.syncUi())}else{const n=this.units.find(s=>s.id==="mara");n&&this.selectUnit(n)}return}if(t==="play"||t==="brief"){if(this.title.hidden=!0,this.resetBattle(),t==="brief"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();const e=this.units.find(s=>s.id==="mara");e&&this.selectUnit(e);const n=this.units.find(s=>s.id==="dana");n&&(n.acted=!0)}}bindSeg(t,e){const n=xt(t);n.addEventListener("click",s=>{const r=s.target.closest("button");if(!r)return;const a=r.getAttribute("data-v");if(!(a!=="L"&&a!=="M"&&a!=="H")){for(const o of n.querySelectorAll("button"))o.classList.toggle("on",o===r);e(a)}})}inspectPos(){const t=this.inspect;if(!t)return null;if(t.kind==="unit")return{x:t.unit.x,y:t.unit.y};if(t.kind==="object"){const e=this.map.objects.find(n=>n.id===t.id);return e?{x:e.x,y:e.y}:null}return{x:t.tile.x,y:t.tile.y}}fillBriefing(){const t=this.mission;xt("brief-num").textContent=t.number,xt("brief-loc").textContent=t.loc;const e=xt("brief-body");e.innerHTML="";for(const o of t.paragraphs){const l=document.createElement("p");l.textContent=o,e.appendChild(l)}const n=xt("brief-conds");n.innerHTML="";const s=document.createElement("li");s.innerHTML="<span>勝利</span>",s.append(t.winCond);const r=document.createElement("li");r.innerHTML="<span>失敗</span>",r.append(t.loseCond),n.append(s,r);const a=xt("brief-voices");a.innerHTML="";for(const o of t.voices){const l=document.createElement("p"),c=document.createElement("b");c.textContent=o.name,l.append(c,`「${o.line}」`),a.appendChild(l)}this.hudSub.textContent=t.hudSub}preloadVnPortraits(){for(const t of Object.keys(Da)){const e=this.vnPortraits[t];e.decoding="async","fetchPriority"in e&&(e.fetchPriority="high"),e.src=Da[t]}}portraitSettled(t){return t.complete&&t.naturalWidth===0?Promise.resolve():t.decode().then(()=>{},()=>{})}waitForSpeakerPortrait(t){const e=Promise.all([this.portraitSettled(this.vnPortraits[t]),this.portraitSettled(this.vnBust)]).then(()=>{});return Promise.race([e,Or(dv)])}setVnBust(t){const e=this.vnBust;e.style.visibility="",e.onerror=()=>{if(!e.src.includes("?r=")){e.src=`${t}?r=${Date.now()}`;return}e.style.visibility="hidden"},e.onload=()=>{e.naturalWidth===0&&(e.style.visibility="hidden")},e.src=t}showVn({speaker:t,side:e,text:n}){return this.clearPendingTap(),this.vnOpen=!0,this.vn.classList.toggle("right",e==="right"),this.vn.classList.toggle("left",e!=="right"),this.vnBust.decoding="async","fetchPriority"in this.vnBust&&(this.vnBust.fetchPriority="high"),this.setVnBust(Da[t]),this.vnBust.alt="",this.vnName.textContent=t,this.vnText.textContent=n,this.waitForSpeakerPortrait(t).then(()=>(this.vn.hidden=!1,this.syncUi(),new Promise(s=>{this.vnDone=s,this.vnBox.focus({preventScroll:!0})})))}advanceVn(){const t=this.vnDone;t&&(this.vnDone=null,this.vnOpen=!1,this.vn.hidden=!0,this.vnClosedAt=performance.now(),this.vnBust.onerror=null,this.vnBust.removeAttribute("src"),t(),this.syncUi())}async playMissionIntro(){if(this.missionIndex<0||this.missionIndex>=oi.length||this.introPlayed.has(this.missionIndex))return;this.introPlayed.add(this.missionIndex);const t=["left","right","left"],e=this.mission.voices.slice(0,3).map((n,s)=>({speaker:n.name,side:t[s]??"left",text:n.line}));for(const n of e)await this.showVn(n)}resetBattle(){const t=this.mission;this.map=new Gr(t.map),this.units=[...yl(t.starts),...t.makeOthers()];for(const e of this.units)zu(e,this.power);this.phase="briefing",this.turn=1,this.clearSel(),this.inspect=null,this.busy=!1,this.acting=!1,this.clearPendingTap(),this.loseKind="wipe",this.pendingItem=null,this.introPlayed.delete(this.missionIndex),this.m1MidBeatPlayed=!1,this.vnOpen=!1,this.vnDone=null,this.vn.hidden=!0,this.log="點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放並旋轉，上下俯仰。",this.renderer.yaw=0,this.renderer.setPitch(bs),this.frameBoard(),this.fillBriefing()}newGame(){this.missionIndex=0,this.inventory=tn(Ci),this.missionStartInventory=tn(Ci),this.m1DropGiven=!1,this.resetBattle(),this.title.hidden=!0,this.briefing.hidden=!1,this.phase="briefing",jt.setBgm("title"),this.syncUi(),this.autosave()}continueGame(){const t=hh(di());t&&this.applySave(t)}frameBoard(){this.renderer.fitToMap(this.map)}inBattleView(){return this.title.hidden&&this.briefing.hidden&&this.phase!=="title"&&this.phase!=="briefing"}async begin(){this.missionStartInventory=tn(this.inventory),this.briefing.hidden=!0,this.title.hidden=!0,this.phase="select",jt.setBgm("battle"),this.applyDebugBattleScenario(),this.frameBoard(),this.busy=!this.introPlayed.has(this.missionIndex),this.syncUi(),this.autosave(),this.busy&&await this.playMissionIntro(),this.clearPendingTap(),this.busy=!1,this.applyDebugBattleScenario(),this.syncUi(),this.autosave()}restart(){this.inventory=tn(this.missionStartInventory),this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi()}nextMission(){this.missionIndex>=oi.length-1||(this.missionIndex+=1,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi(),this.autosave())}rotateMap(){this.phase==="briefing"||this.phase==="title"||this.renderer.rotate(this.map)}clearSel(){this.selected=null,this.origin=null,this.field=null,this.moveTiles.clear(),this.actionTiles.clear(),this.skillTiles.clear(),this.areaTiles.clear(),this.areaKind=null,this.forecast=null,this.pendingItem=null,this.bumpForecast()}locked(){const t=this.selected;return!!t&&t.movedThisTurn}selectUnit(t){t.team!=="player"||t.acted||t.dead||t.npc||(this.selected=t,t.movedThisTurn||(this.origin=null),this.forecast=null,this.clearPendingTap(),this.inspect=null,this.pendingItem=null,this.showCommand(t))}refreshRanges(t){if(this.skillTiles.clear(),t.movedThisTurn?(this.field=null,this.moveTiles.clear()):(this.field=Ls(t,this.map,this.units),this.moveTiles=new Set([...this.field.cost.keys()].filter(e=>e!==Ft(t.x,t.y)))),t.actedThisTurn)this.actionTiles=new Set,this.areaTiles=new Set,this.areaKind=null;else{this.actionTiles=Wu(t,this.map,this.units);for(const e of this.map.objects)e.gone||e.kind!=="destructible"||Ji(t,t.x,t.y,e.x,e.y,this.map)&&this.actionTiles.add(Ft(e.x,e.y));this.areaTiles=hr(t,this.map),this.areaKind="attack"}}overlayArea(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"?this.areaTiles:new Set}overlayHot(){return this.phase==="itemAim"?this.skillTiles:this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?this.skillTiles:this.phase==="select"||this.phase==="forecast"?this.actionTiles:new Set}overlayKind(){return this.phase==="itemAim"?"item":this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?"skill":this.phase==="select"||this.phase==="forecast"?this.areaKind:null}canStillMove(t){return this.phase==="enemy"?!1:t.team==="player"&&!t.dead&&!t.npc&&!t.acted&&!t.movedThisTurn}commandHint(t){const e=[];return this.canStillMove(t)&&e.push("可移動"),!t.acted&&!t.actedThisTurn&&e.push("可攻擊／技能／道具"),e.length?e.join("　"):"結束或待機"}hintForCurrentState(){if(this.phase==="enemy")return"敵軍行動中";const t=this.selected;return this.phase==="skillAim"&&t?t.skillHint:this.phase==="itemAim"&&this.pendingItem?`${li[this.pendingItem].name}　選我軍單位`:this.phase==="select"&&t?this.commandHint(t):"我軍階段"}scrubHints(){if(!(this.phase==="select"||this.phase==="skillAim"||this.phase==="itemAim"||this.phase==="forecast"||this.phase==="enemy"))return;const e=this.phase!=="forecast"&&this.log.startsWith("預覽"),n=this.log.includes("可移動")&&!(this.phase==="select"&&this.selected&&this.canStillMove(this.selected));!e&&!n||(this.log=this.hintForCurrentState())}showCommand(t){if(this.phase==="enemy"){this.log="敵軍行動中",this.syncUi();return}this.forecast=null,this.bumpForecast(),this.refreshRanges(t),this.phase="select",this.log=this.commandHint(t),this.syncUi()}async commitMove(t){const e=this.selected;if(this.inputMode()!=="move"||this.phase!=="select"||!e||!this.field||this.busy||e.movedThisTurn)return;const n=Ft(t.x,t.y);if(!this.field.cost.has(n)||t.x===e.x&&t.y===e.y)return;this.busy=!0,jt.play("move"),this.origin={x:e.x,y:e.y},this.originDir=e.dir;const s=this.clampPathEnd(e,ii(this.field,t));e.anim="walk",e.animStart=performance.now();for(let r=1;r<s.length;r++)e.dir=os(s[r-1],s[r]),e.x=s[r].x,e.y=s[r].y,await this.waitMs(fh);if(e.x=Math.round(e.x),e.y=Math.round(e.y),e.anim="idle",e.movedThisTurn=!0,this.tryPickup(e),this.setIdle(),e.actedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}clearPendingTap(){this.pendingTap=null}bumpForecast(){this.forecastGen+=1,this.confirmPressGen=-1}pressConfirm(){this.btnConfirm.disabled||this.phase!=="forecast"||!this.forecast||this.busy||this.acting||(this.confirmPressGen=this.forecastGen,this.confirm())}openForecast(t){this.forecast=t,this.phase="forecast",this.bumpForecast(),this.clearPendingTap(),this.log=t.detail,this.inspect=null,this.syncUi()}pendingTapReady(){return this.playable()&&!this.pauseOpen&&!this.vnOpen&&this.modalKind==="off"&&this.confirmEl.hidden}setIdle(){this.busy=!1}inputMode(){return this.phase==="itemAim"?"item-target":this.phase==="skillAim"?"skill-target":this.phase==="forecast"&&this.forecast?this.forecast.kind==="skill"?"skill-target":"attack-target":this.phase==="select"&&this.selected&&!this.selected.movedThisTurn?"move":"normal"}pointInEl(t,e){const n=e.getBoundingClientRect();return n.width<=0||n.height<=0?!1:t.x>=n.left&&t.x<n.right&&t.y>=n.top&&t.y<n.bottom}releaseHitsHud(t){const e=[this.dockEl,this.btnCancel,this.btnWait,this.btnSkill,this.btnEnd,this.btnRotate,this.btnBag,this.btnPause];for(const n of e)if(this.pointInEl(t,n))return!0;return!this.forecastEl.hidden&&this.pointInEl(t,this.forecastEl)}noteSelectTap(t){if(this.pendingTap=null,!this.playable()||this.vnOpen||this.pauseOpen)return;const e=this.phase==="forecast"&&(this.busy||this.acting);if(this.phase!=="select"&&!e)return;if(!e){const s=this.inputMode();if(s==="skill-target"||s==="attack-target"||s==="item-target")return}const n=this.renderer.hitUnit(t.x,t.y,this.map,this.units);!n||n.dead||n.team!=="player"||n.npc||n.acted||!e&&this.selected&&this.locked()&&this.selected.id!==n.id||(this.pendingTap={p:{x:t.x,y:t.y}})}tapOnSelected(t,e){const n=this.selected;if(!n||n.dead)return!1;if(e)return e.id===n.id;const s=this.renderer.bodyStamps.get(n.id);if(!s||!(s.fig.w>0)||!(s.fig.h>0))return!1;const r=1;if(t.x<s.fig.x-r||t.y<s.fig.y-r||t.x>s.fig.x+s.fig.w+r||t.y>s.fig.y+s.fig.h+r)return!1;const a=this.renderer.hitTile(t.x,t.y,this.map);if(!a)return!0;const o=this.unitAt(a.x,a.y);if(o)return o.id===n.id;const l=this.map.objAt(a.x,a.y);return!l||l.gone}flushPendingTap(){const t=this.pendingTap;if(!t||this.busy||this.acting)return;if(this.phase!=="select"||!this.pendingTapReady()){this.phase!=="select"&&this.pendingTapReady()&&(this.pendingTap=null);return}this.pendingTap=null;const e=this.renderer.hitUnit(t.p.x,t.p.y,this.map,this.units),n=this.selected;if(n&&this.tapOnSelected(t.p,e)){this.refreshRanges(n);return}!e||e.dead||e.team!=="player"||e.npc||e.acted||this.selected&&this.locked()&&this.selected.id!==e.id||this.selectUnit(e)}onTap(t,e){if(this.pauseOpen||this.vnOpen||performance.now()-this.vnClosedAt<xv)return;if(this.pointInEl(e,this.btnConfirm)){this.pressConfirm();return}if(this.releaseHitsHud(e))return;if(this.busy||this.acting){this.noteSelectTap(t);return}if(this.phase==="forecast"&&this.forecast&&this.forecastGen>0&&this.confirmPressGen===this.forecastGen||(this.pendingTap=null,this.phase==="title"||this.phase==="briefing"||this.phase==="enemy"||this.phase==="victory"||this.phase==="defeat"))return;this.dismissRangeHint();const s=this.phase==="select"||this.phase==="forecast"||this.phase==="skillAim"||this.phase==="itemAim"?this.renderer.hitUnit(t.x,t.y,this.map,this.units):null,r=s?{x:s.x,y:s.y}:this.renderer.hitTile(t.x,t.y,this.map);if(this.phase==="forecast"){(!r||!this.forecast||r.x!==this.forecast.target.x||r.y!==this.forecast.target.y)&&this.backFromForecast();return}if(this.phase==="skillAim"){r?this.trySkillTarget(r):this.backFromSkill();return}if(this.phase==="itemAim"){r?this.tryItemTarget(r):this.backFromItem();return}if(this.phase!=="select")return;if(!r){if(this.inspect){this.inspect=null,this.syncUi();return}this.selected&&!this.locked()&&(this.clearSel(),this.syncUi());return}const a=this.unitAt(r.x,r.y),o=this.selected,l=this.map.objAt(r.x,r.y);if(o&&!o.actedThisTurn&&a&&this.actionTiles.has(Ft(a.x,a.y))){this.openForecast(za(o,a,this.map));return}if(o&&!o.actedThisTurn&&l&&!l.gone&&l.kind==="destructible"&&this.actionTiles.has(Ft(l.x,l.y))){this.openForecast({kind:"object",actor:o,target:o,label:`${o.name} → ${l.label}`,detail:l.type==="barrel"?`破壞油桶　鄰格受到 ${zr} 傷害`:"破壞此物",dmg:Math.max(1,o.atk+(o.atkBuff||0)),heal:0,skip:!1,face:"front",objectId:l.id});return}if(o&&l&&!l.gone&&Math.abs(o.x-l.x)+Math.abs(o.y-l.y)<=1){if(l.kind==="pickup"){this.tryPickupAt(o,l);return}if(l.kind==="trigger"&&!l.used&&!o.actedThisTurn){this.useTrigger(o,l);return}}if(o&&(this.tapOnSelected(t,s)||!s&&a?.id===o.id)){this.refreshRanges(o);return}if(this.inputMode()==="move"&&o&&!o.movedThisTurn&&this.moveTiles.has(Ft(r.x,r.y))&&(!a||a.id===o.id)){if(a&&a.id===o.id){this.inspectUnit(a);return}this.inspect=null,this.commitMove(r);return}if(a&&a.team==="player"&&!a.acted&&!a.npc&&(!o||!this.locked())){this.selectUnit(a);return}if(o&&!o.actedThisTurn&&a&&this.attackOutOfRange(o,a)){this.flashOutOfRange();return}a?this.inspectUnit(a):l&&!l.gone?this.inspectObject(l.id):o&&!this.locked()?(this.inspect=null,this.clearSel(),this.syncUi()):this.inspectTile(this.map.tile(r.x,r.y))}inspectUnit(t){this.inspect={kind:"unit",unit:t},this.log=`${t.name}　${dh[ni(t)]}`,this.syncUi()}inspectTile(t){this.inspect={kind:"tile",tile:t},this.log=Oa[t.terrain],this.syncUi()}inspectObject(t){this.inspect={kind:"object",id:t};const e=this.map.objects.find(n=>n.id===t);this.log=e?e.label:"",this.syncUi()}trySkillTarget(t){const e=this.selected;if(!e)return;const s=Ha(e,this.map,this.units).find(r=>r.x===t.x&&r.y===t.y);if(s){this.openForecast(wl(e,s,this.map));return}if(this.unitAt(t.x,t.y)){this.flashOutOfRange();return}jt.play("miss"),this.backFromSkill()}attackOutOfRange(t,e){return e.dead||e.id===t.id?!1:(ko(t,e)||t.team==="player"&&!t.npc&&e.stance!=="friendly")&&!this.actionTiles.has(Ft(e.x,e.y))}flashOutOfRange(){this.rangeHintTimer&&window.clearTimeout(this.rangeHintTimer),this.inspect=null,this.log=Fa,jt.play("miss"),this.rangeHintTimer=window.setTimeout(()=>{this.rangeHintTimer=0,this.log===Fa&&(this.log=this.hintForCurrentState(),this.syncUi())},pv),this.syncUi()}dismissRangeHint(){this.rangeHintTimer&&(window.clearTimeout(this.rangeHintTimer),this.rangeHintTimer=0),this.log===Fa&&(this.log=this.hintForCurrentState(),this.syncUi())}tryItemTarget(t){const e=Hr(this.units).find(n=>n.x===t.x&&n.y===t.y);if(!e){jt.play("miss"),this.backFromItem();return}this.applyItem(e)}backFromForecast(){const t=this.selected,e=!!t&&this.skillTiles.size>0&&this.forecast?.kind==="skill";if(this.forecast=null,this.bumpForecast(),this.clearPendingTap(),!t){this.phase="select",this.log=this.hintForCurrentState(),this.syncUi();return}if(e){this.phase="skillAim",this.log=t.skillHint,this.syncUi();return}this.showCommand(t)}backFromSkill(){this.skillTiles.clear(),this.forecast=null,this.bumpForecast(),this.clearPendingTap(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}backFromItem(){this.pendingItem=null,this.skillTiles.clear(),this.forecast=null,this.bumpForecast(),this.clearPendingTap(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}cancel(){if(!this.busy){if(this.dismissRangeHint(),this.clearPendingTap(),this.phase==="forecast"){this.backFromForecast();return}if(this.phase==="skillAim"){this.backFromSkill();return}if(this.phase==="itemAim"){this.backFromItem();return}if(this.inspect){this.inspect=null,this.syncUi();return}if(this.selected&&this.origin&&this.selected.movedThisTurn){this.selected.x=this.origin.x,this.selected.y=this.origin.y,this.selected.dir=this.originDir,this.selected.movedThisTurn=!1,this.origin=null,this.showCommand(this.selected);return}this.selected&&!this.locked()&&(this.clearSel(),this.phase="select",this.syncUi())}}armSkill(){const t=this.selected;if(!t||this.busy||t.skillUsed||!t.skillName||t.actedThisTurn||this.phase!=="select"&&this.phase!=="skillAim")return;const e=Ha(t,this.map,this.units);this.skillTiles=new Set(e.map(n=>Ft(n.x,n.y))),this.areaTiles=Xu(t,this.map),this.areaKind="skill",this.actionTiles.clear(),this.moveTiles.clear(),this.forecast=null,this.bumpForecast(),this.clearPendingTap(),this.inspect=null,this.phase="skillAim",this.log=t.skillHint,this.syncUi()}async wait(){!this.selected||this.busy||this.phase==="select"&&await this.finishUnit()}async confirm(){if(this.phase!=="forecast"||!this.forecast||this.busy||this.acting)return;const t=this.forecast;this.acting=!0,this.busy=!0,this.clearPendingTap(),this.syncUi();const e=t.actor;if(t.kind==="object"&&t.objectId){const r=this.map.objects.find(a=>a.id===t.objectId);if(!r||r.gone){this.acting=!1,this.forecast=null,this.bumpForecast(),this.setIdle(),this.showCommand(e);return}if(e.dir=os(e,r),e.anim="attack",e.animStart=performance.now(),e.lunge=1,jt.play("attack"),await this.waitMs(xr),r.hp=Math.max(0,r.hp-t.dmg),jt.play("hit"),this.spawnFloat(e,`${t.dmg}`,"#ffd0d8"),this.log=`${e.name} 攻擊 ${r.label}`,e.atkBuff&&(e.atkBuff=0),r.hp<=0&&(r.gone=!0,this.log=`${r.label} 被破壞。`,r.type==="barrel"&&this.blastBarrel(r.x,r.y)),e.actedThisTurn=!0,e.lunge=0,e.anim="idle",await this.waitMs(Ua),this.forecast=null,this.bumpForecast(),this.acting=!1,this.setIdle(),this.checkEnd())return;if(e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave();return}const n=t.target;n.stance==="neutral"&&!t.heal&&El(n),(n.x!==e.x||n.y!==e.y)&&(e.dir=os(e,n));const s=t.kind==="skill"&&(e.skillKind==="spark"||e.skillKind==="heal"||e.skillKind==="halt");if(e.anim=s?"cast":"attack",e.animStart=performance.now(),e.lunge=1,t.heal?jt.play("heal"):jt.play(t.kind==="skill"?"skill":"attack"),await this.waitMs(s?_r:xr),t.heal){const r=n.hp;n.hp=Math.min(n.maxHp,n.hp+t.heal);const a=n.hp-r;this.spawnFloat(n,`+${a}`,"#7dffb3"),this.log=`${e.name} 為 ${n.name} 回復 ${a}　生命 ${r} → ${n.hp} / ${n.maxHp}`,this.syncUi()}else n.hp=Math.max(0,n.hp-t.dmg),jt.play("hit"),this.spawnFloat(n,`${t.dmg}`,"#ffd0d8"),this.log=`${e.name} 對 ${n.name} 造成 ${t.dmg} 傷害`,e.atkBuff&&(e.atkBuff=0),t.skip&&(n.skipNext=!0,this.log+="　攔住生效"),n.hp<=0&&(n.dead=!0,this.spawnFloat(n,"倒下","#ff8aa0"),this.log=`${n.name} 倒下。`,this.tryEnemyDrop(n)),this.syncUi();if(t.kind==="skill"&&(e.skillUsed=!0),e.actedThisTurn=!0,e.lunge=0,e.anim="idle",await this.waitMs(Ua),this.forecast=null,this.skillTiles.clear(),this.bumpForecast(),this.acting=!1,this.setIdle(),!this.checkEnd()){if(e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}async finishUnit(){if(this.busy=!0,this.selected&&(this.selected.acted=!0,this.selected.lunge=0),this.clearSel(),this.inspect=null,this.phase="select",this.syncUi(),await this.waitMs(Ua),this.missionIndex===0&&!this.m1MidBeatPlayed&&this.mission.midBeats?.length){this.m1MidBeatPlayed=!0;for(const t of this.mission.midBeats)await this.showVn(t)}this.setIdle(),this.syncUi(),this.autosave(),this.units.filter(t=>t.team==="player"&&!t.dead&&!t.acted&&!t.npc).length===0&&await this.endTurn()}async endTurn(){if(!this.busy){for(const t of this.units)t.team==="player"&&!t.dead&&!t.npc&&(t.acted=!0);this.clearSel(),this.inspect=null,this.clearPendingTap(),this.phase="enemy",this.log="敵軍行動中",this.syncUi(),await this.waitMs(Na),await this.runEnemy()}}async runEnemy(){this.busy=!0;const t=this.units.filter(n=>!n.dead&&!ka(n)),e=this.mission.protectId;for(let n=0;n<t.length;n++){const s=t[n];if(this.phase==="victory"||this.phase==="defeat")break;if(s.skipNext){s.skipNext=!1,s.acted=!0,this.log=`${s.name} 被攔住，無法行動。`,this.syncUi(),await this.waitMs(420),n<t.length-1&&await this.waitMs(Na);continue}const r=Yu(s,this.map,this.units,e,this.intel),a=this.clampPathEnd(s,r.path);a.length>1&&(s.anim="walk",s.animStart=performance.now());for(let o=1;o<a.length;o++)s.dir=os(a[o-1],a[o]),s.x=a[o].x,s.y=a[o].y,await this.waitMs(fh);if(s.x=Math.round(s.x),s.y=Math.round(s.y),s.anim="idle",this.tryPickup(s),r.target&&!r.target.dead){(r.target.x!==s.x||r.target.y!==s.y)&&(s.dir=os(s,r.target));const o=r.useSkill&&!s.skillUsed?wl(s,r.target,this.map):za(s,r.target,this.map),l=o.kind==="skill"&&(s.skillKind==="spark"||s.skillKind==="heal"||s.skillKind==="halt");if(s.anim=l?"cast":"attack",s.animStart=performance.now(),s.lunge=1,jt.play(o.kind==="skill"?"skill":"attack"),await this.waitMs(l?_r:xr),o.heal?(r.target.hp=Math.min(r.target.maxHp,r.target.hp+o.heal),this.spawnFloat(r.target,`+${o.heal}`,"#7dffb3"),this.log=`${s.name} 為 ${r.target.name} 回復 ${o.heal}`):(r.target.stance==="neutral"&&El(r.target),r.target.hp=Math.max(0,r.target.hp-o.dmg),jt.play("hit"),this.spawnFloat(r.target,`${o.dmg}`,"#ff4d6d"),this.log=`${s.name} 對 ${r.target.name} 造成 ${o.dmg} 傷害`,o.skip&&(r.target.skipNext=!0),r.target.hp<=0&&(r.target.dead=!0,this.spawnFloat(r.target,"倒下","#ff8aa0"),this.log=`${r.target.name} 倒下。`,this.tryEnemyDrop(r.target))),o.kind==="skill"&&(s.skillUsed=!0),await this.waitMs(120),s.lunge=0,s.anim="idle",this.checkEnd()){this.busy=!1;return}}else await this.waitMs(80);s.acted=!0,n<t.length-1&&await this.waitMs(Na)}for(const n of this.units)n.acted=!1,n.skillUsed=!1,n.movedThisTurn=!1,n.actedThisTurn=!1,n.anim="idle";this.turn+=1,this.phase="select",this.clearPendingTap(),this.busy=!1,this.log="我軍階段",this.syncUi(),this.autosave()}checkEnd(){const t=this.mission.protectId;return t&&this.units.find(s=>s.id===t)?.dead?(this.loseKind="protect",this.lose(),!0):this.units.find(n=>n.id===this.mission.eliteId)?.dead?(this.win(),!0):this.units.every(n=>n.team!=="player"||n.dead||n.npc)?(this.loseKind="wipe",this.lose(),!0):!1}debugHooksEnabled(){return new URLSearchParams(location.search).get("debug")==="1"}applyDebugBattleScenario(){if(!this.debugHooksEnabled())return;const t=new URLSearchParams(location.search).get("scenario");if(t==="flank"){this.applyFlankScenario();return}if(t==="occlude"){this.applyOccludeScenario();return}if(t!=="heal"||this.mission.id!=="m1"||this.phase!=="select")return;const e=this.units.find(h=>h.id==="priya"),n=this.units.find(h=>h.id==="mara"),s=this.units.find(h=>h.id==="dana");if(!e||!n||!s)return;const r={x:4,y:10},a={x:5,y:10},o={x:7,y:10},l=[r,a,o],c=new Set(["priya","mara","dana"]);for(const h of l){const f=this.map.tile(h.x,h.y);if(!f||f.h!==0||!this.map.walkable(h.x,h.y)||this.units.some(d=>!d.dead&&!c.has(d.id)&&d.x===h.x&&d.y===h.y))return}e.x=r.x,e.y=r.y,n.x=a.x,n.y=a.y,s.x=o.x,s.y=o.y,n.hp=Math.max(1,Math.floor(n.maxHp/2));for(const h of[e,n,s])h.acted=!1,h.skillUsed=!1,h.movedThisTurn=!1,h.actedThisTurn=!1,h.dead=!1;this.selectUnit(e)}applyFlankScenario(){if(this.mission.id!=="m1"||this.phase!=="select")return;const t=this.units.find(o=>o.id==="e4"),e=this.units.find(o=>o.id==="mara"),n=this.units.find(o=>o.id==="dana"),s=this.units.find(o=>o.id==="priya");if(!t||!e||!n||!s)return;const r=[[t,7,9],[e,6,9],[n,7,11],[s,3,11]],a=new Set(r.map(([o])=>o.id));for(const[,o,l]of r){const c=this.map.tile(o,l);if(!c||c.h!==0||!this.map.walkable(o,l)||this.units.some(h=>!h.dead&&!a.has(h.id)&&h.x===o&&h.y===l))return}for(const[o,l,c]of r)o.x=l,o.y=c,o.dead=!1,o.acted=!1,o.skillUsed=!1,o.movedThisTurn=!1,o.actedThisTurn=!1;t.dir=0,t.hp=t.maxHp,e.dir=1,n.dir=0,this.selectUnit(e)}applyOccludeScenario(){if(this.mission.id!=="m1"||this.phase!=="select")return;const t=this.units.find(m=>m.id==="mara"),e=this.units.find(m=>m.id==="dana"),n=this.units.find(m=>m.id==="priya"),s=this.units.find(m=>m.id==="crosby"),r=this.units.find(m=>m.id==="e1"),a=this.units.find(m=>m.id==="e2"),o=this.units.find(m=>m.id==="e3"),l=this.units.find(m=>m.id==="e4");if(!t||!e||!n||!s||!r||!a||!o||!l)return;const c=[[t,4,2],[e,1,5],[n,2,4],[s,8,5],[r,5,8],[a,6,4],[o,1,3],[l,8,3]],h=new Set(c.map(([m])=>m.id)),f=new Set,u=[],d=(m,x)=>f.has(Ft(m,x))||!this.map.walkable(m,x)?!1:!this.units.some(g=>!g.dead&&!h.has(g.id)&&g.x===m&&g.y===x);for(const[m,x,g]of c){let p=d(x,g)?{x,y:g}:null;if(!p){let M=1/0;for(let T=0;T<=3;T++)for(let y=-2;y<=2;y++){if(y===0&&T===0)continue;const w=x+y,b=g-T;if(!d(w,b))continue;const R=y*y+T*T;R<M&&(M=R,p={x:w,y:b})}}if(!p)return;f.add(Ft(p.x,p.y)),u.push([m,p.x,p.y])}for(const[m,x,g]of u)m.x=x,m.y=g,m.dir=2,m.dead=!1,m.acted=!1,m.skillUsed=!1,m.movedThisTurn=!1,m.actedThisTurn=!1;this.selectUnit(t)}installDebugHook(){this.debugHooksEnabled()&&(window.__yejieDebug={forceWin:()=>{this.win()},tileAtScreen:(t,e)=>this.renderer.tileAtScreen(t,e,this.map),screenOfTile:(t,e)=>this.renderer.screenOfTile(t,e,this.map)})}win(){const t=this.mission;this.phase="victory",this.clearPendingTap(),this.busy=!1,this.closePause(),jt.setBgm(null),jt.play("victory"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.remove("lose"),this.resultKicker.textContent="勝利",this.resultTitle.textContent=t.winTitle;let e=t.winBody;this.missionIndex===0&&!this.m1DropGiven&&(Br(this.inventory,"bandage",1),this.m1DropGiven=!0,e=`${t.winBody}又找到一盒繃帶。`),this.resultBody.textContent=e,this.btnNext.hidden=this.missionIndex>=oi.length-1,this.syncUi(),this.autosave()}lose(){const t=this.mission;this.phase="defeat",this.clearPendingTap(),this.busy=!1,this.closePause(),jt.setBgm(null),jt.play("defeat"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.add("lose"),this.resultKicker.textContent="失敗",this.loseKind==="protect"?(this.resultTitle.textContent=t.protectLoseTitle,this.resultBody.textContent=t.protectLoseBody):(this.resultTitle.textContent=t.loseTitle,this.resultBody.textContent=t.loseBody),this.btnNext.hidden=!0,this.syncUi(),this.autosave()}unitAt(t,e){return this.units.find(n=>!n.dead&&n.x===t&&n.y===e)}clampPathEnd(t,e){if(e.length===0)return e;const n=(a,o)=>this.units.some(l=>l.id!==t.id&&!l.dead&&l.x===a&&l.y===o),s=e[e.length-1];if(!n(s.x,s.y))return e;let r=e.length-1;for(;r>0&&n(e[r].x,e[r].y);)r--;return e.slice(0,r+1)}tryPickup(t){const e=this.map.objAt(t.x,t.y);!e||e.gone||e.kind!=="pickup"||this.collectPickup(t,e)}tryPickupAt(t,e){const n=this.map.objects.find(s=>s.id===e.id);!n||n.gone||n.kind!=="pickup"||this.collectPickup(t,n)}collectPickup(t,e){const n=e.item??"bandage";Br(this.inventory,n,1)>0?(this.spawnFloat(t,`取得 ${li[n].name}`,"#ffe08a"),this.log=`${t.name} 取得 ${li[n].name}`):this.log="背包已滿。",e.gone=!0,this.syncUi(),this.autosave()}async useTrigger(t,e){if(!(this.busy||t.actedThisTurn||e.used)){this.busy=!0,t.anim="cast",t.animStart=performance.now(),jt.play("skill"),await this.waitMs(_r),e.used=!0,e.type==="van"&&(e.gone=!0);for(const[n,s]of e.unblock)this.map.unblock(n,s);if(e.healAdj)for(const n of this.units)n.dead||Math.abs(n.x-e.x)+Math.abs(n.y-e.y)>1||n.stance!=="friendly"&&n.team!=="player"||(n.hp=Math.min(n.maxHp,n.hp+e.healAdj),this.spawnFloat(n,`+${e.healAdj}`,"#7dffb3"));if(this.log=e.type==="van"?"貨車門打開了。":"開關啟動。",t.actedThisTurn=!0,t.anim="idle",this.setIdle(),t.movedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}}blastBarrel(t,e){jt.play("hit");for(const n of this.units)n.dead||Math.abs(n.x-t)+Math.abs(n.y-e)===1&&(n.hp=Math.max(0,n.hp-zr),this.spawnFloat(n,`${zr}`,"#ff9a3c"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 被爆炸波及。`,this.tryEnemyDrop(n)))}spawnFloat(t,e,n){this.floats.push({x:t.x,y:t.y,text:e,color:n,born:performance.now(),life:900})}tryEnemyDrop(t){if(t.team!=="enemy")return;const e=t.role==="elite"?.62:.35;if(Math.random()>=e)return;const s=(Math.random()<.65?"bandage":"stim")==="bandage"?["bandage","stim"]:["stim","bandage"];for(const r of s)if(Br(this.inventory,r,1)>0){this.spawnFloat(t,`掉落 ${li[r].name}`,"#ffe08a");return}}jumpToMission(t){t<0||t>=oi.length||(this.pendingJump=null,this.inventory=tn(Ci),this.missionStartInventory=tn(Ci),this.m1DropGiven=!1,this.missionIndex=t,this.closePause(),this.closeModal(),this.result.hidden=!0,this.result.classList.remove("lose"),this.title.hidden=!0,this.briefing.hidden=!1,this.resetBattle(),this.phase="briefing",this.syncUi())}requestNextMission(){this.missionIndex>=oi.length-1||this.busy||(this.pendingJump=this.missionIndex+1,this.confirmText.textContent="跳到測試關卡 "+String((this.pendingJump??0)+1)+"？目前戰鬥不會保留。",this.confirmEl.hidden=!1)}openPause(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||(this.paused=!0,this.pauseOpen=!0,this.clearPendingTap(),this.pauseEl.hidden=!1,this.syncMuteBtn(),jt.play("pause"))}closePause(){this.pauseEl.hidden=!0,this.pauseOpen=!1,this.paused=!1}toggleMute(){jt.toggleMute(),this.syncMuteBtn()}syncMuteBtn(){this.btnMute.textContent=jt.muted?"取消靜音":"靜音"}quitToTitle(){if(!(this.playable()||this.phase==="enemy")){this.goTitle();return}this.pendingQuit=!0,this.confirmText.textContent="返回標題？進度在存檔與自動存檔裡。",this.confirmEl.hidden=!1}goTitle(){this.pendingQuit=!1,this.closePause(),this.closeModal(),this.confirmEl.hidden=!0,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!0,this.title.hidden=!1,this.phase="title",this.busy=!1,this.clearPendingTap(),this.clearSel(),this.inspect=null,jt.setBgm("title"),this.refreshContinue(),this.syncUi()}async refreshApp(){const t=xt("btn-refresh");t.disabled=!0,t.textContent="正在更新…";try{if("caches"in window){const n=await caches.keys();await Promise.all(n.map(s=>caches.delete(s)))}}catch{}try{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations();for(const s of n){s.waiting&&s.waiting.postMessage("skipWaiting");try{await s.update()}catch{}s.waiting&&s.waiting.postMessage("skipWaiting"),await s.unregister()}}}catch{}const e=new URL(location.href);e.searchParams.set("v",uh),e.searchParams.set("r",String(Date.now())),location.replace(e.toString())}playable(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"||this.phase==="itemAim"}openBagFromHud(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||this.openBag()}openBag(){this.clearPendingTap(),this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind="bag",this.modal.hidden=!1,this.modalKicker.textContent="道具",this.modalTitle.textContent="背包",this.paintBag()}paintBag(){this.modalBody.innerHTML="";const t=this.playable()&&!!this.selected&&!this.selected.actedThisTurn&&!this.busy;if(!this.inventory.length){const e=document.createElement("p");e.textContent="沒有道具。",this.modalBody.appendChild(e);return}if(this.playable()&&!this.selected){const e=document.createElement("p");e.textContent="先選單位再用道具。",this.modalBody.appendChild(e)}for(const e of this.inventory){const n=li[e.id],s=document.createElement("div");s.className="item-row";const r=document.createElement("div"),a=document.createElement("b");a.textContent=`${n.name} ×${e.qty}`;const o=document.createElement("span");if(o.textContent=n.hint,r.append(a,o),s.appendChild(r),this.playable()){const l=document.createElement("button");l.type="button",l.className="use",l.dataset.item=e.id,l.textContent="使用",l.disabled=!t,s.appendChild(l)}this.modalBody.appendChild(s)}}openSaves(t){this.clearPendingTap(),this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind=t,this.modal.hidden=!1,this.modalKicker.textContent=t==="save"?"存檔":"讀檔",this.modalTitle.textContent=t==="save"?"存檔":"讀檔",this.paintSaves()}paintSaves(){const t=di();this.modalBody.innerHTML="";for(let e=0;e<yu;e++){const n=t.slots[e],s=document.createElement("button");s.type="button",s.className=n?"slot":"slot empty",s.dataset.slot=String(e);const r=document.createElement("div"),a=document.createElement("b");a.textContent=`檔案 ${e+1}`;const o=document.createElement("span");o.textContent=n?`${n.missionName}　${uv(n.savedAt)}`:"空",r.append(a,o),s.appendChild(r),this.modalBody.appendChild(s)}}onModalClick(t){const e=t.target,n=e.closest("button.use");if(n&&this.modalKind==="bag"){const a=n.dataset.item;(a==="bandage"||a==="stim")&&this.armItem(a);return}const s=e.closest("button.ally-row");if(s&&this.modalKind==="target"){const a=s.dataset.uid,o=this.units.find(l=>l.id===a);o&&this.applyItem(o);return}const r=e.closest("button.slot");if(r&&(this.modalKind==="save"||this.modalKind==="load")){const a=Number(r.dataset.slot);this.modalKind==="load"?this.loadSlot(a):this.trySaveSlot(a)}}armItem(t){const e=this.selected;if(!e||e.actedThisTurn||this.busy){this.log="先選單位再用道具。",this.syncUi();return}this.pendingItem=t,this.closePause(),this.closeModal(),this.inspect=null,this.forecast=null,this.bumpForecast(),this.moveTiles.clear(),this.actionTiles.clear(),this.areaTiles.clear(),this.areaKind="item";const n=Hr(this.units);this.skillTiles=new Set(n.map(s=>Ft(s.x,s.y))),this.phase="itemAim",this.log=`${li[t].name}　選我軍單位`,this.syncUi(),this.clearPendingTap(),this.modalKind="target",this.modal.hidden=!1,this.modalKicker.textContent=li[t].name,this.modalTitle.textContent="選擇對象",this.modalBody.innerHTML="";for(const s of n){const r=document.createElement("button");r.type="button",r.className="ally-row",r.dataset.uid=s.id;const a=document.createElement("div"),o=document.createElement("b");o.textContent=s.name;const l=document.createElement("span");l.textContent=`生命 ${s.hp}/${s.maxHp}`,a.append(o,l),r.appendChild(a),this.modalBody.appendChild(r)}}async applyItem(t){const e=this.selected,n=this.pendingItem;if(!(!e||!n||e.actedThisTurn||this.busy)&&Hr(this.units).some(s=>s.id===t.id)&&ef(this.inventory,n)){if(this.closeModal(),this.busy=!0,jt.play("heal"),n==="bandage"){const s=Math.min(Al,t.maxHp-t.hp);t.hp=Math.min(t.maxHp,t.hp+Al),this.spawnFloat(t,`+${Math.max(s,0)}`,"#7dffb3"),this.log=`${e.name} 對 ${t.name} 使用繃帶`}else t.atkBuff=ju,this.spawnFloat(t,"+ATK","#ffc857"),this.log=`${e.name} 對 ${t.name} 使用提神　下次攻擊 +5`;if(e.actedThisTurn=!0,this.pendingItem=null,this.skillTiles.clear(),await this.waitMs(220),this.setIdle(),e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}closeModal(){this.modal.hidden=!0,this.modalKind="off",this.modalBody.innerHTML="",this.pauseOpen&&(this.pauseEl.hidden=!1)}trySaveSlot(t){if(di().slots[t]){this.pendingSlot=t,this.confirmText.textContent=`覆蓋檔案 ${t+1}？`,this.confirmEl.hidden=!1;return}this.writeSlot(t)}confirmYes(){if(this.confirmEl.hidden=!0,this.pendingQuit){this.pendingQuit=!1,this.goTitle();return}if(this.pendingJump!==null){const t=this.pendingJump;this.pendingJump=null,this.jumpToMission(t);return}this.pendingSlot!==null&&this.writeSlot(this.pendingSlot),this.pendingSlot=null}confirmNo(){this.confirmEl.hidden=!0,this.pendingSlot=null,this.pendingQuit=!1,this.pendingJump=null}writeSlot(t){const e=di();e.slots[t]=this.captureSave(),ch(e),this.pendingSlot=null,this.log=`已存到檔案 ${t+1}`,this.closeModal(),this.refreshContinue(),this.syncUi()}loadSlot(t){const n=di().slots[t];n&&(this.closeModal(),this.closePause(),this.applySave(n))}captureSave(){const t=this.playable()||this.phase==="enemy";return{v:2,savedAt:Date.now(),missionIndex:this.missionIndex,missionName:t?`${this.mission.number}　戰鬥中`:this.mission.number,phase:this.phase==="enemy"||this.phase==="itemAim"||this.phase==="skillAim"||this.phase==="forecast"?"select":this.phase,turn:this.turn,intel:this.intel,power:this.power,inventory:tn(this.inventory),units:this.units.map(e=>this.packUnit(e)),cam:{...this.renderer.cam},yaw:this.renderer.yaw,pitch:this.renderer.pitch,log:this.log,selectedId:this.selected&&t?this.selected.id:null,origin:this.origin?{...this.origin}:null,originDir:this.originDir,m1DropGiven:this.m1DropGiven,missionStartInventory:tn(this.missionStartInventory),objects:this.map.objects.map(e=>({id:e.id,hp:e.hp,gone:e.gone,used:e.used}))}}packUnit(t){return{id:t.id,x:t.x,y:t.y,hp:t.hp,maxHp:t.maxHp,atk:t.atk,def:t.def,dir:t.dir,acted:t.acted,skillUsed:t.skillUsed,skipNext:t.skipNext,dead:t.dead,movedThisTurn:t.movedThisTurn,actedThisTurn:t.actedThisTurn,atkBuff:t.atkBuff,team:t.team,stance:t.stance,behaviour:t.behaviour,archetype:t.archetype,gender:t.gender,skillKind:t.skillKind,rangeMin:t.rangeMin,rangeMax:t.rangeMax}}applySave(t){if(this.missionIndex=t.missionIndex,this.intel=t.intel,this.power=t.power,this.inventory=tn(t.inventory),this.missionStartInventory=tn(t.missionStartInventory??t.inventory),this.m1DropGiven=t.m1DropGiven,this.turn=t.turn,this.log=t.log,this.setSeg("seg-intel",t.intel),this.setSeg("seg-power",t.power),this.map=new Gr(this.mission.map),t.objects)for(const r of t.objects){const a=this.map.objects.find(o=>o.id===r.id);if(a&&(a.hp=r.hp,a.gone=r.gone,a.used=r.used,a.used)){for(const[o,l]of a.unblock)this.map.unblock(o,l);a.type==="van"&&(a.gone=!0)}}const e=[...yl(this.mission.starts),...this.mission.makeOthers()],n=new Map(e.map(r=>[r.id,r]));this.units=[];for(const r of t.units){const a=n.get(r.id);a&&this.units.push({...a,...r})}this.renderer.cam={...t.cam},this.renderer.yaw=t.yaw,this.renderer.setPitch(t.pitch??bs),this.clearSel(),this.inspect=null,this.busy=!1,this.acting=!1,this.clearPendingTap(),this.pendingItem=null,this.fillBriefing(),this.result.hidden=!0,this.result.classList.remove("lose"),this.confirmEl.hidden=!0;const s=t.phase;if(this.phase=s,s==="title")this.title.hidden=!1,this.briefing.hidden=!0;else if(s==="briefing")this.title.hidden=!0,this.briefing.hidden=!1;else if(s==="victory"||s==="defeat")this.title.hidden=!0,this.briefing.hidden=!0,this.result.hidden=!1,s==="defeat"&&this.result.classList.add("lose");else if(this.title.hidden=!0,this.briefing.hidden=!0,this.phase="select",t.selectedId){const r=this.units.find(a=>a.id===t.selectedId);r&&!r.dead&&!r.acted&&!r.npc&&(this.selected=r,this.origin=t.origin,this.originDir=t.originDir,this.refreshRanges(r))}this.closePause(),this.phase==="title"||this.phase==="briefing"?jt.setBgm("title"):this.phase==="victory"||this.phase==="defeat"?jt.setBgm(null):jt.setBgm("battle"),this.refreshContinue(),this.syncUi()}setSeg(t,e){const n=xt(t);for(const s of n.querySelectorAll("button"))s.classList.toggle("on",s.getAttribute("data-v")===e)}autosave(){if(this.phase==="title")return;const t=di();t.autosave=this.captureSave(),ch(t),this.refreshContinue()}refreshContinue(){this.btnContinue.disabled=!hh(di())}paintUnitChip(t,e){this.chip.hidden=!1,this.chipHp.hidden=!1;const n=`${dh[ni(t)]}${t.npc?"　保護":""}`;this.chipName.textContent=`${t.name}　${t.title}`;const s=t.atkBuff?`　攻擊+${t.atkBuff}`:"";this.chipMeta.textContent=`${n}　${mv[t.role]}　生命 ${t.hp}/${t.maxHp}　攻擊 ${t.atk}　防禦 ${t.def}　移動 ${t.mov}　跳躍 ${t.jmp}${s}`,this.chipHpFill.style.width=`${100*t.hp/t.maxHp}%`,this.chipMark.style.background=cr(t),t.skillName?(this.chipExtra.hidden=!1,this.chipExtra.textContent=`${t.skillName}　${t.skillHint}`):(this.chipExtra.hidden=!e,this.chipExtra.textContent=e?"無技能":"",e||(this.chipExtra.hidden=!0))}paintObjectChip(t){const e=this.map.objects.find(s=>s.id===t);if(this.chip.hidden=!1,!e){this.chip.hidden=!0;return}this.chipHp.hidden=e.kind!=="destructible",this.chipName.textContent=e.label;const n=e.kind==="pickup"?"拾取":e.kind==="trigger"?"啟動":e.kind==="destructible"?"可破壞":"可站上";this.chipMeta.textContent=`${n}　${e.used?"已使用":"未使用"}`,e.kind==="destructible"&&(this.chipHpFill.style.width=`${100*e.hp/e.maxHp}%`),this.chipExtra.hidden=!1,this.chipExtra.textContent=e.kind==="pickup"?"靠近或走到此格可放入背包。":e.kind==="trigger"?"相鄰時可啟動。消耗行動。":e.kind==="destructible"?"攻擊可破壞。油桶爆炸會波及鄰格。":"走到此格可站上，高度較高。",this.chipMark.style.background=e.kind==="destructible"?"#ff4d6d":"#ffc857"}paintTileChip(t){this.chip.hidden=!1,this.chipHp.hidden=!0,this.chipName.textContent=Oa[t.terrain];const e=[`高度 ${t.h}`,t.blocked?"阻擋":"可走",Oa[t.terrain]];t.prop&&e.push(gv[t.prop]),this.chipMeta.textContent=e.join("　"),this.chipExtra.hidden=!1,this.chipExtra.textContent=t.blocked?"無法站上此格。":"可以走。",this.chipMark.style.background=t.blocked?"#ff4d6d":"#3ef0d0"}syncUi(){this.scrubHints(),this.hudTurn.textContent=`回合 ${this.turn}`,this.hudPhase.textContent=this.phase==="enemy"?"敵軍":this.phase==="victory"?"勝利":this.phase==="defeat"?"失敗":this.phase==="title"?"選單":"我軍",this.hudSub.textContent=`${this.mission.hudSub}　智 ${Sl[this.intel]}　力 ${Sl[this.power]}`,this.logEl.textContent=this.log;const t=this.playable(),e=this.selected;if(this.inspect&&t?this.inspect.kind==="unit"?this.paintUnitChip(this.inspect.unit,!0):this.inspect.kind==="object"?this.paintObjectChip(this.inspect.id):this.paintTileChip(this.inspect.tile):e&&t?this.paintUnitChip(e,!1):this.chip.hidden=!0,this.forecast&&this.phase==="forecast"&&!this.busy){this.forecastEl.hidden=!1;const a=this.forecast.heal?"good":"bad";this.forecastEl.innerHTML=`<div><b>${this.forecast.label}</b></div><div class="${a}">${this.forecast.detail}</div><div>點確認出手，取消返回。</div>`}else this.forecastEl.hidden=!0;this.refreshBusyButtons(),this.btnWait.textContent=e&&(e.movedThisTurn||e.actedThisTurn)?"結束":"待機",this.btnSkill.classList.toggle("armed",this.phase==="skillAim");const n=this.units.some(a=>a.team==="player"&&!a.dead&&!a.acted&&!a.npc),s=this.phase==="enemy"||this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat",r=this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat"||this.vnOpen;this.btnEnd.hidden=!n||s,this.btnRotate.hidden=s,this.btnPause.hidden=r,this.btnBag.hidden=r,this.camHint.hidden=s,this.refreshContinue()}}const Su=document.getElementById("board");if(!(Su instanceof HTMLCanvasElement))throw new Error("board");document.addEventListener("pointerdown",()=>{jt.unlock()},{capture:!0});document.addEventListener("click",i=>{i.target.closest("button")&&jt.play("ui")},!0);const bu=new _v(Su);bu.applyHash();bu.start();const vv=location.search.includes("shot");"serviceWorker"in navigator&&!vv&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})});
