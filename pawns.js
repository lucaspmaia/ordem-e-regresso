/* Devaneio — bonecos dos jogadores (SVG) */
(function(){
const PAWNS=[
 {k:"coelho",nome:"Coelho",cor:"#f2b544"},
 {k:"raposa",nome:"Raposa",cor:"#ea7a4f"},
 {k:"sapo",nome:"Sapo",cor:"#6cc98a"},
 {k:"coruja",nome:"Coruja",cor:"#b58a5e"},
 {k:"gato",nome:"Gato",cor:"#8fa3c9"},
 {k:"urso",nome:"Urso",cor:"#c9724f"},
 {k:"pinguim",nome:"Pinguim",cor:"#5aa6d6"},
 {k:"polvo",nome:"Polvo",cor:"#e07bb5"},
 {k:"fantasma",nome:"Fantasma",cor:"#d9dcf2"},
 {k:"robo",nome:"Robô",cor:"#9ad0c2"}
];
const BODY="M9 49 C9 37 11 31 15 28 C11.5 25.5 10 21.5 10 17.5 C10 11 14.5 7 20 7 C25.5 7 30 11 30 17.5 C30 21.5 28.5 25.5 25 28 C29 31 31 37 31 49 Z";
function shade(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16&255,g=n>>8&255,b=n&255;r=Math.round(r*k);g=Math.round(g*k);b=Math.round(b*k);return`rgb(${Math.min(255,r)},${Math.min(255,g)},${Math.min(255,b)})`}
function face(extra){return `<circle cx="16.3" cy="17" r="1.9" fill="#1b1a24"/><circle cx="23.7" cy="17" r="1.9" fill="#1b1a24"/><circle cx="16.9" cy="16.3" r=".6" fill="#fff"/><circle cx="24.3" cy="16.3" r=".6" fill="#fff"/><path d="M18 21.2 Q20 23 22 21.2" stroke="#1b1a24" stroke-width="1.2" fill="none" stroke-linecap="round"/><circle cx="13.6" cy="20.2" r="1.6" fill="#ff8a8a" opacity=".45"/><circle cx="26.4" cy="20.2" r="1.6" fill="#ff8a8a" opacity=".45"/>${extra||""}`}
function svg(k,size,opt){opt=opt||{};const p=PAWNS.find(x=>x.k===k)||PAWNS[0],c=p.cor,d=shade(c,.72),l=shade(c,1.18),id="g"+k+Math.random().toString(36).slice(2,7);
  let back="",body=`<path d="${BODY}" fill="url(#${id})" stroke="${d}" stroke-width="1.3"/>`,front=face();
  switch(k){
   case"coelho":back=`<ellipse cx="15" cy="5" rx="3.2" ry="8" fill="${c}" stroke="${d}" stroke-width="1.2" transform="rotate(-10 15 5)"/><ellipse cx="25" cy="5" rx="3.2" ry="8" fill="${c}" stroke="${d}" stroke-width="1.2" transform="rotate(10 25 5)"/><ellipse cx="15" cy="5.5" rx="1.4" ry="5" fill="#ffb3b3" transform="rotate(-10 15 5)"/><ellipse cx="25" cy="5.5" rx="1.4" ry="5" fill="#ffb3b3" transform="rotate(10 25 5)"/>`;break;
   case"gato":back=`<path d="M11 13 L12 4 L18 9 Z M29 13 L28 4 L22 9 Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/><path d="M30 44 C38 42 38 32 33 30" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`;front=face(`<path d="M12 19 L7 18 M12 21 L7 22 M28 19 L33 18 M28 21 L33 22" stroke="${d}" stroke-width=".7"/>`);break;
   case"raposa":back=`<path d="M10.5 14 L10 2.5 L18.5 8.5 Z M29.5 14 L30 2.5 L21.5 8.5 Z" fill="${c}" stroke="${d}" stroke-width="1.2" stroke-linejoin="round"/><path d="M30 46 C41 44 41 30 33 27 C35 33 33 38 30 40 Z" fill="${c}" stroke="${d}" stroke-width="1.2"/><path d="M36 30 C38.5 32 38.5 34 37.5 36 C36 33 35 31 33.5 29 Z" fill="#fff"/>`;front=`<path d="M13 19 Q20 28 27 19 Q24 24 20 24 Q16 24 13 19 Z" fill="#fff"/>`+face();break;
   case"urso":back=`<circle cx="12" cy="9" r="4.2" fill="${c}" stroke="${d}" stroke-width="1.2"/><circle cx="28" cy="9" r="4.2" fill="${c}" stroke="${d}" stroke-width="1.2"/><circle cx="12" cy="9" r="2" fill="${d}"/><circle cx="28" cy="9" r="2" fill="${d}"/>`;front=`<ellipse cx="20" cy="21" rx="4.2" ry="3.2" fill="${l}"/>`+face();break;
   case"coruja":back=`<path d="M10.5 12 L11 4 L16 9 Z M29.5 12 L29 4 L24 9 Z" fill="${d}"/>`;front=`<circle cx="16" cy="17" r="4.3" fill="#fff" stroke="${d}"/><circle cx="24" cy="17" r="4.3" fill="#fff" stroke="${d}"/><circle cx="16" cy="17" r="2.2" fill="#1b1a24"/><circle cx="24" cy="17" r="2.2" fill="#1b1a24"/><path d="M18.5 21 L21.5 21 L20 24 Z" fill="#f2b544"/><path d="M14 33 Q20 29 26 33 M13 38 Q20 34 27 38" stroke="${l}" stroke-width="1.4" fill="none"/>`;break;
   case"sapo":back=`<circle cx="14" cy="10" r="5" fill="${c}" stroke="${d}" stroke-width="1.2"/><circle cx="26" cy="10" r="5" fill="${c}" stroke="${d}" stroke-width="1.2"/>`;front=`<circle cx="14" cy="10" r="3" fill="#fff"/><circle cx="26" cy="10" r="3" fill="#fff"/><circle cx="14.4" cy="10.4" r="1.7" fill="#1b1a24"/><circle cx="25.6" cy="10.4" r="1.7" fill="#1b1a24"/><path d="M13 20 Q20 26 27 20" stroke="#1b1a24" stroke-width="1.3" fill="none" stroke-linecap="round"/><circle cx="13" cy="18" r="1.6" fill="#ff8a8a" opacity=".45"/><circle cx="27" cy="18" r="1.6" fill="#ff8a8a" opacity=".45"/>`;break;
   case"pinguim":front=`<path d="M14.5 27 C12 33 12 42 13 49 L27 49 C28 42 28 33 25.5 27 C23 29 17 29 14.5 27 Z" fill="#fff"/><path d="M13.5 20 C13 13 27 13 26.5 20 C25 24 15 24 13.5 20 Z" fill="#fff"/>`+face().replace(/<path d="M18 21.2[^>]*>/,`<path d="M18.3 20.5 L21.7 20.5 L20 23 Z" fill="#f2b544"/>`);break;
   case"polvo":body=`<path d="M8 22 C8 9 32 9 32 22 C32 27 30 29 30 29 L33 46 Q31 48 29 45 L26 33 L24 47 Q21.5 49 21 46 L20 34 L19 46 Q18.5 49 16 47 L14 33 L11 45 Q9 48 7 46 L10 29 C10 29 8 27 8 22 Z" fill="url(#${id})" stroke="${d}" stroke-width="1.3" stroke-linejoin="round"/>`;front=`<g transform="translate(0,2)">${face()}</g><circle cx="15" cy="12" r="1.6" fill="${l}"/><circle cx="25" cy="11" r="1.1" fill="${l}"/>`;break;
   case"fantasma":body=`<path d="M8 49 L8 20 C8 10 14 6 20 6 C26 6 32 10 32 20 L32 49 Q29 45 26.5 49 Q23.5 45 20 49 Q16.5 45 13.5 49 Q11 45 8 49 Z" fill="url(#${id})" stroke="${d}" stroke-width="1.3"/>`;front=face().replace(/<path d="M18 21.2[^>]*>/,`<ellipse cx="20" cy="22.5" rx="1.8" ry="2.3" fill="#1b1a24"/>`);break;
   case"robo":back=`<line x1="20" y1="6" x2="20" y2="1.5" stroke="${d}" stroke-width="1.4"/><circle cx="20" cy="1.8" r="1.8" fill="#ff6b6b"/>`;body=`<rect x="10" y="6" width="20" height="18" rx="4" fill="url(#${id})" stroke="${d}" stroke-width="1.3"/><rect x="17" y="24" width="6" height="3" fill="${d}"/><path d="M11 49 L12 27 L28 27 L29 49 Z" fill="url(#${id})" stroke="${d}" stroke-width="1.3"/><circle cx="20" cy="36" r="2.6" fill="${l}" stroke="${d}"/>`;front=`<rect x="13" y="12" width="14" height="7" rx="2" fill="#1b1a24"/><circle cx="16.5" cy="15.5" r="1.6" fill="#7cf"/><circle cx="23.5" cy="15.5" r="1.6" fill="#7cf"/>`;break;
  }
  const s=size||40;
  return `<svg class="pawn-svg${opt.cls?" "+opt.cls:""}" width="${s}" height="${Math.round(s*1.425)}" viewBox="0 -5 40 57" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${d}"/></linearGradient></defs><ellipse cx="20" cy="50" rx="11" ry="2.2" fill="rgba(0,0,0,.28)"/>${back}${body}${front}<path d="M14 12 Q16 9.5 19 9" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`}
window.DevaneioPawns={list:PAWNS,svg,color:k=>(PAWNS.find(x=>x.k===k)||PAWNS[0]).cor,name:k=>(PAWNS.find(x=>x.k===k)||PAWNS[0]).nome};
})();
