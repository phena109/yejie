var Gh=Object.defineProperty;var Vh=(i,e,t)=>e in i?Gh(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var q=(i,e,t)=>Vh(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const Pc="yejie-mute";function Wh(){try{return localStorage.getItem(Pc)==="1"}catch{return!1}}class Xh{constructor(){q(this,"muted",Wh());q(this,"ctx",null);q(this,"master",null);q(this,"sfxGain",null);q(this,"bgmGain",null);q(this,"unlocked",!1);q(this,"wanted",null);q(this,"playing",null);q(this,"timer",0);q(this,"beat",0)}unlock(){if(this.unlocked&&this.ctx&&this.ctx.state==="running")return;const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx||(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.32,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.7,this.sfxGain.connect(this.master),this.bgmGain=this.ctx.createGain(),this.bgmGain.gain.value=this.muted?0:.22,this.bgmGain.connect(this.master)),this.ctx.resume(),this.unlocked=!0,this.applyMute(),this.wanted&&this.setBgm(this.wanted))}setMuted(e){this.muted=e;try{localStorage.setItem(Pc,e?"1":"0")}catch{}this.applyMute()}toggleMute(){return this.setMuted(!this.muted),this.muted}applyMute(){this.sfxGain&&(this.sfxGain.gain.value=this.muted?0:.7),this.bgmGain&&(this.bgmGain.gain.value=this.muted?0:.22)}play(e){if(this.unlock(),!this.ctx||!this.sfxGain||this.muted)return;const t=this.ctx.currentTime;switch(e){case"ui":this.blip(880,.045,.11,"sine",t);break;case"move":this.noise(.05,.06,t,900),this.blip(180,.06,.08,"triangle",t);break;case"attack":this.noise(.1,.1,t,700),this.sweep(420,160,.12,.12,t);break;case"hit":this.blip(140,.09,.16,"square",t),this.noise(.08,.12,t,400);break;case"miss":this.sweep(480,220,.14,.07,t),this.blip(210,.1,.05,"sine",t+.04);break;case"skill":this.blip(520,.08,.1,"square",t),this.blip(780,.1,.1,"sine",t+.06),this.blip(1040,.12,.08,"sine",t+.12);break;case"heal":this.blip(392,.1,.09,"sine",t),this.blip(494,.12,.1,"sine",t+.08),this.blip(587,.16,.1,"sine",t+.16);break;case"victory":this.blip(523,.14,.12,"square",t),this.blip(659,.16,.12,"square",t+.12),this.blip(784,.28,.14,"square",t+.24);break;case"defeat":this.blip(330,.18,.12,"sawtooth",t),this.blip(247,.22,.12,"sawtooth",t+.16),this.blip(165,.4,.14,"sine",t+.32);break;case"pause":this.blip(220,.1,.08,"triangle",t),this.blip(165,.16,.08,"triangle",t+.1);break}}setBgm(e){if(this.wanted=e,e===this.playing||(this.stopBgm(),this.playing=e,!e||!this.unlocked||!this.ctx))return;this.beat=0;const t=e==="battle"?280:520,n=()=>{if(this.playing!==e||!this.ctx||!this.bgmGain)return;const s=this.ctx.currentTime;e==="title"?this.titleBeat(s):this.battleBeat(s),this.beat+=1,this.timer=window.setTimeout(n,t)};n()}stopBgm(){this.timer&&(window.clearTimeout(this.timer),this.timer=0),this.playing=null}titleBeat(e){const t=this.beat%8,n=[110,0,82,0,110,0,98,0][t];n&&this.tone(this.bgmGain,n,.46,.045,"sine",e),(t===0||t===4)&&this.tone(this.bgmGain,220,.4,.02,"triangle",e),t===6&&this.tone(this.bgmGain,329,.28,.018,"sine",e)}battleBeat(e){const t=this.beat%8;t%2===0?this.sweepTo(this.bgmGain,90,42,.12,.1,e):this.noiseTo(this.bgmGain,.04,.025,e,1800);const s=[0,196,0,233,0,196,175,0][t];s&&this.tone(this.bgmGain,s,.18,.035,"square",e)}blip(e,t,n,s,r){this.sfxGain&&this.tone(this.sfxGain,e,t,n,s,r)}sweep(e,t,n,s,r){this.sfxGain&&this.sweepTo(this.sfxGain,e,t,n,s,r)}noise(e,t,n,s){this.sfxGain&&this.noiseTo(this.sfxGain,e,t,n,s)}tone(e,t,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type=r,o.frequency.setValueAtTime(t,a),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(s,a+.012),l.gain.exponentialRampToValueAtTime(1e-4,a+n),o.connect(l),l.connect(e),o.start(a),o.stop(a+n+.02)}sweepTo(e,t,n,s,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(t,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,n),a+s),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(r,a+.01),l.gain.exponentialRampToValueAtTime(1e-4,a+s),o.connect(l),l.connect(e),o.start(a),o.stop(a+s+.02)}noiseTo(e,t,n,s,r){if(!this.ctx)return;const a=2048,o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=o.getChannelData(0);for(let u=0;u<a;u++)l[u]=Math.random()*2-1;const c=this.ctx.createBufferSource();c.buffer=o;const h=this.ctx.createBiquadFilter();h.type="lowpass",h.frequency.value=r;const f=this.ctx.createGain();f.gain.setValueAtTime(1e-4,s),f.gain.exponentialRampToValueAtTime(n,s+.008),f.gain.exponentialRampToValueAtTime(1e-4,s+t),c.connect(h),h.connect(f),f.connect(e),c.start(s),c.stop(s+t+.02)}}const et=new Xh;function qh(i,e){return i==="mara"||i==="dana"||i==="priya"||i==="hale"||i==="crosby"||i==="beckett"?i:e==="civilian"?"official":e==="worker"?"worker":e==="delinquent"||e==="magician"||e==="wolverine"||e==="boxer"||e==="gunner"?e:e==="elite"?"crosby":"delinquent"}function Yh(i,e){return e?i==="striker"?"strike":i==="controller"?"halt":i==="support"?"heal":i==="delinquent"?"slash":i==="magician"?"spark":i==="wolverine"?"pounce":i==="boxer"?"hook":i==="gunner"?"shot":"":""}function Et(i){const e=i.team,t=i.stance??(e==="player"?"friendly":e==="neutral"?"neutral":"hostile"),n=i.npc??!1,s=i.behaviour??(n?"idle":"combat"),r=i.archetype??qh(i.id,i.role),a=i.skillKind??Yh(i.role,i.skillName),o=a==="spark"||a==="shot"||i.role==="gunner"||i.role==="magician";return{acted:i.acted??!1,skillUsed:!1,skipNext:!1,dead:!1,lunge:0,dir:i.dir??0,movedThisTurn:!1,actedThisTurn:!1,npc:n,atkBuff:i.atkBuff??0,archetype:r,stance:t,behaviour:s,gender:i.gender??"m",skillKind:a,rangeMin:i.rangeMin??(i.role==="gunner"?2:1),rangeMax:i.rangeMax??(o?(i.role==="gunner",3):1),anim:"idle",animStart:0,...i}}function Qo(i){return[Et({id:"mara",name:"Mara Ellison",title:"警員",team:"player",role:"striker",archetype:"mara",gender:"f",x:i[0]?.x??3,y:i[0]?.y??11,hp:44,maxHp:44,atk:16,def:5,mov:5,jmp:2,dir:0,skillName:"重擊",skillHint:"近身重擊，傷害較高，也可以打更高的高度差。",skillKind:"strike"}),Et({id:"dana",name:"Dana Ruiz",title:"搭檔",team:"player",role:"controller",archetype:"dana",gender:"f",x:i[1]?.x??4,y:i[1]?.y??11,hp:40,maxHp:40,atk:10,def:8,mov:4,jmp:1,dir:0,skillName:"攔住",skillHint:"讓目標下一回合無法行動，並造成少量傷害。",skillKind:"halt"}),Et({id:"priya",name:"Priya Shah",title:"急救員",team:"player",role:"support",archetype:"priya",gender:"f",x:i[2]?.x??5,y:i[2]?.y??11,hp:38,maxHp:38,atk:8,def:7,mov:4,jmp:1,dir:0,skillName:"包紮",skillHint:"治療相鄰的友軍，也可以用在自己身上。",skillKind:"heal"})]}function bi(i,e,t,n,s,r="m"){return Et({id:i,name:e,title:"街頭",team:"enemy",role:"delinquent",archetype:"delinquent",gender:r,x:t,y:n,hp:22,maxHp:22,atk:10,def:3,mov:4,jmp:1,dir:s,skillName:"揮砍",skillHint:"近身揮砍，傷害較高。",skillKind:"slash"})}function Tr(i,e,t,n,s,r="m"){return Et({id:i,name:e,title:"拳手",team:"enemy",role:"boxer",archetype:"boxer",gender:r,x:t,y:n,hp:26,maxHp:26,atk:15,def:4,mov:3,jmp:1,dir:s,skillName:"勾拳",skillHint:"近身重拳，傷害很高，距離短。",skillKind:"hook",rangeMin:1,rangeMax:1})}function es(i,e,t,n,s,r="m"){return Et({id:i,name:e,title:"槍手",team:"enemy",role:"gunner",archetype:"gunner",gender:r,x:t,y:n,hp:20,maxHp:20,atk:11,def:3,mov:4,jmp:1,dir:s,skillName:"點射",skillHint:"遠距點射，想保持距離。",skillKind:"shot",rangeMin:2,rangeMax:3})}function jo(i,e,t,n,s,r="f"){return Et({id:i,name:e,title:"術者",team:"enemy",role:"magician",archetype:"magician",gender:r,x:t,y:n,hp:24,maxHp:24,atk:12,def:3,mov:3,jmp:1,dir:s,skillName:"閃火",skillHint:"遠距閃火，看起來像煙火。",skillKind:"spark",rangeMin:1,rangeMax:3})}function $h(i,e,t,n,s,r="m"){return Et({id:i,name:e,title:"爪獸",team:"enemy",role:"wolverine",archetype:"wolverine",gender:r,x:t,y:n,hp:28,maxHp:28,atk:15,def:2,mov:5,jmp:2,dir:s,skillName:"撲擊",skillHint:"衝近撲擊。現場會說那是動物。",skillKind:"pounce",rangeMin:1,rangeMax:1})}const Ei=[{id:"m1",number:"任務 01",loc:"國王碼頭夜市・屋頂",hudSub:"國王碼頭夜市",paragraphs:["屋頂風很大。柏油上三個白圈，空的。街道被標得像棋盤——他們本來就不打算讓目擊者走掉。"],voices:[{name:"Mara",line:"屋頂不對勁。不是穿制服的。巷口粉筆記號又近了一格——跟週二同一隻手。"},{name:"Dana",line:"上去。樓梯我先走。你看到了再喊。"},{name:"Priya",line:"街上要是還有傷患，我不走。棋盤再急，也不能拿活人當棋子。"}],midBeats:[{speaker:"Mara",side:"left",text:"粉筆灰還沒被風吹散。有人剛從這裡下去。"}],winCond:"擊敗 Crosby",loseCond:"三人全部倒下",winTitle:"現場結束了。",winBody:"Crosby 倒下。其餘的人散了。市場還開著。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。屋頂上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。屋頂上的人還在。",map:{w:10,h:12,theme:"roof",heights:["2222222222","2222112222","2211001122","0011111100","0000000000","0000000000","2200000022","2200000022","2110000112","0000000000","0000000000","0000000000"],blocked:[[1,0,"ac"],[8,0,"ac"],[0,7,"ac"],[9,7,"ac"],[2,5,"stall"],[3,5,"stall"],[6,5,"stall"],[7,5,"stall"],[4,9,"stall"],[5,9,"stall"],[1,4,"stall"],[8,4,"stall"]],lamps:[[4,4],[0,9],[9,9]],objects:[{x:2,y:10,type:"kit",item:"bandage"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"crosby",makeOthers:()=>[Et({id:"crosby",name:"Crosby",title:"現場主管",team:"enemy",role:"elite",archetype:"crosby",gender:"m",x:5,y:0,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),bi("e1","Neil",2,1,2,"m"),bi("e2","Cole",7,1,2,"f"),Tr("e3","Nash",0,6,1,"m"),es("e4","Pike",4,3,2,"m")]},{id:"m2",number:"任務 02",loc:"國王碼頭後巷・貨台",hudSub:"國王碼頭後巷",paragraphs:["後巷報了槍擊。無線電當它是幫派互打。Mara、Dana、Priya 被派去，因為這是夜班的槍擊案，不是因為有人點名。三人傷勢已處理，生命已回復。","現場其實是 Assembly 在換掉當地那一組人，也要處理一個真正管港口執照的人。Deputy Harbour Chief Rowan Hale 人還在貨台上。他們先動手換幫派，所以看起來還是街頭那套。"],voices:[{name:"Mara",line:"後巷有槍聲。當幫派打。"},{name:"Dana",line:"我們是最近的一組。"},{name:"Priya",line:"有人倒在貨台邊上。"}],winCond:"擊敗 Beckett，Hale 須仍在",loseCond:"三人全部倒下，或 Rowan Hale 倒下",winTitle:"槍聲停了。",winBody:"Beckett 停手了。Hale 還活著。這條巷子暫時安靜。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。巷子裡的人還在。",protectLoseTitle:"Rowan Hale 倒下。",protectLoseBody:"港口執照那條線斷了。現場的人還沒走。",map:{w:10,h:12,theme:"alley",heights:["2220002222","2210001222","2200000122","0000000000","0001111000","2200000112","2200000012","0000000000","2210000222","2200000022","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,0,"ac"],[0,10,"ac"],[9,8,"ac"],[5,8,"crate"],[2,9,"crate"],[6,6,"crate"],[7,6,"crate"]],lamps:[[3,3],[4,10],[8,5]],objects:[{x:3,y:8,type:"pallet"},{x:8,y:4,type:"barrel"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"beckett",protectId:"hale",makeOthers:()=>[Et({id:"hale",name:"Rowan Hale",title:"副港務長",team:"player",role:"civilian",archetype:"hale",gender:"m",x:4,y:9,hp:34,maxHp:34,atk:0,def:6,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Et({id:"beckett",name:"Beckett",title:"現場主管",team:"enemy",role:"elite",archetype:"beckett",gender:"m",x:8,y:1,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),es("e1","Drake",5,2,2,"m"),bi("e2","Quinn",1,4,1,"f"),Tr("e3","Moss",7,5,2,"m"),bi("e4","Reed",8,7,3,"m")]},{id:"m3",number:"任務 03",loc:"國王碼頭倉庫・碼頭",hudSub:"國王碼頭倉庫",paragraphs:["槍擊過後，Assembly 回來清場。倉庫裡還有看太多的碼頭工人。無線電仍當它是貨物失竊。","現場主管是 Vance。工人 Sam Ortiz 還在棧板上。他們要滅口，不是搶貨。"],voices:[{name:"Mara",line:"倉庫有人。不是小偷。"},{name:"Dana",line:"工人還在裡面。"},{name:"Priya",line:"我先看傷。"}],winCond:"擊敗 Vance，Ortiz 須仍在",loseCond:"三人全部倒下，或 Sam Ortiz 倒下",winTitle:"倉庫靜了。",winBody:"Vance 停手。Ortiz 還活著。碼頭外面仍有夜班吊車。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。倉庫裡的人還在。",protectLoseTitle:"Sam Ortiz 倒下。",protectLoseBody:"目擊者沒了。現場的人還沒走。",map:{w:10,h:12,theme:"warehouse",heights:["2222200000","2211100000","2200000112","0000000112","0001110000","2200000022","2200000022","0000000000","0011111000","0000000000","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,2,"ac"],[0,5,"crate"],[9,6,"crate"],[3,7,"crate"],[4,2,"crate"],[5,2,"crate"]],lamps:[[2,3],[7,8],[1,10]],objects:[{x:1,y:8,type:"kit",item:"stim"},{x:5,y:8,type:"pallet"},{x:6,y:4,type:"barrel"},{x:2,y:4,type:"switch",unblock:[[4,2],[5,2]]},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"vance",protectId:"ortiz",makeOthers:()=>[Et({id:"ortiz",name:"Sam Ortiz",title:"碼頭工人",team:"player",role:"worker",archetype:"worker",gender:"m",x:4,y:8,hp:28,maxHp:28,atk:0,def:4,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Et({id:"w1",name:"Gina Pell",title:"碼頭工人",team:"neutral",role:"worker",archetype:"worker",gender:"f",stance:"neutral",behaviour:"flee",npc:!0,x:1,y:6,hp:20,maxHp:20,atk:0,def:2,mov:3,jmp:1,dir:1,skillName:"",skillHint:""}),Et({id:"vance",name:"Vance",title:"現場主管",team:"enemy",role:"elite",archetype:"boxer",gender:"m",x:6,y:1,hp:50,maxHp:50,atk:15,def:6,mov:4,jmp:2,dir:2,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook"}),es("e1","Kira",8,2,2,"f"),bi("e2","Dunn",2,2,2,"m"),Tr("e3","Wade",7,5,3,"m")]},{id:"m4",number:"任務 04",loc:"國王碼頭東街・換手",hudSub:"國王碼頭東街",paragraphs:["街上還有本地那一組人。Assembly 要換掉他們。看起來像幫派互打，三方都在場。","本地的人沒有先打你。Assembly 的現場主管是 Inez。贏的條件是她倒下。不必清掉整條街。"],voices:[{name:"Mara",line:"兩邊都有人。不要先打錯邊。"},{name:"Dana",line:"本地的人在看我們。"},{name:"Priya",line:"打到他們，他們就會打回來。"}],winCond:"擊敗 Inez。本地組不必全滅",loseCond:"三人全部倒下",winTitle:"東街暫時停了。",winBody:"Inez 倒下。本地的人沒有再往前。換手沒做完。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。街上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。街上的人還在。",map:{w:10,h:12,theme:"street",heights:["0000222000","0000222000","1100000011","0000000000","2200000022","0001111000","0000000000","2200000022","0000000000","1100000011","0000000000","0000000000"],blocked:[[0,4,"ac"],[9,4,"ac"],[0,7,"stall"],[9,7,"stall"],[3,5,"stall"]],lamps:[[2,2],[7,6],[4,9]],objects:[{x:1,y:9,type:"kit",item:"bandage"},{x:6,y:8,type:"pallet"},{x:2,y:5,type:"barrel"},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"inez",makeOthers:()=>[Et({id:"inez",name:"Inez",title:"現場主管",team:"enemy",role:"elite",archetype:"gunner",gender:"f",x:5,y:0,hp:46,maxHp:46,atk:13,def:5,mov:4,jmp:2,dir:2,skillName:"點射",skillHint:"遠距點射。",skillKind:"shot",rangeMin:2,rangeMax:3}),jo("e1","Lyle",2,1,2,"m"),bi("e2","Rosa",7,1,2,"f"),es("e3","Chen",8,5,3,"m"),Et({id:"g1",name:"Marty",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"combat",x:1,y:3,hp:20,maxHp:20,atk:9,def:3,mov:4,jmp:1,dir:1,skillName:"揮砍",skillHint:"近身揮砍。",skillKind:"slash",npc:!0}),Et({id:"g2",name:"Bea",title:"本地組",team:"neutral",role:"boxer",archetype:"boxer",gender:"f",stance:"neutral",behaviour:"combat",x:2,y:6,hp:22,maxHp:22,atk:12,def:3,mov:3,jmp:1,dir:0,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook",npc:!0}),Et({id:"g3",name:"Oz",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"indiscriminate",x:8,y:2,hp:16,maxHp:16,atk:8,def:2,mov:3,jmp:1,dir:3,skillName:"",skillHint:"",npc:!0})]},{id:"m5",number:"任務 05",loc:"港務大樓前・廣場",hudSub:"港務廣場",paragraphs:["Assembly 改打真正有權的人。Port Authority Director Marla Keene 今晚還在廣場側門。無線電會寫成動物與煙火。","現場有術者和爪獸。主管是 Holt。Keene 必須活著。"],voices:[{name:"Mara",line:"這不是街頭那套了。"},{name:"Dana",line:"那邊有人往官員走。"},{name:"Priya",line:"先護人。"}],winCond:"擊敗 Holt，Keene 須仍在",loseCond:"三人全部倒下，或 Marla Keene 倒下",winTitle:"廣場上的人散了。",winBody:"Holt 停手。Keene 還活著。報告會寫煙火與走失的動物。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。廣場上的人還在。",protectLoseTitle:"Marla Keene 倒下。",protectLoseBody:"真正管港口的那條線斷了。",map:{w:10,h:12,theme:"plaza",heights:["2222222222","2211111122","2200000022","0000000000","0001111000","2200000022","0000000000","0011111100","0000000000","2200000022","0000000000","0000000000"],blocked:[[0,5,"ac"],[9,5,"ac"],[1,1,"ac"],[8,1,"ac"],[4,2,"crate"],[5,2,"crate"]],lamps:[[3,3],[6,6],[2,9]],objects:[{x:6,y:10,type:"kit",item:"bandage"},{x:3,y:7,type:"pallet"},{x:7,y:4,type:"barrel"},{x:1,y:4,type:"van",unblock:[[4,2],[5,2]]},{x:8,y:8,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"holt",protectId:"keene",makeOthers:()=>[Et({id:"keene",name:"Marla Keene",title:"港務總監",team:"player",role:"civilian",archetype:"official",gender:"f",x:4,y:9,hp:32,maxHp:32,atk:0,def:5,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Et({id:"holt",name:"Holt",title:"現場主管",team:"enemy",role:"elite",archetype:"magician",gender:"m",x:5,y:0,hp:52,maxHp:52,atk:14,def:5,mov:4,jmp:2,dir:2,skillName:"閃火",skillHint:"遠距閃火。",skillKind:"spark",rangeMin:1,rangeMax:3}),jo("e1","Lila",2,1,2,"f"),$h("e2","Rook",7,2,2,"m"),es("e3","Tess",8,6,3,"f")]}],_s=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}],Kh={L:.75,M:1,H:1.35},el={L:"L 低",M:"M 中",H:"H 高"};function Ke(i,e){return`${i},${e}`}function On(i){const[e,t]=i.split(",");return{x:Number(e),y:Number(t)}}function ts(i,e){const t=e.x-i.x,n=e.y-i.y,s=Math.sign(t),r=Math.sign(n);return s===0&&r<=0?0:s>0&&r<0?1:s>0&&r===0?2:s>0&&r>0?3:s===0&&r>0?4:s<0&&r>0?5:s<0&&r===0?6:7}function Un(i,e){return Math.abs(i.x-e.x)+Math.abs(i.y-e.y)}function tl(i){return new Promise(e=>setTimeout(e,i))}function ns(i,e,t,n,s){const r=(n-1)/2,a=(s-1)/2,o=i-r,l=e-a,c=Math.cos(t),h=Math.sin(t);return{x:o*c+l*h,y:-o*h+l*c}}function Zh(i,e,t){const n=Math.cos(t),s=Math.sin(t);return{x:i*n+e*s,y:-i*s+e*n}}function Jh(i){return i+Math.PI/2}function Qh(i,e){if(i.stance!=="hostile"&&i.team!=="enemy")return;const t=Kh[e];i.maxHp=Math.max(1,Math.round(i.maxHp*t)),i.hp=i.maxHp,i.atk=Math.max(1,Math.round(i.atk*t)),i.def=Math.max(0,Math.round(i.def*t))}function Qn(i){return i.stance}function Lc(i){const e=Qn(i);return e==="friendly"?"#5ad0ff":e==="hostile"?"#ff4d6d":"#e0c45a"}function jh(i){return i.team==="player"&&!i.npc&&!i.dead}function eu(i,e){return e.dead?!0:i.team===e.team||Qn(i)==="friendly"&&Qn(e)==="friendly"}function Ic(i,e){if(i.dead||e.dead||i.id===e.id)return!1;if(i.behaviour==="indiscriminate"||e.behaviour==="indiscriminate")return!0;const t=Qn(i),n=Qn(e);return t==="hostile"&&n==="friendly"||t==="friendly"&&n==="hostile"||t==="neutral"&&n==="hostile"||t==="hostile"&&n==="neutral"}function nl(i){i.stance="hostile",i.team="enemy",(i.behaviour==="idle"||i.behaviour==="flee")&&(i.behaviour="combat")}function tu(i,e){const t=new Map;for(const n of i)n.dead||e&&n.id===e.id||t.set(Ke(n.x,n.y),n);return t}function Ts(i,e,t){const n=tu(t,i),s=new Map,r=new Map,a=Ke(i.x,i.y);s.set(a,0),r.set(a,null);const o=[{x:i.x,y:i.y}];for(;o.length;){o.sort((d,g)=>(s.get(Ke(d.x,d.y))??99)-(s.get(Ke(g.x,g.y))??99));const c=o.shift(),h=Ke(c.x,c.y),f=s.get(h)??0,u=e.heightAt(c.x,c.y);for(const d of _s){const g=c.x+d.x,v=c.y+d.y;if(!e.walkable(g,v)||d.x!==0&&d.y!==0&&(!e.walkable(c.x+d.x,c.y)||!e.walkable(c.x,c.y+d.y)))continue;const m=e.heightAt(g,v)-u;if(Math.abs(m)>i.jmp)continue;const S=n.get(Ke(g,v));if(S&&!eu(i,S))continue;const T=1+(m>0?m:0),y=f+T;if(y>i.mov)continue;const A=Ke(g,v),b=s.get(A);b!==void 0&&b<=y||(s.set(A,y),r.set(A,h),o.push({x:g,y:v}))}}const l=new Map;for(const[c,h]of s){const f=On(c),u=n.get(c);u&&u.id!==i.id||e.walkable(f.x,f.y)&&l.set(c,h)}return l.set(a,0),{cost:l,parent:r}}function jn(i,e){const t=[];let n=Ke(e.x,e.y);if(!i.cost.has(n)&&!i.parent.has(n))return t;for(;n;){t.push(On(n));const s=i.parent.get(n);if(!s)break;n=s}return t.reverse(),t}function Xi(i,e,t,n,s,r){const a=Math.abs(e-n)+Math.abs(t-s),o=i.rangeMin??1,l=i.rangeMax??1;if(a<o||a>l)return!1;const c=Math.abs(r.heightAt(e,t)-r.heightAt(n,s)),h=Math.max(2,i.jmp+1);return c<=h}function _a(i,e,t,n){const s=i.x,r=i.y,a=[];for(const o of t)o.dead||o.id===i.id||!(Ic(i,o)||i.team==="player"&&!i.npc&&o.stance!=="friendly")||Xi(i,s,r,o.x,o.y,e)&&a.push(o);return a}function va(i,e,t){const n=i.skillKind;if(n==="heal"||i.role==="support")return t.filter(s=>s.dead||s.stance!=="friendly"&&s.team!=="player"?!1:Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=1);if(n==="halt"||i.role==="controller")return t.filter(s=>{if(s.dead||s.stance==="friendly")return!1;const r=Math.abs(e.heightAt(i.x,i.y)-e.heightAt(s.x,s.y));return Math.abs(i.x-s.x)+Math.abs(i.y-s.y)<=3&&r<=3});if(n==="spark"||n==="shot")return t.filter(s=>{if(s.dead||s.id===i.id||s.stance==="friendly")return!1;const r=Math.abs(i.x-s.x)+Math.abs(i.y-s.y),a=n==="spark"?3:4;return r<(n==="shot"?2:1)||r>a?!1:Math.abs(e.heightAt(i.x,i.y)-e.heightAt(s.x,s.y))<=3});if(n==="strike"||n==="slash"||n==="pounce"||n==="hook"||i.role==="striker"){const s=n==="strike"?3:2;return _a({...i,rangeMin:1,rangeMax:1},e,t).filter(r=>Math.abs(e.heightAt(i.x,i.y)-e.heightAt(r.x,r.y))<=s)}return _a(i,e,t)}function nu(i,e,t){const n=new Set;for(const s of _a(i,e,t))n.add(Ke(s.x,s.y));return n}function er(i,e){const t=new Set,n=i.rangeMin??1,s=i.rangeMax??1;for(let r=0;r<e.h;r++)for(let a=0;a<e.w;a++){const o=Math.abs(i.x-a)+Math.abs(i.y-r);o>=n&&o<=s&&e.inBounds(a,r)&&t.add(Ke(a,r))}return t}function iu(i,e){const t=i.skillKind;if(t==="halt"||i.role==="controller"){const n=new Set;for(let s=0;s<e.h;s++)for(let r=0;r<e.w;r++)Math.abs(i.x-r)+Math.abs(i.y-s)<=3&&n.add(Ke(r,s));return n}if(t==="heal"||i.role==="support"){const n=new Set;for(const s of _s){const r=i.x+s.x,a=i.y+s.y;e.inBounds(r,a)&&n.add(Ke(r,a))}return n.add(Ke(i.x,i.y)),n}if(t==="spark"){const n={...i,rangeMin:1,rangeMax:3};return er(n,e)}if(t==="shot"){const n={...i,rangeMin:2,rangeMax:4};return er(n,e)}return er({...i,rangeMin:1,rangeMax:1},e)}function Dc(i,e){const t=e.x-i.x,n=e.y-i.y,s=_s[i.dir],r=t*s.x+n*s.y;return r>0?"front":r<0?"back":"side"}function cr(i,e,t,n=!1){const s=Dc(e,i);let r=i.atk+(i.atkBuff||0)-Math.floor(e.def*.5);const a=t.heightAt(i.x,i.y)-t.heightAt(e.x,e.y);if(a>0&&(r+=3),a<0&&(r-=2),s==="side"&&(r=Math.floor(r*1.25)),s==="back"&&(r=Math.floor(r*1.5)),n)switch(i.skillKind){case"strike":r=Math.floor(r*1.4);break;case"slash":r=Math.floor(r*1.3);break;case"spark":r=i.atk+(i.atkBuff||0)-Math.floor(e.def*.2)+(a>0?2:0);break;case"pounce":r=Math.floor(r*1.35);break;case"hook":r=Math.floor(r*1.45);break;case"shot":r=Math.floor(r*1.15);break;default:i.role==="striker"&&(r=Math.floor(r*1.4))}return{dmg:Math.max(1,r),face:s,dh:a}}const su={front:"正面",side:"側面 +25%",back:"背面 +50%"};function ya(i,e,t,n=!1){const{dmg:s,face:r,dh:a}=cr(i,e,t,n),o=[su[r]];return a>0&&o.push("高地 +3"),a<0&&o.push("仰攻 −2"),n&&i.skillName&&o.push(i.skillName),{kind:n?"skill":"attack",actor:i,target:e,label:n?`${i.skillName}　${i.name} → ${e.name}`:`${i.name} → ${e.name}`,detail:`${s} 傷害　${o.join("　")}`,dmg:s,heal:0,skip:!1,face:r}}function il(i,e,t){const n=i.skillKind;return n==="halt"||i.role==="controller"?{kind:"skill",actor:i,target:e,label:`${i.skillName}　${i.name} → ${e.name}`,detail:"下回合無法行動　並造成 4 傷害",dmg:4,heal:0,skip:!0,face:Dc(e,i)}:n==="heal"||i.role==="support"?{kind:"skill",actor:i,target:e,label:`${i.skillName}　${i.name} → ${e.name}`,detail:"回復 16 生命",dmg:0,heal:16,skip:!1,face:"front"}:ya(i,e,t,!0)}function xo(i,e){return i.behaviour==="indiscriminate"?e.filter(t=>!t.dead&&t.id!==i.id):i.behaviour==="flee"||i.behaviour==="idle"?[]:e.filter(t=>!t.dead&&t.id!==i.id&&Ic(i,t))}function _o(i,e){return e.length?e.slice().sort((t,n)=>Un(i,t)-Un(i,n))[0]:null}function ru(i,e,t,n,s){return i.behaviour==="idle"||i.mov<=0?{unit:i,dest:{x:i.x,y:i.y},path:[{x:i.x,y:i.y}],target:null,useSkill:!1}:i.behaviour==="flee"?au(i,e,t):s==="L"?ou(i,e,t):s==="H"?cu(i,e,t,n):lu(i,e,t,n)}function au(i,e,t){const n=Ts(i,e,t),s=t.filter(o=>!o.dead&&o.id!==i.id&&Qn(o)==="hostile");let r={x:i.x,y:i.y},a=-1;for(const[o]of n.cost){const l=On(o),c=_o(l,s),h=c?Un(l,c):8,f=Math.min(l.x,l.y,e.w-1-l.x,e.h-1-l.y),u=h*10-f;u>a&&(a=u,r=l)}return{unit:i,dest:r,path:jn(n,r),target:null,useSkill:!1}}function vo(i,e,t,n,s,r){if(i.skillUsed||!i.skillName)return!1;const a={...i,x:e.x,y:e.y};if(!va(a,n,s).some(c=>c.id===t.id)||i.skillKind==="heal")return!1;const l=r==="H"?.8:r==="L"?.25:.55;return i.skillKind==="spark"||i.skillKind==="shot"?!0:Math.random()<l}function ou(i,e,t){const n=Ts(i,e,t),s=xo(i,t);let r=null;for(const[c]of n.cost){const h=On(c);for(const f of s){if(!Xi(i,h.x,h.y,f.x,f.y,e))continue;const u=Un(i,h),g=400-Un(i,f)*20-u;(!r||g>r.score)&&(r={dest:h,target:f,score:g})}}if(r)return{unit:i,dest:r.dest,path:jn(n,r.dest),target:r.target,useSkill:vo(i,r.dest,r.target,e,t,"L")};const a=_o(i,s);let o={x:i.x,y:i.y},l=1e9;if(a)for(const[c]of n.cost){const h=On(c);let f=Un(h,a);i.rangeMin>1&&(f=Math.abs(f-i.rangeMin)),f<l&&(l=f,o=h)}return{unit:i,dest:o,path:jn(n,o),target:null,useSkill:!1}}function lu(i,e,t,n){const s=Ts(i,e,t),r=xo(i,t);let a=null;for(const[c]of s.cost){const h=On(c);for(const f of r){if(!Xi(i,h.x,h.y,f.x,f.y,e))continue;const u={...i,x:h.x,y:h.y},{dmg:d,face:g,dh:v}=cr(u,f,e);let p=d*10+(f.hp<=d?80:0);if(f.role==="support"&&(p+=6),f.id===n&&(p+=14),g==="back"&&(p+=8),v>0&&(p+=4),i.role==="elite"&&(p+=2),i.rangeMin>1){const m=Un(h,f);m>=i.rangeMin&&(p+=6),m===1&&i.archetype==="gunner"&&(p-=12)}(!a||p>a.score)&&(a={dest:h,target:f,score:p})}}if(a)return{unit:i,dest:a.dest,path:jn(s,a.dest),target:a.target,useSkill:vo(i,a.dest,a.target,e,t,"M")};let o={x:i.x,y:i.y},l=99;for(const c of r)for(const[h]of s.cost){const f=On(h);let u=Math.abs(f.x-c.x)+Math.abs(f.y-c.y);i.rangeMin>1&&(u=Math.abs(u-Math.max(2,i.rangeMin)));const d=e.heightAt(i.x,i.y)-e.heightAt(f.x,f.y);let g=u;c.id===n&&(g-=2),i.role==="elite"&&d>0&&(g+=1.4),g<l&&(l=g,o=f)}return{unit:i,dest:o,path:jn(s,o),target:null,useSkill:!1}}function cu(i,e,t,n){const s=Ts(i,e,t),r=xo(i,t),a=n?r.find(g=>g.id===n):void 0,l=r.filter(g=>!g.npc).reduce((g,v)=>g+v.hp,0),c=!!a&&a.hp*3<=Math.max(1,l);let h=null;for(const[g]of s.cost){const v=On(g);for(const p of r){if(!Xi(i,v.x,v.y,p.x,p.y,e))continue;const m={...i,x:v.x,y:v.y},{dmg:S,face:T,dh:y}=cr(m,p,e),A=1-p.hp/Math.max(1,p.maxHp);let b=S*12+A*40;p.hp<=S&&(b+=110),T==="back"&&(b+=22),T==="side"&&(b+=12),y>0&&(b+=10),y<0&&(b-=6),p.role==="support"&&(b+=8),p.id===n&&(b+=c||p.hp<=16?56:20,p.hp<=S&&(b+=40)),i.role==="elite"&&(b+=3),i.rangeMin>1&&Un(v,p)===1&&i.archetype==="gunner"&&(b-=20),(!h||b>h.score)&&(h={dest:v,target:p,score:b})}}if(h)return{unit:i,dest:h.dest,path:jn(s,h.dest),target:h.target,useSkill:vo(i,h.dest,h.target,e,t,"H")};const f=a&&(c||a.hp/a.maxHp<.65)?a:r.slice().sort((g,v)=>g.hp/g.maxHp-v.hp/v.maxHp)[0];let u={x:i.x,y:i.y},d=-1e9;for(const[g]of s.cost){const v=On(g),p=f??_o(v,r);if(!p)continue;let m=Un(v,p);i.rangeMin>1&&(m=Math.abs(m-Math.max(2,i.rangeMin)));let S=-m*10+e.heightAt(v.x,v.y)*5;if(Xi(i,v.x,v.y,p.x,p.y,e)){const T={...i,x:v.x,y:v.y},{face:y,dh:A}=cr(T,p,e);y==="back"&&(S+=24),y==="side"&&(S+=12),A>0&&(S+=8)}p.id===n&&(S+=6),S+=(1-p.hp/Math.max(1,p.maxHp))*8,S>d&&(d=S,u=v)}return{unit:i,dest:u,path:jn(s,u),target:null,useSkill:!1}}class hu{constructor(e,t){q(this,"pointers",new Map);q(this,"lastPinch",0);q(this,"lastAngle",0);q(this,"lastCentroid",null);q(this,"dragging",!1);q(this,"start",null);q(this,"moved",0);q(this,"right",!1);q(this,"pinchGrid",null);q(this,"onTap",()=>{});this.canvas=e,this.renderer=t,e.addEventListener("pointerdown",n=>this.down(n)),e.addEventListener("pointermove",n=>this.move(n)),e.addEventListener("pointerup",n=>this.up(n)),e.addEventListener("pointercancel",n=>this.up(n)),e.addEventListener("contextmenu",n=>n.preventDefault()),e.addEventListener("wheel",n=>{n.preventDefault(),this.zoomAt(n.clientX,n.clientY,n.deltaY<0?1.08:.92)},{passive:!1})}pos(e){const t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}centroid(){const e=[...this.pointers.values()];let t=0,n=0;for(const s of e)t+=s.x,n+=s.y;return{x:t/e.length,y:n/e.length}}down(e){this.canvas.setPointerCapture(e.pointerId);const t=this.pos(e);if(this.pointers.set(e.pointerId,t),e.button===2&&(this.right=!0),this.pointers.size===1)this.start=t,this.moved=0,this.dragging=!1;else if(this.pointers.size===2){this.lastPinch=this.pinchDist(),this.lastAngle=this.pinchAngle();const n=this.centroid();this.lastCentroid=n,this.pinchGrid=this.renderer.screenToGrid(n.x,n.y),this.dragging=!0}}move(e){if(!this.pointers.has(e.pointerId))return;const t=this.pos(e),n=this.pointers.get(e.pointerId);if(this.pointers.set(e.pointerId,t),this.pointers.size===2){const a=this.pinchDist(),o=this.pinchAngle(),l=this.centroid();if(this.lastPinch>0){const c=a/this.lastPinch;this.renderer.yaw-=o-this.lastAngle,this.lastCentroid&&this.renderer.addPitch(l.y-this.lastCentroid.y),this.zoomAtScreen(l.x,l.y,c),this.pinchGrid&&this.renderer.lockGridToScreen(this.pinchGrid.x,this.pinchGrid.y,0,l.x,l.y)}this.lastPinch=a,this.lastAngle=o,this.lastCentroid=l,this.dragging=!0;return}const s=t.x-n.x,r=t.y-n.y;if(this.moved+=Math.hypot(s,r),this.moved>10&&(this.dragging=!0),this.right){const a=this.renderer.screenToGrid(this.renderer.w/2,this.renderer.h/2);this.renderer.yaw+=s*.01,this.renderer.addPitch(r),this.renderer.lockGridToScreen(a.x,a.y,0,this.renderer.w/2,this.renderer.h/2);return}if(this.dragging){const a=this.renderer.cam.zoom;this.renderer.cam.x-=s/a,this.renderer.cam.y-=r/a}}up(e){const t=this.pointers.get(e.pointerId);this.pointers.delete(e.pointerId),e.button===2&&(this.right=!1),this.pointers.size<2&&(this.lastPinch=0,this.pinchGrid=null,this.lastCentroid=null),this.pointers.size===0?(!this.dragging&&this.start&&t&&this.onTap(t),this.start=null,this.dragging=!1,this.moved=0,this.right=!1):this.dragging=!0}pinchDist(){const e=[...this.pointers.values()];return e.length<2?0:Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y)}pinchAngle(){const e=[...this.pointers.values()];return e.length<2?0:Math.atan2(e[1].y-e[0].y,e[1].x-e[0].x)}zoomAt(e,t,n){const s=this.canvas.getBoundingClientRect();this.zoomAtScreen(e-s.left,t-s.top,n)}zoomAtScreen(e,t,n){const s=this.renderer.cam,r=s.x+(e-this.renderer.w/2)/s.zoom,a=s.y+(t-this.renderer.h/2)/s.zoom;s.zoom=Math.min(1.8,Math.max(.55,s.zoom*n)),s.x=r-(e-this.renderer.w/2)/s.zoom,s.y=a-(t-this.renderer.h/2)/s.zoom}}const sl=14,uu=5,fu=9,Ti={bandage:{id:"bandage",name:"繃帶",hint:"回復 14 生命。"},stim:{id:"stim",name:"提神",hint:"下次攻擊 +5。"}},wi=[{id:"bandage",qty:2},{id:"stim",qty:1}];function Qt(i){return i.map(e=>({id:e.id,qty:e.qty})).filter(e=>e.qty>0)}function wr(i,e,t=1){const n=i.find(a=>a.id===e),s=n?.qty??0,r=Math.min(t,fu-s);return r<=0?0:(n?n.qty+=r:i.push({id:e,qty:r}),r)}function du(i,e){const t=i.find(n=>n.id===e);if(!t||t.qty<=0)return!1;if(t.qty-=1,t.qty<=0){const n=i.indexOf(t);n>=0&&i.splice(n,1)}return!0}function Ar(i){return i.filter(e=>!e.dead&&(e.stance==="friendly"||e.team==="player"))}const Rr=8,rl=12;function pu(i,e){const n={id:`obj-${i.type}-${e}-${i.x}-${i.y}`,x:i.x,y:i.y,type:i.type,gone:!1,used:!1,item:i.item,unblock:i.unblock??[],healAdj:i.healAdj??0};switch(i.type){case"kit":return{...n,kind:"pickup",hp:1,maxHp:1,label:"急救包",standH:0,item:i.item??"bandage"};case"switch":return{...n,kind:"trigger",hp:1,maxHp:1,label:"開關",standH:0};case"van":return{...n,kind:"trigger",hp:1,maxHp:1,label:"貨車門",standH:0};case"barrel":return{...n,kind:"destructible",hp:rl,maxHp:rl,label:"油桶",standH:0};case"crate":return{...n,kind:"platform",hp:1,maxHp:1,label:"貨箱",standH:1};case"pallet":return{...n,kind:"platform",hp:1,maxHp:1,label:"棧板",standH:1}}}function mu(i){return i.gone?!1:i.kind==="destructible"||i.type==="van"&&!i.used}function gu(i){const e=new Map;for(const t of i)t.gone||e.set(Ke(t.x,t.y),t);return e}class Cr{constructor(e){q(this,"w");q(this,"h");q(this,"theme");q(this,"tiles",[]);q(this,"objects",[]);this.w=e.w,this.h=e.h,this.theme=e.theme??"roof";const t=new Map;for(const[s,r,a]of e.blocked)t.set(Ke(s,r),a);const n=new Set((e.lamps??[]).map(([s,r])=>Ke(s,r)));for(let s=0;s<e.h;s++){const r=[],a=e.heights[s]??"";for(let o=0;o<e.w;o++){const l=Number(a[o]??"0");let c="street";l===2?c="roof":l===1&&(c="stairs");const h=t.get(Ke(o,s))??(n.has(Ke(o,s))?"lamp":void 0);r.push({x:o,y:s,h:l,terrain:c,blocked:h==="stall"||h==="ac"||h==="crate",prop:h})}this.tiles.push(r)}this.objects=(e.objects??[]).map((s,r)=>pu(s,r))}inBounds(e,t){return e>=0&&t>=0&&e<this.w&&t<this.h}tile(e,t){return this.inBounds(e,t)?this.tiles[t][e]:null}objAt(e,t){return gu(this.objects).get(Ke(e,t))}heightAt(e,t){const n=this.tile(e,t);if(!n)return 0;const s=this.objAt(e,t),r=s&&!s.gone&&s.kind==="platform"?s.standH:0;return n.h+r}walkable(e,t){const n=this.tile(e,t);if(!n||n.blocked)return!1;const s=this.objAt(e,t);return!(s&&mu(s))}unblock(e,t){const n=this.tile(e,t);n&&(n.blocked=!1,(n.prop==="crate"||n.prop==="stall")&&(n.prop=void 0))}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const yo="185",xu=0,al=1,_u=2,tr=1,vu=2,hs=3,ei=0,Xt=1,In=2,Nn=0,Gi=1,ol=2,ll=3,cl=4,yu=5,ci=100,Mu=101,Su=102,bu=103,Eu=104,Tu=200,wu=201,Au=202,Ru=203,Ma=204,Sa=205,Cu=206,Pu=207,Lu=208,Iu=209,Du=210,Uu=211,Nu=212,Fu=213,Ou=214,ba=0,Ea=1,Ta=2,qi=3,wa=4,Aa=5,Ra=6,Ca=7,Uc=0,ku=1,Bu=2,yn=0,Nc=1,Fc=2,Oc=3,kc=4,Bc=5,zc=6,Hc=7,Gc=300,xi=301,Yi=302,Pr=303,Lr=304,xr=306,Pa=1e3,Dn=1001,La=1002,Lt=1003,zu=1004,Ps=1005,Ft=1006,Ir=1007,di=1008,Zt=1009,Vc=1010,Wc=1011,vs=1012,Mo=1013,Sn=1014,_n=1015,kn=1016,So=1017,bo=1018,ys=1020,Xc=35902,qc=35899,Yc=1021,$c=1022,cn=1023,Bn=1026,pi=1027,Kc=1028,Eo=1029,_i=1030,To=1031,wo=1033,nr=33776,ir=33777,sr=33778,rr=33779,Ia=35840,Da=35841,Ua=35842,Na=35843,Fa=36196,Oa=37492,ka=37496,Ba=37488,za=37489,hr=37490,Ha=37491,Ga=37808,Va=37809,Wa=37810,Xa=37811,qa=37812,Ya=37813,$a=37814,Ka=37815,Za=37816,Ja=37817,Qa=37818,ja=37819,eo=37820,to=37821,no=36492,io=36494,so=36495,ro=36283,ao=36284,ur=36285,oo=36286,Hu=3200,lo=0,Gu=1,Zn="",Kt="srgb",fr="srgb-linear",dr="linear",tt="srgb",Ai=7680,hl=519,Vu=512,Wu=513,Xu=514,Ao=515,qu=516,Yu=517,Ro=518,$u=519,ul=35044,fl="300 es",vn=2e3,Ms=2001;function Ku(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function pr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Zu(){const i=pr("canvas");return i.style.display="block",i}const dl={};function pl(...i){const e="THREE."+i.shift();console.log(e,...i)}function Zc(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Le(...i){i=Zc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function $e(...i){i=Zc(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Vi(...i){const e=i.join(" ");e in dl||(dl[e]=!0,Le(...i))}function Ju(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Qu={[ba]:Ea,[Ta]:Ra,[wa]:Ca,[qi]:Aa,[Ea]:ba,[Ra]:Ta,[Ca]:wa,[Aa]:qi};class yi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ut=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Dr=Math.PI/180,co=180/Math.PI;function Ji(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ut[i&255]+Ut[i>>8&255]+Ut[i>>16&255]+Ut[i>>24&255]+"-"+Ut[e&255]+Ut[e>>8&255]+"-"+Ut[e>>16&15|64]+Ut[e>>24&255]+"-"+Ut[t&63|128]+Ut[t>>8&255]+"-"+Ut[t>>16&255]+Ut[t>>24&255]+Ut[n&255]+Ut[n>>8&255]+Ut[n>>16&255]+Ut[n>>24&255]).toLowerCase()}function He(i,e,t){return Math.max(e,Math.min(t,i))}function ju(i,e){return(i%e+e)%e}function Ur(i,e,t){return(1-t)*i+t*e}function is(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Vt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const ko=class ko{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};ko.prototype.isVector2=!0;let ce=ko;class Qi{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[a+0],d=r[a+1],g=r[a+2],v=r[a+3];if(f!==v||l!==u||c!==d||h!==g){let p=l*u+c*d+h*g+f*v;p<0&&(u=-u,d=-d,g=-g,v=-v,p=-p);let m=1-o;if(p<.9995){const S=Math.acos(p),T=Math.sin(S);m=Math.sin(m*S)/T,o=Math.sin(o*S)/T,l=l*m+u*o,c=c*m+d*o,h=h*m+g*o,f=f*m+v*o}else{l=l*m+u*o,c=c*m+d*o,h=h*m+g*o,f=f*m+v*o;const S=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=S,c*=S,h*=S,f*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[a],u=r[a+1],d=r[a+2],g=r[a+3];return e[t]=o*g+h*f+l*d-c*u,e[t+1]=l*g+h*u+c*f-o*d,e[t+2]=c*g+h*d+o*u-l*f,e[t+3]=h*g-o*f-l*u-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),f=o(r/2),u=l(n/2),d=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f-u*d*g;break;case"YXZ":this._x=u*h*f+c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f+u*d*g;break;case"ZXY":this._x=u*h*f-c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f-u*d*g;break;case"ZYX":this._x=u*h*f-c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f+u*d*g;break;case"YZX":this._x=u*h*f+c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f-u*d*g;break;case"XZY":this._x=u*h*f-c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f+u*d*g;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],u=n+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-s)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(He(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Bo=class Bo{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ml.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ml.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=s+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nr.copy(this).projectOnVector(e),this.sub(Nr)}reflect(e){return this.sub(Nr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(He(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Bo.prototype.isVector3=!0;let I=Bo;const Nr=new I,ml=new Qi,zo=class zo{constructor(e,t,n,s,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],g=n[8],v=s[0],p=s[3],m=s[6],S=s[1],T=s[4],y=s[7],A=s[2],b=s[5],R=s[8];return r[0]=a*v+o*S+l*A,r[3]=a*p+o*T+l*b,r[6]=a*m+o*y+l*R,r[1]=c*v+h*S+f*A,r[4]=c*p+h*T+f*b,r[7]=c*m+h*y+f*R,r[2]=u*v+d*S+g*A,r[5]=u*p+d*T+g*b,r[8]=u*m+d*y+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,g=t*f+n*u+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=f*v,e[1]=(s*c-h*n)*v,e[2]=(o*n-s*a)*v,e[3]=u*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return Vi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Fr.makeScale(e,t)),this}rotate(e){return Vi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Fr.makeRotation(-e)),this}translate(e,t){return Vi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Fr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};zo.prototype.isMatrix3=!0;let Ne=zo;const Fr=new Ne,gl=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xl=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ef(){const i={enabled:!0,workingColorSpace:fr,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===tt&&(s.r=Fn(s.r),s.g=Fn(s.g),s.b=Fn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===tt&&(s.r=Wi(s.r),s.g=Wi(s.g),s.b=Wi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Zn?dr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Vi("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Vi("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[fr]:{primaries:e,whitePoint:n,transfer:dr,toXYZ:gl,fromXYZ:xl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Kt},outputColorSpaceConfig:{drawingBufferColorSpace:Kt}},[Kt]:{primaries:e,whitePoint:n,transfer:tt,toXYZ:gl,fromXYZ:xl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Kt}}}),i}const Ve=ef();function Fn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Wi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Ri;class tf{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ri===void 0&&(Ri=pr("canvas")),Ri.width=e.width,Ri.height=e.height;const s=Ri.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Ri}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=pr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Fn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Fn(t[n]/255)*255):t[n]=Fn(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nf=0;class Co{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nf++}),this.uuid=Ji(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Or(s[a].image)):r.push(Or(s[a]))}else r=Or(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Or(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?tf.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let sf=0;const kr=new I;class Ht extends yi{constructor(e=Ht.DEFAULT_IMAGE,t=Ht.DEFAULT_MAPPING,n=Dn,s=Dn,r=Ft,a=di,o=cn,l=Zt,c=Ht.DEFAULT_ANISOTROPY,h=Zn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sf++}),this.uuid=Ji(),this.name="",this.source=new Co(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ce(0,0),this.repeat=new ce(1,1),this.center=new ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(kr).x}get height(){return this.source.getSize(kr).y}get depth(){return this.source.getSize(kr).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Pa:e.x=e.x-Math.floor(e.x);break;case Dn:e.x=e.x<0?0:1;break;case La:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Pa:e.y=e.y-Math.floor(e.y);break;case Dn:e.y=e.y<0?0:1;break;case La:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ht.DEFAULT_IMAGE=null;Ht.DEFAULT_MAPPING=Gc;Ht.DEFAULT_ANISOTROPY=1;const Ho=class Ho{constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],g=l[9],v=l[2],p=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+v)<.1&&Math.abs(g+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,y=(d+1)/2,A=(m+1)/2,b=(h+u)/4,R=(f+v)/4,_=(g+p)/4;return T>y&&T>A?T<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(T),s=b/n,r=R/n):y>A?y<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),n=b/s,r=_/s):A<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),n=R/r,s=_/r),this.set(n,s,r,t),this}let S=Math.sqrt((p-g)*(p-g)+(f-v)*(f-v)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(f-v)/S,this.z=(u-h)/S,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=He(this.x,e.x,t.x),this.y=He(this.y,e.y,t.y),this.z=He(this.z,e.z,t.z),this.w=He(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=He(this.x,e,t),this.y=He(this.y,e,t),this.z=He(this.z,e,t),this.w=He(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(He(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ho.prototype.isVector4=!0;let ut=Ho;class rf extends yi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ft,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new Ht(s),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Ft,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Co(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Mn extends rf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Jc extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class af extends Ht{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const gr=class gr{constructor(e,t,n,s,r,a,o,l,c,h,f,u,d,g,v,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,f,u,d,g,v,p)}set(e,t,n,s,r,a,o,l,c,h,f,u,d,g,v,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=u,m[3]=d,m[7]=g,m[11]=v,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new gr().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/Ci.setFromMatrixColumn(e,0).length(),r=1/Ci.setFromMatrixColumn(e,1).length(),a=1/Ci.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=a*h,d=a*f,g=o*h,v=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=d+g*c,t[5]=u-v*c,t[9]=-o*l,t[2]=v-u*c,t[6]=g+d*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,d=l*f,g=c*h,v=c*f;t[0]=u+v*o,t[4]=g*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=d*o-g,t[6]=v+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,d=l*f,g=c*h,v=c*f;t[0]=u-v*o,t[4]=-a*f,t[8]=g+d*o,t[1]=d+g*o,t[5]=a*h,t[9]=v-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,d=a*f,g=o*h,v=o*f;t[0]=l*h,t[4]=g*c-d,t[8]=u*c+v,t[1]=l*f,t[5]=v*c+u,t[9]=d*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=v-u*f,t[8]=g*f+d,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*f+g,t[10]=u-v*f}else if(e.order==="XZY"){const u=a*l,d=a*c,g=o*l,v=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=u*f+v,t[5]=a*h,t[9]=d*f-g,t[2]=g*f-d,t[6]=o*h,t[10]=v*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(of,e,lf)}lookAt(e,t,n){const s=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),Wn.crossVectors(n,Yt),Wn.lengthSq()===0&&(Math.abs(n.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),Wn.crossVectors(n,Yt)),Wn.normalize(),Ls.crossVectors(Yt,Wn),s[0]=Wn.x,s[4]=Ls.x,s[8]=Yt.x,s[1]=Wn.y,s[5]=Ls.y,s[9]=Yt.y,s[2]=Wn.z,s[6]=Ls.z,s[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],g=n[2],v=n[6],p=n[10],m=n[14],S=n[3],T=n[7],y=n[11],A=n[15],b=s[0],R=s[4],_=s[8],E=s[12],C=s[1],P=s[5],N=s[9],V=s[13],$=s[2],O=s[6],Y=s[10],H=s[14],Q=s[3],ee=s[7],fe=s[11],ge=s[15];return r[0]=a*b+o*C+l*$+c*Q,r[4]=a*R+o*P+l*O+c*ee,r[8]=a*_+o*N+l*Y+c*fe,r[12]=a*E+o*V+l*H+c*ge,r[1]=h*b+f*C+u*$+d*Q,r[5]=h*R+f*P+u*O+d*ee,r[9]=h*_+f*N+u*Y+d*fe,r[13]=h*E+f*V+u*H+d*ge,r[2]=g*b+v*C+p*$+m*Q,r[6]=g*R+v*P+p*O+m*ee,r[10]=g*_+v*N+p*Y+m*fe,r[14]=g*E+v*V+p*H+m*ge,r[3]=S*b+T*C+y*$+A*Q,r[7]=S*R+T*P+y*O+A*ee,r[11]=S*_+T*N+y*Y+A*fe,r[15]=S*E+T*V+y*H+A*ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],u=e[10],d=e[14],g=e[3],v=e[7],p=e[11],m=e[15],S=l*d-c*u,T=o*d-c*f,y=o*u-l*f,A=a*d-c*h,b=a*u-l*h,R=a*f-o*h;return t*(v*S-p*T+m*y)-n*(g*S-p*A+m*b)+s*(g*T-v*A+m*R)-r*(g*y-v*b+p*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+s*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],u=e[10],d=e[11],g=e[12],v=e[13],p=e[14],m=e[15],S=t*o-n*a,T=t*l-s*a,y=t*c-r*a,A=n*l-s*o,b=n*c-r*o,R=s*c-r*l,_=h*v-f*g,E=h*p-u*g,C=h*m-d*g,P=f*p-u*v,N=f*m-d*v,V=u*m-d*p,$=S*V-T*N+y*P+A*C-b*E+R*_;if($===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/$;return e[0]=(o*V-l*N+c*P)*O,e[1]=(s*N-n*V-r*P)*O,e[2]=(v*R-p*b+m*A)*O,e[3]=(u*b-f*R-d*A)*O,e[4]=(l*C-a*V-c*E)*O,e[5]=(t*V-s*C+r*E)*O,e[6]=(p*y-g*R-m*T)*O,e[7]=(h*R-u*y+d*T)*O,e[8]=(a*N-o*C+c*_)*O,e[9]=(n*C-t*N-r*_)*O,e[10]=(g*b-v*y+m*S)*O,e[11]=(f*y-h*b-d*S)*O,e[12]=(o*E-a*P-l*_)*O,e[13]=(t*P-n*E+s*_)*O,e[14]=(v*T-g*A-p*S)*O,e[15]=(h*A-f*T+u*S)*O,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,g=r*f,v=a*h,p=a*f,m=o*f,S=l*c,T=l*h,y=l*f,A=n.x,b=n.y,R=n.z;return s[0]=(1-(v+m))*A,s[1]=(d+y)*A,s[2]=(g-T)*A,s[3]=0,s[4]=(d-y)*b,s[5]=(1-(u+m))*b,s[6]=(p+S)*b,s[7]=0,s[8]=(g+T)*R,s[9]=(p-S)*R,s[10]=(1-(u+v))*R,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=Ci.set(s[0],s[1],s[2]).length();const o=Ci.set(s[4],s[5],s[6]).length(),l=Ci.set(s[8],s[9],s[10]).length();r<0&&(a=-a),tn.copy(this);const c=1/a,h=1/o,f=1/l;return tn.elements[0]*=c,tn.elements[1]*=c,tn.elements[2]*=c,tn.elements[4]*=h,tn.elements[5]*=h,tn.elements[6]*=h,tn.elements[8]*=f,tn.elements[9]*=f,tn.elements[10]*=f,t.setFromRotationMatrix(tn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,s,r,a,o=vn,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===vn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Ms)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=vn,l=!1){const c=this.elements,h=2/(t-e),f=2/(n-s),u=-(t+e)/(t-e),d=-(n+s)/(n-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===vn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===Ms)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};gr.prototype.isMatrix4=!0;let at=gr;const Ci=new I,tn=new at,of=new I(0,0,0),lf=new I(1,1,1),Wn=new I,Ls=new I,Yt=new I,_l=new at,vl=new Qi;class ti{constructor(e=0,t=0,n=0,s=ti.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(He(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-He(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(He(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-He(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(He(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-He(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return _l.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_l,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return vl.setFromEuler(this),this.setFromQuaternion(vl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ti.DEFAULT_ORDER="XYZ";class Qc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let cf=0;const yl=new I,Pi=new Qi,Tn=new at,Is=new I,ss=new I,hf=new I,uf=new Qi,Ml=new I(1,0,0),Sl=new I(0,1,0),bl=new I(0,0,1),El={type:"added"},ff={type:"removed"},Li={type:"childadded",child:null},Br={type:"childremoved",child:null};class It extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=Ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=It.DEFAULT_UP.clone();const e=new I,t=new ti,n=new Qi,s=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new at},normalMatrix:{value:new Ne}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=It.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Qc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.multiply(Pi),this}rotateOnWorldAxis(e,t){return Pi.setFromAxisAngle(e,t),this.quaternion.premultiply(Pi),this}rotateX(e){return this.rotateOnAxis(Ml,e)}rotateY(e){return this.rotateOnAxis(Sl,e)}rotateZ(e){return this.rotateOnAxis(bl,e)}translateOnAxis(e,t){return yl.copy(e).applyQuaternion(this.quaternion),this.position.add(yl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Ml,e)}translateY(e){return this.translateOnAxis(Sl,e)}translateZ(e){return this.translateOnAxis(bl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Is.copy(e):Is.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(ss,Is,this.up):Tn.lookAt(Is,ss,this.up),this.quaternion.setFromRotationMatrix(Tn),s&&(Tn.extractRotation(s.matrixWorld),Pi.setFromRotationMatrix(Tn),this.quaternion.premultiply(Pi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?($e("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(El),Li.child=e,this.dispatchEvent(Li),Li.child=null):$e("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ff),Br.child=e,this.dispatchEvent(Br),Br.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(El),Li.child=e,this.dispatchEvent(Li),Li.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,e,hf),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,uf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),this.static!==!1&&(s.static=this.static),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),d=a(e.animations),g=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}It.DEFAULT_UP=new I(0,1,0);It.DEFAULT_MATRIX_AUTO_UPDATE=!0;It.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class We extends It{constructor(){super(),this.isGroup=!0,this.type="Group"}}const df={type:"move"};class zr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new We,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new We,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new We,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,n),m=this._getHandJoint(c,v);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&u>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(df)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new We;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const jc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xn={h:0,s:0,l:0},Ds={h:0,s:0,l:0};function Hr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ve.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ve.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ve.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ve.workingColorSpace){if(e=ju(e,1),t=He(t,0,1),n=He(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Hr(a,r,e+1/3),this.g=Hr(a,r,e),this.b=Hr(a,r,e-1/3)}return Ve.colorSpaceToWorking(this,s),this}setStyle(e,t=Kt){function n(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Kt){const n=jc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fn(e.r),this.g=Fn(e.g),this.b=Fn(e.b),this}copyLinearToSRGB(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Kt){return Ve.workingToColorSpace(Nt.copy(this),e),Math.round(He(Nt.r*255,0,255))*65536+Math.round(He(Nt.g*255,0,255))*256+Math.round(He(Nt.b*255,0,255))}getHexString(e=Kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ve.workingColorSpace){Ve.workingToColorSpace(Nt.copy(this),t);const n=Nt.r,s=Nt.g,r=Nt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ve.workingColorSpace){return Ve.workingToColorSpace(Nt.copy(this),t),e.r=Nt.r,e.g=Nt.g,e.b=Nt.b,e}getStyle(e=Kt){Ve.workingToColorSpace(Nt.copy(this),e);const t=Nt.r,n=Nt.g,s=Nt.b;return e!==Kt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Xn),this.setHSL(Xn.h+e,Xn.s+t,Xn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Xn),e.getHSL(Ds);const n=Ur(Xn.h,Ds.h,t),s=Ur(Xn.s,Ds.s,t),r=Ur(Xn.l,Ds.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Nt=new Xe;Xe.NAMES=jc;class pf extends It{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ti,this.environmentIntensity=1,this.environmentRotation=new ti,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const nn=new I,wn=new I,Gr=new I,An=new I,Ii=new I,Di=new I,Tl=new I,Vr=new I,Wr=new I,Xr=new I,qr=new ut,Yr=new ut,$r=new ut;class on{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),nn.subVectors(e,t),s.cross(nn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){nn.subVectors(s,t),wn.subVectors(n,t),Gr.subVectors(e,t);const a=nn.dot(nn),o=nn.dot(wn),l=nn.dot(Gr),c=wn.dot(wn),h=wn.dot(Gr),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,g=(a*h-o*l)*u;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,An)===null?!1:An.x>=0&&An.y>=0&&An.x+An.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,An)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,An.x),l.addScaledVector(a,An.y),l.addScaledVector(o,An.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return qr.setScalar(0),Yr.setScalar(0),$r.setScalar(0),qr.fromBufferAttribute(e,t),Yr.fromBufferAttribute(e,n),$r.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(qr,r.x),a.addScaledVector(Yr,r.y),a.addScaledVector($r,r.z),a}static isFrontFacing(e,t,n,s){return nn.subVectors(n,t),wn.subVectors(e,t),nn.cross(wn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return nn.subVectors(this.c,this.b),wn.subVectors(this.a,this.b),nn.cross(wn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return on.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return on.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return on.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return on.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return on.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Ii.subVectors(s,n),Di.subVectors(r,n),Vr.subVectors(e,n);const l=Ii.dot(Vr),c=Di.dot(Vr);if(l<=0&&c<=0)return t.copy(n);Wr.subVectors(e,s);const h=Ii.dot(Wr),f=Di.dot(Wr);if(h>=0&&f<=h)return t.copy(s);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Ii,a);Xr.subVectors(e,r);const d=Ii.dot(Xr),g=Di.dot(Xr);if(g>=0&&d<=g)return t.copy(r);const v=d*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(Di,o);const p=h*g-d*f;if(p<=0&&f-h>=0&&d-g>=0)return Tl.subVectors(r,s),o=(f-h)/(f-h+(d-g)),t.copy(s).addScaledVector(Tl,o);const m=1/(p+v+u);return a=v*m,o=u*m,t.copy(n).addScaledVector(Ii,a).addScaledVector(Di,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ws{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,sn):sn.fromBufferAttribute(r,a),sn.applyMatrix4(e.matrixWorld),this.expandByPoint(sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Us.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Us.copy(n.boundingBox)),Us.applyMatrix4(e.matrixWorld),this.union(Us)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,sn),sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rs),Ns.subVectors(this.max,rs),Ui.subVectors(e.a,rs),Ni.subVectors(e.b,rs),Fi.subVectors(e.c,rs),qn.subVectors(Ni,Ui),Yn.subVectors(Fi,Ni),ii.subVectors(Ui,Fi);let t=[0,-qn.z,qn.y,0,-Yn.z,Yn.y,0,-ii.z,ii.y,qn.z,0,-qn.x,Yn.z,0,-Yn.x,ii.z,0,-ii.x,-qn.y,qn.x,0,-Yn.y,Yn.x,0,-ii.y,ii.x,0];return!Kr(t,Ui,Ni,Fi,Ns)||(t=[1,0,0,0,1,0,0,0,1],!Kr(t,Ui,Ni,Fi,Ns))?!1:(Fs.crossVectors(qn,Yn),t=[Fs.x,Fs.y,Fs.z],Kr(t,Ui,Ni,Fi,Ns))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Rn=[new I,new I,new I,new I,new I,new I,new I,new I],sn=new I,Us=new ws,Ui=new I,Ni=new I,Fi=new I,qn=new I,Yn=new I,ii=new I,rs=new I,Ns=new I,Fs=new I,si=new I;function Kr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){si.fromArray(i,r);const o=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=e.dot(si),c=t.dot(si),h=n.dot(si);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const bt=new I,Os=new ce;let mf=0;class hn extends yi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:mf++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ul,this.updateRanges=[],this.gpuType=_n,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Os.fromBufferAttribute(this,t),Os.applyMatrix3(e),this.setXY(t,Os.x,Os.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=is(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=is(t,this.array)),t}setX(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=is(t,this.array)),t}setY(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=is(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=is(t,this.array)),t}setW(e,t){return this.normalized&&(t=Vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),s=Vt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Vt(t,this.array),n=Vt(n,this.array),s=Vt(s,this.array),r=Vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ul&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class eh extends hn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class th extends hn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ot extends hn{constructor(e,t,n){super(new Float32Array(e),t,n)}}const gf=new ws,as=new I,Zr=new I;class Po{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):gf.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;as.subVectors(e,this.center);const t=as.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(as,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Zr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(as.copy(e.center).add(Zr)),this.expandByPoint(as.copy(e.center).sub(Zr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let xf=0;const jt=new at,Jr=new It,Oi=new I,$t=new ws,os=new ws,Ct=new I;class kt extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:xf++}),this.uuid=Ji(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ku(e)?th:eh)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ne().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return jt.makeRotationFromQuaternion(e),this.applyMatrix4(jt),this}rotateX(e){return jt.makeRotationX(e),this.applyMatrix4(jt),this}rotateY(e){return jt.makeRotationY(e),this.applyMatrix4(jt),this}rotateZ(e){return jt.makeRotationZ(e),this.applyMatrix4(jt),this}translate(e,t,n){return jt.makeTranslation(e,t,n),this.applyMatrix4(jt),this}scale(e,t,n){return jt.makeScale(e,t,n),this.applyMatrix4(jt),this}lookAt(e){return Jr.lookAt(e),Jr.updateMatrix(),this.applyMatrix4(Jr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Oi).negate(),this.translate(Oi.x,Oi.y,Oi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new ot(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ws);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];$t.setFromBufferAttribute(r),this.morphTargetsRelative?(Ct.addVectors(this.boundingBox.min,$t.min),this.boundingBox.expandByPoint(Ct),Ct.addVectors(this.boundingBox.max,$t.max),this.boundingBox.expandByPoint(Ct)):(this.boundingBox.expandByPoint($t.min),this.boundingBox.expandByPoint($t.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&$e('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Po);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){$e("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if($t.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];os.setFromBufferAttribute(o),this.morphTargetsRelative?(Ct.addVectors($t.min,os.min),$t.expandByPoint(Ct),Ct.addVectors($t.max,os.max),$t.expandByPoint(Ct)):($t.expandByPoint(os.min),$t.expandByPoint(os.max))}$t.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)Ct.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Ct));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ct.fromBufferAttribute(o,c),l&&(Oi.fromBufferAttribute(e,c),Ct.add(Oi)),s=Math.max(s,n.distanceToSquared(Ct))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&$e('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){$e("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new hn(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let _=0;_<n.count;_++)o[_]=new I,l[_]=new I;const c=new I,h=new I,f=new I,u=new ce,d=new ce,g=new ce,v=new I,p=new I;function m(_,E,C){c.fromBufferAttribute(n,_),h.fromBufferAttribute(n,E),f.fromBufferAttribute(n,C),u.fromBufferAttribute(r,_),d.fromBufferAttribute(r,E),g.fromBufferAttribute(r,C),h.sub(c),f.sub(c),d.sub(u),g.sub(u);const P=1/(d.x*g.y-g.x*d.y);isFinite(P)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(P),p.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(P),o[_].add(v),o[E].add(v),o[C].add(v),l[_].add(p),l[E].add(p),l[C].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let _=0,E=S.length;_<E;++_){const C=S[_],P=C.start,N=C.count;for(let V=P,$=P+N;V<$;V+=3)m(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const T=new I,y=new I,A=new I,b=new I;function R(_){A.fromBufferAttribute(s,_),b.copy(A);const E=o[_];T.copy(E),T.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(b,E);const P=y.dot(l[_])<0?-1:1;a.setXYZW(_,T.x,T.y,T.z,P)}for(let _=0,E=S.length;_<E;++_){const C=S[_],P=C.start,N=C.count;for(let V=P,$=P+N;V<$;V+=3)R(e.getX(V+0)),R(e.getX(V+1)),R(e.getX(V+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new hn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,f=new I;if(e)for(let u=0,d=e.count;u<d;u+=3){const g=e.getX(u+0),v=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,d=t.count;u<d;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ct.fromBufferAttribute(e,t),Ct.normalize(),e.setXYZ(t,Ct.x,Ct.y,Ct.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,g=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let m=0;m<h;m++)u[g++]=c[d++]}return new hn(u,h,f)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new kt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=e(u,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}let _f=0;class As extends yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_f++}),this.uuid=Ji(),this.name="",this.type="Material",this.blending=Gi,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ma,this.blendDst=Sa,this.blendEquation=ci,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ai,this.stencilZFail=Ai,this.stencilZPass=Ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(n.blending=this.blending),this.side!==ei&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ma&&(n.blendSrc=this.blendSrc),this.blendDst!==Sa&&(n.blendDst=this.blendDst),this.blendEquation!==ci&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==qi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Xe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ce().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ce().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Cn=new I,Qr=new I,ks=new I,$n=new I,jr=new I,Bs=new I,ea=new I;class vf{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Cn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Cn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Cn.copy(this.origin).addScaledVector(this.direction,t),Cn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Qr.copy(e).add(t).multiplyScalar(.5),ks.copy(t).sub(e).normalize(),$n.copy(this.origin).sub(Qr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ks),o=$n.dot(this.direction),l=-$n.dot(ks),c=$n.lengthSq(),h=Math.abs(1-a*a);let f,u,d,g;if(h>0)if(f=a*l-o,u=a*o-l,g=r*h,f>=0)if(u>=-g)if(u<=g){const v=1/h;f*=v,u*=v,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-g?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=g?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Qr).addScaledVector(ks,u),d}intersectSphere(e,t){Cn.subVectors(e.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-u.z)*f,l=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,l=(e.min.z-u.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Cn)!==null}intersectTriangle(e,t,n,s,r){jr.subVectors(t,e),Bs.subVectors(n,e),ea.crossVectors(jr,Bs);let a=this.direction.dot(ea),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$n.subVectors(this.origin,e);const l=o*this.direction.dot(Bs.crossVectors($n,Bs));if(l<0)return null;const c=o*this.direction.dot(jr.cross($n));if(c<0||l+c>a)return null;const h=-o*$n.dot(ea);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class nh extends As{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.combine=Uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wl=new at,ri=new vf,zs=new Po,Al=new I,Hs=new I,Gs=new I,Vs=new I,ta=new I,Ws=new I,Rl=new I,Xs=new I;class De extends It{constructor(e=new kt,t=new nh){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Ws.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(ta.fromBufferAttribute(f,e),a?Ws.addScaledVector(ta,h):Ws.addScaledVector(ta.sub(t),h))}t.add(Ws)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zs.copy(n.boundingSphere),zs.applyMatrix4(r),ri.copy(e.ray).recast(e.near),!(zs.containsPoint(ri.origin)===!1&&(ri.intersectSphere(zs,Al)===null||ri.origin.distanceToSquared(Al)>(e.far-e.near)**2))&&(wl.copy(r).invert(),ri.copy(e.ray).applyMatrix4(wl),!(n.boundingBox!==null&&ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ri)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=u.length;g<v;g++){const p=u[g],m=a[p.materialIndex],S=Math.max(p.start,d.start),T=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let y=S,A=T;y<A;y+=3){const b=o.getX(y),R=o.getX(y+1),_=o.getX(y+2);s=qs(this,m,e,n,c,h,f,b,R,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let p=g,m=v;p<m;p+=3){const S=o.getX(p),T=o.getX(p+1),y=o.getX(p+2);s=qs(this,a,e,n,c,h,f,S,T,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=u.length;g<v;g++){const p=u[g],m=a[p.materialIndex],S=Math.max(p.start,d.start),T=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let y=S,A=T;y<A;y+=3){const b=y,R=y+1,_=y+2;s=qs(this,m,e,n,c,h,f,b,R,_),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let p=g,m=v;p<m;p+=3){const S=p,T=p+1,y=p+2;s=qs(this,a,e,n,c,h,f,S,T,y),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function yf(i,e,t,n,s,r,a,o){let l;if(e.side===Xt?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===ei,o),l===null)return null;Xs.copy(o),Xs.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Xs);return c<t.near||c>t.far?null:{distance:c,point:Xs.clone(),object:i}}function qs(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,Hs),i.getVertexPosition(l,Gs),i.getVertexPosition(c,Vs);const h=yf(i,e,t,n,Hs,Gs,Vs,Rl);if(h){const f=new I;on.getBarycoord(Rl,Hs,Gs,Vs,f),s&&(h.uv=on.getInterpolatedAttribute(s,o,l,c,f,new ce)),r&&(h.uv1=on.getInterpolatedAttribute(r,o,l,c,f,new ce)),a&&(h.normal=on.getInterpolatedAttribute(a,o,l,c,f,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new I,materialIndex:0};on.getNormal(Hs,Gs,Vs,u.normal),h.face=u,h.barycoord=f}return h}class Mf extends Ht{constructor(e=null,t=1,n=1,s,r,a,o,l,c=Lt,h=Lt,f,u){super(null,a,o,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const na=new I,Sf=new I,bf=new Ne;class li{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=na.subVectors(n,t).cross(Sf.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(na),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(s,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||bf.getNormalMatrix(e),s=this.coplanarPoint(na).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new Po,Ef=new ce(.5,.5),Ys=new I;class Lo{constructor(e=new li,t=new li,n=new li,s=new li,r=new li,a=new li){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vn,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],g=r[8],v=r[9],p=r[10],m=r[11],S=r[12],T=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-a,d-h,m-g,A-S).normalize(),s[1].setComponents(c+a,d+h,m+g,A+S).normalize(),s[2].setComponents(c+o,d+f,m+v,A+T).normalize(),s[3].setComponents(c-o,d-f,m-v,A-T).normalize(),n)s[4].setComponents(l,u,p,y).normalize(),s[5].setComponents(c-l,d-u,m-p,A-y).normalize();else if(s[4].setComponents(c-l,d-u,m-p,A-y).normalize(),t===vn)s[5].setComponents(c+l,d+u,m+p,A+y).normalize();else if(t===Ms)s[5].setComponents(l,u,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(e){ai.center.set(0,0,0);const t=Ef.distanceTo(e.center);return ai.radius=.7071067811865476+t,ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Ys.x=s.normal.x>0?e.max.x:e.min.x,Ys.y=s.normal.y>0?e.max.y:e.min.y,Ys.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Ys)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ih extends Ht{constructor(e=[],t=xi,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $i extends Ht{constructor(e,t,n=Sn,s,r,a,o=Lt,l=Lt,c,h=Bn,f=1){if(h!==Bn&&h!==pi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Co(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Tf extends $i{constructor(e,t=Sn,n=xi,s,r,a=Lt,o=Lt,l,c=Bn){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,n,s,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class sh extends Ht{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class zn extends kt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;g("z","y","x",-1,-1,n,t,e,a,r,0),g("z","y","x",1,-1,n,t,-e,a,r,1),g("x","z","y",1,1,e,n,t,s,a,2),g("x","z","y",1,-1,e,n,-t,s,a,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(f,2));function g(v,p,m,S,T,y,A,b,R,_,E){const C=y/R,P=A/_,N=y/2,V=A/2,$=b/2,O=R+1,Y=_+1;let H=0,Q=0;const ee=new I;for(let fe=0;fe<Y;fe++){const ge=fe*P-V;for(let ye=0;ye<O;ye++){const Ze=ye*C-N;ee[v]=Ze*S,ee[p]=ge*T,ee[m]=$,c.push(ee.x,ee.y,ee.z),ee[v]=0,ee[p]=0,ee[m]=b>0?1:-1,h.push(ee.x,ee.y,ee.z),f.push(ye/R),f.push(1-fe/_),H+=1}}for(let fe=0;fe<_;fe++)for(let ge=0;ge<R;ge++){const ye=u+ge+O*fe,Ze=u+ge+O*(fe+1),pt=u+(ge+1)+O*(fe+1),Je=u+(ge+1)+O*fe;l.push(ye,Ze,Je),l.push(Ze,pt,Je),Q+=6}o.addGroup(d,Q,E),d+=Q,u+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ot extends kt{constructor(e=1,t=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:s,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,f=Math.PI/2*e,u=t,d=2*f+u,g=n*2+r,v=s+1,p=new I,m=new I;for(let S=0;S<=g;S++){let T=0,y=0,A=0,b=0;if(S<=n){const E=S/n,C=E*Math.PI/2;y=-h-e*Math.cos(C),A=e*Math.sin(C),b=-e*Math.cos(C),T=E*f}else if(S<=n+r){const E=(S-n)/r;y=-h+E*t,A=e,b=0,T=f+E*u}else{const E=(S-n-r)/n,C=E*Math.PI/2;y=h+e*Math.sin(C),A=e*Math.cos(C),b=e*Math.sin(C),T=f+u+E*f}const R=Math.max(0,Math.min(1,T/d));let _=0;S===0?_=.5/s:S===g&&(_=-.5/s);for(let E=0;E<=s;E++){const C=E/s,P=C*Math.PI*2,N=Math.sin(P),V=Math.cos(P);m.x=-A*V,m.y=y,m.z=A*N,o.push(m.x,m.y,m.z),p.set(-A*V,b,A*N),p.normalize(),l.push(p.x,p.y,p.z),c.push(C+_,R)}if(S>0){const E=(S-1)*v;for(let C=0;C<s;C++){const P=E+C,N=E+C+1,V=S*v+C,$=S*v+C+1;a.push(P,N,V),a.push(N,$,V)}}}this.setIndex(a),this.setAttribute("position",new ot(o,3)),this.setAttribute("normal",new ot(l,3)),this.setAttribute("uv",new ot(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class gi extends kt{constructor(e=1,t=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],u=[],d=[];let g=0;const v=[],p=n/2;let m=0;S(),a===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new ot(f,3)),this.setAttribute("normal",new ot(u,3)),this.setAttribute("uv",new ot(d,2));function S(){const y=new I,A=new I;let b=0;const R=(t-e)/n;for(let _=0;_<=r;_++){const E=[],C=_/r,P=C*(t-e)+e;for(let N=0;N<=s;N++){const V=N/s,$=V*l+o,O=Math.sin($),Y=Math.cos($);A.x=P*O,A.y=-C*n+p,A.z=P*Y,f.push(A.x,A.y,A.z),y.set(O,R,Y).normalize(),u.push(y.x,y.y,y.z),d.push(V,1-C),E.push(g++)}v.push(E)}for(let _=0;_<s;_++)for(let E=0;E<r;E++){const C=v[E][_],P=v[E+1][_],N=v[E+1][_+1],V=v[E][_+1];(e>0||E!==0)&&(h.push(C,P,V),b+=3),(t>0||E!==r-1)&&(h.push(P,N,V),b+=3)}c.addGroup(m,b,0),m+=b}function T(y){const A=g,b=new ce,R=new I;let _=0;const E=y===!0?e:t,C=y===!0?1:-1;for(let N=1;N<=s;N++)f.push(0,p*C,0),u.push(0,C,0),d.push(.5,.5),g++;const P=g;for(let N=0;N<=s;N++){const $=N/s*l+o,O=Math.cos($),Y=Math.sin($);R.x=E*Y,R.y=p*C,R.z=E*O,f.push(R.x,R.y,R.z),u.push(0,C,0),b.x=O*.5+.5,b.y=Y*.5*C+.5,d.push(b.x,b.y),g++}for(let N=0;N<s;N++){const V=A+N,$=P+N;y===!0?h.push($,$+1,V):h.push($+1,$,V),_+=3}c.addGroup(m,_,y===!0?1:2),m+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Io extends gi{constructor(e=1,t=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Io(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class En{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Le("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);const h=n[s],u=n[s+1]-h,d=(a-h)/u;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new ce:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new I,s=[],r=[],a=[],o=new I,l=new at;for(let d=0;d<=e;d++){const g=d/e;s[d]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(He(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(He(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],d*g)),a[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Do extends En{constructor(e=0,t=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ce){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class wf extends Do{constructor(e,t,n,s,r,a){super(e,t,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Uo(){let i=0,e=0,t=0,n=0;function s(r,a,o,l){i=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,s(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return i+e*r+t*a+n*o}}}const Cl=new I,Pl=new I,ia=new Uo,sa=new Uo,ra=new Uo;class Af extends En{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new I){const n=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(Pl.subVectors(s[0],s[1]).add(s[0]),c=Pl);const f=s[o%r],u=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(Cl.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=Cl),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(u),d),p=Math.pow(u.distanceToSquared(h),d);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),ia.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,g,v,p),sa.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,g,v,p),ra.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,g,v,p)}else this.curveType==="catmullrom"&&(ia.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),sa.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),ra.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return n.set(ia.calc(l),sa.calc(l),ra.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new I().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Ll(i,e,t,n,s){const r=(n-e)*.5,a=(s-t)*.5,o=i*i,l=i*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*i+t}function Rf(i,e){const t=1-i;return t*t*e}function Cf(i,e){return 2*(1-i)*i*e}function Pf(i,e){return i*i*e}function ps(i,e,t,n){return Rf(i,e)+Cf(i,t)+Pf(i,n)}function Lf(i,e){const t=1-i;return t*t*t*e}function If(i,e){const t=1-i;return 3*t*t*i*e}function Df(i,e){return 3*(1-i)*i*i*e}function Uf(i,e){return i*i*i*e}function ms(i,e,t,n,s){return Lf(i,e)+If(i,t)+Df(i,n)+Uf(i,s)}class rh extends En{constructor(e=new ce,t=new ce,n=new ce,s=new ce){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new ce){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ms(e,s.x,r.x,a.x,o.x),ms(e,s.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Nf extends En{constructor(e=new I,t=new I,n=new I,s=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new I){const n=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(ms(e,s.x,r.x,a.x,o.x),ms(e,s.y,r.y,a.y,o.y),ms(e,s.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ah extends En{constructor(e=new ce,t=new ce){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ce){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ce){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ff extends En{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class oh extends En{constructor(e=new ce,t=new ce,n=new ce){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ce){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ps(e,s.x,r.x,a.x),ps(e,s.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Of extends En{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,s=this.v0,r=this.v1,a=this.v2;return n.set(ps(e,s.x,r.x,a.x),ps(e,s.y,r.y,a.y),ps(e,s.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class lh extends En{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ce){const n=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(Ll(o,l.x,c.x,h.x,f.x),Ll(o,l.y,c.y,h.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new ce().fromArray(s))}return this}}var Il=Object.freeze({__proto__:null,ArcCurve:wf,CatmullRomCurve3:Af,CubicBezierCurve:rh,CubicBezierCurve3:Nf,EllipseCurve:Do,LineCurve:ah,LineCurve3:Ff,QuadraticBezierCurve:oh,QuadraticBezierCurve3:Of,SplineCurve:lh});class kf extends En{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Il[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const a=s[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Il[s.type]().fromJSON(s))}return this}}class Dl extends kf{constructor(e){super(),this.type="Path",this.currentPoint=new ce,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new ah(this.currentPoint.clone(),new ce(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new oh(this.currentPoint.clone(),new ce(e,t),new ce(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,a){const o=new rh(this.currentPoint.clone(),new ce(e,t),new ce(n,s),new ce(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new lh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,s,r,a),this}absarc(e,t,n,s,r,a){return this.absellipse(e,t,n,n,s,r,a),this}ellipse(e,t,n,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,s,r,a,o,l),this}absellipse(e,t,n,s,r,a,o,l){const c=new Do(e,t,n,s,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ch extends Dl{constructor(e){super(e),this.uuid=Ji(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Dl().fromJSON(s))}return this}}function Bf(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=hh(i,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Wf(i,e,r,t)),i.length>80*t){o=i[0],l=i[1];let h=o,f=l;for(let u=t;u<s;u+=t){const d=i[u],g=i[u+1];d<o&&(o=d),g<l&&(l=g),d>h&&(h=d),g>f&&(f=g)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Ss(r,a,t,o,l,c,0),a}function hh(i,e,t,n,s){let r;if(s===td(i,e,t,n)>0)for(let a=e;a<t;a+=n)r=Ul(a/n|0,i[a],i[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Ul(a/n|0,i[a],i[a+1],r);return r&&Ki(r,r.next)&&(Es(r),r=r.next),r}function vi(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(Ki(t,t.next)||ft(t.prev,t,t.next)===0)){if(Es(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Ss(i,e,t,n,s,r,a){if(!i)return;!a&&r&&Kf(i,n,s,r);let o=i;for(;i.prev!==i.next;){const l=i.prev,c=i.next;if(r?Hf(i,n,s,r):zf(i)){e.push(l.i,i.i,c.i),Es(i),i=c.next,o=c.next;continue}if(i=c,i===o){a?a===1?(i=Gf(vi(i),e),Ss(i,e,t,n,s,r,2)):a===2&&Vf(i,e,t,n,s,r):Ss(vi(i),e,t,n,s,r,1);break}}}function zf(i){const e=i.prev,t=i,n=i.next;if(ft(e,t,n)>=0)return!1;const s=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(s,r,a),f=Math.min(o,l,c),u=Math.max(s,r,a),d=Math.max(o,l,c);let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=f&&g.y<=d&&us(s,o,r,l,a,c,g.x,g.y)&&ft(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Hf(i,e,t,n){const s=i.prev,r=i,a=i.next;if(ft(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,f=r.y,u=a.y,d=Math.min(o,l,c),g=Math.min(h,f,u),v=Math.max(o,l,c),p=Math.max(h,f,u),m=ho(d,g,e,t,n),S=ho(v,p,e,t,n);let T=i.prevZ,y=i.nextZ;for(;T&&T.z>=m&&y&&y.z<=S;){if(T.x>=d&&T.x<=v&&T.y>=g&&T.y<=p&&T!==s&&T!==a&&us(o,h,l,f,c,u,T.x,T.y)&&ft(T.prev,T,T.next)>=0||(T=T.prevZ,y.x>=d&&y.x<=v&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&us(o,h,l,f,c,u,y.x,y.y)&&ft(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;T&&T.z>=m;){if(T.x>=d&&T.x<=v&&T.y>=g&&T.y<=p&&T!==s&&T!==a&&us(o,h,l,f,c,u,T.x,T.y)&&ft(T.prev,T,T.next)>=0)return!1;T=T.prevZ}for(;y&&y.z<=S;){if(y.x>=d&&y.x<=v&&y.y>=g&&y.y<=p&&y!==s&&y!==a&&us(o,h,l,f,c,u,y.x,y.y)&&ft(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Gf(i,e){let t=i;do{const n=t.prev,s=t.next.next;!Ki(n,s)&&fh(n,t,t.next,s)&&bs(n,s)&&bs(s,n)&&(e.push(n.i,t.i,s.i),Es(t),Es(t.next),t=i=s),t=t.next}while(t!==i);return vi(t)}function Vf(i,e,t,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Qf(a,o)){let l=dh(a,o);a=vi(a,a.next),l=vi(l,l.next),Ss(a,e,t,n,s,r,0),Ss(l,e,t,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function Wf(i,e,t,n){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:i.length,c=hh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Jf(c))}s.sort(Xf);for(let r=0;r<s.length;r++)t=qf(s[r],t);return t}function Xf(i,e){let t=i.x-e.x;if(t===0&&(t=i.y-e.y,t===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=n-s}return t}function qf(i,e){const t=Yf(i,e);if(!t)return e;const n=dh(t,i);return vi(n,n.next),vi(t,t.next)}function Yf(i,e){let t=e;const n=i.x,s=i.y;let r=-1/0,a;if(Ki(i,t))return t;do{if(Ki(i,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const f=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&uh(s<c?n:r,s,l,c,s<c?r:n,s,t.x,t.y)){const f=Math.abs(s-t.y)/(n-t.x);bs(t,i)&&(f<h||f===h&&(t.x>a.x||t.x===a.x&&$f(a,t)))&&(a=t,h=f)}t=t.next}while(t!==o);return a}function $f(i,e){return ft(i.prev,i,e.prev)<0&&ft(e.next,i,i.next)<0}function Kf(i,e,t,n){let s=i;do s.z===0&&(s.z=ho(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Zf(s)}function Zf(i){let e,t=1;do{let n=i,s;i=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=a}r.nextZ=null,t*=2}while(e>1);return i}function ho(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function Jf(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function uh(i,e,t,n,s,r,a,o){return(s-a)*(e-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(n-o)}function us(i,e,t,n,s,r,a,o){return!(i===a&&e===o)&&uh(i,e,t,n,s,r,a,o)}function Qf(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!jf(i,e)&&(bs(i,e)&&bs(e,i)&&ed(i,e)&&(ft(i.prev,i,e.prev)||ft(i,e.prev,e))||Ki(i,e)&&ft(i.prev,i,i.next)>0&&ft(e.prev,e,e.next)>0)}function ft(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function Ki(i,e){return i.x===e.x&&i.y===e.y}function fh(i,e,t,n){const s=Ks(ft(i,e,t)),r=Ks(ft(i,e,n)),a=Ks(ft(t,n,i)),o=Ks(ft(t,n,e));return!!(s!==r&&a!==o||s===0&&$s(i,t,e)||r===0&&$s(i,n,e)||a===0&&$s(t,i,n)||o===0&&$s(t,e,n))}function $s(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Ks(i){return i>0?1:i<0?-1:0}function jf(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&fh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function bs(i,e){return ft(i.prev,i,i.next)<0?ft(i,e,i.next)>=0&&ft(i,i.prev,e)>=0:ft(i,e,i.prev)<0||ft(i,i.next,e)<0}function ed(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function dh(i,e){const t=uo(i.i,i.x,i.y),n=uo(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Ul(i,e,t,n){const s=uo(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Es(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function uo(i,e,t){return{i,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function td(i,e,t,n){let s=0;for(let r=e,a=t-n;r<t;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}class nd{static triangulate(e,t,n=2){return Bf(e,t,n)}}class gs{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return gs.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Nl(e),Fl(n,e);let a=e.length;t.forEach(Nl);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Fl(n,t[l]);const o=nd.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Nl(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Fl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class _r extends kt{constructor(e=[new ce(0,-.5),new ce(.5,0),new ce(0,.5)],t=12,n=0,s=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:s},t=Math.floor(t),s=He(s,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/t,f=new I,u=new ce,d=new I,g=new I,v=new I;let p=0,m=0;for(let S=0;S<=e.length-1;S++)switch(S){case 0:p=e[S+1].x-e[S].x,m=e[S+1].y-e[S].y,d.x=m*1,d.y=-p,d.z=m*0,v.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:p=e[S+1].x-e[S].x,m=e[S+1].y-e[S].y,d.x=m*1,d.y=-p,d.z=m*0,g.copy(d),d.x+=v.x,d.y+=v.y,d.z+=v.z,d.normalize(),l.push(d.x,d.y,d.z),v.copy(g)}for(let S=0;S<=t;S++){const T=n+S*h*s,y=Math.sin(T),A=Math.cos(T);for(let b=0;b<=e.length-1;b++){f.x=e[b].x*y,f.y=e[b].y,f.z=e[b].x*A,a.push(f.x,f.y,f.z),u.x=S/t,u.y=b/(e.length-1),o.push(u.x,u.y);const R=l[3*b+0]*y,_=l[3*b+1],E=l[3*b+0]*A;c.push(R,_,E)}}for(let S=0;S<t;S++)for(let T=0;T<e.length-1;T++){const y=T+S*e.length,A=y,b=y+e.length,R=y+e.length+1,_=y+1;r.push(A,b,_),r.push(R,_,b)}this.setIndex(r),this.setAttribute("position",new ot(a,3)),this.setAttribute("uv",new ot(o,2)),this.setAttribute("normal",new ot(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _r(e.points,e.segments,e.phiStart,e.phiLength)}}class vr extends kt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,f=e/o,u=t/l,d=[],g=[],v=[],p=[];for(let m=0;m<h;m++){const S=m*u-a;for(let T=0;T<c;T++){const y=T*f-r;g.push(y,-S,0),v.push(0,0,1),p.push(T/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<o;S++){const T=S+c*m,y=S+c*(m+1),A=S+1+c*(m+1),b=S+1+c*m;d.push(T,y,b),d.push(y,A,b)}this.setIndex(d),this.setAttribute("position",new ot(g,3)),this.setAttribute("normal",new ot(v,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vr(e.width,e.height,e.widthSegments,e.heightSegments)}}class No extends kt{constructor(e=new ch([new ce(0,.5),new ce(-.5,-.5),new ce(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new ot(s,3)),this.setAttribute("normal",new ot(r,3)),this.setAttribute("uv",new ot(a,2));function c(h){const f=s.length/3,u=h.extractPoints(t);let d=u.shape;const g=u.holes;gs.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,m=g.length;p<m;p++){const S=g[p];gs.isClockWise(S)===!0&&(g[p]=S.reverse())}const v=gs.triangulateShape(d,g);for(let p=0,m=g.length;p<m;p++){const S=g[p];d=d.concat(S)}for(let p=0,m=d.length;p<m;p++){const S=d[p];s.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let p=0,m=v.length;p<m;p++){const S=v[p],T=S[0]+f,y=S[1]+f,A=S[2]+f;n.push(T,y,A),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return id(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const a=t[e.shapes[s]];n.push(a)}return new No(n,e.curveSegments)}}function id(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class Wt extends kt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new I,u=new I,d=[],g=[],v=[],p=[];for(let m=0;m<=n;m++){const S=[],T=m/n,y=a+T*o,A=e*Math.cos(y),b=Math.sqrt(e*e-A*A);let R=0;m===0&&a===0?R=.5/t:m===n&&l===Math.PI&&(R=-.5/t);for(let _=0;_<=t;_++){const E=_/t,C=s+E*r;f.x=-b*Math.cos(C),f.y=A,f.z=b*Math.sin(C),g.push(f.x,f.y,f.z),u.copy(f).normalize(),v.push(u.x,u.y,u.z),p.push(E+R,1-T),S.push(c++)}h.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){const T=h[m][S+1],y=h[m][S],A=h[m+1][S],b=h[m+1][S+1];(m!==0||a>0)&&d.push(T,y,b),(m!==n-1||l<Math.PI)&&d.push(y,A,b)}this.setIndex(d),this.setAttribute("position",new ot(g,3)),this.setAttribute("normal",new ot(v,3)),this.setAttribute("uv",new ot(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Fo extends kt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),s=Math.floor(s);const l=[],c=[],h=[],f=[],u=new I,d=new I,g=new I;for(let v=0;v<=n;v++){const p=a+v/n*o;for(let m=0;m<=s;m++){const S=m/s*r;d.x=(e+t*Math.cos(p))*Math.cos(S),d.y=(e+t*Math.cos(p))*Math.sin(S),d.z=t*Math.sin(p),c.push(d.x,d.y,d.z),u.x=e*Math.cos(S),u.y=e*Math.sin(S),g.subVectors(d,u).normalize(),h.push(g.x,g.y,g.z),f.push(m/s),f.push(v/n)}}for(let v=1;v<=n;v++)for(let p=1;p<=s;p++){const m=(s+1)*v+p-1,S=(s+1)*(v-1)+p-1,T=(s+1)*(v-1)+p,y=(s+1)*v+p;l.push(m,S,y),l.push(S,T,y)}this.setIndex(l),this.setAttribute("position",new ot(c,3)),this.setAttribute("normal",new ot(h,3)),this.setAttribute("uv",new ot(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fo(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Zi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(Ol(s))s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(Ol(s[0])){const r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function zt(i){const e={};for(let t=0;t<i.length;t++){const n=Zi(i[t]);for(const s in n)e[s]=n[s]}return e}function Ol(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function sd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ph(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ve.workingColorSpace}const rd={clone:Zi,merge:zt};var ad=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,od=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class bn extends As{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ad,this.fragmentShader=od,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Zi(e.uniforms),this.uniformsGroups=sd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Xe().setHex(s.value);break;case"v2":this.uniforms[n].value=new ce().fromArray(s.value);break;case"v3":this.uniforms[n].value=new I().fromArray(s.value);break;case"v4":this.uniforms[n].value=new ut().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ne().fromArray(s.value);break;case"m4":this.uniforms[n].value=new at().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class ld extends bn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class mh extends As{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lo,this.normalScale=new ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ti,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class cd extends As{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Hu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class hd extends As{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class gh extends It{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ud extends gh{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const aa=new at,kl=new I,Bl=new I;class fd{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ce(512,512),this.mapType=Zt,this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lo,this._frameExtents=new ce(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;kl.setFromMatrixPosition(e.matrixWorld),t.position.copy(kl),Bl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Bl),t.updateMatrixWorld(),aa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(aa,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===Ms||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(aa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Zs=new I,Js=new Qi,pn=new I;class xh extends It{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zs,Js,pn),pn.x===1&&pn.y===1&&pn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zs,Js,pn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Zs,Js,pn),pn.x===1&&pn.y===1&&pn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zs,Js,pn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Kn=new I,zl=new ce,Hl=new ce;class an extends xh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=co*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Dr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return co*2*Math.atan(Math.tan(Dr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Kn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z),Kn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Kn.x,Kn.y).multiplyScalar(-e/Kn.z)}getViewSize(e,t){return this.getViewBounds(e,zl,Hl),t.subVectors(Hl,zl)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Dr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class yr extends xh{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class dd extends fd{constructor(){super(new yr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Gl extends gh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(It.DEFAULT_UP),this.updateMatrix(),this.target=new It,this.shadow=new dd}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}const ki=-90,Bi=1;class pd extends It{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(ki,Bi,e,t);s.layers=this.layers,this.add(s);const r=new an(ki,Bi,e,t);r.layers=this.layers,this.add(r);const a=new an(ki,Bi,e,t);a.layers=this.layers,this.add(a);const o=new an(ki,Bi,e,t);o.layers=this.layers,this.add(o);const l=new an(ki,Bi,e,t);l.layers=this.layers,this.add(l);const c=new an(ki,Bi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===vn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class md extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Go=class Go{constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}};Go.prototype.isMatrix2=!0;let Vl=Go;function Wl(i,e,t,n){const s=gd(n);switch(t){case Yc:return i*e;case Kc:return i*e/s.components*s.byteLength;case Eo:return i*e/s.components*s.byteLength;case _i:return i*e*2/s.components*s.byteLength;case To:return i*e*2/s.components*s.byteLength;case $c:return i*e*3/s.components*s.byteLength;case cn:return i*e*4/s.components*s.byteLength;case wo:return i*e*4/s.components*s.byteLength;case nr:case ir:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case sr:case rr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Da:case Na:return Math.max(i,16)*Math.max(e,8)/4;case Ia:case Ua:return Math.max(i,8)*Math.max(e,8)/2;case Fa:case Oa:case Ba:case za:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ka:case hr:case Ha:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Va:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Xa:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case qa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case $a:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Za:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case ja:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case eo:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case to:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case no:case io:case so:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ro:case ao:return Math.ceil(i/4)*Math.ceil(e/4)*8;case ur:case oo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function gd(i){switch(i){case Zt:case Vc:return{byteLength:1,components:1};case vs:case Wc:case kn:return{byteLength:2,components:1};case So:case bo:return{byteLength:2,components:4};case Sn:case Mo:case _n:return{byteLength:4,components:1};case Xc:case qc:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:yo}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=yo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function _h(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function xd(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(i.bindBuffer(c,o),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,g)=>d.start-g.start);let u=0;for(let d=1;d<f.length;d++){const g=f[u],v=f[d];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++u,f[u]=v)}f.length=u+1;for(let d=0,g=f.length;d<g;d++){const v=f[d];i.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var _d=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,vd=`#ifdef USE_ALPHAHASH
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
#endif`,yd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Md=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ed=`#ifdef USE_AOMAP
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
#endif`,Td=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,wd=`#ifdef USE_BATCHING
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
#endif`,Ad=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Cd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Pd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ld=`#ifdef USE_IRIDESCENCE
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
#endif`,Id=`#ifdef USE_BUMPMAP
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
#endif`,Dd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Ud=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Nd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Od=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,kd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Bd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,zd=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Hd=`#define PI 3.141592653589793
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
} // validated`,Gd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Vd=`vec3 transformedNormal = objectNormal;
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
#endif`,Wd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Xd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,qd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Yd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$d="gl_FragColor = linearToOutputTexel( gl_FragColor );",Kd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Zd=`#ifdef USE_ENVMAP
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
#endif`,Jd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Qd=`#ifdef USE_ENVMAP
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
#endif`,jd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,ep=`#ifdef USE_ENVMAP
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
#endif`,tp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,np=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ip=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,sp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,rp=`#ifdef USE_GRADIENTMAP
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
}`,ap=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,op=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,cp=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,hp=`#ifdef USE_ENVMAP
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
#endif`,up=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,fp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,dp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,mp=`PhysicalMaterial material;
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
#endif`,gp=`uniform sampler2D dfgLUT;
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
}`,xp=`
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
#endif`,_p=`#if defined( RE_IndirectDiffuse )
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
#endif`,vp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,yp=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Mp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ep=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,wp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ap=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rp=`#if defined( USE_POINTS_UV )
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
#endif`,Cp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Pp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Lp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ip=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Dp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Up=`#ifdef USE_MORPHTARGETS
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
#endif`,Np=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Fp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Op=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Hp=`#ifdef USE_NORMALMAP
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
#endif`,Gp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Vp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Xp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,qp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Yp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,$p=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Kp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Zp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Jp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,jp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,em=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,tm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,im=`float getShadowMask() {
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
}`,sm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rm=`#ifdef USE_SKINNING
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
#endif`,am=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,om=`#ifdef USE_SKINNING
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
#endif`,lm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,cm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,hm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,um=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,fm=`#ifdef USE_TRANSMISSION
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
#endif`,dm=`#ifdef USE_TRANSMISSION
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
#endif`,pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,xm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const _m=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,vm=`uniform sampler2D t2D;
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`#include <common>
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
}`,Tm=`#if DEPTH_PACKING == 3200
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
}`,wm=`#define DISTANCE
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
}`,Am=`#define DISTANCE
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
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Cm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Pm=`uniform float scale;
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
}`,Lm=`uniform vec3 diffuse;
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
}`,Im=`#include <common>
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
}`,Dm=`uniform vec3 diffuse;
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
}`,Um=`#define LAMBERT
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
}`,Nm=`#define LAMBERT
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
}`,Fm=`#define MATCAP
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
}`,Om=`#define MATCAP
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
}`,km=`#define NORMAL
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
}`,Bm=`#define NORMAL
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
}`,zm=`#define PHONG
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
}`,Hm=`#define PHONG
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
}`,Gm=`#define STANDARD
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
}`,Vm=`#define STANDARD
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
}`,Wm=`#define TOON
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
}`,Xm=`#define TOON
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
}`,qm=`uniform float size;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,$m=`#include <common>
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
}`,Km=`uniform vec3 color;
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
}`,Zm=`uniform float rotation;
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
}`,Jm=`uniform vec3 diffuse;
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
}`,Be={alphahash_fragment:_d,alphahash_pars_fragment:vd,alphamap_fragment:yd,alphamap_pars_fragment:Md,alphatest_fragment:Sd,alphatest_pars_fragment:bd,aomap_fragment:Ed,aomap_pars_fragment:Td,batching_pars_vertex:wd,batching_vertex:Ad,begin_vertex:Rd,beginnormal_vertex:Cd,bsdfs:Pd,iridescence_fragment:Ld,bumpmap_pars_fragment:Id,clipping_planes_fragment:Dd,clipping_planes_pars_fragment:Ud,clipping_planes_pars_vertex:Nd,clipping_planes_vertex:Fd,color_fragment:Od,color_pars_fragment:kd,color_pars_vertex:Bd,color_vertex:zd,common:Hd,cube_uv_reflection_fragment:Gd,defaultnormal_vertex:Vd,displacementmap_pars_vertex:Wd,displacementmap_vertex:Xd,emissivemap_fragment:qd,emissivemap_pars_fragment:Yd,colorspace_fragment:$d,colorspace_pars_fragment:Kd,envmap_fragment:Zd,envmap_common_pars_fragment:Jd,envmap_pars_fragment:Qd,envmap_pars_vertex:jd,envmap_physical_pars_fragment:hp,envmap_vertex:ep,fog_vertex:tp,fog_pars_vertex:np,fog_fragment:ip,fog_pars_fragment:sp,gradientmap_pars_fragment:rp,lightmap_pars_fragment:ap,lights_lambert_fragment:op,lights_lambert_pars_fragment:lp,lights_pars_begin:cp,lights_toon_fragment:up,lights_toon_pars_fragment:fp,lights_phong_fragment:dp,lights_phong_pars_fragment:pp,lights_physical_fragment:mp,lights_physical_pars_fragment:gp,lights_fragment_begin:xp,lights_fragment_maps:_p,lights_fragment_end:vp,lightprobes_pars_fragment:yp,logdepthbuf_fragment:Mp,logdepthbuf_pars_fragment:Sp,logdepthbuf_pars_vertex:bp,logdepthbuf_vertex:Ep,map_fragment:Tp,map_pars_fragment:wp,map_particle_fragment:Ap,map_particle_pars_fragment:Rp,metalnessmap_fragment:Cp,metalnessmap_pars_fragment:Pp,morphinstance_vertex:Lp,morphcolor_vertex:Ip,morphnormal_vertex:Dp,morphtarget_pars_vertex:Up,morphtarget_vertex:Np,normal_fragment_begin:Fp,normal_fragment_maps:Op,normal_pars_fragment:kp,normal_pars_vertex:Bp,normal_vertex:zp,normalmap_pars_fragment:Hp,clearcoat_normal_fragment_begin:Gp,clearcoat_normal_fragment_maps:Vp,clearcoat_pars_fragment:Wp,iridescence_pars_fragment:Xp,opaque_fragment:qp,packing:Yp,premultiplied_alpha_fragment:$p,project_vertex:Kp,dithering_fragment:Zp,dithering_pars_fragment:Jp,roughnessmap_fragment:Qp,roughnessmap_pars_fragment:jp,shadowmap_pars_fragment:em,shadowmap_pars_vertex:tm,shadowmap_vertex:nm,shadowmask_pars_fragment:im,skinbase_vertex:sm,skinning_pars_vertex:rm,skinning_vertex:am,skinnormal_vertex:om,specularmap_fragment:lm,specularmap_pars_fragment:cm,tonemapping_fragment:hm,tonemapping_pars_fragment:um,transmission_fragment:fm,transmission_pars_fragment:dm,uv_pars_fragment:pm,uv_pars_vertex:mm,uv_vertex:gm,worldpos_vertex:xm,background_vert:_m,background_frag:vm,backgroundCube_vert:ym,backgroundCube_frag:Mm,cube_vert:Sm,cube_frag:bm,depth_vert:Em,depth_frag:Tm,distance_vert:wm,distance_frag:Am,equirect_vert:Rm,equirect_frag:Cm,linedashed_vert:Pm,linedashed_frag:Lm,meshbasic_vert:Im,meshbasic_frag:Dm,meshlambert_vert:Um,meshlambert_frag:Nm,meshmatcap_vert:Fm,meshmatcap_frag:Om,meshnormal_vert:km,meshnormal_frag:Bm,meshphong_vert:zm,meshphong_frag:Hm,meshphysical_vert:Gm,meshphysical_frag:Vm,meshtoon_vert:Wm,meshtoon_frag:Xm,points_vert:qm,points_frag:Ym,shadow_vert:$m,shadow_frag:Km,sprite_vert:Zm,sprite_frag:Jm},ue={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},xn={basic:{uniforms:zt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:zt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)},envMapIntensity:{value:1}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:zt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:zt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:zt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:zt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:zt([ue.points,ue.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:zt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:zt([ue.common,ue.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:zt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:zt([ue.sprite,ue.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distance:{uniforms:zt([ue.common,ue.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distance_vert,fragmentShader:Be.distance_frag},shadow:{uniforms:zt([ue.lights,ue.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};xn.physical={uniforms:zt([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const Qs={r:0,b:0,g:0},Qm=new at,vh=new Ne;vh.set(-1,0,0,0,1,0,0,0,1);function jm(i,e,t,n,s,r){const a=new Xe(0);let o=s===!0?0:1,l,c,h=null,f=0,u=null;function d(S){let T=S.isScene===!0?S.background:null;if(T&&T.isTexture){const y=S.backgroundBlurriness>0;T=e.get(T,y)}return T}function g(S){let T=!1;const y=d(S);y===null?p(a,o):y&&y.isColor&&(p(y,1),T=!0);const A=i.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(S,T){const y=d(T);y&&(y.isCubeTexture||y.mapping===xr)?(c===void 0&&(c=new De(new zn(1,1,1),new bn({name:"BackgroundCubeMaterial",uniforms:Zi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,b,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(T.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(vh),c.material.toneMapped=Ve.getTransfer(y.colorSpace)!==tt,(h!==y||f!==y.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new De(new vr(2,2),new bn({name:"BackgroundMaterial",uniforms:Zi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Ve.getTransfer(y.colorSpace)!==tt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function p(S,T){S.getRGB(Qs,ph(i)),t.buffers.color.setClear(Qs.r,Qs.g,Qs.b,T,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,T=1){a.set(S),o=T,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,p(a,o)},render:g,addToRenderList:v,dispose:m}}function e0(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(P,N,V,$,O){let Y=!1;const H=f(P,$,V,N);r!==H&&(r=H,c(r.object)),Y=d(P,$,V,O),Y&&g(P,$,V,O),O!==null&&e.update(O,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,y(P,N,V,$),O!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return i.createVertexArray()}function c(P){return i.bindVertexArray(P)}function h(P){return i.deleteVertexArray(P)}function f(P,N,V,$){const O=$.wireframe===!0;let Y=n[N.id];Y===void 0&&(Y={},n[N.id]=Y);const H=P.isInstancedMesh===!0?P.id:0;let Q=Y[H];Q===void 0&&(Q={},Y[H]=Q);let ee=Q[V.id];ee===void 0&&(ee={},Q[V.id]=ee);let fe=ee[O];return fe===void 0&&(fe=u(l()),ee[O]=fe),fe}function u(P){const N=[],V=[],$=[];for(let O=0;O<t;O++)N[O]=0,V[O]=0,$[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:V,attributeDivisors:$,object:P,attributes:{},index:null}}function d(P,N,V,$){const O=r.attributes,Y=N.attributes;let H=0;const Q=V.getAttributes();for(const ee in Q)if(Q[ee].location>=0){const ge=O[ee];let ye=Y[ee];if(ye===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(ye=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(ye=P.instanceColor)),ge===void 0||ge.attribute!==ye||ye&&ge.data!==ye.data)return!0;H++}return r.attributesNum!==H||r.index!==$}function g(P,N,V,$){const O={},Y=N.attributes;let H=0;const Q=V.getAttributes();for(const ee in Q)if(Q[ee].location>=0){let ge=Y[ee];ge===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(ge=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(ge=P.instanceColor));const ye={};ye.attribute=ge,ge&&ge.data&&(ye.data=ge.data),O[ee]=ye,H++}r.attributes=O,r.attributesNum=H,r.index=$}function v(){const P=r.newAttributes;for(let N=0,V=P.length;N<V;N++)P[N]=0}function p(P){m(P,0)}function m(P,N){const V=r.newAttributes,$=r.enabledAttributes,O=r.attributeDivisors;V[P]=1,$[P]===0&&(i.enableVertexAttribArray(P),$[P]=1),O[P]!==N&&(i.vertexAttribDivisor(P,N),O[P]=N)}function S(){const P=r.newAttributes,N=r.enabledAttributes;for(let V=0,$=N.length;V<$;V++)N[V]!==P[V]&&(i.disableVertexAttribArray(V),N[V]=0)}function T(P,N,V,$,O,Y,H){H===!0?i.vertexAttribIPointer(P,N,V,O,Y):i.vertexAttribPointer(P,N,V,$,O,Y)}function y(P,N,V,$){v();const O=$.attributes,Y=V.getAttributes(),H=N.defaultAttributeValues;for(const Q in Y){const ee=Y[Q];if(ee.location>=0){let fe=O[Q];if(fe===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(fe=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(fe=P.instanceColor)),fe!==void 0){const ge=fe.normalized,ye=fe.itemSize,Ze=e.get(fe);if(Ze===void 0)continue;const pt=Ze.buffer,Je=Ze.type,J=Ze.bytesPerElement,se=Je===i.INT||Je===i.UNSIGNED_INT||fe.gpuType===Mo;if(fe.isInterleavedBufferAttribute){const te=fe.data,Ie=te.stride,Fe=fe.offset;if(te.isInstancedInterleavedBuffer){for(let Ce=0;Ce<ee.locationSize;Ce++)m(ee.location+Ce,te.meshPerAttribute);P.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Ce=0;Ce<ee.locationSize;Ce++)p(ee.location+Ce);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let Ce=0;Ce<ee.locationSize;Ce++)T(ee.location+Ce,ye/ee.locationSize,Je,ge,Ie*J,(Fe+ye/ee.locationSize*Ce)*J,se)}else{if(fe.isInstancedBufferAttribute){for(let te=0;te<ee.locationSize;te++)m(ee.location+te,fe.meshPerAttribute);P.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let te=0;te<ee.locationSize;te++)p(ee.location+te);i.bindBuffer(i.ARRAY_BUFFER,pt);for(let te=0;te<ee.locationSize;te++)T(ee.location+te,ye/ee.locationSize,Je,ge,ye*J,ye/ee.locationSize*te*J,se)}}else if(H!==void 0){const ge=H[Q];if(ge!==void 0)switch(ge.length){case 2:i.vertexAttrib2fv(ee.location,ge);break;case 3:i.vertexAttrib3fv(ee.location,ge);break;case 4:i.vertexAttrib4fv(ee.location,ge);break;default:i.vertexAttrib1fv(ee.location,ge)}}}}S()}function A(){E();for(const P in n){const N=n[P];for(const V in N){const $=N[V];for(const O in $){const Y=$[O];for(const H in Y)h(Y[H].object),delete Y[H];delete $[O]}}delete n[P]}}function b(P){if(n[P.id]===void 0)return;const N=n[P.id];for(const V in N){const $=N[V];for(const O in $){const Y=$[O];for(const H in Y)h(Y[H].object),delete Y[H];delete $[O]}}delete n[P.id]}function R(P){for(const N in n){const V=n[N];for(const $ in V){const O=V[$];if(O[P.id]===void 0)continue;const Y=O[P.id];for(const H in Y)h(Y[H].object),delete Y[H];delete O[P.id]}}}function _(P){for(const N in n){const V=n[N],$=P.isInstancedMesh===!0?P.id:0,O=V[$];if(O!==void 0){for(const Y in O){const H=O[Y];for(const Q in H)h(H[Q].object),delete H[Q];delete O[Y]}delete V[$],Object.keys(V).length===0&&delete n[N]}}}function E(){C(),a=!0,r!==s&&(r=s,c(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfObject:_,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:p,disableUnusedAttributes:S}}function t0(i,e,t){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function n0(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(R){return!(R!==cn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const _=R===kn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Zt&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==_n&&!_)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Le("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Le("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),y=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),b=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:S,maxVaryings:T,maxFragmentUniforms:y,maxSamples:A,samples:b}}function i0(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new li,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){const g=f.clippingPlanes,v=f.clipIntersection,p=f.clipShadows,m=i.get(f);if(!s||g===null||g.length===0||r&&!p)r?h(null):c();else{const S=r?0:n,T=S*4;let y=m.clippingState||null;l.value=y,y=h(g,u,T,d);for(let A=0;A!==T;++A)y[A]=t[A];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,u,d,g){const v=f!==null?f.length:0;let p=null;if(v!==0){if(p=l.value,g!==!0||p===null){const m=d+v*4,S=u.matrixWorldInverse;o.getNormalMatrix(S),(p===null||p.length<m)&&(p=new Float32Array(m));for(let T=0,y=d;T!==v;++T,y+=4)a.copy(f[T]).applyMatrix4(S,o),a.normal.toArray(p,y),p[y+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}const Jn=4,Xl=[.125,.215,.35,.446,.526,.582],hi=20,s0=256,ls=new yr,ql=new Xe;let oa=null,la=0,ca=0,ha=!1;const r0=new I;class Yl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=r0}=r;oa=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ca=this._renderer.getActiveMipmapLevel(),ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Zl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(oa,la,ca),this._renderer.xr.enabled=ha,e.scissorTest=!1,zi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===xi||e.mapping===Yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oa=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ca=this._renderer.getActiveMipmapLevel(),ha=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ft,minFilter:Ft,generateMipmaps:!1,type:kn,format:cn,colorSpace:fr,depthBuffer:!1},s=$l(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$l(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=a0(r)),this._blurMaterial=l0(r,e,t),this._ggxMaterial=o0(r,e,t)}return s}_compileMaterial(e){const t=new De(new kt,e);this._renderer.compile(t,ls)}_sceneToCubeUV(e,t,n,s,r){const l=new an(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(ql),f.toneMapping=yn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new De(new zn,new nh({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,p=v.material;let m=!1;const S=e.background;S?S.isColor&&(p.color.copy(S),e.background=null,m=!0):(p.color.copy(ql),m=!0);for(let T=0;T<6;T++){const y=T%3;y===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):y===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));const A=this._cubeSize;zi(s,y*A,T>2?A:0,A,A),f.setRenderTarget(s),m&&f.render(v,l),f.render(e,l)}f.toneMapping=d,f.autoClear=u,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===xi||e.mapping===Yi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Zl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Kl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;zi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,ls)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=0+c*1.25,d=f*u,{_lodMax:g}=this,v=this._sizeLods[n],p=3*v*(n>g-Jn?n-g+Jn:0),m=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-t,zi(r,p,m,3*v,2*v),s.setRenderTarget(r),s.render(o,ls),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,zi(e,p,m,3*v,2*v),s.setRenderTarget(e),s.render(o,ls)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&$e("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=c;const u=c.uniforms,d=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*hi-1),v=r/g,p=isFinite(r)?1+Math.floor(h*v):hi;p>hi&&Le(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${hi}`);const m=[];let S=0;for(let R=0;R<hi;++R){const _=R/v,E=Math.exp(-_*_/2);m.push(E),R===0?S+=E:R<p&&(S+=2*E)}for(let R=0;R<m.length;R++)m[R]=m[R]/S;u.envMap.value=e.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=g,u.mipInt.value=T-n;const y=this._sizeLods[s],A=3*y*(s>T-Jn?s-T+Jn:0),b=4*(this._cubeSize-y);zi(t,A,b,3*y,2*y),l.setRenderTarget(t),l.render(f,ls)}}function a0(i){const e=[],t=[],n=[];let s=i;const r=i-Jn+1+Xl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Jn?l=Xl[a-i+Jn-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,g=6,v=3,p=2,m=1,S=new Float32Array(v*g*d),T=new Float32Array(p*g*d),y=new Float32Array(m*g*d);for(let b=0;b<d;b++){const R=b%3*2/3-1,_=b>2?0:-1,E=[R,_,0,R+2/3,_,0,R+2/3,_+1,0,R,_,0,R+2/3,_+1,0,R,_+1,0];S.set(E,v*g*b),T.set(u,p*g*b);const C=[b,b,b,b,b,b];y.set(C,m*g*b)}const A=new kt;A.setAttribute("position",new hn(S,v)),A.setAttribute("uv",new hn(T,p)),A.setAttribute("faceIndex",new hn(y,m)),n.push(new De(A,null)),s>Jn&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function $l(i,e,t){const n=new Mn(i,e,t);return n.texture.mapping=xr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function zi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function o0(i,e,t){return new bn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:s0,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Mr(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function l0(i,e,t){const n=new Float32Array(hi),s=new I(0,1,0);return new bn({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Mr(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Kl(){return new bn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mr(),fragmentShader:`

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
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Zl(){return new bn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Nn,depthTest:!1,depthWrite:!1})}function Mr(){return`

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
	`}class yh extends Mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new ih(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new zn(5,5,5),r=new bn({name:"CubemapFromEquirect",uniforms:Zi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:Nn});r.uniforms.tEquirect.value=t;const a=new De(s,r),o=t.minFilter;return t.minFilter===di&&(t.minFilter=Ft),new pd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}function c0(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===Pr||d===Lr)if(e.has(u)){const g=e.get(u).texture;return o(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const v=new yh(g.height);return v.fromEquirectangularTexture(i,u),e.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,g=d===Pr||d===Lr,v=d===xi||d===Yi;if(g||v){let p=t.get(u);const m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new Yl(i)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const S=u.image;return g&&S&&S.height>0||v&&S&&l(S)?(n===null&&(n=new Yl(i)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function o(u,d){return d===Pr?u.mapping=xi:d===Lr&&(u.mapping=Yi),u}function l(u){let d=0;const g=6;for(let v=0;v<g;v++)u[v]!==void 0&&d++;return d===g}function c(u){const d=u.target;d.removeEventListener("dispose",c);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function h0(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Vi("WebGLRenderer: "+n+" extension not supported."),s}}}function u0(i,e,t,n){const s={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete s[u.id];const d=r.get(u);d&&(e.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)e.update(u[d],i.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,g=f.attributes.position;let v=0;if(g===void 0)return;if(d!==null){const S=d.array;v=d.version;for(let T=0,y=S.length;T<y;T+=3){const A=S[T+0],b=S[T+1],R=S[T+2];u.push(A,b,b,R,R,A)}}else{const S=g.array;v=g.version;for(let T=0,y=S.length/3-1;T<y;T+=3){const A=T+0,b=T+1,R=T+2;u.push(A,b,b,R,R,A)}}const p=new(g.count>=65535?th:eh)(u,1);p.version=v;const m=r.get(f);m&&e.remove(m),r.set(f,p)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function f0(i,e,t){let n;function s(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*a),t.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*a,d),t.update(u,n,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let v=0;for(let p=0;p<d;p++)v+=u[p];t.update(v,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function d0(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:$e("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function p0(i,e,t){const n=new WeakMap,s=new ut;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==f){let C=function(){_.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var d=C;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],S=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let y=0;g===!0&&(y=1),v===!0&&(y=2),p===!0&&(y=3);let A=o.attributes.position.count*y,b=1;A>e.maxTextureSize&&(b=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const R=new Float32Array(A*b*4*f),_=new Jc(R,A,b,f);_.type=_n,_.needsUpdate=!0;const E=y*4;for(let P=0;P<f;P++){const N=m[P],V=S[P],$=T[P],O=A*b*4*P;for(let Y=0;Y<N.count;Y++){const H=Y*E;g===!0&&(s.fromBufferAttribute(N,Y),R[O+H+0]=s.x,R[O+H+1]=s.y,R[O+H+2]=s.z,R[O+H+3]=0),v===!0&&(s.fromBufferAttribute(V,Y),R[O+H+4]=s.x,R[O+H+5]=s.y,R[O+H+6]=s.z,R[O+H+7]=0),p===!0&&(s.fromBufferAttribute($,Y),R[O+H+8]=s.x,R[O+H+9]=s.y,R[O+H+10]=s.z,R[O+H+11]=$.itemSize===4?s.w:1)}}u={count:f,texture:_,size:new ce(A,b)},n.set(o,u),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const v=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",v),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function m0(i,e,t,n,s){let r=new WeakMap;function a(c){const h=s.render.frame,f=c.geometry,u=e.get(c,f);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const g0={[Nc]:"LINEAR_TONE_MAPPING",[Fc]:"REINHARD_TONE_MAPPING",[Oc]:"CINEON_TONE_MAPPING",[kc]:"ACES_FILMIC_TONE_MAPPING",[zc]:"AGX_TONE_MAPPING",[Hc]:"NEUTRAL_TONE_MAPPING",[Bc]:"CUSTOM_TONE_MAPPING"};function x0(i,e,t,n,s,r){const a=new Mn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,depthTexture:s?new $i(e,t):void 0}),o=new Mn(e,t,{type:kn,depthBuffer:!1,stencilBuffer:!1}),l=new kt;l.setAttribute("position",new ot([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ot([0,2,0,0,2,0],2));const c=new ld({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new De(l,c),f=new yr(-1,1,1,-1,0,1);let u=null,d=null,g=!1,v,p=null,m=[],S=!1;this.setSize=function(T,y){a.setSize(T,y),o.setSize(T,y);for(let A=0;A<m.length;A++){const b=m[A];b.setSize&&b.setSize(T,y)}},this.setEffects=function(T){m=T,S=m.length>0&&m[0].isRenderPass===!0;const y=a.width,A=a.height;for(let b=0;b<m.length;b++){const R=m[b];R.setSize&&R.setSize(y,A)}},this.begin=function(T,y){if(g||T.toneMapping===yn&&m.length===0)return!1;if(p=y,y!==null){const A=y.width,b=y.height;(a.width!==A||a.height!==b)&&this.setSize(A,b)}return S===!1&&T.setRenderTarget(a),v=T.toneMapping,T.toneMapping=yn,!0},this.hasRenderPass=function(){return S},this.end=function(T,y){T.toneMapping=v,g=!0;let A=a,b=o;for(let R=0;R<m.length;R++){const _=m[R];if(_.enabled!==!1&&(_.render(T,b,A,y),_.needsSwap!==!1)){const E=A;A=b,b=E}}if(u!==T.outputColorSpace||d!==T.toneMapping){u=T.outputColorSpace,d=T.toneMapping,c.defines={},Ve.getTransfer(u)===tt&&(c.defines.SRGB_TRANSFER="");const R=g0[d];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,T.setRenderTarget(p),T.render(h,f),p=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Mh=new Ht,fo=new $i(1,1),Sh=new Jc,bh=new af,Eh=new ih,Jl=[],Ql=[],jl=new Float32Array(16),ec=new Float32Array(9),tc=new Float32Array(4);function ji(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Jl[s];if(r===void 0&&(r=new Float32Array(s),Jl[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function wt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function At(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Sr(i,e){let t=Ql[e];t===void 0&&(t=new Int32Array(e),Ql[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function _0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function v0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;i.uniform2fv(this.addr,e),At(t,e)}}function y0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(wt(t,e))return;i.uniform3fv(this.addr,e),At(t,e)}}function M0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;i.uniform4fv(this.addr,e),At(t,e)}}function S0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),At(t,e)}else{if(wt(t,n))return;tc.set(n),i.uniformMatrix2fv(this.addr,!1,tc),At(t,n)}}function b0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),At(t,e)}else{if(wt(t,n))return;ec.set(n),i.uniformMatrix3fv(this.addr,!1,ec),At(t,n)}}function E0(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(wt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),At(t,e)}else{if(wt(t,n))return;jl.set(n),i.uniformMatrix4fv(this.addr,!1,jl),At(t,n)}}function T0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function w0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;i.uniform2iv(this.addr,e),At(t,e)}}function A0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;i.uniform3iv(this.addr,e),At(t,e)}}function R0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;i.uniform4iv(this.addr,e),At(t,e)}}function C0(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function P0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(wt(t,e))return;i.uniform2uiv(this.addr,e),At(t,e)}}function L0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(wt(t,e))return;i.uniform3uiv(this.addr,e),At(t,e)}}function I0(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(wt(t,e))return;i.uniform4uiv(this.addr,e),At(t,e)}}function D0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(fo.compareFunction=t.isReversedDepthBuffer()?Ro:Ao,r=fo):r=Mh,t.setTexture2D(e||r,s)}function U0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||bh,s)}function N0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||Eh,s)}function F0(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Sh,s)}function O0(i){switch(i){case 5126:return _0;case 35664:return v0;case 35665:return y0;case 35666:return M0;case 35674:return S0;case 35675:return b0;case 35676:return E0;case 5124:case 35670:return T0;case 35667:case 35671:return w0;case 35668:case 35672:return A0;case 35669:case 35673:return R0;case 5125:return C0;case 36294:return P0;case 36295:return L0;case 36296:return I0;case 35678:case 36198:case 36298:case 36306:case 35682:return D0;case 35679:case 36299:case 36307:return U0;case 35680:case 36300:case 36308:case 36293:return N0;case 36289:case 36303:case 36311:case 36292:return F0}}function k0(i,e){i.uniform1fv(this.addr,e)}function B0(i,e){const t=ji(e,this.size,2);i.uniform2fv(this.addr,t)}function z0(i,e){const t=ji(e,this.size,3);i.uniform3fv(this.addr,t)}function H0(i,e){const t=ji(e,this.size,4);i.uniform4fv(this.addr,t)}function G0(i,e){const t=ji(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function V0(i,e){const t=ji(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function W0(i,e){const t=ji(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function X0(i,e){i.uniform1iv(this.addr,e)}function q0(i,e){i.uniform2iv(this.addr,e)}function Y0(i,e){i.uniform3iv(this.addr,e)}function $0(i,e){i.uniform4iv(this.addr,e)}function K0(i,e){i.uniform1uiv(this.addr,e)}function Z0(i,e){i.uniform2uiv(this.addr,e)}function J0(i,e){i.uniform3uiv(this.addr,e)}function Q0(i,e){i.uniform4uiv(this.addr,e)}function j0(i,e,t){const n=this.cache,s=e.length,r=Sr(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));let a;this.type===i.SAMPLER_2D_SHADOW?a=fo:a=Mh;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function eg(i,e,t){const n=this.cache,s=e.length,r=Sr(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||bh,r[a])}function tg(i,e,t){const n=this.cache,s=e.length,r=Sr(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Eh,r[a])}function ng(i,e,t){const n=this.cache,s=e.length,r=Sr(t,s);wt(n,r)||(i.uniform1iv(this.addr,r),At(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Sh,r[a])}function ig(i){switch(i){case 5126:return k0;case 35664:return B0;case 35665:return z0;case 35666:return H0;case 35674:return G0;case 35675:return V0;case 35676:return W0;case 5124:case 35670:return X0;case 35667:case 35671:return q0;case 35668:case 35672:return Y0;case 35669:case 35673:return $0;case 5125:return K0;case 36294:return Z0;case 36295:return J0;case 36296:return Q0;case 35678:case 36198:case 36298:case 36306:case 35682:return j0;case 35679:case 36299:case 36307:return eg;case 35680:case 36300:case 36308:case 36293:return tg;case 36289:case 36303:case 36311:case 36292:return ng}}class sg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=O0(t.type)}}class rg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=ig(t.type)}}class ag{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const ua=/(\w+)(\])?(\[|\.)?/g;function nc(i,e){i.seq.push(e),i.map[e.id]=e}function og(i,e,t){const n=i.name,s=n.length;for(ua.lastIndex=0;;){const r=ua.exec(n),a=ua.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){nc(t,c===void 0?new sg(o,i,e):new rg(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new ag(o),nc(t,f)),t=f}}}class ar{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);og(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function ic(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const lg=37297;let cg=0;function hg(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const sc=new Ne;function ug(i){Ve._getMatrix(sc,Ve.workingColorSpace,i);const e=`mat3( ${sc.elements.map(t=>t.toFixed(4))} )`;switch(Ve.getTransfer(i)){case dr:return[e,"LinearTransferOETF"];case tt:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function rc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+hg(i.getShaderSource(e),o)}else return r}function fg(i,e){const t=ug(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const dg={[Nc]:"Linear",[Fc]:"Reinhard",[Oc]:"Cineon",[kc]:"ACESFilmic",[zc]:"AgX",[Hc]:"Neutral",[Bc]:"Custom"};function pg(i,e){const t=dg[e];return t===void 0?(Le("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const js=new I;function mg(){Ve.getLuminanceCoefficients(js);const i=js.x.toFixed(4),e=js.y.toFixed(4),t=js.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function gg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fs).join(`
`)}function xg(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function _g(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function fs(i){return i!==""}function ac(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function oc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const vg=/^[ \t]*#include +<([\w\d./]+)>/gm;function po(i){return i.replace(vg,Mg)}const yg=new Map;function Mg(i,e){let t=Be[e];if(t===void 0){const n=yg.get(e);if(n!==void 0)t=Be[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return po(t)}const Sg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function lc(i){return i.replace(Sg,bg)}function bg(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function cc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}const Eg={[tr]:"SHADOWMAP_TYPE_PCF",[hs]:"SHADOWMAP_TYPE_VSM"};function Tg(i){return Eg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const wg={[xi]:"ENVMAP_TYPE_CUBE",[Yi]:"ENVMAP_TYPE_CUBE",[xr]:"ENVMAP_TYPE_CUBE_UV"};function Ag(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":wg[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const Rg={[Yi]:"ENVMAP_MODE_REFRACTION"};function Cg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Rg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Pg={[Uc]:"ENVMAP_BLENDING_MULTIPLY",[ku]:"ENVMAP_BLENDING_MIX",[Bu]:"ENVMAP_BLENDING_ADD"};function Lg(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Pg[i.combine]||"ENVMAP_BLENDING_NONE"}function Ig(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Dg(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Tg(t),c=Ag(t),h=Cg(t),f=Lg(t),u=Ig(t),d=gg(t),g=xg(r),v=s.createProgram();let p,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fs).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(fs).join(`
`),m.length>0&&(m+=`
`)):(p=[cc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),m=[cc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==yn?"#define TONE_MAPPING":"",t.toneMapping!==yn?Be.tonemapping_pars_fragment:"",t.toneMapping!==yn?pg("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,fg("linearToOutputTexel",t.outputColorSpace),mg(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fs).join(`
`)),a=po(a),a=ac(a,t),a=oc(a,t),o=po(o),o=ac(o,t),o=oc(o,t),a=lc(a),o=lc(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===fl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===fl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const T=S+p+a,y=S+m+o,A=ic(s,s.VERTEX_SHADER,T),b=ic(s,s.FRAGMENT_SHADER,y);s.attachShader(v,A),s.attachShader(v,b),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function R(P){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(v)||"",V=s.getShaderInfoLog(A)||"",$=s.getShaderInfoLog(b)||"",O=N.trim(),Y=V.trim(),H=$.trim();let Q=!0,ee=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(Q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,A,b);else{const fe=rc(s,A,"vertex"),ge=rc(s,b,"fragment");$e("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+fe+`
`+ge)}else O!==""?Le("WebGLProgram: Program Info Log:",O):(Y===""||H==="")&&(ee=!1);ee&&(P.diagnostics={runnable:Q,programLog:O,vertexShader:{log:Y,prefix:p},fragmentShader:{log:H,prefix:m}})}s.deleteShader(A),s.deleteShader(b),_=new ar(s,v),E=_g(s,v)}let _;this.getUniforms=function(){return _===void 0&&R(this),_};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(v,lg)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=cg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=A,this.fragmentShader=b,this}let Ug=0;class Ng{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Fg(e),t.set(e,n)),n}}class Fg{constructor(e){this.id=Ug++,this.code=e,this.usedTimes=0}}function Og(i){return i===_i||i===hr||i===ur}function kg(i,e,t,n,s,r){const a=new Qc,o=new Ng,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer;let u=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(_){return l.add(_),_===0?"uv":`uv${_}`}function v(_,E,C,P,N,V){const $=P.fog,O=N.geometry,Y=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?P.environment:null,H=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,Q=e.get(_.envMap||Y,H),ee=Q&&Q.mapping===xr?Q.image.height:null,fe=d[_.type];_.precision!==null&&(u=n.getMaxPrecision(_.precision),u!==_.precision&&Le("WebGLProgram.getParameters:",_.precision,"not supported, using",u,"instead."));const ge=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ye=ge!==void 0?ge.length:0;let Ze=0;O.morphAttributes.position!==void 0&&(Ze=1),O.morphAttributes.normal!==void 0&&(Ze=2),O.morphAttributes.color!==void 0&&(Ze=3);let pt,Je,J,se;if(fe){const Se=xn[fe];pt=Se.vertexShader,Je=Se.fragmentShader}else{pt=_.vertexShader,Je=_.fragmentShader;const Se=o.getVertexShaderStage(_),gt=o.getFragmentShaderStage(_);o.update(_,Se,gt),J=Se.id,se=gt.id}const te=i.getRenderTarget(),Ie=i.state.buffers.depth.getReversed(),Fe=N.isInstancedMesh===!0,Ce=N.isBatchedMesh===!0,_t=!!_.map,Ge=!!_.matcap,it=!!Q,Qe=!!_.aoMap,qe=!!_.lightMap,Mt=!!_.bumpMap&&_.wireframe===!1,Tt=!!_.normalMap,Rt=!!_.displacementMap,Pt=!!_.emissiveMap,mt=!!_.metalnessMap,St=!!_.roughnessMap,D=_.anisotropy>0,Gt=_.clearcoat>0,je=_.dispersion>0,w=_.iridescence>0,x=_.sheen>0,F=_.transmission>0,z=D&&!!_.anisotropyMap,W=Gt&&!!_.clearcoatMap,ne=Gt&&!!_.clearcoatNormalMap,re=Gt&&!!_.clearcoatRoughnessMap,X=w&&!!_.iridescenceMap,Z=w&&!!_.iridescenceThicknessMap,ae=x&&!!_.sheenColorMap,Te=x&&!!_.sheenRoughnessMap,he=!!_.specularMap,oe=!!_.specularColorMap,Re=!!_.specularIntensityMap,Pe=F&&!!_.transmissionMap,Oe=F&&!!_.thicknessMap,L=!!_.gradientMap,ie=!!_.alphaMap,K=_.alphaTest>0,le=!!_.alphaHash,me=!!_.extensions;let j=yn;_.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(j=i.toneMapping);const Ee={shaderID:fe,shaderType:_.type,shaderName:_.name,vertexShader:pt,fragmentShader:Je,defines:_.defines,customVertexShaderID:J,customFragmentShaderID:se,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:u,batching:Ce,batchingColor:Ce&&N._colorsTexture!==null,instancing:Fe,instancingColor:Fe&&N.instanceColor!==null,instancingMorph:Fe&&N.morphTexture!==null,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ve.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:_t,matcap:Ge,envMap:it,envMapMode:it&&Q.mapping,envMapCubeUVHeight:ee,aoMap:Qe,lightMap:qe,bumpMap:Mt,normalMap:Tt,displacementMap:Rt,emissiveMap:Pt,normalMapObjectSpace:Tt&&_.normalMapType===Gu,normalMapTangentSpace:Tt&&_.normalMapType===lo,packedNormalMap:Tt&&_.normalMapType===lo&&Og(_.normalMap.format),metalnessMap:mt,roughnessMap:St,anisotropy:D,anisotropyMap:z,clearcoat:Gt,clearcoatMap:W,clearcoatNormalMap:ne,clearcoatRoughnessMap:re,dispersion:je,iridescence:w,iridescenceMap:X,iridescenceThicknessMap:Z,sheen:x,sheenColorMap:ae,sheenRoughnessMap:Te,specularMap:he,specularColorMap:oe,specularIntensityMap:Re,transmission:F,transmissionMap:Pe,thicknessMap:Oe,gradientMap:L,opaque:_.transparent===!1&&_.blending===Gi&&_.alphaToCoverage===!1,alphaMap:ie,alphaTest:K,alphaHash:le,combine:_.combine,mapUv:_t&&g(_.map.channel),aoMapUv:Qe&&g(_.aoMap.channel),lightMapUv:qe&&g(_.lightMap.channel),bumpMapUv:Mt&&g(_.bumpMap.channel),normalMapUv:Tt&&g(_.normalMap.channel),displacementMapUv:Rt&&g(_.displacementMap.channel),emissiveMapUv:Pt&&g(_.emissiveMap.channel),metalnessMapUv:mt&&g(_.metalnessMap.channel),roughnessMapUv:St&&g(_.roughnessMap.channel),anisotropyMapUv:z&&g(_.anisotropyMap.channel),clearcoatMapUv:W&&g(_.clearcoatMap.channel),clearcoatNormalMapUv:ne&&g(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&g(_.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&g(_.iridescenceMap.channel),iridescenceThicknessMapUv:Z&&g(_.iridescenceThicknessMap.channel),sheenColorMapUv:ae&&g(_.sheenColorMap.channel),sheenRoughnessMapUv:Te&&g(_.sheenRoughnessMap.channel),specularMapUv:he&&g(_.specularMap.channel),specularColorMapUv:oe&&g(_.specularColorMap.channel),specularIntensityMapUv:Re&&g(_.specularIntensityMap.channel),transmissionMapUv:Pe&&g(_.transmissionMap.channel),thicknessMapUv:Oe&&g(_.thicknessMap.channel),alphaMapUv:ie&&g(_.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(Tt||D),vertexNormals:!!O.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!O.attributes.uv&&(_t||ie),fog:!!$,useFog:_.fog===!0,fogExp2:!!$&&$.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||O.attributes.normal===void 0&&Tt===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ie,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Ze,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:j,decodeVideoTexture:_t&&_.map.isVideoTexture===!0&&Ve.getTransfer(_.map.colorSpace)===tt,decodeVideoTextureEmissive:Pt&&_.emissiveMap.isVideoTexture===!0&&Ve.getTransfer(_.emissiveMap.colorSpace)===tt,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===In,flipSided:_.side===Xt,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:me&&_.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&_.extensions.multiDraw===!0||Ce)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function p(_){const E=[];if(_.shaderID?E.push(_.shaderID):(E.push(_.customVertexShaderID),E.push(_.customFragmentShaderID)),_.defines!==void 0)for(const C in _.defines)E.push(C),E.push(_.defines[C]);return _.isRawShaderMaterial===!1&&(m(E,_),S(E,_),E.push(i.outputColorSpace)),E.push(_.customProgramCacheKey),E.join()}function m(_,E){_.push(E.precision),_.push(E.outputColorSpace),_.push(E.envMapMode),_.push(E.envMapCubeUVHeight),_.push(E.mapUv),_.push(E.alphaMapUv),_.push(E.lightMapUv),_.push(E.aoMapUv),_.push(E.bumpMapUv),_.push(E.normalMapUv),_.push(E.displacementMapUv),_.push(E.emissiveMapUv),_.push(E.metalnessMapUv),_.push(E.roughnessMapUv),_.push(E.anisotropyMapUv),_.push(E.clearcoatMapUv),_.push(E.clearcoatNormalMapUv),_.push(E.clearcoatRoughnessMapUv),_.push(E.iridescenceMapUv),_.push(E.iridescenceThicknessMapUv),_.push(E.sheenColorMapUv),_.push(E.sheenRoughnessMapUv),_.push(E.specularMapUv),_.push(E.specularColorMapUv),_.push(E.specularIntensityMapUv),_.push(E.transmissionMapUv),_.push(E.thicknessMapUv),_.push(E.combine),_.push(E.fogExp2),_.push(E.sizeAttenuation),_.push(E.morphTargetsCount),_.push(E.morphAttributeCount),_.push(E.numDirLights),_.push(E.numPointLights),_.push(E.numSpotLights),_.push(E.numSpotLightMaps),_.push(E.numHemiLights),_.push(E.numRectAreaLights),_.push(E.numDirLightShadows),_.push(E.numPointLightShadows),_.push(E.numSpotLightShadows),_.push(E.numSpotLightShadowsWithMaps),_.push(E.numLightProbes),_.push(E.shadowMapType),_.push(E.toneMapping),_.push(E.numClippingPlanes),_.push(E.numClipIntersection),_.push(E.depthPacking)}function S(_,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),_.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),_.push(a.mask)}function T(_){const E=d[_.type];let C;if(E){const P=xn[E];C=rd.clone(P.uniforms)}else C=_.uniforms;return C}function y(_,E){let C=h.get(E);return C!==void 0?++C.usedTimes:(C=new Dg(i,E,_,s),c.push(C),h.set(E,C)),C}function A(_){if(--_.usedTimes===0){const E=c.indexOf(_);c[E]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){o.remove(_)}function R(){o.dispose()}return{getParameters:v,getProgramCacheKey:p,getUniforms:T,acquireProgram:y,releaseProgram:A,releaseShaderCache:b,programs:c,dispose:R}}function Bg(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function zg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function hc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function uc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,g,v,p,m){let S=i[e];return S===void 0?(S={id:u.id,object:u,geometry:d,material:g,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:p,group:m},i[e]=S):(S.id=u.id,S.object=u,S.geometry=d,S.material=g,S.materialVariant=a(u),S.groupOrder=v,S.renderOrder=u.renderOrder,S.z=p,S.group=m),e++,S}function l(u,d,g,v,p,m){const S=o(u,d,g,v,p,m);g.transmission>0?n.push(S):g.transparent===!0?s.push(S):t.push(S)}function c(u,d,g,v,p,m){const S=o(u,d,g,v,p,m);g.transmission>0?n.unshift(S):g.transparent===!0?s.unshift(S):t.unshift(S)}function h(u,d,g){t.length>1&&t.sort(u||zg),n.length>1&&n.sort(d||hc),s.length>1&&s.sort(d||hc),g&&(t.reverse(),n.reverse(),s.reverse())}function f(){for(let u=e,d=i.length;u<d;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function Hg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new uc,i.set(n,[a])):s>=r.length?(a=new uc,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Gg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Xe};break;case"SpotLight":t={position:new I,direction:new I,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new I,halfWidth:new I,halfHeight:new I};break}return i[e.id]=t,t}}}function Vg(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Wg=0;function Xg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function qg(i){const e=new Gg,t=Vg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const s=new I,r=new at,a=new at;function o(c){let h=0,f=0,u=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let d=0,g=0,v=0,p=0,m=0,S=0,T=0,y=0,A=0,b=0,R=0;c.sort(Xg);for(let E=0,C=c.length;E<C;E++){const P=c[E],N=P.color,V=P.intensity,$=P.distance;let O=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===_i?O=P.shadow.map.texture:O=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=N.r*V,f+=N.g*V,u+=N.b*V;else if(P.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(P.sh.coefficients[Y],V);R++}else if(P.isDirectionalLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const H=P.shadow,Q=t.get(P);Q.shadowIntensity=H.intensity,Q.shadowBias=H.bias,Q.shadowNormalBias=H.normalBias,Q.shadowRadius=H.radius,Q.shadowMapSize=H.mapSize,n.directionalShadow[d]=Q,n.directionalShadowMap[d]=O,n.directionalShadowMatrix[d]=P.shadow.matrix,S++}n.directional[d]=Y,d++}else if(P.isSpotLight){const Y=e.get(P);Y.position.setFromMatrixPosition(P.matrixWorld),Y.color.copy(N).multiplyScalar(V),Y.distance=$,Y.coneCos=Math.cos(P.angle),Y.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),Y.decay=P.decay,n.spot[v]=Y;const H=P.shadow;if(P.map&&(n.spotLightMap[A]=P.map,A++,H.updateMatrices(P),P.castShadow&&b++),n.spotLightMatrix[v]=H.matrix,P.castShadow){const Q=t.get(P);Q.shadowIntensity=H.intensity,Q.shadowBias=H.bias,Q.shadowNormalBias=H.normalBias,Q.shadowRadius=H.radius,Q.shadowMapSize=H.mapSize,n.spotShadow[v]=Q,n.spotShadowMap[v]=O,y++}v++}else if(P.isRectAreaLight){const Y=e.get(P);Y.color.copy(N).multiplyScalar(V),Y.halfWidth.set(P.width*.5,0,0),Y.halfHeight.set(0,P.height*.5,0),n.rectArea[p]=Y,p++}else if(P.isPointLight){const Y=e.get(P);if(Y.color.copy(P.color).multiplyScalar(P.intensity),Y.distance=P.distance,Y.decay=P.decay,P.castShadow){const H=P.shadow,Q=t.get(P);Q.shadowIntensity=H.intensity,Q.shadowBias=H.bias,Q.shadowNormalBias=H.normalBias,Q.shadowRadius=H.radius,Q.shadowMapSize=H.mapSize,Q.shadowCameraNear=H.camera.near,Q.shadowCameraFar=H.camera.far,n.pointShadow[g]=Q,n.pointShadowMap[g]=O,n.pointShadowMatrix[g]=P.shadow.matrix,T++}n.point[g]=Y,g++}else if(P.isHemisphereLight){const Y=e.get(P);Y.skyColor.copy(P.color).multiplyScalar(V),Y.groundColor.copy(P.groundColor).multiplyScalar(V),n.hemi[m]=Y,m++}}p>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const _=n.hash;(_.directionalLength!==d||_.pointLength!==g||_.spotLength!==v||_.rectAreaLength!==p||_.hemiLength!==m||_.numDirectionalShadows!==S||_.numPointShadows!==T||_.numSpotShadows!==y||_.numSpotMaps!==A||_.numLightProbes!==R)&&(n.directional.length=d,n.spot.length=v,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=y+A-b,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,_.directionalLength=d,_.pointLength=g,_.spotLength=v,_.rectAreaLength=p,_.hemiLength=m,_.numDirectionalShadows=S,_.numPointShadows=T,_.numSpotShadows=y,_.numSpotMaps=A,_.numLightProbes=R,n.version=Wg++)}function l(c,h){let f=0,u=0,d=0,g=0,v=0;const p=h.matrixWorldInverse;for(let m=0,S=c.length;m<S;m++){const T=c[m];if(T.isDirectionalLight){const y=n.directional[f];y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),f++}else if(T.isSpotLight){const y=n.spot[d];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(T.matrixWorld),s.setFromMatrixPosition(T.target.matrixWorld),y.direction.sub(s),y.direction.transformDirection(p),d++}else if(T.isRectAreaLight){const y=n.rectArea[g];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),a.identity(),r.copy(T.matrixWorld),r.premultiply(p),a.extractRotation(r),y.halfWidth.set(T.width*.5,0,0),y.halfHeight.set(0,T.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(T.isPointLight){const y=n.point[u];y.position.setFromMatrixPosition(T.matrixWorld),y.position.applyMatrix4(p),u++}else if(T.isHemisphereLight){const y=n.hemi[v];y.direction.setFromMatrixPosition(T.matrixWorld),y.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:n}}function fc(i){const e=new qg(i),t=[],n=[],s=[];function r(u){f.camera=u,t.length=0,n.length=0,s.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){s.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Yg(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new fc(i),e.set(s,[o])):r>=a.length?(o=new fc(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const $g=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kg=`uniform sampler2D shadow_pass;
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
}`,Zg=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],Jg=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],dc=new at,cs=new I,fa=new I;function Qg(i,e,t){let n=new Lo;const s=new ce,r=new ce,a=new ut,o=new cd,l=new hd,c={},h=t.maxTextureSize,f={[ei]:Xt,[Xt]:ei,[In]:In},u=new bn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ce},radius:{value:4}},vertexShader:$g,fragmentShader:Kg}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const g=new kt;g.setAttribute("position",new hn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new De(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tr;let m=this.type;this.render=function(b,R,_){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===vu&&(Le("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=tr);const E=i.getRenderTarget(),C=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),N=i.state;N.setBlending(Nn),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const V=m!==this.type;V&&R.traverse(function($){$.material&&(Array.isArray($.material)?$.material.forEach(O=>O.needsUpdate=!0):$.material.needsUpdate=!0)});for(let $=0,O=b.length;$<O;$++){const Y=b[$],H=Y.shadow;if(H===void 0){Le("WebGLShadowMap:",Y,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);const Q=H.getFrameExtents();s.multiply(Q),r.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/Q.x),s.x=r.x*Q.x,H.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/Q.y),s.y=r.y*Q.y,H.mapSize.y=r.y));const ee=i.state.buffers.depth.getReversed();if(H.camera._reversedDepth=ee,H.map===null||V===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===hs){if(Y.isPointLight){Le("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Mn(s.x,s.y,{format:_i,type:kn,minFilter:Ft,magFilter:Ft,generateMipmaps:!1}),H.map.texture.name=Y.name+".shadowMap",H.map.depthTexture=new $i(s.x,s.y,_n),H.map.depthTexture.name=Y.name+".shadowMapDepth",H.map.depthTexture.format=Bn,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Lt,H.map.depthTexture.magFilter=Lt}else Y.isPointLight?(H.map=new yh(s.x),H.map.depthTexture=new Tf(s.x,Sn)):(H.map=new Mn(s.x,s.y),H.map.depthTexture=new $i(s.x,s.y,Sn)),H.map.depthTexture.name=Y.name+".shadowMap",H.map.depthTexture.format=Bn,this.type===tr?(H.map.depthTexture.compareFunction=ee?Ro:Ao,H.map.depthTexture.minFilter=Ft,H.map.depthTexture.magFilter=Ft):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Lt,H.map.depthTexture.magFilter=Lt);H.camera.updateProjectionMatrix()}const fe=H.map.isWebGLCubeRenderTarget?6:1;for(let ge=0;ge<fe;ge++){if(H.map.isWebGLCubeRenderTarget)i.setRenderTarget(H.map,ge),i.clear();else{ge===0&&(i.setRenderTarget(H.map),i.clear());const ye=H.getViewport(ge);a.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),N.viewport(a)}if(Y.isPointLight){const ye=H.camera,Ze=H.matrix,pt=Y.distance||ye.far;pt!==ye.far&&(ye.far=pt,ye.updateProjectionMatrix()),cs.setFromMatrixPosition(Y.matrixWorld),ye.position.copy(cs),fa.copy(ye.position),fa.add(Zg[ge]),ye.up.copy(Jg[ge]),ye.lookAt(fa),ye.updateMatrixWorld(),Ze.makeTranslation(-cs.x,-cs.y,-cs.z),dc.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),H._frustum.setFromProjectionMatrix(dc,ye.coordinateSystem,ye.reversedDepth)}else H.updateMatrices(Y);n=H.getFrustum(),y(R,_,H.camera,Y,this.type)}H.isPointLightShadow!==!0&&this.type===hs&&S(H,_),H.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(E,C,P)};function S(b,R){const _=e.update(v);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Mn(s.x,s.y,{format:_i,type:kn})),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,_,u,v,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value=b.mapSize,d.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,_,d,v,null)}function T(b,R,_,E){let C=null;const P=_.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(P!==void 0)C=P;else if(C=_.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const N=C.uuid,V=R.uuid;let $=c[N];$===void 0&&($={},c[N]=$);let O=$[V];O===void 0&&(O=C.clone(),$[V]=O,R.addEventListener("dispose",A)),C=O}if(C.visible=R.visible,C.wireframe=R.wireframe,E===hs?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:f[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,_.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const N=i.properties.get(C);N.light=_}return C}function y(b,R,_,E,C){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===hs)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(_.matrixWorldInverse,b.matrixWorld);const V=e.update(b),$=b.material;if(Array.isArray($)){const O=V.groups;for(let Y=0,H=O.length;Y<H;Y++){const Q=O[Y],ee=$[Q.materialIndex];if(ee&&ee.visible){const fe=T(b,ee,E,C);b.onBeforeShadow(i,b,R,_,V,fe,Q),i.renderBufferDirect(_,null,V,fe,b,Q),b.onAfterShadow(i,b,R,_,V,fe,Q)}}}else if($.visible){const O=T(b,$,E,C);b.onBeforeShadow(i,b,R,_,V,O,null),i.renderBufferDirect(_,null,V,O,b,null),b.onAfterShadow(i,b,R,_,V,O,null)}}const N=b.children;for(let V=0,$=N.length;V<$;V++)y(N[V],R,_,E,C)}function A(b){b.target.removeEventListener("dispose",A);for(const _ in c){const E=c[_],C=b.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function jg(i,e){function t(){let L=!1;const ie=new ut;let K=null;const le=new ut(0,0,0,0);return{setMask:function(me){K!==me&&!L&&(i.colorMask(me,me,me,me),K=me)},setLocked:function(me){L=me},setClear:function(me,j,Ee,Se,gt){gt===!0&&(me*=Se,j*=Se,Ee*=Se),ie.set(me,j,Ee,Se),le.equals(ie)===!1&&(i.clearColor(me,j,Ee,Se),le.copy(ie))},reset:function(){L=!1,K=null,le.set(-1,0,0,0)}}}function n(){let L=!1,ie=!1,K=null,le=null,me=null;return{setReversed:function(j){if(ie!==j){const Ee=e.get("EXT_clip_control");j?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),ie=j;const Se=me;me=null,this.setClear(Se)}},getReversed:function(){return ie},setTest:function(j){j?te(i.DEPTH_TEST):Ie(i.DEPTH_TEST)},setMask:function(j){K!==j&&!L&&(i.depthMask(j),K=j)},setFunc:function(j){if(ie&&(j=Qu[j]),le!==j){switch(j){case ba:i.depthFunc(i.NEVER);break;case Ea:i.depthFunc(i.ALWAYS);break;case Ta:i.depthFunc(i.LESS);break;case qi:i.depthFunc(i.LEQUAL);break;case wa:i.depthFunc(i.EQUAL);break;case Aa:i.depthFunc(i.GEQUAL);break;case Ra:i.depthFunc(i.GREATER);break;case Ca:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}le=j}},setLocked:function(j){L=j},setClear:function(j){me!==j&&(me=j,ie&&(j=1-j),i.clearDepth(j))},reset:function(){L=!1,K=null,le=null,me=null,ie=!1}}}function s(){let L=!1,ie=null,K=null,le=null,me=null,j=null,Ee=null,Se=null,gt=null;return{setTest:function(lt){L||(lt?te(i.STENCIL_TEST):Ie(i.STENCIL_TEST))},setMask:function(lt){ie!==lt&&!L&&(i.stencilMask(lt),ie=lt)},setFunc:function(lt,un,fn){(K!==lt||le!==un||me!==fn)&&(i.stencilFunc(lt,un,fn),K=lt,le=un,me=fn)},setOp:function(lt,un,fn){(j!==lt||Ee!==un||Se!==fn)&&(i.stencilOp(lt,un,fn),j=lt,Ee=un,Se=fn)},setLocked:function(lt){L=lt},setClear:function(lt){gt!==lt&&(i.clearStencil(lt),gt=lt)},reset:function(){L=!1,ie=null,K=null,le=null,me=null,j=null,Ee=null,Se=null,gt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,g=[],v=null,p=!1,m=null,S=null,T=null,y=null,A=null,b=null,R=null,_=new Xe(0,0,0),E=0,C=!1,P=null,N=null,V=null,$=null,O=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Q=0;const ee=i.getParameter(i.VERSION);ee.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ee)[1]),H=Q>=1):ee.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),H=Q>=2);let fe=null,ge={};const ye=i.getParameter(i.SCISSOR_BOX),Ze=i.getParameter(i.VIEWPORT),pt=new ut().fromArray(ye),Je=new ut().fromArray(Ze);function J(L,ie,K,le){const me=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ee=0;Ee<K;Ee++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(ie,0,i.RGBA,1,1,le,0,i.RGBA,i.UNSIGNED_BYTE,me):i.texImage2D(ie+Ee,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,me);return j}const se={};se[i.TEXTURE_2D]=J(i.TEXTURE_2D,i.TEXTURE_2D,1),se[i.TEXTURE_CUBE_MAP]=J(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[i.TEXTURE_2D_ARRAY]=J(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),se[i.TEXTURE_3D]=J(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(i.DEPTH_TEST),a.setFunc(qi),Mt(!1),Tt(al),te(i.CULL_FACE),Qe(Nn);function te(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function Ie(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Fe(L,ie){return u[L]!==ie?(i.bindFramebuffer(L,ie),u[L]=ie,L===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ie),L===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ie),!0):!1}function Ce(L,ie){let K=g,le=!1;if(L){K=d.get(ie),K===void 0&&(K=[],d.set(ie,K));const me=L.textures;if(K.length!==me.length||K[0]!==i.COLOR_ATTACHMENT0){for(let j=0,Ee=me.length;j<Ee;j++)K[j]=i.COLOR_ATTACHMENT0+j;K.length=me.length,le=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,le=!0);le&&i.drawBuffers(K)}function _t(L){return v!==L?(i.useProgram(L),v=L,!0):!1}const Ge={[ci]:i.FUNC_ADD,[Mu]:i.FUNC_SUBTRACT,[Su]:i.FUNC_REVERSE_SUBTRACT};Ge[bu]=i.MIN,Ge[Eu]=i.MAX;const it={[Tu]:i.ZERO,[wu]:i.ONE,[Au]:i.SRC_COLOR,[Ma]:i.SRC_ALPHA,[Du]:i.SRC_ALPHA_SATURATE,[Lu]:i.DST_COLOR,[Cu]:i.DST_ALPHA,[Ru]:i.ONE_MINUS_SRC_COLOR,[Sa]:i.ONE_MINUS_SRC_ALPHA,[Iu]:i.ONE_MINUS_DST_COLOR,[Pu]:i.ONE_MINUS_DST_ALPHA,[Uu]:i.CONSTANT_COLOR,[Nu]:i.ONE_MINUS_CONSTANT_COLOR,[Fu]:i.CONSTANT_ALPHA,[Ou]:i.ONE_MINUS_CONSTANT_ALPHA};function Qe(L,ie,K,le,me,j,Ee,Se,gt,lt){if(L===Nn){p===!0&&(Ie(i.BLEND),p=!1);return}if(p===!1&&(te(i.BLEND),p=!0),L!==yu){if(L!==m||lt!==C){if((S!==ci||A!==ci)&&(i.blendEquation(i.FUNC_ADD),S=ci,A=ci),lt)switch(L){case Gi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ol:i.blendFunc(i.ONE,i.ONE);break;case ll:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case cl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:$e("WebGLState: Invalid blending: ",L);break}else switch(L){case Gi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ol:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ll:$e("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case cl:$e("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:$e("WebGLState: Invalid blending: ",L);break}T=null,y=null,b=null,R=null,_.set(0,0,0),E=0,m=L,C=lt}return}me=me||ie,j=j||K,Ee=Ee||le,(ie!==S||me!==A)&&(i.blendEquationSeparate(Ge[ie],Ge[me]),S=ie,A=me),(K!==T||le!==y||j!==b||Ee!==R)&&(i.blendFuncSeparate(it[K],it[le],it[j],it[Ee]),T=K,y=le,b=j,R=Ee),(Se.equals(_)===!1||gt!==E)&&(i.blendColor(Se.r,Se.g,Se.b,gt),_.copy(Se),E=gt),m=L,C=!1}function qe(L,ie){L.side===In?Ie(i.CULL_FACE):te(i.CULL_FACE);let K=L.side===Xt;ie&&(K=!K),Mt(K),L.blending===Gi&&L.transparent===!1?Qe(Nn):Qe(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const le=L.stencilWrite;o.setTest(le),le&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),Pt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?te(i.SAMPLE_ALPHA_TO_COVERAGE):Ie(i.SAMPLE_ALPHA_TO_COVERAGE)}function Mt(L){P!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),P=L)}function Tt(L){L!==xu?(te(i.CULL_FACE),L!==N&&(L===al?i.cullFace(i.BACK):L===_u?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ie(i.CULL_FACE),N=L}function Rt(L){L!==V&&(H&&i.lineWidth(L),V=L)}function Pt(L,ie,K){L?(te(i.POLYGON_OFFSET_FILL),($!==ie||O!==K)&&($=ie,O=K,a.getReversed()&&(ie=-ie),i.polygonOffset(ie,K))):Ie(i.POLYGON_OFFSET_FILL)}function mt(L){L?te(i.SCISSOR_TEST):Ie(i.SCISSOR_TEST)}function St(L){L===void 0&&(L=i.TEXTURE0+Y-1),fe!==L&&(i.activeTexture(L),fe=L)}function D(L,ie,K){K===void 0&&(fe===null?K=i.TEXTURE0+Y-1:K=fe);let le=ge[K];le===void 0&&(le={type:void 0,texture:void 0},ge[K]=le),(le.type!==L||le.texture!==ie)&&(fe!==K&&(i.activeTexture(K),fe=K),i.bindTexture(L,ie||se[L]),le.type=L,le.texture=ie)}function Gt(){const L=ge[fe];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function je(){try{i.compressedTexImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function w(){try{i.compressedTexImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function x(){try{i.texSubImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function F(){try{i.texSubImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function z(){try{i.compressedTexSubImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function W(){try{i.compressedTexSubImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function ne(){try{i.texStorage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function re(){try{i.texStorage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function X(){try{i.texImage2D(...arguments)}catch(L){$e("WebGLState:",L)}}function Z(){try{i.texImage3D(...arguments)}catch(L){$e("WebGLState:",L)}}function ae(L){return f[L]!==void 0?f[L]:i.getParameter(L)}function Te(L,ie){f[L]!==ie&&(i.pixelStorei(L,ie),f[L]=ie)}function he(L){pt.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),pt.copy(L))}function oe(L){Je.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),Je.copy(L))}function Re(L,ie){let K=c.get(ie);K===void 0&&(K=new WeakMap,c.set(ie,K));let le=K.get(L);le===void 0&&(le=i.getUniformBlockIndex(ie,L.name),K.set(L,le))}function Pe(L,ie){const le=c.get(ie).get(L);l.get(ie)!==le&&(i.uniformBlockBinding(ie,le,L.__bindingPointIndex),l.set(ie,le))}function Oe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},fe=null,ge={},u={},d=new WeakMap,g=[],v=null,p=!1,m=null,S=null,T=null,y=null,A=null,b=null,R=null,_=new Xe(0,0,0),E=0,C=!1,P=null,N=null,V=null,$=null,O=null,pt.set(0,0,i.canvas.width,i.canvas.height),Je.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:Ie,bindFramebuffer:Fe,drawBuffers:Ce,useProgram:_t,setBlending:Qe,setMaterial:qe,setFlipSided:Mt,setCullFace:Tt,setLineWidth:Rt,setPolygonOffset:Pt,setScissorTest:mt,activeTexture:St,bindTexture:D,unbindTexture:Gt,compressedTexImage2D:je,compressedTexImage3D:w,texImage2D:X,texImage3D:Z,pixelStorei:Te,getParameter:ae,updateUBOMapping:Re,uniformBlockBinding:Pe,texStorage2D:ne,texStorage3D:re,texSubImage2D:x,texSubImage3D:F,compressedTexSubImage2D:z,compressedTexSubImage3D:W,scissor:he,viewport:oe,reset:Oe}}function ex(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ce,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,x){return g?new OffscreenCanvas(w,x):pr("canvas")}function p(w,x,F){let z=1;const W=je(w);if((W.width>F||W.height>F)&&(z=F/Math.max(W.width,W.height)),z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ne=Math.floor(z*W.width),re=Math.floor(z*W.height);u===void 0&&(u=v(ne,re));const X=x?v(ne,re):u;return X.width=ne,X.height=re,X.getContext("2d").drawImage(w,0,0,ne,re),Le("WebGLRenderer: Texture has been resized from ("+W.width+"x"+W.height+") to ("+ne+"x"+re+")."),X}else return"data"in w&&Le("WebGLRenderer: Image in DataTexture is too big ("+W.width+"x"+W.height+")."),w;return w}function m(w){return w.generateMipmaps}function S(w){i.generateMipmap(w)}function T(w){return w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?i.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(w,x,F,z,W,ne=!1){if(w!==null){if(i[w]!==void 0)return i[w];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let re;z&&(re=e.get("EXT_texture_norm16"),re||Le("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=x;if(x===i.RED&&(F===i.FLOAT&&(X=i.R32F),F===i.HALF_FLOAT&&(X=i.R16F),F===i.UNSIGNED_BYTE&&(X=i.R8),F===i.UNSIGNED_SHORT&&re&&(X=re.R16_EXT),F===i.SHORT&&re&&(X=re.R16_SNORM_EXT)),x===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.R8UI),F===i.UNSIGNED_SHORT&&(X=i.R16UI),F===i.UNSIGNED_INT&&(X=i.R32UI),F===i.BYTE&&(X=i.R8I),F===i.SHORT&&(X=i.R16I),F===i.INT&&(X=i.R32I)),x===i.RG&&(F===i.FLOAT&&(X=i.RG32F),F===i.HALF_FLOAT&&(X=i.RG16F),F===i.UNSIGNED_BYTE&&(X=i.RG8),F===i.UNSIGNED_SHORT&&re&&(X=re.RG16_EXT),F===i.SHORT&&re&&(X=re.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RG8UI),F===i.UNSIGNED_SHORT&&(X=i.RG16UI),F===i.UNSIGNED_INT&&(X=i.RG32UI),F===i.BYTE&&(X=i.RG8I),F===i.SHORT&&(X=i.RG16I),F===i.INT&&(X=i.RG32I)),x===i.RGB_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGB8UI),F===i.UNSIGNED_SHORT&&(X=i.RGB16UI),F===i.UNSIGNED_INT&&(X=i.RGB32UI),F===i.BYTE&&(X=i.RGB8I),F===i.SHORT&&(X=i.RGB16I),F===i.INT&&(X=i.RGB32I)),x===i.RGBA_INTEGER&&(F===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),F===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),F===i.UNSIGNED_INT&&(X=i.RGBA32UI),F===i.BYTE&&(X=i.RGBA8I),F===i.SHORT&&(X=i.RGBA16I),F===i.INT&&(X=i.RGBA32I)),x===i.RGB&&(F===i.UNSIGNED_SHORT&&re&&(X=re.RGB16_EXT),F===i.SHORT&&re&&(X=re.RGB16_SNORM_EXT),F===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),F===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),x===i.RGBA){const Z=ne?dr:Ve.getTransfer(W);F===i.FLOAT&&(X=i.RGBA32F),F===i.HALF_FLOAT&&(X=i.RGBA16F),F===i.UNSIGNED_BYTE&&(X=Z===tt?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT&&re&&(X=re.RGBA16_EXT),F===i.SHORT&&re&&(X=re.RGBA16_SNORM_EXT),F===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function A(w,x){let F;return w?x===null||x===Sn||x===ys?F=i.DEPTH24_STENCIL8:x===_n?F=i.DEPTH32F_STENCIL8:x===vs&&(F=i.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Sn||x===ys?F=i.DEPTH_COMPONENT24:x===_n?F=i.DEPTH_COMPONENT32F:x===vs&&(F=i.DEPTH_COMPONENT16),F}function b(w,x){return m(w)===!0||w.isFramebufferTexture&&w.minFilter!==Lt&&w.minFilter!==Ft?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function R(w){const x=w.target;x.removeEventListener("dispose",R),E(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&f.delete(x)}function _(w){const x=w.target;x.removeEventListener("dispose",_),P(x)}function E(w){const x=n.get(w);if(x.__webglInit===void 0)return;const F=w.source,z=d.get(F);if(z){const W=z[x.__cacheKey];W.usedTimes--,W.usedTimes===0&&C(w),Object.keys(z).length===0&&d.delete(F)}n.remove(w)}function C(w){const x=n.get(w);i.deleteTexture(x.__webglTexture);const F=w.source,z=d.get(F);delete z[x.__cacheKey],a.memory.textures--}function P(w){const x=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(x.__webglFramebuffer[z]))for(let W=0;W<x.__webglFramebuffer[z].length;W++)i.deleteFramebuffer(x.__webglFramebuffer[z][W]);else i.deleteFramebuffer(x.__webglFramebuffer[z]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[z])}else{if(Array.isArray(x.__webglFramebuffer))for(let z=0;z<x.__webglFramebuffer.length;z++)i.deleteFramebuffer(x.__webglFramebuffer[z]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let z=0;z<x.__webglColorRenderbuffer.length;z++)x.__webglColorRenderbuffer[z]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[z]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const F=w.textures;for(let z=0,W=F.length;z<W;z++){const ne=n.get(F[z]);ne.__webglTexture&&(i.deleteTexture(ne.__webglTexture),a.memory.textures--),n.remove(F[z])}n.remove(w)}let N=0;function V(){N=0}function $(){return N}function O(w){N=w}function Y(){const w=N;return w>=s.maxTextures&&Le("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+s.maxTextures),N+=1,w}function H(w){const x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function Q(w,x){const F=n.get(w);if(w.isVideoTexture&&D(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&F.__version!==w.version){const z=w.image;if(z===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{Ie(F,w,x);return}}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+x)}function ee(w,x){const F=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){Ie(F,w,x);return}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+x)}function fe(w,x){const F=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){Ie(F,w,x);return}t.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+x)}function ge(w,x){const F=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&F.__version!==w.version){Fe(F,w,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+x)}const ye={[Pa]:i.REPEAT,[Dn]:i.CLAMP_TO_EDGE,[La]:i.MIRRORED_REPEAT},Ze={[Lt]:i.NEAREST,[zu]:i.NEAREST_MIPMAP_NEAREST,[Ps]:i.NEAREST_MIPMAP_LINEAR,[Ft]:i.LINEAR,[Ir]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},pt={[Vu]:i.NEVER,[$u]:i.ALWAYS,[Wu]:i.LESS,[Ao]:i.LEQUAL,[Xu]:i.EQUAL,[Ro]:i.GEQUAL,[qu]:i.GREATER,[Yu]:i.NOTEQUAL};function Je(w,x){if(x.type===_n&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Ft||x.magFilter===Ir||x.magFilter===Ps||x.magFilter===di||x.minFilter===Ft||x.minFilter===Ir||x.minFilter===Ps||x.minFilter===di)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(w,i.TEXTURE_WRAP_S,ye[x.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,ye[x.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,ye[x.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,Ze[x.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,Ze[x.minFilter]),x.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,pt[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Lt||x.minFilter!==Ps&&x.minFilter!==di||x.type===_n&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");i.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function J(w,x){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",R));const z=x.source;let W=d.get(z);W===void 0&&(W={},d.set(z,W));const ne=H(x);if(ne!==w.__cacheKey){W[ne]===void 0&&(W[ne]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,F=!0),W[ne].usedTimes++;const re=W[w.__cacheKey];re!==void 0&&(W[w.__cacheKey].usedTimes--,re.usedTimes===0&&C(x)),w.__cacheKey=ne,w.__webglTexture=W[ne].texture}return F}function se(w,x,F){return Math.floor(Math.floor(w/F)/x)}function te(w,x,F,z){const ne=w.updateRanges;if(ne.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,F,z,x.data);else{ne.sort((Te,he)=>Te.start-he.start);let re=0;for(let Te=1;Te<ne.length;Te++){const he=ne[re],oe=ne[Te],Re=he.start+he.count,Pe=se(oe.start,x.width,4),Oe=se(he.start,x.width,4);oe.start<=Re+1&&Pe===Oe&&se(oe.start+oe.count-1,x.width,4)===Pe?he.count=Math.max(he.count,oe.start+oe.count-he.start):(++re,ne[re]=oe)}ne.length=re+1;const X=t.getParameter(i.UNPACK_ROW_LENGTH),Z=t.getParameter(i.UNPACK_SKIP_PIXELS),ae=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Te=0,he=ne.length;Te<he;Te++){const oe=ne[Te],Re=Math.floor(oe.start/4),Pe=Math.ceil(oe.count/4),Oe=Re%x.width,L=Math.floor(Re/x.width),ie=Pe,K=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Oe),t.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Oe,L,ie,K,F,z,x.data)}w.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,X),t.pixelStorei(i.UNPACK_SKIP_PIXELS,Z),t.pixelStorei(i.UNPACK_SKIP_ROWS,ae)}}function Ie(w,x,F){let z=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(z=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(z=i.TEXTURE_3D);const W=J(w,x),ne=x.source;t.bindTexture(z,w.__webglTexture,i.TEXTURE0+F);const re=n.get(ne);if(ne.version!==re.__version||W===!0){if(t.activeTexture(i.TEXTURE0+F),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){const K=Ve.getPrimaries(Ve.workingColorSpace),le=x.colorSpace===Zn?null:Ve.getPrimaries(x.colorSpace),me=x.colorSpace===Zn||K===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let Z=p(x.image,!1,s.maxTextureSize);Z=Gt(x,Z);const ae=r.convert(x.format,x.colorSpace),Te=r.convert(x.type);let he=y(x.internalFormat,ae,Te,x.normalized,x.colorSpace,x.isVideoTexture);Je(z,x);let oe;const Re=x.mipmaps,Pe=x.isVideoTexture!==!0,Oe=re.__version===void 0||W===!0,L=ne.dataReady,ie=b(x,Z);if(x.isDepthTexture)he=A(x.format===pi,x.type),Oe&&(Pe?t.texStorage2D(i.TEXTURE_2D,1,he,Z.width,Z.height):t.texImage2D(i.TEXTURE_2D,0,he,Z.width,Z.height,0,ae,Te,null));else if(x.isDataTexture)if(Re.length>0){Pe&&Oe&&t.texStorage2D(i.TEXTURE_2D,ie,he,Re[0].width,Re[0].height);for(let K=0,le=Re.length;K<le;K++)oe=Re[K],Pe?L&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,oe.width,oe.height,ae,Te,oe.data):t.texImage2D(i.TEXTURE_2D,K,he,oe.width,oe.height,0,ae,Te,oe.data);x.generateMipmaps=!1}else Pe?(Oe&&t.texStorage2D(i.TEXTURE_2D,ie,he,Z.width,Z.height),L&&te(x,Z,ae,Te)):t.texImage2D(i.TEXTURE_2D,0,he,Z.width,Z.height,0,ae,Te,Z.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Pe&&Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,he,Re[0].width,Re[0].height,Z.depth);for(let K=0,le=Re.length;K<le;K++)if(oe=Re[K],x.format!==cn)if(ae!==null)if(Pe){if(L)if(x.layerUpdates.size>0){const me=Wl(oe.width,oe.height,x.format,x.type);for(const j of x.layerUpdates){const Ee=oe.data.subarray(j*me/oe.data.BYTES_PER_ELEMENT,(j+1)*me/oe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,j,oe.width,oe.height,1,ae,Ee)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,oe.width,oe.height,Z.depth,ae,oe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,K,he,oe.width,oe.height,Z.depth,0,oe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Pe?L&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,K,0,0,0,oe.width,oe.height,Z.depth,ae,Te,oe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,K,he,oe.width,oe.height,Z.depth,0,ae,Te,oe.data)}else{Pe&&Oe&&t.texStorage2D(i.TEXTURE_2D,ie,he,Re[0].width,Re[0].height);for(let K=0,le=Re.length;K<le;K++)oe=Re[K],x.format!==cn?ae!==null?Pe?L&&t.compressedTexSubImage2D(i.TEXTURE_2D,K,0,0,oe.width,oe.height,ae,oe.data):t.compressedTexImage2D(i.TEXTURE_2D,K,he,oe.width,oe.height,0,oe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Pe?L&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,oe.width,oe.height,ae,Te,oe.data):t.texImage2D(i.TEXTURE_2D,K,he,oe.width,oe.height,0,ae,Te,oe.data)}else if(x.isDataArrayTexture)if(Pe){if(Oe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,ie,he,Z.width,Z.height,Z.depth),L)if(x.layerUpdates.size>0){const K=Wl(Z.width,Z.height,x.format,x.type);for(const le of x.layerUpdates){const me=Z.data.subarray(le*K/Z.data.BYTES_PER_ELEMENT,(le+1)*K/Z.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,le,Z.width,Z.height,1,ae,Te,me)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Z.width,Z.height,Z.depth,ae,Te,Z.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,he,Z.width,Z.height,Z.depth,0,ae,Te,Z.data);else if(x.isData3DTexture)Pe?(Oe&&t.texStorage3D(i.TEXTURE_3D,ie,he,Z.width,Z.height,Z.depth),L&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Z.width,Z.height,Z.depth,ae,Te,Z.data)):t.texImage3D(i.TEXTURE_3D,0,he,Z.width,Z.height,Z.depth,0,ae,Te,Z.data);else if(x.isFramebufferTexture){if(Oe)if(Pe)t.texStorage2D(i.TEXTURE_2D,ie,he,Z.width,Z.height);else{let K=Z.width,le=Z.height;for(let me=0;me<ie;me++)t.texImage2D(i.TEXTURE_2D,me,he,K,le,0,ae,Te,null),K>>=1,le>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){const K=i.canvas;if(K.hasAttribute("layoutsubtree")||K.setAttribute("layoutsubtree","true"),Z.parentNode!==K){K.appendChild(Z),f.add(x),K.onpaint=le=>{const me=le.changedElements;for(const j of f)me.includes(j.image)&&(j.needsUpdate=!0)},K.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,Z);else{const me=i.RGBA,j=i.RGBA,Ee=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,me,j,Ee,Z)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Re.length>0){if(Pe&&Oe){const K=je(Re[0]);t.texStorage2D(i.TEXTURE_2D,ie,he,K.width,K.height)}for(let K=0,le=Re.length;K<le;K++)oe=Re[K],Pe?L&&t.texSubImage2D(i.TEXTURE_2D,K,0,0,ae,Te,oe):t.texImage2D(i.TEXTURE_2D,K,he,ae,Te,oe);x.generateMipmaps=!1}else if(Pe){if(Oe){const K=je(Z);t.texStorage2D(i.TEXTURE_2D,ie,he,K.width,K.height)}L&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,Te,Z)}else t.texImage2D(i.TEXTURE_2D,0,he,ae,Te,Z);m(x)&&S(z),re.__version=ne.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Fe(w,x,F){if(x.image.length!==6)return;const z=J(w,x),W=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+F);const ne=n.get(W);if(W.version!==ne.__version||z===!0){t.activeTexture(i.TEXTURE0+F);const re=Ve.getPrimaries(Ve.workingColorSpace),X=x.colorSpace===Zn?null:Ve.getPrimaries(x.colorSpace),Z=x.colorSpace===Zn||re===X?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z);const ae=x.isCompressedTexture||x.image[0].isCompressedTexture,Te=x.image[0]&&x.image[0].isDataTexture,he=[];for(let j=0;j<6;j++)!ae&&!Te?he[j]=p(x.image[j],!0,s.maxCubemapSize):he[j]=Te?x.image[j].image:x.image[j],he[j]=Gt(x,he[j]);const oe=he[0],Re=r.convert(x.format,x.colorSpace),Pe=r.convert(x.type),Oe=y(x.internalFormat,Re,Pe,x.normalized,x.colorSpace),L=x.isVideoTexture!==!0,ie=ne.__version===void 0||z===!0,K=W.dataReady;let le=b(x,oe);Je(i.TEXTURE_CUBE_MAP,x);let me;if(ae){L&&ie&&t.texStorage2D(i.TEXTURE_CUBE_MAP,le,Oe,oe.width,oe.height);for(let j=0;j<6;j++){me=he[j].mipmaps;for(let Ee=0;Ee<me.length;Ee++){const Se=me[Ee];x.format!==cn?Re!==null?L?K&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,0,0,Se.width,Se.height,Re,Se.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,Oe,Se.width,Se.height,0,Se.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,0,0,Se.width,Se.height,Re,Pe,Se.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,Oe,Se.width,Se.height,0,Re,Pe,Se.data)}}}else{if(me=x.mipmaps,L&&ie){me.length>0&&le++;const j=je(he[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,le,Oe,j.width,j.height)}for(let j=0;j<6;j++)if(Te){L?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,he[j].width,he[j].height,Re,Pe,he[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Oe,he[j].width,he[j].height,0,Re,Pe,he[j].data);for(let Ee=0;Ee<me.length;Ee++){const gt=me[Ee].image[j].image;L?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,0,0,gt.width,gt.height,Re,Pe,gt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,Oe,gt.width,gt.height,0,Re,Pe,gt.data)}}else{L?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Re,Pe,he[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Oe,Re,Pe,he[j]);for(let Ee=0;Ee<me.length;Ee++){const Se=me[Ee];L?K&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,0,0,Re,Pe,Se.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,Oe,Re,Pe,Se.image[j])}}}m(x)&&S(i.TEXTURE_CUBE_MAP),ne.__version=W.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Ce(w,x,F,z,W,ne){const re=r.convert(F.format,F.colorSpace),X=r.convert(F.type),Z=y(F.internalFormat,re,X,F.normalized,F.colorSpace),ae=n.get(x),Te=n.get(F);if(Te.__renderTarget=x,!ae.__hasExternalTextures){const he=Math.max(1,x.width>>ne),oe=Math.max(1,x.height>>ne);W===i.TEXTURE_3D||W===i.TEXTURE_2D_ARRAY?t.texImage3D(W,ne,Z,he,oe,x.depth,0,re,X,null):t.texImage2D(W,ne,Z,he,oe,0,re,X,null)}t.bindFramebuffer(i.FRAMEBUFFER,w),St(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,z,W,Te.__webglTexture,0,mt(x)):(W===i.TEXTURE_2D||W>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,z,W,Te.__webglTexture,ne),t.bindFramebuffer(i.FRAMEBUFFER,null)}function _t(w,x,F){if(i.bindRenderbuffer(i.RENDERBUFFER,w),x.depthBuffer){const z=x.depthTexture,W=z&&z.isDepthTexture?z.type:null,ne=A(x.stencilBuffer,W),re=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;St(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt(x),ne,x.width,x.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt(x),ne,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ne,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,w)}else{const z=x.textures;for(let W=0;W<z.length;W++){const ne=z[W],re=r.convert(ne.format,ne.colorSpace),X=r.convert(ne.type),Z=y(ne.internalFormat,re,X,ne.normalized,ne.colorSpace);St(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt(x),Z,x.width,x.height):F?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt(x),Z,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Z,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ge(w,x,F){const z=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const W=n.get(x.depthTexture);if(W.__renderTarget=x,(!W.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z){if(W.__webglInit===void 0&&(W.__webglInit=!0,x.depthTexture.addEventListener("dispose",R)),W.__webglTexture===void 0){W.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture),Je(i.TEXTURE_CUBE_MAP,x.depthTexture);const ae=r.convert(x.depthTexture.format),Te=r.convert(x.depthTexture.type);let he;x.depthTexture.format===Bn?he=i.DEPTH_COMPONENT24:x.depthTexture.format===pi&&(he=i.DEPTH24_STENCIL8);for(let oe=0;oe<6;oe++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,he,x.width,x.height,0,ae,Te,null)}}else Q(x.depthTexture,0);const ne=W.__webglTexture,re=mt(x),X=z?i.TEXTURE_CUBE_MAP_POSITIVE_X+F:i.TEXTURE_2D,Z=x.depthTexture.format===pi?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===Bn)St(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,X,ne,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,Z,X,ne,0);else if(x.depthTexture.format===pi)St(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Z,X,ne,0,re):i.framebufferTexture2D(i.FRAMEBUFFER,Z,X,ne,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(w){const x=n.get(w),F=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){const z=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),z){const W=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,z.removeEventListener("dispose",W)};z.addEventListener("dispose",W),x.__depthDisposeCallback=W}x.__boundDepthTexture=z}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(F)for(let z=0;z<6;z++)Ge(x.__webglFramebuffer[z],w,z);else{const z=w.texture.mipmaps;z&&z.length>0?Ge(x.__webglFramebuffer[0],w,0):Ge(x.__webglFramebuffer,w,0)}else if(F){x.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[z]),x.__webglDepthbuffer[z]===void 0)x.__webglDepthbuffer[z]=i.createRenderbuffer(),_t(x.__webglDepthbuffer[z],w,!1);else{const W=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=x.__webglDepthbuffer[z];i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,W,i.RENDERBUFFER,ne)}}else{const z=w.texture.mipmaps;if(z&&z.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),_t(x.__webglDepthbuffer,w,!1);else{const W=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ne),i.framebufferRenderbuffer(i.FRAMEBUFFER,W,i.RENDERBUFFER,ne)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Qe(w,x,F){const z=n.get(w);x!==void 0&&Ce(z.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&it(w)}function qe(w){const x=w.texture,F=n.get(w),z=n.get(x);w.addEventListener("dispose",_);const W=w.textures,ne=w.isWebGLCubeRenderTarget===!0,re=W.length>1;if(re||(z.__webglTexture===void 0&&(z.__webglTexture=i.createTexture()),z.__version=x.version,a.memory.textures++),ne){F.__webglFramebuffer=[];for(let X=0;X<6;X++)if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer[X]=[];for(let Z=0;Z<x.mipmaps.length;Z++)F.__webglFramebuffer[X][Z]=i.createFramebuffer()}else F.__webglFramebuffer[X]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){F.__webglFramebuffer=[];for(let X=0;X<x.mipmaps.length;X++)F.__webglFramebuffer[X]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(re)for(let X=0,Z=W.length;X<Z;X++){const ae=n.get(W[X]);ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture(),a.memory.textures++)}if(w.samples>0&&St(w)===!1){F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let X=0;X<W.length;X++){const Z=W[X];F.__webglColorRenderbuffer[X]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[X]);const ae=r.convert(Z.format,Z.colorSpace),Te=r.convert(Z.type),he=y(Z.internalFormat,ae,Te,Z.normalized,Z.colorSpace,w.isXRRenderTarget===!0),oe=mt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,he,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+X,i.RENDERBUFFER,F.__webglColorRenderbuffer[X])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),_t(F.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ne){t.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture),Je(i.TEXTURE_CUBE_MAP,x);for(let X=0;X<6;X++)if(x.mipmaps&&x.mipmaps.length>0)for(let Z=0;Z<x.mipmaps.length;Z++)Ce(F.__webglFramebuffer[X][Z],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,Z);else Ce(F.__webglFramebuffer[X],w,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);m(x)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(re){for(let X=0,Z=W.length;X<Z;X++){const ae=W[X],Te=n.get(ae);let he=i.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(he=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(he,Te.__webglTexture),Je(he,ae),Ce(F.__webglFramebuffer,w,ae,i.COLOR_ATTACHMENT0+X,he,0),m(ae)&&S(he)}t.unbindTexture()}else{let X=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(X=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(X,z.__webglTexture),Je(X,x),x.mipmaps&&x.mipmaps.length>0)for(let Z=0;Z<x.mipmaps.length;Z++)Ce(F.__webglFramebuffer[Z],w,x,i.COLOR_ATTACHMENT0,X,Z);else Ce(F.__webglFramebuffer,w,x,i.COLOR_ATTACHMENT0,X,0);m(x)&&S(X),t.unbindTexture()}w.depthBuffer&&it(w)}function Mt(w){const x=w.textures;for(let F=0,z=x.length;F<z;F++){const W=x[F];if(m(W)){const ne=T(w),re=n.get(W).__webglTexture;t.bindTexture(ne,re),S(ne),t.unbindTexture()}}}const Tt=[],Rt=[];function Pt(w){if(w.samples>0){if(St(w)===!1){const x=w.textures,F=w.width,z=w.height;let W=i.COLOR_BUFFER_BIT;const ne=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=n.get(w),X=x.length>1;if(X)for(let ae=0;ae<x.length;ae++)t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,re.__webglMultisampledFramebuffer);const Z=w.texture.mipmaps;Z&&Z.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglFramebuffer);for(let ae=0;ae<x.length;ae++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(W|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(W|=i.STENCIL_BUFFER_BIT)),X){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,re.__webglColorRenderbuffer[ae]);const Te=n.get(x[ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Te,0)}i.blitFramebuffer(0,0,F,z,0,0,F,z,W,i.NEAREST),l===!0&&(Tt.length=0,Rt.length=0,Tt.push(i.COLOR_ATTACHMENT0+ae),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Tt.push(ne),Rt.push(ne),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Rt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Tt))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),X)for(let ae=0;ae<x.length;ae++){t.bindFramebuffer(i.FRAMEBUFFER,re.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,re.__webglColorRenderbuffer[ae]);const Te=n.get(x[ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,re.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,Te,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,re.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const x=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function mt(w){return Math.min(s.maxSamples,w.samples)}function St(w){const x=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function D(w){const x=a.render.frame;h.get(w)!==x&&(h.set(w,x),w.update())}function Gt(w,x){const F=w.colorSpace,z=w.format,W=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==fr&&F!==Zn&&(Ve.getTransfer(F)===tt?(z!==cn||W!==Zt)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):$e("WebGLTextures: Unsupported texture color space:",F)),x}function je(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=Y,this.resetTextureUnits=V,this.getTextureUnits=$,this.setTextureUnits=O,this.setTexture2D=Q,this.setTexture2DArray=ee,this.setTexture3D=fe,this.setTextureCube=ge,this.rebindTextures=Qe,this.setupRenderTarget=qe,this.updateRenderTargetMipmap=Mt,this.updateMultisampleRenderTarget=Pt,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Ce,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function tx(i,e){function t(n,s=Zn){let r;const a=Ve.getTransfer(s);if(n===Zt)return i.UNSIGNED_BYTE;if(n===So)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Xc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===qc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Vc)return i.BYTE;if(n===Wc)return i.SHORT;if(n===vs)return i.UNSIGNED_SHORT;if(n===Mo)return i.INT;if(n===Sn)return i.UNSIGNED_INT;if(n===_n)return i.FLOAT;if(n===kn)return i.HALF_FLOAT;if(n===Yc)return i.ALPHA;if(n===$c)return i.RGB;if(n===cn)return i.RGBA;if(n===Bn)return i.DEPTH_COMPONENT;if(n===pi)return i.DEPTH_STENCIL;if(n===Kc)return i.RED;if(n===Eo)return i.RED_INTEGER;if(n===_i)return i.RG;if(n===To)return i.RG_INTEGER;if(n===wo)return i.RGBA_INTEGER;if(n===nr||n===ir||n===sr||n===rr)if(a===tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===nr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ir)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===rr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===nr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ir)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===sr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===rr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ia||n===Da||n===Ua||n===Na)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ia)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Da)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ua)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Na)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Fa||n===Oa||n===ka||n===Ba||n===za||n===hr||n===Ha)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Fa||n===Oa)return a===tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ka)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ba)return r.COMPRESSED_R11_EAC;if(n===za)return r.COMPRESSED_SIGNED_R11_EAC;if(n===hr)return r.COMPRESSED_RG11_EAC;if(n===Ha)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Ga||n===Va||n===Wa||n===Xa||n===qa||n===Ya||n===$a||n===Ka||n===Za||n===Ja||n===Qa||n===ja||n===eo||n===to)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ga)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Va)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Wa)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Xa)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qa)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ya)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===$a)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ka)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Za)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ja)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Qa)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ja)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===eo)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===to)return a===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===no||n===io||n===so)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===no)return a===tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===io)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===so)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ro||n===ao||n===ur||n===oo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ro)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ao)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ur)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===oo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===ys?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const nx=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,ix=`
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

}`;class sx{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new sh(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new bn({vertexShader:nx,fragmentShader:ix,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new De(new vr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class rx extends yi{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,g=null;const v=typeof XRWebGLBinding<"u",p=new sx,m={},S=t.getContextAttributes();let T=null,y=null;const A=[],b=[],R=new ce;let _=null;const E=new an;E.viewport=new ut;const C=new an;C.viewport=new ut;const P=[E,C],N=new md;let V=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let se=A[J];return se===void 0&&(se=new zr,A[J]=se),se.getTargetRaySpace()},this.getControllerGrip=function(J){let se=A[J];return se===void 0&&(se=new zr,A[J]=se),se.getGripSpace()},this.getHand=function(J){let se=A[J];return se===void 0&&(se=new zr,A[J]=se),se.getHandSpace()};function O(J){const se=b.indexOf(J.inputSource);if(se===-1)return;const te=A[se];te!==void 0&&(te.update(J.inputSource,J.frame,c||a),te.dispatchEvent({type:J.type,data:J.inputSource}))}function Y(){s.removeEventListener("select",O),s.removeEventListener("selectstart",O),s.removeEventListener("selectend",O),s.removeEventListener("squeeze",O),s.removeEventListener("squeezestart",O),s.removeEventListener("squeezeend",O),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",H);for(let J=0;J<A.length;J++){const se=b[J];se!==null&&(b[J]=null,A[J].disconnect(se))}V=null,$=null,p.reset();for(const J in m)delete m[J];e.setRenderTarget(T),d=null,u=null,f=null,s=null,y=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(_),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(T=e.getRenderTarget(),s.addEventListener("select",O),s.addEventListener("selectstart",O),s.addEventListener("selectend",O),s.addEventListener("squeeze",O),s.addEventListener("squeezestart",O),s.addEventListener("squeezeend",O),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",H),S.xrCompatible!==!0&&await t.makeXRCompatible(),_=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,Ie=null,Fe=null;S.depth&&(Fe=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=S.stencil?pi:Bn,Ie=S.stencil?ys:Sn);const Ce={colorFormat:t.RGBA8,depthFormat:Fe,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ce),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new Mn(u.textureWidth,u.textureHeight,{format:cn,type:Zt,depthTexture:new $i(u.textureWidth,u.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const te={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new Mn(d.framebufferWidth,d.framebufferHeight,{format:cn,type:Zt,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Je.setContext(s),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function H(J){for(let se=0;se<J.removed.length;se++){const te=J.removed[se],Ie=b.indexOf(te);Ie>=0&&(b[Ie]=null,A[Ie].disconnect(te))}for(let se=0;se<J.added.length;se++){const te=J.added[se];let Ie=b.indexOf(te);if(Ie===-1){for(let Ce=0;Ce<A.length;Ce++)if(Ce>=b.length){b.push(te),Ie=Ce;break}else if(b[Ce]===null){b[Ce]=te,Ie=Ce;break}if(Ie===-1)break}const Fe=A[Ie];Fe&&Fe.connect(te)}}const Q=new I,ee=new I;function fe(J,se,te){Q.setFromMatrixPosition(se.matrixWorld),ee.setFromMatrixPosition(te.matrixWorld);const Ie=Q.distanceTo(ee),Fe=se.projectionMatrix.elements,Ce=te.projectionMatrix.elements,_t=Fe[14]/(Fe[10]-1),Ge=Fe[14]/(Fe[10]+1),it=(Fe[9]+1)/Fe[5],Qe=(Fe[9]-1)/Fe[5],qe=(Fe[8]-1)/Fe[0],Mt=(Ce[8]+1)/Ce[0],Tt=_t*qe,Rt=_t*Mt,Pt=Ie/(-qe+Mt),mt=Pt*-qe;if(se.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(mt),J.translateZ(Pt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Fe[10]===-1)J.projectionMatrix.copy(se.projectionMatrix),J.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const St=_t+Pt,D=Ge+Pt,Gt=Tt-mt,je=Rt+(Ie-mt),w=it*Ge/D*St,x=Qe*Ge/D*St;J.projectionMatrix.makePerspective(Gt,je,w,x,St,D),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function ge(J,se){se===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(se.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let se=J.near,te=J.far;p.texture!==null&&(p.depthNear>0&&(se=p.depthNear),p.depthFar>0&&(te=p.depthFar)),N.near=C.near=E.near=se,N.far=C.far=E.far=te,(V!==N.near||$!==N.far)&&(s.updateRenderState({depthNear:N.near,depthFar:N.far}),V=N.near,$=N.far),N.layers.mask=J.layers.mask|6,E.layers.mask=N.layers.mask&-5,C.layers.mask=N.layers.mask&-3;const Ie=J.parent,Fe=N.cameras;ge(N,Ie);for(let Ce=0;Ce<Fe.length;Ce++)ge(Fe[Ce],Ie);Fe.length===2?fe(N,E,C):N.projectionMatrix.copy(E.projectionMatrix),ye(J,N,Ie)};function ye(J,se,te){te===null?J.matrix.copy(se.matrixWorld):(J.matrix.copy(te.matrixWorld),J.matrix.invert(),J.matrix.multiply(se.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(se.projectionMatrix),J.projectionMatrixInverse.copy(se.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=co*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(J){l=J,u!==null&&(u.fixedFoveation=J),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(N)},this.getCameraTexture=function(J){return m[J]};let Ze=null;function pt(J,se){if(h=se.getViewerPose(c||a),g=se,h!==null){const te=h.views;d!==null&&(e.setRenderTargetFramebuffer(y,d.framebuffer),e.setRenderTarget(y));let Ie=!1;te.length!==N.cameras.length&&(N.cameras.length=0,Ie=!0);for(let Ge=0;Ge<te.length;Ge++){const it=te[Ge];let Qe=null;if(d!==null)Qe=d.getViewport(it);else{const Mt=f.getViewSubImage(u,it);Qe=Mt.viewport,Ge===0&&(e.setRenderTargetTextures(y,Mt.colorTexture,Mt.depthStencilTexture),e.setRenderTarget(y))}let qe=P[Ge];qe===void 0&&(qe=new an,qe.layers.enable(Ge),qe.viewport=new ut,P[Ge]=qe),qe.matrix.fromArray(it.transform.matrix),qe.matrix.decompose(qe.position,qe.quaternion,qe.scale),qe.projectionMatrix.fromArray(it.projectionMatrix),qe.projectionMatrixInverse.copy(qe.projectionMatrix).invert(),qe.viewport.set(Qe.x,Qe.y,Qe.width,Qe.height),Ge===0&&(N.matrix.copy(qe.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ie===!0&&N.cameras.push(qe)}const Fe=s.enabledFeatures;if(Fe&&Fe.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){f=n.getBinding();const Ge=f.getDepthInformation(te[0]);Ge&&Ge.isValid&&Ge.texture&&p.init(Ge,s.renderState)}if(Fe&&Fe.includes("camera-access")&&v){e.state.unbindTexture(),f=n.getBinding();for(let Ge=0;Ge<te.length;Ge++){const it=te[Ge].camera;if(it){let Qe=m[it];Qe||(Qe=new sh,m[it]=Qe);const qe=f.getCameraImage(it);Qe.sourceTexture=qe}}}}for(let te=0;te<A.length;te++){const Ie=b[te],Fe=A[te];Ie!==null&&Fe!==void 0&&Fe.update(Ie,se,c||a)}Ze&&Ze(J,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),g=null}const Je=new _h;Je.setAnimationLoop(pt),this.setAnimationLoop=function(J){Ze=J},this.dispose=function(){}}}const ax=new at,Th=new Ne;Th.set(-1,0,0,0,1,0,0,0,1);function ox(i,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,ph(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,S,T,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),f(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&d(p,m,y)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),v(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,S,T):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Xt&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Xt&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const S=e.get(m),T=S.envMap,y=S.envMapRotation;T&&(p.envMap.value=T,p.envMapRotation.value.setFromMatrix4(ax.makeRotationFromEuler(y)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Th),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,S,T){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*S,p.scale.value=T*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,S){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Xt&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function v(p,m){const S=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function lx(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){const b=A.program;n.uniformBlockBinding(y,b)}function c(y,A){let b=s[y.id];b===void 0&&(p(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",S));const R=A.program;n.updateUBOMapping(y,R);const _=e.render.frame;r[y.id]!==_&&(u(y),r[y.id]=_)}function h(y){const A=f();y.__bindingPointIndex=A;const b=i.createBuffer(),R=y.__size,_=y.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,R,_),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,A,b),b}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return $e("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const A=s[y.id],b=y.uniforms,R=y.__cache;i.bindBuffer(i.UNIFORM_BUFFER,A);for(let _=0,E=b.length;_<E;_++){const C=b[_];if(Array.isArray(C))for(let P=0,N=C.length;P<N;P++)d(C[P],_,P,R);else d(C,_,0,R)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(y,A,b,R){if(v(y,A,b,R)===!0){const _=y.__offset,E=y.value;if(Array.isArray(E)){let C=0;for(let P=0;P<E.length;P++){const N=E[P],V=m(N);g(N,y.__data,C),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(C+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(E,y.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,_,y.__data)}}function g(y,A,b){typeof y=="number"||typeof y=="boolean"?A[0]=y:y.isMatrix3?(A[0]=y.elements[0],A[1]=y.elements[1],A[2]=y.elements[2],A[3]=0,A[4]=y.elements[3],A[5]=y.elements[4],A[6]=y.elements[5],A[7]=0,A[8]=y.elements[6],A[9]=y.elements[7],A[10]=y.elements[8],A[11]=0):ArrayBuffer.isView(y)?A.set(new y.constructor(y.buffer,y.byteOffset,A.length)):y.toArray(A,b)}function v(y,A,b,R){const _=y.value,E=A+"_"+b;if(R[E]===void 0)return typeof _=="number"||typeof _=="boolean"?R[E]=_:ArrayBuffer.isView(_)?R[E]=_.slice():R[E]=_.clone(),!0;{const C=R[E];if(typeof _=="number"||typeof _=="boolean"){if(C!==_)return R[E]=_,!0}else{if(ArrayBuffer.isView(_))return!0;if(C.equals(_)===!1)return C.copy(_),!0}}return!1}function p(y){const A=y.uniforms;let b=0;const R=16;for(let E=0,C=A.length;E<C;E++){const P=Array.isArray(A[E])?A[E]:[A[E]];for(let N=0,V=P.length;N<V;N++){const $=P[N],O=Array.isArray($.value)?$.value:[$.value];for(let Y=0,H=O.length;Y<H;Y++){const Q=O[Y],ee=m(Q),fe=b%R,ge=fe%ee.boundary,ye=fe+ge;b+=ge,ye!==0&&R-ye<ee.storage&&(b+=R-ye),$.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=b,b+=ee.storage}}}const _=b%R;return _>0&&(b+=R-_),y.__size=b,y.__cache={},this}function m(y){const A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Le("WebGLRenderer: Unsupported uniform value type.",y),A}function S(y){const A=y.target;A.removeEventListener("dispose",S);const b=a.indexOf(A.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function T(){for(const y in s)i.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:T}}const cx=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let mn=null;function hx(){return mn===null&&(mn=new Mf(cx,16,16,_i,kn),mn.name="DFG_LUT",mn.minFilter=Ft,mn.magFilter=Ft,mn.wrapS=Dn,mn.wrapT=Dn,mn.generateMipmaps=!1,mn.needsUpdate=!0),mn}class ux{constructor(e={}){const{canvas:t=Zu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Zt}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const v=d,p=new Set([wo,To,Eo]),m=new Set([Zt,Sn,vs,ys,So,bo]),S=new Uint32Array(4),T=new Int32Array(4),y=new I;let A=null,b=null;const R=[],_=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,N=null,V=null,$=null,O=null;this._outputColorSpace=Kt;let Y=0,H=0,Q=null,ee=-1,fe=null;const ge=new ut,ye=new ut;let Ze=null;const pt=new Xe(0);let Je=0,J=t.width,se=t.height,te=1,Ie=null,Fe=null;const Ce=new ut(0,0,J,se),_t=new ut(0,0,J,se);let Ge=!1;const it=new Lo;let Qe=!1,qe=!1;const Mt=new at,Tt=new I,Rt=new ut,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let mt=!1;function St(){return Q===null?te:1}let D=n;function Gt(M,U){return t.getContext(M,U)}try{const M={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${yo}`),t.addEventListener("webglcontextlost",gt,!1),t.addEventListener("webglcontextrestored",lt,!1),t.addEventListener("webglcontextcreationerror",un,!1),D===null){const U="webgl2";if(D=Gt(U,M),D===null)throw Gt(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(M){throw $e("WebGLRenderer: "+M.message),M}let je,w,x,F,z,W,ne,re,X,Z,ae,Te,he,oe,Re,Pe,Oe,L,ie,K,le,me,j;function Ee(){je=new h0(D),je.init(),le=new tx(D,je),w=new n0(D,je,e,le),x=new jg(D,je),w.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),V=D.createFramebuffer(),$=D.createFramebuffer(),O=D.createFramebuffer(),F=new d0(D),z=new Bg,W=new ex(D,je,x,z,w,le,F),ne=new c0(C),re=new xd(D),me=new e0(D,re),X=new u0(D,re,F,me),Z=new m0(D,X,re,me,F),L=new p0(D,w,W),Re=new i0(z),ae=new kg(C,ne,je,w,me,Re),Te=new ox(C,z),he=new Hg,oe=new Yg(je),Oe=new jm(C,ne,x,Z,g,l),Pe=new Qg(C,Z,w),j=new lx(D,F,w,x),ie=new t0(D,je,F),K=new f0(D,je,F),F.programs=ae.programs,C.capabilities=w,C.extensions=je,C.properties=z,C.renderLists=he,C.shadowMap=Pe,C.state=x,C.info=F}Ee(),v!==Zt&&(E=new x0(v,t.width,t.height,o,s,r));const Se=new rx(C,D);this.xr=Se,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const M=je.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=je.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(M){M!==void 0&&(te=M,this.setSize(J,se,!1))},this.getSize=function(M){return M.set(J,se)},this.setSize=function(M,U,G=!0){if(Se.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}J=M,se=U,t.width=Math.floor(M*te),t.height=Math.floor(U*te),G===!0&&(t.style.width=M+"px",t.style.height=U+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(J*te,se*te).floor()},this.setDrawingBufferSize=function(M,U,G){J=M,se=U,te=G,t.width=Math.floor(M*G),t.height=Math.floor(U*G),this.setViewport(0,0,M,U)},this.setEffects=function(M){if(v===Zt){$e("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let U=0;U<M.length;U++)if(M[U].isOutputPass===!0){Le("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(ge)},this.getViewport=function(M){return M.copy(Ce)},this.setViewport=function(M,U,G,k){M.isVector4?Ce.set(M.x,M.y,M.z,M.w):Ce.set(M,U,G,k),x.viewport(ge.copy(Ce).multiplyScalar(te).round())},this.getScissor=function(M){return M.copy(_t)},this.setScissor=function(M,U,G,k){M.isVector4?_t.set(M.x,M.y,M.z,M.w):_t.set(M,U,G,k),x.scissor(ye.copy(_t).multiplyScalar(te).round())},this.getScissorTest=function(){return Ge},this.setScissorTest=function(M){x.setScissorTest(Ge=M)},this.setOpaqueSort=function(M){Ie=M},this.setTransparentSort=function(M){Fe=M},this.getClearColor=function(M){return M.copy(Oe.getClearColor())},this.setClearColor=function(){Oe.setClearColor(...arguments)},this.getClearAlpha=function(){return Oe.getClearAlpha()},this.setClearAlpha=function(){Oe.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,G=!0){let k=0;if(M){let B=!1;if(Q!==null){const pe=Q.texture.format;B=p.has(pe)}if(B){const pe=Q.texture.type,ve=m.has(pe),de=Oe.getClearColor(),be=Oe.getClearAlpha(),we=de.r,ke=de.g,ze=de.b;ve?(S[0]=we,S[1]=ke,S[2]=ze,S[3]=be,D.clearBufferuiv(D.COLOR,0,S)):(T[0]=we,T[1]=ke,T[2]=ze,T[3]=be,D.clearBufferiv(D.COLOR,0,T))}else k|=D.COLOR_BUFFER_BIT}U&&(k|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(k|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&D.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),N=M},this.dispose=function(){t.removeEventListener("webglcontextlost",gt,!1),t.removeEventListener("webglcontextrestored",lt,!1),t.removeEventListener("webglcontextcreationerror",un,!1),Oe.dispose(),he.dispose(),oe.dispose(),z.dispose(),ne.dispose(),Z.dispose(),me.dispose(),j.dispose(),ae.dispose(),Se.dispose(),Se.removeEventListener("sessionstart",Wo),Se.removeEventListener("sessionend",Xo),ni.stop()};function gt(M){M.preventDefault(),pl("WebGLRenderer: Context Lost."),P=!0}function lt(){pl("WebGLRenderer: Context Restored."),P=!1;const M=F.autoReset,U=Pe.enabled,G=Pe.autoUpdate,k=Pe.needsUpdate,B=Pe.type;Ee(),F.autoReset=M,Pe.enabled=U,Pe.autoUpdate=G,Pe.needsUpdate=k,Pe.type=B}function un(M){$e("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function fn(M){const U=M.target;U.removeEventListener("dispose",fn),Nh(U)}function Nh(M){Fh(M),z.remove(M)}function Fh(M){const U=z.get(M).programs;U!==void 0&&(U.forEach(function(G){ae.releaseProgram(G)}),M.isShaderMaterial&&ae.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,G,k,B,pe){U===null&&(U=Pt);const ve=B.isMesh&&B.matrixWorld.determinantAffine()<0,de=Bh(M,U,G,k,B);x.setMaterial(k,ve);let be=G.index,we=1;if(k.wireframe===!0){if(be=X.getWireframeAttribute(G),be===void 0)return;we=2}const ke=G.drawRange,ze=G.attributes.position;let Ae=ke.start*we,nt=(ke.start+ke.count)*we;pe!==null&&(Ae=Math.max(Ae,pe.start*we),nt=Math.min(nt,(pe.start+pe.count)*we)),be!==null?(Ae=Math.max(Ae,0),nt=Math.min(nt,be.count)):ze!=null&&(Ae=Math.max(Ae,0),nt=Math.min(nt,ze.count));const vt=nt-Ae;if(vt<0||vt===1/0)return;me.setup(B,k,de,G,be);let xt,st=ie;if(be!==null&&(xt=re.get(be),st=K,st.setIndex(xt)),B.isMesh)k.wireframe===!0?(x.setLineWidth(k.wireframeLinewidth*St()),st.setMode(D.LINES)):st.setMode(D.TRIANGLES);else if(B.isLine){let Dt=k.linewidth;Dt===void 0&&(Dt=1),x.setLineWidth(Dt*St()),B.isLineSegments?st.setMode(D.LINES):B.isLineLoop?st.setMode(D.LINE_LOOP):st.setMode(D.LINE_STRIP)}else B.isPoints?st.setMode(D.POINTS):B.isSprite&&st.setMode(D.TRIANGLES);if(B.isBatchedMesh)if(je.get("WEBGL_multi_draw"))st.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Dt=B._multiDrawStarts,_e=B._multiDrawCounts,qt=B._multiDrawCount,Ye=be?re.get(be).bytesPerElement:1,Jt=z.get(k).currentProgram.getUniforms();for(let dn=0;dn<qt;dn++)Jt.setValue(D,"_gl_DrawID",dn),st.render(Dt[dn]/Ye,_e[dn])}else if(B.isInstancedMesh)st.renderInstances(Ae,vt,B.count);else if(G.isInstancedBufferGeometry){const Dt=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,_e=Math.min(G.instanceCount,Dt);st.renderInstances(Ae,vt,_e)}else st.render(Ae,vt)};function Vo(M,U,G){M.transparent===!0&&M.side===In&&M.forceSinglePass===!1?(M.side=Xt,M.needsUpdate=!0,Cs(M,U,G),M.side=ei,M.needsUpdate=!0,Cs(M,U,G),M.side=In):Cs(M,U,G)}this.compile=function(M,U,G=null){G===null&&(G=M),b=oe.get(G),b.init(U),_.push(b),G.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(b.pushLight(B),B.castShadow&&b.pushShadow(B))}),M!==G&&M.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(b.pushLight(B),B.castShadow&&b.pushShadow(B))}),b.setupLights();const k=new Set;return M.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const pe=B.material;if(pe)if(Array.isArray(pe))for(let ve=0;ve<pe.length;ve++){const de=pe[ve];Vo(de,G,B),k.add(de)}else Vo(pe,G,B),k.add(pe)}),b=_.pop(),k},this.compileAsync=function(M,U,G=null){const k=this.compile(M,U,G);return new Promise(B=>{function pe(){if(k.forEach(function(ve){z.get(ve).currentProgram.isReady()&&k.delete(ve)}),k.size===0){B(M);return}setTimeout(pe,10)}je.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let br=null;function Oh(M){br&&br(M)}function Wo(){ni.stop()}function Xo(){ni.start()}const ni=new _h;ni.setAnimationLoop(Oh),typeof self<"u"&&ni.setContext(self),this.setAnimationLoop=function(M){br=M,Se.setAnimationLoop(M),M===null?ni.stop():ni.start()},Se.addEventListener("sessionstart",Wo),Se.addEventListener("sessionend",Xo),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){$e("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;N!==null&&N.renderStart(M,U);const G=Se.enabled===!0&&Se.isPresenting===!0,k=E!==null&&(Q===null||G)&&E.begin(C,Q);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Se.enabled===!0&&Se.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Se.cameraAutoUpdate===!0&&Se.updateCamera(U),U=Se.getCamera()),M.isScene===!0&&M.onBeforeRender(C,M,U,Q),b=oe.get(M,_.length),b.init(U),b.state.textureUnits=W.getTextureUnits(),_.push(b),Mt.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),it.setFromProjectionMatrix(Mt,vn,U.reversedDepth),qe=this.localClippingEnabled,Qe=Re.init(this.clippingPlanes,qe),A=he.get(M,R.length),A.init(),R.push(A),Se.enabled===!0&&Se.isPresenting===!0){const ve=C.xr.getDepthSensingMesh();ve!==null&&Er(ve,U,-1/0,C.sortObjects)}Er(M,U,0,C.sortObjects),A.finish(),C.sortObjects===!0&&A.sort(Ie,Fe,U.reversedDepth),mt=Se.enabled===!1||Se.isPresenting===!1||Se.hasDepthSensing()===!1,mt&&Oe.addToRenderList(A,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Qe===!0&&Re.beginShadows();const B=b.state.shadowsArray;if(Pe.render(B,M,U),Qe===!0&&Re.endShadows(),(k&&E.hasRenderPass())===!1){const ve=A.opaque,de=A.transmissive;if(b.setupLights(),U.isArrayCamera){const be=U.cameras;if(de.length>0)for(let we=0,ke=be.length;we<ke;we++){const ze=be[we];Yo(ve,de,M,ze)}mt&&Oe.render(M);for(let we=0,ke=be.length;we<ke;we++){const ze=be[we];qo(A,M,ze,ze.viewport)}}else de.length>0&&Yo(ve,de,M,U),mt&&Oe.render(M),qo(A,M,U)}Q!==null&&H===0&&(W.updateMultisampleRenderTarget(Q),W.updateRenderTargetMipmap(Q)),k&&E.end(C),M.isScene===!0&&M.onAfterRender(C,M,U),me.resetDefaultState(),ee=-1,fe=null,_.pop(),_.length>0?(b=_[_.length-1],W.setTextureUnits(b.state.textureUnits),Qe===!0&&Re.setGlobalState(C.clippingPlanes,b.state.camera)):b=null,R.pop(),R.length>0?A=R[R.length-1]:A=null,N!==null&&N.renderEnd()};function Er(M,U,G,k){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)G=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLightProbeGrid)b.pushLightProbeGrid(M);else if(M.isLight)b.pushLight(M),M.castShadow&&b.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||it.intersectsSprite(M)){k&&Rt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Mt);const ve=Z.update(M),de=M.material;de.visible&&A.push(M,ve,de,G,Rt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||it.intersectsObject(M))){const ve=Z.update(M),de=M.material;if(k&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Rt.copy(M.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Rt.copy(ve.boundingSphere.center)),Rt.applyMatrix4(M.matrixWorld).applyMatrix4(Mt)),Array.isArray(de)){const be=ve.groups;for(let we=0,ke=be.length;we<ke;we++){const ze=be[we],Ae=de[ze.materialIndex];Ae&&Ae.visible&&A.push(M,ve,Ae,G,Rt.z,ze)}}else de.visible&&A.push(M,ve,de,G,Rt.z,null)}}const pe=M.children;for(let ve=0,de=pe.length;ve<de;ve++)Er(pe[ve],U,G,k)}function qo(M,U,G,k){const{opaque:B,transmissive:pe,transparent:ve}=M;b.setupLightsView(G),Qe===!0&&Re.setGlobalState(C.clippingPlanes,G),k&&x.viewport(ge.copy(k)),B.length>0&&Rs(B,U,G),pe.length>0&&Rs(pe,U,G),ve.length>0&&Rs(ve,U,G),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Yo(M,U,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[k.id]===void 0){const Ae=je.has("EXT_color_buffer_half_float")||je.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[k.id]=new Mn(1,1,{generateMipmaps:!0,type:Ae?kn:Zt,minFilter:di,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ve.workingColorSpace})}const pe=b.state.transmissionRenderTarget[k.id],ve=k.viewport||ge;pe.setSize(ve.z*C.transmissionResolutionScale,ve.w*C.transmissionResolutionScale);const de=C.getRenderTarget(),be=C.getActiveCubeFace(),we=C.getActiveMipmapLevel();C.setRenderTarget(pe),C.getClearColor(pt),Je=C.getClearAlpha(),Je<1&&C.setClearColor(16777215,.5),C.clear(),mt&&Oe.render(G);const ke=C.toneMapping;C.toneMapping=yn;const ze=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),b.setupLightsView(k),Qe===!0&&Re.setGlobalState(C.clippingPlanes,k),Rs(M,G,k),W.updateMultisampleRenderTarget(pe),W.updateRenderTargetMipmap(pe),je.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let nt=0,vt=U.length;nt<vt;nt++){const xt=U[nt],{object:st,geometry:Dt,material:_e,group:qt}=xt;if(_e.side===In&&st.layers.test(k.layers)){const Ye=_e.side;_e.side=Xt,_e.needsUpdate=!0,$o(st,G,k,Dt,_e,qt),_e.side=Ye,_e.needsUpdate=!0,Ae=!0}}Ae===!0&&(W.updateMultisampleRenderTarget(pe),W.updateRenderTargetMipmap(pe))}C.setRenderTarget(de,be,we),C.setClearColor(pt,Je),ze!==void 0&&(k.viewport=ze),C.toneMapping=ke}function Rs(M,U,G){const k=U.isScene===!0?U.overrideMaterial:null;for(let B=0,pe=M.length;B<pe;B++){const ve=M[B],{object:de,geometry:be,group:we}=ve;let ke=ve.material;ke.allowOverride===!0&&k!==null&&(ke=k),de.layers.test(G.layers)&&$o(de,U,G,be,ke,we)}}function $o(M,U,G,k,B,pe){M.onBeforeRender(C,U,G,k,B,pe),M.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),B.onBeforeRender(C,U,G,k,M,pe),B.transparent===!0&&B.side===In&&B.forceSinglePass===!1?(B.side=Xt,B.needsUpdate=!0,C.renderBufferDirect(G,U,k,B,M,pe),B.side=ei,B.needsUpdate=!0,C.renderBufferDirect(G,U,k,B,M,pe),B.side=In):C.renderBufferDirect(G,U,k,B,M,pe),M.onAfterRender(C,U,G,k,B,pe)}function Cs(M,U,G){U.isScene!==!0&&(U=Pt);const k=z.get(M),B=b.state.lights,pe=b.state.shadowsArray,ve=B.state.version,de=ae.getParameters(M,B.state,pe,U,G,b.state.lightProbeGridArray),be=ae.getProgramCacheKey(de);let we=k.programs;k.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?U.environment:null,k.fog=U.fog;const ke=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;k.envMap=ne.get(M.envMap||k.environment,ke),k.envMapRotation=k.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,we===void 0&&(M.addEventListener("dispose",fn),we=new Map,k.programs=we);let ze=we.get(be);if(ze!==void 0){if(k.currentProgram===ze&&k.lightsStateVersion===ve)return Zo(M,de),ze}else de.uniforms=ae.getUniforms(M),N!==null&&M.isNodeMaterial&&N.build(M,G,de),M.onBeforeCompile(de,C),ze=ae.acquireProgram(de,be),we.set(be,ze),k.uniforms=de.uniforms;const Ae=k.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ae.clippingPlanes=Re.uniform),Zo(M,de),k.needsLights=Hh(M),k.lightsStateVersion=ve,k.needsLights&&(Ae.ambientLightColor.value=B.state.ambient,Ae.lightProbe.value=B.state.probe,Ae.directionalLights.value=B.state.directional,Ae.directionalLightShadows.value=B.state.directionalShadow,Ae.spotLights.value=B.state.spot,Ae.spotLightShadows.value=B.state.spotShadow,Ae.rectAreaLights.value=B.state.rectArea,Ae.ltc_1.value=B.state.rectAreaLTC1,Ae.ltc_2.value=B.state.rectAreaLTC2,Ae.pointLights.value=B.state.point,Ae.pointLightShadows.value=B.state.pointShadow,Ae.hemisphereLights.value=B.state.hemi,Ae.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Ae.spotLightMatrix.value=B.state.spotLightMatrix,Ae.spotLightMap.value=B.state.spotLightMap,Ae.pointShadowMatrix.value=B.state.pointShadowMatrix),k.lightProbeGrid=b.state.lightProbeGridArray.length>0,k.currentProgram=ze,k.uniformsList=null,ze}function Ko(M){if(M.uniformsList===null){const U=M.currentProgram.getUniforms();M.uniformsList=ar.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function Zo(M,U){const G=z.get(M);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function kh(M,U){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let G=0,k=M.length;G<k;G++){const B=M[G];if(B.texture!==null&&B.boundingBox.containsPoint(y))return B}return null}function Bh(M,U,G,k,B){U.isScene!==!0&&(U=Pt),W.resetTextureUnits();const pe=U.fog,ve=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?U.environment:null,de=Q===null?C.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Ve.workingColorSpace,be=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,we=ne.get(k.envMap||ve,be),ke=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ze=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ae=!!G.morphAttributes.position,nt=!!G.morphAttributes.normal,vt=!!G.morphAttributes.color;let xt=yn;k.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(xt=C.toneMapping);const st=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Dt=st!==void 0?st.length:0,_e=z.get(k),qt=b.state.lights;if(Qe===!0&&(qe===!0||M!==fe)){const ct=M===fe&&k.id===ee;Re.setState(k,M,ct)}let Ye=!1;k.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==qt.state.version||_e.outputColorSpace!==de||B.isBatchedMesh&&_e.batching===!1||!B.isBatchedMesh&&_e.batching===!0||B.isBatchedMesh&&_e.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&_e.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&_e.instancing===!1||!B.isInstancedMesh&&_e.instancing===!0||B.isSkinnedMesh&&_e.skinning===!1||!B.isSkinnedMesh&&_e.skinning===!0||B.isInstancedMesh&&_e.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&_e.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&_e.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&_e.instancingMorph===!1&&B.morphTexture!==null||_e.envMap!==we||k.fog===!0&&_e.fog!==pe||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Re.numPlanes||_e.numIntersection!==Re.numIntersection)||_e.vertexAlphas!==ke||_e.vertexTangents!==ze||_e.morphTargets!==Ae||_e.morphNormals!==nt||_e.morphColors!==vt||_e.toneMapping!==xt||_e.morphTargetsCount!==Dt||!!_e.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Ye=!0):(Ye=!0,_e.__version=k.version);let Jt=_e.currentProgram;Ye===!0&&(Jt=Cs(k,U,B),N&&k.isNodeMaterial&&N.onUpdateProgram(k,Jt,_e));let dn=!1,Hn=!1,Mi=!1;const rt=Jt.getUniforms(),yt=_e.uniforms;if(x.useProgram(Jt.program)&&(dn=!0,Hn=!0,Mi=!0),k.id!==ee&&(ee=k.id,Hn=!0),_e.needsLights){const ct=kh(b.state.lightProbeGridArray,B);_e.lightProbeGrid!==ct&&(_e.lightProbeGrid=ct,Hn=!0)}if(dn||fe!==M){x.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),rt.setValue(D,"projectionMatrix",M.projectionMatrix),rt.setValue(D,"viewMatrix",M.matrixWorldInverse);const Vn=rt.map.cameraPosition;Vn!==void 0&&Vn.setValue(D,Tt.setFromMatrixPosition(M.matrixWorld)),w.logarithmicDepthBuffer&&rt.setValue(D,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&rt.setValue(D,"isOrthographic",M.isOrthographicCamera===!0),fe!==M&&(fe=M,Hn=!0,Mi=!0)}if(_e.needsLights&&(qt.state.directionalShadowMap.length>0&&rt.setValue(D,"directionalShadowMap",qt.state.directionalShadowMap,W),qt.state.spotShadowMap.length>0&&rt.setValue(D,"spotShadowMap",qt.state.spotShadowMap,W),qt.state.pointShadowMap.length>0&&rt.setValue(D,"pointShadowMap",qt.state.pointShadowMap,W)),B.isSkinnedMesh){rt.setOptional(D,B,"bindMatrix"),rt.setOptional(D,B,"bindMatrixInverse");const ct=B.skeleton;ct&&(ct.boneTexture===null&&ct.computeBoneTexture(),rt.setValue(D,"boneTexture",ct.boneTexture,W))}B.isBatchedMesh&&(rt.setOptional(D,B,"batchingTexture"),rt.setValue(D,"batchingTexture",B._matricesTexture,W),rt.setOptional(D,B,"batchingIdTexture"),rt.setValue(D,"batchingIdTexture",B._indirectTexture,W),rt.setOptional(D,B,"batchingColorTexture"),B._colorsTexture!==null&&rt.setValue(D,"batchingColorTexture",B._colorsTexture,W));const Gn=G.morphAttributes;if((Gn.position!==void 0||Gn.normal!==void 0||Gn.color!==void 0)&&L.update(B,G,Jt),(Hn||_e.receiveShadow!==B.receiveShadow)&&(_e.receiveShadow=B.receiveShadow,rt.setValue(D,"receiveShadow",B.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&U.environment!==null&&(yt.envMapIntensity.value=U.environmentIntensity),yt.dfgLUT!==void 0&&(yt.dfgLUT.value=hx()),Hn){if(rt.setValue(D,"toneMappingExposure",C.toneMappingExposure),_e.needsLights&&zh(yt,Mi),pe&&k.fog===!0&&Te.refreshFogUniforms(yt,pe),Te.refreshMaterialUniforms(yt,k,te,se,b.state.transmissionRenderTarget[M.id]),_e.needsLights&&_e.lightProbeGrid){const ct=_e.lightProbeGrid;yt.probesSH.value=ct.texture,yt.probesMin.value.copy(ct.boundingBox.min),yt.probesMax.value.copy(ct.boundingBox.max),yt.probesResolution.value.copy(ct.resolution)}ar.upload(D,Ko(_e),yt,W)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(ar.upload(D,Ko(_e),yt,W),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&rt.setValue(D,"center",B.center),rt.setValue(D,"modelViewMatrix",B.modelViewMatrix),rt.setValue(D,"normalMatrix",B.normalMatrix),rt.setValue(D,"modelMatrix",B.matrixWorld),k.uniformsGroups!==void 0){const ct=k.uniformsGroups;for(let Vn=0,Si=ct.length;Vn<Si;Vn++){const Jo=ct[Vn];j.update(Jo,Jt),j.bind(Jo,Jt)}}return Jt}function zh(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function Hh(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Y},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(M,U,G){const k=z.get(M);k.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),z.get(M.texture).__webglTexture=U,z.get(M.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:G,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){const G=z.get(M);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(M,U=0,G=0){Q=M,Y=U,H=G;let k=null,B=!1,pe=!1;if(M){const de=z.get(M);if(de.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(D.FRAMEBUFFER,de.__webglFramebuffer),ge.copy(M.viewport),ye.copy(M.scissor),Ze=M.scissorTest,x.viewport(ge),x.scissor(ye),x.setScissorTest(Ze),ee=-1;return}else if(de.__webglFramebuffer===void 0)W.setupRenderTarget(M);else if(de.__hasExternalTextures)W.rebindTextures(M,z.get(M.texture).__webglTexture,z.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const ke=M.depthTexture;if(de.__boundDepthTexture!==ke){if(ke!==null&&z.has(ke)&&(M.width!==ke.image.width||M.height!==ke.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(M)}}const be=M.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(pe=!0);const we=z.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(we[U])?k=we[U][G]:k=we[U],B=!0):M.samples>0&&W.useMultisampledRTT(M)===!1?k=z.get(M).__webglMultisampledFramebuffer:Array.isArray(we)?k=we[G]:k=we,ge.copy(M.viewport),ye.copy(M.scissor),Ze=M.scissorTest}else ge.copy(Ce).multiplyScalar(te).floor(),ye.copy(_t).multiplyScalar(te).floor(),Ze=Ge;if(G!==0&&(k=V),x.bindFramebuffer(D.FRAMEBUFFER,k)&&x.drawBuffers(M,k),x.viewport(ge),x.scissor(ye),x.setScissorTest(Ze),B){const de=z.get(M.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,de.__webglTexture,G)}else if(pe){const de=U;for(let be=0;be<M.textures.length;be++){const we=z.get(M.textures[be]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+be,we.__webglTexture,G,de)}}else if(M!==null&&G!==0){const de=z.get(M.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,de.__webglTexture,G)}ee=-1},this.readRenderTargetPixels=function(M,U,G,k,B,pe,ve,de=0){if(!(M&&M.isWebGLRenderTarget)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=z.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){x.bindFramebuffer(D.FRAMEBUFFER,be);try{const we=M.textures[de],ke=we.format,ze=we.type;if(M.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+de),!w.textureFormatReadable(ke)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!w.textureTypeReadable(ze)){$e("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-k&&G>=0&&G<=M.height-B&&D.readPixels(U,G,k,B,le.convert(ke),le.convert(ze),pe)}finally{const we=Q!==null?z.get(Q).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(M,U,G,k,B,pe,ve,de=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=z.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be)if(U>=0&&U<=M.width-k&&G>=0&&G<=M.height-B){x.bindFramebuffer(D.FRAMEBUFFER,be);const we=M.textures[de],ke=we.format,ze=we.type;if(M.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+de),!w.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!w.textureTypeReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ae=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ae),D.bufferData(D.PIXEL_PACK_BUFFER,pe.byteLength,D.STREAM_READ),D.readPixels(U,G,k,B,le.convert(ke),le.convert(ze),0);const nt=Q!==null?z.get(Q).__webglFramebuffer:null;x.bindFramebuffer(D.FRAMEBUFFER,nt);const vt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Ju(D,vt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ae),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,pe),D.deleteBuffer(Ae),D.deleteSync(vt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,G=0){const k=Math.pow(2,-G),B=Math.floor(M.image.width*k),pe=Math.floor(M.image.height*k),ve=U!==null?U.x:0,de=U!==null?U.y:0;W.setTexture2D(M,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,ve,de,B,pe),x.unbindTexture()},this.copyTextureToTexture=function(M,U,G=null,k=null,B=0,pe=0){let ve,de,be,we,ke,ze,Ae,nt,vt;const xt=M.isCompressedTexture?M.mipmaps[pe]:M.image;if(G!==null)ve=G.max.x-G.min.x,de=G.max.y-G.min.y,be=G.isBox3?G.max.z-G.min.z:1,we=G.min.x,ke=G.min.y,ze=G.isBox3?G.min.z:0;else{const yt=Math.pow(2,-B);ve=Math.floor(xt.width*yt),de=Math.floor(xt.height*yt),M.isDataArrayTexture?be=xt.depth:M.isData3DTexture?be=Math.floor(xt.depth*yt):be=1,we=0,ke=0,ze=0}k!==null?(Ae=k.x,nt=k.y,vt=k.z):(Ae=0,nt=0,vt=0);const st=le.convert(U.format),Dt=le.convert(U.type);let _e;U.isData3DTexture?(W.setTexture3D(U,0),_e=D.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(W.setTexture2DArray(U,0),_e=D.TEXTURE_2D_ARRAY):(W.setTexture2D(U,0),_e=D.TEXTURE_2D),x.activeTexture(D.TEXTURE0),x.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),x.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),x.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const qt=x.getParameter(D.UNPACK_ROW_LENGTH),Ye=x.getParameter(D.UNPACK_IMAGE_HEIGHT),Jt=x.getParameter(D.UNPACK_SKIP_PIXELS),dn=x.getParameter(D.UNPACK_SKIP_ROWS),Hn=x.getParameter(D.UNPACK_SKIP_IMAGES);x.pixelStorei(D.UNPACK_ROW_LENGTH,xt.width),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xt.height),x.pixelStorei(D.UNPACK_SKIP_PIXELS,we),x.pixelStorei(D.UNPACK_SKIP_ROWS,ke),x.pixelStorei(D.UNPACK_SKIP_IMAGES,ze);const Mi=M.isDataArrayTexture||M.isData3DTexture,rt=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){const yt=z.get(M),Gn=z.get(U),ct=z.get(yt.__renderTarget),Vn=z.get(Gn.__renderTarget);x.bindFramebuffer(D.READ_FRAMEBUFFER,ct.__webglFramebuffer),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,Vn.__webglFramebuffer);for(let Si=0;Si<be;Si++)Mi&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,z.get(M).__webglTexture,B,ze+Si),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,z.get(U).__webglTexture,pe,vt+Si)),D.blitFramebuffer(we,ke,ve,de,Ae,nt,ve,de,D.DEPTH_BUFFER_BIT,D.NEAREST);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(B!==0||M.isRenderTargetTexture||z.has(M)){const yt=z.get(M),Gn=z.get(U);x.bindFramebuffer(D.READ_FRAMEBUFFER,$),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,O);for(let ct=0;ct<be;ct++)Mi?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,yt.__webglTexture,B,ze+ct):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,yt.__webglTexture,B),rt?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Gn.__webglTexture,pe,vt+ct):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Gn.__webglTexture,pe),B!==0?D.blitFramebuffer(we,ke,ve,de,Ae,nt,ve,de,D.COLOR_BUFFER_BIT,D.NEAREST):rt?D.copyTexSubImage3D(_e,pe,Ae,nt,vt+ct,we,ke,ve,de):D.copyTexSubImage2D(_e,pe,Ae,nt,we,ke,ve,de);x.bindFramebuffer(D.READ_FRAMEBUFFER,null),x.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else rt?M.isDataTexture||M.isData3DTexture?D.texSubImage3D(_e,pe,Ae,nt,vt,ve,de,be,st,Dt,xt.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(_e,pe,Ae,nt,vt,ve,de,be,st,xt.data):D.texSubImage3D(_e,pe,Ae,nt,vt,ve,de,be,st,Dt,xt):M.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,pe,Ae,nt,ve,de,st,Dt,xt.data):M.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,pe,Ae,nt,xt.width,xt.height,st,xt.data):D.texSubImage2D(D.TEXTURE_2D,pe,Ae,nt,ve,de,st,Dt,xt);x.pixelStorei(D.UNPACK_ROW_LENGTH,qt),x.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ye),x.pixelStorei(D.UNPACK_SKIP_PIXELS,Jt),x.pixelStorei(D.UNPACK_SKIP_ROWS,dn),x.pixelStorei(D.UNPACK_SKIP_IMAGES,Hn),pe===0&&U.generateMipmaps&&D.generateMipmap(_e),x.unbindTexture()},this.initRenderTarget=function(M){z.get(M).__webglFramebuffer===void 0&&W.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?W.setTextureCube(M,0):M.isData3DTexture?W.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?W.setTexture2DArray(M,0):W.setTexture2D(M,0),x.unbindTexture()},this.resetState=function(){Y=0,H=0,Q=null,x.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ve._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ve._getUnpackColorSpace()}}function fx(i,e=!1){const t=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new kt;let c=0;for(let h=0;h<i.length;++h){const f=i[h];let u=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(e){let d;if(t)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0;const f=[];for(let u=0;u<i.length;++u){const d=i[u].index;for(let g=0;g<d.count;++g)f.push(d.getX(g)+h);h+=i[u].attributes.position.count}l.setIndex(f)}for(const h in r){const f=pc(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){const d=[];for(let v=0;v<a[h].length;++v)d.push(a[h][v][u]);const g=pc(d);if(!g)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(g)}}}return l}function pc(i){let e,t,n,s=-1,r=0;for(let c=0;c<i.length;++c){const h=i[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=h.gpuType),s!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new hn(a,t,n);let l=0;for(let c=0;c<i.length;++c){const h=i[c];if(h.isInterleavedBufferAttribute){const f=l/t;for(let u=0,d=h.count;u<d;u++)for(let g=0;g<t;g++){const v=h.getComponent(u,g);o.setComponent(u+f,g,v)}}else a.set(h.array,l);l+=h.count*t}return s!==void 0&&(o.gpuType=s),o}function Bt(i,e=.75,t=0){return new mh({color:i,roughness:e,metalness:t,flatShading:!1})}function dx(){return{skin:Bt(13014134,.82),shadow:Bt(10317141,.88),hair:Bt(2108488,.68),uniform:Bt(2182520,.76),uniformLight:Bt(3235723,.68),uniformDeep:Bt(1322832,.84),pants:Bt(1581622,.84),accent:Bt(14728524,.58),belt:Bt(1514280,.9),boot:Bt(1120034,.9),glove:Bt(1119773,.88),glovePad:Bt(2436405,.78),eyeWhite:Bt(16250093,.62),eyeBlue:Bt(3906516,.5),eyeDark:Bt(1054765,.7)}}function Ue(i,e,t,n,s){e.position.set(t,n,s),i.add(e)}function en(i,e,t=32){return new De(new _r(e.map(([n,s])=>new ce(n,s)),t),i)}function px(i){const e=en(i,[[.055,-.08],[.11,-.075],[.14,-.02],[.145,.07],[.12,.12],[.04,.14]],32);return e.scale.set(1,.62,1.45),e}function mx(i,e,t){const n=new De(new Wt(1,24,16),e.skin);n.scale.set(.135,.155,.105),Ue(i,n,0,-.52,.015);const s=new De(new Ot(.105,.045,6,18),e.glove);s.scale.z=.82,Ue(i,s,0,-.39,.02);const r=new De(new Ot(.102,.035,5,16),e.glovePad);r.scale.set(1,1,.78),Ue(i,r,0,-.405,.085);const a=new De(new Wt(1,24,16),e.glove);a.scale.set(.12,.112,.095),Ue(i,a,0,-.495,.085);const o=new De(new Wt(1,20,14),e.glovePad);o.scale.set(.078,.045,.018),Ue(i,o,0,-.46,.178);const l=[[-.09,.125,.037],[-.03,.145,.04],[.03,.14,.04],[.09,.115,.037]];for(const[h,f,u]of l){const d=new De(new Ot(u,f,6,14),e.skin);Ue(i,d,h,-.635-(.14-f)*.18,.025)}const c=new De(new Ot(.041,.115,6,14),e.skin);c.rotation.z=-t*.72,Ue(i,c,t*.145,-.575,.035)}function gx(){const i=new Wt(1,32,18);return i.scale(.36,.13,.12),i.translate(0,.29,.39),i.computeVertexNormals(),i.toNonIndexed()}function mc(i){const e=new Ot(.105,.46,7,18);return e.applyMatrix4(new at().makeRotationZ(i*.045)),e.applyMatrix4(new at().makeTranslation(i*.35,-.03,.36)),e.computeVertexNormals(),e.toNonIndexed()}function xx(){const i=new _r([new ce(.22,-.43),new ce(.31,-.39),new ce(.39,-.28),new ce(.43,-.1),new ce(.44,.13),new ce(.41,.31),new ce(.34,.42),new ce(.22,.47),new ce(0,.48)],40);i.applyMatrix4(new at().makeScale(1.05,1,.84)),i.applyMatrix4(new at().makeTranslation(0,0,-.075)),i.computeVertexNormals();const e=fx([i.toNonIndexed(),gx(),mc(-1),mc(1)],!1);if(!e)throw new Error("Mara hair geometry merge failed");return e.computeVertexNormals(),e}function gc(i,e,t){const n=new De(new Wt(1,24,16),e.shadow);n.scale.set(.132,.118,.045),Ue(i,n,t,.022,.335);const s=new De(new Wt(1,28,18),e.eyeWhite);s.scale.set(.101,.112,.046),Ue(i,s,t,.018,.367);const r=new De(new Wt(1,24,16),e.eyeBlue);r.scale.set(.068,.079,.038),Ue(i,r,t,.012,.414);const a=new De(new Wt(1,20,14),e.eyeDark);a.scale.set(.035,.052,.031),Ue(i,a,t,.008,.451);const o=new De(new Wt(1,14,10),e.eyeWhite);o.scale.set(.017,.02,.014),Ue(i,o,t-.022,.044,.481);const l=new De(new Ot(.012,.13,4,12),e.eyeDark);l.rotation.z=Math.PI/2,Ue(i,l,t,.087,.443);const c=new De(new Ot(.013,.105,4,12),e.hair);c.rotation.z=Math.PI/2+(t<0?-.18:.18),Ue(i,c,t,.151,.397)}function _x(i,e){gc(i,e,-.125),gc(i,e,.125);const t=en(e.shadow,[[.018,-.025],[.028,0],[.016,.028],[0,.04]],16);t.scale.set(1,1,.5),Ue(i,t,0,-.055,.356);const n=new De(new Fo(.065,.009,6,18,Math.PI),e.shadow);n.rotation.set(Math.PI/2,0,Math.PI),Ue(i,n,0,-.15,.346)}function vx(i,e){const t=new De(new gi(.102,.102,.018,28),e.belt);t.rotation.x=Math.PI/2,Ue(i,t,.13,.39,.292);const n=new De(new gi(.086,.086,.022,28),e.accent);n.rotation.x=Math.PI/2,Ue(i,n,.13,.39,.309);const s=new De(new gi(.038,.038,.026,5),e.belt);s.rotation.set(Math.PI/2,0,Math.PI/4),Ue(i,s,.13,.39,.325)}function Hi(i,e,t,n,s,r=.13){const a=new De(new Ot(.018,r,6,12),e);a.scale.z=.62,a.rotation.z=s,Ue(i,a,t,n,.292)}function yx(i,e){const t=new ch;return t.moveTo(0,.06),t.lineTo(e*.135,.085),t.lineTo(e*.045,-.055),t.lineTo(0,-.015),t.closePath(),new De(new No(t),i)}function xc(i){return en(i,[[.045,-.065],[.068,-.052],[.078,-.025],[.078,.038],[.062,.064],[.038,.068]],20)}function Mx(i,e){const t=new De(new Ot(.052,.068,5,12),e.belt);t.scale.z=.16,Ue(i,t,0,-.105,.108);const n=new De(new zn(.052,.012,.012),e.accent);Ue(i,n,0,-.105,.124)}function Sx(i){let e=0;return i.traverse(t=>{if(!t.isMesh)return;const n=t.geometry;e+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}),Math.round(e)}function bx(){const i=dx(),e=new We,t=new We,n=new We,s=new We,r=new We,a=new We,o=new We,l=new We,c=new We;e.add(t),t.position.y=.64;for(const[p,m]of[[o,-.14],[l,.14]])p.position.x=m,Ue(p,en(i.pants,[[.075,-.51],[.105,-.46],[.115,-.22],[.13,-.04],[.09,.02]],32),0,0,0),Ue(p,px(i.boot),0,-.57,.075),t.add(p);Ue(t,en(i.pants,[[.2,-.1],[.275,-.04],[.28,.04],[.235,.12]],36),0,-.01,0),t.add(n),n.position.y=.03,Ue(n,en(i.uniform,[[.18,.02],[.265,.1],[.3,.28],[.285,.48],[.23,.61],[.12,.65]],40),0,.04,0);for(const p of[-1,1]){const m=new De(new Wt(1,20,14),i.uniformLight);m.scale.set(.13,.105,.13),Ue(n,m,p*.255,.48,.015);const S=new De(new Ot(.022,.13,6,12),i.uniformDeep);S.scale.z=.55,S.rotation.z=-p*.36,Ue(n,S,p*.225,.37,.286)}Hi(n,i.uniformDeep,-.205,.42,-.52,.14),Hi(n,i.uniformLight,-.19,.39,-.52,.1),Hi(n,i.uniformDeep,.205,.42,.52,.14),Hi(n,i.uniformLight,.19,.39,.52,.1),Hi(n,i.uniformDeep,-.14,.19,.2,.13),Hi(n,i.uniformDeep,.14,.19,-.2,.13),Ue(n,en(i.belt,[[.255,0],[.285,.035],[.278,.085],[.25,.11]],36),0,0,0);const h=new De(new zn(.12,.1,.035,3,3,2),i.accent);Ue(n,h,0,.065,.285);for(const p of[-1,1]){const m=xc(i.belt);Ue(n,m,p*.205,.068,.292);const S=new De(new Ot(.045,.055,5,12),i.glovePad);S.scale.set(1.15,.34,.16),Ue(n,S,p*.205,.105,.365);const T=new De(new Wt(.012,12,8),i.accent);Ue(n,T,p*.205,.105,.383)}const f=xc(i.belt);f.scale.set(.72,1.12,.82),Ue(n,f,.3,.105,.12);const u=new De(new zn(.065,.018,.018),i.accent);Ue(n,u,.3,.168,.18),vx(n,i);for(const p of[-1,1]){const m=yx(i.uniformLight,p);Ue(n,m,0,.575,.301)}const d=new De(new Ot(.047,.035,5,12),i.belt);d.scale.z=.34,Ue(n,d,0,.515,.318);const g=new De(new Ot(.038,.205,5,12),i.belt);g.scale.z=.3,Ue(n,g,0,.395,.315);for(const[p,m]of[[r,-.375],[a,.375]])p.position.set(m,.43,0),Ue(p,en(i.uniform,[[.075,-.18],[.105,-.12],[.11,.03],[.085,.12]],32),0,-.1,0),Mx(p,i),Ue(p,en(i.skin,[[.055,-.43],[.082,-.36],[.085,-.23],[.068,-.16]],32),0,-.1,0),mx(p,i,m<0?-1:1),n.add(p);a.add(c),c.position.set(0,-.43,.13),Ue(c,en(i.belt,[[.035,-.32],[.05,-.25],[.052,.24],[.035,.32]],20),0,-.17,0),Ue(c,en(i.accent,[[.055,-.06],[.065,0],[.055,.06]],20),0,.13,0),n.add(s),s.position.y=.76,Ue(s,en(i.skin,[[.16,-.3],[.29,-.24],[.35,-.1],[.37,.08],[.36,.25],[.29,.36],[.16,.4]],40),0,0,0),Ue(s,new De(xx(),i.hair),0,0,0),_x(s,i);const v=new We;return v.add(e),e.position.y=.08,{root:v,hip:t,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:Sx(v)}}const da=2.15,or=420,lr=520;function wh(i,e){const t=e==="f";switch(i){case"mara":return{skin:13014134,shadow:10317141,hair:2108488,shirt:2182520,pants:1581622,accent:14728524,metal:12568788,shoe:1514280};case"dana":return{skin:11697242,shadow:9393983,hair:5978408,shirt:2970216,pants:2108218,accent:14268750,metal:12628893,shoe:1645349};case"priya":return{skin:9854784,shadow:7356719,hair:1905424,shirt:15328728,pants:2643038,accent:13192016,metal:14212322,shoe:2105386};case"hale":return{skin:13806212,shadow:10976349,hair:7628371,shirt:4278102,pants:2698552,accent:16762967,metal:12037788,shoe:1579554};case"crosby":return{skin:12358768,shadow:9396557,hair:3155231,shirt:6565176,pants:3283750,accent:15777874,metal:13741397,shoe:1512221};case"beckett":return{skin:11568226,shadow:8868157,hair:4072735,shirt:10105916,pants:3152932,accent:16747590,metal:13154454,shoe:1512731};case"delinquent":return{skin:t?13014648:11832428,shadow:9133388,hair:t?5582445:2103848,shirt:5203020,pants:2698806,accent:12668775,metal:11053750,shoe:1514016};case"magician":return{skin:t?13478026:12226158,shadow:9791055,hair:t?7614880:2626870,shirt:7354535,pants:2497094,accent:15056213,metal:14731384,shoe:1511718};case"wolverine":return{skin:7887430,shadow:5783599,hair:4928808,shirt:7755838,pants:5257772,accent:14711356,metal:13156526,shoe:2103572};case"boxer":return{skin:11171928,shadow:8212541,hair:1774872,shirt:15263980,pants:2434610,accent:14237772,metal:12369608,shoe:1513504};case"gunner":return{skin:t?13147776:11700328,shadow:9134926,hair:t?3548702:2170146,shirt:3229240,pants:2634542,accent:6667384,metal:8689035,shoe:1448986};case"worker":return{skin:12490358,shadow:9200463,hair:3156002,shirt:15772214,pants:3490909,accent:3698345,metal:11449533,shoe:1777705};default:return{skin:13148802,shadow:9859418,hair:2696750,shirt:15789286,pants:2370624,accent:5404848,metal:12235163,shoe:1513763}}}function gn(i,e=.75,t=0){return new mh({color:i,roughness:e,metalness:t,flatShading:!1})}function Ah(i){return{skin:gn(i.skin,.82),shadow:gn(i.shadow,.88),hair:gn(i.hair,.7),shirt:gn(i.shirt),pants:gn(i.pants,.84),accent:gn(i.accent,.58),metal:gn(i.metal,.28,.45),shoe:gn(i.shoe,.9),white:gn(16250093,.62),dark:gn(1446683,.82)}}function Ex(i){return i==="attack"?or:i==="cast"?lr:0}function Tx(i,e){const t=Ex(i.anim);if(t>0){const s=((typeof performance<"u"?performance.now():e)-i.animStart)/t;if(s<1)return{clip:i.anim,t:Math.max(0,s)}}return i.anim==="walk"?{clip:"walk",t:e/280%1}:{clip:"idle",t:e/900%1}}function wx(i,e,t){const n=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}][t];return{x:-n.y*i+n.x*e,y:n.x*i+n.y*e}}function _c(i,e,t){return wx(i,e,t)}function mo(i){return 58*i}function Me(i,e,t,n,s){e.position.set(t,n,s),i.add(e)}function ht(i,e,t,n=12,s=4){return new De(new Ot(e,t,s,n),i)}function dt(i,e,t=16,n=12){return new De(new Wt(e,t,n),i)}function ln(i,e,t,n){return new De(new zn(e,t,n,2,2,2),i)}function Oo(i,e,t){return new De(new Io(e,t,20,5),i)}function mr(i,e,t,n,s){Me(i,dt(e.white,.075,10,8),t,n,s),Me(i,dt(e.dark,.043,8,6),t,n,s+.06)}function Ax(i,e,t,n,s){if(mr(i,e,-s*.32,.03,s*.89),mr(i,e,s*.32,.03,s*.89),Me(i,dt(e.shadow,.035,8,6),0,-.075,s*.94),Me(i,ln(e.dark,n==="f"?.13:.16,.025,.02),0,-.16,s*.91),n==="f"&&(Me(i,dt(e.accent,.035,8,6),-s*.56,-.11,s*.85),Me(i,dt(e.accent,.035,8,6),s*.56,-.11,s*.85)),t==="hale"){const r=dt(e.hair,s*.48,12,8);r.scale.set(1,.55,.62),Me(i,r,0,-s*.35,s*.63)}}function Rx(i,e,t,n){const s=dt(e.hair,n*1.07,28,20);if(s.scale.set(1.08,1.02,.91),Me(i,s,0,n*.18,-n*.11),t==="f"){for(const a of[-1,1]){const o=ht(e.hair,n*.105,n*.58,14,5);o.rotation.z=a*.08,Me(i,o,a*n*.82,-n*.13,n*.27)}const r=ht(e.hair,n*.13,n*.62,14,5);r.rotation.z=Math.PI/2,Me(i,r,0,n*.41,n*.66)}}function Cx(i,e,t){const n=dt(e.hair,t*1.08,32,24);n.scale.set(1.22,1.42,1),Me(i,n,0,-t*.1,-t*.1);const s=ht(e.hair,t*.16,t*1.18,20,6);s.rotation.z=Math.PI/2,Me(i,s,0,t*.27,t*.78);for(const r of[-1,1]){const a=ht(e.hair,t*.14,t*.78,18,6);a.rotation.z=r*.06,Me(i,a,r*t*.91,-t*.25,t*.27)}}function Px(i,e,t){const n=dt(e.hair,t*1.08,32,24);n.scale.set(1.1,1.12,.92),Me(i,n,0,t*.25,-t*.1);const s=ht(e.hair,t*.34,t*.38,20,6);s.rotation.x=-.18,Me(i,s,0,t*.66,-t*.52);const r=ht(e.hair,t*.5,t*1.58,24,8);r.rotation.x=-.1,Me(i,r,0,-t*.16,-t*1.02);const a=dt(e.hair,t*.58,32,24);a.scale.set(1.1,1.12,.94),Me(i,a,0,-t*.9,-t*1.06);for(const[o,l,c,h]of[[-.78,.52,.43,-.16],[-.52,.55,.3,-.08],[-.26,.56,.46,-.03],[0,.55,.33,0],[.27,.56,.49,.04],[.53,.54,.34,.09],[.79,.5,.44,.16]])ds(i,e.hair,t*.17,t*c,o*t,l*t,t*.68,h,-1,.24);for(const o of[-1,1]){const l=ht(e.hair,t*.12,t*.86,18,6);l.rotation.z=o*.08,Me(i,l,o*t*.86,-t*.2,t*.28)}}function Lx(i,e,t){const n=dt(e.hair,t*1.05,28,20);n.scale.set(1.07,1,.89),Me(i,n,0,t*.2,-t*.13);const s=dt(e.hair,t*.96,28,20);s.scale.set(1.1,1.02,.94),Me(i,s,t*.3,t*.72,-t*.96);const r=dt(e.hair,t*.48,24,18);r.scale.set(1.15,.88,1),Me(i,r,t*.28,t*.42,-t*.78);const a=ht(e.hair,t*.26,t*.4,16,6);Me(i,a,0,t*.1,-t*.54);for(const l of[-1,1]){const c=ht(e.hair,t*.115,t*.76,14,5);c.rotation.z=l*.82,Me(i,c,l*t*.27,t*.43,t*.54);const h=ht(e.hair,t*.105,t*.72,14,5);h.rotation.z=l*.05,Me(i,h,l*t*.82,-t*.17,t*.28)}const o=ht(e.hair,t*.075,t*.42,12,4);o.rotation.z=Math.PI/2,Me(i,o,0,t*.48,t*.58)}function ds(i,e,t,n,s,r,a,o,l,c){const h=new I(o,l,c).normalize(),f=Oo(e,t,n);f.quaternion.setFromUnitVectors(new I(0,1,0),h),Me(i,f,s+h.x*n*.25,r+h.y*n*.25,a+h.z*n*.25)}function Ix(i,e,t){const n=dt(e.hair,t*1.08,28,20);n.scale.set(1.12,1.04,.92),Me(i,n,0,t*.18,-t*.12);const s=dt(e.hair,t*.62,24,18);s.scale.set(1.3,.82,1.02),Me(i,s,0,t*.04,-t*.73);const r=[[0,.72,.16,.15,.42,1,.04],[-.4,.63,.3,.14,.56,.86,.2],[.42,.64,.3,.14,.56,.86,.2],[-.82,.4,.02,.13,.9,.16,.02],[.82,.4,.02,.13,.9,.16,.02],[-.62,.1,-1.22,.12,.25,.15,-1],[0,.1,-1.28,.14,0,.12,-1],[.62,.1,-1.22,.12,-.25,.15,-1],[-.4,-.12,-1.2,.11,.2,-.12,-.96],[.4,-.12,-1.2,.11,-.2,-.12,-.96],[-.64,.48,.52,.13,-.2,.75,.56],[.64,.48,.52,.13,-.2,.75,.56]];for(const[a,o,l,c,h,f,u]of r)ds(i,e.hair,t*c,t*.7,a*t,o*t,l*t,h,f,u);for(const[a,o,l,c]of[[-.9,.35,-.75,.55],[-.58,.7,-.5,.9],[-.2,.86,-.18,1],[.2,.86,.18,1],[.58,.7,.5,.9],[.9,.35,.75,.55],[-.82,-.1,-.7,-.45],[.82,-.1,.7,-.45]])ds(i,e.hair,t*.21,t*.92,a*t,o*t,-t*1.34,l,c,-.58);for(const[a,o,l,c]of[[-.72,.28,-.65,.55],[-.38,.48,-.35,.82],[0,.56,0,.95],[.38,.48,.35,.82],[.72,.28,.65,.55],[-.72,-.18,-.45,-.35],[.72,-.18,.45,-.35]])ds(i,e.hair,t*.15,t*.62,a*t,o*t,-t*1.18,l,c,-.68);for(const a of[-.55,-.18,.18,.55])ds(i,e.hair,t*.11,t*.34,a*t,t*.48,t*.66,a*.22,-.7,.68)}function Dx(i,e,t,n,s){if(t==="mara"?Cx(i,e,s):t==="dana"?Px(i,e,s):t==="priya"?Lx(i,e,s):t==="delinquent"?Ix(i,e,s):Rx(i,e,n,s),t==="crosby"){const r=dt(e.shirt,s*1.22,24,18);r.scale.set(1.04,.92,1.04),Me(i,r,0,0,-s*.12)}if(t==="magician"&&(Me(i,new De(new gi(s*1.25,s*1.25,.08,24),e.accent),0,s*.86,0),Me(i,Oo(e.shirt,s*.65,s),0,s*1.22,0)),t==="worker"){const r=dt(e.accent,s*1.16,24,18);r.scale.set(1.05,.42,1.05),Me(i,r,0,s*.77,0),Me(i,ln(e.accent,s*1.35,.06,s*.55),0,s*.67,s*.42)}}function Ux(i,e,t){if(e==="mara"||e==="delinquent")Me(t,ht(i.metal,.055,.58,10,3),0,-.18,.12);else if(e==="gunner"||e==="crosby"||e==="beckett"){const n=ht(i.metal,.07,.38,10,3);n.rotation.x=Math.PI/2,Me(t,n,0,.02,.2),Me(t,ln(i.shoe,.12,.12,.34),0,-.03,-.08)}else e==="magician"?(Me(t,ht(i.metal,.045,.72,10,3),0,-.16,.08),Me(t,dt(i.accent,.11,14,10),0,.26,.08)):e==="official"?Me(t,ln(i.white,.25,.32,.04),.04,0,.15):e==="priya"?(Me(t,ln(i.white,.28,.18,.16),0,0,.1),Me(t,ln(i.accent,.05,.2,.17),0,0,.19)):e==="hale"?Me(t,ln(i.accent,.12,.12,.28),0,0,.16):e==="dana"&&Me(t,ht(i.metal,.045,.48,10,3),0,-.1,.12)}function Rh(i){let e=0;return i.traverse(t=>{if(t.isMesh){const n=t.geometry;e+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}}),Math.round(e)}function Nx(i,e){const t=Ah(wh(i,e)),n=new We,s=new We,r=new We,a=new We,o=new We,l=new We,c=new We,h=new We,f=new We,u=e==="f";n.add(s),s.position.y=.64;for(const[p,m]of[[c,-.16],[h,.16]]){p.position.x=m,Me(p,ht(t.pants,.115,u?.31:.34),0,-.16,0),Me(p,ht(t.pants,.1,.22),0,-.41,0);const S=ht(t.shoe,.12,.16);S.scale.set(1,.55,1.45),Me(p,S,0,-.59,.08),s.add(p)}Me(s,ht(t.pants,.27,.12,14,4),0,-.02,0),s.add(r),r.position.y=.03;const d=ht(t.shirt,u?.285:.31,.34,14,5);d.scale.z=u?.76:.82,Me(r,d,0,.26,0),(i==="priya"||i==="official")&&Me(r,ln(t.accent,.06,.26,.035),0,.28,.255),i==="worker"&&Me(r,ln(t.accent,.38,.27,.05),0,.25,.25),i==="boxer"&&(Me(r,ln(t.accent,.25,.16,.04),-.22,.19,.24),Me(r,ln(t.accent,.25,.16,.04),.22,.19,.24));for(const[p,m]of[[o,-.39],[l,.39]])p.position.set(m,.43,0),Me(p,ht(t.shirt,.105,.2),0,-.11,0),Me(p,ht(t.skin,.09,.19),0,-.32,0),Me(p,dt(t.skin,.1,12,8),0,-.46,0),i==="boxer"&&Me(p,dt(t.accent,.14,14,10),0,-.49,.02),r.add(p);l.add(f),f.position.set(0,-.44,.13),Ux(t,i,f),r.add(a),a.position.y=.76;const g=u?.36:.34;Me(a,dt(t.skin,g,20,14),0,0,0),Ax(a,t,i,e,g),Dx(a,t,i,e,g);const v=new We;return v.add(n),n.position.y=.08,{root:v,hip:s,torso:r,head:a,armL:o,armR:l,legL:c,legR:h,weap:f,tris:Rh(v)}}function Fx(){const i=Ah(wh("wolverine","m")),e=new We,t=new We,n=new We,s=new We,r=new We,a=new We,o=new We,l=new We,c=new We;e.add(t),t.position.y=.44;const h=ht(i.shirt,.38,.52,16,5);h.rotation.z=Math.PI/2,Me(t,h,0,.18,.02),t.add(n),n.position.set(0,.38,.2),n.add(s),Me(s,dt(i.skin,.31,18,12),0,.1,.31),Me(s,dt(i.shadow,.22,14,10),0,.02,.57),mr(s,i,-.1,.16,.58),mr(s,i,.1,.16,.58);for(const u of[-.2,.2])Me(s,Oo(i.hair,.12,.28),u,.38,.25);for(const[u,d,g]of[[o,-.22,.28],[l,.22,.28],[r,-.22,-.28],[a,.22,-.28]])u.position.set(d,0,g),Me(u,ht(i.pants,.12,.28),0,-.12,0),t.add(u);const f=ht(i.hair,.07,.4,10,3);return f.rotation.x=-.35,Me(t,f,0,.18,-.55),a.add(c),{root:e,hip:t,torso:n,head:s,armL:r,armR:a,legL:o,legR:l,weap:c,tris:Rh(e)}}const vc=new Map;function Ch(i,e){const t=`${i}:${e}`,n=vc.get(t);if(n)return n;const s={parts:i==="mara"?bx():i==="wolverine"?Fx():Nx(i,e)};return vc.set(t,s),s}function Ox(i,e,t,n,s){const{hip:r,torso:a,head:o,armL:l,armR:c,legL:h,legR:f,weap:u}=i;for(const g of[r,a,o,l,c,h,f,u])g.rotation.set(0,0,0);if(r.position.y=e==="wolverine"?.44:.64,a.position.y=e==="wolverine"?.38:.03,t==="idle"){const g=Math.sin(s/420)*.025;a.position.y+=g,o.rotation.z=Math.sin(s/900)*.035,l.rotation.x=.06+g,c.rotation.x=.06-g;return}if(t==="walk"){const g=Math.sin(n*Math.PI*2),v=Math.cos(n*Math.PI*2);h.rotation.x=g*.5,f.rotation.x=-g*.5,l.rotation.x=-g*.38,c.rotation.x=g*.38,a.position.y+=Math.abs(v)*.035,r.position.y+=Math.abs(g)*.018;return}if(t==="attack"){const g=n<.62;e==="wolverine"?(a.rotation.x=g?-.28:0,l.rotation.x=g?-.75:.15,c.rotation.x=g?-.75:.15,r.position.z=g?.14:0):e==="boxer"?(c.rotation.x=n<.35?-.35:g?-1.35:-.25,c.rotation.z=g?-.28:0,a.rotation.y=g?-.22:0,l.rotation.x=-.55):(c.rotation.x=n<.35?-.45:g?-1.35:-.35,c.rotation.z=g?-.32:0,u.rotation.x=g?-.45:0,a.rotation.y=g?-.16:0,l.rotation.x=-.25);return}const d=n<.66;l.rotation.x=d?-2:-1.25,c.rotation.x=d?-2:-1.25,l.rotation.z=.36,c.rotation.z=-.36,o.rotation.x=d?-.12:0,a.position.y+=d?.05:.015}let Ln=null,ui=null,mi=null,fi=null,yc=!1;function Ph(){if(yc&&Ln)return!0;if(typeof document>"u")return!1;try{const i=document.createElement("canvas");Ln=new ux({canvas:i,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"}),Ln.setSize(192,240,!1),Ln.setPixelRatio(1),Ln.setClearColor(0,0),Ln.outputColorSpace=Kt,ui=new pf;const e=192/240;mi=new yr(-1.35*e,1.35*e,1.35,-1.35,.1,40),fi=new We,ui.add(fi),ui.add(new ud(16774111,2238532,1.35));const t=new Gl(16771015,1.7);t.position.set(3.5,6,4.5),ui.add(t);const n=new Gl(9680383,.65);return n.position.set(-4,2,-3),ui.add(n),yc=!0,!0}catch{return!1}}function kx(i){return i*Math.PI/4}const Bx=30;function zx(i,e){if(!mi)return;const t=e*Math.PI/180,n=4.2,s=Math.cos(t),r=Math.sin(t);mi.position.set(Math.sin(i)*s*n,r*n+.85,Math.cos(i)*s*n),mi.lookAt(0,.88,0),mi.updateProjectionMatrix()}function pa(i,e,t,n,s,r=0){const a=e(0,0,0),o=mo(s)*(t.role==="elite"?1.12:1),l=o*192/240;if(!Ph()||!Ln||!ui||!mi||!fi){i.fillStyle="#6a7080",i.beginPath(),i.ellipse(a.x,a.y-o*.35,l*.22,o*.35,0,0,Math.PI*2),i.fill();return}const c=Ch(t.archetype,t.gender),h=Tx(t,n);for(Ox(c.parts,t.archetype,h.clip,h.t,n);fi.children.length;)fi.remove(fi.children[0]);c.parts.root.parent&&c.parts.root.parent.remove(c.parts.root),fi.add(c.parts.root),c.parts.root.rotation.set(0,kx(t.dir),0),zx(0,Bx),Ln.render(ui,mi),i.save(),i.imageSmoothingEnabled=!0,i.drawImage(Ln.domElement,a.x-l*.5,a.y-o*.88,l,o),i.restore()}function Hx(){if(!Ph())return;const i=["mara","dana","priya","hale","crosby","beckett","delinquent","magician","wolverine","boxer","gunner","worker","official"];for(const e of i)for(const t of["f","m"])Ch(e,t)}const go=64,Gx=24,Vx=8,Wx=15,Xx=75,xs=30;function Mc(i){return Math.min(Xx,Math.max(Wx,i))}function qx(i,e,t,n,s){return{x:(i-e)*(go/2),y:(i+e)*(n/2)-t*s}}function Sc(i,e,t,n,s,r,a,o){const l=a-t,c=o-n,h=s-t,f=r-n,u=i-t,d=e-n,g=l*l+c*c,v=l*h+c*f,p=l*u+c*d,m=h*h+f*f,S=h*u+f*d,T=g*m-v*v;if(Math.abs(T)<1e-8)return!1;const y=1/T,A=(m*p-v*S)*y,b=(g*S-v*p)*y;return A>=-.02&&b>=-.02&&A+b<=1.02}function bc(i,e,t,n,s,r){return Sc(i,e,t.x,t.y,n.x,n.y,s.x,s.y)||Sc(i,e,t.x,t.y,s.x,s.y,r.x,r.y)}function rn(i,e,t){return{x:i.x+(e.x-i.x)*t,y:i.y+(e.y-i.y)*t}}function Pn(i){const e=Math.sin(i*12.9898)*43758.5453;return e-Math.floor(e)}class Yx{constructor(e){q(this,"canvas");q(this,"ctx");q(this,"cam",{x:-224,y:180,zoom:.7});q(this,"w",390);q(this,"h",700);q(this,"time",0);q(this,"yaw",0);q(this,"pitch",xs);q(this,"mapW",10);q(this,"mapH",12);q(this,"kingsWharf",new Image);q(this,"mapDolls",{mara:new Image,dana:new Image,priya:new Image});q(this,"maraAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});q(this,"danaAngles",{front:new Image,right:new Image,back:new Image,left:new Image});this.canvas=e;const t=e.getContext("2d");if(!t)throw new Error("canvas");this.ctx=t,this.kingsWharf.decoding="async",this.kingsWharf.src="./sprites/scene-kings-wharf.png";for(const[n,s]of Object.entries(this.mapDolls))s.decoding="async",s.src=`./sprites/${n}.png`;for(const[n,s]of Object.entries(this.maraAngles))s.decoding="async",s.src=`./sprites/mara-${n}.png`;for(const[n,s]of Object.entries(this.danaAngles))s.decoding="async",s.src=`./sprites/dana-${n}.png`;this.resize()}tileH(){return go*Math.sin(this.pitch*Math.PI/180)}blockH(){const e=Math.cos(xs*Math.PI/180);return Gx*Math.cos(this.pitch*Math.PI/180)/e}baseH(){const e=Math.cos(xs*Math.PI/180);return Vx*Math.cos(this.pitch*Math.PI/180)/e}addPitch(e){this.pitch=Mc(this.pitch+e*.16)}setPitch(e){this.pitch=Mc(e)}resize(){const e=Math.min(window.devicePixelRatio||1,2),t=this.canvas.getBoundingClientRect();this.w=Math.max(1,t.width),this.h=Math.max(1,t.height),this.canvas.width=Math.floor(this.w*e),this.canvas.height=Math.floor(this.h*e),this.ctx.setTransform(e,0,0,e,0,0)}forceSize(e,t){const n=Math.min(window.devicePixelRatio||1,2);this.w=e,this.h=t,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`,this.canvas.width=Math.floor(e*n),this.canvas.height=Math.floor(t*n),this.ctx.setTransform(n,0,0,n,0,0)}syncMap(e){this.mapW=e.w,this.mapH=e.h}isoOf(e,t,n=0){const s=ns(e,t,this.yaw,this.mapW,this.mapH);return qx(s.x,s.y,n,this.tileH(),this.blockH())}worldToScreen(e,t,n=0){const s=this.isoOf(e,t,n);return{x:(s.x-this.cam.x)*this.cam.zoom+this.w/2,y:(s.y-this.cam.y)*this.cam.zoom+this.h/2}}topCorners(e,t,n){return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([r,a])=>this.worldToScreen(e+r,t+a,n))}topMetrics(e,t,n){const s=this.topCorners(e,t,n);let r=0,a=0;for(const c of s)r+=c.x,a+=c.y;r/=4,a/=4;let o=0,l=0;for(const c of s)o=Math.max(o,Math.abs(c.x-r)),l=Math.max(l,Math.abs(c.y-a));return{cx:r,cy:a,hw:o,hh:l,drop:(this.baseH()+n*this.blockH())*this.cam.zoom,top:s}}frontFaces(e,t){const n=[];for(let s=0;s<4;s++){const r=e[s],a=e[(s+1)%4],o={x:a.x,y:a.y+t},l={x:r.x,y:r.y+t};n.push({pts:[r,a,o,l],y:(r.y+a.y+o.y+l.y)/4})}return n.sort((s,r)=>s.y-r.y),n.slice(-2).map(s=>s.pts)}screenToGrid(e,t){const n=this.cam.x+(e-this.w/2)/this.cam.zoom,s=this.cam.y+(t-this.h/2)/this.cam.zoom,r=go/2,a=this.tileH()/2,o=(n/r+s/a)/2,l=(s/a-n/r)/2,c=Math.cos(this.yaw),h=Math.sin(this.yaw),f=o*c-l*h,u=o*h+l*c;return{x:f+(this.mapW-1)/2,y:u+(this.mapH-1)/2}}lockGridToScreen(e,t,n,s,r){const a=this.isoOf(e,t,n);this.cam.x=a.x-(s-this.w/2)/this.cam.zoom,this.cam.y=a.y-(r-this.h/2)/this.cam.zoom}cellsInDrawOrder(e){const t=[];for(let n=0;n<e.h;n++)for(let s=0;s<e.w;s++)t.push({x:s,y:n});return t.sort((n,s)=>{const r=ns(n.x,n.y,this.yaw,e.w,e.h),a=ns(s.x,s.y,this.yaw,e.w,e.h);return r.x+r.y-(a.x+a.y)}),t}hitTile(e,t,n){this.syncMap(n);let s=null;for(const r of this.cellsInDrawOrder(n)){const a=n.tiles[r.y][r.x];this.hitPrism(e,t,a)&&(s=r)}return s}hitPrism(e,t,n){const{drop:s,top:r}=this.topMetrics(n.x,n.y,n.h);if(bc(e,t,r[0],r[1],r[2],r[3]))return!0;for(const[a,o,l,c]of this.frontFaces(r,s))if(bc(e,t,a,o,l,c))return!0;return!1}rotate(e){this.syncMap(e);const t=this.hitTile(this.w/2,this.h/2,e)??{x:Math.floor(e.w/2),y:Math.floor(e.h/2)};this.yaw=Jh(this.yaw);const n=e.heightAt(t.x,t.y),s=this.isoOf(t.x,t.y,n);this.cam.x=s.x,this.cam.y=s.y-24}centerOn(e,t){this.syncMap(t);const n=e.filter(a=>!a.dead&&a.team==="player"&&!a.npc);if(!n.length)return;let s=0,r=0;for(const a of n){const o=this.isoOf(a.x,a.y,t.heightAt(a.x,a.y));s+=o.x,r+=o.y}this.cam.x=s/n.length,this.cam.y=r/n.length-52,this.cam.zoom=.7}draw(e,t,n,s){const r=this.ctx;this.syncMap(e),this.time+=16,r.clearRect(0,0,this.w,this.h),this.drawBackdrop(e.theme);const a=new Map;for(const l of t)l.dead||a.set(Ke(l.x,l.y),l);const o=new Map;for(const l of e.objects)l.gone||o.set(Ke(l.x,l.y),l);for(const l of this.cellsInDrawOrder(e)){this.drawTile(e.tiles[l.y][l.x],e,n);const c=o.get(Ke(l.x,l.y));c&&this.drawBoardObj(c,e);const h=a.get(Ke(l.x,l.y));h&&this.drawUnit(h,e,n)}this.drawVignette(),this.drawFloats(s,e)}drawBackdrop(e){const t=this.ctx,n=t.createLinearGradient(0,0,0,this.h);if(e==="roof"&&this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0){const s=Math.max(this.w/this.kingsWharf.naturalWidth,this.h/this.kingsWharf.naturalHeight),r=this.kingsWharf.naturalWidth*s,a=this.kingsWharf.naturalHeight*s,o=(this.w-r)*.42,l=(this.h-a)*.46;t.save(),t.globalAlpha=.86,t.drawImage(this.kingsWharf,o,l,r,a),t.fillStyle="rgba(5, 8, 18, 0.42)",t.fillRect(0,0,this.w,this.h);const c=t.createLinearGradient(0,0,0,this.h);c.addColorStop(0,"rgba(4, 8, 18, 0.38)"),c.addColorStop(.5,"rgba(6, 7, 14, 0.08)"),c.addColorStop(1,"rgba(4, 5, 10, 0.62)"),t.fillStyle=c,t.fillRect(0,0,this.w,this.h),t.restore()}else e==="alley"||e==="warehouse"||e==="street"?(n.addColorStop(0,"#0c0d12"),n.addColorStop(.5,"#0a090c"),n.addColorStop(1,"#140c08")):(n.addColorStop(0,"#0b1020"),n.addColorStop(.45,"#090914"),n.addColorStop(1,"#120818")),t.fillStyle=n,t.fillRect(0,0,this.w,this.h);t.save(),t.globalAlpha=e==="roof"?.24:.16;for(let s=0;s<8;s++){const r=(s*73+this.time*.004%73)%this.w;t.fillStyle=e==="alley"?s%2?"#ffb040":"#c45a2a":s%2?"#ffb040":"#ff6b35",t.fillRect(r,8+s%3*10,18,4)}t.restore()}themeGroup(e){return e==="warehouse"||e==="street"||e==="alley"?"alley":"roof"}tilePaint(e,t,n){const s=e.blocked;return this.themeGroup(t)==="alley"?e.terrain==="stairs"?{top:n?"#6e6254":"#5e5248",left:"#3a3228",right:"#4a4034",rim:"rgba(220, 190, 140, 0.35)",seam:"rgba(30, 20, 12, 0.45)"}:e.terrain==="roof"?{top:n?"#3a3e4c":"#323644",left:"#241c1a",right:"#302624",rim:"rgba(180, 160, 130, 0.3)",seam:"rgba(20, 16, 14, 0.5)"}:{top:s?n?"#1e2228":"#1a1e24":n?"#2c323c":"#262c36",left:"#14161c",right:"#1c2026",rim:s?"rgba(180, 70, 50, 0.4)":"rgba(120, 160, 180, 0.28)",seam:"rgba(10, 12, 16, 0.5)"}:e.terrain==="stairs"?{top:n?"#6a6258":"#5a544c",left:"#3a342c",right:"#4a443c",rim:"rgba(210, 200, 180, 0.32)",seam:"rgba(28, 24, 20, 0.45)"}:e.terrain==="roof"?{top:s?n?"#2e2c3c":"#282636":n?"#4a4860":"#3e3c54",left:"#241e2c",right:"#302838",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(140, 210, 230, 0.34)",seam:"rgba(18, 14, 28, 0.5)"}:{top:s?n?"#1c1a24":"#18161e":n?"#2c2a38":"#262430",left:"#16141c",right:"#201c28",rim:s?"rgba(180, 70, 70, 0.4)":"rgba(110, 190, 210, 0.28)",seam:"rgba(12, 10, 18, 0.5)"}}drawTile(e,t,n){const s=this.ctx,{cx:r,cy:a,hw:o,hh:l,drop:c,top:h}=this.topMetrics(e.x,e.y,e.h),f=Ke(e.x,e.y),u=(e.x+e.y)%2===0,d=this.cam.zoom,g=this.frontFaces(h,c),v=this.tilePaint(e,t.theme,u),p=g.slice().sort((S,T)=>(S[0].x+S[1].x)/2-(T[0].x+T[1].x)/2);for(let S=0;S<p.length;S++)this.drawWallFace(e,p[S],S===0?v.left:v.right,t.theme,d,e.x*13+e.y*7+S);this.drawTopSurface(e,t,h,r,a,o,l,v,d),this.drawRailings(e,t,h,d),this.drawProp(e,t.theme,r,a,o,l,d),n.move.has(f)&&(this.quadPath(this.insetQuad(h,.92)),s.fillStyle="rgba(62, 240, 208, 0.3)",s.fill(),s.strokeStyle="rgba(62, 240, 208, 0.9)",s.lineWidth=1.2,s.stroke());const m=n.areaKind;if(n.area.has(f)&&!n.hot.has(f)){const S=m==="skill"||m==="item"?"rgba(160, 130, 220, 0.16)":"rgba(255, 90, 110, 0.14)",T=m==="skill"||m==="item"?"rgba(180, 150, 230, 0.45)":"rgba(255, 110, 130, 0.42)";this.quadPath(this.insetQuad(h,.9)),s.fillStyle=S,s.fill(),s.strokeStyle=T,s.lineWidth=1.15,s.stroke()}if(n.hot.has(f)){const S=.5+.28*Math.sin(this.time/190),T=m==="skill"||m==="item"?`rgba(190, 150, 255, ${.28+S*.22})`:`rgba(255, 80, 110, ${.3+S*.22})`,y=m==="skill"||m==="item"?"rgba(230, 210, 255, 0.98)":"rgba(255, 170, 180, 0.98)";this.quadPath(this.insetQuad(h,.86)),s.fillStyle=T,s.fill(),s.strokeStyle=y,s.lineWidth=2.15,s.stroke()}n.inspect&&n.inspect.x===e.x&&n.inspect.y===e.y&&(this.quadPath(this.insetQuad(h,.96)),s.strokeStyle="rgba(255, 232, 160, 0.95)",s.lineWidth=2,s.stroke())}drawWallFace(e,t,n,s,r,a){const o=this.ctx,[l,c,h,f]=t;o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.fillStyle=n,o.fill(),o.save(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(f.x,f.y),o.closePath(),o.clip();const u=this.blockH()*r;o.strokeStyle=s==="alley"?"rgba(20, 12, 8, 0.4)":"rgba(10, 8, 16, 0.4)",o.lineWidth=1;const d=Math.max(1,e.h);for(let v=1;v<=d;v++){const p=v*u;o.beginPath(),o.moveTo(l.x,l.y+p),o.lineTo(c.x,c.y+p),o.stroke()}const g=(l.x+c.x)/2;if(o.beginPath(),o.moveTo(g,(l.y+c.y)/2),o.lineTo(g,(h.y+f.y)/2),o.strokeStyle="rgba(0,0,0,0.18)",o.stroke(),e.h>=2&&Pn(a)>.45){const v=(l.x+c.x)*.5,p=(l.y+c.y)*.5+u*.55,m=Math.max(4,Math.abs(c.x-l.x)*.22),S=Math.max(5,u*.42);o.fillStyle=s==="alley"?"rgba(8, 8, 6, 0.7)":"rgba(6, 8, 14, 0.72)",o.fillRect(v-m,p-S/2,m*2,S),o.strokeStyle=s==="alley"?"rgba(255, 170, 80, 0.18)":"rgba(80, 160, 220, 0.2)",o.strokeRect(v-m,p-S/2,m*2,S)}if(e.h>=1&&Pn(a+3)>.62){const v=l.x*.7+c.x*.3;o.strokeStyle=s==="alley"?"rgba(90, 70, 50, 0.55)":"rgba(70, 90, 100, 0.5)",o.lineWidth=Math.max(1.4,1.8*r),o.beginPath(),o.moveTo(v,(l.y+c.y)/2),o.lineTo(v,(h.y+f.y)/2),o.stroke()}o.restore(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.strokeStyle="rgba(0,0,0,0.35)",o.lineWidth=1,o.stroke()}drawTopSurface(e,t,n,s,r,a,o,l,c){const h=this.ctx;if(this.quadPath(n),h.fillStyle=l.top,h.fill(),h.save(),this.quadPath(n),h.clip(),e.terrain==="stairs"){h.strokeStyle="rgba(20, 16, 12, 0.45)",h.lineWidth=Math.max(1.2,1.5*c);for(let u=1;u<=4;u++){const d=u/5,g=rn(n[0],n[3],d),v=rn(n[1],n[2],d);h.beginPath(),h.moveTo(g.x,g.y),h.lineTo(v.x,v.y),h.stroke()}h.fillStyle="rgba(255, 230, 190, 0.07)",h.fillRect(s-a,r-o*.2,a*2,o*.5)}else if(t.theme==="roof"&&e.terrain==="roof"){h.strokeStyle=l.seam,h.lineWidth=1;for(let u=1;u<=4;u++){const d=u/5,g=rn(n[0],n[1],d),v=rn(n[3],n[2],d);h.beginPath(),h.moveTo(g.x,g.y),h.lineTo(v.x,v.y),h.stroke()}!e.prop&&!e.blocked&&Pn(e.x*9+e.y*17)<.2?(this.quadPath(this.insetQuad(n,.42)),h.fillStyle="rgba(20, 40, 70, 0.55)",h.fill(),h.strokeStyle="rgba(120, 200, 230, 0.45)",h.stroke()):!e.prop&&Pn(e.x*5+e.y*11)<.16&&(h.fillStyle="#3a3e48",h.beginPath(),h.ellipse(s+a*.12,r-o*.08,4.5*c,3.2*c,0,0,Math.PI*2),h.fill(),h.strokeStyle="#8a93a3",h.stroke())}else if(t.theme==="alley"&&e.terrain==="street"){Pn(e.x+e.y*8)>.55&&(h.fillStyle="rgba(70, 140, 180, 0.1)",h.beginPath(),h.ellipse(s-a*.1,r+o*.12,a*.32,o*.22,0,0,Math.PI*2),h.fill()),h.strokeStyle="rgba(0,0,0,0.28)",h.beginPath();const u=rn(n[0],n[2],.35+Pn(e.x*3)*.3);h.moveTo(s-a*.2,r),h.lineTo(u.x,u.y),h.stroke()}else if(t.theme==="roof"){this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0&&(h.globalAlpha=.14,h.drawImage(this.kingsWharf,-this.w*.2,-this.h*.18,this.w*1.4,this.h*1.2),h.globalAlpha=1,h.fillStyle="rgba(88, 42, 26, 0.16)",h.fill()),h.strokeStyle="rgba(255, 192, 106, 0.22)",h.lineWidth=Math.max(1,c);const u=rn(n[0],n[2],.5),d=rn(n[1],n[3],.5);h.beginPath(),h.moveTo(u.x,u.y),h.lineTo(d.x,d.y),h.stroke(),!e.prop&&!e.blocked&&Pn(e.x*31+e.y*47)<.22&&(h.strokeStyle="rgba(245, 221, 166, 0.68)",h.lineWidth=Math.max(1,1.25*c),h.beginPath(),h.ellipse(s+a*.05,r+o*.04,a*.28,o*.28,0,0,Math.PI*2),h.stroke(),h.beginPath(),h.moveTo(s-a*.16,r+o*.04),h.lineTo(s+a*.22,r+o*.04),h.moveTo(s+a*.03,r-o*.18),h.lineTo(s+a*.03,r+o*.2),h.stroke())}else h.strokeStyle=l.seam,h.beginPath(),h.moveTo(rn(n[0],n[1],.5).x,rn(n[0],n[1],.5).y),h.lineTo(rn(n[3],n[2],.5).x,rn(n[3],n[2],.5).y),h.stroke();if(e.blocked){h.strokeStyle="rgba(0,0,0,0.28)",h.lineWidth=1;for(let u=-2;u<=2;u++)h.beginPath(),h.moveTo(s-a+u*6*c,r-o),h.lineTo(s+a+u*6*c,r+o),h.stroke()}h.fillStyle="rgba(255,255,255,0.055)";for(let u=0;u<5;u++){const d=Pn(e.x*19+e.y*23+u),g=Pn(e.x*29+e.y*31+u+4);h.fillRect(s-a+d*a*2,r-o+g*o*2,1.6*c,1.2*c)}h.restore(),this.quadPath(n),h.strokeStyle=l.rim,h.lineWidth=1.2,h.stroke();let f=0;for(let u=1;u<4;u++)n[u].y<n[f].y&&(f=u);h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+1)%4].x,n[(f+1)%4].y),h.strokeStyle="rgba(230, 248, 255, 0.38)",h.stroke(),h.beginPath(),h.moveTo(n[f].x,n[f].y),h.lineTo(n[(f+3)%4].x,n[(f+3)%4].y),h.strokeStyle="rgba(20, 20, 28, 0.4)",h.stroke()}drawRailings(e,t,n,s){if(e.h<1||e.terrain==="stairs")return;const r=this.ctx,a=[[0,-1],[1,0],[0,1],[-1,0]],o=(t.theme==="roof"?7.5:6.5)*s;r.strokeStyle=t.theme==="roof"?"rgba(170, 186, 210, 0.85)":"rgba(120, 96, 72, 0.8)",r.lineWidth=Math.max(1.15,1.35*s);for(let l=0;l<4;l++){const c=t.tile(e.x+a[l][0],e.y+a[l][1]);if((c?e.h-c.h:e.h+1)<1)continue;const f=n[l],u=n[(l+1)%4];r.beginPath(),r.moveTo(f.x,f.y),r.lineTo(f.x,f.y-o),r.lineTo(u.x,u.y-o),r.lineTo(u.x,u.y),r.stroke(),r.beginPath(),r.moveTo(f.x,f.y-o*.48),r.lineTo(u.x,u.y-o*.48),r.stroke()}}diamondPath(e,t,n,s){const r=this.ctx;r.beginPath(),r.moveTo(e,t-s),r.lineTo(e+n,t),r.lineTo(e,t+s),r.lineTo(e-n,t),r.closePath()}quadPath(e){const t=this.ctx;t.beginPath(),t.moveTo(e[0].x,e[0].y);for(let n=1;n<e.length;n++)t.lineTo(e[n].x,e[n].y);t.closePath()}insetQuad(e,t){let n=0,s=0;for(const r of e)n+=r.x,s+=r.y;return n/=e.length,s/=e.length,e.map(r=>({x:n+(r.x-n)*t,y:s+(r.y-s)*t}))}drawProp(e,t,n,s,r,a,o){const l=this.ctx;if(e.prop==="stall"){const c=15*o;l.beginPath(),l.moveTo(n-r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n-r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#3a141c",l.fill(),l.beginPath(),l.moveTo(n+r*.55,s+a*.05),l.lineTo(n,s+a*.55),l.lineTo(n,s+a*.55+c),l.lineTo(n+r*.55,s+a*.05+c),l.closePath(),l.fillStyle="#4a1d28",l.fill();const h=.75+Math.sin(this.time/180+e.x)*.2;this.diamondPath(n,s-4*o,r*.62,a*.62),l.fillStyle=`rgba(255, 61, 138, ${.72*h})`,l.fill(),l.fillStyle="#ffe08a",l.font=`bold ${Math.max(8,9*o)}px sans-serif`,l.textAlign="center",l.fillText(e.x<5?"FISH":"TEA",n,s-2*o)}else if(e.prop==="crate"){const c=13*o;l.beginPath(),l.moveTo(n-r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n-r*.48,s+c),l.closePath(),l.fillStyle="#5a3a22",l.fill(),l.beginPath(),l.moveTo(n+r*.48,s),l.lineTo(n,s+a*.48),l.lineTo(n,s+a*.48+c),l.lineTo(n+r*.48,s+c),l.closePath(),l.fillStyle="#6c4628",l.fill(),this.diamondPath(n,s-2*o,r*.48,a*.48),l.fillStyle="#8a5a32",l.fill(),l.strokeStyle="rgba(40, 22, 10, 0.55)",l.lineWidth=1;for(let h=-1;h<=1;h++)l.beginPath(),l.moveTo(n-r*.28,s+h*3*o),l.lineTo(n+r*.28,s+h*3*o),l.stroke();l.strokeStyle="rgba(180, 160, 120, 0.45)",l.strokeRect(n-5*o,s-3*o,10*o,4*o)}else if(e.prop==="ac"){const c=11*o;l.beginPath(),l.moveTo(n-r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n-r*.42,s+c),l.closePath(),l.fillStyle="#2e323c",l.fill(),l.beginPath(),l.moveTo(n+r*.42,s),l.lineTo(n,s+a*.42),l.lineTo(n,s+a*.42+c),l.lineTo(n+r*.42,s+c),l.closePath(),l.fillStyle="#3a3e48",l.fill(),this.diamondPath(n,s-2*o,r*.42,a*.42),l.fillStyle="#4a5060",l.fill();const h=this.time/140;l.strokeStyle="#8a93a3",l.lineWidth=1.2,l.beginPath(),l.arc(n,s-2*o,4.8*o,0,Math.PI*2),l.stroke(),l.beginPath(),l.moveTo(n+Math.cos(h)*4.2*o,s-2*o+Math.sin(h)*2.2*o),l.lineTo(n-Math.cos(h)*4.2*o,s-2*o-Math.sin(h)*2.2*o),l.stroke()}else if(e.prop==="lamp"){l.fillStyle="#2a2a32",l.fillRect(n-1.6*o,s-20*o,3.2*o,24*o);const c=t==="alley"?"rgba(255, 180, 80, 0.92)":"rgba(255, 210, 120, 0.9)";l.fillStyle=c,l.beginPath(),l.arc(n,s-22*o,4.4*o,0,Math.PI*2),l.fill(),l.fillStyle=t==="alley"?"rgba(255, 160, 70, 0.14)":"rgba(255, 200, 110, 0.12)",l.beginPath(),l.arc(n,s-4*o,17*o,0,Math.PI*2),l.fill()}}projectAt(e,t,n,s,r){return(a,o,l)=>{const c=_c(a,o,s),h=this.worldToScreen(e+c.x,t+c.y,n+l*da),f=ns(e+c.x,t+c.y,this.yaw,r.w,r.h);return{x:h.x,y:h.y,d:f.x+f.y-l}}}drawBoardObj(e,t){const n=this.ctx,s=t.tiles[e.y][e.x].h;this.worldToScreen(e.x,e.y,s);const r=this.cam.zoom,{cx:a,cy:o,hw:l,hh:c}=this.topMetrics(e.x,e.y,s);if(e.type==="barrel"){n.fillStyle="#7a2a22",n.beginPath(),n.ellipse(a,o+2*r,l*.38,c*.32,0,0,Math.PI*2),n.fill(),n.fillStyle="#c44a32",n.fillRect(a-7*r,o-16*r,14*r,18*r),n.fillStyle="#e8c45a",n.fillRect(a-7*r,o-8*r,14*r,2.2*r),n.fillStyle="#2a1010",n.beginPath(),n.ellipse(a,o-16*r,7*r,3.2*r,0,0,Math.PI*2),n.fill();const f=e.hp/Math.max(1,e.maxHp);n.fillStyle="#111018",n.fillRect(a-10*r,o-22*r,20*r,3*r),n.fillStyle="#ff4d6d",n.fillRect(a-10*r,o-22*r,20*r*f,3*r);return}if(e.type==="kit"){n.fillStyle="#f2f4f0",n.fillRect(a-8*r,o-8*r,16*r,12*r),n.fillStyle="#d04040",n.fillRect(a-2*r,o-6*r,4*r,8*r),n.fillRect(a-6*r,o-3*r,12*r,3*r),n.strokeStyle="#3a3a40",n.strokeRect(a-8*r,o-8*r,16*r,12*r);return}if(e.type==="switch"){n.fillStyle=e.used?"#3a5a48":"#3ef0d0",this.diamondPath(a,o,l*.35,c*.35),n.fill(),n.strokeStyle="#0a1816",n.stroke(),n.fillStyle=e.used?"#8aa":"#fff",n.font=`bold ${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(e.used?"開":"掣",a,o+3*r);return}if(e.type==="van"){n.fillStyle=e.used?"#3a4850":"#2a3540",n.fillRect(a-14*r,o-18*r,28*r,22*r),n.fillStyle="#1a2228",n.fillRect(a-10*r,o-14*r,12*r,8*r),n.fillStyle=e.used?"#7dffb3":"#ffc857",n.fillRect(a+4*r,o-6*r,8*r,10*r),n.fillStyle="#e8eef2",n.font=`${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(e.used?"開":"門",a,o+16*r);return}const h=e.type==="pallet"?8*r:12*r;n.fillStyle=e.type==="pallet"?"#6a5030":"#8a5a32",n.beginPath(),n.moveTo(a-l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a-l*.46,o+h),n.closePath(),n.fill(),n.fillStyle=e.type==="pallet"?"#7a6038":"#a06a3c",n.beginPath(),n.moveTo(a+l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a+l*.46,o+h),n.closePath(),n.fill(),this.diamondPath(a,o-2*r,l*.46,c*.46),n.fillStyle=e.type==="pallet"?"#c4a060":"#c48448",n.fill(),n.strokeStyle="rgba(40,22,10,0.55)",n.stroke()}projectFor(e,t){const n=t.heightAt(e.x,e.y);return(s,r,a)=>{const o=_c(s,r,e.dir),l=this.worldToScreen(e.x+o.x,e.y+o.y,n+a*da),c=ns(e.x+o.x,e.y+o.y,this.yaw,t.w,t.h);return{x:l.x,y:l.y,d:c.x+c.y-a*da*.45}}}drawMapDoll(e,t,n,s,r,a,o=!0){const l=mo(s)*(a?1.12:1),c=l*e.naturalWidth/e.naturalHeight,h=this.ctx;h.save(),h.translate(t-c/2,n-l),o&&r.x-r.y<0&&(h.translate(c,0),h.scale(-1,1)),h.drawImage(e,0,0,c,l),h.restore()}drawUnit(e,t,n){const s=this.ctx,r=t.heightAt(e.x,e.y),a=this.worldToScreen(e.x,e.y,r),o=this.cam.zoom,l=e.role==="elite",c=(l?1.12:1)*o,h=Lc(e),f=Zh(_s[e.dir].x,_s[e.dir].y,this.yaw),u=(f.x-f.y)*6*o*(e.lunge||0),d=(f.x+f.y)*3*o*(e.lunge||0),g=a.x+u,v=a.y+d+2*o,p=e.acted;s.save(),p&&(s.globalAlpha*=.45),s.fillStyle="rgba(0,0,0,0.4)",s.beginPath(),s.ellipse(g,v+1*o,11*c,4.8*c,0,0,Math.PI*2),s.fill(),s.strokeStyle=h,s.lineWidth=Math.max(2,2.2*o),s.beginPath(),s.ellipse(g,v+1*o,12.2*c,5.4*c,0,0,Math.PI*2),s.stroke(),s.strokeStyle="rgba(8,8,12,0.85)",s.lineWidth=1,s.stroke(),n.selected?.id===e.id&&(s.strokeStyle=h,s.lineWidth=2.2,this.diamondPath(a.x,a.y,16*c,8*c),s.stroke()),n.target?.id===e.id&&(s.strokeStyle="#ffe08a",s.lineWidth=2,this.diamondPath(a.x,a.y,18*c,9*c),s.stroke());const m=this.projectFor(e,t),S=(R,_,E)=>{const C=m(R,_,E);return{x:C.x+u,y:C.y+d,d:C.d}};if(e.archetype==="mara")pa(s,S,e,this.time,o,this.yaw);else if(e.archetype==="dana"){const R=e.dir<=1?"front":e.dir<=3?"right":e.dir<=5?"back":"left",_=this.danaAngles[R],E=this.mapDolls.dana;_.complete&&_.naturalWidth>0&&_.naturalHeight>0?this.drawMapDoll(_,g,v,o,f,l,!1):E.complete&&E.naturalWidth>0&&E.naturalHeight>0?this.drawMapDoll(E,g,v,o,f,l,!1):pa(s,S,e,this.time,o,this.yaw)}else{const R=e.archetype==="priya"?this.mapDolls.priya:null;R&&R.complete&&R.naturalWidth>0&&R.naturalHeight>0?this.drawMapDoll(R,g,v,o,f,l):pa(s,S,e,this.time,o,this.yaw)}this.drawFacingWedge(e,t,g,v,o);const T=mo(o)*(l?1.12:1),y=22*c,A=Math.max(0,e.hp/e.maxHp),b=v-T-4*c;if(s.fillStyle="#111018",s.fillRect(g-y/2,b,y,3.5*c),s.fillStyle=h,s.fillRect(g-y/2,b,y*A,3.5*c),s.fillStyle="#e8eef2",s.font=`${Math.max(9,10*o)}px sans-serif`,s.textAlign="center",s.fillText(e.name.split(" ")[0],g,v+16*o),s.restore(),p){const R=g+14*c,_=v-T+10*c,E=7.2*c;s.fillStyle="rgba(8, 8, 14, 0.88)",s.beginPath(),s.arc(R,_,E,0,Math.PI*2),s.fill(),s.strokeStyle="rgba(220, 224, 232, 0.92)",s.lineWidth=Math.max(1,1.15*o),s.stroke(),s.fillStyle="#e8eef2",s.font=`bold ${Math.max(9,11*o)}px sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText("E",R,_+.4*c),s.textBaseline="alphabetic"}}drawFacingWedge(e,t,n,s,r){const a=this.ctx,o=t.heightAt(e.x,e.y),l=this.projectAt(e.x,e.y,o,e.dir,t),c=[l(0,.11,.03),l(-.035,.04,.03),l(.035,.04,.03)],h=[l(-.04,.035,.018),l(.04,.035,.018),l(.05,-.045,.018),l(0,-.015,.018),l(-.05,-.045,.018)];a.beginPath(),a.moveTo(h[0].x,h[0].y);for(let f=1;f<h.length;f++)a.lineTo(h[f].x,h[f].y);a.closePath(),a.lineJoin="round",a.strokeStyle="rgba(6,8,14,0.95)",a.lineWidth=Math.max(1.6,1.8*r),a.stroke(),a.fillStyle="#5a88c8",a.fill(),a.beginPath(),a.moveTo(c[0].x,c[0].y),a.lineTo(c[1].x,c[1].y),a.lineTo(c[2].x,c[2].y),a.closePath(),a.strokeStyle="rgba(6,8,14,0.95)",a.stroke(),a.fillStyle="#ff9a3c",a.fill()}drawVignette(){const e=this.ctx,t=e.createRadialGradient(this.w/2,this.h/2,this.h*.2,this.w/2,this.h/2,this.h*.78);t.addColorStop(0,"rgba(0,0,0,0)"),t.addColorStop(1,"rgba(0,0,0,0.45)"),e.fillStyle=t,e.fillRect(0,0,this.w,this.h)}drawFloats(e,t){const n=this.ctx,s=performance.now();for(const r of e){const a=(s-r.born)/r.life;if(a>1)continue;const o=t.heightAt(Math.round(r.x),Math.round(r.y)),l=this.worldToScreen(r.x,r.y,o);n.globalAlpha=1-a,n.font=`bold ${18*this.cam.zoom}px sans-serif`,n.textAlign="center",n.lineWidth=3,n.strokeStyle="#050508",n.fillStyle=r.color;const c=l.y-36*this.cam.zoom-a*28;n.strokeText(r.text,l.x,c),n.fillText(r.text,l.x,c),n.globalAlpha=1}}}const Lh=3,Ih="yejie-v1";function Ec(){return{slots:[null,null,null],autosave:null}}function oi(){try{const i=localStorage.getItem(Ih);if(!i)return Ec();const e=JSON.parse(i),t=[null,null,null];for(let s=0;s<Lh;s++){const r=Array.isArray(e.slots)?e.slots[s]:null;t[s]=r&&r.v===1?r:null}const n=e.autosave&&e.autosave.v===1?e.autosave:null;return{slots:t,autosave:n}}catch{return Ec()}}function Tc(i){localStorage.setItem(Ih,JSON.stringify(i))}function $x(i){const e=[];i.autosave&&e.push(i.autosave);for(const t of i.slots)t&&e.push(t);return e}function wc(i){const e=$x(i);return e.length?e.reduce((t,n)=>t.savedAt>=n.savedAt?t:n):null}function Kx(i){try{return new Date(i).toLocaleString("zh-Hant-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}const Ac="0.6.13",Zx="20260908";function xe(i){const e=document.getElementById(i);if(!e)throw new Error(i);return e}const Jx={Mara:"./sprites/vn-mara.png",Dana:"./sprites/vn-dana.png",Priya:"./sprites/vn-priya.png"},Rc=250,ma=520,ga=460,Qx={striker:"突擊",controller:"控制",support:"支援",grunt:"現場",elite:"主管",civilian:"文官",delinquent:"街頭",magician:"術者",wolverine:"爪獸",boxer:"拳手",gunner:"槍手",worker:"工人"},xa={street:"街道",stairs:"樓梯",roof:"屋頂"},jx={stall:"攤位",ac:"冷氣",lamp:"路燈",crate:"貨箱"},Cc={friendly:"友方",hostile:"敵對",neutral:"中立"};class e_{constructor(e){q(this,"map");q(this,"units",[]);q(this,"phase","title");q(this,"turn",1);q(this,"selected",null);q(this,"origin",null);q(this,"originDir",0);q(this,"field",null);q(this,"moveTiles",new Set);q(this,"actionTiles",new Set);q(this,"skillTiles",new Set);q(this,"areaTiles",new Set);q(this,"areaKind",null);q(this,"forecast",null);q(this,"inspect",null);q(this,"floats",[]);q(this,"busy",!1);q(this,"log","");q(this,"missionIndex",0);q(this,"loseKind","wipe");q(this,"intel","M");q(this,"power","M");q(this,"inventory",Qt(wi));q(this,"missionStartInventory",Qt(wi));q(this,"pendingItem",null);q(this,"m1DropGiven",!1);q(this,"modalKind","off");q(this,"paused",!1);q(this,"pauseOpen",!1);q(this,"vnOpen",!1);q(this,"vnDone",null);q(this,"m1IntroPlayed",!1);q(this,"m1MidBeatPlayed",!1);q(this,"renderer");q(this,"input");q(this,"hudTurn",xe("hud-turn"));q(this,"hudPhase",xe("hud-phase"));q(this,"hudSub",xe("hud-sub"));q(this,"chip",xe("unit-chip"));q(this,"chipMark",xe("chip-mark"));q(this,"chipName",xe("chip-name"));q(this,"chipMeta",xe("chip-meta"));q(this,"chipExtra",xe("chip-extra"));q(this,"chipHp",xe("chip-hp"));q(this,"chipHpFill",xe("chip-hp-fill"));q(this,"forecastEl",xe("forecast"));q(this,"logEl",xe("log"));q(this,"title",xe("title"));q(this,"briefing",xe("briefing"));q(this,"result",xe("result"));q(this,"resultKicker",xe("result-kicker"));q(this,"resultTitle",xe("result-title"));q(this,"resultBody",xe("result-body"));q(this,"modal",xe("modal"));q(this,"modalKicker",xe("modal-kicker"));q(this,"modalTitle",xe("modal-title"));q(this,"modalBody",xe("modal-body"));q(this,"confirmEl",xe("confirm"));q(this,"confirmText",xe("confirm-text"));q(this,"btnCancel",xe("btn-cancel"));q(this,"btnWait",xe("btn-wait"));q(this,"btnSkill",xe("btn-skill"));q(this,"btnConfirm",xe("btn-confirm"));q(this,"btnEnd",xe("btn-end"));q(this,"btnNext",xe("btn-next"));q(this,"btnRotate",xe("btn-rotate"));q(this,"btnPause",xe("btn-pause"));q(this,"btnBag",xe("btn-bag"));q(this,"btnContinue",xe("btn-continue"));q(this,"btnMute",xe("btn-mute"));q(this,"btnPauseNext",xe("btn-pause-next"));q(this,"pauseEl",xe("pause"));q(this,"vn",xe("vn"));q(this,"vnBust",xe("vn-bust"));q(this,"vnBox",xe("vn-box"));q(this,"vnName",xe("vn-name"));q(this,"vnText",xe("vn-text"));q(this,"titleBuild",xe("title-build"));q(this,"camHint",xe("cam-hint"));q(this,"yawSlider",xe("yaw-slider"));q(this,"pitchSlider",xe("pitch-slider"));q(this,"pendingSlot",null);q(this,"pendingQuit",!1);q(this,"pendingJump",null);this.renderer=new Yx(e),Hx(),this.input=new hu(e,this.renderer),this.input.onTap=t=>this.onTap(t),this.map=new Cr(this.mission.map),this.resetBattle(),this.phase="title",this.briefing.hidden=!0,this.title.hidden=!1,window.addEventListener("resize",()=>this.renderer.resize()),xe("btn-start").addEventListener("click",()=>this.begin()),xe("btn-restart").addEventListener("click",()=>this.restart()),this.btnNext.addEventListener("click",()=>this.nextMission()),this.btnCancel.addEventListener("click",()=>this.cancel()),this.btnWait.addEventListener("click",()=>void this.wait()),this.btnSkill.addEventListener("click",()=>this.armSkill()),this.btnConfirm.addEventListener("click",()=>void this.confirm()),this.btnEnd.addEventListener("click",()=>void this.endTurn()),this.btnRotate.addEventListener("click",()=>this.rotateMap()),this.btnPause.addEventListener("click",()=>this.openPause()),this.btnBag.addEventListener("click",()=>this.openBagFromHud()),xe("btn-new").addEventListener("click",()=>this.newGame()),this.btnContinue.addEventListener("click",()=>this.continueGame()),xe("btn-load").addEventListener("click",()=>this.openSaves("load")),xe("btn-bag-title").addEventListener("click",()=>this.openBag()),xe("btn-refresh").addEventListener("click",()=>void this.refreshApp()),xe("btn-brief-title").addEventListener("click",()=>this.goTitle()),xe("btn-result-title").addEventListener("click",()=>this.goTitle()),xe("btn-resume").addEventListener("click",()=>this.closePause()),xe("btn-pause-save").addEventListener("click",()=>this.openSaves("save")),xe("btn-pause-load").addEventListener("click",()=>this.openSaves("load")),this.btnMute.addEventListener("click",()=>this.toggleMute()),this.btnPauseNext.addEventListener("click",()=>this.requestNextMission()),this.vn.addEventListener("click",()=>this.advanceVn()),this.vn.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.advanceVn())}),document.querySelectorAll("[data-test-mission]").forEach(t=>{t.addEventListener("click",()=>this.jumpToMission(Number(t.dataset.testMission)))}),xe("btn-quit-title").addEventListener("click",()=>this.quitToTitle()),xe("modal-close").addEventListener("click",()=>this.closeModal()),xe("confirm-yes").addEventListener("click",()=>this.confirmYes()),xe("confirm-no").addEventListener("click",()=>this.confirmNo()),this.bindSeg("seg-intel",t=>{this.intel=t}),this.bindSeg("seg-power",t=>{this.power=t}),this.yawSlider.addEventListener("input",()=>{this.renderer.yaw=Number(this.yawSlider.value)/100}),this.pitchSlider.addEventListener("input",()=>{this.renderer.setPitch(Number(this.pitchSlider.value))}),this.modalBody.addEventListener("click",t=>this.onModalClick(t)),this.titleBuild.textContent=`版本 ${Ac}　${Zx}`,this.syncMuteBtn(),et.setBgm("title"),this.refreshContinue()}get mission(){return Ei[this.missionIndex]??Ei[0]}async waitMs(e){const t=performance.now()+e;for(;performance.now()<t;){for(;this.paused;)await tl(40);const n=t-performance.now();if(n<=0)break;await tl(Math.min(40,n))}}start(){const e=/(?:^|[?&])shot(?:=|$|&)/.test(location.search)||location.hash.includes("shot"),t=()=>{this.floats=this.floats.filter(s=>performance.now()-s.born<s.life),this.renderer.draw(this.map,this.units,{move:this.phase==="select"?this.moveTiles:new Set,area:this.overlayArea(),hot:this.overlayHot(),areaKind:this.overlayKind(),selected:this.selected,target:this.forecast?.target??null,inspect:this.inspectPos(),phase:this.phase},this.floats)};this.syncUi(),(()=>{if(e){this.renderer.forceSize(390,640),this.renderer.centerOn(this.units,this.map);for(let a=0;a<8;a++)t();const r=document.createElement("img");r.alt="board",r.src=this.renderer.canvas.toDataURL("image/png"),r.style.cssText="position:absolute;left:0;right:0;top:48px;width:100%;height:auto;z-index:1;pointer-events:none",this.renderer.canvas.insertAdjacentElement("afterend",r);return}const s=()=>{t(),requestAnimationFrame(s)};requestAnimationFrame(s)})()}applyHash(){const e=location.hash.replace("#","");if(e==="inv"){this.openBag();return}if(e==="save"){this.openSaves("load");return}if(e==="m3"||e==="play3"){if(this.missionIndex=2,this.resetBattle(),this.title.hidden=!0,e==="m3"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m4"||e==="play4"){if(this.missionIndex=3,this.resetBattle(),this.title.hidden=!0,e==="m4"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m5"||e==="play5"){if(this.missionIndex=4,this.resetBattle(),this.title.hidden=!0,e==="m5"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m2"||e==="play2"||e==="inspect"||e==="play2rot"){if(this.missionIndex=1,this.resetBattle(),this.title.hidden=!0,e==="m2"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin(),e==="play2rot"&&(this.renderer.yaw=Math.PI/2,this.renderer.centerOn(this.units,this.map));const t=this.units.find(n=>n.id==="dana");if(t&&e!=="inspect"&&(t.acted=!0),e==="inspect"){const n=this.units.find(s=>s.id==="beckett")??this.units.find(s=>s.team==="enemy");n&&(this.inspect={kind:"unit",unit:n},this.syncUi())}else{const n=this.units.find(s=>s.id==="mara");n&&this.selectUnit(n)}return}if(e==="play"||e==="brief"){if(this.title.hidden=!0,this.resetBattle(),e==="brief"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();const t=this.units.find(s=>s.id==="mara");t&&this.selectUnit(t);const n=this.units.find(s=>s.id==="dana");n&&(n.acted=!0)}}bindSeg(e,t){const n=xe(e);n.addEventListener("click",s=>{const r=s.target.closest("button");if(!r)return;const a=r.getAttribute("data-v");if(!(a!=="L"&&a!=="M"&&a!=="H")){for(const o of n.querySelectorAll("button"))o.classList.toggle("on",o===r);t(a)}})}inspectPos(){const e=this.inspect;if(!e)return null;if(e.kind==="unit")return{x:e.unit.x,y:e.unit.y};if(e.kind==="object"){const t=this.map.objects.find(n=>n.id===e.id);return t?{x:t.x,y:t.y}:null}return{x:e.tile.x,y:e.tile.y}}fillBriefing(){const e=this.mission;xe("brief-num").textContent=e.number,xe("brief-loc").textContent=e.loc;const t=xe("brief-body");t.innerHTML="";for(const o of e.paragraphs){const l=document.createElement("p");l.textContent=o,t.appendChild(l)}const n=xe("brief-conds");n.innerHTML="";const s=document.createElement("li");s.innerHTML="<span>勝利</span>",s.append(e.winCond);const r=document.createElement("li");r.innerHTML="<span>失敗</span>",r.append(e.loseCond),n.append(s,r);const a=xe("brief-voices");a.innerHTML="";for(const o of e.voices){const l=document.createElement("p"),c=document.createElement("b");c.textContent=o.name,l.append(c,`「${o.line}」`),a.appendChild(l)}this.hudSub.textContent=e.hudSub}showVn({speaker:e,side:t,text:n}){return this.vnOpen=!0,this.vn.classList.toggle("right",t==="right"),this.vn.classList.toggle("left",t!=="right"),this.vnBust.src=Jx[e],this.vnBust.alt=e,this.vnName.textContent=e,this.vnText.textContent=n,this.vn.hidden=!1,this.syncUi(),new Promise(s=>{this.vnDone=s,this.vnBox.focus({preventScroll:!0})})}advanceVn(){const e=this.vnDone;e&&(this.vnDone=null,this.vnOpen=!1,this.vn.hidden=!0,this.vnBust.removeAttribute("src"),e(),this.syncUi())}async playMissionIntro(){if(this.missionIndex!==0||this.m1IntroPlayed)return;this.m1IntroPlayed=!0;const e=["left","right","left"],t=this.mission.voices.slice(0,3).map((n,s)=>({speaker:n.name,side:e[s]??"left",text:n.line}));for(const n of t)await this.showVn(n)}resetBattle(){const e=this.mission;this.map=new Cr(e.map),this.units=[...Qo(e.starts),...e.makeOthers()];for(const t of this.units)Qh(t,this.power);this.phase="briefing",this.turn=1,this.clearSel(),this.inspect=null,this.busy=!1,this.loseKind="wipe",this.pendingItem=null,this.m1IntroPlayed=!1,this.m1MidBeatPlayed=!1,this.vnOpen=!1,this.vnDone=null,this.vn.hidden=!0,this.log="點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放並旋轉，上下俯仰。",this.renderer.yaw=0,this.renderer.setPitch(xs),this.renderer.centerOn(this.units,this.map),this.fillBriefing()}newGame(){this.missionIndex=0,this.inventory=Qt(wi),this.missionStartInventory=Qt(wi),this.m1DropGiven=!1,this.resetBattle(),this.title.hidden=!0,this.briefing.hidden=!1,this.phase="briefing",et.setBgm("title"),this.syncUi(),this.autosave()}continueGame(){const e=wc(oi());e&&this.applySave(e)}async begin(){this.missionStartInventory=Qt(this.inventory),this.briefing.hidden=!0,this.title.hidden=!0,this.phase="select",et.setBgm("battle"),this.renderer.centerOn(this.units,this.map),this.busy=this.missionIndex===0&&!this.m1IntroPlayed,this.syncUi(),this.autosave(),this.busy&&await this.playMissionIntro(),this.busy=!1,this.syncUi(),this.autosave()}restart(){this.inventory=Qt(this.missionStartInventory),this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi()}nextMission(){this.missionIndex>=Ei.length-1||(this.missionIndex+=1,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi(),this.autosave())}rotateMap(){this.phase==="briefing"||this.phase==="title"||(this.renderer.rotate(this.map),this.yawSlider.value=String(Math.round((this.renderer.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*100)))}clearSel(){this.selected=null,this.origin=null,this.field=null,this.moveTiles.clear(),this.actionTiles.clear(),this.skillTiles.clear(),this.areaTiles.clear(),this.areaKind=null,this.forecast=null,this.pendingItem=null}locked(){const e=this.selected;return!!e&&e.movedThisTurn}selectUnit(e){e.team!=="player"||e.acted||e.dead||e.npc||(this.selected=e,e.movedThisTurn||(this.origin=null),this.forecast=null,this.inspect=null,this.pendingItem=null,this.showCommand(e))}refreshRanges(e){if(this.skillTiles.clear(),e.movedThisTurn?(this.field=null,this.moveTiles.clear()):(this.field=Ts(e,this.map,this.units),this.moveTiles=new Set([...this.field.cost.keys()].filter(t=>t!==Ke(e.x,e.y)))),e.actedThisTurn)this.actionTiles=new Set,this.areaTiles=new Set,this.areaKind=null;else{this.actionTiles=nu(e,this.map,this.units);for(const t of this.map.objects)t.gone||t.kind!=="destructible"||Xi(e,e.x,e.y,t.x,t.y,this.map)&&this.actionTiles.add(Ke(t.x,t.y));this.areaTiles=er(e,this.map),this.areaKind="attack"}}overlayArea(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"?this.areaTiles:new Set}overlayHot(){return this.phase==="itemAim"?this.skillTiles:this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?this.skillTiles:this.phase==="select"||this.phase==="forecast"?this.actionTiles:new Set}overlayKind(){return this.phase==="itemAim"?"item":this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?"skill":this.phase==="select"||this.phase==="forecast"?this.areaKind:null}showCommand(e){this.refreshRanges(e),this.phase="select";const t=[];e.movedThisTurn||t.push("可移動"),e.actedThisTurn||t.push("可攻擊／技能／道具"),this.log=t.length?t.join("　"):"結束或待機",this.syncUi()}async commitMove(e){const t=this.selected;if(!t||!this.field||this.busy||t.movedThisTurn)return;const n=Ke(e.x,e.y);if(!this.field.cost.has(n)||e.x===t.x&&e.y===t.y)return;this.busy=!0,et.play("move"),this.origin={x:t.x,y:t.y},this.originDir=t.dir;const s=jn(this.field,e);t.anim="walk",t.animStart=performance.now();for(let r=1;r<s.length;r++)t.x=s[r].x,t.y=s[r].y,await this.waitMs(Rc);if(t.dir=ts(s[s.length-2],s[s.length-1]),t.anim="idle",t.movedThisTurn=!0,this.tryPickup(t),this.busy=!1,t.actedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}onTap(e){if(this.busy||this.pauseOpen||this.phase==="title"||this.phase==="briefing"||this.phase==="enemy"||this.phase==="victory"||this.phase==="defeat")return;const t=this.renderer.hitTile(e.x,e.y,this.map);if(this.phase==="forecast"){(!t||this.forecast&&(t.x!==this.forecast.target.x||t.y!==this.forecast.target.y))&&this.backFromForecast();return}if(this.phase==="skillAim"){t?this.trySkillTarget(t):this.backFromSkill();return}if(this.phase==="itemAim"){t?this.tryItemTarget(t):this.backFromItem();return}if(this.phase!=="select")return;if(!t){if(this.inspect){this.inspect=null,this.syncUi();return}this.selected&&!this.locked()&&(this.clearSel(),this.syncUi());return}const n=this.unitAt(t.x,t.y),s=this.selected,r=this.map.objAt(t.x,t.y);if(s&&!s.actedThisTurn&&n&&this.actionTiles.has(Ke(n.x,n.y))){this.forecast=ya(s,n,this.map),this.phase="forecast",this.log=this.forecast.detail,this.inspect=null,this.syncUi();return}if(s&&!s.actedThisTurn&&r&&!r.gone&&r.kind==="destructible"&&this.actionTiles.has(Ke(r.x,r.y))){this.forecast={kind:"object",actor:s,target:s,label:`${s.name} → ${r.label}`,detail:r.type==="barrel"?`破壞油桶　鄰格受到 ${Rr} 傷害`:"破壞此物",dmg:Math.max(1,s.atk+(s.atkBuff||0)),heal:0,skip:!1,face:"front",objectId:r.id},this.phase="forecast",this.log=this.forecast.detail,this.inspect=null,this.syncUi();return}if(s&&r&&!r.gone&&Math.abs(s.x-r.x)+Math.abs(s.y-r.y)<=1){if(r.kind==="pickup"){this.tryPickupAt(s,r);return}if(r.kind==="trigger"&&!r.used&&!s.actedThisTurn){this.useTrigger(s,r);return}}if(s&&!s.movedThisTurn&&this.moveTiles.has(Ke(t.x,t.y))&&(!n||n.id===s.id)){if(n&&n.id===s.id){this.inspectUnit(n);return}this.inspect=null,this.commitMove(t);return}if(n&&n.team==="player"&&!n.acted&&!n.npc&&(!s||!this.locked())){this.selectUnit(n);return}n?this.inspectUnit(n):r&&!r.gone?this.inspectObject(r.id):this.inspectTile(this.map.tile(t.x,t.y))}inspectUnit(e){this.inspect={kind:"unit",unit:e},this.log=`${e.name}　${Cc[Qn(e)]}`,this.syncUi()}inspectTile(e){this.inspect={kind:"tile",tile:e},this.log=xa[e.terrain],this.syncUi()}inspectObject(e){this.inspect={kind:"object",id:e};const t=this.map.objects.find(n=>n.id===e);this.log=t?t.label:"",this.syncUi()}trySkillTarget(e){const t=this.selected;if(!t)return;const s=va(t,this.map,this.units).find(r=>r.x===e.x&&r.y===e.y);if(!s){et.play("miss"),this.backFromSkill();return}this.forecast=il(t,s,this.map),this.phase="forecast",this.log=this.forecast.detail,this.syncUi()}tryItemTarget(e){const t=Ar(this.units).find(n=>n.x===e.x&&n.y===e.y);if(!t){et.play("miss"),this.backFromItem();return}this.applyItem(t)}backFromForecast(){if(this.selected){if(this.skillTiles.size&&this.forecast?.kind==="skill"){this.forecast=null,this.phase="skillAim",this.syncUi();return}this.forecast=null,this.showCommand(this.selected)}}backFromSkill(){this.skillTiles.clear(),this.forecast=null,this.selected&&this.showCommand(this.selected)}backFromItem(){this.pendingItem=null,this.skillTiles.clear(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}cancel(){if(!this.busy){if(this.phase==="forecast"){this.backFromForecast();return}if(this.phase==="skillAim"){this.backFromSkill();return}if(this.phase==="itemAim"){this.backFromItem();return}if(this.inspect){this.inspect=null,this.syncUi();return}if(this.selected&&this.origin&&this.selected.movedThisTurn){this.selected.x=this.origin.x,this.selected.y=this.origin.y,this.selected.dir=this.originDir,this.selected.movedThisTurn=!1,this.origin=null,this.showCommand(this.selected);return}this.selected&&!this.locked()&&(this.clearSel(),this.phase="select",this.syncUi())}}armSkill(){const e=this.selected;if(!e||this.busy||e.skillUsed||!e.skillName||e.actedThisTurn||this.phase!=="select"&&this.phase!=="skillAim")return;const t=va(e,this.map,this.units);this.skillTiles=new Set(t.map(n=>Ke(n.x,n.y))),this.areaTiles=iu(e,this.map),this.areaKind="skill",this.actionTiles.clear(),this.moveTiles.clear(),this.forecast=null,this.inspect=null,this.phase="skillAim",this.log=e.skillHint,this.syncUi()}async wait(){!this.selected||this.busy||this.phase==="select"&&await this.finishUnit()}async confirm(){if(this.phase!=="forecast"||!this.forecast||this.busy)return;const e=this.forecast;this.busy=!0;const t=e.actor;if(e.kind==="object"&&e.objectId){const r=this.map.objects.find(a=>a.id===e.objectId);if(!r||r.gone){this.busy=!1,this.showCommand(t);return}if(t.dir=ts(t,r),t.anim="attack",t.animStart=performance.now(),t.lunge=1,et.play("attack"),await this.waitMs(or),r.hp=Math.max(0,r.hp-e.dmg),et.play("hit"),this.spawnFloat(t,`${e.dmg}`,"#ffd0d8"),this.log=`${t.name} 攻擊 ${r.label}`,t.atkBuff&&(t.atkBuff=0),r.hp<=0&&(r.gone=!0,this.log=`${r.label} 被破壞。`,r.type==="barrel"&&this.blastBarrel(r.x,r.y)),t.actedThisTurn=!0,t.lunge=0,t.anim="idle",await this.waitMs(ma),this.busy=!1,this.checkEnd())return;if(t.movedThisTurn){await this.finishUnit();return}this.forecast=null,this.showCommand(t),this.autosave();return}const n=e.target;n.stance==="neutral"&&!e.heal&&nl(n),t.dir=ts(t,n);const s=e.kind==="skill"&&(t.skillKind==="spark"||t.skillKind==="heal"||t.skillKind==="halt");if(t.anim=s?"cast":"attack",t.animStart=performance.now(),t.lunge=1,e.heal?et.play("heal"):et.play(e.kind==="skill"?"skill":"attack"),await this.waitMs(s?lr:or),e.heal?(n.hp=Math.min(n.maxHp,n.hp+e.heal),this.spawnFloat(n,`+${e.heal}`,"#7dffb3"),this.log=`${t.name} 為 ${n.name} 回復 ${e.heal}`):(n.hp=Math.max(0,n.hp-e.dmg),et.play("hit"),this.spawnFloat(n,`${e.dmg}`,"#ffd0d8"),this.log=`${t.name} 對 ${n.name} 造成 ${e.dmg} 傷害`,t.atkBuff&&(t.atkBuff=0),e.skip&&(n.skipNext=!0,this.log+="　攔住生效"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 倒下。`,this.tryEnemyDrop(n))),e.kind==="skill"&&(t.skillUsed=!0),t.actedThisTurn=!0,t.lunge=0,t.anim="idle",await this.waitMs(ma),this.busy=!1,!this.checkEnd()){if(t.movedThisTurn){await this.finishUnit();return}this.forecast=null,this.skillTiles.clear(),this.showCommand(t),this.autosave()}}async finishUnit(){if(this.busy=!0,this.selected&&(this.selected.acted=!0,this.selected.lunge=0),this.clearSel(),this.inspect=null,this.phase="select",this.syncUi(),await this.waitMs(ma),this.missionIndex===0&&!this.m1MidBeatPlayed&&this.mission.midBeats?.length){this.m1MidBeatPlayed=!0;for(const e of this.mission.midBeats)await this.showVn(e)}this.busy=!1,this.syncUi(),this.autosave(),this.units.filter(e=>e.team==="player"&&!e.dead&&!e.acted&&!e.npc).length===0&&await this.endTurn()}async endTurn(){if(!this.busy){for(const e of this.units)e.team==="player"&&!e.dead&&!e.npc&&(e.acted=!0);this.clearSel(),this.inspect=null,this.phase="enemy",this.log="敵軍行動中",this.syncUi(),await this.waitMs(ga),await this.runEnemy()}}async runEnemy(){this.busy=!0;const e=this.units.filter(n=>!n.dead&&!jh(n)),t=this.mission.protectId;for(let n=0;n<e.length;n++){const s=e[n];if(this.phase==="victory"||this.phase==="defeat")break;if(s.skipNext){s.skipNext=!1,s.acted=!0,this.log=`${s.name} 被攔住，無法行動。`,this.syncUi(),await this.waitMs(420),n<e.length-1&&await this.waitMs(ga);continue}const r=ru(s,this.map,this.units,t,this.intel);r.path.length>1&&(s.anim="walk",s.animStart=performance.now());for(let a=1;a<r.path.length;a++)s.x=r.path[a].x,s.y=r.path[a].y,await this.waitMs(Rc);if(r.path.length>1&&(s.dir=ts(r.path[r.path.length-2],r.path[r.path.length-1])),s.anim="idle",this.tryPickup(s),r.target&&!r.target.dead){s.dir=ts(s,r.target);const a=r.useSkill&&!s.skillUsed?il(s,r.target,this.map):ya(s,r.target,this.map),o=a.kind==="skill"&&(s.skillKind==="spark"||s.skillKind==="heal"||s.skillKind==="halt");if(s.anim=o?"cast":"attack",s.animStart=performance.now(),s.lunge=1,et.play(a.kind==="skill"?"skill":"attack"),await this.waitMs(o?lr:or),a.heal?(r.target.hp=Math.min(r.target.maxHp,r.target.hp+a.heal),this.spawnFloat(r.target,`+${a.heal}`,"#7dffb3"),this.log=`${s.name} 為 ${r.target.name} 回復 ${a.heal}`):(r.target.stance==="neutral"&&nl(r.target),r.target.hp=Math.max(0,r.target.hp-a.dmg),et.play("hit"),this.spawnFloat(r.target,`${a.dmg}`,"#ff4d6d"),this.log=`${s.name} 對 ${r.target.name} 造成 ${a.dmg} 傷害`,a.skip&&(r.target.skipNext=!0),r.target.hp<=0&&(r.target.dead=!0,this.log=`${r.target.name} 倒下。`,this.tryEnemyDrop(r.target))),a.kind==="skill"&&(s.skillUsed=!0),await this.waitMs(120),s.lunge=0,s.anim="idle",this.checkEnd()){this.busy=!1;return}}else await this.waitMs(80);s.acted=!0,n<e.length-1&&await this.waitMs(ga)}for(const n of this.units)n.acted=!1,n.skillUsed=!1,n.movedThisTurn=!1,n.actedThisTurn=!1,n.anim="idle";this.turn+=1,this.phase="select",this.busy=!1,this.log="我軍階段",this.syncUi(),this.autosave()}checkEnd(){const e=this.mission.protectId;return e&&this.units.find(s=>s.id===e)?.dead?(this.loseKind="protect",this.lose(),!0):this.units.find(n=>n.id===this.mission.eliteId)?.dead?(this.win(),!0):this.units.every(n=>n.team!=="player"||n.dead||n.npc)?(this.loseKind="wipe",this.lose(),!0):!1}win(){const e=this.mission;this.phase="victory",this.busy=!1,this.closePause(),et.setBgm(null),et.play("victory"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.remove("lose"),this.resultKicker.textContent="勝利",this.resultTitle.textContent=e.winTitle;let t=e.winBody;this.missionIndex===0&&!this.m1DropGiven&&(wr(this.inventory,"bandage",1),this.m1DropGiven=!0,t=`${e.winBody}　又找到一盒繃帶。`),this.resultBody.textContent=t,this.btnNext.hidden=this.missionIndex>=Ei.length-1,this.syncUi(),this.autosave()}lose(){const e=this.mission;this.phase="defeat",this.busy=!1,this.closePause(),et.setBgm(null),et.play("defeat"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.add("lose"),this.resultKicker.textContent="失敗",this.loseKind==="protect"?(this.resultTitle.textContent=e.protectLoseTitle,this.resultBody.textContent=e.protectLoseBody):(this.resultTitle.textContent=e.loseTitle,this.resultBody.textContent=e.loseBody),this.btnNext.hidden=!0,this.syncUi(),this.autosave()}unitAt(e,t){return this.units.find(n=>!n.dead&&n.x===e&&n.y===t)}tryPickup(e){const t=this.map.objAt(e.x,e.y);!t||t.gone||t.kind!=="pickup"||this.collectPickup(e,t)}tryPickupAt(e,t){const n=this.map.objects.find(s=>s.id===t.id);!n||n.gone||n.kind!=="pickup"||this.collectPickup(e,n)}collectPickup(e,t){const n=t.item??"bandage";wr(this.inventory,n,1)>0?(this.spawnFloat(e,`取得 ${Ti[n].name}`,"#ffe08a"),this.log=`${e.name} 取得 ${Ti[n].name}`):this.log="背包已滿。",t.gone=!0,this.syncUi(),this.autosave()}async useTrigger(e,t){if(!(this.busy||e.actedThisTurn||t.used)){this.busy=!0,e.anim="cast",e.animStart=performance.now(),et.play("skill"),await this.waitMs(lr),t.used=!0,t.type==="van"&&(t.gone=!0);for(const[n,s]of t.unblock)this.map.unblock(n,s);if(t.healAdj)for(const n of this.units)n.dead||Math.abs(n.x-t.x)+Math.abs(n.y-t.y)>1||n.stance!=="friendly"&&n.team!=="player"||(n.hp=Math.min(n.maxHp,n.hp+t.healAdj),this.spawnFloat(n,`+${t.healAdj}`,"#7dffb3"));if(this.log=t.type==="van"?"貨車門打開了。":"開關啟動。",e.actedThisTurn=!0,e.anim="idle",this.busy=!1,e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}blastBarrel(e,t){et.play("hit");for(const n of this.units)n.dead||Math.abs(n.x-e)+Math.abs(n.y-t)===1&&(n.hp=Math.max(0,n.hp-Rr),this.spawnFloat(n,`${Rr}`,"#ff9a3c"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 被爆炸波及。`,this.tryEnemyDrop(n)))}spawnFloat(e,t,n){this.floats.push({x:e.x,y:e.y,text:t,color:n,born:performance.now(),life:900})}tryEnemyDrop(e){if(e.team!=="enemy")return;const t=e.role==="elite"?.62:.35;if(Math.random()>=t)return;const s=(Math.random()<.65?"bandage":"stim")==="bandage"?["bandage","stim"]:["stim","bandage"];for(const r of s)if(wr(this.inventory,r,1)>0){this.spawnFloat(e,`掉落 ${Ti[r].name}`,"#ffe08a");return}}jumpToMission(e){e<0||e>=Ei.length||(this.pendingJump=null,this.inventory=Qt(wi),this.missionStartInventory=Qt(wi),this.m1DropGiven=!1,this.missionIndex=e,this.closePause(),this.closeModal(),this.result.hidden=!0,this.result.classList.remove("lose"),this.title.hidden=!0,this.briefing.hidden=!1,this.resetBattle(),this.phase="briefing",this.syncUi())}requestNextMission(){this.missionIndex>=Ei.length-1||this.busy||(this.pendingJump=this.missionIndex+1,this.confirmText.textContent="跳到測試關卡 "+String((this.pendingJump??0)+1)+"？目前戰鬥不會保留。",this.confirmEl.hidden=!1)}openPause(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||(this.paused=!0,this.pauseOpen=!0,this.pauseEl.hidden=!1,this.syncMuteBtn(),et.play("pause"))}closePause(){this.pauseEl.hidden=!0,this.pauseOpen=!1,this.paused=!1}toggleMute(){et.toggleMute(),this.syncMuteBtn()}syncMuteBtn(){this.btnMute.textContent=et.muted?"取消靜音":"靜音"}quitToTitle(){if(!(this.playable()||this.phase==="enemy")){this.goTitle();return}this.pendingQuit=!0,this.confirmText.textContent="返回標題？進度在存檔與自動存檔裡。",this.confirmEl.hidden=!1}goTitle(){this.pendingQuit=!1,this.closePause(),this.closeModal(),this.confirmEl.hidden=!0,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!0,this.title.hidden=!1,this.phase="title",this.busy=!1,this.clearSel(),this.inspect=null,et.setBgm("title"),this.refreshContinue(),this.syncUi()}async refreshApp(){const e=xe("btn-refresh");e.disabled=!0,e.textContent="正在更新…";try{if("caches"in window){const n=await caches.keys();await Promise.all(n.map(s=>caches.delete(s)))}}catch{}try{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations();for(const s of n){s.waiting&&s.waiting.postMessage("skipWaiting");try{await s.update()}catch{}s.waiting&&s.waiting.postMessage("skipWaiting"),await s.unregister()}}}catch{}const t=new URL(location.href);t.searchParams.set("v",Ac),t.searchParams.set("r",String(Date.now())),location.replace(t.toString())}playable(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"||this.phase==="itemAim"}openBagFromHud(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||this.openBag()}openBag(){this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind="bag",this.modal.hidden=!1,this.modalKicker.textContent="道具",this.modalTitle.textContent="背包",this.paintBag()}paintBag(){this.modalBody.innerHTML="";const e=this.playable()&&!!this.selected&&!this.selected.actedThisTurn&&!this.busy;if(!this.inventory.length){const t=document.createElement("p");t.textContent="沒有道具。",this.modalBody.appendChild(t);return}if(this.playable()&&!this.selected){const t=document.createElement("p");t.textContent="先選單位再用道具。",this.modalBody.appendChild(t)}for(const t of this.inventory){const n=Ti[t.id],s=document.createElement("div");s.className="item-row";const r=document.createElement("div"),a=document.createElement("b");a.textContent=`${n.name} ×${t.qty}`;const o=document.createElement("span");if(o.textContent=n.hint,r.append(a,o),s.appendChild(r),this.playable()){const l=document.createElement("button");l.type="button",l.className="use",l.dataset.item=t.id,l.textContent="使用",l.disabled=!e,s.appendChild(l)}this.modalBody.appendChild(s)}}openSaves(e){this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind=e,this.modal.hidden=!1,this.modalKicker.textContent=e==="save"?"存檔":"讀檔",this.modalTitle.textContent=e==="save"?"存檔":"讀檔",this.paintSaves()}paintSaves(){const e=oi();this.modalBody.innerHTML="";for(let t=0;t<Lh;t++){const n=e.slots[t],s=document.createElement("button");s.type="button",s.className=n?"slot":"slot empty",s.dataset.slot=String(t);const r=document.createElement("div"),a=document.createElement("b");a.textContent=`檔案 ${t+1}`;const o=document.createElement("span");o.textContent=n?`${n.missionName}　${Kx(n.savedAt)}`:"空",r.append(a,o),s.appendChild(r),this.modalBody.appendChild(s)}}onModalClick(e){const t=e.target,n=t.closest("button.use");if(n&&this.modalKind==="bag"){const a=n.dataset.item;(a==="bandage"||a==="stim")&&this.armItem(a);return}const s=t.closest("button.ally-row");if(s&&this.modalKind==="target"){const a=s.dataset.uid,o=this.units.find(l=>l.id===a);o&&this.applyItem(o);return}const r=t.closest("button.slot");if(r&&(this.modalKind==="save"||this.modalKind==="load")){const a=Number(r.dataset.slot);this.modalKind==="load"?this.loadSlot(a):this.trySaveSlot(a)}}armItem(e){const t=this.selected;if(!t||t.actedThisTurn||this.busy){this.log="先選單位再用道具。",this.syncUi();return}this.pendingItem=e,this.closePause(),this.closeModal(),this.inspect=null,this.forecast=null,this.moveTiles.clear(),this.actionTiles.clear(),this.areaTiles.clear(),this.areaKind="item";const n=Ar(this.units);this.skillTiles=new Set(n.map(s=>Ke(s.x,s.y))),this.phase="itemAim",this.log=`${Ti[e].name}　選我軍單位`,this.syncUi(),this.modalKind="target",this.modal.hidden=!1,this.modalKicker.textContent=Ti[e].name,this.modalTitle.textContent="選擇對象",this.modalBody.innerHTML="";for(const s of n){const r=document.createElement("button");r.type="button",r.className="ally-row",r.dataset.uid=s.id;const a=document.createElement("div"),o=document.createElement("b");o.textContent=s.name;const l=document.createElement("span");l.textContent=`生命 ${s.hp}/${s.maxHp}`,a.append(o,l),r.appendChild(a),this.modalBody.appendChild(r)}}async applyItem(e){const t=this.selected,n=this.pendingItem;if(!(!t||!n||t.actedThisTurn||this.busy)&&Ar(this.units).some(s=>s.id===e.id)&&du(this.inventory,n)){if(this.closeModal(),this.busy=!0,et.play("heal"),n==="bandage"){const s=Math.min(sl,e.maxHp-e.hp);e.hp=Math.min(e.maxHp,e.hp+sl),this.spawnFloat(e,`+${Math.max(s,0)}`,"#7dffb3"),this.log=`${t.name} 對 ${e.name} 使用繃帶`}else e.atkBuff=uu,this.spawnFloat(e,"+ATK","#ffc857"),this.log=`${t.name} 對 ${e.name} 使用提神　下次攻擊 +5`;if(t.actedThisTurn=!0,this.pendingItem=null,this.skillTiles.clear(),await this.waitMs(220),this.busy=!1,t.movedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}}closeModal(){this.modal.hidden=!0,this.modalKind="off",this.modalBody.innerHTML="",this.pauseOpen&&(this.pauseEl.hidden=!1)}trySaveSlot(e){if(oi().slots[e]){this.pendingSlot=e,this.confirmText.textContent=`覆蓋檔案 ${e+1}？`,this.confirmEl.hidden=!1;return}this.writeSlot(e)}confirmYes(){if(this.confirmEl.hidden=!0,this.pendingQuit){this.pendingQuit=!1,this.goTitle();return}if(this.pendingJump!==null){const e=this.pendingJump;this.pendingJump=null,this.jumpToMission(e);return}this.pendingSlot!==null&&this.writeSlot(this.pendingSlot),this.pendingSlot=null}confirmNo(){this.confirmEl.hidden=!0,this.pendingSlot=null,this.pendingQuit=!1,this.pendingJump=null}writeSlot(e){const t=oi();t.slots[e]=this.captureSave(),Tc(t),this.pendingSlot=null,this.log=`已存到檔案 ${e+1}`,this.closeModal(),this.refreshContinue(),this.syncUi()}loadSlot(e){const n=oi().slots[e];n&&(this.closeModal(),this.closePause(),this.applySave(n))}captureSave(){const e=this.playable()||this.phase==="enemy";return{v:1,savedAt:Date.now(),missionIndex:this.missionIndex,missionName:e?`${this.mission.number}　戰鬥中`:this.mission.number,phase:this.phase==="enemy"||this.phase==="itemAim"||this.phase==="skillAim"||this.phase==="forecast"?"select":this.phase,turn:this.turn,intel:this.intel,power:this.power,inventory:Qt(this.inventory),units:this.units.map(t=>this.packUnit(t)),cam:{...this.renderer.cam},yaw:this.renderer.yaw,pitch:this.renderer.pitch,log:this.log,selectedId:this.selected&&e?this.selected.id:null,origin:this.origin?{...this.origin}:null,originDir:this.originDir,m1DropGiven:this.m1DropGiven,missionStartInventory:Qt(this.missionStartInventory),objects:this.map.objects.map(t=>({id:t.id,hp:t.hp,gone:t.gone,used:t.used}))}}packUnit(e){return{id:e.id,x:e.x,y:e.y,hp:e.hp,maxHp:e.maxHp,atk:e.atk,def:e.def,dir:e.dir,acted:e.acted,skillUsed:e.skillUsed,skipNext:e.skipNext,dead:e.dead,movedThisTurn:e.movedThisTurn,actedThisTurn:e.actedThisTurn,atkBuff:e.atkBuff,team:e.team,stance:e.stance,behaviour:e.behaviour,archetype:e.archetype,gender:e.gender,skillKind:e.skillKind,rangeMin:e.rangeMin,rangeMax:e.rangeMax}}applySave(e){if(this.missionIndex=e.missionIndex,this.intel=e.intel,this.power=e.power,this.inventory=Qt(e.inventory),this.missionStartInventory=Qt(e.missionStartInventory??e.inventory),this.m1DropGiven=e.m1DropGiven,this.turn=e.turn,this.log=e.log,this.setSeg("seg-intel",e.intel),this.setSeg("seg-power",e.power),this.map=new Cr(this.mission.map),e.objects)for(const r of e.objects){const a=this.map.objects.find(o=>o.id===r.id);if(a&&(a.hp=r.hp,a.gone=r.gone,a.used=r.used,a.used)){for(const[o,l]of a.unblock)this.map.unblock(o,l);a.type==="van"&&(a.gone=!0)}}const t=[...Qo(this.mission.starts),...this.mission.makeOthers()],n=new Map(t.map(r=>[r.id,r]));this.units=[];for(const r of e.units){const a=n.get(r.id);a&&this.units.push({...a,...r})}this.renderer.cam={...e.cam},this.renderer.yaw=e.yaw,this.renderer.setPitch(e.pitch??xs),this.yawSlider.value=String(Math.round((e.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*100)),this.pitchSlider.value=String(Math.round(this.renderer.pitch)),this.clearSel(),this.inspect=null,this.busy=!1,this.pendingItem=null,this.fillBriefing(),this.result.hidden=!0,this.result.classList.remove("lose"),this.confirmEl.hidden=!0;const s=e.phase;if(this.phase=s,s==="title")this.title.hidden=!1,this.briefing.hidden=!0;else if(s==="briefing")this.title.hidden=!0,this.briefing.hidden=!1;else if(s==="victory"||s==="defeat")this.title.hidden=!0,this.briefing.hidden=!0,this.result.hidden=!1,s==="defeat"&&this.result.classList.add("lose");else if(this.title.hidden=!0,this.briefing.hidden=!0,this.phase="select",e.selectedId){const r=this.units.find(a=>a.id===e.selectedId);r&&!r.dead&&!r.acted&&!r.npc&&(this.selected=r,this.origin=e.origin,this.originDir=e.originDir,this.refreshRanges(r))}this.closePause(),this.phase==="title"||this.phase==="briefing"?et.setBgm("title"):this.phase==="victory"||this.phase==="defeat"?et.setBgm(null):et.setBgm("battle"),this.refreshContinue(),this.syncUi()}setSeg(e,t){const n=xe(e);for(const s of n.querySelectorAll("button"))s.classList.toggle("on",s.getAttribute("data-v")===t)}autosave(){if(this.phase==="title")return;const e=oi();e.autosave=this.captureSave(),Tc(e),this.refreshContinue()}refreshContinue(){this.btnContinue.disabled=!wc(oi())}paintUnitChip(e,t){this.chip.hidden=!1,this.chipHp.hidden=!1;const n=`${Cc[Qn(e)]}${e.npc?"　保護":""}`;this.chipName.textContent=`${e.name}　${e.title}`;const s=e.atkBuff?`　攻擊+${e.atkBuff}`:"";this.chipMeta.textContent=`${n}　${Qx[e.role]}　生命 ${e.hp}/${e.maxHp}　攻擊 ${e.atk}　防禦 ${e.def}　移動 ${e.mov}　跳躍 ${e.jmp}${s}`,this.chipHpFill.style.width=`${100*e.hp/e.maxHp}%`,this.chipMark.style.background=Lc(e),e.skillName?(this.chipExtra.hidden=!1,this.chipExtra.textContent=`${e.skillName}　${e.skillHint}`):(this.chipExtra.hidden=!t,this.chipExtra.textContent=t?"無技能":"",t||(this.chipExtra.hidden=!0))}paintObjectChip(e){const t=this.map.objects.find(s=>s.id===e);if(this.chip.hidden=!1,!t){this.chip.hidden=!0;return}this.chipHp.hidden=t.kind!=="destructible",this.chipName.textContent=t.label;const n=t.kind==="pickup"?"拾取":t.kind==="trigger"?"啟動":t.kind==="destructible"?"可破壞":"可站上";this.chipMeta.textContent=`${n}　${t.used?"已使用":"未使用"}`,t.kind==="destructible"&&(this.chipHpFill.style.width=`${100*t.hp/t.maxHp}%`),this.chipExtra.hidden=!1,this.chipExtra.textContent=t.kind==="pickup"?"靠近或走到此格可放入背包。":t.kind==="trigger"?"相鄰時可啟動。消耗行動。":t.kind==="destructible"?"攻擊可破壞。油桶爆炸會波及鄰格。":"走到此格可站上，高度較高。",this.chipMark.style.background=t.kind==="destructible"?"#ff4d6d":"#ffc857"}paintTileChip(e){this.chip.hidden=!1,this.chipHp.hidden=!0,this.chipName.textContent=xa[e.terrain];const t=[`高度 ${e.h}`,e.blocked?"阻擋":"可走",xa[e.terrain]];e.prop&&t.push(jx[e.prop]),this.chipMeta.textContent=t.join("　"),this.chipExtra.hidden=!1,this.chipExtra.textContent=e.blocked?"無法站上此格。":"可以走。",this.chipMark.style.background=e.blocked?"#ff4d6d":"#3ef0d0"}syncUi(){this.hudTurn.textContent=`回合 ${this.turn}`,this.hudPhase.textContent=this.phase==="enemy"?"敵軍":this.phase==="victory"?"勝利":this.phase==="defeat"?"失敗":this.phase==="title"?"選單":"我軍",this.hudSub.textContent=`${this.mission.hudSub}　智 ${el[this.intel]}　力 ${el[this.power]}`,this.logEl.textContent=this.log;const e=this.playable(),t=this.selected;if(this.inspect&&e?this.inspect.kind==="unit"?this.paintUnitChip(this.inspect.unit,!0):this.inspect.kind==="object"?this.paintObjectChip(this.inspect.id):this.paintTileChip(this.inspect.tile):t&&e?this.paintUnitChip(t,!1):this.chip.hidden=!0,this.forecast&&this.phase==="forecast"){this.forecastEl.hidden=!1;const l=this.forecast.heal?"good":"bad";this.forecastEl.innerHTML=`<div><b>${this.forecast.label}</b></div><div class="${l}">${this.forecast.detail}</div><div>點確認出手，取消返回。</div>`}else this.forecastEl.hidden=!0;const n=!!t&&this.phase==="select";this.btnCancel.disabled=!t&&!this.inspect&&this.phase!=="itemAim"||this.phase==="enemy"||this.busy,this.btnWait.disabled=!n||this.busy,this.btnWait.textContent=t&&(t.movedThisTurn||t.actedThisTurn)?"結束":"待機",this.btnSkill.disabled=!t||!t.skillName||t.skillUsed||t.actedThisTurn||this.busy||this.phase!=="select"&&this.phase!=="skillAim",this.btnSkill.classList.toggle("armed",this.phase==="skillAim"),this.btnConfirm.disabled=this.phase!=="forecast"||this.busy;const s=this.units.some(l=>l.team==="player"&&!l.dead&&!l.acted&&!l.npc),r=this.phase==="enemy"||this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat",a=this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat"||this.vnOpen;this.btnEnd.hidden=!s||r,this.btnRotate.hidden=r,this.btnPause.hidden=a,this.btnBag.hidden=a,this.camHint.hidden=r;const o=window.matchMedia("(pointer: fine)").matches;this.yawSlider.hidden=r||!o,this.pitchSlider.hidden=r||!o,this.pitchSlider.value=String(Math.round(this.renderer.pitch)),this.refreshContinue()}}const Dh=document.getElementById("board");if(!(Dh instanceof HTMLCanvasElement))throw new Error("board");document.addEventListener("pointerdown",()=>{et.unlock()},{capture:!0});document.addEventListener("click",i=>{i.target.closest("button")&&et.play("ui")},!0);const Uh=new e_(Dh);Uh.applyHash();Uh.start();const t_=location.search.includes("shot");"serviceWorker"in navigator&&!t_&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})});
