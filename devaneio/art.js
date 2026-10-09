/* Devaneio — gerador de ilustrações das cartas.
   Cada carta é desenhada a partir do seu número, então todos os celulares veem a mesma imagem. */
(function(){
const W=480,H=720;
function rng(seed){let a=seed>>>0;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

const PAL=[
 {n:"crepusculo",sky:["#1d2b53","#7e4e8a","#f2a65a"],gr:["#3b2c4f","#1c1530"],ac:"#ffd27a",li:"#fff1c1",ink:"#140f24",dark:1},
 {n:"aurora",sky:["#9fc5e8","#f7c6c7","#ffe8b8"],gr:["#7aa38f","#3f6b5c"],ac:"#e86a5c",li:"#fffbe9",ink:"#2a3b3a",dark:0},
 {n:"noite",sky:["#05101f","#0d2a45","#1d4e6b"],gr:["#0b2233","#04101a"],ac:"#f5e6a8",li:"#fdf6d2",ink:"#020a12",dark:1},
 {n:"menta",sky:["#cfeee0","#a8dcc9","#f6f0d8"],gr:["#88b39a","#4f7d66"],ac:"#e45f4e",li:"#ffffff",ink:"#23413a",dark:0},
 {n:"deserto",sky:["#f4d9a6","#f0b27a","#e98a5d"],gr:["#d9925a","#9c5a35"],ac:"#2e5e7e",li:"#fff4dc",ink:"#4a2618",dark:0},
 {n:"tempestade",sky:["#2b3440","#56606b","#8f9aa3"],gr:["#3c4650","#1f262d"],ac:"#f2c14e",li:"#f7f3e3",ink:"#14191e",dark:1},
 {n:"boreal",sky:["#071a2b","#0f4c4a","#3fbf9a"],gr:["#0d2b33","#061419"],ac:"#e07bb5",li:"#d8fff2",ink:"#03100f",dark:1},
 {n:"oceano",sky:["#0e3b5c","#1f6f8b","#99d3df"],gr:["#14506e","#0a2c40"],ac:"#ff9f68",li:"#e9fbff",ink:"#06202e",dark:1},
 {n:"outono",sky:["#f2c57c","#dd7a4b","#9e3d3d"],gr:["#7a3b2e","#3f1f1a"],ac:"#2f4858",li:"#fff0d4",ink:"#2b130f",dark:0},
 {n:"lavanda",sky:["#c9b8e8","#e8c5d8","#f8e5d0"],gr:["#9a86b8","#5c4b7a"],ac:"#f2a541",li:"#fffaf0",ink:"#2d2340",dark:0},
 {n:"neve",sky:["#cfdcea","#e6eef5","#fbfdff"],gr:["#c8d6e3","#93a7ba"],ac:"#c0392b",li:"#ffffff",ink:"#2c3e50",dark:0},
 {n:"brasa",sky:["#1a0b0b","#5c1a1a","#e2652b"],gr:["#2a0f0c","#120605"],ac:"#ffd166",li:"#fff1c9",ink:"#0a0302",dark:1}
];

/* ---------- utilitários ---------- */
let c,R,P,G; // contexto, aleatório, paleta, chão
const rr=(a,b)=>a+R()*(b-a), ri=(a,b)=>Math.floor(rr(a,b+1)), pick=a=>a[Math.floor(R()*a.length)];
function hexA(h,a){const n=parseInt(h.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function mix(h1,h2,t){const a=parseInt(h1.slice(1),16),b=parseInt(h2.slice(1),16);const f=(s)=>Math.round(((a>>s)&255)*(1-t)+((b>>s)&255)*t);return`rgb(${f(16)},${f(8)},${f(0)})`}
function glow(x,y,r,col,a){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(col,a));g.addColorStop(1,hexA(col,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill()}
function cloud(x,y,s,col,a){c.fillStyle=hexA(col,a);c.beginPath();const n=ri(4,7);for(let i=0;i<n;i++){const dx=(i/(n-1)-.5)*s*2.2,dy=-Math.sin(i/(n-1)*Math.PI)*s*.5;c.moveTo(x+dx+s*.5,y+dy);c.arc(x+dx,y+dy,s*rr(.35,.6),0,7)}c.fill()}
function shadow(x,y,w,a){c.save();c.fillStyle=hexA(P.ink,a||.35);c.beginPath();c.ellipse(x,y,w,w*.14,0,0,7);c.fill();c.restore()}
function person(x,y,h,col,opt){opt=opt||{};c.save();c.fillStyle=col;c.strokeStyle=col;c.lineCap="round";
  const hr=h*.11;c.beginPath();c.arc(x,y-h+hr,hr,0,7);c.fill();
  c.beginPath();c.moveTo(x-h*.13,y-h*.05);c.quadraticCurveTo(x-h*.14,y-h*.62,x,y-h*.76);c.quadraticCurveTo(x+h*.14,y-h*.62,x+h*.13,y-h*.05);c.closePath();c.fill();
  c.lineWidth=h*.05;c.beginPath();c.moveTo(x-h*.05,y-h*.08);c.lineTo(x-h*.06,y);c.moveTo(x+h*.05,y-h*.08);c.lineTo(x+h*.06,y);c.stroke();
  if(opt.umb){c.lineWidth=h*.025;c.beginPath();c.moveTo(x+h*.08,y-h*.55);c.lineTo(x+h*.1,y-h*1.25);c.stroke();c.fillStyle=opt.umb;c.beginPath();c.moveTo(x-h*.42,y-h*1.15);c.quadraticCurveTo(x+h*.1,y-h*1.75,x+h*.62,y-h*1.15);
    for(let i=0;i<4;i++){const x0=x+h*.62-(i+1)*h*.26;c.quadraticCurveTo(x0+h*.13,y-h*1.25,x0,y-h*1.15)}c.closePath();c.fill()}
  if(opt.balloon){c.lineWidth=h*.015;c.beginPath();c.moveTo(x+h*.12,y-h*.5);c.quadraticCurveTo(x+h*.4,y-h*.9,x+h*.3,y-h*1.4);c.stroke();c.fillStyle=opt.balloon;c.beginPath();c.ellipse(x+h*.3,y-h*1.55,h*.16,h*.2,0,0,7);c.fill()}
  c.restore()}
function stars(n,top){c.save();for(let i=0;i<n;i++){const x=rr(0,W),y=rr(0,top),s=rr(.5,1.8);c.fillStyle=hexA(P.li,rr(.3,.95));c.beginPath();c.arc(x,y,s,0,7);c.fill()}
  for(let i=0;i<3;i++){const x=rr(30,W-30),y=rr(20,top*.8),s=rr(4,7);c.strokeStyle=hexA(P.li,.8);c.lineWidth=1.2;c.beginPath();c.moveTo(x-s,y);c.lineTo(x+s,y);c.moveTo(x,y-s);c.lineTo(x,y+s);c.stroke()}c.restore()}

/* ---------- céu e chão ---------- */
function sky(){const g=c.createLinearGradient(0,0,0,G.hy);g.addColorStop(0,P.sky[0]);g.addColorStop(.6,P.sky[1]);g.addColorStop(1,P.sky[2]);c.fillStyle=g;c.fillRect(0,0,W,H);
  if(P.dark)stars(ri(60,140),G.hy*.8);
  const sx=rr(80,W-80),sy=rr(G.hy*.25,G.hy*.7);if(R()<.7){glow(sx,sy,rr(90,170),P.li,P.dark?.35:.6)}
  for(let i=0,n=ri(2,5);i<n;i++)cloud(rr(-20,W+20),rr(40,G.hy-30),rr(30,70),P.dark?P.sky[1]:"#ffffff",P.dark?.35:.55)}
const GROUNDS={
 mar(){const g=c.createLinearGradient(0,G.hy,0,H);g.addColorStop(0,P.gr[0]);g.addColorStop(1,P.gr[1]);c.fillStyle=g;c.fillRect(0,G.hy,W,H-G.hy);
  c.strokeStyle=hexA(P.li,.25);c.lineWidth=1.5;for(let i=0;i<40;i++){const y=G.hy+Math.pow(R(),1.6)*(H-G.hy),w=rr(10,50)*(1+(y-G.hy)/120);const x=rr(0,W);c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.stroke()}
  const gx=rr(120,360);const g2=c.createLinearGradient(0,G.hy,0,H);g2.addColorStop(0,hexA(P.li,.35));g2.addColorStop(1,hexA(P.li,0));c.fillStyle=g2;c.beginPath();c.moveTo(gx-20,G.hy);c.lineTo(gx+20,G.hy);c.lineTo(gx+90,H);c.lineTo(gx-90,H);c.fill()},
 colinas(){for(let l=0;l<3;l++){const y0=G.hy+l*40,col=mix(P.gr[0],P.gr[1],l/2.2);c.fillStyle=col;c.beginPath();c.moveTo(0,H);const f=rr(.006,.014),ph=rr(0,6),a=rr(15,35);for(let x=0;x<=W;x+=8)c.lineTo(x,y0+Math.sin(x*f+ph)*a-a);c.lineTo(W,H);c.fill()}},
 dunas(){for(let l=0;l<4;l++){const y0=G.hy+l*35;c.fillStyle=mix(P.gr[0],P.gr[1],l/3);c.beginPath();c.moveTo(0,H);const k=rr(-.3,.3);c.lineTo(0,y0+rr(-10,20));c.bezierCurveTo(W*.3,y0-rr(10,50),W*.6,y0+rr(0,40),W,y0+k*60);c.lineTo(W,H);c.fill()}},
 campo(){const g=c.createLinearGradient(0,G.hy,0,H);g.addColorStop(0,P.gr[0]);g.addColorStop(1,P.gr[1]);c.fillStyle=g;c.fillRect(0,G.hy,W,H-G.hy);
  const vx=rr(160,320);c.strokeStyle=hexA(P.ink,.35);c.lineWidth=2;for(let i=-14;i<=14;i++){c.beginPath();c.moveTo(vx+i*6,G.hy);c.lineTo(vx+i*70,H);c.stroke()}
  c.strokeStyle=hexA(P.ac,.55);c.lineWidth=1.4;for(let i=0;i<160;i++){const t=Math.pow(R(),1.3),y=G.hy+t*(H-G.hy),x=rr(-50,W+50),h=4+t*28;c.beginPath();c.moveTo(x,y);c.lineTo(x+rr(-3,3),y-h);c.stroke()}},
 vazio(){for(let i=0;i<7;i++)cloud(rr(-40,W+40),rr(G.hy,H),rr(50,95),P.dark?P.sky[1]:"#ffffff",P.dark?.45:.75)},
 cidade(){c.fillStyle=mix(P.gr[0],P.ink,.3);let x=-10;while(x<W){const w=rr(26,60),h=rr(40,170);c.fillRect(x,G.hy-h,w,h+5);c.fillStyle=hexA(P.li,.75);for(let yy=G.hy-h+10;yy<G.hy-8;yy+=14)for(let xx=x+6;xx<x+w-6;xx+=11)if(R()<.28)c.fillRect(xx,yy,4,6);c.fillStyle=mix(P.gr[0],P.ink,.3);x+=w+rr(0,6)}
  const g=c.createLinearGradient(0,G.hy,0,H);g.addColorStop(0,P.gr[0]);g.addColorStop(1,P.gr[1]);c.fillStyle=g;c.fillRect(0,G.hy,W,H-G.hy)},
 floresta(){const g=c.createLinearGradient(0,G.hy,0,H);g.addColorStop(0,P.gr[0]);g.addColorStop(1,P.gr[1]);c.fillStyle=g;c.fillRect(0,G.hy,W,H-G.hy);
  for(let l=0;l<2;l++){c.fillStyle=mix(P.gr[0],P.ink,.35+l*.35);for(let i=0;i<22;i++){const x=rr(-20,W+20),h=rr(40,110)*(1+l*.4),y=G.hy+l*18+rr(-4,10),w=h*.32;c.beginPath();c.moveTo(x,y-h);c.lineTo(x+w,y);c.lineTo(x-w,y);c.fill()}}},
 espelho(){const g=c.createLinearGradient(0,G.hy,0,H);g.addColorStop(0,P.sky[2]);g.addColorStop(1,P.sky[0]);c.fillStyle=g;c.fillRect(0,G.hy,W,H-G.hy);c.fillStyle=hexA(P.ink,.15);c.fillRect(0,G.hy,W,H-G.hy);c.strokeStyle=hexA(P.li,.3);c.lineWidth=1;for(let i=0;i<12;i++){const y=rr(G.hy+5,H);c.beginPath();c.moveTo(rr(0,W),y);c.lineTo(rr(0,W),y);c.stroke()}}
};

/* ---------- temas principais ---------- */
const cx=()=>rr(170,310);
const S={
 porta(){const x=cx(),y=G.ground,h=rr(170,230),w=h*.48;shadow(x,y,w*1.2);glow(x,y-h/2,h,P.li,.45);
  const g=c.createLinearGradient(0,y-h,0,y);g.addColorStop(0,P.li);g.addColorStop(1,P.ac);c.fillStyle=g;c.fillRect(x-w/2,y-h,w,h);
  c.fillStyle=P.ink;c.fillRect(x-w/2-8,y-h-8,w+16,8);c.fillRect(x-w/2-8,y-h,8,h);c.fillRect(x+w/2,y-h,8,h);
  c.fillStyle=mix(P.ink,P.gr[0],.35);c.beginPath();c.moveTo(x+w/2,y-h);c.lineTo(x+w/2+w*.6,y-h+18);c.lineTo(x+w/2+w*.6,y-6);c.lineTo(x+w/2,y);c.fill();
  c.fillStyle=hexA(P.li,.35);c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x+w/2,y);c.lineTo(x+w*1.2,H);c.lineTo(x-w*1.2,H);c.fill();
  if(R()<.6)person(x-w*1.4,y,h*.38,P.ink)},
 escada(){let x=rr(200,280),y=G.ground,s=34;c.fillStyle=P.ink;for(let i=0;i<26;i++){const t=i/26;c.globalAlpha=1-t*.55;c.fillRect(x+Math.sin(i*.6)*80*(1-t*.4)-s/2,y,s,6+4*(1-t));
   y-=rr(16,22);s*=.97}c.globalAlpha=1;c.fillRect(x-2,y,4,G.ground-y);glow(x,y,90,P.li,.6);if(R()<.5)cloud(x,y+20,60,"#ffffff",.6)},
 lua(){const x=cx(),y=rr(G.hy*.35,G.hy*.6),r=rr(80,120);glow(x,y,r*2.4,P.li,.4);c.fillStyle=mix(P.li,P.sky[2],.25);c.beginPath();c.arc(x,y,r,0,7);c.fill();
  c.fillStyle=hexA(P.ink,.12);for(let i=0;i<7;i++){c.beginPath();c.arc(x+rr(-r*.6,r*.6),y+rr(-r*.6,r*.6),rr(6,20),0,7);c.fill()}
  if(R()<.5){c.strokeStyle=hexA(P.ac,.85);c.lineWidth=7;c.beginPath();c.ellipse(x,y,r*1.7,r*.35,-.35,0,7);c.stroke()}
  else{c.fillStyle=P.sky[1];c.globalAlpha=.9;c.beginPath();c.arc(x+r*.45,y-r*.2,r*.92,0,7);c.fill();c.globalAlpha=1;c.fillStyle=P.ink;const kx=x-r*.72,ky=y+r*.35;c.beginPath();c.ellipse(kx,ky,13,17,0,0,7);c.arc(kx,ky-21,9,0,7);c.fill();c.beginPath();c.moveTo(kx-8,ky-26);c.lineTo(kx-6,ky-36);c.lineTo(kx-2,ky-28);c.moveTo(kx+8,ky-26);c.lineTo(kx+6,ky-36);c.lineTo(kx+2,ky-28);c.fill();c.lineWidth=3;c.strokeStyle=P.ink;c.beginPath();c.moveTo(kx+10,ky+12);c.quadraticCurveTo(kx+30,ky+20,kx+24,ky+40);c.stroke()}},
 balao(){const x=cx(),y=rr(G.hy*.35,G.hy*.6),r=rr(55,80);c.save();c.beginPath();c.moveTo(x,y+r*1.45);c.bezierCurveTo(x-r*1.5,y+r*.2,x-r*1.2,y-r*1.3,x,y-r*1.2);c.bezierCurveTo(x+r*1.2,y-r*1.3,x+r*1.5,y+r*.2,x,y+r*1.45);c.closePath();c.fillStyle=P.ac;c.fill();c.clip();
  c.fillStyle=hexA(P.li,.55);for(let i=-3;i<=3;i+=2)c.fillRect(x+i*r*.27-r*.12,y-r*1.5,r*.25,r*3.2);c.restore();
  c.strokeStyle=P.ink;c.lineWidth=1.5;c.beginPath();c.moveTo(x-r*.35,y+r*1.1);c.lineTo(x-r*.18,y+r*1.75);c.moveTo(x+r*.35,y+r*1.1);c.lineTo(x+r*.18,y+r*1.75);c.stroke();c.fillStyle=P.ink;c.fillRect(x-r*.2,y+r*1.75,r*.4,r*.28);
  if(R()<.5)person(x,y+r*1.78,r*.38,P.ink)},
 farol(){const x=rr(150,330),y=G.ground,h=rr(210,270),bw=48,tw=30;shadow(x,y,70);
  const ang=rr(-.4,.4)+(x>240?Math.PI:0);c.save();c.translate(x,y-h-18);c.rotate(ang);const g=c.createLinearGradient(0,0,420,0);g.addColorStop(0,hexA(P.li,.75));g.addColorStop(1,hexA(P.li,0));c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.lineTo(420,-70);c.lineTo(420,70);c.fill();c.restore();
  c.fillStyle=P.li;c.beginPath();c.moveTo(x-bw/2,y);c.lineTo(x-tw/2,y-h);c.lineTo(x+tw/2,y-h);c.lineTo(x+bw/2,y);c.fill();
  c.fillStyle=P.ac;for(let i=1;i<4;i++){const y1=y-h*i/4,y2=y1+h/8,w1=bw-(bw-tw)*(i/4),w2=bw-(bw-tw)*((i-.5)/4);c.beginPath();c.moveTo(x-w1/2,y1);c.lineTo(x+w1/2,y1);c.lineTo(x+w2/2,y2);c.lineTo(x-w2/2,y2);c.fill()}
  c.fillStyle=P.ink;c.fillRect(x-tw/2-4,y-h-4,tw+8,6);c.fillRect(x-tw/2,y-h-32,tw,4);glow(x,y-h-18,40,P.li,.9);c.fillStyle=P.li;c.fillRect(x-tw/2+3,y-h-28,tw-6,24);c.fillStyle=P.ink;c.beginPath();c.moveTo(x-tw/2-2,y-h-32);c.lineTo(x,y-h-50);c.lineTo(x+tw/2+2,y-h-32);c.fill()},
 baleia(){const x=cx(),y=rr(G.hy*.35,G.hy*.62),s=rr(90,130),d=R()<.5?1:-1;c.save();c.translate(x,y);c.scale(d,1);
  c.fillStyle=mix(P.ink,P.sky[1],.25);c.beginPath();c.moveTo(-s*1.2,0);c.bezierCurveTo(-s*1.2,-s*.75,s*.8,-s*.7,s*1.1,-s*.05);c.bezierCurveTo(s*1.35,s*.05,s*1.6,-s*.35,s*1.85,-s*.45);c.bezierCurveTo(s*1.75,-s*.1,s*1.8,s*.2,s*1.9,s*.35);c.bezierCurveTo(s*1.6,s*.2,s*1.35,s*.1,s*1.1,s*.2);c.bezierCurveTo(s*.6,s*.55,-s*1.2,s*.55,-s*1.2,0);c.fill();
  c.strokeStyle=hexA(P.li,.35);c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-s*.9+i*s*.2,s*.18);c.lineTo(-s*.6+i*s*.2,s*.4);c.stroke()}
  c.fillStyle=P.li;c.beginPath();c.arc(-s*.75,-s*.1,s*.06,0,7);c.fill();c.restore();
  if(R()<.6){c.strokeStyle=hexA(P.li,.6);c.lineWidth=2;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-d*s*.6,y-s*.55);c.quadraticCurveTo(x-d*s*.6+(i-2)*14,y-s*.9,x-d*s*.6+(i-2)*26,y-s*.85);c.stroke()}}},
 arvore(){const x=cx(),y=G.ground,len=rr(80,105);shadow(x,y,110);const fruits=[];c.strokeStyle=P.ink;c.lineCap="round";
  (function br(x0,y0,a,l,w,d){const x1=x0+Math.cos(a)*l,y1=y0+Math.sin(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();if(d===0||l<12){fruits.push([x1,y1]);return}
   br(x1,y1,a-rr(.25,.55),l*rr(.68,.8),w*.7,d-1);br(x1,y1,a+rr(.25,.55),l*rr(.68,.8),w*.7,d-1);if(R()<.3)br(x1,y1,a+rr(-.1,.1),l*.6,w*.6,d-1)})(x,y,-Math.PI/2+rr(-.1,.1),len,16,7);
  const kind=ri(0,2);fruits.forEach(([fx,fy])=>{if(R()<.35)return;if(kind===0){glow(fx,fy+8,16,P.ac,.7);c.fillStyle=P.ac;c.fillRect(fx-3,fy+3,6,9)}else if(kind===1){c.fillStyle=P.ac;c.beginPath();c.arc(fx,fy+6,5,0,7);c.fill()}else{c.fillStyle=hexA(P.li,.9);c.beginPath();c.ellipse(fx,fy,5,9,rr(0,3),0,7);c.fill()}})},
 chave(){const x=cx(),y=rr(G.hy*.45,G.hy*.85),s=rr(1,1.3);c.save();c.translate(x,y);c.rotate(rr(-.9,-.4));c.scale(s,s);glow(0,0,160,P.li,.35);c.fillStyle=P.ac;c.strokeStyle=P.ink;c.lineWidth=3;
  c.beginPath();c.arc(-100,0,38,0,7);c.arc(-100,0,20,0,7,true);c.fill("evenodd");c.stroke();c.fillRect(-64,-8,170,16);c.strokeRect(-64,-8,170,16);c.fillRect(70,8,12,26);c.fillRect(92,8,12,36);c.strokeRect(70,8,12,26);c.strokeRect(92,8,12,36);
  for(let i=0;i<6;i++){c.save();c.rotate(i*Math.PI/3);c.beginPath();c.arc(-100+30,0,4,0,7);c.restore()}c.restore()},
 ilha(){const x=cx(),y=rr(G.hy*.4,G.hy*.7),w=rr(110,150);c.fillStyle=mix(P.gr[1],P.ink,.3);c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.lineTo(x+w*.3,y+w*.8);c.lineTo(x+rr(-10,10),y+w*1.25);c.lineTo(x-w*.4,y+w*.7);c.fill();
  c.strokeStyle=hexA(P.ink,.6);c.lineWidth=1.5;for(let i=0;i<8;i++){const rx=x+rr(-w*.5,w*.5);c.beginPath();c.moveTo(rx,y+w*.5);c.quadraticCurveTo(rx+rr(-15,15),y+w*1.1,rx+rr(-10,10),y+w*1.5);c.stroke()}
  c.fillStyle=P.gr[0];c.beginPath();c.ellipse(x,y,w,16,0,0,7);c.fill();const hx=x+rr(-30,10);c.fillStyle=P.li;c.fillRect(hx,y-48,44,40);c.fillStyle=P.ac;c.beginPath();c.moveTo(hx-8,y-46);c.lineTo(hx+22,y-74);c.lineTo(hx+52,y-46);c.fill();c.fillStyle=P.ink;c.fillRect(hx+16,y-30,12,22);glow(hx+34,y-32,22,P.ac,.6);
  if(R()<.6){c.strokeStyle=P.ink;c.lineWidth=5;c.beginPath();c.moveTo(x-w*.6,y);c.lineTo(x-w*.6,y-60);c.stroke();c.fillStyle=P.gr[1];c.beginPath();c.arc(x-w*.6,y-70,24,0,7);c.fill()}},
 barco(){const x=cx(),y=G.type==="mar"||G.type==="espelho"?G.hy+rr(30,70):rr(G.hy*.45,G.hy*.8),s=rr(70,95);c.fillStyle=P.li;c.beginPath();c.moveTo(x-s*1.4,y-s*.35);c.lineTo(x+s*1.4,y-s*.35);c.lineTo(x+s,y+s*.15);c.lineTo(x-s,y+s*.15);c.fill();
  c.fillStyle=mix(P.li,P.sky[1],.3);c.beginPath();c.moveTo(x-s*.7,y-s*.35);c.lineTo(x,y-s*1.4);c.lineTo(x+s*.7,y-s*.35);c.fill();c.fillStyle=mix(P.li,P.ink,.15);c.beginPath();c.moveTo(x,y-s*1.4);c.lineTo(x+s*.7,y-s*.35);c.lineTo(x,y-s*.35);c.fill();
  c.strokeStyle=hexA(P.ink,.3);c.lineWidth=1;c.beginPath();c.moveTo(x,y-s*1.4);c.lineTo(x,y+s*.15);c.stroke();if(R()<.5)person(x+s*.35,y-s*.35,s*.35,P.ink)},
 ampulheta(){const x=cx(),y=rr(G.hy*.45,G.ground-150),h=rr(120,150),w=h*.48;glow(x,y,h*1.4,P.li,.35);c.fillStyle=hexA(P.li,.35);c.strokeStyle=P.ink;c.lineWidth=3;
  c.beginPath();c.moveTo(x-w,y-h);c.bezierCurveTo(x-w,y-h*.3,x-6,y-h*.15,x-5,y);c.bezierCurveTo(x-6,y+h*.15,x-w,y+h*.3,x-w,y+h);c.lineTo(x+w,y+h);c.bezierCurveTo(x+w,y+h*.3,x+6,y+h*.15,x+5,y);c.bezierCurveTo(x+6,y-h*.15,x+w,y-h*.3,x+w,y-h);c.closePath();c.fill();c.stroke();
  c.fillStyle=P.ac;c.beginPath();c.moveTo(x-w*.75,y-h*.55);c.lineTo(x+w*.75,y-h*.55);c.lineTo(x,y-h*.08);c.fill();c.beginPath();c.moveTo(x-w*.85,y+h*.95);c.quadraticCurveTo(x,y+h*.3,x+w*.85,y+h*.95);c.fill();c.fillRect(x-1.5,y-h*.1,3,h*.9);
  c.fillStyle=P.ink;c.fillRect(x-w-12,y-h-12,w*2+24,12);c.fillRect(x-w-12,y+h,w*2+24,12);if(G.ground<H)shadow(x,y+h+14,w+30,.25)},
 janela(){const x=cx(),y=rr(G.hy*.35,G.hy*.65),w=rr(110,140),h=w*1.3;const p2=PAL[(PAL.indexOf(P)+ri(3,8))%PAL.length];c.save();c.beginPath();c.rect(x-w/2,y-h/2,w,h);c.clip();
  const g=c.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,p2.sky[0]);g.addColorStop(1,p2.sky[2]);c.fillStyle=g;c.fillRect(x-w/2,y-h/2,w,h);glow(x+rr(-20,20),y+rr(-20,20),50,p2.li,.9);c.fillStyle=p2.gr[1];c.beginPath();c.moveTo(x-w/2,y+h/2);c.lineTo(x-w/2,y+h*.2);c.quadraticCurveTo(x,y+h*.05,x+w/2,y+h*.25);c.lineTo(x+w/2,y+h/2);c.fill();c.restore();
  c.strokeStyle=P.ink;c.lineWidth=8;c.strokeRect(x-w/2,y-h/2,w,h);c.lineWidth=5;c.beginPath();c.moveTo(x,y-h/2);c.lineTo(x,y+h/2);c.moveTo(x-w/2,y);c.lineTo(x+w/2,y);c.stroke();
  c.fillStyle=hexA(P.ink,.7);c.beginPath();c.moveTo(x-w/2,y-h/2);c.lineTo(x-w/2-w*.45,y-h/2+20);c.lineTo(x-w/2-w*.45,y+h/2-20);c.lineTo(x-w/2,y+h/2);c.fill()},
 escadaLua(){const x=rr(170,310),mx=x+rr(-60,60),my=rr(70,140),r=rr(45,65);glow(mx,my,r*2.5,P.li,.5);c.fillStyle=P.li;c.beginPath();c.arc(mx,my,r,0,7);c.fill();c.fillStyle=P.sky[0];c.beginPath();c.arc(mx+r*.4,my-r*.2,r*.9,0,7);c.fill();
  c.strokeStyle=P.ink;c.lineWidth=5;const y0=G.ground,x2=mx-r*.4,y2=my+r*.6;c.beginPath();c.moveTo(x-22,y0);c.lineTo(x2-10,y2);c.moveTo(x+22,y0);c.lineTo(x2+10,y2);c.stroke();c.lineWidth=3;for(let t=.05;t<1;t+=.06){const a=x-22+(x2-10-x+22)*t,b=y0+(y2-y0)*t,a2=x+22+(x2+10-x-22)*t;c.beginPath();c.moveTo(a,b);c.lineTo(a2,b);c.stroke()}if(R()<.7)person(x-50,y0,60,P.ink)},
 olho(){const x=cx(),y=rr(G.hy*.35,G.hy*.6),w=rr(120,160),h=w*.55;glow(x,y,w*1.6,P.li,.35);c.fillStyle=P.li;c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x,y-h*1.6,x+w,y);c.quadraticCurveTo(x,y+h*1.6,x-w,y);c.fill();
  const g=c.createRadialGradient(x,y,4,x,y,h*.85);g.addColorStop(0,P.ac);g.addColorStop(1,P.sky[0]);c.fillStyle=g;c.beginPath();c.arc(x,y,h*.85,0,7);c.fill();c.fillStyle=P.ink;c.beginPath();c.arc(x,y,h*.35,0,7);c.fill();c.fillStyle="#fff";c.beginPath();c.arc(x-h*.2,y-h*.25,h*.12,0,7);c.fill();
  c.strokeStyle=P.ink;c.lineWidth=4;c.beginPath();c.moveTo(x-w,y);c.quadraticCurveTo(x,y-h*1.6,x+w,y);c.stroke();for(let i=-3;i<=3;i++){const t=(i+4)/8,px=x-w+t*2*w,py=y-h*1.6*2*t*(1-t);c.beginPath();c.moveTo(px,py);c.lineTo(px+i*5,py-18);c.stroke()}
  for(let i=0;i<3;i++){c.fillStyle=hexA(P.li,.8);c.beginPath();c.ellipse(x+rr(-w*.4,w*.4),y+h*.9+i*30,4,8,0,0,7);c.fill()}},
 chuva(){const x=cx(),y=G.ground;c.strokeStyle=hexA(P.li,.5);c.lineWidth=1.3;for(let i=0;i<220;i++){const a=rr(0,W),b=rr(0,G.ground);c.beginPath();c.moveTo(a,b);c.lineTo(a-4,b+16);c.stroke()}
  glow(x,y-90,140,P.li,.25);shadow(x,y,60);person(x,y,rr(90,120),P.ink,{umb:P.ac});if(R()<.5){c.fillStyle=hexA(P.li,.3);c.beginPath();c.ellipse(x+60,y+20,50,8,0,0,7);c.fill()}},
 gaiola(){const x=cx(),y=rr(G.hy*.35,G.hy*.6),w=rr(70,90),h=w*1.6;c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.moveTo(x,y-h*.62);c.lineTo(x,y-h*.62-90);c.stroke();
  c.lineWidth=3;c.beginPath();c.ellipse(x,y-h*.2,w,h*.42,0,Math.PI,0);c.stroke();for(let i=-4;i<=4;i++){const bx=x+i*w/4.5;const top=y-h*.2-Math.sqrt(Math.max(0,1-(i/4.5)**2))*h*.42;c.beginPath();c.moveTo(bx,top);c.lineTo(bx,y+h*.38);c.stroke()}
  c.lineWidth=5;c.beginPath();c.moveTo(x-w,y+h*.38);c.lineTo(x+w,y+h*.38);c.moveTo(x-w,y-h*.2);c.lineTo(x+w,y-h*.2);c.stroke();
  const out=R()<.5,bx=out?x+w*1.4:x,by=out?y-h*.5:y+h*.1;c.fillStyle=P.ac;c.beginPath();c.ellipse(bx,by,18,12,0,0,7);c.arc(bx+16,by-8,9,0,7);c.fill();c.beginPath();c.moveTo(bx-12,by);c.lineTo(bx-34,by-6);c.lineTo(bx-30,by+8);c.fill();c.fillStyle=P.ink;c.beginPath();c.moveTo(bx+24,by-9);c.lineTo(bx+32,by-7);c.lineTo(bx+24,by-5);c.fill();
  if(out){c.save();c.translate(x+w,y+h*.1);c.rotate(-.6);c.strokeRect(0,-30,26,60);c.restore()}},
 xicara(){const x=cx(),y=G.ground-rr(0,30),w=rr(80,100);shadow(x,y+6,w*1.6);c.fillStyle=P.li;c.beginPath();c.ellipse(x,y,w*1.6,18,0,0,7);c.fill();
  c.fillStyle=P.li;c.beginPath();c.moveTo(x-w,y-w*1.1);c.bezierCurveTo(x-w,y-w*.1,x-w*.6,y-10,x,y-10);c.bezierCurveTo(x+w*.6,y-10,x+w,y-w*.1,x+w,y-w*1.1);c.fill();c.strokeStyle=P.li;c.lineWidth=12;c.beginPath();c.arc(x+w*1.05,y-w*.65,w*.32,-1.2,1.3);c.stroke();
  c.fillStyle=P.ac;c.fillRect(x-w,y-w*.8,w*2,6);const g=c.createLinearGradient(0,y-w*1.1,0,y-w*.95);g.addColorStop(0,P.sky[1]);g.addColorStop(1,P.gr[1]);c.fillStyle=g;c.beginPath();c.ellipse(x,y-w*1.1,w,16,0,0,7);c.fill();
  c.fillStyle="#fff";c.beginPath();c.moveTo(x-12,y-w*1.1);c.lineTo(x+12,y-w*1.1);c.lineTo(x,y-w*1.1-22);c.fill();
  c.strokeStyle=hexA(P.li,.7);c.lineWidth=3;for(let i=0;i<3;i++){c.beginPath();const sx=x-30+i*30;c.moveTo(sx,y-w*1.3);c.bezierCurveTo(sx-20,y-w*1.6,sx+20,y-w*1.8,sx,y-w*2.2);c.stroke()}},
 mascara(){const x=cx(),y=rr(G.hy*.4,G.hy*.7),s=rr(80,100);glow(x,y,s*2,P.li,.3);c.save();c.translate(x,y);c.rotate(rr(-.3,.3));c.fillStyle=P.li;c.beginPath();c.moveTo(-s,-s*.5);c.bezierCurveTo(-s,s*.9,s,s*.9,s,-s*.5);c.bezierCurveTo(s*.5,-s*.75,-s*.5,-s*.75,-s,-s*.5);c.fill();
  c.fillStyle=P.ink;const sad=R()<.5;[-1,1].forEach(k=>{c.beginPath();c.ellipse(k*s*.4,-s*.1,s*.2,s*.12,k*(sad?-.3:.3),0,7);c.fill()});c.lineWidth=5;c.strokeStyle=P.ink;c.beginPath();if(sad)c.arc(0,s*.6,s*.3,-2.6,-.5);else c.arc(0,s*.15,s*.3,.5,2.6);c.stroke();
  c.fillStyle=P.ac;c.beginPath();c.ellipse(-s*.65,s*.2,s*.12,s*.07,0,0,7);c.ellipse(s*.65,s*.2,s*.12,s*.07,0,0,7);c.fill();c.strokeStyle=P.ac;c.lineWidth=4;c.beginPath();c.moveTo(s,-s*.4);c.bezierCurveTo(s*1.5,-s*.3,s*1.2,s*.4,s*1.7,s*.7);c.stroke();c.restore()},
 rei(){const x=cx(),y=G.ground,h=rr(220,270),w=h*.3;shadow(x+40,y,w*2.2,.4);c.fillStyle=P.ink;c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.lineTo(x+w*.85,y-h*.08);c.lineTo(x+w*.5,y-h*.12);c.quadraticCurveTo(x+w*.25,y-h*.45,x+w*.35,y-h*.62);c.lineTo(x+w*.55,y-h*.68);c.lineTo(x+w*.45,y-h*.75);c.quadraticCurveTo(x+w*.6,y-h*.86,x,y-h*.88);c.quadraticCurveTo(x-w*.6,y-h*.86,x-w*.45,y-h*.75);c.lineTo(x-w*.55,y-h*.68);c.lineTo(x-w*.35,y-h*.62);c.quadraticCurveTo(x-w*.25,y-h*.45,x-w*.5,y-h*.12);c.lineTo(x-w*.85,y-h*.08);c.closePath();c.fill();
  c.fillRect(x-5,y-h,10,h*.13);c.fillRect(x-16,y-h*.95,32,9);glow(x,y-h*.5,h*.7,P.li,.18);if(R()<.7)person(x+w*1.8,y,h*.2,P.ink)},
 agua_viva(){const n=ri(1,3);for(let k=0;k<n;k++){const x=k===0?cx():rr(60,420),y=k===0?rr(G.hy*.3,G.hy*.6):rr(60,G.hy),s=k===0?rr(60,85):rr(18,35);glow(x,y,s*2.2,P.ac,.35);
   c.fillStyle=hexA(P.li,.75);c.beginPath();c.arc(x,y,s,Math.PI,0);for(let i=0;i<=6;i++)c.quadraticCurveTo(x+s-i*s/3+s/6,y+s*.2,x+s-(i+1)*s/3,y);c.fill();c.strokeStyle=hexA(P.li,.6);c.lineWidth=Math.max(1.2,s*.04);
   for(let i=-3;i<=3;i++){c.beginPath();let tx=x+i*s/4,ty=y;c.moveTo(tx,ty);for(let j=1;j<10;j++){c.lineTo(tx+Math.sin(j*.9+i)*s*.15,ty+j*s*.22)}c.stroke()}}},
 cometa(){const x=rr(140,340),y=rr(80,G.hy*.5),a=rr(.35,.8),L=rr(260,380);c.save();c.translate(x,y);c.rotate(Math.PI+a);const g=c.createLinearGradient(0,0,L,0);g.addColorStop(0,hexA(P.li,.95));g.addColorStop(1,hexA(P.li,0));c.fillStyle=g;c.beginPath();c.moveTo(0,-10);c.lineTo(L,-70);c.lineTo(L,70);c.lineTo(0,10);c.fill();c.fillStyle=g;c.globalAlpha=.6;c.beginPath();c.moveTo(0,-4);c.lineTo(L*.8,30);c.lineTo(L*.8,90);c.fill();c.restore();glow(x,y,80,P.li,.95);glow(x,y,30,P.ac,.9);c.fillStyle="#fff";c.beginPath();c.arc(x,y,12,0,7);c.fill();
  if(R()<.7){person(rr(120,360),G.ground,70,P.ink);}},
 montanha(){const x=cx(),y=rr(60,140),w=rr(120,160),h=rr(180,230);cloud(x,y,80,P.dark?P.sky[1]:"#ffffff",.8);c.fillStyle=mix(P.gr[1],P.ink,.2);c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.lineTo(x+rr(-20,20),y+h);c.fill();
  c.fillStyle=hexA(P.li,.9);c.beginPath();const tx=x+rr(-5,5),ty=y+h;c.moveTo(tx-30,ty-55);c.lineTo(tx+30,ty-52);c.lineTo(tx,ty);c.fill();c.fillStyle=P.gr[0];c.beginPath();c.ellipse(x,y,w,14,0,0,7);c.fill();
  c.strokeStyle=hexA(P.li,.6);c.lineWidth=2;c.beginPath();c.moveTo(tx,ty);c.lineTo(tx,G.ground);c.stroke();cloud(x+40,y+10,60,P.dark?P.sky[1]:"#ffffff",.7)},
 pipa(){const px=rr(120,220),py=G.ground,kx=rr(260,380),ky=rr(70,160);person(px,py,80,P.ink);c.strokeStyle=hexA(P.ink,.7);c.lineWidth=1.3;c.beginPath();c.moveTo(px+8,py-50);c.quadraticCurveTo((px+kx)/2,ky+180,kx,ky+50);c.stroke();
  c.fillStyle=P.ac;c.beginPath();c.moveTo(kx,ky-50);c.lineTo(kx+38,ky);c.lineTo(kx,ky+50);c.lineTo(kx-38,ky);c.fill();c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.moveTo(kx,ky-50);c.lineTo(kx,ky+50);c.moveTo(kx-38,ky);c.lineTo(kx+38,ky);c.stroke();
  c.beginPath();c.moveTo(kx,ky+50);for(let i=1;i<7;i++)c.lineTo(kx+Math.sin(i)*20,ky+50+i*22);c.stroke();c.fillStyle=P.li;for(let i=1;i<7;i+=2){c.beginPath();c.ellipse(kx+Math.sin(i)*20,ky+50+i*22,8,4,i,0,7);c.fill()}},
 garrafa(){const x=cx(),y=G.ground-rr(5,40),L=rr(190,230),r=L*.22;c.save();c.translate(x,y);c.rotate(rr(-.3,-.1));const g=c.createLinearGradient(0,-r,0,r);g.addColorStop(0,hexA(P.li,.5));g.addColorStop(1,hexA(P.sky[1],.35));c.fillStyle=g;c.strokeStyle=hexA(P.li,.9);c.lineWidth=3;
  c.beginPath();c.moveTo(-L/2,-r);c.lineTo(L*.2,-r);c.quadraticCurveTo(L*.32,-r,L*.35,-r*.35);c.lineTo(L/2,-r*.35);c.lineTo(L/2,r*.35);c.lineTo(L*.35,r*.35);c.quadraticCurveTo(L*.32,r,L*.2,r);c.lineTo(-L/2,r);c.closePath();c.fill();c.stroke();c.fillStyle=P.ac;c.fillRect(L/2,-r*.3,14,r*.6);
  if(R()<.5){c.fillStyle=P.ink;c.beginPath();c.moveTo(-L*.25,r*.4);c.lineTo(L*.1,r*.4);c.lineTo(L*.05,r*.65);c.lineTo(-L*.2,r*.65);c.fill();c.fillStyle=P.li;c.beginPath();c.moveTo(-L*.08,r*.4);c.lineTo(-L*.08,-r*.6);c.lineTo(L*.08,r*.3);c.fill()}else{c.fillStyle="#f6ead0";c.save();c.rotate(.2);c.fillRect(-L*.25,-r*.4,L*.4,r*.8);c.restore();c.fillStyle=hexA(P.ac,.9);c.fillRect(-L*.08,-r*.45,8,r*.9)}c.restore()},
 caracol(){const x=cx(),y=G.ground,s=rr(55,70);shadow(x,y,s*2);c.fillStyle=mix(P.ac,P.li,.3);c.beginPath();c.moveTo(x-s*1.8,y);c.quadraticCurveTo(x-s*2.2,y-s*.9,x-s*1.6,y-s*.8);c.lineTo(x+s,y-s*.3);c.lineTo(x+s*1.4,y);c.fill();
  c.strokeStyle=P.ac;c.lineWidth=3;c.beginPath();c.moveTo(x-s*1.75,y-s*.75);c.lineTo(x-s*2,y-s*1.4);c.moveTo(x-s*1.6,y-s*.8);c.lineTo(x-s*1.6,y-s*1.5);c.stroke();
  c.fillStyle=P.li;c.fillRect(x-s*.9,y-s*2.6,s*1.8,s*2.2);c.fillStyle=P.ink;c.beginPath();c.moveTo(x-s*1.1,y-s*2.5);c.lineTo(x,y-s*3.4);c.lineTo(x+s*1.1,y-s*2.5);c.fill();c.fillStyle=P.ac;for(let i=0;i<2;i++)for(let j=0;j<2;j++){glow(x-s*.45+i*s*.9,y-s*2.05+j*s*.8,18,P.ac,.6);c.fillRect(x-s*.55+i*s*.9,y-s*2.2+j*s*.8,s*.25,s*.3)}c.fillStyle=P.ink;c.fillRect(x-s*.15,y-s*.95,s*.3,s*.55)},
 poco(){const x=cx(),y=G.ground,w=rr(70,90);const g=c.createLinearGradient(0,0,0,y);g.addColorStop(0,hexA(P.li,0));g.addColorStop(1,hexA(P.li,.8));c.fillStyle=g;c.beginPath();c.moveTo(x-w*.8,y-40);c.lineTo(x+w*.8,y-40);c.lineTo(x+w*1.6,0);c.lineTo(x-w*1.6,0);c.fill();
  c.fillStyle=mix(P.gr[1],P.ink,.2);c.fillRect(x-w,y-45,w*2,45);c.strokeStyle=hexA(P.ink,.6);c.lineWidth=2;for(let r=0;r<3;r++)for(let i=0;i<5;i++){c.strokeRect(x-w+i*w*.4+(r%2)*w*.2,y-45+r*15,w*.4,15)}
  c.fillStyle=P.li;c.beginPath();c.ellipse(x,y-45,w,12,0,0,7);c.fill();for(let i=0;i<8;i++){c.fillStyle=hexA(P.li,.9);c.beginPath();c.arc(x+rr(-w,w),rr(40,y-80),rr(2,4),0,7);c.fill()}},
 relogio(){const x=cx(),y=rr(G.hy*.4,G.hy*.7),r=rr(80,105);glow(x,y,r*1.8,P.li,.3);c.strokeStyle=P.ac;c.lineWidth=4;c.beginPath();for(let i=0;i<8;i++)c.arc(x,y-r-14-i*12,6,0,7);c.stroke();
  c.fillStyle=P.ac;c.beginPath();c.arc(x,y,r+10,0,7);c.fill();c.fillStyle=P.li;c.beginPath();c.arc(x,y,r,0,Math.PI*.2);c.bezierCurveTo(x+r*.6,y+r*1.4,x+r*.2,y+r*1.9,x+r*.1,y+r*1.5);c.bezierCurveTo(x,y+r*1.2,x-r*.5,y+r*1.1,x-r*.75,y+r*.7);c.arc(x,y,r,Math.PI*.78,Math.PI*2.2);c.fill();
  c.fillStyle=P.ink;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;c.beginPath();c.arc(x+Math.cos(a)*r*.82,y+Math.sin(a)*r*.82,i%3?2:4,0,7);c.fill()}c.strokeStyle=P.ink;c.lineCap="round";c.lineWidth=5;c.beginPath();const a1=rr(0,6),a2=rr(0,6);c.moveTo(x,y);c.lineTo(x+Math.cos(a1)*r*.5,y+Math.sin(a1)*r*.5);c.moveTo(x,y);c.lineTo(x+Math.cos(a2)*r*.72,y+Math.sin(a2)*r*.72);c.stroke()},
 dente_de_leao(){const x=rr(150,260),y=G.ground,h=rr(240,300),hx=x+30,hy=y-h;c.strokeStyle=mix(P.gr[0],P.li,.3);c.lineWidth=5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-20,y-h*.5,hx,hy);c.stroke();
  glow(hx,hy,90,P.li,.35);c.strokeStyle=hexA(P.li,.85);c.lineWidth=1.2;for(let i=0;i<70;i++){const a=rr(0,Math.PI*2),r=rr(40,55);c.beginPath();c.moveTo(hx,hy);c.lineTo(hx+Math.cos(a)*r,hy+Math.sin(a)*r);c.stroke();c.fillStyle=hexA(P.li,.8);c.beginPath();c.arc(hx+Math.cos(a)*r,hy+Math.sin(a)*r,2.5,0,7);c.fill()}
  for(let i=0;i<18;i++){const sx=hx+rr(30,260),sy=hy+rr(-160,60),a=rr(-.6,.6);c.save();c.translate(sx,sy);c.rotate(a);c.beginPath();c.moveTo(0,0);c.lineTo(0,14);c.stroke();for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(0,0);c.lineTo(k*4,-8);c.stroke()}c.restore()}},
 torre(){const x=cx(),y=G.ground,w=rr(44,60);c.fillStyle=mix(P.ink,P.gr[0],.25);c.beginPath();c.moveTo(x-w,y);c.lineTo(x-w*.55,-10);c.lineTo(x+w*.55,-10);c.lineTo(x+w,y);c.fill();
  c.fillStyle=P.ac;for(let yy=y-40;yy>0;yy-=rr(35,60)){glow(x,yy,22,P.ac,.4);c.fillRect(x-5,yy-9,10,16)}cloud(x,rr(120,220),90,P.dark?P.sky[1]:"#ffffff",.75);cloud(x-40,rr(40,120),70,P.dark?P.sky[1]:"#ffffff",.6);shadow(x,y,w*1.6)},
 cadeira(){const x=cx(),y=G.ground,s=rr(60,80);glow(x,y-s,s*2.4,P.li,.35);c.fillStyle=hexA(P.ink,.35);c.beginPath();c.moveTo(x-s*.5,y);c.lineTo(x+s*.5,y);c.lineTo(x+s*4,y+s*.9);c.lineTo(x+s*3,y+s*.9);c.fill();
  c.fillStyle=P.ink;c.fillRect(x-s*.55,y-s*1.05,s*1.1,s*.14);c.fillRect(x-s*.5,y-s*1.05,s*.1,s*1.05);c.fillRect(x+s*.4,y-s*1.05,s*.1,s*1.05);c.fillRect(x-s*.55,y-s*2.4,s*.12,s*1.4);c.fillRect(x+s*.43,y-s*2.4,s*.12,s*1.4);c.fillRect(x-s*.55,y-s*2.4,s*1.1,s*.12);c.fillRect(x-s*.55,y-s*1.9,s*1.1,s*.08);
  if(R()<.5){c.fillStyle=P.ac;c.beginPath();c.ellipse(x,y-s*1.25,s*.25,s*.1,0,0,7);c.fill()}},
 ponte(){const y=G.hy-rr(90,150),x1=rr(250,340),th=22,col=mix(P.li,P.gr[0],.45);c.fillStyle=col;c.strokeStyle=hexA(P.ink,.6);c.lineWidth=2;
  c.beginPath();c.moveTo(-10,G.ground);c.quadraticCurveTo(-10,y+40,40,y);c.lineTo(x1,y);c.lineTo(x1-8,y+th);c.lineTo(60,y+th);c.quadraticCurveTo(30,y+60,40,G.ground);c.closePath();c.fill();c.stroke();
  for(let i=0;i<3;i++){const px=90+i*((x1-110)/2.5);c.beginPath();c.moveTo(px,y+th);c.lineTo(px+24,y+th);c.lineTo(px+20,G.hy+rr(0,30));c.lineTo(px+4,G.hy+rr(0,30));c.fill();c.stroke()}
  c.fillStyle=col;for(let i=0;i<6;i++){const s2=rr(8,18);c.save();c.translate(x1+rr(10,70),y+rr(20,200));c.rotate(rr(0,3));c.fillRect(-s2/2,-s2/2,s2,s2*.7);c.restore()}
  c.strokeStyle=hexA(P.ink,.8);c.lineWidth=2;c.beginPath();c.moveTo(40,y-14);c.lineTo(x1,y-14);c.stroke();for(let px=50;px<x1;px+=24){c.beginPath();c.moveTo(px,y);c.lineTo(px,y-14);c.stroke()}
  person(x1-24,y,56,P.ink);glow(x1+120,y-40,90,P.li,.5)},
 peixes(){const n=ri(12,24),cx0=cx(),cy0=rr(G.hy*.3,G.hy*.65),R0=rr(70,130);for(let i=0;i<n;i++){const t=i/n*Math.PI*1.6+rr(-.1,.1),x=cx0+Math.cos(t)*R0*rr(.8,1.2),y=cy0+Math.sin(t)*R0*.6*rr(.8,1.2),s=rr(10,22);c.save();c.translate(x,y);c.rotate(t+Math.PI/2);c.fillStyle=i%5===0?P.ac:hexA(P.li,.85);c.beginPath();c.ellipse(0,0,s,s*.45,0,0,7);c.fill();c.beginPath();c.moveTo(-s*.8,0);c.lineTo(-s*1.5,-s*.45);c.lineTo(-s*1.5,s*.45);c.fill();c.restore()}
  if(R()<.6)person(cx0,G.ground,70,P.ink)},
 lanternas(){const n=ri(14,26);for(let i=0;i<n;i++){const t=R(),x=rr(30,W-30),y=G.ground-40-t*(G.ground-80),s=6+t*18;glow(x,y,s*2.4,P.ac,.45);c.fillStyle=mix(P.ac,P.li,.3);c.beginPath();c.moveTo(x-s*.6,y-s);c.lineTo(x+s*.6,y-s);c.lineTo(x+s*.45,y+s);c.lineTo(x-s*.45,y+s);c.fill()}
  person(rr(160,320),G.ground,rr(60,80),P.ink)},
 espelho_pe(){const x=cx(),y=G.ground,w=rr(70,85),h=w*1.7;shadow(x,y,w*1.3);c.save();c.beginPath();c.ellipse(x,y-h-20,w,h*.8,0,0,7);c.clip();const p2=PAL[(PAL.indexOf(P)+6)%PAL.length];const g=c.createLinearGradient(0,y-h*2,0,y);g.addColorStop(0,p2.sky[0]);g.addColorStop(1,p2.sky[2]);c.fillStyle=g;c.fillRect(x-w,y-h*2,w*2,h*2);glow(x,y-h-30,40,p2.li,.9);c.fillStyle=p2.gr[1];c.fillRect(x-w,y-h*.65,w*2,h);if(R()<.5)person(x+10,y-h*.5,40,p2.ink);c.restore();
  c.strokeStyle=P.ac;c.lineWidth=8;c.beginPath();c.ellipse(x,y-h-20,w,h*.8,0,0,7);c.stroke();c.lineWidth=6;c.beginPath();c.moveTo(x-w*.6,y);c.lineTo(x-w*.4,y-h*.45);c.moveTo(x+w*.6,y);c.lineTo(x+w*.4,y-h*.45);c.stroke();if(R()<.7)person(x-w*1.6,y,70,P.ink)},
 coroa(){const x=cx(),y=rr(G.hy*.4,G.hy*.7),w=rr(80,110);glow(x,y,w*2,P.ac,.4);c.fillStyle=P.ac;c.beginPath();c.moveTo(x-w,y+w*.4);c.lineTo(x-w,y-w*.4);c.lineTo(x-w*.5,y);c.lineTo(x,y-w*.6);c.lineTo(x+w*.5,y);c.lineTo(x+w,y-w*.4);c.lineTo(x+w,y+w*.4);c.fill();
  c.fillStyle=P.ink;c.fillRect(x-w,y+w*.25,w*2,6);[-1,0,1].forEach(k=>{c.fillStyle=k?P.li:P.sky[1];c.beginPath();c.arc(x+k*w*.6,y+w*.08,8,0,7);c.fill()});c.strokeStyle=hexA(P.ink,.5);c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+w*.4);c.lineTo(x,G.ground);c.stroke();if(R()<.6)person(x,G.ground,60,P.ink)},
 bolha(){const x=cx(),y=rr(G.hy*.35,G.hy*.6),r=rr(85,115);c.save();c.beginPath();c.arc(x,y,r,0,7);c.clip();c.fillStyle=hexA(P.li,.12);c.fillRect(x-r,y-r,r*2,r*2);c.fillStyle=P.gr[0];c.beginPath();c.ellipse(x,y+r*.35,r*.6,r*.12,0,0,7);c.fill();
  c.strokeStyle=P.ink;c.lineWidth=4;c.beginPath();c.moveTo(x+10,y+r*.33);c.lineTo(x+10,y-r*.2);c.stroke();c.fillStyle=P.gr[1];c.beginPath();c.arc(x+10,y-r*.3,r*.22,0,7);c.fill();person(x-r*.3,y+r*.35,r*.35,P.ink);c.restore();
  const g=c.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.85,"rgba(255,255,255,.12)");g.addColorStop(1,hexA(P.li,.6));c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,7);c.fill();c.strokeStyle=hexA(P.ac,.5);c.lineWidth=2;c.beginPath();c.arc(x,y,r-2,3.6,4.6);c.stroke();
  c.fillStyle="rgba(255,255,255,.8)";c.beginPath();c.ellipse(x-r*.45,y-r*.5,r*.14,r*.07,-.7,0,7);c.fill()},
 pena(){const x=cx(),y=rr(G.hy*.35,G.hy*.7),L=rr(230,280);c.save();c.translate(x,y);c.rotate(rr(-.9,-.4));c.strokeStyle=P.ink;c.lineWidth=3;c.beginPath();c.moveTo(-L/2,0);c.lineTo(L/2,0);c.stroke();
  for(let i=0;i<46;i++){const t=i/46,px=-L*.4+t*L*.85,len=Math.sin(t*Math.PI)*44+6;c.strokeStyle=t<.35?hexA(P.li,.9):mix(P.ac,P.li,t*.6);c.lineWidth=3;c.beginPath();c.moveTo(px,0);c.quadraticCurveTo(px+10,-len*.6,px+16,-len);c.moveTo(px,0);c.quadraticCurveTo(px+10,len*.6,px+16,len);c.stroke()}c.restore();
  for(let i=0;i<4;i++)shadow(x+rr(-50,50),G.ground,10,.2)},
 telescopio(){const x=rr(140,260),y=G.ground;c.strokeStyle=P.ink;c.lineWidth=5;c.beginPath();c.moveTo(x,y-90);c.lineTo(x-40,y);c.moveTo(x,y-90);c.lineTo(x+40,y);c.moveTo(x,y-90);c.lineTo(x,y);c.stroke();
  c.save();c.translate(x,y-95);c.rotate(-.75);c.fillStyle=P.ac;c.fillRect(-40,-14,150,28);c.fillStyle=P.ink;c.fillRect(-60,-9,24,18);c.fillRect(105,-18,12,36);c.restore();person(x-62,y,85,P.ink);
  const tx=x+rr(150,210),ty=rr(70,150);glow(tx,ty,70,P.li,.7);c.fillStyle=P.li;c.beginPath();for(let i=0;i<10;i++){const a=i/10*Math.PI*2-Math.PI/2,rad=i%2?9:22;c.lineTo(tx+Math.cos(a)*rad,ty+Math.sin(a)*rad)}c.fill()},
 ovo(){const x=cx(),y=G.ground,s=rr(65,85);glow(x,y-s*1.4,s*3,P.li,.5);shadow(x,y,s*1.2);c.fillStyle=P.li;c.beginPath();c.moveTo(x-s,y-s*.9);c.bezierCurveTo(x-s,y+s*.25,x+s,y+s*.25,x+s,y-s*.9);c.lineTo(x+s*.7,y-s*1.1);c.lineTo(x+s*.4,y-s*.85);c.lineTo(x+s*.05,y-s*1.15);c.lineTo(x-s*.3,y-s*.85);c.lineTo(x-s*.65,y-s*1.12);c.closePath();c.fill();
  c.fillStyle=hexA(P.li,.9);c.save();c.translate(x+s*.2,y-s*2.2);c.rotate(.5);c.beginPath();c.moveTo(-s*.9,0);c.bezierCurveTo(-s*.9,-s*1.2,s*.9,-s*1.2,s*.9,0);c.lineTo(s*.5,s*.25);c.lineTo(s*.1,-s*.05);c.lineTo(-s*.3,s*.25);c.closePath();c.fill();c.restore();
  for(let i=0;i<6;i++){c.fillStyle=P.ac;c.beginPath();c.arc(x+rr(-s,s),y-s-rr(20,s*3),rr(2,5),0,7);c.fill()}},
 veleiro_nuvem(){const x=cx(),y=rr(G.hy*.45,G.hy*.75),s=rr(55,75);cloud(x,y+s*.4,s*1.4,"#ffffff",P.dark?.55:.9);c.fillStyle=mix(P.ink,P.ac,.3);c.beginPath();c.moveTo(x-s*1.2,y);c.lineTo(x+s*1.2,y);c.lineTo(x+s*.85,y+s*.4);c.lineTo(x-s*.85,y+s*.4);c.fill();
  c.strokeStyle=P.ink;c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-s*2);c.stroke();c.fillStyle=P.li;c.beginPath();c.moveTo(x+4,y-s*1.9);c.quadraticCurveTo(x+s*1.1,y-s,x+4,y-s*.15);c.fill();c.fillStyle=P.ac;c.beginPath();c.moveTo(x-4,y-s*1.6);c.quadraticCurveTo(x-s*.8,y-s*.8,x-4,y-s*.2);c.fill();c.fillStyle=P.ac;c.beginPath();c.moveTo(x,y-s*2);c.lineTo(x+s*.4,y-s*1.9);c.lineTo(x,y-s*1.8);c.fill()},
 girassol(){const x=cx(),y=G.ground,h=rr(230,290),hx=x+rr(-20,20),hy=y-h,r=rr(42,55);c.strokeStyle=mix(P.gr[1],P.ink,.2);c.lineWidth=8;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+25,y-h*.5,hx,hy);c.stroke();
  c.fillStyle=mix(P.gr[0],P.ink,.1);[[.45,-1],[.65,1]].forEach(([t,k])=>{c.beginPath();c.ellipse(x+k*30,y-h*t,34,12,k*.5,0,7);c.fill()});
  glow(hx,hy,r*3,P.ac,.35);c.fillStyle=P.ac;for(let i=0;i<22;i++){const a=i/22*Math.PI*2;c.save();c.translate(hx,hy);c.rotate(a);c.beginPath();c.ellipse(r*1.15,0,r*.6,r*.2,0,0,7);c.fill();c.restore()}c.fillStyle=mix(P.ink,P.gr[1],.3);c.beginPath();c.arc(hx,hy,r*.85,0,7);c.fill();
  c.fillStyle=hexA(P.li,.5);for(let i=0;i<30;i++){const a=i*2.4,d=Math.sqrt(i)*r*.14;c.beginPath();c.arc(hx+Math.cos(a)*d,hy+Math.sin(a)*d,2,0,7);c.fill()}if(R()<.6)person(x-80,y,60,P.ink)},
 trem(){const y=rr(G.hy*.35,G.hy*.6),x0=rr(40,120);c.strokeStyle=hexA(P.li,.6);c.lineWidth=3;c.beginPath();c.moveTo(-10,y+42);c.bezierCurveTo(W*.3,y+20,W*.6,y+90,W+10,y+30);c.stroke();
  for(let i=0;i<4;i++){const x=x0+i*92,yy=y+Math.sin(i*.7)*10;c.fillStyle=i===0?P.ac:mix(P.ac,P.ink,.35);c.fillRect(x,yy,82,36);c.fillStyle=P.li;for(let k=0;k<3;k++){glow(x+14+k*24,yy+15,14,P.li,.5);c.fillRect(x+8+k*24,yy+8,14,12)}c.fillStyle=P.ink;c.beginPath();c.arc(x+18,yy+38,7,0,7);c.arc(x+64,yy+38,7,0,7);c.fill()}
  c.fillStyle=P.ink;c.fillRect(x0+10,y-26,16,26);for(let i=0;i<5;i++)cloud(x0+18-i*20,y-40-i*22,14+i*6,"#ffffff",.5-i*.07)},
 vela(){const x=cx(),y=G.ground,h=rr(120,160),w=rr(34,44);glow(x,y-h-40,180,P.ac,.45);shadow(x,y,w*2);c.fillStyle=P.li;c.fillRect(x-w,y-h,w*2,h);c.fillStyle=hexA(P.ink,.12);c.fillRect(x+w*.4,y-h,w*.6,h);
  c.fillStyle=P.li;c.beginPath();c.moveTo(x-w,y-h);c.quadraticCurveTo(x-w*.6,y-h+30,x-w*.5,y-h+46);c.quadraticCurveTo(x-w*.3,y-h+20,x-w*.1,y-h);c.fill();c.strokeStyle=P.ink;c.lineWidth=3;c.beginPath();c.moveTo(x,y-h);c.lineTo(x,y-h-14);c.stroke();
  c.fillStyle=P.ac;c.beginPath();c.moveTo(x,y-h-70);c.quadraticCurveTo(x+18,y-h-30,x,y-h-12);c.quadraticCurveTo(x-18,y-h-30,x,y-h-70);c.fill();c.fillStyle=P.li;c.beginPath();c.ellipse(x,y-h-26,5,12,0,0,7);c.fill();
  if(R()<.7){c.fillStyle=hexA(P.ink,.85);c.beginPath();const mx=x+rr(60,110),my=y-h-rr(10,60);c.ellipse(mx,my,6,4,0,0,7);c.fill();c.fillStyle=hexA(P.li,.5);c.beginPath();c.ellipse(mx-6,my-6,9,4,-.6,0,7);c.ellipse(mx+6,my-6,9,4,.6,0,7);c.fill()}},
 livro(){const x=cx(),y=G.ground-10,w=rr(110,140);shadow(x,y+8,w*1.2);c.fillStyle=P.li;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x-w*.5,y-26,x-w,y-10);c.lineTo(x-w,y+12);c.quadraticCurveTo(x-w*.5,y-4,x,y+20);c.quadraticCurveTo(x+w*.5,y-4,x+w,y+12);c.lineTo(x+w,y-10);c.quadraticCurveTo(x+w*.5,y-26,x,y);c.fill();
  c.strokeStyle=hexA(P.ink,.3);c.lineWidth=1;for(let i=1;i<6;i++){c.beginPath();c.moveTo(x-w*.85,y-6+i*2);c.quadraticCurveTo(x-w*.45,y-20+i*3,x-8,y-4+i*3);c.stroke();c.beginPath();c.moveTo(x+w*.85,y-6+i*2);c.quadraticCurveTo(x+w*.45,y-20+i*3,x+8,y-4+i*3);c.stroke()}
  const kind=ri(0,1);if(kind===0){c.strokeStyle=P.ink;c.lineCap="round";(function br(x0,y0,a,l,wd,d){const x1=x0+Math.cos(a)*l,y1=y0+Math.sin(a)*l;c.lineWidth=wd;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();if(!d){c.fillStyle=P.ac;c.beginPath();c.arc(x1,y1,5,0,7);c.fill();return}br(x1,y1,a-.45,l*.75,wd*.7,d-1);br(x1,y1,a+.45,l*.75,wd*.7,d-1)})(x,y-4,-Math.PI/2,70,9,5)}
  else{for(let i=0;i<14;i++){const t=i/14,px=x+Math.sin(i*1.3)*40*t,py=y-20-t*300;c.fillStyle=hexA(P.li,1-t*.6);c.save();c.translate(px,py);c.rotate(rr(-1,1));c.fillRect(-9,-6,18,12);c.restore()}glow(x,y-30,90,P.li,.5)}},
 raposa(){const x=cx(),y=G.ground,s=rr(55,70),d=R()<.5?1:-1;const mx=x+d*rr(70,130),my=rr(70,G.hy*.4);glow(mx,my,90,P.li,.5);c.fillStyle=P.li;c.beginPath();c.arc(mx,my,30,0,7);c.fill();
  c.save();c.translate(x,y);c.scale(d,1);c.fillStyle=P.ink;c.beginPath();c.ellipse(0,-s*.55,s*.42,s*.6,0,0,7);c.fill();c.beginPath();c.moveTo(s*.05,-s*1.0);c.lineTo(s*.55,-s*1.35);c.lineTo(s*.25,-s*.85);c.fill();c.beginPath();c.arc(s*.08,-s*1.15,s*.24,0,7);c.fill();
  c.beginPath();c.moveTo(-s*.05,-s*1.3);c.lineTo(0,-s*1.62);c.lineTo(s*.12,-s*1.33);c.moveTo(s*.15,-s*1.3);c.lineTo(s*.28,-s*1.58);c.lineTo(s*.32,-s*1.25);c.fill();
  c.beginPath();c.moveTo(-s*.3,-s*.15);c.bezierCurveTo(-s*1.3,-s*.1,-s*1.4,-s*.9,-s*.9,-s*.95);c.bezierCurveTo(-s*1.0,-s*.6,-s*.8,-s*.3,-s*.2,-s*.35);c.fill();c.fillStyle=hexA(P.li,.8);c.beginPath();c.arc(-s*.95,-s*.9,s*.08,0,7);c.fill();c.restore()},
 polvo(){const x=cx(),y=G.hy+rr(10,40);c.strokeStyle=mix(P.ac,P.ink,.25);c.lineCap="round";for(let i=0;i<7;i++){const bx=x+(i-3)*28,ph=rr(0,6),L=rr(160,260),k=(i-3)*.35;c.lineWidth=16;c.beginPath();c.moveTo(bx,y);for(let t=0;t<=1;t+=.05){c.lineTo(bx+Math.sin(t*5+ph)*30*t+k*t*L*.5,y-t*L);c.lineWidth=16*(1-t*.8)}c.stroke()}
  c.fillStyle=hexA(P.li,.4);for(let i=0;i<20;i++){c.beginPath();c.arc(x+rr(-120,120),y+rr(-10,30),rr(2,6),0,7);c.fill()}if(R()<.7){const bx=x+rr(-60,60),by=y-rr(170,230);c.fillStyle=P.li;c.beginPath();c.moveTo(bx-30,by);c.lineTo(bx+30,by);c.lineTo(bx+20,by+14);c.lineTo(bx-20,by+14);c.fill();c.fillRect(bx-1,by-36,2,36)}},
 cogumelos(){const n=ri(2,4);for(let i=0;i<n;i++){const x=i===0?cx():rr(60,420),y=G.ground+rr(-6,14),h=i===0?rr(150,200):rr(50,110),r=h*.55;c.fillStyle=P.li;c.fillRect(x-r*.18,y-h,r*.36,h);
   c.fillStyle=i%2?P.ac:mix(P.ac,P.ink,.25);c.beginPath();c.ellipse(x,y-h,r,r*.55,0,Math.PI,0);c.quadraticCurveTo(x,y-h+r*.25,x-r,y-h);c.fill();c.fillStyle=hexA(P.li,.85);for(let k=0;k<5;k++){c.beginPath();c.arc(x+rr(-r*.7,r*.7),y-h-rr(5,r*.4),rr(3,8),0,7);c.fill()}
   if(i===0){c.fillStyle=P.ink;c.beginPath();c.arc(x,y-14,10,Math.PI,0);c.lineTo(x+10,y);c.lineTo(x-10,y);c.fill();glow(x+r*.08,y-h*.5,30,P.ac,.7);c.fillStyle=P.ac;c.fillRect(x-6,y-h*.55,12,12)}}},
 lampada(){const x=cx(),y=rr(G.hy*.4,G.hy*.62),r=rr(70,90);glow(x,y,r*2.6,P.li,.45);c.strokeStyle=P.ink;c.lineWidth=2;c.beginPath();c.moveTo(x,0);c.lineTo(x,y-r*1.2);c.stroke();c.fillStyle=mix(P.ink,P.li,.4);c.fillRect(x-r*.38,y+r*.75,r*.76,r*.5);
  c.fillStyle=hexA(P.li,.25);c.strokeStyle=hexA(P.li,.9);c.lineWidth=3;c.beginPath();c.arc(x,y,r,Math.PI*.8,Math.PI*2.2);c.lineTo(x+r*.38,y+r*.75);c.lineTo(x-r*.38,y+r*.75);c.closePath();c.fill();c.stroke();
  c.save();c.clip();c.fillStyle=P.gr[0];c.beginPath();c.ellipse(x,y+r*.6,r*.6,r*.18,0,0,7);c.fill();c.strokeStyle=P.ink;c.lineWidth=4;c.beginPath();c.moveTo(x,y+r*.55);c.lineTo(x,y);c.stroke();c.fillStyle=P.gr[1];c.beginPath();c.arc(x,y-r*.15,r*.32,0,7);c.fill();c.restore()},
 bicicleta(){const fly=R()<.5,x=cx(),y=fly?rr(G.hy*.35,G.hy*.6):G.ground,r=rr(32,40);if(fly){glow(x+100,y-80,90,P.li,.6);c.fillStyle=P.li;c.beginPath();c.arc(x+100,y-80,50,0,7);c.fill()}else shadow(x,y,r*3);
  c.strokeStyle=P.ink;c.lineWidth=4;c.beginPath();c.arc(x-r*1.4,y-r,r,0,7);c.arc(x+r*1.4+r,y-r,r,Math.PI,Math.PI*3);c.stroke();c.beginPath();c.moveTo(x-r*1.4,y-r);c.lineTo(x-r*.2,y-r*2.3);c.lineTo(x+r*1.2,y-r*2.3);c.lineTo(x+r*1.4,y-r);c.lineTo(x,y-r);c.lineTo(x-r*1.4,y-r);c.moveTo(x,y-r);c.lineTo(x-r*.2,y-r*2.3);c.moveTo(x+r*1.2,y-r*2.3);c.lineTo(x+r*1.1,y-r*2.9);c.stroke();
  person(x-r*.1,y-r*2.2,r*2.4,P.ink);if(R()<.6){c.fillStyle=P.ac;c.beginPath();c.moveTo(x+r*1.3,y-r*2.6);c.lineTo(x+r*2.4,y-r*2.4);c.lineTo(x+r*1.3,y-r*2.2);c.fill()}},
 arvore_invertida(){const x=cx(),y=rr(G.hy*.25,G.hy*.45);c.fillStyle=mix(P.gr[1],P.ink,.2);c.beginPath();c.ellipse(x,y,95,26,0,0,7);c.fill();c.strokeStyle=P.ink;c.lineCap="round";
  (function br(x0,y0,a,l,w,d){const x1=x0+Math.cos(a)*l,y1=y0+Math.sin(a)*l;c.lineWidth=w;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.stroke();if(!d)return;br(x1,y1,a-rr(.3,.6),l*.75,w*.7,d-1);br(x1,y1,a+rr(.3,.6),l*.75,w*.7,d-1)})(x,y+20,Math.PI/2,60,12,6);
  c.fillStyle=mix(P.gr[0],P.li,.2);c.beginPath();for(let i=0;i<9;i++)c.arc(x+(i-4)*22,y-30-Math.sin(i/8*Math.PI)*60,34,0,7);c.fill();for(let i=0;i<6;i++){c.fillStyle=hexA(P.ac,.9);c.beginPath();c.arc(x+rr(-120,120),y+rr(80,260),3,0,7);c.fill()}},
 piramide(){const x=cx(),y=G.ground,w=rr(140,180),h=w*.9;shadow(x+40,y,w*1.3,.4);c.fillStyle=mix(P.gr[0],P.li,.35);c.beginPath();c.moveTo(x-w,y);c.lineTo(x,y-h);c.lineTo(x+w,y);c.fill();c.fillStyle=hexA(P.ink,.3);c.beginPath();c.moveTo(x,y-h);c.lineTo(x+w,y);c.lineTo(x+w*.25,y);c.fill();
  const g=c.createLinearGradient(0,0,0,y-h);g.addColorStop(0,hexA(P.li,0));g.addColorStop(1,hexA(P.li,.7));c.fillStyle=g;c.beginPath();c.moveTo(x-6,y-h);c.lineTo(x+6,y-h);c.lineTo(x+60,0);c.lineTo(x-60,0);c.fill();glow(x,y-h,40,P.li,.9);c.fillStyle=P.ink;c.fillRect(x-12,y-30,24,30);if(R()<.6)person(x-w-30,y,60,P.ink)},
 cabeca(){const x=cx(),y=G.ground,h=rr(220,260),w=h*.42;shadow(x,y,w*1.4);c.fillStyle=mix(P.ink,P.gr[0],.35);c.beginPath();c.moveTo(x-w*.7,y);c.lineTo(x-w*.85,y-h*.55);c.quadraticCurveTo(x-w*.8,y-h,x,y-h);c.quadraticCurveTo(x+w*.6,y-h,x+w*.62,y-h*.7);c.lineTo(x+w*.9,y-h*.5);c.lineTo(x+w*.6,y-h*.4);c.lineTo(x+w*.7,y-h*.22);c.lineTo(x+w*.5,y-h*.15);c.lineTo(x+w*.55,y);c.fill();
  c.fillStyle=hexA(P.ink,.5);c.fillRect(x-w*.5,y-h*.68,w*.9,10);c.fillRect(x+w*.1,y-h*.3,w*.5,6);if(R()<.6){glow(x-w*.1,y-h*.6,30,P.ac,.9)}c.fillStyle=P.gr[0];for(let i=0;i<5;i++){c.beginPath();c.arc(x+rr(-w*.6,w*.4),y-h-rr(0,10),rr(8,16),0,7);c.fill()}if(R()<.6)person(x+w*1.4,y,50,P.ink)},
 ninho(){const x=cx(),y=rr(G.hy*.5,G.hy*.8);c.strokeStyle=P.ink;c.lineWidth=12;c.lineCap="round";c.beginPath();c.moveTo(-20,y+40);c.quadraticCurveTo(x-100,y+20,x+140,y+30);c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(x+60,y+28);c.lineTo(x+120,y-30);c.stroke();
  c.strokeStyle=mix(P.gr[1],P.ac,.3);c.lineWidth=2;for(let i=0;i<60;i++){const a=rr(Math.PI*.05,Math.PI*.95);c.beginPath();c.arc(x,y-10,rr(44,62),a,a+rr(.4,1));c.stroke()}
  glow(x,y-26,60,P.ac,.6);c.fillStyle=P.ac;c.beginPath();c.ellipse(x,y-28,18,24,0,0,7);c.fill();c.fillStyle=P.li;c.beginPath();c.ellipse(x-24,y-20,14,18,-.3,0,7);c.fill();c.fillStyle=hexA(P.li,.8);c.beginPath();c.ellipse(x-5,y-36,4,8,-.4,0,7);c.fill()},
 avioes(){const n=ri(6,12);for(let i=0;i<n;i++){const x=rr(40,W-40),y=rr(60,G.ground-40),s=rr(14,34);c.save();c.translate(x,y);c.rotate(rr(-.5,.3));c.fillStyle=i%4===0?P.ac:P.li;c.beginPath();c.moveTo(s*1.4,0);c.lineTo(-s,-s*.5);c.lineTo(-s*.4,0);c.lineTo(-s,s*.45);c.fill();c.fillStyle=hexA(P.ink,.25);c.beginPath();c.moveTo(s*1.4,0);c.lineTo(-s*.4,0);c.lineTo(-s,s*.45);c.fill();c.restore();
   c.strokeStyle=hexA(P.li,.3);c.setLineDash([4,6]);c.lineWidth=1.5;c.beginPath();c.moveTo(x-s,y);c.quadraticCurveTo(x-s*4,y+rr(-30,30),x-s*7,y+rr(-20,20));c.stroke();c.setLineDash([])}if(R()<.7)person(rr(120,360),G.ground,70,P.ink)},
 envelope(){const x=cx(),y=rr(G.hy*.4,G.hy*.7),w=rr(110,140),h=w*.65;glow(x,y,w*1.8,P.li,.35);c.save();c.translate(x,y);c.rotate(rr(-.25,.25));c.fillStyle="#f6ead0";c.fillRect(-w,-h,w*2,h*2);c.fillStyle=hexA(P.ink,.12);c.beginPath();c.moveTo(-w,h);c.lineTo(0,0);c.lineTo(w,h);c.fill();
  c.strokeStyle=hexA(P.ink,.35);c.lineWidth=2;c.beginPath();c.moveTo(-w,-h);c.lineTo(0,h*.2);c.lineTo(w,-h);c.stroke();c.fillStyle=P.ac;c.beginPath();c.arc(0,h*.2,16,0,7);c.fill();c.restore();
  for(let i=0;i<3;i++){c.strokeStyle=hexA(P.li,.6);c.lineWidth=2;c.beginPath();c.moveTo(x-w-20-i*18,y+i*16);c.lineTo(x-w-60-i*30,y+i*16);c.stroke()}},
 arco(){const x=cx(),y=G.ground,w=rr(80,110),h=rr(170,220);c.fillStyle=hexA(P.li,.25);c.beginPath();c.moveTo(x-w,y);c.lineTo(x-w,y-h);c.arc(x,y-h,w,Math.PI,0);c.lineTo(x+w,y);c.fill();const p2=PAL[(PAL.indexOf(P)+4)%PAL.length];c.save();c.beginPath();c.moveTo(x-w+14,y);c.lineTo(x-w+14,y-h);c.arc(x,y-h,w-14,Math.PI,0);c.lineTo(x+w-14,y);c.clip();
  const g=c.createLinearGradient(0,y-h*1.5,0,y);g.addColorStop(0,p2.sky[0]);g.addColorStop(1,p2.sky[2]);c.fillStyle=g;c.fillRect(x-w,y-h*1.6,w*2,h*1.6);glow(x,y-h*.7,60,p2.li,.9);c.restore();
  c.strokeStyle=mix(P.ink,P.gr[0],.2);c.lineWidth=16;c.beginPath();c.moveTo(x-w,y);c.lineTo(x-w,y-h);c.arc(x,y-h,w,Math.PI,0);c.lineTo(x+w,y);c.stroke();c.fillStyle=hexA(P.li,.3);c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.lineTo(x+w*1.5,H);c.lineTo(x-w*1.5,H);c.fill();person(x,y,60,P.ink)},
 coruja(){const x=cx(),y=rr(G.hy*.45,G.hy*.7),s=rr(46,58);c.strokeStyle=P.ink;c.lineWidth=12;c.lineCap="round";c.beginPath();c.moveTo(-20,y+s*1.1);c.quadraticCurveTo(x,y+s*1.3,W+20,y+s*.9);c.stroke();
  c.fillStyle=mix(P.ink,P.gr[0],.3);c.beginPath();c.ellipse(x,y,s*.85,s*1.1,0,0,7);c.fill();c.beginPath();c.moveTo(x-s*.7,y-s*.7);c.lineTo(x-s*.55,y-s*1.25);c.lineTo(x-s*.2,y-s*.9);c.lineTo(x+s*.2,y-s*.9);c.lineTo(x+s*.55,y-s*1.25);c.lineTo(x+s*.7,y-s*.7);c.fill();
  [-1,1].forEach(k=>{c.fillStyle=P.li;c.beginPath();c.arc(x+k*s*.35,y-s*.45,s*.3,0,7);c.fill();c.fillStyle=P.ac;c.beginPath();c.arc(x+k*s*.35,y-s*.45,s*.17,0,7);c.fill();c.fillStyle=P.ink;c.beginPath();c.arc(x+k*s*.35,y-s*.45,s*.08,0,7);c.fill()});
  c.fillStyle=P.ac;c.beginPath();c.moveTo(x-6,y-s*.25);c.lineTo(x+6,y-s*.25);c.lineTo(x,y-s*.05);c.fill();c.strokeStyle=hexA(P.li,.25);c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.arc(x,y+s*.2+i*12,s*.35,.3,Math.PI-.3);c.stroke()}}
};
const FLOAT=new Set(["trem","lampada","arvore_invertida","envelope","avioes","coruja","ninho","lua","balao","baleia","chave","ilha","janela","olho","gaiola","mascara","agua_viva","cometa","montanha","relogio","peixes","coroa","bolha","pena","veleiro_nuvem","ampulheta","barco","lanternas"]);
const KEYS=Object.keys(S);

