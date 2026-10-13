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
    const arm = (u,f,ul,fl) => { const e = step(sh,u,L.upper*(ul??1)), h = step(e,f,L.fore*(fl??1)); return {e,h}; };
    return {hip, sh, nk, hd, hAng,
      near:leg(P.thigh,P.shin,P.foot??(P.shin-90)), far:leg(P.thigh2??P.thigh,P.shin2??P.shin,P.foot2??P.foot??((P.shin2??P.shin)-90)),
      nearArm:arm(P.upper,P.fore,P.ul,P.fl), farArm:arm(P.upper2??P.upper,P.fore2??P.fore,P.ul2??P.ul,P.fl2??P.fl)};
  }
  const lerp = (a,b,t) => a+(b-a)*t;
  const LIN = new Set(['lift','ul','ul2','fl','fl2','sway','arch']);
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
  function mix(A,B,t){ const o = {}; for(const k of new Set([...Object.keys(A),...Object.keys(B)])){ const a = A[k], b = B[k]; o[k] = (typeof a==='number' && typeof b==='number') ? (k==='weight'||k==='band'||k==='oneWeight' ? a : LIN.has(k) ? lerp(a,b,t) : angLerp(a,b,t)) : (a!==undefined ? a : b); } return o; }
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
  // where the figure sits: a named joint pinned to opt.at, or 'ground' = lowest sole on the surface at opt.at[1]
  function place(J, P, opt){
    if(opt.anchor==='ground'){
      const low = Math.max(J.near.a[1], J.near.toe[1], J.far.a[1], J.far.toe[1]) + 5;
      return [opt.at[0]-J.hip[0], opt.at[1]-low-(P.lift||0)];
    }
    const pick = {ankle:J.near.a, toe:J.near.toe, hip:J.hip, shoulder:J.sh, hand:J.nearArm.h, head:J.hd, knee:J.near.k, farknee:J.far.k, farankle:J.far.a};
    const an = pick[opt.anchor||'ankle']; return [opt.at[0]-an[0], opt.at[1]-an[1]-(P.lift||0)];
  }
  function draw(P, opt){
    P = norm(P);
    if(P.view==='front' || opt.view==='front') return drawFront(P, opt);
    const J = joints(P);
    const [dx, dy] = place(J, P, opt);
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
    const tail = lying ? 262 : (hn > 135 && hn < 225 ? 175 : 196) + (P.sway||0);
    const pt = step(pb, tail, 15), pc = step(pb, tail + (lying ? -12 : 18), 8);
    out.push(`<path d="M${F(pb[0])} ${F(pb[1])} Q${F(pc[0])} ${F(pc[1])} ${F(pt[0])} ${F(pt[1])}" stroke="var(--fig-hair)" stroke-width="7" stroke-linecap="round" fill="none"/>`);
    // neck, torso (tank top), leggings on hips
    out.push(limb(nk, sh, 7, 8, 'var(--fig-skin)'));
    const ta = rad(P.torso) + Math.PI/2, nx = Math.cos(ta), ny = Math.sin(ta);
    const mid = [(hip[0]+sh[0])/2 - nx*(P.arch||0)*2, (hip[1]+sh[1])/2 - ny*(P.arch||0)*2];
    out.push(`<path d="M${F(hip[0]+nx*10)} ${F(hip[1]+ny*10)} Q${F(mid[0]+nx*7.5)} ${F(mid[1]+ny*7.5)} ${F(sh[0]+nx*9.5)} ${F(sh[1]+ny*9.5)} Q${F(sh[0])} ${F(sh[1])} ${F(sh[0]-nx*9.5)} ${F(sh[1]-ny*9.5)} Q${F(mid[0]-nx*8.5)} ${F(mid[1]-ny*8.5)} ${F(hip[0]-nx*10)} ${F(hip[1]-ny*10)} Z" fill="url(#figtop)"/>`);
    out.push(limb(step(hip, P.torso+180, -1), step(hip, P.torso, 9), 21, 19, 'var(--fig-legs)'));
    // head: face, hair cap, eye
    const nose = step(hd, J.hAng + 100, L.head*1.08);
    out.push(`<circle cx="${F(hd[0])}" cy="${F(hd[1])}" r="${L.head}" fill="var(--fig-skin)"/>`);
    out.push(`<circle cx="${F(nose[0])}" cy="${F(nose[1])}" r="2.6" fill="var(--fig-skin)"/>`);
    const h70 = step(hd,J.hAng+70,L.head), h200 = step(hd,J.hAng+200,L.head);
    out.push(`<path d="M${F(h70[0])} ${F(h70[1])} A${L.head} ${L.head} 0 1 0 ${F(h200[0])} ${F(h200[1])} Q${F(hd[0])} ${F(hd[1])} ${F(h70[0])} ${F(h70[1])}Z" fill="var(--fig-hair)"/>`);
    const eye = step(hd, J.hAng + 72, L.head*.55);
    out.push(`<circle cx="${F(eye[0])}" cy="${F(eye[1])}" r="1.4" fill="var(--fig-hair)"/>`);
    // near leg, shoe
    out.push(limb(hip, T(near.k), 16, 12, 'var(--fig-legs)'), limb(T(near.k), T(near.a), 12, 8.5, 'var(--fig-legs)'), shoe(T(near.a), near.f, 'var(--fig-shoe)'));
    // near arm on top
    out.push(limb(sh, T(na.e), 9, 8, 'var(--fig-skin)'), limb(T(na.e), T(na.h), 7.5, 6.5, 'var(--fig-skin)'));
    if(P.weight) out.push(dumbbell(T(na.h), P.dbAng));
    return out.join('');
  }

  /* Front view, for moves that happen out to the sides (jacks, pull-aparts, wall angels).
     Angles for her left side (image right): 0 = up, 90 = out to the side, 180 = down. The other side mirrors
     unless upper2/fore2/thigh2/shin2 are given. ul/fl shorten the arm when it points at the viewer. */
  function frontJoints(P){
    const dir = (a, s) => [s*Math.sin(a*Math.PI/180), -Math.cos(a*Math.PI/180)];
    const side = s => {
      const r = s>0;
      const th = r ? P.thigh : (P.thigh2 ?? P.thigh), sn = r ? P.shin : (P.shin2 ?? P.shin);
      const up = r ? P.upper : (P.upper2 ?? P.upper), fo = r ? P.fore : (P.fore2 ?? P.fore);
      const ul = r ? (P.ul ?? 1) : (P.ul2 ?? P.ul ?? 1), fl = r ? (P.fl ?? 1) : (P.fl2 ?? P.fl ?? 1);
      const hj = [s*7, 2], k = [hj[0]+dir(th,s)[0]*L.thigh, hj[1]+dir(th,s)[1]*L.thigh], a = [k[0]+dir(sn,s)[0]*L.shin, k[1]+dir(sn,s)[1]*L.shin];
      const sh = [s*15, -L.torso+2], e = [sh[0]+dir(up,s)[0]*L.upper*ul, sh[1]+dir(up,s)[1]*L.upper*ul], h = [e[0]+dir(fo,s)[0]*L.fore*fl, e[1]+dir(fo,s)[1]*L.fore*fl];
      return {hj, k, a, sh, e, h};
    };
    return {R: side(1), Lf: side(-1), hd:[0, -L.torso - 5 - L.head]};
  }
  function drawFront(P, opt){
    const J = frontJoints(P);
    const low = Math.max(J.R.a[1], J.Lf.a[1]) + 7.5;
    const dx = opt.at[0], dy = opt.at[1] - low - (P.lift||0);
    const T = p => [p[0]+dx, p[1]+dy];
    const out = [];
    for(const [S, legC, shoeC] of [[J.Lf,'var(--fig-legs-far)','var(--fig-shoe-far)'],[J.R,'var(--fig-legs)','var(--fig-shoe)']]){
      out.push(limb(T(S.hj), T(S.k), 16, 12, legC), limb(T(S.k), T(S.a), 12, 8.5, legC));
      const a = T(S.a);
      out.push(`<rect x="${F(a[0]-6.5)}" y="${F(a[1]-1)}" width="13" height="8.5" rx="4" fill="${shoeC}"/><path d="M${F(a[0]-5.5)} ${F(a[1]+6.6)} H${F(a[0]+5.5)}" stroke="var(--fig-sole)" stroke-width="2.2" stroke-linecap="round"/>`);
    }
    const c = T([0,0]), x = c[0], y = c[1];
    out.push(`<rect x="${F(x-14)}" y="${F(y-8)}" width="28" height="16" rx="7" fill="var(--fig-legs)"/>`);
    out.push(limb(T([0,-L.torso-1]), T([0,-L.torso-7]), 7.5, 7.5, 'var(--fig-skin)'));
    out.push(`<path d="M${F(x-12.5)} ${F(y-2)} Q${F(x-10.5)} ${F(y-26)} ${F(x-14.5)} ${F(y-L.torso+2)} Q${F(x)} ${F(y-L.torso+6)} ${F(x+14.5)} ${F(y-L.torso+2)} Q${F(x+10.5)} ${F(y-26)} ${F(x+12.5)} ${F(y-2)} Z" fill="url(#figtop)"/>`);
    if(P.band) out.push(`<path d="M${F(T(J.Lf.h)[0])} ${F(T(J.Lf.h)[1])} L${F(T(J.R.h)[0])} ${F(T(J.R.h)[1])}" stroke="var(--fig-band)" stroke-width="3" stroke-linecap="round"/>`);
    for(const [S, col] of [[J.Lf,'var(--fig-skin-far)'],[J.R,'var(--fig-skin)']]){
      out.push(limb(T(S.sh), T(S.e), 9, 8, col), limb(T(S.e), T(S.h), 7.5, 6.5, col));
    }
    const h = T(J.hd), r = L.head;
    out.push(`<circle cx="${F(h[0])}" cy="${F(h[1])}" r="${r}" fill="var(--fig-skin)"/>`);
    out.push(`<path d="M${F(h[0]-r-.6)} ${F(h[1]+2)} A${r+.6} ${r+.6} 0 0 1 ${F(h[0]+r+.6)} ${F(h[1]+2)} Q${F(h[0]+7)} ${F(h[1]-6)} ${F(h[0])} ${F(h[1]-5.5)} Q${F(h[0]-7)} ${F(h[1]-6)} ${F(h[0]-r-.6)} ${F(h[1]+2)}Z" fill="var(--fig-hair)"/>`);
    out.push(`<circle cx="${F(h[0])}" cy="${F(h[1]-r-3)}" r="5.5" fill="var(--fig-hair)"/>`);
    out.push(`<circle cx="${F(h[0]-4.3)}" cy="${F(h[1]+1)}" r="1.4" fill="var(--fig-hair)"/><circle cx="${F(h[0]+4.3)}" cy="${F(h[1]+1)}" r="1.4" fill="var(--fig-hair)"/>`);
    return out.join('');
  }
  function pts(P0, opt){
    const P = norm(P0);
    if(P.view==='front' || opt.view==='front'){
      const J = frontJoints(P), low = Math.max(J.R.a[1], J.Lf.a[1]) + 7.5, dx = opt.at[0], dy = opt.at[1]-low-(P.lift||0);
      return [J.hd.map((v,i)=>i? v-L.head-9 : v), ...['R','Lf'].flatMap(k=>[J[k].a,J[k].k,J[k].sh,J[k].e,J[k].h,[J[k].a[0]+(k==='R'?7:-7),J[k].a[1]]])].map(p=>[p[0]+dx, p[1]+dy]);
    }
    const J = joints(P), [dx, dy] = place(J, P, opt);
    return [J.hip,J.sh,J.hd,J.near.k,J.near.a,J.near.toe,J.far.k,J.far.a,J.far.toe,J.nearArm.e,J.nearArm.h,J.farArm.e,J.farArm.h].map(p=>[p[0]+dx, p[1]+dy]);
  }
  const DEFS = `<defs><linearGradient id="figtop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--g2)"/><stop offset="1" stop-color="var(--g3)"/></linearGradient></defs>`;
  function bbox(opt){
    let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
    const poses = opt.gen ? [0,.125,.25,.375,.5,.625,.75,.875].map(opt.gen) : [opt.a,opt.b,FIGMID(opt)];
    for(const P0 of poses) pts(P0, opt).forEach(([x,y])=>{ x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y); });
    if(opt.propBox){ const [a,b,c,d] = opt.propBox; x0=Math.min(x0,a); y0=Math.min(y0,b); x1=Math.max(x1,c); y1=Math.max(y1,d); }
    const pad = 18; x0-=pad; y0-=pad; x1+=pad; y1 = Math.max(y1+6, 152);
    let w = x1-x0, h = y1-y0; const R = 1.6;
    if(w/h < R){ const nw = h*R; x0 -= (nw-w)/2; w = nw; } else { const nh = w/R; y0 -= (nh-h); h = nh; }
    return [x0,y0,w,h];
  }
  const FIGMID = opt => mix(norm(opt.a), norm(opt.b), .5);
  function svg(P, opt){ if(!P && opt.gen) P = opt.gen(opt.still ?? .2); const fl = opt.floor||146; const vb = (opt.a||opt.gen) ? bbox(opt) : [0,0,240,160]; return `<svg viewBox="${vb.map(n=>n.toFixed(1)).join(' ')}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${opt.label||'Exercise demonstration'}">${DEFS}<rect x="-200" y="${fl}" width="640" height="60" fill="var(--fig-floor)"/><line x1="-200" y1="${fl}" x2="440" y2="${fl}" stroke="var(--line)" stroke-width="1.5"/>${opt.prop||''}<g class="figbody">${draw(P,opt)}</g>${opt.front||''}</svg>`; }
  const ease = t => t<.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2;
  let raf = null;
  function animate(el, spec){
    if(raf) cancelAnimationFrame(raf), raf = null;
    const g = el && el.querySelector('.figbody'); if(!g) return;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(spec.gen){
      // continuous cycles (walking, hopping): the pose is a function of the phase
      if(reduce){ g.innerHTML = draw(spec.gen(spec.still ?? .2), spec); return; }
      const dur = spec.dur || 1100, t0 = performance.now();
      const tick = now => { if(!document.body.contains(el)){ raf = null; return; }
        g.innerHTML = draw(spec.gen(((now - t0) % dur) / dur), spec); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick); return;
    }
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
  return {svg, animate, draw, joints, norm, mix};
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
PROP.benchLong = '<rect x="44" y="104" width="160" height="10" rx="4" fill="var(--fig-prop-2)"/><rect x="54" y="114" width="8" height="32" fill="var(--fig-prop)"/><rect x="186" y="114" width="8" height="32" fill="var(--fig-prop)"/>';
const POSES = {
  squat:{anchor:'ankle', at:[116,140], a:{torso:3, thigh:181, shin:180, foot:90, upper:172, fore:46, weight:1, oneWeight:1, dbAng:90}, b:{torso:30, thigh:94, shin:203, foot:90, upper:160, fore:56, weight:1, oneWeight:1, dbAng:90}},
  boxsquat:{anchor:'ankle', at:[106,140], prop:PROP.sofa, propBox:[18,92,88,146], a:{torso:3, thigh:181, shin:180, foot:90, upper:172, fore:46, weight:1, oneWeight:1, dbAng:90}, b:{torso:26, thigh:112, shin:200, foot:90, upper:162, fore:58, weight:1, oneWeight:1, dbAng:90}},
  rdl:{anchor:'ankle', at:[118,140], a:{torso:1, neck:0, thigh:178, shin:182, foot:90, upper:182, fore:181, weight:1, dbAng:0}, b:{torso:66, neck:-6, thigh:148, shin:190, foot:90, upper:196, fore:196, weight:1, dbAng:0}},
  kickrdl:{anchor:'ankle', at:[126,140], a:{torso:1, thigh:178, shin:182, foot:90, thigh2:198, shin2:194, foot2:128, upper:182, fore:181, weight:1, dbAng:0}, b:{torso:66, neck:-6, thigh:148, shin:190, foot:90, thigh2:214, shin2:206, foot2:140, upper:196, fore:196, weight:1, dbAng:0}},
  row:{anchor:'ankle', at:[110,140], a:{torso:56, thigh:198, shin:184, foot:90, upper:178, fore:178, weight:1, dbAng:0}, b:{torso:56, thigh:198, shin:184, foot:90, upper:262, fore:176, weight:1, dbAng:0}},
  onearm:{anchor:'ankle', at:[78,140], prop:PROP.benchLong, propBox:[44,104,204,146], a:{torso:84, thigh:188, shin:182, foot:90, thigh2:162, shin2:270, foot2:255, upper:180, fore:180, upper2:178, fore2:180, weight:1, oneWeight:1, dbAng:0}, b:{torso:84, thigh:188, shin:182, foot:90, thigh2:162, shin2:270, foot2:255, upper:262, fore:172, upper2:178, fore2:180, weight:1, oneWeight:1, dbAng:0}},
  split:{anchor:'ankle', at:[150,140], a:{torso:2, thigh:162, shin:184, foot:90, thigh2:214, shin2:200, foot2:150, upper:183, fore:182, weight:1, dbAng:0}, b:{torso:3, thigh:104, shin:178, foot:90, thigh2:186, shin2:258, foot2:175, upper:183, fore:182, weight:1, dbAng:0}},
  stepup:{anchor:'ankle', at:[156,116], prop:PROP.step, propBox:[128,122,224,146], a:{torso:12, thigh:122, shin:182, foot:90, thigh2:196, shin2:186, foot2:96, upper:192, fore:186, upper2:170, fore2:176}, b:{torso:2, thigh:180, shin:180, foot:90, thigh2:178, shin2:181, foot2:90, upper:182, fore:181, upper2:178, fore2:180}},
  press:{anchor:'ankle', at:[118,140], a:{torso:0, thigh:181, shin:180, foot:90, upper:150, fore:356, upper2:146, fore2:356, weight:1, dbAng:0}, b:{torso:0, thigh:181, shin:180, foot:90, upper:6, fore:2, upper2:4, fore2:0, weight:1, dbAng:0}},
  kneepush:{anchor:'knee', at:[62,138], prop:PROP.mat, a:{torso:62, neck:22, thigh:242, shin:268, foot:268, upper:172, fore:182}, b:{torso:78, neck:8, thigh:256, shin:268, foot:268, upper:245, fore:132}},
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
  catcow:{anchor:'knee', at:[86,140], prop:PROP.mat, a:{torso:80, neck:-34, arch:7, thigh:180, shin:270, foot:270, upper:180, fore:180}, b:{torso:80, neck:34, arch:-5, thigh:180, shin:270, foot:270, upper:180, fore:180}},
  thread:{anchor:'knee', at:[86,140], prop:PROP.mat, a:{torso:78, neck:-10, thigh:180, shin:270, foot:270, upper:4, fore:2, upper2:180, fore2:180}, b:{torso:92, neck:60, thigh:184, shin:270, foot:270, upper:226, fore:268, upper2:178, fore2:182}},
  wallangel:{anchor:'ankle', at:[40,140], prop:PROP.wallL, propBox:[-6,8,10,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:262, fore:0, upper2:262, fore2:0}, b:{torso:0, thigh:181, shin:180, foot:90, upper:338, fore:350, upper2:338, fore2:350}},
  doorway:{anchor:'hand', at:[96,-14], prop:'<rect x="86" y="-40" width="11" height="186" fill="var(--fig-prop)"/>', propBox:[86,-40,97,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:268, ul:.35, fore:0, upper2:180, fore2:180}, b:{torso:4, neck:-4, thigh:164, shin:182, foot:90, thigh2:193, shin2:188, foot2:100, upper:266, ul:1, fore:2, upper2:180, fore2:178}},
  hipflexor:{anchor:'farknee', at:[92,140], prop:PROP.mat, a:{torso:0, thigh:88, shin:182, foot:90, thigh2:182, shin2:270, foot2:270, upper:180, fore:150}, b:{torso:-6, thigh:68, shin:196, foot:90, thigh2:208, shin2:270, foot2:270, upper:4, fore:2, upper2:180, fore2:160}},
  kneewall:{anchor:'ankle', at:[176,140], prop:PROP.mat+PROP.frameR, propBox:[60,8,218,146], a:{torso:4, thigh:88, shin:180, foot:90, thigh2:190, shin2:270, foot2:270, upper:96, fore:92}, b:{torso:10, thigh:74, shin:148, foot:90, thigh2:200, shin2:270, foot2:270, upper:92, fore:88}},
  squathold:{anchor:'ankle', at:[148,140], prop:PROP.frameR, propBox:[60,8,218,146], a:{torso:4, thigh:181, shin:180, foot:90, upper:104, fore:94}, b:{torso:24, thigh:58, shin:214, foot:90, upper:88, fore:88}},
  hamfloss:{anchor:'shoulder', at:[56,131], prop:PROP.mat, a:{torso:270, neck:0, thigh:352, shin:84, thigh2:90, shin2:90, foot2:0, upper:66, fore:66}, b:{torso:270, neck:0, thigh:352, shin:356, thigh2:90, shin2:90, foot2:0, upper:66, fore:66}},
  calfraise:{anchor:'toe', at:[132,146], a:{torso:0, thigh:181, shin:180, foot:90, upper:182, fore:181}, b:{torso:0, thigh:181, shin:180, foot:128, upper:182, fore:181}}
});
const EX_POSE = {goblet_box:'boxsquat', goblet_heavy:'squat', tempo_goblet:'squat', knee_push:'kneepush', hip_thrust:'thrust', rdl:'rdl', rdl_heavy:'rdl', kick_rdl:'kickrdl',
  dead_bug:'deadbug', split_squat:'split', tempo_split:'split', row:'row', one_arm_row:'onearm', step_up:'stepup', db_press:'press', pallof:'pallof', hops:'hops', carry:'carry',
  band_row:'bandrow', pull_apart:'pullapart', face_pull:'facepull', pause_bridge:'bridge', piri_wall:'piri', piri_sit:'piriseat', glute_str:'kneechest', supine_flex:'kneechest',
  march_warm:'march', pad_warm:'march', jacks:'jacks', jacks8:'jacks',
  cat_cow:'catcow', thread_needle:'thread', wall_angel:'wallangel', doorway_pec:'doorway', hip_flexor:'hipflexor', knee_wall:'kneewall', squat_hold:'squathold', ham_floss:'hamfloss', calf_raise:'calfraise'};

