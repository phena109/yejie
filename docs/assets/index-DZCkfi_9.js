var fu=Object.defineProperty;var du=(i,t,e)=>t in i?fu(i,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):i[t]=e;var k=(i,t,e)=>du(i,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();const Qc="yejie-mute";function pu(){try{return localStorage.getItem(Qc)==="1"}catch{return!1}}class mu{constructor(){k(this,"muted",pu());k(this,"ctx",null);k(this,"master",null);k(this,"sfxGain",null);k(this,"bgmGain",null);k(this,"unlocked",!1);k(this,"wanted",null);k(this,"playing",null);k(this,"timer",0);k(this,"beat",0)}unlock(){if(this.unlocked&&this.ctx&&this.ctx.state==="running")return;const t=window.AudioContext||window.webkitAudioContext;t&&(this.ctx||(this.ctx=new t,this.master=this.ctx.createGain(),this.master.gain.value=.32,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.7,this.sfxGain.connect(this.master),this.bgmGain=this.ctx.createGain(),this.bgmGain.gain.value=this.muted?0:.22,this.bgmGain.connect(this.master)),this.ctx.resume(),this.unlocked=!0,this.applyMute(),this.wanted&&this.setBgm(this.wanted))}setMuted(t){this.muted=t;try{localStorage.setItem(Qc,t?"1":"0")}catch{}this.applyMute()}toggleMute(){return this.setMuted(!this.muted),this.muted}applyMute(){this.sfxGain&&(this.sfxGain.gain.value=this.muted?0:.7),this.bgmGain&&(this.bgmGain.gain.value=this.muted?0:.22)}play(t){if(this.unlock(),!this.ctx||!this.sfxGain||this.muted)return;const e=this.ctx.currentTime;switch(t){case"ui":this.blip(880,.045,.11,"sine",e);break;case"move":this.noise(.05,.06,e,900),this.blip(180,.06,.08,"triangle",e);break;case"attack":this.noise(.1,.1,e,700),this.sweep(420,160,.12,.12,e);break;case"hit":this.blip(140,.09,.16,"square",e),this.noise(.08,.12,e,400);break;case"miss":this.sweep(480,220,.14,.07,e),this.blip(210,.1,.05,"sine",e+.04);break;case"skill":this.blip(520,.08,.1,"square",e),this.blip(780,.1,.1,"sine",e+.06),this.blip(1040,.12,.08,"sine",e+.12);break;case"heal":this.blip(392,.1,.09,"sine",e),this.blip(494,.12,.1,"sine",e+.08),this.blip(587,.16,.1,"sine",e+.16);break;case"victory":this.blip(523,.14,.12,"square",e),this.blip(659,.16,.12,"square",e+.12),this.blip(784,.28,.14,"square",e+.24);break;case"defeat":this.blip(330,.18,.12,"sawtooth",e),this.blip(247,.22,.12,"sawtooth",e+.16),this.blip(165,.4,.14,"sine",e+.32);break;case"pause":this.blip(220,.1,.08,"triangle",e),this.blip(165,.16,.08,"triangle",e+.1);break}}setBgm(t){if(this.wanted=t,t===this.playing||(this.stopBgm(),this.playing=t,!t||!this.unlocked||!this.ctx))return;this.beat=0;const e=t==="battle"?280:520,n=()=>{if(this.playing!==t||!this.ctx||!this.bgmGain)return;const s=this.ctx.currentTime;t==="title"?this.titleBeat(s):this.battleBeat(s),this.beat+=1,this.timer=window.setTimeout(n,e)};n()}stopBgm(){this.timer&&(window.clearTimeout(this.timer),this.timer=0),this.playing=null}titleBeat(t){const e=this.beat%8,n=[110,0,82,0,110,0,98,0][e];n&&this.tone(this.bgmGain,n,.46,.045,"sine",t),(e===0||e===4)&&this.tone(this.bgmGain,220,.4,.02,"triangle",t),e===6&&this.tone(this.bgmGain,329,.28,.018,"sine",t)}battleBeat(t){const e=this.beat%8;e%2===0?this.sweepTo(this.bgmGain,90,42,.12,.1,t):this.noiseTo(this.bgmGain,.04,.025,t,1800);const s=[0,196,0,233,0,196,175,0][e];s&&this.tone(this.bgmGain,s,.18,.035,"square",t)}blip(t,e,n,s,r){this.sfxGain&&this.tone(this.sfxGain,t,e,n,s,r)}sweep(t,e,n,s,r){this.sfxGain&&this.sweepTo(this.sfxGain,t,e,n,s,r)}noise(t,e,n,s){this.sfxGain&&this.noiseTo(this.sfxGain,t,e,n,s)}tone(t,e,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type=r,o.frequency.setValueAtTime(e,a),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(s,a+.012),l.gain.exponentialRampToValueAtTime(1e-4,a+n),o.connect(l),l.connect(t),o.start(a),o.stop(a+n+.02)}sweepTo(t,e,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(e,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,n),a+s),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(r,a+.01),l.gain.exponentialRampToValueAtTime(1e-4,a+s),o.connect(l),l.connect(t),o.start(a),o.stop(a+s+.02)}noiseTo(t,e,n,s,r){if(!this.ctx)return;const a=2048,o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=o.getChannelData(0);for(let u=0;u<a;u++)l[u]=Math.random()*2-1;const c=this.ctx.createBufferSource();c.buffer=o;const h=this.ctx.createBiquadFilter();h.type="lowpass",h.frequency.value=r;const f=this.ctx.createGain();f.gain.setValueAtTime(1e-4,s),f.gain.exponentialRampToValueAtTime(n,s+.008),f.gain.exponentialRampToValueAtTime(1e-4,s+e),c.connect(h),h.connect(f),f.connect(t),c.start(s),c.stop(s+e+.02)}}const jt=new mu;function gu(i,t){return i==="mara"||i==="dana"||i==="priya"||i==="hale"||i==="crosby"||i==="beckett"?i:t==="civilian"?"official":t==="worker"?"worker":t==="delinquent"||t==="magician"||t==="wolverine"||t==="boxer"||t==="gunner"?t:t==="elite"?"crosby":"delinquent"}function xu(i,t){return t?i==="striker"?"strike":i==="controller"?"halt":i==="support"?"heal":i==="delinquent"?"slash":i==="magician"?"spark":i==="wolverine"?"pounce":i==="boxer"?"hook":i==="gunner"?"shot":"":""}function Ee(i){const t=i.team,e=i.stance??(t==="player"?"friendly":t==="neutral"?"neutral":"hostile"),n=i.npc??!1,s=i.behaviour??(n?"idle":"combat"),r=i.archetype??gu(i.id,i.role),a=i.skillKind??xu(i.role,i.skillName),o=a==="spark"||a==="shot"||i.role==="gunner"||i.role==="magician";return{acted:i.acted??!1,skillUsed:!1,skipNext:!1,dead:!1,lunge:0,dir:i.dir??0,movedThisTurn:!1,actedThisTurn:!1,npc:n,atkBuff:i.atkBuff??0,archetype:r,stance:e,behaviour:s,gender:i.gender??"m",skillKind:a,rangeMin:i.rangeMin??(i.role==="gunner"?2:1),rangeMax:i.rangeMax??(o?(i.role==="gunner",3):1),anim:"idle",animStart:0,...i}}function pl(i){return[Ee({id:"mara",name:"Mara Ellison",title:"警員",team:"player",role:"striker",archetype:"mara",gender:"f",x:i[0]?.x??3,y:i[0]?.y??11,hp:44,maxHp:44,atk:16,def:5,mov:5,jmp:2,dir:0,skillName:"重擊",skillHint:"近身重擊，傷害較高，也可以打更高的高度差。",skillKind:"strike"}),Ee({id:"dana",name:"Dana Ruiz",title:"搭檔",team:"player",role:"controller",archetype:"dana",gender:"f",x:i[1]?.x??4,y:i[1]?.y??11,hp:40,maxHp:40,atk:10,def:8,mov:4,jmp:1,dir:0,skillName:"攔住",skillHint:"讓目標下一回合無法行動，並造成少量傷害。",skillKind:"halt"}),Ee({id:"priya",name:"Priya Shah",title:"急救員",team:"player",role:"support",archetype:"priya",gender:"f",x:i[2]?.x??5,y:i[2]?.y??11,hp:38,maxHp:38,atk:8,def:7,mov:4,jmp:1,dir:0,skillName:"包紮",skillHint:"治療相鄰的友軍，也可以用在自己身上。",skillKind:"heal"})]}function Ci(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"街頭",team:"enemy",role:"delinquent",archetype:"delinquent",gender:r,x:e,y:n,hp:22,maxHp:22,atk:10,def:3,mov:4,jmp:1,dir:s,skillName:"揮砍",skillHint:"近身揮砍，傷害較高。",skillKind:"slash"})}function Ur(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"拳手",team:"enemy",role:"boxer",archetype:"boxer",gender:r,x:e,y:n,hp:26,maxHp:26,atk:15,def:4,mov:3,jmp:1,dir:s,skillName:"勾拳",skillHint:"近身重拳，傷害很高，距離短。",skillKind:"hook",rangeMin:1,rangeMax:1})}function rs(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"槍手",team:"enemy",role:"gunner",archetype:"gunner",gender:r,x:e,y:n,hp:20,maxHp:20,atk:11,def:3,mov:4,jmp:1,dir:s,skillName:"點射",skillHint:"遠距點射，想保持距離。",skillKind:"shot",rangeMin:2,rangeMax:3})}function ml(i,t,e,n,s,r="f"){return Ee({id:i,name:t,title:"術者",team:"enemy",role:"magician",archetype:"magician",gender:r,x:e,y:n,hp:24,maxHp:24,atk:12,def:3,mov:3,jmp:1,dir:s,skillName:"閃火",skillHint:"遠距閃火，看起來像煙火。",skillKind:"spark",rangeMin:1,rangeMax:3})}function _u(i,t,e,n,s,r="m"){return Ee({id:i,name:t,title:"爪獸",team:"enemy",role:"wolverine",archetype:"wolverine",gender:r,x:e,y:n,hp:28,maxHp:28,atk:15,def:2,mov:5,jmp:2,dir:s,skillName:"撲擊",skillHint:"衝近撲擊。現場會說那是動物。",skillKind:"pounce",rangeMin:1,rangeMax:1})}const ai=[{id:"m1",number:"任務 01",loc:"國王碼頭夜市・屋頂",hudSub:"國王碼頭夜市",paragraphs:["屋頂風很大。柏油上三個白圈，空的。街道被標得像棋盤——他們本來就不打算讓目擊者走掉。"],voices:[{name:"Mara",line:"屋頂不對勁。不是穿制服的。巷口粉筆記號又近了一格——跟週二同一隻手。"},{name:"Dana",line:"上去。樓梯我先走。你看到了再喊。"},{name:"Priya",line:"街上要是還有傷患，我不走。棋盤再急，也不能拿活人當棋子。"}],midBeats:[{speaker:"Mara",side:"left",text:"粉筆灰還沒被風吹散。有人剛從這裡下去。"}],winCond:"擊敗 Crosby",loseCond:"三人全部倒下",winTitle:"現場結束了。",winBody:"Crosby 倒下。其餘的人散了。市場還開著。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。屋頂上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。屋頂上的人還在。",map:{w:10,h:12,theme:"roof",heights:["2222222222","2222112222","2211001122","0011111100","0000000000","0000000000","2200000022","2200000022","2110000112","0000000000","0000000000","0000000000"],blocked:[[1,0,"ac"],[8,0,"ac"],[0,7,"ac"],[9,7,"ac"],[2,5,"stall"],[3,5,"stall"],[6,5,"stall"],[7,5,"stall"],[4,9,"stall"],[5,9,"stall"],[1,4,"stall"],[8,4,"stall"]],lamps:[[4,4],[0,9],[9,9]],objects:[{x:2,y:10,type:"kit",item:"bandage"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"crosby",makeOthers:()=>[Ee({id:"crosby",name:"Crosby",title:"現場主管",team:"enemy",role:"elite",archetype:"crosby",gender:"m",x:5,y:0,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),Ci("e1","Neil",2,1,2,"m"),Ci("e2","Cole",7,1,2,"f"),Ur("e3","Nash",0,6,1,"m"),rs("e4","Pike",4,3,2,"m")]},{id:"m2",number:"任務 02",loc:"國王碼頭後巷・貨台",hudSub:"國王碼頭後巷",paragraphs:["後巷報了槍擊。無線電當它是幫派互打。Mara、Dana、Priya 被派去，因為這是夜班的槍擊案，不是因為有人點名。三人傷勢已處理，生命已回復。","現場其實是 Assembly 在換掉當地那一組人，也要處理一個真正管港口執照的人。Deputy Harbour Chief Rowan Hale 人還在貨台上。他們先動手換幫派，所以看起來還是街頭那套。"],voices:[{name:"Mara",line:"後巷有槍聲。當幫派打。"},{name:"Dana",line:"我們是最近的一組。"},{name:"Priya",line:"有人倒在貨台邊上。"}],winCond:"擊敗 Beckett，Hale 須仍在",loseCond:"三人全部倒下，或 Rowan Hale 倒下",winTitle:"槍聲停了。",winBody:"Beckett 停手了。Hale 還活著。這條巷子暫時安靜。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。巷子裡的人還在。",protectLoseTitle:"Rowan Hale 倒下。",protectLoseBody:"港口執照那條線斷了。現場的人還沒走。",map:{w:10,h:12,theme:"alley",heights:["2220002222","2210001222","2200000122","0000000000","0001111000","2200000112","2200000012","0000000000","2210000222","2200000022","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,0,"ac"],[0,10,"ac"],[9,8,"ac"],[5,8,"crate"],[2,9,"crate"],[6,6,"crate"],[7,6,"crate"]],lamps:[[3,3],[4,10],[8,5]],objects:[{x:3,y:8,type:"pallet"},{x:8,y:4,type:"barrel"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"beckett",protectId:"hale",makeOthers:()=>[Ee({id:"hale",name:"Rowan Hale",title:"副港務長",team:"player",role:"civilian",archetype:"hale",gender:"m",x:4,y:9,hp:34,maxHp:34,atk:0,def:6,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ee({id:"beckett",name:"Beckett",title:"現場主管",team:"enemy",role:"elite",archetype:"beckett",gender:"m",x:8,y:1,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),rs("e1","Drake",5,2,2,"m"),Ci("e2","Quinn",1,4,1,"f"),Ur("e3","Moss",7,5,2,"m"),Ci("e4","Reed",8,7,3,"m")]},{id:"m3",number:"任務 03",loc:"國王碼頭倉庫・碼頭",hudSub:"國王碼頭倉庫",paragraphs:["槍擊過後，Assembly 回來清場。倉庫裡還有看太多的碼頭工人。無線電仍當它是貨物失竊。","現場主管是 Vance。工人 Sam Ortiz 還在棧板上。他們要滅口，不是搶貨。"],voices:[{name:"Mara",line:"倉庫有人。不是小偷。"},{name:"Dana",line:"工人還在裡面。"},{name:"Priya",line:"我先看傷。"}],winCond:"擊敗 Vance，Ortiz 須仍在",loseCond:"三人全部倒下，或 Sam Ortiz 倒下",winTitle:"倉庫靜了。",winBody:"Vance 停手。Ortiz 還活著。碼頭外面仍有夜班吊車。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。倉庫裡的人還在。",protectLoseTitle:"Sam Ortiz 倒下。",protectLoseBody:"目擊者沒了。現場的人還沒走。",map:{w:10,h:12,theme:"warehouse",heights:["2222200000","2211100000","2200000112","0000000112","0001110000","2200000022","2200000022","0000000000","0011111000","0000000000","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,2,"ac"],[0,5,"crate"],[9,6,"crate"],[3,7,"crate"],[4,2,"crate"],[5,2,"crate"]],lamps:[[2,3],[7,8],[1,10]],objects:[{x:1,y:8,type:"kit",item:"stim"},{x:5,y:8,type:"pallet"},{x:6,y:4,type:"barrel"},{x:2,y:4,type:"switch",unblock:[[4,2],[5,2]]},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"vance",protectId:"ortiz",makeOthers:()=>[Ee({id:"ortiz",name:"Sam Ortiz",title:"碼頭工人",team:"player",role:"worker",archetype:"worker",gender:"m",x:4,y:8,hp:28,maxHp:28,atk:0,def:4,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ee({id:"w1",name:"Gina Pell",title:"碼頭工人",team:"neutral",role:"worker",archetype:"worker",gender:"f",stance:"neutral",behaviour:"flee",npc:!0,x:1,y:6,hp:20,maxHp:20,atk:0,def:2,mov:3,jmp:1,dir:1,skillName:"",skillHint:""}),Ee({id:"vance",name:"Vance",title:"現場主管",team:"enemy",role:"elite",archetype:"boxer",gender:"m",x:6,y:1,hp:50,maxHp:50,atk:15,def:6,mov:4,jmp:2,dir:2,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook"}),rs("e1","Kira",8,2,2,"f"),Ci("e2","Dunn",2,2,2,"m"),Ur("e3","Wade",7,5,3,"m")]},{id:"m4",number:"任務 04",loc:"國王碼頭東街・換手",hudSub:"國王碼頭東街",paragraphs:["街上還有本地那一組人。Assembly 要換掉他們。看起來像幫派互打，三方都在場。","本地的人沒有先打你。Assembly 的現場主管是 Inez。贏的條件是她倒下。不必清掉整條街。"],voices:[{name:"Mara",line:"兩邊都有人。不要先打錯邊。"},{name:"Dana",line:"本地的人在看我們。"},{name:"Priya",line:"打到他們，他們就會打回來。"}],winCond:"擊敗 Inez。本地組不必全滅",loseCond:"三人全部倒下",winTitle:"東街暫時停了。",winBody:"Inez 倒下。本地的人沒有再往前。換手沒做完。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。街上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。街上的人還在。",map:{w:10,h:12,theme:"street",heights:["0000222000","0000222000","1100000011","0000000000","2200000022","0001111000","0000000000","2200000022","0000000000","1100000011","0000000000","0000000000"],blocked:[[0,4,"ac"],[9,4,"ac"],[0,7,"stall"],[9,7,"stall"],[3,5,"stall"]],lamps:[[2,2],[7,6],[4,9]],objects:[{x:1,y:9,type:"kit",item:"bandage"},{x:6,y:8,type:"pallet"},{x:2,y:5,type:"barrel"},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"inez",makeOthers:()=>[Ee({id:"inez",name:"Inez",title:"現場主管",team:"enemy",role:"elite",archetype:"gunner",gender:"f",x:5,y:0,hp:46,maxHp:46,atk:13,def:5,mov:4,jmp:2,dir:2,skillName:"點射",skillHint:"遠距點射。",skillKind:"shot",rangeMin:2,rangeMax:3}),ml("e1","Lyle",2,1,2,"m"),Ci("e2","Rosa",7,1,2,"f"),rs("e3","Chen",8,5,3,"m"),Ee({id:"g1",name:"Marty",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"combat",x:1,y:3,hp:20,maxHp:20,atk:9,def:3,mov:4,jmp:1,dir:1,skillName:"揮砍",skillHint:"近身揮砍。",skillKind:"slash",npc:!0}),Ee({id:"g2",name:"Bea",title:"本地組",team:"neutral",role:"boxer",archetype:"boxer",gender:"f",stance:"neutral",behaviour:"combat",x:2,y:6,hp:22,maxHp:22,atk:12,def:3,mov:3,jmp:1,dir:0,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook",npc:!0}),Ee({id:"g3",name:"Oz",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"indiscriminate",x:8,y:2,hp:16,maxHp:16,atk:8,def:2,mov:3,jmp:1,dir:3,skillName:"",skillHint:"",npc:!0})]},{id:"m5",number:"任務 05",loc:"港務大樓前・廣場",hudSub:"港務廣場",paragraphs:["Assembly 改打真正有權的人。Port Authority Director Marla Keene 今晚還在廣場側門。無線電會寫成動物與煙火。","現場有術者和爪獸。主管是 Holt。Keene 必須活著。"],voices:[{name:"Mara",line:"這不是街頭那套了。"},{name:"Dana",line:"那邊有人往官員走。"},{name:"Priya",line:"先護人。"}],winCond:"擊敗 Holt，Keene 須仍在",loseCond:"三人全部倒下，或 Marla Keene 倒下",winTitle:"廣場上的人散了。",winBody:"Holt 停手。Keene 還活著。報告會寫煙火與走失的動物。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。廣場上的人還在。",protectLoseTitle:"Marla Keene 倒下。",protectLoseBody:"真正管港口的那條線斷了。",map:{w:10,h:12,theme:"plaza",heights:["2222222222","2211111122","2200000022","0000000000","0001111000","2200000022","0000000000","0011111100","0000000000","2200000022","0000000000","0000000000"],blocked:[[0,5,"ac"],[9,5,"ac"],[1,1,"ac"],[8,1,"ac"],[4,2,"crate"],[5,2,"crate"]],lamps:[[3,3],[6,6],[2,9]],objects:[{x:6,y:10,type:"kit",item:"bandage"},{x:3,y:7,type:"pallet"},{x:7,y:4,type:"barrel"},{x:1,y:4,type:"van",unblock:[[4,2],[5,2]]},{x:8,y:8,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"holt",protectId:"keene",makeOthers:()=>[Ee({id:"keene",name:"Marla Keene",title:"港務總監",team:"player",role:"civilian",archetype:"official",gender:"f",x:4,y:9,hp:32,maxHp:32,atk:0,def:5,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ee({id:"holt",name:"Holt",title:"現場主管",team:"enemy",role:"elite",archetype:"magician",gender:"m",x:5,y:0,hp:52,maxHp:52,atk:14,def:5,mov:4,jmp:2,dir:2,skillName:"閃火",skillHint:"遠距閃火。",skillKind:"spark",rangeMin:1,rangeMax:3}),ml("e1","Lila",2,1,2,"f"),_u("e2","Rook",7,2,2,"m"),rs("e3","Tess",8,6,3,"f")]}],bs=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}],vu={L:.75,M:1,H:1.35},gl={L:"L 低",M:"M 中",H:"H 高"};function Ht(i,t){return`${i},${t}`}function Bn(i){const[t,e]=i.split(",");return{x:Number(t),y:Number(e)}}function as(i,t){const e=t.x-i.x,n=t.y-i.y,s=Math.sign(e),r=Math.sign(n);return s===0&&r<=0?0:s>0&&r<0?1:s>0&&r===0?2:s>0&&r>0?3:s===0&&r>0?4:s<0&&r>0?5:s<0&&r===0?6:7}function Fn(i,t){return Math.abs(i.x-t.x)+Math.abs(i.y-t.y)}function Nr(i){return new Promise(t=>setTimeout(t,i))}function Fr(i,t,e,n,s){const r=(n-1)/2,a=(s-1)/2,o=i-r,l=t-a,c=Math.cos(e),h=Math.sin(e);return{x:o*c+l*h,y:-o*h+l*c}}function yu(i,t,e){const n=Math.cos(e),s=Math.sin(e);return{x:i*n+t*s,y:-i*s+t*n}}function Mu(i){return i+Math.PI/2}function Su(i,t){if(i.stance!=="hostile"&&i.team!=="enemy")return;const e=vu[t];i.maxHp=Math.max(1,Math.round(i.maxHp*e)),i.hp=i.maxHp,i.atk=Math.max(1,Math.round(i.atk*e)),i.def=Math.max(0,Math.round(i.def*e))}function ei(i){return i.stance}function lr(i){const t=ei(i);return t==="friendly"?"#5ad0ff":t==="hostile"?"#ff4d6d":"#e0c45a"}function Ia(i){return i.team==="player"&&!i.npc&&!i.dead}function bu(i,t){return t.dead?!0:i.team===t.team||ei(i)==="friendly"&&ei(t)==="friendly"}function Io(i,t){if(i.dead||t.dead||i.id===t.id)return!1;if(i.behaviour==="indiscriminate"||t.behaviour==="indiscriminate")return!0;const e=ei(i),n=ei(t);return e==="hostile"&&n==="friendly"||e==="friendly"&&n==="hostile"||e==="neutral"&&n==="hostile"||e==="hostile"&&n==="neutral"}function xl(i){i.stance="hostile",i.team="enemy",(i.behaviour==="idle"||i.behaviour==="flee")&&(i.behaviour="combat")}function Tu(i,t){const e=new Map;for(const n of i)n.dead||t&&n.id===t.id||e.set(Ht(n.x,n.y),n);return e}function Ps(i,t,e){const n=Tu(e,i),s=new Map,r=new Map,a=Ht(i.x,i.y);s.set(a,0),r.set(a,null);const o=[{x:i.x,y:i.y}];for(;o.length;){o.sort((d,p)=>(s.get(Ht(d.x,d.y))??99)-(s.get(Ht(p.x,p.y))??99));const c=o.shift(),h=Ht(c.x,c.y),f=s.get(h)??0,u=t.heightAt(c.x,c.y);for(const d of bs){const p=c.x+d.x,_=c.y+d.y;if(!t.walkable(p,_)||d.x!==0&&d.y!==0&&(!t.walkable(c.x+d.x,c.y)||!t.walkable(c.x,c.y+d.y)))continue;const g=t.heightAt(p,_)-u;if(Math.abs(g)>i.jmp)continue;const M=n.get(Ht(p,_));if(M&&!bu(i,M))continue;const T=1+(g>0?g:0),y=f+T;if(y>i.mov)continue;const w=Ht(p,_),b=s.get(w);b!==void 0&&b<=y||(s.set(w,y),r.set(w,h),o.push({x:p,y:_}))}}const l=new Map;for(const[c,h]of s){const f=Bn(c),u=n.get(c);u&&u.id!==i.id||t.walkable(f.x,f.y)&&l.set(c,h)}return l.set(a,0),{cost:l,parent:r}}function ni(i,t){const e=[];let n=Ht(t.x,t.y);if(!i.cost.has(n)&&!i.parent.has(n))return e;for(;n;){e.push(Bn(n));const s=i.parent.get(n);if(!s)break;n=s}return e.reverse(),e}function Zi(i,t,e,n,s,r){const a=Math.abs(t-n)+Math.abs(e-s),o=i.rangeMin??1,l=i.rangeMax??1;if(a<o||a>l)return!1;const c=Math.abs(r.heightAt(t,e)-r.heightAt(n,s)),h=Math.max(2,i.jmp+1);return c<=h}function Da(i,t,e,n){const s=i.x,r=i.y,a=[];for(const o of e)o.dead||o.id===i.id||!(Io(i,o)||i.team==="player"&&!i.npc&&o.stance!=="friendly")||Zi(i,s,r,o.x,o.y,t)&&a.push(o);return a}function Ua(i,t,e){const n=i.skillKind;if(n==="heal"||i.role==="support")return e.filter(s=>s.dead||s.stance!=="friendly"&&s.team!=="player"?!1:Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=1);if(n==="halt"||i.role==="controller")return e.filter(s=>{if(s.dead||s.stance==="friendly")return!1;const r=Math.abs(t.heightAt(i.x,i.y)-t.heightAt(s.x,s.y));return Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=3&&r<=3});if(n==="spark"||n==="shot")return e.filter(s=>{if(s.dead||s.id===i.id||s.stance==="friendly")return!1;const r=Math.abs(i.x-s.x)+Math.abs(i.y-s.y),a=n==="spark"?3:4;return r<(n==="shot"?2:1)||r>a?!1:Math.abs(t.heightAt(i.x,i.y)-t.heightAt(s.x,s.y))<=3});if(n==="strike"||n==="slash"||n==="pounce"||n==="hook"||i.role==="striker"){const s=n==="strike"?3:2;return Da({...i,rangeMin:1,rangeMax:1},t,e).filter(r=>Math.abs(t.heightAt(i.x,i.y)-t.heightAt(r.x,r.y))<=s)}return Da(i,t,e)}function Eu(i,t,e){const n=new Set;for(const s of Da(i,t,e))n.add(Ht(s.x,s.y));return n}function cr(i,t){const e=new Set,n=i.rangeMin??1,s=i.rangeMax??1;for(let r=0;r<t.h;r++)for(let a=0;a<t.w;a++){const o=Math.abs(i.x-a)+Math.abs(i.y-r);o>=n&&o<=s&&t.inBounds(a,r)&&e.add(Ht(a,r))}return e}function wu(i,t){const e=i.skillKind;if(e==="halt"||i.role==="controller"){const n=new Set;for(let s=0;s<t.h;s++)for(let r=0;r<t.w;r++)Math.abs(i.x-r)+Math.abs(i.y-s)<=3&&n.add(Ht(r,s));return n}if(e==="heal"||i.role==="support"){const n=new Set;for(const s of bs){const r=i.x+s.x,a=i.y+s.y;t.inBounds(r,a)&&n.add(Ht(r,a))}return n.add(Ht(i.x,i.y)),n}if(e==="spark"){const n={...i,rangeMin:1,rangeMax:3};return cr(n,t)}if(e==="shot"){const n={...i,rangeMin:2,rangeMax:4};return cr(n,t)}return cr({...i,rangeMin:1,rangeMax:1},t)}function jc(i,t){const e=t.x-i.x,n=t.y-i.y,s=bs[i.dir],r=e*s.x+n*s.y;return r>0?"front":r<0?"back":"side"}function _r(i,t,e,n=!1){const s=jc(t,i);let r=i.atk+(i.atkBuff||0)-Math.floor(t.def*.5);const a=e.heightAt(i.x,i.y)-e.heightAt(t.x,t.y);if(a>0&&(r+=3),a<0&&(r-=2),s==="side"&&(r=Math.floor(r*1.25)),s==="back"&&(r=Math.floor(r*1.5)),n)switch(i.skillKind){case"strike":r=Math.floor(r*1.4);break;case"slash":r=Math.floor(r*1.3);break;case"spark":r=i.atk+(i.atkBuff||0)-Math.floor(t.def*.2)+(a>0?2:0);break;case"pounce":r=Math.floor(r*1.35);break;case"hook":r=Math.floor(r*1.45);break;case"shot":r=Math.floor(r*1.15);break;default:i.role==="striker"&&(r=Math.floor(r*1.4))}return{dmg:Math.max(1,r),face:s,dh:a}}const Au={front:"正面",side:"側面 +25%",back:"背面 +50%"};function Na(i,t,e,n=!1){const{dmg:s,face:r,dh:a}=_r(i,t,e,n),o=[Au[r]];return a>0&&o.push("高地 +3"),a<0&&o.push("仰攻 −2"),n&&i.skillName&&o.push(i.skillName),{kind:n?"skill":"attack",actor:i,target:t,label:n?`${i.skillName}　${i.name} → ${t.name}`:`${i.name} → ${t.name}`,detail:`${s} 傷害　${o.join("　")}`,dmg:s,heal:0,skip:!1,face:r}}function _l(i,t,e){const n=i.skillKind;return n==="halt"||i.role==="controller"?{kind:"skill",actor:i,target:t,label:`${i.skillName}　${i.name} → ${t.name}`,detail:"下回合無法行動　並造成 4 傷害",dmg:4,heal:0,skip:!0,face:jc(t,i)}:n==="heal"||i.role==="support"?{kind:"skill",actor:i,target:t,label:`${i.skillName}　${i.name} → ${t.name}`,detail:`預覽　生命 ${t.hp} → ${Math.min(t.maxHp,t.hp+16)} / ${t.maxHp}（+${Math.min(16,t.maxHp-t.hp)}）`,dmg:0,heal:16,skip:!1,face:"front"}:Na(i,t,e,!0)}function Do(i,t){return i.behaviour==="indiscriminate"?t.filter(e=>!e.dead&&e.id!==i.id):i.behaviour==="flee"||i.behaviour==="idle"?[]:t.filter(e=>!e.dead&&e.id!==i.id&&Io(i,e))}function Uo(i,t){return t.length?t.slice().sort((e,n)=>Fn(i,e)-Fn(i,n))[0]:null}function Ru(i,t,e,n,s){return i.behaviour==="idle"||i.mov<=0?{unit:i,dest:{x:i.x,y:i.y},path:[{x:i.x,y:i.y}],target:null,useSkill:!1}:i.behaviour==="flee"?Cu(i,t,e):s==="L"?Pu(i,t,e):s==="H"?Iu(i,t,e,n):Lu(i,t,e,n)}function Cu(i,t,e){const n=Ps(i,t,e),s=e.filter(o=>!o.dead&&o.id!==i.id&&ei(o)==="hostile");let r={x:i.x,y:i.y},a=-1;for(const[o]of n.cost){const l=Bn(o),c=Uo(l,s),h=c?Fn(l,c):8,f=Math.min(l.x,l.y,t.w-1-l.x,t.h-1-l.y),u=h*10-f;u>a&&(a=u,r=l)}return{unit:i,dest:r,path:ni(n,r),target:null,useSkill:!1}}function No(i,t,e,n,s,r){if(i.skillUsed||!i.skillName)return!1;const a={...i,x:t.x,y:t.y};if(!Ua(a,n,s).some(c=>c.id===e.id)||i.skillKind==="heal")return!1;const l=r==="H"?.8:r==="L"?.25:.55;return i.skillKind==="spark"||i.skillKind==="shot"?!0:Math.random()<l}function Pu(i,t,e){const n=Ps(i,t,e),s=Do(i,e);let r=null;for(const[c]of n.cost){const h=Bn(c);for(const f of s){if(!Zi(i,h.x,h.y,f.x,f.y,t))continue;const u=Fn(i,h),p=400-Fn(i,f)*20-u;(!r||p>r.score)&&(r={dest:h,target:f,score:p})}}if(r)return{unit:i,dest:r.dest,path:ni(n,r.dest),target:r.target,useSkill:No(i,r.dest,r.target,t,e,"L")};const a=Uo(i,s);let o={x:i.x,y:i.y},l=1e9;if(a)for(const[c]of n.cost){const h=Bn(c);let f=Fn(h,a);i.rangeMin>1&&(f=Math.abs(f-i.rangeMin)),f<l&&(l=f,o=h)}return{unit:i,dest:o,path:ni(n,o),target:null,useSkill:!1}}function Lu(i,t,e,n){const s=Ps(i,t,e),r=Do(i,e);let a=null;for(const[c]of s.cost){const h=Bn(c);for(const f of r){if(!Zi(i,h.x,h.y,f.x,f.y,t))continue;const u={...i,x:h.x,y:h.y},{dmg:d,face:p,dh:_}=_r(u,f,t);let m=d*10+(f.hp<=d?80:0);if(f.role==="support"&&(m+=6),f.id===n&&(m+=14),p==="back"&&(m+=8),_>0&&(m+=4),i.role==="elite"&&(m+=2),i.rangeMin>1){const g=Fn(h,f);g>=i.rangeMin&&(m+=6),g===1&&i.archetype==="gunner"&&(m-=12)}(!a||m>a.score)&&(a={dest:h,target:f,score:m})}}if(a)return{unit:i,dest:a.dest,path:ni(s,a.dest),target:a.target,useSkill:No(i,a.dest,a.target,t,e,"M")};let o={x:i.x,y:i.y},l=99;for(const c of r)for(const[h]of s.cost){const f=Bn(h);let u=Math.abs(f.x-c.x)+Math.abs(f.y-c.y);i.rangeMin>1&&(u=Math.abs(u-Math.max(2,i.rangeMin)));const d=t.heightAt(i.x,i.y)-t.heightAt(f.x,f.y);let p=u;c.id===n&&(p-=2),i.role==="elite"&&d>0&&(p+=1.4),p<l&&(l=p,o=f)}return{unit:i,dest:o,path:ni(s,o),target:null,useSkill:!1}}function Iu(i,t,e,n){const s=Ps(i,t,e),r=Do(i,e),a=n?r.find(p=>p.id===n):void 0,l=r.filter(p=>!p.npc).reduce((p,_)=>p+_.hp,0),c=!!a&&a.hp*3<=Math.max(1,l);let h=null;for(const[p]of s.cost){const _=Bn(p);for(const m of r){if(!Zi(i,_.x,_.y,m.x,m.y,t))continue;const g={...i,x:_.x,y:_.y},{dmg:M,face:T,dh:y}=_r(g,m,t),w=1-m.hp/Math.max(1,m.maxHp);let b=M*12+w*40;m.hp<=M&&(b+=110),T==="back"&&(b+=22),T==="side"&&(b+=12),y>0&&(b+=10),y<0&&(b-=6),m.role==="support"&&(b+=8),m.id===n&&(b+=c||m.hp<=16?56:20,m.hp<=M&&(b+=40)),i.role==="elite"&&(b+=3),i.rangeMin>1&&Fn(_,m)===1&&i.archetype==="gunner"&&(b-=20),(!h||b>h.score)&&(h={dest:_,target:m,score:b})}}if(h)return{unit:i,dest:h.dest,path:ni(s,h.dest),target:h.target,useSkill:No(i,h.dest,h.target,t,e,"H")};const f=a&&(c||a.hp/a.maxHp<.65)?a:r.slice().sort((p,_)=>p.hp/p.maxHp-_.hp/_.maxHp)[0];let u={x:i.x,y:i.y},d=-1e9;for(const[p]of s.cost){const _=Bn(p),m=f??Uo(_,r);if(!m)continue;let g=Fn(_,m);i.rangeMin>1&&(g=Math.abs(g-Math.max(2,i.rangeMin)));let M=-g*10+t.heightAt(_.x,_.y)*5;if(Zi(i,_.x,_.y,m.x,m.y,t)){const T={...i,x:_.x,y:_.y},{face:y,dh:w}=_r(T,m,t);y==="back"&&(M+=24),y==="side"&&(M+=12),w>0&&(M+=8)}m.id===n&&(M+=6),M+=(1-m.hp/Math.max(1,m.maxHp))*8,M>d&&(d=M,u=_)}return{unit:i,dest:u,path:ni(s,u),target:null,useSkill:!1}}class Du{constructor(t,e){k(this,"pointers",new Map);k(this,"lastPinch",0);k(this,"lastAngle",0);k(this,"lastCentroid",null);k(this,"dragging",!1);k(this,"start",null);k(this,"moved",0);k(this,"right",!1);k(this,"pinchGrid",null);k(this,"onTap",()=>{});this.canvas=t,this.renderer=e,t.addEventListener("pointerdown",n=>this.down(n)),t.addEventListener("pointermove",n=>this.move(n)),t.addEventListener("pointerup",n=>this.up(n)),t.addEventListener("pointercancel",n=>this.up(n)),t.addEventListener("contextmenu",n=>n.preventDefault()),t.addEventListener("wheel",n=>{n.preventDefault(),this.zoomAt(n.clientX,n.clientY,n.deltaY<0?1.08:.92)},{passive:!1})}pos(t){const e=this.canvas.getBoundingClientRect();return{x:t.clientX-e.left,y:t.clientY-e.top}}centroid(){const t=[...this.pointers.values()];let e=0,n=0;for(const s of t)e+=s.x,n+=s.y;return{x:e/t.length,y:n/t.length}}down(t){this.canvas.setPointerCapture(t.pointerId);const e=this.pos(t);if(this.pointers.set(t.pointerId,e),t.button===2&&(this.right=!0),this.pointers.size===1)this.start=e,this.moved=0,this.dragging=!1;else if(this.pointers.size===2){this.lastPinch=this.pinchDist(),this.lastAngle=this.pinchAngle();const n=this.centroid();this.lastCentroid=n,this.pinchGrid=this.renderer.screenToGrid(n.x,n.y),this.dragging=!0}}move(t){if(!this.pointers.has(t.pointerId))return;const e=this.pos(t),n=this.pointers.get(t.pointerId);if(this.pointers.set(t.pointerId,e),this.pointers.size===2){const a=this.pinchDist(),o=this.pinchAngle(),l=this.centroid();if(this.lastPinch>0){const c=a/this.lastPinch;this.renderer.yaw-=o-this.lastAngle,this.lastCentroid&&this.renderer.addPitch(l.y-this.lastCentroid.y),this.zoomAtScreen(l.x,l.y,c),this.pinchGrid&&this.renderer.lockGridToScreen(this.pinchGrid.x,this.pinchGrid.y,0,l.x,l.y)}this.lastPinch=a,this.lastAngle=o,this.lastCentroid=l,this.dragging=!0;return}const s=e.x-n.x,r=e.y-n.y;if(this.moved+=Math.hypot(s,r),this.moved>10&&(this.dragging=!0),this.right){const a=this.renderer.screenToGrid(this.renderer.w/2,this.renderer.h/2);this.renderer.yaw+=s*.01,this.renderer.addPitch(r),this.renderer.lockGridToScreen(a.x,a.y,0,this.renderer.w/2,this.renderer.h/2);return}if(this.dragging){const a=this.renderer.cam.zoom;this.renderer.cam.x-=s/a,this.renderer.cam.y-=r/a}}up(t){const e=this.pointers.get(t.pointerId);this.pointers.delete(t.pointerId),t.button===2&&(this.right=!1),this.pointers.size<2&&(this.lastPinch=0,this.pinchGrid=null,this.lastCentroid=null),this.pointers.size===0?(!this.dragging&&this.start&&e&&this.onTap(e,{x:t.clientX,y:t.clientY}),this.start=null,this.dragging=!1,this.moved=0,this.right=!1):this.dragging=!0}pinchDist(){const t=[...this.pointers.values()];return t.length<2?0:Math.hypot(t[0].x-t[1].x,t[0].y-t[1].y)}pinchAngle(){const t=[...this.pointers.values()];return t.length<2?0:Math.atan2(t[1].y-t[0].y,t[1].x-t[0].x)}zoomAt(t,e,n){const s=this.canvas.getBoundingClientRect();this.zoomAtScreen(t-s.left,e-s.top,n)}zoomAtScreen(t,e,n){const s=this.renderer.cam,r=s.x+(t-this.renderer.w/2)/s.zoom,a=s.y+(e-this.renderer.h/2)/s.zoom;s.zoom=Math.min(1.8,Math.max(.55,s.zoom*n)),s.x=r-(t-this.renderer.w/2)/s.zoom,s.y=a-(e-this.renderer.h/2)/s.zoom}}const vl=14,Uu=5,Nu=9,oi={bandage:{id:"bandage",name:"繃帶",hint:"回復 14 生命。"},stim:{id:"stim",name:"提神",hint:"下次攻擊 +5。"}},Pi=[{id:"bandage",qty:2},{id:"stim",qty:1}];function tn(i){return i.map(t=>({id:t.id,qty:t.qty})).filter(t=>t.qty>0)}function Or(i,t,e=1){const n=i.find(a=>a.id===t),s=n?.qty??0,r=Math.min(e,Nu-s);return r<=0?0:(n?n.qty+=r:i.push({id:t,qty:r}),r)}function Fu(i,t){const e=i.find(n=>n.id===t);if(!e||e.qty<=0)return!1;if(e.qty-=1,e.qty<=0){const n=i.indexOf(e);n>=0&&i.splice(n,1)}return!0}function kr(i){return i.filter(t=>!t.dead&&(t.stance==="friendly"||t.team==="player"))}const Br=8,yl=12;function Ou(i,t){const n={id:`obj-${i.type}-${t}-${i.x}-${i.y}`,x:i.x,y:i.y,type:i.type,gone:!1,used:!1,item:i.item,unblock:i.unblock??[],healAdj:i.healAdj??0};switch(i.type){case"kit":return{...n,kind:"pickup",hp:1,maxHp:1,label:"急救包",standH:0,item:i.item??"bandage"};case"switch":return{...n,kind:"trigger",hp:1,maxHp:1,label:"開關",standH:0};case"van":return{...n,kind:"trigger",hp:1,maxHp:1,label:"貨車門",standH:0};case"barrel":return{...n,kind:"destructible",hp:yl,maxHp:yl,label:"油桶",standH:0};case"crate":return{...n,kind:"platform",hp:1,maxHp:1,label:"貨箱",standH:1};case"pallet":return{...n,kind:"platform",hp:1,maxHp:1,label:"棧板",standH:1}}}function ku(i){return i.gone?!1:i.kind==="destructible"||i.type==="van"&&!i.used}function Bu(i){const t=new Map;for(const e of i)e.gone||t.set(Ht(e.x,e.y),e);return t}class Hr{constructor(t){k(this,"w");k(this,"h");k(this,"theme");k(this,"tiles",[]);k(this,"objects",[]);this.w=t.w,this.h=t.h,this.theme=t.theme??"roof";const e=new Map;for(const[s,r,a]of t.blocked)e.set(Ht(s,r),a);const n=new Set((t.lamps??[]).map(([s,r])=>Ht(s,r)));for(let s=0;s<t.h;s++){const r=[],a=t.heights[s]??"";for(let o=0;o<t.w;o++){const l=Number(a[o]??"0");let c="street";l===2?c="roof":l===1&&(c="stairs");const h=e.get(Ht(o,s))??(n.has(Ht(o,s))?"lamp":void 0);r.push({x:o,y:s,h:l,terrain:c,blocked:h==="stall"||h==="ac"||h==="crate",prop:h})}this.tiles.push(r)}this.objects=(t.objects??[]).map((s,r)=>Ou(s,r))}inBounds(t,e){return t>=0&&e>=0&&t<this.w&&e<this.h}tile(t,e){return this.inBounds(t,e)?this.tiles[e][t]:null}objAt(t,e){return Bu(this.objects).get(Ht(t,e))}heightAt(t,e){const n=this.tile(t,e);if(!n)return 0;const s=this.objAt(t,e),r=s&&!s.gone&&s.kind==="platform"?s.standH:0;return n.h+r}walkable(t,e){const n=this.tile(t,e);if(!n||n.blocked)return!1;const s=this.objAt(t,e);return!(s&&ku(s))}unblock(t,e){const n=this.tile(t,e);n&&(n.blocked=!1,(n.prop==="crate"||n.prop==="stall")&&(n.prop=void 0))}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Fo="185",Hu=0,Ml=1,zu=2,hr=1,Gu=2,ms=3,ii=0,qe=1,Un=2,On=0,Yi=1,Sl=2,bl=3,Tl=4,Vu=5,mi=100,Wu=101,Xu=102,qu=103,Yu=104,$u=200,Ku=201,Zu=202,Ju=203,Fa=204,Oa=205,Qu=206,ju=207,tf=208,ef=209,nf=210,sf=211,rf=212,af=213,of=214,ka=0,Ba=1,Ha=2,Ji=3,za=4,Ga=5,Va=6,Wa=7,th=0,lf=1,cf=2,bn=0,eh=1,nh=2,ih=3,sh=4,rh=5,ah=6,oh=7,lh=300,bi=301,Qi=302,zr=303,Gr=304,wr=306,Xa=1e3,Nn=1001,qa=1002,Ie=1003,hf=1004,Ns=1005,Oe=1006,Vr=1007,vi=1008,Je=1009,ch=1010,hh=1011,Ts=1012,Oo=1013,En=1014,Mn=1015,Hn=1016,ko=1017,Bo=1018,Es=1020,uh=35902,fh=35899,dh=1021,ph=1022,un=1023,zn=1026,yi=1027,mh=1028,Ho=1029,Ti=1030,zo=1031,Go=1033,ur=33776,fr=33777,dr=33778,pr=33779,Ya=35840,$a=35841,Ka=35842,Za=35843,Ja=36196,Qa=37492,ja=37496,to=37488,eo=37489,vr=37490,no=37491,io=37808,so=37809,ro=37810,ao=37811,oo=37812,lo=37813,co=37814,ho=37815,uo=37816,fo=37817,po=37818,mo=37819,go=37820,xo=37821,_o=36492,vo=36494,yo=36495,Mo=36283,So=36284,yr=36285,bo=36286,uf=3200,To=0,ff=1,jn="",Ze="srgb",Mr="srgb-linear",Sr="linear",ee="srgb",Li=7680,El=519,df=512,pf=513,mf=514,Vo=515,gf=516,xf=517,Wo=518,_f=519,wl=35044,Al="300 es",Sn=2e3,ws=2001;function vf(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function br(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function yf(){const i=br("canvas");return i.style.display="block",i}const Rl={};function Cl(...i){const t="THREE."+i.shift();console.log(t,...i)}function gh(i){const t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Lt(...i){i=gh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Kt(...i){i=gh(i);const t="THREE."+i.shift();{const e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function $i(...i){const t=i.join(" ");t in Rl||(Rl[t]=!0,Lt(...i))}function Mf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Sf={[ka]:Ba,[Ha]:Va,[za]:Wa,[Ji]:Ga,[Ba]:ka,[Va]:Ha,[Wa]:za,[Ga]:Ji};class wi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Wr=Math.PI/180,Eo=180/Math.PI;function ns(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]).toLowerCase()}function Gt(i,t,e){return Math.max(t,Math.min(e,i))}function bf(i,t){return(i%t+t)%t}function Xr(i,t,e){return(1-e)*i+e*t}function os(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function We(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const tl=class tl{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};tl.prototype.isVector2=!0;let ht=tl;class is{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[a+0],d=r[a+1],p=r[a+2],_=r[a+3];if(f!==_||l!==u||c!==d||h!==p){let m=l*u+c*d+h*p+f*_;m<0&&(u=-u,d=-d,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){const M=Math.acos(m),T=Math.sin(M);g=Math.sin(g*M)/T,o=Math.sin(o*M)/T,l=l*g+u*o,c=c*g+d*o,h=h*g+p*o,f=f*g+_*o}else{l=l*g+u*o,c=c*g+d*o,h=h*g+p*o,f=f*g+_*o;const M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],u=r[a+1],d=r[a+2],p=r[a+3];return t[e]=o*p+h*f+l*d-c*u,t[e+1]=l*p+h*u+c*f-o*d,t[e+2]=c*p+h*d+o*u-l*f,t[e+3]=h*p-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),u=l(n/2),d=l(s/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:Lt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Gt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const el=class el{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Pl.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Pl.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*s-o*n),h=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return qr.copy(this).projectOnVector(t),this.sub(qr)}reflect(t){return this.sub(qr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Gt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};el.prototype.isVector3=!0;let I=el;const qr=new I,Pl=new is,nl=class nl{constructor(t,e,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c)}set(t,e,n,s,r,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],p=n[8],_=s[0],m=s[3],g=s[6],M=s[1],T=s[4],y=s[7],w=s[2],b=s[5],R=s[8];return r[0]=a*_+o*M+l*w,r[3]=a*m+o*T+l*b,r[6]=a*g+o*y+l*R,r[1]=c*_+h*M+f*w,r[4]=c*m+h*T+f*b,r[7]=c*g+h*y+f*R,r[2]=u*_+d*M+p*w,r[5]=u*m+d*T+p*b,r[8]=u*g+d*y+p*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,p=e*f+n*u+s*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/p;return t[0]=f*_,t[1]=(s*c-h*n)*_,t[2]=(o*n-s*a)*_,t[3]=u*_,t[4]=(h*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-s*c,s*l,-s*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return $i("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Yr.makeScale(t,e)),this}rotate(t){return $i("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Yr.makeRotation(-t)),this}translate(t,e){return $i("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Yr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};nl.prototype.isMatrix3=!0;let Nt=nl;const Yr=new Nt,Ll=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Il=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Tf(){const i={enabled:!0,workingColorSpace:Mr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ee&&(s.r=kn(s.r),s.g=kn(s.g),s.b=kn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ee&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===jn?Sr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return $i("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return $i("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Mr]:{primaries:t,whitePoint:n,transfer:Sr,toXYZ:Ll,fromXYZ:Il,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ze},outputColorSpaceConfig:{drawingBufferColorSpace:Ze}},[Ze]:{primaries:t,whitePoint:n,transfer:ee,toXYZ:Ll,fromXYZ:Il,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ze}}}),i}const Wt=Tf();function kn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ii;class Ef{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ii===void 0&&(Ii=br("canvas")),Ii.width=t.width,Ii.height=t.height;const s=Ii.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ii}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=br("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=kn(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(kn(e[n]/255)*255):e[n]=kn(e[n]);return{data:e,width:t.width,height:t.height}}else return Lt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let wf=0;class Xo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:wf++}),this.uuid=ns(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push($r(s[a].image)):r.push($r(s[a]))}else r=$r(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function $r(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ef.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Lt("Texture: Unable to serialize Texture."),{})}let Af=0;const Kr=new I;class Ge extends wi{constructor(t=Ge.DEFAULT_IMAGE,e=Ge.DEFAULT_MAPPING,n=Nn,s=Nn,r=Oe,a=vi,o=un,l=Je,c=Ge.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Af++}),this.uuid=ns(),this.name="",this.source=new Xo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Kr).x}get height(){return this.source.getSize(Kr).y}get depth(){return this.source.getSize(Kr).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Lt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Lt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Xa:t.x=t.x-Math.floor(t.x);break;case Nn:t.x=t.x<0?0:1;break;case qa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Xa:t.y=t.y-Math.floor(t.y);break;case Nn:t.y=t.y<0?0:1;break;case qa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ge.DEFAULT_IMAGE=null;Ge.DEFAULT_MAPPING=lh;Ge.DEFAULT_ANISOTROPY=1;const il=class il{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const T=(c+1)/2,y=(d+1)/2,w=(g+1)/2,b=(h+u)/4,R=(f+_)/4,v=(p+m)/4;return T>y&&T>w?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=b/n,r=R/n):y>w?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=v/s):w<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),n=R/r,s=v/r),this.set(n,s,r,e),this}let M=Math.sqrt((m-p)*(m-p)+(f-_)*(f-_)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-p)/M,this.y=(f-_)/M,this.z=(u-h)/M,this.w=Math.acos((c+d+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Gt(this.x,t.x,e.x),this.y=Gt(this.y,t.y,e.y),this.z=Gt(this.z,t.z,e.z),this.w=Gt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Gt(this.x,t,e),this.y=Gt(this.y,t,e),this.z=Gt(this.z,t,e),this.w=Gt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Gt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};il.prototype.isVector4=!0;let fe=il;class Rf extends wi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Oe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new fe(0,0,t,e),this.scissorTest=!1,this.viewport=new fe(0,0,t,e),this.textures=[];const s={width:t,height:e,depth:n.depth},r=new Ge(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Oe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Xo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Tn extends Rf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class xh extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Cf extends Ge{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Nn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Er=class Er{constructor(t,e,n,s,r,a,o,l,c,h,f,u,d,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,c,h,f,u,d,p,_,m)}set(t,e,n,s,r,a,o,l,c,h,f,u,d,p,_,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=s,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=f,g[14]=u,g[3]=d,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Er().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,s=1/Di.setFromMatrixColumn(t,0).length(),r=1/Di.setFromMatrixColumn(t,1).length(),a=1/Di.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const u=a*h,d=a*f,p=o*h,_=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+p*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=p+d*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,d=l*f,p=c*h,_=c*f;e[0]=u+_*o,e[4]=p*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-p,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,d=l*f,p=c*h,_=c*f;e[0]=u-_*o,e[4]=-a*f,e[8]=p+d*o,e[1]=d+p*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,d=a*f,p=o*h,_=o*f;e[0]=l*h,e[4]=p*c-d,e[8]=u*c+_,e[1]=l*f,e[5]=_*c+u,e[9]=d*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,d=a*c,p=o*l,_=o*c;e[0]=l*h,e[4]=_-u*f,e[8]=p*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+p,e[10]=u-_*f}else if(t.order==="XZY"){const u=a*l,d=a*c,p=o*l,_=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+_,e[5]=a*h,e[9]=d*f-p,e[2]=p*f-d,e[6]=o*h,e[10]=_*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Pf,t,Lf)}lookAt(t,e,n){const s=this.elements;return $e.subVectors(t,e),$e.lengthSq()===0&&($e.z=1),$e.normalize(),qn.crossVectors(n,$e),qn.lengthSq()===0&&(Math.abs(n.z)===1?$e.x+=1e-4:$e.z+=1e-4,$e.normalize(),qn.crossVectors(n,$e)),qn.normalize(),Fs.crossVectors($e,qn),s[0]=qn.x,s[4]=Fs.x,s[8]=$e.x,s[1]=qn.y,s[5]=Fs.y,s[9]=$e.y,s[2]=qn.z,s[6]=Fs.z,s[10]=$e.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],p=n[2],_=n[6],m=n[10],g=n[14],M=n[3],T=n[7],y=n[11],w=n[15],b=s[0],R=s[4],v=s[8],E=s[12],C=s[1],P=s[5],N=s[9],W=s[13],X=s[2],O=s[6],$=s[10],G=s[14],Q=s[3],tt=s[7],at=s[11],gt=s[15];return r[0]=a*b+o*C+l*X+c*Q,r[4]=a*R+o*P+l*O+c*tt,r[8]=a*v+o*N+l*$+c*at,r[12]=a*E+o*W+l*G+c*gt,r[1]=h*b+f*C+u*X+d*Q,r[5]=h*R+f*P+u*O+d*tt,r[9]=h*v+f*N+u*$+d*at,r[13]=h*E+f*W+u*G+d*gt,r[2]=p*b+_*C+m*X+g*Q,r[6]=p*R+_*P+m*O+g*tt,r[10]=p*v+_*N+m*$+g*at,r[14]=p*E+_*W+m*G+g*gt,r[3]=M*b+T*C+y*X+w*Q,r[7]=M*R+T*P+y*O+w*tt,r[11]=M*v+T*N+y*$+w*at,r[15]=M*E+T*W+y*G+w*gt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],p=t[3],_=t[7],m=t[11],g=t[15],M=l*d-c*u,T=o*d-c*f,y=o*u-l*f,w=a*d-c*h,b=a*u-l*h,R=a*f-o*h;return e*(_*M-m*T+g*y)-n*(p*M-m*w+g*b)+s*(p*T-_*w+g*R)-r*(p*y-_*b+m*R)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],p=t[12],_=t[13],m=t[14],g=t[15],M=e*o-n*a,T=e*l-s*a,y=e*c-r*a,w=n*l-s*o,b=n*c-r*o,R=s*c-r*l,v=h*_-f*p,E=h*m-u*p,C=h*g-d*p,P=f*m-u*_,N=f*g-d*_,W=u*g-d*m,X=M*W-T*N+y*P+w*C-b*E+R*v;if(X===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/X;return t[0]=(o*W-l*N+c*P)*O,t[1]=(s*N-n*W-r*P)*O,t[2]=(_*R-m*b+g*w)*O,t[3]=(u*b-f*R-d*w)*O,t[4]=(l*C-a*W-c*E)*O,t[5]=(e*W-s*C+r*E)*O,t[6]=(m*y-p*R-g*T)*O,t[7]=(h*R-u*y+d*T)*O,t[8]=(a*N-o*C+c*v)*O,t[9]=(n*C-e*N-r*v)*O,t[10]=(p*b-_*y+g*M)*O,t[11]=(f*y-h*b-d*M)*O,t[12]=(o*E-a*P-l*v)*O,t[13]=(e*P-n*E+s*v)*O,t[14]=(_*T-p*w-m*M)*O,t[15]=(h*w-f*T+u*M)*O,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,p=r*f,_=a*h,m=a*f,g=o*f,M=l*c,T=l*h,y=l*f,w=n.x,b=n.y,R=n.z;return s[0]=(1-(_+g))*w,s[1]=(d+y)*w,s[2]=(p-T)*w,s[3]=0,s[4]=(d-y)*b,s[5]=(1-(u+g))*b,s[6]=(m+M)*b,s[7]=0,s[8]=(p+T)*R,s[9]=(m-M)*R,s[10]=(1-(u+_))*R,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=Di.set(s[0],s[1],s[2]).length();const o=Di.set(s[4],s[5],s[6]).length(),l=Di.set(s[8],s[9],s[10]).length();r<0&&(a=-a),sn.copy(this);const c=1/a,h=1/o,f=1/l;return sn.elements[0]*=c,sn.elements[1]*=c,sn.elements[2]*=c,sn.elements[4]*=h,sn.elements[5]*=h,sn.elements[6]*=h,sn.elements[8]*=f,sn.elements[9]*=f,sn.elements[10]*=f,e.setFromRotationMatrix(sn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,s,r,a,o=Sn,l=!1){const c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s);let p,_;if(l)p=r/(a-r),_=a*r/(a-r);else if(o===Sn)p=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===ws)p=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Sn,l=!1){const c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s);let p,_;if(l)p=1/(a-r),_=a/(a-r);else if(o===Sn)p=-2/(a-r),_=-(a+r)/(a-r);else if(o===ws)p=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Er.prototype.isMatrix4=!0;let ae=Er;const Di=new I,sn=new ae,Pf=new I(0,0,0),Lf=new I(1,1,1),qn=new I,Fs=new I,$e=new I,Dl=new ae,Ul=new is;class si{constructor(t=0,e=0,n=0,s=si.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Gt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Gt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Gt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Gt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Gt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Gt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Lt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Dl.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Dl,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ul.setFromEuler(this),this.setFromQuaternion(Ul,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class _h{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let If=0;const Nl=new I,Ui=new is,Rn=new ae,Os=new I,ls=new I,Df=new I,Uf=new is,Fl=new I(1,0,0),Ol=new I(0,1,0),kl=new I(0,0,1),Bl={type:"added"},Nf={type:"removed"},Ni={type:"childadded",child:null},Zr={type:"childremoved",child:null};class De extends wi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:If++}),this.uuid=ns(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DEFAULT_UP.clone();const t=new I,e=new si,n=new is,s=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ae},normalMatrix:{value:new Nt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=De.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _h,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.multiply(Ui),this}rotateOnWorldAxis(t,e){return Ui.setFromAxisAngle(t,e),this.quaternion.premultiply(Ui),this}rotateX(t){return this.rotateOnAxis(Fl,t)}rotateY(t){return this.rotateOnAxis(Ol,t)}rotateZ(t){return this.rotateOnAxis(kl,t)}translateOnAxis(t,e){return Nl.copy(t).applyQuaternion(this.quaternion),this.position.add(Nl.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Fl,t)}translateY(t){return this.translateOnAxis(Ol,t)}translateZ(t){return this.translateOnAxis(kl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Os.copy(t):Os.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ls.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(ls,Os,this.up):Rn.lookAt(Os,ls,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Ui.setFromRotationMatrix(Rn),this.quaternion.premultiply(Ui.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Kt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Bl),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null):Kt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nf),Zr.child=t,this.dispatchEvent(Zr),Zr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Bl),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ls,t,Df),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ls,Uf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}De.DEFAULT_UP=new I(0,1,0);De.DEFAULT_MATRIX_AUTO_UPDATE=!0;De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Xt extends De{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Ff={type:"move"};class Jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Ff)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Xt;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const vh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},ks={h:0,s:0,l:0};function Qr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wt.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=Wt.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wt.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=Wt.workingColorSpace){if(t=bf(t,1),e=Gt(e,0,1),n=Gt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Qr(a,r,t+1/3),this.g=Qr(a,r,t),this.b=Qr(a,r,t-1/3)}return Wt.colorSpaceToWorking(this,s),this}setStyle(t,e=Ze){function n(r){r!==void 0&&parseFloat(r)<1&&Lt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Lt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Lt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){const n=vh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Lt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=kn(t.r),this.g=kn(t.g),this.b=kn(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return Wt.workingToColorSpace(Fe.copy(this),t),Math.round(Gt(Fe.r*255,0,255))*65536+Math.round(Gt(Fe.g*255,0,255))*256+Math.round(Gt(Fe.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wt.workingColorSpace){Wt.workingToColorSpace(Fe.copy(this),e);const n=Fe.r,s=Fe.g,r=Fe.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Wt.workingColorSpace){return Wt.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Ze){Wt.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,s=Fe.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(ks);const n=Xr(Yn.h,ks.h,e),s=Xr(Yn.s,ks.s,e),r=Xr(Yn.l,ks.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new qt;qt.NAMES=vh;class Of extends De{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const rn=new I,Cn=new I,jr=new I,Pn=new I,Fi=new I,Oi=new I,Hl=new I,ta=new I,ea=new I,na=new I,ia=new fe,sa=new fe,ra=new fe;class cn{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),rn.subVectors(t,e),s.cross(rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){rn.subVectors(s,e),Cn.subVectors(n,e),jr.subVectors(t,e);const a=rn.dot(rn),o=rn.dot(Cn),l=rn.dot(jr),c=Cn.dot(Cn),h=Cn.dot(jr),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-d-p,p,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pn)===null?!1:Pn.x>=0&&Pn.y>=0&&Pn.x+Pn.y<=1}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Pn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Pn.x),l.addScaledVector(a,Pn.y),l.addScaledVector(o,Pn.z),l)}static getInterpolatedAttribute(t,e,n,s,r,a){return ia.setScalar(0),sa.setScalar(0),ra.setScalar(0),ia.fromBufferAttribute(t,e),sa.fromBufferAttribute(t,n),ra.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ia,r.x),a.addScaledVector(sa,r.y),a.addScaledVector(ra,r.z),a}static isFrontFacing(t,e,n,s){return rn.subVectors(n,e),Cn.subVectors(t,e),rn.cross(Cn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return rn.subVectors(this.c,this.b),Cn.subVectors(this.a,this.b),rn.cross(Cn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return cn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return cn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return cn.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return cn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return cn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let a,o;Fi.subVectors(s,n),Oi.subVectors(r,n),ta.subVectors(t,n);const l=Fi.dot(ta),c=Oi.dot(ta);if(l<=0&&c<=0)return e.copy(n);ea.subVectors(t,s);const h=Fi.dot(ea),f=Oi.dot(ea);if(h>=0&&f<=h)return e.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Fi,a);na.subVectors(t,r);const d=Fi.dot(na),p=Oi.dot(na);if(p>=0&&d<=p)return e.copy(r);const _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Oi,o);const m=h*p-d*f;if(m<=0&&f-h>=0&&d-p>=0)return Hl.subVectors(r,s),o=(f-h)/(f-h+(d-p)),e.copy(s).addScaledVector(Hl,o);const g=1/(m+_+u);return a=_*g,o=u*g,e.copy(n).addScaledVector(Fi,a).addScaledVector(Oi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Ls{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(an.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(an.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=an.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,an):an.fromBufferAttribute(r,a),an.applyMatrix4(t.matrixWorld),this.expandByPoint(an);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Bs.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Bs.copy(n.boundingBox)),Bs.applyMatrix4(t.matrixWorld),this.union(Bs)}const s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,an),an.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(cs),Hs.subVectors(this.max,cs),ki.subVectors(t.a,cs),Bi.subVectors(t.b,cs),Hi.subVectors(t.c,cs),$n.subVectors(Bi,ki),Kn.subVectors(Hi,Bi),li.subVectors(ki,Hi);let e=[0,-$n.z,$n.y,0,-Kn.z,Kn.y,0,-li.z,li.y,$n.z,0,-$n.x,Kn.z,0,-Kn.x,li.z,0,-li.x,-$n.y,$n.x,0,-Kn.y,Kn.x,0,-li.y,li.x,0];return!aa(e,ki,Bi,Hi,Hs)||(e=[1,0,0,0,1,0,0,0,1],!aa(e,ki,Bi,Hi,Hs))?!1:(zs.crossVectors($n,Kn),e=[zs.x,zs.y,zs.z],aa(e,ki,Bi,Hi,Hs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,an).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(an).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ln),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Ln=[new I,new I,new I,new I,new I,new I,new I,new I],an=new I,Bs=new Ls,ki=new I,Bi=new I,Hi=new I,$n=new I,Kn=new I,li=new I,cs=new I,Hs=new I,zs=new I,ci=new I;function aa(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){ci.fromArray(i,r);const o=s.x*Math.abs(ci.x)+s.y*Math.abs(ci.y)+s.z*Math.abs(ci.z),l=t.dot(ci),c=e.dot(ci),h=n.dot(ci);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Te=new I,Gs=new ht;let kf=0;class fn extends wi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:kf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=wl,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Gs.fromBufferAttribute(this,e),Gs.applyMatrix3(t),this.setXY(e,Gs.x,Gs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=os(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=We(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=os(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=os(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=os(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=os(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),s=We(s,this.array),r=We(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wl&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class yh extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Mh extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class oe extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}}const Bf=new Ls,hs=new I,oa=new I;class qo{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Bf.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hs.subVectors(t,this.center);const e=hs.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(hs,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hs.copy(t.center).add(oa)),this.expandByPoint(hs.copy(t.center).sub(oa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let Hf=0;const en=new ae,la=new De,zi=new I,Ke=new Ls,us=new Ls,Pe=new I;class Be extends wi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=ns(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(vf(t)?Mh:yh)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Nt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return en.makeRotationFromQuaternion(t),this.applyMatrix4(en),this}rotateX(t){return en.makeRotationX(t),this.applyMatrix4(en),this}rotateY(t){return en.makeRotationY(t),this.applyMatrix4(en),this}rotateZ(t){return en.makeRotationZ(t),this.applyMatrix4(en),this}translate(t,e,n){return en.makeTranslation(t,e,n),this.applyMatrix4(en),this}scale(t,e,n){return en.makeScale(t,e,n),this.applyMatrix4(en),this}lookAt(t){return la.lookAt(t),la.updateMatrix(),this.applyMatrix4(la.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zi).negate(),this.translate(zi.x,zi.y,zi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new oe(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Lt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ls);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Kt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];Ke.setFromBufferAttribute(r),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Kt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new qo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Kt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];us.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(Ke.min,us.min),Ke.expandByPoint(Pe),Pe.addVectors(Ke.max,us.max),Ke.expandByPoint(Pe)):(Ke.expandByPoint(us.min),Ke.expandByPoint(us.max))}Ke.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Pe.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pe.fromBufferAttribute(o,c),l&&(zi.fromBufferAttribute(t,c),Pe.add(zi)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Kt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Kt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new fn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new I,l[v]=new I;const c=new I,h=new I,f=new I,u=new ht,d=new ht,p=new ht,_=new I,m=new I;function g(v,E,C){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,E),f.fromBufferAttribute(n,C),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,E),p.fromBufferAttribute(r,C),h.sub(c),f.sub(c),d.sub(u),p.sub(u);const P=1/(d.x*p.y-p.x*d.y);isFinite(P)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(P),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(P),o[v].add(_),o[E].add(_),o[C].add(_),l[v].add(m),l[E].add(m),l[C].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let v=0,E=M.length;v<E;++v){const C=M[v],P=C.start,N=C.count;for(let W=P,X=P+N;W<X;W+=3)g(t.getX(W+0),t.getX(W+1),t.getX(W+2))}const T=new I,y=new I,w=new I,b=new I;function R(v){w.fromBufferAttribute(s,v),b.copy(w);const E=o[v];T.copy(E),T.sub(w.multiplyScalar(w.dot(E))).normalize(),y.crossVectors(b,E);const P=y.dot(l[v])<0?-1:1;a.setXYZW(v,T.x,T.y,T.z,P)}for(let v=0,E=M.length;v<E;++v){const C=M[v],P=C.start,N=C.count;for(let W=P,X=P+N;W<X;W+=3)R(t.getX(W+0)),R(t.getX(W+1)),R(t.getX(W+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,f=new I;if(t)for(let u=0,d=t.count;u<d;u+=3){const p=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);s.fromBufferAttribute(e,p),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*h;for(let g=0;g<h;g++)u[p++]=c[d++]}return new fn(u,h,f)}if(this.index===null)return Lt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Be,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(e))}const r=t.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let zf=0;class Is extends wi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zf++}),this.uuid=ns(),this.name="",this.type="Material",this.blending=Yi,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Fa,this.blendDst=Oa,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qt(0,0,0),this.blendAlpha=0,this.depthFunc=Ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=El,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Lt(`Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){Lt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Yi&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Fa&&(n.blendSrc=this.blendSrc),this.blendDst!==Oa&&(n.blendDst=this.blendDst),this.blendEquation!==mi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ji&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==El&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new qt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ht().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ht().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const In=new I,ca=new I,Vs=new I,Zn=new I,ha=new I,Ws=new I,ua=new I;class Gf{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,In)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=In.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(In.copy(this.origin).addScaledVector(this.direction,e),In.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ca.copy(t).add(e).multiplyScalar(.5),Vs.copy(e).sub(t).normalize(),Zn.copy(this.origin).sub(ca);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Vs),o=Zn.dot(this.direction),l=-Zn.dot(Vs),c=Zn.lengthSq(),h=Math.abs(1-a*a);let f,u,d,p;if(h>0)if(f=a*l-o,u=a*o-l,p=r*h,f>=0)if(u>=-p)if(u<=p){const _=1/h;f*=_,u*=_,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ca).addScaledVector(Vs,u),d}intersectSphere(t,e){In.subVectors(t.center,this.origin);const n=In.dot(this.direction),s=In.dot(In)-n*n,r=t.radius*t.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,In)!==null}intersectTriangle(t,e,n,s,r){ha.subVectors(e,t),Ws.subVectors(n,t),ua.crossVectors(ha,Ws);let a=this.direction.dot(ua),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zn.subVectors(this.origin,t);const l=o*this.direction.dot(Ws.crossVectors(Zn,Ws));if(l<0)return null;const c=o*this.direction.dot(ha.cross(Zn));if(c<0||l+c>a)return null;const h=-o*Zn.dot(ua);return h<0?null:this.at(h/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Sh extends Is{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=th,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const zl=new ae,hi=new Gf,Xs=new qo,Gl=new I,qs=new I,Ys=new I,$s=new I,fa=new I,Ks=new I,Vl=new I,Zs=new I;class Dt extends De{constructor(t=new Be,e=new Sh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const o=this.morphTargetInfluences;if(r&&o){Ks.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(fa.fromBufferAttribute(f,t),a?Ks.addScaledVector(fa,h):Ks.addScaledVector(fa.sub(e),h))}e.add(Ks)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(r),hi.copy(t.ray).recast(t.near),!(Xs.containsPoint(hi.origin)===!1&&(hi.intersectSphere(Xs,Gl)===null||hi.origin.distanceToSquared(Gl)>(t.far-t.near)**2))&&(zl.copy(r).invert(),hi.copy(t.ray).applyMatrix4(zl),!(n.boundingBox!==null&&hi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,hi)))}_computeIntersections(t,e,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){const m=u[p],g=a[m.materialIndex],M=Math.max(m.start,d.start),T=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let y=M,w=T;y<w;y+=3){const b=o.getX(y),R=o.getX(y+1),v=o.getX(y+2);s=Js(this,g,t,n,c,h,f,b,R,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=p,g=_;m<g;m+=3){const M=o.getX(m),T=o.getX(m+1),y=o.getX(m+2);s=Js(this,a,t,n,c,h,f,M,T,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){const m=u[p],g=a[m.materialIndex],M=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let y=M,w=T;y<w;y+=3){const b=y,R=y+1,v=y+2;s=Js(this,g,t,n,c,h,f,b,R,v),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=p,g=_;m<g;m+=3){const M=m,T=m+1,y=m+2;s=Js(this,a,t,n,c,h,f,M,T,y),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Vf(i,t,e,n,s,r,a,o){let l;if(t.side===qe?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===ii,o),l===null)return null;Zs.copy(o),Zs.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(Zs);return c<e.near||c>e.far?null:{distance:c,point:Zs.clone(),object:i}}function Js(i,t,e,n,s,r,a,o,l,c){i.getVertexPosition(o,qs),i.getVertexPosition(l,Ys),i.getVertexPosition(c,$s);const h=Vf(i,t,e,n,qs,Ys,$s,Vl);if(h){const f=new I;cn.getBarycoord(Vl,qs,Ys,$s,f),s&&(h.uv=cn.getInterpolatedAttribute(s,o,l,c,f,new ht)),r&&(h.uv1=cn.getInterpolatedAttribute(r,o,l,c,f,new ht)),a&&(h.normal=cn.getInterpolatedAttribute(a,o,l,c,f,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new I,materialIndex:0};cn.getNormal(qs,Ys,$s,u.normal),h.face=u,h.barycoord=f}return h}class Wf extends Ge{constructor(t=null,e=1,n=1,s,r,a,o,l,c=Ie,h=Ie,f,u){super(null,a,o,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const da=new I,Xf=new I,qf=new Nt;class pi{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=da.subVectors(n,e).cross(Xf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const s=t.delta(da),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(s,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||qf.getNormalMatrix(t),s=this.coplanarPoint(da).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ui=new qo,Yf=new ht(.5,.5),Qs=new I;class Yo{constructor(t=new pi,e=new pi,n=new pi,s=new pi,r=new pi,a=new pi){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Sn,n=!1){const s=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],p=r[8],_=r[9],m=r[10],g=r[11],M=r[12],T=r[13],y=r[14],w=r[15];if(s[0].setComponents(c-a,d-h,g-p,w-M).normalize(),s[1].setComponents(c+a,d+h,g+p,w+M).normalize(),s[2].setComponents(c+o,d+f,g+_,w+T).normalize(),s[3].setComponents(c-o,d-f,g-_,w-T).normalize(),n)s[4].setComponents(l,u,m,y).normalize(),s[5].setComponents(c-l,d-u,g-m,w-y).normalize();else if(s[4].setComponents(c-l,d-u,g-m,w-y).normalize(),e===Sn)s[5].setComponents(c+l,d+u,g+m,w+y).normalize();else if(e===ws)s[5].setComponents(l,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ui.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ui.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ui)}intersectsSprite(t){ui.center.set(0,0,0);const e=Yf.distanceTo(t.center);return ui.radius=.7071067811865476+e,ui.applyMatrix4(t.matrixWorld),this.intersectsSphere(ui)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Qs.x=s.normal.x>0?t.max.x:t.min.x,Qs.y=s.normal.y>0?t.max.y:t.min.y,Qs.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Qs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class bh extends Ge{constructor(t=[],e=bi,n,s,r,a,o,l,c,h){super(t,e,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ji extends Ge{constructor(t,e,n=En,s,r,a,o=Ie,l=Ie,c,h=zn,f=1){if(h!==zn&&h!==yi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:f};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Xo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class $f extends ji{constructor(t,e=En,n=bi,s,r,a=Ie,o=Ie,l,c=zn){const h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Th extends Ge{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Gn extends Be{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;p("z","y","x",-1,-1,n,e,t,a,r,0),p("z","y","x",1,-1,n,e,-t,a,r,1),p("x","z","y",1,1,t,n,e,s,a,2),p("x","z","y",1,-1,t,n,-e,s,a,3),p("x","y","z",1,-1,t,e,n,s,r,4),p("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2));function p(_,m,g,M,T,y,w,b,R,v,E){const C=y/R,P=w/v,N=y/2,W=w/2,X=b/2,O=R+1,$=v+1;let G=0,Q=0;const tt=new I;for(let at=0;at<$;at++){const gt=at*P-W;for(let yt=0;yt<O;yt++){const Zt=yt*C-N;tt[_]=Zt*M,tt[m]=gt*T,tt[g]=X,c.push(tt.x,tt.y,tt.z),tt[_]=0,tt[m]=0,tt[g]=b>0?1:-1,h.push(tt.x,tt.y,tt.z),f.push(yt/R),f.push(1-at/v),G+=1}}for(let at=0;at<v;at++)for(let gt=0;gt<R;gt++){const yt=u+gt+O*at,Zt=u+gt+O*(at+1),me=u+(gt+1)+O*(at+1),Jt=u+(gt+1)+O*at;l.push(yt,Zt,Jt),l.push(Zt,me,Jt),Q+=6}o.addGroup(d,Q,E),d+=Q,u+=G}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Gn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ke extends Be{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=e/2,f=Math.PI/2*t,u=e,d=2*f+u,p=n*2+r,_=s+1,m=new I,g=new I;for(let M=0;M<=p;M++){let T=0,y=0,w=0,b=0;if(M<=n){const E=M/n,C=E*Math.PI/2;y=-h-t*Math.cos(C),w=t*Math.sin(C),b=-t*Math.cos(C),T=E*f}else if(M<=n+r){const E=(M-n)/r;y=-h+E*e,w=t,b=0,T=f+E*u}else{const E=(M-n-r)/n,C=E*Math.PI/2;y=h+t*Math.sin(C),w=t*Math.cos(C),b=t*Math.sin(C),T=f+u+E*f}const R=Math.max(0,Math.min(1,T/d));let v=0;M===0?v=.5/s:M===p&&(v=-.5/s);for(let E=0;E<=s;E++){const C=E/s,P=C*Math.PI*2,N=Math.sin(P),W=Math.cos(P);g.x=-w*W,g.y=y,g.z=w*N,o.push(g.x,g.y,g.z),m.set(-w*W,b,w*N),m.normalize(),l.push(m.x,m.y,m.z),c.push(C+v,R)}if(M>0){const E=(M-1)*_;for(let C=0;C<s;C++){const P=E+C,N=E+C+1,W=M*_+C,X=M*_+C+1;a.push(P,N,W),a.push(N,X,W)}}}this.setIndex(a),this.setAttribute("position",new oe(o,3)),this.setAttribute("normal",new oe(l,3)),this.setAttribute("uv",new oe(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ke(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Si extends Be{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],u=[],d=[];let p=0;const _=[],m=n/2;let g=0;M(),a===!1&&(t>0&&T(!0),e>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new oe(f,3)),this.setAttribute("normal",new oe(u,3)),this.setAttribute("uv",new oe(d,2));function M(){const y=new I,w=new I;let b=0;const R=(e-t)/n;for(let v=0;v<=r;v++){const E=[],C=v/r,P=C*(e-t)+t;for(let N=0;N<=s;N++){const W=N/s,X=W*l+o,O=Math.sin(X),$=Math.cos(X);w.x=P*O,w.y=-C*n+m,w.z=P*$,f.push(w.x,w.y,w.z),y.set(O,R,$).normalize(),u.push(y.x,y.y,y.z),d.push(W,1-C),E.push(p++)}_.push(E)}for(let v=0;v<s;v++)for(let E=0;E<r;E++){const C=_[E][v],P=_[E+1][v],N=_[E+1][v+1],W=_[E][v+1];(t>0||E!==0)&&(h.push(C,P,W),b+=3),(e>0||E!==r-1)&&(h.push(P,N,W),b+=3)}c.addGroup(g,b,0),g+=b}function T(y){const w=p,b=new ht,R=new I;let v=0;const E=y===!0?t:e,C=y===!0?1:-1;for(let N=1;N<=s;N++)f.push(0,m*C,0),u.push(0,C,0),d.push(.5,.5),p++;const P=p;for(let N=0;N<=s;N++){const X=N/s*l+o,O=Math.cos(X),$=Math.sin(X);R.x=E*$,R.y=m*C,R.z=E*O,f.push(R.x,R.y,R.z),u.push(0,C,0),b.x=O*.5+.5,b.y=$*.5*C+.5,d.push(b.x,b.y),p++}for(let N=0;N<s;N++){const W=w+N,X=P+N;y===!0?h.push(X,X+1,W):h.push(X+1,X,W),v+=3}c.addGroup(g,v,y===!0?1:2),g+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Si(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $o extends Si{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new $o(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class An{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Lt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,d=(a-h)/u;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new ht:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,s=[],r=[],a=[],o=new I,l=new ae;for(let d=0;d<=t;d++){const p=d/t;s[d]=this.getTangentAt(p,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Gt(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,p))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Gt(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let p=1;p<=t;p++)r[p].applyMatrix4(l.makeRotationAxis(s[p],d*p)),a[p].crossVectors(s[p],r[p])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ko extends An{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ht){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Kf extends Ko{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Zo(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,s(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return i+t*r+e*a+n*o}}}const Wl=new I,Xl=new I,pa=new Zo,ma=new Zo,ga=new Zo;class Zf extends An{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new I){const n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Xl.subVectors(s[0],s[1]).add(s[0]),c=Xl);const f=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Wl.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Wl),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(u),d),m=Math.pow(u.distanceToSquared(h),d);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),pa.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,p,_,m),ma.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,p,_,m),ga.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,p,_,m)}else this.curveType==="catmullrom"&&(pa.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),ma.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),ga.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return n.set(pa.calc(l),ma.calc(l),ga.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new I().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ql(i,t,e,n,s){const r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function Jf(i,t){const e=1-i;return e*e*t}function Qf(i,t){return 2*(1-i)*i*t}function jf(i,t){return i*i*t}function vs(i,t,e,n){return Jf(i,t)+Qf(i,e)+jf(i,n)}function td(i,t){const e=1-i;return e*e*e*t}function ed(i,t){const e=1-i;return 3*e*e*i*t}function nd(i,t){return 3*(1-i)*i*i*t}function id(i,t){return i*i*i*t}function ys(i,t,e,n,s){return td(i,t)+ed(i,e)+nd(i,n)+id(i,s)}class Eh extends An{constructor(t=new ht,e=new ht,n=new ht,s=new ht){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ys(t,s.x,r.x,a.x,o.x),ys(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class sd extends An{constructor(t=new I,e=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ys(t,s.x,r.x,a.x,o.x),ys(t,s.y,r.y,a.y,o.y),ys(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class wh extends An{constructor(t=new ht,e=new ht){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ht){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ht){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class rd extends An{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ah extends An{constructor(t=new ht,e=new ht,n=new ht){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ht){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(vs(t,s.x,r.x,a.x),vs(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ad extends An{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(vs(t,s.x,r.x,a.x),vs(t,s.y,r.y,a.y),vs(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rh extends An{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ht){const n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(ql(o,l.x,c.x,h.x,f.x),ql(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new ht().fromArray(s))}return this}}var Yl=Object.freeze({__proto__:null,ArcCurve:Kf,CatmullRomCurve3:Zf,CubicBezierCurve:Eh,CubicBezierCurve3:sd,EllipseCurve:Ko,LineCurve:wh,LineCurve3:rd,QuadraticBezierCurve:Ah,QuadraticBezierCurve3:ad,SplineCurve:Rh});class od extends An{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Yl[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new Yl[s.type]().fromJSON(s))}return this}}class $l extends od{constructor(t){super(),this.type="Path",this.currentPoint=new ht,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new wh(this.currentPoint.clone(),new ht(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new Ah(this.currentPoint.clone(),new ht(t,e),new ht(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){const o=new Eh(this.currentPoint.clone(),new ht(t,e),new ht(n,s),new ht(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Rh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){const c=new Ko(t,e,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ch extends $l{constructor(t){super(t),this.uuid=ns(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new $l().fromJSON(s))}return this}}function ld(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=Ph(i,0,s,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=dd(i,t,r,e)),i.length>80*e){o=i[0],l=i[1];let h=o,f=l;for(let u=e;u<s;u+=e){const d=i[u],p=i[u+1];d<o&&(o=d),p<l&&(l=p),d>h&&(h=d),p>f&&(f=p)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return As(r,a,e,o,l,c,0),a}function Ph(i,t,e,n,s){let r;if(s===Td(i,t,e,n)>0)for(let a=t;a<e;a+=n)r=Kl(a/n|0,i[a],i[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Kl(a/n|0,i[a],i[a+1],r);return r&&ts(r,r.next)&&(Cs(r),r=r.next),r}function Ei(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ts(e,e.next)||de(e.prev,e,e.next)===0)){if(Cs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function As(i,t,e,n,s,r,a){if(!i)return;!a&&r&&_d(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?hd(i,n,s,r):cd(i)){t.push(l.i,i.i,c.i),Cs(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=ud(Ei(i),t),As(i,t,e,n,s,r,2)):a===2&&fd(i,t,e,n,s,r):As(Ei(i),t,e,n,s,r,1);break}}}function cd(i){const t=i.prev,e=i,n=i.next;if(de(t,e,n)>=0)return!1;const s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),u=Math.max(s,r,a),d=Math.max(o,l,c);let p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=f&&p.y<=d&&gs(s,o,r,l,a,c,p.x,p.y)&&de(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function hd(i,t,e,n){const s=i.prev,r=i,a=i.next;if(de(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,u=a.y,d=Math.min(o,l,c),p=Math.min(h,f,u),_=Math.max(o,l,c),m=Math.max(h,f,u),g=wo(d,p,t,e,n),M=wo(_,m,t,e,n);let T=i.prevZ,y=i.nextZ;for(;T&&T.z>=g&&y&&y.z<=M;){if(T.x>=d&&T.x<=_&&T.y>=p&&T.y<=m&&T!==s&&T!==a&&gs(o,h,l,f,c,u,T.x,T.y)&&de(T.prev,T,T.next)>=0||(T=T.prevZ,y.x>=d&&y.x<=_&&y.y>=p&&y.y<=m&&y!==s&&y!==a&&gs(o,h,l,f,c,u,y.x,y.y)&&de(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;T&&T.z>=g;){if(T.x>=d&&T.x<=_&&T.y>=p&&T.y<=m&&T!==s&&T!==a&&gs(o,h,l,f,c,u,T.x,T.y)&&de(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;y&&y.z<=M;){if(y.x>=d&&y.x<=_&&y.y>=p&&y.y<=m&&y!==s&&y!==a&&gs(o,h,l,f,c,u,y.x,y.y)&&de(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function ud(i,t){let e=i;do{const n=e.prev,s=e.next.next;!ts(n,s)&&Ih(n,e,e.next,s)&&Rs(n,s)&&Rs(s,n)&&(t.push(n.i,e.i,s.i),Cs(e),Cs(e.next),e=i=s),e=e.next}while(e!==i);return Ei(e)}function fd(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Md(a,o)){let l=Dh(a,o);a=Ei(a,a.next),l=Ei(l,l.next),As(a,t,e,n,s,r,0),As(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function dd(i,t,e,n){const s=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,c=Ph(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(yd(c))}s.sort(pd);for(let r=0;r<s.length;r++)e=md(s[r],e);return e}function pd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function md(i,t){const e=gd(i,t);if(!e)return t;const n=Dh(e,i);return Ei(n,n.next),Ei(e,e.next)}function gd(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,a;if(ts(i,e))return e;do{if(ts(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const f=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Lh(s<c?n:r,s,l,c,s<c?r:n,s,e.x,e.y)){const f=Math.abs(s-e.y)/(n-e.x);Rs(e,i)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&xd(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function xd(i,t){return de(i.prev,i,t.prev)<0&&de(t.next,i,i.next)<0}function _d(i,t,e,n){let s=i;do s.z===0&&(s.z=wo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,vd(s)}function vd(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,e*=2}while(t>1);return i}function wo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function yd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Lh(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function gs(i,t,e,n,s,r,a,o){return!(i===a&&t===o)&&Lh(i,t,e,n,s,r,a,o)}function Md(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Sd(i,t)&&(Rs(i,t)&&Rs(t,i)&&bd(i,t)&&(de(i.prev,i,t.prev)||de(i,t.prev,t))||ts(i,t)&&de(i.prev,i,i.next)>0&&de(t.prev,t,t.next)>0)}function de(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ts(i,t){return i.x===t.x&&i.y===t.y}function Ih(i,t,e,n){const s=tr(de(i,t,e)),r=tr(de(i,t,n)),a=tr(de(e,n,i)),o=tr(de(e,n,t));return!!(s!==r&&a!==o||s===0&&js(i,e,t)||r===0&&js(i,n,t)||a===0&&js(e,i,n)||o===0&&js(e,t,n))}function js(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function tr(i){return i>0?1:i<0?-1:0}function Sd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Ih(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Rs(i,t){return de(i.prev,i,i.next)<0?de(i,t,i.next)>=0&&de(i,i.prev,t)>=0:de(i,t,i.prev)<0||de(i,i.next,t)<0}function bd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Dh(i,t){const e=Ao(i.i,i.x,i.y),n=Ao(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Kl(i,t,e,n){const s=Ao(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Cs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Ao(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Td(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class Ed{static triangulate(t,e,n=2){return ld(t,e,n)}}class Ms{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return Ms.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];Zl(t),Jl(n,t);let a=t.length;e.forEach(Zl);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,Jl(n,e[l]);const o=Ed.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Zl(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Jl(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ar extends Be{constructor(t=[new ht(0,-.5),new ht(.5,0),new ht(0,.5)],e=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:s},e=Math.floor(e),s=Gt(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/e,f=new I,u=new ht,d=new I,p=new I,_=new I;let m=0,g=0;for(let M=0;M<=t.length-1;M++)switch(M){case 0:m=t[M+1].x-t[M].x,g=t[M+1].y-t[M].y,d.x=g*1,d.y=-m,d.z=g*0,_.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[M+1].x-t[M].x,g=t[M+1].y-t[M].y,d.x=g*1,d.y=-m,d.z=g*0,p.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),l.push(d.x,d.y,d.z),_.copy(p)}for(let M=0;M<=e;M++){const T=n+M*h*s,y=Math.sin(T),w=Math.cos(T);for(let b=0;b<=t.length-1;b++){f.x=t[b].x*y,f.y=t[b].y,f.z=t[b].x*w,a.push(f.x,f.y,f.z),u.x=M/e,u.y=b/(t.length-1),o.push(u.x,u.y);const R=l[3*b+0]*y,v=l[3*b+1],E=l[3*b+0]*w;c.push(R,v,E)}}for(let M=0;M<e;M++)for(let T=0;T<t.length-1;T++){const y=T+M*t.length,w=y,b=y+t.length,R=y+t.length+1,v=y+1;r.push(w,b,v),r.push(R,v,b)}this.setIndex(r),this.setAttribute("position",new oe(a,3)),this.setAttribute("uv",new oe(o,2)),this.setAttribute("normal",new oe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ar(t.points,t.segments,t.phiStart,t.phiLength)}}class Rr extends Be{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=t/o,u=e/l,d=[],p=[],_=[],m=[];for(let g=0;g<h;g++){const M=g*u-a;for(let T=0;T<c;T++){const y=T*f-r;p.push(y,-M,0),_.push(0,0,1),m.push(T/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let M=0;M<o;M++){const T=M+c*g,y=M+c*(g+1),w=M+1+c*(g+1),b=M+1+c*g;d.push(T,y,b),d.push(y,w,b)}this.setIndex(d),this.setAttribute("position",new oe(p,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rr(t.width,t.height,t.widthSegments,t.heightSegments)}}class Jo extends Be{constructor(t=new Ch([new ht(0,.5),new ht(-.5,-.5),new ht(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new oe(s,3)),this.setAttribute("normal",new oe(r,3)),this.setAttribute("uv",new oe(a,2));function c(h){const f=s.length/3,u=h.extractPoints(e);let d=u.shape;const p=u.holes;Ms.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,g=p.length;m<g;m++){const M=p[m];Ms.isClockWise(M)===!0&&(p[m]=M.reverse())}const _=Ms.triangulateShape(d,p);for(let m=0,g=p.length;m<g;m++){const M=p[m];d=d.concat(M)}for(let m=0,g=d.length;m<g;m++){const M=d[m];s.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let m=0,g=_.length;m<g;m++){const M=_[m],T=M[0]+f,y=M[1]+f,w=M[2]+f;n.push(T,y,w),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return wd(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const a=e[t.shapes[s]];n.push(a)}return new Jo(n,t.curveSegments)}}function wd(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Xe extends Be{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new I,u=new I,d=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){const M=[],T=g/n,y=a+T*o,w=t*Math.cos(y),b=Math.sqrt(t*t-w*w);let R=0;g===0&&a===0?R=.5/e:g===n&&l===Math.PI&&(R=-.5/e);for(let v=0;v<=e;v++){const E=v/e,C=s+E*r;f.x=-b*Math.cos(C),f.y=w,f.z=b*Math.sin(C),p.push(f.x,f.y,f.z),u.copy(f).normalize(),_.push(u.x,u.y,u.z),m.push(E+R,1-T),M.push(c++)}h.push(M)}for(let g=0;g<n;g++)for(let M=0;M<e;M++){const T=h[g][M+1],y=h[g][M],w=h[g+1][M],b=h[g+1][M+1];(g!==0||a>0)&&d.push(T,y,b),(g!==n-1||l<Math.PI)&&d.push(y,w,b)}this.setIndex(d),this.setAttribute("position",new oe(p,3)),this.setAttribute("normal",new oe(_,3)),this.setAttribute("uv",new oe(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xe(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Qo extends Be{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],f=[],u=new I,d=new I,p=new I;for(let _=0;_<=n;_++){const m=a+_/n*o;for(let g=0;g<=s;g++){const M=g/s*r;d.x=(t+e*Math.cos(m))*Math.cos(M),d.y=(t+e*Math.cos(m))*Math.sin(M),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),p.subVectors(d,u).normalize(),h.push(p.x,p.y,p.z),f.push(g/s),f.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=s;m++){const g=(s+1)*_+m-1,M=(s+1)*(_-1)+m-1,T=(s+1)*(_-1)+m,y=(s+1)*_+m;l.push(g,M,y),l.push(M,T,y)}this.setIndex(l),this.setAttribute("position",new oe(c,3)),this.setAttribute("normal",new oe(h,3)),this.setAttribute("uv",new oe(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Qo(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}function es(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];if(Ql(s))s.isRenderTargetTexture?(Lt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Ql(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function ze(i){const t={};for(let e=0;e<i.length;e++){const n=es(i[e]);for(const s in n)t[s]=n[s]}return t}function Ql(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Ad(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Uh(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Wt.workingColorSpace}const Rd={clone:es,merge:ze};var Cd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class wn extends Is{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cd,this.fragmentShader=Pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=es(t.uniforms),this.uniformsGroups=Ad(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new qt().setHex(s.value);break;case"v2":this.uniforms[n].value=new ht().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new fe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Nt().fromArray(s.value);break;case"m4":this.uniforms[n].value=new ae().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Ld extends wn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Nh extends Is{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new qt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=To,this.normalScale=new ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Id extends Is{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Dd extends Is{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Fh extends De{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new qt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Ud extends Fh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const xa=new ae,jl=new I,tc=new I;class Nd{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ht(512,512),this.mapType=Je,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yo,this._frameExtents=new ht(1,1),this._viewportCount=1,this._viewports=[new fe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;jl.setFromMatrixPosition(t.matrixWorld),e.position.copy(jl),tc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tc),e.updateMatrixWorld(),xa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xa,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===ws||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(xa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const er=new I,nr=new is,gn=new I;class Oh extends De{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(er,nr,gn),gn.x===1&&gn.y===1&&gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(er,nr,gn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(er,nr,gn),gn.x===1&&gn.y===1&&gn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(er,nr,gn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Jn=new I,ec=new ht,nc=new ht;class ln extends Oh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Eo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Wr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Eo*2*Math.atan(Math.tan(Wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z),Jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Jn.x,Jn.y).multiplyScalar(-t/Jn.z)}getViewSize(t,e){return this.getViewBounds(t,ec,nc),e.subVectors(nc,ec)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Wr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Cr extends Oh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Fd extends Nd{constructor(){super(new Cr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ic extends Fh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.target=new De,this.shadow=new Fd}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const Gi=-90,Vi=1;class Od extends De{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Gi,Vi,t,e);s.layers=this.layers,this.add(s);const r=new ln(Gi,Vi,t,e);r.layers=this.layers,this.add(r);const a=new ln(Gi,Vi,t,e);a.layers=this.layers,this.add(a);const o=new ln(Gi,Vi,t,e);o.layers=this.layers,this.add(o);const l=new ln(Gi,Vi,t,e);l.layers=this.layers,this.add(l);const c=new ln(Gi,Vi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ws)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class kd extends ln{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const sl=class sl{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){const r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};sl.prototype.isMatrix2=!0;let sc=sl;function rc(i,t,e,n){const s=Bd(n);switch(e){case dh:return i*t;case mh:return i*t/s.components*s.byteLength;case Ho:return i*t/s.components*s.byteLength;case Ti:return i*t*2/s.components*s.byteLength;case zo:return i*t*2/s.components*s.byteLength;case ph:return i*t*3/s.components*s.byteLength;case un:return i*t*4/s.components*s.byteLength;case Go:return i*t*4/s.components*s.byteLength;case ur:case fr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case dr:case pr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case $a:case Za:return Math.max(i,16)*Math.max(t,8)/4;case Ya:case Ka:return Math.max(i,8)*Math.max(t,8)/2;case Ja:case Qa:case to:case eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ja:case vr:case no:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case so:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case ro:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case ao:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case oo:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case lo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case co:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ho:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case uo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case fo:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case po:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case mo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case go:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case xo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case _o:case vo:case yo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Mo:case So:return Math.ceil(i/4)*Math.ceil(t/4)*8;case yr:case bo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Bd(i){switch(i){case Je:case ch:return{byteLength:1,components:1};case Ts:case hh:case Hn:return{byteLength:2,components:1};case ko:case Bo:return{byteLength:2,components:4};case En:case Oo:case Mn:return{byteLength:4,components:1};case uh:case fh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Fo}}));typeof window<"u"&&(window.__THREE__?Lt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Fo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function kh(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Hd(i){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){const p=f[u],_=f[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++u,f[u]=_)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){const _=f[d];i.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var zd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Gd=`#ifdef USE_ALPHAHASH
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
#endif`,Vd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Xd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Yd=`#ifdef USE_AOMAP
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
#endif`,$d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Kd=`#ifdef USE_BATCHING
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
#endif`,Zd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Jd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Qd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,tp=`#ifdef USE_IRIDESCENCE
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
#endif`,ep=`#ifdef USE_BUMPMAP
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
#endif`,np=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,ip=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,rp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ap=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,op=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,lp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,cp=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,hp=`#define PI 3.141592653589793
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
} // validated`,up=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,fp=`vec3 transformedNormal = objectNormal;
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
#endif`,dp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,pp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,mp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,gp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xp="gl_FragColor = linearToOutputTexel( gl_FragColor );",_p=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,vp=`#ifdef USE_ENVMAP
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
#endif`,yp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Mp=`#ifdef USE_ENVMAP
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
#endif`,Sp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,bp=`#ifdef USE_ENVMAP
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
#endif`,Tp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ep=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,wp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Ap=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Rp=`#ifdef USE_GRADIENTMAP
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
}`,Cp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Pp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ip=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Dp=`#ifdef USE_ENVMAP
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
#endif`,Up=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Fp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Op=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kp=`PhysicalMaterial material;
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
#endif`,Bp=`uniform sampler2D dfgLUT;
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
}`,Hp=`
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
#endif`,zp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Gp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Vp=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Wp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Xp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Yp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$p=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Kp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jp=`#if defined( USE_POINTS_UV )
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
#endif`,Qp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,jp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,em=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nm=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,im=`#ifdef USE_MORPHTARGETS
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
#endif`,sm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,am=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,om=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,cm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,hm=`#ifdef USE_NORMALMAP
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
#endif`,um=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,fm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,dm=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,xm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_m=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,vm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ym=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Mm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Sm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,bm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Tm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Em=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,wm=`float getShadowMask() {
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
}`,Am=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Rm=`#ifdef USE_SKINNING
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
#endif`,Cm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Pm=`#ifdef USE_SKINNING
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
#endif`,Lm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Im=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Dm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Um=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Nm=`#ifdef USE_TRANSMISSION
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
#endif`,Fm=`#ifdef USE_TRANSMISSION
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
#endif`,Om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Bm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const zm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Gm=`uniform sampler2D t2D;
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
}`,Vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Wm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Xm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`#include <common>
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
}`,$m=`#if DEPTH_PACKING == 3200
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
}`,Km=`#define DISTANCE
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
}`,Zm=`#define DISTANCE
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
}`,Jm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Qm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jm=`uniform float scale;
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
}`,t0=`uniform vec3 diffuse;
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
}`,e0=`#include <common>
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
}`,n0=`uniform vec3 diffuse;
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
}`,i0=`#define LAMBERT
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
}`,s0=`#define LAMBERT
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
}`,r0=`#define MATCAP
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
}`,a0=`#define MATCAP
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
}`,o0=`#define NORMAL
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
}`,l0=`#define NORMAL
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
}`,c0=`#define PHONG
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
}`,h0=`#define PHONG
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
}`,u0=`#define STANDARD
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
}`,f0=`#define STANDARD
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
}`,d0=`#define TOON
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
}`,p0=`#define TOON
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
}`,m0=`uniform float size;
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
}`,g0=`uniform vec3 diffuse;
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
}`,x0=`#include <common>
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
}`,_0=`uniform vec3 color;
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
}`,v0=`uniform float rotation;
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
}`,y0=`uniform vec3 diffuse;
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
}`,Bt={alphahash_fragment:zd,alphahash_pars_fragment:Gd,alphamap_fragment:Vd,alphamap_pars_fragment:Wd,alphatest_fragment:Xd,alphatest_pars_fragment:qd,aomap_fragment:Yd,aomap_pars_fragment:$d,batching_pars_vertex:Kd,batching_vertex:Zd,begin_vertex:Jd,beginnormal_vertex:Qd,bsdfs:jd,iridescence_fragment:tp,bumpmap_pars_fragment:ep,clipping_planes_fragment:np,clipping_planes_pars_fragment:ip,clipping_planes_pars_vertex:sp,clipping_planes_vertex:rp,color_fragment:ap,color_pars_fragment:op,color_pars_vertex:lp,color_vertex:cp,common:hp,cube_uv_reflection_fragment:up,defaultnormal_vertex:fp,displacementmap_pars_vertex:dp,displacementmap_vertex:pp,emissivemap_fragment:mp,emissivemap_pars_fragment:gp,colorspace_fragment:xp,colorspace_pars_fragment:_p,envmap_fragment:vp,envmap_common_pars_fragment:yp,envmap_pars_fragment:Mp,envmap_pars_vertex:Sp,envmap_physical_pars_fragment:Dp,envmap_vertex:bp,fog_vertex:Tp,fog_pars_vertex:Ep,fog_fragment:wp,fog_pars_fragment:Ap,gradientmap_pars_fragment:Rp,lightmap_pars_fragment:Cp,lights_lambert_fragment:Pp,lights_lambert_pars_fragment:Lp,lights_pars_begin:Ip,lights_toon_fragment:Up,lights_toon_pars_fragment:Np,lights_phong_fragment:Fp,lights_phong_pars_fragment:Op,lights_physical_fragment:kp,lights_physical_pars_fragment:Bp,lights_fragment_begin:Hp,lights_fragment_maps:zp,lights_fragment_end:Gp,lightprobes_pars_fragment:Vp,logdepthbuf_fragment:Wp,logdepthbuf_pars_fragment:Xp,logdepthbuf_pars_vertex:qp,logdepthbuf_vertex:Yp,map_fragment:$p,map_pars_fragment:Kp,map_particle_fragment:Zp,map_particle_pars_fragment:Jp,metalnessmap_fragment:Qp,metalnessmap_pars_fragment:jp,morphinstance_vertex:tm,morphcolor_vertex:em,morphnormal_vertex:nm,morphtarget_pars_vertex:im,morphtarget_vertex:sm,normal_fragment_begin:rm,normal_fragment_maps:am,normal_pars_fragment:om,normal_pars_vertex:lm,normal_vertex:cm,normalmap_pars_fragment:hm,clearcoat_normal_fragment_begin:um,clearcoat_normal_fragment_maps:fm,clearcoat_pars_fragment:dm,iridescence_pars_fragment:pm,opaque_fragment:mm,packing:gm,premultiplied_alpha_fragment:xm,project_vertex:_m,dithering_fragment:vm,dithering_pars_fragment:ym,roughnessmap_fragment:Mm,roughnessmap_pars_fragment:Sm,shadowmap_pars_fragment:bm,shadowmap_pars_vertex:Tm,shadowmap_vertex:Em,shadowmask_pars_fragment:wm,skinbase_vertex:Am,skinning_pars_vertex:Rm,skinning_vertex:Cm,skinnormal_vertex:Pm,specularmap_fragment:Lm,specularmap_pars_fragment:Im,tonemapping_fragment:Dm,tonemapping_pars_fragment:Um,transmission_fragment:Nm,transmission_pars_fragment:Fm,uv_pars_fragment:Om,uv_pars_vertex:km,uv_vertex:Bm,worldpos_vertex:Hm,background_vert:zm,background_frag:Gm,backgroundCube_vert:Vm,backgroundCube_frag:Wm,cube_vert:Xm,cube_frag:qm,depth_vert:Ym,depth_frag:$m,distance_vert:Km,distance_frag:Zm,equirect_vert:Jm,equirect_frag:Qm,linedashed_vert:jm,linedashed_frag:t0,meshbasic_vert:e0,meshbasic_frag:n0,meshlambert_vert:i0,meshlambert_frag:s0,meshmatcap_vert:r0,meshmatcap_frag:a0,meshnormal_vert:o0,meshnormal_frag:l0,meshphong_vert:c0,meshphong_frag:h0,meshphysical_vert:u0,meshphysical_frag:f0,meshtoon_vert:d0,meshtoon_frag:p0,points_vert:m0,points_frag:g0,shadow_vert:x0,shadow_frag:_0,sprite_vert:v0,sprite_frag:y0},ft={common:{diffuse:{value:new qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new qt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},yn={basic:{uniforms:ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:Bt.meshbasic_vert,fragmentShader:Bt.meshbasic_frag},lambert:{uniforms:ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new qt(0)},envMapIntensity:{value:1}}]),vertexShader:Bt.meshlambert_vert,fragmentShader:Bt.meshlambert_frag},phong:{uniforms:ze([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new qt(0)},specular:{value:new qt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphong_vert,fragmentShader:Bt.meshphong_frag},standard:{uniforms:ze([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag},toon:{uniforms:ze([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new qt(0)}}]),vertexShader:Bt.meshtoon_vert,fragmentShader:Bt.meshtoon_frag},matcap:{uniforms:ze([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:Bt.meshmatcap_vert,fragmentShader:Bt.meshmatcap_frag},points:{uniforms:ze([ft.points,ft.fog]),vertexShader:Bt.points_vert,fragmentShader:Bt.points_frag},dashed:{uniforms:ze([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Bt.linedashed_vert,fragmentShader:Bt.linedashed_frag},depth:{uniforms:ze([ft.common,ft.displacementmap]),vertexShader:Bt.depth_vert,fragmentShader:Bt.depth_frag},normal:{uniforms:ze([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:Bt.meshnormal_vert,fragmentShader:Bt.meshnormal_frag},sprite:{uniforms:ze([ft.sprite,ft.fog]),vertexShader:Bt.sprite_vert,fragmentShader:Bt.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Bt.background_vert,fragmentShader:Bt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:Bt.backgroundCube_vert,fragmentShader:Bt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Bt.cube_vert,fragmentShader:Bt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Bt.equirect_vert,fragmentShader:Bt.equirect_frag},distance:{uniforms:ze([ft.common,ft.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Bt.distance_vert,fragmentShader:Bt.distance_frag},shadow:{uniforms:ze([ft.lights,ft.fog,{color:{value:new qt(0)},opacity:{value:1}}]),vertexShader:Bt.shadow_vert,fragmentShader:Bt.shadow_frag}};yn.physical={uniforms:ze([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new qt(0)},specularColor:{value:new qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:Bt.meshphysical_vert,fragmentShader:Bt.meshphysical_frag};const ir={r:0,b:0,g:0},M0=new ae,Bh=new Nt;Bh.set(-1,0,0,0,1,0,0,0,1);function S0(i,t,e,n,s,r){const a=new qt(0);let o=s===!0?0:1,l,c,h=null,f=0,u=null;function d(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){const y=M.backgroundBlurriness>0;T=t.get(T,y)}return T}function p(M){let T=!1;const y=d(M);y===null?m(a,o):y&&y.isColor&&(m(y,1),T=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?e.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function _(M,T){const y=d(T);y&&(y.isCubeTexture||y.mapping===wr)?(c===void 0&&(c=new Dt(new Gn(1,1,1),new wn({name:"BackgroundCubeMaterial",uniforms:es(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(M0.makeRotationFromEuler(T.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Bh),c.material.toneMapped=Wt.getTransfer(y.colorSpace)!==ee,(h!==y||f!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Dt(new Rr(2,2),new wn({name:"BackgroundMaterial",uniforms:es(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Wt.getTransfer(y.colorSpace)!==ee,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,T){M.getRGB(ir,Uh(i)),e.buffers.color.setClear(ir.r,ir.g,ir.b,T,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,T=1){a.set(M),o=T,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:p,addToRenderList:_,dispose:g}}function b0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(P,N,W,X,O){let $=!1;const G=f(P,X,W,N);r!==G&&(r=G,c(r.object)),$=d(P,X,W,O),$&&p(P,X,W,O),O!==null&&t.update(O,i.ELEMENT_ARRAY_BUFFER),($||a)&&(a=!1,y(P,N,W,X),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(O).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function f(P,N,W,X){const O=X.wireframe===!0;let $=n[N.id];$===void 0&&($={},n[N.id]=$);const G=P.isInstancedMesh===!0?P.id:0;let Q=$[G];Q===void 0&&(Q={},$[G]=Q);let tt=Q[W.id];tt===void 0&&(tt={},Q[W.id]=tt);let at=tt[O];return at===void 0&&(at=u(l()),tt[O]=at),at}function u(P){const N=[],W=[],X=[];for(let O=0;O<e;O++)N[O]=0,W[O]=0,X[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:W,attributeDivisors:X,object:P,attributes:{},index:null}}function d(P,N,W,X){const O=r.attributes,$=N.attributes;let G=0;const Q=W.getAttributes();for(const tt in Q)if(Q[tt].location>=0){const gt=O[tt];let yt=$[tt];if(yt===void 0&&(tt==="instanceMatrix"&&P.instanceMatrix&&(yt=P.instanceMatrix),tt==="instanceColor"&&P.instanceColor&&(yt=P.instanceColor)),gt===void 0||gt.attribute!==yt||yt&&gt.data!==yt.data)return!0;G++}return r.attributesNum!==G||r.index!==X}function p(P,N,W,X){const O={},$=N.attributes;let G=0;const Q=W.getAttributes();for(const tt in Q)if(Q[tt].location>=0){let gt=$[tt];gt===void 0&&(tt==="instanceMatrix"&&P.instanceMatrix&&(gt=P.instanceMatrix),tt==="instanceColor"&&P.instanceColor&&(gt=P.instanceColor));const yt={};yt.attribute=gt,gt&&gt.data&&(yt.data=gt.data),O[tt]=yt,G++}r.attributes=O,r.attributesNum=G,r.index=X}function _(){const P=r.newAttributes;for(let N=0,W=P.length;N<W;N++)P[N]=0}function m(P){g(P,0)}function g(P,N){const W=r.newAttributes,X=r.enabledAttributes,O=r.attributeDivisors;W[P]=1,X[P]===0&&(i.enableVertexAttribArray(P),X[P]=1),O[P]!==N&&(i.vertexAttribDivisor(P,N),O[P]=N)}function M(){const P=r.newAttributes,N=r.enabledAttributes;for(let W=0,X=N.length;W<X;W++)N[W]!==P[W]&&(i.disableVertexAttribArray(W),N[W]=0)}function T(P,N,W,X,O,$,G){G===!0?i.vertexAttribIPointer(P,N,W,O,$):i.vertexAttribPointer(P,N,W,X,O,$)}function y(P,N,W,X){_();const O=X.attributes,$=W.getAttributes(),G=N.defaultAttributeValues;for(const Q in $){const tt=$[Q];if(tt.location>=0){let at=O[Q];if(at===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(at=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(at=P.instanceColor)),at!==void 0){const gt=at.normalized,yt=at.itemSize,Zt=t.get(at);if(Zt===void 0)continue;const me=Zt.buffer,Jt=Zt.type,J=Zt.bytesPerElement,st=Jt===i.INT||Jt===i.UNSIGNED_INT||at.gpuType===Oo;if(at.isInterleavedBufferAttribute){const et=at.data,It=et.stride,Ft=at.offset;if(et.isInstancedInterleavedBuffer){for(let Ct=0;Ct<tt.locationSize;Ct++)g(tt.location+Ct,et.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let Ct=0;Ct<tt.locationSize;Ct++)m(tt.location+Ct);i.bindBuffer(i.ARRAY_BUFFER,me);for(let Ct=0;Ct<tt.locationSize;Ct++)T(tt.location+Ct,yt/tt.locationSize,Jt,gt,It*J,(Ft+yt/tt.locationSize*Ct)*J,st)}else{if(at.isInstancedBufferAttribute){for(let et=0;et<tt.locationSize;et++)g(tt.location+et,at.meshPerAttribute);P.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let et=0;et<tt.locationSize;et++)m(tt.location+et);i.bindBuffer(i.ARRAY_BUFFER,me);for(let et=0;et<tt.locationSize;et++)T(tt.location+et,yt/tt.locationSize,Jt,gt,yt*J,yt/tt.locationSize*et*J,st)}}else if(G!==void 0){const gt=G[Q];if(gt!==void 0)switch(gt.length){case 2:i.vertexAttrib2fv(tt.location,gt);break;case 3:i.vertexAttrib3fv(tt.location,gt);break;case 4:i.vertexAttrib4fv(tt.location,gt);break;default:i.vertexAttrib1fv(tt.location,gt)}}}}M()}function w(){E();for(const P in n){const N=n[P];for(const W in N){const X=N[W];for(const O in X){const $=X[O];for(const G in $)h($[G].object),delete $[G];delete X[O]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const N=n[P.id];for(const W in N){const X=N[W];for(const O in X){const $=X[O];for(const G in $)h($[G].object),delete $[G];delete X[O]}}delete n[P.id]}function R(P){for(const N in n){const W=n[N];for(const X in W){const O=W[X];if(O[P.id]===void 0)continue;const $=O[P.id];for(const G in $)h($[G].object),delete $[G];delete O[P.id]}}}function v(P){for(const N in n){const W=n[N],X=P.isInstancedMesh===!0?P.id:0,O=W[X];if(O!==void 0){for(const $ in O){const G=O[$];for(const Q in G)h(G[Q].object),delete G[Q];delete O[$]}delete W[X],Object.keys(W).length===0&&delete n[N]}}}function E(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:w,releaseStatesOfGeometry:b,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function T0(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function E0(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==un&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const v=R===Hn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==Je&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Mn&&!v)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(Lt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Lt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),g=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),w=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:y,maxSamples:w,samples:b}}function w0(i){const t=this;let e=null,n=0,s=!1,r=!1;const a=new pi,o=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){const p=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,g=i.get(f);if(!s||p===null||p.length===0||r&&!m)r?h(null):c();else{const M=r?0:n,T=M*4;let y=g.clippingState||null;l.value=y,y=h(p,u,T,d);for(let w=0;w!==T;++w)y[w]=e[w];g.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,p){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,p!==!0||m===null){const g=d+_*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<g)&&(m=new Float32Array(g));for(let T=0,y=d;T!==_;++T,y+=4)a.copy(f[T]).applyMatrix4(M,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}const ti=4,ac=[.125,.215,.35,.446,.526,.582],gi=20,A0=256,fs=new Cr,oc=new qt;let _a=null,va=0,ya=0,Ma=!1;const R0=new I;class lc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){const{size:a=256,position:o=R0}=r;_a=this._renderer.getRenderTarget(),va=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),Ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=uc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(_a,va,ya),this._renderer.xr.enabled=Ma,t.scissorTest=!1,Wi(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===bi||t.mapping===Qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),_a=this._renderer.getRenderTarget(),va=this._renderer.getActiveCubeFace(),ya=this._renderer.getActiveMipmapLevel(),Ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Oe,minFilter:Oe,generateMipmaps:!1,type:Hn,format:un,colorSpace:Mr,depthBuffer:!1},s=cc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cc(t,e,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=C0(r)),this._blurMaterial=L0(r,t,e),this._ggxMaterial=P0(r,t,e)}return s}_compileMaterial(t){const e=new Dt(new Be,t);this._renderer.compile(e,fs)}_sceneToCubeUV(t,e,n,s,r){const l=new ln(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(oc),f.toneMapping=bn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Dt(new Gn,new Sh({name:"PMREM.Background",side:qe,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let g=!1;const M=t.background;M?M.isColor&&(m.color.copy(M),t.background=null,g=!0):(m.color.copy(oc),g=!0);for(let T=0;T<6;T++){const y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));const w=this._cubeSize;Wi(s,y*w,T>2?w:0,w,w),f.setRenderTarget(s),g&&f.render(_,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=M}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===bi||t.mapping===Qi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=uc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hc());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=t;const l=this._cubeSize;Wi(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,fs)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=0+c*1.25,d=f*u,{_lodMax:p}=this,_=this._sizeLods[n],m=3*_*(n>p-ti?n-p+ti:0),g=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,Wi(r,m,g,3*_,2*_),s.setRenderTarget(r),s.render(o,fs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Wi(t,m,g,3*_,2*_),s.setRenderTarget(t),s.render(o,fs)}_blur(t,e,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Kt("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=c;const u=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*gi-1),_=r/p,m=isFinite(r)?1+Math.floor(h*_):gi;m>gi&&Lt(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${gi}`);const g=[];let M=0;for(let R=0;R<gi;++R){const v=R/_,E=Math.exp(-v*v/2);g.push(E),R===0?M+=E:R<m&&(M+=2*E)}for(let R=0;R<g.length;R++)g[R]=g[R]/M;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=g,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=p,u.mipInt.value=T-n;const y=this._sizeLods[s],w=3*y*(s>T-ti?s-T+ti:0),b=4*(this._cubeSize-y);Wi(e,w,b,3*y,2*y),l.setRenderTarget(e),l.render(f,fs)}}function C0(i){const t=[],e=[],n=[];let s=i;const r=i-ti+1+ac.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>i-ti?l=ac[a-i+ti-1]:a===0&&(l=0),e.push(l);const c=1/(o-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,p=6,_=3,m=2,g=1,M=new Float32Array(_*p*d),T=new Float32Array(m*p*d),y=new Float32Array(g*p*d);for(let b=0;b<d;b++){const R=b%3*2/3-1,v=b>2?0:-1,E=[R,v,0,R+2/3,v,0,R+2/3,v+1,0,R,v,0,R+2/3,v+1,0,R,v+1,0];M.set(E,_*p*b),T.set(u,m*p*b);const C=[b,b,b,b,b,b];y.set(C,g*p*b)}const w=new Be;w.setAttribute("position",new fn(M,_)),w.setAttribute("uv",new fn(T,m)),w.setAttribute("faceIndex",new fn(y,g)),n.push(new Dt(w,null)),s>ti&&s--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function cc(i,t,e){const n=new Tn(i,t,e);return n.texture.mapping=wr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Wi(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function P0(i,t,e){return new wn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:A0,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Pr(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function L0(i,t,e){const n=new Float32Array(gi),s=new I(0,1,0);return new wn({name:"SphericalGaussianBlur",defines:{n:gi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Pr(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function hc(){return new wn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Pr(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function uc(){return new wn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Pr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function Pr(){return`

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
	`}class Hh extends Tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new bh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Gn(5,5,5),r=new wn({name:"CubemapFromEquirect",uniforms:es(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:qe,blending:On});r.uniforms.tEquirect.value=e;const a=new Dt(s,r),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=Oe),new Od(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}}function I0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===zr||d===Gr)if(t.has(u)){const p=t.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const _=new Hh(p.height);return _.fromEquirectangularTexture(i,u),t.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,p=d===zr||d===Gr,_=d===bi||d===Qi;if(p||_){let m=e.get(u);const g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new lc(i)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const M=u.image;return p&&M&&M.height>0||_&&M&&l(M)?(n===null&&(n=new lc(i)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===zr?u.mapping=bi:d===Gr&&(u.mapping=Qi),u}function l(u){let d=0;const p=6;for(let _=0;_<p;_++)u[_]!==void 0&&d++;return d===p}function c(u){const d=u.target;d.removeEventListener("dispose",c);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function D0(i){const t={};function e(n){if(t[n]!==void 0)return t[n];const s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&$i("WebGLRenderer: "+n+" extension not supported."),s}}}function U0(i,t,e,n){const s={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete s[u.id];const d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,e.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,p=f.attributes.position;let _=0;if(p===void 0)return;if(d!==null){const M=d.array;_=d.version;for(let T=0,y=M.length;T<y;T+=3){const w=M[T+0],b=M[T+1],R=M[T+2];u.push(w,b,b,R,R,w)}}else{const M=p.array;_=p.version;for(let T=0,y=M.length/3-1;T<y;T+=3){const w=T+0,b=T+1,R=T+2;u.push(w,b,b,R,R,w)}}const m=new(p.count>=65535?Mh:yh)(u,1);m.version=_;const g=r.get(f);g&&t.remove(g),r.set(f,m)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function N0(i,t,e){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*a),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*a,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let _=0;for(let m=0;m<d;m++)_+=u[m];e.update(_,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function F0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:Kt("WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function O0(i,t,e){const n=new WeakMap,s=new fe;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==f){let C=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var d=C;u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let w=o.attributes.position.count*y,b=1;w>t.maxTextureSize&&(b=Math.ceil(w/t.maxTextureSize),w=t.maxTextureSize);const R=new Float32Array(w*b*4*f),v=new xh(R,w,b,f);v.type=Mn,v.needsUpdate=!0;const E=y*4;for(let P=0;P<f;P++){const N=g[P],W=M[P],X=T[P],O=w*b*4*P;for(let $=0;$<N.count;$++){const G=$*E;p===!0&&(s.fromBufferAttribute(N,$),R[O+G+0]=s.x,R[O+G+1]=s.y,R[O+G+2]=s.z,R[O+G+3]=0),_===!0&&(s.fromBufferAttribute(W,$),R[O+G+4]=s.x,R[O+G+5]=s.y,R[O+G+6]=s.z,R[O+G+7]=0),m===!0&&(s.fromBufferAttribute(X,$),R[O+G+8]=s.x,R[O+G+9]=s.y,R[O+G+10]=s.z,R[O+G+11]=X.itemSize===4?s.w:1)}}u={count:f,texture:v,size:new ht(w,b)},n.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const _=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function k0(i,t,e,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const B0={[eh]:"LINEAR_TONE_MAPPING",[nh]:"REINHARD_TONE_MAPPING",[ih]:"CINEON_TONE_MAPPING",[sh]:"ACES_FILMIC_TONE_MAPPING",[ah]:"AGX_TONE_MAPPING",[oh]:"NEUTRAL_TONE_MAPPING",[rh]:"CUSTOM_TONE_MAPPING"};function H0(i,t,e,n,s,r){const a=new Tn(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new ji(t,e):void 0}),o=new Tn(t,e,{type:Hn,depthBuffer:!1,stencilBuffer:!1}),l=new Be;l.setAttribute("position",new oe([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new oe([0,2,0,0,2,0],2));const c=new Ld({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Dt(l,c),f=new Cr(-1,1,1,-1,0,1);let u=null,d=null,p=!1,_,m=null,g=[],M=!1;this.setSize=function(T,y){a.setSize(T,y),o.setSize(T,y);for(let w=0;w<g.length;w++){const b=g[w];b.setSize&&b.setSize(T,y)}},this.setEffects=function(T){g=T,M=g.length>0&&g[0].isRenderPass===!0;const y=a.width,w=a.height;for(let b=0;b<g.length;b++){const R=g[b];R.setSize&&R.setSize(y,w)}},this.begin=function(T,y){if(p||T.toneMapping===bn&&g.length===0)return!1;if(m=y,y!==null){const w=y.width,b=y.height;(a.width!==w||a.height!==b)&&this.setSize(w,b)}return M===!1&&T.setRenderTarget(a),_=T.toneMapping,T.toneMapping=bn,!0},this.hasRenderPass=function(){return M},this.end=function(T,y){T.toneMapping=_,p=!0;let w=a,b=o;for(let R=0;R<g.length;R++){const v=g[R];if(v.enabled!==!1&&(v.render(T,b,w,y),v.needsSwap!==!1)){const E=w;w=b,b=E}}if(u!==T.outputColorSpace||d!==T.toneMapping){u=T.outputColorSpace,d=T.toneMapping,c.defines={},Wt.getTransfer(u)===ee&&(c.defines.SRGB_TRANSFER="");const R=B0[d];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=w.texture,T.setRenderTarget(m),T.render(h,f),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const zh=new Ge,Ro=new ji(1,1),Gh=new xh,Vh=new Cf,Wh=new bh,fc=[],dc=[],pc=new Float32Array(16),mc=new Float32Array(9),gc=new Float32Array(4);function ss(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=fc[s];if(r===void 0&&(r=new Float32Array(s),fc[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ae(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Re(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Lr(i,t){let e=dc[t];e===void 0&&(e=new Int32Array(t),dc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function z0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function G0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2fv(this.addr,t),Re(e,t)}}function V0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ae(e,t))return;i.uniform3fv(this.addr,t),Re(e,t)}}function W0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4fv(this.addr,t),Re(e,t)}}function X0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;gc.set(n),i.uniformMatrix2fv(this.addr,!1,gc),Re(e,n)}}function q0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;mc.set(n),i.uniformMatrix3fv(this.addr,!1,mc),Re(e,n)}}function Y0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ae(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Re(e,t)}else{if(Ae(e,n))return;pc.set(n),i.uniformMatrix4fv(this.addr,!1,pc),Re(e,n)}}function $0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function K0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2iv(this.addr,t),Re(e,t)}}function Z0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3iv(this.addr,t),Re(e,t)}}function J0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4iv(this.addr,t),Re(e,t)}}function Q0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function j0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ae(e,t))return;i.uniform2uiv(this.addr,t),Re(e,t)}}function tg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ae(e,t))return;i.uniform3uiv(this.addr,t),Re(e,t)}}function eg(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ae(e,t))return;i.uniform4uiv(this.addr,t),Re(e,t)}}function ng(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ro.compareFunction=e.isReversedDepthBuffer()?Wo:Vo,r=Ro):r=zh,e.setTexture2D(t||r,s)}function ig(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Vh,s)}function sg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||Wh,s)}function rg(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||Gh,s)}function ag(i){switch(i){case 5126:return z0;case 35664:return G0;case 35665:return V0;case 35666:return W0;case 35674:return X0;case 35675:return q0;case 35676:return Y0;case 5124:case 35670:return $0;case 35667:case 35671:return K0;case 35668:case 35672:return Z0;case 35669:case 35673:return J0;case 5125:return Q0;case 36294:return j0;case 36295:return tg;case 36296:return eg;case 35678:case 36198:case 36298:case 36306:case 35682:return ng;case 35679:case 36299:case 36307:return ig;case 35680:case 36300:case 36308:case 36293:return sg;case 36289:case 36303:case 36311:case 36292:return rg}}function og(i,t){i.uniform1fv(this.addr,t)}function lg(i,t){const e=ss(t,this.size,2);i.uniform2fv(this.addr,e)}function cg(i,t){const e=ss(t,this.size,3);i.uniform3fv(this.addr,e)}function hg(i,t){const e=ss(t,this.size,4);i.uniform4fv(this.addr,e)}function ug(i,t){const e=ss(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function fg(i,t){const e=ss(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function dg(i,t){const e=ss(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function pg(i,t){i.uniform1iv(this.addr,t)}function mg(i,t){i.uniform2iv(this.addr,t)}function gg(i,t){i.uniform3iv(this.addr,t)}function xg(i,t){i.uniform4iv(this.addr,t)}function _g(i,t){i.uniform1uiv(this.addr,t)}function vg(i,t){i.uniform2uiv(this.addr,t)}function yg(i,t){i.uniform3uiv(this.addr,t)}function Mg(i,t){i.uniform4uiv(this.addr,t)}function Sg(i,t,e){const n=this.cache,s=t.length,r=Lr(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=Ro:a=zh;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||a,r[o])}function bg(i,t,e){const n=this.cache,s=t.length,r=Lr(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Vh,r[a])}function Tg(i,t,e){const n=this.cache,s=t.length,r=Lr(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Wh,r[a])}function Eg(i,t,e){const n=this.cache,s=t.length,r=Lr(e,s);Ae(n,r)||(i.uniform1iv(this.addr,r),Re(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Gh,r[a])}function wg(i){switch(i){case 5126:return og;case 35664:return lg;case 35665:return cg;case 35666:return hg;case 35674:return ug;case 35675:return fg;case 35676:return dg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return xg;case 5125:return _g;case 36294:return vg;case 36295:return yg;case 36296:return Mg;case 35678:case 36198:case 36298:case 36306:case 35682:return Sg;case 35679:case 36299:case 36307:return bg;case 35680:case 36300:case 36308:case 36293:return Tg;case 36289:case 36303:case 36311:case 36292:return Eg}}class Ag{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=ag(e.type)}}class Rg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=wg(e.type)}}class Cg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(t,e[o.id],n)}}}const Sa=/(\w+)(\])?(\[|\.)?/g;function xc(i,t){i.seq.push(t),i.map[t.id]=t}function Pg(i,t,e){const n=i.name,s=n.length;for(Sa.lastIndex=0;;){const r=Sa.exec(n),a=Sa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){xc(e,c===void 0?new Ag(o,i,t):new Rg(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Cg(o),xc(e,f)),e=f}}}class mr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Pg(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function _c(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Lg=37297;let Ig=0;function Dg(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const vc=new Nt;function Ug(i){Wt._getMatrix(vc,Wt.workingColorSpace,i);const t=`mat3( ${vc.elements.map(e=>e.toFixed(4))} )`;switch(Wt.getTransfer(i)){case Sr:return[t,"LinearTransferOETF"];case ee:return[t,"sRGBTransferOETF"];default:return Lt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function yc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Dg(i.getShaderSource(t),o)}else return r}function Ng(i,t){const e=Ug(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const Fg={[eh]:"Linear",[nh]:"Reinhard",[ih]:"Cineon",[sh]:"ACESFilmic",[ah]:"AgX",[oh]:"Neutral",[rh]:"Custom"};function Og(i,t){const e=Fg[t];return e===void 0?(Lt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const sr=new I;function kg(){Wt.getLuminanceCoefficients(sr);const i=sr.x.toFixed(4),t=sr.y.toFixed(4),e=sr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Bg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xs).join(`
`)}function Hg(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function zg(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function xs(i){return i!==""}function Mc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Sc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Gg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Co(i){return i.replace(Gg,Wg)}const Vg=new Map;function Wg(i,t){let e=Bt[t];if(e===void 0){const n=Vg.get(t);if(n!==void 0)e=Bt[n],Lt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Co(e)}const Xg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function bc(i){return i.replace(Xg,qg)}function qg(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Tc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}const Yg={[hr]:"SHADOWMAP_TYPE_PCF",[ms]:"SHADOWMAP_TYPE_VSM"};function $g(i){return Yg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Kg={[bi]:"ENVMAP_TYPE_CUBE",[Qi]:"ENVMAP_TYPE_CUBE",[wr]:"ENVMAP_TYPE_CUBE_UV"};function Zg(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":Kg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Jg={[Qi]:"ENVMAP_MODE_REFRACTION"};function Qg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Jg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const jg={[th]:"ENVMAP_BLENDING_MULTIPLY",[lf]:"ENVMAP_BLENDING_MIX",[cf]:"ENVMAP_BLENDING_ADD"};function tx(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":jg[i.combine]||"ENVMAP_BLENDING_NONE"}function ex(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function nx(i,t,e,n){const s=i.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=$g(e),c=Zg(e),h=Qg(e),f=tx(e),u=ex(e),d=Bg(e),p=Hg(r),_=s.createProgram();let m,g,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xs).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(xs).join(`
`),g.length>0&&(g+=`
`)):(m=[Tc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),g=[Tc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==bn?"#define TONE_MAPPING":"",e.toneMapping!==bn?Bt.tonemapping_pars_fragment:"",e.toneMapping!==bn?Og("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Bt.colorspace_pars_fragment,Ng("linearToOutputTexel",e.outputColorSpace),kg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xs).join(`
`)),a=Co(a),a=Mc(a,e),a=Sc(a,e),o=Co(o),o=Mc(o,e),o=Sc(o,e),a=bc(a),o=bc(o),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Al?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Al?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const T=M+m+a,y=M+g+o,w=_c(s,s.VERTEX_SHADER,T),b=_c(s,s.FRAGMENT_SHADER,y);s.attachShader(_,w),s.attachShader(_,b),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function R(P){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(_)||"",W=s.getShaderInfoLog(w)||"",X=s.getShaderInfoLog(b)||"",O=N.trim(),$=W.trim(),G=X.trim();let Q=!0,tt=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,w,b);else{const at=yc(s,w,"vertex"),gt=yc(s,b,"fragment");Kt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+at+`
`+gt)}else O!==""?Lt("WebGLProgram: Program Info Log:",O):($===""||G==="")&&(tt=!1);tt&&(P.diagnostics={runnable:Q,programLog:O,vertexShader:{log:$,prefix:m},fragmentShader:{log:G,prefix:g}})}s.deleteShader(w),s.deleteShader(b),v=new mr(s,_),E=zg(s,_)}let v;this.getUniforms=function(){return v===void 0&&R(this),v};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(_,Lg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Ig++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=w,this.fragmentShader=b,this}let ix=0;class sx{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new rx(t),e.set(t,n)),n}}class rx{constructor(t){this.id=ix++,this.code=t,this.usedTimes=0}}function ax(i){return i===Ti||i===vr||i===yr}function ox(i,t,e,n,s,r){const a=new _h,o=new sx,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer;let u=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,E,C,P,N,W){const X=P.fog,O=N.geometry,$=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,G=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Q=t.get(v.envMap||$,G),tt=Q&&Q.mapping===wr?Q.image.height:null,at=d[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Lt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const gt=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,yt=gt!==void 0?gt.length:0;let Zt=0;O.morphAttributes.position!==void 0&&(Zt=1),O.morphAttributes.normal!==void 0&&(Zt=2),O.morphAttributes.color!==void 0&&(Zt=3);let me,Jt,J,st;if(at){const St=yn[at];me=St.vertexShader,Jt=St.fragmentShader}else{me=v.vertexShader,Jt=v.fragmentShader;const St=o.getVertexShaderStage(v),xe=o.getFragmentShaderStage(v);o.update(v,St,xe),J=St.id,st=xe.id}const et=i.getRenderTarget(),It=i.state.buffers.depth.getReversed(),Ft=N.isInstancedMesh===!0,Ct=N.isBatchedMesh===!0,ve=!!v.map,Vt=!!v.matcap,ie=!!Q,Qt=!!v.aoMap,Yt=!!v.lightMap,Se=!!v.bumpMap&&v.wireframe===!1,we=!!v.normalMap,Ce=!!v.displacementMap,Le=!!v.emissiveMap,ge=!!v.metalnessMap,be=!!v.roughnessMap,D=v.anisotropy>0,Ve=v.clearcoat>0,te=v.dispersion>0,A=v.iridescence>0,x=v.sheen>0,F=v.transmission>0,z=D&&!!v.anisotropyMap,q=Ve&&!!v.clearcoatMap,nt=Ve&&!!v.clearcoatNormalMap,rt=Ve&&!!v.clearcoatRoughnessMap,Y=A&&!!v.iridescenceMap,Z=A&&!!v.iridescenceThicknessMap,ot=x&&!!v.sheenColorMap,Et=x&&!!v.sheenRoughnessMap,ut=!!v.specularMap,lt=!!v.specularColorMap,Rt=!!v.specularIntensityMap,Pt=F&&!!v.transmissionMap,Ot=F&&!!v.thicknessMap,L=!!v.gradientMap,it=!!v.alphaMap,K=v.alphaTest>0,ct=!!v.alphaHash,mt=!!v.extensions;let j=bn;v.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(j=i.toneMapping);const Tt={shaderID:at,shaderType:v.type,shaderName:v.name,vertexShader:me,fragmentShader:Jt,defines:v.defines,customVertexShaderID:J,customFragmentShaderID:st,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:Ct,batchingColor:Ct&&N._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&N.instanceColor!==null,instancingMorph:Ft&&N.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:Wt.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ve,matcap:Vt,envMap:ie,envMapMode:ie&&Q.mapping,envMapCubeUVHeight:tt,aoMap:Qt,lightMap:Yt,bumpMap:Se,normalMap:we,displacementMap:Ce,emissiveMap:Le,normalMapObjectSpace:we&&v.normalMapType===ff,normalMapTangentSpace:we&&v.normalMapType===To,packedNormalMap:we&&v.normalMapType===To&&ax(v.normalMap.format),metalnessMap:ge,roughnessMap:be,anisotropy:D,anisotropyMap:z,clearcoat:Ve,clearcoatMap:q,clearcoatNormalMap:nt,clearcoatRoughnessMap:rt,dispersion:te,iridescence:A,iridescenceMap:Y,iridescenceThicknessMap:Z,sheen:x,sheenColorMap:ot,sheenRoughnessMap:Et,specularMap:ut,specularColorMap:lt,specularIntensityMap:Rt,transmission:F,transmissionMap:Pt,thicknessMap:Ot,gradientMap:L,opaque:v.transparent===!1&&v.blending===Yi&&v.alphaToCoverage===!1,alphaMap:it,alphaTest:K,alphaHash:ct,combine:v.combine,mapUv:ve&&p(v.map.channel),aoMapUv:Qt&&p(v.aoMap.channel),lightMapUv:Yt&&p(v.lightMap.channel),bumpMapUv:Se&&p(v.bumpMap.channel),normalMapUv:we&&p(v.normalMap.channel),displacementMapUv:Ce&&p(v.displacementMap.channel),emissiveMapUv:Le&&p(v.emissiveMap.channel),metalnessMapUv:ge&&p(v.metalnessMap.channel),roughnessMapUv:be&&p(v.roughnessMap.channel),anisotropyMapUv:z&&p(v.anisotropyMap.channel),clearcoatMapUv:q&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:nt&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rt&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:ot&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Et&&p(v.sheenRoughnessMap.channel),specularMapUv:ut&&p(v.specularMap.channel),specularColorMapUv:lt&&p(v.specularColorMap.channel),specularIntensityMapUv:Rt&&p(v.specularIntensityMap.channel),transmissionMapUv:Pt&&p(v.transmissionMap.channel),thicknessMapUv:Ot&&p(v.thicknessMap.channel),alphaMapUv:it&&p(v.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(we||D),vertexNormals:!!O.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(ve||it),fog:!!X,useFog:v.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||O.attributes.normal===void 0&&we===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:It,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Zt,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:ve&&v.map.isVideoTexture===!0&&Wt.getTransfer(v.map.colorSpace)===ee,decodeVideoTextureEmissive:Le&&v.emissiveMap.isVideoTexture===!0&&Wt.getTransfer(v.emissiveMap.colorSpace)===ee,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Un,flipSided:v.side===qe,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:mt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(mt&&v.extensions.multiDraw===!0||Ct)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function m(v){const E=[];if(v.shaderID?E.push(v.shaderID):(E.push(v.customVertexShaderID),E.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)E.push(C),E.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(g(E,v),M(E,v),E.push(i.outputColorSpace)),E.push(v.customProgramCacheKey),E.join()}function g(v,E){v.push(E.precision),v.push(E.outputColorSpace),v.push(E.envMapMode),v.push(E.envMapCubeUVHeight),v.push(E.mapUv),v.push(E.alphaMapUv),v.push(E.lightMapUv),v.push(E.aoMapUv),v.push(E.bumpMapUv),v.push(E.normalMapUv),v.push(E.displacementMapUv),v.push(E.emissiveMapUv),v.push(E.metalnessMapUv),v.push(E.roughnessMapUv),v.push(E.anisotropyMapUv),v.push(E.clearcoatMapUv),v.push(E.clearcoatNormalMapUv),v.push(E.clearcoatRoughnessMapUv),v.push(E.iridescenceMapUv),v.push(E.iridescenceThicknessMapUv),v.push(E.sheenColorMapUv),v.push(E.sheenRoughnessMapUv),v.push(E.specularMapUv),v.push(E.specularColorMapUv),v.push(E.specularIntensityMapUv),v.push(E.transmissionMapUv),v.push(E.thicknessMapUv),v.push(E.combine),v.push(E.fogExp2),v.push(E.sizeAttenuation),v.push(E.morphTargetsCount),v.push(E.morphAttributeCount),v.push(E.numDirLights),v.push(E.numPointLights),v.push(E.numSpotLights),v.push(E.numSpotLightMaps),v.push(E.numHemiLights),v.push(E.numRectAreaLights),v.push(E.numDirLightShadows),v.push(E.numPointLightShadows),v.push(E.numSpotLightShadows),v.push(E.numSpotLightShadowsWithMaps),v.push(E.numLightProbes),v.push(E.shadowMapType),v.push(E.toneMapping),v.push(E.numClippingPlanes),v.push(E.numClipIntersection),v.push(E.depthPacking)}function M(v,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function T(v){const E=d[v.type];let C;if(E){const P=yn[E];C=Rd.clone(P.uniforms)}else C=v.uniforms;return C}function y(v,E){let C=h.get(E);return C!==void 0?++C.usedTimes:(C=new nx(i,E,v,s),c.push(C),h.set(E,C)),C}function w(v){if(--v.usedTimes===0){const E=c.indexOf(v);c[E]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function b(v){o.remove(v)}function R(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:T,acquireProgram:y,releaseProgram:w,releaseShaderCache:b,programs:c,dispose:R}}function lx(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function cx(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function Ec(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function wc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,p,_,m,g){let M=i[t];return M===void 0?(M={id:u.id,object:u,geometry:d,material:p,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:g},i[t]=M):(M.id=u.id,M.object=u,M.geometry=d,M.material=p,M.materialVariant=a(u),M.groupOrder=_,M.renderOrder=u.renderOrder,M.z=m,M.group=g),t++,M}function l(u,d,p,_,m,g){const M=o(u,d,p,_,m,g);p.transmission>0?n.push(M):p.transparent===!0?s.push(M):e.push(M)}function c(u,d,p,_,m,g){const M=o(u,d,p,_,m,g);p.transmission>0?n.unshift(M):p.transparent===!0?s.unshift(M):e.unshift(M)}function h(u,d,p){e.length>1&&e.sort(u||cx),n.length>1&&n.sort(d||Ec),s.length>1&&s.sort(d||Ec),p&&(e.reverse(),n.reverse(),s.reverse())}function f(){for(let u=t,d=i.length;u<d;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function hx(){let i=new WeakMap;function t(n,s){const r=i.get(n);let a;return r===void 0?(a=new wc,i.set(n,[a])):s>=r.length?(a=new wc,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function ux(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new qt};break;case"SpotLight":e={position:new I,direction:new I,color:new qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new qt,groundColor:new qt};break;case"RectAreaLight":e={color:new qt,position:new I,halfWidth:new I,halfHeight:new I};break}return i[t.id]=e,e}}}function fx(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let dx=0;function px(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function mx(i){const t=new ux,e=fx(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new ae,a=new ae;function o(c){let h=0,f=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let d=0,p=0,_=0,m=0,g=0,M=0,T=0,y=0,w=0,b=0,R=0;c.sort(px);for(let E=0,C=c.length;E<C;E++){const P=c[E],N=P.color,W=P.intensity,X=P.distance;let O=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Ti?O=P.shadow.map.texture:O=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=N.r*W,f+=N.g*W,u+=N.b*W;else if(P.isLightProbe){for(let $=0;$<9;$++)n.probe[$].addScaledVector(P.sh.coefficients[$],W);R++}else if(P.isDirectionalLight){const $=t.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const G=P.shadow,Q=e.get(P);Q.shadowIntensity=G.intensity,Q.shadowBias=G.bias,Q.shadowNormalBias=G.normalBias,Q.shadowRadius=G.radius,Q.shadowMapSize=G.mapSize,n.directionalShadow[d]=Q,n.directionalShadowMap[d]=O,n.directionalShadowMatrix[d]=P.shadow.matrix,M++}n.directional[d]=$,d++}else if(P.isSpotLight){const $=t.get(P);$.position.setFromMatrixPosition(P.matrixWorld),$.color.copy(N).multiplyScalar(W),$.distance=X,$.coneCos=Math.cos(P.angle),$.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),$.decay=P.decay,n.spot[_]=$;const G=P.shadow;if(P.map&&(n.spotLightMap[w]=P.map,w++,G.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[_]=G.matrix,P.castShadow){const Q=e.get(P);Q.shadowIntensity=G.intensity,Q.shadowBias=G.bias,Q.shadowNormalBias=G.normalBias,Q.shadowRadius=G.radius,Q.shadowMapSize=G.mapSize,n.spotShadow[_]=Q,n.spotShadowMap[_]=O,y++}_++}else if(P.isRectAreaLight){const $=t.get(P);$.color.copy(N).multiplyScalar(W),$.halfWidth.set(P.width*.5,0,0),$.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=$,m++}else if(P.isPointLight){const $=t.get(P);if($.color.copy(P.color).multiplyScalar(P.intensity),$.distance=P.distance,$.decay=P.decay,P.castShadow){const G=P.shadow,Q=e.get(P);Q.shadowIntensity=G.intensity,Q.shadowBias=G.bias,Q.shadowNormalBias=G.normalBias,Q.shadowRadius=G.radius,Q.shadowMapSize=G.mapSize,Q.shadowCameraNear=G.camera.near,Q.shadowCameraFar=G.camera.far,n.pointShadow[p]=Q,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=P.shadow.matrix,T++}n.point[p]=$,p++}else if(P.isHemisphereLight){const $=t.get(P);$.skyColor.copy(P.color).multiplyScalar(W),$.groundColor.copy(P.groundColor).multiplyScalar(W),n.hemi[g]=$,g++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ft.LTC_FLOAT_1,n.rectAreaLTC2=ft.LTC_FLOAT_2):(n.rectAreaLTC1=ft.LTC_HALF_1,n.rectAreaLTC2=ft.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const v=n.hash;(v.directionalLength!==d||v.pointLength!==p||v.spotLength!==_||v.rectAreaLength!==m||v.hemiLength!==g||v.numDirectionalShadows!==M||v.numPointShadows!==T||v.numSpotShadows!==y||v.numSpotMaps!==w||v.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+w-b,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,v.directionalLength=d,v.pointLength=p,v.spotLength=_,v.rectAreaLength=m,v.hemiLength=g,v.numDirectionalShadows=M,v.numPointShadows=T,v.numSpotShadows=y,v.numSpotMaps=w,v.numLightProbes=R,n.version=dx++)}function l(c,h){let f=0,u=0,d=0,p=0,_=0;const m=h.matrixWorldInverse;for(let g=0,M=c.length;g<M;g++){const T=c[g];if(T.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),f++}else if(T.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(m),d++}else if(T.isRectAreaLight){const y=n.rectArea[p];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(T.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),p++}else if(T.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(m),u++}else if(T.isHemisphereLight){const y=n.hemi[_];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Ac(i){const t=new mx(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function gx(i){let t=new WeakMap;function e(s,r=0){const a=t.get(s);let o;return a===void 0?(o=new Ac(i),t.set(s,[o])):r>=a.length?(o=new Ac(i),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const xx=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,_x=`uniform sampler2D shadow_pass;
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
}`,vx=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],yx=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],Rc=new ae,ds=new I,ba=new I;function Mx(i,t,e){let n=new Yo;const s=new ht,r=new ht,a=new fe,o=new Id,l=new Dd,c={},h=e.maxTextureSize,f={[ii]:qe,[qe]:ii,[Un]:Un},u=new wn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:xx,fragmentShader:_x}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const p=new Be;p.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Dt(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=hr;let g=this.type;this.render=function(b,R,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;this.type===Gu&&(Lt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=hr);const E=i.getRenderTarget(),C=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),N=i.state;N.setBlending(On),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const W=g!==this.type;W&&R.traverse(function(X){X.material&&(Array.isArray(X.material)?X.material.forEach(O=>O.needsUpdate=!0):X.material.needsUpdate=!0)});for(let X=0,O=b.length;X<O;X++){const $=b[X],G=$.shadow;if(G===void 0){Lt("WebGLShadowMap:",$,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;s.copy(G.mapSize);const Q=G.getFrameExtents();s.multiply(Q),r.copy(G.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,G.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,G.mapSize.y=r.y));const tt=i.state.buffers.depth.getReversed();if(G.camera._reversedDepth=tt,G.map===null||W===!0){if(G.map!==null&&(G.map.depthTexture!==null&&(G.map.depthTexture.dispose(),G.map.depthTexture=null),G.map.dispose()),this.type===ms){if($.isPointLight){Lt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}G.map=new Tn(s.x,s.y,{format:Ti,type:Hn,minFilter:Oe,magFilter:Oe,generateMipmaps:!1}),G.map.texture.name=$.name+".shadowMap",G.map.depthTexture=new ji(s.x,s.y,Mn),G.map.depthTexture.name=$.name+".shadowMapDepth",G.map.depthTexture.format=zn,G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=Ie,G.map.depthTexture.magFilter=Ie}else $.isPointLight?(G.map=new Hh(s.x),G.map.depthTexture=new $f(s.x,En)):(G.map=new Tn(s.x,s.y),G.map.depthTexture=new ji(s.x,s.y,En)),G.map.depthTexture.name=$.name+".shadowMap",G.map.depthTexture.format=zn,this.type===hr?(G.map.depthTexture.compareFunction=tt?Wo:Vo,G.map.depthTexture.minFilter=Oe,G.map.depthTexture.magFilter=Oe):(G.map.depthTexture.compareFunction=null,G.map.depthTexture.minFilter=Ie,G.map.depthTexture.magFilter=Ie);G.camera.updateProjectionMatrix()}const at=G.map.isWebGLCubeRenderTarget?6:1;for(let gt=0;gt<at;gt++){if(G.map.isWebGLCubeRenderTarget)i.setRenderTarget(G.map,gt),i.clear();else{gt===0&&(i.setRenderTarget(G.map),i.clear());const yt=G.getViewport(gt);a.set(r.x*yt.x,r.y*yt.y,r.x*yt.z,r.y*yt.w),N.viewport(a)}if($.isPointLight){const yt=G.camera,Zt=G.matrix,me=$.distance||yt.far;me!==yt.far&&(yt.far=me,yt.updateProjectionMatrix()),ds.setFromMatrixPosition($.matrixWorld),yt.position.copy(ds),ba.copy(yt.position),ba.add(vx[gt]),yt.up.copy(yx[gt]),yt.lookAt(ba),yt.updateMatrixWorld(),Zt.makeTranslation(-ds.x,-ds.y,-ds.z),Rc.multiplyMatrices(yt.projectionMatrix,yt.matrixWorldInverse),G._frustum.setFromProjectionMatrix(Rc,yt.coordinateSystem,yt.reversedDepth)}else G.updateMatrices($);n=G.getFrustum(),y(R,v,G.camera,$,this.type)}G.isPointLightShadow!==!0&&this.type===ms&&M(G,v),G.needsUpdate=!1}g=this.type,m.needsUpdate=!1,i.setRenderTarget(E,C,P)};function M(b,R){const v=t.update(_);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Tn(s.x,s.y,{format:Ti,type:Hn})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,v,u,_,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,v,d,_,null)}function T(b,R,v,E){let C=null;const P=v.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)C=P;else if(C=v.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const N=C.uuid,W=R.uuid;let X=c[N];X===void 0&&(X={},c[N]=X);let O=X[W];O===void 0&&(O=C.clone(),X[W]=O,R.addEventListener("dispose",w)),C=O}if(C.visible=R.visible,C.wireframe=R.wireframe,E===ms?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:f[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,v.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const N=i.properties.get(C);N.light=v}return C}function y(b,R,v,E,C){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===ms)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,b.matrixWorld);const W=t.update(b),X=b.material;if(Array.isArray(X)){const O=W.groups;for(let $=0,G=O.length;$<G;$++){const Q=O[$],tt=X[Q.materialIndex];if(tt&&tt.visible){const at=T(b,tt,E,C);b.onBeforeShadow(i,b,R,v,W,at,Q),i.renderBufferDirect(v,null,W,at,b,Q),b.onAfterShadow(i,b,R,v,W,at,Q)}}}else if(X.visible){const O=T(b,X,E,C);b.onBeforeShadow(i,b,R,v,W,O,null),i.renderBufferDirect(v,null,W,O,b,null),b.onAfterShadow(i,b,R,v,W,O,null)}}const N=b.children;for(let W=0,X=N.length;W<X;W++)y(N[W],R,v,E,C)}function w(b){b.target.removeEventListener("dispose",w);for(const v in c){const E=c[v],C=b.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function Sx(i,t){function e(){let L=!1;const it=new fe;let K=null;const ct=new fe(0,0,0,0);return{setMask:function(mt){K!==mt&&!L&&(i.colorMask(mt,mt,mt,mt),K=mt)},setLocked:function(mt){L=mt},setClear:function(mt,j,Tt,St,xe){xe===!0&&(mt*=St,j*=St,Tt*=St),it.set(mt,j,Tt,St),ct.equals(it)===!1&&(i.clearColor(mt,j,Tt,St),ct.copy(it))},reset:function(){L=!1,K=null,ct.set(-1,0,0,0)}}}function n(){let L=!1,it=!1,K=null,ct=null,mt=null;return{setReversed:function(j){if(it!==j){const Tt=t.get("EXT_clip_control");j?Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.ZERO_TO_ONE_EXT):Tt.clipControlEXT(Tt.LOWER_LEFT_EXT,Tt.NEGATIVE_ONE_TO_ONE_EXT),it=j;const St=mt;mt=null,this.setClear(St)}},getReversed:function(){return it},setTest:function(j){j?et(i.DEPTH_TEST):It(i.DEPTH_TEST)},setMask:function(j){K!==j&&!L&&(i.depthMask(j),K=j)},setFunc:function(j){if(it&&(j=Sf[j]),ct!==j){switch(j){case ka:i.depthFunc(i.NEVER);break;case Ba:i.depthFunc(i.ALWAYS);break;case Ha:i.depthFunc(i.LESS);break;case Ji:i.depthFunc(i.LEQUAL);break;case za:i.depthFunc(i.EQUAL);break;case Ga:i.depthFunc(i.GEQUAL);break;case Va:i.depthFunc(i.GREATER);break;case Wa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ct=j}},setLocked:function(j){L=j},setClear:function(j){mt!==j&&(mt=j,it&&(j=1-j),i.clearDepth(j))},reset:function(){L=!1,K=null,ct=null,mt=null,it=!1}}}function s(){let L=!1,it=null,K=null,ct=null,mt=null,j=null,Tt=null,St=null,xe=null;return{setTest:function(le){L||(le?et(i.STENCIL_TEST):It(i.STENCIL_TEST))},setMask:function(le){it!==le&&!L&&(i.stencilMask(le),it=le)},setFunc:function(le,dn,pn){(K!==le||ct!==dn||mt!==pn)&&(i.stencilFunc(le,dn,pn),K=le,ct=dn,mt=pn)},setOp:function(le,dn,pn){(j!==le||Tt!==dn||St!==pn)&&(i.stencilOp(le,dn,pn),j=le,Tt=dn,St=pn)},setLocked:function(le){L=le},setClear:function(le){xe!==le&&(i.clearStencil(le),xe=le)},reset:function(){L=!1,it=null,K=null,ct=null,mt=null,j=null,Tt=null,St=null,xe=null}}}const r=new e,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,p=[],_=null,m=!1,g=null,M=null,T=null,y=null,w=null,b=null,R=null,v=new qt(0,0,0),E=0,C=!1,P=null,N=null,W=null,X=null,O=null;const $=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,Q=0;const tt=i.getParameter(i.VERSION);tt.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(tt)[1]),G=Q>=1):tt.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(tt)[1]),G=Q>=2);let at=null,gt={};const yt=i.getParameter(i.SCISSOR_BOX),Zt=i.getParameter(i.VIEWPORT),me=new fe().fromArray(yt),Jt=new fe().fromArray(Zt);function J(L,it,K,ct){const mt=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Tt=0;Tt<K;Tt++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(it,0,i.RGBA,1,1,ct,0,i.RGBA,i.UNSIGNED_BYTE,mt):i.texImage2D(it+Tt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,mt);return j}const st={};st[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),et(i.DEPTH_TEST),a.setFunc(Ji),Se(!1),we(Ml),et(i.CULL_FACE),Qt(On);function et(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function It(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Ft(L,it){return u[L]!==it?(i.bindFramebuffer(L,it),u[L]=it,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=it),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=it),!0):!1}function Ct(L,it){let K=p,ct=!1;if(L){K=d.get(it),K===void 0&&(K=[],d.set(it,K));const mt=L.textures;if(K.length!==mt.length||K[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Tt=mt.length;j<Tt;j++)K[j]=i.COLOR_ATTACHMENT0+j;K.length=mt.length,ct=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,ct=!0);ct&&i.drawBuffers(K)}function ve(L){return _!==L?(i.useProgram(L),_=L,!0):!1}const Vt={[mi]:i.FUNC_ADD,[Wu]:i.FUNC_SUBTRACT,[Xu]:i.FUNC_REVERSE_SUBTRACT};Vt[qu]=i.MIN,Vt[Yu]=i.MAX;const ie={[$u]:i.ZERO,[Ku]:i.ONE,[Zu]:i.SRC_COLOR,[Fa]:i.SRC_ALPHA,[nf]:i.SRC_ALPHA_SATURATE,[tf]:i.DST_COLOR,[Qu]:i.DST_ALPHA,[Ju]:i.ONE_MINUS_SRC_COLOR,[Oa]:i.ONE_MINUS_SRC_ALPHA,[ef]:i.ONE_MINUS_DST_COLOR,[ju]:i.ONE_MINUS_DST_ALPHA,[sf]:i.CONSTANT_COLOR,[rf]:i.ONE_MINUS_CONSTANT_COLOR,[af]:i.CONSTANT_ALPHA,[of]:i.ONE_MINUS_CONSTANT_ALPHA};function Qt(L,it,K,ct,mt,j,Tt,St,xe,le){if(L===On){m===!0&&(It(i.BLEND),m=!1);return}if(m===!1&&(et(i.BLEND),m=!0),L!==Vu){if(L!==g||le!==C){if((M!==mi||w!==mi)&&(i.blendEquation(i.FUNC_ADD),M=mi,w=mi),le)switch(L){case Yi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sl:i.blendFunc(i.ONE,i.ONE);break;case bl:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Tl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Kt("WebGLState: Invalid blending: ",L);break}else switch(L){case Yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case bl:Kt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Tl:Kt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Kt("WebGLState: Invalid blending: ",L);break}T=null,y=null,b=null,R=null,v.set(0,0,0),E=0,g=L,C=le}return}mt=mt||it,j=j||K,Tt=Tt||ct,(it!==M||mt!==w)&&(i.blendEquationSeparate(Vt[it],Vt[mt]),M=it,w=mt),(K!==T||ct!==y||j!==b||Tt!==R)&&(i.blendFuncSeparate(ie[K],ie[ct],ie[j],ie[Tt]),T=K,y=ct,b=j,R=Tt),(St.equals(v)===!1||xe!==E)&&(i.blendColor(St.r,St.g,St.b,xe),v.copy(St),E=xe),g=L,C=!1}function Yt(L,it){L.side===Un?It(i.CULL_FACE):et(i.CULL_FACE);let K=L.side===qe;it&&(K=!K),Se(K),L.blending===Yi&&L.transparent===!1?Qt(On):Qt(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const ct=L.stencilWrite;o.setTest(ct),ct&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Le(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):It(i.SAMPLE_ALPHA_TO_COVERAGE)}function Se(L){P!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),P=L)}function we(L){L!==Hu?(et(i.CULL_FACE),L!==N&&(L===Ml?i.cullFace(i.BACK):L===zu?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):It(i.CULL_FACE),N=L}function Ce(L){L!==W&&(G&&i.lineWidth(L),W=L)}function Le(L,it,K){L?(et(i.POLYGON_OFFSET_FILL),(X!==it||O!==K)&&(X=it,O=K,a.getReversed()&&(it=-it),i.polygonOffset(it,K))):It(i.POLYGON_OFFSET_FILL)}function ge(L){L?et(i.SCISSOR_TEST):It(i.SCISSOR_TEST)}function be(L){L===void 0&&(L=i.TEXTURE0+$-1),at!==L&&(i.activeTexture(L),at=L)}function D(L,it,K){K===void 0&&(at===null?K=i.TEXTURE0+$-1:K=at);let ct=gt[K];ct===void 0&&(ct={type:void 0,texture:void 0},gt[K]=ct),(ct.type!==L||ct.texture!==it)&&(at!==K&&(i.activeTexture(K),at=K),i.bindTexture(L,it||st[L]),ct.type=L,ct.texture=it)}function Ve(){const L=gt[at];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function te(){try{i.compressedTexImage2D(...arguments)}catch(L){Kt("WebGLState:",L)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(L){Kt("WebGLState:",L)}}function x(){try{i.texSubImage2D(...arguments)}catch(L){Kt("WebGLState:",L)}}function F(){try{i.texSubImage3D(...arguments)}catch(L){Kt("WebGLState:",L)}}function z(){try{i.compressedTexSubImage2D(...arguments)}catch(L){Kt("WebGLState:",L)}}function q(){try{i.compressedTexSubImage3D(...arguments)}catch(L){Kt("WebGLState:",L)}}function nt(){try{i.texStorage2D(...arguments)}catch(L){Kt("WebGLState:",L)}}function rt(){try{i.texStorage3D(...arguments)}catch(L){Kt("WebGLState:",L)}}function Y(){try{i.texImage2D(...arguments)}catch(L){Kt("WebGLState:",L)}}function Z(){try{i.texImage3D(...arguments)}catch(L){Kt("WebGLState:",L)}}function ot(L){return f[L]!==void 0?f[L]:i.getParameter(L)}function Et(L,it){f[L]!==it&&(i.pixelStorei(L,it),f[L]=it)}function ut(L){me.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),me.copy(L))}function lt(L){Jt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Jt.copy(L))}function Rt(L,it){let K=c.get(it);K===void 0&&(K=new WeakMap,c.set(it,K));let ct=K.get(L);ct===void 0&&(ct=i.getUniformBlockIndex(it,L.name),K.set(L,ct))}function Pt(L,it){const ct=c.get(it).get(L);l.get(it)!==ct&&(i.uniformBlockBinding(it,ct,L.__bindingPointIndex),l.set(it,ct))}function Ot(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},at=null,gt={},u={},d=new WeakMap,p=[],_=null,m=!1,g=null,M=null,T=null,y=null,w=null,b=null,R=null,v=new qt(0,0,0),E=0,C=!1,P=null,N=null,W=null,X=null,O=null,me.set(0,0,i.canvas.width,i.canvas.height),Jt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:et,disable:It,bindFramebuffer:Ft,drawBuffers:Ct,useProgram:ve,setBlending:Qt,setMaterial:Yt,setFlipSided:Se,setCullFace:we,setLineWidth:Ce,setPolygonOffset:Le,setScissorTest:ge,activeTexture:be,bindTexture:D,unbindTexture:Ve,compressedTexImage2D:te,compressedTexImage3D:A,texImage2D:Y,texImage3D:Z,pixelStorei:Et,getParameter:ot,updateUBOMapping:Rt,uniformBlockBinding:Pt,texStorage2D:nt,texStorage3D:rt,texSubImage2D:x,texSubImage3D:F,compressedTexSubImage2D:z,compressedTexSubImage3D:q,scissor:ut,viewport:lt,reset:Ot}}function bx(i,t,e,n,s,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,x){return p?new OffscreenCanvas(A,x):br("canvas")}function m(A,x,F){let z=1;const q=te(A);if((q.width>F||q.height>F)&&(z=F/Math.max(q.width,q.height)),z<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const nt=Math.floor(z*q.width),rt=Math.floor(z*q.height);u===void 0&&(u=_(nt,rt));const Y=x?_(nt,rt):u;return Y.width=nt,Y.height=rt,Y.getContext("2d").drawImage(A,0,0,nt,rt),Lt("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+nt+"x"+rt+")."),Y}else return"data"in A&&Lt("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),A;return A}function g(A){return A.generateMipmaps}function M(A){i.generateMipmap(A)}function T(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(A,x,F,z,q,nt=!1){if(A!==null){if(i[A]!==void 0)return i[A];Lt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let rt;z&&(rt=t.get("EXT_texture_norm16"),rt||Lt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=x;if(x===i.RED&&(F===i.FLOAT&&(Y=i.R32F),F===i.HALF_FLOAT&&(Y=i.R16F),F===i.UNSIGNED_BYTE&&(Y=i.R8),F===i.UNSIGNED_SHORT&&rt&&(Y=rt.R16_EXT),F===i.SHORT&&rt&&(Y=rt.R16_SNORM_EXT)),x===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.R8UI),F===i.UNSIGNED_SHORT&&(Y=i.R16UI),F===i.UNSIGNED_INT&&(Y=i.R32UI),F===i.BYTE&&(Y=i.R8I),F===i.SHORT&&(Y=i.R16I),F===i.INT&&(Y=i.R32I)),x===i.RG&&(F===i.FLOAT&&(Y=i.RG32F),F===i.HALF_FLOAT&&(Y=i.RG16F),F===i.UNSIGNED_BYTE&&(Y=i.RG8),F===i.UNSIGNED_SHORT&&rt&&(Y=rt.RG16_EXT),F===i.SHORT&&rt&&(Y=rt.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.RG8UI),F===i.UNSIGNED_SHORT&&(Y=i.RG16UI),F===i.UNSIGNED_INT&&(Y=i.RG32UI),F===i.BYTE&&(Y=i.RG8I),F===i.SHORT&&(Y=i.RG16I),F===i.INT&&(Y=i.RG32I)),x===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.RGB8UI),F===i.UNSIGNED_SHORT&&(Y=i.RGB16UI),F===i.UNSIGNED_INT&&(Y=i.RGB32UI),F===i.BYTE&&(Y=i.RGB8I),F===i.SHORT&&(Y=i.RGB16I),F===i.INT&&(Y=i.RGB32I)),x===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(Y=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(Y=i.RGBA16UI),F===i.UNSIGNED_INT&&(Y=i.RGBA32UI),F===i.BYTE&&(Y=i.RGBA8I),F===i.SHORT&&(Y=i.RGBA16I),F===i.INT&&(Y=i.RGBA32I)),x===i.RGB&&(F===i.UNSIGNED_SHORT&&rt&&(Y=rt.RGB16_EXT),F===i.SHORT&&rt&&(Y=rt.RGB16_SNORM_EXT),F===i.UNSIGNED_INT_5_9_9_9_REV&&(Y=i.RGB9_E5),F===i.UNSIGNED_INT_10F_11F_11F_REV&&(Y=i.R11F_G11F_B10F)),x===i.RGBA){const Z=nt?Sr:Wt.getTransfer(q);F===i.FLOAT&&(Y=i.RGBA32F),F===i.HALF_FLOAT&&(Y=i.RGBA16F),F===i.UNSIGNED_BYTE&&(Y=Z===ee?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT&&rt&&(Y=rt.RGBA16_EXT),F===i.SHORT&&rt&&(Y=rt.RGBA16_SNORM_EXT),F===i.UNSIGNED_SHORT_4_4_4_4&&(Y=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(Y=i.RGB5_A1)}return(Y===i.R16F||Y===i.R32F||Y===i.RG16F||Y===i.RG32F||Y===i.RGBA16F||Y===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function w(A,x){let F;return A?x===null||x===En||x===Es?F=i.DEPTH24_STENCIL8:x===Mn?F=i.DEPTH32F_STENCIL8:x===Ts&&(F=i.DEPTH24_STENCIL8,Lt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===En||x===Es?F=i.DEPTH_COMPONENT24:x===Mn?F=i.DEPTH_COMPONENT32F:x===Ts&&(F=i.DEPTH_COMPONENT16),F}function b(A,x){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ie&&A.minFilter!==Oe?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function R(A){const x=A.target;x.removeEventListener("dispose",R),E(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&f.delete(x)}function v(A){const x=A.target;x.removeEventListener("dispose",v),P(x)}function E(A){const x=n.get(A);if(x.__webglInit===void 0)return;const F=A.source,z=d.get(F);if(z){const q=z[x.__cacheKey];q.usedTimes--,q.usedTimes===0&&C(A),Object.keys(z).length===0&&d.delete(F)}n.remove(A)}function C(A){const x=n.get(A);i.deleteTexture(x.__webglTexture);const F=A.source,z=d.get(F);delete z[x.__cacheKey],a.memory.textures--}function P(A){const x=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let q=0;q<x.__webglFramebuffer[z].length;q++)i.deleteFramebuffer(x.__webglFramebuffer[z][q]);else i.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)i.deleteFramebuffer(x.__webglFramebuffer[z]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=A.textures;for(let z=0,q=F.length;z<q;z++){const nt=n.get(F[z]);nt.__webglTexture&&(i.deleteTexture(nt.__webglTexture),a.memory.textures--),n.remove(F[z])}n.remove(A)}let N=0;function W(){N=0}function X(){return N}function O(A){N=A}function $(){const A=N;return A>=s.maxTextures&&Lt("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),N+=1,A}function G(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function Q(A,x){const F=n.get(A);if(A.isVideoTexture&&D(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&F.__version!==A.version){const z=A.image;if(z===null)Lt("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Lt("WebGLRenderer: Texture marked for update but image is incomplete");else{It(F,A,x);return}}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+x)}function tt(A,x){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){It(F,A,x);return}else A.isExternalTexture&&(F.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+x)}function at(A,x){const F=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&F.__version!==A.version){It(F,A,x);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+x)}function gt(A,x){const F=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&F.__version!==A.version){Ft(F,A,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+x)}const yt={[Xa]:i.REPEAT,[Nn]:i.CLAMP_TO_EDGE,[qa]:i.MIRRORED_REPEAT},Zt={[Ie]:i.NEAREST,[hf]:i.NEAREST_MIPMAP_NEAREST,[Ns]:i.NEAREST_MIPMAP_LINEAR,[Oe]:i.LINEAR,[Vr]:i.LINEAR_MIPMAP_NEAREST,[vi]:i.LINEAR_MIPMAP_LINEAR},me={[df]:i.NEVER,[_f]:i.ALWAYS,[pf]:i.LESS,[Vo]:i.LEQUAL,[mf]:i.EQUAL,[Wo]:i.GEQUAL,[gf]:i.GREATER,[xf]:i.NOTEQUAL};function Jt(A,x){if(x.type===Mn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Oe||x.magFilter===Vr||x.magFilter===Ns||x.magFilter===vi||x.minFilter===Oe||x.minFilter===Vr||x.minFilter===Ns||x.minFilter===vi)&&Lt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,yt[x.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,yt[x.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,yt[x.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Zt[x.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Zt[x.minFilter]),x.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,me[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ie||x.minFilter!==Ns&&x.minFilter!==vi||x.type===Mn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const F=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function J(A,x){let F=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",R));const z=x.source;let q=d.get(z);q===void 0&&(q={},d.set(z,q));const nt=G(x);if(nt!==A.__cacheKey){q[nt]===void 0&&(q[nt]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),q[nt].usedTimes++;const rt=q[A.__cacheKey];rt!==void 0&&(q[A.__cacheKey].usedTimes--,rt.usedTimes===0&&C(x)),A.__cacheKey=nt,A.__webglTexture=q[nt].texture}return F}function st(A,x,F){return Math.floor(Math.floor(A/F)/x)}function et(A,x,F,z){const nt=A.updateRanges;if(nt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,F,z,x.data);else{nt.sort((Et,ut)=>Et.start-ut.start);let rt=0;for(let Et=1;Et<nt.length;Et++){const ut=nt[rt],lt=nt[Et],Rt=ut.start+ut.count,Pt=st(lt.start,x.width,4),Ot=st(ut.start,x.width,4);lt.start<=Rt+1&&Pt===Ot&&st(lt.start+lt.count-1,x.width,4)===Pt?ut.count=Math.max(ut.count,lt.start+lt.count-ut.start):(++rt,nt[rt]=lt)}nt.length=rt+1;const Y=e.getParameter(i.UNPACK_ROW_LENGTH),Z=e.getParameter(i.UNPACK_SKIP_PIXELS),ot=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Et=0,ut=nt.length;Et<ut;Et++){const lt=nt[Et],Rt=Math.floor(lt.start/4),Pt=Math.ceil(lt.count/4),Ot=Rt%x.width,L=Math.floor(Rt/x.width),it=Pt,K=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Ot),e.pixelStorei(i.UNPACK_SKIP_ROWS,L),e.texSubImage2D(i.TEXTURE_2D,0,Ot,L,it,K,F,z,x.data)}A.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,Y),e.pixelStorei(i.UNPACK_SKIP_PIXELS,Z),e.pixelStorei(i.UNPACK_SKIP_ROWS,ot)}}function It(A,x,F){let z=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=i.TEXTURE_3D);const q=J(A,x),nt=x.source;e.bindTexture(z,A.__webglTexture,i.TEXTURE0+F);const rt=n.get(nt);if(nt.version!==rt.__version||q===!0){if(e.activeTexture(i.TEXTURE0+F),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const K=Wt.getPrimaries(Wt.workingColorSpace),ct=x.colorSpace===jn?null:Wt.getPrimaries(x.colorSpace),mt=x.colorSpace===jn||K===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let Z=m(x.image,!1,s.maxTextureSize);Z=Ve(x,Z);const ot=r.convert(x.format,x.colorSpace),Et=r.convert(x.type);let ut=y(x.internalFormat,ot,Et,x.normalized,x.colorSpace,x.isVideoTexture);Jt(z,x);let lt;const Rt=x.mipmaps,Pt=x.isVideoTexture!==!0,Ot=rt.__version===void 0||q===!0,L=nt.dataReady,it=b(x,Z);if(x.isDepthTexture)ut=w(x.format===yi,x.type),Ot&&(Pt?e.texStorage2D(i.TEXTURE_2D,1,ut,Z.width,Z.height):e.texImage2D(i.TEXTURE_2D,0,ut,Z.width,Z.height,0,ot,Et,null));else if(x.isDataTexture)if(Rt.length>0){Pt&&Ot&&e.texStorage2D(i.TEXTURE_2D,it,ut,Rt[0].width,Rt[0].height);for(let K=0,ct=Rt.length;K<ct;K++)lt=Rt[K],Pt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ot,Et,lt.data):e.texImage2D(i.TEXTURE_2D,K,ut,lt.width,lt.height,0,ot,Et,lt.data);x.generateMipmaps=!1}else Pt?(Ot&&e.texStorage2D(i.TEXTURE_2D,it,ut,Z.width,Z.height),L&&et(x,Z,ot,Et)):e.texImage2D(i.TEXTURE_2D,0,ut,Z.width,Z.height,0,ot,Et,Z.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Pt&&Ot&&e.texStorage3D(i.TEXTURE_2D_ARRAY,it,ut,Rt[0].width,Rt[0].height,Z.depth);for(let K=0,ct=Rt.length;K<ct;K++)if(lt=Rt[K],x.format!==un)if(ot!==null)if(Pt){if(L)if(x.layerUpdates.size>0){const mt=rc(lt.width,lt.height,x.format,x.type);for(const j of x.layerUpdates){const Tt=lt.data.subarray(j*mt/lt.data.BYTES_PER_ELEMENT,(j+1)*mt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,j,lt.width,lt.height,1,ot,Tt)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,Z.depth,ot,lt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,ut,lt.width,lt.height,Z.depth,0,lt.data,0,0);else Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pt?L&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,lt.width,lt.height,Z.depth,ot,Et,lt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,K,ut,lt.width,lt.height,Z.depth,0,ot,Et,lt.data)}else{Pt&&Ot&&e.texStorage2D(i.TEXTURE_2D,it,ut,Rt[0].width,Rt[0].height);for(let K=0,ct=Rt.length;K<ct;K++)lt=Rt[K],x.format!==un?ot!==null?Pt?L&&e.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ot,lt.data):e.compressedTexImage2D(i.TEXTURE_2D,K,ut,lt.width,lt.height,0,lt.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,lt.width,lt.height,ot,Et,lt.data):e.texImage2D(i.TEXTURE_2D,K,ut,lt.width,lt.height,0,ot,Et,lt.data)}else if(x.isDataArrayTexture)if(Pt){if(Ot&&e.texStorage3D(i.TEXTURE_2D_ARRAY,it,ut,Z.width,Z.height,Z.depth),L)if(x.layerUpdates.size>0){const K=rc(Z.width,Z.height,x.format,x.type);for(const ct of x.layerUpdates){const mt=Z.data.subarray(ct*K/Z.data.BYTES_PER_ELEMENT,(ct+1)*K/Z.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,ct,Z.width,Z.height,1,ot,Et,mt)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,ot,Et,Z.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,ut,Z.width,Z.height,Z.depth,0,ot,Et,Z.data);else if(x.isData3DTexture)Pt?(Ot&&e.texStorage3D(i.TEXTURE_3D,it,ut,Z.width,Z.height,Z.depth),L&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,ot,Et,Z.data)):e.texImage3D(i.TEXTURE_3D,0,ut,Z.width,Z.height,Z.depth,0,ot,Et,Z.data);else if(x.isFramebufferTexture){if(Ot)if(Pt)e.texStorage2D(i.TEXTURE_2D,it,ut,Z.width,Z.height);else{let K=Z.width,ct=Z.height;for(let mt=0;mt<it;mt++)e.texImage2D(i.TEXTURE_2D,mt,ut,K,ct,0,ot,Et,null),K>>=1,ct>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){const K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),Z.parentNode!==K){K.appendChild(Z),f.add(x),K.onpaint=ct=>{const mt=ct.changedElements;for(const j of f)mt.includes(j.image)&&(j.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Z);else{const mt=i.RGBA,j=i.RGBA,Tt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,mt,j,Tt,Z)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Rt.length>0){if(Pt&&Ot){const K=te(Rt[0]);e.texStorage2D(i.TEXTURE_2D,it,ut,K.width,K.height)}for(let K=0,ct=Rt.length;K<ct;K++)lt=Rt[K],Pt?L&&e.texSubImage2D(i.TEXTURE_2D,K,0,0,ot,Et,lt):e.texImage2D(i.TEXTURE_2D,K,ut,ot,Et,lt);x.generateMipmaps=!1}else if(Pt){if(Ot){const K=te(Z);e.texStorage2D(i.TEXTURE_2D,it,ut,K.width,K.height)}L&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,ot,Et,Z)}else e.texImage2D(i.TEXTURE_2D,0,ut,ot,Et,Z);g(x)&&M(z),rt.__version=nt.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Ft(A,x,F){if(x.image.length!==6)return;const z=J(A,x),q=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+F);const nt=n.get(q);if(q.version!==nt.__version||z===!0){e.activeTexture(i.TEXTURE0+F);const rt=Wt.getPrimaries(Wt.workingColorSpace),Y=x.colorSpace===jn?null:Wt.getPrimaries(x.colorSpace),Z=x.colorSpace===jn||rt===Y?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const ot=x.isCompressedTexture||x.image[0].isCompressedTexture,Et=x.image[0]&&x.image[0].isDataTexture,ut=[];for(let j=0;j<6;j++)!ot&&!Et?ut[j]=m(x.image[j],!0,s.maxCubemapSize):ut[j]=Et?x.image[j].image:x.image[j],ut[j]=Ve(x,ut[j]);const lt=ut[0],Rt=r.convert(x.format,x.colorSpace),Pt=r.convert(x.type),Ot=y(x.internalFormat,Rt,Pt,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,it=nt.__version===void 0||z===!0,K=q.dataReady;let ct=b(x,lt);Jt(i.TEXTURE_CUBE_MAP,x);let mt;if(ot){L&&it&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Ot,lt.width,lt.height);for(let j=0;j<6;j++){mt=ut[j].mipmaps;for(let Tt=0;Tt<mt.length;Tt++){const St=mt[Tt];x.format!==un?Rt!==null?L?K&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,0,0,St.width,St.height,Rt,St.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,Ot,St.width,St.height,0,St.data):Lt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,0,0,St.width,St.height,Rt,Pt,St.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt,Ot,St.width,St.height,0,Rt,Pt,St.data)}}}else{if(mt=x.mipmaps,L&&it){mt.length>0&&ct++;const j=te(ut[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ct,Ot,j.width,j.height)}for(let j=0;j<6;j++)if(Et){L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,ut[j].width,ut[j].height,Rt,Pt,ut[j].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ot,ut[j].width,ut[j].height,0,Rt,Pt,ut[j].data);for(let Tt=0;Tt<mt.length;Tt++){const xe=mt[Tt].image[j].image;L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,0,0,xe.width,xe.height,Rt,Pt,xe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,Ot,xe.width,xe.height,0,Rt,Pt,xe.data)}}else{L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Rt,Pt,ut[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ot,Rt,Pt,ut[j]);for(let Tt=0;Tt<mt.length;Tt++){const St=mt[Tt];L?K&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,0,0,Rt,Pt,St.image[j]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Tt+1,Ot,Rt,Pt,St.image[j])}}}g(x)&&M(i.TEXTURE_CUBE_MAP),nt.__version=q.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function Ct(A,x,F,z,q,nt){const rt=r.convert(F.format,F.colorSpace),Y=r.convert(F.type),Z=y(F.internalFormat,rt,Y,F.normalized,F.colorSpace),ot=n.get(x),Et=n.get(F);if(Et.__renderTarget=x,!ot.__hasExternalTextures){const ut=Math.max(1,x.width>>nt),lt=Math.max(1,x.height>>nt);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?e.texImage3D(q,nt,Z,ut,lt,x.depth,0,rt,Y,null):e.texImage2D(q,nt,Z,ut,lt,0,rt,Y,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),be(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,z,q,Et.__webglTexture,0,ge(x)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,z,q,Et.__webglTexture,nt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function ve(A,x,F){if(i.bindRenderbuffer(i.RENDERBUFFER,A),x.depthBuffer){const z=x.depthTexture,q=z&&z.isDepthTexture?z.type:null,nt=w(x.stencilBuffer,q),rt=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;be(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge(x),nt,x.width,x.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge(x),nt,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,nt,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,A)}else{const z=x.textures;for(let q=0;q<z.length;q++){const nt=z[q],rt=r.convert(nt.format,nt.colorSpace),Y=r.convert(nt.type),Z=y(nt.internalFormat,rt,Y,nt.normalized,nt.colorSpace);be(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ge(x),Z,x.width,x.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,ge(x),Z,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Z,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Vt(A,x,F){const z=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const q=n.get(x.depthTexture);if(q.__renderTarget=x,(!q.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(q.__webglInit===void 0&&(q.__webglInit=!0,x.depthTexture.addEventListener("dispose",R)),q.__webglTexture===void 0){q.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Jt(i.TEXTURE_CUBE_MAP,x.depthTexture);const ot=r.convert(x.depthTexture.format),Et=r.convert(x.depthTexture.type);let ut;x.depthTexture.format===zn?ut=i.DEPTH_COMPONENT24:x.depthTexture.format===yi&&(ut=i.DEPTH24_STENCIL8);for(let lt=0;lt<6;lt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,ut,x.width,x.height,0,ot,Et,null)}}else Q(x.depthTexture,0);const nt=q.__webglTexture,rt=ge(x),Y=z?i.TEXTURE_CUBE_MAP_POSITIVE_X+F:i.TEXTURE_2D,Z=x.depthTexture.format===yi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===zn)be(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,Y,nt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,Z,Y,nt,0);else if(x.depthTexture.format===yi)be(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,Y,nt,0,rt):i.framebufferTexture2D(i.FRAMEBUFFER,Z,Y,nt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ie(A){const x=n.get(A),F=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const z=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){const q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",q)};z.addEventListener("dispose",q),x.__depthDisposeCallback=q}x.__boundDepthTexture=z}if(A.depthTexture&&!x.__autoAllocateDepthBuffer)if(F)for(let z=0;z<6;z++)Vt(x.__webglFramebuffer[z],A,z);else{const z=A.texture.mipmaps;z&&z.length>0?Vt(x.__webglFramebuffer[0],A,0):Vt(x.__webglFramebuffer,A,0)}else if(F){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=i.createRenderbuffer(),ve(x.__webglDepthbuffer[z],A,!1);else{const q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=x.__webglDepthbuffer[z];i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,nt)}}else{const z=A.texture.mipmaps;if(z&&z.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),ve(x.__webglDepthbuffer,A,!1);else{const q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,nt=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,nt),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,nt)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Qt(A,x,F){const z=n.get(A);x!==void 0&&Ct(z.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&ie(A)}function Yt(A){const x=A.texture,F=n.get(A),z=n.get(x);A.addEventListener("dispose",v);const q=A.textures,nt=A.isWebGLCubeRenderTarget===!0,rt=q.length>1;if(rt||(z.__webglTexture===void 0&&(z.__webglTexture=i.createTexture()),z.__version=x.version,a.memory.textures++),nt){F.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[Y]=[];for(let Z=0;Z<x.mipmaps.length;Z++)F.__webglFramebuffer[Y][Z]=i.createFramebuffer()}else F.__webglFramebuffer[Y]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let Y=0;Y<x.mipmaps.length;Y++)F.__webglFramebuffer[Y]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(rt)for(let Y=0,Z=q.length;Y<Z;Y++){const ot=n.get(q[Y]);ot.__webglTexture===void 0&&(ot.__webglTexture=i.createTexture(),a.memory.textures++)}if(A.samples>0&&be(A)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let Y=0;Y<q.length;Y++){const Z=q[Y];F.__webglColorRenderbuffer[Y]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[Y]);const ot=r.convert(Z.format,Z.colorSpace),Et=r.convert(Z.type),ut=y(Z.internalFormat,ot,Et,Z.normalized,Z.colorSpace,A.isXRRenderTarget===!0),lt=ge(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,lt,ut,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Y,i.RENDERBUFFER,F.__webglColorRenderbuffer[Y])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),ve(F.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(nt){e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),Jt(i.TEXTURE_CUBE_MAP,x);for(let Y=0;Y<6;Y++)if(x.mipmaps&&x.mipmaps.length>0)for(let Z=0;Z<x.mipmaps.length;Z++)Ct(F.__webglFramebuffer[Y][Z],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Z);else Ct(F.__webglFramebuffer[Y],A,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);g(x)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(rt){for(let Y=0,Z=q.length;Y<Z;Y++){const ot=q[Y],Et=n.get(ot);let ut=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(ut=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(ut,Et.__webglTexture),Jt(ut,ot),Ct(F.__webglFramebuffer,A,ot,i.COLOR_ATTACHMENT0+Y,ut,0),g(ot)&&M(ut)}e.unbindTexture()}else{let Y=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Y=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Y,z.__webglTexture),Jt(Y,x),x.mipmaps&&x.mipmaps.length>0)for(let Z=0;Z<x.mipmaps.length;Z++)Ct(F.__webglFramebuffer[Z],A,x,i.COLOR_ATTACHMENT0,Y,Z);else Ct(F.__webglFramebuffer,A,x,i.COLOR_ATTACHMENT0,Y,0);g(x)&&M(Y),e.unbindTexture()}A.depthBuffer&&ie(A)}function Se(A){const x=A.textures;for(let F=0,z=x.length;F<z;F++){const q=x[F];if(g(q)){const nt=T(A),rt=n.get(q).__webglTexture;e.bindTexture(nt,rt),M(nt),e.unbindTexture()}}}const we=[],Ce=[];function Le(A){if(A.samples>0){if(be(A)===!1){const x=A.textures,F=A.width,z=A.height;let q=i.COLOR_BUFFER_BIT;const nt=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,rt=n.get(A),Y=x.length>1;if(Y)for(let ot=0;ot<x.length;ot++)e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,rt.__webglMultisampledFramebuffer);const Z=A.texture.mipmaps;Z&&Z.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglFramebuffer);for(let ot=0;ot<x.length;ot++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),Y){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,rt.__webglColorRenderbuffer[ot]);const Et=n.get(x[ot]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Et,0)}i.blitFramebuffer(0,0,F,z,0,0,F,z,q,i.NEAREST),l===!0&&(we.length=0,Ce.length=0,we.push(i.COLOR_ATTACHMENT0+ot),A.depthBuffer&&A.resolveDepthBuffer===!1&&(we.push(nt),Ce.push(nt),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ce)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,we))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Y)for(let ot=0;ot<x.length;ot++){e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.RENDERBUFFER,rt.__webglColorRenderbuffer[ot]);const Et=n.get(x[ot]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,rt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ot,i.TEXTURE_2D,Et,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,rt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const x=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function ge(A){return Math.min(s.maxSamples,A.samples)}function be(A){const x=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function D(A){const x=a.render.frame;h.get(A)!==x&&(h.set(A,x),A.update())}function Ve(A,x){const F=A.colorSpace,z=A.format,q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||F!==Mr&&F!==jn&&(Wt.getTransfer(F)===ee?(z!==un||q!==Je)&&Lt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Kt("WebGLTextures: Unsupported texture color space:",F)),x}function te(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=$,this.resetTextureUnits=W,this.getTextureUnits=X,this.setTextureUnits=O,this.setTexture2D=Q,this.setTexture2DArray=tt,this.setTexture3D=at,this.setTextureCube=gt,this.rebindTextures=Qt,this.setupRenderTarget=Yt,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=Le,this.setupDepthRenderbuffer=ie,this.setupFrameBufferTexture=Ct,this.useMultisampledRTT=be,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Tx(i,t){function e(n,s=jn){let r;const a=Wt.getTransfer(s);if(n===Je)return i.UNSIGNED_BYTE;if(n===ko)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Bo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ch)return i.BYTE;if(n===hh)return i.SHORT;if(n===Ts)return i.UNSIGNED_SHORT;if(n===Oo)return i.INT;if(n===En)return i.UNSIGNED_INT;if(n===Mn)return i.FLOAT;if(n===Hn)return i.HALF_FLOAT;if(n===dh)return i.ALPHA;if(n===ph)return i.RGB;if(n===un)return i.RGBA;if(n===zn)return i.DEPTH_COMPONENT;if(n===yi)return i.DEPTH_STENCIL;if(n===mh)return i.RED;if(n===Ho)return i.RED_INTEGER;if(n===Ti)return i.RG;if(n===zo)return i.RG_INTEGER;if(n===Go)return i.RGBA_INTEGER;if(n===ur||n===fr||n===dr||n===pr)if(a===ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ur)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===fr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===pr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ur)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===fr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===dr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===pr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ya||n===$a||n===Ka||n===Za)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ya)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===$a)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ja||n===Qa||n===ja||n===to||n===eo||n===vr||n===no)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ja||n===Qa)return a===ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ja)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===to)return r.COMPRESSED_R11_EAC;if(n===eo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===vr)return r.COMPRESSED_RG11_EAC;if(n===no)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo||n===po||n===mo||n===go||n===xo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===io)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===so)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===ro)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ao)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===oo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===lo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===co)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ho)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===uo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===fo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===po)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===mo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===go)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===xo)return a===ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===_o||n===vo||n===yo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===_o)return a===ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===vo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===yo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Mo||n===So||n===yr||n===bo)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Mo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===So)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===bo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Es?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Ex=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,wx=`
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

}`;class Ax{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Th(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new wn({vertexShader:Ex,fragmentShader:wx,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Dt(new Rr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Rx extends wi{constructor(t,e){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null;const _=typeof XRWebGLBinding<"u",m=new Ax,g={},M=e.getContextAttributes();let T=null,y=null;const w=[],b=[],R=new ht;let v=null;const E=new ln;E.viewport=new fe;const C=new ln;C.viewport=new fe;const P=[E,C],N=new kd;let W=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let st=w[J];return st===void 0&&(st=new Jr,w[J]=st),st.getTargetRaySpace()},this.getControllerGrip=function(J){let st=w[J];return st===void 0&&(st=new Jr,w[J]=st),st.getGripSpace()},this.getHand=function(J){let st=w[J];return st===void 0&&(st=new Jr,w[J]=st),st.getHandSpace()};function O(J){const st=b.indexOf(J.inputSource);if(st===-1)return;const et=w[st];et!==void 0&&(et.update(J.inputSource,J.frame,c||a),et.dispatchEvent({type:J.type,data:J.inputSource}))}function $(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",G);for(let J=0;J<w.length;J++){const st=b[J];st!==null&&(b[J]=null,w[J].disconnect(st))}W=null,X=null,m.reset();for(const J in g)delete g[J];t.setRenderTarget(T),d=null,u=null,f=null,s=null,y=null,Jt.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Lt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Lt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return p},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(T=t.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",$),s.addEventListener("inputsourceschange",G),M.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let et=null,It=null,Ft=null;M.depth&&(Ft=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=M.stencil?yi:zn,It=M.stencil?Es:En);const Ct={colorFormat:e.RGBA8,depthFormat:Ft,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ct),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Tn(u.textureWidth,u.textureHeight,{format:un,type:Je,depthTexture:new ji(u.textureWidth,u.textureHeight,It,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const et={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,et),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new Tn(d.framebufferWidth,d.framebufferHeight,{format:un,type:Je,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Jt.setContext(s),Jt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function G(J){for(let st=0;st<J.removed.length;st++){const et=J.removed[st],It=b.indexOf(et);It>=0&&(b[It]=null,w[It].disconnect(et))}for(let st=0;st<J.added.length;st++){const et=J.added[st];let It=b.indexOf(et);if(It===-1){for(let Ct=0;Ct<w.length;Ct++)if(Ct>=b.length){b.push(et),It=Ct;break}else if(b[Ct]===null){b[Ct]=et,It=Ct;break}if(It===-1)break}const Ft=w[It];Ft&&Ft.connect(et)}}const Q=new I,tt=new I;function at(J,st,et){Q.setFromMatrixPosition(st.matrixWorld),tt.setFromMatrixPosition(et.matrixWorld);const It=Q.distanceTo(tt),Ft=st.projectionMatrix.elements,Ct=et.projectionMatrix.elements,ve=Ft[14]/(Ft[10]-1),Vt=Ft[14]/(Ft[10]+1),ie=(Ft[9]+1)/Ft[5],Qt=(Ft[9]-1)/Ft[5],Yt=(Ft[8]-1)/Ft[0],Se=(Ct[8]+1)/Ct[0],we=ve*Yt,Ce=ve*Se,Le=It/(-Yt+Se),ge=Le*-Yt;if(st.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(ge),J.translateZ(Le),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ft[10]===-1)J.projectionMatrix.copy(st.projectionMatrix),J.projectionMatrixInverse.copy(st.projectionMatrixInverse);else{const be=ve+Le,D=Vt+Le,Ve=we-ge,te=Ce+(It-ge),A=ie*Vt/D*be,x=Qt*Vt/D*be;J.projectionMatrix.makePerspective(Ve,te,A,x,be,D),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function gt(J,st){st===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(st.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let st=J.near,et=J.far;m.texture!==null&&(m.depthNear>0&&(st=m.depthNear),m.depthFar>0&&(et=m.depthFar)),N.near=C.near=E.near=st,N.far=C.far=E.far=et,(W!==N.near||X!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),W=N.near,X=N.far),N.layers.mask=J.layers.mask|6,E.layers.mask=N.layers.mask&-5,C.layers.mask=N.layers.mask&-3;const It=J.parent,Ft=N.cameras;gt(N,It);for(let Ct=0;Ct<Ft.length;Ct++)gt(Ft[Ct],It);Ft.length===2?at(N,E,C):N.projectionMatrix.copy(E.projectionMatrix),yt(J,N,It)};function yt(J,st,et){et===null?J.matrix.copy(st.matrixWorld):(J.matrix.copy(et.matrixWorld),J.matrix.invert(),J.matrix.multiply(st.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(st.projectionMatrix),J.projectionMatrixInverse.copy(st.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Eo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(J){l=J,u!==null&&(u.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(J){return g[J]};let Zt=null;function me(J,st){if(h=st.getViewerPose(c||a),p=st,h!==null){const et=h.views;d!==null&&(t.setRenderTargetFramebuffer(y,d.framebuffer),t.setRenderTarget(y));let It=!1;et.length!==N.cameras.length&&(N.cameras.length=0,It=!0);for(let Vt=0;Vt<et.length;Vt++){const ie=et[Vt];let Qt=null;if(d!==null)Qt=d.getViewport(ie);else{const Se=f.getViewSubImage(u,ie);Qt=Se.viewport,Vt===0&&(t.setRenderTargetTextures(y,Se.colorTexture,Se.depthStencilTexture),t.setRenderTarget(y))}let Yt=P[Vt];Yt===void 0&&(Yt=new ln,Yt.layers.enable(Vt),Yt.viewport=new fe,P[Vt]=Yt),Yt.matrix.fromArray(ie.transform.matrix),Yt.matrix.decompose(Yt.position,Yt.quaternion,Yt.scale),Yt.projectionMatrix.fromArray(ie.projectionMatrix),Yt.projectionMatrixInverse.copy(Yt.projectionMatrix).invert(),Yt.viewport.set(Qt.x,Qt.y,Qt.width,Qt.height),Vt===0&&(N.matrix.copy(Yt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),It===!0&&N.cameras.push(Yt)}const Ft=s.enabledFeatures;if(Ft&&Ft.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){f=n.getBinding();const Vt=f.getDepthInformation(et[0]);Vt&&Vt.isValid&&Vt.texture&&m.init(Vt,s.renderState)}if(Ft&&Ft.includes("camera-access")&&_){t.state.unbindTexture(),f=n.getBinding();for(let Vt=0;Vt<et.length;Vt++){const ie=et[Vt].camera;if(ie){let Qt=g[ie];Qt||(Qt=new Th,g[ie]=Qt);const Yt=f.getCameraImage(ie);Qt.sourceTexture=Yt}}}}for(let et=0;et<w.length;et++){const It=b[et],Ft=w[et];It!==null&&Ft!==void 0&&Ft.update(It,st,c||a)}Zt&&Zt(J,st),st.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:st}),p=null}const Jt=new kh;Jt.setAnimationLoop(me),this.setAnimationLoop=function(J){Zt=J},this.dispose=function(){}}}const Cx=new ae,Xh=new Nt;Xh.set(-1,0,0,0,1,0,0,0,1);function Px(i,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,Uh(i)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function s(m,g,M,T,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),f(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),u(m,g),g.isMeshPhysicalMaterial&&d(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),_(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,M,T):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===qe&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===qe&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const M=t.get(g),T=M.envMap,y=M.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(Cx.makeRotationFromEuler(y)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Xh),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,M,T){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*M,m.scale.value=T*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function f(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function d(m,g,M){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===qe&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){const M=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Lx(i,t,e,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,w){const b=w.program;n.uniformBlockBinding(y,b)}function c(y,w){let b=s[y.id];b===void 0&&(m(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",M));const R=w.program;n.updateUBOMapping(y,R);const v=t.render.frame;r[y.id]!==v&&(u(y),r[y.id]=v)}function h(y){const w=f();y.__bindingPointIndex=w;const b=i.createBuffer(),R=y.__size,v=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,b),b}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Kt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const w=s[y.id],b=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let v=0,E=b.length;v<E;v++){const C=b[v];if(Array.isArray(C))for(let P=0,N=C.length;P<N;P++)d(C[P],v,P,R);else d(C,v,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(y,w,b,R){if(_(y,w,b,R)===!0){const v=y.__offset,E=y.value;if(Array.isArray(E)){let C=0;for(let P=0;P<E.length;P++){const N=E[P],W=g(N);p(N,y.__data,C),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(C+=W.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,y.__data)}}function p(y,w,b){typeof y=="number"||typeof y=="boolean"?w[0]=y:y.isMatrix3?(w[0]=y.elements[0],w[1]=y.elements[1],w[2]=y.elements[2],w[3]=0,w[4]=y.elements[3],w[5]=y.elements[4],w[6]=y.elements[5],w[7]=0,w[8]=y.elements[6],w[9]=y.elements[7],w[10]=y.elements[8],w[11]=0):ArrayBuffer.isView(y)?w.set(new y.constructor(y.buffer,y.byteOffset,w.length)):y.toArray(w,b)}function _(y,w,b,R){const v=y.value,E=w+"_"+b;if(R[E]===void 0)return typeof v=="number"||typeof v=="boolean"?R[E]=v:ArrayBuffer.isView(v)?R[E]=v.slice():R[E]=v.clone(),!0;{const C=R[E];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return R[E]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(C.equals(v)===!1)return C.copy(v),!0}}return!1}function m(y){const w=y.uniforms;let b=0;const R=16;for(let E=0,C=w.length;E<C;E++){const P=Array.isArray(w[E])?w[E]:[w[E]];for(let N=0,W=P.length;N<W;N++){const X=P[N],O=Array.isArray(X.value)?X.value:[X.value];for(let $=0,G=O.length;$<G;$++){const Q=O[$],tt=g(Q),at=b%R,gt=at%tt.boundary,yt=at+gt;b+=gt,yt!==0&&R-yt<tt.storage&&(b+=R-yt),X.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),X.__offset=b,b+=tt.storage}}}const v=b%R;return v>0&&(b+=R-v),y.__size=b,y.__cache={},this}function g(y){const w={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(w.boundary=4,w.storage=4):y.isVector2?(w.boundary=8,w.storage=8):y.isVector3||y.isColor?(w.boundary=16,w.storage=12):y.isVector4?(w.boundary=16,w.storage=16):y.isMatrix3?(w.boundary=48,w.storage=48):y.isMatrix4?(w.boundary=64,w.storage=64):y.isTexture?Lt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(w.boundary=16,w.storage=y.byteLength):Lt("WebGLRenderer: Unsupported uniform value type.",y),w}function M(y){const w=y.target;w.removeEventListener("dispose",M);const b=a.indexOf(w.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete r[w.id]}function T(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:T}}const Ix=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let xn=null;function Dx(){return xn===null&&(xn=new Wf(Ix,16,16,Ti,Hn),xn.name="DFG_LUT",xn.minFilter=Oe,xn.magFilter=Oe,xn.wrapS=Nn,xn.wrapT=Nn,xn.generateMipmaps=!1,xn.needsUpdate=!0),xn}class Ux{constructor(t={}){const{canvas:e=yf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Je}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const _=d,m=new Set([Go,zo,Ho]),g=new Set([Je,En,Ts,Es,ko,Bo]),M=new Uint32Array(4),T=new Int32Array(4),y=new I;let w=null,b=null;const R=[],v=[];let E=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=bn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,N=null,W=null,X=null,O=null;this._outputColorSpace=Ze;let $=0,G=0,Q=null,tt=-1,at=null;const gt=new fe,yt=new fe;let Zt=null;const me=new qt(0);let Jt=0,J=e.width,st=e.height,et=1,It=null,Ft=null;const Ct=new fe(0,0,J,st),ve=new fe(0,0,J,st);let Vt=!1;const ie=new Yo;let Qt=!1,Yt=!1;const Se=new ae,we=new I,Ce=new fe,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ge=!1;function be(){return Q===null?et:1}let D=n;function Ve(S,U){return e.getContext(S,U)}try{const S={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Fo}`),e.addEventListener("webglcontextlost",xe,!1),e.addEventListener("webglcontextrestored",le,!1),e.addEventListener("webglcontextcreationerror",dn,!1),D===null){const U="webgl2";if(D=Ve(U,S),D===null)throw Ve(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw Kt("WebGLRenderer: "+S.message),S}let te,A,x,F,z,q,nt,rt,Y,Z,ot,Et,ut,lt,Rt,Pt,Ot,L,it,K,ct,mt,j;function Tt(){te=new D0(D),te.init(),ct=new Tx(D,te),A=new E0(D,te,t,ct),x=new Sx(D,te),A.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),W=D.createFramebuffer(),X=D.createFramebuffer(),O=D.createFramebuffer(),F=new F0(D),z=new lx,q=new bx(D,te,x,z,A,ct,F),nt=new I0(C),rt=new Hd(D),mt=new b0(D,rt),Y=new U0(D,rt,F,mt),Z=new k0(D,Y,rt,mt,F),L=new O0(D,A,q),Rt=new w0(z),ot=new ox(C,nt,te,A,mt,Rt),Et=new Px(C,z),ut=new hx,lt=new gx(te),Ot=new S0(C,nt,x,Z,p,l),Pt=new Mx(C,Z,A),j=new Lx(D,F,A,x),it=new T0(D,te,F),K=new N0(D,te,F),F.programs=ot.programs,C.capabilities=A,C.extensions=te,C.properties=z,C.renderLists=ut,C.shadowMap=Pt,C.state=x,C.info=F}Tt(),_!==Je&&(E=new H0(_,e.width,e.height,o,s,r));const St=new Rx(C,D);this.xr=St,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const S=te.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=te.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(S){S!==void 0&&(et=S,this.setSize(J,st,!1))},this.getSize=function(S){return S.set(J,st)},this.setSize=function(S,U,V=!0){if(St.isPresenting){Lt("WebGLRenderer: Can't change size while VR device is presenting.");return}J=S,st=U,e.width=Math.floor(S*et),e.height=Math.floor(U*et),V===!0&&(e.style.width=S+"px",e.style.height=U+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(J*et,st*et).floor()},this.setDrawingBufferSize=function(S,U,V){J=S,st=U,et=V,e.width=Math.floor(S*V),e.height=Math.floor(U*V),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(_===Je){Kt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){Lt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(gt)},this.getViewport=function(S){return S.copy(Ct)},this.setViewport=function(S,U,V,B){S.isVector4?Ct.set(S.x,S.y,S.z,S.w):Ct.set(S,U,V,B),x.viewport(gt.copy(Ct).multiplyScalar(et).round())},this.getScissor=function(S){return S.copy(ve)},this.setScissor=function(S,U,V,B){S.isVector4?ve.set(S.x,S.y,S.z,S.w):ve.set(S,U,V,B),x.scissor(yt.copy(ve).multiplyScalar(et).round())},this.getScissorTest=function(){return Vt},this.setScissorTest=function(S){x.setScissorTest(Vt=S)},this.setOpaqueSort=function(S){It=S},this.setTransparentSort=function(S){Ft=S},this.getClearColor=function(S){return S.copy(Ot.getClearColor())},this.setClearColor=function(){Ot.setClearColor(...arguments)},this.getClearAlpha=function(){return Ot.getClearAlpha()},this.setClearAlpha=function(){Ot.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,V=!0){let B=0;if(S){let H=!1;if(Q!==null){const pt=Q.texture.format;H=m.has(pt)}if(H){const pt=Q.texture.type,vt=g.has(pt),dt=Ot.getClearColor(),bt=Ot.getClearAlpha(),wt=dt.r,kt=dt.g,zt=dt.b;vt?(M[0]=wt,M[1]=kt,M[2]=zt,M[3]=bt,D.clearBufferuiv(D.COLOR,0,M)):(T[0]=wt,T[1]=kt,T[2]=zt,T[3]=bt,D.clearBufferiv(D.COLOR,0,T))}else B|=D.COLOR_BUFFER_BIT}U&&(B|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),V&&(B|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),B!==0&&D.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),N=S},this.dispose=function(){e.removeEventListener("webglcontextlost",xe,!1),e.removeEventListener("webglcontextrestored",le,!1),e.removeEventListener("webglcontextcreationerror",dn,!1),Ot.dispose(),ut.dispose(),lt.dispose(),z.dispose(),nt.dispose(),Z.dispose(),mt.dispose(),j.dispose(),ot.dispose(),St.dispose(),St.removeEventListener("sessionstart",al),St.removeEventListener("sessionend",ol),ri.stop()};function xe(S){S.preventDefault(),Cl("WebGLRenderer: Context Lost."),P=!0}function le(){Cl("WebGLRenderer: Context Restored."),P=!1;const S=F.autoReset,U=Pt.enabled,V=Pt.autoUpdate,B=Pt.needsUpdate,H=Pt.type;Tt(),F.autoReset=S,Pt.enabled=U,Pt.autoUpdate=V,Pt.needsUpdate=B,Pt.type=H}function dn(S){Kt("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function pn(S){const U=S.target;U.removeEventListener("dispose",pn),ru(U)}function ru(S){au(S),z.remove(S)}function au(S){const U=z.get(S).programs;U!==void 0&&(U.forEach(function(V){ot.releaseProgram(V)}),S.isShaderMaterial&&ot.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,V,B,H,pt){U===null&&(U=Le);const vt=H.isMesh&&H.matrixWorld.determinantAffine()<0,dt=cu(S,U,V,B,H);x.setMaterial(B,vt);let bt=V.index,wt=1;if(B.wireframe===!0){if(bt=Y.getWireframeAttribute(V),bt===void 0)return;wt=2}const kt=V.drawRange,zt=V.attributes.position;let At=kt.start*wt,ne=(kt.start+kt.count)*wt;pt!==null&&(At=Math.max(At,pt.start*wt),ne=Math.min(ne,(pt.start+pt.count)*wt)),bt!==null?(At=Math.max(At,0),ne=Math.min(ne,bt.count)):zt!=null&&(At=Math.max(At,0),ne=Math.min(ne,zt.count));const ye=ne-At;if(ye<0||ye===1/0)return;mt.setup(H,B,dt,V,bt);let _e,se=it;if(bt!==null&&(_e=rt.get(bt),se=K,se.setIndex(_e)),H.isMesh)B.wireframe===!0?(x.setLineWidth(B.wireframeLinewidth*be()),se.setMode(D.LINES)):se.setMode(D.TRIANGLES);else if(H.isLine){let Ue=B.linewidth;Ue===void 0&&(Ue=1),x.setLineWidth(Ue*be()),H.isLineSegments?se.setMode(D.LINES):H.isLineLoop?se.setMode(D.LINE_LOOP):se.setMode(D.LINE_STRIP)}else H.isPoints?se.setMode(D.POINTS):H.isSprite&&se.setMode(D.TRIANGLES);if(H.isBatchedMesh)if(te.get("WEBGL_multi_draw"))se.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Ue=H._multiDrawStarts,_t=H._multiDrawCounts,Ye=H._multiDrawCount,$t=bt?rt.get(bt).bytesPerElement:1,je=z.get(B).currentProgram.getUniforms();for(let mn=0;mn<Ye;mn++)je.setValue(D,"_gl_DrawID",mn),se.render(Ue[mn]/$t,_t[mn])}else if(H.isInstancedMesh)se.renderInstances(At,ye,H.count);else if(V.isInstancedBufferGeometry){const Ue=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,_t=Math.min(V.instanceCount,Ue);se.renderInstances(At,ye,_t)}else se.render(At,ye)};function rl(S,U,V){S.transparent===!0&&S.side===Un&&S.forceSinglePass===!1?(S.side=qe,S.needsUpdate=!0,Us(S,U,V),S.side=ii,S.needsUpdate=!0,Us(S,U,V),S.side=Un):Us(S,U,V)}this.compile=function(S,U,V=null){V===null&&(V=S),b=lt.get(V),b.init(U),v.push(b),V.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),S!==V&&S.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),b.setupLights();const B=new Set;return S.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const pt=H.material;if(pt)if(Array.isArray(pt))for(let vt=0;vt<pt.length;vt++){const dt=pt[vt];rl(dt,V,H),B.add(dt)}else rl(pt,V,H),B.add(pt)}),b=v.pop(),B},this.compileAsync=function(S,U,V=null){const B=this.compile(S,U,V);return new Promise(H=>{function pt(){if(B.forEach(function(vt){z.get(vt).currentProgram.isReady()&&B.delete(vt)}),B.size===0){H(S);return}setTimeout(pt,10)}te.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let Ir=null;function ou(S){Ir&&Ir(S)}function al(){ri.stop()}function ol(){ri.start()}const ri=new kh;ri.setAnimationLoop(ou),typeof self<"u"&&ri.setContext(self),this.setAnimationLoop=function(S){Ir=S,St.setAnimationLoop(S),S===null?ri.stop():ri.start()},St.addEventListener("sessionstart",al),St.addEventListener("sessionend",ol),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){Kt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;N!==null&&N.renderStart(S,U);const V=St.enabled===!0&&St.isPresenting===!0,B=E!==null&&(Q===null||V)&&E.begin(C,Q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),St.enabled===!0&&St.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(St.cameraAutoUpdate===!0&&St.updateCamera(U),U=St.getCamera()),S.isScene===!0&&S.onBeforeRender(C,S,U,Q),b=lt.get(S,v.length),b.init(U),b.state.textureUnits=q.getTextureUnits(),v.push(b),Se.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ie.setFromProjectionMatrix(Se,Sn,U.reversedDepth),Yt=this.localClippingEnabled,Qt=Rt.init(this.clippingPlanes,Yt),w=ut.get(S,R.length),w.init(),R.push(w),St.enabled===!0&&St.isPresenting===!0){const vt=C.xr.getDepthSensingMesh();vt!==null&&Dr(vt,U,-1/0,C.sortObjects)}Dr(S,U,0,C.sortObjects),w.finish(),C.sortObjects===!0&&w.sort(It,Ft,U.reversedDepth),ge=St.enabled===!1||St.isPresenting===!1||St.hasDepthSensing()===!1,ge&&Ot.addToRenderList(w,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Qt===!0&&Rt.beginShadows();const H=b.state.shadowsArray;if(Pt.render(H,S,U),Qt===!0&&Rt.endShadows(),(B&&E.hasRenderPass())===!1){const vt=w.opaque,dt=w.transmissive;if(b.setupLights(),U.isArrayCamera){const bt=U.cameras;if(dt.length>0)for(let wt=0,kt=bt.length;wt<kt;wt++){const zt=bt[wt];cl(vt,dt,S,zt)}ge&&Ot.render(S);for(let wt=0,kt=bt.length;wt<kt;wt++){const zt=bt[wt];ll(w,S,zt,zt.viewport)}}else dt.length>0&&cl(vt,dt,S,U),ge&&Ot.render(S),ll(w,S,U)}Q!==null&&G===0&&(q.updateMultisampleRenderTarget(Q),q.updateRenderTargetMipmap(Q)),B&&E.end(C),S.isScene===!0&&S.onAfterRender(C,S,U),mt.resetDefaultState(),tt=-1,at=null,v.pop(),v.length>0?(b=v[v.length-1],q.setTextureUnits(b.state.textureUnits),Qt===!0&&Rt.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?w=R[R.length-1]:w=null,N!==null&&N.renderEnd()};function Dr(S,U,V,B){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)V=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLightProbeGrid)b.pushLightProbeGrid(S);else if(S.isLight)b.pushLight(S),S.castShadow&&b.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ie.intersectsSprite(S)){B&&Ce.setFromMatrixPosition(S.matrixWorld).applyMatrix4(Se);const vt=Z.update(S),dt=S.material;dt.visible&&w.push(S,vt,dt,V,Ce.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ie.intersectsObject(S))){const vt=Z.update(S),dt=S.material;if(B&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ce.copy(S.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),Ce.copy(vt.boundingSphere.center)),Ce.applyMatrix4(S.matrixWorld).applyMatrix4(Se)),Array.isArray(dt)){const bt=vt.groups;for(let wt=0,kt=bt.length;wt<kt;wt++){const zt=bt[wt],At=dt[zt.materialIndex];At&&At.visible&&w.push(S,vt,At,V,Ce.z,zt)}}else dt.visible&&w.push(S,vt,dt,V,Ce.z,null)}}const pt=S.children;for(let vt=0,dt=pt.length;vt<dt;vt++)Dr(pt[vt],U,V,B)}function ll(S,U,V,B){const{opaque:H,transmissive:pt,transparent:vt}=S;b.setupLightsView(V),Qt===!0&&Rt.setGlobalState(C.clippingPlanes,V),B&&x.viewport(gt.copy(B)),H.length>0&&Ds(H,U,V),pt.length>0&&Ds(pt,U,V),vt.length>0&&Ds(vt,U,V),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function cl(S,U,V,B){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[B.id]===void 0){const At=te.has("EXT_color_buffer_half_float")||te.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[B.id]=new Tn(1,1,{generateMipmaps:!0,type:At?Hn:Je,minFilter:vi,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Wt.workingColorSpace})}const pt=b.state.transmissionRenderTarget[B.id],vt=B.viewport||gt;pt.setSize(vt.z*C.transmissionResolutionScale,vt.w*C.transmissionResolutionScale);const dt=C.getRenderTarget(),bt=C.getActiveCubeFace(),wt=C.getActiveMipmapLevel();C.setRenderTarget(pt),C.getClearColor(me),Jt=C.getClearAlpha(),Jt<1&&C.setClearColor(16777215,.5),C.clear(),ge&&Ot.render(V);const kt=C.toneMapping;C.toneMapping=bn;const zt=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),b.setupLightsView(B),Qt===!0&&Rt.setGlobalState(C.clippingPlanes,B),Ds(S,V,B),q.updateMultisampleRenderTarget(pt),q.updateRenderTargetMipmap(pt),te.has("WEBGL_multisampled_render_to_texture")===!1){let At=!1;for(let ne=0,ye=U.length;ne<ye;ne++){const _e=U[ne],{object:se,geometry:Ue,material:_t,group:Ye}=_e;if(_t.side===Un&&se.layers.test(B.layers)){const $t=_t.side;_t.side=qe,_t.needsUpdate=!0,hl(se,V,B,Ue,_t,Ye),_t.side=$t,_t.needsUpdate=!0,At=!0}}At===!0&&(q.updateMultisampleRenderTarget(pt),q.updateRenderTargetMipmap(pt))}C.setRenderTarget(dt,bt,wt),C.setClearColor(me,Jt),zt!==void 0&&(B.viewport=zt),C.toneMapping=kt}function Ds(S,U,V){const B=U.isScene===!0?U.overrideMaterial:null;for(let H=0,pt=S.length;H<pt;H++){const vt=S[H],{object:dt,geometry:bt,group:wt}=vt;let kt=vt.material;kt.allowOverride===!0&&B!==null&&(kt=B),dt.layers.test(V.layers)&&hl(dt,U,V,bt,kt,wt)}}function hl(S,U,V,B,H,pt){S.onBeforeRender(C,U,V,B,H,pt),S.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),H.onBeforeRender(C,U,V,B,S,pt),H.transparent===!0&&H.side===Un&&H.forceSinglePass===!1?(H.side=qe,H.needsUpdate=!0,C.renderBufferDirect(V,U,B,H,S,pt),H.side=ii,H.needsUpdate=!0,C.renderBufferDirect(V,U,B,H,S,pt),H.side=Un):C.renderBufferDirect(V,U,B,H,S,pt),S.onAfterRender(C,U,V,B,H,pt)}function Us(S,U,V){U.isScene!==!0&&(U=Le);const B=z.get(S),H=b.state.lights,pt=b.state.shadowsArray,vt=H.state.version,dt=ot.getParameters(S,H.state,pt,U,V,b.state.lightProbeGridArray),bt=ot.getProgramCacheKey(dt);let wt=B.programs;B.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,B.fog=U.fog;const kt=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;B.envMap=nt.get(S.envMap||B.environment,kt),B.envMapRotation=B.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,wt===void 0&&(S.addEventListener("dispose",pn),wt=new Map,B.programs=wt);let zt=wt.get(bt);if(zt!==void 0){if(B.currentProgram===zt&&B.lightsStateVersion===vt)return fl(S,dt),zt}else dt.uniforms=ot.getUniforms(S),N!==null&&S.isNodeMaterial&&N.build(S,V,dt),S.onBeforeCompile(dt,C),zt=ot.acquireProgram(dt,bt),wt.set(bt,zt),B.uniforms=dt.uniforms;const At=B.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(At.clippingPlanes=Rt.uniform),fl(S,dt),B.needsLights=uu(S),B.lightsStateVersion=vt,B.needsLights&&(At.ambientLightColor.value=H.state.ambient,At.lightProbe.value=H.state.probe,At.directionalLights.value=H.state.directional,At.directionalLightShadows.value=H.state.directionalShadow,At.spotLights.value=H.state.spot,At.spotLightShadows.value=H.state.spotShadow,At.rectAreaLights.value=H.state.rectArea,At.ltc_1.value=H.state.rectAreaLTC1,At.ltc_2.value=H.state.rectAreaLTC2,At.pointLights.value=H.state.point,At.pointLightShadows.value=H.state.pointShadow,At.hemisphereLights.value=H.state.hemi,At.directionalShadowMatrix.value=H.state.directionalShadowMatrix,At.spotLightMatrix.value=H.state.spotLightMatrix,At.spotLightMap.value=H.state.spotLightMap,At.pointShadowMatrix.value=H.state.pointShadowMatrix),B.lightProbeGrid=b.state.lightProbeGridArray.length>0,B.currentProgram=zt,B.uniformsList=null,zt}function ul(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=mr.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function fl(S,U){const V=z.get(S);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function lu(S,U){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let V=0,B=S.length;V<B;V++){const H=S[V];if(H.texture!==null&&H.boundingBox.containsPoint(y))return H}return null}function cu(S,U,V,B,H){U.isScene!==!0&&(U=Le),q.resetTextureUnits();const pt=U.fog,vt=B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial?U.environment:null,dt=Q===null?C.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Wt.workingColorSpace,bt=B.isMeshStandardMaterial||B.isMeshLambertMaterial&&!B.envMap||B.isMeshPhongMaterial&&!B.envMap,wt=nt.get(B.envMap||vt,bt),kt=B.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,zt=!!V.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),At=!!V.morphAttributes.position,ne=!!V.morphAttributes.normal,ye=!!V.morphAttributes.color;let _e=bn;B.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(_e=C.toneMapping);const se=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Ue=se!==void 0?se.length:0,_t=z.get(B),Ye=b.state.lights;if(Qt===!0&&(Yt===!0||S!==at)){const ce=S===at&&B.id===tt;Rt.setState(B,S,ce)}let $t=!1;B.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==Ye.state.version||_t.outputColorSpace!==dt||H.isBatchedMesh&&_t.batching===!1||!H.isBatchedMesh&&_t.batching===!0||H.isBatchedMesh&&_t.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&_t.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&_t.instancing===!1||!H.isInstancedMesh&&_t.instancing===!0||H.isSkinnedMesh&&_t.skinning===!1||!H.isSkinnedMesh&&_t.skinning===!0||H.isInstancedMesh&&_t.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&_t.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&_t.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&_t.instancingMorph===!1&&H.morphTexture!==null||_t.envMap!==wt||B.fog===!0&&_t.fog!==pt||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==Rt.numPlanes||_t.numIntersection!==Rt.numIntersection)||_t.vertexAlphas!==kt||_t.vertexTangents!==zt||_t.morphTargets!==At||_t.morphNormals!==ne||_t.morphColors!==ye||_t.toneMapping!==_e||_t.morphTargetsCount!==Ue||!!_t.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&($t=!0):($t=!0,_t.__version=B.version);let je=_t.currentProgram;$t===!0&&(je=Us(B,U,H),N&&B.isNodeMaterial&&N.onUpdateProgram(B,je,_t));let mn=!1,Vn=!1,Ai=!1;const re=je.getUniforms(),Me=_t.uniforms;if(x.useProgram(je.program)&&(mn=!0,Vn=!0,Ai=!0),B.id!==tt&&(tt=B.id,Vn=!0),_t.needsLights){const ce=lu(b.state.lightProbeGridArray,H);_t.lightProbeGrid!==ce&&(_t.lightProbeGrid=ce,Vn=!0)}if(mn||at!==S){x.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),re.setValue(D,"projectionMatrix",S.projectionMatrix),re.setValue(D,"viewMatrix",S.matrixWorldInverse);const Xn=re.map.cameraPosition;Xn!==void 0&&Xn.setValue(D,we.setFromMatrixPosition(S.matrixWorld)),A.logarithmicDepthBuffer&&re.setValue(D,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&re.setValue(D,"isOrthographic",S.isOrthographicCamera===!0),at!==S&&(at=S,Vn=!0,Ai=!0)}if(_t.needsLights&&(Ye.state.directionalShadowMap.length>0&&re.setValue(D,"directionalShadowMap",Ye.state.directionalShadowMap,q),Ye.state.spotShadowMap.length>0&&re.setValue(D,"spotShadowMap",Ye.state.spotShadowMap,q),Ye.state.pointShadowMap.length>0&&re.setValue(D,"pointShadowMap",Ye.state.pointShadowMap,q)),H.isSkinnedMesh){re.setOptional(D,H,"bindMatrix"),re.setOptional(D,H,"bindMatrixInverse");const ce=H.skeleton;ce&&(ce.boneTexture===null&&ce.computeBoneTexture(),re.setValue(D,"boneTexture",ce.boneTexture,q))}H.isBatchedMesh&&(re.setOptional(D,H,"batchingTexture"),re.setValue(D,"batchingTexture",H._matricesTexture,q),re.setOptional(D,H,"batchingIdTexture"),re.setValue(D,"batchingIdTexture",H._indirectTexture,q),re.setOptional(D,H,"batchingColorTexture"),H._colorsTexture!==null&&re.setValue(D,"batchingColorTexture",H._colorsTexture,q));const Wn=V.morphAttributes;if((Wn.position!==void 0||Wn.normal!==void 0||Wn.color!==void 0)&&L.update(H,V,je),(Vn||_t.receiveShadow!==H.receiveShadow)&&(_t.receiveShadow=H.receiveShadow,re.setValue(D,"receiveShadow",H.receiveShadow)),(B.isMeshStandardMaterial||B.isMeshLambertMaterial||B.isMeshPhongMaterial)&&B.envMap===null&&U.environment!==null&&(Me.envMapIntensity.value=U.environmentIntensity),Me.dfgLUT!==void 0&&(Me.dfgLUT.value=Dx()),Vn){if(re.setValue(D,"toneMappingExposure",C.toneMappingExposure),_t.needsLights&&hu(Me,Ai),pt&&B.fog===!0&&Et.refreshFogUniforms(Me,pt),Et.refreshMaterialUniforms(Me,B,et,st,b.state.transmissionRenderTarget[S.id]),_t.needsLights&&_t.lightProbeGrid){const ce=_t.lightProbeGrid;Me.probesSH.value=ce.texture,Me.probesMin.value.copy(ce.boundingBox.min),Me.probesMax.value.copy(ce.boundingBox.max),Me.probesResolution.value.copy(ce.resolution)}mr.upload(D,ul(_t),Me,q)}if(B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(mr.upload(D,ul(_t),Me,q),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&re.setValue(D,"center",H.center),re.setValue(D,"modelViewMatrix",H.modelViewMatrix),re.setValue(D,"normalMatrix",H.normalMatrix),re.setValue(D,"modelMatrix",H.matrixWorld),B.uniformsGroups!==void 0){const ce=B.uniformsGroups;for(let Xn=0,Ri=ce.length;Xn<Ri;Xn++){const dl=ce[Xn];j.update(dl,je),j.bind(dl,je)}}return je}function hu(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function uu(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return $},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(S,U,V){const B=z.get(S);B.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,B.__autoAllocateDepthBuffer===!1&&(B.__useRenderToTexture=!1),z.get(S.texture).__webglTexture=U,z.get(S.depthTexture).__webglTexture=B.__autoAllocateDepthBuffer?void 0:V,B.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const V=z.get(S);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,V=0){Q=S,$=U,G=V;let B=null,H=!1,pt=!1;if(S){const dt=z.get(S);if(dt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(D.FRAMEBUFFER,dt.__webglFramebuffer),gt.copy(S.viewport),yt.copy(S.scissor),Zt=S.scissorTest,x.viewport(gt),x.scissor(yt),x.setScissorTest(Zt),tt=-1;return}else if(dt.__webglFramebuffer===void 0)q.setupRenderTarget(S);else if(dt.__hasExternalTextures)q.rebindTextures(S,z.get(S.texture).__webglTexture,z.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const kt=S.depthTexture;if(dt.__boundDepthTexture!==kt){if(kt!==null&&z.has(kt)&&(S.width!==kt.image.width||S.height!==kt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(S)}}const bt=S.texture;(bt.isData3DTexture||bt.isDataArrayTexture||bt.isCompressedArrayTexture)&&(pt=!0);const wt=z.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(wt[U])?B=wt[U][V]:B=wt[U],H=!0):S.samples>0&&q.useMultisampledRTT(S)===!1?B=z.get(S).__webglMultisampledFramebuffer:Array.isArray(wt)?B=wt[V]:B=wt,gt.copy(S.viewport),yt.copy(S.scissor),Zt=S.scissorTest}else gt.copy(Ct).multiplyScalar(et).floor(),yt.copy(ve).multiplyScalar(et).floor(),Zt=Vt;if(V!==0&&(B=W),x.bindFramebuffer(D.FRAMEBUFFER,B)&&x.drawBuffers(S,B),x.viewport(gt),x.scissor(yt),x.setScissorTest(Zt),H){const dt=z.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,dt.__webglTexture,V)}else if(pt){const dt=U;for(let bt=0;bt<S.textures.length;bt++){const wt=z.get(S.textures[bt]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+bt,wt.__webglTexture,V,dt)}}else if(S!==null&&V!==0){const dt=z.get(S.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,dt.__webglTexture,V)}tt=-1},this.readRenderTargetPixels=function(S,U,V,B,H,pt,vt,dt=0){if(!(S&&S.isWebGLRenderTarget)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let bt=z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&vt!==void 0&&(bt=bt[vt]),bt){x.bindFramebuffer(D.FRAMEBUFFER,bt);try{const wt=S.textures[dt],kt=wt.format,zt=wt.type;if(S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+dt),!A.textureFormatReadable(kt)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!A.textureTypeReadable(zt)){Kt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-B&&V>=0&&V<=S.height-H&&D.readPixels(U,V,B,H,ct.convert(kt),ct.convert(zt),pt)}finally{const wt=Q!==null?z.get(Q).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(S,U,V,B,H,pt,vt,dt=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let bt=z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&vt!==void 0&&(bt=bt[vt]),bt)if(U>=0&&U<=S.width-B&&V>=0&&V<=S.height-H){x.bindFramebuffer(D.FRAMEBUFFER,bt);const wt=S.textures[dt],kt=wt.format,zt=wt.type;if(S.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+dt),!A.textureFormatReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!A.textureTypeReadable(zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const At=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,At),D.bufferData(D.PIXEL_PACK_BUFFER,pt.byteLength,D.STREAM_READ),D.readPixels(U,V,B,H,ct.convert(kt),ct.convert(zt),0);const ne=Q!==null?z.get(Q).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,ne);const ye=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Mf(D,ye,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,At),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,pt),D.deleteBuffer(At),D.deleteSync(ye),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,V=0){const B=Math.pow(2,-V),H=Math.floor(S.image.width*B),pt=Math.floor(S.image.height*B),vt=U!==null?U.x:0,dt=U!==null?U.y:0;q.setTexture2D(S,0),D.copyTexSubImage2D(D.TEXTURE_2D,V,0,0,vt,dt,H,pt),x.unbindTexture()},this.copyTextureToTexture=function(S,U,V=null,B=null,H=0,pt=0){let vt,dt,bt,wt,kt,zt,At,ne,ye;const _e=S.isCompressedTexture?S.mipmaps[pt]:S.image;if(V!==null)vt=V.max.x-V.min.x,dt=V.max.y-V.min.y,bt=V.isBox3?V.max.z-V.min.z:1,wt=V.min.x,kt=V.min.y,zt=V.isBox3?V.min.z:0;else{const Me=Math.pow(2,-H);vt=Math.floor(_e.width*Me),dt=Math.floor(_e.height*Me),S.isDataArrayTexture?bt=_e.depth:S.isData3DTexture?bt=Math.floor(_e.depth*Me):bt=1,wt=0,kt=0,zt=0}B!==null?(At=B.x,ne=B.y,ye=B.z):(At=0,ne=0,ye=0);const se=ct.convert(U.format),Ue=ct.convert(U.type);let _t;U.isData3DTexture?(q.setTexture3D(U,0),_t=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(q.setTexture2DArray(U,0),_t=D.TEXTURE_2D_ARRAY):(q.setTexture2D(U,0),_t=D.TEXTURE_2D),x.activeTexture(D.TEXTURE0),x.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),x.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),x.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const Ye=x.getParameter(D.UNPACK_ROW_LENGTH),$t=x.getParameter(D.UNPACK_IMAGE_HEIGHT),je=x.getParameter(D.UNPACK_SKIP_PIXELS),mn=x.getParameter(D.UNPACK_SKIP_ROWS),Vn=x.getParameter(D.UNPACK_SKIP_IMAGES);x.pixelStorei(D.UNPACK_ROW_LENGTH,_e.width),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,_e.height),x.pixelStorei(D.UNPACK_SKIP_PIXELS,wt),x.pixelStorei(D.UNPACK_SKIP_ROWS,kt),x.pixelStorei(D.UNPACK_SKIP_IMAGES,zt);const Ai=S.isDataArrayTexture||S.isData3DTexture,re=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const Me=z.get(S),Wn=z.get(U),ce=z.get(Me.__renderTarget),Xn=z.get(Wn.__renderTarget);x.bindFramebuffer(D.READ_FRAMEBUFFER,ce.__webglFramebuffer),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,Xn.__webglFramebuffer);for(let Ri=0;Ri<bt;Ri++)Ai&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,z.get(S).__webglTexture,H,zt+Ri),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,z.get(U).__webglTexture,pt,ye+Ri)),D.blitFramebuffer(wt,kt,vt,dt,At,ne,vt,dt,D.DEPTH_BUFFER_BIT,D.NEAREST);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(H!==0||S.isRenderTargetTexture||z.has(S)){const Me=z.get(S),Wn=z.get(U);x.bindFramebuffer(D.READ_FRAMEBUFFER,X),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,O);for(let ce=0;ce<bt;ce++)Ai?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Me.__webglTexture,H,zt+ce):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Me.__webglTexture,H),re?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Wn.__webglTexture,pt,ye+ce):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Wn.__webglTexture,pt),H!==0?D.blitFramebuffer(wt,kt,vt,dt,At,ne,vt,dt,D.COLOR_BUFFER_BIT,D.NEAREST):re?D.copyTexSubImage3D(_t,pt,At,ne,ye+ce,wt,kt,vt,dt):D.copyTexSubImage2D(_t,pt,At,ne,wt,kt,vt,dt);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else re?S.isDataTexture||S.isData3DTexture?D.texSubImage3D(_t,pt,At,ne,ye,vt,dt,bt,se,Ue,_e.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(_t,pt,At,ne,ye,vt,dt,bt,se,_e.data):D.texSubImage3D(_t,pt,At,ne,ye,vt,dt,bt,se,Ue,_e):S.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,pt,At,ne,vt,dt,se,Ue,_e.data):S.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,pt,At,ne,_e.width,_e.height,se,_e.data):D.texSubImage2D(D.TEXTURE_2D,pt,At,ne,vt,dt,se,Ue,_e);x.pixelStorei(D.UNPACK_ROW_LENGTH,Ye),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,$t),x.pixelStorei(D.UNPACK_SKIP_PIXELS,je),x.pixelStorei(D.UNPACK_SKIP_ROWS,mn),x.pixelStorei(D.UNPACK_SKIP_IMAGES,Vn),pt===0&&U.generateMipmaps&&D.generateMipmap(_t),x.unbindTexture()},this.initRenderTarget=function(S){z.get(S).__webglFramebuffer===void 0&&q.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?q.setTextureCube(S,0):S.isData3DTexture?q.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?q.setTexture2DArray(S,0):q.setTexture2D(S,0),x.unbindTexture()},this.resetState=function(){$=0,G=0,Q=null,x.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=Wt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Wt._getUnpackColorSpace()}}function Nx(i,t=!1){const e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Be;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let u=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(e){let h=0;const f=[];for(let u=0;u<i.length;++u){const d=i[u].index;for(let p=0;p<d.count;++p)f.push(d.getX(p)+h);h+=i[u].attributes.position.count}l.setIndex(f)}for(const h in r){const f=Cc(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){const d=[];for(let _=0;_<a[h].length;++_)d.push(a[h][_][u]);const p=Cc(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function Cc(i){let t,e,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(t===void 0&&(t=h.array.constructor),t!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=h.itemSize),e!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*e}const a=new t(r),o=new fn(a,e,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/e;for(let u=0,d=h.count;u<d;u++)for(let p=0;p<e;p++){const _=h.getComponent(u,p);o.setComponent(u+f,p,_)}}else a.set(h.array,l);l+=h.count*e}return s!==void 0&&(o.gpuType=s),o}function He(i,t=.75,e=0){return new Nh({color:i,roughness:t,metalness:e,flatShading:!1})}function Fx(){return{skin:He(13014134,.82),shadow:He(10317141,.88),hair:He(2108488,.68),uniform:He(2182520,.76),uniformLight:He(3235723,.68),uniformDeep:He(1322832,.84),pants:He(1581622,.84),accent:He(14728524,.58),belt:He(1514280,.9),boot:He(1120034,.9),glove:He(1119773,.88),glovePad:He(2436405,.78),eyeWhite:He(16250093,.62),eyeBlue:He(3906516,.5),eyeDark:He(1054765,.7)}}function Ut(i,t,e,n,s){t.position.set(e,n,s),i.add(t)}function nn(i,t,e=32){return new Dt(new Ar(t.map(([n,s])=>new ht(n,s)),e),i)}function Ox(i){const t=nn(i,[[.055,-.08],[.11,-.075],[.14,-.02],[.145,.07],[.12,.12],[.04,.14]],32);return t.scale.set(1,.62,1.45),t}function kx(i,t,e){const n=new Dt(new Xe(1,24,16),t.skin);n.scale.set(.135,.155,.105),Ut(i,n,0,-.52,.015);const s=new Dt(new ke(.105,.045,6,18),t.glove);s.scale.z=.82,Ut(i,s,0,-.39,.02);const r=new Dt(new ke(.102,.035,5,16),t.glovePad);r.scale.set(1,1,.78),Ut(i,r,0,-.405,.085);const a=new Dt(new Xe(1,24,16),t.glove);a.scale.set(.12,.112,.095),Ut(i,a,0,-.495,.085);const o=new Dt(new Xe(1,20,14),t.glovePad);o.scale.set(.078,.045,.018),Ut(i,o,0,-.46,.178);const l=[[-.09,.125,.037],[-.03,.145,.04],[.03,.14,.04],[.09,.115,.037]];for(const[h,f,u]of l){const d=new Dt(new ke(u,f,6,14),t.skin);Ut(i,d,h,-.635-(.14-f)*.18,.025)}const c=new Dt(new ke(.041,.115,6,14),t.skin);c.rotation.z=-e*.72,Ut(i,c,e*.145,-.575,.035)}function Bx(){const i=new Xe(1,32,18);return i.scale(.36,.13,.12),i.translate(0,.29,.39),i.computeVertexNormals(),i.toNonIndexed()}function Pc(i){const t=new ke(.105,.46,7,18);return t.applyMatrix4(new ae().makeRotationZ(i*.045)),t.applyMatrix4(new ae().makeTranslation(i*.35,-.03,.36)),t.computeVertexNormals(),t.toNonIndexed()}function Hx(){const i=new Ar([new ht(.22,-.43),new ht(.31,-.39),new ht(.39,-.28),new ht(.43,-.1),new ht(.44,.13),new ht(.41,.31),new ht(.34,.42),new ht(.22,.47),new ht(0,.48)],40);i.applyMatrix4(new ae().makeScale(1.05,1,.84)),i.applyMatrix4(new ae().makeTranslation(0,0,-.075)),i.computeVertexNormals();const t=Nx([i.toNonIndexed(),Bx(),Pc(-1),Pc(1)],!1);if(!t)throw new Error("Mara hair geometry merge failed");return t.computeVertexNormals(),t}function Lc(i,t,e){const n=new Dt(new Xe(1,24,16),t.shadow);n.scale.set(.132,.118,.045),Ut(i,n,e,.022,.335);const s=new Dt(new Xe(1,28,18),t.eyeWhite);s.scale.set(.101,.112,.046),Ut(i,s,e,.018,.367);const r=new Dt(new Xe(1,24,16),t.eyeBlue);r.scale.set(.068,.079,.038),Ut(i,r,e,.012,.414);const a=new Dt(new Xe(1,20,14),t.eyeDark);a.scale.set(.035,.052,.031),Ut(i,a,e,.008,.451);const o=new Dt(new Xe(1,14,10),t.eyeWhite);o.scale.set(.017,.02,.014),Ut(i,o,e-.022,.044,.481);const l=new Dt(new ke(.012,.13,4,12),t.eyeDark);l.rotation.z=Math.PI/2,Ut(i,l,e,.087,.443);const c=new Dt(new ke(.013,.105,4,12),t.hair);c.rotation.z=Math.PI/2+(e<0?-.18:.18),Ut(i,c,e,.151,.397)}function zx(i,t){Lc(i,t,-.125),Lc(i,t,.125);const e=nn(t.shadow,[[.018,-.025],[.028,0],[.016,.028],[0,.04]],16);e.scale.set(1,1,.5),Ut(i,e,0,-.055,.356);const n=new Dt(new Qo(.065,.009,6,18,Math.PI),t.shadow);n.rotation.set(Math.PI/2,0,Math.PI),Ut(i,n,0,-.15,.346)}function Gx(i,t){const e=new Dt(new Si(.102,.102,.018,28),t.belt);e.rotation.x=Math.PI/2,Ut(i,e,.13,.39,.292);const n=new Dt(new Si(.086,.086,.022,28),t.accent);n.rotation.x=Math.PI/2,Ut(i,n,.13,.39,.309);const s=new Dt(new Si(.038,.038,.026,5),t.belt);s.rotation.set(Math.PI/2,0,Math.PI/4),Ut(i,s,.13,.39,.325)}function Xi(i,t,e,n,s,r=.13){const a=new Dt(new ke(.018,r,6,12),t);a.scale.z=.62,a.rotation.z=s,Ut(i,a,e,n,.292)}function Vx(i,t){const e=new Ch;return e.moveTo(0,.06),e.lineTo(t*.135,.085),e.lineTo(t*.045,-.055),e.lineTo(0,-.015),e.closePath(),new Dt(new Jo(e),i)}function Ic(i){return nn(i,[[.045,-.065],[.068,-.052],[.078,-.025],[.078,.038],[.062,.064],[.038,.068]],20)}function Wx(i,t){const e=new Dt(new ke(.052,.068,5,12),t.belt);e.scale.z=.16,Ut(i,e,0,-.105,.108);const n=new Dt(new Gn(.052,.012,.012),t.accent);Ut(i,n,0,-.105,.124)}function Xx(i){let t=0;return i.traverse(e=>{if(!e.isMesh)return;const n=e.geometry;t+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}),Math.round(t)}function qx(){const i=Fx(),t=new Xt,e=new Xt,n=new Xt,s=new Xt,r=new Xt,a=new Xt,o=new Xt,l=new Xt,c=new Xt;t.add(e),e.position.y=.64;for(const[m,g]of[[o,-.14],[l,.14]])m.position.x=g,Ut(m,nn(i.pants,[[.075,-.51],[.105,-.46],[.115,-.22],[.13,-.04],[.09,.02]],32),0,0,0),Ut(m,Ox(i.boot),0,-.57,.075),e.add(m);Ut(e,nn(i.pants,[[.2,-.1],[.275,-.04],[.28,.04],[.235,.12]],36),0,-.01,0),e.add(n),n.position.y=.03,Ut(n,nn(i.uniform,[[.18,.02],[.265,.1],[.3,.28],[.285,.48],[.23,.61],[.12,.65]],40),0,.04,0);for(const m of[-1,1]){const g=new Dt(new Xe(1,20,14),i.uniformLight);g.scale.set(.13,.105,.13),Ut(n,g,m*.255,.48,.015);const M=new Dt(new ke(.022,.13,6,12),i.uniformDeep);M.scale.z=.55,M.rotation.z=-m*.36,Ut(n,M,m*.225,.37,.286)}Xi(n,i.uniformDeep,-.205,.42,-.52,.14),Xi(n,i.uniformLight,-.19,.39,-.52,.1),Xi(n,i.uniformDeep,.205,.42,.52,.14),Xi(n,i.uniformLight,.19,.39,.52,.1),Xi(n,i.uniformDeep,-.14,.19,.2,.13),Xi(n,i.uniformDeep,.14,.19,-.2,.13),Ut(n,nn(i.belt,[[.255,0],[.285,.035],[.278,.085],[.25,.11]],36),0,0,0);const h=new Dt(new Gn(.12,.1,.035,3,3,2),i.accent);Ut(n,h,0,.065,.285);for(const m of[-1,1]){const g=Ic(i.belt);Ut(n,g,m*.205,.068,.292);const M=new Dt(new ke(.045,.055,5,12),i.glovePad);M.scale.set(1.15,.34,.16),Ut(n,M,m*.205,.105,.365);const T=new Dt(new Xe(.012,12,8),i.accent);Ut(n,T,m*.205,.105,.383)}const f=Ic(i.belt);f.scale.set(.72,1.12,.82),Ut(n,f,.3,.105,.12);const u=new Dt(new Gn(.065,.018,.018),i.accent);Ut(n,u,.3,.168,.18),Gx(n,i);for(const m of[-1,1]){const g=Vx(i.uniformLight,m);Ut(n,g,0,.575,.301)}const d=new Dt(new ke(.047,.035,5,12),i.belt);d.scale.z=.34,Ut(n,d,0,.515,.318);const p=new Dt(new ke(.038,.205,5,12),i.belt);p.scale.z=.3,Ut(n,p,0,.395,.315);for(const[m,g]of[[r,-.375],[a,.375]])m.position.set(g,.43,0),Ut(m,nn(i.uniform,[[.075,-.18],[.105,-.12],[.11,.03],[.085,.12]],32),0,-.1,0),Wx(m,i),Ut(m,nn(i.skin,[[.055,-.43],[.082,-.36],[.085,-.23],[.068,-.16]],32),0,-.1,0),kx(m,i,g<0?-1:1),n.add(m);a.add(c),c.position.set(0,-.43,.13),Ut(c,nn(i.belt,[[.035,-.32],[.05,-.25],[.052,.24],[.035,.32]],20),0,-.17,0),Ut(c,nn(i.accent,[[.055,-.06],[.065,0],[.055,.06]],20),0,.13,0),n.add(s),s.position.y=.76,Ut(s,nn(i.skin,[[.16,-.3],[.29,-.24],[.35,-.1],[.37,.08],[.36,.25],[.29,.36],[.16,.4]],40),0,0,0),Ut(s,new Dt(Hx(),i.hair),0,0,0),zx(s,i);const _=new Xt;return _.add(t),t.position.y=.08,{root:_,hip:e,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:Xx(_)}}const Ta=2.15,gr=420,xr=520;function qh(i,t){const e=t==="f";switch(i){case"mara":return{skin:13014134,shadow:10317141,hair:2108488,shirt:2182520,pants:1581622,accent:14728524,metal:12568788,shoe:1514280};case"dana":return{skin:11697242,shadow:9393983,hair:5978408,shirt:2970216,pants:2108218,accent:14268750,metal:12628893,shoe:1645349};case"priya":return{skin:9854784,shadow:7356719,hair:1905424,shirt:15328728,pants:2643038,accent:13192016,metal:14212322,shoe:2105386};case"hale":return{skin:13806212,shadow:10976349,hair:7628371,shirt:4278102,pants:2698552,accent:16762967,metal:12037788,shoe:1579554};case"crosby":return{skin:12358768,shadow:9396557,hair:3155231,shirt:6565176,pants:3283750,accent:15777874,metal:13741397,shoe:1512221};case"beckett":return{skin:11568226,shadow:8868157,hair:4072735,shirt:10105916,pants:3152932,accent:16747590,metal:13154454,shoe:1512731};case"delinquent":return{skin:e?13014648:11832428,shadow:9133388,hair:e?5582445:2103848,shirt:5203020,pants:2698806,accent:12668775,metal:11053750,shoe:1514016};case"magician":return{skin:e?13478026:12226158,shadow:9791055,hair:e?7614880:2626870,shirt:7354535,pants:2497094,accent:15056213,metal:14731384,shoe:1511718};case"wolverine":return{skin:7887430,shadow:5783599,hair:4928808,shirt:7755838,pants:5257772,accent:14711356,metal:13156526,shoe:2103572};case"boxer":return{skin:11171928,shadow:8212541,hair:1774872,shirt:15263980,pants:2434610,accent:14237772,metal:12369608,shoe:1513504};case"gunner":return{skin:e?13147776:11700328,shadow:9134926,hair:e?3548702:2170146,shirt:3229240,pants:2634542,accent:6667384,metal:8689035,shoe:1448986};case"worker":return{skin:12490358,shadow:9200463,hair:3156002,shirt:15772214,pants:3490909,accent:3698345,metal:11449533,shoe:1777705};default:return{skin:13148802,shadow:9859418,hair:2696750,shirt:15789286,pants:2370624,accent:5404848,metal:12235163,shoe:1513763}}}function _n(i,t=.75,e=0){return new Nh({color:i,roughness:t,metalness:e,flatShading:!1})}function Yh(i){return{skin:_n(i.skin,.82),shadow:_n(i.shadow,.88),hair:_n(i.hair,.7),shirt:_n(i.shirt),pants:_n(i.pants,.84),accent:_n(i.accent,.58),metal:_n(i.metal,.28,.45),shoe:_n(i.shoe,.9),white:_n(16250093,.62),dark:_n(1446683,.82)}}function Yx(i){return i==="attack"?gr:i==="cast"?xr:0}function $x(i,t){const e=Yx(i.anim);if(e>0){const s=((typeof performance<"u"?performance.now():t)-i.animStart)/e;if(s<1)return{clip:i.anim,t:Math.max(0,s)}}return i.anim==="walk"?{clip:"walk",t:t/280%1}:{clip:"idle",t:t/900%1}}function Kx(i,t,e){const n=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}][e];return{x:-n.y*i+n.x*t,y:n.x*i+n.y*t}}function Dc(i,t,e){return Kx(i,t,e)}function $h(i){return 58*i}function Mt(i,t,e,n,s){t.position.set(e,n,s),i.add(t)}function he(i,t,e,n=12,s=4){return new Dt(new ke(t,e,s,n),i)}function pe(i,t,e=16,n=12){return new Dt(new Xe(t,e,n),i)}function hn(i,t,e,n){return new Dt(new Gn(t,e,n,2,2,2),i)}function jo(i,t,e){return new Dt(new $o(t,e,20,5),i)}function Tr(i,t,e,n,s){Mt(i,pe(t.white,.075,10,8),e,n,s),Mt(i,pe(t.dark,.043,8,6),e,n,s+.06)}function Zx(i,t,e,n,s){if(Tr(i,t,-s*.32,.03,s*.89),Tr(i,t,s*.32,.03,s*.89),Mt(i,pe(t.shadow,.035,8,6),0,-.075,s*.94),Mt(i,hn(t.dark,n==="f"?.13:.16,.025,.02),0,-.16,s*.91),n==="f"&&(Mt(i,pe(t.accent,.035,8,6),-s*.56,-.11,s*.85),Mt(i,pe(t.accent,.035,8,6),s*.56,-.11,s*.85)),e==="hale"){const r=pe(t.hair,s*.48,12,8);r.scale.set(1,.55,.62),Mt(i,r,0,-s*.35,s*.63)}}function Jx(i,t,e,n){const s=pe(t.hair,n*1.07,28,20);if(s.scale.set(1.08,1.02,.91),Mt(i,s,0,n*.18,-n*.11),e==="f"){for(const a of[-1,1]){const o=he(t.hair,n*.105,n*.58,14,5);o.rotation.z=a*.08,Mt(i,o,a*n*.82,-n*.13,n*.27)}const r=he(t.hair,n*.13,n*.62,14,5);r.rotation.z=Math.PI/2,Mt(i,r,0,n*.41,n*.66)}}function Qx(i,t,e){const n=pe(t.hair,e*1.08,32,24);n.scale.set(1.22,1.42,1),Mt(i,n,0,-e*.1,-e*.1);const s=he(t.hair,e*.16,e*1.18,20,6);s.rotation.z=Math.PI/2,Mt(i,s,0,e*.27,e*.78);for(const r of[-1,1]){const a=he(t.hair,e*.14,e*.78,18,6);a.rotation.z=r*.06,Mt(i,a,r*e*.91,-e*.25,e*.27)}}function jx(i,t,e){const n=pe(t.hair,e*1.08,32,24);n.scale.set(1.1,1.12,.92),Mt(i,n,0,e*.25,-e*.1);const s=he(t.hair,e*.34,e*.38,20,6);s.rotation.x=-.18,Mt(i,s,0,e*.66,-e*.52);const r=he(t.hair,e*.5,e*1.58,24,8);r.rotation.x=-.1,Mt(i,r,0,-e*.16,-e*1.02);const a=pe(t.hair,e*.58,32,24);a.scale.set(1.1,1.12,.94),Mt(i,a,0,-e*.9,-e*1.06);for(const[o,l,c,h]of[[-.78,.52,.43,-.16],[-.52,.55,.3,-.08],[-.26,.56,.46,-.03],[0,.55,.33,0],[.27,.56,.49,.04],[.53,.54,.34,.09],[.79,.5,.44,.16]])_s(i,t.hair,e*.17,e*c,o*e,l*e,e*.68,h,-1,.24);for(const o of[-1,1]){const l=he(t.hair,e*.12,e*.86,18,6);l.rotation.z=o*.08,Mt(i,l,o*e*.86,-e*.2,e*.28)}}function t_(i,t,e){const n=pe(t.hair,e*1.05,28,20);n.scale.set(1.07,1,.89),Mt(i,n,0,e*.2,-e*.13);const s=pe(t.hair,e*.96,28,20);s.scale.set(1.1,1.02,.94),Mt(i,s,e*.3,e*.72,-e*.96);const r=pe(t.hair,e*.48,24,18);r.scale.set(1.15,.88,1),Mt(i,r,e*.28,e*.42,-e*.78);const a=he(t.hair,e*.26,e*.4,16,6);Mt(i,a,0,e*.1,-e*.54);for(const l of[-1,1]){const c=he(t.hair,e*.115,e*.76,14,5);c.rotation.z=l*.82,Mt(i,c,l*e*.27,e*.43,e*.54);const h=he(t.hair,e*.105,e*.72,14,5);h.rotation.z=l*.05,Mt(i,h,l*e*.82,-e*.17,e*.28)}const o=he(t.hair,e*.075,e*.42,12,4);o.rotation.z=Math.PI/2,Mt(i,o,0,e*.48,e*.58)}function _s(i,t,e,n,s,r,a,o,l,c){const h=new I(o,l,c).normalize(),f=jo(t,e,n);f.quaternion.setFromUnitVectors(new I(0,1,0),h),Mt(i,f,s+h.x*n*.25,r+h.y*n*.25,a+h.z*n*.25)}function e_(i,t,e){const n=pe(t.hair,e*1.08,28,20);n.scale.set(1.12,1.04,.92),Mt(i,n,0,e*.18,-e*.12);const s=pe(t.hair,e*.62,24,18);s.scale.set(1.3,.82,1.02),Mt(i,s,0,e*.04,-e*.73);const r=[[0,.72,.16,.15,.42,1,.04],[-.4,.63,.3,.14,.56,.86,.2],[.42,.64,.3,.14,.56,.86,.2],[-.82,.4,.02,.13,.9,.16,.02],[.82,.4,.02,.13,.9,.16,.02],[-.62,.1,-1.22,.12,.25,.15,-1],[0,.1,-1.28,.14,0,.12,-1],[.62,.1,-1.22,.12,-.25,.15,-1],[-.4,-.12,-1.2,.11,.2,-.12,-.96],[.4,-.12,-1.2,.11,-.2,-.12,-.96],[-.64,.48,.52,.13,-.2,.75,.56],[.64,.48,.52,.13,-.2,.75,.56]];for(const[a,o,l,c,h,f,u]of r)_s(i,t.hair,e*c,e*.7,a*e,o*e,l*e,h,f,u);for(const[a,o,l,c]of[[-.9,.35,-.75,.55],[-.58,.7,-.5,.9],[-.2,.86,-.18,1],[.2,.86,.18,1],[.58,.7,.5,.9],[.9,.35,.75,.55],[-.82,-.1,-.7,-.45],[.82,-.1,.7,-.45]])_s(i,t.hair,e*.21,e*.92,a*e,o*e,-e*1.34,l,c,-.58);for(const[a,o,l,c]of[[-.72,.28,-.65,.55],[-.38,.48,-.35,.82],[0,.56,0,.95],[.38,.48,.35,.82],[.72,.28,.65,.55],[-.72,-.18,-.45,-.35],[.72,-.18,.45,-.35]])_s(i,t.hair,e*.15,e*.62,a*e,o*e,-e*1.18,l,c,-.68);for(const a of[-.55,-.18,.18,.55])_s(i,t.hair,e*.11,e*.34,a*e,e*.48,e*.66,a*.22,-.7,.68)}function n_(i,t,e,n,s){if(e==="mara"?Qx(i,t,s):e==="dana"?jx(i,t,s):e==="priya"?t_(i,t,s):e==="delinquent"?e_(i,t,s):Jx(i,t,n,s),e==="crosby"){const r=pe(t.shirt,s*1.22,24,18);r.scale.set(1.04,.92,1.04),Mt(i,r,0,0,-s*.12)}if(e==="magician"&&(Mt(i,new Dt(new Si(s*1.25,s*1.25,.08,24),t.accent),0,s*.86,0),Mt(i,jo(t.shirt,s*.65,s),0,s*1.22,0)),e==="worker"){const r=pe(t.accent,s*1.16,24,18);r.scale.set(1.05,.42,1.05),Mt(i,r,0,s*.77,0),Mt(i,hn(t.accent,s*1.35,.06,s*.55),0,s*.67,s*.42)}}function i_(i,t,e){if(t==="mara"||t==="delinquent")Mt(e,he(i.metal,.055,.58,10,3),0,-.18,.12);else if(t==="gunner"||t==="crosby"||t==="beckett"){const n=he(i.metal,.07,.38,10,3);n.rotation.x=Math.PI/2,Mt(e,n,0,.02,.2),Mt(e,hn(i.shoe,.12,.12,.34),0,-.03,-.08)}else t==="magician"?(Mt(e,he(i.metal,.045,.72,10,3),0,-.16,.08),Mt(e,pe(i.accent,.11,14,10),0,.26,.08)):t==="official"?Mt(e,hn(i.white,.25,.32,.04),.04,0,.15):t==="priya"?(Mt(e,hn(i.white,.28,.18,.16),0,0,.1),Mt(e,hn(i.accent,.05,.2,.17),0,0,.19)):t==="hale"?Mt(e,hn(i.accent,.12,.12,.28),0,0,.16):t==="dana"&&Mt(e,he(i.metal,.045,.48,10,3),0,-.1,.12)}function Kh(i){let t=0;return i.traverse(e=>{if(e.isMesh){const n=e.geometry;t+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}}),Math.round(t)}function s_(i,t){const e=Yh(qh(i,t)),n=new Xt,s=new Xt,r=new Xt,a=new Xt,o=new Xt,l=new Xt,c=new Xt,h=new Xt,f=new Xt,u=t==="f";n.add(s),s.position.y=.64;for(const[m,g]of[[c,-.16],[h,.16]]){m.position.x=g,Mt(m,he(e.pants,.115,u?.31:.34),0,-.16,0),Mt(m,he(e.pants,.1,.22),0,-.41,0);const M=he(e.shoe,.12,.16);M.scale.set(1,.55,1.45),Mt(m,M,0,-.59,.08),s.add(m)}Mt(s,he(e.pants,.27,.12,14,4),0,-.02,0),s.add(r),r.position.y=.03;const d=he(e.shirt,u?.285:.31,.34,14,5);d.scale.z=u?.76:.82,Mt(r,d,0,.26,0),(i==="priya"||i==="official")&&Mt(r,hn(e.accent,.06,.26,.035),0,.28,.255),i==="worker"&&Mt(r,hn(e.accent,.38,.27,.05),0,.25,.25),i==="boxer"&&(Mt(r,hn(e.accent,.25,.16,.04),-.22,.19,.24),Mt(r,hn(e.accent,.25,.16,.04),.22,.19,.24));for(const[m,g]of[[o,-.39],[l,.39]])m.position.set(g,.43,0),Mt(m,he(e.shirt,.105,.2),0,-.11,0),Mt(m,he(e.skin,.09,.19),0,-.32,0),Mt(m,pe(e.skin,.1,12,8),0,-.46,0),i==="boxer"&&Mt(m,pe(e.accent,.14,14,10),0,-.49,.02),r.add(m);l.add(f),f.position.set(0,-.44,.13),i_(e,i,f),r.add(a),a.position.y=.76;const p=u?.36:.34;Mt(a,pe(e.skin,p,20,14),0,0,0),Zx(a,e,i,t,p),n_(a,e,i,t,p);const _=new Xt;return _.add(n),n.position.y=.08,{root:_,hip:s,torso:r,head:a,armL:o,armR:l,legL:c,legR:h,weap:f,tris:Kh(_)}}function r_(){const i=Yh(qh("wolverine","m")),t=new Xt,e=new Xt,n=new Xt,s=new Xt,r=new Xt,a=new Xt,o=new Xt,l=new Xt,c=new Xt;t.add(e),e.position.y=.44;const h=he(i.shirt,.38,.52,16,5);h.rotation.z=Math.PI/2,Mt(e,h,0,.18,.02),e.add(n),n.position.set(0,.38,.2),n.add(s),Mt(s,pe(i.skin,.31,18,12),0,.1,.31),Mt(s,pe(i.shadow,.22,14,10),0,.02,.57),Tr(s,i,-.1,.16,.58),Tr(s,i,.1,.16,.58);for(const u of[-.2,.2])Mt(s,jo(i.hair,.12,.28),u,.38,.25);for(const[u,d,p]of[[o,-.22,.28],[l,.22,.28],[r,-.22,-.28],[a,.22,-.28]])u.position.set(d,0,p),Mt(u,he(i.pants,.12,.28),0,-.12,0),e.add(u);const f=he(i.hair,.07,.4,10,3);return f.rotation.x=-.35,Mt(e,f,0,.18,-.55),a.add(c),{root:t,hip:e,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:Kh(t)}}const Uc=new Map;function Zh(i,t){const e=`${i}:${t}`,n=Uc.get(e);if(n)return n;const s={parts:i==="mara"?qx():i==="wolverine"?r_():s_(i,t)};return Uc.set(e,s),s}function a_(i,t,e,n,s){const{hip:r,torso:a,head:o,armL:l,armR:c,legL:h,legR:f,weap:u}=i;for(const p of[r,a,o,l,c,h,f,u])p.rotation.set(0,0,0);if(r.position.y=t==="wolverine"?.44:.64,a.position.y=t==="wolverine"?.38:.03,e==="idle"){const p=Math.sin(s/420)*.025;a.position.y+=p,o.rotation.z=Math.sin(s/900)*.035,l.rotation.x=.06+p,c.rotation.x=.06-p;return}if(e==="walk"){const p=Math.sin(n*Math.PI*2),_=Math.cos(n*Math.PI*2);h.rotation.x=p*.5,f.rotation.x=-p*.5,l.rotation.x=-p*.38,c.rotation.x=p*.38,a.position.y+=Math.abs(_)*.035,r.position.y+=Math.abs(p)*.018;return}if(e==="attack"){const p=n<.62;t==="wolverine"?(a.rotation.x=p?-.28:0,l.rotation.x=p?-.75:.15,c.rotation.x=p?-.75:.15,r.position.z=p?.14:0):t==="boxer"?(c.rotation.x=n<.35?-.35:p?-1.35:-.25,c.rotation.z=p?-.28:0,a.rotation.y=p?-.22:0,l.rotation.x=-.55):(c.rotation.x=n<.35?-.45:p?-1.35:-.35,c.rotation.z=p?-.32:0,u.rotation.x=p?-.45:0,a.rotation.y=p?-.16:0,l.rotation.x=-.25);return}const d=n<.66;l.rotation.x=d?-2:-1.25,c.rotation.x=d?-2:-1.25,l.rotation.z=.36,c.rotation.z=-.36,o.rotation.x=d?-.12:0,a.position.y+=d?.05:.015}let Dn=null,xi=null,Mi=null,_i=null,Nc=!1,vn=null;function o_(i){vn||(vn=document.createElement("canvas")),(vn.width!==i.width||vn.height!==i.height)&&(vn.width=i.width,vn.height=i.height);const t=vn.getContext("2d");return t&&(t.setTransform(1,0,0,1,0,0),t.globalAlpha=1,t.globalCompositeOperation="source-over",t.clearRect(0,0,vn.width,vn.height),t.drawImage(i,0,0)),vn}let Qn=null;function l_(i,t){Qn||(Qn=document.createElement("canvas"));const e=Math.max(2,Math.ceil(i)),n=Math.max(2,Math.ceil(t));(Qn.width!==e||Qn.height!==n)&&(Qn.width=e,Qn.height=n);const s=Qn.getContext("2d");return s&&(s.setTransform(1,0,0,1,0,0),s.clearRect(0,0,e,n),s.fillStyle="#6a7080",s.beginPath(),s.ellipse(e/2,n*.53,Math.max(1,e*.22),Math.max(1,n*.35),0,0,Math.PI*2),s.fill()),Qn}function Jh(){if(Nc&&Dn)return!0;if(typeof document>"u")return!1;try{const i=document.createElement("canvas");Dn=new Ux({canvas:i,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"}),Dn.setSize(192,240,!1),Dn.setPixelRatio(1),Dn.setClearColor(0,0),Dn.outputColorSpace=Ze,xi=new Of;const t=192/240;Mi=new Cr(-1.35*t,1.35*t,1.35,-1.35,.1,40),_i=new Xt,xi.add(_i),xi.add(new Ud(16774111,2238532,1.35));const e=new ic(16771015,1.7);e.position.set(3.5,6,4.5),xi.add(e);const n=new ic(9680383,.65);return n.position.set(-4,2,-3),xi.add(n),Nc=!0,!0}catch{return!1}}function c_(i){return i*Math.PI/4}const h_=30;function u_(i,t){if(!Mi)return;const e=t*Math.PI/180,n=4.2,s=Math.cos(e),r=Math.sin(e);Mi.position.set(Math.sin(i)*s*n,r*n+.85,Math.cos(i)*s*n),Mi.lookAt(0,.88,0),Mi.updateProjectionMatrix()}function Fc(i,t,e,n,s,r=0){const a=t(0,0,0),o=$h(s)*(e.role==="elite"?1.12:1),l=o*192/240,c=a.x-l*.5,h=a.y-o*.88;if(!Jh()||!Dn||!xi||!Mi||!_i){const p=l_(l,o);return i.save(),i.drawImage(p,c,h,l,o),i.restore(),{source:p,x:c,y:h,w:l,h:o}}const f=Zh(e.archetype,e.gender),u=$x(e,n);for(a_(f.parts,e.archetype,u.clip,u.t,n);_i.children.length;)_i.remove(_i.children[0]);f.parts.root.parent&&f.parts.root.parent.remove(f.parts.root),_i.add(f.parts.root),f.parts.root.rotation.set(0,c_(e.dir),0),u_(0,h_),Dn.render(xi,Mi);const d=o_(Dn.domElement);return i.save(),i.imageSmoothingEnabled=!0,i.drawImage(d,c,h,l,o),i.restore(),{source:d,x:c,y:h,w:l,h:o}}function f_(){if(!Jh())return;const i=["mara","dana","priya","hale","crosby","beckett","delinquent","magician","wolverine","boxer","gunner","worker","official"];for(const t of i)for(const e of["f","m"])Zh(t,e)}const Po=64,d_=24,p_=8,m_=15,g_=75,Ss=30;function Oc(i){return Math.min(g_,Math.max(m_,i))}function x_(i,t,e,n,s){return{x:(i-t)*(Po/2),y:(i+t)*(n/2)-e*s}}function kc(i,t,e,n,s,r,a,o){const l=a-e,c=o-n,h=s-e,f=r-n,u=i-e,d=t-n,p=l*l+c*c,_=l*h+c*f,m=l*u+c*d,g=h*h+f*f,M=h*u+f*d,T=p*g-_*_;if(Math.abs(T)<1e-8)return!1;const y=1/T,w=(g*m-_*M)*y,b=(p*M-_*m)*y;return w>=-.02&&b>=-.02&&w+b<=1.02}function Qh(i,t,e,n,s,r){return kc(i,t,e.x,e.y,n.x,n.y,s.x,s.y)||kc(i,t,e.x,e.y,s.x,s.y,r.x,r.y)}function __(i,t){return i.x<t.x+t.w&&i.x+i.w>t.x&&i.y<t.y+t.h&&i.y+i.h>t.y}function v_(i,t){const e=Math.min(i.x+i.w,t.x+t.w)-Math.max(i.x,t.x),n=Math.min(i.y+i.h,t.y+t.h)-Math.max(i.y,t.y);return e<=0||n<=0?0:e*n}function rr(i,t,e){return i.x+i.w+e<=t.x||t.x+t.w+e<=i.x||i.y+i.h+e<=t.y||t.y+t.h+e<=i.y}function jh(i,t,e){return t>=i.x&&t<=i.x+i.w&&e>=i.y&&e<=i.y+i.h}function Bc(i,t){const e=new Uint8Array(t),n=Math.min(t,i.length>>2);for(let s=0,r=0;s<n;s++,r+=4)e[s]=i[r+3];return e}function y_(i,t,e,n){const s=t.x-i.x,r=t.y-i.y,a=n.x-e.x,o=n.y-e.y,l=s*o-r*a;if(Math.abs(l)<1e-8)return!1;const c=((e.x-i.x)*o-(e.y-i.y)*a)/l,h=((e.x-i.x)*r-(e.y-i.y)*s)/l;return c>=-1e-4&&c<=1+1e-4&&h>=-1e-4&&h<=1+1e-4}function Hc(i,t){let e=1/0,n=1/0,s=-1/0,r=-1/0;for(const o of i)o.x<e&&(e=o.x),o.y<n&&(n=o.y),o.x>s&&(s=o.x),o.y>r&&(r=o.y);if(s<t.x||e>t.x+t.w||r<t.y||n>t.y+t.h)return!1;const a=[{x:t.x,y:t.y},{x:t.x+t.w,y:t.y},{x:t.x+t.w,y:t.y+t.h},{x:t.x,y:t.y+t.h}];for(const o of a)if(Qh(o.x,o.y,i[0],i[1],i[2],i[3]))return!0;for(const o of i)if(jh(t,o.x,o.y))return!0;for(let o=0;o<4;o++){const l=i[o],c=i[(o+1)%4];for(let h=0;h<4;h++)if(y_(l,c,a[h],a[(h+1)%4]))return!0}return!1}function on(i,t,e){return{x:i.x+(t.x-i.x)*e,y:i.y+(t.y-i.y)*e}}function ue(i){const t=Math.sin(i*12.9898)*43758.5453;return t-Math.floor(t)}function qi(i,t){if(!(t>0))return 0;const e=i%t;return e<0?e+t:e}const zc=4096,M_={},Lo={roof:{sky:["#2a1c12","#1a2830","#10161c"],glow:["rgba(42, 28, 18, 0)","rgba(200, 130, 55, 0.10)","rgba(40, 110, 120, 0.18)"],body:"rgba(7, 12, 18, 0.82)",win:"rgba(255, 196, 120, 0.72)",winAlt:"rgba(120, 220, 210, 0.66)",water0:"rgba(8, 22, 28, 0.30)",water1:"rgba(2, 3, 6, 0.97)",fog:"rgba(150, 180, 185, 0.07)",seed:101,gap0:6,gap1:12,bw0:28,bw1:40,bh0:.22,bh1:.3,winAt:.84,craneAt:.78,gantryAt:1,step:!1,sign:!1,tower:!1},alley:{sky:["#1c100a","#140c0a","#0c0908"],glow:["rgba(40, 18, 8, 0)","rgba(220, 110, 30, 0.09)","rgba(150, 60, 16, 0.16)"],body:"rgba(14, 7, 4, 0.84)",win:"rgba(255, 176, 70, 0.78)",water0:"rgba(20, 10, 6, 0.30)",water1:"rgba(3, 2, 2, 0.97)",fog:"rgba(190, 140, 80, 0.06)",seed:211,gap0:3,gap1:6,bw0:16,bw1:18,bh0:.58,bh1:.34,winAt:.88,craneAt:1,gantryAt:1,step:!0,sign:!1,tower:!1},warehouse:{sky:["#101820","#141c26","#0c1218"],glow:["rgba(16, 28, 40, 0)","rgba(130, 160, 180, 0.08)","rgba(60, 90, 112, 0.15)"],body:"rgba(7, 12, 18, 0.84)",win:"rgba(186, 220, 235, 0.62)",water0:"rgba(10, 16, 24, 0.32)",water1:"rgba(2, 3, 6, 0.97)",fog:"rgba(150, 175, 190, 0.065)",seed:307,gap0:16,gap1:22,bw0:70,bw1:80,bh0:.16,bh1:.18,winAt:.9,craneAt:.62,gantryAt:.38,step:!1,sign:!1,tower:!1},street:{sky:["#1a1018","#140e16","#0e0a12"],glow:["rgba(36, 10, 28, 0)","rgba(190, 40, 130, 0.08)","rgba(100, 30, 80, 0.14)"],body:"rgba(12, 6, 14, 0.82)",win:"rgba(255, 90, 180, 0.75)",water0:"rgba(18, 8, 16, 0.30)",water1:"rgba(3, 2, 4, 0.97)",fog:"rgba(190, 140, 175, 0.06)",seed:409,gap0:8,gap1:14,bw0:32,bw1:40,bh0:.32,bh1:.34,winAt:.74,craneAt:1,gantryAt:1,step:!0,sign:!0,tower:!1},plaza:{sky:["#10181c","#14161e","#10141a"],glow:["rgba(12, 32, 36, 0)","rgba(50, 150, 155, 0.08)","rgba(90, 60, 150, 0.13)"],body:"rgba(8, 10, 18, 0.8)",win:"rgba(150, 235, 220, 0.68)",winAlt:"rgba(190, 150, 235, 0.64)",water0:"rgba(8, 16, 24, 0.30)",water1:"rgba(2, 3, 6, 0.97)",fog:"rgba(150, 170, 190, 0.06)",seed:521,gap0:28,gap1:48,bw0:100,bw1:90,bh0:.12,bh1:.16,winAt:.9,craneAt:1,gantryAt:1,step:!1,sign:!1,tower:!0}};function Qe(i,t,e,n,s,r){if(n<=0||s<=0||r<=0)return;const a=qi(t,r);i.fillRect(a,e,n,s),a+n>r&&i.fillRect(a-r,e,n,s)}function S_(i,t,e,n,s,r){const a=e-n;Qe(i,t,a,2.5,n,r),Qe(i,t-s*.22,a,s,2,r),Qe(i,t+s*.42,a,1.6,n*.42,r)}function b_(i,t,e,n,s,r){const a=e-s,o=t+n*.16,l=t+n*.74;Qe(i,o,a,3,s,r),Qe(i,l,a,3,s,r),Qe(i,o,a,Math.max(3,l-o),2.5,r)}function Gc(i,t,e,n,s,r,a){i.fillStyle=t.body;let o=0,l=0;const c=a?1.7:1;for(;o<e&&l<700;){const h=ue(s+l*19.17),f=ue(s+l*7.31+2),u=(t.gap0+h*t.gap1)*c,d=(t.bw0+f*t.bw1)*(a?1.15:1),p=n*(t.bh0+ue(s+l*3.1)*t.bh1)*r,_=n-p;if(Qe(i,o,_,d,p,e),!a&&t.step&&ue(s+l*11.2)>.42){const m=d*.18,g=Math.max(3,p*.14);Qe(i,o+m,_-g,Math.max(2,d-m*2),g+1,e)}if(!a&&t.craneAt<1&&ue(s+l*13.7)>t.craneAt&&S_(i,o+d*.62,_,n*(.16+h*.18),d*1.25,e),!a&&t.gantryAt<1&&ue(s+l*15.1)>t.gantryAt&&b_(i,o,_,d,n*(.2+f*.18),e),!a&&t.sign&&ue(s+l*17.7)>.86&&(i.fillStyle=t.win,Qe(i,o+d*.12,_+p*.14,d*.46,Math.max(2,p*.04),e),i.fillStyle=t.body),!a&&ue(s+l*23.9)>t.winAt){const m=!!t.winAlt&&ue(s+l*4.4)>.8;i.fillStyle=m&&t.winAlt?t.winAlt:t.win;const g=1+Math.floor(ue(s+l*8.2)*3);for(let M=0;M<g;M++){if(ue(s+l*50+M*3)<.28)continue;const T=o+d*(.2+ue(s+l*9+M)*.55),y=_+p*(.16+ue(s+l*6+M)*.55);Qe(i,T,y,Math.max(2,d*.05),Math.max(3,p*.04),e)}i.fillStyle=t.body}o+=d+u,l++}}function T_(i,t,e,n){const s=Lo[t],r=i.createLinearGradient(0,0,0,n);if(r.addColorStop(0,s.glow[0]),r.addColorStop(.58,s.glow[1]),r.addColorStop(1,s.glow[2]),i.fillStyle=r,i.fillRect(0,0,e,n),i.save(),i.globalAlpha=.45,Gc(i,s,e,n,s.seed+80,.62,!0),i.restore(),Gc(i,s,e,n,s.seed,1,!1),!s.tower)return;i.fillStyle=s.body;const a=e*.64,o=36,l=n*.8;Qe(i,a,n-l,o,l,e),Qe(i,a+o*.4,n-l-n*.07,5,n*.09,e),i.fillStyle=s.win;for(let c=0;c<5;c++)ue(s.seed+90+c)<.28||Qe(i,a+12,n-l*(.18+c*.14),4,3,e)}function E_(i){return i instanceof HTMLCanvasElement?{w:i.width,h:i.height}:{w:i.naturalWidth,h:i.naturalHeight}}const tu=1.12,w_=2,ar=12.2,or=5.4,ps=1,Vc=.5,A_=.7,R_=40,C_=2,Wc=1.15,P_=.45,L_=.55,I_=.8,D_=.45,U_=.78,N_="saturate(0.55) brightness(0.8)",fi=1,Ea=24,wa=20,F_=8,O_=["front","ne","right","se","back","sw","left","nw"];function Xc(i,t){return $h(i)*(t?tu:1)}function k_(i){if(i.length!==7||i.charCodeAt(0)!==35)return i;const t=Number.parseInt(i.slice(1),16);if(!Number.isFinite(t))return i;const e=o=>Math.round(o*.72+150*.28),n=e(t>>16&255),s=e(t>>8&255),r=e(t&255),a=o=>o.toString(16).padStart(2,"0");return`#${a(n)}${a(s)}${a(r)}`}class B_{constructor(t){k(this,"canvas");k(this,"ctx");k(this,"cam",{x:-224,y:180,zoom:.7});k(this,"w",390);k(this,"h",700);k(this,"time",0);k(this,"yaw",0);k(this,"pitch",Ss);k(this,"mapW",10);k(this,"mapH",12);k(this,"kingsWharf",new Image);k(this,"legacyPlate",!0);k(this,"skylineCache",new Map);k(this,"skylineArt",new Map);k(this,"skylineCacheH",-1);k(this,"skylineSlide",0);k(this,"skylineSlideAt",0);k(this,"skylineSlideSpan",0);k(this,"skylineSlideReady",!1);k(this,"mapDolls",{mara:new Image,dana:new Image,priya:new Image});k(this,"maraAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});k(this,"danaAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});k(this,"bodyStamps",new Map);k(this,"alphaMasks",new WeakMap);k(this,"sourceRev",new WeakMap);k(this,"alphaReadCanvas",null);k(this,"alphaReadCtx",null);k(this,"rigSnaps",new Map);k(this,"ghostCanvas",null);k(this,"ghostCtx",null);k(this,"labelRects",[]);k(this,"hover",null);k(this,"pointerX",0);k(this,"pointerY",0);k(this,"pointerInside",!1);k(this,"placedCount",0);k(this,"statusCount",0);k(this,"overlayCount",0);k(this,"labelPool",[]);k(this,"labelOrder",[]);k(this,"placedRects",[]);k(this,"statusRects",[]);k(this,"statusMarks",[]);k(this,"labelHold",new Map);k(this,"labelSeen",new Set);this.canvas=t;const e=t.getContext("2d");if(!e)throw new Error("canvas");this.ctx=e,this.kingsWharf.decoding="async",this.kingsWharf.src="./sprites/scene-kings-wharf.png",location.search.includes("bgslot")&&(this.legacyPlate=!1);for(const[n,s]of Object.entries(this.mapDolls))s.decoding="async",s.src=`./sprites/${n}.png`;for(const[n,s]of Object.entries(this.maraAngles))s.decoding="async",s.src=`./sprites/mara-${n}.png`;for(const[n,s]of Object.entries(this.danaAngles))s.decoding="async",s.src=`./sprites/dana-${n}.png`;this.resize(),this.trackCanvasPointer()}tileH(){return Po*Math.sin(this.pitch*Math.PI/180)}blockH(){const t=Math.cos(Ss*Math.PI/180);return d_*Math.cos(this.pitch*Math.PI/180)/t}baseH(){const t=Math.cos(Ss*Math.PI/180);return p_*Math.cos(this.pitch*Math.PI/180)/t}addPitch(t){this.pitch=Oc(this.pitch+t*.16)}setPitch(t){this.pitch=Oc(t)}resize(){const t=Math.min(window.devicePixelRatio||1,2),e=this.canvas.getBoundingClientRect();this.w=Math.max(1,e.width),this.h=Math.max(1,e.height),this.canvas.width=Math.floor(this.w*t),this.canvas.height=Math.floor(this.h*t),this.ctx.setTransform(t,0,0,t,0,0)}forceSize(t,e){const n=Math.min(window.devicePixelRatio||1,2);this.w=t,this.h=e,this.canvas.style.width=`${t}px`,this.canvas.style.height=`${e}px`,this.canvas.width=Math.floor(t*n),this.canvas.height=Math.floor(e*n),this.ctx.setTransform(n,0,0,n,0,0)}syncMap(t){this.mapW=t.w,this.mapH=t.h}isoOf(t,e,n=0){const s=Fr(t,e,this.yaw,this.mapW,this.mapH);return x_(s.x,s.y,n,this.tileH(),this.blockH())}worldToScreen(t,e,n=0){const s=this.isoOf(t,e,n);return{x:(s.x-this.cam.x)*this.cam.zoom+this.w/2,y:(s.y-this.cam.y)*this.cam.zoom+this.h/2}}topCorners(t,e,n){return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([r,a])=>this.worldToScreen(t+r,e+a,n))}topMetrics(t,e,n){const s=this.topCorners(t,e,n);let r=0,a=0;for(const c of s)r+=c.x,a+=c.y;r/=4,a/=4;let o=0,l=0;for(const c of s)o=Math.max(o,Math.abs(c.x-r)),l=Math.max(l,Math.abs(c.y-a));return{cx:r,cy:a,hw:o,hh:l,drop:(this.baseH()+n*this.blockH())*this.cam.zoom,top:s}}frontFaces(t,e){const n=[];for(let s=0;s<4;s++){const r=t[s],a=t[(s+1)%4],o={x:a.x,y:a.y+e},l={x:r.x,y:r.y+e};n.push({pts:[r,a,o,l],y:(r.y+a.y+o.y+l.y)/4})}return n.sort((s,r)=>s.y-r.y),n.slice(-2).map(s=>s.pts)}screenToGrid(t,e){const n=this.cam.x+(t-this.w/2)/this.cam.zoom,s=this.cam.y+(e-this.h/2)/this.cam.zoom,r=Po/2,a=this.tileH()/2,o=(n/r+s/a)/2,l=(s/a-n/r)/2,c=Math.cos(this.yaw),h=Math.sin(this.yaw),f=o*c-l*h,u=o*h+l*c;return{x:f+(this.mapW-1)/2,y:u+(this.mapH-1)/2}}lockGridToScreen(t,e,n,s,r){const a=this.isoOf(t,e,n);this.cam.x=a.x-(s-this.w/2)/this.cam.zoom,this.cam.y=a.y-(r-this.h/2)/this.cam.zoom}cellsInDrawOrder(t){const e=[];for(let n=0;n<t.h;n++)for(let s=0;s<t.w;s++)e.push({x:s,y:n});return e.sort((n,s)=>{const r=this.worldToScreen(n.x,n.y,t.heightAt(n.x,n.y)),a=this.worldToScreen(s.x,s.y,t.heightAt(s.x,s.y));return this.cmpScreenDepth(r.y,r.x,n.y,n.x,a.y,a.x,s.y,s.x)}),e}cmpScreenDepth(t,e,n,s,r,a,o,l){const c=t-r;if(Math.abs(c)>.05)return c;const h=e-a;return Math.abs(h)>.05?h:n!==o?n-o:s-l}orderUnits(t,e){t.sort((n,s)=>{const r=this.unitPose(n,e),a=this.unitPose(s,e),o=r.feetY-a.feetY;if(Math.abs(o)>.05)return o;const l=r.x-a.x;return Math.abs(l)>.05?l:n.id<s.id?-1:n.id>s.id?1:0})}hitTile(t,e,n){this.syncMap(n);const s=[];for(let r=0;r<n.h;r++)for(let a=0;a<n.w;a++)s.push({x:a,y:r});s.sort((r,a)=>{const o=this.worldToScreen(r.x,r.y,0),l=this.worldToScreen(a.x,a.y,0);return this.cmpScreenDepth(l.y,l.x,a.y,a.x,o.y,o.x,r.y,r.x)});for(const r of s){const a=n.tiles[r.y][r.x];if(this.hitTop(t,e,a.x,a.y,a.h))return{x:r.x,y:r.y}}return null}tileAtScreen(t,e,n){const s=this.canvas.getBoundingClientRect();return this.hitTile(t-s.left,e-s.top,n)}screenOfTile(t,e,n){this.syncMap(n);const s=n.tile(t,e),r=this.worldToScreen(t,e,s?s.h:0),a=this.canvas.getBoundingClientRect();return{x:r.x+a.left,y:r.y+a.top}}hitUnit(t,e,n,s){this.syncMap(n);const r=new Map;for(const o of s){if(o.dead)continue;const l=Ht(o.x,o.y),c=r.get(l);c?c.push(o):r.set(l,[o])}const a=[];for(const o of this.cellsInDrawOrder(n)){const l=r.get(Ht(o.x,o.y));if(l){this.orderUnits(l,n);for(const c of l)a.push(c)}}return this.pickDrawnUnit(t,e,a,n)}pickDrawnUnit(t,e,n,s){let r=null;for(let a=n.length-1;a>=0;a--){const o=this.unitContainsPoint(t,e,n[a],s);if(o==="alpha")return n[a];o==="feet"&&r==null&&(r=n[a])}return r}unitContainsPoint(t,e,n,s){return this.unitAlphaHit(t,e,n,s)?"alpha":this.unitRingHit(t,e,n,s)||this.unitLowerBodyHit(t,e,n,s)?"feet":null}unitAlphaHit(t,e,n,s){const r=this.bodyStamps.get(n.id);if(r&&r.dw>0&&r.dh>0){if(t<r.dx||e<r.dy||t>r.dx+r.dw||e>r.dy+r.dh)return!1;const a=this.stampPixelHit(r,t,e);if(a!=null)return a}return jh(this.unitBodyRect(n,this.unitPose(n,s)),t,e)}unitRingHit(t,e,n,s){const r=this.unitPose(n,s),a=ar*r.scale*Wc,o=or*r.scale*Wc;if(a<=0||o<=0)return!1;const l=(t-r.x)/a,c=(e-(r.feetY+ps*r.z))/o;return l*l+c*c<=1}unitLowerBodyHit(t,e,n,s){const r=this.bodyStamps.get(n.id);if(!r||!(r.dw>0)||!(r.dh>0))return!1;const a=this.unitPose(n,s),o=Math.max(r.dw*L_,2*ar*a.scale*I_),l=a.x-o/2,c=r.dy+r.dh*P_,h=a.feetY+ps*a.z+or*a.scale;return t>=l&&t<=l+o&&e>=c&&e<=h}unitBodyRect(t,e){const n=this.bodyStamps.get(t.id);if(n&&n.dw>0&&n.dh>0){const r=n.dw*A_;return{x:n.dx+(n.dw-r)/2,y:n.dy,w:r,h:n.dh}}const s=e.dh*Vc;return{x:e.x-s/2,y:e.feetY-e.dh,w:s,h:e.dh}}stampPixelHit(t,e,n){const s=this.alphaMask(t);if(!s)return null;const r=C_,a=r*r;for(let o=-r;o<=r;o++)for(let l=-r;l<=r;l++)if(!(l*l+o*o>a)&&this.stampAlpha(t,s,e+l,n+o)>R_)return!0;return!1}stampAlpha(t,e,n,s){let r=n-t.dx;const a=s-t.dy;if(r<0||a<0||r>=t.dw||a>=t.dh)return 0;t.mirror&&(r=t.dw-r);const o=Math.min(e.w-1,Math.floor(r/t.dw*e.w)),l=Math.min(e.h-1,Math.floor(a/t.dh*e.h));return o<0||l<0?0:e.alpha[l*e.w+o]}alphaMask(t){const e=t.source,n=Math.round(t.sw),s=Math.round(t.sh);if(!(n>0)||!(s>0))return null;const r=this.sourceRev.get(e)??0,a=e instanceof HTMLImageElement?`${e.src}:${e.naturalWidth}x${e.naturalHeight}`:`${n}x${s}`,o=this.alphaMasks.get(e);if(o&&o.rev===r&&o.w===n&&o.h===s&&o.sig===a)return o.ok?o:null;const l=this.readAlpha(e,n,s),c={w:n,h:s,alpha:l??new Uint8Array(0),rev:r,sig:a,ok:l!=null};return this.alphaMasks.set(e,c),c.ok?c:null}readAlpha(t,e,n){try{if(t instanceof HTMLCanvasElement){const a=t.getContext("2d");if(a&&t.width>=e&&t.height>=n)return Bc(a.getImageData(0,0,e,n).data,e*n)}const s=this.alphaReader(),r=this.alphaReadCanvas;return!s||!r?null:((r.width!==e||r.height!==n)&&(r.width=e,r.height=n),s.setTransform(1,0,0,1,0,0),s.globalAlpha=1,s.globalCompositeOperation="source-over",s.clearRect(0,0,e,n),s.drawImage(t,0,0,e,n),Bc(s.getImageData(0,0,e,n).data,e*n))}catch{return null}}alphaReader(){return(!this.alphaReadCanvas||!this.alphaReadCtx)&&(this.alphaReadCanvas=document.createElement("canvas"),this.alphaReadCtx=this.alphaReadCanvas.getContext("2d",{willReadFrequently:!0})),this.alphaReadCtx}hitTop(t,e,n,s,r){const a=this.topCorners(n,s,r);return Qh(t,e,a[0],a[1],a[2],a[3])}rotate(t){this.syncMap(t);const e=this.hitTile(this.w/2,this.h/2,t)??{x:Math.floor(t.w/2),y:Math.floor(t.h/2)};this.yaw=Mu(this.yaw);const n=t.heightAt(e.x,e.y),s=this.isoOf(e.x,e.y,n);this.cam.x=s.x,this.cam.y=s.y-24}centerOn(t,e){this.syncMap(e);const n=t.filter(a=>!a.dead&&a.team==="player"&&!a.npc);if(!n.length)return;let s=0,r=0;for(const a of n){const o=this.isoOf(a.x,a.y,e.heightAt(a.x,a.y));s+=o.x,r+=o.y}this.cam.x=s/n.length,this.cam.y=r/n.length-52,this.cam.zoom=.7}fitToMap(t){this.syncMap(t),this.cam.zoom>1e-4||(this.cam.zoom=1);const e=this.cam.zoom,n=[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]];let s=1/0,r=1/0,a=-1/0,o=-1/0,l=!1;for(let u=0;u<t.h;u++)for(let d=0;d<t.w;d++){const p=t.tiles[u][d],_=this.topMetrics(p.x,p.y,p.h).drop/e;for(const[m,g]of n){const M=this.isoOf(p.x+m,p.y+g,p.h);l=!0,M.x<s&&(s=M.x),M.y<r&&(r=M.y),M.x>a&&(a=M.x),M.y>o&&(o=M.y);const T=M.y+_;T>o&&(o=T)}}if(!l)return;const c=a-s,h=o-r;if(!(c>0)||!(h>0))return;const f=Math.min(this.w*.92/c,this.h*.85/h);this.cam.zoom=Math.min(1.8,Math.max(.55,f)),this.cam.x=(s+a)/2,this.cam.y=(r+o)/2}draw(t,e,n,s){const r=this.ctx;this.syncMap(t),this.time+=16,r.clearRect(0,0,this.w,this.h),this.drawBackdrop(t.theme);const a=new Map,o=new Map;for(const u of e){if(u.dead){u.team==="player"&&!u.npc&&o.set(Ht(u.x,u.y),u);continue}const d=Ht(u.x,u.y),p=a.get(d);p?p.push(u):a.set(d,[u])}const l=new Map;for(const u of t.objects)u.gone||l.set(Ht(u.x,u.y),u);this.statusCount=0;const c=this.cellsInDrawOrder(t),h=new Map;for(let u=0;u<c.length;u++)h.set(Ht(c[u].x,c[u].y),u);this.bodyStamps.clear();const f=[];for(const u of c){this.drawTile(t.tiles[u.y][u.x],t,n);const d=l.get(Ht(u.x,u.y));d&&this.drawBoardObj(d,t);const p=a.get(Ht(u.x,u.y)),_=o.get(Ht(u.x,u.y));if(_&&this.drawDownedMarker(_,t,!1),!!p){this.orderUnits(p,t);for(const m of p)this.drawUnit(m,t,n),f.push(m)}}for(const u of f)this.drawOccludedGhost(u,t,c,h,l);this.drawUnitOverlays(f,t,n),this.drawVignette(),this.drawFloats(s,t)}drawBackdrop(t){const e=this.ctx;if(t==="roof"&&this.legacyPlate&&this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0){const n=Math.max(this.w/this.kingsWharf.naturalWidth,this.h/this.kingsWharf.naturalHeight),s=this.kingsWharf.naturalWidth*n,r=this.kingsWharf.naturalHeight*n,a=(this.w-s)*.42,o=(this.h-r)*.46;e.save(),e.globalAlpha=.86,e.drawImage(this.kingsWharf,a,o,s,r),e.fillStyle="rgba(5, 8, 18, 0.42)",e.fillRect(0,0,this.w,this.h);const l=e.createLinearGradient(0,0,0,this.h);l.addColorStop(0,"rgba(4, 8, 18, 0.38)"),l.addColorStop(.5,"rgba(6, 7, 14, 0.08)"),l.addColorStop(1,"rgba(4, 5, 10, 0.62)"),e.fillStyle=l,e.fillRect(0,0,this.w,this.h),e.restore();return}this.drawSkylineSlot(t)}drawSky(t){const e=Lo[t],n=this.ctx.createLinearGradient(0,0,0,this.h);n.addColorStop(0,e.sky[0]),n.addColorStop(.55,e.sky[1]),n.addColorStop(1,e.sky[2]),this.ctx.fillStyle=n,this.ctx.fillRect(0,0,this.w,this.h)}skylineBitmap(t){const e=M_[t];if(e){let n=this.skylineArt.get(t);if(n||(n=new Image,n.decoding="async",n.src=e,this.skylineArt.set(t,n)),n.complete&&n.naturalWidth>0)return n}return this.proceduralSkyline(t)}proceduralSkyline(t){const e=Math.max(48,Math.round(this.h*.45));e!==this.skylineCacheH&&(this.skylineCache.clear(),this.skylineCacheH=e);const n=this.skylineCache.get(t);if(n)return n;const s=document.createElement("canvas");s.width=zc,s.height=e;const r=s.getContext("2d");return r&&T_(r,t,zc,e),this.skylineCache.set(t,s),s}stepSkylineSlide(t,e){const n=performance.now();if(!this.skylineSlideReady||this.skylineSlideSpan!==e){this.skylineSlide=qi(t,e),this.skylineSlideReady=!0,this.skylineSlideSpan=e,this.skylineSlideAt=n;return}const s=Math.min(.1,Math.max(0,(n-this.skylineSlideAt)/1e3));this.skylineSlideAt=n;let r=qi(t-this.skylineSlide,e);r>e*.5&&(r-=e);const a=1-Math.exp(-s/.1);this.skylineSlide=qi(this.skylineSlide+r*a,e)}drawSkylineSlot(t){const e=this.ctx;this.drawSky(t);const n=this.skylineBitmap(t),{w:s,h:r}=E_(n),a=this.h*.58,o=1+(this.cam.zoom-1)*.3,l=s*o,c=r*o;if(!(l>1)||!(c>1)){this.drawWaterFog(t,a);return}const h=-this.cam.x*this.cam.zoom*.3,f=-this.cam.y*this.cam.zoom*.3,u=Math.min(c,this.h*.45),d=a-c,p=a-u;let _=d+f;p>d?_<d?_=d:_>p&&(_=p):_=d,this.stepSkylineSlide(this.yaw/(Math.PI*2)*s,s);let m=qi(h+this.skylineSlide*o,l);m>0&&(m-=l),e.save(),e.beginPath(),e.rect(0,0,this.w,a),e.clip();for(let g=m;g<this.w;g+=l)e.drawImage(n,g,_,l,c);e.restore(),this.drawWaterFog(t,a)}drawWaterFog(t,e){const n=this.ctx,s=Lo[t],r=n.createLinearGradient(0,e,0,this.h);r.addColorStop(0,s.water0),r.addColorStop(.42,"rgba(4, 6, 10, 0.86)"),r.addColorStop(1,s.water1),n.fillStyle=r,n.fillRect(0,e,this.w,Math.max(0,this.h-e));const a=Math.max(1,this.h-e);for(let o=0;o<3;o++){const l=Math.sin(this.time*35e-5+o*1.7)*8,c=e+a*(.18+o*.22)+l,h=this.w*(.62+o*.14),f=this.w+h,u=qi(this.time*(.012+o*.005)+o*this.w*.37,f)-h,d=n.createRadialGradient(0,0,0,0,0,1);d.addColorStop(0,s.fog),d.addColorStop(.55,s.fog.replace(/[\d.]+\)$/,p=>`${parseFloat(p)*.5})`)),d.addColorStop(1,"rgba(0,0,0,0)"),n.save(),n.translate(u+h/2,c),n.scale(h/2,42),n.fillStyle=d,n.fillRect(-1,-1,2,2),n.restore()}}themeGroup(t){return t==="warehouse"||t==="street"||t==="alley"?"alley":"roof"}tilePaint(t,e,n){const s=t.blocked;return this.themeGroup(e)==="alley"?t.terrain==="stairs"?{top:n?"#6e6254":"#5e5248",left:"#3a3228",right:"#4a4034",rim:"rgba(220, 190, 140, 0.35)",seam:"rgba(30, 20, 12, 0.45)"}:t.terrain==="roof"?{top:n?"#3a3e4c":"#323644",left:"#241c1a",right:"#302624",rim:"rgba(180, 160, 130, 0.3)",seam:"rgba(20, 16, 14, 0.5)"}:{top:s?n?"#1e2228":"#1a1e24":n?"#2c323c":"#262c36",left:"#14161c",right:"#1c2026",rim:s?"rgba(180, 70, 50, 0.4)":"rgba(120, 160, 180, 0.28)",seam:"rgba(10, 12, 16, 0.5)"}:t.terrain==="stairs"?{top:n?"#6a6258":"#5a544c",left:"#3a342c",right:"#4a443c",rim:"rgba(210, 200, 180, 0.32)",seam:"rgba(28, 24, 20, 0.45)"}:t.terrain==="roof"?{top:s?n?"#2e2c3c":"#282636":n?"#4a4860":"#3e3c54",left:"#241e2c",right:"#302838",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(140, 210, 230, 0.34)",seam:"rgba(18, 14, 28, 0.5)"}:{top:s?n?"#1c1a24":"#18161e":n?"#2c2a38":"#262430",left:"#16141c",right:"#201c28",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(110, 190, 210, 0.28)",seam:"rgba(12, 10, 18, 0.5)"}}drawTile(t,e,n){const s=this.ctx,{cx:r,cy:a,hw:o,hh:l,drop:c,top:h}=this.topMetrics(t.x,t.y,t.h),f=Ht(t.x,t.y),u=(t.x+t.y)%2===0,d=this.cam.zoom,p=this.frontFaces(h,c),_=this.tilePaint(t,e.theme,u),m=p.slice().sort((M,T)=>(M[0].x+M[1].x)/2-(T[0].x+T[1].x)/2);for(let M=0;M<m.length;M++)this.drawWallFace(t,m[M],M===0?_.left:_.right,e.theme,d,t.x*13+t.y*7+M);this.drawTopSurface(t,e,h,r,a,o,l,_,d),this.drawRailings(t,e,h,d),this.drawProp(t,e.theme,r,a,o,l,d),n.move.has(f)&&(this.quadPath(this.insetQuad(h,.92)),s.fillStyle="rgba(62, 240, 208, 0.3)",s.fill(),s.strokeStyle="rgba(62, 240, 208, 0.9)",s.lineWidth=1.2,s.stroke());const g=n.areaKind;if(n.area.has(f)&&!n.hot.has(f)){const M=g==="skill"||g==="item"?"rgba(230, 48, 255, 0.3)":"rgba(255, 90, 110, 0.14)",T=g==="skill"||g==="item"?"rgba(242, 92, 255, 0.76)":"rgba(255, 110, 130, 0.42)";this.quadPath(this.insetQuad(h,.9)),s.fillStyle=M,s.fill(),s.strokeStyle=T,s.lineWidth=1.15,s.stroke()}if(n.hot.has(f)){const M=.5+.28*Math.sin(this.time/190),T=g==="skill"||g==="item"?`rgba(244, 72, 255, ${.4+M*.22})`:`rgba(255, 80, 110, ${.3+M*.22})`,y=g==="skill"||g==="item"?"rgba(255, 170, 255, 0.98)":"rgba(255, 170, 180, 0.98)";this.quadPath(this.insetQuad(h,.86)),s.fillStyle=T,s.fill(),s.strokeStyle=y,s.lineWidth=2.15,s.stroke()}n.inspect&&n.inspect.x===t.x&&n.inspect.y===t.y&&(this.quadPath(this.insetQuad(h,.96)),s.strokeStyle="rgba(255, 232, 160, 0.95)",s.lineWidth=2,s.stroke())}drawWallFace(t,e,n,s,r,a){const o=this.ctx,[l,c,h,f]=e;o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.fillStyle=n,o.fill(),o.save(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.clip();const u=this.blockH()*r;o.strokeStyle=s==="alley"?"rgba(20, 12, 8, 0.4)":"rgba(10, 8, 16, 0.4)",o.lineWidth=1;const d=Math.max(1,t.h);for(let _=1;_<=d;_++){const m=_*u;o.beginPath(),o.moveTo(l.x,l.y+m),o.lineTo(c.x,c.y+m),o.stroke()}const p=(l.x+c.x)/2;if(o.beginPath(),o.moveTo(p,(l.y+c.y)/2),o.lineTo(p,(h.y+f.y)/2),o.strokeStyle="rgba(0,0,0,0.18)",o.stroke(),t.h>=2&&ue(a)>.45){const _=(l.x+c.x)*.5,m=(l.y+c.y)*.5+u*.55,g=Math.max(4,Math.abs(c.x-l.x)*.22),M=Math.max(5,u*.42);o.fillStyle=s==="alley"?"rgba(8, 8, 6, 0.7)":"rgba(6, 8, 14, 0.72)",o.fillRect(_-g,m-M/2,g*2,M),o.strokeStyle=s==="alley"?"rgba(255, 170, 80, 0.18)":"rgba(80, 160, 220, 0.2)",o.strokeRect(_-g,m-M/2,g*2,M)}if(t.h>=1&&ue(a+3)>.62){const _=l.x*.7+c.x*.3;o.strokeStyle=s==="alley"?"rgba(90, 70, 50, 0.55)":"rgba(70, 90, 100, 0.5)",o.lineWidth=Math.max(1.4,1.8*r),o.beginPath(),o.moveTo(_,(l.y+c.y)/2),o.lineTo(_,(h.y+f.y)/2),o.stroke()}o.restore(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.strokeStyle="rgba(0,0,0,0.35)",o.lineWidth=1,o.stroke()}drawTopSurface(t,e,n,s,r,a,o,l,c){const h=this.ctx;if(this.quadPath(n),h.fillStyle=l.top,h.fill(),h.save(),this.quadPath(n),h.clip(),t.terrain==="stairs"){h.strokeStyle="rgba(20, 16, 12, 0.45)",h.lineWidth=Math.max(1.2,1.5*c);for(let u=1;u<=4;u++){const d=u/5,p=on(n[0],n[3],d),_=on(n[1],n[2],d);h.beginPath(),h.moveTo(p.x,p.y),h.lineTo(_.x,_.y),h.stroke()}h.fillStyle="rgba(255, 230, 190, 0.07)",h.fillRect(s-a,r-o*.2,a*2,o*.5)}else if(e.theme==="roof"&&t.terrain==="roof"){h.strokeStyle=l.seam,h.lineWidth=1;for(let u=1;u<=4;u++){const d=u/5,p=on(n[0],n[1],d),_=on(n[3],n[2],d);h.beginPath(),h.moveTo(p.x,p.y),h.lineTo(_.x,_.y),h.stroke()}!t.prop&&!t.blocked&&ue(t.x*9+t.y*17)<.2?(this.quadPath(this.insetQuad(n,.42)),h.fillStyle="rgba(20, 40, 70, 0.55)",h.fill(),h.strokeStyle="rgba(120, 200, 230, 0.45)",h.stroke()):!t.prop&&ue(t.x*5+t.y*11)<.16&&(h.fillStyle="#3a3e48",h.beginPath(),h.ellipse(s+a*.12,r-o*.08,4.5*c,3.2*c,0,0,Math.PI*2),h.fill(),h.strokeStyle="#8a93a3",h.stroke())}else if(e.theme==="alley"&&t.terrain==="street"){ue(t.x+t.y*8)>.55&&(h.fillStyle="rgba(70, 140, 180, 0.1)",h.beginPath(),h.ellipse(s-a*.1,r+o*.12,a*.32,o*.22,0,0,Math.PI*2),h.fill()),h.strokeStyle="rgba(0,0,0,0.28)",h.beginPath();const u=on(n[0],n[2],.35+ue(t.x*3)*.3);h.moveTo(s-a*.2,r),h.lineTo(u.x,u.y),h.stroke()}else if(e.theme==="roof"){this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0&&(h.globalAlpha=.14,h.drawImage(this.kingsWharf,-this.w*.2,-this.h*.18,this.w*1.4,this.h*1.2),h.globalAlpha=1,h.fillStyle="rgba(88, 42, 26, 0.16)",h.fill()),h.strokeStyle="rgba(255, 192, 106, 0.22)",h.lineWidth=Math.max(1,c);const u=on(n[0],n[2],.5),d=on(n[1],n[3],.5);h.beginPath(),h.moveTo(u.x,u.y),h.lineTo(d.x,d.y),h.stroke(),!t.prop&&!t.blocked&&ue(t.x*31+t.y*47)<.22&&(h.strokeStyle="rgba(245, 221, 166, 0.68)",h.lineWidth=Math.max(1,1.25*c),h.beginPath(),h.ellipse(s+a*.05,r+o*.04,a*.28,o*.28,0,0,Math.PI*2),h.stroke(),h.beginPath(),h.moveTo(s-a*.16,r+o*.04),h.lineTo(s+a*.22,r+o*.04),h.moveTo(s+a*.03,r-o*.18),h.lineTo(s+a*.03,r+o*.2),h.stroke())}else h.strokeStyle=l.seam,h.beginPath(),h.moveTo(on(n[0],n[1],.5).x,on(n[0],n[1],.5).y),h.lineTo(on(n[3],n[2],.5).x,on(n[3],n[2],.5).y),h.stroke();if(t.blocked){h.strokeStyle="rgba(0,0,0,0.28)",h.lineWidth=1;for(let u=-2;u<=2;u++)h.beginPath(),h.moveTo(s-a+u*6*c,r-o),h.lineTo(s+a+u*6*c,r+o),h.stroke()}h.fillStyle="rgba(255,255,255,0.055)";for(let u=0;u<5;u++){const d=ue(t.x*19+t.y*23+u),p=ue(t.x*29+t.y*31+u+4);h.fillRect(s-a+d*a*2,r-o+p*o*2,1.6*c,1.2*c)}h.restore(),this.quadPath(n),h.strokeStyle=l.rim,h.lineWidth=1.2,h.stroke();let f=0;for(let u=1;u<4;u++)n[u].y<n[f].y&&(f=u);h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+1)%4].x,n[(f+1)%4].y),h.strokeStyle="rgba(230, 248, 255, 0.38)",h.stroke(),h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+3)%4].x,n[(f+3)%4].y),h.strokeStyle="rgba(20, 20, 28, 0.4)",h.stroke()}drawRailings(t,e,n,s){if(t.h<1||t.terrain==="stairs")return;const r=this.ctx,a=[[0,-1],[1,0],[0,1],[-1,0]],o=(e.theme==="roof"?7.5:6.5)*s;r.strokeStyle=e.theme==="roof"?"rgba(170, 186, 210, 0.85)":"rgba(120, 96, 72, 0.8)",r.lineWidth=Math.max(1.15,1.35*s);for(let l=0;l<4;l++){const c=e.tile(t.x+a[l][0],t.y+a[l][1]);if((c?t.h-c.h:t.h+1)<1)continue;const f=n[l],u=n[(l+1)%4];r.beginPath(),r.moveTo(f.x,f.y),r.lineTo(f.x,f.y-o),r.lineTo(u.x,u.y-o),r.lineTo(u.x,u.y),r.stroke(),r.beginPath(),r.moveTo(f.x,f.y-o*.48),r.lineTo(u.x,u.y-o*.48),r.stroke()}}diamondPath(t,e,n,s){const r=this.ctx;r.beginPath(),r.moveTo(t,e-s),r.lineTo(t+n,e),r.lineTo(t,e+s),r.lineTo(t-n,e),r.closePath()}quadPath(t){const e=this.ctx;e.beginPath(),e.moveTo(t[0].x,t[0].y);for(let n=1;n<t.length;n++)e.lineTo(t[n].x,t[n].y);e.closePath()}insetQuad(t,e){let n=0,s=0;for(const r of t)n+=r.x,s+=r.y;return n/=t.length,s/=t.length,t.map(r=>({x:n+(r.x-n)*e,y:s+(r.y-s)*e}))}drawProp(t,e,n,s,r,a,o){const l=this.ctx;if(t.prop==="stall"){const c=15*o;l.beginPath(),l.moveTo(n-r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n-r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#3a141c",l.fill(),l.beginPath(),l.moveTo(n+r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n+r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#4a1d28",l.fill();const h=.75+Math.sin(this.time/180+t.x)*.2;this.diamondPath(n,s-4*o,r*.62,a*.62),l.fillStyle=`rgba(255, 61, 138, ${.72*h})`,l.fill(),l.fillStyle="#ffe08a",l.font=`bold ${Math.max(8,9*o)}px sans-serif`,l.textAlign="center",l.fillText(t.x<5?"FISH":"TEA",n,s-2*o)}else if(t.prop==="crate"){const c=13*o;l.beginPath(),l.moveTo(n-r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n-r*.48,s+c),l.closePath(),l.fillStyle="#5a3a22",l.fill(),l.beginPath(),l.moveTo(n+r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n+r*.48,s+c),l.closePath(),l.fillStyle="#6c4628",l.fill(),this.diamondPath(n,s-2*o,r*.48,a*.48),l.fillStyle="#8a5a32",l.fill(),l.strokeStyle="rgba(40, 22, 10, 0.55)",l.lineWidth=1;for(let h=-1;h<=1;h++)l.beginPath(),l.moveTo(n-r*.28,s+h*3*o),l.lineTo(n+r*.28,s+h*3*o),l.stroke();l.strokeStyle="rgba(180, 160, 120, 0.45)",l.strokeRect(n-5*o,s-3*o,10*o,4*o)}else if(t.prop==="ac"){const c=11*o;l.beginPath(),l.moveTo(n-r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n-r*.42,s+c),l.closePath(),l.fillStyle="#2e323c",l.fill(),l.beginPath(),l.moveTo(n+r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n+r*.42,s+c),l.closePath(),l.fillStyle="#3a3e48",l.fill(),this.diamondPath(n,s-2*o,r*.42,a*.42),l.fillStyle="#4a5060",l.fill();const h=this.time/140;l.strokeStyle="#8a93a3",l.lineWidth=1.2,l.beginPath(),l.arc(n,s-2*o,4.8*o,0,Math.PI*2),l.stroke(),l.beginPath(),l.moveTo(n+Math.cos(h)*4.2*o,s-2*o+Math.sin(h)*2.2*o),l.lineTo(n-Math.cos(h)*4.2*o,s-2*o-Math.sin(h)*2.2*o),l.stroke()}else if(t.prop==="lamp"){l.fillStyle="#2a2a32",l.fillRect(n-1.6*o,s-20*o,3.2*o,24*o);const c=e==="alley"?"rgba(255, 180, 80, 0.92)":"rgba(255, 210, 120, 0.9)";l.fillStyle=c,l.beginPath(),l.arc(n,s-22*o,4.4*o,0,Math.PI*2),l.fill(),l.fillStyle=e==="alley"?"rgba(255, 160, 70, 0.14)":"rgba(255, 200, 110, 0.12)",l.beginPath(),l.arc(n,s-4*o,17*o,0,Math.PI*2),l.fill()}}projectAt(t,e,n,s,r){return(a,o,l)=>{const c=Dc(a,o,s),h=this.worldToScreen(t+c.x,e+c.y,n+l*Ta),f=Fr(t+c.x,e+c.y,this.yaw,r.w,r.h);return{x:h.x,y:h.y,d:f.x+f.y-l}}}drawBoardObj(t,e){const n=this.ctx,s=e.tiles[t.y][t.x].h;this.worldToScreen(t.x,t.y,s);const r=this.cam.zoom,{cx:a,cy:o,hw:l,hh:c}=this.topMetrics(t.x,t.y,s);if(t.type==="barrel"){n.fillStyle="#7a2a22",n.beginPath(),n.ellipse(a,o+2*r,l*.38,c*.32,0,0,Math.PI*2),n.fill(),n.fillStyle="#c44a32",n.fillRect(a-7*r,o-16*r,14*r,18*r),n.fillStyle="#e8c45a",n.fillRect(a-7*r,o-8*r,14*r,2.2*r),n.fillStyle="#2a1010",n.beginPath(),n.ellipse(a,o-16*r,7*r,3.2*r,0,0,Math.PI*2),n.fill();const f=t.hp/Math.max(1,t.maxHp);n.fillStyle="#111018",n.fillRect(a-10*r,o-22*r,20*r,3*r),n.fillStyle="#ff4d6d",n.fillRect(a-10*r,o-22*r,20*r*f,3*r);return}if(t.type==="kit"){n.fillStyle="#f2f4f0",n.fillRect(a-8*r,o-8*r,16*r,12*r),n.fillStyle="#d04040",n.fillRect(a-2*r,o-6*r,4*r,8*r),n.fillRect(a-6*r,o-3*r,12*r,3*r),n.strokeStyle="#3a3a40",n.strokeRect(a-8*r,o-8*r,16*r,12*r);return}if(t.type==="switch"){n.fillStyle=t.used?"#3a5a48":"#3ef0d0",this.diamondPath(a,o,l*.35,c*.35),n.fill(),n.strokeStyle="#0a1816",n.stroke(),n.fillStyle=t.used?"#8aa":"#fff",n.font=`bold ${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(t.used?"開":"掣",a,o+3*r);return}if(t.type==="van"){n.fillStyle=t.used?"#3a4850":"#2a3540",n.fillRect(a-14*r,o-18*r,28*r,22*r),n.fillStyle="#1a2228",n.fillRect(a-10*r,o-14*r,12*r,8*r),n.fillStyle=t.used?"#7dffb3":"#ffc857",n.fillRect(a+4*r,o-6*r,8*r,10*r),n.fillStyle="#e8eef2",n.font=`${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(t.used?"開":"門",a,o+16*r);return}const h=t.type==="pallet"?8*r:12*r;n.fillStyle=t.type==="pallet"?"#6a5030":"#8a5a32",n.beginPath(),n.moveTo(a-l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a-l*.46,o+h),n.closePath(),n.fill(),n.fillStyle=t.type==="pallet"?"#7a6038":"#a06a3c",n.beginPath(),n.moveTo(a+l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a+l*.46,o+h),n.closePath(),n.fill(),this.diamondPath(a,o-2*r,l*.46,c*.46),n.fillStyle=t.type==="pallet"?"#c4a060":"#c48448",n.fill(),n.strokeStyle="rgba(40,22,10,0.55)",n.stroke()}projectFor(t,e){const n=e.heightAt(t.x,t.y);return(s,r,a)=>{const o=Dc(s,r,t.dir),l=this.worldToScreen(t.x+o.x,t.y+o.y,n+a*Ta),c=Fr(t.x+o.x,t.y+o.y,this.yaw,e.w,e.h);return{x:l.x,y:l.y,d:c.x+c.y-a*Ta*.45}}}drawDownedMarker(t,e,n){const s=this.ctx,{x:r,feetY:a,z:o,scale:l}=this.unitPose(t,e),c=a+ps*o,h=ar*l,f=or*l;if(s.save(),s.globalAlpha=.85,s.fillStyle="rgba(0,0,0,0.45)",s.beginPath(),s.ellipse(r,c,h,f,0,0,Math.PI*2),s.fill(),s.setLineDash([3,2]),s.strokeStyle="rgba(190,196,210,0.8)",s.lineWidth=1.4,s.stroke(),s.setLineDash([]),s.strokeStyle="rgba(255,92,120,0.9)",s.lineWidth=1.8,s.beginPath(),s.moveTo(r-h*.4,c-f*.4),s.lineTo(r+h*.4,c+f*.4),s.moveTo(r+h*.4,c-f*.4),s.lineTo(r-h*.4,c+f*.4),s.stroke(),!n){s.restore();return}s.font=`600 ${Math.max(9,Math.round(10*l))}px system-ui, sans-serif`,s.textAlign="center",s.textBaseline="top";const u=`${t.name} 倒下`,d=s.measureText(u).width,p=c+f+2;s.fillStyle="rgba(10,10,16,0.75)",s.fillRect(r-d/2-4,p-1,d+8,Math.max(9,Math.round(10*l))+4),s.fillStyle="rgba(220,224,232,0.9)",s.fillText(u,r,p+1),s.restore()}unitPose(t,e){const n=this.worldToScreen(t.x,t.y,e.heightAt(t.x,t.y)),s=this.cam.zoom,r=t.role==="elite",a=r?tu:1,o=yu(bs[t.dir].x,bs[t.dir].y,this.yaw),l=t.lunge||0,c=(o.x-o.y)*6*s*l,h=(o.x+o.y)*3*s*l;return{x:n.x+c,feetY:n.y+h+w_*s,z:s,scale:a*s,dh:Xc(s,r),dx:c,dy:h,ground:n,face:o,elite:r}}rememberRig(t,e){if(!e||!(e.w>0)||!(e.h>0)||e.source.width===0||e.source.height===0)return;let n=this.rigSnaps.get(t);n||(n=document.createElement("canvas"),this.rigSnaps.set(t,n)),(n.width!==e.source.width||n.height!==e.source.height)&&(n.width=e.source.width,n.height=e.source.height);const s=n.getContext("2d");s&&(s.setTransform(1,0,0,1,0,0),s.globalAlpha=1,s.globalCompositeOperation="source-over",s.clearRect(0,0,n.width,n.height),s.drawImage(e.source,0,0),this.sourceRev.set(n,(this.sourceRev.get(n)??0)+1),this.bodyStamps.set(t,{source:n,sw:n.width,sh:n.height,dx:e.x,dy:e.y,dw:e.w,dh:e.h,mirror:!1}))}objectRise(t){return t.kind==="platform"?t.standH:t.type==="barrel"||t.type==="van"?1:0}boardObjRect(t,e){const n=this.cam.zoom,{cx:s,cy:r,hw:a,hh:o}=this.topMetrics(t.x,t.y,e);let l=s,c=r,h=s,f=r;const u=(d,p,_,m)=>{d<l&&(l=d),p<c&&(c=p),d+_>h&&(h=d+_),p+m>f&&(f=p+m)};if(t.type==="barrel")u(s-a*.38,r+2*n-o*.32,a*.76,o*.64),u(s-10*n,r-22*n,20*n,24*n);else if(t.type==="kit")u(s-8*n,r-8*n,16*n,12*n);else if(t.type==="switch")u(s-a*.35,r-o*.35,a*.7,o*.7);else if(t.type==="van")u(s-14*n,r-18*n,28*n,40*n);else{const d=t.type==="pallet"?8*n:12*n,p=2*n+o*.46;u(s-a*.46,r-p,a*.92,p+o*.46+d)}return{x:l,y:c,w:h-l,h:f-c}}prismHitsRect(t,e){const{drop:n,top:s}=this.topMetrics(t.x,t.y,t.h);if(Hc(s,e))return!0;for(const r of this.frontFaces(s,n))if(Hc(r,e))return!0;return!1}bodyOccluded(t,e,n,s,r,a){const o=s.get(Ht(t.x,t.y));if(o==null)return!1;const l=e.heightAt(t.x,t.y);for(let c=o+1;c<n.length;c++){const h=n[c],f=e.tiles[h.y][h.x];if(f.h>l&&this.prismHitsRect(f,a))return!0;const u=r.get(Ht(h.x,h.y));if(u&&!(f.h+this.objectRise(u)<=l)&&__(this.boardObjRect(u,f.h),a))return!0}return!1}drawGhost(t,e){const n=Math.max(1,Math.round(t.sw)),s=Math.max(1,Math.round(t.sh));if(!(t.dw>0)||!(t.dh>0))return;(!this.ghostCanvas||!this.ghostCtx)&&(this.ghostCanvas=document.createElement("canvas"),this.ghostCtx=this.ghostCanvas.getContext("2d"));const r=this.ghostCanvas,a=this.ghostCtx;if(!a)return;(r.width<n||r.height<s)&&(r.width=Math.max(r.width,n),r.height=Math.max(r.height,s)),a.setTransform(1,0,0,1,0,0),a.globalCompositeOperation="source-over",a.globalAlpha=1,a.clearRect(0,0,n,s),a.save(),t.mirror&&(a.translate(n,0),a.scale(-1,1)),a.drawImage(t.source,0,0,t.sw,t.sh,0,0,n,s),a.restore(),a.save(),a.globalCompositeOperation="source-atop",a.globalAlpha=.35,a.fillStyle=e,a.fillRect(0,0,n,s),a.restore();const o=this.ctx;o.save(),o.globalAlpha=D_,o.drawImage(r,0,0,n,s,t.dx,t.dy,t.dw,t.dh),o.restore()}drawOccludedGhost(t,e,n,s,r){const a=this.bodyStamps.get(t.id);if(!a)return;const o={x:a.dx,y:a.dy,w:a.dw,h:a.dh};this.bodyOccluded(t,e,n,s,r,o)&&this.drawGhost(a,lr(t))}drawMapDoll(t,e,n,s,r,a,o,l=!0){const c=Xc(r,o),h=c*e.naturalWidth/e.naturalHeight,f=l&&a.x-a.y<0,u=this.ctx;u.save(),u.translate(n-h/2,s-c),f&&(u.translate(h,0),u.scale(-1,1)),u.drawImage(e,0,0,h,c),u.restore(),this.bodyStamps.set(t,{source:e,sw:e.naturalWidth,sh:e.naturalHeight,dx:n-h/2,dy:s-c,dw:h,dh:c,mirror:f})}drawUnit(t,e,n){const s=this.ctx,{x:r,feetY:a,z:o,scale:l,dh:c,dx:h,dy:f,ground:u,face:d,elite:p}=this.unitPose(t,e),_=lr(t),m=t.acted,g=Ia(t)&&t.acted;s.save(),s.fillStyle="rgba(0,0,0,0.4)",s.beginPath(),s.ellipse(r,a+ps*o,11*l,4.8*l,0,0,Math.PI*2),s.fill(),n.selected?.id===t.id&&(s.strokeStyle=_,s.lineWidth=2.2,this.diamondPath(u.x,u.y,16*l,8*l),s.stroke()),n.target?.id===t.id&&(s.strokeStyle="#ffe08a",s.lineWidth=2,this.diamondPath(u.x,u.y,18*l,9*l),s.stroke());const M=()=>{const T=this.projectFor(t,e),y=(w,b,R)=>{const v=T(w,b,R);return{x:v.x+h,y:v.y+f,d:v.d}};if(t.archetype==="mara"||t.archetype==="dana"){const b=(t.archetype==="mara"?this.maraAngles:this.danaAngles)[O_[t.dir]],R=this.mapDolls[t.archetype];b.complete&&b.naturalWidth>0&&b.naturalHeight>0?this.drawMapDoll(t.id,b,r,a,o,d,p,!1):R.complete&&R.naturalWidth>0&&R.naturalHeight>0?this.drawMapDoll(t.id,R,r,a,o,d,p,!1):this.rememberRig(t.id,Fc(s,y,t,this.time,o,this.yaw))}else{const w=t.archetype==="priya"?this.mapDolls.priya:null;w&&w.complete&&w.naturalWidth>0&&w.naturalHeight>0?this.drawMapDoll(t.id,w,r,a,o,d,p):this.rememberRig(t.id,Fc(s,y,t,this.time,o,this.yaw))}};if(g?this.withActedBody(M):M(),this.drawFacingWedge(t,e,r,a,o),s.restore(),m){const T=r+14*l,y=a-c+10*l,w=7.2*l;this.pushStatus(t.id,T,y,w,o,l)}}withActedBody(t){const e=this.ctx;if(e.save(),e.globalAlpha*=U_,typeof e.filter=="string")try{e.filter=N_}catch{}try{t()}finally{e.restore()}}trackCanvasPointer(){const t=this.canvas;typeof t.addEventListener=="function"&&(t.addEventListener("pointermove",e=>this.trackPointer(e)),t.addEventListener("pointerdown",e=>this.trackPointer(e)),t.addEventListener("pointerleave",()=>{this.pointerInside=!1,this.hover=null}))}trackPointer(t){const e=this.canvas.getBoundingClientRect();this.pointerX=t.clientX-e.left,this.pointerY=t.clientY-e.top,this.pointerInside=!0}hoveredUnit(t,e,n){if(n.hover!==void 0)return n.hover;if(!this.pointerInside)return this.hover;const s=this.pickDrawnUnit(this.pointerX,this.pointerY,t,e);return this.hover=s,s}labelSlot(t){let e=this.labelPool[t];return e||(e={id:"",text:"",accent:"#fff",dim:!1,fontPx:9,baseline:0,plateX:0,plateY:0,plateW:0,plateH:0,barW:0,barH:0,ratio:1,compactW:0,compactH:0,ringX:0,ringY:0,ringRx:1,ringRy:1,bodyX:0,bodyY:0,bodyW:0,bodyH:0,dx:0,dy:0,z:1},this.labelPool[t]=e),e}drawUnitOverlays(t,e,n){const s=t.length;if(this.overlayCount=s,this.placedCount=0,s===0){this.labelRects.length=0,this.labelHold.clear();return}const r=this.ctx,a=this.cam.zoom,o=Math.max(9,10*a);this.hoveredUnit(t,e,n);for(let u=0;u<s;u++){const d=t[u],p=this.labelSlot(u),_=this.unitPose(d,e),{x:m,feetY:g,scale:M,dh:T}=_,y=d.name.split(" ")[0];r.font=`${o}px sans-serif`,r.textAlign="center",r.textBaseline="alphabetic";const w=r.measureText(y),b=Math.max(3,4*a),R=Math.max(1,2*a),v=w.actualBoundingBoxAscent>0?w.actualBoundingBoxAscent:o*.8,E=w.actualBoundingBoxDescent>0?w.actualBoundingBoxDescent:o*.22,C=w.width+b*2,P=v+E+R*2,N=22*M,W=3.5*M,X=this.bodyStamps.get(d.id),O=X&&X.dh>0?X.dy:g-T,$=Math.max(2,3*a),G=O-$-P,Q=G+R+v,tt=m-C/2;if(p.id=d.id,p.text=y,p.accent=lr(d),p.dim=Ia(d)&&d.acted,p.fontPx=o,p.baseline=Q,p.plateX=tt,p.plateY=G,p.plateW=C,p.plateH=P,p.barW=N,p.barH=W,p.ratio=Math.max(0,d.hp/d.maxHp),p.compactW=Math.max(C,N),p.compactH=W+P,p.ringX=m,p.ringY=g+ps*a,p.ringRx=ar*M,p.ringRy=or*M,p.dx=0,p.dy=0,p.z=a,X&&X.dw>0&&X.dh>0)p.bodyX=X.dx,p.bodyY=X.dy,p.bodyW=X.dw,p.bodyH=X.dh;else{const at=T*Vc;p.bodyX=m-at/2,p.bodyY=g-T,p.bodyW=at,p.bodyH=T}}this.labelOrder.length=s;for(let u=0;u<s;u++)this.labelOrder[u]=u;const l=this.labelPool;this.labelOrder.sort((u,d)=>{const p=l[u].id,_=l[d].id;return p<_?-1:p>_?1:0});const c=this.labelSeen;c.clear();const h=[],f=[];for(let u=0;u<s;u++){const d=this.labelOrder[u],p=this.labelHold.get(l[d].id),_=t[d];p&&p.x===_.x&&p.y===_.y?h.push(d):f.push(d)}for(const u of h){const d=this.labelHold.get(l[u].id);this.holdLabel(l[u],d.dx,d.dy)}for(const u of f)this.placeLabel(l[u]);this.settleStatusIcons();for(let u=0;u<s;u++){const d=this.labelOrder[u],p=l[d],_=t[d];this.labelHold.set(p.id,{dx:p.dx,dy:p.dy,x:_.x,y:_.y}),c.add(p.id)}if(this.labelHold.size!==c.size)for(const u of this.labelHold.keys())c.has(u)||this.labelHold.delete(u);for(let u=0;u<s;u++)this.paintUnitRing(l[u]);for(let u=0;u<s;u++)this.paintUnitLabel(l[u]);this.paintStatusIcons(),this.labelRects.length>s&&(this.labelRects.length=s);for(let u=0;u<s;u++){const d=l[u];let p=this.labelRects[u];p||(p={id:"",x:0,y:0,w:0,h:0},this.labelRects[u]=p);const _=this.blockAt(d,d.dy,d.dx);p.id=d.id,p.x=_.x,p.y=_.y,p.w=_.w,p.h=_.h}}blockAt(t,e,n){return{x:t.ringX+n-t.compactW/2,y:t.plateY+e-t.barH,w:t.compactW,h:t.compactH}}placeLabel(t){const e=this.resolveLabel(t);this.commitLabel(t,e.ox,e.oy)}holdLabel(t,e,n){if(this.plateOverlap(t,e,n)<=0){this.commitLabel(t,e,n);return}const s=this.resolveLabel(t);this.commitLabel(t,s.ox,s.oy)}resolveLabel(t){const e=this.seekLabel(t,!1),n=this.seekLabel(t,!0);return n&&(!e||-n.oy<=-e.oy)?n:e||this.leastLabel(t)}seekLabel(t,e){for(let n=0;n<=wa;n++){const s=-n;for(let r=0;r<=Ea;r++){if(this.labelClear(t,r,s,e))return{ox:r,oy:s};if(r!==0&&this.labelClear(t,-r,s,e))return{ox:-r,oy:s}}}return null}leastLabel(t){let e=0,n=0,s=Number.POSITIVE_INFINITY,r=wa+1,a=Ea+1;for(let o=0;o<=wa;o++)for(let l=0;l<=Ea;l++){const c=l===0?[0]:[l,-l];for(const h of c){const f=this.plateOverlap(t,h,-o);(f<s-1e-6||Math.abs(f-s)<=1e-6&&(o<r||o===r&&l<a))&&(s=f,r=o,a=l,e=h,n=-o)}}return{ox:e,oy:n}}labelClear(t,e,n,s){const r=this.blockAt(t,n,e);for(let a=0;a<this.placedCount;a++)if(!rr(r,this.placedRects[a],fi))return!1;if(!s)return!0;for(let a=0;a<this.statusCount;a++)if(!rr(r,this.statusRects[a],fi))return!1;return!0}plateOverlap(t,e,n){const s=this.blockAt(t,n,e);let r=0;for(let a=0;a<this.placedCount;a++)r+=v_(s,this.placedRects[a]);return r}settleStatusIcons(){for(let t=0;t<this.statusCount;t++){const e=this.statusMarks[t],n=this.statusRects[t];if(this.iconClear(n,t,0))continue;const s=this.iconSpot(e,t);s&&(n.x=s.x-e.r,n.y=s.y-e.r)}}iconClear(t,e,n){for(let s=0;s<this.placedCount;s++)if(!rr(this.placedRects[s],t,n))return!1;for(let s=0;s<e;s++)if(!rr(this.statusRects[s],t,n))return!1;return!0}iconSpot(t,e){const n=t.r;let s=0,r=0,a=Number.POSITIVE_INFINITY;const o=(c,h)=>{const f={x:c-n,y:h-n,w:n*2,h:n*2};if(!this.iconClear(f,e,fi))return;const u=c-t.homeX,d=h-t.homeY,p=u*u+d*d;p<a&&(a=p,s=c,r=h)},l=this.slotById(t.owner);if(l){const c=this.blockAt(l,l.dy,l.dx);o(c.x+c.w+fi+n,c.y+c.h/2),o(c.x-fi-n,c.y+c.h/2),o(c.x+c.w/2,c.y+c.h+fi+n),o(c.x+c.w/2,c.y-fi-n)}for(let c=2;c<=36;c+=2)o(t.homeX+c,t.homeY),o(t.homeX-c,t.homeY),o(t.homeX,t.homeY+c),o(t.homeX,t.homeY-c),o(t.homeX+c,t.homeY+c),o(t.homeX-c,t.homeY+c),o(t.homeX+c,t.homeY-c),o(t.homeX-c,t.homeY-c);return a<Number.POSITIVE_INFINITY?{x:s,y:r}:null}slotById(t){const e=this.overlayCount,n=this.labelPool;for(let s=0;s<e;s++)if(n[s].id===t)return n[s];return null}paintStatusIcons(){const t=this.ctx;t.save();for(let e=0;e<this.statusCount;e++){const n=this.statusMarks[e],s=this.statusRects[e],r=s.x+s.w/2,a=s.y+s.h/2;t.fillStyle="rgba(8, 8, 14, 0.88)",t.beginPath(),t.arc(r,a,n.r,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(220, 224, 232, 0.92)",t.lineWidth=Math.max(1,1.15*n.z),t.stroke(),t.fillStyle="#e8eef2",t.font=`bold ${Math.max(9,11*n.z)}px sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("E",r,a+.4*n.scale)}t.restore()}commitLabel(t,e,n){t.dx=e,t.dy=n;const s=this.blockAt(t,n,e);this.pushPlaced(s.x,s.y,s.w,s.h)}pushPlaced(t,e,n,s){let r=this.placedRects[this.placedCount];r||(r={x:0,y:0,w:0,h:0},this.placedRects[this.placedCount]=r),r.x=t,r.y=e,r.w=n,r.h=s,this.placedCount++}pushStatus(t,e,n,s,r,a){let o=this.statusRects[this.statusCount];o||(o={x:0,y:0,w:0,h:0},this.statusRects[this.statusCount]=o),o.x=e-s,o.y=n-s,o.w=s*2,o.h=s*2;let l=this.statusMarks[this.statusCount];l||(l={owner:"",r:0,z:1,scale:1,homeX:0,homeY:0},this.statusMarks[this.statusCount]=l),l.owner=t,l.r=s,l.z=r,l.scale=a,l.homeX=e,l.homeY=n,this.statusCount++}paintUnitRing(t){const e=this.ctx;e.save(),e.globalAlpha=.55,e.strokeStyle=t.dim?k_(t.accent):t.accent,e.lineWidth=Math.max(2,2.2*t.z),e.beginPath(),e.ellipse(t.ringX,t.ringY,t.ringRx,t.ringRy,0,0,Math.PI*2),e.stroke(),e.strokeStyle="rgba(8,8,12,0.85)",e.lineWidth=1,e.stroke(),e.restore()}paintUnitLabel(t){const e=this.ctx,n=t.dx,s=t.dy;Math.hypot(n,s)>F_&&this.paintLeader(t),e.save();const r=t.ringX+n-t.barW/2,a=t.plateY+s-t.barH;e.fillStyle="#111018",e.fillRect(r,a,t.barW,t.barH),e.fillStyle=t.accent,e.fillRect(r,a,t.barW*t.ratio,t.barH);const o=t.ringX+n-t.plateW/2,l=t.plateY+s,c=t.plateW,h=t.plateH,f=Math.min(h/2,Math.max(2,3*t.z));e.beginPath(),e.moveTo(o+f,l),e.arcTo(o+c,l,o+c,l+h,f),e.arcTo(o+c,l+h,o,l+h,f),e.arcTo(o,l+h,o,l,f),e.arcTo(o,l,o+c,l,f),e.closePath(),e.fillStyle="rgba(8, 8, 14, 0.88)",e.fill(),e.fillStyle="#e8eef2",e.font=`${t.fontPx}px sans-serif`,e.textAlign="center",e.textBaseline="alphabetic",e.fillText(t.text,t.ringX+n,t.baseline+s),e.restore()}paintLeader(t){const e=t.ringX+t.dx,n=t.plateY+t.dy+t.plateH,s=t.bodyX+t.bodyW/2,r=t.bodyY,a=this.ctx;a.save(),a.globalAlpha=.6,a.strokeStyle=t.accent,a.lineWidth=1,a.lineCap="butt",a.beginPath(),a.moveTo(e,n),a.lineTo(s,r),a.stroke(),a.restore()}drawFacingWedge(t,e,n,s,r){const a=this.ctx,o=e.heightAt(t.x,t.y),l=this.projectAt(t.x,t.y,o,t.dir,e),c=[l(0,.11,.03),l(-.035,.04,.03),l(.035,.04,.03)],h=[l(-.04,.035,.018),l(.04,.035,.018),l(.05,-.045,.018),l(0,-.015,.018),l(-.05,-.045,.018)];a.beginPath(),a.moveTo(h[0].x,h[0].y);for(let f=1;f<h.length;f++)a.lineTo(h[f].x,h[f].y);a.closePath(),a.lineJoin="round",a.strokeStyle="rgba(6,8,14,0.95)",a.lineWidth=Math.max(1.6,1.8*r),a.stroke(),a.fillStyle="#5a88c8",a.fill(),a.beginPath(),a.moveTo(c[0].x,c[0].y),a.lineTo(c[1].x,c[1].y),a.lineTo(c[2].x,c[2].y),a.closePath(),a.strokeStyle="rgba(6,8,14,0.95)",a.stroke(),a.fillStyle="#ff9a3c",a.fill()}drawVignette(){const t=this.ctx,e=t.createRadialGradient(this.w/2,this.h/2,this.h*.2,this.w/2,this.h/2,this.h*.78);e.addColorStop(0,"rgba(0,0,0,0)"),e.addColorStop(1,"rgba(0,0,0,0.45)"),t.fillStyle=e,t.fillRect(0,0,this.w,this.h)}drawFloats(t,e){const n=this.ctx,s=performance.now();for(const r of t){const a=(s-r.born)/r.life;if(a>1)continue;const o=e.heightAt(Math.round(r.x),Math.round(r.y)),l=this.worldToScreen(r.x,r.y,o);n.globalAlpha=1-a,n.font=`bold ${18*this.cam.zoom}px sans-serif`,n.textAlign="center",n.lineWidth=3,n.strokeStyle="#050508",n.fillStyle=r.color;const c=l.y-36*this.cam.zoom-a*28;n.strokeText(r.text,l.x,c),n.fillText(r.text,l.x,c),n.globalAlpha=1}}}const eu=3,nu="yejie-v1";function qc(){return{slots:[null,null,null],autosave:null}}function di(){try{const i=localStorage.getItem(nu);if(!i)return qc();const t=JSON.parse(i),e=[null,null,null];for(let s=0;s<eu;s++){const r=Array.isArray(t.slots)?t.slots[s]:null;e[s]=r&&r.v===1?r:null}const n=t.autosave&&t.autosave.v===1?t.autosave:null;return{slots:e,autosave:n}}catch{return qc()}}function Yc(i){localStorage.setItem(nu,JSON.stringify(i))}function H_(i){const t=[];i.autosave&&t.push(i.autosave);for(const e of i.slots)e&&t.push(e);return t}function $c(i){const t=H_(i);return t.length?t.reduce((e,n)=>e.savedAt>=n.savedAt?e:n):null}function z_(i){try{return new Date(i).toLocaleString("zh-Hant-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}const Kc="0.6.18",G_="20261018";function xt(i){const t=document.getElementById(i);if(!t)throw new Error(i);return t}const Aa={Mara:"./sprites/vn-mara.webp",Dana:"./sprites/vn-dana.webp",Priya:"./sprites/vn-priya.webp"},V_=1500,Zc=250,Ra=520,Ca=460,Pa="超出範圍",W_=1500,X_={striker:"突擊",controller:"控制",support:"支援",grunt:"現場",elite:"主管",civilian:"文官",delinquent:"街頭",magician:"術者",wolverine:"爪獸",boxer:"拳手",gunner:"槍手",worker:"工人"},La={street:"街道",stairs:"樓梯",roof:"屋頂"},q_={stall:"攤位",ac:"冷氣",lamp:"路燈",crate:"貨箱"},Jc={friendly:"友方",hostile:"敵對",neutral:"中立"};class Y_{constructor(t){k(this,"map");k(this,"units",[]);k(this,"phase","title");k(this,"turn",1);k(this,"selected",null);k(this,"origin",null);k(this,"originDir",0);k(this,"field",null);k(this,"moveTiles",new Set);k(this,"actionTiles",new Set);k(this,"skillTiles",new Set);k(this,"areaTiles",new Set);k(this,"areaKind",null);k(this,"forecast",null);k(this,"inspect",null);k(this,"floats",[]);k(this,"busy",!1);k(this,"log","");k(this,"missionIndex",0);k(this,"loseKind","wipe");k(this,"intel","M");k(this,"power","M");k(this,"inventory",tn(Pi));k(this,"missionStartInventory",tn(Pi));k(this,"pendingItem",null);k(this,"m1DropGiven",!1);k(this,"modalKind","off");k(this,"paused",!1);k(this,"pauseOpen",!1);k(this,"vnOpen",!1);k(this,"vnDone",null);k(this,"introPlayed",new Set);k(this,"m1MidBeatPlayed",!1);k(this,"renderer");k(this,"input");k(this,"hudTurn",xt("hud-turn"));k(this,"hudPhase",xt("hud-phase"));k(this,"hudSub",xt("hud-sub"));k(this,"chip",xt("unit-chip"));k(this,"chipMark",xt("chip-mark"));k(this,"chipName",xt("chip-name"));k(this,"chipMeta",xt("chip-meta"));k(this,"chipExtra",xt("chip-extra"));k(this,"chipHp",xt("chip-hp"));k(this,"chipHpFill",xt("chip-hp-fill"));k(this,"forecastEl",xt("forecast"));k(this,"logEl",xt("log"));k(this,"title",xt("title"));k(this,"briefing",xt("briefing"));k(this,"result",xt("result"));k(this,"resultKicker",xt("result-kicker"));k(this,"resultTitle",xt("result-title"));k(this,"resultBody",xt("result-body"));k(this,"modal",xt("modal"));k(this,"modalKicker",xt("modal-kicker"));k(this,"modalTitle",xt("modal-title"));k(this,"modalBody",xt("modal-body"));k(this,"confirmEl",xt("confirm"));k(this,"confirmText",xt("confirm-text"));k(this,"btnCancel",xt("btn-cancel"));k(this,"btnWait",xt("btn-wait"));k(this,"btnSkill",xt("btn-skill"));k(this,"btnConfirm",xt("btn-confirm"));k(this,"dockEl",xt("dock"));k(this,"btnEnd",xt("btn-end"));k(this,"btnNext",xt("btn-next"));k(this,"btnRotate",xt("btn-rotate"));k(this,"btnPause",xt("btn-pause"));k(this,"btnBag",xt("btn-bag"));k(this,"btnContinue",xt("btn-continue"));k(this,"btnMute",xt("btn-mute"));k(this,"btnPauseNext",xt("btn-pause-next"));k(this,"pauseEl",xt("pause"));k(this,"vn",xt("vn"));k(this,"vnBust",xt("vn-bust"));k(this,"vnPortraits",{Mara:new Image,Dana:new Image,Priya:new Image});k(this,"vnBox",xt("vn-box"));k(this,"vnName",xt("vn-name"));k(this,"vnText",xt("vn-text"));k(this,"titleBuild",xt("title-build"));k(this,"camHint",xt("cam-hint"));k(this,"pendingSlot",null);k(this,"pendingQuit",!1);k(this,"pendingJump",null);k(this,"acting",!1);k(this,"forecastGen",0);k(this,"confirmPressGen",-1);k(this,"pendingTap",null);k(this,"rangeHintTimer",0);this.preloadVnPortraits(),this.renderer=new B_(t),f_(),this.input=new Du(t,this.renderer),this.input.onTap=(e,n)=>this.onTap(e,n),this.map=new Hr(this.mission.map),this.resetBattle(),this.phase="title",this.briefing.hidden=!0,this.title.hidden=!1,window.addEventListener("resize",()=>this.renderer.resize()),xt("btn-start").addEventListener("click",()=>this.begin()),xt("btn-restart").addEventListener("click",()=>this.restart()),this.btnNext.addEventListener("click",()=>this.nextMission()),this.btnCancel.addEventListener("click",()=>this.cancel()),this.btnWait.addEventListener("click",()=>void this.wait()),this.btnSkill.addEventListener("click",()=>this.armSkill()),this.btnConfirm.addEventListener("pointerdown",e=>{e.button===0&&(e.stopPropagation(),this.pressConfirm())}),this.btnConfirm.addEventListener("keydown",e=>{e.key!=="Enter"&&e.key!==" "||e.repeat||(e.preventDefault(),e.stopPropagation(),this.pressConfirm())}),this.btnConfirm.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),(e.detail===0||this.confirmPressGen===this.forecastGen)&&this.pressConfirm()}),this.btnEnd.addEventListener("click",()=>void this.endTurn()),this.btnRotate.addEventListener("click",()=>this.rotateMap()),this.btnPause.addEventListener("click",()=>this.openPause()),this.btnBag.addEventListener("click",()=>this.openBagFromHud()),xt("btn-new").addEventListener("click",()=>this.newGame()),this.btnContinue.addEventListener("click",()=>this.continueGame()),xt("btn-load").addEventListener("click",()=>this.openSaves("load")),xt("btn-bag-title").addEventListener("click",()=>this.openBag()),xt("btn-refresh").addEventListener("click",()=>void this.refreshApp()),xt("btn-brief-title").addEventListener("click",()=>this.goTitle()),xt("btn-result-title").addEventListener("click",()=>this.goTitle()),xt("btn-resume").addEventListener("click",()=>this.closePause()),xt("btn-pause-save").addEventListener("click",()=>this.openSaves("save")),xt("btn-pause-load").addEventListener("click",()=>this.openSaves("load")),this.btnMute.addEventListener("click",()=>this.toggleMute()),this.btnPauseNext.addEventListener("click",()=>this.requestNextMission()),this.vn.addEventListener("click",()=>this.advanceVn()),this.vn.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.advanceVn())}),document.addEventListener("keydown",e=>{if(!(e.key!=="Escape"||e.repeat)){if(!this.confirmEl.hidden){e.preventDefault(),this.confirmNo();return}if(this.modalKind!=="off"){e.preventDefault(),this.closeModal();return}if(this.pauseOpen){e.preventDefault(),this.closePause();return}this.vnOpen||!this.title.hidden||!this.briefing.hidden||this.playable()&&(e.preventDefault(),this.cancel())}}),document.querySelectorAll("[data-test-mission]").forEach(e=>{e.addEventListener("click",()=>this.jumpToMission(Number(e.dataset.testMission)))}),xt("btn-quit-title").addEventListener("click",()=>this.quitToTitle()),xt("modal-close").addEventListener("click",()=>this.closeModal()),xt("confirm-yes").addEventListener("click",()=>this.confirmYes()),xt("confirm-no").addEventListener("click",()=>this.confirmNo()),this.bindSeg("seg-intel",e=>{this.intel=e}),this.bindSeg("seg-power",e=>{this.power=e}),this.modalBody.addEventListener("click",e=>this.onModalClick(e)),this.titleBuild.textContent=`版本 ${Kc}　${G_}`,this.syncMuteBtn(),jt.setBgm("title"),this.refreshContinue(),this.installDebugHook()}get mission(){return ai[this.missionIndex]??ai[0]}async waitMs(t){const e=performance.now()+t;for(;performance.now()<e;){for(;this.paused;)await Nr(40);const n=e-performance.now();if(n<=0)break;await Nr(Math.min(40,n))}}start(){const t=/(?:^|[?&])shot(?:=|$|&)/.test(location.search)||location.hash.includes("shot"),e=()=>{this.floats=this.floats.filter(s=>performance.now()-s.born<s.life),this.renderer.draw(this.map,this.units,{move:this.phase==="select"?this.moveTiles:new Set,area:this.overlayArea(),hot:this.overlayHot(),areaKind:this.overlayKind(),selected:this.selected,target:this.forecast?.target??null,inspect:this.inspectPos(),phase:this.phase},this.floats)};this.syncUi(),(()=>{if(t){this.renderer.forceSize(390,640),this.renderer.centerOn(this.units,this.map);for(let a=0;a<8;a++)e();const r=document.createElement("img");r.alt="board",r.src=this.renderer.canvas.toDataURL("image/png"),r.style.cssText="position:absolute;left:0;right:0;top:48px;width:100%;height:auto;z-index:1;pointer-events:none",this.renderer.canvas.insertAdjacentElement("afterend",r);return}const s=()=>{e(),this.flushPendingTap(),requestAnimationFrame(s)};requestAnimationFrame(s)})()}applyHash(){const t=location.hash.replace("#","");if(t==="inv"){this.openBag();return}if(t==="save"){this.openSaves("load");return}if(t==="m3"||t==="play3"){if(this.missionIndex=2,this.resetBattle(),this.title.hidden=!0,t==="m3"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(t==="m4"||t==="play4"){if(this.missionIndex=3,this.resetBattle(),this.title.hidden=!0,t==="m4"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(t==="m5"||t==="play5"){if(this.missionIndex=4,this.resetBattle(),this.title.hidden=!0,t==="m5"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(t==="m2"||t==="play2"||t==="inspect"||t==="play2rot"){if(this.missionIndex=1,this.resetBattle(),this.title.hidden=!0,t==="m2"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin(),t==="play2rot"&&(this.renderer.yaw=Math.PI/2,this.renderer.centerOn(this.units,this.map));const e=this.units.find(n=>n.id==="dana");if(e&&t!=="inspect"&&(e.acted=!0),t==="inspect"){const n=this.units.find(s=>s.id==="beckett")??this.units.find(s=>s.team==="enemy");n&&(this.inspect={kind:"unit",unit:n},this.syncUi())}else{const n=this.units.find(s=>s.id==="mara");n&&this.selectUnit(n)}return}if(t==="play"||t==="brief"){if(this.title.hidden=!0,this.resetBattle(),t==="brief"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();const e=this.units.find(s=>s.id==="mara");e&&this.selectUnit(e);const n=this.units.find(s=>s.id==="dana");n&&(n.acted=!0)}}bindSeg(t,e){const n=xt(t);n.addEventListener("click",s=>{const r=s.target.closest("button");if(!r)return;const a=r.getAttribute("data-v");if(!(a!=="L"&&a!=="M"&&a!=="H")){for(const o of n.querySelectorAll("button"))o.classList.toggle("on",o===r);e(a)}})}inspectPos(){const t=this.inspect;if(!t)return null;if(t.kind==="unit")return{x:t.unit.x,y:t.unit.y};if(t.kind==="object"){const e=this.map.objects.find(n=>n.id===t.id);return e?{x:e.x,y:e.y}:null}return{x:t.tile.x,y:t.tile.y}}fillBriefing(){const t=this.mission;xt("brief-num").textContent=t.number,xt("brief-loc").textContent=t.loc;const e=xt("brief-body");e.innerHTML="";for(const o of t.paragraphs){const l=document.createElement("p");l.textContent=o,e.appendChild(l)}const n=xt("brief-conds");n.innerHTML="";const s=document.createElement("li");s.innerHTML="<span>勝利</span>",s.append(t.winCond);const r=document.createElement("li");r.innerHTML="<span>失敗</span>",r.append(t.loseCond),n.append(s,r);const a=xt("brief-voices");a.innerHTML="";for(const o of t.voices){const l=document.createElement("p"),c=document.createElement("b");c.textContent=o.name,l.append(c,`「${o.line}」`),a.appendChild(l)}this.hudSub.textContent=t.hudSub}preloadVnPortraits(){for(const t of Object.keys(Aa)){const e=this.vnPortraits[t];e.decoding="async","fetchPriority"in e&&(e.fetchPriority="high"),e.src=Aa[t]}}portraitSettled(t){return t.complete&&t.naturalWidth===0?Promise.resolve():t.decode().then(()=>{},()=>{})}waitForSpeakerPortrait(t){const e=Promise.all([this.portraitSettled(this.vnPortraits[t]),this.portraitSettled(this.vnBust)]).then(()=>{});return Promise.race([e,Nr(V_)])}setVnBust(t){const e=this.vnBust;e.style.visibility="",e.onerror=()=>{if(!e.src.includes("?r=")){e.src=`${t}?r=${Date.now()}`;return}e.style.visibility="hidden"},e.onload=()=>{e.naturalWidth===0&&(e.style.visibility="hidden")},e.src=t}showVn({speaker:t,side:e,text:n}){return this.clearPendingTap(),this.vnOpen=!0,this.vn.classList.toggle("right",e==="right"),this.vn.classList.toggle("left",e!=="right"),this.vnBust.decoding="async","fetchPriority"in this.vnBust&&(this.vnBust.fetchPriority="high"),this.setVnBust(Aa[t]),this.vnBust.alt="",this.vnName.textContent=t,this.vnText.textContent=n,this.waitForSpeakerPortrait(t).then(()=>(this.vn.hidden=!1,this.syncUi(),new Promise(s=>{this.vnDone=s,this.vnBox.focus({preventScroll:!0})})))}advanceVn(){const t=this.vnDone;t&&(this.vnDone=null,this.vnOpen=!1,this.vn.hidden=!0,this.vnBust.onerror=null,this.vnBust.removeAttribute("src"),t(),this.syncUi())}async playMissionIntro(){if(this.missionIndex<0||this.missionIndex>=ai.length||this.introPlayed.has(this.missionIndex))return;this.introPlayed.add(this.missionIndex);const t=["left","right","left"],e=this.mission.voices.slice(0,3).map((n,s)=>({speaker:n.name,side:t[s]??"left",text:n.line}));for(const n of e)await this.showVn(n)}resetBattle(){const t=this.mission;this.map=new Hr(t.map),this.units=[...pl(t.starts),...t.makeOthers()];for(const e of this.units)Su(e,this.power);this.phase="briefing",this.turn=1,this.clearSel(),this.inspect=null,this.busy=!1,this.acting=!1,this.clearPendingTap(),this.loseKind="wipe",this.pendingItem=null,this.introPlayed.delete(this.missionIndex),this.m1MidBeatPlayed=!1,this.vnOpen=!1,this.vnDone=null,this.vn.hidden=!0,this.log="點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放並旋轉，上下俯仰。",this.renderer.yaw=0,this.renderer.setPitch(Ss),this.renderer.centerOn(this.units,this.map),this.fillBriefing()}newGame(){this.missionIndex=0,this.inventory=tn(Pi),this.missionStartInventory=tn(Pi),this.m1DropGiven=!1,this.resetBattle(),this.title.hidden=!0,this.briefing.hidden=!1,this.phase="briefing",jt.setBgm("title"),this.syncUi(),this.autosave()}continueGame(){const t=$c(di());t&&this.applySave(t)}async begin(){this.missionStartInventory=tn(this.inventory),this.briefing.hidden=!0,this.title.hidden=!0,this.phase="select",jt.setBgm("battle"),this.applyDebugBattleScenario(),this.missionIndex===0?this.renderer.centerOn(this.units,this.map):this.renderer.fitToMap(this.map),this.busy=!this.introPlayed.has(this.missionIndex),this.syncUi(),this.autosave(),this.busy&&await this.playMissionIntro(),this.clearPendingTap(),this.busy=!1,this.applyDebugBattleScenario(),this.syncUi(),this.autosave()}restart(){this.inventory=tn(this.missionStartInventory),this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi()}nextMission(){this.missionIndex>=ai.length-1||(this.missionIndex+=1,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi(),this.autosave())}rotateMap(){this.phase==="briefing"||this.phase==="title"||this.renderer.rotate(this.map)}clearSel(){this.selected=null,this.origin=null,this.field=null,this.moveTiles.clear(),this.actionTiles.clear(),this.skillTiles.clear(),this.areaTiles.clear(),this.areaKind=null,this.forecast=null,this.pendingItem=null,this.bumpForecast()}locked(){const t=this.selected;return!!t&&t.movedThisTurn}selectUnit(t){t.team!=="player"||t.acted||t.dead||t.npc||(this.selected=t,t.movedThisTurn||(this.origin=null),this.forecast=null,this.clearPendingTap(),this.inspect=null,this.pendingItem=null,this.showCommand(t))}refreshRanges(t){if(this.skillTiles.clear(),t.movedThisTurn?(this.field=null,this.moveTiles.clear()):(this.field=Ps(t,this.map,this.units),this.moveTiles=new Set([...this.field.cost.keys()].filter(e=>e!==Ht(t.x,t.y)))),t.actedThisTurn)this.actionTiles=new Set,this.areaTiles=new Set,this.areaKind=null;else{this.actionTiles=Eu(t,this.map,this.units);for(const e of this.map.objects)e.gone||e.kind!=="destructible"||Zi(t,t.x,t.y,e.x,e.y,this.map)&&this.actionTiles.add(Ht(e.x,e.y));this.areaTiles=cr(t,this.map),this.areaKind="attack"}}overlayArea(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"?this.areaTiles:new Set}overlayHot(){return this.phase==="itemAim"?this.skillTiles:this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?this.skillTiles:this.phase==="select"||this.phase==="forecast"?this.actionTiles:new Set}overlayKind(){return this.phase==="itemAim"?"item":this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?"skill":this.phase==="select"||this.phase==="forecast"?this.areaKind:null}canStillMove(t){return this.phase==="enemy"?!1:t.team==="player"&&!t.dead&&!t.npc&&!t.acted&&!t.movedThisTurn}commandHint(t){const e=[];return this.canStillMove(t)&&e.push("可移動"),!t.acted&&!t.actedThisTurn&&e.push("可攻擊／技能／道具"),e.length?e.join("　"):"結束或待機"}hintForCurrentState(){if(this.phase==="enemy")return"敵軍行動中";const t=this.selected;return this.phase==="skillAim"&&t?t.skillHint:this.phase==="itemAim"&&this.pendingItem?`${oi[this.pendingItem].name}　選我軍單位`:this.phase==="select"&&t?this.commandHint(t):"我軍階段"}scrubHints(){if(!(this.phase==="select"||this.phase==="skillAim"||this.phase==="itemAim"||this.phase==="forecast"||this.phase==="enemy"))return;const e=this.phase!=="forecast"&&this.log.startsWith("預覽"),n=this.log.includes("可移動")&&!(this.phase==="select"&&this.selected&&this.canStillMove(this.selected));!e&&!n||(this.log=this.hintForCurrentState())}showCommand(t){if(this.phase==="enemy"){this.log="敵軍行動中",this.syncUi();return}this.forecast=null,this.bumpForecast(),this.refreshRanges(t),this.phase="select",this.log=this.commandHint(t),this.syncUi()}async commitMove(t){const e=this.selected;if(this.inputMode()!=="move"||this.phase!=="select"||!e||!this.field||this.busy||e.movedThisTurn)return;const n=Ht(t.x,t.y);if(!this.field.cost.has(n)||t.x===e.x&&t.y===e.y)return;this.busy=!0,jt.play("move"),this.origin={x:e.x,y:e.y},this.originDir=e.dir;const s=this.clampPathEnd(e,ni(this.field,t));e.anim="walk",e.animStart=performance.now();for(let r=1;r<s.length;r++)e.x=s[r].x,e.y=s[r].y,await this.waitMs(Zc);if(s.length>1&&(e.dir=as(s[s.length-2],s[s.length-1])),e.x=Math.round(e.x),e.y=Math.round(e.y),e.anim="idle",e.movedThisTurn=!0,this.tryPickup(e),this.setIdle(),e.actedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}clearPendingTap(){this.pendingTap=null}bumpForecast(){this.forecastGen+=1,this.confirmPressGen=-1}pressConfirm(){this.btnConfirm.disabled||this.phase!=="forecast"||!this.forecast||this.busy||this.acting||(this.confirmPressGen=this.forecastGen,this.confirm())}openForecast(t){this.forecast=t,this.phase="forecast",this.bumpForecast(),this.clearPendingTap(),this.log=t.detail,this.inspect=null,this.syncUi()}pendingTapReady(){return this.playable()&&!this.pauseOpen&&!this.vnOpen&&this.modalKind==="off"&&this.confirmEl.hidden}setIdle(){this.busy=!1}inputMode(){return this.phase==="itemAim"?"item-target":this.phase==="skillAim"?"skill-target":this.phase==="forecast"&&this.forecast?this.forecast.kind==="skill"?"skill-target":"attack-target":this.phase==="select"&&this.selected&&!this.selected.movedThisTurn?"move":"normal"}pointInEl(t,e){const n=e.getBoundingClientRect();return n.width<=0||n.height<=0?!1:t.x>=n.left&&t.x<n.right&&t.y>=n.top&&t.y<n.bottom}releaseHitsHud(t){const e=[this.dockEl,this.btnCancel,this.btnWait,this.btnSkill,this.btnEnd,this.btnRotate,this.btnBag,this.btnPause];for(const n of e)if(this.pointInEl(t,n))return!0;return!this.forecastEl.hidden&&this.pointInEl(t,this.forecastEl)}noteSelectTap(t){if(this.pendingTap=null,!this.playable()||this.vnOpen||this.pauseOpen)return;const e=this.phase==="forecast"&&(this.busy||this.acting);if(this.phase!=="select"&&!e)return;if(!e){const s=this.inputMode();if(s==="skill-target"||s==="attack-target"||s==="item-target")return}const n=this.renderer.hitUnit(t.x,t.y,this.map,this.units);!n||n.dead||n.team!=="player"||n.npc||n.acted||!e&&this.selected&&this.locked()&&this.selected.id!==n.id||(this.pendingTap={p:{x:t.x,y:t.y}})}tapOnSelected(t,e){const n=this.selected;if(!n||n.dead)return!1;if(e)return e.id===n.id;const s=this.renderer.bodyStamps.get(n.id);if(!s||!(s.dw>0)||!(s.dh>0))return!1;const r=1;if(t.x<s.dx-r||t.y<s.dy-r||t.x>s.dx+s.dw+r||t.y>s.dy+s.dh+r)return!1;const a=this.renderer.hitTile(t.x,t.y,this.map);if(!a)return!0;const o=this.unitAt(a.x,a.y);if(o)return o.id===n.id;const l=this.map.objAt(a.x,a.y);return!l||l.gone}flushPendingTap(){const t=this.pendingTap;if(!t||this.busy||this.acting)return;if(this.phase!=="select"||!this.pendingTapReady()){this.phase!=="select"&&this.pendingTapReady()&&(this.pendingTap=null);return}this.pendingTap=null;const e=this.renderer.hitUnit(t.p.x,t.p.y,this.map,this.units),n=this.selected;if(n&&this.tapOnSelected(t.p,e)){this.refreshRanges(n);return}!e||e.dead||e.team!=="player"||e.npc||e.acted||this.selected&&this.locked()&&this.selected.id!==e.id||this.selectUnit(e)}onTap(t,e){if(this.pauseOpen||this.vnOpen)return;if(this.pointInEl(e,this.btnConfirm)){this.pressConfirm();return}if(this.releaseHitsHud(e))return;if(this.busy||this.acting){this.noteSelectTap(t);return}if(this.phase==="forecast"&&this.forecast&&this.forecastGen>0&&this.confirmPressGen===this.forecastGen||(this.pendingTap=null,this.phase==="title"||this.phase==="briefing"||this.phase==="enemy"||this.phase==="victory"||this.phase==="defeat"))return;this.dismissRangeHint();const s=this.phase==="select"||this.phase==="forecast"||this.phase==="skillAim"||this.phase==="itemAim"?this.renderer.hitUnit(t.x,t.y,this.map,this.units):null,r=s?{x:s.x,y:s.y}:this.renderer.hitTile(t.x,t.y,this.map);if(this.phase==="forecast"){(!r||!this.forecast||r.x!==this.forecast.target.x||r.y!==this.forecast.target.y)&&this.backFromForecast();return}if(this.phase==="skillAim"){r?this.trySkillTarget(r):this.backFromSkill();return}if(this.phase==="itemAim"){r?this.tryItemTarget(r):this.backFromItem();return}if(this.phase!=="select")return;if(!r){if(this.inspect){this.inspect=null,this.syncUi();return}this.selected&&!this.locked()&&(this.clearSel(),this.syncUi());return}const a=this.unitAt(r.x,r.y),o=this.selected,l=this.map.objAt(r.x,r.y);if(o&&!o.actedThisTurn&&a&&this.actionTiles.has(Ht(a.x,a.y))){this.openForecast(Na(o,a,this.map));return}if(o&&!o.actedThisTurn&&l&&!l.gone&&l.kind==="destructible"&&this.actionTiles.has(Ht(l.x,l.y))){this.openForecast({kind:"object",actor:o,target:o,label:`${o.name} → ${l.label}`,detail:l.type==="barrel"?`破壞油桶　鄰格受到 ${Br} 傷害`:"破壞此物",dmg:Math.max(1,o.atk+(o.atkBuff||0)),heal:0,skip:!1,face:"front",objectId:l.id});return}if(o&&l&&!l.gone&&Math.abs(o.x-l.x)+Math.abs(o.y-l.y)<=1){if(l.kind==="pickup"){this.tryPickupAt(o,l);return}if(l.kind==="trigger"&&!l.used&&!o.actedThisTurn){this.useTrigger(o,l);return}}if(o&&(this.tapOnSelected(t,s)||!s&&a?.id===o.id)){this.refreshRanges(o);return}if(this.inputMode()==="move"&&o&&!o.movedThisTurn&&this.moveTiles.has(Ht(r.x,r.y))&&(!a||a.id===o.id)){if(a&&a.id===o.id){this.inspectUnit(a);return}this.inspect=null,this.commitMove(r);return}if(a&&a.team==="player"&&!a.acted&&!a.npc&&(!o||!this.locked())){this.selectUnit(a);return}if(o&&!o.actedThisTurn&&a&&this.attackOutOfRange(o,a)){this.flashOutOfRange();return}a?this.inspectUnit(a):l&&!l.gone?this.inspectObject(l.id):o&&!this.locked()?(this.inspect=null,this.clearSel(),this.syncUi()):this.inspectTile(this.map.tile(r.x,r.y))}inspectUnit(t){this.inspect={kind:"unit",unit:t},this.log=`${t.name}　${Jc[ei(t)]}`,this.syncUi()}inspectTile(t){this.inspect={kind:"tile",tile:t},this.log=La[t.terrain],this.syncUi()}inspectObject(t){this.inspect={kind:"object",id:t};const e=this.map.objects.find(n=>n.id===t);this.log=e?e.label:"",this.syncUi()}trySkillTarget(t){const e=this.selected;if(!e)return;const s=Ua(e,this.map,this.units).find(r=>r.x===t.x&&r.y===t.y);if(s){this.openForecast(_l(e,s,this.map));return}if(this.unitAt(t.x,t.y)){this.flashOutOfRange();return}jt.play("miss"),this.backFromSkill()}attackOutOfRange(t,e){return e.dead||e.id===t.id?!1:(Io(t,e)||t.team==="player"&&!t.npc&&e.stance!=="friendly")&&!this.actionTiles.has(Ht(e.x,e.y))}flashOutOfRange(){this.rangeHintTimer&&window.clearTimeout(this.rangeHintTimer),this.inspect=null,this.log=Pa,jt.play("miss"),this.rangeHintTimer=window.setTimeout(()=>{this.rangeHintTimer=0,this.log===Pa&&(this.log=this.hintForCurrentState(),this.syncUi())},W_),this.syncUi()}dismissRangeHint(){this.rangeHintTimer&&(window.clearTimeout(this.rangeHintTimer),this.rangeHintTimer=0),this.log===Pa&&(this.log=this.hintForCurrentState(),this.syncUi())}tryItemTarget(t){const e=kr(this.units).find(n=>n.x===t.x&&n.y===t.y);if(!e){jt.play("miss"),this.backFromItem();return}this.applyItem(e)}backFromForecast(){const t=this.selected,e=!!t&&this.skillTiles.size>0&&this.forecast?.kind==="skill";if(this.forecast=null,this.bumpForecast(),this.clearPendingTap(),!t){this.phase="select",this.log=this.hintForCurrentState(),this.syncUi();return}if(e){this.phase="skillAim",this.log=t.skillHint,this.syncUi();return}this.showCommand(t)}backFromSkill(){this.skillTiles.clear(),this.forecast=null,this.bumpForecast(),this.clearPendingTap(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}backFromItem(){this.pendingItem=null,this.skillTiles.clear(),this.forecast=null,this.bumpForecast(),this.clearPendingTap(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}cancel(){if(!this.busy){if(this.dismissRangeHint(),this.clearPendingTap(),this.phase==="forecast"){this.backFromForecast();return}if(this.phase==="skillAim"){this.backFromSkill();return}if(this.phase==="itemAim"){this.backFromItem();return}if(this.inspect){this.inspect=null,this.syncUi();return}if(this.selected&&this.origin&&this.selected.movedThisTurn){this.selected.x=this.origin.x,this.selected.y=this.origin.y,this.selected.dir=this.originDir,this.selected.movedThisTurn=!1,this.origin=null,this.showCommand(this.selected);return}this.selected&&!this.locked()&&(this.clearSel(),this.phase="select",this.syncUi())}}armSkill(){const t=this.selected;if(!t||this.busy||t.skillUsed||!t.skillName||t.actedThisTurn||this.phase!=="select"&&this.phase!=="skillAim")return;const e=Ua(t,this.map,this.units);this.skillTiles=new Set(e.map(n=>Ht(n.x,n.y))),this.areaTiles=wu(t,this.map),this.areaKind="skill",this.actionTiles.clear(),this.moveTiles.clear(),this.forecast=null,this.bumpForecast(),this.clearPendingTap(),this.inspect=null,this.phase="skillAim",this.log=t.skillHint,this.syncUi()}async wait(){!this.selected||this.busy||this.phase==="select"&&await this.finishUnit()}async confirm(){if(this.phase!=="forecast"||!this.forecast||this.busy||this.acting)return;const t=this.forecast;this.acting=!0,this.busy=!0,this.clearPendingTap(),this.syncUi();const e=t.actor;if(t.kind==="object"&&t.objectId){const r=this.map.objects.find(a=>a.id===t.objectId);if(!r||r.gone){this.acting=!1,this.forecast=null,this.bumpForecast(),this.setIdle(),this.showCommand(e);return}if(e.dir=as(e,r),e.anim="attack",e.animStart=performance.now(),e.lunge=1,jt.play("attack"),await this.waitMs(gr),r.hp=Math.max(0,r.hp-t.dmg),jt.play("hit"),this.spawnFloat(e,`${t.dmg}`,"#ffd0d8"),this.log=`${e.name} 攻擊 ${r.label}`,e.atkBuff&&(e.atkBuff=0),r.hp<=0&&(r.gone=!0,this.log=`${r.label} 被破壞。`,r.type==="barrel"&&this.blastBarrel(r.x,r.y)),e.actedThisTurn=!0,e.lunge=0,e.anim="idle",await this.waitMs(Ra),this.forecast=null,this.bumpForecast(),this.acting=!1,this.setIdle(),this.checkEnd())return;if(e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave();return}const n=t.target;n.stance==="neutral"&&!t.heal&&xl(n),e.dir=as(e,n);const s=t.kind==="skill"&&(e.skillKind==="spark"||e.skillKind==="heal"||e.skillKind==="halt");if(e.anim=s?"cast":"attack",e.animStart=performance.now(),e.lunge=1,t.heal?jt.play("heal"):jt.play(t.kind==="skill"?"skill":"attack"),await this.waitMs(s?xr:gr),t.heal){const r=n.hp;n.hp=Math.min(n.maxHp,n.hp+t.heal);const a=n.hp-r;this.spawnFloat(n,`+${a}`,"#7dffb3"),this.log=`${e.name} 為 ${n.name} 回復 ${a}　生命 ${r} → ${n.hp} / ${n.maxHp}`,this.syncUi()}else n.hp=Math.max(0,n.hp-t.dmg),jt.play("hit"),this.spawnFloat(n,`${t.dmg}`,"#ffd0d8"),this.log=`${e.name} 對 ${n.name} 造成 ${t.dmg} 傷害`,e.atkBuff&&(e.atkBuff=0),t.skip&&(n.skipNext=!0,this.log+="　攔住生效"),n.hp<=0&&(n.dead=!0,this.spawnFloat(n,"倒下","#ff8aa0"),this.log=`${n.name} 倒下。`,this.tryEnemyDrop(n)),this.syncUi();if(t.kind==="skill"&&(e.skillUsed=!0),e.actedThisTurn=!0,e.lunge=0,e.anim="idle",await this.waitMs(Ra),this.forecast=null,this.skillTiles.clear(),this.bumpForecast(),this.acting=!1,this.setIdle(),!this.checkEnd()){if(e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}async finishUnit(){if(this.busy=!0,this.selected&&(this.selected.acted=!0,this.selected.lunge=0),this.clearSel(),this.inspect=null,this.phase="select",this.syncUi(),await this.waitMs(Ra),this.missionIndex===0&&!this.m1MidBeatPlayed&&this.mission.midBeats?.length){this.m1MidBeatPlayed=!0;for(const t of this.mission.midBeats)await this.showVn(t)}this.setIdle(),this.syncUi(),this.autosave(),this.units.filter(t=>t.team==="player"&&!t.dead&&!t.acted&&!t.npc).length===0&&await this.endTurn()}async endTurn(){if(!this.busy){for(const t of this.units)t.team==="player"&&!t.dead&&!t.npc&&(t.acted=!0);this.clearSel(),this.inspect=null,this.clearPendingTap(),this.phase="enemy",this.log="敵軍行動中",this.syncUi(),await this.waitMs(Ca),await this.runEnemy()}}async runEnemy(){this.busy=!0;const t=this.units.filter(n=>!n.dead&&!Ia(n)),e=this.mission.protectId;for(let n=0;n<t.length;n++){const s=t[n];if(this.phase==="victory"||this.phase==="defeat")break;if(s.skipNext){s.skipNext=!1,s.acted=!0,this.log=`${s.name} 被攔住，無法行動。`,this.syncUi(),await this.waitMs(420),n<t.length-1&&await this.waitMs(Ca);continue}const r=Ru(s,this.map,this.units,e,this.intel),a=this.clampPathEnd(s,r.path);a.length>1&&(s.anim="walk",s.animStart=performance.now());for(let o=1;o<a.length;o++)s.x=a[o].x,s.y=a[o].y,await this.waitMs(Zc);if(a.length>1&&(s.dir=as(a[a.length-2],a[a.length-1])),s.x=Math.round(s.x),s.y=Math.round(s.y),s.anim="idle",this.tryPickup(s),r.target&&!r.target.dead){s.dir=as(s,r.target);const o=r.useSkill&&!s.skillUsed?_l(s,r.target,this.map):Na(s,r.target,this.map),l=o.kind==="skill"&&(s.skillKind==="spark"||s.skillKind==="heal"||s.skillKind==="halt");if(s.anim=l?"cast":"attack",s.animStart=performance.now(),s.lunge=1,jt.play(o.kind==="skill"?"skill":"attack"),await this.waitMs(l?xr:gr),o.heal?(r.target.hp=Math.min(r.target.maxHp,r.target.hp+o.heal),this.spawnFloat(r.target,`+${o.heal}`,"#7dffb3"),this.log=`${s.name} 為 ${r.target.name} 回復 ${o.heal}`):(r.target.stance==="neutral"&&xl(r.target),r.target.hp=Math.max(0,r.target.hp-o.dmg),jt.play("hit"),this.spawnFloat(r.target,`${o.dmg}`,"#ff4d6d"),this.log=`${s.name} 對 ${r.target.name} 造成 ${o.dmg} 傷害`,o.skip&&(r.target.skipNext=!0),r.target.hp<=0&&(r.target.dead=!0,this.spawnFloat(r.target,"倒下","#ff8aa0"),this.log=`${r.target.name} 倒下。`,this.tryEnemyDrop(r.target))),o.kind==="skill"&&(s.skillUsed=!0),await this.waitMs(120),s.lunge=0,s.anim="idle",this.checkEnd()){this.busy=!1;return}}else await this.waitMs(80);s.acted=!0,n<t.length-1&&await this.waitMs(Ca)}for(const n of this.units)n.acted=!1,n.skillUsed=!1,n.movedThisTurn=!1,n.actedThisTurn=!1,n.anim="idle";this.turn+=1,this.phase="select",this.clearPendingTap(),this.busy=!1,this.log="我軍階段",this.syncUi(),this.autosave()}checkEnd(){const t=this.mission.protectId;return t&&this.units.find(s=>s.id===t)?.dead?(this.loseKind="protect",this.lose(),!0):this.units.find(n=>n.id===this.mission.eliteId)?.dead?(this.win(),!0):this.units.every(n=>n.team!=="player"||n.dead||n.npc)?(this.loseKind="wipe",this.lose(),!0):!1}debugHooksEnabled(){return new URLSearchParams(location.search).get("debug")==="1"}applyDebugBattleScenario(){if(!this.debugHooksEnabled()||new URLSearchParams(location.search).get("scenario")!=="heal"||this.mission.id!=="m1"||this.phase!=="select")return;const t=this.units.find(c=>c.id==="priya"),e=this.units.find(c=>c.id==="mara"),n=this.units.find(c=>c.id==="dana");if(!t||!e||!n)return;const s={x:4,y:10},r={x:5,y:10},a={x:7,y:10},o=[s,r,a],l=new Set(["priya","mara","dana"]);for(const c of o){const h=this.map.tile(c.x,c.y);if(!h||h.h!==0||!this.map.walkable(c.x,c.y)||this.units.some(u=>!u.dead&&!l.has(u.id)&&u.x===c.x&&u.y===c.y))return}t.x=s.x,t.y=s.y,e.x=r.x,e.y=r.y,n.x=a.x,n.y=a.y,e.hp=Math.max(1,Math.floor(e.maxHp/2));for(const c of[t,e,n])c.acted=!1,c.skillUsed=!1,c.movedThisTurn=!1,c.actedThisTurn=!1,c.dead=!1;this.renderer.centerOn(this.units,this.map),this.selectUnit(t)}installDebugHook(){this.debugHooksEnabled()&&(window.__yejieDebug={forceWin:()=>{this.win()},tileAtScreen:(t,e)=>this.renderer.tileAtScreen(t,e,this.map),screenOfTile:(t,e)=>this.renderer.screenOfTile(t,e,this.map)})}win(){const t=this.mission;this.phase="victory",this.clearPendingTap(),this.busy=!1,this.closePause(),jt.setBgm(null),jt.play("victory"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.remove("lose"),this.resultKicker.textContent="勝利",this.resultTitle.textContent=t.winTitle;let e=t.winBody;this.missionIndex===0&&!this.m1DropGiven&&(Or(this.inventory,"bandage",1),this.m1DropGiven=!0,e=`${t.winBody}又找到一盒繃帶。`),this.resultBody.textContent=e,this.btnNext.hidden=this.missionIndex>=ai.length-1,this.syncUi(),this.autosave()}lose(){const t=this.mission;this.phase="defeat",this.clearPendingTap(),this.busy=!1,this.closePause(),jt.setBgm(null),jt.play("defeat"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.add("lose"),this.resultKicker.textContent="失敗",this.loseKind==="protect"?(this.resultTitle.textContent=t.protectLoseTitle,this.resultBody.textContent=t.protectLoseBody):(this.resultTitle.textContent=t.loseTitle,this.resultBody.textContent=t.loseBody),this.btnNext.hidden=!0,this.syncUi(),this.autosave()}unitAt(t,e){return this.units.find(n=>!n.dead&&n.x===t&&n.y===e)}clampPathEnd(t,e){if(e.length===0)return e;const n=(a,o)=>this.units.some(l=>l.id!==t.id&&!l.dead&&l.x===a&&l.y===o),s=e[e.length-1];if(!n(s.x,s.y))return e;let r=e.length-1;for(;r>0&&n(e[r].x,e[r].y);)r--;return e.slice(0,r+1)}tryPickup(t){const e=this.map.objAt(t.x,t.y);!e||e.gone||e.kind!=="pickup"||this.collectPickup(t,e)}tryPickupAt(t,e){const n=this.map.objects.find(s=>s.id===e.id);!n||n.gone||n.kind!=="pickup"||this.collectPickup(t,n)}collectPickup(t,e){const n=e.item??"bandage";Or(this.inventory,n,1)>0?(this.spawnFloat(t,`取得 ${oi[n].name}`,"#ffe08a"),this.log=`${t.name} 取得 ${oi[n].name}`):this.log="背包已滿。",e.gone=!0,this.syncUi(),this.autosave()}async useTrigger(t,e){if(!(this.busy||t.actedThisTurn||e.used)){this.busy=!0,t.anim="cast",t.animStart=performance.now(),jt.play("skill"),await this.waitMs(xr),e.used=!0,e.type==="van"&&(e.gone=!0);for(const[n,s]of e.unblock)this.map.unblock(n,s);if(e.healAdj)for(const n of this.units)n.dead||Math.abs(n.x-e.x)+Math.abs(n.y-e.y)>1||n.stance!=="friendly"&&n.team!=="player"||(n.hp=Math.min(n.maxHp,n.hp+e.healAdj),this.spawnFloat(n,`+${e.healAdj}`,"#7dffb3"));if(this.log=e.type==="van"?"貨車門打開了。":"開關啟動。",t.actedThisTurn=!0,t.anim="idle",this.setIdle(),t.movedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}}blastBarrel(t,e){jt.play("hit");for(const n of this.units)n.dead||Math.abs(n.x-t)+Math.abs(n.y-e)===1&&(n.hp=Math.max(0,n.hp-Br),this.spawnFloat(n,`${Br}`,"#ff9a3c"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 被爆炸波及。`,this.tryEnemyDrop(n)))}spawnFloat(t,e,n){this.floats.push({x:t.x,y:t.y,text:e,color:n,born:performance.now(),life:900})}tryEnemyDrop(t){if(t.team!=="enemy")return;const e=t.role==="elite"?.62:.35;if(Math.random()>=e)return;const s=(Math.random()<.65?"bandage":"stim")==="bandage"?["bandage","stim"]:["stim","bandage"];for(const r of s)if(Or(this.inventory,r,1)>0){this.spawnFloat(t,`掉落 ${oi[r].name}`,"#ffe08a");return}}jumpToMission(t){t<0||t>=ai.length||(this.pendingJump=null,this.inventory=tn(Pi),this.missionStartInventory=tn(Pi),this.m1DropGiven=!1,this.missionIndex=t,this.closePause(),this.closeModal(),this.result.hidden=!0,this.result.classList.remove("lose"),this.title.hidden=!0,this.briefing.hidden=!1,this.resetBattle(),this.phase="briefing",this.syncUi())}requestNextMission(){this.missionIndex>=ai.length-1||this.busy||(this.pendingJump=this.missionIndex+1,this.confirmText.textContent="跳到測試關卡 "+String((this.pendingJump??0)+1)+"？目前戰鬥不會保留。",this.confirmEl.hidden=!1)}openPause(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||(this.paused=!0,this.pauseOpen=!0,this.clearPendingTap(),this.pauseEl.hidden=!1,this.syncMuteBtn(),jt.play("pause"))}closePause(){this.pauseEl.hidden=!0,this.pauseOpen=!1,this.paused=!1}toggleMute(){jt.toggleMute(),this.syncMuteBtn()}syncMuteBtn(){this.btnMute.textContent=jt.muted?"取消靜音":"靜音"}quitToTitle(){if(!(this.playable()||this.phase==="enemy")){this.goTitle();return}this.pendingQuit=!0,this.confirmText.textContent="返回標題？進度在存檔與自動存檔裡。",this.confirmEl.hidden=!1}goTitle(){this.pendingQuit=!1,this.closePause(),this.closeModal(),this.confirmEl.hidden=!0,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!0,this.title.hidden=!1,this.phase="title",this.busy=!1,this.clearPendingTap(),this.clearSel(),this.inspect=null,jt.setBgm("title"),this.refreshContinue(),this.syncUi()}async refreshApp(){const t=xt("btn-refresh");t.disabled=!0,t.textContent="正在更新…";try{if("caches"in window){const n=await caches.keys();await Promise.all(n.map(s=>caches.delete(s)))}}catch{}try{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations();for(const s of n){s.waiting&&s.waiting.postMessage("skipWaiting");try{await s.update()}catch{}s.waiting&&s.waiting.postMessage("skipWaiting"),await s.unregister()}}}catch{}const e=new URL(location.href);e.searchParams.set("v",Kc),e.searchParams.set("r",String(Date.now())),location.replace(e.toString())}playable(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"||this.phase==="itemAim"}openBagFromHud(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||this.openBag()}openBag(){this.clearPendingTap(),this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind="bag",this.modal.hidden=!1,this.modalKicker.textContent="道具",this.modalTitle.textContent="背包",this.paintBag()}paintBag(){this.modalBody.innerHTML="";const t=this.playable()&&!!this.selected&&!this.selected.actedThisTurn&&!this.busy;if(!this.inventory.length){const e=document.createElement("p");e.textContent="沒有道具。",this.modalBody.appendChild(e);return}if(this.playable()&&!this.selected){const e=document.createElement("p");e.textContent="先選單位再用道具。",this.modalBody.appendChild(e)}for(const e of this.inventory){const n=oi[e.id],s=document.createElement("div");s.className="item-row";const r=document.createElement("div"),a=document.createElement("b");a.textContent=`${n.name} ×${e.qty}`;const o=document.createElement("span");if(o.textContent=n.hint,r.append(a,o),s.appendChild(r),this.playable()){const l=document.createElement("button");l.type="button",l.className="use",l.dataset.item=e.id,l.textContent="使用",l.disabled=!t,s.appendChild(l)}this.modalBody.appendChild(s)}}openSaves(t){this.clearPendingTap(),this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind=t,this.modal.hidden=!1,this.modalKicker.textContent=t==="save"?"存檔":"讀檔",this.modalTitle.textContent=t==="save"?"存檔":"讀檔",this.paintSaves()}paintSaves(){const t=di();this.modalBody.innerHTML="";for(let e=0;e<eu;e++){const n=t.slots[e],s=document.createElement("button");s.type="button",s.className=n?"slot":"slot empty",s.dataset.slot=String(e);const r=document.createElement("div"),a=document.createElement("b");a.textContent=`檔案 ${e+1}`;const o=document.createElement("span");o.textContent=n?`${n.missionName}　${z_(n.savedAt)}`:"空",r.append(a,o),s.appendChild(r),this.modalBody.appendChild(s)}}onModalClick(t){const e=t.target,n=e.closest("button.use");if(n&&this.modalKind==="bag"){const a=n.dataset.item;(a==="bandage"||a==="stim")&&this.armItem(a);return}const s=e.closest("button.ally-row");if(s&&this.modalKind==="target"){const a=s.dataset.uid,o=this.units.find(l=>l.id===a);o&&this.applyItem(o);return}const r=e.closest("button.slot");if(r&&(this.modalKind==="save"||this.modalKind==="load")){const a=Number(r.dataset.slot);this.modalKind==="load"?this.loadSlot(a):this.trySaveSlot(a)}}armItem(t){const e=this.selected;if(!e||e.actedThisTurn||this.busy){this.log="先選單位再用道具。",this.syncUi();return}this.pendingItem=t,this.closePause(),this.closeModal(),this.inspect=null,this.forecast=null,this.bumpForecast(),this.moveTiles.clear(),this.actionTiles.clear(),this.areaTiles.clear(),this.areaKind="item";const n=kr(this.units);this.skillTiles=new Set(n.map(s=>Ht(s.x,s.y))),this.phase="itemAim",this.log=`${oi[t].name}　選我軍單位`,this.syncUi(),this.clearPendingTap(),this.modalKind="target",this.modal.hidden=!1,this.modalKicker.textContent=oi[t].name,this.modalTitle.textContent="選擇對象",this.modalBody.innerHTML="";for(const s of n){const r=document.createElement("button");r.type="button",r.className="ally-row",r.dataset.uid=s.id;const a=document.createElement("div"),o=document.createElement("b");o.textContent=s.name;const l=document.createElement("span");l.textContent=`生命 ${s.hp}/${s.maxHp}`,a.append(o,l),r.appendChild(a),this.modalBody.appendChild(r)}}async applyItem(t){const e=this.selected,n=this.pendingItem;if(!(!e||!n||e.actedThisTurn||this.busy)&&kr(this.units).some(s=>s.id===t.id)&&Fu(this.inventory,n)){if(this.closeModal(),this.busy=!0,jt.play("heal"),n==="bandage"){const s=Math.min(vl,t.maxHp-t.hp);t.hp=Math.min(t.maxHp,t.hp+vl),this.spawnFloat(t,`+${Math.max(s,0)}`,"#7dffb3"),this.log=`${e.name} 對 ${t.name} 使用繃帶`}else t.atkBuff=Uu,this.spawnFloat(t,"+ATK","#ffc857"),this.log=`${e.name} 對 ${t.name} 使用提神　下次攻擊 +5`;if(e.actedThisTurn=!0,this.pendingItem=null,this.skillTiles.clear(),await this.waitMs(220),this.setIdle(),e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}closeModal(){this.modal.hidden=!0,this.modalKind="off",this.modalBody.innerHTML="",this.pauseOpen&&(this.pauseEl.hidden=!1)}trySaveSlot(t){if(di().slots[t]){this.pendingSlot=t,this.confirmText.textContent=`覆蓋檔案 ${t+1}？`,this.confirmEl.hidden=!1;return}this.writeSlot(t)}confirmYes(){if(this.confirmEl.hidden=!0,this.pendingQuit){this.pendingQuit=!1,this.goTitle();return}if(this.pendingJump!==null){const t=this.pendingJump;this.pendingJump=null,this.jumpToMission(t);return}this.pendingSlot!==null&&this.writeSlot(this.pendingSlot),this.pendingSlot=null}confirmNo(){this.confirmEl.hidden=!0,this.pendingSlot=null,this.pendingQuit=!1,this.pendingJump=null}writeSlot(t){const e=di();e.slots[t]=this.captureSave(),Yc(e),this.pendingSlot=null,this.log=`已存到檔案 ${t+1}`,this.closeModal(),this.refreshContinue(),this.syncUi()}loadSlot(t){const n=di().slots[t];n&&(this.closeModal(),this.closePause(),this.applySave(n))}captureSave(){const t=this.playable()||this.phase==="enemy";return{v:1,savedAt:Date.now(),missionIndex:this.missionIndex,missionName:t?`${this.mission.number}　戰鬥中`:this.mission.number,phase:this.phase==="enemy"||this.phase==="itemAim"||this.phase==="skillAim"||this.phase==="forecast"?"select":this.phase,turn:this.turn,intel:this.intel,power:this.power,inventory:tn(this.inventory),units:this.units.map(e=>this.packUnit(e)),cam:{...this.renderer.cam},yaw:this.renderer.yaw,pitch:this.renderer.pitch,log:this.log,selectedId:this.selected&&t?this.selected.id:null,origin:this.origin?{...this.origin}:null,originDir:this.originDir,m1DropGiven:this.m1DropGiven,missionStartInventory:tn(this.missionStartInventory),objects:this.map.objects.map(e=>({id:e.id,hp:e.hp,gone:e.gone,used:e.used}))}}packUnit(t){return{id:t.id,x:t.x,y:t.y,hp:t.hp,maxHp:t.maxHp,atk:t.atk,def:t.def,dir:t.dir,acted:t.acted,skillUsed:t.skillUsed,skipNext:t.skipNext,dead:t.dead,movedThisTurn:t.movedThisTurn,actedThisTurn:t.actedThisTurn,atkBuff:t.atkBuff,team:t.team,stance:t.stance,behaviour:t.behaviour,archetype:t.archetype,gender:t.gender,skillKind:t.skillKind,rangeMin:t.rangeMin,rangeMax:t.rangeMax}}applySave(t){if(this.missionIndex=t.missionIndex,this.intel=t.intel,this.power=t.power,this.inventory=tn(t.inventory),this.missionStartInventory=tn(t.missionStartInventory??t.inventory),this.m1DropGiven=t.m1DropGiven,this.turn=t.turn,this.log=t.log,this.setSeg("seg-intel",t.intel),this.setSeg("seg-power",t.power),this.map=new Hr(this.mission.map),t.objects)for(const r of t.objects){const a=this.map.objects.find(o=>o.id===r.id);if(a&&(a.hp=r.hp,a.gone=r.gone,a.used=r.used,a.used)){for(const[o,l]of a.unblock)this.map.unblock(o,l);a.type==="van"&&(a.gone=!0)}}const e=[...pl(this.mission.starts),...this.mission.makeOthers()],n=new Map(e.map(r=>[r.id,r]));this.units=[];for(const r of t.units){const a=n.get(r.id);a&&this.units.push({...a,...r})}this.renderer.cam={...t.cam},this.renderer.yaw=t.yaw,this.renderer.setPitch(t.pitch??Ss),this.clearSel(),this.inspect=null,this.busy=!1,this.acting=!1,this.clearPendingTap(),this.pendingItem=null,this.fillBriefing(),this.result.hidden=!0,this.result.classList.remove("lose"),this.confirmEl.hidden=!0;const s=t.phase;if(this.phase=s,s==="title")this.title.hidden=!1,this.briefing.hidden=!0;else if(s==="briefing")this.title.hidden=!0,this.briefing.hidden=!1;else if(s==="victory"||s==="defeat")this.title.hidden=!0,this.briefing.hidden=!0,this.result.hidden=!1,s==="defeat"&&this.result.classList.add("lose");else if(this.title.hidden=!0,this.briefing.hidden=!0,this.phase="select",t.selectedId){const r=this.units.find(a=>a.id===t.selectedId);r&&!r.dead&&!r.acted&&!r.npc&&(this.selected=r,this.origin=t.origin,this.originDir=t.originDir,this.refreshRanges(r))}this.closePause(),this.phase==="title"||this.phase==="briefing"?jt.setBgm("title"):this.phase==="victory"||this.phase==="defeat"?jt.setBgm(null):jt.setBgm("battle"),this.refreshContinue(),this.syncUi()}setSeg(t,e){const n=xt(t);for(const s of n.querySelectorAll("button"))s.classList.toggle("on",s.getAttribute("data-v")===e)}autosave(){if(this.phase==="title")return;const t=di();t.autosave=this.captureSave(),Yc(t),this.refreshContinue()}refreshContinue(){this.btnContinue.disabled=!$c(di())}paintUnitChip(t,e){this.chip.hidden=!1,this.chipHp.hidden=!1;const n=`${Jc[ei(t)]}${t.npc?"　保護":""}`;this.chipName.textContent=`${t.name}　${t.title}`;const s=t.atkBuff?`　攻擊+${t.atkBuff}`:"";this.chipMeta.textContent=`${n}　${X_[t.role]}　生命 ${t.hp}/${t.maxHp}　攻擊 ${t.atk}　防禦 ${t.def}　移動 ${t.mov}　跳躍 ${t.jmp}${s}`,this.chipHpFill.style.width=`${100*t.hp/t.maxHp}%`,this.chipMark.style.background=lr(t),t.skillName?(this.chipExtra.hidden=!1,this.chipExtra.textContent=`${t.skillName}　${t.skillHint}`):(this.chipExtra.hidden=!e,this.chipExtra.textContent=e?"無技能":"",e||(this.chipExtra.hidden=!0))}paintObjectChip(t){const e=this.map.objects.find(s=>s.id===t);if(this.chip.hidden=!1,!e){this.chip.hidden=!0;return}this.chipHp.hidden=e.kind!=="destructible",this.chipName.textContent=e.label;const n=e.kind==="pickup"?"拾取":e.kind==="trigger"?"啟動":e.kind==="destructible"?"可破壞":"可站上";this.chipMeta.textContent=`${n}　${e.used?"已使用":"未使用"}`,e.kind==="destructible"&&(this.chipHpFill.style.width=`${100*e.hp/e.maxHp}%`),this.chipExtra.hidden=!1,this.chipExtra.textContent=e.kind==="pickup"?"靠近或走到此格可放入背包。":e.kind==="trigger"?"相鄰時可啟動。消耗行動。":e.kind==="destructible"?"攻擊可破壞。油桶爆炸會波及鄰格。":"走到此格可站上，高度較高。",this.chipMark.style.background=e.kind==="destructible"?"#ff4d6d":"#ffc857"}paintTileChip(t){this.chip.hidden=!1,this.chipHp.hidden=!0,this.chipName.textContent=La[t.terrain];const e=[`高度 ${t.h}`,t.blocked?"阻擋":"可走",La[t.terrain]];t.prop&&e.push(q_[t.prop]),this.chipMeta.textContent=e.join("　"),this.chipExtra.hidden=!1,this.chipExtra.textContent=t.blocked?"無法站上此格。":"可以走。",this.chipMark.style.background=t.blocked?"#ff4d6d":"#3ef0d0"}syncUi(){this.scrubHints(),this.hudTurn.textContent=`回合 ${this.turn}`,this.hudPhase.textContent=this.phase==="enemy"?"敵軍":this.phase==="victory"?"勝利":this.phase==="defeat"?"失敗":this.phase==="title"?"選單":"我軍",this.hudSub.textContent=`${this.mission.hudSub}　智 ${gl[this.intel]}　力 ${gl[this.power]}`,this.logEl.textContent=this.log;const t=this.playable(),e=this.selected;if(this.inspect&&t?this.inspect.kind==="unit"?this.paintUnitChip(this.inspect.unit,!0):this.inspect.kind==="object"?this.paintObjectChip(this.inspect.id):this.paintTileChip(this.inspect.tile):e&&t?this.paintUnitChip(e,!1):this.chip.hidden=!0,this.forecast&&this.phase==="forecast"&&!this.busy){this.forecastEl.hidden=!1;const o=this.forecast.heal?"good":"bad";this.forecastEl.innerHTML=`<div><b>${this.forecast.label}</b></div><div class="${o}">${this.forecast.detail}</div><div>點確認出手，取消返回。</div>`}else this.forecastEl.hidden=!0;const n=!!e&&this.phase==="select";this.btnCancel.disabled=!e&&!this.inspect&&this.phase!=="itemAim"||this.phase==="enemy"||this.busy,this.btnWait.disabled=!n||this.busy,this.btnWait.textContent=e&&(e.movedThisTurn||e.actedThisTurn)?"結束":"待機",this.btnSkill.disabled=!e||!e.skillName||e.skillUsed||e.actedThisTurn||this.busy||this.phase!=="select"&&this.phase!=="skillAim",this.btnSkill.classList.toggle("armed",this.phase==="skillAim"),this.btnConfirm.disabled=this.phase!=="forecast"||this.busy||this.acting||!this.forecast;const s=this.units.some(o=>o.team==="player"&&!o.dead&&!o.acted&&!o.npc),r=this.phase==="enemy"||this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat",a=this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat"||this.vnOpen;this.btnEnd.hidden=!s||r,this.btnRotate.hidden=r,this.btnPause.hidden=a,this.btnBag.hidden=a,this.camHint.hidden=r,this.refreshContinue()}}const iu=document.getElementById("board");if(!(iu instanceof HTMLCanvasElement))throw new Error("board");document.addEventListener("pointerdown",()=>{jt.unlock()},{capture:!0});document.addEventListener("click",i=>{i.target.closest("button")&&jt.play("ui")},!0);const su=new Y_(iu);su.applyHash();su.start();const $_=location.search.includes("shot");"serviceWorker"in navigator&&!$_&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})});