/* ---------- extras ---------- */
const X={
 passaros(){c.strokeStyle=P.ink;c.lineWidth=2;const bx=rr(40,W-120),by=rr(40,G.hy*.5);for(let i=0;i<ri(4,9);i++){const x=bx+rr(0,140),y=by+rr(0,80),s=rr(5,11);c.beginPath();c.moveTo(x-s,y-s*.4);c.quadraticCurveTo(x-s*.4,y-s*.7,x,y);c.quadraticCurveTo(x+s*.4,y-s*.7,x+s,y-s*.4);c.stroke()}},
 vagalumes(){for(let i=0;i<ri(14,30);i++){const x=rr(0,W),y=rr(G.hy*.4,H);glow(x,y,8,P.ac,.7);c.fillStyle=P.li;c.beginPath();c.arc(x,y,1.6,0,7);c.fill()}},
 petalas(){c.fillStyle=hexA(P.ac,.8);for(let i=0;i<ri(12,24);i++){c.beginPath();c.ellipse(rr(0,W),rr(0,H),rr(3,6),rr(1.5,3),rr(0,3),0,7);c.fill()}},
 ilhas(){for(let i=0;i<ri(1,3);i++){const x=rr(30,W-30),y=rr(50,G.hy*.6),w=rr(16,32);c.fillStyle=hexA(P.ink,.5);c.beginPath();c.moveTo(x-w,y);c.lineTo(x+w,y);c.lineTo(x+w*.3,y+w*.7);c.lineTo(x,y+w*1.1);c.lineTo(x-w*.4,y+w*.6);c.fill();c.fillStyle=hexA(P.gr[0],.9);c.beginPath();c.ellipse(x,y,w,4,0,0,7);c.fill();c.fillStyle=hexA(P.ink,.6);c.fillRect(x-1,y-w*.7,2,w*.7);c.beginPath();c.arc(x,y-w*.8,w*.3,0,7);c.fill()}},
 pessoa(){if(G.type==="vazio")return;person(rr(40,110)*(R()<.5?1:-1)+(R()<.5?0:W),G.ground+rr(0,20),rr(40,60),P.ink,{balloon:R()<.4?P.ac:null})},
 arcoiris(){c.save();c.globalAlpha=.25;const x=rr(60,W-60),y=G.hy,r=rr(180,280);["#e74c3c","#f39c12","#f1c40f","#2ecc71","#3498db","#9b59b6"].forEach((col,i)=>{c.strokeStyle=col;c.lineWidth=9;c.beginPath();c.arc(x,y,r-i*9,Math.PI,0);c.stroke()});c.restore()},
 espiral(){c.strokeStyle=hexA(P.li,.35);c.lineWidth=2;const x=rr(60,W-60),y=rr(60,G.hy*.6);c.beginPath();for(let t=0;t<18;t+=.15){c.lineTo(x+Math.cos(t)*t*3.5,y+Math.sin(t)*t*3.5)}c.stroke()},
 borboletas(){for(let i=0;i<ri(2,5);i++){const x=rr(40,W-40),y=rr(60,G.hy),s=rr(6,11);c.fillStyle=i%2?P.ac:P.li;c.beginPath();c.ellipse(x-s*.6,y,s*.7,s,-.5,0,7);c.ellipse(x+s*.6,y,s*.7,s,.5,0,7);c.fill()}}
};