/* Continuous cycles. kp() eases between keyframes [phase, value] around a loop. */
const kp = (K, x) => { x = ((x % 1) + 1) % 1;
  for(let i=0;i<K.length-1;i++){ const [x0,v0] = K[i], [x1,v1] = K[i+1];
    if(x >= x0 && x <= x1){ const t = (x-x0)/(x1-x0||1), e = (1-Math.cos(Math.PI*t))/2; return v0 + (v1-v0)*e; } }
  return K[0][1]; };
function gait(o){
  o = Object.assign({stride:1, arm:16, elbow:24, lean:4}, o||{});
  const TH = [[0,-22],[.5,15],[.6,12],[.75,-12],[.88,-25],[1,-22]], KN = [[0,3],[.15,14],[.4,4],[.6,38],[.72,58],[.86,18],[.95,2],[1,3]];
  const FT = [[0,78],[.1,90],[.45,90],[.6,136],[.72,128],[.88,86],[1,78]];
  const leg = ph => { const th = 180 + kp(TH, ph)*o.stride; return {th, sh: th + kp(KN, ph), ft: kp(FT, ph)}; };
  const arm = ph => { const c = Math.cos(2*Math.PI*ph), up = 180 + o.arm*c; return {up, fo: up - o.elbow - 14*Math.max(0, -c)}; };
  return ph => { const n = leg(ph), f = leg(ph+.5), an = arm(ph), af = arm(ph+.5);
    return {torso:o.lean, neck:-o.lean, thigh:n.th, shin:n.sh, foot:n.ft, thigh2:f.th, shin2:f.sh, foot2:f.ft,
      upper:an.up, fore:an.fo, upper2:af.up, fore2:af.fo, sway:6*Math.sin(4*Math.PI*ph)}; };
}
function hopCycle(){
  // land soft, push through the toes, short flight
  const LIFT = [[0,0],[.18,0],[.32,4],[.5,13],[.68,4],[.8,0],[1,0]];
  const KNEE = [[0,14],[.15,20],[.32,4],[.5,0],[.7,2],[.82,16],[1,14]];
  const FOOT = [[0,90],[.2,90],[.34,128],[.5,140],[.68,126],[.8,92],[1,90]];
  return ph => { const k = kp(KNEE, ph), th = 180 - k*.7;
    return {torso:4 + k*.25, neck:-4, thigh:th, shin:th + k*1.6, foot:kp(FOOT, ph), upper:192 - k*.6, fore:150 - k, lift:kp(LIFT, ph)}; };
}
Object.assign(PROP, {
  pad:'<rect x="34" y="134" width="170" height="12" rx="6" fill="var(--fig-prop)"/><rect x="190" y="131" width="20" height="15" rx="6" fill="var(--fig-prop-2)"/><line class="belt" x1="44" y1="139.5" x2="186" y2="139.5" stroke="var(--fig-iron)" stroke-opacity=".35" stroke-width="2" stroke-dasharray="7 9"/>',
  road:'<line class="belt" x1="-200" y1="150" x2="440" y2="150" stroke="var(--fig-iron)" stroke-opacity=".3" stroke-width="2" stroke-dasharray="7 9"/>',
  wallBack:'<rect x="50" y="6" width="140" height="140" rx="4" fill="var(--fig-prop)" opacity=".6"/>'
});
Object.assign(POSES, {
  walk:{anchor:'ground', at:[116,134], gen:gait(), dur:1150, prop:PROP.pad, propBox:[34,131,210,146], label:'Walking on the pad'},
  walkfast:{anchor:'ground', at:[116,134], gen:gait({stride:1.12, arm:24, elbow:52, lean:7}), dur:900, prop:PROP.pad, propBox:[34,131,210,146]},
  walkout:{anchor:'ground', at:[118,146], gen:gait(), dur:1150, prop:PROP.road},
  carry:{anchor:'ground', at:[118,146], dur:1300, prop:PROP.road, gen:(g=>ph=>Object.assign(g(ph), {upper:182, fore:181, upper2:178, fore2:180, weight:1, dbAng:0}))(gait({stride:.8, arm:0, elbow:0, lean:0}))},
  hops:{anchor:'ground', at:[120,146], gen:hopCycle(), dur:700, still:.5},
  jacks:{view:'front', at:[120,146], dur:1400, a:{view:'front', thigh:178, shin:180, upper:172, fore:174}, b:{view:'front', thigh:160, shin:162, upper:28, fore:14, lift:0}},
  pullapart:{view:'front', at:[120,146], a:{view:'front', thigh:178, shin:180, upper:94, fore:94, ul:.28, fl:.18, band:1}, b:{view:'front', thigh:178, shin:180, upper:92, fore:92, ul:1, fl:1, band:1}},
  wallangel:{view:'front', at:[120,146], prop:PROP.wallBack, propBox:[50,6,190,146], a:{view:'front', thigh:176, shin:180, upper:100, fore:8}, b:{view:'front', thigh:176, shin:180, upper:32, fore:20}},
  facepull:{anchor:'ankle', at:[96,140], prop:PROP.door, propBox:[60,30,234,146], bandTo:[222,52], a:{torso:0, thigh:184, shin:180, foot:90, upper:66, fore:64, band:1}, b:{torso:0, thigh:184, shin:180, foot:90, upper:92, ul:.35, fore:12, band:1}},
  kneechest:{anchor:'shoulder', at:[56,135], prop:PROP.mat, mode:'once', a:{torso:270, neck:0, thigh:45, shin:150, foot:84, thigh2:45, shin2:150, foot2:84, upper:100, fore:96}, b:{torso:270, neck:-6, thigh:332, shin:118, foot:40, thigh2:45, shin2:150, foot2:84, upper:44, fore:62}}
});
Object.assign(EX_POSE, {pad_warm:'walk', pad_cool:'walk', pad_walk:'walk', pad_intervals:'walkfast', pad_iv8:'walkfast', walk_out:'walkout', march_cool:'march'});

/* Bodyweight versions for travel: same movement, no dumbbells. */
const unweighted = (k, arms) => { const p = POSES[k], strip = q => { const o = Object.assign({}, q, arms||{}); delete o.weight; delete o.oneWeight; delete o.dbAng; return o; };
  return Object.assign({}, p, {a: strip(p.a), b: strip(p.b)}); };
Object.assign(POSES, {
  chairsquat: Object.assign(unweighted('boxsquat', {upper:96, fore:94, upper2:96, fore2:94}), {prop: PROP.chair, propBox:[60,56,126,146]}),
  bwsplit: unweighted('split'),
  bwrdl: unweighted('rdl')
});
POSES.chairsquat.at = [130,140];
Object.assign(EX_POSE, {tr_squat:'chairsquat', tr_split:'bwsplit', tr_hinge:'bwrdl', tr_stepup:'stepup'});

for(let n=1;n<=7;n++) EX_POSE['run'+n] = n===7 ? 'walk' : 'walkfast';
for(let n=1;n<=7;n++) EX_POSE['fin'+n] = n===7 ? 'walk' : 'walkfast';
