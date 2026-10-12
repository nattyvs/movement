'use strict';
/* Animated demo figure: an original flat-illustrated woman, posed by joint angles.
   Angles: 0 = up, 90 = the way she faces (right), 180 = down, 270 = behind her. */
const FIG = (()=>{
  const L = {torso:52, neck:8, head:12, upper:26, fore:24, thigh:40, shin:39, foot:15};
  const rad = a => (a-90)*Math.PI/180;
  const step = (p, a, len) => [p[0] + Math.cos(rad(a))*len, p[1] + Math.sin(rad(a))*len];
  function joints(P){
    const hip = [0,0], sh = step(hip, P.torso, L.torso);
    const hAng = P.torso + (P.neck||0);
    const nk = step(sh, hAng, L.neck*.6), hd = step(nk, hAng, L.head*.95);
    const leg = (t,s,f) => { const k = step(hip,t,L.thigh), a = step(k,s,L.shin); return {k, a, toe: step(a,f,L.foot), f}; };
    const arm = (u,f) => { const e = step(sh,u,L.upper), h = step(e,f,L.fore); return {e,h}; };
    return {hip, sh, nk, hd, hAng,
      near:leg(P.thigh,P.shin,P.foot??(P.shin-90)), far:leg(P.thigh2??P.thigh,P.shin2??P.shin,P.foot2??P.foot??((P.shin2??P.shin)-90)),
      nearArm:arm(P.upper,P.fore), farArm:arm(P.upper2??P.upper,P.fore2??P.fore)};
  }
  const lerp = (a,b,t) => a+(b-a)*t;
  function norm(P){
    const o = Object.assign({neck:0}, P);
    if(o.foot===undefined) o.foot = o.shin - 90;
    if(o.thigh2===undefined) o.thigh2 = o.thigh;
    if(o.shin2===undefined) o.shin2 = o.shin;
    if(o.foot2===undefined) o.foot2 = (P.shin2===undefined ? o.foot : o.shin2 - 90);
    if(o.upper2===undefined) o.upper2 = o.upper;
    if(o.fore2===undefined) o.fore2 = o.fore;
    return o;
  }
  // shortest way round between two angles, so a joint never spins the long way
  const angLerp = (a,b,t) => { let d = ((b - a) % 360 + 540) % 360 - 180; return a + d*t; };
  function mix(A,B,t){ const o = {}; for(const k of new Set([...Object.keys(A),...Object.keys(B)])){ const a = A[k], b = B[k]; o[k] = (typeof a==='number' && typeof b==='number') ? (k==='weight'||k==='band'||k==='oneWeight' ? a : angLerp(a,b,t)) : (a!==undefined ? a : b); } return o; }
  const F = n => n.toFixed(1);
  // a tapered limb: capsule from a (width wa) to b (width wb)
  function limb(a, b, wa, wb, fill){
    const dx = b[0]-a[0], dy = b[1]-a[1], len = Math.hypot(dx,dy)||1, nx = -dy/len, ny = dx/len;
    return `<path d="M${F(a[0]+nx*wa/2)} ${F(a[1]+ny*wa/2)} L${F(b[0]+nx*wb/2)} ${F(b[1]+ny*wb/2)} L${F(b[0]-nx*wb/2)} ${F(b[1]-ny*wb/2)} L${F(a[0]-nx*wa/2)} ${F(a[1]-ny*wa/2)}Z" fill="${fill}"/><circle cx="${F(a[0])}" cy="${F(a[1])}" r="${F(wa/2)}" fill="${fill}"/><circle cx="${F(b[0])}" cy="${F(b[1])}" r="${F(wb/2)}" fill="${fill}"/>`;
  }
  function shoe(a, ang, fill){
    // a trainer: rounded body along the foot direction with a white sole
    const r = rad(ang), ux = Math.cos(r), uy = Math.sin(r), nx = -uy, ny = ux;
    const s = n => n; const toe = [a[0]+ux*L.foot, a[1]+uy*L.foot];
    const heel = [a[0]-ux*4, a[1]-uy*4];
    const P = (p,k) => `${F(p[0]+nx*k)} ${F(p[1]+ny*k)}`;
    return `<path d="M${P(heel,-5)} L${P(toe,-2.5)} Q${F(toe[0]+ux*4)} ${F(toe[1]+uy*4)} ${P(toe,3.5)} L${P(heel,4.5)} Z" fill="${fill}"/><path d="M${P(heel,3.2)} L${P(toe,2.6)}" stroke="var(--fig-sole)" stroke-width="2.4" stroke-linecap="round"/>`;
  }
  function dumbbell(h, ang){
    return `<g transform="translate(${F(h[0])} ${F(h[1])}) rotate(${F(ang||0)})"><rect x="-10" y="-2.5" width="20" height="5" rx="2" fill="var(--fig-iron-2)"/><rect x="-14" y="-7" width="7" height="14" rx="2.5" fill="var(--fig-iron)"/><rect x="7" y="-7" width="7" height="14" rx="2.5" fill="var(--fig-iron)"/></g>`;
  }
  function draw(P, opt){
    P = norm(P); const J = joints(P);
    const pick = {ankle:J.near.a, toe:J.near.toe, hip:J.hip, shoulder:J.sh, hand:J.nearArm.h, head:J.hd, knee:J.near.k, farknee:J.far.k, farankle:J.far.a};
    const an = pick[opt.anchor||'ankle']; const dx = opt.at[0]-an[0], dy = opt.at[1]-an[1];
    const T = p => [p[0]+dx, p[1]+dy];
    const hip = T(J.hip), sh = T(J.sh), nk = T(J.nk), hd = T(J.hd);
    const near = J.near, far = J.far, na = J.nearArm, fa = J.farArm;
    const out = [];
    if(P.band) out.push(`<path d="M${F(T(fa.h)[0])} ${F(T(fa.h)[1])} L${F(T(na.h)[0])} ${F(T(na.h)[1])}${opt.bandTo?` M${F(T(na.h)[0])} ${F(T(na.h)[1])} L${opt.bandTo[0]} ${opt.bandTo[1]}`:''}" stroke="var(--fig-band)" stroke-width="3" stroke-linecap="round" fill="none"/>`);
    // far side, darker
    out.push(limb(T(J.hip), T(far.k), 15, 11.5, 'var(--fig-legs-far)'), limb(T(far.k), T(far.a), 11.5, 8, 'var(--fig-legs-far)'), shoe(T(far.a), far.f, 'var(--fig-shoe-far)'));
    out.push(limb(sh, T(fa.e), 8.5, 7.5, 'var(--fig-skin-far)'), limb(T(fa.e), T(fa.h), 7, 6, 'var(--fig-skin-far)'));
    if(P.weight && !P.oneWeight) out.push(dumbbell(T(fa.h), P.dbAng));
    // ponytail behind the head
    const hn = ((J.hAng % 360) + 360) % 360, lying = hn > 225 && hn < 315;
    const pb = step(hd, J.hAng + 255, L.head*.88);
    const tail = lying ? 262 : (hn > 135 && hn < 225 ? 175 : 196);
    const pt = step(pb, tail, 15), pc = step(pb, tail + (lying ? -12 : 18), 8);
    out.push(`<path d="M${F(pb[0])} ${F(pb[1])} Q${F(pc[0])} ${F(pc[1])} ${F(pt[0])} ${F(pt[1])}" stroke="var(--fig-hair)" stroke-width="7" stroke-linecap="round" fill="none"/>`);
    // neck, torso (tank top with a waistband), leggings on hips
    out.push(limb(nk, sh, 7, 8, 'var(--fig-skin)'));
    const ta = rad(P.torso) + Math.PI/2, nx = Math.cos(ta), ny = Math.sin(ta);
    const mid = [(hip[0]+sh[0])/2, (hip[1]+sh[1])/2];
    out.push(`<path d="M${F(hip[0]+nx*10)} ${F(hip[1]+ny*10)} Q${F(mid[0]+nx*7.5)} ${F(mid[1]+ny*7.5)} ${F(sh[0]+nx*9.5)} ${F(sh[1]+ny*9.5)} Q${F(sh[0])} ${F(sh[1])} ${F(sh[0]-nx*9.5)} ${F(sh[1]-ny*9.5)} Q${F(mid[0]-nx*8.5)} ${F(mid[1]-ny*8.5)} ${F(hip[0]-nx*10)} ${F(hip[1]-ny*10)} Z" fill="url(#figtop)"/>`);
    out.push(limb(step(hip, P.torso+180, -1), step(hip, P.torso, 9), 21, 19, 'var(--fig-legs)').replace('<path', '<path opacity="1"'));
    // head: face, hair cap, ear
    const fwd = step(hd, J.hAng + 90, L.head*.98), nose = step(hd, J.hAng + 100, L.head*1.08);
    out.push(`<circle cx="${F(hd[0])}" cy="${F(hd[1])}" r="${L.head}" fill="var(--fig-skin)"/>`);
    out.push(`<circle cx="${F(nose[0])}" cy="${F(nose[1])}" r="2.6" fill="var(--fig-skin)"/>`);
    out.push(`<path d="M${F(step(hd,J.hAng+70,L.head)[0])} ${F(step(hd,J.hAng+70,L.head)[1])} A${L.head} ${L.head} 0 1 0 ${F(step(hd,J.hAng+200,L.head)[0])} ${F(step(hd,J.hAng+200,L.head)[1])} Q${F(hd[0])} ${F(hd[1])} ${F(step(hd,J.hAng+70,L.head)[0])} ${F(step(hd,J.hAng+70,L.head)[1])}Z" fill="var(--fig-hair)"/>`);
    const eye = step(hd, J.hAng + 72, L.head*.55);
    out.push(`<circle cx="${F(eye[0])}" cy="${F(eye[1])}" r="1.4" fill="var(--fig-hair)"/>`);
    // near leg, shoe
    out.push(limb(hip, T(near.k), 16, 12, 'var(--fig-legs)'), limb(T(near.k), T(near.a), 12, 8.5, 'var(--fig-legs)'), shoe(T(near.a), near.f, 'var(--fig-shoe)'));
    // near arm on top
    out.push(limb(sh, T(na.e), 9, 8, 'var(--fig-skin)'), limb(T(na.e), T(na.h), 7.5, 6.5, 'var(--fig-skin)'));
    if(P.weight) out.push(dumbbell(T(na.h), P.dbAng));
    return out.join('');
  }
  const DEFS = `<defs><linearGradient id="figtop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--g2)"/><stop offset="1" stop-color="var(--g3)"/></linearGradient></defs>`;
  function bbox(opt){
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    for(const P0 of [opt.a,opt.b,FIGMID(opt)]){ const J = joints(norm(P0));
      const pick = {ankle:J.near.a, toe:J.near.toe, hip:J.hip, shoulder:J.sh, hand:J.nearArm.h, head:J.hd, knee:J.near.k, farknee:J.far.k, farankle:J.far.a};
      const an = pick[opt.anchor||'ankle']; const dx = opt.at[0]-an[0], dy = opt.at[1]-an[1];
      const pts = [J.hip,J.sh,J.hd,J.near.k,J.near.a,J.near.toe,J.far.k,J.far.a,J.far.toe,J.nearArm.e,J.nearArm.h,J.farArm.e,J.farArm.h];
      pts.forEach(p=>{ const x=p[0]+dx, y=p[1]+dy; x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y); }); }
    if(opt.propBox){ const [a,b,c,d] = opt.propBox; x0=Math.min(x0,a); y0=Math.min(y0,b); x1=Math.max(x1,c); y1=Math.max(y1,d); }
    const pad = 18; x0-=pad; y0-=pad; x1+=pad; y1 = Math.max(y1+6, 152);
    let w = x1-x0, h = y1-y0; const R = 1.6;
    if(w/h < R){ const nw = h*R; x0 -= (nw-w)/2; w = nw; } else { const nh = w/R; y0 -= (nh-h); h = nh; }
    return [x0,y0,w,h];
  }
  const FIGMID = opt => { const o = {}; for(const k in opt.a){ o[k] = typeof opt.a[k]==='number' && typeof opt.b[k]==='number' ? (opt.a[k]+opt.b[k])/2 : opt.a[k]; } return o; };
  function svg(P, opt){ const fl = opt.floor||146; const vb = opt.a ? bbox(opt) : [0,0,240,160]; return `<svg viewBox="${vb.map(n=>n.toFixed(1)).join(' ')}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${opt.label||'Exercise demonstration'}">${DEFS}<rect x="-200" y="${fl}" width="640" height="60" fill="var(--fig-floor)"/><line x1="-200" y1="${fl}" x2="440" y2="${fl}" stroke="var(--line)" stroke-width="1.5"/>${opt.prop||''}<g class="figbody">${draw(P,opt)}</g>${opt.front||''}</svg>`; }
  const ease = t => t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
  let raf = null;
  function animate(el, spec){
    if(raf) cancelAnimationFrame(raf), raf = null;
    const g = el && el.querySelector('.figbody'); if(!g) return;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce){ g.innerHTML = draw(norm(spec.b), spec); return; }
    const A = norm(spec.a), B = norm(spec.b), once = spec.mode==='once';
    const dur = spec.dur || (once ? 1800 : 3400), t0 = performance.now();
    const tick = now => {
      if(!document.body.contains(el)){ raf = null; return; }
      let t;
      if(once){ t = ease(Math.min(1, (now - t0) / dur)); }
      else { const p = ((now - t0) % dur) / dur; t = p<.1 ? 0 : p<.45 ? ease((p-.1)/.35) : p<.58 ? 1 : 1-ease((p-.58)/.42); }
      g.innerHTML = draw(mix(A, B, t), spec);
      if(once && now - t0 >= dur){ raf = null; return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  return {svg, animate, draw, joints, norm};
})();

/* Poses. Floor at y = 146, figure faces right. a = start, b = end of the rep. */
const PROP = {
  sofa:'<rect x="18" y="100" width="70" height="46" rx="9" fill="var(--fig-prop)"/><rect x="18" y="92" width="70" height="14" rx="7" fill="var(--fig-prop-2)"/>',
  step:'<rect x="128" y="122" width="96" height="24" rx="5" fill="var(--fig-prop)"/>',
  chair:'<rect x="66" y="104" width="58" height="8" rx="3" fill="var(--fig-prop)"/><rect x="70" y="112" width="6" height="34" rx="2" fill="var(--fig-prop)"/><rect x="114" y="112" width="6" height="34" rx="2" fill="var(--fig-prop)"/><rect x="66" y="58" width="7" height="50" rx="3" fill="var(--fig-prop)"/>',
  mat:'<rect x="14" y="142" width="212" height="5" rx="2.5" fill="var(--fig-mat)"/>',
  wall:'<rect x="214" y="10" width="14" height="136" fill="var(--fig-prop)"/>',
  bench:'<rect x="112" y="102" width="104" height="10" rx="4" fill="var(--fig-prop-2)"/><rect x="120" y="112" width="8" height="34" fill="var(--fig-prop)"/><rect x="200" y="112" width="8" height="34" fill="var(--fig-prop)"/>',
  door:'<rect x="222" y="6" width="12" height="140" fill="var(--fig-prop)"/>'
};
const POSES = {
  squat:{anchor:'ankle', at:[116,140], a:{torso:3, thigh:181, shin:180, foot:90, upper:170, fore:22, weight:1, oneWeight:1, dbAng:90}, b:{torso:30, thigh:94, shin:203, foot:90, upper:158, fore:28, weight:1, oneWeight:1, dbAng:90}},
  boxsquat:{anchor:'ankle', at:[124,140], prop:PROP.sofa, propBox:[18,92,88,146], a:{torso:3, thigh:181, shin:180, foot:90, upper:170, fore:22, weight:1, oneWeight:1, dbAng:90}, b:{torso:28, thigh:100, shin:206, foot:90, upper:158, fore:28, weight:1, oneWeight:1, dbAng:90}},
  rdl:{anchor:'ankle', at:[118,140], a:{torso:2, thigh:183, shin:180, foot:90, upper:184, fore:182, weight:1, dbAng:0}, b:{torso:70, thigh:198, shin:186, foot:90, upper:178, fore:178, weight:1, dbAng:0}},
  kickrdl:{anchor:'ankle', at:[126,140], a:{torso:2, thigh:183, shin:180, foot:90, thigh2:200, shin2:190, foot2:120, upper:184, fore:182, weight:1, dbAng:0}, b:{torso:72, thigh:196, shin:186, foot:90, thigh2:205, shin2:194, foot2:122, upper:178, fore:178, weight:1, dbAng:0}},
  row:{anchor:'ankle', at:[110,140], a:{torso:56, thigh:198, shin:184, foot:90, upper:178, fore:178, weight:1, dbAng:0}, b:{torso:56, thigh:198, shin:184, foot:90, upper:262, fore:176, weight:1, dbAng:0}},
  onearm:{anchor:'ankle', at:[78,140], prop:PROP.bench, propBox:[112,102,216,146], a:{torso:84, thigh:188, shin:182, foot:90, thigh2:132, shin2:180, foot2:270, upper:180, fore:180, upper2:178, fore2:180, weight:1, oneWeight:1, dbAng:0}, b:{torso:84, thigh:188, shin:182, foot:90, thigh2:132, shin2:180, foot2:270, upper:262, fore:172, upper2:178, fore2:180, weight:1, oneWeight:1, dbAng:0}},
  split:{anchor:'ankle', at:[150,140], a:{torso:2, thigh:162, shin:184, foot:90, thigh2:214, shin2:200, foot2:150, upper:183, fore:182, weight:1, dbAng:0}, b:{torso:3, thigh:104, shin:178, foot:90, thigh2:186, shin2:258, foot2:175, upper:183, fore:182, weight:1, dbAng:0}},
  stepup:{anchor:'ankle', at:[156,116], prop:PROP.step, propBox:[128,122,224,146], a:{torso:12, thigh:122, shin:182, foot:90, thigh2:196, shin2:186, foot2:96, upper:192, fore:186, upper2:170, fore2:176}, b:{torso:2, thigh:180, shin:180, foot:90, thigh2:196, shin2:222, foot2:150, upper:186, fore:182, upper2:176, fore2:178}},
  press:{anchor:'ankle', at:[118,140], a:{torso:0, thigh:181, shin:180, foot:90, upper:150, fore:356, upper2:146, fore2:356, weight:1, dbAng:0}, b:{torso:0, thigh:181, shin:180, foot:90, upper:6, fore:2, upper2:4, fore2:0, weight:1, dbAng:0}},
  kneepush:{anchor:'knee', at:[62,138], prop:PROP.mat, a:{torso:62, neck:22, thigh:242, shin:268, foot:268, upper:172, fore:182}, b:{torso:80, neck:8, thigh:256, shin:268, foot:268, upper:228, fore:150}},
  thrust:{anchor:'shoulder', at:[70,100], prop:PROP.sofa, propBox:[18,92,88,146], a:{torso:302, neck:38, thigh:66, shin:176, foot:90, upper:150, fore:96, weight:1, oneWeight:1, dbAng:90}, b:{torso:272, neck:20, thigh:96, shin:182, foot:90, upper:150, fore:90, weight:1, oneWeight:1, dbAng:90}},
  bridge:{anchor:'shoulder', at:[58,131], prop:PROP.mat, a:{torso:270, neck:0, thigh:52, shin:158, foot:90, upper:100, fore:92}, b:{torso:250, neck:-8, thigh:98, shin:176, foot:90, upper:100, fore:92}},
  deadbug:{anchor:'hip', at:[124,126], prop:PROP.mat, a:{torso:270, neck:0, thigh:0, shin:90, foot:0, thigh2:0, shin2:90, foot2:0, upper:0, fore:0, upper2:0, fore2:0}, b:{torso:270, neck:0, thigh:78, shin:84, foot:60, thigh2:0, shin2:90, foot2:0, upper:0, fore:0, upper2:-80, fore2:-82}},
  march:{anchor:'ankle', at:[118,140], a:{torso:0, thigh:181, shin:180, foot:90, thigh2:112, shin2:184, foot2:100, upper:200, fore:150, upper2:162, fore2:176}, b:{torso:0, thigh:112, shin:184, foot:100, thigh2:181, shin2:180, foot2:90, upper:162, fore:176, upper2:200, fore2:150}},
  carry:{anchor:'ankle', at:[118,140], a:{torso:0, thigh:181, shin:180, foot:90, thigh2:128, shin2:186, foot2:100, upper:182, fore:181, weight:1, dbAng:0}, b:{torso:0, thigh:128, shin:186, foot:100, thigh2:181, shin2:180, foot2:90, upper:182, fore:181, weight:1, dbAng:0}},
  pallof:{anchor:'ankle', at:[110,140], a:{torso:0, thigh:183, shin:180, foot:90, upper:165, fore:45, upper2:165, fore2:45, band:1}, b:{torso:0, thigh:183, shin:180, foot:90, upper:92, fore:90, upper2:92, fore2:90, band:1}},
  pullapart:{anchor:'ankle', at:[110,140], a:{torso:0, thigh:182, shin:180, foot:90, upper:90, fore:90, upper2:90, fore2:90, band:1}, b:{torso:0, thigh:182, shin:180, foot:90, upper:60, fore:60, upper2:118, fore2:118, band:1}},
  facepull:{anchor:'ankle', at:[96,140], prop:PROP.door, propBox:[60,30,234,146], bandTo:[222,40], a:{torso:0, thigh:184, shin:180, foot:90, upper:72, fore:70, band:1}, b:{torso:0, thigh:184, shin:180, foot:90, upper:100, fore:330, band:1}},
  bandrow:{anchor:'ankle', at:[96,140], prop:PROP.door, propBox:[60,60,234,146], bandTo:[222,96], a:{torso:0, thigh:184, shin:180, foot:90, upper:104, fore:96, band:1}, b:{torso:0, thigh:184, shin:180, foot:90, upper:214, fore:92, band:1}},
  hops:{anchor:'toe', at:[132,146], a:{torso:4, thigh:186, shin:174, foot:130, upper:196, fore:168}, b:{torso:0, thigh:181, shin:181, foot:160, upper:190, fore:176}},
  jacks:{anchor:'ankle', at:[118,140], a:{torso:0, thigh:181, shin:180, foot:90, upper:182, fore:181, upper2:182, fore2:181}, b:{torso:0, thigh:181, shin:180, foot:90, upper:4, fore:2, upper2:356, fore2:358}},
  piri:{anchor:'ankle', at:[205,102], prop:PROP.mat+'<rect x="212" y="8" width="16" height="138" fill="var(--fig-prop)"/>', propBox:[60,40,228,146], a:{torso:270, neck:0, thigh:44, shin:90, foot:2, thigh2:22, shin2:120, foot2:150, upper:96, fore:92}, b:{torso:270, neck:0, thigh:30, shin:100, foot:4, thigh2:12, shin2:114, foot2:140, upper:96, fore:92}},
  piriseat:{anchor:'hip', at:[96,100], prop:PROP.chair, propBox:[60,56,126,146], a:{torso:0, thigh:92, shin:180, foot:90, thigh2:74, shin2:150, foot2:120, upper:158, fore:110}, b:{torso:34, neck:10, thigh:92, shin:180, foot:90, thigh2:74, shin2:150, foot2:120, upper:170, fore:126}},
  kneechest:{anchor:'shoulder', at:[56,135], prop:PROP.mat, a:{torso:270, neck:0, thigh:90, shin:90, foot:0, thigh2:90, shin2:90, foot2:0, upper:150, fore:100}, b:{torso:270, neck:0, thigh:90, shin:90, foot:0, thigh2:345, shin2:100, foot2:10, upper:40, fore:350}}
};

Object.assign(PROP, {
  wallL:'<rect x="-6" y="8" width="16" height="138" fill="var(--fig-prop)"/>',
  frameR:'<rect x="206" y="8" width="12" height="138" fill="var(--fig-prop)"/>'
});
Object.assign(POSES, {
  catcow:{anchor:'knee', at:[86,140], prop:PROP.mat, a:{torso:78, neck:-30, thigh:180, shin:270, foot:270, upper:180, fore:180}, b:{torso:80, neck:56, thigh:180, shin:270, foot:270, upper:180, fore:180}},
  thread:{anchor:'knee', at:[86,140], prop:PROP.mat, a:{torso:78, neck:-10, thigh:180, shin:270, foot:270, upper:4, fore:2, upper2:180, fore2:180}, b:{torso:92, neck:60, thigh:184, shin:270, foot:270, upper:226, fore:268, upper2:178, fore2:182}},
  wallangel:{anchor:'ankle', at:[40,140], prop:PROP.wallL, propBox:[-6,8,10,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:262, fore:0, upper2:262, fore2:0}, b:{torso:0, thigh:181, shin:180, foot:90, upper:338, fore:350, upper2:338, fore2:350}},
  doorway:{anchor:'ankle', at:[120,140], prop:PROP.wallL, propBox:[-6,8,10,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:268, fore:0, upper2:178, fore2:180}, b:{torso:12, neck:-8, thigh:172, shin:182, foot:90, upper:262, fore:352, upper2:178, fore2:180}},
  hipflexor:{anchor:'farknee', at:[92,140], prop:PROP.mat, a:{torso:0, thigh:88, shin:182, foot:90, thigh2:182, shin2:270, foot2:270, upper:180, fore:150}, b:{torso:-6, thigh:68, shin:196, foot:90, thigh2:208, shin2:270, foot2:270, upper:4, fore:2, upper2:180, fore2:160}},
  kneewall:{anchor:'ankle', at:[176,140], prop:PROP.mat+PROP.frameR, propBox:[60,8,218,146], a:{torso:4, thigh:88, shin:180, foot:90, thigh2:190, shin2:270, foot2:270, upper:96, fore:92}, b:{torso:10, thigh:74, shin:148, foot:90, thigh2:200, shin2:270, foot2:270, upper:92, fore:88}},
  squathold:{anchor:'ankle', at:[130,140], prop:PROP.frameR, propBox:[60,8,218,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:120, fore:90}, b:{torso:24, thigh:58, shin:214, foot:90, upper:88, fore:88}},
  hamfloss:{anchor:'shoulder', at:[56,131], prop:PROP.mat, a:{torso:270, neck:0, thigh:18, shin:104, foot:12, thigh2:90, shin2:90, foot2:0, upper:28, fore:52}, b:{torso:270, neck:0, thigh:6, shin:4, foot:96, thigh2:90, shin2:90, foot2:0, upper:22, fore:36}},
  calfraise:{anchor:'toe', at:[132,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:182, fore:181}, b:{torso:0, thigh:181, shin:180, foot:128, upper:182, fore:181}}
});
const EX_POSE = {goblet_box:'boxsquat', goblet_heavy:'squat', tempo_goblet:'squat', knee_push:'kneepush', hip_thrust:'thrust', rdl:'rdl', rdl_heavy:'rdl', kick_rdl:'kickrdl',
  dead_bug:'deadbug', split_squat:'split', tempo_split:'split', row:'row', one_arm_row:'onearm', step_up:'stepup', db_press:'press', pallof:'pallof', hops:'hops', carry:'carry',
  band_row:'bandrow', pull_apart:'pullapart', face_pull:'facepull', pause_bridge:'bridge', piri_wall:'piri', piri_sit:'piriseat', glute_str:'kneechest', supine_flex:'kneechest',
  march_warm:'march', pad_warm:'march', jacks:'jacks', jacks8:'jacks',
  cat_cow:'catcow', thread_needle:'thread', wall_angel:'wallangel', doorway_pec:'doorway', hip_flexor:'hipflexor', knee_wall:'kneewall', squat_hold:'squathold', ham_floss:'hamfloss', calf_raise:'calfraise'};