/* ---------- textura e moldura ---------- */
let grain=null;
function makeGrain(){grain=document.createElement("canvas");grain.width=grain.height=160;const g=grain.getContext("2d"),d=g.createImageData(160,160),r=rng(99);for(let i=0;i<d.data.length;i+=4){const v=Math.floor(r()*255);d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=26}g.putImageData(d,0,0)}
function finish(){
  c.save();c.globalCompositeOperation="overlay";c.fillStyle=c.createPattern(grain,"repeat");c.fillRect(0,0,W,H);c.restore();
  for(let i=0;i<10;i++){c.fillStyle=hexA(i%2?P.li:P.ink,.035);c.beginPath();c.arc(rr(0,W),rr(0,H),rr(60,200),0,7);c.fill()}
  const v=c.createRadialGradient(W/2,H*.45,H*.2,W/2,H/2,H*.75);v.addColorStop(0,"rgba(0,0,0,0)");v.addColorStop(1,"rgba(0,0,0,.42)");c.fillStyle=v;c.fillRect(0,0,W,H)}

const GKEYS=Object.keys(GROUNDS);
let ORDER=null;function plan(id){if(!ORDER){const r=rng(0xC0FFEE);ORDER=KEYS.slice();for(let i=ORDER.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[ORDER[i],ORDER[j]]=[ORDER[j],ORDER[i]]}}return ORDER[id%ORDER.length]}
function draw(canvas,id){
  canvas.width=W;canvas.height=H;c=canvas.getContext("2d");R=rng(id*2654435761+7);
  const subj=plan(id);P=PAL[(id*7+Math.floor(id/KEYS.length)*5)%PAL.length];
  let gt=pick(GKEYS);if(!FLOAT.has(subj)&&gt==="vazio")gt="colinas";if(subj==="barco"&&R()<.6)gt="mar";
  G={type:gt,hy:gt==="vazio"?H*.72:rr(H*.6,H*.72)};G.ground=gt==="vazio"?H*.74:G.hy+rr(40,90);if(G.ground>H-20)G.ground=H-20;
  sky();GROUNDS[gt]();
  if(R()<(id>=KEYS.length*2?.95:.6)){const xs=Object.keys(X);X[pick(xs)]()}
  const pass=Math.floor(id/KEYS.length);c.save();if(pass%2===1){c.translate(W,0);c.scale(-1,1)}S[subj]();c.restore();c.lineCap="butt";
  if(R()<.35){const xs=["passaros","vagalumes","petalas","borboletas","espiral"];X[pick(xs)]()}
  finish();
}
const cache=new Map();
function url(id){if(cache.has(id))return cache.get(id);if(!grain)makeGrain();const cv=document.createElement("canvas");try{draw(cv,id)}catch(e){console.error("carta",id,e)}const u=cv.toDataURL("image/jpeg",.86);cache.set(id,u);return u}
window.DevaneioArt={url,W,H,count:KEYS.length,subject:plan};
})();
