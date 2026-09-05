var zc=Object.defineProperty;var Gc=(i,e,t)=>e in i?zc(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var J=(i,e,t)=>Gc(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const kl="yejie-mute";function Vc(){try{return localStorage.getItem(kl)==="1"}catch{return!1}}class Wc{constructor(){J(this,"muted",Vc());J(this,"ctx",null);J(this,"master",null);J(this,"sfxGain",null);J(this,"bgmGain",null);J(this,"unlocked",!1);J(this,"wanted",null);J(this,"playing",null);J(this,"timer",0);J(this,"beat",0)}unlock(){if(this.unlocked&&this.ctx&&this.ctx.state==="running")return;const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx||(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.32,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.7,this.sfxGain.connect(this.master),this.bgmGain=this.ctx.createGain(),this.bgmGain.gain.value=this.muted?0:.22,this.bgmGain.connect(this.master)),this.ctx.resume(),this.unlocked=!0,this.applyMute(),this.wanted&&this.setBgm(this.wanted))}setMuted(e){this.muted=e;try{localStorage.setItem(kl,e?"1":"0")}catch{}this.applyMute()}toggleMute(){return this.setMuted(!this.muted),this.muted}applyMute(){this.sfxGain&&(this.sfxGain.gain.value=this.muted?0:.7),this.bgmGain&&(this.bgmGain.gain.value=this.muted?0:.22)}play(e){if(this.unlock(),!this.ctx||!this.sfxGain||this.muted)return;const t=this.ctx.currentTime;switch(e){case"ui":this.blip(880,.045,.11,"sine",t);break;case"move":this.noise(.05,.06,t,900),this.blip(180,.06,.08,"triangle",t);break;case"attack":this.noise(.1,.1,t,700),this.sweep(420,160,.12,.12,t);break;case"hit":this.blip(140,.09,.16,"square",t),this.noise(.08,.12,t,400);break;case"miss":this.sweep(480,220,.14,.07,t),this.blip(210,.1,.05,"sine",t+.04);break;case"skill":this.blip(520,.08,.1,"square",t),this.blip(780,.1,.1,"sine",t+.06),this.blip(1040,.12,.08,"sine",t+.12);break;case"heal":this.blip(392,.1,.09,"sine",t),this.blip(494,.12,.1,"sine",t+.08),this.blip(587,.16,.1,"sine",t+.16);break;case"victory":this.blip(523,.14,.12,"square",t),this.blip(659,.16,.12,"square",t+.12),this.blip(784,.28,.14,"square",t+.24);break;case"defeat":this.blip(330,.18,.12,"sawtooth",t),this.blip(247,.22,.12,"sawtooth",t+.16),this.blip(165,.4,.14,"sine",t+.32);break;case"pause":this.blip(220,.1,.08,"triangle",t),this.blip(165,.16,.08,"triangle",t+.1);break}}setBgm(e){if(this.wanted=e,e===this.playing||(this.stopBgm(),this.playing=e,!e||!this.unlocked||!this.ctx))return;this.beat=0;const t=e==="battle"?280:520,n=()=>{if(this.playing!==e||!this.ctx||!this.bgmGain)return;const s=this.ctx.currentTime;e==="title"?this.titleBeat(s):this.battleBeat(s),this.beat+=1,this.timer=window.setTimeout(n,t)};n()}stopBgm(){this.timer&&(window.clearTimeout(this.timer),this.timer=0),this.playing=null}titleBeat(e){const t=this.beat%8,n=[110,0,82,0,110,0,98,0][t];n&&this.tone(this.bgmGain,n,.46,.045,"sine",e),(t===0||t===4)&&this.tone(this.bgmGain,220,.4,.02,"triangle",e),t===6&&this.tone(this.bgmGain,329,.28,.018,"sine",e)}battleBeat(e){const t=this.beat%8;t%2===0?this.sweepTo(this.bgmGain,90,42,.12,.1,e):this.noiseTo(this.bgmGain,.04,.025,e,1800);const s=[0,196,0,233,0,196,175,0][t];s&&this.tone(this.bgmGain,s,.18,.035,"square",e)}blip(e,t,n,s,r){this.sfxGain&&this.tone(this.sfxGain,e,t,n,s,r)}sweep(e,t,n,s,r){this.sfxGain&&this.sweepTo(this.sfxGain,e,t,n,s,r)}noise(e,t,n,s){this.sfxGain&&this.noiseTo(this.sfxGain,e,t,n,s)}tone(e,t,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type=r,o.frequency.setValueAtTime(t,a),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(s,a+.012),l.gain.exponentialRampToValueAtTime(1e-4,a+n),o.connect(l),l.connect(e),o.start(a),o.stop(a+n+.02)}sweepTo(e,t,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(t,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,n),a+s),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(r,a+.01),l.gain.exponentialRampToValueAtTime(1e-4,a+s),o.connect(l),l.connect(e),o.start(a),o.stop(a+s+.02)}noiseTo(e,t,n,s,r){if(!this.ctx)return;const a=2048,o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=o.getChannelData(0);for(let d=0;d<a;d++)l[d]=Math.random()*2-1;const c=this.ctx.createBufferSource();c.buffer=o;const h=this.ctx.createBiquadFilter();h.type="lowpass",h.frequency.value=r;const f=this.ctx.createGain();f.gain.setValueAtTime(1e-4,s),f.gain.exponentialRampToValueAtTime(n,s+.008),f.gain.exponentialRampToValueAtTime(1e-4,s+t),c.connect(h),h.connect(f),f.connect(e),c.start(s),c.stop(s+t+.02)}}const Je=new Wc;function Xc(i,e){return i==="mara"||i==="dana"||i==="priya"||i==="hale"||i==="crosby"||i==="beckett"?i:e==="civilian"?"official":e==="worker"?"worker":e==="delinquent"||e==="magician"||e==="wolverine"||e==="boxer"||e==="gunner"?e:e==="elite"?"crosby":"delinquent"}function qc(i,e){return e?i==="striker"?"strike":i==="controller"?"halt":i==="support"?"heal":i==="delinquent"?"slash":i==="magician"?"spark":i==="wolverine"?"pounce":i==="boxer"?"hook":i==="gunner"?"shot":"":""}function xt(i){const e=i.team,t=i.stance??(e==="player"?"friendly":e==="neutral"?"neutral":"hostile"),n=i.npc??!1,s=i.behaviour??(n?"idle":"combat"),r=i.archetype??Xc(i.id,i.role),a=i.skillKind??qc(i.role,i.skillName),o=a==="spark"||a==="shot"||i.role==="gunner"||i.role==="magician";return{acted:i.acted??!1,skillUsed:!1,skipNext:!1,dead:!1,lunge:0,dir:i.dir??0,movedThisTurn:!1,actedThisTurn:!1,npc:n,atkBuff:i.atkBuff??0,archetype:r,stance:t,behaviour:s,gender:i.gender??"m",skillKind:a,rangeMin:i.rangeMin??(i.role==="gunner"?2:1),rangeMax:i.rangeMax??(o?(i.role==="gunner",3):1),anim:"idle",animStart:0,...i}}function vo(i){return[xt({id:"mara",name:"Mara Ellison",title:"警員",team:"player",role:"striker",archetype:"mara",gender:"f",x:i[0]?.x??3,y:i[0]?.y??11,hp:44,maxHp:44,atk:16,def:5,mov:5,jmp:2,dir:0,skillName:"重擊",skillHint:"近身重擊，傷害較高，也可以打更高的高度差。",skillKind:"strike"}),xt({id:"dana",name:"Dana Ruiz",title:"搭檔",team:"player",role:"controller",archetype:"dana",gender:"f",x:i[1]?.x??4,y:i[1]?.y??11,hp:40,maxHp:40,atk:10,def:8,mov:4,jmp:1,dir:0,skillName:"攔住",skillHint:"讓目標下一回合無法行動，並造成少量傷害。",skillKind:"halt"}),xt({id:"priya",name:"Priya Shah",title:"急救員",team:"player",role:"support",archetype:"priya",gender:"f",x:i[2]?.x??5,y:i[2]?.y??11,hp:38,maxHp:38,atk:8,def:7,mov:4,jmp:1,dir:0,skillName:"包紮",skillHint:"治療相鄰的友軍，也可以用在自己身上。",skillKind:"heal"})]}function ui(i,e,t,n,s,r="m"){return xt({id:i,name:e,title:"街頭",team:"enemy",role:"delinquent",archetype:"delinquent",gender:r,x:t,y:n,hp:22,maxHp:22,atk:10,def:3,mov:4,jmp:1,dir:s,skillName:"揮砍",skillHint:"近身揮砍，傷害較高。",skillKind:"slash"})}function sr(i,e,t,n,s,r="m"){return xt({id:i,name:e,title:"拳手",team:"enemy",role:"boxer",archetype:"boxer",gender:r,x:t,y:n,hp:26,maxHp:26,atk:15,def:4,mov:3,jmp:1,dir:s,skillName:"勾拳",skillHint:"近身重拳，傷害很高，距離短。",skillKind:"hook",rangeMin:1,rangeMax:1})}function Gi(i,e,t,n,s,r="m"){return xt({id:i,name:e,title:"槍手",team:"enemy",role:"gunner",archetype:"gunner",gender:r,x:t,y:n,hp:20,maxHp:20,atk:11,def:3,mov:4,jmp:1,dir:s,skillName:"點射",skillHint:"遠距點射，想保持距離。",skillKind:"shot",rangeMin:2,rangeMax:3})}function Mo(i,e,t,n,s,r="f"){return xt({id:i,name:e,title:"術者",team:"enemy",role:"magician",archetype:"magician",gender:r,x:t,y:n,hp:24,maxHp:24,atk:12,def:3,mov:3,jmp:1,dir:s,skillName:"閃火",skillHint:"遠距閃火，看起來像煙火。",skillKind:"spark",rangeMin:1,rangeMax:3})}function Yc(i,e,t,n,s,r="m"){return xt({id:i,name:e,title:"爪獸",team:"enemy",role:"wolverine",archetype:"wolverine",gender:r,x:t,y:n,hp:28,maxHp:28,atk:15,def:2,mov:5,jmp:2,dir:s,skillName:"撲擊",skillHint:"衝近撲擊。現場會說那是動物。",skillKind:"pounce",rangeMin:1,rangeMax:1})}const pi=[{id:"m1",number:"任務 01",loc:"國王碼頭夜市・屋頂",hudSub:"國王碼頭夜市",paragraphs:["這座城市看起來很普通。夜間公車、打烊很晚的市場、警察無線電。一個自稱 Assembly 的私人團體，長期把魔法排除在紀錄之外。他們換了新主席。舊規矩是藏起來。新規矩是先拿下這座城市，再拿下其他地方。","你是夜班警員 Mara Ellison。不是特勤單位，也不是什麼重要人物。你只是會早一秒發現事情，這讓你還有點用，但不足以讓人聽你的。今晚有人報案，說市場屋頂上有騷動。你去了。你的搭檔 Dana Ruiz 也去了。市場急救員 Priya Shah 不肯離開。屋頂上，一群沒穿制服的人把街道標得像棋盤。他們本來就不打算讓目擊者走掉。這只是很多場裡的一場，本來應該安靜做完。"],voices:[{name:"Mara",line:"屋頂上有人。不是穿制服的。"},{name:"Dana",line:"我跟你上去。"},{name:"Priya",line:"有人受傷的話，我不走。"}],winCond:"擊敗 Crosby",loseCond:"三人全部倒下",winTitle:"現場結束了。",winBody:"Crosby 倒下。其餘的人散了。市場還開著。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。屋頂上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。屋頂上的人還在。",map:{w:10,h:12,theme:"roof",heights:["2222222222","2222112222","2211001122","0011111100","0000000000","0000000000","2200000022","2200000022","2110000112","0000000000","0000000000","0000000000"],blocked:[[1,0,"ac"],[8,0,"ac"],[0,7,"ac"],[9,7,"ac"],[2,5,"stall"],[3,5,"stall"],[6,5,"stall"],[7,5,"stall"],[4,9,"stall"],[5,9,"stall"],[1,4,"stall"],[8,4,"stall"]],lamps:[[4,4],[0,9],[9,9]],objects:[{x:2,y:10,type:"kit",item:"bandage"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"crosby",makeOthers:()=>[xt({id:"crosby",name:"Crosby",title:"現場主管",team:"enemy",role:"elite",archetype:"crosby",gender:"m",x:5,y:0,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),ui("e1","Neil",2,1,2,"m"),ui("e2","Cole",7,1,2,"f"),sr("e3","Nash",0,6,1,"m"),Gi("e4","Pike",4,3,2,"m")]},{id:"m2",number:"任務 02",loc:"國王碼頭後巷・貨台",hudSub:"國王碼頭後巷",paragraphs:["後巷報了槍擊。無線電當它是幫派互打。Mara、Dana、Priya 被派去，因為這是夜班的槍擊案，不是因為有人點名。三人傷勢已處理，生命已回復。","現場其實是 Assembly 在換掉當地那一組人，也要處理一個真正管港口執照的人。Deputy Harbour Chief Rowan Hale 人還在貨台上。他們先動手換幫派，所以看起來還是街頭那套。"],voices:[{name:"Mara",line:"後巷有槍聲。當幫派打。"},{name:"Dana",line:"我們是最近的一組。"},{name:"Priya",line:"有人倒在貨台邊上。"}],winCond:"擊敗 Beckett，Hale 須仍在",loseCond:"三人全部倒下，或 Rowan Hale 倒下",winTitle:"槍聲停了。",winBody:"Beckett 停手了。Hale 還活著。這條巷子暫時安靜。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。巷子裡的人還在。",protectLoseTitle:"Rowan Hale 倒下。",protectLoseBody:"港口執照那條線斷了。現場的人還沒走。",map:{w:10,h:12,theme:"alley",heights:["2220002222","2210001222","2200000122","0000000000","0001111000","2200000112","2200000012","0000000000","2210000222","2200000022","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,0,"ac"],[0,10,"ac"],[9,8,"ac"],[5,8,"crate"],[2,9,"crate"],[6,6,"crate"],[7,6,"crate"]],lamps:[[3,3],[4,10],[8,5]],objects:[{x:3,y:8,type:"pallet"},{x:8,y:4,type:"barrel"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"beckett",protectId:"hale",makeOthers:()=>[xt({id:"hale",name:"Rowan Hale",title:"副港務長",team:"player",role:"civilian",archetype:"hale",gender:"m",x:4,y:9,hp:34,maxHp:34,atk:0,def:6,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),xt({id:"beckett",name:"Beckett",title:"現場主管",team:"enemy",role:"elite",archetype:"beckett",gender:"m",x:8,y:1,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),Gi("e1","Drake",5,2,2,"m"),ui("e2","Quinn",1,4,1,"f"),sr("e3","Moss",7,5,2,"m"),ui("e4","Reed",8,7,3,"m")]},{id:"m3",number:"任務 03",loc:"國王碼頭倉庫・碼頭",hudSub:"國王碼頭倉庫",paragraphs:["槍擊過後，Assembly 回來清場。倉庫裡還有看太多的碼頭工人。無線電仍當它是貨物失竊。","現場主管是 Vance。工人 Sam Ortiz 還在棧板上。他們要滅口，不是搶貨。"],voices:[{name:"Mara",line:"倉庫有人。不是小偷。"},{name:"Dana",line:"工人還在裡面。"},{name:"Priya",line:"我先看傷。"}],winCond:"擊敗 Vance，Ortiz 須仍在",loseCond:"三人全部倒下，或 Sam Ortiz 倒下",winTitle:"倉庫靜了。",winBody:"Vance 停手。Ortiz 還活著。碼頭外面仍有夜班吊車。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。倉庫裡的人還在。",protectLoseTitle:"Sam Ortiz 倒下。",protectLoseBody:"目擊者沒了。現場的人還沒走。",map:{w:10,h:12,theme:"warehouse",heights:["2222200000","2211100000","2200000112","0000000112","0001110000","2200000022","2200000022","0000000000","0011111000","0000000000","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,2,"ac"],[0,5,"crate"],[9,6,"crate"],[3,7,"crate"],[4,2,"crate"],[5,2,"crate"]],lamps:[[2,3],[7,8],[1,10]],objects:[{x:1,y:8,type:"kit",item:"stim"},{x:5,y:8,type:"pallet"},{x:6,y:4,type:"barrel"},{x:2,y:4,type:"switch",unblock:[[4,2],[5,2]]},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"vance",protectId:"ortiz",makeOthers:()=>[xt({id:"ortiz",name:"Sam Ortiz",title:"碼頭工人",team:"player",role:"worker",archetype:"worker",gender:"m",x:4,y:8,hp:28,maxHp:28,atk:0,def:4,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),xt({id:"w1",name:"Gina Pell",title:"碼頭工人",team:"neutral",role:"worker",archetype:"worker",gender:"f",stance:"neutral",behaviour:"flee",npc:!0,x:1,y:6,hp:20,maxHp:20,atk:0,def:2,mov:3,jmp:1,dir:1,skillName:"",skillHint:""}),xt({id:"vance",name:"Vance",title:"現場主管",team:"enemy",role:"elite",archetype:"boxer",gender:"m",x:6,y:1,hp:50,maxHp:50,atk:15,def:6,mov:4,jmp:2,dir:2,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook"}),Gi("e1","Kira",8,2,2,"f"),ui("e2","Dunn",2,2,2,"m"),sr("e3","Wade",7,5,3,"m")]},{id:"m4",number:"任務 04",loc:"國王碼頭東街・換手",hudSub:"國王碼頭東街",paragraphs:["街上還有本地那一組人。Assembly 要換掉他們。看起來像幫派互打，三方都在場。","本地的人沒有先打你。Assembly 的現場主管是 Inez。贏的條件是她倒下。不必清掉整條街。"],voices:[{name:"Mara",line:"兩邊都有人。不要先打錯邊。"},{name:"Dana",line:"本地的人在看我們。"},{name:"Priya",line:"打到他們，他們就會打回來。"}],winCond:"擊敗 Inez。本地組不必全滅",loseCond:"三人全部倒下",winTitle:"東街暫時停了。",winBody:"Inez 倒下。本地的人沒有再往前。換手沒做完。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。街上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。街上的人還在。",map:{w:10,h:12,theme:"street",heights:["0000222000","0000222000","1100000011","0000000000","2200000022","0001111000","0000000000","2200000022","0000000000","1100000011","0000000000","0000000000"],blocked:[[0,4,"ac"],[9,4,"ac"],[0,7,"stall"],[9,7,"stall"],[3,5,"stall"]],lamps:[[2,2],[7,6],[4,9]],objects:[{x:1,y:9,type:"kit",item:"bandage"},{x:6,y:8,type:"pallet"},{x:2,y:5,type:"barrel"},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"inez",makeOthers:()=>[xt({id:"inez",name:"Inez",title:"現場主管",team:"enemy",role:"elite",archetype:"gunner",gender:"f",x:5,y:0,hp:46,maxHp:46,atk:13,def:5,mov:4,jmp:2,dir:2,skillName:"點射",skillHint:"遠距點射。",skillKind:"shot",rangeMin:2,rangeMax:3}),Mo("e1","Lyle",2,1,2,"m"),ui("e2","Rosa",7,1,2,"f"),Gi("e3","Chen",8,5,3,"m"),xt({id:"g1",name:"Marty",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"combat",x:1,y:3,hp:20,maxHp:20,atk:9,def:3,mov:4,jmp:1,dir:1,skillName:"揮砍",skillHint:"近身揮砍。",skillKind:"slash",npc:!0}),xt({id:"g2",name:"Bea",title:"本地組",team:"neutral",role:"boxer",archetype:"boxer",gender:"f",stance:"neutral",behaviour:"combat",x:2,y:6,hp:22,maxHp:22,atk:12,def:3,mov:3,jmp:1,dir:0,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook",npc:!0}),xt({id:"g3",name:"Oz",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"indiscriminate",x:8,y:2,hp:16,maxHp:16,atk:8,def:2,mov:3,jmp:1,dir:3,skillName:"",skillHint:"",npc:!0})]},{id:"m5",number:"任務 05",loc:"港務大樓前・廣場",hudSub:"港務廣場",paragraphs:["Assembly 改打真正有權的人。Port Authority Director Marla Keene 今晚還在廣場側門。無線電會寫成動物與煙火。","現場有術者和爪獸。主管是 Holt。Keene 必須活著。"],voices:[{name:"Mara",line:"這不是街頭那套了。"},{name:"Dana",line:"那邊有人往官員走。"},{name:"Priya",line:"先護人。"}],winCond:"擊敗 Holt，Keene 須仍在",loseCond:"三人全部倒下，或 Marla Keene 倒下",winTitle:"廣場上的人散了。",winBody:"Holt 停手。Keene 還活著。報告會寫煙火與走失的動物。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。廣場上的人還在。",protectLoseTitle:"Marla Keene 倒下。",protectLoseBody:"真正管港口的那條線斷了。",map:{w:10,h:12,theme:"plaza",heights:["2222222222","2211111122","2200000022","0000000000","0001111000","2200000022","0000000000","0011111100","0000000000","2200000022","0000000000","0000000000"],blocked:[[0,5,"ac"],[9,5,"ac"],[1,1,"ac"],[8,1,"ac"],[4,2,"crate"],[5,2,"crate"]],lamps:[[3,3],[6,6],[2,9]],objects:[{x:6,y:10,type:"kit",item:"bandage"},{x:3,y:7,type:"pallet"},{x:7,y:4,type:"barrel"},{x:1,y:4,type:"van",unblock:[[4,2],[5,2]]},{x:8,y:8,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"holt",protectId:"keene",makeOthers:()=>[xt({id:"keene",name:"Marla Keene",title:"港務總監",team:"player",role:"civilian",archetype:"official",gender:"f",x:4,y:9,hp:32,maxHp:32,atk:0,def:5,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),xt({id:"holt",name:"Holt",title:"現場主管",team:"enemy",role:"elite",archetype:"magician",gender:"m",x:5,y:0,hp:52,maxHp:52,atk:14,def:5,mov:4,jmp:2,dir:2,skillName:"閃火",skillHint:"遠距閃火。",skillKind:"spark",rangeMin:1,rangeMax:3}),Mo("e1","Lila",2,1,2,"f"),Yc("e2","Rook",7,2,2,"m"),Gi("e3","Tess",8,6,3,"f")]}],ts=[{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}],$c={L:.75,M:1,H:1.35},yo={L:"L 低",M:"M 中",H:"H 高"};function qe(i,e){return`${i},${e}`}function Cn(i){const[e,t]=i.split(",");return{x:Number(e),y:Number(t)}}function Vi(i,e){const t=e.x-i.x,n=e.y-i.y;return Math.abs(t)>=Math.abs(n)?t>=0?1:3:n>=0?2:0}function An(i,e){return Math.abs(i.x-e.x)+Math.abs(i.y-e.y)}function So(i){return new Promise(e=>setTimeout(e,i))}function Wi(i,e,t,n,s){const r=(n-1)/2,a=(s-1)/2,o=i-r,l=e-a,c=Math.cos(t),h=Math.sin(t);return{x:o*c+l*h,y:-o*h+l*c}}function Kc(i,e,t){const n=Math.cos(t),s=Math.sin(t);return{x:i*n+e*s,y:-i*s+e*n}}function Zc(i){return i+Math.PI/2}function Jc(i,e){if(i.stance!=="hostile"&&i.team!=="enemy")return;const t=$c[e];i.maxHp=Math.max(1,Math.round(i.maxHp*t)),i.hp=i.maxHp,i.atk=Math.max(1,Math.round(i.atk*t)),i.def=Math.max(0,Math.round(i.def*t))}function Wn(i){return i.stance}function Bl(i){const e=Wn(i);return e==="friendly"?"#5ad0ff":e==="hostile"?"#ff4d6d":"#e0c45a"}function Qc(i){return i.team==="player"&&!i.npc&&!i.dead}function jc(i,e){return e.dead?!0:i.team===e.team||Wn(i)==="friendly"&&Wn(e)==="friendly"}function Hl(i,e){if(i.dead||e.dead||i.id===e.id)return!1;if(i.behaviour==="indiscriminate"||e.behaviour==="indiscriminate")return!0;const t=Wn(i),n=Wn(e);return t==="hostile"&&n==="friendly"||t==="friendly"&&n==="hostile"||t==="neutral"&&n==="hostile"||t==="hostile"&&n==="neutral"}function bo(i){i.stance="hostile",i.team="enemy",(i.behaviour==="idle"||i.behaviour==="flee")&&(i.behaviour="combat")}function eh(i,e){const t=new Map;for(const n of i)n.dead||e&&n.id===e.id||t.set(qe(n.x,n.y),n);return t}function rs(i,e,t){const n=eh(t,i),s=new Map,r=new Map,a=qe(i.x,i.y);s.set(a,0),r.set(a,null);const o=[{x:i.x,y:i.y}];for(;o.length;){o.sort((m,_)=>(s.get(qe(m.x,m.y))??99)-(s.get(qe(_.x,_.y))??99));const c=o.shift(),h=qe(c.x,c.y),f=s.get(h)??0,d=e.heightAt(c.x,c.y);for(const m of ts){const _=c.x+m.x,M=c.y+m.y;if(!e.walkable(_,M))continue;const u=e.heightAt(_,M)-d;if(Math.abs(u)>i.jmp)continue;const E=n.get(qe(_,M));if(E&&!jc(i,E))continue;const w=1+(u>0?u:0),y=f+w;if(y>i.mov)continue;const A=qe(_,M),S=s.get(A);S!==void 0&&S<=y||(s.set(A,y),r.set(A,h),o.push({x:_,y:M}))}}const l=new Map;for(const[c,h]of s){const f=Cn(c),d=n.get(c);d&&d.id!==i.id||e.walkable(f.x,f.y)&&l.set(c,h)}return l.set(a,0),{cost:l,parent:r}}function Xn(i,e){const t=[];let n=qe(e.x,e.y);if(!i.cost.has(n)&&!i.parent.has(n))return t;for(;n;){t.push(Cn(n));const s=i.parent.get(n);if(!s)break;n=s}return t.reverse(),t}function Ui(i,e,t,n,s,r){const a=Math.abs(e-n)+Math.abs(t-s),o=i.rangeMin??1,l=i.rangeMax??1;if(a<o||a>l)return!1;const c=Math.abs(r.heightAt(e,t)-r.heightAt(n,s)),h=Math.max(2,i.jmp+1);return c<=h}function Xr(i,e,t,n){const s=i.x,r=i.y,a=[];for(const o of t)o.dead||o.id===i.id||!(Hl(i,o)||i.team==="player"&&!i.npc&&o.stance!=="friendly")||Ui(i,s,r,o.x,o.y,e)&&a.push(o);return a}function qr(i,e,t){const n=i.skillKind;if(n==="heal"||i.role==="support")return t.filter(s=>s.dead||s.stance!=="friendly"&&s.team!=="player"?!1:Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=1);if(n==="halt"||i.role==="controller")return t.filter(s=>{if(s.dead||s.stance==="friendly")return!1;const r=Math.abs(e.heightAt(i.x,i.y)-e.heightAt(s.x,s.y));return Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=3&&r<=3});if(n==="spark"||n==="shot")return t.filter(s=>{if(s.dead||s.id===i.id||s.stance==="friendly")return!1;const r=Math.abs(i.x-s.x)+Math.abs(i.y-s.y),a=n==="spark"?3:4;return r<(n==="shot"?2:1)||r>a?!1:Math.abs(e.heightAt(i.x,i.y)-e.heightAt(s.x,s.y))<=3});if(n==="strike"||n==="slash"||n==="pounce"||n==="hook"||i.role==="striker"){const s=n==="strike"?3:2;return Xr({...i,rangeMin:1,rangeMax:1},e,t).filter(r=>Math.abs(e.heightAt(i.x,i.y)-e.heightAt(r.x,r.y))<=s)}return Xr(i,e,t)}function th(i,e,t){const n=new Set;for(const s of Xr(i,e,t))n.add(qe(s.x,s.y));return n}function Ds(i,e){const t=new Set,n=i.rangeMin??1,s=i.rangeMax??1;for(let r=0;r<e.h;r++)for(let a=0;a<e.w;a++){const o=Math.abs(i.x-a)+Math.abs(i.y-r);o>=n&&o<=s&&e.inBounds(a,r)&&t.add(qe(a,r))}return t}function nh(i,e){const t=i.skillKind;if(t==="halt"||i.role==="controller"){const n=new Set;for(let s=0;s<e.h;s++)for(let r=0;r<e.w;r++)Math.abs(i.x-r)+Math.abs(i.y-s)<=3&&n.add(qe(r,s));return n}if(t==="heal"||i.role==="support"){const n=new Set;for(const s of ts){const r=i.x+s.x,a=i.y+s.y;e.inBounds(r,a)&&n.add(qe(r,a))}return n.add(qe(i.x,i.y)),n}if(t==="spark"){const n={...i,rangeMin:1,rangeMax:3};return Ds(n,e)}if(t==="shot"){const n={...i,rangeMin:2,rangeMax:4};return Ds(n,e)}return Ds({...i,rangeMin:1,rangeMax:1},e)}function zl(i,e){const t=e.x-i.x,n=e.y-i.y,s=ts[i.dir],r=t*s.x+n*s.y;return r>0?"front":r<0?"back":"side"}function Gs(i,e,t,n=!1){const s=zl(e,i);let r=i.atk+(i.atkBuff||0)-Math.floor(e.def*.5);const a=t.heightAt(i.x,i.y)-t.heightAt(e.x,e.y);if(a>0&&(r+=3),a<0&&(r-=2),s==="side"&&(r=Math.floor(r*1.25)),s==="back"&&(r=Math.floor(r*1.5)),n)switch(i.skillKind){case"strike":r=Math.floor(r*1.4);break;case"slash":r=Math.floor(r*1.3);break;case"spark":r=i.atk+(i.atkBuff||0)-Math.floor(e.def*.2)+(a>0?2:0);break;case"pounce":r=Math.floor(r*1.35);break;case"hook":r=Math.floor(r*1.45);break;case"shot":r=Math.floor(r*1.15);break;default:i.role==="striker"&&(r=Math.floor(r*1.4))}return{dmg:Math.max(1,r),face:s,dh:a}}const ih={front:"正面",side:"側面 +25%",back:"背面 +50%"};function Yr(i,e,t,n=!1){const{dmg:s,face:r,dh:a}=Gs(i,e,t,n),o=[ih[r]];return a>0&&o.push("高地 +3"),a<0&&o.push("仰攻 −2"),n&&i.skillName&&o.push(i.skillName),{kind:n?"skill":"attack",actor:i,target:e,label:n?`${i.skillName}　${i.name} → ${e.name}`:`${i.name} → ${e.name}`,detail:`${s} 傷害　${o.join("　")}`,dmg:s,heal:0,skip:!1,face:r}}function Eo(i,e,t){const n=i.skillKind;return n==="halt"||i.role==="controller"?{kind:"skill",actor:i,target:e,label:`${i.skillName}　${i.name} → ${e.name}`,detail:"下回合無法行動　並造成 4 傷害",dmg:4,heal:0,skip:!0,face:zl(e,i)}:n==="heal"||i.role==="support"?{kind:"skill",actor:i,target:e,label:`${i.skillName}　${i.name} → ${e.name}`,detail:"回復 16 生命",dmg:0,heal:16,skip:!1,face:"front"}:Yr(i,e,t,!0)}function Ha(i,e){return i.behaviour==="indiscriminate"?e.filter(t=>!t.dead&&t.id!==i.id):i.behaviour==="flee"||i.behaviour==="idle"?[]:e.filter(t=>!t.dead&&t.id!==i.id&&Hl(i,t))}function za(i,e){return e.length?e.slice().sort((t,n)=>An(i,t)-An(i,n))[0]:null}function sh(i,e,t,n,s){return i.behaviour==="idle"||i.mov<=0?{unit:i,dest:{x:i.x,y:i.y},path:[{x:i.x,y:i.y}],target:null,useSkill:!1}:i.behaviour==="flee"?rh(i,e,t):s==="L"?ah(i,e,t):s==="H"?lh(i,e,t,n):oh(i,e,t,n)}function rh(i,e,t){const n=rs(i,e,t),s=t.filter(o=>!o.dead&&o.id!==i.id&&Wn(o)==="hostile");let r={x:i.x,y:i.y},a=-1;for(const[o]of n.cost){const l=Cn(o),c=za(l,s),h=c?An(l,c):8,f=Math.min(l.x,l.y,e.w-1-l.x,e.h-1-l.y),d=h*10-f;d>a&&(a=d,r=l)}return{unit:i,dest:r,path:Xn(n,r),target:null,useSkill:!1}}function Ga(i,e,t,n,s,r){if(i.skillUsed||!i.skillName)return!1;const a={...i,x:e.x,y:e.y};if(!qr(a,n,s).some(c=>c.id===t.id)||i.skillKind==="heal")return!1;const l=r==="H"?.8:r==="L"?.25:.55;return i.skillKind==="spark"||i.skillKind==="shot"?!0:Math.random()<l}function ah(i,e,t){const n=rs(i,e,t),s=Ha(i,t);let r=null;for(const[c]of n.cost){const h=Cn(c);for(const f of s){if(!Ui(i,h.x,h.y,f.x,f.y,e))continue;const d=An(i,h),_=400-An(i,f)*20-d;(!r||_>r.score)&&(r={dest:h,target:f,score:_})}}if(r)return{unit:i,dest:r.dest,path:Xn(n,r.dest),target:r.target,useSkill:Ga(i,r.dest,r.target,e,t,"L")};const a=za(i,s);let o={x:i.x,y:i.y},l=1e9;if(a)for(const[c]of n.cost){const h=Cn(c);let f=An(h,a);i.rangeMin>1&&(f=Math.abs(f-i.rangeMin)),f<l&&(l=f,o=h)}return{unit:i,dest:o,path:Xn(n,o),target:null,useSkill:!1}}function oh(i,e,t,n){const s=rs(i,e,t),r=Ha(i,t);let a=null;for(const[c]of s.cost){const h=Cn(c);for(const f of r){if(!Ui(i,h.x,h.y,f.x,f.y,e))continue;const d={...i,x:h.x,y:h.y},{dmg:m,face:_,dh:M}=Gs(d,f,e);let p=m*10+(f.hp<=m?80:0);if(f.role==="support"&&(p+=6),f.id===n&&(p+=14),_==="back"&&(p+=8),M>0&&(p+=4),i.role==="elite"&&(p+=2),i.rangeMin>1){const u=An(h,f);u>=i.rangeMin&&(p+=6),u===1&&i.archetype==="gunner"&&(p-=12)}(!a||p>a.score)&&(a={dest:h,target:f,score:p})}}if(a)return{unit:i,dest:a.dest,path:Xn(s,a.dest),target:a.target,useSkill:Ga(i,a.dest,a.target,e,t,"M")};let o={x:i.x,y:i.y},l=99;for(const c of r)for(const[h]of s.cost){const f=Cn(h);let d=Math.abs(f.x-c.x)+Math.abs(f.y-c.y);i.rangeMin>1&&(d=Math.abs(d-Math.max(2,i.rangeMin)));const m=e.heightAt(i.x,i.y)-e.heightAt(f.x,f.y);let _=d;c.id===n&&(_-=2),i.role==="elite"&&m>0&&(_+=1.4),_<l&&(l=_,o=f)}return{unit:i,dest:o,path:Xn(s,o),target:null,useSkill:!1}}function lh(i,e,t,n){const s=rs(i,e,t),r=Ha(i,t),a=n?r.find(_=>_.id===n):void 0,l=r.filter(_=>!_.npc).reduce((_,M)=>_+M.hp,0),c=!!a&&a.hp*3<=Math.max(1,l);let h=null;for(const[_]of s.cost){const M=Cn(_);for(const p of r){if(!Ui(i,M.x,M.y,p.x,p.y,e))continue;const u={...i,x:M.x,y:M.y},{dmg:E,face:w,dh:y}=Gs(u,p,e),A=1-p.hp/Math.max(1,p.maxHp);let S=E*12+A*40;p.hp<=E&&(S+=110),w==="back"&&(S+=22),w==="side"&&(S+=12),y>0&&(S+=10),y<0&&(S-=6),p.role==="support"&&(S+=8),p.id===n&&(S+=c||p.hp<=16?56:20,p.hp<=E&&(S+=40)),i.role==="elite"&&(S+=3),i.rangeMin>1&&An(M,p)===1&&i.archetype==="gunner"&&(S-=20),(!h||S>h.score)&&(h={dest:M,target:p,score:S})}}if(h)return{unit:i,dest:h.dest,path:Xn(s,h.dest),target:h.target,useSkill:Ga(i,h.dest,h.target,e,t,"H")};const f=a&&(c||a.hp/a.maxHp<.65)?a:r.slice().sort((_,M)=>_.hp/_.maxHp-M.hp/M.maxHp)[0];let d={x:i.x,y:i.y},m=-1e9;for(const[_]of s.cost){const M=Cn(_),p=f??za(M,r);if(!p)continue;let u=An(M,p);i.rangeMin>1&&(u=Math.abs(u-Math.max(2,i.rangeMin)));let E=-u*10+e.heightAt(M.x,M.y)*5;if(Ui(i,M.x,M.y,p.x,p.y,e)){const w={...i,x:M.x,y:M.y},{face:y,dh:A}=Gs(w,p,e);y==="back"&&(E+=24),y==="side"&&(E+=12),A>0&&(E+=8)}p.id===n&&(E+=6),E+=(1-p.hp/Math.max(1,p.maxHp))*8,E>m&&(m=E,d=M)}return{unit:i,dest:d,path:Xn(s,d),target:null,useSkill:!1}}class ch{constructor(e,t){J(this,"pointers",new Map);J(this,"lastPinch",0);J(this,"lastAngle",0);J(this,"lastCentroid",null);J(this,"dragging",!1);J(this,"start",null);J(this,"moved",0);J(this,"right",!1);J(this,"pinchGrid",null);J(this,"onTap",()=>{});this.canvas=e,this.renderer=t,e.addEventListener("pointerdown",n=>this.down(n)),e.addEventListener("pointermove",n=>this.move(n)),e.addEventListener("pointerup",n=>this.up(n)),e.addEventListener("pointercancel",n=>this.up(n)),e.addEventListener("contextmenu",n=>n.preventDefault()),e.addEventListener("wheel",n=>{n.preventDefault(),this.zoomAt(n.clientX,n.clientY,n.deltaY<0?1.08:.92)},{passive:!1})}pos(e){const t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}centroid(){const e=[...this.pointers.values()];let t=0,n=0;for(const s of e)t+=s.x,n+=s.y;return{x:t/e.length,y:n/e.length}}down(e){this.canvas.setPointerCapture(e.pointerId);const t=this.pos(e);if(this.pointers.set(e.pointerId,t),e.button===2&&(this.right=!0),this.pointers.size===1)this.start=t,this.moved=0,this.dragging=!1;else if(this.pointers.size===2){this.lastPinch=this.pinchDist(),this.lastAngle=this.pinchAngle();const n=this.centroid();this.lastCentroid=n,this.pinchGrid=this.renderer.screenToGrid(n.x,n.y),this.dragging=!0}}move(e){if(!this.pointers.has(e.pointerId))return;const t=this.pos(e),n=this.pointers.get(e.pointerId);if(this.pointers.set(e.pointerId,t),this.pointers.size===2){const a=this.pinchDist(),o=this.pinchAngle(),l=this.centroid();if(this.lastPinch>0){const c=a/this.lastPinch;this.renderer.yaw-=o-this.lastAngle,this.lastCentroid&&this.renderer.addPitch(l.y-this.lastCentroid.y),this.zoomAtScreen(l.x,l.y,c),this.pinchGrid&&this.renderer.lockGridToScreen(this.pinchGrid.x,this.pinchGrid.y,0,l.x,l.y)}this.lastPinch=a,this.lastAngle=o,this.lastCentroid=l,this.dragging=!0;return}const s=t.x-n.x,r=t.y-n.y;if(this.moved+=Math.hypot(s,r),this.moved>10&&(this.dragging=!0),this.right){const a=this.renderer.screenToGrid(this.renderer.w/2,this.renderer.h/2);this.renderer.yaw+=s*.01,this.renderer.addPitch(r),this.renderer.lockGridToScreen(a.x,a.y,0,this.renderer.w/2,this.renderer.h/2);return}if(this.dragging){const a=this.renderer.cam.zoom;this.renderer.cam.x-=s/a,this.renderer.cam.y-=r/a}}up(e){const t=this.pointers.get(e.pointerId);this.pointers.delete(e.pointerId),e.button===2&&(this.right=!1),this.pointers.size<2&&(this.lastPinch=0,this.pinchGrid=null,this.lastCentroid=null),this.pointers.size===0?(!this.dragging&&this.start&&t&&this.onTap(t),this.start=null,this.dragging=!1,this.moved=0,this.right=!1):this.dragging=!0}pinchDist(){const e=[...this.pointers.values()];return e.length<2?0:Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y)}pinchAngle(){const e=[...this.pointers.values()];return e.length<2?0:Math.atan2(e[1].y-e[0].y,e[1].x-e[0].x)}zoomAt(e,t,n){const s=this.canvas.getBoundingClientRect();this.zoomAtScreen(e-s.left,t-s.top,n)}zoomAtScreen(e,t,n){const s=this.renderer.cam,r=s.x+(e-this.renderer.w/2)/s.zoom,a=s.y+(t-this.renderer.h/2)/s.zoom;s.zoom=Math.min(1.8,Math.max(.55,s.zoom*n)),s.x=r-(e-this.renderer.w/2)/s.zoom,s.y=a-(t-this.renderer.h/2)/s.zoom}}const To=14,hh=5,dh=9,mi={bandage:{id:"bandage",name:"繃帶",hint:"回復 14 生命。"},stim:{id:"stim",name:"提神",hint:"下次攻擊 +5。"}},gi=[{id:"bandage",qty:2},{id:"stim",qty:1}];function qt(i){return i.map(e=>({id:e.id,qty:e.qty})).filter(e=>e.qty>0)}function rr(i,e,t=1){const n=i.find(a=>a.id===e),s=n?.qty??0,r=Math.min(t,dh-s);return r<=0?0:(n?n.qty+=r:i.push({id:e,qty:r}),r)}function fh(i,e){const t=i.find(n=>n.id===e);if(!t||t.qty<=0)return!1;if(t.qty-=1,t.qty<=0){const n=i.indexOf(t);n>=0&&i.splice(n,1)}return!0}function ar(i){return i.filter(e=>!e.dead&&(e.stance==="friendly"||e.team==="player"))}const or=8,Ao=12;function uh(i,e){const n={id:`obj-${i.type}-${e}-${i.x}-${i.y}`,x:i.x,y:i.y,type:i.type,gone:!1,used:!1,item:i.item,unblock:i.unblock??[],healAdj:i.healAdj??0};switch(i.type){case"kit":return{...n,kind:"pickup",hp:1,maxHp:1,label:"急救包",standH:0,item:i.item??"bandage"};case"switch":return{...n,kind:"trigger",hp:1,maxHp:1,label:"開關",standH:0};case"van":return{...n,kind:"trigger",hp:1,maxHp:1,label:"貨車門",standH:0};case"barrel":return{...n,kind:"destructible",hp:Ao,maxHp:Ao,label:"油桶",standH:0};case"crate":return{...n,kind:"platform",hp:1,maxHp:1,label:"貨箱",standH:1};case"pallet":return{...n,kind:"platform",hp:1,maxHp:1,label:"棧板",standH:1}}}function ph(i){return i.gone?!1:i.kind==="destructible"||i.type==="van"&&!i.used}function mh(i){const e=new Map;for(const t of i)t.gone||e.set(qe(t.x,t.y),t);return e}class lr{constructor(e){J(this,"w");J(this,"h");J(this,"theme");J(this,"tiles",[]);J(this,"objects",[]);this.w=e.w,this.h=e.h,this.theme=e.theme??"roof";const t=new Map;for(const[s,r,a]of e.blocked)t.set(qe(s,r),a);const n=new Set((e.lamps??[]).map(([s,r])=>qe(s,r)));for(let s=0;s<e.h;s++){const r=[],a=e.heights[s]??"";for(let o=0;o<e.w;o++){const l=Number(a[o]??"0");let c="street";l===2?c="roof":l===1&&(c="stairs");const h=t.get(qe(o,s))??(n.has(qe(o,s))?"lamp":void 0);r.push({x:o,y:s,h:l,terrain:c,blocked:h==="stall"||h==="ac"||h==="crate",prop:h})}this.tiles.push(r)}this.objects=(e.objects??[]).map((s,r)=>uh(s,r))}inBounds(e,t){return e>=0&&t>=0&&e<this.w&&t<this.h}tile(e,t){return this.inBounds(e,t)?this.tiles[t][e]:null}objAt(e,t){return mh(this.objects).get(qe(e,t))}heightAt(e,t){const n=this.tile(e,t);if(!n)return 0;const s=this.objAt(e,t),r=s&&!s.gone&&s.kind==="platform"?s.standH:0;return n.h+r}walkable(e,t){const n=this.tile(e,t);if(!n||n.blocked)return!1;const s=this.objAt(e,t);return!(s&&ph(s))}unblock(e,t){const n=this.tile(e,t);n&&(n.blocked=!1,(n.prop==="crate"||n.prop==="stall")&&(n.prop=void 0))}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Va="185",gh=0,wo=1,_h=2,Us=1,xh=2,Qi=3,qn=0,kt=1,En=2,wn=0,Li=1,Ro=2,Co=3,Po=4,vh=5,ti=100,Mh=101,yh=102,Sh=103,bh=104,Eh=200,Th=201,Ah=202,wh=203,$r=204,Kr=205,Rh=206,Ch=207,Ph=208,Lh=209,Ih=210,Dh=211,Uh=212,Nh=213,Fh=214,Zr=0,Jr=1,Qr=2,Ni=3,jr=4,ea=5,ta=6,na=7,Gl=0,Oh=1,kh=2,un=0,Vl=1,Wl=2,Xl=3,ql=4,Yl=5,$l=6,Kl=7,Zl=300,li=301,Fi=302,cr=303,hr=304,Zs=306,ia=1e3,Tn=1001,sa=1002,wt=1003,Bh=1004,ds=1005,It=1006,dr=1007,ri=1008,Wt=1009,Jl=1010,Ql=1011,ns=1012,Wa=1013,gn=1014,dn=1015,Pn=1016,Xa=1017,qa=1018,is=1020,jl=35902,ec=35899,tc=1021,nc=1022,nn=1023,Ln=1026,ai=1027,ic=1028,Ya=1029,ci=1030,$a=1031,Ka=1033,Ns=33776,Fs=33777,Os=33778,ks=33779,ra=35840,aa=35841,oa=35842,la=35843,ca=36196,ha=37492,da=37496,fa=37488,ua=37489,Vs=37490,pa=37491,ma=37808,ga=37809,_a=37810,xa=37811,va=37812,Ma=37813,ya=37814,Sa=37815,ba=37816,Ea=37817,Ta=37818,Aa=37819,wa=37820,Ra=37821,Ca=36492,Pa=36494,La=36495,Ia=36283,Da=36284,Ws=36285,Ua=36286,Hh=3200,Na=0,zh=1,Gn="",Vt="srgb",Xs="srgb-linear",qs="linear",Qe="srgb",_i=7680,Lo=519,Gh=512,Vh=513,Wh=514,Za=515,Xh=516,qh=517,Ja=518,Yh=519,Io=35044,Do="300 es",fn=2e3,ss=2001;function $h(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Ys(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Kh(){const i=Ys("canvas");return i.style.display="block",i}const Uo={};function No(...i){const e="THREE."+i.shift();console.log(e,...i)}function sc(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Ce(...i){i=sc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Xe(...i){i=sc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ii(...i){const e=i.join(" ");e in Uo||(Uo[e]=!0,Ce(...i))}function Zh(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Jh={[Zr]:Jr,[Qr]:ta,[jr]:na,[Ni]:ea,[Jr]:Zr,[ta]:Qr,[na]:jr,[ea]:Ni};class hi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fr=Math.PI/180,Fa=180/Math.PI;function as(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pt[i&255]+Pt[i>>8&255]+Pt[i>>16&255]+Pt[i>>24&255]+"-"+Pt[e&255]+Pt[e>>8&255]+"-"+Pt[e>>16&15|64]+Pt[e>>24&255]+"-"+Pt[t&63|128]+Pt[t>>8&255]+"-"+Pt[t>>16&255]+Pt[t>>24&255]+Pt[n&255]+Pt[n>>8&255]+Pt[n>>16&255]+Pt[n>>24&255]).toLowerCase()}function He(i,e,t){return Math.max(e,Math.min(t,i))}function Qh(i,e){return(i%e+e)%e}function ur(i,e,t){return(1-t)*i+t*e}function Xi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ot(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const so=class so{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};so.prototype.isVector2=!0;let ze=so;class Bi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],d=r[a+0],m=r[a+1],_=r[a+2],M=r[a+3];if(f!==M||l!==d||c!==m||h!==_){let p=l*d+c*m+h*_+f*M;p<0&&(d=-d,m=-m,_=-_,M=-M,p=-p);let u=1-o;if(p<.9995){const E=Math.acos(p),w=Math.sin(E);u=Math.sin(u*E)/w,o=Math.sin(o*E)/w,l=l*u+d*o,c=c*u+m*o,h=h*u+_*o,f=f*u+M*o}else{l=l*u+d*o,c=c*u+m*o,h=h*u+_*o,f=f*u+M*o;const E=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=E,c*=E,h*=E,f*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],d=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+h*f+l*m-c*d,e[t+1]=l*_+h*d+c*f-o*m,e[t+2]=c*_+h*m+o*d-l*f,e[t+3]=h*_-o*f-l*d-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),d=l(n/2),m=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=d*h*f+c*m*_,this._y=c*m*f-d*h*_,this._z=c*h*_+d*m*f,this._w=c*h*f-d*m*_;break;case"YXZ":this._x=d*h*f+c*m*_,this._y=c*m*f-d*h*_,this._z=c*h*_-d*m*f,this._w=c*h*f+d*m*_;break;case"ZXY":this._x=d*h*f-c*m*_,this._y=c*m*f+d*h*_,this._z=c*h*_+d*m*f,this._w=c*h*f-d*m*_;break;case"ZYX":this._x=d*h*f-c*m*_,this._y=c*m*f+d*h*_,this._z=c*h*_-d*m*f,this._w=c*h*f+d*m*_;break;case"YZX":this._x=d*h*f+c*m*_,this._y=c*m*f+d*h*_,this._z=c*h*_-d*m*f,this._w=c*h*f-d*m*_;break;case"XZY":this._x=d*h*f-c*m*_,this._y=c*m*f-d*h*_,this._z=c*h*_+d*m*f,this._w=c*h*f+d*m*_;break;default:Ce("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=n+o+f;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(n>o&&n>f){const m=2*Math.sqrt(1+n-o-f);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>f){const m=2*Math.sqrt(1+o-n-f);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+f-n-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const ro=class ro{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Fo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Fo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return pr.copy(this).projectOnVector(e),this.sub(pr)}reflect(e){return this.sub(pr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ro.prototype.isVector3=!0;let O=ro;const pr=new O,Fo=new Bi,ao=class ao{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],d=n[2],m=n[5],_=n[8],M=s[0],p=s[3],u=s[6],E=s[1],w=s[4],y=s[7],A=s[2],S=s[5],R=s[8];return r[0]=a*M+o*E+l*A,r[3]=a*p+o*w+l*S,r[6]=a*u+o*y+l*R,r[1]=c*M+h*E+f*A,r[4]=c*p+h*w+f*S,r[7]=c*u+h*y+f*R,r[2]=d*M+m*E+_*A,r[5]=d*p+m*w+_*S,r[8]=d*u+m*y+_*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,d=o*l-h*r,m=c*r-a*l,_=t*f+n*d+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/_;return e[0]=f*M,e[1]=(s*c-h*n)*M,e[2]=(o*n-s*a)*M,e[3]=d*M,e[4]=(h*t-s*l)*M,e[5]=(s*r-o*t)*M,e[6]=m*M,e[7]=(n*l-c*t)*M,e[8]=(a*t-n*r)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Ii("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(mr.makeScale(e,t)),this}rotate(e){return Ii("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(mr.makeRotation(-e)),this}translate(e,t){return Ii("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(mr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};ao.prototype.isMatrix3=!0;let Ie=ao;const mr=new Ie,Oo=new Ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ko=new Ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function jh(){const i={enabled:!0,workingColorSpace:Xs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Qe&&(s.r=Rn(s.r),s.g=Rn(s.g),s.b=Rn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Qe&&(s.r=Di(s.r),s.g=Di(s.g),s.b=Di(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Gn?qs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ii("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ii("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Xs]:{primaries:e,whitePoint:n,transfer:qs,toXYZ:Oo,fromXYZ:ko,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Vt},outputColorSpaceConfig:{drawingBufferColorSpace:Vt}},[Vt]:{primaries:e,whitePoint:n,transfer:Qe,toXYZ:Oo,fromXYZ:ko,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Vt}}}),i}const Be=jh();function Rn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Di(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let xi;class ed{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{xi===void 0&&(xi=Ys("canvas")),xi.width=e.width,xi.height=e.height;const s=xi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=xi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ys("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Rn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Rn(t[n]/255)*255):t[n]=Rn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ce("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let td=0;class Qa{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=as(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(gr(s[a].image)):r.push(gr(s[a]))}else r=gr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function gr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ed.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ce("Texture: Unable to serialize Texture."),{})}let nd=0;const _r=new O;class Nt extends hi{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,n=Tn,s=Tn,r=It,a=ri,o=nn,l=Wt,c=Nt.DEFAULT_ANISOTROPY,h=Gn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:nd++}),this.uuid=as(),this.name="",this.source=new Qa(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ze(0,0),this.repeat=new ze(1,1),this.center=new ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(_r).x}get height(){return this.source.getSize(_r).y}get depth(){return this.source.getSize(_r).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ia:e.x=e.x-Math.floor(e.x);break;case Tn:e.x=e.x<0?0:1;break;case sa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ia:e.y=e.y-Math.floor(e.y);break;case Tn:e.y=e.y<0?0:1;break;case sa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=Zl;Nt.DEFAULT_ANISOTROPY=1;const oo=class oo{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],m=l[5],_=l[9],M=l[2],p=l[6],u=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-M)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+M)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,y=(m+1)/2,A=(u+1)/2,S=(h+d)/4,R=(f+M)/4,x=(_+p)/4;return w>y&&w>A?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=S/n,r=R/n):y>A?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=S/s,r=x/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=R/r,s=x/r),this.set(n,s,r,t),this}let E=Math.sqrt((p-_)*(p-_)+(f-M)*(f-M)+(d-h)*(d-h));return Math.abs(E)<.001&&(E=1),this.x=(p-_)/E,this.y=(f-M)/E,this.z=(d-h)/E,this.w=Math.acos((c+m+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};oo.prototype.isVector4=!0;let at=oo;class id extends hi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:It,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Nt(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:It,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Qa(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends id{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class rc extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class sd extends Nt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=wt,this.minFilter=wt,this.wrapR=Tn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ks=class Ks{constructor(e,t,n,s,r,a,o,l,c,h,f,d,m,_,M,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,f,d,m,_,M,p)}set(e,t,n,s,r,a,o,l,c,h,f,d,m,_,M,p){const u=this.elements;return u[0]=e,u[4]=t,u[8]=n,u[12]=s,u[1]=r,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=f,u[14]=d,u[3]=m,u[7]=_,u[11]=M,u[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ks().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/vi.setFromMatrixColumn(e,0).length(),r=1/vi.setFromMatrixColumn(e,1).length(),a=1/vi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const d=a*h,m=a*f,_=o*h,M=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=m+_*c,t[5]=d-M*c,t[9]=-o*l,t[2]=M-d*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,m=l*f,_=c*h,M=c*f;t[0]=d+M*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=m*o-_,t[6]=M+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,m=l*f,_=c*h,M=c*f;t[0]=d-M*o,t[4]=-a*f,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*h,t[9]=M-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,m=a*f,_=o*h,M=o*f;t[0]=l*h,t[4]=_*c-m,t[8]=d*c+M,t[1]=l*f,t[5]=M*c+d,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,m=a*c,_=o*l,M=o*c;t[0]=l*h,t[4]=M-d*f,t[8]=_*f+m,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*f+_,t[10]=d-M*f}else if(e.order==="XZY"){const d=a*l,m=a*c,_=o*l,M=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+M,t[5]=a*h,t[9]=m*f-_,t[2]=_*f-m,t[6]=o*h,t[10]=M*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rd,e,ad)}lookAt(e,t,n){const s=this.elements;return zt.subVectors(e,t),zt.lengthSq()===0&&(zt.z=1),zt.normalize(),Nn.crossVectors(n,zt),Nn.lengthSq()===0&&(Math.abs(n.z)===1?zt.x+=1e-4:zt.z+=1e-4,zt.normalize(),Nn.crossVectors(n,zt)),Nn.normalize(),fs.crossVectors(zt,Nn),s[0]=Nn.x,s[4]=fs.x,s[8]=zt.x,s[1]=Nn.y,s[5]=fs.y,s[9]=zt.y,s[2]=Nn.z,s[6]=fs.z,s[10]=zt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],d=n[9],m=n[13],_=n[2],M=n[6],p=n[10],u=n[14],E=n[3],w=n[7],y=n[11],A=n[15],S=s[0],R=s[4],x=s[8],b=s[12],C=s[1],P=s[5],U=s[9],V=s[13],Y=s[2],F=s[6],q=s[10],z=s[14],Q=s[3],ee=s[7],de=s[11],me=s[15];return r[0]=a*S+o*C+l*Y+c*Q,r[4]=a*R+o*P+l*F+c*ee,r[8]=a*x+o*U+l*q+c*de,r[12]=a*b+o*V+l*z+c*me,r[1]=h*S+f*C+d*Y+m*Q,r[5]=h*R+f*P+d*F+m*ee,r[9]=h*x+f*U+d*q+m*de,r[13]=h*b+f*V+d*z+m*me,r[2]=_*S+M*C+p*Y+u*Q,r[6]=_*R+M*P+p*F+u*ee,r[10]=_*x+M*U+p*q+u*de,r[14]=_*b+M*V+p*z+u*me,r[3]=E*S+w*C+y*Y+A*Q,r[7]=E*R+w*P+y*F+A*ee,r[11]=E*x+w*U+y*q+A*de,r[15]=E*b+w*V+y*z+A*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],m=e[14],_=e[3],M=e[7],p=e[11],u=e[15],E=l*m-c*d,w=o*m-c*f,y=o*d-l*f,A=a*m-c*h,S=a*d-l*h,R=a*f-o*h;return t*(M*E-p*w+u*y)-n*(_*E-p*A+u*S)+s*(_*w-M*A+u*R)-r*(_*y-M*S+p*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],m=e[11],_=e[12],M=e[13],p=e[14],u=e[15],E=t*o-n*a,w=t*l-s*a,y=t*c-r*a,A=n*l-s*o,S=n*c-r*o,R=s*c-r*l,x=h*M-f*_,b=h*p-d*_,C=h*u-m*_,P=f*p-d*M,U=f*u-m*M,V=d*u-m*p,Y=E*V-w*U+y*P+A*C-S*b+R*x;if(Y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/Y;return e[0]=(o*V-l*U+c*P)*F,e[1]=(s*U-n*V-r*P)*F,e[2]=(M*R-p*S+u*A)*F,e[3]=(d*S-f*R-m*A)*F,e[4]=(l*C-a*V-c*b)*F,e[5]=(t*V-s*C+r*b)*F,e[6]=(p*y-_*R-u*w)*F,e[7]=(h*R-d*y+m*w)*F,e[8]=(a*U-o*C+c*x)*F,e[9]=(n*C-t*U-r*x)*F,e[10]=(_*S-M*y+u*E)*F,e[11]=(f*y-h*S-m*E)*F,e[12]=(o*b-a*P-l*x)*F,e[13]=(t*P-n*b+s*x)*F,e[14]=(M*w-_*A-p*E)*F,e[15]=(h*A-f*w+d*E)*F,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,d=r*c,m=r*h,_=r*f,M=a*h,p=a*f,u=o*f,E=l*c,w=l*h,y=l*f,A=n.x,S=n.y,R=n.z;return s[0]=(1-(M+u))*A,s[1]=(m+y)*A,s[2]=(_-w)*A,s[3]=0,s[4]=(m-y)*S,s[5]=(1-(d+u))*S,s[6]=(p+E)*S,s[7]=0,s[8]=(_+w)*R,s[9]=(p-E)*R,s[10]=(1-(d+M))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=vi.set(s[0],s[1],s[2]).length();const o=vi.set(s[4],s[5],s[6]).length(),l=vi.set(s[8],s[9],s[10]).length();r<0&&(a=-a),Kt.copy(this);const c=1/a,h=1/o,f=1/l;return Kt.elements[0]*=c,Kt.elements[1]*=c,Kt.elements[2]*=c,Kt.elements[4]*=h,Kt.elements[5]*=h,Kt.elements[6]*=h,Kt.elements[8]*=f,Kt.elements[9]*=f,Kt.elements[10]*=f,t.setFromRotationMatrix(Kt),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=fn,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(n-s),d=(t+e)/(t-e),m=(n+s)/(n-s);let _,M;if(l)_=r/(a-r),M=a*r/(a-r);else if(o===fn)_=-(a+r)/(a-r),M=-2*a*r/(a-r);else if(o===ss)_=-a/(a-r),M=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=fn,l=!1){const c=this.elements,h=2/(t-e),f=2/(n-s),d=-(t+e)/(t-e),m=-(n+s)/(n-s);let _,M;if(l)_=1/(a-r),M=a/(a-r);else if(o===fn)_=-2/(a-r),M=-(a+r)/(a-r);else if(o===ss)_=-1/(a-r),M=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ks.prototype.isMatrix4=!0;let dt=Ks;const vi=new O,Kt=new dt,rd=new O(0,0,0),ad=new O(1,1,1),Nn=new O,fs=new O,zt=new O,Bo=new dt,Ho=new Bi;class Yn{constructor(e=0,t=0,n=0,s=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],d=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(He(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-He(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:Ce("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Bo.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Bo,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Ho.setFromEuler(this),this.setFromQuaternion(Ho,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class ac{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let od=0;const zo=new O,Mi=new Bi,xn=new dt,us=new O,qi=new O,ld=new O,cd=new Bi,Go=new O(1,0,0),Vo=new O(0,1,0),Wo=new O(0,0,1),Xo={type:"added"},hd={type:"removed"},yi={type:"childadded",child:null},xr={type:"childremoved",child:null};class Rt extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=as(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.clone();const e=new O,t=new Yn,n=new Bi,s=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new Ie}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ac,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(e,t){return Mi.setFromAxisAngle(e,t),this.quaternion.premultiply(Mi),this}rotateX(e){return this.rotateOnAxis(Go,e)}rotateY(e){return this.rotateOnAxis(Vo,e)}rotateZ(e){return this.rotateOnAxis(Wo,e)}translateOnAxis(e,t){return zo.copy(e).applyQuaternion(this.quaternion),this.position.add(zo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Go,e)}translateY(e){return this.translateOnAxis(Vo,e)}translateZ(e){return this.translateOnAxis(Wo,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(xn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?us.copy(e):us.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?xn.lookAt(qi,us,this.up):xn.lookAt(us,qi,this.up),this.quaternion.setFromRotationMatrix(xn),s&&(xn.extractRotation(s.matrixWorld),Mi.setFromRotationMatrix(xn),this.quaternion.premultiply(Mi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Xe("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Xo),yi.child=e,this.dispatchEvent(yi),yi.child=null):Xe("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(hd),xr.child=e,this.dispatchEvent(xr),xr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),xn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),xn.multiply(e.parent.matrixWorld)),e.applyMatrix4(xn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Xo),yi.child=e,this.dispatchEvent(yi),yi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,e,ld),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,cd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),d=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),_.length>0&&(n.nodes=_)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Rt.DEFAULT_UP=new O(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class rt extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dd={type:"move"};class vr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new rt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new rt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new rt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const M of e.hand.values()){const p=t.getJointPose(M,n),u=this._getHandJoint(c,M);p!==null&&(u.matrix.fromArray(p.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=p.radius),u.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),m=.02,_=.005;c.inputState.pinching&&d>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new rt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const oc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fn={h:0,s:0,l:0},ps={h:0,s:0,l:0};function Mr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Ge{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Be.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Be.workingColorSpace){return this.r=e,this.g=t,this.b=n,Be.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Be.workingColorSpace){if(e=Qh(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Mr(a,r,e+1/3),this.g=Mr(a,r,e),this.b=Mr(a,r,e-1/3)}return Be.colorSpaceToWorking(this,s),this}setStyle(e,t=Vt){function n(r){r!==void 0&&parseFloat(r)<1&&Ce("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ce("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Ce("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Vt){const n=oc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ce("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rn(e.r),this.g=Rn(e.g),this.b=Rn(e.b),this}copyLinearToSRGB(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Vt){return Be.workingToColorSpace(Lt.copy(this),e),Math.round(He(Lt.r*255,0,255))*65536+Math.round(He(Lt.g*255,0,255))*256+Math.round(He(Lt.b*255,0,255))}getHexString(e=Vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Be.workingColorSpace){Be.workingToColorSpace(Lt.copy(this),t);const n=Lt.r,s=Lt.g,r=Lt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Be.workingColorSpace){return Be.workingToColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=Vt){Be.workingToColorSpace(Lt.copy(this),e);const t=Lt.r,n=Lt.g,s=Lt.b;return e!==Vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Fn),this.setHSL(Fn.h+e,Fn.s+t,Fn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Fn),e.getHSL(ps);const n=ur(Fn.h,ps.h,t),s=ur(Fn.s,ps.s,t),r=ur(Fn.l,ps.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Lt=new Ge;Ge.NAMES=oc;class fd extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Zt=new O,vn=new O,yr=new O,Mn=new O,Si=new O,bi=new O,qo=new O,Sr=new O,br=new O,Er=new O,Tr=new at,Ar=new at,wr=new at;class en{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Zt.subVectors(e,t),s.cross(Zt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Zt.subVectors(s,t),vn.subVectors(n,t),yr.subVectors(e,t);const a=Zt.dot(Zt),o=Zt.dot(vn),l=Zt.dot(yr),c=vn.dot(vn),h=vn.dot(yr),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const d=1/f,m=(c*l-o*h)*d,_=(a*h-o*l)*d;return r.set(1-m-_,_,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Mn.x),l.addScaledVector(a,Mn.y),l.addScaledVector(o,Mn.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return Tr.setScalar(0),Ar.setScalar(0),wr.setScalar(0),Tr.fromBufferAttribute(e,t),Ar.fromBufferAttribute(e,n),wr.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(Tr,r.x),a.addScaledVector(Ar,r.y),a.addScaledVector(wr,r.z),a}static isFrontFacing(e,t,n,s){return Zt.subVectors(n,t),vn.subVectors(e,t),Zt.cross(vn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Zt.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),Zt.cross(vn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return en.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return en.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return en.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return en.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return en.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Si.subVectors(s,n),bi.subVectors(r,n),Sr.subVectors(e,n);const l=Si.dot(Sr),c=bi.dot(Sr);if(l<=0&&c<=0)return t.copy(n);br.subVectors(e,s);const h=Si.dot(br),f=bi.dot(br);if(h>=0&&f<=h)return t.copy(s);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Si,a);Er.subVectors(e,r);const m=Si.dot(Er),_=bi.dot(Er);if(_>=0&&m<=_)return t.copy(r);const M=m*c-l*_;if(M<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(n).addScaledVector(bi,o);const p=h*_-m*f;if(p<=0&&f-h>=0&&m-_>=0)return qo.subVectors(r,s),o=(f-h)/(f-h+(m-_)),t.copy(s).addScaledVector(qo,o);const u=1/(p+M+d);return a=M*u,o=d*u,t.copy(n).addScaledVector(Si,a).addScaledVector(bi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class os{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Jt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Jt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Jt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Jt):Jt.fromBufferAttribute(r,a),Jt.applyMatrix4(e.matrixWorld),this.expandByPoint(Jt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ms.copy(n.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Jt),Jt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Yi),gs.subVectors(this.max,Yi),Ei.subVectors(e.a,Yi),Ti.subVectors(e.b,Yi),Ai.subVectors(e.c,Yi),On.subVectors(Ti,Ei),kn.subVectors(Ai,Ti),Kn.subVectors(Ei,Ai);let t=[0,-On.z,On.y,0,-kn.z,kn.y,0,-Kn.z,Kn.y,On.z,0,-On.x,kn.z,0,-kn.x,Kn.z,0,-Kn.x,-On.y,On.x,0,-kn.y,kn.x,0,-Kn.y,Kn.x,0];return!Rr(t,Ei,Ti,Ai,gs)||(t=[1,0,0,0,1,0,0,0,1],!Rr(t,Ei,Ti,Ai,gs))?!1:(_s.crossVectors(On,kn),t=[_s.x,_s.y,_s.z],Rr(t,Ei,Ti,Ai,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Jt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Jt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(yn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),yn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),yn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),yn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),yn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),yn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),yn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),yn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(yn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const yn=[new O,new O,new O,new O,new O,new O,new O,new O],Jt=new O,ms=new os,Ei=new O,Ti=new O,Ai=new O,On=new O,kn=new O,Kn=new O,Yi=new O,gs=new O,_s=new O,Zn=new O;function Rr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Zn.fromArray(i,r);const o=s.x*Math.abs(Zn.x)+s.y*Math.abs(Zn.y)+s.z*Math.abs(Zn.z),l=e.dot(Zn),c=t.dot(Zn),h=n.dot(Zn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const _t=new O,xs=new ze;let ud=0;class mn extends hi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ud++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Io,this.updateRanges=[],this.gpuType=dn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)xs.fromBufferAttribute(this,t),xs.applyMatrix3(e),this.setXY(t,xs.x,xs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Xi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Ot(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Xi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Xi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Xi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Xi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ot(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),s=Ot(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Ot(t,this.array),n=Ot(n,this.array),s=Ot(s,this.array),r=Ot(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Io&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class lc extends mn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class cc extends mn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Et extends mn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const pd=new os,$i=new O,Cr=new O;class ja{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):pd.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;$i.subVectors(e,this.center);const t=$i.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector($i,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Cr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint($i.copy(e.center).add(Cr)),this.expandByPoint($i.copy(e.center).sub(Cr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let md=0;const Yt=new dt,Pr=new Rt,wi=new O,Gt=new os,Ki=new os,bt=new O;class $t extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:md++}),this.uuid=as(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($h(e)?cc:lc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ie().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Yt.makeRotationFromQuaternion(e),this.applyMatrix4(Yt),this}rotateX(e){return Yt.makeRotationX(e),this.applyMatrix4(Yt),this}rotateY(e){return Yt.makeRotationY(e),this.applyMatrix4(Yt),this}rotateZ(e){return Yt.makeRotationZ(e),this.applyMatrix4(Yt),this}translate(e,t,n){return Yt.makeTranslation(e,t,n),this.applyMatrix4(Yt),this}scale(e,t,n){return Yt.makeScale(e,t,n),this.applyMatrix4(Yt),this}lookAt(e){return Pr.lookAt(e),Pr.updateMatrix(),this.applyMatrix4(Pr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(wi).negate(),this.translate(wi.x,wi.y,wi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Et(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Ce("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new os);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Gt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Gt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Gt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Gt.min),this.boundingBox.expandByPoint(Gt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Xe('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ja);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Xe("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const n=this.boundingSphere.center;if(Gt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ki.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Gt.min,Ki.min),Gt.expandByPoint(bt),bt.addVectors(Gt.max,Ki.max),Gt.expandByPoint(bt)):(Gt.expandByPoint(Ki.min),Gt.expandByPoint(Ki.max))}Gt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)bt.fromBufferAttribute(o,c),l&&(wi.fromBufferAttribute(e,c),bt.add(wi)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Xe('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Xe("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new mn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new O,l[x]=new O;const c=new O,h=new O,f=new O,d=new ze,m=new ze,_=new ze,M=new O,p=new O;function u(x,b,C){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,C),d.fromBufferAttribute(r,x),m.fromBufferAttribute(r,b),_.fromBufferAttribute(r,C),h.sub(c),f.sub(c),m.sub(d),_.sub(d);const P=1/(m.x*_.y-_.x*m.y);isFinite(P)&&(M.copy(h).multiplyScalar(_.y).addScaledVector(f,-m.y).multiplyScalar(P),p.copy(f).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(P),o[x].add(M),o[b].add(M),o[C].add(M),l[x].add(p),l[b].add(p),l[C].add(p))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let x=0,b=E.length;x<b;++x){const C=E[x],P=C.start,U=C.count;for(let V=P,Y=P+U;V<Y;V+=3)u(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const w=new O,y=new O,A=new O,S=new O;function R(x){A.fromBufferAttribute(s,x),S.copy(A);const b=o[x];w.copy(b),w.sub(A.multiplyScalar(A.dot(b))).normalize(),y.crossVectors(S,b);const P=y.dot(l[x])<0?-1:1;a.setXYZW(x,w.x,w.y,w.z,P)}for(let x=0,b=E.length;x<b;++x){const C=E[x],P=C.start,U=C.count;for(let V=P,Y=P+U;V<Y;V+=3)R(e.getX(V+0)),R(e.getX(V+1)),R(e.getX(V+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new mn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const s=new O,r=new O,a=new O,o=new O,l=new O,c=new O,h=new O,f=new O;if(e)for(let d=0,m=e.count;d<m;d+=3){const _=e.getX(d+0),M=e.getX(d+1),p=e.getX(d+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,M),a.fromBufferAttribute(t,p),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=t.count;d<m;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let m=0,_=0;for(let M=0,p=l.length;M<p;M++){o.isInterleavedBufferAttribute?m=l[M]*o.data.stride+o.offset:m=l[M]*h;for(let u=0;u<h;u++)d[_++]=c[m++]}return new mn(d,h,f)}if(this.index===null)return Ce("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new $t,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],m=e(d,n);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const m=c[f];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let d=0,m=f.length;d<m;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let gd=0;class ls extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gd++}),this.uuid=as(),this.name="",this.type="Material",this.blending=Li,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=$r,this.blendDst=Kr,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ge(0,0,0),this.blendAlpha=0,this.depthFunc=Ni,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=_i,this.stencilZFail=_i,this.stencilZPass=_i,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ce(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Li&&(n.blending=this.blending),this.side!==qn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==$r&&(n.blendSrc=this.blendSrc),this.blendDst!==Kr&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ni&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==_i&&(n.stencilFail=this.stencilFail),this.stencilZFail!==_i&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==_i&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ge().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ze().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ze().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Sn=new O,Lr=new O,vs=new O,Bn=new O,Ir=new O,Ms=new O,Dr=new O;class _d{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Lr.copy(e).add(t).multiplyScalar(.5),vs.copy(t).sub(e).normalize(),Bn.copy(this.origin).sub(Lr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(vs),o=Bn.dot(this.direction),l=-Bn.dot(vs),c=Bn.lengthSq(),h=Math.abs(1-a*a);let f,d,m,_;if(h>0)if(f=a*l-o,d=a*o-l,_=r*h,f>=0)if(d>=-_)if(d<=_){const M=1/h;f*=M,d*=M,m=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d=-r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;else d<=-_?(f=Math.max(0,-(-a*r+o)),d=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c):d<=_?(f=0,d=Math.min(Math.max(-r,-l),r),m=d*(d+2*l)+c):(f=Math.max(0,-(a*r+o)),d=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+d*(d+2*l)+c);else d=a>0?-r:r,f=Math.max(0,-(a*d+o)),m=-f*f+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Lr).addScaledVector(vs,d),m}intersectSphere(e,t){Sn.subVectors(e.center,this.origin);const n=Sn.dot(this.direction),s=Sn.dot(Sn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,n,s,r){Ir.subVectors(t,e),Ms.subVectors(n,e),Dr.crossVectors(Ir,Ms);let a=this.direction.dot(Dr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Bn.subVectors(this.origin,e);const l=o*this.direction.dot(Ms.crossVectors(Bn,Ms));if(l<0)return null;const c=o*this.direction.dot(Ir.cross(Bn));if(c<0||l+c>a)return null;const h=-o*Bn.dot(Dr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class hc extends ls{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ge(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=Gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Yo=new dt,Jn=new _d,ys=new ja,$o=new O,Ss=new O,bs=new O,Es=new O,Ur=new O,Ts=new O,Ko=new O,As=new O;class Bt extends Rt{constructor(e=new $t,t=new hc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ts.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(Ur.fromBufferAttribute(f,e),a?Ts.addScaledVector(Ur,h):Ts.addScaledVector(Ur.sub(t),h))}t.add(Ts)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ys.copy(n.boundingSphere),ys.applyMatrix4(r),Jn.copy(e.ray).recast(e.near),!(ys.containsPoint(Jn.origin)===!1&&(Jn.intersectSphere(ys,$o)===null||Jn.origin.distanceToSquared($o)>(e.far-e.near)**2))&&(Yo.copy(r).invert(),Jn.copy(e.ray).applyMatrix4(Yo),!(n.boundingBox!==null&&Jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Jn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,d=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,M=d.length;_<M;_++){const p=d[_],u=a[p.materialIndex],E=Math.max(p.start,m.start),w=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let y=E,A=w;y<A;y+=3){const S=o.getX(y),R=o.getX(y+1),x=o.getX(y+2);s=ws(this,u,e,n,c,h,f,S,R,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),M=Math.min(o.count,m.start+m.count);for(let p=_,u=M;p<u;p+=3){const E=o.getX(p),w=o.getX(p+1),y=o.getX(p+2);s=ws(this,a,e,n,c,h,f,E,w,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,M=d.length;_<M;_++){const p=d[_],u=a[p.materialIndex],E=Math.max(p.start,m.start),w=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=E,A=w;y<A;y+=3){const S=y,R=y+1,x=y+2;s=ws(this,u,e,n,c,h,f,S,R,x),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let p=_,u=M;p<u;p+=3){const E=p,w=p+1,y=p+2;s=ws(this,a,e,n,c,h,f,E,w,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function xd(i,e,t,n,s,r,a,o){let l;if(e.side===kt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===qn,o),l===null)return null;As.copy(o),As.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(As);return c<t.near||c>t.far?null:{distance:c,point:As.clone(),object:i}}function ws(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Ss),i.getVertexPosition(l,bs),i.getVertexPosition(c,Es);const h=xd(i,e,t,n,Ss,bs,Es,Ko);if(h){const f=new O;en.getBarycoord(Ko,Ss,bs,Es,f),s&&(h.uv=en.getInterpolatedAttribute(s,o,l,c,f,new ze)),r&&(h.uv1=en.getInterpolatedAttribute(r,o,l,c,f,new ze)),a&&(h.normal=en.getInterpolatedAttribute(a,o,l,c,f,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new O,materialIndex:0};en.getNormal(Ss,bs,Es,d.normal),h.face=d,h.barycoord=f}return h}class vd extends Nt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=wt,h=wt,f,d){super(null,a,o,l,c,h,s,r,f,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Nr=new O,Md=new O,yd=new Ie;class ei{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Nr.subVectors(n,t).cross(Md.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(Nr),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||yd.getNormalMatrix(e),s=this.coplanarPoint(Nr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Qn=new ja,Sd=new ze(.5,.5),Rs=new O;class eo{constructor(e=new ei,t=new ei,n=new ei,s=new ei,r=new ei,a=new ei){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=fn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],d=r[6],m=r[7],_=r[8],M=r[9],p=r[10],u=r[11],E=r[12],w=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-a,m-h,u-_,A-E).normalize(),s[1].setComponents(c+a,m+h,u+_,A+E).normalize(),s[2].setComponents(c+o,m+f,u+M,A+w).normalize(),s[3].setComponents(c-o,m-f,u-M,A-w).normalize(),n)s[4].setComponents(l,d,p,y).normalize(),s[5].setComponents(c-l,m-d,u-p,A-y).normalize();else if(s[4].setComponents(c-l,m-d,u-p,A-y).normalize(),t===fn)s[5].setComponents(c+l,m+d,u+p,A+y).normalize();else if(t===ss)s[5].setComponents(l,d,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Qn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Qn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Qn)}intersectsSprite(e){Qn.center.set(0,0,0);const t=Sd.distanceTo(e.center);return Qn.radius=.7071067811865476+t,Qn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Qn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Rs.x=s.normal.x>0?e.max.x:e.min.x,Rs.y=s.normal.y>0?e.max.y:e.min.y,Rs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Rs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class dc extends Nt{constructor(e=[],t=li,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Oi extends Nt{constructor(e,t,n=gn,s,r,a,o=wt,l=wt,c,h=Ln,f=1){if(h!==Ln&&h!==ai)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:f};super(d,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Qa(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class bd extends Oi{constructor(e,t=gn,n=li,s,r,a=wt,o=wt,l,c=Ln){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class fc extends Nt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Hi extends $t{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let d=0,m=0;_("z","y","x",-1,-1,n,t,e,a,r,0),_("z","y","x",1,-1,n,t,-e,a,r,1),_("x","z","y",1,1,e,n,t,s,a,2),_("x","z","y",1,-1,e,n,-t,s,a,3),_("x","y","z",1,-1,e,t,n,s,r,4),_("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Et(c,3)),this.setAttribute("normal",new Et(h,3)),this.setAttribute("uv",new Et(f,2));function _(M,p,u,E,w,y,A,S,R,x,b){const C=y/R,P=A/x,U=y/2,V=A/2,Y=S/2,F=R+1,q=x+1;let z=0,Q=0;const ee=new O;for(let de=0;de<q;de++){const me=de*P-V;for(let ve=0;ve<F;ve++){const Ye=ve*C-U;ee[M]=Ye*E,ee[p]=me*w,ee[u]=Y,c.push(ee.x,ee.y,ee.z),ee[M]=0,ee[p]=0,ee[u]=S>0?1:-1,h.push(ee.x,ee.y,ee.z),f.push(ve/R),f.push(1-de/x),z+=1}}for(let de=0;de<x;de++)for(let me=0;me<R;me++){const ve=d+me+F*de,Ye=d+me+F*(de+1),ot=d+(me+1)+F*(de+1),$e=d+(me+1)+F*de;l.push(ve,Ye,$e),l.push(Ye,ot,$e),Q+=6}o.addGroup(m,Q,b),m+=Q,d+=z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Hi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class to extends $t{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,f=Math.PI/2*e,d=t,m=2*f+d,_=n*2+r,M=s+1,p=new O,u=new O;for(let E=0;E<=_;E++){let w=0,y=0,A=0,S=0;if(E<=n){const b=E/n,C=b*Math.PI/2;y=-h-e*Math.cos(C),A=e*Math.sin(C),S=-e*Math.cos(C),w=b*f}else if(E<=n+r){const b=(E-n)/r;y=-h+b*t,A=e,S=0,w=f+b*d}else{const b=(E-n-r)/n,C=b*Math.PI/2;y=h+e*Math.sin(C),A=e*Math.cos(C),S=e*Math.sin(C),w=f+d+b*f}const R=Math.max(0,Math.min(1,w/m));let x=0;E===0?x=.5/s:E===_&&(x=-.5/s);for(let b=0;b<=s;b++){const C=b/s,P=C*Math.PI*2,U=Math.sin(P),V=Math.cos(P);u.x=-A*V,u.y=y,u.z=A*U,o.push(u.x,u.y,u.z),p.set(-A*V,S,A*U),p.normalize(),l.push(p.x,p.y,p.z),c.push(C+x,R)}if(E>0){const b=(E-1)*M;for(let C=0;C<s;C++){const P=b+C,U=b+C+1,V=E*M+C,Y=E*M+C+1;a.push(P,U,V),a.push(U,Y,V)}}}this.setIndex(a),this.setAttribute("position",new Et(o,3)),this.setAttribute("normal",new Et(l,3)),this.setAttribute("uv",new Et(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new to(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class Js extends $t{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],d=[],m=[];let _=0;const M=[],p=n/2;let u=0;E(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Et(f,3)),this.setAttribute("normal",new Et(d,3)),this.setAttribute("uv",new Et(m,2));function E(){const y=new O,A=new O;let S=0;const R=(t-e)/n;for(let x=0;x<=r;x++){const b=[],C=x/r,P=C*(t-e)+e;for(let U=0;U<=s;U++){const V=U/s,Y=V*l+o,F=Math.sin(Y),q=Math.cos(Y);A.x=P*F,A.y=-C*n+p,A.z=P*q,f.push(A.x,A.y,A.z),y.set(F,R,q).normalize(),d.push(y.x,y.y,y.z),m.push(V,1-C),b.push(_++)}M.push(b)}for(let x=0;x<s;x++)for(let b=0;b<r;b++){const C=M[b][x],P=M[b+1][x],U=M[b+1][x+1],V=M[b][x+1];(e>0||b!==0)&&(h.push(C,P,V),S+=3),(t>0||b!==r-1)&&(h.push(P,U,V),S+=3)}c.addGroup(u,S,0),u+=S}function w(y){const A=_,S=new ze,R=new O;let x=0;const b=y===!0?e:t,C=y===!0?1:-1;for(let U=1;U<=s;U++)f.push(0,p*C,0),d.push(0,C,0),m.push(.5,.5),_++;const P=_;for(let U=0;U<=s;U++){const Y=U/s*l+o,F=Math.cos(Y),q=Math.sin(Y);R.x=b*q,R.y=p*C,R.z=b*F,f.push(R.x,R.y,R.z),d.push(0,C,0),S.x=F*.5+.5,S.y=q*.5*C+.5,m.push(S.x,S.y),_++}for(let U=0;U<s;U++){const V=A+U,Y=P+U;y===!0?h.push(Y,Y+1,V):h.push(Y+1,Y,V),x+=3}c.addGroup(u,x,y===!0?1:2),u+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Js(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class no extends Js{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new no(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Qs extends $t{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=e/o,d=t/l,m=[],_=[],M=[],p=[];for(let u=0;u<h;u++){const E=u*d-a;for(let w=0;w<c;w++){const y=w*f-r;_.push(y,-E,0),M.push(0,0,1),p.push(w/o),p.push(1-u/l)}}for(let u=0;u<l;u++)for(let E=0;E<o;E++){const w=E+c*u,y=E+c*(u+1),A=E+1+c*(u+1),S=E+1+c*u;m.push(w,y,S),m.push(y,A,S)}this.setIndex(m),this.setAttribute("position",new Et(_,3)),this.setAttribute("normal",new Et(M,3)),this.setAttribute("uv",new Et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qs(e.width,e.height,e.widthSegments,e.heightSegments)}}class io extends $t{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new O,d=new O,m=[],_=[],M=[],p=[];for(let u=0;u<=n;u++){const E=[],w=u/n,y=a+w*o,A=e*Math.cos(y),S=Math.sqrt(e*e-A*A);let R=0;u===0&&a===0?R=.5/t:u===n&&l===Math.PI&&(R=-.5/t);for(let x=0;x<=t;x++){const b=x/t,C=s+b*r;f.x=-S*Math.cos(C),f.y=A,f.z=S*Math.sin(C),_.push(f.x,f.y,f.z),d.copy(f).normalize(),M.push(d.x,d.y,d.z),p.push(b+R,1-w),E.push(c++)}h.push(E)}for(let u=0;u<n;u++)for(let E=0;E<t;E++){const w=h[u][E+1],y=h[u][E],A=h[u+1][E],S=h[u+1][E+1];(u!==0||a>0)&&m.push(w,y,S),(u!==n-1||l<Math.PI)&&m.push(y,A,S)}this.setIndex(m),this.setAttribute("position",new Et(_,3)),this.setAttribute("normal",new Et(M,3)),this.setAttribute("uv",new Et(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new io(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function ki(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Zo(s))s.isRenderTargetTexture?(Ce("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Zo(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function Dt(i){const e={};for(let t=0;t<i.length;t++){const n=ki(i[t]);for(const s in n)e[s]=n[s]}return e}function Zo(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Ed(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function uc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Be.workingColorSpace}const Td={clone:ki,merge:Dt};var Ad=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class _n extends ls{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ad,this.fragmentShader=wd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ki(e.uniforms),this.uniformsGroups=Ed(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Ge().setHex(s.value);break;case"v2":this.uniforms[n].value=new ze().fromArray(s.value);break;case"v3":this.uniforms[n].value=new O().fromArray(s.value);break;case"v4":this.uniforms[n].value=new at().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ie().fromArray(s.value);break;case"m4":this.uniforms[n].value=new dt().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Rd extends _n{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Cd extends ls{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ge(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ge(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Na,this.normalScale=new ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Pd extends ls{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ld extends ls{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class pc extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ge(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class Id extends pc{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ge(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Fr=new dt,Jo=new O,Qo=new O;class Dd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ze(512,512),this.mapType=Wt,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new eo,this._frameExtents=new ze(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Jo.setFromMatrixPosition(e.matrixWorld),t.position.copy(Jo),Qo.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qo),t.updateMatrixWorld(),Fr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fr,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===ss||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Fr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Cs=new O,Ps=new Bi,on=new O;class mc extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=fn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Cs,Ps,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cs,Ps,on.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Cs,Ps,on),on.x===1&&on.y===1&&on.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Cs,Ps,on.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Hn=new O,jo=new ze,el=new ze;class jt extends mc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Fa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(fr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Fa*2*Math.atan(Math.tan(fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Hn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z),Hn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z)}getViewSize(e,t){return this.getViewBounds(e,jo,el),t.subVectors(el,jo)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(fr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class js extends mc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Ud extends Dd{constructor(){super(new js(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class tl extends pc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new Ud}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const Ri=-90,Ci=1;class Nd extends Rt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new jt(Ri,Ci,e,t);s.layers=this.layers,this.add(s);const r=new jt(Ri,Ci,e,t);r.layers=this.layers,this.add(r);const a=new jt(Ri,Ci,e,t);a.layers=this.layers,this.add(a);const o=new jt(Ri,Ci,e,t);o.layers=this.layers,this.add(o);const l=new jt(Ri,Ci,e,t);l.layers=this.layers,this.add(l);const c=new jt(Ri,Ci,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===fn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ss)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=M,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,d,m),e.xr.enabled=_,n.texture.needsPMREMUpdate=!0}}class Fd extends jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const lo=class lo{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};lo.prototype.isMatrix2=!0;let nl=lo;function il(i,e,t,n){const s=Od(n);switch(t){case tc:return i*e;case ic:return i*e/s.components*s.byteLength;case Ya:return i*e/s.components*s.byteLength;case ci:return i*e*2/s.components*s.byteLength;case $a:return i*e*2/s.components*s.byteLength;case nc:return i*e*3/s.components*s.byteLength;case nn:return i*e*4/s.components*s.byteLength;case Ka:return i*e*4/s.components*s.byteLength;case Ns:case Fs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Os:case ks:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case aa:case la:return Math.max(i,16)*Math.max(e,8)/4;case ra:case oa:return Math.max(i,8)*Math.max(e,8)/2;case ca:case ha:case fa:case ua:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case da:case Vs:case pa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ma:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ga:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case _a:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case xa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case va:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ma:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case ya:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Sa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case ba:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ea:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ta:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Aa:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case wa:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Ra:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ca:case Pa:case La:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ia:case Da:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Ws:case Ua:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Od(i){switch(i){case Wt:case Jl:return{byteLength:1,components:1};case ns:case Ql:case Pn:return{byteLength:2,components:1};case Xa:case qa:return{byteLength:2,components:4};case gn:case Wa:case dn:return{byteLength:4,components:1};case jl:case ec:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Va}}));typeof window<"u"&&(window.__THREE__?Ce("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Va);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function gc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function kd(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((m,_)=>m.start-_.start);let d=0;for(let m=1;m<f.length;m++){const _=f[d],M=f[m];M.start<=_.start+_.count+1?_.count=Math.max(_.count,M.start+M.count-_.start):(++d,f[d]=M)}f.length=d+1;for(let m=0,_=f.length;m<_;m++){const M=f[m];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var Bd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Hd=`#ifdef USE_ALPHAHASH
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
#endif`,zd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xd=`#ifdef USE_AOMAP
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
#endif`,qd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Yd=`#ifdef USE_BATCHING
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
#endif`,$d=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Kd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Jd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Qd=`#ifdef USE_IRIDESCENCE
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
#endif`,jd=`#ifdef USE_BUMPMAP
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
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,nf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,sf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,af=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,of=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,lf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,cf=`#define PI 3.141592653589793
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
} // validated`,hf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,df=`vec3 transformedNormal = objectNormal;
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
#endif`,ff=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,pf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,mf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,gf="gl_FragColor = linearToOutputTexel( gl_FragColor );",_f=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xf=`#ifdef USE_ENVMAP
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
#endif`,vf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Mf=`#ifdef USE_ENVMAP
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
#endif`,yf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sf=`#ifdef USE_ENVMAP
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
#endif`,bf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ef=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Af=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wf=`#ifdef USE_GRADIENTMAP
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
}`,Rf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Pf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Lf=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,If=`#ifdef USE_ENVMAP
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
#endif`,Df=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Uf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Nf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ff=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Of=`PhysicalMaterial material;
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
#endif`,kf=`uniform sampler2D dfgLUT;
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
}`,Bf=`
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
#endif`,Hf=`#if defined( RE_IndirectDiffuse )
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
#endif`,zf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Gf=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Vf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Yf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$f=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Kf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Zf=`#if defined( USE_POINTS_UV )
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
#endif`,Jf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Qf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,eu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,tu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nu=`#ifdef USE_MORPHTARGETS
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
#endif`,iu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,su=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ru=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,au=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ou=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lu=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,cu=`#ifdef USE_NORMALMAP
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
#endif`,hu=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,du=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,fu=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,uu=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,pu=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,mu=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,gu=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_u=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xu=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,vu=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mu=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,yu=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Su=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,bu=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Eu=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Tu=`float getShadowMask() {
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
}`,Au=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,wu=`#ifdef USE_SKINNING
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
#endif`,Ru=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Cu=`#ifdef USE_SKINNING
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
#endif`,Pu=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Lu=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Iu=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Du=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Uu=`#ifdef USE_TRANSMISSION
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
#endif`,Nu=`#ifdef USE_TRANSMISSION
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
#endif`,Fu=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ou=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ku=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bu=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Hu=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zu=`uniform sampler2D t2D;
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
}`,Gu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vu=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Wu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Xu=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,qu=`#include <common>
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
}`,Yu=`#if DEPTH_PACKING == 3200
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
}`,$u=`#define DISTANCE
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
}`,Ku=`#define DISTANCE
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
}`,Zu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ju=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qu=`uniform float scale;
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
}`,ju=`uniform vec3 diffuse;
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
}`,ep=`#include <common>
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
}`,tp=`uniform vec3 diffuse;
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
}`,np=`#define LAMBERT
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
}`,ip=`#define LAMBERT
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
}`,sp=`#define MATCAP
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
}`,rp=`#define MATCAP
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
}`,ap=`#define NORMAL
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
}`,op=`#define NORMAL
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
}`,lp=`#define PHONG
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
}`,cp=`#define PHONG
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
}`,hp=`#define STANDARD
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
}`,dp=`#define STANDARD
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
}`,fp=`#define TOON
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
}`,up=`#define TOON
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
}`,pp=`uniform float size;
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
}`,mp=`uniform vec3 diffuse;
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
}`,gp=`#include <common>
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
}`,_p=`uniform vec3 color;
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
}`,xp=`uniform float rotation;
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
}`,vp=`uniform vec3 diffuse;
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
}`,Fe={alphahash_fragment:Bd,alphahash_pars_fragment:Hd,alphamap_fragment:zd,alphamap_pars_fragment:Gd,alphatest_fragment:Vd,alphatest_pars_fragment:Wd,aomap_fragment:Xd,aomap_pars_fragment:qd,batching_pars_vertex:Yd,batching_vertex:$d,begin_vertex:Kd,beginnormal_vertex:Zd,bsdfs:Jd,iridescence_fragment:Qd,bumpmap_pars_fragment:jd,clipping_planes_fragment:ef,clipping_planes_pars_fragment:tf,clipping_planes_pars_vertex:nf,clipping_planes_vertex:sf,color_fragment:rf,color_pars_fragment:af,color_pars_vertex:of,color_vertex:lf,common:cf,cube_uv_reflection_fragment:hf,defaultnormal_vertex:df,displacementmap_pars_vertex:ff,displacementmap_vertex:uf,emissivemap_fragment:pf,emissivemap_pars_fragment:mf,colorspace_fragment:gf,colorspace_pars_fragment:_f,envmap_fragment:xf,envmap_common_pars_fragment:vf,envmap_pars_fragment:Mf,envmap_pars_vertex:yf,envmap_physical_pars_fragment:If,envmap_vertex:Sf,fog_vertex:bf,fog_pars_vertex:Ef,fog_fragment:Tf,fog_pars_fragment:Af,gradientmap_pars_fragment:wf,lightmap_pars_fragment:Rf,lights_lambert_fragment:Cf,lights_lambert_pars_fragment:Pf,lights_pars_begin:Lf,lights_toon_fragment:Df,lights_toon_pars_fragment:Uf,lights_phong_fragment:Nf,lights_phong_pars_fragment:Ff,lights_physical_fragment:Of,lights_physical_pars_fragment:kf,lights_fragment_begin:Bf,lights_fragment_maps:Hf,lights_fragment_end:zf,lightprobes_pars_fragment:Gf,logdepthbuf_fragment:Vf,logdepthbuf_pars_fragment:Wf,logdepthbuf_pars_vertex:Xf,logdepthbuf_vertex:qf,map_fragment:Yf,map_pars_fragment:$f,map_particle_fragment:Kf,map_particle_pars_fragment:Zf,metalnessmap_fragment:Jf,metalnessmap_pars_fragment:Qf,morphinstance_vertex:jf,morphcolor_vertex:eu,morphnormal_vertex:tu,morphtarget_pars_vertex:nu,morphtarget_vertex:iu,normal_fragment_begin:su,normal_fragment_maps:ru,normal_pars_fragment:au,normal_pars_vertex:ou,normal_vertex:lu,normalmap_pars_fragment:cu,clearcoat_normal_fragment_begin:hu,clearcoat_normal_fragment_maps:du,clearcoat_pars_fragment:fu,iridescence_pars_fragment:uu,opaque_fragment:pu,packing:mu,premultiplied_alpha_fragment:gu,project_vertex:_u,dithering_fragment:xu,dithering_pars_fragment:vu,roughnessmap_fragment:Mu,roughnessmap_pars_fragment:yu,shadowmap_pars_fragment:Su,shadowmap_pars_vertex:bu,shadowmap_vertex:Eu,shadowmask_pars_fragment:Tu,skinbase_vertex:Au,skinning_pars_vertex:wu,skinning_vertex:Ru,skinnormal_vertex:Cu,specularmap_fragment:Pu,specularmap_pars_fragment:Lu,tonemapping_fragment:Iu,tonemapping_pars_fragment:Du,transmission_fragment:Uu,transmission_pars_fragment:Nu,uv_pars_fragment:Fu,uv_pars_vertex:Ou,uv_vertex:ku,worldpos_vertex:Bu,background_vert:Hu,background_frag:zu,backgroundCube_vert:Gu,backgroundCube_frag:Vu,cube_vert:Wu,cube_frag:Xu,depth_vert:qu,depth_frag:Yu,distance_vert:$u,distance_frag:Ku,equirect_vert:Zu,equirect_frag:Ju,linedashed_vert:Qu,linedashed_frag:ju,meshbasic_vert:ep,meshbasic_frag:tp,meshlambert_vert:np,meshlambert_frag:ip,meshmatcap_vert:sp,meshmatcap_frag:rp,meshnormal_vert:ap,meshnormal_frag:op,meshphong_vert:lp,meshphong_frag:cp,meshphysical_vert:hp,meshphysical_frag:dp,meshtoon_vert:fp,meshtoon_frag:up,points_vert:pp,points_frag:mp,shadow_vert:gp,shadow_frag:_p,sprite_vert:xp,sprite_frag:vp},he={common:{diffuse:{value:new Ge(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ie}},envmap:{envMap:{value:null},envMapRotation:{value:new Ie},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ie},normalScale:{value:new ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ge(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new O},probesMax:{value:new O},probesResolution:{value:new O}},points:{diffuse:{value:new Ge(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0},uvTransform:{value:new Ie}},sprite:{diffuse:{value:new Ge(16777215)},opacity:{value:1},center:{value:new ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ie},alphaMap:{value:null},alphaMapTransform:{value:new Ie},alphaTest:{value:0}}},hn={basic:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ge(0)},envMapIntensity:{value:1}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:Dt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new Ge(0)},specular:{value:new Ge(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:Dt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new Ge(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:Dt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new Ge(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:Dt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:Dt([he.points,he.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:Dt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:Dt([he.common,he.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:Dt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:Dt([he.sprite,he.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ie}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distance:{uniforms:Dt([he.common,he.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distance_vert,fragmentShader:Fe.distance_frag},shadow:{uniforms:Dt([he.lights,he.fog,{color:{value:new Ge(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};hn.physical={uniforms:Dt([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ie},clearcoatNormalScale:{value:new ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ie},sheen:{value:0},sheenColor:{value:new Ge(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ie},transmissionSamplerSize:{value:new ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ie},attenuationDistance:{value:0},attenuationColor:{value:new Ge(0)},specularColor:{value:new Ge(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ie},anisotropyVector:{value:new ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ie}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const Ls={r:0,b:0,g:0},Mp=new dt,_c=new Ie;_c.set(-1,0,0,0,1,0,0,0,1);function yp(i,e,t,n,s,r){const a=new Ge(0);let o=s===!0?0:1,l,c,h=null,f=0,d=null;function m(E){let w=E.isScene===!0?E.background:null;if(w&&w.isTexture){const y=E.backgroundBlurriness>0;w=e.get(w,y)}return w}function _(E){let w=!1;const y=m(E);y===null?p(a,o):y&&y.isColor&&(p(y,1),w=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(E,w){const y=m(w);y&&(y.isCubeTexture||y.mapping===Zs)?(c===void 0&&(c=new Bt(new Hi(1,1,1),new _n({name:"BackgroundCubeMaterial",uniforms:ki(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,S,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Mp.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(_c),c.material.toneMapped=Be.getTransfer(y.colorSpace)!==Qe,(h!==y||f!==y.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,d=i.toneMapping),c.layers.enableAll(),E.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Bt(new Qs(2,2),new _n({name:"BackgroundMaterial",uniforms:ki(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=Be.getTransfer(y.colorSpace)!==Qe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,d=i.toneMapping),l.layers.enableAll(),E.unshift(l,l.geometry,l.material,0,0,null))}function p(E,w){E.getRGB(Ls,uc(i)),t.buffers.color.setClear(Ls.r,Ls.g,Ls.b,w,r)}function u(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(E,w=1){a.set(E),o=w,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(E){o=E,p(a,o)},render:_,addToRenderList:M,dispose:u}}function Sp(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,a=!1;function o(P,U,V,Y,F){let q=!1;const z=f(P,Y,V,U);r!==z&&(r=z,c(r.object)),q=m(P,Y,V,F),q&&_(P,Y,V,F),F!==null&&e.update(F,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(P,U,V,Y),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function f(P,U,V,Y){const F=Y.wireframe===!0;let q=n[U.id];q===void 0&&(q={},n[U.id]=q);const z=P.isInstancedMesh===!0?P.id:0;let Q=q[z];Q===void 0&&(Q={},q[z]=Q);let ee=Q[V.id];ee===void 0&&(ee={},Q[V.id]=ee);let de=ee[F];return de===void 0&&(de=d(l()),ee[F]=de),de}function d(P){const U=[],V=[],Y=[];for(let F=0;F<t;F++)U[F]=0,V[F]=0,Y[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:V,attributeDivisors:Y,object:P,attributes:{},index:null}}function m(P,U,V,Y){const F=r.attributes,q=U.attributes;let z=0;const Q=V.getAttributes();for(const ee in Q)if(Q[ee].location>=0){const me=F[ee];let ve=q[ee];if(ve===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(ve=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(ve=P.instanceColor)),me===void 0||me.attribute!==ve||ve&&me.data!==ve.data)return!0;z++}return r.attributesNum!==z||r.index!==Y}function _(P,U,V,Y){const F={},q=U.attributes;let z=0;const Q=V.getAttributes();for(const ee in Q)if(Q[ee].location>=0){let me=q[ee];me===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(me=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(me=P.instanceColor));const ve={};ve.attribute=me,me&&me.data&&(ve.data=me.data),F[ee]=ve,z++}r.attributes=F,r.attributesNum=z,r.index=Y}function M(){const P=r.newAttributes;for(let U=0,V=P.length;U<V;U++)P[U]=0}function p(P){u(P,0)}function u(P,U){const V=r.newAttributes,Y=r.enabledAttributes,F=r.attributeDivisors;V[P]=1,Y[P]===0&&(i.enableVertexAttribArray(P),Y[P]=1),F[P]!==U&&(i.vertexAttribDivisor(P,U),F[P]=U)}function E(){const P=r.newAttributes,U=r.enabledAttributes;for(let V=0,Y=U.length;V<Y;V++)U[V]!==P[V]&&(i.disableVertexAttribArray(V),U[V]=0)}function w(P,U,V,Y,F,q,z){z===!0?i.vertexAttribIPointer(P,U,V,F,q):i.vertexAttribPointer(P,U,V,Y,F,q)}function y(P,U,V,Y){M();const F=Y.attributes,q=V.getAttributes(),z=U.defaultAttributeValues;for(const Q in q){const ee=q[Q];if(ee.location>=0){let de=F[Q];if(de===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(de=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(de=P.instanceColor)),de!==void 0){const me=de.normalized,ve=de.itemSize,Ye=e.get(de);if(Ye===void 0)continue;const ot=Ye.buffer,$e=Ye.type,Z=Ye.bytesPerElement,se=$e===i.INT||$e===i.UNSIGNED_INT||de.gpuType===Wa;if(de.isInterleavedBufferAttribute){const te=de.data,Pe=te.stride,De=de.offset;if(te.isInstancedInterleavedBuffer){for(let we=0;we<ee.locationSize;we++)u(ee.location+we,te.meshPerAttribute);P.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let we=0;we<ee.locationSize;we++)p(ee.location+we);i.bindBuffer(i.ARRAY_BUFFER,ot);for(let we=0;we<ee.locationSize;we++)w(ee.location+we,ve/ee.locationSize,$e,me,Pe*Z,(De+ve/ee.locationSize*we)*Z,se)}else{if(de.isInstancedBufferAttribute){for(let te=0;te<ee.locationSize;te++)u(ee.location+te,de.meshPerAttribute);P.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let te=0;te<ee.locationSize;te++)p(ee.location+te);i.bindBuffer(i.ARRAY_BUFFER,ot);for(let te=0;te<ee.locationSize;te++)w(ee.location+te,ve/ee.locationSize,$e,me,ve*Z,ve/ee.locationSize*te*Z,se)}}else if(z!==void 0){const me=z[Q];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(ee.location,me);break;case 3:i.vertexAttrib3fv(ee.location,me);break;case 4:i.vertexAttrib4fv(ee.location,me);break;default:i.vertexAttrib1fv(ee.location,me)}}}}E()}function A(){b();for(const P in n){const U=n[P];for(const V in U){const Y=U[V];for(const F in Y){const q=Y[F];for(const z in q)h(q[z].object),delete q[z];delete Y[F]}}delete n[P]}}function S(P){if(n[P.id]===void 0)return;const U=n[P.id];for(const V in U){const Y=U[V];for(const F in Y){const q=Y[F];for(const z in q)h(q[z].object),delete q[z];delete Y[F]}}delete n[P.id]}function R(P){for(const U in n){const V=n[U];for(const Y in V){const F=V[Y];if(F[P.id]===void 0)continue;const q=F[P.id];for(const z in q)h(q[z].object),delete q[z];delete F[P.id]}}}function x(P){for(const U in n){const V=n[U],Y=P.isInstancedMesh===!0?P.id:0,F=V[Y];if(F!==void 0){for(const q in F){const z=F[q];for(const Q in z)h(z[Q].object),delete z[Q];delete F[q]}delete V[Y],Object.keys(V).length===0&&delete n[U]}}}function b(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:b,resetDefaultState:C,dispose:A,releaseStatesOfGeometry:S,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:M,enableAttribute:p,disableUnusedAttributes:E}}function bp(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let m=0;m<h;m++)d+=c[m];t.update(d,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Ep(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==nn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===Pn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Wt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==dn&&!x)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Ce("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Ce("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const m=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),u=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),S=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:m,maxVertexTextures:_,maxTextureSize:M,maxCubemapSize:p,maxAttributes:u,maxVertexUniforms:E,maxVaryings:w,maxFragmentUniforms:y,maxSamples:A,samples:S}}function Tp(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new ei,o=new Ie,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const m=f.length!==0||d||n!==0||s;return s=d,n=f.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,m){const _=f.clippingPlanes,M=f.clipIntersection,p=f.clipShadows,u=i.get(f);if(!s||_===null||_.length===0||r&&!p)r?h(null):c();else{const E=r?0:n,w=E*4;let y=u.clippingState||null;l.value=y,y=h(_,d,w,m);for(let A=0;A!==w;++A)y[A]=t[A];u.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,d,m,_){const M=f!==null?f.length:0;let p=null;if(M!==0){if(p=l.value,_!==!0||p===null){const u=m+M*4,E=d.matrixWorldInverse;o.getNormalMatrix(E),(p===null||p.length<u)&&(p=new Float32Array(u));for(let w=0,y=m;w!==M;++w,y+=4)a.copy(f[w]).applyMatrix4(E,o),a.normal.toArray(p,y),p[y+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,p}}const Vn=4,sl=[.125,.215,.35,.446,.526,.582],ni=20,Ap=256,Zi=new js,rl=new Ge;let Or=null,kr=0,Br=0,Hr=!1;const wp=new O;class al{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=wp}=r;Or=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Br=this._renderer.getActiveMipmapLevel(),Hr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ll(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Or,kr,Br),this._renderer.xr.enabled=Hr,e.scissorTest=!1,Pi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===li||e.mapping===Fi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Or=this._renderer.getRenderTarget(),kr=this._renderer.getActiveCubeFace(),Br=this._renderer.getActiveMipmapLevel(),Hr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:It,minFilter:It,generateMipmaps:!1,type:Pn,format:nn,colorSpace:Xs,depthBuffer:!1},s=ol(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ol(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Rp(r)),this._blurMaterial=Pp(r,e,t),this._ggxMaterial=Cp(r,e,t)}return s}_compileMaterial(e){const t=new Bt(new $t,e);this._renderer.compile(t,Zi)}_sceneToCubeUV(e,t,n,s,r){const l=new jt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,m=f.toneMapping;f.getClearColor(rl),f.toneMapping=un,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Bt(new Hi,new hc({name:"PMREM.Background",side:kt,depthWrite:!1,depthTest:!1})));const M=this._backgroundBox,p=M.material;let u=!1;const E=e.background;E?E.isColor&&(p.color.copy(E),e.background=null,u=!0):(p.color.copy(rl),u=!0);for(let w=0;w<6;w++){const y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));const A=this._cubeSize;Pi(s,y*A,w>2?A:0,A,A),f.setRenderTarget(s),u&&f.render(M,l),f.render(e,l)}f.toneMapping=m,f.autoClear=d,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===li||e.mapping===Fi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ll());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Pi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Zi)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),d=0+c*1.25,m=f*d,{_lodMax:_}=this,M=this._sizeLods[n],p=3*M*(n>_-Vn?n-_+Vn:0),u=4*(this._cubeSize-M);l.envMap.value=e.texture,l.roughness.value=m,l.mipInt.value=_-t,Pi(r,p,u,3*M,2*M),s.setRenderTarget(r),s.render(o,Zi),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=_-n,Pi(e,p,u,3*M,2*M),s.setRenderTarget(e),s.render(o,Zi)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Xe("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=c;const d=c.uniforms,m=this._sizeLods[n]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ni-1),M=r/_,p=isFinite(r)?1+Math.floor(h*M):ni;p>ni&&Ce(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${ni}`);const u=[];let E=0;for(let R=0;R<ni;++R){const x=R/M,b=Math.exp(-x*x/2);u.push(b),R===0?E+=b:R<p&&(E+=2*b)}for(let R=0;R<u.length;R++)u[R]=u[R]/E;d.envMap.value=e.texture,d.samples.value=p,d.weights.value=u,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:w}=this;d.dTheta.value=_,d.mipInt.value=w-n;const y=this._sizeLods[s],A=3*y*(s>w-Vn?s-w+Vn:0),S=4*(this._cubeSize-y);Pi(t,A,S,3*y,2*y),l.setRenderTarget(t),l.render(f,Zi)}}function Rp(i){const e=[],t=[],n=[];let s=i;const r=i-Vn+1+sl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Vn?l=sl[a-i+Vn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],m=6,_=6,M=3,p=2,u=1,E=new Float32Array(M*_*m),w=new Float32Array(p*_*m),y=new Float32Array(u*_*m);for(let S=0;S<m;S++){const R=S%3*2/3-1,x=S>2?0:-1,b=[R,x,0,R+2/3,x,0,R+2/3,x+1,0,R,x,0,R+2/3,x+1,0,R,x+1,0];E.set(b,M*_*S),w.set(d,p*_*S);const C=[S,S,S,S,S,S];y.set(C,u*_*S)}const A=new $t;A.setAttribute("position",new mn(E,M)),A.setAttribute("uv",new mn(w,p)),A.setAttribute("faceIndex",new mn(y,u)),n.push(new Bt(A,null)),s>Vn&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function ol(i,e,t){const n=new pn(i,e,t);return n.texture.mapping=Zs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Pi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Cp(i,e,t){return new _n({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ap,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:er(),fragmentShader:`

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
		`,blending:wn,depthTest:!1,depthWrite:!1})}function Pp(i,e,t){const n=new Float32Array(ni),s=new O(0,1,0);return new _n({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:er(),fragmentShader:`

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
		`,blending:wn,depthTest:!1,depthWrite:!1})}function ll(){return new _n({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:er(),fragmentShader:`

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
		`,blending:wn,depthTest:!1,depthWrite:!1})}function cl(){return new _n({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:er(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:wn,depthTest:!1,depthWrite:!1})}function er(){return`

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
	`}class xc extends pn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new dc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Hi(5,5,5),r=new _n({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:kt,blending:wn});r.uniforms.tEquirect.value=t;const a=new Bt(s,r),o=t.minFilter;return t.minFilter===ri&&(t.minFilter=It),new Nd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function Lp(i){let e=new WeakMap,t=new WeakMap,n=null;function s(d,m=!1){return d==null?null:m?a(d):r(d)}function r(d){if(d&&d.isTexture){const m=d.mapping;if(m===cr||m===hr)if(e.has(d)){const _=e.get(d).texture;return o(_,d.mapping)}else{const _=d.image;if(_&&_.height>0){const M=new xc(_.height);return M.fromEquirectangularTexture(i,d),e.set(d,M),d.addEventListener("dispose",c),o(M.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const m=d.mapping,_=m===cr||m===hr,M=m===li||m===Fi;if(_||M){let p=t.get(d);const u=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==u)return n===null&&(n=new al(i)),p=_?n.fromEquirectangular(d,p):n.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),p.texture;if(p!==void 0)return p.texture;{const E=d.image;return _&&E&&E.height>0||M&&E&&l(E)?(n===null&&(n=new al(i)),p=_?n.fromEquirectangular(d):n.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,t.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,m){return m===cr?d.mapping=li:m===hr&&(d.mapping=Fi),d}function l(d){let m=0;const _=6;for(let M=0;M<_;M++)d[M]!==void 0&&m++;return m===_}function c(d){const m=d.target;m.removeEventListener("dispose",c);const _=e.get(m);_!==void 0&&(e.delete(m),_.dispose())}function h(d){const m=d.target;m.removeEventListener("dispose",h);const _=t.get(m);_!==void 0&&(t.delete(m),_.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Ip(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Ii("WebGLRenderer: "+n+" extension not supported."),s}}}function Dp(i,e,t,n){const s={},r=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const _ in d.attributes)e.remove(d.attributes[_]);d.removeEventListener("dispose",a),delete s[d.id];const m=r.get(d);m&&(e.remove(m),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const m in d)e.update(d[m],i.ARRAY_BUFFER)}function c(f){const d=[],m=f.index,_=f.attributes.position;let M=0;if(_===void 0)return;if(m!==null){const E=m.array;M=m.version;for(let w=0,y=E.length;w<y;w+=3){const A=E[w+0],S=E[w+1],R=E[w+2];d.push(A,S,S,R,R,A)}}else{const E=_.array;M=_.version;for(let w=0,y=E.length/3-1;w<y;w+=3){const A=w+0,S=w+1,R=w+2;d.push(A,S,S,R,R,A)}}const p=new(_.count>=65535?cc:lc)(d,1);p.version=M;const u=r.get(f);u&&e.remove(u),r.set(f,p)}function h(f){const d=r.get(f);if(d){const m=f.index;m!==null&&d.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function Up(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,d){i.drawElements(n,d,r,f*a),t.update(d,n,1)}function c(f,d,m){m!==0&&(i.drawElementsInstanced(n,d,r,f*a,m),t.update(d,n,m))}function h(f,d,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,f,0,m);let M=0;for(let p=0;p<m;p++)M+=d[p];t.update(M,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Np(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:Xe("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Fp(i,e,t){const n=new WeakMap,s=new at;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==f){let C=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var m=C;d!==void 0&&d.texture.dispose();const _=o.morphAttributes.position!==void 0,M=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,u=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let y=0;_===!0&&(y=1),M===!0&&(y=2),p===!0&&(y=3);let A=o.attributes.position.count*y,S=1;A>e.maxTextureSize&&(S=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const R=new Float32Array(A*S*4*f),x=new rc(R,A,S,f);x.type=dn,x.needsUpdate=!0;const b=y*4;for(let P=0;P<f;P++){const U=u[P],V=E[P],Y=w[P],F=A*S*4*P;for(let q=0;q<U.count;q++){const z=q*b;_===!0&&(s.fromBufferAttribute(U,q),R[F+z+0]=s.x,R[F+z+1]=s.y,R[F+z+2]=s.z,R[F+z+3]=0),M===!0&&(s.fromBufferAttribute(V,q),R[F+z+4]=s.x,R[F+z+5]=s.y,R[F+z+6]=s.z,R[F+z+7]=0),p===!0&&(s.fromBufferAttribute(Y,q),R[F+z+8]=s.x,R[F+z+9]=s.y,R[F+z+10]=s.z,R[F+z+11]=Y.itemSize===4?s.w:1)}}d={count:f,texture:x,size:new ze(A,S)},n.set(o,d),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let _=0;for(let p=0;p<c.length;p++)_+=c[p];const M=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(i,"morphTargetBaseInfluence",M),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Op(i,e,t,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,d=e.get(c,f);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const m=c.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const kp={[Vl]:"LINEAR_TONE_MAPPING",[Wl]:"REINHARD_TONE_MAPPING",[Xl]:"CINEON_TONE_MAPPING",[ql]:"ACES_FILMIC_TONE_MAPPING",[$l]:"AGX_TONE_MAPPING",[Kl]:"NEUTRAL_TONE_MAPPING",[Yl]:"CUSTOM_TONE_MAPPING"};function Bp(i,e,t,n,s,r){const a=new pn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new Oi(e,t):void 0}),o=new pn(e,t,{type:Pn,depthBuffer:!1,stencilBuffer:!1}),l=new $t;l.setAttribute("position",new Et([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new Et([0,2,0,0,2,0],2));const c=new Rd({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Bt(l,c),f=new js(-1,1,1,-1,0,1);let d=null,m=null,_=!1,M,p=null,u=[],E=!1;this.setSize=function(w,y){a.setSize(w,y),o.setSize(w,y);for(let A=0;A<u.length;A++){const S=u[A];S.setSize&&S.setSize(w,y)}},this.setEffects=function(w){u=w,E=u.length>0&&u[0].isRenderPass===!0;const y=a.width,A=a.height;for(let S=0;S<u.length;S++){const R=u[S];R.setSize&&R.setSize(y,A)}},this.begin=function(w,y){if(_||w.toneMapping===un&&u.length===0)return!1;if(p=y,y!==null){const A=y.width,S=y.height;(a.width!==A||a.height!==S)&&this.setSize(A,S)}return E===!1&&w.setRenderTarget(a),M=w.toneMapping,w.toneMapping=un,!0},this.hasRenderPass=function(){return E},this.end=function(w,y){w.toneMapping=M,_=!0;let A=a,S=o;for(let R=0;R<u.length;R++){const x=u[R];if(x.enabled!==!1&&(x.render(w,S,A,y),x.needsSwap!==!1)){const b=A;A=S,S=b}}if(d!==w.outputColorSpace||m!==w.toneMapping){d=w.outputColorSpace,m=w.toneMapping,c.defines={},Be.getTransfer(d)===Qe&&(c.defines.SRGB_TRANSFER="");const R=kp[m];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,w.setRenderTarget(p),w.render(h,f),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const vc=new Nt,Oa=new Oi(1,1),Mc=new rc,yc=new sd,Sc=new dc,hl=[],dl=[],fl=new Float32Array(16),ul=new Float32Array(9),pl=new Float32Array(4);function zi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=hl[s];if(r===void 0&&(r=new Float32Array(s),hl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function yt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function tr(i,e){let t=dl[e];t===void 0&&(t=new Int32Array(e),dl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Hp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function zp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),yt(t,e)}}function Gp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),yt(t,e)}}function Vp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),yt(t,e)}}function Wp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;pl.set(n),i.uniformMatrix2fv(this.addr,!1,pl),yt(t,n)}}function Xp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;ul.set(n),i.uniformMatrix3fv(this.addr,!1,ul),yt(t,n)}}function qp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),yt(t,e)}else{if(Mt(t,n))return;fl.set(n),i.uniformMatrix4fv(this.addr,!1,fl),yt(t,n)}}function Yp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function $p(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),yt(t,e)}}function Kp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),yt(t,e)}}function Zp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),yt(t,e)}}function Jp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Qp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),yt(t,e)}}function jp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),yt(t,e)}}function em(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),yt(t,e)}}function tm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Oa.compareFunction=t.isReversedDepthBuffer()?Ja:Za,r=Oa):r=vc,t.setTexture2D(e||r,s)}function nm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||yc,s)}function im(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Sc,s)}function sm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Mc,s)}function rm(i){switch(i){case 5126:return Hp;case 35664:return zp;case 35665:return Gp;case 35666:return Vp;case 35674:return Wp;case 35675:return Xp;case 35676:return qp;case 5124:case 35670:return Yp;case 35667:case 35671:return $p;case 35668:case 35672:return Kp;case 35669:case 35673:return Zp;case 5125:return Jp;case 36294:return Qp;case 36295:return jp;case 36296:return em;case 35678:case 36198:case 36298:case 36306:case 35682:return tm;case 35679:case 36299:case 36307:return nm;case 35680:case 36300:case 36308:case 36293:return im;case 36289:case 36303:case 36311:case 36292:return sm}}function am(i,e){i.uniform1fv(this.addr,e)}function om(i,e){const t=zi(e,this.size,2);i.uniform2fv(this.addr,t)}function lm(i,e){const t=zi(e,this.size,3);i.uniform3fv(this.addr,t)}function cm(i,e){const t=zi(e,this.size,4);i.uniform4fv(this.addr,t)}function hm(i,e){const t=zi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dm(i,e){const t=zi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function fm(i,e){const t=zi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function um(i,e){i.uniform1iv(this.addr,e)}function pm(i,e){i.uniform2iv(this.addr,e)}function mm(i,e){i.uniform3iv(this.addr,e)}function gm(i,e){i.uniform4iv(this.addr,e)}function _m(i,e){i.uniform1uiv(this.addr,e)}function xm(i,e){i.uniform2uiv(this.addr,e)}function vm(i,e){i.uniform3uiv(this.addr,e)}function Mm(i,e){i.uniform4uiv(this.addr,e)}function ym(i,e,t){const n=this.cache,s=e.length,r=tr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Oa:a=vc;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function Sm(i,e,t){const n=this.cache,s=e.length,r=tr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||yc,r[a])}function bm(i,e,t){const n=this.cache,s=e.length,r=tr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Sc,r[a])}function Em(i,e,t){const n=this.cache,s=e.length,r=tr(t,s);Mt(n,r)||(i.uniform1iv(this.addr,r),yt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Mc,r[a])}function Tm(i){switch(i){case 5126:return am;case 35664:return om;case 35665:return lm;case 35666:return cm;case 35674:return hm;case 35675:return dm;case 35676:return fm;case 5124:case 35670:return um;case 35667:case 35671:return pm;case 35668:case 35672:return mm;case 35669:case 35673:return gm;case 5125:return _m;case 36294:return xm;case 36295:return vm;case 36296:return Mm;case 35678:case 36198:case 36298:case 36306:case 35682:return ym;case 35679:case 36299:case 36307:return Sm;case 35680:case 36300:case 36308:case 36293:return bm;case 36289:case 36303:case 36311:case 36292:return Em}}class Am{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=rm(t.type)}}class wm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Tm(t.type)}}class Rm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const zr=/(\w+)(\])?(\[|\.)?/g;function ml(i,e){i.seq.push(e),i.map[e.id]=e}function Cm(i,e,t){const n=i.name,s=n.length;for(zr.lastIndex=0;;){const r=zr.exec(n),a=zr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){ml(t,c===void 0?new Am(o,i,e):new wm(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new Rm(o),ml(t,f)),t=f}}}class Bs{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);Cm(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function gl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Pm=37297;let Lm=0;function Im(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const _l=new Ie;function Dm(i){Be._getMatrix(_l,Be.workingColorSpace,i);const e=`mat3( ${_l.elements.map(t=>t.toFixed(4))} )`;switch(Be.getTransfer(i)){case qs:return[e,"LinearTransferOETF"];case Qe:return[e,"sRGBTransferOETF"];default:return Ce("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function xl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Im(i.getShaderSource(e),o)}else return r}function Um(i,e){const t=Dm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Nm={[Vl]:"Linear",[Wl]:"Reinhard",[Xl]:"Cineon",[ql]:"ACESFilmic",[$l]:"AgX",[Kl]:"Neutral",[Yl]:"Custom"};function Fm(i,e){const t=Nm[e];return t===void 0?(Ce("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Is=new O;function Om(){Be.getLuminanceCoefficients(Is);const i=Is.x.toFixed(4),e=Is.y.toFixed(4),t=Is.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function km(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ji).join(`
`)}function Bm(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Hm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function ji(i){return i!==""}function vl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ml(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const zm=/^[ \t]*#include +<([\w\d./]+)>/gm;function ka(i){return i.replace(zm,Vm)}const Gm=new Map;function Vm(i,e){let t=Fe[e];if(t===void 0){const n=Gm.get(e);if(n!==void 0)t=Fe[n],Ce('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ka(t)}const Wm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yl(i){return i.replace(Wm,Xm)}function Xm(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Sl(i){let e=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const qm={[Us]:"SHADOWMAP_TYPE_PCF",[Qi]:"SHADOWMAP_TYPE_VSM"};function Ym(i){return qm[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const $m={[li]:"ENVMAP_TYPE_CUBE",[Fi]:"ENVMAP_TYPE_CUBE",[Zs]:"ENVMAP_TYPE_CUBE_UV"};function Km(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":$m[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Zm={[Fi]:"ENVMAP_MODE_REFRACTION"};function Jm(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Zm[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Qm={[Gl]:"ENVMAP_BLENDING_MULTIPLY",[Oh]:"ENVMAP_BLENDING_MIX",[kh]:"ENVMAP_BLENDING_ADD"};function jm(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Qm[i.combine]||"ENVMAP_BLENDING_NONE"}function e0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function t0(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Ym(t),c=Km(t),h=Jm(t),f=jm(t),d=e0(t),m=km(t),_=Bm(r),M=s.createProgram();let p,u,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ji).join(`
`),p.length>0&&(p+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ji).join(`
`),u.length>0&&(u+=`
`)):(p=[Sl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ji).join(`
`),u=[Sl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==un?"#define TONE_MAPPING":"",t.toneMapping!==un?Fe.tonemapping_pars_fragment:"",t.toneMapping!==un?Fm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,Um("linearToOutputTexel",t.outputColorSpace),Om(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ji).join(`
`)),a=ka(a),a=vl(a,t),a=Ml(a,t),o=ka(o),o=vl(o,t),o=Ml(o,t),a=yl(a),o=yl(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,u=["#define varying in",t.glslVersion===Do?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Do?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const w=E+p+a,y=E+u+o,A=gl(s,s.VERTEX_SHADER,w),S=gl(s,s.FRAGMENT_SHADER,y);s.attachShader(M,A),s.attachShader(M,S),t.index0AttributeName!==void 0?s.bindAttribLocation(M,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function R(P){if(i.debug.checkShaderErrors){const U=s.getProgramInfoLog(M)||"",V=s.getShaderInfoLog(A)||"",Y=s.getShaderInfoLog(S)||"",F=U.trim(),q=V.trim(),z=Y.trim();let Q=!0,ee=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,A,S);else{const de=xl(s,A,"vertex"),me=xl(s,S,"fragment");Xe("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+de+`
`+me)}else F!==""?Ce("WebGLProgram: Program Info Log:",F):(q===""||z==="")&&(ee=!1);ee&&(P.diagnostics={runnable:Q,programLog:F,vertexShader:{log:q,prefix:p},fragmentShader:{log:z,prefix:u}})}s.deleteShader(A),s.deleteShader(S),x=new Bs(s,M),b=Hm(s,M)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let b;this.getAttributes=function(){return b===void 0&&R(this),b};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(M,Pm)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Lm++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=A,this.fragmentShader=S,this}let n0=0;class i0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new s0(e),t.set(e,n)),n}}class s0{constructor(e){this.id=n0++,this.code=e,this.usedTimes=0}}function r0(i){return i===ci||i===Vs||i===Ws}function a0(i,e,t,n,s,r){const a=new ac,o=new i0,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer;let d=n.precision;const m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(x){return l.add(x),x===0?"uv":`uv${x}`}function M(x,b,C,P,U,V){const Y=P.fog,F=U.geometry,q=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?P.environment:null,z=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,Q=e.get(x.envMap||q,z),ee=Q&&Q.mapping===Zs?Q.image.height:null,de=m[x.type];x.precision!==null&&(d=n.getMaxPrecision(x.precision),d!==x.precision&&Ce("WebGLProgram.getParameters:",x.precision,"not supported, using",d,"instead."));const me=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ve=me!==void 0?me.length:0;let Ye=0;F.morphAttributes.position!==void 0&&(Ye=1),F.morphAttributes.normal!==void 0&&(Ye=2),F.morphAttributes.color!==void 0&&(Ye=3);let ot,$e,Z,se;if(de){const Me=hn[de];ot=Me.vertexShader,$e=Me.fragmentShader}else{ot=x.vertexShader,$e=x.fragmentShader;const Me=o.getVertexShaderStage(x),ct=o.getFragmentShaderStage(x);o.update(x,Me,ct),Z=Me.id,se=ct.id}const te=i.getRenderTarget(),Pe=i.state.buffers.depth.getReversed(),De=U.isInstancedMesh===!0,we=U.isBatchedMesh===!0,ft=!!x.map,ke=!!x.matcap,et=!!Q,Ke=!!x.aoMap,Ve=!!x.lightMap,mt=!!x.bumpMap&&x.wireframe===!1,vt=!!x.normalMap,St=!!x.displacementMap,Tt=!!x.emissiveMap,lt=!!x.metalnessMap,gt=!!x.roughnessMap,I=x.anisotropy>0,Ft=x.clearcoat>0,Ze=x.dispersion>0,T=x.iridescence>0,g=x.sheen>0,N=x.transmission>0,H=I&&!!x.anisotropyMap,W=Ft&&!!x.clearcoatMap,ne=Ft&&!!x.clearcoatNormalMap,re=Ft&&!!x.clearcoatRoughnessMap,X=T&&!!x.iridescenceMap,K=T&&!!x.iridescenceThicknessMap,ae=g&&!!x.sheenColorMap,be=g&&!!x.sheenRoughnessMap,ce=!!x.specularMap,oe=!!x.specularColorMap,Ae=!!x.specularIntensityMap,Re=N&&!!x.transmissionMap,Ue=N&&!!x.thicknessMap,L=!!x.gradientMap,ie=!!x.alphaMap,$=x.alphaTest>0,le=!!x.alphaHash,pe=!!x.extensions;let j=un;x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(j=i.toneMapping);const Se={shaderID:de,shaderType:x.type,shaderName:x.name,vertexShader:ot,fragmentShader:$e,defines:x.defines,customVertexShaderID:Z,customFragmentShaderID:se,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:d,batching:we,batchingColor:we&&U._colorsTexture!==null,instancing:De,instancingColor:De&&U.instanceColor!==null,instancingMorph:De&&U.morphTexture!==null,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Be.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ft,matcap:ke,envMap:et,envMapMode:et&&Q.mapping,envMapCubeUVHeight:ee,aoMap:Ke,lightMap:Ve,bumpMap:mt,normalMap:vt,displacementMap:St,emissiveMap:Tt,normalMapObjectSpace:vt&&x.normalMapType===zh,normalMapTangentSpace:vt&&x.normalMapType===Na,packedNormalMap:vt&&x.normalMapType===Na&&r0(x.normalMap.format),metalnessMap:lt,roughnessMap:gt,anisotropy:I,anisotropyMap:H,clearcoat:Ft,clearcoatMap:W,clearcoatNormalMap:ne,clearcoatRoughnessMap:re,dispersion:Ze,iridescence:T,iridescenceMap:X,iridescenceThicknessMap:K,sheen:g,sheenColorMap:ae,sheenRoughnessMap:be,specularMap:ce,specularColorMap:oe,specularIntensityMap:Ae,transmission:N,transmissionMap:Re,thicknessMap:Ue,gradientMap:L,opaque:x.transparent===!1&&x.blending===Li&&x.alphaToCoverage===!1,alphaMap:ie,alphaTest:$,alphaHash:le,combine:x.combine,mapUv:ft&&_(x.map.channel),aoMapUv:Ke&&_(x.aoMap.channel),lightMapUv:Ve&&_(x.lightMap.channel),bumpMapUv:mt&&_(x.bumpMap.channel),normalMapUv:vt&&_(x.normalMap.channel),displacementMapUv:St&&_(x.displacementMap.channel),emissiveMapUv:Tt&&_(x.emissiveMap.channel),metalnessMapUv:lt&&_(x.metalnessMap.channel),roughnessMapUv:gt&&_(x.roughnessMap.channel),anisotropyMapUv:H&&_(x.anisotropyMap.channel),clearcoatMapUv:W&&_(x.clearcoatMap.channel),clearcoatNormalMapUv:ne&&_(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&_(x.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&_(x.iridescenceMap.channel),iridescenceThicknessMapUv:K&&_(x.iridescenceThicknessMap.channel),sheenColorMapUv:ae&&_(x.sheenColorMap.channel),sheenRoughnessMapUv:be&&_(x.sheenRoughnessMap.channel),specularMapUv:ce&&_(x.specularMap.channel),specularColorMapUv:oe&&_(x.specularColorMap.channel),specularIntensityMapUv:Ae&&_(x.specularIntensityMap.channel),transmissionMapUv:Re&&_(x.transmissionMap.channel),thicknessMapUv:Ue&&_(x.thicknessMap.channel),alphaMapUv:ie&&_(x.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(vt||I),vertexNormals:!!F.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!F.attributes.uv&&(ft||ie),fog:!!Y,useFog:x.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||F.attributes.normal===void 0&&vt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Pe,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:F.attributes.position!==void 0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Ye,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:ft&&x.map.isVideoTexture===!0&&Be.getTransfer(x.map.colorSpace)===Qe,decodeVideoTextureEmissive:Tt&&x.emissiveMap.isVideoTexture===!0&&Be.getTransfer(x.emissiveMap.colorSpace)===Qe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===En,flipSided:x.side===kt,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:pe&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&x.extensions.multiDraw===!0||we)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Se.vertexUv1s=l.has(1),Se.vertexUv2s=l.has(2),Se.vertexUv3s=l.has(3),l.clear(),Se}function p(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const C in x.defines)b.push(C),b.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(u(b,x),E(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function u(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function E(x,b){a.disableAll(),b.instancing&&a.enable(0),b.instancingColor&&a.enable(1),b.instancingMorph&&a.enable(2),b.matcap&&a.enable(3),b.envMap&&a.enable(4),b.normalMapObjectSpace&&a.enable(5),b.normalMapTangentSpace&&a.enable(6),b.clearcoat&&a.enable(7),b.iridescence&&a.enable(8),b.alphaTest&&a.enable(9),b.vertexColors&&a.enable(10),b.vertexAlphas&&a.enable(11),b.vertexUv1s&&a.enable(12),b.vertexUv2s&&a.enable(13),b.vertexUv3s&&a.enable(14),b.vertexTangents&&a.enable(15),b.anisotropy&&a.enable(16),b.alphaHash&&a.enable(17),b.batching&&a.enable(18),b.dispersion&&a.enable(19),b.batchingColor&&a.enable(20),b.gradientMap&&a.enable(21),b.packedNormalMap&&a.enable(22),b.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),b.numLightProbeGrids>0&&a.enable(22),b.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function w(x){const b=m[x.type];let C;if(b){const P=hn[b];C=Td.clone(P.uniforms)}else C=x.uniforms;return C}function y(x,b){let C=h.get(b);return C!==void 0?++C.usedTimes:(C=new t0(i,b,x,s),c.push(C),h.set(b,C)),C}function A(x){if(--x.usedTimes===0){const b=c.indexOf(x);c[b]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function S(x){o.remove(x)}function R(){o.dispose()}return{getParameters:M,getProgramCacheKey:p,getUniforms:w,acquireProgram:y,releaseProgram:A,releaseShaderCache:S,programs:c,dispose:R}}function o0(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function l0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function bl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function El(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d){let m=0;return d.isInstancedMesh&&(m+=2),d.isSkinnedMesh&&(m+=1),m}function o(d,m,_,M,p,u){let E=i[e];return E===void 0?(E={id:d.id,object:d,geometry:m,material:_,materialVariant:a(d),groupOrder:M,renderOrder:d.renderOrder,z:p,group:u},i[e]=E):(E.id=d.id,E.object=d,E.geometry=m,E.material=_,E.materialVariant=a(d),E.groupOrder=M,E.renderOrder=d.renderOrder,E.z=p,E.group=u),e++,E}function l(d,m,_,M,p,u){const E=o(d,m,_,M,p,u);_.transmission>0?n.push(E):_.transparent===!0?s.push(E):t.push(E)}function c(d,m,_,M,p,u){const E=o(d,m,_,M,p,u);_.transmission>0?n.unshift(E):_.transparent===!0?s.unshift(E):t.unshift(E)}function h(d,m,_){t.length>1&&t.sort(d||l0),n.length>1&&n.sort(m||bl),s.length>1&&s.sort(m||bl),_&&(t.reverse(),n.reverse(),s.reverse())}function f(){for(let d=e,m=i.length;d<m;d++){const _=i[d];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function c0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new El,i.set(n,[a])):s>=r.length?(a=new El,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function h0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new Ge};break;case"SpotLight":t={position:new O,direction:new O,color:new Ge,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Ge,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Ge,groundColor:new Ge};break;case"RectAreaLight":t={color:new Ge,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function d0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ze};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ze};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let f0=0;function u0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function p0(i){const e=new h0,t=d0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);const s=new O,r=new dt,a=new dt;function o(c){let h=0,f=0,d=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,_=0,M=0,p=0,u=0,E=0,w=0,y=0,A=0,S=0,R=0;c.sort(u0);for(let b=0,C=c.length;b<C;b++){const P=c[b],U=P.color,V=P.intensity,Y=P.distance;let F=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===ci?F=P.shadow.map.texture:F=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=U.r*V,f+=U.g*V,d+=U.b*V;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],V);R++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const z=P.shadow,Q=t.get(P);Q.shadowIntensity=z.intensity,Q.shadowBias=z.bias,Q.shadowNormalBias=z.normalBias,Q.shadowRadius=z.radius,Q.shadowMapSize=z.mapSize,n.directionalShadow[m]=Q,n.directionalShadowMap[m]=F,n.directionalShadowMatrix[m]=P.shadow.matrix,E++}n.directional[m]=q,m++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(U).multiplyScalar(V),q.distance=Y,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[M]=q;const z=P.shadow;if(P.map&&(n.spotLightMap[A]=P.map,A++,z.updateMatrices(P),P.castShadow&&S++),n.spotLightMatrix[M]=z.matrix,P.castShadow){const Q=t.get(P);Q.shadowIntensity=z.intensity,Q.shadowBias=z.bias,Q.shadowNormalBias=z.normalBias,Q.shadowRadius=z.radius,Q.shadowMapSize=z.mapSize,n.spotShadow[M]=Q,n.spotShadowMap[M]=F,y++}M++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(U).multiplyScalar(V),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=q,p++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const z=P.shadow,Q=t.get(P);Q.shadowIntensity=z.intensity,Q.shadowBias=z.bias,Q.shadowNormalBias=z.normalBias,Q.shadowRadius=z.radius,Q.shadowMapSize=z.mapSize,Q.shadowCameraNear=z.camera.near,Q.shadowCameraFar=z.camera.far,n.pointShadow[_]=Q,n.pointShadowMap[_]=F,n.pointShadowMatrix[_]=P.shadow.matrix,w++}n.point[_]=q,_++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(V),q.groundColor.copy(P.groundColor).multiplyScalar(V),n.hemi[u]=q,u++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=he.LTC_FLOAT_1,n.rectAreaLTC2=he.LTC_FLOAT_2):(n.rectAreaLTC1=he.LTC_HALF_1,n.rectAreaLTC2=he.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=d;const x=n.hash;(x.directionalLength!==m||x.pointLength!==_||x.spotLength!==M||x.rectAreaLength!==p||x.hemiLength!==u||x.numDirectionalShadows!==E||x.numPointShadows!==w||x.numSpotShadows!==y||x.numSpotMaps!==A||x.numLightProbes!==R)&&(n.directional.length=m,n.spot.length=M,n.rectArea.length=p,n.point.length=_,n.hemi.length=u,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=y+A-S,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=R,x.directionalLength=m,x.pointLength=_,x.spotLength=M,x.rectAreaLength=p,x.hemiLength=u,x.numDirectionalShadows=E,x.numPointShadows=w,x.numSpotShadows=y,x.numSpotMaps=A,x.numLightProbes=R,n.version=f0++)}function l(c,h){let f=0,d=0,m=0,_=0,M=0;const p=h.matrixWorldInverse;for(let u=0,E=c.length;u<E;u++){const w=c[u];if(w.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),f++}else if(w.isSpotLight){const y=n.spot[m];y.position.setFromMatrixPosition(w.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),m++}else if(w.isRectAreaLight){const y=n.rectArea[_];y.position.setFromMatrixPosition(w.matrixWorld),y.position.applyMatrix4(p),a.identity(),r.copy(w.matrixWorld),r.premultiply(p),a.extractRotation(r),y.halfWidth.set(w.width*.5,0,0),y.halfHeight.set(0,w.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),_++}else if(w.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(w.matrixWorld),y.position.applyMatrix4(p),d++}else if(w.isHemisphereLight){const y=n.hemi[M];y.direction.setFromMatrixPosition(w.matrixWorld),y.direction.transformDirection(p),M++}}}return{setup:o,setupView:l,state:n}}function Tl(i){const e=new p0(i),t=[],n=[],s=[];function r(d){f.camera=d,t.length=0,n.length=0,s.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){s.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function m0(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Tl(i),e.set(s,[o])):r>=a.length?(o=new Tl(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const g0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_0=`uniform sampler2D shadow_pass;
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
}`,x0=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],v0=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)],Al=new dt,Ji=new O,Gr=new O;function M0(i,e,t){let n=new eo;const s=new ze,r=new ze,a=new at,o=new Pd,l=new Ld,c={},h=t.maxTextureSize,f={[qn]:kt,[kt]:qn,[En]:En},d=new _n({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ze},radius:{value:4}},vertexShader:g0,fragmentShader:_0}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const _=new $t;_.setAttribute("position",new mn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Bt(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Us;let u=this.type;this.render=function(S,R,x){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===xh&&(Ce("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Us);const b=i.getRenderTarget(),C=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),U=i.state;U.setBlending(wn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const V=u!==this.type;V&&R.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(F=>F.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,F=S.length;Y<F;Y++){const q=S[Y],z=q.shadow;if(z===void 0){Ce("WebGLShadowMap:",q,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);const Q=z.getFrameExtents();s.multiply(Q),r.copy(z.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,z.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,z.mapSize.y=r.y));const ee=i.state.buffers.depth.getReversed();if(z.camera._reversedDepth=ee,z.map===null||V===!0){if(z.map!==null&&(z.map.depthTexture!==null&&(z.map.depthTexture.dispose(),z.map.depthTexture=null),z.map.dispose()),this.type===Qi){if(q.isPointLight){Ce("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new pn(s.x,s.y,{format:ci,type:Pn,minFilter:It,magFilter:It,generateMipmaps:!1}),z.map.texture.name=q.name+".shadowMap",z.map.depthTexture=new Oi(s.x,s.y,dn),z.map.depthTexture.name=q.name+".shadowMapDepth",z.map.depthTexture.format=Ln,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=wt,z.map.depthTexture.magFilter=wt}else q.isPointLight?(z.map=new xc(s.x),z.map.depthTexture=new bd(s.x,gn)):(z.map=new pn(s.x,s.y),z.map.depthTexture=new Oi(s.x,s.y,gn)),z.map.depthTexture.name=q.name+".shadowMap",z.map.depthTexture.format=Ln,this.type===Us?(z.map.depthTexture.compareFunction=ee?Ja:Za,z.map.depthTexture.minFilter=It,z.map.depthTexture.magFilter=It):(z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=wt,z.map.depthTexture.magFilter=wt);z.camera.updateProjectionMatrix()}const de=z.map.isWebGLCubeRenderTarget?6:1;for(let me=0;me<de;me++){if(z.map.isWebGLCubeRenderTarget)i.setRenderTarget(z.map,me),i.clear();else{me===0&&(i.setRenderTarget(z.map),i.clear());const ve=z.getViewport(me);a.set(r.x*ve.x,r.y*ve.y,r.x*ve.z,r.y*ve.w),U.viewport(a)}if(q.isPointLight){const ve=z.camera,Ye=z.matrix,ot=q.distance||ve.far;ot!==ve.far&&(ve.far=ot,ve.updateProjectionMatrix()),Ji.setFromMatrixPosition(q.matrixWorld),ve.position.copy(Ji),Gr.copy(ve.position),Gr.add(x0[me]),ve.up.copy(v0[me]),ve.lookAt(Gr),ve.updateMatrixWorld(),Ye.makeTranslation(-Ji.x,-Ji.y,-Ji.z),Al.multiplyMatrices(ve.projectionMatrix,ve.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Al,ve.coordinateSystem,ve.reversedDepth)}else z.updateMatrices(q);n=z.getFrustum(),y(R,x,z.camera,q,this.type)}z.isPointLightShadow!==!0&&this.type===Qi&&E(z,x),z.needsUpdate=!1}u=this.type,p.needsUpdate=!1,i.setRenderTarget(b,C,P)};function E(S,R){const x=e.update(M);d.defines.VSM_SAMPLES!==S.blurSamples&&(d.defines.VSM_SAMPLES=S.blurSamples,m.defines.VSM_SAMPLES=S.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new pn(s.x,s.y,{format:ci,type:Pn})),d.uniforms.shadow_pass.value=S.map.depthTexture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(R,null,x,d,M,null),m.uniforms.shadow_pass.value=S.mapPass.texture,m.uniforms.resolution.value=S.mapSize,m.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(R,null,x,m,M,null)}function w(S,R,x,b){let C=null;const P=x.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)C=P;else if(C=x.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const U=C.uuid,V=R.uuid;let Y=c[U];Y===void 0&&(Y={},c[U]=Y);let F=Y[V];F===void 0&&(F=C.clone(),Y[V]=F,R.addEventListener("dispose",A)),C=F}if(C.visible=R.visible,C.wireframe=R.wireframe,b===Qi?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:f[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const U=i.properties.get(C);U.light=x}return C}function y(S,R,x,b,C){if(S.visible===!1)return;if(S.layers.test(R.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&C===Qi)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,S.matrixWorld);const V=e.update(S),Y=S.material;if(Array.isArray(Y)){const F=V.groups;for(let q=0,z=F.length;q<z;q++){const Q=F[q],ee=Y[Q.materialIndex];if(ee&&ee.visible){const de=w(S,ee,b,C);S.onBeforeShadow(i,S,R,x,V,de,Q),i.renderBufferDirect(x,null,V,de,S,Q),S.onAfterShadow(i,S,R,x,V,de,Q)}}}else if(Y.visible){const F=w(S,Y,b,C);S.onBeforeShadow(i,S,R,x,V,F,null),i.renderBufferDirect(x,null,V,F,S,null),S.onAfterShadow(i,S,R,x,V,F,null)}}const U=S.children;for(let V=0,Y=U.length;V<Y;V++)y(U[V],R,x,b,C)}function A(S){S.target.removeEventListener("dispose",A);for(const x in c){const b=c[x],C=S.target.uuid;C in b&&(b[C].dispose(),delete b[C])}}}function y0(i,e){function t(){let L=!1;const ie=new at;let $=null;const le=new at(0,0,0,0);return{setMask:function(pe){$!==pe&&!L&&(i.colorMask(pe,pe,pe,pe),$=pe)},setLocked:function(pe){L=pe},setClear:function(pe,j,Se,Me,ct){ct===!0&&(pe*=Me,j*=Me,Se*=Me),ie.set(pe,j,Se,Me),le.equals(ie)===!1&&(i.clearColor(pe,j,Se,Me),le.copy(ie))},reset:function(){L=!1,$=null,le.set(-1,0,0,0)}}}function n(){let L=!1,ie=!1,$=null,le=null,pe=null;return{setReversed:function(j){if(ie!==j){const Se=e.get("EXT_clip_control");j?Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.ZERO_TO_ONE_EXT):Se.clipControlEXT(Se.LOWER_LEFT_EXT,Se.NEGATIVE_ONE_TO_ONE_EXT),ie=j;const Me=pe;pe=null,this.setClear(Me)}},getReversed:function(){return ie},setTest:function(j){j?te(i.DEPTH_TEST):Pe(i.DEPTH_TEST)},setMask:function(j){$!==j&&!L&&(i.depthMask(j),$=j)},setFunc:function(j){if(ie&&(j=Jh[j]),le!==j){switch(j){case Zr:i.depthFunc(i.NEVER);break;case Jr:i.depthFunc(i.ALWAYS);break;case Qr:i.depthFunc(i.LESS);break;case Ni:i.depthFunc(i.LEQUAL);break;case jr:i.depthFunc(i.EQUAL);break;case ea:i.depthFunc(i.GEQUAL);break;case ta:i.depthFunc(i.GREATER);break;case na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}le=j}},setLocked:function(j){L=j},setClear:function(j){pe!==j&&(pe=j,ie&&(j=1-j),i.clearDepth(j))},reset:function(){L=!1,$=null,le=null,pe=null,ie=!1}}}function s(){let L=!1,ie=null,$=null,le=null,pe=null,j=null,Se=null,Me=null,ct=null;return{setTest:function(it){L||(it?te(i.STENCIL_TEST):Pe(i.STENCIL_TEST))},setMask:function(it){ie!==it&&!L&&(i.stencilMask(it),ie=it)},setFunc:function(it,sn,rn){($!==it||le!==sn||pe!==rn)&&(i.stencilFunc(it,sn,rn),$=it,le=sn,pe=rn)},setOp:function(it,sn,rn){(j!==it||Se!==sn||Me!==rn)&&(i.stencilOp(it,sn,rn),j=it,Se=sn,Me=rn)},setLocked:function(it){L=it},setClear:function(it){ct!==it&&(i.clearStencil(it),ct=it)},reset:function(){L=!1,ie=null,$=null,le=null,pe=null,j=null,Se=null,Me=null,ct=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},d={},m=new WeakMap,_=[],M=null,p=!1,u=null,E=null,w=null,y=null,A=null,S=null,R=null,x=new Ge(0,0,0),b=0,C=!1,P=null,U=null,V=null,Y=null,F=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let z=!1,Q=0;const ee=i.getParameter(i.VERSION);ee.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ee)[1]),z=Q>=1):ee.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),z=Q>=2);let de=null,me={};const ve=i.getParameter(i.SCISSOR_BOX),Ye=i.getParameter(i.VIEWPORT),ot=new at().fromArray(ve),$e=new at().fromArray(Ye);function Z(L,ie,$,le){const pe=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Se=0;Se<$;Se++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,le,0,i.RGBA,i.UNSIGNED_BYTE,pe):i.texImage2D(ie+Se,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pe);return j}const se={};se[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),se[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),se[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(i.DEPTH_TEST),a.setFunc(Ni),mt(!1),vt(wo),te(i.CULL_FACE),Ke(wn);function te(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function Pe(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function De(L,ie){return d[L]!==ie?(i.bindFramebuffer(L,ie),d[L]=ie,L===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=ie),L===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function we(L,ie){let $=_,le=!1;if(L){$=m.get(ie),$===void 0&&($=[],m.set(ie,$));const pe=L.textures;if($.length!==pe.length||$[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Se=pe.length;j<Se;j++)$[j]=i.COLOR_ATTACHMENT0+j;$.length=pe.length,le=!0}}else $[0]!==i.BACK&&($[0]=i.BACK,le=!0);le&&i.drawBuffers($)}function ft(L){return M!==L?(i.useProgram(L),M=L,!0):!1}const ke={[ti]:i.FUNC_ADD,[Mh]:i.FUNC_SUBTRACT,[yh]:i.FUNC_REVERSE_SUBTRACT};ke[Sh]=i.MIN,ke[bh]=i.MAX;const et={[Eh]:i.ZERO,[Th]:i.ONE,[Ah]:i.SRC_COLOR,[$r]:i.SRC_ALPHA,[Ih]:i.SRC_ALPHA_SATURATE,[Ph]:i.DST_COLOR,[Rh]:i.DST_ALPHA,[wh]:i.ONE_MINUS_SRC_COLOR,[Kr]:i.ONE_MINUS_SRC_ALPHA,[Lh]:i.ONE_MINUS_DST_COLOR,[Ch]:i.ONE_MINUS_DST_ALPHA,[Dh]:i.CONSTANT_COLOR,[Uh]:i.ONE_MINUS_CONSTANT_COLOR,[Nh]:i.CONSTANT_ALPHA,[Fh]:i.ONE_MINUS_CONSTANT_ALPHA};function Ke(L,ie,$,le,pe,j,Se,Me,ct,it){if(L===wn){p===!0&&(Pe(i.BLEND),p=!1);return}if(p===!1&&(te(i.BLEND),p=!0),L!==vh){if(L!==u||it!==C){if((E!==ti||A!==ti)&&(i.blendEquation(i.FUNC_ADD),E=ti,A=ti),it)switch(L){case Li:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ro:i.blendFunc(i.ONE,i.ONE);break;case Co:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Po:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Xe("WebGLState: Invalid blending: ",L);break}else switch(L){case Li:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ro:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Co:Xe("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Po:Xe("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Xe("WebGLState: Invalid blending: ",L);break}w=null,y=null,S=null,R=null,x.set(0,0,0),b=0,u=L,C=it}return}pe=pe||ie,j=j||$,Se=Se||le,(ie!==E||pe!==A)&&(i.blendEquationSeparate(ke[ie],ke[pe]),E=ie,A=pe),($!==w||le!==y||j!==S||Se!==R)&&(i.blendFuncSeparate(et[$],et[le],et[j],et[Se]),w=$,y=le,S=j,R=Se),(Me.equals(x)===!1||ct!==b)&&(i.blendColor(Me.r,Me.g,Me.b,ct),x.copy(Me),b=ct),u=L,C=!1}function Ve(L,ie){L.side===En?Pe(i.CULL_FACE):te(i.CULL_FACE);let $=L.side===kt;ie&&($=!$),mt($),L.blending===Li&&L.transparent===!1?Ke(wn):Ke(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const le=L.stencilWrite;o.setTest(le),le&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Tt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):Pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function mt(L){P!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),P=L)}function vt(L){L!==gh?(te(i.CULL_FACE),L!==U&&(L===wo?i.cullFace(i.BACK):L===_h?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Pe(i.CULL_FACE),U=L}function St(L){L!==V&&(z&&i.lineWidth(L),V=L)}function Tt(L,ie,$){L?(te(i.POLYGON_OFFSET_FILL),(Y!==ie||F!==$)&&(Y=ie,F=$,a.getReversed()&&(ie=-ie),i.polygonOffset(ie,$))):Pe(i.POLYGON_OFFSET_FILL)}function lt(L){L?te(i.SCISSOR_TEST):Pe(i.SCISSOR_TEST)}function gt(L){L===void 0&&(L=i.TEXTURE0+q-1),de!==L&&(i.activeTexture(L),de=L)}function I(L,ie,$){$===void 0&&(de===null?$=i.TEXTURE0+q-1:$=de);let le=me[$];le===void 0&&(le={type:void 0,texture:void 0},me[$]=le),(le.type!==L||le.texture!==ie)&&(de!==$&&(i.activeTexture($),de=$),i.bindTexture(L,ie||se[L]),le.type=L,le.texture=ie)}function Ft(){const L=me[de];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function Ze(){try{i.compressedTexImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function g(){try{i.texSubImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function N(){try{i.texSubImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function W(){try{i.compressedTexSubImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function ne(){try{i.texStorage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function re(){try{i.texStorage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function X(){try{i.texImage2D(...arguments)}catch(L){Xe("WebGLState:",L)}}function K(){try{i.texImage3D(...arguments)}catch(L){Xe("WebGLState:",L)}}function ae(L){return f[L]!==void 0?f[L]:i.getParameter(L)}function be(L,ie){f[L]!==ie&&(i.pixelStorei(L,ie),f[L]=ie)}function ce(L){ot.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),ot.copy(L))}function oe(L){$e.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),$e.copy(L))}function Ae(L,ie){let $=c.get(ie);$===void 0&&($=new WeakMap,c.set(ie,$));let le=$.get(L);le===void 0&&(le=i.getUniformBlockIndex(ie,L.name),$.set(L,le))}function Re(L,ie){const le=c.get(ie).get(L);l.get(ie)!==le&&(i.uniformBlockBinding(ie,le,L.__bindingPointIndex),l.set(ie,le))}function Ue(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},de=null,me={},d={},m=new WeakMap,_=[],M=null,p=!1,u=null,E=null,w=null,y=null,A=null,S=null,R=null,x=new Ge(0,0,0),b=0,C=!1,P=null,U=null,V=null,Y=null,F=null,ot.set(0,0,i.canvas.width,i.canvas.height),$e.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Pe,bindFramebuffer:De,drawBuffers:we,useProgram:ft,setBlending:Ke,setMaterial:Ve,setFlipSided:mt,setCullFace:vt,setLineWidth:St,setPolygonOffset:Tt,setScissorTest:lt,activeTexture:gt,bindTexture:I,unbindTexture:Ft,compressedTexImage2D:Ze,compressedTexImage3D:T,texImage2D:X,texImage3D:K,pixelStorei:be,getParameter:ae,updateUBOMapping:Ae,uniformBlockBinding:Re,texStorage2D:ne,texStorage3D:re,texSubImage2D:g,texSubImage3D:N,compressedTexSubImage2D:H,compressedTexSubImage3D:W,scissor:ce,viewport:oe,reset:Ue}}function S0(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ze,h=new WeakMap,f=new Set;let d;const m=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(T,g){return _?new OffscreenCanvas(T,g):Ys("canvas")}function p(T,g,N){let H=1;const W=Ze(T);if((W.width>N||W.height>N)&&(H=N/Math.max(W.width,W.height)),H<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const ne=Math.floor(H*W.width),re=Math.floor(H*W.height);d===void 0&&(d=M(ne,re));const X=g?M(ne,re):d;return X.width=ne,X.height=re,X.getContext("2d").drawImage(T,0,0,ne,re),Ce("WebGLRenderer: Texture has been resized from ("+W.width+"x"+W.height+") to ("+ne+"x"+re+")."),X}else return"data"in T&&Ce("WebGLRenderer: Image in DataTexture is too big ("+W.width+"x"+W.height+")."),T;return T}function u(T){return T.generateMipmaps}function E(T){i.generateMipmap(T)}function w(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,g,N,H,W,ne=!1){if(T!==null){if(i[T]!==void 0)return i[T];Ce("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let re;H&&(re=e.get("EXT_texture_norm16"),re||Ce("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=g;if(g===i.RED&&(N===i.FLOAT&&(X=i.R32F),N===i.HALF_FLOAT&&(X=i.R16F),N===i.UNSIGNED_BYTE&&(X=i.R8),N===i.UNSIGNED_SHORT&&re&&(X=re.R16_EXT),N===i.SHORT&&re&&(X=re.R16_SNORM_EXT)),g===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(X=i.R8UI),N===i.UNSIGNED_SHORT&&(X=i.R16UI),N===i.UNSIGNED_INT&&(X=i.R32UI),N===i.BYTE&&(X=i.R8I),N===i.SHORT&&(X=i.R16I),N===i.INT&&(X=i.R32I)),g===i.RG&&(N===i.FLOAT&&(X=i.RG32F),N===i.HALF_FLOAT&&(X=i.RG16F),N===i.UNSIGNED_BYTE&&(X=i.RG8),N===i.UNSIGNED_SHORT&&re&&(X=re.RG16_EXT),N===i.SHORT&&re&&(X=re.RG16_SNORM_EXT)),g===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(X=i.RG8UI),N===i.UNSIGNED_SHORT&&(X=i.RG16UI),N===i.UNSIGNED_INT&&(X=i.RG32UI),N===i.BYTE&&(X=i.RG8I),N===i.SHORT&&(X=i.RG16I),N===i.INT&&(X=i.RG32I)),g===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(X=i.RGB8UI),N===i.UNSIGNED_SHORT&&(X=i.RGB16UI),N===i.UNSIGNED_INT&&(X=i.RGB32UI),N===i.BYTE&&(X=i.RGB8I),N===i.SHORT&&(X=i.RGB16I),N===i.INT&&(X=i.RGB32I)),g===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),N===i.UNSIGNED_INT&&(X=i.RGBA32UI),N===i.BYTE&&(X=i.RGBA8I),N===i.SHORT&&(X=i.RGBA16I),N===i.INT&&(X=i.RGBA32I)),g===i.RGB&&(N===i.UNSIGNED_SHORT&&re&&(X=re.RGB16_EXT),N===i.SHORT&&re&&(X=re.RGB16_SNORM_EXT),N===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),N===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),g===i.RGBA){const K=ne?qs:Be.getTransfer(W);N===i.FLOAT&&(X=i.RGBA32F),N===i.HALF_FLOAT&&(X=i.RGBA16F),N===i.UNSIGNED_BYTE&&(X=K===Qe?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT&&re&&(X=re.RGBA16_EXT),N===i.SHORT&&re&&(X=re.RGBA16_SNORM_EXT),N===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function A(T,g){let N;return T?g===null||g===gn||g===is?N=i.DEPTH24_STENCIL8:g===dn?N=i.DEPTH32F_STENCIL8:g===ns&&(N=i.DEPTH24_STENCIL8,Ce("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===gn||g===is?N=i.DEPTH_COMPONENT24:g===dn?N=i.DEPTH_COMPONENT32F:g===ns&&(N=i.DEPTH_COMPONENT16),N}function S(T,g){return u(T)===!0||T.isFramebufferTexture&&T.minFilter!==wt&&T.minFilter!==It?Math.log2(Math.max(g.width,g.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?g.mipmaps.length:1}function R(T){const g=T.target;g.removeEventListener("dispose",R),b(g),g.isVideoTexture&&h.delete(g),g.isHTMLTexture&&f.delete(g)}function x(T){const g=T.target;g.removeEventListener("dispose",x),P(g)}function b(T){const g=n.get(T);if(g.__webglInit===void 0)return;const N=T.source,H=m.get(N);if(H){const W=H[g.__cacheKey];W.usedTimes--,W.usedTimes===0&&C(T),Object.keys(H).length===0&&m.delete(N)}n.remove(T)}function C(T){const g=n.get(T);i.deleteTexture(g.__webglTexture);const N=T.source,H=m.get(N);delete H[g.__cacheKey],a.memory.textures--}function P(T){const g=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let H=0;H<6;H++){if(Array.isArray(g.__webglFramebuffer[H]))for(let W=0;W<g.__webglFramebuffer[H].length;W++)i.deleteFramebuffer(g.__webglFramebuffer[H][W]);else i.deleteFramebuffer(g.__webglFramebuffer[H]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[H])}else{if(Array.isArray(g.__webglFramebuffer))for(let H=0;H<g.__webglFramebuffer.length;H++)i.deleteFramebuffer(g.__webglFramebuffer[H]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let H=0;H<g.__webglColorRenderbuffer.length;H++)g.__webglColorRenderbuffer[H]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[H]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const N=T.textures;for(let H=0,W=N.length;H<W;H++){const ne=n.get(N[H]);ne.__webglTexture&&(i.deleteTexture(ne.__webglTexture),a.memory.textures--),n.remove(N[H])}n.remove(T)}let U=0;function V(){U=0}function Y(){return U}function F(T){U=T}function q(){const T=U;return T>=s.maxTextures&&Ce("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),U+=1,T}function z(T){const g=[];return g.push(T.wrapS),g.push(T.wrapT),g.push(T.wrapR||0),g.push(T.magFilter),g.push(T.minFilter),g.push(T.anisotropy),g.push(T.internalFormat),g.push(T.format),g.push(T.type),g.push(T.generateMipmaps),g.push(T.premultiplyAlpha),g.push(T.flipY),g.push(T.unpackAlignment),g.push(T.colorSpace),g.join()}function Q(T,g){const N=n.get(T);if(T.isVideoTexture&&I(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&N.__version!==T.version){const H=T.image;if(H===null)Ce("WebGLRenderer: Texture marked for update but no image data found.");else if(H.complete===!1)Ce("WebGLRenderer: Texture marked for update but image is incomplete");else{Pe(N,T,g);return}}else T.isExternalTexture&&(N.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+g)}function ee(T,g){const N=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&N.__version!==T.version){Pe(N,T,g);return}else T.isExternalTexture&&(N.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+g)}function de(T,g){const N=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&N.__version!==T.version){Pe(N,T,g);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+g)}function me(T,g){const N=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&N.__version!==T.version){De(N,T,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+g)}const ve={[ia]:i.REPEAT,[Tn]:i.CLAMP_TO_EDGE,[sa]:i.MIRRORED_REPEAT},Ye={[wt]:i.NEAREST,[Bh]:i.NEAREST_MIPMAP_NEAREST,[ds]:i.NEAREST_MIPMAP_LINEAR,[It]:i.LINEAR,[dr]:i.LINEAR_MIPMAP_NEAREST,[ri]:i.LINEAR_MIPMAP_LINEAR},ot={[Gh]:i.NEVER,[Yh]:i.ALWAYS,[Vh]:i.LESS,[Za]:i.LEQUAL,[Wh]:i.EQUAL,[Ja]:i.GEQUAL,[Xh]:i.GREATER,[qh]:i.NOTEQUAL};function $e(T,g){if(g.type===dn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===It||g.magFilter===dr||g.magFilter===ds||g.magFilter===ri||g.minFilter===It||g.minFilter===dr||g.minFilter===ds||g.minFilter===ri)&&Ce("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ve[g.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ve[g.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ve[g.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,Ye[g.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,Ye[g.minFilter]),g.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ot[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===wt||g.minFilter!==ds&&g.minFilter!==ri||g.type===dn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Z(T,g){let N=!1;T.__webglInit===void 0&&(T.__webglInit=!0,g.addEventListener("dispose",R));const H=g.source;let W=m.get(H);W===void 0&&(W={},m.set(H,W));const ne=z(g);if(ne!==T.__cacheKey){W[ne]===void 0&&(W[ne]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,N=!0),W[ne].usedTimes++;const re=W[T.__cacheKey];re!==void 0&&(W[T.__cacheKey].usedTimes--,re.usedTimes===0&&C(g)),T.__cacheKey=ne,T.__webglTexture=W[ne].texture}return N}function se(T,g,N){return Math.floor(Math.floor(T/N)/g)}function te(T,g,N,H){const ne=T.updateRanges;if(ne.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,N,H,g.data);else{ne.sort((be,ce)=>be.start-ce.start);let re=0;for(let be=1;be<ne.length;be++){const ce=ne[re],oe=ne[be],Ae=ce.start+ce.count,Re=se(oe.start,g.width,4),Ue=se(ce.start,g.width,4);oe.start<=Ae+1&&Re===Ue&&se(oe.start+oe.count-1,g.width,4)===Re?ce.count=Math.max(ce.count,oe.start+oe.count-ce.start):(++re,ne[re]=oe)}ne.length=re+1;const X=t.getParameter(i.UNPACK_ROW_LENGTH),K=t.getParameter(i.UNPACK_SKIP_PIXELS),ae=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let be=0,ce=ne.length;be<ce;be++){const oe=ne[be],Ae=Math.floor(oe.start/4),Re=Math.ceil(oe.count/4),Ue=Ae%g.width,L=Math.floor(Ae/g.width),ie=Re,$=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Ue),t.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Ue,L,ie,$,N,H,g.data)}T.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,X),t.pixelStorei(i.UNPACK_SKIP_PIXELS,K),t.pixelStorei(i.UNPACK_SKIP_ROWS,ae)}}function Pe(T,g,N){let H=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(H=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(H=i.TEXTURE_3D);const W=Z(T,g),ne=g.source;t.bindTexture(H,T.__webglTexture,i.TEXTURE0+N);const re=n.get(ne);if(ne.version!==re.__version||W===!0){if(t.activeTexture(i.TEXTURE0+N),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){const $=Be.getPrimaries(Be.workingColorSpace),le=g.colorSpace===Gn?null:Be.getPrimaries(g.colorSpace),pe=g.colorSpace===Gn||$===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}t.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment);let K=p(g.image,!1,s.maxTextureSize);K=Ft(g,K);const ae=r.convert(g.format,g.colorSpace),be=r.convert(g.type);let ce=y(g.internalFormat,ae,be,g.normalized,g.colorSpace,g.isVideoTexture);$e(H,g);let oe;const Ae=g.mipmaps,Re=g.isVideoTexture!==!0,Ue=re.__version===void 0||W===!0,L=ne.dataReady,ie=S(g,K);if(g.isDepthTexture)ce=A(g.format===ai,g.type),Ue&&(Re?t.texStorage2D(i.TEXTURE_2D,1,ce,K.width,K.height):t.texImage2D(i.TEXTURE_2D,0,ce,K.width,K.height,0,ae,be,null));else if(g.isDataTexture)if(Ae.length>0){Re&&Ue&&t.texStorage2D(i.TEXTURE_2D,ie,ce,Ae[0].width,Ae[0].height);for(let $=0,le=Ae.length;$<le;$++)oe=Ae[$],Re?L&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,oe.width,oe.height,ae,be,oe.data):t.texImage2D(i.TEXTURE_2D,$,ce,oe.width,oe.height,0,ae,be,oe.data);g.generateMipmaps=!1}else Re?(Ue&&t.texStorage2D(i.TEXTURE_2D,ie,ce,K.width,K.height),L&&te(g,K,ae,be)):t.texImage2D(i.TEXTURE_2D,0,ce,K.width,K.height,0,ae,be,K.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Re&&Ue&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,ce,Ae[0].width,Ae[0].height,K.depth);for(let $=0,le=Ae.length;$<le;$++)if(oe=Ae[$],g.format!==nn)if(ae!==null)if(Re){if(L)if(g.layerUpdates.size>0){const pe=il(oe.width,oe.height,g.format,g.type);for(const j of g.layerUpdates){const Se=oe.data.subarray(j*pe/oe.data.BYTES_PER_ELEMENT,(j+1)*pe/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,j,oe.width,oe.height,1,ae,Se)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,oe.width,oe.height,K.depth,ae,oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,$,ce,oe.width,oe.height,K.depth,0,oe.data,0,0);else Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Re?L&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,$,0,0,0,oe.width,oe.height,K.depth,ae,be,oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,$,ce,oe.width,oe.height,K.depth,0,ae,be,oe.data)}else{Re&&Ue&&t.texStorage2D(i.TEXTURE_2D,ie,ce,Ae[0].width,Ae[0].height);for(let $=0,le=Ae.length;$<le;$++)oe=Ae[$],g.format!==nn?ae!==null?Re?L&&t.compressedTexSubImage2D(i.TEXTURE_2D,$,0,0,oe.width,oe.height,ae,oe.data):t.compressedTexImage2D(i.TEXTURE_2D,$,ce,oe.width,oe.height,0,oe.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Re?L&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,oe.width,oe.height,ae,be,oe.data):t.texImage2D(i.TEXTURE_2D,$,ce,oe.width,oe.height,0,ae,be,oe.data)}else if(g.isDataArrayTexture)if(Re){if(Ue&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,ce,K.width,K.height,K.depth),L)if(g.layerUpdates.size>0){const $=il(K.width,K.height,g.format,g.type);for(const le of g.layerUpdates){const pe=K.data.subarray(le*$/K.data.BYTES_PER_ELEMENT,(le+1)*$/K.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,le,K.width,K.height,1,ae,be,pe)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,ae,be,K.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,ce,K.width,K.height,K.depth,0,ae,be,K.data);else if(g.isData3DTexture)Re?(Ue&&t.texStorage3D(i.TEXTURE_3D,ie,ce,K.width,K.height,K.depth),L&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,ae,be,K.data)):t.texImage3D(i.TEXTURE_3D,0,ce,K.width,K.height,K.depth,0,ae,be,K.data);else if(g.isFramebufferTexture){if(Ue)if(Re)t.texStorage2D(i.TEXTURE_2D,ie,ce,K.width,K.height);else{let $=K.width,le=K.height;for(let pe=0;pe<ie;pe++)t.texImage2D(i.TEXTURE_2D,pe,ce,$,le,0,ae,be,null),$>>=1,le>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in i){const $=i.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),K.parentNode!==$){$.appendChild(K),f.add(g),$.onpaint=le=>{const pe=le.changedElements;for(const j of f)pe.includes(j.image)&&(j.needsUpdate=!0)},$.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,K);else{const pe=i.RGBA,j=i.RGBA,Se=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,pe,j,Se,K)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Ae.length>0){if(Re&&Ue){const $=Ze(Ae[0]);t.texStorage2D(i.TEXTURE_2D,ie,ce,$.width,$.height)}for(let $=0,le=Ae.length;$<le;$++)oe=Ae[$],Re?L&&t.texSubImage2D(i.TEXTURE_2D,$,0,0,ae,be,oe):t.texImage2D(i.TEXTURE_2D,$,ce,ae,be,oe);g.generateMipmaps=!1}else if(Re){if(Ue){const $=Ze(K);t.texStorage2D(i.TEXTURE_2D,ie,ce,$.width,$.height)}L&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,be,K)}else t.texImage2D(i.TEXTURE_2D,0,ce,ae,be,K);u(g)&&E(H),re.__version=ne.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function De(T,g,N){if(g.image.length!==6)return;const H=Z(T,g),W=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+N);const ne=n.get(W);if(W.version!==ne.__version||H===!0){t.activeTexture(i.TEXTURE0+N);const re=Be.getPrimaries(Be.workingColorSpace),X=g.colorSpace===Gn?null:Be.getPrimaries(g.colorSpace),K=g.colorSpace===Gn||re===X?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);const ae=g.isCompressedTexture||g.image[0].isCompressedTexture,be=g.image[0]&&g.image[0].isDataTexture,ce=[];for(let j=0;j<6;j++)!ae&&!be?ce[j]=p(g.image[j],!0,s.maxCubemapSize):ce[j]=be?g.image[j].image:g.image[j],ce[j]=Ft(g,ce[j]);const oe=ce[0],Ae=r.convert(g.format,g.colorSpace),Re=r.convert(g.type),Ue=y(g.internalFormat,Ae,Re,g.normalized,g.colorSpace),L=g.isVideoTexture!==!0,ie=ne.__version===void 0||H===!0,$=W.dataReady;let le=S(g,oe);$e(i.TEXTURE_CUBE_MAP,g);let pe;if(ae){L&&ie&&t.texStorage2D(i.TEXTURE_CUBE_MAP,le,Ue,oe.width,oe.height);for(let j=0;j<6;j++){pe=ce[j].mipmaps;for(let Se=0;Se<pe.length;Se++){const Me=pe[Se];g.format!==nn?Ae!==null?L?$&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,0,0,Me.width,Me.height,Ae,Me.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,Ue,Me.width,Me.height,0,Me.data):Ce("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?$&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,0,0,Me.width,Me.height,Ae,Re,Me.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se,Ue,Me.width,Me.height,0,Ae,Re,Me.data)}}}else{if(pe=g.mipmaps,L&&ie){pe.length>0&&le++;const j=Ze(ce[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,le,Ue,j.width,j.height)}for(let j=0;j<6;j++)if(be){L?$&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ce[j].width,ce[j].height,Ae,Re,ce[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ue,ce[j].width,ce[j].height,0,Ae,Re,ce[j].data);for(let Se=0;Se<pe.length;Se++){const ct=pe[Se].image[j].image;L?$&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,0,0,ct.width,ct.height,Ae,Re,ct.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,Ue,ct.width,ct.height,0,Ae,Re,ct.data)}}else{L?$&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ae,Re,ce[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ue,Ae,Re,ce[j]);for(let Se=0;Se<pe.length;Se++){const Me=pe[Se];L?$&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,0,0,Ae,Re,Me.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Se+1,Ue,Ae,Re,Me.image[j])}}}u(g)&&E(i.TEXTURE_CUBE_MAP),ne.__version=W.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function we(T,g,N,H,W,ne){const re=r.convert(N.format,N.colorSpace),X=r.convert(N.type),K=y(N.internalFormat,re,X,N.normalized,N.colorSpace),ae=n.get(g),be=n.get(N);if(be.__renderTarget=g,!ae.__hasExternalTextures){const ce=Math.max(1,g.width>>ne),oe=Math.max(1,g.height>>ne);W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?t.texImage3D(W,ne,K,ce,oe,g.depth,0,re,X,null):t.texImage2D(W,ne,K,ce,oe,0,re,X,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),gt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,H,W,be.__webglTexture,0,lt(g)):(W===i.TEXTURE_2D||W>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,H,W,be.__webglTexture,ne),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ft(T,g,N){if(i.bindRenderbuffer(i.RENDERBUFFER,T),g.depthBuffer){const H=g.depthTexture,W=H&&H.isDepthTexture?H.type:null,ne=A(g.stencilBuffer,W),re=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;gt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt(g),ne,g.width,g.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt(g),ne,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ne,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,T)}else{const H=g.textures;for(let W=0;W<H.length;W++){const ne=H[W],re=r.convert(ne.format,ne.colorSpace),X=r.convert(ne.type),K=y(ne.internalFormat,re,X,ne.normalized,ne.colorSpace);gt(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,lt(g),K,g.width,g.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,lt(g),K,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,K,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ke(T,g,N){const H=g.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const W=n.get(g.depthTexture);if(W.__renderTarget=g,(!W.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),H){if(W.__webglInit===void 0&&(W.__webglInit=!0,g.depthTexture.addEventListener("dispose",R)),W.__webglTexture===void 0){W.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),$e(i.TEXTURE_CUBE_MAP,g.depthTexture);const ae=r.convert(g.depthTexture.format),be=r.convert(g.depthTexture.type);let ce;g.depthTexture.format===Ln?ce=i.DEPTH_COMPONENT24:g.depthTexture.format===ai&&(ce=i.DEPTH24_STENCIL8);for(let oe=0;oe<6;oe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ce,g.width,g.height,0,ae,be,null)}}else Q(g.depthTexture,0);const ne=W.__webglTexture,re=lt(g),X=H?i.TEXTURE_CUBE_MAP_POSITIVE_X+N:i.TEXTURE_2D,K=g.depthTexture.format===ai?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===Ln)gt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,X,ne,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,K,X,ne,0);else if(g.depthTexture.format===ai)gt(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,X,ne,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,K,X,ne,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(T){const g=n.get(T),N=T.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==T.depthTexture){const H=T.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),H){const W=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,H.removeEventListener("dispose",W)};H.addEventListener("dispose",W),g.__depthDisposeCallback=W}g.__boundDepthTexture=H}if(T.depthTexture&&!g.__autoAllocateDepthBuffer)if(N)for(let H=0;H<6;H++)ke(g.__webglFramebuffer[H],T,H);else{const H=T.texture.mipmaps;H&&H.length>0?ke(g.__webglFramebuffer[0],T,0):ke(g.__webglFramebuffer,T,0)}else if(N){g.__webglDepthbuffer=[];for(let H=0;H<6;H++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[H]),g.__webglDepthbuffer[H]===void 0)g.__webglDepthbuffer[H]=i.createRenderbuffer(),ft(g.__webglDepthbuffer[H],T,!1);else{const W=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=g.__webglDepthbuffer[H];i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,W,i.RENDERBUFFER,ne)}}else{const H=T.texture.mipmaps;if(H&&H.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),ft(g.__webglDepthbuffer,T,!1);else{const W=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,W,i.RENDERBUFFER,ne)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ke(T,g,N){const H=n.get(T);g!==void 0&&we(H.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&et(T)}function Ve(T){const g=T.texture,N=n.get(T),H=n.get(g);T.addEventListener("dispose",x);const W=T.textures,ne=T.isWebGLCubeRenderTarget===!0,re=W.length>1;if(re||(H.__webglTexture===void 0&&(H.__webglTexture=i.createTexture()),H.__version=g.version,a.memory.textures++),ne){N.__webglFramebuffer=[];for(let X=0;X<6;X++)if(g.mipmaps&&g.mipmaps.length>0){N.__webglFramebuffer[X]=[];for(let K=0;K<g.mipmaps.length;K++)N.__webglFramebuffer[X][K]=i.createFramebuffer()}else N.__webglFramebuffer[X]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){N.__webglFramebuffer=[];for(let X=0;X<g.mipmaps.length;X++)N.__webglFramebuffer[X]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(re)for(let X=0,K=W.length;X<K;X++){const ae=n.get(W[X]);ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&gt(T)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let X=0;X<W.length;X++){const K=W[X];N.__webglColorRenderbuffer[X]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[X]);const ae=r.convert(K.format,K.colorSpace),be=r.convert(K.type),ce=y(K.internalFormat,ae,be,K.normalized,K.colorSpace,T.isXRRenderTarget===!0),oe=lt(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,ce,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.RENDERBUFFER,N.__webglColorRenderbuffer[X])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),ft(N.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ne){t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture),$e(i.TEXTURE_CUBE_MAP,g);for(let X=0;X<6;X++)if(g.mipmaps&&g.mipmaps.length>0)for(let K=0;K<g.mipmaps.length;K++)we(N.__webglFramebuffer[X][K],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,K);else we(N.__webglFramebuffer[X],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);u(g)&&E(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(re){for(let X=0,K=W.length;X<K;X++){const ae=W[X],be=n.get(ae);let ce=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ce=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,be.__webglTexture),$e(ce,ae),we(N.__webglFramebuffer,T,ae,i.COLOR_ATTACHMENT0+X,ce,0),u(ae)&&E(ce)}t.unbindTexture()}else{let X=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(X=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(X,H.__webglTexture),$e(X,g),g.mipmaps&&g.mipmaps.length>0)for(let K=0;K<g.mipmaps.length;K++)we(N.__webglFramebuffer[K],T,g,i.COLOR_ATTACHMENT0,X,K);else we(N.__webglFramebuffer,T,g,i.COLOR_ATTACHMENT0,X,0);u(g)&&E(X),t.unbindTexture()}T.depthBuffer&&et(T)}function mt(T){const g=T.textures;for(let N=0,H=g.length;N<H;N++){const W=g[N];if(u(W)){const ne=w(T),re=n.get(W).__webglTexture;t.bindTexture(ne,re),E(ne),t.unbindTexture()}}}const vt=[],St=[];function Tt(T){if(T.samples>0){if(gt(T)===!1){const g=T.textures,N=T.width,H=T.height;let W=i.COLOR_BUFFER_BIT;const ne=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=n.get(T),X=g.length>1;if(X)for(let ae=0;ae<g.length;ae++)t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer);const K=T.texture.mipmaps;K&&K.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let ae=0;ae<g.length;ae++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(W|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(W|=i.STENCIL_BUFFER_BIT)),X){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,re.__webglColorRenderbuffer[ae]);const be=n.get(g[ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,be,0)}i.blitFramebuffer(0,0,N,H,0,0,N,H,W,i.NEAREST),l===!0&&(vt.length=0,St.length=0,vt.push(i.COLOR_ATTACHMENT0+ae),T.depthBuffer&&T.resolveDepthBuffer===!1&&(vt.push(ne),St.push(ne),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,St)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,vt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),X)for(let ae=0;ae<g.length;ae++){t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,re.__webglColorRenderbuffer[ae]);const be=n.get(g[ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const g=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function lt(T){return Math.min(s.maxSamples,T.samples)}function gt(T){const g=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function I(T){const g=a.render.frame;h.get(T)!==g&&(h.set(T,g),T.update())}function Ft(T,g){const N=T.colorSpace,H=T.format,W=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||N!==Xs&&N!==Gn&&(Be.getTransfer(N)===Qe?(H!==nn||W!==Wt)&&Ce("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Xe("WebGLTextures: Unsupported texture color space:",N)),g}function Ze(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=V,this.getTextureUnits=Y,this.setTextureUnits=F,this.setTexture2D=Q,this.setTexture2DArray=ee,this.setTexture3D=de,this.setTextureCube=me,this.rebindTextures=Ke,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=Tt,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=we,this.useMultisampledRTT=gt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function b0(i,e){function t(n,s=Gn){let r;const a=Be.getTransfer(s);if(n===Wt)return i.UNSIGNED_BYTE;if(n===Xa)return i.UNSIGNED_SHORT_4_4_4_4;if(n===qa)return i.UNSIGNED_SHORT_5_5_5_1;if(n===jl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ec)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Jl)return i.BYTE;if(n===Ql)return i.SHORT;if(n===ns)return i.UNSIGNED_SHORT;if(n===Wa)return i.INT;if(n===gn)return i.UNSIGNED_INT;if(n===dn)return i.FLOAT;if(n===Pn)return i.HALF_FLOAT;if(n===tc)return i.ALPHA;if(n===nc)return i.RGB;if(n===nn)return i.RGBA;if(n===Ln)return i.DEPTH_COMPONENT;if(n===ai)return i.DEPTH_STENCIL;if(n===ic)return i.RED;if(n===Ya)return i.RED_INTEGER;if(n===ci)return i.RG;if(n===$a)return i.RG_INTEGER;if(n===Ka)return i.RGBA_INTEGER;if(n===Ns||n===Fs||n===Os||n===ks)if(a===Qe)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ns)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Fs)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Os)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ks)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ns)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Fs)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Os)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ks)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ra||n===aa||n===oa||n===la)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ra)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===aa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===oa)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===la)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ca||n===ha||n===da||n===fa||n===ua||n===Vs||n===pa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ca||n===ha)return a===Qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===da)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===fa)return r.COMPRESSED_R11_EAC;if(n===ua)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Vs)return r.COMPRESSED_RG11_EAC;if(n===pa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===ma||n===ga||n===_a||n===xa||n===va||n===Ma||n===ya||n===Sa||n===ba||n===Ea||n===Ta||n===Aa||n===wa||n===Ra)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ma)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ga)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_a)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===xa)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===va)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ma)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ya)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Sa)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ba)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ea)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ta)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ra)return a===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ca||n===Pa||n===La)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ca)return a===Qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Pa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===La)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ia||n===Da||n===Ws||n===Ua)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Ia)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Da)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ws)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ua)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===is?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const E0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,T0=`
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

}`;class A0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new fc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new _n({vertexShader:E0,fragmentShader:T0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Bt(new Qs(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class w0 extends hi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,m=null,_=null;const M=typeof XRWebGLBinding<"u",p=new A0,u={},E=t.getContextAttributes();let w=null,y=null;const A=[],S=[],R=new ze;let x=null;const b=new jt;b.viewport=new at;const C=new jt;C.viewport=new at;const P=[b,C],U=new Fd;let V=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let se=A[Z];return se===void 0&&(se=new vr,A[Z]=se),se.getTargetRaySpace()},this.getControllerGrip=function(Z){let se=A[Z];return se===void 0&&(se=new vr,A[Z]=se),se.getGripSpace()},this.getHand=function(Z){let se=A[Z];return se===void 0&&(se=new vr,A[Z]=se),se.getHandSpace()};function F(Z){const se=S.indexOf(Z.inputSource);if(se===-1)return;const te=A[se];te!==void 0&&(te.update(Z.inputSource,Z.frame,c||a),te.dispatchEvent({type:Z.type,data:Z.inputSource}))}function q(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",z);for(let Z=0;Z<A.length;Z++){const se=S[Z];se!==null&&(S[Z]=null,A[Z].disconnect(se))}V=null,Y=null,p.reset();for(const Z in u)delete u[Z];e.setRenderTarget(w),m=null,d=null,f=null,s=null,y=null,$e.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Ce("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Ce("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",q),s.addEventListener("inputsourceschange",z),E.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Pe=null,De=null;E.depth&&(De=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=E.stencil?ai:Ln,Pe=E.stencil?is:gn);const we={colorFormat:t.RGBA8,depthFormat:De,scaleFactor:r};f=this.getBinding(),d=f.createProjectionLayer(we),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new pn(d.textureWidth,d.textureHeight,{format:nn,type:Wt,depthTexture:new Oi(d.textureWidth,d.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const te={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new pn(m.framebufferWidth,m.framebufferHeight,{format:nn,type:Wt,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),$e.setContext(s),$e.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function z(Z){for(let se=0;se<Z.removed.length;se++){const te=Z.removed[se],Pe=S.indexOf(te);Pe>=0&&(S[Pe]=null,A[Pe].disconnect(te))}for(let se=0;se<Z.added.length;se++){const te=Z.added[se];let Pe=S.indexOf(te);if(Pe===-1){for(let we=0;we<A.length;we++)if(we>=S.length){S.push(te),Pe=we;break}else if(S[we]===null){S[we]=te,Pe=we;break}if(Pe===-1)break}const De=A[Pe];De&&De.connect(te)}}const Q=new O,ee=new O;function de(Z,se,te){Q.setFromMatrixPosition(se.matrixWorld),ee.setFromMatrixPosition(te.matrixWorld);const Pe=Q.distanceTo(ee),De=se.projectionMatrix.elements,we=te.projectionMatrix.elements,ft=De[14]/(De[10]-1),ke=De[14]/(De[10]+1),et=(De[9]+1)/De[5],Ke=(De[9]-1)/De[5],Ve=(De[8]-1)/De[0],mt=(we[8]+1)/we[0],vt=ft*Ve,St=ft*mt,Tt=Pe/(-Ve+mt),lt=Tt*-Ve;if(se.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(lt),Z.translateZ(Tt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),De[10]===-1)Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const gt=ft+Tt,I=ke+Tt,Ft=vt-lt,Ze=St+(Pe-lt),T=et*ke/I*gt,g=Ke*ke/I*gt;Z.projectionMatrix.makePerspective(Ft,Ze,T,g,gt,I),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function me(Z,se){se===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(se.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let se=Z.near,te=Z.far;p.texture!==null&&(p.depthNear>0&&(se=p.depthNear),p.depthFar>0&&(te=p.depthFar)),U.near=C.near=b.near=se,U.far=C.far=b.far=te,(V!==U.near||Y!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),V=U.near,Y=U.far),U.layers.mask=Z.layers.mask|6,b.layers.mask=U.layers.mask&-5,C.layers.mask=U.layers.mask&-3;const Pe=Z.parent,De=U.cameras;me(U,Pe);for(let we=0;we<De.length;we++)me(De[we],Pe);De.length===2?de(U,b,C):U.projectionMatrix.copy(b.projectionMatrix),ve(Z,U,Pe)};function ve(Z,se,te){te===null?Z.matrix.copy(se.matrixWorld):(Z.matrix.copy(te.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(se.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(se.projectionMatrix),Z.projectionMatrixInverse.copy(se.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Fa*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(U)},this.getCameraTexture=function(Z){return u[Z]};let Ye=null;function ot(Z,se){if(h=se.getViewerPose(c||a),_=se,h!==null){const te=h.views;m!==null&&(e.setRenderTargetFramebuffer(y,m.framebuffer),e.setRenderTarget(y));let Pe=!1;te.length!==U.cameras.length&&(U.cameras.length=0,Pe=!0);for(let ke=0;ke<te.length;ke++){const et=te[ke];let Ke=null;if(m!==null)Ke=m.getViewport(et);else{const mt=f.getViewSubImage(d,et);Ke=mt.viewport,ke===0&&(e.setRenderTargetTextures(y,mt.colorTexture,mt.depthStencilTexture),e.setRenderTarget(y))}let Ve=P[ke];Ve===void 0&&(Ve=new jt,Ve.layers.enable(ke),Ve.viewport=new at,P[ke]=Ve),Ve.matrix.fromArray(et.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(et.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(Ke.x,Ke.y,Ke.width,Ke.height),ke===0&&(U.matrix.copy(Ve.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Pe===!0&&U.cameras.push(Ve)}const De=s.enabledFeatures;if(De&&De.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=n.getBinding();const ke=f.getDepthInformation(te[0]);ke&&ke.isValid&&ke.texture&&p.init(ke,s.renderState)}if(De&&De.includes("camera-access")&&M){e.state.unbindTexture(),f=n.getBinding();for(let ke=0;ke<te.length;ke++){const et=te[ke].camera;if(et){let Ke=u[et];Ke||(Ke=new fc,u[et]=Ke);const Ve=f.getCameraImage(et);Ke.sourceTexture=Ve}}}}for(let te=0;te<A.length;te++){const Pe=S[te],De=A[te];Pe!==null&&De!==void 0&&De.update(Pe,se,c||a)}Ye&&Ye(Z,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),_=null}const $e=new gc;$e.setAnimationLoop(ot),this.setAnimationLoop=function(Z){Ye=Z},this.dispose=function(){}}}const R0=new dt,bc=new Ie;bc.set(-1,0,0,0,1,0,0,0,1);function C0(i,e){function t(p,u){p.matrixAutoUpdate===!0&&p.updateMatrix(),u.value.copy(p.matrix)}function n(p,u){u.color.getRGB(p.fogColor.value,uc(i)),u.isFog?(p.fogNear.value=u.near,p.fogFar.value=u.far):u.isFogExp2&&(p.fogDensity.value=u.density)}function s(p,u,E,w,y){u.isNodeMaterial?u.uniformsNeedUpdate=!1:u.isMeshBasicMaterial?r(p,u):u.isMeshLambertMaterial?(r(p,u),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)):u.isMeshToonMaterial?(r(p,u),f(p,u)):u.isMeshPhongMaterial?(r(p,u),h(p,u),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)):u.isMeshStandardMaterial?(r(p,u),d(p,u),u.isMeshPhysicalMaterial&&m(p,u,y)):u.isMeshMatcapMaterial?(r(p,u),_(p,u)):u.isMeshDepthMaterial?r(p,u):u.isMeshDistanceMaterial?(r(p,u),M(p,u)):u.isMeshNormalMaterial?r(p,u):u.isLineBasicMaterial?(a(p,u),u.isLineDashedMaterial&&o(p,u)):u.isPointsMaterial?l(p,u,E,w):u.isSpriteMaterial?c(p,u):u.isShadowMaterial?(p.color.value.copy(u.color),p.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function r(p,u){p.opacity.value=u.opacity,u.color&&p.diffuse.value.copy(u.color),u.emissive&&p.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.bumpMap&&(p.bumpMap.value=u.bumpMap,t(u.bumpMap,p.bumpMapTransform),p.bumpScale.value=u.bumpScale,u.side===kt&&(p.bumpScale.value*=-1)),u.normalMap&&(p.normalMap.value=u.normalMap,t(u.normalMap,p.normalMapTransform),p.normalScale.value.copy(u.normalScale),u.side===kt&&p.normalScale.value.negate()),u.displacementMap&&(p.displacementMap.value=u.displacementMap,t(u.displacementMap,p.displacementMapTransform),p.displacementScale.value=u.displacementScale,p.displacementBias.value=u.displacementBias),u.emissiveMap&&(p.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,p.emissiveMapTransform)),u.specularMap&&(p.specularMap.value=u.specularMap,t(u.specularMap,p.specularMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest);const E=e.get(u),w=E.envMap,y=E.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(R0.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(bc),p.reflectivity.value=u.reflectivity,p.ior.value=u.ior,p.refractionRatio.value=u.refractionRatio),u.lightMap&&(p.lightMap.value=u.lightMap,p.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,p.lightMapTransform)),u.aoMap&&(p.aoMap.value=u.aoMap,p.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,p.aoMapTransform))}function a(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform))}function o(p,u){p.dashSize.value=u.dashSize,p.totalSize.value=u.dashSize+u.gapSize,p.scale.value=u.scale}function l(p,u,E,w){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.size.value=u.size*E,p.scale.value=w*.5,u.map&&(p.map.value=u.map,t(u.map,p.uvTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function c(p,u){p.diffuse.value.copy(u.color),p.opacity.value=u.opacity,p.rotation.value=u.rotation,u.map&&(p.map.value=u.map,t(u.map,p.mapTransform)),u.alphaMap&&(p.alphaMap.value=u.alphaMap,t(u.alphaMap,p.alphaMapTransform)),u.alphaTest>0&&(p.alphaTest.value=u.alphaTest)}function h(p,u){p.specular.value.copy(u.specular),p.shininess.value=Math.max(u.shininess,1e-4)}function f(p,u){u.gradientMap&&(p.gradientMap.value=u.gradientMap)}function d(p,u){p.metalness.value=u.metalness,u.metalnessMap&&(p.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,p.metalnessMapTransform)),p.roughness.value=u.roughness,u.roughnessMap&&(p.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,p.roughnessMapTransform)),u.envMap&&(p.envMapIntensity.value=u.envMapIntensity)}function m(p,u,E){p.ior.value=u.ior,u.sheen>0&&(p.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),p.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(p.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,p.sheenColorMapTransform)),u.sheenRoughnessMap&&(p.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,p.sheenRoughnessMapTransform))),u.clearcoat>0&&(p.clearcoat.value=u.clearcoat,p.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(p.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,p.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(p.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===kt&&p.clearcoatNormalScale.value.negate())),u.dispersion>0&&(p.dispersion.value=u.dispersion),u.iridescence>0&&(p.iridescence.value=u.iridescence,p.iridescenceIOR.value=u.iridescenceIOR,p.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(p.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,p.iridescenceMapTransform)),u.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),u.transmission>0&&(p.transmission.value=u.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),u.transmissionMap&&(p.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,p.transmissionMapTransform)),p.thickness.value=u.thickness,u.thicknessMap&&(p.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=u.attenuationDistance,p.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(p.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(p.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=u.specularIntensity,p.specularColor.value.copy(u.specularColor),u.specularColorMap&&(p.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,p.specularColorMapTransform)),u.specularIntensityMap&&(p.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,u){u.matcap&&(p.matcap.value=u.matcap)}function M(p,u){const E=e.get(u).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function P0(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){const S=A.program;n.uniformBlockBinding(y,S)}function c(y,A){let S=s[y.id];S===void 0&&(p(y),S=h(y),s[y.id]=S,y.addEventListener("dispose",E));const R=A.program;n.updateUBOMapping(y,R);const x=e.render.frame;r[y.id]!==x&&(d(y),r[y.id]=x)}function h(y){const A=f();y.__bindingPointIndex=A;const S=i.createBuffer(),R=y.__size,x=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,R,x),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,A,S),S}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Xe("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const A=s[y.id],S=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,A);for(let x=0,b=S.length;x<b;x++){const C=S[x];if(Array.isArray(C))for(let P=0,U=C.length;P<U;P++)m(C[P],x,P,R);else m(C,x,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(y,A,S,R){if(M(y,A,S,R)===!0){const x=y.__offset,b=y.value;if(Array.isArray(b)){let C=0;for(let P=0;P<b.length;P++){const U=b[P],V=u(U);_(U,y.__data,C),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(C+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(b,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,x,y.__data)}}function _(y,A,S){typeof y=="number"||typeof y=="boolean"?A[0]=y:y.isMatrix3?(A[0]=y.elements[0],A[1]=y.elements[1],A[2]=y.elements[2],A[3]=0,A[4]=y.elements[3],A[5]=y.elements[4],A[6]=y.elements[5],A[7]=0,A[8]=y.elements[6],A[9]=y.elements[7],A[10]=y.elements[8],A[11]=0):ArrayBuffer.isView(y)?A.set(new y.constructor(y.buffer,y.byteOffset,A.length)):y.toArray(A,S)}function M(y,A,S,R){const x=y.value,b=A+"_"+S;if(R[b]===void 0)return typeof x=="number"||typeof x=="boolean"?R[b]=x:ArrayBuffer.isView(x)?R[b]=x.slice():R[b]=x.clone(),!0;{const C=R[b];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return R[b]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function p(y){const A=y.uniforms;let S=0;const R=16;for(let b=0,C=A.length;b<C;b++){const P=Array.isArray(A[b])?A[b]:[A[b]];for(let U=0,V=P.length;U<V;U++){const Y=P[U],F=Array.isArray(Y.value)?Y.value:[Y.value];for(let q=0,z=F.length;q<z;q++){const Q=F[q],ee=u(Q),de=S%R,me=de%ee.boundary,ve=de+me;S+=me,ve!==0&&R-ve<ee.storage&&(S+=R-ve),Y.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=S,S+=ee.storage}}}const x=S%R;return x>0&&(S+=R-x),y.__size=S,y.__cache={},this}function u(y){const A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Ce("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Ce("WebGLRenderer: Unsupported uniform value type.",y),A}function E(y){const A=y.target;A.removeEventListener("dispose",E);const S=a.indexOf(A.__bindingPointIndex);a.splice(S,1),i.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function w(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:w}}const L0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ln=null;function I0(){return ln===null&&(ln=new vd(L0,16,16,ci,Pn),ln.name="DFG_LUT",ln.minFilter=It,ln.magFilter=It,ln.wrapS=Tn,ln.wrapT=Tn,ln.generateMipmaps=!1,ln.needsUpdate=!0),ln}class D0{constructor(e={}){const{canvas:t=Kh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:m=Wt}=e;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;const M=m,p=new Set([Ka,$a,Ya]),u=new Set([Wt,gn,ns,is,Xa,qa]),E=new Uint32Array(4),w=new Int32Array(4),y=new O;let A=null,S=null;const R=[],x=[];let b=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=un,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,U=null,V=null,Y=null,F=null;this._outputColorSpace=Vt;let q=0,z=0,Q=null,ee=-1,de=null;const me=new at,ve=new at;let Ye=null;const ot=new Ge(0);let $e=0,Z=t.width,se=t.height,te=1,Pe=null,De=null;const we=new at(0,0,Z,se),ft=new at(0,0,Z,se);let ke=!1;const et=new eo;let Ke=!1,Ve=!1;const mt=new dt,vt=new O,St=new at,Tt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let lt=!1;function gt(){return Q===null?te:1}let I=n;function Ft(v,D){return t.getContext(v,D)}try{const v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Va}`),t.addEventListener("webglcontextlost",ct,!1),t.addEventListener("webglcontextrestored",it,!1),t.addEventListener("webglcontextcreationerror",sn,!1),I===null){const D="webgl2";if(I=Ft(D,v),I===null)throw Ft(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(v){throw Xe("WebGLRenderer: "+v.message),v}let Ze,T,g,N,H,W,ne,re,X,K,ae,be,ce,oe,Ae,Re,Ue,L,ie,$,le,pe,j;function Se(){Ze=new Ip(I),Ze.init(),le=new b0(I,Ze),T=new Ep(I,Ze,e,le),g=new y0(I,Ze),T.reversedDepthBuffer&&d&&g.buffers.depth.setReversed(!0),V=I.createFramebuffer(),Y=I.createFramebuffer(),F=I.createFramebuffer(),N=new Np(I),H=new o0,W=new S0(I,Ze,g,H,T,le,N),ne=new Lp(C),re=new kd(I),pe=new Sp(I,re),X=new Dp(I,re,N,pe),K=new Op(I,X,re,pe,N),L=new Fp(I,T,W),Ae=new Tp(H),ae=new a0(C,ne,Ze,T,pe,Ae),be=new C0(C,H),ce=new c0,oe=new m0(Ze),Ue=new yp(C,ne,g,K,_,l),Re=new M0(C,K,T),j=new P0(I,N,T,g),ie=new bp(I,Ze,N),$=new Up(I,Ze,N),N.programs=ae.programs,C.capabilities=T,C.extensions=Ze,C.properties=H,C.renderLists=ce,C.shadowMap=Re,C.state=g,C.info=N}Se(),M!==Wt&&(b=new Bp(M,t.width,t.height,o,s,r));const Me=new w0(C,I);this.xr=Me,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const v=Ze.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ze.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(v){v!==void 0&&(te=v,this.setSize(Z,se,!1))},this.getSize=function(v){return v.set(Z,se)},this.setSize=function(v,D,G=!0){if(Me.isPresenting){Ce("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=v,se=D,t.width=Math.floor(v*te),t.height=Math.floor(D*te),G===!0&&(t.style.width=v+"px",t.style.height=D+"px"),b!==null&&b.setSize(t.width,t.height),this.setViewport(0,0,v,D)},this.getDrawingBufferSize=function(v){return v.set(Z*te,se*te).floor()},this.setDrawingBufferSize=function(v,D,G){Z=v,se=D,te=G,t.width=Math.floor(v*G),t.height=Math.floor(D*G),this.setViewport(0,0,v,D)},this.setEffects=function(v){if(M===Wt){Xe("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let D=0;D<v.length;D++)if(v[D].isOutputPass===!0){Ce("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(me)},this.getViewport=function(v){return v.copy(we)},this.setViewport=function(v,D,G,k){v.isVector4?we.set(v.x,v.y,v.z,v.w):we.set(v,D,G,k),g.viewport(me.copy(we).multiplyScalar(te).round())},this.getScissor=function(v){return v.copy(ft)},this.setScissor=function(v,D,G,k){v.isVector4?ft.set(v.x,v.y,v.z,v.w):ft.set(v,D,G,k),g.scissor(ve.copy(ft).multiplyScalar(te).round())},this.getScissorTest=function(){return ke},this.setScissorTest=function(v){g.setScissorTest(ke=v)},this.setOpaqueSort=function(v){Pe=v},this.setTransparentSort=function(v){De=v},this.getClearColor=function(v){return v.copy(Ue.getClearColor())},this.setClearColor=function(){Ue.setClearColor(...arguments)},this.getClearAlpha=function(){return Ue.getClearAlpha()},this.setClearAlpha=function(){Ue.setClearAlpha(...arguments)},this.clear=function(v=!0,D=!0,G=!0){let k=0;if(v){let B=!1;if(Q!==null){const ue=Q.texture.format;B=p.has(ue)}if(B){const ue=Q.texture.type,_e=u.has(ue),fe=Ue.getClearColor(),ye=Ue.getClearAlpha(),Ee=fe.r,Ne=fe.g,Oe=fe.b;_e?(E[0]=Ee,E[1]=Ne,E[2]=Oe,E[3]=ye,I.clearBufferuiv(I.COLOR,0,E)):(w[0]=Ee,w[1]=Ne,w[2]=Oe,w[3]=ye,I.clearBufferiv(I.COLOR,0,w))}else k|=I.COLOR_BUFFER_BIT}D&&(k|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(k|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&I.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),U=v},this.dispose=function(){t.removeEventListener("webglcontextlost",ct,!1),t.removeEventListener("webglcontextrestored",it,!1),t.removeEventListener("webglcontextcreationerror",sn,!1),Ue.dispose(),ce.dispose(),oe.dispose(),H.dispose(),ne.dispose(),K.dispose(),pe.dispose(),j.dispose(),ae.dispose(),Me.dispose(),Me.removeEventListener("sessionstart",ho),Me.removeEventListener("sessionend",fo),$n.stop()};function ct(v){v.preventDefault(),No("WebGLRenderer: Context Lost."),P=!0}function it(){No("WebGLRenderer: Context Restored."),P=!1;const v=N.autoReset,D=Re.enabled,G=Re.autoUpdate,k=Re.needsUpdate,B=Re.type;Se(),N.autoReset=v,Re.enabled=D,Re.autoUpdate=G,Re.needsUpdate=k,Re.type=B}function sn(v){Xe("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function rn(v){const D=v.target;D.removeEventListener("dispose",rn),Uc(D)}function Uc(v){Nc(v),H.remove(v)}function Nc(v){const D=H.get(v).programs;D!==void 0&&(D.forEach(function(G){ae.releaseProgram(G)}),v.isShaderMaterial&&ae.releaseShaderCache(v))}this.renderBufferDirect=function(v,D,G,k,B,ue){D===null&&(D=Tt);const _e=B.isMesh&&B.matrixWorld.determinantAffine()<0,fe=kc(v,D,G,k,B);g.setMaterial(k,_e);let ye=G.index,Ee=1;if(k.wireframe===!0){if(ye=X.getWireframeAttribute(G),ye===void 0)return;Ee=2}const Ne=G.drawRange,Oe=G.attributes.position;let Te=Ne.start*Ee,je=(Ne.start+Ne.count)*Ee;ue!==null&&(Te=Math.max(Te,ue.start*Ee),je=Math.min(je,(ue.start+ue.count)*Ee)),ye!==null?(Te=Math.max(Te,0),je=Math.min(je,ye.count)):Oe!=null&&(Te=Math.max(Te,0),je=Math.min(je,Oe.count));const ut=je-Te;if(ut<0||ut===1/0)return;pe.setup(B,k,fe,G,ye);let ht,tt=ie;if(ye!==null&&(ht=re.get(ye),tt=$,tt.setIndex(ht)),B.isMesh)k.wireframe===!0?(g.setLineWidth(k.wireframeLinewidth*gt()),tt.setMode(I.LINES)):tt.setMode(I.TRIANGLES);else if(B.isLine){let Ct=k.linewidth;Ct===void 0&&(Ct=1),g.setLineWidth(Ct*gt()),B.isLineSegments?tt.setMode(I.LINES):B.isLineLoop?tt.setMode(I.LINE_LOOP):tt.setMode(I.LINE_STRIP)}else B.isPoints?tt.setMode(I.POINTS):B.isSprite&&tt.setMode(I.TRIANGLES);if(B.isBatchedMesh)if(Ze.get("WEBGL_multi_draw"))tt.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ct=B._multiDrawStarts,ge=B._multiDrawCounts,Ht=B._multiDrawCount,We=ye?re.get(ye).bytesPerElement:1,Xt=H.get(k).currentProgram.getUniforms();for(let an=0;an<Ht;an++)Xt.setValue(I,"_gl_DrawID",an),tt.render(Ct[an]/We,ge[an])}else if(B.isInstancedMesh)tt.renderInstances(Te,ut,B.count);else if(G.isInstancedBufferGeometry){const Ct=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ge=Math.min(G.instanceCount,Ct);tt.renderInstances(Te,ut,ge)}else tt.render(Te,ut)};function co(v,D,G){v.transparent===!0&&v.side===En&&v.forceSinglePass===!1?(v.side=kt,v.needsUpdate=!0,hs(v,D,G),v.side=qn,v.needsUpdate=!0,hs(v,D,G),v.side=En):hs(v,D,G)}this.compile=function(v,D,G=null){G===null&&(G=v),S=oe.get(G),S.init(D),x.push(S),G.traverseVisible(function(B){B.isLight&&B.layers.test(D.layers)&&(S.pushLight(B),B.castShadow&&S.pushShadow(B))}),v!==G&&v.traverseVisible(function(B){B.isLight&&B.layers.test(D.layers)&&(S.pushLight(B),B.castShadow&&S.pushShadow(B))}),S.setupLights();const k=new Set;return v.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const ue=B.material;if(ue)if(Array.isArray(ue))for(let _e=0;_e<ue.length;_e++){const fe=ue[_e];co(fe,G,B),k.add(fe)}else co(ue,G,B),k.add(ue)}),S=x.pop(),k},this.compileAsync=function(v,D,G=null){const k=this.compile(v,D,G);return new Promise(B=>{function ue(){if(k.forEach(function(_e){H.get(_e).currentProgram.isReady()&&k.delete(_e)}),k.size===0){B(v);return}setTimeout(ue,10)}Ze.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let nr=null;function Fc(v){nr&&nr(v)}function ho(){$n.stop()}function fo(){$n.start()}const $n=new gc;$n.setAnimationLoop(Fc),typeof self<"u"&&$n.setContext(self),this.setAnimationLoop=function(v){nr=v,Me.setAnimationLoop(v),v===null?$n.stop():$n.start()},Me.addEventListener("sessionstart",ho),Me.addEventListener("sessionend",fo),this.render=function(v,D){if(D!==void 0&&D.isCamera!==!0){Xe("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;U!==null&&U.renderStart(v,D);const G=Me.enabled===!0&&Me.isPresenting===!0,k=b!==null&&(Q===null||G)&&b.begin(C,Q);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Me.enabled===!0&&Me.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(Me.cameraAutoUpdate===!0&&Me.updateCamera(D),D=Me.getCamera()),v.isScene===!0&&v.onBeforeRender(C,v,D,Q),S=oe.get(v,x.length),S.init(D),S.state.textureUnits=W.getTextureUnits(),x.push(S),mt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),et.setFromProjectionMatrix(mt,fn,D.reversedDepth),Ve=this.localClippingEnabled,Ke=Ae.init(this.clippingPlanes,Ve),A=ce.get(v,R.length),A.init(),R.push(A),Me.enabled===!0&&Me.isPresenting===!0){const _e=C.xr.getDepthSensingMesh();_e!==null&&ir(_e,D,-1/0,C.sortObjects)}ir(v,D,0,C.sortObjects),A.finish(),C.sortObjects===!0&&A.sort(Pe,De,D.reversedDepth),lt=Me.enabled===!1||Me.isPresenting===!1||Me.hasDepthSensing()===!1,lt&&Ue.addToRenderList(A,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ke===!0&&Ae.beginShadows();const B=S.state.shadowsArray;if(Re.render(B,v,D),Ke===!0&&Ae.endShadows(),(k&&b.hasRenderPass())===!1){const _e=A.opaque,fe=A.transmissive;if(S.setupLights(),D.isArrayCamera){const ye=D.cameras;if(fe.length>0)for(let Ee=0,Ne=ye.length;Ee<Ne;Ee++){const Oe=ye[Ee];po(_e,fe,v,Oe)}lt&&Ue.render(v);for(let Ee=0,Ne=ye.length;Ee<Ne;Ee++){const Oe=ye[Ee];uo(A,v,Oe,Oe.viewport)}}else fe.length>0&&po(_e,fe,v,D),lt&&Ue.render(v),uo(A,v,D)}Q!==null&&z===0&&(W.updateMultisampleRenderTarget(Q),W.updateRenderTargetMipmap(Q)),k&&b.end(C),v.isScene===!0&&v.onAfterRender(C,v,D),pe.resetDefaultState(),ee=-1,de=null,x.pop(),x.length>0?(S=x[x.length-1],W.setTextureUnits(S.state.textureUnits),Ke===!0&&Ae.setGlobalState(C.clippingPlanes,S.state.camera)):S=null,R.pop(),R.length>0?A=R[R.length-1]:A=null,U!==null&&U.renderEnd()};function ir(v,D,G,k){if(v.visible===!1)return;if(v.layers.test(D.layers)){if(v.isGroup)G=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(D);else if(v.isLightProbeGrid)S.pushLightProbeGrid(v);else if(v.isLight)S.pushLight(v),v.castShadow&&S.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||et.intersectsSprite(v)){k&&St.setFromMatrixPosition(v.matrixWorld).applyMatrix4(mt);const _e=K.update(v),fe=v.material;fe.visible&&A.push(v,_e,fe,G,St.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||et.intersectsObject(v))){const _e=K.update(v),fe=v.material;if(k&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),St.copy(v.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),St.copy(_e.boundingSphere.center)),St.applyMatrix4(v.matrixWorld).applyMatrix4(mt)),Array.isArray(fe)){const ye=_e.groups;for(let Ee=0,Ne=ye.length;Ee<Ne;Ee++){const Oe=ye[Ee],Te=fe[Oe.materialIndex];Te&&Te.visible&&A.push(v,_e,Te,G,St.z,Oe)}}else fe.visible&&A.push(v,_e,fe,G,St.z,null)}}const ue=v.children;for(let _e=0,fe=ue.length;_e<fe;_e++)ir(ue[_e],D,G,k)}function uo(v,D,G,k){const{opaque:B,transmissive:ue,transparent:_e}=v;S.setupLightsView(G),Ke===!0&&Ae.setGlobalState(C.clippingPlanes,G),k&&g.viewport(me.copy(k)),B.length>0&&cs(B,D,G),ue.length>0&&cs(ue,D,G),_e.length>0&&cs(_e,D,G),g.buffers.depth.setTest(!0),g.buffers.depth.setMask(!0),g.buffers.color.setMask(!0),g.setPolygonOffset(!1)}function po(v,D,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[k.id]===void 0){const Te=Ze.has("EXT_color_buffer_half_float")||Ze.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[k.id]=new pn(1,1,{generateMipmaps:!0,type:Te?Pn:Wt,minFilter:ri,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Be.workingColorSpace})}const ue=S.state.transmissionRenderTarget[k.id],_e=k.viewport||me;ue.setSize(_e.z*C.transmissionResolutionScale,_e.w*C.transmissionResolutionScale);const fe=C.getRenderTarget(),ye=C.getActiveCubeFace(),Ee=C.getActiveMipmapLevel();C.setRenderTarget(ue),C.getClearColor(ot),$e=C.getClearAlpha(),$e<1&&C.setClearColor(16777215,.5),C.clear(),lt&&Ue.render(G);const Ne=C.toneMapping;C.toneMapping=un;const Oe=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),S.setupLightsView(k),Ke===!0&&Ae.setGlobalState(C.clippingPlanes,k),cs(v,G,k),W.updateMultisampleRenderTarget(ue),W.updateRenderTargetMipmap(ue),Ze.has("WEBGL_multisampled_render_to_texture")===!1){let Te=!1;for(let je=0,ut=D.length;je<ut;je++){const ht=D[je],{object:tt,geometry:Ct,material:ge,group:Ht}=ht;if(ge.side===En&&tt.layers.test(k.layers)){const We=ge.side;ge.side=kt,ge.needsUpdate=!0,mo(tt,G,k,Ct,ge,Ht),ge.side=We,ge.needsUpdate=!0,Te=!0}}Te===!0&&(W.updateMultisampleRenderTarget(ue),W.updateRenderTargetMipmap(ue))}C.setRenderTarget(fe,ye,Ee),C.setClearColor(ot,$e),Oe!==void 0&&(k.viewport=Oe),C.toneMapping=Ne}function cs(v,D,G){const k=D.isScene===!0?D.overrideMaterial:null;for(let B=0,ue=v.length;B<ue;B++){const _e=v[B],{object:fe,geometry:ye,group:Ee}=_e;let Ne=_e.material;Ne.allowOverride===!0&&k!==null&&(Ne=k),fe.layers.test(G.layers)&&mo(fe,D,G,ye,Ne,Ee)}}function mo(v,D,G,k,B,ue){v.onBeforeRender(C,D,G,k,B,ue),v.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),B.onBeforeRender(C,D,G,k,v,ue),B.transparent===!0&&B.side===En&&B.forceSinglePass===!1?(B.side=kt,B.needsUpdate=!0,C.renderBufferDirect(G,D,k,B,v,ue),B.side=qn,B.needsUpdate=!0,C.renderBufferDirect(G,D,k,B,v,ue),B.side=En):C.renderBufferDirect(G,D,k,B,v,ue),v.onAfterRender(C,D,G,k,B,ue)}function hs(v,D,G){D.isScene!==!0&&(D=Tt);const k=H.get(v),B=S.state.lights,ue=S.state.shadowsArray,_e=B.state.version,fe=ae.getParameters(v,B.state,ue,D,G,S.state.lightProbeGridArray),ye=ae.getProgramCacheKey(fe);let Ee=k.programs;k.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?D.environment:null,k.fog=D.fog;const Ne=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;k.envMap=ne.get(v.envMap||k.environment,Ne),k.envMapRotation=k.environment!==null&&v.envMap===null?D.environmentRotation:v.envMapRotation,Ee===void 0&&(v.addEventListener("dispose",rn),Ee=new Map,k.programs=Ee);let Oe=Ee.get(ye);if(Oe!==void 0){if(k.currentProgram===Oe&&k.lightsStateVersion===_e)return _o(v,fe),Oe}else fe.uniforms=ae.getUniforms(v),U!==null&&v.isNodeMaterial&&U.build(v,G,fe),v.onBeforeCompile(fe,C),Oe=ae.acquireProgram(fe,ye),Ee.set(ye,Oe),k.uniforms=fe.uniforms;const Te=k.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Te.clippingPlanes=Ae.uniform),_o(v,fe),k.needsLights=Hc(v),k.lightsStateVersion=_e,k.needsLights&&(Te.ambientLightColor.value=B.state.ambient,Te.lightProbe.value=B.state.probe,Te.directionalLights.value=B.state.directional,Te.directionalLightShadows.value=B.state.directionalShadow,Te.spotLights.value=B.state.spot,Te.spotLightShadows.value=B.state.spotShadow,Te.rectAreaLights.value=B.state.rectArea,Te.ltc_1.value=B.state.rectAreaLTC1,Te.ltc_2.value=B.state.rectAreaLTC2,Te.pointLights.value=B.state.point,Te.pointLightShadows.value=B.state.pointShadow,Te.hemisphereLights.value=B.state.hemi,Te.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Te.spotLightMatrix.value=B.state.spotLightMatrix,Te.spotLightMap.value=B.state.spotLightMap,Te.pointShadowMatrix.value=B.state.pointShadowMatrix),k.lightProbeGrid=S.state.lightProbeGridArray.length>0,k.currentProgram=Oe,k.uniformsList=null,Oe}function go(v){if(v.uniformsList===null){const D=v.currentProgram.getUniforms();v.uniformsList=Bs.seqWithValue(D.seq,v.uniforms)}return v.uniformsList}function _o(v,D){const G=H.get(v);G.outputColorSpace=D.outputColorSpace,G.batching=D.batching,G.batchingColor=D.batchingColor,G.instancing=D.instancing,G.instancingColor=D.instancingColor,G.instancingMorph=D.instancingMorph,G.skinning=D.skinning,G.morphTargets=D.morphTargets,G.morphNormals=D.morphNormals,G.morphColors=D.morphColors,G.morphTargetsCount=D.morphTargetsCount,G.numClippingPlanes=D.numClippingPlanes,G.numIntersection=D.numClipIntersection,G.vertexAlphas=D.vertexAlphas,G.vertexTangents=D.vertexTangents,G.toneMapping=D.toneMapping}function Oc(v,D){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;y.setFromMatrixPosition(D.matrixWorld);for(let G=0,k=v.length;G<k;G++){const B=v[G];if(B.texture!==null&&B.boundingBox.containsPoint(y))return B}return null}function kc(v,D,G,k,B){D.isScene!==!0&&(D=Tt),W.resetTextureUnits();const ue=D.fog,_e=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?D.environment:null,fe=Q===null?C.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Be.workingColorSpace,ye=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,Ee=ne.get(k.envMap||_e,ye),Ne=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Oe=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Te=!!G.morphAttributes.position,je=!!G.morphAttributes.normal,ut=!!G.morphAttributes.color;let ht=un;k.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(ht=C.toneMapping);const tt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ct=tt!==void 0?tt.length:0,ge=H.get(k),Ht=S.state.lights;if(Ke===!0&&(Ve===!0||v!==de)){const st=v===de&&k.id===ee;Ae.setState(k,v,st)}let We=!1;k.version===ge.__version?(ge.needsLights&&ge.lightsStateVersion!==Ht.state.version||ge.outputColorSpace!==fe||B.isBatchedMesh&&ge.batching===!1||!B.isBatchedMesh&&ge.batching===!0||B.isBatchedMesh&&ge.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&ge.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&ge.instancing===!1||!B.isInstancedMesh&&ge.instancing===!0||B.isSkinnedMesh&&ge.skinning===!1||!B.isSkinnedMesh&&ge.skinning===!0||B.isInstancedMesh&&ge.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&ge.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&ge.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&ge.instancingMorph===!1&&B.morphTexture!==null||ge.envMap!==Ee||k.fog===!0&&ge.fog!==ue||ge.numClippingPlanes!==void 0&&(ge.numClippingPlanes!==Ae.numPlanes||ge.numIntersection!==Ae.numIntersection)||ge.vertexAlphas!==Ne||ge.vertexTangents!==Oe||ge.morphTargets!==Te||ge.morphNormals!==je||ge.morphColors!==ut||ge.toneMapping!==ht||ge.morphTargetsCount!==Ct||!!ge.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(We=!0):(We=!0,ge.__version=k.version);let Xt=ge.currentProgram;We===!0&&(Xt=hs(k,D,B),U&&k.isNodeMaterial&&U.onUpdateProgram(k,Xt,ge));let an=!1,In=!1,di=!1;const nt=Xt.getUniforms(),pt=ge.uniforms;if(g.useProgram(Xt.program)&&(an=!0,In=!0,di=!0),k.id!==ee&&(ee=k.id,In=!0),ge.needsLights){const st=Oc(S.state.lightProbeGridArray,B);ge.lightProbeGrid!==st&&(ge.lightProbeGrid=st,In=!0)}if(an||de!==v){g.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),nt.setValue(I,"projectionMatrix",v.projectionMatrix),nt.setValue(I,"viewMatrix",v.matrixWorldInverse);const Un=nt.map.cameraPosition;Un!==void 0&&Un.setValue(I,vt.setFromMatrixPosition(v.matrixWorld)),T.logarithmicDepthBuffer&&nt.setValue(I,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&nt.setValue(I,"isOrthographic",v.isOrthographicCamera===!0),de!==v&&(de=v,In=!0,di=!0)}if(ge.needsLights&&(Ht.state.directionalShadowMap.length>0&&nt.setValue(I,"directionalShadowMap",Ht.state.directionalShadowMap,W),Ht.state.spotShadowMap.length>0&&nt.setValue(I,"spotShadowMap",Ht.state.spotShadowMap,W),Ht.state.pointShadowMap.length>0&&nt.setValue(I,"pointShadowMap",Ht.state.pointShadowMap,W)),B.isSkinnedMesh){nt.setOptional(I,B,"bindMatrix"),nt.setOptional(I,B,"bindMatrixInverse");const st=B.skeleton;st&&(st.boneTexture===null&&st.computeBoneTexture(),nt.setValue(I,"boneTexture",st.boneTexture,W))}B.isBatchedMesh&&(nt.setOptional(I,B,"batchingTexture"),nt.setValue(I,"batchingTexture",B._matricesTexture,W),nt.setOptional(I,B,"batchingIdTexture"),nt.setValue(I,"batchingIdTexture",B._indirectTexture,W),nt.setOptional(I,B,"batchingColorTexture"),B._colorsTexture!==null&&nt.setValue(I,"batchingColorTexture",B._colorsTexture,W));const Dn=G.morphAttributes;if((Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)&&L.update(B,G,Xt),(In||ge.receiveShadow!==B.receiveShadow)&&(ge.receiveShadow=B.receiveShadow,nt.setValue(I,"receiveShadow",B.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&D.environment!==null&&(pt.envMapIntensity.value=D.environmentIntensity),pt.dfgLUT!==void 0&&(pt.dfgLUT.value=I0()),In){if(nt.setValue(I,"toneMappingExposure",C.toneMappingExposure),ge.needsLights&&Bc(pt,di),ue&&k.fog===!0&&be.refreshFogUniforms(pt,ue),be.refreshMaterialUniforms(pt,k,te,se,S.state.transmissionRenderTarget[v.id]),ge.needsLights&&ge.lightProbeGrid){const st=ge.lightProbeGrid;pt.probesSH.value=st.texture,pt.probesMin.value.copy(st.boundingBox.min),pt.probesMax.value.copy(st.boundingBox.max),pt.probesResolution.value.copy(st.resolution)}Bs.upload(I,go(ge),pt,W)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Bs.upload(I,go(ge),pt,W),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&nt.setValue(I,"center",B.center),nt.setValue(I,"modelViewMatrix",B.modelViewMatrix),nt.setValue(I,"normalMatrix",B.normalMatrix),nt.setValue(I,"modelMatrix",B.matrixWorld),k.uniformsGroups!==void 0){const st=k.uniformsGroups;for(let Un=0,fi=st.length;Un<fi;Un++){const xo=st[Un];j.update(xo,Xt),j.bind(xo,Xt)}}return Xt}function Bc(v,D){v.ambientLightColor.needsUpdate=D,v.lightProbe.needsUpdate=D,v.directionalLights.needsUpdate=D,v.directionalLightShadows.needsUpdate=D,v.pointLights.needsUpdate=D,v.pointLightShadows.needsUpdate=D,v.spotLights.needsUpdate=D,v.spotLightShadows.needsUpdate=D,v.rectAreaLights.needsUpdate=D,v.hemisphereLights.needsUpdate=D}function Hc(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(v,D,G){const k=H.get(v);k.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),H.get(v.texture).__webglTexture=D,H.get(v.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:G,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,D){const G=H.get(v);G.__webglFramebuffer=D,G.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(v,D=0,G=0){Q=v,q=D,z=G;let k=null,B=!1,ue=!1;if(v){const fe=H.get(v);if(fe.__useDefaultFramebuffer!==void 0){g.bindFramebuffer(I.FRAMEBUFFER,fe.__webglFramebuffer),me.copy(v.viewport),ve.copy(v.scissor),Ye=v.scissorTest,g.viewport(me),g.scissor(ve),g.setScissorTest(Ye),ee=-1;return}else if(fe.__webglFramebuffer===void 0)W.setupRenderTarget(v);else if(fe.__hasExternalTextures)W.rebindTextures(v,H.get(v.texture).__webglTexture,H.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Ne=v.depthTexture;if(fe.__boundDepthTexture!==Ne){if(Ne!==null&&H.has(Ne)&&(v.width!==Ne.image.width||v.height!==Ne.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(v)}}const ye=v.texture;(ye.isData3DTexture||ye.isDataArrayTexture||ye.isCompressedArrayTexture)&&(ue=!0);const Ee=H.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Ee[D])?k=Ee[D][G]:k=Ee[D],B=!0):v.samples>0&&W.useMultisampledRTT(v)===!1?k=H.get(v).__webglMultisampledFramebuffer:Array.isArray(Ee)?k=Ee[G]:k=Ee,me.copy(v.viewport),ve.copy(v.scissor),Ye=v.scissorTest}else me.copy(we).multiplyScalar(te).floor(),ve.copy(ft).multiplyScalar(te).floor(),Ye=ke;if(G!==0&&(k=V),g.bindFramebuffer(I.FRAMEBUFFER,k)&&g.drawBuffers(v,k),g.viewport(me),g.scissor(ve),g.setScissorTest(Ye),B){const fe=H.get(v.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+D,fe.__webglTexture,G)}else if(ue){const fe=D;for(let ye=0;ye<v.textures.length;ye++){const Ee=H.get(v.textures[ye]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+ye,Ee.__webglTexture,G,fe)}}else if(v!==null&&G!==0){const fe=H.get(v.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,fe.__webglTexture,G)}ee=-1},this.readRenderTargetPixels=function(v,D,G,k,B,ue,_e,fe=0){if(!(v&&v.isWebGLRenderTarget)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ye=H.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&_e!==void 0&&(ye=ye[_e]),ye){g.bindFramebuffer(I.FRAMEBUFFER,ye);try{const Ee=v.textures[fe],Ne=Ee.format,Oe=Ee.type;if(v.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+fe),!T.textureFormatReadable(Ne)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!T.textureTypeReadable(Oe)){Xe("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=v.width-k&&G>=0&&G<=v.height-B&&I.readPixels(D,G,k,B,le.convert(Ne),le.convert(Oe),ue)}finally{const Ee=Q!==null?H.get(Q).__webglFramebuffer:null;g.bindFramebuffer(I.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(v,D,G,k,B,ue,_e,fe=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ye=H.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&_e!==void 0&&(ye=ye[_e]),ye)if(D>=0&&D<=v.width-k&&G>=0&&G<=v.height-B){g.bindFramebuffer(I.FRAMEBUFFER,ye);const Ee=v.textures[fe],Ne=Ee.format,Oe=Ee.type;if(v.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+fe),!T.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!T.textureTypeReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Te=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Te),I.bufferData(I.PIXEL_PACK_BUFFER,ue.byteLength,I.STREAM_READ),I.readPixels(D,G,k,B,le.convert(Ne),le.convert(Oe),0);const je=Q!==null?H.get(Q).__webglFramebuffer:null;g.bindFramebuffer(I.FRAMEBUFFER,je);const ut=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Zh(I,ut,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Te),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,ue),I.deleteBuffer(Te),I.deleteSync(ut),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,D=null,G=0){const k=Math.pow(2,-G),B=Math.floor(v.image.width*k),ue=Math.floor(v.image.height*k),_e=D!==null?D.x:0,fe=D!==null?D.y:0;W.setTexture2D(v,0),I.copyTexSubImage2D(I.TEXTURE_2D,G,0,0,_e,fe,B,ue),g.unbindTexture()},this.copyTextureToTexture=function(v,D,G=null,k=null,B=0,ue=0){let _e,fe,ye,Ee,Ne,Oe,Te,je,ut;const ht=v.isCompressedTexture?v.mipmaps[ue]:v.image;if(G!==null)_e=G.max.x-G.min.x,fe=G.max.y-G.min.y,ye=G.isBox3?G.max.z-G.min.z:1,Ee=G.min.x,Ne=G.min.y,Oe=G.isBox3?G.min.z:0;else{const pt=Math.pow(2,-B);_e=Math.floor(ht.width*pt),fe=Math.floor(ht.height*pt),v.isDataArrayTexture?ye=ht.depth:v.isData3DTexture?ye=Math.floor(ht.depth*pt):ye=1,Ee=0,Ne=0,Oe=0}k!==null?(Te=k.x,je=k.y,ut=k.z):(Te=0,je=0,ut=0);const tt=le.convert(D.format),Ct=le.convert(D.type);let ge;D.isData3DTexture?(W.setTexture3D(D,0),ge=I.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(W.setTexture2DArray(D,0),ge=I.TEXTURE_2D_ARRAY):(W.setTexture2D(D,0),ge=I.TEXTURE_2D),g.activeTexture(I.TEXTURE0),g.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,D.flipY),g.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),g.pixelStorei(I.UNPACK_ALIGNMENT,D.unpackAlignment);const Ht=g.getParameter(I.UNPACK_ROW_LENGTH),We=g.getParameter(I.UNPACK_IMAGE_HEIGHT),Xt=g.getParameter(I.UNPACK_SKIP_PIXELS),an=g.getParameter(I.UNPACK_SKIP_ROWS),In=g.getParameter(I.UNPACK_SKIP_IMAGES);g.pixelStorei(I.UNPACK_ROW_LENGTH,ht.width),g.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ht.height),g.pixelStorei(I.UNPACK_SKIP_PIXELS,Ee),g.pixelStorei(I.UNPACK_SKIP_ROWS,Ne),g.pixelStorei(I.UNPACK_SKIP_IMAGES,Oe);const di=v.isDataArrayTexture||v.isData3DTexture,nt=D.isDataArrayTexture||D.isData3DTexture;if(v.isDepthTexture){const pt=H.get(v),Dn=H.get(D),st=H.get(pt.__renderTarget),Un=H.get(Dn.__renderTarget);g.bindFramebuffer(I.READ_FRAMEBUFFER,st.__webglFramebuffer),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,Un.__webglFramebuffer);for(let fi=0;fi<ye;fi++)di&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,H.get(v).__webglTexture,B,Oe+fi),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,H.get(D).__webglTexture,ue,ut+fi)),I.blitFramebuffer(Ee,Ne,_e,fe,Te,je,_e,fe,I.DEPTH_BUFFER_BIT,I.NEAREST);g.bindFramebuffer(I.READ_FRAMEBUFFER,null),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(B!==0||v.isRenderTargetTexture||H.has(v)){const pt=H.get(v),Dn=H.get(D);g.bindFramebuffer(I.READ_FRAMEBUFFER,Y),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,F);for(let st=0;st<ye;st++)di?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,pt.__webglTexture,B,Oe+st):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,pt.__webglTexture,B),nt?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Dn.__webglTexture,ue,ut+st):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Dn.__webglTexture,ue),B!==0?I.blitFramebuffer(Ee,Ne,_e,fe,Te,je,_e,fe,I.COLOR_BUFFER_BIT,I.NEAREST):nt?I.copyTexSubImage3D(ge,ue,Te,je,ut+st,Ee,Ne,_e,fe):I.copyTexSubImage2D(ge,ue,Te,je,Ee,Ne,_e,fe);g.bindFramebuffer(I.READ_FRAMEBUFFER,null),g.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else nt?v.isDataTexture||v.isData3DTexture?I.texSubImage3D(ge,ue,Te,je,ut,_e,fe,ye,tt,Ct,ht.data):D.isCompressedArrayTexture?I.compressedTexSubImage3D(ge,ue,Te,je,ut,_e,fe,ye,tt,ht.data):I.texSubImage3D(ge,ue,Te,je,ut,_e,fe,ye,tt,Ct,ht):v.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,ue,Te,je,_e,fe,tt,Ct,ht.data):v.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,ue,Te,je,ht.width,ht.height,tt,ht.data):I.texSubImage2D(I.TEXTURE_2D,ue,Te,je,_e,fe,tt,Ct,ht);g.pixelStorei(I.UNPACK_ROW_LENGTH,Ht),g.pixelStorei(I.UNPACK_IMAGE_HEIGHT,We),g.pixelStorei(I.UNPACK_SKIP_PIXELS,Xt),g.pixelStorei(I.UNPACK_SKIP_ROWS,an),g.pixelStorei(I.UNPACK_SKIP_IMAGES,In),ue===0&&D.generateMipmaps&&I.generateMipmap(ge),g.unbindTexture()},this.initRenderTarget=function(v){H.get(v).__webglFramebuffer===void 0&&W.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?W.setTextureCube(v,0):v.isData3DTexture?W.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?W.setTexture2DArray(v,0):W.setTexture2D(v,0),g.unbindTexture()},this.resetState=function(){q=0,z=0,Q=null,g.reset(),pe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Be._getDrawingBufferColorSpace(e),t.unpackColorSpace=Be._getUnpackColorSpace()}}const Vr=2.15,Hs=420,zs=520;function Ec(i,e){const t=e==="f";switch(i){case"mara":return{skin:13014134,shadow:10317141,hair:2108488,shirt:2182520,pants:1581622,accent:14728524,metal:12568788,shoe:1514280};case"dana":return{skin:11697242,shadow:9393983,hair:5978408,shirt:2970216,pants:2108218,accent:14268750,metal:12628893,shoe:1645349};case"priya":return{skin:9854784,shadow:7356719,hair:1905424,shirt:15328728,pants:2643038,accent:13192016,metal:14212322,shoe:2105386};case"hale":return{skin:13806212,shadow:10976349,hair:7628371,shirt:4278102,pants:2698552,accent:16762967,metal:12037788,shoe:1579554};case"crosby":return{skin:12358768,shadow:9396557,hair:3155231,shirt:6565176,pants:3283750,accent:15777874,metal:13741397,shoe:1512221};case"beckett":return{skin:11568226,shadow:8868157,hair:4072735,shirt:10105916,pants:3152932,accent:16747590,metal:13154454,shoe:1512731};case"delinquent":return{skin:t?13014648:11832428,shadow:9133388,hair:t?5582445:2103848,shirt:5203020,pants:2698806,accent:12668775,metal:11053750,shoe:1514016};case"magician":return{skin:t?13478026:12226158,shadow:9791055,hair:t?7614880:2626870,shirt:7354535,pants:2497094,accent:15056213,metal:14731384,shoe:1511718};case"wolverine":return{skin:7887430,shadow:5783599,hair:4928808,shirt:7755838,pants:5257772,accent:14711356,metal:13156526,shoe:2103572};case"boxer":return{skin:11171928,shadow:8212541,hair:1774872,shirt:15263980,pants:2434610,accent:14237772,metal:12369608,shoe:1513504};case"gunner":return{skin:t?13147776:11700328,shadow:9134926,hair:t?3548702:2170146,shirt:3229240,pants:2634542,accent:6667384,metal:8689035,shoe:1448986};case"worker":return{skin:12490358,shadow:9200463,hair:3156002,shirt:15772214,pants:3490909,accent:3698345,metal:11449533,shoe:1777705};default:return{skin:13148802,shadow:9859418,hair:2696750,shirt:15789286,pants:2370624,accent:5404848,metal:12235163,shoe:1513763}}}function cn(i,e=.75,t=0){return new Cd({color:i,roughness:e,metalness:t,flatShading:!1})}function Tc(i){return{skin:cn(i.skin,.82),shadow:cn(i.shadow,.88),hair:cn(i.hair,.7),shirt:cn(i.shirt),pants:cn(i.pants,.84),accent:cn(i.accent,.58),metal:cn(i.metal,.28,.45),shoe:cn(i.shoe,.9),white:cn(16250093,.62),dark:cn(1446683,.82)}}function U0(i){return i==="attack"?Hs:i==="cast"?zs:0}function N0(i,e){const t=U0(i.anim);if(t>0){const s=((typeof performance<"u"?performance.now():e)-i.animStart)/t;if(s<1)return{clip:i.anim,t:Math.max(0,s)}}return i.anim==="walk"?{clip:"walk",t:e/280%1}:{clip:"idle",t:e/900%1}}function F0(i,e,t){switch(t){case 0:return{x:i,y:-e};case 1:return{x:e,y:i};case 2:return{x:-i,y:e};case 3:return{x:-e,y:-i}}}function wl(i,e,t){return F0(i,e,t)}function O0(i){return 58*i}function Le(i,e,t,n,s){e.position.set(t,n,s),i.add(e)}function At(i,e,t,n=12,s=4){return new Bt(new to(e,t,s,n),i)}function Ut(i,e,t=16,n=12){return new Bt(new io(e,t,n),i)}function tn(i,e,t,n){return new Bt(new Hi(e,t,n,2,2,2),i)}function Ac(i,e,t){return new Bt(new no(e,t,16,3),i)}function $s(i,e,t,n,s){Le(i,Ut(e.white,.075,10,8),t,n,s),Le(i,Ut(e.dark,.043,8,6),t,n,s+.06)}function k0(i,e,t,n,s){if($s(i,e,-s*.32,.03,s*.89),$s(i,e,s*.32,.03,s*.89),Le(i,Ut(e.shadow,.035,8,6),0,-.075,s*.94),Le(i,tn(e.dark,n==="f"?.13:.16,.025,.02),0,-.16,s*.91),n==="f"&&(Le(i,Ut(e.accent,.035,8,6),-s*.56,-.11,s*.85),Le(i,Ut(e.accent,.035,8,6),s*.56,-.11,s*.85)),t==="hale"){const r=Ut(e.hair,s*.48,12,8);r.scale.set(1,.55,.62),Le(i,r,0,-s*.35,s*.63)}}function B0(i,e,t,n,s){const r=Ut(e.hair,s*1.04,18,10);if(r.scale.set(1.04,.62,1.02),Le(i,r,0,s*.3,-.015),n==="f"||t==="mara"||t==="dana"||t==="priya"){const a=At(e.hair,s*.18,s*.65,10,3);a.rotation.z=Math.PI/2,Le(i,a,0,s*.42,s*.72);const o=At(e.hair,s*.12,s*.5,9,3),l=At(e.hair,s*.12,s*.5,9,3);o.rotation.z=.14,l.rotation.z=-.14,Le(i,o,-s*.83,-s*.05,s*.13),Le(i,l,s*.83,-s*.05,s*.13)}if(t==="crosby"){const a=Ut(e.shirt,s*1.22,18,10);a.scale.set(1.04,.92,1.04),Le(i,a,0,0,-s*.12)}if(t==="magician"&&(Le(i,new Bt(new Js(s*1.25,s*1.25,.08,20),e.accent),0,s*.86,0),Le(i,Ac(e.shirt,s*.65,s),0,s*1.22,0)),t==="worker"){const a=Ut(e.accent,s*1.16,18,10);a.scale.set(1.05,.42,1.05),Le(i,a,0,s*.77,0),Le(i,tn(e.accent,s*1.35,.06,s*.55),0,s*.67,s*.42)}}function H0(i,e,t){if(e==="mara"||e==="delinquent")Le(t,At(i.metal,.055,.58,10,3),0,-.18,.12);else if(e==="gunner"||e==="crosby"||e==="beckett"){const n=At(i.metal,.07,.38,10,3);n.rotation.x=Math.PI/2,Le(t,n,0,.02,.2),Le(t,tn(i.shoe,.12,.12,.34),0,-.03,-.08)}else e==="magician"?(Le(t,At(i.metal,.045,.72,10,3),0,-.16,.08),Le(t,Ut(i.accent,.11,14,10),0,.26,.08)):e==="official"?Le(t,tn(i.white,.25,.32,.04),.04,0,.15):e==="priya"?(Le(t,tn(i.white,.28,.18,.16),0,0,.1),Le(t,tn(i.accent,.05,.2,.17),0,0,.19)):e==="hale"?Le(t,tn(i.accent,.12,.12,.28),0,0,.16):e==="dana"&&Le(t,At(i.metal,.045,.48,10,3),0,-.1,.12)}function wc(i){let e=0;return i.traverse(t=>{if(t.isMesh){const n=t.geometry;e+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}}),Math.round(e)}function z0(i,e){const t=Tc(Ec(i,e)),n=new rt,s=new rt,r=new rt,a=new rt,o=new rt,l=new rt,c=new rt,h=new rt,f=new rt,d=e==="f";n.add(s),s.position.y=.64;for(const[p,u]of[[c,-.16],[h,.16]]){p.position.x=u,Le(p,At(t.pants,.115,d?.31:.34),0,-.16,0),Le(p,At(t.pants,.1,.22),0,-.41,0);const E=At(t.shoe,.12,.16);E.scale.set(1,.55,1.45),Le(p,E,0,-.59,.08),s.add(p)}Le(s,At(t.pants,.27,.12,14,4),0,-.02,0),s.add(r),r.position.y=.03;const m=At(t.shirt,d?.285:.31,.34,14,5);m.scale.z=d?.76:.82,Le(r,m,0,.26,0),(i==="priya"||i==="official")&&Le(r,tn(t.accent,.06,.26,.035),0,.28,.255),i==="worker"&&Le(r,tn(t.accent,.38,.27,.05),0,.25,.25),i==="boxer"&&(Le(r,tn(t.accent,.25,.16,.04),-.22,.19,.24),Le(r,tn(t.accent,.25,.16,.04),.22,.19,.24));for(const[p,u]of[[o,-.39],[l,.39]])p.position.set(u,.43,0),Le(p,At(t.shirt,.105,.2),0,-.11,0),Le(p,At(t.skin,.09,.19),0,-.32,0),Le(p,Ut(t.skin,.1,12,8),0,-.46,0),i==="boxer"&&Le(p,Ut(t.accent,.14,14,10),0,-.49,.02),r.add(p);l.add(f),f.position.set(0,-.44,.13),H0(t,i,f),r.add(a),a.position.y=.76;const _=d?.36:.34;Le(a,Ut(t.skin,_,20,14),0,0,0),k0(a,t,i,e,_),B0(a,t,i,e,_);const M=new rt;return M.add(n),n.position.y=.08,{root:M,hip:s,torso:r,head:a,armL:o,armR:l,legL:c,legR:h,weap:f,tris:wc(M)}}function G0(){const i=Tc(Ec("wolverine","m")),e=new rt,t=new rt,n=new rt,s=new rt,r=new rt,a=new rt,o=new rt,l=new rt,c=new rt;e.add(t),t.position.y=.44;const h=At(i.shirt,.38,.52,16,5);h.rotation.z=Math.PI/2,Le(t,h,0,.18,.02),t.add(n),n.position.set(0,.38,.2),n.add(s),Le(s,Ut(i.skin,.31,18,12),0,.1,.31),Le(s,Ut(i.shadow,.22,14,10),0,.02,.57),$s(s,i,-.1,.16,.58),$s(s,i,.1,.16,.58);for(const d of[-.2,.2])Le(s,Ac(i.hair,.12,.28),d,.38,.25);for(const[d,m,_]of[[o,-.22,.28],[l,.22,.28],[r,-.22,-.28],[a,.22,-.28]])d.position.set(m,0,_),Le(d,At(i.pants,.12,.28),0,-.12,0),t.add(d);const f=At(i.hair,.07,.4,10,3);return f.rotation.x=-.35,Le(t,f,0,.18,-.55),a.add(c),{root:e,hip:t,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:wc(e)}}const Rl=new Map;function Rc(i,e){const t=`${i}:${e}`,n=Rl.get(t);if(n)return n;const s={parts:i==="wolverine"?G0():z0(i,e)};return Rl.set(t,s),s}function V0(i,e,t,n,s){const{hip:r,torso:a,head:o,armL:l,armR:c,legL:h,legR:f,weap:d}=i;for(const _ of[r,a,o,l,c,h,f,d])_.rotation.set(0,0,0);if(r.position.y=e==="wolverine"?.44:.64,a.position.y=e==="wolverine"?.38:.03,t==="idle"){const _=Math.sin(s/420)*.025;a.position.y+=_,o.rotation.z=Math.sin(s/900)*.035,l.rotation.x=.06+_,c.rotation.x=.06-_;return}if(t==="walk"){const _=Math.sin(n*Math.PI*2),M=Math.cos(n*Math.PI*2);h.rotation.x=_*.5,f.rotation.x=-_*.5,l.rotation.x=-_*.38,c.rotation.x=_*.38,a.position.y+=Math.abs(M)*.035,r.position.y+=Math.abs(_)*.018;return}if(t==="attack"){const _=n<.62;e==="wolverine"?(a.rotation.x=_?-.28:0,l.rotation.x=_?-.75:.15,c.rotation.x=_?-.75:.15,r.position.z=_?.14:0):e==="boxer"?(c.rotation.x=n<.35?-.35:_?-1.35:-.25,c.rotation.z=_?-.28:0,a.rotation.y=_?-.22:0,l.rotation.x=-.55):(c.rotation.x=n<.35?-.45:_?-1.35:-.35,c.rotation.z=_?-.32:0,d.rotation.x=_?-.45:0,a.rotation.y=_?-.16:0,l.rotation.x=-.25);return}const m=n<.66;l.rotation.x=m?-2:-1.25,c.rotation.x=m?-2:-1.25,l.rotation.z=.36,c.rotation.z=-.36,o.rotation.x=m?-.12:0,a.position.y+=m?.05:.015}let bn=null,ii=null,oi=null,si=null,Cl=!1;function Cc(){if(Cl&&bn)return!0;if(typeof document>"u")return!1;try{const i=document.createElement("canvas");bn=new D0({canvas:i,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"}),bn.setSize(192,240,!1),bn.setPixelRatio(1),bn.setClearColor(0,0),bn.outputColorSpace=Vt,ii=new fd;const e=192/240;oi=new js(-1.35*e,1.35*e,1.35,-1.35,.1,40),si=new rt,ii.add(si),ii.add(new Id(16774111,2238532,1.35));const t=new tl(16771015,1.7);t.position.set(3.5,6,4.5),ii.add(t);const n=new tl(9680383,.65);return n.position.set(-4,2,-3),ii.add(n),Cl=!0,!0}catch{return!1}}function W0(i){return i*Math.PI/2}function X0(i,e){if(!oi)return;const t=e*Math.PI/180,n=4.2,s=Math.cos(t),r=Math.sin(t);oi.position.set(Math.sin(i)*s*n,r*n+.85,Math.cos(i)*s*n),oi.lookAt(0,.88,0),oi.updateProjectionMatrix()}function q0(i,e,t,n,s,r=0,a=30){const o=e(0,0,0),l=e(0,0,1),c=Math.max(8,Math.abs(o.y-l.y)*1.12),h=c*192/240;if(!Cc()||!bn||!ii||!oi||!si){i.fillStyle="#6a7080",i.beginPath(),i.ellipse(o.x,o.y-c*.35,h*.22,c*.35,0,0,Math.PI*2),i.fill();return}const f=Rc(t.archetype,t.gender),d=N0(t,n);for(V0(f.parts,t.archetype,d.clip,d.t,n);si.children.length;)si.remove(si.children[0]);f.parts.root.parent&&f.parts.root.parent.remove(f.parts.root),si.add(f.parts.root),f.parts.root.rotation.set(0,W0(t.dir),0),X0(r,a),bn.render(ii,oi),i.save(),i.imageSmoothingEnabled=!0,i.drawImage(bn.domElement,o.x-h*.5,o.y-c*.88,h,c),i.restore()}function Y0(){if(!Cc())return;const i=["mara","dana","priya","hale","crosby","beckett","delinquent","magician","wolverine","boxer","gunner","worker","official"];for(const e of i)for(const t of["f","m"])Rc(e,t)}const Ba=64,$0=24,K0=8,Z0=15,J0=75,es=30;function Pl(i){return Math.min(J0,Math.max(Z0,i))}function Q0(i,e,t,n,s){return{x:(i-e)*(Ba/2),y:(i+e)*(n/2)-t*s}}function Ll(i,e,t,n,s,r,a,o){const l=a-t,c=o-n,h=s-t,f=r-n,d=i-t,m=e-n,_=l*l+c*c,M=l*h+c*f,p=l*d+c*m,u=h*h+f*f,E=h*d+f*m,w=_*u-M*M;if(Math.abs(w)<1e-8)return!1;const y=1/w,A=(u*p-M*E)*y,S=(_*E-M*p)*y;return A>=-.02&&S>=-.02&&A+S<=1.02}function Il(i,e,t,n,s,r){return Ll(i,e,t.x,t.y,n.x,n.y,s.x,s.y)||Ll(i,e,t.x,t.y,s.x,s.y,r.x,r.y)}function Qt(i,e,t){return{x:i.x+(e.x-i.x)*t,y:i.y+(e.y-i.y)*t}}function zn(i){const e=Math.sin(i*12.9898)*43758.5453;return e-Math.floor(e)}class j0{constructor(e){J(this,"canvas");J(this,"ctx");J(this,"cam",{x:-224,y:180,zoom:.7});J(this,"w",390);J(this,"h",700);J(this,"time",0);J(this,"yaw",0);J(this,"pitch",es);J(this,"mapW",10);J(this,"mapH",12);this.canvas=e;const t=e.getContext("2d");if(!t)throw new Error("canvas");this.ctx=t,this.resize()}tileH(){return Ba*Math.sin(this.pitch*Math.PI/180)}blockH(){const e=Math.cos(es*Math.PI/180);return $0*Math.cos(this.pitch*Math.PI/180)/e}baseH(){const e=Math.cos(es*Math.PI/180);return K0*Math.cos(this.pitch*Math.PI/180)/e}addPitch(e){this.pitch=Pl(this.pitch+e*.16)}setPitch(e){this.pitch=Pl(e)}resize(){const e=Math.min(window.devicePixelRatio||1,2),t=this.canvas.getBoundingClientRect();this.w=Math.max(1,t.width),this.h=Math.max(1,t.height),this.canvas.width=Math.floor(this.w*e),this.canvas.height=Math.floor(this.h*e),this.ctx.setTransform(e,0,0,e,0,0)}forceSize(e,t){const n=Math.min(window.devicePixelRatio||1,2);this.w=e,this.h=t,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`,this.canvas.width=Math.floor(e*n),this.canvas.height=Math.floor(t*n),this.ctx.setTransform(n,0,0,n,0,0)}syncMap(e){this.mapW=e.w,this.mapH=e.h}isoOf(e,t,n=0){const s=Wi(e,t,this.yaw,this.mapW,this.mapH);return Q0(s.x,s.y,n,this.tileH(),this.blockH())}worldToScreen(e,t,n=0){const s=this.isoOf(e,t,n);return{x:(s.x-this.cam.x)*this.cam.zoom+this.w/2,y:(s.y-this.cam.y)*this.cam.zoom+this.h/2}}topCorners(e,t,n){return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([r,a])=>this.worldToScreen(e+r,t+a,n))}topMetrics(e,t,n){const s=this.topCorners(e,t,n);let r=0,a=0;for(const c of s)r+=c.x,a+=c.y;r/=4,a/=4;let o=0,l=0;for(const c of s)o=Math.max(o,Math.abs(c.x-r)),l=Math.max(l,Math.abs(c.y-a));return{cx:r,cy:a,hw:o,hh:l,drop:(this.baseH()+n*this.blockH())*this.cam.zoom,top:s}}frontFaces(e,t){const n=[];for(let s=0;s<4;s++){const r=e[s],a=e[(s+1)%4],o={x:a.x,y:a.y+t},l={x:r.x,y:r.y+t};n.push({pts:[r,a,o,l],y:(r.y+a.y+o.y+l.y)/4})}return n.sort((s,r)=>s.y-r.y),n.slice(-2).map(s=>s.pts)}screenToGrid(e,t){const n=this.cam.x+(e-this.w/2)/this.cam.zoom,s=this.cam.y+(t-this.h/2)/this.cam.zoom,r=Ba/2,a=this.tileH()/2,o=(n/r+s/a)/2,l=(s/a-n/r)/2,c=Math.cos(this.yaw),h=Math.sin(this.yaw),f=o*c-l*h,d=o*h+l*c;return{x:f+(this.mapW-1)/2,y:d+(this.mapH-1)/2}}lockGridToScreen(e,t,n,s,r){const a=this.isoOf(e,t,n);this.cam.x=a.x-(s-this.w/2)/this.cam.zoom,this.cam.y=a.y-(r-this.h/2)/this.cam.zoom}cellsInDrawOrder(e){const t=[];for(let n=0;n<e.h;n++)for(let s=0;s<e.w;s++)t.push({x:s,y:n});return t.sort((n,s)=>{const r=Wi(n.x,n.y,this.yaw,e.w,e.h),a=Wi(s.x,s.y,this.yaw,e.w,e.h);return r.x+r.y-(a.x+a.y)}),t}hitTile(e,t,n){this.syncMap(n);let s=null;for(const r of this.cellsInDrawOrder(n)){const a=n.tiles[r.y][r.x];this.hitPrism(e,t,a)&&(s=r)}return s}hitPrism(e,t,n){const{drop:s,top:r}=this.topMetrics(n.x,n.y,n.h);if(Il(e,t,r[0],r[1],r[2],r[3]))return!0;for(const[a,o,l,c]of this.frontFaces(r,s))if(Il(e,t,a,o,l,c))return!0;return!1}rotate(e){this.syncMap(e);const t=this.hitTile(this.w/2,this.h/2,e)??{x:Math.floor(e.w/2),y:Math.floor(e.h/2)};this.yaw=Zc(this.yaw);const n=e.heightAt(t.x,t.y),s=this.isoOf(t.x,t.y,n);this.cam.x=s.x,this.cam.y=s.y-24}centerOn(e,t){this.syncMap(t);const n=e.filter(a=>!a.dead&&a.team==="player"&&!a.npc);if(!n.length)return;let s=0,r=0;for(const a of n){const o=this.isoOf(a.x,a.y,t.heightAt(a.x,a.y));s+=o.x,r+=o.y}this.cam.x=s/n.length,this.cam.y=r/n.length-52,this.cam.zoom=.7}draw(e,t,n,s){const r=this.ctx;this.syncMap(e),this.time+=16,r.clearRect(0,0,this.w,this.h),this.drawBackdrop(e.theme);const a=new Map;for(const l of t)l.dead||a.set(qe(l.x,l.y),l);const o=new Map;for(const l of e.objects)l.gone||o.set(qe(l.x,l.y),l);for(const l of this.cellsInDrawOrder(e)){this.drawTile(e.tiles[l.y][l.x],e,n);const c=o.get(qe(l.x,l.y));c&&this.drawBoardObj(c,e);const h=a.get(qe(l.x,l.y));h&&this.drawUnit(h,e,n)}this.drawVignette(),this.drawFloats(s,e)}drawBackdrop(e){const t=this.ctx,n=t.createLinearGradient(0,0,0,this.h);e==="alley"||e==="warehouse"||e==="street"?(n.addColorStop(0,"#0c0d12"),n.addColorStop(.5,"#0a090c"),n.addColorStop(1,"#140c08")):(n.addColorStop(0,"#0b1020"),n.addColorStop(.45,"#090914"),n.addColorStop(1,"#120818")),t.fillStyle=n,t.fillRect(0,0,this.w,this.h),t.save(),t.globalAlpha=.16;for(let s=0;s<8;s++){const r=(s*73+this.time*.004%73)%this.w;t.fillStyle=e==="alley"?s%2?"#ffb040":"#c45a2a":s%2?"#ff3d8a":"#3ef0d0",t.fillRect(r,8+s%3*10,18,4)}t.restore()}themeGroup(e){return e==="warehouse"||e==="street"||e==="alley"?"alley":"roof"}tilePaint(e,t,n){const s=e.blocked;return this.themeGroup(t)==="alley"?e.terrain==="stairs"?{top:n?"#6e6254":"#5e5248",left:"#3a3228",right:"#4a4034",rim:"rgba(220, 190, 140, 0.35)",seam:"rgba(30, 20, 12, 0.45)"}:e.terrain==="roof"?{top:n?"#3a3e4c":"#323644",left:"#241c1a",right:"#302624",rim:"rgba(180, 160, 130, 0.3)",seam:"rgba(20, 16, 14, 0.5)"}:{top:s?n?"#1e2228":"#1a1e24":n?"#2c323c":"#262c36",left:"#14161c",right:"#1c2026",rim:s?"rgba(180, 70, 50, 0.4)":"rgba(120, 160, 180, 0.28)",seam:"rgba(10, 12, 16, 0.5)"}:e.terrain==="stairs"?{top:n?"#6a6258":"#5a544c",left:"#3a342c",right:"#4a443c",rim:"rgba(210, 200, 180, 0.32)",seam:"rgba(28, 24, 20, 0.45)"}:e.terrain==="roof"?{top:s?n?"#2e2c3c":"#282636":n?"#4a4860":"#3e3c54",left:"#241e2c",right:"#302838",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(140, 210, 230, 0.34)",seam:"rgba(18, 14, 28, 0.5)"}:{top:s?n?"#1c1a24":"#18161e":n?"#2c2a38":"#262430",left:"#16141c",right:"#201c28",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(110, 190, 210, 0.28)",seam:"rgba(12, 10, 18, 0.5)"}}drawTile(e,t,n){const s=this.ctx,{cx:r,cy:a,hw:o,hh:l,drop:c,top:h}=this.topMetrics(e.x,e.y,e.h),f=qe(e.x,e.y),d=(e.x+e.y)%2===0,m=this.cam.zoom,_=this.frontFaces(h,c),M=this.tilePaint(e,t.theme,d),p=_.slice().sort((E,w)=>(E[0].x+E[1].x)/2-(w[0].x+w[1].x)/2);for(let E=0;E<p.length;E++)this.drawWallFace(e,p[E],E===0?M.left:M.right,t.theme,m,e.x*13+e.y*7+E);this.drawTopSurface(e,t,h,r,a,o,l,M,m),this.drawRailings(e,t,h,m),this.drawProp(e,t.theme,r,a,o,l,m),n.move.has(f)&&(this.quadPath(this.insetQuad(h,.92)),s.fillStyle="rgba(62, 240, 208, 0.3)",s.fill(),s.strokeStyle="rgba(62, 240, 208, 0.9)",s.lineWidth=1.2,s.stroke());const u=n.areaKind;if(n.area.has(f)&&!n.hot.has(f)){const E=u==="skill"||u==="item"?"rgba(160, 130, 220, 0.16)":"rgba(255, 90, 110, 0.14)",w=u==="skill"||u==="item"?"rgba(180, 150, 230, 0.45)":"rgba(255, 110, 130, 0.42)";this.quadPath(this.insetQuad(h,.9)),s.fillStyle=E,s.fill(),s.strokeStyle=w,s.lineWidth=1.15,s.stroke()}if(n.hot.has(f)){const E=.5+.28*Math.sin(this.time/190),w=u==="skill"||u==="item"?`rgba(190, 150, 255, ${.28+E*.22})`:`rgba(255, 80, 110, ${.3+E*.22})`,y=u==="skill"||u==="item"?"rgba(230, 210, 255, 0.98)":"rgba(255, 170, 180, 0.98)";this.quadPath(this.insetQuad(h,.86)),s.fillStyle=w,s.fill(),s.strokeStyle=y,s.lineWidth=2.15,s.stroke()}n.inspect&&n.inspect.x===e.x&&n.inspect.y===e.y&&(this.quadPath(this.insetQuad(h,.96)),s.strokeStyle="rgba(255, 232, 160, 0.95)",s.lineWidth=2,s.stroke())}drawWallFace(e,t,n,s,r,a){const o=this.ctx,[l,c,h,f]=t;o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.fillStyle=n,o.fill(),o.save(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.clip();const d=this.blockH()*r;o.strokeStyle=s==="alley"?"rgba(20, 12, 8, 0.4)":"rgba(10, 8, 16, 0.4)",o.lineWidth=1;const m=Math.max(1,e.h);for(let M=1;M<=m;M++){const p=M*d;o.beginPath(),o.moveTo(l.x,l.y+p),o.lineTo(c.x,c.y+p),o.stroke()}const _=(l.x+c.x)/2;if(o.beginPath(),o.moveTo(_,(l.y+c.y)/2),o.lineTo(_,(h.y+f.y)/2),o.strokeStyle="rgba(0,0,0,0.18)",o.stroke(),e.h>=2&&zn(a)>.45){const M=(l.x+c.x)*.5,p=(l.y+c.y)*.5+d*.55,u=Math.max(4,Math.abs(c.x-l.x)*.22),E=Math.max(5,d*.42);o.fillStyle=s==="alley"?"rgba(8, 8, 6, 0.7)":"rgba(6, 8, 14, 0.72)",o.fillRect(M-u,p-E/2,u*2,E),o.strokeStyle=s==="alley"?"rgba(255, 170, 80, 0.18)":"rgba(80, 160, 220, 0.2)",o.strokeRect(M-u,p-E/2,u*2,E)}if(e.h>=1&&zn(a+3)>.62){const M=l.x*.7+c.x*.3;o.strokeStyle=s==="alley"?"rgba(90, 70, 50, 0.55)":"rgba(70, 90, 100, 0.5)",o.lineWidth=Math.max(1.4,1.8*r),o.beginPath(),o.moveTo(M,(l.y+c.y)/2),o.lineTo(M,(h.y+f.y)/2),o.stroke()}o.restore(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.strokeStyle="rgba(0,0,0,0.35)",o.lineWidth=1,o.stroke()}drawTopSurface(e,t,n,s,r,a,o,l,c){const h=this.ctx;if(this.quadPath(n),h.fillStyle=l.top,h.fill(),h.save(),this.quadPath(n),h.clip(),e.terrain==="stairs"){h.strokeStyle="rgba(20, 16, 12, 0.45)",h.lineWidth=Math.max(1.2,1.5*c);for(let d=1;d<=4;d++){const m=d/5,_=Qt(n[0],n[3],m),M=Qt(n[1],n[2],m);h.beginPath(),h.moveTo(_.x,_.y),h.lineTo(M.x,M.y),h.stroke()}h.fillStyle="rgba(255, 230, 190, 0.07)",h.fillRect(s-a,r-o*.2,a*2,o*.5)}else if(t.theme==="roof"&&e.terrain==="roof"){h.strokeStyle=l.seam,h.lineWidth=1;for(let d=1;d<=4;d++){const m=d/5,_=Qt(n[0],n[1],m),M=Qt(n[3],n[2],m);h.beginPath(),h.moveTo(_.x,_.y),h.lineTo(M.x,M.y),h.stroke()}!e.prop&&!e.blocked&&zn(e.x*9+e.y*17)<.2?(this.quadPath(this.insetQuad(n,.42)),h.fillStyle="rgba(20, 40, 70, 0.55)",h.fill(),h.strokeStyle="rgba(120, 200, 230, 0.45)",h.stroke()):!e.prop&&zn(e.x*5+e.y*11)<.16&&(h.fillStyle="#3a3e48",h.beginPath(),h.ellipse(s+a*.12,r-o*.08,4.5*c,3.2*c,0,0,Math.PI*2),h.fill(),h.strokeStyle="#8a93a3",h.stroke())}else if(t.theme==="alley"&&e.terrain==="street"){zn(e.x+e.y*8)>.55&&(h.fillStyle="rgba(70, 140, 180, 0.1)",h.beginPath(),h.ellipse(s-a*.1,r+o*.12,a*.32,o*.22,0,0,Math.PI*2),h.fill()),h.strokeStyle="rgba(0,0,0,0.28)",h.beginPath();const d=Qt(n[0],n[2],.35+zn(e.x*3)*.3);h.moveTo(s-a*.2,r),h.lineTo(d.x,d.y),h.stroke()}else if(t.theme==="roof"){h.strokeStyle="rgba(0,0,0,0.2)";const d=Qt(n[0],n[2],.5),m=Qt(n[1],n[3],.5);h.beginPath(),h.moveTo(d.x,d.y),h.lineTo(m.x,m.y),h.stroke()}else h.strokeStyle=l.seam,h.beginPath(),h.moveTo(Qt(n[0],n[1],.5).x,Qt(n[0],n[1],.5).y),h.lineTo(Qt(n[3],n[2],.5).x,Qt(n[3],n[2],.5).y),h.stroke();if(e.blocked){h.strokeStyle="rgba(0,0,0,0.28)",h.lineWidth=1;for(let d=-2;d<=2;d++)h.beginPath(),h.moveTo(s-a+d*6*c,r-o),h.lineTo(s+a+d*6*c,r+o),h.stroke()}h.fillStyle="rgba(255,255,255,0.055)";for(let d=0;d<5;d++){const m=zn(e.x*19+e.y*23+d),_=zn(e.x*29+e.y*31+d+4);h.fillRect(s-a+m*a*2,r-o+_*o*2,1.6*c,1.2*c)}h.restore(),this.quadPath(n),h.strokeStyle=l.rim,h.lineWidth=1.2,h.stroke();let f=0;for(let d=1;d<4;d++)n[d].y<n[f].y&&(f=d);h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+1)%4].x,n[(f+1)%4].y),h.strokeStyle="rgba(230, 248, 255, 0.38)",h.stroke(),h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+3)%4].x,n[(f+3)%4].y),h.strokeStyle="rgba(20, 20, 28, 0.4)",h.stroke()}drawRailings(e,t,n,s){if(e.h<1||e.terrain==="stairs")return;const r=this.ctx,a=[[0,-1],[1,0],[0,1],[-1,0]],o=(t.theme==="roof"?7.5:6.5)*s;r.strokeStyle=t.theme==="roof"?"rgba(170, 186, 210, 0.85)":"rgba(120, 96, 72, 0.8)",r.lineWidth=Math.max(1.15,1.35*s);for(let l=0;l<4;l++){const c=t.tile(e.x+a[l][0],e.y+a[l][1]);if((c?e.h-c.h:e.h+1)<1)continue;const f=n[l],d=n[(l+1)%4];r.beginPath(),r.moveTo(f.x,f.y),r.lineTo(f.x,f.y-o),r.lineTo(d.x,d.y-o),r.lineTo(d.x,d.y),r.stroke(),r.beginPath(),r.moveTo(f.x,f.y-o*.48),r.lineTo(d.x,d.y-o*.48),r.stroke()}}diamondPath(e,t,n,s){const r=this.ctx;r.beginPath(),r.moveTo(e,t-s),r.lineTo(e+n,t),r.lineTo(e,t+s),r.lineTo(e-n,t),r.closePath()}quadPath(e){const t=this.ctx;t.beginPath(),t.moveTo(e[0].x,e[0].y);for(let n=1;n<e.length;n++)t.lineTo(e[n].x,e[n].y);t.closePath()}insetQuad(e,t){let n=0,s=0;for(const r of e)n+=r.x,s+=r.y;return n/=e.length,s/=e.length,e.map(r=>({x:n+(r.x-n)*t,y:s+(r.y-s)*t}))}drawProp(e,t,n,s,r,a,o){const l=this.ctx;if(e.prop==="stall"){const c=15*o;l.beginPath(),l.moveTo(n-r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n-r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#3a141c",l.fill(),l.beginPath(),l.moveTo(n+r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n+r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#4a1d28",l.fill();const h=.75+Math.sin(this.time/180+e.x)*.2;this.diamondPath(n,s-4*o,r*.62,a*.62),l.fillStyle=`rgba(255, 61, 138, ${.72*h})`,l.fill(),l.fillStyle="#ffe08a",l.font=`bold ${Math.max(8,9*o)}px sans-serif`,l.textAlign="center",l.fillText(e.x<5?"FISH":"TEA",n,s-2*o)}else if(e.prop==="crate"){const c=13*o;l.beginPath(),l.moveTo(n-r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n-r*.48,s+c),l.closePath(),l.fillStyle="#5a3a22",l.fill(),l.beginPath(),l.moveTo(n+r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n+r*.48,s+c),l.closePath(),l.fillStyle="#6c4628",l.fill(),this.diamondPath(n,s-2*o,r*.48,a*.48),l.fillStyle="#8a5a32",l.fill(),l.strokeStyle="rgba(40, 22, 10, 0.55)",l.lineWidth=1;for(let h=-1;h<=1;h++)l.beginPath(),l.moveTo(n-r*.28,s+h*3*o),l.lineTo(n+r*.28,s+h*3*o),l.stroke();l.strokeStyle="rgba(180, 160, 120, 0.45)",l.strokeRect(n-5*o,s-3*o,10*o,4*o)}else if(e.prop==="ac"){const c=11*o;l.beginPath(),l.moveTo(n-r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n-r*.42,s+c),l.closePath(),l.fillStyle="#2e323c",l.fill(),l.beginPath(),l.moveTo(n+r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n+r*.42,s+c),l.closePath(),l.fillStyle="#3a3e48",l.fill(),this.diamondPath(n,s-2*o,r*.42,a*.42),l.fillStyle="#4a5060",l.fill();const h=this.time/140;l.strokeStyle="#8a93a3",l.lineWidth=1.2,l.beginPath(),l.arc(n,s-2*o,4.8*o,0,Math.PI*2),l.stroke(),l.beginPath(),l.moveTo(n+Math.cos(h)*4.2*o,s-2*o+Math.sin(h)*2.2*o),l.lineTo(n-Math.cos(h)*4.2*o,s-2*o-Math.sin(h)*2.2*o),l.stroke()}else if(e.prop==="lamp"){l.fillStyle="#2a2a32",l.fillRect(n-1.6*o,s-20*o,3.2*o,24*o);const c=t==="alley"?"rgba(255, 180, 80, 0.92)":"rgba(255, 210, 120, 0.9)";l.fillStyle=c,l.beginPath(),l.arc(n,s-22*o,4.4*o,0,Math.PI*2),l.fill(),l.fillStyle=t==="alley"?"rgba(255, 160, 70, 0.14)":"rgba(255, 200, 110, 0.12)",l.beginPath(),l.arc(n,s-4*o,17*o,0,Math.PI*2),l.fill()}}projectAt(e,t,n,s,r){return(a,o,l)=>{const c=wl(a,o,s),h=this.worldToScreen(e+c.x,t+c.y,n+l*Vr),f=Wi(e+c.x,t+c.y,this.yaw,r.w,r.h);return{x:h.x,y:h.y,d:f.x+f.y-l}}}drawBoardObj(e,t){const n=this.ctx,s=t.tiles[e.y][e.x].h;this.worldToScreen(e.x,e.y,s);const r=this.cam.zoom,{cx:a,cy:o,hw:l,hh:c}=this.topMetrics(e.x,e.y,s);if(e.type==="barrel"){n.fillStyle="#7a2a22",n.beginPath(),n.ellipse(a,o+2*r,l*.38,c*.32,0,0,Math.PI*2),n.fill(),n.fillStyle="#c44a32",n.fillRect(a-7*r,o-16*r,14*r,18*r),n.fillStyle="#e8c45a",n.fillRect(a-7*r,o-8*r,14*r,2.2*r),n.fillStyle="#2a1010",n.beginPath(),n.ellipse(a,o-16*r,7*r,3.2*r,0,0,Math.PI*2),n.fill();const f=e.hp/Math.max(1,e.maxHp);n.fillStyle="#111018",n.fillRect(a-10*r,o-22*r,20*r,3*r),n.fillStyle="#ff4d6d",n.fillRect(a-10*r,o-22*r,20*r*f,3*r);return}if(e.type==="kit"){n.fillStyle="#f2f4f0",n.fillRect(a-8*r,o-8*r,16*r,12*r),n.fillStyle="#d04040",n.fillRect(a-2*r,o-6*r,4*r,8*r),n.fillRect(a-6*r,o-3*r,12*r,3*r),n.strokeStyle="#3a3a40",n.strokeRect(a-8*r,o-8*r,16*r,12*r);return}if(e.type==="switch"){n.fillStyle=e.used?"#3a5a48":"#3ef0d0",this.diamondPath(a,o,l*.35,c*.35),n.fill(),n.strokeStyle="#0a1816",n.stroke(),n.fillStyle=e.used?"#8aa":"#fff",n.font=`bold ${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(e.used?"開":"掣",a,o+3*r);return}if(e.type==="van"){n.fillStyle=e.used?"#3a4850":"#2a3540",n.fillRect(a-14*r,o-18*r,28*r,22*r),n.fillStyle="#1a2228",n.fillRect(a-10*r,o-14*r,12*r,8*r),n.fillStyle=e.used?"#7dffb3":"#ffc857",n.fillRect(a+4*r,o-6*r,8*r,10*r),n.fillStyle="#e8eef2",n.font=`${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(e.used?"開":"門",a,o+16*r);return}const h=e.type==="pallet"?8*r:12*r;n.fillStyle=e.type==="pallet"?"#6a5030":"#8a5a32",n.beginPath(),n.moveTo(a-l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a-l*.46,o+h),n.closePath(),n.fill(),n.fillStyle=e.type==="pallet"?"#7a6038":"#a06a3c",n.beginPath(),n.moveTo(a+l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a+l*.46,o+h),n.closePath(),n.fill(),this.diamondPath(a,o-2*r,l*.46,c*.46),n.fillStyle=e.type==="pallet"?"#c4a060":"#c48448",n.fill(),n.strokeStyle="rgba(40,22,10,0.55)",n.stroke()}projectFor(e,t){const n=t.heightAt(e.x,e.y);return(s,r,a)=>{const o=wl(s,r,e.dir),l=this.worldToScreen(e.x+o.x,e.y+o.y,n+a*Vr),c=Wi(e.x+o.x,e.y+o.y,this.yaw,t.w,t.h);return{x:l.x,y:l.y,d:c.x+c.y-a*Vr*.45}}}drawUnit(e,t,n){const s=this.ctx,r=t.heightAt(e.x,e.y),a=this.worldToScreen(e.x,e.y,r),o=this.cam.zoom,l=e.role==="elite",c=(l?1.12:1)*o,h=Bl(e),f=Kc(ts[e.dir].x,ts[e.dir].y,this.yaw),d=(f.x-f.y)*6*o*(e.lunge||0),m=(f.x+f.y)*3*o*(e.lunge||0),_=a.x+d,M=a.y+m+2*o,p=e.acted;s.save(),p&&(s.globalAlpha*=.45),s.fillStyle="rgba(0,0,0,0.4)",s.beginPath(),s.ellipse(_,M+1*o,11*c,4.8*c,0,0,Math.PI*2),s.fill(),s.strokeStyle=h,s.lineWidth=Math.max(2,2.2*o),s.beginPath(),s.ellipse(_,M+1*o,12.2*c,5.4*c,0,0,Math.PI*2),s.stroke(),s.strokeStyle="rgba(8,8,12,0.85)",s.lineWidth=1,s.stroke(),n.selected?.id===e.id&&(s.strokeStyle=h,s.lineWidth=2.2,this.diamondPath(a.x,a.y,16*c,8*c),s.stroke()),n.target?.id===e.id&&(s.strokeStyle="#ffe08a",s.lineWidth=2,this.diamondPath(a.x,a.y,18*c,9*c),s.stroke());const u=this.projectFor(e,t);q0(s,(R,x,b)=>{const C=u(R,x,b);return{x:C.x+d,y:C.y+m,d:C.d}},e,this.time,o,this.yaw,this.pitch),this.drawFacingWedge(e,t,_,M,o);const w=O0(o)*(l?1.12:1),y=22*c,A=Math.max(0,e.hp/e.maxHp),S=M-w-4*c;if(s.fillStyle="#111018",s.fillRect(_-y/2,S,y,3.5*c),s.fillStyle=h,s.fillRect(_-y/2,S,y*A,3.5*c),s.fillStyle="#e8eef2",s.font=`${Math.max(9,10*o)}px sans-serif`,s.textAlign="center",s.fillText(e.name.split(" ")[0],_,M+16*o),s.restore(),p){const R=_+14*c,x=M-w+10*c,b=7.2*c;s.fillStyle="rgba(8, 8, 14, 0.88)",s.beginPath(),s.arc(R,x,b,0,Math.PI*2),s.fill(),s.strokeStyle="rgba(220, 224, 232, 0.92)",s.lineWidth=Math.max(1,1.15*o),s.stroke(),s.fillStyle="#e8eef2",s.font=`bold ${Math.max(9,11*o)}px sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText("E",R,x+.4*c),s.textBaseline="alphabetic"}}drawFacingWedge(e,t,n,s,r){const a=this.ctx,o=t.heightAt(e.x,e.y),l=this.projectAt(e.x,e.y,o,e.dir,t),c=[l(0,.11,.03),l(-.035,.04,.03),l(.035,.04,.03)],h=[l(-.04,.035,.018),l(.04,.035,.018),l(.05,-.045,.018),l(0,-.015,.018),l(-.05,-.045,.018)];a.beginPath(),a.moveTo(h[0].x,h[0].y);for(let f=1;f<h.length;f++)a.lineTo(h[f].x,h[f].y);a.closePath(),a.lineJoin="round",a.strokeStyle="rgba(6,8,14,0.95)",a.lineWidth=Math.max(1.6,1.8*r),a.stroke(),a.fillStyle="#5a88c8",a.fill(),a.beginPath(),a.moveTo(c[0].x,c[0].y),a.lineTo(c[1].x,c[1].y),a.lineTo(c[2].x,c[2].y),a.closePath(),a.strokeStyle="rgba(6,8,14,0.95)",a.stroke(),a.fillStyle="#ff9a3c",a.fill()}drawVignette(){const e=this.ctx,t=e.createRadialGradient(this.w/2,this.h/2,this.h*.2,this.w/2,this.h/2,this.h*.78);t.addColorStop(0,"rgba(0,0,0,0)"),t.addColorStop(1,"rgba(0,0,0,0.45)"),e.fillStyle=t,e.fillRect(0,0,this.w,this.h)}drawFloats(e,t){const n=this.ctx,s=performance.now();for(const r of e){const a=(s-r.born)/r.life;if(a>1)continue;const o=t.heightAt(Math.round(r.x),Math.round(r.y)),l=this.worldToScreen(r.x,r.y,o);n.globalAlpha=1-a,n.font=`bold ${18*this.cam.zoom}px sans-serif`,n.textAlign="center",n.lineWidth=3,n.strokeStyle="#050508",n.fillStyle=r.color;const c=l.y-36*this.cam.zoom-a*28;n.strokeText(r.text,l.x,c),n.fillText(r.text,l.x,c),n.globalAlpha=1}}}const Pc=3,Lc="yejie-v1";function Dl(){return{slots:[null,null,null],autosave:null}}function jn(){try{const i=localStorage.getItem(Lc);if(!i)return Dl();const e=JSON.parse(i),t=[null,null,null];for(let s=0;s<Pc;s++){const r=Array.isArray(e.slots)?e.slots[s]:null;t[s]=r&&r.v===1?r:null}const n=e.autosave&&e.autosave.v===1?e.autosave:null;return{slots:t,autosave:n}}catch{return Dl()}}function Ul(i){localStorage.setItem(Lc,JSON.stringify(i))}function eg(i){const e=[];i.autosave&&e.push(i.autosave);for(const t of i.slots)t&&e.push(t);return e}function Nl(i){const e=eg(i);return e.length?e.reduce((t,n)=>t.savedAt>=n.savedAt?t:n):null}function tg(i){try{return new Date(i).toLocaleString("zh-Hant-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}const Fl="0.6.0",ng="20260906";function xe(i){const e=document.getElementById(i);if(!e)throw new Error(i);return e}const ig={striker:"突擊",controller:"控制",support:"支援",grunt:"現場",elite:"主管",civilian:"文官",delinquent:"街頭",magician:"術者",wolverine:"爪獸",boxer:"拳手",gunner:"槍手",worker:"工人"},Wr={street:"街道",stairs:"樓梯",roof:"屋頂"},sg={stall:"攤位",ac:"冷氣",lamp:"路燈",crate:"貨箱"},Ol={friendly:"友方",hostile:"敵對",neutral:"中立"};class rg{constructor(e){J(this,"map");J(this,"units",[]);J(this,"phase","title");J(this,"turn",1);J(this,"selected",null);J(this,"origin",null);J(this,"originDir",0);J(this,"field",null);J(this,"moveTiles",new Set);J(this,"actionTiles",new Set);J(this,"skillTiles",new Set);J(this,"areaTiles",new Set);J(this,"areaKind",null);J(this,"forecast",null);J(this,"inspect",null);J(this,"floats",[]);J(this,"busy",!1);J(this,"log","");J(this,"missionIndex",0);J(this,"loseKind","wipe");J(this,"intel","M");J(this,"power","M");J(this,"inventory",qt(gi));J(this,"missionStartInventory",qt(gi));J(this,"pendingItem",null);J(this,"m1DropGiven",!1);J(this,"modalKind","off");J(this,"paused",!1);J(this,"pauseOpen",!1);J(this,"renderer");J(this,"input");J(this,"hudTurn",xe("hud-turn"));J(this,"hudPhase",xe("hud-phase"));J(this,"hudSub",xe("hud-sub"));J(this,"chip",xe("unit-chip"));J(this,"chipMark",xe("chip-mark"));J(this,"chipName",xe("chip-name"));J(this,"chipMeta",xe("chip-meta"));J(this,"chipExtra",xe("chip-extra"));J(this,"chipHp",xe("chip-hp"));J(this,"chipHpFill",xe("chip-hp-fill"));J(this,"forecastEl",xe("forecast"));J(this,"logEl",xe("log"));J(this,"title",xe("title"));J(this,"briefing",xe("briefing"));J(this,"result",xe("result"));J(this,"resultKicker",xe("result-kicker"));J(this,"resultTitle",xe("result-title"));J(this,"resultBody",xe("result-body"));J(this,"modal",xe("modal"));J(this,"modalKicker",xe("modal-kicker"));J(this,"modalTitle",xe("modal-title"));J(this,"modalBody",xe("modal-body"));J(this,"confirmEl",xe("confirm"));J(this,"confirmText",xe("confirm-text"));J(this,"btnCancel",xe("btn-cancel"));J(this,"btnWait",xe("btn-wait"));J(this,"btnSkill",xe("btn-skill"));J(this,"btnConfirm",xe("btn-confirm"));J(this,"btnEnd",xe("btn-end"));J(this,"btnNext",xe("btn-next"));J(this,"btnRotate",xe("btn-rotate"));J(this,"btnPause",xe("btn-pause"));J(this,"btnBag",xe("btn-bag"));J(this,"btnContinue",xe("btn-continue"));J(this,"btnMute",xe("btn-mute"));J(this,"btnPauseNext",xe("btn-pause-next"));J(this,"pauseEl",xe("pause"));J(this,"titleBuild",xe("title-build"));J(this,"camHint",xe("cam-hint"));J(this,"yawSlider",xe("yaw-slider"));J(this,"pitchSlider",xe("pitch-slider"));J(this,"pendingSlot",null);J(this,"pendingQuit",!1);J(this,"pendingJump",null);this.renderer=new j0(e),Y0(),this.input=new ch(e,this.renderer),this.input.onTap=t=>this.onTap(t),this.map=new lr(this.mission.map),this.resetBattle(),this.phase="title",this.briefing.hidden=!0,this.title.hidden=!1,window.addEventListener("resize",()=>this.renderer.resize()),xe("btn-start").addEventListener("click",()=>this.begin()),xe("btn-restart").addEventListener("click",()=>this.restart()),this.btnNext.addEventListener("click",()=>this.nextMission()),this.btnCancel.addEventListener("click",()=>this.cancel()),this.btnWait.addEventListener("click",()=>void this.wait()),this.btnSkill.addEventListener("click",()=>this.armSkill()),this.btnConfirm.addEventListener("click",()=>void this.confirm()),this.btnEnd.addEventListener("click",()=>void this.endTurn()),this.btnRotate.addEventListener("click",()=>this.rotateMap()),this.btnPause.addEventListener("click",()=>this.openPause()),this.btnBag.addEventListener("click",()=>this.openBagFromHud()),xe("btn-new").addEventListener("click",()=>this.newGame()),this.btnContinue.addEventListener("click",()=>this.continueGame()),xe("btn-load").addEventListener("click",()=>this.openSaves("load")),xe("btn-bag-title").addEventListener("click",()=>this.openBag()),xe("btn-refresh").addEventListener("click",()=>void this.refreshApp()),xe("btn-brief-title").addEventListener("click",()=>this.goTitle()),xe("btn-result-title").addEventListener("click",()=>this.goTitle()),xe("btn-resume").addEventListener("click",()=>this.closePause()),xe("btn-pause-save").addEventListener("click",()=>this.openSaves("save")),xe("btn-pause-load").addEventListener("click",()=>this.openSaves("load")),this.btnMute.addEventListener("click",()=>this.toggleMute()),this.btnPauseNext.addEventListener("click",()=>this.requestNextMission()),document.querySelectorAll("[data-test-mission]").forEach(t=>{t.addEventListener("click",()=>this.jumpToMission(Number(t.dataset.testMission)))}),xe("btn-quit-title").addEventListener("click",()=>this.quitToTitle()),xe("modal-close").addEventListener("click",()=>this.closeModal()),xe("confirm-yes").addEventListener("click",()=>this.confirmYes()),xe("confirm-no").addEventListener("click",()=>this.confirmNo()),this.bindSeg("seg-intel",t=>{this.intel=t}),this.bindSeg("seg-power",t=>{this.power=t}),this.yawSlider.addEventListener("input",()=>{this.renderer.yaw=Number(this.yawSlider.value)/100}),this.pitchSlider.addEventListener("input",()=>{this.renderer.setPitch(Number(this.pitchSlider.value))}),this.modalBody.addEventListener("click",t=>this.onModalClick(t)),this.titleBuild.textContent=`版本 ${Fl}　${ng}`,this.syncMuteBtn(),Je.setBgm("title"),this.refreshContinue()}get mission(){return pi[this.missionIndex]??pi[0]}async waitMs(e){const t=performance.now()+e;for(;performance.now()<t;){for(;this.paused;)await So(40);const n=t-performance.now();if(n<=0)break;await So(Math.min(40,n))}}start(){const e=/(?:^|[?&])shot(?:=|$|&)/.test(location.search)||location.hash.includes("shot"),t=()=>{this.floats=this.floats.filter(s=>performance.now()-s.born<s.life),this.renderer.draw(this.map,this.units,{move:this.phase==="select"?this.moveTiles:new Set,area:this.overlayArea(),hot:this.overlayHot(),areaKind:this.overlayKind(),selected:this.selected,target:this.forecast?.target??null,inspect:this.inspectPos(),phase:this.phase},this.floats)};this.syncUi(),(()=>{if(e){this.renderer.forceSize(390,640),this.renderer.centerOn(this.units,this.map);for(let a=0;a<8;a++)t();const r=document.createElement("img");r.alt="board",r.src=this.renderer.canvas.toDataURL("image/png"),r.style.cssText="position:absolute;left:0;right:0;top:48px;width:100%;height:auto;z-index:1;pointer-events:none",this.renderer.canvas.insertAdjacentElement("afterend",r);return}const s=()=>{t(),requestAnimationFrame(s)};requestAnimationFrame(s)})()}applyHash(){const e=location.hash.replace("#","");if(e==="inv"){this.openBag();return}if(e==="save"){this.openSaves("load");return}if(e==="m3"||e==="play3"){if(this.missionIndex=2,this.resetBattle(),this.title.hidden=!0,e==="m3"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m4"||e==="play4"){if(this.missionIndex=3,this.resetBattle(),this.title.hidden=!0,e==="m4"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m5"||e==="play5"){if(this.missionIndex=4,this.resetBattle(),this.title.hidden=!0,e==="m5"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m2"||e==="play2"||e==="inspect"||e==="play2rot"){if(this.missionIndex=1,this.resetBattle(),this.title.hidden=!0,e==="m2"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin(),e==="play2rot"&&(this.renderer.yaw=Math.PI/2,this.renderer.centerOn(this.units,this.map));const t=this.units.find(n=>n.id==="dana");if(t&&e!=="inspect"&&(t.acted=!0),e==="inspect"){const n=this.units.find(s=>s.id==="beckett")??this.units.find(s=>s.team==="enemy");n&&(this.inspect={kind:"unit",unit:n},this.syncUi())}else{const n=this.units.find(s=>s.id==="mara");n&&this.selectUnit(n)}return}if(e==="play"||e==="brief"){if(this.title.hidden=!0,this.resetBattle(),e==="brief"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();const t=this.units.find(s=>s.id==="mara");t&&this.selectUnit(t);const n=this.units.find(s=>s.id==="dana");n&&(n.acted=!0)}}bindSeg(e,t){const n=xe(e);n.addEventListener("click",s=>{const r=s.target.closest("button");if(!r)return;const a=r.getAttribute("data-v");if(!(a!=="L"&&a!=="M"&&a!=="H")){for(const o of n.querySelectorAll("button"))o.classList.toggle("on",o===r);t(a)}})}inspectPos(){const e=this.inspect;if(!e)return null;if(e.kind==="unit")return{x:e.unit.x,y:e.unit.y};if(e.kind==="object"){const t=this.map.objects.find(n=>n.id===e.id);return t?{x:t.x,y:t.y}:null}return{x:e.tile.x,y:e.tile.y}}fillBriefing(){const e=this.mission;xe("brief-num").textContent=e.number,xe("brief-loc").textContent=e.loc;const t=xe("brief-body");t.innerHTML="";for(const o of e.paragraphs){const l=document.createElement("p");l.textContent=o,t.appendChild(l)}const n=xe("brief-conds");n.innerHTML="";const s=document.createElement("li");s.innerHTML="<span>勝利</span>",s.append(e.winCond);const r=document.createElement("li");r.innerHTML="<span>失敗</span>",r.append(e.loseCond),n.append(s,r);const a=xe("brief-voices");a.innerHTML="";for(const o of e.voices){const l=document.createElement("p"),c=document.createElement("b");c.textContent=o.name,l.append(c,`「${o.line}」`),a.appendChild(l)}this.hudSub.textContent=e.hudSub}resetBattle(){const e=this.mission;this.map=new lr(e.map),this.units=[...vo(e.starts),...e.makeOthers()];for(const t of this.units)Jc(t,this.power);this.phase="briefing",this.turn=1,this.clearSel(),this.inspect=null,this.busy=!1,this.loseKind="wipe",this.pendingItem=null,this.log="點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放並旋轉，上下俯仰。",this.renderer.yaw=0,this.renderer.setPitch(es),this.renderer.centerOn(this.units,this.map),this.fillBriefing()}newGame(){this.missionIndex=0,this.inventory=qt(gi),this.missionStartInventory=qt(gi),this.m1DropGiven=!1,this.resetBattle(),this.title.hidden=!0,this.briefing.hidden=!1,this.phase="briefing",Je.setBgm("title"),this.syncUi(),this.autosave()}continueGame(){const e=Nl(jn());e&&this.applySave(e)}begin(){this.missionStartInventory=qt(this.inventory),this.briefing.hidden=!0,this.title.hidden=!0,this.phase="select",Je.setBgm("battle"),this.renderer.centerOn(this.units,this.map),this.syncUi(),this.autosave()}restart(){this.inventory=qt(this.missionStartInventory),this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi()}nextMission(){this.missionIndex>=pi.length-1||(this.missionIndex+=1,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi(),this.autosave())}rotateMap(){this.phase==="briefing"||this.phase==="title"||(this.renderer.rotate(this.map),this.yawSlider.value=String(Math.round((this.renderer.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*100)))}clearSel(){this.selected=null,this.origin=null,this.field=null,this.moveTiles.clear(),this.actionTiles.clear(),this.skillTiles.clear(),this.areaTiles.clear(),this.areaKind=null,this.forecast=null,this.pendingItem=null}locked(){const e=this.selected;return!!e&&e.movedThisTurn}selectUnit(e){e.team!=="player"||e.acted||e.dead||e.npc||(this.selected=e,e.movedThisTurn||(this.origin=null),this.forecast=null,this.inspect=null,this.pendingItem=null,this.showCommand(e))}refreshRanges(e){if(this.skillTiles.clear(),e.movedThisTurn?(this.field=null,this.moveTiles.clear()):(this.field=rs(e,this.map,this.units),this.moveTiles=new Set([...this.field.cost.keys()].filter(t=>t!==qe(e.x,e.y)))),e.actedThisTurn)this.actionTiles=new Set,this.areaTiles=new Set,this.areaKind=null;else{this.actionTiles=th(e,this.map,this.units);for(const t of this.map.objects)t.gone||t.kind!=="destructible"||Ui(e,e.x,e.y,t.x,t.y,this.map)&&this.actionTiles.add(qe(t.x,t.y));this.areaTiles=Ds(e,this.map),this.areaKind="attack"}}overlayArea(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"?this.areaTiles:new Set}overlayHot(){return this.phase==="itemAim"?this.skillTiles:this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?this.skillTiles:this.phase==="select"||this.phase==="forecast"?this.actionTiles:new Set}overlayKind(){return this.phase==="itemAim"?"item":this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?"skill":this.phase==="select"||this.phase==="forecast"?this.areaKind:null}showCommand(e){this.refreshRanges(e),this.phase="select";const t=[];e.movedThisTurn||t.push("可移動"),e.actedThisTurn||t.push("可攻擊／技能／道具"),this.log=t.length?t.join("　"):"結束或待機",this.syncUi()}async commitMove(e){const t=this.selected;if(!t||!this.field||this.busy||t.movedThisTurn)return;const n=qe(e.x,e.y);if(!this.field.cost.has(n)||e.x===t.x&&e.y===t.y)return;this.busy=!0,Je.play("move"),this.origin={x:t.x,y:t.y},this.originDir=t.dir;const s=Xn(this.field,e);t.anim="walk",t.animStart=performance.now();for(let r=1;r<s.length;r++)t.dir=Vi(s[r-1],s[r]),t.x=s[r].x,t.y=s[r].y,await this.waitMs(90);if(t.anim="idle",t.movedThisTurn=!0,this.tryPickup(t),this.busy=!1,t.actedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}onTap(e){if(this.busy||this.pauseOpen||this.phase==="title"||this.phase==="briefing"||this.phase==="enemy"||this.phase==="victory"||this.phase==="defeat")return;const t=this.renderer.hitTile(e.x,e.y,this.map);if(this.phase==="forecast"){(!t||this.forecast&&(t.x!==this.forecast.target.x||t.y!==this.forecast.target.y))&&this.backFromForecast();return}if(this.phase==="skillAim"){t?this.trySkillTarget(t):this.backFromSkill();return}if(this.phase==="itemAim"){t?this.tryItemTarget(t):this.backFromItem();return}if(this.phase!=="select")return;if(!t){if(this.inspect){this.inspect=null,this.syncUi();return}this.selected&&!this.locked()&&(this.clearSel(),this.syncUi());return}const n=this.unitAt(t.x,t.y),s=this.selected,r=this.map.objAt(t.x,t.y);if(s&&!s.actedThisTurn&&n&&this.actionTiles.has(qe(n.x,n.y))){this.forecast=Yr(s,n,this.map),this.phase="forecast",this.log=this.forecast.detail,this.inspect=null,this.syncUi();return}if(s&&!s.actedThisTurn&&r&&!r.gone&&r.kind==="destructible"&&this.actionTiles.has(qe(r.x,r.y))){this.forecast={kind:"object",actor:s,target:s,label:`${s.name} → ${r.label}`,detail:r.type==="barrel"?`破壞油桶　鄰格受到 ${or} 傷害`:"破壞此物",dmg:Math.max(1,s.atk+(s.atkBuff||0)),heal:0,skip:!1,face:"front",objectId:r.id},this.phase="forecast",this.log=this.forecast.detail,this.inspect=null,this.syncUi();return}if(s&&r&&!r.gone&&Math.abs(s.x-r.x)+Math.abs(s.y-r.y)<=1){if(r.kind==="pickup"){this.tryPickupAt(s,r);return}if(r.kind==="trigger"&&!r.used&&!s.actedThisTurn){this.useTrigger(s,r);return}}if(s&&!s.movedThisTurn&&this.moveTiles.has(qe(t.x,t.y))&&(!n||n.id===s.id)){if(n&&n.id===s.id){this.inspectUnit(n);return}this.inspect=null,this.commitMove(t);return}if(n&&n.team==="player"&&!n.acted&&!n.npc&&(!s||!this.locked())){this.selectUnit(n);return}n?this.inspectUnit(n):r&&!r.gone?this.inspectObject(r.id):this.inspectTile(this.map.tile(t.x,t.y))}inspectUnit(e){this.inspect={kind:"unit",unit:e},this.log=`${e.name}　${Ol[Wn(e)]}`,this.syncUi()}inspectTile(e){this.inspect={kind:"tile",tile:e},this.log=Wr[e.terrain],this.syncUi()}inspectObject(e){this.inspect={kind:"object",id:e};const t=this.map.objects.find(n=>n.id===e);this.log=t?t.label:"",this.syncUi()}trySkillTarget(e){const t=this.selected;if(!t)return;const s=qr(t,this.map,this.units).find(r=>r.x===e.x&&r.y===e.y);if(!s){Je.play("miss"),this.backFromSkill();return}this.forecast=Eo(t,s,this.map),this.phase="forecast",this.log=this.forecast.detail,this.syncUi()}tryItemTarget(e){const t=ar(this.units).find(n=>n.x===e.x&&n.y===e.y);if(!t){Je.play("miss"),this.backFromItem();return}this.applyItem(t)}backFromForecast(){if(this.selected){if(this.skillTiles.size&&this.forecast?.kind==="skill"){this.forecast=null,this.phase="skillAim",this.syncUi();return}this.forecast=null,this.showCommand(this.selected)}}backFromSkill(){this.skillTiles.clear(),this.forecast=null,this.selected&&this.showCommand(this.selected)}backFromItem(){this.pendingItem=null,this.skillTiles.clear(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}cancel(){if(!this.busy){if(this.phase==="forecast"){this.backFromForecast();return}if(this.phase==="skillAim"){this.backFromSkill();return}if(this.phase==="itemAim"){this.backFromItem();return}if(this.inspect){this.inspect=null,this.syncUi();return}if(this.selected&&this.origin&&this.selected.movedThisTurn){this.selected.x=this.origin.x,this.selected.y=this.origin.y,this.selected.dir=this.originDir,this.selected.movedThisTurn=!1,this.origin=null,this.showCommand(this.selected);return}this.selected&&!this.locked()&&(this.clearSel(),this.phase="select",this.syncUi())}}armSkill(){const e=this.selected;if(!e||this.busy||e.skillUsed||!e.skillName||e.actedThisTurn||this.phase!=="select"&&this.phase!=="skillAim")return;const t=qr(e,this.map,this.units);this.skillTiles=new Set(t.map(n=>qe(n.x,n.y))),this.areaTiles=nh(e,this.map),this.areaKind="skill",this.actionTiles.clear(),this.moveTiles.clear(),this.forecast=null,this.inspect=null,this.phase="skillAim",this.log=e.skillHint,this.syncUi()}async wait(){!this.selected||this.busy||this.phase==="select"&&await this.finishUnit()}async confirm(){if(this.phase!=="forecast"||!this.forecast||this.busy)return;const e=this.forecast;this.busy=!0;const t=e.actor;if(e.kind==="object"&&e.objectId){const r=this.map.objects.find(a=>a.id===e.objectId);if(!r||r.gone){this.busy=!1,this.showCommand(t);return}if(t.dir=Vi(t,r),t.anim="attack",t.animStart=performance.now(),t.lunge=1,Je.play("attack"),await this.waitMs(Hs),r.hp=Math.max(0,r.hp-e.dmg),Je.play("hit"),this.spawnFloat(t,`${e.dmg}`,"#ffd0d8"),this.log=`${t.name} 攻擊 ${r.label}`,t.atkBuff&&(t.atkBuff=0),r.hp<=0&&(r.gone=!0,this.log=`${r.label} 被破壞。`,r.type==="barrel"&&this.blastBarrel(r.x,r.y)),t.actedThisTurn=!0,t.lunge=0,t.anim="idle",this.busy=!1,this.checkEnd())return;if(t.movedThisTurn){await this.finishUnit();return}this.forecast=null,this.showCommand(t),this.autosave();return}const n=e.target;n.stance==="neutral"&&!e.heal&&bo(n),t.dir=Vi(t,n);const s=e.kind==="skill"&&(t.skillKind==="spark"||t.skillKind==="heal"||t.skillKind==="halt");if(t.anim=s?"cast":"attack",t.animStart=performance.now(),t.lunge=1,e.heal?Je.play("heal"):Je.play(e.kind==="skill"?"skill":"attack"),await this.waitMs(s?zs:Hs),e.heal?(n.hp=Math.min(n.maxHp,n.hp+e.heal),this.spawnFloat(n,`+${e.heal}`,"#7dffb3"),this.log=`${t.name} 為 ${n.name} 回復 ${e.heal}`):(n.hp=Math.max(0,n.hp-e.dmg),Je.play("hit"),this.spawnFloat(n,`${e.dmg}`,"#ffd0d8"),this.log=`${t.name} 對 ${n.name} 造成 ${e.dmg} 傷害`,t.atkBuff&&(t.atkBuff=0),e.skip&&(n.skipNext=!0,this.log+="　攔住生效"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 倒下。`,this.tryEnemyDrop(n))),e.kind==="skill"&&(t.skillUsed=!0),t.actedThisTurn=!0,t.lunge=0,t.anim="idle",await this.waitMs(160),this.busy=!1,!this.checkEnd()){if(t.movedThisTurn){await this.finishUnit();return}this.forecast=null,this.skillTiles.clear(),this.showCommand(t),this.autosave()}}async finishUnit(){this.selected&&(this.selected.acted=!0,this.selected.lunge=0),this.clearSel(),this.inspect=null,this.phase="select",this.syncUi(),this.autosave(),this.units.filter(e=>e.team==="player"&&!e.dead&&!e.acted&&!e.npc).length===0&&await this.endTurn()}async endTurn(){if(!this.busy){for(const e of this.units)e.team==="player"&&!e.dead&&!e.npc&&(e.acted=!0);this.clearSel(),this.inspect=null,this.phase="enemy",this.log="敵軍行動中",this.syncUi(),await this.runEnemy()}}async runEnemy(){this.busy=!0;const e=this.units.filter(n=>!n.dead&&!Qc(n)),t=this.mission.protectId;for(const n of e){if(this.phase==="victory"||this.phase==="defeat")break;if(n.skipNext){n.skipNext=!1,n.acted=!0,this.log=`${n.name} 被攔住，無法行動。`,this.syncUi(),await this.waitMs(420);continue}const s=sh(n,this.map,this.units,t,this.intel);s.path.length>1&&(n.anim="walk",n.animStart=performance.now());for(let r=1;r<s.path.length;r++)n.dir=Vi(s.path[r-1],s.path[r]),n.x=s.path[r].x,n.y=s.path[r].y,await this.waitMs(85);if(n.anim="idle",this.tryPickup(n),s.target&&!s.target.dead){n.dir=Vi(n,s.target);const r=s.useSkill&&!n.skillUsed?Eo(n,s.target,this.map):Yr(n,s.target,this.map),a=r.kind==="skill"&&(n.skillKind==="spark"||n.skillKind==="heal"||n.skillKind==="halt");if(n.anim=a?"cast":"attack",n.animStart=performance.now(),n.lunge=1,Je.play(r.kind==="skill"?"skill":"attack"),await this.waitMs(a?zs:Hs),r.heal?(s.target.hp=Math.min(s.target.maxHp,s.target.hp+r.heal),this.spawnFloat(s.target,`+${r.heal}`,"#7dffb3"),this.log=`${n.name} 為 ${s.target.name} 回復 ${r.heal}`):(s.target.stance==="neutral"&&bo(s.target),s.target.hp=Math.max(0,s.target.hp-r.dmg),Je.play("hit"),this.spawnFloat(s.target,`${r.dmg}`,"#ff4d6d"),this.log=`${n.name} 對 ${s.target.name} 造成 ${r.dmg} 傷害`,r.skip&&(s.target.skipNext=!0),s.target.hp<=0&&(s.target.dead=!0,this.log=`${s.target.name} 倒下。`,this.tryEnemyDrop(s.target))),r.kind==="skill"&&(n.skillUsed=!0),await this.waitMs(120),n.lunge=0,n.anim="idle",this.checkEnd()){this.busy=!1;return}}else await this.waitMs(80);n.acted=!0}for(const n of this.units)n.acted=!1,n.skillUsed=!1,n.movedThisTurn=!1,n.actedThisTurn=!1,n.anim="idle";this.turn+=1,this.phase="select",this.busy=!1,this.log="我軍階段",this.syncUi(),this.autosave()}checkEnd(){const e=this.mission.protectId;return e&&this.units.find(s=>s.id===e)?.dead?(this.loseKind="protect",this.lose(),!0):this.units.find(n=>n.id===this.mission.eliteId)?.dead?(this.win(),!0):this.units.every(n=>n.team!=="player"||n.dead||n.npc)?(this.loseKind="wipe",this.lose(),!0):!1}win(){const e=this.mission;this.phase="victory",this.busy=!1,this.closePause(),Je.setBgm(null),Je.play("victory"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.remove("lose"),this.resultKicker.textContent="勝利",this.resultTitle.textContent=e.winTitle;let t=e.winBody;this.missionIndex===0&&!this.m1DropGiven&&(rr(this.inventory,"bandage",1),this.m1DropGiven=!0,t=`${e.winBody}　又找到一盒繃帶。`),this.resultBody.textContent=t,this.btnNext.hidden=this.missionIndex>=pi.length-1,this.syncUi(),this.autosave()}lose(){const e=this.mission;this.phase="defeat",this.busy=!1,this.closePause(),Je.setBgm(null),Je.play("defeat"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.add("lose"),this.resultKicker.textContent="失敗",this.loseKind==="protect"?(this.resultTitle.textContent=e.protectLoseTitle,this.resultBody.textContent=e.protectLoseBody):(this.resultTitle.textContent=e.loseTitle,this.resultBody.textContent=e.loseBody),this.btnNext.hidden=!0,this.syncUi(),this.autosave()}unitAt(e,t){return this.units.find(n=>!n.dead&&n.x===e&&n.y===t)}tryPickup(e){const t=this.map.objAt(e.x,e.y);!t||t.gone||t.kind!=="pickup"||this.collectPickup(e,t)}tryPickupAt(e,t){const n=this.map.objects.find(s=>s.id===t.id);!n||n.gone||n.kind!=="pickup"||this.collectPickup(e,n)}collectPickup(e,t){const n=t.item??"bandage";rr(this.inventory,n,1)>0?(this.spawnFloat(e,`取得 ${mi[n].name}`,"#ffe08a"),this.log=`${e.name} 取得 ${mi[n].name}`):this.log="背包已滿。",t.gone=!0,this.syncUi(),this.autosave()}async useTrigger(e,t){if(!(this.busy||e.actedThisTurn||t.used)){this.busy=!0,e.anim="cast",e.animStart=performance.now(),Je.play("skill"),await this.waitMs(zs),t.used=!0,t.type==="van"&&(t.gone=!0);for(const[n,s]of t.unblock)this.map.unblock(n,s);if(t.healAdj)for(const n of this.units)n.dead||Math.abs(n.x-t.x)+Math.abs(n.y-t.y)>1||n.stance!=="friendly"&&n.team!=="player"||(n.hp=Math.min(n.maxHp,n.hp+t.healAdj),this.spawnFloat(n,`+${t.healAdj}`,"#7dffb3"));if(this.log=t.type==="van"?"貨車門打開了。":"開關啟動。",e.actedThisTurn=!0,e.anim="idle",this.busy=!1,e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}blastBarrel(e,t){Je.play("hit");for(const n of this.units)n.dead||Math.abs(n.x-e)+Math.abs(n.y-t)===1&&(n.hp=Math.max(0,n.hp-or),this.spawnFloat(n,`${or}`,"#ff9a3c"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 被爆炸波及。`,this.tryEnemyDrop(n)))}spawnFloat(e,t,n){this.floats.push({x:e.x,y:e.y,text:t,color:n,born:performance.now(),life:900})}tryEnemyDrop(e){if(e.team!=="enemy")return;const t=e.role==="elite"?.62:.35;if(Math.random()>=t)return;const s=(Math.random()<.65?"bandage":"stim")==="bandage"?["bandage","stim"]:["stim","bandage"];for(const r of s)if(rr(this.inventory,r,1)>0){this.spawnFloat(e,`掉落 ${mi[r].name}`,"#ffe08a");return}}jumpToMission(e){e<0||e>=pi.length||(this.pendingJump=null,this.inventory=qt(gi),this.missionStartInventory=qt(gi),this.m1DropGiven=!1,this.missionIndex=e,this.closePause(),this.closeModal(),this.result.hidden=!0,this.result.classList.remove("lose"),this.title.hidden=!0,this.briefing.hidden=!1,this.resetBattle(),this.phase="briefing",this.syncUi())}requestNextMission(){this.missionIndex>=pi.length-1||this.busy||(this.pendingJump=this.missionIndex+1,this.confirmText.textContent="跳到測試關卡 "+String((this.pendingJump??0)+1)+"？目前戰鬥不會保留。",this.confirmEl.hidden=!1)}openPause(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||(this.paused=!0,this.pauseOpen=!0,this.pauseEl.hidden=!1,this.syncMuteBtn(),Je.play("pause"))}closePause(){this.pauseEl.hidden=!0,this.pauseOpen=!1,this.paused=!1}toggleMute(){Je.toggleMute(),this.syncMuteBtn()}syncMuteBtn(){this.btnMute.textContent=Je.muted?"取消靜音":"靜音"}quitToTitle(){if(!(this.playable()||this.phase==="enemy")){this.goTitle();return}this.pendingQuit=!0,this.confirmText.textContent="返回標題？進度在存檔與自動存檔裡。",this.confirmEl.hidden=!1}goTitle(){this.pendingQuit=!1,this.closePause(),this.closeModal(),this.confirmEl.hidden=!0,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!0,this.title.hidden=!1,this.phase="title",this.busy=!1,this.clearSel(),this.inspect=null,Je.setBgm("title"),this.refreshContinue(),this.syncUi()}async refreshApp(){const e=xe("btn-refresh");e.disabled=!0,e.textContent="正在更新…";try{if("caches"in window){const n=await caches.keys();await Promise.all(n.map(s=>caches.delete(s)))}}catch{}try{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations();for(const s of n){s.waiting&&s.waiting.postMessage("skipWaiting");try{await s.update()}catch{}s.waiting&&s.waiting.postMessage("skipWaiting"),await s.unregister()}}}catch{}const t=new URL(location.href);t.searchParams.set("v",Fl),t.searchParams.set("r",String(Date.now())),location.replace(t.toString())}playable(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"||this.phase==="itemAim"}openBagFromHud(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||this.openBag()}openBag(){this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind="bag",this.modal.hidden=!1,this.modalKicker.textContent="道具",this.modalTitle.textContent="背包",this.paintBag()}paintBag(){this.modalBody.innerHTML="";const e=this.playable()&&!!this.selected&&!this.selected.actedThisTurn&&!this.busy;if(!this.inventory.length){const t=document.createElement("p");t.textContent="沒有道具。",this.modalBody.appendChild(t);return}if(this.playable()&&!this.selected){const t=document.createElement("p");t.textContent="先選單位再用道具。",this.modalBody.appendChild(t)}for(const t of this.inventory){const n=mi[t.id],s=document.createElement("div");s.className="item-row";const r=document.createElement("div"),a=document.createElement("b");a.textContent=`${n.name} ×${t.qty}`;const o=document.createElement("span");if(o.textContent=n.hint,r.append(a,o),s.appendChild(r),this.playable()){const l=document.createElement("button");l.type="button",l.className="use",l.dataset.item=t.id,l.textContent="使用",l.disabled=!e,s.appendChild(l)}this.modalBody.appendChild(s)}}openSaves(e){this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind=e,this.modal.hidden=!1,this.modalKicker.textContent=e==="save"?"存檔":"讀檔",this.modalTitle.textContent=e==="save"?"存檔":"讀檔",this.paintSaves()}paintSaves(){const e=jn();this.modalBody.innerHTML="";for(let t=0;t<Pc;t++){const n=e.slots[t],s=document.createElement("button");s.type="button",s.className=n?"slot":"slot empty",s.dataset.slot=String(t);const r=document.createElement("div"),a=document.createElement("b");a.textContent=`檔案 ${t+1}`;const o=document.createElement("span");o.textContent=n?`${n.missionName}　${tg(n.savedAt)}`:"空",r.append(a,o),s.appendChild(r),this.modalBody.appendChild(s)}}onModalClick(e){const t=e.target,n=t.closest("button.use");if(n&&this.modalKind==="bag"){const a=n.dataset.item;(a==="bandage"||a==="stim")&&this.armItem(a);return}const s=t.closest("button.ally-row");if(s&&this.modalKind==="target"){const a=s.dataset.uid,o=this.units.find(l=>l.id===a);o&&this.applyItem(o);return}const r=t.closest("button.slot");if(r&&(this.modalKind==="save"||this.modalKind==="load")){const a=Number(r.dataset.slot);this.modalKind==="load"?this.loadSlot(a):this.trySaveSlot(a)}}armItem(e){const t=this.selected;if(!t||t.actedThisTurn||this.busy){this.log="先選單位再用道具。",this.syncUi();return}this.pendingItem=e,this.closePause(),this.closeModal(),this.inspect=null,this.forecast=null,this.moveTiles.clear(),this.actionTiles.clear(),this.areaTiles.clear(),this.areaKind="item";const n=ar(this.units);this.skillTiles=new Set(n.map(s=>qe(s.x,s.y))),this.phase="itemAim",this.log=`${mi[e].name}　選我軍單位`,this.syncUi(),this.modalKind="target",this.modal.hidden=!1,this.modalKicker.textContent=mi[e].name,this.modalTitle.textContent="選擇對象",this.modalBody.innerHTML="";for(const s of n){const r=document.createElement("button");r.type="button",r.className="ally-row",r.dataset.uid=s.id;const a=document.createElement("div"),o=document.createElement("b");o.textContent=s.name;const l=document.createElement("span");l.textContent=`生命 ${s.hp}/${s.maxHp}`,a.append(o,l),r.appendChild(a),this.modalBody.appendChild(r)}}async applyItem(e){const t=this.selected,n=this.pendingItem;if(!(!t||!n||t.actedThisTurn||this.busy)&&ar(this.units).some(s=>s.id===e.id)&&fh(this.inventory,n)){if(this.closeModal(),this.busy=!0,Je.play("heal"),n==="bandage"){const s=Math.min(To,e.maxHp-e.hp);e.hp=Math.min(e.maxHp,e.hp+To),this.spawnFloat(e,`+${Math.max(s,0)}`,"#7dffb3"),this.log=`${t.name} 對 ${e.name} 使用繃帶`}else e.atkBuff=hh,this.spawnFloat(e,"+ATK","#ffc857"),this.log=`${t.name} 對 ${e.name} 使用提神　下次攻擊 +5`;if(t.actedThisTurn=!0,this.pendingItem=null,this.skillTiles.clear(),await this.waitMs(220),this.busy=!1,t.movedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}}closeModal(){this.modal.hidden=!0,this.modalKind="off",this.modalBody.innerHTML="",this.pauseOpen&&(this.pauseEl.hidden=!1)}trySaveSlot(e){if(jn().slots[e]){this.pendingSlot=e,this.confirmText.textContent=`覆蓋檔案 ${e+1}？`,this.confirmEl.hidden=!1;return}this.writeSlot(e)}confirmYes(){if(this.confirmEl.hidden=!0,this.pendingQuit){this.pendingQuit=!1,this.goTitle();return}if(this.pendingJump!==null){const e=this.pendingJump;this.pendingJump=null,this.jumpToMission(e);return}this.pendingSlot!==null&&this.writeSlot(this.pendingSlot),this.pendingSlot=null}confirmNo(){this.confirmEl.hidden=!0,this.pendingSlot=null,this.pendingQuit=!1,this.pendingJump=null}writeSlot(e){const t=jn();t.slots[e]=this.captureSave(),Ul(t),this.pendingSlot=null,this.log=`已存到檔案 ${e+1}`,this.closeModal(),this.refreshContinue(),this.syncUi()}loadSlot(e){const n=jn().slots[e];n&&(this.closeModal(),this.closePause(),this.applySave(n))}captureSave(){const e=this.playable()||this.phase==="enemy";return{v:1,savedAt:Date.now(),missionIndex:this.missionIndex,missionName:e?`${this.mission.number}　戰鬥中`:this.mission.number,phase:this.phase==="enemy"||this.phase==="itemAim"||this.phase==="skillAim"||this.phase==="forecast"?"select":this.phase,turn:this.turn,intel:this.intel,power:this.power,inventory:qt(this.inventory),units:this.units.map(t=>this.packUnit(t)),cam:{...this.renderer.cam},yaw:this.renderer.yaw,pitch:this.renderer.pitch,log:this.log,selectedId:this.selected&&e?this.selected.id:null,origin:this.origin?{...this.origin}:null,originDir:this.originDir,m1DropGiven:this.m1DropGiven,missionStartInventory:qt(this.missionStartInventory),objects:this.map.objects.map(t=>({id:t.id,hp:t.hp,gone:t.gone,used:t.used}))}}packUnit(e){return{id:e.id,x:e.x,y:e.y,hp:e.hp,maxHp:e.maxHp,atk:e.atk,def:e.def,dir:e.dir,acted:e.acted,skillUsed:e.skillUsed,skipNext:e.skipNext,dead:e.dead,movedThisTurn:e.movedThisTurn,actedThisTurn:e.actedThisTurn,atkBuff:e.atkBuff,team:e.team,stance:e.stance,behaviour:e.behaviour,archetype:e.archetype,gender:e.gender,skillKind:e.skillKind,rangeMin:e.rangeMin,rangeMax:e.rangeMax}}applySave(e){if(this.missionIndex=e.missionIndex,this.intel=e.intel,this.power=e.power,this.inventory=qt(e.inventory),this.missionStartInventory=qt(e.missionStartInventory??e.inventory),this.m1DropGiven=e.m1DropGiven,this.turn=e.turn,this.log=e.log,this.setSeg("seg-intel",e.intel),this.setSeg("seg-power",e.power),this.map=new lr(this.mission.map),e.objects)for(const r of e.objects){const a=this.map.objects.find(o=>o.id===r.id);if(a&&(a.hp=r.hp,a.gone=r.gone,a.used=r.used,a.used)){for(const[o,l]of a.unblock)this.map.unblock(o,l);a.type==="van"&&(a.gone=!0)}}const t=[...vo(this.mission.starts),...this.mission.makeOthers()],n=new Map(t.map(r=>[r.id,r]));this.units=[];for(const r of e.units){const a=n.get(r.id);a&&this.units.push({...a,...r})}this.renderer.cam={...e.cam},this.renderer.yaw=e.yaw,this.renderer.setPitch(e.pitch??es),this.yawSlider.value=String(Math.round((e.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*100)),this.pitchSlider.value=String(Math.round(this.renderer.pitch)),this.clearSel(),this.inspect=null,this.busy=!1,this.pendingItem=null,this.fillBriefing(),this.result.hidden=!0,this.result.classList.remove("lose"),this.confirmEl.hidden=!0;const s=e.phase;if(this.phase=s,s==="title")this.title.hidden=!1,this.briefing.hidden=!0;else if(s==="briefing")this.title.hidden=!0,this.briefing.hidden=!1;else if(s==="victory"||s==="defeat")this.title.hidden=!0,this.briefing.hidden=!0,this.result.hidden=!1,s==="defeat"&&this.result.classList.add("lose");else if(this.title.hidden=!0,this.briefing.hidden=!0,this.phase="select",e.selectedId){const r=this.units.find(a=>a.id===e.selectedId);r&&!r.dead&&!r.acted&&!r.npc&&(this.selected=r,this.origin=e.origin,this.originDir=e.originDir,this.refreshRanges(r))}this.closePause(),this.phase==="title"||this.phase==="briefing"?Je.setBgm("title"):this.phase==="victory"||this.phase==="defeat"?Je.setBgm(null):Je.setBgm("battle"),this.refreshContinue(),this.syncUi()}setSeg(e,t){const n=xe(e);for(const s of n.querySelectorAll("button"))s.classList.toggle("on",s.getAttribute("data-v")===t)}autosave(){if(this.phase==="title")return;const e=jn();e.autosave=this.captureSave(),Ul(e),this.refreshContinue()}refreshContinue(){this.btnContinue.disabled=!Nl(jn())}paintUnitChip(e,t){this.chip.hidden=!1,this.chipHp.hidden=!1;const n=`${Ol[Wn(e)]}${e.npc?"　保護":""}`;this.chipName.textContent=`${e.name}　${e.title}`;const s=e.atkBuff?`　攻擊+${e.atkBuff}`:"";this.chipMeta.textContent=`${n}　${ig[e.role]}　生命 ${e.hp}/${e.maxHp}　攻擊 ${e.atk}　防禦 ${e.def}　移動 ${e.mov}　跳躍 ${e.jmp}${s}`,this.chipHpFill.style.width=`${100*e.hp/e.maxHp}%`,this.chipMark.style.background=Bl(e),e.skillName?(this.chipExtra.hidden=!1,this.chipExtra.textContent=`${e.skillName}　${e.skillHint}`):(this.chipExtra.hidden=!t,this.chipExtra.textContent=t?"無技能":"",t||(this.chipExtra.hidden=!0))}paintObjectChip(e){const t=this.map.objects.find(s=>s.id===e);if(this.chip.hidden=!1,!t){this.chip.hidden=!0;return}this.chipHp.hidden=t.kind!=="destructible",this.chipName.textContent=t.label;const n=t.kind==="pickup"?"拾取":t.kind==="trigger"?"啟動":t.kind==="destructible"?"可破壞":"可站上";this.chipMeta.textContent=`${n}　${t.used?"已使用":"未使用"}`,t.kind==="destructible"&&(this.chipHpFill.style.width=`${100*t.hp/t.maxHp}%`),this.chipExtra.hidden=!1,this.chipExtra.textContent=t.kind==="pickup"?"靠近或走到此格可放入背包。":t.kind==="trigger"?"相鄰時可啟動。消耗行動。":t.kind==="destructible"?"攻擊可破壞。油桶爆炸會波及鄰格。":"走到此格可站上，高度較高。",this.chipMark.style.background=t.kind==="destructible"?"#ff4d6d":"#ffc857"}paintTileChip(e){this.chip.hidden=!1,this.chipHp.hidden=!0,this.chipName.textContent=Wr[e.terrain];const t=[`高度 ${e.h}`,e.blocked?"阻擋":"可走",Wr[e.terrain]];e.prop&&t.push(sg[e.prop]),this.chipMeta.textContent=t.join("　"),this.chipExtra.hidden=!1,this.chipExtra.textContent=e.blocked?"無法站上此格。":"可以走。",this.chipMark.style.background=e.blocked?"#ff4d6d":"#3ef0d0"}syncUi(){this.hudTurn.textContent=`回合 ${this.turn}`,this.hudPhase.textContent=this.phase==="enemy"?"敵軍":this.phase==="victory"?"勝利":this.phase==="defeat"?"失敗":this.phase==="title"?"選單":"我軍",this.hudSub.textContent=`${this.mission.hudSub}　智 ${yo[this.intel]}　力 ${yo[this.power]}`,this.logEl.textContent=this.log;const e=this.playable(),t=this.selected;if(this.inspect&&e?this.inspect.kind==="unit"?this.paintUnitChip(this.inspect.unit,!0):this.inspect.kind==="object"?this.paintObjectChip(this.inspect.id):this.paintTileChip(this.inspect.tile):t&&e?this.paintUnitChip(t,!1):this.chip.hidden=!0,this.forecast&&this.phase==="forecast"){this.forecastEl.hidden=!1;const l=this.forecast.heal?"good":"bad";this.forecastEl.innerHTML=`<div><b>${this.forecast.label}</b></div><div class="${l}">${this.forecast.detail}</div><div>點確認出手，取消返回。</div>`}else this.forecastEl.hidden=!0;const n=!!t&&this.phase==="select";this.btnCancel.disabled=!t&&!this.inspect&&this.phase!=="itemAim"||this.phase==="enemy"||this.busy,this.btnWait.disabled=!n||this.busy,this.btnWait.textContent=t&&(t.movedThisTurn||t.actedThisTurn)?"結束":"待機",this.btnSkill.disabled=!t||!t.skillName||t.skillUsed||t.actedThisTurn||this.busy||this.phase!=="select"&&this.phase!=="skillAim",this.btnSkill.classList.toggle("armed",this.phase==="skillAim"),this.btnConfirm.disabled=this.phase!=="forecast"||this.busy;const s=this.units.some(l=>l.team==="player"&&!l.dead&&!l.acted&&!l.npc),r=this.phase==="enemy"||this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat",a=this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat";this.btnEnd.hidden=!s||r,this.btnRotate.hidden=r,this.btnPause.hidden=a,this.btnBag.hidden=a,this.camHint.hidden=r;const o=window.matchMedia("(pointer: fine)").matches;this.yawSlider.hidden=r||!o,this.pitchSlider.hidden=r||!o,this.pitchSlider.value=String(Math.round(this.renderer.pitch)),this.refreshContinue()}}const Ic=document.getElementById("board");if(!(Ic instanceof HTMLCanvasElement))throw new Error("board");document.addEventListener("pointerdown",()=>{Je.unlock()},{capture:!0});document.addEventListener("click",i=>{i.target.closest("button")&&Je.play("ui")},!0);const Dc=new rg(Ic);Dc.applyHash();Dc.start();const ag=location.search.includes("shot");"serviceWorker"in navigator&&!ag&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})});
