var Yd=Object.defineProperty;var $d=(s,e,t)=>e in s?Yd(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var K=(s,e,t)=>$d(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const Eu="yejie-mute";function Jd(){try{return localStorage.getItem(Eu)==="1"}catch{return!1}}class Zd{constructor(){K(this,"muted",Jd());K(this,"ctx",null);K(this,"master",null);K(this,"sfxGain",null);K(this,"bgmGain",null);K(this,"unlocked",!1);K(this,"wanted",null);K(this,"playing",null);K(this,"timer",0);K(this,"beat",0)}unlock(){if(this.unlocked&&this.ctx&&this.ctx.state==="running")return;const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx||(this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.32,this.master.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.7,this.sfxGain.connect(this.master),this.bgmGain=this.ctx.createGain(),this.bgmGain.gain.value=this.muted?0:.22,this.bgmGain.connect(this.master)),this.ctx.resume(),this.unlocked=!0,this.applyMute(),this.wanted&&this.setBgm(this.wanted))}setMuted(e){this.muted=e;try{localStorage.setItem(Eu,e?"1":"0")}catch{}this.applyMute()}toggleMute(){return this.setMuted(!this.muted),this.muted}applyMute(){this.sfxGain&&(this.sfxGain.gain.value=this.muted?0:.7),this.bgmGain&&(this.bgmGain.gain.value=this.muted?0:.22)}play(e){if(this.unlock(),!this.ctx||!this.sfxGain||this.muted)return;const t=this.ctx.currentTime;switch(e){case"ui":this.blip(880,.045,.11,"sine",t);break;case"move":this.noise(.05,.06,t,900),this.blip(180,.06,.08,"triangle",t);break;case"attack":this.noise(.1,.1,t,700),this.sweep(420,160,.12,.12,t);break;case"hit":this.blip(140,.09,.16,"square",t),this.noise(.08,.12,t,400);break;case"miss":this.sweep(480,220,.14,.07,t),this.blip(210,.1,.05,"sine",t+.04);break;case"skill":this.blip(520,.08,.1,"square",t),this.blip(780,.1,.1,"sine",t+.06),this.blip(1040,.12,.08,"sine",t+.12);break;case"heal":this.blip(392,.1,.09,"sine",t),this.blip(494,.12,.1,"sine",t+.08),this.blip(587,.16,.1,"sine",t+.16);break;case"victory":this.blip(523,.14,.12,"square",t),this.blip(659,.16,.12,"square",t+.12),this.blip(784,.28,.14,"square",t+.24);break;case"defeat":this.blip(330,.18,.12,"sawtooth",t),this.blip(247,.22,.12,"sawtooth",t+.16),this.blip(165,.4,.14,"sine",t+.32);break;case"pause":this.blip(220,.1,.08,"triangle",t),this.blip(165,.16,.08,"triangle",t+.1);break}}setBgm(e){if(this.wanted=e,e===this.playing||(this.stopBgm(),this.playing=e,!e||!this.unlocked||!this.ctx))return;this.beat=0;const t=e==="battle"?280:520,n=()=>{if(this.playing!==e||!this.ctx||!this.bgmGain)return;const i=this.ctx.currentTime;e==="title"?this.titleBeat(i):this.battleBeat(i),this.beat+=1,this.timer=window.setTimeout(n,t)};n()}stopBgm(){this.timer&&(window.clearTimeout(this.timer),this.timer=0),this.playing=null}titleBeat(e){const t=this.beat%8,n=[110,0,82,0,110,0,98,0][t];n&&this.tone(this.bgmGain,n,.46,.045,"sine",e),(t===0||t===4)&&this.tone(this.bgmGain,220,.4,.02,"triangle",e),t===6&&this.tone(this.bgmGain,329,.28,.018,"sine",e)}battleBeat(e){const t=this.beat%8;t%2===0?this.sweepTo(this.bgmGain,90,42,.12,.1,e):this.noiseTo(this.bgmGain,.04,.025,e,1800);const i=[0,196,0,233,0,196,175,0][t];i&&this.tone(this.bgmGain,i,.18,.035,"square",e)}blip(e,t,n,i,r){this.sfxGain&&this.tone(this.sfxGain,e,t,n,i,r)}sweep(e,t,n,i,r){this.sfxGain&&this.sweepTo(this.sfxGain,e,t,n,i,r)}noise(e,t,n,i){this.sfxGain&&this.noiseTo(this.sfxGain,e,t,n,i)}tone(e,t,n,i,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type=r,o.frequency.setValueAtTime(t,a),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(i,a+.012),l.gain.exponentialRampToValueAtTime(1e-4,a+n),o.connect(l),l.connect(e),o.start(a),o.stop(a+n+.02)}sweepTo(e,t,n,i,r,a){if(!this.ctx)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sine",o.frequency.setValueAtTime(t,a),o.frequency.exponentialRampToValueAtTime(Math.max(20,n),a+i),l.gain.setValueAtTime(1e-4,a),l.gain.exponentialRampToValueAtTime(r,a+.01),l.gain.exponentialRampToValueAtTime(1e-4,a+i),o.connect(l),l.connect(e),o.start(a),o.stop(a+i+.02)}noiseTo(e,t,n,i,r){if(!this.ctx)return;const a=2048,o=this.ctx.createBuffer(1,a,this.ctx.sampleRate),l=o.getChannelData(0);for(let d=0;d<a;d++)l[d]=Math.random()*2-1;const c=this.ctx.createBufferSource();c.buffer=o;const h=this.ctx.createBiquadFilter();h.type="lowpass",h.frequency.value=r;const u=this.ctx.createGain();u.gain.setValueAtTime(1e-4,i),u.gain.exponentialRampToValueAtTime(n,i+.008),u.gain.exponentialRampToValueAtTime(1e-4,i+t),c.connect(h),h.connect(u),u.connect(e),c.start(i),c.stop(i+t+.02)}}const it=new Zd;function Qd(s,e){return s==="mara"||s==="dana"||s==="priya"||s==="hale"||s==="crosby"||s==="beckett"?s:e==="civilian"?"official":e==="worker"?"worker":e==="delinquent"||e==="magician"||e==="wolverine"||e==="boxer"||e==="gunner"?e:e==="elite"?"crosby":"delinquent"}function jd(s,e){return e?s==="striker"?"strike":s==="controller"?"halt":s==="support"?"heal":s==="delinquent"?"slash":s==="magician"?"spark":s==="wolverine"?"pounce":s==="boxer"?"hook":s==="gunner"?"shot":"":""}function Ct(s){const e=s.team,t=s.stance??(e==="player"?"friendly":e==="neutral"?"neutral":"hostile"),n=s.npc??!1,i=s.behaviour??(n?"idle":"combat"),r=s.archetype??Qd(s.id,s.role),a=s.skillKind??jd(s.role,s.skillName),o=a==="spark"||a==="shot"||s.role==="gunner"||s.role==="magician";return{acted:s.acted??!1,skillUsed:!1,skipNext:!1,dead:!1,lunge:0,dir:s.dir??0,movedThisTurn:!1,actedThisTurn:!1,npc:n,atkBuff:s.atkBuff??0,archetype:r,stance:t,behaviour:i,gender:s.gender??"m",skillKind:a,rangeMin:s.rangeMin??(s.role==="gunner"?2:1),rangeMax:s.rangeMax??(o?(s.role==="gunner",3):1),anim:"idle",animStart:0,...s}}function Ec(s){return[Ct({id:"mara",name:"Mara Ellison",title:"警員",team:"player",role:"striker",archetype:"mara",gender:"f",x:s[0]?.x??3,y:s[0]?.y??11,hp:44,maxHp:44,atk:16,def:5,mov:5,jmp:2,dir:0,skillName:"重擊",skillHint:"近身重擊，傷害較高，也可以打更高的高度差。",skillKind:"strike"}),Ct({id:"dana",name:"Dana Ruiz",title:"搭檔",team:"player",role:"controller",archetype:"dana",gender:"f",x:s[1]?.x??4,y:s[1]?.y??11,hp:40,maxHp:40,atk:10,def:8,mov:4,jmp:1,dir:0,skillName:"攔住",skillHint:"讓目標下一回合無法行動，並造成少量傷害。",skillKind:"halt"}),Ct({id:"priya",name:"Priya Shah",title:"急救員",team:"player",role:"support",archetype:"priya",gender:"f",x:s[2]?.x??5,y:s[2]?.y??11,hp:38,maxHp:38,atk:8,def:7,mov:4,jmp:1,dir:0,skillName:"包紮",skillHint:"治療相鄰的友軍，也可以用在自己身上。",skillKind:"heal"})]}function $i(s,e,t,n,i,r="m"){return Ct({id:s,name:e,title:"街頭",team:"enemy",role:"delinquent",archetype:"delinquent",gender:r,x:t,y:n,hp:22,maxHp:22,atk:10,def:3,mov:4,jmp:1,dir:i,skillName:"揮砍",skillHint:"近身揮砍，傷害較高。",skillKind:"slash"})}function Na(s,e,t,n,i,r="m"){return Ct({id:s,name:e,title:"拳手",team:"enemy",role:"boxer",archetype:"boxer",gender:r,x:t,y:n,hp:26,maxHp:26,atk:15,def:4,mov:3,jmp:1,dir:i,skillName:"勾拳",skillHint:"近身重拳，傷害很高，距離短。",skillKind:"hook",rangeMin:1,rangeMax:1})}function Fs(s,e,t,n,i,r="m"){return Ct({id:s,name:e,title:"槍手",team:"enemy",role:"gunner",archetype:"gunner",gender:r,x:t,y:n,hp:20,maxHp:20,atk:11,def:3,mov:4,jmp:1,dir:i,skillName:"點射",skillHint:"遠距點射，想保持距離。",skillKind:"shot",rangeMin:2,rangeMax:3})}function Ac(s,e,t,n,i,r="f"){return Ct({id:s,name:e,title:"術者",team:"enemy",role:"magician",archetype:"magician",gender:r,x:t,y:n,hp:24,maxHp:24,atk:12,def:3,mov:3,jmp:1,dir:i,skillName:"閃火",skillHint:"遠距閃火，看起來像煙火。",skillKind:"spark",rangeMin:1,rangeMax:3})}function ef(s,e,t,n,i,r="m"){return Ct({id:s,name:e,title:"爪獸",team:"enemy",role:"wolverine",archetype:"wolverine",gender:r,x:t,y:n,hp:28,maxHp:28,atk:15,def:2,mov:5,jmp:2,dir:i,skillName:"撲擊",skillHint:"衝近撲擊。現場會說那是動物。",skillKind:"pounce",rangeMin:1,rangeMax:1})}const Ji=[{id:"m1",number:"任務 01",loc:"國王碼頭夜市・屋頂",hudSub:"國王碼頭夜市",paragraphs:["屋頂風很大。柏油上三個白圈，空的。街道被標得像棋盤——他們本來就不打算讓目擊者走掉。"],voices:[{name:"Mara",line:"屋頂不對勁。不是穿制服的。巷口粉筆記號又近了一格——跟週二同一隻手。"},{name:"Dana",line:"上去。樓梯我先走。你看到了再喊。"},{name:"Priya",line:"街上要是還有傷患，我不走。棋盤再急，也不能拿活人當棋子。"}],midBeats:[{speaker:"Mara",side:"left",text:"粉筆灰還沒被風吹散。有人剛從這裡下去。"}],winCond:"擊敗 Crosby",loseCond:"三人全部倒下",winTitle:"現場結束了。",winBody:"Crosby 倒下。其餘的人散了。市場還開著。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。屋頂上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。屋頂上的人還在。",map:{w:10,h:12,theme:"roof",heights:["2222222222","2222112222","2211001122","0011111100","0000000000","0000000000","2200000022","2200000022","2110000112","0000000000","0000000000","0000000000"],blocked:[[1,0,"ac"],[8,0,"ac"],[0,7,"ac"],[9,7,"ac"],[2,5,"stall"],[3,5,"stall"],[6,5,"stall"],[7,5,"stall"],[4,9,"stall"],[5,9,"stall"],[1,4,"stall"],[8,4,"stall"]],lamps:[[4,4],[0,9],[9,9]],objects:[{x:2,y:10,type:"kit",item:"bandage"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"crosby",makeOthers:()=>[Ct({id:"crosby",name:"Crosby",title:"現場主管",team:"enemy",role:"elite",archetype:"crosby",gender:"m",x:5,y:0,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),$i("e1","Neil",2,1,2,"m"),$i("e2","Cole",7,1,2,"f"),Na("e3","Nash",0,6,1,"m"),Fs("e4","Pike",4,3,2,"m")]},{id:"m2",number:"任務 02",loc:"國王碼頭後巷・貨台",hudSub:"國王碼頭後巷",paragraphs:["後巷報了槍擊。無線電當它是幫派互打。Mara、Dana、Priya 被派去，因為這是夜班的槍擊案，不是因為有人點名。三人傷勢已處理，生命已回復。","現場其實是 Assembly 在換掉當地那一組人，也要處理一個真正管港口執照的人。Deputy Harbour Chief Rowan Hale 人還在貨台上。他們先動手換幫派，所以看起來還是街頭那套。"],voices:[{name:"Mara",line:"後巷有槍聲。當幫派打。"},{name:"Dana",line:"我們是最近的一組。"},{name:"Priya",line:"有人倒在貨台邊上。"}],winCond:"擊敗 Beckett，Hale 須仍在",loseCond:"三人全部倒下，或 Rowan Hale 倒下",winTitle:"槍聲停了。",winBody:"Beckett 停手了。Hale 還活著。這條巷子暫時安靜。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。巷子裡的人還在。",protectLoseTitle:"Rowan Hale 倒下。",protectLoseBody:"港口執照那條線斷了。現場的人還沒走。",map:{w:10,h:12,theme:"alley",heights:["2220002222","2210001222","2200000122","0000000000","0001111000","2200000112","2200000012","0000000000","2210000222","2200000022","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,0,"ac"],[0,10,"ac"],[9,8,"ac"],[5,8,"crate"],[2,9,"crate"],[6,6,"crate"],[7,6,"crate"]],lamps:[[3,3],[4,10],[8,5]],objects:[{x:3,y:8,type:"pallet"},{x:8,y:4,type:"barrel"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"beckett",protectId:"hale",makeOthers:()=>[Ct({id:"hale",name:"Rowan Hale",title:"副港務長",team:"player",role:"civilian",archetype:"hale",gender:"m",x:4,y:9,hp:34,maxHp:34,atk:0,def:6,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ct({id:"beckett",name:"Beckett",title:"現場主管",team:"enemy",role:"elite",archetype:"beckett",gender:"m",x:8,y:1,hp:48,maxHp:48,atk:14,def:6,mov:4,jmp:2,dir:2,skillName:"",skillHint:""}),Fs("e1","Drake",5,2,2,"m"),$i("e2","Quinn",1,4,1,"f"),Na("e3","Moss",7,5,2,"m"),$i("e4","Reed",8,7,3,"m")]},{id:"m3",number:"任務 03",loc:"國王碼頭倉庫・碼頭",hudSub:"國王碼頭倉庫",paragraphs:["槍擊過後，Assembly 回來清場。倉庫裡還有看太多的碼頭工人。無線電仍當它是貨物失竊。","現場主管是 Vance。工人 Sam Ortiz 還在棧板上。他們要滅口，不是搶貨。"],voices:[{name:"Mara",line:"倉庫有人。不是小偷。"},{name:"Dana",line:"工人還在裡面。"},{name:"Priya",line:"我先看傷。"}],winCond:"擊敗 Vance，Ortiz 須仍在",loseCond:"三人全部倒下，或 Sam Ortiz 倒下",winTitle:"倉庫靜了。",winBody:"Vance 停手。Ortiz 還活著。碼頭外面仍有夜班吊車。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。倉庫裡的人還在。",protectLoseTitle:"Sam Ortiz 倒下。",protectLoseBody:"目擊者沒了。現場的人還沒走。",map:{w:10,h:12,theme:"warehouse",heights:["2222200000","2211100000","2200000112","0000000112","0001110000","2200000022","2200000022","0000000000","0011111000","0000000000","0000000000","0000000000"],blocked:[[0,0,"ac"],[9,2,"ac"],[0,5,"crate"],[9,6,"crate"],[3,7,"crate"],[4,2,"crate"],[5,2,"crate"]],lamps:[[2,3],[7,8],[1,10]],objects:[{x:1,y:8,type:"kit",item:"stim"},{x:5,y:8,type:"pallet"},{x:6,y:4,type:"barrel"},{x:2,y:4,type:"switch",unblock:[[4,2],[5,2]]},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"vance",protectId:"ortiz",makeOthers:()=>[Ct({id:"ortiz",name:"Sam Ortiz",title:"碼頭工人",team:"player",role:"worker",archetype:"worker",gender:"m",x:4,y:8,hp:28,maxHp:28,atk:0,def:4,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ct({id:"w1",name:"Gina Pell",title:"碼頭工人",team:"neutral",role:"worker",archetype:"worker",gender:"f",stance:"neutral",behaviour:"flee",npc:!0,x:1,y:6,hp:20,maxHp:20,atk:0,def:2,mov:3,jmp:1,dir:1,skillName:"",skillHint:""}),Ct({id:"vance",name:"Vance",title:"現場主管",team:"enemy",role:"elite",archetype:"boxer",gender:"m",x:6,y:1,hp:50,maxHp:50,atk:15,def:6,mov:4,jmp:2,dir:2,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook"}),Fs("e1","Kira",8,2,2,"f"),$i("e2","Dunn",2,2,2,"m"),Na("e3","Wade",7,5,3,"m")]},{id:"m4",number:"任務 04",loc:"國王碼頭東街・換手",hudSub:"國王碼頭東街",paragraphs:["街上還有本地那一組人。Assembly 要換掉他們。看起來像幫派互打，三方都在場。","本地的人沒有先打你。Assembly 的現場主管是 Inez。贏的條件是她倒下。不必清掉整條街。"],voices:[{name:"Mara",line:"兩邊都有人。不要先打錯邊。"},{name:"Dana",line:"本地的人在看我們。"},{name:"Priya",line:"打到他們，他們就會打回來。"}],winCond:"擊敗 Inez。本地組不必全滅",loseCond:"三人全部倒下",winTitle:"東街暫時停了。",winBody:"Inez 倒下。本地的人沒有再往前。換手沒做完。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。街上的人還在。",protectLoseTitle:"三個人都倒下了。",protectLoseBody:"沒人能繼續。街上的人還在。",map:{w:10,h:12,theme:"street",heights:["0000222000","0000222000","1100000011","0000000000","2200000022","0001111000","0000000000","2200000022","0000000000","1100000011","0000000000","0000000000"],blocked:[[0,4,"ac"],[9,4,"ac"],[0,7,"stall"],[9,7,"stall"],[3,5,"stall"]],lamps:[[2,2],[7,6],[4,9]],objects:[{x:1,y:9,type:"kit",item:"bandage"},{x:6,y:8,type:"pallet"},{x:2,y:5,type:"barrel"},{x:8,y:3,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"inez",makeOthers:()=>[Ct({id:"inez",name:"Inez",title:"現場主管",team:"enemy",role:"elite",archetype:"gunner",gender:"f",x:5,y:0,hp:46,maxHp:46,atk:13,def:5,mov:4,jmp:2,dir:2,skillName:"點射",skillHint:"遠距點射。",skillKind:"shot",rangeMin:2,rangeMax:3}),Ac("e1","Lyle",2,1,2,"m"),$i("e2","Rosa",7,1,2,"f"),Fs("e3","Chen",8,5,3,"m"),Ct({id:"g1",name:"Marty",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"combat",x:1,y:3,hp:20,maxHp:20,atk:9,def:3,mov:4,jmp:1,dir:1,skillName:"揮砍",skillHint:"近身揮砍。",skillKind:"slash",npc:!0}),Ct({id:"g2",name:"Bea",title:"本地組",team:"neutral",role:"boxer",archetype:"boxer",gender:"f",stance:"neutral",behaviour:"combat",x:2,y:6,hp:22,maxHp:22,atk:12,def:3,mov:3,jmp:1,dir:0,skillName:"勾拳",skillHint:"近身重拳。",skillKind:"hook",npc:!0}),Ct({id:"g3",name:"Oz",title:"本地組",team:"neutral",role:"delinquent",archetype:"delinquent",gender:"m",stance:"neutral",behaviour:"indiscriminate",x:8,y:2,hp:16,maxHp:16,atk:8,def:2,mov:3,jmp:1,dir:3,skillName:"",skillHint:"",npc:!0})]},{id:"m5",number:"任務 05",loc:"港務大樓前・廣場",hudSub:"港務廣場",paragraphs:["Assembly 改打真正有權的人。Port Authority Director Marla Keene 今晚還在廣場側門。無線電會寫成動物與煙火。","現場有術者和爪獸。主管是 Holt。Keene 必須活著。"],voices:[{name:"Mara",line:"這不是街頭那套了。"},{name:"Dana",line:"那邊有人往官員走。"},{name:"Priya",line:"先護人。"}],winCond:"擊敗 Holt，Keene 須仍在",loseCond:"三人全部倒下，或 Marla Keene 倒下",winTitle:"廣場上的人散了。",winBody:"Holt 停手。Keene 還活著。報告會寫煙火與走失的動物。",loseTitle:"三個人都倒下了。",loseBody:"沒人能繼續。廣場上的人還在。",protectLoseTitle:"Marla Keene 倒下。",protectLoseBody:"真正管港口的那條線斷了。",map:{w:10,h:12,theme:"plaza",heights:["2222222222","2211111122","2200000022","0000000000","0001111000","2200000022","0000000000","0011111100","0000000000","2200000022","0000000000","0000000000"],blocked:[[0,5,"ac"],[9,5,"ac"],[1,1,"ac"],[8,1,"ac"],[4,2,"crate"],[5,2,"crate"]],lamps:[[3,3],[6,6],[2,9]],objects:[{x:6,y:10,type:"kit",item:"bandage"},{x:3,y:7,type:"pallet"},{x:7,y:4,type:"barrel"},{x:1,y:4,type:"van",unblock:[[4,2],[5,2]]},{x:8,y:8,type:"crate"}]},starts:[{x:3,y:11},{x:4,y:11},{x:5,y:11}],eliteId:"holt",protectId:"keene",makeOthers:()=>[Ct({id:"keene",name:"Marla Keene",title:"港務總監",team:"player",role:"civilian",archetype:"official",gender:"f",x:4,y:9,hp:32,maxHp:32,atk:0,def:5,mov:0,jmp:0,dir:0,skillName:"",skillHint:"",npc:!0,acted:!0,behaviour:"idle"}),Ct({id:"holt",name:"Holt",title:"現場主管",team:"enemy",role:"elite",archetype:"magician",gender:"m",x:5,y:0,hp:52,maxHp:52,atk:14,def:5,mov:4,jmp:2,dir:2,skillName:"閃火",skillHint:"遠距閃火。",skillKind:"spark",rangeMin:1,rangeMax:3}),Ac("e1","Lila",2,1,2,"f"),ef("e2","Rook",7,2,2,"m"),Fs("e3","Tess",8,6,3,"f")]}],lr=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}],tf={L:.75,M:1,H:1.35},wc={L:"L 低",M:"M 中",H:"H 高"};function Ze(s,e){return`${s},${e}`}function ni(s){const[e,t]=s.split(",");return{x:Number(e),y:Number(t)}}function Os(s,e){const t=e.x-s.x,n=e.y-s.y,i=Math.sign(t),r=Math.sign(n);return i===0&&r<=0?0:i>0&&r<0?1:i>0&&r===0?2:i>0&&r>0?3:i===0&&r>0?4:i<0&&r>0?5:i<0&&r===0?6:7}function jn(s,e){return Math.abs(s.x-e.x)+Math.abs(s.y-e.y)}function Rc(s){return new Promise(e=>setTimeout(e,s))}function ks(s,e,t,n,i){const r=(n-1)/2,a=(i-1)/2,o=s-r,l=e-a,c=Math.cos(t),h=Math.sin(t);return{x:o*c+l*h,y:-o*h+l*c}}function nf(s,e,t){const n=Math.cos(t),i=Math.sin(t);return{x:s*n+e*i,y:-s*i+e*n}}function sf(s){return s+Math.PI/2}function rf(s,e){if(s.stance!=="hostile"&&s.team!=="enemy")return;const t=tf[e];s.maxHp=Math.max(1,Math.round(s.maxHp*t)),s.hp=s.maxHp,s.atk=Math.max(1,Math.round(s.atk*t)),s.def=Math.max(0,Math.round(s.def*t))}function Mi(s){return s.stance}function Au(s){const e=Mi(s);return e==="friendly"?"#5ad0ff":e==="hostile"?"#ff4d6d":"#e0c45a"}function af(s){return s.team==="player"&&!s.npc&&!s.dead}function of(s,e){return e.dead?!0:s.team===e.team||Mi(s)==="friendly"&&Mi(e)==="friendly"}function wu(s,e){if(s.dead||e.dead||s.id===e.id)return!1;if(s.behaviour==="indiscriminate"||e.behaviour==="indiscriminate")return!0;const t=Mi(s),n=Mi(e);return t==="hostile"&&n==="friendly"||t==="friendly"&&n==="hostile"||t==="neutral"&&n==="hostile"||t==="hostile"&&n==="neutral"}function Cc(s){s.stance="hostile",s.team="enemy",(s.behaviour==="idle"||s.behaviour==="flee")&&(s.behaviour="combat")}function lf(s,e){const t=new Map;for(const n of s)n.dead||e&&n.id===e.id||t.set(Ze(n.x,n.y),n);return t}function Mr(s,e,t){const n=lf(t,s),i=new Map,r=new Map,a=Ze(s.x,s.y);i.set(a,0),r.set(a,null);const o=[{x:s.x,y:s.y}];for(;o.length;){o.sort((f,p)=>(i.get(Ze(f.x,f.y))??99)-(i.get(Ze(p.x,p.y))??99));const c=o.shift(),h=Ze(c.x,c.y),u=i.get(h)??0,d=e.heightAt(c.x,c.y);for(const f of lr){const p=c.x+f.x,x=c.y+f.y;if(!e.walkable(p,x)||f.x!==0&&f.y!==0&&(!e.walkable(c.x+f.x,c.y)||!e.walkable(c.x,c.y+f.y)))continue;const g=e.heightAt(p,x)-d;if(Math.abs(g)>s.jmp)continue;const M=n.get(Ze(p,x));if(M&&!of(s,M))continue;const b=1+(g>0?g:0),y=u+b;if(y>s.mov)continue;const A=Ze(p,x),T=i.get(A);T!==void 0&&T<=y||(i.set(A,y),r.set(A,h),o.push({x:p,y:x}))}}const l=new Map;for(const[c,h]of i){const u=ni(c),d=n.get(c);d&&d.id!==s.id||e.walkable(u.x,u.y)&&l.set(c,h)}return l.set(a,0),{cost:l,parent:r}}function Si(s,e){const t=[];let n=Ze(e.x,e.y);if(!s.cost.has(n)&&!s.parent.has(n))return t;for(;n;){t.push(ni(n));const i=s.parent.get(n);if(!i)break;n=i}return t.reverse(),t}function Ss(s,e,t,n,i,r){const a=Math.abs(e-n)+Math.abs(t-i),o=s.rangeMin??1,l=s.rangeMax??1;if(a<o||a>l)return!1;const c=Math.abs(r.heightAt(e,t)-r.heightAt(n,i)),h=Math.max(2,s.jmp+1);return c<=h}function Lo(s,e,t,n){const i=s.x,r=s.y,a=[];for(const o of t)o.dead||o.id===s.id||!(wu(s,o)||s.team==="player"&&!s.npc&&o.stance!=="friendly")||Ss(s,i,r,o.x,o.y,e)&&a.push(o);return a}function No(s,e,t){const n=s.skillKind;if(n==="heal"||s.role==="support")return t.filter(i=>i.dead||i.stance!=="friendly"&&i.team!=="player"?!1:Math.abs(s.x-i.x)+Math.abs(s.y-i.y)<=1);if(n==="halt"||s.role==="controller")return t.filter(i=>{if(i.dead||i.stance==="friendly")return!1;const r=Math.abs(e.heightAt(s.x,s.y)-e.heightAt(i.x,i.y));return Math.abs(s.x-i.x)+Math.abs(s.y-i.y)<=3&&r<=3});if(n==="spark"||n==="shot")return t.filter(i=>{if(i.dead||i.id===s.id||i.stance==="friendly")return!1;const r=Math.abs(s.x-i.x)+Math.abs(s.y-i.y),a=n==="spark"?3:4;return r<(n==="shot"?2:1)||r>a?!1:Math.abs(e.heightAt(s.x,s.y)-e.heightAt(i.x,i.y))<=3});if(n==="strike"||n==="slash"||n==="pounce"||n==="hook"||s.role==="striker"){const i=n==="strike"?3:2;return Lo({...s,rangeMin:1,rangeMax:1},e,t).filter(r=>Math.abs(e.heightAt(s.x,s.y)-e.heightAt(r.x,r.y))<=i)}return Lo(s,e,t)}function cf(s,e,t){const n=new Set;for(const i of Lo(s,e,t))n.add(Ze(i.x,i.y));return n}function ta(s,e){const t=new Set,n=s.rangeMin??1,i=s.rangeMax??1;for(let r=0;r<e.h;r++)for(let a=0;a<e.w;a++){const o=Math.abs(s.x-a)+Math.abs(s.y-r);o>=n&&o<=i&&e.inBounds(a,r)&&t.add(Ze(a,r))}return t}function hf(s,e){const t=s.skillKind;if(t==="halt"||s.role==="controller"){const n=new Set;for(let i=0;i<e.h;i++)for(let r=0;r<e.w;r++)Math.abs(s.x-r)+Math.abs(s.y-i)<=3&&n.add(Ze(r,i));return n}if(t==="heal"||s.role==="support"){const n=new Set;for(const i of lr){const r=s.x+i.x,a=s.y+i.y;e.inBounds(r,a)&&n.add(Ze(r,a))}return n.add(Ze(s.x,s.y)),n}if(t==="spark"){const n={...s,rangeMin:1,rangeMax:3};return ta(n,e)}if(t==="shot"){const n={...s,rangeMin:2,rangeMax:4};return ta(n,e)}return ta({...s,rangeMin:1,rangeMax:1},e)}function Ru(s,e){const t=e.x-s.x,n=e.y-s.y,i=lr[s.dir],r=t*i.x+n*i.y;return r>0?"front":r<0?"back":"side"}function ua(s,e,t,n=!1){const i=Ru(e,s);let r=s.atk+(s.atkBuff||0)-Math.floor(e.def*.5);const a=t.heightAt(s.x,s.y)-t.heightAt(e.x,e.y);if(a>0&&(r+=3),a<0&&(r-=2),i==="side"&&(r=Math.floor(r*1.25)),i==="back"&&(r=Math.floor(r*1.5)),n)switch(s.skillKind){case"strike":r=Math.floor(r*1.4);break;case"slash":r=Math.floor(r*1.3);break;case"spark":r=s.atk+(s.atkBuff||0)-Math.floor(e.def*.2)+(a>0?2:0);break;case"pounce":r=Math.floor(r*1.35);break;case"hook":r=Math.floor(r*1.45);break;case"shot":r=Math.floor(r*1.15);break;default:s.role==="striker"&&(r=Math.floor(r*1.4))}return{dmg:Math.max(1,r),face:i,dh:a}}const uf={front:"正面",side:"側面 +25%",back:"背面 +50%"};function Do(s,e,t,n=!1){const{dmg:i,face:r,dh:a}=ua(s,e,t,n),o=[uf[r]];return a>0&&o.push("高地 +3"),a<0&&o.push("仰攻 −2"),n&&s.skillName&&o.push(s.skillName),{kind:n?"skill":"attack",actor:s,target:e,label:n?`${s.skillName}　${s.name} → ${e.name}`:`${s.name} → ${e.name}`,detail:`${i} 傷害　${o.join("　")}`,dmg:i,heal:0,skip:!1,face:r}}function Pc(s,e,t){const n=s.skillKind;return n==="halt"||s.role==="controller"?{kind:"skill",actor:s,target:e,label:`${s.skillName}　${s.name} → ${e.name}`,detail:"下回合無法行動　並造成 4 傷害",dmg:4,heal:0,skip:!0,face:Ru(e,s)}:n==="heal"||s.role==="support"?{kind:"skill",actor:s,target:e,label:`${s.skillName}　${s.name} → ${e.name}`,detail:"回復 16 生命",dmg:0,heal:16,skip:!1,face:"front"}:Do(s,e,t,!0)}function Ul(s,e){return s.behaviour==="indiscriminate"?e.filter(t=>!t.dead&&t.id!==s.id):s.behaviour==="flee"||s.behaviour==="idle"?[]:e.filter(t=>!t.dead&&t.id!==s.id&&wu(s,t))}function Fl(s,e){return e.length?e.slice().sort((t,n)=>jn(s,t)-jn(s,n))[0]:null}function df(s,e,t,n,i){return s.behaviour==="idle"||s.mov<=0?{unit:s,dest:{x:s.x,y:s.y},path:[{x:s.x,y:s.y}],target:null,useSkill:!1}:s.behaviour==="flee"?ff(s,e,t):i==="L"?pf(s,e,t):i==="H"?gf(s,e,t,n):mf(s,e,t,n)}function ff(s,e,t){const n=Mr(s,e,t),i=t.filter(o=>!o.dead&&o.id!==s.id&&Mi(o)==="hostile");let r={x:s.x,y:s.y},a=-1;for(const[o]of n.cost){const l=ni(o),c=Fl(l,i),h=c?jn(l,c):8,u=Math.min(l.x,l.y,e.w-1-l.x,e.h-1-l.y),d=h*10-u;d>a&&(a=d,r=l)}return{unit:s,dest:r,path:Si(n,r),target:null,useSkill:!1}}function Ol(s,e,t,n,i,r){if(s.skillUsed||!s.skillName)return!1;const a={...s,x:e.x,y:e.y};if(!No(a,n,i).some(c=>c.id===t.id)||s.skillKind==="heal")return!1;const l=r==="H"?.8:r==="L"?.25:.55;return s.skillKind==="spark"||s.skillKind==="shot"?!0:Math.random()<l}function pf(s,e,t){const n=Mr(s,e,t),i=Ul(s,t);let r=null;for(const[c]of n.cost){const h=ni(c);for(const u of i){if(!Ss(s,h.x,h.y,u.x,u.y,e))continue;const d=jn(s,h),p=400-jn(s,u)*20-d;(!r||p>r.score)&&(r={dest:h,target:u,score:p})}}if(r)return{unit:s,dest:r.dest,path:Si(n,r.dest),target:r.target,useSkill:Ol(s,r.dest,r.target,e,t,"L")};const a=Fl(s,i);let o={x:s.x,y:s.y},l=1e9;if(a)for(const[c]of n.cost){const h=ni(c);let u=jn(h,a);s.rangeMin>1&&(u=Math.abs(u-s.rangeMin)),u<l&&(l=u,o=h)}return{unit:s,dest:o,path:Si(n,o),target:null,useSkill:!1}}function mf(s,e,t,n){const i=Mr(s,e,t),r=Ul(s,t);let a=null;for(const[c]of i.cost){const h=ni(c);for(const u of r){if(!Ss(s,h.x,h.y,u.x,u.y,e))continue;const d={...s,x:h.x,y:h.y},{dmg:f,face:p,dh:x}=ua(d,u,e);let m=f*10+(u.hp<=f?80:0);if(u.role==="support"&&(m+=6),u.id===n&&(m+=14),p==="back"&&(m+=8),x>0&&(m+=4),s.role==="elite"&&(m+=2),s.rangeMin>1){const g=jn(h,u);g>=s.rangeMin&&(m+=6),g===1&&s.archetype==="gunner"&&(m-=12)}(!a||m>a.score)&&(a={dest:h,target:u,score:m})}}if(a)return{unit:s,dest:a.dest,path:Si(i,a.dest),target:a.target,useSkill:Ol(s,a.dest,a.target,e,t,"M")};let o={x:s.x,y:s.y},l=99;for(const c of r)for(const[h]of i.cost){const u=ni(h);let d=Math.abs(u.x-c.x)+Math.abs(u.y-c.y);s.rangeMin>1&&(d=Math.abs(d-Math.max(2,s.rangeMin)));const f=e.heightAt(s.x,s.y)-e.heightAt(u.x,u.y);let p=d;c.id===n&&(p-=2),s.role==="elite"&&f>0&&(p+=1.4),p<l&&(l=p,o=u)}return{unit:s,dest:o,path:Si(i,o),target:null,useSkill:!1}}function gf(s,e,t,n){const i=Mr(s,e,t),r=Ul(s,t),a=n?r.find(p=>p.id===n):void 0,l=r.filter(p=>!p.npc).reduce((p,x)=>p+x.hp,0),c=!!a&&a.hp*3<=Math.max(1,l);let h=null;for(const[p]of i.cost){const x=ni(p);for(const m of r){if(!Ss(s,x.x,x.y,m.x,m.y,e))continue;const g={...s,x:x.x,y:x.y},{dmg:M,face:b,dh:y}=ua(g,m,e),A=1-m.hp/Math.max(1,m.maxHp);let T=M*12+A*40;m.hp<=M&&(T+=110),b==="back"&&(T+=22),b==="side"&&(T+=12),y>0&&(T+=10),y<0&&(T-=6),m.role==="support"&&(T+=8),m.id===n&&(T+=c||m.hp<=16?56:20,m.hp<=M&&(T+=40)),s.role==="elite"&&(T+=3),s.rangeMin>1&&jn(x,m)===1&&s.archetype==="gunner"&&(T-=20),(!h||T>h.score)&&(h={dest:x,target:m,score:T})}}if(h)return{unit:s,dest:h.dest,path:Si(i,h.dest),target:h.target,useSkill:Ol(s,h.dest,h.target,e,t,"H")};const u=a&&(c||a.hp/a.maxHp<.65)?a:r.slice().sort((p,x)=>p.hp/p.maxHp-x.hp/x.maxHp)[0];let d={x:s.x,y:s.y},f=-1e9;for(const[p]of i.cost){const x=ni(p),m=u??Fl(x,r);if(!m)continue;let g=jn(x,m);s.rangeMin>1&&(g=Math.abs(g-Math.max(2,s.rangeMin)));let M=-g*10+e.heightAt(x.x,x.y)*5;if(Ss(s,x.x,x.y,m.x,m.y,e)){const b={...s,x:x.x,y:x.y},{face:y,dh:A}=ua(b,m,e);y==="back"&&(M+=24),y==="side"&&(M+=12),A>0&&(M+=8)}m.id===n&&(M+=6),M+=(1-m.hp/Math.max(1,m.maxHp))*8,M>f&&(f=M,d=x)}return{unit:s,dest:d,path:Si(i,d),target:null,useSkill:!1}}class xf{constructor(e,t){K(this,"pointers",new Map);K(this,"lastPinch",0);K(this,"lastAngle",0);K(this,"lastCentroid",null);K(this,"dragging",!1);K(this,"start",null);K(this,"moved",0);K(this,"right",!1);K(this,"pinchGrid",null);K(this,"onTap",()=>{});this.canvas=e,this.renderer=t,e.addEventListener("pointerdown",n=>this.down(n)),e.addEventListener("pointermove",n=>this.move(n)),e.addEventListener("pointerup",n=>this.up(n)),e.addEventListener("pointercancel",n=>this.up(n)),e.addEventListener("contextmenu",n=>n.preventDefault()),e.addEventListener("wheel",n=>{n.preventDefault(),this.zoomAt(n.clientX,n.clientY,n.deltaY<0?1.08:.92)},{passive:!1})}pos(e){const t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}centroid(){const e=[...this.pointers.values()];let t=0,n=0;for(const i of e)t+=i.x,n+=i.y;return{x:t/e.length,y:n/e.length}}down(e){this.canvas.setPointerCapture(e.pointerId);const t=this.pos(e);if(this.pointers.set(e.pointerId,t),e.button===2&&(this.right=!0),this.pointers.size===1)this.start=t,this.moved=0,this.dragging=!1;else if(this.pointers.size===2){this.lastPinch=this.pinchDist(),this.lastAngle=this.pinchAngle();const n=this.centroid();this.lastCentroid=n,this.pinchGrid=this.renderer.screenToGrid(n.x,n.y),this.dragging=!0}}move(e){if(!this.pointers.has(e.pointerId))return;const t=this.pos(e),n=this.pointers.get(e.pointerId);if(this.pointers.set(e.pointerId,t),this.pointers.size===2){const a=this.pinchDist(),o=this.pinchAngle(),l=this.centroid();if(this.lastPinch>0){const c=a/this.lastPinch;this.renderer.yaw-=o-this.lastAngle,this.lastCentroid&&this.renderer.addPitch(l.y-this.lastCentroid.y),this.zoomAtScreen(l.x,l.y,c),this.pinchGrid&&this.renderer.lockGridToScreen(this.pinchGrid.x,this.pinchGrid.y,0,l.x,l.y)}this.lastPinch=a,this.lastAngle=o,this.lastCentroid=l,this.dragging=!0;return}const i=t.x-n.x,r=t.y-n.y;if(this.moved+=Math.hypot(i,r),this.moved>10&&(this.dragging=!0),this.right){const a=this.renderer.screenToGrid(this.renderer.w/2,this.renderer.h/2);this.renderer.yaw+=i*.01,this.renderer.addPitch(r),this.renderer.lockGridToScreen(a.x,a.y,0,this.renderer.w/2,this.renderer.h/2);return}if(this.dragging){const a=this.renderer.cam.zoom;this.renderer.cam.x-=i/a,this.renderer.cam.y-=r/a}}up(e){const t=this.pointers.get(e.pointerId);this.pointers.delete(e.pointerId),e.button===2&&(this.right=!1),this.pointers.size<2&&(this.lastPinch=0,this.pinchGrid=null,this.lastCentroid=null),this.pointers.size===0?(!this.dragging&&this.start&&t&&this.onTap(t),this.start=null,this.dragging=!1,this.moved=0,this.right=!1):this.dragging=!0}pinchDist(){const e=[...this.pointers.values()];return e.length<2?0:Math.hypot(e[0].x-e[1].x,e[0].y-e[1].y)}pinchAngle(){const e=[...this.pointers.values()];return e.length<2?0:Math.atan2(e[1].y-e[0].y,e[1].x-e[0].x)}zoomAt(e,t,n){const i=this.canvas.getBoundingClientRect();this.zoomAtScreen(e-i.left,t-i.top,n)}zoomAtScreen(e,t,n){const i=this.renderer.cam,r=i.x+(e-this.renderer.w/2)/i.zoom,a=i.y+(t-this.renderer.h/2)/i.zoom;i.zoom=Math.min(1.8,Math.max(.55,i.zoom*n)),i.x=r-(e-this.renderer.w/2)/i.zoom,i.y=a-(t-this.renderer.h/2)/i.zoom}}const Ic=14,_f=5,vf=9,Zi={bandage:{id:"bandage",name:"繃帶",hint:"回復 14 生命。"},stim:{id:"stim",name:"提神",hint:"下次攻擊 +5。"}},Qi=[{id:"bandage",qty:2},{id:"stim",qty:1}];function an(s){return s.map(e=>({id:e.id,qty:e.qty})).filter(e=>e.qty>0)}function Da(s,e,t=1){const n=s.find(a=>a.id===e),i=n?.qty??0,r=Math.min(t,vf-i);return r<=0?0:(n?n.qty+=r:s.push({id:e,qty:r}),r)}function yf(s,e){const t=s.find(n=>n.id===e);if(!t||t.qty<=0)return!1;if(t.qty-=1,t.qty<=0){const n=s.indexOf(t);n>=0&&s.splice(n,1)}return!0}function Ua(s){return s.filter(e=>!e.dead&&(e.stance==="friendly"||e.team==="player"))}const Fa=8,Lc=12;function Mf(s,e){const n={id:`obj-${s.type}-${e}-${s.x}-${s.y}`,x:s.x,y:s.y,type:s.type,gone:!1,used:!1,item:s.item,unblock:s.unblock??[],healAdj:s.healAdj??0};switch(s.type){case"kit":return{...n,kind:"pickup",hp:1,maxHp:1,label:"急救包",standH:0,item:s.item??"bandage"};case"switch":return{...n,kind:"trigger",hp:1,maxHp:1,label:"開關",standH:0};case"van":return{...n,kind:"trigger",hp:1,maxHp:1,label:"貨車門",standH:0};case"barrel":return{...n,kind:"destructible",hp:Lc,maxHp:Lc,label:"油桶",standH:0};case"crate":return{...n,kind:"platform",hp:1,maxHp:1,label:"貨箱",standH:1};case"pallet":return{...n,kind:"platform",hp:1,maxHp:1,label:"棧板",standH:1}}}function Sf(s){return s.gone?!1:s.kind==="destructible"||s.type==="van"&&!s.used}function bf(s){const e=new Map;for(const t of s)t.gone||e.set(Ze(t.x,t.y),t);return e}class Oa{constructor(e){K(this,"w");K(this,"h");K(this,"theme");K(this,"tiles",[]);K(this,"objects",[]);this.w=e.w,this.h=e.h,this.theme=e.theme??"roof";const t=new Map;for(const[i,r,a]of e.blocked)t.set(Ze(i,r),a);const n=new Set((e.lamps??[]).map(([i,r])=>Ze(i,r)));for(let i=0;i<e.h;i++){const r=[],a=e.heights[i]??"";for(let o=0;o<e.w;o++){const l=Number(a[o]??"0");let c="street";l===2?c="roof":l===1&&(c="stairs");const h=t.get(Ze(o,i))??(n.has(Ze(o,i))?"lamp":void 0);r.push({x:o,y:i,h:l,terrain:c,blocked:h==="stall"||h==="ac"||h==="crate",prop:h})}this.tiles.push(r)}this.objects=(e.objects??[]).map((i,r)=>Mf(i,r))}inBounds(e,t){return e>=0&&t>=0&&e<this.w&&t<this.h}tile(e,t){return this.inBounds(e,t)?this.tiles[t][e]:null}objAt(e,t){return bf(this.objects).get(Ze(e,t))}heightAt(e,t){const n=this.tile(e,t);if(!n)return 0;const i=this.objAt(e,t),r=i&&!i.gone&&i.kind==="platform"?i.standH:0;return n.h+r}walkable(e,t){const n=this.tile(e,t);if(!n||n.blocked)return!1;const i=this.objAt(e,t);return!(i&&Sf(i))}unblock(e,t){const n=this.tile(e,t);n&&(n.blocked=!1,(n.prop==="crate"||n.prop==="stall")&&(n.prop=void 0))}}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const kl="185",Tf=0,Nc=1,Ef=2,na=1,Af=2,Js=3,ii=0,Qt=1,Pn=2,ei=0,_s=1,Dc=2,Uc=3,Fc=4,wf=5,Ni=100,Rf=101,Cf=102,Pf=103,If=104,Lf=200,Nf=201,Df=202,Uf=203,Uo=204,Fo=205,Ff=206,Of=207,kf=208,Bf=209,zf=210,Hf=211,Gf=212,Vf=213,Wf=214,Oo=0,ko=1,Bo=2,bs=3,zo=4,Ho=5,Go=6,Vo=7,Cu=0,Xf=1,qf=2,Nn=0,Pu=1,Iu=2,Lu=3,Nu=4,Du=5,Uu=6,Fu=7,Oc="attached",Kf="detached",Ou=300,Wi=301,Ts=302,ka=303,Ba=304,Ta=306,Es=1e3,In=1001,da=1002,Lt=1003,ku=1004,Zs=1005,Nt=1006,ia=1007,Zn=1008,nn=1009,Bu=1010,zu=1011,cr=1012,Bl=1013,Fn=1014,hn=1015,si=1016,zl=1017,Hl=1018,hr=1020,Hu=35902,Gu=35899,Vu=1021,Wu=1022,un=1023,ri=1026,Bi=1027,Gl=1028,Vl=1029,Xi=1030,Wl=1031,Xl=1033,sa=33776,ra=33777,aa=33778,oa=33779,Wo=35840,Xo=35841,qo=35842,Ko=35843,Yo=36196,$o=37492,Jo=37496,Zo=37488,Qo=37489,fa=37490,jo=37491,el=37808,tl=37809,nl=37810,il=37811,sl=37812,rl=37813,al=37814,ol=37815,ll=37816,cl=37817,hl=37818,ul=37819,dl=37820,fl=37821,pl=36492,ml=36494,gl=36495,xl=36283,_l=36284,pa=36285,vl=36286,Yf=2200,$f=2201,Jf=2202,ur=2300,dr=2301,za=2302,kc=2303,gs=2400,xs=2401,ma=2402,ql=2500,Zf=2501,Qf=0,Xu=1,yl=2,jf=3200,Ml=0,ep=1,vi="",It="srgb",sn="srgb-linear",ga="linear",st="srgb",ji=7680,Bc=519,tp=512,np=513,ip=514,Kl=515,sp=516,rp=517,Yl=518,ap=519,Sl=35044,zc="300 es",Ln=2e3,fr=2001;function op(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function lp(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function pr(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function cp(){const s=pr("canvas");return s.style.display="block",s}const Hc={};function xa(...s){const e="THREE."+s.shift();console.log(e,...s)}function qu(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Te(...s){s=qu(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function Ne(...s){s=qu(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function vs(...s){const e=s.join(" ");e in Hc||(Hc[e]=!0,Te(...s))}function hp(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const up={[Oo]:ko,[Bo]:Go,[zo]:Vo,[bs]:Ho,[ko]:Oo,[Go]:Bo,[Vo]:zo,[Ho]:bs};class Ti{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Gc=1234567;const tr=Math.PI/180,As=180/Math.PI;function dn(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Gt[s&255]+Gt[s>>8&255]+Gt[s>>16&255]+Gt[s>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[t&63|128]+Gt[t>>8&255]+"-"+Gt[t>>16&255]+Gt[t>>24&255]+Gt[n&255]+Gt[n>>8&255]+Gt[n>>16&255]+Gt[n>>24&255]).toLowerCase()}function Ve(s,e,t){return Math.max(e,Math.min(t,s))}function $l(s,e){return(s%e+e)%e}function dp(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function fp(s,e,t){return s!==e?(t-s)/(e-s):0}function nr(s,e,t){return(1-t)*s+t*e}function pp(s,e,t,n){return nr(s,e,1-Math.exp(-t*n))}function mp(s,e=1){return e-Math.abs($l(s,e*2)-e)}function gp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function xp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function _p(s,e){return s+Math.floor(Math.random()*(e-s+1))}function vp(s,e){return s+Math.random()*(e-s)}function yp(s){return s*(.5-Math.random())}function Mp(s){s!==void 0&&(Gc=s);let e=Gc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Sp(s){return s*tr}function bp(s){return s*As}function Tp(s){return(s&s-1)===0&&s!==0}function Ep(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Ap(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function wp(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),u=r((e-n)/2),d=a((e-n)/2),f=r((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*u,l*d,o*c);break;case"YZY":s.set(l*d,o*h,l*u,o*c);break;case"ZXZ":s.set(l*u,l*d,o*h,o*c);break;case"XZX":s.set(o*h,l*p,l*f,o*c);break;case"YXY":s.set(l*f,o*h,l*p,o*c);break;case"ZYZ":s.set(l*p,l*f,o*h,o*c);break;default:Te("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function _n(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function rt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const Rp={DEG2RAD:tr,RAD2DEG:As,generateUUID:dn,clamp:Ve,euclideanModulo:$l,mapLinear:dp,inverseLerp:fp,lerp:nr,damp:pp,pingpong:mp,smoothstep:gp,smootherstep:xp,randInt:_p,randFloat:vp,randFloatSpread:yp,seededRandom:Mp,degToRad:Sp,radToDeg:bp,isPowerOfTwo:Tp,ceilPowerOfTwo:Ep,floorPowerOfTwo:Ap,setQuaternionFromProperEuler:wp,normalize:rt,denormalize:_n},uc=class uc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};uc.prototype.isVector2=!0;let se=uc;class fn{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[a+0],f=r[a+1],p=r[a+2],x=r[a+3];if(u!==x||l!==d||c!==f||h!==p){let m=l*d+c*f+h*p+u*x;m<0&&(d=-d,f=-f,p=-p,x=-x,m=-m);let g=1-o;if(m<.9995){const M=Math.acos(m),b=Math.sin(M);g=Math.sin(g*M)/b,o=Math.sin(o*M)/b,l=l*g+d*o,c=c*g+f*o,h=h*g+p*o,u=u*g+x*o}else{l=l*g+d*o,c=c*g+f*o,h=h*g+p*o,u=u*g+x*o;const M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[a],d=r[a+1],f=r[a+2],p=r[a+3];return e[t]=o*p+h*u+l*f-c*d,e[t+1]=l*p+h*d+c*u-o*f,e[t+2]=c*p+h*f+o*d-l*u,e[t+3]=h*p-o*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),u=o(r/2),d=l(n/2),f=l(i/2),p=l(r/2);switch(a){case"XYZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"YXZ":this._x=d*h*u+c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"ZXY":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u-d*f*p;break;case"ZYX":this._x=d*h*u-c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u+d*f*p;break;case"YZX":this._x=d*h*u+c*f*p,this._y=c*f*u+d*h*p,this._z=c*h*p-d*f*u,this._w=c*h*u-d*f*p;break;case"XZY":this._x=d*h*u-c*f*p,this._y=c*f*u-d*h*p,this._z=c*h*p+d*f*u,this._w=c*h*u+d*f*p;break;default:Te("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+o+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(a-i)*f}else if(n>o&&n>u){const f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+a)/f,this._z=(r+c)/f}else if(o>u){const f=2*Math.sqrt(1+o-n-u);this._w=(r-c)/f,this._x=(i+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+u-n-o);this._w=(a-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ve(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const dc=class dc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Vc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Vc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),u=2*(r*n-a*t);return this.x=t+l*c+a*u-o*h,this.y=n+l*h+o*c-r*u,this.z=i+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Ha.copy(this).projectOnVector(e),this.sub(Ha)}reflect(e){return this.sub(Ha.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ve(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};dc.prototype.isVector3=!0;let I=dc;const Ha=new I,Vc=new fn,fc=class fc{constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],p=n[8],x=i[0],m=i[3],g=i[6],M=i[1],b=i[4],y=i[7],A=i[2],T=i[5],R=i[8];return r[0]=a*x+o*M+l*A,r[3]=a*m+o*b+l*T,r[6]=a*g+o*y+l*R,r[1]=c*x+h*M+u*A,r[4]=c*m+h*b+u*T,r[7]=c*g+h*y+u*R,r[2]=d*x+f*M+p*A,r[5]=d*m+f*b+p*T,r[8]=d*g+f*y+p*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,d=o*l-h*r,f=c*r-a*l,p=t*u+n*d+i*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return e[0]=u*x,e[1]=(i*c-h*n)*x,e[2]=(o*n-i*a)*x,e[3]=d*x,e[4]=(h*t-i*l)*x,e[5]=(i*r-o*t)*x,e[6]=f*x,e[7]=(n*l-c*t)*x,e[8]=(a*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return vs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ga.makeScale(e,t)),this}rotate(e){return vs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ga.makeRotation(-e)),this}translate(e,t){return vs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ga.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};fc.prototype.isMatrix3=!0;let ke=fc;const Ga=new ke,Wc=new ke().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Xc=new ke().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Cp(){const s={enabled:!0,workingColorSpace:sn,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===st&&(i.r=ti(i.r),i.g=ti(i.g),i.b=ti(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===st&&(i.r=ys(i.r),i.g=ys(i.g),i.b=ys(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===vi?ga:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return vs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return vs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[sn]:{primaries:e,whitePoint:n,transfer:ga,toXYZ:Wc,fromXYZ:Xc,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:It},outputColorSpaceConfig:{drawingBufferColorSpace:It}},[It]:{primaries:e,whitePoint:n,transfer:st,toXYZ:Wc,fromXYZ:Xc,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:It}}}),s}const Ke=Cp();function ti(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ys(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let es;class Pp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{es===void 0&&(es=pr("canvas")),es.width=e.width,es.height=e.height;const i=es.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=es}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=pr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=ti(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ti(t[n]/255)*255):t[n]=ti(t[n]);return{data:t,width:e.width,height:e.height}}else return Te("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Ip=0;class Jl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ip++}),this.uuid=dn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(Va(i[a].image)):r.push(Va(i[a]))}else r=Va(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function Va(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Pp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Te("Texture: Unable to serialize Texture."),{})}let Lp=0;const Wa=new I;class Bt extends Ti{constructor(e=Bt.DEFAULT_IMAGE,t=Bt.DEFAULT_MAPPING,n=In,i=In,r=Nt,a=Zn,o=un,l=nn,c=Bt.DEFAULT_ANISOTROPY,h=vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Lp++}),this.uuid=dn(),this.name="",this.source=new Jl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new se(0,0),this.repeat=new se(1,1),this.center=new se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Wa).x}get height(){return this.source.getSize(Wa).y}get depth(){return this.source.getSize(Wa).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Te(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Te(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ou)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Es:e.x=e.x-Math.floor(e.x);break;case In:e.x=e.x<0?0:1;break;case da:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Es:e.y=e.y-Math.floor(e.y);break;case In:e.y=e.y<0?0:1;break;case da:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bt.DEFAULT_IMAGE=null;Bt.DEFAULT_MAPPING=Ou;Bt.DEFAULT_ANISOTROPY=1;const pc=class pc{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(c+1)/2,y=(f+1)/2,A=(g+1)/2,T=(h+d)/4,R=(u+x)/4,v=(p+m)/4;return b>y&&b>A?b<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(b),i=T/n,r=R/n):y>A?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=T/i,r=v/i):A<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(A),n=R/r,i=v/r),this.set(n,i,r,t),this}let M=Math.sqrt((m-p)*(m-p)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(m-p)/M,this.y=(u-x)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ve(this.x,e.x,t.x),this.y=Ve(this.y,e.y,t.y),this.z=Ve(this.z,e.z,t.z),this.w=Ve(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ve(this.x,e,t),this.y=Ve(this.y,e,t),this.z=Ve(this.z,e,t),this.w=Ve(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Ve(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};pc.prototype.isVector4=!0;let lt=pc;class Np extends Ti{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Nt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Bt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Nt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Jl(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Dn extends Np{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ku extends Bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=In,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Dp extends Bt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=In,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ba=class ba{constructor(e,t,n,i,r,a,o,l,c,h,u,d,f,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,u,d,f,p,x,m)}set(e,t,n,i,r,a,o,l,c,h,u,d,f,p,x,m){const g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=i,g[1]=r,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ba().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/ts.setFromMatrixColumn(e,0).length(),r=1/ts.setFromMatrixColumn(e,1).length(),a=1/ts.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const d=a*h,f=a*u,p=o*h,x=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+p*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=p+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,f=l*u,p=c*h,x=c*u;t[0]=d+x*o,t[4]=p*o-f,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=f*o-p,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,f=l*u,p=c*h,x=c*u;t[0]=d-x*o,t[4]=-a*u,t[8]=p+f*o,t[1]=f+p*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,f=a*u,p=o*h,x=o*u;t[0]=l*h,t[4]=p*c-f,t[8]=d*c+x,t[1]=l*u,t[5]=x*c+d,t[9]=f*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,p=o*l,x=o*c;t[0]=l*h,t[4]=x-d*u,t[8]=p*u+f,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=f*u+p,t[10]=d-x*u}else if(e.order==="XZY"){const d=a*l,f=a*c,p=o*l,x=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+x,t[5]=a*h,t[9]=f*u-p,t[2]=p*u-f,t[6]=o*h,t[10]=x*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Up,e,Fp)}lookAt(e,t,n){const i=this.elements;return en.subVectors(e,t),en.lengthSq()===0&&(en.z=1),en.normalize(),ui.crossVectors(n,en),ui.lengthSq()===0&&(Math.abs(n.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),ui.crossVectors(n,en)),ui.normalize(),Er.crossVectors(en,ui),i[0]=ui.x,i[4]=Er.x,i[8]=en.x,i[1]=ui.y,i[5]=Er.y,i[9]=en.y,i[2]=ui.z,i[6]=Er.z,i[10]=en.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],p=n[2],x=n[6],m=n[10],g=n[14],M=n[3],b=n[7],y=n[11],A=n[15],T=i[0],R=i[4],v=i[8],E=i[12],C=i[1],P=i[5],D=i[9],V=i[13],Y=i[2],O=i[6],q=i[10],H=i[14],Q=i[3],ee=i[7],de=i[11],ge=i[15];return r[0]=a*T+o*C+l*Y+c*Q,r[4]=a*R+o*P+l*O+c*ee,r[8]=a*v+o*D+l*q+c*de,r[12]=a*E+o*V+l*H+c*ge,r[1]=h*T+u*C+d*Y+f*Q,r[5]=h*R+u*P+d*O+f*ee,r[9]=h*v+u*D+d*q+f*de,r[13]=h*E+u*V+d*H+f*ge,r[2]=p*T+x*C+m*Y+g*Q,r[6]=p*R+x*P+m*O+g*ee,r[10]=p*v+x*D+m*q+g*de,r[14]=p*E+x*V+m*H+g*ge,r[3]=M*T+b*C+y*Y+A*Q,r[7]=M*R+b*P+y*O+A*ee,r[11]=M*v+b*D+y*q+A*de,r[15]=M*E+b*V+y*H+A*ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],p=e[3],x=e[7],m=e[11],g=e[15],M=l*f-c*d,b=o*f-c*u,y=o*d-l*u,A=a*f-c*h,T=a*d-l*h,R=a*u-o*h;return t*(x*M-m*b+g*y)-n*(p*M-m*A+g*T)+i*(p*b-x*A+g*R)-r*(p*y-x*T+m*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],p=e[12],x=e[13],m=e[14],g=e[15],M=t*o-n*a,b=t*l-i*a,y=t*c-r*a,A=n*l-i*o,T=n*c-r*o,R=i*c-r*l,v=h*x-u*p,E=h*m-d*p,C=h*g-f*p,P=u*m-d*x,D=u*g-f*x,V=d*g-f*m,Y=M*V-b*D+y*P+A*C-T*E+R*v;if(Y===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/Y;return e[0]=(o*V-l*D+c*P)*O,e[1]=(i*D-n*V-r*P)*O,e[2]=(x*R-m*T+g*A)*O,e[3]=(d*T-u*R-f*A)*O,e[4]=(l*C-a*V-c*E)*O,e[5]=(t*V-i*C+r*E)*O,e[6]=(m*y-p*R-g*b)*O,e[7]=(h*R-d*y+f*b)*O,e[8]=(a*D-o*C+c*v)*O,e[9]=(n*C-t*D-r*v)*O,e[10]=(p*T-x*y+g*M)*O,e[11]=(u*y-h*T-f*M)*O,e[12]=(o*E-a*P-l*v)*O,e[13]=(t*P-n*E+i*v)*O,e[14]=(x*b-p*A-m*M)*O,e[15]=(h*A-u*b+d*M)*O,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,d=r*c,f=r*h,p=r*u,x=a*h,m=a*u,g=o*u,M=l*c,b=l*h,y=l*u,A=n.x,T=n.y,R=n.z;return i[0]=(1-(x+g))*A,i[1]=(f+y)*A,i[2]=(p-b)*A,i[3]=0,i[4]=(f-y)*T,i[5]=(1-(d+g))*T,i[6]=(m+M)*T,i[7]=0,i[8]=(p+b)*R,i[9]=(m-M)*R,i[10]=(1-(d+x))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=ts.set(i[0],i[1],i[2]).length();const o=ts.set(i[4],i[5],i[6]).length(),l=ts.set(i[8],i[9],i[10]).length();r<0&&(a=-a),pn.copy(this);const c=1/a,h=1/o,u=1/l;return pn.elements[0]*=c,pn.elements[1]*=c,pn.elements[2]*=c,pn.elements[4]*=h,pn.elements[5]*=h,pn.elements[6]*=h,pn.elements[8]*=u,pn.elements[9]*=u,pn.elements[10]*=u,t.setFromRotationMatrix(pn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=Ln,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i);let p,x;if(l)p=r/(a-r),x=a*r/(a-r);else if(o===Ln)p=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===fr)p=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=Ln,l=!1){const c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i);let p,x;if(l)p=1/(a-r),x=a/(a-r);else if(o===Ln)p=-2/(a-r),x=-(a+r)/(a-r);else if(o===fr)p=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ba.prototype.isMatrix4=!0;let Fe=ba;const ts=new I,pn=new Fe,Up=new I(0,0,0),Fp=new I(1,1,1),ui=new I,Er=new I,en=new I,qc=new Fe,Kc=new fn;class bi{constructor(e=0,t=0,n=0,i=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(Ve(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ve(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ve(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ve(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Ve(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Ve(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Te("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return qc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(qc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kc.setFromEuler(this),this.setFromQuaternion(Kc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class Yu{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Op=0;const Yc=new I,ns=new fn,Hn=new Fe,Ar=new I,Bs=new I,kp=new I,Bp=new fn,$c=new I(1,0,0),Jc=new I(0,1,0),Zc=new I(0,0,1),Qc={type:"added"},zp={type:"removed"},is={type:"childadded",child:null},Xa={type:"childremoved",child:null};class mt extends Ti{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Op++}),this.uuid=dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=mt.DEFAULT_UP.clone();const e=new I,t=new bi,n=new fn,i=new I(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Fe},normalMatrix:{value:new ke}}),this.matrix=new Fe,this.matrixWorld=new Fe,this.matrixAutoUpdate=mt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ns.setFromAxisAngle(e,t),this.quaternion.multiply(ns),this}rotateOnWorldAxis(e,t){return ns.setFromAxisAngle(e,t),this.quaternion.premultiply(ns),this}rotateX(e){return this.rotateOnAxis($c,e)}rotateY(e){return this.rotateOnAxis(Jc,e)}rotateZ(e){return this.rotateOnAxis(Zc,e)}translateOnAxis(e,t){return Yc.copy(e).applyQuaternion(this.quaternion),this.position.add(Yc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($c,e)}translateY(e){return this.translateOnAxis(Jc,e)}translateZ(e){return this.translateOnAxis(Zc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ar.copy(e):Ar.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Bs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(Bs,Ar,this.up):Hn.lookAt(Ar,Bs,this.up),this.quaternion.setFromRotationMatrix(Hn),i&&(Hn.extractRotation(i.matrixWorld),ns.setFromRotationMatrix(Hn),this.quaternion.premultiply(ns.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ne("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qc),is.child=e,this.dispatchEvent(is),is.child=null):Ne("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(zp),Xa.child=e,this.dispatchEvent(Xa),Xa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qc),is.child=e,this.dispatchEvent(is),is.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,e,kp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Bs,Bp,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),d=a(e.skeletons),f=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}mt.DEFAULT_UP=new I(0,1,0);mt.DEFAULT_MATRIX_AUTO_UPDATE=!0;mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Xe extends mt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hp={type:"move"};class qa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,n),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,p=.005;c.inputState.pinching&&d>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hp)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Xe;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const $u={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},wr={h:0,s:0,l:0};function Ka(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ue{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=It){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ke.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Ke.workingColorSpace){if(e=$l(e,1),t=Ve(t,0,1),n=Ve(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ka(a,r,e+1/3),this.g=Ka(a,r,e),this.b=Ka(a,r,e-1/3)}return Ke.colorSpaceToWorking(this,i),this}setStyle(e,t=It){function n(r){r!==void 0&&parseFloat(r)<1&&Te("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Te("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Te("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=It){const n=$u[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Te("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ti(e.r),this.g=ti(e.g),this.b=ti(e.b),this}copyLinearToSRGB(e){return this.r=ys(e.r),this.g=ys(e.g),this.b=ys(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=It){return Ke.workingToColorSpace(Vt.copy(this),e),Math.round(Ve(Vt.r*255,0,255))*65536+Math.round(Ve(Vt.g*255,0,255))*256+Math.round(Ve(Vt.b*255,0,255))}getHexString(e=It){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(Vt.copy(this),t);const n=Vt.r,i=Vt.g,r=Vt.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(Vt.copy(this),t),e.r=Vt.r,e.g=Vt.g,e.b=Vt.b,e}getStyle(e=It){Ke.workingToColorSpace(Vt.copy(this),e);const t=Vt.r,n=Vt.g,i=Vt.b;return e!==It?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(di),this.setHSL(di.h+e,di.s+t,di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(di),e.getHSL(wr);const n=nr(di.h,wr.h,t),i=nr(di.s,wr.s,t),r=nr(di.l,wr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Vt=new Ue;Ue.NAMES=$u;class Ju extends mt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const mn=new I,Gn=new I,Ya=new I,Vn=new I,ss=new I,rs=new I,jc=new I,$a=new I,Ja=new I,Za=new I,Qa=new lt,ja=new lt,eo=new lt;class vn{constructor(e=new I,t=new I,n=new I){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),mn.subVectors(e,t),i.cross(mn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){mn.subVectors(i,t),Gn.subVectors(n,t),Ya.subVectors(e,t);const a=mn.dot(mn),o=mn.dot(Gn),l=mn.dot(Ya),c=Gn.dot(Gn),h=Gn.dot(Ya),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(c*l-o*h)*d,p=(a*h-o*l)*d;return r.set(1-f-p,p,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,Vn)===null?!1:Vn.x>=0&&Vn.y>=0&&Vn.x+Vn.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,Vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Vn.x),l.addScaledVector(a,Vn.y),l.addScaledVector(o,Vn.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return Qa.setScalar(0),ja.setScalar(0),eo.setScalar(0),Qa.fromBufferAttribute(e,t),ja.fromBufferAttribute(e,n),eo.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Qa,r.x),a.addScaledVector(ja,r.y),a.addScaledVector(eo,r.z),a}static isFrontFacing(e,t,n,i){return mn.subVectors(n,t),Gn.subVectors(e,t),mn.cross(Gn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mn.subVectors(this.c,this.b),Gn.subVectors(this.a,this.b),mn.cross(Gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return vn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return vn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;ss.subVectors(i,n),rs.subVectors(r,n),$a.subVectors(e,n);const l=ss.dot($a),c=rs.dot($a);if(l<=0&&c<=0)return t.copy(n);Ja.subVectors(e,i);const h=ss.dot(Ja),u=rs.dot(Ja);if(h>=0&&u<=h)return t.copy(i);const d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ss,a);Za.subVectors(e,r);const f=ss.dot(Za),p=rs.dot(Za);if(p>=0&&f<=p)return t.copy(r);const x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(rs,o);const m=h*p-f*u;if(m<=0&&u-h>=0&&f-p>=0)return jc.subVectors(r,i),o=(u-h)/(u-h+(f-p)),t.copy(i).addScaledVector(jc,o);const g=1/(m+x+d);return a=x*g,o=d*g,t.copy(n).addScaledVector(ss,a).addScaledVector(rs,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class oi{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(gn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(gn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=gn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,gn):gn.fromBufferAttribute(r,a),gn.applyMatrix4(e.matrixWorld),this.expandByPoint(gn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Rr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Rr.copy(n.boundingBox)),Rr.applyMatrix4(e.matrixWorld),this.union(Rr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,gn),gn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(zs),Cr.subVectors(this.max,zs),as.subVectors(e.a,zs),os.subVectors(e.b,zs),ls.subVectors(e.c,zs),fi.subVectors(os,as),pi.subVectors(ls,os),Ai.subVectors(as,ls);let t=[0,-fi.z,fi.y,0,-pi.z,pi.y,0,-Ai.z,Ai.y,fi.z,0,-fi.x,pi.z,0,-pi.x,Ai.z,0,-Ai.x,-fi.y,fi.x,0,-pi.y,pi.x,0,-Ai.y,Ai.x,0];return!to(t,as,os,ls,Cr)||(t=[1,0,0,0,1,0,0,0,1],!to(t,as,os,ls,Cr))?!1:(Pr.crossVectors(fi,pi),t=[Pr.x,Pr.y,Pr.z],to(t,as,os,ls,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,gn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(gn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Wn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Wn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Wn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Wn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Wn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Wn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Wn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Wn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Wn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Wn=[new I,new I,new I,new I,new I,new I,new I,new I],gn=new I,Rr=new oi,as=new I,os=new I,ls=new I,fi=new I,pi=new I,Ai=new I,zs=new I,Cr=new I,Pr=new I,wi=new I;function to(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){wi.fromArray(s,r);const o=i.x*Math.abs(wi.x)+i.y*Math.abs(wi.y)+i.z*Math.abs(wi.z),l=e.dot(wi),c=t.dot(wi),h=n.dot(wi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Rt=new I,Ir=new se;let Gp=0;class Xt extends Ti{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Gp++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sl,this.updateRanges=[],this.gpuType=hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ir.fromBufferAttribute(this,t),Ir.applyMatrix3(e),this.setXY(t,Ir.x,Ir.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=_n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=_n(t,this.array)),t}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=_n(t,this.array)),t}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=_n(t,this.array)),t}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=_n(t,this.array)),t}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sl&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class Zu extends Xt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Qu extends Xt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class at extends Xt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Vp=new oi,Hs=new I,no=new I;class kn{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Vp.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Hs.subVectors(e,this.center);const t=Hs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(Hs,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(no.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Hs.copy(e.center).add(no)),this.expandByPoint(Hs.copy(e.center).sub(no))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Wp=0;const on=new Fe,io=new mt,cs=new I,tn=new oi,Gs=new oi,kt=new I;class Ft extends Ti{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wp++}),this.uuid=dn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(op(e)?Qu:Zu)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,n){return on.makeTranslation(e,t,n),this.applyMatrix4(on),this}scale(e,t,n){return on.makeScale(e,t,n),this.applyMatrix4(on),this}lookAt(e){return io.lookAt(e),io.updateMatrix(),this.applyMatrix4(io.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(cs).negate(),this.translate(cs.x,cs.y,cs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new at(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&Te("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new oi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ne('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const n=this.boundingSphere.center;if(tn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Gs.setFromBufferAttribute(o),this.morphTargetsRelative?(kt.addVectors(tn.min,Gs.min),tn.expandByPoint(kt),kt.addVectors(tn.max,Gs.max),tn.expandByPoint(kt)):(tn.expandByPoint(Gs.min),tn.expandByPoint(Gs.max))}tn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)kt.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(kt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)kt.fromBufferAttribute(o,c),l&&(cs.fromBufferAttribute(e,c),kt.add(cs)),i=Math.max(i,n.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Ne('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ne("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Xt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let v=0;v<n.count;v++)o[v]=new I,l[v]=new I;const c=new I,h=new I,u=new I,d=new se,f=new se,p=new se,x=new I,m=new I;function g(v,E,C){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,C),d.fromBufferAttribute(r,v),f.fromBufferAttribute(r,E),p.fromBufferAttribute(r,C),h.sub(c),u.sub(c),f.sub(d),p.sub(d);const P=1/(f.x*p.y-p.x*f.y);isFinite(P)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(u,-f.y).multiplyScalar(P),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(P),o[v].add(x),o[E].add(x),o[C].add(x),l[v].add(m),l[E].add(m),l[C].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let v=0,E=M.length;v<E;++v){const C=M[v],P=C.start,D=C.count;for(let V=P,Y=P+D;V<Y;V+=3)g(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const b=new I,y=new I,A=new I,T=new I;function R(v){A.fromBufferAttribute(i,v),T.copy(A);const E=o[v];b.copy(E),b.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(T,E);const P=y.dot(l[v])<0?-1:1;a.setXYZW(v,b.x,b.y,b.z,P)}for(let v=0,E=M.length;v<E;++v){const C=M[v],P=C.start,D=C.count;for(let V=P,Y=P+D;V<Y;V+=3)R(e.getX(V+0)),R(e.getX(V+1)),R(e.getX(V+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Xt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const i=new I,r=new I,a=new I,o=new I,l=new I,c=new I,h=new I,u=new I;if(e)for(let d=0,f=e.count;d<f;d+=3){const p=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h);let f=0,p=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let g=0;g<h;g++)d[p++]=c[f++]}return new Xt(d,h,u)}if(this.index===null)return Te("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ft,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){const f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Sl,this.updateRanges=[],this.version=0,this.uuid=dn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const qt=new I;class Zl{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=_n(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=rt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=rt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=_n(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=_n(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=_n(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=_n(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=rt(t,this.array),n=rt(n,this.array),i=rt(i,this.array),r=rt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){xa("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Xt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Zl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){xa("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let qp=0;class Un extends Ti{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qp++}),this.uuid=dn(),this.name="",this.type="Material",this.blending=_s,this.side=ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uo,this.blendDst=Fo,this.blendEquation=Ni,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ue(0,0,0),this.blendAlpha=0,this.depthFunc=bs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ji,this.stencilZFail=ji,this.stencilZPass=ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Te(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){Te(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_s&&(n.blending=this.blending),this.side!==ii&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Uo&&(n.blendSrc=this.blendSrc),this.blendDst!==Fo&&(n.blendDst=this.blendDst),this.blendEquation!==Ni&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==bs&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Bc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ji&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ji&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ji&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ue().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new se().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new se().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Xn=new I,so=new I,Lr=new I,mi=new I,ro=new I,Nr=new I,ao=new I;class Ea{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Xn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Xn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Xn.copy(this.origin).addScaledVector(this.direction,t),Xn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){so.copy(e).add(t).multiplyScalar(.5),Lr.copy(t).sub(e).normalize(),mi.copy(this.origin).sub(so);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Lr),o=mi.dot(this.direction),l=-mi.dot(Lr),c=mi.lengthSq(),h=Math.abs(1-a*a);let u,d,f,p;if(h>0)if(u=a*l-o,d=a*o-l,p=r*h,u>=0)if(d>=-p)if(d<=p){const x=1/h;u*=x,d*=x,f=u*(u+a*d+2*o)+d*(a*u+d+2*l)+c}else d=r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-p?(u=Math.max(0,-(-a*r+o)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=p?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(a*r+o)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=a>0?-r:r,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(so).addScaledVector(Lr,d),f}intersectSphere(e,t){Xn.subVectors(e.center,this.origin);const n=Xn.dot(this.direction),i=Xn.dot(Xn)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),u>=0?(o=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,Xn)!==null}intersectTriangle(e,t,n,i,r){ro.subVectors(t,e),Nr.subVectors(n,e),ao.crossVectors(ro,Nr);let a=this.direction.dot(ao),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;mi.subVectors(this.origin,e);const l=o*this.direction.dot(Nr.crossVectors(mi,Nr));if(l<0)return null;const c=o*this.direction.dot(ro.cross(mi));if(c<0||l+c>a)return null;const h=-o*mi.dot(ao);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class zi extends Un{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=Cu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const eh=new Fe,Ri=new Ea,Dr=new kn,th=new I,Ur=new I,Fr=new I,Or=new I,oo=new I,kr=new I,nh=new I,Br=new I;class Le extends mt{constructor(e=new Ft,t=new zi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){kr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(oo.fromBufferAttribute(u,e),a?kr.addScaledVector(oo,h):kr.addScaledVector(oo.sub(t),h))}t.add(kr)}return t}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Dr.copy(n.boundingSphere),Dr.applyMatrix4(r),Ri.copy(e.ray).recast(e.near),!(Dr.containsPoint(Ri.origin)===!1&&(Ri.intersectSphere(Dr,th)===null||Ri.origin.distanceToSquared(th)>(e.far-e.near)**2))&&(eh.copy(r).invert(),Ri.copy(e.ray).applyMatrix4(eh),!(n.boundingBox!==null&&Ri.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Ri)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=a[m.materialIndex],M=Math.max(m.start,f.start),b=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let y=M,A=b;y<A;y+=3){const T=o.getX(y),R=o.getX(y+1),v=o.getX(y+2);i=zr(this,g,e,n,c,h,u,T,R,v),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const M=o.getX(m),b=o.getX(m+1),y=o.getX(m+2);i=zr(this,a,e,n,c,h,u,M,b,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=d.length;p<x;p++){const m=d[p],g=a[m.materialIndex],M=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=M,A=b;y<A;y+=3){const T=y,R=y+1,v=y+2;i=zr(this,g,e,n,c,h,u,T,R,v),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const M=m,b=m+1,y=m+2;i=zr(this,a,e,n,c,h,u,M,b,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Kp(s,e,t,n,i,r,a,o){let l;if(e.side===Qt?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===ii,o),l===null)return null;Br.copy(o),Br.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(Br);return c<t.near||c>t.far?null:{distance:c,point:Br.clone(),object:s}}function zr(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,Ur),s.getVertexPosition(l,Fr),s.getVertexPosition(c,Or);const h=Kp(s,e,t,n,Ur,Fr,Or,nh);if(h){const u=new I;vn.getBarycoord(nh,Ur,Fr,Or,u),i&&(h.uv=vn.getInterpolatedAttribute(i,o,l,c,u,new se)),r&&(h.uv1=vn.getInterpolatedAttribute(r,o,l,c,u,new se)),a&&(h.normal=vn.getInterpolatedAttribute(a,o,l,c,u,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new I,materialIndex:0};vn.getNormal(Ur,Fr,Or,d.normal),h.face=d,h.barycoord=u}return h}const Vs=new lt,ih=new lt,sh=new lt,Yp=new lt,rh=new Fe,Hr=new I,lo=new kn,ah=new Fe,co=new Ea;class $p extends Le{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Oc,this.bindMatrix=new Fe,this.bindMatrixInverse=new Fe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new oi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Hr),this.boundingBox.expandByPoint(Hr)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new kn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,Hr),this.boundingSphere.expandByPoint(Hr)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),lo.copy(this.boundingSphere),lo.applyMatrix4(i),e.ray.intersectsSphere(lo)!==!1&&(ah.copy(i).invert(),co.copy(e.ray).applyMatrix4(ah),!(this.boundingBox!==null&&co.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,co)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new lt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Oc?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Kf?this.bindMatrixInverse.copy(this.bindMatrix).invert():Te("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;ih.fromBufferAttribute(i.attributes.skinIndex,e),sh.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Vs.copy(t),t.set(0,0,0,0)):(Vs.set(...t,1),t.set(0,0,0)),Vs.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=sh.getComponent(r);if(a!==0){const o=ih.getComponent(r);rh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Yp.copy(Vs).applyMatrix4(rh),a)}}return t.isVector4&&(t.w=Vs.w),t.applyMatrix4(this.bindMatrixInverse)}}class ju extends mt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Ql extends Bt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Lt,h=Lt,u,d){super(null,a,o,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const oh=new Fe,Jp=new Fe;class jl{constructor(e=[],t=[]){this.uuid=dn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Te("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Fe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Fe;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Jp;oh.multiplyMatrices(o,t[r]),oh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new jl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Ql(t,e,e,un,hn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(Te("Skeleton: No bone found with UUID:",r),a=new ju),this.bones.push(a),this.boneInverses.push(new Fe().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class bl extends Xt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const hs=new Fe,lh=new Fe,Gr=[],ch=new oi,Zp=new Fe,Ws=new Le,Xs=new kn;class Qp extends Le{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new bl(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Zp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new oi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,hs),ch.copy(e.boundingBox).applyMatrix4(hs),this.boundingBox.union(ch)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,hs),Xs.copy(e.boundingSphere).applyMatrix4(hs),this.boundingSphere.union(Xs)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(Ws.geometry=this.geometry,Ws.material=this.material,Ws.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Xs.copy(this.boundingSphere),Xs.applyMatrix4(n),e.ray.intersectsSphere(Xs)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,hs),lh.multiplyMatrices(n,hs),Ws.matrixWorld=lh,Ws.raycast(e,Gr);for(let a=0,o=Gr.length;a<o;a++){const l=Gr[a];l.instanceId=r,l.object=this,t.push(l)}Gr.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new bl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ql(new Float32Array(i*this.count),i,this.count,Gl,hn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ho=new I,jp=new I,em=new ke;class Li{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=ho.subVectors(n,t).cross(jp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(ho),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||em.getNormalMatrix(e),i=this.coplanarPoint(ho).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ci=new kn,tm=new se(.5,.5),Vr=new I;class ec{constructor(e=new Li,t=new Li,n=new Li,i=new Li,r=new Li,a=new Li){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Ln,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],p=r[8],x=r[9],m=r[10],g=r[11],M=r[12],b=r[13],y=r[14],A=r[15];if(i[0].setComponents(c-a,f-h,g-p,A-M).normalize(),i[1].setComponents(c+a,f+h,g+p,A+M).normalize(),i[2].setComponents(c+o,f+u,g+x,A+b).normalize(),i[3].setComponents(c-o,f-u,g-x,A-b).normalize(),n)i[4].setComponents(l,d,m,y).normalize(),i[5].setComponents(c-l,f-d,g-m,A-y).normalize();else if(i[4].setComponents(c-l,f-d,g-m,A-y).normalize(),t===Ln)i[5].setComponents(c+l,f+d,g+m,A+y).normalize();else if(t===fr)i[5].setComponents(l,d,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ci.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ci.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ci)}intersectsSprite(e){Ci.center.set(0,0,0);const t=tm.distanceTo(e.center);return Ci.radius=.7071067811865476+t,Ci.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ci)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(Vr.x=i.normal.x>0?e.max.x:e.min.x,Vr.y=i.normal.y>0?e.max.y:e.min.y,Vr.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Vr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ed extends Un{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ue(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const _a=new I,va=new I,hh=new Fe,qs=new Ea,Wr=new kn,uo=new I,uh=new I;class tc extends mt{constructor(e=new Ft,t=new ed){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)_a.fromBufferAttribute(t,i-1),va.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=_a.distanceTo(va);e.setAttribute("lineDistance",new at(n,1))}else Te("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Wr.copy(n.boundingSphere),Wr.applyMatrix4(i),Wr.radius+=r,e.ray.intersectsSphere(Wr)===!1)return;hh.copy(i).invert(),qs.copy(e.ray).applyMatrix4(hh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=f,m=p-1;x<m;x+=c){const g=h.getX(x),M=h.getX(x+1),b=Xr(this,e,qs,l,g,M,x);b&&t.push(b)}if(this.isLineLoop){const x=h.getX(p-1),m=h.getX(f),g=Xr(this,e,qs,l,x,m,p-1);g&&t.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(d.count,a.start+a.count);for(let x=f,m=p-1;x<m;x+=c){const g=Xr(this,e,qs,l,x,x+1,x);g&&t.push(g)}if(this.isLineLoop){const x=Xr(this,e,qs,l,p-1,f,p-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Xr(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(_a.fromBufferAttribute(o,i),va.fromBufferAttribute(o,r),t.distanceSqToSegment(_a,va,uo,uh)>n)return;uo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(uo);if(!(c<e.near||c>e.far))return{distance:c,point:uh.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const dh=new I,fh=new I;class nm extends tc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)dh.fromBufferAttribute(t,i),fh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+dh.distanceTo(fh);e.setAttribute("lineDistance",new at(n,1))}else Te("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class im extends tc{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class td extends Un{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const ph=new Fe,Tl=new Ea,qr=new kn,Kr=new I;class sm extends mt{constructor(e=new Ft,t=new td){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),qr.copy(n.boundingSphere),qr.applyMatrix4(i),qr.radius+=r,e.ray.intersectsSphere(qr)===!1)return;ph.copy(i).invert(),Tl.copy(e.ray).applyMatrix4(ph);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,u=n.attributes.position;if(c!==null){const d=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=d,x=f;p<x;p++){const m=c.getX(p);Kr.fromBufferAttribute(u,m),mh(Kr,m,l,i,e,t,this)}}else{const d=Math.max(0,a.start),f=Math.min(u.count,a.start+a.count);for(let p=d,x=f;p<x;p++)Kr.fromBufferAttribute(u,p),mh(Kr,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function mh(s,e,t,n,i,r,a){const o=Tl.distanceSqToPoint(s);if(o<t){const l=new I;Tl.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class nd extends Bt{constructor(e=[],t=Wi,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ws extends Bt{constructor(e,t,n=Fn,i,r,a,o=Lt,l=Lt,c,h=ri,u=1){if(h!==ri&&h!==Bi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:u};super(d,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Jl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class rm extends ws{constructor(e,t=Fn,n=Wi,i,r,a=Lt,o=Lt,l,c=ri){const h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class id extends Bt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class ai extends Ft{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let d=0,f=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(u,2));function p(x,m,g,M,b,y,A,T,R,v,E){const C=y/R,P=A/v,D=y/2,V=A/2,Y=T/2,O=R+1,q=v+1;let H=0,Q=0;const ee=new I;for(let de=0;de<q;de++){const ge=de*P-V;for(let ye=0;ye<O;ye++){const Qe=ye*C-D;ee[x]=Qe*M,ee[m]=ge*b,ee[g]=Y,c.push(ee.x,ee.y,ee.z),ee[x]=0,ee[m]=0,ee[g]=T>0?1:-1,h.push(ee.x,ee.y,ee.z),u.push(ye/R),u.push(1-de/v),H+=1}}for(let de=0;de<v;de++)for(let ge=0;ge<R;ge++){const ye=d+ge+O*de,Qe=d+ge+O*(de+1),_t=d+(ge+1)+O*(de+1),je=d+(ge+1)+O*de;l.push(ye,Qe,je),l.push(Qe,_t,je),Q+=6}o.addGroup(f,Q,E),f+=Q,d+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ai(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Wt extends Ft{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+r,x=i+1,m=new I,g=new I;for(let M=0;M<=p;M++){let b=0,y=0,A=0,T=0;if(M<=n){const E=M/n,C=E*Math.PI/2;y=-h-e*Math.cos(C),A=e*Math.sin(C),T=-e*Math.cos(C),b=E*u}else if(M<=n+r){const E=(M-n)/r;y=-h+E*t,A=e,T=0,b=u+E*d}else{const E=(M-n-r)/n,C=E*Math.PI/2;y=h+e*Math.sin(C),A=e*Math.cos(C),T=e*Math.sin(C),b=u+d+E*u}const R=Math.max(0,Math.min(1,b/f));let v=0;M===0?v=.5/i:M===p&&(v=-.5/i);for(let E=0;E<=i;E++){const C=E/i,P=C*Math.PI*2,D=Math.sin(P),V=Math.cos(P);g.x=-A*V,g.y=y,g.z=A*D,o.push(g.x,g.y,g.z),m.set(-A*V,T,A*D),m.normalize(),l.push(m.x,m.y,m.z),c.push(C+v,R)}if(M>0){const E=(M-1)*x;for(let C=0;C<i;C++){const P=E+C,D=E+C+1,V=M*x+C,Y=M*x+C+1;a.push(P,D,V),a.push(D,Y,V)}}}this.setIndex(a),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wt(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}}class Vi extends Ft{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],f=[];let p=0;const x=[],m=n/2;let g=0;M(),a===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new at(u,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(f,2));function M(){const y=new I,A=new I;let T=0;const R=(t-e)/n;for(let v=0;v<=r;v++){const E=[],C=v/r,P=C*(t-e)+e;for(let D=0;D<=i;D++){const V=D/i,Y=V*l+o,O=Math.sin(Y),q=Math.cos(Y);A.x=P*O,A.y=-C*n+m,A.z=P*q,u.push(A.x,A.y,A.z),y.set(O,R,q).normalize(),d.push(y.x,y.y,y.z),f.push(V,1-C),E.push(p++)}x.push(E)}for(let v=0;v<i;v++)for(let E=0;E<r;E++){const C=x[E][v],P=x[E+1][v],D=x[E+1][v+1],V=x[E][v+1];(e>0||E!==0)&&(h.push(C,P,V),T+=3),(t>0||E!==r-1)&&(h.push(P,D,V),T+=3)}c.addGroup(g,T,0),g+=T}function b(y){const A=p,T=new se,R=new I;let v=0;const E=y===!0?e:t,C=y===!0?1:-1;for(let D=1;D<=i;D++)u.push(0,m*C,0),d.push(0,C,0),f.push(.5,.5),p++;const P=p;for(let D=0;D<=i;D++){const Y=D/i*l+o,O=Math.cos(Y),q=Math.sin(Y);R.x=E*q,R.y=m*C,R.z=E*O,u.push(R.x,R.y,R.z),d.push(0,C,0),T.x=O*.5+.5,T.y=q*.5*C+.5,f.push(T.x,T.y),p++}for(let D=0;D<i;D++){const V=A+D,Y=P+D;y===!0?h.push(Y,Y+1,V):h.push(Y+1,Y,V),v+=3}c.addGroup(g,v,y===!0?1:2),g+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class nc extends Vi{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new nc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Bn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Te("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],d=n[i+1]-h,f=(a-h)/d;return(i+f)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new se:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new I,i=[],r=[],a=[],o=new I,l=new Fe;for(let f=0;f<=e;f++){const p=f/e;i[f]=this.getTangentAt(p,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let f=1;f<=e;f++){if(r[f]=r[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(i[f-1],i[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Ve(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(i[f],r[f])}if(t===!0){let f=Math.acos(Ve(r[0].dot(r[e]),-1,1));f/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(f=-f);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],f*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ic extends Bn{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new se){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class am extends ic{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function sc(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let d=(a-r)/c-(o-r)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+u)+(l-o)/u;d*=h,f*=h,i(a,o,d,f)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const gh=new I,xh=new I,fo=new sc,po=new sc,mo=new sc;class om extends Bn{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new I){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(xh.subVectors(i[0],i[1]).add(i[0]),c=xh);const u=i[o%r],d=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(gh.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=gh),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),fo.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,p,x,m),po.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,p,x,m),mo.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,p,x,m)}else this.curveType==="catmullrom"&&(fo.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),po.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),mo.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(fo.calc(l),po.calc(l),mo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new I().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function _h(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function lm(s,e){const t=1-s;return t*t*e}function cm(s,e){return 2*(1-s)*s*e}function hm(s,e){return s*s*e}function ir(s,e,t,n){return lm(s,e)+cm(s,t)+hm(s,n)}function um(s,e){const t=1-s;return t*t*t*e}function dm(s,e){const t=1-s;return 3*t*t*s*e}function fm(s,e){return 3*(1-s)*s*s*e}function pm(s,e){return s*s*s*e}function sr(s,e,t,n,i){return um(s,e)+dm(s,t)+fm(s,n)+pm(s,i)}class sd extends Bn{constructor(e=new se,t=new se,n=new se,i=new se){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new se){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(sr(e,i.x,r.x,a.x,o.x),sr(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class mm extends Bn{constructor(e=new I,t=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(sr(e,i.x,r.x,a.x,o.x),sr(e,i.y,r.y,a.y,o.y),sr(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class rd extends Bn{constructor(e=new se,t=new se){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new se){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new se){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class gm extends Bn{constructor(e=new I,t=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new I){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new I){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ad extends Bn{constructor(e=new se,t=new se,n=new se){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new se){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(ir(e,i.x,r.x,a.x),ir(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class xm extends Bn{constructor(e=new I,t=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new I){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(ir(e,i.x,r.x,a.x),ir(e,i.y,r.y,a.y),ir(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class od extends Bn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new se){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],u=i[a>i.length-3?i.length-1:a+2];return n.set(_h(o,l.x,c.x,h.x,u.x),_h(o,l.y,c.y,h.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new se().fromArray(i))}return this}}var vh=Object.freeze({__proto__:null,ArcCurve:am,CatmullRomCurve3:om,CubicBezierCurve:sd,CubicBezierCurve3:mm,EllipseCurve:ic,LineCurve:rd,LineCurve3:gm,QuadraticBezierCurve:ad,QuadraticBezierCurve3:xm,SplineCurve:od});class _m extends Bn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new vh[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new vh[i.type]().fromJSON(i))}return this}}class yh extends _m{constructor(e){super(),this.type="Path",this.currentPoint=new se,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new rd(this.currentPoint.clone(),new se(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new ad(this.currentPoint.clone(),new se(e,t),new se(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new sd(this.currentPoint.clone(),new se(e,t),new se(n,i),new se(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new od(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new ic(e,t,n,i,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ld extends yh{constructor(e){super(e),this.uuid=dn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new yh().fromJSON(i))}return this}}function vm(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=cd(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=Tm(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,u=l;for(let d=t;d<i;d+=t){const f=s[d],p=s[d+1];f<o&&(o=f),p<l&&(l=p),f>h&&(h=f),p>u&&(u=p)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return mr(r,a,t,o,l,c,0),a}function cd(s,e,t,n,i){let r;if(i===Um(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=Mh(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Mh(a/n|0,s[a],s[a+1],r);return r&&Rs(r,r.next)&&(xr(r),r=r.next),r}function qi(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(Rs(t,t.next)||gt(t.prev,t,t.next)===0)){if(xr(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function mr(s,e,t,n,i,r,a){if(!s)return;!a&&r&&Cm(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?Mm(s,n,i,r):ym(s)){e.push(l.i,s.i,c.i),xr(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=Sm(qi(s),e),mr(s,e,t,n,i,r,2)):a===2&&bm(s,e,t,n,i,r):mr(qi(s),e,t,n,i,r,1);break}}}function ym(s){const e=s.prev,t=s,n=s.next;if(gt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,r,a),u=Math.min(o,l,c),d=Math.max(i,r,a),f=Math.max(o,l,c);let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=d&&p.y>=u&&p.y<=f&&Qs(i,o,r,l,a,c,p.x,p.y)&&gt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function Mm(s,e,t,n){const i=s.prev,r=s,a=s.next;if(gt(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,u=r.y,d=a.y,f=Math.min(o,l,c),p=Math.min(h,u,d),x=Math.max(o,l,c),m=Math.max(h,u,d),g=El(f,p,e,t,n),M=El(x,m,e,t,n);let b=s.prevZ,y=s.nextZ;for(;b&&b.z>=g&&y&&y.z<=M;){if(b.x>=f&&b.x<=x&&b.y>=p&&b.y<=m&&b!==i&&b!==a&&Qs(o,h,l,u,c,d,b.x,b.y)&&gt(b.prev,b,b.next)>=0||(b=b.prevZ,y.x>=f&&y.x<=x&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&Qs(o,h,l,u,c,d,y.x,y.y)&&gt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;b&&b.z>=g;){if(b.x>=f&&b.x<=x&&b.y>=p&&b.y<=m&&b!==i&&b!==a&&Qs(o,h,l,u,c,d,b.x,b.y)&&gt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;y&&y.z<=M;){if(y.x>=f&&y.x<=x&&y.y>=p&&y.y<=m&&y!==i&&y!==a&&Qs(o,h,l,u,c,d,y.x,y.y)&&gt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Sm(s,e){let t=s;do{const n=t.prev,i=t.next.next;!Rs(n,i)&&ud(n,t,t.next,i)&&gr(n,i)&&gr(i,n)&&(e.push(n.i,t.i,i.i),xr(t),xr(t.next),t=s=i),t=t.next}while(t!==s);return qi(t)}function bm(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Lm(a,o)){let l=dd(a,o);a=qi(a,a.next),l=qi(l,l.next),mr(a,e,t,n,i,r,0),mr(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function Tm(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=cd(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Im(c))}i.sort(Em);for(let r=0;r<i.length;r++)t=Am(i[r],t);return t}function Em(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function Am(s,e){const t=wm(s,e);if(!t)return e;const n=dd(t,s);return qi(n,n.next),qi(t,t.next)}function wm(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(Rs(s,t))return t;do{if(Rs(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const u=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=n&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&hd(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const u=Math.abs(i-t.y)/(n-t.x);gr(t,s)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Rm(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Rm(s,e){return gt(s.prev,s,e.prev)<0&&gt(e.next,s,s.next)<0}function Cm(s,e,t,n){let i=s;do i.z===0&&(i.z=El(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,Pm(i)}function Pm(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function El(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function Im(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function hd(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function Qs(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&hd(s,e,t,n,i,r,a,o)}function Lm(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!Nm(s,e)&&(gr(s,e)&&gr(e,s)&&Dm(s,e)&&(gt(s.prev,s,e.prev)||gt(s,e.prev,e))||Rs(s,e)&&gt(s.prev,s,s.next)>0&&gt(e.prev,e,e.next)>0)}function gt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function Rs(s,e){return s.x===e.x&&s.y===e.y}function ud(s,e,t,n){const i=$r(gt(s,e,t)),r=$r(gt(s,e,n)),a=$r(gt(t,n,s)),o=$r(gt(t,n,e));return!!(i!==r&&a!==o||i===0&&Yr(s,t,e)||r===0&&Yr(s,n,e)||a===0&&Yr(t,s,n)||o===0&&Yr(t,e,n))}function Yr(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function $r(s){return s>0?1:s<0?-1:0}function Nm(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&ud(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function gr(s,e){return gt(s.prev,s,s.next)<0?gt(s,e,s.next)>=0&&gt(s,s.prev,e)>=0:gt(s,e,s.prev)<0||gt(s,s.next,e)<0}function Dm(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function dd(s,e){const t=Al(s.i,s.x,s.y),n=Al(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Mh(s,e,t,n){const i=Al(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function xr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Al(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Um(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class Fm{static triangulate(e,t,n=2){return vm(e,t,n)}}class rr{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return rr.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Sh(e),bh(n,e);let a=e.length;t.forEach(Sh);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,bh(n,t[l]);const o=Fm.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Sh(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function bh(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Aa extends Ft{constructor(e=[new se(0,-.5),new se(.5,0),new se(0,.5)],t=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:n,phiLength:i},t=Math.floor(t),i=Ve(i,0,Math.PI*2);const r=[],a=[],o=[],l=[],c=[],h=1/t,u=new I,d=new se,f=new I,p=new I,x=new I;let m=0,g=0;for(let M=0;M<=e.length-1;M++)switch(M){case 0:m=e[M+1].x-e[M].x,g=e[M+1].y-e[M].y,f.x=g*1,f.y=-m,f.z=g*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case e.length-1:l.push(x.x,x.y,x.z);break;default:m=e[M+1].x-e[M].x,g=e[M+1].y-e[M].y,f.x=g*1,f.y=-m,f.z=g*0,p.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(p)}for(let M=0;M<=t;M++){const b=n+M*h*i,y=Math.sin(b),A=Math.cos(b);for(let T=0;T<=e.length-1;T++){u.x=e[T].x*y,u.y=e[T].y,u.z=e[T].x*A,a.push(u.x,u.y,u.z),d.x=M/t,d.y=T/(e.length-1),o.push(d.x,d.y);const R=l[3*T+0]*y,v=l[3*T+1],E=l[3*T+0]*A;c.push(R,v,E)}}for(let M=0;M<t;M++)for(let b=0;b<e.length-1;b++){const y=b+M*e.length,A=y,T=y+e.length,R=y+e.length+1,v=y+1;r.push(A,T,v),r.push(R,v,T)}this.setIndex(r),this.setAttribute("position",new at(a,3)),this.setAttribute("uv",new at(o,2)),this.setAttribute("normal",new at(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Aa(e.points,e.segments,e.phiStart,e.phiLength)}}class wa extends Ft{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,u=e/o,d=t/l,f=[],p=[],x=[],m=[];for(let g=0;g<h;g++){const M=g*d-a;for(let b=0;b<c;b++){const y=b*u-r;p.push(y,-M,0),x.push(0,0,1),m.push(b/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let M=0;M<o;M++){const b=M+c*g,y=M+c*(g+1),A=M+1+c*(g+1),T=M+1+c*g;f.push(b,y,T),f.push(y,A,T)}this.setIndex(f),this.setAttribute("position",new at(p,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new wa(e.width,e.height,e.widthSegments,e.heightSegments)}}class rc extends Ft{constructor(e=new ld([new se(0,.5),new se(-.5,-.5),new se(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new at(i,3)),this.setAttribute("normal",new at(r,3)),this.setAttribute("uv",new at(a,2));function c(h){const u=i.length/3,d=h.extractPoints(t);let f=d.shape;const p=d.holes;rr.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const M=p[m];rr.isClockWise(M)===!0&&(p[m]=M.reverse())}const x=rr.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const M=p[m];f=f.concat(M)}for(let m=0,g=f.length;m<g;m++){const M=f[m];i.push(M.x,M.y,0),r.push(0,0,1),a.push(M.x,M.y)}for(let m=0,g=x.length;m<g;m++){const M=x[m],b=M[0]+u,y=M[1]+u,A=M[2]+u;n.push(b,y,A),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Om(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new rc(n,e.curveSegments)}}function Om(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Zt extends Ft{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new I,d=new I,f=[],p=[],x=[],m=[];for(let g=0;g<=n;g++){const M=[],b=g/n,y=a+b*o,A=e*Math.cos(y),T=Math.sqrt(e*e-A*A);let R=0;g===0&&a===0?R=.5/t:g===n&&l===Math.PI&&(R=-.5/t);for(let v=0;v<=t;v++){const E=v/t,C=i+E*r;u.x=-T*Math.cos(C),u.y=A,u.z=T*Math.sin(C),p.push(u.x,u.y,u.z),d.copy(u).normalize(),x.push(d.x,d.y,d.z),m.push(E+R,1-b),M.push(c++)}h.push(M)}for(let g=0;g<n;g++)for(let M=0;M<t;M++){const b=h[g][M+1],y=h[g][M],A=h[g+1][M],T=h[g+1][M+1];(g!==0||a>0)&&f.push(b,y,T),(g!==n-1||l<Math.PI)&&f.push(y,A,T)}this.setIndex(f),this.setAttribute("position",new at(p,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Zt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ac extends Ft{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],u=[],d=new I,f=new I,p=new I;for(let x=0;x<=n;x++){const m=a+x/n*o;for(let g=0;g<=i;g++){const M=g/i*r;f.x=(e+t*Math.cos(m))*Math.cos(M),f.y=(e+t*Math.cos(m))*Math.sin(M),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(M),d.y=e*Math.sin(M),p.subVectors(f,d).normalize(),h.push(p.x,p.y,p.z),u.push(g/i),u.push(x/n)}}for(let x=1;x<=n;x++)for(let m=1;m<=i;m++){const g=(i+1)*x+m-1,M=(i+1)*(x-1)+m-1,b=(i+1)*(x-1)+m,y=(i+1)*x+m;l.push(g,M,y),l.push(M,b,y)}this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ac(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}function Cs(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Th(i))i.isRenderTargetTexture?(Te("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Th(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function Yt(s){const e={};for(let t=0;t<s.length;t++){const n=Cs(s[t]);for(const i in n)e[i]=n[i]}return e}function Th(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function km(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function fd(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}const Bm={clone:Cs,merge:Yt};var zm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Hm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class On extends Un{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=zm,this.fragmentShader=Hm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Cs(e.uniforms),this.uniformsGroups=km(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ue().setHex(i.value);break;case"v2":this.uniforms[n].value=new se().fromArray(i.value);break;case"v3":this.uniforms[n].value=new I().fromArray(i.value);break;case"v4":this.uniforms[n].value=new lt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new ke().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Fe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class Gm extends On{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Sr extends Un{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ue(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ue(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ml,this.normalScale=new se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class zn extends Sr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ve(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ue(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ue(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ue(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Vm extends Un{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=jf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Wm extends Un{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Jr(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Xm(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Eh(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function qm(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class Ps{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let a;n:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break t}a=t.length;break n}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}a=n,n=0;break n}break e}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Km extends Ps{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:gs,endingEnd:gs}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case xs:r=e,o=2*t-n;break;case ma:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case xs:a=e,l=2*n-t;break;case ma:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(i-t),x=p*p,m=x*p,g=-d*m+2*d*x-d*p,M=(1+d)*m+(-1.5-2*d)*x+(-.5+d)*p+1,b=(-1-f)*m+(1.5+f)*x+.5*p,y=f*m-f*x;for(let A=0;A!==o;++A)r[A]=g*a[h+A]+M*a[c+A]+b*a[l+A]+y*a[u+A];return r}}class pd extends Ps{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==o;++d)r[d]=a[c+d]*u+a[l+d]*h;return r}}class Ym extends Ps{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class $m extends Ps{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){const p=(n-t)/(i-t),x=1-p;for(let m=0;m!==o;++m)r[m]=a[c+m]*x+a[l+m]*p;return r}const d=o*2,f=e-1;for(let p=0;p!==o;++p){const x=a[c+p],m=a[l+p],g=f*d+p*2,M=u[g],b=u[g+1],y=e*d+p*2,A=h[y],T=h[y+1];let R=(n-t)/(i-t),v,E,C,P,D;for(let V=0;V<8;V++){v=R*R,E=v*R,C=1-R,P=C*C,D=P*C;const O=D*t+3*P*R*M+3*C*v*A+E*i-n;if(Math.abs(O)<1e-10)break;const q=3*P*(M-t)+6*C*R*(A-M)+3*v*(i-A);if(Math.abs(q)<1e-10)break;R=R-O/q,R=Math.max(0,Math.min(1,R))}r[p]=D*x+3*P*R*b+3*C*v*T+E*m}return r}}class Mn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Jr(t,this.TimeBufferType),this.values=Jr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Jr(e.times,Array),values:Jr(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ym(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new pd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Km(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new $m(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case ur:t=this.InterpolantFactoryMethodDiscrete;break;case dr:t=this.InterpolantFactoryMethodLinear;break;case za:t=this.InterpolantFactoryMethodSmooth;break;case kc:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Te("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ur;case this.InterpolantFactoryMethodLinear:return dr;case this.InterpolantFactoryMethodSmooth:return za;case this.InterpolantFactoryMethodBezier:return kc}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ne("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(Ne("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){Ne("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){Ne("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&lp(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){Ne("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===za,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const u=o*n,d=u-n,f=u+n;for(let p=0;p!==n;++p){const x=t[u+p];if(x!==t[d+p]||x!==t[f+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const u=o*n,d=a*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}}Mn.prototype.ValueTypeName="";Mn.prototype.TimeBufferType=Float32Array;Mn.prototype.ValueBufferType=Float32Array;Mn.prototype.DefaultInterpolation=dr;class Is extends Mn{constructor(e,t,n){super(e,t,n)}}Is.prototype.ValueTypeName="bool";Is.prototype.ValueBufferType=Array;Is.prototype.DefaultInterpolation=ur;Is.prototype.InterpolantFactoryMethodLinear=void 0;Is.prototype.InterpolantFactoryMethodSmooth=void 0;class md extends Mn{constructor(e,t,n,i){super(e,t,n,i)}}md.prototype.ValueTypeName="color";class _r extends Mn{constructor(e,t,n,i){super(e,t,n,i)}}_r.prototype.ValueTypeName="number";class Jm extends Ps{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)fn.slerpFlat(r,0,a,c-o,a,c,l);return r}}class vr extends Mn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Jm(this.times,this.values,this.getValueSize(),e)}}vr.prototype.ValueTypeName="quaternion";vr.prototype.InterpolantFactoryMethodSmooth=void 0;class Ls extends Mn{constructor(e,t,n){super(e,t,n)}}Ls.prototype.ValueTypeName="string";Ls.prototype.ValueBufferType=Array;Ls.prototype.DefaultInterpolation=ur;Ls.prototype.InterpolantFactoryMethodLinear=void 0;Ls.prototype.InterpolantFactoryMethodSmooth=void 0;class ya extends Mn{constructor(e,t,n,i){super(e,t,n,i)}}ya.prototype.ValueTypeName="vector";class wl{constructor(e="",t=-1,n=[],i=ql){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=dn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Qm(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Mn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=Xm(l);l=Eh(l,1,h),c=Eh(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new _r(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const u=h[1];let d=i[u];d||(i[u]=d=[]),d.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Zm(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return _r;case"vector":case"vector2":case"vector3":case"vector4":return ya;case"color":return md;case"quaternion":return vr;case"bool":case"boolean":return Is;case"string":return Ls}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Qm(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Zm(s.type);if(s.times===void 0){const t=[],n=[];qm(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}const Qn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Ah(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Ah(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Ah(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class jm{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){const u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){const f=c[u],p=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const e0=new jm;class Ns{constructor(e){this.manager=e!==void 0?e:e0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Ns.DEFAULT_MATERIAL_NAME="__DEFAULT";const qn={};class t0 extends Error{constructor(e,t){super(e),this.response=t}}class gd extends Ns{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=Qn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(qn[e]!==void 0){qn[e].push({onLoad:t,onProgress:n,onError:i});return}qn[e]=[],qn[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Te("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=qn[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,p=f!==0;let x=0;const m=new ReadableStream({start(g){M();function M(){u.read().then(({done:b,value:y})=>{if(b)g.close();else{x+=y.byteLength;const A=new ProgressEvent("progress",{lengthComputable:p,loaded:x,total:f});for(let T=0,R=h.length;T<R;T++){const v=h[T];v.onProgress&&v.onProgress(A)}g.enqueue(y),M()}},b=>{g.error(b)})}}});return new Response(m)}else throw new t0(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const u=/charset="?([^;"\s]*)"?/i.exec(o),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{Qn.add(`file:${e}`,c);const h=qn[e];delete qn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=qn[e];if(h===void 0)throw this.manager.itemError(e),c;delete qn[e];for(let u=0,d=h.length;u<d;u++){const f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const us=new WeakMap;class n0 extends Ns{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Qn.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let u=us.get(a);u===void 0&&(u=[],us.set(a,u)),u.push({onLoad:t,onError:i})}return a}const o=pr("img");function l(){h(),t&&t(this);const u=us.get(this)||[];for(let d=0;d<u.length;d++){const f=u[d];f.onLoad&&f.onLoad(this)}us.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),Qn.remove(`image:${e}`);const d=us.get(this)||[];for(let f=0;f<d.length;f++){const p=d[f];p.onError&&p.onError(u)}us.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),Qn.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class i0 extends Ns{constructor(e){super(e)}load(e,t,n,i){const r=new Bt,a=new n0(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class Ra extends mt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ue(e),this.intensity=t}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class xd extends Ra{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ue(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const go=new Fe,wh=new I,Rh=new I;class oc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new se(512,512),this.mapType=nn,this.map=null,this.mapPass=null,this.matrix=new Fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ec,this._frameExtents=new se(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;wh.setFromMatrixPosition(e.matrixWorld),t.position.copy(wh),Rh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Rh),t.updateMatrixWorld(),go.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(go,t.coordinateSystem,t.reversedDepth),t.coordinateSystem===fr||t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(go)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Zr=new I,Qr=new fn,En=new I;class _d extends mt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Fe,this.projectionMatrix=new Fe,this.projectionMatrixInverse=new Fe,this.coordinateSystem=Ln,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Zr,Qr,En),En.x===1&&En.y===1&&En.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zr,Qr,En.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(Zr,Qr,En),En.x===1&&En.y===1&&En.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Zr,Qr,En.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const gi=new I,Ch=new se,Ph=new se;class Jt extends _d{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=As*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(tr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return As*2*Math.atan(Math.tan(tr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){gi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(gi.x,gi.y).multiplyScalar(-e/gi.z),gi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gi.x,gi.y).multiplyScalar(-e/gi.z)}getViewSize(e,t){return this.getViewBounds(e,Ch,Ph),t.subVectors(Ph,Ch)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(tr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class s0 extends oc{constructor(){super(new Jt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=As*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class r0 extends Ra{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new s0}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class a0 extends oc{constructor(){super(new Jt(90,1,.5,500)),this.isPointLightShadow=!0}}class o0 extends Ra{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new a0}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class Ds extends _d{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class l0 extends oc{constructor(){super(new Ds(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class yr extends Ra{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(mt.DEFAULT_UP),this.updateMatrix(),this.target=new mt,this.shadow=new l0}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class ar{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const xo=new WeakMap;class c0 extends Ns{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Te("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Te("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=Qn.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{xo.has(a)===!0?(i&&i(xo.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(c){Qn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e)}).catch(function(c){i&&i(c),xo.set(l,c),Qn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Qn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ds=-90,fs=1;class h0 extends mt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Jt(ds,fs,e,t);i.layers=this.layers,this.add(i);const r=new Jt(ds,fs,e,t);r.layers=this.layers,this.add(r);const a=new Jt(ds,fs,e,t);a.layers=this.layers,this.add(a);const o=new Jt(ds,fs,e,t);o.layers=this.layers,this.add(o);const l=new Jt(ds,fs,e,t);l.layers=this.layers,this.add(l);const c=new Jt(ds,fs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Ln)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===fr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class u0 extends Jt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class d0{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,a;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,i=this.valueSize,r=e*i+i;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[r+o]=n[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(n,r,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){o.setValue(n,i);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,a=i;r!==a;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let a=0;a!==r;++a)e[t+a]=e[n+a]}_slerp(e,t,n,i){fn.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){const a=this._workIndex*r;fn.multiplyQuaternionsFlat(e,a,e,t,e,n),fn.slerpFlat(e,t,e,t,e,a,i)}_lerp(e,t,n,i,r){const a=1-i;for(let o=0;o!==r;++o){const l=t+o;e[l]=e[l]*a+e[n+o]*i}}_lerpAdditive(e,t,n,i,r){for(let a=0;a!==r;++a){const o=t+a;e[o]=e[o]+e[n+a]*i}}}const lc="\\[\\]\\.:\\/",f0=new RegExp("["+lc+"]","g"),cc="[^"+lc+"]",p0="[^"+lc.replace("\\.","")+"]",m0=/((?:WC+[\/:])*)/.source.replace("WC",cc),g0=/(WCOD+)?/.source.replace("WCOD",p0),x0=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",cc),_0=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",cc),v0=new RegExp("^"+m0+g0+x0+_0+"$"),y0=["material","materials","bones","map"];class M0{constructor(e,t,n){const i=n||tt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class tt{constructor(e,t,n){this.path=t,this.parsedPath=n||tt.parseTrackName(t),this.node=tt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new tt.Composite(e,t,n):new tt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(f0,"")}static parseTrackName(e){const t=v0.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);y0.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=tt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Te("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ne("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ne("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ne("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ne("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){Ne("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;Ne("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}tt.Composite=M0;tt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};tt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};tt.prototype.GetterByBindingType=[tt.prototype._getValue_direct,tt.prototype._getValue_array,tt.prototype._getValue_arrayElement,tt.prototype._getValue_toArray];tt.prototype.SetterByBindingTypeAndVersioning=[[tt.prototype._setValue_direct,tt.prototype._setValue_direct_setNeedsUpdate,tt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_array,tt.prototype._setValue_array_setNeedsUpdate,tt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_arrayElement,tt.prototype._setValue_arrayElement_setNeedsUpdate,tt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[tt.prototype._setValue_fromArray,tt.prototype._setValue_fromArray_setNeedsUpdate,tt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class S0{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;const r=t.tracks,a=r.length,o=new Array(a),l={endingStart:gs,endingEnd:gs};for(let c=0;c!==a;++c){const h=r[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=$f,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const i=this._clip.duration,r=e._clip.duration,a=r/i,o=i/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const i=this._mixer,r=i.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Zf:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case ql:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let i=this.time+e,r=this._loopCount;const a=n===Jf;if(e===0)return r===-1?i:a&&(r&1)===1?t-i:i;if(n===Yf){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=t||i<0){const o=Math.floor(i/t);i-=t*o,r+=Math.abs(o);const l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=r,this.time=i;if(a&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){const i=this._interpolantSettings;n?(i.endingStart=xs,i.endingEnd=xs):(e?i.endingStart=this.zeroSlopeAtStart?xs:gs:i.endingStart=ma,t?i.endingEnd=this.zeroSlopeAtEnd?xs:gs:i.endingEnd=ma)}_scheduleFading(e,t,n){const i=this._mixer,r=i.time;let a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=r,l[0]=t,o[1]=r+e,l[1]=n,this}}const b0=new Float32Array(1);class T0 extends Ti{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,a=e._propertyBindings,o=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){const d=i[u],f=d.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[u]=p;else{if(p=a[u],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const x=t&&t._propertyBindings[u].binding.parsedPath;p=new d0(tt.create(n,f,x),d.ValueTypeName,d.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[u]=p}o[u].resultBuffer=p.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const i=this._actions,r=this._actionsByClip;let a=r[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=i.length,i.push(e),a.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,a=this._actionsByClip,o=a[r],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const u=o.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete a[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const i=this._bindingsByRootAndName,r=this._bindings;let a=i[t];a===void 0&&(a={},i[t]=a),a[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,a=this._bindingsByRootAndName,o=a[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[r],Object.keys(o).length===0&&delete a[i]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new pd(new Float32Array(2),new Float32Array(2),1,b0),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const i=t||this._root,r=i.uuid;let a=typeof e=="string"?wl.findByName(i,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=ql),l!==void 0){const u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new S0(this,a,t,n);return this._bindAction(h,c),this._addInactiveAction(h,o,r),h}existingAction(e,t){const n=t||this._root,i=n.uuid,r=typeof e=="string"?wl.findByName(n,e):e,a=r?r.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){const a=r.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const a in n){const o=n[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(const a in r){const o=r[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const mc=class mc{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};mc.prototype.isMatrix2=!0;let Ih=mc;function Lh(s,e,t,n){const i=E0(n);switch(t){case Vu:return s*e;case Gl:return s*e/i.components*i.byteLength;case Vl:return s*e/i.components*i.byteLength;case Xi:return s*e*2/i.components*i.byteLength;case Wl:return s*e*2/i.components*i.byteLength;case Wu:return s*e*3/i.components*i.byteLength;case un:return s*e*4/i.components*i.byteLength;case Xl:return s*e*4/i.components*i.byteLength;case sa:case ra:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case aa:case oa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Xo:case Ko:return Math.max(s,16)*Math.max(e,8)/4;case Wo:case qo:return Math.max(s,8)*Math.max(e,8)/2;case Yo:case $o:case Zo:case Qo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Jo:case fa:case jo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case el:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case tl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case nl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case il:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case sl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case rl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case al:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case ol:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case ll:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case cl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case hl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ul:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case dl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case fl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case pl:case ml:case gl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case xl:case _l:return Math.ceil(s/4)*Math.ceil(e/4)*8;case pa:case vl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function E0(s){switch(s){case nn:case Bu:return{byteLength:1,components:1};case cr:case zu:case si:return{byteLength:2,components:1};case zl:case Hl:return{byteLength:2,components:4};case Fn:case Bl:case hn:return{byteLength:4,components:1};case Hu:case Gu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:kl}}));typeof window<"u"&&(window.__THREE__?Te("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=kl);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function vd(){let s=null,e=!1,t=null,n=null;function i(r,a){t(r,a),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function A0(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){const h=l.array,u=l.updateRanges;if(s.bindBuffer(c,o),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,p)=>f.start-p.start);let d=0;for(let f=1;f<u.length;f++){const p=u[d],x=u[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,p=u.length;f<p;f++){const x=u[f];s.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var w0=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,R0=`#ifdef USE_ALPHAHASH
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
#endif`,C0=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,P0=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,I0=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,L0=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,N0=`#ifdef USE_AOMAP
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
#endif`,D0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,U0=`#ifdef USE_BATCHING
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
#endif`,F0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,O0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,k0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,B0=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,z0=`#ifdef USE_IRIDESCENCE
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
#endif`,H0=`#ifdef USE_BUMPMAP
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
#endif`,G0=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,V0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,W0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,X0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,q0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,K0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Y0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,$0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,J0=`#define PI 3.141592653589793
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
} // validated`,Z0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Q0=`vec3 transformedNormal = objectNormal;
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
#endif`,j0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,eg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,tg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ng=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ig="gl_FragColor = linearToOutputTexel( gl_FragColor );",sg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rg=`#ifdef USE_ENVMAP
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
#endif`,ag=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,og=`#ifdef USE_ENVMAP
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
#endif`,lg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,cg=`#ifdef USE_ENVMAP
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
#endif`,hg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ug=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,pg=`#ifdef USE_GRADIENTMAP
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
}`,mg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_g=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,vg=`#ifdef USE_ENVMAP
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
#endif`,yg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tg=`PhysicalMaterial material;
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
#endif`,Eg=`uniform sampler2D dfgLUT;
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
}`,Ag=`
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
#endif`,wg=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cg=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,Pg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ig=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ng=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Dg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ug=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Og=`#if defined( USE_POINTS_UV )
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
#endif`,kg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bg=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Hg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vg=`#ifdef USE_MORPHTARGETS
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
#endif`,Wg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qg=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Kg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$g=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Jg=`#ifdef USE_NORMALMAP
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
#endif`,Zg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,jg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ex=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tx=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nx=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ix=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sx=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rx=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ax=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ox=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,lx=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,cx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hx=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ux=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,dx=`float getShadowMask() {
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
}`,fx=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,px=`#ifdef USE_SKINNING
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
#endif`,mx=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gx=`#ifdef USE_SKINNING
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
#endif`,xx=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_x=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,vx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yx=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mx=`#ifdef USE_TRANSMISSION
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
#endif`,Sx=`#ifdef USE_TRANSMISSION
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
#endif`,bx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ax=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const wx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rx=`uniform sampler2D t2D;
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
}`,Cx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Px=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Ix=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Nx=`#include <common>
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
}`,Dx=`#if DEPTH_PACKING == 3200
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
}`,Ux=`#define DISTANCE
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
}`,Fx=`#define DISTANCE
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
}`,Ox=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,kx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bx=`uniform float scale;
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
}`,zx=`uniform vec3 diffuse;
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
}`,Hx=`#include <common>
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
}`,Gx=`uniform vec3 diffuse;
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
}`,Vx=`#define LAMBERT
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
}`,Wx=`#define LAMBERT
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
}`,Xx=`#define MATCAP
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
}`,qx=`#define MATCAP
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
}`,Kx=`#define NORMAL
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
}`,Yx=`#define NORMAL
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
}`,$x=`#define PHONG
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
}`,Jx=`#define PHONG
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
}`,Zx=`#define STANDARD
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
}`,Qx=`#define STANDARD
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
}`,jx=`#define TOON
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
}`,e_=`#define TOON
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
}`,t_=`uniform float size;
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
}`,n_=`uniform vec3 diffuse;
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
}`,i_=`#include <common>
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
}`,s_=`uniform vec3 color;
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
}`,r_=`uniform float rotation;
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
}`,a_=`uniform vec3 diffuse;
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
}`,Ge={alphahash_fragment:w0,alphahash_pars_fragment:R0,alphamap_fragment:C0,alphamap_pars_fragment:P0,alphatest_fragment:I0,alphatest_pars_fragment:L0,aomap_fragment:N0,aomap_pars_fragment:D0,batching_pars_vertex:U0,batching_vertex:F0,begin_vertex:O0,beginnormal_vertex:k0,bsdfs:B0,iridescence_fragment:z0,bumpmap_pars_fragment:H0,clipping_planes_fragment:G0,clipping_planes_pars_fragment:V0,clipping_planes_pars_vertex:W0,clipping_planes_vertex:X0,color_fragment:q0,color_pars_fragment:K0,color_pars_vertex:Y0,color_vertex:$0,common:J0,cube_uv_reflection_fragment:Z0,defaultnormal_vertex:Q0,displacementmap_pars_vertex:j0,displacementmap_vertex:eg,emissivemap_fragment:tg,emissivemap_pars_fragment:ng,colorspace_fragment:ig,colorspace_pars_fragment:sg,envmap_fragment:rg,envmap_common_pars_fragment:ag,envmap_pars_fragment:og,envmap_pars_vertex:lg,envmap_physical_pars_fragment:vg,envmap_vertex:cg,fog_vertex:hg,fog_pars_vertex:ug,fog_fragment:dg,fog_pars_fragment:fg,gradientmap_pars_fragment:pg,lightmap_pars_fragment:mg,lights_lambert_fragment:gg,lights_lambert_pars_fragment:xg,lights_pars_begin:_g,lights_toon_fragment:yg,lights_toon_pars_fragment:Mg,lights_phong_fragment:Sg,lights_phong_pars_fragment:bg,lights_physical_fragment:Tg,lights_physical_pars_fragment:Eg,lights_fragment_begin:Ag,lights_fragment_maps:wg,lights_fragment_end:Rg,lightprobes_pars_fragment:Cg,logdepthbuf_fragment:Pg,logdepthbuf_pars_fragment:Ig,logdepthbuf_pars_vertex:Lg,logdepthbuf_vertex:Ng,map_fragment:Dg,map_pars_fragment:Ug,map_particle_fragment:Fg,map_particle_pars_fragment:Og,metalnessmap_fragment:kg,metalnessmap_pars_fragment:Bg,morphinstance_vertex:zg,morphcolor_vertex:Hg,morphnormal_vertex:Gg,morphtarget_pars_vertex:Vg,morphtarget_vertex:Wg,normal_fragment_begin:Xg,normal_fragment_maps:qg,normal_pars_fragment:Kg,normal_pars_vertex:Yg,normal_vertex:$g,normalmap_pars_fragment:Jg,clearcoat_normal_fragment_begin:Zg,clearcoat_normal_fragment_maps:Qg,clearcoat_pars_fragment:jg,iridescence_pars_fragment:ex,opaque_fragment:tx,packing:nx,premultiplied_alpha_fragment:ix,project_vertex:sx,dithering_fragment:rx,dithering_pars_fragment:ax,roughnessmap_fragment:ox,roughnessmap_pars_fragment:lx,shadowmap_pars_fragment:cx,shadowmap_pars_vertex:hx,shadowmap_vertex:ux,shadowmask_pars_fragment:dx,skinbase_vertex:fx,skinning_pars_vertex:px,skinning_vertex:mx,skinnormal_vertex:gx,specularmap_fragment:xx,specularmap_pars_fragment:_x,tonemapping_fragment:vx,tonemapping_pars_fragment:yx,transmission_fragment:Mx,transmission_pars_fragment:Sx,uv_pars_fragment:bx,uv_pars_vertex:Tx,uv_vertex:Ex,worldpos_vertex:Ax,background_vert:wx,background_frag:Rx,backgroundCube_vert:Cx,backgroundCube_frag:Px,cube_vert:Ix,cube_frag:Lx,depth_vert:Nx,depth_frag:Dx,distance_vert:Ux,distance_frag:Fx,equirect_vert:Ox,equirect_frag:kx,linedashed_vert:Bx,linedashed_frag:zx,meshbasic_vert:Hx,meshbasic_frag:Gx,meshlambert_vert:Vx,meshlambert_frag:Wx,meshmatcap_vert:Xx,meshmatcap_frag:qx,meshnormal_vert:Kx,meshnormal_frag:Yx,meshphong_vert:$x,meshphong_frag:Jx,meshphysical_vert:Zx,meshphysical_frag:Qx,meshtoon_vert:jx,meshtoon_frag:e_,points_vert:t_,points_frag:n_,shadow_vert:i_,shadow_frag:s_,sprite_vert:r_,sprite_frag:a_},ue={common:{diffuse:{value:new Ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new Ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new Ue(16777215)},opacity:{value:1},center:{value:new se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},Cn={basic:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Ge.meshbasic_vert,fragmentShader:Ge.meshbasic_frag},lambert:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ue(0)},envMapIntensity:{value:1}}]),vertexShader:Ge.meshlambert_vert,fragmentShader:Ge.meshlambert_frag},phong:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Ue(0)},specular:{value:new Ue(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphong_vert,fragmentShader:Ge.meshphong_frag},standard:{uniforms:Yt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag},toon:{uniforms:Yt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Ue(0)}}]),vertexShader:Ge.meshtoon_vert,fragmentShader:Ge.meshtoon_frag},matcap:{uniforms:Yt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Ge.meshmatcap_vert,fragmentShader:Ge.meshmatcap_frag},points:{uniforms:Yt([ue.points,ue.fog]),vertexShader:Ge.points_vert,fragmentShader:Ge.points_frag},dashed:{uniforms:Yt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ge.linedashed_vert,fragmentShader:Ge.linedashed_frag},depth:{uniforms:Yt([ue.common,ue.displacementmap]),vertexShader:Ge.depth_vert,fragmentShader:Ge.depth_frag},normal:{uniforms:Yt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Ge.meshnormal_vert,fragmentShader:Ge.meshnormal_frag},sprite:{uniforms:Yt([ue.sprite,ue.fog]),vertexShader:Ge.sprite_vert,fragmentShader:Ge.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ge.background_vert,fragmentShader:Ge.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:Ge.backgroundCube_vert,fragmentShader:Ge.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ge.cube_vert,fragmentShader:Ge.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ge.equirect_vert,fragmentShader:Ge.equirect_frag},distance:{uniforms:Yt([ue.common,ue.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ge.distance_vert,fragmentShader:Ge.distance_frag},shadow:{uniforms:Yt([ue.lights,ue.fog,{color:{value:new Ue(0)},opacity:{value:1}}]),vertexShader:Ge.shadow_vert,fragmentShader:Ge.shadow_frag}};Cn.physical={uniforms:Yt([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new Ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new Ue(0)},specularColor:{value:new Ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:Ge.meshphysical_vert,fragmentShader:Ge.meshphysical_frag};const jr={r:0,b:0,g:0},o_=new Fe,yd=new ke;yd.set(-1,0,0,0,1,0,0,0,1);function l_(s,e,t,n,i,r){const a=new Ue(0);let o=i===!0?0:1,l,c,h=null,u=0,d=null;function f(M){let b=M.isScene===!0?M.background:null;if(b&&b.isTexture){const y=M.backgroundBlurriness>0;b=e.get(b,y)}return b}function p(M){let b=!1;const y=f(M);y===null?m(a,o):y&&y.isColor&&(m(y,1),b=!0);const A=s.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(M,b){const y=f(b);y&&(y.isCubeTexture||y.mapping===Ta)?(c===void 0&&(c=new Le(new ai(1,1,1),new On({name:"BackgroundCubeMaterial",uniforms:Cs(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Qt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(o_.makeRotationFromEuler(b.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(yd),c.material.toneMapped=Ke.getTransfer(y.colorSpace)!==st,(h!==y||u!==y.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,u=y.version,d=s.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Le(new wa(2,2),new On({name:"BackgroundMaterial",uniforms:Cs(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=Ke.getTransfer(y.colorSpace)!==st,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||u!==y.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,u=y.version,d=s.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,b){M.getRGB(jr,fd(s)),t.buffers.color.setClear(jr.r,jr.g,jr.b,b,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,b=1){a.set(M),o=b,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,m(a,o)},render:p,addToRenderList:x,dispose:g}}function c_(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,a=!1;function o(P,D,V,Y,O){let q=!1;const H=u(P,Y,V,D);r!==H&&(r=H,c(r.object)),q=f(P,Y,V,O),q&&p(P,Y,V,O),O!==null&&e.update(O,s.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,y(P,D,V,Y),O!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(O).buffer))}function l(){return s.createVertexArray()}function c(P){return s.bindVertexArray(P)}function h(P){return s.deleteVertexArray(P)}function u(P,D,V,Y){const O=Y.wireframe===!0;let q=n[D.id];q===void 0&&(q={},n[D.id]=q);const H=P.isInstancedMesh===!0?P.id:0;let Q=q[H];Q===void 0&&(Q={},q[H]=Q);let ee=Q[V.id];ee===void 0&&(ee={},Q[V.id]=ee);let de=ee[O];return de===void 0&&(de=d(l()),ee[O]=de),de}function d(P){const D=[],V=[],Y=[];for(let O=0;O<t;O++)D[O]=0,V[O]=0,Y[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:V,attributeDivisors:Y,object:P,attributes:{},index:null}}function f(P,D,V,Y){const O=r.attributes,q=D.attributes;let H=0;const Q=V.getAttributes();for(const ee in Q)if(Q[ee].location>=0){const ge=O[ee];let ye=q[ee];if(ye===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(ye=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(ye=P.instanceColor)),ge===void 0||ge.attribute!==ye||ye&&ge.data!==ye.data)return!0;H++}return r.attributesNum!==H||r.index!==Y}function p(P,D,V,Y){const O={},q=D.attributes;let H=0;const Q=V.getAttributes();for(const ee in Q)if(Q[ee].location>=0){let ge=q[ee];ge===void 0&&(ee==="instanceMatrix"&&P.instanceMatrix&&(ge=P.instanceMatrix),ee==="instanceColor"&&P.instanceColor&&(ge=P.instanceColor));const ye={};ye.attribute=ge,ge&&ge.data&&(ye.data=ge.data),O[ee]=ye,H++}r.attributes=O,r.attributesNum=H,r.index=Y}function x(){const P=r.newAttributes;for(let D=0,V=P.length;D<V;D++)P[D]=0}function m(P){g(P,0)}function g(P,D){const V=r.newAttributes,Y=r.enabledAttributes,O=r.attributeDivisors;V[P]=1,Y[P]===0&&(s.enableVertexAttribArray(P),Y[P]=1),O[P]!==D&&(s.vertexAttribDivisor(P,D),O[P]=D)}function M(){const P=r.newAttributes,D=r.enabledAttributes;for(let V=0,Y=D.length;V<Y;V++)D[V]!==P[V]&&(s.disableVertexAttribArray(V),D[V]=0)}function b(P,D,V,Y,O,q,H){H===!0?s.vertexAttribIPointer(P,D,V,O,q):s.vertexAttribPointer(P,D,V,Y,O,q)}function y(P,D,V,Y){x();const O=Y.attributes,q=V.getAttributes(),H=D.defaultAttributeValues;for(const Q in q){const ee=q[Q];if(ee.location>=0){let de=O[Q];if(de===void 0&&(Q==="instanceMatrix"&&P.instanceMatrix&&(de=P.instanceMatrix),Q==="instanceColor"&&P.instanceColor&&(de=P.instanceColor)),de!==void 0){const ge=de.normalized,ye=de.itemSize,Qe=e.get(de);if(Qe===void 0)continue;const _t=Qe.buffer,je=Qe.type,Z=Qe.bytesPerElement,re=je===s.INT||je===s.UNSIGNED_INT||de.gpuType===Bl;if(de.isInterleavedBufferAttribute){const te=de.data,De=te.stride,Be=de.offset;if(te.isInstancedInterleavedBuffer){for(let Pe=0;Pe<ee.locationSize;Pe++)g(ee.location+Pe,te.meshPerAttribute);P.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Pe=0;Pe<ee.locationSize;Pe++)m(ee.location+Pe);s.bindBuffer(s.ARRAY_BUFFER,_t);for(let Pe=0;Pe<ee.locationSize;Pe++)b(ee.location+Pe,ye/ee.locationSize,je,ge,De*Z,(Be+ye/ee.locationSize*Pe)*Z,re)}else{if(de.isInstancedBufferAttribute){for(let te=0;te<ee.locationSize;te++)g(ee.location+te,de.meshPerAttribute);P.isInstancedMesh!==!0&&Y._maxInstanceCount===void 0&&(Y._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let te=0;te<ee.locationSize;te++)m(ee.location+te);s.bindBuffer(s.ARRAY_BUFFER,_t);for(let te=0;te<ee.locationSize;te++)b(ee.location+te,ye/ee.locationSize,je,ge,ye*Z,ye/ee.locationSize*te*Z,re)}}else if(H!==void 0){const ge=H[Q];if(ge!==void 0)switch(ge.length){case 2:s.vertexAttrib2fv(ee.location,ge);break;case 3:s.vertexAttrib3fv(ee.location,ge);break;case 4:s.vertexAttrib4fv(ee.location,ge);break;default:s.vertexAttrib1fv(ee.location,ge)}}}}M()}function A(){E();for(const P in n){const D=n[P];for(const V in D){const Y=D[V];for(const O in Y){const q=Y[O];for(const H in q)h(q[H].object),delete q[H];delete Y[O]}}delete n[P]}}function T(P){if(n[P.id]===void 0)return;const D=n[P.id];for(const V in D){const Y=D[V];for(const O in Y){const q=Y[O];for(const H in q)h(q[H].object),delete q[H];delete Y[O]}}delete n[P.id]}function R(P){for(const D in n){const V=n[D];for(const Y in V){const O=V[Y];if(O[P.id]===void 0)continue;const q=O[P.id];for(const H in q)h(q[H].object),delete q[H];delete O[P.id]}}}function v(P){for(const D in n){const V=n[D],Y=P.isInstancedMesh===!0?P.id:0,O=V[Y];if(O!==void 0){for(const q in O){const H=O[q];for(const Q in H)h(H[Q].object),delete H[Q];delete O[q]}delete V[Y],Object.keys(V).length===0&&delete n[D]}}}function E(){C(),a=!0,r!==i&&(r=i,c(r.object))}function C(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:E,resetDefaultState:C,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:x,enableAttribute:m,disableUnusedAttributes:M}}function h_(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function u_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==un&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const v=R===si&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==nn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==hn&&!v)}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Te("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&Te("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),M=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),A=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:M,maxVaryings:b,maxFragmentUniforms:y,maxSamples:A,samples:T}}function d_(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new Li,o=new ke,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){const p=u.clippingPlanes,x=u.clipIntersection,m=u.clipShadows,g=s.get(u);if(!i||p===null||p.length===0||r&&!m)r?h(null):c();else{const M=r?0:n,b=M*4;let y=g.clippingState||null;l.value=y,y=h(p,d,b,f);for(let A=0;A!==b;++A)y[A]=t[A];g.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,p){const x=u!==null?u.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const g=f+x*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<g)&&(m=new Float32Array(g));for(let b=0,y=f;b!==x;++b,y+=4)a.copy(u[b]).applyMatrix4(M,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}const yi=4,Nh=[.125,.215,.35,.446,.526,.582],Di=20,f_=256,Ks=new Ds,Dh=new Ue;let _o=null,vo=0,yo=0,Mo=!1;const p_=new I;class Uh{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=p_}=r;_o=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),Mo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Oh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(_o,vo,yo),this._renderer.xr.enabled=Mo,e.scissorTest=!1,ps(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Wi||e.mapping===Ts?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_o=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),Mo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Nt,minFilter:Nt,generateMipmaps:!1,type:si,format:un,colorSpace:sn,depthBuffer:!1},i=Fh(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Fh(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=m_(r)),this._blurMaterial=x_(r,e,t),this._ggxMaterial=g_(r,e,t)}return i}_compileMaterial(e){const t=new Le(new Ft,e);this._renderer.compile(t,Ks)}_sceneToCubeUV(e,t,n,i,r){const l=new Jt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Dh),u.toneMapping=Nn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Le(new ai,new zi({name:"PMREM.Background",side:Qt,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let g=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,g=!0):(m.color.copy(Dh),g=!0);for(let b=0;b<6;b++){const y=b%3;y===0?(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[b],r.y,r.z)):y===1?(l.up.set(0,0,c[b]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[b],r.z)):(l.up.set(0,c[b],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[b]));const A=this._cubeSize;ps(i,y*A,b>2?A:0,A,A),u.setRenderTarget(i),g&&u.render(x,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Wi||e.mapping===Ts;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=kh()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Oh());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;ps(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,Ks)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=0+c*1.25,f=u*d,{_lodMax:p}=this,x=this._sizeLods[n],m=3*x*(n>p-yi?n-p+yi:0),g=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=p-t,ps(r,m,g,3*x,2*x),i.setRenderTarget(r),i.render(o,Ks),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,ps(e,m,g,3*x,2*x),i.setRenderTarget(e),i.render(o,Ks)}_blur(e,t,n,i,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,i,"latitudinal",r),this._halfBlur(a,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Ne("blur direction must be either latitudinal or longitudinal!");const h=3,u=this._lodMeshes[i];u.material=c;const d=c.uniforms,f=this._sizeLods[n]-1,p=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Di-1),x=r/p,m=isFinite(r)?1+Math.floor(h*x):Di;m>Di&&Te(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Di}`);const g=[];let M=0;for(let R=0;R<Di;++R){const v=R/x,E=Math.exp(-v*v/2);g.push(E),R===0?M+=E:R<m&&(M+=2*E)}for(let R=0;R<g.length;R++)g[R]=g[R]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=g,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:b}=this;d.dTheta.value=p,d.mipInt.value=b-n;const y=this._sizeLods[i],A=3*y*(i>b-yi?i-b+yi:0),T=4*(this._cubeSize-y);ps(t,A,T,3*y,2*y),l.setRenderTarget(t),l.render(u,Ks)}}function m_(s){const e=[],t=[],n=[];let i=s;const r=s-yi+1+Nh.length;for(let a=0;a<r;a++){const o=Math.pow(2,i);e.push(o);let l=1/o;a>s-yi?l=Nh[a-s+yi-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,u=1+c,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,p=6,x=3,m=2,g=1,M=new Float32Array(x*p*f),b=new Float32Array(m*p*f),y=new Float32Array(g*p*f);for(let T=0;T<f;T++){const R=T%3*2/3-1,v=T>2?0:-1,E=[R,v,0,R+2/3,v,0,R+2/3,v+1,0,R,v,0,R+2/3,v+1,0,R,v+1,0];M.set(E,x*p*T),b.set(d,m*p*T);const C=[T,T,T,T,T,T];y.set(C,g*p*T)}const A=new Ft;A.setAttribute("position",new Xt(M,x)),A.setAttribute("uv",new Xt(b,m)),A.setAttribute("faceIndex",new Xt(y,g)),n.push(new Le(A,null)),i>yi&&i--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function Fh(s,e,t){const n=new Dn(s,e,t);return n.texture.mapping=Ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function ps(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function g_(s,e,t){return new On({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:f_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Ca(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function x_(s,e,t){const n=new Float32Array(Di),i=new I(0,1,0);return new On({name:"SphericalGaussianBlur",defines:{n:Di,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Ca(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function Oh(){return new On({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ca(),fragmentShader:`

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
		`,blending:ei,depthTest:!1,depthWrite:!1})}function kh(){return new On({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ca(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ei,depthTest:!1,depthWrite:!1})}function Ca(){return`

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
	`}class Md extends Dn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new nd(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ai(5,5,5),r=new On({name:"CubemapFromEquirect",uniforms:Cs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Qt,blending:ei});r.uniforms.tEquirect.value=t;const a=new Le(i,r),o=t.minFilter;return t.minFilter===Zn&&(t.minFilter=Nt),new h0(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function __(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?a(d):r(d)}function r(d){if(d&&d.isTexture){const f=d.mapping;if(f===ka||f===Ba)if(e.has(d)){const p=e.get(d).texture;return o(p,d.mapping)}else{const p=d.image;if(p&&p.height>0){const x=new Md(p.height);return x.fromEquirectangularTexture(s,d),e.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const f=d.mapping,p=f===ka||f===Ba,x=f===Wi||f===Ts;if(p||x){let m=t.get(d);const g=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==g)return n===null&&(n=new Uh(s)),m=p?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{const M=d.image;return p&&M&&M.height>0||x&&M&&l(M)?(n===null&&(n=new Uh(s)),m=p?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function o(d,f){return f===ka?d.mapping=Wi:f===Ba&&(d.mapping=Ts),d}function l(d){let f=0;const p=6;for(let x=0;x<p;x++)d[x]!==void 0&&f++;return f===p}function c(d){const f=d.target;f.removeEventListener("dispose",c);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function h(d){const f=d.target;f.removeEventListener("dispose",h);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function v_(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&vs("WebGLRenderer: "+n+" extension not supported."),i}}}function y_(s,e,t,n){const i={},r=new WeakMap;function a(u){const d=u.target;d.index!==null&&e.remove(d.index);for(const p in d.attributes)e.remove(d.attributes[p]);d.removeEventListener("dispose",a),delete i[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(u,d){return i[d.id]===!0||(d.addEventListener("dispose",a),i[d.id]=!0,t.memory.geometries++),d}function l(u){const d=u.attributes;for(const f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(u){const d=[],f=u.index,p=u.attributes.position;let x=0;if(p===void 0)return;if(f!==null){const M=f.array;x=f.version;for(let b=0,y=M.length;b<y;b+=3){const A=M[b+0],T=M[b+1],R=M[b+2];d.push(A,T,T,R,R,A)}}else{const M=p.array;x=p.version;for(let b=0,y=M.length/3-1;b<y;b+=3){const A=b+0,T=b+1,R=b+2;d.push(A,T,T,R,R,A)}}const m=new(p.count>=65535?Qu:Zu)(d,1);m.version=x;const g=r.get(u);g&&e.remove(g),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function M_(s,e,t){let n;function i(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*a),t.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*a,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let x=0;for(let m=0;m<f;m++)x+=d[m];t.update(x,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function S_(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:Ne("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function b_(s,e,t){const n=new WeakMap,i=new lt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(o);if(d===void 0||d.count!==u){let C=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",C)};var f=C;d!==void 0&&d.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),x===!0&&(y=2),m===!0&&(y=3);let A=o.attributes.position.count*y,T=1;A>e.maxTextureSize&&(T=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const R=new Float32Array(A*T*4*u),v=new Ku(R,A,T,u);v.type=hn,v.needsUpdate=!0;const E=y*4;for(let P=0;P<u;P++){const D=g[P],V=M[P],Y=b[P],O=A*T*4*P;for(let q=0;q<D.count;q++){const H=q*E;p===!0&&(i.fromBufferAttribute(D,q),R[O+H+0]=i.x,R[O+H+1]=i.y,R[O+H+2]=i.z,R[O+H+3]=0),x===!0&&(i.fromBufferAttribute(V,q),R[O+H+4]=i.x,R[O+H+5]=i.y,R[O+H+6]=i.z,R[O+H+7]=0),m===!0&&(i.fromBufferAttribute(Y,q),R[O+H+8]=i.x,R[O+H+9]=i.y,R[O+H+10]=i.z,R[O+H+11]=Y.itemSize===4?i.w:1)}}d={count:u,texture:v,size:new se(A,T)},n.set(o,d),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const x=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(s,"morphTargetBaseInfluence",x),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function T_(s,e,t,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const E_={[Pu]:"LINEAR_TONE_MAPPING",[Iu]:"REINHARD_TONE_MAPPING",[Lu]:"CINEON_TONE_MAPPING",[Nu]:"ACES_FILMIC_TONE_MAPPING",[Uu]:"AGX_TONE_MAPPING",[Fu]:"NEUTRAL_TONE_MAPPING",[Du]:"CUSTOM_TONE_MAPPING"};function A_(s,e,t,n,i,r){const a=new Dn(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,depthTexture:i?new ws(e,t):void 0}),o=new Dn(e,t,{type:si,depthBuffer:!1,stencilBuffer:!1}),l=new Ft;l.setAttribute("position",new at([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new at([0,2,0,0,2,0],2));const c=new Gm({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Le(l,c),u=new Ds(-1,1,1,-1,0,1);let d=null,f=null,p=!1,x,m=null,g=[],M=!1;this.setSize=function(b,y){a.setSize(b,y),o.setSize(b,y);for(let A=0;A<g.length;A++){const T=g[A];T.setSize&&T.setSize(b,y)}},this.setEffects=function(b){g=b,M=g.length>0&&g[0].isRenderPass===!0;const y=a.width,A=a.height;for(let T=0;T<g.length;T++){const R=g[T];R.setSize&&R.setSize(y,A)}},this.begin=function(b,y){if(p||b.toneMapping===Nn&&g.length===0)return!1;if(m=y,y!==null){const A=y.width,T=y.height;(a.width!==A||a.height!==T)&&this.setSize(A,T)}return M===!1&&b.setRenderTarget(a),x=b.toneMapping,b.toneMapping=Nn,!0},this.hasRenderPass=function(){return M},this.end=function(b,y){b.toneMapping=x,p=!0;let A=a,T=o;for(let R=0;R<g.length;R++){const v=g[R];if(v.enabled!==!1&&(v.render(b,T,A,y),v.needsSwap!==!1)){const E=A;A=T,T=E}}if(d!==b.outputColorSpace||f!==b.toneMapping){d=b.outputColorSpace,f=b.toneMapping,c.defines={},Ke.getTransfer(d)===st&&(c.defines.SRGB_TRANSFER="");const R=E_[f];R&&(c.defines[R]=""),c.needsUpdate=!0}c.uniforms.tDiffuse.value=A.texture,b.setRenderTarget(m),b.render(h,u),m=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.depthTexture&&a.depthTexture.dispose(),a.dispose(),o.dispose(),l.dispose(),c.dispose()}}const Sd=new Bt,Rl=new ws(1,1),bd=new Ku,Td=new Dp,Ed=new nd,Bh=[],zh=[],Hh=new Float32Array(16),Gh=new Float32Array(9),Vh=new Float32Array(4);function Us(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=Bh[i];if(r===void 0&&(r=new Float32Array(i),Bh[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Dt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function Ut(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Pa(s,e){let t=zh[e];t===void 0&&(t=new Int32Array(e),zh[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function w_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function R_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;s.uniform2fv(this.addr,e),Ut(t,e)}}function C_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;s.uniform3fv(this.addr,e),Ut(t,e)}}function P_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;s.uniform4fv(this.addr,e),Ut(t,e)}}function I_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,n))return;Vh.set(n),s.uniformMatrix2fv(this.addr,!1,Vh),Ut(t,n)}}function L_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,n))return;Gh.set(n),s.uniformMatrix3fv(this.addr,!1,Gh),Ut(t,n)}}function N_(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Dt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Dt(t,n))return;Hh.set(n),s.uniformMatrix4fv(this.addr,!1,Hh),Ut(t,n)}}function D_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function U_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;s.uniform2iv(this.addr,e),Ut(t,e)}}function F_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;s.uniform3iv(this.addr,e),Ut(t,e)}}function O_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;s.uniform4iv(this.addr,e),Ut(t,e)}}function k_(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function B_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;s.uniform2uiv(this.addr,e),Ut(t,e)}}function z_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;s.uniform3uiv(this.addr,e),Ut(t,e)}}function H_(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;s.uniform4uiv(this.addr,e),Ut(t,e)}}function G_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Rl.compareFunction=t.isReversedDepthBuffer()?Yl:Kl,r=Rl):r=Sd,t.setTexture2D(e||r,i)}function V_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Td,i)}function W_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Ed,i)}function X_(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||bd,i)}function q_(s){switch(s){case 5126:return w_;case 35664:return R_;case 35665:return C_;case 35666:return P_;case 35674:return I_;case 35675:return L_;case 35676:return N_;case 5124:case 35670:return D_;case 35667:case 35671:return U_;case 35668:case 35672:return F_;case 35669:case 35673:return O_;case 5125:return k_;case 36294:return B_;case 36295:return z_;case 36296:return H_;case 35678:case 36198:case 36298:case 36306:case 35682:return G_;case 35679:case 36299:case 36307:return V_;case 35680:case 36300:case 36308:case 36293:return W_;case 36289:case 36303:case 36311:case 36292:return X_}}function K_(s,e){s.uniform1fv(this.addr,e)}function Y_(s,e){const t=Us(e,this.size,2);s.uniform2fv(this.addr,t)}function $_(s,e){const t=Us(e,this.size,3);s.uniform3fv(this.addr,t)}function J_(s,e){const t=Us(e,this.size,4);s.uniform4fv(this.addr,t)}function Z_(s,e){const t=Us(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Q_(s,e){const t=Us(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function j_(s,e){const t=Us(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function ev(s,e){s.uniform1iv(this.addr,e)}function tv(s,e){s.uniform2iv(this.addr,e)}function nv(s,e){s.uniform3iv(this.addr,e)}function iv(s,e){s.uniform4iv(this.addr,e)}function sv(s,e){s.uniform1uiv(this.addr,e)}function rv(s,e){s.uniform2uiv(this.addr,e)}function av(s,e){s.uniform3uiv(this.addr,e)}function ov(s,e){s.uniform4uiv(this.addr,e)}function lv(s,e,t){const n=this.cache,i=e.length,r=Pa(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Rl:a=Sd;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function cv(s,e,t){const n=this.cache,i=e.length,r=Pa(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Td,r[a])}function hv(s,e,t){const n=this.cache,i=e.length,r=Pa(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Ed,r[a])}function uv(s,e,t){const n=this.cache,i=e.length,r=Pa(t,i);Dt(n,r)||(s.uniform1iv(this.addr,r),Ut(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||bd,r[a])}function dv(s){switch(s){case 5126:return K_;case 35664:return Y_;case 35665:return $_;case 35666:return J_;case 35674:return Z_;case 35675:return Q_;case 35676:return j_;case 5124:case 35670:return ev;case 35667:case 35671:return tv;case 35668:case 35672:return nv;case 35669:case 35673:return iv;case 5125:return sv;case 36294:return rv;case 36295:return av;case 36296:return ov;case 35678:case 36198:case 36298:case 36306:case 35682:return lv;case 35679:case 36299:case 36307:return cv;case 35680:case 36300:case 36308:case 36293:return hv;case 36289:case 36303:case 36311:case 36292:return uv}}class fv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=q_(t.type)}}class pv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=dv(t.type)}}class mv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const So=/(\w+)(\])?(\[|\.)?/g;function Wh(s,e){s.seq.push(e),s.map[e.id]=e}function gv(s,e,t){const n=s.name,i=n.length;for(So.lastIndex=0;;){const r=So.exec(n),a=So.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Wh(t,c===void 0?new fv(o,s,e):new pv(o,s,e));break}else{let u=t.map[o];u===void 0&&(u=new mv(o),Wh(t,u)),t=u}}}class la{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);gv(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function Xh(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const xv=37297;let _v=0;function vv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const qh=new ke;function yv(s){Ke._getMatrix(qh,Ke.workingColorSpace,s);const e=`mat3( ${qh.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(s)){case ga:return[e,"LinearTransferOETF"];case st:return[e,"sRGBTransferOETF"];default:return Te("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Kh(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+vv(s.getShaderSource(e),o)}else return r}function Mv(s,e){const t=yv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const Sv={[Pu]:"Linear",[Iu]:"Reinhard",[Lu]:"Cineon",[Nu]:"ACESFilmic",[Uu]:"AgX",[Fu]:"Neutral",[Du]:"Custom"};function bv(s,e){const t=Sv[e];return t===void 0?(Te("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ea=new I;function Tv(){Ke.getLuminanceCoefficients(ea);const s=ea.x.toFixed(4),e=ea.y.toFixed(4),t=ea.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Ev(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(js).join(`
`)}function Av(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function wv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function js(s){return s!==""}function Yh(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function $h(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Rv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Cl(s){return s.replace(Rv,Pv)}const Cv=new Map;function Pv(s,e){let t=Ge[e];if(t===void 0){const n=Cv.get(e);if(n!==void 0)t=Ge[n],Te('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Cl(t)}const Iv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Jh(s){return s.replace(Iv,Lv)}function Lv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Zh(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Nv={[na]:"SHADOWMAP_TYPE_PCF",[Js]:"SHADOWMAP_TYPE_VSM"};function Dv(s){return Nv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Uv={[Wi]:"ENVMAP_TYPE_CUBE",[Ts]:"ENVMAP_TYPE_CUBE",[Ta]:"ENVMAP_TYPE_CUBE_UV"};function Fv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Uv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const Ov={[Ts]:"ENVMAP_MODE_REFRACTION"};function kv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Ov[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Bv={[Cu]:"ENVMAP_BLENDING_MULTIPLY",[Xf]:"ENVMAP_BLENDING_MIX",[qf]:"ENVMAP_BLENDING_ADD"};function zv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Bv[s.combine]||"ENVMAP_BLENDING_NONE"}function Hv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Gv(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Dv(t),c=Fv(t),h=kv(t),u=zv(t),d=Hv(t),f=Ev(t),p=Av(r),x=i.createProgram();let m,g,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(js).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(js).join(`
`),g.length>0&&(g+=`
`)):(m=[Zh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(js).join(`
`),g=[Zh(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Nn?"#define TONE_MAPPING":"",t.toneMapping!==Nn?Ge.tonemapping_pars_fragment:"",t.toneMapping!==Nn?bv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ge.colorspace_pars_fragment,Mv("linearToOutputTexel",t.outputColorSpace),Tv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(js).join(`
`)),a=Cl(a),a=Yh(a,t),a=$h(a,t),o=Cl(o),o=Yh(o,t),o=$h(o,t),a=Jh(a),o=Jh(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",t.glslVersion===zc?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===zc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const b=M+m+a,y=M+g+o,A=Xh(i,i.VERTEX_SHADER,b),T=Xh(i,i.FRAGMENT_SHADER,y);i.attachShader(x,A),i.attachShader(x,T),t.index0AttributeName!==void 0?i.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function R(P){if(s.debug.checkShaderErrors){const D=i.getProgramInfoLog(x)||"",V=i.getShaderInfoLog(A)||"",Y=i.getShaderInfoLog(T)||"",O=D.trim(),q=V.trim(),H=Y.trim();let Q=!0,ee=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(Q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,x,A,T);else{const de=Kh(i,A,"vertex"),ge=Kh(i,T,"fragment");Ne("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+O+`
`+de+`
`+ge)}else O!==""?Te("WebGLProgram: Program Info Log:",O):(q===""||H==="")&&(ee=!1);ee&&(P.diagnostics={runnable:Q,programLog:O,vertexShader:{log:q,prefix:m},fragmentShader:{log:H,prefix:g}})}i.deleteShader(A),i.deleteShader(T),v=new la(i,x),E=wv(i,x)}let v;this.getUniforms=function(){return v===void 0&&R(this),v};let E;this.getAttributes=function(){return E===void 0&&R(this),E};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(x,xv)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=_v++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=A,this.fragmentShader=T,this}let Vv=0;class Wv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Xv(e),t.set(e,n)),n}}class Xv{constructor(e){this.id=Vv++,this.code=e,this.usedTimes=0}}function qv(s){return s===Xi||s===fa||s===pa}function Kv(s,e,t,n,i,r){const a=new Yu,o=new Wv,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer;let d=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(v){return l.add(v),v===0?"uv":`uv${v}`}function x(v,E,C,P,D,V){const Y=P.fog,O=D.geometry,q=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,H=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,Q=e.get(v.envMap||q,H),ee=Q&&Q.mapping===Ta?Q.image.height:null,de=f[v.type];v.precision!==null&&(d=n.getMaxPrecision(v.precision),d!==v.precision&&Te("WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));const ge=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,ye=ge!==void 0?ge.length:0;let Qe=0;O.morphAttributes.position!==void 0&&(Qe=1),O.morphAttributes.normal!==void 0&&(Qe=2),O.morphAttributes.color!==void 0&&(Qe=3);let _t,je,Z,re;if(de){const Se=Cn[de];_t=Se.vertexShader,je=Se.fragmentShader}else{_t=v.vertexShader,je=v.fragmentShader;const Se=o.getVertexShaderStage(v),yt=o.getFragmentShaderStage(v);o.update(v,Se,yt),Z=Se.id,re=yt.id}const te=s.getRenderTarget(),De=s.state.buffers.depth.getReversed(),Be=D.isInstancedMesh===!0,Pe=D.isBatchedMesh===!0,St=!!v.map,Ye=!!v.matcap,ct=!!Q,et=!!v.aoMap,$e=!!v.lightMap,At=!!v.bumpMap&&v.wireframe===!1,Pt=!!v.normalMap,Ot=!!v.displacementMap,zt=!!v.emissiveMap,vt=!!v.metalnessMap,wt=!!v.roughnessMap,N=v.anisotropy>0,$t=v.clearcoat>0,nt=v.dispersion>0,w=v.iridescence>0,_=v.sheen>0,F=v.transmission>0,z=N&&!!v.anisotropyMap,W=$t&&!!v.clearcoatMap,ne=$t&&!!v.clearcoatNormalMap,ae=$t&&!!v.clearcoatRoughnessMap,X=w&&!!v.iridescenceMap,J=w&&!!v.iridescenceThicknessMap,oe=_&&!!v.sheenColorMap,Ae=_&&!!v.sheenRoughnessMap,he=!!v.specularMap,le=!!v.specularColorMap,Ce=!!v.specularIntensityMap,Ie=F&&!!v.transmissionMap,ze=F&&!!v.thicknessMap,L=!!v.gradientMap,ie=!!v.alphaMap,$=v.alphaTest>0,ce=!!v.alphaHash,me=!!v.extensions;let j=Nn;v.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(j=s.toneMapping);const Ee={shaderID:de,shaderType:v.type,shaderName:v.name,vertexShader:_t,fragmentShader:je,defines:v.defines,customVertexShaderID:Z,customFragmentShaderID:re,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:Pe,batchingColor:Pe&&D._colorsTexture!==null,instancing:Be,instancingColor:Be&&D.instanceColor!==null,instancingMorph:Be&&D.morphTexture!==null,outputColorSpace:te===null?s.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:Ke.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:St,matcap:Ye,envMap:ct,envMapMode:ct&&Q.mapping,envMapCubeUVHeight:ee,aoMap:et,lightMap:$e,bumpMap:At,normalMap:Pt,displacementMap:Ot,emissiveMap:zt,normalMapObjectSpace:Pt&&v.normalMapType===ep,normalMapTangentSpace:Pt&&v.normalMapType===Ml,packedNormalMap:Pt&&v.normalMapType===Ml&&qv(v.normalMap.format),metalnessMap:vt,roughnessMap:wt,anisotropy:N,anisotropyMap:z,clearcoat:$t,clearcoatMap:W,clearcoatNormalMap:ne,clearcoatRoughnessMap:ae,dispersion:nt,iridescence:w,iridescenceMap:X,iridescenceThicknessMap:J,sheen:_,sheenColorMap:oe,sheenRoughnessMap:Ae,specularMap:he,specularColorMap:le,specularIntensityMap:Ce,transmission:F,transmissionMap:Ie,thicknessMap:ze,gradientMap:L,opaque:v.transparent===!1&&v.blending===_s&&v.alphaToCoverage===!1,alphaMap:ie,alphaTest:$,alphaHash:ce,combine:v.combine,mapUv:St&&p(v.map.channel),aoMapUv:et&&p(v.aoMap.channel),lightMapUv:$e&&p(v.lightMap.channel),bumpMapUv:At&&p(v.bumpMap.channel),normalMapUv:Pt&&p(v.normalMap.channel),displacementMapUv:Ot&&p(v.displacementMap.channel),emissiveMapUv:zt&&p(v.emissiveMap.channel),metalnessMapUv:vt&&p(v.metalnessMap.channel),roughnessMapUv:wt&&p(v.roughnessMap.channel),anisotropyMapUv:z&&p(v.anisotropyMap.channel),clearcoatMapUv:W&&p(v.clearcoatMap.channel),clearcoatNormalMapUv:ne&&p(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&p(v.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&p(v.iridescenceMap.channel),iridescenceThicknessMapUv:J&&p(v.iridescenceThicknessMap.channel),sheenColorMapUv:oe&&p(v.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&p(v.sheenRoughnessMap.channel),specularMapUv:he&&p(v.specularMap.channel),specularColorMapUv:le&&p(v.specularColorMap.channel),specularIntensityMapUv:Ce&&p(v.specularIntensityMap.channel),transmissionMapUv:Ie&&p(v.transmissionMap.channel),thicknessMapUv:ze&&p(v.thicknessMap.channel),alphaMapUv:ie&&p(v.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(Pt||N),vertexNormals:!!O.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!O.attributes.uv&&(St||ie),fog:!!Y,useFog:v.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||O.attributes.normal===void 0&&Pt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:De,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:O.attributes.position!==void 0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:Qe,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:j,decodeVideoTexture:St&&v.map.isVideoTexture===!0&&Ke.getTransfer(v.map.colorSpace)===st,decodeVideoTextureEmissive:zt&&v.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(v.emissiveMap.colorSpace)===st,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Pn,flipSided:v.side===Qt,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:me&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&v.extensions.multiDraw===!0||Pe)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ee.vertexUv1s=l.has(1),Ee.vertexUv2s=l.has(2),Ee.vertexUv3s=l.has(3),l.clear(),Ee}function m(v){const E=[];if(v.shaderID?E.push(v.shaderID):(E.push(v.customVertexShaderID),E.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)E.push(C),E.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(g(E,v),M(E,v),E.push(s.outputColorSpace)),E.push(v.customProgramCacheKey),E.join()}function g(v,E){v.push(E.precision),v.push(E.outputColorSpace),v.push(E.envMapMode),v.push(E.envMapCubeUVHeight),v.push(E.mapUv),v.push(E.alphaMapUv),v.push(E.lightMapUv),v.push(E.aoMapUv),v.push(E.bumpMapUv),v.push(E.normalMapUv),v.push(E.displacementMapUv),v.push(E.emissiveMapUv),v.push(E.metalnessMapUv),v.push(E.roughnessMapUv),v.push(E.anisotropyMapUv),v.push(E.clearcoatMapUv),v.push(E.clearcoatNormalMapUv),v.push(E.clearcoatRoughnessMapUv),v.push(E.iridescenceMapUv),v.push(E.iridescenceThicknessMapUv),v.push(E.sheenColorMapUv),v.push(E.sheenRoughnessMapUv),v.push(E.specularMapUv),v.push(E.specularColorMapUv),v.push(E.specularIntensityMapUv),v.push(E.transmissionMapUv),v.push(E.thicknessMapUv),v.push(E.combine),v.push(E.fogExp2),v.push(E.sizeAttenuation),v.push(E.morphTargetsCount),v.push(E.morphAttributeCount),v.push(E.numDirLights),v.push(E.numPointLights),v.push(E.numSpotLights),v.push(E.numSpotLightMaps),v.push(E.numHemiLights),v.push(E.numRectAreaLights),v.push(E.numDirLightShadows),v.push(E.numPointLightShadows),v.push(E.numSpotLightShadows),v.push(E.numSpotLightShadowsWithMaps),v.push(E.numLightProbes),v.push(E.shadowMapType),v.push(E.toneMapping),v.push(E.numClippingPlanes),v.push(E.numClipIntersection),v.push(E.depthPacking)}function M(v,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function b(v){const E=f[v.type];let C;if(E){const P=Cn[E];C=Bm.clone(P.uniforms)}else C=v.uniforms;return C}function y(v,E){let C=h.get(E);return C!==void 0?++C.usedTimes:(C=new Gv(s,E,v,i),c.push(C),h.set(E,C)),C}function A(v){if(--v.usedTimes===0){const E=c.indexOf(v);c[E]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function T(v){o.remove(v)}function R(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:b,acquireProgram:y,releaseProgram:A,releaseShaderCache:T,programs:c,dispose:R}}function Yv(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function $v(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Qh(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function jh(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,p,x,m,g){let M=s[e];return M===void 0?(M={id:d.id,object:d,geometry:f,material:p,materialVariant:a(d),groupOrder:x,renderOrder:d.renderOrder,z:m,group:g},s[e]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=p,M.materialVariant=a(d),M.groupOrder=x,M.renderOrder=d.renderOrder,M.z=m,M.group=g),e++,M}function l(d,f,p,x,m,g){const M=o(d,f,p,x,m,g);p.transmission>0?n.push(M):p.transparent===!0?i.push(M):t.push(M)}function c(d,f,p,x,m,g){const M=o(d,f,p,x,m,g);p.transmission>0?n.unshift(M):p.transparent===!0?i.unshift(M):t.unshift(M)}function h(d,f,p){t.length>1&&t.sort(d||$v),n.length>1&&n.sort(f||Qh),i.length>1&&i.sort(f||Qh),p&&(t.reverse(),n.reverse(),i.reverse())}function u(){for(let d=e,f=s.length;d<f;d++){const p=s[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function Jv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new jh,s.set(n,[a])):i>=r.length?(a=new jh,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function Zv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new Ue};break;case"SpotLight":t={position:new I,direction:new I,color:new Ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new Ue,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new Ue,groundColor:new Ue};break;case"RectAreaLight":t={color:new Ue,position:new I,halfWidth:new I,halfHeight:new I};break}return s[e.id]=t,t}}}function Qv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new se,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let jv=0;function ey(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function ty(s){const e=new Zv,t=Qv(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new Fe,a=new Fe;function o(c){let h=0,u=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,M=0,b=0,y=0,A=0,T=0,R=0;c.sort(ey);for(let E=0,C=c.length;E<C;E++){const P=c[E],D=P.color,V=P.intensity,Y=P.distance;let O=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Xi?O=P.shadow.map.texture:O=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=D.r*V,u+=D.g*V,d+=D.b*V;else if(P.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(P.sh.coefficients[q],V);R++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const H=P.shadow,Q=t.get(P);Q.shadowIntensity=H.intensity,Q.shadowBias=H.bias,Q.shadowNormalBias=H.normalBias,Q.shadowRadius=H.radius,Q.shadowMapSize=H.mapSize,n.directionalShadow[f]=Q,n.directionalShadowMap[f]=O,n.directionalShadowMatrix[f]=P.shadow.matrix,M++}n.directional[f]=q,f++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(D).multiplyScalar(V),q.distance=Y,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,n.spot[x]=q;const H=P.shadow;if(P.map&&(n.spotLightMap[A]=P.map,A++,H.updateMatrices(P),P.castShadow&&T++),n.spotLightMatrix[x]=H.matrix,P.castShadow){const Q=t.get(P);Q.shadowIntensity=H.intensity,Q.shadowBias=H.bias,Q.shadowNormalBias=H.normalBias,Q.shadowRadius=H.radius,Q.shadowMapSize=H.mapSize,n.spotShadow[x]=Q,n.spotShadowMap[x]=O,y++}x++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(D).multiplyScalar(V),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=q,m++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const H=P.shadow,Q=t.get(P);Q.shadowIntensity=H.intensity,Q.shadowBias=H.bias,Q.shadowNormalBias=H.normalBias,Q.shadowRadius=H.radius,Q.shadowMapSize=H.mapSize,Q.shadowCameraNear=H.camera.near,Q.shadowCameraFar=H.camera.far,n.pointShadow[p]=Q,n.pointShadowMap[p]=O,n.pointShadowMatrix[p]=P.shadow.matrix,b++}n.point[p]=q,p++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(V),q.groundColor.copy(P.groundColor).multiplyScalar(V),n.hemi[g]=q,g++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ue.LTC_FLOAT_1,n.rectAreaLTC2=ue.LTC_FLOAT_2):(n.rectAreaLTC1=ue.LTC_HALF_1,n.rectAreaLTC2=ue.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const v=n.hash;(v.directionalLength!==f||v.pointLength!==p||v.spotLength!==x||v.rectAreaLength!==m||v.hemiLength!==g||v.numDirectionalShadows!==M||v.numPointShadows!==b||v.numSpotShadows!==y||v.numSpotMaps!==A||v.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=x,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=y+A-T,n.spotLightMap.length=A,n.numSpotLightShadowsWithMaps=T,n.numLightProbes=R,v.directionalLength=f,v.pointLength=p,v.spotLength=x,v.rectAreaLength=m,v.hemiLength=g,v.numDirectionalShadows=M,v.numPointShadows=b,v.numSpotShadows=y,v.numSpotMaps=A,v.numLightProbes=R,n.version=jv++)}function l(c,h){let u=0,d=0,f=0,p=0,x=0;const m=h.matrixWorldInverse;for(let g=0,M=c.length;g<M;g++){const b=c[g];if(b.isDirectionalLight){const y=n.directional[u];y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),u++}else if(b.isSpotLight){const y=n.spot[f];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(b.matrixWorld),i.setFromMatrixPosition(b.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const y=n.rectArea[p];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),a.identity(),r.copy(b.matrixWorld),r.premultiply(m),a.extractRotation(r),y.halfWidth.set(b.width*.5,0,0),y.halfHeight.set(0,b.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),p++}else if(b.isPointLight){const y=n.point[d];y.position.setFromMatrixPosition(b.matrixWorld),y.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const y=n.hemi[x];y.direction.setFromMatrixPosition(b.matrixWorld),y.direction.transformDirection(m),x++}}}return{setup:o,setupView:l,state:n}}function eu(s){const e=new ty(s),t=[],n=[],i=[];function r(d){u.camera=d,t.length=0,n.length=0,i.length=0}function a(d){t.push(d)}function o(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}const u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function ny(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new eu(s),e.set(i,[o])):r>=a.length?(o=new eu(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sy=`uniform sampler2D shadow_pass;
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
}`,ry=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],ay=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],tu=new Fe,Ys=new I,bo=new I;function oy(s,e,t){let n=new ec;const i=new se,r=new se,a=new lt,o=new Vm,l=new Wm,c={},h=t.maxTextureSize,u={[ii]:Qt,[Qt]:ii,[Pn]:Pn},d=new On({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new se},radius:{value:4}},vertexShader:iy,fragmentShader:sy}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const p=new Ft;p.setAttribute("position",new Xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Le(p,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=na;let g=this.type;this.render=function(T,R,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===Af&&(Te("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=na);const E=s.getRenderTarget(),C=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),D=s.state;D.setBlending(ei),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);const V=g!==this.type;V&&R.traverse(function(Y){Y.material&&(Array.isArray(Y.material)?Y.material.forEach(O=>O.needsUpdate=!0):Y.material.needsUpdate=!0)});for(let Y=0,O=T.length;Y<O;Y++){const q=T[Y],H=q.shadow;if(H===void 0){Te("WebGLShadowMap:",q,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);const Q=H.getFrameExtents();i.multiply(Q),r.copy(H.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Q.x),i.x=r.x*Q.x,H.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Q.y),i.y=r.y*Q.y,H.mapSize.y=r.y));const ee=s.state.buffers.depth.getReversed();if(H.camera._reversedDepth=ee,H.map===null||V===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===Js){if(q.isPointLight){Te("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new Dn(i.x,i.y,{format:Xi,type:si,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),H.map.texture.name=q.name+".shadowMap",H.map.depthTexture=new ws(i.x,i.y,hn),H.map.depthTexture.name=q.name+".shadowMapDepth",H.map.depthTexture.format=ri,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Lt,H.map.depthTexture.magFilter=Lt}else q.isPointLight?(H.map=new Md(i.x),H.map.depthTexture=new rm(i.x,Fn)):(H.map=new Dn(i.x,i.y),H.map.depthTexture=new ws(i.x,i.y,Fn)),H.map.depthTexture.name=q.name+".shadowMap",H.map.depthTexture.format=ri,this.type===na?(H.map.depthTexture.compareFunction=ee?Yl:Kl,H.map.depthTexture.minFilter=Nt,H.map.depthTexture.magFilter=Nt):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=Lt,H.map.depthTexture.magFilter=Lt);H.camera.updateProjectionMatrix()}const de=H.map.isWebGLCubeRenderTarget?6:1;for(let ge=0;ge<de;ge++){if(H.map.isWebGLCubeRenderTarget)s.setRenderTarget(H.map,ge),s.clear();else{ge===0&&(s.setRenderTarget(H.map),s.clear());const ye=H.getViewport(ge);a.set(r.x*ye.x,r.y*ye.y,r.x*ye.z,r.y*ye.w),D.viewport(a)}if(q.isPointLight){const ye=H.camera,Qe=H.matrix,_t=q.distance||ye.far;_t!==ye.far&&(ye.far=_t,ye.updateProjectionMatrix()),Ys.setFromMatrixPosition(q.matrixWorld),ye.position.copy(Ys),bo.copy(ye.position),bo.add(ry[ge]),ye.up.copy(ay[ge]),ye.lookAt(bo),ye.updateMatrixWorld(),Qe.makeTranslation(-Ys.x,-Ys.y,-Ys.z),tu.multiplyMatrices(ye.projectionMatrix,ye.matrixWorldInverse),H._frustum.setFromProjectionMatrix(tu,ye.coordinateSystem,ye.reversedDepth)}else H.updateMatrices(q);n=H.getFrustum(),y(R,v,H.camera,q,this.type)}H.isPointLightShadow!==!0&&this.type===Js&&M(H,v),H.needsUpdate=!1}g=this.type,m.needsUpdate=!1,s.setRenderTarget(E,C,P)};function M(T,R){const v=e.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Dn(i.x,i.y,{format:Xi,type:si})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(R,null,v,d,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(R,null,v,f,x,null)}function b(T,R,v,E){let C=null;const P=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)C=P;else if(C=v.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const D=C.uuid,V=R.uuid;let Y=c[D];Y===void 0&&(Y={},c[D]=Y);let O=Y[V];O===void 0&&(O=C.clone(),Y[V]=O,R.addEventListener("dispose",A)),C=O}if(C.visible=R.visible,C.wireframe=R.wireframe,E===Js?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:u[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,v.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const D=s.properties.get(C);D.light=v}return C}function y(T,R,v,E,C){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===Js)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);const V=e.update(T),Y=T.material;if(Array.isArray(Y)){const O=V.groups;for(let q=0,H=O.length;q<H;q++){const Q=O[q],ee=Y[Q.materialIndex];if(ee&&ee.visible){const de=b(T,ee,E,C);T.onBeforeShadow(s,T,R,v,V,de,Q),s.renderBufferDirect(v,null,V,de,T,Q),T.onAfterShadow(s,T,R,v,V,de,Q)}}}else if(Y.visible){const O=b(T,Y,E,C);T.onBeforeShadow(s,T,R,v,V,O,null),s.renderBufferDirect(v,null,V,O,T,null),T.onAfterShadow(s,T,R,v,V,O,null)}}const D=T.children;for(let V=0,Y=D.length;V<Y;V++)y(D[V],R,v,E,C)}function A(T){T.target.removeEventListener("dispose",A);for(const v in c){const E=c[v],C=T.target.uuid;C in E&&(E[C].dispose(),delete E[C])}}}function ly(s,e){function t(){let L=!1;const ie=new lt;let $=null;const ce=new lt(0,0,0,0);return{setMask:function(me){$!==me&&!L&&(s.colorMask(me,me,me,me),$=me)},setLocked:function(me){L=me},setClear:function(me,j,Ee,Se,yt){yt===!0&&(me*=Se,j*=Se,Ee*=Se),ie.set(me,j,Ee,Se),ce.equals(ie)===!1&&(s.clearColor(me,j,Ee,Se),ce.copy(ie))},reset:function(){L=!1,$=null,ce.set(-1,0,0,0)}}}function n(){let L=!1,ie=!1,$=null,ce=null,me=null;return{setReversed:function(j){if(ie!==j){const Ee=e.get("EXT_clip_control");j?Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT):Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT),ie=j;const Se=me;me=null,this.setClear(Se)}},getReversed:function(){return ie},setTest:function(j){j?te(s.DEPTH_TEST):De(s.DEPTH_TEST)},setMask:function(j){$!==j&&!L&&(s.depthMask(j),$=j)},setFunc:function(j){if(ie&&(j=up[j]),ce!==j){switch(j){case Oo:s.depthFunc(s.NEVER);break;case ko:s.depthFunc(s.ALWAYS);break;case Bo:s.depthFunc(s.LESS);break;case bs:s.depthFunc(s.LEQUAL);break;case zo:s.depthFunc(s.EQUAL);break;case Ho:s.depthFunc(s.GEQUAL);break;case Go:s.depthFunc(s.GREATER);break;case Vo:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ce=j}},setLocked:function(j){L=j},setClear:function(j){me!==j&&(me=j,ie&&(j=1-j),s.clearDepth(j))},reset:function(){L=!1,$=null,ce=null,me=null,ie=!1}}}function i(){let L=!1,ie=null,$=null,ce=null,me=null,j=null,Ee=null,Se=null,yt=null;return{setTest:function(dt){L||(dt?te(s.STENCIL_TEST):De(s.STENCIL_TEST))},setMask:function(dt){ie!==dt&&!L&&(s.stencilMask(dt),ie=dt)},setFunc:function(dt,Sn,bn){($!==dt||ce!==Sn||me!==bn)&&(s.stencilFunc(dt,Sn,bn),$=dt,ce=Sn,me=bn)},setOp:function(dt,Sn,bn){(j!==dt||Ee!==Sn||Se!==bn)&&(s.stencilOp(dt,Sn,bn),j=dt,Ee=Sn,Se=bn)},setLocked:function(dt){L=dt},setClear:function(dt){yt!==dt&&(s.clearStencil(dt),yt=dt)},reset:function(){L=!1,ie=null,$=null,ce=null,me=null,j=null,Ee=null,Se=null,yt=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},u={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,M=null,b=null,y=null,A=null,T=null,R=null,v=new Ue(0,0,0),E=0,C=!1,P=null,D=null,V=null,Y=null,O=null;const q=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,Q=0;const ee=s.getParameter(s.VERSION);ee.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(ee)[1]),H=Q>=1):ee.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),H=Q>=2);let de=null,ge={};const ye=s.getParameter(s.SCISSOR_BOX),Qe=s.getParameter(s.VIEWPORT),_t=new lt().fromArray(ye),je=new lt().fromArray(Qe);function Z(L,ie,$,ce){const me=new Uint8Array(4),j=s.createTexture();s.bindTexture(L,j),s.texParameteri(L,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(L,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ee=0;Ee<$;Ee++)L===s.TEXTURE_3D||L===s.TEXTURE_2D_ARRAY?s.texImage3D(ie,0,s.RGBA,1,1,ce,0,s.RGBA,s.UNSIGNED_BYTE,me):s.texImage2D(ie+Ee,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,me);return j}const re={};re[s.TEXTURE_2D]=Z(s.TEXTURE_2D,s.TEXTURE_2D,1),re[s.TEXTURE_CUBE_MAP]=Z(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[s.TEXTURE_2D_ARRAY]=Z(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),re[s.TEXTURE_3D]=Z(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),te(s.DEPTH_TEST),a.setFunc(bs),At(!1),Pt(Nc),te(s.CULL_FACE),et(ei);function te(L){h[L]!==!0&&(s.enable(L),h[L]=!0)}function De(L){h[L]!==!1&&(s.disable(L),h[L]=!1)}function Be(L,ie){return d[L]!==ie?(s.bindFramebuffer(L,ie),d[L]=ie,L===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=ie),L===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=ie),!0):!1}function Pe(L,ie){let $=p,ce=!1;if(L){$=f.get(ie),$===void 0&&($=[],f.set(ie,$));const me=L.textures;if($.length!==me.length||$[0]!==s.COLOR_ATTACHMENT0){for(let j=0,Ee=me.length;j<Ee;j++)$[j]=s.COLOR_ATTACHMENT0+j;$.length=me.length,ce=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,ce=!0);ce&&s.drawBuffers($)}function St(L){return x!==L?(s.useProgram(L),x=L,!0):!1}const Ye={[Ni]:s.FUNC_ADD,[Rf]:s.FUNC_SUBTRACT,[Cf]:s.FUNC_REVERSE_SUBTRACT};Ye[Pf]=s.MIN,Ye[If]=s.MAX;const ct={[Lf]:s.ZERO,[Nf]:s.ONE,[Df]:s.SRC_COLOR,[Uo]:s.SRC_ALPHA,[zf]:s.SRC_ALPHA_SATURATE,[kf]:s.DST_COLOR,[Ff]:s.DST_ALPHA,[Uf]:s.ONE_MINUS_SRC_COLOR,[Fo]:s.ONE_MINUS_SRC_ALPHA,[Bf]:s.ONE_MINUS_DST_COLOR,[Of]:s.ONE_MINUS_DST_ALPHA,[Hf]:s.CONSTANT_COLOR,[Gf]:s.ONE_MINUS_CONSTANT_COLOR,[Vf]:s.CONSTANT_ALPHA,[Wf]:s.ONE_MINUS_CONSTANT_ALPHA};function et(L,ie,$,ce,me,j,Ee,Se,yt,dt){if(L===ei){m===!0&&(De(s.BLEND),m=!1);return}if(m===!1&&(te(s.BLEND),m=!0),L!==wf){if(L!==g||dt!==C){if((M!==Ni||A!==Ni)&&(s.blendEquation(s.FUNC_ADD),M=Ni,A=Ni),dt)switch(L){case _s:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Dc:s.blendFunc(s.ONE,s.ONE);break;case Uc:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Fc:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Ne("WebGLState: Invalid blending: ",L);break}else switch(L){case _s:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Dc:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Uc:Ne("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Fc:Ne("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ne("WebGLState: Invalid blending: ",L);break}b=null,y=null,T=null,R=null,v.set(0,0,0),E=0,g=L,C=dt}return}me=me||ie,j=j||$,Ee=Ee||ce,(ie!==M||me!==A)&&(s.blendEquationSeparate(Ye[ie],Ye[me]),M=ie,A=me),($!==b||ce!==y||j!==T||Ee!==R)&&(s.blendFuncSeparate(ct[$],ct[ce],ct[j],ct[Ee]),b=$,y=ce,T=j,R=Ee),(Se.equals(v)===!1||yt!==E)&&(s.blendColor(Se.r,Se.g,Se.b,yt),v.copy(Se),E=yt),g=L,C=!1}function $e(L,ie){L.side===Pn?De(s.CULL_FACE):te(s.CULL_FACE);let $=L.side===Qt;ie&&($=!$),At($),L.blending===_s&&L.transparent===!1?et(ei):et(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const ce=L.stencilWrite;o.setTest(ce),ce&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),zt(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?te(s.SAMPLE_ALPHA_TO_COVERAGE):De(s.SAMPLE_ALPHA_TO_COVERAGE)}function At(L){P!==L&&(L?s.frontFace(s.CW):s.frontFace(s.CCW),P=L)}function Pt(L){L!==Tf?(te(s.CULL_FACE),L!==D&&(L===Nc?s.cullFace(s.BACK):L===Ef?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):De(s.CULL_FACE),D=L}function Ot(L){L!==V&&(H&&s.lineWidth(L),V=L)}function zt(L,ie,$){L?(te(s.POLYGON_OFFSET_FILL),(Y!==ie||O!==$)&&(Y=ie,O=$,a.getReversed()&&(ie=-ie),s.polygonOffset(ie,$))):De(s.POLYGON_OFFSET_FILL)}function vt(L){L?te(s.SCISSOR_TEST):De(s.SCISSOR_TEST)}function wt(L){L===void 0&&(L=s.TEXTURE0+q-1),de!==L&&(s.activeTexture(L),de=L)}function N(L,ie,$){$===void 0&&(de===null?$=s.TEXTURE0+q-1:$=de);let ce=ge[$];ce===void 0&&(ce={type:void 0,texture:void 0},ge[$]=ce),(ce.type!==L||ce.texture!==ie)&&(de!==$&&(s.activeTexture($),de=$),s.bindTexture(L,ie||re[L]),ce.type=L,ce.texture=ie)}function $t(){const L=ge[de];L!==void 0&&L.type!==void 0&&(s.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function nt(){try{s.compressedTexImage2D(...arguments)}catch(L){Ne("WebGLState:",L)}}function w(){try{s.compressedTexImage3D(...arguments)}catch(L){Ne("WebGLState:",L)}}function _(){try{s.texSubImage2D(...arguments)}catch(L){Ne("WebGLState:",L)}}function F(){try{s.texSubImage3D(...arguments)}catch(L){Ne("WebGLState:",L)}}function z(){try{s.compressedTexSubImage2D(...arguments)}catch(L){Ne("WebGLState:",L)}}function W(){try{s.compressedTexSubImage3D(...arguments)}catch(L){Ne("WebGLState:",L)}}function ne(){try{s.texStorage2D(...arguments)}catch(L){Ne("WebGLState:",L)}}function ae(){try{s.texStorage3D(...arguments)}catch(L){Ne("WebGLState:",L)}}function X(){try{s.texImage2D(...arguments)}catch(L){Ne("WebGLState:",L)}}function J(){try{s.texImage3D(...arguments)}catch(L){Ne("WebGLState:",L)}}function oe(L){return u[L]!==void 0?u[L]:s.getParameter(L)}function Ae(L,ie){u[L]!==ie&&(s.pixelStorei(L,ie),u[L]=ie)}function he(L){_t.equals(L)===!1&&(s.scissor(L.x,L.y,L.z,L.w),_t.copy(L))}function le(L){je.equals(L)===!1&&(s.viewport(L.x,L.y,L.z,L.w),je.copy(L))}function Ce(L,ie){let $=c.get(ie);$===void 0&&($=new WeakMap,c.set(ie,$));let ce=$.get(L);ce===void 0&&(ce=s.getUniformBlockIndex(ie,L.name),$.set(L,ce))}function Ie(L,ie){const ce=c.get(ie).get(L);l.get(ie)!==ce&&(s.uniformBlockBinding(ie,ce,L.__bindingPointIndex),l.set(ie,ce))}function ze(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},de=null,ge={},d={},f=new WeakMap,p=[],x=null,m=!1,g=null,M=null,b=null,y=null,A=null,T=null,R=null,v=new Ue(0,0,0),E=0,C=!1,P=null,D=null,V=null,Y=null,O=null,_t.set(0,0,s.canvas.width,s.canvas.height),je.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:te,disable:De,bindFramebuffer:Be,drawBuffers:Pe,useProgram:St,setBlending:et,setMaterial:$e,setFlipSided:At,setCullFace:Pt,setLineWidth:Ot,setPolygonOffset:zt,setScissorTest:vt,activeTexture:wt,bindTexture:N,unbindTexture:$t,compressedTexImage2D:nt,compressedTexImage3D:w,texImage2D:X,texImage3D:J,pixelStorei:Ae,getParameter:oe,updateUBOMapping:Ce,uniformBlockBinding:Ie,texStorage2D:ne,texStorage3D:ae,texSubImage2D:_,texSubImage3D:F,compressedTexSubImage2D:z,compressedTexSubImage3D:W,scissor:he,viewport:le,reset:ze}}function cy(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new se,h=new WeakMap,u=new Set;let d;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(w,_){return p?new OffscreenCanvas(w,_):pr("canvas")}function m(w,_,F){let z=1;const W=nt(w);if((W.width>F||W.height>F)&&(z=F/Math.max(W.width,W.height)),z<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){const ne=Math.floor(z*W.width),ae=Math.floor(z*W.height);d===void 0&&(d=x(ne,ae));const X=_?x(ne,ae):d;return X.width=ne,X.height=ae,X.getContext("2d").drawImage(w,0,0,ne,ae),Te("WebGLRenderer: Texture has been resized from ("+W.width+"x"+W.height+") to ("+ne+"x"+ae+")."),X}else return"data"in w&&Te("WebGLRenderer: Image in DataTexture is too big ("+W.width+"x"+W.height+")."),w;return w}function g(w){return w.generateMipmaps}function M(w){s.generateMipmap(w)}function b(w){return w.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?s.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(w,_,F,z,W,ne=!1){if(w!==null){if(s[w]!==void 0)return s[w];Te("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ae;z&&(ae=e.get("EXT_texture_norm16"),ae||Te("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=_;if(_===s.RED&&(F===s.FLOAT&&(X=s.R32F),F===s.HALF_FLOAT&&(X=s.R16F),F===s.UNSIGNED_BYTE&&(X=s.R8),F===s.UNSIGNED_SHORT&&ae&&(X=ae.R16_EXT),F===s.SHORT&&ae&&(X=ae.R16_SNORM_EXT)),_===s.RED_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.R8UI),F===s.UNSIGNED_SHORT&&(X=s.R16UI),F===s.UNSIGNED_INT&&(X=s.R32UI),F===s.BYTE&&(X=s.R8I),F===s.SHORT&&(X=s.R16I),F===s.INT&&(X=s.R32I)),_===s.RG&&(F===s.FLOAT&&(X=s.RG32F),F===s.HALF_FLOAT&&(X=s.RG16F),F===s.UNSIGNED_BYTE&&(X=s.RG8),F===s.UNSIGNED_SHORT&&ae&&(X=ae.RG16_EXT),F===s.SHORT&&ae&&(X=ae.RG16_SNORM_EXT)),_===s.RG_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.RG8UI),F===s.UNSIGNED_SHORT&&(X=s.RG16UI),F===s.UNSIGNED_INT&&(X=s.RG32UI),F===s.BYTE&&(X=s.RG8I),F===s.SHORT&&(X=s.RG16I),F===s.INT&&(X=s.RG32I)),_===s.RGB_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.RGB8UI),F===s.UNSIGNED_SHORT&&(X=s.RGB16UI),F===s.UNSIGNED_INT&&(X=s.RGB32UI),F===s.BYTE&&(X=s.RGB8I),F===s.SHORT&&(X=s.RGB16I),F===s.INT&&(X=s.RGB32I)),_===s.RGBA_INTEGER&&(F===s.UNSIGNED_BYTE&&(X=s.RGBA8UI),F===s.UNSIGNED_SHORT&&(X=s.RGBA16UI),F===s.UNSIGNED_INT&&(X=s.RGBA32UI),F===s.BYTE&&(X=s.RGBA8I),F===s.SHORT&&(X=s.RGBA16I),F===s.INT&&(X=s.RGBA32I)),_===s.RGB&&(F===s.UNSIGNED_SHORT&&ae&&(X=ae.RGB16_EXT),F===s.SHORT&&ae&&(X=ae.RGB16_SNORM_EXT),F===s.UNSIGNED_INT_5_9_9_9_REV&&(X=s.RGB9_E5),F===s.UNSIGNED_INT_10F_11F_11F_REV&&(X=s.R11F_G11F_B10F)),_===s.RGBA){const J=ne?ga:Ke.getTransfer(W);F===s.FLOAT&&(X=s.RGBA32F),F===s.HALF_FLOAT&&(X=s.RGBA16F),F===s.UNSIGNED_BYTE&&(X=J===st?s.SRGB8_ALPHA8:s.RGBA8),F===s.UNSIGNED_SHORT&&ae&&(X=ae.RGBA16_EXT),F===s.SHORT&&ae&&(X=ae.RGBA16_SNORM_EXT),F===s.UNSIGNED_SHORT_4_4_4_4&&(X=s.RGBA4),F===s.UNSIGNED_SHORT_5_5_5_1&&(X=s.RGB5_A1)}return(X===s.R16F||X===s.R32F||X===s.RG16F||X===s.RG32F||X===s.RGBA16F||X===s.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function A(w,_){let F;return w?_===null||_===Fn||_===hr?F=s.DEPTH24_STENCIL8:_===hn?F=s.DEPTH32F_STENCIL8:_===cr&&(F=s.DEPTH24_STENCIL8,Te("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===Fn||_===hr?F=s.DEPTH_COMPONENT24:_===hn?F=s.DEPTH_COMPONENT32F:_===cr&&(F=s.DEPTH_COMPONENT16),F}function T(w,_){return g(w)===!0||w.isFramebufferTexture&&w.minFilter!==Lt&&w.minFilter!==Nt?Math.log2(Math.max(_.width,_.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?_.mipmaps.length:1}function R(w){const _=w.target;_.removeEventListener("dispose",R),E(_),_.isVideoTexture&&h.delete(_),_.isHTMLTexture&&u.delete(_)}function v(w){const _=w.target;_.removeEventListener("dispose",v),P(_)}function E(w){const _=n.get(w);if(_.__webglInit===void 0)return;const F=w.source,z=f.get(F);if(z){const W=z[_.__cacheKey];W.usedTimes--,W.usedTimes===0&&C(w),Object.keys(z).length===0&&f.delete(F)}n.remove(w)}function C(w){const _=n.get(w);s.deleteTexture(_.__webglTexture);const F=w.source,z=f.get(F);delete z[_.__cacheKey],a.memory.textures--}function P(w){const _=n.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),n.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let z=0;z<6;z++){if(Array.isArray(_.__webglFramebuffer[z]))for(let W=0;W<_.__webglFramebuffer[z].length;W++)s.deleteFramebuffer(_.__webglFramebuffer[z][W]);else s.deleteFramebuffer(_.__webglFramebuffer[z]);_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer[z])}else{if(Array.isArray(_.__webglFramebuffer))for(let z=0;z<_.__webglFramebuffer.length;z++)s.deleteFramebuffer(_.__webglFramebuffer[z]);else s.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&s.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&s.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let z=0;z<_.__webglColorRenderbuffer.length;z++)_.__webglColorRenderbuffer[z]&&s.deleteRenderbuffer(_.__webglColorRenderbuffer[z]);_.__webglDepthRenderbuffer&&s.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const F=w.textures;for(let z=0,W=F.length;z<W;z++){const ne=n.get(F[z]);ne.__webglTexture&&(s.deleteTexture(ne.__webglTexture),a.memory.textures--),n.remove(F[z])}n.remove(w)}let D=0;function V(){D=0}function Y(){return D}function O(w){D=w}function q(){const w=D;return w>=i.maxTextures&&Te("WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+i.maxTextures),D+=1,w}function H(w){const _=[];return _.push(w.wrapS),_.push(w.wrapT),_.push(w.wrapR||0),_.push(w.magFilter),_.push(w.minFilter),_.push(w.anisotropy),_.push(w.internalFormat),_.push(w.format),_.push(w.type),_.push(w.generateMipmaps),_.push(w.premultiplyAlpha),_.push(w.flipY),_.push(w.unpackAlignment),_.push(w.colorSpace),_.join()}function Q(w,_){const F=n.get(w);if(w.isVideoTexture&&N(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&F.__version!==w.version){const z=w.image;if(z===null)Te("WebGLRenderer: Texture marked for update but no image data found.");else if(z.complete===!1)Te("WebGLRenderer: Texture marked for update but image is incomplete");else{De(F,w,_);return}}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,F.__webglTexture,s.TEXTURE0+_)}function ee(w,_){const F=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){De(F,w,_);return}else w.isExternalTexture&&(F.__webglTexture=w.sourceTexture?w.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,F.__webglTexture,s.TEXTURE0+_)}function de(w,_){const F=n.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&F.__version!==w.version){De(F,w,_);return}t.bindTexture(s.TEXTURE_3D,F.__webglTexture,s.TEXTURE0+_)}function ge(w,_){const F=n.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&F.__version!==w.version){Be(F,w,_);return}t.bindTexture(s.TEXTURE_CUBE_MAP,F.__webglTexture,s.TEXTURE0+_)}const ye={[Es]:s.REPEAT,[In]:s.CLAMP_TO_EDGE,[da]:s.MIRRORED_REPEAT},Qe={[Lt]:s.NEAREST,[ku]:s.NEAREST_MIPMAP_NEAREST,[Zs]:s.NEAREST_MIPMAP_LINEAR,[Nt]:s.LINEAR,[ia]:s.LINEAR_MIPMAP_NEAREST,[Zn]:s.LINEAR_MIPMAP_LINEAR},_t={[tp]:s.NEVER,[ap]:s.ALWAYS,[np]:s.LESS,[Kl]:s.LEQUAL,[ip]:s.EQUAL,[Yl]:s.GEQUAL,[sp]:s.GREATER,[rp]:s.NOTEQUAL};function je(w,_){if(_.type===hn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Nt||_.magFilter===ia||_.magFilter===Zs||_.magFilter===Zn||_.minFilter===Nt||_.minFilter===ia||_.minFilter===Zs||_.minFilter===Zn)&&Te("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(w,s.TEXTURE_WRAP_S,ye[_.wrapS]),s.texParameteri(w,s.TEXTURE_WRAP_T,ye[_.wrapT]),(w===s.TEXTURE_3D||w===s.TEXTURE_2D_ARRAY)&&s.texParameteri(w,s.TEXTURE_WRAP_R,ye[_.wrapR]),s.texParameteri(w,s.TEXTURE_MAG_FILTER,Qe[_.magFilter]),s.texParameteri(w,s.TEXTURE_MIN_FILTER,Qe[_.minFilter]),_.compareFunction&&(s.texParameteri(w,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(w,s.TEXTURE_COMPARE_FUNC,_t[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Lt||_.minFilter!==Zs&&_.minFilter!==Zn||_.type===hn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const F=e.get("EXT_texture_filter_anisotropic");s.texParameterf(w,F.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Z(w,_){let F=!1;w.__webglInit===void 0&&(w.__webglInit=!0,_.addEventListener("dispose",R));const z=_.source;let W=f.get(z);W===void 0&&(W={},f.set(z,W));const ne=H(_);if(ne!==w.__cacheKey){W[ne]===void 0&&(W[ne]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,F=!0),W[ne].usedTimes++;const ae=W[w.__cacheKey];ae!==void 0&&(W[w.__cacheKey].usedTimes--,ae.usedTimes===0&&C(_)),w.__cacheKey=ne,w.__webglTexture=W[ne].texture}return F}function re(w,_,F){return Math.floor(Math.floor(w/F)/_)}function te(w,_,F,z){const ne=w.updateRanges;if(ne.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,_.width,_.height,F,z,_.data);else{ne.sort((Ae,he)=>Ae.start-he.start);let ae=0;for(let Ae=1;Ae<ne.length;Ae++){const he=ne[ae],le=ne[Ae],Ce=he.start+he.count,Ie=re(le.start,_.width,4),ze=re(he.start,_.width,4);le.start<=Ce+1&&Ie===ze&&re(le.start+le.count-1,_.width,4)===Ie?he.count=Math.max(he.count,le.start+le.count-he.start):(++ae,ne[ae]=le)}ne.length=ae+1;const X=t.getParameter(s.UNPACK_ROW_LENGTH),J=t.getParameter(s.UNPACK_SKIP_PIXELS),oe=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,_.width);for(let Ae=0,he=ne.length;Ae<he;Ae++){const le=ne[Ae],Ce=Math.floor(le.start/4),Ie=Math.ceil(le.count/4),ze=Ce%_.width,L=Math.floor(Ce/_.width),ie=Ie,$=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,ze),t.pixelStorei(s.UNPACK_SKIP_ROWS,L),t.texSubImage2D(s.TEXTURE_2D,0,ze,L,ie,$,F,z,_.data)}w.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,X),t.pixelStorei(s.UNPACK_SKIP_PIXELS,J),t.pixelStorei(s.UNPACK_SKIP_ROWS,oe)}}function De(w,_,F){let z=s.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(z=s.TEXTURE_2D_ARRAY),_.isData3DTexture&&(z=s.TEXTURE_3D);const W=Z(w,_),ne=_.source;t.bindTexture(z,w.__webglTexture,s.TEXTURE0+F);const ae=n.get(ne);if(ne.version!==ae.__version||W===!0){if(t.activeTexture(s.TEXTURE0+F),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const $=Ke.getPrimaries(Ke.workingColorSpace),ce=_.colorSpace===vi?null:Ke.getPrimaries(_.colorSpace),me=_.colorSpace===vi||$===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}t.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment);let J=m(_.image,!1,i.maxTextureSize);J=$t(_,J);const oe=r.convert(_.format,_.colorSpace),Ae=r.convert(_.type);let he=y(_.internalFormat,oe,Ae,_.normalized,_.colorSpace,_.isVideoTexture);je(z,_);let le;const Ce=_.mipmaps,Ie=_.isVideoTexture!==!0,ze=ae.__version===void 0||W===!0,L=ne.dataReady,ie=T(_,J);if(_.isDepthTexture)he=A(_.format===Bi,_.type),ze&&(Ie?t.texStorage2D(s.TEXTURE_2D,1,he,J.width,J.height):t.texImage2D(s.TEXTURE_2D,0,he,J.width,J.height,0,oe,Ae,null));else if(_.isDataTexture)if(Ce.length>0){Ie&&ze&&t.texStorage2D(s.TEXTURE_2D,ie,he,Ce[0].width,Ce[0].height);for(let $=0,ce=Ce.length;$<ce;$++)le=Ce[$],Ie?L&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,le.width,le.height,oe,Ae,le.data):t.texImage2D(s.TEXTURE_2D,$,he,le.width,le.height,0,oe,Ae,le.data);_.generateMipmaps=!1}else Ie?(ze&&t.texStorage2D(s.TEXTURE_2D,ie,he,J.width,J.height),L&&te(_,J,oe,Ae)):t.texImage2D(s.TEXTURE_2D,0,he,J.width,J.height,0,oe,Ae,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Ie&&ze&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ie,he,Ce[0].width,Ce[0].height,J.depth);for(let $=0,ce=Ce.length;$<ce;$++)if(le=Ce[$],_.format!==un)if(oe!==null)if(Ie){if(L)if(_.layerUpdates.size>0){const me=Lh(le.width,le.height,_.format,_.type);for(const j of _.layerUpdates){const Ee=le.data.subarray(j*me/le.data.BYTES_PER_ELEMENT,(j+1)*me/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,j,le.width,le.height,1,oe,Ee)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,le.width,le.height,J.depth,oe,le.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,$,he,le.width,le.height,J.depth,0,le.data,0,0);else Te("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?L&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,$,0,0,0,le.width,le.height,J.depth,oe,Ae,le.data):t.texImage3D(s.TEXTURE_2D_ARRAY,$,he,le.width,le.height,J.depth,0,oe,Ae,le.data)}else{Ie&&ze&&t.texStorage2D(s.TEXTURE_2D,ie,he,Ce[0].width,Ce[0].height);for(let $=0,ce=Ce.length;$<ce;$++)le=Ce[$],_.format!==un?oe!==null?Ie?L&&t.compressedTexSubImage2D(s.TEXTURE_2D,$,0,0,le.width,le.height,oe,le.data):t.compressedTexImage2D(s.TEXTURE_2D,$,he,le.width,le.height,0,le.data):Te("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?L&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,le.width,le.height,oe,Ae,le.data):t.texImage2D(s.TEXTURE_2D,$,he,le.width,le.height,0,oe,Ae,le.data)}else if(_.isDataArrayTexture)if(Ie){if(ze&&t.texStorage3D(s.TEXTURE_2D_ARRAY,ie,he,J.width,J.height,J.depth),L)if(_.layerUpdates.size>0){const $=Lh(J.width,J.height,_.format,_.type);for(const ce of _.layerUpdates){const me=J.data.subarray(ce*$/J.data.BYTES_PER_ELEMENT,(ce+1)*$/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ce,J.width,J.height,1,oe,Ae,me)}_.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,oe,Ae,J.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,he,J.width,J.height,J.depth,0,oe,Ae,J.data);else if(_.isData3DTexture)Ie?(ze&&t.texStorage3D(s.TEXTURE_3D,ie,he,J.width,J.height,J.depth),L&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,oe,Ae,J.data)):t.texImage3D(s.TEXTURE_3D,0,he,J.width,J.height,J.depth,0,oe,Ae,J.data);else if(_.isFramebufferTexture){if(ze)if(Ie)t.texStorage2D(s.TEXTURE_2D,ie,he,J.width,J.height);else{let $=J.width,ce=J.height;for(let me=0;me<ie;me++)t.texImage2D(s.TEXTURE_2D,me,he,$,ce,0,oe,Ae,null),$>>=1,ce>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in s){const $=s.canvas;if($.hasAttribute("layoutsubtree")||$.setAttribute("layoutsubtree","true"),J.parentNode!==$){$.appendChild(J),u.add(_),$.onpaint=ce=>{const me=ce.changedElements;for(const j of u)me.includes(j.image)&&(j.needsUpdate=!0)},$.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,J);else{const me=s.RGBA,j=s.RGBA,Ee=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,me,j,Ee,J)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ce.length>0){if(Ie&&ze){const $=nt(Ce[0]);t.texStorage2D(s.TEXTURE_2D,ie,he,$.width,$.height)}for(let $=0,ce=Ce.length;$<ce;$++)le=Ce[$],Ie?L&&t.texSubImage2D(s.TEXTURE_2D,$,0,0,oe,Ae,le):t.texImage2D(s.TEXTURE_2D,$,he,oe,Ae,le);_.generateMipmaps=!1}else if(Ie){if(ze){const $=nt(J);t.texStorage2D(s.TEXTURE_2D,ie,he,$.width,$.height)}L&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,oe,Ae,J)}else t.texImage2D(s.TEXTURE_2D,0,he,oe,Ae,J);g(_)&&M(z),ae.__version=ne.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function Be(w,_,F){if(_.image.length!==6)return;const z=Z(w,_),W=_.source;t.bindTexture(s.TEXTURE_CUBE_MAP,w.__webglTexture,s.TEXTURE0+F);const ne=n.get(W);if(W.version!==ne.__version||z===!0){t.activeTexture(s.TEXTURE0+F);const ae=Ke.getPrimaries(Ke.workingColorSpace),X=_.colorSpace===vi?null:Ke.getPrimaries(_.colorSpace),J=_.colorSpace===vi||ae===X?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,_.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,_.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,J);const oe=_.isCompressedTexture||_.image[0].isCompressedTexture,Ae=_.image[0]&&_.image[0].isDataTexture,he=[];for(let j=0;j<6;j++)!oe&&!Ae?he[j]=m(_.image[j],!0,i.maxCubemapSize):he[j]=Ae?_.image[j].image:_.image[j],he[j]=$t(_,he[j]);const le=he[0],Ce=r.convert(_.format,_.colorSpace),Ie=r.convert(_.type),ze=y(_.internalFormat,Ce,Ie,_.normalized,_.colorSpace),L=_.isVideoTexture!==!0,ie=ne.__version===void 0||z===!0,$=W.dataReady;let ce=T(_,le);je(s.TEXTURE_CUBE_MAP,_);let me;if(oe){L&&ie&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ce,ze,le.width,le.height);for(let j=0;j<6;j++){me=he[j].mipmaps;for(let Ee=0;Ee<me.length;Ee++){const Se=me[Ee];_.format!==un?Ce!==null?L?$&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,0,0,Se.width,Se.height,Ce,Se.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,ze,Se.width,Se.height,0,Se.data):Te("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,0,0,Se.width,Se.height,Ce,Ie,Se.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee,ze,Se.width,Se.height,0,Ce,Ie,Se.data)}}}else{if(me=_.mipmaps,L&&ie){me.length>0&&ce++;const j=nt(he[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ce,ze,j.width,j.height)}for(let j=0;j<6;j++)if(Ae){L?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,he[j].width,he[j].height,Ce,Ie,he[j].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,ze,he[j].width,he[j].height,0,Ce,Ie,he[j].data);for(let Ee=0;Ee<me.length;Ee++){const yt=me[Ee].image[j].image;L?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,0,0,yt.width,yt.height,Ce,Ie,yt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,ze,yt.width,yt.height,0,Ce,Ie,yt.data)}}else{L?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,Ce,Ie,he[j]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,ze,Ce,Ie,he[j]);for(let Ee=0;Ee<me.length;Ee++){const Se=me[Ee];L?$&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,0,0,Ce,Ie,Se.image[j]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+j,Ee+1,ze,Ce,Ie,Se.image[j])}}}g(_)&&M(s.TEXTURE_CUBE_MAP),ne.__version=W.version,_.onUpdate&&_.onUpdate(_)}w.__version=_.version}function Pe(w,_,F,z,W,ne){const ae=r.convert(F.format,F.colorSpace),X=r.convert(F.type),J=y(F.internalFormat,ae,X,F.normalized,F.colorSpace),oe=n.get(_),Ae=n.get(F);if(Ae.__renderTarget=_,!oe.__hasExternalTextures){const he=Math.max(1,_.width>>ne),le=Math.max(1,_.height>>ne);W===s.TEXTURE_3D||W===s.TEXTURE_2D_ARRAY?t.texImage3D(W,ne,J,he,le,_.depth,0,ae,X,null):t.texImage2D(W,ne,J,he,le,0,ae,X,null)}t.bindFramebuffer(s.FRAMEBUFFER,w),wt(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,z,W,Ae.__webglTexture,0,vt(_)):(W===s.TEXTURE_2D||W>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&W<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,z,W,Ae.__webglTexture,ne),t.bindFramebuffer(s.FRAMEBUFFER,null)}function St(w,_,F){if(s.bindRenderbuffer(s.RENDERBUFFER,w),_.depthBuffer){const z=_.depthTexture,W=z&&z.isDepthTexture?z.type:null,ne=A(_.stencilBuffer,W),ae=_.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;wt(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,vt(_),ne,_.width,_.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,vt(_),ne,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,ne,_.width,_.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ae,s.RENDERBUFFER,w)}else{const z=_.textures;for(let W=0;W<z.length;W++){const ne=z[W],ae=r.convert(ne.format,ne.colorSpace),X=r.convert(ne.type),J=y(ne.internalFormat,ae,X,ne.normalized,ne.colorSpace);wt(_)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,vt(_),J,_.width,_.height):F?s.renderbufferStorageMultisample(s.RENDERBUFFER,vt(_),J,_.width,_.height):s.renderbufferStorage(s.RENDERBUFFER,J,_.width,_.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ye(w,_,F){const z=_.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,w),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const W=n.get(_.depthTexture);if(W.__renderTarget=_,(!W.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),z){if(W.__webglInit===void 0&&(W.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),W.__webglTexture===void 0){W.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture),je(s.TEXTURE_CUBE_MAP,_.depthTexture);const oe=r.convert(_.depthTexture.format),Ae=r.convert(_.depthTexture.type);let he;_.depthTexture.format===ri?he=s.DEPTH_COMPONENT24:_.depthTexture.format===Bi&&(he=s.DEPTH24_STENCIL8);for(let le=0;le<6;le++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+le,0,he,_.width,_.height,0,oe,Ae,null)}}else Q(_.depthTexture,0);const ne=W.__webglTexture,ae=vt(_),X=z?s.TEXTURE_CUBE_MAP_POSITIVE_X+F:s.TEXTURE_2D,J=_.depthTexture.format===Bi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(_.depthTexture.format===ri)wt(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,X,ne,0,ae):s.framebufferTexture2D(s.FRAMEBUFFER,J,X,ne,0);else if(_.depthTexture.format===Bi)wt(_)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,J,X,ne,0,ae):s.framebufferTexture2D(s.FRAMEBUFFER,J,X,ne,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ct(w){const _=n.get(w),F=w.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==w.depthTexture){const z=w.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),z){const W=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,z.removeEventListener("dispose",W)};z.addEventListener("dispose",W),_.__depthDisposeCallback=W}_.__boundDepthTexture=z}if(w.depthTexture&&!_.__autoAllocateDepthBuffer)if(F)for(let z=0;z<6;z++)Ye(_.__webglFramebuffer[z],w,z);else{const z=w.texture.mipmaps;z&&z.length>0?Ye(_.__webglFramebuffer[0],w,0):Ye(_.__webglFramebuffer,w,0)}else if(F){_.__webglDepthbuffer=[];for(let z=0;z<6;z++)if(t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[z]),_.__webglDepthbuffer[z]===void 0)_.__webglDepthbuffer[z]=s.createRenderbuffer(),St(_.__webglDepthbuffer[z],w,!1);else{const W=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ne=_.__webglDepthbuffer[z];s.bindRenderbuffer(s.RENDERBUFFER,ne),s.framebufferRenderbuffer(s.FRAMEBUFFER,W,s.RENDERBUFFER,ne)}}else{const z=w.texture.mipmaps;if(z&&z.length>0?t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=s.createRenderbuffer(),St(_.__webglDepthbuffer,w,!1);else{const W=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ne=_.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ne),s.framebufferRenderbuffer(s.FRAMEBUFFER,W,s.RENDERBUFFER,ne)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function et(w,_,F){const z=n.get(w);_!==void 0&&Pe(z.__webglFramebuffer,w,w.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),F!==void 0&&ct(w)}function $e(w){const _=w.texture,F=n.get(w),z=n.get(_);w.addEventListener("dispose",v);const W=w.textures,ne=w.isWebGLCubeRenderTarget===!0,ae=W.length>1;if(ae||(z.__webglTexture===void 0&&(z.__webglTexture=s.createTexture()),z.__version=_.version,a.memory.textures++),ne){F.__webglFramebuffer=[];for(let X=0;X<6;X++)if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer[X]=[];for(let J=0;J<_.mipmaps.length;J++)F.__webglFramebuffer[X][J]=s.createFramebuffer()}else F.__webglFramebuffer[X]=s.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){F.__webglFramebuffer=[];for(let X=0;X<_.mipmaps.length;X++)F.__webglFramebuffer[X]=s.createFramebuffer()}else F.__webglFramebuffer=s.createFramebuffer();if(ae)for(let X=0,J=W.length;X<J;X++){const oe=n.get(W[X]);oe.__webglTexture===void 0&&(oe.__webglTexture=s.createTexture(),a.memory.textures++)}if(w.samples>0&&wt(w)===!1){F.__webglMultisampledFramebuffer=s.createFramebuffer(),F.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let X=0;X<W.length;X++){const J=W[X];F.__webglColorRenderbuffer[X]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,F.__webglColorRenderbuffer[X]);const oe=r.convert(J.format,J.colorSpace),Ae=r.convert(J.type),he=y(J.internalFormat,oe,Ae,J.normalized,J.colorSpace,w.isXRRenderTarget===!0),le=vt(w);s.renderbufferStorageMultisample(s.RENDERBUFFER,le,he,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+X,s.RENDERBUFFER,F.__webglColorRenderbuffer[X])}s.bindRenderbuffer(s.RENDERBUFFER,null),w.depthBuffer&&(F.__webglDepthRenderbuffer=s.createRenderbuffer(),St(F.__webglDepthRenderbuffer,w,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ne){t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture),je(s.TEXTURE_CUBE_MAP,_);for(let X=0;X<6;X++)if(_.mipmaps&&_.mipmaps.length>0)for(let J=0;J<_.mipmaps.length;J++)Pe(F.__webglFramebuffer[X][J],w,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+X,J);else Pe(F.__webglFramebuffer[X],w,_,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);g(_)&&M(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ae){for(let X=0,J=W.length;X<J;X++){const oe=W[X],Ae=n.get(oe);let he=s.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(he=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(he,Ae.__webglTexture),je(he,oe),Pe(F.__webglFramebuffer,w,oe,s.COLOR_ATTACHMENT0+X,he,0),g(oe)&&M(he)}t.unbindTexture()}else{let X=s.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(X=w.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(X,z.__webglTexture),je(X,_),_.mipmaps&&_.mipmaps.length>0)for(let J=0;J<_.mipmaps.length;J++)Pe(F.__webglFramebuffer[J],w,_,s.COLOR_ATTACHMENT0,X,J);else Pe(F.__webglFramebuffer,w,_,s.COLOR_ATTACHMENT0,X,0);g(_)&&M(X),t.unbindTexture()}w.depthBuffer&&ct(w)}function At(w){const _=w.textures;for(let F=0,z=_.length;F<z;F++){const W=_[F];if(g(W)){const ne=b(w),ae=n.get(W).__webglTexture;t.bindTexture(ne,ae),M(ne),t.unbindTexture()}}}const Pt=[],Ot=[];function zt(w){if(w.samples>0){if(wt(w)===!1){const _=w.textures,F=w.width,z=w.height;let W=s.COLOR_BUFFER_BIT;const ne=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ae=n.get(w),X=_.length>1;if(X)for(let oe=0;oe<_.length;oe++)t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+oe,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+oe,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer);const J=w.texture.mipmaps;J&&J.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let oe=0;oe<_.length;oe++){if(w.resolveDepthBuffer&&(w.depthBuffer&&(W|=s.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&(W|=s.STENCIL_BUFFER_BIT)),X){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ae.__webglColorRenderbuffer[oe]);const Ae=n.get(_[oe]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ae,0)}s.blitFramebuffer(0,0,F,z,0,0,F,z,W,s.NEAREST),l===!0&&(Pt.length=0,Ot.length=0,Pt.push(s.COLOR_ATTACHMENT0+oe),w.depthBuffer&&w.resolveDepthBuffer===!1&&(Pt.push(ne),Ot.push(ne),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Ot)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Pt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),X)for(let oe=0;oe<_.length;oe++){t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+oe,s.RENDERBUFFER,ae.__webglColorRenderbuffer[oe]);const Ae=n.get(_[oe]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+oe,s.TEXTURE_2D,Ae,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.resolveDepthBuffer===!1&&l){const _=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[_])}}}function vt(w){return Math.min(i.maxSamples,w.samples)}function wt(w){const _=n.get(w);return w.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function N(w){const _=a.render.frame;h.get(w)!==_&&(h.set(w,_),w.update())}function $t(w,_){const F=w.colorSpace,z=w.format,W=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||F!==sn&&F!==vi&&(Ke.getTransfer(F)===st?(z!==un||W!==nn)&&Te("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ne("WebGLTextures: Unsupported texture color space:",F)),_}function nt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=q,this.resetTextureUnits=V,this.getTextureUnits=Y,this.setTextureUnits=O,this.setTexture2D=Q,this.setTexture2DArray=ee,this.setTexture3D=de,this.setTextureCube=ge,this.rebindTextures=et,this.setupRenderTarget=$e,this.updateRenderTargetMipmap=At,this.updateMultisampleRenderTarget=zt,this.setupDepthRenderbuffer=ct,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=wt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function hy(s,e){function t(n,i=vi){let r;const a=Ke.getTransfer(i);if(n===nn)return s.UNSIGNED_BYTE;if(n===zl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Hl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Hu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Gu)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Bu)return s.BYTE;if(n===zu)return s.SHORT;if(n===cr)return s.UNSIGNED_SHORT;if(n===Bl)return s.INT;if(n===Fn)return s.UNSIGNED_INT;if(n===hn)return s.FLOAT;if(n===si)return s.HALF_FLOAT;if(n===Vu)return s.ALPHA;if(n===Wu)return s.RGB;if(n===un)return s.RGBA;if(n===ri)return s.DEPTH_COMPONENT;if(n===Bi)return s.DEPTH_STENCIL;if(n===Gl)return s.RED;if(n===Vl)return s.RED_INTEGER;if(n===Xi)return s.RG;if(n===Wl)return s.RG_INTEGER;if(n===Xl)return s.RGBA_INTEGER;if(n===sa||n===ra||n===aa||n===oa)if(a===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===sa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ra)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===aa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===oa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===sa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ra)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===aa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===oa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Wo||n===Xo||n===qo||n===Ko)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Wo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Xo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===qo)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ko)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Yo||n===$o||n===Jo||n===Zo||n===Qo||n===fa||n===jo)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Yo||n===$o)return a===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Jo)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Zo)return r.COMPRESSED_R11_EAC;if(n===Qo)return r.COMPRESSED_SIGNED_R11_EAC;if(n===fa)return r.COMPRESSED_RG11_EAC;if(n===jo)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===el||n===tl||n===nl||n===il||n===sl||n===rl||n===al||n===ol||n===ll||n===cl||n===hl||n===ul||n===dl||n===fl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===el)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===tl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===nl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===il)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===sl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===rl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===al)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ol)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ll)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===cl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===hl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ul)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===dl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===fl)return a===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===pl||n===ml||n===gl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===pl)return a===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ml)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xl||n===_l||n===pa||n===vl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===xl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===_l)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===pa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===vl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===hr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const uy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dy=`
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

}`;class fy{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new id(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new On({vertexShader:uy,fragmentShader:dy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Le(new wa(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class py extends Ti{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,p=null;const x=typeof XRWebGLBinding<"u",m=new fy,g={},M=t.getContextAttributes();let b=null,y=null;const A=[],T=[],R=new se;let v=null;const E=new Jt;E.viewport=new lt;const C=new Jt;C.viewport=new lt;const P=[E,C],D=new u0;let V=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let re=A[Z];return re===void 0&&(re=new qa,A[Z]=re),re.getTargetRaySpace()},this.getControllerGrip=function(Z){let re=A[Z];return re===void 0&&(re=new qa,A[Z]=re),re.getGripSpace()},this.getHand=function(Z){let re=A[Z];return re===void 0&&(re=new qa,A[Z]=re),re.getHandSpace()};function O(Z){const re=T.indexOf(Z.inputSource);if(re===-1)return;const te=A[re];te!==void 0&&(te.update(Z.inputSource,Z.frame,c||a),te.dispatchEvent({type:Z.type,data:Z.inputSource}))}function q(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",H);for(let Z=0;Z<A.length;Z++){const re=T[Z];re!==null&&(T[Z]=null,A[Z].disconnect(re))}V=null,Y=null,m.reset();for(const Z in g)delete g[Z];e.setRenderTarget(b),f=null,d=null,u=null,i=null,y=null,je.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Te("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Te("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",q),i.addEventListener("inputsourceschange",H),M.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(R),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let te=null,De=null,Be=null;M.depth&&(Be=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=M.stencil?Bi:ri,De=M.stencil?hr:Fn);const Pe={colorFormat:t.RGBA8,depthFormat:Be,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Pe),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new Dn(d.textureWidth,d.textureHeight,{format:un,type:nn,depthTexture:new ws(d.textureWidth,d.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const te={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,te),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Dn(f.framebufferWidth,f.framebufferHeight,{format:un,type:nn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),je.setContext(i),je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function H(Z){for(let re=0;re<Z.removed.length;re++){const te=Z.removed[re],De=T.indexOf(te);De>=0&&(T[De]=null,A[De].disconnect(te))}for(let re=0;re<Z.added.length;re++){const te=Z.added[re];let De=T.indexOf(te);if(De===-1){for(let Pe=0;Pe<A.length;Pe++)if(Pe>=T.length){T.push(te),De=Pe;break}else if(T[Pe]===null){T[Pe]=te,De=Pe;break}if(De===-1)break}const Be=A[De];Be&&Be.connect(te)}}const Q=new I,ee=new I;function de(Z,re,te){Q.setFromMatrixPosition(re.matrixWorld),ee.setFromMatrixPosition(te.matrixWorld);const De=Q.distanceTo(ee),Be=re.projectionMatrix.elements,Pe=te.projectionMatrix.elements,St=Be[14]/(Be[10]-1),Ye=Be[14]/(Be[10]+1),ct=(Be[9]+1)/Be[5],et=(Be[9]-1)/Be[5],$e=(Be[8]-1)/Be[0],At=(Pe[8]+1)/Pe[0],Pt=St*$e,Ot=St*At,zt=De/(-$e+At),vt=zt*-$e;if(re.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(vt),Z.translateZ(zt),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),Be[10]===-1)Z.projectionMatrix.copy(re.projectionMatrix),Z.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const wt=St+zt,N=Ye+zt,$t=Pt-vt,nt=Ot+(De-vt),w=ct*Ye/N*wt,_=et*Ye/N*wt;Z.projectionMatrix.makePerspective($t,nt,w,_,wt,N),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ge(Z,re){re===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(re.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let re=Z.near,te=Z.far;m.texture!==null&&(m.depthNear>0&&(re=m.depthNear),m.depthFar>0&&(te=m.depthFar)),D.near=C.near=E.near=re,D.far=C.far=E.far=te,(V!==D.near||Y!==D.far)&&(i.updateRenderState({depthNear:D.near,depthFar:D.far}),V=D.near,Y=D.far),D.layers.mask=Z.layers.mask|6,E.layers.mask=D.layers.mask&-5,C.layers.mask=D.layers.mask&-3;const De=Z.parent,Be=D.cameras;ge(D,De);for(let Pe=0;Pe<Be.length;Pe++)ge(Be[Pe],De);Be.length===2?de(D,E,C):D.projectionMatrix.copy(E.projectionMatrix),ye(Z,D,De)};function ye(Z,re,te){te===null?Z.matrix.copy(re.matrixWorld):(Z.matrix.copy(te.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(re.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(re.projectionMatrix),Z.projectionMatrixInverse.copy(re.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=As*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return D},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(D)},this.getCameraTexture=function(Z){return g[Z]};let Qe=null;function _t(Z,re){if(h=re.getViewerPose(c||a),p=re,h!==null){const te=h.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let De=!1;te.length!==D.cameras.length&&(D.cameras.length=0,De=!0);for(let Ye=0;Ye<te.length;Ye++){const ct=te[Ye];let et=null;if(f!==null)et=f.getViewport(ct);else{const At=u.getViewSubImage(d,ct);et=At.viewport,Ye===0&&(e.setRenderTargetTextures(y,At.colorTexture,At.depthStencilTexture),e.setRenderTarget(y))}let $e=P[Ye];$e===void 0&&($e=new Jt,$e.layers.enable(Ye),$e.viewport=new lt,P[Ye]=$e),$e.matrix.fromArray(ct.transform.matrix),$e.matrix.decompose($e.position,$e.quaternion,$e.scale),$e.projectionMatrix.fromArray(ct.projectionMatrix),$e.projectionMatrixInverse.copy($e.projectionMatrix).invert(),$e.viewport.set(et.x,et.y,et.width,et.height),Ye===0&&(D.matrix.copy($e.matrix),D.matrix.decompose(D.position,D.quaternion,D.scale)),De===!0&&D.cameras.push($e)}const Be=i.enabledFeatures;if(Be&&Be.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){u=n.getBinding();const Ye=u.getDepthInformation(te[0]);Ye&&Ye.isValid&&Ye.texture&&m.init(Ye,i.renderState)}if(Be&&Be.includes("camera-access")&&x){e.state.unbindTexture(),u=n.getBinding();for(let Ye=0;Ye<te.length;Ye++){const ct=te[Ye].camera;if(ct){let et=g[ct];et||(et=new id,g[ct]=et);const $e=u.getCameraImage(ct);et.sourceTexture=$e}}}}for(let te=0;te<A.length;te++){const De=T[te],Be=A[te];De!==null&&Be!==void 0&&Be.update(De,re,c||a)}Qe&&Qe(Z,re),re.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:re}),p=null}const je=new vd;je.setAnimationLoop(_t),this.setAnimationLoop=function(Z){Qe=Z},this.dispose=function(){}}}const my=new Fe,Ad=new ke;Ad.set(-1,0,0,0,1,0,0,0,1);function gy(s,e){function t(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,fd(s)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,M,b,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(m,g):g.isMeshLambertMaterial?(r(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(m,g),u(m,g)):g.isMeshPhongMaterial?(r(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(m,g),d(m,g),g.isMeshPhysicalMaterial&&f(m,g,y)):g.isMeshMatcapMaterial?(r(m,g),p(m,g)):g.isMeshDepthMaterial?r(m,g):g.isMeshDistanceMaterial?(r(m,g),x(m,g)):g.isMeshNormalMaterial?r(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,M,b):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,t(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===Qt&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,t(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===Qt&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,t(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,t(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,t(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const M=e.get(g),b=M.envMap,y=M.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(my.makeRotationFromEuler(y)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Ad),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,t(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,t(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,M,b){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*M,m.scale.value=b*.5,g.map&&(m.map.value=g.map,t(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,t(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,t(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function u(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function d(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,t(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,t(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,M){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,t(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,t(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,t(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,t(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,t(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Qt&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,t(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,t(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,t(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,t(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,t(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,t(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,t(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const M=e.get(g).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function xy(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){const T=A.program;n.uniformBlockBinding(y,T)}function c(y,A){let T=i[y.id];T===void 0&&(m(y),T=h(y),i[y.id]=T,y.addEventListener("dispose",M));const R=A.program;n.updateUBOMapping(y,R);const v=e.render.frame;r[y.id]!==v&&(d(y),r[y.id]=v)}function h(y){const A=u();y.__bindingPointIndex=A;const T=s.createBuffer(),R=y.__size,v=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,R,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,A,T),T}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return Ne("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(y){const A=i[y.id],T=y.uniforms,R=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,A);for(let v=0,E=T.length;v<E;v++){const C=T[v];if(Array.isArray(C))for(let P=0,D=C.length;P<D;P++)f(C[P],v,P,R);else f(C,v,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(y,A,T,R){if(x(y,A,T,R)===!0){const v=y.__offset,E=y.value;if(Array.isArray(E)){let C=0;for(let P=0;P<E.length;P++){const D=E[P],V=g(D);p(D,y.__data,C),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(C+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,y.__data)}}function p(y,A,T){typeof y=="number"||typeof y=="boolean"?A[0]=y:y.isMatrix3?(A[0]=y.elements[0],A[1]=y.elements[1],A[2]=y.elements[2],A[3]=0,A[4]=y.elements[3],A[5]=y.elements[4],A[6]=y.elements[5],A[7]=0,A[8]=y.elements[6],A[9]=y.elements[7],A[10]=y.elements[8],A[11]=0):ArrayBuffer.isView(y)?A.set(new y.constructor(y.buffer,y.byteOffset,A.length)):y.toArray(A,T)}function x(y,A,T,R){const v=y.value,E=A+"_"+T;if(R[E]===void 0)return typeof v=="number"||typeof v=="boolean"?R[E]=v:ArrayBuffer.isView(v)?R[E]=v.slice():R[E]=v.clone(),!0;{const C=R[E];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return R[E]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(C.equals(v)===!1)return C.copy(v),!0}}return!1}function m(y){const A=y.uniforms;let T=0;const R=16;for(let E=0,C=A.length;E<C;E++){const P=Array.isArray(A[E])?A[E]:[A[E]];for(let D=0,V=P.length;D<V;D++){const Y=P[D],O=Array.isArray(Y.value)?Y.value:[Y.value];for(let q=0,H=O.length;q<H;q++){const Q=O[q],ee=g(Q),de=T%R,ge=de%ee.boundary,ye=de+ge;T+=ge,ye!==0&&R-ye<ee.storage&&(T+=R-ye),Y.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),Y.__offset=T,T+=ee.storage}}}const v=T%R;return v>0&&(T+=R-v),y.__size=T,y.__cache={},this}function g(y){const A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Te("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Te("WebGLRenderer: Unsupported uniform value type.",y),A}function M(y){const A=y.target;A.removeEventListener("dispose",M);const T=a.indexOf(A.__bindingPointIndex);a.splice(T,1),s.deleteBuffer(i[A.id]),delete i[A.id],delete r[A.id]}function b(){for(const y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:l,update:c,dispose:b}}const _y=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let An=null;function vy(){return An===null&&(An=new Ql(_y,16,16,Xi,si),An.name="DFG_LUT",An.minFilter=Nt,An.magFilter=Nt,An.wrapS=In,An.wrapT=In,An.generateMipmaps=!1,An.needsUpdate=!0),An}class wd{constructor(e={}){const{canvas:t=cp(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=nn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const x=f,m=new Set([Xl,Wl,Vl]),g=new Set([nn,Fn,cr,hr,zl,Hl]),M=new Uint32Array(4),b=new Int32Array(4),y=new I;let A=null,T=null;const R=[],v=[];let E=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Nn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let P=!1,D=null,V=null,Y=null,O=null;this._outputColorSpace=It;let q=0,H=0,Q=null,ee=-1,de=null;const ge=new lt,ye=new lt;let Qe=null;const _t=new Ue(0);let je=0,Z=t.width,re=t.height,te=1,De=null,Be=null;const Pe=new lt(0,0,Z,re),St=new lt(0,0,Z,re);let Ye=!1;const ct=new ec;let et=!1,$e=!1;const At=new Fe,Pt=new I,Ot=new lt,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let vt=!1;function wt(){return Q===null?te:1}let N=n;function $t(S,U){return t.getContext(S,U)}try{const S={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${kl}`),t.addEventListener("webglcontextlost",yt,!1),t.addEventListener("webglcontextrestored",dt,!1),t.addEventListener("webglcontextcreationerror",Sn,!1),N===null){const U="webgl2";if(N=$t(U,S),N===null)throw $t(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}}catch(S){throw Ne("WebGLRenderer: "+S.message),S}let nt,w,_,F,z,W,ne,ae,X,J,oe,Ae,he,le,Ce,Ie,ze,L,ie,$,ce,me,j;function Ee(){nt=new v_(N),nt.init(),ce=new hy(N,nt),w=new u_(N,nt,e,ce),_=new ly(N,nt),w.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),V=N.createFramebuffer(),Y=N.createFramebuffer(),O=N.createFramebuffer(),F=new S_(N),z=new Yv,W=new cy(N,nt,_,z,w,ce,F),ne=new __(C),ae=new A0(N),me=new c_(N,ae),X=new y_(N,ae,F,me),J=new T_(N,X,ae,me,F),L=new b_(N,w,W),Ce=new d_(z),oe=new Kv(C,ne,nt,w,me,Ce),Ae=new gy(C,z),he=new Jv,le=new ny(nt),ze=new l_(C,ne,_,J,p,l),Ie=new oy(C,J,w),j=new xy(N,F,w,_),ie=new h_(N,nt,F),$=new M_(N,nt,F),F.programs=oe.programs,C.capabilities=w,C.extensions=nt,C.properties=z,C.renderLists=he,C.shadowMap=Ie,C.state=_,C.info=F}Ee(),x!==nn&&(E=new A_(x,t.width,t.height,o,i,r));const Se=new py(C,N);this.xr=Se,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const S=nt.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=nt.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return te},this.setPixelRatio=function(S){S!==void 0&&(te=S,this.setSize(Z,re,!1))},this.getSize=function(S){return S.set(Z,re)},this.setSize=function(S,U,G=!0){if(Se.isPresenting){Te("WebGLRenderer: Can't change size while VR device is presenting.");return}Z=S,re=U,t.width=Math.floor(S*te),t.height=Math.floor(U*te),G===!0&&(t.style.width=S+"px",t.style.height=U+"px"),E!==null&&E.setSize(t.width,t.height),this.setViewport(0,0,S,U)},this.getDrawingBufferSize=function(S){return S.set(Z*te,re*te).floor()},this.setDrawingBufferSize=function(S,U,G){Z=S,re=U,te=G,t.width=Math.floor(S*G),t.height=Math.floor(U*G),this.setViewport(0,0,S,U)},this.setEffects=function(S){if(x===nn){Ne("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(S){for(let U=0;U<S.length;U++)if(S[U].isOutputPass===!0){Te("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(S||[])},this.getCurrentViewport=function(S){return S.copy(ge)},this.getViewport=function(S){return S.copy(Pe)},this.setViewport=function(S,U,G,k){S.isVector4?Pe.set(S.x,S.y,S.z,S.w):Pe.set(S,U,G,k),_.viewport(ge.copy(Pe).multiplyScalar(te).round())},this.getScissor=function(S){return S.copy(St)},this.setScissor=function(S,U,G,k){S.isVector4?St.set(S.x,S.y,S.z,S.w):St.set(S,U,G,k),_.scissor(ye.copy(St).multiplyScalar(te).round())},this.getScissorTest=function(){return Ye},this.setScissorTest=function(S){_.setScissorTest(Ye=S)},this.setOpaqueSort=function(S){De=S},this.setTransparentSort=function(S){Be=S},this.getClearColor=function(S){return S.copy(ze.getClearColor())},this.setClearColor=function(){ze.setClearColor(...arguments)},this.getClearAlpha=function(){return ze.getClearAlpha()},this.setClearAlpha=function(){ze.setClearAlpha(...arguments)},this.clear=function(S=!0,U=!0,G=!0){let k=0;if(S){let B=!1;if(Q!==null){const pe=Q.texture.format;B=m.has(pe)}if(B){const pe=Q.texture.type,ve=g.has(pe),fe=ze.getClearColor(),be=ze.getClearAlpha(),we=fe.r,He=fe.g,We=fe.b;ve?(M[0]=we,M[1]=He,M[2]=We,M[3]=be,N.clearBufferuiv(N.COLOR,0,M)):(b[0]=we,b[1]=He,b[2]=We,b[3]=be,N.clearBufferiv(N.COLOR,0,b))}else k|=N.COLOR_BUFFER_BIT}U&&(k|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),G&&(k|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k!==0&&N.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(S){S.setRenderer(this),D=S},this.dispose=function(){t.removeEventListener("webglcontextlost",yt,!1),t.removeEventListener("webglcontextrestored",dt,!1),t.removeEventListener("webglcontextcreationerror",Sn,!1),ze.dispose(),he.dispose(),le.dispose(),z.dispose(),ne.dispose(),J.dispose(),me.dispose(),j.dispose(),oe.dispose(),Se.dispose(),Se.removeEventListener("sessionstart",xc),Se.removeEventListener("sessionend",_c),Ei.stop()};function yt(S){S.preventDefault(),xa("WebGLRenderer: Context Lost."),P=!0}function dt(){xa("WebGLRenderer: Context Restored."),P=!1;const S=F.autoReset,U=Ie.enabled,G=Ie.autoUpdate,k=Ie.needsUpdate,B=Ie.type;Ee(),F.autoReset=S,Ie.enabled=U,Ie.autoUpdate=G,Ie.needsUpdate=k,Ie.type=B}function Sn(S){Ne("WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function bn(S){const U=S.target;U.removeEventListener("dispose",bn),Hd(U)}function Hd(S){Gd(S),z.remove(S)}function Gd(S){const U=z.get(S).programs;U!==void 0&&(U.forEach(function(G){oe.releaseProgram(G)}),S.isShaderMaterial&&oe.releaseShaderCache(S))}this.renderBufferDirect=function(S,U,G,k,B,pe){U===null&&(U=zt);const ve=B.isMesh&&B.matrixWorld.determinantAffine()<0,fe=Xd(S,U,G,k,B);_.setMaterial(k,ve);let be=G.index,we=1;if(k.wireframe===!0){if(be=X.getWireframeAttribute(G),be===void 0)return;we=2}const He=G.drawRange,We=G.attributes.position;let Re=He.start*we,ot=(He.start+He.count)*we;pe!==null&&(Re=Math.max(Re,pe.start*we),ot=Math.min(ot,(pe.start+pe.count)*we)),be!==null?(Re=Math.max(Re,0),ot=Math.min(ot,be.count)):We!=null&&(Re=Math.max(Re,0),ot=Math.min(ot,We.count));const bt=ot-Re;if(bt<0||bt===1/0)return;me.setup(B,k,fe,G,be);let Mt,ht=ie;if(be!==null&&(Mt=ae.get(be),ht=$,ht.setIndex(Mt)),B.isMesh)k.wireframe===!0?(_.setLineWidth(k.wireframeLinewidth*wt()),ht.setMode(N.LINES)):ht.setMode(N.TRIANGLES);else if(B.isLine){let Ht=k.linewidth;Ht===void 0&&(Ht=1),_.setLineWidth(Ht*wt()),B.isLineSegments?ht.setMode(N.LINES):B.isLineLoop?ht.setMode(N.LINE_LOOP):ht.setMode(N.LINE_STRIP)}else B.isPoints?ht.setMode(N.POINTS):B.isSprite&&ht.setMode(N.TRIANGLES);if(B.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))ht.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else{const Ht=B._multiDrawStarts,_e=B._multiDrawCounts,jt=B._multiDrawCount,Je=be?ae.get(be).bytesPerElement:1,rn=z.get(k).currentProgram.getUniforms();for(let Tn=0;Tn<jt;Tn++)rn.setValue(N,"_gl_DrawID",Tn),ht.render(Ht[Tn]/Je,_e[Tn])}else if(B.isInstancedMesh)ht.renderInstances(Re,bt,B.count);else if(G.isInstancedBufferGeometry){const Ht=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,_e=Math.min(G.instanceCount,Ht);ht.renderInstances(Re,bt,_e)}else ht.render(Re,bt)};function gc(S,U,G){S.transparent===!0&&S.side===Pn&&S.forceSinglePass===!1?(S.side=Qt,S.needsUpdate=!0,Tr(S,U,G),S.side=ii,S.needsUpdate=!0,Tr(S,U,G),S.side=Pn):Tr(S,U,G)}this.compile=function(S,U,G=null){G===null&&(G=S),T=le.get(G),T.init(U),v.push(T),G.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(T.pushLight(B),B.castShadow&&T.pushShadow(B))}),S!==G&&S.traverseVisible(function(B){B.isLight&&B.layers.test(U.layers)&&(T.pushLight(B),B.castShadow&&T.pushShadow(B))}),T.setupLights();const k=new Set;return S.traverse(function(B){if(!(B.isMesh||B.isPoints||B.isLine||B.isSprite))return;const pe=B.material;if(pe)if(Array.isArray(pe))for(let ve=0;ve<pe.length;ve++){const fe=pe[ve];gc(fe,G,B),k.add(fe)}else gc(pe,G,B),k.add(pe)}),T=v.pop(),k},this.compileAsync=function(S,U,G=null){const k=this.compile(S,U,G);return new Promise(B=>{function pe(){if(k.forEach(function(ve){z.get(ve).currentProgram.isReady()&&k.delete(ve)}),k.size===0){B(S);return}setTimeout(pe,10)}nt.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Ia=null;function Vd(S){Ia&&Ia(S)}function xc(){Ei.stop()}function _c(){Ei.start()}const Ei=new vd;Ei.setAnimationLoop(Vd),typeof self<"u"&&Ei.setContext(self),this.setAnimationLoop=function(S){Ia=S,Se.setAnimationLoop(S),S===null?Ei.stop():Ei.start()},Se.addEventListener("sessionstart",xc),Se.addEventListener("sessionend",_c),this.render=function(S,U){if(U!==void 0&&U.isCamera!==!0){Ne("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;D!==null&&D.renderStart(S,U);const G=Se.enabled===!0&&Se.isPresenting===!0,k=E!==null&&(Q===null||G)&&E.begin(C,Q);if(S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Se.enabled===!0&&Se.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Se.cameraAutoUpdate===!0&&Se.updateCamera(U),U=Se.getCamera()),S.isScene===!0&&S.onBeforeRender(C,S,U,Q),T=le.get(S,v.length),T.init(U),T.state.textureUnits=W.getTextureUnits(),v.push(T),At.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),ct.setFromProjectionMatrix(At,Ln,U.reversedDepth),$e=this.localClippingEnabled,et=Ce.init(this.clippingPlanes,$e),A=he.get(S,R.length),A.init(),R.push(A),Se.enabled===!0&&Se.isPresenting===!0){const ve=C.xr.getDepthSensingMesh();ve!==null&&La(ve,U,-1/0,C.sortObjects)}La(S,U,0,C.sortObjects),A.finish(),C.sortObjects===!0&&A.sort(De,Be,U.reversedDepth),vt=Se.enabled===!1||Se.isPresenting===!1||Se.hasDepthSensing()===!1,vt&&ze.addToRenderList(A,S),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),et===!0&&Ce.beginShadows();const B=T.state.shadowsArray;if(Ie.render(B,S,U),et===!0&&Ce.endShadows(),(k&&E.hasRenderPass())===!1){const ve=A.opaque,fe=A.transmissive;if(T.setupLights(),U.isArrayCamera){const be=U.cameras;if(fe.length>0)for(let we=0,He=be.length;we<He;we++){const We=be[we];yc(ve,fe,S,We)}vt&&ze.render(S);for(let we=0,He=be.length;we<He;we++){const We=be[we];vc(A,S,We,We.viewport)}}else fe.length>0&&yc(ve,fe,S,U),vt&&ze.render(S),vc(A,S,U)}Q!==null&&H===0&&(W.updateMultisampleRenderTarget(Q),W.updateRenderTargetMipmap(Q)),k&&E.end(C),S.isScene===!0&&S.onAfterRender(C,S,U),me.resetDefaultState(),ee=-1,de=null,v.pop(),v.length>0?(T=v[v.length-1],W.setTextureUnits(T.state.textureUnits),et===!0&&Ce.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?A=R[R.length-1]:A=null,D!==null&&D.renderEnd()};function La(S,U,G,k){if(S.visible===!1)return;if(S.layers.test(U.layers)){if(S.isGroup)G=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(U);else if(S.isLightProbeGrid)T.pushLightProbeGrid(S);else if(S.isLight)T.pushLight(S),S.castShadow&&T.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||ct.intersectsSprite(S)){k&&Ot.setFromMatrixPosition(S.matrixWorld).applyMatrix4(At);const ve=J.update(S),fe=S.material;fe.visible&&A.push(S,ve,fe,G,Ot.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||ct.intersectsObject(S))){const ve=J.update(S),fe=S.material;if(k&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ot.copy(S.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),Ot.copy(ve.boundingSphere.center)),Ot.applyMatrix4(S.matrixWorld).applyMatrix4(At)),Array.isArray(fe)){const be=ve.groups;for(let we=0,He=be.length;we<He;we++){const We=be[we],Re=fe[We.materialIndex];Re&&Re.visible&&A.push(S,ve,Re,G,Ot.z,We)}}else fe.visible&&A.push(S,ve,fe,G,Ot.z,null)}}const pe=S.children;for(let ve=0,fe=pe.length;ve<fe;ve++)La(pe[ve],U,G,k)}function vc(S,U,G,k){const{opaque:B,transmissive:pe,transparent:ve}=S;T.setupLightsView(G),et===!0&&Ce.setGlobalState(C.clippingPlanes,G),k&&_.viewport(ge.copy(k)),B.length>0&&br(B,U,G),pe.length>0&&br(pe,U,G),ve.length>0&&br(ve,U,G),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function yc(S,U,G,k){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[k.id]===void 0){const Re=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[k.id]=new Dn(1,1,{generateMipmaps:!0,type:Re?si:nn,minFilter:Zn,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace})}const pe=T.state.transmissionRenderTarget[k.id],ve=k.viewport||ge;pe.setSize(ve.z*C.transmissionResolutionScale,ve.w*C.transmissionResolutionScale);const fe=C.getRenderTarget(),be=C.getActiveCubeFace(),we=C.getActiveMipmapLevel();C.setRenderTarget(pe),C.getClearColor(_t),je=C.getClearAlpha(),je<1&&C.setClearColor(16777215,.5),C.clear(),vt&&ze.render(G);const He=C.toneMapping;C.toneMapping=Nn;const We=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),T.setupLightsView(k),et===!0&&Ce.setGlobalState(C.clippingPlanes,k),br(S,G,k),W.updateMultisampleRenderTarget(pe),W.updateRenderTargetMipmap(pe),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let ot=0,bt=U.length;ot<bt;ot++){const Mt=U[ot],{object:ht,geometry:Ht,material:_e,group:jt}=Mt;if(_e.side===Pn&&ht.layers.test(k.layers)){const Je=_e.side;_e.side=Qt,_e.needsUpdate=!0,Mc(ht,G,k,Ht,_e,jt),_e.side=Je,_e.needsUpdate=!0,Re=!0}}Re===!0&&(W.updateMultisampleRenderTarget(pe),W.updateRenderTargetMipmap(pe))}C.setRenderTarget(fe,be,we),C.setClearColor(_t,je),We!==void 0&&(k.viewport=We),C.toneMapping=He}function br(S,U,G){const k=U.isScene===!0?U.overrideMaterial:null;for(let B=0,pe=S.length;B<pe;B++){const ve=S[B],{object:fe,geometry:be,group:we}=ve;let He=ve.material;He.allowOverride===!0&&k!==null&&(He=k),fe.layers.test(G.layers)&&Mc(fe,U,G,be,He,we)}}function Mc(S,U,G,k,B,pe){S.onBeforeRender(C,U,G,k,B,pe),S.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),B.onBeforeRender(C,U,G,k,S,pe),B.transparent===!0&&B.side===Pn&&B.forceSinglePass===!1?(B.side=Qt,B.needsUpdate=!0,C.renderBufferDirect(G,U,k,B,S,pe),B.side=ii,B.needsUpdate=!0,C.renderBufferDirect(G,U,k,B,S,pe),B.side=Pn):C.renderBufferDirect(G,U,k,B,S,pe),S.onAfterRender(C,U,G,k,B,pe)}function Tr(S,U,G){U.isScene!==!0&&(U=zt);const k=z.get(S),B=T.state.lights,pe=T.state.shadowsArray,ve=B.state.version,fe=oe.getParameters(S,B.state,pe,U,G,T.state.lightProbeGridArray),be=oe.getProgramCacheKey(fe);let we=k.programs;k.environment=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?U.environment:null,k.fog=U.fog;const He=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap;k.envMap=ne.get(S.envMap||k.environment,He),k.envMapRotation=k.environment!==null&&S.envMap===null?U.environmentRotation:S.envMapRotation,we===void 0&&(S.addEventListener("dispose",bn),we=new Map,k.programs=we);let We=we.get(be);if(We!==void 0){if(k.currentProgram===We&&k.lightsStateVersion===ve)return bc(S,fe),We}else fe.uniforms=oe.getUniforms(S),D!==null&&S.isNodeMaterial&&D.build(S,G,fe),S.onBeforeCompile(fe,C),We=oe.acquireProgram(fe,be),we.set(be,We),k.uniforms=fe.uniforms;const Re=k.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(Re.clippingPlanes=Ce.uniform),bc(S,fe),k.needsLights=Kd(S),k.lightsStateVersion=ve,k.needsLights&&(Re.ambientLightColor.value=B.state.ambient,Re.lightProbe.value=B.state.probe,Re.directionalLights.value=B.state.directional,Re.directionalLightShadows.value=B.state.directionalShadow,Re.spotLights.value=B.state.spot,Re.spotLightShadows.value=B.state.spotShadow,Re.rectAreaLights.value=B.state.rectArea,Re.ltc_1.value=B.state.rectAreaLTC1,Re.ltc_2.value=B.state.rectAreaLTC2,Re.pointLights.value=B.state.point,Re.pointLightShadows.value=B.state.pointShadow,Re.hemisphereLights.value=B.state.hemi,Re.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Re.spotLightMatrix.value=B.state.spotLightMatrix,Re.spotLightMap.value=B.state.spotLightMap,Re.pointShadowMatrix.value=B.state.pointShadowMatrix),k.lightProbeGrid=T.state.lightProbeGridArray.length>0,k.currentProgram=We,k.uniformsList=null,We}function Sc(S){if(S.uniformsList===null){const U=S.currentProgram.getUniforms();S.uniformsList=la.seqWithValue(U.seq,S.uniforms)}return S.uniformsList}function bc(S,U){const G=z.get(S);G.outputColorSpace=U.outputColorSpace,G.batching=U.batching,G.batchingColor=U.batchingColor,G.instancing=U.instancing,G.instancingColor=U.instancingColor,G.instancingMorph=U.instancingMorph,G.skinning=U.skinning,G.morphTargets=U.morphTargets,G.morphNormals=U.morphNormals,G.morphColors=U.morphColors,G.morphTargetsCount=U.morphTargetsCount,G.numClippingPlanes=U.numClippingPlanes,G.numIntersection=U.numClipIntersection,G.vertexAlphas=U.vertexAlphas,G.vertexTangents=U.vertexTangents,G.toneMapping=U.toneMapping}function Wd(S,U){if(S.length===0)return null;if(S.length===1)return S[0].texture!==null?S[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let G=0,k=S.length;G<k;G++){const B=S[G];if(B.texture!==null&&B.boundingBox.containsPoint(y))return B}return null}function Xd(S,U,G,k,B){U.isScene!==!0&&(U=zt),W.resetTextureUnits();const pe=U.fog,ve=k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial?U.environment:null,fe=Q===null?C.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Ke.workingColorSpace,be=k.isMeshStandardMaterial||k.isMeshLambertMaterial&&!k.envMap||k.isMeshPhongMaterial&&!k.envMap,we=ne.get(k.envMap||ve,be),He=k.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,We=!!G.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Re=!!G.morphAttributes.position,ot=!!G.morphAttributes.normal,bt=!!G.morphAttributes.color;let Mt=Nn;k.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Mt=C.toneMapping);const ht=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ht=ht!==void 0?ht.length:0,_e=z.get(k),jt=T.state.lights;if(et===!0&&($e===!0||S!==de)){const ft=S===de&&k.id===ee;Ce.setState(k,S,ft)}let Je=!1;k.version===_e.__version?(_e.needsLights&&_e.lightsStateVersion!==jt.state.version||_e.outputColorSpace!==fe||B.isBatchedMesh&&_e.batching===!1||!B.isBatchedMesh&&_e.batching===!0||B.isBatchedMesh&&_e.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&_e.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&_e.instancing===!1||!B.isInstancedMesh&&_e.instancing===!0||B.isSkinnedMesh&&_e.skinning===!1||!B.isSkinnedMesh&&_e.skinning===!0||B.isInstancedMesh&&_e.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&_e.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&_e.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&_e.instancingMorph===!1&&B.morphTexture!==null||_e.envMap!==we||k.fog===!0&&_e.fog!==pe||_e.numClippingPlanes!==void 0&&(_e.numClippingPlanes!==Ce.numPlanes||_e.numIntersection!==Ce.numIntersection)||_e.vertexAlphas!==He||_e.vertexTangents!==We||_e.morphTargets!==Re||_e.morphNormals!==ot||_e.morphColors!==bt||_e.toneMapping!==Mt||_e.morphTargetsCount!==Ht||!!_e.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Je=!0):(Je=!0,_e.__version=k.version);let rn=_e.currentProgram;Je===!0&&(rn=Tr(k,U,B),D&&k.isNodeMaterial&&D.onUpdateProgram(k,rn,_e));let Tn=!1,li=!1,Ki=!1;const ut=rn.getUniforms(),Tt=_e.uniforms;if(_.useProgram(rn.program)&&(Tn=!0,li=!0,Ki=!0),k.id!==ee&&(ee=k.id,li=!0),_e.needsLights){const ft=Wd(T.state.lightProbeGridArray,B);_e.lightProbeGrid!==ft&&(_e.lightProbeGrid=ft,li=!0)}if(Tn||de!==S){_.buffers.depth.getReversed()&&S.reversedDepth!==!0&&(S._reversedDepth=!0,S.updateProjectionMatrix()),ut.setValue(N,"projectionMatrix",S.projectionMatrix),ut.setValue(N,"viewMatrix",S.matrixWorldInverse);const hi=ut.map.cameraPosition;hi!==void 0&&hi.setValue(N,Pt.setFromMatrixPosition(S.matrixWorld)),w.logarithmicDepthBuffer&&ut.setValue(N,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ut.setValue(N,"isOrthographic",S.isOrthographicCamera===!0),de!==S&&(de=S,li=!0,Ki=!0)}if(_e.needsLights&&(jt.state.directionalShadowMap.length>0&&ut.setValue(N,"directionalShadowMap",jt.state.directionalShadowMap,W),jt.state.spotShadowMap.length>0&&ut.setValue(N,"spotShadowMap",jt.state.spotShadowMap,W),jt.state.pointShadowMap.length>0&&ut.setValue(N,"pointShadowMap",jt.state.pointShadowMap,W)),B.isSkinnedMesh){ut.setOptional(N,B,"bindMatrix"),ut.setOptional(N,B,"bindMatrixInverse");const ft=B.skeleton;ft&&(ft.boneTexture===null&&ft.computeBoneTexture(),ut.setValue(N,"boneTexture",ft.boneTexture,W))}B.isBatchedMesh&&(ut.setOptional(N,B,"batchingTexture"),ut.setValue(N,"batchingTexture",B._matricesTexture,W),ut.setOptional(N,B,"batchingIdTexture"),ut.setValue(N,"batchingIdTexture",B._indirectTexture,W),ut.setOptional(N,B,"batchingColorTexture"),B._colorsTexture!==null&&ut.setValue(N,"batchingColorTexture",B._colorsTexture,W));const ci=G.morphAttributes;if((ci.position!==void 0||ci.normal!==void 0||ci.color!==void 0)&&L.update(B,G,rn),(li||_e.receiveShadow!==B.receiveShadow)&&(_e.receiveShadow=B.receiveShadow,ut.setValue(N,"receiveShadow",B.receiveShadow)),(k.isMeshStandardMaterial||k.isMeshLambertMaterial||k.isMeshPhongMaterial)&&k.envMap===null&&U.environment!==null&&(Tt.envMapIntensity.value=U.environmentIntensity),Tt.dfgLUT!==void 0&&(Tt.dfgLUT.value=vy()),li){if(ut.setValue(N,"toneMappingExposure",C.toneMappingExposure),_e.needsLights&&qd(Tt,Ki),pe&&k.fog===!0&&Ae.refreshFogUniforms(Tt,pe),Ae.refreshMaterialUniforms(Tt,k,te,re,T.state.transmissionRenderTarget[S.id]),_e.needsLights&&_e.lightProbeGrid){const ft=_e.lightProbeGrid;Tt.probesSH.value=ft.texture,Tt.probesMin.value.copy(ft.boundingBox.min),Tt.probesMax.value.copy(ft.boundingBox.max),Tt.probesResolution.value.copy(ft.resolution)}la.upload(N,Sc(_e),Tt,W)}if(k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(la.upload(N,Sc(_e),Tt,W),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ut.setValue(N,"center",B.center),ut.setValue(N,"modelViewMatrix",B.modelViewMatrix),ut.setValue(N,"normalMatrix",B.normalMatrix),ut.setValue(N,"modelMatrix",B.matrixWorld),k.uniformsGroups!==void 0){const ft=k.uniformsGroups;for(let hi=0,Yi=ft.length;hi<Yi;hi++){const Tc=ft[hi];j.update(Tc,rn),j.bind(Tc,rn)}}return rn}function qd(S,U){S.ambientLightColor.needsUpdate=U,S.lightProbe.needsUpdate=U,S.directionalLights.needsUpdate=U,S.directionalLightShadows.needsUpdate=U,S.pointLights.needsUpdate=U,S.pointLightShadows.needsUpdate=U,S.spotLights.needsUpdate=U,S.spotLightShadows.needsUpdate=U,S.rectAreaLights.needsUpdate=U,S.hemisphereLights.needsUpdate=U}function Kd(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return q},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(S,U,G){const k=z.get(S);k.__autoAllocateDepthBuffer=S.resolveDepthBuffer===!1,k.__autoAllocateDepthBuffer===!1&&(k.__useRenderToTexture=!1),z.get(S.texture).__webglTexture=U,z.get(S.depthTexture).__webglTexture=k.__autoAllocateDepthBuffer?void 0:G,k.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(S,U){const G=z.get(S);G.__webglFramebuffer=U,G.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(S,U=0,G=0){Q=S,q=U,H=G;let k=null,B=!1,pe=!1;if(S){const fe=z.get(S);if(fe.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(N.FRAMEBUFFER,fe.__webglFramebuffer),ge.copy(S.viewport),ye.copy(S.scissor),Qe=S.scissorTest,_.viewport(ge),_.scissor(ye),_.setScissorTest(Qe),ee=-1;return}else if(fe.__webglFramebuffer===void 0)W.setupRenderTarget(S);else if(fe.__hasExternalTextures)W.rebindTextures(S,z.get(S.texture).__webglTexture,z.get(S.depthTexture).__webglTexture);else if(S.depthBuffer){const He=S.depthTexture;if(fe.__boundDepthTexture!==He){if(He!==null&&z.has(He)&&(S.width!==He.image.width||S.height!==He.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");W.setupDepthRenderbuffer(S)}}const be=S.texture;(be.isData3DTexture||be.isDataArrayTexture||be.isCompressedArrayTexture)&&(pe=!0);const we=z.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(we[U])?k=we[U][G]:k=we[U],B=!0):S.samples>0&&W.useMultisampledRTT(S)===!1?k=z.get(S).__webglMultisampledFramebuffer:Array.isArray(we)?k=we[G]:k=we,ge.copy(S.viewport),ye.copy(S.scissor),Qe=S.scissorTest}else ge.copy(Pe).multiplyScalar(te).floor(),ye.copy(St).multiplyScalar(te).floor(),Qe=Ye;if(G!==0&&(k=V),_.bindFramebuffer(N.FRAMEBUFFER,k)&&_.drawBuffers(S,k),_.viewport(ge),_.scissor(ye),_.setScissorTest(Qe),B){const fe=z.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+U,fe.__webglTexture,G)}else if(pe){const fe=U;for(let be=0;be<S.textures.length;be++){const we=z.get(S.textures[be]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+be,we.__webglTexture,G,fe)}}else if(S!==null&&G!==0){const fe=z.get(S.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,fe.__webglTexture,G)}ee=-1},this.readRenderTargetPixels=function(S,U,G,k,B,pe,ve,fe=0){if(!(S&&S.isWebGLRenderTarget)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let be=z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be){_.bindFramebuffer(N.FRAMEBUFFER,be);try{const we=S.textures[fe],He=we.format,We=we.type;if(S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+fe),!w.textureFormatReadable(He)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!w.textureTypeReadable(We)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=S.width-k&&G>=0&&G<=S.height-B&&N.readPixels(U,G,k,B,ce.convert(He),ce.convert(We),pe)}finally{const we=Q!==null?z.get(Q).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,we)}}},this.readRenderTargetPixelsAsync=async function(S,U,G,k,B,pe,ve,fe=0){if(!(S&&S.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let be=z.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&ve!==void 0&&(be=be[ve]),be)if(U>=0&&U<=S.width-k&&G>=0&&G<=S.height-B){_.bindFramebuffer(N.FRAMEBUFFER,be);const we=S.textures[fe],He=we.format,We=we.type;if(S.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+fe),!w.textureFormatReadable(He))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!w.textureTypeReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Re=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Re),N.bufferData(N.PIXEL_PACK_BUFFER,pe.byteLength,N.STREAM_READ),N.readPixels(U,G,k,B,ce.convert(He),ce.convert(We),0);const ot=Q!==null?z.get(Q).__webglFramebuffer:null;_.bindFramebuffer(N.FRAMEBUFFER,ot);const bt=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await hp(N,bt,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Re),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,pe),N.deleteBuffer(Re),N.deleteSync(bt),pe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(S,U=null,G=0){const k=Math.pow(2,-G),B=Math.floor(S.image.width*k),pe=Math.floor(S.image.height*k),ve=U!==null?U.x:0,fe=U!==null?U.y:0;W.setTexture2D(S,0),N.copyTexSubImage2D(N.TEXTURE_2D,G,0,0,ve,fe,B,pe),_.unbindTexture()},this.copyTextureToTexture=function(S,U,G=null,k=null,B=0,pe=0){let ve,fe,be,we,He,We,Re,ot,bt;const Mt=S.isCompressedTexture?S.mipmaps[pe]:S.image;if(G!==null)ve=G.max.x-G.min.x,fe=G.max.y-G.min.y,be=G.isBox3?G.max.z-G.min.z:1,we=G.min.x,He=G.min.y,We=G.isBox3?G.min.z:0;else{const Tt=Math.pow(2,-B);ve=Math.floor(Mt.width*Tt),fe=Math.floor(Mt.height*Tt),S.isDataArrayTexture?be=Mt.depth:S.isData3DTexture?be=Math.floor(Mt.depth*Tt):be=1,we=0,He=0,We=0}k!==null?(Re=k.x,ot=k.y,bt=k.z):(Re=0,ot=0,bt=0);const ht=ce.convert(U.format),Ht=ce.convert(U.type);let _e;U.isData3DTexture?(W.setTexture3D(U,0),_e=N.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(W.setTexture2DArray(U,0),_e=N.TEXTURE_2D_ARRAY):(W.setTexture2D(U,0),_e=N.TEXTURE_2D),_.activeTexture(N.TEXTURE0),_.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,U.flipY),_.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),_.pixelStorei(N.UNPACK_ALIGNMENT,U.unpackAlignment);const jt=_.getParameter(N.UNPACK_ROW_LENGTH),Je=_.getParameter(N.UNPACK_IMAGE_HEIGHT),rn=_.getParameter(N.UNPACK_SKIP_PIXELS),Tn=_.getParameter(N.UNPACK_SKIP_ROWS),li=_.getParameter(N.UNPACK_SKIP_IMAGES);_.pixelStorei(N.UNPACK_ROW_LENGTH,Mt.width),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Mt.height),_.pixelStorei(N.UNPACK_SKIP_PIXELS,we),_.pixelStorei(N.UNPACK_SKIP_ROWS,He),_.pixelStorei(N.UNPACK_SKIP_IMAGES,We);const Ki=S.isDataArrayTexture||S.isData3DTexture,ut=U.isDataArrayTexture||U.isData3DTexture;if(S.isDepthTexture){const Tt=z.get(S),ci=z.get(U),ft=z.get(Tt.__renderTarget),hi=z.get(ci.__renderTarget);_.bindFramebuffer(N.READ_FRAMEBUFFER,ft.__webglFramebuffer),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,hi.__webglFramebuffer);for(let Yi=0;Yi<be;Yi++)Ki&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(S).__webglTexture,B,We+Yi),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,z.get(U).__webglTexture,pe,bt+Yi)),N.blitFramebuffer(we,He,ve,fe,Re,ot,ve,fe,N.DEPTH_BUFFER_BIT,N.NEAREST);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(B!==0||S.isRenderTargetTexture||z.has(S)){const Tt=z.get(S),ci=z.get(U);_.bindFramebuffer(N.READ_FRAMEBUFFER,Y),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,O);for(let ft=0;ft<be;ft++)Ki?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Tt.__webglTexture,B,We+ft):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Tt.__webglTexture,B),ut?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ci.__webglTexture,pe,bt+ft):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ci.__webglTexture,pe),B!==0?N.blitFramebuffer(we,He,ve,fe,Re,ot,ve,fe,N.COLOR_BUFFER_BIT,N.NEAREST):ut?N.copyTexSubImage3D(_e,pe,Re,ot,bt+ft,we,He,ve,fe):N.copyTexSubImage2D(_e,pe,Re,ot,we,He,ve,fe);_.bindFramebuffer(N.READ_FRAMEBUFFER,null),_.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else ut?S.isDataTexture||S.isData3DTexture?N.texSubImage3D(_e,pe,Re,ot,bt,ve,fe,be,ht,Ht,Mt.data):U.isCompressedArrayTexture?N.compressedTexSubImage3D(_e,pe,Re,ot,bt,ve,fe,be,ht,Mt.data):N.texSubImage3D(_e,pe,Re,ot,bt,ve,fe,be,ht,Ht,Mt):S.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,pe,Re,ot,ve,fe,ht,Ht,Mt.data):S.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,pe,Re,ot,Mt.width,Mt.height,ht,Mt.data):N.texSubImage2D(N.TEXTURE_2D,pe,Re,ot,ve,fe,ht,Ht,Mt);_.pixelStorei(N.UNPACK_ROW_LENGTH,jt),_.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Je),_.pixelStorei(N.UNPACK_SKIP_PIXELS,rn),_.pixelStorei(N.UNPACK_SKIP_ROWS,Tn),_.pixelStorei(N.UNPACK_SKIP_IMAGES,li),pe===0&&U.generateMipmaps&&N.generateMipmap(_e),_.unbindTexture()},this.initRenderTarget=function(S){z.get(S).__webglFramebuffer===void 0&&W.setupRenderTarget(S)},this.initTexture=function(S){S.isCubeTexture?W.setTextureCube(S,0):S.isData3DTexture?W.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?W.setTexture2DArray(S,0):W.setTexture2D(S,0),_.unbindTexture()},this.resetState=function(){q=0,H=0,Q=null,_.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ln}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}}function yy(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new Ft;let c=0;for(let h=0;h<s.length;++h){const u=s[h];let d=0;if(t!==(u.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const f in u.attributes){if(!n.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+f+'" attribute exists among all geometries, or in none of them.'),null;r[f]===void 0&&(r[f]=[]),r[f].push(u.attributes[f]),d++}if(d!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==u.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const f in u.morphAttributes){if(!i.has(f))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[f]===void 0&&(a[f]=[]),a[f].push(u.morphAttributes[f])}if(e){let f;if(t)f=u.index.count;else if(u.attributes.position!==void 0)f=u.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,f,h),c+=f}}if(t){let h=0;const u=[];for(let d=0;d<s.length;++d){const f=s[d].index;for(let p=0;p<f.count;++p)u.push(f.getX(p)+h);h+=s[d].attributes.position.count}l.setIndex(u)}for(const h in r){const u=nu(r[h]);if(!u)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,u)}for(const h in a){const u=a[h][0].length;if(u!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let d=0;d<u;++d){const f=[];for(let x=0;x<a[h].length;++x)f.push(a[h][x][d]);const p=nu(f);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function nu(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){const h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new Xt(a,t,n);let l=0;for(let c=0;c<s.length;++c){const h=s[c];if(h.isInterleavedBufferAttribute){const u=l/t;for(let d=0,f=h.count;d<f;d++)for(let p=0;p<t;p++){const x=h.getComponent(d,p);o.setComponent(d+u,p,x)}}else a.set(h.array,l);l+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function iu(s,e){if(e===Qf)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===yl||e===Xu){let t=s.getIndex();if(t===null){const a=[],o=s.getAttribute("position");if(o!==void 0){for(let l=0;l<o.count;l++)a.push(l);s.setIndex(a),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===yl)for(let a=1;a<=n;a++)i.push(t.getX(0)),i.push(t.getX(a)),i.push(t.getX(a+1));else for(let a=0;a<n;a++)a%2===0?(i.push(t.getX(a)),i.push(t.getX(a+1)),i.push(t.getX(a+2))):(i.push(t.getX(a+2)),i.push(t.getX(a+1)),i.push(t.getX(a)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");const r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function Kt(s,e=.75,t=0){return new Sr({color:s,roughness:e,metalness:t,flatShading:!1})}function My(){return{skin:Kt(13014134,.82),shadow:Kt(10317141,.88),hair:Kt(2108488,.68),uniform:Kt(2182520,.76),uniformLight:Kt(3235723,.68),uniformDeep:Kt(1322832,.84),pants:Kt(1581622,.84),accent:Kt(14728524,.58),belt:Kt(1514280,.9),boot:Kt(1120034,.9),glove:Kt(1119773,.88),glovePad:Kt(2436405,.78),eyeWhite:Kt(16250093,.62),eyeBlue:Kt(3906516,.5),eyeDark:Kt(1054765,.7)}}function Oe(s,e,t,n,i){e.position.set(t,n,i),s.add(e)}function ln(s,e,t=32){return new Le(new Aa(e.map(([n,i])=>new se(n,i)),t),s)}function Sy(s){const e=ln(s,[[.055,-.08],[.11,-.075],[.14,-.02],[.145,.07],[.12,.12],[.04,.14]],32);return e.scale.set(1,.62,1.45),e}function by(s,e,t){const n=new Le(new Zt(1,24,16),e.skin);n.scale.set(.135,.155,.105),Oe(s,n,0,-.52,.015);const i=new Le(new Wt(.105,.045,6,18),e.glove);i.scale.z=.82,Oe(s,i,0,-.39,.02);const r=new Le(new Wt(.102,.035,5,16),e.glovePad);r.scale.set(1,1,.78),Oe(s,r,0,-.405,.085);const a=new Le(new Zt(1,24,16),e.glove);a.scale.set(.12,.112,.095),Oe(s,a,0,-.495,.085);const o=new Le(new Zt(1,20,14),e.glovePad);o.scale.set(.078,.045,.018),Oe(s,o,0,-.46,.178);const l=[[-.09,.125,.037],[-.03,.145,.04],[.03,.14,.04],[.09,.115,.037]];for(const[h,u,d]of l){const f=new Le(new Wt(d,u,6,14),e.skin);Oe(s,f,h,-.635-(.14-u)*.18,.025)}const c=new Le(new Wt(.041,.115,6,14),e.skin);c.rotation.z=-t*.72,Oe(s,c,t*.145,-.575,.035)}function Ty(){const s=new Zt(1,32,18);return s.scale(.36,.13,.12),s.translate(0,.29,.39),s.computeVertexNormals(),s.toNonIndexed()}function su(s){const e=new Wt(.105,.46,7,18);return e.applyMatrix4(new Fe().makeRotationZ(s*.045)),e.applyMatrix4(new Fe().makeTranslation(s*.35,-.03,.36)),e.computeVertexNormals(),e.toNonIndexed()}function Ey(){const s=new Aa([new se(.22,-.43),new se(.31,-.39),new se(.39,-.28),new se(.43,-.1),new se(.44,.13),new se(.41,.31),new se(.34,.42),new se(.22,.47),new se(0,.48)],40);s.applyMatrix4(new Fe().makeScale(1.05,1,.84)),s.applyMatrix4(new Fe().makeTranslation(0,0,-.075)),s.computeVertexNormals();const e=yy([s.toNonIndexed(),Ty(),su(-1),su(1)],!1);if(!e)throw new Error("Mara hair geometry merge failed");return e.computeVertexNormals(),e}function ru(s,e,t){const n=new Le(new Zt(1,24,16),e.shadow);n.scale.set(.132,.118,.045),Oe(s,n,t,.022,.335);const i=new Le(new Zt(1,28,18),e.eyeWhite);i.scale.set(.101,.112,.046),Oe(s,i,t,.018,.367);const r=new Le(new Zt(1,24,16),e.eyeBlue);r.scale.set(.068,.079,.038),Oe(s,r,t,.012,.414);const a=new Le(new Zt(1,20,14),e.eyeDark);a.scale.set(.035,.052,.031),Oe(s,a,t,.008,.451);const o=new Le(new Zt(1,14,10),e.eyeWhite);o.scale.set(.017,.02,.014),Oe(s,o,t-.022,.044,.481);const l=new Le(new Wt(.012,.13,4,12),e.eyeDark);l.rotation.z=Math.PI/2,Oe(s,l,t,.087,.443);const c=new Le(new Wt(.013,.105,4,12),e.hair);c.rotation.z=Math.PI/2+(t<0?-.18:.18),Oe(s,c,t,.151,.397)}function Ay(s,e){ru(s,e,-.125),ru(s,e,.125);const t=ln(e.shadow,[[.018,-.025],[.028,0],[.016,.028],[0,.04]],16);t.scale.set(1,1,.5),Oe(s,t,0,-.055,.356);const n=new Le(new ac(.065,.009,6,18,Math.PI),e.shadow);n.rotation.set(Math.PI/2,0,Math.PI),Oe(s,n,0,-.15,.346)}function wy(s,e){const t=new Le(new Vi(.102,.102,.018,28),e.belt);t.rotation.x=Math.PI/2,Oe(s,t,.13,.39,.292);const n=new Le(new Vi(.086,.086,.022,28),e.accent);n.rotation.x=Math.PI/2,Oe(s,n,.13,.39,.309);const i=new Le(new Vi(.038,.038,.026,5),e.belt);i.rotation.set(Math.PI/2,0,Math.PI/4),Oe(s,i,.13,.39,.325)}function ms(s,e,t,n,i,r=.13){const a=new Le(new Wt(.018,r,6,12),e);a.scale.z=.62,a.rotation.z=i,Oe(s,a,t,n,.292)}function Ry(s,e){const t=new ld;return t.moveTo(0,.06),t.lineTo(e*.135,.085),t.lineTo(e*.045,-.055),t.lineTo(0,-.015),t.closePath(),new Le(new rc(t),s)}function au(s){return ln(s,[[.045,-.065],[.068,-.052],[.078,-.025],[.078,.038],[.062,.064],[.038,.068]],20)}function Cy(s,e){const t=new Le(new Wt(.052,.068,5,12),e.belt);t.scale.z=.16,Oe(s,t,0,-.105,.108);const n=new Le(new ai(.052,.012,.012),e.accent);Oe(s,n,0,-.105,.124)}function Py(s){let e=0;return s.traverse(t=>{if(!t.isMesh)return;const n=t.geometry;e+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}),Math.round(e)}function Iy(){const s=My(),e=new Xe,t=new Xe,n=new Xe,i=new Xe,r=new Xe,a=new Xe,o=new Xe,l=new Xe,c=new Xe;e.add(t),t.position.y=.64;for(const[m,g]of[[o,-.14],[l,.14]])m.position.x=g,Oe(m,ln(s.pants,[[.075,-.51],[.105,-.46],[.115,-.22],[.13,-.04],[.09,.02]],32),0,0,0),Oe(m,Sy(s.boot),0,-.57,.075),t.add(m);Oe(t,ln(s.pants,[[.2,-.1],[.275,-.04],[.28,.04],[.235,.12]],36),0,-.01,0),t.add(n),n.position.y=.03,Oe(n,ln(s.uniform,[[.18,.02],[.265,.1],[.3,.28],[.285,.48],[.23,.61],[.12,.65]],40),0,.04,0);for(const m of[-1,1]){const g=new Le(new Zt(1,20,14),s.uniformLight);g.scale.set(.13,.105,.13),Oe(n,g,m*.255,.48,.015);const M=new Le(new Wt(.022,.13,6,12),s.uniformDeep);M.scale.z=.55,M.rotation.z=-m*.36,Oe(n,M,m*.225,.37,.286)}ms(n,s.uniformDeep,-.205,.42,-.52,.14),ms(n,s.uniformLight,-.19,.39,-.52,.1),ms(n,s.uniformDeep,.205,.42,.52,.14),ms(n,s.uniformLight,.19,.39,.52,.1),ms(n,s.uniformDeep,-.14,.19,.2,.13),ms(n,s.uniformDeep,.14,.19,-.2,.13),Oe(n,ln(s.belt,[[.255,0],[.285,.035],[.278,.085],[.25,.11]],36),0,0,0);const h=new Le(new ai(.12,.1,.035,3,3,2),s.accent);Oe(n,h,0,.065,.285);for(const m of[-1,1]){const g=au(s.belt);Oe(n,g,m*.205,.068,.292);const M=new Le(new Wt(.045,.055,5,12),s.glovePad);M.scale.set(1.15,.34,.16),Oe(n,M,m*.205,.105,.365);const b=new Le(new Zt(.012,12,8),s.accent);Oe(n,b,m*.205,.105,.383)}const u=au(s.belt);u.scale.set(.72,1.12,.82),Oe(n,u,.3,.105,.12);const d=new Le(new ai(.065,.018,.018),s.accent);Oe(n,d,.3,.168,.18),wy(n,s);for(const m of[-1,1]){const g=Ry(s.uniformLight,m);Oe(n,g,0,.575,.301)}const f=new Le(new Wt(.047,.035,5,12),s.belt);f.scale.z=.34,Oe(n,f,0,.515,.318);const p=new Le(new Wt(.038,.205,5,12),s.belt);p.scale.z=.3,Oe(n,p,0,.395,.315);for(const[m,g]of[[r,-.375],[a,.375]])m.position.set(g,.43,0),Oe(m,ln(s.uniform,[[.075,-.18],[.105,-.12],[.11,.03],[.085,.12]],32),0,-.1,0),Cy(m,s),Oe(m,ln(s.skin,[[.055,-.43],[.082,-.36],[.085,-.23],[.068,-.16]],32),0,-.1,0),by(m,s,g<0?-1:1),n.add(m);a.add(c),c.position.set(0,-.43,.13),Oe(c,ln(s.belt,[[.035,-.32],[.05,-.25],[.052,.24],[.035,.32]],20),0,-.17,0),Oe(c,ln(s.accent,[[.055,-.06],[.065,0],[.055,.06]],20),0,.13,0),n.add(i),i.position.y=.76,Oe(i,ln(s.skin,[[.16,-.3],[.29,-.24],[.35,-.1],[.37,.08],[.36,.25],[.29,.36],[.16,.4]],40),0,0,0),Oe(i,new Le(Ey(),s.hair),0,0,0),Ay(i,s);const x=new Xe;return x.add(e),e.position.y=.08,{root:x,hip:t,torso:n,head:i,armL:r,armR:a,legL:o,legR:l,weap:c,tris:Py(x)}}const To=2.15,ca=420,ha=520;function Rd(s,e){const t=e==="f";switch(s){case"mara":return{skin:13014134,shadow:10317141,hair:2108488,shirt:2182520,pants:1581622,accent:14728524,metal:12568788,shoe:1514280};case"dana":return{skin:11697242,shadow:9393983,hair:5978408,shirt:2970216,pants:2108218,accent:14268750,metal:12628893,shoe:1645349};case"priya":return{skin:9854784,shadow:7356719,hair:1905424,shirt:15328728,pants:2643038,accent:13192016,metal:14212322,shoe:2105386};case"hale":return{skin:13806212,shadow:10976349,hair:7628371,shirt:4278102,pants:2698552,accent:16762967,metal:12037788,shoe:1579554};case"crosby":return{skin:12358768,shadow:9396557,hair:3155231,shirt:6565176,pants:3283750,accent:15777874,metal:13741397,shoe:1512221};case"beckett":return{skin:11568226,shadow:8868157,hair:4072735,shirt:10105916,pants:3152932,accent:16747590,metal:13154454,shoe:1512731};case"delinquent":return{skin:t?13014648:11832428,shadow:9133388,hair:t?5582445:2103848,shirt:5203020,pants:2698806,accent:12668775,metal:11053750,shoe:1514016};case"magician":return{skin:t?13478026:12226158,shadow:9791055,hair:t?7614880:2626870,shirt:7354535,pants:2497094,accent:15056213,metal:14731384,shoe:1511718};case"wolverine":return{skin:7887430,shadow:5783599,hair:4928808,shirt:7755838,pants:5257772,accent:14711356,metal:13156526,shoe:2103572};case"boxer":return{skin:11171928,shadow:8212541,hair:1774872,shirt:15263980,pants:2434610,accent:14237772,metal:12369608,shoe:1513504};case"gunner":return{skin:t?13147776:11700328,shadow:9134926,hair:t?3548702:2170146,shirt:3229240,pants:2634542,accent:6667384,metal:8689035,shoe:1448986};case"worker":return{skin:12490358,shadow:9200463,hair:3156002,shirt:15772214,pants:3490909,accent:3698345,metal:11449533,shoe:1777705};default:return{skin:13148802,shadow:9859418,hair:2696750,shirt:15789286,pants:2370624,accent:5404848,metal:12235163,shoe:1513763}}}function wn(s,e=.75,t=0){return new Sr({color:s,roughness:e,metalness:t,flatShading:!1})}function Cd(s){return{skin:wn(s.skin,.82),shadow:wn(s.shadow,.88),hair:wn(s.hair,.7),shirt:wn(s.shirt),pants:wn(s.pants,.84),accent:wn(s.accent,.58),metal:wn(s.metal,.28,.45),shoe:wn(s.shoe,.9),white:wn(16250093,.62),dark:wn(1446683,.82)}}function Ly(s){return s==="attack"?ca:s==="cast"?ha:0}function Ny(s,e){const t=Ly(s.anim);if(t>0){const i=((typeof performance<"u"?performance.now():e)-s.animStart)/t;if(i<1)return{clip:s.anim,t:Math.max(0,i)}}return s.anim==="walk"?{clip:"walk",t:e/280%1}:{clip:"idle",t:e/900%1}}function Dy(s,e,t){const n=[{x:0,y:-1},{x:1,y:-1},{x:1,y:0},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}][t];return{x:-n.y*s+n.x*e,y:n.x*s+n.y*e}}function ou(s,e,t){return Dy(s,e,t)}function Ma(s){return 58*s}function Me(s,e,t,n,i){e.position.set(t,n,i),s.add(e)}function pt(s,e,t,n=12,i=4){return new Le(new Wt(e,t,i,n),s)}function xt(s,e,t=16,n=12){return new Le(new Zt(e,t,n),s)}function yn(s,e,t,n){return new Le(new ai(e,t,n,2,2,2),s)}function hc(s,e,t){return new Le(new nc(e,t,20,5),s)}function Sa(s,e,t,n,i){Me(s,xt(e.white,.075,10,8),t,n,i),Me(s,xt(e.dark,.043,8,6),t,n,i+.06)}function Uy(s,e,t,n,i){if(Sa(s,e,-i*.32,.03,i*.89),Sa(s,e,i*.32,.03,i*.89),Me(s,xt(e.shadow,.035,8,6),0,-.075,i*.94),Me(s,yn(e.dark,n==="f"?.13:.16,.025,.02),0,-.16,i*.91),n==="f"&&(Me(s,xt(e.accent,.035,8,6),-i*.56,-.11,i*.85),Me(s,xt(e.accent,.035,8,6),i*.56,-.11,i*.85)),t==="hale"){const r=xt(e.hair,i*.48,12,8);r.scale.set(1,.55,.62),Me(s,r,0,-i*.35,i*.63)}}function Fy(s,e,t,n){const i=xt(e.hair,n*1.07,28,20);if(i.scale.set(1.08,1.02,.91),Me(s,i,0,n*.18,-n*.11),t==="f"){for(const a of[-1,1]){const o=pt(e.hair,n*.105,n*.58,14,5);o.rotation.z=a*.08,Me(s,o,a*n*.82,-n*.13,n*.27)}const r=pt(e.hair,n*.13,n*.62,14,5);r.rotation.z=Math.PI/2,Me(s,r,0,n*.41,n*.66)}}function Oy(s,e,t){const n=xt(e.hair,t*1.08,32,24);n.scale.set(1.22,1.42,1),Me(s,n,0,-t*.1,-t*.1);const i=pt(e.hair,t*.16,t*1.18,20,6);i.rotation.z=Math.PI/2,Me(s,i,0,t*.27,t*.78);for(const r of[-1,1]){const a=pt(e.hair,t*.14,t*.78,18,6);a.rotation.z=r*.06,Me(s,a,r*t*.91,-t*.25,t*.27)}}function ky(s,e,t){const n=xt(e.hair,t*1.08,32,24);n.scale.set(1.1,1.12,.92),Me(s,n,0,t*.25,-t*.1);const i=pt(e.hair,t*.34,t*.38,20,6);i.rotation.x=-.18,Me(s,i,0,t*.66,-t*.52);const r=pt(e.hair,t*.5,t*1.58,24,8);r.rotation.x=-.1,Me(s,r,0,-t*.16,-t*1.02);const a=xt(e.hair,t*.58,32,24);a.scale.set(1.1,1.12,.94),Me(s,a,0,-t*.9,-t*1.06);for(const[o,l,c,h]of[[-.78,.52,.43,-.16],[-.52,.55,.3,-.08],[-.26,.56,.46,-.03],[0,.55,.33,0],[.27,.56,.49,.04],[.53,.54,.34,.09],[.79,.5,.44,.16]])er(s,e.hair,t*.17,t*c,o*t,l*t,t*.68,h,-1,.24);for(const o of[-1,1]){const l=pt(e.hair,t*.12,t*.86,18,6);l.rotation.z=o*.08,Me(s,l,o*t*.86,-t*.2,t*.28)}}function By(s,e,t){const n=xt(e.hair,t*1.05,28,20);n.scale.set(1.07,1,.89),Me(s,n,0,t*.2,-t*.13);const i=xt(e.hair,t*.96,28,20);i.scale.set(1.1,1.02,.94),Me(s,i,t*.3,t*.72,-t*.96);const r=xt(e.hair,t*.48,24,18);r.scale.set(1.15,.88,1),Me(s,r,t*.28,t*.42,-t*.78);const a=pt(e.hair,t*.26,t*.4,16,6);Me(s,a,0,t*.1,-t*.54);for(const l of[-1,1]){const c=pt(e.hair,t*.115,t*.76,14,5);c.rotation.z=l*.82,Me(s,c,l*t*.27,t*.43,t*.54);const h=pt(e.hair,t*.105,t*.72,14,5);h.rotation.z=l*.05,Me(s,h,l*t*.82,-t*.17,t*.28)}const o=pt(e.hair,t*.075,t*.42,12,4);o.rotation.z=Math.PI/2,Me(s,o,0,t*.48,t*.58)}function er(s,e,t,n,i,r,a,o,l,c){const h=new I(o,l,c).normalize(),u=hc(e,t,n);u.quaternion.setFromUnitVectors(new I(0,1,0),h),Me(s,u,i+h.x*n*.25,r+h.y*n*.25,a+h.z*n*.25)}function zy(s,e,t){const n=xt(e.hair,t*1.08,28,20);n.scale.set(1.12,1.04,.92),Me(s,n,0,t*.18,-t*.12);const i=xt(e.hair,t*.62,24,18);i.scale.set(1.3,.82,1.02),Me(s,i,0,t*.04,-t*.73);const r=[[0,.72,.16,.15,.42,1,.04],[-.4,.63,.3,.14,.56,.86,.2],[.42,.64,.3,.14,.56,.86,.2],[-.82,.4,.02,.13,.9,.16,.02],[.82,.4,.02,.13,.9,.16,.02],[-.62,.1,-1.22,.12,.25,.15,-1],[0,.1,-1.28,.14,0,.12,-1],[.62,.1,-1.22,.12,-.25,.15,-1],[-.4,-.12,-1.2,.11,.2,-.12,-.96],[.4,-.12,-1.2,.11,-.2,-.12,-.96],[-.64,.48,.52,.13,-.2,.75,.56],[.64,.48,.52,.13,-.2,.75,.56]];for(const[a,o,l,c,h,u,d]of r)er(s,e.hair,t*c,t*.7,a*t,o*t,l*t,h,u,d);for(const[a,o,l,c]of[[-.9,.35,-.75,.55],[-.58,.7,-.5,.9],[-.2,.86,-.18,1],[.2,.86,.18,1],[.58,.7,.5,.9],[.9,.35,.75,.55],[-.82,-.1,-.7,-.45],[.82,-.1,.7,-.45]])er(s,e.hair,t*.21,t*.92,a*t,o*t,-t*1.34,l,c,-.58);for(const[a,o,l,c]of[[-.72,.28,-.65,.55],[-.38,.48,-.35,.82],[0,.56,0,.95],[.38,.48,.35,.82],[.72,.28,.65,.55],[-.72,-.18,-.45,-.35],[.72,-.18,.45,-.35]])er(s,e.hair,t*.15,t*.62,a*t,o*t,-t*1.18,l,c,-.68);for(const a of[-.55,-.18,.18,.55])er(s,e.hair,t*.11,t*.34,a*t,t*.48,t*.66,a*.22,-.7,.68)}function Hy(s,e,t,n,i){if(t==="mara"?Oy(s,e,i):t==="dana"?ky(s,e,i):t==="priya"?By(s,e,i):t==="delinquent"?zy(s,e,i):Fy(s,e,n,i),t==="crosby"){const r=xt(e.shirt,i*1.22,24,18);r.scale.set(1.04,.92,1.04),Me(s,r,0,0,-i*.12)}if(t==="magician"&&(Me(s,new Le(new Vi(i*1.25,i*1.25,.08,24),e.accent),0,i*.86,0),Me(s,hc(e.shirt,i*.65,i),0,i*1.22,0)),t==="worker"){const r=xt(e.accent,i*1.16,24,18);r.scale.set(1.05,.42,1.05),Me(s,r,0,i*.77,0),Me(s,yn(e.accent,i*1.35,.06,i*.55),0,i*.67,i*.42)}}function Gy(s,e,t){if(e==="mara"||e==="delinquent")Me(t,pt(s.metal,.055,.58,10,3),0,-.18,.12);else if(e==="gunner"||e==="crosby"||e==="beckett"){const n=pt(s.metal,.07,.38,10,3);n.rotation.x=Math.PI/2,Me(t,n,0,.02,.2),Me(t,yn(s.shoe,.12,.12,.34),0,-.03,-.08)}else e==="magician"?(Me(t,pt(s.metal,.045,.72,10,3),0,-.16,.08),Me(t,xt(s.accent,.11,14,10),0,.26,.08)):e==="official"?Me(t,yn(s.white,.25,.32,.04),.04,0,.15):e==="priya"?(Me(t,yn(s.white,.28,.18,.16),0,0,.1),Me(t,yn(s.accent,.05,.2,.17),0,0,.19)):e==="hale"?Me(t,yn(s.accent,.12,.12,.28),0,0,.16):e==="dana"&&Me(t,pt(s.metal,.045,.48,10,3),0,-.1,.12)}function Pd(s){let e=0;return s.traverse(t=>{if(t.isMesh){const n=t.geometry;e+=n.index?n.index.count/3:(n.attributes.position?.count??0)/3}}),Math.round(e)}function Vy(s,e){const t=Cd(Rd(s,e)),n=new Xe,i=new Xe,r=new Xe,a=new Xe,o=new Xe,l=new Xe,c=new Xe,h=new Xe,u=new Xe,d=e==="f";n.add(i),i.position.y=.64;for(const[m,g]of[[c,-.16],[h,.16]]){m.position.x=g,Me(m,pt(t.pants,.115,d?.31:.34),0,-.16,0),Me(m,pt(t.pants,.1,.22),0,-.41,0);const M=pt(t.shoe,.12,.16);M.scale.set(1,.55,1.45),Me(m,M,0,-.59,.08),i.add(m)}Me(i,pt(t.pants,.27,.12,14,4),0,-.02,0),i.add(r),r.position.y=.03;const f=pt(t.shirt,d?.285:.31,.34,14,5);f.scale.z=d?.76:.82,Me(r,f,0,.26,0),(s==="priya"||s==="official")&&Me(r,yn(t.accent,.06,.26,.035),0,.28,.255),s==="worker"&&Me(r,yn(t.accent,.38,.27,.05),0,.25,.25),s==="boxer"&&(Me(r,yn(t.accent,.25,.16,.04),-.22,.19,.24),Me(r,yn(t.accent,.25,.16,.04),.22,.19,.24));for(const[m,g]of[[o,-.39],[l,.39]])m.position.set(g,.43,0),Me(m,pt(t.shirt,.105,.2),0,-.11,0),Me(m,pt(t.skin,.09,.19),0,-.32,0),Me(m,xt(t.skin,.1,12,8),0,-.46,0),s==="boxer"&&Me(m,xt(t.accent,.14,14,10),0,-.49,.02),r.add(m);l.add(u),u.position.set(0,-.44,.13),Gy(t,s,u),r.add(a),a.position.y=.76;const p=d?.36:.34;Me(a,xt(t.skin,p,20,14),0,0,0),Uy(a,t,s,e,p),Hy(a,t,s,e,p);const x=new Xe;return x.add(n),n.position.y=.08,{root:x,hip:i,torso:r,head:a,armL:o,armR:l,legL:c,legR:h,weap:u,tris:Pd(x)}}function Wy(){const s=Cd(Rd("wolverine","m")),e=new Xe,t=new Xe,n=new Xe,i=new Xe,r=new Xe,a=new Xe,o=new Xe,l=new Xe,c=new Xe;e.add(t),t.position.y=.44;const h=pt(s.shirt,.38,.52,16,5);h.rotation.z=Math.PI/2,Me(t,h,0,.18,.02),t.add(n),n.position.set(0,.38,.2),n.add(i),Me(i,xt(s.skin,.31,18,12),0,.1,.31),Me(i,xt(s.shadow,.22,14,10),0,.02,.57),Sa(i,s,-.1,.16,.58),Sa(i,s,.1,.16,.58);for(const d of[-.2,.2])Me(i,hc(s.hair,.12,.28),d,.38,.25);for(const[d,f,p]of[[o,-.22,.28],[l,.22,.28],[r,-.22,-.28],[a,.22,-.28]])d.position.set(f,0,p),Me(d,pt(s.pants,.12,.28),0,-.12,0),t.add(d);const u=pt(s.hair,.07,.4,10,3);return u.rotation.x=-.35,Me(t,u,0,.18,-.55),a.add(c),{root:e,hip:t,torso:n,head:i,armL:r,armR:a,legL:o,legR:l,weap:c,tris:Pd(e)}}const lu=new Map;function Id(s,e){const t=`${s}:${e}`,n=lu.get(t);if(n)return n;const i={parts:s==="mara"?Iy():s==="wolverine"?Wy():Vy(s,e)};return lu.set(t,i),i}function Xy(s,e,t,n,i){const{hip:r,torso:a,head:o,armL:l,armR:c,legL:h,legR:u,weap:d}=s;for(const p of[r,a,o,l,c,h,u,d])p.rotation.set(0,0,0);if(r.position.y=e==="wolverine"?.44:.64,a.position.y=e==="wolverine"?.38:.03,t==="idle"){const p=Math.sin(i/420)*.025;a.position.y+=p,o.rotation.z=Math.sin(i/900)*.035,l.rotation.x=.06+p,c.rotation.x=.06-p;return}if(t==="walk"){const p=Math.sin(n*Math.PI*2),x=Math.cos(n*Math.PI*2);h.rotation.x=p*.5,u.rotation.x=-p*.5,l.rotation.x=-p*.38,c.rotation.x=p*.38,a.position.y+=Math.abs(x)*.035,r.position.y+=Math.abs(p)*.018;return}if(t==="attack"){const p=n<.62;e==="wolverine"?(a.rotation.x=p?-.28:0,l.rotation.x=p?-.75:.15,c.rotation.x=p?-.75:.15,r.position.z=p?.14:0):e==="boxer"?(c.rotation.x=n<.35?-.35:p?-1.35:-.25,c.rotation.z=p?-.28:0,a.rotation.y=p?-.22:0,l.rotation.x=-.55):(c.rotation.x=n<.35?-.45:p?-1.35:-.35,c.rotation.z=p?-.32:0,d.rotation.x=p?-.45:0,a.rotation.y=p?-.16:0,l.rotation.x=-.25);return}const f=n<.66;l.rotation.x=f?-2:-1.25,c.rotation.x=f?-2:-1.25,l.rotation.z=.36,c.rotation.z=-.36,o.rotation.x=f?-.12:0,a.position.y+=f?.05:.015}let Yn=null,Ui=null,Hi=null,Fi=null,cu=!1;function Ld(){if(cu&&Yn)return!0;if(typeof document>"u")return!1;try{const s=document.createElement("canvas");Yn=new wd({canvas:s,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"}),Yn.setSize(192,240,!1),Yn.setPixelRatio(1),Yn.setClearColor(0,0),Yn.outputColorSpace=It,Ui=new Ju;const e=192/240;Hi=new Ds(-1.35*e,1.35*e,1.35,-1.35,.1,40),Fi=new Xe,Ui.add(Fi),Ui.add(new xd(16774111,2238532,1.35));const t=new yr(16771015,1.7);t.position.set(3.5,6,4.5),Ui.add(t);const n=new yr(9680383,.65);return n.position.set(-4,2,-3),Ui.add(n),cu=!0,!0}catch{return!1}}function qy(s){return s*Math.PI/4}const Ky=30;function Yy(s,e){if(!Hi)return;const t=e*Math.PI/180,n=4.2,i=Math.cos(t),r=Math.sin(t);Hi.position.set(Math.sin(s)*i*n,r*n+.85,Math.cos(s)*i*n),Hi.lookAt(0,.88,0),Hi.updateProjectionMatrix()}function Eo(s,e,t,n,i,r=0){const a=e(0,0,0),o=Ma(i)*(t.role==="elite"?1.12:1),l=o*192/240;if(!Ld()||!Yn||!Ui||!Hi||!Fi){s.fillStyle="#6a7080",s.beginPath(),s.ellipse(a.x,a.y-o*.35,l*.22,o*.35,0,0,Math.PI*2),s.fill();return}const c=Id(t.archetype,t.gender),h=Ny(t,n);for(Xy(c.parts,t.archetype,h.clip,h.t,n);Fi.children.length;)Fi.remove(Fi.children[0]);c.parts.root.parent&&c.parts.root.parent.remove(c.parts.root),Fi.add(c.parts.root),c.parts.root.rotation.set(0,qy(t.dir),0),Yy(0,Ky),Yn.render(Ui,Hi),s.save(),s.imageSmoothingEnabled=!0,s.drawImage(Yn.domElement,a.x-l*.5,a.y-o*.88,l,o),s.restore()}function $y(){if(!Ld())return;const s=["mara","dana","priya","hale","crosby","beckett","delinquent","magician","wolverine","boxer","gunner","worker","official"];for(const e of s)for(const t of["f","m"])Id(e,t)}function Jy(s){const e=new Map,t=new Map,n=s.clone();return Nd(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Nd(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)Nd(s.children[n],e.children[n],t)}class Zy extends Ns{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new nM(t)}),this.register(function(t){return new iM(t)}),this.register(function(t){return new dM(t)}),this.register(function(t){return new fM(t)}),this.register(function(t){return new pM(t)}),this.register(function(t){return new rM(t)}),this.register(function(t){return new aM(t)}),this.register(function(t){return new oM(t)}),this.register(function(t){return new lM(t)}),this.register(function(t){return new tM(t)}),this.register(function(t){return new cM(t)}),this.register(function(t){return new sM(t)}),this.register(function(t){return new uM(t)}),this.register(function(t){return new hM(t)}),this.register(function(t){return new jy(t)}),this.register(function(t){return new hu(t,qe.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new hu(t,qe.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new mM(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=ar.extractUrlBase(e);a=ar.resolveURL(c,this.path)}else a=ar.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new gd(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Dd){try{a[qe.KHR_BINARY_GLTF]=new gM(e)}catch(u){i&&i(u);return}r=JSON.parse(a[qe.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new CM(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[u.name]=u,a[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case qe.KHR_MATERIALS_UNLIT:a[u]=new eM;break;case qe.KHR_DRACO_MESH_COMPRESSION:a[u]=new xM(r,this.dracoLoader);break;case qe.KHR_TEXTURE_TRANSFORM:a[u]=new _M;break;case qe.KHR_MESH_QUANTIZATION:a[u]=new vM;break;default:d.indexOf(u)>=0&&o[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function Qy(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Et(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const qe={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class jy{constructor(e){this.parser=e,this.name=qe.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new Ue(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],sn);const u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new yr(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new o0(h),c.distance=u;break;case"spot":c=new r0(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Rn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class eM{constructor(){this.name=qe.KHR_MATERIALS_UNLIT}getMaterialType(){return zi}extendParams(e,t,n){const i=[];e.color=new Ue(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],sn),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,It))}return Promise.all(i)}}class tM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class nM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new se(r,r)}return Promise.all(i)}}class iM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class sM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class rM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_SHEEN}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Ue(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],sn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,It)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class aM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class oM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_VOLUME}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ue().setRGB(r[0],r[1],r[2],sn),Promise.all(i)}}class lM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_IOR}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class cM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ue().setRGB(r[0],r[1],r[2],sn),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,It)),Promise.all(i)}}class hM{constructor(e){this.parser=e,this.name=qe.EXT_MATERIALS_BUMP}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class uM{constructor(e){this.parser=e,this.name=qe.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Et(this.parser,e,this.name)!==null?zn:null}extendMaterialParams(e,t){const n=Et(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class dM{constructor(e){this.parser=e,this.name=qe.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class fM{constructor(e){this.parser=e,this.name=qe.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class pM{constructor(e){this.parser=e,this.name=qe.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class hu{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):a.ready.then(function(){const f=new ArrayBuffer(h*u);return a.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}}class mM{constructor(e){this.name=qe.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==cn.TRIANGLES&&c.mode!==cn.TRIANGLE_STRIP&&c.mode!==cn.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(const p of u){const x=new Fe,m=new I,g=new fn,M=new I(1,1,1),b=new Qp(p.geometry,p.material,d);for(let y=0;y<d;y++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,y),l.ROTATION&&g.fromBufferAttribute(l.ROTATION,y),l.SCALE&&M.fromBufferAttribute(l.SCALE,y),b.setMatrixAt(y,x.compose(m,g,M));for(const y in l)if(y==="_COLOR_0"){const A=l[y];b.instanceColor=new bl(A.array,A.itemSize,A.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&p.geometry.setAttribute(y,l[y]);mt.prototype.copy.call(b,p),this.parser.assignFinalMaterial(b),f.push(b)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}}const Dd="glTF",$s=12,uu={JSON:1313821514,BIN:5130562};class gM{constructor(e){this.name=qe.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,$s),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Dd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-$s,r=new DataView(e,$s);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===uu.JSON){const c=new Uint8Array(e,$s+a,o);this.content=n.decode(c)}else if(l===uu.BIN){const c=$s+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class xM{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=qe.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const u=Pl[h]||h.toLowerCase();o[u]=a[h]}for(const h in e.attributes){const u=Pl[h]||h.toLowerCase();if(a[h]!==void 0){const d=n.accessors[e.attributes[h]],f=Ms[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(const p in f.attributes){const x=f.attributes[p],m=l[p];m!==void 0&&(x.normalized=m)}u(f)},o,c,sn,d)})})}}class _M{constructor(){this.name=qe.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}}class vM{constructor(){this.name=qe.KHR_MESH_QUANTIZATION}}class Ud extends Ps{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,p=e*c,x=p-c,m=-2*f+3*d,g=f-d,M=1-m,b=g-d+u;for(let y=0;y!==o;y++){const A=a[x+y+o],T=a[x+y+l]*h,R=a[p+y+o],v=a[p+y]*h;r[y]=M*A+b*T+m*R+g*v}return r}}const yM=new fn;class MM extends Ud{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return yM.fromArray(r).normalize().toArray(r),r}}const cn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Ms={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},du={9728:Lt,9729:Nt,9984:ku,9985:ia,9986:Zs,9987:Zn},fu={33071:In,33648:da,10497:Es},Ao={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Pl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},xi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},SM={CUBICSPLINE:void 0,LINEAR:dr,STEP:ur},wo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function bM(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Sr({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ii})),s.DefaultMaterial}function Pi(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Rn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function TM(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const u=e[c];if(n){const d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;a.push(d)}if(i){const d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;o.push(d)}if(r){const d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(d)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],u=c[1],d=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function EM(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function AM(s){let e;const t=s.extensions&&s.extensions[qe.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+Ro(t.attributes):e=s.indices+":"+Ro(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+Ro(s.targets[n]);return e}function Ro(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Il(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function wM(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const RM=new Fe;class CM{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Qy,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new i0(this.options.manager):this.textureLoader=new c0(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new gd(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Pi(r,o,i),Rn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[qe.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(ar.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=Ao[i.type],o=Ms[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Xt(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=Ao[i.type],c=Ms[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0;let x,m;if(f&&f!==u){const g=Math.floor(d/f),M="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+g+":"+i.count;let b=t.cache.get(M);b||(x=new c(o,g*f,i.count*f/h),b=new Xp(x,f/h),t.cache.add(M,b)),m=new Zl(b,l,d%f/h,p)}else o===null?x=new c(i.count*l):x=new c(o,d,i.count*l),m=new Xt(x,l,p);if(i.sparse!==void 0){const g=Ao.SCALAR,M=Ms[i.sparse.indices.componentType],b=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,A=new M(a[1],b,i.sparse.count*g),T=new c(a[2],y,i.sparse.count*l);o!==null&&(m=new Xt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let R=0,v=A.length;R<v;R++){const E=A[R];if(m.setX(E,T[R*l]),l>=2&&m.setY(E,T[R*l+1]),l>=3&&m.setZ(E,T[R*l+2]),l>=4&&m.setW(E,T[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=p}return m})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const d=(r.samplers||{})[a.sampler]||{};return h.magFilter=du[d.magFilter]||Nt,h.minFilter=du[d.minFilter]||Zn,h.wrapS=fu[d.wrapS]||Es,h.wrapT=fu[d.wrapT]||Es,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Lt&&h.minFilter!==Nt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(u){c=!0;const d=new Blob([u],{type:a.mimeType});return l=o.createObjectURL(d),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let p=d;t.isImageBitmapLoader===!0&&(p=function(x){const m=new Bt(x);m.needsUpdate=!0,d(m)}),t.load(ar.resolveURL(u,r.path),p,void 0,f)})}).then(function(u){return c===!0&&o.revokeObjectURL(l),Rn(u,a),u.userData.mimeType=a.mimeType||wM(a.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[qe.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[qe.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[qe.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new td,Un.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new ed,Un.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return Sr}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[qe.KHR_MATERIALS_UNLIT]){const u=i[qe.KHR_MATERIALS_UNLIT];a=u.getMaterialType(),c.push(u.extendParams(o,r,t))}else{const u=r.pbrMetallicRoughness||{};if(o.color=new Ue(1,1,1),o.opacity=1,Array.isArray(u.baseColorFactor)){const d=u.baseColorFactor;o.color.setRGB(d[0],d[1],d[2],sn),o.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",u.baseColorTexture,It)),o.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,o.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",u.metallicRoughnessTexture))),a=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Pn);const h=r.alphaMode||wo.OPAQUE;if(h===wo.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===wo.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==zi&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new se(1,1),r.normalTexture.scale!==void 0)){const u=r.normalTexture.scale;o.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&a!==zi&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==zi){const u=r.emissiveFactor;o.emissive=new Ue().setRGB(u[0],u[1],u[2],sn)}return r.emissiveTexture!==void 0&&a!==zi&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,It)),Promise.all(c).then(function(){const u=new a(o);return r.name&&(u.name=r.name),Rn(u,r),t.associations.set(u,{materials:e}),r.extensions&&Pi(i,u,r),u})}createUniqueName(e){const t=tt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[qe.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return pu(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=AM(c),u=i[h];if(u)a.push(u.promise);else{let d;c.extensions&&c.extensions[qe.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=pu(new Ft,c,t),i[h]={primitive:c,promise:d},a.push(d)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?bM(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,p=h.length;f<p;f++){const x=h[f],m=a[f];let g;const M=c[f];if(m.mode===cn.TRIANGLES||m.mode===cn.TRIANGLE_STRIP||m.mode===cn.TRIANGLE_FAN||m.mode===void 0)g=r.isSkinnedMesh===!0?new $p(x,M):new Le(x,M),g.isSkinnedMesh===!0&&g.normalizeSkinWeights(),m.mode===cn.TRIANGLE_STRIP?g.geometry=iu(g.geometry,Xu):m.mode===cn.TRIANGLE_FAN&&(g.geometry=iu(g.geometry,yl));else if(m.mode===cn.LINES)g=new nm(x,M);else if(m.mode===cn.LINE_STRIP)g=new tc(x,M);else if(m.mode===cn.LINE_LOOP)g=new im(x,M);else if(m.mode===cn.POINTS)g=new sm(x,M);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(g.geometry.morphAttributes).length>0&&EM(g,r),g.name=t.createUniqueName(r.name||"mesh_"+e),Rn(g,r),m.extensions&&Pi(i,g,m),t.assignFinalMaterial(g),u.push(g)}for(let f=0,p=u.length;f<p;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&Pi(i,u[0],r),u[0];const d=new Xe;r.extensions&&Pi(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,p=u.length;f<p;f++)d.add(u[f]);return d})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new Jt(Rp.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Ds(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Rn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const u=a[c];if(u){o.push(u);const d=new Fe;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new jl(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){const f=i.channels[u],p=i.samplers[f.sampler],x=f.target,m=x.node,g=i.parameters!==void 0?i.parameters[p.input]:p.input,M=i.parameters!==void 0?i.parameters[p.output]:p.output;x.node!==void 0&&(a.push(this.getDependency("node",m)),o.push(this.getDependency("accessor",g)),l.push(this.getDependency("accessor",M)),c.push(p),h.push(x))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){const d=u[0],f=u[1],p=u[2],x=u[3],m=u[4],g=[];for(let b=0,y=d.length;b<y;b++){const A=d[b],T=f[b],R=p[b],v=x[b],E=m[b];if(A===void 0)continue;A.updateMatrix&&A.updateMatrix();const C=n._createAnimationTracks(A,T,R,v,E);if(C)for(let P=0;P<C.length;P++)g.push(C[P])}const M=new wl(r,void 0,g);return Rn(M,i),M})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,RM)});for(let f=0,p=u.length;f<p;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){const f=h.userData.pivot,p=u[0];h.pivot=new I().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new ju:c.length>1?h=new Xe:c.length===1?h=c[0]:h=new mt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=a),Rn(h,r),r.extensions&&Pi(n,h,r),r.matrix!==void 0){const u=new Fe;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new Xe;n.name&&(r.name=i.createUniqueName(n.name)),Rn(r,n),n.extensions&&Pi(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,u=l.length;h<u;h++){const d=l[h];d.parent!==null?r.add(Jy(d)):r.add(d)}const c=h=>{const u=new Map;for(const[d,f]of i.associations)(d instanceof Un||d instanceof Bt)&&u.set(d,f);return h.traverse(d=>{const f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}xi[r.path]===xi.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(xi[r.path]){case xi.weights:h=_r;break;case xi.rotation:h=vr;break;case xi.translation:case xi.scale:h=ya;break;default:switch(n.itemSize){case 1:h=_r;break;case 2:case 3:default:h=ya;break}break}const u=i.interpolation!==void 0?SM[i.interpolation]:dr,d=this._getArrayFromAccessor(n);for(let f=0,p=l.length;f<p;f++){const x=new h(l[f]+"."+xi[r.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),a.push(x)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=Il(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof vr?MM:Ud;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function PM(s,e,t){const n=e.attributes,i=new oi;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new I(l[0],l[1],l[2]),new I(c[0],c[1],c[2])),o.normalized){const h=Il(Ms[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new I,l=new I;for(let c=0,h=r.length;c<h;c++){const u=r[c];if(u.POSITION!==void 0){const d=t.json.accessors[u.POSITION],f=d.min,p=d.max;if(f!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(p[2]))),d.normalized){const x=Il(Ms[d.componentType]);l.multiplyScalar(x)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new kn;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function pu(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=Pl[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return Ke.workingColorSpace!==sn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ke.workingColorSpace}" not supported.`),Rn(s,e),PM(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?TM(s,e.targets,t):s})}function IM(s){const e=s.replace(/^\//,"");if(typeof location<"u"&&location.pathname.includes("/scripts/"))return`/${e}`;const t="./";return t.endsWith("/")?`${t}${e}`:`${t}/${e}`}const LM=IM("models/quaternius/modular-women/Animated_Woman.glb"),NM=2108488,DM=30,Ll=192,Nl=240;let $n="idle",_i=null,Jn=null,Oi=null,Gi=null,ki=null,mu=!1;function UM(s){return s*Math.PI/4}function FM(){if(mu&&Jn)return!0;if(typeof document>"u")return!1;try{const s=document.createElement("canvas");Jn=new wd({canvas:s,alpha:!0,antialias:!0,preserveDrawingBuffer:!0,powerPreference:"low-power"}),Jn.setSize(Ll,Nl,!1),Jn.setPixelRatio(1),Jn.setClearColor(0,0),Jn.outputColorSpace=It,Oi=new Ju;const e=Ll/Nl;Gi=new Ds(-1.35*e,1.35*e,1.35,-1.35,.1,40),ki=new Xe,Oi.add(ki),Oi.add(new xd(16774111,2238532,1.35));const t=new yr(16771015,1.7);t.position.set(3.5,6,4.5),Oi.add(t);const n=new yr(9680383,.65);return n.position.set(-4,2,-3),Oi.add(n),mu=!0,!0}catch{return!1}}function OM(s,e){if(!Gi)return;const t=e*Math.PI/180,n=4.2,i=Math.cos(t),r=Math.sin(t);Gi.position.set(Math.sin(s)*i*n,r*n+.85,Math.cos(s)*i*n),Gi.lookAt(0,.88,0),Gi.updateProjectionMatrix()}function kM(s){s.traverse(e=>{const t=e;if(!t.isMesh)return;const n=Array.isArray(t.material)?t.material:[t.material];for(const i of n){const r=i;if(!r||!r.color)continue;(r.name||"").toLowerCase().includes("hair")&&(r.color.setHex(NM),r.map&&(r.map=null),r.needsUpdate=!0)}})}function BM(s){const e=s.animations??[],t=e.find(r=>/\|Idle$/i.test(r.name)||r.name==="Idle")??e.find(r=>/Idle_Neutral/i.test(r.name))??e.find(r=>/Idle/i.test(r.name));if(!t)return;const n=new T0(s.scene);n.clipAction(t).play(),n.setTime(0),n.update(0),s.scene.updateMatrixWorld(!0)}function Fd(){if($n==="loading"||$n==="ready")return;if($n="loading",!FM()){$n="error";return}new Zy().loadAsync(LM).then(e=>{BM(e),kM(e.scene);const t=new Xe;t.name="maraQuaterniusUmw",t.add(e.scene),_i=t,$n="ready"}).catch(e=>{const t=e instanceof Error?`${e.message}
${e.stack??""}`:String(e);console.warn("maraGltf load failed",t),$n="error"})}function zM(){Fd()}function HM(){return $n==="ready"&&!!_i}function GM(s,e,t,n){if(($n==="idle"||$n==="error")&&Fd(),!HM()||!_i||!Jn||!Oi||!Gi||!ki)return!1;const i=e(0,0,0),r=Ma(n)*(t.role==="elite"?1.12:1),a=r*Ll/Nl;for(;ki.children.length;)ki.remove(ki.children[0]);return _i.parent&&_i.parent.remove(_i),ki.add(_i),_i.rotation.set(0,UM(t.dir),0),OM(0,DM),Jn.render(Oi,Gi),s.save(),s.imageSmoothingEnabled=!0,s.drawImage(Jn.domElement,i.x-a*.5,i.y-r*.88,a,r),s.restore(),!0}const Dl=64,VM=24,WM=8,XM=15,qM=75,or=30;function gu(s){return Math.min(qM,Math.max(XM,s))}function KM(s,e,t,n,i){return{x:(s-e)*(Dl/2),y:(s+e)*(n/2)-t*i}}function xu(s,e,t,n,i,r,a,o){const l=a-t,c=o-n,h=i-t,u=r-n,d=s-t,f=e-n,p=l*l+c*c,x=l*h+c*u,m=l*d+c*f,g=h*h+u*u,M=h*d+u*f,b=p*g-x*x;if(Math.abs(b)<1e-8)return!1;const y=1/b,A=(g*m-x*M)*y,T=(p*M-x*m)*y;return A>=-.02&&T>=-.02&&A+T<=1.02}function _u(s,e,t,n,i,r){return xu(s,e,t.x,t.y,n.x,n.y,i.x,i.y)||xu(s,e,t.x,t.y,i.x,i.y,r.x,r.y)}function xn(s,e,t){return{x:s.x+(e.x-s.x)*t,y:s.y+(e.y-s.y)*t}}function Kn(s){const e=Math.sin(s*12.9898)*43758.5453;return e-Math.floor(e)}class YM{constructor(e){K(this,"canvas");K(this,"ctx");K(this,"cam",{x:-224,y:180,zoom:.7});K(this,"w",390);K(this,"h",700);K(this,"time",0);K(this,"yaw",0);K(this,"pitch",or);K(this,"mapW",10);K(this,"mapH",12);K(this,"kingsWharf",new Image);K(this,"mapDolls",{mara:new Image,dana:new Image,priya:new Image});K(this,"maraAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});K(this,"danaAngles",{front:new Image,ne:new Image,right:new Image,se:new Image,back:new Image,sw:new Image,left:new Image,nw:new Image});this.canvas=e;const t=e.getContext("2d");if(!t)throw new Error("canvas");this.ctx=t,this.kingsWharf.decoding="async",this.kingsWharf.src="./sprites/scene-kings-wharf.png";for(const[n,i]of Object.entries(this.mapDolls))i.decoding="async",i.src=`./sprites/${n}.png`;for(const[n,i]of Object.entries(this.maraAngles))i.decoding="async",i.src=`./sprites/mara-${n}.png`;for(const[n,i]of Object.entries(this.danaAngles))i.decoding="async",i.src=`./sprites/dana-${n}.png`;this.resize(),zM()}tileH(){return Dl*Math.sin(this.pitch*Math.PI/180)}blockH(){const e=Math.cos(or*Math.PI/180);return VM*Math.cos(this.pitch*Math.PI/180)/e}baseH(){const e=Math.cos(or*Math.PI/180);return WM*Math.cos(this.pitch*Math.PI/180)/e}addPitch(e){this.pitch=gu(this.pitch+e*.16)}setPitch(e){this.pitch=gu(e)}resize(){const e=Math.min(window.devicePixelRatio||1,2),t=this.canvas.getBoundingClientRect();this.w=Math.max(1,t.width),this.h=Math.max(1,t.height),this.canvas.width=Math.floor(this.w*e),this.canvas.height=Math.floor(this.h*e),this.ctx.setTransform(e,0,0,e,0,0)}forceSize(e,t){const n=Math.min(window.devicePixelRatio||1,2);this.w=e,this.h=t,this.canvas.style.width=`${e}px`,this.canvas.style.height=`${t}px`,this.canvas.width=Math.floor(e*n),this.canvas.height=Math.floor(t*n),this.ctx.setTransform(n,0,0,n,0,0)}syncMap(e){this.mapW=e.w,this.mapH=e.h}isoOf(e,t,n=0){const i=ks(e,t,this.yaw,this.mapW,this.mapH);return KM(i.x,i.y,n,this.tileH(),this.blockH())}worldToScreen(e,t,n=0){const i=this.isoOf(e,t,n);return{x:(i.x-this.cam.x)*this.cam.zoom+this.w/2,y:(i.y-this.cam.y)*this.cam.zoom+this.h/2}}topCorners(e,t,n){return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([r,a])=>this.worldToScreen(e+r,t+a,n))}topMetrics(e,t,n){const i=this.topCorners(e,t,n);let r=0,a=0;for(const c of i)r+=c.x,a+=c.y;r/=4,a/=4;let o=0,l=0;for(const c of i)o=Math.max(o,Math.abs(c.x-r)),l=Math.max(l,Math.abs(c.y-a));return{cx:r,cy:a,hw:o,hh:l,drop:(this.baseH()+n*this.blockH())*this.cam.zoom,top:i}}frontFaces(e,t){const n=[];for(let i=0;i<4;i++){const r=e[i],a=e[(i+1)%4],o={x:a.x,y:a.y+t},l={x:r.x,y:r.y+t};n.push({pts:[r,a,o,l],y:(r.y+a.y+o.y+l.y)/4})}return n.sort((i,r)=>i.y-r.y),n.slice(-2).map(i=>i.pts)}screenToGrid(e,t){const n=this.cam.x+(e-this.w/2)/this.cam.zoom,i=this.cam.y+(t-this.h/2)/this.cam.zoom,r=Dl/2,a=this.tileH()/2,o=(n/r+i/a)/2,l=(i/a-n/r)/2,c=Math.cos(this.yaw),h=Math.sin(this.yaw),u=o*c-l*h,d=o*h+l*c;return{x:u+(this.mapW-1)/2,y:d+(this.mapH-1)/2}}lockGridToScreen(e,t,n,i,r){const a=this.isoOf(e,t,n);this.cam.x=a.x-(i-this.w/2)/this.cam.zoom,this.cam.y=a.y-(r-this.h/2)/this.cam.zoom}cellsInDrawOrder(e){const t=[];for(let n=0;n<e.h;n++)for(let i=0;i<e.w;i++)t.push({x:i,y:n});return t.sort((n,i)=>{const r=ks(n.x,n.y,this.yaw,e.w,e.h),a=ks(i.x,i.y,this.yaw,e.w,e.h);return r.x+r.y-(a.x+a.y)}),t}hitTile(e,t,n){this.syncMap(n);let i=null;for(const r of this.cellsInDrawOrder(n)){const a=n.tiles[r.y][r.x];this.hitPrism(e,t,a)&&(i=r)}return i}hitPrism(e,t,n){const{drop:i,top:r}=this.topMetrics(n.x,n.y,n.h);if(_u(e,t,r[0],r[1],r[2],r[3]))return!0;for(const[a,o,l,c]of this.frontFaces(r,i))if(_u(e,t,a,o,l,c))return!0;return!1}rotate(e){this.syncMap(e);const t=this.hitTile(this.w/2,this.h/2,e)??{x:Math.floor(e.w/2),y:Math.floor(e.h/2)};this.yaw=sf(this.yaw);const n=e.heightAt(t.x,t.y),i=this.isoOf(t.x,t.y,n);this.cam.x=i.x,this.cam.y=i.y-24}centerOn(e,t){this.syncMap(t);const n=e.filter(a=>!a.dead&&a.team==="player"&&!a.npc);if(!n.length)return;let i=0,r=0;for(const a of n){const o=this.isoOf(a.x,a.y,t.heightAt(a.x,a.y));i+=o.x,r+=o.y}this.cam.x=i/n.length,this.cam.y=r/n.length-52,this.cam.zoom=.7}draw(e,t,n,i){const r=this.ctx;this.syncMap(e),this.time+=16,r.clearRect(0,0,this.w,this.h),this.drawBackdrop(e.theme);const a=new Map;for(const l of t)l.dead||a.set(Ze(l.x,l.y),l);const o=new Map;for(const l of e.objects)l.gone||o.set(Ze(l.x,l.y),l);for(const l of this.cellsInDrawOrder(e)){this.drawTile(e.tiles[l.y][l.x],e,n);const c=o.get(Ze(l.x,l.y));c&&this.drawBoardObj(c,e);const h=a.get(Ze(l.x,l.y));h&&this.drawUnit(h,e,n)}this.drawVignette(),this.drawFloats(i,e)}drawBackdrop(e){const t=this.ctx,n=t.createLinearGradient(0,0,0,this.h);if(e==="roof"&&this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0){const i=Math.max(this.w/this.kingsWharf.naturalWidth,this.h/this.kingsWharf.naturalHeight),r=this.kingsWharf.naturalWidth*i,a=this.kingsWharf.naturalHeight*i,o=(this.w-r)*.42,l=(this.h-a)*.46;t.save(),t.globalAlpha=.86,t.drawImage(this.kingsWharf,o,l,r,a),t.fillStyle="rgba(5, 8, 18, 0.42)",t.fillRect(0,0,this.w,this.h);const c=t.createLinearGradient(0,0,0,this.h);c.addColorStop(0,"rgba(4, 8, 18, 0.38)"),c.addColorStop(.5,"rgba(6, 7, 14, 0.08)"),c.addColorStop(1,"rgba(4, 5, 10, 0.62)"),t.fillStyle=c,t.fillRect(0,0,this.w,this.h),t.restore()}else e==="alley"||e==="warehouse"||e==="street"?(n.addColorStop(0,"#0c0d12"),n.addColorStop(.5,"#0a090c"),n.addColorStop(1,"#140c08")):(n.addColorStop(0,"#0b1020"),n.addColorStop(.45,"#090914"),n.addColorStop(1,"#120818")),t.fillStyle=n,t.fillRect(0,0,this.w,this.h);t.save(),t.globalAlpha=e==="roof"?.24:.16;for(let i=0;i<8;i++){const r=(i*73+this.time*.004%73)%this.w;t.fillStyle=e==="alley"?i%2?"#ffb040":"#c45a2a":i%2?"#ffb040":"#ff6b35",t.fillRect(r,8+i%3*10,18,4)}t.restore()}themeGroup(e){return e==="warehouse"||e==="street"||e==="alley"?"alley":"roof"}tilePaint(e,t,n){const i=e.blocked;return this.themeGroup(t)==="alley"?e.terrain==="stairs"?{top:n?"#6e6254":"#5e5248",left:"#3a3228",right:"#4a4034",rim:"rgba(220, 190, 140, 0.35)",seam:"rgba(30, 20, 12, 0.45)"}:e.terrain==="roof"?{top:n?"#3a3e4c":"#323644",left:"#241c1a",right:"#302624",rim:"rgba(180, 160, 130, 0.3)",seam:"rgba(20, 16, 14, 0.5)"}:{top:i?n?"#1e2228":"#1a1e24":n?"#2c323c":"#262c36",left:"#14161c",right:"#1c2026",rim:i?"rgba(180, 70, 50, 0.4)":"rgba(120, 160, 180, 0.28)",seam:"rgba(10, 12, 16, 0.5)"}:e.terrain==="stairs"?{top:n?"#6a6258":"#5a544c",left:"#3a342c",right:"#4a443c",rim:"rgba(210, 200, 180, 0.32)",seam:"rgba(28, 24, 20, 0.45)"}:e.terrain==="roof"?{top:i?n?"#2e2c3c":"#282636":n?"#4a4860":"#3e3c54",left:"#241e2c",right:"#302838",rim:i?"rgba(180, 70, 70, 0.4)":"rgba(140, 210, 230, 0.34)",seam:"rgba(18, 14, 28, 0.5)"}:{top:i?n?"#1c1a24":"#18161e":n?"#2c2a38":"#262430",left:"#16141c",right:"#201c28",rim:i?"rgba(180, 70, 70, 0.4)":"rgba(110, 190, 210, 0.28)",seam:"rgba(12, 10, 18, 0.5)"}}drawTile(e,t,n){const i=this.ctx,{cx:r,cy:a,hw:o,hh:l,drop:c,top:h}=this.topMetrics(e.x,e.y,e.h),u=Ze(e.x,e.y),d=(e.x+e.y)%2===0,f=this.cam.zoom,p=this.frontFaces(h,c),x=this.tilePaint(e,t.theme,d),m=p.slice().sort((M,b)=>(M[0].x+M[1].x)/2-(b[0].x+b[1].x)/2);for(let M=0;M<m.length;M++)this.drawWallFace(e,m[M],M===0?x.left:x.right,t.theme,f,e.x*13+e.y*7+M);this.drawTopSurface(e,t,h,r,a,o,l,x,f),this.drawRailings(e,t,h,f),this.drawProp(e,t.theme,r,a,o,l,f),n.move.has(u)&&(this.quadPath(this.insetQuad(h,.92)),i.fillStyle="rgba(62, 240, 208, 0.3)",i.fill(),i.strokeStyle="rgba(62, 240, 208, 0.9)",i.lineWidth=1.2,i.stroke());const g=n.areaKind;if(n.area.has(u)&&!n.hot.has(u)){const M=g==="skill"||g==="item"?"rgba(160, 130, 220, 0.16)":"rgba(255, 90, 110, 0.14)",b=g==="skill"||g==="item"?"rgba(180, 150, 230, 0.45)":"rgba(255, 110, 130, 0.42)";this.quadPath(this.insetQuad(h,.9)),i.fillStyle=M,i.fill(),i.strokeStyle=b,i.lineWidth=1.15,i.stroke()}if(n.hot.has(u)){const M=.5+.28*Math.sin(this.time/190),b=g==="skill"||g==="item"?`rgba(190, 150, 255, ${.28+M*.22})`:`rgba(255, 80, 110, ${.3+M*.22})`,y=g==="skill"||g==="item"?"rgba(230, 210, 255, 0.98)":"rgba(255, 170, 180, 0.98)";this.quadPath(this.insetQuad(h,.86)),i.fillStyle=b,i.fill(),i.strokeStyle=y,i.lineWidth=2.15,i.stroke()}n.inspect&&n.inspect.x===e.x&&n.inspect.y===e.y&&(this.quadPath(this.insetQuad(h,.96)),i.strokeStyle="rgba(255, 232, 160, 0.95)",i.lineWidth=2,i.stroke())}drawWallFace(e,t,n,i,r,a){const o=this.ctx,[l,c,h,u]=t;o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(u.x,u.y),o.closePath(),o.fillStyle=n,o.fill(),o.save(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.lineTo(h.x,h.y),o.lineTo(u.x,u.y),o.closePath(),o.clip();const d=this.blockH()*r;o.strokeStyle=i==="alley"?"rgba(20, 12, 8, 0.4)":"rgba(10, 8, 16, 0.4)",o.lineWidth=1;const f=Math.max(1,e.h);for(let x=1;x<=f;x++){const m=x*d;o.beginPath(),o.moveTo(l.x,l.y+m),o.lineTo(c.x,c.y+m),o.stroke()}const p=(l.x+c.x)/2;if(o.beginPath(),o.moveTo(p,(l.y+c.y)/2),o.lineTo(p,(h.y+u.y)/2),o.strokeStyle="rgba(0,0,0,0.18)",o.stroke(),e.h>=2&&Kn(a)>.45){const x=(l.x+c.x)*.5,m=(l.y+c.y)*.5+d*.55,g=Math.max(4,Math.abs(c.x-l.x)*.22),M=Math.max(5,d*.42);o.fillStyle=i==="alley"?"rgba(8, 8, 6, 0.7)":"rgba(6, 8, 14, 0.72)",o.fillRect(x-g,m-M/2,g*2,M),o.strokeStyle=i==="alley"?"rgba(255, 170, 80, 0.18)":"rgba(80, 160, 220, 0.2)",o.strokeRect(x-g,m-M/2,g*2,M)}if(e.h>=1&&Kn(a+3)>.62){const x=l.x*.7+c.x*.3;o.strokeStyle=i==="alley"?"rgba(90, 70, 50, 0.55)":"rgba(70, 90, 100, 0.5)",o.lineWidth=Math.max(1.4,1.8*r),o.beginPath(),o.moveTo(x,(l.y+c.y)/2),o.lineTo(x,(h.y+u.y)/2),o.stroke()}o.restore(),o.beginPath(),o.moveTo(l.x,l.y),o.lineTo(c.x,c.y),o.strokeStyle="rgba(0,0,0,0.35)",o.lineWidth=1,o.stroke()}drawTopSurface(e,t,n,i,r,a,o,l,c){const h=this.ctx;if(this.quadPath(n),h.fillStyle=l.top,h.fill(),h.save(),this.quadPath(n),h.clip(),e.terrain==="stairs"){h.strokeStyle="rgba(20, 16, 12, 0.45)",h.lineWidth=Math.max(1.2,1.5*c);for(let d=1;d<=4;d++){const f=d/5,p=xn(n[0],n[3],f),x=xn(n[1],n[2],f);h.beginPath(),h.moveTo(p.x,p.y),h.lineTo(x.x,x.y),h.stroke()}h.fillStyle="rgba(255, 230, 190, 0.07)",h.fillRect(i-a,r-o*.2,a*2,o*.5)}else if(t.theme==="roof"&&e.terrain==="roof"){h.strokeStyle=l.seam,h.lineWidth=1;for(let d=1;d<=4;d++){const f=d/5,p=xn(n[0],n[1],f),x=xn(n[3],n[2],f);h.beginPath(),h.moveTo(p.x,p.y),h.lineTo(x.x,x.y),h.stroke()}!e.prop&&!e.blocked&&Kn(e.x*9+e.y*17)<.2?(this.quadPath(this.insetQuad(n,.42)),h.fillStyle="rgba(20, 40, 70, 0.55)",h.fill(),h.strokeStyle="rgba(120, 200, 230, 0.45)",h.stroke()):!e.prop&&Kn(e.x*5+e.y*11)<.16&&(h.fillStyle="#3a3e48",h.beginPath(),h.ellipse(i+a*.12,r-o*.08,4.5*c,3.2*c,0,0,Math.PI*2),h.fill(),h.strokeStyle="#8a93a3",h.stroke())}else if(t.theme==="alley"&&e.terrain==="street"){Kn(e.x+e.y*8)>.55&&(h.fillStyle="rgba(70, 140, 180, 0.1)",h.beginPath(),h.ellipse(i-a*.1,r+o*.12,a*.32,o*.22,0,0,Math.PI*2),h.fill()),h.strokeStyle="rgba(0,0,0,0.28)",h.beginPath();const d=xn(n[0],n[2],.35+Kn(e.x*3)*.3);h.moveTo(i-a*.2,r),h.lineTo(d.x,d.y),h.stroke()}else if(t.theme==="roof"){this.kingsWharf.complete&&this.kingsWharf.naturalWidth>0&&(h.globalAlpha=.14,h.drawImage(this.kingsWharf,-this.w*.2,-this.h*.18,this.w*1.4,this.h*1.2),h.globalAlpha=1,h.fillStyle="rgba(88, 42, 26, 0.16)",h.fill()),h.strokeStyle="rgba(255, 192, 106, 0.22)",h.lineWidth=Math.max(1,c);const d=xn(n[0],n[2],.5),f=xn(n[1],n[3],.5);h.beginPath(),h.moveTo(d.x,d.y),h.lineTo(f.x,f.y),h.stroke(),!e.prop&&!e.blocked&&Kn(e.x*31+e.y*47)<.22&&(h.strokeStyle="rgba(245, 221, 166, 0.68)",h.lineWidth=Math.max(1,1.25*c),h.beginPath(),h.ellipse(i+a*.05,r+o*.04,a*.28,o*.28,0,0,Math.PI*2),h.stroke(),h.beginPath(),h.moveTo(i-a*.16,r+o*.04),h.lineTo(i+a*.22,r+o*.04),h.moveTo(i+a*.03,r-o*.18),h.lineTo(i+a*.03,r+o*.2),h.stroke())}else h.strokeStyle=l.seam,h.beginPath(),h.moveTo(xn(n[0],n[1],.5).x,xn(n[0],n[1],.5).y),h.lineTo(xn(n[3],n[2],.5).x,xn(n[3],n[2],.5).y),h.stroke();if(e.blocked){h.strokeStyle="rgba(0,0,0,0.28)",h.lineWidth=1;for(let d=-2;d<=2;d++)h.beginPath(),h.moveTo(i-a+d*6*c,r-o),h.lineTo(i+a+d*6*c,r+o),h.stroke()}h.fillStyle="rgba(255,255,255,0.055)";for(let d=0;d<5;d++){const f=Kn(e.x*19+e.y*23+d),p=Kn(e.x*29+e.y*31+d+4);h.fillRect(i-a+f*a*2,r-o+p*o*2,1.6*c,1.2*c)}h.restore(),this.quadPath(n),h.strokeStyle=l.rim,h.lineWidth=1.2,h.stroke();let u=0;for(let d=1;d<4;d++)n[d].y<n[u].y&&(u=d);h.beginPath(),h.moveTo(n[u].x,n[u].y),h.lineTo(n[(u+1)%4].x,n[(u+1)%4].y),h.strokeStyle="rgba(230, 248, 255, 0.38)",h.stroke(),h.beginPath(),h.moveTo(n[u].x,n[u].y),h.lineTo(n[(u+3)%4].x,n[(u+3)%4].y),h.strokeStyle="rgba(20, 20, 28, 0.4)",h.stroke()}drawRailings(e,t,n,i){if(e.h<1||e.terrain==="stairs")return;const r=this.ctx,a=[[0,-1],[1,0],[0,1],[-1,0]],o=(t.theme==="roof"?7.5:6.5)*i;r.strokeStyle=t.theme==="roof"?"rgba(170, 186, 210, 0.85)":"rgba(120, 96, 72, 0.8)",r.lineWidth=Math.max(1.15,1.35*i);for(let l=0;l<4;l++){const c=t.tile(e.x+a[l][0],e.y+a[l][1]);if((c?e.h-c.h:e.h+1)<1)continue;const u=n[l],d=n[(l+1)%4];r.beginPath(),r.moveTo(u.x,u.y),r.lineTo(u.x,u.y-o),r.lineTo(d.x,d.y-o),r.lineTo(d.x,d.y),r.stroke(),r.beginPath(),r.moveTo(u.x,u.y-o*.48),r.lineTo(d.x,d.y-o*.48),r.stroke()}}diamondPath(e,t,n,i){const r=this.ctx;r.beginPath(),r.moveTo(e,t-i),r.lineTo(e+n,t),r.lineTo(e,t+i),r.lineTo(e-n,t),r.closePath()}quadPath(e){const t=this.ctx;t.beginPath(),t.moveTo(e[0].x,e[0].y);for(let n=1;n<e.length;n++)t.lineTo(e[n].x,e[n].y);t.closePath()}insetQuad(e,t){let n=0,i=0;for(const r of e)n+=r.x,i+=r.y;return n/=e.length,i/=e.length,e.map(r=>({x:n+(r.x-n)*t,y:i+(r.y-i)*t}))}drawProp(e,t,n,i,r,a,o){const l=this.ctx;if(e.prop==="stall"){const c=15*o;l.beginPath(),l.moveTo(n-r*.55,i+a*.05),l.lineTo(n,i+a*.55),l.lineTo(n,i+a*.55+c),l.lineTo(n-r*.55,i+a*.05+c),l.closePath(),l.fillStyle="#3a141c",l.fill(),l.beginPath(),l.moveTo(n+r*.55,i+a*.05),l.lineTo(n,i+a*.55),l.lineTo(n,i+a*.55+c),l.lineTo(n+r*.55,i+a*.05+c),l.closePath(),l.fillStyle="#4a1d28",l.fill();const h=.75+Math.sin(this.time/180+e.x)*.2;this.diamondPath(n,i-4*o,r*.62,a*.62),l.fillStyle=`rgba(255, 61, 138, ${.72*h})`,l.fill(),l.fillStyle="#ffe08a",l.font=`bold ${Math.max(8,9*o)}px sans-serif`,l.textAlign="center",l.fillText(e.x<5?"FISH":"TEA",n,i-2*o)}else if(e.prop==="crate"){const c=13*o;l.beginPath(),l.moveTo(n-r*.48,i),l.lineTo(n,i+a*.48),l.lineTo(n,i+a*.48+c),l.lineTo(n-r*.48,i+c),l.closePath(),l.fillStyle="#5a3a22",l.fill(),l.beginPath(),l.moveTo(n+r*.48,i),l.lineTo(n,i+a*.48),l.lineTo(n,i+a*.48+c),l.lineTo(n+r*.48,i+c),l.closePath(),l.fillStyle="#6c4628",l.fill(),this.diamondPath(n,i-2*o,r*.48,a*.48),l.fillStyle="#8a5a32",l.fill(),l.strokeStyle="rgba(40, 22, 10, 0.55)",l.lineWidth=1;for(let h=-1;h<=1;h++)l.beginPath(),l.moveTo(n-r*.28,i+h*3*o),l.lineTo(n+r*.28,i+h*3*o),l.stroke();l.strokeStyle="rgba(180, 160, 120, 0.45)",l.strokeRect(n-5*o,i-3*o,10*o,4*o)}else if(e.prop==="ac"){const c=11*o;l.beginPath(),l.moveTo(n-r*.42,i),l.lineTo(n,i+a*.42),l.lineTo(n,i+a*.42+c),l.lineTo(n-r*.42,i+c),l.closePath(),l.fillStyle="#2e323c",l.fill(),l.beginPath(),l.moveTo(n+r*.42,i),l.lineTo(n,i+a*.42),l.lineTo(n,i+a*.42+c),l.lineTo(n+r*.42,i+c),l.closePath(),l.fillStyle="#3a3e48",l.fill(),this.diamondPath(n,i-2*o,r*.42,a*.42),l.fillStyle="#4a5060",l.fill();const h=this.time/140;l.strokeStyle="#8a93a3",l.lineWidth=1.2,l.beginPath(),l.arc(n,i-2*o,4.8*o,0,Math.PI*2),l.stroke(),l.beginPath(),l.moveTo(n+Math.cos(h)*4.2*o,i-2*o+Math.sin(h)*2.2*o),l.lineTo(n-Math.cos(h)*4.2*o,i-2*o-Math.sin(h)*2.2*o),l.stroke()}else if(e.prop==="lamp"){l.fillStyle="#2a2a32",l.fillRect(n-1.6*o,i-20*o,3.2*o,24*o);const c=t==="alley"?"rgba(255, 180, 80, 0.92)":"rgba(255, 210, 120, 0.9)";l.fillStyle=c,l.beginPath(),l.arc(n,i-22*o,4.4*o,0,Math.PI*2),l.fill(),l.fillStyle=t==="alley"?"rgba(255, 160, 70, 0.14)":"rgba(255, 200, 110, 0.12)",l.beginPath(),l.arc(n,i-4*o,17*o,0,Math.PI*2),l.fill()}}projectAt(e,t,n,i,r){return(a,o,l)=>{const c=ou(a,o,i),h=this.worldToScreen(e+c.x,t+c.y,n+l*To),u=ks(e+c.x,t+c.y,this.yaw,r.w,r.h);return{x:h.x,y:h.y,d:u.x+u.y-l}}}drawBoardObj(e,t){const n=this.ctx,i=t.tiles[e.y][e.x].h;this.worldToScreen(e.x,e.y,i);const r=this.cam.zoom,{cx:a,cy:o,hw:l,hh:c}=this.topMetrics(e.x,e.y,i);if(e.type==="barrel"){n.fillStyle="#7a2a22",n.beginPath(),n.ellipse(a,o+2*r,l*.38,c*.32,0,0,Math.PI*2),n.fill(),n.fillStyle="#c44a32",n.fillRect(a-7*r,o-16*r,14*r,18*r),n.fillStyle="#e8c45a",n.fillRect(a-7*r,o-8*r,14*r,2.2*r),n.fillStyle="#2a1010",n.beginPath(),n.ellipse(a,o-16*r,7*r,3.2*r,0,0,Math.PI*2),n.fill();const u=e.hp/Math.max(1,e.maxHp);n.fillStyle="#111018",n.fillRect(a-10*r,o-22*r,20*r,3*r),n.fillStyle="#ff4d6d",n.fillRect(a-10*r,o-22*r,20*r*u,3*r);return}if(e.type==="kit"){n.fillStyle="#f2f4f0",n.fillRect(a-8*r,o-8*r,16*r,12*r),n.fillStyle="#d04040",n.fillRect(a-2*r,o-6*r,4*r,8*r),n.fillRect(a-6*r,o-3*r,12*r,3*r),n.strokeStyle="#3a3a40",n.strokeRect(a-8*r,o-8*r,16*r,12*r);return}if(e.type==="switch"){n.fillStyle=e.used?"#3a5a48":"#3ef0d0",this.diamondPath(a,o,l*.35,c*.35),n.fill(),n.strokeStyle="#0a1816",n.stroke(),n.fillStyle=e.used?"#8aa":"#fff",n.font=`bold ${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(e.used?"開":"掣",a,o+3*r);return}if(e.type==="van"){n.fillStyle=e.used?"#3a4850":"#2a3540",n.fillRect(a-14*r,o-18*r,28*r,22*r),n.fillStyle="#1a2228",n.fillRect(a-10*r,o-14*r,12*r,8*r),n.fillStyle=e.used?"#7dffb3":"#ffc857",n.fillRect(a+4*r,o-6*r,8*r,10*r),n.fillStyle="#e8eef2",n.font=`${Math.max(8,9*r)}px sans-serif`,n.textAlign="center",n.fillText(e.used?"開":"門",a,o+16*r);return}const h=e.type==="pallet"?8*r:12*r;n.fillStyle=e.type==="pallet"?"#6a5030":"#8a5a32",n.beginPath(),n.moveTo(a-l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a-l*.46,o+h),n.closePath(),n.fill(),n.fillStyle=e.type==="pallet"?"#7a6038":"#a06a3c",n.beginPath(),n.moveTo(a+l*.46,o),n.lineTo(a,o+c*.46),n.lineTo(a,o+c*.46+h),n.lineTo(a+l*.46,o+h),n.closePath(),n.fill(),this.diamondPath(a,o-2*r,l*.46,c*.46),n.fillStyle=e.type==="pallet"?"#c4a060":"#c48448",n.fill(),n.strokeStyle="rgba(40,22,10,0.55)",n.stroke()}projectFor(e,t){const n=t.heightAt(e.x,e.y);return(i,r,a)=>{const o=ou(i,r,e.dir),l=this.worldToScreen(e.x+o.x,e.y+o.y,n+a*To),c=ks(e.x+o.x,e.y+o.y,this.yaw,t.w,t.h);return{x:l.x,y:l.y,d:c.x+c.y-a*To*.45}}}drawMapDoll(e,t,n,i,r,a,o=!0){const l=Ma(i)*(a?1.12:1),c=l*e.naturalWidth/e.naturalHeight,h=this.ctx;h.save(),h.translate(t-c/2,n-l),o&&r.x-r.y<0&&(h.translate(c,0),h.scale(-1,1)),h.drawImage(e,0,0,c,l),h.restore()}drawUnit(e,t,n){const i=this.ctx,r=t.heightAt(e.x,e.y),a=this.worldToScreen(e.x,e.y,r),o=this.cam.zoom,l=e.role==="elite",c=(l?1.12:1)*o,h=Au(e),u=nf(lr[e.dir].x,lr[e.dir].y,this.yaw),d=(u.x-u.y)*6*o*(e.lunge||0),f=(u.x+u.y)*3*o*(e.lunge||0),p=a.x+d,x=a.y+f+2*o,m=e.acted;i.save(),m&&(i.globalAlpha*=.45),i.fillStyle="rgba(0,0,0,0.4)",i.beginPath(),i.ellipse(p,x+1*o,11*c,4.8*c,0,0,Math.PI*2),i.fill(),i.strokeStyle=h,i.lineWidth=Math.max(2,2.2*o),i.beginPath(),i.ellipse(p,x+1*o,12.2*c,5.4*c,0,0,Math.PI*2),i.stroke(),i.strokeStyle="rgba(8,8,12,0.85)",i.lineWidth=1,i.stroke(),n.selected?.id===e.id&&(i.strokeStyle=h,i.lineWidth=2.2,this.diamondPath(a.x,a.y,16*c,8*c),i.stroke()),n.target?.id===e.id&&(i.strokeStyle="#ffe08a",i.lineWidth=2,this.diamondPath(a.x,a.y,18*c,9*c),i.stroke());const g=this.projectFor(e,t),M=(R,v,E)=>{const C=g(R,v,E);return{x:C.x+d,y:C.y+f,d:C.d}};if(e.archetype==="mara"){if(!GM(i,M,e,o)){const R=["front","ne","right","se","back","sw","left","nw"][e.dir],v=this.maraAngles[R],E=this.mapDolls.mara;v.complete&&v.naturalWidth>0&&v.naturalHeight>0?this.drawMapDoll(v,p,x,o,u,l,!1):E.complete&&E.naturalWidth>0&&E.naturalHeight>0?this.drawMapDoll(E,p,x,o,u,l,!1):Eo(i,M,e,this.time,o,this.yaw)}}else if(e.archetype==="dana"){const R=["front","ne","right","se","back","sw","left","nw"][e.dir],v=this.danaAngles[R],E=this.mapDolls.dana;v.complete&&v.naturalWidth>0&&v.naturalHeight>0?this.drawMapDoll(v,p,x,o,u,l,!1):E.complete&&E.naturalWidth>0&&E.naturalHeight>0?this.drawMapDoll(E,p,x,o,u,l,!1):Eo(i,M,e,this.time,o,this.yaw)}else{const R=e.archetype==="priya"?this.mapDolls.priya:null;R&&R.complete&&R.naturalWidth>0&&R.naturalHeight>0?this.drawMapDoll(R,p,x,o,u,l):Eo(i,M,e,this.time,o,this.yaw)}this.drawFacingWedge(e,t,p,x,o);const b=Ma(o)*(l?1.12:1),y=22*c,A=Math.max(0,e.hp/e.maxHp),T=x-b-4*c;if(i.fillStyle="#111018",i.fillRect(p-y/2,T,y,3.5*c),i.fillStyle=h,i.fillRect(p-y/2,T,y*A,3.5*c),i.fillStyle="#e8eef2",i.font=`${Math.max(9,10*o)}px sans-serif`,i.textAlign="center",i.fillText(e.name.split(" ")[0],p,x+16*o),i.restore(),m){const R=p+14*c,v=x-b+10*c,E=7.2*c;i.fillStyle="rgba(8, 8, 14, 0.88)",i.beginPath(),i.arc(R,v,E,0,Math.PI*2),i.fill(),i.strokeStyle="rgba(220, 224, 232, 0.92)",i.lineWidth=Math.max(1,1.15*o),i.stroke(),i.fillStyle="#e8eef2",i.font=`bold ${Math.max(9,11*o)}px sans-serif`,i.textAlign="center",i.textBaseline="middle",i.fillText("E",R,v+.4*c),i.textBaseline="alphabetic"}}drawFacingWedge(e,t,n,i,r){const a=this.ctx,o=t.heightAt(e.x,e.y),l=this.projectAt(e.x,e.y,o,e.dir,t),c=[l(0,.11,.03),l(-.035,.04,.03),l(.035,.04,.03)],h=[l(-.04,.035,.018),l(.04,.035,.018),l(.05,-.045,.018),l(0,-.015,.018),l(-.05,-.045,.018)];a.beginPath(),a.moveTo(h[0].x,h[0].y);for(let u=1;u<h.length;u++)a.lineTo(h[u].x,h[u].y);a.closePath(),a.lineJoin="round",a.strokeStyle="rgba(6,8,14,0.95)",a.lineWidth=Math.max(1.6,1.8*r),a.stroke(),a.fillStyle="#5a88c8",a.fill(),a.beginPath(),a.moveTo(c[0].x,c[0].y),a.lineTo(c[1].x,c[1].y),a.lineTo(c[2].x,c[2].y),a.closePath(),a.strokeStyle="rgba(6,8,14,0.95)",a.stroke(),a.fillStyle="#ff9a3c",a.fill()}drawVignette(){const e=this.ctx,t=e.createRadialGradient(this.w/2,this.h/2,this.h*.2,this.w/2,this.h/2,this.h*.78);t.addColorStop(0,"rgba(0,0,0,0)"),t.addColorStop(1,"rgba(0,0,0,0.45)"),e.fillStyle=t,e.fillRect(0,0,this.w,this.h)}drawFloats(e,t){const n=this.ctx,i=performance.now();for(const r of e){const a=(i-r.born)/r.life;if(a>1)continue;const o=t.heightAt(Math.round(r.x),Math.round(r.y)),l=this.worldToScreen(r.x,r.y,o);n.globalAlpha=1-a,n.font=`bold ${18*this.cam.zoom}px sans-serif`,n.textAlign="center",n.lineWidth=3,n.strokeStyle="#050508",n.fillStyle=r.color;const c=l.y-36*this.cam.zoom-a*28;n.strokeText(r.text,l.x,c),n.fillText(r.text,l.x,c),n.globalAlpha=1}}}const Od=3,kd="yejie-v1";function vu(){return{slots:[null,null,null],autosave:null}}function Ii(){try{const s=localStorage.getItem(kd);if(!s)return vu();const e=JSON.parse(s),t=[null,null,null];for(let i=0;i<Od;i++){const r=Array.isArray(e.slots)?e.slots[i]:null;t[i]=r&&r.v===1?r:null}const n=e.autosave&&e.autosave.v===1?e.autosave:null;return{slots:t,autosave:n}}catch{return vu()}}function yu(s){localStorage.setItem(kd,JSON.stringify(s))}function $M(s){const e=[];s.autosave&&e.push(s.autosave);for(const t of s.slots)t&&e.push(t);return e}function Mu(s){const e=$M(s);return e.length?e.reduce((t,n)=>t.savedAt>=n.savedAt?t:n):null}function JM(s){try{return new Date(s).toLocaleString("zh-Hant-TW",{month:"numeric",day:"numeric",hour:"2-digit",minute:"2-digit"})}catch{return""}}const Su="0.6.16",ZM="20260915";function xe(s){const e=document.getElementById(s);if(!e)throw new Error(s);return e}const QM={Mara:"./sprites/vn-mara.png",Dana:"./sprites/vn-dana.png",Priya:"./sprites/vn-priya.png"},bu=250,Co=520,Po=460,jM={striker:"突擊",controller:"控制",support:"支援",grunt:"現場",elite:"主管",civilian:"文官",delinquent:"街頭",magician:"術者",wolverine:"爪獸",boxer:"拳手",gunner:"槍手",worker:"工人"},Io={street:"街道",stairs:"樓梯",roof:"屋頂"},eS={stall:"攤位",ac:"冷氣",lamp:"路燈",crate:"貨箱"},Tu={friendly:"友方",hostile:"敵對",neutral:"中立"};class tS{constructor(e){K(this,"map");K(this,"units",[]);K(this,"phase","title");K(this,"turn",1);K(this,"selected",null);K(this,"origin",null);K(this,"originDir",0);K(this,"field",null);K(this,"moveTiles",new Set);K(this,"actionTiles",new Set);K(this,"skillTiles",new Set);K(this,"areaTiles",new Set);K(this,"areaKind",null);K(this,"forecast",null);K(this,"inspect",null);K(this,"floats",[]);K(this,"busy",!1);K(this,"log","");K(this,"missionIndex",0);K(this,"loseKind","wipe");K(this,"intel","M");K(this,"power","M");K(this,"inventory",an(Qi));K(this,"missionStartInventory",an(Qi));K(this,"pendingItem",null);K(this,"m1DropGiven",!1);K(this,"modalKind","off");K(this,"paused",!1);K(this,"pauseOpen",!1);K(this,"vnOpen",!1);K(this,"vnDone",null);K(this,"m1IntroPlayed",!1);K(this,"m1MidBeatPlayed",!1);K(this,"renderer");K(this,"input");K(this,"hudTurn",xe("hud-turn"));K(this,"hudPhase",xe("hud-phase"));K(this,"hudSub",xe("hud-sub"));K(this,"chip",xe("unit-chip"));K(this,"chipMark",xe("chip-mark"));K(this,"chipName",xe("chip-name"));K(this,"chipMeta",xe("chip-meta"));K(this,"chipExtra",xe("chip-extra"));K(this,"chipHp",xe("chip-hp"));K(this,"chipHpFill",xe("chip-hp-fill"));K(this,"forecastEl",xe("forecast"));K(this,"logEl",xe("log"));K(this,"title",xe("title"));K(this,"briefing",xe("briefing"));K(this,"result",xe("result"));K(this,"resultKicker",xe("result-kicker"));K(this,"resultTitle",xe("result-title"));K(this,"resultBody",xe("result-body"));K(this,"modal",xe("modal"));K(this,"modalKicker",xe("modal-kicker"));K(this,"modalTitle",xe("modal-title"));K(this,"modalBody",xe("modal-body"));K(this,"confirmEl",xe("confirm"));K(this,"confirmText",xe("confirm-text"));K(this,"btnCancel",xe("btn-cancel"));K(this,"btnWait",xe("btn-wait"));K(this,"btnSkill",xe("btn-skill"));K(this,"btnConfirm",xe("btn-confirm"));K(this,"btnEnd",xe("btn-end"));K(this,"btnNext",xe("btn-next"));K(this,"btnRotate",xe("btn-rotate"));K(this,"btnPause",xe("btn-pause"));K(this,"btnBag",xe("btn-bag"));K(this,"btnContinue",xe("btn-continue"));K(this,"btnMute",xe("btn-mute"));K(this,"btnPauseNext",xe("btn-pause-next"));K(this,"pauseEl",xe("pause"));K(this,"vn",xe("vn"));K(this,"vnBust",xe("vn-bust"));K(this,"vnBox",xe("vn-box"));K(this,"vnName",xe("vn-name"));K(this,"vnText",xe("vn-text"));K(this,"titleBuild",xe("title-build"));K(this,"camHint",xe("cam-hint"));K(this,"yawSlider",xe("yaw-slider"));K(this,"pitchSlider",xe("pitch-slider"));K(this,"pendingSlot",null);K(this,"pendingQuit",!1);K(this,"pendingJump",null);this.renderer=new YM(e),$y(),this.input=new xf(e,this.renderer),this.input.onTap=t=>this.onTap(t),this.map=new Oa(this.mission.map),this.resetBattle(),this.phase="title",this.briefing.hidden=!0,this.title.hidden=!1,window.addEventListener("resize",()=>this.renderer.resize()),xe("btn-start").addEventListener("click",()=>this.begin()),xe("btn-restart").addEventListener("click",()=>this.restart()),this.btnNext.addEventListener("click",()=>this.nextMission()),this.btnCancel.addEventListener("click",()=>this.cancel()),this.btnWait.addEventListener("click",()=>void this.wait()),this.btnSkill.addEventListener("click",()=>this.armSkill()),this.btnConfirm.addEventListener("click",()=>void this.confirm()),this.btnEnd.addEventListener("click",()=>void this.endTurn()),this.btnRotate.addEventListener("click",()=>this.rotateMap()),this.btnPause.addEventListener("click",()=>this.openPause()),this.btnBag.addEventListener("click",()=>this.openBagFromHud()),xe("btn-new").addEventListener("click",()=>this.newGame()),this.btnContinue.addEventListener("click",()=>this.continueGame()),xe("btn-load").addEventListener("click",()=>this.openSaves("load")),xe("btn-bag-title").addEventListener("click",()=>this.openBag()),xe("btn-refresh").addEventListener("click",()=>void this.refreshApp()),xe("btn-brief-title").addEventListener("click",()=>this.goTitle()),xe("btn-result-title").addEventListener("click",()=>this.goTitle()),xe("btn-resume").addEventListener("click",()=>this.closePause()),xe("btn-pause-save").addEventListener("click",()=>this.openSaves("save")),xe("btn-pause-load").addEventListener("click",()=>this.openSaves("load")),this.btnMute.addEventListener("click",()=>this.toggleMute()),this.btnPauseNext.addEventListener("click",()=>this.requestNextMission()),this.vn.addEventListener("click",()=>this.advanceVn()),this.vn.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.advanceVn())}),document.querySelectorAll("[data-test-mission]").forEach(t=>{t.addEventListener("click",()=>this.jumpToMission(Number(t.dataset.testMission)))}),xe("btn-quit-title").addEventListener("click",()=>this.quitToTitle()),xe("modal-close").addEventListener("click",()=>this.closeModal()),xe("confirm-yes").addEventListener("click",()=>this.confirmYes()),xe("confirm-no").addEventListener("click",()=>this.confirmNo()),this.bindSeg("seg-intel",t=>{this.intel=t}),this.bindSeg("seg-power",t=>{this.power=t}),this.yawSlider.addEventListener("input",()=>{this.renderer.yaw=Number(this.yawSlider.value)/100}),this.pitchSlider.addEventListener("input",()=>{this.renderer.setPitch(Number(this.pitchSlider.value))}),this.modalBody.addEventListener("click",t=>this.onModalClick(t)),this.titleBuild.textContent=`版本 ${Su}　${ZM}`,this.syncMuteBtn(),it.setBgm("title"),this.refreshContinue()}get mission(){return Ji[this.missionIndex]??Ji[0]}async waitMs(e){const t=performance.now()+e;for(;performance.now()<t;){for(;this.paused;)await Rc(40);const n=t-performance.now();if(n<=0)break;await Rc(Math.min(40,n))}}start(){const e=/(?:^|[?&])shot(?:=|$|&)/.test(location.search)||location.hash.includes("shot"),t=()=>{this.floats=this.floats.filter(i=>performance.now()-i.born<i.life),this.renderer.draw(this.map,this.units,{move:this.phase==="select"?this.moveTiles:new Set,area:this.overlayArea(),hot:this.overlayHot(),areaKind:this.overlayKind(),selected:this.selected,target:this.forecast?.target??null,inspect:this.inspectPos(),phase:this.phase},this.floats)};this.syncUi(),(()=>{if(e){this.renderer.forceSize(390,640),this.renderer.centerOn(this.units,this.map);for(let a=0;a<8;a++)t();const r=document.createElement("img");r.alt="board",r.src=this.renderer.canvas.toDataURL("image/png"),r.style.cssText="position:absolute;left:0;right:0;top:48px;width:100%;height:auto;z-index:1;pointer-events:none",this.renderer.canvas.insertAdjacentElement("afterend",r);return}const i=()=>{t(),requestAnimationFrame(i)};requestAnimationFrame(i)})()}applyHash(){const e=location.hash.replace("#","");if(e==="inv"){this.openBag();return}if(e==="save"){this.openSaves("load");return}if(e==="m3"||e==="play3"){if(this.missionIndex=2,this.resetBattle(),this.title.hidden=!0,e==="m3"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m4"||e==="play4"){if(this.missionIndex=3,this.resetBattle(),this.title.hidden=!0,e==="m4"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m5"||e==="play5"){if(this.missionIndex=4,this.resetBattle(),this.title.hidden=!0,e==="m5"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();return}if(e==="m2"||e==="play2"||e==="inspect"||e==="play2rot"){if(this.missionIndex=1,this.resetBattle(),this.title.hidden=!0,e==="m2"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin(),e==="play2rot"&&(this.renderer.yaw=Math.PI/2,this.renderer.centerOn(this.units,this.map));const t=this.units.find(n=>n.id==="dana");if(t&&e!=="inspect"&&(t.acted=!0),e==="inspect"){const n=this.units.find(i=>i.id==="beckett")??this.units.find(i=>i.team==="enemy");n&&(this.inspect={kind:"unit",unit:n},this.syncUi())}else{const n=this.units.find(i=>i.id==="mara");n&&this.selectUnit(n)}return}if(e==="play"||e==="brief"){if(this.title.hidden=!0,this.resetBattle(),e==="brief"){this.phase="briefing",this.briefing.hidden=!1,this.syncUi();return}this.begin();const t=this.units.find(i=>i.id==="mara");t&&this.selectUnit(t);const n=this.units.find(i=>i.id==="dana");n&&(n.acted=!0)}}bindSeg(e,t){const n=xe(e);n.addEventListener("click",i=>{const r=i.target.closest("button");if(!r)return;const a=r.getAttribute("data-v");if(!(a!=="L"&&a!=="M"&&a!=="H")){for(const o of n.querySelectorAll("button"))o.classList.toggle("on",o===r);t(a)}})}inspectPos(){const e=this.inspect;if(!e)return null;if(e.kind==="unit")return{x:e.unit.x,y:e.unit.y};if(e.kind==="object"){const t=this.map.objects.find(n=>n.id===e.id);return t?{x:t.x,y:t.y}:null}return{x:e.tile.x,y:e.tile.y}}fillBriefing(){const e=this.mission;xe("brief-num").textContent=e.number,xe("brief-loc").textContent=e.loc;const t=xe("brief-body");t.innerHTML="";for(const o of e.paragraphs){const l=document.createElement("p");l.textContent=o,t.appendChild(l)}const n=xe("brief-conds");n.innerHTML="";const i=document.createElement("li");i.innerHTML="<span>勝利</span>",i.append(e.winCond);const r=document.createElement("li");r.innerHTML="<span>失敗</span>",r.append(e.loseCond),n.append(i,r);const a=xe("brief-voices");a.innerHTML="";for(const o of e.voices){const l=document.createElement("p"),c=document.createElement("b");c.textContent=o.name,l.append(c,`「${o.line}」`),a.appendChild(l)}this.hudSub.textContent=e.hudSub}showVn({speaker:e,side:t,text:n}){return this.vnOpen=!0,this.vn.classList.toggle("right",t==="right"),this.vn.classList.toggle("left",t!=="right"),this.vnBust.src=QM[e],this.vnBust.alt=e,this.vnName.textContent=e,this.vnText.textContent=n,this.vn.hidden=!1,this.syncUi(),new Promise(i=>{this.vnDone=i,this.vnBox.focus({preventScroll:!0})})}advanceVn(){const e=this.vnDone;e&&(this.vnDone=null,this.vnOpen=!1,this.vn.hidden=!0,this.vnBust.removeAttribute("src"),e(),this.syncUi())}async playMissionIntro(){if(this.missionIndex!==0||this.m1IntroPlayed)return;this.m1IntroPlayed=!0;const e=["left","right","left"],t=this.mission.voices.slice(0,3).map((n,i)=>({speaker:n.name,side:e[i]??"left",text:n.line}));for(const n of t)await this.showVn(n)}resetBattle(){const e=this.mission;this.map=new Oa(e.map),this.units=[...Ec(e.starts),...e.makeOthers()];for(const t of this.units)rf(t,this.power);this.phase="briefing",this.turn=1,this.clearSel(),this.inspect=null,this.busy=!1,this.loseKind="wipe",this.pendingItem=null,this.m1IntroPlayed=!1,this.m1MidBeatPlayed=!1,this.vnOpen=!1,this.vnDone=null,this.vn.hidden=!0,this.log="點選單位開始行動。可先攻擊或待機，不必先移動。拖曳平移，雙指縮放並旋轉，上下俯仰。",this.renderer.yaw=0,this.renderer.setPitch(or),this.renderer.centerOn(this.units,this.map),this.fillBriefing()}newGame(){this.missionIndex=0,this.inventory=an(Qi),this.missionStartInventory=an(Qi),this.m1DropGiven=!1,this.resetBattle(),this.title.hidden=!0,this.briefing.hidden=!1,this.phase="briefing",it.setBgm("title"),this.syncUi(),this.autosave()}continueGame(){const e=Mu(Ii());e&&this.applySave(e)}async begin(){this.missionStartInventory=an(this.inventory),this.briefing.hidden=!0,this.title.hidden=!0,this.phase="select",it.setBgm("battle"),this.renderer.centerOn(this.units,this.map),this.busy=this.missionIndex===0&&!this.m1IntroPlayed,this.syncUi(),this.autosave(),this.busy&&await this.playMissionIntro(),this.busy=!1,this.syncUi(),this.autosave()}restart(){this.inventory=an(this.missionStartInventory),this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi()}nextMission(){this.missionIndex>=Ji.length-1||(this.missionIndex+=1,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!1,this.title.hidden=!0,this.resetBattle(),this.syncUi(),this.autosave())}rotateMap(){this.phase==="briefing"||this.phase==="title"||(this.renderer.rotate(this.map),this.yawSlider.value=String(Math.round((this.renderer.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*100)))}clearSel(){this.selected=null,this.origin=null,this.field=null,this.moveTiles.clear(),this.actionTiles.clear(),this.skillTiles.clear(),this.areaTiles.clear(),this.areaKind=null,this.forecast=null,this.pendingItem=null}locked(){const e=this.selected;return!!e&&e.movedThisTurn}selectUnit(e){e.team!=="player"||e.acted||e.dead||e.npc||(this.selected=e,e.movedThisTurn||(this.origin=null),this.forecast=null,this.inspect=null,this.pendingItem=null,this.showCommand(e))}refreshRanges(e){if(this.skillTiles.clear(),e.movedThisTurn?(this.field=null,this.moveTiles.clear()):(this.field=Mr(e,this.map,this.units),this.moveTiles=new Set([...this.field.cost.keys()].filter(t=>t!==Ze(e.x,e.y)))),e.actedThisTurn)this.actionTiles=new Set,this.areaTiles=new Set,this.areaKind=null;else{this.actionTiles=cf(e,this.map,this.units);for(const t of this.map.objects)t.gone||t.kind!=="destructible"||Ss(e,e.x,e.y,t.x,t.y,this.map)&&this.actionTiles.add(Ze(t.x,t.y));this.areaTiles=ta(e,this.map),this.areaKind="attack"}}overlayArea(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"?this.areaTiles:new Set}overlayHot(){return this.phase==="itemAim"?this.skillTiles:this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?this.skillTiles:this.phase==="select"||this.phase==="forecast"?this.actionTiles:new Set}overlayKind(){return this.phase==="itemAim"?"item":this.phase==="skillAim"||this.phase==="forecast"&&this.forecast?.kind==="skill"?"skill":this.phase==="select"||this.phase==="forecast"?this.areaKind:null}showCommand(e){this.refreshRanges(e),this.phase="select";const t=[];e.movedThisTurn||t.push("可移動"),e.actedThisTurn||t.push("可攻擊／技能／道具"),this.log=t.length?t.join("　"):"結束或待機",this.syncUi()}async commitMove(e){const t=this.selected;if(!t||!this.field||this.busy||t.movedThisTurn)return;const n=Ze(e.x,e.y);if(!this.field.cost.has(n)||e.x===t.x&&e.y===t.y)return;this.busy=!0,it.play("move"),this.origin={x:t.x,y:t.y},this.originDir=t.dir;const i=Si(this.field,e);t.anim="walk",t.animStart=performance.now();for(let r=1;r<i.length;r++)t.x=i[r].x,t.y=i[r].y,await this.waitMs(bu);if(t.dir=Os(i[i.length-2],i[i.length-1]),t.anim="idle",t.movedThisTurn=!0,this.tryPickup(t),this.busy=!1,t.actedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}onTap(e){if(this.busy||this.pauseOpen||this.phase==="title"||this.phase==="briefing"||this.phase==="enemy"||this.phase==="victory"||this.phase==="defeat")return;const t=this.renderer.hitTile(e.x,e.y,this.map);if(this.phase==="forecast"){(!t||this.forecast&&(t.x!==this.forecast.target.x||t.y!==this.forecast.target.y))&&this.backFromForecast();return}if(this.phase==="skillAim"){t?this.trySkillTarget(t):this.backFromSkill();return}if(this.phase==="itemAim"){t?this.tryItemTarget(t):this.backFromItem();return}if(this.phase!=="select")return;if(!t){if(this.inspect){this.inspect=null,this.syncUi();return}this.selected&&!this.locked()&&(this.clearSel(),this.syncUi());return}const n=this.unitAt(t.x,t.y),i=this.selected,r=this.map.objAt(t.x,t.y);if(i&&!i.actedThisTurn&&n&&this.actionTiles.has(Ze(n.x,n.y))){this.forecast=Do(i,n,this.map),this.phase="forecast",this.log=this.forecast.detail,this.inspect=null,this.syncUi();return}if(i&&!i.actedThisTurn&&r&&!r.gone&&r.kind==="destructible"&&this.actionTiles.has(Ze(r.x,r.y))){this.forecast={kind:"object",actor:i,target:i,label:`${i.name} → ${r.label}`,detail:r.type==="barrel"?`破壞油桶　鄰格受到 ${Fa} 傷害`:"破壞此物",dmg:Math.max(1,i.atk+(i.atkBuff||0)),heal:0,skip:!1,face:"front",objectId:r.id},this.phase="forecast",this.log=this.forecast.detail,this.inspect=null,this.syncUi();return}if(i&&r&&!r.gone&&Math.abs(i.x-r.x)+Math.abs(i.y-r.y)<=1){if(r.kind==="pickup"){this.tryPickupAt(i,r);return}if(r.kind==="trigger"&&!r.used&&!i.actedThisTurn){this.useTrigger(i,r);return}}if(i&&!i.movedThisTurn&&this.moveTiles.has(Ze(t.x,t.y))&&(!n||n.id===i.id)){if(n&&n.id===i.id){this.inspectUnit(n);return}this.inspect=null,this.commitMove(t);return}if(n&&n.team==="player"&&!n.acted&&!n.npc&&(!i||!this.locked())){this.selectUnit(n);return}n?this.inspectUnit(n):r&&!r.gone?this.inspectObject(r.id):this.inspectTile(this.map.tile(t.x,t.y))}inspectUnit(e){this.inspect={kind:"unit",unit:e},this.log=`${e.name}　${Tu[Mi(e)]}`,this.syncUi()}inspectTile(e){this.inspect={kind:"tile",tile:e},this.log=Io[e.terrain],this.syncUi()}inspectObject(e){this.inspect={kind:"object",id:e};const t=this.map.objects.find(n=>n.id===e);this.log=t?t.label:"",this.syncUi()}trySkillTarget(e){const t=this.selected;if(!t)return;const i=No(t,this.map,this.units).find(r=>r.x===e.x&&r.y===e.y);if(!i){it.play("miss"),this.backFromSkill();return}this.forecast=Pc(t,i,this.map),this.phase="forecast",this.log=this.forecast.detail,this.syncUi()}tryItemTarget(e){const t=Ua(this.units).find(n=>n.x===e.x&&n.y===e.y);if(!t){it.play("miss"),this.backFromItem();return}this.applyItem(t)}backFromForecast(){if(this.selected){if(this.skillTiles.size&&this.forecast?.kind==="skill"){this.forecast=null,this.phase="skillAim",this.syncUi();return}this.forecast=null,this.showCommand(this.selected)}}backFromSkill(){this.skillTiles.clear(),this.forecast=null,this.selected&&this.showCommand(this.selected)}backFromItem(){this.pendingItem=null,this.skillTiles.clear(),this.selected?this.showCommand(this.selected):(this.phase="select",this.syncUi())}cancel(){if(!this.busy){if(this.phase==="forecast"){this.backFromForecast();return}if(this.phase==="skillAim"){this.backFromSkill();return}if(this.phase==="itemAim"){this.backFromItem();return}if(this.inspect){this.inspect=null,this.syncUi();return}if(this.selected&&this.origin&&this.selected.movedThisTurn){this.selected.x=this.origin.x,this.selected.y=this.origin.y,this.selected.dir=this.originDir,this.selected.movedThisTurn=!1,this.origin=null,this.showCommand(this.selected);return}this.selected&&!this.locked()&&(this.clearSel(),this.phase="select",this.syncUi())}}armSkill(){const e=this.selected;if(!e||this.busy||e.skillUsed||!e.skillName||e.actedThisTurn||this.phase!=="select"&&this.phase!=="skillAim")return;const t=No(e,this.map,this.units);this.skillTiles=new Set(t.map(n=>Ze(n.x,n.y))),this.areaTiles=hf(e,this.map),this.areaKind="skill",this.actionTiles.clear(),this.moveTiles.clear(),this.forecast=null,this.inspect=null,this.phase="skillAim",this.log=e.skillHint,this.syncUi()}async wait(){!this.selected||this.busy||this.phase==="select"&&await this.finishUnit()}async confirm(){if(this.phase!=="forecast"||!this.forecast||this.busy)return;const e=this.forecast;this.busy=!0;const t=e.actor;if(e.kind==="object"&&e.objectId){const r=this.map.objects.find(a=>a.id===e.objectId);if(!r||r.gone){this.busy=!1,this.showCommand(t);return}if(t.dir=Os(t,r),t.anim="attack",t.animStart=performance.now(),t.lunge=1,it.play("attack"),await this.waitMs(ca),r.hp=Math.max(0,r.hp-e.dmg),it.play("hit"),this.spawnFloat(t,`${e.dmg}`,"#ffd0d8"),this.log=`${t.name} 攻擊 ${r.label}`,t.atkBuff&&(t.atkBuff=0),r.hp<=0&&(r.gone=!0,this.log=`${r.label} 被破壞。`,r.type==="barrel"&&this.blastBarrel(r.x,r.y)),t.actedThisTurn=!0,t.lunge=0,t.anim="idle",await this.waitMs(Co),this.busy=!1,this.checkEnd())return;if(t.movedThisTurn){await this.finishUnit();return}this.forecast=null,this.showCommand(t),this.autosave();return}const n=e.target;n.stance==="neutral"&&!e.heal&&Cc(n),t.dir=Os(t,n);const i=e.kind==="skill"&&(t.skillKind==="spark"||t.skillKind==="heal"||t.skillKind==="halt");if(t.anim=i?"cast":"attack",t.animStart=performance.now(),t.lunge=1,e.heal?it.play("heal"):it.play(e.kind==="skill"?"skill":"attack"),await this.waitMs(i?ha:ca),e.heal?(n.hp=Math.min(n.maxHp,n.hp+e.heal),this.spawnFloat(n,`+${e.heal}`,"#7dffb3"),this.log=`${t.name} 為 ${n.name} 回復 ${e.heal}`):(n.hp=Math.max(0,n.hp-e.dmg),it.play("hit"),this.spawnFloat(n,`${e.dmg}`,"#ffd0d8"),this.log=`${t.name} 對 ${n.name} 造成 ${e.dmg} 傷害`,t.atkBuff&&(t.atkBuff=0),e.skip&&(n.skipNext=!0,this.log+="　攔住生效"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 倒下。`,this.tryEnemyDrop(n))),e.kind==="skill"&&(t.skillUsed=!0),t.actedThisTurn=!0,t.lunge=0,t.anim="idle",await this.waitMs(Co),this.busy=!1,!this.checkEnd()){if(t.movedThisTurn){await this.finishUnit();return}this.forecast=null,this.skillTiles.clear(),this.showCommand(t),this.autosave()}}async finishUnit(){if(this.busy=!0,this.selected&&(this.selected.acted=!0,this.selected.lunge=0),this.clearSel(),this.inspect=null,this.phase="select",this.syncUi(),await this.waitMs(Co),this.missionIndex===0&&!this.m1MidBeatPlayed&&this.mission.midBeats?.length){this.m1MidBeatPlayed=!0;for(const e of this.mission.midBeats)await this.showVn(e)}this.busy=!1,this.syncUi(),this.autosave(),this.units.filter(e=>e.team==="player"&&!e.dead&&!e.acted&&!e.npc).length===0&&await this.endTurn()}async endTurn(){if(!this.busy){for(const e of this.units)e.team==="player"&&!e.dead&&!e.npc&&(e.acted=!0);this.clearSel(),this.inspect=null,this.phase="enemy",this.log="敵軍行動中",this.syncUi(),await this.waitMs(Po),await this.runEnemy()}}async runEnemy(){this.busy=!0;const e=this.units.filter(n=>!n.dead&&!af(n)),t=this.mission.protectId;for(let n=0;n<e.length;n++){const i=e[n];if(this.phase==="victory"||this.phase==="defeat")break;if(i.skipNext){i.skipNext=!1,i.acted=!0,this.log=`${i.name} 被攔住，無法行動。`,this.syncUi(),await this.waitMs(420),n<e.length-1&&await this.waitMs(Po);continue}const r=df(i,this.map,this.units,t,this.intel);r.path.length>1&&(i.anim="walk",i.animStart=performance.now());for(let a=1;a<r.path.length;a++)i.x=r.path[a].x,i.y=r.path[a].y,await this.waitMs(bu);if(r.path.length>1&&(i.dir=Os(r.path[r.path.length-2],r.path[r.path.length-1])),i.anim="idle",this.tryPickup(i),r.target&&!r.target.dead){i.dir=Os(i,r.target);const a=r.useSkill&&!i.skillUsed?Pc(i,r.target,this.map):Do(i,r.target,this.map),o=a.kind==="skill"&&(i.skillKind==="spark"||i.skillKind==="heal"||i.skillKind==="halt");if(i.anim=o?"cast":"attack",i.animStart=performance.now(),i.lunge=1,it.play(a.kind==="skill"?"skill":"attack"),await this.waitMs(o?ha:ca),a.heal?(r.target.hp=Math.min(r.target.maxHp,r.target.hp+a.heal),this.spawnFloat(r.target,`+${a.heal}`,"#7dffb3"),this.log=`${i.name} 為 ${r.target.name} 回復 ${a.heal}`):(r.target.stance==="neutral"&&Cc(r.target),r.target.hp=Math.max(0,r.target.hp-a.dmg),it.play("hit"),this.spawnFloat(r.target,`${a.dmg}`,"#ff4d6d"),this.log=`${i.name} 對 ${r.target.name} 造成 ${a.dmg} 傷害`,a.skip&&(r.target.skipNext=!0),r.target.hp<=0&&(r.target.dead=!0,this.log=`${r.target.name} 倒下。`,this.tryEnemyDrop(r.target))),a.kind==="skill"&&(i.skillUsed=!0),await this.waitMs(120),i.lunge=0,i.anim="idle",this.checkEnd()){this.busy=!1;return}}else await this.waitMs(80);i.acted=!0,n<e.length-1&&await this.waitMs(Po)}for(const n of this.units)n.acted=!1,n.skillUsed=!1,n.movedThisTurn=!1,n.actedThisTurn=!1,n.anim="idle";this.turn+=1,this.phase="select",this.busy=!1,this.log="我軍階段",this.syncUi(),this.autosave()}checkEnd(){const e=this.mission.protectId;return e&&this.units.find(i=>i.id===e)?.dead?(this.loseKind="protect",this.lose(),!0):this.units.find(n=>n.id===this.mission.eliteId)?.dead?(this.win(),!0):this.units.every(n=>n.team!=="player"||n.dead||n.npc)?(this.loseKind="wipe",this.lose(),!0):!1}win(){const e=this.mission;this.phase="victory",this.busy=!1,this.closePause(),it.setBgm(null),it.play("victory"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.remove("lose"),this.resultKicker.textContent="勝利",this.resultTitle.textContent=e.winTitle;let t=e.winBody;this.missionIndex===0&&!this.m1DropGiven&&(Da(this.inventory,"bandage",1),this.m1DropGiven=!0,t=`${e.winBody}　又找到一盒繃帶。`),this.resultBody.textContent=t,this.btnNext.hidden=this.missionIndex>=Ji.length-1,this.syncUi(),this.autosave()}lose(){const e=this.mission;this.phase="defeat",this.busy=!1,this.closePause(),it.setBgm(null),it.play("defeat"),this.clearSel(),this.inspect=null,this.result.hidden=!1,this.result.classList.add("lose"),this.resultKicker.textContent="失敗",this.loseKind==="protect"?(this.resultTitle.textContent=e.protectLoseTitle,this.resultBody.textContent=e.protectLoseBody):(this.resultTitle.textContent=e.loseTitle,this.resultBody.textContent=e.loseBody),this.btnNext.hidden=!0,this.syncUi(),this.autosave()}unitAt(e,t){return this.units.find(n=>!n.dead&&n.x===e&&n.y===t)}tryPickup(e){const t=this.map.objAt(e.x,e.y);!t||t.gone||t.kind!=="pickup"||this.collectPickup(e,t)}tryPickupAt(e,t){const n=this.map.objects.find(i=>i.id===t.id);!n||n.gone||n.kind!=="pickup"||this.collectPickup(e,n)}collectPickup(e,t){const n=t.item??"bandage";Da(this.inventory,n,1)>0?(this.spawnFloat(e,`取得 ${Zi[n].name}`,"#ffe08a"),this.log=`${e.name} 取得 ${Zi[n].name}`):this.log="背包已滿。",t.gone=!0,this.syncUi(),this.autosave()}async useTrigger(e,t){if(!(this.busy||e.actedThisTurn||t.used)){this.busy=!0,e.anim="cast",e.animStart=performance.now(),it.play("skill"),await this.waitMs(ha),t.used=!0,t.type==="van"&&(t.gone=!0);for(const[n,i]of t.unblock)this.map.unblock(n,i);if(t.healAdj)for(const n of this.units)n.dead||Math.abs(n.x-t.x)+Math.abs(n.y-t.y)>1||n.stance!=="friendly"&&n.team!=="player"||(n.hp=Math.min(n.maxHp,n.hp+t.healAdj),this.spawnFloat(n,`+${t.healAdj}`,"#7dffb3"));if(this.log=t.type==="van"?"貨車門打開了。":"開關啟動。",e.actedThisTurn=!0,e.anim="idle",this.busy=!1,e.movedThisTurn){await this.finishUnit();return}this.showCommand(e),this.autosave()}}blastBarrel(e,t){it.play("hit");for(const n of this.units)n.dead||Math.abs(n.x-e)+Math.abs(n.y-t)===1&&(n.hp=Math.max(0,n.hp-Fa),this.spawnFloat(n,`${Fa}`,"#ff9a3c"),n.hp<=0&&(n.dead=!0,this.log=`${n.name} 被爆炸波及。`,this.tryEnemyDrop(n)))}spawnFloat(e,t,n){this.floats.push({x:e.x,y:e.y,text:t,color:n,born:performance.now(),life:900})}tryEnemyDrop(e){if(e.team!=="enemy")return;const t=e.role==="elite"?.62:.35;if(Math.random()>=t)return;const i=(Math.random()<.65?"bandage":"stim")==="bandage"?["bandage","stim"]:["stim","bandage"];for(const r of i)if(Da(this.inventory,r,1)>0){this.spawnFloat(e,`掉落 ${Zi[r].name}`,"#ffe08a");return}}jumpToMission(e){e<0||e>=Ji.length||(this.pendingJump=null,this.inventory=an(Qi),this.missionStartInventory=an(Qi),this.m1DropGiven=!1,this.missionIndex=e,this.closePause(),this.closeModal(),this.result.hidden=!0,this.result.classList.remove("lose"),this.title.hidden=!0,this.briefing.hidden=!1,this.resetBattle(),this.phase="briefing",this.syncUi())}requestNextMission(){this.missionIndex>=Ji.length-1||this.busy||(this.pendingJump=this.missionIndex+1,this.confirmText.textContent="跳到測試關卡 "+String((this.pendingJump??0)+1)+"？目前戰鬥不會保留。",this.confirmEl.hidden=!1)}openPause(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||(this.paused=!0,this.pauseOpen=!0,this.pauseEl.hidden=!1,this.syncMuteBtn(),it.play("pause"))}closePause(){this.pauseEl.hidden=!0,this.pauseOpen=!1,this.paused=!1}toggleMute(){it.toggleMute(),this.syncMuteBtn()}syncMuteBtn(){this.btnMute.textContent=it.muted?"取消靜音":"靜音"}quitToTitle(){if(!(this.playable()||this.phase==="enemy")){this.goTitle();return}this.pendingQuit=!0,this.confirmText.textContent="返回標題？進度在存檔與自動存檔裡。",this.confirmEl.hidden=!1}goTitle(){this.pendingQuit=!1,this.closePause(),this.closeModal(),this.confirmEl.hidden=!0,this.result.hidden=!0,this.result.classList.remove("lose"),this.briefing.hidden=!0,this.title.hidden=!1,this.phase="title",this.busy=!1,this.clearSel(),this.inspect=null,it.setBgm("title"),this.refreshContinue(),this.syncUi()}async refreshApp(){const e=xe("btn-refresh");e.disabled=!0,e.textContent="正在更新…";try{if("caches"in window){const n=await caches.keys();await Promise.all(n.map(i=>caches.delete(i)))}}catch{}try{if("serviceWorker"in navigator){const n=await navigator.serviceWorker.getRegistrations();for(const i of n){i.waiting&&i.waiting.postMessage("skipWaiting");try{await i.update()}catch{}i.waiting&&i.waiting.postMessage("skipWaiting"),await i.unregister()}}}catch{}const t=new URL(location.href);t.searchParams.set("v",Su),t.searchParams.set("r",String(Date.now())),location.replace(t.toString())}playable(){return this.phase==="select"||this.phase==="skillAim"||this.phase==="forecast"||this.phase==="itemAim"}openBagFromHud(){this.phase==="title"||this.phase==="briefing"||this.phase==="victory"||this.phase==="defeat"||this.openBag()}openBag(){this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind="bag",this.modal.hidden=!1,this.modalKicker.textContent="道具",this.modalTitle.textContent="背包",this.paintBag()}paintBag(){this.modalBody.innerHTML="";const e=this.playable()&&!!this.selected&&!this.selected.actedThisTurn&&!this.busy;if(!this.inventory.length){const t=document.createElement("p");t.textContent="沒有道具。",this.modalBody.appendChild(t);return}if(this.playable()&&!this.selected){const t=document.createElement("p");t.textContent="先選單位再用道具。",this.modalBody.appendChild(t)}for(const t of this.inventory){const n=Zi[t.id],i=document.createElement("div");i.className="item-row";const r=document.createElement("div"),a=document.createElement("b");a.textContent=`${n.name} ×${t.qty}`;const o=document.createElement("span");if(o.textContent=n.hint,r.append(a,o),i.appendChild(r),this.playable()){const l=document.createElement("button");l.type="button",l.className="use",l.dataset.item=t.id,l.textContent="使用",l.disabled=!e,i.appendChild(l)}this.modalBody.appendChild(i)}}openSaves(e){this.pauseOpen&&(this.pauseEl.hidden=!0),this.modalKind=e,this.modal.hidden=!1,this.modalKicker.textContent=e==="save"?"存檔":"讀檔",this.modalTitle.textContent=e==="save"?"存檔":"讀檔",this.paintSaves()}paintSaves(){const e=Ii();this.modalBody.innerHTML="";for(let t=0;t<Od;t++){const n=e.slots[t],i=document.createElement("button");i.type="button",i.className=n?"slot":"slot empty",i.dataset.slot=String(t);const r=document.createElement("div"),a=document.createElement("b");a.textContent=`檔案 ${t+1}`;const o=document.createElement("span");o.textContent=n?`${n.missionName}　${JM(n.savedAt)}`:"空",r.append(a,o),i.appendChild(r),this.modalBody.appendChild(i)}}onModalClick(e){const t=e.target,n=t.closest("button.use");if(n&&this.modalKind==="bag"){const a=n.dataset.item;(a==="bandage"||a==="stim")&&this.armItem(a);return}const i=t.closest("button.ally-row");if(i&&this.modalKind==="target"){const a=i.dataset.uid,o=this.units.find(l=>l.id===a);o&&this.applyItem(o);return}const r=t.closest("button.slot");if(r&&(this.modalKind==="save"||this.modalKind==="load")){const a=Number(r.dataset.slot);this.modalKind==="load"?this.loadSlot(a):this.trySaveSlot(a)}}armItem(e){const t=this.selected;if(!t||t.actedThisTurn||this.busy){this.log="先選單位再用道具。",this.syncUi();return}this.pendingItem=e,this.closePause(),this.closeModal(),this.inspect=null,this.forecast=null,this.moveTiles.clear(),this.actionTiles.clear(),this.areaTiles.clear(),this.areaKind="item";const n=Ua(this.units);this.skillTiles=new Set(n.map(i=>Ze(i.x,i.y))),this.phase="itemAim",this.log=`${Zi[e].name}　選我軍單位`,this.syncUi(),this.modalKind="target",this.modal.hidden=!1,this.modalKicker.textContent=Zi[e].name,this.modalTitle.textContent="選擇對象",this.modalBody.innerHTML="";for(const i of n){const r=document.createElement("button");r.type="button",r.className="ally-row",r.dataset.uid=i.id;const a=document.createElement("div"),o=document.createElement("b");o.textContent=i.name;const l=document.createElement("span");l.textContent=`生命 ${i.hp}/${i.maxHp}`,a.append(o,l),r.appendChild(a),this.modalBody.appendChild(r)}}async applyItem(e){const t=this.selected,n=this.pendingItem;if(!(!t||!n||t.actedThisTurn||this.busy)&&Ua(this.units).some(i=>i.id===e.id)&&yf(this.inventory,n)){if(this.closeModal(),this.busy=!0,it.play("heal"),n==="bandage"){const i=Math.min(Ic,e.maxHp-e.hp);e.hp=Math.min(e.maxHp,e.hp+Ic),this.spawnFloat(e,`+${Math.max(i,0)}`,"#7dffb3"),this.log=`${t.name} 對 ${e.name} 使用繃帶`}else e.atkBuff=_f,this.spawnFloat(e,"+ATK","#ffc857"),this.log=`${t.name} 對 ${e.name} 使用提神　下次攻擊 +5`;if(t.actedThisTurn=!0,this.pendingItem=null,this.skillTiles.clear(),await this.waitMs(220),this.busy=!1,t.movedThisTurn){await this.finishUnit();return}this.showCommand(t),this.autosave()}}closeModal(){this.modal.hidden=!0,this.modalKind="off",this.modalBody.innerHTML="",this.pauseOpen&&(this.pauseEl.hidden=!1)}trySaveSlot(e){if(Ii().slots[e]){this.pendingSlot=e,this.confirmText.textContent=`覆蓋檔案 ${e+1}？`,this.confirmEl.hidden=!1;return}this.writeSlot(e)}confirmYes(){if(this.confirmEl.hidden=!0,this.pendingQuit){this.pendingQuit=!1,this.goTitle();return}if(this.pendingJump!==null){const e=this.pendingJump;this.pendingJump=null,this.jumpToMission(e);return}this.pendingSlot!==null&&this.writeSlot(this.pendingSlot),this.pendingSlot=null}confirmNo(){this.confirmEl.hidden=!0,this.pendingSlot=null,this.pendingQuit=!1,this.pendingJump=null}writeSlot(e){const t=Ii();t.slots[e]=this.captureSave(),yu(t),this.pendingSlot=null,this.log=`已存到檔案 ${e+1}`,this.closeModal(),this.refreshContinue(),this.syncUi()}loadSlot(e){const n=Ii().slots[e];n&&(this.closeModal(),this.closePause(),this.applySave(n))}captureSave(){const e=this.playable()||this.phase==="enemy";return{v:1,savedAt:Date.now(),missionIndex:this.missionIndex,missionName:e?`${this.mission.number}　戰鬥中`:this.mission.number,phase:this.phase==="enemy"||this.phase==="itemAim"||this.phase==="skillAim"||this.phase==="forecast"?"select":this.phase,turn:this.turn,intel:this.intel,power:this.power,inventory:an(this.inventory),units:this.units.map(t=>this.packUnit(t)),cam:{...this.renderer.cam},yaw:this.renderer.yaw,pitch:this.renderer.pitch,log:this.log,selectedId:this.selected&&e?this.selected.id:null,origin:this.origin?{...this.origin}:null,originDir:this.originDir,m1DropGiven:this.m1DropGiven,missionStartInventory:an(this.missionStartInventory),objects:this.map.objects.map(t=>({id:t.id,hp:t.hp,gone:t.gone,used:t.used}))}}packUnit(e){return{id:e.id,x:e.x,y:e.y,hp:e.hp,maxHp:e.maxHp,atk:e.atk,def:e.def,dir:e.dir,acted:e.acted,skillUsed:e.skillUsed,skipNext:e.skipNext,dead:e.dead,movedThisTurn:e.movedThisTurn,actedThisTurn:e.actedThisTurn,atkBuff:e.atkBuff,team:e.team,stance:e.stance,behaviour:e.behaviour,archetype:e.archetype,gender:e.gender,skillKind:e.skillKind,rangeMin:e.rangeMin,rangeMax:e.rangeMax}}applySave(e){if(this.missionIndex=e.missionIndex,this.intel=e.intel,this.power=e.power,this.inventory=an(e.inventory),this.missionStartInventory=an(e.missionStartInventory??e.inventory),this.m1DropGiven=e.m1DropGiven,this.turn=e.turn,this.log=e.log,this.setSeg("seg-intel",e.intel),this.setSeg("seg-power",e.power),this.map=new Oa(this.mission.map),e.objects)for(const r of e.objects){const a=this.map.objects.find(o=>o.id===r.id);if(a&&(a.hp=r.hp,a.gone=r.gone,a.used=r.used,a.used)){for(const[o,l]of a.unblock)this.map.unblock(o,l);a.type==="van"&&(a.gone=!0)}}const t=[...Ec(this.mission.starts),...this.mission.makeOthers()],n=new Map(t.map(r=>[r.id,r]));this.units=[];for(const r of e.units){const a=n.get(r.id);a&&this.units.push({...a,...r})}this.renderer.cam={...e.cam},this.renderer.yaw=e.yaw,this.renderer.setPitch(e.pitch??or),this.yawSlider.value=String(Math.round((e.yaw%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*100)),this.pitchSlider.value=String(Math.round(this.renderer.pitch)),this.clearSel(),this.inspect=null,this.busy=!1,this.pendingItem=null,this.fillBriefing(),this.result.hidden=!0,this.result.classList.remove("lose"),this.confirmEl.hidden=!0;const i=e.phase;if(this.phase=i,i==="title")this.title.hidden=!1,this.briefing.hidden=!0;else if(i==="briefing")this.title.hidden=!0,this.briefing.hidden=!1;else if(i==="victory"||i==="defeat")this.title.hidden=!0,this.briefing.hidden=!0,this.result.hidden=!1,i==="defeat"&&this.result.classList.add("lose");else if(this.title.hidden=!0,this.briefing.hidden=!0,this.phase="select",e.selectedId){const r=this.units.find(a=>a.id===e.selectedId);r&&!r.dead&&!r.acted&&!r.npc&&(this.selected=r,this.origin=e.origin,this.originDir=e.originDir,this.refreshRanges(r))}this.closePause(),this.phase==="title"||this.phase==="briefing"?it.setBgm("title"):this.phase==="victory"||this.phase==="defeat"?it.setBgm(null):it.setBgm("battle"),this.refreshContinue(),this.syncUi()}setSeg(e,t){const n=xe(e);for(const i of n.querySelectorAll("button"))i.classList.toggle("on",i.getAttribute("data-v")===t)}autosave(){if(this.phase==="title")return;const e=Ii();e.autosave=this.captureSave(),yu(e),this.refreshContinue()}refreshContinue(){this.btnContinue.disabled=!Mu(Ii())}paintUnitChip(e,t){this.chip.hidden=!1,this.chipHp.hidden=!1;const n=`${Tu[Mi(e)]}${e.npc?"　保護":""}`;this.chipName.textContent=`${e.name}　${e.title}`;const i=e.atkBuff?`　攻擊+${e.atkBuff}`:"";this.chipMeta.textContent=`${n}　${jM[e.role]}　生命 ${e.hp}/${e.maxHp}　攻擊 ${e.atk}　防禦 ${e.def}　移動 ${e.mov}　跳躍 ${e.jmp}${i}`,this.chipHpFill.style.width=`${100*e.hp/e.maxHp}%`,this.chipMark.style.background=Au(e),e.skillName?(this.chipExtra.hidden=!1,this.chipExtra.textContent=`${e.skillName}　${e.skillHint}`):(this.chipExtra.hidden=!t,this.chipExtra.textContent=t?"無技能":"",t||(this.chipExtra.hidden=!0))}paintObjectChip(e){const t=this.map.objects.find(i=>i.id===e);if(this.chip.hidden=!1,!t){this.chip.hidden=!0;return}this.chipHp.hidden=t.kind!=="destructible",this.chipName.textContent=t.label;const n=t.kind==="pickup"?"拾取":t.kind==="trigger"?"啟動":t.kind==="destructible"?"可破壞":"可站上";this.chipMeta.textContent=`${n}　${t.used?"已使用":"未使用"}`,t.kind==="destructible"&&(this.chipHpFill.style.width=`${100*t.hp/t.maxHp}%`),this.chipExtra.hidden=!1,this.chipExtra.textContent=t.kind==="pickup"?"靠近或走到此格可放入背包。":t.kind==="trigger"?"相鄰時可啟動。消耗行動。":t.kind==="destructible"?"攻擊可破壞。油桶爆炸會波及鄰格。":"走到此格可站上，高度較高。",this.chipMark.style.background=t.kind==="destructible"?"#ff4d6d":"#ffc857"}paintTileChip(e){this.chip.hidden=!1,this.chipHp.hidden=!0,this.chipName.textContent=Io[e.terrain];const t=[`高度 ${e.h}`,e.blocked?"阻擋":"可走",Io[e.terrain]];e.prop&&t.push(eS[e.prop]),this.chipMeta.textContent=t.join("　"),this.chipExtra.hidden=!1,this.chipExtra.textContent=e.blocked?"無法站上此格。":"可以走。",this.chipMark.style.background=e.blocked?"#ff4d6d":"#3ef0d0"}syncUi(){this.hudTurn.textContent=`回合 ${this.turn}`,this.hudPhase.textContent=this.phase==="enemy"?"敵軍":this.phase==="victory"?"勝利":this.phase==="defeat"?"失敗":this.phase==="title"?"選單":"我軍",this.hudSub.textContent=`${this.mission.hudSub}　智 ${wc[this.intel]}　力 ${wc[this.power]}`,this.logEl.textContent=this.log;const e=this.playable(),t=this.selected;if(this.inspect&&e?this.inspect.kind==="unit"?this.paintUnitChip(this.inspect.unit,!0):this.inspect.kind==="object"?this.paintObjectChip(this.inspect.id):this.paintTileChip(this.inspect.tile):t&&e?this.paintUnitChip(t,!1):this.chip.hidden=!0,this.forecast&&this.phase==="forecast"){this.forecastEl.hidden=!1;const l=this.forecast.heal?"good":"bad";this.forecastEl.innerHTML=`<div><b>${this.forecast.label}</b></div><div class="${l}">${this.forecast.detail}</div><div>點確認出手，取消返回。</div>`}else this.forecastEl.hidden=!0;const n=!!t&&this.phase==="select";this.btnCancel.disabled=!t&&!this.inspect&&this.phase!=="itemAim"||this.phase==="enemy"||this.busy,this.btnWait.disabled=!n||this.busy,this.btnWait.textContent=t&&(t.movedThisTurn||t.actedThisTurn)?"結束":"待機",this.btnSkill.disabled=!t||!t.skillName||t.skillUsed||t.actedThisTurn||this.busy||this.phase!=="select"&&this.phase!=="skillAim",this.btnSkill.classList.toggle("armed",this.phase==="skillAim"),this.btnConfirm.disabled=this.phase!=="forecast"||this.busy;const i=this.units.some(l=>l.team==="player"&&!l.dead&&!l.acted&&!l.npc),r=this.phase==="enemy"||this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat",a=this.phase==="briefing"||this.phase==="title"||this.phase==="victory"||this.phase==="defeat"||this.vnOpen;this.btnEnd.hidden=!i||r,this.btnRotate.hidden=r,this.btnPause.hidden=a,this.btnBag.hidden=a,this.camHint.hidden=r;const o=window.matchMedia("(pointer: fine)").matches;this.yawSlider.hidden=r||!o,this.pitchSlider.hidden=r||!o,this.pitchSlider.value=String(Math.round(this.renderer.pitch)),this.refreshContinue()}}const Bd=document.getElementById("board");if(!(Bd instanceof HTMLCanvasElement))throw new Error("board");document.addEventListener("pointerdown",()=>{it.unlock()},{capture:!0});document.addEventListener("click",s=>{s.target.closest("button")&&it.play("ui")},!0);const zd=new tS(Bd);zd.applyHash();zd.start();const nS=location.search.includes("shot");"serviceWorker"in navigator&&!nS&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"})});
